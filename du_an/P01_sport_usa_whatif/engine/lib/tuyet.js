// Tập 5 — sân bóng rổ ngoài trời mùa đông bên hồ: tuyết phủ, mặt sân đóng băng chỗ trơn, rổ ngoài trời có tuyết đọng,
// đống tuyết viền sân, cây trơ trụi, đèn đường, hồ đóng băng, dãy nhà cao tầng mờ (chung chung, không toà nhà thật),
// bảng điểm "băng giá" (canvas), tuyết rơi (Points, hàm thuần theo t), người tuyết có điều khiển (sway/tay/mắt/tan/nhún).
import * as THREE from 'three';
import { hoop, canvasTex } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
export const CT = { L: 28, W: 15 }; // mặt sân (m)
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// ---------- mặt sân: nhựa xanh xám, vùng sơn xanh nhạt, vạch trắng, mảng tuyết viền + băng loang ----------
function courtTex() {
  const S = 80, W = Math.round(CT.L * S), H = Math.round(CT.W * S);
  return canvasTex(W, H, (g) => {
    g.fillStyle = '#4f6a86'; g.fillRect(0, 0, W, H);
    const r = rnd(11); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.03 + r() * 0.04})`; g.fillRect(r() * W, r() * H, 2 + r() * 3, 2 + r() * 3); }
    const X = (m) => W / 2 + m * S, Y = (m) => H / 2 + m * S;
    g.fillStyle = '#7f9fbf'; for (const d of [-1, 1]) { const bx = X(d * 14), kx = X(d * (14 - 5.8)); g.fillRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S); }
    g.strokeStyle = '#f4f7fb'; g.lineWidth = 0.06 * S;
    g.strokeRect(X(-14) + 4, Y(-7.5) + 4, W - 8, H - 8); g.beginPath(); g.moveTo(X(0), Y(-7.5)); g.lineTo(X(0), Y(7.5)); g.stroke();
    g.beginPath(); g.arc(X(0), Y(0), 1.8 * S, 0, Math.PI * 2); g.stroke();
    for (const d of [-1, 1]) {
      const bx = X(d * 14), kx = X(d * (14 - 5.8)); g.strokeRect(Math.min(bx, kx), Y(-2.45), Math.abs(bx - kx), 4.9 * S);
      g.beginPath(); g.arc(kx, Y(0), 1.8 * S, d > 0 ? Math.PI / 2 : -Math.PI / 2, d > 0 ? Math.PI * 1.5 : Math.PI / 2); g.stroke();
      const rx = X(d * (14 - 1.6)); g.beginPath(); g.moveTo(bx, Y(-6.6)); g.lineTo(X(d * (14 - 4.3)), Y(-6.6));
      g.arc(rx, Y(0), 6.75 * S, d > 0 ? Math.PI + 1.36 : -1.36, d > 0 ? Math.PI - 1.36 : 1.36, d > 0); g.lineTo(bx, Y(6.6)); g.stroke();
    }
    // tuyết dồn ở mép + vệt tuyết lốm đốm
    const r2 = rnd(31);
    for (let i = 0; i < 260; i++) { const edge = r2() < 0.7; let x, y; if (edge) { const side = Math.floor(r2() * 4); x = side < 2 ? r2() * W : (side === 2 ? r2() * 0.08 * W : W - r2() * 0.08 * W); y = side >= 2 ? r2() * H : (side === 0 ? r2() * 0.12 * H : H - r2() * 0.12 * H); } else { x = r2() * W; y = r2() * H; }
      const rr = (edge ? 30 : 12) + r2() * (edge ? 90 : 40); const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(246,249,252,${edge ? 0.95 : 0.6})`); gr.addColorStop(1, 'rgba(246,249,252,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    // băng loang (sáng hơn, ánh xanh)
    for (let i = 0; i < 18; i++) { const x = r2() * W, y = r2() * H, rx = 60 + r2() * 160, ry = 30 + r2() * 90; const gr = g.createRadialGradient(x, y, 0, x, y, rx); gr.addColorStop(0, 'rgba(200,228,245,0.42)'); gr.addColorStop(1, 'rgba(200,228,245,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rx, ry, r2() * 3, 0, 7); g.fill(); }
  });
}
function roughTex() { // băng = nhẵn bóng (tối), nhựa/tuyết = nhám (sáng)
  return canvasTex(560, 300, (g, W, H) => { g.fillStyle = '#d0d0d0'; g.fillRect(0, 0, W, H); const r = rnd(77);
    for (let i = 0; i < 22; i++) { const x = r() * W, y = r() * H, rr = 15 + r() * 45; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, '#1a1a1a'); gr.addColorStop(1, 'rgba(208,208,208,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); } });
}
// ---------- tuyết đọng: khối cầu dẹt có nhiễu đỉnh ----------
const snowMat = () => std('#f3f6fa', { roughness: 0.92, emissive: '#1c2430', emissiveIntensity: 0.12 });
function lump(rx, ry, rz, seed = 1, seg = 20) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7)); const p = g.attributes.position; const r = rnd(seed * 97 + 3); const ph = [r() * 6, r() * 6, r() * 6];
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = 1 + 0.08 * Math.sin(x * 3.1 + ph[0]) * Math.sin(z * 2.7 + ph[1]) + 0.05 * Math.sin(y * 4 + ph[2]);
    p.setXYZ(i, x * rx * n, Math.max(-0.05, y) * ry * n, z * rz * n); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, snowMat()); m.castShadow = m.receiveShadow = true; return m;
}
// ---------- cây trơ trụi (đệ quy), tuyết trên cành ----------
function bareTree(seed = 1, h = 7) {
  const G = new THREE.Group(); const r = rnd(seed * 131 + 7); const bark = std('#3b3029', { roughness: 0.95 }), snow = snowMat();
  const branch = (p, dir, len, rad, lvl) => {
    const end = p.clone().addScaledVector(dir, len); const c = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.65, rad, len, 6), bark);
    c.position.copy(p).add(end).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); c.castShadow = true; G.add(c);
    if (lvl > 0 && dir.y < 0.95) { const s = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.5, rad * 0.75, len * 0.8, 6, 1, false, 0, Math.PI), snow); s.position.copy(c.position); s.position.y += rad * 0.55; s.quaternion.copy(c.quaternion); G.add(s); }
    if (lvl >= 3) return; const n = lvl === 0 ? 4 : 3;
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, tilt = 0.45 + r() * 0.5; const d = new THREE.Vector3(Math.cos(a) * Math.sin(tilt), Math.cos(tilt), Math.sin(a) * Math.sin(tilt)).lerp(dir, 0.35).normalize();
      branch(p.clone().lerp(end, 0.55 + r() * 0.45), d, len * (0.55 + r() * 0.2), rad * 0.6, lvl + 1); }
  };
  branch(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), h * 0.42, 0.22, 0); return G;
}
// ---------- đèn đường ----------
function lampPost() {
  const G = new THREE.Group(); const m = std('#23272e', { metalness: 0.6, roughness: 0.4 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 5.2, 10), m); pole.position.y = 2.6; G.add(pole);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.06), m); arm.position.set(0.4, 5.15, 0); G.add(arm);
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.24, 12), std('#fff1cf', { emissive: '#ffd890', emissiveIntensity: 2.2 })); lamp.position.set(0.8, 5.05, 0); G.add(lamp);
  const cap = lump(0.25, 0.08, 0.22, 3, 10); cap.position.set(0.8, 5.2, 0); G.add(cap);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
