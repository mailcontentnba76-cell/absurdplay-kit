// 10 Thing USA — E01 Jokić: các bối cảnh phụ (mỗi cảnh một khu riêng, cách xa nhau trên trục x để không lẫn bóng/đèn).
// Không logo/nhãn hiệu thật: TV chiếu quảng cáo "burrito" chung chung, chai nước ngọt đỏ ghi "SODA 3L".
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { canvasTex } from './nba.js';

export const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof m === 'string' ? std(m) : m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; return b; };
const cyl = (r0, r1, h, m, x = 0, y = 0, z = 0, seg = 20) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), typeof m === 'string' ? std(m) : m); c.position.set(x, y, z); c.castShadow = true; c.receiveShadow = true; return c; };
const shadowAll = (g) => g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// vị trí gốc của từng khu (m)
export const ZONE = { living: [200, 0], bedroom: [240, 0], kitchen: [280, 0], soda: [320, 0], gym: [360, 0], stable: [400, 0], equip: [440, 0], street: [560, 0], track: [760, 0] };

// phòng 3 vách (mở phía +z để máy quay nhìn vào), sàn + trần
function room(G, w, d, h, wall, floor, ceil = '#f2efe8') {
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), typeof floor === 'string' ? std(floor, { roughness: 0.55 }) : floor); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; G.add(fl);
  const wm = typeof wall === 'string' ? std(wall, { roughness: 0.9 }) : wall;
  G.add(box(w, h, 0.1, wm, 0, h / 2, -d / 2)); G.add(box(0.1, h, d, wm, -w / 2, h / 2, 0)); G.add(box(0.1, h, d, wm, w / 2, h / 2, 0));
  const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), std(ceil)); c.rotation.x = Math.PI / 2; c.position.y = h; G.add(c);
}
function windowPane(w, h, sky, frame = '#f4f4f0') { const g = new THREE.Group(); const gl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: sky })); g.add(gl);
  const fm = std(frame); for (const [x, y, ww, hh] of [[0, h / 2, w + 0.1, 0.06], [0, -h / 2, w + 0.1, 0.06], [-w / 2, 0, 0.06, h], [w / 2, 0, 0.06, h], [0, 0, 0.04, h], [0, 0, w, 0.04]]) g.add(box(ww, hh, 0.05, fm, x, y, 0.02)); return g; }
export const skyTex = (top, bot, stars = 0, city = null) => canvasTex(512, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const R = rnd(7); for (let i = 0; i < stars; i++) { g.fillStyle = `rgba(255,255,240,${0.4 + R() * 0.6})`; g.fillRect(R() * W, R() * H * 0.6, 2, 2); }
  if (city) { g.fillStyle = city; for (let x = 0; x < W; x += 30 + R() * 20) { const hh = 60 + R() * 160; g.fillRect(x, H - hh, 26 + R() * 14, hh); g.fillStyle = 'rgba(255,220,140,0.9)'; for (let k = 0; k < 6; k++) if (R() > 0.5) g.fillRect(x + 4 + R() * 16, H - hh + 10 + R() * (hh - 20), 4, 6); g.fillStyle = city; } } });

// ---------- 1. Phòng khách + TV chiếu quảng cáo burrito, dòng chữ chạy tên được chọn ----------
export function buildLiving(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.living[0], 0, ZONE.living[1]); scene.add(G);
  const floor = canvasTex(512, 512, (g, W, H) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#a8774c' : '#b5845a'; g.fillRect(0, i * 32, W, 32); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, i * 32, W, 2); } }, [3, 3]);
  room(G, 7, 6, 3, '#e7d8b8', new THREE.MeshStandardMaterial({ map: floor, roughness: 0.5 }));
  // ti vi + kệ
  G.add(box(2.2, 0.5, 0.45, '#5a3d28', 0, 0.25, -2.6));
  const tvW = 1.9, tvH = 1.07; const frame = box(tvW + 0.06, tvH + 0.06, 0.06, '#111111', 0, 1.25, -2.6); G.add(frame);
  const tvTex = canvasTex(1024, 576, () => {}); const screen = new THREE.Mesh(new THREE.PlaneGeometry(tvW, tvH), new THREE.MeshBasicMaterial({ map: tvTex, toneMapped: false })); screen.position.set(0, 1.25, -2.565); G.add(screen);
  const tvLight = new THREE.PointLight('#ffb45a', 1.8, 6, 1.6); tvLight.position.set(0, 1.3, -1.8); G.add(tvLight);
  // ghế sofa
  const sofa = new THREE.Group(); sofa.add(box(2.4, 0.42, 0.95, '#4a6a8a', 0, 0.21, 0)); sofa.add(box(2.4, 0.55, 0.22, '#45627f', 0, 0.62, -0.4)); for (const s of [-1, 1]) sofa.add(box(0.22, 0.6, 0.95, '#45627f', s * 1.2, 0.3, 0));
  for (const s of [-0.6, 0.6]) sofa.add(box(1.1, 0.14, 0.8, '#557697', s, 0.49, 0.05)); sofa.position.set(0, 0, 1.1); sofa.rotation.y = Math.PI; G.add(sofa);
  // thảm, đèn, cửa sổ đêm
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40), std('#9a3b2e', { roughness: 0.95 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.005, -0.6); G.add(rug);
  G.add(cyl(0.02, 0.02, 1.5, '#2a2a2a', 2.6, 0.75, -2.3)); G.add(cyl(0.18, 0.28, 0.32, '#f2e2b8', 2.6, 1.6, -2.3)); const lamp = new THREE.PointLight('#ffd9a0', 1.2, 6); lamp.position.set(2.6, 1.55, -2.0); G.add(lamp);
  const win = windowPane(1.4, 1.1, skyTex('#0b1530', '#2a3a6a', 60, '#141a2a')); win.position.set(-2.2, 1.6, -2.94); G.add(win);
  // bàn nhỏ + bát bỏng ngô
  G.add(box(0.9, 0.4, 0.5, '#6a4a30', 0, 0.2, 0.0)); G.add(cyl(0.16, 0.1, 0.1, '#d23a2a', 0.15, 0.45, 0.0));
  shadowAll(G);
  // vẽ màn hình: k = tiến độ (0..1) để dòng chữ chạy; dùng sau khi font Anton đã nạp
  const drawTV = (t, k) => { const cv = tvTex.userData.cv, g = cv.getContext('2d'), W = cv.width, H = cv.height;
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#5a1a7a'); gr.addColorStop(1, '#e0398a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // burrito/quesadilla chung chung (không thương hiệu) nảy nhẹ + tia sáng
    g.save(); g.translate(W * 0.38, H * 0.46 + Math.sin(t * 6) * 8); g.rotate(-0.25 + Math.sin(t * 2) * 0.05);
    for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillStyle = 'rgba(255,230,120,0.18)'; g.fillRect(0, -10, 420, 20); }
    g.fillStyle = '#e9c27a'; g.beginPath(); g.ellipse(0, 0, 230, 92, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#d4a254'; for (let i = -3; i <= 3; i++) { g.beginPath(); g.ellipse(i * 60, 10, 18, 70, 0.4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#f5d33a'; g.beginPath(); g.ellipse(170, 20, 70, 40, 0.3, 0, Math.PI * 2); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(150, 0, 14, 0, 7); g.fill(); g.fillStyle = '#3ca34a'; g.beginPath(); g.arc(190, 30, 12, 0, 7); g.fill(); g.restore();
    g.fillStyle = '#ffffff'; g.font = '900 86px Anton, Impact, sans-serif'; g.textAlign = 'left'; g.fillText('NEW!', 640, 170); g.font = '900 64px Anton, Impact, sans-serif'; g.fillStyle = '#ffe14a'; g.fillText('CHEESY', 640, 260); g.fillText('BURRITO', 640, 330); g.fillStyle = '#ffffff'; g.font = '900 54px Anton, Impact, sans-serif'; g.fillText('ONLY $1.99', 640, 410);
    // dòng chữ chạy dưới màn hình
    g.fillStyle = '#0c1a3a'; g.fillRect(0, H - 74, W, 74); g.fillStyle = '#ffcc33'; g.fillRect(0, H - 74, 150, 74); g.fillStyle = '#0c1a3a'; g.font = '900 34px Anton, Impact, sans-serif'; g.fillText('DRAFT', 22, H - 24);
    g.save(); g.beginPath(); g.rect(150, H - 74, W - 150, 74); g.clip(); g.fillStyle = '#ffffff'; g.font = '900 38px Anton, Impact, sans-serif';
    g.fillText('ROUND 2 · PICK 41 · DENVER — NIKOLA JOKIĆ (SERBIA)', 1000 - k * 1150, H - 24); g.restore();
    tvTex.needsUpdate = true; };
  return { G, sofa, screen, drawTV, tvPos: new THREE.Vector3(ZONE.living[0], 1.25, ZONE.living[1] - 2.6), seat: new THREE.Vector3(ZONE.living[0] + 0.55, 0, ZONE.living[1] + 1.05) };
}

