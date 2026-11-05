// Nạp nhân vật MakeHuman đã "nướng" bằng cong_cu/mh_bake.py (char.json + char.bin + textures/).
// Khung xương MakeHuman mặc định (163 xương + nút khớp ____head). Trả về {root, bones, meshes, height}.
import * as THREE from 'three';
const TL = new THREE.TextureLoader();
const tcache = {};
function tex(url, srgb = true) {
  if (!tcache[url]) { const t = TL.load(url); t.flipY = true; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; tcache[url] = t; }
  return tcache[url];
}
export async function loadMH(dir, opt = {}) {
  const meta = await (await fetch(dir + '/char.json')).json();
  const buf = await (await fetch(dir + '/char.bin')).arrayBuffer();
  const arr = ([o, n, t]) => t === 'float32' ? new Float32Array(buf, o, n) : t === 'uint16' ? new Uint16Array(buf, o, n) : new Uint32Array(buf, o, n);
  const root = new THREE.Group(); root.name = meta.name;
  const bones = meta.bones.map((b) => { const B = new THREE.Bone(); B.name = b.name; return B; });
  meta.bones.forEach((b, i) => {
    const w = new THREE.Vector3(...b.world);
    if (b.parent >= 0) { bones[b.parent].add(bones[i]); bones[i].position.copy(w.sub(new THREE.Vector3(...meta.bones[b.parent].world))); }
    else { root.add(bones[i]); bones[i].position.copy(w); }
  });
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);
  const meshes = {};
  for (const m of meta.meshes) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr(m.pos), 3));
    if (m.nrm) g.setAttribute('normal', new THREE.BufferAttribute(arr(m.nrm), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(arr(m.uv), 2));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(arr(m.si), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(arr(m.sw), 4));
    g.setIndex(new THREE.BufferAttribute(arr(m.idx), 1));
    if (!m.nrm) g.computeVertexNormals();
    const P = { roughness: m.kind === 'body' ? 0.55 : m.kind === 'eyes' ? 0.15 : 0.85, metalness: 0, side: m.kind === 'clothes' || m.alpha ? THREE.DoubleSide : THREE.FrontSide };
    if (m.map) P.map = tex(dir + '/' + m.map);
    if (m.normalMap) { P.normalMap = tex(dir + '/' + m.normalMap, false); P.normalScale = new THREE.Vector2(1, 1); }
    if (m.alpha) { P.alphaTest = 0.45; P.transparent = false; }
    if (opt.tint && opt.tint[m.kind]) P.color = new THREE.Color(opt.tint[m.kind]);
    const mat = new THREE.MeshStandardMaterial(P);
    const sm = new THREE.SkinnedMesh(g, mat); sm.name = m.name; sm.castShadow = m.kind !== 'eyelashes' && m.kind !== 'eyebrows'; sm.receiveShadow = true; sm.frustumCulled = false;
    sm.bind(skeleton, new THREE.Matrix4());
    if (m.kind === 'hair' || m.kind === 'eyebrows' || m.kind === 'eyelashes') sm.renderOrder = 2;
    root.add(sm); meshes[m.name] = sm;
  }
  const byName = Object.fromEntries(bones.map((b) => [b.name, b]));
  const rest = Object.fromEntries(bones.map((b) => [b.name, b.quaternion.clone()]));
  if (opt.heightM) root.scale.setScalar(opt.heightM / meta.height);
  return { root, bones: byName, skeleton, meshes, height: meta.height, rest, meta };
}
