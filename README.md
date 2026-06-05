# Raga Drone — POC

Quick proof of concept: **tanpura-style drone** (Sa + Pa) + **random ambient notes** locked to a raga scale.

## Run

```bash
cd raga-drone-poc
python3 -m http.server 8766
```

Open http://127.0.0.1:8766 — click **Start** (browser requires a user gesture for audio).

Or open `index.html` directly; some browsers block CDN/Web Audio on `file://` — prefer the local server.

## Ragas (12-TET)

| Raga | Scale (from Sa) |
|------|-----------------|
| Yaman | S R G M♯ P D N |
| Bhairav | S r G m P d N |
| Malkauns | S g m d |
| Kafi | S R g M P D n |
| Darbari | S r g m P d n |

## Not in this POC

- Shruti / microtones
- Tabla, recorded tanpura samples
- Proper vadi–samvadi phrasing
- Export, mobile app shell

## Stack

- [Tone.js](https://tonejs.github.io/) (CDN)
- Single `index.html`