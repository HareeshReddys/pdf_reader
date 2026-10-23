import type { NoteSnippet } from '../../shared/types';

function extractKeyPoints(snippets: NoteSnippet[]): string[] {
  const points: string[] = [];
  for (const snippet of snippets) {
    const sentences = snippet.content
      .split(/(?<=[.!?])\s+|\n+/)
      .map((sentence) => sentence.trim().replace(/^[-*]\s*/, '').replace(/`/g, ''))
      .filter((sentence) => (
        sentence.length >= 20
        && !/^#{1,6}\s/.test(sentence)
        && !/^source:/i.test(sentence)
        && !/^```/.test(sentence)
      ));
    for (const sentence of sentences) {
      if (!points.some((point) => point.toLowerCase() === sentence.toLowerCase())) {
        points.push(sentence.length > 240 ? `${sentence.slice(0, 237)}...` : sentence);
      }
      if (points.length === 3) return points;
    }
  }
  return points;
}

export function generateLocalSuggestion(question: string, snippets: NoteSnippet[]): string {
  if (snippets.length === 0) {
    return [
      'Short answer',
      `I could not find relevant context for “${question}” in the local knowledge base.`,
      '',
      'Key points to mention',
      '- Add a note for this topic or update the built-in reference library.',
      '',
      'Practical example',
      'No source-grounded example is available yet.',
      '',
      'Follow-up risk',
      'Be ready to explain a concrete example after adding the missing context.',
    ].join('\n');
  }

  const points = extractKeyPoints(snippets);
  const primary = points[0] ?? snippets[0].content.slice(0, 240);
  const example = points.find((point) => /\b(real )?example\b/i.test(point))
    ?? points[1]
    ?? `Use the details in ${snippets[0].fileName} as your concrete example.`;
  const bulletPoints = (points.length > 0 ? points : [primary]).map((point) => `- ${point}`);

  return [
    'Short answer',
    primary,
    '',
    'Key points to mention',
    ...bulletPoints,
    '',
    'Practical example',
    example,
    '',
    'Follow-up risk',
    snippets[0].source === 'personal'
      ? `Expect a deeper question about your specific contribution or trade-offs. Review ${snippets[0].fileName} before answering.`
      : `Expect a follow-up about when to use this technique, its trade-offs, or a concrete command. Review ${snippets[0].fileName} before answering.`,
  ].join('\n');
}
