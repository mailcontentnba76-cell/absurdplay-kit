// Tập 27 — "HARVEST BOWL" hư cấu (Buckeyes vs Cornhuskers): sân cỏ giữa ĐỒNG BẮP lúc chiều thu nắng vàng, trời xanh mây trắng.
// Kiểu mới (khác E22–E26): KHÔNG khán đài bê tông — khán đài là các bậc KIỆN RƠM xếp tầng hai bên sân; fan còn đứng trên XE KÉO RƠM
// và THÙNG MÁY CÀY sau hai end zone; 4 SI-LÔ ngũ cốc ở góc, NHÀ KHO ĐỎ làm phòng bình luận, CỐI XAY GIÓ sau end zone trái,
// bảng điểm treo trên THÁP NÂNG HẠT sau end zone phải; TƯỜNG BẮP cao sau hai end zone. Không logo, không tên sân thật.
import * as THREE from 'three';
import { fieldTexture, goalPost, FL, FW } from './ngoaitroi.js';
import { GL } from './santap.js';
import { buildCrowd } from './dongnguoi25.js';
export const OX = GL - 50 * 0.9144;
export const FZ = FW / 2;
export const LX = OX - FL / 2, RX = OX + FL / 2;   // mép sau end zone trái / phải
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
let rs = 27; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
function sky() { const t = ctex(64, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#3a78c8'); gr.addColorStop(0.3, '#6aa6e0'); gr.addColorStop(0.46, '#bcd8ee'); gr.addColorStop(0.5, '#f4e2b8'); gr.addColorStop(0.53, '#b89a5a'); gr.addColorStop(1, '#6a5a3a');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i++) { const y = H * (0.12 + Math.random() * 0.3), x = Math.random() * W; g.fillStyle = 'rgba(255,255,255,0.55)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + k * 3 - 8, y + (k % 2) * 2, 6 + Math.random() * 6, 3 + Math.random() * 2, 0, 0, 7); g.fill(); } } });
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(6, 1);
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); }
// một thân bắp: thân + 4 lá + bắp + cờ bông (ghép 1 geometry để instancing)
function stalkGeo() {
  const parts = [];
  const st = new THREE.CylinderGeometry(0.025, 0.04, 2.4, 5).translate(0, 1.2, 0); parts.push([st, 0]);
  for (let k = 0; k < 4; k++) { const l = new THREE.PlaneGeometry(0.12, 0.9).translate(0, 0.45, 0).rotateZ(0.9 * (k % 2 ? 1 : -1)).rotateY(k * 1.7).translate(0, 0.7 + k * 0.38, 0); parts.push([l, 1]); }
  const cob = new THREE.CylinderGeometry(0.05, 0.04, 0.26, 6).rotateZ(0.35).translate(0.06, 1.35, 0); parts.push([cob, 2]);
  const tas = new THREE.ConeGeometry(0.06, 0.35, 4).translate(0, 2.55, 0); parts.push([tas, 3]);
  // ghép, tô màu theo đỉnh
  const cols = [[0.55, 0.62, 0.28], [0.62, 0.66, 0.3], [0.86, 0.74, 0.36], [0.82, 0.68, 0.36]];
  const pos = [], nor = [], col = [], idx = []; let off = 0;
  for (const [g, ci] of parts) { const ng = g.index ? g.toNonIndexed() : g; ng.computeVertexNormals(); const p = ng.attributes.position, n = ng.attributes.normal;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); col.push(...cols[ci]); idx.push(off + i); } off += p.count; }
  const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); G.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); G.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); G.setIndex(idx); return G; }
