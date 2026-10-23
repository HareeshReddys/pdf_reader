import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { NoteSnippet, StoredNote } from '../../shared/types';
import { RESUME_ENTITIES, PERSONAL_QUESTION_SCAFFOLD } from './resumeVocabulary';
import { normalizeInterviewTerms } from './interviewVocabulary';
import { getNotesDirectory, getReferenceKnowledgeDirectory } from './paths';
import { extractDocumentText } from './documentTextService';

const ALLOWED_EXTENSIONS = new Set(['.txt', '.md']);
type KnowledgeSource = StoredNote['source'];
type KnowledgeDocument = StoredNote & { filePath: string };
const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'define',
  'describe', 'do', 'explain', 'for', 'from', 'give', 'how', 'i', 'in', 'is', 'it',
  'me', 'of', 'on', 'or', 'overview', 'please', 'tell', 'that', 'the', 'this', 'to', 'was',
  'work', 'works', 'working', 'use', 'uses', 'used', 'does', 'will', 'would', 'could', 'help', 'helps', 'actually', 'exactly', 'basically', 'mean', 'means', 'we', 'our', 'they', 'their', 'them', 'way', 'ways', 'using', 'possible', 'understand', 'what', 'when', 'where', 'which', 'with', 'you', 'your',
]);

async function ensureNotesDirectory(): Promise<string> {
  const directory = getNotesDirectory();
  await fs.mkdir(directory, { recursive: true });
  return directory;
}

function safeFileName(fileName: string): string {
  return path.basename(fileName).replace(/[^a-zA-Z0-9._ -]/g, '_');
}

async function nextAvailablePath(directory: string, originalName: string): Promise<string> {
  const parsed = path.parse(safeFileName(originalName));
  let candidate = path.join(directory, `${parsed.name}${parsed.ext.toLowerCase()}`);
  let suffix = 2;

  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(directory, `${parsed.name}-${suffix}${parsed.ext.toLowerCase()}`);
      suffix += 1;
    } catch {
      return candidate;
    }
  }
}

export async function importNote(sourcePath: string): Promise<StoredNote> {
  const extension = path.extname(sourcePath).toLowerCase();
  const document = extension === '.docx' || extension === '.pdf';
  if (!ALLOWED_EXTENSIONS.has(extension) && !document) {
    throw new Error('Import .txt, .md, .docx or .pdf files. For older .doc files, save a .docx copy first.');
  }

  const sourceStats = await fs.stat(sourcePath);
  if (!sourceStats.isFile()) {
    throw new Error('The selected path is not a file.');
  }

  const directory = await ensureNotesDirectory();
  const text = document ? await extractDocumentText(sourcePath) : undefined;
  const destination = await nextAvailablePath(directory, path.basename(sourcePath) + (document ? '.txt' : ''));
  if (text !== undefined) await fs.writeFile(destination, text, { mode: 0o600, flag: 'wx' });
  else await fs.copyFile(sourcePath, destination);
  const stats = await fs.stat(destination);

  return {
    fileName: path.basename(destination),
    size: stats.size,
    importedAt: stats.birthtime.toISOString(),
    source: 'personal',
    sourceLabel: 'Personal note',
  };
}

async function listDirectoryNotes(
  directory: string,
  source: KnowledgeSource,
  sourceLabel: string,
): Promise<KnowledgeDocument[]> {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map(async (entry) => {
        const filePath = path.join(directory, entry.name);
        const stats = await fs.stat(filePath);
        return {
          fileName: entry.name,
          size: stats.size,
          importedAt: stats.birthtime.toISOString(),
          source,
          sourceLabel,
          filePath,
        } satisfies KnowledgeDocument;
      }),
  );
}

async function listKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const personalDirectory = await ensureNotesDirectory();
  const [personal, reference] = await Promise.all([
    listDirectoryNotes(personalDirectory, 'personal', 'Personal note'),
    listDirectoryNotes(getReferenceKnowledgeDirectory(), 'reference', 'Built-in interview reference'),
  ]);
  return [...personal, ...reference];
}

