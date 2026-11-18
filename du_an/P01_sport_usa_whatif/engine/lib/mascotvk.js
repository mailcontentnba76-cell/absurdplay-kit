// Tập 22 (Mascot) — đạo cụ: Viking (thuyền rồng, khiên tròn, rìu gỗ, mũ nón có thanh che mũi, mũ có sừng, bím râu)
// vs thợ đào vàng 1849 (cuốc chim, chảo đãi vàng phát sáng, máng đãi, xe goòng + ray, lều, ụ đất, thỏi thuốc nổ chưa châm, mũ vành rộng, đèn bão)
// + mascot montage: Titan khổng lồ (toga + vòng nguyệt quế), máy bay phản lực, cá heo. Không logo, không màu/biểu tượng chính thức của đội.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const WOOD = () => ctex(256, 256, (g, W, H) => { g.fillStyle = '#8a5a32'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 2) { g.fillStyle = `rgba(60,30,10,${0.08 + 0.1 * Math.abs(Math.sin(y * 0.21))})`; g.fillRect(0, y, W, 1); } });
// ---------- VIKING ----------
// khiên tròn: mặt hướng +z, đường kính 0,85 m; 4 múi màu xen kẽ + tâm sắt
export function shield(c1 = '#6a3fb0', c2 = '#e8c040', num = null) {
  const G = new THREE.Group();
  const t = ctex(256, 256, (g) => { for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? c1 : c2; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 128, i * Math.PI / 2, (i + 1) * Math.PI / 2); g.fill(); }
    g.strokeStyle = 'rgba(60,30,10,0.35)'; for (let x = 0; x < 256; x += 22) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
    if (num != null) { g.fillStyle = '#fff'; g.font = '900 90px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 10; g.strokeStyle = '#2a1a0a'; g.strokeText(String(num), 128, 196); g.fillText(String(num), 128, 196); } });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.035, 32), [std('#5a3a1a'), std('#ffffff', { map: t }), std('#5a3a1a')]); disc.rotation.x = Math.PI / 2; G.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 6, 40), std('#6a6e74', { metalness: 0.7, roughness: 0.35 })); G.add(rim);
  const boss = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std('#8a8e96', { metalness: 0.8, roughness: 0.3 })); boss.rotation.x = Math.PI / 2; boss.position.z = 0.018; G.add(boss);
  return shad(G);
}
// rìu gỗ đạo cụ (lưỡi gỗ sơn bạc, không sắc): cán dọc trục y, gốc ở tay cầm
export function axe() { const G = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.8, 8), std('#7a5030')); h.position.y = 0.3; G.add(h);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.2), std('#b8bcc4', { metalness: 0.5, roughness: 0.4 })); b.position.set(0, 0.62, 0.1); G.add(b); return shad(G); }
// mũ Viking đúng lịch sử: nón sắt + thanh che mũi; horned=true → gag mũ có sừng
export function vikingHelm(horned = false) {
  const G = new THREE.Group(); const m = std(horned ? '#c4c8d0' : '#8e939b', { metalness: horned ? 0.45 : 0.75, roughness: 0.35 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.125, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); cap.scale.y = 1.25; G.add(cap);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.124, 0.012, 6, 24), std('#6a5a3a', { metalness: 0.6 })); band.rotation.x = Math.PI / 2; G.add(band);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.012), m); nose.position.set(0, -0.045, 0.125); G.add(nose);
  if (horned) for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 12), std('#f0e6cc', { roughness: 0.5 })); c.position.set(s * 0.15, 0.08, 0); c.rotation.z = -s * 1.0; G.add(c); }
  return shad(G);
}
// bím râu dài (Viking)
export function braidBeard(color = '#a8642a') { const G = new THREE.Group(); const m = std(color, { roughness: 0.9 });
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.03 - i * 0.004, 8, 6), m); b.position.set(s * 0.03, -0.02 - i * 0.045, 0); G.add(b); }
  return G; }
