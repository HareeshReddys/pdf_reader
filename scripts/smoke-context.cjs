const { app } = require('electron');

app.whenReady().then(async () => {
  process.env.OPENAI_API_KEY = 'your_api_key_here';
  try {
    const { detectInterviewQuestions, isConversationalAcknowledgement } = require('../dist/main/services/questionDetectionService.js');
    const { runContextEngine } = require('../dist/main/services/contextEngine.js');
    const { getLocalTranscriptionModel, transcribeAudio } = require('../dist/main/services/transcriptionService.js');
    const { resemblesDisplayedAnswer } = require('../dist/main/services/responseGuardService.js');
    const { getOverlayState, updateOverlaySuggestion } = require('../dist/main/services/overlayService.js');

    const detected = detectInterviewQuestions(
      'Interviewer: Tell me about JavaScript closures? Then explain lexical scope.',
      'transcript',
    );
    if (detected.length < 2) throw new Error('Transcript question detection missed an interview prompt.');

    const context = await runContextEngine({ manualQuestion: 'Explain JavaScript closures and lexical scope' });
    if (context.generationMode !== 'reference' || !context.answer.includes('A closure means an inner function')) {
      throw new Error('Context engine did not preserve the local reference answer.');
    }
    if (!context.followUpQuestion || context.confidence !== 'high') {
      throw new Error('Context engine did not provide follow-up and confidence metadata.');
    }

    const virtualDom = detectInterviewQuestions('What is virtual down?', 'transcript')[0];
    if (virtualDom?.question !== 'What is virtual DOM?') throw new Error('Speech correction missed Virtual DOM.');
    if (detectInterviewQuestions('What you all do?', 'transcript').length !== 0) {
      throw new Error('A generic speech fragment was incorrectly treated as an interview question.');
    }
    const flexbox = detectInterviewQuestions('Flexbox and CSS.', 'transcript')[0];
    const flexboxContext = flexbox ? await runContextEngine({ manualQuestion: flexbox.question }) : null;
    if (flexboxContext?.generationMode !== 'reference' || !flexboxContext.answer.includes('CSS Flexbox')) {
      throw new Error('The short Flexbox topic did not retrieve its reference answer.');
    }
    if (!resemblesDisplayedAnswer(
      'The virtual DOM is a lightweight JavaScript representation of the real DOM.',
      'The Virtual DOM is a lightweight JavaScript representation of the real DOM used by React.',
    )) throw new Error('Candidate answer repetition was not suppressed.');
    if (resemblesDisplayedAnswer('Can you explain CSS Grid?', flexboxContext.answer)) {
      throw new Error('A distinct interviewer question was incorrectly suppressed.');
    }
    for (const acknowledgement of ['Okay.', 'Haan', 'Okay, that is good.', 'Yeah, sounds good.']) {
      if (!isConversationalAcknowledgement(acknowledgement)) throw new Error(`Acknowledgement was not ignored: ${acknowledgement}`);
    }
    const prismaPrompt = detectInterviewQuestions('Okay, tell me about Prisma.', 'transcript')[0];
    const prismaContext = prismaPrompt ? await runContextEngine({ manualQuestion: prismaPrompt.question }) : null;
    if (prismaContext?.generationMode !== 'reference' || !prismaContext.answer.startsWith('## Prisma; Prisma ORM;')) {
      throw new Error('Broad Prisma question did not select the general Prisma ORM section.');
    }
    updateOverlaySuggestion({
      question: prismaContext.question,
      answer: prismaContext.answer,
      snippets: prismaContext.snippets,
      generationMode: prismaContext.generationMode,
      followUpQuestion: prismaContext.followUpQuestion,
      confidence: prismaContext.confidence,
    });
    if (getOverlayState().answer !== prismaContext.answer) throw new Error('Overlay did not preserve the exact source answer.');

    const { searchNotes } = require('../dist/main/services/knowledgeService.js');
    const { prepareAnswer } = require('../dist/main/services/answerService.js');
    const resumePrompts = [
      ['Tell me about your previous experience on share psi, what you did in share psi?', 'SharesEye', 'Bewino'],
      ['Tell me about your experience with GEICO, what you did and what are your responsibilities, roles and responsibilities in GEICO project?', 'GEICO', 'Cognizant'],
      ['What is Ara?', 'AURA', 'Autonomous Unified Reliability Agent'],
      ['Tell me about your experience on says PSI?', 'SharesEye', 'Bewino'],
      ['Explain ShareSci?', 'SharesEye', 'Bewino'],
    ];
    for (const [transcript, name, expected] of resumePrompts) {
      const detectedResume = detectInterviewQuestions(transcript, 'transcript')[0];
      if (!detectedResume?.question.includes(name)) throw new Error(`Resume speech name was not normalized: ${transcript}`);
      const resumeContext = await runContextEngine({ latestTranscript: transcript }, {
        search: searchNotes,
        answer: async (question, snippets) => {
          if (snippets[0]?.fileName !== 'Reference · personal.md') throw new Error(`Resume question incorrectly routed to CLI: ${question}`);
          return prepareAnswer(question, snippets);
        },
      });
      if (!resumeContext.answer.includes(expected) || resumeContext.answer !== resumeContext.snippets[0].content) throw new Error(`Resume context was not returned verbatim: ${transcript}`);
    }

    let invalidAudioHandled = false;
    try {
      await transcribeAudio({ bytes: [1, 2, 3], mimeType: 'audio/webm', durationMs: 1000 });
    } catch (error) {
      invalidAudioHandled = error instanceof Error && error.message.includes('Local transcription requires WAV audio');
    }
    if (!invalidAudioHandled) throw new Error('Local transcription did not reject unsupported audio.');
    if (!getLocalTranscriptionModel().includes('whisper')) throw new Error('The local Whisper model is not configured.');

    console.log(JSON.stringify({
      result: 'passed',
      detectedQuestions: detected.map((item) => item.question),
      contextMode: context.generationMode,
      confidence: context.confidence,
      virtualDomQuestion: virtualDom.question,
      flexboxSource: flexboxContext.snippets[0]?.fileName,
      candidateResponseGuard: true,
      acknowledgementsIgnored: true,
      prismaHeading: prismaContext.answer.match(/^##\s+([^\n]+)/)?.[1],
      overlayVerbatim: true,
      localTranscriptionModel: getLocalTranscriptionModel(),
      invalidAudioHandled,
    }, null, 2));
    app.quit();
  } catch (error) {
    console.error(error);
    app.exit(1);
  }
});
