import { app } from 'electron';
import path from 'node:path';

export function getDataDirectory(): string {
  const override = process.env.INTERVIEW_COPILOT_DATA_DIR?.trim();
  if (override) return path.resolve(override);
  return app.isPackaged
    ? path.join(app.getPath('userData'), 'data')
    : path.join(app.getAppPath(), 'data');
}

export function getNotesDirectory(): string {
  return path.join(getDataDirectory(), 'notes');
}

export function getReferenceKnowledgeDirectory(): string {
  const override = process.env.INTERVIEW_COPILOT_REFERENCE_DIR?.trim();
  if (override) return path.resolve(override);
  return path.join(app.getAppPath(), 'knowledge', 'reference');
}

export function getSessionsPath(): string {
  return path.join(getDataDirectory(), 'sessions.json');
}
