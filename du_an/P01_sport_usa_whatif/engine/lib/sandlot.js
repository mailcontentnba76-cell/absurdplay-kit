// Tập 08 (NFL) — "What if the Bears played eleven baseball gloves?"
// Bối cảnh: sân bóng chày đất (sandlot) ngoại ô lúc hoàng hôn mùa hè — khác mọi tập trước:
// trời hồng-cam, mặt trời thấp, cỏ xanh vàng nắng có kẻ vạch bóng bầu dục bằng phấn, sân đất infield + gôn nhà,
// lưới chắn sau gôn nhà, ghế băng nhôm, hàng rào gỗ ngoại sân có biển quảng cáo hư cấu, bảng điểm lật tay,
// nhà dân + cây lá rộng + cột điện dây điện, lều bình luận (bàn gấp dưới mái bạt).
// Nhân vật: găng bóng chày có mặt (makeGlove).
import * as THREE from 'three';
import { fieldTexture, bleachers, FL, FW } from './ngoaitroi.js';
export { FL, FW };
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.cv = c;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const CHI = { navy: '#0b162a', orange: '#e64100' };
const woodTex = (base = '#8a5a34', seed = 3, rep = [1, 1]) => ctex(256, 256, (g, W, H) => { g.fillStyle = base; g.fillRect(0, 0, W, H); const r = rnd(seed);
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(${r() < 0.5 ? '40,22,10' : '255,220,170'},${0.06 + r() * 0.1})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const y = r() * H; g.moveTo(0, y); for (let x = 0; x <= W; x += 32) g.lineTo(x, y + Math.sin(x * 0.03 + i) * 4); g.stroke(); } }, rep);

function skyDome() {
  const t = ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2b3a78'); gr.addColorStop(0.25, '#6a4f9a'); gr.addColorStop(0.38, '#d9708a'); gr.addColorStop(0.45, '#f5a35a'); gr.addColorStop(0.49, '#ffd27a'); gr.addColorStop(0.52, '#ffe6a8'); gr.addColorStop(1, '#c98a5a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  return new THREE.Mesh(new THREE.SphereGeometry(950, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}
function sun(G) { const t = ctex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,250,220,1)'); gr.addColorStop(0.18, 'rgba(255,220,140,1)'); gr.addColorStop(0.35, 'rgba(255,170,80,0.55)'); gr.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false })); s.position.set(800, 45, -260); s.scale.set(220, 220, 1); G.add(s);
  // mây vệt hồng
  const ct = ctex(512, 128, (g, W, H) => { for (let i = 0; i < 18; i++) { const x = Math.random() * W, y = 40 + Math.random() * 50, rx = 60 + Math.random() * 110; const gr = g.createRadialGradient(x, y, 0, x, y, rx); gr.addColorStop(0, 'rgba(255,170,150,0.6)'); gr.addColorStop(1, 'rgba(255,170,150,0)'); g.fillStyle = gr; g.save(); g.translate(x, y); g.scale(1, 0.25); g.translate(-x, -y); g.beginPath(); g.arc(x, y, rx, 0, 7); g.fill(); g.restore(); } });
  const cm = new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false }); const r = rnd(5);
  for (let i = 0; i < 14; i++) { const c = new THREE.Sprite(cm); const a = -0.9 + r() * 1.8; const d = 650 + r() * 200; c.position.set(Math.cos(a) * d, 110 + r() * 150, Math.sin(a) * d - 100); c.scale.set(420 + r() * 300, 70 + r() * 40, 1); G.add(c); } }
