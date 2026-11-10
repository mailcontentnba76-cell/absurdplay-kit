// Tập 13 (NFL) — "Could the Vikings even beat eleven shopping carts?"
// Bối cảnh MỚI: bãi đỗ xe siêu thị hư cấu "LOON LAKE GROCERY" ở Minnesota, BAN ĐÊM, tuyết rơi — mặt nhựa ướt có tuyết phủ lốm đốm,
// vạch sân sơn trắng như vạch ô đỗ, end zone trái tím "MINNESOTA", end zone phải là KHU TRẢ XE (corral có mái), gờ giảm tốc vàng-đen
// làm vạch first down, cột đèn natri cam, đống tuyết ủi viền bãi, siêu thị sáng đèn phía sau end zone phải, lán trả xe làm phòng bình luận,
// biển đèn bãi xe làm bảng điểm, khán đài nhôm fan áo tím. Nhân vật phụ: xe đẩy siêu thị có mắt (makeCart), một bánh lệch.
import * as THREE from 'three';
import { bleachers, FL, FW, YD } from './ngoaitroi.js';
export { FL, FW, YD };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const MIN = { purple: '#5b2b9a', gold: '#ffc62f', dark: '#3a1a66' };
export const BUF = { blue: '#1f4fb8', red: '#d01c3c' };
export const LOTX = { x: FL / 2 + 40, z: FW / 2 + 30 };
export const CORRAL = { x0: FL / 2 - 8.6, x1: FL / 2 - 0.6, z: 4.2 };

