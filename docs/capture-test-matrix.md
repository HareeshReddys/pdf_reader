# Capture test matrix

2026-10-03, Ubuntu 22.04.5, GNOME 42.9, X11. Local image evidence does not count as a remote conferencing PASS.

| Environment | Application / mechanism | Full Monitor | Overlay Local | Overlay Remote / captured | Result |
|---|---|---|---|---|---|
| GNOME/X11 | Chrome + Meet | Required; not exercised | Test harness verified | Unknown | NOT TESTED: no active Meet share and remote viewer |
| GNOME/X11 | Zoom | Required; not exercised | Test harness verified | Unknown | NOT TESTED: client/session/remote viewer unavailable |
| GNOME/X11 | Teams | Required; not exercised | Test harness verified | Unknown | NOT TESTED: session/remote viewer unavailable |
| GNOME/X11 | Discord | Required; not exercised | Test harness verified | Unknown | NOT TESTED: client/session/remote viewer unavailable |
| GNOME/X11 | OBS | Not exercised | Visible during local tests | Unknown | NOT TESTED: executable absent |
| GNOME/X11 | GNOME Screenshot / Shell DBus | Full-root screenshot attempted through Shell API | Visible | No frame | ERROR: Shell API returned AccessDenied / Screenshot is not allowed; standalone executable absent |
| GNOME/X11 | xwd root | Attempted full X root | Mapped | No valid frame | ERROR: BadColor / X_QueryColors on this display |
| GNOME/X11 | XGetImage root | Yes, both-monitor root 5760x2318 | Visible and mapped | Present in PNG | FAIL for exclusion; successful baseline capture |
| GNOME/X11 | Electron Chromium desktopCapturer | Yes, primary 1920x1080 | Visible and mapped | Present in PNG | FAIL for exclusion; not a Chrome/Meet remote test |
| GNOME/X11 | Mutter → PipeWire → GStreamer | Yes, eDP-1 1920x1080 | Visible and mapped | Present in PNG | FAIL for exclusion; successful stream capture |
| GNOME/X11 | Public portal monitor | Start attempted | Visible | Unknown | INCOMPLETE: native picker not completed before timeout |
| GNOME/X11 | Mutter virtual stream | Stream object created; no frame | Visible | No frame | ERROR: consumer not-negotiated; no clean desktop established |
| GNOME/X11 | Experimental XComposite framebuffer | Separate desktop-client image | Remained mapped; later root frame includes overlay | Absent from separate image, browser underneath restored | LIMITED PROOF only; not delivered to conferencing apps, missing fidelity/FPS |

## Remote verification procedure (still required)

Use an actual second machine/participant. Keep the changing harness visible locally. In each named conferencing app choose **Entire Screen**, including the monitor containing the overlay. Record both local and received frames with matching timestamps/frame counters. Verify desktop movement, cursor, animations, video, window dragging/workspace changes, >=30 FPS and resource use. Repeat individually; neither a local share preview nor an API success is a remote PASS. No current row establishes production protection.

## Harness commands

`ELECTRON_RUN_AS_NODE= node_modules/.bin/electron experiments/capture-overlay/main.cjs`

`scripts/find-overlay-window.sh`

`scripts/test-x11-capture.sh`

The harness closes after 90 seconds by default (`CAPTURE_TEST_DURATION_MS` may extend it). Metadata binds native handle/XID to `_NET_WM_PID`; the lookup refuses dead, mismatched or unmapped windows. The screenshot script never hides the overlay. PNG/XWD files and window metadata remain in ignored `capture-tests/`.


## Controlled workspace follow-up (2026-10-04)

| Source | Capture | Local assistant | Captured assistant | Result |
|---|---|---|---|---|
| Authenticated nested Xephyr display | Electron Chromium getDisplayMedia, monitor, 1920x1080 | Visible above workspace on host monitor | Absent; working content present | LOCAL BOUNDARY VERIFIED, ~58.9 delivered FPS in short 60-FPS-request test |
| Authenticated nested Xephyr display | Installed Chrome getDisplayMedia, monitor, 1920x1080 | Visible on host | Absent; working content present | LOCAL BOUNDARY VERIFIED, ~57.2 delivered FPS in short 60-FPS-request test |
| Ordinary host monitor | DesktopCapturer monitor frame | Visible | Present | Ordinary physical-desktop sharing remains unprotected |
| Workspace Meet / Zoom web / Teams / Discord | Real remote meeting | Intended visible | Not observed remotely yet | REMOTE TEST PENDING; no conferencing PASS |
