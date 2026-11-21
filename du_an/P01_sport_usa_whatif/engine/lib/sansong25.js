// Tập 25 (Mascot đối đầu, kèo trong mơ) — "VÕ ĐÀI SÔNG RỪNG" hư cấu: sân cỏ NỔI trên khúc sông nhiệt đới lúc HOÀNG HÔN tím–cam,
// mép sân là sàn gỗ + lan can tre, xung quanh là nước; hai bờ rừng rậm (cây tán, cọ, dây leo); KHÔNG khán đài bê tông —
// fan đứng trên NHÀ SÀN tre (nhiều tầng, mái lá) và BÈ GỖ hai đầu sân, đèn lồng + đuốc; 2 GIÀN ĐÈN VÕ ĐÀI (truss thép) bắc ngang sân;
// bảng điểm đặt trên SÀ LAN ở đầu +x. End zone cam sọc (STRIPES) và xanh ngọc đốm (SPOTS). Không logo, không tên sân.
import * as THREE from 'three';
import { fieldTexture, goalPost, FL, FW } from './ngoaitroi.js';
import { GL } from './santap.js';
import { buildCrowd } from './dongnguoi25.js';
export const OX = GL - 50 * 0.9144;
export const FZ = FW / 2, BANKZ = FW / 2 + 15;
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
let rs = 53; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
function sky() { const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#2c2458'); gr.addColorStop(0.22, '#6a3a7a'); gr.addColorStop(0.38, '#c85a72'); gr.addColorStop(0.46, '#ff9a52'); gr.addColorStop(0.5, '#ffd08a'); gr.addColorStop(0.53, '#7a5a4a'); gr.addColorStop(1, '#2a2420');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,${180 + Math.random() * 60 | 0},150,0.16)`; g.fillRect(0, H * 0.3 + Math.random() * H * 0.18, W, 2 + Math.random() * 5); } });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); }
function jungle(G) {
  const trunk = new THREE.CylinderGeometry(0.35, 0.6, 1, 7), leaf = new THREE.SphereGeometry(1, 9, 7);
  const N = 420; const T = new THREE.InstancedMesh(trunk, std('#4a3424', { roughness: 0.95 }), N), Lf = new THREE.InstancedMesh(leaf, std('#ffffff', { roughness: 0.9 }), N * 3);
  const D = new THREE.Object3D(), col = new THREE.Color(); let li = 0; const greens = ['#2f6a34', '#3c7a3a', '#285a30', '#4a8a3c', '#356a2a', '#5a8a30'];
  for (let i = 0; i < N; i++) { const side = i % 2 ? 1 : -1; const x = OX + (R() - 0.5) * 340, z = side * (BANKZ + 6 + R() * 90); const h = 8 + R() * 16;
    D.position.set(x, h / 2, z); D.rotation.set(0, 0, (R() - 0.5) * 0.15); D.scale.set(1, h, 1); D.updateMatrix(); T.setMatrixAt(i, D.matrix);
    for (let k = 0; k < 3; k++) { const s = 3 + R() * 4; D.position.set(x + (R() - 0.5) * 4, h + (R() - 0.3) * 3, z + (R() - 0.5) * 4); D.rotation.set(0, 0, 0); D.scale.set(s, s * 0.7, s); D.updateMatrix(); Lf.setMatrixAt(li, D.matrix); Lf.setColorAt(li++, col.set(greens[(i + k) % 6])); } }
  G.add(T, Lf);
  // cọ: thân cong + lá rủ
  const palmM = std('#6a5236'), frondM = std('#3f8a3a', { side: THREE.DoubleSide });
  for (let i = 0; i < 40; i++) { const side = i % 2 ? 1 : -1; const x = OX + (R() - 0.5) * 220, z = side * (BANKZ + 2 + R() * 10); const h = 7 + R() * 6; const P = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, h, 6), palmM); tr.position.y = h / 2; tr.rotation.z = (R() - 0.5) * 0.3; P.add(tr);
    for (let k = 0; k < 7; k++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.2), frondM); f.position.set(0, h, 0); f.rotation.set(0.9 + R() * 0.3, k / 7 * Math.PI * 2, 0); f.translateY(1.8); P.add(f); }
    P.position.set(x, 0, z); G.add(P); }
  // bờ đất + cỏ
  const bank = std('#3a5a2a', { roughness: 1 }), mud = std('#5a4430', { roughness: 1 });
  for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(700, 2, 300), bank); b.position.set(OX, -0.2, s * (BANKZ + 150)); G.add(b);
    const m = new THREE.Mesh(new THREE.BoxGeometry(700, 1.6, 3), mud); m.position.set(OX, -0.4, s * (BANKZ + 1)); G.add(m); }
  // dây leo rủ (gần camera ở các cảnh cận bờ)
  const vineM = std('#2e5a26');
  for (let i = 0; i < 60; i++) { const side = i % 2 ? 1 : -1; const v = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4 + R() * 6, 4), vineM); v.position.set(OX + (R() - 0.5) * 200, 9, side * (BANKZ + 4 + R() * 6)); G.add(v); }
}
// nhà sàn tre nhiều tầng: trả về các chỗ đứng cho đám đông
function stiltHouses(G, spots) {
  const pole = std('#b89a5a', { roughness: 0.8 }), deck = std('#8a6a42', { roughness: 0.85 }), thatch = std('#b08a48', { roughness: 1 }), rail = std('#c8a868');
  const lanternM = new THREE.MeshBasicMaterial({ color: '#ffb44a', toneMapped: false }), flameM = new THREE.MeshBasicMaterial({ color: '#ff8a2a', toneMapped: false });
  const tiers = [[3.0, 0], [6.4, 7], [9.8, 14]]; // [cao sàn, lùi ra sau]
  for (const side of [-1, 1]) for (let hx = -5; hx <= 5; hx++) { const cx = OX + hx * 13; const tier = tiers[(hx + 5 + (side > 0 ? 1 : 0)) % 3];
    const H = new THREE.Group(); const zb = side * (BANKZ - 3 + tier[1]); const w = 11, d = 6.5;
    const dk = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d), deck); dk.position.set(cx, tier[0], zb); H.add(dk);
    for (const px of [-w / 2 + 0.4, 0, w / 2 - 0.4]) for (const pz of [-d / 2 + 0.3, d / 2 - 0.3]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, tier[0] + 1.2, 6), pole); p.position.set(cx + px, (tier[0] - 1.2) / 2, zb + pz); H.add(p); }
    const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.08), rail); r.position.set(cx, tier[0] + 1.0, zb - side * (d / 2 - 0.1)); H.add(r);
    for (let k = 0; k <= 10; k++) { const rp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), rail); rp.position.set(cx - w / 2 + k * w / 10, tier[0] + 0.5, zb - side * (d / 2 - 0.1)); H.add(rp); }
    // mái lá dốc (chỉ phía sau, để thấy người)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.3, 3.4), thatch); roof.position.set(cx, tier[0] + 4.2, zb + side * (d / 2 - 1.0)); roof.rotation.x = -side * 0.45; H.add(roof);
    for (const px of [-w / 2 + 0.4, w / 2 - 0.4]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 6), pole); p.position.set(cx + px, tier[0] + 2.1, zb + side * (d / 2 - 0.5)); H.add(p); }
    // đèn lồng + đuốc
    for (let k = 0; k < 4; k++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), lanternM); l.position.set(cx - w / 2 + 1.5 + k * 2.7, tier[0] + 3.1, zb - side * (d / 2 - 0.6)); H.add(l); }
    for (const px of [-w / 2, w / 2]) { const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.6, 5), pole); tk.position.set(cx + px, tier[0] + 0.95, zb - side * (d / 2)); H.add(tk); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 6), flameM); fl.position.set(cx + px, tier[0] + 1.95, zb - side * (d / 2)); H.add(fl); }
    G.add(H);
    // chỗ đứng: 3 hàng × ~16 người
    for (let row = 0; row < 3; row++) for (let k = 0; k < 16; k++) { if (R() < 0.12) continue; spots.push({ x: cx - w / 2 + 0.5 + k * (w - 1) / 15 + (R() - 0.5) * 0.15, y: tier[0] + 0.18, z: zb - side * (d / 2 - 0.7 - row * 0.85), ry: side > 0 ? Math.PI : 0, team: hx < 0 ? 0 : 1 }); } }
}
function rafts(G, spots) { const log = std('#7a5634', { roughness: 0.9 });
  for (const ex of [-1, 1]) for (let i = 0; i < 3; i++) { const cx = OX + ex * (FL / 2 + 9 + i * 0.5), cz = (i - 1) * 14; const Rf = new THREE.Group();
    for (let k = 0; k < 9; k++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 10, 8), log); l.rotation.x = Math.PI / 2; l.position.set(cx - 2.2 + k * 0.55, -0.1, cz); Rf.add(l); }
    G.add(Rf); for (let row = 0; row < 6; row++) for (let k = 0; k < 7; k++) if (R() > 0.15) spots.push({ x: cx - 1.9 + row * 0.7, y: 0.18, z: cz - 4.2 + k * 1.35, ry: ex > 0 ? -Math.PI / 2 : Math.PI / 2, team: ex > 0 ? 1 : 0 }); } }
