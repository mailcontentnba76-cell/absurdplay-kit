// E24 (Mascot NBA) — dân Philadelphia năm 1776 (Sixers "hiện nguyên hình") + đạo cụ.
// Trang phục: mũ ba góc, tóc giả trắng (cuộn hai bên + đuôi tóc buộc nơ), áo khoác dài vạt xẻ, gi-lê, khăn cổ trắng, quần ngố tới gối, tất trắng, giày khoá bạc.
// Không dựng mặt nhân vật lịch sử có thật. Không logo/màu chính thức của đội.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.78 }, o));
const shad = (G) => { G.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } }); return G; };
function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// bảng màu áo khoác (xanh navy, đỏ rượu, nâu, xanh rêu, xám) — mỗi người một màu
export const COATS = ['#1f2f5a', '#7a1f2a', '#5a3a22', '#2f4a36', '#4a4a52'];
export const VESTS = ['#e8dcc0', '#c8a860', '#f0ead8', '#d8c8a0', '#b89060'];
// cấu hình makeCharacter: áo dài tay = màu áo khoác; quần ngố tới gối; tất trắng; giày đen
export function cfg1776(BASE, i, skin, heightM = 1.76) { return { ...BASE, tank: false, shorts: true, shortsTo: 1.0, sockAt: 0.0, jersey: COATS[i % 5], collar: COATS[i % 5], pants: ['#e8dcc0', '#1a1a1a', '#c8b89a', '#3a2a1a', '#e8dcc0'][i % 5], socks: '#f4f2ec', shoes: '#141414', skin, hair: 'Hair_Buzzed', hairColor: '#ecebe6', beardStyle: null, armSleeve: 'both', armSleeveColor: COATS[i % 5], build: ['fit', 'belly', 'fit', 'belly', 'slim'][i % 5], shoulders: 'narrow', heightM }; }

export function tricorn(c = '#151515') { const G = new THREE.Group(); const m = std(c, { roughness: 0.9, side: THREE.DoubleSide });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m); crown.scale.set(1, 0.75, 1.05); G.add(crown);
  // vành: đĩa rộng, viền tam giác (3 mũi nhọn: trước và hai bên sau), mép giữa các mũi bẻ dựng đứng lên
  const R = 0.23, geo = new THREE.CircleGeometry(1, 72, 0, Math.PI * 2); geo.rotateX(-Math.PI / 2); const P = geo.attributes.position;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i); const rr = Math.hypot(x, z); if (rr < 1e-6) continue; const a = Math.atan2(x, z);
    const corner = Math.pow(Math.max(0, Math.cos(3 * a)), 6); const rad = R * (0.78 + 0.26 * corner); const k = rr; const rx = x / rr * rad * k, rz = z / rr * rad * k;
    const y = (k > 0.5 ? Math.pow((k - 0.5) / 0.5, 1.6) : 0) * 0.11 * (1 - 0.85 * corner); P.setXYZ(i, rx, y, rz); }
  geo.computeVertexNormals(); const brim = new THREE.Mesh(geo, m); G.add(brim);
  const trim = std('#d8c070', { metalness: 0.4, roughness: 0.5 });
  const cock = new THREE.Mesh(new THREE.CircleGeometry(0.026, 12), std('#f4f2ec')); cock.position.set(0.1, 0.07, 0.07); cock.rotation.y = 1.0; G.add(cock);
  G.userData.trim = trim; return shad(G); }
// tóc giả: cuộn ngang hai bên tai + đuôi tóc sau gáy buộc nơ đen
export function wigCurls(c = '#ecebe6') { const G = new THREE.Group(); const m = std(c, { roughness: 0.95 });
  for (const sg of [-1, 1]) for (let k = 0; k < 2; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.022, 8, 14), m); r.rotation.y = Math.PI / 2; r.position.set(sg * 0.1, -0.035 - k * 0.045, -0.02); r.scale.setScalar(0.78); G.add(r); }
  const q = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 4, 10), m); q.position.set(0, -0.12, -0.12); q.rotation.x = 0.25; G.add(q);
  const bow = std('#111111'); for (const sg of [-1, 1]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), bow); b.scale.set(1, 0.6, 0.35); b.position.set(sg * 0.035, -0.07, -0.12); G.add(b); }
  return shad(G); }
