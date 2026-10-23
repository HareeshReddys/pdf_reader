import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

type QuestionInputProps = {
  loading: boolean;
  disabled?: boolean;
  initialQuestion?: string;
  onSubmit: (question: string) => Promise<void>;
};

export default function QuestionInput({ loading, disabled, initialQuestion = '', onSubmit }: QuestionInputProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [emptyError, setEmptyError] = useState(false);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setEmptyError(true);
      return;
    }
    setEmptyError(false);
    await onSubmit(trimmed);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form className="question-card" onSubmit={submit}>
      <label htmlFor="interview-question">What do you want to practice?</label>
      <div className={`question-field ${emptyError ? 'has-error' : ''}`}>
        <textarea
          id="interview-question"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            if (event.target.value.trim()) setEmptyError(false);
          }}
          onKeyDown={onKeyDown}
          placeholder="e.g. Tell me about a difficult technical decision you made…"
          rows={3}
          disabled={loading}
          aria-invalid={emptyError}
          aria-describedby={emptyError ? 'question-error' : 'question-hint'}
        />
        <button className="button button-primary" type="submit" disabled={loading || disabled}>
          {loading ? <span className="spinner" aria-hidden="true" /> : <span aria-hidden="true">✦</span>}
          {loading ? 'Preparing…' : 'Prepare answer'}
        </button>
      </div>
      <div className="question-meta">
        <span id={emptyError ? 'question-error' : 'question-hint'} className={emptyError ? 'field-error' : ''}>
          {emptyError ? 'Enter a question to continue.' : 'Tip: press Ctrl + Enter to submit'}
        </span>
        <span>{question.length} characters</span>
      </div>
    </form>
  );
}
