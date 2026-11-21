// Tập 25 — MÈO LỚN THẬT: hổ Bengal (cam sọc đen, bụng/má trắng) và báo đốm (vàng, đốm hoa thị), dựng trên khung thú 4 chân thu4chan.js
// (kind 'cougar' + kích thước riêng + vân lông vẽ canvas). Đạo cụ: xe đẩy siêu thị, mai rùa (vỡ), hoá đơn dài, ghế dự bị + biển,
// mảnh áo rách (biến hình kiểu Hulk), túm lông bay, mảnh bóng nổ.
import * as THREE from 'three';
import { makeQuad, poseQuad, quadTravel, jumpPose } from './thu4chan.js';
export { poseQuad, quadTravel, jumpPose };
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
const stripeTex = (base) => ctex(512, 512, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 1800; i++) { g.fillStyle = i % 2 ? 'rgba(255,220,170,0.08)' : 'rgba(120,50,10,0.08)'; g.fillRect(Math.random() * W, Math.random() * H, 2, 5); }
  g.fillStyle = '#15100c'; for (let s = 0; s < 14; s++) { const y0 = (s + 0.5) * H / 14 + (Math.random() - 0.5) * 10; g.beginPath(); const th = 7 + Math.random() * 9;
    for (let x = 0; x <= W; x += 16) { const y = y0 + Math.sin(x / 40 + s) * 10; x ? g.lineTo(x, y - th * (0.4 + 0.6 * Math.abs(Math.sin(x / 90 + s)))) : g.moveTo(x, y); }
    for (let x = W; x >= 0; x -= 16) { const y = y0 + Math.sin(x / 40 + s) * 10; g.lineTo(x, y + th * (0.4 + 0.6 * Math.abs(Math.sin(x / 70 + s)))); } g.closePath(); g.fill(); } });
const rosetteTex = (base) => ctex(512, 512, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(255,230,170,0.08)' : 'rgba(120,70,10,0.08)'; g.fillRect(Math.random() * W, Math.random() * H, 2, 5); }
  for (let i = 0; i < 70; i++) { const x = Math.random() * W, y = Math.random() * H, r = 12 + Math.random() * 10; g.fillStyle = '#b8762a'; g.beginPath(); g.arc(x, y, r * 0.75, 0, 7); g.fill();
    g.fillStyle = '#16110c'; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + Math.random() * 0.4; g.beginPath(); g.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, 5 + Math.random() * 3, 3.5, a, 0, 7); g.fill(); }
    if (Math.random() < 0.6) { g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); } }
  g.fillStyle = '#16110c'; for (let i = 0; i < 160; i++) { g.beginPath(); g.arc(Math.random() * W, Math.random() * H, 2 + Math.random() * 3, 0, 7); g.fill(); } });
export const TIGER = { kind: 'cougar', fur: '#e0701e', dark: '#b8541a', white: '#f6eee2', nose: '#e8a090', hoof: '#e0701e',
  bodyLen: 1.2, bodyR: 0.36, legs: [0.33, 0.3, 0.2], legR: 0.1, neckLen: 0.24, neckR: 0.21, headLen: 0.32, headR: 0.28, antlers: 0, tail: 'long', ears: 'round', band: null };
export const JAGUAR = { kind: 'cougar', fur: '#d8a03c', dark: '#a8742a', white: '#f2e6cc', nose: '#c88a78', hoof: '#d8a03c',
  bodyLen: 1.05, bodyR: 0.35, legs: [0.27, 0.25, 0.17], legR: 0.11, neckLen: 0.2, neckR: 0.22, headLen: 0.3, headR: 0.29, antlers: 0, tail: 'long', ears: 'round', band: null };
