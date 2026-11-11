// E12 (NBA): EM BÉ hoạt hình dựng bằng code — đầu to, mắt hoạt hình to (như nhân vật chính), áo liền quần đội "BABIES" có số, tã, núm vú giả.
// Tư thế: 'sit' (ngồi bệt), 'crawl' (bò), 'stand' (đứng chập chững), 'throw' (ném bóng qua đầu, k 0..1). Khóc: c.cry 0..1 (miệng há + nước mắt).
// Trục cục bộ: mặt trước +z, lên +y. Cao đứng ~0,72 m × o.s.
import * as THREE from 'three';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o));
const ctex = (w, h, draw) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; };
const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const SKINS = ['#f6d3b5', '#e8b98f', '#d6a47a', '#c99266', '#f1c9a5'], HAIRS = ['#3a2516', '#8a5a2a', '#e0b860', '#1b120c', '#6b3a1a'];
const numCache = {};
function onesieTex(col, num, txt) { const k = col + num + txt; return numCache[k] ??= ctex(256, 256, (g, W, H) => { g.fillStyle = col; g.fillRect(0, 0, W, H); g.fillStyle = '#0b2a5b'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '900 40px Anton, sans-serif'; g.fillText(txt, W / 2, 62); g.font = '900 110px Anton, sans-serif'; g.lineWidth = 8; g.strokeStyle = '#ffffff'; g.strokeText(String(num), W / 2, 160); g.fillText(String(num), W / 2, 160); }); }
export function makeBaby(o = {}) {
  const r = rnd((o.seed ?? 1) * 131 + 17); const S = o.s ?? 1;
  const skinC = o.skin || SKINS[Math.floor(r() * SKINS.length)]; const skin = std(skinC, { roughness: 0.6 });
  const onC = o.onesie || ['#ffe27a', '#ffd04a', '#fff0a8'][Math.floor(r() * 3)]; const onesie = std(onC, { roughness: 0.85 });
  const front = new THREE.MeshStandardMaterial({ map: onesieTex(onC, o.number ?? Math.floor(r() * 50) + 1, 'BABIES'), roughness: 0.85 });
  const diaper = std('#ffffff', { roughness: 0.9 });
  const root = new THREE.Group(); const B = new THREE.Group(); root.add(B);
  // thân (áo liền quần) + mặt trước in chữ/số
  const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), onesie); torso.scale.set(0.13, 0.16, 0.11); torso.position.y = 0.36; B.add(torso);
  const chest = new THREE.Mesh(new THREE.CircleGeometry(0.085, 20), front); chest.position.set(0, 0.37, 0.108); B.add(chest);
  const dp = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), diaper); dp.scale.set(0.135, 0.085, 0.12); dp.position.y = 0.23; B.add(dp);
  // đầu to + tóc tơ + má hồng + mắt hoạt hình + miệng + núm vú giả
  const neck = new THREE.Group(); neck.position.y = 0.5; B.add(neck);
  const head = new THREE.Group(); head.position.y = 0.13; neck.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 22, 16), skin); skull.scale.set(1, 0.97, 0.95); head.add(skull);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.152, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.32), std(o.hair || HAIRS[Math.floor(r() * HAIRS.length)], { roughness: 0.9 })); hair.position.y = 0.005; head.add(hair);
  const curl = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 6, 12, Math.PI * 1.5), hair.material); curl.position.set(0, 0.16, 0.03); curl.rotation.y = Math.PI / 2; head.add(curl);
  for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), skin); ear.scale.set(0.5, 1, 0.8); ear.position.set(s * 0.148, 0, 0); head.add(ear);
    const ck = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), std('#f29a9a', { roughness: 0.8, transparent: true, opacity: 0.55 })); ck.scale.set(1, 0.7, 0.3); ck.position.set(s * 0.085, -0.04, 0.125); head.add(ck); }
  const eyes = [-1, 1].map((s) => { const E = new THREE.Group(); E.position.set(s * 0.055, 0.015, 0.128); head.add(E);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.036, 14, 10), std('#ffffff', { roughness: 0.3 })); w.scale.z = 0.6; E.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), std('#1b130c', { roughness: 0.2 })); p.position.z = 0.018; E.add(p);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' })); hl.position.set(0.007, 0.008, 0.035); E.add(hl);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), skin); lid.rotation.x = -1.5; E.add(lid);
    const tear = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), std('#7ec8ff', { roughness: 0.1, transparent: true, opacity: 0.85 })); tear.scale.y = 1.6; tear.visible = false; head.add(tear);
    return { E, p, lid, s, tear }; });
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), std('#7a2a2a', { roughness: 0.6 })); mouth.scale.set(1, 0.25, 0.4); mouth.position.set(0, -0.065, 0.13); head.add(mouth);
  const paci = new THREE.Group(); { const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 16), std(o.paciColor || '#5ab0ff', { roughness: 0.4 })); sh.rotation.x = Math.PI / 2; paci.add(sh); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 14), sh.material); rg.position.z = 0.014; paci.add(rg); }
  paci.position.set(0, -0.065, 0.15); head.add(paci); paci.visible = !!o.pacifier;
  // tay + chân mũm mĩm (2 đốt), bàn tay/bàn chân tròn
  const limb = (r0, len, mat) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.CapsuleGeometry(r0, len, 4, 10), mat); m.position.y = -len / 2 - r0 * 0.4; g.add(m); return g; };
  const arms = [-1, 1].map((s) => { const sh = new THREE.Group(); sh.position.set(s * 0.13, 0.44, 0); B.add(sh); const up = limb(0.04, 0.07, onesie); sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.13; sh.add(el); const lo = limb(0.036, 0.06, skin); el.add(lo); const hd = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), skin); hd.position.y = -0.13; el.add(hd); return { sh, el, hd, s }; });
  const legs = [-1, 1].map((s) => { const hp = new THREE.Group(); hp.position.set(s * 0.07, 0.2, 0.01); B.add(hp); const up = limb(0.05, 0.06, onesie); hp.add(up);
    const kn = new THREE.Group(); kn.position.y = -0.13; hp.add(kn); const lo = limb(0.045, 0.05, onesie); kn.add(lo); const ft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), skin); ft.scale.set(0.8, 0.6, 1.3); ft.position.set(0, -0.12, 0.03); kn.add(ft); return { hp, kn, s }; });
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.scale.setScalar(S);
  const lerp = (a, b, k) => a + (b - a) * k; const sd = (o.seed ?? 1) * 1.37;
  function update(t, c = {}) {
    const pose = c.pose || 'sit'; const cry = c.cry ?? 0; const tk = c.throwK ?? 0;
    B.position.set(0, 0, 0); B.rotation.set(0, 0, 0); neck.rotation.set(0, 0, 0);
    let aL = [0, 0, 0], aR = [0, 0, 0], eL = 0, eR = 0;
    if (pose === 'sit' || pose === 'throw') { B.position.y = -0.15; legs.forEach((L) => { L.hp.rotation.set(-1.45, 0, L.s * -0.25); L.kn.rotation.set(0.15, 0, 0); });
      const bob = Math.sin(t * 2.2 + sd) * 0.05; aL = [-0.3 + bob, 0, 0.35]; aR = [-0.3 - bob, 0, -0.35]; eL = eR = -0.6;
      B.rotation.z = Math.sin(t * 1.3 + sd) * 0.05; }
    if (pose === 'crawl') { const ph = (c.walk ?? t * 1.2) / 0.22 * Math.PI; B.rotation.x = 1.25; B.position.set(0, -0.06, 0.12); neck.rotation.x = -1.0;
      legs.forEach((L, i) => { const p = ph + i * Math.PI; L.hp.rotation.set(-0.35 + Math.sin(p) * 0.35, 0, L.s * -0.12); L.kn.rotation.set(1.6, 0, 0); });
      aL = [-1.25 + Math.sin(ph + Math.PI) * 0.35, 0, 0.12]; aR = [-1.25 + Math.sin(ph) * 0.35, 0, -0.12]; eL = eR = 0; B.position.y += Math.abs(Math.sin(ph)) * 0.015; }
    if (pose === 'stand') { const w = Math.sin(t * 3 + sd); B.rotation.z = w * 0.12; B.position.y = 0.0; legs.forEach((L) => { L.hp.rotation.set(0, 0, L.s * 0.18); L.kn.rotation.set(0, 0, 0); });
      aL = [-0.2, 0, 0.9 + w * 0.2]; aR = [-0.2, 0, -0.9 + w * 0.2]; eL = eR = -0.3; }
    if (pose === 'throw') { const up = Math.sin(Math.min(1, tk) * Math.PI * 0.5); aL = [-2.9 * up + (1 - up) * -0.3, 0, 0.2]; aR = [-2.9 * up + (1 - up) * -0.3, 0, -0.2]; eL = eR = -0.4 * (1 - up) - 0.2;
      if (tk > 0.6) { const f = (tk - 0.6) / 0.4; aL[0] = -2.9 + f * 1.6; aR[0] = -2.9 + f * 1.6; } }
    if (c.armsUp) { aL = [-2.7, 0, 0.3]; aR = [-2.7, 0, -0.3]; eL = eR = -0.2; }
    arms[0].sh.rotation.set(...aL); arms[1].sh.rotation.set(...aR); arms[0].el.rotation.x = eL; arms[1].el.rotation.x = eR;
    // khóc: lắc đầu, miệng há tròn, nước mắt rơi
    neck.rotation.z += cry * Math.sin(t * 14) * 0.08; neck.rotation.x += cry * -0.15;
    mouth.scale.set(1 + cry * 0.4, 0.25 + cry * 0.9 + (c.mouth ?? 0), 0.4);
    eyes.forEach((e) => { const lk = c.look || [0, 0]; e.p.position.set(lk[0] * 0.01, lk[1] * 0.01, 0.018); const blink = ((t * 0.27 + sd) % 1) < 0.035 ? 1 : 0; e.lid.rotation.x = -1.5 + Math.max(blink, cry * 0.75) * 1.5;
      e.tear.visible = cry > 0.3; if (e.tear.visible) { const f = (t * 1.6 + e.s * 0.3) % 1; e.tear.position.set(e.s * 0.07, -0.02 - f * 0.12, 0.13); } });
    paci.visible = !!(c.pacifier ?? o.pacifier) && cry < 0.3;
  }
  update(0, {});
  return { root, update, hand: arms[1].hd, handL: arms[0].hd, head, S };
}
// núm vú giả rời (rơi trên sàn) — đạo cụ cho cú trượt chân
export function pacifierProp(color = '#5ab0ff') { const g = new THREE.Group(); const m = std(color, { roughness: 0.4 });
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.016, 18), m); sh.rotation.x = Math.PI / 2; g.add(sh); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 14), m); rg.position.z = 0.02; g.add(rg);
  const nip = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.03, 4, 8), std('#f4e6c8', { roughness: 0.5, transparent: true, opacity: 0.9 })); nip.rotation.x = Math.PI / 2; nip.position.z = -0.03; g.add(nip);
  g.traverse((x) => { if (x.isMesh) x.castShadow = true; }); return g; }
