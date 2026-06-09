# Raga Drone — Music, Nuance & Technical Design

This document explains how **Raga Drone** approximates Hindustani classical practice in the browser: what musical ideas it encodes, what it deliberately simplifies, and how the synthesis and algorithms implement those choices.

**Live app:** https://avinashpeyyety.github.io/ragadrone/

---

## 1. What the app is trying to be

Raga Drone is a **practice and immersion environment**, not a concert simulation. It combines three layers common in a baithak (home session) or riyaz (practice):

| Layer | Classical role | App implementation |
|-------|----------------|-------------------|
| **Drone** | Tanpura / harmonium Sa–Pa anchor | Sustained harmonium-style Sa + Pa (octave below + middle register) |
| **Melodic motion** | Alap-ish or light melodic filler against the drone | Stochastic scale loop biased toward **vadi** and **samvadi** |
| **Taal** | Tabla theka and accompaniment | Synthetic tabla strokes on a fixed **theka**, optionally ornamented |

The design goal is **musical plausibility under constraint**: enough raga grammar, shruti colour, taal structure, and tabla behaviour to feel like Hindustani accompaniment — without sample libraries, phrase composition, or a full gamak (ornament) engine on the melody side.

---

## 2. Swara, shruti, and raga grammar

### 2.1 Twelve swara names (from Sa)

The app maps semitone offsets from **Sa** (the chosen root) to standard North Indian notation:

| Semitone | Label | Common name |
|----------|-------|-------------|
| 0 | Sa | Shadja |
| 1 | r | Komal Re |
| 2 | R | Shuddha Re |
| 3 | g | Komal Ga |
| 4 | G | Shuddha Ga |
| 5 | m | Shuddha Ma |
| 6 | M♯ | Tivra Ma |
| 7 | P | Pancham |
| 8 | d | Komal Dha |
| 9 | D | Shuddha Dha |
| 10 | n | Komal Ni |
| 11 | N | Shuddha Ni |

Each **raga** is a subset of these swaras plus **vadi** (most emphasised swara) and **samvadi** (second emphasised, often a fourth or fifth away in classical theory).

### 2.2 Pitch: 12-TET + selective shruti offsets

**Base tuning:** equal temperament from the user-selected root (C through B). Sa is MIDI note 48 + root index (middle-register anchor).

**Shruti deviations:** selected swaras are bent by **cents** (hundredths of a semitone) via `Tone.Frequency(midi).transpose(cents)`:

| Offset | Typical use in app |
|--------|-------------------|
| **+55¢** on tivra Ma (Yaman) | Slightly sharper than ET tivra Ma — evocative of open Ma |
| **−48¢** on komal Re/Dha/Ga/Ni | Komal flavours pulled toward the “flat” side of the semitone |
| **−42¢** on komal Ma (Malkauns, Darbari) | Andolan-like dark Ma colour |

This is an **interpretive shruti layer**, not a 22-śruti or raga-specific intonation table. It colours the harmonium loop and drone; it does not implement meend (slides), gamak, or per-phrase intonation rules.

### 2.3 Ragas in the catalogue

| Raga | Aroha/scale (from Sa) | Vadi | Samvadi | Timbre preset | Shruti map |
|------|------------------------|------|---------|---------------|------------|
| **Yaman** | S R G M♯ P D N | G (4) | N (11) | bright | M♯ +55¢ |
| **Bhairav** | S r G m P d N | r (1) | P (7) | dark | r, m, d −48/−42¢ |
| **Malkauns** | S g m d | m (5) | S (0) | dark | g, m, d |
| **Kafi** | S R g M P D n | D (9) | P (5) | mellow | g, n |
| **Darbari** | S r g m P d n | r (1) | P (5) | dark | r, g, m, d, n |

**What is not modelled:** pakad (characteristic phrases), strict aroha/avarohana rules (e.g. skipping notes in ascent/descent), time-of-day or seasonal raga theory, or chalan (melodic behaviour). The loop picks **any allowed swara** with statistical bias — closer to “random alap fragments” than composed bandish.

### 2.4 Vadi / samvadi bias in the melodic loop

`pickLoopNote()` uses a weighted random choice:

| Probability band | Swara chosen |
|------------------|--------------|
| 26% | Sa (tonic anchor) |
| 22% | Vadi |
| 14% | Samvadi |
| 38% | Uniform from raga’s `notes` array |

