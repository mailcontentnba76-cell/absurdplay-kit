// N28 — Philadelphia ban ngày: 7 bối cảnh đặt cách nhau theo trục x (mỗi bối cảnh 1 Group, bật/tắt theo shot).
// phố nhà gạch, quán bánh kẹp thịt, bậc thang bảo tàng, phòng Chuông Tự do, công viên + bồ câu, nội thất xe buýt, hầm nhà thi đấu + linh vật chó Franklin.
// Không logo/thương hiệu thật: tên quán, xe buýt, chữ trên áo đều hư cấu hoặc chỉ là tên đội.
import * as THREE from 'three';
import { libertyBell } from './philly1776.js';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); return b; };
const PI = Math.PI;
const PM = (m, p, r) => { m.position.copy(p); if (r) m.rotation.copy(r); return m; };
export function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { c, g, draw }; return t; }
export const redraw = (t, draw) => { const { c, g } = t.userData; g.clearRect(0, 0, c.width, c.height); draw(g, c.width, c.height); t.needsUpdate = true; };
let rs = 2828; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
export const SET = { street: 0, shop: 120, steps: 240, bell: 360, park: 480, bus: 600, tunnel: 720 };


// ---------- đạo cụ bổ sung cho bối cảnh đỡ trống ----------
export function carS(color = '#c8102e') { const G = new THREE.Group(); const b = std(color, { metalness: 0.5, roughness: 0.35 }), gl = std('#22303e', { metalness: 0.6, roughness: 0.1 }), tire = std('#151515', { roughness: 0.9 });
  G.add(box(4.2, 0.7, 1.8, b, 0, 0.6, 0)); G.add(box(2.4, 0.6, 1.6, b, -0.2, 1.2, 0)); G.add(box(2.42, 0.45, 1.62, gl, -0.2, 1.22, 0)); G.add(box(0.05, 0.25, 1.5, std('#fff6d8', { emissive: '#fff2c0', emissiveIntensity: 0.4 }), 2.11, 0.65, 0));
  for (const x of [-1.35, 1.35]) for (const z of [-0.85, 0.85]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16), tire); w.rotation.x = PI / 2; w.position.set(x, 0.34, z); G.add(w); }
  return G; }
