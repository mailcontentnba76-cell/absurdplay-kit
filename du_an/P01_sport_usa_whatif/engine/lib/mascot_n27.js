// N27 — đạo cụ: bình sữa, vũng sữa, khối đồ chơi, chậu tắm có nước + bọt, bảng chiến thuật (vẽ bậy bằng bút sáp), bàn bình luận, ghế cạnh sân.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const PI = Math.PI;
export function milkBottle() { const G = new THREE.Group();
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.14, 18), std('#ffffff', { transparent: true, opacity: 0.55, roughness: 0.1 })); b.position.y = 0.07; G.add(b);
  const milk = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.1, 18), std('#fbfbf4', { roughness: 0.4 })); milk.position.y = 0.055; G.add(milk);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.025, 18), std('#8fd0ff')); cap.position.y = 0.152; G.add(cap);
  const nip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 10), std('#e8c890', { transparent: true, opacity: 0.85 })); nip.scale.y = 1.4; nip.position.y = 0.18; G.add(nip); return shad(G); }
export function puddle(r = 0.7, color = '#fbfbf4') { const sh = new THREE.Shape(); const n = 14; for (let i = 0; i <= n; i++) { const a = i / n * PI * 2, rr = r * (0.75 + 0.25 * Math.sin(i * 2.3) * Math.cos(i * 1.1)); const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.7; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), std(color, { roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.92 })); m.rotation.x = -PI / 2; m.position.y = 0.006; m.receiveShadow = true; m.frustumCulled = false; return m; }
export function toyBlock(letter = 'A', c = '#e83a3a') { const tx = ctex(128, 128, (g) => { g.fillStyle = c; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(8, 8, 112, 112); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(letter, 64, 68); });
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.5 })); m.castShadow = true; m.frustumCulled = false; return m; }
// chậu tắm nhựa + nước + bọt; userData.splash(t, k) bắn giọt
export function bathTub(color = '#ffd34a') { const G = new THREE.Group(); const prof = [[0, 0], [0.42, 0], [0.48, 0.04], [0.52, 0.3], [0.55, 0.32]].map(([x, y]) => new THREE.Vector2(x, y));
  const tub = new THREE.Mesh(new THREE.LatheGeometry(prof, 36), std(color, { roughness: 0.35, side: THREE.DoubleSide })); tub.scale.z = 0.75; G.add(tub);
  const w = new THREE.Mesh(new THREE.CircleGeometry(0.5, 36), std('#7cc8ff', { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 })); w.rotation.x = -PI / 2; w.position.y = 0.24; w.scale.y = 0.75; G.add(w);
  const fo = std('#ffffff', { roughness: 0.9 }); for (let k = 0; k < 18; k++) { const a = k * 2.399, r = 0.3 + (k % 4) * 0.05; const s = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (k % 3) * 0.015, 10, 8), fo); s.position.set(Math.cos(a) * r, 0.26, Math.sin(a) * r * 0.75); G.add(s); }
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 6, 5), std('#a8dcff', { roughness: 0.05, transparent: true, opacity: 0.9 }), 40); drops.frustumCulled = false; G.add(drops);
  const D = new THREE.Object3D(); G.userData.splash = (t, k = 1) => { let m = 0; for (let i = 0; i < 40; i++) { const ph = ((t * 1.7 + i * 0.137) % 1); const a = i * 2.399; const r = 0.1 + ph * 0.5; D.position.set(Math.cos(a) * r * 0.8, 0.3 + Math.sin(ph * PI) * 0.45 * k, Math.sin(a) * r * 0.6); D.scale.setScalar(k > 0 ? 1 : 0.001); D.updateMatrix(); drops.setMatrixAt(m++, D.matrix); } drops.count = m; drops.instanceMatrix.needsUpdate = true; };
  return shad(G); }
