// Tập 7 — SÂN BAY (khác hẳn E01–E06): khu băng chuyền hành lý sàn đá mài có kẻ vạch sân bóng bằng băng dính,
// tường kính nhìn ra đường băng (máy bay, ống lồng, xe kéo hành lý, đài kiểm soát), trần đèn dải, cột, bảng giờ bay lật chữ,
// 2 băng chuyền chạy thật, hành khách đứng xem (cử động). Kèm: VALI có mặt (bánh xe, tay kéo, nắp mở như miệng),
// công trường sân vận động (cần cẩu quay, khung thép, giàn giáo, máy xúc), phố London minh hoạ (tháp đồng hồ, xe buýt 2 tầng),
// cổng B12 (bảng FINAL CALL nhấp nháy), phòng chờ hạng thương gia làm bàn bình luận. Không logo thật.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ctex } from './mua.js';
export { ctex };

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
const cyl = (r1, r2, h, m, seg = 16) => new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m);
export const JAX = { teal: '#006778', gold: '#d7a22a', black: '#101820', white: '#f4f4f4' };
export const HALL = { L: 56, W: 26 }; // sàn "sân" trong sảnh (m)

// ---------- bầu trời chiều vàng ----------
function skyDusk(r = 900) {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3a6fb0'); gr.addColorStop(0.42, '#86b4dc'); gr.addColorStop(0.5, '#f2c58a'); gr.addColorStop(0.56, '#f7dcb2'); gr.addColorStop(1, '#c9b79c'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}

// ---------- sàn đá mài + vạch sân bằng băng dính teal/trắng ----------
function hallFloorTex() {
  return ctex(4096, 1902, (g, W, H) => {
    g.fillStyle = '#d9d4cb'; g.fillRect(0, 0, W, H); const R = rnd(7);
    for (let i = 0; i < 60000; i++) { const c = ['#bdb6aa', '#ece8e1', '#a69d90', '#8f8a84', '#c9c2b6'][Math.floor(R() * 5)]; g.fillStyle = c; const s = 1 + R() * 3; g.fillRect(R() * W, R() * H, s, s); }
    // ô gạch lớn 2 m
    g.strokeStyle = 'rgba(120,112,100,0.35)'; g.lineWidth = 3; const px = W / HALL.L;
    for (let x = 0; x <= HALL.L; x += 2) { g.beginPath(); g.moveTo(x * px, 0); g.lineTo(x * px, H); g.stroke(); }
    for (let z = 0; z <= HALL.W; z += 2) { g.beginPath(); g.moveTo(0, z * px); g.lineTo(W, z * px); g.stroke(); }
    // vạch sân: 5 yard (4,57 m) một vạch, số yard, hash
    const yd = 0.9144 * px, x0 = W / 2 - 25 * yd; g.fillStyle = '#ffffff';
    for (let i = 0; i <= 10; i++) { const x = x0 + i * 5 * yd; g.fillRect(x - 5, 3 * px, 10, H - 6 * px); }
    g.fillStyle = '#ffffff'; for (let i = 0; i <= 50; i++) { const x = x0 + i * yd; g.fillRect(x - 3, H * 0.36, 6, 26); g.fillRect(x - 3, H * 0.64 - 26, 6, 26); g.fillRect(x - 3, 3 * px, 6, 30); g.fillRect(x - 3, H - 3 * px - 30, 6, 30); }
    g.font = 'bold 110px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 1; i < 10; i++) { const n = i <= 5 ? i * 10 : (10 - i) * 10; const x = x0 + i * 5 * yd; g.fillText(String(n), x, H * 0.2); g.save(); g.translate(x, H * 0.8); g.rotate(Math.PI); g.fillText(String(n), 0, 0); g.restore(); }
    // viền băng dính teal quanh sân + 2 end zone chữ
    g.strokeStyle = JAX.teal; g.lineWidth = 34; g.strokeRect(x0 - 10 * yd, 3 * px, 70 * yd, H - 6 * px);
    g.fillStyle = 'rgba(0,103,120,0.85)'; g.fillRect(x0 - 10 * yd, 3 * px, 10 * yd - 6, H - 6 * px); g.fillStyle = 'rgba(215,162,42,0.85)'; g.fillRect(x0 + 50 * yd + 6, 3 * px, 10 * yd, H - 6 * px);
    g.fillStyle = '#fff'; g.font = '900 150px Arial';
    g.save(); g.translate(x0 - 5 * yd, H / 2); g.rotate(-Math.PI / 2); g.fillText('JAGUARS', 0, 0); g.restore();
    g.save(); g.translate(x0 + 55 * yd, H / 2); g.rotate(Math.PI / 2); g.fillText('SUITCASES', 0, 0); g.restore();
    // vết bánh xe + dải "WATCH YOUR STEP" vàng ở mép
    g.fillStyle = '#e5b81c'; g.fillRect(0, H - 40, W, 40); g.fillRect(0, 0, W, 40); g.fillStyle = '#222'; for (let x = 0; x < W; x += 80) { g.beginPath(); g.moveTo(x, H - 40); g.lineTo(x + 40, H - 40); g.lineTo(x + 20, H); g.fill(); }
  });
}

// ---------- bảng giờ bay lật chữ (cập nhật được) ----------
export function departureBoard(rows, o = {}) {
  const W = 1600, H = 900; let flash = 0;
  const t = ctex(W, H, () => {});
  const draw = (fl = 0) => { const g = t.userData.cv.getContext('2d'); g.fillStyle = '#0b0d10'; g.fillRect(0, 0, W, H); g.fillStyle = '#1b1f26'; g.fillRect(0, 0, W, 110);
    g.font = '900 64px Arial'; g.fillStyle = '#f6c90e'; g.textBaseline = 'middle'; g.fillText(o.title || 'DEPARTURES', 40, 56);
    g.font = 'bold 44px "Courier New", monospace';
    const cols = [40, 330, 980, 1200]; ['TIME', 'DESTINATION', 'GATE', 'STATUS'].forEach((h, i) => { g.fillStyle = '#8a93a0'; g.fillText(h, cols[i], 150); });
    rows.forEach((r, j) => { const y = 225 + j * 82; g.fillStyle = j % 2 ? '#12161c' : '#0e1116'; g.fillRect(0, y - 38, W, 78);
      r.forEach((txt, i) => { const hot = r[3] === 'FINAL CALL' && i === 3; if (hot && fl) { g.fillStyle = '#d0021b'; g.fillRect(cols[i] - 10, y - 32, 360, 66); }
        // ô ký tự lật
        for (let k = 0; k < txt.length; k++) { const x = cols[i] + k * 30; g.fillStyle = '#1e232b'; g.fillRect(x - 2, y - 30, 28, 60); g.fillStyle = '#000'; g.fillRect(x - 2, y - 1, 28, 2); g.fillStyle = hot ? '#fff' : '#f6c90e'; g.fillText(txt[k], x, y + 2); } }); });
    t.needsUpdate = true; };
  draw(0);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(o.w || 8, (o.w || 8) * H / W), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
  const frame = box((o.w || 8) + 0.3, (o.w || 8) * H / W + 0.3, 0.2, std('#2a2d33', { metalness: 0.5, roughness: 0.4 })); frame.position.z = -0.12; m.add(frame);
  m.userData.update = (time) => { const f = Math.floor(time * 2.5) % 2; if (f !== flash) { flash = f; draw(f); } };
  m.userData.setRows = (r) => { rows = r; draw(flash); };
  return m;
}

// ---------- máy bay dân dụng (không hãng thật) ----------
export function airliner(s = 1) {
  const G = new THREE.Group(); const white = std('#f3f4f6', { roughness: 0.35, metalness: 0.2 }), teal = std(JAX.teal, { roughness: 0.4 }), grey = std('#9aa3ad', { metalness: 0.6, roughness: 0.35 });
  const fus = cyl(2, 2, 34, white, 24); fus.rotation.z = Math.PI / 2; G.add(fus);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), white); nose.rotation.z = -Math.PI / 2; nose.scale.set(1, 1.8, 1); nose.position.x = 17; G.add(nose);
  const tailc = new THREE.Mesh(new THREE.ConeGeometry(2, 7, 24), white); tailc.rotation.z = Math.PI / 2; tailc.position.set(-20.5, 0.6, 0); G.add(tailc);
  const stripe = cyl(2.02, 2.02, 30, teal, 24); stripe.rotation.z = Math.PI / 2; stripe.scale.set(1, 1, 1); stripe.position.y = -0.2; const sm = new THREE.Mesh(new THREE.CylinderGeometry(2.03, 2.03, 30, 24, 1, true, Math.PI * 0.55, Math.PI * 0.25), teal); sm.rotation.z = Math.PI / 2; G.add(sm);
  // cửa sổ
  const wtex = ctex(1024, 32, (g, W, H) => { g.clearRect(0, 0, W, H); for (let x = 20; x < W - 20; x += 22) { g.fillStyle = '#1d2733'; g.beginPath(); g.ellipse(x, 16, 6, 9, 0, 0, 7); g.fill(); } });
  for (const z of [1, -1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(28, 0.9), new THREE.MeshStandardMaterial({ map: wtex, transparent: true, roughness: 0.3 })); w.position.set(1, 0.6, 2.01 * z); if (z < 0) w.rotation.y = Math.PI; G.add(w); }
  const cock = box(1.6, 0.5, 3.2, std('#1d2733', { roughness: 0.2 })); cock.position.set(17.6, 0.9, 0); G.add(cock);
  for (const z of [1, -1]) { const wing = box(9, 0.35, 15, white); wing.geometry.translate(0, 0, 7.5 * z); wing.rotation.y = 0.45 * z; wing.position.set(1, -1.1, 1.2 * z); G.add(wing);
    const eng = cyl(1.05, 0.95, 4, grey, 20); eng.rotation.z = Math.PI / 2; eng.position.set(3.2, -2.3, 6 * z); G.add(eng); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.12, 8, 24), white); ring.rotation.y = Math.PI / 2; ring.position.set(5.2, -2.3, 6 * z); G.add(ring);
    const st = box(4, 0.25, 5, white); st.geometry.translate(0, 0, 2.5 * z); st.rotation.y = 0.5 * z; st.position.set(-21, 1, 0.5 * z); G.add(st); }
  const fin = box(5, 6.5, 0.35, teal); fin.position.set(-20, 4.5, 0); fin.rotation.z = -0.45; G.add(fin);
  for (const [x, z] of [[12, 0], [0, 2.2], [0, -2.2]]) { const leg = cyl(0.15, 0.15, 1.8, grey); leg.position.set(x, -2.8, z); G.add(leg); const wh = cyl(0.55, 0.55, 0.5, std('#111'), 16); wh.rotation.x = Math.PI / 2; wh.position.set(x, -3.6, z); G.add(wh); }
  G.position.y = 4.1 * s; G.scale.setScalar(s); return G;
}