// ---------- 2. Phòng ngủ ban đêm, điện thoại rung trên bàn đầu giường ----------
export function buildBedroom(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.bedroom[0], 0, ZONE.bedroom[1]); scene.add(G);
  room(G, 6, 5, 2.8, '#3e4f72', '#6a5240', '#2a3550');
  // giường rộng dài (người cao 2,11 m: chân thò ra ngoài cho vui)
  const bed = new THREE.Group(); bed.add(box(1.9, 0.35, 2.15, '#5a3b26', 0, 0.18, 0)); bed.add(box(1.8, 0.22, 2.05, '#f2f2ee', 0, 0.46, 0)); bed.add(box(1.9, 1.0, 0.1, '#5a3b26', 0, 0.5, -1.1));
  for (const s of [-0.45, 0.45]) bed.add(box(0.7, 0.14, 0.4, '#ffffff', s, 0.63, -0.8));
  const blanket = box(1.86, 0.12, 1.25, '#c84a3a', 0, 0.62, 0.35); bed.add(blanket); bed.position.set(0, 0, -0.9); G.add(bed);
  // bàn đầu giường + điện thoại + đèn ngủ
  G.add(box(0.5, 0.55, 0.45, '#6a4a30', 1.3, 0.275, -1.75));
  const phone = new THREE.Group(); phone.add(box(0.08, 0.012, 0.16, '#111111')); const scrTex = canvasTex(160, 320, (g, W, H) => { g.fillStyle = '#123'; g.fillRect(0, 0, W, H); });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.072, 0.15), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false })); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.007; phone.add(scr); phone.position.set(1.25, 0.56, -1.7); G.add(phone);
  const glow = new THREE.PointLight('#8fd0ff', 0, 1.6); glow.position.set(1.25, 0.75, -1.7); G.add(glow);
  G.add(cyl(0.07, 0.1, 0.22, '#e8d6a8', 1.42, 0.66, -1.85));
  const moonWin = windowPane(1.2, 1.2, skyTex('#05081a', '#1a2550', 120)); moonWin.position.set(-1.6, 1.6, -2.44); G.add(moonWin);
  const moon = new THREE.DirectionalLight('#8aa8ff', 0.9); moon.position.set(-3, 4, 1); moon.target.position.set(0, 0, -1); G.add(moon); G.add(moon.target);
  shadowAll(G);
  const drawPhone = (t, on) => { const cv = scrTex.userData.cv, g = cv.getContext('2d'), W = cv.width, H = cv.height; g.fillStyle = on ? '#1e7a3e' : '#0a0f18'; g.fillRect(0, 0, W, H);
    if (on) { g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.font = '900 30px Anton, Impact, sans-serif'; g.fillText('BROTHER', W / 2, 90); g.font = '700 18px sans-serif'; g.fillText('calling…', W / 2, 120);
      g.beginPath(); g.arc(W / 2, 230 + Math.sin(t * 20) * 4, 34, 0, 7); g.fillStyle = '#3ad16a'; g.fill(); }
    scrTex.needsUpdate = true; };
  return { G, phone, glow, drawPhone, bedTop: new THREE.Vector3(ZONE.bedroom[0], 0.62, ZONE.bedroom[1] - 0.9) };
}

