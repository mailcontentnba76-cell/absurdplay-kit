"""Quét khung lỗi (chớp nháy 1 khung) trong thư mục render: so mỗi khung với 2 khung kề (bỏ qua ±1 khung quanh điểm cắt).
Khung nào lệch với cả hai khung kề > 2.0 và > 1,8 × độ lệch giữa hai khung kề → in ra (để xoá và render lại).
Dùng: python3 quet_khung_loi.py <thư mục f_XXXXX.jpg> <epXX_shots.js> [fps=30] [--xoa]"""
import sys, re, os, numpy as np
from PIL import Image
d, shots = sys.argv[1], sys.argv[2]; fps = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 30
src = open(shots).read().split('END')[0]
cuts = sorted(set(round(float(a) * fps) for a in re.findall(r"\[([\d.]+),", src)))
fs = sorted(f for f in os.listdir(d) if f.startswith('f_'))
L = lambda f: np.asarray(Image.open(os.path.join(d, f)).convert('L').resize((90, 160)), np.float32)
F = [L(f) for f in fs]; idx = [int(f[2:7]) for f in fs]; bad = []
for j in range(1, len(F) - 1):
    i = idx[j]
    if any(abs(i - c) <= 1 for c in cuts): continue
    a = np.abs(F[j] - F[j - 1]).mean(); b = np.abs(F[j] - F[j + 1]).mean(); c = np.abs(F[j - 1] - F[j + 1]).mean()
    if min(a, b) > 2.0 and min(a, b) > 1.8 * c: bad.append(i)
print('khung lỗi:', bad)
if '--xoa' in sys.argv:
    for i in bad: os.remove(os.path.join(d, 'f_%05d.jpg' % i))
