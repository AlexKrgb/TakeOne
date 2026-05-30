#!/usr/bin/env bash
# sessionStart: inject baseline LLM Wiki context (optional; rule handles per-turn fetch).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT="$("$ROOT/.cursor/scripts/fetch-llm-wiki-context.sh" "TakeOne website project overview" 2>/dev/null || true)"
if [[ -z "$CONTEXT" ]]; then
  exit 0
fi
python3 -c 'import json,sys; print(json.dumps({"additional_context": sys.stdin.read()}))' <<<"$CONTEXT"