export async function listNotes(): Promise<StoredNote[]> {
  const notes = await listKnowledgeDocuments();

  return notes
    .sort((a, b) => a.source.localeCompare(b.source) || a.fileName.localeCompare(b.fileName))
    .map(({ filePath: _filePath, ...note }) => note);
}

function normalizeSearchText(value: string): string {
  return normalizeInterviewTerms(value)
    .normalize('NFKC')
    .toLowerCase()
    // Treat spelling variants such as "cherry-pick", "cherry pick", and
    // Unicode-dash versions as the same phrase.
    .replace(/[\u2010-\u2015_-]+/g, ' ')
    // Keep internal dots in names such as Node.js, but discard sentence-ending dots.
    .replace(/\.(?=\s|$)/g, ' ')
    .replace(/\bcherry\s*pick(?:ing|ed)?\b/g, 'cherry pick')
    .replace(/\bobject[ \/]+relation(?:al)?\s+(?:mapping|mapper)\b/g, 'orm')
    .replace(/\b(?:db|databases)\b/g, 'database')
    .replace(/\bcascading style sheets\b/g, 'css')
    .replace(/\bobject oriented programming\b/g, 'oop')
    .replace(/\b(?:virtual dom|virtual down|watch world dom)\b/g, 'virtual dom')
    .replace(/\bflex\s+box\b/g, 'flexbox')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeSearchText(value)
    .match(/[a-z0-9+#.]{2,}/g)
    ?.filter((word) => !STOP_WORDS.has(word)) ?? [];
}

function chunkContent(content: string, maximumLength = 900): string[] {
  const paragraphs = content.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  const headingContext: string[] = [];
  let body: string[] = [];

  // The deepest heading identifies the exact Q&A section. Parent page headings
  // are navigation context and should not be repeated in a verbatim answer.
  const contextText = () => headingContext.filter(Boolean).at(-1) ?? '';
  const flush = () => {
    if (body.length === 0) return;
    const prefix = contextText();
    chunks.push(`${prefix ? `${prefix}\n\n` : ''}${body.join('\n\n')}`.trim());
    body = [];
  };

  for (const paragraph of paragraphs) {
    const heading = paragraph.match(/^(#{1,6})\s+[^\n]+$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      headingContext.length = level;
      headingContext[level - 1] = paragraph;
      continue;
    }

    const prefixLength = contextText().length + 2;
    const availableLength = Math.max(maximumLength - prefixLength, 200);

    if (body.length > 0 && body.join('\n\n').length + paragraph.length + 2 > availableLength) {
      flush();
    }

    for (let start = 0; start < paragraph.length; start += availableLength) {
      const part = paragraph.slice(start, start + availableLength).trim();
      if (!part) continue;
      if (body.length > 0 && body.join('\n\n').length + part.length + 2 > availableLength) flush();
      body.push(part);
      if (part.length === availableLength) flush();
    }
  }

  flush();
  if (chunks.length === 0 && contextText()) chunks.push(contextText());
  return chunks;
}

// Keep each reference section intact, including fenced code and tables.
function referenceSections(content: string): { content: string; relatedContent: string[] }[] {
  return content.split(/(?=^#\s)/m).flatMap((page) => {
    const sections = page.split(/(?=^##\s)/m).filter((section) => /^##\s/.test(section)).map((section) => section.trim());
    return sections.map((section, index) => ({ content: section, relatedContent: sections.slice(index + 1, index + 2) }));
  });
}

function phraseCount(value: string, phrase: string): number {
  if (!phrase) return 0;
  let count = 0;
  let position = 0;
  while ((position = value.indexOf(phrase, position)) >= 0) {
    count += 1;
    position += phrase.length;
  }
  return count;
}

function scoreText(value: string, terms: Set<string>, phrases: string[]): number {
  const words = tokenize(value);
  const wordCounts = new Map<string, number>();
  for (const word of words) wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);

  let score = 0;
  let matchedTerms = 0;
  for (const term of terms) {
    const count = wordCounts.get(term) ?? 0;
    if (count > 0) {
      matchedTerms += 1;
      score += 2 + Math.min(count - 1, 3) * 0.5;
    }
  }

  if (matchedTerms > 0) score += (matchedTerms / terms.size) * 4;

  const normalizedValue = ` ${words.join(' ')} `;
  for (const phrase of phrases) {
    score += Math.min(phraseCount(normalizedValue, ` ${phrase} `), 2) * 4;
  }

  return score;
}

function getHeadings(chunk: string): string {
  return chunk
    .split('\n')
    .filter((line) => /^#{1,6}\s+/.test(line.trim()))
    .join(' ');
}

function exactHeadingAliasScore(chunk: string, terms: Set<string>): number {
  const queryKey = [...terms].join(' ');
  if (!queryKey) return 0;
  const aliases = getHeadings(chunk)
    .replace(/^#{1,6}\s+/gm, '')
    .split(';')
    .map((alias) => tokenize(alias).join(' '))
    .filter(Boolean);
  return aliases.includes(queryKey) ? 24 : 0;
}

function scoreChunk(chunk: string, fileName: string, terms: Set<string>, phrases: string[]): number {
  const contentScore = scoreText(chunk, terms, phrases);
  if (contentScore === 0) return 0;

  const headingScore = scoreText(getHeadings(chunk), terms, phrases);
  const topicName = path.parse(fileName).name;
  const fileNameScore = scoreText(topicName, terms, phrases);

  return contentScore + headingScore * 1.5 + fileNameScore * 1.25 + exactHeadingAliasScore(chunk, terms);
}

function queryCoverage(chunk: string, fileName: string, terms: Set<string>): number {
  const searchableTerms = new Set(tokenize(`${fileName} ${chunk}`));
  let matches = 0;
  for (const term of terms) {
    if (searchableTerms.has(term)) matches += 1;
  }
  return matches / terms.size;
}

export async function searchNotes(question: string, limit = 5): Promise<NoteSnippet[]> {
  const terms = new Set(tokenize(question));
  if (terms.size === 0) return [];
  const termList = [...terms];
  const phrases = termList
    .slice(0, -1)
    .map((term, index) => `${term} ${termList[index + 1]}`);

  const notes = await listKnowledgeDocuments();
  const candidates: NoteSnippet[] = [];

  await Promise.all(notes.map(async ({ fileName, filePath, source, sourceLabel }) => {
    const content = await fs.readFile(filePath, 'utf8');
    const maximumLength = source === 'reference' ? 2_000 : 900;
    const sections = source === 'reference' ? referenceSections(content) : chunkContent(content, maximumLength).map((content) => ({ content, relatedContent: [] as string[] }));
    for (const { content: chunk, relatedContent } of sections) {
      // Generated reference files include page titles and a Source URL before
      // their Q&A sections. Only level-two interview sections are answers.
      if (source === 'reference' && !/^##\s+/m.test(chunk)) continue;

      const namedEntities = [...terms].filter((term) => RESUME_ENTITIES.has(term));
      const resumeQuery = fileName === 'personal.md' && source === 'reference' && namedEntities.length > 0;
      // Match the named project's own section, rather than a generic overview
      // mentioning it. Long spoken questions repeat generic interview phrasing.
      if (resumeQuery && !namedEntities.every((entity) => tokenize(getHeadings(chunk)).includes(entity))) continue;
      const searchTerms = resumeQuery
        ? new Set([...terms].filter((term) => !PERSONAL_QUESTION_SCAFFOLD.has(term)))
        : terms;
      const minimumCoverage = resumeQuery || searchTerms.size === 1 ? 1 : 0.6;
      if (queryCoverage(chunk, fileName, searchTerms) < minimumCoverage) continue;

      const score = scoreChunk(chunk, fileName, searchTerms, phrases);
      if (score > 0) {
        candidates.push({
          fileName: source === 'reference' ? `Reference · ${fileName}` : fileName,
          content: chunk,
          relatedContent,
          score,
          source,
          sourceLabel,
        });
      }
    }
  }));

  return candidates
    .sort((a, b) => b.score - a.score || a.content.length - b.content.length)
    .slice(0, Math.min(Math.max(limit, 3), 5));
}
