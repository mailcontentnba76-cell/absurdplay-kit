// Tập 25 — mèo lớn từ mô hình 3D Magnific (Tripo P1, có xương Tripo: Root, Spine_0..6, Head_0..3, {0=trước,1=sau}_{Left,Right}_Limb_0..4, đuôi bone_48..53, tai bone_14..19).
// Cùng giao diện với thu4chan.js: q = {root, head, kind, stride, legH}; poseQuad(q,t,o), quadTravel(...), jumpPose(u).
// Chân dùng IK 2 đốt (Limb_1→Limb_2→Limb_3) tới điểm đặt bàn chân trong hệ root → bước chân không trượt; thân lắc/nhún/chồm bằng nhóm bọc.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { minY } from './chamdat.js';
const cl = (x) => Math.min(1, Math.max(0, x)), sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
const TAU = Math.PI * 2;
const TPL = {};
export async function loadCats(list = { tiger: './assets/meo/tiger.glb', jaguar: './assets/meo/jaguar.glb' }) {
  const ld = new GLTFLoader();
  await Promise.all(Object.entries(list).map(async ([k, url]) => { const g = await ld.loadAsync(url); TPL[k] = g.scene; }));
  return TPL;
}
const _v = new THREE.Vector3(), _q = new THREE.Quaternion();
// S: hệ số phóng (mô hình gốc dài 1,0 / cao 0,585)
const SIZE = { tiger: 2.05, jaguar: 1.8 };
export function makeCat(kind = 'tiger', seed = 0, opt = {}) {
  const src = TPL[kind] || TPL.tiger; const S = opt.S || SIZE[kind] || 2;
  const model = SkeletonUtils.clone(src);
  const root = new THREE.Group(); root.name = 'cat_' + kind;
  const body = new THREE.Group(); root.add(body);       // nhún/chồm quanh hông sau
  const inner = new THREE.Group(); inner.rotation.y = Math.PI; inner.scale.setScalar(S); body.add(inner); inner.add(model);
  const B = {}; model.traverse((o) => { if (o.isBone) B[o.name.replace(/^tripo:*/, '')] = o; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
  model.updateMatrixWorld(true);
  // trạng thái nghỉ: quaternion cục bộ + quaternion thế giới trong hệ model
  const invM = new THREE.Matrix4().copy(model.matrixWorld).invert();
  const rest = {}; for (const [n, b] of Object.entries(B)) { const m = new THREE.Matrix4().multiplyMatrices(invM, b.matrixWorld); const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(); m.decompose(p, q, s); rest[n] = { lq: b.quaternion.clone(), lp: b.position.clone(), mq: q, mp: p }; }
  // vai trò xương (mỗi mô hình Tripo đánh số khác nhau): cổ = Spine cao nhất, đuôi = chuỗi bone_* con của Root, tai = bone_* con của Head_2 nằm cao
  const spines = Object.keys(B).filter((n) => /^Spine_\d+$/.test(n)).sort((a, b) => +a.split('_')[1] - +b.split('_')[1]);
  const NECK = spines[spines.length - 1], MID = spines.slice(1, -1);
  const TAIL = []; if (opt.tail) opt.tail.forEach((n) => { if (B[n]) TAIL.push(n); }); else { let tb = B.Root.children.find((c) => c.isBone && !/Spine|Limb/.test(c.name)); while (tb) { TAIL.push(tb.name.replace(/^tripo:*/, '')); tb = tb.children.find((c) => c.isBone); } }
  const EARS = B.Head_2.children.filter((c) => c.isBone && !/Head/.test(c.name) && rest[c.name].mp.y > rest.Head_2.mp.y + 0.01).map((c) => c.name);
  const JAW = B.Head_3 ? 'Head_3' : null;
  // hông sau (điểm xoay khi chồm) trong hệ root: model -z = trước → root +z
  const toRoot = (p) => new THREE.Vector3(-p.x * S, p.y * S, -p.z * S);
  const hipR = toRoot(rest['1_Left_Limb_0'].mp).setX(0);
  body.position.copy(hipR); inner.position.copy(hipR).multiplyScalar(-1);
  // chân: FL FR RL RR (giữ thứ tự như thu4chan)
  const legs = [['0_Left', true], ['0_Right', true], ['1_Left', false], ['1_Right', false]].map(([p, front]) => {
    const a = B[p + '_Limb_1'], b = B[p + '_Limb_2'], c = B[p + '_Limb_3'];
    const paw0 = toRoot(rest[p + '_Limb_3'].mp); paw0.y = 0;     // bàn chân nghỉ trên mặt đất (hệ root)
    const ank0 = toRoot(rest[p + '_Limb_3'].mp);
    const A = rest[p + '_Limb_1'].mp, Bm = rest[p + '_Limb_2'].mp, C = rest[p + '_Limb_3'].mp;
    const sgn = Math.sign(new THREE.Vector3().subVectors(C, A).cross(new THREE.Vector3().subVectors(Bm, A)).x) || 1;
    return { p, front, a, b, c, top: B[p + '_Limb_0'], paw0, ankH: ank0.y, sgn, x: paw0.x };
  });
  if (opt.evenPaws) for (const fr of [true, false]) { const g = legs.filter((L) => L.front === fr); const mz = g.reduce((a, L) => a + L.paw0.z, 0) / g.length; g.forEach((L) => { L.paw0.z = mz; }); }
  const legH = hipR.y;
  // proxy đầu: hệ trục giống root, đơn vị = mét (nhân root.scale) — headPos(q,f,dy) cũ dùng (0,dy,f)
  const head = new THREE.Group(); const hb = B['Head_1']; hb.add(head);
  const muzzle = rest['Head_1'].mp.clone().add(new THREE.Vector3(0, -0.002, 0.065)); muzzle.x = 0;
  head.position.copy(muzzle.clone().sub(rest['Head_1'].mp).applyQuaternion(rest['Head_1'].mq.clone().invert()));
  head.quaternion.copy(rest['Head_1'].mq.clone().invert().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)));
  head.scale.setScalar(1 / S);
  const q = { root, body, inner, model, B, rest, legs, head, kind, S, legH, seed, stride: opt.legScale ? { walk: 1.1 * legH / 0.93, trot: 1.7 * legH / 0.93, gallop: 2.9 * legH / 0.93 } : { walk: 1.1 * S / 2.05, trot: 1.7 * S / 2.05, gallop: 2.9 * S / 2.05 }, NECK, MID, TAIL, EARS, JAW, eyes: [], ears: [], o: { kind } };
  if (opt.strideK) for (const k in q.stride) q.stride[k] *= opt.strideK;
  return q;
}

