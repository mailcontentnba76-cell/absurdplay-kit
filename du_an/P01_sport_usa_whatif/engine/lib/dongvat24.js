// Tập 24 (Mascot) — CON VẬT THẬT: bò rừng bison (to, bướu, lông bờm sẫm, sừng cong ngắn, râu cằm) và cá heo mũi chai (thân thuôn lathe, trán dưa,
// mõm, vây lưng cong, vây ngực, đuôi ngang). Cả hai có khớp để diễn: bison phi nước đại/đứng thở/nghiêng đầu ngơ ngác; cá heo quẫy (uốn thân), nhảy,
// nhắm một mắt (ngủ nửa não). Kèm tuyết rơi (Points), vũng nước, tia nước bắn, mũ len cho fan.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
const furTex = (base, dark) => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { g.strokeStyle = i % 3 ? dark : 'rgba(255,230,200,0.12)'; g.lineWidth = 1 + Math.random() * 1.5; const x = Math.random() * 256, y = Math.random() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 4, y + 4 + Math.random() * 8); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t; };

// ---------- BISON (vai ~1,8 m, dài ~3 m), mặt nhìn +z ----------
export function makeBison(seed = 0) {
  const G = new THREE.Group(); const body = new THREE.Group(); G.add(body);
  const coat = std('#ffffff', { map: furTex(['#5a3a22', '#62402a', '#523420'][seed % 3], 'rgba(30,18,10,0.35)'), roughness: 0.95 });
  const mane = std('#ffffff', { map: furTex('#3a2416', 'rgba(10,6,4,0.45)'), roughness: 1 });
  const hornM = std('#2a2622', { roughness: 0.4 }), eyeM = std('#0a0806', { roughness: 0.2 }), noseM = std('#1e1612', { roughness: 0.5 });
  const rear = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 14), coat); rear.scale.set(0.95, 0.95, 1.25); rear.position.set(0, 1.12, -0.55); body.add(rear);
  const hump = new THREE.Mesh(new THREE.SphereGeometry(0.82, 22, 16), mane); hump.scale.set(0.98, 1.1, 1.0); hump.position.set(0, 1.42, 0.45); body.add(hump);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), mane); chest.scale.set(0.9, 1.05, 0.9); chest.position.set(0, 1.08, 0.82); body.add(chest);
  const neck = new THREE.Group(); neck.position.set(0, 1.25, 1.12); body.add(neck); // khớp cổ (cúi/ngẩng/nghiêng)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 12), mane); head.scale.set(1.05, 1.15, 1.25); head.position.set(0, -0.32, 0.32); neck.add(head);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), coat); muzzle.scale.set(1.15, 0.95, 1.05); muzzle.position.set(0, -0.58, 0.6); neck.add(muzzle);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), noseM); nose.scale.set(1.5, 0.8, 0.6); nose.position.set(0, -0.56, 0.78); neck.add(nose);
  const beard = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 10), mane); beard.rotation.x = Math.PI; beard.position.set(0, -0.85, 0.42); neck.add(beard);
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), eyeM); e.position.set(s * 0.26, -0.24, 0.6); neck.add(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' })); hl.position.set(s * 0.27, -0.22, 0.64); neck.add(hl);
    const horn = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.045, 8, 14, Math.PI * 0.75), hornM); horn.position.set(s * 0.3, -0.04, 0.32); horn.rotation.set(0, s > 0 ? 0 : Math.PI, Math.PI * 0.1); neck.add(horn);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), mane); ear.scale.set(1.4, 0.6, 0.6); ear.position.set(s * 0.38, -0.2, 0.22); neck.add(ear);
  }
  // chân: khớp vai/hông (đùi) + khớp gối (cẳng) + móng
  const legs = []; const legM = coat, hoofM = std('#1a1410', { roughness: 0.5 });
  for (const [x, z, front] of [[-0.32, 0.75, 1], [0.32, 0.75, 1], [-0.3, -0.75, 0], [0.3, -0.75, 0]]) {
    const hip = new THREE.Group(); hip.position.set(x, front ? 1.05 : 1.0, z); body.add(hip);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(front ? 0.17 : 0.2, 0.12, 0.55, 10), front ? mane : legM); up.position.y = -0.27; hip.add(up);
    const knee = new THREE.Group(); knee.position.y = -0.55; hip.add(knee);
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.45, 8), legM); lo.position.y = -0.22; knee.add(lo);
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.08, 8), hoofM); hoof.position.y = -0.47; knee.add(hoof);
    legs.push({ hip, knee, front });
  }
  const tail = new THREE.Group(); tail.position.set(0, 1.38, -1.25); body.add(tail);
  const tl = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.55, 6), coat); tl.position.y = -0.27; tail.add(tl);
  const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mane); tuft.scale.y = 1.6; tuft.position.y = -0.58; tail.add(tuft);
  G.userData = { body, neck, legs, tail }; return shad(G);
}
// mode: 'idle' | 'gallop' | 'trot'; o.look=[cúi(-)/ngẩng(+), quay trái phải], o.tilt nghiêng đầu (ngơ ngác)
export function poseBison(B, t, mode = 'idle', o = {}) {
  const { body, neck, legs, tail } = B.userData; const ph = o.ph || 0;
  body.position.set(0, 0, 0); body.rotation.set(0, 0, 0);
  if (mode === 'gallop' || mode === 'trot') {
    const f = mode === 'gallop' ? 2.6 : 1.7, a = mode === 'gallop' ? 0.75 : 0.45; const w = (t * f + ph) * Math.PI * 2;
    const offs = mode === 'gallop' ? [0, 0.12, 0.55, 0.65] : [0, 0.5, 0.5, 0];
    legs.forEach((L, i) => { const p = w + offs[i] * Math.PI * 2; L.hip.rotation.x = Math.sin(p) * a; L.knee.rotation.x = (L.front ? 1 : -1) * Math.max(0, Math.cos(p)) * a * 1.2; });
    body.position.y = Math.abs(Math.sin(w)) * (mode === 'gallop' ? 0.22 : 0.08); body.rotation.x = Math.sin(w) * (mode === 'gallop' ? 0.08 : 0.03);
    neck.rotation.set(-0.15 + Math.sin(w + 1) * 0.12 + (o.look?.[0] || 0), o.look?.[1] || 0, o.tilt || 0); tail.rotation.x = 0.9 + Math.sin(w * 2) * 0.3;
  } else {
    legs.forEach((L) => { L.hip.rotation.x = 0; L.knee.rotation.x = 0; });
    body.position.y = Math.sin(t * 1.6 + ph) * 0.015; body.scale.setScalar(1);
    neck.rotation.set(Math.sin(t * 0.8 + ph) * 0.06 + (o.look?.[0] || 0), Math.sin(t * 0.5 + ph) * 0.08 + (o.look?.[1] || 0), o.tilt || 0);
    tail.rotation.set(0.15, 0, Math.sin(t * 2.2 + ph) * 0.35);
    if (o.paw) { const L = legs[0]; L.hip.rotation.x = -0.4 - Math.max(0, Math.sin(t * 7)) * 0.5; L.knee.rotation.x = 0.8; }
  }
}

