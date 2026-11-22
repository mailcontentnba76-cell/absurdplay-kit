// Tập 28 (Mascot: Packers = công nhân đóng gói thịt thật, Steelers = thợ luyện thép thật) — đạo cụ & trang phục.
// Không logo đội, không chữ thương hiệu thật. Màu đội: Packers xanh #203731 + vàng #FFB612; Steelers đen #101820 + vàng #FFB612.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o });
const glow = (c, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const shadowAll = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; };
export const GB = { green: '#203731', gold: '#ffb612', white: '#f4f4f0' }, PIT = { black: '#101820', gold: '#ffb612', grey: '#a5acaf' };

// gắn mesh vào xương theo tư thế nghỉ (giống dressFarmer E27)
function dresser(ch) { const B = ch.bones; ch.root.position.set(0, 0, 0); ch.root.rotation.set(0, 0, 0); ch.root.scale.setScalar(1); ch.root.updateMatrixWorld(true);
  const W = (n) => B[n].getWorldPosition(new THREE.Vector3());
  const put = (bone, m, p, rot) => { m.position.copy(p); if (rot) m.rotation.set(...rot); ch.root.add(m); m.updateMatrixWorld(true); B[bone].attach(m); m.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } }); return m; };
  return { W, put }; }

// ---------- mũ / phụ kiện đầu ----------
export function hairnet() { const G = new THREE.Group();
  const t = ctex(128, 128, (g) => { g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(0, 0, 128, 128); g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 2; for (let i = -128; i < 256; i += 10) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 128, 128); g.stroke(); g.beginPath(); g.moveTo(i, 128); g.lineTo(i + 128, 0); g.stroke(); } });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.128, 24, 14, 0, Math.PI * 2, 0, 1.45), std('#ffffff', { map: t, transparent: true, roughness: 0.9 })); cap.scale.set(1.02, 0.92, 1.08); G.add(cap);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.008, 6, 28), std('#f4f4f0')); band.rotation.x = Math.PI / 2; band.position.y = 0.01; G.add(band); return G; }
export function hardHat(col = PIT.gold, stripe = PIT.black) { const G = new THREE.Group(); const m = std(col, { roughness: 0.35 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), m); dome.scale.set(1, 0.9, 1.12); G.add(dome);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.012, 28), m); brim.scale.set(1, 1, 1.15); brim.position.set(0, 0.002, 0.02); G.add(brim);
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.28), std(stripe, { roughness: 0.4 })); ridge.position.set(0, 0.118, 0); ridge.rotation.x = 0; G.add(ridge);
  // mặt nạ hàn lật lên phía trước (kính tối)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.012), std('#2a2c30', { metalness: 0.4, roughness: 0.35 })); visor.position.set(0, 0.1, 0.13); visor.rotation.x = -1.05; G.add(visor);
  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.045), std('#0c3a2a', { metalness: 0.6, roughness: 0.1 })); lens.position.set(0, 0.104, 0.137); lens.rotation.x = -1.05; G.add(lens);
  return G; }
// mũ phô mai (cheesehead): nêm vàng có lỗ, đội được
export function cheesehead(s = 1) { const G = new THREE.Group();
  const t = ctex(256, 128, (g) => { g.fillStyle = '#ffc62a'; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 18; i++) { const x = Math.random() * 256, y = Math.random() * 128, r = 4 + Math.random() * 9; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, '#c88a10'); gr.addColorStop(1, '#ffc62a'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } });
  const sh = new THREE.Shape(); sh.moveTo(-0.24, 0); sh.lineTo(0.24, 0); sh.lineTo(0, 0.17); sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 }); geo.translate(0, 0, -0.15);
  const m = new THREE.Mesh(geo, std('#ffffff', { map: t, roughness: 0.95 })); m.rotation.y = Math.PI / 2; G.add(m); G.scale.setScalar(s); return shadowAll(G); }
export function cheeseWedgeGeo() { const sh = new THREE.Shape(); sh.moveTo(-0.2, 0); sh.lineTo(0.2, 0); sh.lineTo(0, 0.15); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.24, bevelEnabled: false }); g.translate(0, 0, -0.12); g.rotateY(Math.PI / 2); g.translate(0, 1.72, 0); return g; }