// thuyền rồng: dài ~9 m, mũi rồng cong, khiên dọc mạn, buồm sọc. Gốc ở giữa đáy, mũi hướng +z
export function longship() {
  const G = new THREE.Group(); const wood = std('#ffffff', { map: WOOD(), roughness: 0.8 });
  const sh = new THREE.Shape(); sh.moveTo(-4.5, 0.6); sh.quadraticCurveTo(0, -0.9, 4.5, 0.6); sh.lineTo(4.2, 0.9); sh.quadraticCurveTo(0, 0.2, -4.2, 0.9); sh.lineTo(-4.5, 0.6);
  for (const s of [-1, 1]) { const side = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: false }), wood); side.rotation.y = -Math.PI / 2; side.position.x = s * 0.95; side.scale.set(1, 1.3, 1); G.add(side); }
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 8.2), wood); deck.position.y = 0.05; G.add(deck);
  const keel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 8.6), wood); keel.position.y = -0.1; G.add(keel);
  // mũi + đuôi cong
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.6, 4.3), new THREE.Vector3(0, 1.6, 4.9), new THREE.Vector3(0, 2.7, 4.8), new THREE.Vector3(0, 3.0, 4.3)]);
  const prow = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.12, 8), wood); G.add(prow);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 8), std('#c8942a', { roughness: 0.5 })); head.position.set(0, 3.05, 4.05); head.rotation.x = Math.PI / 2 + 0.3; G.add(head);
  for (const s of [-1, 1]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), std('#ffefa0', { emissive: '#ffcf40', emissiveIntensity: 0.6 })); eye.position.set(s * 0.13, 3.1, 4.25); G.add(eye); }
  const stern = prow.clone(); stern.rotation.y = Math.PI; G.add(stern);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 6, 10), wood); mast.position.y = 3.0; G.add(mast);
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.0, 8, 4), new THREE.MeshStandardMaterial({ map: ctex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#6a3fb0' : '#f2ead8'; g.fillRect(i * 32, 0, 32, 256); } }), side: THREE.DoubleSide, roughness: 0.9 }));
  const p = sail.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, 0.35 * Math.sin((p.getY(i) + 1.5) / 3 * Math.PI)); sail.geometry.computeVertexNormals();
  sail.position.set(0, 4.0, 0.2); sail.rotation.y = Math.PI / 2; G.add(sail);
  const cols = [['#6a3fb0', '#e8c040'], ['#e8c040', '#6a3fb0'], ['#b02a2a', '#f2ead8']];
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const sd = shield(...cols[i % 3]); sd.scale.setScalar(0.7); sd.position.set(s * 1.05, 0.95, -3 + i * 1.2); sd.rotation.y = s * Math.PI / 2; G.add(sd); }
  return shad(G);
}
// ---------- THỢ ĐÀO VÀNG 1849 ----------
export function minerHat(c = '#c8a46a') { const G = new THREE.Group(); const m = std(c, { roughness: 0.9 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.015, 24), m); G.add(brim);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.13, 18), m); crown.position.y = 0.07; G.add(crown);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.122, 0.025, 18), std('#5a3a20')); band.position.y = 0.02; G.add(band); return shad(G); }
export function pickaxe() { const G = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.85, 8), std('#8a6040')); h.position.y = 0.32; G.add(h);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), std('#6e7278', { metalness: 0.7, roughness: 0.4 })); head.position.y = 0.72; G.add(head);
  for (const s of [-1, 1]) { const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 6), head.material); tip.rotation.z = -s * Math.PI / 2; tip.position.set(s * 0.29, 0.72, 0); G.add(tip); } return shad(G); }
// chảo đãi vàng; glow 0..1 → vàng phát sáng
export function goldPan() { const G = new THREE.Group(); const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.06, 24, 1, true), std('#5a5e66', { metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })); G.add(pan);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(0.14, 20), pan.material); bot.rotation.x = -Math.PI / 2; bot.position.y = -0.029; G.add(bot);
  const gm = new THREE.MeshStandardMaterial({ color: '#ffd24a', metalness: 0.9, roughness: 0.25, emissive: '#ffb020', emissiveIntensity: 0 });
  for (let i = 0; i < 14; i++) { const n = new THREE.Mesh(new THREE.DodecahedronGeometry(0.018 + (i % 3) * 0.008), gm); const a = i * 2.4, r = 0.03 + (i % 5) * 0.018; n.position.set(Math.cos(a) * r, -0.015, Math.sin(a) * r); G.add(n); }
  G.userData.glow = (k) => { gm.emissiveIntensity = 2.5 * k; }; return shad(G); }
export function dynamite() { const G = new THREE.Group(); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 10), std('#c2302a')); G.add(st);
  const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 4), std('#e8e0c8')); fuse.position.y = 0.14; fuse.rotation.z = 0.3; G.add(fuse); return shad(G); }
export function lantern() { const G = new THREE.Group(); const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 10), new THREE.MeshStandardMaterial({ color: '#fff2c8', emissive: '#ffc860', emissiveIntensity: 1.5, transparent: true, opacity: 0.85 })); G.add(glass);
  for (const y of [-0.08, 0.08]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 10), std('#2a2a2a', { metalness: 0.6 })); c.position.y = y; G.add(c); } return G; }
