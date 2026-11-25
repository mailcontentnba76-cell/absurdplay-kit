// E29 — phố miền Tây Texas giữa trưa + 2 linh vật tự thiết kế (Coyote của Spurs, gấu Clutch của Rockets) + bộ phận "loài nguy cấp".
// Phố chạy dọc trục z (đầu Coyote z<0, đầu Clutch z>0), nhà hai bên x = ±9. Kho thóc + rổ gỗ ở x=+16, z=0 (sân đất trước kho, hướng rổ về -x).
import * as THREE from 'three';
const PI = Math.PI;
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); return b; };
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
let rs = 2929; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
export function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { c, g }; return t; }
export const redraw = (t, draw) => { const { c, g } = t.userData; g.clearRect(0, 0, c.width, c.height); draw(g, c.width, c.height); t.needsUpdate = true; };
const WEST = '"Rye", "Playfair Display", Georgia, serif';
const signM = (text, w, h, bg = '#5a3a1e', fg = '#f2e2b8', fs = 0.62) => { const t = ctex(1024, Math.max(64, Math.round(1024 * h / w)), (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = '#2a1a0c'; g.lineWidth = 10; g.strokeRect(5, 5, W - 10, H - 10); g.fillStyle = fg; g.font = '900 ' + Math.round(H * fs) + 'px ' + WEST; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 4); });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), std('#fff', { map: t, side: THREE.DoubleSide })); };
const plank = (w, h, base) => ctex(256, 256, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 21) { g.fillStyle = 'rgba(0,0,0,' + (0.08 + R() * 0.12) + ')'; g.fillRect(0, y, W, 3); for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(R() * W, y + 5, 40 + R() * 80, 2); } } });
// ---------- nhà gỗ mặt tiền giả (false front) ----------
function storefront(name, w, h, col, sign2) { const G = new THREE.Group(); const tx = plank(w, h, col); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(w / 3, h / 3);
  const m = std('#fff', { map: tx }); G.add(box(w, h, 6, m, 0, h / 2, -3)); G.add(box(w + 0.3, 1.2, 0.3, m, 0, h + 0.6, 0.05));
  const s = signM(name, w * 0.8, 1.0); s.position.set(0, h - 0.6, 0.06); G.add(s);
  // hiên + mái hiên + cột
  G.add(box(w, 0.25, 2.4, std('#7a5232'), 0, 0.12, 1.2)); G.add(box(w, 0.12, 2.6, std('#6a4428'), 0, 3.1, 1.3));
  for (let i = 0; i < 4; i++) G.add(box(0.2, 3.0, 0.2, std('#5a3a20'), -w / 2 + 0.3 + i * (w - 0.6) / 3, 1.6, 2.35));
  // cửa sổ + cửa
  const win = std('#2a3a44', { roughness: 0.2, metalness: 0.3, emissive: '#3a4a52', emissiveIntensity: 0.2 });
  for (const x of [-w * 0.3, w * 0.3]) { G.add(box(1.4, 1.6, 0.08, win, x, 1.6, 0.03)); G.add(box(1.6, 0.15, 0.2, std('#e8dcc0'), x, 0.75, 0.1)); }
  G.add(box(1.3, 2.3, 0.08, std('#3a2412'), 0, 1.4, 0.03));
  if (sign2) { const s2 = signM(sign2, 1.8, 0.45, '#e8dcc0', '#3a2412', 0.55); s2.position.set(w * 0.3, 2.55, 0.08); G.add(s2); }
  return G; }
function saloonDoors() { const G = new THREE.Group(); const m = std('#7a4a22'); const L = box(0.62, 1.1, 0.05, m, -0.32, 1.3, 0.1); const Rr = box(0.62, 1.1, 0.05, m, 0.32, 1.3, 0.1); G.add(L, Rr); G.userData = { L, R: Rr }; return G; }
export function cactus(h = 2.6) { const G = new THREE.Group(); const m = std('#4a7a3a', { roughness: 0.9 }); const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, h, 6, 10), m); t.position.y = h / 2 + 0.28; G.add(t);
  for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.9, 5, 8), m); a.position.set(s * 0.55, h * 0.55 + 0.35, 0); G.add(a); const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.5, 5, 8), m); c.rotation.z = PI / 2; c.position.set(s * 0.36, h * 0.5, 0); G.add(c); } return G; }
export function tumbleweed() { const G = new THREE.Group(); const m = std('#a8865a', { roughness: 1 });
  for (let i = 0; i < 26; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.32 + R() * 0.12, 0.012, 3, 10), m); t.rotation.set(R() * PI, R() * PI, R() * PI); G.add(t); } return shad(G); }
