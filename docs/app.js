// Raga Drone — dynamic tabla, expression dial, BPM 50-200
const TIMBRE = {
  bright: { droneFilter: 1280, loopFilter: 1950, harmonicityDr: 1.65, harmonicityLp: 2.15, chorusWet: 0.28, vibDepth: 0.1, loopAttack: 0.05, loopRelease: 1.15, loopVel: 0.52, sparseOct: 0.22 },
  mellow: { droneFilter: 1150, loopFilter: 1550, harmonicityDr: 1.55, harmonicityLp: 1.9, chorusWet: 0.24, vibDepth: 0.09, loopAttack: 0.08, loopRelease: 1.35, loopVel: 0.48, sparseOct: 0.16 },
  dark: { droneFilter: 920, loopFilter: 1100, harmonicityDr: 1.35, harmonicityLp: 1.65, chorusWet: 0.16, vibDepth: 0.07, loopAttack: 0.14, loopRelease: 1.75, loopVel: 0.42, sparseOct: 0.08 },
};

const RAGAS = {
  yaman: { name: "Yaman", swaras: "S R G M♯ P D N", notes: [0, 2, 4, 6, 7, 9, 11], vadi: 4, samvadi: 11, timbre: "bright", shruti: { 6: 55 } },
  bhairav: { name: "Bhairav", swaras: "S r G m P d N", notes: [0, 1, 4, 5, 7, 8, 11], vadi: 1, samvadi: 7, timbre: "dark", shruti: { 1: -48, 5: -42, 8: -48 } },
  malkauns: { name: "Malkauns", swaras: "S g m d S", notes: [0, 3, 5, 8], vadi: 5, samvadi: 0, timbre: "dark", shruti: { 3: -48, 5: -42, 8: -48 } },
  kafi: { name: "Kafi", swaras: "S R g M P D n", notes: [0, 2, 3, 5, 7, 9, 10], vadi: 9, samvadi: 5, timbre: "mellow", shruti: { 3: -48, 10: -48 } },
  darbari: { name: "Darbari", swaras: "S r g m P d n", notes: [0, 1, 3, 5, 7, 8, 10], vadi: 1, samvadi: 5, timbre: "dark", shruti: { 1: -48, 3: -48, 5: -42, 8: -48, 10: -48 } },
};

const TAALS = {
  teentaal: { name: "Teentaal", matras: 16, vibhag: "4+4+4+4", display: "Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Ta Tin Tin Ta | Dha Dhin Dhin Dha", bols: ["dha","dhin","dhin","dha","dha","dhin","dhin","dha","ta","tin","tin","ta","dha","dhin","dhin","dha"], light: [8,9,10,11] },
  ektaal: { name: "Ektaal", matras: 12, vibhag: "2+2+2+2+2+2", display: "Dhin Dhin | Dha Ge | Dhin Dhin | Dha Ge | Tin Na | Kat Ta", bols: ["dhin","dhin","dha","ge","dhin","dhin","dha","ge","tin","na","kat","ta"], light: [8,9,10,11] },
  jhaptal: { name: "Jhaptal", matras: 10, vibhag: "2+3+2+3", display: "Dhi Na | Dhi Dhi Na | Ti Na | Dhi Dhi Na", bols: ["dhi","na","dhi","dhi","na","ti","na","dhi","dhi","na"], light: [5,6] },
  rupak: { name: "Rupak", matras: 7, vibhag: "3+2+2", display: "Tin Tin Na | Dhin Na | Dhin Na", bols: ["tin","tin","na","dhin","na","dhin","na"], light: [0,1] },
  dadra: { name: "Dadra", matras: 6, vibhag: "3+3", display: "Dha Dhin Na | Dha Tin Na", bols: ["dha","dhin","na","dha","tin","na"], light: [2,5] },
  keherwa: { name: "Keherwa", matras: 8, vibhag: "4+4", display: "Dha Ge Na Tin | Na Ka Dhin Na", bols: ["dha","ge","na","tin","na","ka","dhin","na"], light: [1,4,5] },
  deepchandi: { name: "Deepchandi", matras: 14, vibhag: "3+4+3+4", display: "Dha Dha Dhin Ta | Ke Na Ti Dha Dhin Ta | Dha Dha Dhin Ta | Ke Na Ti Dha Dhin Ta", bols: ["dha","dha","dhin","ta","ke","na","ti","dha","dhin","ta","dha","dha","dhin","ta"], light: [4,5,6,7] },
};

