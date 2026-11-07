// Chuyển động thu thật CMU (BVH, bản Motionbuilder-friendly của cgspeed) → khung xương MakeHuman mặc định.
// Cách làm: lấy vị trí khớp BVH theo thời gian, xoay từng đoạn xương MakeHuman cho cùng hướng (aim),
// rồi chỉnh xoắn (twist) cho hông, ngực, đầu, bàn tay theo hướng "phía trước" của xương BVH.
import * as THREE from 'three';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';

const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3();
const cache = {};
export async function loadBVH(url) {
  if (cache[url]) return cache[url];
  const r = new BVHLoader().parse(await (await fetch(url)).text());
  const holder = new THREE.Group(); holder.add(r.skeleton.bones[0]);
  const mixer = new THREE.AnimationMixer(holder); mixer.clipAction(r.clip).play();
  const bones = Object.fromEntries(r.skeleton.bones.map((b) => [b.name, b]));
  const mo = { holder, mixer, clip: r.clip, bones, duration: r.clip.duration };
  // khung tham chiếu ở t=0 (cgspeed: khung đầu là tư thế chữ T)
  mixer.setTime(0); holder.updateMatrixWorld(true);
  const P = (n) => bones[n].getWorldPosition(new THREE.Vector3());
  const right = P('RightUpLeg').sub(P('LeftUpLeg')).setY(0).normalize();
  const fwd = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), right).normalize();
  mo.R0 = new THREE.Quaternion().setFromUnitVectors(fwd, new THREE.Vector3(0, 0, 1));
  mo.hips0 = P('Hips');
  mo.legLen = P('LeftUpLeg').distanceTo(P('LeftLeg')) + P('LeftLeg').distanceTo(P('LeftFoot'));
  mo.footY0 = Math.min(P('LeftToeBase').y, P('RightToeBase').y, P('LeftFoot').y, P('RightFoot').y);
  mo.rest = Object.fromEntries(Object.entries(bones).map(([n, b]) => [n, b.getWorldQuaternion(new THREE.Quaternion())]));
  cache[url] = mo; return mo;
}

// [nút xoay MH (____head), điểm cuối MH, khớp BVH đầu, khớp BVH cuối, có chỉnh xoắn?]
const SEG = [
  ['spine05', 'spine03', 'LowerBack', 'Spine', 0], ['spine03', 'spine01', 'Spine', 'Spine1', 0], ['spine01', 'neck01', 'Spine1', 'Neck', 1],
  ['neck01', 'head', 'Neck', 'Head', 0], ['head', 'head:tail', 'Neck1', 'Head', 1],
  ['clavicle.L', 'upperarm01.L', 'LeftShoulder', 'LeftArm', 0], ['upperarm01.L', 'upperarm02.L:tail', 'LeftArm', 'LeftForeArm', 0], ['lowerarm01.L', 'lowerarm02.L:tail', 'LeftForeArm', 'LeftHand', 0], ['wrist.L', 'finger3-1.L', 'LeftHand', 'LeftFingerBase', 1],
  ['clavicle.R', 'upperarm01.R', 'RightShoulder', 'RightArm', 0], ['upperarm01.R', 'upperarm02.R:tail', 'RightArm', 'RightForeArm', 0], ['lowerarm01.R', 'lowerarm02.R:tail', 'RightForeArm', 'RightHand', 0], ['wrist.R', 'finger3-1.R', 'RightHand', 'RightFingerBase', 1],
  ['upperleg01.L', 'upperleg02.L:tail', 'LeftUpLeg', 'LeftLeg', 0], ['lowerleg01.L', 'lowerleg02.L:tail', 'LeftLeg', 'LeftFoot', 0], ['foot.L', 'toe3-1.L', 'LeftFoot', 'LeftToeBase', 0],
  ['upperleg01.R', 'upperleg02.R:tail', 'RightUpLeg', 'RightLeg', 0], ['lowerleg01.R', 'lowerleg02.R:tail', 'RightLeg', 'RightFoot', 0], ['foot.R', 'toe3-1.R', 'RightFoot', 'RightToeBase', 0],
];
const pivot = (ch, n) => ch.bones[n + '____head'];
const endNode = (ch, n) => { const [a, t] = n.split(':'); return t ? ch.bones[a] : ch.bones[a + '____head'] || ch.bones[a]; };

export function resetMH(ch) { for (const [n, b] of Object.entries(ch.bones)) b.quaternion.copy(ch.rest[n]); }

