// Tập 6 — SÂN NFL CHUYÊN NGHIỆP TRONG MƯA LỚN ban chiều (khác E01 mái vòm, E03 sân trường ban đêm):
// sân cỏ sọc thẳng có bùn + vũng nước phản chiếu, end zone đỏ "TAMPA BAY" / pewter "UMBRELLAS", tường đệm quanh sân,
// khán đài bê tông 2 tầng ghế đỏ, khán giả mặc áo mưa nhiều màu (cử động), bảng điện tử lớn, trời xám, mưa xiên + bắn nước.
// Kèm: chiếc ô có điều khiển (mở/gập/lộn ngược/xoay/lắc), phòng phân tích, bàn bình luận trường quay, phòng họp báo.
import * as THREE from 'three';
import { FL, FW, YD, fieldTexture, goalPost, bleachers, scoreboard } from './ngoaitroi.js';
export { FL, FW, YD };

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const BUC = { red: '#d50a0a', pewter: '#34302b', orange: '#ff7900', silver: '#b1babf' };
const ctex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c; return t; };
export { ctex };

function skyGrey() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5d6670'); gr.addColorStop(0.45, '#8a939c'); gr.addColorStop(0.55, '#a5adb4'); gr.addColorStop(1, '#a5adb4'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}

export function buildRainStadium(scene) {
  scene.background = new THREE.Color('#9aa3ac'); scene.fog = new THREE.Fog('#9aa3ac', 45, 300); scene.add(skyGrey());
  const G = new THREE.Group(); scene.add(G);
  const ft = fieldTexture({ plain: true, mud: true, g1: '#2f7a33', g2: '#3a8a3b', endLeft: BUC.red, endLeftText: 'TAMPA BAY', endLeftStroke: BUC.pewter, endRight: BUC.pewter, endRightText: 'UMBRELLAS', endRightFg: '#ffffff' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.38, metalness: 0.05 })); field.rotation.x = -Math.PI / 2; field.receiveShadow = true; G.add(field);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(FL + 14, FW + 14), std('#2c6a30', { roughness: 0.4 })); apron.rotation.x = -Math.PI / 2; apron.position.y = -0.01; apron.receiveShadow = true; G.add(apron);
  // vũng nước: đĩa nhẵn bóng màu trời xám
  const pm = std('#7f8c97', { roughness: 0.04, metalness: 0.55, transparent: true, opacity: 0.85 }); const r = rnd(19); const puddles = [];
  for (let i = 0; i < 60; i++) { const p = new THREE.Mesh(new THREE.CircleGeometry(1, 28), pm); p.rotation.x = -Math.PI / 2; p.scale.set(0.6 + r() * 2.2, 0.4 + r() * 1.4, 1); p.rotation.z = r() * 3;
    p.position.set((r() - 0.5) * (FL - 20), 0.008, (r() - 0.5) * (FW - 6)); p.receiveShadow = true; G.add(p); puddles.push(p); }
  // vũng nước đặt sẵn cho gag (Baker ngã, trọng tài trượt)
  const bigPuddle = (x, z, s) => { const p = new THREE.Mesh(new THREE.CircleGeometry(1, 32), pm); p.rotation.x = -Math.PI / 2; p.scale.set(s * 1.4, s, 1); p.position.set(x, 0.009, z); G.add(p); return p; };
  // tường đệm quanh sân
  const wallTex = ctex(2048, 64, (g, W, H) => { g.fillStyle = BUC.pewter; g.fillRect(0, 0, W, H); g.font = '900 40px Anton, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'center'; for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#ffffff' : BUC.red; g.fillText(k % 2 ? 'TAMPA BAY' : 'RAIN OR SHINE', (k + 0.5) * W / 8, H / 2 + 2); } });
  wallTex.wrapS = THREE.RepeatWrapping;
  for (const [x, z, len, ry] of [[0, -(FW / 2 + 5), FL + 12, 0], [0, FW / 2 + 5, FL + 12, Math.PI], [-(FL / 2 + 6), 0, FW + 10, Math.PI / 2], [FL / 2 + 6, 0, FW + 10, -Math.PI / 2]]) {
    const t = wallTex.clone(); t.needsUpdate = true; t.repeat.set(len / 40, 1); const w = new THREE.Mesh(new THREE.BoxGeometry(len, 1.3, 0.3), [std(BUC.pewter), std(BUC.pewter), std(BUC.pewter), std(BUC.pewter), std('#ffffff', { map: t, roughness: 0.5 }), std(BUC.pewter)]);
    w.position.set(x, 0.65, z); w.rotation.y = ry; w.castShadow = w.receiveShadow = true; G.add(w); }
  const gpL = goalPost(-1), gpR = goalPost(1); gpL.position.x = -FL / 2; gpR.position.x = FL / 2; G.add(gpL, gpR);
  // khán đài bê tông 2 tầng, ghế đỏ; khán giả áo mưa
  const U = { uT: { value: 0 }, uCheer: { value: 0.25 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const crowd = { U, fill: 0.8, seatColor: '#8e1a1f', frameColor: '#8d8f93', shirts: ['#f2f4f6', '#e9eef2', BUC.red, '#ffd23a', '#ff7900', '#2b2f36', '#4a8fd8', '#ffffff', '#cfd6dc', '#d50a0a', '#39b54a'], skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'], pants: ['#2b3a55', '#3b3b3b', '#56627a'], hats: ['#f2f4f6', BUC.red, '#ffd23a', '#2b2f36', '#4a8fd8'] };
  for (const side of [-1, 1]) {
    bleachers(G, side, { ...crowd, seed: 31 + side * 7, rows: 20, len: FL + 8, z0: side * (FW / 2 + 6.2), banner: side < 0 ? 'TAMPA BAY  •  RAIN OR SHINE' : 'HOME OF THE BUCS', bannerBg: BUC.pewter, bannerFg: '#ffffff' });
    bleachers(G, side, { ...crowd, fill: 0.42, seed: 57 + side * 5, rows: 16, len: FL + 8, z0: side * (FW / 2 + 6.2 + 20 * 0.78 + 3.5), y0: 11.5, banner: 'TAMPA BAY', bannerBg: BUC.red, bannerFg: '#ffffff' });
    bleachers(G, side, { ...crowd, fill: 0.45, seed: 77 + side * 3, rows: 18, len: FW + 6, x0: side * (FL / 2 + 7.5), z0: 0, rotY: side < 0 ? -Math.PI / 2 : Math.PI / 2, banner: 'TAMPA BAY', bannerBg: BUC.pewter, bannerFg: BUC.red });
  }
  // bảng điện tử lớn trên khán đài sau end zone trái (-x), nhìn về sân
  const SB = scoreboard(); SB.group.scale.setScalar(1.4); SB.group.position.set(-(FL / 2 + 26), 6, 0); SB.group.rotation.y = Math.PI / 2; G.add(SB.group);
  return { group: G, crowd: U, sbTex: SB.tex, field, bigPuddle, sb: SB.group };
}

export function rainLights(scene) {
  const hemi = new THREE.HemisphereLight('#d7dee6', '#40513e', 2.9); scene.add(hemi);
  const key = new THREE.DirectionalLight('#f1f4f8', 1.7); key.position.set(-20, 40, 18); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 120 }); key.shadow.bias = -0.0004; key.shadow.radius = 6; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#ffffff', 0.9); fill.position.set(18, 20, 30); scene.add(fill);
  const follow = (x, z) => { key.target.position.set(x, 0, z); key.position.set(x - 20, 40, z + 18); };
  return { hemi, key, fill, follow };
}