// ---------- 3. Bếp: bàn ăn + đĩa taco ----------
export function taco() { const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.13, 24, 1, true, 0, Math.PI), std('#e8b85a', { side: THREE.DoubleSide, roughness: 0.8 })); shell.rotation.z = Math.PI / 2; shell.rotation.y = Math.PI / 2; g.add(shell);
  const fill = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.06), std('#7a3a1a')); fill.position.y = -0.02; g.add(fill);
  const let_ = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), std('#4caf3a')); let_.position.y = 0.0; g.add(let_);
  const ch = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.012, 0.07), std('#f5c63a')); ch.position.y = 0.012; g.add(ch); shadowAll(g); return g; }
export function buildKitchen(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.kitchen[0], 0, ZONE.kitchen[1]); scene.add(G);
  const tile = canvasTex(256, 256, (g, W) => { g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, W, W); g.strokeStyle = '#c9c2b4'; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, W); g.moveTo(0, i * 64); g.lineTo(W, i * 64); g.stroke(); } }, [6, 6]);
  room(G, 7, 6, 3, '#9fd0c4', new THREE.MeshStandardMaterial({ map: tile, roughness: 0.4 }));
  // tủ bếp sau lưng
  for (let i = -3; i <= 3; i++) { G.add(box(0.9, 0.9, 0.6, '#f2f2ee', i * 0.95, 0.45, -2.65)); G.add(box(0.9, 0.7, 0.35, '#f2f2ee', i * 0.95, 2.1, -2.8)); }
  G.add(box(6.8, 0.05, 0.62, '#3a3a3a', 0, 0.92, -2.65));
  // bàn ăn + khăn đỏ + đĩa taco
  G.add(box(1.6, 0.06, 0.9, '#c8ab84', 0, 0.76, 0)); for (const [x, z] of [[-0.72, -0.38], [0.72, -0.38], [-0.72, 0.38], [0.72, 0.38]]) G.add(cyl(0.03, 0.03, 0.76, '#7a5a3a', x, 0.38, z));
  const plate = cyl(0.22, 0.18, 0.025, std('#ffffff', { roughness: 0.3 }), 0, 0.8, 0.1, 32); G.add(plate);
  const tacos = [-0.08, 0.06, 0.18].map((x, i) => { const t = taco(); t.position.set(x - 0.04, 0.88, 0.1 + (i - 1) * 0.02); t.rotation.y = 0.3 * (i - 1); G.add(t); return t; });
  const light = new THREE.PointLight('#fff2d8', 1.6, 7); light.position.set(0, 2.6, 0.3); G.add(light);
  G.add(cyl(0.25, 0.04, 0.2, '#e8c44a', 0, 2.75, 0.2)); shadowAll(G);
  return { G, plate, tacos, table: new THREE.Vector3(ZONE.kitchen[0], 0.8, ZONE.kitchen[1]) };
}

// ---------- 4. Tháp chai nước ngọt 3 lít (đỏ trơn, ghi SODA 3L) ở góc bếp nhà quê Serbia ----------
export function sodaBottle(h = 0.36) { const pts = [[0.0, 0], [0.055, 0], [0.06, 0.015], [0.058, 0.05], [0.062, 0.18], [0.06, 0.25], [0.04, 0.3], [0.018, 0.33], [0.016, 0.36]].map(([r, y]) => new THREE.Vector2(r * h / 0.36 * 1.0, y * h / 0.36));
  const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), std('#5a0f0c', { roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.92 })); g.add(body);
  const lab = canvasTex(256, 64, (c, W, H) => { c.fillStyle = '#d4171c'; c.fillRect(0, 0, W, H); c.fillStyle = '#ffffff'; c.font = '900 40px Anton, Impact, sans-serif'; c.textAlign = 'center'; c.fillText('SODA 3L', W / 2, 46); });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.0625 * h / 0.36, 0.0625 * h / 0.36, 0.07 * h / 0.36, 24, 1, true), std('#ffffff', { map: lab, roughness: 0.5 })); label.position.y = 0.13 * h / 0.36; g.add(label);
  g.add(cyl(0.02 * h / 0.36, 0.02 * h / 0.36, 0.025 * h / 0.36, '#d4171c', 0, 0.37 * h / 0.36, 0, 12)); shadowAll(g); return g; }
