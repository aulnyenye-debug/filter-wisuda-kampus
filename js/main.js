import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-face-three';

const $ = (s) => document.querySelector(s);
const LS_KEY = 'fwk.lastFilter';
const state = { filters: [], idx: 0, mixers: [], mindar: null, started: false, lastBlob: null, lastUrl: null };
const seen = new Set();

const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* abaikan */ } };
const setMsg = (t, err = false) => { const m = $('#msg'); m.textContent = t; m.className = err ? 'err' : ''; };
const refreshStatus = () => { $('#status').textContent = seen.size ? '✅ Wajah terdeteksi' : '🔍 Arahkan wajah ke kamera'; };

async function loadFilters() {
  const res = await fetch('data/filters.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('data/filters.json tidak dapat dimuat (HTTP ' + res.status + ')');
  const data = await res.json();
  if (!Array.isArray(data.filters) || !data.filters.length) throw new Error('filters.json: daftar "filters" kosong.');
  data.filters.forEach((f, i) => {
    if (!f.id || !f.name || !Array.isArray(f.items) || !f.items.length) throw new Error(`filters.json: filter #${i + 1} harus punya id, name, dan items.`);
    f.items.forEach((it, j) => {
      if (typeof it.file !== 'string' || !Number.isInteger(it.anchor)) throw new Error(`filters.json: item ${j + 1} di filter "${f.id}" butuh file (teks) dan anchor (angka).`);
    });
  });
  return data.filters;
}

function setFilter(i) {
  const n = state.filters.length;
  state.idx = ((i % n) + n) % n;
  state.filters.forEach((f, k) => f.objs.forEach((o) => { o.visible = k === state.idx; }));
  $('#fname').textContent = state.filters[state.idx].name;
  lsSet(LS_KEY, state.filters[state.idx].id);
  resetDebug();
}

async function startAR() {
  if (!window.isSecureContext) throw new Error('Halaman harus dibuka lewat HTTPS (atau localhost).');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Browser ini tidak mendukung kamera.');
  setMsg('Memuat data dan model 3D…');
  state.filters = await loadFilters();

  const mindar = new MindARThree({ container: $('#ar') });
  state.mindar = mindar;
  const { renderer, scene, camera } = mindar;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x555577, 2.5));
  const dl = new THREE.DirectionalLight(0xffffff, 2); dl.position.set(0.5, 1, 1); scene.add(dl);

  const anchors = new Map();
  const getAnchor = (i) => {
    if (!anchors.has(i)) {
      const a = mindar.addAnchor(i);
      a.onTargetFound = () => { seen.add(i); refreshStatus(); };
      a.onTargetLost = () => { seen.delete(i); refreshStatus(); };
      anchors.set(i, a);
    }
    return anchors.get(i);
  };

  const loader = new GLTFLoader();
  const D = Math.PI / 180;
  for (const f of state.filters) {
    f.objs = [];
    for (const it of f.items) {
      let gltf;
      try { gltf = await loader.loadAsync(it.file); }
      catch (e) { throw new Error('Gagal memuat model ' + it.file + '. Periksa nama file dan folder assets/.'); }
      const obj = gltf.scene;
      const p = it.position || [0, 0, 0], r = it.rotation || [0, 0, 0], s = it.scale || 1;
      obj.position.set(p[0], p[1], p[2]);
      obj.rotation.set(r[0] * D, r[1] * D, r[2] * D);
      obj.scale.setScalar(s);
      obj.userData.base = { p: [...p], s };
      if (gltf.animations && gltf.animations.length) {
        const mixer = new THREE.AnimationMixer(obj);
        gltf.animations.forEach((c) => mixer.clipAction(c).play());
        state.mixers.push(mixer);
      }
      getAnchor(it.anchor).group.add(obj);
      f.objs.push(obj);
    }
  }

  setMsg('Meminta izin kamera…');
  await mindar.start(); // di sini browser menampilkan dialog izin kamera
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    state.mixers.forEach((m) => m.update(dt));
    renderer.render(scene, camera);
  });

  const saved = lsGet(LS_KEY);
  const si = state.filters.findIndex((f) => f.id === saved);
  setFilter(si >= 0 ? si : 0);
  refreshStatus();
  state.started = true;
}