// xoay nút `bone` (thế giới) sao cho vector bone→child trùng dir
export function aimMH(bone, child, dir) {
  bone.updateWorldMatrix(true, true);
  const a = bone.getWorldPosition(_v), b = child.getWorldPosition(_v2);
  const cur = b.sub(a).normalize();
  _q.setFromUnitVectors(cur, dir.clone().normalize());
  const wq = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(_q);
  const pq = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  bone.quaternion.copy(pq.multiply(wq)); bone.updateWorldMatrix(false, true);
}
function twistMH(bone, axis, want) { // quay quanh trục axis để hướng "trước" (0,0,1 của nút) gần want nhất
  const cur = new THREE.Vector3(0, 0, 1).applyQuaternion(bone.getWorldQuaternion(_q2));
  const ax = axis.clone().normalize();
  const c = cur.sub(ax.clone().multiplyScalar(cur.dot(ax))), w = want.clone().sub(ax.clone().multiplyScalar(want.dot(ax)));
  if (c.lengthSq() < 1e-6 || w.lengthSq() < 1e-6) return;
  c.normalize(); w.normalize();
  const ang = Math.atan2(ax.dot(new THREE.Vector3().crossVectors(c, w)), c.dot(w));
  const wq = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(new THREE.Quaternion().setFromAxisAngle(ax, ang));
  bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(wq)); bone.updateWorldMatrix(false, true);
}

// Áp chuyển động BVH vào nhân vật MH ở thời điểm t (giây).
// opt: { pos: Vector3 vị trí đặt, yaw: hướng (rad), inPlace: bỏ di chuyển ngang, scaleY: nhân dịch chuyển dọc, lock: {tên đoạn: false} }
export function applyMocap(ch, mo, t, opt = {}) {
  const T = ((t % mo.duration) + mo.duration) % mo.duration;
  mo.mixer.setTime(T); mo.holder.updateMatrixWorld(true);
  resetMH(ch);
  const yawQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), opt.yaw || 0);
  let R0 = mo.R0;
  if (opt.faceAt !== undefined) { // lấy hướng hông ở thời điểm faceAt làm "phía trước" (đoạn mocap người quay ngang)
    const key = 'R@' + opt.faceAt;
    if (!mo[key]) { mo.mixer.setTime(opt.faceAt); mo.holder.updateMatrixWorld(true);
      const r = mo.bones.RightUpLeg.getWorldPosition(new THREE.Vector3()).sub(mo.bones.LeftUpLeg.getWorldPosition(new THREE.Vector3())).setY(0).normalize();
      mo[key] = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), r).normalize(), new THREE.Vector3(0, 0, 1));
      mo.mixer.setTime(T); mo.holder.updateMatrixWorld(true); }
    R0 = mo[key];
  }
  const Rt = yawQ.clone().multiply(R0);
  ch.root.quaternion.copy(yawQ);
  const P = (n) => mo.bones[n].getWorldPosition(new THREE.Vector3());
  // tỉ lệ: chiều dài chân MH / BVH
  if (!ch._legLen) { ch.root.updateMatrixWorld(true); const w = (n) => ch.bones[n].getWorldPosition(new THREE.Vector3()); ch._legLen = w('upperleg01.L____head').distanceTo(w('lowerleg01.L____head')) + w('lowerleg01.L____head').distanceTo(w('foot.L____head')); ch._hipY = w('upperleg01.L____head').y - ch.root.position.y; }
  const s = ch._legLen / (mo.legLen * (ch.root.scale.y || 1));
  const d = P('Hips').sub(mo.hips0).applyQuaternion(Rt).multiplyScalar(s * ch.root.scale.y);
  const base = opt.pos || new THREE.Vector3();
  ch.root.position.set(base.x + (opt.inPlace ? 0 : d.x), base.y, base.z + (opt.inPlace ? 0 : d.z));
  // hông: xoay toàn thân dưới theo hướng Hips
  const hq = mo.bones.Hips.getWorldQuaternion(new THREE.Quaternion()).multiply(mo.rest.Hips.clone().invert());
  const hipsW = Rt.clone().multiply(hq).multiply(mo.R0.clone().invert()); // khung nghỉ MH (+z) → khung nghỉ BVH → đổi hướng → thế giới MH
  const rootB = ch.bones['root____head'] || ch.bones.root;
  rootB.quaternion.copy(rootB.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(hipsW));
  rootB.position.y = (ch.rest_root_y ??= rootB.position.y) + (P('Hips').y - mo.hips0.y) * s * (opt.scaleY ?? 1);
  ch.root.updateMatrixWorld(true);
  for (const [mhA, mhB, bA, bB, tw] of SEG) {
    if (opt.lock && opt.lock[mhA]) continue;
    if (mhA.startsWith('clavicle') && !opt.clavicle) continue; // mặc định giữ xương đòn (aim theo CMU làm vai nhô)
    const pv = pivot(ch, mhA), en = endNode(ch, mhB); if (!pv || !en) continue;
    const dir = P(bB).sub(P(bA)); if (dir.lengthSq() < 1e-8) continue;
    dir.applyQuaternion(Rt);
    aimMH(pv, en, dir);
    if (tw) {
      const bq = mo.bones[bA].getWorldQuaternion(new THREE.Quaternion()).multiply(mo.rest[bA].clone().invert());
      const want = new THREE.Vector3(0, 0, 1).applyQuaternion(mo.R0.clone().invert()).applyQuaternion(bq).applyQuaternion(Rt);
      twistMH(pv, dir, want);
    }
  }
  if (opt.ground !== false) { // bàn chân thấp nhất chạm đất (trừ khi ngồi lên vật: opt.ground=false)
    ch.root.updateMatrixWorld(true); let mn = Infinity;
    for (const n of ['toe3-1.L____head', 'toe3-1.R____head', 'foot.L____head', 'foot.R____head']) { const b = ch.bones[n]; if (b) mn = Math.min(mn, b.getWorldPosition(_v).y); }
    const pad = 0.035 * ch.root.scale.y; ch.root.position.y += base.y - (mn - pad); ch.root.updateMatrixWorld(true);
  }
  return T;
}

