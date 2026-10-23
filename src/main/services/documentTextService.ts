import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

/** Extract once at import; answering continues to use the existing local text store. */
export async function extractDocumentText(filePath: string): Promise<string> {
  const size = (await stat(filePath)).size;
  if (size > 10 * 1024 * 1024) throw new Error('Choose a document smaller than 10 MB.');
  const data = await readFile(filePath);
  let text: string;
  try {
    if (path.extname(filePath).toLowerCase() === '.docx') {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({ buffer: data })).value;
    } else {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(data), isEvalSupported: false });
      try {
        const info = await parser.getInfo();
        if (info.total > 100) throw new Error('Choose a PDF with at most 100 pages.');
        text = (await parser.getText({ pageJoiner: '' })).text;
      } finally { await parser.destroy(); }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/100 pages/.test(message)) throw error;
    if (/password|encrypted/i.test(message)) throw new Error('This document is password-protected. Import an unlocked copy.');
    throw new Error('Could not read this document. Check that it is a valid PDF or Word .docx file.');
  }
  text = text.replace(/\u0000/g, '').replace(/\r\n?/g, '\n').trim();
  if (!/[\p{L}\p{N}]/u.test(text)) throw new Error('No readable text found. For a scanned PDF, export a searchable PDF or import a Word/text copy.');
  if (Buffer.byteLength(text, 'utf8') > 240 * 1024) throw new Error('This document contains too much text. Import just the resume or relevant pages.');
  return text + '\n';
}
