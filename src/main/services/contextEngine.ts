import type { AnswerResponse, NoteSnippet, SessionItem } from '../../shared/types';
import { beginOverlayWork, updateOverlayActivity, updateOverlayPartial, updateOverlaySuggestion } from './overlayService';
import { prepareAnswer } from './answerService';
import { searchNotes } from './knowledgeService';
import {
  cleanQuestionText,
  detectLatestInterviewQuestion,
  scoreInterviewQuestion,
  type DetectedQuestion,
  type QuestionSource,
} from './questionDetectionService';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ContextEngineInput = {
  manualQuestion?: string;
  latestTranscript?: string;
  latestOcrText?: string;
  screenshotDataUrl?: string;
  isCurrent?: () => boolean;
  additionalContext?: string;
  previousHistory?: readonly Pick<SessionItem, 'question' | 'answer' | 'generationMode'>[];
};

export type ContextPlan = {
  question: string;
  questionSource: QuestionSource;
  questionConfidence: number;
};

export type ContextEngineResult = {
  question: string;
  snippets: NoteSnippet[];
  relatedAnswers?: NoteSnippet[];
  answer: string;
  generationMode: AnswerResponse['generationMode'];
  followUpQuestion: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  questionSource: QuestionSource;
};

export type ContextEngineDependencies = {
  search: (question: string, limit?: number) => Promise<NoteSnippet[]>;
  answer: (question: string, snippets: NoteSnippet[], screenshotDataUrl?: string, onActivity?: (phase: 'codex' | 'searching', detail?: string) => void, onPartial?: (text: string) => void) => Promise<AnswerResponse>;
};

const DEFAULT_DEPENDENCIES: ContextEngineDependencies = {
  search: searchNotes,
  answer: prepareAnswer,
};

const VAGUE_FOLLOW_UP = /^(?:and\s+)?(?:what|how|why|when|where|which|can|could|would|do|does|is|are)?\s*(?:about\s+)?(?:it|its|this|that|they|them|those|these)\b/i;

function manualCandidate(value: string | undefined): DetectedQuestion | null {
  const question = cleanQuestionText(value ?? '');
  if (!question) return null;
  return {
    question,
    confidence: Math.max(0.72, scoreInterviewQuestion(question)),
    source: 'manual',
  };
}

function historyCandidate(input: ContextEngineInput): DetectedQuestion | null {
  const latest = input.previousHistory?.[0];
  if (!latest) return null;
  const question = cleanQuestionText(latest.question);
  return question ? { question, confidence: 0.35, source: 'history' } : null;
}

/**
 * Select the active question without using a model. Manual input is authoritative;
 * otherwise the latest likely question in transcript/OCR wins. A vague manual
 * follow-up gets the previous question appended as search context.
 */
export function buildContextPlan(input: ContextEngineInput): ContextPlan | null {
  const manual = manualCandidate(input.manualQuestion);
  if (manual) {
    const previous = historyCandidate(input);
    if (previous && VAGUE_FOLLOW_UP.test(manual.question)) {
      return {
        question: `${manual.question.replace(/\?$/, '')} (Regarding: ${previous.question.replace(/\?$/, '')})?`,
        questionSource: 'manual',
        questionConfidence: 0.68,
      };
    }
    return {
      question: manual.question,
      questionSource: manual.source,
      questionConfidence: manual.confidence,
    };
  }

  const transcript = detectLatestInterviewQuestion(input.latestTranscript ?? '', 'transcript');
  if (transcript) {
    return {
      question: transcript.question,
      questionSource: transcript.source,
      questionConfidence: transcript.confidence,
    };
  }

  const ocr = detectLatestInterviewQuestion(input.latestOcrText ?? '', 'ocr');
  const fallback = ocr ?? historyCandidate(input);
  return fallback ? {
    question: fallback.question,
    questionSource: fallback.source,
    questionConfidence: fallback.confidence,
  } : null;
}

function topicFromAnswer(question: string, answer: string): string {
  const heading = answer.match(/^#{1,6}\s+([^\n;]+)/m)?.[1]?.trim();
  if (heading) return heading;
  return question
    .replace(/\?$/, '')
    .replace(/^(?:please\s+)?(?:tell me about|explain|describe|define|what is|what are)\s+/i, '')
    .trim();
}

export function createFollowUpQuestion(question: string, answer: string): string {
  const topic = topicFromAnswer(question, answer);
  return topic
    ? `Can you give a practical example of ${topic}?`
    : 'Can you give a practical example and explain the main trade-offs?';
}

export function calculateConfidence(
  questionConfidence: number,
  snippets: readonly NoteSnippet[],
  generationMode: AnswerResponse['generationMode'],
): { level: ConfidenceLevel; score: number } {
  const bestScore = snippets[0]?.score ?? 0;
  const sourceStrength = generationMode === 'reference' || generationMode === 'source'
    ? Math.min(1, 0.72 + bestScore / 100)
    : (generationMode === 'openai' || generationMode === 'codex') ? 0.58 : 0.28;
  const score = Number((questionConfidence * 0.45 + sourceStrength * 0.55).toFixed(2));
  return {
    level: score >= 0.75 ? 'high' : score >= 0.5 ? 'medium' : 'low',
    score,
  };
}

export async function runContextEngine(
  input: ContextEngineInput,
  dependencies: ContextEngineDependencies = DEFAULT_DEPENDENCIES,
): Promise<ContextEngineResult> {
  const plan = buildContextPlan(input);
  if (!plan) throw new Error('No interview question was found in the available context.');

  const version = beginOverlayWork(plan.question);
  try {
  const snippets = await dependencies.search(plan.question, 5);
  const response = await dependencies.answer(input.additionalContext ? `${plan.question}\n\nContext: ${input.additionalContext}` : plan.question, snippets, input.screenshotDataUrl, (phase, detail) => { if (input.isCurrent?.() !== false) updateOverlayActivity(phase, detail, version); }, (text) => { if (input.isCurrent?.() !== false) updateOverlayPartial(text, version); });
  const confidence = calculateConfidence(plan.questionConfidence, response.snippets, response.generationMode);

  const result = {
    question: plan.question,
    snippets: response.snippets,
    relatedAnswers: response.relatedAnswers,
    // prepareAnswer returns local reference and personal-note content verbatim.
    answer: response.answer,
    generationMode: response.generationMode,
    followUpQuestion: createFollowUpQuestion(plan.question, response.answer),
    confidence: confidence.level,
    confidenceScore: confidence.score,
    questionSource: plan.questionSource,
  };
  if (input.isCurrent?.() !== false) updateOverlaySuggestion(result, version);
  return result;
  } catch (error) {
    if (input.isCurrent?.() !== false) updateOverlayActivity('error', error instanceof Error ? error.message : 'Could not prepare an answer.', version);
    throw error;
  }
}
