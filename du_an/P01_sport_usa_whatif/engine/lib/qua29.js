// Tập 29 — QUẠ THẬT dựng bằng code (Baltimore Ravens). Lông đen bóng ánh tím-lam (iridescence), mỏ dày cong, lông cổ xù,
// cánh 3 khớp (vai–khuỷu–cổ tay) với lông sơ cấp xoè như ngón tay, đuôi hình nêm, chân 4 ngón. Dài ~0,62 m (quạ thật), thường phóng ×1,6.
// G.userData.set({spread 0..1, flap pha rad, flapAmp, head:[yaw,pitch], beak 0..1, tail 0..1, crouch 0..1, legs 0..1 (0 = co khi bay), hop})
// G.userData.beakTip / talon: Object3D để gắn bóng.
import * as THREE from 'three';
const TAU = Math.PI * 2;
let _tex = null;
function featherTex() {
  if (_tex) return _tex;
  const c = document.createElement('canvas'); c.width = 128; c.height = 512; const g = c.getContext('2d');
  g.clearRect(0, 0, 128, 512);
  // phiến lông: hình lưỡi mác bo đầu, cánh trong rộng hơn
  g.beginPath(); g.moveTo(64, 508); g.bezierCurveTo(20, 420, 8, 160, 40, 30); g.quadraticCurveTo(64, -6, 90, 34); g.bezierCurveTo(116, 170, 110, 420, 64, 508); g.closePath();
  const gr = g.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, '#2a2a33'); gr.addColorStop(0.5, '#3a3a46'); gr.addColorStop(1, '#22222a');
  g.fillStyle = gr; g.fill(); g.save(); g.clip();
  // tơ lông chéo
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 1.2;
  for (let y = -40; y < 560; y += 7) { g.beginPath(); g.moveTo(64, y); g.lineTo(0, y - 46); g.moveTo(64, y); g.lineTo(128, y - 46); g.stroke(); }
  g.strokeStyle = 'rgba(160,170,220,0.10)'; g.lineWidth = 2;
  for (let y = -40; y < 560; y += 19) { g.beginPath(); g.moveTo(66, y); g.lineTo(124, y - 44); g.stroke(); }
  // vài khe tách tơ
  g.strokeStyle = 'rgba(0,0,0,0.9)'; g.lineWidth = 2; [[140, -1], [300, 1], [380, -1]].forEach(([y, s]) => { g.beginPath(); g.moveTo(64, y); g.lineTo(64 + s * 60, y - 50); g.stroke(); });
  g.restore();
  // cuống lông
  g.strokeStyle = '#4a4a56'; g.lineWidth = 3; g.beginPath(); g.moveTo(64, 508); g.lineTo(64, 20); g.stroke();
  _tex = new THREE.CanvasTexture(c); _tex.colorSpace = THREE.SRGBColorSpace; _tex.anisotropy = 8; return _tex;
}
let _btex = null;
function bodyTex() {
  if (_btex) return _btex;
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#17171d'; g.fillRect(0, 0, 512, 512);
  // vảy lông chồng lớp
  for (let y = 0; y < 560; y += 22) for (let x = (y / 22) % 2 ? 0 : 16; x < 540; x += 32) {
    const gr = g.createRadialGradient(x, y, 2, x, y, 22); gr.addColorStop(0, '#2c2c38'); gr.addColorStop(0.75, '#1a1a22'); gr.addColorStop(1, '#0c0c10');
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 17, 22, 0, 0, Math.PI); g.fill(); }
  _btex = new THREE.CanvasTexture(c); _btex.colorSpace = THREE.SRGBColorSpace; _btex.wrapS = _btex.wrapT = THREE.RepeatWrapping; _btex.repeat.set(3, 3); _btex.anisotropy = 8; return _btex;
}
const plumage = () => new THREE.MeshPhysicalMaterial({ color: '#30303a', map: bodyTex(), roughness: 0.55, metalness: 0.0, clearcoat: 0.25, clearcoatRoughness: 0.5,
  iridescence: 0.45, iridescenceIOR: 1.5, iridescenceThicknessRange: [260, 480], sheen: 0.35, sheenColor: new THREE.Color('#34348a'), sheenRoughness: 0.5 });
