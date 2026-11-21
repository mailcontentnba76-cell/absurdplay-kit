// Chạm đất chính xác theo ĐỈNH LƯỚI đã skinning (không theo xương): sửa lỗi nhân vật / thú / đồ vật bị lún xuống nền.
// minY(obj): điểm thấp nhất (thế giới) của mọi mesh trong obj (lấy mẫu đỉnh, có tính skinning + morph).
// snapGround(objs, gy=0, o): với mỗi obj đang hiện, nếu điểm thấp nhất nằm dưới mặt đất (gy) trong khoảng `band`,
//   nâng obj.position.y lên cho chạm đúng mặt đất. Vật đang bay (min > gy) giữ nguyên. obj.userData.lun = true → cố ý lún, bỏ qua.
// checkGround(objs, gy): trả danh sách vật đang lún (QA).
import * as THREE from 'three';
const _v = new THREE.Vector3();
const CACHE = new WeakMap();
function sampleIdx(mesh, maxN) {
  let c = CACHE.get(mesh); if (c && c.n === maxN) return c.idx;
  const pos = mesh.geometry.attributes.position; const N = pos.count; const idx = [];
  if (maxN >= N) { for (let i = 0; i < N; i++) idx.push(i); CACHE.set(mesh, { n: maxN, idx }); return idx; }
  // ưu tiên đỉnh thấp ở tư thế nghỉ (bàn chân, đế giày) + lấy mẫu đều toàn lưới
  const ys = []; for (let i = 0; i < N; i++) ys.push([pos.getY(i), i]); ys.sort((a, b) => a[0] - b[0]);
  const low = Math.min(N, Math.floor(maxN * 0.6)); for (let k = 0; k < low; k++) idx.push(ys[k][1]);
  const step = Math.max(1, Math.floor(N / (maxN - low))); for (let i = 0; i < N; i += step) idx.push(i);
  c = { n: maxN, idx }; CACHE.set(mesh, c); return idx;
}
export function minY(obj, maxN = 600) {
  let m = Infinity; obj.updateMatrixWorld(true);
  obj.traverse((o) => {
    if (!o.isMesh || !o.visible || !o.geometry?.attributes?.position) return;
    let p = o; while (p) { if (!p.visible) return; p = p.parent; if (p === obj.parent) break; }
    if (o.isInstancedMesh) return;
    for (const i of sampleIdx(o, maxN)) { if (o.isSkinnedMesh) o.getVertexPosition(i, _v); else _v.fromBufferAttribute(o.geometry.attributes.position, i); _v.applyMatrix4(o.matrixWorld); if (_v.y < m) m = _v.y; }
  });
  return m;
}
export function snapGround(objs, gy = 0, o = {}) {
  const band = o.band ?? 0.6, eps = o.eps ?? 0.004;
  for (const ob of objs) { if (!ob || !ob.visible || ob.userData.lun) continue; const m = minY(ob, o.maxN);
    if (m < gy - eps && m > gy - band) { ob.position.y += gy - m; ob.updateMatrixWorld(true); } }
}
export function checkGround(objs, gy = 0, tol = 0.01) {
  const bad = []; for (const ob of objs) { if (!ob || !ob.visible || ob.userData.lun) continue; const m = minY(ob, 1e6); if (m < gy - tol) bad.push([ob.name || ob.uuid.slice(0, 6), +(m - gy).toFixed(3)]); } return bad;
}
