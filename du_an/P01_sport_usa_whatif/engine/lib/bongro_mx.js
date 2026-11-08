// Động tác bóng rổ GHÉP (v1.1-nba, 08/11/2026): thân + chân = clip mocap (UAL Jump_Start/Jump_Loop/Jump_Land, Idle, Crouch,
// đi/chạy qua loco/locoLock + Mixamo), tay + bóng = IK đặt SAU clip. Dùng khi chưa có clip Mixamo bóng rổ.
// Mọi hàm thuần theo thời gian (render từng khung độc lập). Thời gian u = giây tính từ lúc bắt đầu động tác.
import * as THREE from 'three';
import { ik2, groundIt, aim } from './tuthe.js';
import { clipPose, clipDur, locoLock } from './dongtac.js';

const V3 = THREE.Vector3;
const cl = (x) => Math.min(1, Math.max(0, x));
const sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const Lw = (ch, x, y, z) => new V3(x, y, z).applyQuaternion(ch.root.getWorldQuaternion(new THREE.Quaternion()));
const fwd = (ch) => Lw(ch, 0, 0, 1), lat = (ch, k = 1) => Lw(ch, k, 0, 0);
const bp = (ch, n) => ch.bones[n].getWorldPosition(new V3());
const hand = (ch, s, T, pole) => ik2(ch, 'upperarm_' + s, 'lowerarm_' + s, 'hand_' + s, T, pole);
export const BMX = { cl, sm };

// ---- thân khi nhảy: gom lực (ngồi xuống) → bật → trên không → tiếp đất → về đứng ----
// J: {g: thời gian gom lực, air: thời gian trên không, h: độ cao bật (m, đã nhân tỉ lệ), tuck: 0 chân duỗi .. 1 co gối, land, base: clip đứng}
// trả về {phase:'gather'|'air'|'land', s: tiến độ trong pha, y: độ cao bật hiện tại}
export function jumpBody(ch, lib, u, J = {}) {
  const g = J.g ?? 0.32, air = J.air ?? 0.6, h = J.h ?? 0.45, tuck = J.tuck ?? 0.45, base = J.base ?? 'Idle_Loop', seed = J.seed ?? 0;
  const dL = clipDur(ch, lib, 'Jump_Land');
  let L, phase, s, y = 0;
  if (u < g) { s = u / g; phase = 'gather';
    const k = sm(s); L = [{ name: base, time: u + seed, w: 1 - k }, { name: 'Jump_Start', time: 0, w: k, loop: false }]; }
  else if (u < g + air) { s = (u - g) / air; phase = 'air'; y = 4 * h * s * (1 - s);
    L = [{ name: 'Jump_Start', time: 0.13 + s * 0.75, w: tuck, loop: false }, { name: 'Jump_Loop', time: s * 0.8, w: (1 - tuck) * 0.4 }, { name: base, time: u + seed, w: (1 - tuck) * 0.6 }]; }
  else { const v = u - g - air; s = cl(v / dL); phase = 'land'; const back = sm((v - dL * 0.55) / (dL * 0.45));
    const soft = J.soft ?? 0; L = [{ name: 'Jump_Land', time: Math.min(dL * 0.999, v * (J.land ?? 1)), w: (1 - back) * (1 - soft), loop: false }, { name: base, time: u + seed, w: back + (1 - back) * soft }]; }
  clipPose(ch, lib, L.filter((q) => q.w > 0.001));
  return { phase, s, y };
}
// đặt nhân vật: chân chạm đất rồi cộng độ cao bật
function place(ch, x, z, yaw, y) { ch.root.position.set(x, 0, z); ch.root.rotation.set(0, yaw, 0); ch.root.updateMatrixWorld(true); groundIt(ch, 0, 0); ch.root.position.y += y; ch.root.updateMatrixWorld(true); }

// ---- tay cầm bóng: 0 = trước ngực (set), 1 = trên trán (điểm buông) ----
function setPoint(ch) { const c = bp(ch, 'spine_03').addScaledVector(fwd(ch), 0.3); c.y -= 0.05; return c; }
function releasePoint(ch) { const r = bp(ch, 'Head').addScaledVector(fwd(ch), 0.3).addScaledVector(lat(ch, -1), 0.04); r.y += 0.42 * ch.root.scale.y; return r; }
function twoHands(ch, ball, R) {
  hand(ch, 'r', ball.clone().addScaledVector(fwd(ch), -R * 0.9).addScaledVector(lat(ch, -1), 0.03), Lw(ch, -0.4, -0.7, 0.2));
  hand(ch, 'l', ball.clone().addScaledVector(lat(ch, 1), R * 0.95), Lw(ch, 0.8, -0.5, 0));
}

