// Tập 29 — QUẠ THẬT từ Magnific (Tripo P1 + Rig, assets/thu29/raven_raw.glb). Mô hình đứng cánh khép, đầu hướng −z, dài 1,0 / cao 0,69.
// Xương: thân/cổ bone_1→bone_3→Head_0..3 (Head_3 = mỏ), đuôi Spine_0..2 (+z), chân 0_{Left,Right}_Limb_0..3 + ngón, cánh khép bone_50/51.
// Cánh XOÈ khi bay: 2 tấm cánh lông (wingPanel của qua29.js) gắn ở vai, ẩn khi đứng.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { wingTex, wingPanel, SPAN } from './qua29.js';
let TPL = null;
export async function loadRaven(url = './assets/thu29/raven_raw.glb') { const g = await new GLTFLoader().loadAsync(url); TPL = g.scene; return TPL; }
const lerp = (a, b, k) => a + (b - a) * k, cl = (x) => Math.min(1, Math.max(0, x));
export function makeRaven(seed = 0, opt = {}) {
  const model = SkeletonUtils.clone(TPL); const root = new THREE.Group(); root.name = 'raven';
  const body = new THREE.Group(); root.add(body); const inner = new THREE.Group(); inner.rotation.y = Math.PI; body.add(inner); inner.add(model);  // đầu → +z của root
  const B = {}; model.traverse((o) => { if (o.isBone) B[o.name.replace(/^tripo:*/, '')] = o; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
      const m = o.material.clone(); m.roughness = Math.min(m.roughness ?? 1, 0.6); m.envMapIntensity = 0.8; o.material = m; } });
  const r0 = {}; for (const k in B) r0[k] = B[k].quaternion.clone();
  // cánh xoè: gốc vai ~ (±0.085, 0.44, −0.13) trong hệ model; chiều dài nửa sải ≈ 1,0 (quạ mô hình dài 1,0)
  const wm = new THREE.MeshStandardMaterial({ color: '#1e1e28', map: wingTex(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.62, metalness: 0.1, envMapIntensity: 0.6 });
  const wings = [-1, 1].map((s) => { const sh = new THREE.Group(); sh.position.set(s * 0.07, 0.43, -0.14); model.add(sh);  // model: x+ = trái của quạ (đầu −z) → s=+1 cánh trái
    const side = new THREE.Group(); side.rotation.order = 'YXZ'; side.scale.set(-s * 1.55, 1.55, 1.55); sh.add(side);         // tấm cánh: +x sải ra, −z về sau; model đầu −z → "về sau" = +z → xoay 180°
    const inner_ = wingPanel(0, 0.52, wm); const piv = new THREE.Group(); piv.rotation.y = Math.PI; side.add(piv); piv.add(inner_);
    const wr = new THREE.Group(); wr.position.x = 0.52 * SPAN; piv.add(wr); wr.add(wingPanel(0.52, 1.0, wm));
    sh.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } }); return { s, sh, side, piv, wr }; });
  const hip = new THREE.Vector3(); const q = { root, body, inner, model, B, r0, wings, seed, kind: 'raven' };
  const rot = (n, x, y, z) => { if (!B[n]) return; B[n].quaternion.copy(r0[n]).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z))); };
  // o: {spread 0..1, flap pha, head:[yaw,pitch], beak 0..1, tuck 0..1 (co chân khi bay), crouch, hop, pitch (chúi thân), tail 0..1, wingLift 0..1 (xù cánh khép khi đứng)}
  q.set = (o = {}) => { for (const k in B) B[k].quaternion.copy(r0[k]);
    const sp = o.spread || 0, fl = Math.sin(o.flap || 0) * sp, fl2 = Math.sin((o.flap || 0) - 0.7) * sp;
    const [yw, pt] = o.head || [0, 0];
    rot('bone_2', -pt * 0.35, yw * 0.3, 0); rot('bone_3', -pt * 0.35, yw * 0.35, 0); rot('Head_1', -pt * 0.3, yw * 0.35, yw * 0.1);
    if (o.beak) rot('Head_2', o.beak * 0.35, 0, 0);
    const tl = o.tail || 0; rot('Spine_0', tl * 0.25 + sp * 0.15, 0, 0); rot('Spine_1', tl * 0.15, 0, 0);
    const wl = Math.max(o.wingLift || 0, sp * 0.6); rot('bone_50', 0, 0, wl * 0.5); rot('bone_51', 0, 0, -wl * 0.5);
    const tk = o.tuck || 0, cr = o.crouch || 0;
    for (const sd of ['Left', 'Right']) { rot(`0_${sd}_Limb_1`, tk * 1.1 + cr * 0.35, 0, 0); rot(`0_${sd}_Limb_2`, -tk * 1.6 - cr * 0.7, 0, 0); rot(`0_${sd}_Limb_3`, tk * 0.9 + cr * 0.35, 0, 0); }
    body.rotation.x = -(o.pitch || 0); body.position.y = (o.hop || 0) - cr * 0.06;
    wings.forEach((w) => { w.sh.visible = sp > 0.05; w.side.rotation.set(0, w.s * lerp(1.3, 0.05, sp) * -1, w.s * (lerp(-0.3, 0.08, sp) + fl * 0.7));
      w.wr.rotation.set(0, lerp(0.1, -0.08, sp), fl2 * 0.55); const k = lerp(0.35, 1, sp); w.side.scale.set(-w.s * 1.55 * k, 1.55, 1.55 * lerp(0.6, 1, sp)); });
    root.updateMatrixWorld(true); };
  q.beakTip = () => { const v = new THREE.Vector3(0, 0.0, -0.08); return B.Head_3.localToWorld(v); };
  q.talon = () => B['0_Left_Limb_3'].getWorldPosition(new THREE.Vector3()).add(B['0_Right_Limb_3'].getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5);
  q.set({}); return q;
}
// bước nhảy hai chân kiểu quạ
export const ravenHop = (t, rate = 3) => { const ph = (t * rate) % 1; return { hop: Math.max(0, Math.sin(ph * Math.PI)) * 0.06, pitch: 0.08 * Math.sin(ph * Math.PI * 2) }; };
