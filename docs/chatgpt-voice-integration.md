# ChatGPT Voice integration — verified routing

All three currently visible Windows Volume mixer entries named ChatGPT are configured with input **Voicemeeter Out B1** and output **Voicemeeter AUX Input**. Windows default input remains the user's physical microphone; this setup no longer requires changing it to B1. Assigning every ChatGPT session also affects other ChatGPT dictation sessions, including those the user may use here.

## Signal path

Interview/test playback must target **Voicemeeter Input (VAIO)**. Strip 3 sends it to B1 and to A1, whose hardware output is the real Realtek speaker. Physical input strips 0–2 are disconnected from B1. ChatGPT output targets AUX, whose A/B routes are disabled. Normal Realtek playback alone does not automatically enter B1.

The existing conversation contains direct-answer instructions. The overlay's Voice text Start/Stop control mirrors new written replies through the native accessibility reader. It does not start Voice or configure audio. Start the mirror before the question to observe that question's response. Local assistant mode and Voice mirroring are mutually exclusive.

## Actual acceptance results, 2026-10-16

After correcting all three session assignments, continuous Voice recognized a synthesized React rendering/committing question and produced the correct written answer. The preloaded question was triggered 3 ms after Voice-active status was observed; this is playback-trigger timing, not acoustic latency.

Four further real spoken questions passed the full path: VAIO audio -> ChatGPT Voice -> native reader -> actual overlay. First visible answer text after synthesized speech ended:

| Question | Seconds |
|---|---:|
| React virtual DOM | 1.918 |
| JavaScript closures | 2.632 |
| Database index | 2.405 |
| HTTP idempotency | 3.334 |

Mean: **2.572 seconds**. These measure first partial answer text, not complete answers. The benchmark verifies transport and visible text; it does not grade the full technical answer or guarantee interview latency.

A final **silent** test disconnected VAIO from real speakers (Strip 3 A1 off; A2/A3 already off) while retaining B1. ChatGPT recognized “What is a JavaScript promise?” and the actual overlay displayed the answer, with first-text latency 3.079 seconds. This confirms direct virtual-input reception without acoustic pickup. A1 was restored after the test. It does not independently prove physical-microphone speech rejection during a simultaneous human-speaking challenge.

Evidence:
- data/logs/voice-audio-benchmark.json
- data/logs/voice-audio-silent-b1-e2e.json
- data/logs/immediate-voice-playback.json

The parser removes accessibility response announcements and duplicate text. The status probe now queries the required controls directly instead of caching the entire changing UI tree. The audio harness waits for playback to finish even when a reply appears early. Type checking, production build, parser tests and actual overlay tests are the relevant local checks.

## Repeat tests

```powershell
npm.cmd run test:voice-mirror
npm.cmd run test:virtual-audio
npm.cmd run test:voice-audio-e2e
npm.cmd run benchmark:voice-audio
```

Voice must already be active with its microphone enabled and speakers muted for the automated end-to-end harness. The immediate-start probe preloads audio and waits for Voice activation:

```powershell
$env:VOICE_PROBE_OUTPUT='vaio'
node scripts/run-electron.cjs scripts/probe-immediate-voice.cjs
```

This is an experimental English accessibility integration, not a supported ChatGPT API. It can show only text exposed by ChatGPT. It preserves the displayed answer on stop, does not save partial snapshots to history, and introduces no reveal animation of its own. ChatGPT may expose text gradually. New or restarted audio sessions may need their device assignments checked again.

Visibility recovery: showOverlay now places the existing overlay within the primary display work area, restores it, and brings it above other windows. The original controls and layout remain unchanged. The --voice-practice launch option opens it with the text mirror active; passing --show-overlay to an existing instance restores the overlay. Type checking, production build, and scripts/smoke-overlay-visibility.cjs passed. Interview playback is held until the user confirms the floating box is visible.

Overlay input/resize correction: removed periodic setAlwaysOnTop/moveTop reassertion and the automatic ChatGPT scroll-button invocation. The overlay remains natively topmost but is non-focusable and uses showInactive. Plain Shift+Left/Right and the legacy Ctrl+Z prefix no longer intercept editor input; question navigation uses Ctrl+Alt+Left/Right. A bottom-right resize grip uses sender-validated typed IPC to resize the transparent window, including in click-through mode. Resized dimensions survive hide/show. Type checking, production build, parser, Voice mirror and native overlay resize/focus regression checks passed. Physical mouse dragging still needs user verification.