export function makeCat(kind = 'tiger', seed = 0) {
  const cfg = kind === 'tiger' ? TIGER : JAGUAR; const q = makeQuad({ ...cfg });
  const tex = kind === 'tiger' ? stripeTex(cfg.fur) : rosetteTex(cfg.fur); const fur = new THREE.Color(cfg.fur), dark = new THREE.Color(cfg.dark);
  q.root.traverse((m) => { if (!m.isMesh || !m.material || !m.material.color) return; const c = m.material.color;
    if (c.equals(fur) || c.equals(dark)) { if (!m.material.userData.pat) { m.material = m.material.clone(); m.material.userData.pat = 1; } m.material.map = tex; m.material.color.set('#ffffff'); m.material.needsUpdate = true; } });
  // râu mép trắng
  const wm = new THREE.MeshBasicMaterial({ color: '#f4f0e8' }); for (const sg of [1, -1]) for (let k = 0; k < 3; k++) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 3), wm); w.position.set(sg * cfg.headR * 0.55, -0.04 - k * 0.012, cfg.headLen * 0.62); w.rotation.set(0, 0, sg * (Math.PI / 2 - 0.15 + k * 0.12)); q.head.add(w); }
  q.kind = kind; q.root.userData.cat = q; return q;
}
// ---------- đạo cụ ----------
export function shoppingCart() { const G = new THREE.Group(); const wire = std('#c8ccd4', { metalness: 0.8, roughness: 0.3 }), red = std('#c8282a');
  const bx = 1.1, by = 0.6, bz = 0.75, y0 = 0.55;
  const edge = (x1, y1, z1, x2, y2, z2) => { const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2); const L = a.distanceTo(b); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, L, 4), wire); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); G.add(m); };
  for (let i = 0; i <= 8; i++) { const x = -bx / 2 + i * bx / 8; edge(x, y0, -bz / 2, x, y0 + by, -bz / 2); edge(x, y0, bz / 2, x, y0 + by, bz / 2); edge(x, y0, -bz / 2, x, y0, bz / 2); }
  for (let i = 0; i <= 5; i++) { const z = -bz / 2 + i * bz / 5; edge(-bx / 2, y0, z, -bx / 2, y0 + by, z); edge(bx / 2, y0, z, bx / 2, y0 + by, z); }
  for (const yy of [y0, y0 + by]) { edge(-bx / 2, yy, -bz / 2, bx / 2, yy, -bz / 2); edge(-bx / 2, yy, bz / 2, bx / 2, yy, bz / 2); edge(-bx / 2, yy, -bz / 2, -bx / 2, yy, bz / 2); edge(bx / 2, yy, -bz / 2, bx / 2, yy, bz / 2); }
  edge(-bx / 2, y0 + by, -bz / 2, -bx / 2 - 0.25, y0 + by + 0.25, -bz / 2); edge(-bx / 2, y0 + by, bz / 2, -bx / 2 - 0.25, y0 + by + 0.25, bz / 2);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, bz + 0.05, 8), red); h.rotation.x = Math.PI / 2; h.position.set(-bx / 2 - 0.25, y0 + by + 0.25, 0); G.add(h);
  for (const x of [-0.45, 0.45]) for (const z of [-0.3, 0.3]) { edge(x, y0, z, x, 0.08, z); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 10), std('#222')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.07, z); G.add(w); }
  G.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return G; }
export function receipt(lines) { const t = ctex(256, 1024, (g, W, H) => { g.fillStyle = '#fbfaf4'; g.fillRect(0, 0, W, H); g.fillStyle = '#222'; g.font = 'bold 30px monospace'; g.textAlign = 'left';
    g.fillText('TRADE DEADLINE', 14, 50); g.fillText('--------------', 14, 85); lines.forEach((l, i) => g.fillText(l, 14, 140 + i * 70)); g.fillText('--------------', 14, 140 + lines.length * 70); g.font = 'bold 40px monospace'; g.fillText('PAID: ALL', 14, 210 + lines.length * 70);
    for (let y = 0; y < H; y += 8) { g.fillStyle = 'rgba(0,0,0,0.03)'; g.fillRect(0, y, W, 1); } });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.0, 1, 10), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.9 })); m.castShadow = true; return m; }
