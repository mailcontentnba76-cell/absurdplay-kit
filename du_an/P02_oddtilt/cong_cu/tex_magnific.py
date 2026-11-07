# Ảnh Magnific (text-to-image "Seamless tileable texture, photograph of …") → texture dùng trong engine.
# Ra: engine/assets/tex/mag/<tên>_m_col.jpg (768 px, mờ 0,6 px — chống lấp lánh) + <tên>_m_nrm.jpg (normal từ độ sáng, bỏ nếu độ nổi = 0).
#     Thêm cờ --goc để lưu cả bản gốc <tên>_col.jpg (dùng cho phông nền / ảnh không lặp).
# Dùng: python3 -I tex_magnific.py <ảnh.png> <tên> <độ nổi normal 0–6> [--goc]
import sys, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src, name, k = sys.argv[1], sys.argv[2], float(sys.argv[3]); goc = '--goc' in sys.argv
O = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'engine', 'assets', 'tex', 'mag'); os.makedirs(O, exist_ok=True)
im = Image.open(src).convert('RGB')
if goc: im.save(f'{O}/{name}_col.jpg', quality=92)
sm = im.resize((768, 768), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6)); sm.save(f'{O}/{name}_m_col.jpg', quality=93)
if k > 0:
    g = ndimage.gaussian_filter(np.asarray(sm.convert('L')).astype(np.float32) / 255, 1.0); gy, gx = np.gradient(g * k)
    n = np.dstack([-gx, -gy, np.ones_like(g)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
    Image.fromarray(((n * .5 + .5) * 255).astype(np.uint8)).save(f'{O}/{name}_m_nrm.jpg', quality=92)
print('ok', name, '(normal)' if k > 0 else '(không normal)')
