# QA giật: optical flow phân vị 95 mỗi khung; khung > 2,2× trung vị lân cận (bỏ ±0,07 s quanh điểm cắt) = nghi giật → xem ảnh và sửa,
# trừ khi là động tác cố ý nhanh (bật ra, ngã, giật đồ). Dùng: python3 -I qa_giat.py <thư mục khung> <số khung> "<t_cắt1,t_cắt2,…>" [fps=30]
import sys, cv2, numpy as np
D, N = sys.argv[1], int(sys.argv[2]); cuts = [float(x) for x in sys.argv[3].split(',') if x]; fps = float(sys.argv[4]) if len(sys.argv) > 4 else 30
prev = None; m = []
for i in range(N):
    g = cv2.cvtColor(cv2.resize(cv2.imread(f'{D}/f_{i:05d}.jpg'), (180, 320)), cv2.COLOR_BGR2GRAY)
    m.append(0 if prev is None else float(np.percentile(np.hypot(*cv2.calcOpticalFlowFarneback(prev, g, None, .5, 3, 15, 3, 5, 1.2, 0).transpose(2, 0, 1)), 95))); prev = g
m = np.array(m); bad = []
for i in range(1, N):
    t = i / fps
    if any(abs(t - c) < .07 for c in cuts): continue
    loc = np.median(np.r_[m[max(1, i - 8):i], m[i + 1:min(N, i + 9)]])
    if m[i] > 2.2 * max(loc, .6) and m[i] > 1.5: bad.append((round(t, 2), round(m[i] / max(loc, .6), 1)))
print(len(bad), 'điểm nghi giật (giây, lần):', bad)