const TABLA_ORNAMENTS = {
  teentaal: { relas: [["dha","tin","dha","tin"],["dhin","tin","dhin","tin"],["dha","dhin","dha","dhin"],["tin","dha","tin","dha"]], tekas: [["tin","na","tin","na"],["ti","na","ti","na"],["tin","tin","na","ka"],["ta","tin","ta","tin"]], variations: { dhin: ["dhin","tun"], ta: ["ta","tin"], tin: ["tin","ti"] } },
  ektaal: { relas: [["dhin","dhin","dha","ge"],["dha","ge","dhin","dhin"],["dhin","tin","dhin","na"]], tekas: [["tin","na","kat","ta"],["na","ge","na","ge"],["tin","na","tin","na"]], variations: { ge: ["ge","ka"], dhin: ["dhin","tun"], ta: ["ta","tin"] } },
  jhaptal: { relas: [["dhi","na","dhi","dhi"],["dhi","dhi","na","ti"],["na","dhi","dhi","na"]], tekas: [["ti","na","dhi","na"],["tin","na","tin","na"],["na","ti","na","ti"]], variations: { dhi: ["dhi","dhin"], ti: ["ti","tin"], na: ["na","tin"] } },
  rupak: { relas: [["tin","tin","na","dhin"],["dhin","na","dhin","na"],["tin","na","tin","na"]], tekas: [["tin","na","tin","na"],["na","dhin","na","dhin"],["tin","tin","na","ka"]], variations: { tin: ["tin","ti"], dhin: ["dhin","tun"], na: ["na","tin"] } },
  dadra: { relas: [["dha","dhin","na","dha"],["dhin","na","dha","tin"],["dha","tin","na","dha"]], tekas: [["tin","na","tin","na"],["na","tin","na","tin"],["dha","tin","na","ka"]], variations: { dhin: ["dhin","tun"], tin: ["tin","ti"], na: ["na","tin"] } },
  keherwa: { relas: [["dha","ge","na","tin"],["ge","na","tin","na"],["dha","dhin","na","tin"]], tekas: [["na","ka","dhin","na"],["tin","na","ka","dhin"],["na","tin","na","ka"]], variations: { ge: ["ge","ka"], dhin: ["dhin","tun"], tin: ["tin","ti"] } },
  deepchandi: { relas: [["dha","dha","dhin","ta"],["dhin","ta","ke","na"],["dha","dhin","ta","dha"]], tekas: [["ke","na","ti","dha"],["ti","dha","dhin","ta"],["na","ti","na","ti"]], variations: { dhin: ["dhin","tun"], ta: ["ta","tin"], ti: ["ti","tin"] } },
};

const TABLA_EXPRESSION_HINTS = [
  "Theka — steady, almost no ornament",
  "Tinted — occasional bol colour",
  "Khartal — light rela & teka",
  "Solo — human baithak phrasing",
  "Gat feel — phrases & mukhra",
  "Kaidaa — denser ornament clusters",
  "Layakari — full speed & cadence",
];

const ORNAMENT_TOGGLE_IDS = ["ornRela","ornChakkardar","ornTeka","ornMukhra","ornTihai","ornPhrase","ornVariation","ornKhali"];
const ROOTS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const SWARA_LABEL = ["Sa","r","R","g","G","m","M♯","P","d","D","n","N"];

function swaraLabel(semitone) { return SWARA_LABEL[((semitone % 12) + 12) % 12]; }

let droneSynth, loopSynth, droneChain, loopChain, reverb, droneGain, loopGain, tablaGain;
let bayan, dayan, tik, tablaSeq = null, loopInterval = null;
let running = false, audioReady = false, matraIdx = 0, dynamicTablaCycle = null;

const ragaEl = document.getElementById("raga");
const rootEl = document.getElementById("root");
const taalEl = document.getElementById("taal");
const swaraLine = document.getElementById("swara-line");
const taalLine = document.getElementById("taal-line");
const statusEl = document.getElementById("status");

