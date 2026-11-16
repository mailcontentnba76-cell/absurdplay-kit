// Tập 19 (troll "cho thuê sân nhà") — "ngôi nhà" của Cowboys = sân vận động mái vòm HƯ CẤU biến thành phòng khách khổng lồ.
// Trong: mặt cỏ có vạch yard (không ngôi sao, không chữ), thảm tròn + bàn nước + bát bỏng ngô, khán đài là các tầng SOFA dài
// (màu bạc-xanh của chủ nhà → chuyển dần sang ĐỎ khi khách chiếm), màn hình treo khổng lồ = "TV phòng khách", 3 đèn chùm vàng ấm,
// tủ lạnh 2 cánh cao 3 m có bộ đếm yard trên cửa, giường khách ở end zone, cửa đôi ở tường đầu sân.
// Ngoài: quảng trường bê tông nắng Texas, mặt tiền bạc + kính, cửa đôi, thảm WELCOME, biển treo "FOR RENT – SUNDAYS".
// Không logo, không tên sân thật. Khác bối cảnh E01–E18.
import * as THREE from 'three';
export const DAL = { navy: '#0b2a5c', silver: '#9aa4ad', royal: '#1d4ea0', white: '#f4f4f2' };
export const SF = { red: '#b3121a', gold: '#b99a5e', white: '#f4f4f2' };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export function ctex(w, h, draw, repeat, aniso = 8) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (repeat) t.repeat.set(...repeat); t.userData.canvas = c; return t;
}
export const FX = 27, FZ = 14;          // nửa dài / nửa rộng phần sân trong nhà
export const DOOR = { x: FX, z: 0 };    // cửa đôi ở tường đầu sân +x
export const FRIDGE = { x: 9, z: -9.5 };
export const BED = { x: -21.5, z: 0 };
export const SOFA0 = { z: 16.2, dz: 1.5, dy: 0.95 }; // tầng sofa khán đài phía +z (tầng i: z = z0 + i·dz, mặt ngồi y = 0,46 + i·dy)
export const seatPos = (tier, x, side = 1) => ({ x, z: side * (SOFA0.z + tier * SOFA0.dz), y: 0.46 + tier * SOFA0.dy });

