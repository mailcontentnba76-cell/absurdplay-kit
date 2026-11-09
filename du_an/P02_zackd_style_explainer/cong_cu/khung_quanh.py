#!/usr/bin/env python3
"""Ghép các khung liên tiếp quanh những mốc thời gian để kiểm cắt cảnh / chuyển động (P02).
Cách dùng: python3 khung_quanh.py <video H.264> <out.png> t1 t2 ... [--n 12] [--buoc 1] [--rong 112]
Mỗi mốc -> 1 hàng n khung, bắt đầu trước mốc n/2*buoc khung; mỗi khung ghi số khung và giây.
"""
import sys, argparse, cv2, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('out'); ap.add_argument('t', nargs='+', type=float)
ap.add_argument('--n', type=int, default=12); ap.add_argument('--buoc', type=int, default=1); ap.add_argument('--rong', type=int, default=112)
a = ap.parse_args(); cap = cv2.VideoCapture(a.video); fps = cap.get(cv2.CAP_PROP_FPS); N = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
h = int(a.rong * 16 / 9); rows = []
for t in a.t:
    f0 = max(0, int(round(t * fps)) - a.n // 2 * a.buoc); row = []
    for k in range(a.n):
        f = min(N - 1, f0 + k * a.buoc); cap.set(cv2.CAP_PROP_POS_FRAMES, f); ok, im = cap.read()
        im = cv2.resize(im, (a.rong, h), interpolation=cv2.INTER_AREA) if ok else np.zeros((h, a.rong, 3), np.uint8)
        cv2.rectangle(im, (0, 0), (a.rong, 14), (0, 0, 0), -1)
        cv2.putText(im, f'{f} {f / fps:.2f}', (2, 11), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 255, 255), 1)
        row.append(im)
    rows.append(np.hstack(row))
cv2.imwrite(a.out, np.vstack(rows)); print(a.out)
