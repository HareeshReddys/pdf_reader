# Windows CLI verification — 2026-10-16

Fixed native Windows executable discovery (`codex.exe`, including VS Code's
`windows-x86_64` bundle), shell-free JavaScript entry-point launches, and a
Windows file-lock error caused by disposable working directories held by the
persistent app-server. No API keys or authentication files were changed.

Verified the installed CLI's existing ChatGPT login. Four real streamed requests
to `gpt-6-luna` completed successfully in 6.1–7.7 seconds. Tests use synthetic
fixtures for exec routing, images, personal context, and concurrency.

Passed: TypeScript checking, production build, executable discovery, connection
handshake/concurrency/disposal, latency/streaming/cache, CLI routing, knowledge,
sessions, context, embeddings, personal context, job description UI, scenarios,
assistant turns, overlay assistant, and screen-question comparison.

The full existing suite is **not green**. Broader checks found these failures:

Follow-up: the two native capture assertions below now pass after correcting
their hidden-window lifecycle assumptions. Controlled whole-display capture
tests also pass for the framed window fixture and actual overlay; see
[Windows capture verification](capture-verification-windows.md). The audio
failures below have not been resolved by the CLI/capture work.

- `smoke-assist-ui.cjs`: requires Linux PulseAudio `pactl`, unavailable on Windows.
- `smoke-overlay-monitor.cjs:252`: native content-protection assertion returns false.
- `smoke-capture-protection.cjs:17`: native content-protection assertion returns false.
- `smoke-transcription-worker.cjs:21`: worker validates the invalid WAV before
  termination is observed, yielding “incomplete” rather than “engine stopped”.

These are outside the CLI repair. They have not been hidden or marked as passing.
Physical desktop capture, Linux call-audio capture, and the separate OCR fixture
were not run. The native capture assertions do not establish meeting-app exclusion.
