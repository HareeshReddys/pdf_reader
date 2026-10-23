export type BufferedQuestion = { id: string; question: string; combined: boolean };
/** Dispatch immediately; combine speech starting within three seconds of an answer. */
export class RealtimeQuestionBuffer {
  private pending?: BufferedQuestion;
  private last?: { question: string; completedAt?: number };
  add(id: string, question: string, startedAt: number): void {
    if (this.pending) {
      this.pending = { id, question: `${this.pending.question} ${question}`.slice(-12000), combined: true };
    } else {
      const continuation = this.last && (this.last.completedAt === undefined || startedAt - this.last.completedAt <= 3000);
      this.pending = { id, question: continuation ? `${this.last!.question} ${question}`.slice(-12000) : question, combined: Boolean(continuation) };
    }
  }
  take(): BufferedQuestion | undefined {
    if (!this.pending) return;
    const result = this.pending; this.pending = undefined;
    this.last = { question: result.question };
    return result;
  }
  answerCompleted(now: number): void { if (this.last) this.last.completedAt = now; }
  imageContext(): void { this.last = { question: 'Analyze the submitted screenshot' }; }
  reset(): void { this.last = undefined; this.pending = undefined; }
  get hasContext(): boolean { return Boolean(this.pending || this.last); }
  get hasPending(): boolean { return Boolean(this.pending); }
}