// ---------- băng chuyền hành lý (tấm trượt chạy thật) ----------
export function carousel(len = 14, wid = 4.2) {
  const G = new THREE.Group(); const steel = std('#b9bfc6', { metalness: 0.8, roughness: 0.3 }), rubber = std('#24272c', { roughness: 0.6 });
  const r = wid / 2; const shape = new THREE.Shape(); shape.absarc(len / 2 - r, 0, r + 0.5, -Math.PI / 2, Math.PI / 2); shape.absarc(-len / 2 + r, 0, r + 0.5, Math.PI / 2, Math.PI * 1.5);
  const hole = new THREE.Path(); hole.absarc(len / 2 - r, 0, r - 0.9, -Math.PI / 2, Math.PI / 2); hole.absarc(-len / 2 + r, 0, r - 0.9, Math.PI / 2, Math.PI * 1.5); shape.holes.push(hole);
  const base = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: false }), steel); base.rotation.x = -Math.PI / 2; G.add(base);
  const mid = new THREE.Mesh(new THREE.ExtrudeGeometry((() => { const s = new THREE.Shape(); s.absarc(len / 2 - r, 0, r - 0.9, -Math.PI / 2, Math.PI / 2); s.absarc(-len / 2 + r, 0, r - 0.9, Math.PI / 2, Math.PI * 1.5); return s; })(), { depth: 0.9, bevelEnabled: false }), std('#7d858f', { metalness: 0.6, roughness: 0.4 })); mid.rotation.x = -Math.PI / 2; G.add(mid);
  // đường chạy tấm: chu vi
  const straight = len - 2 * r, per = 2 * straight + 2 * Math.PI * r; const N = Math.round(per / 0.42);
  const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 0.06, 0.95), rubber, N); G.add(slats);
  const at = (u) => { u = ((u % per) + per) % per; if (u < straight) return [-straight / 2 + u, r, 0]; u -= straight; if (u < Math.PI * r) { const a = -Math.PI / 2 + u / r; return [straight / 2 + Math.cos(a) * r, -Math.sin(a) * r * -1, a + Math.PI / 2]; } u -= Math.PI * r; if (u < straight) return [straight / 2 - u, -r, Math.PI]; u -= straight; const a = Math.PI / 2 + u / r; return [-straight / 2 + Math.cos(a) * r, Math.sin(a) * r, a + Math.PI / 2]; };
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  G.userData.per = per; G.userData.at = (u) => { const [x, z, a] = at(u); return { x, z: -z, a }; }; // vị trí trên băng (toạ độ cục bộ), a = góc tiếp tuyến
  G.userData.update = (t, speed = 0.55) => { for (let i = 0; i < N; i++) { const [x, z, a] = at(i * per / N + t * speed); e.set(0, -a, 0); q.setFromEuler(e); m.compose(new THREE.Vector3(x, 0.58, -z), q, new THREE.Vector3(1, 1, 1)); slats.setMatrixAt(i, m); } slats.instanceMatrix.needsUpdate = true; };
  G.userData.update(0); return G;
}

// ---------- hành khách đứng xem (instanced nhiều bộ phận: chân, thân vai rộng, tay, cổ, đầu, tóc, giày, túi; cử động) ----------
export function passengers(G, spots, seed = 3) {
  const R = rnd(seed); const N = spots.length;
  const cols = ['#c0392b', '#2c3e50', '#16a085', '#f39c12', '#8e44ad', '#ecf0f1', '#34495e', '#d35400', '#27ae60', '#7f8c8d', '#e84393', '#0984e3', '#006778', '#d7a22a'];
  const skins = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac', '#5c3a21'], hairs = ['#1b1b1b', '#3b2416', '#6b4a2b', '#c9a15a', '#8a8a8a', '#2a1a10'];
  const parts = { legL: new THREE.CapsuleGeometry(0.075, 0.72, 4, 8), legR: new THREE.CapsuleGeometry(0.075, 0.72, 4, 8), torso: new RoundedBoxGeometry(0.42, 0.56, 0.24, 2, 0.08), armL: new THREE.CapsuleGeometry(0.055, 0.5, 4, 8), armR: new THREE.CapsuleGeometry(0.055, 0.5, 4, 8),
    neck: new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), head: new THREE.SphereGeometry(0.115, 14, 12), hair: new THREE.SphereGeometry(0.122, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), shoeL: new RoundedBoxGeometry(0.12, 0.08, 0.26, 2, 0.03), shoeR: new RoundedBoxGeometry(0.12, 0.08, 0.26, 2, 0.03), bag: new RoundedBoxGeometry(0.3, 0.42, 0.18, 2, 0.04) };
  const IM = {}; for (const [k, g] of Object.entries(parts)) { IM[k] = new THREE.InstancedMesh(g, std('#fff', { roughness: 0.75 }), N); IM[k].castShadow = true; G.add(IM[k]); }
  const meta = spots.map(([x, z, ry]) => ({ x, z, ry: ry ?? 0, ph: R() * 6.28, sp: 0.6 + R() * 1.2, h: 0.9 + R() * 0.2, wd: 0.9 + R() * 0.25, c: cols[Math.floor(R() * cols.length)], p: ['#2d3436', '#1e3799', '#636e72', '#b2bec3', '#3d2b1f'][Math.floor(R() * 5)], s: skins[Math.floor(R() * skins.length)], hc: hairs[Math.floor(R() * hairs.length)], b: cols[Math.floor(R() * cols.length)], hasBag: R() < 0.5, phone: R() < 0.25 }));
  meta.forEach((p, i) => { const set = (k, c) => IM[k].setColorAt(i, new THREE.Color(c)); set('legL', p.p); set('legR', p.p); set('torso', p.c); set('armL', p.c); set('armR', p.c); set('neck', p.s); set('head', p.s); set('hair', p.hc); set('shoeL', '#222'); set('shoeR', '#222'); set('bag', p.b); });
  const Mroot = new THREE.Matrix4(), Ml = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), zero = new THREE.Vector3(0, 0, 0);
  const put = (k, i, x, y, z, rx = 0, ry = 0, rz = 0, sc = one) => { E.set(rx, ry, rz); Q.setFromEuler(E); Ml.compose(new THREE.Vector3(x, y, z), Q, sc); IM[k].setMatrixAt(i, Ml.premultiply(Mroot)); };
  const update = (t, cheer = 0) => { meta.forEach((p, i) => {
      const bob = Math.max(0, Math.sin(t * (2 + cheer * 6) + p.ph)) * (0.015 + cheer * 0.1), sway = Math.sin(t * p.sp + p.ph) * 0.05;
      E.set(0, p.ry + sway, 0); Q.setFromEuler(E); Mroot.compose(new THREE.Vector3(p.x, bob, p.z), Q, new THREE.Vector3(p.h * p.wd, p.h, p.h));
      const wave = cheer * Math.max(0, Math.sin(t * 7 + p.ph)) * 2.2, armSw = Math.sin(t * 1.1 + p.ph) * 0.08;
      put('legL', i, -0.1, 0.43, 0); put('legR', i, 0.1, 0.43, 0, 0, 0, 0); put('shoeL', i, -0.1, 0.04, 0.05); put('shoeR', i, 0.1, 0.04, 0.05);
      put('torso', i, 0, 1.1, 0, sway * 0.4, 0, sway * 0.3);
      put('armL', i, -0.27, 1.07, 0, armSw, 0, 0.12 + (p.phone ? 0 : 0)); put('armR', i, 0.27, 1.07 + (p.phone ? 0.12 : 0) + wave * 0.12, p.phone ? 0.1 : 0, p.phone ? -1.2 : -armSw - wave, 0, -0.12 - wave * 0.4);
      put('neck', i, 0, 1.42, 0); const hy = Math.sin(t * 0.7 + p.ph) * 0.5, hx = (p.phone ? 0.35 : 0) + Math.sin(t * 1.3 + p.ph) * 0.08;
      put('head', i, 0, 1.55, 0.01, hx, hy, 0); put('hair', i, 0, 1.57, -0.005, hx - 0.25, hy, 0);
      put('bag', i, 0.36, 0.25, 0, 0, 0, 0, p.hasBag ? one : zero); });
    Object.values(IM).forEach((m) => (m.instanceMatrix.needsUpdate = true)); };
  update(0); return { update };
}

