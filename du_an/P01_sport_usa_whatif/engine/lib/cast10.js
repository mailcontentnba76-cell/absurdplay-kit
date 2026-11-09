// Dàn nhân vật E10 (NBA, ngôi sao vs lịch sử). Nhận diện Curry: #30, 6'2" (≈1,88 m) theo hồ sơ ESPN; ngoại hình theo ảnh chân dung chính thức ESPN (kiểm 09/11/2026):
// da nâu sáng, tóc đen xoăn cắt ngắn, râu quai nón ngắn + ria. Áo Warriors trắng (Association): bản thật in LOGO chứ không có chữ → để trống chữ (không dựng logo), số 30 xanh hoàng gia viền vàng.
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const GSW = { ...BASE, jersey: '#f4f4f2', pants: '#f4f4f2', numberColor: '#1D428A', numberOutline: '#FFC72C', wordmark: null, collar: '#1D428A', pantsStripes: ['#1D428A', '#FFC72C'] };
export const CURRY = (lib, o = {}) => makeCharacter(lib, { ...GSW, number: 30, backName: 'CURRY', heightM: 1.88, skin: '#d6a47a', hairStyle: 'proc:curlytop', hairColor: '#120c08', hairOpts: { puff: 0.8, len: 0.8 },
  beardStyle: 'stubble', beardColor: '#120c08', ...o });
// tu sĩ (áo chùng nâu, đầu cạo), vua (áo đỏ thẫm) — hư cấu, không giống người thật
export const MONK = (lib, sd = 0) => makeCharacter(lib, { tank: false, shorts: false, jersey: '#5a3e26', pants: '#5a3e26', socks: '#3a2a1a', shoes: '#3a2a1a', collar: '#3a2a1a', edgeSoft: 1, eyeScale: 2.2, heightM: 1.75 + sd * 0.05,
  skin: ['#e8c4a0', '#c99266'][sd % 2], hairStyle: 'proc:buzz', hairColor: ['#8a8a8a', '#3a2516'][sd % 2], beardStyle: sd % 2 ? 'full' : null, beardColor: '#6a6a6a', glasses: sd % 2 ? null : '#3a2a1a' });
export const KING = (lib) => makeCharacter(lib, { tank: false, shorts: false, jersey: '#7a1a20', pants: '#2a1a30', socks: '#2a1a30', shoes: '#1a1010', collar: '#e5c040', edgeSoft: 1, eyeScale: 2.2, heightM: 1.8, skin: '#ecc9a8', hairStyle: 'proc:fade', hairColor: '#4a2e18' });

// ======================= KỴ SĨ PHÁP 1415 (nhân vật phụ, hư cấu) =======================
// Đối chiếu sử liệu (National Archives UK "Agincourt: campaign and battle", britishbattles.com, worldhistory.org; kiểm 09/11/2026):
// kỵ binh hai cánh quân Pháp xung phong vào cung thủ rồi vỡ trước hàng cọc; men-at-arms mặc giáp tấm toàn thân ("white harness"),
// mũ bascinet có lưới xích (aventail) và lưỡi che mặt nhọn — ở đây KÉO LÊN để thấy mặt; áo jupon/surcoat huy hiệu; ngựa phủ vải + giáp mặt (chanfron).
// Năm 1415 hiếm mũ cắm lông → bỏ lông. Đa số cạo râu, tóc ngắn kiểu bát úp.
import * as THREE from 'three';
const KSK = ['#ecc9a8', '#e2b48f', '#f0d0b0', '#d9a57a'], KHAIR = ['#3a2516', '#6a4a2a', '#1e140c', '#8a6a3a'];
const SURC = { fleur: ['#1f3c8a', '#e5c040'], gules: ['#9a1f26', '#e5c040'], checky: ['#1f3c8a', '#e5c040'], argent: ['#efece4', '#9a1f26'] };
export const KNIGHT = (lib, i = 0, arms = 'fleur') => makeCharacter(lib, { tank: false, shorts: false, jersey: SURC[arms][0], collar: SURC[arms][1], pants: '#aeb4bc', socks: '#aeb4bc', shoes: '#9aa0a8',
  edgeSoft: 1, eyeScale: 2.8, headScale: 1.15, brows: true, heightM: 1.72 + (i % 3) * 0.04, skin: KSK[i % 4], hairStyle: i % 2 ? 'proc:fade' : 'proc:buzz', hairColor: KHAIR[i % 4], beardStyle: i % 5 === 2 ? 'mustache' : null, beardColor: KHAIR[i % 4] });
