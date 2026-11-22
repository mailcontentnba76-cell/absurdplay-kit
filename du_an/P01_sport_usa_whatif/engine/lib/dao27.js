// Tập 27 — đạo cụ: đầu HẠT DẺ BUCKEYE (kiểu linh vật Brutus: hạt dẻ nâu bóng, mảng be trên đỉnh, mặt hoạt hình), trang phục NÔNG DÂN
// (yếm đỏ có chữ N tự vẽ, quai đeo, mũ rơm), bắp ngô có vỏ bóc được, chĩa ba, vỉ nướng hạt dẻ + biển giá, máy gặt đập, bóng sói.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
// r = bán kính hạt dẻ (m). userData.mouth(k 0..1), userData.peel(k 0..1 → vỏ nâu thành ruột kem), userData.look(x,y), userData.crack(k)
export function nutHead(r = 0.2) {
  const G = new THREE.Group();
  const shellM = std('#5a2a10', { roughness: 0.22, metalness: 0.08 });
  const crackT = ctex(512, 256, (g) => { g.clearRect(0, 0, 512, 256); g.strokeStyle = 'rgba(20,10,4,0.95)'; g.lineWidth = 5; for (let k = 0; k < 4; k++) { let x = 220 + k * 30, y = 40; g.beginPath(); g.moveTo(x, y); for (let i = 0; i < 7; i++) { x += (Math.random() - 0.5) * 50; y += 22; g.lineTo(x, y); } g.stroke(); } });
  const nut = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 26), shellM); nut.scale.set(1, 0.97, 0.92); G.add(nut);
  const crackM = new THREE.MeshBasicMaterial({ map: crackT, transparent: true, opacity: 0, depthWrite: false });
  const crack = new THREE.Mesh(new THREE.SphereGeometry(r * 1.004, 36, 26), crackM); crack.scale.copy(nut.scale); crack.rotation.y = -Math.PI / 2; G.add(crack);
  // mảng be (rốn hạt) trên đỉnh, hơi lệch ra sau
  const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.012, 36, 12, 0, Math.PI * 2, 0, 0.95), std('#c89a62', { roughness: 0.85 })); cap.scale.copy(nut.scale); cap.rotation.x = -0.55; G.add(cap);
  // mặt
  const white = std('#ffffff', { roughness: 0.3 }), black = new THREE.MeshBasicMaterial({ color: '#120a06' });
  const eyes = []; for (const s of [-1, 1]) { const e = new THREE.Group(); const w = new THREE.Mesh(new THREE.SphereGeometry(r * 0.2, 16, 12), white); w.scale.set(1, 1.15, 0.6); e.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(r * 0.095, 12, 10), black); p.position.z = r * 0.1; e.add(p); e.userData.p = p; e.position.set(s * r * 0.36, r * 0.12, r * 0.84); G.add(e); eyes.push(e); }
  const brows = [-1, 1].map((s) => { const b = new THREE.Mesh(new THREE.BoxGeometry(r * 0.34, r * 0.07, r * 0.06), black); b.position.set(s * r * 0.36, r * 0.42, r * 0.84); G.add(b); return b; });
  const mouthM = new THREE.MeshBasicMaterial({ color: '#2a0c06' }); const mouth = new THREE.Mesh(new THREE.CircleGeometry(r * 0.26, 24), mouthM); mouth.position.set(0, -r * 0.4, r * 0.86); mouth.rotation.x = 0.3; G.add(mouth);
  const tongue = new THREE.Mesh(new THREE.CircleGeometry(r * 0.14, 16), std('#d8505a')); tongue.position.set(0, -r * 0.52, r * 0.875); tongue.rotation.x = 0.3; G.add(tongue);
  const brown = new THREE.Color('#5a2a10'), cream = new THREE.Color('#f0dcb0');
  G.userData.mouth = (k) => { const kk = Math.max(0.08, k); mouth.scale.set(1 - 0.2 * kk, kk, 1); tongue.visible = k > 0.4; tongue.scale.set(1, Math.max(0.1, k), 1); };
  G.userData.brow = (a) => { brows[0].rotation.z = -a; brows[1].rotation.z = a; };   // a > 0: cau mày giận; a < 0: sợ/buồn
  G.userData.look = (x, y) => eyes.forEach((e) => e.userData.p.position.set(x * r * 0.08, y * r * 0.08, r * 0.1));
  G.userData.peel = (k) => { shellM.color.copy(brown).lerp(cream, k); shellM.roughness = 0.22 + 0.6 * k; };
  G.userData.crack = (k) => { crackM.opacity = k; };
  G.userData.mouth(0.15); G.userData.brow(0);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
  return G;
}
// gắn đầu hạt dẻ vào xương Head (theo tư thế nghỉ, giống dressKit E23)
export function putNutHead(ch, r = 0.2) { const B = ch.bones; ch.root.position.set(0, 0, 0); ch.root.rotation.set(0, 0, 0); ch.root.scale.setScalar(1); ch.root.updateMatrixWorld(true);
  const h = B.Head.getWorldPosition(new THREE.Vector3()); const n = nutHead(r); n.position.set(h.x, h.y + r * 0.42, h.z + 0.01); ch.root.add(n); n.updateMatrixWorld(true); B.Head.attach(n); ch.nut = n; return n; }
