// Đạo cụ tập 28 (Cowboys–Titans, gấu mèo vs bò sừng dài): thùng rác có nắp bật, thùng rác lớn (dumpster), lò hun khói BBQ,
// ghế xếp + dù che nắng + ly nước chanh, miếng pizza, túi rác, cân "1 TON", đại bàng đơn giản (bóng xa), bảng đếm.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, ...o });
const sh = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }

// Thùng rác tròn xanh có nắp (bản lề phía sau). G.userData: lid (xoay x để mở), tip (xoay để lật nhào), body.
export function trashCan(color = '#2e7a4a', h = 1.1, r = 0.38) {
  const G = new THREE.Group(); const tip = new THREE.Group(); G.add(tip);
  const m = std(color, { roughness: 0.45, metalness: 0.15 }), rim = std('#1e5a34', { roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.86, h, 24, 1, true), m); body.material.side = THREE.DoubleSide; body.position.y = h / 2; tip.add(body);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(r * 0.86, 24), m); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.01; tip.add(bot);
  for (let k = 1; k < 4; k++) { const b = new THREE.Mesh(new THREE.TorusGeometry(r * (0.86 + 0.14 * k / 4) + 0.01, 0.018, 6, 28), rim); b.rotation.x = Math.PI / 2; b.position.y = h * k / 4; tip.add(b); }
  const lip = new THREE.Mesh(new THREE.TorusGeometry(r + 0.01, 0.03, 6, 28), rim); lip.rotation.x = Math.PI / 2; lip.position.y = h; tip.add(lip);
  // rác bên trong (túi đen + giấy) — thấy khi nắp mở
  const fill = new THREE.Group(); fill.position.y = h * 0.78; tip.add(fill);
  for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.13 + (k % 2) * 0.05, 10, 8), std(['#1a1a1c', '#e8e0d0', '#c8a050', '#1a1a1c', '#a83a2a'][k], { roughness: 0.9 })); b.position.set(Math.cos(k * 1.3) * 0.15, (k % 3) * 0.04, Math.sin(k * 1.3) * 0.15); b.scale.y = 0.7; fill.add(b); }
  const hinge = new THREE.Group(); hinge.position.set(0, h + 0.02, -r); tip.add(hinge);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.04, r + 0.04, 0.06, 28), m); lid.position.set(0, 0.03, r); hinge.add(lid);
  const knob = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.05), rim); knob.position.set(0, 0.09, r); hinge.add(knob);
  G.userData = { tip, lid: hinge, body, h, r, fill };
  return sh(G);
}
// Thùng rác lớn kiểu dumpster: nắp 2 mảnh bật lên (bản lề sau), quay mặt +z
export function dumpster(color = '#2e6a44') {
  const G = new THREE.Group(); const m = std(color, { roughness: 0.55, metalness: 0.25 }), dark = std('#1c1c1e', { roughness: 0.6 });
  const W = 3.2, D = 1.8, H = 1.5, th = 0.06;
  const add = (w, h, d, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); G.add(b); return b; };
  add(W, th, D, 0, 0.25, 0); add(W, H, th, 0, 0.25 + H / 2, -D / 2); add(W, H * 0.9, th, 0, 0.25 + H * 0.45, D / 2); add(th, H, D, -W / 2, 0.25 + H / 2, 0); add(th, H, D, W / 2, 0.25 + H / 2, 0);
  for (const x of [-1.3, 1.3]) for (const z of [-0.7, 0.7]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12), dark); w.rotation.x = Math.PI / 2; w.position.set(x, 0.12, z); G.add(w); }
  for (const z of [-0.3, 0.3]) { const r = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, 0.08, 0.08), dark); r.position.set(0, 0.25 + H * 0.65, D / 2 + 0.05 + z * 0); G.add(r); }
  const lids = [-1, 1].map((s) => { const hg = new THREE.Group(); hg.position.set(s * W / 4, 0.25 + H, -D / 2); const l = new THREE.Mesh(new THREE.BoxGeometry(W / 2 - 0.04, 0.05, D + 0.06), std('#1c1c1e', { roughness: 0.8 })); l.position.set(0, 0.03, D / 2); hg.add(l); G.add(hg); return hg; });
  // chữ "TRASH" trắng mặt trước
  const t = ctex(512, 128, (g) => { g.fillStyle = color; g.fillRect(0, 0, 512, 128); g.fillStyle = '#f2f2f2'; g.font = '900 96px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TRASH', 256, 68); });
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), std('#ffffff', { map: t })); lab.position.set(0, 0.25 + H * 0.45, D / 2 + 0.035); G.add(lab);
  G.userData = { lids, W, D, H: H + 0.25 };
  return sh(G);
}
// Lò hun khói BBQ (thùng phuy nằm ngang + ống khói); G.userData.puffs = mảng khói để hoạt hoạ
export function smoker() {
  const G = new THREE.Group(); const blk = std('#1e1e22', { metalness: 0.55, roughness: 0.45 }), wood = std('#6a4a2a');
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 24), blk); drum.rotation.z = Math.PI / 2; drum.position.y = 1.15; G.add(drum);
  const fire = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), blk); fire.position.set(-1.5, 0.95, 0); G.add(fire);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), new THREE.MeshBasicMaterial({ color: '#ff8a2a' })); glow.position.set(-1.5, 0.8, 0.41); G.add(glow);
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 12), blk); stack.position.set(1.0, 2.1, 0); G.add(stack);
  for (const x of [-0.8, 0.8]) for (const z of [-0.35, 0.35]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), blk); l.position.set(x, 0.33, z); G.add(l); }
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.6), wood); shelf.position.set(0, 0.35, 0); G.add(shelf);
  const puffs = []; const sm = new THREE.MeshStandardMaterial({ color: '#d8d4cc', roughness: 1, transparent: true, opacity: 0.5, depthWrite: false });
  for (let k = 0; k < 8; k++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), sm.clone()); p.position.set(1.0, 2.9, 0); G.add(p); puffs.push(p); }
  G.userData = { puffs };
  sh(G); puffs.forEach((p) => { p.castShadow = false; }); return G;
}
export function animSmoke(sm, t) { sm.userData.puffs.forEach((p, k) => { const u = (t * 0.45 + k / 8) % 1; p.position.set(1.0 + Math.sin(k * 2 + t) * 0.15 * u + u * 0.4, 2.9 + u * 3.2, Math.cos(k * 3) * 0.2 * u); p.scale.setScalar(0.6 + u * 2.4); p.material.opacity = 0.5 * (1 - u); }); }
// Ghế xếp bãi biển + dù + bàn nhỏ có ly nước chanh (cho người đá punt)
export function lawnChair() {
  const G = new THREE.Group(); const al = std('#c8ccd2', { metalness: 0.7, roughness: 0.3 }), web = std('#2a4a8a', { roughness: 0.8 }), web2 = std('#f2f2f2', { roughness: 0.8 });
  const seat = new THREE.Group(); G.add(seat);
  for (const x of [-0.28, 0.28]) { const a = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 8), al); a.position.set(x, 0.28, 0.05); a.rotation.x = 1.0; seat.add(a);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 8), al); b.position.set(x, 0.28, 0.05); b.rotation.x = -1.0; seat.add(b);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.55), std('#e8e0d0')); arm.position.set(x, 0.55, 0.05); seat.add(arm); }
  for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.015, 0.07), k % 2 ? web : web2); s.position.set(0, 0.36, -0.12 + k * 0.08); seat.add(s); }
  for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.07, 0.015), k % 2 ? web : web2); s.position.set(0, 0.42 + k * 0.08, -0.2 - k * 0.04); s.rotation.x = -0.45; seat.add(s); }
  const umb = new THREE.Group(); umb.position.set(0.7, 0, -0.2); G.add(umb);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8), al); pole.position.y = 1.1; umb.add(pole);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.35, 12, 1, true), new THREE.MeshStandardMaterial({ color: '#f2f2f2', roughness: 0.8, side: THREE.DoubleSide })); cone.position.y = 2.15; umb.add(cone);
  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.01, 0.35, 12, 1, true, 0, Math.PI / 6), new THREE.MeshStandardMaterial({ color: '#1c3a6e', roughness: 0.8, side: THREE.DoubleSide }));
  for (let k = 0; k < 6; k++) { const c = cone2.clone(); c.rotation.y = k * Math.PI / 3; c.position.y = 2.151; umb.add(c); }
  const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), std('#f2f2f2')); tbl.position.set(-0.55, 0.5, 0.05); G.add(tbl);
  const tl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), al); tl.position.set(-0.55, 0.25, 0.05); G.add(tl);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.14, 12), new THREE.MeshStandardMaterial({ color: '#f6e27a', roughness: 0.2, transparent: true, opacity: 0.85 })); cup.position.set(-0.55, 0.585, 0.05); G.add(cup);
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), std('#e84a4a')); straw.position.set(-0.53, 0.68, 0.05); straw.rotation.z = 0.2; G.add(straw);
  G.userData = { seatH: 0.38, cup };
  return sh(G);
}
// miếng pizza tam giác (đầu nhọn +z), có pepperoni
export function pizzaSlice(s = 1) {
  const G = new THREE.Group(); const sh_ = new THREE.Shape(); sh_.moveTo(-0.13, 0); sh_.lineTo(0.13, 0); sh_.lineTo(0, 0.3); sh_.closePath();
  const base = new THREE.Mesh(new THREE.ExtrudeGeometry(sh_, { depth: 0.02, bevelEnabled: false }), std('#f2c75a', { roughness: 0.8 })); base.rotation.x = -Math.PI / 2; G.add(base);
  const crust = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.27, 8), std('#c8843a')); crust.rotation.z = Math.PI / 2; crust.position.set(0, 0.02, 0); G.add(crust);
  for (const [x, z] of [[-0.04, -0.07], [0.05, -0.08], [0, -0.17]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.008, 12), std('#a8281e')); p.position.set(x, 0.024, z); G.add(p); }
  G.scale.setScalar(s); return sh(G);
}
// túi rác đen buộc túm (để fan vẫy)
export function trashBag(c = '#1a1a1c') {
  const G = new THREE.Group(); const m = std(c, { roughness: 0.35, metalness: 0.1 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), m); b.scale.set(1, 1.25, 0.9); b.position.y = -0.3; G.add(b);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.12, 8), m); neck.position.y = -0.02; G.add(neck);
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), m); ear.position.set(s * 0.05, 0.06, 0); ear.rotation.z = -s * 0.6; G.add(ear); }
  return sh(G);
}
// cân sàn hiện số (canvas) — draw(text)
export function scale() {
  const G = new THREE.Group(); const plat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.0), std('#8a929e', { metalness: 0.7, roughness: 0.35 })); plat.position.y = 0.09; G.add(plat);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 0.15), std('#5a606a', { metalness: 0.6 })); post.position.set(1.8, 0.8, -0.9); G.add(post);
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.12), std('#1a1a1e')); box.position.set(1.8, 1.75, -0.9); G.add(box);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(1.8, 1.75, -0.835); G.add(face);
  const draw = (s) => { const g = cv.getContext('2d'); g.fillStyle = '#0c1a0c'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#7aff6a'; g.font = '900 150px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 256, 134); t.needsUpdate = true; };
  draw('0'); G.userData = { draw, top: 0.18 }; return sh(G);
}
// đại bàng đơn giản (chỉ thấy xa trên xà ngang): thân + đầu trắng + mỏ vàng + cánh khép/mở (wing() 0..1)
export function eagle() {
  const G = new THREE.Group(); const brown = std('#4a3220', { roughness: 0.9 }), white = std('#f4f2ec', { roughness: 0.9 }), yel = std('#e8b020', { roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), brown); body.scale.set(0.8, 1.3, 0.8); body.position.y = 0.32; G.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), white); head.position.set(0, 0.66, 0.03); G.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 8), yel); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.64, 0.15); G.add(beak);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.04), white); tail.position.set(0, 0.06, -0.12); tail.rotation.x = 0.4; G.add(tail);
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), yel); l.position.set(s * 0.07, 0.06, 0.02); G.add(l); }
  const wings = [-1, 1].map((s) => { const p = new THREE.Group(); p.position.set(s * 0.14, 0.42, 0); const w = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.28), brown); w.position.x = s * 0.35; p.add(w); G.add(p); return { p, s }; });
  G.userData.wing = (k) => wings.forEach(({ p, s }) => { p.rotation.z = s * (-1.25 + k * 1.35); });
  G.userData.wing(0); return sh(G);
}
