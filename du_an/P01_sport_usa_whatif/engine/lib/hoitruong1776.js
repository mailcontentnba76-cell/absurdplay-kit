// E24 (Mascot NBA) — NHÀ THI ĐẤU HỘI TRƯỜNG THUỘC ĐỊA (hư cấu, cảm hứng kiến trúc Philadelphia thế kỷ 18, không phải toà nhà có thật).
// Tường gạch đỏ + trụ ốp trắng, cửa sổ vòm cao để nắng chiều đông xiên vào, ốp chân tường gỗ trắng, khán đài gỗ tầng trệt + ban công gỗ lan can trắng,
// trần trắng ô kẹp + 4 đèn chùm nến đồng, sàn gỗ thích vùng sơn navy, CHUÔNG TỰ DO TREO GIỮA SÂN (đứng thay bảng điểm) + bảng điểm gỗ treo dưới chuông.
// Sân dọc trục x (rổ ở x = ±13,1), biên z = ±7,62. Không logo NBA/đội.
import * as THREE from 'three';
import { hoop, basketball, canvasTex } from './nba.js';
import { bleachers } from './ngoaitroi.js';
import { libertyBell } from './philly1776.js';
export const CL = 28.65, CW = 15.24, RIMX = CL / 2 - 1.22 - 0.3786;   // tâm vành rổ x = ±12,73
export const HALL = { X: 25, Z: 19.5, H: 15.5 };
export const BELLY = 10.6;   // độ cao đáy chuông
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const NAVY = '#1f2f5a', CREAM = '#efe4c8', BRICK = '#9a3a2a';

