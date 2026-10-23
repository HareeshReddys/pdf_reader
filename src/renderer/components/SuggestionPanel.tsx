import type { ReactNode } from 'react';
import type { AnswerResponse } from '../../shared/types';

type SuggestionPanelProps = {
  result: AnswerResponse | null;
  loading: boolean;
  error: string | null;
};

function inlineContent(value: string, keyPrefix: string): ReactNode[] {
  return value.split(/(`[^`]+`)/g).filter(Boolean).map((part, index) => (
    part.startsWith('`') && part.endsWith('`')
      ? <code key={`${keyPrefix}-code-${index}`}>{part.slice(1, -1)}</code>
      : part
  ));
}

export function AnswerBody({ answer, verbatim, plainText = false }: { answer: string; verbatim: boolean; plainText?: boolean }) {
  if (plainText) return <div className="answer-body"><p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{answer}</p></div>;
  const lines = answer.split('\n');
  const headings = new Set(['short answer', 'key points to mention', 'practical example', 'follow-up risk']);
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('```')) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push(<pre className="answer-code" key={`code-${index}`}><code>{code.join('\n')}</code></pre>);
      continue;
    }

    const markdownHeading = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (markdownHeading || headings.has(trimmed.toLowerCase())) {
      const heading = markdownHeading?.[1] ?? trimmed;
      blocks.push(<h3 key={`heading-${index}`}>{inlineContent(heading, `heading-${index}`)}</h3>);
      continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const point = trimmed.replace(/^[-*•]\s+/, '');
      blocks.push(
        <div className={`answer-point ${verbatim ? 'reference-point' : ''}`} key={`point-${index}`}>
          <span aria-hidden="true">{verbatim ? '•' : '✓'}</span>
          <p>{inlineContent(point, `point-${index}`)}</p>
        </div>,
      );
      continue;
    }

    blocks.push(<p key={`paragraph-${index}`}>{inlineContent(trimmed, `paragraph-${index}`)}</p>);
  }

  return (
    <div className={`answer-body ${verbatim ? 'reference-answer' : ''}`}>{blocks}</div>
  );
}

export default function SuggestionPanel({ result, loading, error }: SuggestionPanelProps) {
  const verbatim = result?.generationMode === 'reference' || result?.generationMode === 'source';
  if (loading) {
    return (
      <section className="suggestion-shell loading-state" aria-live="polite" aria-busy="true">
        <div className="thinking-orb"><span className="spinner" /></div>
        <h2>Building your answer</h2>
        <p>Searching local sources for the best matching answer…</p>
        <div className="skeleton-lines" aria-hidden="true"><i /><i /><i /></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="suggestion-shell empty-answer" role="alert">
        <span className="state-symbol error-symbol" aria-hidden="true">!</span>
        <h2>Couldn’t prepare an answer</h2>
        <p>{error}</p>
        <span className="state-help">Check the local sources and, if enabled, the OpenAI settings, then try again.</span>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="suggestion-shell empty-answer">
        <div className="answer-illustration" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
        <h2>Your prepared answer will appear here</h2>
        <p>Ask a practice question to search your local notes and turn relevant details into clear talking points.</p>
      </section>
    );
  }

  return (
    <section className="suggestion-shell result-area" aria-live="polite">
      <div className="result-heading">
        <div>
          <p className="eyebrow">{verbatim ? 'Exact source section' : 'Interview-ready suggestion'}</p>
          <h2>{verbatim ? 'Source answer' : 'Suggested answer'}</h2>
        </div>
        <span className="grounded-badge">
          <i /> {verbatim
            ? `${result.generationMode === 'reference' ? 'Reference' : 'Personal note'} · no transformation`
            : result.generationMode === 'openai'
              ? 'OpenAI · generated answer'
              : result.generationMode === 'chatgpt' ? 'ChatGPT desktop · returned reply' : result.generationMode === 'codex' ? 'Codex CLI · generated answer' : result.snippets.length
                ? 'Prepared locally from sources'
                : 'No matching source found'}
        </span>
      </div>

      <article className="answer-card">
        <div className="answer-label"><span aria-hidden="true">✦</span> {verbatim ? 'Original source content' : 'Answer'}</div>
        <AnswerBody answer={result.answer} verbatim={verbatim} />
        {result.relatedAnswers?.map((related, index) => <section className="related-answer" key={index}><AnswerBody answer={related.content} verbatim={true} /></section>)}
        {(result.followUpQuestion || result.confidence) && (
          <div className="answer-insights">
            {result.confidence && <span>Confidence: <strong>{result.confidence}</strong></span>}
            {result.followUpQuestion && <p><strong>Likely follow-up:</strong> {result.followUpQuestion}</p>}
          </div>
        )}
      </article>

      <div className="sources-section">
        <div className="section-title-row">
          <h3>Matching sources</h3>
          <span>{result.snippets.length} {result.snippets.length === 1 ? 'match' : 'matches'}</span>
        </div>
        {result.snippets.length === 0 ? (
          <div className="inline-message neutral-message">
            No relevant notes were found. This answer may be general—add more detail to your notes for a personal response.
          </div>
        ) : (
          <div className="source-list">
            {result.snippets.map((snippet, index) => (
              <article className="source-card" key={`${snippet.fileName}-${index}`}>
                <div className="source-meta">
                  <span className="source-number">{index + 1}</span>
                  <strong>{snippet.fileName}</strong>
                  <span>{snippet.sourceLabel}</span>
                  <span className="relevance">Relevance {snippet.score.toFixed(snippet.score % 1 ? 1 : 0)}</span>
                </div>
                <p>{snippet.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
