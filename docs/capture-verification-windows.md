# Windows capture verification — 2026-10-16

Environment: Windows 11 Home Single Language, build 26200; Electron 41.6.1.

**Verified locally:** Chromium whole-display capture excludes the protected
framed-window fixture and the actual app overlay created by `createOverlayWindow`.
Protection uses the same `enableCaptureProtection` function as the application.

The test puts a magenta window over a known green background. It verifies the
green background first, then sees magenta with protection disabled, then green
with protection enabled, including after hide/restore. The positive control
prevents a hidden or off-screen window from being counted as excluded. Only
pixel values are logged; desktop screenshots are not saved or sent to AI.

| Check | Result |
| --- | --- |
| Unprotected framed window visible in full-display capture | Passed |
| Protected framed window excluded, background restored | Passed |
| Actual overlay visible with protection disabled | Passed |
| Actual overlay excluded with protection enabled | Passed |
| Exclusion survives hide/restore | Passed for both |
| Native window protection lifecycle | Passed |
| Overlay recovery and protection after restore | Passed |
| Teams/Zoom/Meet remote participant output | Not verified |
| Every screen-sharing application or capture method | Not established |

The old native assertions queried hidden windows; on this machine the getter
returns false while hidden. The tests now check visibility/recovery separately
and query protection after restoring the window. No native assertion has been
removed, and the independent pixel tests check actual exclusion.

Run `npm run test:windows-exclusion` for both controlled capture tests. Run
`npm run test:capture-protection` and `npm run test:overlay` for lifecycle checks.

Windows' `SetWindowDisplayAffinity` covers specified OS capture APIs; it does not
promise universal exclusion. See [Microsoft's API documentation](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity).
To certify a meeting app, observe its full-screen share from a second participant,
checking both main and overlay windows through hide/restore. A sender preview
or a successful native flag alone does not establish the receiver's output.

## Recent production-incident answers

Recent/latest incident questions now route through personal scenario synthesis.
They use the current Eli Lilly role unless another employer is explicitly named.
Imported incident notes remain eligible evidence. With the current resume alone,
the app labels the concrete campaign-release/configuration example as a
**Hypothetical practice scenario**, uses conditional actions, and returns the
resume-derived source. It does not invent an actual Eli Lilly incident.

Type checking, production build, scenario regression tests, personal-context
tests, and a live CLI request through `prepareAnswer` passed. The generated
practice answer is saved locally at `data/logs/recent-incident-answer.md`.
