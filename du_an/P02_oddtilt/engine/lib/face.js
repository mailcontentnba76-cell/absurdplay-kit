// Biểu cảm khuôn mặt MakeHuman (face-poseunits.bvh, CC0): mỗi khung BVH là một "đơn vị" (LeftBrowDown, JawDrop, ...).
// BVH của MakeHuman là trục Z hướng lên → đổi sang Y lên của three.js: (x, y, z)_bvh → (x, z, -y).
import * as THREE from 'three';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
let FACE = null;
export async function loadFace(bvhUrl, jsonUrl) {
  if (FACE) return FACE;
  const r = new BVHLoader().parse(await (await fetch(bvhUrl)).text());
  const names = (await (await fetch(jsonUrl)).json()).framemapping;
  const holder = new THREE.Group(); holder.add(r.skeleton.bones[0]);
  const mixer = new THREE.AnimationMixer(holder); mixer.clipAction(r.clip).play();
  const ft = r.clip.duration / Math.max(1, names.length - 1);
  const units = {};
  names.forEach((n, i) => {
    mixer.setTime(i * ft + 1e-4); const m = {};
    for (const b of r.skeleton.bones) {
      const q = b.quaternion; if (1 - Math.abs(q.w) < 1e-5) continue;
      if (!/levator|oris|risorius|temporalis|oculi|orbicularis|special0|jaw|eye\.|tongue/.test(b.name)) continue;
      m[b.name] = new THREE.Quaternion(q.x, q.z, -q.y, q.w).normalize();
    }
    units[n] = m;
  });
  FACE = { units, names }; return FACE;
}
// Biểu cảm có sẵn (trọng số đơn vị)
export const EXPR = {
  cuoi: { MouthLeftPullUp: .9, MouthRightPullUp: .9, LeftCheekUp: .6, RightCheekUp: .6, LeftLowerLidUp: .3, RightLowerLidUp: .3 },
  tu_hao: { MouthLeftPullUp: .7, MouthRightPullUp: .7, LeftOuterBrowUp: .5, RightOuterBrowUp: .5, LeftCheekUp: .4, RightCheekUp: .4, ChinForward: .2 },
  ngac_nhien: { JawDrop: .45, LeftInnerBrowUp: .8, RightInnerBrowUp: .8, LeftOuterBrowUp: .8, RightOuterBrowUp: .8, LeftUpperLidOpen: .7, RightUpperLidOpen: .7 },
  to_mo: { LeftOuterBrowUp: .7, RightBrowDown: .3, MouthLeftPullUp: .5, LeftUpperLidOpen: .4, RightUpperLidOpen: .4 },
  ngai: { LeftBrowDown: .5, RightBrowDown: .5, MouthLeftPullDown: .5, MouthRightPullDown: .5, LeftInnerBrowUp: .4, RightInnerBrowUp: .4, LipsKiss: .2 },
  kho_chiu: { LeftBrowDown: .7, RightBrowDown: .7, NoseWrinkler: .4, MouthLeftPullSide: .3, MouthRightPullSide: .3, UpperLipUp: .3 },
};
// Chớp mắt tự nhiên: trả về trọng số nhắm mắt 0..1 tại t (mỗi ~3,2 s, lệch theo seed)
export function blink(t, seed = 0) { const p = ((t + seed * 1.37) % 3.2 + 3.2) % 3.2; return p < 0.08 ? p / 0.08 : p < 0.18 ? 1 - (p - 0.08) / 0.1 : 0; }
// Áp tổ hợp đơn vị {tên: trọng số} lên nhân vật (gọi SAU khi đặt tư thế thân)
export function applyFace(ch, weights) {
  if (!FACE) return;
  const acc = {};
  for (const [u, w] of Object.entries(weights)) {
    const m = FACE.units[u]; if (!m || !w) continue;
    for (const [b, q] of Object.entries(m)) { const qq = new THREE.Quaternion().slerp(q, Math.min(1.5, w)); acc[b] = acc[b] ? acc[b].multiply(qq) : qq; }
  }
  for (const [b, q] of Object.entries(acc)) { const n = ch.bones[b + '____head']; if (n) n.quaternion.multiply(q); }
}
export function mix(...objs) { const o = {}; for (const [ob, k] of objs) for (const [a, w] of Object.entries(ob)) o[a] = (o[a] || 0) + w * k; return o; }