Object.entries(RAGAS).forEach(([id, r]) => ragaEl.append(new Option(r.name, id)));
ROOTS.forEach((n) => rootEl.append(new Option(n, n)));
Object.entries(TAALS).forEach(([id, t]) => taalEl.append(new Option(`${t.name} (${t.matras})`, id)));

function rootMidi() { return 48 + ROOTS.indexOf(rootEl.value); }
function currentRaga() { return RAGAS[ragaEl.value]; }
function currentTimbre() { return TIMBRE[currentRaga().timbre] || TIMBRE.mellow; }
function noteFreq(semitoneFromSa, octaveAdd = 0) {
  const r = currentRaga();
  const midi = rootMidi() + semitoneFromSa + octaveAdd;
  const cents = (r.shruti && r.shruti[semitoneFromSa]) || 0;
  return Tone.Frequency(midi, "midi").transpose(cents).toFrequency();
}
function currentTaal() { return TAALS[taalEl.value]; }
function dynamicTablaEnabled() { return document.getElementById("tablaDynamic").checked; }
function tablaExpressionLevel() { return +document.getElementById("tablaExpression").value; }
function tablaOrnamentMask() {
  return {
    rela: document.getElementById("ornRela").checked,
    chakkardar: document.getElementById("ornChakkardar").checked,
    teka: document.getElementById("ornTeka").checked,
    mukhra: document.getElementById("ornMukhra").checked,
    tihai: document.getElementById("ornTihai").checked,
    phrase: document.getElementById("ornPhrase").checked,
    variation: document.getElementById("ornVariation").checked,
    rest: document.getElementById("ornKhali").checked,
  };
}
function buildTablaWeights() {
  const level = tablaExpressionLevel();
  const t = (level - 1) / 6;
  const mask = tablaOrnamentMask();
  const on = (key, amount) => amount * (mask[key] ? 1 : 0);
  return {
    level, t, label: TABLA_EXPRESSION_HINTS[level - 1],
    weights: {
      rela: on("rela", 0.02 + t * 0.2),
      chakkardar: on("chakkardar", t > 0.65 ? (t - 0.65) * 0.45 : 0),
      teka: on("teka", 0.04 + t * 0.18),
      phrase: on("phrase", t > 0.35 ? (t - 0.35) * 0.22 : 0),
      mukhra: on("mukhra", t > 0.45 ? (t - 0.45) * 0.28 : 0),
      tihai: on("tihai", t > 0.55 ? (t - 0.55) * 0.22 : 0),
      variation: on("variation", 0.08 + t * 0.22),
      rest: on("rest", 0.02 + t * 0.1),
    },
  };
}
function tablaTempoFactor() {
  const bpm = tablaBpm();
  if (bpm <= 120) return 1;
  return Math.max(0.35, 1 - (bpm - 120) / 160);
}
function applyTempoToWeights(weights) {
  const f = tablaTempoFactor();
  const out = {};
  for (const [k, v] of Object.entries(weights)) {
    out[k] = k === "rest" ? v * (1 + (1 - f) * 0.5) : v * f;
  }
  return out;
}
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function vibhagEnds(taal) {
  const parts = taal.vibhag.split("+").map(Number);
  const starts = [0];
  let pos = 0;
  for (let i = 0; i < parts.length - 1; i++) { pos += parts[i]; starts.push(pos); }
  return starts.map((start, i, arr) => ((arr[i + 1] == null ? taal.matras : arr[i + 1]) - 1));
}
function weightedPick(weights, keys) {
  const total = keys.reduce((s, k) => s + (weights[k] || 0), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const k of keys) { roll -= weights[k] || 0; if (roll <= 0) return k; }
  return keys[keys.length - 1];
}
function generateDynamicCycle(taalId) {
  const t = TAALS[taalId];
  const orn = TABLA_ORNAMENTS[taalId];
  const lightSet = new Set(t.light || []);
  const vibEnds = new Set(vibhagEnds(t));
  const { weights: raw } = buildTablaWeights();
  const weights = applyTempoToWeights(raw);
  const cycle = [];
  for (let i = 0; i < t.matras; i++) {
    const baseBol = t.bols[i];
    const isSam = i === 0;
    const isLight = lightSet.has(i);
    const isEnd = vibEnds.has(i);
    if (isSam) { cycle.push({ type: "bol", bol: baseBol }); continue; }
    if (isLight && weights.rest > 0 && Math.random() < weights.rest * 0.35) {
      cycle.push({ type: "rest" }); continue;
    }
    const body = !isEnd && !isSam;
    const w = body ? weights : { ...weights, mukhra: 0, tihai: 0, phrase: 0 };
    const choice = weightedPick(w, ["rela","chakkardar","teka","phrase","mukhra","tihai","variation"]);
    if (choice === "rela" && orn.relas.length) cycle.push({ type: "rela", strokes: pickRandom(orn.relas).slice() });
    else if (choice === "chakkardar" && orn.relas.length) cycle.push({ type: "chakkardar", strokes: pickRandom(orn.relas).slice() });
    else if (choice === "teka" && orn.tekas.length) cycle.push({ type: "teka", strokes: pickRandom(orn.tekas).slice() });
    else if (choice === "variation" && orn.variations[baseBol]) cycle.push({ type: "bol", bol: pickRandom(orn.variations[baseBol]) });
    else cycle.push({ type: "bol", bol: baseBol });
  }
  return cycle;
}
function bolSequenceLabel(cycle) {
  return cycle.map((ev) => ev.type === "bol" ? ev.bol : ev.type === "rest" ? "·" : `(${ev.strokes.join("-")})`).join(" ");
}
function updateTablaDynamicControls() {
  document.getElementById("tablaDynamicControls").classList.toggle("hidden", !dynamicTablaEnabled());
}
function updateExpressionHint() {
  document.getElementById("tabla-expression-hint").textContent = TABLA_EXPRESSION_HINTS[tablaExpressionLevel() - 1];
}
function onTablaDynamicSettingsChange() {
  updateExpressionHint();
  dynamicTablaCycle = dynamicTablaEnabled() ? generateDynamicCycle(taalEl.value) : null;
  updateLines();
  if (running && tablaEnabled()) rebuildTablaSeq();
}
function updateLines() {
  const r = currentRaga();
  const t = currentTaal();
  swaraLine.textContent = `${r.swaras} · shruti tuning · ${r.timbre} harmonium`;
  if (dynamicTablaEnabled() && dynamicTablaCycle) {
    taalLine.textContent = `${t.matras} matras (${t.vibhag}) · ${bolSequenceLabel(dynamicTablaCycle)}`;
  } else {
    taalLine.textContent = `${t.matras} matras (${t.vibhag}) · ${t.display}`;
  }
}
ragaEl.onchange = () => { updateLines(); applyRagaTimbre(); if (running) syncDrone(); if (running) statusEl.textContent = "Playing — " + playbackLabel(); };
taalEl.onchange = () => { dynamicTablaCycle = dynamicTablaEnabled() ? generateDynamicCycle(taalEl.value) : null; updateLines(); if (running) rebuildTablaSeq(); };
document.getElementById("tablaDynamic").onchange = () => { updateTablaDynamicControls(); onTablaDynamicSettingsChange(); };
document.getElementById("tablaExpression").oninput = onTablaDynamicSettingsChange;
ORNAMENT_TOGGLE_IDS.forEach((id) => { document.getElementById(id).onchange = onTablaDynamicSettingsChange; });
updateTablaDynamicControls();
updateExpressionHint();
updateLines();

