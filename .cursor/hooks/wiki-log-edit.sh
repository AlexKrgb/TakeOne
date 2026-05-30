#!/usr/bin/env bash
# afterFileEdit: track repo file paths for the next wiki session append.
set -euo pipefail

input="$(cat)"
file_path="$(echo "$input" | python3 -c "import json,sys; print(json.load(sys.stdin).get('file_path',''))" 2>/dev/null || true)"

[[ -z "$file_path" ]] && exit 0

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BUFFER="$ROOT/.cursor/wiki-edits-buffer.log"

case "$file_path" in
  "$ROOT"/*)
    rel="${file_path#"$ROOT"/}"
    ;;
  *)
    exit 0
    ;;
esac

case "$rel" in
  .env|.env.*|*.pem|*.key) exit 0 ;;
  .cursor/wiki-edits-buffer.log) exit 0 ;;
esac

echo "$rel" >>"$BUFFER"
exit 0
