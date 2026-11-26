// Tập 31 — "Steelers cut Aaron Rodgers": các phòng trong nhà (hư cấu, không logo/không tên đội trên tường), đặt cách nhau theo trục x.
// LOCKER (x=0): phòng thay đồ đen-vàng, tủ gỗ có biển tên, ghế băng giữa phòng. STUDIO (x=40): phim trường "LIVE" tối, đèn LED xanh-cam.
// OFFICE (x=80): văn phòng HLV gỗ ấm, TV treo tường, nút đỏ trên bàn. MEET (x=120): phòng họp, bảng trắng sơ đồ X-O, bàn dài.
// DINING (x=160): phòng ăn nhà fan, giấy dán tường ấm, bàn tiệc Lễ Tạ Ơn, cờ đuôi nheo đen-vàng (không logo), TV.
// EXIT (x=200): cửa sắt sân tập ra bãi xe phủ tuyết, đèn vàng trên cửa, tuyết rơi.
import * as THREE from 'three';
export const X = { LOCKER: 0, STUDIO: 40, OFFICE: 80, MEET: 120, DINING: 160, EXIT: 200 };
let rs = 31; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
export const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
export function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
const box = (w, h, d, m, x, y, z, G) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; G.add(b); return b; };
const plane = (w, h, m, G) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.receiveShadow = true; G.add(p); return p; };
// phòng hộp: sàn + 3 tường (bỏ tường phía +z cho máy quay) + trần
function shell(G, x0, W, D, H, wallM, floorM, ceilC = '#e8e4dc') {
  const f = plane(W, D, floorM, G); f.rotation.x = -Math.PI / 2; f.position.set(x0, 0, 0);
  const b = plane(W, H, wallM, G); b.position.set(x0, H / 2, -D / 2);
  const l = plane(D, H, wallM, G); l.rotation.y = Math.PI / 2; l.position.set(x0 - W / 2, H / 2, 0);
  const r = plane(D, H, wallM, G); r.rotation.y = -Math.PI / 2; r.position.set(x0 + W / 2, H / 2, 0);
  const c = plane(W, D, std(ceilC, { side: THREE.DoubleSide }), G); c.rotation.x = Math.PI / 2; c.position.set(x0, H, 0);
  const fr = plane(W, H, wallM, G); fr.rotation.y = Math.PI; fr.position.set(x0, H / 2, D / 2 + 0.01); fr.material = wallM.clone(); fr.material.side = THREE.BackSide; fr.visible = false;
}
export const nameplate = (txt) => ctex(512, 128, (g) => { g.fillStyle = '#16161a'; g.fillRect(0, 0, 512, 128); g.strokeStyle = '#e8b020'; g.lineWidth = 8; g.strokeRect(6, 6, 500, 116); g.fillStyle = '#f2c230'; g.font = '900 72px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 256, 68); });
// ----- PHÒNG THAY ĐỒ -----
function locker(G) { const x0 = X.LOCKER, W = 14, D = 10, H = 4.2;
  const floorT = ctex(256, 256, (g) => { g.fillStyle = '#2a2b30'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${R() < 0.5 ? '255,255,255' : '0,0,0'},0.05)`; g.fillRect(R() * 256, R() * 256, 2, 2); } g.strokeStyle = '#e8b020'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 90, 0, 7); g.stroke(); }, [1, 1]);
  const carpet = std('#ffffff', { map: floorT, roughness: 0.95 });
  shell(G, x0, W, D, H, std('#26272c', { roughness: 0.7 }), carpet, '#1c1c20');
  const stripe = std('#e8b020', { emissive: '#e8b020', emissiveIntensity: 0.25 }); box(W, 0.12, 0.02, stripe, x0, 3.2, -D / 2 + 0.02, G);
  const wood = std('#2e3036', { roughness: 0.45, metalness: 0.5 }), dark = std('#121216', { roughness: 0.5, metalness: 0.2 });
  const names = ['FARRELL', 'WILKES', 'RODGERS 8', 'MOORE', 'HAYES', 'DONOVAN', 'PRICE'];
  const lockers = [];
  names.forEach((nm, i) => { const lx = x0 - 5.4 + i * 1.8; const L = new THREE.Group(); L.position.set(lx, 0, -D / 2 + 0.45); G.add(L);
    box(1.6, 2.6, 0.8, wood, 0, 1.3, 0, L); box(1.42, 2.1, 0.05, dark, 0, 1.3, 0.38, L); box(1.6, 0.2, 0.85, dark, 0, 2.7, 0, L); box(1.5, 0.45, 0.6, std('#1c1d22'), 0, 0.45, 0.15, L);
    const hook = new THREE.Group(); hook.position.set(0, 1.9, 0.25); L.add(hook);
    const jerseyT = ctex(256, 256, (g) => { g.fillStyle = '#121216'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#f2c230'; g.font = '900 150px Anton, Impact'; g.textAlign = 'center'; g.fillText(String((i * 17 + 5) % 99), 128, 190); g.fillRect(0, 0, 256, 18); });
    const jr = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.95), std('#ffffff', { map: jerseyT, side: THREE.DoubleSide })); jr.position.set(0, -0.35, 0.02); hook.add(jr);
    const np = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), new THREE.MeshStandardMaterial({ map: nameplate(nm), roughness: 0.4 })); np.position.set(0, 2.85, 0.44); L.add(np);
    lockers.push({ L, np, jr, x: lx, z: -D / 2 + 0.9 }); });
  box(6, 0.12, 0.5, std('#6a6e78', { roughness: 0.5 }), x0, 0.48, -0.4, G); [-2.6, 0, 2.6].forEach((dx) => box(0.12, 0.45, 0.4, dark, x0 + dx, 0.24, -0.4, G));
  // đèn trần dạng dải
  for (let i = -1; i <= 1; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(5, 0.06, 0.3), new THREE.MeshBasicMaterial({ color: '#fff6e0' })); l.position.set(x0 + i * 4.4, H - 0.05, -1); G.add(l); }
  // cửa ra (bên phải)
  box(1.4, 2.4, 0.08, std('#3a3a40', { metalness: 0.6, roughness: 0.4 }), x0 + W / 2 - 0.05, 1.2, 1.5, G).rotation.y = Math.PI / 2;
  const gl = new THREE.PointLight('#ffe8c0', 22, 16, 1.6); gl.position.set(x0, 3.6, 0); G.add(gl);
  return { lockers, x0 }; }
// ----- PHIM TRƯỜNG LIVE -----
function studio(G) { const x0 = X.STUDIO, W = 12, D = 9, H = 5;
  shell(G, x0, W, D, H, std('#14161c', { roughness: 0.9 }), std('#1c1e24', { roughness: 0.6 }), '#0c0c10');
  const ledB = new THREE.MeshBasicMaterial({ color: '#2a6cff' }), ledO = new THREE.MeshBasicMaterial({ color: '#ff8a2a' });
  for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.4, 0.05), i % 2 ? ledO : ledB); b.position.set(x0 - 4.8 + i * 1.2, 2.2, -D / 2 + 0.05); G.add(b); }
  const scrT = ctex(1024, 512, (g) => { const gr = g.createLinearGradient(0, 0, 1024, 512); gr.addColorStop(0, '#0a2a6a'); gr.addColorStop(1, '#2a0a3a'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512); g.fillStyle = '#ff3030'; g.fillRect(0, 380, 1024, 90); g.fillStyle = '#fff'; g.font = '900 64px Anton, Impact'; g.fillText('BREAKING · QB BENCHED', 40, 448); g.font = '900 140px Anton, Impact'; g.fillStyle = '#ffd040'; g.fillText('LIVE', 40, 190); });
  const scr = plane(6, 3, new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false }), G); scr.position.set(x0, 2.6, -D / 2 + 0.12);
  const desk = std('#2a2c34', { metalness: 0.4, roughness: 0.35 }); box(3.2, 0.9, 1.1, desk, x0, 0.45, 0.2, G); const top = box(3.4, 0.06, 1.3, std('#f2f2f2', { roughness: 0.2 }), x0, 0.93, 0.2, G);
  const mic = new THREE.Group(); mic.position.set(x0 + 0.42, 0.96, 0.55); G.add(mic); box(0.04, 0.4, 0.04, std('#111'), 0, 0.2, 0, mic); const mh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.18, 12), std('#2a2a2a', { metalness: 0.6 })); mh.position.set(0, 0.44, 0.06); mh.rotation.x = 1.2; mic.add(mh);
  const liveT = ctex(256, 96, (g) => { g.fillStyle = '#c8102e'; g.fillRect(0, 0, 256, 96); g.fillStyle = '#fff'; g.font = '900 70px Anton, Impact'; g.textAlign = 'center'; g.fillText('ON AIR', 128, 72); });
  const live = plane(1.1, 0.42, new THREE.MeshBasicMaterial({ map: liveT, toneMapped: false }), G); live.position.set(x0 + 4.2, 4.2, -D / 2 + 0.1);
  const l1 = new THREE.PointLight('#8ab0ff', 18, 14, 1.5); l1.position.set(x0 - 3, 3.5, 2); G.add(l1); const l2 = new THREE.PointLight('#ffb070', 18, 14, 1.5); l2.position.set(x0 + 3, 3.5, 2); G.add(l2);
  return { x0, deskTop: 0.96, mic }; }
// ----- VĂN PHÒNG HLV -----
function office(G) { const x0 = X.OFFICE, W = 9, D = 8, H = 3.6;
  const panel = ctex(256, 256, (g) => { g.fillStyle = '#26324a'; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 64) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, 0, 3, 256); } for (let i = 0; i < 0; i++) { g.strokeStyle = 'rgba(40,20,10,0.25)'; g.beginPath(); const x = R() * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 80, x - 6, 170, x + 3, 256); g.stroke(); } }, [3, 1]);
  shell(G, x0, W, D, H, std('#ffffff', { map: panel, roughness: 0.6 }), std('#3a3c44', { roughness: 0.95 }), '#e8e4dc');
  const wood = std('#4a2e1a', { roughness: 0.4 }); box(2.6, 0.08, 1.2, wood, x0, 0.78, -1.2, G); box(2.4, 0.74, 1.0, wood, x0, 0.39, -1.3, G);
  // ghế giám đốc
  const chair = new THREE.Group(); chair.position.set(x0, 0, -2.25); G.add(chair); const lea = std('#1a1a1e', { roughness: 0.45 });
  box(0.62, 0.12, 0.6, lea, 0, 0.5, 0, chair); box(0.62, 0.9, 0.12, lea, 0, 0.98, -0.28, chair); box(0.08, 0.45, 0.08, std('#555', { metalness: 0.7 }), 0, 0.23, 0, chair);
  // TV treo tường bên phải + nút đỏ trên bàn
  const tvT = ctex(1024, 576, (g) => { g.fillStyle = '#0a1a3a'; g.fillRect(0, 0, 1024, 576); g.fillStyle = '#c8102e'; g.fillRect(0, 430, 1024, 110); g.fillStyle = '#fff'; g.font = '900 70px Anton, Impact'; g.fillText('BREAKING: QB SAYS "JUST RELEASE ME"', 30, 508); g.fillStyle = '#20242c'; g.fillRect(320, 60, 380, 330); g.fillStyle = '#e8b98f'; g.beginPath(); g.arc(510, 170, 70, 0, 7); g.fill(); g.fillStyle = '#121216'; g.fillRect(400, 250, 220, 140); g.fillStyle = '#f2c230'; g.font = '900 100px Anton'; g.fillText('8', 485, 360); });
  const tv = box(2.0, 1.15, 0.08, std('#0a0a0c'), x0 + W / 2 - 0.06, 2.1, -0.6, G); tv.rotation.y = -Math.PI / 2;
  const scr = plane(1.9, 1.07, new THREE.MeshBasicMaterial({ map: tvT, toneMapped: false }), G); scr.rotation.y = -Math.PI / 2; scr.position.set(x0 + W / 2 - 0.11, 2.1, -0.6);
  const btn = new THREE.Group(); btn.position.set(x0 + 0.7, 0.82, -0.95); G.add(btn); box(0.36, 0.08, 0.36, std('#d8d8d8', { metalness: 0.5 }), 0, 0.04, 0, btn);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.07, 24), std('#d01818', { roughness: 0.3, emissive: '#600', emissiveIntensity: 0.4 })); cap.position.y = 0.11; btn.add(cap);
  const lblT = ctex(256, 64, (g) => { g.fillStyle = '#111'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#fff'; g.font = '900 44px Anton'; g.textAlign = 'center'; g.fillText('RELEASE', 128, 48); });
  const lbl = plane(0.34, 0.085, new THREE.MeshBasicMaterial({ map: lblT }), btn); lbl.position.set(0, 0.06, 0.185);
  // cửa sổ chiều tuyết phía sau
  const winT = ctex(512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#3a4a6a'); gr.addColorStop(1, '#c8a8a0'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(R() * 512, R() * 256, 2, 2); } g.fillStyle = '#2a2a34'; for (let x = 0; x < 512; x += 40) g.fillRect(x, 150 + R() * 60, 34, 120); });
  const win = plane(3.2, 1.6, new THREE.MeshBasicMaterial({ map: winT }), G); win.position.set(x0, 2.1, -D / 2 + 0.02);
  box(0.06, 1.7, 0.06, std('#2a2a2a'), x0, 2.1, -D / 2 + 0.05, G);
  // kệ sách + cúp
  for (let i = 0; i < 3; i++) box(1.6, 0.05, 0.35, wood, x0 - 3.2, 0.8 + i * 0.7, -D / 2 + 0.2, G);
  const ll = new THREE.PointLight('#ffd8a8', 14, 12, 1.6); ll.position.set(x0, 3.2, -0.5); G.add(ll);
  return { x0, chair, btn, cap }; }
// ----- PHÒNG HỌP -----
function meet(G) { const x0 = X.MEET, W = 11, D = 9, H = 3.5;
  shell(G, x0, W, D, H, std('#d8d4cc', { roughness: 0.9 }), std('#4a4c54', { roughness: 0.95 }), '#f0f0ee');
  box(5.5, 0.07, 1.6, std('#2a2a30', { roughness: 0.3 }), x0, 0.76, -0.6, G); box(5.2, 0.7, 0.2, std('#1a1a1e'), x0, 0.38, -0.6, G);
  const wbT = ctex(1024, 512, (g) => { g.fillStyle = '#f8f8f6'; g.fillRect(0, 0, 1024, 512); g.lineWidth = 7; g.strokeStyle = '#1a3ac8'; g.font = '900 60px Arial'; g.fillStyle = '#1a3ac8'; [[200, 300], [300, 300], [400, 300], [500, 300], [600, 300]].forEach(([x, y]) => g.fillText('O', x - 20, y + 20)); g.strokeStyle = '#c81a1a'; g.fillStyle = '#c81a1a'; [[220, 160], [420, 140], [640, 170], [820, 220]].forEach(([x, y]) => g.fillText('X', x - 20, y + 20));
    g.beginPath(); g.moveTo(420, 290); g.bezierCurveTo(480, 200, 700, 120, 860, 120); g.stroke(); g.beginPath(); g.moveTo(860, 120); g.lineTo(830, 105); g.moveTo(860, 120); g.lineTo(835, 140); g.stroke(); });
  const wb = plane(4.4, 2.2, new THREE.MeshStandardMaterial({ map: wbT, roughness: 0.25 }), G); wb.position.set(x0, 1.9, -D / 2 + 0.03);
  const ll = new THREE.PointLight('#f4f4ff', 18, 14, 1.5); ll.position.set(x0, 3.2, 0); G.add(ll);
  for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 1.2), new THREE.MeshBasicMaterial({ color: '#ffffff' })); l.position.set(x0 - 3 + i * 2, H - 0.03, -0.5); G.add(l); }
  return { x0 }; }
// ----- PHÒNG ĂN NHÀ FAN -----
export function roastTurkey(sc = 1) { const G = new THREE.Group(); const sk = std('#b8661e', { roughness: 0.35, metalness: 0.05 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), sk); b.scale.set(1.25, 0.8, 1); b.position.y = 0.14; G.add(b);
  for (const s of [-1, 1]) { const d = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.14, 4, 8), sk); d.position.set(0.18, 0.12, s * 0.12); d.rotation.z = -1.1; G.add(d); const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.06, 6), std('#f4ecd8')); bone.position.set(0.28, 0.2, s * 0.12); bone.rotation.z = -1.1; G.add(bone); }
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.03, 32), std('#f4f4f0', { roughness: 0.2 })); plate.position.y = 0.015; G.add(plate);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const g = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), std(i % 2 ? '#3a8a2a' : '#d8341a')); g.position.set(Math.cos(a) * 0.29, 0.04, Math.sin(a) * 0.29); G.add(g); }
  G.scale.setScalar(sc); G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; }
function dining(G) { const x0 = X.DINING, W = 9, D = 8, H = 3.2;
  const wp = ctex(256, 256, (g) => { g.fillStyle = '#4a5e6a'; g.fillRect(0, 0, 256, 256); g.fillStyle = 'rgba(220,230,240,0.14)'; for (let y = 0; y < 256; y += 32) for (let x = (y / 32) % 2 * 16; x < 256; x += 32) { g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); } }, [6, 2]);
  const wallM = std('#ffffff', { map: wp, roughness: 0.85 });
  const fl = ctex(256, 256, (g) => { for (let y = 0; y < 256; y += 32) { g.fillStyle = (y / 32) % 2 ? '#7a4a28' : '#86542e'; g.fillRect(0, y, 256, 31); g.fillStyle = '#4a2a12'; g.fillRect(0, y + 31, 256, 1); } }, [4, 4]);
  shell(G, x0, W, D, H, wallM, std('#ffffff', { map: fl, roughness: 0.5 }), '#f2e8d8');
  const wood = std('#5a361e', { roughness: 0.45 }); const tbl = box(2.8, 0.07, 1.3, wood, x0, 0.76, -0.4, G); [[-1.25, -0.55], [1.25, -0.55], [-1.25, 0.55], [1.25, 0.55]].forEach(([dx, dz]) => box(0.08, 0.74, 0.08, wood, x0 + dx, 0.37, -0.4 + dz, G));
  box(2.85, 0.01, 1.35, std('#f2ecdf', { roughness: 0.9 }), x0, 0.8, -0.4, G);
  const tk = roastTurkey(1.2); tk.position.set(x0, 0.81, -0.4); G.add(tk);
  const mash = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 10, 0, 7, 0, 1.6), std('#f4ecc8', { roughness: 0.9 })); mash.position.set(x0 - 0.75, 0.84, -0.3); G.add(mash);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.08, 20), std('#e8e8e4')); bowl.position.set(x0 - 0.75, 0.84, -0.3); G.add(bowl);
  const gravy = new THREE.Group(); gravy.position.set(x0 + 0.75, 0.81, -0.25); G.add(gravy); const gb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10, 0, 7, 0, 1.7), std('#f4f4f0', { roughness: 0.2 })); gb.scale.set(1.5, 0.8, 1); gb.position.y = 0.07; gravy.add(gb);
  const sp = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 8), std('#f4f4f0')); sp.rotation.z = -1.3; sp.position.set(0.13, 0.08, 0); gravy.add(sp);
  for (const dx of [-0.35, 0.35]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), std('#f4ecd8')); c.position.set(x0 + dx, 0.93, -0.75); G.add(c); const fl_ = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffd070' })); fl_.scale.y = 1.8; fl_.position.set(x0 + dx, 1.07, -0.75); G.add(fl_); }
  // cờ đuôi nheo đen-vàng trên tường + khung áo không logo
  for (let i = 0; i < 9; i++) { const pn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 3), std(i % 2 ? '#121216' : '#f2b81a')); pn.rotation.z = Math.PI; pn.position.set(x0 - 3.2 + i * 0.8, 2.75, -D / 2 + 0.06); G.add(pn); }
  const frT = ctex(256, 256, (g) => { g.fillStyle = '#121216'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#f2c230'; g.font = '900 140px Anton'; g.textAlign = 'center'; g.fillText('1', 128, 190); g.fillRect(0, 0, 256, 20); });
  const fr = box(0.9, 1.0, 0.05, std('#2a1a0a'), x0 - 3.0, 1.8, -D / 2 + 0.04, G); const frJ = plane(0.78, 0.88, std('#ffffff', { map: frT }), G); frJ.position.set(x0 - 3.0, 1.8, -D / 2 + 0.075);
  const tvT = ctex(1024, 576, (g) => { g.fillStyle = '#0a1a3a'; g.fillRect(0, 0, 1024, 576); g.fillStyle = '#c8102e'; g.fillRect(0, 430, 1024, 110); g.fillStyle = '#fff'; g.font = '900 72px Anton, Impact'; g.fillText('BREAKING: STEELERS RELEASE RODGERS', 26, 510); g.fillStyle = '#121216'; g.fillRect(380, 80, 260, 300); g.fillStyle = '#f2c230'; g.font = '900 220px Anton'; g.textAlign = 'center'; g.fillText('8', 510, 330); });
  const tv = box(1.8, 1.05, 0.08, std('#0a0a0c'), x0 + 2.4, 1.85, -D / 2 + 0.06, G); const scr = plane(1.7, 0.96, new THREE.MeshBasicMaterial({ map: tvT, toneMapped: false }), G); scr.position.set(x0 + 2.4, 1.85, -D / 2 + 0.11);
  const chand = new THREE.PointLight('#ffcf90', 16, 10, 1.6); chand.position.set(x0, 2.6, -0.4); G.add(chand); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff0c8' })); bulb.position.copy(chand.position); G.add(bulb);
  return { x0, gravy, tableY: 0.8, turkey: tk }; }
// ----- CỬA RA BÃI XE TUYẾT -----
function exitLot(G) { const x0 = X.EXIT;
  const snowT = ctex(256, 256, (g) => { g.fillStyle = '#b8c4d2'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(${R() < 0.5 ? '160,170,190' : '255,255,255'},0.25)`; g.fillRect(R() * 256, R() * 256, 3, 3); } }, [12, 12]);
  const gnd = plane(60, 40, std('#ffffff', { map: snowT, roughness: 0.9 }), G); gnd.rotation.x = -Math.PI / 2; gnd.position.set(x0, 0, 8);
  const brickT = ctex(256, 256, (g) => { g.fillStyle = '#5a5e66'; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 32) for (let x = (y / 32) % 2 * 32; x < 256; x += 64) { g.fillStyle = `rgb(${70 + R() * 20},${72 + R() * 20},${80 + R() * 20})`; g.fillRect(x + 2, y + 2, 60, 28); } }, [10, 3]);
  const wall = plane(30, 9, std('#ffffff', { map: brickT, roughness: 0.9 }), G); wall.position.set(x0, 4.5, -2);
  const door = new THREE.Group(); door.position.set(x0 - 0.6, 0, -1.95); G.add(door);
  const dm = std('#3a3e46', { metalness: 0.6, roughness: 0.4 }); const leaf = box(1.2, 2.3, 0.07, dm, 0.6, 1.15, 0, door); leaf.geometry.translate(0, 0, 0); door.userData.leaf = leaf;
  const frame = box(1.45, 2.45, 0.05, std('#1a1a1e'), x0, 1.22, -1.99, G);
  const lamp = new THREE.PointLight('#ffcc80', 26, 14, 1.4); lamp.position.set(x0, 3.0, -1.2); G.add(lamp); const lb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.25), new THREE.MeshBasicMaterial({ color: '#fff0c8' })); lb.position.set(x0, 2.8, -1.85); G.add(lb);
  const signT = ctex(512, 128, (g) => { g.fillStyle = '#121216'; g.fillRect(0, 0, 512, 128); g.fillStyle = '#f2c230'; g.font = '900 64px Anton'; g.textAlign = 'center'; g.fillText('PLAYERS ONLY', 256, 86); });
  const sg = plane(1.6, 0.4, std('#ffffff', { map: signT }), G); sg.position.set(x0, 2.55, -1.96);
  // xe đỗ phủ tuyết (khối đơn giản)
  for (const [dx, dz, c] of [[-6, 6, '#2a3a5a'], [-3, 7, '#8a1a1a'], [4, 6.5, '#3a3a3a'], [7, 7.5, '#c8c8cc']]) { const car = new THREE.Group(); car.position.set(x0 + dx, 0, dz); G.add(car); box(1.8, 0.7, 4.2, std(c, { metalness: 0.5, roughness: 0.35 }), 0, 0.55, 0, car); box(1.6, 0.6, 2.2, std(c, { metalness: 0.5, roughness: 0.35 }), 0, 1.15, -0.2, car); box(1.62, 0.12, 2.22, std('#f4f8fc'), 0, 1.5, -0.2, car); for (const [wx, wz] of [[-0.85, 1.4], [0.85, 1.4], [-0.85, -1.4], [0.85, -1.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.25, 16), std('#151515')); w.rotation.z = Math.PI / 2; w.position.set(wx, 0.33, wz); car.add(w); } }
  // tuyết rơi
  const n = 1400; const flake = new THREE.InstancedMesh(new THREE.SphereGeometry(0.025, 5, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' }), n); flake.frustumCulled = false; G.add(flake); const seeds = [...Array(n)].map(() => [R(), R(), R(), 0.6 + R() * 0.6]); const D_ = new THREE.Object3D();
  const update = (t) => { seeds.forEach(([a, b, c, sp], i) => { const y = 8 - ((t * 1.1 * sp + c * 8) % 8); D_.position.set(x0 - 10 + a * 20 + Math.sin(t * 0.8 + i) * 0.3, y, -1.5 + b * 12); D_.updateMatrix(); flake.setMatrixAt(i, D_.matrix); }); flake.instanceMatrix.needsUpdate = true; };
  return { x0, door, update }; }
export function buildRooms(scene) { const G = new THREE.Group(); scene.add(G); scene.background = new THREE.Color('#202228');
  const L = locker(G), S = studio(G), O = office(G), M = meet(G), Dn = dining(G), Ex = exitLot(G);
  G.traverse((o) => { if (o.isMesh && !(o.material && o.material.isMeshBasicMaterial)) { o.receiveShadow = true; } });
  return { G, L, S, O, M, Dn, Ex, update: (t) => Ex.update(t) }; }
export function roomLights(scene) { const hemi = new THREE.HemisphereLight('#fff4e4', '#3a3430', 1.4); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff0dc', 2.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.5, far: 40 }); key.shadow.bias = -0.0005; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const area = (x, z) => { key.target.position.set(x, 0.8, z); key.position.set(x + 3, 9, z + 6); }; area(0, 0); return { hemi, key, area }; }
// ghế ngồi (mặt ghế cao 0,47 m) — tựa lưng ở phía -z cục bộ (người ngồi nhìn +z)
export function chair(color = '#2a2c34', back = true) { const G = new THREE.Group(); const m = std(color, { roughness: 0.5 }), leg = std('#5a5e66', { metalness: 0.7, roughness: 0.35 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.48), m); seat.position.y = 0.45; G.add(seat);
  if (back) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), m); b.position.set(0, 0.76, -0.23); G.add(b); }
  for (const [x, z] of [[-0.21, -0.2], [0.21, -0.2], [-0.21, 0.2], [0.21, 0.2]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), leg); l.position.set(x, 0.21, z); G.add(l); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; }