// Bộ giáp + mũ + thương gắn theo xương (cập nhật mỗi khung bằng kit.update()). Không phụ thuộc trục cục bộ của xương (đặt theo vị trí thế giới).
export function knightKit(ch, arms = 'fleur', tex = null) {
  const steel = new THREE.MeshStandardMaterial({ color: '#cfd4db', metalness: 0.35, roughness: 0.32 }), mail = new THREE.MeshStandardMaterial({ color: '#8a9097', metalness: 0.3, roughness: 0.6 });
  const G = new THREE.Group(); const add = (m) => { m.castShadow = true; G.add(m); return m; };
  // mũ bascinet: vòm nhọn + lưới xích hở mặt + lưỡi che mặt mõm nhọn kéo lên trán
  const helm = new THREE.Group(); G.add(helm);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.108, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), steel); dome.scale.set(1, 1.15, 1.12); helm.add(dome);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.07, 16), steel); tip.position.set(0, 0.13, -0.025); tip.rotation.x = -0.3; helm.add(tip);
  const av = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.135, 0.16, 18, 1, true, 1.6, Math.PI * 2 - 3.2), mail); av.position.set(0, -0.07, -0.01); av.material.side = THREE.DoubleSide; helm.add(av);
  const visor = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.11, 14), steel); visor.scale.set(1.4, 1, 0.7); visor.position.set(0, 0.12, 0.085); visor.rotation.x = 0.7; helm.add(visor);
  for (const k of [-1, 1]) { const pv = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), steel); pv.position.set(k * 0.108, 0.01, 0.0); helm.add(pv); }
  helm.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  // tấm giáp tay/chân: ống giữa 2 khớp
  const seg = (r0, r1) => add(new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, 1, 12, 1, false), steel));
  const L = [['upperarm_l', 'lowerarm_l', 0.062, 0.055], ['upperarm_r', 'lowerarm_r', 0.062, 0.055], ['lowerarm_l', 'hand_l', 0.052, 0.045], ['lowerarm_r', 'hand_r', 0.052, 0.045],
    ['thigh_l', 'calf_l', 0.088, 0.07], ['thigh_r', 'calf_r', 0.088, 0.07], ['calf_l', 'foot_l', 0.066, 0.05], ['calf_r', 'foot_r', 0.066, 0.05]].map(([a, b, r0, r1]) => ({ a, b, m: seg(r0, r1) }));
  const ball = (r, sx = 1, sy = 1, sz = 1) => { const m = add(new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), steel)); m.scale.set(sx, sy, sz); return m; };
  const J = [['upperarm_l', ball(0.1, 1, 0.75, 1.1), 0.03], ['upperarm_r', ball(0.1, 1, 0.75, 1.1), 0.03], ['lowerarm_l', ball(0.055), 0], ['lowerarm_r', ball(0.055), 0], ['calf_l', ball(0.07), 0], ['calf_r', ball(0.07), 0],
    ['hand_l', ball(0.055, 1.2, 0.9, 1.2), 0], ['hand_r', ball(0.055, 1.2, 0.9, 1.2), 0], ['foot_l', ball(0.06, 1.1, 0.7, 1.5), 0], ['foot_r', ball(0.06, 1.1, 0.7, 1.5), 0]];
  // huy hiệu ngực (trên áo jupon) + thắt lưng hiệp sĩ
  const emb = add(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.24), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.8 }))); emb.castShadow = false;
  const belt = add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 6, 20), new THREE.MeshStandardMaterial({ color: '#c9a03a', metalness: 0.7, roughness: 0.35 }))); belt.scale.set(1, 0.75, 1);
  // thương kỵ binh (gỗ) + cờ đuôi nheo
  const lance = new THREE.Group(); G.add(lance); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.045, 3.4, 8), new THREE.MeshStandardMaterial({ color: '#cbb48a', roughness: 0.7 })); sh.rotation.x = Math.PI / 2; sh.position.z = 1.1; lance.add(sh);
  const lt = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 8), steel); lt.rotation.x = Math.PI / 2; lt.position.z = 2.9; lance.add(lt);
  const vam = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.25, 12, 1, true), steel); vam.rotation.x = -Math.PI / 2; vam.position.z = 0.2; lance.add(vam);
  const pen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshStandardMaterial({ color: SURC[arms][1], side: THREE.DoubleSide, roughness: 0.9 })); pen.rotation.y = Math.PI / 2; pen.position.set(0, 0.1, 2.5); lance.add(pen);
  lance.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  const wp = (n) => ch.bones[n].getWorldPosition(new THREE.Vector3()); const up = new THREE.Vector3(0, 1, 0);
  function update(fwd, t = 0) { // fwd: hướng phi (Vector3 thế giới)
    ch.root.updateMatrixWorld(true); const Hd = ch.bones.Head; const q = Hd.getWorldQuaternion(new THREE.Quaternion());
    helm.position.copy(new THREE.Vector3(0, 0.15, -0.005).applyMatrix4(Hd.matrixWorld)); helm.quaternion.copy(q); helm.scale.setScalar(1.0);
    for (const s of L) { const a = wp(s.a), b = wp(s.b); s.m.position.copy(a).add(b).multiplyScalar(0.5); s.m.scale.set(1, a.distanceTo(b) * 0.92, 1); s.m.quaternion.setFromUnitVectors(up, b.sub(a).normalize()); }
    for (const [n, m, dy] of J) { m.position.copy(wp(n)); m.position.y += dy; m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fwd); }
    const qf = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), fwd);
    const ch3 = wp('spine_03'), sp1 = wp('spine_01'); emb.position.copy(ch3).lerp(sp1, 0.35).addScaledVector(fwd, 0.16); emb.quaternion.copy(qf);
    belt.position.copy(wp('pelvis')); belt.position.y += 0.06; belt.quaternion.copy(qf).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)));
    const hr = wp('hand_r'); lance.position.copy(hr); const dir = fwd.clone(); dir.y = -0.08 + 0.03 * Math.sin(t * 9); dir.normalize(); lance.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir); }
  return { group: G, update };
}
