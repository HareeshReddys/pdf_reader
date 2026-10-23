# Interview Prep Copilot

This repository contains a local Ubuntu desktop application for interview preparation, coding practice, and meeting notes.

## MVP boundaries

- Use Electron, React, TypeScript, and Vite.
- Keep notes and session history on the local machine.
- Accept `.txt`, `.md`, Word `.docx` and text-based `.pdf` notes. Extract Word/PDF text locally once at import into the existing text store; preserve source filenames for citations and do not add document parsing to the answer path. Report unreadable, scanned-only, corrupt or locked documents clearly. Legacy `.doc` requires saving as `.docx` first.
- Search notes with simple keyword overlap and return the best three to five snippets.
- Use secure, typed IPC between the renderer and Electron main process.
- Never hardcode API keys. Read `OPENAI_API_KEY` from `.env` when API support is enabled.
- Do not add audio recording, screen capture, OCR, overlays, browser control, or background monitoring in this version.
- Run type checking and a production build after material changes.

## Product behavior

The main window has three areas: notes on the left, a question and its suggested answer in the center, and saved history on the right. Suggestions must show the source note and must not present unmatched material as personal experience.

## User-authorized continuous voice workflow

The user also authorizes automatic Realtime connection handover before the provider's 60-minute expiry. Prepare the replacement while retaining the old connection, reuse the existing selected B1 track, preserve the original context snapshot and interview history group, carry recent conversation and the last confirmed image, and switch only when no turn is in flight. Explicit Stop must abort preparation, close both peers and release tracks; never reopen an input after Stop. Test expiry/renewal with accelerated clocks, failure/retry, late events, image receipt and a live post-handover follow-up from the overlay. Do not claim uninterrupted service under network, quota or device failures.

The user has explicitly extended the original MVP to continuous API voice, speaker-audio input, text-only replies, the existing overlay, and manually requested screenshot context. Verify these flows from the overlay only, with the main window hidden. Use the overlay to start/stop voice, send screenshots, and confirm question/answer text, image receipt, and follow-up answers. Do not use the main app layout as the acceptance surface. Keep this workflow on the existing virtual speaker feed; never silently fall back to a physical microphone or play assistant replies through speakers.

## Interview answer preference

Preserve reading during continuous voice: request answers immediately after accepted transcription, without an added settle timer. Group speech starting within three seconds after the previous answer completes, or during its generation, as a continuation. Use speech-start timing rather than transcript-arrival timing. Meaningful short follow-ups such as "Why?" and "Complexity?" must remain accepted, and uncertain background fragments should not replace answers. Reading hold must keep listening and saving accepted turns; show pending answers explicitly and retain previous answers below the latest. Do not promise a one-second response guarantee or infer candidate speech from the speaker-only feed.

Give the answer the candidate would say directly to the interviewer, in short sentences and plain English. Address what the question assesses rather than imposing a fixed template. Use relevant documented experience for personal answers, never invent it, and keep source labels separate from spoken prose. Avoid coaching phrases such as "you can say", filler, and unsolicited follow-up questions. Keep ordinary answers brief; expand for requested depth or complete code. Preserve the current responsive streaming path: do not add a model call or processing stage for style, or change the working voice timing/model without assessing the trade-off. One-second response time is an aspiration, not a verified guarantee.

Reflect senior technical judgment appropriate to 8+ years: concrete decisions and reasons, relevant trade-offs and failure risks, and verification of outcomes. Use practical reliability, scale, security, maintainability and delivery reasoning when relevant. Do not inflate the candidate's title, ownership, recent hands-on experience or achievements to sound senior.

For self-introduction questions, use the user's approved introduction saved in `knowledge/reference/personal.md` verbatim, preserving its wording and length unless the user requests a change. This takes precedence over the earlier 2-3 minute preference. For resume walkthroughs or when no approved introduction exists, default to 2-3 minutes (roughly 300-360 spoken words), unless a different duration is requested. Present a senior technical professional and Technical Delivery Lead through documented hands-on work, technical judgment, stakeholder communication and delivery outcomes. Use natural paragraphs, plain English, and accurate ownership; avoid tool lists and inflated claims.