This mirrors the classical idea that improvisation **orbits** vadi and samvadi while still touching the full raga set. **Loop density** (1–5) scales inter-onset interval: sparse at 1, busier at 5, with a slight extra slowdown for very “dark” timbres (`sparseOct < 0.12`).

**Octave:** timbre presets include `sparseOct` — probability of playing the same swara **+12 semitones** (upper register flash), higher in bright ragas (Yaman) than dark ones (Malkauns).

---

## 3. Harmonium timbre and drone

### 3.1 Synthesis chain (Tone.js)

Both drone and loop use **AMSynth** (amplitude modulation → reed-like harmonium roughness):

```
AMSynth → Vibrato → Chorus → Lowpass → Tremolo → Gain → Reverb → Output
```

| Parameter | Drone | Loop | Musical intent |
|-----------|-------|------|----------------|
| Attack | ~1.5 s | 0.05–0.14 s | Drone swells; notes speak quickly |
| Release | ~3.4 s | 1.15–1.75 s | Drone lingers; loop notes decay naturally |
| Filter cutoff | Lower (drone) | Higher (loop) | Drone sits under; loop cuts through |
| Harmonicity | 1.35–1.65 | 1.65–2.15 | Brighter ragas = richer upper partials |
| Vibrato depth | Shared preset | Shared preset | Gentle hand-pump waver |
| Chorus wet | 0.16–0.28 | Same | Slight detune / ensemble width |

Three **timbre presets** — `bright`, `mellow`, `dark` — are assigned per raga. Changing raga **ramps** filter and envelope over ~0.4 s so timbre shifts feel continuous.

### 3.2 Drone: Sa + Pa (tanpura/harmonium convention)

When enabled, the drone triggers a **chord** of three frequencies:

- **Sa** one octave below middle Sa (`noteFreq(0, -12)`)
- **Sa** at middle register (`noteFreq(0, 0)`)
- **Pa** (`noteFreq(7, 0)`)

This follows the common **Sa–Pa** drone used in many ragas where Pa is consonant (not all ragas use Pa in performance, but it is the default practice drone for teaching and harmonium accompaniment). The drone is **not** a sampled tanpura; there is no separate fifth-string decay or jivari buzz.

---

## 4. Taal, matra, and theka

### 4.1 Concepts

| Term | Meaning in Hindustani rhythm | In the app |
|------|------------------------------|------------|
| **Taal** | Metric cycle | One of seven named cycles |
| **Matra** | Time unit / beat | One `Tone.Sequence` step at subdivision `"4n"` per matra |
| **Vibhag** | Bar-like groupings | Shown in UI; used to find **vibhag endings** |
| **Sam** | First matra — strongest accent | Matra index 0: velocity ×0.95, never replaced by ornament in dynamic mode |
| **Khali** | “Empty” / light beat(s) | Matra indices in `taal.light[]`: softer strokes, optional **rest** in dynamic mode |
| **Bol** | Syllable naming a stroke | Mapped to synthetic drum sounds |
| **Theka** | Standard accompaniment pattern | Default `taal.bols[]` sequence when dynamic tabla is off |

### 4.2 Taal catalogue

| Taal | Matras | Vibhag | Khali (light) matras |
|------|--------|--------|----------------------|
| Teentaal | 16 | 4+4+4+4 | 8–11 (second half of middle vibhag) |
| Ektaal | 12 | 2+2+2+2+2+2 | 8–11 |
| Jhaptal | 10 | 2+3+2+3 | 5–6 |
| Rupak | 7 | 3+2+2 | 0–1 (sam-adjacent light — characteristic of Rupak) |
| Dadra | 6 | 3+3 | 2, 5 |
| Keherwa | 8 | 4+4 | 1, 4, 5 |
| Deepchandi | 14 | 3+4+3+4 | 4–7 |

**Tempo:** Tabla runs on `Tone.Transport` at **tabla BPM** (50–200). Session tempo also drives the **melodic loop** interval. Optional **separate tabla tempo** decouples solo speed from accompaniment — useful when practising fast tans at a slower theka.

**Important limitation:** One bol per matra in theka mode; ornament events subdivide **within** a matra but do not change matra count. This matches “one beat slot per matra” pedagogy but not all live tabla performances.

---

## 5. Synthetic tabla

### 5.1 Three-instrument model

