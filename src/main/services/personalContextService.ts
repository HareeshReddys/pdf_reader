import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { NoteSnippet } from '../../shared/types';
import { getNotesDirectory, getReferenceKnowledgeDirectory } from './paths';
import { normalizeResumeNames, RESUME_ENTITIES } from './resumeVocabulary';
import { isExperienceIncidentQuestion } from '../../shared/scenarioGuidance';

export function isPersonalExperienceQuestion(question: string): boolean {
  if (isExperienceIncidentQuestion(question)) return true;
  const text = normalizeResumeNames(question).toLowerCase();
  const personal = /\b(?:you|your|yourself|my|resume|cv|own)\b/.test(text)
    || /\b(?:last|current|recent|previous)\s+(?:projects?|designs?|systems?|products?)\b/.test(text)
    || [...RESUME_ENTITIES].some(name => new RegExp(`\\b${name}\\b`).test(text));
  return personal && /\b(?:projects?|designs?|systems?|products?|built|build|developed|implemented|experience|background|resume|cv|yourself|roles?|responsibilities|contributions?|achievements?|challenges?|decisions?|led|managed|delivered|improved|solved|scale|scalable|architecture|automation)\b/.test(text);
}

export function needsPersonalSynthesis(question: string): boolean {
  if (isExperienceIncidentQuestion(question)) return true;
  const text = normalizeResumeNames(question).toLowerCase();
  const namedProject = [...RESUME_ENTITIES].some(name => new RegExp(`\\b${name}\\b`).test(text));
  if (namedProject && !/\b(?:designs?|systems?|products?|built|build|developed|implemented|scalable|scale|architecture|challenges?)\b|end[ -]to[ -]end/i.test(text)) return false;
  return isPersonalExperienceQuestion(question)
    && /\b(?:last|recent|previous|own|designs?|systems?|products?|built|build|developed|implemented|scalable|scale|architecture|challenges?)\b|end[ -]to[ -]end/i.test(question);
}

export type PersonalContext = { text: string; snippets: NoteSnippet[] };

export async function getPersonalContext(question: string): Promise<PersonalContext> {
  const documents: Array<{ fileName: string; content: string; label: string; priority: number }> = [];
  // This one curated reference is explicitly derived from the user's resume.
  // Other reference pages may contain somebody else's interview examples.
  const profilePath = path.join(getReferenceKnowledgeDirectory(), 'personal.md');
  try {
    const content = await fs.readFile(profilePath, 'utf8');
    if (content.trim()) documents.push({ fileName: 'personal.md', content, label: 'Resume-based personal profile', priority: 1 });
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }

  const entries = await fs.readdir(getNotesDirectory(), { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const terms = normalizeResumeNames(question).toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  for (const entry of entries) {
    if (!entry.isFile() || !/\.(?:txt|md)$/i.test(entry.name)) continue;
    const file = path.join(getNotesDirectory(), entry.name);
    // Keep prompt size and file reads bounded, including accidentally large imports.
    if ((await fs.stat(file)).size > 256 * 1024) continue;
    const content = await fs.readFile(file, 'utf8');
    const profile = /resume|\bcv\b|personal|profile|experience|projects?/i.test(entry.name);
    const overlap = terms.filter(term => content.toLowerCase().includes(term)).length;
    if (profile || overlap >= 2) documents.push({ fileName: entry.name, content, label: 'Imported personal note', priority: profile ? 3 : 2 });
  }

  documents.sort((a, b) => b.priority - a.priority || a.fileName.localeCompare(b.fileName));
  let remaining = 24000;
  const snippets: NoteSnippet[] = [];
  // Reserve room for the curated overview alongside up to four personal notes.
  for (const document of [...documents.filter(doc => doc.priority === 1), ...documents.filter(doc => doc.priority > 1).slice(0, 4)]) {
    const content = document.content.slice(0, Math.min(remaining, document.priority === 1 ? 16000 : 2000)).trim();
    if (!content) continue;
    remaining -= content.length;
    snippets.push({ fileName: document.fileName, content, source: 'personal', sourceLabel: document.label, score: 1 });
  }
  const text = snippets.map(snippet => `Source: ${snippet.fileName} (${snippet.sourceLabel})\n${snippet.content}`).join('\n\n---\n\n');
  return { text, snippets };
}