function pickLoopNote() {
  const r = currentRaga(), t = currentTimbre(), notes = r.notes, roll = Math.random();
  let sem;
  if (roll < 0.26) sem = 0; else if (roll < 0.48) sem = r.vadi; else if (roll < 0.62) sem = r.samvadi;
  else sem = notes[Math.floor(Math.random() * notes.length)];
  return { freq: noteFreq(sem, Math.random() < t.sparseOct ? 12 : 0), vel: t.loopVel * (0.85 + Math.random() * 0.2) };
}

function playBol(bol, time, matraIndex, { ornament = false, accent = 1 } = {}) {
  const t = currentTaal();
  const lightSet = new Set(t.light || []);
  const isLight = lightSet.has(matraIndex);
  const isSam = matraIndex === 0;
  let vel = (isSam ? 0.95 : isLight ? 0.42 : 0.72) * accent;
  if (ornament) vel *= 0.82;
  switch (bol) {
    case "dha": bayan.triggerAttackRelease("C1", "16n", time, vel); break;
    case "dhin": case "dhi": bayan.triggerAttackRelease("D1", "16n", time, vel * 0.85); dayan.triggerAttackRelease("A4", "32n", time, vel * 0.35); break;
    case "ge": case "ka": bayan.triggerAttackRelease("G1", "32n", time, vel * 0.5); break;
    case "ta": case "tin": case "ti": case "tun": tik.triggerAttackRelease("16n", time, vel * (bol === "tin" ? 0.55 : 0.65)); dayan.triggerAttackRelease("C5", "32n", time, vel * 0.3); break;
    case "na": dayan.triggerAttackRelease("G4", "16n", time, vel * 0.55); break;
    case "kat": tik.triggerAttackRelease("32n", time, vel * 0.5); break;
    case "ke": bayan.triggerAttackRelease("F1", "32n", time, vel * 0.45); break;
    default: break;
  }
}

