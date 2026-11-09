"""E10: am_thanh/nhac.wav (hiphop "Final Level", alvana-audio, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (chiến trường: mưa, tên rít/cắm bùn, trống trận, sấm, vó ngựa tổng hợp từ tiếng va, giáp kim loại, swish, bảng rổ, chuông/cồng).
Giọng GỐC 77,32 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 77.32
src = open('/root/work/engine/ep10_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+[ab]?):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(10)
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
voice = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'am_thanh/giong.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; LV = lufs(voice)
sm = int(0.08 * SR)
def span(a, b): return (T >= a) & (T < b)
# ---- nhạc: vào mạnh ngay khung 0; hạ trong đoạn 1415 đen trắng (s8–s10), khựng khi trời tối (s16), hạ ở đại sảnh (s27), dừng 0,5 s trước cú ném ngã ngửa (s29), vang ở FINAL
m = load('alvana-audio/music/hiphop/final-level.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SH['s8'][0], SH['s11'][0])] = 0.45
gm[span(SH['s16'][0], SH['s16'][0] + 0.9)] = 0.15
gm[span(SH['s27'][0], SH['s27'][1])] = 0.55
gm[span(SH['s29'][0] + 0.6, SH['s30'][0] + 0.4)] = 0.2
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
def volley(t0, n=14, spread=0.7, db=-14):  # mưa tên: tiếng rít rồi cắm phập xuống bùn
    put(K + 'whooshes/whoosh-slow-hard.wav', t0, -8)
    for i in range(n): put(K + 'whooshes/whoosh-fast-soft.wav', t0 + rng.uniform(0, spread), db - 2, 0.5)
    for i in range(n): put(A + 'footsteps/wet-0%d.wav' % rng.integers(1, 4), t0 + spread + rng.uniform(0.1, 0.9), db + 2, 0.35); put(K + 'impacts/impact-light-firm.wav', t0 + spread + rng.uniform(0.1, 0.9), db, 0.3)
# mưa nền trên chiến trường (tắt trong đại sảnh)
g_rain = np.ones(N); g_rain[span(SH['s27'][0], SH['s27'][1])] = 0; g_rain = np.convolve(g_rain, np.ones(sm) / sm, 'same')
sfx += bed(A + 'ambience/rain.wav', -18, g_rain) + bed(A + 'ambience/wind.wav', -26, g_rain)
sfx += bed(A + 'ambience/room-tone.wav', -22, 1 - g_rain)
# HOOK khung 0: trống lớn + tên đổ xuống quanh Curry
put(K + 'cinematic-hits/cinematic-drum-massive.wav', 0.0, -6)
put(K + 'whooshes/whoosh-fast-hard.wav', 0.0, -8)
for i in range(18): put(K + 'impacts/impact-light-firm.wav', rng.uniform(0.15, 1.0), -12, 0.3); put(A + 'footsteps/wet-0%d.wav' % rng.integers(1, 4), rng.uniform(0.15, 1.0), -10, 0.35)
for i in range(10): put(K + 'impacts/impact-light-firm.wav', rng.uniform(1.4, 2.6), -15, 0.3)
put(K + 'whooshes/whoosh-medium-hard.wav', SH['s3'][0], -9)
put(K + 'cinematic-hits/cinematic-slam-big.wav', SUB['s3'], -7)
put(A + 'foley/creak-1.wav', SH['s2'][0] + 0.3, -12)
put(K + 'impacts/impact-heavy-firm.wav', SH['s4'][0], -9)
for k_ in ['s5', 's6', 's7']: put(K + 'swishes-and-zips/zip-in-medium.wav', SH[k_][0] + 0.05, -12)
put(MG + 'ball_dribble.wav', SH['s5'][0], -12, 0.6)
# đoạn 1415 (đen trắng): sấm xa + trống trận
put(K + 'cinematic-hits/cinematic-thunder-big.wav', SH['s8'][0], -8)
put(MG + 'drumline.wav', SH['s9'][0], -18, 2.2)
put(A + 'foley/creak-2.wav', SH['s10'][0] + 0.2, -10); put(A + 'foley/creak-3.wav', SH['s10'][0] + 1.4, -12)
put(K + 'whooshes/whoosh-fast-medium.wav', SH['s11'][0] + 0.2, -9)
put(MG + 'ball_dribble.wav', SH['s12'][0], -10, 0.8)
put(K + 'tones/tone-ding-high.wav', SH['s14'][0] + 0.3, -12)
# loạt 1 + trời tối
volley(SH['s15'][0] + 0.25)
put(K + 'cinematic-hits/cinematic-thunder-massive.wav', SH['s16'][0], -7)
put(K + 'whooshes/whoosh-slow-medium.wav', SH['s17'][0] + 0.9, -8)
put(MG + 'swish.wav', SH['s18'][0] + 0.02, -5); put(K + 'cinematic-hits/cinematic-slam-big.wav', SH['s18'][0] + 0.05, -12)
put(A + 'body/snore.wav', SH['s19'][0] + 0.3, -14, 0.6)
# kỵ binh: vó ngựa trong bùn (nhịp phi 4 nhịp) + giáp lách cách
g = SH['s20'][0]
while g < SH['s21'][1] - 0.2:
    for d in (0.0, 0.07, 0.16, 0.24):
        put(K + 'impacts/impact-medium-soft.wav', g + d + rng.uniform(-0.01, 0.01), -14, 0.25); put(A + 'footsteps/wet-0%d.wav' % rng.integers(1, 4), g + d + 0.01, -14, 0.25)
    if rng.random() < 0.5: put(A + 'foley/metal-0%d.wav' % rng.integers(1, 7), g + rng.uniform(0, 0.3), -20, 0.4)
    g += 0.42
put(MG + 'swish.wav', SUB['s21'] + 0.35, -6); put(MG + 'crowd_ooh_aah.wav', SUB['s21'] + 0.4, -20, 1.0)
put(A + 'foley/creak-1.wav', SH['s22'][0] + 0.2, -10)
for t0 in (SH['s23'][0] - 0.2, SH['s23'][0] + 0.6): volley(t0, 10, 0.6, -16)
for t0 in (SH['s24'][0], SUB['s24a'], SUB['s24b']): put(MG + 'swish.wav', t0 + 0.55, -9)
put(MG + 'swish.wav', SH['s25'][0] + 0.02, -5)
put(A + 'body/snore.wav', SH['s26'][0] + 0.3, -14, 0.6)
# đại sảnh: chuông bàn bình luận
put(A + 'foley/bell-01.wav', SH['s27'][0] + 0.1, -12); put(MG + 'crowd_laugh.wav', 60.0, -22, 1.0)
volley(SH['s28'][0] + 0.2, 12, 0.6, -14)
# ngã bùn → đập bảng → vào rổ
put(K + 'impacts/impact-heavy-soft.wav', SH['s29'][0] + 0.8, -8); put(A + 'water/' + 'splash-01.wav' if False else A + 'footsteps/wet-02.wav', SH['s29'][0] + 0.85, -6)
put(MG + 'backboard_bang.wav', SH['s29'][0] + 2.05, -8); put(MG + 'swish.wav', SH['s29'][0] + 2.4, -6)
# FINAL + phong tước
put(A + 'impact/gong-01.wav', SH['s31'][0] + 0.05, -9); put(K + 'celebration/celebration-applause-big.wav', SH['s31'][0] + 0.2, -18, 3.0)
put(A + 'foley/draw-knife-1.wav', SH['s32'][0] + 0.3, -10); put(A + 'impact/bell-heavy-001.wav', SH['s32'][0] + 1.8, -14)
put(K + 'tones/tone-ding-high.wav', SH['s33'][0] + 1.6, -12)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
