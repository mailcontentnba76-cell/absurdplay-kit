// Tập 24 — KHÁN ĐÀI KIỂU MỚI (không dùng bleachers cũ): BÁT LIỀN KHỐI hình chữ nhật bo góc, bậc bê tông dốc có TUYẾT đọng mép bậc,
// ghế nhựa rời (instanced) — tầng cao còn nhiều ghế trống phủ tuyết; khán giả ĐỨNG mặc áo phao/khăn quàng, mũ len quả bông / mũ lông / mũ sừng bison,
// một nhóm "siêu fan" cởi trần sơn mình đỏ-xanh; khăn cổ động vẫy (instanced), cờ lớn. Chuyển động cập nhật theo khung: nhún, giơ tay, vẫy khăn.
import * as THREE from 'three';
const rr = (hx, hz, rad) => { const p = new THREE.Path(); p.moveTo(-hx + rad, -hz); p.lineTo(hx - rad, -hz); p.quadraticCurveTo(hx, -hz, hx, -hz + rad); p.lineTo(hx, hz - rad); p.quadraticCurveTo(hx, hz, hx - rad, hz); p.lineTo(-hx + rad, hz); p.quadraticCurveTo(-hx, hz, -hx, hz - rad); p.lineTo(-hx, -hz + rad); p.quadraticCurveTo(-hx, -hz, -hx + rad, -hz); return p; };
export function buildBowl(G, o) {
  const { cx = 0, hx0, hz0, rows = 24, step = 0.85, rise = 0.5, y0 = 1.6 } = o;
  let rs = 77; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const concM = new THREE.MeshStandardMaterial({ color: '#8e949c', roughness: 0.95 }), snowM = new THREE.MeshStandardMaterial({ color: '#f2f5f8', roughness: 0.9 });
  // bậc bê tông: mỗi hàng 1 dải bo góc (ExtrudeGeometry của hình vành)
  const tiers = [], snows = [];
  for (let r = 0; r < rows; r++) { const hx = hx0 + r * step, hz = hz0 + r * step, rad = 9 + r * step;
    const sh = new THREE.Shape(rr(hx + step, hz + step, rad + step).getPoints(10)); sh.holes.push(new THREE.Path(rr(hx, hz, rad).getPoints(10).reverse()));
    const g = new THREE.ExtrudeGeometry(sh, { depth: y0 + r * rise, bevelEnabled: false, curveSegments: 6 }); g.rotateX(-Math.PI / 2); tiers.push(g);
    const sn = new THREE.Shape(rr(hx + 0.25, hz + 0.25, rad + 0.25).getPoints(10)); sn.holes.push(new THREE.Path(rr(hx, hz, rad).getPoints(10).reverse()));
    const s2 = new THREE.ExtrudeGeometry(sn, { depth: 0.06, bevelEnabled: false }); s2.rotateX(-Math.PI / 2); s2.translate(0, y0 + r * rise, 0); snows.push(s2); }
  const merge = (arr, m) => { arr.forEach((g, i) => { const mm = new THREE.Mesh(g, m); mm.position.x = cx; mm.receiveShadow = true; G.add(mm); }); };
  merge(tiers, concM); merge(snows, snowM);
  // tường ngoài (mặt tiền) + dải kính
  const oh = hx0 + rows * step + 1, oz = hz0 + rows * step + 1; const fs = new THREE.Shape(rr(oh + 1.2, oz + 1.2, 10 + rows * step + 1.2).getPoints(12)); fs.holes.push(new THREE.Path(rr(oh, oz, 10 + rows * step).getPoints(12).reverse()));
  const fac = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: y0 + rows * rise + 3, bevelEnabled: false }).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#b9bfc6', roughness: 0.7 })); fac.position.x = cx; G.add(fac);
  const gs = new THREE.Shape(rr(oh + 1.3, oz + 1.3, 10 + rows * step + 1.3).getPoints(12)); gs.holes.push(new THREE.Path(rr(oh + 1.1, oz + 1.1, 10 + rows * step + 1.1).getPoints(12).reverse()));
  const glass = new THREE.Mesh(new THREE.ExtrudeGeometry(gs, { depth: 2.2, bevelEnabled: false }).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#4a6a8a', roughness: 0.15, metalness: 0.4 }));
  glass.position.set(cx, y0 + rows * rise - 4, 0); glass.scale.set(1, 1, 1); G.add(glass);
  // ghế + khán giả: đi dọc chu vi từng hàng
  const seats = [], fans = [];
  for (let r = 0; r < rows; r++) { const hx = hx0 + r * step + step * 0.55, hz = hz0 + r * step + step * 0.55, rad = 9 + r * step + step * 0.55; const path = new THREE.CurvePath(); const pts = rr(hx, hz, rad).getSpacedPoints(Math.floor((4 * (hx + hz)) / 0.8));
    const y = y0 + r * rise; const fillK = r < 15 ? 0.82 : 0.82 - (r - 14) * 0.07;
    for (let i = 0; i < pts.length - 1; i++) { const p = pts[i], q = pts[i + 1]; const ang = Math.atan2(q.y - p.y, q.x - p.x); // hướng mặt vào trong: pháp tuyến
      const ry = -ang + Math.PI; const rec = { x: cx + p.x, z: p.y, y, ry, r };
      if (R() < fillK) fans.push({ ...rec, k: Math.floor(R() * 1000), ph: R() * 6.28 }); else seats.push({ ...rec, snow: r > 14 && R() < 0.7 }); } }
  const D = new THREE.Object3D(), col = new THREE.Color();
  // ghế trống
  const seatM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.48, 0.42, 0.42).translate(0, 0.21, 0), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 }), seats.length);
  seats.forEach((s, i) => { D.position.set(s.x, s.y, s.z); D.rotation.set(0, s.ry, 0); D.scale.setScalar(1); D.updateMatrix(); seatM.setMatrixAt(i, D.matrix); seatM.setColorAt(i, col.set(s.snow ? '#f4f6f9' : '#1d47b0')); });
  G.add(seatM);
  // khán giả đứng: chân, áo phao, đầu, mũ (3 loại), 2 tay (dưới / giơ), khăn vẫy
  const COAT = ['#00338d', '#c60c30', '#f2f0ea', '#1a2238', '#2a6ad8', '#c60c30', '#00338d', '#3a3f48', '#e8e0d0', '#6a1a2a'];
  const SKIN = ['#f1c9a5', '#c68c5f', '#9a6040', '#8a5634', '#e8b98f', '#d8a37a'];
  const geo = { leg: new THREE.BoxGeometry(0.34, 0.8, 0.24).translate(0, 0.4, 0), coat: new THREE.CapsuleGeometry(0.25, 0.42, 2, 6).scale(1, 1, 0.78).translate(0, 1.15, 0),
    head: new THREE.SphereGeometry(0.13, 6, 4).translate(0, 1.66, 0), beanie: new THREE.SphereGeometry(0.14, 6, 3, 0, 6.29, 0, 1.5).translate(0, 1.7, 0), pom: new THREE.SphereGeometry(0.05, 4, 2).translate(0, 1.85, 0),
    horn: new THREE.TorusGeometry(0.12, 0.03, 3, 6, Math.PI).translate(0, 1.76, 0), trapper: new THREE.CylinderGeometry(0.16, 0.17, 0.16, 6).translate(0, 1.72, 0),
    arm: new THREE.CapsuleGeometry(0.075, 0.42, 1, 4).translate(0, -0.26, 0), towel: new THREE.PlaneGeometry(0.42, 0.62, 1, 1).translate(0, 0.36, 0) };
  const mat = (o = {}) => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, ...o });
  const N = fans.length; const IM = {}; const mk = (k, g, m) => { IM[k] = new THREE.InstancedMesh(g, m, N); IM[k].frustumCulled = false; IM[k].castShadow = false; IM[k].receiveShadow = false; G.add(IM[k]); };
  mk('leg', geo.leg, mat({ color: '#2a2e36' })); mk('coat', geo.coat, mat()); mk('head', geo.head, mat({ roughness: 0.6 })); mk('beanie', geo.beanie, mat({ roughness: 1 })); mk('pom', geo.pom, mat({ color: '#f4f4f4', roughness: 1 }));
  mk('horn', geo.horn, mat({ color: '#3a2a1e', roughness: 0.6 })); mk('trap', geo.trapper, mat({ color: '#5a4030', roughness: 1 })); mk('armL', geo.arm, mat()); mk('armR', geo.arm, mat()); mk('towel', geo.towel, mat({ side: THREE.DoubleSide, roughness: 0.9 }));
  fans.forEach((f, i) => { const shirtless = f.k % 41 === 0; f.coat = shirtless ? SKIN[f.k % 6] : COAT[f.k % COAT.length]; f.paint = shirtless ? (f.k % 2 ? '#c60c30' : '#00338d') : null;
    f.hat = f.k % 7 === 0 ? 'horn' : f.k % 5 === 0 ? 'trap' : f.k % 9 === 0 ? 'none' : 'beanie'; f.towel = f.k % 4 === 0; f.sc = 0.92 + (f.k % 13) * 0.012;
    IM.coat.setColorAt(i, col.set(f.paint || f.coat)); IM.head.setColorAt(i, col.set(SKIN[(f.k >> 3) % 6])); IM.beanie.setColorAt(i, col.set(['#c60c30', '#00338d', '#f2f0ea', '#2a2a2a'][(f.k >> 2) % 4]));
    IM.armL.setColorAt(i, col.set(shirtless ? SKIN[f.k % 6] : f.coat)); IM.armR.setColorAt(i, col.set(shirtless ? SKIN[f.k % 6] : f.coat)); IM.towel.setColorAt(i, col.set(f.k % 8 === 0 ? '#c60c30' : '#f4f4f4')); });
  // chuyển động trong VERTEX SHADER (nhanh): ma trận đặt 1 lần; uT/uCheer là uniform chung
  const UN = { uT: { value: 0 }, uCheer: { value: 0.3 } };
  const aPh = new Float32Array(N), aSp = new Float32Array(N), aArm = new Float32Array(N);
  fans.forEach((f, i) => { aPh[i] = f.ph; aSp[i] = 2.2 + (f.k % 5) * 0.25; aArm[i] = (f.k % 6 === 0) ? 1 : (f.k % 3 !== 0 ? 0.5 : 0); });
  const hook = (im, mode, side = 0) => { im.geometry = im.geometry.clone(); im.geometry.setAttribute('aPh', new THREE.InstancedBufferAttribute(aPh, 1)); im.geometry.setAttribute('aSp', new THREE.InstancedBufferAttribute(aSp, 1)); im.geometry.setAttribute('aArm', new THREE.InstancedBufferAttribute(aArm, 1));
    im.material.onBeforeCompile = (sh) => { sh.uniforms.uT = UN.uT; sh.uniforms.uCheer = UN.uCheer;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aPh; attribute float aSp; attribute float aArm; uniform float uT; uniform float uCheer;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
        float w = uT * aSp + aPh; float jump = max(0.0, sin(w)) * 0.18 * uCheer;
        ${mode === 1 ? `float up = clamp(step(0.9, aArm) + step(0.4, aArm) * step(0.5, uCheer), 0.0, 1.0); float ang = mix(0.12, 2.8 + sin(w * 2.0 + ${side}.0) * 0.25, up) * ${side < 0 ? '-1.0' : '1.0'};
          float cs = cos(ang), sn = sin(ang); transformed.xy = vec2(cs * transformed.x - sn * transformed.y, sn * transformed.x + cs * transformed.y);` : ''}
        ${mode === 2 ? `float ang = sin(w * 3.0) * 0.6; float cs = cos(ang), sn = sin(ang); transformed.xy = vec2(cs * transformed.x - sn * transformed.y, sn * transformed.x + cs * transformed.y);` : ''}
        ${mode === 3 ? `` : `transformed.y += jump;`}
        ${mode === 0 ? `transformed.x += sin(w * 0.5) * 0.04;` : ''}`); }; };
  const place = (im, i, show, x, y, z, ry, sc, lat = 0) => { if (!show) { D.position.set(0, -60, 0); D.rotation.set(0, 0, 0); D.scale.setScalar(0.001); } else { D.position.set(x + Math.cos(ry) * lat * sc, y, z - Math.sin(ry) * lat * sc); D.rotation.set(0, ry, 0); D.scale.setScalar(sc); } D.updateMatrix(); im.setMatrixAt(i, D.matrix); };
  fans.forEach((f, i) => { const sc = f.sc; const sh = 1.42 * sc;
    place(IM.leg, i, true, f.x, f.y, f.z, f.ry, sc); place(IM.coat, i, true, f.x, f.y, f.z, f.ry, sc); place(IM.head, i, true, f.x, f.y, f.z, f.ry, sc);
    place(IM.beanie, i, f.hat === 'beanie', f.x, f.y, f.z, f.ry, sc); place(IM.pom, i, f.hat === 'beanie', f.x, f.y, f.z, f.ry, sc); place(IM.horn, i, f.hat === 'horn', f.x, f.y, f.z, f.ry, sc); place(IM.trap, i, f.hat === 'trap', f.x, f.y, f.z, f.ry, sc);
    place(IM.armL, i, true, f.x, f.y + sh, f.z, f.ry, sc, -0.3); place(IM.armR, i, true, f.x, f.y + sh, f.z, f.ry, sc, 0.3);
    place(IM.towel, i, f.towel, f.x, f.y + sh + 0.45 * sc, f.z, f.ry, sc, 0.3); });
  hook(IM.leg, 3); hook(IM.coat, 0); hook(IM.head, 0); hook(IM.beanie, 0); hook(IM.pom, 0); hook(IM.horn, 0); hook(IM.trap, 0); hook(IM.armL, 1, -1); hook(IM.armR, 1, 1); hook(IM.towel, 2);
  // NÉN: mũ/khăn chỉ giữ thể hiện thật sự hiện (bỏ bản ẩn) → bớt đỉnh phải xử lý
  const FILT = { beanie: (f) => f.hat === 'beanie', pom: (f) => f.hat === 'beanie', horn: (f) => f.hat === 'horn', trap: (f) => f.hat === 'trap', towel: (f) => f.towel };
  const M4 = new THREE.Matrix4();
  for (const k in FILT) { const im = IM[k]; const idx = []; fans.forEach((f, i) => { if (FILT[k](f)) idx.push(i); });
    const mat = im.instanceMatrix.array, cA = im.instanceColor ? im.instanceColor.array : null; const g = im.geometry; const at = ['aPh', 'aSp', 'aArm'].map((n) => g.getAttribute(n));
    const nm = new Float32Array(idx.length * 16), nc = cA ? new Float32Array(idx.length * 3) : null, na = at.map(() => new Float32Array(idx.length));
    idx.forEach((i, j) => { nm.set(mat.subarray(i * 16, i * 16 + 16), j * 16); if (nc) nc.set(cA.subarray(i * 3, i * 3 + 3), j * 3); at.forEach((A, q) => (na[q][j] = A.array[i])); });
    im.instanceMatrix = new THREE.InstancedBufferAttribute(nm, 16); if (nc) im.instanceColor = new THREE.InstancedBufferAttribute(nc, 3);
    ['aPh', 'aSp', 'aArm'].forEach((n, q) => g.setAttribute(n, new THREE.InstancedBufferAttribute(na[q], 1))); im.count = idx.length; }
  for (const k in IM) { IM[k].instanceMatrix.needsUpdate = true; if (IM[k].instanceColor) IM[k].instanceColor.needsUpdate = true; }
  const update = (t, cheer = 0.3) => { UN.uT.value = t; UN.uCheer.value = cheer; };
  console.log('bowl fans', N, 'seats', seats.length);
  const hide = () => { for (const k in IM) IM[k].visible = false; };
  return { update, count: N, hide, IM };
}
// đống tuyết xúc dọc biên/góc sân
export function snowbanks(G, pts) { const m = new THREE.MeshStandardMaterial({ color: '#f4f7fa', roughness: 0.95 }); let s = 5; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  pts.forEach(([x, z, w]) => { for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), m); b.scale.set(w * (0.5 + R() * 0.4), 0.6 + R() * 0.5, 0.9 + R() * 0.5); b.position.set(x + (R() - 0.5) * w, 0, z + (R() - 0.5) * 0.6); b.receiveShadow = true; G.add(b); } }); }