// ---------- mưa: vệt xiên rơi nhanh quanh máy quay + vòng nước bắn trên mặt đất (hàm thuần của t) ----------
export function rainfall(scene, N = 7000, box = [36, 16, 36]) {
  const g = new THREE.BufferGeometry(); const pos = new Float32Array(N * 6), p0 = new Float32Array(N * 4); const r = rnd(5);
  for (let i = 0; i < N; i++) { p0[i * 4] = (r() - 0.5) * box[0]; p0[i * 4 + 1] = r() * box[1]; p0[i * 4 + 2] = (r() - 0.5) * box[2]; p0[i * 4 + 3] = 0.85 + r() * 0.3; }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: '#e8eef4', transparent: true, opacity: 0.55, depthWrite: false });
  const lines = new THREE.LineSegments(g, mat); lines.frustumCulled = false; scene.add(lines);
  const wind = new THREE.Vector3(2.2, -14, 0.8); const L = 0.045;
  // vòng bắn nước
  const SN = 260; const ring = new THREE.InstancedMesh(new THREE.RingGeometry(0.8, 1, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#e9f0f6', transparent: true, opacity: 0.35, depthWrite: false }), SN); ring.frustumCulled = false; scene.add(ring);
  const sp = new Float32Array(SN * 3); for (let i = 0; i < SN; i++) { sp[i * 3] = (r() - 0.5) * 22; sp[i * 3 + 1] = (r() - 0.5) * 22; sp[i * 3 + 2] = r(); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), tp = new THREE.Vector3();
  const tick = (t, cx = 0, cy = 0, cz = 0) => {
    for (let i = 0; i < N; i++) { const s = p0[i * 4 + 3]; let y = p0[i * 4 + 1] + wind.y * s * t; y = ((y % box[1]) + box[1]) % box[1]; const k = (p0[i * 4 + 1] - y) / (-wind.y * s);
      const x = cx + p0[i * 4] + wind.x * s * k * 0, z = cz + p0[i * 4 + 2]; const yy = cy - 3 + y;
      pos[i * 6] = x; pos[i * 6 + 1] = yy; pos[i * 6 + 2] = z; pos[i * 6 + 3] = x - wind.x * L; pos[i * 6 + 4] = yy - wind.y * L; pos[i * 6 + 5] = z - wind.z * L; }
    g.attributes.position.needsUpdate = true;
    for (let i = 0; i < SN; i++) { const ph = (t * 2.2 + sp[i * 3 + 2]) % 1; tp.set(cx + sp[i * 3], 0.02, cz + sp[i * 3 + 1] + Math.floor(t * 2.2 + sp[i * 3 + 2]) * 0.37 % 3); const s = 0.03 + ph * 0.16; sc.set(s, 1, s); m4.compose(tp, q, sc); ring.setMatrixAt(i, m4); }
    ring.instanceMatrix.needsUpdate = true; };
  const set = (on) => { lines.visible = ring.visible = on; };
  return { lines, ring, tick, set };
}

// ---------- chiếc ô: đứng trên móc cán, tán 8 múi; ctl: open 0..1, invert 0..1 (gió lật ngược thành cái bát), spin, sway, lean, hop ----------
export function makeUmbrella(o = {}) {
  const P = Object.assign({ c1: '#d50a0a', c2: '#ffffff', number: 1, seed: 1, H: 1.95, R: 0.85 }, o);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const shaftM = std('#2b2d31', { metalness: 0.6, roughness: 0.35 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, P.H - 0.25, 8), shaftM); shaft.position.y = 0.25 + (P.H - 0.25) / 2; body.add(shaft);
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 20, Math.PI), std('#4a2f1c', { roughness: 0.5 })); hook.rotation.z = Math.PI; hook.position.set(0.075, 0.25, 0); body.add(hook);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8), std('#4a2f1c', { roughness: 0.5 })); grip.position.y = 0.31; body.add(grip);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 12), shaftM); foot.position.set(0.15, 0.17, 0); body.add(foot);
  // tán: 8 múi × (4 vòng bán kính) tam giác, cập nhật hình mỗi khung
  const NS = 8, NR = 5, SEG = 3; const verts = NS * SEG; const geo = new THREE.BufferGeometry();
  const posA = new Float32Array(NS * SEG * (NR) * 6 * 3); const colA = new Float32Array(posA.length);
  geo.setAttribute('position', new THREE.BufferAttribute(posA, 3)); geo.setAttribute('color', new THREE.BufferAttribute(colA, 3));
  const c1 = new THREE.Color(P.c1).convertSRGBToLinear(), c2 = new THREE.Color(P.c2).convertSRGBToLinear();
  { let k = 0; for (let s = 0; s < NS; s++) for (let q = 0; q < SEG; q++) for (let j = 0; j < NR; j++) for (let v = 0; v < 6; v++) { const c = s % 2 ? c2 : c1; colA.set([c.r, c.g, c.b], k); k += 3; } }
  const canopy = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.35, metalness: 0.05 })); canopy.castShadow = true;
  const top = new THREE.Group(); top.position.y = P.H; body.add(top); top.add(canopy);
  const tipM = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.014, 0.12, 6), shaftM); tipM.position.y = 0.06; top.add(tipM);
  const ribs = Array.from({ length: NS }, () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 5), shaftM); top.add(m); return m; });
  // mác số đeo ở cán
  const nt = ctex(128, 96, (g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.strokeStyle = '#111'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6); g.font = '900 70px Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#111'; g.fillText(String(P.number), W / 2, H / 2 + 4); });
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.12), new THREE.MeshStandardMaterial({ map: nt, side: THREE.DoubleSide, roughness: 0.6 })); tag.position.set(0, 1.05, 0.03); body.add(tag);
  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const shape = (open, inv, t) => {
    const R = P.R * (0.09 + 0.91 * open); const drop = (0.55 - 0.3 * open) * (1 - 2 * inv); // rìa thấp hơn đỉnh (âm khi lộn ngược)
    const pt = (ang, u) => { const rr = R * u; const sag = Math.sin(Math.PI * u) * 0.06 * open * (1 - 2 * inv) + Math.sin(t * 7 + ang * 3 + P.seed) * 0.012 * u * open; return [Math.cos(ang) * rr, -drop * Math.pow(u, 1.3) - sag * 0.0 + sag, Math.sin(ang) * rr]; };
    let k = 0; const da = Math.PI * 2 / NS;
    for (let s = 0; s < NS; s++) for (let q = 0; q < SEG; q++) { const a0 = s * da + q * da / SEG, a1 = a0 + da / SEG;
      for (let j = 0; j < NR; j++) { const u0 = j / NR, u1 = (j + 1) / NR; const b0 = Math.sin(Math.PI * (q / SEG)) , b1 = Math.sin(Math.PI * ((q + 1) / SEG)); // múi phồng giữa
        const A = pt(a0, u0), B = pt(a1, u0), C = pt(a0, u1), D = pt(a1, u1);
        const bulge = (V, b, u) => { V[1] += 0.025 * b * u * open * (inv > 0.5 ? -1 : 1); return V; };
        bulge(A, b0, u0); bulge(B, b1, u0); bulge(C, b0, u1); bulge(D, b1, u1);
        for (const V of [A, C, B, B, C, D]) { posA[k++] = V[0]; posA[k++] = V[1]; posA[k++] = V[2]; } } }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    ribs.forEach((m, i) => { const E = pt(i * da, 1); _a.set(0, 0, 0); _b.set(E[0], E[1], E[2]); const d = _b.clone().sub(_a); m.scale.y = d.length(); m.position.copy(_a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(up, d.normalize()); });
  };
  const sd = P.seed;
  const update = (t, c = {}) => {
    const C = Object.assign({ open: 1, invert: 0, spin: 0, sway: 1, lean: 0, hop: 0, leanX: 0 }, c);
    shape(C.open, C.invert, t);
    top.rotation.y = C.spin + Math.sin(t * 0.8 + sd) * 0.1;
    body.rotation.z = Math.sin(t * 1.9 + sd) * 0.05 * C.sway + C.lean; body.rotation.x = Math.sin(t * 1.4 + sd * 2) * 0.04 * C.sway + C.leanX;
    body.position.y = C.hop; tag.rotation.y = Math.sin(t * 3 + sd) * 0.4;
  };
  update(0);
  const topWorld = () => top.getWorldPosition(new THREE.Vector3());
  return { root, body, top, update, topWorld, P };
}

