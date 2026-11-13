// E15 (NBA): SÂN BÓNG RỔ GIỮA VƯỜN HỒNG KHỔNG LỒ ở Portland ("Rose City"), trưa nắng trong, trời xanh mây trắng, núi tuyết xa (dáng núi lửa chóp nón).
// Sàn gỗ sáng rải cánh hoa, vạch trắng, vùng sơn đỏ; quanh sân: tường giậu xanh cắt vuông, bụi hồng đỏ/hồng/trắng/vàng, luống tulip sọc màu,
// cổng vòm hoa, lối sỏi, cây tán tròn, khán đài sơn trắng + khán giả (mũ rộng vành), bảng điểm khung giàn hoa.
// Đạo cụ: giậu di động (bánh xe), máy cắt cỏ ngồi lái khổng lồ, bình tưới, kéo tỉa, chậu xương rồng, bụi hồng để Lillard bước ra, mưa cánh hoa.
// Sân NBA thật 28,65 × 15,24 m; rổ 3,05 m.
import * as THREE from 'three';
import { hoop, canvasTex } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const GD = { L: 28.65, W: 15.24 };
const ROSE = ['#e0245e', '#ff6f9c', '#c8102e', '#ffffff', '#ffd23f', '#ff8fb1', '#f04e6e'];

function lump(rx, ry, rz, seed = 1, seg = 18, color = '#3f8a3a') {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.6), 0, Math.PI * 2, 0, Math.PI / 2); const p = g.attributes.position; const r = rnd(seed * 97 + 3);
  const k = [r(), r(), r()].map((x) => x * 6.28);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + 0.12 * Math.sin(x * 3 + k[0]) * Math.cos(z * 2.6 + k[1]) + 0.06 * Math.sin(y * 5 + k[2]); p.setXYZ(i, x * rx * n, y * ry * n, z * rz * n); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, std(color, { roughness: 0.95 })); m.receiveShadow = true; m.castShadow = true; return m;
}

// ---------- sàn gỗ + vạch ----------
function courtTex() {
  const S = 60, PAD = 2, W = Math.round((GD.L + PAD * 2) * S), H = Math.round((GD.W + PAD * 2) * S);
  const t = canvasTex(W, H, (g) => {
    g.fillStyle = '#e2b77e'; g.fillRect(0, 0, W, H); const r = rnd(7);
    for (let y = 0; y < H; y += 0.12 * S) for (let x = -r() * 200; x < W; x += 1.6 * S) { const v = r(); g.fillStyle = `rgb(${220 + v * 22 | 0},${170 + v * 26 | 0},${110 + v * 22 | 0})`; g.fillRect(x, y, 1.6 * S - 2, 0.12 * S - 1); }
    const X = (m) => W / 2 + m * S, Y = (m) => H / 2 + m * S;
    g.fillStyle = '#5b8f3e'; g.fillRect(0, 0, W, Y(-GD.W / 2)); g.fillRect(0, Y(GD.W / 2), W, H); g.fillRect(0, 0, X(-GD.L / 2), H); g.fillRect(X(GD.L / 2), 0, W, H);
    g.fillStyle = 'rgba(200,16,46,0.85)'; for (const d of [-1, 1]) { const bx = X(d * GD.L / 2), kx = X(d * (GD.L / 2 - 5.8)); g.fillRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S); }
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 0.08 * S;
    g.strokeRect(X(-GD.L / 2), Y(-GD.W / 2), GD.L * S, GD.W * S); g.beginPath(); g.moveTo(X(0), Y(-GD.W / 2)); g.lineTo(X(0), Y(GD.W / 2)); g.stroke();
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.stroke();
    for (const d of [-1, 1]) { const bx = X(d * GD.L / 2), kx = X(d * (GD.L / 2 - 5.8)); g.strokeRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S);
      g.beginPath(); g.arc(kx, Y(0), 1.8 * S, d > 0 ? Math.PI / 2 : -Math.PI / 2, d > 0 ? Math.PI * 1.5 : Math.PI / 2); g.stroke();
      const rx = X(d * (GD.L / 2 - 1.6)); g.beginPath(); g.moveTo(bx, Y(-6.7)); g.lineTo(X(d * (GD.L / 2 - 4.3)), Y(-6.7));
      g.arc(rx, Y(0), 7.24 * S, d > 0 ? Math.PI + 1.18 : -1.18, d > 0 ? Math.PI - 1.18 : 1.18, d > 0); g.lineTo(bx, Y(6.7)); g.stroke(); }
    g.save(); g.translate(X(0), Y(0)); g.font = `900 ${0.62 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText('ROSE', 0, -0.32 * S); g.fillText('CITY', 0, 0.36 * S); g.restore();
    for (const d of [-1, 1]) { g.save(); g.translate(X(d * 9.6), Y(0)); g.rotate(d * Math.PI / 2); g.font = `900 ${0.9 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(160,20,50,0.75)'; g.fillText('GARDEN GAME', 0, 0); g.restore(); }
  });
  t.anisotropy = 8; return { tex: t, size: [GD.L + PAD * 2, GD.W + PAD * 2] };
}

