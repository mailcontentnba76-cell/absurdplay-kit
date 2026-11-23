// Tập 28 — "THE PLANT BOWL" hư cấu (Packers vs Steelers theo nghề gốc của tên đội): sân cỏ giữa KHU CÔNG NGHIỆP lúc hoàng hôn cam–tím.
// Kiểu mới (khác E22–E27): khán đài là CONTAINER xếp bậc hai bên sân (phía −z: fan Steelers đen/vàng; phía +z: fan Packers xanh/vàng),
// sau end zone phải (+x) là NHÀ MÁY THÉP (lò cao, 3 ống khói nhả khói, nhà đúc cửa đỏ rực, cầu băng tải), sau end zone trái (−x) là
// XƯỞNG ĐÓNG GÓI THỊT (khối nhà trắng ốp panel, sọc xanh, cửa bốc hàng + rơ-moóc lạnh, biển xúc xích trên mái);
// CẦU TRỤC vàng bắc ngang sân trên vạch gôn phải (treo Màn Thép / nam châm phế liệu), bảng điểm đặt trên dầm cầu trục.
// Bối cảnh phụ (xa sân, không lộ trong khung sân): phòng radio 1971/1975, góc phòng khách (gối sofa → mũ phô mai). Không logo, không tên sân thật.
import * as THREE from 'three';
import { fieldTexture, goalPost, FL, FW } from './ngoaitroi.js';
import { GL, YD } from './santap.js';
import { buildCrowd } from './dongnguoi25.js';
import { cheeseWedgeGeo } from './dao28.js';
export const OX = GL - 50 * 0.9144;
export const FZ = FW / 2;
export const LX = OX - FL / 2, RX = OX + FL / 2;
export const XG = RX - 10 * 0.9144;            // vạch gôn phải (cầu trục)
export const BOOTH = new THREE.Vector3(OX, 0, -(FZ + 70)), LIVING = new THREE.Vector3(OX + 40, 0, FZ + 70);
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
function ctex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; }
let rs = 28; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
const sh = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G; };
function sky() { const t = ctex(64, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#2a3f78'); gr.addColorStop(0.25, '#5a6aa8'); gr.addColorStop(0.4, '#c87a8a'); gr.addColorStop(0.47, '#f6a46a'); gr.addColorStop(0.5, '#ffd896'); gr.addColorStop(0.53, '#8a6a5a'); gr.addColorStop(1, '#3a3438');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let i = 0; i < 22; i++) { const y = H * (0.2 + Math.random() * 0.26), x = Math.random() * W; g.fillStyle = 'rgba(255,190,150,0.35)'; g.beginPath(); g.ellipse(x, y, 14 + Math.random() * 16, 2 + Math.random() * 2, 0, 0, 7); g.fill(); } });
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(4, 1);
  return new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); }