| Class | Tone.js engine | Role |
|-------|----------------|------|
| **Bayan** (bass) | MembraneSynth | `dha`, `dhin`, `dhi`, `ge`, `ka`, `ke` — low membrane |
| **Dayan** (treble) | MetalSynth | Ringing overtones on `dhin`/`dhi`, `ta`/`tin`/`ti`, `na` |
| **Tik** | NoiseSynth | Sharp `ta`/`tin`/`ti`/`tun`, `kat` |

### 5.2 Stroke dynamics (theka mode)

Velocity is derived from **position in the cycle**:

| Position | Velocity factor |
|----------|-----------------|
| Sam (matra 0) | 0.95 |
| Khali (light matras) | 0.42 |
| Other | 0.72 |

Ornament strokes multiply by ~0.82 and use type-specific accent: rela 0.94, chakkardar 0.90, teka 0.88. Small **timing jitter** (±6 ms) on subdivided ornaments mimics human looseness without breaking the grid.

### 5.3 Bol → sound mapping (summary)

| Bol family | Bayan | Dayan | Tik |
|------------|-------|-------|-----|
| dha | strong bass | — | — |
| dhin / dhi | bass + | treble ping | — |
| ge / ka | short bass | — | — |
| ta / tin / ti / tun | — | light metal | noise |
| na | — | metal | — |
| kat | — | — | noise |
| ke | mid bass | — | — |

This is **onomatopoeic synthesis**, not stroke-specific samples (e.g. no separate Na-Dhin-Dhin-Na articulation beyond velocity).

---

## 6. Dynamic tabla — ornaments and expression

When **Dynamic tabla** is enabled, each cycle is **generated** rather than read from a fixed theka. This models how a skilled accompanist **varies** density and ornament while keeping sam, khali, and vibhag identity.

### 6.1 Ornament types

| UI label | Classical idea | Implementation |
|----------|----------------|----------------|
| **Rela** | Fast stroke combinations within one matra | 4-bol `strokes[]` array, equal subdivision of matra duration |
| **Chakkardar** | Circular / repeated rela-like figures | Same stroke engine as rela, slightly lower accent |
| **Teka** | Treble-forward flick patterns | Uses taal-specific `tekas` phrase lists |
| **Mukhra** | Short cadential figure (often toward sam) | Weighted only in **body** matras, disabled at vibhag ends |
| **Tihai** | Triplet phrase landing on sam | Weighted at high expression; disabled at vibhag ends in generator |
| **Phrases** | Longer decorative substitutions | Mid-to-high expression weight |
| **Bol tint** | Variation (e.g. dhin → tun, ta → tin) | Picks from `variations[baseBol]` |
| **Khali space** | Rests on light beats | `rest` event — no stroke, khali matras only |

Each taal has a **`TABLA_ORNAMENTS`** entry: curated `relas`, `tekas`, and `variations` appropriate to that theka’s bols.

### 6.2 Expression dial (1–7)

The dial maps to a normalised intensity `t = (level − 1) / 6` and scales ornament weights:

| Level | Label | Behaviour |
|-------|-------|-----------|
| 1 | Theka | Near-fixed theka; minimal ornament weights |
| 2 | Tinted | Occasional bol variation |
| 3 | Khartal | Light rela & teka |
| 4 | Solo | Default “baithak” phrasing |
| 5 | Gat feel | Phrases & mukhra emerge |
| 6 | Kaidaa | Denser clusters |
| 7 | Layakari | Maximum ornament probability; still grid-locked |

Weights are **multiplied by ornament checkboxes** — unchecked types contribute zero.

**Structural rules in `generateDynamicCycle()`:**

1. **Sam** always plays the canonical bol.
2. **Khali** matras may become **rest** (probability ∝ rest weight).
3. **Vibhag-ending** matras suppress mukhra, tihai, and phrase (cadences reserved for interior).
4. **Body** matras use full weighted choice among rela, chakkardar, teka, phrase, mukhra, tihai, variation.

The UI **taal line** shows the generated cycle: bols, `(stroke-stroke-…)` for ornaments, `·` for rest.

### 6.3 Tempo-aware density

Above **120 BPM**, `tablaTempoFactor()` reduces ornament weights (down to 35% at very high tempo) and **increases** rest weight on khali. This reflects the practical rule that **drut** accompaniment thins out so the soloist’s tans remain audible — the app does not pretend to play full layakari at 200 BPM.

