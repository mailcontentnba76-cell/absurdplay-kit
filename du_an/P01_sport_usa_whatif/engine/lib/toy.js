// Phong cách "đồ chơi" cho kênh hài cặp đôi (P02): đầu to, da phẳng không vân, tay thả lỏng,
// quần áo RỜI (lớp vỏ skinned riêng phủ ngoài thân, dáng suông) thay cho màu vẽ dính lên thân.
// Dùng: const ch = makeCharacter(...); dressToy(ch, spec); rồi MỖI KHUNG sau khi đặt tư thế: ch.post();
import * as THREE from 'three';
import { aim, resetPose } from './tuthe.js';

const V = THREE.Vector3;
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function findBody(root) { let b = null; root.traverse((n) => { if (n.isSkinnedMesh && /Superhero/.test(n.material.name) && !b) b = n; }); return b; }

// Taubin trên tập đỉnh con (gộp đỉnh trùng vị trí để không nứt đường nối UV)
function smoothSubset(P, idx, inSet, iters, fixed) {
  const n = P.length / 3, key = new Map(), gid = new Int32Array(n); let G = 0;
  for (let i = 0; i < n; i++) { const k = `${P[i * 3].toFixed(4)},${P[i * 3 + 1].toFixed(4)},${P[i * 3 + 2].toFixed(4)}`; let v = key.get(k); if (v === undefined) { v = G++; key.set(k, v); } gid[i] = v; }
  const gp = new Float32Array(G * 3), act = new Uint8Array(G), fx = new Uint8Array(G);
  for (let i = 0; i < n; i++) { const q = gid[i]; gp.set([P[i * 3], P[i * 3 + 1], P[i * 3 + 2]], q * 3); if (inSet[i]) act[q] = 1; if (fixed && fixed[i]) fx[q] = 1; }
  const nb = Array.from({ length: G }, () => new Set());
  for (let i = 0; i < idx.length; i += 3) { const a = gid[idx[i]], b = gid[idx[i + 1]], c = gid[idx[i + 2]]; nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  const step = (src, lam) => { const out = src.slice(); for (let q = 0; q < G; q++) { if (!act[q] || fx[q] || !nb[q].size) continue; let x = 0, y = 0, z = 0; for (const m of nb[q]) { x += src[m * 3]; y += src[m * 3 + 1]; z += src[m * 3 + 2]; } const k = nb[q].size;
    out[q * 3] += lam * (x / k - src[q * 3]); out[q * 3 + 1] += lam * (y / k - src[q * 3 + 1]); out[q * 3 + 2] += lam * (z / k - src[q * 3 + 2]); } return out; };
  let cur = gp; for (let it = 0; it < iters; it++) cur = step(step(cur, 0.5), -0.53);
  for (let i = 0; i < n; i++) { const q = gid[i]; P[i * 3] = cur[q * 3]; P[i * 3 + 1] = cur[q * 3 + 1]; P[i * 3 + 2] = cur[q * 3 + 2]; }
}

export function dressToy(ch, S) {
  const root = ch.root, body = findBody(root); root.updateMatrixWorld(true);
  const M = body.matrixWorld.clone(), Mi = M.clone().invert();
  const g = body.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, N = pos.count;
  const bones = body.skeleton.bones;
  const BP = {}; for (const b of bones) BP[b.name] = b.getWorldPosition(new V());
  const W = new Float32Array(N * 3), dn = new Array(N);
  for (let i = 0; i < N; i++) { const v = new V().fromBufferAttribute(pos, i).applyMatrix4(M); W.set([v.x, v.y, v.z], i * 3);
    let best = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; best = si.getComponent(i, k); } } dn[i] = bones[best].name; }
  const sc = root.scale.y; // mọi khoảng cách tính theo mét đã co giãn
  const yArm = (BP.upperarm_l.y + BP.upperarm_r.y) / 2, yHip = BP.pelvis.y, yNeck = BP.neck_01.y;
  const isT = (i) => /spine_0[123]|clavicle/.test(dn[i]), isPel = (i) => /pelvis/.test(dn[i]);
  const armOf = (i) => { const m = /^(upperarm|lowerarm)_([lr])$/.exec(dn[i]); return m ? m[2] : null; };
  const legOf = (i) => { const m = /^(thigh|calf)_([lr])$/.exec(dn[i]); return m ? m[2] : null; };
  // tâm thân theo độ cao (bin 2 cm)
  const bins = new Map(), BIN = 0.02 * sc;
  for (let i = 0; i < N; i++) if (isT(i) || isPel(i)) { const k = Math.round(W[i * 3 + 1] / BIN); const e = bins.get(k) || { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 }; e.x0 = Math.min(e.x0, W[i * 3]); e.x1 = Math.max(e.x1, W[i * 3]); e.z0 = Math.min(e.z0, W[i * 3 + 2]); e.z1 = Math.max(e.z1, W[i * 3 + 2]); bins.set(k, e); }
  // flatChest: tâm z lấy từ mặt LƯNG + nửa bề dày eo (ngực không kéo tâm ra trước)
  let halfD = 0; { const e = bins.get(Math.round((yHip + 0.14 * sc) / BIN)); halfD = e ? (e.z1 - e.z0) / 2 : 0.1 * sc; }
  const center = (y) => { const k = Math.round(y / BIN); for (let d = 0; d < 20; d++) for (const kk of [k - d, k + d]) { const e = bins.get(kk); if (e) return [(e.x0 + e.x1) / 2, S.flatChest ? e.z0 + halfD : (e.z0 + e.z1) / 2]; } return [0, 0]; };
  // elip ngực (dưới nách) -> thân áo suông
  let ax = 0, bzF = 0, bzB = 0;
  for (let i = 0; i < N; i++) { if (!isT(i)) continue; const y = W[i * 3 + 1]; if (y < yArm - 0.2 * sc || y > yArm - 0.05 * sc) continue; const [cx, cz] = center(y); const dx = W[i * 3] - cx, dz = W[i * 3 + 2] - cz; ax = Math.max(ax, Math.abs(dx)); if (dz > 0) bzF = Math.max(bzF, dz); else bzB = Math.max(bzB, -dz); }
  if (S.flatChest) bzF = Math.min(bzF, bzB * 1.0);
  const ell = (ux, uz) => { const bz = uz > 0 ? bzF : bzB; return 1 / Math.sqrt((ux / ax) ** 2 + (uz / bz) ** 2); };
  const axis = (a, b, x, y, z) => { const A = BP[a], B = BP[b], d = B.clone().sub(A), L2 = d.lengthSq(); const p = new V(x, y, z).sub(A); const t = p.dot(d) / L2; const o = A.clone().addScaledVector(d, t); return { t, o, r: new V(x, y, z).sub(o) }; };
  // ---- 1) thu thân bên trong để không đâm xuyên áo (thân, tay, chân), dẹt ngực nếu flatChest ----
  for (let i = 0; i < N; i++) { const x = W[i * 3], y = W[i * 3 + 1], z = W[i * 3 + 2]; let nx = x, nz = z, ny = y;
    if (isT(i) || isPel(i)) { const [cx, cz] = center(y); let dx = x - cx, dz = z - cz; if (S.flatChest && dz > bzF * 0.82) dz = bzF * 0.82; const k = lerp(0.86, 1, sstep(yNeck - 0.08 * sc, yNeck - 0.01 * sc, y)); nx = cx + dx * k; nz = cz + dz * k; }
    else { const s = armOf(i), l = legOf(i);
      if (s) { const a = axis('upperarm_' + s, 'hand_' + s, x, y, z); const k = lerp(0.88, 1, sstep(0.86, 0.97, a.t)); const p = a.o.clone().addScaledVector(a.r, k); nx = p.x; ny = p.y; nz = p.z; }
      if (l) { const a = axis('thigh_' + l, 'foot_' + l, x, y, z); const k = lerp(0.9, 1, sstep(0.9, 1.0, a.t)); const p = a.o.clone().addScaledVector(a.r, k); nx = p.x; ny = p.y; nz = p.z; } }
    const v = new V(nx, ny, nz).applyMatrix4(Mi); pos.setXYZ(i, v.x, v.y, v.z); }
  pos.needsUpdate = true; g.computeVertexNormals();
  const idxAll = g.index.array;
  const shell = (sel, place, colorOf, iters) => {
    const P = new Float32Array(N * 3), C = new Float32Array(N * 3), inSet = new Uint8Array(N);
    for (let i = 0; i < N; i++) { const x = W[i * 3], y = W[i * 3 + 1], z = W[i * 3 + 2]; if (sel(i)) { inSet[i] = 1; const p = place(i, x, y, z); P.set([p.x, p.y, p.z], i * 3); const c = colorOf(i, x, y, z); C.set([c.r, c.g, c.b], i * 3); } else P.set([x, y, z], i * 3); }
    const tri = []; for (let k = 0; k < idxAll.length; k += 3) { const a = idxAll[k], b = idxAll[k + 1], c = idxAll[k + 2]; if (inSet[a] && inSet[b] && inSet[c]) tri.push(a, b, c); }
    smoothSubset(P, tri, inSet, iters);
    const v = new V(); for (let i = 0; i < N; i++) { v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(Mi); P.set([v.x, v.y, v.z], i * 3); }
    const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.BufferAttribute(P, 3)); ng.setAttribute('color', new THREE.BufferAttribute(C, 3));
    ng.setAttribute('skinIndex', si.clone()); ng.setAttribute('skinWeight', sw.clone()); ng.setIndex(tri); ng.computeVertexNormals();
    const m = new THREE.SkinnedMesh(ng, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, side: THREE.FrontSide }));
    m.position.copy(body.position); m.quaternion.copy(body.quaternion); m.scale.copy(body.scale); m.bind(body.skeleton, body.bindMatrix);
    m.castShadow = m.receiveShadow = true; m.frustumCulled = false; body.parent.add(m); return m; };
  const lin = (c) => new THREE.Color(c);
  const out = {};
  // ---- 2) áo (hoodie / áo len): thân suông theo elip ngực, tay áo ống rộng, bo gấu + bo tay, túi trước ----
  if (S.top) { const T = S.top, off = (T.off ?? 0.03) * sc, base = lin(T.color), band = lin(T.band || T.color), pocket = lin(T.pocket || T.color);
    const yHem = yHip - (T.hemDrop ?? 0.0) * sc;
    let Ru = { l: 0, r: 0 }; for (let i = 0; i < N; i++) { const s = armOf(i); if (!s) continue; const a = axis('upperarm_' + s, 'hand_' + s, W[i * 3], W[i * 3 + 1], W[i * 3 + 2]); if (a.t > 0.08 && a.t < 0.3) Ru[s] = Math.max(Ru[s], a.r.length()); }
    out.top = shell((i) => isT(i) || armOf(i) || (isPel(i) && W[i * 3 + 1] > yHem) || (/neck/.test(dn[i]) && W[i * 3 + 1] < yNeck - 0.02 * sc && T.kind === 'hoodie'),
      (i, x, y, z) => { const s = armOf(i);
        if (s) { const a = axis('upperarm_' + s, 'hand_' + s, x, y, z); const r = a.r.length(), R = lerp(Ru[s] * 0.94, Ru[s] * (T.cuffK ?? 0.8), sstep(0.3, 0.95, a.t)); const rn = Math.max(r, R) + off * 0.7; return a.o.clone().addScaledVector(a.r.normalize(), rn); }
        const [cx, cz] = center(y); const dx = x - cx, dz = z - cz, r = Math.hypot(dx, dz), ux = dx / r, uz = dz / r;
        const w = sstep(yArm - 0.03 * sc, yArm - 0.12 * sc, y); let rs = r; if (S.flatChest && dz > 0) rs = Math.min(r, ell(ux, uz) * 1.0);
        const rn = lerp(rs + off + (y > yArm - 0.04 * sc ? 0.012 * sc : 0), Math.max(ell(ux, uz) * (T.loose ?? 1.06), rs) + off, w) + (y < yHip + 0.1 * sc ? (yHip + 0.1 * sc - y) * 0.45 + (dz < 0 ? 0.012 * sc : 0) : 0);
        return new V(cx + ux * rn, y, cz + uz * rn); },
      (i, x, y, z) => { const s = armOf(i); if (s) { const a = axis('upperarm_' + s, 'hand_' + s, x, y, z); return a.t > 0.9 ? band : base; }
        if (y < yHem + 0.045 * sc) return band; const [cx, cz] = center(y); const dx = x - cx, dz = z - cz;
        if (T.pocket && dz > 0 && Math.abs(dx) < ax * 0.6 && y > yHem + 0.06 * sc && y < yHem + 0.2 * sc) return pocket; return base; }, 8);
    if (T.kind === 'hoodie') { // dây rút (mũ trùm bỏ: torus đâm xuyên vai ở cận cảnh)
      const hm = new THREE.MeshStandardMaterial({ color: T.hood || T.color, roughness: 0.92, side: THREE.DoubleSide });
      const nk = BP.neck_01.clone(); const [cx, cz] = center(yNeck - 0.04 * sc);
      const dm = new THREE.MeshStandardMaterial({ color: T.strings || '#f2efe6', roughness: 0.8 });
      for (const sd of [-1, 1]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * sc, 0.004 * sc, 0.13 * sc, 6), dm); st.position.set(cx + sd * 0.035 * sc, nk.y - 0.11 * sc, cz + bzF + off + 0.006 * sc); root.add(st); ch.bones.spine_03.attach(st); }
    }
  }
  // ---- 3) quần ống suông ----
  if (S.bottom) { const Bt = S.bottom, off = (Bt.off ?? 0.02) * sc, base = lin(Bt.color), hem = lin(Bt.hem || Bt.color);
    let Rt = { l: 0, r: 0 }; for (let i = 0; i < N; i++) { const l = legOf(i); if (!l) continue; const a = axis('thigh_' + l, 'foot_' + l, W[i * 3], W[i * 3 + 1], W[i * 3 + 2]); if (a.t > 0.08 && a.t < 0.25) Rt[l] = Math.max(Rt[l], a.r.length()); }
    out.bottom = shell((i) => isPel(i) || legOf(i),
      (i, x, y, z) => { const l = legOf(i);
        if (l) { const a = axis('thigh_' + l, 'foot_' + l, x, y, z); const r = a.r.length(); const R = lerp(Rt[l] * 0.95, Rt[l] * (Bt.hemK ?? 0.72), sstep(0.1, 0.95, a.t)); const rn = Math.max(r, R) + off; return a.o.clone().addScaledVector(a.r.normalize(), rn); }
        const [cx, cz] = center(y); const dx = x - cx, dz = z - cz, r = Math.hypot(dx, dz) || 1; const rn = r + (y > yHip - 0.02 * sc ? -0.004 * sc : off); return new V(cx + dx / r * rn, y, cz + dz / r * rn); },
      (i, x, y, z) => { const l = legOf(i); if (l) { const a = axis('thigh_' + l, 'foot_' + l, x, y, z); if (a.t > 0.93) return hem; } return base; }, 6);
  }
  // ---- 4) da phẳng (bỏ texture vân da), đầu to, tay thả lỏng ----
  { const m = body.material; m.map = null; m.metalnessMap = null; m.roughnessMap = null; m.aoMap = null; m.normalMap = null; m.color.set('#ffffff'); m.needsUpdate = true; }
  const rest = {}; for (const [n, b] of Object.entries(ch.bones)) rest[n] = b.quaternion.clone();
  const FING = Object.keys(ch.bones).filter((n) => /^(index|middle|pinky|ring|thumb)_0\d_[lr]$/.test(n));
  const headK = S.headK ?? 1.5, handK = S.handK ?? 1.12, neckK = S.neckK ?? 0.9, legK = S.legK ?? 1;
  const ball0 = Math.min(ch.bones.ball_l.getWorldPosition(new V()).y, ch.bones.ball_r.getWorldPosition(new V()).y) - root.position.y;
  // post(): gọi MỖI KHUNG sau khi đặt tư thế. ground=true: hạ người cho chân chạm sàn (chân đã rút ngắn bằng legK); để false khi ngồi.
  ch.post = ({ relax = S.relaxHands ?? 0.8, ground = false } = {}) => {
    ch.bones.Head.scale.setScalar(headK / neckK); if (ch.bones.neck_01) ch.bones.neck_01.scale.setScalar(neckK);
    for (const s of ['l', 'r']) { if (ch.bones['hand_' + s]) ch.bones['hand_' + s].scale.setScalar(handK); ch.bones['thigh_' + s].scale.setScalar(legK); ch.bones['foot_' + s].scale.setScalar(1 / legK); }
    if (relax > 0) for (const n of FING) ch.bones[n].quaternion.slerp(rest[n], relax);
    root.updateMatrixWorld(true);
    if (ground) { const b = Math.min(ch.bones.ball_l.getWorldPosition(new V()).y, ch.bones.ball_r.getWorldPosition(new V()).y); root.position.y += ball0 - (b - root.position.y); root.updateMatrixWorld(true); }
  };
  ch.post();
  return out;
}