// xoay xương quanh trục trong hệ model (trục đã xoay theo tư thế nghỉ của chính xương) — FK cộng dồn
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
function rot(q, name, ax, ang, add = false) {
  const b = q.B[name]; if (!b) return; const r = q.rest[name];
  const axis = AX[ax].clone().applyQuaternion(r.mq.clone().invert());
  _q.setFromAxisAngle(axis, ang); if (!add) b.quaternion.copy(r.lq); b.quaternion.multiply(_q);
}
// IK 2 đốt giải tích (Holden) với trục gập cố định = trục ngang của thân
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _t = new THREE.Vector3();
const wq = (o) => o.getWorldQuaternion(new THREE.Quaternion());
function ik(L, T, lat) {
  L.a.getWorldPosition(_a); L.b.getWorldPosition(_b); L.c.getWorldPosition(_c); _t.copy(T);
  const lab = _b.distanceTo(_a), lcb = _c.distanceTo(_b); const lat0 = Math.min(Math.max(_t.distanceTo(_a), Math.abs(lab - lcb) + 1e-3), (lab + lcb) * 0.995);
  const acos = (x) => Math.acos(Math.min(1, Math.max(-1, x)));
  const ca = _c.clone().sub(_a).normalize(), ba = _b.clone().sub(_a).normalize(), ab = _a.clone().sub(_b).normalize(), cb = _c.clone().sub(_b).normalize(), ta = _t.clone().sub(_a).normalize();
  const ac_ab_0 = acos(ca.dot(ba)), ba_bc_0 = acos(ab.dot(cb)), ac_at_0 = acos(ca.dot(ta));
  const ac_ab_1 = acos((lcb * lcb - lab * lab - lat0 * lat0) / (-2 * lab * lat0)), ba_bc_1 = acos((lat0 * lat0 - lab * lab - lcb * lcb) / (-2 * lab * lcb));
  const axis0 = lat.clone().multiplyScalar(L.sgn);
  let axis1 = ca.clone().cross(ta); if (axis1.lengthSq() < 1e-10) axis1.copy(axis0); axis1.normalize();
  const r0 = new THREE.Quaternion().setFromAxisAngle(axis0, ac_ab_1 - ac_ab_0), r1 = new THREE.Quaternion().setFromAxisAngle(axis0, ba_bc_1 - ba_bc_0), r2 = new THREE.Quaternion().setFromAxisAngle(axis1, ac_at_0);
  const agr = wq(L.a), bgr = wq(L.b);
  L.a.quaternion.multiply(agr.clone().invert().multiply(r2.multiply(r0)).multiply(agr));
  L.b.quaternion.multiply(bgr.clone().invert().multiply(r1).multiply(bgr));
}
const OFF = { walk: [0.5, 0, 0.75, 0.25], trot: [0, 0.5, 0.5, 0], gallop: [0.1, 0, 0.6, 0.5] };   // FL FR RL RR
const DUTY = { walk: 0.62, trot: 0.5, gallop: 0.38 };
const LIFT = { walk: 0.09, trot: 0.13, gallop: 0.2 };

