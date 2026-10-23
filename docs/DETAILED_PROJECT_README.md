# Interview Prep Copilot

Interview Prep Copilot is a local Ubuntu desktop app for practicing interview questions with your own resume, project notes, prepared Q&A, and a built-in full-stack interview reference. Enter a question and the app finds the most relevant passages, presents concise answer points, and saves the session locally.

The app works without an API key. Local reference matches are normally displayed verbatim. Resume-based synthesis and optional job-description tailoring can send relevant local context to the configured Codex CLI or OpenAI provider; without AI, local reference answers remain unchanged.

## Continuous API voice

The user-authorized automatic handover starts preparing a replacement Realtime connection after 55 minutes, before the provider's 60-minute session limit. The current connection keeps listening while its replacement is prepared using the same B1 track, original resume/JD/instruction snapshot and model. At a quiet point with no answer, transcript, screenshot or save in flight, the replacement receives recent conversation text (up to 20 turns, bounded to 16,000 characters) and the latest confirmed screenshot; context receipt is checked before switching. The interview history group, reading hold and displayed answer are retained. Older turns remain in local history but are not all replayed. Preparation failure retains the old connection and retries after 30 seconds. Stop cancels preparation and closes both connections without reopening an input. Overlapping preparation briefly uses two API connections; network failure, exhausted quota or an unavailable audio device can still interrupt service. Run `npm run test:realtime-renewal` for accelerated mocked coverage, or `npm run test:realtime-renewal-live` for a billable live handover with an accelerated timer and post-handover image follow-up.

Resume/project imports accept Word `.docx`, text-based `.pdf`, `.txt` and `.md` files. Word/PDF text is extracted locally once at import and saved as `<original-filename>.txt`; originals are unchanged. Use a name containing resume, CV, profile, experience or project to include it in voice candidate context. Stop and start voice after importing. Documents are limited to 10 MB, PDFs to 100 pages, and extracted text to 240 KB. Image-only/scanned PDFs need a searchable-text export; locked files need an unlocked copy. Save legacy `.doc` files as `.docx` first. Run `npm run test:document-import` for the overlay import and context checks.

Accepted voice transcripts request an answer immediately, without an added settle delay. A new question whose speech starts within three seconds after the previous answer completes is combined with that question; speech starting while an answer is generating also queues a combined follow-up. The window uses speech-start time, not delayed transcript delivery, and does not require an "and" or "also" prefix. This is a timing heuristic: speaker-only capture cannot tell whether the candidate has begun answering into a separate microphone. A conservative request filter ignores acknowledgments, unrelated short fragments and very low-confidence transcripts when confidence is available; it keeps short follow-ups such as "Why?", "Complexity?", "Example?" and "Show code". It is not speaker identification and cannot remove every background voice already mixed into call audio.

In the overlay, **Keep answer** holds the current answer while voice continues and new complete turns are saved. Scrolling down also enables this hold. **New answer ready · Show** (or Next when an answer is pending) opens the latest saved answer, with recent previous answers below. **Resume live answers** allows automatic updates again; Previous/Next continue to review the conversation. Code and prose share the Background slider without another opaque code layer.

For the requested overlay workflow, launch `npm run start:overlay`. The main controller stays hidden. Use **API voice · Start**, **Screen**, and **API voice · Stop** in the overlay. The overlay shows screenshot receipt and voice errors; it is the acceptance surface for voice tests. Main-window answer rendering is not used as evidence for this workflow.

Add your own `OPENAI_API_KEY` to the local `.env` file and fund the API project. Do not paste the key into chat or renderer code. The optional model setting is `OPENAI_REALTIME_MODEL=gpt-realtime`; see `.env.example`. The app reads the key again when you press **Start continuous voice**, so adding it does not require an app restart.