// khán đài container: bậc so le; spots có team 0 = Steelers (−z), 1 = Packers (+z)
function containerStands(G, spots) {
  const L = 6.06, Hc = 2.59, Dc = 2.44;
  const tex = ctex(256, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 12) { g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(x, 0, 4, h); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x + 6, 0, 2, h); } g.fillStyle = 'rgba(60,40,30,0.25)'; for (let i = 0; i < 120; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 4 + Math.random() * 10); });
  const geo = new THREE.BoxGeometry(L, Hc, Dc); const m = std('#ffffff', { map: tex, roughness: 0.7, metalness: 0.25 });
  const PAL = { 0: ['#2a2c32', '#b8452a', '#3a3e48', '#d8a030', '#5a5e66', '#2a2c32'], 1: ['#2e5a3a', '#d8a030', '#c8c4bc', '#2a5a8a', '#2e5a3a', '#b8452a'] };
  const list = [];
  for (const side of [-1, 1]) { const team = side < 0 ? 0 : 1;
    for (let tier = 0; tier < 5; tier++) { const zc = side * (FZ + 6.0 + tier * 1.35); const y = tier * Hc;
      for (let k = 0; k < 19; k++) { const x = OX - 57 + k * (L + 0.25); if (side < 0 && tier === 4 && Math.abs(x - OX) < 4) continue;
        list.push([x, y + Hc / 2, zc, PAL[team][(k * 3 + tier * 5) % 6]]);
        for (let c = 0; c < 7; c++) if (R() > 0.08 && !(tier === 0 && Math.abs(x - L / 2 + 0.45 + c * 0.86 - OX) < 7)) spots.push({ x: x - L / 2 + 0.45 + c * 0.86 + (R() - 0.5) * 0.12, y: y + Hc, z: zc - side * 0.62, ry: side > 0 ? Math.PI : 0, team }); } } }
  const IM = new THREE.InstancedMesh(geo, m, list.length); const D = new THREE.Object3D(), col = new THREE.Color();
  list.forEach(([x, y, z, c], i) => { D.position.set(x, y, z); D.updateMatrix(); IM.setMatrixAt(i, D.matrix); IM.setColorAt(i, col.set(c)); });
  IM.castShadow = true; IM.receiveShadow = true; G.add(IM);
  // lan can vàng mép trước mỗi tầng
  const rail = std('#f2b818', { roughness: 0.5 }); for (const side of [-1, 1]) for (let tier = 0; tier < 5; tier++) { const r = new THREE.Mesh(new THREE.BoxGeometry(19 * (L + 0.25), 0.06, 0.06), rail); r.position.set(OX - 57 - L / 2 + 19 * (L + 0.25) / 2, (tier + 1) * Hc + 1.0, side * (FZ + 6.0 + tier * 1.35 - Dc / 2 + 0.05)); G.add(r); }
}
// nhà máy thép (sau end zone phải)
function steelMill(G) { const M = new THREE.Group(); const rust = std('#6a4436', { roughness: 0.85, metalness: 0.3 }), dark = std('#34343a', { roughness: 0.7, metalness: 0.5 }), brick = std('#7a3a2a', { roughness: 0.95 });
  const fur = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 30, 24), rust); fur.position.set(30, 15, -10); M.add(fur);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(3, 6, 8, 20), rust); cone.position.set(30, 34, -10); M.add(cone);
  for (const [x, z, h] of [[48, 12, 52], [56, 2, 46], [64, 18, 50]]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, h, 16), brick); st.position.set(x, h / 2, z); M.add(st);
    for (let b = 0; b < 3; b++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.12, 6, 16), std('#d8d2c4')); ring.rotation.x = Math.PI / 2; ring.position.set(x, h - 4 - b * 1.2, z); M.add(ring); } }
  // lò cao phụ + ống dẫn
  for (const [x, z] of [[18, -22], [18, 4]]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 24, 20), dark); s.position.set(x, 12, z); M.add(s); const d = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 10, 0, 6.3, 0, 1.6), dark); d.position.set(x, 24, z); M.add(d); }
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 28, 12), rust); pipe.rotation.z = Math.PI / 2; pipe.position.set(24, 26, -10); M.add(pipe);
  // nhà đúc: cửa đỏ rực
  const cast = new THREE.Mesh(new THREE.BoxGeometry(26, 14, 40), std('#4a4a52', { roughness: 0.6, metalness: 0.4 })); cast.position.set(42, 7, 30); M.add(cast);
  const doors = []; for (const z of [18, 30, 42]) { const d = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(1.3), toneMapped: false })); d.position.set(28.95, 3.5, z); d.rotation.y = -Math.PI / 2; M.add(d); doors.push(d); }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(27, 0.6, 41), dark); roof.position.set(42, 14.3, 30); M.add(roof);
  // cầu băng tải nghiêng
  const conv = new THREE.Mesh(new THREE.BoxGeometry(34, 1.6, 2.4), std('#8a8e94', { metalness: 0.5 })); conv.position.set(16, 16, -30); conv.rotation.z = 0.45; M.add(conv);
  // khung thép
  for (let k = 0; k < 7; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.6, 20, 0.6), dark); c.position.set(8 + k * 5, 10, -40); M.add(c); }
  const tr = new THREE.Mesh(new THREE.BoxGeometry(36, 0.8, 0.8), dark); tr.position.set(23, 20, -40); M.add(tr);
  M.position.set(RX + 14, 0, 0); sh(M); G.add(M);
  const glowL = new THREE.PointLight('#ff7a2a', 260, 120, 1.6); glowL.position.set(RX + 40, 6, 28); G.add(glowL);
  return { M, doors }; }