export function buildSoda(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.soda[0], 0, ZONE.soda[1]); scene.add(G);
  const wood = canvasTex(512, 512, (g, W, H) => { g.fillStyle = '#9a6a42'; g.fillRect(0, 0, W, H); const R = rnd(3); for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(60,30,10,${0.15 + R() * 0.2})`; g.beginPath(); const y = R() * H; g.moveTo(0, y); g.bezierCurveTo(W / 3, y + R() * 20 - 10, W * 2 / 3, y + R() * 20 - 10, W, y); g.stroke(); } }, [2, 2]);
  room(G, 7, 6, 3, '#e8c98a', new THREE.MeshStandardMaterial({ map: wood, roughness: 0.6 }));
  // tháp chai hình kim tự tháp, cao hơn người 2,11 m
  const bottles = []; const N = 7; let row = 0;
  for (let n = N; n >= 1; n--, row++) for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const b = sodaBottle(0.36); b.position.set((i - (n - 1) / 2) * 0.135 - 0.9, row * 0.365, -1.6 + j * 0.135 - (row % 2) * 0.0); b.scale.setScalar(1); G.add(b); bottles.push(b); }
  // tủ lạnh mở + đèn trong tủ
  G.add(box(0.8, 1.9, 0.7, '#e8ecef', 1.7, 0.95, -2.4)); const door = box(0.8, 1.9, 0.06, '#dfe4e8', 0, 0, 0); const dp = new THREE.Group(); dp.position.set(2.1, 0.95, -2.05); door.position.set(-0.4, 0, 0); dp.add(door); dp.rotation.y = -1.6; G.add(dp);
  const fl = new THREE.PointLight('#e8f6ff', 1.2, 3); fl.position.set(1.7, 1.2, -1.9); G.add(fl);
  const big = sodaBottle(0.36); G.add(big); // chai trên tay nhân vật
  const sun = new THREE.DirectionalLight('#ffe2b0', 1.4); sun.position.set(3, 4, 3); sun.target.position.set(0, 0, -1); sun.castShadow = true; G.add(sun); G.add(sun.target);
  const win = windowPane(1.3, 1.0, skyTex('#7ec3ff', '#e8f4ff')); win.position.set(0.5, 1.7, -2.94); G.add(win);
  shadowAll(G);
  return { G, bottles, big, spot: new THREE.Vector3(ZONE.soda[0] + 0.35, 0, ZONE.soda[1] - 0.6) };
}

// ---------- 5. Phòng gym: thảm cao su, giá tạ, gương, đồng hồ đếm LED ----------
export function buildGym(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.gym[0], 0, ZONE.gym[1]); scene.add(G);
  const rub = canvasTex(256, 256, (g, W) => { g.fillStyle = '#2a2c30'; g.fillRect(0, 0, W, W); const R = rnd(5); for (let i = 0; i < 1500; i++) { g.fillStyle = R() > 0.5 ? '#3a3d42' : '#1c1d20'; g.fillRect(R() * W, R() * W, 2, 2); } g.fillStyle = '#ffc52a'; g.fillRect(0, 0, W, 6); }, [6, 6]);
  room(G, 9, 7, 3.4, '#d8dde2', new THREE.MeshStandardMaterial({ map: rub, roughness: 0.9 }), '#e8ecef');
  // dải sơn màu đội trên tường
  G.add(box(8.9, 0.35, 0.02, '#1f417a', 0, 1.2, -3.43)); G.add(box(8.9, 0.1, 0.02, '#fec524', 0, 1.42, -3.43));
  // giá tạ đĩa + tạ đơn
  for (let i = 0; i < 2; i++) { const x = -3 + i * 1.6; G.add(box(0.08, 2.2, 0.08, '#202020', x - 0.6, 1.1, -2.9)); G.add(box(0.08, 2.2, 0.08, '#202020', x + 0.6, 1.1, -2.9)); G.add(cyl(0.025, 0.025, 1.7, std('#c9ced6', { metalness: 0.8, roughness: 0.3 }), x, 1.5, -2.9).rotateZ(Math.PI / 2));
    for (const s of [-1, 1]) G.add(cyl(0.22, 0.22, 0.06, '#1a1a1a', x + s * 0.7, 1.5, -2.9).rotateZ(Math.PI / 2)); }
  for (let i = 0; i < 8; i++) { const d = new THREE.Group(); d.add(cyl(0.015, 0.015, 0.25, '#888').rotateZ(Math.PI / 2)); for (const s of [-1, 1]) d.add(cyl(0.05, 0.05, 0.06, '#222', s * 0.11, 0, 0, 6).rotateZ(Math.PI / 2)); d.position.set(1.4 + i * 0.3, 0.75, -3.05); G.add(d); }
  G.add(box(2.6, 0.06, 0.4, '#555', 2.45, 0.7, -3.05));
  // gương lớn
  const mir = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), std('#cfe0ea', { metalness: 0.9, roughness: 0.08 })); mir.position.set(-3.0, 1.9, -3.43); G.add(mir);
  // đồng hồ LED treo tường
  const ledTex = canvasTex(512, 192, () => {}); const led = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ map: ledTex, toneMapped: false })); led.position.set(1.0, 2.55, -3.42); G.add(led); G.add(box(1.7, 0.7, 0.06, '#111', 1.0, 2.55, -3.46));
  // thảm tập
  const mat = box(1.0, 0.03, 2.4, '#1f417a', 0, 0.015, -0.4); G.add(mat);
  const top = new THREE.PointLight('#ffffff', 2.2, 10); top.position.set(0, 3.2, 0); G.add(top);
  shadowAll(G);
  const drawLED = (sec, warn) => { const cv = ledTex.userData.cv, g = cv.getContext('2d'), W = cv.width, H = cv.height; g.fillStyle = '#050505'; g.fillRect(0, 0, W, H);
    g.fillStyle = warn ? '#ff3a2a' : '#ff9a2a'; g.font = '900 150px "Space Mono", monospace, Anton'; g.textAlign = 'center'; g.fillText(`0:${String(Math.floor(sec)).padStart(2, '0')}`, W / 2, H - 30); ledTex.needsUpdate = true; };
  return { G, drawLED, matPos: new THREE.Vector3(ZONE.gym[0], 0, ZONE.gym[1] - 0.4) };
}

// ---------- 6. Ngựa low-poly (màu hồng mã/nâu) — dùng cho chuồng ngựa và đường đua ----------
export function horse(o = {}) {
  const P = Object.assign({ coat: '#7a4524', mane: '#1e1410', socks: null, blaze: true }, o);
  const g = new THREE.Group(); const coat = std(P.coat, { roughness: 0.55 }), dark = std(P.mane, { roughness: 0.8 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), coat); body.scale.set(0.62, 0.68, 1.35); body.position.y = 1.25; g.add(body);
  const neckP = new THREE.Group(); neckP.position.set(0, 1.45, 0.52); g.add(neckP);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.85, 16), coat); neck.position.set(0, 0.32, 0.18); neck.rotation.x = 0.55; neckP.add(neck);
  const headP = new THREE.Group(); headP.position.set(0, 0.68, 0.42); neckP.add(headP);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.6, 14), coat); head.rotation.x = 1.85; head.position.set(0, -0.08, 0.22); headP.add(head);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), std('#4a2a1a')); muzzle.position.set(0, -0.16, 0.5); muzzle.scale.set(1, 0.9, 1.1); headP.add(muzzle);
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 8), coat); ear.position.set(s * 0.07, 0.14, -0.02); ear.rotation.z = -s * 0.2; headP.add(ear);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), std('#0a0a0a', { roughness: 0.2 })); eye.position.set(s * 0.115, 0.0, 0.12); headP.add(eye); }
  if (P.blaze) { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.38), std('#f4f0e8')); bl.position.set(0, 0.0, 0.25); bl.rotation.x = 0.3; headP.add(bl); }
  // bờm
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.1), dark); m.position.set(0, 0.12 + i * 0.07, 0.02 + i * 0.045); m.rotation.x = 0.55; neckP.add(m); }
  // đuôi
  const tailP = new THREE.Group(); tailP.position.set(0, 1.4, -0.66); g.add(tailP); const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.75, 10), dark); tail.position.set(0, -0.33, -0.08); tail.rotation.x = Math.PI - 0.25; tailP.add(tail);
  // 4 chân (đùi + ống + móng) có khớp
  const legs = []; for (const [x, z, front] of [[-0.17, 0.48, 1], [0.17, 0.48, 1], [-0.17, -0.48, 0], [0.17, -0.48, 0]]) { const hip = new THREE.Group(); hip.position.set(x, 1.1, z); g.add(hip);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.5, 10), coat); up.position.y = -0.25; hip.add(up); const knee = new THREE.Group(); knee.position.y = -0.5; hip.add(knee);
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.52, 10), P.socks && !front ? std(P.socks) : coat); lo.position.y = -0.26; knee.add(lo);
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.07, 10), std('#1a1410')); hoof.position.y = -0.54; knee.add(hoof); legs.push({ hip, knee, front, ph: (front ? 0 : Math.PI) + (x > 0 ? Math.PI / 2 : 0) }); }
  shadowAll(g);
  // t: thời gian; gait: 0 đứng (gật đầu, quẫy đuôi) .. 1 phi nước kiệu
  const animate = (t, gait = 0) => { const f = 6.5;
    for (const L of legs) { const a = Math.sin(t * f + L.ph); L.hip.rotation.x = a * 0.45 * gait; L.knee.rotation.x = (L.front ? -1 : 1) * Math.max(0, Math.sin(t * f + L.ph + 0.8)) * 0.9 * gait; }
    body.position.y = 1.25 + Math.abs(Math.sin(t * f)) * 0.05 * gait; neckP.rotation.x = Math.sin(t * 1.3) * 0.08 * (1 - gait) + Math.sin(t * f * 2) * 0.05 * gait;
    headP.rotation.x = Math.sin(t * 0.9 + 1) * 0.12 * (1 - gait); tailP.rotation.y = Math.sin(t * 2.2) * 0.35; tailP.rotation.x = -0.2 * gait; };
  animate(0); return { g, animate, headP };
}

// ---------- 7. Chuồng ngựa gỗ, rơm, cửa lùa để bạn bè ngó vào ----------
export function buildStable(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.stable[0], 0, ZONE.stable[1]); scene.add(G);
  const plank = canvasTex(512, 512, (g, W, H) => { const R = rnd(9); for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(28,${38 + R() * 10}%,${30 + R() * 8}%)`; g.fillRect(i * 64, 0, 64, H); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(i * 64, 0, 3, H); } for (let i = 0; i < 160; i++) { g.strokeStyle = 'rgba(40,20,8,0.25)'; g.beginPath(); const x = R() * W; g.moveTo(x, 0); g.lineTo(x + R() * 8 - 4, H); g.stroke(); } }, [3, 1]);
  const hay = canvasTex(256, 256, (g, W) => { g.fillStyle = '#c9a24a'; g.fillRect(0, 0, W, W); const R = rnd(4); for (let i = 0; i < 700; i++) { g.strokeStyle = R() > 0.5 ? '#e0bd5e' : '#9a7a32'; g.beginPath(); const x = R() * W, y = R() * W; g.moveTo(x, y); g.lineTo(x + R() * 30 - 15, y + R() * 8 - 4); g.stroke(); } }, [5, 5]);
  room(G, 9, 7, 3.6, new THREE.MeshStandardMaterial({ map: plank, roughness: 0.85 }), new THREE.MeshStandardMaterial({ map: hay, roughness: 1 }), '#4a3220');
  // vách ngăn ô chuồng
  for (const x of [-1.6, 1.6]) { G.add(box(0.12, 1.4, 3.0, std('#6a4428'), x, 0.7, -1.9)); G.add(box(0.06, 0.06, 3.0, '#2a2a2a', x, 2.0, -1.9)); }
  // kiện rơm
  for (const [x, y, z] of [[3.3, 0.25, -2.6], [3.3, 0.75, -2.6], [2.6, 0.25, -2.7], [-3.3, 0.25, -2.4]]) G.add(box(0.9, 0.5, 0.55, std('#d9b55a', { map: hay }), x, y, z));
  // cửa lùa ở vách phải (mở hé), xô nước, yên ngựa treo, ruy băng giải thưởng
  const doorG = new THREE.Group(); doorG.position.set(4.45, 0, 1.2); G.add(doorG); doorG.add(box(0.08, 2.4, 1.4, std('#8a5a32', { map: plank }), 0, 1.2, 0));
  G.add(cyl(0.16, 0.13, 0.28, '#7a8a96', -1.2, 0.14, -0.2)); G.add(box(0.45, 0.25, 0.3, '#3a1e10', -3.6, 1.4, -3.3));
  const ribbon = new THREE.Group(); ribbon.add(new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), std('#1a5fd0'))); for (const s of [-1, 1]) { const tl = box(0.05, 0.22, 0.01, '#1a5fd0', s * 0.04, -0.17, 0); tl.rotation.z = s * 0.15; ribbon.add(tl); } ribbon.position.set(-1.0, 2.0, -3.44); G.add(ribbon);
  // ánh nắng xiên qua cửa sổ cao
  const sun = new THREE.DirectionalLight('#ffd9a0', 2.2); sun.position.set(-4, 6, 4); sun.target.position.set(0, 0, -1); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); G.add(sun); G.add(sun.target);
  const win = windowPane(1.6, 0.6, skyTex('#9ad0ff', '#f4f8ff')); win.position.set(-2.5, 3.0, -3.44); G.add(win);
  const H = horse({ coat: '#7a4524' }); H.g.position.set(0, 0, -1.6); H.g.rotation.y = Math.PI / 2 - 0.25; G.add(H.g);
  const H2 = horse({ coat: '#2e2420', blaze: false }); H2.g.position.set(-3.0, 0, -1.9); H2.g.rotation.y = 0.2; G.add(H2.g);
  shadowAll(G);
  // bàn chải
  const brush = new THREE.Group(); brush.add(box(0.16, 0.04, 0.07, '#7a4a28')); brush.add(box(0.15, 0.03, 0.065, '#2a2a2a', 0, -0.03, 0)); G.add(brush);
  return { G, horse: H, horse2: H2, brush, door: new THREE.Vector3(ZONE.stable[0] + 4.3, 0, ZONE.stable[1] + 1.0) };
}