// cây lá rộng (instanced): thân + 3 khối tán
function trees(G, spots, seed = 1) {
  const N = spots.length; const r = rnd(seed);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.25, 0.4, 4, 7).translate(0, 2, 0), std('#4b3526', { roughness: 0.95 }), N);
  const blobs = [[0, 5.2, 0, 2.6], [1.3, 4.6, 0.6, 1.9], [-1.2, 4.8, -0.5, 2.0]].map(([x, y, z, rr], k) => { const g = new THREE.IcosahedronGeometry(rr, 1); const p = g.attributes.position; const r2 = rnd(k * 13 + 2); for (let i = 0; i < p.count; i++) { const s = 1 + (r2() - 0.5) * 0.22; p.setXYZ(i, p.getX(i) * s + x, p.getY(i) * s + y, p.getZ(i) * s + z); } g.computeVertexNormals(); return new THREE.InstancedMesh(g, std('#fff', { roughness: 0.9, flatShading: true }), N); });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  spots.forEach(([x, z, sc], i) => { const k = sc ?? (0.8 + r() * 0.7); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28); s.setScalar(k); p.set(x, 0, z); m.compose(p, q, s); trunk.setMatrixAt(i, m);
    blobs.forEach((b) => { b.setMatrixAt(i, m); c.setHSL(0.24 + (r() - 0.5) * 0.06, 0.5, 0.26 + r() * 0.08); b.setColorAt(i, c); }); });
  for (const im of [trunk, ...blobs]) { im.castShadow = true; im.receiveShadow = true; G.add(im); }
}
function house(w, d, h, siding, roof, seed) {
  const G = new THREE.Group(); const sid = ctex(128, 128, (g) => { g.fillStyle = siding; g.fillRect(0, 0, 128, 128); g.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < 128; y += 10) g.fillRect(0, y, 128, 2); }, [w / 3, h / 3]);
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std('#fff', { map: sid })); b.position.y = h / 2; G.add(b);
  const rs = new THREE.Shape(); rs.moveTo(-d / 2 - 0.4, 0); rs.lineTo(0, 2.4); rs.lineTo(d / 2 + 0.4, 0); rs.lineTo(-d / 2 - 0.4, 0);
  const rg = new THREE.ExtrudeGeometry(rs, { depth: w + 0.6, bevelEnabled: false }); rg.translate(0, 0, -(w + 0.6) / 2); rg.rotateY(Math.PI / 2);
  const rf = new THREE.Mesh(rg, std(roof, { roughness: 0.9 })); rf.position.y = h; G.add(rf);
  const win = ctex(64, 64, (g) => { g.fillStyle = '#ffd38a'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#fff'; g.fillRect(29, 0, 6, 64); g.fillRect(0, 29, 64, 6); });
  const r = rnd(seed); for (const x of [-w * 0.3, w * 0.3]) for (const y of [h * 0.3, h * 0.72]) { if (r() < 0.25) continue; const wm = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.1), new THREE.MeshStandardMaterial({ map: win, emissive: '#ffb04a', emissiveIntensity: r() < 0.5 ? 0.9 : 0.2 })); wm.position.set(x, y, d / 2 + 0.01); G.add(wm); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}
// bảng điểm lật tay trên hàng rào: set({home,away,inn,face?})
function flipBoard() {
  const G = new THREE.Group(); const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const body = new THREE.Mesh(new THREE.BoxGeometry(9, 4.6, 0.3), std('#1d4a2c')); body.position.y = 5.0; G.add(body);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 4.3), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })); face.position.set(0, 5.0, 0.16); G.add(face);
  for (const x of [-3.5, 3.5]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5, 0.35), std('#5a3b22', { map: woodTex('#6a4428', 4) })); p.position.set(x, 2.5, -0.2); G.add(p); }
  let last = '';
  const set = (s) => { const k = JSON.stringify(s); if (k === last) return; last = k; const g = cv.getContext('2d');
    g.fillStyle = '#1d4a2c'; g.fillRect(0, 0, 1024, 512); g.fillStyle = '#f4efe2'; g.font = '900 64px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('BEARS', 260, 80); g.fillText('GLOVES', 764, 80);
    const card = (txt, x, y) => { g.fillStyle = '#f4efe2'; g.fillRect(x - 130, y - 110, 260, 220); g.fillStyle = '#d8d1c0'; g.fillRect(x - 130, y - 2, 260, 4); g.fillStyle = '#16120e'; g.font = '900 190px Anton, Impact, sans-serif'; g.fillText(String(txt), x, y + 8); };
    card(s.home, 260, 260); card(s.away, 764, 260);
    g.fillStyle = '#f4efe2'; g.font = '900 52px Anton, Impact, sans-serif'; g.fillText(`QTR ${s.q ?? 1}`, 260, 440); g.fillStyle = '#ffd27a'; g.fillText(`INT ${s.int ?? 0}`, 764, 440); tex.needsUpdate = true; };
  set({ home: 0, away: 0 }); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return { G, set };
}
// lều bình luận: mái bạt sọc + bàn gấp + 2 mic + màn hình
function tent() {
  const G = new THREE.Group(); const st = ctex(256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f4efe2' : CHI.orange; g.fillRect(i * 32, 0, 32, 64); } });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 3.6), std('#fff', { map: st })); roof.position.y = 2.7; G.add(roof);
  const val = new THREE.Mesh(new THREE.BoxGeometry(5, 0.35, 0.04), std('#fff', { map: st })); val.position.set(0, 2.5, 1.8); G.add(val);
  for (const [x, z] of [[-2.4, -1.7], [2.4, -1.7], [-2.4, 1.7], [2.4, 1.7]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.7, 8), std('#9aa0a6', { metalness: 0.6, roughness: 0.4 })); l.position.set(x, 1.35, z); G.add(l); }
  const back = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.6), std('#fff', { map: ctex(512, 256, (g) => { g.fillStyle = CHI.navy; g.fillRect(0, 0, 512, 256); g.fillStyle = '#f4efe2'; g.font = '900 54px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('SANDLOT SPORTS NETWORK', 256, 120); g.fillStyle = CHI.orange; g.fillRect(40, 150, 432, 10); }) })); back.position.set(0, 1.3, -1.75); G.add(back);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.9), std('#e9e4d8')); desk.position.set(0, 0.76, 0.6); G.add(desk);
  for (const x of [-1.6, 1.6]) { const lg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.76, 0.8), std('#777')); lg.position.set(x, 0.38, 0.6); G.add(lg); }
  for (const x of [-0.8, 0.8]) { const st2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), std('#222')); st2.position.set(x, 0.94, 0.75); G.add(st2); const mic = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), std('#2b2b2b')); mic.position.set(x, 1.1, 0.75); G.add(mic); }
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return G;
}

