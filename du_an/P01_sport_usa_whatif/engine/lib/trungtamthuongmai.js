// Tập 15 (NFL, khuôn ĐỐI ĐẦU CÔNG SỞ) — "Could Kirk Cousins beat Carson Wentz for the returns desk job in Minnesota?"
// Bối cảnh MỚI: sảnh trung tâm thương mại HƯ CẤU "TEN THOUSAND LAKES MALL" mùa lễ, lúc chạng vạng.
// Bảng màu (không trùng E13 bãi tuyết / E14 neon hồng-teal-xanh lá):
//   mảng tối = sàn đá xám than, quầy gỗ óc chó sẫm, tường xanh rêu đậm;
//   điểm sáng ấm = dây đèn hổ phách, nơ đỏ nam việt quất, tay vịn đồng thau; MỘT neon = biển RETURNS vàng chanh;
//   ngoài cửa kính = tuyết xanh xám + trời tím than.
// Toạ độ: quầy đổi trả tâm (0, -1.0), mặt quầy hướng +z; nhân viên đứng z = -1.65; khách đứng z = -0.25;
// tường sau z = -3.2 (cửa kính ra bãi xe x = -4.4, cửa kho nhân viên x = 2.7); bàn gói quà (3.9, 0.2); cây thông (-3.2, 1.4).
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
const glow = (map, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ map, toneMapped: false, transparent: true }, o));
export const PAL = { moss: '#24392e', walnut: '#3a2418', char: '#2b2d31', amber: '#ffb44a', cran: '#9e1b32', brass: '#c9a04a', lemon: '#e8ff3a' };
export const SPOT = { desk: [0, -1.0], staffW: [-0.9, -1.65], staffK: [0.9, -1.65], cust: -0.25, door: [-4.4, -3.2], stock: [3.6, -3.2], wrap: [3.9, 0.2], tree: [-3.2, 1.4] };

