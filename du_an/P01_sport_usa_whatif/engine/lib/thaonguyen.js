// E08 (NBA): sân bóng rổ ngoài trời giữa THẢO NGUYÊN lúc hoàng hôn + HƯƠU CAO CỔ dựng bằng code (không dùng mô hình ngoài).
// Bối cảnh mới, không trùng E01–E07. Kích thước sân NBA thật 28,65 × 15,24 m; rổ 3,05 m; hươu cao cổ đực ~5,2 m tới đỉnh đầu.
import * as THREE from 'three';
import { hoop } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const ctex = (w, h, draw, rep) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.userData.cv = cv; return t; };
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const CT = { L: 28.65, W: 15.24, RIM: 12.73 };

// ======================= SÂN THẢO NGUYÊN =======================
export function buildSavanna(scene, o = {}) {
  const r = rnd(o.seed ?? 7);
  // bầu trời hoàng hôn: tím trên đỉnh → cam → vàng sát chân trời (phía mặt trời đậm hơn)
  const sunDir = new THREE.Vector3(-0.85, 0.09, -0.52).normalize();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { sd: { value: sunDir } },
    vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `varying vec3 vp; uniform vec3 sd;
      void main(){ float h = clamp(vp.y,-0.2,1.); float s = max(0.,dot(vp,sd));
        vec3 top = vec3(0.23,0.20,0.48), mid = vec3(0.98,0.52,0.30), hor = vec3(1.0,0.80,0.42);
        vec3 c = mix(hor, mid, smoothstep(0.0,0.16,h)); c = mix(c, top, smoothstep(0.16,0.62,h));
        c += vec3(1.0,0.55,0.2)*pow(s,6.)*0.55 + vec3(1.,0.9,0.6)*pow(s,120.)*1.6;
        if (h < 0.0) c = vec3(0.55,0.36,0.22);
        gl_FragColor = vec4(c,1.); }` }));
  sky.renderOrder = -1; scene.add(sky);
  // mặt trời tròn to sát chân trời
  const sun = new THREE.Mesh(new THREE.CircleGeometry(38, 48), new THREE.MeshBasicMaterial({ color: '#ffe3a3', toneMapped: false, fog: false }));
  sun.position.copy(sunDir.clone().multiplyScalar(850)); sun.lookAt(0, 0, 0); scene.add(sun);
  scene.fog = new THREE.Fog('#e9a56a', 90, 520);
  // nền cỏ khô
  const gt = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#c99a52'; g.fillRect(0, 0, W, H); for (let i = 0; i < 9000; i++) { const x = r() * W, y = r() * H, l = 6 + r() * 14; g.strokeStyle = ['#b98a45', '#d8ad62', '#a87b3c', '#e0b870'][i % 4]; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 4, y - l); g.stroke(); } }, [80, 80]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshStandardMaterial({ map: gt, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.04; ground.receiveShadow = true; scene.add(ground);
  // sân: bê tông sơn đỏ đất, vạch trắng hơi mờ, viền xanh rêu
  const S = 64; // px/m
  const courtTex = ctex(Math.round((CT.L + 3) * S), Math.round((CT.W + 3) * S), (g, W, H) => {
    g.fillStyle = '#4f6b3c'; g.fillRect(0, 0, W, H); const ox = 1.5 * S, oy = 1.5 * S, L = CT.L * S, Wd = CT.W * S;
    g.fillStyle = '#b5552f'; g.fillRect(ox, oy, L, Wd);
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,220,180' : '80,30,10'},${0.04 + r() * 0.05})`; g.beginPath(); g.arc(ox + r() * L, oy + r() * Wd, 4 + r() * 22, 0, 7); g.fill(); }
    g.fillStyle = '#8f3f22'; for (const sx of [0, 1]) { const x0 = sx ? ox + L - 5.8 * S : ox; g.fillRect(x0, oy + Wd / 2 - 2.44 * S, 5.8 * S, 4.88 * S); } // sơn vùng cấm địa đậm
    g.strokeStyle = 'rgba(250,246,236,0.92)'; g.lineWidth = 0.06 * S; g.strokeRect(ox, oy, L, Wd);
    g.beginPath(); g.moveTo(ox + L / 2, oy); g.lineTo(ox + L / 2, oy + Wd); g.stroke(); g.beginPath(); g.arc(ox + L / 2, oy + Wd / 2, 1.83 * S, 0, 7); g.stroke();
    for (const sx of [1, -1]) { const bx = sx > 0 ? ox : ox + L, d = sx; const rimX = bx + d * 1.6 * S;
      g.strokeRect(sx > 0 ? bx : bx - 5.8 * S, oy + Wd / 2 - 2.44 * S, 5.8 * S, 4.88 * S);
      g.beginPath(); g.arc(bx + d * 5.8 * S, oy + Wd / 2, 1.83 * S, 0, 7); g.stroke();
      const c3 = 6.71 * S, R3 = 7.24 * S, ang = Math.asin(c3 / R3); const xc = Math.sqrt(R3 * R3 - c3 * c3);
      g.beginPath(); g.moveTo(bx, oy + Wd / 2 - c3); g.lineTo(rimX + d * xc, oy + Wd / 2 - c3); g.stroke(); g.beginPath(); g.moveTo(bx, oy + Wd / 2 + c3); g.lineTo(rimX + d * xc, oy + Wd / 2 + c3); g.stroke();
      g.beginPath(); if (d > 0) g.arc(rimX, oy + Wd / 2, R3, -ang, ang); else g.arc(rimX, oy + Wd / 2, R3, Math.PI - ang, Math.PI + ang); g.stroke(); }
    g.font = `900 ${1.4 * S}px Anton, sans-serif`; g.fillStyle = 'rgba(250,240,220,0.5)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SAVANNA', ox + L / 2, oy + Wd / 2 + 4.2 * S);
  });
  const court = new THREE.Mesh(new THREE.BoxGeometry(CT.L + 3, 0.06, CT.W + 3), [std('#6b4a2c'), std('#6b4a2c'), new THREE.MeshStandardMaterial({ map: courtTex, roughness: 0.85 }), std('#6b4a2c'), std('#6b4a2c'), std('#6b4a2c')]);
  court.position.y = -0.03; // mặt sân ở y = 0 court.receiveShadow = true; scene.add(court);
  const hoops = [1, -1].map((d) => { const h = hoop(d, { pad: '#2a2a2a' }); h.position.set(d * (CT.L / 2 - 1.22), 0, 0); scene.add(h); return h; });
  // cây keo dù (tán phẳng) — vài cây sát sân để hươu nhai lá (TREE0 ở góc sân)
  const trees = [];
  const acacia = (x, z, s = 1, sd = 1) => { const rr = rnd(sd * 131 + 7); const G = new THREE.Group(); const bark = std('#4a3424', { roughness: 0.95 }); const leaf = std('#5b6b2e', { roughness: 0.95 }); const leaf2 = std('#6e7d36', { roughness: 0.95 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 3.2, 8), bark); trunk.position.y = 1.6; trunk.rotation.z = (rr() - 0.5) * 0.25; G.add(trunk);
    const top = new THREE.Vector3(Math.sin(-trunk.rotation.z) * 1.6, 3.2, 0);
    for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + rr(); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 2.2, 6), bark); br.position.copy(top).add(new THREE.Vector3(Math.cos(a) * 0.7, 0.7, Math.sin(a) * 0.7)); br.lookAt(top.clone().add(new THREE.Vector3(Math.cos(a) * 2.4, 2.0, Math.sin(a) * 2.4))); br.rotateX(Math.PI / 2); G.add(br); }
    for (let i = 0; i < 9; i++) { const a = rr() * Math.PI * 2, d = rr() * 2.2; const c = new THREE.Mesh(new THREE.SphereGeometry(1.4 + rr() * 0.7, 10, 6), i % 3 ? leaf : leaf2); c.scale.y = 0.32; c.position.copy(top).add(new THREE.Vector3(Math.cos(a) * d, 1.35 + rr() * 0.35, Math.sin(a) * d)); G.add(c); }
    G.position.set(x, 0, z); G.scale.setScalar(s); G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(G); trees.push(G); return G; };
  acacia(-CT.L / 2 - 4.5, -CT.W / 2 - 3.5, 1.15, 1); acacia(CT.L / 2 + 6, -CT.W / 2 - 6, 1.0, 2); acacia(4, -CT.W / 2 - 9, 1.25, 3);
  for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, d = 32 + r() * 230; acacia(Math.cos(a) * d, Math.sin(a) * d, 0.8 + r() * 0.7, 10 + i); }
  // đồi xa tím
  const hm = std('#7a5470', { roughness: 1, fog: true });
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + r() * 0.2, d = 380 + r() * 90; const h = new THREE.Mesh(new THREE.ConeGeometry(40 + r() * 60, 18 + r() * 45, 7), hm); h.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); h.scale.z = 0.6; scene.add(h); }
  // bụi cỏ cao quanh sân (instanced)
  { const n = 2600; const geo = new THREE.ConeGeometry(0.12, 0.7, 4); const im = new THREE.InstancedMesh(geo, std('#c49a4a', { roughness: 1 }), n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    for (let i = 0; i < n; i++) { let x, z; do { x = (r() - 0.5) * 110; z = (r() - 0.5) * 80; } while (Math.abs(x) < CT.L / 2 + 2.5 && Math.abs(z) < CT.W / 2 + 2.5);
      const s = 0.45 + r() * 0.75; q.setFromEuler(new THREE.Euler((r() - 0.5) * 0.4, r() * 6, (r() - 0.5) * 0.4)); sc.set(s, s * (0.8 + r()), s); m4.compose(new THREE.Vector3(x, 0.3 * sc.y, z), q, sc); im.setMatrixAt(i, m4); }
    im.castShadow = true; im.receiveShadow = true; scene.add(im); }
  // ụ mối
  for (let i = 0; i < 6; i++) { const h = 2.2 + r() * 1.4; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.95, h, 9), std('#a0603a', { roughness: 1 })); const x = (r() - 0.5) * 70, z = (r() < 0.5 ? -1 : 1) * (CT.W / 2 + 8 + r() * 14); m.position.set(x, h / 2, z); m.castShadow = true; scene.add(m); const tp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), m.material); tp.position.set(x, h, z); scene.add(tp); }
  // bảng điểm gỗ bên sân (-z), mặt canvas
  const sbTex = ctex(1024, 512, (g, W, H) => { g.fillStyle = '#1b1410'; g.fillRect(0, 0, W, H); });
  const SBG = new THREE.Group(); const wood = std('#6b4528', { roughness: 0.9 });
  for (const x of [-2.1, 2.1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 0.22), wood); p.position.set(x, 2.3, 0); SBG.add(p); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.5, 0.2), wood); fr.position.set(0, 4.0, -0.05); SBG.add(fr);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.1), new THREE.MeshBasicMaterial({ map: sbTex, toneMapped: false })); scr.position.set(0, 4.0, 0.06); SBG.add(scr);
  SBG.position.set(0, 0, -CT.W / 2 - 3.4); SBG.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(SBG);
  // ghế băng gỗ ven sân (+z)
  const bench = new THREE.Group(); { const seat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 0.45), wood); seat.position.y = 0.48; bench.add(seat); for (const x of [-2.2, 0, 2.2]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.46, 0.4), wood); l.position.set(x, 0.23, 0); bench.add(l); } }
  bench.position.set(-4, 0, CT.W / 2 + 2.2); bench.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(bench);
  return { hoops, trees, sbTex, sunDir, sky, sun, SB: SBG, bench };
}
export function savannaLights(scene, sunDir) {
  const hemi = new THREE.HemisphereLight('#ffd9b0', '#7a5a34', 2.6); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffb978', 3.1); key.position.copy(sunDir.clone().multiplyScalar(60)).setY(26); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key);
  const rim = new THREE.DirectionalLight('#9fb4ff', 0.6); rim.position.set(30, 20, 40); scene.add(rim);
  return { hemi, key, rim };
}

