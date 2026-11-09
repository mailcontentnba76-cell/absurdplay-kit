#!/usr/bin/env python3
"""Đo vị trí/cỡ phụ đề trắng trên video 1080x1920 (H.264). Cùng cách đo đã dùng cho 10 mẫu.
Dùng: python3 do_phu_de.py <video> t1 t2 ...   -> in tâm y, chiều cao vùng chữ, tâm x, bề rộng
"""
import sys, cv2, numpy as np
cap = cv2.VideoCapture(sys.argv[1]); fps = cap.get(5); out = []
for t in map(float, sys.argv[2:]):
    cap.set(1, int(t * fps)); ok, f = cap.read()
    if not ok: continue
    band = f[1300:1650]; hsv = cv2.cvtColor(band, cv2.COLOR_BGR2HSV)
    m = ((hsv[..., 1] < 40) & (hsv[..., 2] > 235)).astype(np.uint8)
    rows = np.where(m[:, 240:840].sum(1) > 8)[0]
    if len(rows) < 10: print(t, 'không thấy chữ'); continue
    g = max(np.split(rows, np.where(np.diff(rows) > 6)[0] + 1), key=len); cols = np.where(m[g[0]:g[-1] + 1].sum(0) > 0)[0]
    y0, y1 = g[0] + 1300, g[-1] + 1300; out.append((y1 - y0, (y0 + y1) / 2))
    print(f't={t}: tâm y={(y0 + y1) / 2:.0f} cao={y1 - y0} tâm x={(cols.min() + cols.max()) / 2:.0f} rộng={cols.max() - cols.min()}')
if out: print('TRUNG VỊ: cao=%.0f tâm y=%.0f' % (np.median([o[0] for o in out]), np.median([o[1] for o in out])))
