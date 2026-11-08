# Vải cho E07 (máy bắn đá): áo choàng tắm kẻ ô xanh than–xám (bố), áo ba lỗ trắng ố (hàng xóm), váy hoa nhí tím nhạt (bà).
import sys, numpy as np
from PIL import Image
from scipy import ndimage
out = sys.argv[1]; r = np.random.default_rng(7); N = 1024
def save(a, n): Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{out}/{n}.png')
x = np.arange(N); v = (x % 96 < 30)[None, :]; h = (x % 96 < 30)[:, None]
a = np.tile(np.array([.58, .6, .63]), (N, N, 1)); a[v | h] = [.24, .29, .4]; a[v & h] = [.16, .19, .28]
save(a * (1 + (r.random((N, N, 1)) - .5) * .06), 'ao_choang_ke')
t = ndimage.gaussian_filter(r.random((N, N)), 30); t = (t - t.min()) / (t.max() - t.min())
save(np.dstack([.93 - .08 * t, .92 - .1 * t, .86 - .16 * t]), 'ba_lo_o')
b = np.tile(np.array([.78, .74, .86]), (N, N, 1)); yy, xx = np.mgrid[0:N, 0:N]
for cx, cy in r.random((260, 2)) * N: b[(yy - cy) ** 2 + (xx - cx) ** 2 < 49] = [.96, .95, .97]
save(b, 'vay_hoa_tim'); print('ok')
