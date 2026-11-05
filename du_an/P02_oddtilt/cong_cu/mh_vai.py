# Vẽ texture vải "người tiền sử" (không phụ thuộc UV): da thú, đồ lông, da báo. Dùng: python3 -I mh_vai.py <thư mục ra>
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
out = sys.argv[1]; os.makedirs(out, exist_ok=True); rng = np.random.default_rng(3); N = 1024
def noise(scale, octaves=4):
    acc = np.zeros((N, N)); amp = 1
    for o in range(octaves):
        s = max(2, int(N / scale * 2 ** o)); small = rng.random((s, s))
        acc += amp * np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC)) / 255; amp *= .5
    return (acc - acc.min()) / (acc.max() - acc.min())
def save(a, name): Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{out}/{name}.png')
def hide(base, dark, name):  # da thú: nền + mảng loang + vân da
    n1 = noise(10); n2 = noise(40, 3); grain = noise(200, 2)
    a = np.array(base)[None, None] * (0.8 + 0.35 * n1[..., None]) * (0.9 + 0.15 * grain[..., None])
    blot = (n2 > 0.62)[..., None]; a = np.where(blot, a * 0.72 + np.array(dark)[None, None] * 0.28, a); save(a, name)
def fur(base, name):  # đồ lông: hàng nghìn sợi ngắn
    im = Image.new('RGB', (N, N), tuple(int(c * 255) for c in base)); d = ImageDraw.Draw(im)
    for _ in range(60000):
        x, y = rng.random(2) * N; l = 6 + rng.random() * 12; ang = 1.2 + rng.normal() * .35; k = 0.55 + rng.random() * 0.8
        c = tuple(int(min(255, v * 255 * k)) for v in base); d.line([(x, y), (x + np.cos(ang) * l, y + np.sin(ang) * l)], fill=c, width=2)
    save(np.asarray(im.filter(ImageFilter.GaussianBlur(0.6))) / 255, name)
def leopard(name):
    a = np.ones((N, N, 3)) * np.array([0.86, 0.68, 0.30]) * (0.85 + 0.25 * noise(12)[..., None])
    im = Image.fromarray((a * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for _ in range(420):
        x, y = rng.random(2) * N; r = 9 + rng.random() * 9
        for k in range(5):
            aa = rng.random() * 6.28; rr = r * (0.9 + rng.random() * .4)
            d.ellipse([x + np.cos(aa) * r - rr * .35, y + np.sin(aa) * r - rr * .3, x + np.cos(aa) * r + rr * .35, y + np.sin(aa) * r + rr * .3], fill=(40, 26, 12))
        d.ellipse([x - r * .5, y - r * .5, x + r * .5, y + r * .5], fill=(176, 112, 40))
    save(np.asarray(im.filter(ImageFilter.GaussianBlur(0.8))) / 255, name)
hide([0.48, 0.30, 0.17], [0.20, 0.11, 0.05], 'da_nau')        # áo da một vai (giường, quạt)
hide([0.72, 0.52, 0.30], [0.40, 0.25, 0.12], 'da_be')         # bộ da sáng (ghế, quạt)
hide([0.85, 0.42, 0.12], [0.55, 0.22, 0.05], 'da_cam')        # váy cam (điều hoà)
hide([0.70, 0.55, 0.32], [0.38, 0.24, 0.10], 'da_dom')        # đồ đốm vàng nâu (vòi sen)
fur([0.33, 0.22, 0.14], 'long_nau')                           # đồ lông (báo thức)
leopard('da_bao')                                             # da báo (bạn ở video ghế)
print(sorted(os.listdir(out)))