// ---------- thành phố bên kia hồ: nhiều kiểu nhà (kính có khung, văn phòng ô cửa, gạch có bồn nước, tháp bậc thang art-deco),
// mái có tuyết, thiết bị mái, ăng-ten đèn đỏ, bờ kè + đường ven hồ. Thiết kế chung, không mô phỏng toà nhà thật.
const FLOOR = 3.6;
function facade(kind, seed) { // 1 ô texture = 8 m ngang × 6 tầng; trả {map, emi}
  const r = rnd(seed * 59 + 11), PX = 32; const W = 8 * PX, H = Math.round(6 * FLOOR * PX);
  const pal = { glass: ['#6f8aa6', '#5b7590', '#86a2bc'], office: ['#c9c2b4', '#b7b2a8', '#d6d0c4'], brick: ['#8a4b38', '#7a4232', '#94573f'], deco: ['#d8cfbd', '#c4b9a4', '#e2dccd'], dark: ['#3b4552', '#454f5c', '#323b46'] }[kind];
  const base = pal[seed % pal.length]; const lit = []; 
  const map = canvasTex(W, H, (g) => { g.fillStyle = base; g.fillRect(0, 0, W, H);
    if (kind === 'glass' || kind === 'dark') { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, 'rgba(255,255,255,0.18)'); gr.addColorStop(0.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(20,30,45,0.25)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let f = 0; f < 6; f++) { const y = f * FLOOR * PX; g.fillStyle = kind === 'glass' ? '#40556b' : '#252c35'; g.fillRect(0, y, W, 0.35 * PX);
        for (let c = 0; c < 8; c++) { const x = c * PX; g.fillStyle = 'rgba(30,40,52,0.9)'; g.fillRect(x, y, 2, FLOOR * PX); if (r() < 0.22) { lit.push([x + 2, y + 0.35 * PX, PX - 2, (FLOOR - 0.35) * PX]); g.fillStyle = 'rgba(255,214,150,0.55)'; g.fillRect(x + 2, y + 0.35 * PX, PX - 2, (FLOOR - 0.35) * PX); } } } }
    else { const ww = kind === 'brick' ? 0.9 : 1.2, wh = kind === 'brick' ? 1.6 : 1.9, sp = kind === 'brick' ? 2.0 : 1.6;
      if (kind === 'brick') { for (let y = 0; y < H; y += 3) { g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.06})`; g.fillRect(0, y, W, 1); } }
      if (kind === 'deco') { for (let x = 0; x < W; x += sp * PX) { g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(x + (sp - 0.25) * PX, 0, 0.25 * PX, H); } }
      for (let f = 0; f < 6; f++) { const y0 = f * FLOOR * PX + (FLOOR - wh) * 0.55 * PX; g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, f * FLOOR * PX, W, 0.18 * PX);
        for (let x = (sp - ww) / 2 * PX; x < W - 2; x += sp * PX) { const on = r() < 0.3; g.fillStyle = on ? '#f3cf8c' : (kind === 'brick' ? '#2b2a2e' : '#34404e'); g.fillRect(x, y0, ww * PX, wh * PX);
          g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x, y0, ww * PX, 3); g.fillStyle = kind === 'brick' ? '#cfc6b8' : 'rgba(0,0,0,0.25)'; g.fillRect(x - 2, y0 + wh * PX, ww * PX + 4, 3); if (on) lit.push([x, y0, ww * PX, wh * PX]); } } } });
  const emi = canvasTex(W, H, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffcf8a'; for (const [x, y, w, h] of lit) g.fillRect(x, y, w, h); });
  for (const t of [map, emi]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; } return { map, emi };
}
const FAC = {}; const facOf = (k, i) => (FAC[k + i] ??= facade(k, i + 1));
function boxTex(w, h, d, kind, vi) { // khối có texture lặp theo kích thước thật, mặt trên/dưới trơn
  const F = facOf(kind, vi % 3); const mk = (len) => { const m = F.map.clone(), e = F.emi.clone(); m.needsUpdate = e.needsUpdate = true; m.repeat.set(len / 8, h / (6 * FLOOR)); e.repeat.copy(m.repeat); m.offset.set((vi * 0.37) % 1, 0); e.offset.copy(m.offset);
    return new THREE.MeshStandardMaterial({ map: m, emissive: '#ffffff', emissiveMap: e, emissiveIntensity: 0.55, roughness: kind === 'glass' || kind === 'dark' ? 0.25 : 0.85, metalness: kind === 'glass' || kind === 'dark' ? 0.35 : 0.02 }); };
  const top = std('#7d8590', { roughness: 0.9 }); const sx = mk(d), sz = mk(w);
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [sx, sx, top, top, sz, sz]);
}
function roofKit(G, w, d, y, r, kind) { // tuyết mái + gờ mái + thiết bị
  const snow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.35, d * 0.98), std('#f2f6fb', { roughness: 0.95 })); snow.position.y = y + 0.17; G.add(snow);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.6, d + 0.5), std(kind === 'brick' ? '#6e3a2c' : '#8a9099', { roughness: 0.7 })); lip.position.y = y - 0.3; G.add(lip);
  const n = 1 + Math.floor(r() * 3); for (let i = 0; i < n; i++) { const bw = 2 + r() * 3, bh = 1.2 + r() * 1.8; const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw * 0.8), std('#9aa1aa', { roughness: 0.6, metalness: 0.3 }));
    b.position.set((r() - 0.5) * (w - bw), y + bh / 2, (r() - 0.5) * (d - bw)); G.add(b); const sc = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.2, bw * 0.8), std('#f2f6fb')); sc.position.set(b.position.x, y + bh + 0.1, b.position.z); G.add(sc); }
  if (kind === 'brick' && r() < 0.8) { const wt = new THREE.Group(); const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.6, 16), std('#6b4f38', { roughness: 0.9 })); tank.position.y = 3.3; wt.add(tank);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.55, 1.1, 16), std('#f2f6fb', { roughness: 0.95 })); cone.position.y = 5.15; wt.add(cone);
    for (const [a, b2] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 5), std('#2b2b2b')); l.position.set(a * 0.9, 1.0, b2 * 0.9); wt.add(l); }
    wt.position.set((r() - 0.5) * w * 0.4, y, (r() - 0.5) * d * 0.4); G.add(wt); }
}
const RED = new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#ff2a1a', emissiveIntensity: 3 });
function building(kind, w, d, h, r, vi) {
  const G = new THREE.Group(); let y = 0, cw = w, cd = d;
  const tiers = kind === 'deco' ? 3 : (kind === 'glass' && r() < 0.5 ? 2 : 1);
  for (let k = 0; k < tiers; k++) { const th = tiers === 1 ? h : h * [0.55, 0.28, 0.17][k] * (tiers === 2 ? [1.2, 1.6][k] / 1.2 : 1); const b = boxTex(cw, th, cd, kind, vi + k); b.position.y = y + th / 2; G.add(b); y += th;
    roofKit(G, cw, cd, y, r, kind); if (k < tiers - 1) { cw *= 0.72; cd *= 0.72; } }
  if (kind === 'deco') { const crown = new THREE.Mesh(new THREE.CylinderGeometry(cw * 0.15, cw * 0.42, cw * 0.9, 4), std('#c9b98f', { roughness: 0.4, metalness: 0.5 })); crown.rotation.y = Math.PI / 4; crown.position.y = y + cw * 0.45; G.add(crown); y += cw * 0.9; }
  if (h > 70 || kind === 'deco') { const mh = 8 + r() * 10; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.35, mh, 6), std('#c9ced6', { metalness: 0.7, roughness: 0.3 })); m.position.y = y + mh / 2; G.add(m);
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), RED); l.position.y = y + mh; G.add(l); }
  return G;
}
function skyline() {
  const G = new THREE.Group(); const r = rnd(5); let vi = 0;
  // bờ kè đá + dải tuyết + đường ven hồ có cột đèn
  const wall = new THREE.Mesh(new THREE.BoxGeometry(900, 2.2, 3), std('#8b8f96', { roughness: 0.9 })); wall.position.set(0, 0.6, -313); G.add(wall);
  const bank = new THREE.Mesh(new THREE.BoxGeometry(900, 0.4, 14), std('#eef2f7', { roughness: 0.95 })); bank.position.set(0, 1.7, -321); G.add(bank);
  const road = new THREE.Mesh(new THREE.BoxGeometry(900, 0.42, 8), std('#4a4f57', { roughness: 0.8 })); road.position.set(0, 1.72, -331); G.add(road);
  for (let x = -420; x <= 420; x += 16) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 7, 6), std('#2a2e35')); p.position.set(x, 5.4, -326); G.add(p);
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), std('#fff1cf', { emissive: '#ffd890', emissiveIntensity: 2.5 })); l.position.set(x, 9, -326); G.add(l); }
  const rows = [{ z: -345, n: 30, h: [18, 45], kinds: ['brick', 'office', 'brick', 'office', 'glass'] }, { z: -380, n: 26, h: [50, 120], kinds: ['glass', 'office', 'deco', 'dark', 'glass', 'office'] }, { z: -425, n: 20, h: [90, 190], kinds: ['glass', 'dark', 'deco', 'glass'] }];
  for (const R of rows) { let x = -380; for (let i = 0; i < R.n && x < 380; i++) { const kind = R.kinds[Math.floor(r() * R.kinds.length)]; const w = 14 + r() * 16, d = 14 + r() * 12; let h = R.h[0] + r() * (R.h[1] - R.h[0]);
      if (Math.abs(x) < 110 && R.z < -370) h *= 1.3; // trung tâm cao hơn
      const b = building(kind, w, d, h, r, vi++); b.position.set(x + w / 2, 1.9, R.z - r() * 10); b.rotation.y = (r() - 0.5) * 0.08; G.add(b); x += w + 2 + r() * 8; } }
  return G;
}
// ---------- trời mùa đông chiều muộn ----------
function skyDome() {
  const t = canvasTex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#6f86a8'); gr.addColorStop(0.42, '#a9b9cf'); gr.addColorStop(0.5, '#e2c9c4'); gr.addColorStop(0.56, '#f0dccf'); gr.addColorStop(1, '#f0dccf'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const m = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })); return m;
}
// ---------- bảng điểm băng giá ----------
export function scoreboard() {
  const G = new THREE.Group(); const tex = canvasTex(1024, 512, (g, W, H) => { g.fillStyle = '#0d1a2b'; g.fillRect(0, 0, W, H); });
  const post = std('#2a2f38', { metalness: 0.5, roughness: 0.5 });
  for (const x of [-1.5, 1.5]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.2, 0.16), post); p.position.set(x, 2.1, -0.05); G.add(p); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(4.3, 2.3, 0.28), std('#1c222b', { metalness: 0.4, roughness: 0.45 })); fr.position.set(0, 4.1, -0.1); G.add(fr);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.0), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); sc.position.set(0, 4.1, 0.05); G.add(sc);
  const ice = std('#d8ecf8', { roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.05 + (i % 3) * 0.02, 0.18 + (i * 37 % 5) * 0.06, 6), ice); c.rotation.x = Math.PI; c.position.set(-2.0 + i * 0.5, 2.85 - (0.09 + (i * 37 % 5) * 0.03), 0.08); G.add(c); }
  const cap = lump(2.3, 0.16, 0.22, 9, 16); cap.position.set(0, 5.25, -0.1); G.add(cap);
  G.traverse((o) => { if (o.isMesh && o !== sc) o.castShadow = true; }); G.userData.tex = tex; return G;
}

export function buildSnowCourt(scene) {
  scene.background = new THREE.Color('#b9c6d8'); scene.fog = new THREE.Fog('#cfd5df', 60, 720); scene.add(skyDome());
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), std('#eef2f7', { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; scene.add(ground);
  const ct = new THREE.Mesh(new THREE.BoxGeometry(CT.L + 2, 0.06, CT.W + 2), [std('#55687d'), std('#55687d'), new THREE.MeshStandardMaterial({ map: courtTex(), roughnessMap: roughTex(), roughness: 0.85, metalness: 0.08 }), std('#55687d'), std('#55687d'), std('#55687d')]);
  // mặt trên BoxGeometry: nhóm 2 (+y). Texture phủ phần sân L×W, viền ngoài 1 m: dùng repeat/offset để vạch nằm đúng
  const top = ct.material[2]; top.map.repeat.set((CT.L + 2) / CT.L, (CT.W + 2) / CT.W); top.map.offset.set(-1 / CT.L, -1 / CT.W); top.map.wrapS = top.map.wrapT = THREE.ClampToEdgeWrapping;
  top.roughnessMap.repeat.copy(top.map.repeat); top.roughnessMap.offset.copy(top.map.offset);
  ct.position.y = -0.03 + 0.0; ct.receiveShadow = true; scene.add(ct);
  // rổ ngoài trời (đệm xám thép) + tuyết đọng nóc bảng
  const hoops = [hoop(1, { pad: '#3a4250' }), hoop(-1, { pad: '#3a4250' })]; hoops[0].position.set(CT.L / 2 - 1.22, 0, 0); hoops[1].position.set(-(CT.L / 2 - 1.22), 0, 0);
  hoops.forEach((h, i) => { const c = lump(0.12, 0.07, 0.95, 20 + i, 14); c.position.set(0, 4.25, 0); h.add(c); const c2 = lump(0.8, 0.12, 0.7, 30 + i, 14); c2.position.set(2.6, 1.12, 0); h.add(c2); scene.add(h); });
  // đống tuyết viền sân
  const r = rnd(41); const B = new THREE.Group(); scene.add(B);
  for (let i = 0; i < 46; i++) { const side = i % 4, u = r(); let x, z; const L2 = CT.L / 2 + 2.4, W2 = CT.W / 2 + 2.4;
    if (side < 2) { x = -L2 + u * 2 * L2; z = side ? W2 + r() * 1.5 : -W2 - r() * 1.5; } else { z = -W2 + u * 2 * W2; x = side === 2 ? L2 + r() * 1.5 : -L2 - r() * 1.5; }
    if (Math.abs(x) < 3.5 && z < 0) continue; // chừa chỗ bảng điểm
    const m = lump(1.2 + r() * 1.6, 0.5 + r() * 0.7, 0.9 + r() * 1.2, i + 1); m.position.set(x, 0, z); m.rotation.y = r() * 3; B.add(m); }
  // hàng rào lưới thấp + cột
  const fm = std('#3a404a', { metalness: 0.5, roughness: 0.5 }); for (let i = 0; i <= 12; i++) { const x = -CT.L / 2 - 3 + i * (CT.L + 6) / 12; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), fm); p.position.set(x, 1.1, -CT.W / 2 - 5.2); p.castShadow = true; scene.add(p); }
  { const net = canvasTex(64, 64, (g) => { g.strokeStyle = 'rgba(70,78,90,0.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(64, 64); g.moveTo(64, 0); g.lineTo(0, 64); g.stroke(); }, [80, 5]);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(CT.L + 6, 2.1), new THREE.MeshStandardMaterial({ map: net, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, roughness: 0.6 })); f.position.set(0, 1.1, -CT.W / 2 - 5.2); scene.add(f); }
  // cây, đèn đường
  [[-20, -12], [-17, 10], [19, -13], [21, 9], [-24, 2], [25, -2], [-9, 13.5], [8, 14], [2, -16.5], [-14, -17]].forEach(([x, z], i) => { const t = bareTree(i + 1, 6 + (i % 3)); t.position.set(x, 0, z); t.rotation.y = i; scene.add(t); });
  const lamps = [[-10, -CT.W / 2 - 2.6], [10, -CT.W / 2 - 2.6], [-10, CT.W / 2 + 2.6], [10, CT.W / 2 + 2.6]].map(([x, z]) => { const l = lampPost(); l.position.set(x, 0, z); l.rotation.y = z < 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(l); return l; });
  // hồ đóng băng phía -z sau hàng rào + bờ, dãy nhà xa phía bên kia hồ
  const lake = new THREE.Mesh(new THREE.PlaneGeometry(900, 290), std('#b6cfe0', { roughness: 0.12, metalness: 0.15 })); lake.rotation.x = -Math.PI / 2; lake.position.set(0, 0.005, -169); lake.receiveShadow = true; scene.add(lake);
  scene.add(skyline());
  // bảng điểm sau đường biên -z, giữa sân
  const sb = scoreboard(); sb.position.set(0, 0, -CT.W / 2 - 3.2); scene.add(sb);
  return { hoops, sbTex: sb.userData.tex, sb, lamps };
}

export function snowLights(scene) {
  const hemi = new THREE.HemisphereLight('#e4ecf8', '#ffffff', 2.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#fff0e2', 2.6); key.position.set(-14, 22, 12); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -20, right: 20, top: 14, bottom: -14, near: 1, far: 70 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight('#dbe6ff', 1.2); fill.position.set(12, 10, 16); scene.add(fill);
  return { hemi, key, fill };
}

// ---------- tuyết rơi: N bông trong hộp quanh tâm (cx,cz), rơi + đưa ngang, hàm thuần của t ----------
export function snowfall(scene, N = 5000, box = [60, 22, 44]) {
  const g = new THREE.BufferGeometry(); const p0 = new Float32Array(N * 4), pos = new Float32Array(N * 3); const r = rnd(3);
  for (let i = 0; i < N; i++) { p0[i * 4] = (r() - 0.5) * box[0]; p0[i * 4 + 1] = r() * box[1]; p0[i * 4 + 2] = (r() - 0.5) * box[2]; p0[i * 4 + 3] = r() * 6.28; }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sprite = canvasTex(32, 32, (c) => { const gr = c.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, 32, 32); });
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.06, map: sprite, transparent: true, depthWrite: false, opacity: 0.95, sizeAttenuation: true }));
  pts.frustumCulled = false; scene.add(pts);
  const tick = (t, cx = 0, cz = 0) => { for (let i = 0; i < N; i++) { const ph = p0[i * 4 + 3], sp = 0.9 + (ph % 1) * 0.6;
      let y = p0[i * 4 + 1] - t * sp; y = ((y % box[1]) + box[1]) % box[1];
      pos[i * 3] = cx + p0[i * 4] + Math.sin(t * 0.8 + ph) * 0.35 + t * 0.15; pos[i * 3 + 1] = y; pos[i * 3 + 2] = cz + p0[i * 4 + 2] + Math.cos(t * 0.6 + ph) * 0.25; }
    g.attributes.position.needsUpdate = true; };
  return { pts, tick };
}

// ---------- người tuyết ----------
// o: {number, scarf, hat, seed}. Trả về {root, update(t,ctl), hands(), ball anchor}
export function snowman(o = {}) {
  const P = Object.assign({ number: 1, scarf: '#d8323b', hat: '#2b6fd6', seed: 1, s: 1 }, o);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.scale.setScalar(P.s);
  const R = [0.58, 0.44, 0.31], Y = [0.5, 1.26, 1.86]; const parts = R.map((rr, i) => { const m = lump(rr, rr, rr, P.seed * 10 + i, 28); m.position.y = Y[i]; body.add(m); return m; });
  const head = new THREE.Group(); head.position.y = Y[2]; body.add(head); parts[2].position.y = 0; head.add(parts[2]);
  const coal = std('#16171a', { roughness: 0.6 });
  const eyes = [-1, 1].map((k) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), coal); e.position.set(k * 0.11, 0.08, 0.27); head.add(e); return e; });
  const pup = eyes.map((e) => { const p = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), std('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.6 })); p.position.set(0.012, 0.018, 0.038); e.add(p); return p; });
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 14), std('#f07a1a', { roughness: 0.55 })); nose.rotation.x = Math.PI / 2; nose.position.set(0, 0.0, 0.42); head.add(nose);
  const mouth = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), coal); head.add(m); mouth.push(m); }
  const setMouth = (smile) => mouth.forEach((m, i) => { const u = (i / 5 - 0.5) * 2; m.position.set(u * 0.12, -0.1 - (1 - u * u) * 0.05 * smile, 0.28 - Math.abs(u) * 0.03); });
  setMouth(1);
  const buttons = [0.15, 0.0, -0.15].map((yy) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), coal); b.position.set(0, Y[1] + yy, 0.43 - Math.abs(yy) * 0.35); body.add(b); return b; });
  // số áo vẽ bằng "than" trên bụng (dải trụ cong)
  const nt = canvasTex(256, 192, (g, W, H) => { g.clearRect(0, 0, W, H); g.font = '900 150px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 10; g.strokeStyle = '#ffffff'; g.strokeText(String(P.number), W / 2, H / 2 + 6); g.fillStyle = '#16171a'; g.fillText(String(P.number), W / 2, H / 2 + 6); });
  const num = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.46, 24, 1, true, -0.55, 1.1), new THREE.MeshStandardMaterial({ map: nt, transparent: true, alphaTest: 0.2, roughness: 0.7, side: THREE.FrontSide }));
  num.position.y = Y[0] + 0.05; body.add(num);
  // khăn quàng + đuôi khăn, mũ len có quả bông
  const sm = std(P.scarf, { roughness: 0.9 }); const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.065, 10, 28), sm); scarf.rotation.x = Math.PI / 2; scarf.position.y = -0.24; head.add(scarf);
  const tail = new THREE.Group(); tail.position.set(0.16, -0.28, 0.22); head.add(tail); const tl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.04), sm); tl.position.y = -0.2; tail.add(tl);
  const hat = new THREE.Group(); hat.position.y = 0.2; head.add(hat); const hm = std(P.hat, { roughness: 0.95 });
  const hb = new THREE.Mesh(new THREE.SphereGeometry(0.27, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hm); hb.scale.y = 0.95; hat.add(hb);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.045, 8, 24), std('#f4f4f4', { roughness: 0.95 })); rim.rotation.x = Math.PI / 2; hat.add(rim);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), std('#f4f4f4', { roughness: 1 })); pom.position.y = 0.27; hat.add(pom);
  // tay que + ngón que; vai ở thân giữa
  const wood = std('#5a3d26', { roughness: 0.9 }); const arms = [-1, 1].map((k) => { const sh = new THREE.Group(); sh.position.set(k * 0.38, Y[1] + 0.12, 0); body.add(sh);
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.8, 6), wood); a.position.y = 0.4; sh.add(a);
    for (const [ang, l] of [[0.5, 0.18], [-0.45, 0.16], [0.05, 0.14]]) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, l, 5), wood); f.position.set(Math.sin(ang) * l / 2, 0.8 + Math.cos(ang) * l / 2, 0); f.rotation.z = -ang; sh.add(f); }
    const tip = new THREE.Object3D(); tip.position.y = 0.86; sh.add(tip); sh.userData.tip = tip; sh.userData.k = k; return sh; });
  // vũng nước tan + giọt
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), std('#a9c7dc', { roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.8 })); puddle.rotation.x = -Math.PI / 2; puddle.position.y = 0.012; root.add(puddle);
  const drops = [0, 1, 2].map(() => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), std('#cfe6f5', { roughness: 0.05, transparent: true, opacity: 0.9 })); d.scale.y = 1.5; root.add(d); return d; });
  root.traverse((x) => { if (x.isMesh && x !== puddle) x.castShadow = true; });
  const sd = P.seed;
  // ctl: {sway, wave:[l,r] 0..1, raise:[l,r] -1..1 (giơ ngang = 0, lên = 1, xuống = -1), melt 0..1, hop m, look [x,y], blink, smile, lean}
  const update = (t, c = {}) => {
    const C = Object.assign({ sway: 1, wave: [0, 0], raise: [-0.35, -0.35], melt: 0, hop: 0, look: null, blink: null, smile: 1, lean: 0, reach: null }, c);
    const m = C.melt; body.position.y = C.hop + Math.abs(Math.sin(t * 2.2 + sd)) * 0.02 * C.sway;
    body.rotation.z = Math.sin(t * 1.3 + sd) * 0.05 * C.sway + m * 0.22 * (sd % 2 ? 1 : -1); body.rotation.x = C.lean + Math.sin(t * 1.1 + sd * 2) * 0.03 * C.sway;
    // tan: các khối dẹt + lún xuống
    parts[0].scale.set(1 + 0.25 * m, 1 - 0.45 * m, 1 + 0.25 * m); parts[0].position.y = Y[0] * (1 - 0.45 * m);
    parts[1].scale.set(1 + 0.12 * m, 1 - 0.3 * m, 1 + 0.12 * m); parts[1].position.y = Y[0] * 2 * (1 - 0.45 * m) + (Y[1] - Y[0] * 2) * (1 - 0.3 * m);
    const midY = parts[1].position.y; num.position.y = parts[0].position.y + 0.05; num.scale.set(1 + 0.25 * m, 1 - 0.45 * m, 1 + 0.25 * m);
    buttons.forEach((b, i) => { b.position.y = midY + [0.15, 0, -0.15][i] * (1 - 0.3 * m); });
    head.position.y = midY + (Y[2] - Y[1]) * (1 - 0.2 * m); head.rotation.z = m * 0.25 * (sd % 2 ? -1 : 1) + Math.sin(t * 1.7 + sd) * 0.04 * C.sway;
    head.rotation.y = (C.look ? C.look[0] : Math.sin(t * 0.7 + sd) * 0.3) * 0.6; head.rotation.x = -(C.look ? C.look[1] : 0) * 0.3;
    nose.rotation.z = m * 0.6; nose.position.y = -m * 0.05;
    puddle.scale.setScalar(0.15 + m * 1.1); puddle.material.opacity = 0.5 + 0.35 * m;
    drops.forEach((d, i) => { const ph = ((t * (0.9 + i * 0.3) + i * 0.37 + sd * 0.11) % 1); d.visible = m > 0.05 || c.drip; d.position.set([0.45, -0.38, 0.1][i], (1 - ph) * 1.0 * (1 - 0.4 * m) + 0.05, [0.2, 0.25, 0.48][i]); });
    // mắt: chớp + liếc
    const bk = C.blink ?? (((t + sd * 1.37) % 3.3) < 0.12 ? 1 : 0); eyes.forEach((e) => e.scale.set(1, 1 - 0.9 * bk, 1));
    pup.forEach((p) => { p.position.x = 0.012 + (C.look ? C.look[0] : Math.sin(t * 0.9 + sd) * 0.5) * 0.012; });
    setMouth(C.smile); tail.rotation.z = Math.sin(t * 3 + sd) * 0.25; tail.rotation.x = Math.sin(t * 2.1 + sd) * 0.2; pom.position.x = Math.sin(t * 2.5 + sd) * 0.02;
    arms.forEach((a, i) => { const k = a.userData.k; const rz = -k * (Math.PI / 2 - C.raise[i] * 1.2) + Math.sin(t * 9 + i) * 0.45 * C.wave[i] * k * -1;
      a.rotation.set(0, 0, rz); a.rotation.x = Math.sin(t * 1.4 + sd + i) * 0.08 * C.sway; if (C.reach) { a.rotation.x = -C.reach[i]; } a.scale.y = 1 - 0.25 * m; a.position.y = midY + 0.12; });
    // aimAt: [Vector3|null, Vector3|null] — chĩa que về điểm thế giới; stretch: que dài ra tới đúng điểm (gag "tay que thụt thò")
    if (C.aimAt) { root.updateMatrixWorld(true); arms.forEach((a, i) => { const T = C.aimAt[i]; if (!T) return; const lp = a.parent.worldToLocal(T.clone()); const d = lp.sub(a.position);
      const L = d.length(); a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); a.rotation.y += 0; if (C.stretch) a.scale.y = Math.max(1, L / 0.86); }); }
  };
  update(0);
  const hands = () => arms.map((a) => a.userData.tip.getWorldPosition(new THREE.Vector3()));
  return { root, body, head, eyes, arms, update, hands, R: R[0] };
}