// chữ trên canvas luôn có maxWidth
function label(txt, o = {}) {
  const P = Object.assign({ w: 1024, h: 200, font: '900 150px Anton, Impact, sans-serif', color: '#fff', bg: null, glowC: null, blur: 0 }, o);
  return ctex(P.w, P.h, (g, W, H) => { g.clearRect(0, 0, W, H); if (P.bg) { g.fillStyle = P.bg; g.fillRect(0, 0, W, H); }
    g.font = P.font; g.textAlign = 'center'; g.textBaseline = 'middle'; if (P.glowC) { g.shadowColor = P.glowC; g.shadowBlur = P.blur; } g.fillStyle = P.color; g.fillText(txt, W / 2, H / 2 + 4, W * 0.92); });
}
function outside(G) {
  // bãi xe tuyết lúc chạng vạng sau cửa kính
  const t = ctex(16, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2a2650'); gr.addColorStop(0.45, '#4a3e6e'); gr.addColorStop(0.62, '#8a6a7e'); gr.addColorStop(0.64, '#9aa6b8'); gr.addColorStop(1, '#c8d2de'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); bg.position.set(-4.4, 5, -9); G.add(bg);
  const pole = std('#3a3c44'); for (const [x, z] of [[-8, -7], [-1, -8]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6, 8), pole); p.position.set(x, 3, z); G.add(p);
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffd8a0', toneMapped: false })); l.position.set(x, 6, z); G.add(l); }
  const snow = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), std('#d6dee8', { roughness: 0.95 })); snow.rotation.x = -Math.PI / 2; snow.position.set(-4.4, 0.02, -8); G.add(snow);
}
function stringLights(G, x0, x1, z, y, n, sag = 0.5) {
  const pts = []; for (let i = 0; i < n; i++) { const k = i / (n - 1); pts.push(new THREE.Vector3(x0 + (x1 - x0) * k, y - sag * 4 * k * (1 - k), z)); }
  const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffc46a', toneMapped: false }), n); const m = new THREE.Matrix4();
  pts.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m); }); G.add(im);
  const wire = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#1a1a1a' })); G.add(wire);
}
function storefront(G, x, z, ry, name, col) {
  const S = new THREE.Group(); S.position.set(x, 0, z); S.rotation.y = ry; G.add(S);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.4, 0.2), std(PAL.walnut, { roughness: 0.5 })); frame.position.y = 1.7; S.add(frame);
  const win = ctex(256, 200, (g, W, H) => { g.fillStyle = '#4a3420'; g.fillRect(0, 0, W, H); const r = rnd(x * 7 + 3); for (let i = 0; i < 26; i++) { g.fillStyle = [col, '#e8d8b8', PAL.cran, '#6a8a6a'][i % 4]; g.fillRect(10 + r() * 220, 60 + r() * 120, 18 + r() * 20, 18 + r() * 30); }
    const gr = g.createRadialGradient(W / 2, 30, 0, W / 2, 30, 200); gr.addColorStop(0, 'rgba(255,214,150,0.55)'); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const w = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 2.4), new THREE.MeshStandardMaterial({ map: win, emissive: '#ffffff', emissiveMap: win, emissiveIntensity: 0.55, roughness: 0.2 })); w.position.set(0, 1.4, 0.11); S.add(w);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.5), glow(label(name, { color: '#ffe2b0', font: '900 120px Anton, Impact, sans-serif' }))); sg.position.set(0, 3.0, 0.12); S.add(sg);
}
function tree(G) {
  const T = new THREE.Group(); T.position.set(SPOT.tree[0], 0, SPOT.tree[1]); G.add(T);
  const gm = std('#1f4a30', { roughness: 0.9 });
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.25 - i * 0.22, 1.2, 14), gm); c.position.y = 0.9 + i * 0.62; c.castShadow = true; T.add(c); }
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.5, 8), std('#4a3020')); trunk.position.y = 0.25; T.add(trunk);
  const r = rnd(4); const orn = [PAL.cran, PAL.brass, '#e8e0d0'];
  for (let i = 0; i < 46; i++) { const h = 0.8 + r() * 2.6; const rad = (1.25 - (h - 0.6) * 0.34) * 0.92; const a = r() * Math.PI * 2;
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), i % 3 === 0 ? new THREE.MeshBasicMaterial({ color: '#ffc46a', toneMapped: false }) : std(orn[i % 3], { metalness: 0.6, roughness: 0.3 })); o.position.set(Math.cos(a) * rad, h, Math.sin(a) * rad); T.add(o); }
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), new THREE.MeshBasicMaterial({ color: '#ffd27a', toneMapped: false })); star.position.y = 4.0; T.add(star);
  const L = new THREE.PointLight('#ffb860', 6, 6, 1.8); L.position.set(0, 2.5, 0.8); T.add(L);
  for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), std(i % 2 ? PAL.cran : '#e8dcc4')); b.position.set(Math.cos(i) * 1.0, 0.15, Math.sin(i) * 1.0); b.rotation.y = i; T.add(b); }
}
// cửa kính trượt 2 cánh; set(k) 0..1
function slidingDoor() {
  const G = new THREE.Group(); const gm = new THREE.MeshPhysicalMaterial({ color: '#cfe0ee', transparent: true, opacity: 0.28, roughness: 0.05 }); const fr = std(PAL.brass, { metalness: 0.8, roughness: 0.3 });
  const panes = [-1, 1].map((s) => { const p = new THREE.Group(); const g = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.7, 0.05), gm); g.position.y = 1.35; p.add(g); for (const y of [0.04, 2.7]) { const f = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.07, 0.08), fr); f.position.y = y; p.add(f); } p.position.x = s * 0.6; G.add(p); return { p, s }; });
  const hd = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.3), std(PAL.char)); hd.position.y = 2.95; G.add(hd);
  const ex = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.24), glow(label('ENTRANCE', { color: '#ffe2b0', font: '900 130px Anton, Impact' }))); ex.position.set(0, 2.95, 0.16); G.add(ex);
  return { G, set: (k) => panes.forEach(({ p, s }) => { p.position.x = s * (0.6 + 1.15 * k); }) };
}
function desk(G) {
  const D = new THREE.Group(); D.position.set(SPOT.desk[0], 0, SPOT.desk[1]); G.add(D);
  const wal = std(PAL.walnut, { roughness: 0.45 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.0, 0.7), wal); body.position.y = 0.5; D.add(body);
  // ván gỗ dọc mặt trước
  const plank = std('#4a2e1e', { roughness: 0.5 }); for (let i = 0; i < 11; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.02), plank); p.position.set(-2.0 + i * 0.4, 0.5, 0.36); D.add(p); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.06, 0.85), std('#1c1c1e', { roughness: 0.25, metalness: 0.2 })); top.position.y = 1.03; D.add(top);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, 0.04), std(PAL.brass, { metalness: 0.9, roughness: 0.25 })); rail.position.set(0, 0.12, 0.42); D.add(rail);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.42), new THREE.MeshStandardMaterial({ map: label('RETURNS & EXCHANGES', { color: '#f4e6c8', bg: PAL.cran, font: '900 100px Anton, Impact' }), roughness: 0.6 })); sign.position.set(0, 0.62, 0.37); D.add(sign);
  // 2 máy tính tiền + máy in hoá đơn
  for (const x of [-0.9, 0.9]) { const reg = new THREE.Group(); reg.position.set(x, 1.06, -0.1);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.32), std('#2a2a2e')); base.position.y = 0.05; reg.add(base);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.03), std('#1a1a1a')); scr.position.set(0, 0.28, -0.06); scr.rotation.x = -0.25; reg.add(scr);
    const glowS = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshBasicMaterial({ color: '#9ad8ff', toneMapped: false })); glowS.position.set(0, 0.285, -0.04); glowS.rotation.x = -0.25; reg.add(glowS);
    const pr = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), std('#d8d8d8')); pr.position.set(0.24, 0.06, 0.06); reg.add(pr); D.add(reg); }
  // biển trạng thái OPEN / CLOSED trên mặt quầy (setOpen)
  const mk = (txt, c) => new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.14), new THREE.MeshBasicMaterial({ map: label(txt, { color: '#fff', bg: c, w: 512, h: 200, font: '900 140px Anton, Impact' }), toneMapped: false }));
  const opn = [], cls = []; for (const x of [-0.9, 0.9]) { const o = mk('OPEN', '#2f8a4a'); o.position.set(x - 0.3, 1.14, 0.3); D.add(o); opn.push(o); const c = mk('CLOSED', '#5a5a60'); c.position.copy(o.position); D.add(c); cls.push(c); }
  // cột chặn hàng chờ + dây nhung đỏ
  const post = std(PAL.brass, { metalness: 0.9, roughness: 0.25 }), rope = std(PAL.cran, { roughness: 0.6 });
  for (const sd of [-1, 1]) { const xs = sd * 1.75; let prev = null; for (let i = 0; i < 4; i++) { const z = 0.8 + i * 1.3; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 8), post); p.position.set(xs - SPOT.desk[0], 0.48, z - SPOT.desk[1]); D.add(p);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 16), post); b.position.set(p.position.x, 0.015, p.position.z); D.add(b);
    if (prev) { const c = new THREE.CatmullRomCurve3([prev, new THREE.Vector3(xs, 0.72, z - 0.65 - SPOT.desk[1]), new THREE.Vector3(xs, 0.88, z - SPOT.desk[1])]); const tb = new THREE.Mesh(new THREE.TubeGeometry(c, 12, 0.018, 6), rope); D.add(tb); }
    prev = new THREE.Vector3(xs, 0.88, z - SPOT.desk[1]); } }
  D.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { setOpen: (i, on) => { opn[i].visible = on; cls[i].visible = !on; } };
}
function shelving(G) {
  const S = new THREE.Group(); S.position.set(0, 0, -2.75); G.add(S); const wood = std('#2e1c12', { roughness: 0.6 }); const r = rnd(77);
  const back = new THREE.Mesh(new THREE.BoxGeometry(5.6, 3.2, 0.05), std('#1c1714')); back.position.set(0, 1.6, -0.27); S.add(back);
  for (const x of [-2.8, -0.93, 0.93, 2.8]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 0.55), wood); p.position.set(x, 1.6, 0); S.add(p); }
  const cols = ['#c8283a', '#e8b84a', '#3a7ac0', '#2f8a5a', '#e8e0d0', '#8a4ab0', '#e87a3a', '#4ab8b0', '#d85a8a', '#6a5a4a'];
  for (let lv = 0; lv < 5; lv++) { const y = 0.12 + lv * 0.68; const b = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.04, 0.55), wood); b.position.set(0, y, 0); S.add(b);
    if (lv === 4) break;
    for (let bay = 0; bay < 3; bay++) { let x = -2.7 + bay * 1.87 + 0.08; const xe = x + 1.7;
      while (x < xe - 0.15) { const kind = r(); const w = 0.18 + r() * 0.32, h = 0.15 + r() * 0.42; const c = cols[Math.floor(r() * cols.length)]; let m;
        if (kind < 0.62) { m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.32 + r() * 0.15), std(c, { roughness: 0.65 })); m.position.set(x + w / 2, y + 0.02 + h / 2, (r() - 0.5) * 0.06); m.rotation.y = (r() - 0.5) * 0.2;
          if (r() < 0.4) { const rib = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, 0.025, 0.02), std(c === '#e8e0d0' ? '#c8283a' : '#f4ead4')); rib.position.set(0, 0, 0.2); m.add(rib); } }
        else if (kind < 0.75) { m = new THREE.Group(); const bd = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), std(['#a0704a', '#e8dcc4', '#c88a5a'][Math.floor(r() * 3)], { roughness: 1 })); bd.position.y = 0.12; m.add(bd); const hd = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), bd.material); hd.position.y = 0.3; m.add(hd); for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), bd.material); e.position.set(sx * 0.065, 0.37, 0); m.add(e); } m.position.set(x + 0.13, y + 0.02, 0); }
        else if (kind < 0.86) { m = new THREE.Group(); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 0.16, 14, 1, true), std(c, { side: THREE.DoubleSide })); sh.position.y = 0.36; m.add(sh); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), std(PAL.brass, { metalness: 0.8 })); st.position.y = 0.15; m.add(st); const bl = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffd8a0', toneMapped: false })); bl.position.y = 0.32; m.add(bl); m.position.set(x + 0.12, y + 0.02, 0); }
        else { m = new THREE.Group(); const tv = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.06), std('#141414', { roughness: 0.3 })); tv.position.y = 0.17; m.add(tv); const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.24), new THREE.MeshBasicMaterial({ color: ['#4a8ad8', '#e85a7a', '#5ad8a0'][Math.floor(r() * 3)], toneMapped: false })); sc.position.set(0, 0.17, 0.031); m.add(sc); m.position.set(x + 0.22, y + 0.02, 0); }
        S.add(m); x += (kind < 0.62 ? w : kind < 0.86 ? 0.26 : 0.46) + 0.04; } } }
  // xe đạp trả lại treo trên nóc kệ
  const bike = new THREE.Group(); const tm = std('#c8283a', { metalness: 0.5, roughness: 0.4 }), rb = std('#151515');
  for (const x of [-0.42, 0.42]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 24), rb); w.position.x = x; bike.add(w); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.04, 0.04), tm); fr.position.y = 0.18; bike.add(fr); const fr2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), tm); fr2.position.set(-0.1, 0.25, 0); fr2.rotation.z = 0.4; bike.add(fr2);
  bike.position.set(-2.2, 3.62, 0); S.add(bike); const bx = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.45), std('#3a7ac0')); bx.position.set(2.1, 3.5, 0); S.add(bx); const bx2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.45), std('#e8b84a')); bx2.position.set(-1.15, 3.45, 0); S.add(bx2);
  for (let i = 0; i < 3; i++) { const L = new THREE.PointLight('#ffc88a', 3, 3.5, 1.8); L.position.set(-1.87 + i * 1.87, 2.9, 0.6); S.add(L); }
  S.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
}
// hộp đồ chơi khổng lồ (cửa nhựa trong mở được): toyBox(tên, dòng phụ) → { G, front }
export function toyBox(name, sub, col = '#4f2683') {
  const G = new THREE.Group(); const card = std(col, { roughness: 0.6 }); const W2 = 0.95, H2 = 2.35, D2 = 0.75;
  const back = new THREE.Mesh(new THREE.BoxGeometry(W2, H2, 0.04), std('#f2e8d0', { map: ctex(256, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffe7a8'); gr.addColorStop(1, '#f0b84a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 10; for (let i = -H; i < W + H; i += 60) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.stroke(); } }) }));
  back.position.set(0, H2 / 2, -D2 / 2); G.add(back);
  for (const sx of [-1, 1]) { const sd = new THREE.Mesh(new THREE.BoxGeometry(0.04, H2, D2), card); sd.position.set(sx * W2 / 2, H2 / 2, 0); G.add(sd); }
  const bot = new THREE.Mesh(new THREE.BoxGeometry(W2, 0.12, D2), card); bot.position.y = 0.06; G.add(bot);
  const top = new THREE.Mesh(new THREE.BoxGeometry(W2 + 0.04, 0.55, D2 + 0.04), card); top.position.y = H2 + 0.25; G.add(top);
  const hdT = ctex(512, 300, (g, W, H) => { g.fillStyle = col; g.fillRect(0, 0, W, H); g.fillStyle = '#ffc62f'; g.fillRect(0, H - 34, W, 34); g.textAlign = 'center'; g.fillStyle = '#ffffff'; g.font = '900 120px Anton, Impact'; g.fillText(name, W / 2, 130, W * 0.9); g.fillStyle = '#ffc62f'; g.font = '900 64px Anton, Impact'; g.fillText(sub, W / 2, 222, W * 0.9); });
  const hd = new THREE.Mesh(new THREE.PlaneGeometry(W2 + 0.04, 0.55), std('#fff', { map: hdT })); hd.position.set(0, H2 + 0.25, D2 / 2 + 0.022); G.add(hd);
  const front = new THREE.Group(); front.position.set(0, 0.12, D2 / 2); G.add(front);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(W2 - 0.02, H2 - 0.12), new THREE.MeshPhysicalMaterial({ color: '#e8f4ff', transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false })); pl.position.y = (H2 - 0.12) / 2; front.add(pl);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.08, H2 - 0.3), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false })); sh.position.set(-0.25, (H2 - 0.12) / 2, 0.005); front.add(sh);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return { G, front };
}
function wrapTable(G) {
  const T = new THREE.Group(); T.position.set(SPOT.wrap[0], 0, SPOT.wrap[1]); G.add(T);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.8), std('#e8dcc4', { roughness: 0.6 })); top.position.y = 0.92; T.add(top);
  for (const [x, z] of [[-0.72, -0.34], [0.72, -0.34], [-0.72, 0.34], [0.72, 0.34]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), std(PAL.walnut)); l.position.set(x, 0.45, z); T.add(l); }
  for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 12), std([PAL.cran, '#2f6a4a', PAL.brass, '#e8e0d0'][i])); r.rotation.z = Math.PI / 2; r.position.set(0, 0.99 + (i > 1 ? 0.1 : 0), -0.25 + (i % 2) * 0.1); T.add(r); }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.36), new THREE.MeshStandardMaterial({ map: label('GIFT WRAP', { color: '#fff4e0', bg: '#2f6a4a', font: '900 130px Anton, Impact' }) })); sg.position.set(0, 0.6, 0.41); T.add(sg);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.28), std(PAL.cran, { roughness: 0.5 })); box.position.set(0.2, 1.06, 0.1); T.add(box);
  const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.05, 0.015, 32, 6), std(PAL.brass, { metalness: 0.6 })); bow.position.set(0.2, 1.2, 0.1); T.add(bow);
  T.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return { box, bow };
}
export function buildMall(scene) {
  scene.background = new THREE.Color('#1c1a24'); scene.fog = new THREE.Fog('#2a2430', 30, 90);
  const G = new THREE.Group(); scene.add(G); outside(G);
  // sàn đá xám than, ô lớn, hơi bóng (polygonOffset chống z-fighting với nền ngoài)
  const flT = ctex(512, 512, (g) => { g.fillStyle = '#34363b'; g.fillRect(0, 0, 512, 512); const r = rnd(9); for (let i = 0; i < 6000; i++) { const v = 40 + r() * 40; g.fillStyle = `rgba(${v},${v},${v + 4},0.35)`; g.fillRect(r() * 512, r() * 512, 2, 2); } g.strokeStyle = 'rgba(20,20,22,0.9)'; g.lineWidth = 4; for (let i = 0; i <= 512; i += 256) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } }, [16, 16]);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), std('#ffffff', { map: flT, roughness: 0.32, metalness: 0.15, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 4); floor.receiveShadow = true; G.add(floor);
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 9), std(PAL.cran, { roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 })); runner.rotation.x = -Math.PI / 2; runner.position.set(SPOT.door[0], 0.005, 1.2); runner.receiveShadow = true; G.add(runner);
  // tường sau xanh rêu đậm, ốp gỗ chân tường, viền đồng
  const wallT = ctex(512, 256, (g, W, H) => { g.fillStyle = '#2a2826'; g.fillRect(0, 0, W, H); const r = rnd(12); for (let i = 0; i < 3000; i++) { const v = 34 + r() * 16; g.fillStyle = `rgba(${v + 6},${v + 2},${v},0.5)`; g.fillRect(r() * W, r() * H, 3, 3); } g.fillStyle = 'rgba(201,160,74,0.35)'; for (let y = 0; y < H; y += 128) g.fillRect(0, y, W, 2); }, [6, 2]);
  const wallM = std('#ffffff', { map: wallT, roughness: 0.85 });
  for (const [x0, x1] of [[-12, -5.8], [-3.0, 12]]) { const w = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 6, 0.3), wallM); w.position.set((x0 + x1) / 2, 3, -3.35); w.receiveShadow = true; G.add(w);
    const wain = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1.1, 0.06), std(PAL.walnut, { roughness: 0.5 })); wain.position.set((x0 + x1) / 2, 0.55, -3.17); G.add(wain);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.05, 0.08), std(PAL.brass, { metalness: 0.9, roughness: 0.25 })); tr.position.set((x0 + x1) / 2, 1.12, -3.15); G.add(tr); }
  const lint = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.9, 0.3), wallM); lint.position.set(SPOT.door[0], 4.55, -3.35); G.add(lint);
  const D = slidingDoor(); D.G.position.set(SPOT.door[0], 0, -3.2); G.add(D.G);
  // cửa kho nhân viên
  const sd = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.08), std('#4a2e1e', { roughness: 0.5 })); sd.position.set(SPOT.stock[0], 1.1, -3.17); G.add(sd);
  const sdl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.16), glow(label('STAFF ONLY', { color: '#ffe2b0', font: '900 130px Anton, Impact' }))); sdl.position.set(SPOT.stock[0], 2.4, -3.12); G.add(sdl);
  // KHO HÀNG TRẢ LẠI phía sau quầy: 3 khoang kệ gỗ tối cao 3 m, chất đầy đồ nhiều màu
  shelving(G);
  // mặt tiền cửa hàng trên tường sau (2 bên quầy) — cửa sổ sáng đèn vàng
  storefront(G, 8.7, -3.15, 0, 'COFFEE', '#a0784a'); storefront(G, -9.0, -3.15, 0, 'TEA', '#6a7a4a');
  // biển neon RETURNS vàng chanh (điểm neon duy nhất) + biển tên mall
  const ret = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.44), glow(label('RETURNS', { color: '#f6ffb0', glowC: PAL.lemon, blur: 40, font: '900 170px Anton, Impact, sans-serif' }))); ret.position.set(0, 3.55, -2.62); G.add(ret);
  const nl = new THREE.PointLight(PAL.lemon, 2.2, 4, 2); nl.position.set(0, 3.0, -2.4); G.add(nl);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 0.9), new THREE.MeshStandardMaterial({ map: label('TEN THOUSAND LAKES MALL', { color: '#f4e6c8', bg: PAL.walnut, font: '900 120px Anton, Impact' }), emissive: '#ffffff', emissiveMap: label('TEN THOUSAND LAKES MALL', { color: '#f4e6c8', bg: PAL.walnut, font: '900 120px Anton, Impact' }), emissiveIntensity: 0.25 })); banner.position.set(4.6, 4.8, -3.18); G.add(banner);
  const hire = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshStandardMaterial({ map: ctex(600, 400, (g, W, H) => { g.fillStyle = '#f4ead4'; g.fillRect(0, 0, W, H); g.fillStyle = PAL.cran; g.fillRect(0, 0, W, 110); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '900 90px Anton, Impact'; g.fillText('NOW HIRING', W / 2, 88, W * 0.9); g.fillStyle = '#1a1a1a'; g.font = '900 96px Anton, Impact'; g.fillText('RETURNS DESK', W / 2, 230, W * 0.9); g.font = '700 64px Anton, Impact'; g.fillText('1 OPENING', W / 2, 330, W * 0.9); }), roughness: 0.6 })); hire.position.set(-2.55, 1.75, -0.5); G.add(hire); { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.25, 8), std(PAL.brass, { metalness: 0.9, roughness: 0.25 })); st.position.set(-2.55, 0.62, -0.53); G.add(st); const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16), st.material); bs.position.set(-2.55, 0.015, -0.53); G.add(bs); }
  // trần tối + dây đèn hổ phách
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), std('#1e1c20', { side: THREE.DoubleSide })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 6, 4); G.add(ceil);
  for (let i = 0; i < 5; i++) stringLights(G, -8, 8, -2.6 + i * 2.2, 5.2, 60, 0.6);
  for (let i = 0; i < 4; i++) { const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), new THREE.MeshBasicMaterial({ color: '#ffe0b0', toneMapped: false })); pl.position.set(-3 + i * 2, 5.94, -1.4); G.add(pl); }
  // cửa hàng hai bên (tên chung, không thương hiệu)
  for (const [z, n, c] of [[-1.6, 'SHOES', '#8a6a4a'], [2.2, 'TOYS', '#4a7aa0'], [6.0, 'CANDLES', '#a07a4a']]) storefront(G, -7.2, z, Math.PI / 2, n, c);
  for (const [z, n, c] of [[-1.6, 'SWEATERS', '#8a4a5a'], [2.2, 'BOOKS', '#5a6a4a'], [6.0, 'GAMES', '#4a5a8a']]) storefront(G, 7.2, z, -Math.PI / 2, n, c);
  for (const [x, z] of [[-6.3, -3.0], [6.3, -3.0], [-6.3, 8], [6.3, 8]]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 0.6), std(PAL.char, { roughness: 0.4 })); c.position.set(x, 3, z); G.add(c); }
  // cột trụ trang trí vòng nguyệt quế đỏ
  for (const x of [-5.4, 5.4]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.1, 8, 20), std('#1f4a30')); w.position.set(x, 2.6, -3.1); G.add(w); const bw = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.08), std(PAL.cran)); bw.position.set(x, 2.25, -3.02); G.add(bw); }
  tree(G);
  const DK = desk(G); const WT = wrapTable(G);
  G.traverse((o) => { if (o.isMesh && !o.material.isMeshBasicMaterial) o.receiveShadow = true; });
  return { G, door: D, desk: DK, wrap: WT };
}
export function mallLights(scene) {
  const hemi = new THREE.HemisphereLight('#f0d8c0', '#3a3036', 1.55); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffd0a0', 2.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 60 }); key.shadow.bias = -0.0004; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#a8b8e0', 0.9); fill.position.set(-10, 8, -12); scene.add(fill);
  for (const [x, z] of [[-3, 0], [0, 1.5], [3, 0], [0, 5], [-4, 5], [4, 5]]) { const L = new THREE.PointLight('#ffcc90', 7, 9, 1.6); L.position.set(x, 4.8, z); scene.add(L); }
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 4, z = cam.position.z + d.z * 4; key.target.position.set(x, 0, z); key.position.set(x + 6, 14, z + 10); };
  return { follow };
}
// ---------- đạo cụ ----------
export function paper(w = 0.09, h = 0.2, txt = null) {
  const t = ctex(180, 400, (g, W, H) => { g.fillStyle = '#f6f2e8'; g.fillRect(0, 0, W, H); g.fillStyle = '#444'; for (let y = 40; y < H - 20; y += 22) g.fillRect(16, y, 60 + ((y * 7) % 90), 6); if (txt) { g.fillStyle = '#1a1a1a'; g.font = '900 40px Anton, Impact'; g.textAlign = 'center'; g.fillText(txt, W / 2, 30, W * 0.9); } });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), std('#ffffff', { map: t, side: THREE.DoubleSide })); m.castShadow = true; return m;
}
export function card(color = PAL.cran) {
  const t = ctex(256, 160, (g, W, H) => { g.fillStyle = color; g.fillRect(0, 0, W, H); g.fillStyle = PAL.brass; g.fillRect(0, 60, W, 14); g.fillStyle = '#fff'; g.font = '900 44px Anton, Impact'; g.textAlign = 'center'; g.fillText('GIFT CARD', W / 2, 130, W * 0.9); });
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.004), [std(color), std(color), std(color), std(color), std('#fff', { map: t }), std(color)]); m.castShadow = true; return m;
}
export function envelope() {
  const G = new THREE.Group(); const e = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.012), std('#e8dcc0', { roughness: 0.7 })); G.add(e);
  const t = ctex(256, 128, (g, W, H) => { g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, W, H); g.fillStyle = '#2f6a3a'; g.font = '900 56px Anton, Impact'; g.textAlign = 'center'; g.fillText('REFUND', W / 2, 80, W * 0.9); });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), std('#fff', { map: t })); f.position.z = 0.007; G.add(f);
  const cash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.006), std('#7aa86a')); cash.position.set(0.02, 0.07, 0); G.add(cash); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
