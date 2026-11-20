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
// điểm danh linh vật: bảng tên đặt trên sàn (chữ trắng), ô trống có viền nét đứt
export function rollSign(name, bg = '#2a2a34', empty = false) { const G = new THREE.Group();
  const tx = ctex(512, 160, (g, W, H) => { g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = empty ? '#ffd56a' : '#ffffff'; g.lineWidth = 8; if (empty) g.setLineDash([22, 14]); g.strokeRect(8, 8, W - 16, H - 16);
    g.fillStyle = '#ffffff'; g.font = '900 78px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, W / 2, H / 2 + 4, W - 40); });
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.39, 0.03), [std('#222'), std('#222'), std('#222'), std('#222'), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.5, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.25 }), std('#222')]);
  board.position.y = 0.32; board.rotation.x = -0.35; G.add(board);
  const leg = std('#3a3a40', { metalness: 0.6 }); for (const x of [-0.5, 0.5]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), leg); l.position.set(x, 0.15, -0.06); G.add(l); }
  return shad(G); }
// giá treo đồ + móc áo trống đung đưa
export function coatRack() { const G = new THREE.Group(); const m = std('#c8c8d0', { metalness: 0.8, roughness: 0.3 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.7, 8), m); pole.position.y = 0.85; G.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.04, 20), m); base.position.y = 0.02; G.add(base);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6), m); arm.rotation.x = PI / 2; arm.position.set(0, 1.68, 0.16); G.add(arm);
  const piv = new THREE.Group(); piv.position.set(0, 1.66, 0.3); G.add(piv); const w = std('#d8b070', { roughness: 0.5 });
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14, PI * 1.3), m); hook.position.y = -0.03; piv.add(hook);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.44, 8), w); bar.rotation.z = PI / 2; bar.position.y = -0.2; piv.add(bar);
  for (const sg of [-1, 1]) { const sd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 8), w); sd.position.set(sg * 0.11, -0.13, 0); sd.rotation.z = sg * 1.05; piv.add(sd); }
  G.userData.swing = (ph) => { piv.rotation.z = Math.sin(ph) * 0.18; piv.rotation.y = Math.sin(ph * 0.6) * 0.3; };
  return shad(G); }
// bụi cỏ khô (tumbleweed): rối các nhánh cong
export function tumbleweed(r = 0.3) { const G = new THREE.Group(); const m = std('#b08a52', { roughness: 0.95 }); let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 46; k++) { const a = rnd() * PI * 2, b = rnd() * PI, rr = r * (0.55 + rnd() * 0.45); const p0 = new THREE.Vector3(Math.cos(a) * Math.sin(b), Math.cos(b), Math.sin(a) * Math.sin(b)).multiplyScalar(rr);
    const p1 = p0.clone().applyAxisAngle(new THREE.Vector3(rnd(), rnd(), rnd()).normalize(), 0.9 + rnd()).multiplyScalar(0.9 + rnd() * 0.2); const mid = p0.clone().add(p1).multiplyScalar(0.5).multiplyScalar(1.2);
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, mid, p1), 10, 0.008, 4, false), m)); }
  return shad(G); }
// vũng đèn rọi trên sàn + cột sáng mờ
export function spotPool(r = 0.95) { const G = new THREE.Group();
  const tx = ctex(256, 256, (g, W, H) => { const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); gr.addColorStop(0, 'rgba(255,248,220,0.95)'); gr.addColorStop(0.7, 'rgba(255,240,200,0.55)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(r * 2.2, r * 2.2), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 })); pool.rotation.x = -PI / 2; pool.position.y = 0.012; G.add(pool);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.25, r, 7, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#fff3d6', transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); cone.position.y = 3.5; G.add(cone);
  G.traverse((o) => { o.frustumCulled = false; }); return G; }