// ---------- phòng phân tích: tường tối, màn hình lớn (canvas), bàn, ghế, bảng chiến thuật ----------
export function analysisRoom(at = new THREE.Vector3(0, 0, 400)) {
  const G = new THREE.Group(); G.position.copy(at);
  const wall = std('#1e232b', { roughness: 0.9 }); const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), std('#2d3138', { roughness: 0.8 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), wall); back.position.set(0, 2.5, -4); G.add(back);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wall); w.position.set(s * 7, 2.5, 2); w.rotation.y = -s * Math.PI / 2; G.add(w); }
  const scrTex = ctex(1600, 900, (g, W, H) => { g.fillStyle = '#0d1117'; g.fillRect(0, 0, W, H); });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.1, 0.12), std('#0b0c0f', { roughness: 0.4 })); frame.position.set(0, 2.25, -3.9); G.add(frame);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.92), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false })); scr.position.set(0, 2.25, -3.83); G.add(scr);
  const glow = new THREE.PointLight('#9fc4ff', 6, 9, 1.6); glow.position.set(0, 2.3, -2.6); G.add(glow);
  // bảng chiến thuật trắng bên phải
  const wb = ctex(512, 384, (g, W, H) => { g.fillStyle = '#f4f5f2'; g.fillRect(0, 0, W, H); g.strokeStyle = '#1f3d8a'; g.lineWidth = 5; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(90 + i * 80, 280, 18, 0, 7); g.stroke(); }
    g.strokeStyle = '#c0261d'; for (let i = 0; i < 4; i++) { const x = 110 + i * 90; g.beginPath(); g.moveTo(x - 14, 120 - 14); g.lineTo(x + 14, 120 + 14); g.moveTo(x + 14, 120 - 14); g.lineTo(x - 14, 120 + 14); g.stroke(); }
    g.strokeStyle = '#1f3d8a'; g.beginPath(); g.moveTo(250, 270); g.quadraticCurveTo(330, 160, 420, 70); g.stroke(); });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.35), new THREE.MeshStandardMaterial({ map: wb, roughness: 0.5 })); board.position.set(4.3, 1.8, -3.9); G.add(board);
  const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 1.0), std('#3b3f47', { roughness: 0.5 })); table.position.set(0, 0.74, 0.2); table.castShadow = table.receiveShadow = true; G.add(table);
  for (const s of [-1.8, 1.8]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.9), std('#2a2d33')); l.position.set(s, 0.37, 0.2); G.add(l); }
  const chairs = []; for (let i = 0; i < 6; i++) { const c = new THREE.Group(); const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), std('#141518')); seat.position.y = 0.48; c.add(seat);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.07), std('#141518')); bk.position.set(0, 0.82, 0.24); c.add(bk); const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.46, 6), std('#555')); leg.position.y = 0.23; c.add(leg);
    c.position.set(-2.5 + i * 1.0, 0, 1.6 + (i % 2) * 0.2); G.add(c); chairs.push(c); }
  // laptop + ly nước trên bàn
  const lap = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.28), std('#a9adb3', { metalness: 0.7, roughness: 0.3 })); lap.position.set(-0.8, 0.79, 0.25); G.add(lap);
  G.traverse((o) => { if (o.isMesh) o.receiveShadow = true; });
  return { group: G, scrTex, chairs };
}