export function scanner() {
  const G = new THREE.Group(); const k = std('#2a2a2e', { roughness: 0.4 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.16), k); head.position.z = 0.06; G.add(head);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 0.05), k); grip.position.set(0, -0.08, -0.01); grip.rotation.x = 0.35; G.add(grip);
  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.04), new THREE.MeshBasicMaterial({ color: '#ff2a2a', toneMapped: false })); lens.position.z = 0.142; G.add(lens);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1, 4).translate(0, 0.5, 0).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ff3030', toneMapped: false, transparent: true, opacity: 0.85 })); beam.position.z = 0.14; G.add(beam);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return { G, beam };
}
export function clipboard() {
  const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.012), std('#8a6a4a')); G.add(b);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.27), std('#fff', { map: ctex(210, 270, (g, W, H) => { g.fillStyle = '#fafafa'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1a1a'; g.font = '900 30px Anton'; g.textAlign = 'center'; g.fillText('RETURN FORM', W / 2, 40, W * 0.9); g.fillStyle = '#888'; for (let y = 70; y < 230; y += 26) g.fillRect(20, y, 170, 3); g.strokeStyle = '#1a3aa0'; g.lineWidth = 4; g.beginPath(); g.moveTo(40, 240); g.bezierCurveTo(70, 210, 90, 260, 120, 230); g.bezierCurveTo(140, 215, 160, 250, 180, 232); g.stroke(); }) })); p.position.z = 0.007; G.add(p);
  const c = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.02), std('#c8ccd2', { metalness: 0.9 })); c.position.set(0, 0.15, 0.012); G.add(c); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// thẻ hàng trả lại treo cổ Kirk
export function returnTag() {
  const t = ctex(400, 560, (g, W, H) => { g.fillStyle = '#f6f0dc'; g.beginPath(); g.moveTo(60, 0); g.lineTo(W - 60, 0); g.lineTo(W, 60); g.lineTo(W, H); g.lineTo(0, H); g.lineTo(0, 60); g.closePath(); g.fill();
    g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(W / 2, 45, 16, 0, 7); g.fill(); g.textAlign = 'center'; g.fillStyle = PAL.cran; g.font = '900 64px Anton, Impact'; g.fillText('RETURNED', W / 2, 140, W * 0.9);
    g.fillStyle = '#1a1a1a'; g.font = '700 42px Anton, Impact'; g.fillText('ITEM: QB, USED', W / 2, 230, W * 0.9); g.fillText('ORIGIN: LAS VEGAS', W / 2, 290, W * 0.9); g.fillStyle = '#2f6a3a'; g.font = '900 54px Anton, Impact'; g.fillText('1× 3RD ROUND PICK', W / 2, 400, W * 0.92); g.fillStyle = '#555'; g.font = '700 36px Anton'; g.fillText('RECEIPT ATTACHED', W / 2, 490, W * 0.9); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.31), std('#fff', { map: t, side: THREE.DoubleSide })); m.castShadow = true; return m;
}
export function badge(txt) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.05), std('#fff', { map: label(txt, { color: '#1a1a1a', bg: '#f4e6c8', w: 400, h: 180, font: '900 110px Anton, Impact' }) })); return m;
}