// ---------- SẢNH BĂNG CHUYỀN = SÂN CHÍNH ----------
export function buildBaggageHall(scene) {
  const G = new THREE.Group(); scene.add(G); const A = {};
  scene.add(skyDusk());
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(HALL.L, HALL.W), std('#fff', { map: hallFloorTex(), roughness: 0.25, metalness: 0.05 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; G.add(fl);
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(140, 80), std('#cfc9be', { roughness: 0.3 })); rim.rotation.x = -Math.PI / 2; rim.position.y = -0.01; rim.receiveShadow = true; G.add(rim);
  // trần + dải đèn
  A.ceil = new THREE.Group(); G.add(A.ceil); const ceil = new THREE.Mesh(new THREE.PlaneGeometry(140, 80), std('#e9e7e2', { roughness: 0.9, side: THREE.DoubleSide })); ceil.rotation.x = Math.PI / 2; ceil.position.y = 10; A.ceil.add(ceil);
  const strip = std('#ffffff', { emissive: '#fff6e0', emissiveIntensity: 2.2 });
  for (let z = -18; z <= 18; z += 6) { const s = box(110, 0.08, 0.5, strip); s.position.set(0, 9.9, z); A.ceil.add(s); }
  // cột tròn bọc thép
  for (let x = -40; x <= 40; x += 16) for (const z of [-17.5, 17.5]) { const c = cyl(0.55, 0.55, 10, std('#c4c9cf', { metalness: 0.6, roughness: 0.35 }), 20); c.position.set(x, 5, z); G.add(c); }
  // tường kính phía sau (nhìn ra đường băng) — khung + kính
  const glass = new THREE.MeshPhysicalMaterial({ color: '#cfe6f2', transmission: 0.0, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1 });
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(140, 10), glass); pane.position.set(0, 5, -20); G.add(pane);
  const mull = std('#3b4148', { metalness: 0.7, roughness: 0.4 });
  for (let x = -70; x <= 70; x += 3) { const m = box(0.14, 10, 0.25, mull); m.position.set(x, 5, -20); G.add(m); }
  for (const y of [0.1, 3.4, 6.7, 9.9]) { const m = box(140, 0.16, 0.25, mull); m.position.set(0, y, -20); G.add(m); }
  // tường phụ hai đầu + phía máy quay (ốp đá, quảng cáo trừu tượng)
  const wallM = std('#d8d2c8', { roughness: 0.6 }); for (const x of [-60, 60]) { const w = box(0.5, 10, 40, wallM); w.position.set(x, 5, 0); G.add(w); }
  const back = box(140, 10, 0.5, wallM); back.position.set(0, 5, 22); G.add(back);
  const adT = (txt, c1, c2) => ctex(800, 400, (g, W, H) => { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '900 90px Arial'; g.textAlign = 'center'; g.fillText(txt, W / 2, H / 2 + 30); });
  [['WELCOME TO JACKSONVILLE', '#006778', '#0a3540'], ['FLORIDA SUN', '#f39c12', '#d35400'], ['RENT-A-CAR', '#2d3436', '#636e72']].forEach(([t, a, b], i) => { const ad = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: adT(t, a, b) })); ad.position.set(-30 + i * 30, 5.5, 21.7); ad.rotation.y = Math.PI; G.add(ad); });
  // biển treo
  const sign = (txt, w, x, y, z, ry = 0, bg = '#101820', fg = '#f6c90e') => { const tx = ctex(1024, 200, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = fg; g.font = '900 110px Arial'; g.textBaseline = 'middle'; g.fillText(txt, 40, H / 2 + 6); });
    const s = new THREE.Mesh(new THREE.BoxGeometry(w, w * 0.195, 0.15), [std(bg), std(bg), std(bg), std(bg), new THREE.MeshBasicMaterial({ map: tx }), new THREE.MeshBasicMaterial({ map: tx })]); s.position.set(x, y, z); s.rotation.y = ry; G.add(s);
    for (const dx of [-w / 2 + 0.3, w / 2 - 0.3]) { const rod = cyl(0.02, 0.02, 10 - y, std('#555')); rod.position.set(x + dx * Math.cos(ry), y + (10 - y) / 2, z - dx * Math.sin(ry)); G.add(rod); } return s; };
  sign('🧳 BAGGAGE CLAIM 2', 7, -14, 7.2, -8); sign('GATES B1–B14 →', 6, 16, 7.2, -8); sign('↓ GROUND TRANSPORT', 7, 0, 7.6, 12, 0, '#0f2a33', '#ffffff');
  // bảng giờ bay lớn trên tường kính
  A.board = departureBoard([['18:05', 'LONDON', 'B9', 'DEPARTED'], ['18:20', 'LONDON', 'B9', 'DEPARTED'], ['18:40', 'BALTIMORE', 'B4', 'LANDED'], ['19:15', 'NASHVILLE', 'B12', 'BOARDING'], ['19:30', 'NEW YORK', 'B7', 'ON TIME'], ['20:05', 'ORLANDO', 'B2', 'ON TIME'], ['20:40', 'JACKSONVILLE', '—', 'NOT FOUND']], { w: 9 });
  A.board.position.set(-22, 5.2, -19.6); G.add(A.board);
  // 2 băng chuyền
  A.car1 = carousel(16, 4.4); A.car1.position.set(-6, 0, -12.5); G.add(A.car1);
  A.car2 = carousel(12, 4); A.car2.position.set(22, 0, -12.5); G.add(A.car2);
  // nắp vòm che băng chuyền (rèm cao su nơi vali chui ra)
  for (const c of [A.car1, A.car2]) { const hood = box(2.6, 2.2, 2.2, std('#5b636d', { metalness: 0.5, roughness: 0.4 })); hood.position.set(0, 1.6, -3.4); c.add(hood); for (let i = 0; i < 9; i++) { const f = box(0.26, 1.1, 0.04, std('#1a1a1a')); f.position.set(-1.05 + i * 0.26, 0.95, -2.29); c.add(f); } }
  // ghế chờ + xe đẩy hành lý
  const seatM = std('#2d3a44', { roughness: 0.5 }), legM = std('#9aa1a8', { metalness: 0.7, roughness: 0.3 });
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) { const s = box(0.55, 0.08, 0.55, seatM); s.position.set(30 + i * 0.6, 0.45, 8 + r * 1.6); G.add(s); const b = box(0.55, 0.5, 0.06, seatM); b.position.set(30 + i * 0.6, 0.72, 8.28 + r * 1.6); G.add(b); }
  for (let r = 0; r < 3; r++) { const l = box(4.8, 0.05, 0.06, legM); l.position.set(32.1, 0.2, 8 + r * 1.6); G.add(l); }
  for (let i = 0; i < 6; i++) { const cart = new THREE.Group(); const fr = box(0.9, 0.05, 0.6, legM); fr.position.y = 0.25; cart.add(fr); const hd = box(0.05, 0.9, 0.6, legM); hd.position.set(-0.45, 0.7, 0); cart.add(hd); cart.position.set(-34 + i * 0.5, 0, 9); cart.rotation.y = 0.1; G.add(cart); }
  // NGOÀI KÍNH: đường băng, máy bay, ống lồng, xe kéo, đài kiểm soát, đèn đường lăn
  const tarTex = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#4a4d52'; g.fillRect(0, 0, W, H); const R = rnd(11); for (let i = 0; i < 30000; i++) { g.fillStyle = R() < 0.5 ? '#55585e' : '#3f4247'; g.fillRect(R() * W, R() * H, 2, 2); } g.strokeStyle = '#f2c230'; g.lineWidth = 10; g.beginPath(); g.moveTo(0, H * 0.6); g.bezierCurveTo(W * 0.3, H * 0.6, W * 0.5, H * 0.3, W, H * 0.3); g.stroke(); g.beginPath(); g.moveTo(W * 0.2, H); g.lineTo(W * 0.2, H * 0.6); g.stroke(); });
  tarTex.wrapS = tarTex.wrapT = THREE.RepeatWrapping; tarTex.repeat.set(3, 2);
  const tar = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), std('#fff', { map: tarTex, roughness: 0.85 })); tar.rotation.x = -Math.PI / 2; tar.position.set(0, -0.02, -170); tar.receiveShadow = true; G.add(tar);
  A.plane = airliner(1); A.plane.position.set(-8, 4.1, -48); A.plane.rotation.y = Math.PI * 0.05; G.add(A.plane);
  const p2 = airliner(1); p2.position.set(70, 4.1, -60); p2.rotation.y = Math.PI * 0.52; G.add(p2);
  const p3 = airliner(0.9); p3.position.set(-120, 3.7, -130); p3.rotation.y = -0.3; G.add(p3);
  // ống lồng
  const jb = new THREE.Group(); const jbm = std('#c7ccd2', { metalness: 0.5, roughness: 0.4 }); const tube = box(18, 3, 3, jbm); tube.position.set(-9, 5.5, 0); jb.add(tube); const leg = cyl(0.3, 0.3, 4, std('#555')); leg.position.set(-14, 2, 0); jb.add(leg); const cab = box(3.2, 3.4, 3.6, jbm); cab.position.set(-0.5, 5.5, 0); jb.add(cab); jb.position.set(10, 0, -36); jb.rotation.y = -0.5; G.add(jb);
  // xe kéo hành lý (đoàn toa)
  A.tug = new THREE.Group(); const tugB = box(2.2, 1.2, 1.4, std('#f1c40f')); tugB.position.y = 0.9; A.tug.add(tugB); for (let i = 0; i < 3; i++) { const cartT = box(2.4, 1.3, 1.5, std('#7f8c8d', { metalness: 0.4 })); cartT.position.set(-2.8 - i * 2.8, 1, 0); A.tug.add(cartT); for (let k = 0; k < 3; k++) { const bg = box(0.6, 0.45, 0.35, std(['#c0392b', '#2980b9', '#27ae60', '#8e44ad'][(i + k) % 4])); bg.position.set(-2.4 - i * 2.8 - k * 0.6 + 0.6, 1.9, 0); A.tug.add(bg); } }
  A.tug.position.set(30, 0, -30); G.add(A.tug);
  // đài kiểm soát
  const tw = new THREE.Group(); const sh = cyl(2.5, 3.5, 40, std('#d9dde1'), 20); sh.position.y = 20; tw.add(sh); const cabT = cyl(6, 5, 5, std('#1d2733', { roughness: 0.15, metalness: 0.5 }), 16); cabT.position.y = 43; tw.add(cabT); const roofT = cyl(6.5, 6, 1, std('#d9dde1'), 16); roofT.position.y = 46; tw.add(roofT); tw.position.set(110, 0, -200); G.add(tw);
  // hàng rào + rừng cây xa + thành phố mờ
  const R = rnd(21); const tree = new THREE.InstancedMesh(new THREE.ConeGeometry(3, 10, 8), std('#2f5d3a'), 160); const mm = new THREE.Matrix4();
  for (let i = 0; i < 160; i++) { const s = 0.7 + R() * 0.8; mm.compose(new THREE.Vector3(-260 + i * 3.3 + R() * 2, 5 * s, -300 - R() * 30), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); tree.setMatrixAt(i, mm); } G.add(tree);
  for (let i = 0; i < 40; i++) { const h = 15 + R() * 50; const b = box(10 + R() * 12, h, 10, std(['#8b98a8', '#a3aebb', '#7d8a99'][i % 3], { roughness: 0.6 })); b.position.set(-200 + i * 11, h / 2, -380 - R() * 40); G.add(b); }
  for (let x = -60; x <= 60; x += 6) { const l = cyl(0.12, 0.12, 0.6, std('#2980b9', { emissive: '#3498db', emissiveIntensity: 1.5 })); l.position.set(x, 0.3, -70); G.add(l); }
  // hành khách quanh sân + sau băng chuyền
  const spots = []; const R2 = rnd(5);
  for (let i = 0; i < 46; i++) spots.push([-26 + i * 1.15 + R2() * 0.4, 13.5 + R2() * 2.5, Math.PI + (R2() - 0.5) * 0.6]);
  for (let i = 0; i < 26; i++) spots.push([-20 + i * 1.6 + R2() * 0.5, -16 + R2() * 1.2, (R2() - 0.5) * 0.6]);
  for (let i = 0; i < 12; i++) spots.push([-30 - R2() * 3, -8 + i * 1.5, -Math.PI / 2 + (R2() - 0.5) * 0.5]);
  A.crowd = passengers(G, spots);
  A.update = (t, o = {}) => { A.car1.userData.update(t, o.speed ?? 0.55); A.car2.userData.update(t + 3, 0.55); A.board.userData.update(t); A.crowd.update(t, o.cheer || 0); A.tug.position.x = 30 - ((t * 3) % 90); };
  A.G = G; return A;
}

