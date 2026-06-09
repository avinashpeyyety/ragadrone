#!/usr/bin/env python3
"""Extract full index.html from Grok chat_history and push to GitHub."""
import json
import pathlib
import re
import sys
import urllib.request

OWNER, REPO, BRANCH = "avinashpeyyety", "ragadrone", "main"
MSG = "feat: dynamic tabla ornaments, expression dial, BPM 50-200"
ROOT = pathlib.Path(__file__).resolve().parent
CHAT = pathlib.Path.home() / (
    ".grok/sessions/%2FUsers%2Favinashpeyyety/"
    "019e964f-8b81-7b53-a6aa-06dac103f425/chat_history.jsonl"
)
MARKERS = ("const TABLA_ORNAMENTS", "tablaDynamic", 'value="200"', "generateDynamicCycle")


def extract_html() -> str:
    for line in CHAT.read_text(encoding="utf-8").splitlines():
        row = json.loads(line)
        if row.get("type") != "tool_result":
            continue
        blob = row.get("content", "")
        if not isinstance(blob, str) or not all(m in blob for m in MARKERS):
            continue
        m = re.search(r"(<!DOCTYPE html>.*?</html>)", blob, re.S | re.I)
        if m:
            return m.group(1)
    raise SystemExit("full HTML not found in chat_history")


def api(method, url, token, data=None):
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, body) as resp:
        return json.load(resp)


def push_files(html: str, token: str) -> str:
    ref_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}"
    base_sha = api("GET", ref_url, token)["object"]["sha"]
    base_tree = api(
        "GET", f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{base_sha}", token
    )["tree"]["sha"]

    tree_items = []
    for path in ("index.html", "docs/index.html"):
        blob = api(
            "POST",
            f"https://api.github.com/repos/{OWNER}/{REPO}/git/blobs",
            token,
            {"content": html, "encoding": "utf-8"},
        )
        tree_items.append({"path": path, "mode": "100644", "type": "blob", "sha": blob["sha"]})

    tree = api(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees",
        token,
        {"base_tree": base_tree, "tree": tree_items},
    )
    commit = api(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits",
        token,
        {"message": MSG, "tree": tree["sha"], "parents": [base_sha]},
    )
    api("PATCH", ref_url, token, {"sha": commit["sha"], "force": False})
    return commit["sha"]


def main() -> int:
    html = extract_html()
    for rel in ("index.html", "docs/index.html"):
        dest = ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        print(f"wrote {dest} ({dest.stat().st_size} bytes)")

    token = __import__("os").environ.get("GITHUB_TOKEN") or __import__("os").environ.get("GH_TOKEN")
    if not token:
        print("Set GITHUB_TOKEN or GH_TOKEN to push", file=sys.stderr)
        return 0

    sha = push_files(html, token)
    sizes = {p: len(html.encode("utf-8")) for p in ("index.html", "docs/index.html")}
    print(json.dumps({"commit_sha": sha, "file_sizes": sizes, "has_TABLA_ORNAMENTS": "TABLA_ORNAMENTS" in html}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
