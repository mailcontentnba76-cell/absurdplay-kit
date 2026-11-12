// E14 (NBA): SÂN BÓNG RỔ VẼ TRÊN MẶT HỒ ĐÓNG BĂNG ở Wisconsin, chiều đông nắng vàng hồng (khác E05: E05 là sân nhựa ngoài trời trời xám cạnh hồ).
// Mặt băng xanh trong có vết nứt + mảng tuyết, vạch sân sơn xanh lá đậm, rừng thông phủ tuyết quanh bờ, chòi câu cá trên băng nhiều màu,
// khán đài gỗ thấp + khán giả mặc áo parka đội mũ len, thùng lửa sưởi, bảng điểm gỗ. Đạo cụ: lỗ khoan băng, mũi khoan tay, cần câu, xẻng tuyết, mũ len.
// Sân NBA thật 28,65 × 15,24 m; rổ 3,05 m.
import * as THREE from 'three';
import { hoop, canvasTex } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const LK = { L: 28.65, W: 15.24 };

function lump(rx, ry, rz, seed = 1, seg = 18) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.6), 0, Math.PI * 2, 0, Math.PI / 2); const p = g.attributes.position; const r = rnd(seed * 97 + 3);
  const k = [r(), r(), r()].map((x) => x * 6.28);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + 0.12 * Math.sin(x * 3 + k[0]) * Math.cos(z * 2.6 + k[1]) + 0.06 * Math.sin(y * 5 + k[2]); p.setXYZ(i, x * rx * n, y * ry * n, z * rz * n); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, std('#f5f8fc', { roughness: 0.95 })); m.receiveShadow = true; m.castShadow = true; return m;
}

