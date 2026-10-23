#!/usr/bin/env bash
set -eu
root_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
metadata="${CAPTURE_TEST_DIR:-$root_dir/capture-tests}/overlay.json"
read -r xid expected_pid < <(python3 - "$metadata" <<'PY'
import json,sys
v=json.load(open(sys.argv[1])); print(v['xid'],v['pid'])
PY
)
[[ "$xid" =~ ^0x[0-9a-fA-F]+$ && "$expected_pid" =~ ^[0-9]+$ ]] || exit 2
kill -0 "$expected_pid"
actual_pid=$(xprop -id "$xid" _NET_WM_PID | awk '{print $NF}')
[[ "$actual_pid" == "$expected_pid" ]] || { printf 'XID PID mismatch; refusing stale metadata\n' >&2; exit 3; }
xwininfo -id "$xid" | grep -q 'Map State: IsViewable' || { printf 'Overlay is not mapped; refusing capture test\n' >&2; exit 4; }
printf '%s\n' "$xid"