export function hydrant() { const G = new THREE.Group(); const m = std('#d8b21a', { roughness: 0.5 }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.6, 12), m); c.position.y = 0.3; G.add(c);
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), m); h.position.y = 0.62; G.add(h); for (const s of [-1, 1]) G.add(box(0.12, 0.08, 0.08, m, s * 0.17, 0.4, 0)); return G; }
export function bin(c = '#2f5a3a') { const G = new THREE.Group(); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.85, 14), std(c, { metalness: 0.3, roughness: 0.5 })); m.position.y = 0.43; G.add(m); return G; }
export function mailbox() { const G = new THREE.Group(); const m = std('#1d3f8a', { roughness: 0.5 }); G.add(box(0.5, 0.9, 0.45, m, 0, 0.75, 0)); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.5, 14, 1, false, 0, PI), m); top.rotation.z = PI / 2; top.position.y = 1.2; G.add(top); for (const s of [-1, 1]) G.add(box(0.06, 0.3, 0.06, m, s * 0.2, 0.15, s * 0.15)); return G; }
export function banner(text, w = 6, h = 1.0, bg = '#fbf8ef', fg = '#c8102e') { const tx = ctex(1024, Math.round(1024 * h / w), (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = fg; g.font = '900 ' + Math.round(H * 0.62) + 'px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 4); });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), std('#fff', { map: tx, side: THREE.DoubleSide, roughness: 0.9 })); }
export function poster(text, sub = '', bg = '#006bb6') { const tx = ctex(256, 360, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 64px Anton, Impact'; g.textAlign = 'center'; g.fillText(text, W / 2, 150); g.font = '700 30px Arial'; g.fillText(sub, W / 2, 220); });
  return new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), std('#fff', { map: tx })); }
export function phone() { const G = new THREE.Group(); G.add(box(0.075, 0.15, 0.012, std('#111', { roughness: 0.3 }))); const s = box(0.066, 0.135, 0.002, std('#9ad0ff', { emissive: '#bfe0ff', emissiveIntensity: 0.9 }), 0, 0, 0.007); G.add(s); return shad(G); }

// ---------- 1. Phố nhà gạch (dọc trục z, nhà hai bên x = ±7) ----------
function rowHouse(w, h, brick, trim, door) { const G = new THREE.Group();
  const tx = ctex(256, 512, (g, W, H) => { g.fillStyle = brick; g.fillRect(0, 0, W, H); g.globalAlpha = 0.18; for (let y = 0; y < H; y += 8) { g.fillStyle = y % 16 ? '#000' : '#fff'; g.fillRect(0, y, W, 1.5); } g.globalAlpha = 1; });
  const wall = box(w, h, 0.4, std('#ffffff', { map: tx, roughness: 0.9 }), 0, h / 2, 0); G.add(wall);
  const corn = box(w + 0.2, 0.45, 0.7, std(trim, { roughness: 0.6 }), 0, h + 0.1, 0.15); G.add(corn);
  const winM = std('#1d2a3a', { roughness: 0.15, metalness: 0.4, emissive: '#2a3a52', emissiveIntensity: 0.25 }); const frM = std('#f2efe6');
  const floors = Math.floor((h - 1) / 3.1);
  for (let f = 0; f < floors; f++) for (let c = 0; c < 2; c++) { if (f === 0 && c === 0) continue; const x = (c - 0.5) * w * 0.48, y = 1.9 + f * 3.1;
    G.add(box(1.05, 1.6, 0.06, frM, x, y, 0.22)); G.add(box(0.9, 1.45, 0.08, winM, x, y, 0.24)); G.add(box(1.2, 0.12, 0.25, frM, x, y - 0.86, 0.28)); }
  G.add(box(1.1, 2.3, 0.1, std(door, { roughness: 0.5 }), -w * 0.24, 1.55, 0.24)); G.add(box(1.4, 0.25, 0.4, frM, -w * 0.24, 2.85, 0.3));
  for (let s = 0; s < 3; s++) G.add(box(1.6, 0.2, 0.4, std('#cfc7b8'), -w * 0.24, 0.1 + s * 0.2, 0.9 - s * 0.32));
  return G; }
export function buildStreet(scene) { const G = new THREE.Group(); G.position.x = SET.street; scene.add(G);
  G.add(Object.assign(box(14, 0.05, 140, std('#3a3c40', { roughness: 0.95 }), 0, -0.02, 0), {}));
  for (let z = -68; z < 70; z += 6) G.add(box(0.15, 0.012, 3, std('#e8c84a', { roughness: 0.6 }), 0, 0.008, z));
  for (const s of [-1, 1]) { G.add(box(3.2, 0.15, 140, std('#b8b2a6', { roughness: 0.9 }), s * 5.6, 0.075, 0)); G.add(box(0.25, 0.16, 140, std('#8a867e'), s * 4.0, 0.08, 0)); }
  const bricks = ['#8a3a2a', '#9a4632', '#7a3224', '#a8553a', '#86402e', '#6e2e22'], doors = ['#1d3a6a', '#2f5a3a', '#7a1f2a', '#1a1a1a', '#e8dcc0', '#3a2a5a'];
  for (const s of [-1, 1]) for (let z = -66; z < 66; z += 5.2) { const h = 9 + Math.floor(R() * 3) * 1.6; const hs = rowHouse(5.1, h, bricks[Math.floor(R() * 6)], R() < 0.5 ? '#efe9dc' : '#5a5048', doors[Math.floor(R() * 6)]);
    hs.position.set(s * 7.4, 0, z); hs.rotation.y = s > 0 ? -PI / 2 : PI / 2; G.add(hs); }
  const lampM = std('#1a1c20', { metalness: 0.5, roughness: 0.4 });
  for (const s of [-1, 1]) for (let z = -60; z < 62; z += 15) { G.add(box(0.12, 4.2, 0.12, lampM, s * 4.4, 2.1, z)); const hd = box(0.4, 0.4, 0.4, std('#fff6d8', { emissive: '#ffe8b0', emissiveIntensity: 0.6 }), s * 4.4, 4.3, z); G.add(hd); }
  // cây vỉa hè
  for (const s of [-1, 1]) for (let z = -55; z < 60; z += 11) { if (z + 4 > -62 && z + 4 < -26) continue; const tr = new THREE.Group(); tr.add(box(0.2, 2.4, 0.2, std('#4a3424'), 0, 1.2, 0)); const cr = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 0), std(['#c8862a', '#b85a22', '#d8a33a'][Math.floor(R() * 3)], { flatShading: true })); cr.position.y = 3.2; tr.add(cr); tr.position.set(s * 5.2, 0, z + 4); G.add(tr); }
  // hai đầu phố: nhà thi đấu kính xanh (cuối phố âm z) — không logo
  const ar = new THREE.Group(); ar.add(box(30, 16, 6, std('#2a5c9a', { metalness: 0.6, roughness: 0.15, emissive: '#183a66', emissiveIntensity: 0.25 }), 0, 8, 0)); ar.add(box(30.4, 1.2, 6.4, std('#e8eef6'), 0, 16.4, 0));
  const sign = ctex(1024, 160, (g, W, H) => { g.fillStyle = '#0d1a33'; g.fillRect(0, 0, W, H); g.font = '900 110px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText('SOUTH PHILLY ARENA', W / 2, H / 2); });
  ar.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(18, 2.8), std('#ffffff', { map: sign, emissive: '#ffffff', emissiveMap: sign, emissiveIntensity: 0.3 })), new THREE.Vector3(0, 13, 3.05)));
  for (let i = -3; i <= 3; i++) ar.add(box(2.4, 3.2, 0.1, std('#bfe0ff', { metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.7 }), i * 2.8, 1.6, 3.05));
  ar.position.set(0, 0, -74); G.add(ar);
  const cc = ['#c8102e', '#1d4fa8', '#e8e8e8', '#2a2a2a', '#8a8f98', '#3a6a3a', '#d8b21a'];
  for (const s of [-1, 1]) for (let z = -66; z < 60; z += 7.5) { if (z > -60 && z < -22) continue; const c = carS(cc[Math.floor(R() * cc.length)]); c.rotation.y = PI / 2 * s; c.position.set(s * 3.2, 0, z + R() * 2); G.add(c); }
  for (const s of [-1, 1]) for (let z = -62; z < 60; z += 13) { const h = hydrant(); h.position.set(s * 4.4, 0.15, z); G.add(h); const b = bin(s < 0 ? '#2f5a3a' : '#3a3c44'); b.position.set(s * 4.5, 0.15, z + 5.5); G.add(b); }
  const mb = mailbox(); mb.position.set(4.5, 0.15, -44); G.add(mb);
  const bn = banner('9 FOR 33  ·  WE REMEMBER', 9, 1.1); bn.position.set(0, 6.6, -38); G.add(bn); for (const s of [-1, 1]) G.add(box(0.05, 0.05, 0.05, std('#111'), s * 4.5, 6.6, -38));
  const bn2 = banner('BENCH: 24  ·  PORTLAND: 54', 8, 0.9, '#006bb6', '#ffffff'); bn2.position.set(0, 5.8, -22); G.add(bn2);
  // cờ dây
  const fl = new THREE.Group(); for (let i = 0; i < 18; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 3), std(['#006bb6', '#ed174c', '#ffffff'][i % 3], { side: THREE.DoubleSide })); f.rotation.x = PI; f.position.set(-4.3 + i * 0.5, 5.2 - Math.sin(i / 17 * PI) * 0.6, 0); fl.add(f); } fl.position.z = -30; G.add(fl);
  return { G: shad(G) }; }

// ---------- 2. Quán bánh kẹp thịt ----------
export function receiptTex(lines) { return ctex(256, 512, (g, W, H) => drawReceipt(g, W, H, lines)); }
export function drawReceipt(g, W, H, lines) { g.fillStyle = '#fbf8ef'; g.fillRect(0, 0, W, H); g.fillStyle = '#222'; g.textAlign = 'center';
  lines.forEach((l, i) => { g.font = (l.b ? '900 ' : '700 ') + (l.s || 26) + 'px "Courier New", monospace'; g.fillStyle = l.c || '#222'; g.fillText(l.t, W / 2, 50 + i * 40); });
  g.strokeStyle = '#999'; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(16, H - 30); g.lineTo(W - 16, H - 30); g.stroke(); }
