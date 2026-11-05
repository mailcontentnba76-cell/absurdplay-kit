# Texture "giống ảnh chụp" tự tạo (CC0 của dự án): tường đá xếp (màu + normal + roughness), gỗ xám cũ, da thuộc, rơm, cỏ.
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); rng = np.random.default_rng(11)
def fbm(n, base, oct=5, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((n, n)); a = 1; s = base
    for _ in range(oct):
        g = r.random((s + 1, s + 1)); g[-1] = g[0]; g[:, -1] = g[:, 0]
        acc += a * ndimage.zoom(g, n / s, order=3, mode='grid-wrap')[:n, :n]; a *= .5; s *= 2
    return (acc - acc.min()) / (acc.max() - acc.min())
def normal_from_height(h, k):
    gy, gx = np.gradient(h * k); n = np.dstack([-gx, -gy, np.ones_like(h)]); n /= np.linalg.norm(n, axis=2, keepdims=True); return ((n * .5 + .5) * 255).astype(np.uint8)
def save(a, n): Image.fromarray(a if a.dtype == np.uint8 else np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{OUT}/{n}.jpg', quality=92)
def stone(N, name, base, var, mortar, rows=7, seed=1):
    r = np.random.default_rng(seed)
    # đá xếp lớp: lưới hàng so le, mỗi viên là đa giác méo (Voronoi theo tâm viên)
    pts = []; 
    for j in range(rows):
        y = (j + .5) / rows; n = r.integers(6, 11); xs = np.sort(r.random(n)); 
        for x in xs: pts.append([x, y + (r.random() - .5) * .5 / rows, r.random()])
    pts = np.array(pts); P = np.concatenate([pts + [dx, dy, 0] for dx in (-1, 0, 1) for dy in (-1, 0, 1)])
    yy, xx = np.mgrid[0:N, 0:N] / N
    warp = (fbm(N, 6, 4, seed + 5) - .5) * .06
    X, Y = xx + warp, yy + (fbm(N, 6, 4, seed + 6) - .5) * .06
    d1 = np.full((N, N), 9.); d2 = np.full((N, N), 9.); idx = np.zeros((N, N), int)
    for i, (px, py, _) in enumerate(P):
        d = np.sqrt(((X - px) * 1.0) ** 2 + ((Y - py) * 1.9) ** 2)
        m = d < d1; d2 = np.where(m, d1, np.minimum(d2, d)); idx = np.where(m, i, idx); d1 = np.where(m, d, d1)
    edge = d2 - d1; tone = P[idx, 2]
    fine = fbm(N, 128, 3, seed + 7); rough = fbm(N, 32, 5, seed + 1)
    h = np.clip(edge * 30, 0, 1) ** .45; h = h * (.7 + .3 * rough) + .12 * fine
    col = np.array(base)[None, None] * (1 + var * (tone[..., None] - .5)) * (.72 + .35 * rough[..., None] + .18 * fine[..., None])
    col = col * (.62 + .45 * h[..., None])
    gap = (edge < .0025)[..., None]; col = np.where(gap, np.array(mortar)[None, None] * (.8 + .4 * fbm(N, 64, 2, seed + 4)[..., None]), col)
    save(col, name + '_col'); save(normal_from_height(h, 14), name + '_nrm')
def wood_planks(N, name, base, planks=6, seed=2):
    r = np.random.default_rng(seed); yy, xx = np.mgrid[0:N, 0:N] / N
    pw = 1 / planks; pid = (xx // pw).astype(int); u = (xx % pw) / pw
    off = r.random(planks)[pid]
    st = r.random((N // 16, N)); st = ndimage.zoom(st, (16, 1), order=1)[:N, :N]  # sọc dọc dài theo thớ gỗ
    grain = ndimage.gaussian_filter(st, (6, 0.8)); grain = (grain - grain.min()) / (grain.max() - grain.min())
    streak = fbm(N, 64, 3, seed + 1)
    tone = (.8 + .4 * r.random(planks))[pid]
    col = np.array(base)[None, None] * tone[..., None] * (.75 + .2 * grain[..., None] + .2 * streak[..., None])
    seam = ((u < .02) | (u > .98))[..., None]; col = np.where(seam, col * .35, col)
    crack = (fbm(N, 128, 2, seed + 4) > .82) & (grain > .7); col[crack] *= .55
    h = .6 + .2 * grain + .1 * streak; h[seam[..., 0]] = 0
    save(col, name + '_col'); save(normal_from_height(h, 6), name + '_nrm')
def floor(N, name):
    wood_planks(N, name, [.62, .44, .30], 5, 7)
def leather(N, name):
    g = fbm(N, 128, 3, 9); b = fbm(N, 8, 4, 10)
    col = np.array([.56, .36, .25])[None, None] * (.85 + .25 * b[..., None]) * (.93 + .1 * g[..., None]); save(col, name + '_col'); save(normal_from_height(g * .4 + b * .2, 5), name + '_nrm')
def thatch(N, name):
    r = np.random.default_rng(5); im = np.zeros((N, N, 3)); a = np.array([.36, .33, .28])
    base = fbm(N, 16, 4, 12); im[:] = a * (.6 + .5 * base[..., None])
    for _ in range(9000):
        x, y = r.integers(0, N, 2); l = r.integers(20, 60); k = .5 + r.random() * .9
        yy = np.clip(np.arange(y, y + l), 0, N - 1); im[yy, x] = np.clip(a * k * 1.2, 0, 1)
    save(ndimage.gaussian_filter(im, (0.6, 0.6, 0)), name + '_col')
stone(1024, 'da_xam', [.66, .65, .62], .55, [.30, .29, .27], rows=16, seed=1)       # tường đá xám sáng (trong + ngoài phần dưới)
stone(1024, 'da_toi', [.30, .33, .38], .35, [.12, .13, .15], rows=8, seed=4)      # đá phiến sẫm xanh xám (phần trên tường ngoài)
wood_planks(1024, 'go_xam', [.66, .64, .60], 5, 3)                                  # ván cửa gỗ xám cũ
wood_planks(1024, 'go_toi', [.20, .19, .18], 2, 8)                                  # xà/khung cửa gỗ sẫm
floor(1024, 'san_go'); leather(512, 'da_thuoc'); thatch(1024, 'rom')
print(sorted(os.listdir(OUT)))
