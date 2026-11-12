// Tập 16 (NFL, dạng PHIM TÀI LIỆU HOANG DÃ, troll) — "Kirk Cousins just migrated back to Minnesota."
// 5 "vùng sống" đặt cách xa nhau trong một cảnh, mỗi vùng có trời/ánh sáng riêng (setEnv):
//   NORTH  (0,0,0)    bờ hồ đóng băng lúc bình minh, rừng bạch dương thân trắng lá vàng, mỏm đá granite, tổ gỗ trôi
//   DUSK   (cùng NORTH) chạng vạng xanh lam + đống lửa tàn của "đàn" Vikings
//   SOUTH  (90,0,0)   đồng cỏ Atlanta, cây sồi to rủ rêu, tổ cành khổng lồ
//   DESERT (-90,0,0)  sa mạc đất đỏ cam, mesa, xương rồng saguaro, tổ cỏ lăn, ánh đèn thành phố mờ ở chân trời
//   VALLEY (0,0,200)  thung lũng đêm phủ sương, đồi thấp, ánh đèn sân vận động xa (không logo), "bầy" trên sống đồi
//   SKY    (0,60,-200) bầu trời để bay qua (mây bên dưới)
// Không trùng E05 sân tuyết/E10 rừng thông/E13 bãi xe tuyết. Không logo, không biển hiệu thật.
import * as THREE from 'three';
import { lump } from './rungthong.js';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function ctex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t;
}
export const C = { north: [0, 0, 0], south: [90, 0, 0], desert: [-90, 0, 0], valley: [0, 0, 200], sky: [0, 60, -200] };
export const SP = { rock: [0, 0, 0], nest: [3.2, 1.6], fire: [-3.0, 2.2], stump: [4.6, -0.6], mic: [-1.2, 3.6], border: [6.5, 3.0] };
const gradTex = (stops) => ctex(16, 512, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach(([k, c]) => gr.addColorStop(k, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
const SKIES = {
  north: gradTex([[0, '#5a5a9a'], [0.32, '#a48ec0'], [0.47, '#f2c6a8'], [0.52, '#ffe2b4'], [0.56, '#cfd8e8'], [1, '#e8eef6']]),
  dusk: gradTex([[0, '#1c2448'], [0.35, '#3a4a84'], [0.5, '#8a7aa8'], [0.53, '#d89a8a'], [0.58, '#4a5470'], [1, '#2a3048']]),
  south: gradTex([[0, '#4a86c8'], [0.4, '#9cc4e4'], [0.52, '#f4e2b8'], [0.56, '#a8b880'], [1, '#6a7a4a']]),
  desert: gradTex([[0, '#3a2a6a'], [0.3, '#8a4a8a'], [0.45, '#e86a6a'], [0.51, '#ffb070'], [0.55, '#c86a4a'], [1, '#7a3a2a']]),
  valley: gradTex([[0, '#0a1024'], [0.4, '#1a2448'], [0.5, '#3a4268'], [0.53, '#6a6a7a'], [0.58, '#1a2030'], [1, '#101420']]),
  sky: gradTex([[0, '#3a6ab0'], [0.35, '#7aa6d8'], [0.5, '#ffd8a8'], [0.6, '#f4e8e0'], [1, '#d8e0ec']]),
};
const ENV = {
  north: { sky: 'north', fog: ['#d8d0e0', 40, 160], hemi: ['#d8d0f0', '#eef2f8', 1.35], sun: ['#ffcf9a', 2.6, [18, 9, 14]], c: C.north },
  dusk: { sky: 'dusk', fog: ['#4a5478', 25, 120], hemi: ['#7a88c0', '#3a4058', 1.05], sun: ['#e8a08a', 1.1, [-16, 6, -12]], c: C.north },
  south: { sky: 'south', fog: ['#dfe6d8', 50, 180], hemi: ['#e8f0ff', '#8a9a60', 1.4], sun: ['#fff0d0', 2.6, [12, 18, 10]], c: C.south },
  desert: { sky: 'desert', fog: ['#c88a7a', 45, 170], hemi: ['#f0b0c0', '#a85a3a', 1.25], sun: ['#ffa060', 2.4, [-20, 7, 10]], c: C.desert },
  valley: { sky: 'valley', fog: ['#2a3048', 14, 70], hemi: ['#6a7ab0', '#202430', 0.95], sun: ['#a8b8e8', 1.2, [10, 14, -8]], c: C.valley },
  sky: { sky: 'sky', fog: ['#f0e4dc', 60, 400], hemi: ['#ffffff', '#d8c8b8', 1.6], sun: ['#ffd8a8', 2.4, [10, 8, 10]], c: C.sky },
};
// ---------- NORTH ----------
function birch(G, x, z, h, seed) {
  const r = rnd(seed); const T = new THREE.Group(); T.position.set(x, 0, z); G.add(T);
  const bark = ctex(64, 256, (g, W, H) => { g.fillStyle = '#ece8e0'; g.fillRect(0, 0, W, H); for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(30,26,24,0.85)'; g.fillRect(r() * W, r() * H, 6 + r() * 18, 2 + r() * 3); } });
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, h, 8).translate(0, h / 2, 0), std('#fff', { map: bark })); tr.rotation.z = (r() - 0.5) * 0.08; tr.castShadow = true; T.add(tr);
  const leaf = std(['#e8b030', '#f0c040', '#d89a28'][seed % 3], { roughness: 0.9 });
  for (let i = 0; i < 7; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + r() * 0.5, 0), leaf); b.position.set((r() - 0.5) * 1.6, h * (0.62 + r() * 0.4), (r() - 0.5) * 1.6); b.castShadow = true; T.add(b); }
}
function driftNest(scale = 1, col = '#7a6a5a', seed = 5) {
  const G = new THREE.Group(); const r = rnd(seed); const m = std(col, { roughness: 0.95 });
  for (let i = 0; i < 46; i++) { const a = (i / 46) * Math.PI * 2 + r() * 0.3; const L = 1.1 + r() * 0.8; const s = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, L, 5), m);
    const rad = 0.95 + r() * 0.25; s.position.set(Math.cos(a) * rad, 0.12 + (i % 4) * 0.09, Math.sin(a) * rad); s.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.4, 0, a + Math.PI / 2 + (r() - 0.5) * 0.6); s.castShadow = true; G.add(s); }
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.85, 0.18, 20), m); base.position.y = 0.09; G.add(base);
  G.scale.setScalar(scale); return G;
}
function buildNorth(G) {
  const N = new THREE.Group(); N.position.set(...C.north); G.add(N);
  const snowT = ctex(256, 256, (g) => { g.fillStyle = '#eef2f8'; g.fillRect(0, 0, 256, 256); const r = rnd(4); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(150,170,200,${r() * 0.18})`; g.fillRect(r() * 256, r() * 256, 3, 3); } }, [10, 10]);
  const shore = new THREE.Mesh(new THREE.PlaneGeometry(70, 40), std('#ffffff', { map: snowT, roughness: 0.92 })); shore.rotation.x = -Math.PI / 2; shore.position.set(0, 0, 16); shore.receiveShadow = true; N.add(shore);
  const ice = new THREE.Mesh(new THREE.PlaneGeometry(140, 70), std('#bcd4e8', { roughness: 0.18, metalness: 0.1 })); ice.rotation.x = -Math.PI / 2; ice.position.set(0, -0.2, -39); ice.receiveShadow = true; N.add(ice);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(70, 0.25, 0.6), std('#e6ecf4', { roughness: 0.9 })); edge.position.set(0, -0.08, -4.1); N.add(edge);
  // mỏm đá granite (Kirk đứng trên)
  const rk = lump(1.6, 1.15, 1.3, 7, 22); rk.material = std('#8a8580', { roughness: 0.9 }); rk.position.set(...SP.rock); N.add(rk);
  const cap = lump(1.2, 0.25, 1.0, 8, 16); cap.position.set(0, 1.1, 0.05); N.add(cap);
  for (const [x, z, s, sd] of [[-5, -1, 0.9, 11], [6, -2.4, 1.2, 12], [-8, 3, 0.7, 13], [9, 4, 0.8, 14]]) { const b = lump(s, s * 0.6, s * 0.8, sd, 14); b.material = std('#8a8580', { roughness: 0.9 }); b.position.set(x, 0, z); N.add(b); }
  const r = rnd(21); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, d = 7 + r() * 22; const x = Math.cos(a) * d, z = Math.sin(a) * d; if (z < -3.5) continue; if (x > 2 && x < 12 && z > -1 && z < 9) continue; if (Math.abs(x) < 4 && z > 2 && z < 12) continue; if (x > -12 && x < 4 && z > 1 && z < 10) continue; birch(N, x, z, 5 + r() * 4, i); }
  // bờ xa bên kia hồ: dải tuyết + rừng bạch dương
  const far = new THREE.Mesh(new THREE.PlaneGeometry(120, 14), std('#ffffff', { map: snowT, roughness: 0.92 })); far.rotation.x = -Math.PI / 2; far.position.set(0, -0.05, -38); far.receiveShadow = true; N.add(far);
  { const rf = rnd(77); for (let i = 0; i < 70; i++) birch(N, -55 + rf() * 110, -33 - rf() * 9, 6 + rf() * 5, i + 100); }
  const sunD = new THREE.Mesh(new THREE.CircleGeometry(6, 32), new THREE.MeshBasicMaterial({ color: '#ffe0a0', fog: false, toneMapped: false })); sunD.position.set(30, 9, -105); N.add(sunD);
  // xa: dải núi tím lạnh bên kia hồ
  const mt = ctex(2048, 256, (g, W, H) => { g.clearRect(0, 0, W, H); const rr = rnd(2); g.fillStyle = '#6a6a9a'; g.beginPath(); g.moveTo(0, H); let y = H * 0.5; for (let x = 0; x <= W; x += 16) { y = Math.max(H * 0.15, Math.min(H * 0.8, y + (rr() - 0.5) * 30)); g.lineTo(x, y); } g.lineTo(W, H); g.fill(); });
  const mtn = new THREE.Mesh(new THREE.PlaneGeometry(260, 32), new THREE.MeshBasicMaterial({ map: mt, transparent: true, fog: false, depthWrite: false })); mtn.position.set(0, 12, -110); N.add(mtn);
  // tổ gỗ trôi ven hồ
  const nest = driftNest(1, '#7a6a5a', 5); nest.position.set(SP.nest[0], 0, SP.nest[1]); N.add(nest);
  // đống lửa tàn (dùng ở DUSK)
  const fire = new THREE.Group(); fire.position.set(SP.fire[0], 0, SP.fire[1]); N.add(fire);
  for (let i = 0; i < 5; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.9, 6), std('#3a2a1e')); l.rotation.set(Math.PI / 2, 0, i * 1.25); l.position.y = 0.08; fire.add(l); }
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff7a2a', toneMapped: false })); ember.position.y = 0.12; ember.scale.y = 0.5; fire.add(ember);
  const fl = new THREE.PointLight('#ff8a3a', 0, 7, 1.6); fl.position.y = 0.6; fire.add(fl);
  // gốc cây + điện thoại đổ chuông
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.7, 14), std('#6a4a32')); stump.position.set(SP.stump[0], 0.35, SP.stump[1]); stump.castShadow = true; N.add(stump);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.02, 14), std('#c8a07a')); ring.position.set(SP.stump[0], 0.71, SP.stump[1]); N.add(ring);
  const phone = new THREE.Group(); phone.position.set(SP.stump[0], 0.72, SP.stump[1]); N.add(phone);
  const pb = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.26), std('#6a2a8a', { roughness: 0.4 })); pb.position.y = 0.07; phone.add(pb);
  const hs = new THREE.Group(); hs.position.set(0, 0.17, 0); phone.add(hs); const hsm = std('#4f2683', { roughness: 0.4 });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.06), hsm); hs.add(bar); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.1), hsm); e.position.set(s * 0.15, 0.02, 0); hs.add(e); }
  // micro họp báo giữa rừng
  const mic = new THREE.Group(); mic.position.set(SP.mic[0], 0, SP.mic[1]); N.add(mic);
  for (let i = 0; i < 4; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.45, 6), std('#2a2a2e', { metalness: 0.6 })); st.position.set(-0.18 + i * 0.12, 0.72, 0); mic.add(st);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), std(['#c8283a', '#2a6ac8', '#e8b84a', '#2a2a2e'][i])); hd.position.set(-0.18 + i * 0.12, 1.47, 0.03); mic.add(hd); }
  // biển gỗ biên giới
  const bd = new THREE.Group(); bd.position.set(SP.border[0], 0, SP.border[1]); N.add(bd);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), std('#5a3a24')); post.position.y = 0.8; bd.add(post);
  const sg = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 0.05), std('#fff', { map: ctex(512, 140, (g, W, H) => { g.fillStyle = '#6a4a2c'; g.fillRect(0, 0, W, H); g.fillStyle = '#f4e6c8'; g.font = '900 72px Anton, Impact'; g.textAlign = 'center'; g.fillText('WISCONSIN →', W / 2, 98, W * 0.9); }) })); sg.position.y = 1.45; bd.add(sg);
  N.traverse((o) => { if (o.isMesh && !o.material.isMeshBasicMaterial) o.receiveShadow = true; });
  return { G: N, fire: { ember, fl, G: fire }, phone: hs, mic, border: bd, nest };
}
// ---------- SOUTH (Atlanta) ----------
function buildSouth(G) {
  const S = new THREE.Group(); S.position.set(...C.south); G.add(S);
  const grassT = ctex(256, 256, (g) => { g.fillStyle = '#7a9a4a'; g.fillRect(0, 0, 256, 256); const r = rnd(6); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${40 + r() * 60},${90 + r() * 60},${30 + r() * 30},0.5)`; g.fillRect(r() * 256, r() * 256, 2, 4); } }, [12, 12]);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), std('#ffffff', { map: grassT })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; S.add(gr);
  // cây sồi lớn rủ rêu
  const oak = new THREE.Group(); oak.position.set(-3.5, 0, -3); S.add(oak); const bark = std('#5a4632', { roughness: 0.95 });
  const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 4.5, 10).translate(0, 2.25, 0), bark); tk.castShadow = true; oak.add(tk);
  const r = rnd(31); const lf = std('#3e6a32', { roughness: 0.9 }), moss = std('#9aa88a', { roughness: 1 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const br = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 4.5, 8).translate(0, 2.25, 0), bark); br.position.y = 3.8; br.rotation.set(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0); br.castShadow = true; oak.add(br); }
  for (let i = 0; i < 16; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 + r() * 1.0, 1), lf); const a = r() * Math.PI * 2, d = 1.5 + r() * 3.2; b.position.set(Math.cos(a) * d, 5.8 + r() * 1.8, Math.sin(a) * d); b.castShadow = true; oak.add(b);
    if (i % 2 === 0) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.6 + r(), 6).rotateX(Math.PI), moss); m.position.set(b.position.x, b.position.y - 1.6, b.position.z); oak.add(m); } }
  const nest = driftNest(1.25, '#8a6a42', 9); nest.position.set(1.5, 0, 0.5); S.add(nest);
  // hàng rào gỗ trắng + bụi hoa
  for (let i = 0; i < 18; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), std('#f4f0e6')); p.position.set(-10 + i * 1.2, 0.45, -8); S.add(p); }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(21, 0.08, 0.05), std('#f4f0e6')); rail.position.set(0.2, 0.7, -8); S.add(rail);
  for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + r() * 0.1, 1), std(['#b84a6a', '#e8d090', '#d87a3a'][i % 3])); b.position.set(-9 + r() * 18, 0.15, -7 + r() * 1.2); S.add(b); }
  S.traverse((o) => { if (o.isMesh) o.receiveShadow = true; });
  return { G: S, nest };
}
// ---------- DESERT (Las Vegas) ----------
function saguaro(G, x, z, h, seed) {
  const r = rnd(seed); const m = std('#5a7a5a', { roughness: 0.8 }); const T = new THREE.Group(); T.position.set(x, 0, z); G.add(T);
  const tr = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, h, 6, 10), m); tr.position.y = h / 2 + 0.28; tr.castShadow = true; T.add(tr);
  for (const s of [-1, 1]) { if (r() < 0.25) continue; const y0 = h * (0.35 + r() * 0.25); const a1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.6, 4, 8), m); a1.rotation.z = s * Math.PI / 2; a1.position.set(s * 0.5, y0, 0); T.add(a1);
    const a2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 1.0 + r() * 0.6, 4, 8), m); a2.position.set(s * 0.82, y0 + 0.6, 0); a2.castShadow = true; T.add(a2); }
}
function buildDesert(G) {
  const D = new THREE.Group(); D.position.set(...C.desert); G.add(D);
  const sandT = ctex(256, 256, (g) => { g.fillStyle = '#c8784a'; g.fillRect(0, 0, 256, 256); const r = rnd(8); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${150 + r() * 80},${80 + r() * 50},${40 + r() * 30},0.45)`; g.fillRect(r() * 256, r() * 256, 3, 2); } }, [14, 14]);
  const sd = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), std('#ffffff', { map: sandT, roughness: 0.95 })); sd.rotation.x = -Math.PI / 2; sd.receiveShadow = true; D.add(sd);
  const r = rnd(41);
  for (const [x, z, w, h] of [[-22, -40, 14, 9], [18, -46, 20, 12], [40, -30, 10, 7], [-45, -20, 12, 8]]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.45, w * 0.6, h, 9), std('#b8603a', { roughness: 0.95 })); m.position.set(x, h / 2, z); m.castShadow = true; D.add(m);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.47, w * 0.47, 0.6, 9), std('#9a4a2a')); cap.position.set(x, h, z); D.add(cap); }
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 6 + r() * 26; const x = Math.cos(a) * d, z = Math.sin(a) * d; if (z > 10) continue; saguaro(D, x, z, 2.2 + r() * 2.5, i + 3); }
  for (let i = 0; i < 20; i++) { const b = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + r() * 0.5, 0), std('#9a5a3a')); b.position.set((r() - 0.5) * 30, 0.1, (r() - 0.5) * 24); D.add(b); }
  // tổ cỏ lăn
  const nest = driftNest(1.15, '#b8945a', 13); nest.position.set(1.4, 0, 0.6); D.add(nest);
  // ánh đèn thành phố xa (dải chấm sáng, không chữ)
  const city = ctex(1024, 128, (g, W, H) => { g.clearRect(0, 0, W, H); const rr = rnd(5); for (let i = 0; i < 70; i++) { const x = rr() * W, w = 6 + rr() * 22, h = 10 + rr() * 80; g.fillStyle = 'rgba(40,20,50,0.9)'; g.fillRect(x, H - h, w, h); for (let k = 0; k < 6; k++) { g.fillStyle = ['#ffd27a', '#ff7ab8', '#7ad8ff'][Math.floor(rr() * 3)]; g.fillRect(x + rr() * w, H - rr() * h, 2, 2); } } });
  const cty = new THREE.Mesh(new THREE.PlaneGeometry(70, 8), new THREE.MeshBasicMaterial({ map: city, transparent: true, fog: false, depthWrite: false })); cty.position.set(-10, 3.8, -78); D.add(cty);
  D.traverse((o) => { if (o.isMesh && !o.material.isMeshBasicMaterial) o.receiveShadow = true; });
  return { G: D, nest };
}
// ---------- VALLEY (Lambeau) ----------
function buildValley(G) {
  const V = new THREE.Group(); V.position.set(...C.valley); G.add(V);
  const gT = ctex(256, 256, (g) => { g.fillStyle = '#4a5a50'; g.fillRect(0, 0, 256, 256); const r = rnd(3); for (let i = 0; i < 2000; i++) { g.fillStyle = `rgba(${200 + r() * 50},${210 + r() * 40},230,${r() * 0.25})`; g.fillRect(r() * 256, r() * 256, 3, 3); } }, [12, 12]);
  const gd = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), std('#ffffff', { map: gT, roughness: 0.95 })); gd.rotation.x = -Math.PI / 2; gd.receiveShadow = true; V.add(gd);
  for (const [x, z, s] of [[-10, -14, 7], [11, -16, 8], [-18, -4, 6], [18, -6, 6], [0, -30, 10]]) { const h = lump(s, s * 0.35, s * 0.7, Math.abs(x) + 3, 20); h.material = std('#3a4a44', { roughness: 0.95 }); h.position.set(x, 0, z); V.add(h); }
  // ánh đèn sân vận động xa sau đồi (quầng sáng, không logo)
  const glowT = ctex(256, 256, (g) => { const gr = g.createRadialGradient(128, 160, 0, 128, 160, 128); gr.addColorStop(0, 'rgba(255,236,190,0.95)'); gr.addColorStop(0.4, 'rgba(255,214,140,0.35)'); gr.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshBasicMaterial({ map: glowT, transparent: true, depthWrite: false, fog: false, toneMapped: false })); glow.position.set(0, 6, -44); V.add(glow);
  for (const x of [-8, -3, 3, 8]) { const tw = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9, 0.4), std('#1a1e28')); tw.position.set(x, 4.5, -40); V.add(tw); const lp = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 0.3), new THREE.MeshBasicMaterial({ color: '#fff4d8', toneMapped: false })); lp.position.set(x, 9.2, -39.8); V.add(lp); }
  // các lớp sương
  const mistT = ctex(512, 128, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(200,210,235,0)'); gr.addColorStop(0.5, 'rgba(200,210,235,0.55)'); gr.addColorStop(1, 'rgba(200,210,235,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const mists = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(60, 3.5), new THREE.MeshBasicMaterial({ map: mistT, transparent: true, depthWrite: false, opacity: 0.7 })); m.position.set(0, 0.8 + (i % 2) * 0.6, -2 - i * 5); V.add(m); mists.push(m); }
  // trăng
  const moon = new THREE.Mesh(new THREE.CircleGeometry(4, 32), new THREE.MeshBasicMaterial({ color: '#f4f0e0', fog: false, toneMapped: false })); moon.position.set(-22, 24, -70); V.add(moon);
  V.traverse((o) => { if (o.isMesh && !o.material.isMeshBasicMaterial) o.receiveShadow = true; });
  return { G: V, mists };
}
// ---------- SKY ----------
function buildSky(G) {
  const S = new THREE.Group(); S.position.set(...C.sky); G.add(S);
  const t = ctex(256, 128, (g, W, H) => { const r = rnd(7); for (let i = 0; i < 16; i++) { const x = 30 + r() * 196, y = 40 + r() * 50, rr = 18 + r() * 30; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); } });
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }); const r = rnd(19); const cl = [];
  for (let i = 0; i < 40; i++) { const s = new THREE.Sprite(m); s.position.set((r() - 0.5) * 220, -8 - r() * 14, (r() - 0.5) * 80); const k = 14 + r() * 22; s.scale.set(k * 2, k, 1); S.add(s); cl.push(s); }
  return { G: S, clouds: cl };
}
export function buildWild(scene) {
  const G = new THREE.Group(); scene.add(G);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: SKIES.north, side: THREE.BackSide, fog: false, depthWrite: false })); scene.add(dome);
  const N = buildNorth(G), S = buildSouth(G), D = buildDesert(G), V = buildValley(G), K = buildSky(G);
  const sunVis = (name) => { N.G.children.forEach((o) => { if (o.geometry && o.geometry.type === 'CircleGeometry') o.visible = name === 'north'; }); };
  const hemi = new THREE.HemisphereLight('#fff', '#888', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff', 2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 }); sun.shadow.bias = -0.0004; scene.add(sun); scene.add(sun.target);
  // đèn chính ĐỨNG YÊN trong một vùng (không bám máy quay → bóng không bò)
  const setEnv = (name, cam) => { const e = ENV[name]; dome.material.map = SKIES[e.sky]; dome.position.copy(cam.position);
    scene.fog = new THREE.Fog(e.fog[0], e.fog[1], e.fog[2]); hemi.color.set(e.hemi[0]); hemi.groundColor.set(e.hemi[1]); hemi.intensity = e.hemi[2];
    sun.color.set(e.sun[0]); sun.intensity = e.sun[1]; sun.target.position.set(...e.c); sun.position.set(e.c[0] + e.sun[2][0], e.c[1] + e.sun[2][1], e.c[2] + e.sun[2][2]);
    N.G.visible = name === 'north' || name === 'dusk'; S.G.visible = name === 'south'; D.G.visible = name === 'desert'; V.G.visible = name === 'valley'; K.G.visible = name === 'sky'; sunVis(name);
    N.fire.fl.intensity = name === 'dusk' ? 9 : 0; N.fire.G.visible = name === 'dusk'; N.fire.ember.visible = name === 'dusk'; };
  return { setEnv, N, S, D, V, K };
}
// ---------- đạo cụ ----------
export function moneyBag() {
  const G = new THREE.Group(); const m = std('#c8a86a', { roughness: 0.8 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), m); b.scale.y = 1.1; G.add(b);
  const nk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.16, 12), m); nk.position.y = 0.36; G.add(nk);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 6, 14), std('#7a2a1a')); tie.rotation.x = Math.PI / 2; tie.position.y = 0.32; G.add(tie);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.2), new THREE.MeshBasicMaterial({ map: ctex(256, 120, (g, W, H) => { g.fillStyle = '#2f6a3a'; g.font = '900 96px Anton, Impact'; g.textAlign = 'center'; g.fillText('$180M', W / 2, 96, W * 0.92); }), transparent: true })); lab.position.set(0, -0.02, 0.335); G.add(lab);
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.2, 4), std('#5a4a3a')); rope.position.y = 1.5; G.add(rope);
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
export function bigKey() {
  const G = new THREE.Group(); const g = std('#e8c050', { metalness: 0.85, roughness: 0.25 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 24), g); ring.position.y = 0.32; G.add(ring);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 10), g); G.add(sh);
  for (const [y, w] of [[-0.2, 0.12], [-0.12, 0.08]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, 0.03), g); t.position.set(w / 2, y, 0); G.add(t); }
  G.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return G;
}
export function compass() {
  const G = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20), std('#c8a04a', { metalness: 0.8, roughness: 0.3 })); c.rotation.x = Math.PI / 2; G.add(c);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.08, 20), std('#f4ecd8')); face.position.z = 0.017; G.add(face);
  const nd = new THREE.Group(); nd.position.z = 0.02; G.add(nd); const n1 = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.07, 4), std('#c8283a')); n1.position.y = 0.035; nd.add(n1); const n2 = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.07, 4), std('#3a3a3a')); n2.rotation.z = Math.PI; n2.position.y = -0.035; nd.add(n2);
  return { G, needle: nd };
}
export function snowPuff() {
  const t = ctex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }); const G = new THREE.Group(); const S = [];
  for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(m); G.add(s); S.push([s, (i / 14) * Math.PI * 2]); }
  const set = (k) => { S.forEach(([s, a], i) => { const r = 0.3 + k * 1.6; s.position.set(Math.cos(a) * r, 0.2 + k * 0.6 * (i % 3) / 2, Math.sin(a) * r); s.scale.setScalar(0.5 + k * 1.2); }); m.opacity = Math.max(0, 1 - k); };
  return { G, set };
}