export function buildShop(scene) { const G = new THREE.Group(); G.position.x = SET.shop; scene.add(G);
  const tile = ctex(256, 256, (g, W) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#1a1a1a' : '#f2efe6'; g.fillRect(x * 32, y * 32, 32, 32); } }); tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(6, 5);
  G.add(box(12, 0.05, 10, std('#ffffff', { map: tile, roughness: 0.4 }), 0, -0.02, 0));
  const wallM = std('#c83a2a', { roughness: 0.8 }); G.add(box(12, 4.2, 0.2, wallM, 0, 2.1, -4)); G.add(box(0.2, 4.2, 10, std('#e8d8b0'), -6, 2.1, 0)); G.add(box(0.2, 4.2, 10, std('#e8d8b0'), 6, 2.1, 0)); G.add(box(12, 0.2, 10, std('#efe9dc'), 0, 4.2, 0));
  // quầy + kính + bếp nướng
  G.add(box(7, 1.0, 1.0, std('#8a8f98', { metalness: 0.7, roughness: 0.3 }), 0, 0.5, -0.8)); G.add(box(7.1, 0.06, 1.1, std('#d8dde4', { metalness: 0.6, roughness: 0.2 }), 0, 1.03, -0.8));
  G.add(box(7, 0.5, 0.04, std('#cfe8ff', { transparent: true, opacity: 0.35, roughness: 0.05 }), 0, 1.3, -0.35));
  G.add(box(3.2, 0.9, 0.9, std('#2a2a2e', { metalness: 0.6, roughness: 0.4 }), -1.6, 0.45, -3.3)); const grill = box(3.2, 0.05, 0.9, std('#3a3634', { metalness: 0.8, roughness: 0.3 }), -1.6, 0.93, -3.3); G.add(grill);
  for (let i = 0; i < 26; i++) G.add(box(0.12, 0.04, 0.08, std('#6a3a1c', { roughness: 0.9 }), -2.8 + R() * 2.4, 0.97, -3.6 + R() * 0.6));
  for (let i = 0; i < 10; i++) G.add(box(0.1, 0.03, 0.05, std('#e8d898', { roughness: 0.8 }), -2.6 + R() * 2.0, 0.98, -3.5 + R() * 0.4));
  // bảng thực đơn
  const menu = ctex(1024, 400, (g, W, H) => { g.fillStyle = '#141414'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffd34a'; g.font = '900 86px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('BROAD ST. STEAKS', W / 2, 100);
    g.fillStyle = '#ffffff'; g.font = '700 54px Arial'; g.fillText('CHEESESTEAK ........ $14', W / 2, 200); g.fillText('WIT  /  WITOUT', W / 2, 270); g.fillStyle = '#ff6a5a'; g.font = '700 40px Arial'; g.fillText('NO DEFENSE SERVED HERE', W / 2, 345); });
  G.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(5, 1.95), std('#ffffff', { map: menu, emissive: '#ffffff', emissiveMap: menu, emissiveIntensity: 0.35 })), new THREE.Vector3(1.6, 3.0, -3.88)));
  // máy in hóa đơn trên quầy + cuộn giấy (đổi chiều dài theo k)
  const pr = new THREE.Group(); pr.add(box(0.32, 0.18, 0.3, std('#26282c', { roughness: 0.4 }), 0, 0.09, 0)); pr.add(box(0.24, 0.02, 0.06, std('#111'), 0, 0.185, 0.06));
  const rt = receiptTex([{ t: 'BROAD ST. STEAKS', b: 1, s: 28 }, { t: '----------------' }, { t: '1 CHEESESTEAK' }, { t: 'WITOUT DEFENSE' }, { t: '' }, { t: '3PT: 9 / 33', b: 1, s: 40, c: '#b01020' }, { t: '' }, { t: 'THANK YOU' }, { t: 'COME BACK' }, { t: 'WHEN YOU CAN SHOOT' }]);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), std('#ffffff', { map: rt, roughness: 0.9, side: THREE.DoubleSide })); paper.geometry.translate(0, 0.2, 0); paper.position.set(0, 0.19, 0.07); pr.add(paper);
  pr.position.set(2.0, 1.06, -0.75); G.add(pr);
  // đèn treo + bàn ghế khách
  for (let i = -2; i <= 2; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 16, 1, true), std('#c8102e', { side: THREE.DoubleSide })); l.position.set(i * 2.2, 3.6, -1.2); G.add(l); G.add(box(0.02, 0.6, 0.02, std('#111'), i * 2.2, 3.95, -1.2)); G.add(PM(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), std('#fff', { emissive: '#ffe8b8', emissiveIntensity: 1.5 })), new THREE.Vector3(i * 2.2, 3.45, -1.2))); }
  for (const x of [-4, 4]) { G.add(box(1.2, 0.05, 1.2, std('#f2f2f2'), x, 0.9, 2.5)); G.add(box(0.08, 0.9, 0.08, std('#777', { metalness: 0.6 }), x, 0.45, 2.5)); }
  // cửa kính phía trước (hướng +z), thấy phố ngoài
  for (let i = -2; i <= 2; i++) G.add(box(2.2, 3, 0.05, std('#cfe8ff', { transparent: true, opacity: 0.25, roughness: 0.05 }), i * 2.4, 1.6, 5));
  const fr = new THREE.Group(); fr.add(box(1.4, 2.2, 0.7, std('#e8eaee', { metalness: 0.4, roughness: 0.3 }), 0, 1.1, 0)); fr.add(box(1.2, 1.8, 0.02, std('#bfe0ff', { transparent: true, opacity: 0.5, emissive: '#dff0ff', emissiveIntensity: 0.3 }), 0, 1.2, 0.36));
  for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8), std(['#c8102e', '#ff8a1a', '#2a8a3a', '#1d4fa8'][(r + i) % 4])); b.position.set(-0.45 + i * 0.18, 0.55 + r * 0.42, 0.15); fr.add(b); }
  fr.position.set(5.0, 0, -3.4); G.add(fr);
  for (let i = 0; i < 6; i++) { const st_ = new THREE.Group(); st_.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 14), std('#c8102e'))); st_.children[0].position.y = 0.78; st_.add(box(0.06, 0.78, 0.06, std('#8a8f98', { metalness: 0.7 }), 0, 0.39, 0)); st_.position.set(-3 + i * 1.2, 0, 0.3); G.add(st_); }
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.22, 8), std(i % 2 ? '#c8102e' : '#e8c21a')); b.position.set(-2.6 + i * 0.12, 1.17, -0.75); G.add(b); }
  G.add(box(0.2, 0.14, 0.12, std('#c8ccd2', { metalness: 0.7 }), -1.2, 1.13, -0.75));
  [['WIT', 'ONIONS', '#c8102e'], ['WITOUT', 'DEFENSE', '#006bb6'], ['9/33', 'HOUSE SPECIAL', '#1a1a1a'], ['SINCE', '1976', '#2a6a3a']].forEach(([a, b, c], i) => { const p = poster(a, b, c); p.position.set(-5.88, 2.2 + (i % 2) * 0.05, -2.6 + i * 1.3); p.rotation.y = PI / 2; G.add(p); });
  for (const x of [-4, 4]) for (const s of [-1, 1]) { const ch = box(0.45, 0.05, 0.45, std('#c8102e'), x + s * 0.8, 0.48, 2.5); G.add(ch); G.add(box(0.05, 0.48, 0.05, std('#777'), x + s * 0.8, 0.24, 2.5)); }
  return { G: shad(G), paper, rt, printer: pr }; }