function turf() {
  return ctex(2048, 1024, (g, W, H) => {
    for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#3d8a3a' : '#469641'; g.fillRect(i * W / 20, 0, W / 20, H); }
    g.fillStyle = '#ffffff'; const px = W / 60;
    for (let y = 5; y < 60; y += 5) g.fillRect(y * px - 3, 0, 6, H);
    for (let y = 1; y < 60; y++) if (y % 5) for (const yy of [0.3, 0.7]) g.fillRect(y * px - 1.5, H * yy - 10, 3, 20);
    g.font = '700 70px Oswald, Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    [[10, 20], [20, 30], [30, 40], [40, 30], [50, 20]].forEach(([y, n]) => { for (const [yy, r] of [[0.15, Math.PI], [0.85, 0]]) { g.save(); g.translate(y * px, H * yy); g.rotate(r); g.fillText(String(n), 0, 0); g.restore(); } });
  }, [1, 1], 16);
}
// tường khán giả phía sau sofa (fan đỏ áp đảo, lác đác navy)
function crowdTex(seed, redShare) {
  const r = rnd(seed);
  return ctex(2048, 512, (g, W, H) => {
    g.fillStyle = '#2a2730'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 9) for (let x = (y / 9 % 2) * 4; x < W; x += 8) {
      if (r() < 0.05) continue; const red = r() < redShare;
      g.fillStyle = red ? [SF.red, '#9a0f16', SF.gold, '#d8d0c0'][Math.floor(r() * 4)] : [DAL.navy, DAL.silver, DAL.white][Math.floor(r() * 3)];
      g.fillRect(x, y + 3, 7, 6); g.fillStyle = ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'][Math.floor(r() * 5)]; g.fillRect(x + 1, y, 5, 3);
    }
  }, [1, 1]);
}
// tầng sofa dài: đệm ngồi + lưng + tay vịn; trả về mesh để đổi màu
function sofaRow(len, col) {
  const G = new THREE.Group(), m = std(col, { roughness: 0.9 }), cush = std(new THREE.Color(col).multiplyScalar(1.12), { roughness: 0.95 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 0.95), m); base.position.y = 0.2; G.add(base);
  const n = Math.round(len / 1.9); for (let i = 0; i < n; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(len / n - 0.06, 0.14, 0.82), cush); c.position.set(-len / 2 + (i + 0.5) * len / n, 0.4, -0.02); G.add(c); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(len, 0.72, 0.28), m); back.position.set(0, 0.62, 0.42); G.add(back);
  for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.62, 0.95), m); a.position.set(s * (len / 2 + 0.15), 0.36, 0); G.add(a); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.userData.mats = [m, cush]; G.userData.col = new THREE.Color(col); return G;
}
// tủ lạnh 2 cánh cao 3 m, mở cửa open(k), bộ đếm yard setCount(n)
function fridge() {
  const G = new THREE.Group(), body = std('#d9dde2', { metalness: 0.6, roughness: 0.25 }), inner = std('#f4f6f8', { roughness: 0.6, emissive: '#fff6e0', emissiveIntensity: 0.25 });
  const W = 2.2, H = 3.0, D = 1.0;
  const shell = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.08), body); shell.position.set(0, H / 2, -D / 2); G.add(shell);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.08, H, D), body); w.position.set(s * W / 2, H / 2, 0); G.add(w); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(W, 0.08, D), body); top.position.set(0, H, 0); G.add(top);
  const bot = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, D), body); bot.position.set(0, 0.06, 0); G.add(bot);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.16, H - 0.2), inner); back.position.set(0, H / 2, -D / 2 + 0.05); G.add(back);
  const light = new THREE.PointLight('#fff2d0', 0, 4, 2); light.position.set(0, H - 0.4, 0); G.add(light);
  const r = rnd(5), items = [];
  for (let s = 0; s < 4; s++) { const sh = new THREE.Mesh(new THREE.BoxGeometry(W - 0.16, 0.03, D - 0.1), std('#e8f0f4', { transparent: true, opacity: 0.7 })); sh.position.set(0, 0.5 + s * 0.65, 0); G.add(sh);
    for (let k = 0; k < 5; k++) { const c = ['#e63b2e', '#f2b134', '#3fa34d', '#f4f4f4', '#7a4a2a', '#f08a24'][Math.floor(r() * 6)]; const h = 0.18 + r() * 0.22;
      const it = new THREE.Mesh(r() < 0.5 ? new THREE.BoxGeometry(0.28, h, 0.22) : new THREE.CylinderGeometry(0.09, 0.09, h, 12), std(c, { roughness: 0.5 })); it.position.set(-0.8 + k * 0.4 + (r() - 0.5) * 0.06, 0.52 + s * 0.65 + h / 2, (r() - 0.5) * 0.3); it.castShadow = true; G.add(it); items.push(it); } }
  // hai cánh cửa (bản lề ngoài cùng)
  const doors = [];
  const ct = ctex(512, 256, () => {}, [1, 1]);
  const drawCount = (n, hot) => { const c = ct.userData.canvas, g = c.getContext('2d'); g.fillStyle = '#0d1018'; g.fillRect(0, 0, 512, 256); g.strokeStyle = hot ? '#ff3a30' : '#3a4250'; g.lineWidth = 10; g.strokeRect(6, 6, 500, 244);
    g.fillStyle = hot ? '#ff4a3a' : '#7ae0ff'; g.font = '900 150px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 256, 112);
    g.font = '700 46px Oswald, sans-serif'; g.fillStyle = '#e8ecf2'; g.fillText(hot ? 'YARDS · RECORD' : 'YARDS EATEN', 256, 210); ct.needsUpdate = true; };
  drawCount(0, false);
  for (const s of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(s * W / 2, 0, D / 2); G.add(piv);
    const d = new THREE.Mesh(new THREE.BoxGeometry(W / 2 - 0.02, H - 0.06, 0.1), body); d.position.set(-s * (W / 4), H / 2, 0.05); d.castShadow = true; piv.add(d);
    const hd = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.06), std('#5a6068', { metalness: 0.8, roughness: 0.3 })); hd.position.set(-s * (W / 2 - 0.12), H * 0.55, 0.14); piv.add(hd);
    doors.push(piv); }
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: ct, toneMapped: false })); scr.position.set(0, H + 0.5, D / 2 - 0.05); G.add(scr);
  const scrBox = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.9, 0.12), std('#1a1d24')); scrBox.position.set(0, H + 0.5, D / 2 - 0.13); G.add(scrBox);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const open = (k) => { doors[0].rotation.y = -k * 1.9; doors[1].rotation.y = k * 1.9; light.intensity = k * 6; };
  return { G, open, setCount: drawCount, items };
}
// giường khách cỡ lớn (end zone)
function bed() {
  const G = new THREE.Group(), frame = std('#5a3a28', { roughness: 0.6 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 2.8), frame); b.position.y = 0.25; G.add(b);
  const mat = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.35, 2.6), std('#f4f2ee', { roughness: 0.95 })); mat.position.y = 0.67; G.add(mat);
  const quilt = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.08, 1.9), std(SF.red, { roughness: 0.95 })); quilt.position.set(0, 0.88, 0.38); G.add(quilt);
  const head = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.2), frame); head.position.set(0, 0.8, -1.45); G.add(head);
  for (const x of [-0.75, 0.75]) { const p = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.55), std('#ffffff', { roughness: 1 })); p.position.set(x, 0.98, -0.95); G.add(p); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// đèn chùm vàng ấm