function playMatraEvent(event, time, matraIndex) {
  if (event.type === "bol") { playBol(event.bol, time, matraIndex); return; }
  if (event.type === "rest") return;
  const strokes = event.strokes;
  const matraDur = Tone.Time("4n").toSeconds();
  const sub = matraDur / strokes.length;
  const accent = event.type === "rela" ? 0.94 : event.type === "chakkardar" ? 0.9 : 0.88;
  strokes.forEach((bol, j) => {
    const jitter = (Math.random() - 0.5) * 0.012;
    playBol(bol, time + j * sub + jitter, matraIndex, { ornament: true, accent });
  });
}

function makeHarmonium(dest, { drone = false } = {}) {
  const preset = currentTimbre();
  const vib = new Tone.Vibrato({ frequency: 5.2, depth: preset.vibDepth, wet: 0.22 });
  const chorus = new Tone.Chorus({ frequency: 1.1, delayTime: 4.2, depth: 0.35, wet: preset.chorusWet }).start();
  const filt = new Tone.Filter({ frequency: drone ? preset.droneFilter : preset.loopFilter, type: "lowpass", rolloff: -24, Q: drone ? 1.7 : 2.2 });
  const trem = new Tone.Tremolo({ frequency: drone ? 3 : 4.2, depth: drone ? 0.05 : 0.035, wet: drone ? 0.18 : 0.1 }).start();
  const synth = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: drone ? preset.harmonicityDr : preset.harmonicityLp,
    oscillator: { type: "sawtooth" },
    envelope: drone ? { attack: 1.5, decay: 0.38, sustain: 0.92, release: 3.4 } : { attack: preset.loopAttack, decay: 0.2, sustain: 0.6, release: preset.loopRelease },
    modulation: { type: "sine" },
    modulationEnvelope: { attack: 0.04, decay: 0.14, sustain: drone ? 0.42 : 0.28, release: 0.65 },
    volume: drone ? -6 : -4,
  });
  synth.chain(vib, chorus, filt, trem, dest);
  return { synth, filter: filt, vib, chorus, trem, drone };
}

function applyRagaTimbre() {
  if (!loopChain || !droneChain) return;
  const p = currentTimbre(), ramp = 0.4;
  droneChain.filter.frequency.rampTo(p.droneFilter, ramp);
  loopChain.filter.frequency.rampTo(p.loopFilter, ramp);
  loopChain.vib.depth = p.vibDepth;
  loopChain.chorus.wet.value = p.chorusWet;
  droneChain.synth.set({ harmonicity: p.harmonicityDr });
  loopChain.synth.set({ harmonicity: p.harmonicityLp, envelope: { attack: p.loopAttack, decay: 0.2, sustain: 0.6, release: p.loopRelease } });
}

