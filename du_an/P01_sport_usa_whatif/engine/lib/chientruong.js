// E10 (NBA, dạng "ngôi sao vs lịch sử"): CHIẾN TRƯỜNG AGINCOURT 25/10/1415 dựng bằng code — bối cảnh mới.
// Cánh đồng cày ướt bùn (luống + vũng nước), 2 khu rừng thu hai bên (Tramecourt / Agincourt), hàng cọc nhọn của cung thủ, cờ hiệu bay,
// mưa phùn, sương, quạ, trời u ám có tia nắng. Quân đội: cung thủ (lưới gộp, cử động trong shader), mưa tên (instanced, parabol),
// kỵ sĩ Pháp (ngựa phi bằng code). Đại sảnh lâu đài (kính màu, nến) cho bàn bình luận tu sĩ + cảnh phong tước.
// Quy ước: quân Anh đứng ở x < 0 nhìn +x; quân Pháp từ x > 0 phi về -x; Curry + rổ ở giữa (x≈0..12). Không cảnh chết chóc: tên rơi xuống bùn.
import * as THREE from 'three';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o));
const ctex = (w, h, draw, rep) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.userData.cv = cv; return t; };
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ======================= CHIẾN TRƯỜNG =======================
export function buildBattlefield(scene, o = {}) {
  const r = rnd(o.seed ?? 21);
  // trời u ám: xám xanh trên cao, vàng nhạt chân trời phía mặt trời yếu (tia nắng)
  const sunDir = V(0.55, 0.32, -0.77).normalize();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 40, 20), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { sd: { value: sunDir }, uDark: { value: 0 } },
    vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `varying vec3 vp; uniform vec3 sd; uniform float uDark;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      void main(){ float y = clamp(vp.y,-0.1,1.); vec3 top=vec3(0.36,0.40,0.47), hor=vec3(0.80,0.76,0.66);
        vec3 c = mix(hor, top, smoothstep(0.0,0.5,y));
        vec2 q = vp.xz/(0.25+y)*2.5; float cl = n(q)*0.6+n(q*2.3)*0.3+n(q*5.1)*0.1; c = mix(c, vec3(0.52,0.54,0.58), smoothstep(0.35,0.75,cl)*0.75*step(0.02,y));
        float s = max(0., dot(vp, sd)); c += vec3(1.0,0.86,0.6)*pow(s,14.)*0.45;
        c *= 1. - 0.55*uDark; gl_FragColor = vec4(c,1.); }` }));
  sky.renderOrder = -1; scene.add(sky);
  scene.fog = new THREE.Fog('#a9aaa3', 40, 360);
  // đất bùn: luống cày + vết bánh/xéo + chỗ ướt bóng
  const mt = ctex(1024, 1024, (g, W, H) => { g.fillStyle = '#4a3a28'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 16) { g.fillStyle = y % 32 ? '#3e3020' : '#57442d'; g.fillRect(0, y, W, 9); }
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '30,22,14' : '110,90,60'},${0.08 + r() * 0.12})`; g.beginPath(); g.ellipse(r() * W, r() * H, 3 + r() * 14, 2 + r() * 6, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 220; i++) { g.fillStyle = 'rgba(95,120,60,0.35)'; g.fillRect(r() * W, r() * H, 2, 4 + r() * 8); } }, [40, 40]);
  const rt = ctex(512, 512, (g, W, H) => { g.fillStyle = '#7a7a7a'; g.fillRect(0, 0, W, H); for (let i = 0; i < 700; i++) { const v = 60 + r() * 160; g.fillStyle = `rgb(${v},${v},${v})`; g.beginPath(); g.ellipse(r() * W, r() * H, 6 + r() * 30, 3 + r() * 10, 0, 0, 7); g.fill(); } }, [40, 40]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200, 1, 1), new THREE.MeshStandardMaterial({ map: mt, roughnessMap: rt, roughness: 0.75, metalness: 0.05 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  // vũng nước phản sáng
  const pm = new THREE.MeshStandardMaterial({ color: '#8d9094', roughness: 0.12, metalness: 0.25 });
  for (let i = 0; i < 70; i++) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.6 + r() * 2.4, 18), pm); p.rotation.x = -Math.PI / 2; p.scale.set(1, 0.35 + r() * 0.6, 1); p.position.set(-60 + r() * 120, 0.012, -22 + r() * 44); p.rotation.z = r() * 3; p.receiveShadow = true; scene.add(p); }
  // 2 khu rừng thu (z = ±(28..70)): thân + tán màu tháng 10
  const trunk = new THREE.CylinderGeometry(0.22, 0.38, 7, 6).translate(0, 3.5, 0), crown = new THREE.IcosahedronGeometry(3.2, 1).translate(0, 8.5, 0);
  const cols = ['#7a5a1e', '#9b4a1a', '#5f6a2a', '#b07a2a', '#6b3a18', '#4f5a26'];
  const TN = 420; const tI = new THREE.InstancedMesh(trunk, std('#3b2e22', { roughness: 0.95 }), TN); const cI = new THREE.InstancedMesh(crown, new THREE.MeshStandardMaterial({ roughness: 0.95, vertexColors: false }), TN);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < TN; i++) { const side = i % 2 ? 1 : -1; const x = -160 + r() * 320, z = side * (26 + r() * 50); const s = 0.8 + r() * 0.7;
    q.setFromEuler(new THREE.Euler(0, r() * 6, 0)); sc.set(s, s * (0.9 + r() * 0.4), s); m4.compose(V(x, 0, z), q, sc); tI.setMatrixAt(i, m4);
    sc.set(s * (0.9 + r() * 0.5), s * (0.8 + r() * 0.4), s * (0.9 + r() * 0.5)); m4.compose(V(x, 0, z), q, sc); cI.setMatrixAt(i, m4); cI.setColorAt(i, col.set(cols[Math.floor(r() * cols.length)])); }
  tI.castShadow = cI.castShadow = true; scene.add(tI, cI);
  // hàng cọc nhọn trước quân Anh (x ≈ -14), chéo về phía Pháp
  const stakeG = new THREE.CylinderGeometry(0.02, 0.07, 1.9, 6).translate(0, 0.95, 0); const sI = new THREE.InstancedMesh(stakeG, std('#6b5236'), 160);
  for (let i = 0; i < 160; i++) { const z = -24 + i * 0.3 + (r() - 0.5) * 0.15; const x = -14 + (i % 3) * 0.5 + (r() - 0.5) * 0.3; q.setFromEuler(new THREE.Euler(0, 0, -0.75 + (r() - 0.5) * 0.15)); m4.compose(V(x, 0, z), q, V(1, 1, 1)); sI.setMatrixAt(i, m4); }
  sI.castShadow = true; scene.add(sI);
  // cờ hiệu (vải sóng trong shader): Anh — chữ thập đỏ trên nền trắng; Pháp — xanh với hoa huệ vàng (biểu tượng lịch sử, không phải logo hiện đại)
  const flags = [];
  const flagTex = (kind) => ctex(256, 160, (g, W, H) => { if (kind === 'en') { g.fillStyle = '#f2efe6'; g.fillRect(0, 0, W, H); g.fillStyle = '#c2201f'; g.fillRect(W / 2 - 18, 0, 36, H); g.fillRect(0, H / 2 - 18, W, 36); }
    else { g.fillStyle = '#1f3c8a'; g.fillRect(0, 0, W, H); g.fillStyle = '#e5c040'; for (const [x, y] of [[64, 50], [192, 50], [128, 112]]) { g.beginPath(); g.moveTo(x, y - 26); g.quadraticCurveTo(x + 18, y - 4, x, y + 20); g.quadraticCurveTo(x - 18, y - 4, x, y - 26); g.fill(); g.fillRect(x - 20, y + 2, 40, 6); } } });
  const flagMat = (kind) => { const U = { uT: { value: 0 } }; const m = new THREE.MeshStandardMaterial({ map: flagTex(kind), side: THREE.DoubleSide, roughness: 0.9 });
    m.onBeforeCompile = (sh) => { sh.uniforms.uT = U.uT; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat k = uv.x; transformed.z += sin(uv.x*6.0 - uT*5.0 + position.y*0.8) * 0.28 * k; transformed.y += sin(uv.x*4.0 - uT*3.0) * 0.08 * k;'); };
    m.customProgramCacheKey = () => 'flag'; m.userData.U = U; return m; };
  const FM = { en: flagMat('en'), fr: flagMat('fr') };
  for (const [kind, x0, n] of [['en', -16, 7], ['fr', 46, 9]]) for (let i = 0; i < n; i++) { const G = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 6.5, 6), std('#5b4632')); pole.position.y = 3.25; G.add(pole);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5, 24, 8).translate(1.2, 0, 0), FM[kind]); f.position.y = 5.6; G.add(f); G.position.set(x0 + (r() - 0.5) * 3, 0, -20 + i * (40 / n) + r() * 2); G.rotation.y = kind === 'en' ? 0 : Math.PI; scene.add(G); flags.push(G); }
  // mưa phùn (vạch mảnh) quanh máy quay
  const RN = 5000, rp = new Float32Array(RN * 6); for (let i = 0; i < RN; i++) { const x = (r() - 0.5) * 60, y = r() * 30, z = (r() - 0.5) * 60; rp.set([x, y, z, x + 0.05, y - 0.6, z], i * 6); }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3)); const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: '#c9d2dc', transparent: true, opacity: 0.35 })); rain.frustumCulled = false; scene.add(rain);
  const rainTick = (t, cx, cz, amt = 1) => { rain.position.set(cx, -((t * 14) % 30), cz); rain.material.opacity = 0.35 * amt; rain.visible = amt > 0.01; };
  // quạ bay vòng
  const crowG = new THREE.Group(); const crowM = std('#121212'); const crows = [];
  for (let i = 0; i < 9; i++) { const c = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), crowM); b.scale.set(1, 0.6, 2); c.add(b);
    const wl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.25).translate(0.45, 0, 0), new THREE.MeshStandardMaterial({ color: '#121212', side: THREE.DoubleSide })); const wr = wl.clone(); wr.rotation.y = Math.PI; c.add(wl, wr); c.userData = { wl, wr, ph: r() * 6, R: 18 + r() * 14, h: 16 + r() * 8 }; crowG.add(c); crows.push(c); }
  scene.add(crowG);
  const update = (t, o2 = {}) => { FM.en.userData.U.uT.value = t; FM.fr.userData.U.uT.value = t; sky.material.uniforms.uDark.value = o2.dark ?? 0;
    for (const c of crows) { const u = c.userData; const a = t * 0.35 + u.ph; c.position.set(Math.cos(a) * u.R, u.h + Math.sin(t + u.ph) * 0.6, Math.sin(a) * u.R - 4); c.rotation.y = -a; const f = Math.sin(t * 9 + u.ph) * 0.7; u.wl.rotation.z = f; u.wr.rotation.z = -f; } };
  return { sky, ground, flags, rainTick, update, sunDir };
}
export function battleLights(scene, sunDir) {
  const hemi = new THREE.HemisphereLight('#c9d0d8', '#4a3a28', 2.3); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffe7c2', 2.2); key.position.copy(sunDir.clone().multiplyScalar(60)); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 160 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key);
  return { hemi, key };
}

// ======================= QUÂN CUNG THỦ (1 lưới gộp, cử động trong shader) =======================
// đặt N cung thủ theo các khối; uniform: uT, uDraw (0 hạ cung .. 1 giương + kéo dây), uAim (góc ngẩng, rad), uFire (0..1 buông → cánh tay bật ra)
export function archerArmy(scene, o = {}) {
  const r = rnd(o.seed ?? 5); const N = o.n ?? 1400;
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const parts = { body: box(0.42, 0.62, 0.26, 0, 1.12, 0), legs: box(0.36, 0.78, 0.22, 0, 0.42, 0), head: new THREE.IcosahedronGeometry(0.13, 1).translate(0, 1.6, 0).toNonIndexed(),
    hat: new THREE.CylinderGeometry(0.2, 0.24, 0.07, 10).translate(0, 1.72, 0).toNonIndexed(), cap: new THREE.SphereGeometry(0.14, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, 1.72, 0).toNonIndexed(),
    armL: box(0.09, 0.55, 0.09, 0, -0.27, 0), armR: box(0.09, 0.5, 0.09, 0, -0.25, 0), bow: new THREE.TorusGeometry(0.85, 0.018, 4, 18, Math.PI * 0.9).rotateZ(Math.PI * 0.55).rotateY(Math.PI / 2).toNonIndexed() };
  const tunics = ['#6b5a3a', '#7a2d22', '#4f5a3a', '#8a7a5a', '#5a4a3a', '#6a6a5a', '#7a6040']; const skins = ['#e8c4a0', '#d9a57a', '#f0cbaa', '#c99266'];
  const P = [], C = [], CP = [], PV = []; const v = V(0, 0, 0), cc = new THREE.Color();
  const add = (geo, m, color, cp, piv) => { cc.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count; for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(cc.r, cc.g, cc.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); } };
  const blocks = o.blocks ?? [[-20, -24, 6, 48], [-20, -24, 6, 48]];
  const pos = []; for (let i = 0; i < N; i++) { const b = blocks[i % blocks.length]; pos.push([b[0] - r() * b[2], b[1] + r() * b[3]]); }
  const facing = V(1, 0, 0);
  for (const [x, z] of pos) { const ph = r() * 40, s = 0.92 + r() * 0.16; const m = new THREE.Matrix4().compose(V(x, 0, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2 + (r() - 0.5) * 0.15, 0)), V(s, s, s));
    const tun = tunics[Math.floor(r() * tunics.length)], sk = skins[Math.floor(r() * skins.length)]; const zero = V(0, 0, 0);
    add(parts.legs, m, '#3b3328', [0, ph, 0, 0], zero); add(parts.body, m, tun, [1, ph, 0, 0], zero); add(parts.head, m, sk, [1, ph, 0, 0], zero); add(r() < 0.6 ? parts.hat : parts.cap, m, '#8a8f96', [1, ph, 0, 0], zero);
    const shL = V(0.12, 1.36, 0.06).applyMatrix4(m), shR = V(-0.12, 1.36, 0.06).applyMatrix4(m);
    const mL = new THREE.Matrix4().makeTranslation(0.12, 1.36, 0.06).premultiply(m), mR = new THREE.Matrix4().makeTranslation(-0.12, 1.36, 0.06).premultiply(m);
    add(parts.armL, mL, tun, [2, ph, 0, 0], shL); add(parts.armR, mR, tun, [3, ph, 0, 0], shR);
    const mB = new THREE.Matrix4().makeTranslation(0.12, 1.36 - 0.55, 0.06).premultiply(m); add(parts.bow, mB, '#5a3a1e', [4, ph, 0, 0], shL); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); geo.setAttribute('cp', new THREE.Float32BufferAttribute(CP, 4)); geo.setAttribute('piv', new THREE.Float32BufferAttribute(PV, 3)); geo.computeVertexNormals();
  const U = { uT: { value: 0 }, uDraw: { value: 0 }, uAim: { value: 0.7 }, uFire: { value: 0 } };
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
      attribute vec4 cp; attribute vec3 piv; uniform float uT, uDraw, uAim, uFire;
      vec3 rotZ(vec3 p, vec3 c, float a){ vec3 d=p-c; return c+vec3(d.x*cos(a)-d.y*sin(a), d.x*sin(a)+d.y*cos(a), d.z); }`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      float jitter = 0.25*sin(cp.y)*0.5; float dr = clamp(uDraw + jitter*uDraw*0.3, 0., 1.);
      // quân Anh nhìn +x: giơ tay trái + cung lên theo góc aim; tay phải kéo dây về sau (quay quanh trục z thế giới)
      if (cp.x > 1.9 && cp.x < 2.5 || cp.x > 3.9) { float a = dr * (1.57 + uAim); transformed = rotZ(transformed, piv, a); }
      if (cp.x > 2.9 && cp.x < 3.5) { float a = dr * (1.2 + uAim) - uFire * 0.8; transformed = rotZ(transformed, piv, a); }
      if (cp.x > 0.5) transformed.y += 0.015 * sin(uT * 1.7 + cp.y);`); };
  mat.customProgramCacheKey = () => 'archers';
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh);
  return { mesh, U, pos };
}

// ======================= MƯA TÊN (instanced, parabol; rơi cắm xuống bùn) =======================
// volley(t0): mỗi mũi tên bay từ vị trí cung thủ (src) tới vùng đích quanh target trong T giây; sau khi rơi thì cắm nghiêng trong bùn
export function arrowStorm(scene, src, o = {}) {
  const r = rnd(o.seed ?? 9); const N = o.n ?? 900;
  const g = new THREE.CylinderGeometry(0.012, 0.012, 0.85, 4).rotateZ(Math.PI / 2); const fl = new THREE.ConeGeometry(0.03, 0.12, 4).rotateZ(-Math.PI / 2).translate(0.48, 0, 0);
  const merged = new THREE.BufferGeometry(); { const a = g.toNonIndexed(), b = fl.toNonIndexed(); const p = new Float32Array(a.attributes.position.count * 3 + b.attributes.position.count * 3); p.set(a.attributes.position.array, 0); p.set(b.attributes.position.array, a.attributes.position.array.length); merged.setAttribute('position', new THREE.BufferAttribute(p, 3)); merged.computeVertexNormals(); }
  const im = new THREE.InstancedMesh(merged, std('#3a2a1a'), N); im.frustumCulled = false; im.castShadow = true; scene.add(im);
  const data = []; for (let i = 0; i < N; i++) { const s = src[Math.floor(r() * src.length)]; data.push({ sx: s[0], sz: s[1], dx: r(), dz: r(), dl: r() * 0.6, ap: 0.8 + r() * 0.4 }); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), dir = V(0, 0, 0), X = V(1, 0, 0);
  // volleys: [{t0, T, target:[x,z], spread:[sx,sz], apex}]
  // volleys: [{t0, T, target:[x,z], spread:[sx,sz], apex}] — mỗi loạt dùng 1 nhóm mũi tên riêng; bay xong cắm nghiêng trong bùn (tích dần qua các loạt)
  function update(t, volleys) { let k = 0; const per = Math.floor(N / Math.max(1, volleys.length));
    volleys.forEach((v, vi) => { if (t < v.t0) return;
      for (let i = vi * per; i < (vi + 1) * per; i++) { const d = data[i]; const u = (t - v.t0 - d.dl) / v.T; if (u < 0) continue;
        const tx = v.target[0] + (d.dx - 0.5) * v.spread[0], tz = v.target[1] + (d.dz - 0.5) * v.spread[1]; const H = (v.apex ?? 45) * d.ap; const uc = Math.min(1, u);
        const x = d.sx + (tx - d.sx) * uc, z = d.sz + (tz - d.sz) * uc, y = 1.5 + 4 * H * uc * (1 - uc) - 1.4 * uc;
        if (u < 1) dir.set(tx - d.sx, 4 * H * (1 - 2 * uc) - 1.4, tz - d.sz).normalize(); else dir.set((tx - d.sx) * 0.02, -1, (tz - d.sz) * 0.02).normalize();
        q.setFromUnitVectors(X, dir); m4.compose(V(x, u >= 1 ? 0.3 : y, z), q, V(1, 1, 1)); im.setMatrixAt(k++, m4); } });
    im.count = k; im.instanceMatrix.needsUpdate = true; }
  return { im, update };
}

// ======================= KỴ SĨ PHÁP (ngựa phi bằng code) =======================
export function makeKnight(o = {}) {
  const r = rnd((o.seed ?? 1) * 31 + 7); const root = new THREE.Group();
  const horseC = ['#3a2a1e', '#e8e2d6', '#6b4a2e', '#2a2a2a'][Math.floor(r() * 4)]; const hm = std(horseC, { roughness: 0.7 }); const cloth = std(o.caparison || (r() < 0.5 ? '#1f3c8a' : '#8a1f2a'), { roughness: 0.9 });
  const steel = std('#c9ced4', { metalness: 0.85, roughness: 0.28 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.25, 6, 12), hm); body.rotation.z = Math.PI / 2; body.position.y = 1.45; root.add(body);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 1.5, 14, 1, true), cloth); cap.rotation.z = Math.PI / 2; cap.position.y = 1.32; cap.scale.set(1, 1, 1.05); root.add(cap);
  const neck = new THREE.Group(); neck.position.set(0.85, 1.75, 0); root.add(neck); const nm = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.6, 4, 8), hm); nm.rotation.z = -0.7; nm.position.set(0.22, 0.25, 0); neck.add(nm);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 0.24), hm); head.position.set(0.62, 0.52, 0); head.rotation.z = -0.5; neck.add(head);
  const chanfron = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.26), steel); chanfron.position.set(0.62, 0.66, 0); chanfron.rotation.z = -0.5; neck.add(chanfron);
  const legs = []; for (const [x, z, ph] of [[0.62, 0.2, 0], [0.62, -0.2, 0.5], [-0.62, 0.2, 0.25], [-0.62, -0.2, 0.75]]) { const hip = new THREE.Group(); hip.position.set(x, 1.15, z); root.add(hip);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.6, 6), hm); up.position.y = -0.3; hip.add(up); const kn = new THREE.Group(); kn.position.y = -0.6; hip.add(kn);
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 6), hm); lo.position.y = -0.27; kn.add(lo); const hf = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.08, 8), std('#1a1410')); hf.position.y = -0.56; kn.add(hf); legs.push({ hip, kn, ph }); }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 6), hm); tail.position.set(-1.05, 1.4, 0); tail.rotation.z = -2.4; root.add(tail);
  // kỵ sĩ giáp bạc + lông mũ + thương
  const rider = new THREE.Group(); rider.position.set(-0.05, 1.85, 0); root.add(rider);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.5, 4, 10), steel); torso.position.y = 0.45; rider.add(torso);
  const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.34, 12), steel); helm.position.y = 1.0; rider.add(helm);
  const visor = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 4), steel); visor.rotation.z = -Math.PI / 2; visor.position.set(0.18, 0.98, 0); rider.add(visor);
  const plume = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), std(o.plume || '#e5c040')); plume.scale.set(1.4, 0.7, 0.6); plume.position.set(-0.12, 1.22, 0); rider.add(plume);
  for (const s of [-1, 1]) { const lg = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.45, 4, 6), steel); lg.position.set(0.05, -0.05, s * 0.36); lg.rotation.x = s * 0.5; rider.add(lg); }
  const lance = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 3.6, 6), std('#d8c9a0')); lance.rotation.z = -Math.PI / 2 + 0.12; lance.position.set(1.3, 0.55, 0.32); rider.add(lance);
  const shield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.45), cloth); shield.position.set(0.05, 0.45, -0.32); rider.add(shield);
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  // mud splash particles
  const sp = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 5, 4), std('#3e3020'), 24); root.add(sp);
  function update(t, c = {}) { const ph = (c.dist ?? t * 6) / 3.2; const run = c.run ?? 1;
    for (const L of legs) { const p = (ph + L.ph) * Math.PI * 2; L.hip.rotation.z = run * Math.sin(p) * 0.55; L.kn.rotation.z = run * Math.max(0, Math.sin(p + 1.2)) * 0.9; }
    root.children[0].position.y = 1.45 + run * Math.abs(Math.sin(ph * Math.PI * 2)) * 0.08; neck.rotation.z = run * Math.sin(ph * Math.PI * 2) * 0.12; rider.position.y = 1.85 + run * Math.abs(Math.sin(ph * Math.PI * 2)) * 0.1;
    const m4 = new THREE.Matrix4(); for (let i = 0; i < 24; i++) { const k = ((ph * 2 + i / 24) % 1); const a = i * 2.4; m4.makeTranslation(-0.6 - k * 1.2, run * (k * 1.6 - k * k * 1.8), Math.sin(a) * 0.5); sp.setMatrixAt(i, m4); } sp.instanceMatrix.needsUpdate = true; sp.visible = run > 0.3; }
  update(0, {}); return { root, update };
}

// ======================= ĐẠI SẢNH LÂU ĐÀI =======================
export function castleHall(at = V(0, 0, 500), o = {}) {
  const r = rnd(3); const G = new THREE.Group(); G.position.copy(at);
  const stoneT = ctex(512, 512, (g, W, H) => { g.fillStyle = '#6e6a62'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 48) for (let x = (y / 48) % 2 ? -40 : 0; x < W; x += 96) { const v = 90 + r() * 40; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect(x + 3, y + 3, 90, 42); } }, [6, 3]);
  const floorT = ctex(512, 512, (g, W, H) => { for (let y = 0; y < H; y += 64) for (let x = 0; x < W; x += 64) { const v = 70 + r() * 30; g.fillStyle = `rgb(${v},${v - 6},${v - 12})`; g.fillRect(x + 2, y + 2, 60, 60); } }, [10, 10]);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshStandardMaterial({ map: floorT, roughness: 0.6 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.add(floor);
  const wm = new THREE.MeshStandardMaterial({ map: stoneT, roughness: 0.95 });
  for (const [w, x, z, ry] of [[24, 0, -8, 0], [16, -9, 0, Math.PI / 2], [16, 9, 0, -Math.PI / 2]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 12), wm); m.position.set(x, 6, z); m.rotation.y = ry; m.receiveShadow = true; G.add(m); }
  // kính màu (phát sáng) trên tường sau
  const glassT = ctex(256, 512, (g, W, H) => { const cols = ['#b8202a', '#2a50b8', '#e0b030', '#2a8a4a', '#7a2ab8']; for (let i = 0; i < 160; i++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(Math.floor(r() * 8) * 32, Math.floor(r() * 16) * 32, 32, 32); }
    g.strokeStyle = '#111'; g.lineWidth = 4; for (let x = 0; x <= W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } });
  for (const x of [-6, 0, 6]) { const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.4), new THREE.MeshBasicMaterial({ map: glassT, toneMapped: false })); win.position.set(x, 6.2, -7.95); G.add(win);
    const arch = new THREE.Mesh(new THREE.CircleGeometry(1.1, 20, 0, Math.PI), new THREE.MeshBasicMaterial({ map: glassT, toneMapped: false })); arch.position.set(x, 8.4, -7.95); G.add(arch); }
  // cờ treo đỏ trắng
  for (const x of [-3, 3]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.6), new THREE.MeshStandardMaterial({ map: ctex(128, 320, (g, W, H) => { g.fillStyle = '#8a1f2a'; g.fillRect(0, 0, W, H); g.fillStyle = '#e5c040'; g.fillRect(W / 2 - 8, 20, 16, H - 60); g.fillRect(16, 90, W - 32, 16); }), side: THREE.DoubleSide })); b.position.set(x, 5.2, -7.9); G.add(b); }
  // nến + ánh lửa
  const candles = []; const flameM = new THREE.MeshBasicMaterial({ color: '#ffcf70', toneMapped: false });
  for (let i = 0; i < 14; i++) { const x = -8 + (i % 7) * 2.6, z = i < 7 ? -7.4 : 6; const c = new THREE.Group(); const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), std('#efe6d0')); stick.position.y = 0.2; c.add(stick);
    const fl = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), flameM); fl.position.y = 0.46; c.add(fl); const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 1.4, 6), std('#2a2420', { metalness: 0.6 })); stand.position.y = -0.7; c.add(stand);
    c.position.set(x, 1.4, z); G.add(c); candles.push(fl); }
  const warm = []; for (const [x, z] of [[-5, -5], [5, -5], [0, 3]]) { const p = new THREE.PointLight('#ffb060', 9, 16, 1.6); p.position.set(x, 3, z); G.add(p); warm.push(p); }
  const fill = new THREE.HemisphereLight('#c8b8a0', '#3a2a20', 0.9); G.add(fill);
  // bàn bình luận gỗ dài + 2 ghế
  const desk = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.95, 1.0), std('#5a3a1e', { roughness: 0.6 })); desk.position.set(0, 0.47, -3.2); desk.castShadow = desk.receiveShadow = true; G.add(desk);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.6), new THREE.MeshStandardMaterial({ map: ctex(512, 80, (g, W, H) => { g.fillStyle = '#2a1a10'; g.fillRect(0, 0, W, H); g.fillStyle = '#e5c040'; g.font = '900 48px Anton, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.desk || 'MONK SPORTS DESK', W / 2, H / 2 + 3); }) }));
  front.position.set(0, 0.5, -2.69); G.add(front);
  // ngai vàng (cảnh phong tước)
  const throne = new THREE.Group(); const tm = std('#7a1a20', { roughness: 0.7 }), gold = std('#c9a03a', { metalness: 0.8, roughness: 0.3 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.9), tm); seat.position.y = 0.5; throne.add(seat); const back = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 0.15), tm); back.position.set(0, 1.4, -0.4); throne.add(back);
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 8), gold); top.position.set(0, 2.5, -0.4); throne.add(top); throne.position.set(0, 0, -6.4); G.add(throne);
  G.traverse((m) => { if (m.isMesh) m.receiveShadow = true; });
  const update = (t) => { candles.forEach((f, i) => { f.scale.set(1, 0.85 + 0.3 * Math.abs(Math.sin(t * 9 + i * 1.7)), 1); }); warm.forEach((p, i) => p.intensity = 8 + 1.6 * Math.sin(t * 11 + i * 2.1) + Math.sin(t * 23 + i) * 0.6); };
  return { group: G, update, desk, throne };
}
