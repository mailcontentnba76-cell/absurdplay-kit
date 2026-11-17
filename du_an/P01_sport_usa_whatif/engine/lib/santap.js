// Tập 20 (NFL) — "The Ravens just lost to a tackling dummy?"
// Bối cảnh MỚI: SÂN TẬP ngoài trời hư cấu lúc HOÀNG HÔN (không phải sân thi đấu, không khán đài): cỏ cắt sọc, vạch yard không số,
// cột gôn "ná" vàng một trụ, hàng rào cây xanh, rặng thông, nhà kho gạch đỏ có cửa cuốn, 4 cột đèn pha (tắt được — gag "Darkness Falls"),
// xe trượt chặn bóng tím, cọc tiêu cam, ghế dài nhôm, bảng điểm tập nhỏ. Không tên đội, không logo.
// Nhân vật phụ: HÌNH NỘM TẬP TACKLE (makeDummy) màu xanh powder số vàng, mắt vẽ mở/nhắm, di chuyển bằng NHẢY LÒ CÒ (hopPos).
import * as THREE from 'three';
export const YD = 0.9144;
export const GL = 30;                // vạch vôi khung thành (end zone ở x > GL)
export const EL = GL + 10 * YD;      // vạch cuối
export const FZ = 24;                // nửa bề rộng sân
export const BENCH = { x: -2, z: -FZ - 3.2 };
export const BOARD = { x: EL + 6, z: 14 };
export const LAC = { powder: '#6fb6ee', gold: '#ffc61e', navy: '#1b3d6e' };
export const BAL = { black: '#1e1d24', purple: '#7a4cc4', gold: '#c9a23a' };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
// mặt sân tập: từ x=-48 tới EL, rộng 2·FZ. Sọc cắt cỏ 5 yard, vạch 5 yard, vạch hash, end zone cỏ sẫm viền trắng. KHÔNG số, không chữ.
const X0 = -48, X1 = EL;
function fieldTex() {
  const Lm = X1 - X0, Wm = 2 * FZ, px = 40;
  return ctex(Math.round(Lm * px), Math.round(Wm * px), (g, W, H) => {
    const xs = (x) => (x - X0) * px;
    for (let x = GL, i = 0; x > X0 - 5; x -= 5 * YD, i++) { g.fillStyle = i % 2 ? '#4f9a43' : '#5aa84b'; g.fillRect(xs(x - 5 * YD), 0, 5 * YD * px + 1, H); }
    g.fillStyle = '#4a8f40'; g.fillRect(xs(GL), 0, xs(EL) - xs(GL), H);
    const r = rnd(5); for (let k = 0; k < 90000; k++) { g.fillStyle = r() < 0.5 ? 'rgba(20,60,20,0.07)' : 'rgba(190,240,150,0.06)'; g.fillRect(r() * W, r() * H, 2, 2); }
    // mảng cỏ mòn nâu nhạt quanh khu tập
    for (let k = 0; k < 18; k++) { const x = xs(-30 + r() * 55), y = H * (0.3 + r() * 0.4), rr = px * (1 + r() * 2.5); const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(150,140,90,0.35)'); gr.addColorStop(1, 'rgba(150,140,90,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rr * 1.5, rr, 0, 0, 7); g.fill(); }
    g.fillStyle = '#f6f6f0'; const lw = px * 0.12;
    g.fillRect(0, 0, W, lw * 1.5); g.fillRect(0, H - lw * 1.5, W, lw * 1.5); g.fillRect(xs(EL) - lw * 1.5, 0, lw * 1.5, H);
    g.fillRect(xs(GL) - lw, 0, lw * 2, H);
    for (let x = GL - 5 * YD; x > X0; x -= 5 * YD) g.fillRect(xs(x) - lw / 2, 0, lw, H);
    for (let x = GL - YD, i = 1; x > X0; x -= YD, i++) { if (i % 5 === 0) continue; for (const yy of [0.04, 0.42, 0.58, 0.96]) g.fillRect(xs(x) - lw / 2, H * yy - px * 0.3, lw, px * 0.6); }
  });
}
function skyDome() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#34539e'); gr.addColorStop(0.3, '#5d79c2'); gr.addColorStop(0.42, '#a58ccb'); gr.addColorStop(0.48, '#f2a98a'); gr.addColorStop(0.505, '#ffd09a'); gr.addColorStop(0.53, '#8c7c88'); gr.addColorStop(1, '#4a4a58');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}
function trees(G) {
  const r = rnd(11); const n = 150; const cone = new THREE.ConeGeometry(2.6, 9, 8); cone.translate(0, 6.5, 0); const trunk = new THREE.CylinderGeometry(0.35, 0.45, 2.4, 6); trunk.translate(0, 1.2, 0);
  const mc = new THREE.InstancedMesh(cone, std('#2f5a3a', { roughness: 0.9 }), n), mt = new THREE.InstancedMesh(trunk, std('#5a4030'), n); const d = new THREE.Object3D();
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, R = 85 + r() * 40; d.position.set(Math.cos(a) * R * 1.1 - 5, 0, Math.sin(a) * R * 0.8); const s = 0.8 + r() * 0.7; d.scale.set(s, s * (0.9 + r() * 0.4), s); d.rotation.y = r() * 6; d.updateMatrix(); mc.setMatrixAt(i, d.matrix); mt.setMatrixAt(i, d.matrix); }
  G.add(mc); G.add(mt);
}
function hedge(G, x0, x1, z, h = 1.5) { const m = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x1 - x0), h, 1.4), std('#3d6e3a', { roughness: 1 })); m.position.set((x0 + x1) / 2, h / 2, z); m.castShadow = true; m.receiveShadow = true; G.add(m); return m; }
function hedgeZ(G, z0, z1, x, h = 1.5) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, Math.abs(z1 - z0)), std('#3d6e3a', { roughness: 1 })); m.position.set(x, h / 2, (z0 + z1) / 2); m.castShadow = true; m.receiveShadow = true; G.add(m); return m; }
// cột gôn "ná" một trụ cong (vàng)
export function goalpost() {
  const G = new THREE.Group(); const y = std('#ffd23a', { roughness: 0.45, metalness: 0.2 }); const r = 0.1;
  const tube = (a, b, rr = r) => { const d = b.clone().sub(a); const m = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, d.length(), 12), y); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); m.castShadow = true; G.add(m); };
  tube(V(1.8, 0, 0), V(1.8, 2.6, 0), 0.14); tube(V(1.8, 2.6, 0), V(0, 3.05, 0), 0.12); tube(V(0, 3.05, -2.82), V(0, 3.05, 2.82));
  for (const s of [-1, 1]) tube(V(0, 3.05, s * 2.82), V(0, 10, s * 2.82), 0.08);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.0, 0.12), std('#ff7a1a')); f.position.set(0, 10.4, s * 2.82); G.add(f); }
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.2, 14), std(BAL.purple, { roughness: 0.6 })); pad.position.set(1.8, 1.1, 0); pad.castShadow = true; G.add(pad);
  return G;
}
// cột đèn pha: trụ + giàn 3x2 đèn hướng về sân. setOn(k)
function lightPole(face) {
  const G = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 20, 10), std('#8a9098', { metalness: 0.6, roughness: 0.4 })); pole.position.y = 10; pole.castShadow = true; G.add(pole);
  const rack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.3), std('#5a6068', { metalness: 0.5 })); rack.position.set(0, 20.4, 0.3); G.add(rack);
  const lm = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff4d6', emissiveIntensity: 3.2, roughness: 0.3 });
  for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.2), lm); l.position.set(-1.2 + (i % 3) * 1.2, 19.95 + Math.floor(i / 3) * 0.95, 0.5); G.add(l); }
  G.rotation.y = face; G.userData.m = lm; return G;
}
function fieldHouse() {
  const G = new THREE.Group(); const brick = ctex(256, 256, (g) => { g.fillStyle = '#a8563e'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#c9b8a0'; for (let y = 0; y < 256; y += 16) { g.fillRect(0, y, 256, 2); for (let x = (y / 16) % 2 ? 0 : 16; x < 256; x += 32) g.fillRect(x, y, 2, 16); } }, [5, 2]);
  const b = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 9), std('#ffffff', { map: brick, roughness: 0.9 })); b.position.y = 3; b.castShadow = true; b.receiveShadow = true; G.add(b);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.4, 9.6), std('#4a4e56')); roof.position.y = 6.2; G.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 0.1), std('#c4c8cc', { metalness: 0.4, roughness: 0.5 })); door.position.set(-3, 1.8, 4.53); G.add(door);
  const win = new THREE.MeshStandardMaterial({ color: '#ffe0a0', emissive: '#ffcf80', emissiveIntensity: 1.1 });
  for (const x of [2.5, 6]) { const w = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.08), win); w.position.set(x, 3.6, 4.53); G.add(w); }
  return G;
}
// xe trượt chặn bóng 2 đệm
export function sled() {
  const G = new THREE.Group(); const m = std('#9aa0a8', { metalness: 0.6, roughness: 0.4 });
  for (const z of [-0.9, 0.9]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 0.12), m); rail.position.set(0, 0.05, z); G.add(rail); }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.0), m); bar.position.set(0.4, 0.8, 0); G.add(bar);
  for (const z of [-0.6, 0.6]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), m); post.position.set(0.4, 0.45, z); G.add(post);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 0.75), std(BAL.purple, { roughness: 0.6 })); pad.position.set(0.75, 0.95, z); pad.castShadow = true; G.add(pad); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