export function hallLights(scene) {
  const hemi = new THREE.HemisphereLight('#fff7ea', '#b9b1a3', 2.3); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffd7a1', 2.6); sun.position.set(-30, 28, -60); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); const sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 30; sc.bottom = -30; sc.far = 200; sun.shadow.bias = -0.0004; scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#ffffff', 1.0); fill.position.set(10, 20, 40); scene.add(fill);
  return { hemi, sun, fill, follow(cam) { const cx = cam.position.x, cz = cam.position.z; sun.target.position.set(cx, 0, cz - 8); sun.position.set(cx - 30, 28, cz - 68); sun.target.updateMatrixWorld(); fill.position.copy(cam.position).add(new THREE.Vector3(0, 6, 0)); fill.target.position.copy(cam.position).add(new THREE.Vector3(0, 0, -10)); fill.target.updateMatrixWorld(); } };
}

// ---------- VALI CÓ MẶT ----------
export function makeSuitcase(o = {}) {
  const R = rnd(o.seed || 1); const w = o.w || 0.5, h = o.h || 0.74, d = o.d || 0.3, c = o.color || '#c0392b';
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const shell = std(c, { roughness: 0.35, metalness: 0.1 }), dark = std('#1b1d21', { roughness: 0.5 }), chrome = std('#c9ced4', { metalness: 0.9, roughness: 0.2 });
  const baseH = h * 0.62, lidH = h - baseH;
  const base = new THREE.Mesh(new RoundedBoxGeometry(w, baseH, d, 3, 0.045), shell); base.position.y = baseH / 2; base.castShadow = true; body.add(base);
  const inner = box(w * 0.9, 0.02, d * 0.86, std('#3a3f46')); inner.position.y = baseH - 0.012; body.add(inner);
  // nắp = miệng (bản lề mép sau)
  const lidP = new THREE.Group(); lidP.position.set(0, baseH, -d / 2); body.add(lidP);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(w, lidH, d, 3, 0.045), shell); lid.position.set(0, lidH / 2, d / 2); lid.castShadow = true; lidP.add(lid);
  const lining = box(w * 0.88, 0.015, d * 0.84, std('#7a1f2b')); lining.position.set(0, 0.005, d / 2); lidP.add(lining);
  // gờ dọc vỏ cứng
  for (const k of [-0.28, 0, 0.28]) { for (const [p, y0, hh] of [[body, baseH / 2, baseH * 0.86], [lid, 0, lidH * 0.8]]) { const rib = box(0.025, hh, 0.012, std(new THREE.Color(c).multiplyScalar(0.8).getStyle(), { roughness: 0.35 })); rib.position.set(k * w, y0, d / 2 + 0.002); if (p === body) body.add(rib); else lid.add(rib); } }
  // khoá kéo
  const zip = box(w + 0.01, 0.02, d + 0.01, dark); zip.position.y = baseH; body.add(zip);
  // tay kéo ống lồng
  const hg = new THREE.Group(); body.add(hg); hg.position.set(0, 0, -d / 2 - 0.02);
  const rods = [-1, 1].map((k) => { const r = cyl(0.012, 0.012, 1, chrome, 8); r.position.x = k * w * 0.32; hg.add(r); return r; });
  const grip = box(w * 0.75, 0.04, 0.05, dark); hg.add(grip);
  const sideH = box(0.16, 0.03, 0.05, dark); sideH.position.set(0, baseH * 0.55, d / 2 + 0.03); sideH.rotation.y = 0; // tay xách cạnh
  const topH = box(0.2, 0.035, 0.05, dark); topH.position.set(0, lidH + 0.02, d / 2); lid.add(topH);
  // 4 bánh xe xoay
  const wheels = []; for (const x of [-1, 1]) for (const z of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(x * (w / 2 - 0.05), 0.0, z * (d / 2 - 0.05)); const wh = cyl(0.035, 0.035, 0.025, dark, 12); wh.rotation.z = Math.PI / 2; wh.position.y = 0.035; piv.add(wh); const fork = box(0.03, 0.04, 0.03, chrome); fork.position.y = 0.07; piv.add(fork); body.add(piv); wheels.push(wh); }
  body.position.y = 0.075;
  // thẻ hành lý có số (tag)
  const tagT = ctex(256, 160, (g, W, H) => { g.fillStyle = '#fdf6e3'; g.fillRect(0, 0, W, H); g.fillStyle = '#c0392b'; g.fillRect(0, 0, W, 34); g.fillStyle = '#fff'; g.font = 'bold 24px Arial'; g.fillText('PRIORITY', 12, 25); g.fillStyle = '#111'; g.font = '900 96px Arial'; g.textAlign = 'center'; g.fillText(String(o.number ?? ''), W / 2, 140); });
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.1), new THREE.MeshStandardMaterial({ map: tagT, side: THREE.DoubleSide, roughness: 0.6 })); const tagP = new THREE.Group(); tagP.position.set(w * 0.2, lidH + 0.03, d / 2 + 0.01); lid.add(tagP); tag.position.set(0.02, -0.07, 0.01); tagP.add(tag);
  // số to trên mặt sau (để đọc từ máy quay) + nhãn dán
  const numT = ctex(256, 256, (g, W, H) => { g.clearRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 200px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(o.number ?? ''), W / 2, H / 2 + 10); });
  const num = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.6, w * 0.6), new THREE.MeshBasicMaterial({ map: numT, transparent: true })); num.position.set(0, baseH * 0.48, -d / 2 - 0.003); num.rotation.y = Math.PI; body.add(num);
  for (let i = 0; i < 3; i++) { const st = new THREE.Mesh(new THREE.CircleGeometry(0.035 + R() * 0.03, 16), std(['#f1c40f', '#3498db', '#e67e22', '#ecf0f1', '#2ecc71'][Math.floor(R() * 5)])); st.position.set((R() - 0.5) * w * 0.7, baseH * (0.2 + R() * 0.5), d / 2 + 0.004); body.add(st); }
  // MẮT trên nắp (trắng + đồng tử + mí)
  const eyes = [-1, 1].map((k) => { const e = new THREE.Group(); e.position.set(k * w * 0.2, lidH * 0.5, d + 0.005); lid.add(e);
    const wht = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), std('#ffffff', { roughness: 0.3 })); wht.scale.z = 0.5; e.add(wht);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), std('#111')); pup.position.z = 0.024; e.add(pup);
    const lidm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), shell); lidm.scale.z = 0.55; e.add(lidm);
    const brow = box(0.08, 0.014, 0.01, dark); brow.position.set(0, 0.075, 0.02); e.add(brow); return { e, pup, lidm, brow }; });
  root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  let roll = 0;
  const update = (t, s = {}) => {
    const seed = o.seed || 1;
    // trượt: bánh xe quay theo quãng đường
    roll = s.roll ?? roll; wheels.forEach((wh) => (wh.rotation.x = roll / 0.035));
    const hop = s.hop ? Math.abs(Math.sin(t * 9 + seed)) * 0.12 * s.hop : 0;
    body.position.y = 0.075 + hop; body.rotation.z = (s.lean || 0) + Math.sin(t * 2 + seed) * 0.02 * (s.wobble ?? 1); body.rotation.x = (s.tilt || 0) + Math.sin(t * 1.7 + seed * 2) * 0.015 * (s.wobble ?? 1);
    lidP.rotation.x = -(s.open ?? (0.04 + Math.max(0, Math.sin(t * 3.1 + seed)) * 0.05)) * 1.2; // nói/thở
    const ext = s.handle ?? 0.25; rods.forEach((r) => { r.scale.y = baseH * 0.9 + ext; r.position.y = (baseH * 0.9 + ext) / 2 + 0.02; }); grip.position.y = baseH * 0.9 + ext + 0.04;
    const lk = s.look || [Math.sin(t * 0.9 + seed) * 0.4, 0]; const bl = (s.blink ?? ((t * 0.7 + seed * 0.37) % 3.1 < 0.12 ? 1 : 0));
    eyes.forEach(({ pup, lidm, brow }, i) => { pup.position.x = lk[0] * 0.022; pup.position.y = lk[1] * 0.02; const sq = s.squint || 0; lidm.rotation.x = -Math.PI * (0.05 + 0.45 * Math.max(bl, sq)); lidm.scale.y = 1; brow.rotation.z = (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.075 + (s.browUp || 0) * 0.02; });
    tagP.rotation.z = Math.sin(t * 4 + seed) * 0.25 + (s.tagSwing || 0);
  };
  update(0);
  return { root, body, lid: lidP, eyes, update, size: { w, h, d } };
}