// mặt sân: nhựa đêm ướt, tuyết lốm đốm, vết bánh xe, vạch trắng 5 yard, số yard, end zone
function lotTexture() {
  return ctex(4096, 1820, (g, W, H) => {
    const px = W / 120; const r = rnd(5);
    g.fillStyle = '#545862'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 90000; i++) { const v = 70 + r() * 40; g.fillStyle = `rgba(${v},${v},${v + 6},0.4)`; g.fillRect(r() * W, r() * H, 2, 2); }
    // end zone
    g.fillStyle = MIN.purple; g.fillRect(0, 0, 10 * px, H);
    g.fillStyle = '#3b4a63'; g.fillRect(110 * px, 0, 10 * px, H);
    for (const [x, txt, fg, rot] of [[5, 'MINNESOTA', MIN.gold, -Math.PI / 2], [115, 'CART RETURN', '#f2f4f7', Math.PI / 2]]) {
      g.save(); g.translate(x * px, H / 2); g.rotate(rot); g.font = `900 ${px * 5}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fg; g.fillText(txt, 0, 0); g.restore(); }
    g.fillStyle = 'rgba(245,245,240,0.92)';
    g.fillRect(0, 0, W, px * 0.3); g.fillRect(0, H - px * 0.3, W, px * 0.3);
    for (let y = 10; y <= 110; y += 5) g.fillRect(y * px - px * 0.12, 0, px * 0.24, H);
    g.font = `700 ${px * 2.2}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let y = 20; y <= 100; y += 10) { const n = 50 - Math.abs(60 - y); for (const [yy, rr] of [[H * 0.1, Math.PI], [H * 0.9, 0]]) { g.save(); g.translate(y * px, yy); g.rotate(rr); g.fillText(String(n), 0, 0); g.restore(); } }
    // vạch ô đỗ vàng mờ cũ (chữ "bãi xe")
    g.strokeStyle = 'rgba(230,190,60,0.35)'; g.lineWidth = px * 0.12;
    for (let x = 12; x < 108; x += 3) for (const y0 of [H * 0.32, H * 0.62]) { g.beginPath(); g.moveTo(x * px, y0); g.lineTo(x * px, y0 + px * 5); g.stroke(); }
    // vết bánh xe ướt sẫm
    for (let i = 0; i < 26; i++) { g.strokeStyle = 'rgba(15,15,18,0.35)'; g.lineWidth = px * 0.25; const y = r() * H; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(W * 0.3, y + (r() - 0.5) * H * 0.4, W * 0.7, y + (r() - 0.5) * H * 0.4, W, y + (r() - 0.5) * H * 0.3); g.stroke(); }
    // tuyết lốm đốm (dày ở mép)
    for (let i = 0; i < 9000; i++) { const edge = r() < 0.5; const x = r() * W; const y = edge ? (r() < 0.5 ? r() * H * 0.08 : H - r() * H * 0.08) : r() * H; const rr = px * (0.05 + r() * (edge ? 0.32 : 0.12));
      const gr = g.createRadialGradient(x, y, 0, x, y, rr * 1.6); gr.addColorStop(0, `rgba(236,240,248,${0.35 + r() * 0.4})`); gr.addColorStop(1, 'rgba(236,240,248,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rr * 1.6, rr, r() * 3, 0, 7); g.fill(); }
  });
}
function snowBank(len, seed) {
  const G = new THREE.Group(); const r = rnd(seed); const m = std('#eef2f8', { roughness: 0.95 });
  for (let i = 0; i < len; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), m); s.scale.set(1.4 + r() * 1.2, 0.7 + r() * 0.9, 1.2 + r() * 0.8); s.position.set(i * 1.6 + r() * 0.6, 0, (r() - 0.5) * 1.2); s.rotation.y = r() * 3; s.receiveShadow = true; s.castShadow = true; G.add(s); }
  return G;
}
function lampPost(h = 11) {
  const G = new THREE.Group(); const pm = std('#4a4e56', { metalness: 0.6, roughness: 0.4 });
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, h, 10), pm); p.position.y = h / 2; G.add(p);
  for (const s of [-1, 1]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.1), pm); arm.position.set(s * 0.8, h - 0.2, 0); G.add(arm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.45), pm); head.position.set(s * 1.5, h - 0.3, 0); G.add(head);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.36), new THREE.MeshBasicMaterial({ color: '#ffb35a', toneMapped: false })); glow.rotation.x = Math.PI / 2; glow.position.set(s * 1.5, h - 0.42, 0); G.add(glow); }
  p.castShadow = true; return G;
}
// siêu thị hư cấu: tường gạch, cửa kính sáng, biển chữ đỏ phát sáng
function store() {
  const G = new THREE.Group();
  const brick = ctex(256, 128, (g) => { g.fillStyle = '#8a6b5a'; g.fillRect(0, 0, 256, 128); g.fillStyle = 'rgba(40,30,25,0.35)'; for (let y = 0; y < 128; y += 16) { g.fillRect(0, y, 256, 2); for (let x = (y / 16) % 2 ? 0 : 16; x < 256; x += 32) g.fillRect(x, y, 2, 16); } }, [24, 3]);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(14, 9, 90), std('#ffffff', { map: brick })); wall.position.set(7, 4.5, 0); G.add(wall);
  const glassT = ctex(512, 128, (g) => { g.fillStyle = '#ffe9b8'; g.fillRect(0, 0, 512, 128); g.fillStyle = 'rgba(120,90,60,0.35)'; for (let x = 0; x < 512; x += 64) g.fillRect(x, 0, 6, 128); for (let i = 0; i < 40; i++) { g.fillStyle = ['#d23a2a', '#2a8a4a', '#e8b030', '#3a6ad2'][i % 4]; g.fillRect(10 + i * 12.5, 70 + (i % 3) * 14, 8, 30); } });
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(40, 3.6), new THREE.MeshBasicMaterial({ map: glassT, toneMapped: false })); gl.rotation.y = -Math.PI / 2; gl.position.set(-0.02, 2.2, 0); G.add(gl);
  const signT = ctex(2048, 256, (g, W, H) => { g.fillStyle = '#1b1c22'; g.fillRect(0, 0, W, H); g.fillStyle = '#ff4a3a'; g.font = '900 180px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LOON LAKE GROCERY', W / 2, H / 2 + 8); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(34, 4.2), new THREE.MeshBasicMaterial({ map: signT, toneMapped: false })); sign.rotation.y = -Math.PI / 2; sign.position.set(-0.05, 6.6, 0); G.add(sign);
  const awning = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 44), std('#c8302a')); awning.position.set(-1.1, 4.1, 0); G.add(awning);
  const roofSnow = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.5, 90.4), std('#eef2f8')); roofSnow.position.set(7, 9.2, 0); G.add(roofSnow);
  const L = new THREE.PointLight('#ffd9a0', 40, 30, 1.6); L.position.set(-4, 3, 0); G.add(L);
  G.traverse((o) => { if (o.isMesh) o.receiveShadow = true; }); return G;
}
// khu trả xe (corral): khung ống thép 2 hàng rào song song, mái tôn, biển "CART RETURN"
function corral() {
  const G = new THREE.Group(); const pm = std('#b9bec6', { metalness: 0.8, roughness: 0.3 }); const L = CORRAL.x1 - CORRAL.x0;
  const tube = (a, b, r = 0.035) => { const d = b.clone().sub(a); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), pm); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.castShadow = true; G.add(m); };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  for (const z of [-CORRAL.z, CORRAL.z]) { for (const y of [0.45, 0.95]) tube(V(0, y, z), V(L, y, z)); for (let x = 0; x <= L + 0.01; x += L / 4) tube(V(x, 0, z), V(x, 2.6, z), 0.05); }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(L + 0.6, 0.08, CORRAL.z * 2 + 0.8), std('#6f7680', { metalness: 0.4 })); roof.position.set(L / 2, 2.65, 0); roof.castShadow = true; G.add(roof);
  const snowR = new THREE.Mesh(new THREE.BoxGeometry(L + 0.5, 0.18, CORRAL.z * 2 + 0.6), std('#eef2f8')); snowR.position.set(L / 2, 2.78, 0); G.add(snowR);
  const signT = ctex(512, 128, (g, W, H) => { g.fillStyle = '#1d4fa8'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 70px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CART RETURN', W / 2, H / 2 + 4); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshStandardMaterial({ map: signT, emissive: '#ffffff', emissiveMap: signT, emissiveIntensity: 0.35, side: THREE.DoubleSide })); sign.rotation.y = -Math.PI / 2; sign.position.set(-0.05, 2.15, 0); G.add(sign);
  // đèn trả xe: đỏ → xanh khi "hoàn thành"
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: '#ff3a2a', toneMapped: false })); lamp.position.set(-0.05, 2.75, 0); G.add(lamp);
  G.position.set(CORRAL.x0, 0, 0);
  return { G, setLamp: (on) => lamp.material.color.set(on ? '#3aff6a' : '#ff3a2a') };
}
// lán trả xe làm phòng bình luận (hướng +z), biển "PARKING LOT SPORTS"
function booth() {
  const G = new THREE.Group(); const pm = std('#9aa0a8', { metalness: 0.7, roughness: 0.35 });
  for (const [x, z] of [[-2.2, -1.2], [2.2, -1.2], [-2.2, 1.2], [2.2, 1.2]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), pm); p.position.set(x, 1.4, z); G.add(p); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.6, 0.06), new THREE.MeshPhysicalMaterial({ color: '#b8d0e0', transparent: true, opacity: 0.35, roughness: 0.1 })); back.position.set(0, 1.4, -1.2); G.add(back);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 3), std('#5c636c', { metalness: 0.4 })); roof.position.set(0, 2.85, 0); G.add(roof);
  const sn = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.16, 2.9), std('#eef2f8')); sn.position.set(0, 2.98, 0); G.add(sn);
  const signT = ctex(1024, 160, (g, W, H) => { g.fillStyle = MIN.dark; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 96px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PARKING LOT SPORTS', W / 2, H / 2 + 6); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.66), new THREE.MeshStandardMaterial({ map: signT, emissive: '#ffffff', emissiveMap: signT, emissiveIntensity: 0.35 })); sign.position.set(0, 2.35, -1.15); G.add(sign);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.7), std('#d8d2c4')); desk.position.set(0, 1.0, 0.95); G.add(desk);
  const front = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 0.06), std(MIN.purple)); front.position.set(0, 0.5, 1.3); G.add(front);
  for (const x of [-0.8, 0.8]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), std('#222')); st.position.set(x, 1.18, 0.95); G.add(st); const mic = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#2b2b2b')); mic.position.set(x, 1.34, 0.95); G.add(mic); }
  const bulb = new THREE.PointLight('#ffd9a0', 8, 7); bulb.position.set(0, 2.5, 0.6); G.add(bulb);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// biển đèn bãi xe làm bảng điểm: set({home,away,q,clock,note})
function lotBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 640; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.5), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); face.position.y = 7; G.add(face);
  const fr = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.9, 0.4), std('#2a2c33', { metalness: 0.5 })); fr.position.set(0, 7, -0.22); G.add(fr);
  const sn = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 0.6), std('#eef2f8')); sn.position.set(0, 9.55, -0.2); G.add(sn);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 4.8, 10), std('#4a4e56', { metalness: 0.6 })); p.position.set(s * 2.4, 2.4, -0.25); G.add(p); }
  let last = ''; const set = (s) => { const k = JSON.stringify(s); if (k === last) return; last = k; const g = cv.getContext('2d');
    g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 1024, 640); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 70px Anton, Impact, sans-serif'; g.fillStyle = '#c9a7ff'; g.fillText('VIKINGS', 260, 80); g.fillStyle = '#9fe0ff'; g.fillText('CARTS', 764, 80);
    g.font = '900 250px Anton, Impact, sans-serif'; g.fillStyle = '#ffb35a'; g.fillText(String(s.home), 260, 290); g.fillText(String(s.away), 764, 290);
    g.font = '900 60px Anton, Impact, sans-serif'; g.fillStyle = '#ffffff'; g.fillText(s.note ?? `QTR ${s.q ?? 1}   ${s.clock ?? '15:00'}`, 512, 520);
    g.strokeStyle = '#ffb35a'; g.lineWidth = 10; g.strokeRect(10, 10, 1004, 620); tex.needsUpdate = true; };
  set({ home: 0, away: 0 }); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return { G, set };
}
// gờ giảm tốc cao su vàng-đen chạy ngang sân (trục z) — vạch first down
function speedBump() {
  const t = ctex(256, 32, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#141414' : '#ffcc1a'; g.fillRect(i * 32, 0, 32, 32); } }, [FW / 2.4, 1]);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, FW, 16, 1, false, 0, Math.PI), std('#ffffff', { map: t, roughness: 0.6 }));
  m.rotation.set(Math.PI / 2, 0, Math.PI / 2); m.rotation.order = 'YXZ'; m.rotation.set(0, 0, 0);
  const G = new THREE.Group(); const geo = new THREE.CylinderGeometry(0.22, 0.22, FW, 16, 1, false, -Math.PI / 2, Math.PI); geo.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(geo, std('#ffffff', { map: t, roughness: 0.6 })); mesh.scale.y = 0.55; mesh.castShadow = true; mesh.receiveShadow = true; G.add(mesh); return G;
}
export function buildSnowLot(scene) {
  scene.background = new THREE.Color('#6f86bd'); scene.fog = new THREE.Fog('#8a98c4', 80, 320);
  const G = new THREE.Group(); scene.add(G);
  const skyT = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2c4a8c'); gr.addColorStop(0.36, '#5f7fc4'); gr.addColorStop(0.46, '#c7a6c8'); gr.addColorStop(0.5, '#f2c6a8'); gr.addColorStop(1, '#6a6a7a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  G.add(new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false })));
  const asph = ctex(256, 256, (g) => { g.fillStyle = '#5a5d66'; g.fillRect(0, 0, 256, 256); const r = rnd(2); for (let i = 0; i < 3000; i++) { g.fillStyle = r() < 0.1 ? 'rgba(240,244,250,0.35)' : 'rgba(0,0,0,0.12)'; g.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2); } }, [40, 20]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(LOTX.x * 2 + 200, LOTX.z * 2 + 200), std('#ffffff', { map: asph, roughness: 0.55, metalness: 0.1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; G.add(ground);
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: lotTexture(), roughness: 0.5, metalness: 0.12 })); field.rotation.x = -Math.PI / 2; field.position.y = 0.004; field.receiveShadow = true; G.add(field);
  // đống tuyết ủi viền
  for (const [x, z, n, ry, sd] of [[-FL / 2 - 4, -FW / 2 - 14, 20, Math.PI / 2, 3], [FL / 2 + 6, FW / 2 + 4, 10, 0, 5], [-FL / 2 + 10, FW / 2 + 9, 50, 0, 7], [-FL / 2 - 6, -12, 16, Math.PI / 2, 9]]) { const b = snowBank(n, sd); b.position.set(x, 0, z); b.rotation.y = ry; G.add(b); }
  // khán đài nhôm biên −z, fan áo tím
  const U = { uT: { value: 0 }, uCheer: { value: 0.3 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  bleachers(G, -1, { U, fill: 0.85, seed: 33, rows: 8, len: 60, z0: -(FW / 2 + 4), seatColor: '#b8bec6', frameColor: '#5d636b', banner: 'MINNESOTA', bannerBg: MIN.purple, bannerFg: MIN.gold,
    shirts: [MIN.purple, MIN.purple, MIN.gold, '#ffffff', MIN.dark, '#2a2c33', MIN.purple], skins: ['#f1c9a5', '#e8b98f', '#c68c5f', '#8d5a3b', '#5a3a28'], pants: ['#2b3a55', '#3b3f46', '#56627a'], hats: [MIN.purple, MIN.gold, '#ffffff', '#1d2026'] });
  // cột đèn
  for (const [x, z] of [[-40, FW / 2 + 5], [0, FW / 2 + 5], [40, FW / 2 + 5], [-56, 0], [-20, -(FW / 2 + 12)], [20, -(FW / 2 + 12)], [FL / 2 + 12, 18]]) { const l = lampPost(); l.position.set(x, 0, z); G.add(l); }
  const ST = store(); ST.position.set(FL / 2 + 22, 0, 0); G.add(ST);
  const CR = corral(); G.add(CR.G);
  const BT = booth(); BT.position.set(-34, 0, -(FW / 2 + 2.6)); G.add(BT);
  const SB = lotBoard(); SB.G.position.set(FL / 2 + 6, 0, -14); SB.G.rotation.y = -Math.PI / 2; G.add(SB.G);
  const bump = speedBump(); G.add(bump);
  // xe hơi phủ tuyết đỗ xa (khối đơn giản)
  const r = rnd(4); const carM = ['#7a1f2a', '#2a3a5a', '#d8d8d8', '#1a1a1a', '#5a6a5a'].map((c) => std(c, { metalness: 0.5, roughness: 0.4 })); const snowM = std('#eef2f8');
  for (let i = 0; i < 26; i++) { const c = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 1.8), carM[i % 5]); b.position.y = 0.65; c.add(b); const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 1.6), carM[i % 5]); cab.position.set(-0.2, 1.4, 0); c.add(cab);
    const s = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 1.7), snowM); s.position.set(-0.2, 1.82, 0); c.add(s); const z = i % 2 ? FW / 2 + 9 + r() * 3 : -(FW / 2 + 16 + r() * 3); c.position.set(-50 + i * 4.2, 0, z); c.rotation.y = Math.PI / 2 + (r() - 0.5) * 0.1; c.traverse((o) => { if (o.isMesh) o.castShadow = true; }); G.add(c); }
  return { G, crowd: U, board: SB, booth: BT, corral: CR, bump, update(t, o = {}) { U.uT.value = t; U.uCheer.value = o.cheer ?? 0.3; U.uBoo.value = o.boo ?? 0; if (o.bumpX != null) bump.position.x = o.bumpX; } };
}
export function lotLights(scene) {
  const hemi = new THREE.HemisphereLight('#c4d2ff', '#6a5e66', 2.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffc890', 4.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#b4c8ff', 1.8); fill.position.set(-30, 20, 30); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 10, z = cam.position.z + d.z * 10; key.target.position.set(x, 0, z); key.position.set(x - 18, 26, z + 22); };
  return { hemi, key, fill, follow };
}

