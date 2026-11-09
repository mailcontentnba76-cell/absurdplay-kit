// Tập 12 (NFL) — "Could the Jets even beat eleven paper airplanes?"
// Bối cảnh MỚI: sân bóng trên SÂN THƯỢNG một toà nhà khổng lồ ở New York lúc hoàng hôn — sàn bê tông quanh sân,
// lan can mái, tháp nước gỗ trên chân thép (bảng điểm sơn trên tháp), cục điều hoà/ống thông gió, khán đài gấp kim loại,
// chòi bình luận (lán tôn) "ROOFTOP SPORTS RADIO", rừng nhà chọc trời quanh (cửa sổ sáng đèn), trời cam-hồng-tím.
// Nhân vật phụ: máy bay giấy khổng lồ có mắt (makePlane).
import * as THREE from 'three';
import { fieldTexture, goalPost, bleachers, FL, FW } from './ngoaitroi.js';
export { FL, FW };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const NYJ = { green: '#1f7a55', dark: '#125740' };
export const KC = { red: '#d9223a', gold: '#ffb81c' };
export const ROOF = { x: FL / 2 + 14, z: FW / 2 + 17 };

function sky(G) {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2c3a7a'); gr.addColorStop(0.28, '#6a5aa8'); gr.addColorStop(0.4, '#e27a8a'); gr.addColorStop(0.47, '#ffab5e'); gr.addColorStop(0.5, '#ffd690'); gr.addColorStop(1, '#5a4a52'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  G.add(new THREE.Mesh(new THREE.SphereGeometry(1400, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })));
  const st = ctex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(0.2, 'rgba(255,214,140,1)'); gr.addColorStop(0.4, 'rgba(255,160,90,0.5)'); gr.addColorStop(1, 'rgba(255,140,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: st, transparent: true, depthWrite: false, fog: false })); s.position.set(1100, 60, 300); s.scale.set(300, 300, 1); G.add(s);
}
// rừng nhà chọc trời (instanced) quanh mái — cửa sổ sáng đèn
function skyline(G, seed = 3) {
  const win = ctex(128, 256, (g) => { g.fillStyle = '#4a4c58'; g.fillRect(0, 0, 128, 256); const r = rnd(9);
    for (let y = 6; y < 256; y += 16) for (let x = 6; x < 128; x += 14) { const on = r() < 0.45; g.fillStyle = on ? (r() < 0.5 ? '#ffd88a' : '#fff1c6') : '#2b2e3a'; g.fillRect(x, y, 8, 10); } }, [2, 6]);
  const mats = ['#8a8c96', '#a59a8a', '#6f7686', '#b8b0a2', '#5e6472'].map((c) => new THREE.MeshStandardMaterial({ color: c, map: win, emissiveMap: win, emissive: '#ffcf80', emissiveIntensity: 0.35, roughness: 0.8 }));
  const r = rnd(seed); const spots = [];
  for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = 140 + r() * 600; const x = Math.cos(a) * d * 1.2, z = Math.sin(a) * d; if (Math.abs(x) < ROOF.x + 40 && Math.abs(z) < ROOF.z + 40) continue; spots.push([x, z, 14 + r() * 26, 14 + r() * 26, -40 + r() * (d < 300 ? 110 : 190)]); }
  const groups = mats.map(() => []); spots.forEach((s, i) => groups[i % mats.length].push(s));
  const m4 = new THREE.Matrix4();
  groups.forEach((list, k) => { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mats[k], list.length);
    list.forEach(([x, z, w, d, top], i) => { const h = top + 220; m4.compose(new THREE.Vector3(x, -220, z), new THREE.Quaternion(), new THREE.Vector3(w, h, d)); im.setMatrixAt(i, m4); }); G.add(im); });
  // một tháp nhọn hư cấu phía xa (không phải toà nhà có thật)
  const tw = new THREE.Group(); const b1 = new THREE.Mesh(new THREE.BoxGeometry(30, 230, 30), mats[3]); b1.position.y = 115 - 60; tw.add(b1);
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(18, 60, 18), mats[3]); b2.position.y = 230 - 60 + 30; tw.add(b2); const sp = new THREE.Mesh(new THREE.ConeGeometry(4, 50, 8), std('#c9ccd4', { metalness: 0.7, roughness: 0.3 })); sp.position.y = 290 - 60 + 25; tw.add(sp);
  tw.position.set(-520, 0, -380); G.add(tw);
}
function waterTower(seed = 1) {
  const G = new THREE.Group(); const wood = ctex(256, 128, (g) => { g.fillStyle = '#7a5434'; g.fillRect(0, 0, 256, 128); const r = rnd(seed); for (let x = 0; x < 256; x += 12) { g.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.1})`; g.fillRect(x, 0, 2, 128); } }, [3, 1]);
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 6, 24), std('#fff', { map: wood })); tank.position.y = 9; G.add(tank);
  for (const y of [6.8, 9, 11.2]) { const b = new THREE.Mesh(new THREE.TorusGeometry(3.32, 0.07, 6, 32), std('#2a2a2a', { metalness: 0.6 })); b.rotation.x = Math.PI / 2; b.position.y = y; G.add(b); }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.2, 24), std('#5a4232')); roof.position.y = 13.1; G.add(roof);
  for (const [x, z] of [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 6, 8), std('#3a3d44', { metalness: 0.6 })); l.position.set(x, 3, z); G.add(l); }
  const pl = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.15, 5.4), std('#3a3d44', { metalness: 0.5 })); pl.position.y = 5.9; G.add(pl);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// bảng điểm sơn tay gắn trên thân tháp nước: set({home,away,q,clock})
function towerBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.6), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.25 })); G.add(face);
  let last = ''; const set = (s) => { const k = JSON.stringify(s); if (k === last) return; last = k; const g = cv.getContext('2d');
    g.fillStyle = '#1d2026'; g.fillRect(0, 0, 1024, 512); g.strokeStyle = '#f4efe2'; g.lineWidth = 14; g.strokeRect(12, 12, 1000, 488); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 66px Anton, Impact, sans-serif'; g.fillStyle = '#7fe0ae'; g.fillText('JETS', 260, 92); g.fillStyle = '#cfe3f7'; g.fillText('PLANES', 764, 92);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = '#ffffff'; g.fillText(String(s.home), 260, 290); g.fillText(String(s.away), 764, 290);
    g.font = '900 54px Anton, Impact, sans-serif'; g.fillStyle = '#ffd27a'; g.fillText(`QTR ${s.q ?? 1}`, 260, 450); g.fillText(s.clock ?? '15:00', 764, 450); tex.needsUpdate = true; };
  set({ home: 0, away: 0 }); return { G, set };
}
// lán bình luận tôn trên mái: hướng +z
function booth() {
  const G = new THREE.Group(); const tin = ctex(128, 128, (g) => { g.fillStyle = '#9aa3ad'; g.fillRect(0, 0, 128, 128); for (let x = 0; x < 128; x += 10) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, 0, 3, 128); } }, [3, 1]);
  const back = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.15), std('#fff', { map: tin })); back.position.set(0, 1.5, -1.5); G.add(back);
  for (const x of [-2.5, 2.5]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 3), std('#fff', { map: tin })); s.position.set(x, 1.5, 0); G.add(s); }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.15, 3.6), std('#5f666f', { metalness: 0.4 })); roof.position.set(0, 3.05, 0.1); G.add(roof);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.8), new THREE.MeshStandardMaterial({ map: ctex(512, 96, (g) => { g.fillStyle = NYJ.dark; g.fillRect(0, 0, 512, 96); g.fillStyle = '#fff'; g.font = '900 40px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ROOFTOP SPORTS RADIO', 256, 50); }), emissive: '#ffffff', emissiveIntensity: 0.2 }));
  sign.position.set(0, 2.55, -1.42); G.add(sign);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.8), std('#d8d2c4')); desk.position.set(0, 0.78, 0.6); G.add(desk);
  const front = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.78, 0.06), std(NYJ.dark)); front.position.set(0, 0.39, 0.98); G.add(front);
  for (const x of [-0.8, 0.8]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), std('#222')); st.position.set(x, 0.96, 0.75); G.add(st); const mic = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#2b2b2b')); mic.position.set(x, 1.12, 0.75); G.add(mic); }
  const bulb = new THREE.PointLight('#ffd9a0', 6, 6); bulb.position.set(0, 2.6, 0.4); G.add(bulb);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
function hvac(w, h, d) { const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std('#b9bcc2', { metalness: 0.4, roughness: 0.5 })); b.position.y = h / 2; G.add(b);
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(w, d) * 0.3, Math.min(w, d) * 0.3, 0.1, 20), std('#3a3d44')); fan.position.y = h + 0.05; G.add(fan); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }

export function buildRooftop(scene) {
  scene.background = new THREE.Color('#e58a7a'); scene.fog = new THREE.Fog('#d98c84', 250, 1300);
  const G = new THREE.Group(); scene.add(G); sky(G); skyline(G);
  // sàn mái bê tông + lan can
  const conc = ctex(256, 256, (g) => { g.fillStyle = '#8f8d88'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'; g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); } g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 2; g.strokeRect(0, 0, 256, 256); }, [40, 24]);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(ROOF.x * 2, 4, ROOF.z * 2), std('#fff', { map: conc })); deck.position.y = -2.12; deck.receiveShadow = true; G.add(deck);
  const wallM = std('#7b6a5e', { map: ctex(128, 64, (g) => { g.fillStyle = '#8a5a46'; g.fillRect(0, 0, 128, 64); g.fillStyle = 'rgba(230,220,200,0.35)'; for (let y = 0; y < 64; y += 10) g.fillRect(0, y, 128, 2); for (let y = 0; y < 64; y += 10) for (let x = (y / 10) % 2 ? 0 : 12; x < 128; x += 24) g.fillRect(x, y, 2, 10); }, [30, 1]) });
  for (const [x, z, w, d] of [[0, -ROOF.z, ROOF.x * 2, 0.5], [0, ROOF.z, ROOF.x * 2, 0.5], [-ROOF.x, 0, 0.5, ROOF.z * 2], [ROOF.x, 0, 0.5, ROOF.z * 2]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.2, d), wallM); m.position.set(x, 0.6, z); m.castShadow = true; G.add(m);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.12, d + 0.2), std('#c9c3b6')); cap.position.set(x, 1.26, z); G.add(cap); }
  // mặt toà nhà phía dưới mái (để nhìn từ trên thấy độ cao)
  const facade = new THREE.Mesh(new THREE.BoxGeometry(ROOF.x * 2, 300, ROOF.z * 2), new THREE.MeshStandardMaterial({ color: '#7a7470', map: ctex(128, 256, (g) => { g.fillStyle = '#6a6460'; g.fillRect(0, 0, 128, 256); for (let y = 6; y < 256; y += 16) for (let x = 6; x < 128; x += 14) { g.fillStyle = Math.random() < 0.5 ? '#ffd88a' : '#2b2e3a'; g.fillRect(x, y, 8, 10); } }, [20, 30]), emissive: '#ffcf80', emissiveIntensity: 0.15 }));
  facade.position.y = -154.1; G.add(facade);
  // sân cỏ nhân tạo
  const ft = fieldTexture({ g1: '#3f8a3c', g2: '#47953f', endLeft: NYJ.dark, endLeftText: 'NEW YORK', endLeftStroke: '#ffffff', endRight: '#cfe3f7', endRightText: 'PLANES', endRightFg: '#2c4a7a' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9 })); field.rotation.x = -Math.PI / 2; field.position.y = 0.005; field.receiveShadow = true; G.add(field);
  // cột gôn 2 đầu
  for (const s of [-1, 1]) { const gp = goalPost(s); gp.position.set(s * (FL / 2), 0, 0); G.add(gp); }
  // khán đài gấp kim loại biên −z, fan Jets + vài fan Chiefs
  const U = { uT: { value: 0 }, uCheer: { value: 0.3 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  bleachers(G, -1, { U, fill: 0.85, seed: 71, rows: 8, len: 60, z0: -(FW / 2 + 4), seatColor: '#b8bec6', frameColor: '#5d636b', banner: 'NEW YORK', bannerBg: NYJ.dark, bannerFg: '#ffffff',
    shirts: [NYJ.green, '#ffffff', NYJ.dark, '#ffffff', KC.red, '#1f2a44', NYJ.green], skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'], pants: ['#2b3a55', '#3b3f46', '#56627a'], hats: [NYJ.green, '#ffffff', '#1d2026'] });
  // tháp nước (bảng điểm ở tháp sau end zone phải) + điều hoà + ống thông
  const towers = [[FL / 2 + 8, -12, 1], [-FL / 2 - 8, 16, 2], [-30, ROOF.z - 6, 3], [34, ROOF.z - 7, 4]];
  towers.forEach(([x, z, sd]) => { const t = waterTower(sd); t.position.set(x, 0, z); G.add(t); });
  const SB = towerBoard(); SB.G.position.set(FL / 2 + 8 - 3.45, 9, -12); SB.G.rotation.y = -Math.PI / 2; G.add(SB.G);
  const r = rnd(7); for (let i = 0; i < 12; i++) { const h = hvac(2 + r() * 2, 1.4 + r(), 1.6 + r() * 1.5); const side = i % 2 ? 1 : -1; h.position.set(-FL / 2 + 6 + i * 9 + r() * 3, 0, side > 0 ? ROOF.z - 3 - r() * 4 : -(ROOF.z - 3)); G.add(h); }
  for (let i = 0; i < 8; i++) { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 12), std('#9aa0a6', { metalness: 0.6 })); v.position.set(-ROOF.x + 4 + r() * 6, 0.8, -20 + i * 6); v.castShadow = true; G.add(v); }
  const BT = booth(); BT.position.set(-38, 0, -(FW / 2 + 3.2)); G.add(BT);
  // dây đèn trang trí dọc lan can phía +z
  const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe6a8' }), 120); const m4 = new THREE.Matrix4();
  for (let i = 0; i < 120; i++) { const x = -ROOF.x + i * (ROOF.x * 2 / 120); m4.makeTranslation(x, 2.3 - Math.abs(Math.sin(i * 0.52)) * 0.4, ROOF.z - 0.2); bulbs.setMatrixAt(i, m4); } G.add(bulbs);
  return { G, crowd: U, board: SB, booth: BT, update(t, o = {}) { U.uT.value = t; U.uCheer.value = o.cheer ?? 0.3; U.uBoo.value = o.boo ?? 0; } };
}
export function rooftopLights(scene) {
  const hemi = new THREE.HemisphereLight('#ffd6c8', '#4a4a5a', 1.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffbf80', 3.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#8fa6ff', 0.9); fill.position.set(-30, 20, -30); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 10, z = cam.position.z + d.z * 10; key.target.position.set(x, 0, z); key.position.set(x + 60, 22, z + 20); };
  return { hemi, key, fill, follow };
}

// ---------- máy bay giấy khổng lồ có mắt ----------
// Dài ~2,6 m (mũi +z), sải cánh ~2,3 m, đậu trên sống (keel) cao 0,5 m. update(t,{look,blink,squint,browUp,flap,bank,pitch}).
export function makePlane(o = {}) {
  const P = Object.assign({ seed: 1, paper: '#f7f5ee', line: '#9cc3e6', stripe: null, scale: 1 }, o); const r = rnd(P.seed * 13 + 1);
  const tex = ctex(256, 256, (g) => { g.fillStyle = P.paper; g.fillRect(0, 0, 256, 256); g.strokeStyle = P.line; g.lineWidth = 2; for (let y = 20; y < 256; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    g.strokeStyle = '#e88a8a'; g.beginPath(); g.moveTo(40, 0); g.lineTo(40, 256); g.stroke(); if (P.stripe) { g.fillStyle = P.stripe; g.fillRect(0, 100, 256, 40); }
    for (let i = 0; i < 8; i++) { g.strokeStyle = 'rgba(120,110,90,0.12)'; g.lineWidth = 1; g.beginPath(); const x = r() * 256; g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 60, 256); g.stroke(); } });
  const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.85 });
  const root = new THREE.Group(); root.scale.setScalar(P.scale); const body = new THREE.Group(); body.position.y = 0.5; root.add(body);
  const tri = (pts) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute([0.5, 1, 0, 0, 1, 0], 2)); g.computeVertexNormals(); return g; };
  const N = [0, 0.05, 1.6], C = [0, 0.02, -1.0], K = [0, -0.5, -1.0], K2 = [0, -0.2, 0.6];
  const wings = [-1, 1].map((s) => { const piv = new THREE.Group(); piv.position.set(0, 0.02, 0); body.add(piv); const L = [s * 1.15, 0.22, -1.05];
    const m = new THREE.Mesh(tri([N, s > 0 ? L : C, s > 0 ? C : L].map((p) => [p[0], p[1] - 0.02, p[2]])), mat); piv.add(m); return piv; });
  for (const s of [-1, 1]) { const m = new THREE.Mesh(tri([N, s > 0 ? K : C, s > 0 ? C : K]), mat); body.add(m); const m2 = new THREE.Mesh(tri([N, K2, K]), mat); body.add(m2); }
  // mắt: 2 nhãn cầu dẹt nằm trên mặt cánh gần mũi, hướng lên-trước
  const eyes = [-1, 1].map((s) => { const e = new THREE.Group(); e.position.set(s * 0.2, 0.11, 0.75); e.rotation.x = -1.0; body.add(e);
    const wh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), std('#ffffff', { roughness: 0.3 })); wh.scale.z = 0.55; e.add(wh);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#111')); pu.position.z = 0.07; e.add(pu);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(P.paper)); lid.scale.z = 0.6; e.add(lid);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.02), std('#2a2a2a')); brow.position.set(0, 0.17, 0.05); e.add(brow); return { pu, lid, brow }; });
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
  const update = (t, s = {}) => { const sd = P.seed; const fl = s.flap ?? 0.04;
    wings.forEach((w, i) => { w.rotation.z = (i ? -1 : 1) * (0.06 + fl * Math.sin(t * 7 + sd)); });
    body.rotation.z = (s.bank || 0) + 0.02 * Math.sin(t * 1.3 + sd); body.rotation.x = -(s.pitch || 0) + 0.02 * Math.sin(t * 1.1 + sd * 2);
    const lk = s.look || [Math.sin(t * 0.7 + sd) * 0.4, 0]; const bl = s.blink ?? ((t * 0.6 + sd * 0.37) % 3.1 < 0.12 ? 1 : 0);
    eyes.forEach(({ pu, lid, brow }, i) => { pu.position.x = lk[0] * 0.05; pu.position.y = lk[1] * 0.04; lid.rotation.x = -Math.PI * (0.05 + 0.45 * Math.max(bl, s.squint || 0)); brow.rotation.z = (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.17 + (s.browUp || 0) * 0.04; }); };
  update(0);
  return { root, body, update };
}
