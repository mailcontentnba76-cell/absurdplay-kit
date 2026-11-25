// E29 — sói (coyote) và gấu xám THẬT từ mô hình Magnific Text-to-3D (Tripo H3.1, KHÔNG có xương).
// Chân/tay/đuôi/đầu cử động bằng biến dạng đỉnh trên CPU: mỗi đỉnh gán vào 1 nhóm (chân, tay, đuôi, đầu) với trọng số mềm,
// mỗi khung quay nhóm quanh khớp (vai/hông/cổ/gốc đuôi). Làm trên CPU để bóng đổ và mọi lượt render đều khớp.
// Hệ mô hình gốc: sói dài theo +z (đầu +z), cao 0,746; gấu đứng thẳng, mặt hướng +x, cao 1,0.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const cl = (x) => Math.min(1, Math.max(0, x)), ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const TPL = {};
export async function loadAnimals(base = './assets/e29/') {
  const ld = new GLTFLoader();
  await Promise.all(['coyote', 'bear'].map(async (k) => { TPL[k] = (await ld.loadAsync(base + k + '.glb')).scene; }));
}
// nhóm: [tên, trục quay ('x' hoặc 'z'), khớp (y,z hoặc y,x), hàm trọng số(p)]
function rigDef(kind) {
  if (kind === 'coyote') {
    // chân: dưới bụng (y<0), khớp y≈0; trước z≈0.27, sau z≈-0.33; trái/phải theo dấu x
    const leg = (zc, sx) => (p) => (Math.sign(p.x) === sx || Math.abs(p.x) < 0.005 ? 1 : 0) * ss(-0.02, -0.11, p.y) * (1 - ss(0.13, 0.19, Math.abs(p.z - zc)));
    return [
      ['FL', 'x', [0.0, 0.27], leg(0.27, 1)], ['FR', 'x', [0.0, 0.27], leg(0.27, -1)],
      ['BL', 'x', [0.0, -0.31], leg(-0.31, 1)], ['BR', 'x', [0.0, -0.31], leg(-0.31, -1)],
      ['TAIL', 'x', [0.02, -0.40], (p) => ss(-0.39, -0.44, p.z) * (p.y > -0.3 ? 1 : 0)],
      ['HEAD', 'x', [0.12, 0.33], (p) => ss(0.30, 0.38, p.z) * ss(0.02, 0.10, p.y)],
    ];
  }
  // gấu đứng: chân dưới hông y≈-0.22, trái/phải theo z; tay hai bên |z|>0.25, vai y≈0.16; đầu y>0.27
  const leg = (sz) => (p) => (Math.sign(p.z) === sz ? 1 : 0) * ss(-0.24, -0.32, p.y);
  const arm = (sz) => (p) => (Math.sign(p.z) === sz ? 1 : 0) * ss(0.245, 0.285, Math.abs(p.z)) * (1 - ss(0.14, 0.22, p.y));
  return [
    ['LL', 'z', [-0.22, 0.10], leg(1)], ['LR', 'z', [-0.22, -0.10], leg(-1)],
    ['AL', 'z', [0.16, 0.0], arm(1)], ['AR', 'z', [0.16, 0.0], arm(-1)],
    ['HEAD', 'z', [0.26, 0.0], (p) => ss(0.25, 0.31, p.y)],
  ];
}
export function makeAnimal(kind, S) {
  const src = TPL[kind]; const model = src.clone(true);
  let mesh; model.traverse((o) => { if (o.isMesh) mesh = o; });
  mesh.geometry = mesh.geometry.clone(); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
  mesh.updateMatrix(); mesh.geometry.applyMatrix4(mesh.matrix); mesh.position.set(0, 0, 0); mesh.rotation.set(0, 0, 0); mesh.scale.set(1, 1, 1);
  const g = mesh.geometry, P = g.attributes.position, N = g.attributes.normal, n = P.count;
  const P0 = Float32Array.from(P.array), N0 = N ? Float32Array.from(N.array) : null;
  const defs = rigDef(kind); const grp = new Int8Array(n).fill(-1), wt = new Float32Array(n); const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { v.set(P0[i * 3], P0[i * 3 + 1], P0[i * 3 + 2]); let best = 0, bi = -1; defs.forEach((d, k) => { const w = d[3](v); if (w > best) { best = w; bi = k; } }); if (bi >= 0 && best > 0.002) { grp[i] = bi; wt[i] = best; } }
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const minY = kind === 'coyote' ? -0.373 : -0.5;
  model.scale.setScalar(S); model.position.y = -minY * S; body.add(model);
  if (kind === 'bear') model.rotation.y = -Math.PI / 2;     // gấu: mặt +x → +z (cùng hướng sói)
  const A = {}; defs.forEach((d) => { A[d[0]] = 0; });
  return { kind, root, body, model, mesh, g, P0, N0, grp, wt, defs, A, S, dirty: true, lift: {} };
}
// áp góc A[...] (radian) lên đỉnh
export function deform(q) {
  const { g, P0, N0, grp, wt, defs, A } = q; const P = g.attributes.position.array, N = g.attributes.normal ? g.attributes.normal.array : null;
  const cs = defs.map((d) => [Math.cos(A[d[0]]), Math.sin(A[d[0]]), q.lift[d[0]] || 0]);
  for (let i = 0, n = grp.length; i < n; i++) { const k = grp[i]; const j = i * 3;
    if (k < 0) { P[j] = P0[j]; P[j + 1] = P0[j + 1]; P[j + 2] = P0[j + 2]; if (N) { N[j] = N0[j]; N[j + 1] = N0[j + 1]; N[j + 2] = N0[j + 2]; } continue; }
    const d = defs[k], w = wt[i], a = A[d[0]] * w, c = Math.cos(a), s = Math.sin(a), lf = cs[k][2] * w;
    if (d[1] === 'x') { const py = d[2][0], pz = d[2][1]; const y = P0[j + 1] - py, z = P0[j + 2] - pz;
      P[j] = P0[j]; P[j + 1] = py + y * c - z * s + lf; P[j + 2] = pz + y * s + z * c;
      if (N) { const ny = N0[j + 1], nz = N0[j + 2]; N[j] = N0[j]; N[j + 1] = ny * c - nz * s; N[j + 2] = ny * s + nz * c; } }
    else { const py = d[2][0], px = d[2][1]; const x = P0[j] - px, y = P0[j + 1] - py;
      P[j] = px + x * c - y * s; P[j + 1] = py + x * s + y * c + lf; P[j + 2] = P0[j + 2];
      if (N) { const nx = N0[j], ny = N0[j + 1]; N[j] = nx * c - ny * s; N[j + 1] = nx * s + ny * c; N[j + 2] = N0[j + 2]; } } }
  g.attributes.position.needsUpdate = true; if (N) g.attributes.normal.needsUpdate = true;
}
// SÓI: gait 'stand' | 'trot' | 'run'; ph = pha bước (tăng theo quãng đường); trả về độ nhún thân
export function poseCoyote(q, t, o = {}) {
  const A = q.A; const gait = o.gait || 'stand'; const ph = o.ph ?? t * 2;
  const amp = gait === 'run' ? 0.5 : gait === 'trot' ? 0.36 : 0; const TAU = Math.PI * 2;
  // trot: chéo đôi (FL+BR, FR+BL); run (phi): trước cùng pha lệch nhẹ, sau cùng pha ngược trước
  const pf = [0, 0.5, 0.5, 0];   // chéo đôi cho cả chạy nhanh: luôn có 1 cặp chân chéo chạm đất → thân giữ thẳng, không bập bênh
  ['FL', 'FR', 'BL', 'BR'].forEach((k, i) => { const a = TAU * (ph + pf[i]); A[k] = -amp * Math.sin(a); q.lift[k] = amp ? Math.max(0, Math.cos(a)) * 0.035 * (gait === 'run' ? 1.4 : 1) : 0; });
  A.TAIL = (o.tail ?? 0.15) + Math.sin(t * (gait === 'stand' ? 3 : 9)) * (gait === 'stand' ? 0.12 : 0.2);
  A.HEAD = (o.head ?? 0) + (gait === 'stand' ? Math.sin(t * 1.3 + 1) * 0.05 : Math.sin(TAU * ph * 2) * 0.05);
  // bám đất: hạ thân để bàn chân thấp nhất chạm sàn (chân xoay làm bàn chân nâng lên L·(1−cos a))
  // bám đất từng cặp trước/sau rồi cân thân cho thẳng (không chúi đầu, không xệ mông)
  const h = (k) => 0.36 * (1 - Math.cos(A[k])) + q.lift[k];
  const hF = Math.min(h('FL'), h('FR')), hB = Math.min(h('BL'), h('BR'));
  q.body.position.y = -0.5 * (hF + hB) * q.S + (amp ? 0.008 * q.S * Math.abs(Math.sin(TAU * ph * 2)) : Math.sin(t * 2.2) * 0.004 * q.S);
  q.body.rotation.x = Math.atan2(hF - hB, 0.58);
  if (o.leap) { const k = o.leap; A.FL = A.FR = -0.75 * k; A.BL = A.BR = 0.7 * k; q.lift.FL = q.lift.FR = q.lift.BL = q.lift.BR = 0; q.body.position.y = 0; q.body.rotation.x = -(o.pitch ?? 0.35) * k; A.TAIL = 0.1; }
  deform(q);
}
// GẤU đứng: walk (ph), armUp 0..1 (giơ tay phải lên úp rổ), roar 0..1 (ngửa đầu, rung)
export function poseBear(q, t, o = {}) {
  const A = q.A; const TAU = Math.PI * 2; const walk = o.walk ? 1 : 0; const ph = o.ph ?? t;
  const s = Math.sin(TAU * ph);
  A.LL = walk * 0.32 * s; A.LR = -walk * 0.32 * s; q.lift.LL = walk * Math.max(0, -Math.cos(TAU * ph)) * 0.03; q.lift.LR = walk * Math.max(0, Math.cos(TAU * ph)) * 0.03;
  const idle = Math.sin(t * 1.7) * 0.04;
  const cap = (x) => Math.max(-0.45, Math.min(0.45, x)); A.AL = cap(-walk * 0.22 * s + idle + (o.armL ?? 0)); A.AR = cap(walk * 0.22 * s - idle + (o.armR ?? 0));
  A.HEAD = (o.roar ?? 0) * 0.35 + Math.sin(t * 1.1) * 0.04 + (o.head ?? 0);
  const hmin = Math.min(0.28 * (1 - Math.cos(A.LL)) + q.lift.LL, 0.28 * (1 - Math.cos(A.LR)) + q.lift.LR);
  q.body.position.y = -hmin * q.S + Math.sin(t * 2) * 0.003 * q.S + (o.y ?? 0);
  q.body.rotation.z = walk * s * 0.05 + (o.roar ?? 0) * Math.sin(t * 40) * 0.01; q.body.rotation.x = -(o.roar ?? 0) * 0.08 + (o.lean ?? 0);
  if (o.sit) { const k = o.sit; A.LL = A.LR = 1.35 * k; q.lift.LL = q.lift.LR = 0; q.body.position.y = -0.33 * k * q.S / 2.13; q.body.rotation.x = -0.12 * k; }
  if (o.fly) { A.LL = 0.25; A.LR = -0.1; q.lift.LL = q.lift.LR = 0; q.body.position.y = o.y ?? 0; }
  deform(q);
}

// điểm đặc trưng trong hệ model: mõm sói (z lớn nhất ở vùng đầu), bụng/mõm gấu (x lớn nhất)
export function landmarks(q) { const P = q.P0; let best = -9, bi = 0, bb = -9, bj = 0;
  for (let i = 0; i < P.length; i += 3) { if (q.kind === 'coyote') { if (P[i + 1] > 0.05 && P[i + 2] > best) { best = P[i + 2]; bi = i; } }
    else { if (P[i + 1] > 0.3 && P[i] > best) { best = P[i]; bi = i; } if (P[i + 1] > -0.1 && P[i + 1] < 0.0 && P[i] > bb) { bb = P[i]; bj = i; } } }
  q.snout = new THREE.Vector3(P[bi], P[bi + 1], P[bi + 2]); if (q.kind === 'bear') q.belly = new THREE.Vector3(P[bj], P[bj + 1], P[bj + 2]); return q; }
export const worldOf = (q, p) => q.model.localToWorld(p.clone());
