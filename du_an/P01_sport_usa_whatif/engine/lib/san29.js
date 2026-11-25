// Tập 29 — "RAIN JUNGLE BOWL" hư cấu (Panthers vs Ravens): sân lộ thiên giữa rừng nhiệt đới, MƯA nghiêng, trời chiều xám-xanh nhưng sáng (đèn pha 4 tháp).
// Kiểu mới (khác E22–E28): khán đài 2 tầng phủ DÂY LEO + lá rủ, cây chuối/cọ quanh sân, VŨNG NƯỚC phản chiếu trên cỏ, BẢNG ĐIỆN ĐỨNG sau end zone,
// 4 tháp đèn pha, sương mù nhẹ. Không logo, không tên sân thật.
import * as THREE from 'three';
import { fieldTexture, goalPost, FL, FW } from './ngoaitroi.js';
import { GL } from './santap.js';
import { buildCrowd } from './dongnguoi25.js';
export const OX = GL - 50 * 0.9144;
export const FZ = FW / 2;
export const LX = OX - FL / 2, RX = OX + FL / 2;
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
let rs = 29; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
const sh = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const BX = FL / 2 + 9, BZ = FZ + 7;
function sky() { const t = ctex(64, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#56708a'); gr.addColorStop(0.3, '#7d97ad'); gr.addColorStop(0.46, '#b8c8cc'); gr.addColorStop(0.5, '#c8ccb8'); gr.addColorStop(0.56, '#5a7a5a'); gr.addColorStop(1, '#2e4a30');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${90 + R() * 40},${105 + R() * 40},${125 + R() * 30},0.25)`; g.beginPath(); g.ellipse(R() * W, R() * H * 0.42, 30 + R() * 30, 6 + R() * 10, 0, 0, 7); g.fill(); } });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); }
function ringPath(off) { const ax = BX + off, az = BZ + off, rc = 16 + off * 0.6, sx = ax - rc, sz = az - rc;
  const seg = [2 * sx, Math.PI * rc / 2, 2 * sz, Math.PI * rc / 2, 2 * sx, Math.PI * rc / 2, 2 * sz, Math.PI * rc / 2]; const tot = seg.reduce((a, b) => a + b, 0);
  return { tot, at(u) { let d = ((u % 1) + 1) % 1 * tot; let i = 0; while (d > seg[i]) { d -= seg[i]; i++; }
    const arc = (cx, cz, a0) => { const a = a0 + d / rc; return [cx + Math.cos(a) * rc, cz + Math.sin(a) * rc, a]; };
    let p; switch (i) { case 0: p = [-sx + d, -az, -Math.PI / 2]; break; case 1: p = arc(sx, -sz, -Math.PI / 2); break; case 2: p = [ax, -sz + d, 0]; break; case 3: p = arc(sx, sz, 0); break;
      case 4: p = [sx - d, az, Math.PI / 2]; break; case 5: p = arc(-sx, sz, Math.PI / 2); break; case 6: p = [-ax, sz - d, Math.PI]; break; default: p = arc(-sx, -sz, Math.PI); }
    return [p[0] + OX, p[1], p[2]]; } }; }
function bowl(G, spots) {
  const conc = std('#b8bab4', { roughness: 0.95 });
  const seatC = [new THREE.Color('#0a7ab8'), new THREE.Color('#1a1c22'), new THREE.Color('#3a2a78')];
  const step = new THREE.BoxGeometry(1, 0.55, 0.95); const list = [];
  const tiers = [{ off: 0, rows: 18, y0: 1.2 }, { off: 21, rows: 14, y0: 14.5 }];
  tiers.forEach((T, ti) => { for (let r = 0; r < T.rows; r++) { const off = T.off + r * 0.95, y = T.y0 + r * 0.55; const P = ringPath(off); const n = Math.floor(P.tot / 1.0);
    for (let k = 0; k < n; k++) { const [x, z, a] = P.at(k / n); const sec = Math.floor(k / n * 16) % 3; list.push([x, y, z, a, sec]);
      if (R() > (ti === 0 ? 0.12 : 0.3) && k % 2 === 0) { const team = R() < 0.7 ? 0 : 1; spots.push({ x, y: y + 0.28, z, ry: -a - Math.PI / 2, team }); } } } });
  const IM = new THREE.InstancedMesh(step, conc, list.length); const D = new THREE.Object3D();
  list.forEach(([x, y, z, a, sc], i) => { D.position.set(x, y - 0.27, z); D.rotation.set(0, -a + Math.PI / 2, 0); D.scale.set(1.05, 1, 1); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); IM.setColorAt(i, seatC[sc]); });
  IM.receiveShadow = true; G.add(IM);
  // vách tầng 2 (đá rêu) — nơi dây leo bám
  const moss = ctex(256, 128, (g) => { g.fillStyle = '#4a5a48'; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 900; i++) { g.fillStyle = R() < 0.5 ? 'rgba(40,80,40,0.35)' : 'rgba(150,160,140,0.25)'; g.fillRect(R() * 256, R() * 128, 3 + R() * 6, 2 + R() * 4); }
    g.strokeStyle = 'rgba(30,36,30,0.6)'; g.lineWidth = 2; for (let y = 16; y < 128; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); } }, [1, 1]);
  const wallM = std('#ffffff', { map: moss, roughness: 0.95 }); const P = ringPath(20); const n = 120; const wall = [];
  for (let k = 0; k < n; k++) { const [x, z] = P.at(k / n), [x2, z2] = P.at((k + 1) / n); const len = Math.hypot(x2 - x, z2 - z);
    const w = new THREE.Mesh(new THREE.BoxGeometry(len + 0.05, 2.6, 0.5), wallM); w.position.set((x + x2) / 2, 13.2, (z + z2) / 2); w.rotation.y = -Math.atan2(z2 - z, x2 - x); G.add(w); wall.push([(x + x2) / 2, (z + z2) / 2, -Math.atan2(z2 - z, x2 - x)]); }
  return wall;
}
// lá nhiệt đới (texture có alpha)
function leafTex() { return ctex(128, 256, (g) => { g.clearRect(0, 0, 128, 256); g.fillStyle = '#3e8a3a'; g.beginPath(); g.moveTo(64, 250); g.bezierCurveTo(0, 180, 4, 60, 64, 6); g.bezierCurveTo(124, 60, 128, 180, 64, 250); g.fill();
  g.strokeStyle = '#2a6a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 250); g.lineTo(64, 10); g.stroke(); g.lineWidth = 1.5; for (let y = 40; y < 240; y += 16) { g.beginPath(); g.moveTo(64, y); g.lineTo(20, y - 22); g.moveTo(64, y); g.lineTo(108, y - 22); g.stroke(); }
  g.fillStyle = 'rgba(200,240,160,0.18)'; g.beginPath(); g.ellipse(44, 110, 10, 50, 0.2, 0, 7); g.fill(); }); }