// bảng chiến thuật trên giá; userData.scribble(k 0..1) hiện nét bút sáp vẽ bậy
export function kerrBoard() { const G = new THREE.Group();
  const base = (g, W, H) => { g.fillStyle = '#f6f4ec'; g.fillRect(0, 0, W, H); g.strokeStyle = '#2a2a2a'; g.lineWidth = 6; g.strokeRect(40, 40, W - 80, H - 80); g.beginPath(); g.arc(W / 2, H - 40, 200, PI, 2 * PI); g.stroke(); g.strokeRect(W / 2 - 90, H - 260, 180, 220);
    g.fillStyle = '#1d428a'; g.font = '900 52px Arial'; for (const [x, y, n] of [[200, 160, 'X'], [560, 170, 'X'], [380, 250, 'X'], [250, 380, 'O'], [520, 380, 'O']]) g.fillText(n, x, y);
    g.strokeStyle = '#1d428a'; g.lineWidth = 6; g.setLineDash([14, 10]); for (const [x0, y0, x1, y1] of [[220, 170, 330, 300], [540, 180, 430, 300]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); } g.setLineDash([]); };
  const c = document.createElement('canvas'); c.width = 768; c.height = 576; const g = c.getContext('2d'); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
  let last = -1; G.userData.scribble = (k) => { const kk = Math.round(k * 60) / 60; if (kk === last) return; last = kk; base(g, 768, 576); const cols = ['#e83a3a', '#2fb24a', '#ff9a1a', '#8a3ae8']; let sd = 3; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const n = Math.floor(kk * 40); for (let i = 0; i < n; i++) { g.strokeStyle = cols[i % 4]; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); let x = 150 + r() * 470, y = 120 + r() * 340; g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (r() - 0.5) * 160; y += (r() - 0.5) * 120; g.lineTo(x, y); } g.stroke(); }
    if (kk > 0.7) { g.fillStyle = '#ffcc00'; g.beginPath(); g.arc(600, 140, 50, 0, PI * 2); g.fill(); g.strokeStyle = '#ff9a1a'; for (let a = 0; a < 8; a++) { g.beginPath(); g.moveTo(600 + Math.cos(a) * 60, 140 + Math.sin(a) * 60); g.lineTo(600 + Math.cos(a) * 90, 140 + Math.sin(a) * 90); g.stroke(); } }
    tx.needsUpdate = true; };
  G.userData.scribble(0);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.82, 0.03), [std('#bbb'), std('#bbb'), std('#bbb'), std('#bbb'), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6 }), std('#bbb')]); board.position.y = 0.95; G.add(board);
  const leg = std('#3a3a40', { metalness: 0.5 }); for (const [x, rz] of [[-0.42, 0.12], [0.42, -0.12]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 6), leg); l.position.set(x, 0.5, -0.05); l.rotation.z = rz; G.add(l); }
  return shad(G); }
// bàn bình luận: mặt bàn + vách trước có chữ, 2 micro
export function commentaryDesk(text = 'WHAT IF · LIVE') { const G = new THREE.Group(); const tx = ctex(1024, 192, (g, W, H) => { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#0f2a5c'); gr.addColorStop(1, '#1d428a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#ffc72c'; g.fillRect(0, H - 18, W, 18); g.font = '900 96px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText(text, W / 2, H / 2 - 6); });
  const front = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.72, 0.05), [std('#0f2a5c'), std('#0f2a5c'), std('#0f2a5c'), std('#0f2a5c'), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.5, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.2 }), std('#0f2a5c')]); front.position.set(0, 0.36, 0.3); G.add(front);
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.7), std('#1a1a22', { roughness: 0.4 })); top.position.y = 0.74; G.add(top);
  for (const x of [-0.5, 0.5]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6), std('#222', { metalness: 0.7 })); s.position.set(x, 0.88, 0.15); s.rotation.x = 0.4; G.add(s); const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), std('#2a2a2a', { roughness: 0.9 })); m.position.set(x, 1.0, 0.2); G.add(m); }
  return shad(G); }
export function courtChair(c = '#1d428a') { const G = new THREE.Group(); const m = std(c, { roughness: 0.5 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), m); seat.position.y = 0.46; G.add(seat); const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), m); back.position.set(0, 0.74, -0.22); G.add(back);
  const lg = std('#d0d0d8', { metalness: 0.7, roughness: 0.3 }); for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.44, 6), lg); l.position.set(x, 0.22, z); G.add(l); }
  return shad(G); }