export function buildSandlot(scene) {
  scene.background = new THREE.Color('#e9a46a'); scene.fog = new THREE.Fog('#e7b48a', 140, 900);
  const G = new THREE.Group(); scene.add(G); G.add(skyDome()); sun(G);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), std('#6f8a3a', { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; ground.receiveShadow = true; G.add(ground);
  // sân: cỏ + vạch phấn bóng bầu dục, end zone cam CHICAGO / nâu GLOVES; đất infield ở nửa trái, mảng cỏ trụi
  const ft = fieldTexture({ g1: '#5f8f34', g2: '#679a38', endLeft: CHI.orange, endLeftText: 'CHICAGO', endLeftStroke: CHI.navy, endRight: '#7a4a24', endRightText: 'GLOVES', endRightFg: '#f4efe2' });
  { const cv = ft.userData.cv; const g = cv.getContext('2d'); const W = cv.width, H = cv.height; const r = rnd(8);
    // infield đất: hình quạt quanh gôn nhà ở ~22% chiều dài
    const hx = W * 0.2, hy = H * 0.5, R = H * 0.55; g.save(); g.globalAlpha = 0.85; const dg = g.createRadialGradient(hx, hy, R * 0.2, hx, hy, R); dg.addColorStop(0, '#b98552'); dg.addColorStop(1, '#a8743f');
    g.fillStyle = dg; g.beginPath(); g.moveTo(hx, hy); g.arc(hx, hy, R, -Math.PI / 4, Math.PI / 4); g.closePath(); g.fill(); g.restore();
    g.fillStyle = '#5f8f34'; g.beginPath(); g.moveTo(hx + R * 0.22, hy); g.lineTo(hx + R * 0.5, hy - R * 0.28); g.lineTo(hx + R * 0.78, hy); g.lineTo(hx + R * 0.5, hy + R * 0.28); g.closePath(); g.globalAlpha = 0.9; g.fill(); g.globalAlpha = 1;
    g.fillStyle = '#f4efe2'; for (const [x, y] of [[hx + R * 0.22, hy], [hx + R * 0.5, hy - R * 0.28], [hx + R * 0.78, hy], [hx + R * 0.5, hy + R * 0.28]]) g.fillRect(x - 9, y - 9, 18, 18);
    for (let i = 0; i < 160; i++) { const x = r() * W, y = r() * H, rr = 8 + r() * 40; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(160,130,80,0.45)'); gr.addColorStop(1, 'rgba(160,130,80,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    ft.needsUpdate = true; }
  const field = new THREE.Mesh(new THREE.PlaneGeometry(FL, FW), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.92 })); field.rotation.x = -Math.PI / 2; field.position.y = 0.005; field.receiveShadow = true; G.add(field);
  // hàng rào gỗ ngoại sân (2 biên dài + cuối phải) có biển quảng cáo hư cấu
  const ads = ['HANK\'S HARDWARE', 'LAKESIDE PIZZA', 'ROSIE\'S DINER', 'BIG AL\'S TIRES', 'MAPLE ST. ICE CREAM', 'NORTH SIDE LUMBER'];
  const adCols = [['#1f3b73', '#ffd27a'], ['#b8321e', '#fff2d6'], ['#2f6b3a', '#fff'], ['#f2c14e', '#2b1d0e'], ['#f4a6b8', '#5a1f2e'], ['#5a3b22', '#ffe2b0']];
  const fenceW = woodTex('#8a5a34', 21, [1, 1]); let ai = 0;
  const fence = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(L / 8); for (let i = 0; i < n; i++) { const k0 = i / n, k1 = (i + 1) / n; const cx = x0 + (x1 - x0) * (k0 + k1) / 2, cz = z0 + (z1 - z0) * (k0 + k1) / 2;
      const [bg, fg] = adCols[ai % adCols.length]; const txt = ads[ai++ % ads.length]; const useAd = i % 2 === 0;
      const tx = useAd ? ctex(512, 160, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 512, 160); g.fillStyle = fg; g.font = '900 58px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 256, 84); g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(10, 10, 492, 140); }) : fenceW;
      const p = new THREE.Mesh(new THREE.BoxGeometry(L / n, 2.4, 0.15), [std('#7a4a28'), std('#7a4a28'), std('#7a4a28'), std('#7a4a28'), std('#fff', { map: tx }), std('#fff', { map: fenceW })]);
      p.position.set(cx, 1.2, cz); p.rotation.y = -Math.atan2(z1 - z0, x1 - x0); p.castShadow = true; G.add(p); } };
  const fz = FW / 2 + 9, fx = FL / 2 + 8; fence(-fx, -fz, fx, -fz); fence(fx, fz, -fx, fz); fence(fx, -fz, fx, fz);
  // lưới chắn sau end zone trái (gôn nhà)
  const chain = ctex(64, 64, (g) => { g.clearRect(0, 0, 64, 64); g.strokeStyle = 'rgba(200,205,210,0.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 32); g.lineTo(32, 0); g.lineTo(64, 32); g.lineTo(32, 64); g.closePath(); g.stroke(); }, [40, 8]);
  const net = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), new THREE.MeshStandardMaterial({ map: chain, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.4 })); net.position.set(-FL / 2 - 7, 4, 0); net.rotation.y = Math.PI / 2; G.add(net);
  for (let z = -20; z <= 20; z += 5) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8, 8), std('#9aa0a6', { metalness: 0.6, roughness: 0.4 })); p.position.set(-FL / 2 - 7, 4, z); G.add(p); }
  // ghế băng nhôm 2 bên + khán giả áo hè
  const U = { uT: { value: 0 }, uCheer: { value: 0.25 }, uSleep: { value: 0 }, uBoo: { value: 0 } };
  bleachers(G, -1, { U, fill: 0.85, seed: 61, rows: 6, len: 46, z0: -(FW / 2 + 4), seatColor: '#c9ccd1', frameColor: '#7d838a', banner: 'GO BEARS', bannerBg: CHI.navy, bannerFg: '#ffd27a',
    shirts: [CHI.orange, CHI.navy, '#ffffff', '#e64100', '#2f6b9a', '#f2c14e', '#7a4a24', CHI.navy], skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#5a3a28', '#e8b98f'], pants: ['#2b3a55', '#c9b38a', '#56627a'], hats: [CHI.navy, CHI.orange, '#ffffff'] });
  bleachers(G, 1, { U, fill: 0.6, seed: 83, rows: 5, len: 40, z0: FW / 2 + 4, seatColor: '#c9ccd1', frameColor: '#7d838a', banner: 'GO GLOVES', bannerBg: '#7a4a24', bannerFg: '#f4efe2',
    shirts: ['#7a4a24', '#c9874a', '#ffffff', '#f2c14e', '#2f6b3a'], skins: ['#f1c9a5', '#c68c5f', '#8d5a3b', '#e8b98f'], pants: ['#2b3a55', '#c9b38a'], hats: ['#7a4a24', '#f2c14e'] });
  // nhà dân + cây + cột điện
  const r = rnd(33); const sidings = ['#d9c7a3', '#a9c2d6', '#e8e1d0', '#c98f7a', '#9fb59a', '#e6d39a'], roofs = ['#4a3a34', '#3b4a5a', '#5a3b2b'];
  for (let i = 0; i < 22; i++) { const side = i % 2 ? 1 : -1; const x = -90 + i * 8.5 + r() * 2; const z = side * (fz + 24 + r() * 8); const h = house(7 + r() * 3, 7, 4.5 + r() * 2, sidings[i % 6], roofs[i % 3], i + 1); h.position.set(x, 0, z); h.rotation.y = side > 0 ? Math.PI : 0; G.add(h); }
  const tsp = []; for (let i = 0; i < 160; i++) { const a = r() * Math.PI * 2, d = 90 + r() * 200; const x = Math.cos(a) * d * 1.2, z = Math.sin(a) * d; if (Math.abs(z) < fz + 32 && Math.abs(x) < 100) continue; tsp.push([x, z, 0.9 + r() * 0.8]); }
  for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1; tsp.push([-95 + i * 7.5, side * (fz + 14 + r() * 4), 0.9 + r() * 0.5]); }
  for (let i = 0; i < 8; i++) tsp.push([fx + 10 + r() * 20, -30 + i * 8, 1 + r() * 0.5]);
  trees(G, tsp, 4);
  const poleM = std('#5a4632'); const wireM = new THREE.LineBasicMaterial({ color: '#1a1a1a' }); const pts = [];
  for (let i = 0; i < 9; i++) { const x = -100 + i * 25; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 10, 8), poleM); p.position.set(x, 5, -(fz + 18)); G.add(p); const cb = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 2.4), poleM); cb.position.set(x, 9.4, -(fz + 18)); G.add(cb); pts.push(x); }
  for (const dz of [-1, 0, 1]) { const curve = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k <= 8; k++) { const x = pts[i] + 25 * k / 8; curve.push(new THREE.Vector3(x, 9.5 - Math.sin(Math.PI * k / 8) * 0.7, -(fz + 18) + dz)); } G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve), wireM)); }
  // bảng điểm lật trên hàng rào cuối phải; lều bình luận sau ghế băng nhà
  const SB = flipBoard(); SB.G.position.set(fx + 0.5, 0, -14); SB.G.rotation.y = -Math.PI / 2; G.add(SB.G);
  const TN = tent(); TN.position.set(-30, 0, -(FW / 2 + 4) - 13); G.add(TN);
  return { G, crowd: U, board: SB, tent: TN, update(t, o = {}) { U.uT.value = t; U.uCheer.value = o.cheer ?? 0.25; U.uBoo.value = o.boo ?? 0; } };
}
export function sandlotLights(scene) {
  const hemi = new THREE.HemisphereLight('#ffd9c2', '#6b5a3a', 1.7); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffb36b', 3.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#9fb4ff', 0.9); fill.position.set(-30, 20, 30); scene.add(fill);
  const follow = (cam) => { const d = new THREE.Vector3(); cam.getWorldDirection(d); const x = cam.position.x + d.x * 10, z = cam.position.z + d.z * 10; key.target.position.set(x, 0, z); key.position.set(x + 60, 18, z - 20); };
  return { hemi, key, fill, follow };
}