In **Continuous voice**, leave **Speaker audio · Voicemeeter B1 (automatic)** selected and press **Start continuous voice**. The existing Windows/call playback route must feed Voicemeeter Input or AUX Input with its B1 route enabled. Physical microphone strips must not be routed to B1 for speaker-only capture. Windows default playback must be Voicemeeter Input (or AUX Input for a communications app); direct Realtek playback bypasses B1. Voicemeeter forwards A1 to the physical Realtek speakers. On Windows the app reopens the installed Voicemeeter Banana mixer if it is closed; it does not install a mixer or change Windows default devices automatically. Use `npm start` for the main window and `npm run start:overlay` for the overlay. If B1 is unavailable, Start fails instead of silently opening a physical microphone. An explicit alternate input remains available in the picker. One WebRTC session streams audio with semantic turn detection and acknowledgment filtering, without the local question-classification pipeline. The session requests text-only output and never plays assistant audio. Input transcripts and replies appear in the main window and existing overlay. Every completed, non-interrupted question/answer pair is saved in local history with a practice-session ID. Ctrl+Alt+Left/Right and the overlay Previous/Next controls browse only that conversation. Stop retains the conversation for review; the next successful Start begins a fresh navigation group. Older archives remain available in saved history but are excluded from these shortcuts. An input transcript can arrive later than the answer; until then the UI explicitly labels it pending. Transcript text is a display aid and can differ from what the audio model understood. At each Start, the voice session loads a snapshot of the saved JD, curated personal profile, and imported resume/project notes. Follow-ups use the same session context.

Keep the application running; its main renderer uses `backgroundThrottling: false` and the connection does not depend on ChatGPT desktop focus. **Stop voice** or **API voice · Stop** in the overlay closes the peer connection and releases audio tracks. Automatic session renewal reuses the existing selected audio track and stops when you press Stop; it never reopens a microphone. A full app exit ends voice. API usage is billed separately from a ChatGPT subscription.

In the overlay, expand **Context** to inspect the source filenames, import a `.txt` or `.md` resume/project note, and save or clear the JD. Name imported personal files with resume, CV, personal, profile, experience, or project so they are included. Stop and start voice after changing context. Personal notes are limited to 24,000 characters total (16,000 per file), and the JD to 12,000; the overlay indicates shortening. Technical reference examples are excluded from personal evidence. Answers cite candidate sources; undocumented incidents must be labeled hypothetical, and JD requirements must never become claimed experience. Run `npm run test:realtime-context-live` for the live overlay resume, incident, and follow-up checks.

For image context, choose a window/screen and press **Send screenshot as context**. The screenshot is compressed to fit the negotiated data-channel limit; a preview shows the transmitted image. After **Screenshot received**, analysis is requested immediately in the same conversation. A visible question is answered without waiting for speech; later spoken questions can refer to the retained image. The overlay's **Screen** button and screenshot shortcut target this same session while API voice is active, using the chosen source or the first display source. No screenshots are captured automatically. Detailed code may require a focused window to preserve legibility. Receipt timeouts do not automatically resend. Acknowledgment-only audio such as “hmm,” “uhum,” “good good,” “nice,” “yeah,” and “okay” is discarded before requesting a response and never cancels the answer being read. Meaningful spoken turns wait for input transcription before requesting a response; this can add some latency. New requests queue behind an answer already streaming.

The project API key stays in Electron's main process. The renderer receives the SDP answer, not the key, through typed IPC scoped to the main window. Stop/screenshot commands from the overlay are routed back to that controller. Legacy transcription and desktop-mirroring controls are in a separate collapsed section and cannot start while continuous API voice is active.

Validation: `npm run typecheck`, `npm run build`, and `npm run test:realtime-voice`. The latter runs the actual React panel, preload IPC, overlay updates, local persistence and screenshot acknowledgement with mocked WebRTC/API transport. `npm run test:realtime-speaker-live` is a separate billable test using the funded key, real WebRTC, native B1 input, and synthesized test questions played into VAIO from IntelliAssist's own renderer. It verifies arithmetic and JavaScript replies in both layouts, native capture of an app-owned warehouse fixture, image receipt and a 96-bolt answer, and a 120-bolt follow-up without a second screenshot. The test fixture is exposed in the picker only by the harness; normal app-owned windows remain excluded. Evidence is saved to `data/logs/realtime-speaker-e2e.json`. The complete live flow passed on the tested Windows/Voicemeeter configuration. Other call apps, input devices, virtual desktops and interruption timing still require their own verification; this result is not a universal audio-routing guarantee.