function truss(G) { const steel = std('#3a3c44', { metalness: 0.6, roughness: 0.4 }); const lampM = new THREE.MeshBasicMaterial({ color: '#fff4d8', toneMapped: false });
  for (const dx of [-32, 32]) { const x = OX + dx; const Z = FZ + 9, Hh = 21;
    for (const s of [-1, 1]) { for (const o of [-0.8, 0.8]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, Hh, 0.3), steel); c.position.set(x + o, Hh / 2 - 0.6, s * Z); G.add(c); }
      for (let k = 0; k < 10; k++) { const br = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 0.1), steel); br.position.set(x, 1 + k * 2, s * Z); br.rotation.z = k % 2 ? 0.55 : -0.55; G.add(br); } }
    for (const yy of [Hh - 0.6, Hh - 2.0]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 2 * Z), steel); b.position.set(x, yy, 0); G.add(b); }
    for (let k = 0; k < 14; k++) { const bz = -Z + 1 + k * (2 * Z - 2) / 13; const br = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), steel); br.position.set(x, Hh - 1.3, bz); br.rotation.x = k % 2 ? 0.6 : -0.6; G.add(br); }
    for (let k = 0; k < 8; k++) { const z = -Z + 4 + k * (2 * Z - 8) / 7; const can = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.8, 10), steel); can.position.set(x, Hh - 2.7, z); G.add(can); const lens = new THREE.Mesh(new THREE.CircleGeometry(0.42, 12), lampM); lens.rotation.x = Math.PI / 2; lens.position.set(x, Hh - 3.12, z); G.add(lens); } } }