// ---------- trang phục ----------
// công nhân đóng gói thịt (Packers): áo khoác trắng dài, tạp dề xanh viền vàng, lưới tóc, ủng cao su trắng
export function dressPacker(ch, i = 0) { const { W, put } = dresser(ch);
  const s2 = W('spine_02'), s3 = W('spine_03'), pv = W('pelvis');
  const apronT = ctex(256, 512, (g, w, h) => { g.fillStyle = GB.green; g.fillRect(0, 0, w, h); g.strokeStyle = GB.gold; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14);
    g.fillStyle = GB.gold; g.fillRect(60, 120, 136, 70); g.fillStyle = GB.green; g.font = '900 52px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('No. ' + (11 + i * 7), 128, 172); });
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.92), std('#ffffff', { map: apronT, side: THREE.DoubleSide, roughness: 0.6 }));
  put('spine_02', apron, new THREE.Vector3(s3.x, (s3.y + pv.y) / 2 - 0.12, s3.z + 0.16), [-0.04, 0, 0]);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.008, 4, 24), std(GB.green)); tie.rotation.x = Math.PI / 2; put('spine_02', tie, new THREE.Vector3(s2.x, s2.y, s2.z), null);
  // vạt áo khoác trắng dưới hông (áo dài tới gối)
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.42, 16, 1, true), std(GB.white, { side: THREE.DoubleSide })); put('pelvis', skirt, new THREE.Vector3(pv.x, pv.y - 0.2, pv.z), null);
  const h = W('Head'); const net = hairnet(); put('Head', net, new THREE.Vector3(h.x, h.y + 0.07, h.z - 0.01), [-0.12, 0, 0]); ch.hat = net;
  for (const sd of ['l', 'r']) { const c = W('calf_' + sd), f = W('foot_' + sd); const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, c.y - f.y + 0.06, 12), std('#f2f2ec', { roughness: 0.35 })); put('calf_' + sd, boot, new THREE.Vector3(c.x, (c.y + f.y) / 2 - 0.02, c.z), null); }
  return ch; }
// thợ thép (Steelers): mũ bảo hộ vàng + mặt nạ hàn, áo khoác chịu nhiệt đen sọc phản quang vàng (dùng sleeveStripes), găng da, ủng nâu
export function dressSteelworker(ch, i = 0) { const { W, put } = dresser(ch);
  const h = W('Head'); const hat = hardHat(i % 3 === 2 ? '#f4f4f0' : PIT.gold); put('Head', hat, new THREE.Vector3(h.x, h.y + 0.1, h.z), [-0.06, 0, 0]); ch.hat = hat;
  const s3 = W('spine_03'), s2 = W('spine_02');
  const refl = std('#e8e2c8', { roughness: 0.25, metalness: 0.3, emissive: '#3a3418' });
  for (const y of [s2.y + 0.02, s3.y - 0.06]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.17, 0.035, 18, 1, true), refl); band.scale.set(1, 1, 0.78); put('spine_02', band, new THREE.Vector3(s3.x, y, s3.z + 0.01), null); }
  for (const sd of ['l', 'r']) { const hd = W('hand_' + sd); const g = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.06), std('#8a6a42', { roughness: 0.9 })); put('hand_' + sd, g, new THREE.Vector3(hd.x, hd.y - 0.04, hd.z), null); }
  return ch; }

// ---------- đồ ăn / nhà máy ----------
export function sausage(len = 0.5, r = 0.07) { const G = new THREE.Group(); const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), std('#a8462a', { roughness: 0.35 })); m.rotation.z = Math.PI / 2; G.add(m);
  for (const s of [-1, 1]) { const k = new THREE.Mesh(new THREE.SphereGeometry(r * 0.35, 8, 6), std('#7a2a18')); k.position.x = s * (len / 2 + r * 0.95); G.add(k); } return shadowAll(G); }
export function cheeseWheel(r = 0.45) { const G = new THREE.Group(); const side = std('#e8b030', { roughness: 0.6 }), top = std('#ffd050', { roughness: 0.7 });
  const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, r * 0.55, 32), [side, top, top]); w.rotation.x = Math.PI / 2; G.add(w); return shadowAll(G); }