function chandelier() {
  const G = new THREE.Group(), gold = std('#c8a050', { metalness: 0.9, roughness: 0.3 }), glow = new THREE.MeshBasicMaterial({ color: '#ffe0a0', toneMapped: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.06, 8, 40), gold); ring.rotation.x = Math.PI / 2; G.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 30), gold); ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.5; G.add(ring2);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), glow); b.position.set(Math.cos(a) * 1.4, 0.12, Math.sin(a) * 1.4); G.add(b); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), glow); b.position.set(Math.cos(a) * 0.8, 0.6, Math.sin(a) * 0.8); G.add(b); }
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 6, 6), gold); rod.position.y = 3.5; G.add(rod);
  return G;
}
// cửa đôi (2 mặt), mở open(k): cánh quay ra phía +x (ra ngoài)
function frontDoors() {
  const G = new THREE.Group(), wood = std('#e8e4dc', { roughness: 0.5 }), trim = std('#c8a050', { metalness: 0.8, roughness: 0.3 });
  const W = 3.2, H = 5.2, leaves = [];
  for (const s of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(0, 0, s * W / 2); G.add(piv);
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.14, H, W / 2 - 0.03), wood); d.position.set(0, H / 2, -s * W / 4); d.castShadow = true; piv.add(d);
    for (const yy of [1.3, 3.6]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.17, 1.6, W / 2 - 0.4), std('#d8d2c6', { roughness: 0.6 })); p.position.set(0, yy, -s * W / 4); piv.add(p); }
    const kn = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), trim); kn.position.set(0.12, 2.5, -s * (W / 2 - 0.25)); piv.add(kn); const kn2 = kn.clone(); kn2.position.x = -0.12; piv.add(kn2);
    leaves.push(piv); }
  const fr = std('#3a4250', { roughness: 0.5 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.4, W + 0.8), fr); top.position.y = H + 0.2; G.add(top);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.56, H + 0.4, 0.4), fr); p.position.set(0, (H + 0.4) / 2, s * (W / 2 + 0.2)); G.add(p); }
  const open = (k) => { leaves[0].rotation.y = k * 1.32; leaves[1].rotation.y = -k * 1.32; };
  return { G, open, W, H };
}
export function signTex(text, bg = '#ffffff', fg = '#b3121a', w = 512, h = 256, font = 92) {
  return ctex(w, h, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = fg; g.lineWidth = 12; g.strokeRect(8, 8, W - 16, H - 16); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    const lines = text.split('\n'); g.font = `900 ${font}px Anton, Impact, sans-serif`; lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * font * 1.05, W - 40)); }, [1, 1]);
}
// biển cầm tay cho fan (que + tấm)
export function handSign(text, bg, fg) { const G = new THREE.Group(); const p = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshStandardMaterial({ map: signTex(text, bg, fg), side: THREE.DoubleSide, roughness: 0.8 })); p.position.y = 0.55; G.add(p);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), std('#c8a070')); st.position.y = 0.05; G.add(st); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// chìa khoá phòng to đùng (vàng) + móc chìa
export function bigKey() { const G = new THREE.Group(), m = std('#e8c060', { metalness: 0.9, roughness: 0.25 });
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 10, 24), m); G.add(bow);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 10), m); sh.rotation.z = Math.PI / 2; sh.position.x = 0.25; G.add(sh);
  for (const [x, h] of [[0.36, 0.08], [0.31, 0.06]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, 0.02), m); t.position.set(x, -h / 2 - 0.01, 0); G.add(t); }
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.08), new THREE.MeshBasicMaterial({ map: signTex('ROOM\n1', '#b3121a', '#ffffff', 256, 170, 60), side: THREE.DoubleSide })); tag.position.set(-0.12, -0.08, 0); G.add(tag);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// cây lau nhà + xô
export function mop() { const G = new THREE.Group(); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.45, 8), std('#c8a070')); st.position.y = 0.72; G.add(st);
  const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.18, 14), std('#e8e4dc', { roughness: 1 })); hd.position.y = 0.06; G.add(hd); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
