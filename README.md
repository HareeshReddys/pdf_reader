# Interview Prep Copilot

Local Electron, React and TypeScript desktop app for interview preparation.

## Requirements

- Node.js 24.x and npm (the packaging machine uses Node 24.20.0).
- Internet access for dependency installation and API features.
- Your own OpenAI API key for continuous API voice.
- On Windows, install Voicemeeter Banana separately for the existing virtual-speaker workflow. It is not included in this ZIP.

## Install and run (Windows PowerShell)

Extract this ZIP completely, then open PowerShell in the extracted project folder:

    npm.cmd ci
    Copy-Item .env.example .env

Edit .env locally and replace OPENAI_API_KEY with your key. For API voice without the optional Codex CLI, set CODEX_ENABLED=false. Keep .env private.

Build and start the overlay:

    npm.cmd run typecheck
    npm.cmd run build
    npm.cmd run start:overlay

For the main application window instead:

    npm.cmd start

For development with automatic reload:

    npm.cmd run dev

After changing source code, build again before using the normal start commands. Dependencies and compiled output are intentionally not included; npm ci and npm run build recreate them.

## Speaker audio and background mixer

Start Voicemeeter Banana before starting API voice. Route the interview application's playback to the existing Voicemeeter virtual input. Enable B1 on that playback strip and A1 for your physical speakers/headphones. Keep physical microphone strips off B1. The app uses the selected virtual speaker feed, not a physical microphone, and returns text answers.

Use the overlay's API voice Start and Stop controls. If the virtual device is unavailable, check the Windows playback device, Voicemeeter routing and the selected input rather than switching to a microphone.

The optional Windows mixer helper is distributed as source. To build it with the Windows .NET Framework C# compiler:

    New-Item -ItemType Directory -Force data/runtime | Out-Null
    & "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /nologo /target:exe /r:System.Web.Extensions.dll /out:data/runtime/VoiceMeeterBridge.exe scripts/VoiceMeeterBridge.cs

After starting Banana, the helper can hide its mixer window while audio keeps running:

    & .\data\runtime\VoiceMeeterBridge.exe set Command.Show 0

If that compiler is unavailable, start and minimize Banana manually. The Windows B1 routing instructions do not describe a macOS or Linux virtual-audio setup.

## Resume, job description and answers

Open Context from the overlay. Import a resume as .txt, .md, Word .docx or a text-based .pdf, and add the job description. Legacy .doc files must first be saved as .docx; scanned-only PDFs are not supported by the document importer. Text extraction happens locally at import.

Save context before explicitly starting a new voice session so that the session uses the updated context. Previous and next controls let you revisit answers. Reading hold keeps the current answer visible while accepted questions continue to be saved. The background slider supports 20% through 95%; code blocks follow the overlay background setting.

The existing voice workflow prepares a replacement session before provider expiry. Stop closes the voice connections. Network, quota and device failures can still interrupt service.

## Package contents and local data

Included: application source, dependency lockfile, build configuration, helper/test scripts, project documentation, and curated knowledge/reference files. The curated personal reference includes the approved self-introduction; review it before sharing this package or adapting the application for someone else.

Excluded: node_modules, dist, .env/API credentials, imported notes/resumes, saved job descriptions and session history, runtime helpers/installers, logs, browser profiles, captures, experiments and caches. A fresh installation creates its own local data as needed.

The original detailed project README is included as docs/DETAILED_PROJECT_README.md for additional workflows. Optional Codex-backed features require a separately installed and authenticated Codex CLI.

## Troubleshooting

- "npm is not recognized": install Node.js, reopen PowerShell and check node --version.
- PowerShell script policy errors: use npm.cmd as shown above.
- Missing Electron or packages: run npm.cmd ci from the extracted project folder.
- Missing dist/main/main.js: run npm.cmd run build.
- API connection fails: check your local .env key, API access, balance and network connection.
- No speaker questions: verify the Voicemeeter B1 route and start API voice from the overlay.

Optional local checks (these rebuild the app):

    npm.cmd run test:document-import
    npm.cmd run test:realtime-renewal

Scripts whose names include live make API requests and may use audio devices; run those only deliberately.
