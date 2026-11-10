// E11 (NBA): sân bóng rổ GỖ NỔI giữa đầm lầy BAYOU Louisiana lúc hoàng hôn + BỒ NÔNG NÂU (chim biểu tượng bang Louisiana) dựng bằng code.
// Bối cảnh mới (chưa tập nào dùng): mặt nước phản chiếu trời, cây bách đầm lầy rủ rêu Tây Ban Nha, bèo/lá súng, đom đóm, đèn dây,
// khán đài gỗ trên cọc + khán giả trên thuyền, ban nhạc kèn jazz, bảng điểm gỗ, bến gỗ có ghế băng.
// Sân NBA thật 28,65 × 15,24 m; rổ 3,05 m. Bồ nông nâu thật dài ~1,2 m, sải cánh ~2–2,3 m (tỉ lệ hoạt hình o.s, mặc định 1,25).
import * as THREE from 'three';
import { hoop } from './nba.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8 }, o));
const ctex = (w, h, draw, rep) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } t.userData.cv = cv; return t; };
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const BC = { L: 28.65, W: 15.24, WATER: -0.42 };

// ======================= ĐẦM LẦY + SÂN NỔI =======================
export function buildBayou(scene, o = {}) {
  const r = rnd(o.seed ?? 21);
  const sunDir = new THREE.Vector3(-0.8, 0.07, -0.6).normalize();
  // trời hoàng hôn đầm lầy: tím than trên đỉnh → hồng cam → vàng sát chân trời
  const SKY = `vec3 skyc(vec3 v, vec3 sd){ float h = clamp(v.y,-0.2,1.); float s = max(0.,dot(normalize(v),sd));
      vec3 top = vec3(0.16,0.14,0.36), mid = vec3(0.86,0.42,0.42), hor = vec3(1.0,0.72,0.40);
      vec3 c = mix(hor, mid, smoothstep(0.0,0.14,h)); c = mix(c, top, smoothstep(0.14,0.6,h));
      c += vec3(1.0,0.5,0.2)*pow(s,6.)*0.5 + vec3(1.,0.88,0.6)*pow(s,140.)*1.6; return c; }`;
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { sd: { value: sunDir } },
    vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `varying vec3 vp; uniform vec3 sd; ${SKY} void main(){ vec3 c = skyc(vp, sd); if (vp.y < 0.0) c = vec3(0.22,0.2,0.2); gl_FragColor = vec4(c,1.); }` }));
  sky.renderOrder = -1; scene.add(sky);
  const sun = new THREE.Mesh(new THREE.CircleGeometry(34, 48), new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false, fog: false }));
  sun.position.copy(sunDir.clone().multiplyScalar(850)); sun.lookAt(0, 0, 0); scene.add(sun);
  scene.fog = new THREE.Fog('#c98a78', 70, 420);
  // MẶT NƯỚC: phản chiếu trời (fresnel) + gợn sóng động + vệt nắng
  const WU = { uT: { value: 0 }, sd: { value: sunDir }, cam: { value: new THREE.Vector3() } };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600, 1, 1), new THREE.ShaderMaterial({ uniforms: WU, fog: false,
    vertexShader: 'varying vec3 wp; void main(){ vec4 w = modelMatrix * vec4(position,1.); wp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying vec3 wp; uniform float uT; uniform vec3 sd; uniform vec3 cam; ${SKY}
      void main(){ vec2 p = wp.xz; float n = sin(p.x*1.7+uT*1.3)*0.5 + sin(p.y*2.3-uT*1.1)*0.5 + sin((p.x+p.y)*3.9+uT*2.0)*0.35 + sin((p.x-p.y)*7.3-uT*2.7)*0.2;
        float fade = 1.0 - smoothstep(15., 60., length(wp.xz - cam.xz)); n *= fade;
        vec3 nrm = normalize(vec3(n*0.035, 1., cos(p.x*2.1+uT)*0.03*fade));
        vec3 v = normalize(wp - cam); vec3 rf = reflect(v, nrm); rf.y = abs(rf.y);
        float fr = 0.12 + 0.88*pow(1.0 - max(0.,dot(-v, nrm)), 4.0);
        vec3 deep = vec3(0.045,0.06,0.045); vec3 c = mix(deep, skyc(rf, sd)*0.55, fr*0.8);
        c *= 0.85 + 0.3*n;
        c += vec3(1.,0.75,0.45)*pow(max(0.,dot(rf, sd)), 220.)*1.4;
        float d = length(wp.xz - cam.xz); c = mix(c, vec3(0.6,0.42,0.4), smoothstep(150.,500.,d));
        gl_FragColor = vec4(c,1.);
      }` }));
  water.rotation.x = -Math.PI / 2; water.position.y = BC.WATER; scene.add(water);
  // SÂN GỖ NỔI: ván gỗ sáng + vạch NBA trắng + chữ BAYOU giữa sân
  const S = 64; const L = BC.L, Wd = BC.W, PAD = 2.2;
  const courtTex = ctex(Math.round((L + 2 * PAD) * S), Math.round((Wd + 2 * PAD) * S), (g, W, H) => {
    const ox = PAD * S, oy = PAD * S, LL = L * S, WW = Wd * S;
    g.fillStyle = '#7a5434'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 0.22 * S) { for (let x = -r() * 3 * S; x < W; x += 3.1 * S) { const v = 0.85 + r() * 0.3; g.fillStyle = `rgb(${176 * v | 0},${128 * v | 0},${84 * v | 0})`; g.fillRect(x, y, 3.06 * S, 0.2 * S); } }
    g.fillStyle = 'rgba(40,20,8,0.35)'; for (let y = 0; y < H; y += 0.22 * S) g.fillRect(0, y + 0.2 * S, W, 0.02 * S);
    g.fillStyle = 'rgba(28,48,92,0.92)'; for (const sx of [0, 1]) { const x0 = sx ? ox + LL - 5.8 * S : ox; g.fillRect(x0, oy + WW / 2 - 2.44 * S, 5.8 * S, 4.88 * S); } // sơn cấm địa xanh navy
    g.strokeStyle = 'rgba(252,248,238,0.95)'; g.lineWidth = 0.06 * S; g.strokeRect(ox, oy, LL, WW);
    g.beginPath(); g.moveTo(ox + LL / 2, oy); g.lineTo(ox + LL / 2, oy + WW); g.stroke(); g.beginPath(); g.arc(ox + LL / 2, oy + WW / 2, 1.83 * S, 0, 7); g.stroke();
    for (const sx of [1, -1]) { const bx = sx > 0 ? ox : ox + LL, d = sx; const rimX = bx + d * 1.6 * S;
      g.strokeRect(sx > 0 ? bx : bx - 5.8 * S, oy + WW / 2 - 2.44 * S, 5.8 * S, 4.88 * S); g.beginPath(); g.arc(bx + d * 5.8 * S, oy + WW / 2, 1.83 * S, 0, 7); g.stroke();
      const c3 = 6.71 * S, R3 = 7.24 * S, ang = Math.asin(c3 / R3); const xc = Math.sqrt(R3 * R3 - c3 * c3);
      g.beginPath(); g.moveTo(bx, oy + WW / 2 - c3); g.lineTo(rimX + d * xc, oy + WW / 2 - c3); g.stroke(); g.beginPath(); g.moveTo(bx, oy + WW / 2 + c3); g.lineTo(rimX + d * xc, oy + WW / 2 + c3); g.stroke();
      g.beginPath(); if (d > 0) g.arc(rimX, oy + WW / 2, R3, -ang, ang); else g.arc(rimX, oy + WW / 2, R3, Math.PI - ang, Math.PI + ang); g.stroke(); }
    g.font = `900 ${1.5 * S}px Anton, sans-serif`; g.fillStyle = 'rgba(28,48,92,0.75)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BAYOU', ox + LL / 2, oy + WW / 2 + 4.3 * S);
    g.fillStyle = 'rgba(160,30,40,0.7)'; g.fillText('BAYOU', ox + LL / 2, oy + WW / 2 - 4.3 * S);
  });
  const deckM = std('#5e3f26', { roughness: 0.9 });
  const court = new THREE.Mesh(new THREE.BoxGeometry(L + 2 * PAD, 0.3, Wd + 2 * PAD), [deckM, deckM, new THREE.MeshStandardMaterial({ map: courtTex, roughness: 0.55, metalness: 0.0 }), deckM, deckM, deckM]);
  court.position.y = -0.15; court.receiveShadow = true; scene.add(court);
  // cọc gỗ quanh sân (chìm xuống nước) + lan can thấp ở hai đầu
  const post = std('#3e2a1a', { roughness: 0.95 });
  for (let x = -L / 2 - PAD; x <= L / 2 + PAD + 0.01; x += 3.0) for (const z of [-Wd / 2 - PAD, Wd / 2 + PAD]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.6, 8), post); p.position.set(x, -0.35, z); p.castShadow = true; scene.add(p); }
  const hoops = [1, -1].map((d) => { const h = hoop(d, { pad: '#1c3064' }); h.position.set(d * (L / 2 - 1.22), 0, 0); scene.add(h); return h; });
  // CÂY BÁCH ĐẦM LẦY: gốc loe trong nước + tán tầng phẳng + rêu Tây Ban Nha rủ (instanced)
  const bark = std('#5a4836', { roughness: 0.95 }), leafA = std('#3f5a2a', { roughness: 0.95 }), leafB = std('#556b30', { roughness: 0.95 });
  const mossPts = [];
  const cypress = (x, z, s = 1, sd = 1) => { const rr = rnd(sd * 173 + 11); const G = new THREE.Group(); const h = 9 + rr() * 6;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 1.25, 2.4, 10), bark); base.position.y = BC.WATER + 1.0; G.add(base);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.36, h, 8), bark); tr.position.y = BC.WATER + 2.2 + h / 2; G.add(tr);
    for (let i = 0; i < 4; i++) { const k = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7 + rr() * 0.5, 6), bark); const a = rr() * 6.28, d = 1.4 + rr() * 1.4; k.position.set(Math.cos(a) * d, BC.WATER + 0.25, Math.sin(a) * d); G.add(k); } // rễ thở "knees"
    for (let i = 0; i < 6; i++) { const y = BC.WATER + 2.2 + h * (0.45 + i * 0.1); const a = rr() * 6.28; const rad = 2.2 + rr() * 1.8 - i * 0.15;
      const c = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 6), i % 2 ? leafA : leafB); c.scale.y = 0.28; c.position.set(Math.cos(a) * 0.8, y, Math.sin(a) * 0.8); G.add(c);
      for (let k = 0; k < 7; k++) { const aa = rr() * 6.28, dd = rad * (0.55 + rr() * 0.4); mossPts.push([x + (Math.cos(a) * 0.8 + Math.cos(aa) * dd) * s, (y - 0.15) * s, z + (Math.sin(a) * 0.8 + Math.sin(aa) * dd) * s, 0.8 + rr() * 1.8]); } }
    G.position.set(x, 0, z); G.scale.setScalar(s); G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(G); return G; };
  // cây sát sân (khung cảnh trong mọi góc máy) + rừng xa
  const near = [[-L / 2 - 8, -Wd / 2 - 7], [L / 2 + 7, -Wd / 2 - 9], [-3, -Wd / 2 - 15], [9, -Wd / 2 - 16], [-L / 2 - 10, Wd / 2 + 8], [L / 2 + 9, Wd / 2 + 10], [-12, Wd / 2 + 17], [14, Wd / 2 + 18], [-L / 2 - 14, 2], [L / 2 + 14, -1]];
  near.forEach(([x, z], i) => cypress(x, z, 0.95 + r() * 0.3, i + 1));
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = 40 + r() * 170; cypress(Math.cos(a) * d, Math.sin(a) * d, 0.8 + r() * 0.8, 40 + i); }
  { const n = mossPts.length; const g = new THREE.ConeGeometry(0.22, 1, 5); g.translate(0, -0.5, 0); g.rotateX(Math.PI); g.translate(0, 0, 0);
    const im = new THREE.InstancedMesh(g, std('#8f9a82', { roughness: 1 }), n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    mossPts.forEach(([x, y, z, len], i) => { q.setFromEuler(new THREE.Euler(Math.PI + (r() - 0.5) * 0.15, r() * 6, (r() - 0.5) * 0.15)); sc.set(1, len, 1); m4.compose(new THREE.Vector3(x, y, z), q, sc); im.setMatrixAt(i, m4); });
    im.castShadow = true; scene.add(im); }
  // bèo + lá súng (instanced) trên mặt nước, có vài bông hoa
  { const n = 1400; const im = new THREE.InstancedMesh(new THREE.CircleGeometry(0.35, 10, 0.3, 5.9).rotateX(-Math.PI / 2), std('#4f7a32', { roughness: 0.9 }), n); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    for (let i = 0; i < n; i++) { let x, z; do { x = (r() - 0.5) * 140; z = (r() - 0.5) * 110; } while (Math.abs(x) < L / 2 + PAD + 1 && Math.abs(z) < Wd / 2 + PAD + 1); const s = 0.5 + r() * 1.3; q.setFromEuler(new THREE.Euler(0, r() * 6, 0)); m4.compose(new THREE.Vector3(x, BC.WATER + 0.02, z), q, new THREE.Vector3(s, 1, s)); im.setMatrixAt(i, m4); }
    scene.add(im);
    const fl = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 8, 6), std('#f4d0e0', { roughness: 0.6 }), 120); for (let i = 0; i < 120; i++) { let x, z; do { x = (r() - 0.5) * 90; z = (r() - 0.5) * 80; } while (Math.abs(x) < L / 2 + PAD + 1 && Math.abs(z) < Wd / 2 + PAD + 1); m4.makeTranslation(x, BC.WATER + 0.08, z); fl.setMatrixAt(i, m4); } scene.add(fl); }
  // ĐOM ĐÓM (nhấp nháy)
  const FF = 260; const ffM = new THREE.MeshBasicMaterial({ color: '#fff27a', toneMapped: false, transparent: true, opacity: 0.95 }); const ff = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 6, 4), ffM, FF);
  const ffD = []; for (let i = 0; i < FF; i++) { let x, z; do { x = (r() - 0.5) * 80; z = (r() - 0.5) * 70; } while (Math.abs(x) < L / 2 && Math.abs(z) < Wd / 2); ffD.push([x, 0.6 + r() * 3.5, z, r() * 10]); } scene.add(ff);
  // KHÁN ĐÀI GỖ TRÊN CỌC (-z: 7 bậc; +z: 4 bậc sau ghế đội) + dựng khán giả (lưới gộp, vẫy tay bằng shader)
  const wood = std('#8a6038', { roughness: 0.85 }), dark = std('#3e2a1a');
  const stand = (z0, dir, rows, x0, x1) => { const G = new THREE.Group(); for (let k = 0; k < rows; k++) { const z = z0 + dir * k * 0.7, y = 0.45 + k * 0.45;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.09, 0.5), wood); seat.position.set((x0 + x1) / 2, y, z); G.add(seat); const rs = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y + 0.42, 0.06), dark); rs.position.set((x0 + x1) / 2, (y - 0.42) / 2, z + dir * 0.27); G.add(rs); }
    for (let x = x0; x <= x1; x += 3) for (let k = 0; k < rows; k += 3) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 2.6, 6), post); p.position.set(x, 0.45 + k * 0.45 - 1.3, z0 + dir * k * 0.7); G.add(p); }
    G.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(G); };
  const zA = -Wd / 2 - PAD - 0.8, zB = Wd / 2 + PAD + 2.4; stand(zA, -1, 7, -12.5, 12.5); stand(zB, 1, 4, -12.5, -2.6); stand(zB, 1, 4, 2.6, 12.5);
  const crowdPos = []; for (let k = 0; k < 7; k++) for (let x = -12; x <= 12; x += 0.56) { if (r() > (k < 4 ? 0.8 : 0.62)) continue; crowdPos.push([x + (r() - 0.5) * 0.08, 0.45 + k * 0.45 - 0.42, zA - k * 0.7, 0]); }
  for (let k = 0; k < 4; k++) for (let x = -12; x <= 12; x += 0.56) { if (Math.abs(x) < 3.0) continue; if (r() > 0.6) continue; crowdPos.push([x, 0.45 + k * 0.45 - 0.42, zB + k * 0.7, Math.PI]); }
  // thuyền gỗ (pirogue) có người ngồi xem
  const boats = []; const boatM = std('#6a4a2c', { roughness: 0.9 });
  for (const [x, z, ry] of [[-L / 2 - 5, -Wd / 2 - 4, 0.6], [L / 2 + 4.5, Wd / 2 + 3, -2.4], [L / 2 + 6, -3, 1.7], [-L / 2 - 6, 4, -1.2], [6, -Wd / 2 - 13, 0.1], [-8, Wd / 2 + 12, 3.0]]) {
    const B = new THREE.Group(); const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 4.2, 12, 1, false, 0, Math.PI), boatM); hull.rotation.set(0, 0, Math.PI / 2); hull.rotation.x = Math.PI; hull.scale.set(1, 1, 0.5); hull.position.y = BC.WATER + 0.25; B.add(hull);
    B.position.set(x, 0, z); B.rotation.y = ry; B.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(B); boats.push(B);
    for (const dx of [-0.9, 0.9]) { const p = new THREE.Vector3(dx, BC.WATER + 0.05 - 0.4, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry).add(new THREE.Vector3(x, 0, z)); crowdPos.push([p.x, p.y + 0.2, p.z, Math.atan2(-p.x, -p.z)]); } }
  // ban nhạc kèn jazz trên sàn nhỏ góc sân (-x, +z)
  const band = new THREE.Group(); { const pl = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 2.6), wood); pl.position.y = 0.0; band.add(pl); }
  band.position.set(-L / 2 - PAD - 2.6, 0, Wd / 2 + 1.0); scene.add(band);
  const brass = std('#e0b040', { metalness: 0.85, roughness: 0.25 });
  const bandPos = [[-1.3, 0.6], [0, 0.4], [1.3, 0.6]]; bandPos.forEach(([dx, dz], i) => { crowdPos.push([band.position.x + dx, 0.15, band.position.z + dz, 0.7, 'band']);
    const ins = new THREE.Group(); if (i === 1) { const tb = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 8, 18), brass); ins.add(tb); const bell = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 14, 1, true), brass); bell.position.set(0, 0.4, 0); ins.add(bell); ins.position.set(0, 0.95, 0.25); }
      else { const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), brass); tube.rotation.x = Math.PI / 2 - 0.4; ins.add(tube); const bell = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 12, 1, true), brass); bell.rotation.x = -Math.PI / 2 + 0.4; bell.position.set(0, 0.12, 0.33); ins.add(bell); ins.position.set(0, 1.05, 0.3); }
    ins.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7); ins.position.add(new THREE.Vector3(band.position.x + dx, 0.15, band.position.z + dz)); ins.rotation.y = 0.7; ins.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(ins); });
  const CR = crowd(scene, crowdPos, o.shirts);
  // ĐÈN DÂY ấm treo dọc hai bên sân (cột gỗ + bóng đèn phát sáng)
  const bulbM = new THREE.MeshBasicMaterial({ color: '#ffd38a', toneMapped: false }); const bulbs = [];
  for (const z of [-Wd / 2 - PAD + 0.1, Wd / 2 + PAD - 0.1]) { const poles = [-L / 2 - PAD, -L / 4, 0, L / 4, L / 2 + PAD];
    poles.forEach((x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 6, 6), post); p.position.set(x, 3, z); p.castShadow = true; scene.add(p); });
    for (let i = 0; i < poles.length - 1; i++) for (let k = 1; k < 12; k++) { const u = k / 12; const x = poles[i] + (poles[i + 1] - poles[i]) * u; const y = 5.9 - Math.sin(u * Math.PI) * 0.9; const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), bulbM); b.position.set(x, y, z); scene.add(b); bulbs.push(b); } }
  // BẢNG ĐIỂM GỖ cạnh sân (-z) — mặt canvas
  const sbTex = ctex(1024, 512, (g, W, H) => { g.fillStyle = '#1b1410'; g.fillRect(0, 0, W, H); });
  const SBG = new THREE.Group(); const sbw = std('#6b4528', { roughness: 0.9 });
  for (const x of [-2.3, 2.3]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.24, 5.2, 0.24), sbw); p.position.set(x, 2.6, 0); SBG.add(p); }
  const fr = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.7, 0.2), sbw); fr.position.set(0, 4.4, -0.05); SBG.add(fr);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.3), new THREE.MeshBasicMaterial({ map: sbTex, toneMapped: false })); scr.position.set(0, 4.4, 0.06); SBG.add(scr);
  SBG.position.set(0, 0, -Wd / 2 - PAD + 0.35); SBG.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(SBG);
  // ghế băng đội (+z) + BẾN GỖ có ghế băng riêng (cảnh Curry ngồi xem)
  const bench = new THREE.Group(); { const seat = new THREE.Mesh(new THREE.BoxGeometry(6, 0.08, 0.45), sbw); seat.position.y = 0.48; bench.add(seat); for (const x of [-2.7, 0, 2.7]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.46, 0.4), sbw); l.position.set(x, 0.23, 0); bench.add(l); } }
  bench.position.set(0, 0, Wd / 2 + 1.3); bench.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(bench);
  const dock = new THREE.Group(); { const dk = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 3), deckM); dk.position.y = -0.1; dk.receiveShadow = true; dock.add(dk); const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.5), sbw); seat.position.set(0, 0.48, -0.6); dock.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.06), sbw); back.position.set(0, 0.85, -0.85); dock.add(back); for (const x of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.46, 0.4), sbw); l.position.set(x, 0.23, -0.6); dock.add(l); }
    for (const [x, z] of [[-2.3, -1.3], [2.3, -1.3], [-2.3, 1.3], [2.3, 1.3]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.6, 6), post); p.position.set(x, -0.5, z); dock.add(p); } }
  dock.position.set(L / 2 + PAD + 3.6, 0, Wd / 2 - 1); dock.rotation.y = -Math.PI / 2; dock.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(dock);
  const update = (t, cam) => { WU.uT.value = t; if (cam) WU.cam.value.copy(cam.position); CR.U.uT.value = t;
    const m4 = new THREE.Matrix4(); ffD.forEach(([x, y, z, ph], i) => { const k = 0.5 + 0.5 * Math.sin(t * 2.3 + ph * 3.1); const s = k > 0.55 ? 1 : 0.15; m4.compose(new THREE.Vector3(x + Math.sin(t * 0.3 + ph) * 0.8, y + Math.sin(t * 0.5 + ph * 2) * 0.3, z + Math.cos(t * 0.27 + ph) * 0.8), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); ff.setMatrixAt(i, m4); }); ff.instanceMatrix.needsUpdate = true;
    boats.forEach((b, i) => { b.position.y = Math.sin(t * 0.9 + i) * 0.04; b.rotation.z = Math.sin(t * 0.7 + i * 2) * 0.03; }); };
  return { hoops, sbTex, SB: SBG, bench, dock, band, sunDir, sky, water, CR, update };
}

// khán giả gộp 1 lưới: thân/đầu/chân/tay; tay vẫy theo uCheer (giống gymCrowd E09); p = [x, y, z, yaw]
function crowd(scene, list, shirts0) {
  let rs = 17; const R = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z).toNonIndexed();
  const torsoG = box(0.4, 0.46, 0.26, 0, 0.72, -0.02), headG = new THREE.IcosahedronGeometry(0.12, 1).translate(0, 1.1, 0).toNonIndexed(), legG = box(0.38, 0.14, 0.42, 0, 0.5, 0.18), armG = box(0.09, 0.4, 0.09, 0, -0.2, 0);
  const eyeG = new THREE.IcosahedronGeometry(0.035, 0).toNonIndexed(), pupG = new THREE.IcosahedronGeometry(0.018, 0).toNonIndexed(), hatG = new THREE.CylinderGeometry(0.16, 0.16, 0.03, 10).translate(0, 1.2, 0).toNonIndexed(), crownG = new THREE.CylinderGeometry(0.1, 0.11, 0.1, 10).translate(0, 1.26, 0).toNonIndexed();
  const shirts = shirts0 || ['#0C2340', '#C8102E', '#B4975A', '#f4f4f2', '#2f6b4a', '#e2c25a', '#7a3a8a', '#1f3566', '#d9864f', '#ffffff', '#0C2340', '#C8102E'];
  const skins = ['#f1c9a5', '#d6a47a', '#b57e55', '#c99266', '#e8b98f'];
  const P = [], C = [], CP = [], PV = [], FX = []; const v = new THREE.Vector3(), col = new THREE.Color();
  const add = (geo, m, color, cp, piv, fax) => { col.set(color).convertSRGBToLinear(); const n = geo.attributes.position.count;
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(m); P.push(v.x, v.y, v.z); C.push(col.r, col.g, col.b); CP.push(...cp); PV.push(piv.x, piv.y, piv.z); FX.push(fax.x, fax.y, fax.z); } };
  for (const [x, y, z, yaw, tag] of list) { const m = new THREE.Matrix4().makeRotationY(yaw).premultiply(new THREE.Matrix4().makeTranslation(x, y, z)); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)); const fax = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const rr = R(), shirt = tag === 'band' ? '#f4f0e6' : shirts[Math.floor(R() * shirts.length)], skin = skins[Math.floor(R() * skins.length)]; const ph = rr * 40, am = tag === 'band' ? 0.2 : 0.55 + 0.45 * ((rr * 7.3) % 1); const zero = new THREE.Vector3();
    add(torsoG, m, shirt, [1, ph, am, 0], zero, fax); add(headG, m, skin, [1.5, ph, am, 0], zero, fax); add(legG, m, '#2b2f3a', [0, 0, 0, 0], zero, zero);
    for (const sx of [-1, 1]) { const T = (gx, gy, gz) => new THREE.Matrix4().makeTranslation(gx, gy, gz).premultiply(m); add(eyeG, T(sx * 0.045, 1.13, 0.1), '#ffffff', [1.5, ph, am, 0], zero, fax); add(pupG, T(sx * 0.045, 1.13, 0.13), '#111111', [1.5, ph, am, 0], zero, fax); }
    if (tag === 'band' || R() < 0.18) { add(hatG, m, tag === 'band' ? '#1b1b1b' : '#d9c48a', [1.5, ph, am, 0], zero, fax); add(crownG, m, tag === 'band' ? '#1b1b1b' : '#d9c48a', [1.5, ph, am, 0], zero, fax); }
    for (const sx of [-1, 1]) { const off = new THREE.Vector3(sx * 0.25, 0.94, -0.02); const sh = off.clone().applyMatrix4(m); const am4 = new THREE.Matrix4().makeTranslation(off.x, off.y, off.z).premultiply(m);
      const ow = off.clone().setY(0).applyQuaternion(q); const d = new THREE.Vector3(0, -1, 0), sgn = Math.sign(new THREE.Vector3().crossVectors(fax, d).dot(ow)) || 1; add(armG, am4, shirt, [sgn > 0 ? 2 : 3, ph, am, 0], sh, fax); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  geo.setAttribute('cp', new THREE.Float32BufferAttribute(CP, 4)); geo.setAttribute('piv', new THREE.Float32BufferAttribute(PV, 3)); geo.setAttribute('fax', new THREE.Float32BufferAttribute(FX, 3)); geo.computeVertexNormals();
  const U = { uT: { value: 0 }, uCheer: { value: 0.2 } };
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 cp; attribute vec3 piv; attribute vec3 fax; uniform float uT, uCheer;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      if (cp.x > 0.5) { float ch = clamp(uCheer * cp.z * (0.7 + 0.6 * fract(cp.y * 0.37)), 0.0, 1.0); float w = uT * (5.0 + cp.z * 3.0) + cp.y;
        if (cp.x > 1.9) { float s = cp.x < 2.5 ? 1.0 : -1.0; float ang = s * (0.12 + ch * (2.5 + 0.35 * sin(w * 1.3)) + 0.06 * sin(uT * 1.7 + cp.y));
          vec3 r = transformed - piv; r = r * cos(ang) + cross(fax, r) * sin(ang) + fax * dot(fax, r) * (1.0 - cos(ang)); transformed = piv + r; }
        transformed.y += (0.012 + 0.12 * ch) * max(0.0, sin(w)); }`); };
  mat.customProgramCacheKey = () => 'bayoucrowd';
  const all = new THREE.Mesh(geo, mat); all.frustumCulled = false; all.castShadow = true; all.receiveShadow = true; scene.add(all);
  return { U, count: list.length };
}