// ---------- CÁ HEO (dài ~2,6 m), mõm nhìn +z, nằm thì bụng xuống (y≈0,4) ----------
export function makeDolphin(seed = 0) {
  const G = new THREE.Group(); const top = std(['#6f8aa3', '#7a93a8', '#66829c'][seed % 3], { roughness: 0.32 }), bel = std('#e8eef2', { roughness: 0.38 });
  const prof = (k) => { const P = []; for (let i = 0; i <= 24; i++) { const u = i / 24; const r = k * (u < 0.18 ? Math.sin(u / 0.18 * Math.PI / 2) * 0.36 : 0.36 * Math.pow(Math.max(0, Math.cos((u - 0.18) / 0.82 * Math.PI / 2)), 1.15) + 0.025); P.push(new THREE.Vector2(Math.max(0.004, r), u * 2.2)); } return P; };
  const mk = (k, m) => { const g = new THREE.LatheGeometry(prof(k), 24); g.rotateX(-Math.PI / 2); g.translate(0, 0, 0.95); return new THREE.Mesh(g, m); };
  const front = new THREE.Group(), rear = new THREE.Group(); G.add(front); rear.position.z = 0.2; front.add(rear); // khớp uốn ở giữa thân
  const body = mk(1, top); body.scale.set(1, 0.92, 1); front.add(body);
  const belly = mk(0.97, bel); belly.scale.set(1.0, 0.86, 1); belly.position.y = -0.05; front.add(belly);
  // dồn phần đuôi sang khớp rear: cuống đuôi + đuôi ngang
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.05, 0.75, 12), top); ped.rotation.x = Math.PI / 2; ped.position.z = -0.75; rear.add(ped);
  const fl = new THREE.Shape(); fl.moveTo(0, 0); fl.quadraticCurveTo(0.22, -0.02, 0.42, -0.22); fl.quadraticCurveTo(0.2, -0.16, 0, -0.1); fl.quadraticCurveTo(-0.2, -0.16, -0.42, -0.22); fl.quadraticCurveTo(-0.22, -0.02, 0, 0);
  const fluke = new THREE.Mesh(new THREE.ExtrudeGeometry(fl, { depth: 0.03, bevelEnabled: false }), top); fluke.rotation.x = -Math.PI / 2; fluke.position.set(0, 0, -1.08); rear.add(fluke);
  const melon = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 12), top); melon.scale.set(0.95, 0.88, 1.05); melon.position.set(0, 0.07, 0.86); front.add(melon);
  const beak = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.36, 12), top); beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.06, 1.18); front.add(beak);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), top); tip.position.set(0, -0.06, 1.36); front.add(tip);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 4, 16, Math.PI * 0.7), std('#3a4a58')); smile.rotation.set(Math.PI / 2, 0, Math.PI * 1.15); smile.position.set(0, -0.09, 1.08); front.add(smile);
  const finS = new THREE.Shape(); finS.moveTo(0, 0); finS.quadraticCurveTo(0.05, 0.3, -0.22, 0.42); finS.quadraticCurveTo(-0.2, 0.16, -0.36, 0); finS.lineTo(0, 0);
  const dfin = new THREE.Mesh(new THREE.ExtrudeGeometry(finS, { depth: 0.04, bevelEnabled: false }), top); dfin.rotation.y = -Math.PI / 2; dfin.position.set(0.02, 0.28, 0.05); front.add(dfin);
  const pecs = []; for (const s of [-1, 1]) { const p = new THREE.Group(); p.position.set(s * 0.26, -0.14, 0.55); const f = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6), top); f.scale.set(1.3, 0.12, 0.55); f.position.set(s * 0.14, 0, -0.05); p.add(f); front.add(p); pecs.push(p); }
  const eyes = [], lids = []; for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std('#0c0c10', { roughness: 0.15 })); e.position.set(s * 0.23, 0.0, 0.92); front.add(e); eyes.push(e);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' })); hl.position.set(s * 0.255, 0.018, 0.95); front.add(hl); eyes.push(hl);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), top); lid.position.copy(e.position); lid.rotation.z = s * 0.3; lid.scale.y = 0.05; front.add(lid); lids.push(lid); }
  G.userData = { front, rear, pecs, lids, eyes }; return shad(G);
}
// mode: 'flop' (quẫy trên cỏ), 'swim' (uốn sóng), 'idle', 'sleep' (nhắm 1 mắt), 'jump' (k 0..1 cung nhảy), 'cheer'
export function poseDolphin(D, t, mode = 'idle', o = {}) {
  const { front, rear, pecs, lids, eyes } = D.userData; const ph = o.ph || 0; eyes.forEach((e) => { e.scale.set(1, 1, 1); e.visible = true; });
  front.position.set(0, 0.36, 0); front.rotation.set(0, 0, 0); rear.rotation.set(0, 0, 0); lids.forEach((l) => (l.scale.y = 0.05)); pecs.forEach((p, i) => (p.rotation.set(0, 0, 0)));
  if (mode === 'flop') { const w = (t * (o.f || 1.6) + ph) * Math.PI * 2; const b = Math.max(0, Math.sin(w));
    front.position.y = 0.36 + b * 0.35; rear.rotation.x = -0.25 - b * 0.7; front.rotation.x = 0.18 * b - 0.05; front.rotation.z = Math.sin(w * 0.5) * 0.25; pecs.forEach((p, i) => (p.rotation.z = (i ? -1 : 1) * Math.sin(w * 2) * 0.6)); }
  else if (mode === 'swim') { const w = (t * 2 + ph) * Math.PI * 2; rear.rotation.x = Math.sin(w) * 0.35; front.rotation.x = -Math.sin(w) * 0.06; }
  else if (mode === 'sleep') { front.position.y = 0.34 + Math.sin(t * 1.2 + ph) * 0.01; const sd = o.side ?? 0; eyes[sd * 2].scale.set(1.2, 0.12, 1); eyes[sd * 2 + 1].visible = false; rear.rotation.x = -0.05; }
  else if (mode === 'cheer') { const w = (t * 3 + ph) * Math.PI * 2; front.position.y = 0.36 + Math.abs(Math.sin(w)) * 0.8; front.rotation.x = -0.5 - Math.abs(Math.sin(w)) * 0.3; rear.rotation.x = 0.4 + Math.sin(w) * 0.3; pecs.forEach((p, i) => (p.rotation.z = (i ? -1 : 1) * (0.6 + Math.sin(w * 2) * 0.5))); }
  else if (mode === 'jump') { const k = o.k || 0; front.position.y = 0.36 + Math.sin(k * Math.PI) * 2.6; front.rotation.x = -Math.cos(k * Math.PI) * 1.1; rear.rotation.x = Math.sin(k * Math.PI * 2) * 0.4; }
  else { front.position.y = 0.36 + Math.sin(t * 1.5 + ph) * 0.02; rear.rotation.x = -0.1 + Math.sin(t * 1.3 + ph) * 0.12; pecs.forEach((p, i) => (p.rotation.z = (i ? -1 : 1) * Math.sin(t * 2 + ph) * 0.25)); }
  if (o.sad) { front.rotation.x += 0.12; rear.rotation.x += 0.1; }
}