// nông dân: yếm đỏ chữ N + quai đeo + mũ rơm vành rộng + khăn tay đỏ ở túi sau
export function dressFarmer(ch, i = 0) { const B = ch.bones; ch.root.position.set(0, 0, 0); ch.root.rotation.set(0, 0, 0); ch.root.scale.setScalar(1); ch.root.updateMatrixWorld(true);
  const W = (n) => B[n].getWorldPosition(new THREE.Vector3());
  const put = (bone, m, p, rot) => { m.position.copy(p); if (rot) m.rotation.set(...rot); ch.root.add(m); m.updateMatrixWorld(true); B[bone].attach(m); m.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } }); return m; };
  const red = ['#c8102e', '#b80c28', '#d01a34', '#c8102e'][i % 4];
  const bibT = ctex(256, 256, (g) => { g.fillStyle = red; g.fillRect(0, 0, 256, 256); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.setLineDash([10, 8]); g.strokeRect(14, 14, 228, 228); g.setLineDash([]);
    g.fillStyle = '#fdf2d9'; g.font = '900 170px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('N', 128, 140); });
  const s2 = W('spine_02'), s3 = W('spine_03');
  const bib = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.025), [std(red), std(red), std(red), std(red), std('#ffffff', { map: bibT }), std(red)]);
  put('spine_03', bib, new THREE.Vector3(s3.x, (s2.y + s3.y) / 2 + 0.02, s3.z + 0.135), [-0.08, 0, 0]);
  const strapM = std(red); for (const sd of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.42, 0.02), strapM); put('spine_03', st, new THREE.Vector3(s3.x + sd * 0.11, s3.y + 0.12, s3.z + 0.03), [0.05, 0, 0]);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.01, 10), std('#d8b048', { metalness: 0.8, roughness: 0.3 })); put('spine_03', btn, new THREE.Vector3(s3.x + sd * 0.11, s3.y + 0.0, s3.z + 0.15), [Math.PI / 2, 0, 0]); }
  // mũ rơm
  const straw = ctex(128, 128, (g) => { g.fillStyle = '#e2c47a'; g.fillRect(0, 0, 128, 128); for (let y = 0; y < 128; y += 6) { g.fillStyle = y % 12 ? 'rgba(150,110,50,0.35)' : 'rgba(255,240,190,0.3)'; g.fillRect(0, y, 128, 2); } });
  const hm = std('#ffffff', { map: straw, roughness: 0.95, side: THREE.DoubleSide });
  const hat = new THREE.Group(); const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.015, 28), hm); hat.add(brim);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.12, 20), hm); crown.position.y = 0.065; hat.add(crown);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.127, 0.127, 0.03, 20, 1, true), std(red)); band.position.y = 0.025; hat.add(band);
  const h = W('Head'); put('Head', hat, new THREE.Vector3(h.x, h.y + 0.15, h.z - 0.01), [-0.05, 0, 0]); ch.hat = hat;
  const pv = W('pelvis'); const rag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.2), std(red, { side: THREE.DoubleSide })); put('pelvis', rag, pv.clone().add(new THREE.Vector3(0.09, -0.05, -0.14)), [0.2, 0, 0]);
  return ch; }
// bắp ngô có vỏ: setHusk(k) 0 = còn vỏ, 1 = bóc hết
export function cornCob() { const G = new THREE.Group();
  const kern = ctex(128, 256, (g) => { g.fillStyle = '#e8b830'; g.fillRect(0, 0, 128, 256); for (let y = 0; y < 256; y += 10) for (let x = 0; x < 128; x += 10) { g.fillStyle = '#f6d050'; g.beginPath(); g.ellipse(x + 5 + (y / 10 % 2) * 5, y + 5, 4, 4.5, 0, 0, 7); g.fill(); } });
  const cob = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.16, 4, 12), std('#ffffff', { map: kern, roughness: 0.6 })); G.add(cob);
  const husks = []; for (let k = 0; k < 5; k++) { const p = new THREE.Group(); const l = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.27).translate(0, 0.1, 0), std('#a8b860', { side: THREE.DoubleSide, roughness: 0.9 })); l.position.z = 0.045; p.add(l); p.rotation.y = k / 5 * Math.PI * 2; p.position.y = -0.1; G.add(p); husks.push(l); }
  G.userData.setHusk = (k) => husks.forEach((l, i) => { l.rotation.x = k * (1.6 + (i % 2) * 0.3); l.material.color.set(k > 0.5 ? '#c8c070' : '#a8b860'); });
  G.userData.setHusk(0); G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