// ---------- CÔNG TRƯỜNG SÂN VẬN ĐỘNG ----------
export function construction(at = new THREE.Vector3(0, 0, 500)) {
  const G = new THREE.Group(); G.position.copy(at); const A = { G };
  const dirt = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#8a6f4e'; g.fillRect(0, 0, W, H); const R = rnd(4); for (let i = 0; i < 40000; i++) { g.fillStyle = ['#7a6044', '#9b8060', '#6e5539', '#a88d6b'][Math.floor(R() * 4)]; g.fillRect(R() * W, R() * H, 3, 3); } g.strokeStyle = 'rgba(60,45,30,0.5)'; g.lineWidth = 14; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(R() * W, 0); g.bezierCurveTo(R() * W, H * 0.3, R() * W, H * 0.7, R() * W, H); g.stroke(); } });
  dirt.wrapS = dirt.wrapT = THREE.RepeatWrapping; dirt.repeat.set(6, 6);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std('#fff', { map: dirt, roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; G.add(gr);
  const conc = std('#b8b4ac', { roughness: 0.9 }), steel = std('#7d8790', { metalness: 0.6, roughness: 0.45 }), orange = std('#e67e22', { roughness: 0.5 }), yellow = std('#f1c40f', { roughness: 0.5 });
  // khán đài bê tông dở dang (vòng cung bậc)
  for (let tier = 0; tier < 3; tier++) for (let i = 0; i < 26; i++) { const a = -Math.PI * 0.9 + i * Math.PI * 1.8 / 25; if (tier === 2 && i % 3 === 0) continue; const rr = 55 + tier * 9; for (let k = 0; k < 4; k++) { const st = box(8.5, 0.6, 2.2, conc); st.position.set(Math.cos(a) * (rr + k * 2.2), 1 + tier * 7 + k * 1.2, Math.sin(a) * (rr + k * 2.2) * 0.75 - 30); st.rotation.y = -a + Math.PI / 2; st.castShadow = true; G.add(st);  const cx = Math.cos(a) * (rr + 4), cz = Math.sin(a) * (rr + 4) * 0.75 - 30, ch = 1 + tier * 7 + 4; const colm = box(0.9, ch, 0.9, conc); colm.position.set(cx, ch / 2, cz); G.add(colm); const rake = box(1, 0.8, 9.5, conc); rake.position.set(Math.cos(a) * (rr + 3.3), 1.2 + tier * 7 + 1.8, Math.sin(a) * (rr + 3.3) * 0.75 - 30); rake.rotation.y = -a + Math.PI / 2 + Math.PI / 2; rake.rotation.x = 0.5; G.add(rake); } }
  // cột + dầm thép lộ khung
  for (let i = 0; i < 18; i++) { const a = -Math.PI * 0.85 + i * Math.PI * 1.7 / 17; const x = Math.cos(a) * 82, z = Math.sin(a) * 82 * 0.75 - 30; const col = box(0.8, 30, 0.8, steel); col.position.set(x, 15, z); col.castShadow = true; G.add(col); if (i) { const pa = -Math.PI * 0.85 + (i - 1) * Math.PI * 1.7 / 17, px = Math.cos(pa) * 82, pz = Math.sin(pa) * 82 * 0.75 - 30; for (const y of [10, 20, 29.5]) { const len = Math.hypot(x - px, z - pz); const bm = box(len, 0.5, 0.5, steel); bm.position.set((x + px) / 2, y, (z + pz) / 2); bm.rotation.y = -Math.atan2(z - pz, x - px); G.add(bm); } } }
  // cần cẩu tháp (xoay)
  A.cranes = [];
  const crane = (x, z, h, rot) => { const C = new THREE.Group(); C.position.set(x, 0, z); G.add(C);
    for (let y = 0; y < h; y += 2) { for (const [dx, dz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) { const p = box(0.15, 2, 0.15, yellow); p.position.set(dx, y + 1, dz); C.add(p); } for (const k of [0, 1]) { const br = box(2.5, 0.1, 0.1, yellow); br.position.set(0, y + 1, k ? 0.9 : -0.9); br.rotation.z = 0.7 * (y % 4 ? 1 : -1); C.add(br); const br2 = box(0.1, 0.1, 2.5, yellow); br2.position.set(k ? 0.9 : -0.9, y + 1, 0); br2.rotation.x = 0.7 * (y % 4 ? 1 : -1); C.add(br2); } }
    const top = new THREE.Group(); top.position.y = h; C.add(top); const jib = box(42, 1.4, 1.4, yellow); jib.position.x = 18; top.add(jib); const cj = box(14, 1.4, 1.6, yellow); cj.position.x = -9; top.add(cj); const cw = box(4, 3, 2.4, conc); cw.position.set(-14, -1.6, 0); top.add(cw);
    const cabC = box(2.4, 2.4, 2.4, std('#ecf0f1')); cabC.position.set(1.5, -1.6, 1.6); top.add(cabC); const peak = new THREE.Mesh(new THREE.ConeGeometry(1.2, 7, 4), yellow); peak.position.y = 4; top.add(peak);
    const trolley = new THREE.Group(); trolley.position.x = 26; top.add(trolley); const cable = cyl(0.04, 0.04, 22, std('#222')); cable.position.y = -11; trolley.add(cable); const hook = box(1.6, 1.2, 0.6, std('#c0392b')); hook.position.y = -22.5; trolley.add(hook); const beam = box(9, 0.6, 0.6, steel); beam.position.y = -24; trolley.add(beam);
    A.cranes.push({ top, trolley, rot }); };
  crane(-40, -20, 52, 0.15); crane(45, -45, 60, -0.1);
  // giàn giáo
  for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) { const p = cyl(0.05, 0.05, 2, std('#95a5a6', { metalness: 0.7 }), 6); p.position.set(-20 + i * 2, 1 + j * 2, 18); G.add(p); const pl = box(2, 0.06, 0.8, std('#8e6b3e')); pl.position.set(-19 + i * 2, j * 2 + 2, 18.4); G.add(pl); }
  // máy xúc
  A.exc = new THREE.Group(); const tr = box(4.5, 1, 3, std('#2c2c2c')); tr.position.y = 0.5; A.exc.add(tr); const ub = new THREE.Group(); ub.position.y = 1.2; A.exc.add(ub); const hull = box(3.4, 2, 2.6, orange); hull.position.y = 1; ub.add(hull); const cabE = box(1.4, 1.6, 1.4, std('#1d2733', { roughness: 0.2 })); cabE.position.set(0.6, 2.6, 0.5); ub.add(cabE);
  const arm1 = new THREE.Group(); arm1.position.set(1.6, 1.6, -0.4); ub.add(arm1); const a1 = box(4.2, 0.5, 0.5, orange); a1.position.x = 2.1; arm1.add(a1); const arm2 = new THREE.Group(); arm2.position.x = 4.2; arm1.add(arm2); const a2 = box(3, 0.4, 0.4, orange); a2.position.x = 1.5; arm2.add(a2); const bucket = box(0.9, 0.9, 1.2, std('#555')); bucket.position.x = 3; arm2.add(bucket);
  A.exc.position.set(8, 0, 8); A.exc.rotation.y = 2.4; G.add(A.exc); A.excArms = { ub, arm1, arm2 };
  // hàng rào + băng rôn
  const banT = ctex(1024, 200, (g, W, H) => { g.fillStyle = '#006778'; g.fillRect(0, 0, W, H); g.fillStyle = '#fff'; g.font = '900 86px Arial'; g.textBaseline = 'middle'; g.fillText('JACKSONVILLE · UNDER CONSTRUCTION', 24, H / 2 + 4); });
  for (let i = 0; i < 12; i++) { const fp = box(3.5, 2, 0.05, std('#bdc3c7', { metalness: 0.6, wireframe: false, transparent: true, opacity: 0.55 })); fp.position.set(-21 + i * 3.6, 1, 26); G.add(fp); const ft = cyl(0.04, 0.04, 2.1, std('#7f8c8d')); ft.position.set(-22.8 + i * 3.6, 1, 26); G.add(ft); }
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.7), new THREE.MeshBasicMaterial({ map: banT })); ban.position.set(-1, 1.6, 26.05); G.add(ban);
  for (let i = 0; i < 9; i++) { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 12), orange); cone.position.set(-14 + i * 3.4, 0.35, 21); G.add(cone); }
  // đống thép, ống cống, xe bồn
  for (let i = 0; i < 8; i++) { const pipe = cyl(0.6, 0.6, 5, conc, 16); pipe.rotation.z = Math.PI / 2; pipe.position.set(20 + (i % 4) * 0.2, 0.6 + Math.floor(i / 4) * 1.1, 12 + (i % 4) * 1.25); G.add(pipe); }
  // trời
  const sky = skyDusk(700); sky.position.copy(at); A.sky = sky;
  A.update = (t) => { A.cranes.forEach((c, i) => { c.top.rotation.y = c.rot + Math.sin(t * 0.15 + i * 2) * 0.6; c.trolley.position.x = 20 + Math.sin(t * 0.3 + i) * 8; }); A.excArms.ub.rotation.y = Math.sin(t * 0.6) * 0.5; A.excArms.arm1.rotation.z = 0.35 + Math.sin(t * 0.9) * 0.2; A.excArms.arm2.rotation.z = -0.9 + Math.sin(t * 1.1 + 1) * 0.35; };
  return A;
}

