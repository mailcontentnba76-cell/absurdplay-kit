// E16 (NBA): SÂN BÓNG RỔ BÊN TRONG KHU ARCADE NEON KHỔNG LỒ — sàn LED tím than, vạch xanh cyan phát sáng, vùng sơn hồng neon,
// màn hình điểm khổng lồ kiểu máy game (canvas, có scanline) đặt trong khung tủ arcade, bàn điều khiển cần gạt + nút bấm cỡ lớn,
// dãy tủ máy game màn hình pixel, máy gắp thú, cột neon, ống đèn neon trên trần, khán đài + khán giả mặt hoạt hình đội mũ lưỡi trai.
// Đạo cụ: bàn điều khiển (nút bấm nhún), đồng xu vàng khổng lồ, bục xoay chọn nhân vật, mảnh pixel văng.
// Sân NBA thật 28,65 × 15,24 m; rổ 3,05 m.
import * as THREE from 'three';
import { hoop, canvasTex } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6 }, o));
const glow = (c, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const AD = { L: 28.65, W: 15.24 };
export const NEON = ['#3ff5ff', '#ff2e88', '#ffe14d', '#7cff4f', '#b06bff', '#ff8a3d'];

// ---------- sàn LED + vạch neon ----------
function courtTex() {
  const S = 60, PAD = 2, W = Math.round((AD.L + PAD * 2) * S), H = Math.round((AD.W + PAD * 2) * S);
  const t = canvasTex(W, H, (g) => {
    g.fillStyle = '#3a2a86'; g.fillRect(0, 0, W, H);
    const r = rnd(5); const c = 0.5 * S; for (let y = 0; y < H; y += c) for (let x = 0; x < W; x += c) { const v = r(); g.fillStyle = `rgba(${120 + v * 60 | 0},${90 + v * 50 | 0},255,${0.06 + v * 0.08})`; g.fillRect(x + 2, y + 2, c - 4, c - 4); }
    const X = (m) => W / 2 + m * S, Y = (m) => H / 2 + m * S;
    g.fillStyle = '#1a1240'; g.fillRect(0, 0, W, Y(-AD.W / 2)); g.fillRect(0, Y(AD.W / 2), W, H); g.fillRect(0, 0, X(-AD.L / 2), H); g.fillRect(X(AD.L / 2), 0, W, H);
    g.fillStyle = 'rgba(255,46,136,0.82)'; for (const d of [-1, 1]) { const bx = X(d * AD.L / 2), kx = X(d * (AD.L / 2 - 5.8)); g.fillRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S); }
    g.fillStyle = 'rgba(63,245,255,0.35)'; g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.fill();
    g.shadowColor = '#3ff5ff'; g.shadowBlur = 18; g.strokeStyle = '#7ffaff'; g.lineWidth = 0.09 * S;
    g.strokeRect(X(-AD.L / 2), Y(-AD.W / 2), AD.L * S, AD.W * S); g.beginPath(); g.moveTo(X(0), Y(-AD.W / 2)); g.lineTo(X(0), Y(AD.W / 2)); g.stroke();
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.stroke();
    for (const d of [-1, 1]) { const bx = X(d * AD.L / 2), kx = X(d * (AD.L / 2 - 5.8)); g.strokeRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S);
      g.beginPath(); g.arc(kx, Y(0), 1.8 * S, d > 0 ? Math.PI / 2 : -Math.PI / 2, d > 0 ? Math.PI * 1.5 : Math.PI / 2); g.stroke();
      const rx = X(d * (AD.L / 2 - 1.6)); g.beginPath(); g.moveTo(bx, Y(-6.7)); g.lineTo(X(d * (AD.L / 2 - 4.3)), Y(-6.7));
      g.arc(rx, Y(0), 7.24 * S, d > 0 ? Math.PI + 1.18 : -1.18, d > 0 ? Math.PI - 1.18 : 1.18, d > 0); g.lineTo(bx, Y(6.7)); g.stroke(); }
    g.shadowBlur = 0;
    g.save(); g.translate(X(0), Y(0)); g.font = `900 ${0.5 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText('PRESS', 0, -0.3 * S); g.fillText('START', 0, 0.3 * S); g.restore();
    for (const [d, txt] of [[-1, 'PLAYER 1'], [1, 'PLAYER 2']]) { g.save(); g.translate(X(d * 9.6), Y(0)); g.rotate(d * Math.PI / 2); g.font = `900 ${0.9 * S}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(255,225,77,0.7)'; g.fillText(txt, 0, 0); g.restore(); }
  });
  t.anisotropy = 8; return { tex: t, size: [AD.L + PAD * 2, AD.W + PAD * 2] };
}