// ---------- 3. Bậc thang bảo tàng (leo theo -z) ----------
export const STEP = { n: 36, rise: 0.19, run: 0.45, w: 26 };
export function stepY(z) { if (z >= 0) return 0; const k = Math.min(STEP.n - 1, Math.floor(-z / STEP.run)); return (k + 1) * STEP.rise; }
export function buildSteps(scene) { const G = new THREE.Group(); G.position.x = SET.steps; scene.add(G);
  const stone = std('#d9cdb4', { roughness: 0.85 }), stone2 = std('#cbbd9f', { roughness: 0.85 });
  G.add(box(80, 0.1, 40, std('#bdb6a6', { roughness: 0.95 }), 0, -0.05, 18));
  for (let i = 0; i < STEP.n; i++) G.add(box(STEP.w, STEP.rise * (i + 1), STEP.run, i % 2 ? stone : stone2, 0, STEP.rise * (i + 1) / 2, -i * STEP.run - STEP.run / 2));
  for (const s of [-1, 1]) G.add(box(1.4, STEP.n * STEP.rise + 0.6, STEP.n * STEP.run, std('#c8bb9e'), s * (STEP.w / 2 + 0.7), (STEP.n * STEP.rise + 0.6) / 2, -STEP.n * STEP.run / 2));
  const top = STEP.n * STEP.rise, zt = -STEP.n * STEP.run; G.add(box(60, top, 30, stone, 0, top / 2, zt - 15));
  // mặt tiền cột + trán tường
  const F = new THREE.Group(); for (let i = -5; i <= 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 13, 18), std('#e6dcc6', { roughness: 0.8 })); c.position.set(i * 3.4, 6.5, 0); F.add(c); }
  F.add(box(40, 1.6, 3, std('#e0d4bc'), 0, 13.8, 0)); const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 21, 5, 3, 1), std('#e3d8c0')); ped.rotation.set(PI / 2, 0, PI / 2); ped.scale.set(1, 1, 0.35); ped.position.set(0, 16.6, 0); F.add(ped);
  F.add(box(42, 18, 1, std('#d4c7aa'), 0, 9, -4)); F.position.set(0, top, zt - 10); G.add(F);
  // cây hai bên quảng trường
  for (const s of [-1, 1]) for (let z = 6; z < 34; z += 7) { const cr = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), std('#c8862a', { flatShading: true })); cr.position.set(s * 18, 3.6, z); G.add(cr); G.add(box(0.3, 2.6, 0.3, std('#4a3424'), s * 18, 1.3, z)); }
  for (const s of [-1, 1]) { const bn = banner(s < 0 ? 'ART · HISTORY' : 'OPEN DAILY', 1.6, 5, '#7a1f2a', '#f2e6c8'); bn.position.set(s * 6.8, top + 6, zt - 7.4); G.add(bn); }
  const cart = new THREE.Group(); cart.add(box(2.0, 1.0, 1.0, std('#d8d8dc', { metalness: 0.6, roughness: 0.3 }), 0, 0.7, 0)); cart.add(box(2.2, 0.08, 1.2, std('#c8102e'), 0, 2.2, 0)); for (const s of [-1, 1]) cart.add(box(0.05, 1.0, 0.05, std('#777'), s * 1.0, 1.7, 0));
  const ct = banner('PRETZELS', 1.8, 0.35, '#ffd34a', '#7a1f2a'); ct.position.set(0, 1.0, 0.51); cart.add(ct); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12), std('#151515')); w.rotation.x = PI / 2; w.position.set(s * 0.7, 0.2, 0.5); cart.add(w); }
  cart.position.set(-7, 0, 6); cart.rotation.y = 0.4; G.add(cart);
  for (const s of [-1, 1]) for (let z = 2; z < 30; z += 8) { G.add(box(0.12, 4.2, 0.12, std('#1a1c20', { metalness: 0.5 }), s * 9, 2.1, z)); G.add(box(0.5, 0.3, 0.5, std('#fff6d8', { emissive: '#ffe8b0', emissiveIntensity: 0.4 }), s * 9, 4.3, z)); }
  for (let i = 0; i < 4; i++) { const b = bin(); b.position.set(-12 + i * 8, 0, 3); G.add(b); }
  return { G: shad(G), top, zt }; }

