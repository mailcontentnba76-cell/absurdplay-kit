"""Làm mượt điểm cắt: ở mỗi mốc shot, 3 khung đầu của shot mới được hoà với khung cuối của shot cũ
(trọng số mới 0,55 / 0,8 / 0,95 ≈ 0,1 s ở 30 fps) — bớt cảm giác giật khi đổi góc máy mà vẫn giữ nhịp cắt nhanh.
Dùng: python3 hoa_cat.py <thư mục khung f_%05d.jpg> <thư mục ra> <epXX_shots.js> [--fps 30] [--bo s4b,s16]
Khung không nằm ở điểm cắt được liên kết cứng (không tốn chỗ)."""
import argparse, os, re
from PIL import Image
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('shots')
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--bo', default='')
a = ap.parse_args(); bo = set(x for x in a.bo.split(',') if x)
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[bcd]?):\[([\d.,]+)\]", open(a.shots).read().split('END')[0])}
cuts = sorted(set(round(v[0] * a.fps) for k, v in SH.items() if v[0] > 0 and k not in bo))
os.makedirs(a.out, exist_ok=True); fs = sorted(f for f in os.listdir(a.src) if f.endswith('.jpg'))
W = {}; 
for c in cuts:
    for j, w in enumerate([0.55, 0.8, 0.95]): W[c + j] = (c - 1, w)
for f in fs:
    i = int(f[2:7]); dst = os.path.join(a.out, f)
    if os.path.exists(dst): os.remove(dst)
    if i in W and os.path.exists(os.path.join(a.src, 'f_%05d.jpg' % W[i][0])):
        A = Image.open(os.path.join(a.src, 'f_%05d.jpg' % W[i][0])); B = Image.open(os.path.join(a.src, f))
        Image.blend(A, B, W[i][1]).save(dst, quality=95)
    else: os.link(os.path.join(a.src, f), dst)
print('cuts', len(cuts), 'frames', len(fs))
