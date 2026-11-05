"""Dựng nhân vật MakeHuman (dữ liệu npm makehuman-data 0.0.2) thành gói đọc được bằng three.js r170.

Vì sao: 14 video mẫu P02 dùng nhân vật có quần áo trùng khớp bộ quần áo mặc định MakeHuman
(male_casualsuit06 áo thun trắng logo nhỏ + jean sáng, male_casualsuit01 sơ mi xanh than + jean đậm,
female_casualsuit01 áo xanh logo người cam, male_worksuit01 quần yếm) — xem PHAN_TICH_MAU/NHAN_VAT.md.

Dùng:  python3 -I mh_bake.py <thư mục makehuman-data/public/data> <spec.json> <thư mục ra>
spec.json: {"name":"chinh","gender":1,"age":"young","muscle":0.5,"weight":0.5,"height":0.5,
            "race":{"caucasian":1},"skin":"young_caucasian_male/young_caucasian_male.json",
            "proxies":["clothes/male_casualsuit06/male_casualsuit06.json","hair/short02/short02.json",
                       "eyebrows/eyebrow001/eyebrow001.json","eyelashes/Eyelashes01/Eyelashes01.json",
                       "eyes/HighPolyEyes/HighPolyEyes.json","clothes/shoes01/shoes01.json"],
            "eye_texture":"brown"}
Ra: <ra>/<name>/char.json + char.bin + textures/  (toạ độ mét, chân ở y=0).
"""
import json, os, sys, shutil, struct
import numpy as np

DATA, SPEC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
spec = json.load(open(SPEC))
PKG = os.path.dirname(os.path.dirname(DATA))  # .../package
base = json.load(open(f'{DATA}/models/human_full_size.json'))
NV = len(base['vertices']) // 3
V = np.array(base['vertices'], np.float64).reshape(-1, 3)

# ---------- 1. biến dạng cơ thể (macro targets) ----------
tl = json.load(open(f'{PKG}/src/json/targets/target-list.json'))['targets']
paths = sorted(tl.keys())
TB = np.memmap(f'{DATA}/targets/targets.bin', dtype=np.int16, mode='r').reshape(len(paths), NV * 3)
pidx = {p.split('/')[-1][:-7]: i for i, p in enumerate(paths)}  # tên không đuôi .target

def tri(x):  # min/average/max theo kiểu MakeHuman
    return {'min': max(0, 1 - 2 * x), 'average': 1 - abs(2 * x - 1), 'max': max(0, 2 * x - 1)}
def add(name, w):
    global V
    if w <= 1e-6: return
    if name not in pidx: print('thiếu target', name); return
    V = V + w * TB[pidx[name]].reshape(-1, 3).astype(np.float64) * 1e-3

g = float(spec.get('gender', 1)); gw = {'male': g, 'female': 1 - g}
age = spec.get('age', 'young'); aw = {age: 1.0}
mw = tri(float(spec.get('muscle', .5))); ww = tri(float(spec.get('weight', .5))); hw = float(spec.get('height', .5))
for G, a in gw.items():
    for A, b in aw.items():
        for Mk, c in mw.items():
            for Wk, d in ww.items():
                add(f'universal-{G}-{A}-{Mk}muscle-{Wk}weight', a * b * c * d)
                if hw > .5: add(f'{G}-{A}-{Mk}muscle-{Wk}weight-maxheight', a * b * c * d * (hw - .5) * 2)
                if hw < .5: add(f'{G}-{A}-{Mk}muscle-{Wk}weight-minheight', a * b * c * d * (.5 - hw) * 2)
                pr = float(spec.get('proportions', .5))
                if A != 'baby': add(f'{G}-{A}-{Mk}muscle-{Wk}weight-idealproportions', a * b * c * d * pr)
        race = spec.get('race', {'caucasian': 1})
        tot = sum(race.values())
        for R, r in race.items(): add(f'{R}-{G}-{A}', a * aw[A] * r / tot)
for name, w in spec.get('targets', {}).items(): add(name, w)