// ---------- bàn bình luận trường quay: nền màn LED xanh–đỏ, bàn cong, màn hình lớn sau lưng ----------
export function studioDesk(at = new THREE.Vector3(60, 0, 400), o = {}) {
  const G = new THREE.Group(); G.position.copy(at);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(9, 48), std('#14181f', { roughness: 0.25, metalness: 0.3 })); floor.rotation.x = -Math.PI / 2; G.add(floor);
  const bgTex = ctex(2048, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#0b2d6b'); gr.addColorStop(0.5, '#123f8c'); gr.addColorStop(1, '#7a0f14'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 3; for (let x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 120, H); g.stroke(); } });
  const bg = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 6, 48, 1, true, Math.PI * 0.75, Math.PI * 0.5), new THREE.MeshBasicMaterial({ map: bgTex, side: THREE.BackSide, toneMapped: false })); bg.position.y = 3; G.add(bg);
  const scrTex = ctex(1600, 900, (g, W, H) => { g.fillStyle = '#0d1117'; g.fillRect(0, 0, W, H); });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.7), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false })); scr.position.set(0, 2.6, -5.2); G.add(scr);
  const deskM = std('#e9edf2', { roughness: 0.25, metalness: 0.15 }); const desk = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.95, 40, 1, false, -Math.PI * 0.2, Math.PI * 0.4), deskM); desk.position.set(0, 0.47, -4.1); desk.castShadow = true; G.add(desk);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.75, 2.75, 0.05, 40, 1, false, -Math.PI * 0.22, Math.PI * 0.44), std('#20252e', { roughness: 0.3 })); top.position.set(0, 0.97, -4.1); G.add(top);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(2.61, 2.61, 0.12, 40, 1, true, -Math.PI * 0.2, Math.PI * 0.4), new THREE.MeshBasicMaterial({ color: o.stripe || '#d50a0a', toneMapped: false })); stripe.position.set(0, 0.6, -4.1); G.add(stripe);
  const key = new THREE.PointLight('#ffffff', 10, 12, 1.5); key.position.set(0, 4, 3); G.add(key);
  return { group: G, scrTex };
}

