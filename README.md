# Raga Drone — POC

Quick proof of concept: **harmonium-style drone** (Sa + Pa, shruti-aware) + **scale-locked loop** (vadi/samvadi bias, per-raga timbre) + **synthetic tabla taals**.

## Run

**App (HTTPS):** https://avinashpeyyety.github.io/raga-drone/

**Local:**

```bash
cd raga-drone
python3 -m http.server 8766
```

Open http://127.0.0.1:8766 — click **Start** (browser requires a user gesture for audio).

Independent of [Nakshatra Chakram](https://avinashpeyyety.github.io/nakshatra/) — separate repo and site.

## Ragas

| Raga | Scale (from Sa) | Timbre | Notes |
|------|-----------------|--------|-------|
| Yaman | S R G M♯ P D N | bright | tivra Ma (+55¢) |
| Bhairav | S r G m P d N | dark | komal Re/Dha (−48¢) |
| Malkauns | S g m d | dark | komal Ga, komal Ma/Dha |
| Kafi | S R g M P D n | mellow | komal Ga, komal Ni |
| Darbari | S r g m P d n | dark | komal swaras throughout |

Base pitch is **12-TET from Sa**; komal/tivra offsets are **interpretive POC** (not a full shruti engine). Loop notes favor **vadi** and **samvadi**; density 1–5 controls spacing.

## Tabla taals (synthetic)

| Taal | Matras |
|------|--------|
| Teentaal | 16 |
| Ektaal | 12 |
| Jhaptal | 10 |
| Rupak | 7 |
| Dadra | 6 |
| Keherwa | 8 |
| Deepchandi | 14 |

One bol per matra, synced to **Session tempo (BPM)** via Tone.Transport (optional separate tabla tempo). Khali sections use lighter strokes. Not sampled tabla — MembraneSynth + MetalSynth + noise.

## Layout

- **Session** — root (Sa), tempo, harmonium drone on/level  
- **Raga** | **Tabla** — side-by-side; loop and tabla toggles only

## Not in this POC

- Recorded harmonium / tanpura / tabla samples
- Composed pakad phrases or arohanam/avarohanam rules
- Export, mobile app shell

## Stack

- [Tone.js](https://tonejs.github.io/) (CDN)
- Single `index.html`