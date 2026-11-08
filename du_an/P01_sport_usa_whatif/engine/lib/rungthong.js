// Tập 10 (NCAA) — "What if Michigan played eleven goalposts?"
// Bối cảnh: sân bóng giữa rừng thông phủ tuyết buổi sáng (khác E05 hồ + thành phố, khác E03 sân đêm):
// trời xanh lạnh → vàng nhạt chân trời, 3 lớp đồi thông xa, rừng thông gần (instanced) có tuyết trên tán,
// sân cỏ lấm tấm tuyết, end zone vàng ngô MICHIGAN / xanh rừng NORTH WOODS, khán đài gỗ + khán giả áo phao,
// chòi bình luận gỗ trên cột, bảng điểm gỗ (canvas, có thể vẽ mặt), nhà gỗ có khói ống khói, hàng rào gỗ, đống tuyết.
// Nhân vật: cột gôn có mặt (makeGoalpost), rìu (makeAxe), mũ len (addBeanie).
import * as THREE from 'three';
import { fieldTexture, bleachers, FL, FW } from './ngoaitroi.js';
export { FL, FW };

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const UM = { maize: '#ffcb05', navy: '#0a3363' };
export const MSU = { green: '#1f5a47', white: '#ffffff' };
const snowMat = () => std('#f4f7fb', { roughness: 0.93, emissive: '#1d2633', emissiveIntensity: 0.1 });
export function lump(rx, ry, rz, seed = 1, seg = 18) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7)); const p = g.attributes.position; const r = rnd(seed * 97 + 3); const ph = [r() * 6, r() * 6, r() * 6];
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + 0.08 * Math.sin(x * 3.1 + ph[0]) * Math.sin(z * 2.7 + ph[1]) + 0.05 * Math.sin(y * 4 + ph[2]);
    p.setXYZ(i, x * rx * n, Math.max(-0.05, y) * ry * n, z * rz * n); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, snowMat()); m.castShadow = m.receiveShadow = true; return m;
}
// ---------- vân gỗ ----------
const woodTex = (base = '#8a5a34', seed = 3, rep = [1, 1]) => ctex(256, 256, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); const r = rnd(seed);
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(${r() < 0.5 ? '40,22,10' : '255,220,170'},${0.06 + r() * 0.1})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const y = r() * H; g.moveTo(0, y); for (let x = 0; x <= W; x += 32) g.lineTo(x, y + Math.sin(x * 0.03 + i) * 4); g.stroke(); }
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(50,28,14,0.35)'; g.beginPath(); g.ellipse(r() * W, r() * H, 4 + r() * 6, 2 + r() * 3, 0, 0, 7); g.fill(); } }, rep);
const logTex = (rep) => ctex(256, 256, (g, W, H) => { const n = 8; for (let i = 0; i < n; i++) { const y = i * H / n; const gr = g.createLinearGradient(0, y, 0, y + H / n); gr.addColorStop(0, '#5a3820'); gr.addColorStop(0.2, '#9a6a40'); gr.addColorStop(0.55, '#a8784b'); gr.addColorStop(0.9, '#6a4428'); gr.addColorStop(1, '#3a2414'); g.fillStyle = gr; g.fillRect(0, y, W, H / n); }
  const r = rnd(9); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(40,22,10,${r() * 0.15})`; g.fillRect(r() * W, r() * H, 6 + r() * 20, 1); } }, rep);

// ---------- trời buổi sáng lạnh ----------
function skyDome() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3f6fb0'); gr.addColorStop(0.3, '#6f9bd0'); gr.addColorStop(0.46, '#b9d0e6'); gr.addColorStop(0.5, '#f3e2bd'); gr.addColorStop(0.53, '#f6e7c8'); gr.addColorStop(1, '#e9eef4'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(950, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); return m;
}
// mây mỏng (sprite lớn mờ)
function clouds(G) { const t = ctex(256, 128, (g, W, H) => { for (let i = 0; i < 14; i++) { const x = 30 + Math.random() * 196, y = 40 + Math.random() * 50, r = 18 + Math.random() * 30; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); } });
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false }); const r = rnd(12);
  for (let i = 0; i < 18; i++) { const s = new THREE.Sprite(m); const a = r() * Math.PI * 2, d = 500 + r() * 300; s.position.set(Math.cos(a) * d, 120 + r() * 160, Math.sin(a) * d); s.scale.set(260 + r() * 200, 90 + r() * 60, 1); G.add(s); } }
// đồi xa phủ thông: dải núi silhouette (canvas trên trụ lớn), 3 lớp nhạt dần
function ridge(radius, h, color, snowTop, seed) {
  const t = ctex(4096, 512, (g, W, H) => { g.clearRect(0, 0, W, H); const r = rnd(seed); const pts = []; let y = H * 0.45;
    for (let x = 0; x <= W; x += 8) { y += (r() - 0.5) * 10; y = Math.min(H * 0.75, Math.max(H * 0.12, y + Math.sin(x * 0.004 + seed) * 2)); pts.push([x, y]); }
    g.fillStyle = color; g.beginPath(); g.moveTo(0, H); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W, H); g.fill();
    // răng cưa ngọn thông trên sống núi
    for (const [x, y] of pts) { if (r() < 0.8) { const th = 6 + r() * 18; g.beginPath(); g.moveTo(x - 4, y + 2); g.lineTo(x, y - th); g.lineTo(x + 4, y + 2); g.fill(); } }
    if (snowTop) { g.fillStyle = 'rgba(240,245,250,0.55)'; for (let i = 0; i < 2600; i++) { const p = pts[Math.floor(r() * pts.length)]; g.fillRect(p[0] + (r() - 0.5) * 8, p[1] + r() * (H - p[1]) * 0.7, 2, 1.5); } } });
  t.wrapS = THREE.RepeatWrapping;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, h, 96, 1, true), new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.BackSide, depthWrite: false, fog: false }));
  m.position.y = h / 2 - 6; return m;
}
// ---------- thông (instanced): thân + 4 tầng nón + 4 nón tuyết ----------
function pineForest(G, spots, seedBase = 1) {
  const N = spots.length; const r = rnd(seedBase * 31 + 5);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.32, 3, 6).translate(0, 1.5, 0), std('#4a3324', { roughness: 0.95 }), N);
  const tiers = [], caps = []; const greens = ['#1f4a33', '#24533a', '#1a4130'];
  for (let k = 0; k < 4; k++) { const rr = 2.4 - k * 0.5, hh = 2.9 - k * 0.35, y = 2.2 + k * 1.75;
    const cg = new THREE.ConeGeometry(rr, hh, 9).translate(0, y + hh / 2, 0); const p = cg.attributes.position; const rr2 = rnd(k * 7 + 3); for (let i = 0; i < p.count; i++) { if (p.getY(i) < y + 0.2) { p.setX(i, p.getX(i) * (1 + (rr2() - 0.5) * 0.25)); p.setZ(i, p.getZ(i) * (1 + (rr2() - 0.5) * 0.25)); p.setY(i, p.getY(i) - rr2() * 0.35); } } cg.computeVertexNormals();
    tiers.push(new THREE.InstancedMesh(cg, std(greens[k % 3], { roughness: 0.9, flatShading: true }), N));
    const sg = new THREE.ConeGeometry(rr * 0.82, hh * 0.55, 9).translate(0, y + hh * 0.72, 0); caps.push(new THREE.InstancedMesh(sg, std('#f2f6fa', { roughness: 0.95, flatShading: true, emissive: '#1d2633', emissiveIntensity: 0.1 }), N)); }
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  spots.forEach(([x, z, sc], i) => { const k = sc ?? (0.8 + r() * 0.9); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28); s.set(k * (0.9 + r() * 0.2), k, k * (0.9 + r() * 0.2)); p.set(x, 0, z); m.compose(p, q, s);
    trunk.setMatrixAt(i, m); tiers.forEach((t) => { t.setMatrixAt(i, m); c.setHSL(0.4 + (r() - 0.5) * 0.03, 0.45, 0.17 + r() * 0.06); t.setColorAt(i, c); }); caps.forEach((t) => t.setMatrixAt(i, m)); });
  for (const im of [trunk, ...tiers, ...caps]) { im.castShadow = true; im.receiveShadow = true; G.add(im); }
}
// ---------- nhà gỗ (log cabin) + khói ----------
function cabin(w = 7, d = 5.5, h = 3, seed = 1) {
  const G = new THREE.Group(); const lt = logTex([w / 2.5, h / 2.5]); const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std('#fff', { map: lt, roughness: 0.9 })); walls.position.y = h / 2; walls.castShadow = walls.receiveShadow = true; G.add(walls);
  const roofH = 2.2; const rs = new THREE.Shape(); rs.moveTo(-d / 2 - 0.5, 0); rs.lineTo(0, roofH); rs.lineTo(d / 2 + 0.5, 0); rs.lineTo(-d / 2 - 0.5, 0);
  const rg = new THREE.ExtrudeGeometry(rs, { depth: w + 0.8, bevelEnabled: false }); rg.translate(0, 0, -(w + 0.8) / 2); rg.rotateY(Math.PI / 2);
  const roof = new THREE.Mesh(rg, std('#f3f6fa', { roughness: 0.95 })); roof.position.y = h; roof.castShadow = true; G.add(roof);
  const eave = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.18, d + 1.1), std('#4a2e1a')); eave.position.y = h + 0.02; G.add(eave);
  const ch = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.6, 0.7), std('#7a6e66', { roughness: 0.95 })); ch.position.set(w * 0.3, h + 1.5, d * 0.15); G.add(ch);
  const win = ctex(64, 64, (g) => { g.fillStyle = '#ffcf7a'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#3a2414'; g.fillRect(29, 0, 6, 64); g.fillRect(0, 29, 64, 6); });
  for (const x of [-w * 0.28, w * 0.28]) { const wm = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.0), new THREE.MeshStandardMaterial({ map: win, emissive: '#ffb04a', emissiveIntensity: 0.6 })); wm.position.set(x, h * 0.55, d / 2 + 0.01); G.add(wm); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.0), std('#4a2e1a')); door.position.set(0, 1.0, d / 2 + 0.01); G.add(door);
  // đống củi
  const lg = std('#6b4428'); for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.4, 8), lg); l.rotation.z = Math.PI / 2; l.position.set(-w / 2 - 0.9, 0.17 + Math.floor(i / 4) * 0.3, -1 + (i % 4) * 0.34); G.add(l); }
  G.userData.chimney = new THREE.Vector3(w * 0.3, h + 2.8, d * 0.15); return G;
}
function smoke(G, at, N = 26, seed = 1) {
  const t = ctex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(225,228,232,0.75)'); gr.addColorStop(1, 'rgba(225,228,232,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  const ps = []; const r = rnd(seed); for (let i = 0; i < N; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.userData.ph = r(); G.add(s); ps.push(s); }
  return (time) => ps.forEach((s, i) => { const k = (time * 0.12 + s.userData.ph) % 1; s.position.set(at.x + k * 4 + Math.sin(k * 6 + i) * 0.4, at.y + k * 9, at.z + Math.cos(k * 5 + i) * 0.4); const sc = 0.8 + k * 4; s.scale.set(sc, sc, 1); s.material.opacity = 0.65 * (1 - k); });
}
// ---------- bảng điểm gỗ: canvas 1024×512, set({home,away,q,clock,face}) ----------
function woodScoreboard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const wood = woodTex('#7a4a28', 5, [3, 1]);
  const body = new THREE.Mesh(new THREE.BoxGeometry(8.6, 4.6, 0.5), std('#fff', { map: wood })); body.position.y = 5.2; G.add(body);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); face.position.set(0, 5.2, 0.26); G.add(face);
  for (const x of [-3.2, 3.2]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 5.4, 10), std('#fff', { map: logTex([1, 3]) })); p.position.set(x, 2.7, -0.1); G.add(p); }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 1.4), std('#4a2e1a')); roof.position.set(0, 7.65, 0.2); G.add(roof);
  const cap = lump(4.6, 0.25, 0.75, 4, 18); cap.position.set(0, 7.8, 0.2); G.add(cap);
  G.traverse((o) => { if (o.isMesh && o !== face) o.castShadow = true; });
  let last = '';
  const set = (s) => { const key = JSON.stringify(s); if (key === last) return; last = key; const g = cv.getContext('2d'); const W = 1024, H = 512;
    g.fillStyle = '#16120e'; g.fillRect(0, 0, W, H); g.strokeStyle = '#c9a36a'; g.lineWidth = 10; g.strokeRect(14, 14, W - 28, H - 28);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 54px Anton, Impact, sans-serif'; g.fillStyle = '#f2e6cf'; g.fillText('GOALPOSTS', 250, 80); g.fillText('MICHIGAN', 774, 80);
    const digit = (txt, x, y, col) => { g.font = '900 210px Anton, Impact, sans-serif'; g.fillStyle = 'rgba(255,170,40,0.12)'; g.fillText('88', x, y); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 24; g.fillText(txt, x, y); g.shadowBlur = 0; };
    if (s.face) { // mặt bảng điểm: mắt tròn + miệng nhún vai
      digit(String(s.home), 250, 250, '#ffb12a'); digit(String(s.away), 774, 250, '#ffb12a');
      g.fillStyle = '#ffb12a'; for (const x of [430, 594]) { g.beginPath(); g.arc(x, 230 + (s.look || 0) * 6, 34, 0, 7); g.fill(); g.fillStyle = '#16120e'; g.beginPath(); g.arc(x + (s.look || 0) * 12, 236, 15, 0, 7); g.fill(); g.fillStyle = '#ffb12a'; }
      g.strokeStyle = '#ffb12a'; g.lineWidth = 12; g.beginPath(); g.moveTo(450, 330); g.quadraticCurveTo(512, 330 - (s.smile || 0) * 40, 574, 316); g.stroke();
      g.lineWidth = 9; for (const [x, k] of [[430, 1], [594, -1]]) { g.beginPath(); g.moveTo(x - 30, 180 - k * (s.brow || 0) * 10); g.lineTo(x + 30, 180 + k * (s.brow || 0) * 10); g.stroke(); } }
    else { digit(String(s.home), 250, 250, '#ffb12a'); digit(String(s.away), 774, 250, '#ffb12a'); }
    g.font = '900 46px Anton, Impact, sans-serif'; g.fillStyle = '#f2e6cf'; g.fillText(`QTR ${s.q ?? 1}`, 300, 430); g.fillStyle = '#ff6a3a'; g.fillText(s.clock || '15:00', 724, 430);
    g.fillStyle = '#c9a36a'; g.fillText('TD: 0', 512, 430); tex.needsUpdate = true; };
  set({ home: 0, away: 0 }); return { G, set };
}
// ---------- chòi bình luận gỗ trên cột (mở phía trước) ----------
function booth() {
  const G = new THREE.Group(); const wt = woodTex('#8a5a34', 7, [2, 1]); const wm = std('#fff', { map: wt });
  for (const [x, z] of [[-2.6, -1.6], [2.6, -1.6], [-2.6, 1.6], [2.6, 1.6]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 5, 8), std('#fff', { map: logTex([1, 2]) })); p.position.set(x, 2.5, z); G.add(p); }
  const floor = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 4), wm); floor.position.y = 5.15; G.add(floor);
  const back = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.2), std('#fff', { map: logTex([2.4, 1.2]) })); back.position.set(0, 6.8, -1.9); G.add(back);
  for (const x of [-2.9, 2.9]) { const sd = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 4), std('#fff', { map: logTex([1.6, 1.2]) })); sd.position.set(x, 6.8, 0); G.add(sd); }
  const front = new THREE.Mesh(new THREE.BoxGeometry(6, 1.0, 0.2), wm); front.position.set(0, 5.8, 1.9); G.add(front);
  const roofG = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 5), std('#4a2e1a')); roofG.position.y = 8.4; G.add(roofG); const cap = lump(3.4, 0.3, 2.4, 6, 16); cap.position.y = 8.55; G.add(cap);
  // bàn + 2 mic + màn hình nhỏ + đèn lồng
  const desk = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 1.0), std('#5a3820')); desk.position.set(0, 6.25, 1.1); G.add(desk);
  for (const x of [-1, 1]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6), std('#222')); st.position.set(x, 6.45, 1.25); G.add(st); const mic = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), std('#2b2b2b')); mic.position.set(x, 6.65, 1.25); G.add(mic); }
  const scr = ctex(256, 160, (g) => { g.fillStyle = '#0d1a28'; g.fillRect(0, 0, 256, 160); g.fillStyle = '#ffcb05'; g.font = 'bold 30px Arial'; g.fillText('GOALPOSTS 15', 20, 60); g.fillStyle = '#9fc4ff'; g.fillText('MICHIGAN 0', 20, 110); });
  const mon = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.44), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false })); mon.position.set(0, 6.55, 1.0); mon.rotation.x = -0.25; mon.rotation.y = Math.PI; G.add(mon);
  const sign = ctex(512, 96, (g) => { g.fillStyle = '#3a2414'; g.fillRect(0, 0, 512, 96); g.fillStyle = '#f2e6cf'; g.font = '900 54px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('NORTH WOODS BOOTH', 256, 66); });
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.68), std('#fff', { map: sign })); sg.position.set(0, 5.75, 2.01); G.add(sg);
  const lamp = new THREE.PointLight('#ffc98a', 6, 6, 1.5); lamp.position.set(0, 7.9, 0.3); G.add(lamp);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  G.userData.seatY = 5.3; return G; // ghế ngồi ở y=5.3 (mặt sàn), mặt quay +z
}

export function buildForestField(scene) {
  scene.background = new THREE.Color('#bcd2e8'); scene.fog = new THREE.Fog('#d9e3ee', 120, 820);
  const G = new THREE.Group(); scene.add(G); G.add(skyDome()); clouds(G);
  G.add(ridge(700, 120, '#8fa6bf', true, 3), ridge(560, 95, '#5f7a8f', true, 5), ridge(430, 70, '#3c5a5a', true, 8));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), std('#eef3f8', { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; ground.receiveShadow = true; G.add(ground);
  // sân: cỏ xanh lạnh + tuyết lấm tấm, end zone vàng ngô MICHIGAN / xanh rừng NORTH WOODS
  const ft = fieldTexture({ g1: '#3d7a3f', g2: '#468a46', endLeft: UM.maize, endLeftText: 'MICHIGAN', endLeftStroke: UM.navy, endRight: '#1f4d36', endRightText: 'NORTH WOODS', endRightFg: '#eef3f8' });
  { const cv = ft.userData.cv; const g = cv.getContext('2d'); const r = rnd(21); const W = cv.width, H = cv.height;
    for (let i = 0; i < 520; i++) { const edge = r() < 0.6; const x = r() * W; const y = edge ? (r() < 0.5 ? r() * H * 0.12 : H - r() * H * 0.12) : r() * H; const rr = 10 + r() * (edge ? 70 : 26);
      const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(244,248,252,${edge ? 0.8 : 0.28})`); gr.addColorStop(1, 'rgba(244,248,252,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    // vết giày trên tuyết mỏng
    for (let i = 0; i < 1400; i++) { g.fillStyle = 'rgba(40,70,40,0.25)'; g.fillRect(r() * W, H * (0.2 + r() * 0.6), 5, 3); } ft.needsUpdate = true; }
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.92 })); field.rotation.x = -Math.PI / 2; field.position.y = 0.005; field.receiveShadow = true; G.add(field);
  // đống tuyết viền sân
  const r = rnd(41); for (let i = 0; i < 70; i++) { const side = i % 4; let x, z; const L2 = FL / 2 + 3, W2 = FW / 2 + 2.6; const u = r();
    if (side < 2) { x = -L2 + u * 2 * L2; z = side ? W2 + r() * 1.5 : -W2 - r() * 1.5; } else { z = -W2 + u * 2 * W2; x = side === 2 ? L2 + r() * 2 : -L2 - r() * 2; }
    const m = lump(1.4 + r() * 1.8, 0.45 + r() * 0.6, 0.9 + r() * 1.0, i + 1); m.position.set(x, 0, z); m.rotation.y = r() * 3; G.add(m); }
  // hàng rào gỗ hai biên
  const rail = std('#fff', { map: woodTex('#7a4a28', 11, [20, 1]) });
  for (const zs of [-1, 1]) { const z = zs * (FW / 2 + 4.6); for (const y of [0.45, 0.95]) { const b = new THREE.Mesh(new THREE.BoxGeometry(FL + 10, 0.12, 0.08), rail); b.position.set(0, y, z); b.castShadow = true; G.add(b); }
    for (let x = -FL / 2 - 5; x <= FL / 2 + 5; x += 3) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2, 0.14), rail); p.position.set(x, 0.6, z); G.add(p); const sc = lump(0.12, 0.06, 0.12, x * 3 + zs, 8); sc.position.set(x, 1.2, z); G.add(sc); } }
  // khán đài gỗ 2 bên + khán giả áo phao
  const U = { uT: { value: 0 }, uCheer: { value: 0.25 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const shirts = [UM.maize, UM.navy, '#ffcb05', '#1c3d6e', '#b22a22', '#2f5d3a', '#e7e3da', '#ff8a1e', UM.navy, '#6a7f99'];
  bleachers(G, -1, { U, fill: 0.85, seed: 51, rows: 10, len: 70, z0: -(FW / 2 + 7), seatColor: '#9b6b3f', frameColor: '#5a3b22', banner: 'NORTH WOODS  •  HAIL TO THE TIMBER', bannerBg: '#3a2414', bannerFg: '#f2e6cf',
    shirts, skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'], pants: ['#2b3a55', '#3b3b3b', '#56627a'], hats: [UM.maize, UM.navy, '#b22a22', '#ff8a1e', '#ffffff'] });
  bleachers(G, 1, { U, fill: 0.7, seed: 77, rows: 8, len: 60, z0: FW / 2 + 7, seatColor: '#9b6b3f', frameColor: '#5a3b22', banner: 'VISITORS: GOALPOSTS', bannerBg: '#1f4d36', bannerFg: '#ffd21c',
    shirts: ['#1f4d36', '#ffd21c', '#2f5d3a', '#e7e3da', '#ff8a1e', '#6a7f99'], skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#e8b98f'], pants: ['#2b3a55', '#3b3b3b'], hats: ['#ffd21c', '#1f4d36', '#ffffff'] });
  // rừng thông: vành gần (to, rõ) + vành xa
  const spots = []; const rr = rnd(77);
  for (let i = 0; i < 900; i++) { const a = rr() * Math.PI * 2; const d = 75 + Math.pow(rr(), 0.7) * 260; const x = Math.cos(a) * d * 1.15, z = Math.sin(a) * d; if (Math.abs(x) < FL / 2 + 14 && Math.abs(z) < FW / 2 + 22) continue; spots.push([x, z, 0.9 + rr() * 1.3]); }
  for (let i = 0; i < 60; i++) { let z = (rr() - 0.5) * 70; const x = -FL / 2 - 18 - rr() * 25; if (Math.abs(z) < 14) z += 28 * Math.sign(z || 1); spots.push([x, z, 1.1 + rr() * 0.8]); spots.push([FL / 2 + 16 + rr() * 25, (rr() - 0.5) * 70, 1.1 + rr() * 0.8]); }
  pineForest(G, spots, 2);
  // nhà gỗ + khói
  const smokes = [];
  for (const [x, z, ry, s] of [[-FL / 2 - 16, -26, 0.6, 1], [FL / 2 + 18, 22, -2.4, 2], [-20, -FW / 2 - 26, 0.1, 3], [34, -FW / 2 - 24, -0.3, 4]]) { const c = cabin(7, 5.5, 3, s); c.position.set(x, 0, z); c.rotation.y = ry; G.add(c); c.updateMatrixWorld(true);
    smokes.push(smoke(G, c.userData.chimney.clone().applyMatrix4(c.matrixWorld), 22, s)); }
  // bảng điểm gỗ sau end zone trái, quay vào sân
  const SB = woodScoreboard(); SB.G.position.set(-FL / 2 - 9, 0, 0); SB.G.rotation.y = Math.PI / 2; G.add(SB.G);
  // chòi bình luận sau khán đài nhà
  const BO = booth(); BO.position.set(-34, 0, -(FW / 2 + 2.5)); G.add(BO);
  return { G, crowd: U, board: SB, booth: BO, field,
    update(t, o = {}) { U.uT.value = t; U.uCheer.value = o.cheer ?? 0.25; U.uBoo.value = o.boo ?? 0; smokes.forEach((f) => f(t)); } };
}

export function forestLights(scene) {
  const hemi = new THREE.HemisphereLight('#dfeaf8', '#f4f2ee', 2.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe7c4', 3.0); key.position.set(-40, 26, 30); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 140 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#cfe0ff', 1.1); fill.position.set(30, 18, -20); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 10, z = cam.position.z + d.z * 10; key.target.position.set(x, 0, z); key.position.set(x - 40, 26, z + 30); };
  return { hemi, key, fill, follow };
}

// ---------- cột gôn có mặt (nhân vật) ----------
// Cao ~4,6 m: chân đệm (số), cổ ngỗng 1,6 m, xà ngang 2,8 m, 2 trụ 3 m, cờ cam. Mặt: 2 mắt trên xà + lông mày, miệng ở cổ.
// update(t, {look:[x,y], blink, squint, brow, browUp, open, lean, sway, doink, fall, fallDir})
export function makeGoalpost(o = {}) {
  const P = Object.assign({ number: 1, seed: 1, color: '#ffd21c', pad: '#1f4d36' }, o);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const m = std(P.color, { roughness: 0.35, metalness: 0.2 }); const R = 0.075, BW = 2.8, BY = 1.75, UH = 2.9;
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 1.2, 18), std(P.pad, { roughness: 0.7 })); pad.position.y = 0.6; body.add(pad);
  const numT = ctex(256, 128, (g) => { g.clearRect(0, 0, 256, 128); g.fillStyle = '#ffffff'; g.font = '900 104px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(P.number), 128, 68); });
  for (const a of [0, Math.PI]) { const n = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.21), new THREE.MeshBasicMaterial({ map: numT, transparent: true })); n.position.set(Math.sin(a) * 0.265, 0.72, Math.cos(a) * 0.265); n.rotation.y = a; body.add(n); }
  const neck = new THREE.Group(); neck.position.y = 1.2; body.add(neck);
  const nk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, -0.0), new THREE.Vector3(0, 0.3, -0.05), new THREE.Vector3(0, 0.5, 0.05), new THREE.Vector3(0, BY - 1.2, 0)]), 16, R * 1.2, 10), m); neck.add(nk);
  const top = new THREE.Group(); top.position.y = BY - 1.2; neck.add(top);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(R, R, BW, 12), m); bar.rotation.z = Math.PI / 2; top.add(bar);
  const ups = [-1, 1].map((s) => { const piv = new THREE.Group(); piv.position.x = s * BW / 2; top.add(piv); const u = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.85, R * 0.85, UH, 10), m); u.position.y = UH / 2; piv.add(u);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.55), std('#ff6a1a', { side: THREE.DoubleSide })); fl.position.set(0, UH - 0.3, 0.06); piv.add(fl); const cap = lump(0.1, 0.06, 0.1, P.seed * 5 + s + 7, 8); cap.position.y = UH; piv.add(cap); return { piv, fl }; });
  // mắt (trên xà, nhìn +z)
  const dark = std('#1b1d21'); const eyes = [-1, 1].map((k) => { const e = new THREE.Group(); e.position.set(k * 0.36, 0.2, 0.08); top.add(e);
    const wht = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 14), std('#ffffff', { roughness: 0.3 })); wht.scale.z = 0.55; e.add(wht);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), std('#111')); pup.position.z = 0.08; e.add(pup);
    const lidm = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); lidm.scale.z = 0.6; e.add(lidm);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.03), dark); brow.position.set(0, 0.23, 0.06); e.add(brow); return { pup, lidm, brow }; });
  // miệng: hình elip tối trên cổ, mở theo open
  const mouthG = new THREE.Group(); mouthG.position.set(0, -0.2, R * 1.15); top.add(mouthG);
  const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), std('#3a0d0d')); mouthG.add(mouth); const lip = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.15, 20), std('#d9a700')); mouthG.add(lip);
  root.traverse((x) => { if (x.isMesh) x.castShadow = true; });
  const update = (t, s = {}) => { const sd = P.seed;
    const sway = (s.sway ?? 1) * 0.03 * Math.sin(t * 1.3 + sd); body.rotation.z = (s.lean || 0) + sway; body.rotation.x = 0.02 * Math.sin(t * 1.1 + sd * 2) * (s.sway ?? 1);
    // ngã (bị chặt): xoay quanh chân theo fallDir
    if (s.fall) { const k = s.fall; const a = Math.min(1, k) * (Math.PI / 2 - 0.08) + (k > 1 ? Math.sin((k - 1) * 18) * 0.03 * Math.exp(-(k - 1) * 4) : 0); body.rotation.z = (s.fallDir ?? 1) * a; }
    // doink: trụ rung tắt dần
    const dk = s.doink != null ? Math.sin(s.doink * 40) * Math.exp(-s.doink * 4) * 0.12 : 0; ups.forEach(({ piv, fl }, i) => { piv.rotation.z = dk * (i ? 1 : -1); fl.rotation.y = Math.sin(t * 3 + sd + i) * 0.4; });
    top.rotation.z = dk * 0.3;
    const lk = s.look || [Math.sin(t * 0.8 + sd) * 0.4, 0]; const bl = s.blink ?? ((t * 0.6 + sd * 0.41) % 3.3 < 0.12 ? 1 : 0);
    eyes.forEach(({ pup, lidm, brow }, i) => { pup.position.x = lk[0] * 0.06; pup.position.y = lk[1] * 0.05; lidm.rotation.x = -Math.PI * (0.05 + 0.45 * Math.max(bl, s.squint || 0)); brow.rotation.z = (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.23 + (s.browUp || 0) * 0.04; });
    const op = s.open ?? (0.15 + 0.1 * Math.max(0, Math.sin(t * 2.3 + sd))); mouth.scale.set(1, 0.25 + op * 1.2, 1); lip.scale.copy(mouth.scale);
  };
  update(0);
  return { root, body, top, update, barY: 1.2 + BY - 1.2 + 1.2 * 0, crossbar: () => top.getWorldPosition(new THREE.Vector3()), width: BW };
}