// ======== JUMP SHOT tại chỗ ========
// o: {x, z, yaw, R(bán kính bóng), J(tham số jumpBody), rel (tiến độ pha air lúc buông, mặc định 0.5)}
// trả về {ball: vị trí bóng khi còn trong tay (null nếu đã buông), released: bool, releasePos, tRelease (giây kể từ u=0)}
export function jumpShot(ch, lib, u, o = {}) {
  const R = o.R ?? 0.12, J = { h: 0.42 * ch.root.scale.y, tuck: 0.25, soft: 0.55, ...(o.J || {}) }, g = J.g ?? 0.32, air = J.air ?? 0.6, rel = o.rel ?? 0.5;
  const b = jumpBody(ch, lib, u, J); place(ch, o.x ?? 0, o.z ?? 0, o.yaw ?? 0, b.y);
  const tRel = g + air * rel;
  const up = sm((u - g * 0.7) / (tRel - g * 0.7)); // nâng bóng từ ngực lên điểm buông
  const S = setPoint(ch), Rp = releasePoint(ch);
  if (u < tRel) { const ball = S.lerp(Rp, up); twoHands(ch, ball, R); return { ball, released: false, releasePos: null, tRelease: tRel }; }
  // theo đà: tay phải duỗi thẳng lên-trước về phía rổ (~50°), cổ tay gập ("goose neck"); tay trái tách ra; khi tiếp đất tay trả dần về tư thế clip
  const M = armInfo(ch, lib); const f = sm((u - tRel) / 0.1), back = sm((u - g - air - 0.05) / 0.4);
  const nat = { l: bp(ch, 'hand_l'), r: bp(ch, 'hand_r') }; const UP = new V3(0, 1, 0);
  const shR = bp(ch, 'upperarm_r'), shL = bp(ch, 'upperarm_l');
  const dR = fwd(ch).multiplyScalar(0.62).add(UP.clone().multiplyScalar(0.78)).normalize(); const tR = shR.clone().addScaledVector(dR, M.arm * (0.9 + 0.08 * f));
  const dL = fwd(ch).multiplyScalar(0.45).add(UP.clone().multiplyScalar(0.8)).add(lat(ch, 1).multiplyScalar(0.35)).normalize(); const tL = shL.clone().addScaledVector(dL, M.arm * 0.85);
  hand(ch, 'r', tR.lerp(nat.r, back), Lw(ch, -0.3, -0.8, -0.2));
  if (back < 0.7) aim(ch.bones.hand_r, ch.bones.middle_01_r || ch.bones.hand_r, fwd(ch).multiplyScalar(0.5).add(new V3(0, -0.85 * f, 0)));
  hand(ch, 'l', tL.lerp(nat.l, back), Lw(ch, 0.6, -0.7, -0.2));
  return { ball: null, released: true, releasePos: Rp, tRelease: tRel };
}

// ======== quỹ đạo bóng bay: từ p0 tới tâm vành rim, cao nhất apex (m trên điểm cao hơn), T giây; make=true rơi qua lưới ========
export function ballFlight(p0, rim, v, T, o = {}) {
  const apex = o.apex ?? 1.3, s = v / T;
  if (s <= 1) { const p = p0.clone().lerp(rim, s); const top = Math.max(p0.y, rim.y) + apex; const a = p0.y, c = rim.y;
    // parabol đi qua (0,a),(1,c) với đỉnh ≈ top
    const bq = 2 * (top - a) + 2 * Math.sqrt(Math.max(0, (top - a) * (top - c))); p.y = a + bq * s - (bq - (c - a)) * s * s; return p; }
  const w = v - T; // sau khi tới vành
  if (o.make === false) { const d = new V3(p0.x - rim.x, 0, p0.z - rim.z).normalize(); const q = rim.clone().addScaledVector(d, 0.35 + w * 1.8); q.y = rim.y + 0.25 * Math.sin(Math.min(Math.PI, w * 6)) - Math.max(0, w - 0.5) * w * 6; return q; } // dội vành bật ra
  const q = rim.clone(); q.y -= Math.min(rim.y - (o.R ?? 0.12), w * 3.2 + 4.9 * w * w); return q; // rơi thẳng qua lưới
}
export const netSwish = (net, w) => { if (net) net.scale.y = 1 + 0.22 * Math.sin(Math.PI * cl(w / 0.3)); }; // w = giây kể từ khi bóng chạm vành

// vai (m, đứng) + chiều dài tay (m) đo 1 lần trên tư thế Idle
function armInfo(ch, lib) { if (ch._armInfo) return ch._armInfo; clipPose(ch, lib, [{ name: 'Idle_Loop', time: 0, w: 1 }]);
  const p = ch.root.position.clone(); place(ch, 0, 0, ch.root.rotation.y, 0); const a = bp(ch, 'upperarm_r'), b = bp(ch, 'lowerarm_r'), c = bp(ch, 'hand_r');
  ch._armInfo = { sh: a.y, arm: a.distanceTo(b) + b.distanceTo(c) }; ch.root.position.copy(p); return ch._armInfo; }

