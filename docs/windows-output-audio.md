# Windows output-only assistant — 2026-10-16

## Root cause and change

The prior call-output service returned an empty list on Windows. AudioPanel then
selected a microphone, which mixed interviewer playback with the candidate's
speech and fed both into question detection.

Assistant mode now offers output sources only. Windows uses native loopback of
the default speaker/headphone output; Linux retains PulseAudio output monitors.
Missing output, access failure and disconnected output stop capture. The renderer
has no microphone fallback, and source refresh never requests mic permission.

The Windows media grant is limited to the main window's own main frame and an
audio request. Electron requires a video grant for getDisplayMedia, so the app
grants its own frame and immediately stops the video track. The audio path does
not save, inspect or send those frames. Audio remains in memory and uses local
Whisper transcription as before.

## Verification

- TypeScript checks and production build.
- Native Windows loopback captured a controlled output tone; audio was live,
  video stopped immediately, microphone requests were zero, tracks released.
- Foreign-frame and non-audio requests rejected.
- UI/overlay start, hold, stop, track release and capture-failure tests, including
  zero microphone requests after failure.
- Assistant question scheduling and source-list regression tests.
- Full real playback test using synthesized speech: “What is CSS Grid? Explain
  how rows and columns work.” The actual assistant captured speaker output,
  local Whisper returned the question, question detection accepted it, and the
  app displayed the matching CSS Grid reference answer. No microphone opened.

Commands: `npm run test:windows-loopback`,
`npm run test:windows-spoken-question`, `npm run test:overlay-assistant`,
`npm run test:assist-turns`. The spoken test uses the existing local model cache
through a temporary junction and removes that junction before cleanup. It does
not delete cached models or change user notes/history.

## Scope

Route meeting playback to the Windows default speaker/headphone output before
starting. This captures playback, not a particular speaker's identity: other
applications and microphone monitoring/meeting echo on that output are included.
Locally spoken voice outside the playback stream is excluded by source selection.
No frequency filter, enrolled speaker identification, or overlapping-speaker
separation has been implemented. The synthesized-question test is controlled
validation, not certification of every accent, meeting setup, or interview.

Electron's [display-media documentation](https://www.electronjs.org/docs/latest/api/session#sessetdisplaymediarequesthandlerhandler-opts)
describes Windows `loopback` capture. Frequency alone is not used to infer
speaker identity.