// ---------- phòng họp báo (đỏ–đen, chữ ATLANTA, không logo): phông chữ lặp, bàn dài có micro, đèn flash ----------
export function pressRoom(at = new THREE.Vector3(-60, 0, 400), o = {}) { const TEAM = o.team || 'ATLANTA', C1 = o.c1 || '#a71930';
  const G = new THREE.Group(); G.position.copy(at);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), std('#1a1a1c', { roughness: 0.8 })); floor.rotation.x = -Math.PI / 2; G.add(floor);
  const bt = ctex(1024, 512, (g, W, H) => { g.fillStyle = '#111214'; g.fillRect(0, 0, W, H); g.font = '900 54px Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? C1 : '#e8e8e8'; g.fillText((x + y) % 2 ? TEAM : (o.sub || 'SIGNING DAY'), 140 + x * 250 + (y % 2) * 60, 60 + y * 100); } });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshStandardMaterial({ map: bt, roughness: 0.8 })); back.position.set(0, 2.5, -3.5); G.add(back);
  const table = new THREE.Mesh(new THREE.BoxGeometry(7, 0.08, 1.1), std('#0f0f11', { roughness: 0.4 })); table.position.set(0, 0.76, -1.6); table.castShadow = true; G.add(table);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(7, 0.74, 0.04), std(C1, { roughness: 0.7 })); skirt.position.set(0, 0.38, -1.06); G.add(skirt);
  const micM = std('#202022', { metalness: 0.5 }); for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6), micM); m.position.set(-2.4 + i * 1.2, 0.95, -1.35); m.rotation.x = -0.4; G.add(m); }
  const flash = new THREE.PointLight('#ffffff', 0, 18, 1.2); flash.position.set(0, 2.5, 4); G.add(flash);
  const key = new THREE.PointLight('#fff2e2', 8, 14, 1.4); key.position.set(0, 4, 2); G.add(key);
  return { group: G, flash };
}
