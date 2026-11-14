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
  const cxN0 = center(yArm)[0];
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
  // ---- 1b) làm phẳng vùng miệng: chiếu các đỉnh môi + khoang miệng lên mặt bậc hai nội suy từ má/cằm xung quanh.
  //      Miệng chỉ còn là nét vẽ (môi 3D + khe miệng cắt ngang nét miệng chiếu phẳng). ----
  if (S.flatMouth !== false) { let eb = new THREE.Box3(); root.traverse((n) => { if (n.isSkinnedMesh && /Eye/.test(n.material.name)) eb.expandByObject(n); });
    if (!eb.isEmpty()) { const ec = eb.getCenter(new V()), u = sc; const fit = [], inner = [];
      for (let i = 0; i < N; i++) { if (!/Head|neck/.test(dn[i])) continue; const v = new V().fromBufferAttribute(pos, i).applyMatrix4(M); const dx = (v.x - ec.x) / u, dy = (v.y - ec.y) / u, dz = (v.z - ec.z) / u;
        const inIn = Math.abs(dx) < 0.04 && dy < -0.05 && dy > -0.112 && dz > -0.1; const inRing = Math.abs(dx) < 0.062 && dy < -0.02 && dy > -0.135 && dz > -0.06;
        if (inIn) inner.push([i, v, dx, dy]); else if (inRing) fit.push([dx, dy, dz]); }
      // bình phương tối thiểu z = c0 + c1 x + c2 y + c3 x² + c4 y² + c5 xy
      const A = Array.from({ length: 6 }, () => new Float64Array(7));
      for (const [x, y, z] of fit) { const f = [1, x, y, x * x, y * y, x * y]; for (let r = 0; r < 6; r++) { for (let c = 0; c < 6; c++) A[r][c] += f[r] * f[c]; A[r][6] += f[r] * z; } }
      for (let c = 0; c < 6; c++) { let p = c; for (let r = c + 1; r < 6; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; for (let r = 0; r < 6; r++) if (r !== c) { const k = A[r][c] / A[c][c]; for (let q = c; q < 7; q++) A[r][q] -= k * A[c][q]; } }
      const co = A.map((r, k) => r[6] / r[k]);
      if (fit.length > 12 && co.every(Number.isFinite)) for (const [i, v, x, y] of inner) { const z = co[0] + co[1] * x + co[2] * y + co[3] * x * x + co[4] * y * y + co[5] * x * y; // trọng số: 1 ở lõi miệng và trong khoang, giảm dần ra mép (không lộ viền)
        const dzv = (v.z - ec.z) / u - z, wgt = dzv < -0.012 ? 1 : Math.min(sstep(0.04, 0.026, Math.abs(x)), sstep(-0.05, -0.064, y), sstep(-0.112, -0.098, y));
        v.z = lerp(v.z, ec.z + z * u, wgt); v.applyMatrix4(Mi); pos.setXYZ(i, v.x, v.y, v.z); } } }
  pos.needsUpdate = true; g.computeVertexNormals();
  const idxAll = g.index.array;
  // Họa tiết vải (shader, theo vị trí tư thế gốc tính bằng mét → nét sắc, không phụ thuộc lưới, không trôi khi cử động):
  //   pat = { type: 'plaid'|'stripes', c1 nền, c2 sọc đậm, c3 chỉ mảnh, size (m), print: { text, sub, color, w, h, y } }
  //   Chỉ tô vùng mang màu nền (bo gấu/bo tay/túi giữ màu riêng).
  const printTex = (pr) => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g2 = c.getContext('2d'); g2.textAlign = 'center'; g2.textBaseline = 'middle';
    g2.fillStyle = pr.color || '#b4573a'; let fs = 260; g2.font = `900 ${fs}px Anton, Impact, sans-serif`; while (g2.measureText(pr.text).width > 960 && fs > 40) { fs -= 8; g2.font = `900 ${fs}px Anton, Impact, sans-serif`; }
    g2.fillText(pr.text, 512, pr.sub ? 210 : 256); if (pr.sub) { g2.fillStyle = pr.subColor || pr.color; g2.font = `italic 700 150px Georgia, serif`; g2.fillText(pr.sub, 512, 410); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const shell = (sel, place, colorOf, iters, pat = null) => {
    const P = new Float32Array(N * 3), C = new Float32Array(N * 3), PT = new Float32Array(N), inSet = new Uint8Array(N);
    for (let i = 0; i < N; i++) { const x = W[i * 3], y = W[i * 3 + 1], z = W[i * 3 + 2]; if (sel(i)) { inSet[i] = 1; const p = place(i, x, y, z); P.set([p.x, p.y, p.z], i * 3); const c = colorOf(i, x, y, z); C.set([c.r, c.g, c.b], i * 3); PT[i] = pat && c === pat.base ? 1 : 0; } else P.set([x, y, z], i * 3); }
    const tri = []; for (let k = 0; k < idxAll.length; k += 3) { const a = idxAll[k], b = idxAll[k + 1], c = idxAll[k + 2]; if (inSet[a] && inSet[b] && inSet[c]) tri.push(a, b, c); }
    smoothSubset(P, tri, inSet, iters);
    const BPw = new Float32Array(N * 3); for (let i = 0; i < N * 3; i++) BPw[i] = P[i] / sc; // vị trí gốc (m, chia tỉ lệ) cho họa tiết
    const NZ = new Float32Array(N); { const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(P.slice(), 3)); tg.setIndex(tri); tg.computeVertexNormals(); const nn = tg.attributes.normal; for (let i = 0; i < N; i++) NZ[i] = nn.getZ(i); }
    const v = new V(); for (let i = 0; i < N; i++) { v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(Mi); P.set([v.x, v.y, v.z], i * 3); }
    const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.BufferAttribute(P, 3)); ng.setAttribute('color', new THREE.BufferAttribute(C, 3));
    ng.setAttribute('bpos', new THREE.BufferAttribute(BPw, 3)); ng.setAttribute('pat', new THREE.BufferAttribute(PT, 1)); ng.setAttribute('bnz', new THREE.BufferAttribute(NZ, 1));
    ng.setAttribute('skinIndex', si.clone()); ng.setAttribute('skinWeight', sw.clone()); ng.setIndex(tri); ng.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
    const U = { uType: { value: !pat ? 0 : pat.type === 'plaid' ? 1 : pat.type === 'stripes' ? 2 : 0 }, uC1: { value: lin(pat?.c1 || '#ffffff') }, uC2: { value: lin(pat?.c2 || '#000000') }, uC3: { value: lin(pat?.c3 || '#000000') }, uSize: { value: pat?.size ?? 0.06 },
      uPrint: { value: pat?.print ? printTex(pat.print) : null }, uPO: { value: new THREE.Vector2(cxN0 / sc, ((pat?.print?.y) ?? (yArm / sc - 0.16))) }, uPS: { value: new THREE.Vector2(pat?.print?.w ?? 0.2, pat?.print?.h ?? 0.1) } };
    mat.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 bpos; attribute float pat; attribute float bnz; varying vec3 vBP; varying float vPat; varying float vNZ;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvBP = bpos; vPat = pat; vNZ = bnz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vBP; varying float vPat; varying float vNZ; uniform int uType; uniform vec3 uC1, uC2, uC3; uniform float uSize; uniform sampler2D uPrint; uniform vec2 uPO, uPS;\n' + (pat?.print ? '#define HAS_PRINT\n' : ''))
        .replace('#include <color_fragment>', `#include <color_fragment>
if (vPat > 0.5) {
  if (uType == 1) { // caro flannel: hai dải đậm giao nhau + chỉ mảnh
    vec2 q = fract(vec2(vBP.x + vBP.z * 0.35, vBP.y) / uSize);
    float a = step(0.5, q.x), b = step(0.5, q.y);
    vec3 c = mix(uC1, uC2, 0.55 * max(a, b) + 0.45 * a * b);
    float th = max(step(abs(q.x - 0.75), 0.03), step(abs(q.y - 0.75), 0.03));
    diffuseColor.rgb = mix(c, uC3, th * 0.8);
  } else if (uType == 2) { float q = fract(vBP.y / uSize); diffuseColor.rgb = q < 0.38 ? uC2 : uC1; }
  else diffuseColor.rgb = uC1;
#ifdef HAS_PRINT
  vec2 pq = (vBP.xy - uPO) / uPS + 0.5;
  if (vNZ > 0.35 && pq.x > 0.0 && pq.x < 1.0 && pq.y > 0.0 && pq.y < 1.0) { vec4 pc = texture2D(uPrint, pq); diffuseColor.rgb = mix(diffuseColor.rgb, pc.rgb, pc.a * 0.95); }
#endif
}
if (!gl_FrontFacing) diffuseColor.rgb *= 0.78;`); }; // mặt trong áo tối hơn
    mat.customProgramCacheKey = () => 'cloth' + (pat?.print ? 'P' : '');
    const m = new THREE.SkinnedMesh(ng, mat);
    m.position.copy(body.position); m.quaternion.copy(body.quaternion); m.scale.copy(body.scale); m.bind(body.skeleton, body.bindMatrix);
    m.castShadow = m.receiveShadow = true; m.frustumCulled = false; body.parent.add(m); covered.push(inSet); return m; };
  const covered = [];
  const lin = (c) => new THREE.Color(c);
  const out = {};
  // ---- 2) áo: thân suông theo elip ngực; tay dài / ngắn (sleeve:'short'); bo gấu + bo tay; túi trước (hoodie) ----
  // đường viền cổ: mặt phẳng nghiêng (trước thấp hơn sau) thay cho ranh giới theo xương (bị răng cưa)
  const [cxN, czN] = center(yNeck - 0.04 * sc);
  const mkCut = (T) => { const yc = yNeck - (T.neckDrop ?? -0.045) * sc, tilt = T.neckTilt ?? 0.35; return (z) => yc - tilt * (z - czN); };
  const torsoAt = (x, y, z, off, loose, yHemF) => { const [cx, cz] = center(y); const dx = x - cx, dz = z - cz, r = Math.hypot(dx, dz), ux = dx / r, uz = dz / r;
    const w = sstep(yArm - 0.03 * sc, yArm - 0.12 * sc, y); let rs = r; if (S.flatChest && dz > 0) rs = Math.min(r, ell(ux, uz) * 1.0);
    const rn = lerp(rs + off + (y > yArm - 0.04 * sc ? 0.012 * sc : 0), Math.max(ell(ux, uz) * loose, rs) + off, w) + (y < yHemF + 0.1 * sc ? (yHemF + 0.1 * sc - y) * 0.45 + (dz < 0 ? 0.012 * sc : 0) : 0);
    return new V(cx + ux * rn, y, cz + uz * rn); };
  const collar = (cutY, pad, rad, color, dy = 0) => { // bo cổ: ống tròn chạy theo đường viền cổ, che mép lưới
    let a = 0, bF = 0, bB = 0; for (let i = 0; i < N; i++) { if (!(isT(i) || /neck/.test(dn[i]))) continue; const x = W[i * 3], y = W[i * 3 + 1], z = W[i * 3 + 2]; if (Math.abs(y - cutY(z)) > 0.012 * sc) continue; a = Math.max(a, Math.abs(x - cxN)); if (z > czN) bF = Math.max(bF, z - czN); else bB = Math.max(bB, czN - z); }
    const pts = []; for (let k = 0; k < 64; k++) { const th = k / 64 * Math.PI * 2, z = czN + Math.sin(th) * (Math.sin(th) > 0 ? bF : bB) + Math.sin(th) * pad; pts.push(new V(cxN + Math.cos(th) * (a + pad), cutY(z) + (0.002 + dy) * sc, z)); }
    const ring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 96, rad * sc, 10, true), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
    ring.castShadow = true; root.add(ring); ch.bones.spine_03.attach(ring);
    { // tấm lót cổ: vành phẳng từ cổ ra tới bo cổ, che khe nhìn vào mặt trong áo
      const pos2 = [], idx2 = []; for (let k = 0; k < 64; k++) { const th = k / 64 * Math.PI * 2, sn = Math.sin(th), b = sn > 0 ? bF : bB;
        for (const [ka, kb] of [[0.97, 0], [1, pad]]) { const z = czN + sn * b * ka + sn * kb; pos2.push(cxN + Math.cos(th) * (a * ka + kb), cutY(z) + (0.001 + dy) * sc, z); } }
      for (let k = 0; k < 64; k++) { const a0 = k * 2, b0 = ((k + 1) % 64) * 2; idx2.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pos2, 3)); lg.setIndex(idx2); lg.computeVertexNormals();
      const lm = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.8), roughness: 0.95, side: THREE.DoubleSide })); root.add(lm); ch.bones.spine_03.attach(lm); }
    return ring; };
  if (S.top) { const T = S.top, off = (T.off ?? 0.03) * sc, base = lin(T.color), band = lin(T.band || T.color), pocket = lin(T.pocket || T.color);
    const yHem = yHip - (T.hemDrop ?? 0.0) * sc, sleeveTo = T.sleeve === 'short' ? 0.42 : 2, cutY = mkCut(T);
    let Ru = { l: 0, r: 0 }; for (let i = 0; i < N; i++) { const s = armOf(i); if (!s) continue; const a = axis('upperarm_' + s, 'hand_' + s, W[i * 3], W[i * 3 + 1], W[i * 3 + 2]); if (a.t > 0.08 && a.t < 0.3) Ru[s] = Math.max(Ru[s], a.r.length()); }
    const armT = (i) => { const s = armOf(i); return s ? axis('upperarm_' + s, 'hand_' + s, W[i * 3], W[i * 3 + 1], W[i * 3 + 2]).t : -1; };
    const inNeck = (i) => (isT(i) || /neck/.test(dn[i])) && W[i * 3 + 1] < cutY(W[i * 3 + 2]);
    out.top = shell((i) => inNeck(i) || (armOf(i) && armT(i) < sleeveTo) || (isPel(i) && W[i * 3 + 1] > yHem),
      (i, x, y, z) => { const s = armOf(i);
        if (s) { const a = axis('upperarm_' + s, 'hand_' + s, x, y, z); const r = a.r.length(), R = T.sleeve === 'short' ? Ru[s] * 1.02 : lerp(Ru[s] * 0.94, Ru[s] * (T.cuffK ?? 0.8), sstep(0.3, 0.95, a.t)); const rn = Math.max(r, R) + off * 0.7; return a.o.clone().addScaledVector(a.r.normalize(), rn); }
        return torsoAt(x, y, z, off, T.loose ?? 1.06, yHip); },
      (i, x, y, z) => { const s = armOf(i); if (s) { const a = axis('upperarm_' + s, 'hand_' + s, x, y, z); return a.t > (T.sleeve === 'short' ? 0.36 : 0.9) ? band : base; }
        if (y < yHem + 0.045 * sc) return band; const [cx, cz] = center(y); const dx = x - cx, dz = z - cz;
        if (T.pocket && dz > 0 && Math.abs(dx) < ax * 0.6 && y > yHem + 0.06 * sc && y < yHem + 0.2 * sc) return pocket; return base; }, 8, T.pattern ? { ...T.pattern, base } : null);
    if (!S.outer) out.collar = collar(cutY, off + 0.008 * sc, T.collarR ?? 0.016, T.band || T.color);
    if (T.kind === 'hoodie') { // dây rút
      const nk = BP.neck_01.clone(); const [cx, cz] = center(yNeck - 0.04 * sc);
      const dm = new THREE.MeshStandardMaterial({ color: T.strings || '#f2efe6', roughness: 0.8 });
      for (const sd of [-1, 1]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.004 * sc, 0.004 * sc, 0.13 * sc, 6), dm); st.position.set(cx + sd * 0.035 * sc, nk.y - 0.11 * sc, cz + bzF + off + 0.006 * sc); root.add(st); ch.bones.spine_03.attach(st); }
    }
  }
  // ---- 2b) áo khoác ngoài không tay (gile phao chần bông): lớp vỏ thứ hai quanh thân, đường chần ngang, cổ đứng ----
  if (S.outer) { const O = S.outer, offT = ((S.top && S.top.off) ?? 0.03) * sc, off = offT + (O.off ?? 0.035) * sc, base = lin(O.color), quilt = lin(O.quilt || O.color), band = lin(O.band || O.color);
    const yHem = yHip + (O.hemUp ?? 0.0) * sc, cutY = mkCut({ neckDrop: O.neckDrop ?? -0.06, neckTilt: O.neckTilt ?? 0.5 }), step = (O.quiltStep ?? 0.085) * sc;
    const ar = (i) => { if (!/clavicle/.test(dn[i])) return false; return true; };
    out.outer = shell((i) => ((isT(i) || /neck/.test(dn[i])) && W[i * 3 + 1] < cutY(W[i * 3 + 2])) || (isPel(i) && W[i * 3 + 1] > yHem),
      (i, x, y, z) => { const p = torsoAt(x, y, z, off, (O.loose ?? 1.1), yHip); if (/clavicle/.test(dn[i])) { const [cx] = center(y); const k = 1 - 0.18 * sstep(0.1 * sc, 0.2 * sc, Math.abs(x - cx)); p.x = cx + (p.x - cx) * k; } return p; },
      (i, x, y, z) => { if (y < yHem + 0.035 * sc) return band; const q = ((y - yHem) / step) % 1; return q < (O.quiltW ?? 0.16) ? quilt : base; }, 10);
    out.outerCollar = collar(cutY, off * 0.6, O.collarR ?? 0.016, O.band || O.color, 0.006);
    if (O.zip) { // khoá kéo giữa ngực: dải mảnh bám theo mặt trước
      const zm = new THREE.MeshStandardMaterial({ color: O.zip, roughness: 0.5, metalness: 0.2 }); const pts = [];
      for (let y = yHem + 0.01 * sc; y < cutY(czN + bzF) - 0.005 * sc; y += 0.02 * sc) { const p = torsoAt(cxN, y, center(y)[1] + 1, off, O.loose ?? 1.1, yHip); pts.push(new V(center(y)[0], y, p.z + 0.004 * sc)); }
      if (pts.length > 2) { const zg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0025 * sc, 6, false); const zz = new THREE.Mesh(zg, zm); root.add(zz); ch.bones.spine_02.attach(zz); out.zip = zz; } }
  }
  // ---- 3) quần: ống suông (mặc định) hoặc bó (fit:true, legging/skinny) ----
  if (S.bottom) { const Bt = S.bottom, off = (Bt.off ?? 0.02) * sc, base = lin(Bt.color), hem = lin(Bt.hem || Bt.color);
    let Rt = { l: 0, r: 0 }; for (let i = 0; i < N; i++) { const l = legOf(i); if (!l) continue; const a = axis('thigh_' + l, 'foot_' + l, W[i * 3], W[i * 3 + 1], W[i * 3 + 2]); if (a.t > 0.08 && a.t < 0.25) Rt[l] = Math.max(Rt[l], a.r.length()); }
    ch.seatPad = Math.max(Rt.l, Rt.r) * 0.95 + off; // khớp hông cao hơn mặt đệm bằng bán kính đùi + quần (để ngồi không lún vào ghế)
    out.bottom = shell((i) => isPel(i) || legOf(i),
      (i, x, y, z) => { const l = legOf(i);
        if (l) { const a = axis('thigh_' + l, 'foot_' + l, x, y, z); const r = a.r.length(); const R = Bt.fit ? 0 : lerp(Rt[l] * 0.95, Rt[l] * (Bt.hemK ?? 0.72), sstep(0.1, 0.95, a.t)); const rn = Math.max(r, R) + off; return a.o.clone().addScaledVector(a.r.normalize(), rn); }
        const [cx, cz] = center(y); const dx = x - cx, dz = z - cz, r = Math.hypot(dx, dz) || 1; const rn = r + (y > yHip - 0.02 * sc ? -0.004 * sc : off); return new V(cx + dx / r * rn, y, cz + dz / r * rn); },
      (i, x, y, z) => { const l = legOf(i); if (l) { const a = axis('thigh_' + l, 'foot_' + l, x, y, z); if (a.t > 0.93) return hem; } return base; }, Bt.fit ? 3 : 6);
  }
  // ---- 3b) giày sneaker: khối bo tròn theo bàn chân, đế + viền gót + dải bên, gắn xương foot ----
  if (S.shoes) { const Sh = S.shoes, cov = new Uint8Array(N); for (let i = 0; i < N; i++) if (/^(foot|ball)_/.test(dn[i])) cov[i] = 1; covered.push(cov);
    let fy = 1e9; for (let i = 0; i < N; i++) if (cov[i]) fy = Math.min(fy, W[i * 3 + 1]);
    for (const s of ['l', 'r']) { const F = BP['foot_' + s], Bl = BP['ball_' + s]; const d = new V(Bl.x - F.x, 0, Bl.z - F.z); const dl = d.length(); d.normalize();
      const heel = F.clone().addScaledVector(d, -0.5 * dl), toe = Bl.clone().addScaledVector(d, 0.72 * dl); const Lg = heel.distanceTo(new V(toe.x, heel.y, toe.z));
      const Hh = (Sh.heelH ?? 0.1) * sc, Ht = (Sh.toeH ?? 0.058) * sc, Wd = (Sh.width ?? 0.105) * sc, g = new THREE.BoxGeometry(1, 1, 1, 16, 12, 28); const P = g.attributes.position, C = [], v = new V();
      const ups = lin(Sh.color), sole = lin(Sh.sole || '#f4f1ea'), line = lin(Sh.line || '#c9c3b6'), acc = lin(Sh.accent || Sh.color), n = 3.2;
      for (let k = 0; k < P.count; k++) { v.fromBufferAttribute(P, k); const a = v.x * 2, b = v.y * 2, c = v.z * 2; // hộp bo tròn (siêu elip)
        const m = Math.max(Math.abs(a), Math.abs(b), Math.abs(c)), q = Math.pow(Math.pow(Math.abs(a), n) + Math.pow(Math.abs(b), n) + Math.pow(Math.abs(c), n), 1 / n) / m;
        const ux = a / q / 2, uy = b / q / 2, uz = c / q / 2, fz = uz + 0.5, fyy = Math.max(0, uy + 0.5); // fz: 0 gót → 1 mũi
        const w = Wd * (1 - 0.16 * sstep(0.78, 1, fz) - 0.1 * sstep(0.18, 0, fz)), h = lerp(Hh, Ht, sstep(0.3, 0.95, fz));
        P.setXYZ(k, ux * w, fyy * h, (fz - 0.5) * Lg); const ex = Math.abs(ux) * 2;
        const col = fyy < 0.17 ? sole : fyy < 0.22 ? line : (fyy > 0.32 && fyy < 0.72 && fz > 0.28 && fz < 0.72 && ex > 0.8 && Sh.accent) ? acc : (fz < 0.12 && fyy > 0.45 && Sh.accent) ? acc : ups; C.push(col.r, col.g, col.b); }
      g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })); m.castShadow = true;
      const mid = heel.clone().lerp(new V(toe.x, heel.y, toe.z), 0.5); m.position.set(mid.x, fy - 0.002 * sc, mid.z); m.lookAt(m.position.clone().add(d)); root.add(m); ch.bones['foot_' + s].attach(m); out['shoe_' + s] = m; } }
  // ---- 3c) mũ lưỡi trai: chỏm nửa cầu + lưỡi, gắn xương Head (to theo headK) ----
  if (S.cap) { const Cp = S.cap; const hb = new THREE.Box3(); for (let i = 0; i < N; i++) if (dn[i] === 'Head') hb.expandByPoint(new V(W[i * 3], W[i * 3 + 1], W[i * 3 + 2]));
    const hc = hb.getCenter(new V()), hs = hb.getSize(new V()); const R = Math.max(hs.x * 0.86, hs.z) * 0.5 + (Cp.pad ?? 0.012) * sc; // hộp đầu gồm cả tai → thu bề ngang
    const mat = new THREE.MeshStandardMaterial({ color: Cp.color, roughness: 0.85 }), bm = new THREE.MeshStandardMaterial({ color: Cp.brim || Cp.color, roughness: 0.85, side: THREE.DoubleSide });
    const baseY = hb.max.y - (Cp.band ?? 0.3) * hs.y, sy = ((Cp.band ?? 0.3) * hs.y + (Cp.crown ?? 0.03) * sc) / R; // vành mũ trên chân mày
    const dome = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), mat); const kx = hs.x * 0.86 / Math.max(hs.x * 0.86, hs.z) * 1.03, kz = hs.z / Math.max(hs.x * 0.86, hs.z) * 1.03;
    dome.scale.set(kx, sy, kz); dome.position.set(hc.x, baseY, hc.z - 0.004 * sc); dome.castShadow = true;
    const bg = new THREE.CircleGeometry((Cp.brimL ?? 0.075) * sc, 40, 0, Math.PI); bg.rotateX(Math.PI / 2); { const bp = bg.attributes.position; for (let k = 0; k < bp.count; k++) { const x = bp.getX(k) / ((Cp.brimL ?? 0.075) * sc); bp.setY(k, -0.012 * sc * x * x); } bg.computeVertexNormals(); }
    const brim = new THREE.Mesh(bg, bm); brim.scale.set(R * kx / ((Cp.brimL ?? 0.075) * sc) * 0.78, 1, 1); brim.position.set(hc.x, baseY + 0.003 * sc, hc.z + R * kz * 0.86); brim.rotation.x = 0.1; brim.castShadow = true;
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.009 * sc, 10, 8), mat); btn.position.set(hc.x, baseY + R * sy, hc.z - 0.004 * sc);
    for (const m of [dome, brim, btn]) { root.add(m); ch.bones.Head.attach(m); } out.cap = dome; }
  // ---- bỏ tam giác thân nằm trọn dưới quần áo -> hết đâm xuyên/đốm ----
  if (covered.length) { const cov = new Uint8Array(N); for (const s of covered) for (let i = 0; i < N; i++) if (s[i]) cov[i] = 1; const keep = []; for (let k = 0; k < idxAll.length; k += 3) { const a = idxAll[k], b = idxAll[k + 1], c = idxAll[k + 2]; if (!(cov[a] && cov[b] && cov[c])) keep.push(a, b, c); } g.setIndex(keep); }
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
    { // cẳng chân: chọn góc để bàn chân chạm sàn (floorY) thay vì lơ lửng/xuyên sàn
      ch.root.updateMatrixWorld(true); const kn = B['calf_' + s].getWorldPosition(new V()), Lc = kn.distanceTo(B['foot_' + s].getWorldPosition(new V()));
      const pY = B.pelvis.getWorldPosition(new V()).y; const drop = Math.max(0.05, (kn.y - pY) + seatY + (ch.seatPad ?? 0.1) - (o.floorY ?? 0) - 0.085 * ch.root.scale.y); const fz = drop < Lc ? Math.sqrt(Lc * Lc - drop * drop) / drop : 0.05;
      aim(B['calf_' + s], B['foot_' + s], L(ch, q * 0.03, -1, fz)); }
    aim(B['foot_' + s], B['ball_' + s], L(ch, q * 0.05, -0.15, 1));
    aim(B['upperarm_' + s], B['lowerarm_' + s], L(ch, q * 0.14, -1, 0.18));
    aim(B['lowerarm_' + s], B['hand_' + s], L(ch, -q * 0.18, -0.75, 1));
    aim(B['hand_' + s], B['middle_01_' + s], L(ch, -q * 0.05, -0.55, 1));
  }
  ch.root.position.set(x, 0, z); ch.root.updateMatrixWorld(true);
  const pv = B.pelvis.getWorldPosition(new V()); ch.root.position.y += seatY + (ch.seatPad ?? 0.1) - pv.y; ch.root.updateMatrixWorld(true);
}
