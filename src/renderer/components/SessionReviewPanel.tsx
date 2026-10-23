import { useEffect, useMemo, useState } from 'react';
import type { SessionExportFormat, SessionItem } from '../../shared/types';
import './SessionReviewPanel.css';

export type SessionReviewPanelProps = {
  items: SessionItem[];
  busy?: boolean;
  message?: string | null;
  error?: string | null;
  onExportSelected: (ids: string[], format: SessionExportFormat) => void | Promise<void>;
  onExportAll: (format: SessionExportFormat) => void | Promise<void>;
  onReview: (id: string) => Promise<string>;
};

type InputSource = 'all' | 'manual' | 'microphone' | 'screen';
type DateRange = 'all' | 'today' | 'week' | 'month';

function inputSource(item: SessionItem): Exclude<InputSource, 'all'> {
  if (item.transcript) return 'microphone';
  if (item.ocrText) return 'screen';
  return 'manual';
}

function sourceLabel(source: Exclude<InputSource, 'all'>) {
  if (source === 'microphone') return 'Microphone';
  if (source === 'screen') return 'Screen capture';
  return 'Manual question';
}

function withinDateRange(value: string, range: DateRange, now = new Date()) {
  if (range === 'all') return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  if (range === 'today') {
    return date.toDateString() === now.toDateString();
  }

  const elapsed = now.getTime() - date.getTime();
  const days = range === 'week' ? 7 : 30;
  return elapsed >= 0 && elapsed <= days * 24 * 60 * 60 * 1000;
}

