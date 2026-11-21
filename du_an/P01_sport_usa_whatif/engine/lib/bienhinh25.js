// Tập 25 — hiệu ứng biến hình người → mèo lớn: khói cuộn (không chớp trắng), vòng năng lượng xoáy màu đội, mảnh áo rách to bay ra.
// draw(list): list = [{type:'smoke'|'aura'|'cloth', x,y,z, k (0..1 tiến trình), seed, colors:[...], s}]
import * as THREE from 'three';
export function transformFX(scene, o = {}) {
  const NS = o.smoke ?? 90, NA = o.aura ?? 160, NC = o.cloth ?? 48;
  const G = new THREE.Group(); scene.add(G);
  // khói: từng khối cầu riêng để có độ trong suốt riêng
  const sGeo = new THREE.IcosahedronGeometry(1, 2);
  const smoke = [...Array(NS)].map(() => { const m = new THREE.Mesh(sGeo, new THREE.MeshStandardMaterial({ color: '#8a7f78', roughness: 1, transparent: true, opacity: 0.8, depthWrite: false })); m.visible = false; G.add(m); return m; });
  // aura: hạt sáng dạng thoi (không cộng sáng quá mức)
  const aGeo = new THREE.OctahedronGeometry(0.045, 0);
  const aura = new THREE.InstancedMesh(aGeo, new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), NA); aura.frustumCulled = false; G.add(aura);
  // mảnh áo: tấm vải mép răng cưa
  const sh = new THREE.Shape(); const R = (i) => 0.75 + 0.25 * Math.sin(i * 2.7) ; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const r = R(i) * (i % 2 ? 0.16 : 0.12); i ? sh.lineTo(Math.cos(a) * r * 1.3, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r * 1.3, Math.sin(a) * r); }
  const cGeo = new THREE.ShapeGeometry(sh);
  const cloth = new THREE.InstancedMesh(cGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide, roughness: 0.85 }), NC); cloth.frustumCulled = false; cloth.castShadow = true; G.add(cloth);
  const D = new THREE.Object3D(), col = new THREE.Color();
  return { draw(list) {
    let si = 0, ai = 0, ci = 0;
    for (const b of list) { const k = b.k; if (k <= 0 || k >= 1) continue; const sd = b.seed || 0, s = b.s || 1;
      if (b.type === 'smoke') { const n = 16; for (let i = 0; i < n && si < NS; i++, si++) { const m = smoke[si]; const a = i * 2.399 + sd, r = (0.25 + 0.55 * Math.sqrt(k)) * s * (0.7 + (i % 3) * 0.2);
          m.visible = true; m.position.set(b.x + Math.cos(a) * r, b.y - 0.6 * s + (i % 4) * 0.35 * s + k * 0.5 * s, b.z + Math.sin(a) * r);
          const sc = s * (0.28 + 0.5 * Math.sqrt(k)) * (0.8 + (i % 5) * 0.1); m.scale.setScalar(sc);
          m.material.opacity = 0.72 * Math.min(1, k * 6) * Math.pow(1 - k, 1.4); m.material.color.set(b.colors ? b.colors[i % b.colors.length] : '#8a7f78'); } }
      else if (b.type === 'aura') { const n = 60; for (let i = 0; i < n && ai < NA; i++, ai++) { const f = (i / n + k * 0.9) % 1; const a = i * 0.61 + k * 9 + sd; const r = (0.55 - 0.25 * f) * s;
          D.position.set(b.x + Math.cos(a) * r, b.y - 0.9 * s + f * 2.2 * s, b.z + Math.sin(a) * r); D.rotation.set(a, a * 0.7, 0);
          D.scale.setScalar(Math.sin(Math.PI * f) * Math.min(1, k * 4) * (1 - Math.pow(k, 3)) * (0.7 + (i % 3) * 0.3)); D.updateMatrix(); aura.setMatrixAt(ai, D.matrix); aura.setColorAt(ai, col.set(b.colors[i % b.colors.length])); } }
      else if (b.type === 'cloth') { const n = b.n || 10; for (let i = 0; i < n && ci < NC; i++, ci++) { const a = i * 2.399 + sd, tt = k * 1.2; const side = i % 2 ? 1 : -1;
          // xé từ ngực: văng ra hai bên + lên rồi rơi, lật vòng
          const dir = b.ry || 0; const lx = side * (1.2 + (i % 4) * 0.5) * tt, lz = (Math.sin(a) * 0.9) * tt; const cx = Math.cos(dir), sx = Math.sin(dir);
          D.position.set(b.x + lx * cx + lz * sx, Math.max(0.02, b.y + (2.2 + (i % 3) * 0.6) * tt - 4.9 * tt * tt), b.z - lx * sx + lz * cx);
          D.rotation.set(tt * (6 + i % 3) + a, tt * 4 + a, tt * 3 * side); D.scale.setScalar(s * (1.2 + (i % 3) * 0.35)); D.updateMatrix(); cloth.setMatrixAt(ci, D.matrix); cloth.setColorAt(ci, col.set(b.colors[i % b.colors.length])); } } }
    for (let i = si; i < NS; i++) smoke[i].visible = false;
    aura.count = ai; aura.instanceMatrix.needsUpdate = true; if (aura.instanceColor) aura.instanceColor.needsUpdate = true;
    cloth.count = ci; cloth.instanceMatrix.needsUpdate = true; if (cloth.instanceColor) cloth.instanceColor.needsUpdate = true;
  }, G, smoke, aura, cloth };
}