export function pitchfork() { const G = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 1.5, 8), std('#9a6a3a')); h.position.y = 0.2; G.add(h);
  const m = std('#9aa0a8', { metalness: 0.8, roughness: 0.3 }); const bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), m); bar.position.y = 0.96; G.add(bar);
  for (const x of [-0.1, 0, 0.1]) { const tn = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.28, 6), m); tn.position.set(x, 1.1, 0); G.add(tn); } G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// vỉ nướng + hạt dẻ + biển giá
export function nutGrill() { const G = new THREE.Group(); const blk = std('#1c1c1e', { roughness: 0.5, metalness: 0.4 });
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.32, 0.35, 24), blk); bowl.position.y = 0.85; G.add(bowl);
  for (let k = 0; k < 3; k++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 6), blk); const a = k / 3 * Math.PI * 2; leg.position.set(Math.cos(a) * 0.25, 0.37, Math.sin(a) * 0.25); leg.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25); G.add(leg); }
  const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.01, 24), std('#5a5a5e', { metalness: 0.8, roughness: 0.4 })); grate.position.y = 1.02; G.add(grate);
  const coal = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 20), new THREE.MeshBasicMaterial({ color: '#ff6a2a', toneMapped: false })); coal.position.y = 0.98; G.add(coal);
  const nutM = std('#4a2008', { roughness: 0.3 }); for (let k = 0; k < 9; k++) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), nutM); const a = k * 2.4, rr = 0.08 + (k % 3) * 0.1; n.position.set(Math.cos(a) * rr, 1.06, Math.sin(a) * rr); n.scale.set(1, 0.85, 0.9); G.add(n); }
  const sT = ctex(512, 256, (g) => { g.fillStyle = '#f6f0e2'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#b0282a'; g.lineWidth = 12; g.strokeRect(8, 8, 496, 240); g.fillStyle = '#b0282a'; g.textAlign = 'center'; g.font = '900 64px Anton, Impact, sans-serif'; g.fillText('ROASTED BUCKEYES', 256, 100); g.fillStyle = '#2a2420'; g.font = '900 96px Anton, Impact, sans-serif'; g.fillText('$5', 256, 200); });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), std('#ffffff', { map: sT, side: THREE.DoubleSide })); sign.position.set(0, 1.55, -0.15); G.add(sign);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), std('#8a6a42')); post.position.set(0, 1.2, -0.16); G.add(post);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G; }
// máy gặt đập (combine): spin(t) quay guồng
export function combine() { const G = new THREE.Group(); const green = std('#2e7a3a', { roughness: 0.45 }), yel = std('#e8c030', { roughness: 0.5 }), tire = std('#1c1c1c', { roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 6), green); body.position.y = 2.6; G.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 1.8), std('#203038', { metalness: 0.3, roughness: 0.2 })); cab.position.set(0, 4.7, 2.0); G.add(cab);
  const roofc = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 2.0), green); roofc.position.set(0, 5.6, 2.0); G.add(roofc);
  for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.6, 20), tire); w.rotation.z = Math.PI / 2; w.position.set(sx * 1.7, 1.0, 1.4); G.add(w); const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 16), tire); w2.rotation.z = Math.PI / 2; w2.position.set(sx * 1.6, 0.65, -2.2); G.add(w2); }
  const head = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.9, 1.4), yel); head.position.set(0, 0.8, 4.0); G.add(head);
  const reel = new THREE.Group(); reel.position.set(0, 1.6, 4.3); G.add(reel); for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.08, 0.08), yel); const a = k / 6 * Math.PI * 2; b.position.set(0, Math.cos(a) * 0.55, Math.sin(a) * 0.55); reel.add(b); }
  const auger = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 4, 10), green); auger.rotation.z = 1.2; auger.position.set(-2.6, 4.4, -0.5); G.add(auger);
  G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); G.userData.spin = (t) => { reel.rotation.x = -t * 4; }; return G; }
// bóng sói (Michigan) đổ dài trên sân: tấm tối mờ hình sói
export function wolfShadow() { const t = ctex(1024, 512, (g, W, H) => { g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(10,14,30,0.85)'; g.beginPath();
    const P = [[60, 420], [150, 300], [210, 280], [330, 290], [520, 280], [640, 250], [700, 170], [690, 90], [730, 150], [760, 60], [790, 150], [860, 190], [930, 230], [900, 260], [820, 270], [760, 330], [760, 430], [730, 430], [720, 350], [640, 360], [600, 440], [570, 440], [560, 360], [330, 360], [300, 440], [270, 440], [260, 360], [200, 360], [180, 440], [150, 440], [150, 360], [100, 400]];
    g.moveTo(...P[0]); P.forEach((p) => g.lineTo(...p)); g.closePath(); g.fill(); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -8 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.02; return m; }
