# Vải cho E08 (đèn bắt muỗi): quần đùi vàng chấm bi (nhân vật chính ngủ cởi trần), pyjama kẻ sọc xanh nhạt (ông).
import sys, numpy as np
from PIL import Image
out = sys.argv[1]; r = np.random.default_rng(8); N = 1024
def save(a, n): Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).save(f'{out}/{n}.png')
a = np.tile(np.array([.98, .82, .25]), (N, N, 1)); yy, xx = np.mgrid[0:N, 0:N]
m = ((xx % 64 - 32) ** 2 + (yy % 64 - 32) ** 2) < 90; a[m] = [.15, .15, .2]; save(a, 'dui_cham_bi')
b = np.tile(np.array([.78, .86, .93]), (N, N, 1)); b[(xx % 40) < 5] = [.42, .55, .72]; save(b * (1 + (r.random((N, N, 1)) - .5) * .04), 'pyjama_soc'); print('ok')