// máng đãi vàng (sluice) + xe goòng trên ray + lều bạt
export function camp() {
  const G = new THREE.Group(); const wood = std('#ffffff', { map: WOOD() });
  const sl = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 0.6), wood); sl.position.set(0, 0.7, 0); sl.rotation.z = 0.12; G.add(sl);
  for (const x of [-1.6, 1.6]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), wood); l.position.set(x, 0.4 + x * 0.06, 0.25); G.add(l); }
  const water = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 0.45), new THREE.MeshStandardMaterial({ color: '#7ab8d8', roughness: 0.15, metalness: 0.2 })); water.rotation.set(-Math.PI / 2, 0, 0.12); water.position.set(0, 0.86, 0); G.add(water);
  for (const z of [-0.45, 0.45]) { const r = new THREE.Mesh(new THREE.BoxGeometry(9, 0.06, 0.07), std('#6e7278', { metalness: 0.7 })); r.position.set(-1, 0.03, 2.2 + z); G.add(r); }
  for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.3), wood); t.position.set(-5 + i * 1.0, 0.01, 2.2); G.add(t); }
  const cart = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 0.9), std('#5a4a3a', { metalness: 0.4 })); body.position.y = 0.55; cart.add(body);
  const ore = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), std('#ffd24a', { metalness: 0.8, roughness: 0.3, emissive: '#8a5a10', emissiveIntensity: 0.4 })); ore.scale.set(1.2, 0.5, 0.8); ore.position.y = 0.85; cart.add(ore);
  for (const x of [-0.45, 0.45]) for (const z of [-0.45, 0.45]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12), std('#2a2a2a')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.17, z); cart.add(w); }
  cart.position.set(-1.5, 0, 2.2); G.add(cart); G.userData.cart = cart;
  const tent = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.0, 4), std('#e8dcc0', { roughness: 0.95 })); tent.position.set(3.6, 1.0, -0.6); tent.rotation.y = Math.PI / 4; G.add(tent);
  const flap = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), std('#3a2a1a', { side: THREE.DoubleSide })); flap.position.set(3.6, 0.5, 0.36); G.add(flap);
  const lt = lantern(); lt.position.set(1.6, 1.2, 0.3); G.add(lt);
  return shad(G);
}
// ụ đất / hố đào (k: 0 phẳng → 1 bung lên); tâm ở gốc
export function dirtMound() { const G = new THREE.Group(); const m = std('#7a5a3a', { roughness: 1 });
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m); mound.scale.set(1.6, 0.6, 1.6); G.add(mound);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.75, 20), std('#1a120a', { roughness: 1 })); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.6 * 0.92; G.add(hole);
  const clumps = []; for (let i = 0; i < 14; i++) { const c = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1 + (i % 3) * 0.05), m); G.add(c); clumps.push({ c, a: i * 0.9, r: 0.8 + (i % 4) * 0.3, h: 1.2 + (i % 5) * 0.4 }); }
  G.userData.set = (k, burst = 0) => { mound.scale.set(1.6, 0.6 * k + 0.001, 1.6); hole.position.y = 0.6 * 0.92 * k; hole.visible = k > 0.3;
    clumps.forEach(({ c, a, r, h }) => { const u = Math.min(1, burst); c.visible = burst > 0 && burst < 1.6; c.position.set(Math.cos(a) * r * u, Math.max(0.05, h * 4 * u * (1 - u) + 0.6 * k * 0.5), Math.sin(a) * r * u); c.rotation.set(a * 3 * u, a, 0); }); };
  G.userData.set(0); return shad(G); }
// ---------- MASCOT MONTAGE ----------
// máy bay phản lực (dáng chiến đấu cơ đơn giản, xám, không phù hiệu). Mũi hướng +z
export function jet() { const G = new THREE.Group(); const m = std('#9aa2ac', { metalness: 0.6, roughness: 0.35 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 11, 16), m); body.rotation.x = Math.PI / 2; G.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3, 16), m); nose.rotation.x = Math.PI / 2; nose.position.z = 7; G.add(nose);
  const can = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std('#203040', { metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.85 })); can.scale.set(0.9, 0.8, 2.2); can.position.set(0, 0.45, 3.4); G.add(can);
  const wsh = new THREE.Shape(); wsh.moveTo(0, 2.5); wsh.lineTo(6, -1.5); wsh.lineTo(6, -2.6); wsh.lineTo(0, -2.2); wsh.lineTo(0, 2.5);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.ExtrudeGeometry(wsh, { depth: 0.12, bevelEnabled: false }), m); w.rotation.x = Math.PI / 2; w.scale.x = s; w.position.y = 0; G.add(w);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 2), m); t.position.set(s * 1.3, 1.3, -4.5); t.rotation.z = s * 0.3; G.add(t); }
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.5, 12), new THREE.MeshBasicMaterial({ color: '#ffb060', transparent: true, opacity: 0.8 })); fl.rotation.x = -Math.PI / 2; fl.position.z = -6.8; G.add(fl); G.userData.flame = fl;
  return shad(G); }
// cá heo (dáng thân cong, vây lưng, đuôi ngang). Mũi hướng +z, dài ~2,4 m
export function dolphin() { const G = new THREE.Group(); const m = std('#7f97ad', { roughness: 0.35 }), belly = std('#dfe7ee', { roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 16), m); body.scale.set(0.9, 0.85, 3.0); G.add(body);
  const bel = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 12, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45), belly); bel.scale.set(0.92, 0.85, 2.9); G.add(bel);
  const beak = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.4, 12), m); beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.08, 1.3); G.add(beak);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 4), m); fin.position.set(0, 0.42, -0.1); fin.rotation.x = -0.6; fin.scale.z = 0.3; G.add(fin);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.22), m); tail.position.set(0, 0, -1.35); G.add(tail); G.userData.tail = tail;
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), std('#111')); e.position.set(s * 0.26, 0.05, 0.85); G.add(e); }
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.18), m); f.position.set(s * 0.4, -0.18, 0.4); f.rotation.z = s * -0.5; G.add(f); }
  return shad(G); }