// ---------- 8. Phòng dụng cụ: kệ bóng, áo treo, kệ trống còn vết bụi hình chiếc cúp ----------
export function buildEquip(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.equip[0], 0, ZONE.equip[1]); scene.add(G);
  room(G, 7, 6, 3, '#5d6b7e', '#7d7f84', '#d9dde2');
  const shelfM = std('#c9ced6', { metalness: 0.6, roughness: 0.35 });
  for (const x of [-2.2, 0, 2.2]) { for (const y of [0.4, 1.1, 1.8, 2.5]) G.add(box(1.9, 0.04, 0.55, shelfM, x, y, -2.65)); for (const s of [-1, 1]) G.add(box(0.04, 2.6, 0.55, shelfM, x + s * 0.95, 1.3, -2.65)); }
  // bóng rổ trên kệ trái + khăn gấp, kệ phải: bình nước
  const ballM = std('#c8541f', { roughness: 0.75 }); for (let i = 0; i < 7; i++) for (const y of [0.53, 1.23]) G.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), ballM).translateX(-3.0 + i * 0.25 + ZONE.equip[0] * 0).translateY(y).translateZ(-2.65));
  for (let i = 0; i < 6; i++) G.add(box(0.26, 0.12, 0.3, i % 2 ? '#1f417a' : '#fec524', -3.0 + i * 0.3, 1.95 + 0.0, -2.6));
  for (let i = 0; i < 8; i++) G.add(cyl(0.045, 0.045, 0.24, '#e8eef2', 1.45 + i * 0.2, 0.54, -2.6, 12));
  // kệ giữa tầng 3: vết bụi hình cúp (chỗ trống)
  const dust = canvasTex(256, 256, (g, W) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, W); g.fillStyle = 'rgba(120,110,95,0.55)'; g.fillRect(0, 0, W, W); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(W / 2, W / 2, 70, 70, 0, 0, 7); g.fill(); });
  const dm = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5), new THREE.MeshStandardMaterial({ map: dust, transparent: true, roughness: 1 })); dm.rotation.x = -Math.PI / 2; dm.position.set(0, 1.83, -2.62); G.add(dm);
  // giá treo áo Nuggets số khác nhau
  G.add(cyl(0.02, 0.02, 3.0, '#888', 0, 2.2, -1.2).rotateZ(Math.PI / 2));
  const jerseyTex = (n) => canvasTex(128, 160, (g, W, H) => { g.fillStyle = '#1f417a'; g.beginPath(); g.moveTo(20, 0); g.lineTo(44, 0); g.quadraticCurveTo(64, 26, 84, 0); g.lineTo(108, 0); g.lineTo(108, 40); g.lineTo(118, 160); g.lineTo(10, 160); g.lineTo(20, 40); g.closePath(); g.fill(); g.fillStyle = '#ffffff'; g.font = '900 64px Anton, Impact'; g.textAlign = 'center'; g.fillText(String(n), W / 2, 120); });
  for (const [i, n] of [[-1.2, 27], [-0.6, 0], [0.6, 5], [1.2, 50]].entries ? [[-1.2, 27], [-0.6, 0], [0.6, 5], [1.2, 50]] : []) { const j = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.56), new THREE.MeshStandardMaterial({ map: jerseyTex(n), transparent: true, side: THREE.DoubleSide, roughness: 0.8 })); j.position.set(i, 1.88, -1.2); G.add(j); }
  // xe đẩy giặt đồ
  G.add(box(0.9, 0.6, 0.6, '#3a6ab0', 2.4, 0.45, -0.6));
  const top = new THREE.PointLight('#f4f8ff', 2.0, 9); top.position.set(0, 2.8, 0); G.add(top);
  shadowAll(G);
  return { G, emptySpot: new THREE.Vector3(ZONE.equip[0], 1.85, ZONE.equip[1] - 2.62) };
}

