import type { BrowserWindow } from 'electron';
import type { CaptureProtectionStatus } from '../../../shared/types';
import { detectCaptureCapabilities } from './environment';
import { identifyX11Window } from './x11';
import { PIPEWIRE_EXCLUSION_VERIFIED } from './pipewire';
import { PORTAL_EXCLUSION_VERIFIED } from './portal';
export async function enableLinuxProtection(window: BrowserWindow): Promise<CaptureProtectionStatus> {
  const [capabilities, xid] = await Promise.all([detectCaptureCapabilities(), identifyX11Window(window)]);
  console.info('[capture-protection]', JSON.stringify({ ...capabilities, windowId: window.id, xid, electronBackend: xid ? capabilities.session === 'wayland' ? 'xwayland' : 'x11' : 'unverified', strategy: 'unsupported', active: false, pipewireExclusionVerified: PIPEWIRE_EXCLUSION_VERIFIED, portalExclusionVerified: PORTAL_EXCLUSION_VERIFIED }));
  return { supported: false, active: false, strategy: 'unsupported', reason: 'No verified full-monitor exclusion on this Linux capture path. A separate composed image does not protect ordinary screen sharing.' };
}
