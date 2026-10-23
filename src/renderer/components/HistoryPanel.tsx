import type { SessionItem } from '../../shared/types';

type HistoryPanelProps = {
  items: SessionItem[];
  selectedId: string | null;
  loading: boolean;
  actionBusy: boolean;
  actionMessage: string | null;
  actionError: string | null;
  onSelect: (item: SessionItem) => void;
  onExport: () => Promise<void>;
  onExportAll: () => Promise<void>;
  onDelete: () => Promise<void>;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function HistoryPanel({
  items,
  selectedId,
  loading,
  actionBusy,
  actionMessage,
  actionError,
  onSelect,
  onExport,
  onExportAll,
  onDelete,
}: HistoryPanelProps) {
  return (
    <aside className="panel history-panel" aria-labelledby="history-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Practice log</p>
          <h2 id="history-heading">History</h2>
        </div>
        <span className="count-badge">{items.length}</span>
      </div>

      {selectedId && (
        <div className="history-actions" aria-label="Selected session actions">
          <button type="button" disabled={actionBusy} onClick={() => void onExport()}>Export</button>
          <button className="danger-action" type="button" disabled={actionBusy} onClick={() => void onDelete()}>Delete</button>
        </div>
      )}
      {items.length > 0 && (
        <button className="history-export-all" type="button" disabled={actionBusy} onClick={() => void onExportAll()}>
          Export all history
        </button>
      )}
      {actionMessage && <div className="history-action-message success-message" role="status">{actionMessage}</div>}
      {actionError && <div className="history-action-message error-message" role="alert">{actionError}</div>}

      <div className="history-list" aria-live="polite" aria-busy={loading}>
        {loading && items.length === 0 ? (
          <div className="history-loading"><span className="spinner" /> Loading history…</div>
        ) : items.length === 0 ? (
          <div className="empty-state compact-empty">
            <span className="empty-icon clock-icon" aria-hidden="true">◷</span>
            <p>No practice sessions yet</p>
            <span>Your prepared answers will be saved here.</span>
          </div>
        ) : (
          items.map((item) => (
            <button
              className={`history-item ${selectedId === item.id ? 'is-selected' : ''}`}
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <span className="history-question">{item.question}</span>
              <span className="history-preview">{item.answer}</span>
              <span className="history-footer">
                <span>{item.snippets.length} {item.snippets.length === 1 ? 'source' : 'sources'}</span>
                <time dateTime={item.createdAt}>{formatTime(item.createdAt)}</time>
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
