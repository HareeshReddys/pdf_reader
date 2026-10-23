const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'by', 'for', 'from', 'i', 'in', 'is', 'it',
  'of', 'on', 'or', 'that', 'the', 'this', 'to', 'we', 'with', 'you', 'your',
]);

function tokens(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9+#.]{2,}/g)?.filter((token) => !STOP_WORDS.has(token)) ?? [];
}

export function resemblesDisplayedAnswer(transcript: string, answerContext: unknown): boolean {
  if (typeof answerContext !== 'string' || !answerContext.trim()) return false;
  const spoken = [...new Set(tokens(transcript))];
  if (spoken.length < 3) return false;
  const answer = new Set(tokens(answerContext));
  const matches = spoken.filter((token) => answer.has(token)).length;
  return matches >= 3 && matches / spoken.length >= 0.55;
}
