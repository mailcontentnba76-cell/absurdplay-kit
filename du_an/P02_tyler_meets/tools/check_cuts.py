"""Transition QA on an exported episode. (ported from What-if-NBA cdwhatif skill; accepts this project's timeline.json: shot "start" = cut time)
Usage: python check_cuts.py export.mp4 blueprint.json
Checks (1) cut drift: actual cut frame vs planned frame (must be 0), (2) jump cuts: consecutive shots of the
same set whose framing differs by < 20 % scale (looks like a glitch, not a cut), (3) frozen frames at cuts."""
import sys, json, cv2, numpy as np
vid, bpf = sys.argv[1], sys.argv[2]; bp = json.load(open(bpf)); fps = bp.get("fps", 30)
cap = cv2.VideoCapture(vid); F = []
while True:
    ok, f = cap.read()
    if not ok: break
    F.append(cv2.resize(f, (180, 320)))
G = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in F]
band = np.ones((320, 180, 1), bool); band[150:280] = False   # ignore the caption band (page changes are not cuts)
d = np.array([0] + [np.abs(F[i].astype(int) - F[i-1].astype(int))[np.broadcast_to(band, F[i].shape)].mean() for i in range(1, len(F))])
def edges(g): return cv2.GaussianBlur(cv2.Canny(g, 50, 150).astype(np.float32), (5, 5), 0)
drift, jumps, frozen = [], [], []
for s0, s1 in zip(bp["shots"][:-1], bp["shots"][1:]):
    c = int(round(s1.get("in", s1.get("start", 0))*fps))
    if c >= len(F): drift.append((s1["id"], "beyond end")); continue
    win = range(max(1, c-6), min(len(d), c+7)); k = max(win, key=lambda i: d[i])
    if k != c and d[k] > 1.5*d[c]: drift.append((s1["id"], k - c))
    if d[c] < 0.02: frozen.append(s1["id"])
    A, B = G[c-1], G[c]; hist = cv2.compareHist(cv2.calcHist([A], [0], None, [32], [0, 256]), cv2.calcHist([B], [0], None, [32], [0, 256]), cv2.HISTCMP_CORREL)
    ea, eb = edges(A), edges(B); best = (0, 1)
    for sc in np.arange(0.80, 1.26, 0.02):
        As = cv2.resize(ea, None, fx=sc, fy=sc); h, w = As.shape; T = As[h//2-90:h//2+90, w//2-50:w//2+50]
        r = cv2.matchTemplate(eb, T, cv2.TM_CCOEFF_NORMED).max()
        if r > best[0]: best = (r, sc)
    if s1.get("snap"): continue          # intended expression snap (same character close-up)
    if hist > 0.9 and best[0] > 0.45 and abs(best[1] - 1) < 0.2: jumps.append((s0["id"], s1["id"], round(float(best[1]), 2)))
print("cut drift (frames):", drift or "none")
print("jump cuts (same set, framing change < 20 %):", jumps or "none")
print("frozen frame at cut:", frozen or "none")
sys.exit(1 if drift or jumps else 0)
