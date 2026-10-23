import type { KeyboardEvent } from 'react';
import type { StoredNote } from '../../shared/types';

type UploadNotesProps = {
  notes: StoredNote[];
  loading: boolean;
  error: string | null;
  notice: string | null;
  onUpload: () => Promise<void>;
};

function formatBytes(bytes?: number) {
  if (!bytes) return 'Local note';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
}

function FileGlyph({ extension }: { extension: string }) {
  return (
    <span className="file-glyph" aria-hidden="true">
      {extension}
    </span>
  );
}

export default function UploadNotes({ notes, loading, error, notice, onUpload }: UploadNotesProps) {
  const openPicker = () => {
    if (!loading) void onUpload();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <aside className="panel notes-panel" aria-labelledby="notes-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Knowledge base</p>
          <h2 id="notes-heading">Knowledge sources</h2>
        </div>
        <span className="count-badge">{notes.length}</span>
      </div>

      <div
        className="upload-zone"
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        aria-label="Upload Word, PDF, text or Markdown notes"
      >
        <span className="upload-icon" aria-hidden="true">↑</span>
        <strong>{loading ? 'Adding notes…' : 'Add notes'}</strong>
        <span>Import .docx, .pdf, .txt or .md files</span>
        <span className={`button button-secondary button-small ${loading ? 'is-disabled' : ''}`}>
          Choose files
        </span>
      </div>

      {error && <div className="inline-message error-message" role="alert">{error}</div>}
      {notice && <div className="inline-message success-message" role="status">{notice}</div>}

      <div className="notes-list" aria-live="polite">
        {notes.length === 0 && !loading ? (
          <div className="empty-state compact-empty">
            <span className="empty-icon" aria-hidden="true">≡</span>
            <p>No knowledge sources found</p>
            <span>Add your resume, project notes, or prepared Q&amp;A.</span>
          </div>
        ) : (
          notes.map((note) => {
            const extension = note.fileName.split('.').pop()?.toUpperCase() ?? 'TXT';
            return (
              <div className="note-row" key={`${note.fileName}-${note.importedAt}`}>
                <FileGlyph extension={extension} />
                <div className="note-copy">
                  <strong title={note.fileName}>{note.fileName}</strong>
                  <span>{note.sourceLabel} · {formatBytes(note.size)}</span>
                </div>
                <span className="status-dot" title="Available for search" />
              </div>
            );
          })
        )}
      </div>

      <div className="privacy-note">
        <span aria-hidden="true">⌂</span>
        <p><strong>Stored locally</strong><br />Notes stay on this device.</p>
      </div>
    </aside>
  );
}