Changing tempo or expression **regenerates** the cycle (and rebuilds `Tone.Sequence` if playing).

---

## 7. Session architecture

### 7.1 Two clocks

| Clock | Driver | Purpose |
|-------|--------|---------|
| **Tone.Transport** | Tabla BPM | Matra-accurate tabla sequence |
| **`setInterval`** | Session BPM + density | Melodic loop (not sample-aligned to matra) |

The loop is **logically independent** of taal — like a singer practising alap while tabla plays. Unlinking tabla tempo makes this explicit.

### 7.2 Mix

Three gain stages (drone, loop, tabla) → shared reverb (7 s decay, 22% wet). User sliders scale each bus; toggles mute without stopping Transport.

### 7.3 Browser audio

Web Audio requires a **user gesture** to start (`Tone.start()` on Start click). All synthesis is client-side; no backend.

---

## 8. Code layout

| File | Role |
|------|------|
| `index.html` | UI shell, styles, control surface |
| `app.js` | All music data (`RAGAS`, `TAALS`, `TABLA_ORNAMENTS`, `TIMBRE`) and audio logic |

**Deploy:** GitHub Pages serves `docs/`. The workflow copies root `index.html` and `app.js` into `docs/` on each push — **edit the root files**, not only `docs/`.

---

## 9. Known simplifications (honest limits)

1. **Melody:** No meend, gamak, or pakad; random swaras ≠ raga chalan.
2. **Shruti:** Sparse cents map, not śruti science or raga-specific tunings.
3. **Drone:** Fixed Sa–Pa; no komal/natural Pa switching per raga.
4. **Tabla:** Synthetic; no bayan modulation, no gharana-specific thekas, no tuned dayan pitch per raga.
5. **Taal:** Matra grid is rigid; no adaptive layakari across matra boundaries, no fractional matras.
6. **Ornaments:** Stochastic weights, not rule-based compositions or listener-aware responses to the loop.
7. **Tihai/mukhra:** Simulated by weighting, not guaranteed sam-landing triplets.

These limits keep the app **small, instant, and maintainable** while still encoding recognizable Hindustani **structure** (raga set, vadi/samvadi, shruti hints, taal theka, khali, dynamic theka variation).

---

## 10. Glossary (quick reference)

| Term | Short definition |
|------|------------------|
| **Alap** | Slow, pulse-free melodic exploration — *loosely* echoed by sparse loop |
| **Baithak** | Informal home session — the app’s intended social context |
| **Bol** | Tabla syllable |
| **Chakkardar** | Ornament with circular / repeating stroke pattern |
| **Drut** | Fast tempo — supported up to 200 BPM with thinned tabla |
| **Gat** | Fixed melodic composition with tabla — *hinted* at expression levels 5+ |
| **Kaidaa** | Tabla composition form — *hinted* at expression 6 |
| **Khali** | Unaccented beats in a taal |
| **Layakari** | Rhythmic play with tempo subdivisions — partial via ornaments |
| **Matra** | Beat unit |
| **Mukhra** | Short cadential phrase |
| **Pakad** | Raga’s identifying phrase — not implemented |
| **Rela** | Fast bol combination in one beat |
| **Riyaz** | Practice |
| **Sam** | Downbeat / cycle start |
| **Samvadi** | Second most important swara |
| **Shruti** | Microtonal tuning / consonance framework |
| **Swara** | Musical degree (note) |
| **Taal** | Rhythmic cycle |
| **Teka** | Light treble-oriented tabla filler |
| **Theka** | Standard tabla pattern for a taal |
| **Tihai** | Phrase repeated three times to land on sam |
| **Vadi** | Most important swara of the raga |
| **Vibhag** | Grouping of matras within a taal |

---

## 11. References for listeners and developers

- **Raga theory:** vadi/samvadi, swara sets — standard Hindustani pedagogy texts (e.g. Khan, Bagchee).
- **Taal:** theka notation as in tabla primers (e.g. Teentaal bols in 16 matras).
- **Tone.js:** https://tonejs.github.io/ — Transport, Sequence, AMSynth.
- **Source:** `app.js` constants and functions cited above are the authoritative implementation.

---

*Document version matches app features: dynamic tabla, expression 1–7, ornament toggles, BPM 50–200, five ragas, seven taals.*