# ---------- 2. đọc mặt (định dạng three.js JSON 3.1) ----------
def parse_faces(d):
    f = d['faces']; nuv = len(d['uvs']); i = 0; out = []
    while i < len(f):
        t = f[i]; i += 1; quad = t & 1; nv = 4 if quad else 3
        vi = f[i:i + nv]; i += nv
        mat = 0
        if t & 2: mat = f[i]; i += 1
        if t & 4: i += nuv
        uvi = None
        if t & 8:
            uvi = f[i:i + nv]; i += nv * nuv
        if t & 16: i += 1
        if t & 32: i += nv
        if t & 64: i += 1
        if t & 128: i += nv
        out.append((vi, uvi, mat))
    return out

def build(d, pos, keep=lambda vi, mat: True):
    """tách đỉnh theo (đỉnh, uv) → mảng phẳng"""
    uv = np.array(d['uvs'][0], np.float64).reshape(-1, 2)
    k_ = d['influencesPerVertex']
    si = np.zeros((len(pos), 4), np.int64); sw = np.zeros((len(pos), 4))
    a_ = np.array(d['skinIndices']).reshape(-1, k_)[:, :4]; b_ = np.array(d['skinWeights'], np.float64).reshape(-1, k_)[:, :4]
    si[:len(a_), :a_.shape[1]] = a_; sw[:len(b_), :b_.shape[1]] = b_
    sw[sw.sum(1) == 0, 0] = 1
    key = {}; P = []; U = []; I = []; W = []; IDX = []; NN = []
    faces = parse_faces(d)
    vn = np.zeros((len(pos), 3))
    for vi, uvi, mat in faces:  # pháp tuyến mượt theo đỉnh gốc (không gãy ở đường may UV)
        a, b, c = pos[vi[0]], pos[vi[1]], pos[vi[2]]
        n = np.cross(b - a, c - a)
        for v in vi: vn[v] += n
    vn /= np.maximum(np.linalg.norm(vn, axis=1, keepdims=True), 1e-12)
    for vi, uvi, mat in faces:
        if not keep(vi, mat): continue
        loc = []
        for k, v in enumerate(vi):
            u = uvi[k] if uvi is not None else 0
            kk = (v, u)
            if kk not in key:
                key[kk] = len(P); P.append(pos[v]); NN.append(vn[v]); U.append(uv[u]); I.append(si[v]); W.append(sw[v])
            loc.append(key[kk])
        if len(loc) == 4: IDX += [loc[0], loc[1], loc[2], loc[0], loc[2], loc[3]]
        else: IDX += loc
    W = np.array(W); W = W / np.maximum(W.sum(1, keepdims=True), 1e-9)
    return dict(pos=np.array(P, np.float32), nrm=np.array(NN, np.float32), uv=np.array(U, np.float32), si=np.array(I, np.uint16), sw=W.astype(np.float32), idx=np.array(IDX, np.uint32))

# ---------- 3. quần áo / tóc / mắt (proxy refit) ----------
proxies = []; delete = np.zeros(NV, bool)
PXOPT = {}
for p in spec.get('proxies', []):
    if isinstance(p, dict): PXOPT[p['p']] = p; p = p['p']
    d = json.load(open(f'{DATA}/proxies/{p}'))
    md = d['metadata']
    ref = np.array(json.loads(md['ref_vIdxs']) if isinstance(md['ref_vIdxs'], str) else md['ref_vIdxs'])
    w = np.array(json.loads(md['weights']) if isinstance(md['weights'], str) else md['weights'])
    off = np.array(json.loads(md['offsets']) if isinstance(md['offsets'], str) else md['offsets'])
    pos = (V[ref] * w[:, :, None]).sum(1) + off
    if 'deleteVerts' in md:
        dv = np.array(json.loads(md['deleteVerts']) if isinstance(md['deleteVerts'], str) else md['deleteVerts'], bool)
        if dv.size == NV: delete |= dv
    proxies.append((p, d, pos))

# ---------- 4. khung xương: vị trí khớp từ đỉnh đã biến dạng ----------
J = base['metadata']['joint_pos_idxs']
bones = base['bones']
def jpos(name):
    key = name if ('____head' in name or '____tail' in name) else name + '____tail'
    idx = J.get(key)
    return V[idx].mean(0) if idx else None
world = []
for i, b in enumerate(bones):
    p = jpos(b['name'])
    if p is None:  # dự phòng: cộng dồn pos gốc
        p = (world[b['parent']] if b['parent'] >= 0 else np.zeros(3)) + np.array(b['pos'])
    world.append(p)
