// E09 (NBA): NHÀ THI ĐẤU TRƯỜNG TRUNG HỌC ban đêm (bối cảnh mới) + CỌC GIAO THÔNG dựng bằng code.
// Sàn gỗ vạch sân NBA thật (28,65 × 15,24 m; rổ 3,05 m), khán đài gỗ gập một bên, tường gạch block sơn 2 màu, đèn treo, bảng điểm treo tường,
// cửa sổ cao tối (đêm), băng rôn hư cấu (không logo). Cọc: thân cam, 2 dải phản quang trắng, đế đen vuông, số dán.
import * as THREE from 'three';
import { hoop } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
const ctex = (w, h, draw, rep) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.userData.cv = cv; return t; };
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const GY = { L: 28.65, W: 15.24, X: 18.5, Z: 13.5, H: 9.5 }; // nửa chiều dài/rộng nhà, chiều cao trần

export function buildGym(scene, o = {}) {
  const r = rnd(o.seed ?? 3); const S = 64;
  // sàn gỗ: ván dọc màu mật ong + vạch sân + vòng giữa sơn màu trường (hư cấu: "HAWKS" xanh navy)
  const ft = ctex(Math.round((GY.L + 4) * S), Math.round((GY.W + 4) * S), (g, W, H) => {
    for (let y = 0; y < H; y += 10) { const c = 190 + Math.floor(r() * 30); g.fillStyle = `rgb(${c},${Math.floor(c * 0.72)},${Math.floor(c * 0.42)})`; g.fillRect(0, y, W, 10); }
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(90,50,20,${0.05 + r() * 0.06})`; g.fillRect(r() * W, Math.floor(r() * H / 10) * 10, 40 + r() * 160, 10); }
    const ox = 2 * S, oy = 2 * S, L = GY.L * S, Wd = GY.W * S; g.fillStyle = 'rgba(25,45,95,0.85)';
    for (const sx of [0, 1]) { const x0 = sx ? ox + L - 5.8 * S : ox; g.fillRect(x0, oy + Wd / 2 - 2.44 * S, 5.8 * S, 4.88 * S); }
    g.beginPath(); g.arc(ox + L / 2, oy + Wd / 2, 1.83 * S, 0, 7); g.fill();
    g.strokeStyle = '#f4f1ea'; g.lineWidth = 0.07 * S; g.strokeRect(ox, oy, L, Wd); g.beginPath(); g.moveTo(ox + L / 2, oy); g.lineTo(ox + L / 2, oy + Wd); g.stroke();
    g.beginPath(); g.arc(ox + L / 2, oy + Wd / 2, 1.83 * S, 0, 7); g.stroke();
    for (const sx of [1, -1]) { const bx = sx > 0 ? ox : ox + L, d = sx, rimX = bx + d * 1.6 * S; g.strokeRect(sx > 0 ? bx : bx - 5.8 * S, oy + Wd / 2 - 2.44 * S, 5.8 * S, 4.88 * S);
      g.beginPath(); g.arc(bx + d * 5.8 * S, oy + Wd / 2, 1.83 * S, 0, 7); g.stroke(); const c3 = 6.71 * S, R3 = 7.24 * S, ang = Math.asin(c3 / R3), xc = Math.sqrt(R3 * R3 - c3 * c3);
      for (const q of [-1, 1]) { g.beginPath(); g.moveTo(bx, oy + Wd / 2 + q * c3); g.lineTo(rimX + d * xc, oy + Wd / 2 + q * c3); g.stroke(); }
      g.beginPath(); if (d > 0) g.arc(rimX, oy + Wd / 2, R3, -ang, ang); else g.arc(rimX, oy + Wd / 2, R3, Math.PI - ang, Math.PI + ang); g.stroke(); }
    g.font = `900 ${1.6 * S}px Anton, sans-serif`; g.fillStyle = 'rgba(25,45,95,0.75)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('HAWKS', ox + L / 2, oy - 0.9 * S + Wd + 1.4 * S);
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(GY.L + 4, GY.W + 4), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.35, metalness: 0.05 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const out = new THREE.Mesh(new THREE.PlaneGeometry(GY.X * 2 + 2, GY.Z * 2 + 2), std('#5b3c22', { roughness: 0.6 })); out.rotation.x = -Math.PI / 2; out.position.y = -0.01; out.receiveShadow = true; scene.add(out);
  // tường gạch block: dưới xanh navy, trên be; cửa sổ cao tối; trần tối có giàn thép
  const wt = ctex(1024, 512, (g, W, H) => { g.fillStyle = '#d9cfb8'; g.fillRect(0, 0, W, H); g.fillStyle = '#1f3566'; g.fillRect(0, H * 0.62, W, H * 0.38); g.fillStyle = '#c8a23a'; g.fillRect(0, H * 0.6, W, H * 0.03);
    g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 2; for (let y = 0; y < H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = (y / 32) % 2 ? 0 : 32; x < W; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } }, [4, 1]);
  const wm = new THREE.MeshStandardMaterial({ map: wt, roughness: 0.9 });
  const walls = []; for (const [w, x, z, ry] of [[GY.X * 2, 0, -GY.Z, 0], [GY.X * 2, 0, GY.Z, Math.PI], [GY.Z * 2, -GY.X, 0, Math.PI / 2], [GY.Z * 2, GY.X, 0, -Math.PI / 2]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, GY.H), wm.clone()); m.material.map = wt.clone(); m.material.map.repeat.set(w / 9, 1); m.material.map.needsUpdate = true; m.position.set(x, GY.H / 2, z); m.rotation.y = ry; m.receiveShadow = true; scene.add(m); walls.push(m); }
  const win = std('#0d1730', { roughness: 0.2, metalness: 0.3, emissive: '#0a1430', emissiveIntensity: 0.6 });
  for (let i = 0; i < 6; i++) for (const z of [-GY.Z + 0.02, GY.Z - 0.02]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), win); w.position.set(-15 + i * 6, 7.6, z); w.rotation.y = z > 0 ? Math.PI : 0; scene.add(w); }
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(GY.X * 2, GY.Z * 2), std('#24262b', { roughness: 1 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = GY.H; scene.add(ceil);
  const steel = std('#3a3d44', { metalness: 0.6, roughness: 0.4 }); for (let i = -3; i <= 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, GY.Z * 2), steel); b.position.set(i * 5.5, GY.H - 0.4, 0); scene.add(b); }
  // đèn treo: chụp tròn phát sáng + spot xuống sàn
  const lampM = new THREE.MeshBasicMaterial({ color: '#fff6dc', toneMapped: false }); const lampS = std('#2b2d33', { metalness: 0.5 });
  for (let i = -2; i <= 2; i++) for (const z of [-4, 4]) { const g = new THREE.Group(); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 0.5, 16, 1, true), lampS); g.add(sh); const bl = new THREE.Mesh(new THREE.CircleGeometry(0.55, 20), lampM); bl.rotation.x = Math.PI / 2; bl.position.y = -0.24; g.add(bl);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6), lampS); cord.position.y = 1.05; g.add(cord); g.position.set(i * 6, GY.H - 2.1, z); scene.add(g); }
  // khán đài gỗ gập (phía -z), 8 bậc
  const bleach = new THREE.Group(); const woodB = std('#b98a52', { roughness: 0.6 }); const riser = std('#3b2b1c');
  for (let k = 0; k < 8; k++) { const seat = new THREE.Mesh(new THREE.BoxGeometry(24, 0.08, 0.42), woodB); seat.position.set(0, 0.45 + k * 0.42, -(GY.W / 2 + 2.2) - k * 0.62); seat.castShadow = seat.receiveShadow = true; bleach.add(seat);
    const rs = new THREE.Mesh(new THREE.BoxGeometry(24, 0.42 + k * 0.42, 0.06), riser); rs.position.set(0, (0.42 + k * 0.42) / 2, -(GY.W / 2 + 2.0) - k * 0.62); bleach.add(rs); }
  scene.add(bleach);
  const hoops = [1, -1].map((d) => { const h = hoop(d, { pad: '#1f3566' }); h.position.set(d * (GY.L / 2 - 1.22), 0, 0); scene.add(h); return h; });
  // bảng điểm treo tường (+z cao), mặt canvas
  const sbTex = ctex(1024, 512, (g, W, H) => { g.fillStyle = '#0b0b0d'; g.fillRect(0, 0, W, H); });
  const SB = new THREE.Group(); const fr = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.3, 0.3), std('#1f3566', { roughness: 0.5 })); SB.add(fr);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 2.9), new THREE.MeshBasicMaterial({ map: sbTex, toneMapped: false })); scr.position.z = 0.16; SB.add(scr);
  SB.position.set(0, 6.0, GY.Z - 0.2); SB.rotation.y = Math.PI; scene.add(SB);
  // băng rôn hư cấu trên tường -x / +x
  const ban = (txt, x, z, ry) => { const t = ctex(512, 1024, (g, W, H) => { g.fillStyle = '#1f3566'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8a23a'; g.fillRect(16, 16, W - 32, H - 32); g.fillStyle = '#1f3566'; g.fillRect(32, 32, W - 64, H - 64);
      g.fillStyle = '#fff'; g.font = '900 80px Anton, sans-serif'; g.textAlign = 'center'; txt.split('\n').forEach((l, i) => g.fillText(l, W / 2, 260 + i * 120)); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9, side: THREE.DoubleSide })); m.position.set(x, 6.8, z); m.rotation.y = ry; scene.add(m); };
  ban('HAWKS\nSTATE\nCHAMPS\n1998', -GY.X + 0.05, -5, Math.PI / 2); ban('HAWKS\nCONF.\nCHAMPS\n2004', -GY.X + 0.05, 0, Math.PI / 2); ban('NO\nFOOD\nON THE\nFLOOR', GY.X - 0.05, 4, -Math.PI / 2);
  // dãy ghế băng 2 bên (cho 20 cầu thủ / 4 HLV)
  const benchM = std('#6b4528', { roughness: 0.7 }); const benches = [];
  for (const x of [-6, 6]) { const b = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 0.45), benchM); b.position.set(x, 0.48, GY.W / 2 + 1.6); b.castShadow = b.receiveShadow = true; scene.add(b); benches.push(b); }
  return { hoops, sbTex, SB, floor, walls, benches };
}
export function gymLights(scene) {
  const hemi = new THREE.HemisphereLight('#fff4e0', '#5a4026', 2.2); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff1d6', 2.4); key.position.set(-8, 20, 10); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 16, bottom: -16, near: 1, far: 60 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key);
  const pts = []; for (let i = -2; i <= 2; i++) { const p = new THREE.PointLight('#ffe8c4', 14, 16, 1.6); p.position.set(i * 6, 7, 0); scene.add(p); pts.push(p); }
  return { hemi, key, pts };
}

// ======================= CỌC GIAO THÔNG =======================
// o: {number, s (tỉ lệ; 1 = cao 0,7 m), jersey: màu áo nhỏ quấn quanh (tuỳ chọn)}. update(t,c): c = {wobble 0..1 (rung khi bị va), tipX/tipZ (nghiêng rad)}
export function makeCone(o = {}) {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const orange = std('#ff6a13', { roughness: 0.45 }); const white = std('#f6f6f2', { roughness: 0.3, emissive: '#222222' }); const black = std('#141414', { roughness: 0.8 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.42), black); base.position.y = 0.02; body.add(base);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.16, 0.66, 28, 1, true), orange); cone.position.y = 0.37; body.add(cone);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 20), orange); tip.position.y = 0.705; body.add(tip);
  for (const [y, r0, r1, h] of [[0.5, 0.1, 0.075, 0.09], [0.32, 0.135, 0.115, 0.07]]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(r1 + 0.003, r0 + 0.003, h, 28, 1, true), white); b.position.y = y; body.add(b); }
  if (o.number != null) { const t = (() => { const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = '#111'; g.font = '900 96px Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(o.number), 64, 70); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; })();
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.11), new THREE.MeshBasicMaterial({ map: t, transparent: true })); d.position.set(0, 0.21, 0.142); d.rotation.x = -0.2; body.add(d); }
  if (o.jersey) { const j = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.15, 0.2, 28, 1, true), std(o.jersey, { side: THREE.DoubleSide })); j.position.y = 0.2; body.add(j); }
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.scale.setScalar(o.s ?? 1);
  function update(t, c = {}) { const w = c.wobble ?? 0; body.rotation.set((c.tipX ?? 0) + w * Math.sin(t * 22) * 0.12, 0, (c.tipZ ?? 0) + w * Math.cos(t * 19) * 0.1); }
  return { root, body, update };
}

// ======================= KHÁN GIẢ trên khán đài gỗ (cùng kỹ thuật lib/nba.js: 1 lưới tĩnh, cử động trong vertex shader) =======================
// Điều khiển: U.uT (thời gian), U.uCheer (0..1 cổ vũ: nhún + giơ 2 tay), U.uSleep (0..1 gục đầu ngủ). Thêm khán đài thứ 2 phía +z (sau ghế băng).
export function gymCrowd(scene, o = {}) {
  let rs = o.seed ?? 11; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const torsoG = box(0.4, 0.46, 0.26, 0, 0.72, -0.02), headG = new THREE.IcosahedronGeometry(0.12, 1).translate(0, 1.1, 0).toNonIndexed(), legG = box(0.38, 0.14, 0.42, 0, 0.5, 0.18), armG = box(0.09, 0.4, 0.09, 0, -0.2, 0);
  const shirts = o.shirts || ['#00471B', '#5a2d81', '#CE1141', '#f4f4f2', '#4e008e', '#1f3566', '#c8a23a', '#ffffff', '#6b6b6b', '#e2c25a', '#1f3566', '#d9864f'];
  const skins = ['#f1c9a5', '#d6a47a', '#b57e55', '#8d5a3b', '#e8b98f'];
  const ppl = [];
  // khán đài -z (8 bậc, trùng khán đài gỗ trong buildGym)
  for (let k = 0; k < 8; k++) for (let x = -11.5; x <= 11.5; x += 0.56) { if (R() > (k < 4 ? 0.7 : 0.5)) continue; const z = -(GY.W / 2 + 2.2) - k * 0.62, y = 0.45 + k * 0.42 - 0.42;
    ppl.push([new THREE.Matrix4().makeTranslation(x + (R() - 0.5) * 0.08, y, z), 0]); }
  // khán đài +z (5 bậc, sau ghế băng) — dựng kèm bậc gỗ
  const woodB = std('#b98a52', { roughness: 0.6 }), riser = std('#3b2b1c'); const G2 = new THREE.Group();
  for (let k = 0; k < 5; k++) { const z = GY.W / 2 + 3.4 + k * 0.62, y = 0.45 + k * 0.42; const seat = new THREE.Mesh(new THREE.BoxGeometry(24, 0.08, 0.42), woodB); seat.position.set(0, y, z); seat.castShadow = seat.receiveShadow = true; G2.add(seat);
    const rr = new THREE.Mesh(new THREE.BoxGeometry(24, y, 0.06), riser); rr.position.set(0, y / 2, z + 0.22); G2.add(rr);
    for (let x = -11.5; x <= 11.5; x += 0.56) { if (Math.abs(x) < 2.2 && k < 2) continue; if (R() > 0.55) continue; ppl.push([new THREE.Matrix4().makeRotationY(Math.PI).premultiply(new THREE.Matrix4().makeTranslation(x, y - 0.42, z)), 1]); } }
  scene.add(G2);
  const P = [], C = [], CP = [], PV = [], FX = []; const v = new THREE.Vector3(), col = new THREE.Color(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
  const add = (geo, m, color, cp, piv, fax) => { col.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count;
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(col.r, col.g, col.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); FX.push(fax.x, fax.y, fax.z); } };
  for (const [m] of ppl) { const r = R(), shirt = shirts[Math.floor(R() * shirts.length)], skin = skins[Math.floor(R() * skins.length)]; m.decompose(pos, q, sc); const fax = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const ph = r * 40, am = 0.55 + 0.45 * ((r * 7.3) % 1); const zero = new THREE.Vector3();
    add(torsoG, m, shirt, [1, ph, am, 0], zero, fax); add(headG, m, skin, [1.5, ph, am, 0], zero, fax); add(legG, m, '#2b2f3a', [0, 0, 0, 0], zero, zero);
    for (const sx of [-1, 1]) { const off = new THREE.Vector3(sx * 0.25, 0.94, -0.02); const sh = off.clone().applyMatrix4(m); const am4 = new THREE.Matrix4().makeTranslation(off.x, off.y, off.z).premultiply(m);
      const ow = off.clone().setY(0).applyQuaternion(q); const d = new THREE.Vector3(0, -1, 0), sgn = Math.sign(new THREE.Vector3().crossVectors(fax, d).dot(ow)) || 1; add(armG, am4, shirt, [sgn > 0 ? 2 : 3, ph, am, 0], sh, fax); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  geo.setAttribute('cp', new THREE.Float32BufferAttribute(CP, 4)); geo.setAttribute('piv', new THREE.Float32BufferAttribute(PV, 3)); geo.setAttribute('fax', new THREE.Float32BufferAttribute(FX, 3)); geo.computeVertexNormals();
  const U = { uT: { value: 0 }, uCheer: { value: 0.2 }, uSleep: { value: 0 } };
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 cp; attribute vec3 piv; attribute vec3 fax; uniform float uT, uCheer, uSleep;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      if (cp.x > 0.5) { float ch = clamp(uCheer * cp.z * (0.7 + 0.6 * fract(cp.y * 0.37)), 0.0, 1.0); float w = uT * (5.0 + cp.z * 3.0) + cp.y;
        if (cp.x > 1.9) { float s = cp.x < 2.5 ? 1.0 : -1.0; float ang = s * (0.12 + ch * (2.5 + 0.35 * sin(w * 1.3)) + 0.06 * sin(uT * 1.7 + cp.y));
          vec3 r = transformed - piv; r = r * cos(ang) + cross(fax, r) * sin(ang) + fax * dot(fax, r) * (1.0 - cos(ang)); transformed = piv + r; }
        transformed.y += (0.012 + 0.12 * ch) * max(0.0, sin(w)) * (1.0 - uSleep);
        if (cp.x > 1.4 && cp.x < 1.6) { transformed += fax * 0.07 * uSleep; transformed.y -= 0.13 * uSleep; }
        if (cp.x > 1.9) transformed.y -= 0.05 * uSleep; }`); };
  mat.customProgramCacheKey = () => 'gymcrowd';
  const all = new THREE.Mesh(geo, mat); all.matrixAutoUpdate = false; all.frustumCulled = false; all.castShadow = true; all.receiveShadow = true; scene.add(all);
  return { U, count: ppl.length };
}
