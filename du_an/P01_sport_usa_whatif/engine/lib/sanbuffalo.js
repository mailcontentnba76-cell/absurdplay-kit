// Tập 24 (Mascot) — SÂN LỘ THIÊN Ở BUFFALO (hư cấu, không tên sân, không logo; gợi ý từ sân mới 2026: lộ thiên + MÁI CANOPY THÉP 360° che phần lớn khán đài,
// mái có hệ sưởi làm tan tuyết + mặt cỏ sưởi ngầm). BAN NGÀY MÙA ĐÔNG, trời xám xanh, rừng thông phủ tuyết + đồi xa (không khối trơn).
// Ghế xanh hoàng gia, fan áo khoác xanh/đỏ/trắng. End zone xanh hoàng gia chữ "BUFFALO". Gốc toạ độ như santap.js (vạch vôi GL ở +x).
// Xuất thêm: canopy (userData.glow(k) → mái đỏ cam khi sưởi), snowLayer (userData.set(k) phủ tuyết mặt sân 0..1).
import * as THREE from 'three';
import { fieldTexture, goalPost, bleachers, FL, FW } from './ngoaitroi.js';
import { buildBowl, snowbanks } from './khandaibuffalo.js';
export { makeDummy, hopPos, YD, GL, EL, FZ, BENCH, LAC, BAL } from './santap.js';
import { GL, EL, FZ, BENCH, LAC, BAL } from './santap.js';
export const OX = GL - 50 * 0.9144;          // tâm sân thật (x) để vạch vôi +x trùng GL
export const WALLZ = FZ + 5.6, WALKZ = FZ + 6.6, ENDW = EL + 3.2, ENDWALK = EL + 4.2;
export const BOARD = { x: EL + 13, z: 0, y: 11 };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
function sky() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#7f9cbc'); gr.addColorStop(0.3, '#a9bdd2'); gr.addColorStop(0.46, '#d4dde6'); gr.addColorStop(0.5, '#e4e8ec'); gr.addColorStop(0.53, '#b8c2cc'); gr.addColorStop(1, '#9aa4ae');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, Math.random() * H * 0.45, W, 2 + Math.random() * 6); } });
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}
function skyline(G) {
  const r = (() => { let s = 21; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  const pine = new THREE.ConeGeometry(1, 1, 7), cap = new THREE.ConeGeometry(1, 1, 7);
  const N = 520, P = new THREE.InstancedMesh(pine, new THREE.MeshStandardMaterial({ color: '#2c4a3a', roughness: 0.9 }), N), S = new THREE.InstancedMesh(cap, new THREE.MeshStandardMaterial({ color: '#f4f7fa', roughness: 0.8 }), N);
  const D = new THREE.Object3D();
  for (let i = 0; i < N; i++) { const a = r() * Math.PI * 2, d = 130 + r() * 170; const x = OX + Math.cos(a) * d * 1.25, z = Math.sin(a) * d; const h = 8 + r() * 12, w = h * 0.32;
    D.position.set(x, h / 2 - 1, z); D.scale.set(w, h, w); D.rotation.y = r() * 3; D.updateMatrix(); P.setMatrixAt(i, D.matrix);
    D.position.y = h * 0.78; D.scale.set(w * 0.55, h * 0.42, w * 0.55); D.updateMatrix(); S.setMatrixAt(i, D.matrix); }
  G.add(P, S);
  const hillM = new THREE.MeshStandardMaterial({ color: '#e6ebf0', roughness: 1 });
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, R = 60 + r() * 50; const h = new THREE.Mesh(new THREE.SphereGeometry(R, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), hillM); h.scale.y = 0.28 + r() * 0.2; h.position.set(OX + Math.cos(a) * 380, -4, Math.sin(a) * 330); G.add(h); }
  const snowG = new THREE.Mesh(new THREE.RingGeometry(90, 600, 48), new THREE.MeshStandardMaterial({ color: '#eef2f6', roughness: 1 })); snowG.rotation.x = -Math.PI / 2; snowG.position.set(OX, -0.1, 0); G.add(snowG);
}
function led(text, bg, fg) { return ctex(2048, 64, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.font = '900 42px Anton, Impact, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = fg; for (let k = 0; k < 6; k++) g.fillText(text, (k + 0.5) * W / 6, H / 2 + 2); }); }
// vòng đèn pha trên mép khán đài: giàn đèn có material phát sáng (userData.m) để bật/tắt
function lightBank(w = 14) {
  const G = new THREE.Group(); const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 3.0, 0.5), std('#3a3f4a', { metalness: 0.5 })); G.add(fr);
  const lm = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6e0', emissiveIntensity: 3.4, roughness: 0.3 });
  const n = Math.floor(w / 1.2); for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.2), lm); b.position.set(-w / 2 + 0.6 + i * 1.2, -0.6 + j * 1.2, 0.3); G.add(b); }
  G.userData.m = lm; return G;
}
function videoBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 576; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(18, 10.1), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(0, BOARD.y, 0.36); G.add(face);
  const box = new THREE.Mesh(new THREE.BoxGeometry(19, 11, 0.6), std('#1a1b22')); box.position.y = BOARD.y; G.add(box);
  for (const x of [-6, 6]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, BOARD.y - 5.5, 0.8), std('#4a4f58', { metalness: 0.5 })); p.position.set(x, (BOARD.y - 5.5) / 2, -0.3); G.add(p); }
  let last = '';
  const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 576); gr.addColorStop(0, '#10264a'); gr.addColorStop(1, '#060e1c'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 576);
    g.strokeStyle = BAL.gold; g.lineWidth = 8; g.strokeRect(10, 10, 1004, 556); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = '900 120px Anton, Impact, sans-serif'; g.fillStyle = o.msgColor || '#ffffff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 512, 288 + (i - (a.length - 1) / 2) * 130)); t.needsUpdate = true; return; }
    g.font = '900 62px Anton, Impact, sans-serif'; g.fillStyle = '#7fb6ff'; g.fillText(o.l ?? 'TEN', 270, 92); g.fillStyle = '#c8d2e0'; g.fillText(o.r ?? 'DAL', 754, 92);
    g.font = '900 230px Anton, Impact, sans-serif'; g.fillStyle = '#ffffff'; g.fillText(String(o.a ?? 0), 270, 290); g.fillText(String(o.b ?? 0), 754, 290);
    g.font = '900 80px Anton, Impact, sans-serif'; g.fillStyle = o.tint || BAL.gold; g.fillText(o.clock ?? '', 512, 470); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: '1ST 15:00' }); G.traverse((x) => { if (x.isMesh && x !== face) x.castShadow = false; }); return { G, draw };
}
export function buildBUF(scene) {
  scene.background = new THREE.Color('#c8d4e0'); scene.fog = new THREE.Fog('#d0d8e2', 150, 560);
  const G = new THREE.Group(); scene.add(G); G.add(sky()); skyline(G);
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#3f8a3c'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 2000; i++) { g.fillStyle = i % 2 ? 'rgba(20,60,20,0.1)' : 'rgba(180,230,140,0.07)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [60, 60]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 160), std('#ffffff', { map: turf, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.06, 0); ground.receiveShadow = true; G.add(ground);
  const ft = fieldTexture({ endLeft: '#00338d', endLeftText: 'BUFFALO', endLeftStroke: '#c60c30', endRight: '#00338d', endRightText: 'BUFFALO', endRightFg: '#ffffff', g1: '#3f8a3a', g2: '#4b9a44' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
  field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  const gpL = goalPost(-1), gpR = goalPost(1); gpL.position.x = OX - FL / 2; gpR.position.x = OX + FL / 2; G.add(gpL, gpR);
  // tường biên đệm tím + dải LED
  const wallM = std('#00338d', { roughness: 0.7 }); const L = FL + 30;
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(L, 1.2, 0.4), wallM); w.position.set(OX, 0.6, s * WALLZ); w.receiveShadow = true; G.add(w);
    const l = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.55), new THREE.MeshBasicMaterial({ map: led('BUFFALO  •  ORCHARD PARK  •  NEW YORK', '#00256a', '#ffffff'), toneMapped: false })); l.position.set(OX, 0.62, s * (WALLZ - 0.21)); l.rotation.y = s > 0 ? Math.PI : 0; G.add(l); }
  for (const s of [-1, 1]) { const x = s > 0 ? ENDW : OX - FL / 2 - 3.2; const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 2 * WALLZ), wallM); w.position.set(x, 0.6, 0); G.add(w); }
  // khán đài bát 2 tầng — đám đông blackout + túi fan khách xanh powder
  const U = { uT: { value: 0 }, uCheer: { value: 0.2 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  const home = { shirts: ['#00338d', '#c60c30', '#f2f0ea', '#00338d', '#1a2a4a', '#c60c30', '#00338d', '#f2f0ea', '#2a6ad8', '#00338d', '#c60c30'], skins: ['#f1c9a5', '#c68c5f', '#9a6040', '#8a5634', '#e8b98f'], pants: ['#1a1a20', '#2b3a55', '#3b3b3b'], hats: ['#c60c30', '#00338d', '#f2f0ea', '#c60c30'] };
  const bowl = buildBowl(G, { cx: OX, hx0: FL / 2 + 7, hz0: WALKZ + 1.0, rows: 24 });
  snowbanks(G, [[OX - 30, WALLZ - 1.2, 6], [OX + 10, WALLZ - 1.2, 5], [OX + 40, -WALLZ + 1.2, 6], [OX - 45, -WALLZ + 1.2, 5], [OX + FL / 2 + 2.5, 18, 4], [OX - FL / 2 - 2.5, -16, 4]]);
  const poles = [];
  // màn hình lớn sau end zone +x
  const BO = videoBoard(); BO.G.position.set(OX + FL / 2 + 29, 8, BOARD.z); BO.G.rotation.y = -Math.PI / 2; G.add(BO.G);
  // ghế đội (nhôm) biên −z
  const al = std('#c8ccd2', { metalness: 0.7, roughness: 0.35 }); const bench = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.45), al); bench.position.set(BENCH.x, 0.46, BENCH.z); bench.castShadow = true; G.add(bench);
  for (let x = -5.5; x <= 5.5; x += 2.75) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.46, 0.4), al); l.position.set(BENCH.x + x, 0.23, BENCH.z); G.add(l); }
  // MÁI CANOPY THÉP 360° (vành chữ nhật bo góc, có lỗ giữa) trên khán đài + cột chữ V; mặt dưới có dải sưởi (phát sáng đỏ cam khi glow)
  const rr = (hx, hz, rad) => { const p = new THREE.Path(); p.moveTo(-hx + rad, -hz); p.lineTo(hx - rad, -hz); p.quadraticCurveTo(hx, -hz, hx, -hz + rad); p.lineTo(hx, hz - rad); p.quadraticCurveTo(hx, hz, hx - rad, hz); p.lineTo(-hx + rad, hz); p.quadraticCurveTo(-hx, hz, -hx, hz - rad); p.lineTo(-hx, -hz + rad); p.quadraticCurveTo(-hx, -hz, -hx + rad, -hz); return p; };
  const shp = new THREE.Shape(rr(FL / 2 + 31, WALKZ + 25, 26).getPoints(16)); shp.holes.push(new THREE.Path(rr(FL / 2 + 11, WALKZ + 7, 14).getPoints(16).reverse()));
  const canM = new THREE.MeshStandardMaterial({ color: '#d4dae0', metalness: 0.25, roughness: 0.5, emissive: '#ff5a1a', emissiveIntensity: 0, side: THREE.DoubleSide });
  const underM = new THREE.MeshBasicMaterial({ color: '#aeb8c2', side: THREE.DoubleSide });
  const canopy = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: 1.6, bevelEnabled: false, curveSegments: 8 }), canM); canopy.rotation.x = Math.PI / 2; canopy.position.set(OX, 24, 0); G.add(canopy);
  const under = new THREE.Mesh(new THREE.ShapeGeometry(shp, 8), underM); under.rotation.x = Math.PI / 2; under.position.set(OX, 22.35, 0); G.add(under);
  const ribM = std('#9aa4ae', { metalness: 0.6, roughness: 0.4 }); const heatM = new THREE.MeshBasicMaterial({ color: '#ff7a2a', toneMapped: false, transparent: true, opacity: 0 });
  for (let i = -6; i <= 6; i++) for (const s of [-1, 1]) { const x = OX + i * 9; const rib = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 17), ribM); rib.position.set(x, 23.2, s * (WALKZ + 16)); G.add(rib);
    const ht = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 16), heatM); ht.rotation.x = Math.PI / 2; ht.position.set(x + 4.5, 22.5, s * (WALKZ + 16)); G.add(ht);
    if (i % 2 === 0) for (const d of [-1, 1]) { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 26, 8), ribM); v.position.set(x + d * 2.2, 12, s * (WALKZ + 25)); v.rotation.z = d * 0.12; G.add(v); } }
  canopy.userData.glow = (k) => { canM.emissiveIntensity = 0.9 * k; underM.color.set(k > 0.01 ? new THREE.Color('#aeb8c2').lerp(new THREE.Color('#ff8a4a'), k) : '#aeb8c2'); heatM.opacity = k; canM.color.set(k > 0.01 ? '#d8c8bc' : '#c4ccd4'); };
  // lớp tuyết phủ mặt sân (độ phủ 0..1, có loang)
  const snowT = ctex(512, 256, (g, W, H) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(200,214,230,0.25)'; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, 2 + Math.random() * 10, 0, 7); g.fill(); } });
  const snowM = new THREE.MeshStandardMaterial({ map: snowT, roughness: 0.95, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8, depthWrite: false });
  const snowLayer = new THREE.Mesh(new THREE.PlaneGeometry(FL + 16, FW + 10), snowM); snowLayer.rotation.x = -Math.PI / 2; snowLayer.position.set(OX, 0.02, 0); snowLayer.receiveShadow = true; G.add(snowLayer);
  snowLayer.userData.set = (k) => { snowM.opacity = Math.min(1, k) * 0.92; snowLayer.visible = k > 0.01; };
  snowLayer.userData.set(0);
  return { G, poles, board: BO, crowd: U, canopy, snowLayer, bowl };
}
export function stadiumLights(scene, P) {
  const hemi = new THREE.HemisphereLight('#e2e8ff', '#4a5a48', 2.8); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff4e4', 4.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#c4ccff', 1.8); fill.position.set(30, 30, 30); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 26, 30, z - 14); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7).multiplyScalar(26); key.position.set(x + d.x, 30, z + d.z); };
  // k=0 "Darkness Falls": giàn đèn tắt bớt, sân tối đi nhưng vẫn đọc rõ (hemi ≥1,7)
  const lamps = (k) => { P.poles.forEach((p) => { p.userData.m.emissiveIntensity = 0.2 + 3.2 * k; p.userData.m.color.setScalar(0.3 + 0.7 * k); }); hemi.intensity = 1.8 + 1.0 * k; key.intensity = 2.4 + 1.8 * k; fill.intensity = 1.1 + 0.7 * k; };
  area(0, 0); lamps(1); return { hemi, key, fill, area, lamps };
}
