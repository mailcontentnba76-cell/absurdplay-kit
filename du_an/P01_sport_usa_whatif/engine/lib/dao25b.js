// Tập 25 — đạo cụ đoạn giới thiệu: cân hàng khổng lồ (kim quay tới 500 LB), ván cào móng (hiện dần 5 vạch), máy đo lực cắn (kim vọt vùng đỏ), nón đèn chiếu.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, ...o });
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; draw(c.getContext('2d'), w, h); return { t, c, g: c.getContext('2d') }; }
function dial(max, marks, label, red) {   // mặt đồng hồ tròn
  return ctex(512, 512, (g, W) => { g.fillStyle = '#f6f0e2'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.lineWidth = 14; g.strokeStyle = '#1c1c1c'; g.stroke();
    if (red) { g.strokeStyle = '#d83a2a'; g.lineWidth = 40; g.beginPath(); g.arc(256, 256, 200, -Math.PI / 2 + red * 1.5 * Math.PI - 0.75 * Math.PI, 0.75 * Math.PI - Math.PI / 2 + 0.0); g.stroke(); }
    g.fillStyle = '#1c1c1c'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 0; i <= marks; i++) { const a = -0.75 * Math.PI + i / marks * 1.5 * Math.PI - Math.PI / 2; g.save(); g.translate(256 + Math.cos(a) * 205, 256 + Math.sin(a) * 205); g.rotate(a + Math.PI / 2); g.fillRect(-4, -18, 8, 36); g.restore();
      g.font = 'bold 40px sans-serif'; g.fillText(String(Math.round(max * i / marks)), 256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); }
    g.font = 'bold 46px sans-serif'; g.fillText(label, 256, 370); }).t;
}
function needleMesh(len) { const G = new THREE.Group(); const n = new THREE.Mesh(new THREE.BoxGeometry(0.035, len, 0.02), std('#c82020', { roughness: 0.4 })); n.position.y = len / 2 - 0.05; G.add(n); G.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16).rotateX(Math.PI / 2), std('#222'))); return G; }
const angOf = (k) => (0.75 * Math.PI) - k * 1.5 * Math.PI;   // k 0..1 → góc kim (0 = trái dưới, 1 = phải dưới)

