// N27 — EM BÉ hoạt hình (mặc áo đấu đội đối thủ, chữ thành phố, không logo) + bỉm. Dựng bằng khối, không skinning.
// Hướng mặt +z. Cao đứng ~0.95 m (scale 1). Tư thế: sit | crawl | stand | tub (ngồi trong chậu); tay: clap, wave, cry, throw, hold, draw, splash, cheer.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.65 }, o));
const V = (x, y, z) => new THREE.Vector3(x, y, z); const PI = Math.PI;
const cl = (x) => Math.min(1, Math.max(0, x));
function jerseyTex(city, num, bg, fg, edge) { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 1024, 512); g.fillStyle = edge; g.fillRect(0, 0, 1024, 26); g.fillRect(0, 486, 1024, 26);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  // mặt trước ở u=0.5 (trụ xoay PI nên u=0.5 ↔ +z); số lưng vẽ ở 2 mép u=0/1
  for (const [u, txt, sz, y] of [[0.5, city, 92, 170], [0.5, String(num), 170, 330], [0.0, String(num), 230, 270], [1.0, String(num), 230, 270]]) {
    g.font = `900 ${sz}px Anton, Impact, sans-serif`; g.lineWidth = 14; g.strokeStyle = edge; g.strokeText(txt, u * 1024, y); g.fillStyle = fg; g.fillText(txt, u * 1024, y); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
export const BOSTON = { city: 'BOSTON', bg: '#007a33', fg: '#ffffff', edge: '#0b3d1d' };

export function makeBaby(o = {}) {
  const P = Object.assign({ skin: '#f2c6a0', hair: '#5a3a1a', num: 1, ...BOSTON }, o);
  const root = new THREE.Group(); const mSkin = std(P.skin, { roughness: 0.55 }), mHair = std(P.hair, { roughness: 0.8 });
  const hip = new THREE.Group(); hip.position.y = 0.3; root.add(hip);
  // bỉm + áo đấu (trụ thuôn, chữ thành phố + số)
  const dia = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), std('#fbfbf8', { roughness: 0.9 })); dia.scale.set(0.17, 0.13, 0.15); dia.position.y = 0.02; hip.add(dia);
  const tx = jerseyTex(P.city, P.num, P.bg, P.fg, P.edge);
  const jer = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.175, 0.3, 32, 1, false), [new THREE.MeshStandardMaterial({ map: tx, roughness: 0.75 }), std(P.edge), std(P.bg)]); jer.position.y = 0.2; jer.rotation.y = PI; hip.add(jer);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.75 })); belly.scale.set(0.16, 0.12, 0.15); belly.position.y = 0.12; belly.rotation.y = 0; hip.add(belly); belly.visible = false;
  for (const sg of [-1, 1]) { const sl = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.016, 8, 16), std(P.edge)); sl.position.set(sg * 0.12, 0.33, 0); sl.rotation.y = PI / 2; hip.add(sl); }
  // đầu to
  const neck = new THREE.Group(); neck.position.y = 0.36; hip.add(neck);
  const head = new THREE.Group(); head.position.y = 0.15; neck.add(head);
  const hs = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24), mSkin); hs.scale.set(1, 0.98, 0.96); head.add(hs);
  for (const sg of [-1, 1]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), mSkin); ear.scale.set(0.5, 1, 0.8); ear.position.set(sg * 0.168, 0.0, -0.01); head.add(ear);
    const ck = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), std('#f49a96', { roughness: 0.7, transparent: true, opacity: 0.6 })); ck.scale.set(1, 0.6, 0.3); ck.position.set(sg * 0.095, -0.05, 0.14); head.add(ck); }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), mSkin); nose.position.set(0, -0.015, 0.165); head.add(nose);
  // tóc: vài lọn xoăn trên đỉnh
  const hairG = new THREE.Group(); head.add(hairG); for (let k = 0; k < 9; k++) { const a = k * 2.399, r = 0.05 + (k % 3) * 0.02; const s = new THREE.Mesh(new THREE.SphereGeometry(0.03 + (k % 2) * 0.01, 10, 8), mHair); s.position.set(Math.cos(a) * r, 0.155 + (k % 3) * 0.008, Math.sin(a) * r - 0.02); hairG.add(s); }
  const curl = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.009, 6, 14, PI * 1.5), mHair); curl.position.set(0.01, 0.2, 0.03); curl.rotation.y = PI / 2; hairG.add(curl);
  // mắt to + mí; miệng (mở khi khóc/cười)
  const eyes = []; for (const sg of [-1, 1]) { const g = new THREE.Group(); g.position.set(sg * 0.06, 0.03, 0.142); head.add(g);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 12), std('#ffffff', { roughness: 0.25 })); w.scale.z = 0.6; g.add(w);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 10), std('#1a120c', { roughness: 0.2 })); pup.position.z = 0.016; pup.scale.z = 0.5; g.add(pup);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff' })); hl.position.set(0.008, 0.008, 0.028); g.add(hl);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.037, 16, 8, 0, PI * 2, 0, PI / 2), mSkin); lid.rotation.x = -1.6; lid.scale.z = 0.7; g.add(lid); eyes.push({ g, pup, lid }); }
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), std('#7a2030', { roughness: 0.6 })); mouth.scale.set(0.032, 0.008, 0.012); mouth.position.set(0, -0.075, 0.152); head.add(mouth);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.005, 6, 16, PI), std('#a03a48')); smile.rotation.z = PI; smile.position.set(0, -0.065, 0.158); head.add(smile);
  const tears = []; for (const sg of [-1, 1]) { const tr = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), std('#8fd0ff', { roughness: 0.05, transparent: true, opacity: 0.85 })); tr.scale.y = 1.6; tr.position.set(sg * 0.065, -0.01, 0.15); head.add(tr); tears.push(tr); }
  // tay: trục vai, bắp tay mũm mĩm + bàn tay
  const arms = []; for (const sg of [-1, 1]) { const sh = new THREE.Group(); sh.position.set(sg * 0.15, 0.3, 0); hip.add(sh);
    const up = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 6, 12), mSkin); up.position.y = -0.08; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.15; sh.add(el); const lo = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.08, 6, 12), mSkin); lo.position.y = -0.06; el.add(lo);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 10), mSkin); hand.position.y = -0.13; el.add(hand); arms.push({ sh, el, hand, sg }); }
  // chân: đùi + bắp chân + bàn chân
  const legs = []; for (const sg of [-1, 1]) { const hp = new THREE.Group(); hp.position.set(sg * 0.075, 0.0, 0); hip.add(hp);
    const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.08, 6, 12), mSkin); th.position.y = -0.07; hp.add(th);
    const kn = new THREE.Group(); kn.position.y = -0.14; hp.add(kn); const sh = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.06, 6, 12), mSkin); sh.position.y = -0.05; kn.add(sh);
    const ft = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mSkin); ft.scale.set(0.045, 0.035, 0.07); ft.position.set(0, -0.12, 0.03); kn.add(ft); legs.push({ hp, kn, sg }); }
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.receiveShadow = true; x.frustumCulled = false; } });
  return { root, hip, neck, head, eyes, mouth, smile, tears, arms, legs };
}
// o.base: 'sit' | 'crawl' | 'stand' | 'tub'; o.arms: 'idle'|'clap'|'wave'|'cry'|'throw'|'hold'|'draw'|'splash'|'cheer'|'reach'; o.k: tiến độ (throw), o.look [yaw,pitch], o.face: 'happy'|'cry'|'o'|'neutral'
export function poseBaby(b, t, o = {}) {
  const sd = o.seed || 0, tt = t + sd * 0.61; const base = o.base || 'sit'; const A = o.arms || 'idle'; const br = Math.sin(tt * 2.4) * 0.01;
  b.hip.rotation.set(0, 0, 0); b.hip.position.set(0, 0.3, 0); b.neck.rotation.set(0, 0, 0);
  const L = b.legs, R = b.arms; const ss = (x) => Math.sin(x);
  if (base === 'sit' || base === 'tub') { b.hip.position.y = 0.12 + br; b.hip.rotation.x = -0.12; L.forEach((l, i) => { l.hp.rotation.set(-1.45, 0, l.sg * -0.35); l.kn.rotation.set(0.25 + ss(tt * 3 + i) * 0.08, 0, 0); }); }
  if (base === 'stand') { const w = o.wobble ?? 1; b.hip.position.y = 0.3 + br; b.hip.rotation.z = ss(tt * 3.2) * 0.08 * w; b.hip.rotation.x = 0.06; L.forEach((l) => { l.hp.rotation.set(0, 0, l.sg * (0.18 + 0.06 * ss(tt * 3.2) * w)); l.kn.rotation.set(0.05, 0, 0); }); if (o.step) { const p = ss(tt * 5); L[0].hp.rotation.x = p * 0.35; L[1].hp.rotation.x = -p * 0.35; } }
  if (base === 'crawl') { const p = ss(tt * (o.hz || 5)); b.hip.position.y = 0.24; b.hip.rotation.x = 1.25; b.neck.rotation.x = -1.05;
    L.forEach((l, i) => { l.hp.rotation.set(-1.35 + (i ? p : -p) * 0.3, 0, l.sg * 0.15); l.kn.rotation.set(1.5, 0, 0); });
    R.forEach((a, i) => { a.sh.rotation.set(-1.25 + (i ? -p : p) * 0.35, 0, a.sg * 0.12); a.el.rotation.set(-0.1, 0, 0); }); }
  // tay
  if (base !== 'crawl') {
    const set = (a, x, y, z, ex = 0) => { a.sh.rotation.set(x, y, z); a.el.rotation.set(ex, 0, 0); };
    R.forEach((a) => set(a, -0.2 + br * 4, 0, a.sg * 0.35, -0.3));
    if (A === 'clap') { const c = Math.abs(ss(tt * 9)); R.forEach((a) => set(a, -1.2, -a.sg * (0.2 + 0.45 * c), a.sg * 0.15, -0.5)); }
    if (A === 'wave') { set(R[1], -0.4, 0, 2.6 + ss(tt * 9) * 0.35, -0.2); }
    if (A === 'cheer') { R.forEach((a) => set(a, -0.2, 0, a.sg * (2.7 + ss(tt * 8 + a.sg) * 0.25), -0.2)); }
    if (A === 'cry') { R.forEach((a) => set(a, -0.3 + ss(tt * 7 + a.sg) * 0.4, 0, a.sg * (0.9 + ss(tt * 6) * 0.3), -0.6)); }
    if (A === 'hold') { R.forEach((a) => set(a, -1.0, -a.sg * 0.75, a.sg * 0.2, -0.7)); }
    if (A === 'reach') { R.forEach((a) => set(a, -1.6 + ss(tt * 5 + a.sg) * 0.15, -a.sg * 0.15, 0, -0.1)); }
    if (A === 'throw') { const k = cl(o.k ?? 0); const sw = k < 0.4 ? -2.9 * (k / 0.4) : -2.9 + 3.6 * cl((k - 0.4) / 0.25); set(R[1], sw, 0, 0.2, -0.3); set(R[0], -0.5, 0, -0.4, -0.3); }
    if (A === 'draw') { set(R[1], -1.25 + ss(tt * 14) * 0.18, -0.25 + Math.cos(tt * 14) * 0.25, 0.1, -0.3); }
    if (A === 'splash') { R.forEach((a) => set(a, -0.9 + Math.abs(ss(tt * 10 + a.sg * 1.3)) * -1.0, 0, a.sg * 0.6, -0.3)); }
  }
  // đầu + mặt
  const lk = o.look || [ss(tt * 0.8) * 0.3, 0.05]; b.head.rotation.set(-lk[1], lk[0], ss(tt * 1.1) * 0.08); if (A === 'cry') b.head.rotation.x -= 0.35;
  const face = o.face || (A === 'cry' ? 'cry' : A === 'cheer' || A === 'clap' ? 'happy' : 'neutral');
  const open = face === 'cry' ? 0.9 + ss(tt * 12) * 0.1 : face === 'happy' ? 0.55 + ss(tt * 10) * 0.1 : face === 'o' ? 0.7 : 0.0;
  b.mouth.scale.set(0.032 + open * 0.012, 0.008 + open * 0.03, 0.012); b.mouth.position.y = -0.075 - open * 0.012; b.smile.visible = face === 'neutral' || face === 'happy';
  b.tears.forEach((tr, i) => { tr.visible = face === 'cry'; tr.position.y = -0.01 - ((tt * 0.8 + i * 0.4) % 1) * 0.1; });
  const blink = ((tt * 0.31) % 1) < 0.05 ? 1 : 0; const squint = face === 'cry' ? 1 : face === 'happy' ? 0.45 : 0;
  b.eyes.forEach((E) => { E.lid.rotation.x = -1.6 + Math.max(blink, squint) * 1.45; E.pup.position.set(lk[0] * 0.01, lk[1] * 0.01, 0.016); E.g.scale.setScalar(1 + (o.wide || 0) * 0.3); });
  b.root.updateMatrixWorld(true);
}
export const babyHand = (b, i = 1) => b.arms[i].hand.getWorldPosition(new THREE.Vector3());
export const babyLap = (b) => b.hip.localToWorld(new THREE.Vector3(0, 0.12, 0.2));