export function basketball() { const t = ctex(256, 128, (g, W, H) => { g.fillStyle = '#c8541f'; g.fillRect(0, 0, W, H); g.strokeStyle = '#1a0c06'; g.lineWidth = 4; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(i * W / 4, 0); g.lineTo(i * W / 4, H); g.stroke(); } g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke(); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), std('#fff', { map: t, roughness: 0.7 })); m.castShadow = true; return m; }
function clockTower() { const G = new THREE.Group(); const tx = plank(4, 10, '#e8dcc0'); G.add(box(4, 10, 4, std('#fff', { map: tx }), 0, 5, 0)); const roof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 3, 4), std('#6a2a1a')); roof.rotation.y = PI / 4; roof.position.y = 11.5; G.add(roof);
  const face = ctex(256, 256, (g, W) => { g.fillStyle = '#f6eed8'; g.beginPath(); g.arc(W / 2, W / 2, W / 2 - 6, 0, 7); g.fill(); g.strokeStyle = '#2a1a0c'; g.lineWidth = 10; g.stroke(); g.fillStyle = '#2a1a0c'; g.font = '700 30px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle';
    ['XII', 'III', 'VI', 'IX'].forEach((s, i) => { const a = i * PI / 2 - PI / 2; g.fillText(s, W / 2 + Math.cos(a) * 92, W / 2 + Math.sin(a) * 92); }); g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(W / 2, W / 2); g.lineTo(W / 2, 40); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(W / 2, W / 2); g.lineTo(W / 2, 62); g.stroke(); });
  const f = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), std('#fff', { map: face, emissive: '#fff', emissiveMap: face, emissiveIntensity: 0.15 })); f.position.set(0, 8.2, 2.02); G.add(f); return G; }
function waterTower() { const G = new THREE.Group(); const m = std('#6a4428'); for (const x of [-1.4, 1.4]) for (const z of [-1.4, 1.4]) G.add(box(0.25, 7, 0.25, m, x, 3.5, z)); const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3.2, 20), std('#8a5a32')); tank.position.y = 8.6; G.add(tank); const top = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.4, 20), std('#5a3a20')); top.position.y = 10.9; G.add(top); return G; }
function barn() { const G = new THREE.Group(); const tx = plank(12, 7, '#9a2e22'); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(3, 2); const m = std('#fff', { map: tx });
  G.add(box(10, 6, 9, m, 0, 3, 0)); const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 6.6, 3.2, 4, 1), std('#4a3a2e')); roof.rotation.set(0, PI / 4, 0); roof.scale.set(1.08, 1, 0.98); roof.position.y = 7.6; G.add(roof);
  for (const s of [-1, 1]) G.add(box(0.2, 5, 0.3, std('#f2efe6'), s * 2.2, 2.5, 4.55)); G.add(box(4.6, 0.2, 0.3, std('#f2efe6'), 0, 5, 4.55)); G.add(box(4.2, 4.8, 0.1, std('#7a2418'), 0, 2.4, 4.52));
  // bảng rổ gỗ đóng lên vách (mặt hướng +z)
  const bb = box(1.8, 1.1, 0.08, std('#e8dcc0'), 0, 3.6, 4.65); G.add(bb); G.add(box(0.6, 0.45, 0.09, std('#9a2e22'), 0, 3.45, 4.66));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 24), std('#d8541f', { metalness: 0.4 })); rim.rotation.x = PI / 2; rim.position.set(0, 3.05, 5.0); G.add(rim);
  const net = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.14, 0.4, 12, 1, true), std('#f4f4f4', { wireframe: true })); net.position.set(0, 2.84, 5.0); G.add(net);
  G.userData.rimLocal = new THREE.Vector3(0, 3.05, 5.0); return G; }
function mesa(w, h, d, c) { const g = new THREE.CylinderGeometry(w * 0.42, w * 0.55, h, 7, 1); const m = new THREE.Mesh(g, std(c, { flatShading: true, roughness: 1 })); m.scale.z = d / w; m.position.y = h / 2; return m; }
export function wantedPoster(team, rec, sub, col) { const t = ctex(512, 720, (g, W, H) => { g.fillStyle = '#ecdcb0'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(120,80,30,.18)'; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(R() * W, R() * H, 10 + R() * 40, 0, 7); g.fill(); }
  g.fillStyle = '#3a2412'; g.textAlign = 'center'; g.font = '900 110px ' + WEST; g.fillText('WANTED', W / 2, 120); g.fillStyle = col; g.fillRect(70, 160, W - 140, 300); g.fillStyle = '#ecdcb0'; g.font = '900 96px ' + WEST; g.fillText(team, W / 2, 340);
  g.fillStyle = '#3a2412'; g.font = '900 120px ' + WEST; g.fillText(rec, W / 2, 590); g.font = '700 40px ' + WEST; g.fillText(sub, W / 2, 660); });
  return new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.97), std('#fff', { map: t, side: THREE.DoubleSide })); }