/* ---------- Foto ---------- */
function isMirrored(el) {
  try { return new DOMMatrix(getComputedStyle(el).transform).a < 0; } catch { return false; }
}
function capture() {
  const { renderer, scene, camera } = state.mindar;
  renderer.render(scene, camera); // pastikan buffer WebGL terisi
  const video = $('#ar video');
  const box = $('#ar').getBoundingClientRect();
  const sc = Math.min(window.devicePixelRatio || 1, 2);
  const c = document.createElement('canvas');
  c.width = Math.round(box.width * sc); c.height = Math.round(box.height * sc);
  const ctx = c.getContext('2d');
  ctx.scale(sc, sc);
  for (const el of [video, renderer.domElement]) {
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const x = r.left - box.left, y = r.top - box.top;
    ctx.save();
    if (isMirrored(el)) { ctx.translate(x + r.width / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + r.width / 2), 0); }
    ctx.drawImage(el, x, y, r.width, r.height);
    ctx.restore();
  }
  c.toBlob((blob) => {
    if (!blob) { alert('Gagal membuat foto.'); return; }
    if (state.lastUrl) URL.revokeObjectURL(state.lastUrl);
    state.lastBlob = blob; state.lastUrl = URL.createObjectURL(blob);
    $('#pimg').src = state.lastUrl; $('#preview').hidden = false;
    if (navigator.vibrate) navigator.vibrate(30);
  }, 'image/jpeg', 0.92);
}
async function savePhoto() {
  if (!state.lastBlob) return;
  const name = 'filter-wisuda-' + Date.now() + '.jpg';
  const file = new File([state.lastBlob], name, { type: 'image/jpeg' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Foto Filter Wisuda' }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = state.lastUrl; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
}

/* ---------- Debug (?debug=1): sesuaikan posisi/skala aksesori ---------- */
const debugOn = new URLSearchParams(location.search).has('debug');
function applyDebug() {
  const s = +$('#dS').value, y = +$('#dY').value, z = +$('#dZ').value;
  state.filters[state.idx].objs.forEach((o) => {
    const b = o.userData.base;
    o.scale.setScalar(b.s * s); o.position.set(b.p[0], b.p[1] + y, b.p[2] + z);
  });
  const o = state.filters[state.idx].objs[0].userData.base;
  $('#dOut').textContent = `"position": [${o.p[0]}, ${+(o.p[1] + y).toFixed(2)}, ${+(o.p[2] + z).toFixed(2)}], "scale": ${+(o.s * s).toFixed(2)}`;
}
function resetDebug() { if (!debugOn) return; $('#dS').value = 1; $('#dY').value = 0; $('#dZ').value = 0; applyDebug(); }

/* ---------- Event ---------- */
$('#go').addEventListener('click', async () => {
  $('#go').disabled = true;
  try {
    await startAR();
    $('#start').hidden = true; $('#hud').hidden = false; $('#bar').hidden = false;
    if (debugOn) { $('#debug').hidden = false; applyDebug(); }
  } catch (e) {
    console.error(e);
    const t = ((e && e.name) || '') + ' ' + ((e && e.message) || '');
    if (/NotAllowed|Permission|denied/i.test(t)) setMsg('Izin kamera ditolak. Buka pengaturan browser untuk situs ini, izinkan Kamera, lalu muat ulang halaman.', true);
    else if (/NotFound|DevicesNotFound/i.test(t)) setMsg('Kamera tidak ditemukan di perangkat ini.', true);
    else if (/NotReadable|TrackStart/i.test(t)) setMsg('Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu lalu coba lagi.', true);
    else setMsg('Terjadi kesalahan: ' + (e && e.message ? e.message : e), true);
    $('#go').disabled = false; $('#go').textContent = 'Coba Lagi';
    if (state.started === false && state.mindar) { try { state.mindar.stop(); } catch { /* abaikan */ } }
  }
});
$('#prev').addEventListener('click', () => state.started && setFilter(state.idx - 1));
$('#next').addEventListener('click', () => state.started && setFilter(state.idx + 1));
$('#shot').addEventListener('click', () => state.started && capture());
$('#save').addEventListener('click', savePhoto);
$('#close').addEventListener('click', () => { $('#preview').hidden = true; });
['dS', 'dY', 'dZ'].forEach((id) => $('#' + id).addEventListener('input', applyDebug));
