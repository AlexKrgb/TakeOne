#!/usr/bin/env bash
# Append a Cursor session note to TakeOneBrain raw/sources and optionally rescan.
set -euo pipefail

BRAIN="${LLM_WIKI_BRAIN_PATH:-$HOME/Desktop/Brain/TakeOneBrain}"
BASE="${LLM_WIKI_BASE_URL:-http://127.0.0.1:19828}"
PROJECT="${LLM_WIKI_PROJECT_ID:-d878c348-4e81-4259-90e5-6fd21404f59f}"
TOKEN="${LLM_WIKI_API_TOKEN:-}"
RESCAN="${LLM_WIKI_RESCAN:-1}"
TOPIC="general"
SUMMARY=""

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BUFFER="$ROOT/.cursor/wiki-edits-buffer.log"

usage() {
  echo "Usage: append-llm-wiki-session.sh [--topic website|components|events|deployment|architecture|general] [summary text]"
  echo "       append-llm-wiki-session.sh --topic website <<'EOF' ... EOF"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --topic)
      TOPIC="${2:-general}"
      shift 2
      ;;
    --help|-h)
      usage
      ;;
    *)
      SUMMARY="$*"
      break
      ;;
  esac
done

if [[ -z "$SUMMARY" ]] && [[ ! -t 0 ]]; then
  SUMMARY="$(cat)"
fi

if [[ -z "${SUMMARY//[[:space:]]/}" ]]; then
  echo "LLM_WIKI_APPEND_SKIP: empty summary"
  exit 0
fi

if [[ ! -d "$BRAIN/raw/sources" ]]; then
  echo "LLM_WIKI_APPEND_SKIP: brain path missing ($BRAIN/raw/sources)"
  exit 0
fi

slug="$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')"
slug="${slug#-}"
slug="${slug%-}"
[[ -z "$slug" ]] && slug="general"

date_dir="$(date +%Y-%m-%d)"
out_dir="$BRAIN/raw/sources/cursor-sessions/$date_dir"
mkdir -p "$out_dir"
out_file="$out_dir/${slug}.md"
is_new_file=0
[[ ! -f "$out_file" ]] && is_new_file=1

edits_block=""
if [[ -f "$BUFFER" ]]; then
  edits_block="$(sed 's/^/- /' "$BUFFER" | sort -u)"
  : >"$BUFFER"
fi

if [[ "$is_new_file" -eq 1 ]]; then
  {
    echo "# Cursor sessions — $date_dir — $TOPIC"
    echo ""
    echo "- **Topic:** $TOPIC"
    echo "- **Repo:** TakeOne"
    echo ""
    if [[ -n "$edits_block" ]]; then
      echo "## Files touched (hook)"
      echo "$edits_block"
      echo ""
    fi
    echo "## Summary"
    echo "$SUMMARY"
  } >"$out_file"
else
  {
    echo ""
    echo "---"
    echo ""
    if [[ -n "$edits_block" ]]; then
      echo "## Files touched (hook)"
      echo "$edits_block"
      echo ""
    fi
    echo "## Summary"
    echo "$SUMMARY"
  } >>"$out_file"
fi

echo "LLM_WIKI_APPEND_OK: $out_file"

if [[ -z "$TOKEN" ]] || [[ "$RESCAN" != "1" ]]; then
  exit 0
fi

if ! curl -sf --max-time 2 "$BASE/api/v1/health" | grep -q '"ok":true'; then
  echo "LLM_WIKI_RESCAN_SKIP: LLM Wiki not running (note saved on disk)"
  exit 0
fi

rescan="$(curl -sf -X POST -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v1/projects/$PROJECT/sources/rescan" 2>/dev/null || echo '{}')"
changed="$(echo "$rescan" | python3 -c "import json,sys; d=json.load(sys.stdin); r=d.get('result') or {}; print(len(r.get('changedTasks') or []))" 2>/dev/null || echo "?")"
echo "LLM_WIKI_RESCAN_OK: changed_tasks=$changed"
