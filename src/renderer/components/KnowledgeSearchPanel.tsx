import { useEffect, useState } from 'react';
import type { EmbeddingIndexStatus } from '../../shared/types';
import './KnowledgeSearchPanel.css';

export default function KnowledgeSearchPanel() {
  const [status, setStatus] = useState<EmbeddingIndexStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = () => window.interviewAPI.getEmbeddingIndexStatus().then(setStatus).catch(() => undefined);
  useEffect(() => { void refresh(); }, []);

  const rebuild = async () => {
    setBusy(true); setError('');
    try { setStatus(await window.interviewAPI.buildEmbeddingIndex()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not build the semantic index.'); }
    finally { setBusy(false); }
  };
  const clear = async () => {
    setBusy(true); setError('');
    try { setStatus(await window.interviewAPI.clearEmbeddingIndex()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not clear the semantic index.'); }
    finally { setBusy(false); }
  };

  return (
    <section className="knowledge-search-panel">
      <div><strong>Knowledge search</strong><span>{status?.exists ? `Semantic index · ${status.entryCount} chunks` : 'Keyword search active'}</span></div>
      <div className="knowledge-search-actions">
        <button type="button" disabled={busy} onClick={() => void rebuild()}>{busy ? 'Working…' : status?.exists ? 'Rebuild index' : 'Build semantic index'}</button>
        {status?.exists && <button className="is-clear" type="button" disabled={busy} onClick={() => void clear()}>Clear</button>}
      </div>
      <small>Indexing starts only when you click. If it is unavailable, answers automatically use local keyword search.</small>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