// đạo cụ
export function trophy() { const G = new THREE.Group(); const gold = std('#e8b830', { metalness: 0.9, roughness: 0.25 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.08, 16), std('#2a1a0a', { roughness: 0.4 })); base.position.y = 0.04; G.add(base);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.12, 12), gold); stem.position.y = 0.14; G.add(stem);
  const cup = new THREE.Mesh(new THREE.LatheGeometry([0, 0.3, 0.6, 0.85, 1].map((k) => new THREE.Vector2(0.02 + Math.sin(k * 1.4) * 0.09, k * 0.18))), gold); cup.position.y = 0.2; G.add(cup);
  for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 14, Math.PI), gold); h.rotation.z = s * Math.PI / 2; h.position.set(s * 0.1, 0.3, 0); G.add(h); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
export function scissors() { const G = new THREE.Group(); const blade = std('#d8dce4', { metalness: 0.95, roughness: 0.18 }), handle = std('#f2b81a', { roughness: 0.4 });
  const halves = [-1, 1].map((s) => { const H = new THREE.Group(); G.add(H); const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.9), blade); b.position.z = 0.45; b.geometry.translate(0, 0, 0); H.add(b);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.16, 4), blade); tip.rotation.x = Math.PI / 2; tip.position.z = 0.98; H.add(tip);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), handle); ring.position.set(s * 0.08, 0, -0.2); ring.rotation.x = Math.PI / 2; H.add(ring); return H; });
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 10), std('#888', { metalness: 0.9 })); G.add(pin);
  G.userData.open = (k) => { halves[0].rotation.y = k * 0.35; halves[1].rotation.y = -k * 0.35; }; G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
export function jerseyFold(color = '#241773', num = '8', numC = '#ffffff') { const t = ctex(256, 256, (g) => { g.fillStyle = color; g.fillRect(0, 0, 256, 256); g.fillStyle = numC; g.font = '900 170px Anton, Impact'; g.textAlign = 'center'; g.fillText(num, 128, 200); g.fillStyle = '#e8c030'; g.fillRect(0, 0, 256, 14); });
  const G = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.4), [std(color), std(color), std('#ffffff', { map: t }), std(color), std(color), std(color)]); G.add(m); m.castShadow = true; return G; }
export function duffel() { const G = new THREE.Group(); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 6, 14), std('#16161a', { roughness: 0.6 })); b.rotation.z = Math.PI / 2; b.position.y = 0.22; G.add(b); const st = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.46), std('#f2b81a')); st.position.y = 0.22; G.add(st); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
