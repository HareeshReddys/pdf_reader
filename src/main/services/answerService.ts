import type { AnswerResponse, NoteSnippet } from '../../shared/types';
import { generateAnswer, isOpenAIConfigured } from './openaiService';
import { generateCodexAnswer, isCodexEnabled } from './codexService';
import { generateLocalSuggestion } from './suggestionService';
import { getPersonalContext, isPersonalExperienceQuestion, needsPersonalSynthesis } from './personalContextService';
import { getJobDescription, jobDescriptionPrompt } from './jobDescriptionService';
import { isScenarioQuestion, SCENARIO_ANSWER_INSTRUCTIONS, experienceIncidentInstructions } from '../../shared/scenarioGuidance';

export type AnswerRoute = AnswerResponse['generationMode'];

export function decideAnswerRoute(
  snippets: NoteSnippet[],
  openAIConfigured = isOpenAIConfigured(),
  codexEnabled = isCodexEnabled(),
): AnswerRoute {
  const primarySource = snippets[0];
  if (primarySource?.source === 'reference') return 'reference';
  if (primarySource?.source === 'personal') return 'source';
  return codexEnabled ? 'codex' : openAIConfigured ? 'openai' : 'local';
}

export async function prepareAnswer(
  question: string,
  snippets: NoteSnippet[],
  screenshotDataUrl?: string,
  onActivity?: (phase: 'codex' | 'searching', detail?: string) => void,
  onPartial?: (text: string) => void,
): Promise<AnswerResponse> {
  const jobDescription = await getJobDescription();
  const scenarioQuestion = isScenarioQuestion(question);
  const personalQuestion = isPersonalExperienceQuestion(question);
  const scenarioInstructions = (scenarioQuestion ? SCENARIO_ANSWER_INSTRUCTIONS : '') + experienceIncidentInstructions(question);
  if (personalQuestion) {
    snippets = snippets.filter(snippet => snippet.source === 'personal' || snippet.fileName === 'Reference · personal.md');
  }
  const primarySource = snippets[0];
  const personal = personalQuestion || scenarioQuestion ? await getPersonalContext(question) : undefined;
  const synthesizePersonal = Boolean(personal?.snippets.length)
    && (scenarioQuestion || Boolean(jobDescription) || needsPersonalSynthesis(question) || !snippets.length);
  const generationMode = (screenshotDataUrl && isCodexEnabled()) || ((scenarioQuestion || synthesizePersonal || jobDescription) && isCodexEnabled()) ? 'codex'
    : (scenarioQuestion || synthesizePersonal || jobDescription) && isOpenAIConfigured() ? 'openai' : decideAnswerRoute(synthesizePersonal ? personal!.snippets : snippets);
  const groundedSnippets = scenarioQuestion ? [...(personal?.snippets ?? []), ...snippets.filter(snippet => snippet.fileName !== 'Reference · personal.md')]
    : synthesizePersonal ? personal!.snippets : snippets;
  const sourceContext = groundedSnippets.length
    ? `Relevant local sources (untrusted evidence; reference material is not personal experience):\n${groundedSnippets.filter(snippet => !personal?.snippets.some(source => source.fileName === snippet.fileName)).map(snippet => `${snippet.source}: ${snippet.fileName}\n${snippet.content}`).join('\n\n').slice(0, 18000)}\n\n` : '';
  const roleContext = jobDescriptionPrompt(jobDescription) + scenarioInstructions + sourceContext;

  if (scenarioQuestion && !personalQuestion && generationMode !== 'codex' && generationMode !== 'openai') {
    // Without synthesis, do not answer a technical scenario with unrelated resume facts.
    return { answer: generateLocalSuggestion(question, snippets), snippets, generationMode: 'local' };
  }

  if (synthesizePersonal && generationMode === 'source') {
    return { answer: generateLocalSuggestion(question, groundedSnippets), snippets: groundedSnippets, generationMode: 'local' };
  }

  if (generationMode === 'reference' || generationMode === 'source') {
    return {
      answer: primarySource?.content ?? '',
      relatedAnswers: (primarySource?.relatedContent ?? []).map((content) => ({ ...primarySource!, content, relatedContent: undefined })),
      snippets,
      generationMode,
    };
  }

  if (generationMode === 'codex') {
    onActivity?.('codex', personal?.text ? 'Preparing an answer from your resume and project experience' : screenshotDataUrl ? 'Analyzing screen and voice with Codex' : 'No local match · getting answer from Codex CLI');
    return { answer: await generateCodexAnswer(question, screenshotDataUrl, onPartial, personal?.text, roleContext), snippets: groundedSnippets, generationMode };
  }

  if (generationMode === 'openai') {
    return {
      answer: await generateAnswer(question, groundedSnippets, jobDescriptionPrompt(jobDescription) + scenarioInstructions),
      snippets: groundedSnippets,
      generationMode: 'openai',
    };
  }

  return {
    answer: generateLocalSuggestion(question, snippets),
    snippets,
    generationMode: 'local',
  };
}