// o: {gait, phase, amp, rear, crouch, tuck, sit, look:[yaw,pitch], hold, wide, mouth, tailUp, seed}
export function poseQuad(q, t, o = {}) {
  const sd = o.seed ?? q.seed ?? 0; const g = o.gait || 'idle'; const ph = o.phase || 0; const amp = o.amp ?? 1;
  const rear = sm(o.rear || 0), crouch = o.crouch || 0, tuck = o.tuck || 0, sit = sm(o.sit || 0), S = q.S;
  // ---- thân ----
  const br = Math.sin(t * 2.4 + sd) * 0.008;
  let bob = 0, pitch = 0;
  if (g === 'walk') bob = -Math.abs(Math.sin(ph * TAU * 2)) * 0.02;
  if (g === 'trot') bob = -Math.abs(Math.sin(ph * TAU * 2)) * 0.035;
  if (g === 'gallop') { bob = Math.sin(ph * TAU) * 0.06 - 0.03; pitch = Math.sin(ph * TAU + 0.6) * 0.1; }
  const rearA = -1.0 * rear - 0.38 * sit;      // âm = ngóc đầu lên (xoay quanh trục x của root)
  q.body.position.y = q.legH - crouch * 0.32 * q.legH + (bob * amp + br) - sit * 0.42 * q.legH - tuck * 0.05;
  q.body.rotation.set(pitch * amp + rearA, 0, Math.sin(t * 0.9 + sd * 1.7) * 0.015);
  // reset xương về nghỉ
  for (const [n, b] of Object.entries(q.B)) { b.quaternion.copy(q.rest[n].lq); }
  // cột sống: gập/duỗi khi phi, cong lưng khi thu mình
  const flex = (g === 'gallop' ? Math.sin(ph * TAU + 1.2) * 0.07 * amp : 0) + tuck * 0.06 - crouch * 0.02;
  q.MID.forEach((n) => rot(q, n, 'x', flex * 4 / q.MID.length, true));
  // cổ + đầu (model: +x quanh trục ngang = cúi về trước? kiểm bằng xem thử) ; look = [yaw, pitch(+ ngẩng)]
  const lk = o.look || [0, 0]; const idleYaw = Math.sin(t * 0.7 + sd * 2.1) * 0.16 + Math.sin(t * 1.9 + sd) * 0.04;
  const yaw = (lk[0] || 0) + (o.look ? idleYaw * 0.3 : idleYaw); const nod = Math.sin(t * 1.3 + sd * 0.7) * 0.04 + (g === 'gallop' ? Math.sin(ph * TAU) * 0.1 : 0);
  const hp = -(lk[1] || 0) * 0.5 + nod + rearA * 0.6 + crouch * 0.15;   // bù khi chồm để mặt vẫn nhìn ngang
  rot(q, q.NECK, 'y', yaw * 0.35, true); rot(q, 'Head_0', 'y', yaw * 0.35, true); rot(q, 'Head_1', 'y', yaw * 0.3, true);
  rot(q, q.NECK, 'x', hp * 0.4, true); rot(q, 'Head_0', 'x', hp * 0.3, true); rot(q, 'Head_1', 'x', hp * 0.3, true);
  // hàm (gầm)
  const mouth = o.mouth || 0; if (mouth && q.JAW) rot(q, q.JAW, 'x', -mouth * 0.95, true);
  // tai
  const tw = Math.max(0, Math.sin(t * 0.8 + sd) - 0.9) * 5;
  q.EARS.forEach((n, j) => rot(q, n, 'x', -0.15 * (o.wide || 0) + tw * 0.2 * (j ? 1 : -1) * 0.5, true));
  // đuôi: buông, đung đưa
  const up = sm(o.tailUp || 0), swish = o.tailSwish ?? 1;
  q.TAIL.slice(0, 6).forEach((n, i) => { rot(q, n, 'z', Math.sin(t * 2.0 + i * 0.7 + sd) * 0.12 * swish * (0.5 + i * 0.15), true); rot(q, n, 'x', (i === 0 ? -0.9 * up + 0.35 * rear : -0.1 * up) + (g === 'gallop' ? Math.sin(ph * TAU + i) * 0.08 : 0), true); });
  q.root.updateMatrixWorld(true);
  // ---- chân: điểm đặt bàn chân trong hệ root → thế giới, IK ----
  const lat = new THREE.Vector3(1, 0, 0).applyQuaternion(wq(q.root)).normalize();
  const legBase = q.legs.map((L) => [L.a.quaternion.clone(), L.b.quaternion.clone(), L.c.quaternion.clone()]);
  const TG = [];
  const solve = () => {
  q.legs.forEach((L, i) => { L.a.quaternion.copy(legBase[i][0]); L.b.quaternion.copy(legBase[i][1]); L.c.quaternion.copy(legBase[i][2]); });
  q.root.updateMatrixWorld(true);
  q.legs.forEach((L, i) => {
    const P = L.paw0.clone(); const pawH = L.ankH;  // khớp cổ chân cao hơn mặt đất
    let lift = 0;
    if (g !== 'idle') { const SL = q.stride[g] / (q.root.scale.x || 1); const d = DUTY[g]; let u = ((ph + OFF[g][i]) % 1 + 1) % 1;
      if (u < d) P.z += lerp(SL / 2, -SL / 2, u / d) * amp; else { const k = (u - d) / (1 - d); P.z += lerp(-SL / 2, SL / 2, sm(k)) * amp; lift = Math.sin(Math.PI * k) * LIFT[g] * amp * (L.front ? 1 : 0.85); } }
    // thu mình / nhảy: bàn chân kéo về dưới bụng
    if (tuck) { P.y += tuck * q.legH * 0.55; P.z += (L.front ? -1 : 1) * tuck * 0.18; }
    if (crouch) { P.z += (L.front ? 0.05 : -0.04) * crouch; }
    if (rear > 0) { if (L.front) { const hold = o.hold ?? 0.5; const sg = L.x > 0 ? 1 : -1;
        // đứng 2 chân: chân trước đưa ra trước ngực (ôm bóng khi hold cao)
        const chest = new THREE.Vector3(L.x * (1 - 0.6 * hold), 0, 0); P.lerp(new THREE.Vector3(L.x * (1 - 0.55 * hold) , q.legH * (1.05 + 0.25 * hold) + Math.sin(t * 3 + i) * 0.03 * (1 - hold), 0.55 + 0.25 * hold), rear); void chest; void sg; }
      else P.z += 0.12 * rear; }
    if (rear > 0 && L.front && o.paws) { const d = o.paws[L.x > 0 ? 0 : 1] || 0; P.y += d[1] ?? d; if (d.length) P.z += d[0]; }
    if (sit > 0) { if (!L.front) P.z += 0.25 * sit; else P.z -= 0.05 * sit; }
    P.y += lift + pawH;
    const T = q.root.localToWorld(P.clone()); TG[i] = (lift < 0.01 && !tuck && !(rear > 0.3 && L.front)) ? T.y : -1e9;
    ik(L, T, lat);
    // bàn chân nằm ngang theo root (trừ khi chồm/ thu chân)
    L.c.updateMatrixWorld(true);
    const want = wq(q.root).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)).multiply(q.rest[L.p + '_Limb_3'].mq);
    if (lift > 0.02 || tuck > 0.1) want.multiply(new THREE.Quaternion().setFromAxisAngle(AX.x.clone().applyQuaternion(q.rest[L.p + '_Limb_3'].mq.clone().invert()), (L.front ? -1 : 1) * 0.6 * Math.max(lift / 0.2, tuck)));
    const parent = wq(L.c.parent); L.c.quaternion.copy(parent.invert().multiply(want));
    q.root.updateMatrixWorld(true);
  });
  };
  // không cho lún: nếu chân không với tới (thân hạ quá thấp) → nâng thân rồi giải lại, tới khi cổ chân đúng độ cao đích
  for (let it = 0; it < 5; it++) { TG.length = 0; solve(); let def = 0; q.legs.forEach((L, i) => { const v = L.c.getWorldPosition(new THREE.Vector3()); def = Math.max(def, TG[i] - v.y); });
    if (def < 0.006) break; q.body.position.y += def / (q.root.scale.y || 1); q.root.updateMatrixWorld(true); }
  // đuôi không cắm xuống đất: nâng gốc đuôi dần tới khi mọi đốt đuôi cao hơn 3 cm
  for (let it = 0; it < 6; it++) { let low = Infinity; q.TAIL.forEach((n) => { low = Math.min(low, q.B[n].getWorldPosition(new THREE.Vector3()).y); }); if (low > q.root.position.y + 0.03) break;
    rot(q, q.TAIL[0], 'x', -0.18, true); if (q.TAIL[1]) rot(q, q.TAIL[1], 'x', -0.12, true); q.root.updateMatrixWorld(true); }
  // chạm đất theo lưới thật: khi đang đứng trên đất (không bay/nhảy) → điểm thấp nhất của lưới = mặt đất (không lún, không lơ lửng)
  const air = o.air ?? (tuck > 0.05 || ((o.y || 0) > 0.01 && o.ground === undefined));
  if (!air && !o.noSnap) { const gy = o.ground ?? q.root.position.y; const m = minY(q.root, 1e6); if (isFinite(m)) { q.root.position.y += gy - m; q.root.updateMatrixWorld(true); } }
  else if (!o.noSnap) { const m = minY(q.root, 1e6); const gy = o.ground ?? 0; if (m < gy) { q.root.position.y += gy - m; q.root.updateMatrixWorld(true); } }
}

