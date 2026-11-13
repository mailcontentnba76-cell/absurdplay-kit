// Tập 17 (NFL × bóng đá, troll) — "Could Harry Kane kick for the Patriots in Munich?"
// Sân vận động châu Âu HƯ CẤU: khán đài dốc đứng màu xanh navy sẫm, mặt tiền ốp tấm kim cương phát sáng ngọc trai,
// mái vòng tối, nắng thu thấp màu hổ phách. Mặt sân "lai": nửa trái kẻ vạch bóng đá (vòng cấm, chấm phạt đền, khung thành lưới),
// nửa phải kẻ vạch yard NFL + end zone navy trơn + cột dọc vàng. Bên ngoài: bãi đỗ xe (gag "đi lùi ra tận bãi xe").
// Không tên sân, không logo, không biển hiệu thật. Không trùng các tập trước (E01 svd trong nhà, E04 bãi xe bán ô tô ngày nắng).
import * as THREE from 'three';
const YD = 0.9144;
export const FL = 120 * YD, FW = 53.33 * YD;
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
const rnd = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function ctex(w, h, draw, repeat, aniso = 8) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
// toạ độ: x dọc sân (âm = phía bóng đá, dương = phía NFL), z ngang sân (+z = phía băng ghế đội nhà), y lên
export const X = { midline: 0, nflGoal: 50 * YD, endLine: 60 * YD, soccerGoal: -60 * YD, fgSpot: 60 * YD - 50 * YD, curlSpot: 60 * YD - 27 * YD, pen: -60 * YD + 11 };
export const BENCH = { x: 4, z: FW / 2 + 3.6 };
export const LOT = { x: -150, z: 10 };
export const NFL = { navy: '#22407a', red: '#c60c30', silver: '#b0b7bc' };
export const LIONS = { blue: '#0076b6', silver: '#b0b7bc' };

