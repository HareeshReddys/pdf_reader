/** Only discard utterances made entirely of backchannels; retain short real requests. */
export function isAcknowledgmentOnly(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\b(?:all right|got it|thank you|spot on|fair enough|makes sense|sounds good|thats right)\b/g, ' okay ');
  const words = normalized.trim().split(/\s+/).filter(Boolean);
  return words.length === 0 || words.every(word => /^(?:[hum]+|uhhuh|whom|ah+|oh|yeah|yep|yes|yup|okay|ok|right|alright|sure|thanks|thank|you|got|it|cool|good|great|nice|perfect|exactly|correct|fine|understood|indeed)$/.test(word));
}

/** A conservative request gate, not speaker identification or language detection. */
export function isInterviewRequest(text: string, hasContext = false, logprobs?: { logprob: number }[]): boolean {
  if (isAcknowledgmentOnly(text)) return false;
  text = text.trim().replace(/^(?:(?:yes|yeah|okay|ok|good|right)[,\s]+)+/i, '');
  const words = text.trim().split(/\s+/);
  if (logprobs?.length && logprobs.reduce((sum, token) => sum + token.logprob, 0) / logprobs.length < -1.5) return false;
  const shortRequest = /^(?:why|how|complexity|time complexity|space complexity|example|examples|code|continue|go on|explain that|show code|show an example|what about (?:time|space|performance))\s*[?.!]*$/i;
  if (shortRequest.test(text.trim())) return true;
  if (/^(?:what|why|how|when|where|which|who|can you|could you|would you|tell me|walk me|explain|describe|compare|design|implement|write|show|calculate|please|let'?s|i want you|i would like|suppose|imagine|assume|consider|given|you have|you are|in your experience|talk about|discuss)\b/i.test(text.trim())) return true;
  if (hasContext && /^(?:and|also|but|instead|then|specifically|for example|what if|in that case|there is|there's|it should|line (?:number )?\d+)\b/i.test(text.trim())) return true;
  const technical = /\b(?:api|code|function|closure|react|node|javascript|typescript|java|spring|database|sql|redis|kubernetes|docker|aws|complexity|algorithm|memory|performance|thread|async|await|promise|error|bug|spelling|bracket|line|capital|cache|index|transaction)\b/i;
  if (technical.test(text) && (words.length >= 3 || /\?\s*$/.test(text))) return true;
  // Longer coherent turns remain eligible, including multilingual questions.
  return words.length >= 6 && /[?？]\s*$/.test(text);
}
