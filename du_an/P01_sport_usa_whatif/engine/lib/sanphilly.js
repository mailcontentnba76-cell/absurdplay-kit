// E24 (Mascot NBA) — NHÀ THI ĐẤU PHILADELPHIA HƯ CẤU, bố cục theo ảnh mẫu NBA chủ dự án gửi (19/11): sân là chỗ SÁNG NHẤT như sân khấu,
// khán đài lòng chảo 2 tầng kín 4 phía + 4 góc, đông nghịt fan áo xanh/trắng/đỏ (ít áo xanh lá Bucks), dải LED vòng giữa 2 tầng,
// màn hình 4 mặt treo giữa sân + CHUÔNG TỰ DO treo ngay dưới màn hình, hàng ghế sát sân + bàn thư ký, trần tối có giàn đèn.
// Sàn gỗ màu mật ong, vùng sơn xanh, viền sân đỏ–xanh, vòng giữa "1776". Không logo NBA/đội, không tên tài trợ.
import * as THREE from 'three';
import { hoop, basketball, canvasTex } from './nba.js';
import { bleachers } from './ngoaitroi.js';
import { libertyBell } from './philly1776.js';
export const CL = 28.65, CW = 15.24, RIMX = CL / 2 - 1.22 - 0.3786;
export const JUMBO = 14.2;          // tâm màn hình treo
export const BELLY = 8.55;          // đáy chuông (xà chuông sát đáy màn hình)
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const BLUE = '#1f56b0', RED = '#d8263a', NAVY = '#14234a', CREAM = '#f4efe2';