// IK 2 đoạn cho tay MakeHuman: đặt cổ tay (wrist) tới target, khuỷu hướng về pole (thế giới)
export function armIK(ch, side, target, pole) {
  const U = ch.bones['upperarm01.' + side + '____head'], L = ch.bones['lowerarm01.' + side + '____head'], W = ch.bones['wrist.' + side + '____head'];
  const Ue = ch.bones['upperarm02.' + side], Le = ch.bones['lowerarm02.' + side];
  ch.root.updateMatrixWorld(true);
  const S = U.getWorldPosition(new THREE.Vector3()), E0 = L.getWorldPosition(new THREE.Vector3()), H0 = W.getWorldPosition(new THREE.Vector3());
  const a = S.distanceTo(E0), b = E0.distanceTo(H0); const dv = target.clone().sub(S); let d = Math.min(dv.length(), (a + b) * 0.999); const u = dv.normalize();
  const cosA = THREE.MathUtils.clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
  const pp = pole.clone().sub(u.clone().multiplyScalar(pole.dot(u))).normalize();
  const elbow = S.clone().addScaledVector(u, a * cosA).addScaledVector(pp, a * sinA);
  aimMH(U, Ue, elbow.clone().sub(S)); aimMH(L, Le, S.clone().addScaledVector(u, d).sub(elbow));
}
// quay nút quanh trục thế giới
export function rotWorld(bone, axis, ang) {
  bone.updateWorldMatrix(true, false);
  const wq = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), ang));
  bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(wq)); bone.updateWorldMatrix(false, true);
}
export const J = (ch, n) => ch.bones[n + '____head'].getWorldPosition(new THREE.Vector3());
// IK 2 đoạn cho chân MakeHuman (E05 đạp xe): đặt mắt cá (foot) tới target, gối hướng về pole (thế giới)
export function legIK(ch, side, target, pole) {
  const U = ch.bones['upperleg01.' + side + '____head'], L = ch.bones['lowerleg01.' + side + '____head'], F = ch.bones['foot.' + side + '____head'];
  const Ue = ch.bones['upperleg02.' + side], Le = ch.bones['lowerleg02.' + side];
  ch.root.updateMatrixWorld(true);
  const S = U.getWorldPosition(new THREE.Vector3()), K0 = L.getWorldPosition(new THREE.Vector3()), A0 = F.getWorldPosition(new THREE.Vector3());
  const a = S.distanceTo(K0), b = K0.distanceTo(A0); const dv = target.clone().sub(S); const d = Math.min(dv.length(), (a + b) * 0.999); const u = dv.normalize();
  const cosA = THREE.MathUtils.clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
  const pp = pole.clone().sub(u.clone().multiplyScalar(pole.dot(u))).normalize();
  const knee = S.clone().addScaledVector(u, a * cosA).addScaledVector(pp, a * sinA);
  aimMH(U, Ue, knee.clone().sub(S)); aimMH(L, Le, S.clone().addScaledVector(u, d).sub(knee));
}