// ---------- 4. Phòng Chuông Tự do ----------
export function buildBell(scene) { const G = new THREE.Group(); G.position.x = SET.bell; scene.add(G);
  G.add(box(16, 0.05, 14, std('#9a8c78', { roughness: 0.6 }), 0, -0.02, 0)); G.add(box(16, 0.1, 14, std('#eef0f2'), 0, 5.2, 0));
  for (let i = -3; i <= 3; i++) G.add(box(2.1, 5, 0.06, std('#d8ecff', { transparent: true, opacity: 0.22, roughness: 0.05 }), i * 2.2, 2.5, -6.5));
  G.add(box(0.3, 5.2, 14, std('#c8beb0'), -8, 2.6, 0)); G.add(box(0.3, 5.2, 14, std('#c8beb0'), 8, 2.6, 0));
  // tháp gạch phía xa sau kính
  const tw = new THREE.Group(); tw.add(box(22, 9, 6, std('#8a3a2a'), 0, 4.5, 0)); tw.add(box(5, 8, 5, std('#8a3a2a'), 0, 13, 0)); tw.add(box(4, 3, 4, std('#f2efe6'), 0, 18.5, 0)); const sp = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 8), std('#e8e2d2')); sp.position.y = 23; tw.add(sp);
  for (let i = -4; i <= 4; i++) tw.add(box(1.1, 1.8, 0.1, std('#f2efe6'), i * 2.3, 4.5, 3.05)); tw.position.set(0, 0, -30); G.add(tw); G.add(box(80, 0.05, 40, std('#7aa05a'), 0, -0.04, -30));
  const bell = libertyBell(1.35); bell.position.set(0, 0.55, -1.5); G.add(bell); G.add(box(2.4, 0.5, 1.2, std('#3a2a1e'), 0, 0.25, -1.5));
  // thêm 18 vết nứt (tổng 19), hiện dần theo k = 0..1
  const cracks = []; const cm = std('#0a0806', { roughness: 1 });
  for (let i = 0; i < 18; i++) { const a0 = -1.1 + (i % 9) * 0.27 + (i > 8 ? 0.12 : 0); const y0 = 0.1 + R() * 0.35; const pts = [];
    for (let j = 0; j <= 6; j++) { const y = y0 + j * (0.06 + R() * 0.03); const r = 0.6 - (y / 1.12) * 0.34 + 0.013; const a = a0 + (j % 2 ? 0.03 : -0.02); pts.push(new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r)); }
    const c = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.01, 4), cm); c.visible = false; bell.add(c); cracks.push(c); }
  const setCracks = (n) => cracks.forEach((c, i) => (c.visible = i < n - 1));
  // dây ngăn khách
  for (const x of [-2.4, -0.8, 0.8, 2.4]) G.add(box(0.06, 0.95, 0.06, std('#c9a04a', { metalness: 0.8, roughness: 0.3 }), x, 0.48, 0.6));
  G.add(box(4.8, 0.05, 0.05, std('#7a1f2a'), 0, 0.85, 0.6));
  const pl = banner('LIBERTY BELL · 1 FAMOUS CRACK', 3.2, 0.5, '#2a2a2a', '#f2e6c8'); pl.position.set(-4.5, 2.6, -6.3); G.add(pl);
  const pl2 = new THREE.Group(); pl2.add(box(0.8, 1.1, 0.06, std('#3a2a1e'), 0, 0.9, 0)); const pt = banner('PLEASE DO NOT TOUCH', 0.7, 0.3, '#f2e6c8', '#3a2a1e'); pt.position.set(0, 1.2, 0.04); pl2.add(pt); pl2.add(box(0.06, 0.4, 0.06, std('#3a2a1e'), 0, 0.2, 0)); pl2.position.set(2.8, 0, 0.2); pl2.rotation.y = -0.4; G.add(pl2);
  for (const x of [-4.5, -3.0, 3.0, 4.5]) G.add(box(0.06, 0.95, 0.06, std('#c9a04a', { metalness: 0.8, roughness: 0.3 }), x, 0.48, 0.6)); G.add(box(9, 0.05, 0.05, std('#7a1f2a'), 0, 0.85, 0.6));
  for (let i = 0; i < 3; i++) { const fr = new THREE.Group(); fr.add(box(1.0, 0.7, 0.04, std('#5a3a22'))); const pp = poster(['1776', '1846', '2026'][i], ['BELL CAST', 'THE CRACK', '19 MORE'][i], '#2a2e38'); pp.scale.set(1.25, 0.62, 1); pp.position.z = 0.025; fr.add(pp); fr.position.set(-7.83, 2.4, -3 + i * 2.2); fr.rotation.y = PI / 2; G.add(fr); }
  return { G: shad(G), bell, setCracks }; }

// ---------- 5. Công viên + bồ câu ----------
export function pigeon() { const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), std('#7a808a')); b.scale.set(1, 0.85, 1.4); b.position.y = 0.1; G.add(b);
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), std('#5a6070')); h.position.set(0, 0.18, 0.1); G.add(h); const n = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 4, 10), std('#4a8a6a', { metalness: 0.4 })); n.rotation.x = PI / 2.2; n.position.set(0, 0.15, 0.08); G.add(n);
  const bk = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.04, 5), std('#2a2a2a')); bk.rotation.x = PI / 2; bk.position.set(0, 0.18, 0.16); G.add(bk);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.008, 5, 4), std('#ff8a2a')); e.position.set(s * 0.03, 0.195, 0.13); G.add(e); }
  const t = box(0.08, 0.02, 0.1, std('#5a6070'), 0, 0.1, -0.13); G.add(t); for (const s of [-1, 1]) G.add(box(0.01, 0.06, 0.01, std('#d86a5a'), s * 0.03, 0.03, 0)); G.userData.head = h; return shad(G); }
// toạ độ ô trên lưới 5x7 cho chữ số 0-9 (font 3x5), trả về danh sách điểm (x,z) của các ô sáng
const DIG = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111', '-': '000000111000000' };
export function digitSpots(str, cell = 0.26) { const pts = []; let ox = 0; const W = str.length * 4 - 1;
  for (const ch of str) { const p = DIG[ch]; for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (p[r * 3 + c] === '1') pts.push([(ox + c - W / 2 + 0.5) * cell, (r - 2) * cell]); ox += 4; } return pts; }
export function buildPark(scene) { const G = new THREE.Group(); G.position.x = SET.park; scene.add(G);
  G.add(box(80, 0.05, 80, std('#6f9a4a', { roughness: 1 }), 0, -0.035, 0)); G.add(box(4, 0.06, 80, std('#c8bca6', { roughness: 0.95 }), 0, -0.031, 0)); G.add(box(30, 0.06, 10, std('#c8bca6', { roughness: 0.95 }), 0, -0.029, 0));
  const bench = () => { const B = new THREE.Group(); const w = std('#7a4a24', { roughness: 0.8 }), m = std('#1a1c20', { metalness: 0.6, roughness: 0.4 }); for (let i = 0; i < 3; i++) B.add(box(1.8, 0.05, 0.12, w, 0, 0.45, -0.15 + i * 0.15)); for (let i = 0; i < 2; i++) B.add(box(1.8, 0.1, 0.04, w, 0, 0.65 + i * 0.16, -0.27)); for (const s of [-1, 1]) B.add(box(0.06, 0.45, 0.5, m, s * 0.8, 0.22, -0.05)); return B; };
  const b1 = bench(); b1.position.set(-1.6, 0, -1.2); G.add(b1); const b2 = bench(); b2.position.set(3.4, 0, -1.2); G.add(b2);
  const can = new THREE.Group(); const cm = std('#2f5a3a', { metalness: 0.4, roughness: 0.5 }); const cy = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.27, 0.9, 16, 1, true), std('#2f5a3a', { metalness: 0.4, roughness: 0.5, side: THREE.DoubleSide })); cy.position.y = 0.45; can.add(cy);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 20), cm); rim.rotation.x = PI / 2; rim.position.y = 0.9; can.add(rim); can.add(PM(new THREE.Mesh(new THREE.CircleGeometry(0.27, 16), std('#111')), new THREE.Vector3(0, 0.6, 0), new THREE.Euler(-PI / 2, 0, 0)));
  can.position.set(1.4, 0, -2.6); G.add(can);
  for (let i = 0; i < 26; i++) { const a = R() * PI * 2, r = 9 + R() * 22; const tr = new THREE.Group(); tr.add(box(0.35, 3, 0.35, std('#4a3424'), 0, 1.5, 0)); const cr = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + R(), 0), std(['#c8862a', '#b85a22', '#d8a33a', '#8aa04a'][Math.floor(R() * 4)], { flatShading: true })); cr.position.y = 4.2; tr.add(cr); tr.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 6); G.add(tr); }
  // nhà cao tầng phía xa
  for (let i = 0; i < 14; i++) { const h = 20 + R() * 40; G.add(box(8 + R() * 6, h, 8, std(['#8a96a8', '#a8a090', '#6a7a8e', '#b8b0a0'][i % 4], { roughness: 0.6, metalness: 0.2 }), -60 + i * 9, h / 2, -55 - R() * 10)); }
  const fn = new THREE.Group(); const fb = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 32), std('#cfc7b8')); fb.position.y = 0.3; fn.add(fb); const fw = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 0.05, 32), std('#5a9ad0', { roughness: 0.05, metalness: 0.3 })); fw.position.y = 0.56; fn.add(fw);
  const fc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.6, 16), std('#cfc7b8')); fc.position.y = 1.1; fn.add(fc); const sp = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 16, 1, true), std('#bfe6ff', { transparent: true, opacity: 0.45, side: THREE.DoubleSide })); sp.position.y = 2.4; sp.rotation.x = PI; fn.add(sp); fn.position.set(-6, 0, -9); G.add(fn);
  for (const x of [-4.5, 6.5]) { G.add(box(0.12, 3.6, 0.12, std('#1a1c20', { metalness: 0.5 }), x, 1.8, -2.2)); G.add(box(0.45, 0.3, 0.45, std('#fff6d8', { emissive: '#ffe8b0', emissiveIntensity: 0.4 }), x, 3.7, -2.2)); }
  const b3 = bench(); b3.position.set(-5, 0, 2.2); b3.rotation.y = PI; G.add(b3); const b4 = bench(); b4.position.set(7.2, 0, -1.2); G.add(b4);
  const bn = banner('PARK RULES: NO BRICKS', 2.4, 0.5, '#2f5a3a', '#f2e6c8'); bn.position.set(-2.2, 1.6, -4.2); G.add(bn); G.add(box(0.06, 1.4, 0.06, std('#2a2a2a'), -2.2, 0.7, -4.25));
  const birds = []; for (let i = 0; i < 64; i++) { const p = pigeon(); p.visible = false; G.add(p); birds.push(p); }
  return { G: shad(G), can, birds }; }

