#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
python3 _extract_to_files.py
cp index.html docs/index.html
if python3 _mcp_push_extracted.py 2>/dev/null || python3 deploy-to-github.py; then
  echo "Deployed via GitHub API."
else
  git add index.html docs/index.html deploy-to-github.py DEPLOY_NOW.command
  git commit -m "fix: restore full app for GitHub Pages" || true
  git push origin main
  echo "Deployed via git push."
fi
echo "Done. Open https://avinashpeyyety.github.io/ragadrone/ (hard refresh: Cmd+Shift+R)"
read -n 1 -s -r -p "Press any key to close..."
