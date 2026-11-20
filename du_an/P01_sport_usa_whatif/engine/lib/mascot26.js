// E26 — đạo cụ: gậy chống, túi bánh mì + ổ bánh, vụn bánh (instanced), bảng chiến thuật "1809", tờ giấy bốc thăm, cúp vàng chung chung (2 quai, không giống cúp NBA thật).
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const PI = Math.PI;

export function cane() { const G = new THREE.Group(); const w = std('#5a3418', { roughness: 0.55 });
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.92, 8), w); s.position.y = 0.46; G.add(s);
  const top = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16, PI), w); top.position.set(0.045, 0.92, 0); G.add(top);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 8), std('#d8c070', { metalness: 0.7, roughness: 0.3 })); tip.position.y = 0.015; G.add(tip); return shad(G); }
export function loaf() { const G = new THREE.Group(); const m = std('#d08a3c', { roughness: 0.85 });
  const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.22, 6, 12), m); b.rotation.z = PI / 2; G.add(b);
  for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.02, 0.07), std('#f0d09a')); c.position.set(-0.08 + k * 0.08, 0.058, 0); c.rotation.y = 0.5; G.add(c); } return shad(G); }
export function breadBag() { const G = new THREE.Group(); const m = std('#c8b48a', { roughness: 0.95 });
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.26, 14), m); G.add(b);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, PI * 2, 0, PI / 2), m); top.scale.y = 0.4; top.position.y = 0.13; G.add(top);
  const l = loaf(); l.scale.setScalar(0.7); l.rotation.z = 1.2; l.position.set(0.02, 0.17, 0); G.add(l); return shad(G); }
// vụn bánh: tối đa n vụn, set(list of [x,y,z]) mỗi khung
export function crumbs(n = 160) { const im = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.025, 0), std('#e2a85a', { roughness: 0.9 }), n); im.frustumCulled = false; im.castShadow = true; im.count = 0;
  const D = new THREE.Object3D(); im.userData.set = (pts) => { let m = 0; for (const p of pts) { if (m >= n) break; D.position.set(p[0], p[1], p[2]); D.rotation.set(m * 1.3, m * 0.7, 0); D.scale.setScalar(0.7 + (m % 5) * 0.12); D.updateMatrix(); im.setMatrixAt(m++, D.matrix); } im.count = m; im.instanceMatrix.needsUpdate = true; }; return im; }
// bảng chiến thuật trên giá: nửa sân + mũi tên đi bộ chậm, chữ "1809"
export function playBoard() { const G = new THREE.Group();
  const tx = ctex(768, 576, (g, W, H) => { g.fillStyle = '#f6f4ec'; g.fillRect(0, 0, W, H); g.strokeStyle = '#2a2a2a'; g.lineWidth = 6; g.strokeRect(40, 40, W - 80, H - 80);
    g.beginPath(); g.arc(W / 2, H - 40, 200, PI, 2 * PI); g.stroke(); g.strokeRect(W / 2 - 90, H - 260, 180, 220); g.beginPath(); g.arc(W / 2, H - 80, 18, 0, 2 * PI); g.stroke();
    g.strokeStyle = '#1d4f9a'; g.lineWidth = 7; g.setLineDash([16, 14]); for (const [x0, y0, x1, y1] of [[140, 150, 260, 300], [610, 150, 500, 300], [380, 120, 380, 260]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    g.setLineDash([]); g.fillStyle = '#e8641c'; g.font = '700 italic 40px Georgia, serif'; g.textAlign = 'center'; g.fillText('walk', 175, 250); g.fillText('walk', 590, 250); g.fillText('walk… slowly', 384, 330);
    for (const [x, y] of [[140, 150], [610, 150], [380, 120]]) { g.beginPath(); g.arc(x, y, 22, 0, 2 * PI); g.fillStyle = '#1d4f9a'; g.fill(); }
    g.fillStyle = '#2a2a2a'; g.font = '900 italic 64px Georgia, serif'; g.fillText('PLAY · 1809', W / 2, 105); });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.82, 0.03), [std('#bbb'), std('#bbb'), std('#bbb'), std('#bbb'), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6 }), std('#bbb')]); board.position.y = 1.35; G.add(board);
  const leg = std('#3a3a40', { metalness: 0.5 }); for (const [x, rz] of [[-0.42, 0.12], [0.42, -0.12]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 6), leg); l.position.set(x, 0.72, -0.05); l.rotation.z = rz; G.add(l); }
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6), leg); back.position.set(0, 0.68, -0.3); back.rotation.x = -0.35; G.add(back); return shad(G); }
// tờ giấy bốc thăm "KNICKERBOCKERS"
export function nameSlip(text = 'KNICKERBOCKERS') { const tx = ctex(512, 160, (g, W, H) => { g.fillStyle = '#f3ead2'; g.fillRect(0, 0, W, H); g.fillStyle = '#2a1a0a'; g.font = 'italic 700 52px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 2, W - 30); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.13), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.9, side: THREE.DoubleSide })); m.castShadow = true; m.frustumCulled = false; return m; }
// cúp vàng 2 quai trên đế gỗ (chung chung)
export function cup() { const G = new THREE.Group(); const gold = std('#e8b830', { metalness: 0.85, roughness: 0.22 });
  const prof = [[0.0, 0], [0.12, 0], [0.12, 0.05], [0.05, 0.08], [0.035, 0.2], [0.06, 0.24], [0.15, 0.32], [0.2, 0.46], [0.21, 0.56], [0.2, 0.57]].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), std('#e8b830', { metalness: 0.85, roughness: 0.22, side: THREE.DoubleSide })); G.add(body);
  for (const sg of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.014, 8, 18, PI * 1.2), gold); h.position.set(sg * 0.2, 0.42, 0); h.rotation.z = sg > 0 ? -PI * 0.6 : PI * 0.6 + PI * 0.4; G.add(h); }
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), std('#3a2414', { roughness: 0.5 })); base.position.y = -0.04; G.add(base); return shad(G); }