export function bayouLights(scene, sunDir) {
  const hemi = new THREE.HemisphereLight('#ffc9b0', '#3a3a2a', 2.3); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffb27a', 3.0); key.position.copy(sunDir.clone().multiplyScalar(60)).setY(24); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 150 }); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; scene.add(key);
  const rim = new THREE.DirectionalLight('#a9b6ff', 0.7); rim.position.set(30, 18, 40); scene.add(rim);
  const warm = []; for (const [x, z] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) { const p = new THREE.PointLight('#ffc070', 14, 22, 1.6); p.position.set(x, 5.2, z); scene.add(p); warm.push(p); }
  return { hemi, key, rim, warm };
}

// ======================= BỒ NÔNG NÂU =======================
// Trục cục bộ: mặt trước +z, lên +y. update(t, c): c = {walk (m), flap 0..1 (bay: dang cánh + vỗ), fly 0..1 (tư thế bay: cổ gập), pouch 0..1 (há túi),
//   bulge 0..1 (túi phình chứa bóng), neckYaw, headPitch, look:[x,y], blink 0..1, hop}
// Trả về {root, update, mouth: Object3D (tâm túi họng — đặt bóng), head}
export function makePelican(o = {}) {
  const sd = o.seed ?? 1; const S = o.s ?? 1.25;
  const body = std('#8c867a', { roughness: 0.85 }), wingM = std('#5f584d', { roughness: 0.85 }), tipM = std('#2a2622', { roughness: 0.8 }), white = std('#f3efe4', { roughness: 0.8 }), crown = std('#efd88a', { roughness: 0.8 }), nape = std('#6b3a24', { roughness: 0.85 });
  const billM = std('#c9b08a', { roughness: 0.55 }), billTip = std('#b24a3a', { roughness: 0.5 }), pouchM = std('#4b4038', { roughness: 0.7, side: THREE.DoubleSide }), legM = std('#2f2a26', { roughness: 0.8 });
  const root = new THREE.Group(); const B = new THREE.Group(); root.add(B);
  const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), body); torso.scale.set(0.27, 0.25, 0.46); torso.position.set(0, 0.5, 0); B.add(torso);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), std('#9f998c')); belly.scale.set(0.22, 0.18, 0.34); belly.position.set(0, 0.43, 0.06); B.add(belly);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.32, 8), wingM); tail.rotation.x = -Math.PI / 2 - 0.35; tail.scale.z = 0.4; tail.position.set(0, 0.5, -0.52); B.add(tail);
  // áo (tuỳ chọn): đai quanh thân có chữ
  if (o.jersey) { const jt = ctex(512, 160, (g, W, H) => { g.fillStyle = o.jersey.color; g.fillRect(0, 0, W, H); g.fillStyle = o.jersey.textColor || '#ffffff'; g.font = '900 96px Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.jersey.text || '', W / 2, H / 2 + 4); });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 24, 1, true), new THREE.MeshStandardMaterial({ map: jt, roughness: 0.8, side: THREE.DoubleSide })); band.rotation.x = Math.PI / 2; band.scale.set(0.285, 1, 0.265); band.position.set(0, 0.5, 0.0); band.rotation.y = 0; B.add(band); }
  // chân + chân màng
  const legs = [-1, 1].map((s) => { const hip = new THREE.Group(); hip.position.set(s * 0.12, 0.3, 0.02); B.add(hip); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.26, 6), legM); l.position.y = -0.13; hip.add(l);
    const foot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 10, -0.6 + Math.PI / 2, 1.2), legM); foot.rotation.x = -Math.PI / 2; foot.position.set(0, -0.26, 0.04); hip.add(foot); return { hip, s }; });
  // cánh: gốc ở vai, 2 đốt (trong/ngoài), lông đầu cánh đen
  const wings = [-1, 1].map((s) => { const sh = new THREE.Group(); sh.position.set(s * 0.21, 0.62, 0.14); B.add(sh);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 0.36), wingM); inner.position.x = s * 0.31; sh.add(inner);
    const el = new THREE.Group(); el.position.x = s * 0.62; sh.add(el); const outer = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.3), wingM); outer.position.x = s * 0.25; el.add(outer);
    for (let k = 0; k < 4; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.07), tipM); f.position.set(s * (0.55 + 0.03 * k), 0, 0.1 - k * 0.075); f.rotation.y = s * (-0.15 + k * 0.12); el.add(f); }
    const fw = new THREE.Group(); fw.position.set(s * 0.2, 0.55, -0.08); B.add(fw); const fm = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), wingM); fm.scale.set(0.085, 0.17, 0.42); fm.rotation.x = 0.12; fw.add(fm);
    const ft = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.34, 6), tipM); ft.rotation.x = -Math.PI / 2 - 0.15; ft.scale.x = 0.5; ft.position.set(0, 0.04, -0.5); fw.add(ft);
    return { sh, el, s, fw }; });
  // cổ: 5 đốt, gáy nâu hạt dẻ, cổ trước trắng
  const N = 5, SEG = 0.12; const neckBase = new THREE.Group(); neckBase.position.set(0, 0.64, 0.36); B.add(neckBase); const segs = []; let par = neckBase;
  for (let i = 0; i < N; i++) { const j = new THREE.Group(); if (i) j.position.y = SEG; par.add(j); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.062, SEG + 0.04, 12), i < 2 ? nape : white); m.position.y = SEG / 2; j.add(m); segs.push(j); par = j; }
  const headPivot = new THREE.Group(); headPivot.position.y = SEG; segs[N - 1].add(headPivot); const head = new THREE.Group(); headPivot.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 14), white); skull.scale.set(0.95, 1, 1.15); head.add(skull);
  const cr = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), crown); cr.position.set(0, 0.03, -0.01); head.add(cr);
  // mỏ trên dài + móc đỏ ở chóp; hàm dưới + túi họng (bản lề ở gốc mỏ)
  const BL = 0.5; const upper = new THREE.Group(); upper.position.set(0, 0.0, 0.08); head.add(upper);
  const ub = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.035, BL), billM); ub.position.z = BL / 2; upper.add(ub); const hook = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), billTip); hook.scale.set(1, 0.8, 1.2); hook.position.set(0, -0.015, BL); upper.add(hook);
  const lower = new THREE.Group(); lower.position.set(0, -0.035, 0.08); head.add(lower); const lb = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, BL - 0.02), billM); lb.position.z = BL / 2; lower.add(lb);
  const pouch = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), pouchM); pouch.position.set(0, 0.0, BL * 0.45); lower.add(pouch);
  const mouth = new THREE.Object3D(); mouth.position.set(0, -0.06, BL * 0.45); lower.add(mouth);
  // mắt hoạt hình to (như các nhân vật chính)
  const eyes = [-1, 1].map((s) => { const E = new THREE.Group(); E.position.set(s * 0.07, 0.035, 0.07); head.add(E);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); E.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2 })); p.position.set(s * 0.012, 0, 0.032); E.add(p);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), white); lid.rotation.x = -1.45; E.add(lid); return { E, p, lid, s }; });
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.scale.setScalar(S);
  const lerp = (a, b, k) => a + (b - a) * k;
  function update(t, c = {}) {
    const fly = c.fly ?? 0, flap = c.flap ?? 0, pq = c.pouch ?? 0, bu = c.bulge ?? 0;
    // đi lạch bạch
    const ph = (c.walk ?? 0) / 0.42; const mv = c.walking ? 1 : 0;
    legs.forEach((L, i) => { L.hip.rotation.x = lerp(mv * Math.sin(ph * Math.PI * 2 + i * Math.PI) * 0.5, -1.2, fly); });
    B.rotation.z = mv * Math.sin(ph * Math.PI * 2) * 0.12; B.position.y = (c.hop ?? 0) + mv * Math.abs(Math.sin(ph * Math.PI * 2)) * 0.03;
    B.rotation.x = lerp(0, 0.18, fly) + (c.lean ?? 0);
    // cánh: gập dọc thân ↔ dang + vỗ
    const fl = Math.sin(t * (c.flapHz ?? 7) * Math.PI * 2 / 3) * 0.6 * flap;
    wings.forEach((w) => { const fold = 1 - Math.max(fly, flap);
      w.sh.rotation.set(0, w.s * lerp(0, 1.5, fold), w.s * (fl + 0.12 * flap + lerp(0, -0.42, fold))); w.el.rotation.set(0, w.s * lerp(0, 0.12, fold), w.s * fl * 0.6); w.el.scale.x = lerp(1, 0.55, fold); const open = fold < 0.5; w.sh.visible = open; w.fw.visible = !open; });
    // cổ: chữ S khi đứng; gập lên vai khi bay
    const stand = [0.5, -0.7, -0.4, 0.5, 0.4], flyA = [-1.0, -1.1, 0.9, 1.0, 0.6];
    neckBase.rotation.y = (c.neckYaw ?? 0) + Math.sin(t * 0.6 + sd) * 0.06; let th = 0;
    segs.forEach((sg, i) => { const a = lerp(stand[i], flyA[i], fly) + (c.neckBend ?? 0) / N; sg.rotation.x = a; th += a; });
    headPivot.rotation.x = -th + (c.headPitch ?? 0.15) - pq * 0.35;
    // túi họng: há hàm, túi phình
    upper.rotation.x = -pq * 0.45; lower.rotation.x = pq * 0.25;
    pouch.scale.set(0.07 + bu * 0.06, 0.03 + pq * 0.11 + bu * 0.12, BL * 0.4 + bu * 0.05);
    // mắt
    const lk = c.look || [0, 0]; const bl = c.blink ?? (((t * 0.31 + sd * 0.17) % 1) < 0.04 ? 1 : 0);
    eyes.forEach((e) => { e.p.position.set(e.s * 0.012 + lk[0] * 0.012, lk[1] * 0.012, 0.032); e.lid.rotation.x = -1.45 + bl * 1.45; e.E.scale.setScalar(c.eyeWide ? 1.25 : 1); });
  }
  update(0, {});
  return { root, update, mouth, head, S };
}
