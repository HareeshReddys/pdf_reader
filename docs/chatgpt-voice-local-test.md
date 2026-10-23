# ChatGPT Voice local test — not yet validated

The local audio endpoint check found Realtek speaker output and the built-in microphone array. It found no virtual microphone endpoint. Interviewer-only Voice routing cannot be tested with those endpoints alone without using the physical microphone.

The ChatGPT window currently exposes an existing unsent draft with Send and Dictate disabled. Computer Use reported `coordinate input geometry is unavailable` on the separate-tab action, including after refreshing and activating the window. The draft was preserved. No Voice session was started and no microphone audio was submitted.

## Instruction for a fresh test chat

For this mock interview practice session, provide your answers as written text only. Do not speak, read answers aloud, or generate spoken acknowledgements if this Voice mode supports that. Answer the incoming practice question directly, starting with a concise useful answer, then add explanation or code as needed. Do not invent personal work experience. If this mode requires spoken output, state that limitation in text. This instruction does not replace output muting.

## Required routing

Feed only the meeting/test audio into a virtual microphone that ChatGPT uses as its input. Keep the physical microphone out of that route. Independently mute ChatGPT playback or route it to an isolated output that is not fed into the virtual microphone. Keep interviewer audio audible separately. If ChatGPT is running in a browser, a dedicated browser/app audio session may simplify independent output control.

Before relying on it, verify interviewer/test playback is received, physical mic speech is excluded, ChatGPT output is inaudible and cannot feed back, live answer text is accessible while Voice runs, and the actual overlay receives it. Measure speech-end to first useful overlay text. The current desktop bridge supports ordinary text chat only; Voice mirroring has not been implemented or validated.