export function quill() { const G = new THREE.Group(); const f = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.32, 8, 1, true), std('#f6f4ee', { side: THREE.DoubleSide, roughness: 0.95 })); f.scale.z = 0.25; f.position.y = 0.16; G.add(f);
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.36, 5), std('#d8d0c0')); s.position.y = 0.12; G.add(s); return shad(G); }
// cuộn giấy da: mở 0..1 (0 = cuộn tròn, 1 = trải ra), chữ viết tay giả (không phải văn bản thật)
export function scroll(text = 'All men are\ncreated equal') { const G = new THREE.Group(); const paper = std('#efe2bf', { roughness: 0.9, side: THREE.DoubleSide });
  const tex = ctex(512, 640, (g, W, H) => { g.fillStyle = '#efe2bf'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(120,80,30,0.12)'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * W, Math.random() * H, 30, 2);
    g.fillStyle = '#2a1a0a'; g.textAlign = 'center'; g.font = 'italic 700 54px Georgia, serif'; text.split('\n').forEach((l, i) => g.fillText(l, W / 2, 140 + i * 70, W - 40));
    g.font = 'italic 26px Georgia, serif'; g.fillStyle = 'rgba(42,26,10,0.55)'; for (let i = 0; i < 9; i++) { let x = 40; while (x < W - 60) { const w = 20 + Math.random() * 50; g.fillRect(x, 330 + i * 30, w, 3); x += w + 10; } } });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide })); G.add(sheet);
  const rolls = [-1, 1].map((sg) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.46, 12), paper); r.rotation.z = Math.PI / 2; r.position.y = sg * 0.27; G.add(r); return r; });
  G.userData.open = (k) => { sheet.scale.y = Math.max(0.02, k); rolls[0].position.y = -0.27 * k; rolls[1].position.y = 0.27 * k; };
  return shad(G); }
// Chuông Tự do (mô hình đơn giản, có vết nứt dọc): crack 0..1 hiện vết nứt
export function libertyBell(scale = 1) { const G = new THREE.Group(); const m = std('#6a5a3a', { metalness: 0.75, roughness: 0.42 });
  const prof = [[0.0, 1.12], [0.16, 1.12], [0.22, 1.06], [0.26, 0.95], [0.3, 0.75], [0.36, 0.5], [0.45, 0.25], [0.56, 0.08], [0.62, 0.0], [0.58, -0.02]].map(([x, y]) => new THREE.Vector2(x, y));
  const bell = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), std('#6a5a3a', { metalness: 0.75, roughness: 0.42, side: THREE.DoubleSide })); G.add(bell);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 8, 40), m); lip.rotation.x = Math.PI / 2; lip.position.y = 0.01; G.add(lip);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.02, 6, 32), m); band.rotation.x = Math.PI / 2; band.position.y = 0.8; G.add(band);
  const yoke = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.24), std('#4a2e18', { roughness: 0.8 })); yoke.position.y = 1.3; G.add(yoke);
  const clap = new THREE.Group(); const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), m); cr.position.y = -0.45; clap.add(cr); const cb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), m); cb.position.y = -0.9; clap.add(cb); clap.position.y = 1.05; G.add(clap);
  // vết nứt: dải đen mảnh zig-zag trên mặt trước
  const pts = []; for (let i = 0; i <= 10; i++) { const y = 0.08 + i * 0.075; const r = 0.6 - (y / 1.12) * 0.34 + 0.012; pts.push(V(Math.sin(0.12 + (i % 2 ? 0.035 : -0.02)) * r, y, Math.cos(0.12 + (i % 2 ? 0.035 : -0.02)) * r)); }
  const crack = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.012, 5), std('#0a0806', { roughness: 1 })); G.add(crack);
  G.userData = { clap, crack, setCrack: (k) => { crack.visible = k > 0.01; crack.scale.set(1, Math.max(0.01, k), 1); } };
  G.scale.setScalar(scale); return shad(G); }