// màn hình pixel cho tủ máy game (3 mẫu dùng chung)
const PIX = [0, 1, 2].map((k) => canvasTex(64, 48, (g, W, H) => { const r = rnd(70 + k); g.fillStyle = ['#05031a', '#001a10', '#1a0010'][k]; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { g.fillStyle = NEON[Math.floor(r() * NEON.length)]; const s = 2 + Math.floor(r() * 3); g.fillRect(Math.floor(r() * W / s) * s, Math.floor(r() * H / s) * s, s, s); }
  g.fillStyle = '#ffffff'; g.fillRect(8, H - 8, 20, 3); g.fillStyle = NEON[k]; g.fillRect(28, 6, 10, 10); g.fillRect(24, 10, 18, 4); }));
PIX.forEach((t) => { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; });

function cabinet(i) {
  const G = new THREE.Group(); const body = std(['#2b1a66', '#14143d', '#3a0f4a', '#0f2a4a'][i % 4], { roughness: 0.5 }), ac = NEON[i % NEON.length];
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.9, 0.85), body); b.position.y = 0.95; G.add(b);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.5), new THREE.MeshBasicMaterial({ map: PIX[i % 3], toneMapped: false })); scr.position.set(0, 1.42, 0.43); scr.rotation.x = -0.12; G.add(scr);
  const mq = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.22, 0.2), glow(ac, 1.1)); mq.position.set(0, 1.98, 0.36); G.add(mq);
  const cp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.42), std('#111122')); cp.position.set(0, 1.02, 0.55); cp.rotation.x = 0.25; G.add(cp);
  for (const [x, c] of [[-0.22, '#ff2e88'], [0.12, '#3ff5ff'], [0.26, '#ffe14d']]) { const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 10), glow(c)); bt.position.set(x, 1.1, 0.6); G.add(bt); }
  for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.7, 0.02), glow(ac, 0.9)); st.position.set(s * 0.46, 1.0, 0.43); G.add(st); }
  G.traverse((o) => { if (o.isMesh && o.material.isMeshStandardMaterial) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

function clawMachine(seed) {
  const G = new THREE.Group(); const r = rnd(seed); const fr = std('#ff2e88', { roughness: 0.4, metalness: 0.3 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 1.3), fr); base.position.y = 0.45; G.add(base);
  for (const [x, z] of [[-0.62, -0.62], [0.62, -0.62], [-0.62, 0.62], [0.62, 0.62]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.06), fr); p.position.set(x, 1.55, z); G.add(p); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), fr); top.position.y = 2.35; G.add(top);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.3, 1.22), new THREE.MeshStandardMaterial({ color: '#bfefff', transparent: true, opacity: 0.18, roughness: 0.05, depthWrite: false })); glass.position.y = 1.55; G.add(glass);
  for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11 + r() * 0.05, 1), std(NEON[i % NEON.length], { roughness: 0.9 })); m.position.set((r() - 0.5) * 1.0, 0.98 + r() * 0.25, (r() - 0.5) * 1.0); G.add(m); }
  const claw = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 6), std('#c9d1d9', { metalness: 0.8, roughness: 0.3 })); claw.position.set(0.1, 1.9, 0); claw.rotation.x = Math.PI; G.add(claw);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.04), glow('#ffe14d')); sign.position.set(0, 2.35, 0.67); G.add(sign);
  G.traverse((o) => { if (o.isMesh && o !== glass && o.material.isMeshStandardMaterial) o.castShadow = true; }); return G;
}

