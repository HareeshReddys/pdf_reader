#!/usr/bin/env node

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_START_URL =
  'https://full-stack-interview-ecru.vercel.app/fullstack-dev/react-fundamentals';
const startUrl = new URL(process.argv[2] ?? DEFAULT_START_URL);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'knowledge', 'reference');

function decodeEntities(value) {
  const named = {
    amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"',
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const radix = code[1]?.toLowerCase() === 'x' ? 16 : 10;
      const digits = radix === 16 ? code.slice(2) : code.slice(1);
      const point = Number.parseInt(digits, radix);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function plainText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function slug(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'other';
}

function discoverPages(html) {
  const aside = html.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/i)?.[1] ?? html;
  const pages = new Map();
  const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings = [...aside.matchAll(headingPattern)];

  for (let index = 0; index < headings.length; index += 1) {
    const category = plainText(headings[index][1]);
    const start = (headings[index].index ?? 0) + headings[index][0].length;
    const end = headings[index + 1]?.index ?? aside.length;
    const section = aside.slice(start, end);
    for (const match of section.matchAll(/<a\b[^>]*href="(\/fullstack-dev\/[^"?#]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      pages.set(match[1], { category, title: plainText(match[2]), route: match[1] });
    }
  }

  return [...pages.values()];
}

function htmlToMarkdown(html) {
  const codeBlocks = [];
  let value = html.replace(/<pre\b[^>]*>[\s\S]*?<code\b[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi, (_all, code) => {
    const token = `\n\n@@CODE_BLOCK_${codeBlocks.length}@@\n\n`;
    codeBlocks.push(decodeEntities(code.replace(/<[^>]*>/g, ''))
      .replace(/^\s*\n|\n\s*$/g, ''));
    return token;
  });

  value = value
    .replace(/<(script|style|svg|button)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]>/gi, (_all, text) => `\n\n### ${plainText(text)}\n\n`)
    .replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_all, row) => {
      const cells = [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
        .map((cell) => plainText(cell[1]));
      return cells.length ? `\n- ${cells.join(' | ')}` : '';
    })
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_all, item) => `\n- ${plainText(item)}`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_all, code) => `\`${plainText(code)}\``)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_all, _tag, text) => `**${plainText(text)}**`)
    .replace(/<(p|ul|ol|table|thead|tbody|div|blockquote)\b[^>]*>/gi, '\n')
    .replace(/<\/(p|ul|ol|table|thead|tbody|div|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  value = decodeEntities(value);
  for (const [index, code] of codeBlocks.entries()) {
    value = value.replace(`@@CODE_BLOCK_${index}@@`, `\`\`\`\n${code}\n\`\`\``);
  }

  return value
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractPage(html, page, url) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error(`No server-rendered <main> found at ${url}`);
  const pageTitle = plainText(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? page.title);
  const headings = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
  if (headings.length === 0) throw new Error(`No <h2> interview sections found at ${url}`);

  const sections = headings.map((heading, index) => {
    const title = plainText(heading[1]);
    const start = (heading.index ?? 0) + heading[0].length;
    const end = headings[index + 1]?.index ?? main.length;
    return `## ${title}\n\n${htmlToMarkdown(main.slice(start, end))}`.trim();
  });

  return {
    markdown: `# ${pageTitle}\n\nSource: ${url}\n\n${sections.join('\n\n')}`.trim(),
    sectionCount: sections.length,
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'InterviewPrepCopilot/0.1 local-reference-sync' },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

const indexHtml = await fetchText(startUrl);
const pages = discoverPages(indexHtml);
if (pages.length === 0) throw new Error(`No /fullstack-dev/* routes found at ${startUrl}`);

const grouped = new Map();
let sectionCount = 0;
for (const [index, page] of pages.entries()) {
  // Ganesh's local profile must never be replaced by the site's author resume.
  if (slug(page.category) === 'personal' || /\/resume\/?$/.test(page.route)) continue;
  const url = new URL(page.route, startUrl.origin).toString();
  const html = page.route === startUrl.pathname ? indexHtml : await fetchText(url);
  const extracted = extractPage(html, page, url);
  sectionCount += extracted.sectionCount;
  const entries = grouped.get(page.category) ?? [];
  entries.push(extracted.markdown);
  grouped.set(page.category, entries);
  process.stdout.write(`\rFetched ${index + 1}/${pages.length} pages`);
}

await mkdir(outputDirectory, { recursive: true });
for (const entry of await readdir(outputDirectory, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'personal.md') {
    await rm(path.join(outputDirectory, entry.name));
  }
}

for (const [category, documents] of grouped) {
  const header = [
    `# ${category} interview reference`,
    '',
    `Generated from ${startUrl.origin}/fullstack-dev/ for local search.`,
    '',
  ].join('\n');
  await writeFile(
    path.join(outputDirectory, `${slug(category)}.md`),
    `${header}${documents.join('\n\n---\n\n')}\n`,
    'utf8',
  );
}

process.stdout.write('\n');
console.log(`Wrote ${grouped.size} category files from ${pages.length} pages and ${sectionCount} sections.`);