export function cone() { const m = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.36, 12), std('#ff7a1a', { roughness: 0.6 })); m.position.y = 0.18; m.castShadow = true; const G = new THREE.Group(); G.add(m); return G; }
function bench() {
  const G = new THREE.Group(); const al = std('#c8ccd2', { metalness: 0.7, roughness: 0.35 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.45), al); seat.position.y = 0.46; G.add(seat);
  for (let x = -5.5; x <= 5.5; x += 2.75) for (const z of [-0.18, 0.18]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.06), al); l.position.set(x, 0.23, z); G.add(l); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// bảng điểm tập: draw({l,r,a,b,clock,sub,tint})
function board() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.05), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(0, 6.6, 0.16); G.add(face);
  const box = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.4, 0.3), std('#23262c')); box.position.y = 6.6; G.add(box);
  for (const x of [-2.6, 2.6]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 4.6, 8), std('#6a7078', { metalness: 0.5 })); p.position.set(x, 2.3, 0); G.add(p); }
  G.traverse((o) => { if (o.isMesh && o !== face) o.castShadow = true; });
  let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d');
    g.fillStyle = '#121418'; g.fillRect(0, 0, 1024, 576); g.strokeStyle = '#3a3f48'; g.lineWidth = 10; g.strokeRect(12, 12, 1000, 552);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 64px Anton, Impact, sans-serif';
    g.fillStyle = LAC.powder; g.fillText(o.l ?? 'DUMMIES', 270, 90); g.fillStyle = '#b89cf0'; g.fillText(o.r ?? 'RAVENS', 754, 90);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = '#ffd23a'; g.fillText(String(o.a ?? 0), 270, 290); g.fillText(String(o.b ?? 0), 754, 290);
    g.font = '900 86px Anton, Impact, sans-serif'; g.fillStyle = o.tint || '#ff4a3a'; g.fillText(o.clock ?? '', 512, 470);
    if (o.sub) { g.font = '900 54px Anton, Impact, sans-serif'; g.fillStyle = '#f4f4f4'; g.fillText(o.sub, 512, 300); }
    t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: '15:00' }); return { G, draw };
}
export function buildPractice(scene) {
  scene.background = new THREE.Color('#8a7ac0'); scene.fog = new THREE.Fog('#b49cc0', 110, 420);
  const G = new THREE.Group(); scene.add(G); G.add(skyDome()); trees(G);
  const grass = ctex(128, 128, (g) => { g.fillStyle = '#4e8d40'; g.fillRect(0, 0, 128, 128); const r = rnd(3); for (let i = 0; i < 2500; i++) { g.fillStyle = r() < 0.5 ? 'rgba(20,60,20,0.12)' : 'rgba(180,230,140,0.08)'; g.fillRect(r() * 128, r() * 128, 2, 2); } }, [90, 90]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), std('#ffffff', { map: grass, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.08; ground.receiveShadow = true; G.add(ground);
  const field = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, 2 * FZ), new THREE.MeshStandardMaterial({ map: fieldTex(), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  field.rotation.x = -Math.PI / 2; field.position.set((X0 + X1) / 2, 0.004, 0); field.receiveShadow = true; G.add(field);
  hedge(G, -70, 62, -FZ - 9); hedge(G, -70, 62, FZ + 9); hedgeZ(G, -FZ - 9, FZ + 9, -70); hedgeZ(G, -FZ - 9, -8, 62); hedgeZ(G, 8, FZ + 9, 62);
  const gp = goalpost(); gp.position.set(EL, 0, 0); G.add(gp);
  const poles = [[-26, -FZ - 6, 0], [-26, FZ + 6, Math.PI], [22, -FZ - 6, 0], [22, FZ + 6, Math.PI]].map(([x, z, f]) => { const p = lightPole(f); p.position.set(x, 0, z); G.add(p); return p; });
  const FH = fieldHouse(); FH.position.set(-62, 0, -FZ - 1); FH.rotation.y = Math.PI / 2; G.add(FH);
  const SL = sled(); SL.position.set(-20, 0, 15); SL.rotation.y = -0.3; G.add(SL);
  const r = rnd(9); for (let i = 0; i < 14; i++) { const c = cone(); c.position.set(-40 + i * 4.8 + r() * 1.5, 0, (i % 2 ? 1 : -1) * (FZ - 1.5 - r() * 2)); G.add(c); }
  const BE = bench(); BE.position.set(BENCH.x, 0, BENCH.z); G.add(BE);
  const BO = board(); BO.G.position.set(BOARD.x, 0, BOARD.z); BO.G.rotation.y = -Math.PI / 2 - 0.35; G.add(BO.G);
  return { G, poles, board: BO, sled: SL };
}
export function practiceLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#d0d8ff', '#7a6a60', 3.0); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffc490', 4.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 140 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#b8c4ff', 1.7); fill.position.set(30, 22, 30); scene.add(fill);
  // đặt vùng bóng đổ theo tâm shot (chỉ gọi ở điểm cắt). Nắng thấp từ phía −x (hoàng hôn).
  // nắng chiếu từ phía sau-trái máy quay (cố định trong mỗi shot) để mặt người & áo tối luôn được chiếu sáng
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 26, 22, z - 14); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7).multiplyScalar(26);
    key.position.set(x + d.x, 22, z + d.z); };
  // k: 1 = đèn pha sáng, 0 = tắt (Darkness Falls) — vẫn đủ sáng nhờ trời hoàng hôn
  const lamps = (k) => { P.poles.forEach((p) => { p.userData.m.emissiveIntensity = 0.15 + 3.05 * k; p.userData.m.color.setScalar(0.35 + 0.65 * k); }); hemi.intensity = 2.5 + 0.5 * k; key.intensity = 3.5 + 0.7 * k; fill.intensity = 1.4 + 0.3 * k; };
  area(0, 0); lamps(1);
  return { hemi, key, fill, area, lamps };
}
// ---------- HÌNH NỘM TẬP TACKLE ----------
// Gốc ở đáy, mặt hướng +z. Cao ~1,75 m. update(t,{open,look,blink,squash,tilt,lean,kick,mouth})
export function makeDummy(o = {}) {
  const P = Object.assign({ num: '', color: LAC.powder, numColor: LAC.gold, helmet: false, leg: false, seed: 1, tag: null }, o);
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const tex = ctex(512, 256, (g, W, H) => { g.fillStyle = P.color; g.fillRect(0, 0, W, H);
    for (let k = 0; k < 900; k++) { g.fillStyle = k % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; g.fillRect(Math.random() * W, Math.random() * H, 3, 3); }
    g.fillStyle = 'rgba(20,30,50,0.85)'; g.fillRect(0, H * 0.18, W, H * 0.06); g.fillRect(0, H * 0.78, W, H * 0.06);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${H * 0.42}px Anton, Impact, sans-serif`; g.lineWidth = 10; g.strokeStyle = LAC.navy;
    for (const x of [W * 0.5, 0, W]) { g.strokeText(P.num, x, H * 0.5); g.fillStyle = P.numColor; g.fillText(P.num, x, H * 0.5); } });
  const mat = std('#ffffff', { map: tex, roughness: 0.65 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.12, 24), std('#1c1d22', { roughness: 0.7 })); base.position.y = 0.06; body.add(base);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.31, 1.3, 28, 1, false, Math.PI, Math.PI * 2), mat); trunk.position.y = 0.12 + 0.65; body.add(trunk);
  const plain = std(P.color, { roughness: 0.65 });
  const headY = 1.42 + 0.06;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), plain); head.position.y = 1.42; body.add(head);
  // tay cầm hai bên
  for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 6, 12, Math.PI), std('#1c1d22')); h.position.set(s * 0.3, 1.05, 0); h.rotation.set(0, Math.PI / 2, s > 0 ? -Math.PI / 2 : Math.PI / 2); body.add(h); }
  let helm = null; if (P.helmet) { helm = new THREE.Group(); const sh = new THREE.Mesh(new THREE.SphereGeometry(0.305, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), std(P.color, { roughness: 0.25, metalness: 0.15 })); sh.scale.y = 0.95; helm.add(sh);
    const st = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.018, 6, 24, Math.PI), std(LAC.gold, { roughness: 0.3 })); st.rotation.set(0, Math.PI / 2, 0); st.scale.y = 0.98; helm.add(st); helm.position.y = 1.44; body.add(helm); }
  // mắt (nhìn +z) + mi + mày + miệng
  const face = new THREE.Group(); face.position.set(0, headY - 0.04, 0.24); body.add(face);
  const lidM = std(P.color, { roughness: 0.6 });
  const eyes = [-1, 1].map((s) => { const e = new THREE.Group(); e.position.set(s * 0.1, 0.0, 0.02); face.add(e);
    const wh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), std('#ffffff', { roughness: 0.3 })); wh.scale.z = 0.6; e.add(wh);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), std('#111')); pu.position.z = 0.04; e.add(pu);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), lidM); lid.scale.z = 0.64; e.add(lid);
    const lidB = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidM); lidB.scale.z = 0.64; e.add(lidB);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.022, 0.02), std('#1b2a44')); brow.position.set(0, 0.1, 0.03); e.add(brow); return { pu, lid, lidB, brow }; });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14, Math.PI), std('#1b2a44')); mouth.position.set(0, -0.06, 0.02); mouth.rotation.z = Math.PI; face.add(mouth);
  // nhãn treo (vd "0-8") trên tay cầm phải
  let tag = null; if (P.tag) { const tt = ctex(256, 160, (g, W, H) => { g.fillStyle = '#fff6d8'; g.fillRect(0, 0, W, H); g.strokeStyle = '#c02a2a'; g.lineWidth = 8; g.strokeRect(6, 6, W - 12, H - 12); g.fillStyle = '#c02a2a'; g.font = '900 96px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(P.tag, W / 2, H / 2 + 4); });
    tag = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.21), new THREE.MeshStandardMaterial({ map: tt, side: THREE.DoubleSide, roughness: 0.7 })); tag.position.set(0.18, 1.0, 0.33); tag.rotation.y = 0.2; body.add(tag); }
  // chân lò xo (thợ đá)
  let leg = null; if (P.leg) { leg = new THREE.Group(); leg.position.set(0.16, 0.42, 0.18); body.add(leg); const met = std('#b8bec6', { metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < 7; i++) { const c = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14), met); c.rotation.x = Math.PI / 2; c.position.y = -0.04 - i * 0.045; leg.add(c); }
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.26), std('#f4f4f4', { roughness: 0.5 })); shoe.position.set(0, -0.36, 0.07); leg.add(shoe); }
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
  const sd = P.seed;
  const update = (t, s = {}) => { const open = s.open ?? 1; const sq = s.squash || 0;
    body.scale.set(1 + sq * 0.35, 1 - sq, 1 + sq * 0.35); body.rotation.set(s.tilt || 0, s.turn || 0, s.lean || 0);
    const lk = s.look || [Math.sin(t * 0.7 + sd) * 0.35, 0]; const bl = (t * 0.55 + sd * 0.37) % 3.3 < 0.12 ? 1 : 0; const close = Math.max(1 - open, s.blink ?? bl * open);
    eyes.forEach(({ pu, lid, lidB, brow }, i) => { pu.position.x = lk[0] * 0.03; pu.position.y = lk[1] * 0.028; pu.visible = close < 0.85;
      lid.rotation.x = -1.15 + 2.62 * close; lidB.rotation.x = 1.15 - 2.62 * close;
      brow.rotation.z = (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.1 + (s.browUp || 0) * 0.03; });
    mouth.scale.set(1, s.mouth ?? 1, 1); mouth.rotation.z = (s.smile ?? 1) > 0 ? Math.PI : 0;
    if (leg) leg.rotation.x = -(s.kick || 0);
    if (tag) tag.rotation.z = Math.sin(t * 2.3 + sd) * 0.12; };
  update(0);
  return { root, body, update, head: () => body.localToWorld(V(0, headY, 0)), top: () => body.localToWorld(V(0, 1.72, 0)) };
}
// NHẢY LÒ CÒ: đi từ p0 → p1 bằng các bước nhảy (chỉ tiến khi đang ở trên không — không trượt).
// trả về {x,z,y,squash,face,done}. len = độ dài mỗi bước, dur = thời gian một chu kỳ, h = độ cao.
export function hopPos(t, t0, p0, p1, o = {}) {
  const len = o.len ?? 1.0, dur = o.dur ?? 0.42, h = o.h ?? 0.32, air = 0.72;
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); const n = Math.max(1, Math.round(d / len)); const face = Math.atan2(p1[0] - p0[0], p1[1] - p0[1]);
  const u = (t - t0) / dur; if (u <= 0) return { x: p0[0], z: p0[1], y: 0, squash: 0, face, done: false, k: 0 };
  if (u >= n) { const e = u - n; return { x: p1[0], z: p1[1], y: 0, squash: e < 0.35 ? 0.12 * Math.sin(e / 0.35 * Math.PI) : 0, face, done: true, k: 1 }; }
  const i = Math.floor(u), f = u - i; const ga = (1 - air) / 2; let prog, y = 0, sq = 0;
  if (f < ga) { prog = i; sq = 0.14 * Math.sin(f / ga * Math.PI * 0.5 + Math.PI * 0.5); }
  else if (f > 1 - ga) { prog = i + 1; sq = 0.14 * Math.sin((f - (1 - ga)) / ga * Math.PI * 0.5); }
  else { const a = (f - ga) / air; prog = i + a * a * (3 - 2 * a); y = 4 * h * a * (1 - a); sq = -0.08 * Math.sin(a * Math.PI); }
  const k = prog / n; return { x: p0[0] + (p1[0] - p0[0]) * k, z: p0[1] + (p1[1] - p0[1]) * k, y, squash: sq, face, done: false, k };
}