// băng chuyền: update(t) cho xúc xích chạy
export function conveyor(len = 8) { const G = new THREE.Group(); const steel = std('#b8bcc2', { metalness: 0.7, roughness: 0.3 });
  const belt = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.8), std('#2a2c30', { roughness: 0.8 })); belt.position.y = 1.0; G.add(belt);
  for (const z of [-0.45, 0.45]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.05), steel); rail.position.set(0, 1.04, z); G.add(rail); }
  for (let k = 0; k <= len; k += 2) for (const z of [-0.4, 0.4]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8), steel); leg.position.set(-len / 2 + k, 0.5, z); G.add(leg); }
  const S = [...Array(Math.round(len / 0.7))].map(() => { const s = sausage(0.36, 0.06); G.add(s); return s; });
  G.userData.update = (t) => S.forEach((s, i) => { const x = ((i * 0.7 + t * 0.9) % len) - len / 2; s.position.set(x, 1.1, (i % 2 ? 0.12 : -0.12)); s.rotation.set(0, 0.3 * (i % 3 - 1), 0); });
  G.userData.update(0); return shadowAll(G); }
// gáo rót thép nóng chảy treo cáp: pour(k 0..1) nghiêng + dòng thép đỏ cam (không chớp trắng)
export function crucible() { const G = new THREE.Group(); const iron = std('#3a3634', { metalness: 0.6, roughness: 0.5 });
  const pivot = new THREE.Group(); pivot.position.y = 3.2; G.add(pivot);
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.8, 1.6, 24, 1, true), std('#4a4440', { metalness: 0.5, roughness: 0.6, side: THREE.DoubleSide })); pivot.add(bucket);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.8, 24), iron); bottom.rotation.x = Math.PI / 2; bottom.position.y = -0.8; pivot.add(bottom);
  const melt = new THREE.Mesh(new THREE.CircleGeometry(1.05, 24), glow('#ff7a1a', 1.25)); melt.rotation.x = -Math.PI / 2; melt.position.y = 0.6; pivot.add(melt);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.07, 8, 28), iron); lip.rotation.x = Math.PI / 2; lip.position.y = 0.8; pivot.add(lip);
  for (const s of [-1, 1]) { const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 10), iron); tr.rotation.z = Math.PI / 2; tr.position.x = s * 1.25; pivot.add(tr); }
  const bail = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 6, 24, Math.PI), iron); bail.position.y = 0; G.add(bail); bail.position.y = 3.2;
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 12, 6), std('#2a2a2a')); cable.position.y = 4.55 + 6; G.add(cable);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1, 12), glow('#ff8a2a', 1.15)); G.add(stream);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 24), glow('#ff6a12', 1.0)); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.02; G.add(pool);
  const light = new THREE.PointLight('#ff8a3a', 0, 14, 1.6); light.position.set(0.5, 1.5, 0.8); G.add(light);
  G.userData.pour = (k) => { const a = -1.05 * k; pivot.rotation.z = a; const on = k > 0.55; stream.visible = on; pool.visible = on;
    const lipX = 1.1 * Math.cos(a) - 0.8 * Math.sin(a) + 0.12, lipY = 3.2 + 1.1 * Math.sin(a) + 0.8 * Math.cos(a);
    stream.scale.set(1, lipY, 1); stream.position.set(lipX, lipY / 2, 0); pool.position.x = lipX; pool.scale.setScalar(0.4 + 0.9 * Math.min(1, (k - 0.55) * 3)); light.intensity = on ? 9 : 2; };
  G.userData.pour(0); shadowAll(G); stream.castShadow = false; pool.castShadow = false; return G; }