function skyDome() {
  const tex = canvasTex(256, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3f86de'); gr.addColorStop(0.42, '#86b9ee'); gr.addColorStop(0.5, '#cfe6fb'); gr.addColorStop(1, '#e8f3e0'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const r = rnd(31); for (let i = 0; i < 26; i++) { const x = r() * W, y = H * (0.12 + r() * 0.3), w = 20 + r() * 50; for (let k = 0; k < 6; k++) { const gg = g.createRadialGradient(x + k * w * 0.3, y, 0, x + k * w * 0.3, y, w * 0.5); gg.addColorStop(0, 'rgba(255,255,255,0.75)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gg; g.fillRect(x + k * w * 0.3 - w, y - w, w * 2, w * 2); } } });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, toneMapped: false }));
}

// núi tuyết chóp nón xa
function mountain(scene) {
  const g = new THREE.ConeGeometry(160, 150, 40, 8); const p = g.attributes.position; const c = []; const col = new THREE.Color(); const r = rnd(41);
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); const n = 1 + 0.06 * Math.sin(p.getX(i) * 0.08 + p.getZ(i) * 0.05); p.setX(i, p.getX(i) * n); p.setZ(i, p.getZ(i) * n); col.set(y > 20 + r() * 8 ? '#f6f9ff' : '#6f8fb0'); c.push(col.r, col.g, col.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, fog: true })); m.position.set(120, 60, -620); scene.add(m);
  for (let i = 0; i < 9; i++) { const h = lump(80 + r() * 60, 20 + r() * 16, 50, 70 + i, 14, '#4f7f52'); const a = -0.6 + i / 8 * 4.2; h.position.set(Math.cos(a) * 300, -2, -Math.abs(Math.sin(a)) * 260 - 60); scene.add(h); }
}

// cây tán tròn (instanced)
function trees(scene, seed = 9) {
  const r = rnd(seed); const N = 160; const list = [];
  for (let i = 0; i < N; i++) { const a = r() * 6.283, rr = 40 + r() * 50; list.push([Math.cos(a) * rr * 1.25, Math.sin(a) * rr, 5 + r() * 6]); }
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.3, 1, 6).translate(0, 0.5, 0), std('#6a4a30'), N);
  const crowns = [0, 1].map((k) => new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), std(['#3d8a3e', '#5aa44a'][k], { roughness: 0.9, flatShading: true }), N));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  list.forEach(([x, z, h], i) => { m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, h * 0.5, 1)); trunk.setMatrixAt(i, m);
    m.compose(new THREE.Vector3(x, h * 0.62, z), q, new THREE.Vector3(h * 0.38, h * 0.34, h * 0.38)); crowns[0].setMatrixAt(i, m);
    m.compose(new THREE.Vector3(x + h * 0.15, h * 0.8, z + h * 0.1), q, new THREE.Vector3(h * 0.25, h * 0.22, h * 0.25)); crowns[1].setMatrixAt(i, m); });
  [trunk, ...crowns].forEach((x) => { x.castShadow = false; x.receiveShadow = true; scene.add(x); });
}

