import { randomUUID } from 'node:crypto';

// A new app run starts fresh. Stopping voice retains this scope for review;
// starting another voice conversation starts a new scope.
let practiceSessionId = randomUUID();
export function getPracticeSessionId(): string { return practiceSessionId; }
export function beginPracticeSession(): string { practiceSessionId = randomUUID(); return practiceSessionId; }
