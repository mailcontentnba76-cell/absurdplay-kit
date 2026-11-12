"""E14: am_thanh/nhac.wav (upbeat "A Small Town On Pluto", HoliznaCC0, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (hồ băng ngoài trời: gió, khán giả ngoài trời, băng nứt, trượt, giày lạo xạo tuyết, xẻng, khoan, bão tuyết, swish).
Giọng GỐC 65,41 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 65.41
src = open('/root/work/engine/ep14_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(14)
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
def ma(x, k):  # trung bình trượt nhanh (tổng tích luỹ)
    c = np.cumsum(np.pad(np.asarray(x, np.float64), (k // 2, k - 1 - k // 2))); c = np.concatenate([[0.0], c]); return (c[k:] - c[:-k]) / k
N = int(DUR * SR); T = np.arange(N) / SR
voice = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'am_thanh/giong.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; LV = lufs(voice)
sm = int(0.08 * SR)
def span(a, b): return (T >= a) & (T < b)
# ---- nhạc: vào ngay khung 0; hạ khi xem bảng điểm/thành tích (s3–s5), khựng ở "Luka slips." (s10), hạ trong bão tuyết (s24), hạ ở "still 1–11" (s29), vang lại ở kết
m = load('alvana-audio/music/upbeat/a-small-town-on-pluto.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SUB['s3'], SH['s6'][0])] = 0.55
gm[span(SH['s10'][0] + 0.25, SH['s10'][1])] = 0.1
gm[span(SUB['s24'], SH['s25'][1])] = 0.45
gm[span(SH['s29'][0], SH['s29'][1])] = 0.5
gm[T > DUR - 1.0] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.0)))
gm = ma(gm, sm); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g=1.0):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
def crack(t, db=-14): put(A + 'impact/glass-light-00%d.wav' % rng.integers(0, 5), t, db, 0.6)
def snowstep(t, db=-16, n=0.6): put(A + 'footsteps/snow-00%d.wav' % rng.integers(0, 5), t, db, n)
# nền: gió + khán giả ngoài trời; bão tuyết s24–s25: gió to, khán giả nhỏ
STORM = np.zeros(N); STORM[span(SH['s24'][0], SH['s25'][1])] = 1; STORM = ma(STORM, int(0.3 * SR))
sfx += bed(A + 'ambience/wind.wav', -24, 1 + 2.2 * STORM) + bed(MG + 'stadium_crowd_outdoor.wav', -22, 1 - 0.8 * STORM)
# HOOK khung 0: trượt dài trên băng + băng nứt + khán giả ồ
put(K + 'whooshes/whoosh-slow-medium.wav', 0.0, -8); put(K + 'foley/foley-glass-slide.wav', 0.05, -10); crack(0.25, -10); put(MG + 'crowd_gasp.wav', 0.3, -14, 1.0)
put(A + 'whoosh/soft-long.wav', SUB['s2'], -12)
put(MG + 'buzzer.wav', SUB['s3'] + 0.05, -14, 0.8)
for t0 in (9.0, 10.62, 12.76, SUB['s5']): put(K + 'swishes-and-zips/zip-in-medium.wav', t0, -13)
put(MG + 'sad_trombone.wav', SUB['s5'] + 0.2, -15, 1.3)
put(K + 'tones/tone-ding-high.wav', SH['s6'][0] + 0.5, -12)
put(K + 'whooshes/whoosh-slow-soft.wav', SH['s7'][0], -10); put(MG + 'crowd_cheer.wav', SUB['s7'] + 0.2, -18, 1.8)
for i in range(6): snowstep(SH['s8'][0] + 0.15 + i * 0.32, -15, 0.35)
put(A + 'body/breath.wav', SUB['s8'] + 0.1, -12); put(A + 'body/breath.wav', SUB['s8'] + 0.8, -14)
put(MG + 'ref_whistle.wav', SH['s9'][0] + 0.05, -10, 0.7)
put(MG + 'ball_dribble.wav', SH['s10'][0], -12, 0.3); put(K + 'whooshes/whoosh-fast-medium.wav', SH['s10'][0] + 0.25, -10); put(K + 'impacts/impact-medium-soft.wav', SH['s10'][0] + 0.55, -8); crack(SH['s10'][0] + 0.6, -12)
put(K + 'foley/foley-fabric-slide.wav', SH['s11'][0], -8); put(K + 'foley/foley-glass-slide.wav', SH['s11'][0] + 0.2, -10); put(MG + 'crowd_laugh.wav', SH['s11'][0] + 0.3, -16, 1.0)
put(MG + 'swish.wav', SH['s12'][0] + 1.05, -6); put(MG + 'crowd_cheer.wav', SH['s12'][0] + 1.1, -14, 1.2)
put(K + 'foley/foley-glass-slide.wav', SH['s14'][0] + 0.1, -10); put(K + 'foley/foley-glass-slide.wav', SH['s14'][0] + 1.0, -11)
put(K + 'impacts/impact-light-soft.wav', SH['s14'][0] + 1.0, -10); put(K + 'impacts/impact-light-soft.wav', SH['s14'][0] + 1.7, -10); put(MG + 'crowd_ooh_aah.wav', SH['s14'][0] + 1.0, -16, 1.4)
put(K + 'foley/foley-wood-slide.wav', SH['s15'][0] + 0.1, -9); put(MG + 'crowd_cheer.wav', SH['s15'][0] + 0.6, -16, 1.6)
for i in range(4): put(A + 'footsteps/snow-00%d.wav' % (i % 5), SH['s16'][0] + 0.1 + i * 0.45, -10, 0.4); put(A + 'whoosh/swish-%d.wav' % (i + 1), SH['s16'][0] + 0.3 + i * 0.45, -15)
put(MG + 'buzzer.wav', SH['s17'][0] + 0.05, -14, 0.7)
put(MG + 'crowd_ooh_aah.wav', SH['s18'][0] + 0.4, -18, 1.4)
put(A + 'mechanical/gear-ratchet.wav', SH['s19'][0] + 0.1, -10, 1.8); crack(SH['s19'][0] + 0.3, -16); crack(SH['s19'][0] + 1.0, -16)
put(A + 'water/splash-03.wav', SH['s20'][0] + 0.35, -10); put(A + 'whoosh/air-02.wav', SH['s20'][0] + 0.4, -12); put(MG + 'crowd_gasp.wav', SH['s20'][0] + 0.6, -14, 1.0)
put(MG + 'swish.wav', SH['s21'][0] + 1.6, -6); put(MG + 'crowd_cheer.wav', SH['s21'][0] + 1.6, -13, 1.4)
put(MG + 'buzzer.wav', SH['s22'][0] + 0.05, -14, 0.7)
put(MG + 'crowd_boo.wav', SH['s23'][0] + 0.6, -20, 1.0)
put(K + 'whooshes/whoosh-slow-hard.wav', SH['s24'][0], -9); put(A + 'ambience/wind.wav', SH['s24'][0], -10, 4.4)
put(MG + 'swish.wav', SH['s25'][0] + 1.15, -6); put(MG + 'crowd_gasp.wav', SH['s25'][0] + 1.2, -16, 0.9)
put(MG + 'buzzer.wav', SH['s26'][0], -8, 1.4); put(MG + 'crowd_cheer.wav', SUB['s26'], -12, 1.8); put(K + 'celebration/celebration-applause-small.wav', SUB['s26'] + 0.1, -14)
put(K + 'tones/tone-ding-low.wav', SH['s27'][0] + 0.2, -14)
for i in range(4): put(K + 'foley/foley-glass-slide.wav', SH['s28'][0] + i * 0.6, -13)
put(MG + 'crowd_ooh_aah.wav', SH['s28'][0] + 0.5, -16, 1.6)
put(MG + 'sad_trombone.wav', SH['s29'][0] + 0.3, -12, 1.6)
put(K + 'whooshes/whoosh-slow-medium.wav', SH['s30'][0] + 1.4, -12); put(MG + 'crowd_laugh.wav', SH['s30'][0] + 1.6, -18, 1.2)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