// ---------- PHỐ LONDON MINH HOẠ ----------
export function london(at = new THREE.Vector3(500, 0, 0)) {
  const G = new THREE.Group(); G.position.copy(at); const A = { G }; const R = rnd(9);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(300, 14), std('#3a3c40', { roughness: 0.8 })); road.rotation.x = -Math.PI / 2; road.receiveShadow = true; G.add(road);
  const lineT = ctex(512, 64, (g, W, H) => { g.fillStyle = '#3a3c40'; g.fillRect(0, 0, W, H); g.fillStyle = '#eee'; for (let x = 0; x < W; x += 128) g.fillRect(x, 28, 70, 8); }); lineT.wrapS = THREE.RepeatWrapping; lineT.repeat.set(40, 1);
  const lm = new THREE.Mesh(new THREE.PlaneGeometry(300, 1), std('#fff', { map: lineT })); lm.rotation.x = -Math.PI / 2; lm.position.y = 0.01; G.add(lm);
  for (const z of [-9.5, 9.5]) { const sw = box(300, 0.25, 5, std('#9da3a8', { roughness: 0.9 })); sw.position.set(0, 0.12, z); sw.receiveShadow = true; G.add(sw); }
  // nhà phố gạch có cửa sổ
  const facade = (c) => ctex(512, 1024, (g, W, H) => { g.fillStyle = c; g.fillRect(0, 0, W, H); const r2 = rnd(c.length * 7); for (let i = 0; i < 3000; i++) { g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(r2() * W, r2() * H, 10, 4); } for (let y = 80; y < H - 120; y += 170) for (let x = 50; x < W - 60; x += 140) { g.fillStyle = '#e8e2d5'; g.fillRect(x - 6, y - 6, 92, 132); g.fillStyle = r2() < 0.3 ? '#ffd98a' : '#2b3440'; g.fillRect(x, y, 80, 120); g.fillStyle = '#e8e2d5'; g.fillRect(x + 37, y, 6, 120); g.fillRect(x, y + 56, 80, 6); } g.fillStyle = '#1d3a2a'; g.fillRect(W / 2 - 50, H - 200, 100, 200); });
  for (const side of [-1, 1]) for (let i = 0; i < 20; i++) { const h = 14 + R() * 8, w = 9 + R() * 4; const c = ['#8b4a3a', '#a65d45', '#c7b49a', '#7a3e2f', '#d6c8ad'][Math.floor(R() * 5)]; const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 10), [std(c), std(c), std('#555'), std(c), std('#fff', { map: facade(c) }), std('#fff', { map: facade(c) })]); b.position.set(-110 + i * 11.5, h / 2, side * 17); G.add(b); const roof = box(w + 0.4, 0.6, 10.4, std('#444')); roof.position.set(b.position.x, h, b.position.z); G.add(roof); }
  // tháp đồng hồ kiểu gothic (chung chung)
  const tower = new THREE.Group(); const stone = std('#cdb98f', { roughness: 0.8 }); const shaft = box(9, 60, 9, stone); shaft.position.y = 30; tower.add(shaft);
  for (let y = 4; y < 58; y += 4) for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const rib = box(dz ? 7.5 : 0.25, 0.4, dx ? 7.5 : 0.25, std('#b8a47a')); rib.position.set(dx * 4.55, y, dz * 4.55); tower.add(rib); }
  const clockT = ctex(512, 512, (g, W, H) => { g.fillStyle = '#e8d8a6'; g.fillRect(0, 0, W, H); g.fillStyle = '#f7f1dc'; g.beginPath(); g.arc(256, 256, 220, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 10; g.stroke(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.fillStyle = '#222'; g.fillRect(256 + Math.cos(a) * 185 - 8, 256 + Math.sin(a) * 185 - 8, 16, 16); } });
  A.hands = [];
  for (const [ry, dx, dz] of [[0, 0, 1], [Math.PI, 0, -1], [Math.PI / 2, 1, 0], [-Math.PI / 2, -1, 0]]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), std('#fff', { map: clockT, emissive: '#fff4d0', emissiveIntensity: 0.25 })); f.position.set(dx * 4.6, 63, dz * 4.6); f.rotation.y = ry; tower.add(f); const hh = box(0.25, 2.2, 0.1, std('#111')); hh.geometry.translate(0, 1, 0); hh.position.set(dx * 4.7, 63, dz * 4.7); hh.rotation.y = ry; tower.add(hh); const mh = box(0.18, 3, 0.1, std('#111')); mh.geometry.translate(0, 1.4, 0); mh.position.copy(hh.position); mh.rotation.y = ry; tower.add(mh); A.hands.push(hh, mh); }
  const belfry = box(10, 10, 10, stone); belfry.position.y = 63; tower.add(belfry); const spire = new THREE.Mesh(new THREE.ConeGeometry(6.5, 24, 4), std('#3f4a45', { metalness: 0.4 })); spire.rotation.y = Math.PI / 4; spire.position.y = 80; tower.add(spire);
  for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const pin = new THREE.Mesh(new THREE.ConeGeometry(0.9, 8, 4), stone); pin.position.set(dx * 4.5, 72, dz * 4.5); tower.add(pin); }
  tower.position.set(60, 0, -40); G.add(tower);
  // xe buýt 2 tầng đỏ (không chữ)
  A.bus = new THREE.Group(); const red = std('#c8102e', { roughness: 0.4 }); const bb = new THREE.Mesh(new RoundedBoxGeometry(11, 4.2, 2.5, 3, 0.25), red); bb.position.y = 2.6; A.bus.add(bb);
  const winT = ctex(1024, 128, (g, W, H) => { g.fillStyle = '#1d2733'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8102e'; for (let x = 0; x < W; x += 128) g.fillRect(x, 0, 12, H); });
  for (const y of [2.1, 3.9]) for (const z of [1.26, -1.26]) { const wm = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.9), std('#fff', { map: winT, roughness: 0.2 })); wm.position.set(0, y, z); if (z < 0) wm.rotation.y = Math.PI; A.bus.add(wm); }
  const wf = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.4), std('#1d2733', { roughness: 0.15 })); wf.position.set(5.51, 2.4, 0); wf.rotation.y = Math.PI / 2; A.bus.add(wf);
  A.busWheels = []; for (const x of [-3.6, 3.4]) for (const z of [1.2, -1.2]) { const wh = cyl(0.55, 0.55, 0.35, std('#111'), 16); wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.55, z); A.bus.add(wh); A.busWheels.push(wh); }
  A.bus.position.set(0, 0, -3); G.add(A.bus);
  // cột đèn + hộp thư đỏ chung chung
  for (let i = 0; i < 14; i++) { const lp = cyl(0.12, 0.15, 5, std('#222')); lp.position.set(-80 + i * 13, 2.5, 7.8); G.add(lp); const lmp = box(0.5, 0.6, 0.5, std('#fff3c4', { emissive: '#ffd27f', emissiveIntensity: 0.8 })); lmp.position.set(lp.position.x, 5.2, 7.8); G.add(lmp); }
  const pb = cyl(0.35, 0.35, 1.5, std('#c8102e'), 16); pb.position.set(6, 0.75, 8.5); G.add(pb);
  // người đi bộ với ô? không (ô đã dùng E06) → người kéo vali
  const spots = []; for (let i = 0; i < 30; i++) spots.push([-60 + i * 4 + R() * 2, (R() < 0.5 ? -1 : 1) * (9 + R() * 1.5), R() < 0.5 ? Math.PI / 2 : -Math.PI / 2]);
  A.crowd = passengers(G, spots, 17);
  // trời u ám
  const skyT = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#6f7c88'); gr.addColorStop(0.5, '#b7bec4'); gr.addColorStop(1, '#c9cdd0'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  A.sky = new THREE.Mesh(new THREE.SphereGeometry(650, 32, 16), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false })); A.sky.position.copy(at);
  A.update = (t, busX) => { A.bus.position.x = busX ?? (-40 + ((t * 6) % 120)); A.busWheels.forEach((w) => (w.rotation.y = -A.bus.position.x / 0.55)); A.hands.forEach((h, i) => (h.rotation.z = -(i % 2 ? t * 0.6 : t * 0.05))); A.crowd.update(t); };
  return A;
}

