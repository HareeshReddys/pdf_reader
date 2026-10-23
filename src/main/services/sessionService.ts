import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { SessionItem } from '../../shared/types';
import { getSessionsPath } from './paths';
import { getPracticeSessionId } from './practiceSessionService';

export function formatSessionMarkdown(session: SessionItem): string {
  const mode = session.generationMode ?? 'local';
  const sources = session.snippets.length
    ? session.snippets.map((snippet) => `- ${snippet.fileName} (${snippet.sourceLabel})`).join('\n')
    : '- No local source';
  const weakAreas = session.confidence === 'low' || session.snippets.length === 0
    ? '- Add a stronger source note and practice a more specific example.'
    : '- No clear weak area was recorded; review the follow-up question for more depth.';
  const practiceTopic = session.question
    .replace(/\?$/, '')
    .replace(/^(?:tell me about|explain|describe|define|what is|what are)\s+/i, '')
    .trim();
  return [
    `# ${session.question}`,
    '',
    `- Created: ${session.createdAt}`,
    `- Answer mode: ${mode}`,
    `- Confidence: ${session.confidence ?? 'not scored'}`,
    '',
    '## Transcript',
    '',
    session.transcript || '_No microphone transcript saved._',
    '',
    '## Captured screen text',
    '',
    session.ocrText || '_No screen text saved._',
    '',
    '## Questions detected',
    '',
    `- ${session.question}`,
    '',
    '## Suggested answer',
    '',
    session.answer,
    ...(session.relatedAnswers?.flatMap((related) => ['', related.content]) ?? []),
    '',
    '## Sources',
    '',
    sources,
    '',
    '## Weak areas',
    '',
    weakAreas,
    '',
    '## Follow-up questions',
    '',
    `- ${session.followUpQuestion || 'No follow-up question saved.'}`,
    '',
    '## Recommended practice topics',
    '',
    `- ${practiceTopic || 'Review this question and prepare a practical example.'}`,
    '',
  ].join('\n');
}

export function formatAllSessionsMarkdown(sessions: SessionItem[]): string {
  return [
    '# Interview Prep Copilot — Practice History',
    '',
    `Exported: ${new Date().toISOString()}`,
    '',
    ...sessions.flatMap((session, index) => [
      index === 0 ? '' : '---',
      '',
      formatSessionMarkdown(session),
    ]),
  ].join('\n');
}

async function ensureSessionStore(): Promise<string> {
  const storePath = getSessionsPath();
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, '[]\n', 'utf8');
  }
  return storePath;
}

export async function listSessions(): Promise<SessionItem[]> {
  const storePath = await ensureSessionStore();
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Session data is not an array.');
    return (parsed as SessionItem[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Session history is corrupted and could not be read.');
    }
    throw error;
  }
}

let mutationQueue: Promise<unknown> = Promise.resolve();
function serializeMutation<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation);
  mutationQueue = result.catch(() => undefined);
  return result;
}

export function saveSession(item: Omit<SessionItem, 'id' | 'createdAt'>): Promise<SessionItem> {
  const practiceSessionId = item.practiceSessionId ?? getPracticeSessionId();
  return serializeMutation(async () => {
  const storePath = await ensureSessionStore();
  const sessions = await listSessions();
  const session: SessionItem = {
    ...item,
    practiceSessionId,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const temporaryPath = `${storePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify([session, ...sessions], null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, storePath);
  return session;
  });
}

export function deleteSession(id: string): Promise<SessionItem[]> {
  return serializeMutation(async () => {
  const storePath = await ensureSessionStore();
  const sessions = await listSessions();
  const remaining = sessions.filter((session) => session.id !== id);
  if (remaining.length === sessions.length) throw new Error('The selected history item was not found.');

  const temporaryPath = `${storePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(remaining, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, storePath);
  return remaining;
  });
}
