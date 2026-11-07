# Ghép các khung đã render thành 1 ảnh lưới có ghi giây — để Claude xem nhanh bố cục/động tác.
# Dùng: python3 -I anh_ghep.py <thư mục f_%05d.jpg> <ra.jpg> [số cột=10] [rộng ô=160] [fps=30]
import sys, glob, cv2, numpy as np
D, out = sys.argv[1], sys.argv[2]; C = int(sys.argv[3]) if len(sys.argv) > 3 else 10; Wc = int(sys.argv[4]) if len(sys.argv) > 4 else 160; fps = float(sys.argv[5]) if len(sys.argv) > 5 else 30
ims = []
for f in sorted(glob.glob(D + '/f_*.jpg')):
    im = cv2.imread(f); h = int(Wc * im.shape[0] / im.shape[1]); im = cv2.resize(im, (Wc, h)); t = int(f[-9:-4]) / fps
    cv2.putText(im, f'{t:.2f}', (4, 18), 0, .55, (0, 0, 0), 3); cv2.putText(im, f'{t:.2f}', (4, 18), 0, .55, (255, 255, 255), 1); ims.append(im)
while len(ims) % C: ims.append(np.zeros_like(ims[0]))
cv2.imwrite(out, np.vstack([np.hstack(ims[r:r + C]) for r in range(0, len(ims), C)])); print('ok', out, len(ims), 'ô')