// cân: bàn cân 2,2 × 1,1 m cao 0,26 + cột đồng hồ ở mép trước
export function weighScale() {
  const G = new THREE.Group(); const top = new THREE.Group(); G.add(top);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.16, 1.3), std('#3a3e46', { metalness: 0.5, roughness: 0.4 })); base.position.y = 0.08; G.add(base);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.1, 1.2), std('#9aa2ae', { metalness: 0.7, roughness: 0.3 })); plate.position.y = 0.21; top.add(plate);
  for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 1.15), std('#6a727e', { metalness: 0.6 })); r.position.set(-1.05 + i * 0.26, 0.265, 0); top.add(r); }
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.12), std('#c8282a')); post.position.set(0.9, 0.7, 0.75); G.add(post);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 40).rotateX(Math.PI / 2), std('#c8282a')); face.position.set(0.9, 1.5, 0.78); G.add(face);
  const fp = new THREE.Mesh(new THREE.CircleGeometry(0.41, 48), new THREE.MeshStandardMaterial({ map: dial(600, 6, 'LB'), roughness: 0.5 })); fp.position.set(0.9, 1.5, 0.825); G.add(fp); const nd = needleMesh(0.34); nd.position.set(0.9, 1.5, 0.85); G.add(nd);
  G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  G.userData.TOP = 0.27;
  G.userData.set = (k, squash = 0) => { nd.rotation.z = angOf(k); top.position.y = -0.05 * squash; };
  return G;
}
// ván cào: tấm gỗ đứng 1,6 × 1,5 m, n vạch móng (mỗi vạch 4 rãnh)
export function clawBoard() {
  const G = new THREE.Group(); const T = ctex(512, 512, (g, W, H) => { paint(g, W, H, 0); });
  function paint(g, W, H, n) { g.fillStyle = '#b8864e'; g.fillRect(0, 0, W, H); for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? 'rgba(90,50,20,0.18)' : 'rgba(255,220,170,0.1)'; g.fillRect(0, i * 29, W, 3 + (i % 3)); }
    g.fillStyle = '#e0661a'; g.font = 'bold 46px sans-serif'; g.textAlign = 'center'; g.fillText('WIN STREAK', W / 2, 60);
    for (let k = 0; k < n; k++) { const x0 = 70 + k * 85; for (let r = 0; r < 4; r++) { g.strokeStyle = '#3a1c08'; g.lineWidth = 9; g.beginPath(); g.moveTo(x0 + r * 14, 110 + r * 4); g.quadraticCurveTo(x0 + r * 14 + 22, 260, x0 + r * 14 + 8, 430 - r * 6); g.stroke();
      g.strokeStyle = '#f2d8a8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + r * 14 + 5, 112 + r * 4); g.quadraticCurveTo(x0 + r * 14 + 27, 262, x0 + r * 14 + 13, 428 - r * 6); g.stroke(); } } }
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 0.1), [std('#7a5634'), std('#7a5634'), std('#7a5634'), std('#7a5634'), new THREE.MeshStandardMaterial({ map: T.t, roughness: 0.85 }), std('#7a5634')]);
  board.position.y = 1.15; G.add(board);
  for (const x of [-0.7, 0.7]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), std('#5a3e24')); l.position.set(x, 0.22, 0); G.add(l); }
  G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  let last = -1; G.userData.marks = (n) => { if (n === last) return; last = n; paint(T.g, 512, 512, n); T.t.needsUpdate = true; };
  return G;
}
// máy đo lực cắn: trụ + thanh đệm ngang (ngang tầm miệng) + đồng hồ lớn có vùng đỏ + đèn
export function biteMeter() {
  const G = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.2, 0.16), std('#0f6a6a')); post.position.set(0, 1.1, 0); G.add(post);
  const pad = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 6, 12).rotateZ(Math.PI / 2), std('#e8c040', { roughness: 0.6 })); pad.position.set(0, 0.62, 0.0); G.add(pad);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.5), std('#3a3c44', { metalness: 0.6 })); G.add(arm);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 40).rotateX(Math.PI / 2), std('#0f6a6a')); face.position.set(0, 1.85, 0.1); G.add(face);
  const fp = new THREE.Mesh(new THREE.CircleGeometry(0.49, 48), new THREE.MeshStandardMaterial({ map: dial(2000, 4, 'PSI', 0.75), roughness: 0.5 })); fp.position.set(0, 1.85, 0.145); G.add(fp); const nd = needleMesh(0.4); nd.position.set(0, 1.85, 0.17); G.add(nd);
  const lampM = new THREE.MeshStandardMaterial({ color: '#4a1010', emissive: '#ff3a20', emissiveIntensity: 0 });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10), lampM); lamp.position.set(0, 2.42, 0.0); G.add(lamp);
  G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  G.userData.pad = pad; G.userData.arm = arm;
  // padAt: đặt đệm tới điểm (toạ độ cục bộ) — thanh nối từ trụ ra
  G.userData.padAt = (p) => { pad.position.copy(p); const mid = new THREE.Vector3(0, p.y, 0).add(p).multiplyScalar(0.5); arm.position.copy(mid); arm.lookAt(G.localToWorld(new THREE.Vector3(p.x, p.y, p.z))); arm.scale.z = Math.max(0.1, Math.hypot(p.x, p.z) / 0.5); };
  G.userData.set = (k, squeeze = 0, blink = 0) => { nd.rotation.z = angOf(k); pad.scale.set(1, 1 - 0.35 * squeeze, 1); lampM.emissiveIntensity = blink * 2.5; };
  return G;
}
// nón ánh sáng đèn chiếu (mờ, màu ấm — không chớp trắng)
export function spotCone(color = '#ffb060', h = 9, r = 1.6) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, r, h, 32, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false }));
  m.position.y = h / 2; const G = new THREE.Group(); G.add(m);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(r * 0.95, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); pool.position.y = 0.02; G.add(pool);
  G.userData.cone = m; return G;
}