// Ngồi sofa: ngồi sâu, lưng tựa ra sau, đùi nằm ngang, cẳng chân thả xuống sàn, tay đặt hờ lên đùi. seatY = mặt đệm (m).
const L = (ch, x, y, z) => new V(x, y, z).applyQuaternion(ch.root.getWorldQuaternion(new THREE.Quaternion()));
export function sofaSit(ch, x, z, seatY, t = 0, seed = 0, o = {}) {
  resetPose(ch); const B = ch.bones, br = Math.sin(t * 1.6 + seed) * 0.012;
  const lean = o.lean ?? 0.3, spread = o.spread ?? 0.1;
  aim(B.spine_01, B.spine_02, L(ch, 0, 1, -lean));
  aim(B.spine_02, B.spine_03, L(ch, 0, 1, -lean * 0.4 + br));
  aim(B.spine_03, B.neck_01, L(ch, 0, 1, 0.15));
  aim(B.neck_01, B.Head, L(ch, (o.headTurn ?? 0) * 0.5, 1, 0.28 + (o.headDown ?? 0)));
  for (const [s, q] of [['l', 1], ['r', -1]]) {
    aim(B['thigh_' + s], B['calf_' + s], L(ch, q * spread, -0.05, 1));
    aim(B['calf_' + s], B['foot_' + s], L(ch, q * 0.03, -1, 0.12));
    aim(B['foot_' + s], B['ball_' + s], L(ch, q * 0.05, -0.15, 1));
    aim(B['upperarm_' + s], B['lowerarm_' + s], L(ch, q * 0.14, -1, 0.18));
    aim(B['lowerarm_' + s], B['hand_' + s], L(ch, -q * 0.18, -0.75, 1));
    aim(B['hand_' + s], B['middle_01_' + s], L(ch, -q * 0.05, -0.55, 1));
  }
  ch.root.position.set(x, 0, z); ch.root.updateMatrixWorld(true);
  const pv = B.pelvis.getWorldPosition(new V()); ch.root.position.y += seatY + 0.08 * ch.root.scale.y - pv.y; ch.root.updateMatrixWorld(true);
}