// ---------- 9. Phố diễu hành: xe buýt mui trần, đám đông, giấy màu ----------
function lowPerson(color, skin, h = 1.7) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, h * 0.42, 4, 10), std(color)); b.position.y = h * 0.45; g.add(b);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), std(skin)); hd.position.y = h * 0.85; g.add(hd); const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.45, 3, 8), std(color)); arm.position.set(0.22, h * 0.72, 0); g.add(arm); g.userData.arm = arm; shadowAll(g); return g; }
export function buildStreet(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.street[0], 0, ZONE.street[1]); scene.add(G);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(120, 14), std('#3a3c40', { roughness: 0.95 })); road.rotation.x = -Math.PI / 2; road.receiveShadow = true; G.add(road);
  for (let i = -50; i < 60; i += 6) { const l = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.15), std('#f4f4f0')); l.rotation.x = -Math.PI / 2; l.position.set(i, 0.01, 0); G.add(l); }
  for (const s of [-1, 1]) { const sw = box(120, 0.2, 5, '#b9b4aa', 0, 0.1, s * 9.5); G.add(sw); }
  // nhà cao tầng hai bên (nhiều kiểu, cửa sổ sáng lác đác)
  const R = rnd(21); const facade = (hue) => canvasTex(256, 512, (g, W, H) => { g.fillStyle = `hsl(${hue},18%,${48 + R() * 18}%)`; g.fillRect(0, 0, W, H); for (let y = 20; y < H - 20; y += 40) for (let x = 14; x < W - 20; x += 40) { g.fillStyle = R() > 0.75 ? '#ffe7a8' : '#41505e'; g.fillRect(x, y, 24, 26); } });
  for (const s of [-1, 1]) for (let x = -55; x < 60; x += 9 + R() * 3) { const h = 10 + R() * 26, w = 8 + R() * 2; const m = new THREE.MeshStandardMaterial({ map: facade(R() * 360), roughness: 0.8 }); const b = box(w, h, 8, m, x, h / 2, s * (16 + R() * 2)); G.add(b); }
  // núi xa (Denver)
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(18 + R() * 10, 16 + R() * 10, 5), std('#8aa0b8', { roughness: 1 })); m.position.set(-60 + i * 16, 6, -70); G.add(m); }
  // xe buýt mui trần navy, sọc vàng, chữ CHAMPIONS
  const bus = new THREE.Group(); const side = canvasTex(1024, 256, (g, W, H) => { g.fillStyle = '#1f417a'; g.fillRect(0, 0, W, H); g.fillStyle = '#fec524'; g.fillRect(0, 150, W, 26); g.fillStyle = '#8b2131'; g.fillRect(0, 176, W, 10); g.fillStyle = '#ffffff'; g.font = '900 110px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('CHAMPIONS', W / 2, 130); });
  const bm = new THREE.MeshStandardMaterial({ map: side, roughness: 0.5 }); const plain = std('#1f417a', { roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(10, 3.4, 2.6), [plain, plain, plain, plain, bm, bm]); body.rotation.y = Math.PI / 2; body.position.y = 2.2; bus.add(body);
  const bmm = body; bmm.geometry.rotateY(0); // các mặt ±z của hộp (sau khi xoay) là 2 bên hông xe
  for (const z of [-3.6, 3.6]) for (const x of [-1.3, 1.3]) { const w = cyl(0.55, 0.55, 0.35, '#141414', x, 0.55, z, 20); w.rotation.z = Math.PI / 2; bus.add(w); }
  // lan can tầng trên
  for (let i = -4; i <= 4; i++) { bus.add(cyl(0.025, 0.025, 1.0, '#e8e8e8', -1.25, 4.4, i * 1.2, 8)); bus.add(cyl(0.025, 0.025, 1.0, '#e8e8e8', 1.25, 4.4, i * 1.2, 8)); }
  for (const x of [-1.25, 1.25]) bus.add(cyl(0.03, 0.03, 10, '#e8e8e8', x, 4.9, 0, 8).rotateX(Math.PI / 2));
  bus.position.set(0, 0, -1.5); bus.rotation.y = Math.PI / 2; G.add(bus);
  // đám đông hai bên vỉa hè
  const crowd = []; const cols = ['#1f417a', '#fec524', '#8b2131', '#f4f4f4', '#1f417a', '#fec524']; const skins = ['#f2cdb0', '#c68c5f', '#8a5634', '#e8b98f'];
  for (const s of [-1, 1]) for (let i = 0; i < 70; i++) { const p = lowPerson(cols[i % 6], skins[(i * 7) % 4], 1.6 + R() * 0.3); p.position.set(-40 + i * 1.15 + R() * 0.4, 0.2, s * (7.6 + R() * 2.2)); p.rotation.y = s > 0 ? Math.PI : 0; G.add(p); crowd.push(p); }
  // giấy màu rơi (instanced)
  const N = 900; const cf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.06, 0.1), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6 }), N); const cc = new THREE.Color();
  const seeds = []; for (let i = 0; i < N; i++) { seeds.push([R() * 40 - 20, R() * 14, R() * 16 - 8, R() * 6]); cc.set(['#fec524', '#1f417a', '#ffffff', '#8b2131'][i % 4]); cf.setColorAt(i, cc); } G.add(cf);
  const sun = new THREE.DirectionalLight('#fff1d6', 2.0); sun.position.set(20, 30, 15); sun.target.position.set(0, 0, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25 }); G.add(sun); G.add(sun.target);
  shadowAll(G);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  const animate = (t, busX = 0) => { bus.position.x = busX; for (let i = 0; i < crowd.length; i++) { const p = crowd[i]; p.position.y = 0.2 + Math.max(0, Math.sin(t * 6 + i)) * 0.12; p.userData.arm.rotation.z = 2.6 + Math.sin(t * 8 + i * 1.3) * 0.4; p.userData.arm.position.y = 1.35; }
    for (let i = 0; i < N; i++) { const [x, y0, z, ph] = seeds[i]; const y = ((y0 - t * 1.2) % 14 + 14) % 14; e.set(t * 3 + ph, t * 2 + ph, 0); q.setFromEuler(e); m4.compose(new THREE.Vector3(busX + x + Math.sin(t + ph) * 0.4, y, z), q, new THREE.Vector3(1, 1, 1)); cf.setMatrixAt(i, m4); } cf.instanceMatrix.needsUpdate = true; };
  animate(0);
  return { G, bus, animate, busTop: () => new THREE.Vector3(ZONE.street[0] + bus.position.x, 3.9, ZONE.street[1] - 1.5) };
}