export function buildTown(scene) { const G = new THREE.Group(); scene.add(G);
  const dirt = ctex(512, 512, (g, W, H) => { g.fillStyle = '#c8945a'; g.fillRect(0, 0, W, H); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${90 + R() * 80},${50 + R() * 40},${20 + R() * 20},${0.1 + R() * 0.2})`; g.fillRect(R() * W, R() * H, 2 + R() * 4, 2 + R() * 4); } }); dirt.wrapS = dirt.wrapT = THREE.RepeatWrapping; dirt.repeat.set(30, 30);
  G.add(box(400, 0.1, 400, std('#fff', { map: dirt, roughness: 1 }), 0, -0.05, 0));
  for (let z = -40; z < 40; z += 0.6) if (R() < 0.6) G.add(box(0.05, 0.01, 0.4 + R(), std('#9a6a3a'), (R() - 0.5) * 2, 0.006, z));
  // hai dãy nhà
  const names = [['SALOON', 'COLD SARSAPARILLA'], ['GENERAL STORE', 'BOOTS · HATS'], ['SHERIFF', 'NO MASCOTS'], ['BANK', 'EST. 1883'], ['HOTEL', 'ROOMS $1'], ['BARBER', 'SHAVE 10¢'], ['POST OFFICE', ''], ['BLACKSMITH', 'HORSESHOES'], ['SAN ANTONIO SUPPLY', 'SILVER & BLACK'], ['HOUSTON TRADING', 'ALL THINGS RED']];
  const cols = ['#a87a4a', '#8a5a32', '#b8925a', '#7a5a3a', '#c8a26a', '#9a6a42'];
  const doors = {}; let k = 0; const posters = {};
  for (const s of [-1, 1]) for (let z = -30; z <= 30; z += 12) { if (s > 0 && Math.abs(z) < 10) continue; const [n, n2] = names[k % names.length]; const w = 9 + R() * 2, h = 6.5 + R() * 2.5; const f = storefront(n, w, h, cols[k % cols.length], n2);
    f.position.set(s * 9, 0, z); f.rotation.y = -s * PI / 2; G.add(f); if (n === 'SALOON') { const d = saloonDoors(); f.add(d); doors.saloon = d; } k++; }
  // bảng truy nã dán vách saloon (x = -9 + bề mặt, z = -30)
  const pS = wantedPoster('SPURS', '15–3', '1ST IN THE WEST', '#1a1a1a'); pS.position.set(-8.9, 1.9, -27.2); pS.rotation.y = PI / 2; G.add(pS);
  const pR = wantedPoster('ROCKETS', '13–5', 'RIGHT BEHIND', '#c8102e'); pR.position.set(-8.9, 1.9, -25.4); pR.rotation.y = PI / 2; G.add(pR); posters.S = pS; posters.R = pR;
  // tháp đồng hồ cuối phố (z = -46), tháp nước, kho thóc, xương rồng, núi
  const ct = clockTower(); ct.position.set(0, 0, -48); G.add(ct);
  const wt = waterTower(); wt.position.set(14, 0, -22); G.add(wt);
  const bn = barn(); bn.position.set(18, 0, 0); bn.rotation.y = -PI / 2; G.add(bn);
  for (let i = 0; i < 40; i++) { const a = R() * PI * 2, r = 26 + R() * 50; const c = cactus(1.6 + R() * 2.2); c.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); c.rotation.y = R() * 6; G.add(c); }
  for (const [x, z, w, h, c] of [[-120, -150, 90, 42, '#b8582e'], [60, -170, 120, 56, '#a84a28'], [180, -60, 70, 34, '#c8683a'], [-180, 40, 100, 40, '#b05a32'], [40, 190, 110, 50, '#a8502a'], [-60, 170, 70, 30, '#c06a3a']]) { const m = mesa(w, h, w * 0.6, c); m.position.set(x, 0, z); G.add(m); }
  // hàng rào + xe chở hàng + thùng gỗ + cột buộc ngựa
  for (let i = 0; i < 6; i++) { const b = box(0.7, 0.8, 0.7, std('#8a5a32'), -7.2 + (i % 2) * 0.2, 0.4 + Math.floor(i / 4) * 0.8, -23 + (i % 4) * 0.8); G.add(b); }
  for (const s of [-1, 1]) for (let z = -34; z < 34; z += 17) { G.add(box(3.2, 0.12, 0.12, std('#5a3a20'), s * 6.6, 1.0, z)); G.add(box(0.15, 1.1, 0.15, std('#5a3a20'), s * 6.6 - 1.5, 0.55, z)); G.add(box(0.15, 1.1, 0.15, std('#5a3a20'), s * 6.6 + 1.5, 0.55, z)); }
  const wagon = new THREE.Group(); wagon.add(box(3.2, 0.8, 1.6, std('#7a5232'), 0, 1.1, 0)); for (const x of [-1.1, 1.1]) for (const zz of [-0.9, 0.9]) { const wh = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 16), std('#3a2412')); wh.position.set(x, 0.6, zz); G.add(wh); wagon.add(wh); }
  const cov = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.0, 16, 1, true, 0, PI), std('#f2ead8', { side: THREE.DoubleSide })); cov.rotation.z = PI / 2; cov.position.y = 1.5; wagon.add(cov); wagon.position.set(6.4, 0, 22); wagon.rotation.y = 0.3; G.add(wagon);
  // dây cờ hai màu (đen–bạc / đỏ) qua phố
  for (const z of [-12, 12]) { const fl = new THREE.Group(); for (let i = 0; i < 24; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 3), std([z < 0 ? '#1a1a1a' : '#c8102e', z < 0 ? '#c4ced4' : '#f4f4f2'][i % 2], { side: THREE.DoubleSide })); f.rotation.x = PI; f.position.set(-8 + i * 0.7, 6.2 - Math.sin(i / 23 * PI) * 1.0, 0); fl.add(f); } fl.position.z = z; G.add(fl); }
  const RIM = bn.localToWorld(bn.userData.rimLocal.clone()); bn.updateMatrixWorld(true);
  return { G: shad(G), doors, posters, barn: bn, rimW: () => bn.localToWorld(bn.userData.rimLocal.clone()) }; }

// ---------- linh vật: khung chung (đầu thú + thân người, như mascot thật) ----------
function jerseyTex(team, num, bg, fg, edge) { return ctex(512, 256, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = edge; g.fillRect(0, 0, W, 14); g.fillRect(0, H - 14, W, 14);
  g.fillStyle = fg; g.textAlign = 'center'; g.font = '900 ' + (team.length > 5 ? 46 : 56) + 'px Anton, Impact, sans-serif'; g.fillText(team, W * 0.5, 88); g.font = '900 118px Anton, Impact, sans-serif'; g.fillText(num, W * 0.5, 206); g.fillText(num, 0, 170); g.fillText(num, W, 170); }); }
function limb(r, len, m) { const g = new THREE.Group(); const u = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 5, 10), m); u.geometry.translate(0, -len / 2 - r * 0.5, 0); g.add(u); return { g, m: u }; }
function makeMascotBase(o) { const G = new THREE.Group(); const fur = std(o.fur, { roughness: 1 }), fur2 = std(o.fur2, { roughness: 1 });
  const S = o.scale; const root = new THREE.Group(); root.scale.setScalar(S); G.add(root);
  const hips = new THREE.Group(); hips.position.y = 0.95; root.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  const jt = jerseyTex(o.team, o.num, o.jersey, o.jfg, o.jedge);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(o.chest, o.waist, 0.62, 20, 1), std('#fff', { map: jt, roughness: 0.75 })); body.position.y = 0.34; body.rotation.y = PI; torso.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(o.waist * 1.02, 18, 12), std(o.shorts)); belly.scale.y = 0.7; belly.position.y = 0.02; torso.add(belly);
  const yoke = new THREE.Mesh(new THREE.SphereGeometry(o.chest * 1.08, 18, 12), fur); yoke.scale.set(1, 0.42, 0.85); yoke.position.y = 0.64; torso.add(yoke);
  const nk = new THREE.Mesh(new THREE.CylinderGeometry(o.chest * 0.42, o.chest * 0.55, 0.22, 14), fur); nk.position.y = 0.76; torso.add(nk);
  const neck = new THREE.Group(); neck.position.y = 0.68; torso.add(neck); const head = new THREE.Group(); head.position.y = 0.2; neck.add(head);
  const arms = [], legs = [];
  for (const s of [-1, 1]) { const sh = new THREE.Group(); sh.position.set(s * (o.chest + 0.06), 0.56, 0); torso.add(sh); const up = limb(0.075 * o.limb, 0.28, fur); sh.add(up.g); const el = new THREE.Group(); el.position.y = -0.42; up.g.add(el); const lo = limb(0.07 * o.limb, 0.26, fur); el.add(lo.g);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.085 * o.limb, 12, 10), fur2); paw.position.y = -0.4; lo.g.add(paw); arms.push({ sh, el, paw });
    const hp = new THREE.Group(); hp.position.set(s * o.waist * 0.55, -0.05, 0); hips.add(hp); const th = limb(0.1 * o.limb, 0.34, fur); hp.add(th.g); const kn = new THREE.Group(); kn.position.y = -0.47; th.g.add(kn); const sn = limb(0.085 * o.limb, 0.3, fur); kn.add(sn.g);
    const ft = new THREE.Mesh(new THREE.BoxGeometry(0.17 * o.limb, 0.1, 0.32 * o.foot), fur2); ft.position.set(0, -0.44, 0.07); sn.g.add(ft); legs.push({ hp, kn, ft });
    const sh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * o.limb, 0.15 * o.limb, 0.22, 12), std(o.shorts)); sh2.position.y = -0.08; th.g.add(sh2); }
  const tail = new THREE.Group(); tail.position.set(0, 0.0, -o.waist); hips.add(tail);
  G.userData = { root, hips, torso, neck, head, arms, legs, tail, fur, fur2, S, extras: {} }; return G; }
// Coyote: lông nâu xám, mõm dài, tai nhọn, áo đen–bạc SPURS
export function makeCoyote() { const G = makeMascotBase({ fur: '#9a7a5a', fur2: '#e8dcc8', team: 'SPURS', num: '00', jersey: '#1a1a1a', jfg: '#c4ced4', jedge: '#c4ced4', shorts: '#1a1a1a', chest: 0.24, waist: 0.21, limb: 1.0, foot: 1.0, scale: 1.0 });
  const U = G.userData, h = U.head, fur = U.fur, fur2 = U.fur2;
  const sk = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), fur); sk.scale.set(1, 0.95, 1.05); h.add(sk);
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.34, 16), fur); snout.rotation.x = PI / 2; snout.position.set(0, -0.05, 0.28); h.add(snout);
  const jaw = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 12), fur2); jaw.rotation.x = PI / 2; jaw.position.set(0, -0.11, 0.24); h.add(jaw);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std('#111')); nose.position.set(0, -0.04, 0.45); h.add(nose);
  const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), fur2); cheek.scale.set(1.2, 0.6, 0.9); cheek.position.set(0, -0.1, 0.08); h.add(cheek);
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.26, 4), fur); ear.position.set(s * 0.11, 0.24, -0.02); ear.rotation.z = -s * 0.25; h.add(ear); const ei = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 4), std('#e8a898')); ei.position.set(s * 0.11, 0.23, 0.01); ei.rotation.z = -s * 0.25; h.add(ei);
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), std('#fff')); e.position.set(s * 0.085, 0.05, 0.16); h.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), std('#2a1a0a')); p.position.set(s * 0.09, 0.05, 0.205); h.add(p); p.userData.base = p.position.clone(); U.extras['pupil' + s] = p;
    const br = box(0.09, 0.02, 0.02, std('#4a3424'), s * 0.085, 0.12, 0.18); br.rotation.z = s * 0.25; h.add(br); U.extras['brow' + s] = br; }
  const tl = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.55, 10), fur); tl.geometry.translate(0, -0.27, 0); tl.rotation.x = 2.3; U.tail.add(tl); const tt = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), std('#2a2018')); tt.position.y = -0.52; tl.add(tt);
  U.kind = 'coyote'; return shad(G); }
// Clutch: gấu lông trắng xù, 2,1 m, áo đỏ ROCKETS số 00
export function makeClutch() { const G = makeMascotBase({ fur: '#f2efe8', fur2: '#ffffff', team: 'ROCKETS', num: '00', jersey: '#c8102e', jfg: '#ffffff', jedge: '#1a1a1a', shorts: '#c8102e', chest: 0.36, waist: 0.42, limb: 1.45, foot: 1.2, scale: 1.18 });
  const U = G.userData, h = U.head, fur = U.fur;
  const sk = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 18), fur); h.add(sk); h.position.y = 0.26;
  const mz = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), std('#e8dccc')); mz.scale.set(1.2, 0.85, 1); mz.position.set(0, -0.07, 0.24); h.add(mz);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), std('#1a1a1a')); nose.scale.set(1.3, 0.9, 1); nose.position.set(0, -0.02, 0.38); h.add(nose);
  const mouth = box(0.12, 0.02, 0.02, std('#3a1a1a'), 0, -0.13, 0.36); h.add(mouth); U.extras.mouth = mouth;
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), fur); ear.scale.z = 0.6; ear.position.set(s * 0.22, 0.24, -0.02); h.add(ear); const ei = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#c8102e')); ei.scale.z = 0.4; ei.position.set(s * 0.22, 0.24, 0.02); h.add(ei);
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), std('#fff')); e.position.set(s * 0.11, 0.07, 0.25); h.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), std('#111')); p.position.set(s * 0.11, 0.07, 0.3); h.add(p); p.userData.base = p.position.clone(); U.extras['pupil' + s] = p;
    const br = box(0.1, 0.025, 0.02, std('#c8102e'), s * 0.11, 0.16, 0.27); h.add(br); U.extras['brow' + s] = br; }
  const tl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), fur); tl.position.y = 0; U.tail.add(tl);
  // bộ phận "loài nguy cấp" (ẩn tới cú xoay)
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12, 0, PI * 2, 0, PI / 2), std('#5a7a3a', { flatShading: true, roughness: 0.6 })); shell.rotation.x = -PI / 2; shell.scale.set(1.1, 1.2, 0.6); shell.position.set(0, 0.35, -0.38); U.torso.add(shell); shell.visible = false;
  const hex = new THREE.Mesh(new THREE.SphereGeometry(0.505, 8, 5, 0, PI * 2, 0, PI / 2), std('#3a5a22', { wireframe: true })); hex.rotation.x = -PI / 2; hex.scale.copy(shell.scale); hex.position.copy(shell.position); U.torso.add(hex); hex.visible = false;
  const wings = []; for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(s * 0.25, 0.55, -0.35); U.torso.add(w); for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9 - i * 0.07, 0.03), std(i < 5 ? '#4a3220' : '#f4f4f2')); f.geometry.translate(0, 0.42, 0); f.position.x = s * i * 0.14; f.rotation.z = -s * (0.6 + i * 0.12); w.add(f); } w.visible = false; wings.push(w); }
  const trunk = new THREE.Group(); trunk.position.set(0, -0.06, 0.36); h.add(trunk); const segs = []; let par = trunk; for (let i = 0; i < 7; i++) { const sg = new THREE.Mesh(new THREE.CylinderGeometry(0.06 - i * 0.005, 0.065 - i * 0.005, 0.12, 10), std('#9a9aa0')); sg.geometry.translate(0, -0.06, 0); const j = new THREE.Group(); j.position.y = i ? -0.11 : 0; j.add(sg); par.add(j); segs.push(j); par = j; } trunk.rotation.x = -0.2; trunk.visible = false;
  U.extras.shell = shell; U.extras.hex = hex; U.extras.wings = wings; U.extras.trunk = trunk; U.extras.segs = segs;
  U.kind = 'bear'; return shad(G); }
// ---------- tư thế linh vật ----------
// o: { mode:'stand'|'run'|'dribble'|'cross'|'sit'|'jump'|'dunk'|'flex'|'wave'|'hold'|'point'|'lunge'|'walk'|'slump'|'trophy'|'card'|'flail', k, t, look:[yaw,pitch], face:'smug'|'shock'|'sad'|'happy'|'angry' }
export function poseMascot(M, t, o = {}) { const U = M.userData; const mode = o.mode || 'stand'; const k = o.k ?? 0; const sd = o.seed || 0;
  const A = U.arms, L = U.legs; const br = Math.sin(t * 2.2 + sd) * 0.02;
  U.hips.position.set(0, 0.95, 0); U.hips.rotation.set(0, 0, 0); U.torso.rotation.set(br, 0, Math.sin(t * 1.3 + sd) * 0.02); U.neck.rotation.set(0, 0, 0); U.head.rotation.set(0, 0, 0);
  A.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(0.05 + Math.sin(t * 1.8 + i) * 0.04, 0, s * 0.18); a.el.rotation.set(-0.25, 0, 0); });
  L.forEach((l, i) => { l.hp.rotation.set(0, 0, 0); l.kn.rotation.set(0, 0, 0); });
  U.tail.rotation.set(0, Math.sin(t * (U.kind === 'coyote' ? 6 : 3) + sd) * 0.4, 0);
  const swing = (hz, amp) => L.forEach((l, i) => { const ph = t * hz * PI * 2 + i * PI; l.hp.rotation.x = Math.sin(ph) * amp; l.kn.rotation.x = Math.max(0, -Math.sin(ph)) * amp * 1.4; });
  const armSwing = (hz, amp) => A.forEach((a, i) => { const ph = t * hz * PI * 2 + i * PI; a.sh.rotation.x = -Math.sin(ph) * amp; a.el.rotation.x = -0.6; });
  if (mode === 'walk') { swing(1.6, 0.45); armSwing(1.6, 0.4); U.hips.position.y = 0.95 + Math.abs(Math.sin(t * 1.6 * PI * 2)) * 0.03; }
  if (mode === 'run') { swing(3.2, 0.9); armSwing(3.2, 0.9); U.torso.rotation.x = 0.35; U.hips.position.y = 0.92 + Math.abs(Math.sin(t * 3.2 * PI * 2)) * 0.08; }
  if (mode === 'dribble' || mode === 'cross') { L.forEach((l, i) => { l.hp.rotation.x = -0.5; l.kn.rotation.x = 0.9; }); U.hips.position.y = 0.8; U.torso.rotation.x = 0.35;
    const side = mode === 'cross' ? Math.cos(k * PI) : 1; const b = Math.abs(Math.sin(t * 9)); A.forEach((a, i) => { const s = i ? 1 : -1; const act = (s > 0) === (side > 0); a.sh.rotation.set(act ? -0.5 - b * 0.4 : -0.2, 0, s * (act ? 0.35 : 0.25)); a.el.rotation.x = act ? -0.6 : -1.2; }); }
  if (mode === 'sit') { U.hips.position.y = 0.42 + Math.sin(t * 3) * 0.01; L.forEach((l, i) => { l.hp.rotation.set(-1.4, 0, (i ? 1 : -1) * 0.35); l.kn.rotation.x = 0.4; }); A.forEach((a, i) => { a.sh.rotation.set(-0.4, 0, (i ? 1 : -1) * 0.6); a.el.rotation.x = -0.8; }); U.torso.rotation.x = -0.1; }
  if (mode === 'jump' || mode === 'dunk') { const up = Math.sin(Math.min(1, k) * PI); U.hips.position.y = 0.95 + up * (o.height || 1.0); L.forEach((l, i) => { l.hp.rotation.x = -0.6 * up; l.kn.rotation.x = 1.0 * up; });
    A.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(mode === 'dunk' ? -2.9 + (k > 0.55 ? (k - 0.55) * 4 : 0) : -2.6, 0, s * 0.15); a.el.rotation.x = -0.2; }); }
  if (mode === 'flex') { A.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(0, 0, s * 1.5); a.el.rotation.set(0, 0, 0); a.el.rotation.x = -1.9 - Math.sin(t * 6) * 0.15; }); U.torso.rotation.x = -0.08; }
  if (mode === 'wave') { const a = A[1]; a.sh.rotation.set(0, 0, 2.6 + Math.sin(t * 10) * 0.3); a.el.rotation.x = -0.3; }
  if (mode === 'point') { const a = A[0]; a.sh.rotation.set(-1.5, 0, -0.1); a.el.rotation.x = -0.05; }
  if (mode === 'hold' || mode === 'card' || mode === 'trophy') { A.forEach((a, i) => { const s = i ? 1 : -1; a.sh.rotation.set(mode === 'trophy' ? -2.6 : -1.1, 0, s * 0.1); a.el.rotation.x = mode === 'trophy' ? -0.3 : -0.6; }); }
  if (mode === 'lunge') { U.torso.rotation.x = 0.7 * k; U.hips.position.y = 0.95 + Math.sin(k * PI) * 0.8; A.forEach((a, i) => { a.sh.rotation.set(-2.2, 0, (i ? 1 : -1) * 0.3); a.el.rotation.x = -0.2; }); L.forEach((l, i) => { l.hp.rotation.x = i ? -1.0 : 0.6; l.kn.rotation.x = i ? 0.8 : 0.3; }); }
  if (mode === 'slump') { U.torso.rotation.x = 0.35; U.neck.rotation.x = 0.45; A.forEach((a, i) => { a.sh.rotation.set(0.1, 0, (i ? 1 : -1) * 0.08); a.el.rotation.x = -0.05; }); swing(1.0, 0.25 * (o.walk ? 1 : 0)); }
  if (mode === 'flail') { A.forEach((a, i) => { a.sh.rotation.set(-2.4 + Math.sin(t * 14 + i * 2) * 0.6, 0, (i ? 1 : -1) * (0.6 + Math.sin(t * 11 + i) * 0.4)); a.el.rotation.x = -0.4; }); }
  const lk = o.look || [0, 0]; U.head.rotation.y += lk[0] + Math.sin(t * 0.9 + sd) * 0.06; U.head.rotation.x += -lk[1];
  // biểu cảm: chân mày + đồng tử
  const f = o.face || 'neutral'; for (const s of [-1, 1]) { const b = U.extras['brow' + s]; if (!b) continue; b.rotation.z = s * ({ smug: 0.35, angry: 0.6, sad: -0.5, shock: -0.1, happy: 0.0 }[f] ?? 0.2); b.position.y = (U.kind === 'bear' ? 0.16 : 0.12) + (f === 'shock' ? 0.04 : 0);
    const p = U.extras['pupil' + s]; p.position.copy(p.userData.base); p.scale.setScalar(f === 'shock' ? 0.6 : 1); p.position.x += lk[0] * 0.02; }
  if (U.extras.mouth) U.extras.mouth.scale.set(f === 'shock' ? 0.6 : 1, f === 'shock' ? 4 : 1, 1);
  M.updateMatrixWorld(true); }
// tay phải (i=1) / trái (i=0) — vị trí thế giới của bàn tay
export const pawW = (M, i = 1) => M.userData.arms[i].paw.getWorldPosition(new THREE.Vector3());
// bật/tắt bộ phận loài nguy cấp cho Clutch: k 0..1 mỗi phần
export function endangered(M, shell, wings, trunk, t = 0, flap = 0) { const X = M.userData.extras; X.shell.visible = X.hex.visible = shell > 0; X.shell.scale.set(1.1 * shell, 1.2 * shell, 0.6 * shell); X.hex.scale.copy(X.shell.scale);
  X.wings.forEach((w, i) => { w.visible = wings > 0; w.scale.setScalar(Math.max(0.001, wings)); w.rotation.y = (i ? -1 : 1) * (0.4 + Math.sin(t * 12) * 0.5 * flap); w.rotation.z = (i ? 1 : -1) * Math.sin(t * 12) * 0.3 * flap; });
  X.trunk.visible = trunk > 0; X.trunk.scale.setScalar(Math.max(0.001, trunk)); X.segs.forEach((s, i) => (s.rotation.x = Math.sin(t * 3 + i * 0.6) * 0.12 + (i > 4 ? -0.3 : 0))); }
// danh thiếp dài cuộn ra: trả về mesh; set(len)
export function longCard(text) { const t = ctex(4096, 128, (g, W, H) => { g.fillStyle = '#f6f0e0'; g.fillRect(0, 0, W, H); g.strokeStyle = '#c8102e'; g.lineWidth = 8; g.strokeRect(4, 4, W - 8, H - 8); g.fillStyle = '#1a1a1a'; g.font = '900 72px ' + WEST; g.textBaseline = 'middle'; g.fillText(text, 24, H / 2 + 4); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.22), std('#fff', { map: t, side: THREE.DoubleSide })); m.geometry.translate(0.5, 0, 0); m.userData.tex = t; m.userData.set = (len) => { m.scale.x = Math.max(0.01, len); t.repeat.set(Math.min(1, len / 12), 1); t.needsUpdate = true; }; m.castShadow = true; return m; }
export function trophy(col = '#e8c44a') { const G = new THREE.Group(); const m = std(col, { metalness: 0.8, roughness: 0.25 }); const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.06, 0.24, 18, 1, true), m); cup.position.y = 0.3; G.add(cup); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), m); st.position.y = 0.12; G.add(st); G.add(box(0.2, 0.06, 0.2, std('#3a2412'), 0, 0.03, 0)); for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 12, PI), m); h.position.set(s * 0.17, 0.32, 0); h.rotation.z = -s * PI / 2; G.add(h); } return shad(G); }
export function binoculars() { const G = new THREE.Group(); const m = std('#1a1a1a', { metalness: 0.4 }); for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.13, 12), m); c.rotation.x = PI / 2; c.position.x = s * 0.045; G.add(c); } return shad(G); }
export function cowboyHat(c = '#6a4a2a') { const G = new THREE.Group(); const m = std(c, { roughness: 0.9 }); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 20), m); br.scale.z = 0.85; G.add(br); const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.13, 16), m); cr.position.y = 0.07; G.add(cr); G.add(box(0.21, 0.025, 0.21, std('#2a1a0c'), 0, 0.025, 0)); return shad(G); }
export function dayLights(scene) { scene.background = new THREE.Color('#8cc4ec'); scene.fog = new THREE.Fog('#e8cfa8', 80, 260);
  const hemi = new THREE.HemisphereLight('#f4ecff', '#a87a4a', 2.4); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0d0', 4.0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 100 }); sun.shadow.bias = -0.0004; scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#ffe6c8', 1.0); scene.add(fill); scene.add(fill.target);
  const at = (x, z) => { sun.target.position.set(x, 0, z); sun.position.set(x + 6, 30, z + 8); fill.target.position.set(x, 1, z); fill.position.set(x - 10, 8, z + 12); }; return { hemi, sun, fill, at }; }