function bleacher(len, rows = 3) {
  const G = new THREE.Group(); const m1 = std('#26204a', { roughness: 0.5 }), m2 = std('#151030');
  for (let k = 0; k < rows; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.5), m1); s.position.set(0, 0.42 + k * 0.45, -k * 0.7); G.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.35), m2); f.position.set(0, 0.1 + k * 0.45, -k * 0.7 + 0.42); G.add(f);
    const led = new THREE.Mesh(new THREE.BoxGeometry(len, 0.03, 0.03), glow(k % 2 ? '#ff2e88' : '#3ff5ff')); led.position.set(0, 0.36 + k * 0.45, -k * 0.7 + 0.26); G.add(led); }
  for (let x = -len / 2; x <= len / 2 + 0.01; x += len / 8) for (let k = 0; k < rows; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42 + k * 0.45, 0.1), m2); p.position.set(x, (0.42 + k * 0.45) / 2, -k * 0.7); G.add(p); }
  G.traverse((o) => { if (o.isMesh && o.material.isMeshStandardMaterial) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

// màn hình điểm khổng lồ trong khung tủ arcade (canvas 1024x878 → 5,6 x 4,8 m — vừa khung dọc 9:16)
function bigScreen() {
  const G = new THREE.Group(); const tex = canvasTex(1024, 878, (g, W, H) => { g.fillStyle = '#05031a'; g.fillRect(0, 0, W, H); });
  const body = std('#2b1a66', { roughness: 0.45 });
  const fr = new THREE.Mesh(new THREE.BoxGeometry(6.6, 6.0, 1.0), body); fr.position.set(0, 5.2, -0.55); G.add(fr);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.8), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); sc.position.set(0, 5.2, 0.0); G.add(sc);
  const mq = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.1, 1.1), glow('#ff2e88', 1.0)); mq.position.set(0, 8.75, -0.5); G.add(mq);
  const mtex = canvasTex(1024, 170, (g, W, H) => { g.fillStyle = '#ff2e88'; g.fillRect(0, 0, W, H); g.font = '900 120px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText('HOOPS ARCADE', W / 2, H / 2 + 6); });
  const mqf = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 1.05), new THREE.MeshBasicMaterial({ map: mtex, toneMapped: false })); mqf.position.set(0, 8.75, 0.06); G.add(mqf);
  for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.0, 0.12), glow('#3ff5ff')); st.position.set(s * 2.95, 5.2, 0.0); G.add(st); }
  const base = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.2, 1.6), body); base.position.set(0, 1.1, -0.3); G.add(base);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.12, 0.04), glow('#ffe14d')); deck.position.set(0, 2.0, 0.51); G.add(deck);
  for (const [x, c] of [[-1.6, '#ff2e88'], [-0.6, '#3ff5ff'], [0.6, '#7cff4f'], [1.6, '#ffe14d']]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 24), glow(c)); b.rotation.x = Math.PI / 2; b.position.set(x, 1.2, 0.52); G.add(b); }
  G.traverse((o) => { if (o.isMesh && o.material.isMeshStandardMaterial) o.castShadow = true; }); G.userData.tex = tex; return G;
}