function searchableText(item: SessionItem) {
  return [
    item.question,
    item.answer,
    item.transcript,
    item.ocrText,
    item.followUpQuestion,
    ...item.snippets.flatMap((snippet) => [snippet.fileName, snippet.sourceLabel, snippet.content]),
  ].filter(Boolean).join(' ').toLocaleLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SessionReviewPanel({
  items,
  busy = false,
  message = null,
  error = null,
  onExportSelected,
  onExportAll,
  onReview,
}: SessionReviewPanelProps) {
  const [source, setSource] = useState<InputSource>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [topic, setTopic] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [previewId, setPreviewId] = useState<string | null>(items[0]?.id ?? null);
  const [format, setFormat] = useState<SessionExportFormat>('markdown');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedTopic = topic.trim().toLocaleLowerCase();
    return items.filter((item) => {
      if (source !== 'all' && inputSource(item) !== source) return false;
      if (!withinDateRange(item.createdAt, dateRange)) return false;
      return !normalizedTopic || searchableText(item).includes(normalizedTopic);
    });
  }, [dateRange, items, source, topic]);

  const preview = filteredItems.find((item) => item.id === previewId) ?? filteredItems[0] ?? null;
  const visibleIds = filteredItems.map((item) => item.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.has(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  useEffect(() => {
    const availableIds = new Set(items.map((item) => item.id));
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => availableIds.has(id)));
      return next.size === current.size ? current : next;
    });
    if (previewId && !availableIds.has(previewId)) setPreviewId(items[0]?.id ?? null);
  }, [items, previewId]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const resetFilters = () => {
    setSource('all');
    setDateRange('all');
    setTopic('');
  };

  const review = async (id: string) => {
    setReviewBusy(true); setReviewFeedback(''); setReviewError('');
    try { setReviewFeedback(await onReview(id)); }
    catch (reason) { setReviewError(reason instanceof Error ? reason.message : 'Could not review this session.'); }
    finally { setReviewBusy(false); }
  };

  return (
    <section className="session-review" aria-labelledby="session-review-title">
      <header className="session-review__header">
        <div>
          <p className="session-review__eyebrow">Optional history tools</p>
          <h2 id="session-review-title">Practice session library</h2>
          <p>Filter past sessions, inspect the saved context, and export a portable copy.</p>
        </div>
        <span className="session-review__count">{filteredItems.length} of {items.length}</span>
      </header>

      <div className="session-review__filters" aria-label="Session filters">
        <label>
          <span>Source type</span>
          <select value={source} onChange={(event) => setSource(event.target.value as InputSource)}>
            <option value="all">All sources</option>
            <option value="manual">Manual question</option>
            <option value="microphone">Microphone</option>
            <option value="screen">Screen capture</option>
          </select>
        </label>
        <label>
          <span>Date</span>
          <select value={dateRange} onChange={(event) => setDateRange(event.target.value as DateRange)}>
            <option value="all">Any time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
        </label>
        <label className="session-review__topic">
          <span>Topic</span>
          <input
            type="search"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Search questions, answers, or notes"
          />
        </label>
        <button className="session-review__reset" type="button" onClick={resetFilters}>Clear filters</button>
      </div>

      <div className="session-review__toolbar">
        <label className="session-review__select-all">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={toggleAllVisible}
            disabled={visibleIds.length === 0}
          />
          Select visible ({selectedVisibleCount}/{visibleIds.length})
        </label>
        <div className="session-review__export-controls">
          <label>
            <span className="visually-hidden">Export format</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as SessionExportFormat)}>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <button
            type="button"
            disabled={busy || selectedIds.size === 0}
            onClick={() => void onExportSelected([...selectedIds], format)}
          >
            Export selected ({selectedIds.size})
          </button>
          <button type="button" disabled={busy || items.length === 0} onClick={() => void onExportAll(format)}>
            Export all
          </button>
        </div>
      </div>

      {message && <div className="session-review__message session-review__message--success" role="status">{message}</div>}
      {error && <div className="session-review__message session-review__message--error" role="alert">{error}</div>}

      <div className="session-review__workspace">
        <div className="session-review__list" aria-label="Filtered sessions">
          {filteredItems.length === 0 ? (
            <div className="session-review__empty">
              <strong>No sessions match these filters.</strong>
              <span>Change the source, date, or topic to see more results.</span>
            </div>
          ) : filteredItems.map((item) => {
            const itemSource = inputSource(item);
            return (
              <article className={`session-review__row ${preview?.id === item.id ? 'is-active' : ''}`} key={item.id}>
                <label className="session-review__check" aria-label={`Select ${item.question}`}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelected(item.id)}
                  />
                </label>
                <button type="button" onClick={() => setPreviewId(item.id)}>
                  <strong>{item.question}</strong>
                  <span>{sourceLabel(itemSource)} · {formatDate(item.createdAt)}</span>
                  <small>{item.answer}</small>
                </button>
              </article>
            );
          })}
        </div>

        <article className="session-review__preview" aria-live="polite">
          {preview ? (
            <>
              <div className="session-review__preview-meta">
                <span>{sourceLabel(inputSource(preview))}</span>
                <time dateTime={preview.createdAt}>{formatDate(preview.createdAt)}</time>
              </div>
              <h3>{preview.question}</h3>
              <div className="session-review__answer">
                <h4>Answer</h4>
                <p>{preview.answer}</p>
              </div>
              {preview.transcript && (
                <details>
                  <summary>Transcript</summary>
                  <p>{preview.transcript}</p>
                </details>
              )}
              {preview.ocrText && (
                <details>
                  <summary>Captured text</summary>
                  <p>{preview.ocrText}</p>
                </details>
              )}
              {preview.followUpQuestion && (
                <div className="session-review__follow-up">
                  <h4>Likely follow-up</h4>
                  <p>{preview.followUpQuestion}</p>
                </div>
              )}
              <div className="session-review__preview-footer">
                <span>{preview.snippets.length} {preview.snippets.length === 1 ? 'source' : 'sources'}</span>
                <span>{preview.generationMode ?? 'local'} answer</span>
                {preview.confidence && <span>{preview.confidence} confidence</span>}
              </div>
              <button className="session-review__review-button" type="button" disabled={reviewBusy} onClick={() => void review(preview.id)}>
                {reviewBusy ? 'Reviewing…' : 'Review session with OpenAI'}
              </button>
              {reviewError && <div className="session-review__message session-review__message--error" role="alert">{reviewError}</div>}
              {reviewFeedback && <div className="session-review__feedback"><h4>Improvement feedback</h4><pre>{reviewFeedback}</pre></div>}
            </>
          ) : (
            <div className="session-review__empty">
              <strong>Select a session to preview it.</strong>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