function cornfield(G) {
  const geo = stalkGeo(); const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
  const pts = [];
  // đồng bắp quanh sân (xa)
  for (let i = 0; i < 9000; i++) { const x = OX + (R() - 0.5) * 520, z = (R() - 0.5) * 520; if (Math.abs(x - OX) < FL / 2 + 44 && Math.abs(z) < FZ + 30) continue; pts.push([x, z, 0.8 + R() * 0.5]); }
  // TƯỜNG BẮP dày sau 2 end zone (gần → ghi hình đẹp)
  for (const s of [-1, 1]) for (let row = 0; row < 7; row++) for (let k = 0; k < 120; k++) { const x = OX + s * (FL / 2 + 6 + row * 0.7 + R() * 0.3), z = -FZ - 6 + k * (FW + 12) / 119 + (R() - 0.5) * 0.3; pts.push([x, z, 1.15 + R() * 0.35]); }
  const IM = new THREE.InstancedMesh(geo, m, pts.length); const D = new THREE.Object3D();
  pts.forEach(([x, z, s], i) => { D.position.set(x, 0, z); D.rotation.set((R() - 0.5) * 0.12, R() * 6.28, (R() - 0.5) * 0.12); D.scale.set(s, s * (0.9 + R() * 0.25), s); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); });
  IM.castShadow = false; IM.receiveShadow = true; IM.frustumCulled = false;
  // gió lay nhẹ (vertex shader)
  const U = { uT: { value: 0 } };
  m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.uT; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat hh = max(0.0, position.y - 0.4); float ph = instanceMatrix[3].x * 0.31 + instanceMatrix[3].z * 0.17; transformed.x += sin(uT * 1.6 + ph) * 0.05 * hh; transformed.z += cos(uT * 1.3 + ph) * 0.035 * hh;'); };
  G.add(IM); return U;
}
// bậc kiện rơm 2 bên sân → chỗ đứng khán giả
function hayStands(G, spots) {
  const geo = new THREE.BoxGeometry(1.4, 0.85, 0.95);
  const tex = ctex(128, 128, (g) => { g.fillStyle = '#d8b458'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 700; i++) { g.strokeStyle = `rgba(${150 + Math.random() * 80 | 0},${110 + Math.random() * 70 | 0},40,0.6)`; g.lineWidth = 1; const x = Math.random() * 128, y = Math.random() * 128; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 18, y + (Math.random() - 0.5) * 4); g.stroke(); }
    g.fillStyle = 'rgba(120,80,30,0.7)'; g.fillRect(0, 40, 128, 4); g.fillRect(0, 84, 128, 4); });
  const m = std('#ffffff', { map: tex, roughness: 1 });
  const list = [];
  for (const side of [-1, 1]) for (let tier = 0; tier < 5; tier++) { const z0 = side * (FZ + 4.2 + tier * 1.9); const h = tier * 0.85;
    for (let k = 0; k < 74; k++) { const x = OX - 51 + k * 1.42; if (side < 0 && Math.abs(x - 6) < 9 && tier > 1) continue;   // chừa chỗ nhà kho phía -z
      for (let st = 0; st <= tier; st++) list.push([x, h - st * 0.85 + 0.425, z0, (R() - 0.5) * 0.06]);
      list.push([x, h + 0.425, z0 + side * 0.95, (R() - 0.5) * 0.06]);
      for (let c = 0; c < 2; c++) if (R() > 0.1) spots.push({ x: x - 0.35 + c * 0.7 + (R() - 0.5) * 0.1, y: h + 0.85, z: z0 + side * 0.3, ry: side > 0 ? Math.PI : 0, team: x < OX ? 0 : 1 }); } }
  const IM = new THREE.InstancedMesh(geo, m, list.length); const D = new THREE.Object3D();
  list.forEach(([x, y, z, r], i) => { D.position.set(x, y, z); D.rotation.set(0, r, 0); D.scale.set(1, 1, 1); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); });
  IM.castShadow = true; IM.receiveShadow = true; G.add(IM);
}
// xe kéo rơm + máy cày sau 2 end zone (fan đứng trên thùng)
function wagons(G, spots) {
  const wood = std('#8a5a32'), red = std('#c8282a', { roughness: 0.55 }), green = std('#2e7a3a', { roughness: 0.5 }), tire = std('#1c1c1c', { roughness: 0.9 }), hay = std('#dcbc62', { roughness: 1 });
  for (const ex of [-1, 1]) for (let i = 0; i < 4; i++) { const cx = OX + ex * (FL / 2 + 15 + (i % 2) * 7), cz = -15 + i * 10; const W_ = new THREE.Group();
    const bed = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 6), wood); bed.position.set(0, 1.0, 0); W_.add(bed);
    for (const sx of [-1, 1]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 6), wood); rail.position.set(sx * 1.46, 1.42, 0); W_.add(rail); }
    for (const sx of [-1, 1]) for (const sz of [-2, 2]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16), tire); w.rotation.z = Math.PI / 2; w.position.set(sx * 1.5, 0.5, sz); W_.add(w); }
    const bale = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 5.6), hay); bale.position.set(0, 1.2, 0); W_.add(bale);
    // máy cày kéo phía trước (xen kẽ đỏ/xanh)
    const T = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 2.2), i % 2 ? green : red); body.position.set(0, 1.25, 0); T.add(body);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 1.1), i % 2 ? green : red); cab.position.set(0, 2.3, -0.5); T.add(cab);
    const big = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 18), tire); big.rotation.z = Math.PI / 2; for (const sx of [-1, 1]) { const b = big.clone(); b.position.set(sx * 0.9, 0.85, -0.6); T.add(b); }
    const sm_ = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 14), tire); sm_.rotation.z = Math.PI / 2; for (const sx of [-1, 1]) { const b = sm_.clone(); b.position.set(sx * 0.75, 0.45, 0.85); T.add(b); }
    const ex_ = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6), std('#2a2a2a')); ex_.position.set(0.4, 2.1, 0.8); T.add(ex_);
    T.position.set(0, 0, 4.4); W_.add(T);
    W_.position.set(cx, 0, cz); W_.rotation.y = 0; W_.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.add(W_);
    for (let row = 0; row < 3; row++) for (let k = 0; k < 7; k++) if (R() > 0.12) spots.push({ x: cx - 0.95 + row * 0.95, y: 1.3, z: cz - 2.6 + k * 0.85, ry: ex > 0 ? -Math.PI / 2 : Math.PI / 2, team: ex > 0 ? 1 : 0 }); }
}
function silo(G, x, z, h = 16, r = 3) { const S = new THREE.Group();
  const tex = ctex(128, 256, (g, W, H) => { g.fillStyle = '#c8ccd0'; g.fillRect(0, 0, W, H); for (let i = 0; i < H; i += 8) { g.fillStyle = i % 16 ? 'rgba(90,96,104,0.35)' : 'rgba(255,255,255,0.25)'; g.fillRect(0, i, W, 3); } }, [3, 1]);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), std('#ffffff', { map: tex, metalness: 0.5, roughness: 0.4 })); body.position.y = h / 2; S.add(body);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 10, 0, 6.29, 0, Math.PI / 2), std('#a8b0b8', { metalness: 0.6, roughness: 0.35 })); dome.position.y = h; dome.scale.y = 0.55; S.add(dome);
  const lad = new THREE.Mesh(new THREE.BoxGeometry(0.4, h, 0.1), std('#5a5e66')); lad.position.set(0, h / 2, r + 0.05); S.add(lad);
  S.position.set(x, 0, z); S.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.add(S); return S; }