// xe nâng vàng: lift(h) nâng càng, pallet chở cúp
export function forklift() { const G = new THREE.Group(); const yel = std('#f2b818', { roughness: 0.45 }), blk = std('#1c1c1e', { roughness: 0.8 }), steel = std('#6a6e74', { metalness: 0.7, roughness: 0.35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 1.25), yel); body.position.set(-0.2, 0.8, 0); G.add(body);
  const cw = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 1.25), blk); cw.position.set(-1.45, 0.85, 0); G.add(cw);
  for (const [x, z] of [[-0.25, 0.65], [-0.25, -0.65], [0.6, 0.65], [0.6, -0.65]]) for (const sx of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), blk); p.position.set(x < 0 ? -0.9 : 0.4, 2.0, sx * 0.55); G.add(p); }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 1.2), blk); roof.position.set(-0.25, 2.72, 0); G.add(roof);
  for (const [x, r] of [[0.55, 0.36], [-1.1, 0.32]]) for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.26, 18), blk); w.rotation.x = Math.PI / 2; w.position.set(x, r, s * 0.58); G.add(w); }
  const mast = new THREE.Group(); mast.position.set(1.0, 0, 0); G.add(mast);
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.0, 0.1), steel); m.position.set(0, 1.5, s * 0.4); mast.add(m); }
  const car = new THREE.Group(); mast.add(car); const plate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 1.0), steel); plate.position.set(0.08, 0.4, 0); car.add(plate);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.12), steel); f.position.set(0.7, 0.12, s * 0.3); car.add(f); }
  const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 1.15), std('#b8905a', { roughness: 0.9 })); pallet.position.set(0.72, 0.22, 0); car.add(pallet);
  const load = new THREE.Group(); load.position.set(0.72, 0.29, 0); car.add(load);
  G.userData.lift = (h) => { car.position.y = h; }; G.userData.load = load; G.userData.lift(0.05); return shadowAll(G); }
// CÁNH MÀN THÉP (Steel Curtain): tấm tôn lượn sóng xám thép phủ ngang sân; đỉnh treo vào cầu trục
export function steelCurtain(width = 52, height = 10) { const G = new THREE.Group();
  const t = ctex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 32, 0); gr.addColorStop(0, '#5a6068'); gr.addColorStop(0.5, '#b8bec6'); gr.addColorStop(1, '#5a6068'); g.fillStyle = gr; for (let x = 0; x < w; x += 32) { g.save(); g.translate(x, 0); g.fillRect(0, 0, 32, h); g.restore(); }
    g.fillStyle = 'rgba(40,30,20,0.18)'; for (let i = 0; i < 300; i++) g.fillRect(Math.random() * w, Math.random() * h, 3, 1 + Math.random() * 6); });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(width / 4, height / 4);
  const m = std('#ffffff', { map: t, metalness: 0.75, roughness: 0.38, side: THREE.DoubleSide });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.25, height, width), m); wall.position.y = -height / 2; G.add(wall);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, width + 0.6), std('#2a2c30', { metalness: 0.6, roughness: 0.4 })); G.add(beam);
  for (let z = -width / 2 + 2; z < width / 2; z += 4) { const rib = new THREE.Mesh(new THREE.BoxGeometry(0.4, height, 0.18), std('#4a4e54', { metalness: 0.7, roughness: 0.4 })); rib.position.set(0, -height / 2, z); G.add(rib); }
  const rivT = std('#ffb612', { roughness: 0.4 }); const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, width), rivT); stripe.position.y = -height + 0.4; G.add(stripe);
  G.userData.h = height; return shadowAll(G); }
// nam châm cẩu phế liệu
export function scrapMagnet() { const G = new THREE.Group(); const m = std('#3a3c40', { metalness: 0.7, roughness: 0.4 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.55, 32), m); G.add(disc); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 0.5, 16), m); top.position.y = 0.5; G.add(top);
  const t = ctex(512, 96, (g, w, h) => { g.fillStyle = '#ffb612'; g.fillRect(0, 0, w, h); g.fillStyle = '#101820'; g.font = '900 70px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('SCRAP YARD', w / 2, 76); });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.3, 32, 1, true), std('#ffffff', { map: t })); G.add(band);
  for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.2, 5), std('#2a2a2a')); const a = k * Math.PI / 2; c.position.set(Math.cos(a) * 0.4, 1.7, Math.sin(a) * 0.4); c.rotation.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18); G.add(c); }
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 20, 6), std('#2a2a2a')); cable.position.y = 12.8; G.add(cable); return shadowAll(G); }

