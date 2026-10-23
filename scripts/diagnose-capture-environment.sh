#!/usr/bin/env bash
# Read-only inventory. No installs, configuration changes, capture, or window changes.
set -u
root_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
run() { printf '\n$'; printf ' %q' "$@"; printf '\n'; if command -v "$1" >/dev/null 2>&1; then timeout 10 "$@" 2>&1 || printf '[unavailable or command failed]\n'; else printf '[tool not installed]\n'; fi; }
printf 'CAPTURE ENVIRONMENT DIAGNOSTICS\nUTC: %s\n' "$(date -u +%FT%TZ)"
run cat /etc/os-release
run uname -r
printf '\nDesktop: %s\nSession: %s\nDISPLAY: %s\nWAYLAND_DISPLAY: %s\n' "${XDG_CURRENT_DESKTOP:-unknown}" "${XDG_SESSION_TYPE:-unknown}" "${DISPLAY:-unset}" "${WAYLAND_DISPLAY:-unset}"
run gnome-shell --version
run node --version
if [[ -x "$root_dir/node_modules/electron/dist/electron" ]]; then
  printf '\nElectron bundled versions:\n'
  ELECTRON_RUN_AS_NODE=1 "$root_dir/node_modules/electron/dist/electron" -p 'JSON.stringify({electron:process.versions.electron,chromium:process.versions.chrome,node:process.versions.node})'
fi
run pipewire --version
run wireplumber --version
run dpkg-query -W '-f=${binary:Package} ${db:Status-Abbrev} ${Version}\n' 'xdg-desktop-portal*' pipewire wireplumber pipewire-media-session google-chrome-stable zoom discord teams obs-studio gnome-screenshot
printf '\nCapture-related processes (names only, no URLs/arguments):\n'
ps -eo pid,ppid,comm | awk 'NR==1 || /pipewire|wireplumber|portal|chrome|chromium|zoom|teams|discord|obs|gnome-shell|Xorg|Xwayland|electron/'
printf '\nPortal service owners:\n'
busctl --user --no-pager list 2>/dev/null | awk 'NR==1 || /org.freedesktop.portal.Desktop|org.freedesktop.impl.portal|org.gnome.Mutter.ScreenCast/'
run gdbus call --session --dest org.freedesktop.portal.Desktop --object-path /org/freedesktop/portal/desktop --method org.freedesktop.DBus.Properties.Get org.freedesktop.portal.ScreenCast AvailableSourceTypes
run gdbus call --session --dest org.freedesktop.portal.Desktop --object-path /org/freedesktop/portal/desktop --method org.freedesktop.DBus.Properties.Get org.freedesktop.portal.ScreenCast version
run pw-cli list-objects Node
printf '\nX server:\n'
if command -v xdpyinfo >/dev/null; then xdpyinfo 2>/dev/null | awk '/name of display|vendor string|vendor release|X.Org version|Composite|DAMAGE|XFIXES|RANDR/'; fi
printf '\nPortal backend definitions:\n'
if [[ -d /usr/share/xdg-desktop-portal/portals ]]; then
  for portal_file in /usr/share/xdg-desktop-portal/portals/*.portal; do
    [[ -f "$portal_file" ]] || continue
    printf '%s\n' "$portal_file"
    sed -n '/^DBusName=/p; /^Interfaces=/p; /^UseIn=/p' "$portal_file"
  done
fi
printf '\nElectron X clients (PID and class only):\n'
if command -v xprop >/dev/null; then
  for window_id in $(xprop -root _NET_CLIENT_LIST 2>/dev/null | sed 's/.*#//' | tr ',' ' '); do
    properties=$(xprop -id "$window_id" _NET_WM_PID WM_CLASS 2>/dev/null)
    if [[ "$properties" == *electron* || "$properties" == *interview* || "$properties" == *Interview* ]]; then printf '%s\n%s\n' "$window_id" "$properties"; fi
  done
fi
printf '\nCAPTURE ENVIRONMENT SUMMARY\n'
if [[ "${XDG_SESSION_TYPE:-}" == x11 ]] && pgrep -x Xorg >/dev/null; then
  printf 'Session: native X11 (Xorg process and session type confirmed)\n'
elif [[ "${XDG_SESSION_TYPE:-}" == wayland ]]; then
  printf 'Session: Wayland\n'; pgrep -x Xwayland >/dev/null && printf 'XWayland: running; inspect individual client XIDs to classify clients\n'
else printf 'Session: undetermined\n'; fi
printf 'Desktop: %s\n' "${XDG_CURRENT_DESKTOP:-unknown}"
pgrep -x pipewire >/dev/null && printf 'PipeWire: running (not evidence of screen capture)\n' || printf 'PipeWire: not running\n'
printf 'Possible capture paths: X11 if X clients exist; portal/PipeWire if ScreenCast query succeeded.\n'
printf 'Native window exclusion: not established. App-specific active capture paths: not established by this inventory.\n'