export function bucket() { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.34, 18, 1, true), std('#2d6fd0', { roughness: 0.5, side: THREE.DoubleSide })); b.position.y = 0.17; const G = new THREE.Group(); G.add(b);
  const w = new THREE.Mesh(new THREE.CircleGeometry(0.18, 18), std('#9ac8e8', { roughness: 0.1 })); w.rotation.x = -Math.PI / 2; w.position.y = 0.28; G.add(w); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// tạp dề gắn vào nhân vật (mặt trước thân)
export function apron(ch) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.78), new THREE.MeshStandardMaterial({ map: signTex('HOST', '#eef0f2', '#0b2a5c', 256, 420, 64), roughness: 0.9, side: THREE.DoubleSide }));
  ch.root.updateMatrixWorld(true); const sp = ch.bones.spine_02.getWorldPosition(new THREE.Vector3()), pv = ch.bones.pelvis.getWorldPosition(new THREE.Vector3());
  const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(ch.root.getWorldQuaternion(new THREE.Quaternion()));
  m.position.copy(sp).lerp(pv, 0.55).add(fwd.multiplyScalar(0.19)); m.quaternion.copy(ch.root.getWorldQuaternion(new THREE.Quaternion())); m.rotateX(-0.08); ch.root.add(m); ch.bones.spine_01.attach(m); return m; }
// hoá đơn dài lê thê
export function bill() { const t = ctex(256, 2048, (g, W, H) => { g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, W, H); g.fillStyle = '#222'; g.font = '700 30px Courier New, monospace';
  g.fillText('STAYOVER', 50, 60); g.font = '22px Courier New, monospace'; const L = ['584 YDS ......', 'FRIDGE .......', 'POPCORN ......', 'BED, 1 NIGHT .', 'CLEANING (DAK)', '5TH VISIT ....', 'BOOING FEE ...'];
  for (let i = 0; i < 70; i++) { g.fillText(L[i % L.length] + ' $' + (99 + i * 37 % 900), 16, 110 + i * 27); } g.font = '700 30px Courier New'; g.fillText('TOTAL: 46-40', 30, 2010); });
  const geo = new THREE.PlaneGeometry(0.42, 3.2, 1, 40); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.9 })); m.castShadow = true;
  const p = geo.attributes.position, base = Float32Array.from(p.array);
  m.userData.curl = (k) => { for (let i = 0; i < p.count; i++) { const y = base[i * 3 + 1]; const u = (1.6 - y) / 3.2; p.setZ(i, Math.sin(u * 6 + k * 3) * 0.06 * u); } p.needsUpdate = true; geo.computeVertexNormals(); };
  return m; }