const featherMat = () => new THREE.MeshPhysicalMaterial({ color: '#30303c', map: featherTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.38, metalness: 0.05,
  clearcoat: 0.4, clearcoatRoughness: 0.3, iridescence: 0.9, iridescenceIOR: 1.55, iridescenceThicknessRange: [300, 520], sheen: 0.5, sheenColor: new THREE.Color('#4a4aa0') });
const beakMat = () => new THREE.MeshPhysicalMaterial({ color: '#16161a', roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 });
const legMat = () => new THREE.MeshStandardMaterial({ color: '#1c1c20', roughness: 0.6 });
// một lông vũ: mặt phẳng gốc ở (0,0,0), dài theo -z (ra sau) hoặc theo trục tuỳ chọn, hơi cong
function feather(len, wid, mat, bend = 0.12) {
  const geo = new THREE.PlaneGeometry(wid, len, 2, 8); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) + len / 2; const x = p.getX(i); const k = y / len; p.setXYZ(i, x, -k * k * bend * len + Math.abs(x) * 0.15, -y); }
  geo.rotateX(0); geo.computeVertexNormals();
  // UV: v=1 ở chóp (canvas trên), gốc v=0
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; return m;
}
let _wtex = null;
// toàn bộ mặt cánh xoè (nhìn từ trên): u = sải (0 vai → 1 chóp), v = dây cung (0 mép trước → 1 mép sau). Alpha định hình viền + khe "ngón" lông sơ cấp.
export function wingTex() {
  if (_wtex) return _wtex;
  const W = 1024, H = 384; const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  // viền cánh quạ: mép trước cong nhẹ, mép sau thẳng tới cổ tay rồi vát vào chóp; 5 lông sơ cấp ngoài cùng tách "ngón"
  const lead = (u) => H * (0.06 + 0.06 * Math.sin(Math.min(1, u / 0.55) * Math.PI * 0.5) - (u > 0.55 ? (u - 0.55) * 0.12 : 0));
  const trail = (u) => H * (u < 0.55 ? 0.9 - 0.04 * u : 0.88 - (u - 0.55) * 0.3);
  g.clearRect(0, 0, W, H);
  // phần liền khối (đến u=0.78)
  g.beginPath(); g.moveTo(0, lead(0)); for (let u = 0; u <= 0.8; u += 0.01) g.lineTo(u * W, lead(u)); for (let u = 0.8; u >= 0; u -= 0.01) g.lineTo(u * W, trail(u)); g.closePath();
  const base = g.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#2a2a36'); base.addColorStop(0.35, '#22222c'); base.addColorStop(1, '#16161c'); g.fillStyle = base; g.fill();
  // 5 ngón sơ cấp toả ra
  for (let i = 0; i < 5; i++) { const u0 = 0.74 + i * 0.045; const x0 = u0 * W, y0 = lead(u0) + 10; const ang = -0.05 - i * 0.12; const len = H * (0.78 - i * 0.03), w = 34;
    g.save(); g.translate(x0, y0); g.rotate(ang); g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(w / 2, 0); g.quadraticCurveTo(w * 0.55, len * 0.85, w * 0.1, len); g.quadraticCurveTo(-w * 0.3, len * 0.9, -w / 2, 0); g.closePath();
    g.fillStyle = '#1a1a22'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 2; g.stroke(); g.strokeStyle = 'rgba(110,115,150,0.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 4); g.lineTo(w * 0.05, len * 0.95); g.stroke(); g.restore(); }
  // đường mép lông bay (thứ cấp) trên phần liền khối
  g.save(); g.beginPath(); g.moveTo(0, lead(0)); for (let u = 0; u <= 0.8; u += 0.01) g.lineTo(u * W, lead(u)); for (let u = 0.8; u >= 0; u -= 0.01) g.lineTo(u * W, trail(u)); g.closePath(); g.clip();
  for (let x = 20; x < W * 0.8; x += 38) { const u = x / W; g.strokeStyle = 'rgba(0,0,0,0.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, H * 0.42); g.lineTo(x + 10, trail(u) + 8); g.stroke();
    g.strokeStyle = 'rgba(120,125,165,0.22)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 14, H * 0.44); g.lineTo(x + 22, trail(u)); g.stroke(); }
  // lông bao phủ dạng vảy 3 hàng
  for (let r = 0; r < 3; r++) for (let x = 6 + (r % 2) * 13; x < W * (0.8 - r * 0.08); x += 26) { const y = lead(x / W) + H * (0.06 + r * 0.1);
    const gr = g.createRadialGradient(x - 3, y - 5, 2, x, y, 26); gr.addColorStop(0, '#34343f'); gr.addColorStop(1, '#1a1a22'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 16, 24, 0.15, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.45)'; g.lineWidth = 1; g.stroke(); }
  g.restore();
  _wtex = new THREE.CanvasTexture(c); _wtex.colorSpace = THREE.SRGBColorSpace; _wtex.anisotropy = 8; return _wtex;
}
export const SPAN = 0.62, CH = 0.34;  // nửa sải (m) và dây cung tối đa
// tấm cánh: phần [u0,u1] của mặt cánh, gốc tại u0 mép trước; trục +x = sải ra ngoài, -z = về sau
export function wingPanel(u0, u1, mat) {
  const geo = new THREE.PlaneGeometry((u1 - u0) * SPAN, CH, 10, 6); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i) + (u1 - u0) * SPAN / 2, z = p.getZ(i) - CH / 2; const U = u0 + x / SPAN, Vv = -z / CH;
    p.setXYZ(i, x, 0.025 * Math.sin(Vv * Math.PI) * (1 - U * 0.6) - 0.01 * Vv, z); uv.setXY(i, U, 1 - Vv); }
  geo.computeVertexNormals(); const m = new THREE.Mesh(geo, mat); return m;
}
export function raven(opt = {}) {
  const G = new THREE.Group(); G.name = 'raven';
  const pl = plumage(), bk = beakMat(), lm = legMat();
  const wm = new THREE.MeshPhysicalMaterial({ color: '#3a3a46', map: wingTex(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.35, iridescence: 0.5, iridescenceIOR: 1.5, iridescenceThicknessRange: [300, 500], sheen: 0.4, sheenColor: new THREE.Color('#3c3c90') });
  const fm = featherMat();
  const fwm = new THREE.MeshPhysicalMaterial({ color: '#3a3a46', map: foldTex(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4, iridescence: 0.4, iridescenceIOR: 1.5, iridescenceThicknessRange: [300, 500], sheen: 0.4, sheenColor: new THREE.Color('#3c3c90') });
  const hip = new THREE.Group(); hip.position.y = 0.2; G.add(hip);
  const body = new THREE.Group(); hip.add(body);
  // thân liền khối: lathe dọc trục z từ gốc đuôi (-0.16) tới trán (+0.24) — ngực phồng, cổ dày, đầu
  const prof = [];
  const R_ = (z) => { const b = 0.088 * Math.pow(Math.max(0, 1 - Math.pow((z - 0.0) / 0.17, 2)), 0.55); const h = 0.056 * Math.pow(Math.max(0, 1 - Math.pow((z - 0.19) / 0.065, 2)), 0.5); const n = 0.062 * Math.exp(-Math.pow((z - 0.13) / 0.05, 2)); return Math.max(b, h, n, 0.001); };
  for (let i = 0; i <= 40; i++) { const z = -0.165 + i * (0.42 / 40); prof.push(new THREE.Vector2(R_(z), z)); }
  const lg = new THREE.LatheGeometry(prof, 32); lg.rotateX(Math.PI / 2); { const p = lg.attributes.position; for (let i = 0; i < p.count; i++) { const z = p.getZ(i); let y = p.getY(i); // đầu/cổ nhô cao, bụng phẳng
      const lift = 0.07 * Math.exp(-Math.pow((z - 0.2) / 0.08, 2)) + 0.03 * Math.exp(-Math.pow((z - 0.12) / 0.06, 2)); y = y * (y < 0 ? 0.92 : 1.0) + lift; p.setY(i, y); p.setX(i, p.getX(i) * (z > 0.15 ? 0.92 : 1.0)); } lg.computeVertexNormals(); }
  const torso = new THREE.Mesh(lg, pl); body.add(torso);
  const headG = new THREE.Group(); headG.position.set(0, 0.07, 0.2); body.add(headG);
  // lông cổ xù
  for (let i = 0; i < 11; i++) { const a = (i - 5) * 0.2; const f = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.06, 5), pl); f.position.set(Math.sin(a) * 0.04, -0.06, -0.005 + Math.cos(a) * 0.03); f.rotation.set(Math.PI * 0.86, 0, a * 0.5); headG.add(f); }
  // mỏ trên: nón 12 cạnh dẹt, uốn cong xuống ở chóp
  const beakTop = new THREE.Group(); beakTop.position.set(0, 0.004, 0.045); headG.add(beakTop);
  { const L = 0.085; const g = new THREE.ConeGeometry(0.02, L, 14, 10); g.rotateX(Math.PI / 2); g.translate(0, 0, L / 2); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const z = p.getZ(i), u = z / L; p.setX(i, p.getX(i) * 0.72); p.setY(i, p.getY(i) * 1.15 - 0.016 * u * u * u + 0.006 * Math.sin(u * Math.PI) ); } g.computeVertexNormals();
    beakTop.add(new THREE.Mesh(g, bk));
    const nf = new THREE.Mesh(new THREE.SphereGeometry(0.021, 12, 8), pl); nf.scale.set(0.95, 0.6, 1.5); nf.position.set(0, 0.009, 0.01); beakTop.add(nf); }
  const jaw = new THREE.Group(); jaw.position.set(0, -0.012, 0.045); headG.add(jaw);
  { const L = 0.072; const g = new THREE.ConeGeometry(0.014, L, 12, 6); g.rotateX(Math.PI / 2); g.translate(0, 0, L / 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { p.setX(i, p.getX(i) * 0.8); p.setY(i, p.getY(i) * 0.5); } g.computeVertexNormals(); jaw.add(new THREE.Mesh(g, bk)); }
  const beakTip = new THREE.Object3D(); beakTip.position.set(0, -0.02, 0.08); beakTop.add(beakTip);
  const eyeM = new THREE.MeshPhysicalMaterial({ color: '#0a0705', roughness: 0.05, clearcoat: 1 }); const hlM = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.0105, 14, 10), eyeM); e.position.set(s * 0.043, 0.016, 0.018); headG.add(e);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.0026, 6, 4), hlM); h.position.set(s * 0.052, 0.02, 0.024); headG.add(h); }
  // cánh: vai → (tấm trong 0..0.52) → cổ tay → (tấm ngoài 0.52..1)
  const wings = [-1, 1].map((s) => {
    const sh = new THREE.Group(); sh.position.set(s * 0.06, 0.05, 0.1); body.add(sh);
    const side = new THREE.Group(); side.scale.x = s; sh.add(side);       // gương trái/phải
    const inner = wingPanel(0, 0.52, wm); side.add(inner);
    const wr = new THREE.Group(); wr.position.x = 0.52 * SPAN; side.add(wr);
    const outer = wingPanel(0.52, 1.0, wm); wr.add(outer);
    const fw = foldWing(fwm); fw.scale.x = s; fw.position.set(s * 0.035, 0.075, 0.075); sh.add(fw);
    return { s, sh, side, wr, fw };
  });
  // đuôi hình nêm
  const tail = new THREE.Group(); tail.position.set(0, 0.012, -0.145); body.add(tail);
  const tf = []; for (let i = 0; i < 12; i++) { const c = (i - 5.5) / 5.5; const len = 0.19 + 0.06 * (1 - Math.abs(c)); const p = new THREE.Group(); p.position.set(c * 0.018, 0.002 * Math.abs(c), 0); const f = feather(len, 0.05, fm, -0.04); p.add(f); tail.add(p); tf.push({ p, c }); }
  // chân + ngón
  const legs = [-1, 1].map((s) => { const L = new THREE.Group(); L.position.set(s * 0.035, -0.055, 0.03); hip.add(L);
    const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), pl); thigh.scale.set(0.8, 1.3, 1); L.add(thigh);
    const shin = new THREE.Group(); shin.position.y = -0.025; L.add(shin);
    const tars = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0075, 0.1, 8), lm); tars.position.y = -0.05; shin.add(tars);
    const foot = new THREE.Group(); foot.position.y = -0.1; shin.add(foot);
    const toes = [[-0.45, 0.045], [0, 0.052], [0.45, 0.045], [Math.PI, 0.035]].map(([a, l]) => { const t = new THREE.Group(); t.rotation.y = a; foot.add(t);
      const tg = new THREE.Group(); t.add(tg); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.005, l, 6), lm); m.rotation.x = Math.PI / 2; m.position.set(0, 0.004, l / 2); tg.add(m);
      const cw = new THREE.Mesh(new THREE.ConeGeometry(0.0042, 0.013, 6), bk); cw.rotation.x = Math.PI / 2 + 0.7; cw.position.set(0, 0.0, l + 0.004); tg.add(cw); return tg; });
    return { L, shin, foot, toes }; });
  const talon = new THREE.Object3D(); talon.position.set(0, -0.16, 0.04); hip.add(talon);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
  const sc = opt.scale ?? 1.6; G.scale.setScalar(sc);
  const lerp = (a, b, k) => a + (b - a) * k;
  const D = { spread: 0, flap: 0, flapAmp: 1, head: [0, 0], beak: 0, tail: 0.2, crouch: 0, legs: 1, hop: 0, pitch: 0 };
  G.userData.set = (o = {}) => { const st = { ...D, ...o };
    const sp = st.spread, fl = Math.sin(st.flap) * st.flapAmp * sp, fl2 = Math.sin(st.flap - 0.7) * st.flapAmp * sp;
    hip.position.y = 0.2 - st.crouch * 0.05 + st.hop; hip.rotation.x = -st.pitch;
    for (const w of wings) {
      // gấp: sải quét ra sau áp sườn (y), hơi úp; tấm ngoài gập thêm, toàn cánh nén ngắn; xoè: duỗi ngang + vỗ (z)
      const folded = sp < 0.12; w.side.visible = !folded; w.fw.visible = folded; w.fw.rotation.set(0.04 * Math.sin(st.flap) , 0, 0);
      w.side.rotation.order = 'YXZ';
      // gấp: lăn quanh trục sải cho mặt cánh dựng đứng áp sườn (mép sau chúc xuống), rồi quét ra sau; xoè: phẳng ngang + vỗ
      w.side.rotation.set(lerp(-1.35, 0, sp), w.s * lerp(1.5, 0.1, sp), w.s * (lerp(-0.12, 0.05, sp) + fl * 0.9));
      w.side.position.set(w.s * lerp(0.03, 0, sp), lerp(0.035, 0, sp), lerp(0.0, 0, sp));
      w.side.scale.set(w.s * lerp(0.56, 1, sp), 1, lerp(0.62, 1, sp));
      w.wr.rotation.set(0, lerp(0.06, -0.08, sp), lerp(0, 0, sp) + fl2 * 0.55); }
    tf.forEach(({ p, c }) => { p.rotation.set(0, c * lerp(0.05, 0.3, st.tail), 0); });
    tail.rotation.x = 0.1 - 0.2 * sp + 0.08 * Math.sin(st.flap) * sp;
    headG.rotation.set(-st.head[1] * 0.7, st.head[0] * 0.8, st.head[0] * 0.15);
    jaw.rotation.x = st.beak * 0.55; beakTop.rotation.x = -st.beak * 0.1;
    legs.forEach(({ L, shin, foot, toes }) => { L.rotation.x = lerp(1.3, 0, st.legs) - st.crouch * 0.5; shin.rotation.x = st.crouch * 1.0 + lerp(0.5, 0, st.legs); foot.rotation.x = -L.rotation.x - shin.rotation.x + lerp(-0.4, 0, st.legs);
      toes.forEach((t, k) => { t.rotation.x = lerp(0.9, 0, st.legs) * (k === 3 ? -1 : 1); }); });
    G.updateMatrixWorld(true); };
  G.userData.set({});
  G.userData.beakTip = beakTip; G.userData.talon = talon; G.userData.head = headG;
  return G;
}
// bước nhảy lò cò kiểu quạ (đi = nhảy hai chân): trả về {hop, pitch} theo thời gian
export function ravenHop(t, rate = 3) { const ph = (t * rate) % 1; return { hop: Math.max(0, Math.sin(ph * Math.PI)) * 0.05, pitch: 0.1 * Math.sin(ph * Math.PI * 2) }; }
