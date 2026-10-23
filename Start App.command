#!/bin/zsh
set -eu

# Finder starts this from an arbitrary directory with a minimal PATH.
APP_DIRECTORY="${0:A:h}"
cd -- "$APP_DIRECTORY"
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

fail() {
  print -u2 -- "$1"
  print -- 'Press Return to close.'
  read -r reply
  exit 1
}

ELECTRON_BINARY="$APP_DIRECTORY/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron"
[[ -x "$ELECTRON_BINARY" ]] || fail 'Dependencies are missing. Run npm install in this project once.'
if [[ ! -f dist/main/main.js || ! -f dist/renderer/index.html ]]; then
  command -v npm >/dev/null || fail 'Node.js/npm is missing. Install Node.js, then retry.'
  npm run build || fail 'The application build failed. See the error above.'
fi

# An installed CLI remains usable when the editor itself is closed. Preserve
# configured environment/.env overrides; this only supplements executable lookup.
if ! command -v codex >/dev/null; then
  case "$(/usr/bin/uname -m)" in
    arm64) CLI_PLATFORM='macos-aarch64' ;;
    x86_64) CLI_PLATFORM='macos-x86_64' ;;
  esac
  if [[ -n "${CLI_PLATFORM:-}" ]]; then
    for cli_binary in "$HOME"/.vscode/extensions/openai.chatgpt-*/bin/"$CLI_PLATFORM"/codex(Nom); do
      if [[ -x "$cli_binary" ]]; then export PATH="${cli_binary:h}:$PATH"; break; fi
    done
  fi
fi

mkdir -p "$APP_DIRECTORY/data/logs"
# The bundled Electron binary can run the tiny launcher as Node, so an existing
# build needs no separately installed Node runtime. The child starts a new
# session/process group and removes development-only environment variables.
ELECTRON_RUN_AS_NODE=1 "$ELECTRON_BINARY" "$APP_DIRECTORY/scripts/launch-app.cjs" \
  || fail 'The application could not be started. See data/logs/launcher.log.'
