// Động tác MƯỢT (từ E06 sửa): dùng clip mocap UAL1/UAL2 thay cho tư thế viết tay.
// - clipPose: hoà trộn nhiều clip theo trọng số, thuần theo t (render từng khung không phụ thuộc khung trước).
// - loco: đi/chạy bộ/chạy nước rút theo đường đi path(t): pha bước = quãng đường đã đi / sải chân đo từ clip → chân không trượt;
//         hướng người quay theo vận tốc (làm trơn), hoà trộn dáng theo tốc độ, đứng yên thì về Idle; hỗ trợ đi lùi.
// - expr: biểu cảm theo mốc lời (preset), chuyển mượt các tham số số, chớp mắt + liếc mắt tự nhiên.
import * as THREE from 'three';

const clipOf = (ch, lib, name) => { ch._clips ??= {}; return (ch._clips[name] ??= lib.clips.find((c) => c.name === name)); };
export function clipPose(ch, lib, layers) {
  ch._acts ??= new Map(); const used = new Set();
  for (const L of layers) { if (!(L.w > 0.001)) continue; const c = clipOf(ch, lib, L.name); if (!c) throw new Error('No clip ' + L.name);
    const a = ch.mixer.clipAction(c); ch._acts.set(L.name, a); if (!a.isScheduled()) a.play();
    a.enabled = true; a.setEffectiveTimeScale(0); a.setEffectiveWeight(L.w); const d = c.duration;
    a.time = L.loop === false ? Math.min(d - 1e-3, Math.max(0, L.time)) : (((L.time % d) + d) % d); used.add(L.name); }
  for (const [n, a] of ch._acts) if (!used.has(n) && a.isScheduled()) a.stop(); // stop (không chỉ enabled=false) để thu hồi binding -> không nhiễm NaN
  // PropertyMixer chỉ ghi xương khi giá trị khác lần trước -> sau resetPose/IK tay, khung giống hệt bị bỏ qua. Xoá bộ đệm cũ để luôn ghi lại.
  { const ai = ch.mixer._accuIndex; for (const b of ch.mixer._bindings) { const st = b.valueSize, o = ai * st + st; b.buffer.fill(NaN, o, o + st); } } // chỉ vùng cũ (vùng mới được tính lại) để không nhiễm NaN
  ch.mixer.update(0);
}
export const clipDur = (ch, lib, name) => clipOf(ch, lib, name).duration;

