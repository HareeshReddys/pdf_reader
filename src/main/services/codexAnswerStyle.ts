import { INTERVIEW_ANSWER_STYLE } from '../../shared/interviewAnswerStyle';
export type CodexAnswerStyle = 'brief' | 'detailed';

export function getCodexAnswerStyle(): CodexAnswerStyle {
  return process.env.CODEX_ANSWER_STYLE?.trim().toLowerCase() === 'detailed' ? 'detailed' : 'brief';
}

export function codexResponseInstructions(style: CodexAnswerStyle): string {
  const format = style === 'brief'
    ? 'Keep the first answer concise; expand when asked.'
    : 'For detailed mode, expand relevant reasoning and examples to 200–300 words when needed, while keeping the same direct spoken style.';
  return `Response format (takes precedence over length and layout in scenario guidance): ${INTERVIEW_ANSWER_STYLE} ${format} Use a fenced code block when useful. For coding tasks, provide complete working code with a brief approach, complexity, edge cases and tests; do not truncate code to fit the word target. When asked to write a prompt, return the requested prompt. Never sacrifice factual grounding for brevity.`;
}