// khán giả gộp 1 lưới (áo nhiều màu + mũ lưỡi trai), tay vẫy theo uCheer; p = [x, y, z, yaw]
function crowd(scene, list) {
  let rs = 31; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const torsoG = box(0.44, 0.48, 0.3, 0, 0.72, -0.02), headG = new THREE.IcosahedronGeometry(0.13, 1).translate(0, 1.12, 0).toNonIndexed(), legG = box(0.4, 0.16, 0.44, 0, 0.5, 0.18), armG = box(0.11, 0.42, 0.11, 0, -0.2, 0);
  const eyeG = new THREE.IcosahedronGeometry(0.05, 0).toNonIndexed(), pupG = new THREE.IcosahedronGeometry(0.025, 0).toNonIndexed(), mouthG = box(0.09, 0.03, 0.02, 0, 1.04, 0.12);
  const capG = new THREE.SphereGeometry(0.14, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, 1.17, 0).toNonIndexed(), billG = box(0.2, 0.02, 0.16, 0, 1.18, 0.15);
  const coats = ['#1a3a6e', '#78BE20', '#f6f7fa', '#0064B1', '#ff2e88', '#ffe14d', '#3ff5ff', '#1a3a6e', '#b06bff', '#0064B1', '#ff8a3d', '#f6f7fa'];
  const caps = ['#ff2e88', '#3ff5ff', '#ffe14d', '#1a3a6e', '#0064B1', '#78BE20'];
  const skins = ['#f1c9a5', '#d6a47a', '#b57e55', '#8a5a3c', '#e8b98f'];
  const P = [], C = [], CP = [], PV = [], FX = []; const v = new THREE.Vector3(), col = new THREE.Color();
  const add = (geo, m, color, cp, piv, fax) => { col.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count;
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(col.r, col.g, col.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); FX.push(fax.x, fax.y, fax.z); } };
  for (const [x, y, z, yaw] of list) { const m = new THREE.Matrix4().makeRotationY(yaw).premultiply(new THREE.Matrix4().makeTranslation(x, y, z)); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)); const fax = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const rr = R(), coat = coats[Math.floor(R() * coats.length)], cap = caps[Math.floor(R() * caps.length)], skin = skins[Math.floor(R() * skins.length)]; const ph = rr * 40, am = 0.55 + 0.45 * ((rr * 7.3) % 1); const zero = new THREE.Vector3();
    const B = [1, ph, am, 0], Hd = [1.5, ph, am, 0];
    add(torsoG, m, coat, B, zero, fax); add(headG, m, skin, Hd, zero, fax); add(legG, m, '#2a2a3a', [0, 0, 0, 0], zero, zero); add(mouthG, m, '#5a1a1a', Hd, zero, fax);
    if (R() < 0.55) { add(capG, m, cap, Hd, zero, fax); add(billG, m, cap, Hd, zero, fax); }
    for (const sx of [-1, 1]) { const T = (gx, gy, gz) => new THREE.Matrix4().makeTranslation(gx, gy, gz).premultiply(m); add(eyeG, T(sx * 0.05, 1.12, 0.1), '#ffffff', Hd, zero, fax); add(pupG, T(sx * 0.05 + sx * 0.01 * (R() - 0.5), 1.12, 0.145), '#111111', Hd, zero, fax); }
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
  mat.customProgramCacheKey = () => 'arcadecrowd';
  const all = new THREE.Mesh(geo, mat); all.frustumCulled = false; all.castShadow = true; all.receiveShadow = true; scene.add(all);
  return { U, count: list.length };
}

