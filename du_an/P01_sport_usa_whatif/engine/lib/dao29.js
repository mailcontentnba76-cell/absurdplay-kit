// E29 — đạo cụ cho gấu xám thật: mai rùa, cánh đại bàng, vòi voi (gắn vào q.body của gấu, hệ: mặt +z, cao 2,13 m)
// + nhà kho đạo cụ (barn) bằng bìa đặt bên sân cho câu "flies over the barn".
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; };
export function bearExtras(q) {
  const B = q.body; const X = {};
  // mai rùa: nửa elip sau lưng, vảy lục giác xanh rêu–nâu
  const hex = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#3e5a2a'; g.fillRect(0, 0, W, H); const R = 70;
    for (let y = -R, r = 0; y < H + R; y += R * 1.5, r++) for (let x = (r % 2) * R * 0.866 - R; x < W + R; x += R * 1.732) {
      g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(x + Math.cos(a) * (R - 6), y + Math.sin(a) * (R - 6)); } g.closePath();
      const gr = g.createRadialGradient(x, y, 4, x, y, R); gr.addColorStop(0, '#8a7a3a'); gr.addColorStop(1, '#4a5a26'); g.fillStyle = gr; g.fill(); g.strokeStyle = '#26301a'; g.lineWidth = 8; g.stroke(); } });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), std('#ffffff', { map: hex, roughness: 0.55 }));
  shell.rotation.x = -Math.PI / 2; const sh = new THREE.Group(); sh.add(shell); sh.position.set(0, 1.25, -0.42); B.add(sh); X.shell = sh; X.shellS = [0.66, 0.8, 0.42];
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 40), std('#2e3a1c')); sh.add(rim);
  // cánh đại bàng: quạt lông nâu đậm, mút lông trắng–nâu nhạt
  const feather = (len, w, c1) => { const t = ctex(64, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(0.8, '#4a3420'); gr.addColorStop(1, '#2a1c10'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(W / 2, 0); g.quadraticCurveTo(W, H * 0.2, W * 0.8, H); g.lineTo(W * 0.2, H); g.quadraticCurveTo(0, H * 0.2, W / 2, 0); g.fill(); g.strokeStyle = 'rgba(240,230,210,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2, 4); g.lineTo(W / 2, H); g.stroke(); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 })); m.geometry.translate(0, -len / 2, 0); return m; };
  X.wings = [1, -1].map((sx) => { const W = new THREE.Group(); W.position.set(sx * 0.38, 1.6, -0.36); B.add(W); const arm = new THREE.Group(); W.add(arm);
    for (let i = 0; i < 11; i++) { const f = feather(0.8 + i * 0.08, 0.34, i < 3 ? '#8a6a46' : '#5a3e24'); const a = -0.15 - i * 0.12; f.position.set(sx * (0.12 + i * 0.11), 0.05 + i * 0.03, 0); f.rotation.z = sx * (Math.PI / 2 + a) ; f.rotation.y = sx * 0.1; arm.add(f); }
    const cov = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 1.1, 4, 8), std('#4a3220', { roughness: 0.95 })); cov.rotation.z = Math.PI / 2; cov.position.set(sx * 0.6, 0.12, 0.02); arm.add(cov);
    W.userData.sx = sx; return W; });
  // vòi voi: chuỗi đốt thuôn dần từ mõm, xám da nhăn
  const skin = ctex(256, 256, (g, W, H) => { g.fillStyle = '#8a8a86'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(40,40,38,0.35)'; g.lineWidth = 3; for (let y = 6; y < H; y += 12) { g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 16) g.lineTo(x, y + Math.sin(x * 0.1 + y) * 3); g.stroke(); } });
  const tm = std('#ffffff', { map: skin, roughness: 0.85 });
  q.model.updateMatrix(); const tr = new THREE.Group(); const sn = q.snout.clone().applyMatrix4(q.model.matrix); tr.position.copy(sn).add(new THREE.Vector3(0, -0.04, -0.03)); B.add(tr);
  const segs = []; let par = tr; for (let i = 0; i < 9; i++) { const r0 = 0.085 - i * 0.0065, L = 0.12; const sg = new THREE.Group(); sg.position.y = i ? -L : 0; par.add(sg);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r0, r0 - 0.0065, L + 0.01, 14), tm); c.position.y = -L / 2; sg.add(c); segs.push(sg); par = sg; }
  tr.rotation.x = -0.35; X.trunk = tr; X.segs = segs;
  shad(sh); X.wings.forEach(shad); shad(tr);
  X.set = (shellK, wingK, trunkK, t = 0, flap = 0) => {
    sh.visible = shellK > 0.001; sh.scale.set(X.shellS[0] * shellK, X.shellS[1] * shellK, X.shellS[2] * shellK);
    X.wings.forEach((w) => { const sx = w.userData.sx; w.visible = wingK > 0.001; w.scale.setScalar(Math.max(0.001, wingK)); const fl = Math.sin(t * 11) * flap; w.rotation.set(0, sx * (0.55 - 0.45 * fl), sx * (0.15 + 0.5 * fl)); });
    tr.visible = trunkK > 0.001; tr.scale.setScalar(Math.max(0.001, trunkK)); segs.forEach((s, i) => { s.rotation.x = Math.sin(t * 3 + i * 0.7) * 0.1 + (i > 5 ? 0.25 : -0.05); }); };
  X.set(0, 0, 0); return X;
}
// nhà kho bìa cứng (đạo cụ giờ nghỉ): mặt tiền đỏ, viền trắng, cửa chữ X, mái hai mái
export function propBarn() {
  const G = new THREE.Group(); const red = std('#a8242a', { roughness: 0.85 }), wh = std('#f4f0e6'), roofM = std('#3a3a40', { roughness: 0.9 });
  const w = 2.6, h = 1.8, d = 1.6;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), red); body.position.y = h / 2; G.add(body);
  const gable = new THREE.Shape(); gable.moveTo(-w / 2, 0); gable.lineTo(0, 0.9); gable.lineTo(w / 2, 0); gable.lineTo(-w / 2, 0);
  const gb = new THREE.Mesh(new THREE.ExtrudeGeometry(gable, { depth: d, bevelEnabled: false }), red); gb.position.set(0, h, -d / 2); G.add(gb);
  for (const s of [-1, 1]) { const rf = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(w / 2, 0.9) + 0.15, 0.06, d + 0.2), roofM); rf.position.set(s * w / 4, h + 0.45, 0); rf.rotation.z = -s * Math.atan2(0.9, w / 2); G.add(rf); }
  const fz = d / 2 + 0.012;
  const bar = (x, y, ww, hh, rz = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, 0.02), wh); m.position.set(x, y, fz); m.rotation.z = rz; G.add(m); };
  bar(0, 0.7, 1.2, 0.06); bar(0, 0.02 + 0.03, 1.2, 0.06); bar(-0.6, 0.38, 0.06, 0.72); bar(0.6, 0.38, 0.06, 0.72); bar(0, 0.38, 0.06, 0.72);
  bar(-0.3, 0.38, 0.75, 0.05, Math.atan2(0.66, 0.54)); bar(-0.3, 0.38, 0.75, 0.05, -Math.atan2(0.66, 0.54)); bar(0.3, 0.38, 0.75, 0.05, Math.atan2(0.66, 0.54)); bar(0.3, 0.38, 0.75, 0.05, -Math.atan2(0.66, 0.54));
  bar(-w / 2 + 0.03, h / 2, 0.06, h); bar(w / 2 - 0.03, h / 2, 0.06, h); bar(0, h - 0.03, w, 0.06);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), std('#f4f0e6')); win.position.set(0, h + 0.35, fz); G.add(win);
  return shad(G);
}
