const assert = require('node:assert/strict');
const { app } = require('electron');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-turns-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  let release;
  let calls = 0;
  try {
    // Controlled inference tests scheduling and races without any remote calls.
    const answerService = require('../dist/main/services/answerService');
    answerService.prepareAnswer = async (question, snippets) => {
      calls++;
      if (question.split('\n')[0].includes('GraphQL')) await new Promise(resolve => { release = resolve; });
      return { answer: `## Prepared answer\n\n- ${question}`, snippets, generationMode: 'reference' };
    };
    const turns = require('../dist/main/services/assistTurnService');
    const overlay = require('../dist/main/services/overlayService');
    const { detectInterviewQuestions } = require('../dist/main/services/questionDetectionService');
    const { listCallAudioSources } = require('../dist/main/services/callAudioService');
    const falseQuestions = [
      'Where the app requires an update in order to get a new API.',
      'Will be having a different response.',
      'Is like it depends on whether that issue is related to regulatory or is it related to',
      'Want one more or pause here?',
      'I will first understand what exactly the APIs are and how this dashboard is loading.',
      'So we will be having versions in the endpoint itself.',
      'How often this dashboard is changing if it has to be updated every time that I have to',
      'Off-flow from login to protected API call.',
      'Is fraud safe and...',
      'Can you come again?',
      'No, no, no, no, no, no, no, no.',
    ];
    for (const text of falseQuestions) assert.deepEqual(detectInterviewQuestions(text), [], text);
    const realQuestions = [
      "How do you think about versioning and backward compatibility so that you don't break existing consumers?",
      "If JWTs are stateless, how would you then log out?",
      "Nice, that's the right principle. One more thing, how would you test that setup?",
      "Suppose your React app makes five API calls and is slow. As the tech lead, how do you find the bottleneck?",
      "Where do you store tokens and what's your refresh strategy?",
    ];
    for (const text of realQuestions) assert.ok(detectInterviewQuestions(text).length, text);
    turns.configureAssistTurn(true);
    overlay.updateOverlaySuggestion({ question: 'Original question', answer: 'Original answer being read', snippets: [], generationMode: 'reference', confidence: 'high', followUpQuestion: '' });
    const mic = { audioSource: 'microphone', capturedAt: Date.now() + 1 };
    turns.ingestAssistTranscript('What is CSS Flexbox?', mic);
    await delay(1500);
    await turns.waitForAssistAnswers();
    assert.equal(calls, 1); assert.ok(overlay.getOverlayState().answer.includes('Flexbox'));
    const stable = overlay.getOverlayState().answer;
    const actualNow = Date.now;
    Date.now = () => actualNow() + 60_000;
    turns.ingestAssistTranscript('What is CSS Flexbox?', { audioSource: 'microphone', capturedAt: Date.now() + 1 });
    turns.confirmAssistQuestion(); await turns.waitForAssistAnswers();
    assert.equal(calls, 1, 'Same question must remain deduplicated beyond 30 seconds');
    Date.now = actualNow;
    turns.ingestAssistTranscript('What is CSS Flexbox?', mic); turns.confirmAssistQuestion(); await turns.waitForAssistAnswers();
    assert.equal(calls, 1, 'Repeated question must not regenerate the answer');
    assert.equal(turns.getAssistTurnState().pendingQuestion, undefined);
    for (const text of falseQuestions) turns.ingestAssistTranscript(text, mic);
    assert.equal(overlay.getOverlayState().answer, stable);
    turns.setAssistAnswerHold(true);
    turns.ingestAssistTranscript('Explain React hooks?', { audioSource: 'system', capturedAt: Date.now() + 1 });
    await delay(1500); assert.equal(calls, 1); assert.equal(overlay.getOverlayState().answer, stable);
    turns.setAssistAnswerHold(false);
    turns.ingestAssistTranscript('Explain Redis?', { audioSource: 'system', capturedAt: 1 });
    await delay(1500); assert.equal(calls, 1, 'Queued audio from before resume must be ignored');
    turns.ingestAssistTranscript('What is CSS Grid?', { audioSource: 'system', capturedAt: Date.now() + 1 });
    turns.ingestAssistTranscript('How does it differ from Flexbox?', { audioSource: 'system', capturedAt: Date.now() + 1 });
    await delay(1500); await turns.waitForAssistAnswers();
    assert.equal(calls, 2, 'Multipart interviewer question must yield one answer');
    assert.ok(overlay.getOverlayState().answer.includes('CSS Grid') && overlay.getOverlayState().answer.includes('Flexbox'));
    turns.ingestAssistTranscript('What is GraphQL?', { audioSource: 'system', capturedAt: Date.now() + 1 });
    await delay(1500); assert.equal(calls, 3);
    turns.setAssistAnswerHold(true); const heldAnswer = overlay.getOverlayState().answer;
    release(); await turns.waitForAssistAnswers();
    assert.equal(overlay.getOverlayState().answer, heldAnswer, 'In-flight result cannot overwrite held answer');
    turns.setAssistAnswerHold(false);
    turns.ingestAssistTranscript('Explain CSS Grid and', { audioSource: 'system', capturedAt: Date.now()+1, utteranceComplete: false });
    await delay(1500); assert.equal(calls, 3, 'A forced audio split must not trigger inference');
    turns.ingestAssistTranscript('how it differs from Flexbox?', { audioSource: 'system', capturedAt: Date.now()+1, utteranceComplete: true });
    await delay(1500); await turns.waitForAssistAnswers(); assert.equal(calls, 4);
    assert.ok(overlay.getOverlayState().answer.includes('CSS Grid') && overlay.getOverlayState().answer.includes('Flexbox'));
    turns.configureAssistTurn(false);
    const sources = await listCallAudioSources();
    assert.ok(sources.every(source => source.id.endsWith('.monitor') || source.id === 'windows-loopback'), 'Physical microphones must never be listed as call outputs');
    console.log('PASS: false questions rejected, mic questions auto-answer, answer hold, stale audio, multipart turns, duplicate protection, late-inference suppression, and monitor-only source selection.');
    app.quit();
  } catch (error) { console.error(error); app.exit(1); }
  finally { await fs.rm(directory, { recursive: true, force: true }); }
});