// ---------- TUYẾT RƠI quanh tâm (cx,cz): set(k) mật độ 0..1, update(t) ----------
export function snowfall(scene, N = 5000, R = 40, Hh = 30) {
  const g = new THREE.BufferGeometry(); const P = new Float32Array(N * 3), seed = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { seed[i * 3] = Math.random(); seed[i * 3 + 1] = Math.random(); seed[i * 3 + 2] = Math.random(); }
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'); const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();
  const m = new THREE.PointsMaterial({ size: 0.16, map: tex, transparent: true, depthWrite: false, color: '#ffffff', opacity: 0.95 });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts); let k = 0, cx = 0, cz = 0;
  return { pts, set: (kk, x = cx, z = cz) => { k = kk; cx = x; cz = z; pts.visible = k > 0.01; },
    update: (t) => { const n = Math.floor(N * k); for (let i = 0; i < N; i++) { if (i >= n) { P[i * 3 + 1] = -99; continue; } const a = seed[i * 3], b = seed[i * 3 + 1], c = seed[i * 3 + 2];
      const y = Hh - ((t * (1.4 + c) + a * Hh) % Hh); P[i * 3] = cx + (a - 0.5) * 2 * R + Math.sin(t * 0.8 + c * 9) * 0.6; P[i * 3 + 1] = y; P[i * 3 + 2] = cz + (b - 0.5) * 2 * R + Math.cos(t * 0.7 + a * 9) * 0.6; }
      g.attributes.position.needsUpdate = true; } };
}
// vũng nước (r) + tia nước bắn
export function puddle(r = 2.6) { const G = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: '#4a86b8', roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.85 });
  const shp = new THREE.Shape(); for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr = r * (1 + 0.12 * Math.sin(a * 3) + 0.06 * Math.cos(a * 5)); i ? shp.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.7) : shp.moveTo(rr, 0); }
  const p = new THREE.Mesh(new THREE.ShapeGeometry(shp), m); p.rotation.x = -Math.PI / 2; p.position.y = 0.03; p.receiveShadow = true; G.add(p);
  const rim = new THREE.Mesh(new THREE.RingGeometry(r * 0.98, r * 1.08, 32), new THREE.MeshBasicMaterial({ color: '#d8ecff', transparent: true, opacity: 0.5 })); rim.rotation.x = -Math.PI / 2; rim.scale.y = 0.7; rim.position.y = 0.032; G.add(rim);
  G.userData.set = (k) => { G.scale.setScalar(Math.max(0.001, k)); G.visible = k > 0.01; }; return G; }