// ---------- CỔNG B12 ----------
export function gateB12(at = new THREE.Vector3(-500, 0, 0)) {
  const G = new THREE.Group(); G.position.copy(at); const A = { G };
  const carpT = ctex(512, 512, (g, W, H) => { g.fillStyle = '#2f3b4c'; g.fillRect(0, 0, W, H); const R = rnd(3); for (let i = 0; i < 20000; i++) { g.fillStyle = ['#36465a', '#27323f', '#3d4d63', '#006778'][Math.floor(R() * 4)]; g.fillRect(R() * W, R() * H, 2, 2); } }); carpT.wrapS = carpT.wrapT = THREE.RepeatWrapping; carpT.repeat.set(12, 8);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), std('#fff', { map: carpT, roughness: 1 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; G.add(fl);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), std('#e9e7e2', { side: THREE.DoubleSide })); ceil.rotation.x = Math.PI / 2; ceil.position.y = 6; G.add(ceil);
  for (let x = -24; x <= 24; x += 4) { const l = box(1.2, 0.05, 1.2, std('#fff', { emissive: '#fff8e8', emissiveIntensity: 2 })); l.position.set(x, 5.95, 0); G.add(l); }
  // tường kính + máy bay + ống lồng
  const glass = new THREE.MeshPhysicalMaterial({ color: '#cfe6f2', transparent: true, opacity: 0.15, roughness: 0.05 }); const pane = new THREE.Mesh(new THREE.PlaneGeometry(60, 6), glass); pane.position.set(0, 3, -12); G.add(pane);
  for (let x = -30; x <= 30; x += 2.5) { const m = box(0.12, 6, 0.2, std('#3b4148', { metalness: 0.7 })); m.position.set(x, 3, -12); G.add(m); }
  const tar = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), std('#4a4d52', { roughness: 0.85 })); tar.rotation.x = -Math.PI / 2; tar.position.set(0, -0.03, -110); G.add(tar);
  const pl = airliner(1); pl.position.set(-6, 4.1, -32); pl.rotation.y = Math.PI / 2 - 0.08; G.add(pl);
  const jb = box(14, 3, 3, std('#c7ccd2', { metalness: 0.5 })); jb.position.set(-6, 3, -20); jb.rotation.y = Math.PI / 2; G.add(jb);
  // quầy cổng + biển B12 + màn hình FINAL CALL
  const desk = new THREE.Mesh(new RoundedBoxGeometry(5, 1.1, 1.1, 3, 0.08), std('#1f2a36', { roughness: 0.4 })); desk.position.set(4, 0.55, -6); G.add(desk); const top = box(5.2, 0.06, 1.3, std('#c9ced4', { metalness: 0.6, roughness: 0.25 })); top.position.set(4, 1.13, -6); G.add(top);
  const b12T = ctex(512, 512, (g, W, H) => { g.fillStyle = '#f6c90e'; g.fillRect(0, 0, W, H); g.fillStyle = '#111'; g.font = '900 300px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('B12', W / 2, H / 2 + 14); });
  const b12 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.2), [std('#f6c90e'), std('#f6c90e'), std('#f6c90e'), std('#f6c90e'), new THREE.MeshBasicMaterial({ map: b12T }), new THREE.MeshBasicMaterial({ map: b12T })]); b12.position.set(0.5, 4.4, -6.5); G.add(b12);
  A.board = departureBoard([['19:15', 'NASHVILLE', 'B12', 'FINAL CALL'], ['20:10', 'NEW YORK', 'B7', 'ON TIME'], ['22:30', 'LONDON', 'B9', 'ON TIME']], { w: 4.2, title: 'GATE B12' }); A.board.position.set(4, 3.6, -6.55); G.add(A.board);
  // dãy ghế chờ
  const seatM = std('#22303c', { roughness: 0.5 }); for (let r = 0; r < 4; r++) for (let i = 0; i < 10; i++) { const s = box(0.55, 0.08, 0.55, seatM); s.position.set(-8 + i * 0.6, 0.45, -1 + r * 2.2); G.add(s); const bk = box(0.55, 0.55, 0.06, seatM); bk.position.set(-8 + i * 0.6, 0.75, -0.72 + r * 2.2); G.add(bk); }
  const spots = []; const R = rnd(13); for (let i = 0; i < 26; i++) spots.push([-9 + R() * 18, -3 + R() * 9, R() * 6.28]); A.crowd = passengers(G, spots, 29);
  A.update = (t) => { A.board.userData.update(t); A.crowd.update(t); };
  return A;
}

