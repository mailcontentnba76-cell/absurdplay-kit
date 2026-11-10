// Tập 14 (NFL, khuôn ĐỐI ĐẦU CÔNG SỞ) — "Could Kirk Cousins beat Fernando Mendoza for a valet job in Vegas?"
// Bối cảnh MỚI: khu đón khách (porte-cochère) của khách sạn HƯ CẤU "SILVER CACTUS" ở Las Vegas lúc hoàng hôn rực:
// mặt tiền tháp kính sáng đèn, mái che lối xe vào viền LED, biển neon xương rồng, cửa kính trượt sảnh (mở được), thảm đỏ,
// bục giữ xe + bảng treo chìa khoá (5 móc trống được), chòi giữ xe kính (Mendoza ngồi), cọ, phố Vegas instanced phía xa.
// Đạo cụ: xe hơi (makeCar) chạy được, chùm chìa khoá (makeKeys), vé giữ xe, séc khổng lồ.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
const glow = (map, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ map, toneMapped: false, transparent: true }, o));
export const LV = { black: '#2a2c33', silver: '#c9ced6' };
export const SF = { red: '#c8102e', gold: '#c9a24a' };
// Toạ độ: mặt tiền sảnh ở z = 0 (hướng +z ra đường); lối xe chạy dọc trục x ở z ≈ 6; bục giữ xe (0, 2.6); chòi (5, 2.2); cửa sảnh x = -3.
export const SPOT = { podium: [0, 2.4], booth: [5.2, 2.0], door: [-3.2, 0], lane: 6.2 };

function sky(G) {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#141c46'); gr.addColorStop(0.3, '#2c2f78'); gr.addColorStop(0.42, '#6a3c8c'); gr.addColorStop(0.49, '#c8507a'); gr.addColorStop(0.54, '#f0905a'); gr.addColorStop(1, '#3a2a3a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  G.add(new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })));
}
// phố Vegas phía xa: tháp sáng đèn + vài biển neon hư cấu
function strip(G) {
  const win = ctex(128, 256, (g) => { g.fillStyle = '#5a5c68'; g.fillRect(0, 0, 128, 256); const r = rnd(5);
    for (let y = 6; y < 256; y += 14) for (let x = 6; x < 128; x += 12) { const on = r() < 0.55; g.fillStyle = on ? ['#ffd88a', '#fff1c6', '#ffb0d8', '#a8e8ff'][Math.floor(r() * 4)] : '#33364a'; g.fillRect(x, y, 7, 9); } }, [2, 6]);
  const mats = ['#9a9cae', '#c0a890', '#7f86a6', '#d0b8c8', '#6e7490'].map((c) => new THREE.MeshStandardMaterial({ color: c, map: win, emissiveMap: win, emissive: '#ffd0a0', emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.2 }));
  const r = rnd(11); const L = [[], [], [], [], []];
  for (let i = 0; i < 90; i++) { const a = -Math.PI * 0.95 + r() * Math.PI * 0.9; const d = 120 + r() * 260; const x = Math.cos(a) * d, z = -Math.abs(Math.sin(a) * d) - 30;
    L[i % 5].push([x, z, 12 + r() * 22, 30 + r() * (d > 250 ? 160 : 110), 12 + r() * 20]); }
  L.forEach((list, k) => { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mats[k], list.length); const m = new THREE.Matrix4();
    list.forEach(([x, z, w, h, d], i) => { m.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion(), new THREE.Vector3(w, h, d)); im.setMatrixAt(i, m); }); G.add(im); });
  for (const [x, y, z, txt, c] of [[-90, 40, -140, 'LUCKY 7', '#ff4fd8'], [70, 55, -180, 'WEDDING CHAPEL', '#4fe8ff'], [150, 35, -120, 'BUFFET', '#ffd84a'], [-160, 60, -220, 'MOTEL', '#ff6a3a']]) {
    const t = ctex(1024, 200, (g, W, H) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); g.font = '900 150px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = c; g.shadowBlur = 30; g.fillStyle = c; g.fillText(txt, W / 2, H / 2); });
    const s = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), glow(t)); s.position.set(x, y, z); s.lookAt(0, y, 40); G.add(s); }
}
function palm(h = 7, seed = 1) {
  const G = new THREE.Group(); const r = rnd(seed);
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, h, 8), std('#8a6a4a', { roughness: 0.9 })); tr.position.y = h / 2; tr.rotation.z = (r() - 0.5) * 0.12; G.add(tr);
  const fm = std('#3f8a3a', { side: THREE.DoubleSide, roughness: 0.8 });
  for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 3.2, 1, 4), fm); const pos = f.geometry.attributes.position; for (let k = 0; k < pos.count; k++) { const y = pos.getY(k) + 1.6; pos.setZ(k, -0.12 * y * y); }
    f.geometry.translate(0, 1.6, 0); f.position.y = h; f.rotation.set(-1.1, i * 0.7, 0, 'YXZ'); G.add(f); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// cửa kính trượt 2 cánh; set(k) 0..1
