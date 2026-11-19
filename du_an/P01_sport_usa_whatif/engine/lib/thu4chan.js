// Thú 4 chân hoạt hình dựng bằng code (không skinning) — E24 hươu đực đuôi trắng (Bucks), E25 báo sư tử (Cougars).
// Khung: root (đặt trên mặt đất, mặt hướng +z) → pelvis (khớp hông sau, xoay để chồm/đứng 2 chân) → thân, 4 chân 3 đốt, cổ→đầu, đuôi.
// Mọi chuyển động là hàm thuần của t (render từng khung song song được).
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.82 }, o));
const cl = (x) => Math.min(1, Math.max(0, x)), sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
const TAU = Math.PI * 2;
function mesh(geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) { const m = new THREE.Mesh(geo, mat); m.position.set(...p); m.rotation.set(...r); m.scale.set(...s); m.castShadow = true; m.receiveShadow = true; return m; }
const SPH = new THREE.SphereGeometry(1, 24, 16);
const CAP = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14);

export const DEER = { kind: 'deer', fur: '#8f6c4c', dark: '#5e4430', white: '#f2eee6', nose: '#1c1612', hoof: '#2a2420', antler: '#e2d3ae',
  bodyLen: 0.92, bodyR: 0.23, legs: [0.31, 0.29, 0.25], legR: 0.05, neckLen: 0.42, neckR: 0.09, headLen: 0.34, headR: 0.12, antlers: 4, tail: 'flag', ears: 'long', band: null };
export const BULL = { kind: 'bull', fur: '#2a2220', dark: '#151110', white: '#3a302c', nose: '#5a4a44', hoof: '#151110', antler: '#e8e0cc',
  bodyLen: 1.25, bodyR: 0.36, legs: [0.3, 0.27, 0.2], legR: 0.08, neckLen: 0.22, neckR: 0.2, headLen: 0.4, headR: 0.18, antlers: 0, horns: true, tail: 'long', ears: 'round', band: null };
export const COUGAR = { kind: 'cougar', fur: '#c08c58', dark: '#8a5e36', white: '#efe2cc', nose: '#d89a88', hoof: '#a0703e', antler: null,
  bodyLen: 1.05, bodyR: 0.21, legs: [0.25, 0.23, 0.16], legR: 0.065, neckLen: 0.24, neckR: 0.11, headLen: 0.24, headR: 0.15, antlers: 0, tail: 'long', ears: 'round', band: null };

// ---------- gạc hươu: 2 nhánh chính cong ra trước + n chạc dựng ----------
function antlerSide(sg, n, mat) {
  const G = new THREE.Group();
  const pts = [V(0, 0, 0), V(sg * 0.10, 0.08, -0.05), V(sg * 0.20, 0.17, -0.02), V(sg * 0.24, 0.25, 0.08), V(sg * 0.18, 0.31, 0.2)];
  const curve = new THREE.CatmullRomCurve3(pts);
  G.add(mesh(new THREE.TubeGeometry(curve, 24, 0.016, 8, false), mat));
  for (let i = 0; i < n; i++) { const u = 0.28 + i * (0.62 / Math.max(1, n - 1)); const p = curve.getPointAt(Math.min(0.98, u));
    const L = 0.13 - i * 0.012; const tine = mesh(new THREE.ConeGeometry(0.012, L, 7), mat, [p.x, p.y + L / 2, p.z], [0.15, 0, -sg * 0.12]); G.add(tine); }
  G.add(mesh(new THREE.SphereGeometry(0.026, 10, 8), mat)); // gốc gạc (pedicle)
  return G;
}
function V(x, y, z) { return new THREE.Vector3(x, y, z); }

// ---------- mắt hoạt hình: lòng trắng + con ngươi + mí trên (chớp) ----------
function eye(r, x, y, z, sg) {
  const G = new THREE.Group(); G.position.set(x, y, z); G.rotation.y = sg * 0.55;
  G.add(mesh(new THREE.SphereGeometry(r, 18, 12), std('#fbfaf6', { roughness: 0.35 })));
  const pupil = mesh(new THREE.SphereGeometry(r * 0.52, 14, 10), std('#141010', { roughness: 0.2 }), [0, 0, r * 0.62]); G.add(pupil);
  pupil.add(mesh(new THREE.SphereGeometry(r * 0.14, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), [r * 0.16, r * 0.18, r * 0.42]));
  const lid = mesh(new THREE.SphereGeometry(r * 1.06, 18, 10, 0, TAU, 0, Math.PI / 2), null, [0, 0, 0]); G.add(lid);
  G.userData = { pupil, lid, r }; return G;
}