function courtTex() {
  return canvasTex(4096, 2414, (g, X, Y) => { const px = X / (CL + 4), M = 2 * px;
    g.fillStyle = '#c8945a'; g.fillRect(0, 0, X, Y);
    for (let y = 0; y < Y; y += px * 0.075) { for (let x = 0; x < X;) { const l = px * (1.0 + Math.random() * 2.6); const v = Math.random(); g.fillStyle = `hsl(${29 + v * 6},${62 + v * 10}%,${52 + v * 8}%)`; g.fillRect(x, y, l, px * 0.075 - 1); x += l; } }
    g.fillStyle = 'rgba(90,45,10,0.05)'; for (let i = 0; i < 9000; i++) g.fillRect(Math.random() * X, Math.random() * Y, px * 0.3, 1);
    // viền ngoài sân xanh đậm + chỉ đỏ
    g.fillStyle = NAVY; g.fillRect(0, 0, X, M); g.fillRect(0, Y - M, X, M); g.fillRect(0, 0, M, Y); g.fillRect(X - M, 0, M, Y);
    g.strokeStyle = RED; g.lineWidth = px * 0.12; g.strokeRect(M - px * 0.12, M - px * 0.12, CL * px + px * 0.24, CW * px + px * 0.24);
    const cx = X / 2, cy = Y / 2, lw = px * 0.05; g.strokeStyle = '#ffffff'; g.lineWidth = lw; g.strokeRect(M, M, CL * px, CW * px);
    g.beginPath(); g.moveTo(cx, M); g.lineTo(cx, Y - M); g.stroke();
    g.fillStyle = BLUE; g.beginPath(); g.arc(cx, cy, 1.83 * px, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = '#ffffff'; g.font = `italic 900 ${px * 0.78}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1776', cx, cy + px * 0.05);
    for (const s of [-1, 1]) { const bx = s < 0 ? M : X - M, dir = -s, hx = bx + dir * 1.575 * px;
      g.fillStyle = BLUE; const kx = s < 0 ? bx : bx - 5.79 * px; g.fillRect(kx, cy - 2.44 * px, 5.79 * px, 4.88 * px); g.strokeRect(kx, cy - 2.44 * px, 5.79 * px, 4.88 * px);
      const ftx = bx + dir * 5.79 * px; g.beginPath(); g.arc(ftx, cy, 1.83 * px, s < 0 ? -Math.PI / 2 : Math.PI / 2, s < 0 ? Math.PI / 2 : Math.PI * 1.5); g.stroke();
      const cw = (CW / 2 - 0.91) * px, R3 = 7.24 * px; const a0 = Math.asin(cw / R3); const cxL = Math.cos(a0) * R3;
      g.beginPath(); g.moveTo(bx, cy - cw); g.lineTo(hx + dir * cxL, cy - cw); if (s < 0) g.arc(hx, cy, R3, -a0, a0); else g.arc(hx, cy, R3, Math.PI + a0, Math.PI - a0, true); g.lineTo(bx, cy + cw); g.stroke();
      g.beginPath(); g.arc(hx, cy, 1.22 * px, s < 0 ? -Math.PI / 2 : Math.PI / 2, s < 0 ? Math.PI / 2 : Math.PI * 1.5); g.stroke();
      g.save(); g.translate(s < 0 ? M * 0.5 : X - M * 0.5, cy); g.rotate(s < 0 ? -Math.PI / 2 : Math.PI / 2); g.fillStyle = CREAM; g.font = `italic 900 ${px * 0.9}px Georgia, serif`; g.fillText('PHILADELPHIA', 0, 0); g.restore(); }
    g.fillStyle = CREAM; g.font = `italic 900 ${px * 0.85}px Georgia, serif`; g.fillText('PHILADELPHIA', cx, M * 0.5); g.save(); g.translate(cx, Y - M * 0.5); g.rotate(Math.PI); g.fillText('PHILADELPHIA', 0, 0); g.restore(); });
}
// dải LED chữ chạy (phát sáng)
function ledTex(texts, bg = '#0a1a3a') { return canvasTex(4096, 96, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.font = '900 64px Anton, Impact, sans-serif'; g.textBaseline = 'middle'; let x = 30, k = 0;
  while (x < W) { const t = texts[k % texts.length]; g.fillStyle = k % 2 ? '#ffffff' : '#7fb0ff'; g.fillText(t, x, H / 2 + 3); x += g.measureText(t).width + 90; g.fillStyle = RED; g.fillRect(x - 55, H / 2 - 7, 14, 14); k++; } }, [1, 1]); }
// màn hình 4 mặt treo giữa sân: mặt dài hướng ±z, mặt ngắn ±x; vành LED trên/dưới
function jumbotron() { const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const dark = std('#0c0f16', { roughness: 0.5, metalness: 0.4 }); const box = new THREE.Mesh(new THREE.BoxGeometry(8.2, 4.4, 6.2), dark); G.add(box);
  const sm = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
  for (const [w, x, z, ry] of [[7.8, 0, 3.12, 0], [7.8, 0, -3.12, Math.PI], [5.8, 4.12, 0, Math.PI / 2], [5.8, -4.12, 0, -Math.PI / 2]]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, 4.0), sm); f.position.set(x, 0, z); f.rotation.y = ry; G.add(f); }
  const lt = ledTex(['PHILADELPHIA', '1776', 'GAME 1', 'WHAT IF']); const lm = new THREE.MeshBasicMaterial({ map: lt, toneMapped: false });
  for (const y of [-2.55, 2.55]) { const ring = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.7, 6.6), [lm, lm, dark, dark, lm, lm]); ring.position.y = y; G.add(ring); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 16), dark); c.position.set(sx * 3.4, 10.5, sz * 2.4); G.add(c); }
  let last = ''; const draw = (o) => { const k = JSON.stringify(o); if (k === last) return; last = k; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 576); gr.addColorStop(0, '#13306a'); gr.addColorStop(1, '#081430'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = RED; g.lineWidth = 10; g.strokeRect(12, 12, 1000, 552); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = `900 ${o.big ? 230 : 150}px Anton, Impact, sans-serif`; g.fillStyle = o.c || '#ffffff'; g.fillText(o.msg, 512, o.sub ? 240 : 290, 960); if (o.sub) { g.font = '900 80px Anton, Impact, sans-serif'; g.fillStyle = '#cfe0ff'; g.fillText(o.sub, 512, 430, 960); } }
    else { g.font = '900 86px Anton, Impact, sans-serif'; g.fillStyle = '#7fdc8a'; g.fillText('MIL', 250, 100); g.fillStyle = '#cfe0ff'; g.fillText('PHI', 774, 100);
      g.font = '900 250px Anton, Impact, sans-serif'; g.fillStyle = '#ffffff'; g.fillText(String(o.a ?? 0), 250, 320); g.fillText(String(o.b ?? 0), 774, 320);
      g.font = '900 90px Anton, Impact, sans-serif'; g.fillStyle = '#ffcf4a'; g.fillText(o.clock || '', 512, 320); }
    t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'Q1' }); return { G, draw }; }
// hàng ghế sát sân (ghế đệm đỏ) — gộp thành 1 lưới
function courtside(G, z, x0, x1, ry) { const geo = []; const c = std('#a01c2c', { roughness: 0.6 });
  for (let x = x0; x <= x1; x += 0.62) { geo.push(new THREE.BoxGeometry(0.5, 0.1, 0.5).translate(x, 0.45, 0)); geo.push(new THREE.BoxGeometry(0.5, 0.55, 0.08).translate(x, 0.75, -0.24)); }
  const g = new THREE.Group(); g.position.z = z; g.rotation.y = ry; G.add(g); for (const b of geo) g.add(new THREE.Mesh(b, c)); return g; }

export function buildHall(scene) {
  scene.background = new THREE.Color('#0b0e15'); scene.fog = new THREE.Fog('#1a2030', 55, 140);
  const G = new THREE.Group(); scene.add(G);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CL + 4, CW + 4), new THREE.MeshStandardMaterial({ map: courtTex(), roughness: 0.3, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.005; floor.receiveShadow = true; G.add(floor);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(120, 100), std('#1a1e28', { roughness: 0.9 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.06; outer.receiveShadow = true; G.add(outer);
  const hoops = [hoop(1, { pad: BLUE }), hoop(-1, { pad: BLUE })]; hoops[0].position.set(CL / 2 - 1.22, 0, 0); hoops[1].position.set(-(CL / 2 - 1.22), 0, 0); hoops.forEach((h) => G.add(h));
  // khán đài lòng chảo: tầng dưới 4 phía + 4 góc, tầng trên 4 phía; ghế xanh đậm, khán giả kín
  const U = { uT: { value: 0 }, uCheer: { value: 0.25 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const fans = { shirts: [BLUE, '#e8e8e8', '#2a2e38', RED, '#3a3f4a', NAVY, BLUE, '#6a6f7a', '#1c2030', '#2f7a3a', '#9aa6b8', '#2a2e38', BLUE, '#4a3a30'], skins: ['#f1c9a5', '#c68c5f', '#9a6040', '#8a5634', '#e8b98f'], pants: ['#1a1a20', '#2b3a55', '#3b3b3b'], hats: [RED, BLUE, '#ffffff', NAVY] };
  const seat = { seatColor: '#1a2c5a', frameColor: '#0e1220', row: 0.8, rise: 0.46 };
  const Z0 = CW / 2 + 4.2, X0 = CL / 2 + 4.6;
  for (const s of [-1, 1]) {
    bleachers(G, s, { U, fill: 0.95, seed: 11 + s * 3, rows: 16, len: 38, x0: 0, z0: s * Z0, ...seat, ...fans });
    bleachers(G, s, { U, fill: 0.9, seed: 31 + s * 3, rows: 14, len: 46, x0: 0, y0: 9.6, z0: s * (Z0 + 16 * 0.8 + 2.2), ...seat, ...fans });
    bleachers(G, 1, { U, fill: 0.95, seed: 51 + s, rows: 16, len: 22, rotY: s > 0 ? -Math.PI / 2 : Math.PI / 2, x0: s * X0, z0: 0, ...seat, ...fans });
    bleachers(G, 1, { U, fill: 0.88, seed: 61 + s, rows: 14, len: 30, rotY: s > 0 ? -Math.PI / 2 : Math.PI / 2, x0: s * (X0 + 16 * 0.8 + 2.2), y0: 9.6, z0: 0, ...seat, ...fans });
    for (const t of [-1, 1]) { const ang = Math.atan2(t, s) ; bleachers(G, 1, { U, fill: 0.92, seed: 71 + s * 5 + t, rows: 16, len: 13, rotY: Math.atan2(-s, -t), x0: s * (CL / 2 + 6.6), z0: t * (CW / 2 + 6.2), ...seat, ...fans }); } }
  // dải LED vòng giữa 2 tầng (mặt trước tầng trên) + mép trước tầng dưới
  const lt = ledTex(['PHILADELPHIA', '1776', 'THIS WEEKEND', 'GAME 1', 'WHAT IF']);
  const ledM = new THREE.MeshBasicMaterial({ map: lt, toneMapped: false });
  const Zr = Z0 + 16 * 0.8 + 2.0, Xr = X0 + 16 * 0.8 + 2.0;
  for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.PlaneGeometry(2 * Xr, 0.9), ledM); a.position.set(0, 9.4, s * Zr); a.rotation.y = s > 0 ? Math.PI : 0; G.add(a);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(2 * Zr, 0.9), ledM); b.position.set(s * Xr, 9.4, 0); b.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; G.add(b);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(38, 0.75), ledM); c.position.set(0, 0.5, s * (Z0 + 0.1)); c.rotation.y = s > 0 ? Math.PI : 0; G.add(c); }
  // ghế sát sân + bàn thư ký (biên +z) + băng ghế hai đội (biên −z)
  courtside(G, CW / 2 + 2.3, -12, 12, Math.PI); courtside(G, -(CW / 2 + 2.3), -12, -3.5, 0); courtside(G, -(CW / 2 + 2.3), 3.5, 12, 0);
  const table = new THREE.Mesh(new THREE.BoxGeometry(9, 0.85, 0.7), [std('#111'), std('#111'), std('#111'), std('#111'), ledM, std('#111')]); table.position.set(0, 0.43, CW / 2 + 1.5); table.rotation.y = Math.PI; G.add(table);
  // ===== MÁI TRONG NHÀ (tối nhưng thấy chi tiết): tường bao + dãy phòng VIP sáng đèn, trần panel xám xanh, kèo thép, lối đi kỹ thuật, giàn đèn, loa, cờ treo =====
  const RY = 27, WX = Xr + 14 * 0.8 + 2.5, WZ = Zr + 14 * 0.8 + 2.5;
  const panel = canvasTex(512, 512, (g, W, H) => { g.fillStyle = '#2c3446'; g.fillRect(0, 0, W, H); g.strokeStyle = '#3c465c'; g.lineWidth = 6; for (let i = 0; i <= W; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`; g.fillRect(Math.random() * W, Math.random() * H, 30, 30); } }, [10, 8]);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(2 * WX, 2 * WZ), new THREE.MeshStandardMaterial({ map: panel, roughness: 0.95, emissive: '#1c2232', emissiveIntensity: 0.6 })); roof.rotation.x = Math.PI / 2; roof.position.y = RY; G.add(roof);
  // tường bao sau tầng trên: bê tông xám + dải phòng VIP kính sáng vàng + dải LED mỏng
  const suite = canvasTex(1024, 128, (g, W, H) => { g.fillStyle = '#1a1e28'; g.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const x = k * W / 24 + 4; const gr = g.createLinearGradient(0, 20, 0, H - 20); gr.addColorStop(0, '#ffe2a8'); gr.addColorStop(1, '#d89a50'); g.fillStyle = gr; g.fillRect(x, 22, W / 24 - 8, H - 44);
    g.fillStyle = 'rgba(30,20,10,0.55)'; for (let p = 0; p < 3; p++) g.fillRect(x + 6 + p * 12, 62 + (p % 2) * 6, 7, 40); } }, [1, 1]);
  const conc = std('#3a404c', { roughness: 0.95 }); const suiteM = new THREE.MeshBasicMaterial({ map: suite, toneMapped: false });
  for (const [x, z, ry, len] of [[0, -WZ, 0, 2 * WX], [0, WZ, Math.PI, 2 * WX], [-WX, 0, Math.PI / 2, 2 * WZ], [WX, 0, -Math.PI / 2, 2 * WZ]]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(len, RY), conc); w.position.set(x, RY / 2, z); w.rotation.y = ry; G.add(w);
    const nx = Math.sin(ry) * 0.05, nz = Math.cos(ry) * 0.05;
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(len, 2.4), suiteM); sw.position.set(x + nx, 19.4, z + nz); sw.rotation.y = ry; G.add(sw);
    const lb = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.5), ledM); lb.position.set(x + nx * 2, 21.2, z + nz * 2); lb.rotation.y = ry; G.add(lb); }
  // kèo thép: dầm hộp chạy dọc/ngang + thanh chéo, ngay dưới trần
  const steel = std('#7a8496', { metalness: 0.6, roughness: 0.45 });
  for (let x = -WX + 6; x < WX; x += 9) { const bm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 2 * WZ), steel); bm.position.set(x, RY - 1.0, 0); G.add(bm);
    const bl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 2 * WZ), steel); bl.position.set(x, RY - 2.6, 0); G.add(bl);
    for (let z = -WZ + 3; z < WZ; z += 6) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 0.14), steel); d.position.set(x, RY - 1.8, z); d.rotation.x = (z / 6 | 0) % 2 ? 0.7 : -0.7; G.add(d); } }
  for (let z = -WZ + 6; z < WZ; z += 10) { const bm = new THREE.Mesh(new THREE.BoxGeometry(2 * WX, 1.0, 0.4), steel); bm.position.set(0, RY - 0.7, z); G.add(bm); }
  // lối đi kỹ thuật (catwalk) vòng chữ nhật + giàn đèn rọi sân phát sáng
  const lamp = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff4e0', emissiveIntensity: 3 });
  const cw = std('#4a5262', { metalness: 0.5, roughness: 0.5 });
  for (const s of [-1, 1]) { const a1 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.2, 1.4), cw); a1.position.set(0, RY - 4.2, s * 15); G.add(a1); const a2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 30), cw); a2.position.set(s * 20, RY - 4.2, 0); G.add(a2);
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.06, 0.06), steel); r1.position.set(0, RY - 3.2, s * 15.7); G.add(r1); }
  const chand = [];
  for (const x of [-18, -10, -2, 6, 14]) for (const z of [-15, 15]) { const rig = new THREE.Group(); rig.position.set(x + 2, RY - 4.6, z); G.add(rig);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 0.4), cw); rig.add(bar);
    for (let k = 0; k < 6; k++) { const can = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.5, 12), std('#20242c', { metalness: 0.5 })); can.position.set(-2.1 + k * 0.84, -0.4, 0); can.rotation.x = z > 0 ? 0.5 : -0.5; rig.add(can);
      const ln = new THREE.Mesh(new THREE.CircleGeometry(0.2, 14), lamp); ln.position.set(-2.1 + k * 0.84, -0.66, z > 0 ? -0.12 : 0.12); ln.rotation.x = Math.PI / 2 + (z > 0 ? 0.5 : -0.5); rig.add(ln); } }
  chand.push({ userData: { flame: lamp } });
  // cụm loa treo 4 phía màn hình + cờ treo trên trần (hư cấu, không danh hiệu thật)
  for (const [x, z] of [[6, 0], [-6, 0], [0, 5], [0, -5]]) { const sp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 1.2), std('#15181f', { roughness: 0.6 })); sp.position.set(x, JUMBO + 1.4, z); G.add(sp); }
  const flags = ['PHILADELPHIA', '1776', 'LIBERTY', 'EST. 1776', 'GAME 1'];
  flags.forEach((f, i) => { const tx = canvasTex(256, 512, (g, W, H) => { g.fillStyle = i % 2 ? RED : BLUE; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.fillRect(14, 14, W - 28, 6); g.fillRect(14, H - 20, W - 28, 6);
      g.save(); g.translate(W / 2, H / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 64px Anton, Impact, sans-serif'; g.fillText(f, 0, 0, H - 60); g.restore(); });
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.4), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.9, side: THREE.DoubleSide, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.25 }));
    fl.position.set(-16 + i * 8, RY - 5.2, -(WZ - 6)); G.add(fl); });
  // màn hình treo + chuông ngay dưới
  const J = jumbotron(); J.G.position.set(0, JUMBO, 0); G.add(J.G);
  const bell = libertyBell(2.1); bell.position.set(0, BELLY, 0); bell.rotation.y = Math.PI / 2; G.add(bell);
  for (const sz of [-1, 1]) { const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, JUMBO - 2.2 - (BELLY + 1.3 * 2.1) + 0.2, 5), std('#2a2420', { metalness: 0.6 })); ch.position.set(0, (JUMBO - 2.2 + BELLY + 1.3 * 2.1) / 2, sz * 1.2); G.add(ch); }
  return { G, hoops, crowd: U, bell, center: J, chand, floor };
}
export function hallLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#d8e0f0', '#2a2620', 1.9); scene.add(hemi);
  const up = new THREE.DirectionalLight('#aab8d8', 1.2); up.position.set(0, -10, 0); up.target.position.set(0, 30, 0); scene.add(up); scene.add(up.target); // hắt ngược lên trần
  const key = new THREE.DirectionalLight('#fff4e6', 4.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#e4ecff', 1.6); fill.position.set(14, 18, 20); scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 2.2); scene.add(rim); scene.add(rim.target);
  // đèn sân khấu: chỉ rọi mặt sân (sân sáng nhất), khán đài tối dần
  const spot = new THREE.SpotLight('#fff6ea', 420, 60, 0.62, 0.55, 1.4); spot.position.set(0, 28, 0); spot.target.position.set(0, 0, 0); scene.add(spot); scene.add(spot.target);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 14, 26, z - 22); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(0, 0, 1); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.75).multiplyScalar(22); key.position.set(x + d.x, 26, z + d.z);
    rim.target.position.set(x, 1, z); rim.position.set(x - d.x * 0.9, 9, z - d.z * 0.9); };
  const lamps = (k) => { P.chand.forEach((c) => { c.userData.flame.emissiveIntensity = 0.4 + 2.6 * k; }); spot.intensity = 420 * (0.4 + 0.6 * k); };
  area(0, 0); lamps(1); return { hemi, key, fill, rim, spot, area, lamps };
}
export { basketball };