// ---------- xe đẩy siêu thị có mắt ----------
// Mũi (giỏ trước) hướng +z, tay đẩy ở −z. Cao giỏ ~1,0 m × scale. update(t,{look,blink,squint,brow,browUp,roll,wobble,bounce,tilt,lean}).
export function makeCart(o = {}) {
  const P = Object.assign({ seed: 1, wire: '#c9ced6', handle: '#d23a2a', scale: 1 }, o); const sd = P.seed;
  const root = new THREE.Group(); root.scale.setScalar(P.scale); const body = new THREE.Group(); root.add(body);
  const chrome = std(P.wire, { metalness: 0.85, roughness: 0.28 });
  const grid = ctex(128, 128, (g) => { g.clearRect(0, 0, 128, 128); g.strokeStyle = '#ffffff'; g.lineWidth = 5; for (let i = 0; i <= 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); } }, [3, 2]);
  const gridM = new THREE.MeshStandardMaterial({ color: P.wire, map: grid, alphaMap: grid, alphaTest: 0.5, transparent: false, side: THREE.DoubleSide, metalness: 0.8, roughness: 0.3 });
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const tube = (a, b, r = 0.016, m = chrome) => { const d = b.clone().sub(a); const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 6), m); t.position.copy(a).add(b).multiplyScalar(0.5); t.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); body.add(t); return t; };
  // giỏ: đáy hẹp phía trước, miệng rộng (hình thang)
  const yb = 0.5, yt = 0.98, zf = 0.5, zb = -0.42, wb = 0.24, wt = 0.29, zft = 0.56;
  const quad = (a, b, c, d) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2)); g.computeVertexNormals(); const m = new THREE.Mesh(g, gridM); body.add(m); return m; };
  const A = [[-wb, yb, zb], [wb, yb, zb], [wb, yb, zf - 0.08], [-wb, yb, zf - 0.08]], T = [[-wt, yt, zb - 0.06], [wt, yt, zb - 0.06], [wt, yt, zft], [-wt, yt, zft]];
  quad(A[0], A[1], A[2], A[3]); quad(A[1], A[2], T[2], T[1]); quad(A[0], A[3], T[3], T[0]); quad(A[3], A[2], T[2], T[3]); const backFlap = quad(A[0], A[1], T[1], T[0]);
  for (let i = 0; i < 4; i++) { tube(V(...T[i]), V(...T[(i + 1) % 4]), 0.02); tube(V(...A[i]), V(...T[i]), 0.014); }
  // khung gầm + khay dưới
  const fz = 0.5, bz = -0.38; for (const s of [-1, 1]) { tube(V(s * 0.22, 0.14, bz), V(s * 0.17, 0.14, fz)); tube(V(s * 0.24, 0.14, bz), V(s * 0.28, yt + 0.06, zb - 0.16)); }
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.01, 0.7), gridM); tray.position.set(0, 0.2, 0.05); body.add(tray);
  // tay đẩy nhựa
  const hdl = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.66, 10), std(P.handle, { roughness: 0.5 })); hdl.rotation.z = Math.PI / 2; hdl.position.set(0, yt + 0.08, zb - 0.2); body.add(hdl);
  // bánh xe xoay (caster) — bánh trước trái là "bánh lệch"
  const wheels = []; const wheelM = std('#1b1b1e', { roughness: 0.7 });
  for (const [x, z] of [[-0.18, fz - 0.02], [0.18, fz - 0.02], [-0.23, bz], [0.23, bz]]) { const piv = new THREE.Group(); piv.position.set(x, 0.14, z); body.add(piv);
    const fork = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.03), chrome); fork.position.y = -0.03; piv.add(fork);
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.035, 14), wheelM); w.rotation.z = Math.PI / 2; w.position.set(0, -0.075, -0.03); piv.add(w); wheels.push({ piv, w }); }
  // mắt to dán trên mép giỏ trước (nhìn được từ trước và hơi chéo)
  const eyes = [-1, 1].map((s) => { const e = new THREE.Group(); e.position.set(s * 0.13, yt - 0.06, zft + 0.03); body.add(e);
    const wh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), std('#ffffff', { roughness: 0.3 })); wh.scale.z = 0.6; e.add(wh);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), std('#111')); pu.position.z = 0.05; e.add(pu);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.106, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(P.wire, { metalness: 0.6, roughness: 0.35 })); lid.scale.z = 0.62; e.add(lid);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.02), std('#222')); brow.position.set(0, 0.13, 0.04); e.add(brow); return { pu, lid, brow }; });
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
  const update = (t, s = {}) => { const roll = s.roll ?? 0; const wob = s.wobble ?? 0.15;
    wheels.forEach(({ piv, w }, i) => { w.rotation.x = roll / 0.065; piv.rotation.y = i === 0 ? wob * Math.sin(t * 23 + sd) + 0.3 * wob : (s.steer || 0) * (i < 2 ? 1 : 0); });
    body.position.y = (s.bounce || 0) + (wob > 0.3 ? 0.006 * Math.sin(t * 46 + sd) : 0);
    body.rotation.x = -(s.tilt || 0); body.rotation.z = (s.lean || 0) + (wob > 0.3 ? 0.012 * Math.sin(t * 23 + sd) : 0);
    const lk = s.look || [Math.sin(t * 0.7 + sd) * 0.4, 0]; const bl = s.blink ?? ((t * 0.6 + sd * 0.37) % 3.1 < 0.12 ? 1 : 0);
    eyes.forEach(({ pu, lid, brow }, i) => { pu.position.x = lk[0] * 0.04; pu.position.y = lk[1] * 0.035; lid.rotation.x = -Math.PI * (0.05 + 0.45 * Math.max(bl, s.squint || 0)); brow.rotation.z = (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.13 + (s.browUp || 0) * 0.035; }); };
  update(0);
  // điểm trong giỏ (toạ độ local body) để đặt đồ
  const basket = (u = 0, v = 0) => body.localToWorld(V(u * 0.18, yb + 0.12, 0.05 + v * 0.3));
  return { root, body, update, basket, handleY: yt + 0.08, handleZ: zb - 0.2 };
}