function courtTex() {
  return canvasTex(4096, 2414, (g, X, Y) => { const px = X / (CL + 4), M = 2 * px;
    g.fillStyle = '#6a3a22'; g.fillRect(0, 0, X, Y);
    for (let y = 0; y < Y; y += px * 0.075) { for (let x = 0; x < X;) { const l = px * (1.0 + Math.random() * 2.6); const v = Math.random(); g.fillStyle = `hsl(${32 + v * 6},${52 + v * 10}%,${66 + v * 7}%)`; g.fillRect(x, y, l, px * 0.075 - 1); x += l; } }
    g.fillStyle = 'rgba(70,35,10,0.06)'; for (let i = 0; i < 9000; i++) g.fillRect(Math.random() * X, Math.random() * Y, px * 0.3, 1);
    // viền ngoài sân sơn đỏ gạch
    g.fillStyle = 'rgba(31,47,90,0.95)'; g.fillRect(0, 0, X, M); g.fillRect(0, Y - M, X, M); g.fillRect(0, 0, M, Y); g.fillRect(X - M, 0, M, Y);
    const cx = X / 2, cy = Y / 2, lw = px * 0.05; g.strokeStyle = CREAM; g.lineWidth = lw; g.strokeRect(M, M, CL * px, CW * px);
    g.beginPath(); g.moveTo(cx, M); g.lineTo(cx, Y - M); g.stroke();
    g.fillStyle = NAVY; g.beginPath(); g.arc(cx, cy, 1.83 * px, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = CREAM; g.font = `italic 900 ${px * 0.78}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1776', cx, cy + px * 0.05);
    for (const s of [-1, 1]) { const bx = s < 0 ? M : X - M, dir = -s, hx = bx + dir * 1.575 * px;
      g.fillStyle = NAVY; const kx = s < 0 ? bx : bx - 5.79 * px; g.fillRect(kx, cy - 2.44 * px, 5.79 * px, 4.88 * px); g.strokeRect(kx, cy - 2.44 * px, 5.79 * px, 4.88 * px);
      const ftx = bx + dir * 5.79 * px; g.beginPath(); g.arc(ftx, cy, 1.83 * px, s < 0 ? -Math.PI / 2 : Math.PI / 2, s < 0 ? Math.PI / 2 : Math.PI * 1.5); g.stroke();
      const cw = (CW / 2 - 0.91) * px, R3 = 7.24 * px; const a0 = Math.asin(cw / R3); const cxL = Math.cos(a0) * R3;
      g.beginPath(); g.moveTo(bx, cy - cw); g.lineTo(hx + dir * cxL, cy - cw); if (s < 0) g.arc(hx, cy, R3, -a0, a0); else g.arc(hx, cy, R3, Math.PI + a0, Math.PI - a0, true); g.lineTo(bx, cy + cw); g.stroke();
      g.beginPath(); g.arc(hx, cy, 1.22 * px, s < 0 ? -Math.PI / 2 : Math.PI / 2, s < 0 ? Math.PI / 2 : Math.PI * 1.5); g.stroke();
      g.save(); g.translate(s < 0 ? M * 0.5 : X - M * 0.5, cy); g.rotate(s < 0 ? -Math.PI / 2 : Math.PI / 2); g.fillStyle = CREAM; g.font = `italic 900 ${px * 0.9}px Georgia, serif`; g.fillText('PHILADELPHIA', 0, 0); g.restore(); }
    g.fillStyle = CREAM; g.font = `italic 900 ${px * 0.85}px Georgia, serif`; g.fillText('PHILADELPHIA', cx, M * 0.5); g.save(); g.translate(cx, Y - M * 0.5); g.rotate(Math.PI); g.fillText('PHILADELPHIA', 0, 0); g.restore(); });
}
function brickTex(rep) { return canvasTex(512, 512, (g, W, H) => { g.fillStyle = '#d8cfc0'; g.fillRect(0, 0, W, H); const bh = 32, bw = 96;
  for (let r = 0; r < H / bh; r++) for (let c = -1; c < W / bw + 1; c++) { const x = c * bw + (r % 2) * bw / 2, y = r * bh; const v = Math.random(); g.fillStyle = `hsl(${8 + v * 8},${50 + v * 15}%,${30 + v * 12}%)`; g.fillRect(x + 3, y + 3, bw - 6, bh - 6);
    g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(x + 3, y + bh - 9, bw - 6, 6); } }, rep); }
function arch(w, h, mat) { const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, h - w / 2); sh.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0); return new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), mat); }
// cửa sổ vòm: kính sáng (nắng chiều) + khung trắng + song chia ô
function windowArch(w = 2.6, h = 6) { const G = new THREE.Group();
  const glow = canvasTex(256, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#fff2d0'); gr.addColorStop(0.6, '#ffd9a0'); gr.addColorStop(1, '#f3b878'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const gl = arch(w, h, new THREE.MeshBasicMaterial({ map: glow, toneMapped: false })); G.add(gl);
  const fr = std('#f6f2ea', { roughness: 0.6 }); const ring = arch(w + 0.36, h + 0.18, fr); ring.position.z = -0.03; G.add(ring);
  const bars = []; for (let i = 1; i < 3; i++) bars.push(new THREE.BoxGeometry(0.05, h - 0.2, 0.06).translate(-w / 2 + i * w / 3, (h - 0.2) / 2, 0.02));
  for (let j = 1; j < 6; j++) bars.push(new THREE.BoxGeometry(w, 0.05, 0.06).translate(0, j * (h - w / 2) / 6, 0.02));
  bars.forEach((b) => G.add(new THREE.Mesh(b, fr))); const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.14, 0.3), fr); sill.position.set(0, -0.07, 0.1); G.add(sill);
  return G; }
// đèn chùm nến đồng: 2 vòng, nến trắng + ngọn lửa phát sáng, xích treo
function chandelier() { const G = new THREE.Group(); const br = std('#c8a050', { metalness: 0.8, roughness: 0.3 }); const fl = new THREE.MeshStandardMaterial({ color: '#ffd28a', emissive: '#ffb84a', emissiveIntensity: 3 });
  for (const [r, y, n] of [[1.4, 0, 12], [0.8, 0.6, 8]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 6, 40), br); t.rotation.x = Math.PI / 2; t.position.y = y; G.add(t);
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), std('#f6f2e8')); c.position.set(Math.cos(a) * r, y + 0.13, Math.sin(a) * r); G.add(c);
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), fl); f.scale.y = 1.6; f.position.set(Math.cos(a) * r, y + 0.29, Math.sin(a) * r); G.add(f); } }
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 1.4, 8), br); stem.position.y = 0.4; G.add(stem);
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 6, 5), std('#3a3020', { metalness: 0.6 })); chain.position.y = 4.1; G.add(chain);
  G.userData.flame = fl; return G; }
// bảng điểm gỗ treo dưới chuông, 2 mặt ±z (MIL / PHI), hoặc thông điệp
function boardHung() { const H = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 400; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const box = new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.9, 0.5), std('#4a2e18', { roughness: 0.75 })); H.add(box);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 2.6), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); f.position.z = s * 0.26; f.rotation.y = s > 0 ? 0 : Math.PI; H.add(f); }
  const trim = std('#c8a050', { metalness: 0.7, roughness: 0.35 }); for (const y of [-1.5, 1.5]) { const b = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.12, 0.6), trim); b.position.y = y; H.add(b); }
  let last = ''; const draw = (o) => { const k = JSON.stringify(o); if (k === last) return; last = k; const g = cv.getContext('2d');
    g.fillStyle = '#16120e'; g.fillRect(0, 0, 1024, 400); g.strokeStyle = '#c8a050'; g.lineWidth = 6; g.strokeRect(8, 8, 1008, 384); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = `900 ${o.big ? 150 : 112}px Anton, Impact, sans-serif`; g.fillStyle = o.c || '#ffe9b0'; g.fillText(o.msg, 512, o.sub ? 160 : 205, 980); if (o.sub) { g.font = '900 64px Anton, Impact, sans-serif'; g.fillStyle = '#e8dcc0'; g.fillText(o.sub, 512, 310, 980); } }
    else { g.font = '900 64px Anton, Impact, sans-serif'; g.fillStyle = '#9ad68a'; g.fillText('MIL', 220, 70); g.fillStyle = '#e8dcc0'; g.fillText('PHI', 804, 70);
      g.font = '900 200px Anton, Impact, sans-serif'; g.fillStyle = '#ffe9b0'; g.fillText(String(o.a ?? 0), 220, 245); g.fillText(String(o.b ?? 0), 804, 245);
      g.font = '900 64px Anton, Impact, sans-serif'; g.fillStyle = '#ffb84a'; g.fillText(o.clock || '', 512, 245); }
    t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'Q1' }); return { G: H, draw }; }

export function buildHall(scene) {
  scene.background = new THREE.Color('#b8ccbc'); scene.fog = new THREE.Fog('#c4d2c4', 80, 170);
  const G = new THREE.Group(); scene.add(G); const { X, Z, H } = HALL;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CL + 4, CW + 4), new THREE.MeshStandardMaterial({ map: courtTex(), roughness: 0.35, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.005; floor.receiveShadow = true; G.add(floor);
  const planks = canvasTex(256, 256, (g, W, Hh) => { g.fillStyle = '#b8946a'; g.fillRect(0, 0, W, Hh); for (let y = 0; y < Hh; y += 16) { g.fillStyle = `rgba(60,35,15,${0.1 + Math.random() * 0.1})`; g.fillRect(0, y, W, 2); } }, [20, 16]);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(2 * X, 2 * Z), std('#ffffff', { map: planks, roughness: 0.7 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.06; outer.receiveShadow = true; G.add(outer);
  const hoops = [hoop(1, { pad: '#7a2a1e' }), hoop(-1, { pad: '#7a2a1e' })]; hoops[0].position.set(CL / 2 - 1.22, 0, 0); hoops[1].position.set(-(CL / 2 - 1.22), 0, 0); hoops.forEach((h) => G.add(h));
  // tường gạch 4 phía + ốp chân trắng + trụ ốp trắng + cửa sổ vòm
  const wmat = (len) => std('#8fb39c', { roughness: 0.95 });
  const bmat = (len) => std('#ffffff', { map: brickTex([len / 3.2, 2.6 / 3.2]), roughness: 0.92 });
  const white = std('#fbf9f4', { roughness: 0.6, emissive: '#ffffff', emissiveIntensity: 0.12 });
  const walls = [[0, -Z, 0, 2 * X], [0, Z, Math.PI, 2 * X], [-X, 0, Math.PI / 2, 2 * Z], [X, 0, -Math.PI / 2, 2 * Z]];
  for (const [x, z, ry, len] of walls) { const w = new THREE.Mesh(new THREE.PlaneGeometry(len, H), wmat(len)); w.position.set(x, H / 2, z); w.rotation.y = ry; w.receiveShadow = true; G.add(w);
    const nrm = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry)); const tg = new THREE.Vector3(Math.cos(ry), 0, -Math.sin(ry));
    const brk = new THREE.Mesh(new THREE.PlaneGeometry(len, 2.6), bmat(len)); brk.position.set(x + nrm.x * 0.03, 1.3, z + nrm.z * 0.03); brk.rotation.y = ry; G.add(brk);
    const wain = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 0.14), white); wain.position.set(x + nrm.x * 0.07, 2.6, z + nrm.z * 0.07); wain.rotation.y = ry; G.add(wain);
    const cor = new THREE.Mesh(new THREE.BoxGeometry(len, 0.5, 0.5), white); cor.position.set(x + nrm.x * 0.2, H - 0.25, z + nrm.z * 0.2); cor.rotation.y = ry; G.add(cor);
    const n = Math.floor(len / 6.2); for (let i = 0; i < n; i++) { const u = -len / 2 + (i + 0.5) * len / n;
      const pil = new THREE.Mesh(new THREE.BoxGeometry(0.55, H, 0.22), white); const pu = u - len / n / 2; pil.position.set(x + tg.x * pu + nrm.x * 0.11, H / 2, z + tg.z * pu + nrm.z * 0.11); pil.rotation.y = ry; G.add(pil);
      const win = windowArch(2.4, 5.6); win.position.set(x + tg.x * u + nrm.x * 0.04, 7.6, z + tg.z * u + nrm.z * 0.04); win.rotation.y = ry; G.add(win); } }
  // trần ô kẹp trắng kem
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * X, 2 * Z), std('#f6f3ec', { roughness: 0.9, emissive: '#f2ede2', emissiveIntensity: 0.3 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; G.add(ceil);
  for (let x = -X + 4; x < X; x += 4) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 2 * Z), white); b.position.set(x, H - 0.25, 0); G.add(b); }
  for (let z = -Z + 4; z < Z; z += 4) { const b = new THREE.Mesh(new THREE.BoxGeometry(2 * X, 0.5, 0.3), white); b.position.set(0, H - 0.25, z); G.add(b); }
  // khán đài gỗ tầng trệt (2 biên dọc) + ban công gỗ lan can trắng
  const U = { uT: { value: 0 }, uCheer: { value: 0.25 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const fans = { shirts: [NAVY, '#7a1f2a', CREAM, '#f2f0ea', NAVY, '#2f4a36', '#2f7a3a', '#7a1f2a', '#c8a860', NAVY], skins: ['#f1c9a5', '#c68c5f', '#9a6040', '#8a5634', '#e8b98f'], pants: ['#1a1a20', '#e8dcc0', '#3b3b3b'], hats: ['#151515', '#151515', '#2a1a10', '#f2f0ea'] };
  const wood = { seatColor: '#2e4684', frameColor: '#e8e4da' };
  for (const s of [-1, 1]) {
    bleachers(G, s, { U, fill: 0.86, seed: 41 + s * 3, rows: 7, len: 34, x0: 0, z0: s * (CW / 2 + 3.4), ...wood, ...fans, banner: 'PHILADELPHIA', bannerBg: '#1f2f5a', bannerFg: CREAM });
    bleachers(G, s, { U, fill: 0.8, seed: 61 + s * 3, rows: 5, len: 40, x0: 0, y0: 6.0, z0: s * (CW / 2 + 3.4 + 7 * 0.78 + 1.2), ...wood, ...fans });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(44, 0.4, 3.2), std('#e8e4da')); deck.position.set(0, 6.6, s * (CW / 2 + 3.4 + 7 * 0.78 + 0.2)); G.add(deck);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(44, 0.12, 0.16), white); rail.position.set(0, 7.75, s * (CW / 2 + 3.4 + 7 * 0.78 - 1.2)); G.add(rail);
    for (let x = -22; x <= 22; x += 0.5) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.95, 6), white); b.position.set(x, 7.27, s * (CW / 2 + 3.4 + 7 * 0.78 - 1.2)); G.add(b); }
    const fas = new THREE.Mesh(new THREE.BoxGeometry(44, 0.6, 0.2), std(NAVY)); fas.position.set(0, 6.5, s * (CW / 2 + 3.4 + 7 * 0.78 - 1.4)); G.add(fas);
    for (let x = -20; x <= 20; x += 8) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 6.4, 14), white); c.position.set(x, 3.2, s * (CW / 2 + 3.4 + 7 * 0.78 - 1.0)); c.castShadow = true; G.add(c); } }
  // khán đài sau 2 rổ (thấp)
  for (const s of [-1, 1]) bleachers(G, 1, { U, fill: 0.78, seed: 81 + s, rows: 5, len: 18, rotY: s > 0 ? -Math.PI / 2 : Math.PI / 2, x0: s * (CL / 2 + 4.6), z0: 0, ...wood, ...fans });
  // 4 đèn chùm
  const chand = []; for (const x of [-11, 11]) for (const z of [-6, 6]) { const c = chandelier(); c.position.set(x, 9.2, z); G.add(c); chand.push(c); }
  // CHUÔNG TỰ DO treo giữa sân (xà gỗ + 2 xích) + bảng điểm gỗ bên dưới
  const bell = libertyBell(2.1); bell.position.set(0, BELLY, 0); bell.rotation.y = Math.PI / 2; G.add(bell);
  for (const sx of [-1, 1]) { const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, H - BELLY - 2.7, 5), std('#2a2420', { metalness: 0.6 })); ch.position.set(0, (H + BELLY + 2.7) / 2, sx * 1.2); G.add(ch); }
  const board = boardHung(); board.G.position.set(0, BELLY - 2.0, 0); G.add(board.G);
  for (const sx of [-1, 1]) { const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 5), std('#2a2420', { metalness: 0.6 })); ch.position.set(sx * 3.0, BELLY - 0.15, 0); G.add(ch); }
  return { G, hoops, crowd: U, bell, center: board, chand, floor };
}
export function hallLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#ffffff', '#a89070', 2.6); scene.add(hemi);
  // nắng chiều đông xiên qua cửa sổ vòm phía −z
  const key = new THREE.DirectionalLight('#fff1dc', 3.8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#e4ecff', 1.7); fill.position.set(14, 18, 20); scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 2.2); scene.add(rim); scene.add(rim.target);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 14, 26, z - 22); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(0, 0, 1); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.75).multiplyScalar(22); key.position.set(x + d.x, 26, z + d.z); rim.target.position.set(x, 1, z); rim.position.set(x - d.x * 0.9, 9, z - d.z * 0.9); };
  const lamps = (k) => { P.chand.forEach((c) => { c.userData.flame.emissiveIntensity = 0.4 + 2.6 * k; }); hemi.intensity = 2.0 + 0.6 * k; };
  area(0, 0); lamps(1); return { hemi, key, fill, rim, area, lamps };
}
export { basketball };
