# Desktop chat speed measurements

Three synthesized questions were played through real Windows speaker output, captured by the app, locally transcribed, submitted to the current ChatGPT desktop conversation, and rendered in the real overlay. Each run starts a new worker and uses the existing local model cache. The optimized build starts warming the model at assistant start. These are three observations per version, not a latency guarantee or a controlled isolation of ChatGPT network/server variance.

| Stage | Baseline average | Optimized average |
|---|---:|---:|
| Local transcription | 3.65 s | 1.98 s |
| Desktop helper setup and submission | 3.22 s | 1.11 s |
| Speech end to first visible overlay text | 17.57 s | 9.99 s |

Optimized first accessible reply snapshot to overlay visibility: 74 ms, 21 ms, 147 ms. This excludes any delay between ChatGPT painting text and exposing it through accessibility. All final runs checked the full spoken question, partial visibility before completion, final overlay text equality, and zero microphone requests.

The 3?4 second requirement is NOT achieved. The first answer appeared 9.94 s, 9.33 s, 10.69 s after speech ended. Completed answers take longer. The 650 ms pause experiment split a question and was rejected; the original 1400 ms pause remains.

Changes retained: warm local ASR at assistant start, targeted accessibility queries, reuse document references, 100 ms pause between reads, and direct stdout snapshot streaming instead of polling a partial file.

API audio streaming was researched but not implemented or tested: no API key is configured, and ChatGPT Pro does not include general API usage. No audio was sent through a separately billed API.

Raw measurements: data/logs/chatgpt-speed-baseline.json and data/logs/chatgpt-speed-benchmark.json. Reproduce with npm run benchmark:desktop-chat (requires the open regular ChatGPT desktop conversation).