world = np.array(world)

# ---------- 5. chuẩn hoá: mét, chân ở y=0 ----------
S = 0.1
bodyD = build(base, V, keep=lambda vi, mat: mat == 0 and not all(delete[v] for v in vi))
bodyAll = sorted({v for vi, uvi, mat in parse_faces(base) if mat == 0 for v in vi})
ymin = V[bodyAll, 1].min(); ymax = V[bodyAll, 1].max()
def norm(a): a = a.astype(np.float64) * S; a[:, 1] -= ymin * S; return a.astype(np.float32)
os.makedirs(f"{OUT}/{spec['name']}/textures", exist_ok=True)
binf = open(f"{OUT}/{spec['name']}/char.bin", 'wb'); off = 0
def put(arr):
    global off
    b = np.ascontiguousarray(arr).tobytes(); pad = (-len(b)) % 4
    binf.write(b + b'\0' * pad); o = off; off += len(b) + pad; return [o, arr.size, str(arr.dtype)]
def tex(src):
    if not src or not os.path.exists(src): return None
    dst = os.path.basename(src); shutil.copy(src, f"{OUT}/{spec['name']}/textures/{dst}"); return 'textures/' + dst
meshes = []
skin = json.load(open(f"{DATA}/skins/{spec['skin']}")) if spec.get('skin') else {}
skin_dir = os.path.dirname(f"{DATA}/skins/{spec.get('skin', '')}")
meshes.append(dict(name='body', kind='body', pos=put(norm(bodyD['pos'])), nrm=put(bodyD['nrm']), uv=put(bodyD['uv']), si=put(bodyD['si']), sw=put(bodyD['sw']), idx=put(bodyD['idx']),
                   map=tex(f"{skin_dir}/{skin.get('mapDiffuse', '')}")))
for p, d, pos in proxies:
    D = build(d, pos)
    pdir = os.path.dirname(f'{DATA}/proxies/{p}')
    mat = (d.get('materials') or [{}])[0]
    kind = p.split('/')[0]
    mp = None
    for k in ('mapDiffuse',):
        if mat.get(k): mp = f'{pdir}/{mat[k]}'
    if kind == 'eyes' and spec.get('eye_texture'):
        c = [f'{pdir}/textures/{spec["eye_texture"]}_eye.png', f'{pdir}/textures/{spec["eye_texture"]}.png']
        mp = next((x for x in c if os.path.exists(x)), mp)
    if not mp or not os.path.exists(mp):
        cands = [f for f in os.listdir(f'{pdir}/textures')] if os.path.isdir(f'{pdir}/textures') else []
        dif = [f for f in cands if 'diffuse' in f.lower() or f.endswith('.png') and 'normal' not in f and '_ao' not in f and 'spec' not in f]
        mp = f'{pdir}/textures/{dif[0]}' if dif else None
    nm = None
    if os.path.isdir(f'{pdir}/textures'):
        n = [f for f in os.listdir(f'{pdir}/textures') if 'normal' in f.lower()]
        nm = f'{pdir}/textures/{n[0]}' if n else None
    po = PXOPT.get(p, {})
    if po.get('map'): mp = os.path.join(os.path.dirname(os.path.abspath(SPEC)), po['map']); nm = nm if po.get('keepNormal') else None
    meshes.append(dict(name=os.path.basename(p)[:-5], kind=kind, pos=put(norm(D['pos'])), nrm=put(D['nrm']), uv=put(D['uv']), si=put(D['si']), sw=put(D['sw']), idx=put(D['idx']),
                       map=tex(mp), normalMap=tex(nm), alpha=kind in ('hair', 'eyebrows', 'eyelashes') or bool(mat.get('transparent')) and kind != 'clothes'))
binf.close()
wn = world * S; wn[:, 1] -= ymin * S
json.dump(dict(name=spec['name'], spec=spec, bones=[dict(name=b['name'], parent=b['parent'], world=[round(float(x), 5) for x in wn[i]]) for i, b in enumerate(bones)],
               meshes=meshes, height=float((ymax - ymin) * S)), open(f"{OUT}/{spec['name']}/char.json", 'w'))
print(spec['name'], 'cao', round(float((ymax - ymin) * S), 3), 'm; mesh', [(m['name'], m['pos'][1] // 3) for m in meshes])