// khói ống khói: sprite instanced trôi lên
function smoke(G) { const t = ctex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(235,225,215,0.85)'); gr.addColorStop(1, 'rgba(235,225,215,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const mat = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, color: '#d8c8c0' });
  const S = []; const stacks = [[RX + 62, 12, 52], [RX + 70, 2, 46], [RX + 78, 18, 50]];
  for (const [x, z, h] of stacks) for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(mat); s.userData = { x, z, h, i }; G.add(s); S.push(s); }
  return (tt) => S.forEach((s) => { const u = ((tt * 0.07 + s.userData.i / 14) % 1); s.position.set(s.userData.x + u * 22, s.userData.h + u * 26, s.userData.z + Math.sin(s.userData.i) * 2); s.scale.setScalar(3 + u * 14); s.material.opacity = 0.8 * (1 - u); }); }
// xưởng đóng gói thịt (sau end zone trái)
function packingPlant(G) { const P = new THREE.Group();
  const panel = ctex(256, 128, (g, w, h) => { g.fillStyle = '#eeeee8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,120,110,0.4)'; g.lineWidth = 2; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.fillStyle = '#203731'; g.fillRect(0, 70, w, 18); g.fillStyle = '#ffb612'; g.fillRect(0, 88, w, 6); }, [10, 2]);
  const body = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 90), std('#ffffff', { map: panel, roughness: 0.6 })); body.position.set(-11, 8, 0); P.add(body);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(23, 0.6, 91), std('#5a5e66')); roof.position.set(-11, 16.3, 0); P.add(roof);
  for (let k = 0; k < 6; k++) { const d = new THREE.Mesh(new THREE.PlaneGeometry(4, 4.4), std('#6a6e74', { metalness: 0.4 })); d.position.set(0.02, 2.4, -36 + k * 14); d.rotation.y = Math.PI / 2; P.add(d);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(14, 3.6, 2.6), std('#f4f4f0', { roughness: 0.5 })); tr.position.set(8 + (k % 2) * 1.5, 2.6, -36 + k * 14); P.add(tr);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.8, 2.5), std(k % 2 ? '#203731' : '#b8452a', { roughness: 0.4 })); cab.position.set(16.5 + (k % 2) * 1.5, 1.9, -36 + k * 14); P.add(cab);
    for (const s of [-1, 1]) for (const x of [2, 6, 13]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 14), std('#1a1a1a')); w.rotation.x = Math.PI / 2; w.position.set(x + 2 + (k % 2) * 1.5, 0.5, -36 + k * 14 + s * 1.2); P.add(w); } }
  // biển xúc xích trên mái
  const sg = new THREE.Mesh(new THREE.CapsuleGeometry(1.6, 12, 8, 20), std('#b04a2a', { roughness: 0.35 })); sg.rotation.x = Math.PI / 2; sg.position.set(-8, 21, 0); P.add(sg);
  const signT = ctex(1024, 192, (g, w, h) => { g.fillStyle = '#203731'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffb612'; g.font = '900 140px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('PACKING PLANT No. 1', w / 2, 150); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(30, 5.6), std('#ffffff', { map: signT })); sign.position.set(0.06, 12.2, 0); sign.rotation.y = Math.PI / 2; P.add(sign);
  for (const [z, h] of [[-30, 26], [32, 22]]) { const tk = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 8, 18), std('#c8ccd0', { metalness: 0.5, roughness: 0.4 })); tk.position.set(-16, h, z); P.add(tk); }
  P.position.set(LX - 16, 0, 0); sh(P); G.add(P); return P; }