function barn(G) { const B = new THREE.Group(); const red = std('#b0282a', { roughness: 0.8 }), white = std('#f2ece0'), roof = std('#4a4a52', { roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 10), red); body.position.y = 4; B.add(body);
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.3, 6.6), roof); r1.position.set(0, 9.6, 2.6); r1.rotation.x = 0.62; B.add(r1);
  const r2 = r1.clone(); r2.position.z = -2.6; r2.rotation.x = -0.62; B.add(r2);
  // mặt tiền (hướng sân, -z của nhóm sau khi xoay): cửa chữ X trắng + cửa sổ bình luận
  for (const dx of [-4, 4]) { const d = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.4, 0.12), red); d.position.set(dx, 2.2, -5.05); B.add(d);
    for (const a of [-1, 1]) { const x_ = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.4, 0.08), white); x_.position.set(dx, 2.2, -5.12); x_.rotation.z = a * 0.66; B.add(x_); } }
  const win = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, 0.1), std('#20303c', { metalness: 0.4, roughness: 0.2 })); win.position.set(0, 6.4, -5.06); B.add(win);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.25, 0.15), white); trim.position.set(0, 8.0, -5.08); B.add(trim);
  B.position.set(6, 0, -(FZ + 16)); B.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.add(B);
  // lịch treo tường nhà kho (lật được): mặt hướng sân
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 640; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.0), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 })); cal.position.set(6 - 6.6, 4.6, -(FZ + 16) + 5.12); G.add(cal);
  let last = ''; const draw = (mo, yr, flip = 0) => { const key = mo + yr + flip.toFixed(2); if (key === last) return; last = key; const g = cv.getContext('2d');
    g.fillStyle = '#f6f0e2'; g.fillRect(0, 0, 512, 640); g.fillStyle = '#b0282a'; g.fillRect(0, 0, 512, 170); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '900 96px Anton, Impact, sans-serif'; g.fillText(mo, 256, 125);
    g.fillStyle = '#2a2420'; g.font = '900 150px Anton, Impact, sans-serif'; g.fillText(yr, 256, 360);
    g.strokeStyle = 'rgba(40,36,32,0.25)'; for (let i = 0; i < 5; i++) for (let j = 0; j < 7; j++) g.strokeRect(40 + j * 62, 410 + i * 44, 62, 44);
    if (flip > 0) { g.fillStyle = `rgba(246,240,226,${flip})`; g.fillRect(0, 0, 512, 640 * flip); }
    t.needsUpdate = true; };
  draw('NOV', '2026'); return { B, cal, draw }; }
