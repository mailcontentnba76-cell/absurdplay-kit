#!/usr/bin/env python3
"""Dò điểm cắt cảnh theo từng khung (P02).
Dùng 2 tín hiệu trên ảnh thu nhỏ 90x160: (a) khác biệt tuyệt đối trung bình ảnh xám, (b) 1 - tương quan histogram HSV.
Một khung là ứng viên cắt khi điểm tổng hợp vượt ngưỡng tuyệt đối VÀ lớn gấp k lần trung vị cửa sổ ±6 khung
(để tách cắt cứng khỏi chuyển động nhanh kéo dài). Kết quả vẫn phải xem lại bằng ảnh khung trước/sau.
Cách dùng: python3 do_cat_canh.py <video H.264> <out.json> [--nguong 0.18] [--k 3.0]
Lưu ý: OpenCV bản pip thường KHÔNG giải mã AV1 -> chuyển sang H.264 trước (ffmpeg -c:v libx264 -crf 14).
"""
import sys, json, argparse, cv2, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('out')
ap.add_argument('--nguong', type=float, default=0.18); ap.add_argument('--k', type=float, default=3.0)
a = ap.parse_args()
cap = cv2.VideoCapture(a.video); fps = cap.get(cv2.CAP_PROP_FPS)
if not fps: sys.exit('Không mở được video (codec AV1? hãy chuyển sang H.264)')
prev = None; ph = None; sc = []
while True:
    ok, fr = cap.read()
    if not ok: break
    s = cv2.resize(fr, (90, 160), interpolation=cv2.INTER_AREA)
    g = cv2.cvtColor(s, cv2.COLOR_BGR2GRAY).astype(np.float32)
    h = cv2.calcHist([cv2.cvtColor(s, cv2.COLOR_BGR2HSV)], [0, 1, 2], None, [12, 6, 6], [0, 180, 0, 256, 0, 256])
    cv2.normalize(h, h)
    if prev is None: sc.append(0.0)
    else:
        d = float(np.mean(np.abs(g - prev))) / 255.0
        hc = 1.0 - float(cv2.compareHist(ph, h, cv2.HISTCMP_CORREL))
        sc.append(0.5 * min(1.0, d * 4) + 0.5 * min(1.0, hc))
    prev, ph = g, h
sc = np.array(sc); n = len(sc); cuts = []
for i in range(1, n):
    lo, hi = max(1, i - 6), min(n, i + 7)
    nb = np.concatenate([sc[lo:i], sc[i + 1:hi]])
    med = float(np.median(nb)) if len(nb) else 0.0
    if sc[i] >= a.nguong and sc[i] >= a.k * max(med, 0.01):
        if cuts and i - cuts[-1]['khung'] <= 2:  # gộp đỉnh liền kề
            if sc[i] > cuts[-1]['diem']: cuts[-1] = {'khung': i, 't': round(i / fps, 3), 'diem': round(float(sc[i]), 3)}
            continue
        cuts.append({'khung': i, 't': round(i / fps, 3), 'diem': round(float(sc[i]), 3)})
json.dump({'video': a.video, 'fps': fps, 'so_khung': n, 'thoi_luong': round(n / fps, 3), 'nguong': a.nguong, 'k': a.k,
           'ung_vien_cat': cuts, 'diem_tung_khung': [round(float(x), 4) for x in sc]}, open(a.out, 'w'))
print(f'{a.video}: {n} khung, {len(cuts)} ứng viên cắt')