function vines(G, wall) {
  const lm = new THREE.MeshStandardMaterial({ map: leafTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6, color: '#ffffff' });
  const vm = std('#3a4a2a', { roughness: 0.9 }); const leafG = new THREE.PlaneGeometry(0.5, 0.9); const L = []; const D = new THREE.Object3D();
  wall.forEach(([x, z, ry], i) => { if (i % 2) return; // dây leo rủ từ mép vách tầng 2 xuống tầng 1
    const nx = Math.sin(ry), nz = Math.cos(ry); const len = 4 + R() * 5; const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(new THREE.Vector3(x + (R() - 0.5) * 0.6 - nz * 0 + nx * 0.4 * Math.sin(u * 3), 14.4 - u * len, z + (R() - 0.5) * 0.6)); }
    const c = new THREE.CatmullRomCurve3(pts); G.add(new THREE.Mesh(new THREE.TubeGeometry(c, 20, 0.05, 5), vm));
    for (let k = 0; k < 14; k++) { const p = c.getPoint(k / 14); L.push([p.x + (R() - 0.5) * 0.4, p.y, p.z + (R() - 0.5) * 0.4, R() * 6, 0.6 + R() * 0.8]); } });
  // bụi lá dày trên mép vách
  wall.forEach(([x, z]) => { for (let k = 0; k < 6; k++) L.push([x + (R() - 0.5) * 3, 14.6 + R() * 0.8, z + (R() - 0.5) * 1.2, R() * 6, 0.9 + R() * 0.8]); });
  const IM = new THREE.InstancedMesh(leafG, lm, L.length); const col = new THREE.Color();
  L.forEach(([x, y, z, a, s], i) => { D.position.set(x, y, z); D.rotation.set(R() * 1.2 - 0.6, a, R() * 1.4 - 0.7); D.scale.setScalar(s); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); IM.setColorAt(i, col.setHSL(0.27 + R() * 0.06, 0.45 + R() * 0.2, 0.42 + R() * 0.2)); });
  G.add(IM);
}
// cây chuối / cọ quanh sân (thân + tán lá lớn)
function palm(G, x, z, h) { const T = new THREE.Group(); const bark = std('#6a5a40', { roughness: 1 });
  const pts = []; const lean = (R() - 0.5) * 2; for (let k = 0; k <= 6; k++) pts.push(new THREE.Vector3(lean * Math.pow(k / 6, 2), k / 6 * h, 0));
  T.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.32, 8), bark));
  const lm = new THREE.MeshStandardMaterial({ map: leafTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6 });
  for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 6, 1, 6), lm); const p = f.geometry.attributes.position; for (let k = 0; k < p.count; k++) { const y = p.getY(k) + 3; p.setZ(k, -0.06 * y * y); } f.geometry.computeVertexNormals();
    const pv = new THREE.Group(); pv.position.set(lean, h, 0); pv.rotation.set(0, i / 9 * Math.PI * 2, 0); f.rotation.x = -1.0 - R() * 0.4; f.position.set(0, 0, 0); f.geometry.translate(0, 3, 0); pv.add(f); T.add(pv); }
  T.position.set(x, 0, z); G.add(sh(T)); return T; }