function windmill(G) { const W_ = new THREE.Group(); const steel = std('#8a9098', { metalness: 0.6, roughness: 0.4 });
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 15.5, 6), steel); leg.position.set(a * 0.9, 7.5, b * 0.9); leg.rotation.set(-b * 0.11, 0, a * 0.11); W_.add(leg); }
  for (let k = 1; k < 6; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5 - k * 0.2, 0.04, 4, 4), steel); ring.rotation.set(Math.PI / 2, 0, Math.PI / 4); ring.position.y = k * 2.6; W_.add(ring); }
  const hub = new THREE.Group(); hub.position.set(0, 15.6, 0.6); W_.add(hub);
  for (let k = 0; k < 18; k++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.4, 0.04), std(k % 2 ? '#e8e4dc' : '#b0282a', { side: THREE.DoubleSide })); bl.position.y = 1.5; bl.rotation.y = 0.35; const p = new THREE.Group(); p.add(bl); p.rotation.z = k / 18 * Math.PI * 2; hub.add(p); }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.4, 2.6), std('#b0282a')); tail.position.set(0, 15.6, -1.8); W_.add(tail);
  W_.position.set(LX - 22, 0, 8); W_.rotation.y = Math.PI / 2; W_.traverse((o) => { if (o.isMesh) o.castShadow = true; }); G.add(W_); return { W: W_, hub }; }
// tháp nâng hạt + bảng điểm (sau end zone phải)
function elevatorBoard(G) { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const B = new THREE.Group(); const conc = std('#d8d2c4', { roughness: 0.9 });
  for (const dz of [-4.5, -1.5, 1.5, 4.5]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 22, 18), conc); c.position.set(2.5, 11, dz); B.add(c); }
  const head = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), conc); head.position.set(2.5, 24.5, 0); B.add(head);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.6, 13), std('#1a1a1e')); frame.position.set(0.4, 14, 0); B.add(frame);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 7), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(0.1, 14, 0); face.rotation.y = -Math.PI / 2; B.add(face);
  B.position.set(RX + 30, 0, 0); B.traverse((o) => { if (o.isMesh) { o.castShadow = true; } }); G.add(B); let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d'); g.fillStyle = '#14100c'; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = '#e8c050'; g.lineWidth = 10; g.strokeRect(10, 10, 1004, 556); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = '900 100px Anton, Impact, sans-serif'; g.fillStyle = o.msgColor || '#fff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 512, 288 + (i - (a.length - 1) / 2) * 120)); t.needsUpdate = true; return; }
    // chữ cái nhận diện tự vẽ: O (đỏ scarlet viền xám) và N (đỏ, chữ kem)
    g.font = '900 120px Anton, Impact, sans-serif'; g.lineWidth = 8; g.strokeStyle = '#a8acb4'; g.fillStyle = '#bb0000'; g.strokeText('O', 270, 110); g.fillText('O', 270, 110);
    g.strokeStyle = '#fdf2d9'; g.fillStyle = '#e41c38'; g.strokeText('N', 754, 110); g.fillText('N', 754, 110);
    g.font = '900 220px Anton, Impact, sans-serif'; g.fillStyle = '#fff'; g.fillText(String(o.a ?? 0), 270, 320); g.fillText(String(o.b ?? 0), 754, 320);
    g.font = '900 64px Anton, Impact, sans-serif'; g.fillStyle = '#ffd08a'; g.fillText(o.clock || '', 512, 490); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'HARVEST BOWL' }); return { G: B, draw }; }