// cầu trục vàng bắc ngang sân tại vạch gôn phải + bảng điểm trên dầm
function gantry(G) { const C = new THREE.Group(); const yel = std('#f2b818', { roughness: 0.45, metalness: 0.2 }), blk = std('#1c1c1e');
  const H = 18, half = FZ + 3.2;
  for (const s of [-1, 1]) { for (const dx of [-1.6, 1.6]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, H, 0.9), yel); leg.position.set(dx, H / 2, s * half); C.add(leg); }
    const br = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 1.2), yel); br.position.set(0, 0.3, s * half); C.add(br); }
  for (const dx of [-1.3, 1.3]) { const beam = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, half * 2 + 1.2), yel); beam.position.set(dx, H + 0.8, 0); C.add(beam); }
  const haz = ctex(256, 32, (g, w, h) => { for (let x = -32; x < w; x += 32) { g.fillStyle = '#101820'; g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, 0); g.lineTo(x + 32, 0); g.lineTo(x + 16, h); g.fill(); } }, [20, 1]);
  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, 0.5), new THREE.MeshStandardMaterial({ map: haz, transparent: true })); stripe.position.set(-1.76, H + 0.5, 0); stripe.rotation.y = -Math.PI / 2; C.add(stripe);
  const trolley = new THREE.Group(); const tb = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.4), std('#3a3c40', { metalness: 0.5 })); tb.position.y = H + 2.3; trolley.add(tb); C.add(trolley);
  // bảng điểm đặt trên dầm, hướng về giữa sân (−x)
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7.4, 14.6), blk); frame.position.set(0, H + 5.4, 0); C.add(frame);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); face.position.set(-0.32, H + 5.4, 0); face.rotation.y = -Math.PI / 2; C.add(face);
  let last = ''; const draw = (o) => { const key = JSON.stringify(o); if (key === last) return; last = key; const g = cv.getContext('2d'); g.fillStyle = '#0e0e12'; g.fillRect(0, 0, 1024, 512); g.strokeStyle = '#ffb612'; g.lineWidth = 10; g.strokeRect(10, 10, 1004, 492); g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.msg) { g.font = '900 104px Anton, Impact, sans-serif'; g.fillStyle = o.msgColor || '#fff'; o.msg.split('\n').forEach((l, i, a) => g.fillText(l, 512, 256 + (i - (a.length - 1) / 2) * 120)); t.needsUpdate = true; return; }
    g.font = '900 90px Anton, Impact, sans-serif'; g.fillStyle = '#4ac07a'; g.fillText('GREEN BAY', 270, 100); g.fillStyle = '#ffb612'; g.fillText('PITTSBURGH', 754, 100);
    g.font = '900 210px Anton, Impact, sans-serif'; g.fillStyle = '#fff'; g.fillText(String(o.a ?? 0), 270, 290); g.fillText(String(o.b ?? 0), 754, 290);
    g.font = '900 66px Anton, Impact, sans-serif'; g.fillStyle = '#ffd08a'; g.fillText(o.clock || '', 512, 440); t.needsUpdate = true; };
  draw({ a: 0, b: 0, clock: 'THE PLANT BOWL' });
  C.position.set(XG, 0, 0); sh(C); G.add(C); return { C, trolley, H, draw }; }