export function buildArcade(scene) {
  scene.background = new THREE.Color('#0d0726'); scene.fog = new THREE.Fog('#160c38', 45, 170);
  const ct = courtTex();
  const court = new THREE.Mesh(new THREE.PlaneGeometry(ct.size[0], ct.size[1]), new THREE.MeshStandardMaterial({ map: ct.tex, emissiveMap: ct.tex, emissive: '#ffffff', emissiveIntensity: 0.32, roughness: 0.35, metalness: 0.05 }));
  court.rotation.x = -Math.PI / 2; court.position.y = 0.004; court.receiveShadow = true; scene.add(court);
  // sàn ngoài: lưới neon
  const ftx = canvasTex(128, 128, (g, W, H) => { g.fillStyle = '#140c33'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(176,107,255,0.55)'; g.lineWidth = 3; g.strokeRect(1, 1, W - 2, H - 2); });
  ftx.wrapS = ftx.wrapT = THREE.RepeatWrapping; ftx.repeat.set(120, 120);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ map: ftx, emissiveMap: ftx, emissive: '#ffffff', emissiveIntensity: 0.25, roughness: 0.5 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.03; floor.receiveShadow = true; scene.add(floor);
  const hoops = [hoop(1, { pad: '#ff2e88' }), hoop(-1, { pad: '#ff2e88' })]; hoops[0].position.set(AD.L / 2 - 1.22, 0, 0); hoops[1].position.set(-(AD.L / 2 - 1.22), 0, 0); hoops.forEach((h) => scene.add(h));
  const r = rnd(16);
  // khán đài 2 bên dọc + khán giả
  const cp = [];
  for (const side of [-1, 1]) for (const xc of [-8.5, 0, 8.5]) { if (side < 0 && xc === 0) continue; const b = bleacher(7.6, 3); b.position.set(xc, 0, side * (AD.W / 2 + 2.3)); b.rotation.y = side > 0 ? Math.PI : 0; scene.add(b);
    for (let k = 0; k < 3; k++) for (let x = -3.5; x <= 3.5; x += 0.62) { if (r() > 0.9) continue; cp.push([xc + x + (r() - 0.5) * 0.08, k * 0.45 + 0.04, side * (AD.W / 2 + 2.3 + k * 0.7), side > 0 ? Math.PI : 0]); } }
  for (let i = 0; i < 40; i++) { const side = i % 2 ? 1 : -1; const z = (r() - 0.5) * 8; if (Math.abs(z) < 1.8) continue; const x = side * (AD.L / 2 + 3.6 + r() * 2.0); cp.push([x, -0.05, z, side > 0 ? -Math.PI / 2 : Math.PI / 2]); }
  const CR = crowd(scene, cp);
  // màn hình điểm khổng lồ ở giữa phía −z (thay khán đài giữa)
  const SB = bigScreen(); SB.position.set(0, 0, -(AD.W / 2 + 5.0)); scene.add(SB);
  // dãy tủ máy game: sau khán đài + 2 đầu sân
  let ci = 0;
  for (const side of [-1, 1]) for (let x = -14; x <= 14; x += 1.05) { if (side < 0 && Math.abs(x) < 3.8) continue; const c = cabinet(ci++); c.position.set(x, 0, side * (AD.W / 2 + 5.4)); c.rotation.y = side > 0 ? Math.PI : 0; scene.add(c); }
  for (const d of [-1, 1]) for (let z = -6.5; z <= 6.5; z += 1.05) { if (Math.abs(z) < 2.4) continue; const c = cabinet(ci++); c.position.set(d * (AD.L / 2 + 6.8), 0, z); c.rotation.y = d > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(c); }
  // máy gắp thú ở 4 góc + lối vào
  const claws = [];
  for (const [x, z, s] of [[AD.L / 2 + 3.0, -AD.W / 2 - 2.6, 1], [-AD.L / 2 - 3.0, -AD.W / 2 - 2.6, 2], [AD.L / 2 + 3.0, AD.W / 2 + 2.6, 3], [-AD.L / 2 - 3.0, AD.W / 2 + 2.6, 4], [AD.L / 2 + 4.6, -AD.W / 2 - 2.6, 5], [-AD.L / 2 - 4.6, AD.W / 2 + 2.6, 6]]) { const c = clawMachine(s); c.position.set(x, 0, z); c.rotation.y = Math.atan2(-x, -z); scene.add(c); claws.push(c); }
  // cột neon + ống neon trần
  for (const [x, z] of [[-AD.L / 2 - 1.5, -AD.W / 2 - 1.5], [AD.L / 2 + 1.5, -AD.W / 2 - 1.5], [-AD.L / 2 - 1.5, AD.W / 2 + 1.5], [AD.L / 2 + 1.5, AD.W / 2 + 1.5]]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 14, 12), std('#1c1240')); p.position.set(x, 7, z); scene.add(p);
    for (let k = 0; k < 3; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 6, 20), glow(NEON[k])); ring.rotation.x = Math.PI / 2; ring.position.set(x, 2 + k * 4, z); scene.add(ring); } }
  for (let i = 0; i < 9; i++) { const tube = new THREE.Mesh(new THREE.BoxGeometry(44, 0.12, 0.12), glow(NEON[i % 3 === 0 ? 1 : i % 3 === 1 ? 0 : 4], 0.9)); tube.position.set(0, 16, -20 + i * 5); scene.add(tube); }
  // bảng hiệu neon treo
  const signs = [['GAME ON', '#3ff5ff', -7.5], ['HIGH SCORE', '#ffe14d', 7.5]].map(([txt, c, x]) => { const tx = canvasTex(512, 128, (g, W, H) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); g.font = '900 96px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = c; g.shadowBlur = 20; g.fillStyle = c; g.fillText(txt, W / 2, H / 2); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: tx, transparent: true, toneMapped: false })); m.position.set(x, 7.6, -(AD.W / 2 + 6.2)); scene.add(m); return m; });
  const update = (t) => { CR.U.uT.value = t; };
  return { hoops, sbTex: SB.userData.tex, SB, CR, update, claws, signs };
}

export function arcadeLights(scene) {
  const hemi = new THREE.HemisphereLight('#c9c2ff', '#3a2a6a', 2.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff4ec', 2.8); key.position.set(-10, 24, 14); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 16, bottom: -16, near: 1, far: 80 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key); scene.add(key.target);
  const rimA = new THREE.DirectionalLight('#ff4fa0', 1.3); rimA.position.set(18, 8, -16); scene.add(rimA);
  const rimB = new THREE.DirectionalLight('#4ff0ff', 1.1); rimB.position.set(-18, 8, -16); scene.add(rimB);
  return { hemi, key, rimA, rimB };
}

// ---------- đạo cụ ----------
// bàn điều khiển khổng lồ: cần gạt + 3 nút (gốc = giữa đáy, mặt trước hướng +z); userData.btn[i] nhún được, stick nghiêng được
export function bigConsole() {
  const G = new THREE.Group(); const body = std('#2b1a66', { roughness: 0.4 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.0, 1.2), body); b.position.y = 0.5; G.add(b);
  const top = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 1.3), std('#111122')); top.position.set(0, 1.04, 0.02); top.rotation.x = 0.15; G.add(top);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.08, 0.04), glow('#3ff5ff')); strip.position.set(0, 0.8, 0.61); G.add(strip);
  const stick = new THREE.Group(); stick.position.set(-0.9, 1.08, 0.05); G.add(stick);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), std('#c9d1d9', { metalness: 0.7, roughness: 0.3 })); rod.position.y = 0.3; stick.add(rod);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), std('#ff2e88', { roughness: 0.3 })); knob.position.y = 0.62; stick.add(knob);
  const btn = [['#ff2e88', 0.1], ['#ffe14d', 0.55], ['#7cff4f', 1.0]].map(([c, x]) => { const g = new THREE.Group(); g.position.set(x, 1.1, 0.05); G.add(g);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20), std('#111')); g.add(ring);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 20), glow(c)); cap.position.y = 0.07; g.add(cap); g.userData.cap = cap; return g; });
  G.traverse((o) => { if (o.isMesh && o.material.isMeshStandardMaterial) { o.castShadow = true; o.receiveShadow = true; } });
  G.userData = { stick, btn }; return G;
}
// đồng xu vàng khổng lồ (gốc = tâm, trục quay = x)
export function bigCoin(R = 0.55) {
  const tx = canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#f2c23a'; g.fillRect(0, 0, W, H); g.strokeStyle = '#b8860b'; g.lineWidth = 14; g.beginPath(); g.arc(128, 128, 104, 0, 6.29); g.stroke();
    g.font = '900 130px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#b8860b'; g.fillText('★', 128, 136); });
  const side = std('#d9a520', { metalness: 0.8, roughness: 0.3 }), face = new THREE.MeshStandardMaterial({ map: tx, metalness: 0.7, roughness: 0.3 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, R * 0.16, 40), [side, face, face]); m.rotation.z = Math.PI / 2; m.castShadow = true;
  const G = new THREE.Group(); G.add(m); return G;
}
// bục xoay chọn nhân vật (vòng neon)
export function pedestal(color = '#3ff5ff') {
  const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.3, 36), std('#1c1240', { roughness: 0.3, metalness: 0.4 })); b.position.y = 0.15; b.receiveShadow = true; G.add(b);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 8, 48), glow(color)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.3; G.add(ring);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 4.0, 36, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })); beam.position.y = 2.3; G.add(beam);
  return G;
}
// mảnh pixel văng (khối vuông neon)
export function pixelBits(scene, N = 60) {
  const arr = []; for (let i = 0; i < N; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), glow(NEON[i % NEON.length])); m.visible = false; scene.add(m); arr.push(m); } return arr;
}