export function makeQuad(opt = {}) {
  const o = Object.assign({}, opt.kind === 'cougar' ? COUGAR : opt.kind === 'bull' ? BULL : DEER, opt);
  const M = { fur: std(o.fur), dark: std(o.dark), white: std(o.white), nose: std(o.nose, { roughness: 0.4 }), hoof: std(o.hoof, { roughness: 0.5 }), antler: o.antler ? std(o.antler, { roughness: 0.6 }) : null };
  const root = new THREE.Group(); root.name = 'quad';
  const [a, b, c] = o.legs; const legH = a + b + c + 0.03; const half = o.bodyLen / 2;
  const pelvis = new THREE.Group(); pelvis.position.set(0, legH, -half); root.add(pelvis);
  // thân: capsule nằm dọc trục z, bụng trắng, lưng sẫm
  const torso = mesh(CAP(o.bodyR, o.bodyLen), M.fur, [0, 0.06, half], [Math.PI / 2, 0, 0]); pelvis.add(torso);
  pelvis.add(mesh(CAP(o.bodyR * 0.82, o.bodyLen * 0.86), M.white, [0, -0.03, half], [Math.PI / 2, 0, 0], [1, 1, 0.92]));
  pelvis.add(mesh(CAP(o.bodyR * 0.55, o.bodyLen * 0.9), M.dark, [0, 0.06 + o.bodyR * 0.55, half], [Math.PI / 2, 0, 0], [1, 1, 0.6]));
  pelvis.add(mesh(SPH, M.fur, [0, 0.07, 0.02], [0, 0, 0], [o.bodyR * 1.08, o.bodyR * 1.05, o.bodyR * 1.0])); // mông
  pelvis.add(mesh(SPH, M.fur, [0, 0.08, o.bodyLen - 0.02], [0, 0, 0], [o.bodyR * 1.04, o.bodyR * 1.1, o.bodyR * 1.0])); // vai/ngực
  if (o.kind === 'deer') pelvis.add(mesh(SPH, M.white, [0, 0.0, -0.11], [0, 0, 0], [o.bodyR * 0.7, o.bodyR * 0.75, 0.06])); // mảng trắng mông
  // chân: hông → gối → cổ chân, mỗi đốt treo xuống −y
  const legs = [];
  const mkLeg = (x, z, front) => {
    const hip = new THREE.Group(); hip.position.set(x, 0, z); pelvis.add(hip);
    hip.add(mesh(CAP(o.legR * (front ? 1.6 : 2.0), a * 0.7), M.fur, [0, -a / 2, 0]));
    const knee = new THREE.Group(); knee.position.set(0, -a, 0); hip.add(knee);
    knee.add(mesh(CAP(o.legR * 1.05, b * 0.85), M.fur, [0, -b / 2, 0]));
    const ank = new THREE.Group(); ank.position.set(0, -b, 0); knee.add(ank);
    ank.add(mesh(CAP(o.legR * 0.8, c * 0.8), o.kind === 'deer' ? M.white : M.fur, [0, -c / 2, 0]));
    const foot = o.kind === 'deer' ? mesh(new THREE.CylinderGeometry(o.legR * 0.75, o.legR * 1.05, 0.06, 10), M.hoof, [0, -c - 0.0, 0.01])
      : mesh(SPH, M.fur, [0, -c - 0.0, 0.035], [0, 0, 0], [o.legR * 1.5, o.legR * 0.9, o.legR * 2.0]);
    ank.add(foot);
    if (o.band) ank.add(mesh(new THREE.TorusGeometry(o.legR * 1.0, o.legR * 0.42, 8, 18), std(o.band, { roughness: 0.6 }), [0, -c * 0.35, 0], [Math.PI / 2, 0, 0]));
    const L = { hip, knee, ank, front, x, z }; legs.push(L); return L;
  };
  const lx = o.bodyR * 0.62;
  mkLeg(lx, o.bodyLen - 0.03, true); mkLeg(-lx, o.bodyLen - 0.03, true); mkLeg(lx, 0.04, false); mkLeg(-lx, 0.04, false); // FL FR RL RR
  // cổ + đầu
  const neck = new THREE.Group(); neck.position.set(0, 0.12, o.bodyLen + 0.04); pelvis.add(neck);
  neck.add(mesh(CAP(o.neckR, o.neckLen), M.fur, [0, o.neckLen / 2, 0]));
  neck.add(mesh(CAP(o.neckR * 0.7, o.neckLen * 0.8), M.white, [0, o.neckLen * 0.45, o.neckR * 0.45], [0, 0, 0], [0.9, 1, 0.7]));
  const head = new THREE.Group(); head.position.set(0, o.neckLen + o.neckR * 0.4, 0); neck.add(head);
  const hl = o.headLen, hr = o.headR;
  head.add(mesh(SPH, M.fur, [0, 0.02, 0.02], [0, 0, 0], [hr * 1.05, hr * 1.0, hr * 1.15]));                       // sọ
  if (o.kind !== 'cougar') {
    head.add(mesh(CAP(hr * 0.62, hl * 0.6), M.fur, [0, -0.02, hl * 0.55], [Math.PI / 2 + 0.25, 0, 0]));        // mõm dài
    head.add(mesh(SPH, M.white, [0, -0.07, hl * 0.62], [0, 0, 0], [hr * 0.55, hr * 0.32, hr * 0.8]));            // cằm trắng
    head.add(mesh(SPH, M.nose, [0, 0.0, hl * 0.98], [0, 0, 0], [hr * 0.42, hr * 0.32, hr * 0.3]));               // mũi đen
    head.add(mesh(SPH, M.white, [0, 0.0, hl * 0.86], [0, 0, 0], [hr * 0.6, hr * 0.38, hr * 0.15]));              // viền trắng mũi
  } else {
    head.add(mesh(SPH, M.white, [0, -0.04, hl * 0.62], [0, 0, 0], [hr * 0.7, hr * 0.5, hr * 0.55]));             // mõm trắng ngắn
    head.add(mesh(SPH, M.nose, [0, 0.0, hl * 0.86], [0, 0, 0], [hr * 0.28, hr * 0.2, hr * 0.16]));               // mũi hồng
    for (const sg of [1, -1]) head.add(mesh(SPH, M.dark, [sg * hr * 0.32, -0.035, hl * 0.72], [0, 0, 0], [hr * 0.16, hr * 0.12, hr * 0.1])); // đốm ria đen
  }
  const eyes = [1, -1].map((sg) => { const e = eye(hr * 0.33, sg * hr * 0.62, hr * 0.38, hr * 0.62, sg); e.userData.lid.material = M.fur; head.add(e); return e; });
  const ears = [1, -1].map((sg) => { const g = new THREE.Group(); g.position.set(sg * hr * 0.72, hr * 0.75, -hr * 0.2); head.add(g);
    if (o.ears === 'long') { g.add(mesh(SPH, M.fur, [sg * 0.07, 0.07, 0], [0, 0, -sg * 0.9], [0.06, 0.12, 0.025])); g.add(mesh(SPH, M.white, [sg * 0.07, 0.07, 0.012], [0, 0, -sg * 0.9], [0.045, 0.095, 0.018])); }
    else { g.add(mesh(SPH, M.fur, [0, 0.04, 0], [0, 0, 0], [0.055, 0.06, 0.022])); g.add(mesh(SPH, M.dark, [0, 0.04, -0.01], [0, 0, 0], [0.04, 0.045, 0.012])); }
    g.userData.sg = sg; return g; });
  const antlers = [];
  if (o.antlers && M.antler) for (const sg of [1, -1]) { const A = antlerSide(sg, o.antlers, M.antler); A.position.set(sg * hr * 0.42, hr * 0.85, -hr * 0.05); head.add(A); antlers.push(A); }
  if (o.horns) for (const sg of [1, -1]) { const c = new THREE.CatmullRomCurve3([V(sg * hr * 0.6, hr * 0.6, 0), V(sg * hr * 1.3, hr * 0.7, 0.02), V(sg * hr * 1.7, hr * 1.1, 0.1)]);
    head.add(mesh(new THREE.TubeGeometry(c, 16, 0.03, 8, false), M.antler)); head.add(mesh(new THREE.ConeGeometry(0.03, 0.1, 8), M.antler, [sg * hr * 1.75, hr * 1.2, 0.12], [0.3, 0, -sg * 0.4])); }
  if (o.kind === 'bull') { head.add(mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14), std('#c8ccd4', { metalness: 0.8, roughness: 0.3 }), [0, -0.05, hl * 0.92], [0.2, 0, 0])); pelvis.add(mesh(SPH, M.fur, [0, 0.22, o.bodyLen - 0.12], [0, 0, 0], [0.24, 0.2, 0.3])); }
  // đuôi
  const tail = new THREE.Group(); tail.position.set(0, 0.14, -0.08); pelvis.add(tail);
  const tailSegs = [];
  if (o.tail === 'flag') { tail.add(mesh(SPH, M.fur, [0, 0, -0.1], [0, 0, 0], [0.065, 0.025, 0.12])); tail.add(mesh(SPH, M.white, [0, -0.02, -0.1], [0, 0, 0], [0.085, 0.03, 0.14]));
    const fluff = new THREE.Group(); for (let i = 0; i < 7; i++) fluff.add(mesh(SPH, M.white, [Math.sin(i * 2.4) * 0.05, -0.03 - (i % 3) * 0.015, -0.06 - (i * 0.023)], [0, 0, 0], [0.05, 0.035, 0.05])); tail.add(fluff); tail.userData.fluff = fluff; }
  else { let par = tail; for (let i = 0; i < 7; i++) { const g = new THREE.Group(); g.position.set(0, 0, i ? -0.11 : 0); par.add(g); g.add(mesh(CAP(0.032 - i * 0.002, 0.08), i > 5 ? M.dark : M.fur, [0, 0, -0.055], [Math.PI / 2, 0, 0])); tailSegs.push(g); par = g; }
    tailSegs[6].add(mesh(SPH, M.dark, [0, 0, -0.1], [0, 0, 0], [0.04, 0.04, 0.06])); }
  root.traverse((m) => { if (m.isMesh) { m.frustumCulled = false; } });
  return { root, pelvis, torso, legs, neck, head, eyes, ears, antlers, tail, tailSegs, o, legH, half, stride: { walk: 0.95, trot: 1.5, gallop: 2.6 } };
}

