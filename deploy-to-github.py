#!/usr/bin/env python3
"""Push index.html and docs/index.html to avinashpeyyety/ragadrone via GitHub API."""
import base64
import json
import os
import pathlib
import urllib.error
import urllib.request

OWNER = "avinashpeyyety"
REPO = "ragadrone"
BRANCH = "main"
MESSAGE = "fix: restore full app for GitHub Pages"
BASELINE_URL = (
    "https://raw.githubusercontent.com/avinashpeyyety/ragadrone/"
    "f90c59d9fbf9516189eeff78b7dd86b84742edc0/docs/index.html"
)
ROOT = pathlib.Path(__file__).resolve().parent


def api(method: str, path: str, body: dict | None = None, token: str = "") -> dict:
    url = f"https://api.github.com{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "ragadrone-deploy")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def file_sha(path: str, token: str) -> str | None:
    try:
        info = api("GET", f"/repos/{OWNER}/{REPO}/contents/{path}?ref={BRANCH}", token=token)
        return info.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def upsert_file(path: str, content: bytes, token: str) -> None:
    payload = {
        "message": MESSAGE,
        "content": base64.b64encode(content).decode(),
        "branch": BRANCH,
    }
    sha = file_sha(path, token)
    if sha:
        payload["sha"] = sha
    api("PUT", f"/repos/{OWNER}/{REPO}/contents/{path}", payload, token=token)


def load_html() -> bytes:
    src = ROOT / "index.html"
    if src.exists():
        html = src.read_bytes()
        if len(html) > 20_000 and b"const RAGAS" in html:
            return html
    with urllib.request.urlopen(BASELINE_URL) as resp:
        return resp.read()


def main() -> None:
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        raise SystemExit("Set GITHUB_TOKEN or GH_TOKEN")

    html = load_html()
    docs = ROOT / "docs" / "index.html"
    docs.parent.mkdir(exist_ok=True)
    docs.write_bytes(html)
    src = ROOT / "index.html"
    if not src.exists() or len(src.read_bytes()) < len(html):
        src.write_bytes(html)

    for rel in ("index.html", "docs/index.html"):
        upsert_file(rel, html, token)
        print(f"uploaded {rel} ({len(html)} bytes)")

    head = api("GET", f"/repos/{OWNER}/{REPO}/commits/{BRANCH}", token=token)
    print(f"main now at {head['sha'][:12]}")
    print("https://avinashpeyyety.github.io/ragadrone/")


if __name__ == "__main__":
    main()