// 4 tháp đèn pha
function lightTowers(G) { const out = []; const steel = std('#8a929e', { metalness: 0.6, roughness: 0.4 }); const glow = new THREE.MeshBasicMaterial({ color: '#fffbe8' });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const x = OX + sx * (BX + 22), z = sz * (BZ + 22); const T = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 46, 8), steel); pole.position.y = 23; T.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 1.2), std('#2a2e36', { metalness: 0.5 })); head.position.y = 47; T.add(head);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const l = new THREE.Mesh(new THREE.CircleGeometry(1.1, 16), glow); l.position.set(-4.5 + i * 3, 45.6 + j * 2.8, 0.62); T.add(l); }
    T.position.set(x, 0, z); T.lookAt(OX, 0, 0); T.rotation.x = 0; G.add(T); out.push(T); }
  return out; }
// BẢNG ĐIỆN ĐỨNG sau end zone trái (khung thép + dây leo)
function endBoard(G) {
  const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 800; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const B = new THREE.Group(); const dark = std('#121418', { metalness: 0.5, roughness: 0.4 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(30, 15.5, 1.6), dark); B.add(box);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(28.6, 14.2), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); f.position.z = 0.82; B.add(f);
  for (const sx of [-11, 11]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 22, 1.2), std('#5a606a', { metalness: 0.6 })); leg.position.set(sx, -18, -0.5); B.add(leg); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(31, 0.5, 2.2), std('#0a7ab8', { emissive: '#0a7ab8', emissiveIntensity: 0.4 })); top.position.set(0, 7.95, 0); B.add(top);
  const perch = new THREE.Object3D(); perch.position.set(0, 8.2, 0.2); B.add(perch);
  B.position.set(LX - 26, 29, 0); B.rotation.y = Math.PI / 2; G.add(B); let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d'); g.fillStyle = '#081018'; g.fillRect(0, 0, 1600, 800);
    g.strokeStyle = '#3ab0e8'; g.lineWidth = 14; g.strokeRect(14, 14, 1572, 772); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { const fs = o.size || 170; g.font = `900 ${fs}px Anton, Impact, sans-serif`; g.fillStyle = o.msgColor || '#fff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 800, 400 + (i - (a.length - 1) / 2) * fs * 1.13)); t.needsUpdate = true; return; }
    g.font = '900 120px Anton, Impact, sans-serif'; g.fillStyle = '#3ab0e8'; g.fillText('CAR', 400, 140); g.fillStyle = '#9a7ae8'; g.fillText('BAL', 1200, 140);
    g.font = '900 330px Anton, Impact, sans-serif'; g.fillStyle = '#fff'; g.fillText(String(o.a ?? 0), 400, 450); g.fillText(String(o.b ?? 0), 1200, 450);
    g.font = '900 90px Anton, Impact, sans-serif'; g.fillStyle = '#ffd08a'; g.fillText(o.clock || '', 800, 690); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'RAIN JUNGLE BOWL' }); return { G: B, draw, perch };
}
// vũng nước trên sân: đĩa phản chiếu (vật liệu bóng) + gợn sóng
function puddles(G) { const out = [];
  const am = ctex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 40, 128, 128, 128); gr.addColorStop(0, '#fff'); gr.addColorStop(0.7, '#ddd'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  am.colorSpace = THREE.NoColorSpace;
  const pm = new THREE.MeshStandardMaterial({ color: '#1e2c34', roughness: 0.03, metalness: 0.9, envMapIntensity: 2.2, transparent: true, opacity: 0.88, alphaMap: am, depthWrite: false });
  const spots = [[0, 0, 4.2], [-6, 5, 3], [7, -4, 3.6], [14, 6, 3], [-14, -6, 4], [22, -2, 3.4], [-24, 3, 3.2], [30, 8, 2.6], [-32, -8, 3], [38, -6, 2.8], [-40, 6, 2.4]];
  spots.forEach(([dx, z, r]) => { const g = new THREE.CircleGeometry(1, 40); const p = g.attributes.position; for (let i = 1; i < p.count; i++) { const a = Math.atan2(p.getY(i), p.getX(i)); const k = 1 + 0.18 * Math.sin(a * 3 + dx) + 0.1 * Math.sin(a * 5 + z); p.setXY(i, p.getX(i) * k, p.getY(i) * k * 0.7); }
    const m = new THREE.Mesh(g, pm); m.rotation.x = -Math.PI / 2; m.position.set(OX + dx, 0.012, z); m.scale.setScalar(r); m.receiveShadow = true; G.add(m); out.push({ x: OX + dx, z, r }); });
  return out; }
