import { appendFileSync, mkdirSync, renameSync, statSync } from 'node:fs';
import path from 'node:path';
import { getDataDirectory } from './paths';

// Keep small local operational logs, never screenshots, transcripts or answers.
export function logDiagnostic(event: string, detail: Record<string, string | number> = {}): void {
  try {
    const directory = path.join(getDataDirectory(), 'logs');
    mkdirSync(directory, { recursive: true });
    const file = path.join(directory, 'runtime.log');
    try { if (statSync(file).size > 512 * 1024) renameSync(file, `${file}.previous`); } catch { /* First entry. */ }
    appendFileSync(file, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, { mode: 0o600 });
  } catch { /* Diagnostics must never disrupt a session. */ }
}
