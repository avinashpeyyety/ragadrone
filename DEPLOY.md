# Deploy note

Run from repo root:

```bash
cp index.html docs/index.html
git add index.html docs/index.html
git commit -m "feat: dynamic tabla ornaments, solo BPM 50-200, tempo-aware density"
git push origin main
```

GitHub Actions `Deploy to GitHub Pages` runs on push to `main` when `index.html` or `docs/**` changes.

Ensure repo Settings → Pages → Build and deployment → Source is **GitHub Actions**.