// ---------- 6. Xe buýt (nội thất, dọc theo -z = phía đầu xe) ----------
export function ledTex() { return ctex(1024, 128, (g, W, H) => drawLed(g, W, H, 'NEXT STOP')); }
export function drawLed(g, W, H, txt) { g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, W, H); g.fillStyle = '#ff9a1a'; g.font = '900 88px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#ff7a00'; g.shadowBlur = 12; g.fillText(txt, W / 2, H / 2 + 4); }
export function tvTex() { return ctex(512, 288, (g, W, H) => drawTv(g, W, H, 0)); }
export function drawTv(g, W, H, k) { g.fillStyle = '#c8955a'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1a1a'; g.fillRect(0, H * 0.72, W, H * 0.28); g.fillStyle = '#ffffff'; g.font = '900 34px Arial'; g.textAlign = 'left';
  g.fillText('AVDIJA  ' + (k < 0.5 ? '25 PTS · 1ST HALF' : '31 PTS'), 16, H * 0.86); g.fillStyle = '#000'; g.beginPath(); const x = 140 + k * 220; g.arc(x, 110, 22, 0, 7); g.fill(); g.fillRect(x - 18, 130, 36, 70); g.fillStyle = '#c8102e'; g.fillRect(x - 18, 130, 36, 46);
  g.fillStyle = '#e86a1a'; g.beginPath(); g.arc(x + 30 + k * 60, 80 - k * 40, 12, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.ellipse(W - 70, 70, 34, 8, 0, 0, 7); g.stroke();
  g.fillStyle = '#e81a1a'; g.beginPath(); g.arc(W - 30, 26, 9, 0, 7); g.fill(); g.font = '700 18px Arial'; g.fillText('REPLAY', W - 120, 32); }
export function buildBus(scene) { const G = new THREE.Group(); G.position.x = SET.bus; scene.add(G);
  const L = 12, Wd = 2.5, Hh = 2.3;
  G.add(box(Wd, 0.06, L, std('#4a4e56', { roughness: 0.9 }), 0, -0.03, 0)); G.add(box(Wd, 0.06, L, std('#e6e8ea'), 0, Hh, 0));
  for (const s of [-1, 1]) { G.add(box(0.06, 0.95, L, std('#d6dade'), s * Wd / 2, 0.47, 0)); G.add(box(0.06, 0.3, L, std('#d6dade'), s * Wd / 2, Hh - 0.15, 0));
    for (let i = 0; i < 6; i++) G.add(box(0.04, 1.0, 1.7, std('#b8d8f0', { transparent: true, opacity: 0.35, roughness: 0.05, emissive: '#cfe8ff', emissiveIntensity: 0.25 }), s * Wd / 2, 1.45, -4.8 + i * 1.9)); }
  const seatM = std('#2a5ca8', { roughness: 0.7 }); for (const s of [-1, 1]) for (let i = 0; i < 5; i++) { const z = -2.8 + i * 1.3; G.add(box(0.8, 0.12, 0.5, seatM, s * 0.75, 0.48, z)); G.add(box(0.8, 0.55, 0.1, seatM, s * 0.75, 0.78, z + 0.25)); G.add(box(0.06, 0.45, 0.06, std('#777'), s * 0.75, 0.22, z)); }
  const pole = std('#e8c84a', { metalness: 0.6, roughness: 0.3 }); for (let i = 0; i < 5; i++) G.add(box(0.05, Hh, 0.05, pole, (i % 2 ? 1 : -1) * 0.32, Hh / 2, -3 + i * 1.6)); G.add(box(0.04, 0.04, L * 0.8, pole, 0.3, Hh - 0.25, 0)); G.add(box(0.04, 0.04, L * 0.8, pole, -0.3, Hh - 0.25, 0));
  // bảng LED phía đầu xe + kính lái + ghế tài xế + hộp vé
  const led = ledTex(); G.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.24), std('#ffffff', { map: led, emissive: '#ffffff', emissiveMap: led, emissiveIntensity: 0.9 })), new THREE.Vector3(0, Hh - 0.2, -4.9)));
  G.add(box(Wd, 1.2, 0.05, std('#d8ecff', { transparent: true, opacity: 0.3, roughness: 0.05, emissive: '#dff0ff', emissiveIntensity: 0.3 }), 0, 1.5, -5.95));
  G.add(box(Wd, 0.9, 0.6, std('#2a2c30'), 0, 0.45, -5.6)); const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 24), std('#111')); wheel.rotation.x = -PI / 3; wheel.position.set(-0.6, 1.0, -5.2); G.add(wheel);
  G.add(box(0.55, 0.12, 0.5, std('#333'), -0.6, 0.5, -4.6)); G.add(box(0.55, 0.6, 0.1, std('#333'), -0.6, 0.8, -4.35));
  const fare = ctex(256, 128, (g, W, H) => { g.fillStyle = '#0c1a0c'; g.fillRect(0, 0, W, H); g.fillStyle = '#5aff6a'; g.font = '900 56px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$9.33', W / 2, H / 2 + 2); });
  const fb = new THREE.Group(); fb.add(box(0.28, 1.0, 0.28, std('#8a8f98', { metalness: 0.7, roughness: 0.3 }), 0, 0.5, 0)); fb.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.11), std('#fff', { map: fare, emissive: '#fff', emissiveMap: fare, emissiveIntensity: 0.8 })), new THREE.Vector3(0, 0.92, 0.145)));
  fb.position.set(0.3, 0, -4.7); G.add(fb);
  const tv = tvTex(); const tvm = new THREE.Group(); tvm.add(box(0.42, 0.27, 0.04, std('#111'), 0, 0, 0)); tvm.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.215), std('#fff', { map: tv, emissive: '#fff', emissiveMap: tv, emissiveIntensity: 0.85 })), new THREE.Vector3(0, 0, 0.022)));
  tvm.position.set(-0.2, 1.35, -5.35); tvm.rotation.y = 0.5; G.add(tvm);
  // phố trôi ngoài cửa sổ (dải nhà gạch đơn giản di chuyển)
  const out = new THREE.Group(); for (const s of [-1, 1]) for (let i = 0; i < 24; i++) { const h = 6 + R() * 6; out.add(box(4.6, h, 0.4, std(['#8a3a2a', '#9a4632', '#a8553a', '#6e2e22'][i % 4]), s * 7, h / 2, -40 + i * 5)); } G.add(out); G.add(box(40, 0.05, 200, std('#3a3c40'), 0, -0.3, 0));
  [['9 FOR 33?', 'LEARN TO SHOOT · CALL NOW'], ['BRICK SALE', 'ALL 24 BENCH PTS'], ['PDX FLIGHTS', 'ONE-WAY · $9.33']].forEach(([a, b], i) => { for (const s of [-1, 1]) { const ad = banner(a + '  ' + b, 1.7, 0.3, i % 2 ? '#006bb6' : '#fbf8ef', i % 2 ? '#fff' : '#c8102e'); ad.position.set(s * 1.2, Hh - 0.22, -3 + i * 2.6); ad.rotation.y = -s * PI / 2; G.add(ad); } });
  for (let i = 0; i < 4; i++) G.add(box(0.02, 0.18, 0.12, std('#e8c84a'), 0.3, Hh - 0.42, -2.6 + i * 1.6));
  return { G: shad(G), led, tv, out }; }

