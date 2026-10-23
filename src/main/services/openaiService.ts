import OpenAI from 'openai';
import type { NoteSnippet } from '../../shared/types';
import { buildAnswerPrompt, SYSTEM_PROMPT } from '../../shared/prompts';

export const MISSING_API_KEY_MESSAGE = 'OPENAI_API_KEY is missing. Please add it to your .env file.';

export function isOpenAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY?.trim();
  return Boolean(key && key !== 'your_api_key_here');
}

export async function generateAnswer(question: string, snippets: NoteSnippet[], roleContext = ''): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!isOpenAIConfigured() || !apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna';
  const response = await client.responses.create({
    model,
    instructions: SYSTEM_PROMPT.trim(),
    input: roleContext + buildAnswerPrompt(
      question,
      snippets.map((snippet) => `Source (${snippet.source}): ${snippet.fileName}\n${snippet.content}`),
    ),
  });

  const answer = response.output_text.trim();
  if (!answer) throw new Error('OpenAI returned an empty answer. Please try again.');
  return answer;
}