function bargeBoard(G) { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const B = new THREE.Group(); const hull = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 6), std('#4a3a2c')); hull.position.y = 0.2; B.add(hull);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(13, 7.6, 0.5), std('#1a1a1e')); frame.position.set(0, 5.6, 0); B.add(frame);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 7), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(0, 5.6, -0.27); face.rotation.y = Math.PI; B.add(face);
  B.position.set(OX + FL / 2 + 22, 0, 0); B.rotation.y = Math.PI / 2; G.add(B); let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d'); g.fillStyle = '#120e18'; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = '#ffb44a'; g.lineWidth = 10; g.strokeRect(10, 10, 1004, 556); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = '900 110px Anton, Impact, sans-serif'; g.fillStyle = o.msgColor || '#fff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 512, 288 + (i - (a.length - 1) / 2) * 130)); t.needsUpdate = true; return; }
    g.font = '900 70px Anton, Impact, sans-serif'; g.fillStyle = '#ff8a2a'; g.fillText('CIN', 270, 100); g.fillStyle = '#2ac8c0'; g.fillText('JAX', 754, 100);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = '#fff'; g.fillText(String(o.a ?? 0), 270, 300); g.fillText(String(o.b ?? 0), 754, 300);
    g.font = '900 70px Anton, Impact, sans-serif'; g.fillStyle = '#ffd08a'; g.fillText(o.clock || '', 512, 480); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'FIGHT NIGHT' }); return { G: B, draw }; }
