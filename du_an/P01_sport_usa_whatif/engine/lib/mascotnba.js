// Series MASCOT NBA — đạo cụ montage: tên lửa có mắt, Mặt Trời có mặt, bàn viết gỗ + lọ mực, thẻ hành lý. Không logo/màu chính thức của đội.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } }); return G; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function eyes(G, r, y, z, sp) { for (const sg of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), std('#ffffff', { roughness: 0.3 })); e.position.set(sg * sp, y, z); G.add(e);
  const p = new THREE.Mesh(new THREE.SphereGeometry(r * 0.5, 12, 10), std('#111', { roughness: 0.2 })); p.position.set(sg * sp, y, z + r * 0.62); G.add(p); } }
// tên lửa: thân trắng, mũi đỏ, 3 cánh, cửa sổ tròn, mắt to ở mũi; lửa đuôi (flame.scale theo thời gian). Trục bay = +y.
export function rocket() { const G = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 3.2, 28), std('#f2f2f2', { metalness: 0.3, roughness: 0.35 })); G.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 28), std('#d8322a')); nose.position.y = 2.3; G.add(nose);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20), std('#6ab0e8', { metalness: 0.4, roughness: 0.1 })); win.position.set(0, 0.6, 0.6); G.add(win);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 24), std('#9aa0a8', { metalness: 0.8 })); rim.position.set(0, 0.6, 0.6); G.add(rim);
  for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.8), std('#d8322a')); const a = k * Math.PI * 2 / 3; f.position.set(Math.sin(a) * 0.75, -1.3, Math.cos(a) * 0.75); f.rotation.y = a; G.add(f); }
  eyes(G, 0.16, 1.55, 0.5, 0.22);
  const flame = new THREE.Group(); const fo = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 18), new THREE.MeshBasicMaterial({ color: '#ffb02a', transparent: true, opacity: 0.9 })); fo.rotation.x = Math.PI; fo.position.y = -0.9; flame.add(fo);
  const fi = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.1, 14), new THREE.MeshBasicMaterial({ color: '#fff6c0' })); fi.rotation.x = Math.PI; fi.position.y = -0.55; flame.add(fi); flame.position.y = -1.6; G.add(flame);
  G.userData.flame = flame; return shad(G); }
// Mặt Trời: cầu phát sáng + mặt cười tự mãn + tia (gai) xoay
export function sunFace(R = 3) { const G = new THREE.Group();
  const tex = ctex(1024, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffe680'); gr.addColorStop(1, '#ffb02a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#7a3a08'; g.lineWidth = 14; g.strokeStyle = '#7a3a08'; const cx = W * 0.75, cy = H * 0.5; // mặt quay về +z (u≈0.75)
    for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(cx + sx * 40, cy - 30, 14, 22, 0, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.arc(cx, cy + 10, 60, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); g.fillStyle = 'rgba(255,90,40,0.35)'; for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * 80, cy + 20, 22, 0, Math.PI * 2); g.fill(); } });
  const core = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); G.add(core);
  const rays = new THREE.Group(); for (let i = 0; i < 16; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(R * 0.18, R * 0.7, 10), new THREE.MeshBasicMaterial({ color: '#ffc840', toneMapped: false })); const a = i / 16 * Math.PI * 2; c.position.set(Math.cos(a) * R * 1.25, Math.sin(a) * R * 1.25, -R * 0.2); c.rotation.z = a - Math.PI / 2; rays.add(c); } G.add(rays);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.45, 32, 20), new THREE.MeshBasicMaterial({ color: '#ffb84a', transparent: true, opacity: 0.18, depthWrite: false })); G.add(glow);
  G.userData.rays = rays; return G; }
// bàn viết gỗ + lọ mực
export function desk() { const G = new THREE.Group(); const w = std('#5a3420', { roughness: 0.7 }); const top = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.9), w); top.position.y = 0.78; G.add(top);
  for (const x of [-0.9, 0.9]) for (const z of [-0.38, 0.38]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.78, 8), w); l.position.set(x, 0.39, z); G.add(l); }
  const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), std('#141820', { roughness: 0.2 })); ink.position.set(0.6, 0.86, 0.1); G.add(ink);
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.16, 10), std('#f2ecdc')); can.position.set(-0.75, 0.9, -0.2); G.add(can);
  const fl = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 5), new THREE.MeshStandardMaterial({ color: '#ffd28a', emissive: '#ffb84a', emissiveIntensity: 3 })); fl.scale.y = 1.6; fl.position.set(-0.75, 1.0, -0.2); G.add(fl);
  return shad(G); }
// thẻ hành lý giấy treo dây: chữ lớn
export function luggageTag(text = 'MIA', sub = '') { const G = new THREE.Group();
  const t = ctex(256, 384, (g, W, H) => { g.fillStyle = '#f2e4c0'; g.fillRect(0, 0, W, H); g.fillStyle = '#c84a2a'; g.fillRect(0, 0, W, 60); g.fillStyle = '#1a1a1a'; g.textAlign = 'center'; g.font = '900 120px Anton, Impact, sans-serif'; g.fillText(text, W / 2, 210);
    g.font = '700 34px Anton, Impact, sans-serif'; g.fillText(sub, W / 2, 300); g.beginPath(); g.arc(W / 2, 34, 14, 0, Math.PI * 2); g.fillStyle = '#f2e4c0'; g.fill(); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.54), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.8 })); G.add(p); return shad(G); }
