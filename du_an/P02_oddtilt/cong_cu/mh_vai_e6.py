# Vải cho E06 (kính tiềm vọng): khăn bông trắng (áo choàng tắm của bạn), áo sọc xanh-trắng (em họ).
# Dùng: python3 -I mh_vai_e6.py <thư mục ra nhan_vat/vai>
import sys, numpy as np
from PIL import Image
from scipy import ndimage
out = sys.argv[1]; r = np.random.default_rng(6); N = 1024
def save(a, n): Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{out}/{n}.png')
t = ndimage.gaussian_filter(r.random((N, N)), 1.2); t = (t - t.min()) / (t.max() - t.min())
save(np.dstack([.86 + .1 * t, .86 + .1 * t, .84 + .1 * t]), 'khan_trang')
y = np.arange(N)[:, None] % 64 < 30
a = np.where(y[..., None], [.22, .42, .72], [.93, .94, .95]) * (1 + (r.random((N, N, 1)) - .5) * .05)
save(np.broadcast_to(a, (N, N, 3)), 'soc_xanh'); print('ok')