async function ensureAudio() {
  await Tone.start();
  if (audioReady) return;
  const master = new Tone.Gain(1).toDestination();
  reverb = new Tone.Reverb({ decay: 7, wet: 0.22 });
  await reverb.generate();
  reverb.connect(master);
  droneGain = new Tone.Gain(0).connect(reverb);
  loopGain = new Tone.Gain(0).connect(reverb);
  tablaGain = new Tone.Gain(0).connect(reverb);
  droneChain = makeHarmonium(droneGain, { drone: true });
  loopChain = makeHarmonium(loopGain, { drone: false });
  droneSynth = droneChain.synth;
  loopSynth = loopChain.synth;
  applyRagaTimbre();
  bayan = new Tone.MembraneSynth({ pitchDecay: 0.008, octaves: 5, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.15 } }).connect(tablaGain);
  dayan = new Tone.MetalSynth({ frequency: 280, envelope: { attack: 0.001, decay: 0.08, release: 0.01 }, harmonicity: 4.5, modulationIndex: 20, resonance: 5000, octaves: 1.2, volume: -14 }).connect(tablaGain);
  tik = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.04, sustain: 0 } }).connect(tablaGain);
  audioReady = true;
}

function sessionBpm() { return +document.getElementById("sessionTempo").value; }
function tablaBpm() { return document.getElementById("unlinkTablaTempo").checked ? +document.getElementById("tablaTempo").value : sessionBpm(); }
function setTablaTransportBpm() { Tone.Transport.bpm.value = tablaBpm(); }
function updateTablaTempoRow() { document.getElementById("tablaTempoRow").classList.toggle("hidden", !document.getElementById("unlinkTablaTempo").checked); }
document.getElementById("unlinkTablaTempo").onchange = () => { updateTablaTempoRow(); setTablaTransportBpm(); if (running) rebuildTablaSeq(); };
document.getElementById("sessionTempo").onchange = () => { setTablaTransportBpm(); if (running) { scheduleLoop(); if (dynamicTablaEnabled()) { dynamicTablaCycle = generateDynamicCycle(taalEl.value); rebuildTablaSeq(); } } };
document.getElementById("tablaTempo").onchange = () => { setTablaTransportBpm(); if (running) { if (dynamicTablaEnabled()) dynamicTablaCycle = generateDynamicCycle(taalEl.value); rebuildTablaSeq(); } };
updateTablaTempoRow();

function shouldDrone() { return document.getElementById("droneOn").checked; }
function droneGainLevel() { return (+document.getElementById("droneVol").value / 100) * 0.85; }

function rebuildTablaSeq() {
  if (tablaSeq) { tablaSeq.stop(); tablaSeq.dispose(); tablaSeq = null; }
  if (!tablaEnabled() || !running) return;
  const t = currentTaal();
  if (!dynamicTablaCycle && dynamicTablaEnabled()) dynamicTablaCycle = generateDynamicCycle(taalEl.value);
  const seqData = dynamicTablaEnabled() && dynamicTablaCycle ? dynamicTablaCycle : t.bols.map((bol) => ({ type: "bol", bol }));
  matraIdx = 0;
  tablaSeq = new Tone.Sequence((time, event) => {
    const i = matraIdx % t.matras;
    if (typeof event === "string") playBol(event, time, i);
    else playMatraEvent(event, time, i);
    matraIdx++;
  }, seqData, "4n");
  tablaSeq.loop = true;
  tablaSeq.humanize = false;
  tablaSeq.start(0);
}