// ---------- 10. Trường đua ngựa kéo xe (Sombor): đường đất hình bầu dục, khán đài, ngựa kéo xe hai bánh ----------
export function sulky(silk = '#d42a2a') { const g = new THREE.Group();
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 8, 30), std('#222')); w.position.set(s * 0.55, 0.5, -1.4); w.rotation.y = Math.PI / 2; g.add(w); for (let k = 0; k < 6; k++) { const sp = cyl(0.008, 0.008, 1.0, '#bbb', s * 0.55, 0.5, -1.4, 4); sp.rotation.x = k * Math.PI / 6; g.add(sp); } }
  g.add(cyl(0.02, 0.02, 1.1, '#bbb', 0, 0.5, -1.4, 6).rotateZ(Math.PI / 2)); for (const s of [-1, 1]) { const sh = cyl(0.02, 0.02, 2.2, '#c9ced6', s * 0.35, 0.9, -0.4, 6); sh.rotation.x = Math.PI / 2 - 0.12; g.add(sh); }
  g.add(box(0.4, 0.06, 0.35, '#333', 0, 0.8, -1.45));
  const driver = new THREE.Group(); const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.35, 4, 10), std(silk)); torso.position.set(0, 1.15, -1.45); torso.rotation.x = -0.35; driver.add(torso);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), std('#ffffff', { roughness: 0.3 })); helm.position.set(0, 1.52, -1.38); driver.add(helm);
  for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.5, 3, 8), std('#f4f4f4')); leg.position.set(s * 0.12, 0.95, -1.1); leg.rotation.x = 1.2; driver.add(leg); const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.35, 3, 8), std(silk)); arm.position.set(s * 0.18, 1.2, -1.25); arm.rotation.x = 1.0; driver.add(arm); }
  g.add(driver); shadowAll(g); return g; }