// ---------- 7. Hầm nhà thi đấu + linh vật Franklin (chó xanh tự thiết kế) ----------
export function makeFranklin() { const G = new THREE.Group(); const fur = std('#2f6fd0', { roughness: 0.95 }), fur2 = std('#e8eef8', { roughness: 0.95 }), red = std('#e0283c', { roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.45, 6, 12), std('#f4f4f2')); body.position.y = 0.95; G.add(body);
  const num = ctex(256, 256, (g, W) => { g.fillStyle = '#f4f4f2'; g.fillRect(0, 0, W, W); g.fillStyle = '#1d4fa8'; g.font = '900 150px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('76', W / 2, W / 2 + 8); });
  const chest = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), std('#fff', { map: num, transparent: true })); chest.position.set(0, 1.0, 0.305); G.add(chest);
  const hip = new THREE.Group(); hip.position.y = 0.6; G.add(hip); const legs = []; for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.35, 4, 8), fur); l.geometry.translate(0, -0.25, 0); l.position.x = s * 0.15; hip.add(l); const ft = box(0.18, 0.1, 0.3, std('#ffffff'), 0, -0.5, 0.06); l.add(ft); legs.push(l); }
  const head = new THREE.Group(); head.position.y = 1.55; G.add(head); const sk = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 16), fur); sk.scale.set(1, 0.95, 1); head.add(sk);
  const muz = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), fur2); muz.scale.set(1.1, 0.8, 1.1); muz.position.set(0, -0.08, 0.27); head.add(muz); const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#111')); nose.position.set(0, -0.02, 0.44); head.add(nose);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), std('#fff')); e.position.set(s * 0.12, 0.08, 0.26); head.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std('#111')); p.position.set(s * 0.12, 0.08, 0.33); head.add(p);
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.25, 4, 8), std('#1d4fa8', { roughness: 0.95 })); ear.position.set(s * 0.3, -0.05, 0); ear.rotation.z = s * 0.4; head.add(ear); }
  const tongue = box(0.08, 0.02, 0.1, std('#e86a7a'), 0, -0.2, 0.36); head.add(tongue); const brow = []; for (const s of [-1, 1]) { const b = box(0.12, 0.025, 0.02, std('#0d2a66'), s * 0.12, 0.19, 0.3); b.rotation.z = s * 0.3; head.add(b); brow.push(b); }
  const arms = []; for (const s of [-1, 1]) { const a = new THREE.Group(); a.position.set(s * 0.36, 1.25, 0); G.add(a); const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.4, 4, 8), fur); m.geometry.translate(0, -0.25, 0); a.add(m); const pw = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), fur2); pw.position.y = -0.52; a.add(pw); arms.push(a); }
  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.3, 4, 8), fur); tail.position.set(0, 0.75, -0.3); tail.rotation.x = -0.9; G.add(tail);
  G.userData = { head, arms, legs, tail, brow, hip }; return shad(G); }
export function poseFranklin(F, t, o = {}) { const U = F.userData; const sad = o.sad || 0; U.head.rotation.set(0.25 * sad + Math.sin(t * 1.7) * 0.05, (o.look || 0) + Math.sin(t * 0.9) * 0.08, 0);
  U.brow.forEach((b, i) => (b.rotation.z = (i ? -1 : 1) * (0.3 - 0.7 * sad)));
  U.tail.rotation.z = Math.sin(t * (sad ? 1.5 : 9)) * (sad ? 0.1 : 0.5);
  const w = o.walk || 0; U.legs.forEach((l, i) => (l.rotation.x = Math.sin(t * 7 + i * PI) * 0.6 * w)); F.position.y = Math.abs(Math.sin(t * 7)) * 0.04 * w;
  if (o.pack != null) { const k = o.pack; U.arms.forEach((a, i) => { a.rotation.x = -0.9 - 0.5 * Math.sin(t * 5 + i) * (1 - k); a.rotation.z = (i ? -1 : 1) * 0.2; }); }
  else if (o.wave) U.arms.forEach((a, i) => { a.rotation.z = i ? -2.6 + Math.sin(t * 12) * 0.4 : 0.15; a.rotation.x = 0; });
  else U.arms.forEach((a, i) => { a.rotation.z = (i ? -1 : 1) * 0.15; a.rotation.x = Math.sin(t * 1.5 + i) * 0.08; }); }