// ======================= HƯƠU CAO CỔ =======================
let spotTex = null;
function giraffeSpots() { if (spotTex) return spotTex; const r = rnd(99);
  spotTex = ctex(512, 512, (g, W, H) => { g.fillStyle = '#f2dfb4'; g.fillRect(0, 0, W, H); // nền kem, mảng nâu đa giác (Voronoi thô)
    const P = []; for (let i = 0; i < 70; i++) P.push([r() * W, r() * H]); const im = g.getImageData(0, 0, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let d1 = 1e9, d2 = 1e9, k = 0; for (let i = 0; i < P.length; i++) { for (const [ox, oy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) { const dx = x - P[i][0] - ox, dy = y - P[i][1] - oy; const d = dx * dx + dy * dy; if (d < d1) { d2 = d1; d1 = d; k = i; } else if (d < d2) d2 = d; } }
      const edge = Math.sqrt(d2) - Math.sqrt(d1); const o = (y * W + x) * 4; if (edge > 7) { const c = [[176, 98, 44], [158, 84, 36], [190, 110, 52]][k % 3]; im.data[o] = c[0]; im.data[o + 1] = c[1]; im.data[o + 2] = c[2]; } }
    g.putImageData(im, 0, 0); }, [2, 2]); return spotTex; }
function numTex(num, col, txt) { return ctex(512, 256, (g, W, H) => { g.fillStyle = col; g.fillRect(0, 0, W, H); g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '900 54px Anton, sans-serif'; if (txt) g.fillText(txt, W / 2, 44); g.font = '900 150px Anton, sans-serif'; g.fillText(String(num), W / 2, 160); }); }

// o: {seed, s (tỉ lệ, 1 = cao ~5,2 m), jersey: {color, number, text}}
// update(t, c): c = {walk: quãng đường (m) để quay chân, neckTo: Vector3 THẾ GIỚI cho miệng/đầu, headPitch (rad, + cúi), chew 0..1, sleep 0..1, mouth 0..1, look:[x,y], earFlick, sway}
export function makeGiraffe(o = {}) {
  const r = rnd((o.seed ?? 1) * 977 + 3); const sp = giraffeSpots();
  const hide = new THREE.MeshStandardMaterial({ map: sp, roughness: 0.9 }); const dark = std('#3a2414', { roughness: 0.9 }); const muz = std('#e8d2a6', { roughness: 0.9 }); const hoof = std('#2a1c12');
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  // thân: nghiêng cao phía trước
  const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), hide); torso.scale.set(0.44, 0.52, 1.12); torso.position.set(0, 2.55, 0); torso.rotation.x = -0.22; body.add(torso);
  const withers = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 12), hide); withers.scale.set(0.95, 1.1, 1.1); withers.position.set(0, 2.95, 0.62); body.add(withers);
  // áo đấu (tuỳ chọn): tấm phủ hai bên thân có số
  if (o.jersey) { const jt = numTex(o.jersey.number ?? '', o.jersey.color, o.jersey.text); const jm = new THREE.MeshStandardMaterial({ map: jt, roughness: 0.8, side: THREE.DoubleSide });
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.75), jm); p.position.set(s * 0.475, 2.62, 0.05); p.rotation.y = s * Math.PI / 2; p.rotation.z = -s * 0.0; body.add(p); }
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.3, 20, 1, true), new THREE.MeshStandardMaterial({ color: o.jersey.color, roughness: 0.8, side: THREE.DoubleSide })); band.rotation.x = Math.PI / 2; band.scale.set(0.76, 1, 1.02); band.position.set(0, 2.6, 0.05); body.add(band); }
  // chân: 4 chân 2 đốt, khớp hông/gối điều khiển bằng góc
  const legs = []; const LG = [[0.24, 0.72, 2.45, 0], [-0.24, 0.72, 2.45, 0.5], [0.22, -0.78, 2.3, 0.5], [-0.22, -0.78, 2.3, 0]]; // [x, z, y hông, pha] (dáng "pace": trái trước+trái sau cùng pha)
  for (const [x, z, y, ph] of LG) { const hip = new THREE.Group(); hip.position.set(x, y, z); body.add(hip);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 1.15, 10), hide); up.position.y = -0.575; hip.add(up);
    const knee = new THREE.Group(); knee.position.y = -1.15; hip.add(knee); const kn = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), hide); knee.add(kn);
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 1.08, 10), muz); lo.position.y = -0.54; knee.add(lo);
    const hf = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.14, 10), hoof); hf.position.y = -1.1; knee.add(hf);
    legs.push({ hip, knee, ph, front: z > 0 }); }
  // đuôi
  const tail = new THREE.Group(); tail.position.set(0, 2.55, -1.02); body.add(tail); { const tl = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.9, 6), muz); tl.position.y = -0.45; tail.add(tl); const tf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), dark); tf.scale.y = 1.8; tf.position.y = -0.95; tail.add(tf); }
  // cổ: 8 đốt, gốc ở vai trước
  const N = 8, SEG = 0.27; const neckBase = new THREE.Group(); neckBase.position.set(0, 3.0, 0.82); body.add(neckBase);
  const segs = []; let parent = neckBase;
  for (let i = 0; i < N; i++) { const j = new THREE.Group(); if (i) j.position.y = SEG; parent.add(j); const rr0 = 0.21 - i * 0.012, rr1 = 0.2 - (i + 1) * 0.012;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rr1, rr0, SEG + 0.06, 14), hide); m.position.y = SEG / 2; j.add(m);
    const mane = new THREE.Mesh(new THREE.BoxGeometry(0.035, SEG + 0.02, 0.05), dark); mane.position.set(0, SEG / 2, -rr0 + 0.005); j.add(mane);
    segs.push(j); parent = j; }
  // đầu: dài theo +z, gắn ở đầu đốt cuối
  const headPivot = new THREE.Group(); headPivot.position.y = SEG; segs[N - 1].add(headPivot);
  const head = new THREE.Group(); headPivot.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), hide); skull.scale.set(0.17, 0.17, 0.3); skull.position.set(0, 0.06, 0.12); head.add(skull);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), std('#d6b07a', { roughness: 0.9 })); snout.scale.set(0.12, 0.125, 0.17); snout.position.set(0, 0.02, 0.33); head.add(snout);
  const jaw = new THREE.Group(); jaw.position.set(0, -0.04, 0.2); head.add(jaw); const jm = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), muz); jm.scale.set(0.1, 0.05, 0.2); jm.position.set(0, -0.02, 0.17); jaw.add(jm);
  for (const s of [-1, 1]) { const os = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8), hide); os.position.set(s * 0.07, 0.27, 0.02); os.rotation.z = -s * 0.15; head.add(os); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), dark); tip.position.set(s * 0.085, 0.38, 0.02); head.add(tip); }
  const ears = [-1, 1].map((s) => { const e = new THREE.Group(); e.position.set(s * 0.16, 0.16, -0.02); head.add(e); const em = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 8), muz); em.rotation.z = -s * Math.PI / 2; em.position.x = s * 0.09; em.scale.z = 0.5; e.add(em); return e; });
  // mắt hoạt hình to: tròng trắng + con ngươi + mi (đóng khi ngủ/chớp)
  const eyes = [-1, 1].map((s) => { const E = new THREE.Group(); E.position.set(s * 0.135, 0.14, 0.2); head.add(E);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); E.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2 })); p.position.set(s * 0.03, 0, 0.05); E.add(p);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), hide); lid.rotation.x = -1.4; E.add(lid); return { E, p, lid, s }; });
  // lá trong miệng khi nhai (bật bằng c.leaf)
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), std('#5b6b2e')); leaf.scale.set(1.3, 0.5, 1); leaf.position.set(0, -0.03, 0.42); leaf.visible = false; head.add(leaf);
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  const S = o.s ?? 1; root.scale.setScalar(S);
  // chuỗi cổ phẳng (mặt y–z cục bộ của thân): góc a_i quay +Y về +Z
  const REST = [0.3, 0.03, 0.03, 0.02, 0.02, 0.02, 0.01, 0.01];
  const fk = (A) => { let th = 0, y = 0, z = 0; const P = [[0, 0]]; for (let i = 0; i < N; i++) { th += A[i]; y += SEG * Math.cos(th); z += SEG * Math.sin(th); P.push([y, z]); } return { P, th }; };
  const HEADOFF = 0.38; // từ khớp đầu tới miệng (theo hướng đầu)
  function solveNeck(ty, tz, hp) { const A = REST.slice(); // CCD 2D tới điểm (ty,tz) cho miệng; đầu giữ góc thế giới hp
    for (let it = 0; it < 14; it++) for (let i = N - 1; i >= 0; i--) { const { P, th } = fk(A); const ey = P[N][0] - HEADOFF * Math.sin(hp), ez = P[N][1] + HEADOFF * Math.cos(hp);
      const [jy, jz] = P[i]; const a1 = Math.atan2(ez - jz, ey - jy), a2 = Math.atan2(tz - jz, ty - jy); let d = a2 - a1; d = Math.atan2(Math.sin(d), Math.cos(d));
      const lim = i === 0 ? [-0.7, 1.25] : [-0.12, 0.3]; A[i] = Math.min(lim[1], Math.max(lim[0], A[i] + d * 0.7)); }
    return A; }
  const V = new THREE.Vector3();
  function update(t, c = {}) {
    const sd = (o.seed ?? 1) * 1.7;
    // chân: chu kỳ theo quãng đường (sải ~1,9 m); đứng yên thì đổi chân nhẹ
    const ph = (c.walk ?? 0) / (1.9 * S); const mv = c.walking ? 1 : 0;
    for (const L of legs) { const p = (ph + L.ph) * Math.PI * 2; L.hip.rotation.x = mv * Math.sin(p) * 0.32 + (c.splay ?? 0) * (L.front ? -1 : 1);
      L.knee.rotation.x = mv * (L.front ? Math.max(0, -Math.cos(p)) * 0.6 : -Math.max(0, -Math.cos(p)) * 0.6); }
    body.position.y = mv * Math.abs(Math.sin(ph * Math.PI * 2)) * 0.05 + (c.bob ?? 0);
    tail.rotation.z = Math.sin(t * 2.3 + sd) * 0.35; tail.rotation.x = 0.25;
    // cổ
    const hp = c.headPitch ?? 0.15; let A;
    if (c.neckTo) { root.updateMatrixWorld(true); const loc = neckBase.worldToLocal(c.neckTo.clone()); const yaw = Math.max(-0.9, Math.min(0.9, Math.atan2(loc.x, Math.max(0.05, loc.z + 0.6)))); neckBase.rotation.set(0, 0, 0); neckBase.rotation.y = yaw;
      neckBase.updateMatrixWorld(true); const l2 = neckBase.worldToLocal(c.neckTo.clone()); A = solveNeck(l2.y, l2.z, hp); }
    else { neckBase.rotation.set(0, (c.neckYaw ?? 0) + Math.sin(t * 0.5 + sd) * 0.08 * (c.sway ?? 1), 0); A = REST.map((a, i) => a + (c.neckBend ?? 0) / N + Math.sin(t * 0.8 + sd + i * 0.3) * 0.012 * (c.sway ?? 1)); }
    let th = 0; for (let i = 0; i < N; i++) { segs[i].rotation.x = A[i]; th += A[i]; }
    headPivot.rotation.x = hp - th; // hướng đầu thế giới = cúi hp so với phương ngang
    // hàm: nhai / há
    const chew = c.chew ?? 0; jaw.rotation.x = (c.mouth ?? 0) * 0.5 + chew * (0.12 + 0.12 * Math.sin(t * 9 + sd)); jaw.rotation.y = chew * Math.sin(t * 4.5 + sd) * 0.08; leaf.visible = !!c.leaf;
    // mắt: chớp + ngủ + nhìn
    const bp = ((t + sd) % 3.4 + 3.4) % 3.4; const blink = bp < 0.12 ? Math.sin(bp / 0.12 * Math.PI) : 0; const close = Math.max(c.sleep ?? 0, blink);
    for (const e of eyes) { e.lid.rotation.x = -1.4 + close * 1.45; e.E.scale.y = 1 - 0.88 * close; e.p.visible = close < 0.7; const lk = c.look ?? [0, 0]; e.p.position.set(e.s * 0.03 + lk[0] * 0.025, lk[1] * 0.03, 0.05); }
    for (const [i, e] of ears.entries()) e.rotation.z = (i ? -1 : 1) * (0.25 + Math.max(0, Math.sin(t * 1.3 + sd * (i + 1)) - 0.92) * 6 * 0.4);
  }
  update(0, {});
  const mouthWorld = () => { root.updateMatrixWorld(true); return snout.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.06 * S, 0)); };
  const headWorld = () => { root.updateMatrixWorld(true); return skull.getWorldPosition(new THREE.Vector3()); };
  return { root, body, update, mouthWorld, headWorld, head, segs, neckBase, eyes };
}
