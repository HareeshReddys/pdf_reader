# Roadmap

## Phase 1 — Basic app (complete)

- Electron desktop shell
- Three-panel React interface
- Manual question entry and answer display

## Phase 2 — Knowledge base (complete)

- Text and Markdown note import
- Local keyword search
- Built-in full-stack reference library and repeatable source sync
- Source-grounded suggestion cards

## Phase 3 — Audio and transcription (complete)

- One explicit Start/Stop assistant-mode control
- Local Whisper transcription through Transformers.js in the Electron main process
- Transcript display, question detection, sourced suggestions, and session history
- Permission, missing-device, recording, local-model, and empty-transcript errors

The earlier OpenAI answer fallback remains wired with environment-based configuration and local-first routing. Its live request verification also waits for a real API key.

## Phase 4 — Manual capture and OCR (complete)

- Explicit screen/window source selection
- One-time capture through Electron `desktopCapturer`
- Local Tesseract OCR with temporary-file cleanup
- OCR question detection and context-engine integration

## Phase 5 — Context engine (complete)

- Manual, transcript, OCR, note, and history inputs
- Clean question selection, sourced answer, follow-up, and confidence output

## Phase 6 — Floating overlay (complete)

- Visible always-on-top Electron window
- Main-window and `Ctrl+Shift+O` toggles
- Latest question, compact answer, key points, and follow-up risk

## Phase 7 — Continuous assist (complete)

- The same single assistant-mode start and stop controls with recording indicator
- Speech-activity segmentation with a maximum-duration safeguard
- Selectable physical-microphone or PulseAudio monitor input with source labels
- Duplicate filtering, answer cache, and immediate capture stop
- Accumulated transcript saved locally

## Phase 8 — Better search (complete; live API test pending)

- Explicit build/rebuild/clear semantic-index controls
- Local persisted chunks and vectors
- Automatic keyword fallback on every embeddings failure boundary

## Phase 9 — Export and review (complete; live API test pending)

- Filterable session library and detailed preview
- Selected/all Markdown and JSON export
- Transcript, OCR, detected question, weak areas, follow-up, and practice topics in Markdown
- On-demand OpenAI improvement feedback

No feature records audio or captures the screen without a visible user action. Screen capture remains manual; assist mode captures only the selected audio input and stops from its visible control.
