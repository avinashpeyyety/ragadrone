#!/usr/bin/env python3
"""One-shot: extract full HTML from chat_history line 31 and write index + docs."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
CHAT = pathlib.Path.home() / (
    ".grok/sessions/%2FUsers%2Favinashpeyyety/"
    "019e964f-8b81-7b53-a6aa-06dac103f425/chat_history.jsonl"
)
MARKERS = ("const TABLA_ORNAMENTS", "tablaDynamic", 'value="200"', "generateDynamicCycle")


def main() -> None:
    for i, line in enumerate(CHAT.read_text(encoding="utf-8").splitlines(), 1):
        row = json.loads(line)
        if row.get("type") != "tool_result":
            continue
        blob = row.get("content", "")
        if not isinstance(blob, str) or not all(m in blob for m in MARKERS):
            continue
        m = re.search(r"(<!DOCTYPE html>.*?</html>)", blob, re.S | re.I)
        if not m:
            continue
        html = m.group(1)
        for rel in ("index.html", "docs/index.html"):
            dest = ROOT / rel
            dest.write_text(html, encoding="utf-8")
            print(f"wrote {dest} ({dest.stat().st_size} bytes) from chat line {i}")
        return
    raise SystemExit("full HTML not found in chat_history")


if __name__ == "__main__":
    main()