// ======== ÚP RỔ: chạy đà (caller dùng dribbleMove/locoLock tới điểm bật) rồi gọi dunk từ u=0 ========
// o: {from:[x,z] điểm bật, rim: Vector3 tâm vành, g, air, hang (giây treo vành), oneHand, R}
// trả về {ball, phase}
export function dunk(ch, lib, u, o) {
  const R = o.R ?? 0.12, rim = o.rim, g = o.g ?? 0.22, air = o.air ?? 0.62, hangT = o.hang ?? 0.55, sc = ch.root.scale.y;
  const from = new V3(o.from[0], 0, o.from[1]); const dir = new V3(rim.x - from.x, 0, rim.z - from.z); const dist = dir.length(); dir.normalize();
  const yaw = Math.atan2(dir.x, dir.z); const stop = new V3(rim.x, 0, rim.z).addScaledVector(dir, -0.32);
  const M = armInfo(ch, lib); const h = Math.max(0.3 * sc, rim.y + 0.3 - (M.sh + 0.95 * M.arm)); // đo vai + sải tay thật → tay vượt vành 30 cm
  const tA = g + air * 0.5; // đỉnh
  let pos, y = 0, phase;
  if (u < tA + 0.08) { const b = jumpBody(ch, lib, Math.min(u, g + air * 0.5), { g, air, h, tuck: 0.7, base: 'MX_Running' }); phase = b.phase;
    y = b.y; pos = from.clone().lerp(stop, sm(cl((u - g * 0.5) / (tA - g * 0.5)))); }
  else if (u < tA + 0.08 + hangT) { phase = 'hang'; clipPose(ch, lib, [{ name: 'Jump_Loop', time: u, w: 1 }]); pos = stop.clone();
    place(ch, pos.x, pos.z, yaw, 0); const sh0 = bp(ch, 'upperarm_r').y; const yh = rim.y + 0.02 - 0.9 * M.arm - sh0; // treo: tay vừa chạm vành
    y = h + (yh - h) * sm((u - tA - 0.08) / 0.15); }
  else { const v = u - tA - 0.08 - hangT; const b = jumpBody(ch, lib, g + air + v, { g, air, h: 0, base: 'Idle_Loop' }); phase = 'land'; pos = stop.clone().addScaledVector(dir, -0.15 * sm(v / 0.3));
    const yh = rim.y + 0.02 - 0.9 * M.arm - M.sh; y = Math.max(0, Math.max(0, yh) * (1 - (v / 0.3) ** 2)); }
  place(ch, pos.x, pos.z, yaw, y);
  const up = bp(ch, 'Head').addScaledVector(dir, 0.15); up.y += 0.35 * sc; // bóng trên đầu
  const over = rim.clone().addScaledVector(dir, -0.1); over.y += 0.22;
  let ball;
  if (phase === 'gather' || (phase === 'air' && u < tA - 0.12)) { const k = sm((u - g * 0.4) / (tA - 0.12 - g * 0.4)); ball = setPoint(ch).lerp(up, k); }
  else if (u < tA + 0.08) { ball = up.clone().lerp(over, sm((u - tA + 0.12) / 0.2)); }
  else { const w = u - tA - 0.08; ball = rim.clone(); ball.y -= Math.min(rim.y - R, w * 4 + 4.9 * w * w); }
  if (u < tA + 0.08) { if (o.oneHand && u > tA - 0.2) { hand(ch, 'r', ball.clone().addScaledVector(dir, -R * 0.8), Lw(ch, -0.5, -0.6, 0)); hand(ch, 'l', bp(ch, 'spine_03').addScaledVector(lat(ch, 1), 0.55), Lw(ch, 0.6, -0.4, 0)); }
    else twoHands(ch, ball, R); }
  else if (phase === 'hang') { for (const [s, k] of [['l', 1], ['r', -1]]) hand(ch, s, rim.clone().addScaledVector(dir, -0.2).addScaledVector(lat(ch, k), 0.13).add(new V3(0, 0.03, 0)), Lw(ch, k * 0.5, -0.6, -0.2)); }
  else { const k = sm((u - tA - 0.08 - hangT) / 0.35); for (const [s, q] of [['l', 1], ['r', -1]]) { const T = rim.clone().addScaledVector(dir, -0.2).addScaledVector(lat(ch, q), 0.13); T.lerp(bp(ch, 'thigh_' + s).addScaledVector(lat(ch, q), 0.2), k); hand(ch, s, T, Lw(ch, q * 0.5, -0.6, -0.2)); } }
  return { ball, phase, rimShake: phase === 'hang' ? Math.sin((u - tA) * 40) * 0.02 * (1 - cl((u - tA - 0.08) / hangT)) : 0 };
}