// ---------- găng bóng chày có mặt ----------
// Cao ~2,4 m, đứng trên cổ găng (cuff). Mặt trước (+z) là lòng găng (pocket) = "miệng". 4 ngón trên đỉnh + ngón cái bên trái.
// update(t, {look:[x,y], blink, squint, brow, browUp, close(0 mở..1 khép), hop, squash, lean, clap})
// pocket(): toạ độ thế giới chỗ bóng nằm khi bắt.
export function makeGlove(o = {}) {
  const P = Object.assign({ number: 1, seed: 1, leather: '#9a5426', dark: '#5e2f14', lace: '#e8c99a' }, o);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const lm = std(P.leather, { roughness: 0.55 }), dm = std(P.dark, { roughness: 0.6 }), la = std(P.lace, { roughness: 0.7 });
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.5, 20), dm); cuff.position.y = 0.25; body.add(cuff);
  const numT = ctex(256, 128, (g) => { g.clearRect(0, 0, 256, 128); g.fillStyle = '#f4efe2'; g.font = '900 100px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(P.number), 128, 68); });
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.21), new THREE.MeshBasicMaterial({ map: numT, transparent: true })); nm.position.set(0, 0.26, 0.49); body.add(nm);
  const palmG = new THREE.Group(); palmG.position.y = 0.5; body.add(palmG);
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 20), lm); palm.scale.set(1.0, 1.15, 0.55); palm.position.y = 0.66; palmG.add(palm);
  const pocket = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), std('#7a3e1a', { roughness: 0.6 })); pocket.rotation.x = Math.PI / 2; pocket.scale.set(1.0, 0.22, 1.0); pocket.position.set(0, 0.52, 0.3); palmG.add(pocket);
  // ngón: 4 ngón trên đỉnh, chốt ở mép trên lòng găng, xoay quanh trục x để khép về phía trước
  const fingers = [-0.42, -0.14, 0.14, 0.42].map((x, i) => { const piv = new THREE.Group(); piv.position.set(x, 1.25, 0); palmG.add(piv);
    const len = [0.7, 0.85, 0.82, 0.68][i]; const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, len, 6, 14), lm); f.position.y = len / 2 + 0.05; f.scale.z = 0.8; piv.add(f);
    const ls = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), la); ls.position.set(0, len + 0.18, 0); ls.rotation.y = Math.PI / 2; piv.add(ls);
    for (let k = 0; k < 3; k++) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.02), la); st.position.set(0, 0.2 + k * len * 0.3, 0.12); piv.add(st); }
    piv.rotation.z = (x) * 0.25; return piv; });
  const thumb = new THREE.Group(); thumb.position.set(-0.55, 0.55, 0.05); palmG.add(thumb); const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.6, 6, 14), lm); th.position.y = 0.35; thumb.add(th); thumb.rotation.z = 0.9;
  // màng lưới giữa ngón cái và ngón trỏ
  const web = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.45), new THREE.MeshStandardMaterial({ map: ctex(64, 64, (g) => { g.fillStyle = P.dark; g.fillRect(0, 0, 64, 64); g.strokeStyle = P.lace; g.lineWidth = 5; for (let i = 0; i < 64; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 64); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(64, i); g.stroke(); } }), side: THREE.DoubleSide, roughness: 0.7 }));
  web.position.set(-0.55, 1.15, 0.05); web.rotation.z = 0.5; palmG.add(web);
  // viền dây buộc quanh lòng găng
  for (let k = 0; k < 18; k++) { const a = (k / 18) * Math.PI * 2; const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.03), la); s.position.set(Math.cos(a) * 0.6, 0.66 + Math.sin(a) * 0.7, 0.2 + 0.12 * (1 - Math.abs(Math.sin(a)))); s.rotation.z = a; palmG.add(s); }
  // mắt trên phần gò bàn tay phía trên lòng găng, lông mày = dây buộc
  const eyes = [-1, 1].map((k) => { const e = new THREE.Group(); e.position.set(k * 0.2, 1.05, 0.3); palmG.add(e);
    const wht = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 14), std('#ffffff', { roughness: 0.3 })); wht.scale.z = 0.6; e.add(wht);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), std('#111')); pup.position.z = 0.07; e.add(pup);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), lm); lid.scale.z = 0.65; e.add(lid);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.18, 4, 8), la); brow.rotation.z = Math.PI / 2; brow.position.set(0, 0.2, 0.05); e.add(brow); return { pup, lid, brow }; });
  root.traverse((x) => { if (x.isMesh) x.castShadow = true; });
  const update = (t, s = {}) => { const sd = P.seed; const hop = s.hop || 0; const sq = s.squash || 0;
    body.position.y = hop; body.scale.set(1 + sq * 0.15, 1 - sq * 0.2, 1 + sq * 0.15);
    body.rotation.z = (s.lean || 0) + 0.03 * Math.sin(t * 1.4 + sd); body.rotation.x = 0.03 * Math.sin(t * 1.1 + sd * 2);
    const cl = s.close ?? (0.15 + 0.08 * Math.sin(t * 2 + sd)); const clap = s.clap ? Math.max(0, Math.sin(t * 14)) : 0;
    fingers.forEach((f, i) => { f.rotation.x = (cl + clap * 0.6) * 1.35 + 0.05 * Math.sin(t * 3 + i); }); thumb.rotation.y = -(cl + clap * 0.6) * 0.9;
    const lk = s.look || [Math.sin(t * 0.7 + sd) * 0.4, 0]; const bl = s.blink ?? ((t * 0.6 + sd * 0.37) % 3.1 < 0.12 ? 1 : 0);
    eyes.forEach(({ pup, lid, brow }, i) => { pup.position.x = lk[0] * 0.05; pup.position.y = lk[1] * 0.04; lid.rotation.x = -Math.PI * (0.05 + 0.45 * Math.max(bl, s.squint || 0)); brow.rotation.z = Math.PI / 2 + (s.brow || 0) * (i ? -1 : 1); brow.position.y = 0.2 + (s.browUp || 0) * 0.04; });
  };
  update(0);
  const pk = new THREE.Vector3(0, 0.5 + 0.62, 0.42);
  return { root, body, update, pocket: () => body.localToWorld(pk.clone()) };
}