// tư thế đứng chuẩn mỗi chân (cổ chân sau gập kiểu khuỷu chân sau của thú)
function legRest(L, o) { if (L.front) return [0.02, -0.04, 0.03]; return o.kind === 'deer' ? [0.32, -0.62, 0.32] : [0.38, -0.7, 0.34]; }
const OFF = { walk: [0.25, 0.75, 0, 0.5], trot: [0, 0.5, 0.5, 0], gallop: [0.08, 0, 0.58, 0.5] };   // FL FR RL RR

// o: {gait:'idle'|'walk'|'trot'|'gallop', phase, amp, rear:0..1, crouch:0..1, tuck:0..1, tailUp:0..1, look:[yaw,pitch], hold:0..1 (chân trước ôm bóng khi đứng 2 chân),
//     blink, earUp, seed, mouth, wobble, sit:0..1}
export function poseQuad(q, t, o = {}) {
  const { pelvis, legs, neck, head, eyes, ears, tail, tailSegs } = q; const sd = o.seed || 0;
  const g = o.gait || 'idle'; const ph = o.phase || 0; const amp = o.amp ?? 1; const rear = sm(o.rear || 0); const crouch = o.crouch || 0, tuck = o.tuck || 0, sit = sm(o.sit || 0);
  // nhịp thở + đổi trọng tâm (luôn cử động)
  const br = Math.sin(t * 2.6 + sd) * 0.012, sway = Math.sin(t * 0.9 + sd * 1.7) * 0.025;
  let bob = 0, pitch = 0, roll = sway * 0.4;
  if (g === 'walk') { bob = Math.abs(Math.sin(ph * TAU * 2)) * 0.02; roll += Math.sin(ph * TAU) * 0.03; }
  if (g === 'trot') { bob = Math.abs(Math.sin(ph * TAU * 2)) * 0.045; }
  if (g === 'gallop') { bob = Math.sin(ph * TAU) * 0.07 + 0.03; pitch = Math.sin(ph * TAU + 0.6) * 0.12; }
  // đứng 2 chân: xoay pelvis quanh hông sau, ngóc lên ~78°
  const rearA = -1.36 * rear;
  pelvis.position.y = q.legH - crouch * 0.18 + bob * amp + br - sit * 0.32;
  pelvis.rotation.set(pitch * amp + rearA - sit * 0.55 + tuck * 0.0, 0, roll);
  q.torso.scale.set(1 + br * 2, 1, 1 + br * 2);
  legs.forEach((L, i) => {
    const [h0, k0, a0] = legRest(L, q.o); let h = h0, k = k0, an = a0;
    if (g !== 'idle') { const p = (ph + OFF[g][i]) * TAU; const A = (g === 'gallop' ? 0.75 : g === 'trot' ? 0.5 : 0.36) * amp;
      const sw = Math.sin(p), lift = Math.max(0, Math.cos(p)); h += sw * A; k += (L.front ? -1 : 1) * 0 + (L.front ? 0.9 : -0.9) * lift * A * 1.4 * (L.front ? 1 : 1); an += (L.front ? -0.4 : 0.4) * lift * A; }
    // gập chân khi ngồi xổm / bật nhảy / co giữa không trung
    const fold = Math.max(crouch, tuck);
    if (L.front) { h += -0.5 * fold; k += 1.4 * fold; an += -0.6 * fold; } else { h += 0.6 * fold; k += -1.2 * fold; an += 0.7 * fold; }
    // đứng 2 chân: chân sau bù góc để thẳng đứng; chân trước giơ ra trước (ôm bóng / vung)
    if (rear > 0) { if (!L.front) { h += -rearA * 0.92; k += 0.2 * rear; an += -0.15 * rear; }
      else { const hold = o.hold ?? 0.5; const sg = L.x > 0 ? 1 : -1; h += rear * (0.6 + 0.9 * hold + 0.15 * Math.sin(t * 3 + i)); k += rear * (1.0 - 0.6 * hold); an += rear * 0.4;
        L.hip.rotation.z = sg * rear * (0.15 - 0.3 * hold); } }
    else L.hip.rotation.z = 0;
    // ngồi: chân sau gập dưới mông, chân trước thẳng
    if (sit > 0 && !L.front) { h += sit * -1.2; k += sit * 1.5; an += sit * -0.9; }
    if (sit > 0 && L.front) { h += sit * 0.55; }
    L.hip.rotation.x = h; L.knee.rotation.x = k; L.ank.rotation.x = an;
  });
  // cổ + đầu: nhìn quanh tự nhiên + theo hướng look
  const lk = o.look || [0, 0]; const idleYaw = Math.sin(t * 0.7 + sd * 2.1) * 0.18 + Math.sin(t * 1.9 + sd) * 0.05;
  const nod = Math.sin(t * 1.3 + sd * 0.7) * 0.05 + (g === 'gallop' ? Math.sin(ph * TAU) * 0.15 : 0);
  neck.rotation.set(-0.55 - rearA * 0.75 + sit * 0.4 - (lk[1] || 0) * 0.5 - nod * 0.4 + crouch * 0.3, 0, 0);
  head.rotation.set(1.25 + rearA * 0.2 - (lk[1] || 0) * 0.6 + nod * 0.6 - sit * 0.3, (lk[0] || 0) + (o.look ? idleYaw * 0.35 : idleYaw), 0);
  // chớp mắt (mỗi 2,5–4 s) + mắt to khi hoảng
  const blinkT = (t + sd * 0.37) % (2.6 + (sd % 3) * 0.6); const bl = o.blink ?? (blinkT < 0.12 ? 1 - Math.abs(blinkT - 0.06) / 0.06 : 0);
  const wide = o.wide || 0;
  eyes.forEach((e) => { const lid = e.userData.lid; lid.rotation.x = lerp(-1.25 - wide * 0.4, -0.05, bl); e.scale.setScalar(1 + wide * 0.35); e.userData.pupil.scale.setScalar(1 - wide * 0.35); });
  // tai: giật nhẹ ngẫu nhiên, dựng khi hoảng
  ears.forEach((E, j) => { const tw = Math.max(0, Math.sin(t * 0.8 + j * 2 + sd) - 0.92) * 6; E.rotation.set(-0.2 - (o.earUp || 0) * 0.5 + tw * 0.3, 0, E.userData.sg * (0.25 + Math.sin(t * 1.4 + j + sd) * 0.06)); });
  if (o.horns) for (const sg of [1, -1]) { const c = new THREE.CatmullRomCurve3([V(sg * hr * 0.6, hr * 0.6, 0), V(sg * hr * 1.3, hr * 0.7, 0.02), V(sg * hr * 1.7, hr * 1.1, 0.1)]);
    head.add(mesh(new THREE.TubeGeometry(c, 16, 0.03, 8, false), M.antler)); head.add(mesh(new THREE.ConeGeometry(0.03, 0.1, 8), M.antler, [sg * hr * 1.75, hr * 1.2, 0.12], [0.3, 0, -sg * 0.4])); }
  if (o.kind === 'bull') { head.add(mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14), std('#c8ccd4', { metalness: 0.8, roughness: 0.3 }), [0, -0.05, hl * 0.92], [0.2, 0, 0])); pelvis.add(mesh(SPH, M.fur, [0, 0.22, o.bodyLen - 0.12], [0, 0, 0], [0.24, 0.2, 0.3])); }
  // đuôi
  if (tailSegs.length) { const sw = o.tailSwish ?? 1; tailSegs.forEach((s, i) => { s.rotation.set((i === 0 ? 0.9 : -0.12) - rearA * (i === 0 ? 0.6 : 0), Math.sin(t * 2.2 + i * 0.6 + sd) * 0.12 * sw, 0); }); }
  else { const up = sm(o.tailUp || 0); const flick = Math.sin(t * 7 + sd) * 0.15 * (1 - up) * (Math.sin(t * 0.6 + sd) > 0.6 ? 1 : 0);
    tail.rotation.set(lerp(0.7, -1.35, up) + flick - rearA * 0.4, Math.sin(t * 9 + sd) * 0.12 * up, 0);
    if (tail.userData.fluff) tail.userData.fluff.scale.setScalar(1 + up * 0.9); }
  q.root.updateMatrixWorld(true);
}

