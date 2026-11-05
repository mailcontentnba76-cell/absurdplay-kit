# Làm sáng vùng jean (xanh) của texture quần áo MakeHuman cho giống jean bạc màu trong mẫu. Dùng: python3 -I mh_jean_sang.py <diffuse.png> [hệ số=1.18]
import sys, numpy as np
from PIL import Image
p = sys.argv[1]; k = float(sys.argv[2]) if len(sys.argv) > 2 else 1.18
im = Image.open(p).convert('RGBA'); a = np.asarray(im).astype(np.float32) / 255
hsv = np.asarray(im.convert('RGB').convert('HSV')).astype(np.float32) / 255; m = (hsv[..., 0] * 360 > 190) & (hsv[..., 0] * 360 < 250) & (hsv[..., 1] > 0.2)
rgb = a[..., :3]; rgb[m] = np.clip(rgb[m] * k + 0.04, 0, 1); a[..., :3] = rgb; Image.fromarray((a * 255).astype(np.uint8)).save(p)