// bụi hồng (lùm xanh + hoa nhiều màu, gộp instanced theo màu)
const ROSES = { list: [] };
function roseGeo() { const g = new THREE.IcosahedronGeometry(1, 1); return g; }
export function roseBush(seed = 1, s = 1, palette = ROSE) {
  const G = new THREE.Group(); const r = rnd(seed + 11);
  const b = lump(0.7 * s, 0.85 * s, 0.7 * s, seed, 14, '#2f7a32'); G.add(b);
  const n = Math.round(26 * s * s); const geo = roseGeo();
  for (let i = 0; i < n; i++) { const a = r() * 6.28, el = r() * 1.2; const col = palette[Math.floor(r() * palette.length)];
    const f = new THREE.Mesh(geo, std(col, { roughness: 0.55 })); const rr = 0.07 + r() * 0.05; f.scale.set(rr * s, rr * 0.8 * s, rr * s);
    f.position.set(Math.cos(a) * Math.cos(el) * 0.68 * s, Math.sin(el) * 0.82 * s + 0.04, Math.sin(a) * Math.cos(el) * 0.68 * s); G.add(f); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// nhiều bụi hồng: instanced (lùm + hoa theo màu)
function roseField(scene, spots) {
  const N = spots.length; const r = rnd(77);
  const bush = new THREE.InstancedMesh(lump(1, 1, 1, 5, 12, '#2f7a32').geometry, std('#2f7a32', { roughness: 0.95 }), N);
  const per = 22; const fl = ROSE.map((c) => new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), std(c, { roughness: 0.5 }), N * per)); const cnt = ROSE.map(() => 0);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  spots.forEach(([x, z, s], i) => { m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(0.75 * s, 0.85 * s, 0.75 * s)); bush.setMatrixAt(i, m);
    const pal = r() < 0.5 ? [0, 2, 6] : r() < 0.5 ? [1, 5, 3] : [4, 3, 0];
    for (let k = 0; k < per; k++) { const a = r() * 6.28, el = r() * 1.2, rr = (0.07 + r() * 0.05) * s; const ci = pal[Math.floor(r() * pal.length)];
      m.compose(new THREE.Vector3(x + Math.cos(a) * Math.cos(el) * 0.72 * s, Math.sin(el) * 0.85 * s + 0.04, z + Math.sin(a) * Math.cos(el) * 0.72 * s), q, new THREE.Vector3(rr, rr * 0.8, rr)); fl[ci].setMatrixAt(cnt[ci]++, m); } });
  fl.forEach((f, i) => { f.count = cnt[i]; f.castShadow = true; scene.add(f); }); bush.castShadow = true; bush.receiveShadow = true; scene.add(bush);
}

// tường giậu cắt vuông
export function hedge(len, h = 1.6, d = 0.9, color = '#2e7d32') {
  const G = new THREE.Group(); const tx = canvasTex(128, 128, (g, W, H) => { g.fillStyle = color; g.fillRect(0, 0, W, H); const r = rnd(3); for (let i = 0; i < 900; i++) { g.fillStyle = r() < 0.5 ? 'rgba(20,70,25,0.5)' : 'rgba(120,190,90,0.45)'; g.fillRect(r() * W, r() * H, 3, 3); } });
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(len / 1.2, h / 1.2);
  const b = new THREE.Mesh(new THREE.BoxGeometry(len, h, d), new THREE.MeshStandardMaterial({ map: tx, roughness: 1 })); b.position.y = h / 2; G.add(b);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

// luống tulip sọc màu (instanced)
function tulips(scene, x0, z0, w, d, seed = 1) {
  const r = rnd(seed); const nx = Math.round(w / 0.22), nz = Math.round(d / 0.22); const N = nx * nz;
  const COL = ['#ff3b3b', '#ffd23f', '#ff7ac8', '#ff8a1e', '#ffffff', '#b04ad8'];
  const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 4).translate(0, 0.2, 0), std('#3f8f2e'), N);
  const heads = COL.map((c) => new THREE.InstancedMesh(new THREE.CylinderGeometry(0.055, 0.035, 0.1, 6).translate(0, 0.44, 0), std(c, { roughness: 0.5 }), N)); const cnt = COL.map(() => 0);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(); let i = 0;
  for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { const x = x0 + a * 0.22 + (r() - 0.5) * 0.08, z = z0 + b * 0.22 + (r() - 0.5) * 0.08; const hs = 0.8 + r() * 0.4;
    m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, hs, 1)); stem.setMatrixAt(i++, m); const ci = Math.floor(a / 3) % COL.length; heads[ci].setMatrixAt(cnt[ci]++, m); }
  heads.forEach((h, k) => { h.count = cnt[k]; scene.add(h); }); scene.add(stem);
  const soil = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.06, d + 0.2), std('#5a3a24')); soil.position.set(x0 + w / 2, 0.03, z0 + d / 2); soil.receiveShadow = true; scene.add(soil);
}

// cổng vòm hoa
function arch(seed = 1) {
  const G = new THREE.Group(); const wht = std('#f7f4ee', { roughness: 0.6 }); const r = rnd(seed);
  const tor = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.06, 8, 24, Math.PI), wht); tor.position.y = 2.2; G.add(tor);
  for (const x of [-1.4, 1.4]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.1), wht); p.position.set(x, 1.1, 0); G.add(p); }
  for (let i = 0; i < 40; i++) { const a = r() * Math.PI; const rr = 1.4 + (r() - 0.5) * 0.15; const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1 + r() * 0.06, 1), std(i % 3 ? '#2f7a32' : ROSE[Math.floor(r() * 3)], { roughness: 0.6 }));
    f.position.set(Math.cos(a) * rr, 2.2 + Math.sin(a) * rr, (r() - 0.5) * 0.2); G.add(f); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}

