# Đổi màu texture quần áo MakeHuman theo vùng màu (vd quần yếm xanh nhạt → xanh đen, áo trắng → be như mẫu 08).
# Dùng: python3 -I mh_doi_mau.py <ảnh diffuse> <R,G,B vùng xanh> <R,G,B vùng trắng>   (0–1)
import sys, numpy as np
from PIL import Image
p = sys.argv[1]; navy = np.array([float(x) for x in sys.argv[2].split(',')]); tan = np.array([float(x) for x in sys.argv[3].split(',')])
im = Image.open(p).convert('RGBA'); a = np.asarray(im).astype(np.float32) / 255; rgb = a[..., :3]
hsv = np.asarray(im.convert('RGB').convert('HSV')).astype(np.float32) / 255; h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
blue = (h > 180) & (h < 250) & (s > 0.18); white = (s < 0.15) & (v > 0.55); lum = rgb.mean(-1, keepdims=True); out = rgb.copy()
out[blue] = lum[blue] / max(lum[blue].mean(), 1e-3) * navy; out[white] = lum[white] / max(lum[white].mean(), 1e-3) * tan
a[..., :3] = np.clip(out, 0, 1); Image.fromarray((a * 255).astype(np.uint8)).save(p)
