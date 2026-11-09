// Tập 11 (NFL) — "What if the Packers played eleven cardboard cutouts?"
// Bối cảnh MỚI: trang trại sữa Wisconsin chiều thu — trời xanh trong mây trắng, nắng vàng xiên, cỏ thu,
// kho thóc đỏ mái gambrel (bảng điểm sơn tay trên mặt hồi), 2 si-lô, ruộng ngô thu khô dọc biên +z,
// khán đài bằng kiện rơm vuông bên biên −z có bò sữa nằm xem, hàng rào gỗ chẻ, bí ngô, cây phong lá đỏ-cam,
// đồi xa + nhà trại trắng; chòi bình luận trên xe rơm (hay wagon).
// Nhân vật phụ: hình nộm bìa cứng (makeCutout), bò sữa hoạt hình (makeCow).
import * as THREE from 'three';
import { fieldTexture, FL, FW } from './ngoaitroi.js';
export { FL, FW };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const GB = { green: '#203731', gold: '#ffb612', kit: '#2f6f50', kitGold: '#ffd84a' };
export const BARN = { x: -FL / 2 - 24, red: '#a8322a' };
const plank = (base, seed, rep = [1, 1]) => ctex(256, 256, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); const r = rnd(seed);
  for (let x = 0; x < W; x += 32) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, 0, 3, H); }
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${r() < 0.5 ? '40,10,5' : '255,230,210'},${0.05 + r() * 0.08})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const x = r() * W; g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 8, H); g.stroke(); } }, rep);

