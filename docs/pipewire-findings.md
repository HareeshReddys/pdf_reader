# Phase 3 — PipeWire, portal and virtual-source findings

## What I tested

- Public ScreenCast properties; CreateSession and SelectSources over one persistent DBus connection.
- Start with its real GNOME source-selection dialog, bounded timeout and cleanup.
- Mutter session introspection, RecordVirtual and Start.
- Real monitor and virtual stream consumption through installed GStreamer `pipewiresrc`.

## What I found

The installed portal reports version 4, source mask 3 (MONITOR + WINDOW), cursor mask 7. VIRTUAL is **not advertised**. CreateSession and SelectSources returned response code 0. Start did not complete selection within the test timeout; it was canceled and the session closed. OpenPipeWireRemote is implemented in the prototype but was **not reached in that public portal test**. This is an incomplete consent/source-selection test, not proof that portal capture is broken.

The direct Mutter monitor path worked: RecordMonitor(eDP-1), Session.Start, PipeWireStreamAdded node 39, GStreamer frame at 1920x1080. Stream parameters report position (3840,1238), size (1920,1080). The real frame contains the locally visible test overlay. The overlay rectangle had 83,251 diagnostic-color pixels. PipeWire is a transport; an ordinary compositor monitor stream still includes the overlay.

Mutter's DBus Session exposes RecordVirtual even though the public portal does not advertise VIRTUAL. RecordVirtual and Session.Start accepted a stream object, with empty parameters. A consumer requesting 640x480 at 30/1 failed with a GStreamer `not-negotiated (-4)` stream error; **no virtual frame or clean desktop was produced**. This could require different negotiation/backend support; acceptance of an object is not success and the one failure does not establish impossibility on every GNOME version. `xrandr --listmonitors` after cleanup still reports the same two physical monitors.

## Files and commands

- `experiments/pipewire-capture/probe.py`: public portal lifecycle, default no-picker probe; `--start` adds native selection and OpenPipeWireRemote; `--virtual` first checks source capabilities.
- `experiments/pipewire-capture/mutter-probe.py`: virtual stream object creation and introspection.
- `experiments/pipewire-capture/mutter-frame.py`: real PipeWire frame probe; `--virtual` requests a bounded virtual stream.
- Evidence: `docs/capture-evidence/portal-session.txt`, `portal-start.txt`, `mutter-virtual.txt`, `mutter-monitor-frame.txt`, `mutter-virtual-frame.txt`.
- Frames retained locally under ignored `capture-tests/`; these contain desktop content and are not uploaded.

Run with `/usr/bin/python3` (system GI/dbus/GStreamer/Pillow packages are already available). All sessions/pipelines are stopped in finally blocks. No installation, persistent permission, service replacement, or GNOME source modification was made.

## Capture path discovered

**Verified locally:** GNOME Mutter ScreenCast → PipeWire → GStreamer monitor frame. This is not evidence that Meet/Zoom/Teams/Discord use this path on this machine. Public portal stream delivery remains unverified until its picker is completed.

## What worked / failed / next experiment

Worked: portal session setup, direct Mutter monitor stream and frame, bounded cleanup. Failed: incomplete portal selection and virtual negotiation. Neither produced exclusion. Next: XComposite can test whether a separate framebuffer can recover underlying window pixels without the overlay; then measure fidelity/FPS and investigate a consumer-compatible delivery path. A virtual source cannot be assumed to mirror the working desktop minus one window.

## Primary source interpretation

[Portal API](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.ScreenCast.html) defines VIRTUAL as extending with a new virtual monitor, not removing an overlay. [Mutter GNOME-42 virtual stream implementation](https://github.com/GNOME/mutter/blob/gnome-42/src/backends/meta-screen-cast-virtual-stream-src.c) attempts creation when video parameters are negotiated and captures a stage view; creating the DBus stream before negotiation is insufficient. These source findings support investigation, not a capture-exclusion claim.
