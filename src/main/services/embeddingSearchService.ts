import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import type { NoteSnippet, StoredNote } from '../../shared/types';
import { searchNotes } from './knowledgeService';
import { getDataDirectory, getNotesDirectory, getReferenceKnowledgeDirectory } from './paths';

const INDEX_VERSION = 1;
const DEFAULT_MODEL = 'text-embedding-3-small';
const EMBEDDING_BATCH_SIZE = 64;
const ALLOWED_EXTENSIONS = new Set(['.txt', '.md']);

type IndexedSource = StoredNote['source'];

export interface EmbeddingIndexEntry {
  id: string;
  fileName: string;
  source: IndexedSource;
  sourceLabel: string;
  content: string;
  embedding: number[];
}

interface PersistedEmbeddingIndex {
  version: number;
  model: string;
  createdAt: string;
  sourceFingerprint: string;
  entries: EmbeddingIndexEntry[];
}

export interface EmbeddingIndexStatus {
  exists: boolean;
  entryCount: number;
  model: string;
  createdAt?: string;
  sourceFingerprint?: string;
}

export interface EmbeddingBuildResult extends EmbeddingIndexStatus {
  exists: true;
}

export type SemanticFallbackReason =
  | 'api-key-missing'
  | 'index-missing'
  | 'index-invalid'
  | 'model-mismatch'
  | 'embedding-request-failed';

export interface SemanticSearchResult {
  snippets: NoteSnippet[];
  mode: 'semantic' | 'keyword';
  fallbackReason?: SemanticFallbackReason;
}

interface IndexableSection {
  id: string;
  fileName: string;
  source: IndexedSource;
  sourceLabel: string;
  content: string;
}

function configuredModel(): string {
  return process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_MODEL;
}

function configuredApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key && key !== 'your_api_key_here' ? key : undefined;
}

export function getEmbeddingIndexPath(): string {
  return path.join(getDataDirectory(), 'search', 'embeddings-index.json');
}

