import OpenAI from 'openai';
import type { SessionItem } from '../../shared/types';
import { isOpenAIConfigured, MISSING_API_KEY_MESSAGE } from './openaiService';

export async function generateSessionReview(session: SessionItem): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!isOpenAIConfigured() || !apiKey) throw new Error(MISSING_API_KEY_MESSAGE);
  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna',
    instructions: 'Review an interview practice response. Be concise and constructive. Return Markdown sections: Strengths, Weak areas, Better answer structure, Follow-up questions, Recommended practice topics. Do not invent personal experience.',
    input: `Question:\n${session.question}\n\nSuggested answer:\n${session.answer}\n\nTranscript:\n${session.transcript || 'None'}\n\nOCR context:\n${session.ocrText || 'None'}\n\nSources:\n${session.snippets.map((item) => `${item.fileName}: ${item.content}`).join('\n\n') || 'None'}`,
  });
  const feedback = response.output_text.trim();
  if (!feedback) throw new Error('OpenAI returned an empty session review.');
  return feedback;
}