// ======== LAYUP một tay: bật một chân, tay phải đưa bóng lên bảng ========
// o: {from:[x,z], rim, R}; bóng buông ở đỉnh, đi chạm ô vuông trên bảng rồi rơi vào rổ (caller dùng ballFlight hoặc giá trị trả về)
export function layup(ch, lib, u, o) {
  const R = o.R ?? 0.12, rim = o.rim, g = o.g ?? 0.2, air = o.air ?? 0.58, sc = ch.root.scale.y;
  const from = new V3(o.from[0], 0, o.from[1]); const dir = new V3(rim.x - from.x, 0, rim.z - from.z).normalize(); const yaw = Math.atan2(dir.x, dir.z);
  const stop = new V3(rim.x, 0, rim.z).addScaledVector(dir, -0.75);
  const b = jumpBody(ch, lib, u, { g, air, h: 0.5 * sc, tuck: 0.55, base: 'MX_Running' });
  // một chân co cao (gối phải nâng) khi trên không
  const pos = from.clone().lerp(stop, sm(cl((u - g * 0.3) / (g + air * 0.6)))); place(ch, pos.x, pos.z, yaw, b.y);
  if (b.phase === 'air') { const k = Math.sin(Math.PI * b.s); aim(ch.bones.thigh_r, ch.bones.calf_r, Lw(ch, -0.1, -0.2 * (1 - k) - 0.05, 1).lerp(Lw(ch, -0.1, -1, 0.1), 1 - k)); }
  const tRel = g + air * 0.48;
  const hi = rim.clone().addScaledVector(dir, -0.35); hi.y += 0.25;
  if (u < tRel) { const k = sm((u - g * 0.5) / (tRel - g * 0.5)); const ball = setPoint(ch).lerp(hi, k);
    hand(ch, 'r', ball.clone().addScaledVector(dir, -R * 0.9), Lw(ch, -0.5, -0.6, 0)); hand(ch, 'l', k < 0.6 ? ball.clone().addScaledVector(lat(ch, 1), R) : bp(ch, 'spine_03').addScaledVector(lat(ch, 1), 0.5).addScaledVector(dir, 0.3), Lw(ch, 0.6, -0.5, 0));
    return { ball, released: false, releasePos: null, tRelease: tRel }; }
  const reach = hi.clone(); reach.y -= Math.max(0, (u - g - air) * 1.5); hand(ch, 'r', reach.addScaledVector(dir, -0.1), Lw(ch, -0.5, -0.6, 0));
  hand(ch, 'l', bp(ch, 'spine_03').addScaledVector(lat(ch, 1), 0.5).addScaledVector(dir, 0.2), Lw(ch, 0.6, -0.5, 0));
  return { ball: null, released: true, releasePos: hi, tRelease: tRel };
}

// ======== DẪN BÓNG khi đi/chạy/đứng (thân = locoLock, tay phải đập bóng theo nhịp) ========
// path(t)->[x,z]; o giống locoLock + {R, crouch (0..1 hạ thấp người khi đứng), hz (nhịp đập, mặc định theo tốc độ)}; trả về vị trí bóng
export function dribbleMove(ch, lib, t, path, o = {}) {
  const R = o.R ?? 0.12, sc = ch.root.scale.y;
  locoLock(ch, lib, t, path, { ...o, extra: [{ name: 'Crouch_Idle_Loop', time: t + (o.seed || 0), w: o.crouch ?? 0.3 }, ...(o.extra || [])] });
  const pa = path(Math.max(o.t0 ?? 0, t - 0.1)), pb = path(t + 0.1); const v = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 0.2; const hz = o.hz ?? (1.7 + Math.min(2.2, v * 0.45)); const ph = (t * hz + (o.seed || 0)) % 1; const hgt = Math.abs(Math.cos(Math.PI * ph)); // 1 ở tay, 0 chạm sàn
  ch.root.updateMatrixWorld(true);
  const lead = 0.2 + Math.min(0.3, v * 0.05); // chạy nhanh thì bóng ra trước hơn
  const base = ch.root.position.clone().addScaledVector(lat(ch, -1), 0.3 * sc).addScaledVector(fwd(ch), lead * sc);
  const top = bp(ch, 'pelvis').y + 0.05 * sc;
  const ball = base.clone(); ball.y = R + hgt * (top - R);
  const hp = ball.clone(); hp.y = Math.max(ball.y + R, top - 0.1 * sc) + R * 0.6;
  hand(ch, 'r', hp, Lw(ch, -0.6, -0.2, -0.8));
  return ball;
}