function slidingDoor() {
  const G = new THREE.Group(); const gm = new THREE.MeshPhysicalMaterial({ color: '#cfe6f4', transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.1 }); const fr = std('#b9bec6', { metalness: 0.8, roughness: 0.3 });
  const panes = [-1, 1].map((s) => { const p = new THREE.Group(); const g = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, 0.05), gm); g.position.y = 1.3; p.add(g); const f = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.06, 0.07), fr); f.position.y = 2.6; p.add(f); p.position.x = s * 0.6; G.add(p); return { p, s }; });
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.7), new THREE.MeshBasicMaterial({ color: '#ffe0a8', toneMapped: false })); warm.position.set(0, 1.35, -0.4); G.add(warm);
  return { G, set: (k) => panes.forEach(({ p, s }) => { p.position.x = s * (0.6 + 1.15 * k); }) };
}
// bục giữ xe + bảng treo chìa khoá (hooks: 12 móc, emptyN móc đầu trống) + biển NOW HIRING
function podium() {
  const G = new THREE.Group();
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 0.6), std('#7a1e2a', { roughness: 0.5 })); desk.position.y = 0.55; G.add(desk);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.7), std('#d8c49a', { metalness: 0.6, roughness: 0.3 })); top.position.y = 1.12; G.add(top);
  const signT = ctex(512, 256, (g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8102e'; g.fillRect(0, 0, W, 70); g.fillStyle = '#fff'; g.font = '900 54px Anton, Impact'; g.textAlign = 'center'; g.fillText('NOW HIRING', W / 2, 54); g.fillStyle = '#1a1a1a'; g.font = '900 78px Anton, Impact'; g.fillText('VALET', W / 2, 150); g.font = '700 40px Anton, Impact'; g.fillText('1 OPENING', W / 2, 215); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), new THREE.MeshStandardMaterial({ map: signT, emissive: '#fff', emissiveMap: signT, emissiveIntensity: 0.25 })); sign.position.set(0, 0.7, 0.31); G.add(sign);
  // bảng chìa khoá đứng sau bục
  const board = new THREE.Group(); board.position.set(0, 0, -0.9); G.add(board);
  const bk = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 0.08), std('#3a2a22')); bk.position.y = 1.6; board.add(bk);
  for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.06), std('#2a2a2a')); leg.position.set(s * 0.6, 0.55, 0); board.add(leg); }
  const hooks = []; for (let i = 0; i < 12; i++) { const x = -0.48 + (i % 6) * 0.19, y = 1.85 - Math.floor(i / 6) * 0.42;
    const hk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), std('#d8c49a', { metalness: 0.8 })); hk.rotation.x = Math.PI / 2; hk.position.set(x, y, 0.08); board.add(hk);
    const tag = new THREE.Group(); const k = makeKeysMesh(0.7, i); k.position.y = -0.08; tag.add(k); tag.position.set(x, y, 0.1); board.add(tag); hooks.push(tag); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return { G, setEmpty: (n) => hooks.forEach((h, i) => { h.visible = i >= n; }) };
}
function makeKeysMesh(s = 1, seed = 0) {
  const G = new THREE.Group(); const gold = std('#e0c070', { metalness: 0.9, roughness: 0.25 }), sil = std('#d8dce2', { metalness: 0.9, roughness: 0.2 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 6, 16), sil); G.add(ring);
  for (let i = 0; i < 2; i++) { const k = new THREE.Group(); const head = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 12), i ? gold : std('#1a1a1a')); head.rotation.x = Math.PI / 2; k.add(head);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.004), i ? gold : sil); blade.position.y = -0.05; k.add(blade); k.position.set((i - 0.5) * 0.03, -0.04, 0); k.rotation.z = (i - 0.5) * 0.5; G.add(k); }
  const fob = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, 0.014), std(['#c8102e', '#1d4fa8', '#2a2c33'][seed % 3])); fob.position.set(0, -0.06, 0.01); G.add(fob);
  G.scale.setScalar(s * 1.6); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
