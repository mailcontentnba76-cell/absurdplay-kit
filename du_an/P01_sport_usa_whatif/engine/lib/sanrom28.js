// Tập 28 — "LONE STAR DOME" hư cấu (Cowboys vs Titans): mái vòm Texas khổng lồ, mái trượt MỞ giữa → nắng chiều vàng rọi xuống sân.
// Kiểu mới (khác E22–E27): khán đài bê tông 3 tầng hình bát kín, MÀN HÌNH TREO GIỮA SÂN 2 mặt, vách kính 2 đầu nhìn ra GIÀN KHOAN DẦU (gật gù),
// cờ bang Texas + băng rôn SỌ BÒ SỪNG DÀI trên tường tầng 2, LÒ HÚN KHÓI BBQ dọc đường biên, hàng THÙNG RÁC XANH sát sân. Không logo, không tên sân thật.
import * as THREE from 'three';
import { fieldTexture, goalPost, FL, FW } from './ngoaitroi.js';
import { GL } from './santap.js';
import { buildCrowd } from './dongnguoi25.js';
export const OX = GL - 50 * 0.9144;
export const FZ = FW / 2;
export const LX = OX - FL / 2, RX = OX + FL / 2;
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
let rs = 28; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
const sh = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

function sky() { const t = ctex(64, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#3c7cd0'); gr.addColorStop(0.32, '#7ab0e6'); gr.addColorStop(0.47, '#f2d6a6'); gr.addColorStop(0.52, '#c89a62'); gr.addColorStop(1, '#7a5a3a');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); }

// khán đài bát 3 tầng (hình chữ nhật bo góc quanh sân) → chỗ đứng khán giả
const BX = FL / 2 + 9, BZ = FZ + 7;   // mép trong tầng 1
function ringPath(off) { // chu vi hình chữ nhật bo góc tại khoảng lùi off, trả về hàm p(u)->[x,z,góc hướng vào sân]
  const ax = BX + off, az = BZ + off, rc = 14 + off * 0.6, sx = ax - rc, sz = az - rc;
  const seg = [2 * sx, Math.PI * rc / 2, 2 * sz, Math.PI * rc / 2, 2 * sx, Math.PI * rc / 2, 2 * sz, Math.PI * rc / 2]; const tot = seg.reduce((a, b) => a + b, 0);
  return { tot, at(u) { let d = ((u % 1) + 1) % 1 * tot; let i = 0; while (d > seg[i]) { d -= seg[i]; i++; }
    const arc = (cx, cz, a0) => { const a = a0 + d / rc; return [cx + Math.cos(a) * rc, cz + Math.sin(a) * rc, a]; };
    let p; switch (i) { case 0: p = [-sx + d, -az, -Math.PI / 2]; break; case 1: p = arc(sx, -sz, -Math.PI / 2); break; case 2: p = [ax, -sz + d, 0]; break; case 3: p = arc(sx, sz, 0); break;
      case 4: p = [sx - d, az, Math.PI / 2]; break; case 5: p = arc(-sx, sz, Math.PI / 2); break; case 6: p = [-ax, sz - d, Math.PI]; break; default: p = arc(-sx, -sz, Math.PI); }
    return [p[0] + OX, p[1], p[2]]; } }; }
function bowl(G, spots) {
  const conc = std('#c8c4bc', { roughness: 0.95 }); const seatC = [new THREE.Color('#1c3a6e'), new THREE.Color('#9aa4b2'), new THREE.Color('#1c3a6e')];
  const step = new THREE.BoxGeometry(1, 0.55, 0.95); const list = [];
  const tiers = [{ off: 0, rows: 16, y0: 1.2 }, { off: 19, rows: 10, y0: 13.5 }, { off: 31, rows: 14, y0: 21 }];
  tiers.forEach((T, ti) => { for (let r = 0; r < T.rows; r++) { const off = T.off + r * 0.95, y = T.y0 + r * 0.55; const P = ringPath(off); const n = Math.floor(P.tot / 1.0);
    for (let k = 0; k < n; k++) { const [x, z, a] = P.at(k / n); list.push([x, y, z, a, ti]);
      if (R() > (ti === 0 ? 0.12 : 0.3) && k % 2 === 0) { const team = R() < 0.82 ? 0 : 1; spots.push({ x, y: y + 0.28, z, ry: -a - Math.PI / 2, team }); } } } });
  const IM = new THREE.InstancedMesh(step, conc, list.length); const D = new THREE.Object3D();
  list.forEach(([x, y, z, a, ti], i) => { D.position.set(x, y - 0.27, z); D.rotation.set(0, -a + Math.PI / 2, 0); D.scale.set(1.05, 1, 1); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); IM.setColorAt(i, seatC[ti]); });
  IM.receiveShadow = true; IM.castShadow = false; G.add(IM);
  // tường đỡ các tầng (vành mặt trước tầng 2, 3) có băng rôn
  for (const [off, y, h] of [[18, 12.2, 1.4], [30, 20.0, 1.2]]) { const P = ringPath(off); const n = 120;
    for (let k = 0; k < n; k++) { const [x, z, a] = P.at(k / n), [x2, z2] = P.at((k + 1) / n); const len = Math.hypot(x2 - x, z2 - z);
      const w = new THREE.Mesh(new THREE.BoxGeometry(len + 0.05, h, 0.4), std(k % 2 ? '#14284e' : '#1c3a6e', { roughness: 0.6 })); w.position.set((x + x2) / 2, y, (z + z2) / 2); w.rotation.y = -Math.atan2(z2 - z, x2 - x); G.add(w); } }
  return tiers;
}
// mái vòm: vòm thép elip + khe mái trượt mở ở giữa (để nắng vào)
function dome(G) {
  const steel = std('#e2e6ec', { metalness: 0.2, roughness: 0.6, side: THREE.DoubleSide, emissive: '#8a8e96', emissiveIntensity: 0.55 });
  const shell = new THREE.Group(); const span = BX + 50, depth = BZ + 50, top = 62;
  for (const s of [-1, 1]) { // hai nửa mái (chừa khe 40 m giữa)
    const g = new THREE.SphereGeometry(1, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); pos.setXYZ(i, x * span, y * top, z * depth); }
    g.computeVertexNormals(); const m = new THREE.Mesh(g, steel); m.position.set(OX, 4, 0);
    m.material = steel.clone(); m.material.onBeforeCompile = (sh_) => { sh_.vertexShader = sh_.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vW;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW=(modelMatrix*vec4(transformed,1.0)).xyz;');
      sh_.fragmentShader = sh_.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec3 vW;`).replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\nif(${s.toFixed(1)}*vW.z < 22.0) discard;`); };
    shell.add(m); }
  // giàn kèo lộ (2 vòm thép chính dọc sân)
  for (const z of [-24, 24]) { const curve = new THREE.EllipseCurve(0, 0, span, top, 0, Math.PI, false, 0); const pts = curve.getPoints(60).map((p) => new THREE.Vector3(OX + p.x, 4 + p.y * Math.sqrt(Math.max(0, 1 - (z / depth) ** 2)), z));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 1.1, 8), std('#9aa2ae', { metalness: 0.6, roughness: 0.35 })); shell.add(tube); }
  G.add(shell); return shell;
}
// vách kính hai đầu + giàn khoan dầu gật gù bên ngoài
function glassAndOil(G) {
  const glass = new THREE.MeshStandardMaterial({ color: '#a8c8e0', metalness: 0.2, roughness: 0.08, transparent: true, opacity: 0.22, depthWrite: false });
  for (const d of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(BZ * 2 + 70, 46), glass); w.position.set(OX + d * (BX + 46), 25, 0); w.rotation.y = -d * Math.PI / 2; G.add(w);
    for (let k = -6; k <= 6; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.4, 46, 0.4), std('#8a929e', { metalness: 0.6 })); m.position.set(OX + d * (BX + 46), 25, k * 9); G.add(m); } }
  const jacks = [];
  for (const d of [-1, 1]) for (let i = 0; i < 4; i++) { const J = new THREE.Group(); const dark = std('#2a2a30', { metalness: 0.5, roughness: 0.5 }), yel = std('#e8b830', { roughness: 0.5 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 6), dark); base.position.y = 0.3; J.add(base);
    for (const sx of [-0.6, 0.6]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 0.25), dark); leg.position.set(sx, 3, 0); leg.rotation.x = sx * 0; J.add(leg); }
    const beam = new THREE.Group(); beam.position.set(0, 5.6, 0); const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 8), yel); beam.add(b);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.6, 16, 1, false, 0, Math.PI), yel); head.rotation.set(0, Math.PI / 2, Math.PI / 2); head.position.set(0, -0.6, 4); beam.add(head); J.add(beam);
    J.position.set(OX + d * (BX + 70 + i * 16), 0, -40 + i * 26 + (d > 0 ? 8 : 0)); J.rotation.y = R() * 6; sh(J); G.add(J); jacks.push({ beam, ph: R() * 6 }); }
  return jacks;
}
// cờ Texas (sọc + ngôi sao bang) & băng rôn sọ bò sừng dài trên tường tầng 2
function texasFlagTex() { return ctex(384, 256, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 384, 256); g.fillStyle = '#bf0a30'; g.fillRect(128, 128, 256, 128); g.fillStyle = '#002868'; g.fillRect(0, 0, 128, 256);
  g.fillStyle = '#fff'; g.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 18 : 44, a = -Math.PI / 2 + k * Math.PI / 5; g.lineTo(64 + Math.cos(a) * r, 128 + Math.sin(a) * r); } g.fill(); }); }