export function turtleShell() { const G = new THREE.Group(); const t = ctex(256, 256, (g, W, H) => { g.fillStyle = '#5a6a32'; g.fillRect(0, 0, W, H); g.strokeStyle = '#2e3818'; g.lineWidth = 5;
    for (let y = 0; y < H + 40; y += 44) for (let x = 0; x < W + 50; x += 50) { const ox = (y / 44) % 2 ? 25 : 0; g.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; g.lineTo(x + ox + Math.cos(a) * 24, y + Math.sin(a) * 24); } g.closePath(); g.stroke(); } });
  const M = std('#ffffff', { map: t, roughness: 0.55 }); const pieces = [];
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 6, i / 6 * Math.PI * 2, Math.PI * 2 / 6, 0, Math.PI / 2), M); p.scale.y = 0.55; p.castShadow = true; G.add(p); pieces.push(p); }
  const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.3, 0.04, 16), std('#c8b878')); belly.position.y = 0.01; G.add(belly);
  G.userData.crack = (k) => { pieces.forEach((p, i) => { const a = (i + 0.5) / 6 * Math.PI * 2; p.position.set(Math.cos(a) * 0.5 * k, Math.max(0, Math.sin(k * Math.PI) * 0.4), -Math.sin(a) * 0.5 * k); p.rotation.set(k * 1.2 * Math.cos(a), 0, k * 1.2 * Math.sin(a)); }); belly.visible = k < 0.05; };
  return G; }
export function benchSign() { const G = new THREE.Group(); const wood = std('#8a6440'), metal = std('#5a606a', { metalness: 0.5 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 0.8), wood); seat.position.y = 0.55; G.add(seat); for (const x of [-2.2, 0, 2.2]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.7), metal); l.position.set(x, 0.27, 0); G.add(l); }
  const sg = ctex(512, 160, (g, W, H) => { g.fillStyle = '#f4f0e4'; g.fillRect(0, 0, W, H); g.strokeStyle = '#141414'; g.lineWidth = 10; g.strokeRect(6, 6, W - 12, H - 12); g.fillStyle = '#0f6a6a'; g.font = '900 70px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DEBUT NEXT WEEK', W / 2, H / 2); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.8), new THREE.MeshStandardMaterial({ map: sg, roughness: 0.8, side: THREE.DoubleSide })); sign.position.set(0, 1.25, -0.42); G.add(sign);
  for (const x of [-1.1, 1.1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6), metal); p.position.set(x, 1.0, -0.45); G.add(p); }
  G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return G; }
// mảnh vụn bay: áo rách (màu áo), lông (màu lông), da bóng — draw(list) mỗi khung
export function burstFX(scene, N = 160, geo = new THREE.PlaneGeometry(0.14, 0.1)) { const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide, roughness: 0.8 }), N); im.frustumCulled = false; scene.add(im); const D = new THREE.Object3D(), col = new THREE.Color();
  return { im, draw: (bursts) => { let n = 0; for (const b of bursts) { const k = b.k; if (k <= 0 || k >= 1) continue; for (let i = 0; i < b.n && n < N; i++) { const a = i * 2.399 + b.seed, up = 1.5 + (i % 5) * 0.6, sp = 1 + (i % 7) * 0.35, tt = k * 1.1;
      D.position.set(b.x + Math.cos(a) * sp * tt, Math.max(0.03, b.y + up * tt - 4.9 * tt * tt), b.z + Math.sin(a) * sp * tt); D.rotation.set(tt * 7 + i, tt * 5 + a, tt * 3); D.scale.setScalar((b.s || 1) * (1 - k * 0.5)); D.updateMatrix(); im.setMatrixAt(n, D.matrix); im.setColorAt(n, col.set(b.colors[i % b.colors.length])); n++; } }
    im.count = n; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; } }; }
