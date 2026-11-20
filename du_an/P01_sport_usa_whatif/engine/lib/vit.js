// E26 (Mascot NBA) — VỊT HỒ (linh vật gán cho Lakers: "Land of 10,000 Lakes" → hồ → vịt).
// Thiết kế riêng, khối tròn đơn giản: thân tím, bụng tím nhạt, mỏ + chân vàng, vòng cổ vàng, mắt to tròn.
// Không giống vịt hoạt hình nổi tiếng nào (không mũ, không áo thuỷ thủ, không mỏ dẹt kiểu hoạt hình cổ điển).
// Hướng mặt: +z cục bộ. Chiều cao ~1.25 m (scale 1).
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PI = Math.PI;
export const DUCK = { body: '#6b2fb3', head: '#55239a', belly: '#c9b4ef', bill: '#f6b21c', feet: '#f39a1a', ring: '#ffc83a', wingTip: '#ffc83a' };

export function makeDuck(o = {}) {
  const P = Object.assign({}, DUCK, o); const root = new THREE.Group();
  const mBody = std(P.body, { roughness: 0.75 }), mHead = std(P.head, { roughness: 0.7 }), mBelly = std(P.belly, { roughness: 0.85 }), mBill = std(P.bill, { roughness: 0.45 }), mFeet = std(P.feet, { roughness: 0.55 }), mRing = std(P.ring, { roughness: 0.4, metalness: 0.2 });
  const hip = new THREE.Group(); hip.position.y = 0.5; root.add(hip);           // trục thân (lắc khi đi)
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), mBody); body.scale.set(0.34, 0.31, 0.44); body.position.set(0, 0.14, 0); hip.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), mBelly); belly.scale.set(0.27, 0.25, 0.3); belly.position.set(0, 0.06, 0.16); hip.add(belly);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 14), mBody); tail.rotation.x = -PI / 2 - 0.55; tail.position.set(0, 0.26, -0.44); hip.add(tail);
  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 10), mRing); tailTip.rotation.x = -PI / 2 - 0.55; tailTip.position.set(0, 0.36, -0.58); hip.add(tailTip);
  // cổ + đầu
  const neck = new THREE.Group(); neck.position.set(0, 0.3, 0.24); hip.add(neck);
  const nk = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 6, 14), mBody); nk.position.y = 0.14; neck.add(nk);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.03, 8, 24), mRing); ring.rotation.x = PI / 2; ring.position.y = 0.06; neck.add(ring);
  const head = new THREE.Group(); head.position.y = 0.36; neck.add(head);
  const hs = new THREE.Mesh(new THREE.SphereGeometry(0.19, 26, 20), mHead); hs.scale.set(1, 0.95, 1.05); head.add(hs);
  const tuft = []; for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 8), mRing); f.position.set((k - 1) * 0.04, 0.2, -0.02 - Math.abs(k - 1) * 0.02); f.rotation.set(-0.3, 0, (k - 1) * 0.35); head.add(f); tuft.push(f); }
  // mỏ: hàm trên cố định, hàm dưới bản lề (quack)
  const billU = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), mBill); billU.scale.set(0.095, 0.035, 0.15); billU.position.set(0, -0.015, 0.21); head.add(billU);
  const jaw = new THREE.Group(); jaw.position.set(0, -0.045, 0.12); head.add(jaw);
  const billL = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), mBill); billL.scale.set(0.085, 0.022, 0.13); billL.position.set(0, -0.005, 0.085); jaw.add(billL);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), std('#5a1020')); mouth.scale.set(0.07, 0.015, 0.1); mouth.position.set(0, 0.008, 0.08); jaw.add(mouth);
  // mắt to: tròng trắng + con ngươi (nhìn theo look) + mí (chớp)
  const eyes = []; for (const sg of [-1, 1]) { const g = new THREE.Group(); g.position.set(sg * 0.1, 0.05, 0.13); head.add(g);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 14), std('#ffffff', { roughness: 0.25 })); g.add(w);
    const pup = new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), std('#0c0c12', { roughness: 0.2 })); pup.position.z = 0.045; g.add(pup);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' })); hl.position.set(0.012, 0.014, 0.072); g.add(hl);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.064, 18, 10, 0, PI * 2, 0, PI / 2), mHead); g.add(lid); lid.rotation.x = -1.6;
    eyes.push({ g, w, pup, lid, sg }); }
  // cánh: trục ở vai, khối dẹt kéo về sau; mép cánh vàng
  const wings = []; for (const sg of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sg * 0.3, 0.26, 0.1); hip.add(piv);
    const wm = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), mBody); wm.scale.set(0.06, 0.2, 0.32); wm.position.set(sg * 0.03, -0.08, -0.18); wm.rotation.x = 0.35; piv.add(wm);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mRing); tip.scale.set(0.045, 0.1, 0.16); tip.position.set(sg * 0.035, -0.17, -0.4); tip.rotation.x = 0.5; piv.add(tip);
    wings.push({ piv, sg }); }
  // chân: trục ở hông (dưới thân), ống chân + bàn chân màng
  const legs = []; for (const sg of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sg * 0.14, 0.02, 0.0); hip.add(piv);
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.42, 10), mFeet); shank.position.y = -0.24; piv.add(shank);
    const ank = new THREE.Group(); ank.position.y = -0.46; piv.add(ank);
    const sh = new THREE.Shape(); sh.moveTo(0, -0.02); sh.lineTo(-0.11, 0.2); sh.quadraticCurveTo(-0.05, 0.17, 0, 0.21); sh.quadraticCurveTo(0.05, 0.17, 0.11, 0.2); sh.lineTo(0, -0.02);
    const foot = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 }), mFeet); foot.rotation.x = PI / 2; foot.position.set(0, 0.0, -0.04); ank.add(foot);
    legs.push({ piv, ank, sg }); }
  root.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.receiveShadow = true; x.frustumCulled = false; } });
  return { root, hip, body, neck, head, jaw, eyes, wings, legs, tuft, tail };
}

