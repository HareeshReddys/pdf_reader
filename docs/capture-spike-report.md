# Linux full-monitor exclusion spike — phase report

The user explicitly authorized continuing through phases after verification. No conferencing exclusion is claimed. The production app remains a normal visible top-level Electron application.

## Phase 1: environment discovery — verified

**What I tested:** OS/session/server/library/package/process inventory and actual DBus/PipeWire capabilities. **What I found:** native X11/GNOME42, portal MONITOR/WINDOW but no advertised VIRTUAL; camera/driver nodes alone do not establish screen capture.

**Files created:** `scripts/diagnose-capture-environment.sh`, `docs/capture-path-analysis.md`, `docs/capture-evidence/environment.txt`.

**Commands run:** diagnostic script, loginctl explicit session 1, per-window xprop, xdpyinfo, DBus introspection, filtered process maps/flags.

**Capture path discovered:** available X11 and GNOME portal/PipeWire paths; app-specific conferencing sessions unknown. **What worked:** inventory and capability queries. **What failed / why:** some target clients/tools absent; inherited session ID missing. **Next recommended experiment:** map a known independent overlay and capture while it remains mapped.

## Phase 2: overlay and screenshot harness — verified baseline

**What I tested:** dedicated top-level sandboxed Electron window, native-handle XID → PID verification, changing timestamp/frame counter, X11 root capture and Electron Chromium monitor capture. Overlay xprop showed NORMAL, ABOVE, desktop 0, PID/WM_CLASS, BYPASS_COMPOSITOR=2.

**What I found:** XGetImage root and Chromium full-primary capture both include the overlay. Source-frame color differences are due to captured display/color output; images were also inspected visually. BYPASS_COMPOSITOR is not exclusion.

**Files created:** `experiments/capture-overlay/main.cjs`, `scripts/find-overlay-window.sh`, `scripts/test-x11-capture.sh`, local ignored `capture-tests/` frames/metadata/properties. The XGetImage helper in `experiments/xcomposite/x11_image.py` is reused for baseline capture.

**Commands run:** harness launch, PID/XID lookup, xprop/xwininfo, screenshot script, PNG inspection, xrandr inventory.

**Capture path discovered:** direct X11 root read and Chromium desktopCapturer monitor thumbnail, on a 5760x2318 two-monitor root and primary 1920x1080 monitor. **What worked:** mapped-frame baseline with changing content. **What failed / why:** xwd hit BadColor in X_QueryColors; independent XGetImage capture worked. **Next recommended experiment:** record a real Mutter/PipeWire frame and try virtual-source negotiation.

## Phase 3: portal/PipeWire/virtual — bounded experiments completed; one portal test incomplete

See [PipeWire findings](pipewire-findings.md) and associated transcripts for files and commands. **What I tested:** full public portal lifecycle prototype, actual session setup, attempted picker, direct Mutter monitor/virtual streams and GStreamer consumption. **What I found:** normal monitor stream includes overlay; public VIRTUAL unavailable; virtual stream acceptance produces no usable frame in the tested negotiation.

**Capture path discovered:** Mutter ScreenCast → PipeWire → GStreamer, with frame/position/size evidence. **What worked:** real full-monitor frame. **What failed / why:** portal selection timed out before OpenPipeWireRemote; virtual consumer returned not-negotiated. These are limitations of these attempts, not universal impossibility claims. **Next recommended experiment:** independent XComposite framebuffer excluding the overlay.

## Phase 4: XComposite — limited feasibility verified

See [XComposite findings](xcomposite-findings.md) for complete files, commands and limitations. **What I tested:** already-redirected window pixmaps in stacking order, omission of live verified overlay XID, comparison with a later normal root capture. **What I found:** a separate framebuffer restores browser content beneath the absent overlay while the actual desktop still contains it.

**Capture path discovered:** XComposite named pixmaps → XGetImage → offline CPU-composed image. **What worked:** exclusion in a separate image. **What failed / why:** incomplete alpha/shell/cursor/decorations and unsupported client; no sustained FPS target or meeting-app delivery. **Next recommended experiment:** native/GPU fidelity/frame pacing, plus explicit consumer routing. An image is not universal capture protection.

## Phase 5: architecture decision — D, with unresolved delivery and validation

**What I tested:** the paths and prototypes above; no conferencing/OS hooks or binary patches. **What I found:** A (native Linux exclusion), B (ordinary portal exclusion), C (working virtual-monitor mirror) are **not demonstrated**. D (custom capture/composition required for the proposed controlled path) is the supported direction: the framebuffer proof exists, but routing and fidelity do not. E (impossible for every possible custom environment) would be an overclaim. Universal exclusion is **not available or implemented in the current app/environment**.

A native/GPU producer could compose a clean framebuffer into PipeWire or a controlled display. But each unmodified target's Entire Screen capture must consume that path. X11 root readers will still see the overlay if it remains in the root framebuffer. The producer alone cannot make them switch. A compositor-level separate local presentation path or explicitly controlled display/capture integration would be needed; no such integration was demonstrated. No 30/60-FPS or all-client compatibility claim is justified.

**Files created:** `src/platform/captureProtection/` with Windows/macOS isolation, Linux capability detection, verified XID identification and explicit inactive strategies; typed status reuses existing runtime/overlay IPC. `scripts/smoke-capture-protection.cjs`. UI shows Unavailable / unverified. Native Windows/macOS calls also remain unverified until an actual remote test, rather than showing Protected merely because an API succeeded.

**Commands run:** typecheck, production build, native-status smoke test and existing overlay/context regression checks. All passed; shell, Python and harness syntax checks also passed. GNOME Shell Screenshot returned AccessDenied, recorded in the matrix without weakening security.

**What worked:** honest detection/status, separate framebuffer proof, existing sandbox/typed IPC kept intact. **What failed / why:** no demonstrated route from the clean image to arbitrary conferencing full-monitor capture; remote clients/viewer not available. **Next recommended experiment:** a controlled consumer/display prototype with GPU composition, then real second-machine tests per [test matrix](capture-test-matrix.md). Complete the native portal picker before making portal-delivery conclusions. No install/upgrade/system patch is justified by the current evidence.

## Production changes and scope

Only capture-protection capability/status plumbing and `skipTaskbar` for the existing overlay were added. No screen-share exclusion workaround is activated on Linux. No key, compiler dependency, new package, system service, Electron upgrade, compositor replacement, root execution, sandbox weakening, browser injection or meeting-page manipulation was added. Experimental full frames remain outside tracked files under ignored `capture-tests/`.

