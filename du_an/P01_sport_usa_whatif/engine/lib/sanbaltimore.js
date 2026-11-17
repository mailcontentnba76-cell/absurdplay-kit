// Tập 20 (bản 2) — SÂN NHÀ RAVENS Ở BALTIMORE (hư cấu, không tên sân, không logo): nơi diễn ra trận MNF Chargers 23–20 Ravens.
// Sân lộ thiên BAN ĐÊM nhưng đèn pha sáng rực: khán đài bát 2 tầng ghế TÍM, đám đông "blackout" mặc đen/tím (đêm Darkness Falls), vài túi fan khách xanh powder,
// tường biên bọc đệm tím + dải LED, 2 màn hình lớn sau end zone, vòng đèn pha trên mép khán đài (tắt được — gag "Darkness Falls"),
// đường chân trời thành phố sáng đèn phía sau end zone +x. End zone tím chữ "BALTIMORE". Hệ toạ độ giữ như santap.js (vạch vôi GL=30 ở +x).
import * as THREE from 'three';
import { fieldTexture, goalPost, bleachers, FL, FW } from './ngoaitroi.js';
export { makeDummy, hopPos, YD, GL, EL, FZ, BENCH, LAC, BAL } from './santap.js';
import { GL, EL, FZ, BENCH, LAC, BAL } from './santap.js';
export const OX = GL - 50 * 0.9144;          // tâm sân thật (x) để vạch vôi +x trùng GL
export const WALLZ = FZ + 5.6, WALKZ = FZ + 6.6, ENDW = EL + 3.2, ENDWALK = EL + 4.2;
export const BOARD = { x: EL + 13, z: 0, y: 11 };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
function sky() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#1c2a64'); gr.addColorStop(0.32, '#2c3f86'); gr.addColorStop(0.45, '#4a4c96'); gr.addColorStop(0.5, '#7a5a9a'); gr.addColorStop(0.53, '#3a3560'); gr.addColorStop(1, '#1a1a2a');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}
function skyline(G) {
  const win = ctex(128, 256, (g, W, H) => { g.fillStyle = '#1e2436'; g.fillRect(0, 0, W, H); for (let y = 6; y < H; y += 12) for (let x = 4; x < W; x += 10) { if (Math.random() < 0.55) { g.fillStyle = Math.random() < 0.8 ? '#ffd890' : '#bfe0ff'; g.fillRect(x, y, 5, 6); } } }, [1, 1]);
  const r = (() => { let s = 21; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  for (let i = 0; i < 34; i++) { const h = 18 + r() * 50, w = 12 + r() * 16; const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), new THREE.MeshBasicMaterial({ map: win, color: '#ffffff', fog: false }));
    m.position.set(EL + 260 + r() * 140, h / 2 - 4, -220 + i * 13 + r() * 6); G.add(m); }
}
function led(text, bg, fg) { return ctex(2048, 64, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.font = '900 42px Anton, Impact, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = fg; for (let k = 0; k < 6; k++) g.fillText(text, (k + 0.5) * W / 6, H / 2 + 2); }); }
// vòng đèn pha trên mép khán đài: giàn đèn có material phát sáng (userData.m) để bật/tắt
function lightBank(w = 14) {
  const G = new THREE.Group(); const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 3.0, 0.5), std('#3a3f4a', { metalness: 0.5 })); G.add(fr);
  const lm = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6e0', emissiveIntensity: 3.4, roughness: 0.3 });
  const n = Math.floor(w / 1.2); for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.2), lm); b.position.set(-w / 2 + 0.6 + i * 1.2, -0.6 + j * 1.2, 0.3); G.add(b); }
  G.userData.m = lm; return G;
}
function videoBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(18, 10.1), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(0, BOARD.y, 0.36); G.add(face);
  const box = new THREE.Mesh(new THREE.BoxGeometry(19, 11, 0.6), std('#1a1b22')); box.position.y = BOARD.y; G.add(box);
  for (const x of [-6, 6]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, BOARD.y - 5.5, 0.8), std('#4a4f58', { metalness: 0.5 })); p.position.set(x, (BOARD.y - 5.5) / 2, -0.3); G.add(p); }
  let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 576); gr.addColorStop(0, '#2a1650'); gr.addColorStop(1, '#120a24'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = BAL.gold; g.lineWidth = 8; g.strokeRect(10, 10, 1004, 556); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = '900 120px Anton, Impact, sans-serif'; g.fillStyle = o.msgColor || '#ffffff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 512, 288 + (i - (a.length - 1) / 2) * 130)); t.needsUpdate = true; return; }
    g.font = '900 62px Anton, Impact, sans-serif'; g.fillStyle = LAC.powder; g.fillText(o.l ?? 'LAC', 270, 92); g.fillStyle = '#c9b2ff'; g.fillText(o.r ?? 'BAL', 754, 92);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = '#ffffff'; g.fillText(String(o.a ?? 0), 270, 290); g.fillText(String(o.b ?? 0), 754, 290);
    g.font = '900 80px Anton, Impact, sans-serif'; g.fillStyle = o.tint || BAL.gold; g.fillText(o.clock ?? '', 512, 470); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: '1ST 15:00' }); G.traverse((x) => { if (x.isMesh && x !== face) x.castShadow = false; }); return { G, draw };
}
export function buildBaltimore(scene) {
  scene.background = new THREE.Color('#1c2a5a'); scene.fog = new THREE.Fog('#2a2f5a', 160, 520);
  const G = new THREE.Group(); scene.add(G); G.add(sky()); skyline(G);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#3f8a3c'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 2000; i++) { g.fillStyle = i % 2 ? 'rgba(20,60,20,0.1)' : 'rgba(180,230,140,0.07)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [60, 60]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 160), std('#ffffff', { map: turf, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.06, 0); ground.receiveShadow = true; G.add(ground);
  const ft = fieldTexture({ endLeft: '#3d2378', endLeftText: 'BALTIMORE', endLeftStroke: '#111111', endRight: '#3d2378', endRightText: 'BALTIMORE', endRightFg: '#ffffff', g1: '#3f8a3a', g2: '#4b9a44' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  const gpL = goalPost(-1), gpR = goalPost(1); gpL.position.x = OX - FL / 2; gpR.position.x = OX + FL / 2; G.add(gpL, gpR);
  // tường biên đệm tím + dải LED
  const wallM = std(BAL.purple, { roughness: 0.7 }); const L = FL + 30;
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(L, 1.2, 0.4), wallM); w.position.set(OX, 0.6, s * WALLZ); w.receiveShadow = true; G.add(w);
    const l = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.55), new THREE.MeshBasicMaterial({ map: led('DARKNESS FALLS  •  BALTIMORE', '#160c2c', BAL.gold), toneMapped: false })); l.position.set(OX, 0.62, s * (WALLZ - 0.21)); l.rotation.y = s > 0 ? Math.PI : 0; G.add(l); }
  for (const s of [-1, 1]) { const x = s > 0 ? ENDW : OX - FL / 2 - 3.2; const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 2 * WALLZ), wallM); w.position.set(x, 0.6, 0); G.add(w); }
  // khán đài bát 2 tầng — đám đông blackout + túi fan khách xanh powder
  const U = { uT: { value: 0 }, uCheer: { value: 0.2 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const home = { shirts: ['#18171e', '#18171e', '#22202a', BAL.purple, '#18171e', '#2a2433', '#18171e', BAL.purple, '#111114', '#18171e', LAC.powder], skins: ['#f1c9a5', '#c68c5f', '#9a6040', '#8a5634', '#e8b98f'], pants: ['#1a1a20', '#2b3a55', '#3b3b3b'], hats: ['#18171e', BAL.purple, '#111114', BAL.gold] };
  const seat = { seatColor: '#5a2fa8', frameColor: '#3a3f4a' };
  for (const s of [-1, 1]) {
    bleachers(G, s, { U, fill: 0.8, seed: 31 + s * 7, rows: 14, len: FL + 16, x0: OX, z0: s * (WALKZ + 1.4), ...seat, ...home, banner: 'BALTIMORE  •  BALTIMORE', bannerBg: '#1a1030', bannerFg: BAL.gold, flipBanner: false });
    bleachers(G, s, { U, fill: 0.6, seed: 71 + s * 5, rows: 11, len: FL + 10, x0: OX, y0: 9.5, z0: s * (WALKZ + 1.4 + 14 * 0.78 + 3.2), ...seat, ...home });
    const fac = new THREE.Mesh(new THREE.BoxGeometry(FL + 16, 2.2, 0.6), std('#2a2e3a')); fac.position.set(OX, 9.3, s * (WALKZ + 1.4 + 14 * 0.78 + 2.6)); G.add(fac);
    const suite = new THREE.Mesh(new THREE.PlaneGeometry(FL + 14, 1.2), new THREE.MeshBasicMaterial({ map: led('', '#ffd98a', '#ffd98a'), toneMapped: false })); suite.position.set(OX, 9.0, s * (WALKZ + 1.4 + 14 * 0.78 + 2.25)); suite.rotation.y = s > 0 ? Math.PI : 0; G.add(suite); }
  bleachers(G, 1, { U, fill: 0.75, seed: 91, rows: 14, len: 2 * WALKZ + 8, rotY: -Math.PI / 2, x0: ENDWALK + 1.6, z0: 0, ...seat, ...home });
  bleachers(G, 1, { U, fill: 0.6, seed: 93, rows: 12, len: 2 * WALKZ + 8, rotY: Math.PI / 2, x0: OX - FL / 2 - 5.6, z0: 0, ...seat, ...home });
  // vòng đèn pha
  const poles = []; for (const s of [-1, 1]) for (let i = -3; i <= 3; i++) { const b = lightBank(14); b.position.set(OX + i * 17, 36, s * (WALKZ + 34)); b.rotation.y = s > 0 ? Math.PI : 0; b.rotation.x = s > 0 ? -0.5 : 0.5; b.rotation.order = 'YXZ'; b.rotation.set(s > 0 ? -0.45 : 0.45, s > 0 ? Math.PI : 0, 0); G.add(b); poles.push(b); }
  // màn hình lớn sau end zone +x
  const BO = videoBoard(); BO.G.position.set(BOARD.x + 14, 6, BOARD.z); BO.G.rotation.y = -Math.PI / 2; G.add(BO.G);
  // ghế đội (nhôm) biên −z
  const al = std('#c8ccd2', { metalness: 0.7, roughness: 0.35 }); const bench = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.45), al); bench.position.set(BENCH.x, 0.46, BENCH.z); bench.castShadow = true; G.add(bench);
  for (let x = -5.5; x <= 5.5; x += 2.75) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.4), al); l.position.set(BENCH.x + x, 0.23, BENCH.z); G.add(l); }
  return { G, poles, board: BO, crowd: U };
}
export function stadiumLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#e2e8ff', '#4a5a48', 2.8); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff4e4', 4.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#c4ccff', 1.8); fill.position.set(30, 30, 30); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 26, 30, z - 14); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7).multiplyScalar(26); key.position.set(x + d.x, 30, z + d.z); };
  // k=0 "Darkness Falls": giàn đèn tắt bớt, sân tối đi nhưng vẫn đọc rõ (hemi ≥1,7)
  const lamps = (k) => { P.poles.forEach((p) => { p.userData.m.emissiveIntensity = 0.2 + 3.2 * k; p.userData.m.color.setScalar(0.3 + 0.7 * k); }); hemi.intensity = 1.8 + 1.0 * k; key.intensity = 2.4 + 1.8 * k; fill.intensity = 1.1 + 0.7 * k; };
  area(0, 0); lamps(1); return { hemi, key, fill, area, lamps };
}