Official references: [WebRTC connection](https://developers.openai.com/api/docs/guides/voice-webrtc?voice-api=realtime), [conversation and image events](https://developers.openai.com/api/docs/guides/realtime-conversations), and [semantic turn detection](https://developers.openai.com/api/docs/guides/realtime-vad).

## Optional job description

Before starting, expand **Job description** above the assistant controls, paste the role description, and click **Save JD**. You can continue without it. The saved JD persists locally across restarts and guides new AI answers from manual questions, voice, and screen context. It is sent to your configured AI provider along with the question and relevant evidence. Resume/project notes remain the evidence for personal claims; JD requirements are never evidence of your experience. **Clear JD** disables tailoring. Changing the JD invalidates cached answers; an answer already in progress or displayed is not rewritten. Run `npm run test:job-description` for the sandboxed UI/persistence checks and `npm run test:personal-context` for CLI role-context and grounding checks.

## Current features

- Electron desktop app with a React and TypeScript interface
- Three-panel workspace for notes, questions and answers, and history
- Native multi-file import for `.txt` and `.md` files
- A built-in reference generated from 68 full-stack topic pages and 1,112 interview sections
- Local note storage, phrase-aware search, aliases, and heading-weighted ranking
- Verbatim reference answers with preserved bullets and code examples
- Three to five top source snippets per question
- Interview-ready answer sections: short answer, key points, practical example, and follow-up risk
- Local JSON session history
- Export a selected history item as Markdown
- Export the complete practice history as Markdown
- Delete individual saved history items
- Empty, loading, success, no-match, and error states
- Context-isolated, sandboxed renderer with a narrow IPC API
- Runtime status showing whether the optional OpenAI fallback is configured
- One assistant-mode control for microphone capture, local Whisper transcription, question detection, and answer updates
- Speech-activity boundaries that respond after a pause instead of a fixed timer
- Selectable audio inputs, including an Ubuntu PulseAudio monitor when available for call/system audio
- Candidate-response guard that ignores room-microphone speech resembling the displayed answer
- Conversational acknowledgment guard that preserves the current answer for phrases such as “okay” and “haan”
- Selected screen/window capture and opt-in watching, with coding answers through Codex vision; local Tesseract OCR remains available when Codex is disabled
- Shared context engine for manual questions, transcripts, OCR, notes, and history
- Visible always-on-top window that mirrors the complete prepared answer, including headings, bullets, and code
- Optional local semantic index with automatic keyword fallback
- Filterable session review with Markdown and JSON exports
- On-demand OpenAI improvement feedback for a selected session

## Prerequisites

- Ubuntu or another Linux desktop environment
- Node.js 20 or newer
- npm 10 or newer

## Setup

### Open on macOS without VS Code

Double-click **Start App.command** in this project folder. It launches the built app detached from Terminal, so closing Terminal or VS Code will not stop it. Reopening the launcher brings the existing app forward rather than starting duplicate windows. Keep this project folder and its `node_modules` directory in place. The first launch builds only if build output is missing; after source changes, use `npm run build` to refresh it. Startup output is saved locally to `data/logs/launcher.log`. This is a local launcher, not a packaged/signed `.app` installer.

On macOS, the app hides its Dock icon at startup. Use **Command+Option+Z** to toggle window visibility, or reopen **Start App.command** to bring the main window forward.

```bash
npm install
cp .env.example .env
npm run dev
```

The development command starts Vite, compiles the Electron main process, and opens the desktop window. Imported notes are copied to `data/notes/`, and history is written to `data/sessions.json` while running from the repository.

The built-in reference is already available; it does not need to be uploaded through the UI.

## OpenAI API key

OpenAI is optional. To enable answer refinement, add a real key to `.env`:

```dotenv
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-6-luna
LOCAL_TRANSCRIPTION_MODEL=onnx-community/whisper-base.en
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

Do not commit `.env`; it is ignored by Git. With no key or with the example placeholder, generation stays local. All matching reference and personal-note answers remain local even when a key is configured. A real key is used only for an explicitly submitted question that has no confident local match.

## Commands

On Windows, CLI discovery checks `codex.exe` on PATH and the Codex executable
bundled with the VS Code OpenAI extension. This also works when the app is
launched without the editor's PATH. You can override discovery with an absolute
`CODEX_CLI_PATH` in `.env`; use the native executable rather than a `.cmd` shim.
Run `codex login status` to check the existing sign-in. No OpenAI API key is
required for the CLI's ChatGPT login. Restart the app after changing `.env`.
`npm run test:codex-connection` checks discovery and the persistent connection;
`npm run benchmark:codex-latency` makes live requests using your account.

```bash
npm run dev        # run Vite and Electron in development mode
npm run typecheck  # check main-process and renderer TypeScript
npm run build      # create dist/main and dist/renderer
npm run test:knowledge # verify the built-in cherry-pick search and answer
npm run test:sessions  # verify session save, Markdown formatting, and deletion
npm run test:context   # verify question detection and the shared context engine
npm run test:embeddings # verify vector ranking and keyword fallback
npm start          # launch the most recent production build
npm run sync:knowledge # refresh the built-in reference from its source site
```

Run `npm run build` before `npm start` when starting from a clean checkout.

## How to use

1. Optionally select **Add notes** and choose personal `.txt` or `.md` files.
2. Enter an interview question in the center panel; the built-in reference is searched automatically.
3. Select **Prepare answer** or press **Ctrl+Enter**.
4. Review the structured suggestion and its matching source passages.
5. Select an older question in the History panel to reopen its answer.
6. Use **Export** or **Delete** for the selected history item, or export the complete history.
7. Choose the **Call output only** monitor used by your meeting or mock interviewer. Linux native capture uses `pactl` and `parec` to record that output, with no microphone fallback. These tools are available on this Ubuntu installation; other installations need `pulseaudio-utils`. Disable microphone playback/loopback; all applications on the selected output can be heard.
8. Use **Start assistant mode**. Call-output questions run automatically after the completed speech turn settles. Transcription runs independently of answer generation; forced audio splits remain buffered until the question finishes. Stop cancels pending turns and prevents late answers from appearing.
9. Select **I’m answering · hold answer** or press **Ctrl+Alt+Space** to prevent voice and automatic screen answers from replacing the displayed answer. Press again to listen for the next question. The overlay includes the same control.
10. Microphone and call-output questions both answer automatically after a brief settling pause; there is no required confirmation click. A shared microphone cannot identify speakers reliably. Use Hold while answering and **Shift+Right Arrow** or **Next** to resume listening. The current answer remains visible.

Local transcripts pass through a curated interview vocabulary before question detection and search. Observed resume spellings such as “says PSI” and “ShareSci” resolve to SharesEye; spaced technical names and acronyms are normalized consistently. Ambiguous words require relevant context (for example, “reactiveness” needs frontend context), and fuzzy spelling correction considers long technical terms throughout interview question sentences, including comparisons and follow-ups. Longer words allow up to two edits only when one candidate clearly wins. The categorized catalog includes frontend, JavaScript, backend, databases, cloud, security, system design, algorithms, and quality/delivery. Spoken letter/digit acronyms are decoded from known sequences; short ordinary words are not guessed. Ordinary uses of “react,” “as,” and “sequel” remain unchanged. This is local text correction, not a guarantee that Whisper will recognize every spoken word. Add interview terms and aliases in `src/main/services/interviewVocabularyCatalog.ts`, contextual correction rules in `src/main/services/interviewVocabulary.ts` or resume names in `src/main/services/resumeVocabulary.ts`. Run `node scripts/smoke-interview-vocabulary.cjs` after building to check correction and ambiguity cases.

Question detection rejects conversational controls, first-person explanations, incomplete clauses, and noise instead of trusting transcript punctuation. Multiple questions within one speech turn are combined into one request, with the previous accepted turn available as follow-up context. The transient question preview indicates speech is settling, not a request for approval. Repeating the current question does not regenerate it after a 30-second timeout. Stored transcripts label source certainty rather than claiming biometric speaker recognition.

Validation: `scripts/smoke-assist-turns.cjs` replays failures from the mock transcript and checks automatic microphone answering, hold, continuation, duplicate and late-result behavior. `scripts/smoke-call-audio.cjs` uses separate temporary output sinks to verify real native audio isolation without touching microphone capture. `scripts/smoke-assist-ui.cjs` checks output selection, compact overlay controls, question previews and stop lifecycle on supported Linux audio setups. These checks do not substitute for a new spoken mock interview.
8. Use **Choose screen or window** and **Capture screen** to solve the task in the selected source. Enable **Watch selected screen for coding questions** for repeat checks; disable it to stop. Screenshots are sent to the signed-in Codex service. The app cannot detect whether another meeting app is sharing your screen.
9. Use **Show overlay** or **Ctrl+Shift+O** to toggle the complete prepared answer window.
10. Build the semantic index only when desired; keyword search remains available without it.

When no note matches the question, the app states that personal context is missing instead of inventing experience.

## Local data and privacy

Imported notes, sessions, OCR output, the Whisper model, and the optional semantic index are stored locally. Microphone audio is converted to 16 kHz WAV sections in memory and transcribed locally; it is not sent to OpenAI. The local Whisper model downloads once on first use and is then read from the application cache. Screenshot OCR also runs locally and the image is not uploaded. Building or querying the optional semantic index uses the configured embeddings API; keyword search remains the fallback.

## Project structure

```text
src/main/       Electron lifecycle, IPC, and local services
src/renderer/   React interface and styles
src/shared/     Shared types, channels, and prompt definitions
data/notes/     Imported notes during local development
data/sessions.json
knowledge/reference/ Built-in full-stack interview library
scripts/         Reference sync and knowledge smoke test
docs/           Architecture and roadmap
```

## Phase status

- Phase 1 — Electron and React desktop interface: complete
- Phase 2 — built-in and uploaded local knowledge search: complete
- Phase 3 — microphone capture, local Whisper transcription, question detection, and history: complete and locally verified
- Phase 4 — manual screenshot capture and local OCR: complete
- Phase 5 — central context engine: complete
- Phase 6 — visible floating overlay: complete
- Phase 7 — opt-in assist mode with speech-activity segmentation, source labels, deduplication, caching, and accumulated transcript: complete
- Phase 8 — local persisted embedding index with keyword fallback: complete; live index build waits for a key
- Phase 9 — review filters, expanded Markdown/JSON export, and OpenAI feedback wiring: complete; live feedback waits for a key

### Codex fallback and complete source answers

Run `codex login` once using your ChatGPT account. Codex is the default generated-answer fallback for local knowledge misses; this does not require an OpenAI API key. Set `CODEX_ENABLED=false` to restore the previous OpenAI/local fallback. Optional `CODEX_CLI_PATH`, `CODEX_MODEL`, and `CODEX_FAST_MODE` are documented in `.env.example`. Codex uses hosted inference and your account allowance.

Reference answers preserve the complete section and its fenced code. The next section from the same source page appears underneath, verbatim, in both the main and floating windows. The knowledge matcher normalizes common acronyms and question wording without rewriting the stored content. Generated responses use topic headings, bullets, code when appropriate, and an answered follow-up.

Codex stays connected through a private stdio app-server, warms up when the app starts, and streams text into both the main window and overlay before completion. Each question uses an isolated ephemeral thread. Set `CODEX_TRANSPORT=exec` only for older CLI compatibility (no incremental display). Repeated Codex prompts share an in-flight request and cache the result in memory. Screen watching checks every 10 seconds, serializes captures, and skips unchanged images. First-time hosted response latency still depends on the model and network. Screenshots are temporary and removed after the request. Requests time out after 90 seconds with actionable errors.

Run `npm run test:codex` for routing, code preservation, question variants, overlay payload, screenshot routing, caching, and failed-start regressions.

### Transparent floating window and monitoring shortcuts

The floating window shows the current question, live listening/transcribing/searching/Codex status, elapsed processing time, and the complete answer and code. Its background is translucent; adjust the Background slider to balance visibility and readability. Drag its title to move it. The previous answer stays visible until a new answer is ready.

Codex defaults to `gpt-6-luna`, low reasoning, and Fast mode, with streamed text and a persistent app-server connection. Answers now default to a direct opening sentence and 100–160 words for concepts/scenarios; complete coding solutions can be longer. Set `CODEX_ANSWER_STYLE=detailed` to restore the longer format. Local source answers remain verbatim. `data/logs/runtime.log` records `codex-first-text` and `codex-answer-completed` timings (no question or answer text); cache hits are recorded separately. A one-to-two-second first response is a target, not a latency guarantee. Run `npm run test:codex-latency` for offline checks; `npm run benchmark:codex-latency` makes four synthetic requests using your Codex allowance and reports first-text/complete times. Set `CODEX_MODEL` to override the model and `CODEX_FAST_MODE=false` for Standard. Fast mode uses more account allowance. The CLI advertises low as the minimum reasoning setting for Luna and Sol. Set `CODEX_MODEL=gpt-6.1-sol` to return to Sol for comparison or more demanding questions. ChatGPT “Instant” is not a Codex model identifier. This setup prioritizes responsiveness but does not guarantee instant replies. Ultrafast is documented for the Responses API and has higher pricing; this app's CLI path requests Fast, not Ultrafast. The optional API fallback remains separately configured.

### Scenario-based practice

Scenario questions now generate a situational answer rather than returning a loosely matched reference definition. They receive relevant technical sources plus the locally stored resume profile, and any saved JD. The answer gives a short explanation, actionable bullets, trade-offs, a concrete example and one follow-up. Documented project experience is distinguished from hypothetical extensions with “I would”; examples from another candidate's shared chat are not imported into the user's resume. When asked to write an AI prompt, the response should be a prompt rather than implementation code.

`knowledge/reference/interview-scenarios.md` contains synthesized practice variants from the provided shared-chat text: safe million-row updates, crash recovery, bounded I/O concurrency, CPU workers, deployments, migrations, canaries, feature flags, React state, balance-point tests and rate-limiter prompt writing. Original screenshot-only questions were not independently transcribed. Ordinary definition questions keep verbatim local reference behavior; without AI, local notes remain available. Run `npm run test:scenarios` for routing and grounding checks. After building, run `npx cross-env ELECTRON_RUN_AS_NODE= electron scripts/smoke-live-scenarios.cjs` for a real configured-model/Fast response with measured first-text and total latency (uses account allowance).

Watch automatically selects the entire primary display, including when started from the overlay or a shortcut. No window/source selection is needed. macOS may still require Screen & System Audio Recording permission in System Settings. Additional displays are not combined into the capture.

- **Ctrl+Alt+X**: start screen monitoring.
- **Ctrl+Alt+C**: stop screen monitoring.
- **Ctrl+Alt+Z**: capture the whole primary display and send the image to the current ChatGPT conversation, including an active Voice chat.
- **Ctrl+Alt+H**: hide/restore both app windows.
- **Shift+Left Arrow**: show the previous saved question and answer, held while you review. At the oldest question, keep it displayed.
- **Shift+Right Arrow**: show the next saved question and answer. At the latest question, resume listening without clearing the answer. On a changed screen with an unreadable question, it also permits one fresh analysis. An unchanged screenshot is not resubmitted.
- **Ctrl+Alt+P** (Mac also **Command+Option+P**): optionally pass blank-background clicks to tabs/windows underneath. Off by default. Hovering the toolbar, opacity slider, buttons or text restores native interaction even while this mode is enabled. Turn it off to drag or resize normally. The main window also has **Restore overlay clicks**.
- On **Mac**, **Command+Option+X / C / Z** also watch, stop watching, and hide/restore respectively. Control+Option variants remain available.
- **Ctrl+Shift+O**: show/hide the floating window.
- In an app window, **Ctrl+Z then X/C** also starts/stops monitoring.

Monitoring checks the primary display every 10 seconds, not every second. Pixel changes initiate a bounded local OCR question check, not another hosted answer. Extracted question/problem text is compared against the last answered question; editor text, console output and clocks after recognizable UI boundaries are excluded. Same-question changes preserve the current answer and scroll position. New readable questions auto-answer; unreadable/unsupported layouts keep the answer until Next is explicitly used on a changed screen. This is conservative OCR-based text comparison, not perfect semantic understanding of every website. Voice/manual and screen paths avoid answering the same recognized question twice. A single initial vision answer is allowed even when OCR cannot identify the question. OCR language data is cached in `data/cache/ocr`; the first run may download that data. Only changed screenshots approved for answering are sent to Codex. Stopping clears screenshot context and invalidates pending monitoring results.

The overlay stays within its manually resized native window. The answer background fills the available height even for short/empty content; long answers scroll inside it and long questions scroll separately. Header and answer-panel blank areas/padding are native drag regions, while text remains selectable and sliders, buttons, code and scrollbars remain interactive. Native resize edges are kept separate. A microphone icon and listening/speech/off/held state are always visible. Showing the overlay no longer explicitly focuses it. `npm run test:screen-question` covers deduplication, drag/no-drag styles, a real slider input event while background click-through is enabled, fixed short/long panel geometry, Next IPC, scroll bounds and resizing; `npm run test:screen-question-ocr` checks real local OCR with a controlled question/editor fixture. These tests do not certify every external application, physical dragging on every OS, or a Windows desktop session.

The overlay has separate **Watch** and **Stop watch** buttons. After an answer is ready, use Stop watch while writing: the completed answer stays visible and no more screenshots are captured until you click Watch or press its shortcut. Voice assistant mode continues independently.

Both app windows request native content protection before appearing. Windows uses Electron's native capture exclusion; verification with the actual meeting software is still required. On modern macOS, ScreenCaptureKit can include protected windows, so a visible overlay cannot be guaranteed absent from another app's whole-screen share. Use Ctrl+Alt+H (Command+Option+H on Mac) to hide both windows before sharing; monitoring continues while hidden. There is no automatic detection of sharing in other apps.

The overlay's **Screen** button uses the same typed IPC action as Ctrl+Alt+Z. With `ANSWER_PROVIDER=chatgpt-desktop` and an active ChatGPT Voice conversation, wait for “Screenshot sent”, ask the question aloud, and ask follow-ups in that same session. The bridge verifies both a new image in the conversation and continued Voice controls after submission; it tolerates the Stop control being temporarily replaced by Send while an image is staged. The passive text mirror displays new accessible answers. Existing drafts and attachments are preserved: an uncertain upload is reported and is never automatically resent. The shortcut captures only when explicitly invoked; it does not enable continuous capture. Voice's compact companion is excluded when selecting the full conversation window. When an image picker is unavailable, the native bridge pastes the PNG through accessibility's Edit → Paste action and restores the clipboard if it has not changed.

`npm run test:voice-screen-followup` is an opt-in live test using a fresh conversation and the verified Voicemeeter speaker/B1 route. It starts Voice through accessibility, plays a promise question through the speakers, verifies the actual overlay, displays the current `Questions.js` in a full-screen fixture, invokes the real overlay Screen button through UI Automation, speaks the output question, and asks why F precedes D. It stops if any stage cannot be verified. The VAIO → A1 Realtek speakers + B1 input route must already be configured; the test reads and verifies those mixer settings without changing them. Run the script directly without `VOICE_TEST_ROUTING` for direct Realtek playback instead. Existing drafts and attachments are preserved. Results are written to `data/logs/voice-screen-followup.json`. A passing offline test does not establish that this live flow passed.

CLI-generated answers use conversational explanations: a direct answer, explained bullet points, a practical example/code when relevant, and a short follow-up. Personal experience is never invented.

Broad experience questions such as "Describe your last project" or "Explain a scalable product you built" now send the stored resume-derived `knowledge/reference/personal.md` profile and relevant imported `.txt`/`.md` personal notes to the CLI. Answers use first-person ownership supported by those sources, with project flow and documented impact. Proposed designs and missing implementation details use conditional wording. Other people's examples in the technical reference library are excluded from personal answers. Context is reloaded from the local knowledge base for each request, so it remains available across fresh CLI threads and app restarts. Cached answers include the supplied profile content in their key; updating resume notes refreshes the answer. Run `npm run test:personal-context` for these regressions.

For regular use, run `npm run build` followed by `npm start`. This loads the bundled app without depending on the Vite development server. The macOS overlay appears on all Spaces, including full-screen application Spaces; hiding it deliberately still hides it everywhere.

Watch checks every 10 seconds with one capture at a time. On macOS the main display is captured by a time-limited native screenshot subprocess, avoiding repeated window enumeration in Electron. CLI vision receives still images only when the content changes; it does not ingest live video. Temporary capture/answer failures retry with backoff up to 60 seconds. Local Whisper inference runs in an isolated utility process with a 120-second timeout and restarts after worker failure. Audio queues are bounded; overload is reported in the audio panel rather than accumulating unlimited recordings. Renderer recovery reloads at most twice per minute; a recovered audio panel requires Start assistant mode again.

Small operational logs are stored locally in `data/logs/runtime.log` in development, or the app data directory when packaged. They record lifecycle/failure events, not screenshots, transcripts or answers. `npm run test:screen-capture` performs real primary-display captures and requires screen-recording permission. `npm run test:transcription-worker` verifies worker restart and, on macOS, locally synthesizes test speech for actual Whisper inference.

On Ubuntu, Electron cannot exclude a visible window from whole-desktop screen sharing. Share only a selected browser/IDE window, or use Hide app before sharing the desktop. Hidden windows are also hidden from you. There is no automatic detection of another meeting application's screen-sharing state. Capture-exclusion support in Electron is limited to Windows/macOS; no invisible-to-sharing guarantee is made for Linux.


### CLI response latency and capture exclusion

Two basic live streamed requests showed first text at 3.65s and 3.02s, with complete answers at 5.64s and 5.30s. These are observations on different prompts, not controlled comparisons or guarantees. Connection reuse and incremental display reduce waiting; hosted inference still depends on network, account capacity, model, and answer length. One-to-two-second responses cannot be guaranteed.

An Ubuntu upgrade or Electron dependency update alone does not add capture exclusion for visible windows. A custom compositor or controlled capture feed would require integration with the particular screen-sharing path; arbitrary third-party full-desktop capture cannot be universally excluded. Verify the actual meeting/capture tool before relying on any platform-specific feature.


### Linux capture-protection technical spike

Run `npm run diagnose:capture` for a read-only environment inventory. See [the phase report](docs/capture-spike-report.md), [capture-path analysis](docs/capture-path-analysis.md), and [test matrix](docs/capture-test-matrix.md). Independent experimental harnesses live under `experiments/`; captures stay in ignored `capture-tests/`.

The app exposes a capture-protection status and reports **Unavailable / unverified** on the current Linux system. The XComposite experiment proved only a separate image without the overlay. Ordinary X11, Chromium and Mutter/PipeWire monitor frames still contained it; no full-monitor conferencing exclusion has been implemented or remotely verified. Windows/macOS native requests also do not count as remote verification.

The floating window includes **Assistant off · Start** / **Assistant on · Stop** to control assistant mode using the audio source selected in the main window. Its pause/play button holds or resumes answers while audio stays active. Run `npm run test:overlay-assistant` to verify synchronization and audio start/stop with a silent synthetic stream.
