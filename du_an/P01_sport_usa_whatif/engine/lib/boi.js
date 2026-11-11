// E13: đạo cụ "chơi bóng rổ dưới nước" — chân vịt xanh, áo phao cam, xuồng chèo chữ BOSTON, mái chèo, mặt nước dâng.
// Đạo cụ gắn vào xương ở TƯ THẾ GỐC (bone.attach giữ biến đổi thế giới) — gọi addFlippers/addLifeJacket ngay sau khi tạo nhân vật + resetPose.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55 }, o));
const wp = (ch, n) => ch.bones[n].getWorldPosition(new THREE.Vector3());
const cvTex = (w, h, draw) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
function bindFrame(ch) { const r = ch.root, p = r.position.clone(), q = r.quaternion.clone(); r.position.set(0, 0, 0); r.quaternion.identity(); r.updateMatrixWorld(true); return () => { r.position.copy(p); r.quaternion.copy(q); r.updateMatrixWorld(true); }; }
// một chiếc chân vịt rời (gốc ở mũi giày, mũi chân vịt về +z)
export function flipperProp(color = '#19d36b') {
  const mat = std(color, { roughness: 0.35 }), dark = std('#0b5a2c', { roughness: 0.5 });
    const L = 0.62, sh = new THREE.Shape();
    sh.moveTo(-0.07, 0); sh.bezierCurveTo(-0.1, 0.2, -0.2, 0.42, -0.18, L); sh.quadraticCurveTo(-0.09, L - 0.07, 0, L - 0.02); sh.quadraticCurveTo(0.09, L - 0.07, 0.18, L); sh.bezierCurveTo(0.2, 0.42, 0.1, 0.2, 0.07, 0); sh.lineTo(-0.07, 0);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 16 });
    g.rotateX(Math.PI / 2); // hình nằm ngang, mũi chân vịt về +z
    const blade = new THREE.Mesh(g, mat); blade.castShadow = true;
    const G = new THREE.Group(); G.add(blade);
    blade.position.set(0, 0.024, -0.02);
    for (const k of [-1, 1]) { const rib = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.02, L * 0.8), dark); rib.position.set(k * 0.075, 0.035, L * 0.45); rib.rotation.y = -k * 0.12; G.add(rib); }
    const pocket = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat); pocket.scale.set(1.15, 0.9, 2.0); pocket.position.set(0, 0.018, 0.03); pocket.castShadow = true; G.add(pocket);
    return G;
}
// ---- chân vịt: tấm cao su loe rộng gắn vào xương ngón (ball_l/r) + túi chân trùm mũi giày
export function addFlippers(ch, color = '#19d36b') {
  const back = bindFrame(ch); const out = [];
  for (const sd of ['l', 'r']) {
    const foot = wp(ch, 'foot_' + sd), ball = wp(ch, 'ball_' + sd);
    const G = flipperProp(color);
    G.position.set(ball.x, 0.0, ball.z - 0.06); G.rotation.y = Math.atan2(ball.x - foot.x, ball.z - foot.z) * 0.3;
    G.updateMatrixWorld(true); ch.bones['ball_' + sd].attach(G); out.push(G);
  }
  back(); ch.flippers = out; return out;
}
// ---- áo phao cam: vỏ ellip quanh ngực + cổ phao + 2 đai đen + khoá
export function addLifeJacket(ch) {
  const back = bindFrame(ch);
  const s1 = wp(ch, 'spine_01'), s3 = wp(ch, 'spine_03'), nk = wp(ch, 'neck_01'), cl = wp(ch, 'clavicle_l'), cr = wp(ch, 'clavicle_r');
  const rx = 0.25, rz = 0.2, y0 = s1.y + 0.02, y1 = nk.y - 0.07, h = y1 - y0;
  const G = new THREE.Group(); const or = std('#ff6d12', { roughness: 0.5 }), bk = std('#141414', { roughness: 0.7 }), hi = std('#e8e8e8', { metalness: 0.3, roughness: 0.4 });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.06, h, 28, 6, true), or); shell.scale.set(rx, 1, rz); shell.material.side = THREE.DoubleSide;
  // phồng từng múi
  { const p = shell.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)); const yy = p.getY(i) / h; const bulge = 1 + 0.07 * Math.abs(Math.sin(a * 3)) - 0.06 * (2 * yy) * (2 * yy); p.setX(i, p.getX(i) * bulge); p.setZ(i, p.getZ(i) * bulge); } shell.geometry.computeVertexNormals(); }
  shell.position.y = y0 + h / 2; shell.castShadow = true; G.add(shell);
  const col = new THREE.Mesh(new THREE.TorusGeometry(1, 0.38, 12, 24), or); col.scale.set(rx * 0.62, rz * 0.62, 0.11 / 0.38); col.rotation.x = Math.PI / 2; col.position.set(0, y1 + 0.01, -0.01); col.castShadow = true; G.add(col);
  for (const f of [0.28, 0.62]) { const st = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 6, 32), bk); st.rotation.x = Math.PI / 2; st.scale.set(rx * 1.075, rz * 1.075, 1); st.position.y = y0 + h * f; G.add(st); const bu = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.045, 0.02), hi); bu.position.set(0, y0 + h * f, rz * 1.08); G.add(bu); }
  const zip = new THREE.Mesh(new THREE.BoxGeometry(0.02, h * 0.95, 0.01), bk); zip.position.set(0, y0 + h / 2, rz * 1.04); G.add(zip);
  const bt = cvTex(512, 128, (g, w, hh) => { g.fillStyle = '#ff6d12'; g.fillRect(0, 0, w, hh); g.font = '900 92px Inter'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BOSTON', w / 2, hh / 2 + 4); });
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(rx * 1.3, rx * 0.33), new THREE.MeshStandardMaterial({ map: bt, roughness: 0.6 })); lab.position.set(0, y0 + h * 0.62, -rz * 1.07); lab.rotation.y = Math.PI; G.add(lab);
  G.position.set(s3.x - s3.x, 0, (s3.z + s1.z) / 2 - 0.0); G.position.x = (s1.x + s3.x) / 2;
  G.updateMatrixWorld(true); ch.bones.spine_03.attach(G); back(); ch.jacket = G; return G;
}
// ---- xuồng chèo: thân dài theo trục x, đáy chạm sàn (y=0), mép thuyền ở y=D
export function makeCanoe(o = {}) {
  const L = o.L ?? 4.6, W = o.W ?? 1.0, D = o.D ?? 0.5, NU = 48, NV = 16;
  const pos = [], idx = [];
  for (let i = 0; i <= NU; i++) { const u = i / NU, su = Math.sin(Math.PI * u); const w = W / 2 * Math.pow(su, 0.55), d = D * Math.pow(su, 0.25), lift = 0.28 * Math.pow(Math.abs(2 * u - 1), 5);
    for (let j = 0; j <= NV; j++) { const th = Math.PI * j / NV; pos.push((u - 0.5) * L, D + lift - d * Math.sin(th) * 0.98, -Math.cos(th) * w); } }
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) { const a = i * (NV + 1) + j, b = a + NV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const G = new THREE.Group();
  const outer = new THREE.Mesh(g, std(o.color ?? '#0a7a3c', { roughness: 0.35, side: THREE.BackSide })), inner = new THREE.Mesh(g, std('#c8955a', { roughness: 0.7, side: THREE.FrontSide }));
  outer.castShadow = true; inner.receiveShadow = true; G.add(outer, inner);
  const rimPts = [s => s]; const pts = [];
  for (let k = 0; k <= 1; k++) { const side = k ? 1 : -1; const arr = []; for (let i = 0; i <= NU; i++) { const u = i / NU; arr.push(new THREE.Vector3((u - 0.5) * L, D + 0.28 * Math.pow(Math.abs(2 * u - 1), 5), side * W / 2 * Math.pow(Math.sin(Math.PI * u), 0.55))); }
    const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arr), 64, 0.03, 8), std('#f4f4f4', { roughness: 0.4 })); rim.castShadow = true; G.add(rim); }
  const seats = [];
  for (const x of o.seats ?? [-1.3, 0, 1.3]) { const u = x / L + 0.5; const w = W * Math.pow(Math.sin(Math.PI * u), 0.55); const b = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, w * 0.96), std('#8a5a2e', { roughness: 0.7 })); b.position.set(x, D * 0.55, 0); b.castShadow = true; G.add(b); seats.push(new THREE.Vector3(x, D * 0.55 + 0.03, 0)); }
  const tx = cvTex(1024, 192, (c, w, h) => { c.clearRect(0, 0, w, h); c.font = '900 150px Anton'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 16; c.strokeStyle = '#063d1e'; c.strokeText('BOSTON', w / 2, h / 2 + 6); c.fillStyle = '#ffffff'; c.fillText('BOSTON', w / 2, h / 2 + 6); });
  for (const k of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.34), new THREE.MeshStandardMaterial({ map: tx, transparent: true, roughness: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); p.position.set(0, D * 0.62, k * (W / 2 * 0.985)); p.rotation.set(-k * 0.25, k > 0 ? 0 : Math.PI, 0); G.add(p); }
  G.userData = { L, W, D, seats }; return G;
}
// ---- mái chèo: gốc (tay nắm T) tại (0,0,0), thân theo -y, bản chèo ở cuối
export function makePaddle(len = 1.5) {
  const G = new THREE.Group(); const wd = std('#d9a564', { roughness: 0.6 }), bl = std('#0a7a3c', { roughness: 0.4 });
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, len, 10), wd); sh.position.y = -len / 2; G.add(sh);
  const tg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), wd); tg.rotation.z = Math.PI / 2; G.add(tg);
  const b = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), bl); b.scale.set(0.1, 0.24, 0.018); b.position.y = -len - 0.12; G.add(b);
  G.traverse(m => { if (m.isMesh) m.castShadow = true; }); G.userData.len = len + 0.12; return G;
}
// ---- mặt nước dâng (tập kết "Boston plays underwater")
export function makeWater(sizeX = 70, sizeZ = 50) {
  const g = new THREE.PlaneGeometry(sizeX, sizeZ, 140, 100); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#1f8fd6', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.72 }));
  const base = g.attributes.position.array.slice();
  m.userData.update = (t) => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = base[i * 3], z = base[i * 3 + 2]; p.setY(i, 0.035 * Math.sin(x * 1.7 + t * 2.3) + 0.025 * Math.sin(z * 2.3 - t * 1.9)); } p.needsUpdate = true; g.computeVertexNormals(); };
  m.receiveShadow = true; return m;
}
// bọt khí nhỏ
export function makeBubbles(n = 60) { const G = new THREE.Group(); const mat = std('#d8f2ff', { roughness: 0.1, transparent: true, opacity: 0.7 }); for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.03 + (i % 5) * 0.012, 10, 8), mat); b.userData.s = [((i * 37) % 100) / 100, ((i * 61) % 100) / 100, ((i * 13) % 100) / 100]; G.add(b); } return G; }
