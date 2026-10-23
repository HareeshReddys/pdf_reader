# Voice flow inspection

Verified locally: the recent React Virtual DOM conversation contains separate brief Voice acknowledgement messages and longer substantive written answers. Taking only the last assistant message can therefore select a spoken fragment rather than the useful written answer.

A typed test in that same conversation requested three concise bullet points comparing rendering, reconciliation, and committing, with no acknowledgements or status preamble. The returned answer started directly with Rendering, Reconciliation, and Committing and satisfied that presentation requirement.

The chat was initially scrolled above its newest messages. Accessibility snapshots exposed older conversation content even after the typed test was submitted. Scrolling to the latest answer exposed the new question and complete written answer. The observed elapsed time to that inspection is not a valid measure of model first-text latency, since navigation and stale/offscreen accessibility content confounded it. No 2–3 second latency claim is established by this test.

Voice capture was not started. The current device inventory still contains only Realtek speaker output and the physical microphone array; no virtual input exists. Physical microphone exclusion is an existing requirement. Consequently audio-input transcription time and audio-end-to-overlay time are not measured. Audio routing was left unchanged, as requested for this phase.

Next integration needs: keep the relevant answer region current; distinguish substantive written answers from spoken acknowledgement fragments; detect the next user turn; discard previous-turn text; read new snapshots without introducing an animation in the overlay. A prompt cannot guarantee that ChatGPT exposes the entire answer immediately.

Prompt tested:
For this mock interview test, answer directly in written text. Omit acknowledgements, introductions, status updates, and closing offers: no Got it, In short, Let me put that on screen, or I will check. Provide the substantive answer first. If possible, display the written answer without a speech-paced reveal; do not claim to control the interface animation. Question: What is the difference between React rendering, reconciliation, and committing? Answer in three concise bullet points, under 100 words.