// di chuyển dọc đoạn thẳng p0→p1 (mặt đất xz), pha bước theo quãng đường → chân không trượt
export function quadTravel(q, t, t0, p0, p1, speed, gait = 'trot', o = {}) {
  const d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); const s = Math.min(d, Math.max(0, (t - t0) * speed)); const k = d ? s / d : 1;
  const face = Math.atan2(p1[0] - p0[0], p1[1] - p0[1]);
  q.root.position.set(lerp(p0[0], p1[0], k), o.y || 0, lerp(p0[1], p1[1], k)); q.root.rotation.set(0, o.face ?? face, 0);
  const moving = k < 1; poseQuad(q, t, Object.assign({}, o, { gait: moving ? gait : 'idle', phase: s / q.stride[gait] }));
  return !moving;
}

// bật nhảy: u ∈ [0,1] trên toàn cú nhảy (0–0,22 ngồi thu, 0,22–0,32 bật duỗi, 0,32–0,82 bay co chân, 0,82–1 tiếp đất)
export function jumpPose(u) {
  if (u < 0.22) return { crouch: sm(u / 0.22) * 0.9, tuck: 0, lift: 0 };
  if (u < 0.32) return { crouch: 0.9 * (1 - sm((u - 0.22) / 0.1)), tuck: 0, lift: 0 };
  if (u < 0.82) return { crouch: 0, tuck: sm((u - 0.32) / 0.18) * (1 - sm((u - 0.62) / 0.2)) * 0.9, lift: Math.sin(Math.PI * (u - 0.32) / 0.5) };
  return { crouch: Math.sin(Math.PI * (u - 0.82) / 0.18) * 0.5, tuck: 0, lift: 0 };
}
