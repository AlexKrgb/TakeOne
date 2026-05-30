#!/usr/bin/env bash
# Fetch context from LLM Wiki (TakeOneBrain) for Cursor agent.
# Requires: LLM Wiki app running, LLM_WIKI_API_TOKEN in environment.
set -euo pipefail

BASE="${LLM_WIKI_BASE_URL:-http://127.0.0.1:19828}"
PROJECT="${LLM_WIKI_PROJECT_ID:-d878c348-4e81-4259-90e5-6fd21404f59f}"
TOKEN="${LLM_WIKI_API_TOKEN:-}"
MAX_QUERY_CHARS=240

emit_skip() {
  echo "## LLM Wiki context (skipped)"
  echo "$1"
  exit 0
}

if [[ -z "$TOKEN" ]]; then
  emit_skip "Set \`LLM_WIKI_API_TOKEN\` (LLM Wiki → Settings → API Server)."
fi

if ! curl -sf --max-time 2 "$BASE/api/v1/health" | grep -q '"ok":true'; then
  emit_skip "LLM Wiki API not reachable at $BASE — open the desktop app."
fi

if [[ $# -gt 0 ]]; then
  QUERY="$*"
else
  QUERY="TakeOne website archive components deployment architecture"
fi
QUERY="${QUERY:0:$MAX_QUERY_CHARS}"

export WIKI_BASE="$BASE" WIKI_PROJECT="$PROJECT" WIKI_TOKEN="$TOKEN" WIKI_QUERY="$QUERY"

python3 <<'PY'
import json, os, urllib.request

base = os.environ["WIKI_BASE"]
project = os.environ["WIKI_PROJECT"]
token = os.environ["WIKI_TOKEN"]
query = os.environ["WIKI_QUERY"]

def get(path):
    req = urllib.request.Request(
        f"{base}{path}",
        headers={"Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(req, timeout=8) as r:
        return json.load(r)

def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{base}{path}",
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=12) as r:
        return json.load(r)

lines = ["## LLM Wiki context (TakeOneBrain)", ""]

try:
    projects = get("/api/v1/projects")
    current = projects.get("currentProject") or {}
    name = current.get("name") or "TakeOneBrain"
    path = current.get("path") or ""
    lines.append(f"**Project:** {name} (`{path}`)")
except Exception as e:
    lines.append(f"**Project:** TakeOneBrain (list failed: {e})")

lines.append(f"**Search query:** {query!r}")
lines.append("")

try:
    search = post(
        f"/api/v1/projects/{project}/search",
        {"query": query, "topK": 6, "includeContent": False},
    )
    mode = search.get("mode", "?")
    results = search.get("results") or []
    lines.append(f"**Retrieval:** {mode} ({len(results)} hits)")
    lines.append("")
    if not results:
        lines.append("_No wiki hits — add notes under `~/Desktop/Brain/TakeOneBrain/raw/sources/` and rescan._")
    else:
        for i, hit in enumerate(results, 1):
            p = hit.get("path", "")
            title = hit.get("title", p)
            score = hit.get("score", "")
            snippet = (hit.get("snippet") or "").replace("\n", " ").strip()
            if len(snippet) > 200:
                snippet = snippet[:200] + "…"
            lines.append(f"{i}. **{title}** — `{p}` (score={score})")
            if snippet:
                lines.append(f"   {snippet}")
            lines.append("")
except Exception as e:
    lines.append(f"_Search failed: {e}_")

lines.append("Cite wiki `path` values when using this context. Read full pages via LLM Wiki API or brain folder if needed.")

print("\n".join(lines))
PY