export function quadTravel(q, t, t0, p0, p1, speed, gait = 'trot', o = {}) {
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); const s = Math.min(d, Math.max(0, (t - t0) * speed)); const k = d ? s / d : 1;
  const face = Math.atan2(p1[0] - p0[0], p1[1] - p0[1]);
  q.root.position.set(lerp(p0[0], p1[0], k), o.y || 0, lerp(p0[1], p1[1], k)); q.root.rotation.set(0, o.face ?? face, 0);
  const moving = k < 1; poseQuad(q, t, Object.assign({}, o, { gait: moving ? gait : 'idle', phase: s / (q.stride[gait] * (q.root.scale.x || 1)) }));
  return !moving;
}
export function jumpPose(u) {
  if (u < 0.22) return { crouch: sm(u / 0.22) * 0.9, tuck: 0, lift: 0 };
  if (u < 0.32) return { crouch: 0.9 * (1 - sm((u - 0.22) / 0.1)), tuck: 0, lift: 0 };
  if (u < 0.82) return { crouch: 0, tuck: sm((u - 0.32) / 0.18) * (1 - sm((u - 0.62) / 0.2)) * 0.9, lift: Math.sin(Math.PI * (u - 0.32) / 0.5) };
  return { crouch: Math.sin(Math.PI * (u - 0.82) / 0.18) * 0.5, tuck: 0, lift: 0 };
}