// phòng radio (bối cảnh phụ): bàn, cửa kính nhìn ra sân, đèn ON AIR
function booth(G) { const B = new THREE.Group(); const wall = std('#6a5a48', { roughness: 0.9 }), desk = std('#5a3a22', { roughness: 0.55 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), std('#3a3430')); floor.rotation.x = -Math.PI / 2; B.add(floor);
  const back = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 0.2), wall); back.position.set(0, 2, -2.5); B.add(back);
  const panelT = ctex(256, 256, (g, w, h) => { g.fillStyle = '#8a6a4a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(40,24,12,0.5)'; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } }, [3, 1]);
  back.material = std('#ffffff', { map: panelT, roughness: 0.8 });
  const d = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.2), desk); d.position.set(0, 0.85, 0.4); B.add(d);
  const front = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.08), desk); front.position.set(0, 0.42, 1.0); B.add(front);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.8), new THREE.MeshBasicMaterial({ color: '#f0a870', toneMapped: false })); win.position.set(0, 2.2, -2.39); B.add(win);
  const lamp = new THREE.PointLight('#ffd8a0', 18, 9, 1.5); lamp.position.set(0.6, 2.6, 1.4); B.add(lamp);
  B.position.copy(BOOTH); sh(B); G.add(B); return B; }
// góc phòng khách (bối cảnh phụ): sofa cam 1987, tường giấy dán, đèn bàn
function living(G) { const L_ = new THREE.Group(); const sofa = std('#6a3a24', { roughness: 0.95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), std('#7a5a3a')); floor.rotation.x = -Math.PI / 2; L_.add(floor);
  const wpT = ctex(128, 128, (g) => { g.fillStyle = '#d8c89a'; g.fillRect(0, 0, 128, 128); g.fillStyle = 'rgba(120,90,40,0.35)'; for (let y = 0; y < 128; y += 16) for (let x = (y / 16 % 2) * 8; x < 128; x += 16) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); } }, [6, 3]);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 4, 0.2), std('#ffffff', { map: wpT })); wall.position.set(0, 2, -2.2); L_.add(wall);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.95), sofa); base.position.set(0, 0.3, -1.2); L_.add(base);
  const backR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 0.25), sofa); backR.position.set(0, 0.85, -1.6); L_.add(backR);
  for (const s of [-1, 1]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, 0.95), sofa); arm.position.set(s * 1.3, 0.55, -1.2); L_.add(arm); }
  const tv = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.6), std('#5a3a22')); tv.position.set(2.6, 0.35, -1.2); L_.add(tv);
  const lampL = new THREE.PointLight('#ffd8a0', 14, 8, 1.5); lampL.position.set(-1.6, 2.0, 0.6); L_.add(lampL);
  L_.position.copy(LIVING); sh(L_); G.add(L_); return L_; }