// mưa: vệt nghiêng (InstancedMesh, không vào motion blur) bám quanh máy quay
function rain(G, n = 2600) { const geo = new THREE.CylinderGeometry(0.005, 0.005, 0.8, 3, 1, true); geo.translate(0, 0.45, 0);
  const m = new THREE.MeshBasicMaterial({ color: '#d8e4ee', transparent: true, opacity: 0.26, depthWrite: false, fog: false });
  const IM = new THREE.InstancedMesh(geo, m, n); IM.frustumCulled = false; G.add(IM); const seeds = [...Array(n)].map(() => [R(), R(), R(), 0.8 + R() * 0.4]); const D = new THREE.Object3D();
  const rings = new THREE.InstancedMesh(new THREE.RingGeometry(0.06, 0.09, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#e8f0f4', transparent: true, opacity: 0.45, depthWrite: false }), 260); rings.frustumCulled = false; G.add(rings);
  const rseed = [...Array(260)].map(() => [R(), R(), R()]);
  const update = (t, cam, pds) => { const c = cam.position; const box = 22, top = 16;
    seeds.forEach(([a, b, ph, sp], i) => { const fall = ((t * 9 * sp + ph * top) % top); let x = c.x + (a - 0.5) * box * 2 - fall * 0.22, z = c.z + (b - 0.5) * box * 2; { const dx = x - c.x, dz = z - c.z, d = Math.hypot(dx, dz); if (d < 2.2) { const f = 2.2 / Math.max(d, 0.01); x = c.x + dx * f; z = c.z + dz * f; } } const y = Math.max(0, top - fall + Math.min(0, c.y - 4));
      D.position.set(x, y, z); D.rotation.set(0, 0, 0.22); D.scale.set(1, sp, 1); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); }); IM.instanceMatrix.needsUpdate = true;
    rseed.forEach(([a, b, ph], i) => { const k = (t * 1.6 + ph) % 1; const p = pds[i % pds.length]; const rr = Math.sqrt(a) * p.r * 0.9, an = b * Math.PI * 2;
      D.position.set(p.x + Math.cos(an) * rr, 0.02, p.z + Math.sin(an) * rr * 0.7); D.rotation.set(0, 0, 0); D.scale.setScalar(0.3 + k * 2.2); D.updateMatrix(); rings.setMatrixAt(i, D.matrix); });
    rings.instanceMatrix.needsUpdate = true; rings.material.opacity = 0.45; };
  return { update, IM, rings }; }
export function buildJungle(scene) {
  scene.background = new THREE.Color('#8aa0b2'); scene.fog = new THREE.Fog('#a8b8c2', 90, 520);
  const G = new THREE.Group(); scene.add(G); G.add(sky());
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), std('#3a5a32', { roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.05, 0); ground.receiveShadow = true; G.add(ground);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#3a7e36'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(20,60,20,0.12)' : 'rgba(190,230,140,0.08)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [40, 20]);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(BX * 2 + 2, BZ * 2 + 2), std('#ffffff', { map: turf, roughness: 0.55 })); apron.rotation.x = -Math.PI / 2; apron.position.set(OX, -0.015, 0); apron.receiveShadow = true; G.add(apron);
  const ft = fieldTexture({ endLeft: '#0a7ab8', endLeftText: 'CAROLINA', endLeftStroke: '#101820', endRight: '#2a1a6a', endRightText: 'BALTIMORE', endRightFg: '#e8c030', g1: '#3a7e36', g2: '#468e40' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  const posts = [-1, 1].map((d) => { const gp = goalPost(d); const piv = new THREE.Group(); const baseX = (d < 0 ? LX : RX) + d * 1.8; piv.position.set(baseX, 0, 0); gp.position.set(-d * 1.8, 0, 0); piv.add(gp); G.add(piv); return piv; });
  const pad = std('#101820', { roughness: 0.6 }); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(BX * 2, 1.2, 0.4), pad); w.position.set(OX, 0.6, s * (BZ - 0.6)); G.add(w); const e = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, BZ * 2), pad); e.position.set(OX + s * (BX - 0.6), 0.6, 0); G.add(e); }
  const spots = []; const wall = bowl(G, spots); vines(G, wall);
  const palms = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; palms.push(palm(G, OX + Math.cos(a) * (BX + 40 + R() * 20), Math.sin(a) * (BZ + 38 + R() * 16), 14 + R() * 10)); }
  // vài cây chuối trong góc sân (gần máy quay, lá to)
  for (const [x, z] of [[LX - 4, -BZ + 3], [RX + 4, BZ - 3], [LX - 4, BZ - 3], [RX + 4, -BZ + 3]]) palms.push(palm(G, x, z, 6 + R() * 2));
  const towers = lightTowers(G); const board = endBoard(G); const pds = puddles(G); const rn = rain(G);
  const crowd = buildCrowd(G, spots, { seed: 29, coats: ['#0a7ab8', '#101820', '#0a7ab8', '#bfc0bf', '#101820', '#241773', '#0a7ab8', '#101820', '#2a1a6a', '#e8eef2'], hats: ['#101820', '#0a7ab8', '#e8c030', '#241773'], paint: ['#0a7ab8', '#101820'], towels: ['#0a7ab8', '#101820', '#e8eef2'] });
  // áo mưa trong suốt cho khán giả? — ô dù rải rác trên khán đài
  const umb = []; const um = [std('#0a7ab8'), std('#101820'), std('#e8eef2'), std('#3a2a78')];
  for (let i = 0; i < 90; i++) { const s = spots[Math.floor(R() * spots.length)]; const u = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.35, 10, 1, true), um[i % 4]); u.material.side = THREE.DoubleSide; u.position.set(s.x, s.y + 1.85, s.z); G.add(u); umb.push(u); }
  const update = (t, cam) => { palms.forEach((p, i) => { p.rotation.z = Math.sin(t * 1.1 + i) * 0.02; }); if (cam) rn.update(t, cam, pds); };
  return { G, crowd, board, posts, update, puddles: pds, rain: rn };
}
export function jungleLights(scene) {
  const hemi = new THREE.HemisphereLight('#e8f0ff', '#5a6a4a', 2.5); scene.add(hemi);
  const key = new THREE.DirectionalLight('#f4f6ff', 4.0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#bcd8ff', 1.2); fill.position.set(40, 30, 30); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 22, 34, z - 12); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.75).multiplyScalar(26); key.position.set(x + d.x, 34, z + d.z); };
  area(0, 0); return { hemi, key, fill, area };
}
