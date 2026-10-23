export type VoiceReply = { question: string; answer: string };

function questionAt(text: string, user: number): string | undefined {
  let question = text.slice(user + 'You said:'.length).split('ChatGPT said:')[0].split('You said:')[0];
  for (const boundary of ['\nWorked for ', '\nScroll to bottom', '\nLatest response', '\nAdd files and more', '\nAsk ChatGPT', '\nWork with ChatGPT']) {
    const end = question.indexOf(boundary);
    if (end >= 0) question = question.slice(0, end);
  }
  question = question.replace(/\n\d{1,2}:\d{2}\s*[AP]M\s*$/i, '').trim();
  return question && !/^(?:\(?no content\)?|user attachment|image\.png)$/i.test(question) ? question : undefined;
}

function latestQuestionIndex(text: string): number {
  let index = text.lastIndexOf('You said:');
  while (index >= 0) {
    if (questionAt(text, index)) return index;
    index = index > 0 ? text.lastIndexOf('You said:', index - 1) : -1;
  }
  return -1;
}

/** Attachment-only placeholders must not replace the latest spoken question. */
export function parseVoiceQuestion(document: string): string | undefined {
  const text = document.replace(/\uFFFC/g, '').replace(/\r/g, '');
  const user = latestQuestionIndex(text);
  return user >= 0 ? questionAt(text, user) : undefined;
}

/** Select written answer blocks from the latest user turn, excluding short spoken acknowledgements. */
export function parseVoiceReply(document: string): VoiceReply | undefined {
  const text = document.replace(/\uFFFC/g, '').replace(/\r/g, '');
  const user = latestQuestionIndex(text);
  if (user < 0) return;
  const turn = text.slice(user + 'You said:'.length);
  const blocks = turn.split('ChatGPT said:');
  if (blocks.length < 2) return;
  blocks.shift();
  const question = parseVoiceQuestion(document);
  const answers = blocks.map(block => {
    let answer = block;
    for (const boundary of ['\nChatGPT can make mistakes', '\nRead aloud', '\nShare\n', '\nMore actions', '\nWorked for ', '\nScroll to bottom', '\nLatest response', '\nAdd files and more', '\nAsk ChatGPT', '\nWork with ChatGPT']) {
      const end = answer.indexOf(boundary);
      if (end >= 0) answer = answer.slice(0, end);
    }
    // Accessibility announces the completed response before repeating its visible text.
    answer = answer.replace(/^\s*Response(?: complete)?:[^\n]*\n(?=\S)/i, '')
      .replace(/^\s*Response(?: complete)?:\s*/i, '')
      .replace(/^\s*Response complete(?:\n|$)\s*/i, '')
      .replace(/^\s*Response started(?:\n|$)\s*/i, '');
    const lines = answer.trim().split('\n');
    for (let size = 1; size <= lines.length / 2; size++) {
      if (lines.length === size * 2 && lines.slice(0, size).join('\n') === lines.slice(size).join('\n')) {
        answer = lines.slice(size).join('\n');
        break;
      }
    }
    return answer.replace(/Enable word wrap\nCopy code\n/g, '').replace(/\n(?:Complete|Thinking)\s*$/, '').trim()
      .replace(/^(?:got it[.!]|understood[.!]|let me put that on screen for you[.!])\s*/i, '')
      .replace(/^in short:\s*/i, '').trim();
  }).filter(answer => answer && !/^(?:got it[.!]?|understood[.!]?|let me put that on screen for you[.!]?|i['’]ll put it on your screen all at once[.!]?|it['’]s shown there now[.!]?)$/i.test(answer));
  if (!answers.length || !question) return;
  // Voice can finish an older spoken/written block after the next user turn.
  // Prefer the latest substantive reply instead of joining it to that old block.
  return { question, answer: answers[answers.length - 1] };
}