function sky(G) {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2f6fc0'); gr.addColorStop(0.3, '#5d9be0'); gr.addColorStop(0.46, '#a9cdee'); gr.addColorStop(0.5, '#e9eef0'); gr.addColorStop(1, '#c9b48a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  G.add(new THREE.Mesh(new THREE.SphereGeometry(950, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })));
  const ct = ctex(256, 128, (g) => { const r = rnd(9); for (let i = 0; i < 22; i++) { const x = 40 + r() * 176, y = 50 + r() * 40, rr = 20 + r() * 34; const gr = g.createRadialGradient(x, y - rr * 0.2, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.7, 'rgba(244,246,250,0.6)'); gr.addColorStop(1, 'rgba(240,244,250,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); } });
  const cm = new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false }); const r = rnd(4);
  for (let i = 0; i < 26; i++) { const c = new THREE.Sprite(cm); const a = r() * Math.PI * 2; const d = 600 + r() * 260; c.position.set(Math.cos(a) * d, 120 + r() * 200, Math.sin(a) * d); const s = 160 + r() * 160; c.scale.set(s * 2, s, 1); G.add(c); }
}
// cây phong thu (instanced) — tán đỏ / cam / vàng
function maples(G, spots, seed = 1) {
  const N = spots.length; const r = rnd(seed);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.25, 0.42, 4.2, 7).translate(0, 2.1, 0), std('#3f2d22', { roughness: 0.95 }), N);
  const blobs = [[0, 5.6, 0, 2.8], [1.4, 4.9, 0.7, 2.0], [-1.3, 5.0, -0.6, 2.1], [0.2, 6.8, 0.3, 1.8]].map(([x, y, z, rr], k) => { const g = new THREE.IcosahedronGeometry(rr, 1); const p = g.attributes.position; const r2 = rnd(k * 13 + 2); for (let i = 0; i < p.count; i++) { const s = 1 + (r2() - 0.5) * 0.22; p.setXYZ(i, p.getX(i) * s + x, p.getY(i) * s + y, p.getZ(i) * s + z); } g.computeVertexNormals(); return new THREE.InstancedMesh(g, std('#fff', { roughness: 0.9, flatShading: true }), N); });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  const pal = [[0.02, 0.75, 0.42], [0.06, 0.85, 0.48], [0.1, 0.85, 0.5], [0.13, 0.8, 0.5], [0.22, 0.45, 0.32]];
  spots.forEach(([x, z, sc], i) => { const k = sc ?? (0.8 + r() * 0.7); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28); s.setScalar(k); p.set(x, 0, z); m.compose(p, q, s); trunk.setMatrixAt(i, m);
    const base = pal[Math.floor(r() * pal.length)]; blobs.forEach((b) => { b.setMatrixAt(i, m); c.setHSL(base[0] + (r() - 0.5) * 0.02, base[1], base[2] + (r() - 0.5) * 0.08); b.setColorAt(i, c); }); });
  for (const im of [trunk, ...blobs]) { im.castShadow = true; im.receiveShadow = true; G.add(im); }
}
// kho thóc đỏ mái gambrel, cửa trượt chữ X viền trắng, cửa gác xép; hướng mặt +x
function barn() {
  const G = new THREE.Group(); const W = 18, D = 24, H = 7.5;
  const wall = std('#fff', { map: plank(BARN.red, 3, [4, 2]) }); const trim = std('#f4efe6');
  const body = new THREE.Mesh(new THREE.BoxGeometry(D, H, W), wall); body.position.y = H / 2; G.add(body);
  // mặt hồi gambrel (ngũ giác) ở 2 đầu, mái 2 dốc gấp
  const sh = new THREE.Shape(); sh.moveTo(-W / 2, 0); sh.lineTo(-W / 2 + 1.6, 3.4); sh.lineTo(0, 6.0); sh.lineTo(W / 2 - 1.6, 3.4); sh.lineTo(W / 2, 0); sh.lineTo(-W / 2, 0);
  const gab = new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false }); gab.translate(0, 0, -D / 2); gab.rotateY(Math.PI / 2);
  const gm = new THREE.Mesh(gab, wall); gm.position.y = H; G.add(gm);
  const roofM = std('#3d3f44', { roughness: 0.7, metalness: 0.2, side: THREE.DoubleSide });
  { const o = [[-W / 2 - 0.5, -0.3], [-W / 2 + 1.35, 3.55], [0, 6.35], [W / 2 - 1.35, 3.55], [W / 2 + 0.5, -0.3]]; const i = [[W / 2 + 0.2, -0.3], [W / 2 - 1.6, 3.35], [0, 6.0], [-W / 2 + 1.6, 3.35], [-W / 2 - 0.2, -0.3]];
    const rs = new THREE.Shape(); o.forEach(([x, y], k) => k ? rs.lineTo(x, y) : rs.moveTo(x, y)); i.forEach(([x, y]) => rs.lineTo(x, y)); rs.closePath();
    const rg = new THREE.ExtrudeGeometry(rs, { depth: D + 1.2, bevelEnabled: false }); rg.translate(0, 0, -(D + 1.2) / 2); rg.rotateY(Math.PI / 2); const rm = new THREE.Mesh(rg, roofM); rm.position.y = H; G.add(rm); }
  // cửa trượt lớn mặt +x với chữ X trắng
  const fx = D / 2 + 0.02; const door = new THREE.Mesh(new THREE.PlaneGeometry(7, 5.4), std('#fff', { map: ctex(256, 200, (g) => { g.fillStyle = '#962a23'; g.fillRect(0, 0, 256, 200); g.strokeStyle = '#f4efe6'; g.lineWidth = 12; g.strokeRect(6, 6, 244, 188); g.beginPath(); g.moveTo(128, 6); g.lineTo(128, 194); g.stroke();
    g.lineWidth = 9; for (const x0 of [6, 128]) { g.beginPath(); g.moveTo(x0, 6); g.lineTo(x0 + 122, 194); g.moveTo(x0 + 122, 6); g.lineTo(x0, 194); g.stroke(); } }) }));
  door.rotation.y = Math.PI / 2; door.position.set(fx, 2.7, 0); G.add(door);
  // viền trắng góc + mép mái
  for (const z of [-W / 2, W / 2]) for (const x of [-D / 2, D / 2]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, H, 0.3), trim); c.position.set(x, H / 2, z); G.add(c); }
  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, W), trim); sill.position.set(fx, H, 0); G.add(sill);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { G, faceX: fx, gableY: H + 2.6 };
}
function silo(h = 16, r = 3) {
  const G = new THREE.Group(); const tex = ctex(256, 256, (g) => { g.fillStyle = '#b9b2a6'; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 16) { g.fillStyle = 'rgba(0,0,0,0.13)'; g.fillRect(0, y, 256, 3); } for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(90,80,60,${Math.random() * 0.12})`; g.fillRect(Math.random() * 256, Math.random() * 256, 6, 3); } }, [3, h / 4]);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), std('#fff', { map: tex })); c.position.y = h / 2; G.add(c);
  const d = new THREE.Mesh(new THREE.SphereGeometry(r * 1.02, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), std('#8e9298', { metalness: 0.5, roughness: 0.4 })); d.position.y = h; G.add(d);
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.TorusGeometry(r * 1.01, 0.06, 6, 40), std('#6b6f75', { metalness: 0.6 })); b.rotation.x = Math.PI / 2; b.position.y = 2 + i * h / 4.2; G.add(b); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// kiện rơm vuông (instanced) + rơm tròn
const strawTex = () => ctex(128, 128, (g) => { g.fillStyle = '#d9b45e'; g.fillRect(0, 0, 128, 128); const r = rnd(7); for (let i = 0; i < 420; i++) { g.strokeStyle = r() < 0.5 ? 'rgba(150,110,40,0.5)' : 'rgba(255,235,160,0.55)'; g.lineWidth = 1; g.beginPath(); const x = r() * 128, y = r() * 128; g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 20, y + (r() - 0.5) * 6); g.stroke(); } g.fillStyle = 'rgba(90,60,20,0.5)'; g.fillRect(0, 40, 128, 4); g.fillRect(0, 86, 128, 4); });
function bales(G, list, seed = 2) {
  const N = list.length; const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1.2, 0.45, 0.6), std('#fff', { map: strawTex(), roughness: 1 }), N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1), c = new THREE.Color(); const r = rnd(seed);
  list.forEach(([x, y, z, ry], i) => { q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (ry || 0) + (r() - 0.5) * 0.06); p.set(x, y + 0.225, z); m.compose(p, q, s); im.setMatrixAt(i, m); c.setHSL(0.12, 0.5, 0.75 + r() * 0.15); im.setColorAt(i, c); });
  im.castShadow = true; im.receiveShadow = true; G.add(im); return im;
}
function roundBale(r = 0.8, w = 1.2) { const side = ctex(128, 128, (g) => { g.fillStyle = '#d4ad55'; g.fillRect(0, 0, 128, 128); for (let k = 2; k < 64; k += 5) { g.strokeStyle = k % 2 ? 'rgba(140,100,35,0.55)' : 'rgba(255,230,150,0.5)'; g.lineWidth = 2; g.beginPath(); g.arc(64, 64, k, 0, 7); g.stroke(); } });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 24), [std('#fff', { map: strawTex() }), std('#fff', { map: side }), std('#fff', { map: side })]); m.rotation.x = Math.PI / 2; m.castShadow = true; m.receiveShadow = true; return m; }
// ruộng ngô thu: cây = 2 mặt phẳng chéo (alpha), không đổ bóng
function cornfield(G, x0, x1, z0, z1, step = 0.9, seed = 5) {
  const t = ctex(128, 256, (g) => { g.clearRect(0, 0, 128, 256); g.strokeStyle = '#a88a4c'; g.lineWidth = 7; g.beginPath(); g.moveTo(64, 256); g.lineTo(62, 30); g.stroke();
    const r = rnd(3); for (let i = 0; i < 9; i++) { const y = 230 - i * 22; const d = i % 2 ? 1 : -1; g.strokeStyle = `rgb(${190 + r() * 30},${160 + r() * 25},${90 + r() * 20})`; g.lineWidth = 6; g.beginPath(); g.moveTo(63, y); g.quadraticCurveTo(63 + d * 40, y - 30, 63 + d * 58, y + 10 + r() * 20); g.stroke(); }
    g.fillStyle = '#c9a34e'; g.beginPath(); g.ellipse(74, 120, 9, 26, 0.3, 0, 7); g.fill(); g.strokeStyle = '#d8bb70'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(62, 32); g.lineTo(50 + i * 5, 4); g.stroke(); } });
  const pl = new THREE.PlaneGeometry(1.4, 2.8).translate(0, 1.4, 0); const pl2 = pl.clone().rotateY(Math.PI / 2);
  const geo = (await_ => { const a = pl.toNonIndexed(), b = pl2.toNonIndexed(); const pos = new Float32Array(a.attributes.position.array.length * 2), uv = new Float32Array(a.attributes.uv.array.length * 2), nm = new Float32Array(pos.length);
    pos.set(a.attributes.position.array); pos.set(b.attributes.position.array, a.attributes.position.array.length); uv.set(a.attributes.uv.array); uv.set(b.attributes.uv.array, a.attributes.uv.array.length); for (let i = 0; i < nm.length; i += 3) nm[i + 1] = 1;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('normal', new THREE.BufferAttribute(nm, 3)); return g; })();
  const r = rnd(seed); const pts = []; for (let x = x0; x < x1; x += step) for (let z = z0; z < z1; z += step * 1.1) pts.push([x + (r() - 0.5) * 0.4, z + (r() - 0.5) * 0.3]);
  const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 }), pts.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  pts.forEach(([x, z], i) => { q.setFromEuler(new THREE.Euler((r() - 0.5) * 0.08, r() * 6.28, (r() - 0.5) * 0.08)); s.set(1, 0.85 + r() * 0.3, 1); p.set(x, 0, z); m.compose(p, q, s); im.setMatrixAt(i, m); c.setHSL(0.11 + (r() - 0.5) * 0.02, 0.5, 0.75 + r() * 0.2); im.setColorAt(i, c); });
  im.receiveShadow = true; G.add(im); return im;
}
function pumpkin(r = 0.3, seed = 1) { const g = new THREE.SphereGeometry(r, 24, 14); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(z, x); const k = 1 - 0.07 * Math.pow(Math.abs(Math.cos(a * 4)), 0.5); p.setXYZ(i, x * k, y * 0.75, z * k); } g.computeVertexNormals();
  const G = new THREE.Group(); const b = new THREE.Mesh(g, std('#e2731c', { roughness: 0.55 })); b.position.y = r * 0.75; G.add(b); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.12, 6), std('#5a6a2a')); st.position.y = r * 1.5; st.rotation.z = 0.3 * (seed % 2 ? 1 : -1); G.add(st); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// bảng điểm sơn tay trên ván trắng: set({home,away,q,clock})
function paintedBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 0.25), [std('#e8e0cf'), std('#e8e0cf'), std('#e8e0cf'), std('#e8e0cf'), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), std('#e8e0cf')]); G.add(face);
  let last = '';
  const set = (s) => { const k = JSON.stringify(s); if (k === last) return; last = k; const g = cv.getContext('2d');
    g.fillStyle = '#efe7d4'; g.fillRect(0, 0, 1024, 512); g.fillStyle = 'rgba(0,0,0,0.08)'; for (let y = 0; y < 512; y += 64) g.fillRect(0, y, 1024, 4);
    g.strokeStyle = BARN.red; g.lineWidth = 18; g.strokeRect(14, 14, 996, 484); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = GB.green; g.font = '900 70px Anton, Impact, sans-serif'; g.fillText('PACKERS', 270, 92); g.fillStyle = '#8a5a2e'; g.fillText('CUTOUTS', 754, 92);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = GB.green; g.fillText(String(s.home), 270, 290); g.fillStyle = '#8a5a2e'; g.fillText(String(s.away), 754, 290);
    g.fillStyle = BARN.red; g.font = '900 54px Anton, Impact, sans-serif'; g.fillText(`QTR ${s.q ?? 1}`, 270, 450); g.fillText(s.clock ?? '15:00', 754, 450); tex.needsUpdate = true; };
  set({ home: 0, away: 0 }); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return { G, set };
}
// chòi bình luận trên xe rơm: sàn gỗ + bánh + vách sau sơn chữ + bàn + 2 mic; hướng +z
function wagon() {
  const G = new THREE.Group(); const wood = std('#fff', { map: plank('#8b6a45', 11) });
  const bed = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.2, 3.0), wood); bed.position.y = 0.9; G.add(bed);
  for (const [x, z] of [[-1.8, -1.55], [1.8, -1.55], [-1.8, 1.55], [1.8, 1.55]]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 8, 20), std('#2b2b2b')); w.position.set(x, 0.45, z); G.add(w); const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 10), std('#a8322a')); hub.rotation.x = Math.PI / 2; hub.position.set(x, 0.45, z); G.add(hub); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.6, 0.12), [wood, wood, wood, wood, std('#fff', { map: ctex(512, 256, (g) => { g.fillStyle = '#f0e6cf'; g.fillRect(0, 0, 512, 256); g.fillStyle = BARN.red; g.font = '900 56px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('DAIRYLAND', 256, 100); g.fillStyle = GB.green; g.font = '900 40px Anton, Impact, sans-serif'; g.fillText('SPORTS RADIO', 256, 160); g.fillStyle = BARN.red; g.fillRect(60, 190, 392, 8); }) }), wood]);
  back.position.set(0, 2.3, -1.4); G.add(back);
  for (const x of [-2.5, 2.5]) { const rl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 2.9), wood); rl.position.set(x, 1.5, 0); G.add(rl); }
  const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.8), std('#e9e0cc')); desk.position.set(0, 1.86, 0.55); G.add(desk);
  const front = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 0.06), std('#a8322a')); front.position.set(0, 1.4, 0.95); G.add(front);
  for (const x of [-0.8, 0.8]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), std('#222')); st.position.set(x, 2.04, 0.7); G.add(st); const mic = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#2b2b2b')); mic.position.set(x, 2.2, 0.7); G.add(mic); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

export function buildFarm(scene) {
  scene.background = new THREE.Color('#a9cdee'); scene.fog = new THREE.Fog('#cfd9dc', 160, 900);
  const G = new THREE.Group(); scene.add(G); sky(G);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), std('#7c8a3e', { roughness: 0.97, map: ctex(256, 256, (g) => { g.fillStyle = '#8a9446'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 3000; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(90,80,30,0.2)' : 'rgba(200,190,110,0.18)'; g.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); } }, [200, 200]) }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; ground.receiveShadow = true; G.add(ground);
  // đồi xa
  const r = rnd(41); for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2; const d = 420 + r() * 200; const h = new THREE.Mesh(new THREE.SphereGeometry(80 + r() * 90, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(r() < 0.5 ? '#8a8a45' : '#a07a3e', { roughness: 1 })); h.scale.y = 0.25 + r() * 0.15; h.position.set(Math.cos(a) * d, -2, Math.sin(a) * d); G.add(h); }
  // sân cỏ thu: end zone trái xanh GREEN BAY, phải nâu bìa CUTOUTS
  const ft = fieldTexture({ g1: '#5e8a34', g2: '#689537', endLeft: GB.green, endLeftText: 'GREEN BAY', endLeftStroke: GB.gold, endRight: '#a87c4c', endRightText: 'CUTOUTS', endRightFg: '#f4efe2' });
  { const cv = ft.userData.cv; const g = cv.getContext('2d'); const W = cv.width, H = cv.height; const rr = rnd(12);
    for (let i = 0; i < 220; i++) { const x = rr() * W, y = rr() * H, s = 6 + rr() * 30; const gr = g.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, 'rgba(176,140,70,0.45)'); gr.addColorStop(1, 'rgba(176,140,70,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); }
    for (let i = 0; i < 900; i++) { g.fillStyle = ['#c2541c', '#d98a1f', '#a8321e', '#e0b13a'][i % 4]; g.globalAlpha = 0.7; g.beginPath(); g.ellipse(rr() * W, rr() * H, 5, 3, rr() * 3, 0, 7); g.fill(); } g.globalAlpha = 1; ft.needsUpdate = true; }
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.92 })); field.rotation.x = -Math.PI / 2; field.position.y = 0.005; field.receiveShadow = true; G.add(field);
  // hàng rào gỗ chẻ quanh sân
  const railM = std('#8a7356', { roughness: 0.95 }); const fz = FW / 2 + 3.5, fx = FL / 2 + 6;
  const rail = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0); const ang = -Math.atan2(z1 - z0, x1 - x0); const n = Math.ceil(L / 3);
    for (let i = 0; i <= n; i++) { const k = i / n; const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.3, 0.16), railM); p.position.set(x0 + (x1 - x0) * k, 0.65, z0 + (z1 - z0) * k); p.castShadow = true; G.add(p); }
    for (const y of [0.55, 1.05]) { const b = new THREE.Mesh(new THREE.BoxGeometry(L, 0.1, 0.1), railM); b.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); b.rotation.y = ang; b.castShadow = true; G.add(b); } };
  rail(-fx, -fz, fx, -fz); rail(-fx, fz, fx, fz); rail(fx, -fz, fx, fz); rail(-fx, -fz, -fx, -6); rail(-fx, 6, -fx, fz);
  // khán đài kiện rơm biên −z: 4 bậc, x −34..34
  const ST = { z0: -(FW / 2 + 5.2), x0: -34, x1: 34, step: 0.62, rise: 0.45 }; const bl = [];
  for (let row = 0; row < 4; row++) for (let h = 0; h <= row; h++) for (let x = ST.x0; x <= ST.x1; x += 1.24) bl.push([x + (row % 2) * 0.3, h * 0.45, ST.z0 - row * ST.step, 0]);
  bales(G, bl, 3);
  // ruộng ngô biên +z và cuối phải
  cornfield(G, -110, 120, FW / 2 + 7, FW / 2 + 70, 0.95, 5); cornfield(G, FL / 2 + 12, FL / 2 + 70, -FW / 2 - 2, FW / 2 + 7, 0.95, 6);
  // kho thóc + si-lô + bảng điểm trên hồi
  const BN = barn(); BN.G.position.set(BARN.x, 0, 0); G.add(BN.G);
  for (const [z, h] of [[-15.5, 18], [-22.5, 15]]) { const s = silo(h, 3); s.position.set(BARN.x - 3, 0, z); G.add(s); }
  const SB = paintedBoard(); SB.G.position.set(BARN.x + BN.faceX + 0.2, BN.gableY + 0.2, 0); SB.G.rotation.y = Math.PI / 2; G.add(SB.G);
  // nhà trại trắng + vài cây phong
  { const h = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 9), std('#f2efe8')); b.position.y = 3; h.add(b); const rs = new THREE.Shape(); rs.moveTo(-5, 0); rs.lineTo(0, 3.4); rs.lineTo(5, 0); rs.lineTo(-5, 0); const rg = new THREE.ExtrudeGeometry(rs, { depth: 12.6, bevelEnabled: false }); rg.translate(0, 0, -6.3); rg.rotateY(Math.PI / 2); const rf = new THREE.Mesh(rg, std('#3b3f45')); rf.position.y = 6; h.add(rf);
    h.traverse((o) => { if (o.isMesh) o.castShadow = true; }); h.position.set(BARN.x - 10, 0, -48); h.rotation.y = 0.3; G.add(h); }
  const tsp = []; for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = 140 + r() * 220; tsp.push([Math.cos(a) * d * 1.3, Math.sin(a) * d, 1 + r() * 0.8]); }
  for (let i = 0; i < 14; i++) tsp.push([-90 + i * 13 + r() * 4, -(FW / 2 + 22 + r() * 10), 0.9 + r() * 0.5]);
  for (let i = 0; i < 6; i++) tsp.push([BARN.x - 18 - r() * 20, -30 + i * 14, 1 + r() * 0.4]);
  maples(G, tsp, 6);
  // bí ngô dọc rào + rơm tròn
  for (let i = 0; i < 40; i++) { const p = pumpkin(0.22 + r() * 0.2, i); const side = i % 3; p.position.set(side === 2 ? BARN.x + 14 + r() * 3 : -fx + 4 + r() * (2 * fx - 8), 0, side === 0 ? -fz + 0.6 : side === 1 ? -(FW / 2 + 9) : (r() < 0.5 ? -1 : 1) * (11 + r() * 5)); p.rotation.y = r() * 6; G.add(p); }
  for (const [x, z] of [[BARN.x + 16, 13], [BARN.x + 18, 15.5], [BARN.x + 15, -13], [-fx - 4, fz + 2], [fx + 3, -fz - 3], [-40, -(FW / 2 + 10)]]) { const b = roundBale(); b.position.set(x, 0.8, z); b.rotation.z = r() * 0.5; G.add(b); }
  // chòi bình luận (xe rơm) ở góc trái biên −z
  const WG = wagon(); WG.position.set(-42, 0, -(FW / 2 + 7)); G.add(WG);
  // cờ gió ở góc sân (đỏ) — dùng cho cảnh gió
  const flagT = ctex(64, 32, (g) => { g.fillStyle = BARN.red; g.fillRect(0, 0, 64, 32); g.fillStyle = '#fff'; g.fillRect(0, 13, 64, 6); });
  const flags = []; for (const [x, z] of [[fx - 1, -fz + 0.5], [fx - 1, fz - 0.5], [-fx + 1, -fz + 0.5]]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 6), std('#ddd')); pole.position.set(x, 2, z); G.add(pole);
    const fg = new THREE.PlaneGeometry(1.4, 0.7, 10, 1).translate(0.7, 0, 0); const f = new THREE.Mesh(fg, std('#fff', { map: flagT, side: THREE.DoubleSide })); f.position.set(x, 3.6, z); G.add(f); flags.push(f); }
  const flagBase = flags.map((f) => f.geometry.attributes.position.array.slice());
  return { G, board: SB, barn: BN, wagon: WG, stands: ST,
    update(t, o = {}) { const wind = o.wind ?? 0.2; flags.forEach((f, k) => { const a = f.geometry.attributes.position; const b0 = flagBase[k]; for (let i = 0; i < a.count; i++) { const x = b0[i * 3]; a.array[i * 3 + 2] = Math.sin(x * 3 - t * (6 + wind * 10) + k) * 0.12 * (x / 1.4) * (0.5 + wind); } a.needsUpdate = true; f.rotation.y = -wind * 0.6; }); } };
}
export function farmLights(scene) {
  const hemi = new THREE.HemisphereLight('#dbe8ff', '#6b5a32', 1.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffd9a0', 3.3); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#a9c4ff', 0.7); fill.position.set(-30, 20, 30); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 10, z = cam.position.z + d.z * 10; key.target.position.set(x, 0, z); key.position.set(x + 45, 32, z + 28); };
  return { hemi, key, fill, follow };
}

// ---------- hình nộm bìa cứng (vẽ tay hư cấu: hậu vệ áo trắng số navy, mũ navy sọc trắng, KHÔNG logo) ----------
// Cao ~1,95 m, rộng ~1,05 m; mặt trước +z. Có chân chống sau. update(t,{wob}) ; tag(): bật nhãn giá.
export function makeCutout(o = {}) {
  const P = Object.assign({ number: 50, seed: 1, skin: '#e3b48c', tag: true }, o);
  const r = rnd(P.seed * 7 + 3); const W = 512, H = 1024;
  const pose = { la: -0.5 - r() * 0.5, ra: 0.5 + r() * 0.5, lean: (r() - 0.5) * 0.08, legs: 70 + r() * 30 };
  const figure = (g, mode) => { // mode 'sil' = viền bìa ; 'art' = hình vẽ
    const S = mode === 'sil'; g.lineJoin = 'round'; g.lineCap = 'round';
    g.save(); g.translate(256, 0); g.rotate(pose.lean); g.translate(-256, 0);
    const out = (path, fill) => { if (S) { g.strokeStyle = '#c49a64'; g.lineWidth = 46; g.stroke(path); g.fillStyle = '#c49a64'; g.fill(path); } else { g.fillStyle = fill; g.fill(path); g.strokeStyle = '#1b1b24'; g.lineWidth = 7; g.stroke(path); } };
    // chân
    for (const sg of [-1, 1]) { const p = new Path2D(); const hx = 256 + sg * 40, fx = 256 + sg * pose.legs; p.moveTo(hx - 34, 600); p.lineTo(hx + 34, 600); p.lineTo(fx + 30, 950); p.lineTo(fx - 30, 950); p.closePath(); out(p, '#d7d9de');
      const sk = new Path2D(); sk.moveTo(fx - 28, 840); sk.lineTo(fx + 28, 840); sk.lineTo(fx + 30, 950); sk.lineTo(fx - 30, 950); sk.closePath(); out(sk, '#1d2a52');
      const sh = new Path2D(); sh.ellipse(fx + sg * 10, 968, 48, 24, 0, 0, 7); out(sh, '#16161a'); }
    // tay
    for (const [sg, a] of [[-1, pose.la], [1, pose.ra]]) { const sx = 256 + sg * 118, sy = 300; const ex = sx + Math.sin(a) * 200, ey = sy + Math.cos(a) * 200 * 0.95;
      const p = new Path2D(); const nx = Math.cos(a) * 36, ny = -Math.sin(a) * 36; p.moveTo(sx - nx, sy - ny); p.lineTo(sx + nx, sy + ny); p.lineTo(ex + nx * 0.8, ey + ny * 0.8); p.lineTo(ex - nx * 0.8, ey - ny * 0.8); p.closePath(); out(p, '#f4f4f2');
      const h = new Path2D(); h.arc(ex, ey + 14, 32, 0, 7); out(h, P.skin); }
    // thân áo + quần
    const t = new Path2D(); t.moveTo(120, 270); t.quadraticCurveTo(256, 230, 392, 270); t.lineTo(360, 610); t.lineTo(152, 610); t.closePath(); out(t, '#f7f7f5');
    const pt = new Path2D(); pt.moveTo(156, 560); pt.lineTo(356, 560); pt.lineTo(350, 640); pt.lineTo(162, 640); pt.closePath(); out(pt, '#d7d9de');
    // mũ bảo hiểm
    const hm = new Path2D(); hm.arc(256, 168, 96, Math.PI * 0.95, Math.PI * 2.05); hm.lineTo(352, 236); hm.lineTo(160, 236); hm.closePath(); out(hm, '#1d2a52');
    if (!S) {
      g.strokeStyle = '#1d2a52'; g.lineWidth = 6; g.beginPath(); g.moveTo(120, 300); g.lineTo(152, 610); g.moveTo(392, 300); g.lineTo(360, 610); g.stroke();
      g.fillStyle = '#1d2a52'; g.font = '900 170px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(P.number), 256, 430);
      g.strokeStyle = '#ffffff'; g.lineWidth = 14; g.beginPath(); g.moveTo(256, 74); g.lineTo(256, 160); g.stroke();
      // mặt: khung mặt + mắt chấm vô hồn + miệng gạch
      g.fillStyle = P.skin; g.beginPath(); g.ellipse(276, 196, 58, 46, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1b24'; g.lineWidth = 5; g.stroke();
      g.fillStyle = '#111'; g.beginPath(); g.arc(258, 188, 7, 0, 7); g.arc(296, 188, 7, 0, 7); g.fill(); g.lineWidth = 5; g.beginPath(); g.moveTo(262, 220); g.lineTo(294, 220); g.stroke();
      g.strokeStyle = '#9aa0a8'; g.lineWidth = 7; g.beginPath(); g.moveTo(230, 176); g.lineTo(332, 176); g.moveTo(236, 206); g.lineTo(330, 206); g.moveTo(244, 232); g.lineTo(324, 232); g.moveTo(330, 170); g.lineTo(330, 236); g.stroke();
      // nét bút dạ tay hơi lem
      g.globalAlpha = 0.18; g.strokeStyle = '#1b1b24'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { g.beginPath(); const x = 140 + r() * 230, y = 280 + r() * 320; g.moveTo(x, y); g.lineTo(x + 20, y + 4); g.stroke(); } g.globalAlpha = 1; }
    g.restore(); };
  const front = ctex(W, H, (g) => { g.clearRect(0, 0, W, H); figure(g, 'sil'); figure(g, 'art'); });
  const back = ctex(W, H, (g) => { g.clearRect(0, 0, W, H); figure(g, 'sil'); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#b8884f'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(80,50,20,0.18)'; for (let y = 0; y < H; y += 14) g.fillRect(0, y, W, 4);
    g.fillStyle = 'rgba(60,35,15,0.75)'; g.font = '900 44px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.save(); g.translate(256, 470); g.rotate(-0.08); g.fillText('THIS SIDE UP ↑', 0, 0); g.font = '900 30px Anton, Impact, sans-serif'; g.fillText('FRAGILE · DO NOT TACKLE', 0, 50); g.restore(); });
  back.wrapS = THREE.RepeatWrapping; back.repeat.x = -1;
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const h = 1.95, w = h * W / H; const geo = new THREE.PlaneGeometry(w, h).translate(0, h / 2, 0);
  const fm = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: front, alphaTest: 0.5, roughness: 0.8 })); fm.position.z = 0.004; body.add(fm);
  const bm = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: back, alphaTest: 0.5, roughness: 0.95 })); bm.rotation.y = Math.PI; bm.position.z = -0.004; body.add(bm);
  const dep = new THREE.MeshDepthMaterial({ map: front, alphaTest: 0.5 }); fm.customDepthMaterial = dep; bm.customDepthMaterial = new THREE.MeshDepthMaterial({ map: back, alphaTest: 0.5 });
  // chân chống tam giác phía sau
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0, 1.0); sh.lineTo(0.5, 0); sh.lineTo(0, 0);
  const kick = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.008, bevelEnabled: false }), std('#b08048')); kick.rotation.y = Math.PI / 2; kick.position.set(-0.004, 0, -0.004); body.add(kick);
  // nhãn giá cam
  const tag = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), new THREE.MeshBasicMaterial({ map: ctex(128, 128, (g) => { g.fillStyle = '#ff7a1a'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '900 40px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$4.99', 64, 68); }) }));
  tag.position.set(w * 0.2, h * 0.72, 0.012); tag.rotation.z = -0.2; tag.visible = P.tag; body.add(tag);
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
  const update = (t, s = {}) => { const wb = s.wob ?? 0.012; body.rotation.z = wb * Math.sin(t * 2.3 + P.seed); body.rotation.x = -(s.tip || 0) + wb * 0.5 * Math.sin(t * 1.7 + P.seed * 2); };
  return { root, body, update, w, h };
}

// ---------- bò sữa hoạt hình (lông trắng đốm đen, mõm hồng, chuông cổ) ----------
// Gốc ở mặt đất, mặt hướng +z. update(t,{lie:0..1 (1 nằm), walk:pha|null, look:[x,y], blink, chew, head:[yaw,pitch], sad})
export function makeCow(o = {}) {
  const P = Object.assign({ seed: 1, spots: '#1e1b1a', base: '#f6f3ee', scale: 1 }, o); const r = rnd(P.seed * 11 + 5);
  const hide = ctex(256, 128, (g) => { g.fillStyle = P.base; g.fillRect(0, 0, 256, 128); g.fillStyle = P.spots; for (let i = 0; i < 7; i++) { const x = r() * 256, y = r() * 128; g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * 6.28; const rr = 14 + r() * 16; g.lineTo(x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr); } g.closePath(); g.fill(); } });
  const hm = std('#fff', { map: hide, roughness: 0.75 }), wm = std(P.base, { roughness: 0.75 }), pink = std('#f2a7a8', { roughness: 0.6 }), dark = std('#2a2422');
  const root = new THREE.Group(); root.scale.setScalar(P.scale); const body = new THREE.Group(); root.add(body);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.95, 8, 18), hm); torso.rotation.x = Math.PI / 2; torso.scale.set(1, 1, 1.05); body.add(torso);
  const legs = [[-0.24, 0.42], [0.24, 0.42], [-0.24, -0.45], [0.24, -0.45]].map(([x, z]) => { const piv = new THREE.Group(); piv.position.set(x, -0.18, z); body.add(piv); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.66, 10), wm); l.position.y = -0.33; piv.add(l); const hf = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.1, 0.1, 10), dark); hf.position.y = -0.66; piv.add(hf); return piv; });
  const neck = new THREE.Group(); neck.position.set(0, 0.22, 0.78); body.add(neck);
  const head = new THREE.Group(); head.position.set(0, 0.2, 0.15); neck.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), wm); skull.scale.set(0.95, 0.95, 1.05); head.add(skull);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), pink); snout.scale.set(1.2, 0.8, 0.85); snout.position.set(0, -0.16, 0.25); head.add(snout);
  for (const x of [-0.08, 0.08]) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), std('#7a3a3c')); n.position.set(x, -0.13, 0.43); head.add(n); }
  const jaw = new THREE.Group(); jaw.position.set(0, -0.26, 0.2); head.add(jaw); const jm = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), pink); jm.scale.set(1.2, 0.5, 0.8); jaw.add(jm);
  for (const sg of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), wm); e.scale.set(1.6, 0.5, 0.9); e.position.set(sg * 0.34, 0.1, -0.02); e.rotation.z = sg * -0.3; head.add(e);
    const h = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 8), std('#efe3c4')); h.position.set(sg * 0.17, 0.3, -0.04); h.rotation.z = sg * -0.5; head.add(h); }
  const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), std(P.spots)); tuft.scale.set(1.3, 0.6, 1); tuft.position.set(0, 0.27, 0.05); head.add(tuft);
  const eyes = [-1, 1].map((sg) => { const e = new THREE.Group(); e.position.set(sg * 0.13, 0.06, 0.24); head.add(e); const wh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), std('#ffffff', { roughness: 0.3 })); e.add(wh);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std('#111')); pu.position.z = 0.05; e.add(pu); const lid = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), wm); e.add(lid); return { pu, lid }; });
  // chuông cổ
  const col = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 20), std('#8a3a22')); col.rotation.x = Math.PI / 2 - 0.4; col.position.set(0, -0.02, 0.0); neck.add(col);
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.12, 10), std('#d9b54a', { metalness: 0.7, roughness: 0.3 })); bell.position.set(0, -0.2, 0.15); neck.add(bell);
  // đuôi
  const tail = new THREE.Group(); tail.position.set(0, 0.15, -0.88); body.add(tail); const tl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.6, 6), wm); tl.position.y = -0.3; tail.add(tl); const tt = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), std(P.spots)); tt.position.y = -0.62; tail.add(tt); tail.rotation.x = 0.25;
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
  const update = (t, s = {}) => { const sd = P.seed; const lie = s.lie ?? 0; const wk = s.walk;
    const stand = 0.95; body.position.y = lerp(stand, 0.45, lie);
    legs.forEach((l, i) => { const fr = i < 2; const ph = wk != null ? Math.sin(wk * 6.28 + [0, Math.PI, Math.PI, 0][i]) * 0.45 : 0; l.rotation.x = ph * (1 - lie) + lie * (fr ? -1.45 : 1.45); l.scale.y = 1; });
    body.rotation.x = wk != null ? Math.sin(wk * 12.56) * 0.02 : 0; body.position.y += wk != null ? Math.abs(Math.sin(wk * 6.28)) * 0.03 : 0;
    const hd = s.head || [Math.sin(t * 0.5 + sd) * 0.25, 0]; neck.rotation.y = hd[0]; neck.rotation.x = -hd[1] + (s.sad ? 0.35 : 0) + 0.04 * Math.sin(t * 1.2 + sd);
    jaw.rotation.y = (s.chew ?? 1) * 0.25 * Math.sin(t * 5 + sd); jaw.position.x = (s.chew ?? 1) * 0.02 * Math.sin(t * 5 + sd);
    tail.rotation.z = 0.35 * Math.sin(t * 2.4 + sd * 3);
    const lk = s.look || [0, 0]; const bl = s.blink ?? ((t * 0.5 + sd * 0.41) % 3.3 < 0.13 ? 1 : 0);
    eyes.forEach(({ pu, lid }) => { pu.position.x = lk[0] * 0.025; pu.position.y = lk[1] * 0.02; lid.rotation.x = -Math.PI * (0.08 + 0.42 * Math.max(bl, s.squint || 0, s.sad ? 0.35 : 0)); }); };
  const lerp = (a, b, k) => a + (b - a) * k; update(0);
  return { root, body, update };
}
