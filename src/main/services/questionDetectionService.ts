import { normalizeInterviewTerms } from './interviewVocabulary';

export type QuestionSource = 'manual' | 'transcript' | 'ocr' | 'history';

export type DetectedQuestion = {
  question: string;
  confidence: number;
  source: QuestionSource;
};

const QUESTION_OPENERS = /^(?:what|why|when|where|which|who|whose|how|can|could|would|will|do|does|did|is|are|am|was|were|should|have|has|had)\b/i;
const INTERVIEW_PROMPTS = /^(?:please\s+)?(?:define|describe|discuss|explain|compare|differentiate|outline|summarize|demonstrate|implement|write|show|tell\s+me(?:\s+about)?|(?:walk|talk)\s+me\s+through|give\s+me(?:\s+an?)?)\b/i;
const QUESTION_PHRASES = /\b(?:difference\s+between|advantages?\s+(?:and|or)\s+disadvantages?|pros\s+and\s+cons|use\s+cases?|trade[ -]?offs?|how\s+would\s+you|what\s+is|why\s+(?:do|does|is|are|would))\b/i;
const SPEAKER_PREFIX = /^(?:(?:interviewer|recruiter|hiring manager|candidate|speaker\s*\d*)\s*:\s*)/i;
const TIMESTAMP_PREFIX = /^\s*(?:\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*[-–—:]?\s*)/;
const LEADING_FILLER = /^(?:(?:um+|uh+|erm|hmm|okay|ok|oh|haan|han|yeah|yes|so|well|right|actually|basically|you know|then|next|also)\b[,.]?\s*)+/i;
const GENERIC_SPEECH_FRAGMENT = /^(?:what (?:do|did) you(?: all)? do|what you(?: all)? do|do you know|can you hear me|are you there|okay|right|so)[?.!]*$/i;
const TECHNICAL_TOPIC = /\b(?:api|array|async|await|aws|closure|css|database|docker|dom|flexbox|git|html|javascript|kubernetes|node(?:\.js)?|nosql|oop|promise|react|redux|sql|typescript|virtual|webhook)\b/i;
const DECLARATIVE_SPEECH = /\b(?:i|we|it|they|you|is|are|was|were|use|uses|used|means|allows|helps|works|provides|creates|returns|stores|handles|renders)\b/i;
const SPEECH_CORRECTIONS: Array<[RegExp, string]> = [
  [/\bvirtual\s+(?:down|dome|dawn)\b/gi, 'virtual DOM'],
  [/\b(?:watch|what'?s?)\s+(?:world|word)\s+dom\b/gi, 'virtual DOM'],
  [/\bflex\s+box\b/gi, 'flexbox'],
  [/\bflexbox\s+(?:and|in)\s+css\b/gi, 'CSS Flexbox'],
  [/\bget\s+(branch|merge|rebase|commit|cherry[ -]?pick)\b/gi, 'git $1'],
  [/^virtual\s+dom[.!]?$/gi, 'What is virtual DOM?'],
];

const ACKNOWLEDGEMENT_WORDS = new Set([
  'absolutely', 'accha', 'acha', 'correct', 'exactly', 'fine', 'good', 'got', 'great', 'haan', 'han',
  'hmm', 'is', 'it', 'nice', 'okay', 'ok', 'perfect', 'right', 'sounds', 'sure', 'that', 'thats',
  'theek', 'thik', 'understood', 'yes', 'yeah',
]);

export function isConversationalAcknowledgement(value: string): boolean {
  const normalized = value.toLowerCase().replace(/that's/g, 'that is');
  const words = normalized.match(/[a-z]+/g) ?? [];
  return words.length > 0 && words.length <= 8 && words.every((word) => ACKNOWLEDGEMENT_WORDS.has(word));
}

const SESSION_CHATTER = /\b(?:want one more|pause here|can you (?:come|say that) again|can you hear me|how are you|one moment|wait a second|next question[.!?]*$|thank you|you.re welcome)\b/i;
const ANSWER_OPENING = /^(?:(?:so|basically|usually|okay)[, ]+)*(?:i (?:will|would|think|use|used|have|am|was)|we (?:will|would|can|use|used|have|did|follow|created)|what (?:i|we) (?:think|did)|in (?:my|our) (?:case|project))\b/i;
const INCOMPLETE_END = /\b(?:and|or|whether|because|to|from|with|for|the|a|an|how|what|which|would|could|should|of|on|in|than)\s*[?.!…]*$/i;

export function isIncompleteInterviewQuestion(value: string): boolean {
  return INCOMPLETE_END.test(value.trim()) || /(?:\.\.\.|…)\s*$/.test(value.trim());
}
function hasQuestionIntent(text: string): boolean {
  if (INTERVIEW_PROMPTS.test(text)) return true;
  if (/^(?:what|which|whose)\s+(?!(?:i|we)\b)(?:(?:[a-z]+)\s+){0,5}(?:is|are|was|were|do|does|did|can|could|would|will|have|has|should)\b/i.test(text)) return true;
  if (/^(?:what|which)\s+(?:about|else)\b/i.test(text)) return true;
  if (/^(?:how|why|when|where|who)\s+(?:do|does|did|is|are|was|were|can|could|would|will|should|have|has)\b/i.test(text)) return true;
  return /^(?:can|could|would|will|do|does|did|is|are|should|have|has)\s+(?!(?:like|because|being|be|having|that|whether)\b)(?:you|we|it|they|this|there|the|a|an|[A-Z][a-z0-9.+-]*)\b/i.test(text);
}

/** Normalize speech/OCR noise without paraphrasing the question itself. */
export function cleanQuestionText(value: string): string {
  let result = value
    .normalize('NFKC')
    .replace(/\r/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  result = result
    .replace(TIMESTAMP_PREFIX, '')
    .replace(SPEAKER_PREFIX, '')
    .replace(LEADING_FILLER, '')
    .replace(/^["'“”‘’`\s*-]+/, '')
    .replace(/["'“”‘’`\s]+$/, '')
    .trim();

  result = normalizeInterviewTerms(result);
  for (const [pattern, replacement] of SPEECH_CORRECTIONS) result = result.replace(pattern, replacement);

  if (!result) return '';
  result = result[0].toUpperCase() + result.slice(1);
  if (hasQuestionIntent(result)) {
    result = /\.$/.test(result) ? `${result.slice(0, -1)}?` : result;
    if (!/[?!]$/.test(result)) result += '?';
  }
  return result;
}

function splitCandidates(text: string): string[] {
  const normalized = text.normalize('NFKC').replace(/\r/g, '\n').trim();
  if (!normalized) return [];

  const candidates: string[] = [];
  for (const line of normalized.split(/\n+/)) {
    // Split sentence punctuation only at a whitespace boundary so technical
    // tokens such as Node.js, React.js, and version numbers stay intact.
    const fragments = line.split(/(?<=[?!])\s+|(?<=\.)\s+(?=[A-Z])/);
    for (const fragment of fragments) {
      const cleaned = cleanQuestionText(fragment);
      if (!cleaned || SESSION_CHATTER.test(cleaned) || ANSWER_OPENING.test(cleaned)) continue;
      if (hasQuestionIntent(cleaned)) candidates.push(cleaned);
      else {
        // Keep scenario context before an embedded interviewer question. Do
        // not mistake a candidate's first-person explanation for a question.
        const embedded = cleaned.match(/\b(?:how|why|when|where|what|which)\s+(?:do|does|did|is|are|can|could|would|will|should)\b/i);
        if (embedded?.index !== undefined) {
          const question = cleanQuestionText(cleaned.slice(embedded.index));
          if (/\b(?:suppose|imagine|scenario|say a|if|as the|as a)\b/i.test(cleaned.slice(0, embedded.index))) candidates.push(`${cleaned.slice(0, embedded.index).trim()} ${question}`);
          else candidates.push(question);
        } else if (cleaned.split(/\s+/).length <= 4 && TECHNICAL_TOPIC.test(cleaned) && !DECLARATIVE_SPEECH.test(cleaned) && !/\b(?:from|to|for|of)\b/i.test(cleaned)) candidates.push(cleaned);
      }
    }
  }
  return candidates;
}

export function scoreInterviewQuestion(candidate: string): number {
  const text = cleanQuestionText(candidate);
  if (!text) return 0;

  const words = text.match(/[\p{L}\p{N}+#.-]+/gu) ?? [];
  if (words.length < 2) return 0;
  if (GENERIC_SPEECH_FRAGMENT.test(text) || SESSION_CHATTER.test(text) || ANSWER_OPENING.test(text) || isIncompleteInterviewQuestion(text)) return 0;

  let score = 0;
  if (/\?$/.test(text)) score += 0.42;
  if (QUESTION_OPENERS.test(text)) score += 0.35;
  if (INTERVIEW_PROMPTS.test(text)) score += 0.38;
  if (QUESTION_PHRASES.test(text)) score += 0.18;
  if (words.length >= 4 && words.length <= 35) score += 0.12;
  if (/\b(?:interview|experience|project|scenario|example)\b/i.test(text)) score += 0.06;
  if (!/[?]$/.test(text) && words.length <= 4 && TECHNICAL_TOPIC.test(text) && !DECLARATIVE_SPEECH.test(text)) score += 0.5;
  if (words.length > 60) score -= 0.25;

  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}

/** Returns every likely interview question in source order. */
export function detectInterviewQuestions(
  text: string,
  source: Extract<QuestionSource, 'transcript' | 'ocr'> = 'transcript',
): DetectedQuestion[] {
  return splitCandidates(text)
    .map((question) => ({ question, confidence: scoreInterviewQuestion(question), source }))
    .filter((candidate) => candidate.confidence >= 0.45);
}

/** The most recent high-scoring question is normally the active spoken question. */
export function detectLatestInterviewQuestion(
  text: string,
  source: Extract<QuestionSource, 'transcript' | 'ocr'> = 'transcript',
): DetectedQuestion | null {
  const candidates = detectInterviewQuestions(text, source);
  if (candidates.length === 0) return null;

  return candidates.reduce((best, candidate, index) => {
    const bestIndex = candidates.indexOf(best);
    return candidate.confidence > best.confidence
      || (candidate.confidence === best.confidence && index > bestIndex)
      ? candidate
      : best;
  });
}