function ragaEnabled() { return document.getElementById("ragaOn").checked; }
function tablaEnabled() { return document.getElementById("tablaOn").checked; }
function stopRaga() { clearInterval(loopInterval); loopInterval = null; if (loopSynth) loopSynth.releaseAll(); }
function stopDrone() { if (droneSynth) droneSynth.releaseAll(); }
function syncDrone() {
  if (!droneSynth || !running) return;
  if (shouldDrone()) { droneSynth.releaseAll(); droneSynth.triggerAttack([noteFreq(0, -12), noteFreq(0, 0), noteFreq(7, 0)], Tone.now(), 0.92); }
  else stopDrone();
}
function scheduleLoop() {
  clearInterval(loopInterval); loopInterval = null;
  if (!ragaEnabled() || !running) return;
  const bpm = sessionBpm(), density = +document.getElementById("density").value, t = currentTimbre();
  const ms = (60 / bpm) * 1000 * (6.5 - density) * 0.55;
  loopInterval = setInterval(() => {
    if (!running || !ragaEnabled()) return;
    const n = pickLoopNote();
    loopSynth.triggerAttackRelease(n.freq, "8n", Tone.now(), n.vel);
  }, Math.max(220, ms * (t.sparseOct < 0.12 ? 1.35 : 1)));
}
function playbackLabel() {
  const parts = [];
  if (shouldDrone()) parts.push("drone");
  if (ragaEnabled()) { const r = currentRaga(); parts.push(`${r.name} (${r.timbre}, vadi ${swaraLabel(r.vadi)}, samvadi ${swaraLabel(r.samvadi)})`); }
  if (tablaEnabled()) {
    const taalLabel = currentTaal().name;
    if (dynamicTablaEnabled()) parts.push(`${taalLabel} · ${TABLA_EXPRESSION_HINTS[tablaExpressionLevel() - 1].split(" — ")[0]}`);
    else parts.push(taalLabel);
  }
  return parts.length ? parts.join(" · ") : "nothing enabled";
}
function setVolumes() {
  if (!droneGain) return;
  droneGain.gain.rampTo(shouldDrone() ? droneGainLevel() : 0, 0.2);
  loopGain.gain.rampTo(ragaEnabled() ? +document.getElementById("loopVol").value / 100 * 0.8 : 0, 0.2);
  tablaGain.gain.rampTo(tablaEnabled() ? +document.getElementById("tablaVol").value / 100 * 0.9 : 0, 0.2);
}
function onMixChange() {
  setVolumes();
  if (!running) return;
  syncDrone();
  if (ragaEnabled()) scheduleLoop(); else stopRaga();
  if (tablaEnabled()) rebuildTablaSeq();
  else if (tablaSeq) { tablaSeq.stop(); tablaSeq.dispose(); tablaSeq = null; }
  statusEl.textContent = "Playing — " + playbackLabel();
}
["droneVol","loopVol","density","tablaVol"].forEach((id) => {
  document.getElementById(id).oninput = () => { setVolumes(); if (!running) return; if (id === "droneVol") syncDrone(); if (id === "density" && ragaEnabled()) scheduleLoop(); };
});
["ragaOn","tablaOn","droneOn"].forEach((id) => { document.getElementById(id).onchange = onMixChange; });

document.getElementById("start").onclick = async () => {
  const startBtn = document.getElementById("start");
  if (!ragaEnabled() && !tablaEnabled() && !shouldDrone()) { statusEl.textContent = "Enable loop, tabla, and/or drone, then press Start."; return; }
  try {
    startBtn.disabled = true;
    statusEl.textContent = "Starting audio…";
    await ensureAudio();
    running = true;
    dynamicTablaCycle = dynamicTablaEnabled() ? generateDynamicCycle(taalEl.value) : null;
    setTablaTransportBpm();
    setVolumes();
    if (ragaEnabled()) scheduleLoop();
    syncDrone();
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    if (tablaEnabled()) Tone.Transport.start();
    rebuildTablaSeq();
    document.getElementById("stop").disabled = false;
    statusEl.textContent = "Playing — " + playbackLabel();
    statusEl.classList.add("on");
  } catch (err) {
    console.error(err);
    running = false;
    startBtn.disabled = false;
    statusEl.textContent = "Could not start audio — try again or refresh.";
    statusEl.classList.remove("on");
  }
};

document.getElementById("stop").onclick = () => {
  running = false;
  clearInterval(loopInterval);
  if (tablaSeq) { tablaSeq.stop(); tablaSeq.dispose(); tablaSeq = null; }
  Tone.Transport.stop();
  if (droneSynth) droneSynth.releaseAll();
  if (loopSynth) loopSynth.releaseAll();
  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
  statusEl.textContent = "Stopped";
  statusEl.classList.remove("on");
};

rootEl.onchange = () => { if (running) { syncDrone(); if (ragaEnabled()) scheduleLoop(); } };