export function makeKeys(s = 1) { return makeKeysMesh(s, 1); }
// chòi giữ xe: hộp kính có mái, ghế đẩu, lịch trên tường (tháng 9→11 bị gạch), bảng kẹp giấy
function booth() {
  const G = new THREE.Group(); const fr = std('#2a2c33', { metalness: 0.6, roughness: 0.4 });
  const gm = new THREE.MeshPhysicalMaterial({ color: '#d8ecf8', transparent: true, opacity: 0.22, roughness: 0.05 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.6), std('#7a1e2a', { roughness: 0.5 })); base.position.set(0, 0.45, -0.1); base.scale.z = 0.12; base.position.z = 0.7; G.add(base);
  for (const [x, z] of [[-0.9, -0.8], [0.9, -0.8], [-0.9, 0.8], [0.9, 0.8]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.5, 0.06), fr); p.position.set(x, 1.25, z); G.add(p); }
  for (const [w, x, z, ry] of [[1.8, 0, 0.8, 0], [1.6, -0.9, 0, Math.PI / 2], [1.6, 0.9, 0, Math.PI / 2]]) { const g = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.5), gm); g.position.set(x, 1.65, z); g.rotation.y = ry; G.add(g); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.5, 0.06), std('#4a3022')); back.position.set(0, 1.25, -0.8); G.add(back);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 1.9), std('#7a1e2a')); roof.position.y = 2.56; G.add(roof);
  const signT = ctex(512, 96, (g, W, H) => { g.fillStyle = '#7a1e2a'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffe6a8'; g.font = '900 70px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('VALET', W / 2, H / 2 + 4); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.34), glow(signT)); sign.position.set(0, 2.42, 0.96); G.add(sign);
  const calT = ctex(256, 300, (g, W, H) => { g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8102e'; g.fillRect(0, 0, W, 60); g.fillStyle = '#fff'; g.font = '900 44px Anton'; g.textAlign = 'center'; g.fillText('NOVEMBER', W / 2, 46);
    g.strokeStyle = '#999'; g.lineWidth = 2; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(10 + c * 34, 72 + r * 44, 34, 44);
    g.strokeStyle = '#c8102e'; g.lineWidth = 4; for (let d = 0; d < 9; d++) { const c = (d + 0) % 7, r = Math.floor(d / 7); g.beginPath(); g.moveTo(14 + c * 34, 76 + r * 44); g.lineTo(40 + c * 34, 112 + r * 44); g.stroke(); g.beginPath(); g.moveTo(40 + c * 34, 76 + r * 44); g.lineTo(14 + c * 34, 112 + r * 44); g.stroke(); } });
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.5), std('#fff', { map: calT })); cal.position.set(0.45, 1.75, -0.76); G.add(cal);
  const stool = new THREE.Group(); const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16), std('#2a2c33')); seat.position.y = 0.62; stool.add(seat); const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), std('#888', { metalness: 0.8 })); leg.position.y = 0.3; stool.add(leg); stool.position.set(0, 0, -0.1); G.add(stool);
  const lamp = new THREE.PointLight('#ffe0b0', 6, 5); lamp.position.set(0, 2.2, 0); G.add(lamp);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