export function buildTrack(scene) {
  const G = new THREE.Group(); G.position.set(ZONE.track[0], 0, ZONE.track[1]); scene.add(G);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(170, 150), std('#5f9a3a', { roughness: 1 })); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.02; grass.receiveShadow = true; G.add(grass);
  // đường đất bầu dục: hai bán nguyệt + hai đoạn thẳng (dài 60, bán kính 22, rộng 10)
  const sh = new THREE.Shape(); const Ls = 30, Ro = 27, Ri = 17; sh.moveTo(-Ls, -Ro); sh.lineTo(Ls, -Ro); sh.absarc(Ls, 0, Ro, -Math.PI / 2, Math.PI / 2, false); sh.lineTo(-Ls, Ro); sh.absarc(-Ls, 0, Ro, Math.PI / 2, Math.PI * 1.5, false);
  const hole = new THREE.Path(); hole.moveTo(-Ls, -Ri); hole.absarc(-Ls, 0, Ri, Math.PI * 1.5, Math.PI / 2, true); hole.lineTo(Ls, Ri); hole.absarc(Ls, 0, Ri, Math.PI / 2, -Math.PI / 2, true); hole.lineTo(-Ls, -Ri); sh.holes.push(hole);
  const dirt = canvasTex(256, 256, (g, W) => { g.fillStyle = '#b07a4a'; g.fillRect(0, 0, W, W); const R = rnd(2); for (let i = 0; i < 2000; i++) { g.fillStyle = R() > 0.5 ? '#c08a58' : '#9a663a'; g.fillRect(R() * W, R() * W, 2, 2); } }, [20, 20]);
  const tr = new THREE.Mesh(new THREE.ShapeGeometry(sh, 48), new THREE.MeshStandardMaterial({ map: dirt, roughness: 1 })); tr.rotation.x = -Math.PI / 2; tr.receiveShadow = true; G.add(tr);
  // rào trắng mép trong + ngoài (đoạn thẳng phía khán đài)
  for (const z of [Ri - 0.3, Ro + 0.4]) for (let x = -Ls; x <= Ls; x += 2) { G.add(box(0.06, 1.0, 0.06, '#ffffff', x, 0.5, z)); } for (const z of [Ri - 0.3, Ro + 0.4]) G.add(box(Ls * 2, 0.08, 0.08, '#ffffff', 0, 1.0, z));
  // khán đài có mái ở đoạn thẳng gần (z > 0)
  const stand = new THREE.Group(); for (let r = 0; r < 8; r++) stand.add(box(40, 0.45, 0.9, r % 2 ? '#d9d4ca' : '#c9c4ba', 0, 0.45 * (r + 1) * 0.9, r * 0.9));
  stand.add(box(42, 0.25, 9, '#7a1f1f', 0, 6.4, 3.4)); for (const x of [-20, -10, 0, 10, 20]) stand.add(cyl(0.12, 0.12, 6.4, '#e8e8e8', x, 3.2, 7.4, 10));
  stand.position.set(0, 0, Ro + 2.2); G.add(stand);
  // biển chữ
  const sign = canvasTex(1024, 160, (g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.fillStyle = '#7a1f1f'; g.font = '900 110px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('SOMBOR HIPPODROME', W / 2, 125); });
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.5), new THREE.MeshStandardMaterial({ map: sign, roughness: 0.6 })); sg.position.set(0, 7.9, Ro + 2.0 + 0.0); G.add(sg);
  // khán giả low-poly trên khán đài
  const R = rnd(33); const fans = []; for (let r = 1; r < 7; r++) for (let i = 0; i < 30; i++) { if (R() < 0.35) continue; const p = lowPerson(['#e8e8e8', '#7a1f1f', '#1f417a', '#d9b55a', '#3a6a3a'][(i + r) % 5], ['#f2cdb0', '#e8b98f', '#d8a37a'][i % 3], 1.3); p.position.set(-19 + i * 1.3, 0.45 * (r + 1) * 0.9 + 0.05, Ro + 2.2 + r * 0.9); p.rotation.y = Math.PI; G.add(p); fans.push(p); }
  // cây xa
  for (let i = 0; i < 40; i++) { const t = new THREE.Group(); t.add(cyl(0.2, 0.3, 2.5, '#5a3a20', 0, 1.25, 0, 6)); const c = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + R() * 1.2, 0), std('#3f7a2a', { roughness: 1, flatShading: true })); c.position.y = 3.6; t.add(c); t.position.set(-80 + i * 4.0, 0, -45 - R() * 15); G.add(t); }
  // 4 ngựa kéo xe
  const racers = [['#7a4524', '#d42a2a'], ['#2e2420', '#1f417a'], ['#a8783a', '#fec524'], ['#5a3420', '#2a8a4a']].map(([c, s], i) => { const h = horse({ coat: c, blaze: i % 2 === 0 }); const sk = sulky(s); const g = new THREE.Group(); g.add(h.g); g.add(sk); G.add(g); return { g, h, lane: 19 + i * 1.9, off: i * 3.2 }; });
  const sun = new THREE.DirectionalLight('#fff0d0', 2.2); sun.position.set(-30, 50, 40); sun.target.position.set(0, 0, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, far: 200 }); G.add(sun); G.add(sun.target);
  shadowAll(G);
  // ngựa chạy theo đoạn thẳng phía khán đài (z dương), từ trái sang phải; t giây
  const animate = (t, speed = 11) => { for (const r of racers) { const x = -Ls - 20 + ((t * speed + r.off * 2) % 90); r.g.position.set(x - r.off, 0, r.lane); r.g.rotation.y = Math.PI / 2; r.h.animate(t + r.off, 1); }
    for (let i = 0; i < fans.length; i++) { const p = fans[i]; p.userData.arm.rotation.z = 2.4 + Math.sin(t * 7 + i) * 0.5; p.userData.arm.position.y = 1.05; } };
  animate(0);
  return { G, animate, racers, seatAt: (row, x) => new THREE.Vector3(ZONE.track[0] + x, 0.45 * (row + 1) * 0.9, ZONE.track[1] + Ro + 2.2 + row * 0.9), Ro };
}