function skullTex() { return ctex(256, 256, (g) => { g.fillStyle = '#c86a2a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#f4ecdc'; g.strokeStyle = '#f4ecdc'; g.lineWidth = 16; g.lineCap = 'round';
  g.beginPath(); g.moveTo(14, 70); g.quadraticCurveTo(60, 120, 100, 104); g.stroke(); g.beginPath(); g.moveTo(242, 70); g.quadraticCurveTo(196, 120, 156, 104); g.stroke();
  g.beginPath(); g.moveTo(96, 92); g.lineTo(160, 92); g.lineTo(150, 190); g.quadraticCurveTo(128, 214, 106, 190); g.closePath(); g.fill();
  g.fillStyle = '#c86a2a'; g.beginPath(); g.ellipse(112, 124, 9, 12, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(144, 124, 9, 12, 0, 0, 7); g.fill(); }); }
function banners(G) {
  const fl = std('#ffffff', { map: texasFlagTex(), side: THREE.DoubleSide }), sk = std('#ffffff', { map: skullTex(), side: THREE.DoubleSide }); const out = [];
  const P = ringPath(17.6); for (let k = 0; k < 28; k++) { const [x, z, a] = P.at((k + 0.5) / 28); const m = new THREE.Mesh(new THREE.PlaneGeometry(k % 2 ? 3.2 : 4.2, k % 2 ? 3.2 : 2.8, 6, 1), k % 2 ? sk : fl);
    m.position.set(x, 9.6, z); m.rotation.y = -a - Math.PI / 2; G.add(m); out.push(m); }
  return out;
}
// MÀN HÌNH TREO GIỮA SÂN: 2 mặt lớn quay về 2 đường biên + 2 mặt nhỏ quay về 2 end zone
function centerBoard(G) {
  const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 640; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const B = new THREE.Group(); const dark = std('#121418', { metalness: 0.5, roughness: 0.4 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(46, 15, 26), dark); B.add(box);
  const scr = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(44, 13.2), scr); f.position.set(0, 0, s * 13.05); if (s < 0) f.rotation.y = Math.PI; B.add(f); }
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(24, 9.6), scr); f.position.set(s * 23.05, 0, 0); f.rotation.y = s * Math.PI / 2; B.add(f); }
  const gold = std('#e8b830', { emissive: '#e8b830', emissiveIntensity: 0.35 }); for (const [w, d, x, z] of [[47, 0.8, 0, 13.2], [47, 0.8, 0, -13.2], [0.8, 27, 23.3, 0], [0.8, 27, -23.3, 0]]) { const e = new THREE.Mesh(new THREE.BoxGeometry(w, 1.0, d), gold); e.position.set(x, -7.9, z); B.add(e); }
  for (const [x, z] of [[-20, -11], [20, -11], [-20, 11], [20, 11]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 30, 6), std('#5a606a', { metalness: 0.7 })); c.position.set(x, 22, z); B.add(c); }
  B.position.set(OX, 34, 0); G.add(B); let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d'); g.fillStyle = '#0a0e18'; g.fillRect(0, 0, 1600, 640);
    g.strokeStyle = '#c8ccd4'; g.lineWidth = 12; g.strokeRect(12, 12, 1576, 616); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { const fs = o.size || 150; g.font = `900 ${fs}px Anton, Impact, sans-serif`; g.fillStyle = o.msgColor || '#fff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 800, 320 + (i - (a.length - 1) / 2) * fs * 1.13)); t.needsUpdate = true; return; }
    g.font = '900 110px Anton, Impact, sans-serif'; g.fillStyle = '#c8ccd4'; g.fillText('DAL', 400, 120); g.fillStyle = '#7ab8e8'; g.fillText('TEN', 1200, 120);
    g.font = '900 300px Anton, Impact, sans-serif'; g.fillStyle = '#fff'; g.fillText(String(o.a ?? 0), 400, 380); g.fillText(String(o.b ?? 0), 1200, 380);
    g.font = '900 80px Anton, Impact, sans-serif'; g.fillStyle = '#ffd08a'; g.fillText(o.clock || '', 800, 560); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'LONE STAR DOME' }); return { G: B, draw };
}
export function buildDome(scene) {
  scene.background = new THREE.Color('#9cc4e8'); scene.fog = new THREE.Fog('#e6d8c0', 180, 700);
  const G = new THREE.Group(); scene.add(G); G.add(sky());
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), std('#a88a5a', { roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.05, 0); ground.receiveShadow = true; G.add(ground);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#3e8a3a'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(20,60,20,0.12)' : 'rgba(190,230,140,0.08)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [40, 20]);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(BX * 2 + 2, BZ * 2 + 2), std('#ffffff', { map: turf, roughness: 0.95 })); apron.rotation.x = -Math.PI / 2; apron.position.set(OX, -0.015, 0); apron.receiveShadow = true; G.add(apron);
  const ft = fieldTexture({ endLeft: '#14284e', endLeftText: 'DALLAS', endLeftStroke: '#c8ccd4', endRight: '#7ab8e8', endRightText: 'TENNESSEE', endRightFg: '#14284e', g1: '#3e8a3a', g2: '#4a9a44' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  const posts = [-1, 1].map((d) => { const gp = goalPost(d); const piv = new THREE.Group(); const baseX = (d < 0 ? LX : RX) + d * 1.8; piv.position.set(baseX, 0, 0); gp.position.set(-d * 1.8, 0, 0); piv.add(gp); G.add(piv); return piv; });
  // tường đệm sát sân (xanh navy) cao 1,2 m
  const pad = std('#14284e', { roughness: 0.7 }); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(BX * 2, 1.2, 0.4), pad); w.position.set(OX, 0.6, s * (BZ - 0.6)); G.add(w); const e = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, BZ * 2), pad); e.position.set(OX + s * (BX - 0.6), 0.6, 0); G.add(e); }
  const spots = []; bowl(G, spots); dome(G); const jacks = glassAndOil(G); const flags = banners(G); const board = centerBoard(G);
  const crowd = buildCrowd(G, spots, { seed: 28, coats: ['#14284e', '#14284e', '#f2f2f2', '#9aa4b2', '#14284e', '#c8ccd4', '#14284e', '#4b92db', '#7ab8e8', '#14284e'], hats: ['#d8b458', '#f2efe8', '#14284e', '#8a5a32'], paint: ['#14284e', '#c8ccd4'], towels: ['#f2f2f2', '#14284e', '#c8ccd4'] });
  const update = (t) => { jacks.forEach((j) => { j.beam.rotation.x = Math.sin(t * 1.3 + j.ph) * 0.32; }); flags.forEach((f, i) => { f.rotation.z = Math.sin(t * 1.8 + i) * 0.02; }); };
  return { G, crowd, board, posts, update };
}
export function domeLights(scene) {
  const hemi = new THREE.HemisphereLight('#f2f0ff', '#8a7a5a', 2.3); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe2b0', 4.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#c4d8ff', 1.0); fill.position.set(40, 30, 30); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 22, 34, z - 12); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.75).multiplyScalar(26); key.position.set(x + d.x, 34, z + d.z); };
  area(0, 0); return { hemi, key, fill, area, lamps: () => {} };
}