export function splashFX(scene, N = 140) { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 6, 4), new THREE.MeshStandardMaterial({ color: '#cfe6ff', roughness: 0.1, transparent: true, opacity: 0.9 }), N); im.frustumCulled = false; scene.add(im); const D = new THREE.Object3D();
  return { im, draw: (x, z, k) => { if (k <= 0 || k >= 1) { im.count = 0; return; } let n = 0; for (let i = 0; i < N; i++) { const a = i * 2.399, sp = 1.5 + (i % 7) * 0.5, up = 3 + (i % 5) * 1.2; const tt = k * 1.2;
      D.position.set(x + Math.cos(a) * sp * tt, Math.max(0.05, up * tt - 4.9 * tt * tt), z + Math.sin(a) * sp * tt); D.scale.setScalar(1.6 - k); D.updateMatrix(); im.setMatrixAt(n++, D.matrix); } im.count = n; im.instanceMatrix.needsUpdate = true; } }; }
// mũ len có quả bông (gắn vào xương Head, toạ độ cục bộ)
export function beanie(c = '#c60c30', c2 = '#00338d') { const G = new THREE.Group(); const m = std(c, { roughness: 1 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), m); cap.scale.set(1.04, 1.15, 1.08); cap.position.y = 0.07; G.add(cap);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.135, 0.05, 18), std(c2, { roughness: 1 })); cuff.position.y = 0.075; G.add(cuff);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), std('#f4f4f4', { roughness: 1 })); pom.position.y = 0.22; G.add(pom); return shad(G); }