// cờ đội (chữ cái tự vẽ) cắm trên kiện rơm
export function teamFlag(letter, bg, fg) { const G = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6), std('#d8d2c4')); pole.position.y = 1.6; G.add(pole);
  const t = ctex(256, 160, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 256, 160); g.fillStyle = fg; g.font = '900 140px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(letter, 128, 86); });
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8, 8, 1), std('#ffffff', { map: t, side: THREE.DoubleSide })); fl.position.set(0.67, 2.75, 0); G.add(fl); G.userData.flag = fl; return G; }
export function buildHarvest(scene) {
  scene.background = new THREE.Color('#9cc4e8'); scene.fog = new THREE.Fog('#d8d4c4', 160, 620);
  const G = new THREE.Group(); scene.add(G); G.add(sky());
  // đất ruộng + cỏ quanh sân
  const dirt = ctex(128, 128, (g) => { g.fillStyle = '#8a6a42'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1600; i++) { g.fillStyle = i % 2 ? 'rgba(60,40,20,0.15)' : 'rgba(210,180,120,0.1)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [120, 120]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), std('#ffffff', { map: dirt, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.03, 0); ground.receiveShadow = true; G.add(ground);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#5a9a3e'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(30,70,20,0.1)' : 'rgba(210,230,140,0.08)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [40, 20]);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(FL + 10, FW + 7), std('#ffffff', { map: turf, roughness: 0.95 })); apron.rotation.x = -Math.PI / 2; apron.position.set(OX, -0.015, 0); apron.receiveShadow = true; G.add(apron);
  const ft = fieldTexture({ endLeft: '#bb0000', endLeftText: 'OHIO ST', endLeftStroke: '#a8acb4', endRight: '#e41c38', endRightText: 'NEBRASKA', endRightFg: '#fdf2d9', g1: '#4a9a3e', g2: '#56a848' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  // cột gôn: bọc trong khớp xoay ở chân trụ để có thể KÉO ĐỔ
  const posts = [-1, 1].map((d) => { const gp = goalPost(d); const piv = new THREE.Group(); const baseX = (d < 0 ? LX : RX) + d * 1.8; piv.position.set(baseX, 0, 0); gp.position.set(-d * 1.8, 0, 0); piv.add(gp); G.add(piv); return piv; });
  // hàng rào gỗ thấp quanh sân
  const fence = std('#f2ece0'); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(FL + 10, 0.1, 0.06), fence); r.position.set(OX, 0.75, s * (FZ + 3.2)); G.add(r); const r2 = r.clone(); r2.position.y = 0.35; G.add(r2);
    for (let k = 0; k <= 46; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), fence); p.position.set(OX - (FL + 10) / 2 + k * (FL + 10) / 46, 0.45, s * (FZ + 3.2)); G.add(p); } }
  const cornU = cornfield(G); const spots = []; hayStands(G, spots); wagons(G, spots);
  for (const [x, z] of [[LX - 12, -FZ - 14], [LX - 12, FZ + 14], [RX + 12, -FZ - 14], [RX + 12, FZ + 14], [LX - 19, -FZ - 9]]) silo(G, x, z, 15 + R() * 4, 2.6 + R() * 0.8);
  const barnO = barn(G); const mill = windmill(G); const board = elevatorBoard(G);
  const flags = []; for (const s of [-1, 1]) for (let k = 0; k < 8; k++) { const left = k < 4; const f = teamFlag(left ? 'O' : 'N', left ? '#bb0000' : '#e41c38', left ? '#e8eaee' : '#fdf2d9'); f.position.set(OX - 44 + k * 12.5, 0.85 * 5, s * (FZ + 4.2 + 4 * 1.9 + 1.2)); f.rotation.y = s > 0 ? Math.PI : 0; G.add(f); flags.push(f); }
  const crowd = buildCrowd(G, spots, { seed: 27, coats: ['#e41c38', '#e41c38', '#fdf2d9', '#e41c38', '#c8102e', '#f2efe8', '#e41c38', '#bb0000', '#a8acb4', '#e41c38'], hats: ['#e8c878', '#e41c38', '#d8b458', '#f2efe8'], paint: ['#e41c38', '#bb0000'], towels: ['#e41c38', '#fdf2d9', '#e8c878'] });
  const update = (t) => { cornU.uT.value = t; mill.hub.rotation.z = t * 1.6; flags.forEach((f, i) => { f.userData.flag.rotation.y = Math.sin(t * 2.2 + i) * 0.18; }); };
  return { G, crowd, board, posts, barn: barnO, mill, update };
}
export function harvestLights(scene) {
  const hemi = new THREE.HemisphereLight('#e8f0ff', '#8a7a52', 2.4); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe6b8', 4.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#bcd4ff', 0.9); fill.position.set(40, 20, 30); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 26, 32, z - 14); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.75).multiplyScalar(26); key.position.set(x + d.x, 32, z + d.z); };
  area(0, 0); return { hemi, key, fill, area, lamps: () => {} };
}
