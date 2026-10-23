/** Conservative local extraction: editable answers, consoles and navigation are
 * not question identity. Unknown layouts keep the current answer until Next. */
export function extractScreenQuestion(text: string): string {
  const lines = text.replace(/\r/g, '').split('\n').map(line => line.trim()).filter(Boolean);
  const start = /^(?:question\s*\d*\s*[:.)-]?\s*)?(?:what|how|why|when|where|which|explain|describe|compare|implement|write|design|create|find|given|you are given|suppose|imagine|calculate|build)\b/i;
  const heading = /^(?:#{1,6}\s*)?(?:problem(?: statement| description)?|question\s*\d*)\s*[:.)-]?$/i;
  const end = /^(?:your (?:answer|solution)|answer(?: area)?|solution|code editor|console|output|test (?:cases|results)|submit|run code|function\b|(?:const|let|var|import|export)\s|```)/i;
  const index = lines.findIndex(line => start.test(line) || heading.test(line));
  if (index < 0) return '';
  const result: string[] = [];
  for (const line of lines.slice(index, index + 20)) {
    if (end.test(line)) break;
    // Navigation, countdowns and clock text must not alter the problem identity.
    if (/^(?:\d{1,2}:\d{2}(?::\d{2})?|time (?:left|remaining).*|question \d+ of \d+|next|previous)$/i.test(line)) continue;
    if (heading.test(line)) continue;
    result.push(line);
    if (result.join(' ').length > 1800 || /[?]$/.test(line)) break;
  }
  const question = result.join(' ').slice(0, 2000);
  return question.length >= 16 ? question : '';
}

export function questionIdentity(question: string): string {
  return question.normalize('NFKC').toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}+#<>=!*/%\-]+/gu, ' ').trim();
}

export function sameScreenQuestion(left: string, right: string): boolean {
  const a = questionIdentity(left), b = questionIdentity(right);
  if (!a || !b) return false;
  if (a === b) return true;
  // Only tolerate very small OCR spelling noise in longer questions; changed
  // numbers and semantic operators always count as new requirements.
  if (a.length < 100 || b.length < 100) return false;
  const important = (text: string) => text.match(/\b(?:\d+|not|without|minimum|maximum|min|max|ascending|descending|first|last|before|after)\b/g)?.join('|') ?? '';
  if (important(a) !== important(b)) return false;
  const wordsA = a.split(' '), wordsB = b.split(' ');
  if (wordsA.length !== wordsB.length) return false;
  const differences = wordsA.filter((word, index) => word !== wordsB[index]);
  return differences.length === 1 && Math.abs(a.length - b.length) <= 1
    && wordsA.every((word, index) => word === wordsB[index] || word.length >= 6 && wordsB[index].length >= 6
      && [...word].filter((char, charIndex) => char !== wordsB[index][charIndex]).length <= 1);
}