// bỏng ngô: bát + hạt bay (instanced)
export function popcorn(n = 160) {
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.18, 0.2, 20, 1, true), std('#c8102e', { side: THREE.DoubleSide })); const G = new THREE.Group(); bowl.position.y = 0.1; G.add(bowl);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), std('#f6e8b0', { roughness: 1 })); top.scale.y = 0.45; top.position.y = 0.18; G.add(top);
  const kern = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.03, 0), std('#fff2c0', { roughness: 1 }), n); kern.frustumCulled = false; kern.castShadow = true;
  return { bowl: G, kern };
}
export function buildHouse(scene) {
  const G = new THREE.Group(); scene.add(G);
  // mặt cỏ trong nhà
  const fm = std('#ffffff', { map: turf(), roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FX * 2 + 6, FZ * 2 + 4), fm); field.rotation.x = -Math.PI / 2; field.receiveShadow = true; G.add(field);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 70), std('#8a6a4a', { roughness: 0.7 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.03; floor.receiveShadow = true; G.add(floor);
  // thảm tròn + bàn nước + bát bỏng ngô
  const rug = new THREE.Mesh(new THREE.CircleGeometry(4.5, 64), std('#c9d2dc', { roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); rug.rotation.x = -Math.PI / 2; rug.position.y = 0.02; rug.receiveShadow = true; G.add(rug);
  const rug2 = new THREE.Mesh(new THREE.RingGeometry(3.9, 4.2, 64), std(DAL.navy, { roughness: 1, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); rug2.rotation.x = -Math.PI / 2; rug2.position.y = 0.04; G.add(rug2);
  const tbl = new THREE.Group(); tbl.position.set(0, 0, 3.2); G.add(tbl);
  const tt = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 1.2), std('#e8e4dc', { roughness: 0.3 })); tt.position.y = 0.45; tt.castShadow = true; tt.receiveShadow = true; tbl.add(tt);
  for (const [x, z] of [[-1.35, -0.5], [1.35, -0.5], [-1.35, 0.5], [1.35, 0.5]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), std('#3a4250')); l.position.set(x, 0.22, z); tbl.add(l); }
  const PC = popcorn(); PC.bowl.position.set(-0.6, 0.49, 3.2); G.add(PC.bowl); const pc2 = PC.bowl.clone(); pc2.position.set(0.7, 0.49, 3.0); G.add(pc2); G.add(PC.kern);
  // khán đài sofa hai bên (+z, −z), tầng i cao dần; tường khán giả phía sau
  const sofas = [];
  for (const side of [1, -1]) for (let i = 0; i < 5; i++) { const s = sofaRow(46, DAL.silver); const p = seatPos(i, 0, side); s.position.set(0, p.y - 0.46, p.z); if (side < 0) s.rotation.y = Math.PI; else s.rotation.y = Math.PI; if (side > 0) s.rotation.y = Math.PI; G.add(s); sofas.push(s);
    const st = new THREE.Mesh(new THREE.BoxGeometry(46.6, p.y - 0.46 + 0.02, SOFA0.dz), std('#3a4250', { roughness: 0.8 })); st.position.set(0, (p.y - 0.46) / 2, p.z + side * 0.05); st.receiveShadow = true; if (i) G.add(st); }
  // sofa hướng: tầng +z nhìn về −z (vào sân); tầng −z nhìn về +z
  sofas.forEach((s, i) => { s.rotation.y = i < 5 ? Math.PI : 0; });
  for (const side of [1, -1]) { const wall = new THREE.Mesh(new THREE.PlaneGeometry(70, 16), std('#ffffff', { map: crowdTex(side > 0 ? 3 : 9, 0.85), roughness: 1 })); wall.material.map.repeat.set(3, 1);
    wall.position.set(0, 4.6 + 8, side * (SOFA0.z + 5 * SOFA0.dz + 0.6)); wall.rotation.x = side * 0.32; wall.rotation.y = side > 0 ? Math.PI : 0; G.add(wall);
    const lower = new THREE.Mesh(new THREE.PlaneGeometry(70, 5.2), std('#3a4250')); lower.position.set(0, 2.6, side * (SOFA0.z + 5 * SOFA0.dz + 0.4)); lower.rotation.y = side > 0 ? Math.PI : 0; G.add(lower); }
  // tường hai đầu: cửa đôi ở +x, giường ở −x; tường kem có gờ gỗ + tranh treo trơn
  const cream = std('#efe6d6', { roughness: 0.9 }), wood = std('#6a4a32', { roughness: 0.6 });
  for (const sx of [1, -1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 22, 70), cream); w.position.set(sx * (FX + 3.2), 11, 0); w.receiveShadow = true; G.add(w);
    for (const zz of (sx > 0 ? [-1, 1] : [0])) { const len = sx > 0 ? 33.2 : 70; const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, len), wood); base.position.set(sx * (FX + 2.95), 0.3, zz * (1.8 + len / 2)); G.add(base); } }
  const doors = frontDoors(); doors.G.position.set(FX + 3.2, 0, 0); G.add(doors.G);
  // cắt lỗ cửa: thay tường +x bằng 3 tấm quanh khung cửa
  G.children.filter((o) => o.geometry && o.geometry.parameters && o.geometry.parameters.height === 22 && o.position.x > 0).forEach((o) => { o.visible = false; });
  for (const [z, w] of [[-(35 + 1.6) / 2 - 0.0, 35 - 1.6 - 0.4], [(35 + 1.6) / 2, 35 - 1.6 - 0.4]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 22, w), cream); p.position.set(FX + 3.2, 11, z > 0 ? 1.8 + w / 2 : -1.8 - w / 2); p.receiveShadow = true; p.castShadow = true; G.add(p); }
  { const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 22 - 5.6, 3.6), cream); p.position.set(FX + 3.2, 5.6 + (22 - 5.6) / 2, 0); G.add(p); }
  const BEDm = bed(); BEDm.position.set(BED.x, 0, BED.z); BEDm.rotation.y = Math.PI / 2; G.add(BEDm);
  for (const z of [-9, 9]) { const fr = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 4.4), wood); fr.position.set(-FX - 2.95, 6.5, z); G.add(fr); const art = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.8), std(z > 0 ? '#7a9ab8' : '#c8a06a', { roughness: 0.8 })); art.rotation.y = Math.PI / 2; art.position.set(-FX - 2.88, 6.5, z); G.add(art); }
  // tủ lạnh
  const FR = fridge(); FR.G.position.set(FRIDGE.x, 0, FRIDGE.z); FR.G.rotation.y = 0; G.add(FR.G);
  // mái vòm: vành sáng + màn hình treo (TV phòng khách 4 mặt)
  const roof = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 16, 0, Math.PI * 2, 0, 0.62), std('#e8e2d6', { side: THREE.BackSide, roughness: 0.9 })); roof.position.y = -24; G.add(roof);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const rib = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 34), std('#b8b0a0', { metalness: 0.4 })); rib.position.set(Math.cos(a) * 17, 29, Math.sin(a) * 17); rib.rotation.y = -a + Math.PI / 2; rib.rotation.x = 0.0; }
  const scrT = ctex(1024, 512, () => {}, [1, 1]); const TV = new THREE.Group(); TV.position.set(0, 13.5, 0); G.add(TV);
  const tvBox = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 6), std('#1a1d24', { roughness: 0.4, metalness: 0.5 })); TV.add(tvBox);
  for (const [r, z] of [[0, 3.01], [Math.PI, -3.01]]) { const sc = new THREE.Mesh(new THREE.PlaneGeometry(13.4, 5.4), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })); sc.position.z = z; sc.rotation.y = r; TV.add(sc); }
  const drawTV = (mode, a = {}) => { const c = scrT.userData.canvas, g = c.getContext('2d'), W = c.width, H = c.height;
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#16233e'); gr.addColorStop(1, '#0a0f1c'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (mode === 'rent') { g.fillStyle = '#ff5a5f'; g.font = '900 120px Anton, Impact'; g.fillText('FOR RENT', W / 2, 170); g.fillStyle = '#ffffff'; g.font = '700 64px Oswald'; g.fillText('SUNDAYS · SLEEPS 70,000', W / 2, 300); g.fillStyle = '#ffd36a'; g.fillText('★★★★★', W / 2, 400); }
    else if (mode === 'score') { g.fillStyle = '#ffffff'; g.font = '900 200px Anton, Impact'; g.fillText(`${a.a ?? 46}–${a.b ?? 40}`, W / 2, 210); g.font = '700 62px Oswald'; g.fillStyle = '#ff6a6a'; g.fillText(`${a.l ?? 'SF'}      ${a.r ?? 'DAL'}`, W / 2, 355); g.fillStyle = '#ffd36a'; g.fillText(a.sub || 'FINAL', W / 2, 440); }
    else if (mode === 'boo') { g.fillStyle = SF.red; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.font = '900 210px Anton, Impact'; g.fillText('BOOOO!', W / 2, H / 2); }
    scrT.needsUpdate = true; };
  drawTV('rent');
  const chands = [-11, 0, 11].map((x) => { const c = chandelier(); c.position.set(x, 9.5, x === 0 ? 6.5 : 0); G.add(c); return c; });
  // ===== ngoài trời: quảng trường + mặt tiền + cửa + biển FOR RENT =====
  const EXT = new THREE.Group(); G.add(EXT);
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(80, 90), std('#c8c2b6', { roughness: 0.95 })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(FX + 3.6 + 40, 0.0, 0); plaza.receiveShadow = true; EXT.add(plaza);
  const tiles = ctex(512, 512, (g, W, H) => { g.fillStyle = '#cbc5b8'; g.fillRect(0, 0, W, H); g.strokeStyle = '#b0a898'; g.lineWidth = 4; for (let i = 0; i <= W; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); } }, [20, 22]);
  plaza.material.map = tiles; plaza.material.color.set('#ffffff');
  const facM = std('#b8c0c8', { metalness: 0.55, roughness: 0.35 }), glass = std('#7aa6c8', { metalness: 0.3, roughness: 0.1, emissive: '#2a3a50', emissiveIntensity: 0.3 });
  for (const [z, w] of [[-21, 38.4], [21, 38.4]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, 20, w), facM); p.position.set(FX + 3.7, 10, z > 0 ? 1.8 + w / 2 : -1.8 - w / 2); p.castShadow = true; p.receiveShadow = true; EXT.add(p); }
  { const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, 14.4, 3.6), facM); p.position.set(FX + 3.7, 5.6 + 7.2, 0); EXT.add(p); }
  for (let i = -6; i <= 6; i++) { if (Math.abs(i) < 1) continue; const g2 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 9), glass); g2.rotation.y = Math.PI / 2; g2.position.set(FX + 4.02, 12, i * 3.2); EXT.add(g2); }
  const awn = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 7), std(DAL.navy, { roughness: 0.6 })); awn.position.set(FX + 5.4, 6.2, 0); awn.castShadow = true; EXT.add(awn);
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.8), new THREE.MeshStandardMaterial({ map: signTex('WELCOME', '#6a4a32', '#f4e4c0', 512, 256, 110), roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }));
  mat.rotation.x = -Math.PI / 2; mat.rotation.z = Math.PI / 2; mat.position.set(FX + 4.9, 0.02, 0); mat.receiveShadow = true; EXT.add(mat);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 10), std('#2a2a2a', { metalness: 0.6 })); post.position.set(FX + 6.6, 1.6, 3.2); post.castShadow = true; EXT.add(post);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), std('#2a2a2a')); arm.position.set(FX + 6.6, 3.1, 2.65); EXT.add(arm);
  const rentPiv = new THREE.Group(); rentPiv.position.set(FX + 6.6, 3.05, 2.3); EXT.add(rentPiv);
  const rent = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6), new THREE.MeshStandardMaterial({ map: signTex('FOR RENT\nSUNDAYS', '#ffffff', '#c8102e', 512, 280, 96), side: THREE.DoubleSide, roughness: 0.7 })); rent.position.y = -0.4; rent.rotation.y = Math.PI / 2; rent.castShadow = true; rentPiv.add(rent);
  const r = rnd(41); for (let i = 0; i < 6; i++) { const z = (i - 2.5) * 6.5; if (Math.abs(z) < 4) continue; const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.8, 14), std('#e8e2d6')); pot.position.set(FX + 6, 0.4, z); pot.castShadow = true; EXT.add(pot);
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75 + r() * 0.2, 1), std('#4a8a3a', { roughness: 1 })); bush.position.set(FX + 6, 1.4, z); bush.castShadow = true; EXT.add(bush); }
  const skyT = ctex(16, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3a7ad8'); gr.addColorStop(0.5, '#8ec0f0'); gr.addColorStop(0.62, '#e8eef2'); gr.addColorStop(1, '#c8c2b6'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }, [1, 1]);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 24, 12), new THREE.MeshBasicMaterial({ map: skyT, side: THREE.BackSide, fog: false })); sky.position.set(FX + 40, 0, 0); EXT.add(sky);
  // màu sofa: k = 0 bạc chủ nhà → 1 đỏ khách
  const takeover = (k, from = 0) => { sofas.forEach((s, i) => { const kk = Math.min(1, Math.max(0, k * 1.6 - (i % 5) * 0.12)); const c = s.userData.col.clone().lerp(new THREE.Color(SF.red), kk); s.userData.mats[0].color.copy(c); s.userData.mats[1].color.copy(c.clone().multiplyScalar(1.12)); }); };
  const swingRent = (t) => { rentPiv.rotation.z = Math.sin(t * 3.1) * 0.25; };
  return { G, EXT, roof, field, doors, FR, TV, drawTV, chands, sofas, takeover, swingRent, PC, bed: BEDm, tbl };
}
// ánh sáng 2 chế độ: 'int' (đèn chùm ấm + đèn mái trắng, bóng tĩnh) / 'ext' (nắng Texas)
export function houseLights(scene) {
  const hemi = new THREE.HemisphereLight('#fff4e4', '#6a5a48', 1.5); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe8c8', 2.4); key.castShadow = true; key.shadow.mapSize.set(4096, 4096);
  Object.assign(key.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 120 }); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#c8d8ff', 0.6); fill.position.set(-20, 18, 30); scene.add(fill);
  const warm = [-11, 0, 11].map((x) => { const p = new THREE.PointLight('#ffcc88', 30, 26, 1.6); p.position.set(x, 8.8, x === 0 ? 6.5 : 0); scene.add(p); return p; });
  let mode = 'int';
  const set = (m, x = 0, z = 0) => { mode = m; const dir = m === 'int' ? new THREE.Vector3(0.35, 1, 0.55) : new THREE.Vector3(0.9, 0.75, -0.45); dir.normalize().multiplyScalar(60);
    key.target.position.set(x, 0, z); key.position.set(x + dir.x, dir.y, z + dir.z); key.target.updateMatrixWorld(); key.shadow.camera.updateProjectionMatrix();
    key.intensity = m === 'int' ? 2.3 : 3.2; key.color.set(m === 'int' ? '#ffe8c8' : '#fff1d8'); hemi.intensity = m === 'int' ? 1.45 : 1.6; hemi.color.set(m === 'int' ? '#fff0dc' : '#cfe4ff'); warm.forEach((p) => (p.visible = m === 'int')); fill.intensity = m === 'int' ? 0.6 : 0.4; };
  set('int'); return { hemi, key, fill, warm, set };
}