// sải chân 1 chu kỳ (m, ở tỉ lệ 1): đo độ trượt lùi của bàn chân trong pha chạm đất
const STRIDE = {};
export function measureStride(ch, lib, name) {
  if (STRIDE[name]) return STRIDE[name]; const d = clipDur(ch, lib, name); const s0 = ch.root.scale.x; const rot = ch.root.rotation.y; ch.root.scale.setScalar(1); ch.root.rotation.set(0, 0, 0); ch.root.position.set(0, 0, 0);
  const foot = ch.bones.foot_l || ch.bones.Foot_L || ch.bones['foot.l']; const v = new THREE.Vector3(); let minZ = 1e9, maxZ = -1e9, minY = 1e9; const S = [];
  for (let i = 0; i <= 60; i++) { clipPose(ch, lib, [{ name, time: d * i / 60, w: 1 }]); ch.root.updateMatrixWorld(true); foot.getWorldPosition(v); S.push([v.y, v.z]); minY = Math.min(minY, v.y); }
  for (const [y, z] of S) if (y < minY + 0.05) { minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); } // chỉ lấy lúc chân chạm đất
  ch.root.scale.setScalar(s0); ch.root.rotation.y = rot; return (STRIDE[name] = Math.max(0.6, 2 * (maxZ - minZ)));
}
const GAITS = [{ name: 'Walk_Loop', v: 1.5 }, { name: 'Jog_Fwd_Loop', v: 3.4 }, { name: 'Sprint_Loop', v: 6.5 }];
const angLerp = (a, b, k) => { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * k; };
// path(t) -> [x,z]; o: {t0, face (hướng khi đứng), back (đi lùi), gait ép ('Walk_Loop'…), idle ('Idle_Loop'), extra:[layers…] }
export function loco(ch, lib, t, path, o = {}) {
  const t0 = o.t0 ?? 0, sc = ch.root.scale.x; const P = (tt) => path(Math.max(t0, tt));
  let s = 0; const dt = 1 / 60; let prev = P(t0); for (let tt = t0 + dt; tt <= t + 1e-9; tt += dt) { const q = P(tt); s += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
  { const q = P(t); s += Math.hypot(q[0] - prev[0], q[1] - prev[1]); }
  const h = 0.12, a = P(t - h), b = P(t + h); const vx = (b[0] - a[0]) / (2 * h), vz = (b[1] - a[1]) / (2 * h); const v = Math.hypot(vx, vz);
  // hướng: theo vận tốc làm trơn (cửa sổ 0,5 s), đi lùi thì quay ngược
  const a2 = P(t - 0.25), b2 = P(t + 0.25); let hd = Math.atan2(b2[0] - a2[0], b2[1] - a2[1]); if (o.back) hd += Math.PI;
  const face = o.face ?? hd; const mv = Math.min(1, v / 0.6); const yaw = v > 0.05 ? angLerp(face, hd, mv) : face;
  // trọng số dáng
  let W = GAITS.map(() => 0); const gs = o.gait ? GAITS.filter((g) => g.name === o.gait) : GAITS;
  if (o.gait) W = GAITS.map((g) => (g.name === o.gait ? 1 : 0));
  else if (v <= GAITS[0].v) W[0] = 1; else if (v >= GAITS[2].v) W[2] = 1;
  else { const i = v < GAITS[1].v ? 0 : 1; const k = (v - GAITS[i].v) / (GAITS[i + 1].v - GAITS[i].v); W[i] = 1 - k; W[i + 1] = k; }
  const D = GAITS.reduce((acc, g, i) => acc + W[i] * measureStride(ch, lib, g.name), 0) * sc; const phi = (o.back ? -1 : 1) * s / Math.max(0.3, D) + (o.phase ?? 0);
  const idleW = o.idleBelow === false ? 0 : 1 - Math.min(1, v / 0.35);
  const layers = GAITS.map((g, i) => ({ name: g.name, time: phi * clipDur(ch, lib, g.name), w: W[i] * (1 - idleW) })).filter((L) => L.w > 0.001);
  if (idleW > 0.001) layers.push({ name: o.idle || 'Idle_Loop', time: t + (o.seed || 0), w: idleW });
  clipPose(ch, lib, [...layers, ...(o.extra || [])]);
  const p = P(t); ch.root.position.set(p[0], 0, p[1]); ch.root.rotation.set(0, yaw, 0);
  return { v, yaw, s };
}
// đường đi tiện dụng: đoạn thẳng có tăng/giảm tốc mượt từ A tới B trong [ta,tb]
export const seg = (A, B, ta, tb, ease = (x) => x * x * (3 - 2 * x)) => (t) => { const k = ease(Math.min(1, Math.max(0, (t - ta) / (tb - ta)))); return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; };
// tăng tốc từ đứng yên rồi chạy đều (không giảm tốc ở cuối)
export const run = (A, B, ta, tb) => (t) => { const x = Math.min(1, Math.max(0, (t - ta) / (tb - ta))); const acc = 0.25; const k = x < acc ? (x * x) / (2 * acc) / (1 - acc / 2) : (x - acc / 2) / (1 - acc / 2); return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; };

// ---------- biểu cảm ----------
export const EX = {
  neutral: { mouth: 'flat', mouthOpen: 0, eyeWide: 0, browRaise: 0, browAngle: 0.15, lid: 0.05, squint: 0 },
  smug: { mouth: 'smile', mouthOpen: 0, eyeWide: -0.1, browRaise: 0.2, browAngle: -0.1, lid: 0.3, squint: 0.15 },
  confident: { mouth: 'smile', mouthOpen: 0, eyeWide: 0.1, browRaise: 0.1, browAngle: 0.0, lid: 0.1, squint: 0 },
  shock: { mouth: 'o', mouthOpen: 1, eyeWide: 1, browRaise: 0.9, browAngle: 0.35, lid: 0, squint: 0 },
  surprised: { mouth: 'o', mouthOpen: 0.5, eyeWide: 0.7, browRaise: 0.6, browAngle: 0.25, lid: 0, squint: 0 },
  wince: { mouth: 'grimace', mouthOpen: 0, eyeWide: -0.2, browRaise: 0.1, browAngle: 0.45, lid: 0.25, squint: 0.6 },
  proud: { mouth: 'grin', mouthOpen: 0.4, eyeWide: 0.15, browRaise: 0.35, browAngle: 0.0, lid: 0.05, squint: 0.2 },
  laugh: { mouth: 'grin', mouthOpen: 1, eyeWide: -0.2, browRaise: 0.4, browAngle: 0.1, lid: 0.35, squint: 0.7 },
  sad: { mouth: 'frown', mouthOpen: 0, eyeWide: -0.1, browRaise: 0.35, browAngle: 0.5, lid: 0.45, squint: 0 },
  determined: { mouth: 'flat', mouthOpen: 0, eyeWide: 0.15, browRaise: -0.2, browAngle: -0.35, lid: 0.15, squint: 0.2 },
  panic: { mouth: 'o', mouthOpen: 0.8, eyeWide: 1, browRaise: 1, browAngle: 0.6, lid: 0, squint: 0 },
  shrug: { mouth: 'grin', mouthOpen: 0.15, eyeWide: 0.2, browRaise: 0.8, browAngle: 0.3, lid: 0.05, squint: 0 },
  talk: { mouth: 'talk', mouthOpen: 0.5, eyeWide: 0.1, browRaise: 0.25, browAngle: 0.05, lid: 0.05, squint: 0 },
  cheer: { mouth: 'grin', mouthOpen: 0.9, eyeWide: 0.4, browRaise: 0.6, browAngle: 0.1, lid: 0, squint: 0.2 } };
const NUM = ['mouthOpen', 'eyeWide', 'browRaise', 'browAngle', 'lid', 'squint'];
// keys: [[t, preset, {ghi đè}], …] tăng dần theo t. Chuyển trong 0,22 s; chớp mắt 3–4 s/lần; mắt liếc nhẹ; 'talk' tự mấp máy.
export function expr(ch, t, keys, o = {}) {
  let i = 0; for (let j = 0; j < keys.length; j++) if (t >= keys[j][0]) i = j;
  const A = Object.assign({}, EX[keys[Math.max(0, i - 1)][1]], keys[Math.max(0, i - 1)][2] || {}), Bp = Object.assign({}, EX[keys[i][1]], keys[i][2] || {});
  const k = i === 0 ? 1 : Math.min(1, (t - keys[i][0]) / 0.22); const kk = k * k * (3 - 2 * k);
  const F = {}; for (const n of NUM) F[n] = +((A[n] ?? 0) + ((Bp[n] ?? 0) - (A[n] ?? 0)) * kk).toFixed(2);
  F.mouth = kk < 0.5 ? A.mouth : Bp.mouth; if (F.mouth === 'flat') F.mouth = 'line';
  if (F.mouth === 'talk') F.mouthOpen = +(0.15 + 0.55 * Math.abs(Math.sin(t * 11.3 + (o.seed || 0))) * (0.6 + 0.4 * Math.sin(t * 3.1))).toFixed(2);
  const sd = o.seed || 0; const p = ((t + sd * 1.37) % 3.3 + 3.3) % 3.3; const blink = p < 0.07 ? p / 0.07 : p < 0.15 ? (0.15 - p) / 0.08 : 0;
  const look = o.look || [+(Math.sin(t * 0.9 + sd) * 0.35 + Math.sin(t * 3.7 + sd) * 0.08).toFixed(2), +(Math.sin(t * 0.6 + sd * 1.3) * 0.15).toFixed(2)];
  ch.face({ ...F, blink: +Math.max(blink, F.squint > 0.6 ? 0 : 0).toFixed(2), look });
}
