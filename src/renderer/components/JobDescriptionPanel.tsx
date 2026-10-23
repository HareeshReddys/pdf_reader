import { useEffect, useState } from 'react';
import './JobDescriptionPanel.css';

export default function JobDescriptionPanel() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    window.interviewAPI.getJobDescription().then(value => { setText(value); setSaved(value); })
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Could not load the job description.'))
      .finally(() => setBusy(false));
  }, []);
  const save = async (value: string) => {
    setBusy(true); setError('');
    try {
      const result = await window.interviewAPI.saveJobDescription(value);
      setText(result); setSaved(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save the job description.'); }
    finally { setBusy(false); }
  };
  return (
    <section className="job-description-panel" aria-label="Job description">
      <details>
        <summary>Job description <span>{saved ? 'Role context active' : 'Optional · add before starting'}</span></summary>
        <label htmlFor="job-description">Paste the JD to tailor answers to this role.</label>
        <textarea id="job-description" value={text} maxLength={24000} disabled={busy}
          onChange={event => setText(event.target.value)} placeholder="Role, responsibilities, required skills, and company context…" rows={6} />
        <div className="job-description-actions">
          <button type="button" disabled={busy || text === saved} onClick={() => void save(text)}>{busy ? 'Loading…' : 'Save JD'}</button>
          <button type="button" disabled={busy || (!saved && !text)} onClick={() => void save('')}>Clear JD</button>
          <small>{text.length.toLocaleString()} / 24,000{text !== saved ? ' · Unsaved changes' : saved ? ' · Saved locally' : ''}</small>
        </div>
        <p>Save before starting, or continue without a JD. Saved context applies to new AI answers and is sent to your configured AI with the question. Your resume remains the evidence for personal experience. Without AI, local reference answers remain unchanged.</p>
      </details>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
