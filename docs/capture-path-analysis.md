# Capture path analysis — technical spike

Recorded 2026-10-03. See [environment evidence](capture-evidence/environment.txt).

## Phase 1 — environment discovery (verified)

Ubuntu 22.04.5 / kernel 6.8.0-124 / GNOME 42.9 / native Xorg 1.21.1.4, session `x11`, DISPLAY `:0`, no WAYLAND_DISPLAY. `loginctl show-session 1` confirms X11. Chrome's X client is 0x600004, PID 199030. Electron 41.6.1 embeds Chromium 146.0.7680.216 and Node 24.15.0; system Node is 20.11.1. The running Electron process loads X11, but its existing windows were absent from the mapped EWMH client list during discovery, so that alone does not identify an overlay XID.

PipeWire 0.3.48 and pipewire-media-session are running. WirePlumber is absent. Portal 1.14.4 with GNOME 42.1 and GTK 1.14 backends is installed/running. GNOME backend definition includes ScreenCast; GTK's does not. Portal ScreenCast version is 4; `AvailableSourceTypes=3` advertises MONITOR and WINDOW, **not VIRTUAL**. Mutter ScreenCast DBus interface version is 4. Existing PipeWire nodes are driver nodes and an integrated camera, not an observed screen stream.

The diagnostic script reads environment, packages, processes, X server and DBus properties. It makes no system configuration changes and does not initiate capture. Version/library/process presence does not prove which backend a conferencing session uses.

## Application matrix

| Application | Local evidence | Full-monitor path established? |
|---|---|---|
| Chrome / Meet | Chrome 148.0.7778.178 installed/running; native X client verified. No Meet sharing session or remote viewer available. | **Not yet runtime-confirmed for Meet.** Upstream WebRTC implements X11 root capture and selects its generic PipeWire capturer when allowed and running under Wayland. |
| Zoom | No Debian package/executable/running process found in inspected environment. | Unknown; remote test unavailable. |
| Teams | No inspected native package/executable/process; browser-hosted Teams would use browser capture, but no session tested. | Unknown; remote test unavailable. |
| Discord | No inspected package/executable/process found. | Unknown; remote test unavailable. |
| OBS | No executable/package found. | Unknown locally; backend depends on selected source. |
| GNOME Screenshot | Standalone executable/package absent; GNOME Shell screenshot DBus service present. | Shell DBus screenshot attempt later returned AccessDenied; no frame produced (see capture-test matrix). |
| Chromium | Separate executable absent. Electron embeds Chromium, which can be tested separately. | Not a Chrome/Meet remote test. |
| Firefox | Ubuntu transitional snap package present. No active Firefox capture inspected. | Unknown locally. |

Package absence is not proof that a browser/PWA, Flatpak or portable copy cannot exist. No PASS is implied by any inventory row.

## Source evidence and conditional paths

- [WebRTC DesktopCapturer implementation](https://github.com/webrtc-mirror/webrtc/blob/main/modules/desktop_capture/desktop_capturer.cc): generic PipeWire capturer selection checks `allow_pipewire()` and `IsRunningUnderWayland()`; the latter checks both XDG_SESSION_TYPE and WAYLAND_DISPLAY. Merely installing PipeWire does not establish that Chrome uses it on X11.
- [WebRTC X11 screen capturer](https://github.com/webrtc-mirror/webrtc/blob/main/modules/desktop_capture/linux/x11/screen_capturer_x11.cc): obtains DefaultRootWindow, captures the root pixel buffer, uses XDamage/XFixes/RandR. These are upstream sources, not proof of every behavior in the installed Chrome revision.
- [Portal ScreenCast API](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.ScreenCast.html): source bits 1=MONITOR, 2=WINDOW, 4=VIRTUAL; VIRTUAL extends with a new monitor. No exclude-XID option appears in this public API. Installed API version 4 must not be confused with latest docs version 6.
- [Electron native protection API](https://github.com/electron/electron/blob/main/docs/api/base-window.md#winsetcontentprotectionenable-macos-windows): Windows/macOS, not X11 exclusion.
- [EWMH specification](https://specifications.freedesktop.org/wm-spec/latest/ar01s05.html): _NET_WM_BYPASS_COMPOSITOR is a compositing hint, not a screen-capture exclusion request.

Chrome/Electron command-line inspection found no explicit Ozone/capture feature override on their main processes. Both load X11 and Wayland libraries; **library presence is not a capture-path conclusion**. Session/backend/build/flags can change available capture paths; actual frames and portal traffic are required to identify the installed application's active path.

## Commands and results

Run `scripts/diagnose-capture-environment.sh`; its complete command/output transcript is checked into the evidence text. Additional checks: `loginctl show-session 1 -p Type -p Desktop -p Remote -p State`, `xprop -root _NET_CLIENT_LIST`, per-XID `_NET_WM_PID WM_CLASS`, Mutter DBus introspection, filtered `/proc/<pid>/cmdline` and library maps.

Worked: read-only inventory, X11 classification, portal capability query, PipeWire node inventory. Failed/limited: WirePlumber and target native clients not available; inherited XDG_SESSION_ID empty, so loginctl needed explicit session 1. Actual remote conferencing capture paths remain untested. Next experiment: independent moving overlay harness, XID verification and actual full-root X11/Chromium frames.