export function buildHotel(scene) {
  scene.background = new THREE.Color('#3a2c5a'); scene.fog = new THREE.Fog('#4a3466', 90, 520);
  const G = new THREE.Group(); scene.add(G); sky(G); strip(G);
  // mặt đất: lối xe nhựa xám sáng, vỉa hè đá, thảm đỏ, vạch ô đỗ
  const asT = ctex(512, 512, (g) => { g.fillStyle = '#3c3e46'; g.fillRect(0, 0, 512, 512); const r = rnd(3); for (let i = 0; i < 9000; i++) { const v = 50 + r() * 40; g.fillStyle = `rgba(${v},${v},${v + 8},0.35)`; g.fillRect(r() * 512, r() * 512, 2, 2); } }, [60, 60]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), std('#ffffff', { map: asT, roughness: 0.6 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; G.add(ground);
  const walkT = ctex(256, 256, (g) => { g.fillStyle = '#7a7c82'; g.fillRect(0, 0, 256, 256); const r = rnd(8); for (let i = 0; i < 1600; i++) { g.fillStyle = ['rgba(220,220,225,0.5)', 'rgba(40,40,46,0.5)', 'rgba(180,150,90,0.5)'][i % 3]; g.fillRect(r() * 256, r() * 256, 2, 2); } g.strokeStyle = 'rgba(200,170,90,0.7)'; g.lineWidth = 3; for (let i = 0; i <= 256; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } }, [24, 2]);
  const walk = new THREE.Mesh(new THREE.BoxGeometry(60, 0.14, 4.2), std('#ffffff', { map: walkT, roughness: 0.8 })); walk.position.set(0, 0.07, 2.1); walk.receiveShadow = true; G.add(walk);
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 4.2), std('#b0182a', { roughness: 0.9 })); carpet.position.set(SPOT.door[0], 0.15, 2.1); carpet.receiveShadow = true; G.add(carpet);
  const lineM = new THREE.MeshBasicMaterial({ color: '#f2f2f2' }); for (let i = 0; i < 10; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 5), lineM); l.rotation.x = -Math.PI / 2; l.position.set(10 + i * 3, 0.01, 12); G.add(l); }
  // tháp khách sạn + mặt tiền kính
  const winT = ctex(256, 512, (g) => { g.fillStyle = '#1c2a36'; g.fillRect(0, 0, 256, 512); const r = rnd(7); for (let y = 8; y < 512; y += 22) for (let x = 6; x < 256; x += 20) { g.fillStyle = r() < 0.55 ? ['#ffc870', '#ffe2a8', '#ff9ac8'][Math.floor(r() * 3)] : '#22323e'; g.fillRect(x, y, 14, 14); } g.fillStyle = 'rgba(200,170,90,0.8)'; for (let y = 0; y < 512; y += 88) g.fillRect(0, y, 256, 3); }, [6, 8]);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(46, 70, 20), new THREE.MeshStandardMaterial({ color: '#ffffff', map: winT, emissive: '#ffffff', emissiveMap: winT, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.5 })); tower.position.set(4, 35, -11); G.add(tower);
  const lobbyT = ctex(1024, 160, (g, W2, H2) => { g.fillStyle = '#3a2418'; g.fillRect(0, 0, W2, H2); for (let x = 0; x < W2; x += 80) { g.fillStyle = '#5a3a26'; g.fillRect(x + 6, 10, 68, H2 - 20); } for (let i = 0; i < 13; i++) { const gr = g.createRadialGradient(40 + i * 80, 40, 0, 40 + i * 80, 40, 60); gr.addColorStop(0, 'rgba(255,214,140,0.7)'); gr.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr; g.fillRect(i * 80 - 30, 0, 140, H2); } g.fillStyle = '#c8a050'; g.fillRect(0, H2 - 8, W2, 8); });
  const lobby = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.2), new THREE.MeshStandardMaterial({ map: lobbyT, emissive: '#ffffff', emissiveMap: lobbyT, emissiveIntensity: 0.32, roughness: 0.3 })); lobby.position.set(4, 1.75, -0.02); G.add(lobby);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(46, 1.6, 0.4), std('#1e2228', { metalness: 0.4, roughness: 0.35 })); wall.position.set(4, 4.1, -0.2); G.add(wall); const trim = new THREE.Mesh(new THREE.BoxGeometry(46, 0.08, 0.45), std('#c8a050', { metalness: 0.9, roughness: 0.25 })); trim.position.set(4, 3.32, -0.18); G.add(trim);
  const D = slidingDoor(); D.G.position.set(SPOT.door[0], 0.14, 0.05); G.add(D.G);
  // mái che lối xe vào, viền LED
  const can = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 9), std('#26292f', { roughness: 0.35, metalness: 0.4 })); can.position.set(0, 5.2, 4.2); can.castShadow = true; G.add(can);
  const led = new THREE.Mesh(new THREE.BoxGeometry(22.2, 0.12, 9.2), new THREE.MeshBasicMaterial({ color: '#ffd27a', toneMapped: false })); led.position.set(0, 4.92, 4.2); G.add(led);
  for (const x of [-10, -3.5, 3.5, 10]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 5, 16), std('#15171b', { roughness: 0.2, metalness: 0.3 })); c.position.set(x, 2.5, 8.4); c.castShadow = true; G.add(c); for (const y of [0.6, 4.4]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.12, 16), std('#c8a050', { metalness: 0.9, roughness: 0.25 })); band.position.set(x, y, 8.4); G.add(band); } }
  for (const [x, c] of [[-9, '#ff3fb4'], [9, '#2fe8d8'], [2, '#4fff8a']]) { const N = new THREE.PointLight(c, 18, 14, 1.6); N.position.set(x, 6.5, 8.8); G.add(N); }
  for (let i = 0; i < 6; i++) { const L = new THREE.PointLight('#ffe0b0', 12, 12, 1.6); L.position.set(-8 + i * 3.2, 4.6, 4); G.add(L); }
  // biển neon SILVER CACTUS + hình xương rồng
  const signT = ctex(1024, 640, (g, W, H) => { g.clearRect(0, 0, W, H); g.textAlign = 'left'; g.textBaseline = 'middle'; g.shadowColor = '#7affc0'; g.shadowBlur = 36; g.fillStyle = '#e8fff4'; g.font = '900 200px Anton, Impact, sans-serif'; g.fillText('SILVER', 300, 170, 700); g.fillText('CACTUS', 300, 450, 700);
    g.shadowColor = '#4fff8a'; g.fillStyle = '#4fff8a'; const cx = 150; g.fillRect(cx - 34, 90, 68, 470); g.fillRect(cx - 130, 230, 46, 170); g.fillRect(cx - 130, 360, 130, 46); g.fillRect(cx + 84, 170, 46, 170); g.fillRect(cx, 300, 130, 46); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.9), glow(signT)); sign.position.set(2, 7.9, 8.5); G.add(sign);
  const hotT = ctex(512, 96, (g, W, H) => { g.clearRect(0, 0, W, H); g.fillStyle = '#ffd27a'; g.font = '900 72px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('HOTEL · LAS VEGAS', W / 2, H / 2, 480); });
  const hot = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.66), glow(hotT)); hot.position.set(2, 5.7, 8.72); G.add(hot);
  // cọ
  for (const [x, z, h, s] of [[-14, 3, 8, 1], [14, 3, 7.5, 2], [-20, 10, 9, 3], [22, 9, 8.5, 4], [-28, 4, 7, 5], [30, 4, 9, 6]]) { const p = palm(h, s); p.position.set(x, 0, z); G.add(p); }
  const P = podium(); P.G.position.set(SPOT.podium[0], 0.14, SPOT.podium[1]); G.add(P.G);
  const B = booth(); B.position.set(SPOT.booth[0], 0.14, SPOT.booth[1]); G.add(B);
  // camera an ninh trên cột mái che
  const sec = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.4), std('#e8e8e8')); sec.add(body); const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), std('#111')); lens.rotation.x = Math.PI / 2; lens.position.z = 0.22; sec.add(lens);
  const red = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: '#ff2020', toneMapped: false })); red.position.set(0.08, 0.06, 0.2); sec.add(red); sec.position.set(-10, 4.4, 8.0); sec.rotation.set(0.5, Math.PI - 0.6, 0); G.add(sec);
  return { G, door: D, podium: P };
}
export function hotelLights(scene) {
  const hemi = new THREE.HemisphereLight('#b8b0e8', '#4a3a40', 1.7); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffb878', 3.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 120 }); key.shadow.bias = -0.0004; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#7ae0ff', 1.4); fill.position.set(30, 20, 30); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 6, z = cam.position.z + d.z * 6; key.target.position.set(x, 0, z); key.position.set(x + 20, 22, z + 18); };
  return { follow };
}
// xe hơi đơn giản; mũi hướng +x. update(roll) xoay bánh; lights(on)
export function makeCar(o = {}) {
  const P = Object.assign({ color: '#c8c8cc', scale: 1 }, o); const G = new THREE.Group(); G.scale.setScalar(P.scale);
  const paint = std(P.color, { metalness: 0.6, roughness: 0.3 }); const glass = std('#20283a', { metalness: 0.3, roughness: 0.1 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.7, 1.9), paint); body.position.y = 0.65; G.add(body);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 1.86), paint); nose.position.set(1.9, 0.82, 0); nose.rotation.z = -0.12; G.add(nose);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.62, 1.7), glass); cab.position.set(-0.3, 1.3, 0); G.add(cab);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.66), paint); roof.position.set(-0.35, 1.64, 0); G.add(roof);
  const hl = new THREE.MeshBasicMaterial({ color: '#fff6d8', toneMapped: false }), tl = new THREE.MeshBasicMaterial({ color: '#ff2a2a', toneMapped: false });
  for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.4), hl); h.position.set(2.26, 0.78, s * 0.65); G.add(h); const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.45), tl); t.position.set(-2.26, 0.8, s * 0.62); G.add(t); }
  const wheels = []; const tire = std('#151515'), rim = std('#c8ccd2', { metalness: 0.9, roughness: 0.2 });
  for (const [x, z] of [[1.45, 0.92], [1.45, -0.92], [-1.45, 0.92], [-1.45, -0.92]]) { const w = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 18), tire); t.rotation.x = Math.PI / 2; w.add(t); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.27, 10), rim); r.rotation.x = Math.PI / 2; w.add(r); w.position.set(x, 0.36, z); G.add(w); wheels.push(w); }
  G.traverse((m) => { if (m.isMesh) { m.castShadow = true; } });
  return { root: G, update: (roll = 0) => wheels.forEach((w) => { w.rotation.z = -roll / 0.36; }) };
}
// séc khổng lồ
export function bigCheck() {
  const t = ctex(1024, 460, (g, W, H) => { g.fillStyle = '#f4f0e0'; g.fillRect(0, 0, W, H); g.strokeStyle = '#2a6a3a'; g.lineWidth = 14; g.strokeRect(10, 10, W - 20, H - 20); g.fillStyle = '#1a1a1a'; g.font = '700 46px Anton, Impact'; g.fillText('SILVER CACTUS HOTEL', 50, 80); g.fillText('PAY TO: KIRK (VALET)', 50, 170);
    g.fillStyle = '#2a6a3a'; g.font = '900 120px Anton, Impact'; g.fillText('$172,000,000', 50, 320); g.fillStyle = '#555'; g.font = '700 36px Anton'; g.fillText('MEMO: FIVE CARS MISSING', 50, 410); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.72), std('#fff', { map: t, side: THREE.DoubleSide })); m.castShadow = true; return m;
}