function splitMarkdownSections(content: string, maximumLength: number): string[] {
  const paragraphs = content.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  const headings: string[] = [];
  let body: string[] = [];
  const heading = () => headings.filter(Boolean).at(-1) ?? '';
  const flush = () => {
    if (body.length === 0) return;
    const prefix = heading();
    chunks.push(`${prefix ? `${prefix}\n\n` : ''}${body.join('\n\n')}`.trim());
    body = [];
  };

  for (const paragraph of paragraphs) {
    const match = paragraph.match(/^(#{1,6})\s+[^\n]+$/);
    if (match) {
      flush();
      const level = match[1].length;
      headings.length = level;
      headings[level - 1] = paragraph;
      continue;
    }

    const available = Math.max(maximumLength - heading().length - 2, 200);
    if (body.length > 0 && body.join('\n\n').length + paragraph.length + 2 > available) flush();
    for (let start = 0; start < paragraph.length; start += available) {
      const part = paragraph.slice(start, start + available).trim();
      if (!part) continue;
      if (body.length > 0 && body.join('\n\n').length + part.length + 2 > available) flush();
      body.push(part);
      if (part.length === available) flush();
    }
  }
  flush();
  if (chunks.length === 0 && heading()) chunks.push(heading());
  return chunks;
}

async function readIndexableSections(): Promise<{ sections: IndexableSection[]; fingerprint: string }> {
  const directories: Array<{ directory: string; source: IndexedSource; sourceLabel: string }> = [
    { directory: getNotesDirectory(), source: 'personal', sourceLabel: 'Personal note' },
    {
      directory: getReferenceKnowledgeDirectory(),
      source: 'reference',
      sourceLabel: 'Built-in interview reference',
    },
  ];
  const sections: IndexableSection[] = [];
  const fingerprint = createHash('sha256');

  for (const descriptor of directories) {
    let fileNames: string[];
    try {
      fileNames = (await fs.readdir(descriptor.directory, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
        .map((entry) => entry.name)
        .sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue;
      throw error;
    }

    for (const fileName of fileNames) {
      const content = await fs.readFile(path.join(descriptor.directory, fileName), 'utf8');
      fingerprint.update(descriptor.source).update('\0').update(fileName).update('\0').update(content).update('\0');
      const maximumLength = descriptor.source === 'reference' ? 2_000 : 900;
      const chunks = splitMarkdownSections(content, maximumLength);
      for (const [chunkIndex, chunk] of chunks.entries()) {
        // Reference documents begin with generated page metadata. It is useful
        // for navigation but must never become an interview answer.
        if (descriptor.source === 'reference' && !/^##\s+/m.test(chunk)) continue;
        sections.push({
          id: createHash('sha256')
            .update(`${descriptor.source}\0${fileName}\0${chunkIndex}\0${chunk}`)
            .digest('hex'),
          fileName,
          source: descriptor.source,
          sourceLabel: descriptor.sourceLabel,
          content: chunk,
        });
      }
    }
  }

  return { sections, fingerprint: fingerprint.digest('hex') };
}

async function writeIndex(index: PersistedEmbeddingIndex): Promise<void> {
  const indexPath = getEmbeddingIndexPath();
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  const temporaryPath = `${indexPath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(index), 'utf8');
  await fs.rename(temporaryPath, indexPath);
}

async function readIndex(): Promise<PersistedEmbeddingIndex> {
  const raw = await fs.readFile(getEmbeddingIndexPath(), 'utf8');
  const parsed = JSON.parse(raw) as Partial<PersistedEmbeddingIndex>;
  if (
    parsed.version !== INDEX_VERSION
    || typeof parsed.model !== 'string'
    || typeof parsed.createdAt !== 'string'
    || typeof parsed.sourceFingerprint !== 'string'
    || !Array.isArray(parsed.entries)
  ) {
    throw new Error('The local embedding index has an unsupported or invalid format.');
  }
  return parsed as PersistedEmbeddingIndex;
}

export async function getEmbeddingIndexStatus(): Promise<EmbeddingIndexStatus> {
  try {
    const index = await readIndex();
    return {
      exists: true,
      entryCount: index.entries.length,
      model: index.model,
      createdAt: index.createdAt,
      sourceFingerprint: index.sourceFingerprint,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      return { exists: false, entryCount: 0, model: configuredModel() };
    }
    return { exists: false, entryCount: 0, model: configuredModel() };
  }
}

export async function clearEmbeddingIndex(): Promise<void> {
  try {
    await fs.unlink(getEmbeddingIndexPath());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

export async function buildEmbeddingIndex(): Promise<EmbeddingBuildResult> {
  const apiKey = configuredApiKey();
  if (!apiKey) throw new Error('OPENAI_API_KEY is required to build the semantic-search index.');

  const model = configuredModel();
  const { sections, fingerprint } = await readIndexableSections();
  const client = new OpenAI({ apiKey });
  const entries: EmbeddingIndexEntry[] = [];

  for (let start = 0; start < sections.length; start += EMBEDDING_BATCH_SIZE) {
    const batch = sections.slice(start, start + EMBEDDING_BATCH_SIZE);
    const response = await client.embeddings.create({
      model,
      input: batch.map((section) => section.content),
      encoding_format: 'float',
    });
    if (response.data.length !== batch.length) {
      throw new Error('OpenAI returned an incomplete embedding batch. The previous index was preserved.');
    }
    for (const [index, section] of batch.entries()) {
      const embedding = response.data[index]?.embedding;
      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error('OpenAI returned an invalid embedding. The previous index was preserved.');
      }
      entries.push({ ...section, embedding });
    }
  }

  const createdAt = new Date().toISOString();
  await writeIndex({ version: INDEX_VERSION, model, createdAt, sourceFingerprint: fingerprint, entries });
  return { exists: true, entryCount: entries.length, model, createdAt, sourceFingerprint: fingerprint };
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length === 0 || left.length !== right.length) return -1;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (leftMagnitude === 0 || rightMagnitude === 0) return -1;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function rankEmbeddingEntries(
  entries: EmbeddingIndexEntry[],
  queryEmbedding: number[],
  limit = 5,
): NoteSnippet[] {
  return entries
    .map((entry) => ({
      fileName: entry.source === 'reference' ? `Reference · ${entry.fileName}` : entry.fileName,
      content: entry.content,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
      source: entry.source,
      sourceLabel: entry.sourceLabel,
    }))
    .filter((snippet) => Number.isFinite(snippet.score) && snippet.score > 0)
    .sort((left, right) => right.score - left.score || left.content.length - right.content.length)
    .slice(0, Math.min(Math.max(limit, 3), 5));
}

async function keywordFallback(
  question: string,
  limit: number,
  fallbackReason: SemanticFallbackReason,
): Promise<SemanticSearchResult> {
  return { snippets: await searchNotes(question, limit), mode: 'keyword', fallbackReason };
}

export async function searchNotesSemantically(question: string, limit = 5): Promise<SemanticSearchResult> {
  const apiKey = configuredApiKey();
  if (!apiKey) return keywordFallback(question, limit, 'api-key-missing');

  let index: PersistedEmbeddingIndex;
  try {
    index = await readIndex();
  } catch (error) {
    const reason = (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'index-missing' : 'index-invalid';
    return keywordFallback(question, limit, reason);
  }
  if (index.model !== configuredModel()) return keywordFallback(question, limit, 'model-mismatch');

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.embeddings.create({
      model: index.model,
      input: question,
      encoding_format: 'float',
    });
    const queryEmbedding = response.data[0]?.embedding;
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      return keywordFallback(question, limit, 'embedding-request-failed');
    }
    return { snippets: rankEmbeddingEntries(index.entries, queryEmbedding, limit), mode: 'semantic' };
  } catch {
    return keywordFallback(question, limit, 'embedding-request-failed');
  }
}
