# Phase 4 — controlled XComposite framebuffer feasibility

## What I tested

An independent, one-frame compositor reads the currently stacked, already-redirected X11 client pixmaps with XCompositeNameWindowPixmap and XGetImage. It composes them in stacking order into another image while omitting the verified overlay XID. It never unmaps/hides the overlay, changes redirection modes, takes over GNOME, or hooks conferencing processes.

## What I found

The first run failed pixel-format checks: named pixmaps return zero visual masks. The probe now supports the little-endian 32-bit layout used by the verified root TrueColor display, with this assumption explicitly recorded. The first timed-out overlay instance was not used as exclusion evidence; the experiment was repeated with a live, PID-verified, mapped harness.

The repeated experiment successfully read browser, editor, system-monitor and desktop-client pixmaps and omitted overlay XID 0x5600004. One client (Kazam) was unavailable as a redirected pixmap. The output `capture-tests/xcomposite-primary.png` visibly restores browser content underneath the omitted overlay. The overlay rectangle has **zero test-color pixels**, compared with **83,169** in a root capture taken afterward while the overlay remained visible. The after-capture verifies that this output was not produced by hiding the overlay.

**Limited proof:** a separate image can be composed without that top-level overlay. **Full-monitor conferencing protection has not been achieved.** Ordinary X11/Chromium/Mutter monitor captures still include the overlay.

## Files / commands / evidence

- `experiments/xcomposite/x11_image.py`: X11 drawable capture and PNG conversion.
- `experiments/xcomposite/compose.py`: independent framebuffer, excluded-XID validation, report and image.
- `/usr/bin/python3 experiments/xcomposite/compose.py`
- `/usr/bin/python3 experiments/xcomposite/x11_image.py capture-tests/after-composition.png`
- `scripts/find-overlay-window.sh`
- Text report: `docs/capture-evidence/xcomposite.txt`.

## What worked

Per-window pixel retrieval can recover content occluded by the locally visible overlay; a separate image can omit it. The named pixmaps were available without changing the existing compositor.

## What failed / limitations / why

This deliberately small CPU/Python prototype ignores alpha, decorations, shell UI layers, cursor, and window shapes; unsupported clients can be missing. The resulting primary image lacks shell chrome. It took about 0.212 seconds for one framebuffer pass, excluding file encoding; no sustained FPS or complete CPU/GPU measurement was performed. It does not meet the 30-FPS requirement and is not production architecture. No PipeWire producer or conferencing delivery integration is implemented.

## Next recommended experiment

A GPU/native compositor using XRender/OpenGL and XDamage updates would need correct alpha, cursor/shapes, shell layers and frame pacing. Independently prove how the resulting framebuffer becomes the source selected by **each unmodified meeting app's full-monitor capture**. A PipeWire producer alone cannot redirect an application's X11 root capture. This delivery problem remains the primary blocker to universal exclusion.