// ---------- mặt băng + vạch sân ----------
function iceTex() {
  const S = 60, PAD = 7, W = Math.round((LK.L + PAD * 2) * S), H = Math.round((LK.W + PAD * 2) * S);
  const t = canvasTex(W, H, (g) => {
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#bfe0f2'); gr.addColorStop(0.5, '#d6ecf7'); gr.addColorStop(1, '#b4d8ee'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const r = rnd(5);
    for (let i = 0; i < 160; i++) { const x = r() * W, y = r() * H, rr = 40 + r() * 220; const gg = g.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, `rgba(${r() < 0.5 ? '140,190,220' : '235,246,252'},0.35)`); gg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    // vết nứt
    g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 2;
    for (let i = 0; i < 70; i++) { let x = r() * W, y = r() * H, a = r() * 6.28; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 9; k++) { a += (r() - 0.5) * 1.2; x += Math.cos(a) * 30; y += Math.sin(a) * 30; g.lineTo(x, y); } g.stroke(); }
    g.strokeStyle = 'rgba(70,120,160,0.35)'; g.lineWidth = 1.5;
    for (let i = 0; i < 50; i++) { let x = r() * W, y = r() * H, a = r() * 6.28; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 7; k++) { a += (r() - 0.5) * 1.4; x += Math.cos(a) * 26; y += Math.sin(a) * 26; g.lineTo(x, y); } g.stroke(); }
    const X = (m) => W / 2 + m * S, Y = (m) => H / 2 + m * S;
    // vùng sơn kem + vòng giữa, vạch xanh lá đậm
    g.fillStyle = 'rgba(238,225,198,0.85)'; for (const d of [-1, 1]) { const bx = X(d * LK.L / 2), kx = X(d * (LK.L / 2 - 5.8)); g.fillRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S); }
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#0b4d24'; g.lineWidth = 0.08 * S;
    g.strokeRect(X(-LK.L / 2), Y(-LK.W / 2), LK.L * S, LK.W * S); g.beginPath(); g.moveTo(X(0), Y(-LK.W / 2)); g.lineTo(X(0), Y(LK.W / 2)); g.stroke();
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.stroke();
    for (const d of [-1, 1]) { const bx = X(d * LK.L / 2), kx = X(d * (LK.L / 2 - 5.8)); g.strokeRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S);
      g.beginPath(); g.arc(kx, Y(0), 1.8 * S, d > 0 ? Math.PI / 2 : -Math.PI / 2, d > 0 ? Math.PI * 1.5 : Math.PI / 2); g.stroke();
      const rx = X(d * (LK.L / 2 - 1.6)); g.beginPath(); g.moveTo(bx, Y(-6.7)); g.lineTo(X(d * (LK.L / 2 - 4.3)), Y(-6.7));
      g.arc(rx, Y(0), 7.24 * S, d > 0 ? Math.PI + 1.18 : -1.18, d > 0 ? Math.PI - 1.18 : 1.18, d > 0); g.lineTo(bx, Y(6.7)); g.stroke(); }
    // chữ giữa sân
    g.save(); g.translate(X(0), Y(0)); g.font = `900 ${0.62 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#0b4d24'; g.fillText('LAKE', 0, -0.32 * S); g.fillText('GAME', 0, 0.36 * S); g.restore();
    for (const d of [-1, 1]) { g.save(); g.translate(X(d * 9.6), Y(0)); g.rotate(d * Math.PI / 2); g.font = `900 ${0.9 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(11,77,36,0.8)'; g.fillText('WISCONSIN', 0, 0); g.restore(); }
    // tuyết rắc lốm đốm + dồn ở mép
    for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H; const inC = Math.abs(x - W / 2) < LK.L / 2 * S && Math.abs(y - H / 2) < LK.W / 2 * S; if (inC && r() < 0.85) continue; g.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.5})`; const s2 = 3 + r() * (inC ? 6 : 26); g.beginPath(); g.arc(x, y, s2, 0, 6.28); g.fill(); }
  });
  t.anisotropy = 8; return { tex: t, size: [LK.L + PAD * 2, LK.W + PAD * 2] };
}

function skyDome() {
  const tex = canvasTex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5f8fd0'); gr.addColorStop(0.42, '#a9c4e6'); gr.addColorStop(0.5, '#ffd6ae'); gr.addColorStop(0.53, '#ffc79a'); gr.addColorStop(1, '#ffe7cf'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, toneMapped: false })); return m;
}

// rừng thông phủ tuyết (instanced)
function pines(scene, seed = 9) {
  const r = rnd(seed); const N = 520; const list = [];
  for (let i = 0; i < N; i++) { const a = r() * 6.283, rr = 46 + r() * 70; const x = Math.cos(a) * rr * 1.25, z = Math.sin(a) * rr; list.push([x, z, 5 + r() * 9]); }
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.14, 0.22, 1, 6).translate(0, 0.5, 0), std('#4a3324'), N);
  const tiers = [0, 1, 2].map((k) => new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0), std(['#1e4a35', '#245a40', '#2b6a4a'][k], { roughness: 0.9 }), N));
  const caps = [0, 1, 2].map(() => new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0), std('#f7fbff', { roughness: 0.95 }), N));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  list.forEach(([x, z, h], i) => { m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, h * 0.25, 1)); trunk.setMatrixAt(i, m);
    for (let k = 0; k < 3; k++) { const rad = h * (0.36 - k * 0.08), y0 = h * (0.18 + k * 0.24), hh = h * (0.42 - k * 0.04);
      m.compose(new THREE.Vector3(x, y0, z), q, new THREE.Vector3(rad, hh, rad)); tiers[k].setMatrixAt(i, m);
      m.compose(new THREE.Vector3(x, y0 + hh * 0.45, z), q, new THREE.Vector3(rad * 0.62, hh * 0.56, rad * 0.62)); caps[k].setMatrixAt(i, m); } });
  [trunk, ...tiers, ...caps].forEach((x) => { x.castShadow = false; x.receiveShadow = true; scene.add(x); });
  // đồi tuyết xa
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; const h = lump(60 + r() * 40, 10 + r() * 14, 40, 70 + i, 14); h.position.set(Math.cos(a) * 230, -2, Math.sin(a) * 200); scene.add(h); }
}

// chòi câu cá trên băng
export function iceHut(color = '#c0392b', seed = 1) {
  const G = new THREE.Group(); const r = rnd(seed + 5);
  const wall = std(color, { roughness: 0.7 }), trim = std('#f4efe6'), roofM = std('#3a3f46', { roughness: 0.6, metalness: 0.3 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.9, 1.7), wall); b.position.y = 0.95; G.add(b);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.1, 1.95), roofM); roof.position.set(0, 2.0, 0); roof.rotation.z = 0.12; G.add(roof);
  const snowR = lump(1.05, 0.14, 0.9, seed + 40, 12); snowR.position.set(0, 2.05, 0); snowR.rotation.z = 0.12; G.add(snowR);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.04), std('#5a3d26')); door.position.set(-0.4, 0.75, 0.86); G.add(door);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.35), new THREE.MeshBasicMaterial({ color: '#ffd28a', toneMapped: false })); win.position.set(0.5, 1.25, 0.861); G.add(win);
  const wf = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.03), trim); wf.position.set(0.5, 1.25, 0.85); G.add(wf);
  const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8), std('#2a2a2a', { metalness: 0.6 })); ch.position.set(0.6, 2.3, -0.4); G.add(ch);
  for (const [x, z] of [[-1, -0.85], [1, -0.85], [-1, 0.85], [1, 0.85]]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.9, 0.08), trim); c.position.set(x, 0.95, z); G.add(c); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.userData.chimney = ch; return G;
}

function bleacher(len, rows = 3) {
  const G = new THREE.Group(); const wood = std('#8a6440', { roughness: 0.85 }), wood2 = std('#6b4a2e');
  for (let k = 0; k < rows; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.5), wood); s.position.set(0, 0.42 + k * 0.45, -k * 0.7); G.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.35), wood2); f.position.set(0, 0.1 + k * 0.45, -k * 0.7 + 0.42); G.add(f);
    const sn = lump(len * 0.5, 0.05, 0.22, 90 + k, 10); sn.position.set(0, 0.46 + k * 0.45, -k * 0.7 - 0.05); sn.scale.x = 1; G.add(sn); }
  for (let x = -len / 2; x <= len / 2 + 0.01; x += len / 8) for (let k = 0; k < rows; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42 + k * 0.45, 0.1), wood2); p.position.set(x, (0.42 + k * 0.45) / 2, -k * 0.7); G.add(p); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

// thùng lửa sưởi
function fireBarrel() {
  const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.85, 14, 1, true), std('#5b4636', { metalness: 0.5, roughness: 0.6, side: THREE.DoubleSide })); b.position.y = 0.42; G.add(b);
  const fl = []; for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.16 - i * 0.02, 0.5, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb030' : '#ff6a1a', transparent: true, opacity: 0.9, toneMapped: false })); f.position.set((i - 1.5) * 0.08, 1.0, (i % 2 - 0.5) * 0.1); G.add(f); fl.push(f); }
  const L = new THREE.PointLight('#ff9a40', 6, 9, 1.8); L.position.y = 1.3; G.add(L); G.userData = { fl, L }; return G;
}

// bảng điểm gỗ (canvas)
function woodBoard() {
  const G = new THREE.Group(); const tex = canvasTex(1024, 560, (g, W, H) => { g.fillStyle = '#10261a'; g.fillRect(0, 0, W, H); });
  const wood = std('#7a5534', { roughness: 0.85 });
  for (const x of [-2.4, 2.4]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.4, 0.22), wood); p.position.set(x, 2.7, -0.1); G.add(p); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.1, 0.24), wood); fr.position.set(0, 4.4, -0.12); G.add(fr);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.73), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); sc.position.set(0, 4.4, 0.01); G.add(sc);
  const cap = lump(2.8, 0.22, 0.25, 33, 14); cap.position.set(0, 5.95, -0.1); G.add(cap);
  G.traverse((o) => { if (o.isMesh && o !== sc) o.castShadow = true; }); G.userData.tex = tex; return G;
}

// khán giả gộp 1 lưới (áo parka + mũ len có quả bông), tay vẫy theo uCheer; p = [x, y, z, yaw]
function crowd(scene, list) {
  let rs = 23; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const torsoG = box(0.5, 0.5, 0.34, 0, 0.72, -0.02), headG = new THREE.IcosahedronGeometry(0.13, 1).translate(0, 1.12, 0).toNonIndexed(), legG = box(0.42, 0.16, 0.44, 0, 0.5, 0.18), armG = box(0.13, 0.42, 0.13, 0, -0.2, 0);
  const eyeG = new THREE.IcosahedronGeometry(0.045, 0).toNonIndexed(), pupG = new THREE.IcosahedronGeometry(0.022, 0).toNonIndexed();
  const hatG = new THREE.SphereGeometry(0.145, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1.1, 1).translate(0, 1.15, -0.01).toNonIndexed(), pomG = new THREE.IcosahedronGeometry(0.055, 0).translate(0, 1.33, 0).toNonIndexed();
  const scarfG = box(0.36, 0.09, 0.3, 0, 0.99, 0);
  const coats = ['#00471B', '#EEE1C6', '#0b4d24', '#c0392b', '#2c5aa0', '#f2b134', '#00471B', '#6a3d9a', '#e8e3d6', '#1d6b3f', '#d35400', '#00471B'];
  const hats = ['#00471B', '#EEE1C6', '#c0392b', '#f2b134', '#2c5aa0', '#ffffff', '#00471B'];
  const skins = ['#f1c9a5', '#d6a47a', '#b57e55', '#c99266', '#e8b98f'];
  const P = [], C = [], CP = [], PV = [], FX = []; const v = new THREE.Vector3(), col = new THREE.Color();
  const add = (geo, m, color, cp, piv, fax) => { col.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count;
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(col.r, col.g, col.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); FX.push(fax.x, fax.y, fax.z); } };
  for (const [x, y, z, yaw] of list) { const m = new THREE.Matrix4().makeRotationY(yaw).premultiply(new THREE.Matrix4().makeTranslation(x, y, z)); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)); const fax = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const rr = R(), coat = coats[Math.floor(R() * coats.length)], hat = hats[Math.floor(R() * hats.length)], skin = skins[Math.floor(R() * skins.length)]; const ph = rr * 40, am = 0.55 + 0.45 * ((rr * 7.3) % 1); const zero = new THREE.Vector3();
    const B = [1, ph, am, 0], Hd = [1.5, ph, am, 0];
    add(torsoG, m, coat, B, zero, fax); add(headG, m, skin, Hd, zero, fax); add(legG, m, '#2b2f3a', [0, 0, 0, 0], zero, zero); add(scarfG, m, hat, B, zero, fax);
    add(hatG, m, hat, Hd, zero, fax); add(pomG, m, '#ffffff', Hd, zero, fax);
    for (const sx of [-1, 1]) { const T = (gx, gy, gz) => new THREE.Matrix4().makeTranslation(gx, gy, gz).premultiply(m); add(eyeG, T(sx * 0.05, 1.12, 0.1), '#ffffff', Hd, zero, fax); add(pupG, T(sx * 0.05, 1.12, 0.14), '#111111', Hd, zero, fax); }
    for (const sx of [-1, 1]) { const off = new THREE.Vector3(sx * 0.31, 0.94, -0.02); const sh = off.clone().applyMatrix4(m); const am4 = new THREE.Matrix4().makeTranslation(off.x, off.y, off.z).premultiply(m);
      const ow = off.clone().setY(0).applyQuaternion(q); const d = new THREE.Vector3(0, -1, 0), sgn = Math.sign(new THREE.Vector3().crossVectors(fax, d).dot(ow)) || 1; add(armG, am4, coat, [sgn > 0 ? 2 : 3, ph, am, 0], sh, fax); } }
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
  mat.customProgramCacheKey = () => 'lakecrowd';
  const all = new THREE.Mesh(geo, mat); all.frustumCulled = false; all.castShadow = true; all.receiveShadow = true; scene.add(all);
  return { U, count: list.length };
}

export function buildLake(scene) {
  scene.background = new THREE.Color('#ffd9b5'); scene.fog = new THREE.Fog('#f3dccb', 70, 420); scene.add(skyDome());
  const it = iceTex();
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(it.size[0], it.size[1]), new THREE.MeshStandardMaterial({ map: it.tex, roughness: 0.16, metalness: 0.08 })); ice.rotation.x = -Math.PI / 2; ice.position.y = 0.001; ice.receiveShadow = true; scene.add(ice);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), std('#d3e6f2', { roughness: 0.25, metalness: 0.05 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.01; outer.receiveShadow = true; scene.add(outer);
  // vệt tuyết trên băng ngoài sân
  const r = rnd(13); for (let i = 0; i < 60; i++) { const a = r() * 6.28, d = 24 + r() * 30; const m = lump(2 + r() * 5, 0.06 + r() * 0.12, 1 + r() * 3, 200 + i, 12); m.position.set(Math.cos(a) * d * 1.3, 0, Math.sin(a) * d); m.rotation.y = r() * 3; m.castShadow = false; scene.add(m); }
  pines(scene);
  // rổ: trụ thép, đệm xanh lá; tuyết đọng nóc bảng
  const hoops = [hoop(1, { pad: '#0b4d24' }), hoop(-1, { pad: '#0b4d24' })]; hoops[0].position.set(LK.L / 2 - 1.22, 0, 0); hoops[1].position.set(-(LK.L / 2 - 1.22), 0, 0);
  hoops.forEach((h, i) => { const c = lump(0.12, 0.07, 0.95, 20 + i, 12); c.position.set(0, 4.25, 0); h.add(c); scene.add(h); });
  // đống tuyết dọc biên (dọn từ mặt sân)
  for (let i = 0; i < 40; i++) { const side = i % 2 ? 1 : -1; const x = -LK.L / 2 - 1 + (i >> 1) / 19 * (LK.L + 2); const m = lump(0.9 + r() * 0.8, 0.25 + r() * 0.3, 0.6 + r() * 0.4, 300 + i, 12); m.position.set(x, 0, side * (LK.W / 2 + 0.9 + r() * 0.3)); scene.add(m); }
  // khán đài gỗ 2 bên dọc + khán giả
  const cp = [];
  for (const side of [-1, 1]) { for (const xc of [-8.5, 0, 8.5]) { const b = bleacher(7.6, 3); b.position.set(xc, 0, side * (LK.W / 2 + 2.3)); b.rotation.y = side > 0 ? Math.PI : 0; scene.add(b);
      for (let k = 0; k < 3; k++) for (let x = -3.5; x <= 3.5; x += 0.62) { if (r() > 0.86) continue; cp.push([xc + x + (r() - 0.5) * 0.08, k * 0.45 + 0.04, side * (LK.W / 2 + 2.3 + k * 0.7), side > 0 ? Math.PI : 0]); } } }
  // đứng quanh chòi + đứng cuối sân
  for (let i = 0; i < 70; i++) { const side = i % 2 ? 1 : -1; const z = (r() - 0.5) * 14; const x = side * (LK.L / 2 + 3.2 + r() * 2.5); cp.push([x, -0.05, z, side > 0 ? -Math.PI / 2 : Math.PI / 2]); }
  const CR = crowd(scene, cp);
  // chòi câu cá
  const huts = []; const HC = ['#c0392b', '#2c5aa0', '#f2b134', '#1d6b3f', '#d35400', '#8e44ad', '#16a085', '#c0392b', '#2c5aa0', '#f2b134'];
  [[-12, -15.5], [-4, -16.5], [5, -15.8], [13, -16.2], [-13, 15.8], [-3.5, 16.6], [6, 15.9], [14, 16.4], [-22, 4], [22, -5], [-20, -8], [21, 8]].forEach(([x, z], i) => { const h = iceHut(HC[i % HC.length], i); h.position.set(x, 0, z); h.rotation.y = Math.atan2(-x, -z) + (r() - 0.5) * 0.5; scene.add(h); huts.push(h); });
  // thùng lửa
  const fires = [[-15.6, -6.5], [15.6, 6.5], [-15.6, 6.5], [15.6, -6.5]].map(([x, z]) => { const f = fireBarrel(); f.position.set(x, 0, z); scene.add(f); return f; });
  // bảng điểm gỗ cao sau khán đài -z
  const SB = woodBoard(); SB.position.set(0, 0, -(LK.W / 2 + 5.0)); scene.add(SB);
  const update = (t) => { CR.U.uT.value = t; fires.forEach((f, i) => { f.userData.fl.forEach((m, k) => { const s = 0.8 + 0.35 * Math.sin(t * (9 + k) + i * 2 + k); m.scale.set(1, s, 1); }); f.userData.L.intensity = 5 + 1.5 * Math.sin(t * 13 + i); }); };
  return { hoops, sbTex: SB.userData.tex, SB, huts, fires, CR, update, ice };
}

export function lakeLights(scene) {
  const hemi = new THREE.HemisphereLight('#d9e6ff', '#f6efe6', 2.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff0dc', 3.0); key.position.set(-26, 16, 18); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 16, bottom: -16, near: 1, far: 90 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key); scene.add(key.target);
  const rim = new THREE.DirectionalLight('#b8ccff', 1.0); rim.position.set(20, 12, -20); scene.add(rim);
  return { hemi, key, rim };
}

// ---------- đạo cụ ----------
export function iceHole() { // lỗ khoan: đĩa nước tối + vòng đá vụn
  const G = new THREE.Group(); const w = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), std('#0d2a3a', { roughness: 0.05, metalness: 0.3 })); w.rotation.x = -Math.PI / 2; w.position.y = 0.006; G.add(w);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 24), std('#e8f4fb', { roughness: 0.4 })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.01; G.add(ring);
  const r = rnd(4); const chips = []; for (let i = 0; i < 26; i++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(0.02 + r() * 0.025, 0), std('#f4fbff', { roughness: 0.3 })); const a = r() * 6.28, d = 0.25 + r() * 0.35; c.position.set(Math.cos(a) * d, 0.015, Math.sin(a) * d); c.userData.p = [a, d, r()]; G.add(c); chips.push(c); }
  G.userData.chips = chips; G.userData.water = w; return G;
}
export function auger() { // mũi khoan tay: tay quay chữ Z + trục + lưỡi xoắn; gốc (0,0,0) = mũi khoan, trục hướng +y
  const G = new THREE.Group(); const metal = std('#b9c2cc', { metalness: 0.8, roughness: 0.3 }), red = std('#c0392b', { roughness: 0.5 });
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8), metal); sh.position.y = 0.55; G.add(sh);
  const sp = new THREE.Group(); G.add(sp); for (let i = 0; i < 18; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.04), metal); b.position.y = 0.04 + i * 0.022; b.rotation.y = i * 0.6; sp.add(b); }
  const crank = new THREE.Group(); crank.position.y = 1.1; G.add(crank);
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 8), red); c1.rotation.z = Math.PI / 2; c1.position.x = 0.17; crank.add(c1);
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), std('#222')); c2.position.set(0.34, 0.07, 0); crank.add(c2);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8), std('#222')); top.position.y = 1.18; G.add(top);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); G.userData = { crank, sp, handle: c2, top }; return G;
}
export function fishingRod() { // cần câu ngắn: gốc = tay cầm, cần hướng +z; dây thả từ ngọn
  const G = new THREE.Group(); const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.018, 0.9, 6), std('#1b1b1b', { roughness: 0.4 })); rod.rotation.x = Math.PI / 2; rod.position.z = 0.45; G.add(rod);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.2, 8), std('#c0392b')); grip.rotation.x = Math.PI / 2; grip.position.z = -0.02; G.add(grip);
  const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), std('#d4d4d4', { metalness: 0.7, roughness: 0.3 })); reel.position.set(0, -0.04, 0.1); G.add(reel);
  const tip = new THREE.Object3D(); tip.position.z = 0.9; G.add(tip);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, -1, 0)]), new THREE.LineBasicMaterial({ color: '#ffffff' })); line.frustumCulled = false; G.userData = { tip, line }; return G;
}
export function shovel(color = '#f2b134') { // xẻng tuyết: gốc = tay cầm trên, cán hướng -y
  const G = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 8), std('#2a2a2a')); h.position.y = -0.6; G.add(h);
  const tg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.035), std('#2a2a2a')); G.add(tg);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.03), std(color, { roughness: 0.5 })); blade.position.set(0, -1.32, 0.03); blade.rotation.x = 0.35; G.add(blade);
  const sn = lump(0.2, 0.06, 0.1, 55, 10); sn.position.set(0, -1.28, 0.1); sn.rotation.x = 0.35 - Math.PI / 2; G.add(sn); G.userData.snow = sn;
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// mũ len gắn đầu (dựng ở toạ độ thế giới tư thế nghỉ rồi bone.attach — không add vào root trước, tránh nhân tỉ lệ root)
export function addBeanie(ch, color = '#00471B', pom = '#EEE1C6') {
  ch.root.updateMatrixWorld(true); const hb = ch.bones.Head; const hp = hb.getWorldPosition(new THREE.Vector3());
  const S = ch.root.scale.y;
  const G = new THREE.Group(); const m = std(color, { roughness: 0.95 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.122 * S, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), m); cap.scale.set(1, 1.05, 1.1); G.add(cap);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.126 * S, 0.126 * S, 0.045 * S, 18, 1, true), std(pom, { roughness: 0.95, side: THREE.DoubleSide })); band.scale.set(1, 1, 1.1); band.position.y = 0.012 * S; G.add(band);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.04 * S, 10, 8), std(pom, { roughness: 1 })); p.position.y = 0.14 * S; G.add(p);
  G.position.set(hp.x, hp.y + 0.165 * S, hp.z - 0.012 * S); G.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  G.updateMatrixWorld(true); hb.attach(G); ch.beanie = G; return G;
}
// hơi thở (khói trắng) — vài bóng mờ bay ra trước miệng
export function breath() {
  const G = new THREE.Group(); const tx = canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  for (let i = 0; i < 6; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, opacity: 0 })); G.add(s); }
  G.userData.update = (t, mouth, fwd, k = 1) => { G.children.forEach((s, i) => { const ph = ((t * 0.9 + i / 6) % 1); const pulse = 0.5 + 0.5 * Math.sin(t * 2.4); const p = mouth.clone().addScaledVector(fwd, 0.05 + ph * 0.45); p.y += ph * 0.08;
      s.position.copy(p); s.scale.setScalar(0.05 + ph * 0.25); s.material.opacity = k * (1 - ph) * 0.55 * pulse; }); };
  return G;
}
