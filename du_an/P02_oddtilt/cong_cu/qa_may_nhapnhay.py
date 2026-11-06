# QA hình cho bản render: (1) tốc độ máy theo shot so với mẫu, (2) bản đồ nhấp nháy.
# Dùng: python3 -I qa_may_nhapnhay.py <thư mục khung f_%05d.jpg> <fps> "<t0,t1;t0,t1;...>" [anh_ra.jpg]
import sys, cv2, numpy as np
D, fps, shots = sys.argv[1], float(sys.argv[2]), [tuple(map(float, s.split(','))) for s in sys.argv[3].split(';')]
out = sys.argv[4] if len(sys.argv) > 4 else None
def f(i): return cv2.imread(f'{D}/f_{i:05d}.jpg')
for a, b in shots:
    i0, i1 = int((a + .15) * fps), int((b - .15) * fps); div = []; still = 0; prev = None
    for i in range(i0, i1, 2):
        g = cv2.cvtColor(cv2.resize(f(i), (180, 320)), cv2.COLOR_BGR2GRAY)
        if prev is not None:
            fl = cv2.calcOpticalFlowFarneback(prev, g, None, .5, 3, 15, 3, 5, 1.2, 0)
            ys, xs = np.mgrid[0:320, 0:180]; cx, cy = xs - 90, ys - 160; r = np.sqrt(cx**2 + cy**2) + 1e-6
            div.append(float(np.median((fl[..., 0]*cx + fl[..., 1]*cy) / r)) * fps / 2)
            still += np.median(np.hypot(fl[..., 0], fl[..., 1])) * fps / 2 < 3
        prev = g
    print(f'shot {a:.2f}-{b:.2f}: tốc độ đẩy {np.median(div):.1f} | đứng yên {100*still/max(1,len(div)):.0f}%')
a, b = shots[-1]; fr = [f(i).mean(2).astype(np.float32) for i in range(int(a*fps), min(int(a*fps)+48, int(b*fps)))]
m = np.zeros_like(fr[0])
for i in range(1, len(fr) - 1): m += ((fr[i]-fr[i-1] < -35) & (fr[i+1]-fr[i] > 35))
print('điểm "tối rồi sáng lại" (48 khung cuối):', int(m.sum()), '| điểm nóng ≥3 lần:', int((m >= 3).sum()))
if out: cv2.imwrite(out, cv2.applyColorMap(np.clip(m*25, 0, 255).astype(np.uint8), cv2.COLORMAP_JET))