function bleacher(len, rows = 3) {
  const G = new THREE.Group(); const wood = std('#f4f1ea', { roughness: 0.6 }), wood2 = std('#d8d2c4');
  for (let k = 0; k < rows; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.5), wood); s.position.set(0, 0.42 + k * 0.45, -k * 0.7); G.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.35), wood2); f.position.set(0, 0.1 + k * 0.45, -k * 0.7 + 0.42); G.add(f); }
  for (let x = -len / 2; x <= len / 2 + 0.01; x += len / 8) for (let k = 0; k < rows; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42 + k * 0.45, 0.1), wood2); p.position.set(x, (0.42 + k * 0.45) / 2, -k * 0.7); G.add(p); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

// bảng điểm khung giàn hoa trắng (canvas)
function trellisBoard() {
  const G = new THREE.Group(); const tex = canvasTex(1024, 560, (g, W, H) => { g.fillStyle = '#14301c'; g.fillRect(0, 0, W, H); });
  const wht = std('#f7f4ee', { roughness: 0.6 });
  for (const x of [-2.4, 2.4]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.4, 0.2), wht); p.position.set(x, 2.7, -0.1); G.add(p); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.1, 0.22), wht); fr.position.set(0, 4.4, -0.12); G.add(fr);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.73), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); sc.position.set(0, 4.4, 0.01); G.add(sc);
  const r = rnd(12); for (let i = 0; i < 70; i++) { const t = r(); const onTop = r() < 0.6; const x = onTop ? -2.7 + t * 5.4 : (r() < 0.5 ? -2.55 : 2.55); const y = onTop ? 5.95 + (r() - 0.5) * 0.2 : 1 + t * 4.8;
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1 + r() * 0.08, 1), std(i % 3 ? '#2f7a32' : ROSE[Math.floor(r() * ROSE.length)], { roughness: 0.6 })); f.position.set(x, y, 0.05); G.add(f); }
  G.traverse((o) => { if (o.isMesh && o !== sc) o.castShadow = true; }); G.userData.tex = tex; return G;
}