export function buildRiver(scene) {
  scene.background = new THREE.Color('#e48a6a'); scene.fog = new THREE.Fog('#c87a70', 140, 520);
  const G = new THREE.Group(); scene.add(G); G.add(sky());
  // nước sông: phẳng, hơi bóng, vân sóng
  const wt = ctex(256, 256, (g) => { g.fillStyle = '#2a5a66'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(${200 + Math.random() * 55 | 0},${150 + Math.random() * 60 | 0},120,${0.08 + Math.random() * 0.12})`; g.lineWidth = 1 + Math.random() * 2; const x = Math.random() * 256, y = Math.random() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10 + Math.random() * 30, y); g.stroke(); } }, [30, 12]);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(800, 2 * BANKZ + 6), std('#ffffff', { map: wt, roughness: 0.12, metalness: 0.35 })); water.rotation.x = -Math.PI / 2; water.position.set(OX, -0.55, 0); water.receiveShadow = true; G.add(water);
  // sàn nổi: bệ gỗ + cỏ
  const plat = new THREE.Mesh(new THREE.BoxGeometry(FL + 8, 1.0, FW + 8), std('#6a4a2c', { roughness: 0.9 })); plat.position.set(OX, -0.52, 0); plat.receiveShadow = true; G.add(plat);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#3e8a3a'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(20,60,20,0.1)' : 'rgba(190,230,140,0.07)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [40, 20]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(FL + 7, FW + 7), std('#ffffff', { map: turf, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.015, 0); ground.receiveShadow = true; G.add(ground);
  const ft = fieldTexture({ endLeft: '#0f6a6a', endLeftText: 'SPOTS', endLeftStroke: '#e8c050', endRight: '#e0661a', endRightText: 'STRIPES', endRightFg: '#141010', g1: '#3c8a38', g2: '#4a9a42' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  const a = goalPost(-1), b = goalPost(1); a.position.x = OX - FL / 2; b.position.x = OX + FL / 2; G.add(a, b);
  // lan can tre quanh sàn
  const bam = std('#c8a868'); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, FL + 8, 6), bam); r.rotation.z = Math.PI / 2; r.position.set(OX, 0.9, s * (FW / 2 + 3.9)); G.add(r);
    for (let k = 0; k <= 40; k++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 5), bam); p.position.set(OX - (FL + 8) / 2 + k * (FL + 8) / 40, 0.5, s * (FW / 2 + 3.9)); G.add(p); } }
  jungle(G); truss(G); const spots = []; stiltHouses(G, spots); rafts(G, spots);
  const crowd = buildCrowd(G, spots, { seed: 25, coats: ['#e0661a', '#141414', '#e0661a', '#f2efe8', '#e0661a', '#0f6a6a', '#141414', '#1aa8a0', '#d8a830', '#0f6a6a'], hats: ['#e0661a', '#141414', '#1aa8a0', '#d8a830'], paint: ['#e0661a', '#1aa8a0'], towels: ['#e0661a', '#1aa8a0', '#141414'] });
  const board = bargeBoard(G); const poles = [];
  return { G, poles, crowd, board };
}
export function riverLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#ffd8c0', '#3a4a3a', 2.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffd2a8', 4.0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const rim = new THREE.DirectionalLight('#b88aff', 1.4); rim.position.set(-40, 20, -30); scene.add(rim);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 26, 30, z - 14); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7).multiplyScalar(26); key.position.set(x + d.x, 30, z + d.z); };
  const lamps = () => {}; area(0, 0); return { hemi, key, fill: rim, area, lamps };
}
