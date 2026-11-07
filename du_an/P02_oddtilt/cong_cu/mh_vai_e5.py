# Vải cho E05 (xe đạp): áo ba lỗ xám chuột, quần đùi caro xanh than-kaki, áo hawaii xanh bạc hà (thay vùng áo sọc của male_casualsuit03, giữ quần jean).
# Dùng: python3 -I mh_vai_e5.py <thư mục makehuman-data/public/data> <thư mục ra nhan_vat/vai>
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
D, out = sys.argv[1], sys.argv[2]; rng = np.random.default_rng(5); N = 1024
def save(a, n): Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{out}/{n}.png')
# 1. xám chuột: nền + sợi dọc mảnh + nhiễu
g = np.full((N, N, 3), [.52, .53, .55]) + (rng.random((N, N, 1)) - .5) * .06 + (rng.random((1, N, 1)) - .5) * .05
save(g, 'xam_ba_lo')
# 2. caro: sọc ngang/dọc xanh than + kaki + chỉ trắng mảnh
x = np.arange(N); P = 128
def band(c, w, o): return ((c + o) % P) < w
v = band(x, 40, 0)[None, :]; h = band(x, 40, 0)[:, None]; th = (x % 64 < 3)
base = np.array([.72, .66, .52]); navy = np.array([.16, .2, .32])
a = np.tile(base, (N, N, 1)); a[v | h] = a[v | h] * .45 + navy * .55; a[v & h] = navy
a[(th[None, :] | th[:, None])] = a[(th[None, :] | th[:, None])] * .6 + .4
save(a + (rng.random((N, N, 1)) - .5) * .04, 'ke_caro')
# 3. hawaii trên atlas male_casualsuit03
src = Image.open(f'{D}/proxies/clothes/male_casualsuit03/textures/male_casualsuit03_diffuse.png').convert('RGBA'); W = src.size[0]
arr = np.asarray(src).astype(np.float32) / 255; hsv = np.asarray(src.convert('RGB').convert('HSV')).astype(np.float32) / 255
jean = (hsv[..., 0] * 360 > 185) & (hsv[..., 0] * 360 < 240) & (hsv[..., 1] > .2)
shirt = (arr[..., :3].max(-1) > .06) & ~jean
pat = Image.new('RGB', (W, W), (168, 214, 186)); dr = ImageDraw.Draw(pat); r2 = np.random.default_rng(9)
for _ in range(int(W * W / 2600)):
    cx, cy = r2.random(2) * W; s = W / 60 * (.7 + r2.random() * .6); ang = r2.random() * 6.28
    if r2.random() < .45:  # lá xanh đậm
        pts = [(cx + np.cos(ang) * s * 1.6 * t + np.sin(ang) * s * .5 * np.sin(np.pi * t) * k, cy + np.sin(ang) * s * 1.6 * t - np.cos(ang) * s * .5 * np.sin(np.pi * t) * k) for k in (1, -1) for t in (np.linspace(0, 1, 8) if k == 1 else np.linspace(1, 0, 8))]
        dr.polygon(pts, fill=(64, 128, 92))
    else:  # hoa dâm bụt trắng/vàng nhạt 5 cánh
        col = (250, 248, 236) if r2.random() < .6 else (246, 222, 140)
        for k in range(5):
            a2 = ang + k * 1.2566; dr.ellipse([cx + np.cos(a2) * s * .7 - s * .5, cy + np.sin(a2) * s * .7 - s * .5, cx + np.cos(a2) * s * .7 + s * .5, cy + np.sin(a2) * s * .7 + s * .5], fill=col)
        dr.ellipse([cx - s * .22, cy - s * .22, cx + s * .22, cy + s * .22], fill=(214, 120, 60))
pat = np.asarray(pat.filter(ImageFilter.GaussianBlur(.6))).astype(np.float32) / 255
shade = arr[..., :3].mean(-1, keepdims=True); shade = .75 + .5 * (shade - shade[shirt].mean()) if shirt.any() else 1
res = arr.copy(); res[..., :3][shirt] = np.clip(pat * shade, 0, 1)[shirt]
Image.fromarray((res * 255).astype(np.uint8)).save(f'{out}/hawaii_cs03.png')
print('ok')
