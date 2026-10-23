#!/usr/bin/env bash
# Leaves the overlay visible throughout both full-root captures.
set -euo pipefail
root_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
output_dir="${CAPTURE_TEST_DIR:-$root_dir/capture-tests}"
xid=$("$root_dir/scripts/find-overlay-window.sh")
mkdir -p "$output_dir"
xprop -id "$xid" > "$output_dir/overlay-xprops.txt"
xwininfo -id "$xid" > "$output_dir/overlay-geometry.txt"
for name in baseline x11-test; do
  if ! xwd -root -silent -out "$output_dir/$name.xwd" 2> "$output_dir/$name-xwd-error.txt"; then
    printf 'xwd failed; see error transcript. Using independent XGetImage root capture.\n'
  fi
  /usr/bin/python3 "$root_dir/experiments/xcomposite/x11_image.py" "$output_dir/$name.png"
  "$root_dir/scripts/find-overlay-window.sh" >/dev/null
  [[ "$name" == baseline ]] && sleep 1 || true
done
printf 'Overlay stayed mapped. Inspect frames; capture success alone is not exclusion success.\n'