// khán giả gộp 1 lưới (áo màu + mũ rộng vành), tay vẫy theo uCheer; p = [x, y, z, yaw]
function crowd(scene, list) {
  let rs = 29; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const torsoG = box(0.44, 0.48, 0.3, 0, 0.72, -0.02), headG = new THREE.IcosahedronGeometry(0.13, 1).translate(0, 1.12, 0).toNonIndexed(), legG = box(0.4, 0.16, 0.44, 0, 0.5, 0.18), armG = box(0.11, 0.42, 0.11, 0, -0.2, 0);
  const eyeG = new THREE.IcosahedronGeometry(0.045, 0).toNonIndexed(), pupG = new THREE.IcosahedronGeometry(0.022, 0).toNonIndexed();
  const brimG = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 14).translate(0, 1.22, 0).toNonIndexed(), crownG = new THREE.CylinderGeometry(0.12, 0.14, 0.12, 12).translate(0, 1.29, 0).toNonIndexed();
  const coats = ['#c8102e', '#111111', '#ffffff', '#c8102e', '#ff8fb1', '#ffd23f', '#0a7cc4', '#c8102e', '#7ac74f', '#111111', '#f4a6c1', '#c8102e'];
  const hats = ['#f2e2b0', '#ffffff', '#ff8fb1', '#c8102e', '#ffd23f', '#e9d7a6'];
  const skins = ['#f1c9a5', '#d6a47a', '#b57e55', '#8a5a3c', '#e8b98f'];
  const P = [], C = [], CP = [], PV = [], FX = []; const v = new THREE.Vector3(), col = new THREE.Color();
  const add = (geo, m, color, cp, piv, fax) => { col.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count;
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(col.r, col.g, col.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); FX.push(fax.x, fax.y, fax.z); } };
  for (const [x, y, z, yaw] of list) { const m = new THREE.Matrix4().makeRotationY(yaw).premultiply(new THREE.Matrix4().makeTranslation(x, y, z)); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)); const fax = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const rr = R(), coat = coats[Math.floor(R() * coats.length)], hat = hats[Math.floor(R() * hats.length)], skin = skins[Math.floor(R() * skins.length)]; const ph = rr * 40, am = 0.55 + 0.45 * ((rr * 7.3) % 1); const zero = new THREE.Vector3();
    const B = [1, ph, am, 0], Hd = [1.5, ph, am, 0];
    add(torsoG, m, coat, B, zero, fax); add(headG, m, skin, Hd, zero, fax); add(legG, m, '#3a4250', [0, 0, 0, 0], zero, zero);
    if (R() < 0.6) { add(brimG, m, hat, Hd, zero, fax); add(crownG, m, hat, Hd, zero, fax); }
    for (const sx of [-1, 1]) { const T = (gx, gy, gz) => new THREE.Matrix4().makeTranslation(gx, gy, gz).premultiply(m); add(eyeG, T(sx * 0.05, 1.12, 0.1), '#ffffff', Hd, zero, fax); add(pupG, T(sx * 0.05, 1.12, 0.14), '#111111', Hd, zero, fax); }
    for (const sx of [-1, 1]) { const off = new THREE.Vector3(sx * 0.28, 0.94, -0.02); const sh = off.clone().applyMatrix4(m); const am4 = new THREE.Matrix4().makeTranslation(off.x, off.y, off.z).premultiply(m);
      const ow = off.clone().setY(0).applyQuaternion(q); const d = new THREE.Vector3(0, -1, 0), sgn = Math.sign(new THREE.Vector3().crossVectors(fax, d).dot(ow)) || 1; add(armG, am4, skin, [sgn > 0 ? 2 : 3, ph, am, 0], sh, fax); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  geo.setAttribute('cp', new THREE.Float32BufferAttribute(CP, 4)); geo.setAttribute('piv', new THREE.Float32BufferAttribute(PV, 3)); geo.setAttribute('fax', new THREE.Float32BufferAttribute(FX, 3)); geo.computeVertexNormals();
  const U = { uT: { value: 0 }, uCheer: { value: 0.2 } };
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 cp; attribute vec3 piv; attribute vec3 fax; uniform float uT, uCheer;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      if (cp.x > 0.5) { float ch = clamp(uCheer * cp.z * (0.7 + 0.6 * fract(cp.y * 0.37)), 0.0, 1.0); float w = uT * (5.0 + cp.z * 3.0) + cp.y;
        if (cp.x > 1.9) { float s = cp.x < 2.5 ? 1.0 : -1.0; float ang = s * (0.12 + ch * (2.5 + 0.35 * sin(w * 1.3)) + 0.06 * sin(uT * 1.7 + cp.y));
          vec3 r = transformed - piv; r = r * cos(ang) + cross(fax, r) * sin(ang) + fax * dot(fax, r) * (1.0 - cos(ang)); transformed = piv + r; }
        transformed.y += (0.012 + 0.12 * ch) * max(0.0, sin(w)); }`); };
  mat.customProgramCacheKey = () => 'gardencrowd';
  const all = new THREE.Mesh(geo, mat); all.frustumCulled = false; all.castShadow = true; all.receiveShadow = true; scene.add(all);
  return { U, count: list.length };
}

// thảm cánh hoa trên sân (instanced) — clear(x0,x1,zc,hw) ẩn cánh trong dải đã cắt
function petalCarpet(scene, N = 9000) {
  const r = rnd(55); const COL = ['#ff6f9c', '#e0245e', '#ffffff', '#ff8fb1', '#ffd23f', '#c8102e'];
  const geo = new THREE.CircleGeometry(0.05, 6).rotateX(-Math.PI / 2); geo.scale(1, 1, 0.6);
  const meshes = COL.map((c) => new THREE.InstancedMesh(geo, std(c, { roughness: 0.6, side: THREE.DoubleSide }), N)); const cnt = COL.map(() => 0);
  const P = []; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < N; i++) { const x = (r() - 0.5) * (GD.L + 1), z = (r() - 0.5) * (GD.W + 1); const ci = Math.floor(r() * COL.length); e.set((r() - 0.5) * 0.4, r() * 6.28, (r() - 0.5) * 0.4); q.setFromEuler(e); const s = 0.7 + r() * 0.8;
    m.compose(new THREE.Vector3(x, 0.006 + r() * 0.01, z), q, new THREE.Vector3(s, 1, s)); const k = cnt[ci]++; meshes[ci].setMatrixAt(k, m); P.push([ci, k, m.clone(), x, z]); }
  meshes.forEach((mm, i) => { mm.count = cnt[i]; mm.receiveShadow = true; scene.add(mm); });
  const Z = new THREE.Matrix4().makeScale(0, 0, 0); let last = '';
  const clear = (x0, x1, zc, hw) => { const key = x0 === null ? 'none' : `${x0.toFixed(2)},${x1.toFixed(2)},${zc},${hw}`; if (key === last) return; last = key;
    for (const [ci, k, mm, x, z] of P) { const hide = x0 !== null && x >= x0 && x <= x1 && Math.abs(z - zc) < hw; meshes[ci].setMatrixAt(k, hide ? Z : mm); } meshes.forEach((mm) => (mm.instanceMatrix.needsUpdate = true)); };
  return { meshes, clear, setVisible: (v) => meshes.forEach((mm) => (mm.visible = v)) };
}

export function buildGarden(scene) {
  scene.background = new THREE.Color('#bfe0fb'); scene.fog = new THREE.Fog('#d6ecfb', 90, 700); scene.add(skyDome()); mountain(scene);
  const ct = courtTex();
  const court = new THREE.Mesh(new THREE.PlaneGeometry(ct.size[0], ct.size[1]), new THREE.MeshStandardMaterial({ map: ct.tex, roughness: 0.45, metalness: 0.02 })); court.rotation.x = -Math.PI / 2; court.position.y = 0.004; court.receiveShadow = true; scene.add(court);
  const gtx = canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#5b9a40'; g.fillRect(0, 0, W, H); const r = rnd(8); for (let i = 0; i < 3000; i++) { g.fillStyle = r() < 0.5 ? 'rgba(40,100,30,0.5)' : 'rgba(140,200,90,0.4)'; g.fillRect(r() * W, r() * H, 2, 4); } });
  gtx.wrapS = gtx.wrapT = THREE.RepeatWrapping; gtx.repeat.set(300, 300);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshStandardMaterial({ map: gtx, roughness: 0.95 })); lawn.rotation.x = -Math.PI / 2; lawn.position.y = -0.03; lawn.receiveShadow = true; scene.add(lawn);
  // lối sỏi quanh sân
  const grav = std('#d9cdb4', { roughness: 1 }); for (const [w, d, x, z] of [[GD.L + 6, 1.4, 0, GD.W / 2 + 1.0], [GD.L + 6, 1.4, 0, -GD.W / 2 - 1.0], [1.4, GD.W + 3.4, GD.L / 2 + 1.0, 0], [1.4, GD.W + 3.4, -GD.L / 2 - 1.0, 0]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, d), grav); p.position.set(x, -0.012, z); p.receiveShadow = true; scene.add(p); }
  trees(scene);
  const hoops = [hoop(1, { pad: '#c8102e' }), hoop(-1, { pad: '#c8102e' })]; hoops[0].position.set(GD.L / 2 - 1.22, 0, 0); hoops[1].position.set(-(GD.L / 2 - 1.22), 0, 0); hoops.forEach((h) => scene.add(h));
  // tường giậu sau 2 đầu sân (có khe lối vào) + vòng giậu ngoài mê cung
  const hedges = [];
  for (const d of [-1, 1]) { for (const z of [-5.5, 5.5]) { const h = hedge(6, 2.0, 1.0); h.position.set(d * (GD.L / 2 + 3.2), 0, z); h.rotation.y = Math.PI / 2; scene.add(h); hedges.push(h); } }
  const r = rnd(13);
  for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283; const rr = 26 + (i % 3) * 3.5; const h = hedge(5 + r() * 3, 1.8, 0.9); h.position.set(Math.cos(a) * rr * 1.2, 0, Math.sin(a) * rr * 0.95); h.rotation.y = -a + Math.PI / 2; scene.add(h); }
  // bụi hồng: dọc biên + sau khán đài + rải ngoài
  const spots = [];
  for (let i = 0; i < 34; i++) { const x = -GD.L / 2 + i / 33 * GD.L; for (const side of [-1, 1]) spots.push([x + (r() - 0.5) * 0.3, side * (GD.W / 2 + 0.25 + r() * 0.15) + side * 0.15, 0.55 + r() * 0.15]); }
  for (let i = 0; i < 18; i++) for (const side of [-1, 1]) spots.push([-GD.L / 2 - 2 + i / 17 * (GD.L + 4), side * (GD.W / 2 + 5.0 + r() * 0.5), 0.9 + r() * 0.4]);
  for (let i = 0; i < 120; i++) { const a = r() * 6.283, d = 20 + r() * 18; spots.push([Math.cos(a) * d * 1.25, Math.sin(a) * d, 0.8 + r() * 0.7]); }
  for (const d of [-1, 1]) for (let k = 0; k < 6; k++) spots.push([d * (GD.L / 2 + 2.4), -2.2 + k * 0.9, 0.7]);
  roseField(scene, spots);
  // luống tulip ở 4 góc
  tulips(scene, GD.L / 2 + 1.9, -GD.W / 2 - 3.5, 4, 2.6, 3); tulips(scene, -GD.L / 2 - 5.9, GD.W / 2 + 1.0, 4, 2.6, 4); tulips(scene, -GD.L / 2 - 5.9, -GD.W / 2 - 3.5, 4, 2.6, 5); tulips(scene, GD.L / 2 + 1.9, GD.W / 2 + 1.0, 4, 2.6, 6);
  // cổng vòm hoa ở 2 lối vào cuối sân
  for (const d of [-1, 1]) { const a = arch(d + 3); a.position.set(d * (GD.L / 2 + 3.2), 0, 0); a.rotation.y = Math.PI / 2; scene.add(a); }
  // khán đài trắng 2 bên dọc + khán giả
  const cp = [];
  for (const side of [-1, 1]) { for (const xc of [-8.5, 0, 8.5]) { const b = bleacher(7.6, 3); b.position.set(xc, 0, side * (GD.W / 2 + 2.3)); b.rotation.y = side > 0 ? Math.PI : 0; scene.add(b);
      for (let k = 0; k < 3; k++) for (let x = -3.5; x <= 3.5; x += 0.62) { if (r() > 0.88) continue; cp.push([xc + x + (r() - 0.5) * 0.08, k * 0.45 + 0.04, side * (GD.W / 2 + 2.3 + k * 0.7), side > 0 ? Math.PI : 0]); } } }
  for (let i = 0; i < 50; i++) { const side = i % 2 ? 1 : -1; const z = (r() - 0.5) * 7; if (Math.abs(z) < 1.6) continue; const x = side * (GD.L / 2 + 4.6 + r() * 2.0); cp.push([x, -0.05, z, side > 0 ? -Math.PI / 2 : Math.PI / 2]); }
  const CR = crowd(scene, cp);
  const SB = trellisBoard(); SB.position.set(0, 0, -(GD.W / 2 + 5.0)); scene.add(SB);
  const PC = petalCarpet(scene);
  const update = (t) => { CR.U.uT.value = t; };
  return { hoops, sbTex: SB.userData.tex, SB, CR, update, PC, hedges };
}

export function gardenLights(scene) {
  const hemi = new THREE.HemisphereLight('#dbe9ff', '#9fbf7a', 2.0); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff6e8', 3.0); key.position.set(-18, 26, 16); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 16, bottom: -16, near: 1, far: 90 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key); scene.add(key.target);
  const rim = new THREE.DirectionalLight('#ffe8f0', 0.9); rim.position.set(20, 12, -20); scene.add(rim);
  return { hemi, key, rim };
}

// ---------- đạo cụ ----------
// giậu di động trên bánh xe (gốc = giữa đáy)
export function rollingHedge() {
  const G = new THREE.Group(); const h = hedge(1.4, 1.9, 0.9); h.position.y = 0.16; G.add(h);
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.0), std('#6b4a2e')); base.position.y = 0.13; G.add(base);
  for (const [x, z] of [[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), std('#222')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.08, z); G.add(w); }
  for (let i = 0; i < 8; i++) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 1), std(ROSE[i % 3], { roughness: 0.5 })); f.position.set(-0.55 + i * 0.16, 1.4 + (i % 2) * 0.4, 0.46); G.add(f); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// máy cắt cỏ ngồi lái khổng lồ (gốc = giữa đáy, mũi hướng +z); userData.seat = điểm ngồi, wheel = vô lăng
export function lawnMower(color = '#0a7cc4') {
  const G = new THREE.Group(); const body = std(color, { roughness: 0.4, metalness: 0.2 }), blk = std('#1c1c1c', { roughness: 0.6 }), yel = std('#ffd23f', { roughness: 0.4 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.28, 1.5), blk); deck.position.set(0, 0.32, 0.25); G.add(deck);
  const ch = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 2.4), body); ch.position.set(0, 0.75, 0); G.add(ch);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 1.0), body); hood.position.set(0, 1.18, 0.75); hood.rotation.x = 0.12; G.add(hood);
  const grille = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.04), yel); grille.position.set(0, 0.95, 1.22); G.add(grille);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.16, 0.65), std('#2a2a2a')); seat.position.set(0, 1.1, -0.65); G.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.6, 0.12), std('#2a2a2a')); back.position.set(0, 1.45, -0.98); G.add(back);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), blk); col.position.set(0, 1.45, 0.05); col.rotation.x = -0.5; G.add(col);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 20), blk); wheel.position.set(0, 1.78, -0.12); wheel.rotation.x = Math.PI / 2 - 0.5; G.add(wheel);
  const wh = []; for (const [x, z, rr] of [[-0.78, -0.75, 0.48], [0.78, -0.75, 0.48], [-0.72, 0.85, 0.32], [0.72, 0.85, 0.32]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.32, 18), blk); w.rotation.z = Math.PI / 2; w.position.set(x, rr, z); G.add(w); wh.push(w);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.45, rr * 0.45, 0.34, 12), yel); hub.rotation.z = Math.PI / 2; hub.position.set(x, rr, z); G.add(hub); }
  const lights = [-0.35, 0.35].map((x) => { const l = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), new THREE.MeshBasicMaterial({ color: '#fff7d0', toneMapped: false })); l.position.set(x, 1.2, 1.25); G.add(l); return l; });
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const seatP = new THREE.Object3D(); seatP.position.set(0, 1.18, -0.62); G.add(seatP); const wP = new THREE.Object3D(); wP.position.copy(wheel.position); G.add(wP);
  G.userData = { seat: seatP, wheel: wP, wheels: wh }; return G;
}
// bình tưới (gốc = quai cầm)
export function wateringCan(color = '#2fa36b') {
  const G = new THREE.Group(); const m = std(color, { roughness: 0.4, metalness: 0.3 });
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.3, 16), m); b.position.set(0, -0.25, 0); G.add(b);
  const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.42, 8), m); sp.position.set(0, -0.2, 0.26); sp.rotation.x = 1.0; G.add(sp);
  const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.05, 12), m); rose.position.set(0, -0.08, 0.44); rose.rotation.x = 1.0; G.add(rose);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 6, 16, Math.PI), m); h.position.set(0, -0.1, -0.02); h.rotation.y = Math.PI / 2; G.add(h);
  const tip = new THREE.Object3D(); tip.position.set(0, -0.08, 0.46); G.add(tip);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); G.userData.tip = tip; return G;
}
// kéo tỉa cành lớn (gốc = tay cầm)
export function shears() {
  const G = new THREE.Group(); const red = std('#c8102e', { roughness: 0.5 }), steel = std('#c9d1d9', { metalness: 0.8, roughness: 0.3 });
  const A = new THREE.Group(), B = new THREE.Group(); G.add(A); G.add(B);
  for (const [g, s] of [[A, 1], [B, -1]]) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), red); h.rotation.x = Math.PI / 2; h.position.set(s * 0.05, 0, 0.0); g.add(h);
    const bl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.3), steel); bl.position.set(-s * 0.02, 0, 0.32); g.add(bl); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); G.userData = { A, B }; return G;
}
// chậu xương rồng
export function cactusPot() {
  const G = new THREE.Group(); const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.25, 16), std('#c46a3a', { roughness: 0.8 })); pot.position.y = 0.125; G.add(pot);
  const gm = std('#3c8a3e', { roughness: 0.7 });
  const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.4, 6, 12), gm); c.position.y = 0.5; G.add(c);
  for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.14, 4, 8), gm); a.position.set(s * 0.15, 0.55 + s * 0.06, 0); G.add(a); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.08, 4, 8), gm); b.rotation.z = Math.PI / 2; b.position.set(s * 0.11, 0.45 + s * 0.06, 0); G.add(b); }
  const fl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 1), std('#ff6f9c')); fl.position.y = 0.82; G.add(fl);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// mưa cánh hoa (Points) — tick(t, cx, cz)
export function petalRain(scene, N = 2500, box = [30, 12, 24]) {
  const g = new THREE.BufferGeometry(); const p0 = new Float32Array(N * 4), pos = new Float32Array(N * 3), colA = new Float32Array(N * 3); const r = rnd(9); const c = new THREE.Color(); const COL = ['#ff6f9c', '#e0245e', '#ffffff', '#ff8fb1', '#ffd23f'];
  for (let i = 0; i < N; i++) { p0[i * 4] = (r() - 0.5) * box[0]; p0[i * 4 + 1] = r() * box[1]; p0[i * 4 + 2] = (r() - 0.5) * box[2]; p0[i * 4 + 3] = r() * 6.28; c.set(COL[i % COL.length]); colA.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colA, 3));
  const sprite = canvasTex(32, 32, (cx) => { cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(16, 16, 14, 8, 0.5, 0, 6.28); cx.fill(); });
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.09, map: sprite, vertexColors: true, transparent: true, alphaTest: 0.3, depthWrite: false, sizeAttenuation: true }));
  pts.frustumCulled = false; scene.add(pts);
  const tick = (t, cx = 0, cz = 0, up = 0) => { for (let i = 0; i < N; i++) { const ph = p0[i * 4 + 3], sp = 0.5 + (ph % 1) * 0.5;
      let y = p0[i * 4 + 1] + (up ? t * sp * 2.5 : -t * sp); y = ((y % box[1]) + box[1]) % box[1];
      pos[i * 3] = cx + p0[i * 4] + Math.sin(t * 1.3 + ph) * 0.6 + t * 0.3; pos[i * 3 + 1] = y; pos[i * 3 + 2] = cz + p0[i * 4 + 2] + Math.cos(t * 1.1 + ph) * 0.5; }
    g.attributes.position.needsUpdate = true; };
  return { pts, tick };
}
