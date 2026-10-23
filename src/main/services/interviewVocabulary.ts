import { INTERVIEW_TERMS } from './interviewVocabularyCatalog';
import { normalizeResumeNames } from './resumeVocabulary';

/** Curated interview vocabulary. Ordinary words and ambiguous short acronyms
 * are never fuzzy-matched. Add observed aliases here, rather than rewriting
 * every vaguely similar word from the recognizer. */
type VocabularyEntry = {
  canonical: string;
  aliases: RegExp;
  context?: RegExp;
};
const SOFTWARE_CONTEXT = /\b(?:javascript|typescript|frontend|front.end|framework|library|component|hooks?|jsx|web|angular|redux|dom|rendering)\b/i;
const DATABASE_CONTEXT = /\b(?:database|queries|query|joins?|tables?|postgres|mysql|commands?|ddl|dml)\b/i;

const VOCABULARY: VocabularyEntry[] = [
  { canonical: 'React', aliases: /\b(?:react(?:\s*\.\s*|\s+)?(?:js|j'?s|j\s+s)|reactiveize|reactivize)\b/gi },
  { canonical: 'React', aliases: /\breactiveness\b/gi, context: SOFTWARE_CONTEXT },
  { canonical: 'Node.js', aliases: /\bnode(?:\s*\.\s*|\s+)(?:js|j'?s|j\s+s)\b/gi },
  { canonical: 'Next.js', aliases: /\bnext(?:\s*\.\s*|\s+)(?:js|j'?s|j\s+s)\b/gi },
  { canonical: 'Angular', aliases: /\bangular(?:\s*\.\s*|\s+)(?:js|j'?s|j\s+s)\b/gi },
  { canonical: 'JavaScript', aliases: /\bjava\s+script\b/gi },
  { canonical: 'TypeScript', aliases: /\btype\s+script\b/gi },
  { canonical: 'AWS', aliases: /\ba\s+w\s+s\b/gi },
  { canonical: 'CSS', aliases: /\b(?:c\s+s\s+s|see\s+ess\s+ess)\b/gi },
  { canonical: 'HTML', aliases: /\bh\s+t\s+m\s+l\b/gi },
  { canonical: 'SQL', aliases: /\bs\s+q\s+l\b/gi },
  { canonical: 'SQL', aliases: /\bsequel\b/gi, context: DATABASE_CONTEXT },
  { canonical: 'PostgreSQL', aliases: /\b(?:postgre(?:s|ss)?\s+(?:sql|sequel)|postgress|ostegrace\s+sql)\b/gi },
  { canonical: 'MySQL', aliases: /\bmy\s+(?:sql|sequel)\b/gi },
  { canonical: 'MongoDB', aliases: /\bmongo\s+(?:db|d\s+b)\b/gi },
  { canonical: 'Redis', aliases: /\bredis\b/gi },
  { canonical: 'Prisma', aliases: /\bbresma\b/gi },
  { canonical: 'ORM', aliases: /\b(?:o\s+r\s+m|object\s+relation(?:al)?\s+mapping)\b/gi },
  { canonical: 'Spring Boot', aliases: /\bspring\s+boot\b/gi },
  { canonical: 'Kubernetes', aliases: /\bkubernetes\b/gi },
  { canonical: 'Docker', aliases: /\bdocker\b/gi },
  { canonical: 'GraphQL', aliases: /\bgraph\s+(?:ql|q\s+l)\b/gi },
  { canonical: 'WebSocket', aliases: /\bweb\s+sockets?\b/gi },
  { canonical: 'Webhook', aliases: /\bweb\s+hooks?\b/gi },
  { canonical: 'JWT', aliases: /\bj\s+w\s+t\b/gi },
  { canonical: 'OAuth', aliases: /\bo\s+auth\b/gi },
  { canonical: 'CI/CD', aliases: /\bc\s+i\s*(?:and|\/)?\s*c\s+d\b/gi },
  { canonical: 'CDN', aliases: /\bc\s+d\s+n\b/gi },
  { canonical: 'Flexbox', aliases: /\bflex\s+box\b/gi },
  { canonical: 'virtual DOM', aliases: /\bvirtual\s+(?:down|dome|dawn)\b/gi },
  { canonical: 'Git', aliases: /\bget(?=\s+(?:branch|merge|rebase|commit|cherry[ -]?pick)\b)/gi },
  { canonical: 'cherry-pick', aliases: /\bcherry\s+pick\b/gi },
  { canonical: 'reconciliation', aliases: /\breconciliation\b/gi },
  { canonical: 'microservices', aliases: /\bmicro\s+services\b/gi },
];

const INTERVIEW_QUESTION = /\b(?:what|why|how|which|explain|describe|define|compare|differentiate|tell (?:me|us)|walk me|advantages?|disadvantages?)\b/i;
const TECHNICAL_CONTEXT = /\b(?:react|javascript|typescript|java|spring|frontend|backend|database|cloud|aws|api|framework|software|algorithm|security|testing|deployment|project|architecture|system design)\b/i;
const AMBIGUOUS_ALIASES = new Set(['content full', 'key cloak', 'snow flake', 'big oh', 'post man', 'play wright', 'terra form', 'data dog', 'use state', 'use effect', 'use memo', 'use context', 'use ref']);
const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliasRules = INTERVIEW_TERMS.flatMap((entry) => entry.aliases.map((alias) => ({
  canonical: entry.canonical,
  alias,
  pattern: new RegExp(`\\b${escapePattern(alias).replace(/ /g, '[\\s-]+')}\\b`, 'gi'),
}))).sort((a, b) => b.alias.length - a.alias.length);

// Decode spoken letter/digit names as sequences, never split ordinary words
// such as "as" into AWS. Longer acronyms run first to preserve HTTPS vs HTTP.
const LETTER_NAMES: Record<string, string> = {
  a: 'a|ay|eh', b: 'b|bee', c: 'c|see|cee', d: 'd|dee', e: 'e|ee',
  f: 'f|ef|eff', g: 'g|gee', h: 'h|aitch|haitch', i: 'i|eye', j: 'j|jay',
  k: 'k|kay', l: 'l|el|ell', m: 'm|em', n: 'n|en', o: 'o|oh', p: 'p|pee',
  q: 'q|cue|queue', r: 'r|ar', s: 's|ess', t: 't|tee', u: 'u|you',
  v: 'v|vee', w: 'w|double[ -]+(?:u|you)', x: 'x|ex', y: 'y|why', z: 'z|zee|zed',
  '0': '0|zero', '1': '1|one', '2': '2|two', '3': '3|three', '4': '4|four',
  '5': '5|five', '6': '6|six', '7': '7|seven', '8': '8|eight', '9': '9|nine',
};
const acronymRules = INTERVIEW_TERMS
  .filter((entry) => /^[A-Z][A-Z0-9]{2,}$/.test(entry.canonical) || ['S3', 'EC2', 'E2E'].includes(entry.canonical))
  .sort((a, b) => b.canonical.length - a.canonical.length)
  .map((entry) => ({ canonical: entry.canonical, pattern: new RegExp(`\\b${[...entry.canonical.toLowerCase()].map((letter) => `(?:${LETTER_NAMES[letter]})`).join('[\\s.-]+')}\\b`, 'gi') }));

// Long technical terms may have two recognition/spelling errors. Shorter
// terms allow one. Equal or near-equal competing candidates stay unchanged.
const fuzzyTerms = [...new Set([
  ...INTERVIEW_TERMS.map((entry) => entry.canonical),
  'SharesEye', 'reconciliation',
])].filter((term) => /^[a-z]{7,}$/i.test(term));
const knownWords = new Set(INTERVIEW_TERMS.flatMap((entry) => entry.canonical.toLowerCase().match(/[a-z]+/g) ?? []));
// Plurals are valid vocabulary, not recognition errors (closures, prototypes).
for (const word of [...knownWords]) {
  if (!word.endsWith('s')) knownWords.add(`${word}s`);
  if (word.endsWith('y')) knownWords.add(`${word.slice(0, -1)}ies`);
}
const fuzzyCache = new Map<string, string>();
function editDistance(left: string, right: string): number {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index]);
  for (let index = 0; index <= right.length; index++) rows[0][index] = index;
  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(left[i - 1] !== right[j - 1]));
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
    }
  }
  return rows[left.length][right.length];
}
function correctSpelling(word: string): string {
  const key = word.toLowerCase();
  if (knownWords.has(key)) return word;
  const cached = fuzzyCache.get(key);
  if (cached !== undefined) return cached === key ? word : cached;
  const maximum = key.length >= 11 ? 2 : 1;
  const matches = fuzzyTerms
    .filter((term) => Math.abs(term.length - key.length) <= maximum)
    .map((term) => ({ term, distance: editDistance(key, term.toLowerCase()) }))
    .sort((a, b) => a.distance - b.distance);
  const best = matches[0];
  const corrected = best && best.distance <= maximum && (!matches[1] || matches[1].distance - best.distance >= 2) ? best.term : key;
  if (fuzzyCache.size >= 2048) fuzzyCache.clear();
  fuzzyCache.set(key, corrected);
  return corrected === key ? word : corrected;
}

export function normalizeInterviewTerms(value: string): string {
  let result = normalizeResumeNames(value);
  // Compound/long spellings run before shorter acronyms (SCSS before CSS).
  for (const { canonical, alias, pattern } of aliasRules) {
    if (!AMBIGUOUS_ALIASES.has(alias) || TECHNICAL_CONTEXT.test(result)) result = result.replace(pattern, canonical);
  }
  for (const { canonical, aliases, context } of VOCABULARY) {
    if (!context || context.test(result)) result = result.replace(aliases, canonical);
  }
  if (INTERVIEW_QUESTION.test(result) || TECHNICAL_CONTEXT.test(result)) {
    for (const { canonical, pattern } of acronymRules) result = result.replace(pattern, canonical);
  }
  // Process question sentences only. This supports comparisons and follow-ups
  // without changing ordinary answer prose. Exact aliases also support search.
  result = result.replace(/[^?!\n]+[?!]?/g, (sentence) => {
    if (!INTERVIEW_QUESTION.test(sentence)) return sentence;
    return sentence.replace(/\b[a-z]{7,}\b/gi, (word) => correctSpelling(word));
  });
  return result;
}

export function getInterviewVocabularyStats(): { terms: number; aliases: number; categories: number } {
  return { terms: INTERVIEW_TERMS.length, aliases: aliasRules.length, categories: new Set(INTERVIEW_TERMS.map((entry) => entry.category)).size };
}