export function suitcase(c = '#c8102e') { const G = new THREE.Group(); const lid = new THREE.Group(); const m = std(c, { roughness: 0.5 });
  G.add(box(0.75, 0.22, 0.5, m, 0, 0.11, 0)); lid.add(box(0.75, 0.04, 0.5, m, 0, 0, 0.25)); lid.position.set(0, 0.22, -0.25); G.add(lid);
  for (let i = 0; i < 6; i++) G.add(box(0.2 + R() * 0.2, 0.06, 0.15, std(['#1d4fa8', '#ffffff', '#e0283c', '#ffd34a'][i % 4]), -0.2 + (i % 3) * 0.2, 0.2, -0.1 + Math.floor(i / 3) * 0.2));
  G.userData.lid = lid; return shad(G); }
export function scarf() { const tx = ctex(256, 64, (g, W, H) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#111111' : '#e03a3e'; g.fillRect(i * 32, 0, 32, H); } g.fillStyle = '#fff'; g.font = '900 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PORTLAND', W / 2, H / 2); });
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 20), std('#e03a3e', { roughness: 0.9 })); m.rotation.x = PI / 2; const G = new THREE.Group(); G.add(m);
  const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.55), std('#fff', { map: tx, side: THREE.DoubleSide })); tail.position.set(0.12, -0.28, 0.2); G.add(tail); return shad(G); }
export function ticket() { const tx = ctex(256, 128, (g, W, H) => { g.fillStyle = '#f2e6c8'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1a1a'; g.font = '900 30px Arial'; g.textAlign = 'center'; g.fillText('ONE-WAY', W / 2, 50); g.fillText('PHL → PDX', W / 2, 95); });
  return new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.11), std('#fff', { map: tx, side: THREE.DoubleSide })); }
export function buildTunnel(scene) { const G = new THREE.Group(); G.position.x = SET.tunnel; scene.add(G);
  G.add(box(8, 0.05, 30, std('#5a5e66', { roughness: 0.6 }), 0, -0.02, 0)); G.add(box(8, 0.1, 30, std('#2a2c30'), 0, 3.6, 0));
  for (const s of [-1, 1]) { G.add(box(0.3, 3.6, 30, std('#1d3a7a', { roughness: 0.6 }), s * 4, 1.8, 0)); G.add(box(0.32, 0.4, 30, std('#e0283c'), s * 3.98, 1.2, 0)); }
  for (let z = -12; z <= 12; z += 4) G.add(box(1.2, 0.06, 0.4, std('#ffffff', { emissive: '#ffffff', emissiveIntensity: 1.2 }), 0, 3.55, z));
  const wall = ctex(1024, 256, (g, W, H) => { g.fillStyle = '#1d3a7a'; g.fillRect(0, 0, W, H); g.font = '900 120px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText('PHILADELPHIA 76ERS', W / 2, H / 2); });
  G.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), std('#fff', { map: wall })), new THREE.Vector3(0, 2.3, -14.9)));
  G.add(box(3, 2.6, 0.1, std('#f4f4f2', { emissive: '#ffffff', emissiveIntensity: 0.6 }), 0, 1.3, 14.9));
  const F = makeFranklin(); G.add(F); const S = suitcase(); G.add(S); const SC = scarf(); G.add(SC); const TK = ticket(); G.add(TK);
  // bảng thành tích treo tường
  const rec = ctex(512, 256, (g, W, H) => { g.fillStyle = '#0d1a33'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 92px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('14 – 4', W / 2, 115); g.fillStyle = '#ffd34a'; g.font = '700 46px Arial'; g.fillText('1ST IN THE EAST', W / 2, 190); });
  G.add(PM(new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), std('#fff', { map: rec, emissive: '#fff', emissiveMap: rec, emissiveIntensity: 0.4 })), new THREE.Vector3(-3.83, 2.2, -4), new THREE.Euler(0, PI / 2, 0)));
  const cart = new THREE.Group(); cart.add(box(1.2, 0.05, 0.7, std('#8a8f98', { metalness: 0.7 }), 0, 0.5, 0)); for (const s of [-1, 1]) for (const q of [-1, 1]) cart.add(box(0.04, 1.0, 0.04, std('#8a8f98', { metalness: 0.7 }), s * 0.58, 0.5, q * 0.33));
  for (let i = 0; i < 12; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), std('#c8541f')); b.position.set(-0.45 + (i % 4) * 0.3, 0.65 + Math.floor(i / 4) * 0.2, -0.15 + (i % 2) * 0.3); cart.add(b); }
  cart.position.set(2.8, 0, -6); G.add(cart);
  const hamper = box(1.0, 0.9, 0.7, std('#2a2c30'), -2.8, 0.45, 4); G.add(hamper); for (let i = 0; i < 5; i++) G.add(box(0.5, 0.06, 0.4, std(['#f4f4f2', '#006bb6', '#ed174c'][i % 3]), -2.8 + (R() - 0.5) * 0.5, 0.92 + i * 0.03, 4 + (R() - 0.5) * 0.3));
  const sign2 = banner('LOCKER ROOM →', 2.4, 0.45, '#ffffff', '#1d3a7a'); sign2.position.set(3.83, 2.5, 3); sign2.rotation.y = -PI / 2; G.add(sign2);
  return { G: shad(G), F, S, SC, TK }; }

// ---------- ánh sáng ngày: hemi + mặt trời có bóng (đi theo bối cảnh đang quay) ----------
export function dayLights(scene) { scene.background = new THREE.Color('#9cc8ee'); scene.fog = new THREE.Fog('#b8d4ee', 60, 170);
  const hemi = new THREE.HemisphereLight('#e8f2ff', '#8a7a62', 2.6); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff2dc', 3.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 90 }); sun.shadow.bias = -0.0004; scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#dfe8ff', 1.2); scene.add(fill); scene.add(fill.target);
  const at = (x, z, indoor = false, warm = false) => { sun.target.position.set(x, 0, z); sun.position.set(x - 10, 24, z + 14); fill.target.position.set(x, 1, z); fill.position.set(x + 12, 8, z + 10);
    hemi.intensity = indoor ? 2.4 : 2.6; sun.intensity = indoor ? 2.2 : 3.6; sun.color.set(warm ? '#ffd9a8' : '#fff2dc'); scene.background.set(indoor ? '#c8d8e8' : '#9cc8ee'); };
  return { hemi, sun, fill, at }; }