// ---------- rìu ----------
export function makeAxe(scale = 1) {
  const G = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.0, 10), std('#8a5a34', { map: woodTex('#9a6a40', 2) })); h.position.y = 0.5; G.add(h);
  const s = new THREE.Shape(); s.moveTo(0, -0.12); s.lineTo(0.22, -0.2); s.quadraticCurveTo(0.3, 0, 0.22, 0.2); s.lineTo(0, 0.12); s.lineTo(0, -0.12);
  const hg = new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 }); hg.translate(0.03, 0, -0.02);
  const head = new THREE.Mesh(hg, std('#b9c0c8', { metalness: 0.85, roughness: 0.25 })); head.position.y = 0.93; G.add(head);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.06), std('#2e3238', { metalness: 0.6, roughness: 0.4 })); back.position.set(-0.02, 0.93, 0); G.add(back);
  G.scale.setScalar(scale); G.traverse((x) => { if (x.isMesh) x.castShadow = true; }); return G; // cán dọc trục +y, lưỡi hướng +x
}
// ---------- mũ len gắn đầu ----------
export function addBeanie(ch, color = '#b22a22', pom = '#f2f2f2', yOff = 0.14, size = 1.0) {
  const head = ch.bones.Head; ch.root.updateMatrixWorld(true);
  const g = new THREE.Group(); const cap = new THREE.Mesh(new THREE.SphereGeometry(0.118, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), std(color, { roughness: 0.95 })); cap.scale.set(1, 1.05, 1.08); g.add(cap);
  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.112, 0.022, 8, 24), std(color, { roughness: 0.95 })); cuff.rotation.x = Math.PI / 2; cuff.position.y = 0.0; cuff.scale.set(1, 1.08, 1); g.add(cuff);
  const pp = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std(pom, { roughness: 1 })); pp.position.y = 0.13; g.add(pp);
  // đặt theo xương đầu MỖI KHUNG (gọi ch.syncBeanie() sau khi tạo dáng) — attach trực tiếp vào xương bị lệch tỉ lệ
  ch.root.add(g); g.traverse((x) => { if (x.isMesh) x.castShadow = true; });
  const V = new THREE.Vector3(), Q = new THREE.Quaternion(), RQ = new THREE.Quaternion(), up = new THREE.Vector3();
  ch.syncBeanie = () => { ch.root.updateMatrixWorld(true); const sc = ch.root.scale.x; head.getWorldPosition(V); head.getWorldQuaternion(Q); up.set(0, 1, 0).applyQuaternion(Q);
    V.addScaledVector(up, yOff * sc); g.position.copy(ch.root.worldToLocal(V)); ch.root.getWorldQuaternion(RQ); g.quaternion.copy(RQ.invert().multiply(Q)); g.scale.setScalar(size); };
  ch.syncBeanie(); return g;
}