// ---------- giấy tờ / lịch sử ----------
export function timeClock() { const G = new THREE.Group(); const box = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.25), std('#c8ccd0', { metalness: 0.5, roughness: 0.4 })); box.position.y = 1.35; G.add(box);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), std('#f6f4ee')); face.position.set(0, 1.47, 0.126); G.add(face);
  for (const [a, l] of [[0.4, 0.09], [2.2, 0.12]]) { const hnd = new THREE.Mesh(new THREE.BoxGeometry(0.012, l, 0.005), std('#1a1a1a')); hnd.geometry.translate(0, l / 2, 0); hnd.position.set(0, 1.47, 0.13); hnd.rotation.z = a; G.add(hnd); }
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.05), std('#1a1a1a')); slot.position.set(0, 1.62, 0.1); G.add(slot);
  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), std('#8a8e94', { metalness: 0.4 })); rack.position.set(0.6, 1.4, 0); G.add(rack);
  for (let k = 0; k < 8; k++) { const card = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.005), std('#f2e8c8')); card.position.set(0.39 + (k % 4) * 0.14, 1.55 - Math.floor(k / 4) * 0.3, 0.03); G.add(card); }
  const card = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.005), std('#f2e8c8')); G.add(card); G.userData.card = card; return shadowAll(G); }
export function jerseyHanger() { const G = new THREE.Group();
  const t = ctex(256, 256, (g, w, h) => { g.fillStyle = '#7a6a4a'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8c8a0'; for (let y = 60; y < 200; y += 40) g.fillRect(0, y, w, 12); g.fillStyle = 'rgba(40,30,15,0.3)'; for (let i = 0; i < 400; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 2); });
  const shirt = new THREE.Shape(); shirt.moveTo(-0.28, 0); shirt.lineTo(0.28, 0); shirt.lineTo(0.28, 0.5); shirt.lineTo(0.45, 0.42); shirt.lineTo(0.52, 0.6); shirt.lineTo(0.2, 0.72); shirt.lineTo(-0.2, 0.72); shirt.lineTo(-0.52, 0.6); shirt.lineTo(-0.45, 0.42); shirt.lineTo(-0.28, 0.5); shirt.closePath();
  const sg = new THREE.ShapeGeometry(shirt); const uv = sg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) + 0.5, uv.getY(i) / 0.72);
  const m = new THREE.Mesh(sg, std('#ffffff', { map: t, side: THREE.DoubleSide, roughness: 0.95 })); m.position.y = 1.0; G.add(m);
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.008, 6, 14, Math.PI * 1.4), std('#8a8e94', { metalness: 0.8 })); hook.position.set(0, 1.8, 0); G.add(hook);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.02), std('#8a6a42')); bar.position.set(0, 1.72, 0); G.add(bar); return shadowAll(G); }
export function newspaper() { const t = ctex(512, 700, (g, w, h) => { g.fillStyle = '#efe8d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1814'; g.textAlign = 'center';
    g.font = '900 52px Georgia, serif'; g.fillText('THE PITTSBURGH DAILY', w / 2, 70); g.fillRect(30, 88, w - 60, 4); g.font = '28px Georgia, serif'; g.fillText('1940', w / 2, 125);
    g.font = '900 96px Anton, Impact, sans-serif'; g.fillText('NAME THE', w / 2, 240); g.fillText('TEAM!', w / 2, 340); g.font = '30px Georgia, serif'; g.fillText('Fans pick a new name', w / 2, 400);
    g.fillStyle = 'rgba(26,24,20,0.55)'; for (let y = 440; y < 670; y += 18) { g.fillRect(40, y, 200, 8); g.fillRect(272, y, 200, 8); } });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.85), std('#ffffff', { map: t, side: THREE.DoubleSide, roughness: 0.95 })); const G = new THREE.Group(); G.add(m); return shadowAll(G); }
export function stockCertificate() { const t = ctex(768, 512, (g, w, h) => { g.fillStyle = '#f4ecd2'; g.fillRect(0, 0, w, h); g.strokeStyle = GB.green; g.lineWidth = 20; g.strokeRect(14, 14, w - 28, h - 28); g.strokeStyle = GB.gold; g.lineWidth = 6; g.strokeRect(40, 40, w - 80, h - 80);
    g.fillStyle = GB.green; g.textAlign = 'center'; g.font = '900 56px Georgia, serif'; g.fillText('SHAREHOLDER', w / 2, 140); g.font = 'italic 34px Georgia, serif'; g.fillText('Green Bay Football · since 1923', w / 2, 200);
    g.font = '900 120px Anton, Impact, sans-serif'; g.fillStyle = GB.gold; g.fillText('ONE SHARE', w / 2, 340); g.fillStyle = 'rgba(32,55,49,0.6)'; g.fillRect(140, 420, 200, 3); g.fillRect(430, 420, 200, 3); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), std('#ffffff', { map: t, side: THREE.DoubleSide, roughness: 0.9 })); const G = new THREE.Group(); G.add(m); return shadowAll(G); }