export function buildMill(scene) {
  scene.background = new THREE.Color('#c88a7a'); scene.fog = new THREE.Fog('#c8988a', 150, 600);
  const G = new THREE.Group(); scene.add(G); G.add(sky());
  const conc = ctex(128, 128, (g) => { g.fillStyle = '#8a8680'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(40,36,34,0.12)' : 'rgba(220,210,200,0.1)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } g.strokeStyle = 'rgba(40,36,34,0.3)'; g.strokeRect(0, 0, 128, 128); }, [160, 160]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), std('#ffffff', { map: conc, roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.set(OX, -0.03, 0); ground.receiveShadow = true; G.add(ground);
  // viền sọc nguy hiểm vàng–đen quanh sân
  const haz = ctex(256, 32, (g, w, h) => { g.fillStyle = '#ffb612'; g.fillRect(0, 0, w, h); for (let x = -32; x < w; x += 32) { g.fillStyle = '#101820'; g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, 0); g.lineTo(x + 32, 0); g.lineTo(x + 16, h); g.fill(); } }, [60, 1]);
  for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(FL + 10, 0.6), std('#ffffff', { map: haz })); b.rotation.x = -Math.PI / 2; b.position.set(OX, -0.01, s * (FZ + 3.0)); b.receiveShadow = true; G.add(b); }
  const turf = ctex(128, 128, (g) => { g.fillStyle = '#4a8a3a'; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = i % 2 ? 'rgba(30,70,20,0.1)' : 'rgba(210,230,140,0.08)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); } }, [40, 20]);
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(FL + 10, FW + 5.6), std('#ffffff', { map: turf, roughness: 0.95 })); apron.rotation.x = -Math.PI / 2; apron.position.set(OX, -0.015, 0); apron.receiveShadow = true; G.add(apron);
  const ft = fieldTexture({ endLeft: '#203731', endLeftText: 'GREEN BAY', endLeftStroke: '#ffb612', endRight: '#101820', endRightText: 'PITTSBURGH', endRightFg: '#ffb612', g1: '#3f8a36', g2: '#4a9a40' });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); field.rotation.x = -Math.PI / 2; field.position.set(OX, 0.004, 0); field.receiveShadow = true; G.add(field);
  for (const d of [-1, 1]) { const gp = goalPost(d); gp.position.set((d < 0 ? LX : RX) + d * 1.8 - d * 1.8, 0, 0); G.add(gp); }
  const spots = []; containerStands(G, spots);
  const mill = steelMill(G); const smokeU = smoke(G); const plant = packingPlant(G); const gan = gantry(G); booth(G); living(G);
  // cột đèn natri 4 góc
  for (const [x, z] of [[LX - 4, -FZ - 16], [LX - 4, FZ + 16], [RX + 4, -FZ - 16], [RX + 4, FZ + 16]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 34, 10), std('#6a6e74', { metalness: 0.6 })); p.position.set(x, 17, z); G.add(p);
    const head = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.6), new THREE.MeshBasicMaterial({ color: '#ffe0a8', toneMapped: false })); head.position.set(x, 34, z); head.lookAt(OX, 0, 0); G.add(head); }
  const crowdS = buildCrowd(G, spots.filter((p) => p.team === 0), { seed: 28, towelEvery: 1, coats: ['#101820', '#ffb612', '#101820', '#2a2a2e', '#ffb612', '#d8d8d0', '#101820'], hats: ['#101820', '#ffb612', '#2a2a2e'], paint: ['#ffb612', '#101820'], towels: ['#ffb612'] });
  const crowdP = buildCrowd(G, spots.filter((p) => p.team === 1), { seed: 82, hatAll: true, hatGeo: cheeseWedgeGeo(), coats: ['#203731', '#ffb612', '#203731', '#f2efe8', '#203731', '#2e5a3a', '#ffb612'], hats: ['#ffc62a', '#f6b820'], paint: ['#203731', '#ffb612'], towels: ['#ffb612'] });
  crowdP.IM.towel.visible = false; crowdS.IM.towel.visible = false; crowdP.IM.beanie.visible = false;
  const update = (t) => { smokeU(t); const f = 1.15 + 0.15 * Math.sin(t * 3.1); mill.doors.forEach((d, i) => d.material.color.setRGB(f, f * 0.48, f * 0.16)); };
  update(0);
  return { G, crowdS, crowdP, gantry: gan, board: gan, plant, mill, update };
}
export function millLights(scene) {
  const hemi = new THREE.HemisphereLight('#eef0ff', '#6a6058', 2.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff0dc', 4.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 3; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#a8b8ff', 1.0); fill.position.set(-30, 18, 40); scene.add(fill);
  const area = (x, z, cp) => { key.target.position.set(x, 0, z); if (!cp) { key.position.set(x - 30, 24, z - 16); return; }
    const d = new THREE.Vector3(cp.x - x, 0, cp.z - z); if (d.lengthSq() < 1e-4) d.set(-1, 0, 0); d.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7).multiplyScalar(26); key.position.set(x + d.x, 24, z + d.z); };
  area(0, 0); return { hemi, key, fill, area };
}