// ---------- PHÒNG CHỜ HẠNG THƯƠNG GIA (bàn bình luận) ----------
export function lounge(at = new THREE.Vector3(0, 0, -500)) {
  const G = new THREE.Group(); G.position.copy(at); const A = { G };
  const wood = ctex(512, 512, (g, W, H) => { g.fillStyle = '#6b4a2f'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 3) { g.fillStyle = `rgba(${40 + (y * 7) % 30},${25 + (y * 3) % 20},10,0.25)`; g.fillRect(0, y, W, 2); } for (let x = 0; x < W; x += 64) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, 0, 3, H); } }); wood.wrapS = wood.wrapT = THREE.RepeatWrapping; wood.repeat.set(4, 2);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), std('#3c3530', { roughness: 0.6 })); fl.rotation.x = -Math.PI / 2; G.add(fl);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(30, 6), std('#fff', { map: wood })); back.position.set(0, 3, -6); G.add(back);
  // cửa sổ lớn sau lưng nhìn đường băng hoàng hôn
  const win = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.6), new THREE.MeshBasicMaterial({ map: ctex(1024, 400, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5b86c4'); gr.addColorStop(0.55, '#f5c27f'); gr.addColorStop(0.6, '#4a4d52'); gr.addColorStop(1, '#3a3d42'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#f3f4f6'; g.fillRect(300, 175, 420, 40); g.beginPath(); g.moveTo(300, 175); g.lineTo(250, 120); g.lineTo(330, 175); g.fill(); g.fillStyle = '#f2c230'; g.fillRect(0, 300, W, 6); }) }));
  win.position.set(0, 3.1, -5.95); G.add(win);
  for (const x of [-5, -2.5, 0, 2.5, 5]) { const m = box(0.12, 3.8, 0.1, std('#2a2a2a', { metalness: 0.6 })); m.position.set(x, 3.1, -5.9); G.add(m); }
  // bàn + 2 ghế bành + cốc cà phê + màn hình
  const desk = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.9, 1.2, 3, 0.1), std('#151a22', { roughness: 0.3, metalness: 0.3 })); desk.position.set(0, 0.45, -1.6); G.add(desk);
  const deskTop = box(3.8, 0.05, 1.35, std('#d9d4cb', { roughness: 0.25 })); deskTop.position.set(0, 0.92, -1.6); G.add(deskTop);
  const frontT = ctex(1024, 256, (g, W, H) => { g.fillStyle = '#006778'; g.fillRect(0, 0, W, H); g.fillStyle = '#f6c90e'; g.font = '900 100px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TERMINAL SPORTS', W / 2, H / 2 + 6); });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.6), new THREE.MeshBasicMaterial({ map: frontT })); front.position.set(0, 0.5, -0.99); G.add(front);
  for (const x of [-0.8, 0.8]) { const cup = cyl(0.045, 0.04, 0.12, std('#ffffff')); cup.position.set(x + 0.3, 0.99, -1.4); G.add(cup); const lidc = cyl(0.047, 0.047, 0.02, std('#222')); lidc.position.set(x + 0.3, 1.06, -1.4); G.add(lidc); }
  for (const x of [-4.5, 4.5]) { const sofa = new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.8, 1, 3, 0.15), std('#7a3e2f', { roughness: 0.8 })); sofa.position.set(x, 0.4, -3.8); G.add(sofa); const plant = cyl(0.3, 0.25, 0.6, std('#d9d4cb')); plant.position.set(x * 1.4, 0.3, -5); G.add(plant); const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), std('#2f6b3a')); leaves.position.set(x * 1.4, 1.2, -5); G.add(leaves); }
  const lamp = new THREE.PointLight('#ffd9a0', 6, 12); lamp.position.set(0, 4.5, 0); G.add(lamp);
  A.update = () => {};
  return A;
}
