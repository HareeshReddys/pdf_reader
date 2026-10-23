// Ephemeral context only: screenshots and call context are not persisted here.
let screen: { imageDataUrl: string; sourceName: string; capturedAt: number } | undefined;
let spoken: { question: string; timestamp: number } | undefined;
export function rememberScreen(imageDataUrl: string, sourceName: string): void {
  screen = { imageDataUrl, sourceName, capturedAt: Date.now() };
}
export function clearScreenContext(): void { screen = undefined; }
export function rememberSpokenQuestion(question: string): void { spoken = { question, timestamp: Date.now() }; }
export function latestSpokenQuestion(): string {
  return spoken && Date.now() - spoken.timestamp < 60000 ? spoken.question : '';
}
export function screenForQuestion(question: string): string | undefined {
  if (!screen || Date.now() - screen.capturedAt > 30000) return undefined;
  return /\b(?:screen|shown|here|this (?:code|task|problem|error|diagram)|implement|debug|architecture|build|design|solve|problem statement)\b/i.test(question) ? screen.imageDataUrl : undefined;
}