function fieldTexture() {
  return ctex(4096, 1820, (g, W, H) => {
    const px = W / 120, mz = (m) => (m / YD) * px; // yard → px
    for (let i = 0; i < 24; i++) { g.fillStyle = i % 2 ? '#3f8a3a' : '#4a9842'; g.fillRect(i * 5 * px, 0, 5 * px, H); }
    // phía NFL: end zone navy trơn (không chữ) + vạch yard
    g.fillStyle = NFL.navy; g.fillRect(110 * px, 0, 10 * px, H);
    g.fillStyle = 'rgba(255,255,255,0.12)'; for (let k = 0; k < 18; k++) { g.save(); g.translate(110 * px + k * px * 1.2, 0); g.rotate(0.6); g.fillRect(0, -50, px * 0.25, H * 1.6); g.restore(); }
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, W, px * 0.3); g.fillRect(0, H - px * 0.3, W, px * 0.3);
    g.fillRect(W - px * 0.3, 0, px * 0.3, H); g.fillRect(0, 0, px * 0.3, H);
    for (let y = 60; y <= 110; y += 5) g.fillRect(y * px - px * 0.12, 0, px * 0.24, H);
    for (let y = 61; y < 110; y++) { if (y % 5 === 0) continue; for (const yy of [0.02, 0.36, 0.62, 0.96]) g.fillRect(y * px - px * 0.06, H * yy - px * 0.4, px * 0.12, px * 0.8); }
    g.font = `700 ${px * 2.2}px Oswald, Anton, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let y = 60; y <= 100; y += 10) { const n = 110 - y; for (const [yy, rot] of [[0.16, Math.PI], [0.84, 0]]) { g.save(); g.translate(y * px, H * yy); g.rotate(rot); g.fillText(String(n), 0, 0); g.restore(); } }
    // phía bóng đá: vạch giữa sân, vòng tròn giữa sân, vòng cấm, khu 5m50, chấm phạt đền + cung
    g.strokeStyle = '#ffffff'; g.lineWidth = px * 0.22; const cy = H / 2, gx = px * 0.3;
    g.beginPath(); g.arc(60 * px, cy, mz(9.15), 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(60 * px, cy, px * 0.4, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
    g.strokeRect(gx, cy - mz(20.16), mz(16.5), mz(40.32)); g.strokeRect(gx, cy - mz(9.16), mz(5.5), mz(18.32));
    g.beginPath(); g.arc(gx + mz(11), cy, px * 0.35, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(gx + mz(11), cy, mz(9.15), -0.93, 0.93); g.stroke();
    for (const s of [0, H]) { g.beginPath(); g.arc(gx, s, mz(1), s ? -Math.PI / 2 : 0, s ? 0 : Math.PI / 2); g.stroke(); }
  }, null, 16);
}
function crowdTexture(seed = 3) {
  const r = rnd(seed);
  return ctex(2048, 1024, (g, W, H) => {
    g.fillStyle = '#1a2240'; g.fillRect(0, 0, W, H);
    const cw = 6, ch = 8, aisle = 190, pal = [NFL.navy, NFL.red, '#e8e8ec', LIONS.blue, LIONS.silver, '#c8102e', '#2a4a8a'];
    for (let y = 0; y < H; y += ch) {
      for (let x = (y / ch % 2) * 3; x < W; x += cw) {
        if (x % aisle < 12 || r() < 0.06) continue;
        g.fillStyle = r() < 0.75 ? pal[Math.floor(r() * pal.length)] : `hsl(${220 + r() * 40},${15 + r() * 30}%,${25 + r() * 40}%)`; g.fillRect(x, y + 3, cw - 1, ch - 3);
        g.fillStyle = ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'][Math.floor(r() * 5)]; g.fillRect(x + 1, y, cw - 3, 3);
      }
      g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, y + ch - 1, W, 1);
    }
    for (let x = 0; x < W; x += aisle) { g.fillStyle = '#2a3250'; g.fillRect(x, 0, 12, H); }
  }, [1, 1]);
}
// băng LED quảng cáo chạy quanh sân (chữ chung chung, không thương hiệu)
export function ledTexture(text) {
  return ctex(2048, 96, (g, W, H) => {
    g.fillStyle = '#0a1430'; g.fillRect(0, 0, W, H); g.font = '900 60px Anton, Impact, sans-serif'; g.textBaseline = 'middle';
    let x = 20, i = 0; while (x < W) { g.fillStyle = i++ % 2 ? '#ffb347' : '#ffffff'; g.fillText(text, x, H / 2 + 2); x += g.measureText(text).width + 24; g.fillStyle = '#e8343c'; g.fillText('◆', x, H / 2); x += 70; }
  }, [1, 1]);
}
// mặt tiền: tấm đệm hình kim cương phát sáng ngọc trai (trắng ấm, mép đỏ nhạt)
function panelTexture() {
  return ctex(512, 512, (g, W, H) => {
    g.fillStyle = '#1e1c26'; g.fillRect(0, 0, W, H);
    const n = 2, w = W / n, h = H / n;
    for (let i = -1; i <= n; i++) for (let j = -1; j <= n * 2; j++) {
      const cx = i * w + (j % 2 ? w / 2 : 0), cy = j * h / 2;
      const gr = g.createRadialGradient(cx, cy, 2, cx, cy, w * 0.55); gr.addColorStop(0, '#fff6ea'); gr.addColorStop(0.6, '#f4dccc'); gr.addColorStop(1, '#d88a84');
      g.fillStyle = gr; g.beginPath(); g.moveTo(cx, cy - h / 2 + 9); g.lineTo(cx + w / 2 - 9, cy); g.lineTo(cx, cy + h / 2 - 9); g.lineTo(cx - w / 2 + 9, cy); g.closePath(); g.fill();
    }
  }, [1, 1]);
}
function ringPath(a, b, r, n = 180) {
  const pts = [], cx = a - r, cz = b - r, seg = [2 * cx, Math.PI * r / 2, 2 * cz, Math.PI * r / 2, 2 * cx, Math.PI * r / 2, 2 * cz, Math.PI * r / 2];
  const L = seg.reduce((x, y) => x + y, 0);
  const sh = [(s) => [-cx + s, b], (s) => { const t = Math.PI / 2 - s / r; return [cx + r * Math.cos(t), cz + r * Math.sin(t)]; }, (s) => [a, cz - s], (s) => { const t = -s / r; return [cx + r * Math.cos(t), -cz + r * Math.sin(t)]; },
    (s) => [cx - s, -b], (s) => { const t = -Math.PI / 2 - s / r; return [-cx + r * Math.cos(t), -cz + r * Math.sin(t)]; }, (s) => [-a, -cz + s], (s) => { const t = Math.PI - s / r; return [-cx + r * Math.cos(t), cz + r * Math.sin(t)]; }];
  for (let i = 0; i < n; i++) { let d = (i / n) * L; for (let k = 0; k < 8; k++) { if (d <= seg[k] || k === 7) { pts.push(sh[k](Math.min(d, seg[k]))); break; } d -= seg[k]; } }
  return pts;
}
function band(a, b, r, off0, y0, off1, y1, mat, uRep = 40) {
  const p0 = ringPath(a + off0, b + off0, r + off0), p1 = ringPath(a + off1, b + off1, r + off1), n = p0.length, pos = [], uv = [], idx = [];
  for (let i = 0; i <= n; i++) { const A = p0[i % n], B = p1[i % n]; pos.push(A[0], y0, A[1], B[0], y1, B[1]); const u = (1 - i / n) * uRep; uv.push(u, 0, u, 1); if (i < n) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat); m.receiveShadow = true; return m;
}
// khung thành bóng đá (trắng) có lưới
export function soccerGoal() {
  const G = new THREE.Group(), m = std('#f6f6f6', { roughness: 0.35, metalness: 0.2 }), r = 0.06, w = 7.32, h = 2.44, d = 2.0;
  const tube = (a, b, rr = r, mm = m) => { const v = new THREE.Vector3().subVectors(b, a); const c = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, v.length(), 10), mm); c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize()); c.castShadow = true; G.add(c); };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  tube(V(0, 0, -w / 2), V(0, h, -w / 2)); tube(V(0, 0, w / 2), V(0, h, w / 2)); tube(V(0, h, -w / 2), V(0, h, w / 2));
  const bm = std('#d8d8d8', { roughness: 0.5 }); tube(V(0, h, -w / 2), V(-d, 0.1, -w / 2), 0.025, bm); tube(V(0, h, w / 2), V(-d, 0.1, w / 2), 0.025, bm); tube(V(-d, 0.03, -w / 2), V(-d, 0.03, w / 2), 0.025, bm);
  const net = ctex(256, 256, (g, W, H) => { g.clearRect(0, 0, W, H); g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 1.2; for (let i = 0; i <= W; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); } }, [6, 3]);
  const nm = new THREE.MeshBasicMaterial({ map: net, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.5 });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, Math.hypot(d, h)), nm); back.rotation.y = Math.PI / 2; back.rotation.x = 0; back.position.set(-d / 2, h / 2, 0); back.rotateX(Math.atan2(d, h)); G.add(back);
  for (const s of [-1, 1]) { const sg = new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, h, 0), V(-d, 0, 0)]); sg.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0], 2)); const sm = new THREE.Mesh(sg, nm); sm.position.z = s * w / 2; G.add(sm); }
  G.userData.net = back; return G;
}
// cột dọc NFL vàng (cổ ngỗng), xà ngang cao 3,05 m, hai cột dọc cách nhau 5,64 m
export function goalpost() {
  const G = new THREE.Group(), m = std('#ffd23a', { roughness: 0.35, metalness: 0.25 }), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const tube = (a, b, r) => { const v = new THREE.Vector3().subVectors(b, a); const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), 12), m); c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize()); c.castShadow = true; G.add(c); return c; };
  tube(V(1.8, 0, 0), V(1.8, 2.4, 0), 0.12); tube(V(1.8, 2.4, 0), V(0, 3.05, 0), 0.1);
  tube(V(0, 3.05, -2.82), V(0, 3.05, 2.82), 0.08);
  const up = [tube(V(0, 3.05, -2.82), V(0, 12.2, -2.82), 0.06), tube(V(0, 3.05, 2.82), V(0, 12.2, 2.82), 0.06)];
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16), std(NFL.navy, { roughness: 0.7 })); pad.position.set(1.8, 1.0, 0); pad.castShadow = true; G.add(pad);
  for (const z of [-2.82, 2.82]) { const rib = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 1.2), new THREE.MeshBasicMaterial({ color: '#e8343c', side: THREE.DoubleSide })); rib.position.set(0, 12.6, z); G.add(rib); }
  G.userData.up = up; return G;
}
// bóng đá trắng mảng ngũ giác đen
export function soccerBall(r = 0.11) {
  const tx = ctex(512, 256, (g, W, H) => { g.fillStyle = '#f8f8f6'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1a22';
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { const cx = (i + (j % 2) * 0.5) * W / 6, cy = (j + 0.5) * H / 4; g.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 2 * Math.PI / 5 - Math.PI / 2; g.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22 * 1.6); } g.closePath(); g.fill(); } });
  const b = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), std('#ffffff', { map: tx, roughness: 0.4 })); b.castShadow = true; return b;
}
export function kickTee() { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.06, 12), std('#f07a1a', { roughness: 0.6 })); t.position.y = 0.03; t.castShadow = true; const G = new THREE.Group(); G.add(t); return G; }
// cờ phạt vàng (khăn + cục nặng)
export function yellowFlag() {
  const G = new THREE.Group(); const m = std('#ffd400', { roughness: 0.7, side: THREE.DoubleSide });
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34, 6, 6), m); cl.castShadow = true; G.add(cl);
  const wgt = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), std('#e8c800')); wgt.position.set(0, 0, 0); G.add(wgt);
  G.userData.cloth = cl; return G;
}
// mũ bảo hiểm cầm tay (bạc trơn, lưới navy)
export function helmetProp() {
  const G = new THREE.Group();
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), std(NFL.silver, { roughness: 0.25, metalness: 0.5 })); sh.scale.set(1, 1.05, 1.18); sh.castShadow = true; G.add(sh);
  const mm = std(NFL.navy, { roughness: 0.4 });
  for (const y of [-0.02, -0.07]) { const bar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.008, 6, 20, Math.PI * 0.9), mm); bar.rotation.set(Math.PI / 2, 0, Math.PI * 0.05 + Math.PI); bar.position.set(0, y, 0.02); bar.scale.set(1, 1.15, 1); G.add(bar); }
  const vb = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08, 0.012), mm); vb.position.set(0, -0.045, 0.16); G.add(vb);
  return G;
}
// băng đội trưởng
export function armband(ch) {
  const b = ch.bones.upperarm_l; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.06, 16, 1, true), std('#ffd23a', { roughness: 0.5, side: THREE.DoubleSide }));
  ch.root.updateMatrixWorld(true); const a = b.getWorldPosition(new THREE.Vector3()), c = ch.bones.lowerarm_l.getWorldPosition(new THREE.Vector3());
  m.position.copy(a).lerp(c, 0.35); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.clone().sub(a).normalize()); ch.root.add(m); b.attach(m); return m;
}
// chó hoạt hình (lông vàng / kem), vòng cổ + thẻ tên. d.pose(t, đang chạy 0..1, vẫy đuôi)
export function dog(name, fur = '#d9a35a', seed = 1) {
  const G = new THREE.Group(), M = std(fur, { roughness: 0.9 }), D = std('#2a1a12', { roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.36, 6, 12), M); body.rotation.z = Math.PI / 2; body.position.y = 0.42; G.add(body);
  const head = new THREE.Group(); head.position.set(0.32, 0.6, 0); G.add(head);
  const sk = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), M); head.add(sk);
  const sn = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.08, 4, 10), M); sn.rotation.z = Math.PI / 2; sn.position.set(0.13, -0.04, 0); head.add(sn);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), D); nose.position.set(0.23, -0.02, 0); head.add(nose);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), D); e.position.set(0.1, 0.04, s * 0.07); head.add(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 4), new THREE.MeshBasicMaterial({ color: '#fff' })); hl.position.set(0.12, 0.05, s * 0.072); head.add(hl);
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 8), std(new THREE.Color(fur).multiplyScalar(0.75), { roughness: 0.9 })); ear.position.set(-0.02, -0.02, s * 0.13); ear.rotation.x = s * 0.25; head.add(ear); }
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, 0.04), std('#e86a7a')); tongue.position.set(0.18, -0.1, 0); head.add(tongue);
  const col = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 8, 20), std(name === 'BRADY' ? NFL.navy : NFL.red)); col.rotation.y = Math.PI / 2; col.position.set(0.25, 0.5, 0); col.rotation.z = 0.5; G.add(col);
  const tag = ctex(256, 96, (g, W, H) => { g.fillStyle = '#ffd23a'; g.beginPath(); g.roundRect(4, 4, W - 8, H - 8, 30); g.fill(); g.fillStyle = '#1a1a22'; g.font = '900 62px Anton, Impact'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, W / 2, H / 2 + 3, W - 30); });
  const tg = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.075), new THREE.MeshBasicMaterial({ map: tag, side: THREE.DoubleSide })); tg.position.set(0.33, 0.39, 0); tg.rotation.y = Math.PI / 2; G.add(tg);
  const legs = []; for (const [x, z] of [[0.2, 0.09], [0.2, -0.09], [-0.2, 0.09], [-0.2, -0.09]]) { const L = new THREE.Group(); L.position.set(x, 0.4, z); const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.26, 4, 8), M); l.position.y = -0.2; L.add(l); G.add(L); legs.push(L); }
  const tail = new THREE.Group(); tail.position.set(-0.32, 0.5, 0); const tl = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.2, 4, 8), M); tl.position.y = 0.12; tail.add(tl); tail.rotation.z = 0.7; G.add(tail);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  const pose = (t, run = 0, wag = 1) => { const ph = t * (8 + run * 6) + seed; legs.forEach((L, i) => { L.rotation.z = Math.sin(ph + (i === 1 || i === 2 ? Math.PI : 0)) * 0.6 * run; });
    body.position.y = 0.42 + Math.abs(Math.sin(ph)) * 0.04 * run; head.position.y = 0.6 + Math.sin(ph * 2) * 0.02 * run; head.rotation.z = 0.15 * (1 - run);
    tail.rotation.x = Math.sin(t * 22 + seed) * 0.7 * wag; tongue.visible = true; };
  return { G, pose, head };
}
// ô tô đỗ (hộp bo đơn giản, không hãng)
function car(col, seed) {
  const G = new THREE.Group(), r = rnd(seed); const b = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.7, 1.8), std(col, { roughness: 0.3, metalness: 0.5 })); b.position.y = 0.6; G.add(b);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 1.6), std('#222832', { roughness: 0.1, metalness: 0.6 })); cab.position.set(-0.2, 1.2, 0); G.add(cab);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.62), std(col, { roughness: 0.3, metalness: 0.5 })); roof.position.set(-0.2, 1.5, 0); G.add(roof);
  for (const [x, z] of [[1.35, 0.85], [1.35, -0.85], [-1.35, 0.85], [-1.35, -0.85]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16), std('#151515')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.34, z); G.add(w); }
  for (const z of [-0.6, 0.6]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.3), new THREE.MeshBasicMaterial({ color: '#ffe8b8' })); l.position.set(2.16, 0.72, z); G.add(l); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// băng ghế đội (sideline): ghế dài navy có mái che, thùng nước cam, bàn chiến thuật
function bench(G) {
  const B = new THREE.Group(); B.position.set(BENCH.x, 0, BENCH.z); G.add(B);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(6, 0.08, 0.45), std(NFL.navy, { roughness: 0.6 })); seat.position.y = 0.45; seat.castShadow = true; B.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 0.06), std(NFL.navy, { roughness: 0.6 })); back.position.set(0, 0.75, 0.24); back.castShadow = true; B.add(back);
  for (const x of [-2.8, -1, 1, 2.8]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.4), std('#8a9098', { metalness: 0.6, roughness: 0.4 })); l.position.set(x, 0.225, 0); B.add(l); }
  const cool = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 18), std('#f07a1a', { roughness: 0.5 })); cool.position.set(3.6, 0.275 + 0.5, -0.1); cool.castShadow = true; B.add(cool);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 18), std('#f4f4f4')); lid.position.set(3.6, 1.08, -0.1); B.add(lid);
  const tbl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), std('#e8e8ec')); tbl.position.set(3.6, 0.48, -0.1); tbl.castShadow = true; B.add(tbl);
  for (const [x, z] of [[3.25, -0.3], [3.95, -0.3], [3.25, 0.1], [3.95, 0.1]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.04), std('#8a9098')); l.position.set(x, 0.24, z); B.add(l); }
  for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.1, 10), std('#f4f4f4')); c.position.set(3.35 + (i % 3) * 0.1, 0.56, -0.25 + Math.floor(i / 3) * 0.1); B.add(c); }
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.06, 1.6), std('#20283c', { roughness: 0.4 })); canopy.position.set(0, 2.25, 0.25); canopy.rotation.x = -0.12; canopy.castShadow = false; B.add(canopy);
  return B;
}
export function buildArena(scene) {
  const G = new THREE.Group(); scene.add(G);
  const fm = std('#ffffff', { map: fieldTexture(), roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), fm); field.rotation.x = -Math.PI / 2; field.receiveShadow = true; G.add(field);
  const ap = new THREE.Mesh(new THREE.PlaneGeometry(FL + 24, FW + 22), std('#3c8236', { roughness: 1 })); ap.rotation.x = -Math.PI / 2; ap.position.y = -0.03; ap.receiveShadow = true; G.add(ap);
  // khán đài (dốc đứng kiểu châu Âu, sát sân)
  const A = FL / 2 + 7, Bh = FW / 2 + 7, R = 12;
  const led = band(A, Bh, R, 0, 0, 0, 1.1, new THREE.MeshBasicMaterial({ map: ledTexture('INTERNATIONAL GAME  •  SUNDAY FOOTBALL  •  WILLKOMMEN'), side: THREE.DoubleSide }), 16); G.add(led);
  const cm = std('#ffffff', { map: crowdTexture(3), roughness: 1, side: THREE.DoubleSide });
  const fac = std('#141a2c', { roughness: 0.9, side: THREE.DoubleSide });
  G.add(band(A, Bh, R, 0.4, 1.4, 18, 14, cm, 10));
  G.add(band(A, Bh, R, 0, 1.1, 0.4, 1.4, fac, 30));
  G.add(band(A, Bh, R, 18, 14, 18.4, 16.2, new THREE.MeshBasicMaterial({ map: ledTexture('MATCHDAY  •  FOOTBALL  •  GAME DAY'), side: THREE.DoubleSide }), 24));
  G.add(band(A, Bh, R, 18.4, 16.2, 32, 30, std('#ffffff', { map: crowdTexture(7), roughness: 1, side: THREE.DoubleSide }), 12));
  // mái vòng tối với mép trong sáng nhẹ
  const roofM = std('#3a4058', { roughness: 0.8, side: THREE.DoubleSide });
  G.add(band(A, Bh, R, 32, 30, 34, 33, roofM, 10)); G.add(band(A, Bh, R, 34, 33, 4, 37, roofM, 10));
  G.add(band(A, Bh, R, 3.6, 36.8, 4, 37, new THREE.MeshBasicMaterial({ color: '#fff0d8', side: THREE.DoubleSide }), 10));
  // mặt tiền ngoài phát sáng (chỉ nhìn thấy từ bãi xe)
  const pt = panelTexture(); pt.wrapS = pt.wrapT = THREE.RepeatWrapping; pt.repeat.set(36, 4);
  const pm = new THREE.MeshStandardMaterial({ map: pt, emissive: '#ffffff', emissiveMap: pt, emissiveIntensity: 0.55, roughness: 0.5, side: THREE.DoubleSide });
  const outer = band(A, Bh, R, 36, -0.05, 34, 37.5, pm, 1); G.add(outer);
  // đèn chiếu (dàn) trên mép mái — đốm sáng
  const lm = new THREE.MeshBasicMaterial({ color: '#fff4e0', toneMapped: false });
  ringPath(A + 5, Bh + 5, R + 5, 48).forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.35), lm); l.position.set(x, 36.4, z); l.lookAt(0, 0, 0); G.add(l); });
  // khung thành + cột dọc + băng ghế
  const SG = soccerGoal(); SG.position.set(X.soccerGoal, 0, 0); G.add(SG);
  const GP = goalpost(); GP.position.set(X.endLine, 0, 0); G.add(GP);
  const BN = bench(G);
  // ngoài sân: mặt đất + bãi xe
  const og = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), std('#5a6a4a', { roughness: 1 })); og.rotation.x = -Math.PI / 2; og.position.y = -0.08; og.receiveShadow = true; G.add(og);
  const lotT = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#4a4c54'; g.fillRect(0, 0, W, H); const r = rnd(9); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? 255 : 0},${r() < 0.5 ? 255 : 0},255,${r() * 0.04})`; g.fillRect(r() * W, r() * H, 3, 3); }
    g.fillStyle = '#f2f2f2'; for (let i = 0; i < 14; i++) { g.fillRect(i * 74 + 20, 120, 6, 260); g.fillRect(i * 74 + 20, 640, 6, 260); } g.fillRect(0, 380, W, 6); g.fillRect(0, 640, W, 6); });
  const lot = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), std('#ffffff', { map: lotT, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1 })); lot.rotation.x = -Math.PI / 2; lot.rotation.z = Math.PI / 2; lot.position.set(LOT.x, -0.04, LOT.z); lot.receiveShadow = true; G.add(lot);
  const cols = ['#c8d0d8', '#2a3a5a', '#8a1a22', '#f2f2f2', '#3a3a40', '#4a6a8a', '#d8c8a8'];
  for (let i = 0; i < 12; i++) for (const row of [-1, 1]) { if (row === -1 && (i === 6 || i === 7)) continue; const c = car(cols[(i * 3 + row + 7) % cols.length], i * 7 + row + 20); c.rotation.y = Math.PI / 2 * row; c.position.set(LOT.x - 26 + i * 4.8 * 0.95 + 2, 0, LOT.z + row * 13); G.add(c); }
  // cột đèn bãi xe
  for (const x of [-20, 0, 20]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8, 8), std('#5a5e66', { metalness: 0.6 })); p.position.set(LOT.x + x, 4, LOT.z + 6.5); p.castShadow = true; G.add(p);
    const h = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 0.4), std('#3a3e46')); h.position.set(LOT.x + x, 8, LOT.z + 6.5); G.add(h); }
  // cây thu lá vàng quanh bãi xe
  const r = rnd(31);
  for (let i = 0; i < 28; i++) { const x = LOT.x - 40 + r() * 80, z = LOT.z + (r() < 0.5 ? -1 : 1) * (24 + r() * 14); const T = new THREE.Group(); T.position.set(x, 0, z); G.add(T);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 3, 6).translate(0, 1.5, 0), std('#4a3424')); tr.castShadow = true; T.add(tr);
    const lf = std(['#d88a2a', '#e8b040', '#c85a28', '#b8a040'][i % 4], { roughness: 0.9 }); for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + r() * 0.8, 0), lf); b.position.set((r() - 0.5) * 2, 3.4 + r() * 1.6, (r() - 0.5) * 2); b.castShadow = true; T.add(b); } }
  // trời chiều thu: xanh sâu → vàng hổ phách ở chân trời
  const skyT = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); [[0, '#2a3a6a'], [0.3, '#5a74a8'], [0.46, '#e8b088'], [0.5, '#ffd8a0'], [0.53, '#c8a890'], [1, '#6a6a70']].forEach(([k, c]) => gr.addColorStop(k, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false, depthWrite: false })); G.add(sky);
  scene.background = new THREE.Color('#5a74a8'); scene.fog = new THREE.Fog('#d8b8a0', 160, 520);
  return { G, field, SG, GP, BN, outer };
}
// ánh sáng: nắng thu thấp màu hổ phách (tĩnh trong mỗi shot) + trời xanh mát + hắt nền; setArea dời bóng đổ theo khu (chỉ đổi tại điểm cắt)
export function arenaLights(scene) {
  const hemi = new THREE.HemisphereLight('#c8d4f0', '#6a5a40', 1.45); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffc888', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 200 }); sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.02; sun.shadow.radius = 3;
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight('#a8bcff', 0.55); fill.position.set(40, 30, 60); scene.add(fill);
  const DIR = new THREE.Vector3(-0.55, 0.42, -0.72).normalize().multiplyScalar(80);
  const setArea = (x, z) => { sun.target.position.set(x, 0, z); sun.position.set(x + DIR.x, DIR.y, z + DIR.z); sun.target.updateMatrixWorld(); sun.shadow.camera.updateProjectionMatrix(); };
  setArea(0, 0); return { hemi, sun, fill, setArea };
}