export function gavel() { const G = new THREE.Group(); const w = std('#6a3a1a', { roughness: 0.4 });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 14), w); head.rotation.z = Math.PI / 2; head.position.y = 0.3; G.add(head);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.32, 8), w); handle.position.y = 0.14; G.add(handle);
  const block = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.04, 16), w); block.position.set(0, -0.02, 0.05); G.add(block); G.userData.block = block; return shadowAll(G); }
export function podium() { const G = new THREE.Group(); const t = ctex(256, 256, (g, w, h) => { g.fillStyle = GB.green; g.fillRect(0, 0, w, h); g.strokeStyle = GB.gold; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24); g.fillStyle = GB.gold; g.font = '900 56px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('OWNERS', w / 2, 120); g.fillText('MEETING', w / 2, 185); });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.15, 0.5), [std('#2a3a34'), std('#2a3a34'), std('#2a3a34'), std('#2a3a34'), std('#ffffff', { map: t }), std('#2a3a34')]); body.position.y = 0.575; G.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.6), std('#6a3a1a')); top.position.y = 1.18; top.rotation.x = -0.2; G.add(top); return shadowAll(G); }
export function radioMic() { const G = new THREE.Group(); const chrome = std('#c8ccd2', { metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.03, 18), chrome); G.add(base); const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8), chrome); rod.position.y = 0.16; G.add(rod);
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.1, 6, 14), chrome); head.position.y = 0.38; G.add(head);
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.08, 14, 1, true), std('#3a3c40', { metalness: 0.5, wireframe: true })); grille.position.y = 0.38; G.add(grille);
  const t = ctex(256, 64, (g) => { g.fillStyle = '#b0282a'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#fff'; g.font = '900 44px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('ON AIR', 128, 50); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.1), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); sign.position.set(0, 0.7, -0.4); G.add(sign); return shadowAll(G); }
// khăn vàng cổ động (không chữ thương hiệu)
export function rallyTowel() { const G = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.6, 4, 6), std('#ffb612', { side: THREE.DoubleSide, roughness: 0.9 })); m.geometry.translate(0, 0.3, 0); G.add(m);
  G.userData.wave = (t, sd = 0) => { const p = m.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setZ(i, Math.sin(t * 14 + y * 6 + sd) * 0.08 * y); } p.needsUpdate = true; m.geometry.computeVertexNormals(); m.rotation.y = Math.sin(t * 12 + sd) * 0.9; };
  return shadowAll(G); }
// gối đệm sofa: morph(k) 0 = gối, 1 = mũ phô mai
export function couchCushion() { const G = new THREE.Group(); const cush = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.55, 4, 2, 4), std('#e8a030', { roughness: 0.95 })); G.add(cush);
  const ch = cheesehead(1.2); ch.visible = false; G.add(ch);
  G.userData.morph = (k) => { cush.visible = k < 0.5; ch.visible = k >= 0.5; const s = k < 0.5 ? 1 - k * 0.6 : 0.7 + (k - 0.5) * 0.6; (k < 0.5 ? cush : ch).scale.setScalar(Math.max(0.3, s)); ch.rotation.y = k * 4; };
  return shadowAll(G); }
// xe đẩy chở cúp (Steelers): 6 cúp
export function trophyCart(trophyFn, n = 6) { const G = new THREE.Group(); const steel = std('#3a3c40', { metalness: 0.6, roughness: 0.4 });
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.0), steel); bed.position.y = 0.45; G.add(bed); const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.9), steel); handle.position.set(-1.2, 0.85, 0); G.add(handle);
  for (const [x, z] of [[-1, -0.4], [-1, 0.4], [1, -0.4], [1, 0.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 14), std('#1a1a1a')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.12, z); G.add(w); const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), steel); l.position.set(x, 0.3, z); G.add(l); }
  for (let k = 0; k < n; k++) { const tr = trophyFn(); tr.position.set(-0.8 + (k % 3) * 0.8, 0.5, k < 3 ? -0.22 : 0.22); tr.scale.setScalar(0.75); G.add(tr); } return shadowAll(G); }