function dressKit(ch) { const B = ch.bones; ch.root.position.set(0, 0, 0); ch.root.rotation.set(0, 0, 0); ch.root.scale.setScalar(1); ch.root.updateMatrixWorld(true);
  const W = (n) => B[n].getWorldPosition(new THREE.Vector3());
  const put = (bone, m, p, rot) => { m.position.copy(p); if (rot) m.rotation.set(...rot); ch.root.add(m); m.updateMatrixWorld(true); B[bone].attach(m); m.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } }); return m; };
  return { W, put, B }; }
// mặc đồ 1776 lên nhân vật (gọi sau makeCharacter + resetPose)
export function dress1776(ch, i = 0) { const { W, put, B } = dressKit(ch);
  const coat = std(COATS[i % 5], { roughness: 0.8, side: THREE.DoubleSide }), vest = std(VESTS[i % 5], { roughness: 0.75 }), white = std('#f6f4ee', { roughness: 0.9 }), btn = std('#d8c070', { metalness: 0.7, roughness: 0.3 });
  // mũ + tóc giả: dựng theo hướng thế giới quanh tâm đầu
  const hb = W('Head'), hc = B.Head.localToWorld(V(0, 0.1, 0)); const k = hc.distanceTo(hb) / 0.1;
  if (i % 5 !== 3) { const hat = tricorn(['#151515', '#1a1a2a', '#2a1a10', '#151515', '#222'][i % 5]); hat.scale.setScalar(k); put('Head', hat, hc.clone().add(V(0, 0.07 * k, -0.005))); }
  const wig = wigCurls(); wig.scale.setScalar(k); put('Head', wig, hc.clone());
  // khăn cổ trắng (cravat) xếp nếp trước ngực
  const n = W('neck_01'); const cr = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 10), white); cr.scale.set(1, 1, 0.45); put('neck_01', cr, V(n.x, n.y - 0.1, n.z + 0.085), [Math.PI, 0, 0]);
  const cl2 = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.02, 6, 16), white); put('neck_01', cl2, V(n.x, n.y - 0.02, n.z + 0.01), [Math.PI / 2 - 0.25, 0, 0]);
  // gi-lê dài trước ngực (tấm cong) + hàng cúc
  const s2 = W('spine_02'), s3 = W('spine_03'), pv = W('pelvis'); const vh = s3.y - pv.y + 0.12;
  const bel = i % 5 === 1 || i % 5 === 3; const vr = bel ? 0.235 : 0.205; const vz = bel ? 0.035 : 0.015;
  const vg = new THREE.CylinderGeometry(vr, vr + (bel ? 0.03 : 0.01), vh, 18, 1, true, -0.7, 1.4); const vm = new THREE.Mesh(vg, vest); vm.scale.z = 0.9; put('spine_02', vm, V(s2.x, (s3.y + pv.y) / 2 + 0.02, s2.z + vz));
  for (let b = 0; b < 6; b++) put('spine_02', new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 5), btn), V(s2.x, s3.y + 0.04 - b * (vh / 6.5), s2.z + vz + vr * 0.9 + 0.004));
  // vạt áo khoác dài: phần váy xẻ sau hông tới gối (che hông + đùi, hở trước)
  const kn = W('calf_l'); const sk = pv.y + 0.04 - (kn.y + 0.1);
  for (const [t0, tl] of [[Math.PI * 0.42, Math.PI * 0.54], [Math.PI * 1.04, Math.PI * 0.54]]) { const sg = new THREE.CylinderGeometry(0.2, 0.3, sk, 12, 1, true, t0, tl);
    const tail = new THREE.Mesh(sg, coat); tail.scale.z = 0.85; put('pelvis', tail, V(pv.x, pv.y + 0.04 - sk / 2, pv.z - 0.01)); }
  // ve áo + cổ tay áo lật màu gi-lê
  for (const sd of ['l', 'r']) { const h = W('hand_' + sd); const cf = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.08, 12, 1, true), std(VESTS[(i + 2) % 5], { side: THREE.DoubleSide })); put('lowerarm_' + sd, cf, B['lowerarm_' + sd].localToWorld(V(0, 0, 0)).lerp(h, 0.82)); }
  // khoá giày bạc
  for (const sd of ['l', 'r']) { const f = W('foot_' + sd); put('foot_' + sd, new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.012), std('#d8dce4', { metalness: 0.85, roughness: 0.25 })), f.clone().add(V(0, -0.03, 0.08))); }
  return ch; }