// tư thế theo thời gian. o: walk (Hz bước, 0 = đứng), amp, flap (0..1), wingUp, hold (ôm bóng), fly (0..1 bay), peck (0..1),
// look [yaw, pitch], quack (0..1 mở mỏ), crouch, wide (mắt to), blink, seed, tired
export function poseDuck(d, t, o = {}) {
  const sd = o.seed || 0, tt = t + sd * 0.37; const walk = o.walk || 0, amp = o.amp ?? 1, fly = o.fly || 0, peck = o.peck || 0, hold = o.hold || 0;
  const ph = walk > 0 ? Math.sin(tt * walk * PI * 2) : 0, ph2 = walk > 0 ? Math.cos(tt * walk * PI * 2) : 0;
  const breath = Math.sin(tt * 2.1) * 0.012;
  // thân: nhún + lắc lư (waddle) + chúi khi bay/mổ
  d.hip.position.y = 0.5 - (o.crouch || 0) * 0.14 + breath + (walk ? Math.abs(ph2) * 0.04 * amp : 0) + fly * 0.06;
  d.hip.rotation.set(fly * 0.55 + peck * 0.35 + (o.crouch || 0) * 0.15, walk ? ph * 0.1 * amp : Math.sin(tt * 0.9) * 0.03, walk ? ph * 0.16 * amp : Math.sin(tt * 1.3) * 0.02);
  // chân: đá trước/sau so le; bay thì co về sau
  d.legs.forEach((L, i) => { const s = i ? 1 : -1; const sw = walk ? s * ph * 0.55 * amp : 0; L.piv.rotation.x = sw * (1 - fly) + fly * -1.25 - (o.crouch || 0) * 0.2; L.ank.rotation.x = (walk ? Math.max(0, -s * ph) * 0.5 : 0) * (1 - fly) + fly * 0.9 - L.piv.rotation.x * (1 - fly) * 0.6; });
  // cánh: vỗ / dang lên / ôm bóng trước ngực / khép sát
  const fl = o.flap || 0; const beat = Math.sin(tt * (o.flapHz || 7) * PI * 2);
  d.wings.forEach((W) => { const s = W.sg; let rz = s * (0.06 + breath * 2), rx = 0, ry = 0;
    if (fl) rz = s * (0.1 + fl * (0.75 + 0.75 * beat));
    if (o.wingUp) { rz = s * (1.3 * o.wingUp + 0.15 * Math.sin(tt * 9)); rx = -0.4 * o.wingUp; }
    if (hold) { ry = -s * 1.15 * hold; rz = s * 0.35 * hold; rx = -0.25 * hold; }
    if (walk && !fl && !hold && !o.wingUp) rz += s * Math.abs(ph) * 0.12;
    W.piv.rotation.set(rx, ry, rz); });
  // cổ + đầu: mổ, nhìn, gật khi đi
  const pk = peck ? peck * (0.95 + 0.35 * Math.sin(tt * 11)) : 0; const lk = o.look || [Math.sin(tt * 0.7) * 0.25, 0];
  d.neck.rotation.set(pk + (walk ? ph2 * 0.08 : 0) - (o.tired || 0) * -0.3, lk[0] * 0.4, 0);
  d.head.rotation.set(-lk[1] - pk * 0.2, lk[0] * 0.6, Math.sin(tt * 0.8) * 0.05);
  d.jaw.rotation.x = (o.quack || 0) * 0.55;
  d.tuft.forEach((f, k) => f.rotation.z = (k - 1) * 0.35 + Math.sin(tt * 6 + k) * 0.08 * (walk ? 1.5 : 0.6));
  d.tail.rotation.y = Math.sin(tt * (walk ? 6 : 1.4)) * (walk ? 0.25 : 0.08);
  // mắt: tròng to/nhỏ, con ngươi nhìn, chớp mỗi ~3 s
  const blinkAuto = ((tt * 0.33) % 1) < 0.04 ? 1 : 0; const bl = o.blink ?? blinkAuto; const wd = 1 + (o.wide || 0) * 0.35;
  d.eyes.forEach((E) => { E.g.scale.setScalar(wd); E.pup.position.set(lk[0] * 0.02, lk[1] * 0.02, 0.045); E.pup.scale.setScalar(1 - (o.wide || 0) * 0.3); E.lid.rotation.x = -1.6 + bl * 1.5 + (o.tired || 0) * 0.7; });
  d.root.updateMatrixWorld(true);
}
// đi bộ lạch bạch từ p0 → p1 (x,z) với tốc độ speed (m/s); trả về true khi tới nơi
export function duckTravel(d, t, t0, p0, p1, speed, o = {}) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz); const k = Math.min(1, Math.max(0, (t - t0) * speed / len));
  d.root.position.set(p0[0] + dx * k, o.y || 0, p0[1] + dz * k); d.root.rotation.set(0, o.face ?? Math.atan2(dx, dz), 0); d.root.visible = true;
  poseDuck(d, t, Object.assign({ walk: k < 1 ? (o.hz || 2.6) : 0, amp: 1 }, o)); return k >= 1;
}
// điểm ôm bóng (trước ngực) + điểm bàn chân
export const ballSpot = (d) => d.hip.localToWorld(V(0, 0.12, 0.5));
export const billTip = (d) => d.head.localToWorld(V(0, -0.03, 0.36));
