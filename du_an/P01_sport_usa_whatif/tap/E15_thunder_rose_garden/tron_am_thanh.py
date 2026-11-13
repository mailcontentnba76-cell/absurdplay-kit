"""E15: am_thanh/nhac.wav (upbeat "Love Love Love", HoliznaCC0, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (vườn hồng ngoài trời: gió nhẹ, khán giả ngoài trời, lá xào xạc, bước trên cỏ, máy cắt cỏ, tưới nước, kéo tỉa, swish).
Giọng GỐC 71,47 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 71.47
src = open('/root/work/engine/ep15_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(15)
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
# ---- nhạc: vào ngay khung 0; hạ khi xem bảng điểm 2 trận (s3–s5), khựng ở "OKC tries to guard him with a hedge." (s15), hạ khi OKC vượt lên (s20), hạ ở "same as last night" (s24), vang lại ở kết
m = load('alvana-audio/music/upbeat/love-love-love.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SUB['s3'], SH['s6'][0])] = 0.55
gm[span(SH['s15'][0] + 1.3, SH['s15'][1])] = 0.15
gm[span(SH['s19'][0], SH['s20'][1])] = 0.5
gm[span(SH['s24'][0], SH['s24'][1])] = 0.3
gm[span(SUB['s27'], SH['s27'][1])] = 0.5
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
def leaves(t, db=-10): put(K + 'foley/foley-fabric-slide.wav', t, db); put(K + 'foley/foley-paper-slide.wav', t + 0.05, db - 3)
def grass(t, db=-16, n=0.4): put(A + 'footsteps/grass-00%d.wav' % rng.integers(0, 5), t, db, n)
def swish(t, db=-6): put(MG + 'swish.wav', t, db)
# nền: gió nhẹ + khán giả ngoài trời
sfx += bed(A + 'ambience/wind.wav', -34) + bed(MG + 'stadium_crowd_outdoor.wav', -22)
# HOOK khung 0: SGA lao xuyên tường giậu — lá xào xạc + whoosh + khán giả ồ
put(K + 'whooshes/whoosh-fast-medium.wav', 0.0, -8); leaves(0.02, -6); put(MG + 'crowd_gasp.wav', 0.3, -14, 1.0)
put(A + 'whoosh/soft-long.wav', SUB['s2'], -12)
put(MG + 'buzzer.wav', SUB['s3'] + 0.05, -14, 0.8); put(MG + 'buzzer.wav', SUB['s4'] + 0.05, -14, 0.8)
for t0 in (5.6, 9.92, SH['s5'][0]): put(K + 'swishes-and-zips/zip-in-medium.wav', t0, -13)
put(MG + 'sad_trombone.wav', SH['s5'][0] + 0.3, -15, 1.3)
put(K + 'tones/tone-ding-high.wav', SH['s6'][0] + 0.6, -12)
put(K + 'whooshes/whoosh-slow-soft.wav', SH['s7'][0], -10); put(MG + 'crowd_cheer.wav', SUB['s7'] + 0.2, -18, 1.8)
put(K + 'shimmers/shimmer-medium-sparkle.wav', 21.9, -14)
put(MG + 'ref_whistle.wav', SH['s8'][0] + 0.05, -10, 0.7)
for i in range(6): grass(SH['s9'][0] + 0.1 + i * 0.36, -14, 0.3)
put(K + 'shimmers/shimmer-long-sparkle.wav', SH['s9'][0] + 0.2, -14)
put(MG + 'ball_dribble.wav', SH['s10'][0], -14, 0.3); swish(28.6); put(MG + 'crowd_ooh_aah.wav', 28.7, -16, 1.2)
for i in range(7): grass(SH['s12'][0] + 0.2 + i * 0.3, -14, 0.3)
leaves(SH['s12'][0] + 0.6, -14)
put(MG + 'ball_dribble.wav', SH['s13'][0], -11, 1.8); leaves(SH['s13'][0] + 0.2, -12); leaves(SH['s13'][0] + 1.0, -13)
put(K + 'foley/foley-wood-slide.wav', SH['s15'][0] + 0.05, -8); put(MG + 'sneaker_squeak.wav', SH['s15'][0] + 1.2, -12, 0.5); put(MG + 'ball_dribble.wav', SH['s15'][0] + 0.8, -13, 1.2)
put(K + 'tones/tone-ding-low.wav', SH['s16'][0] + 1.1, -12)
mw = load(A + 'ambience/machine-01.wav'); L = int((SUB['s18'] - SH['s17'][0] + 0.3) * SR); mw = np.tile(mw, L // len(mw) + 1)[:L]; f_ = int(0.25 * SR); mw[:f_] *= np.linspace(0, 1, f_); mw[-f_:] *= np.linspace(1, 0, f_)
i0 = int(SH['s17'][0] * SR); sfx[i0:i0 + L] += mw * 10 ** (-10 / 20)
put(A + 'mechanical/gear-winding.wav', SH['s17'][0], -12, 0.8); put(MG + 'crowd_laugh.wav', SH['s17'][0] + 0.6, -16, 1.2)
for i in range(5): leaves(SH['s17'][0] + 0.3 + i * 0.4, -16)
for i in range(3): grass(SUB['s18'] + 0.05 + i * 0.2, -12, 0.25)
swish(46.6); put(MG + 'crowd_cheer.wav', 46.6, -14, 1.0)
put(MG + 'buzzer.wav', SH['s19'][0] + 0.05, -14, 0.7)
put(MG + 'crowd_cheer.wav', SH['s20'][0] + 0.1, -20, 1.4)
leaves(SH['s21'][0] + 0.3, -8); leaves(SH['s21'][0] + 1.0, -11)
for i in range(4): grass(SH['s21'][0] + 0.4 + i * 0.5, -14, 0.3)
put(MG + 'crowd_roar.wav', SH['s21'][0] + 0.6, -18, 1.6)
swish(53.7); swish(55.8); put(MG + 'crowd_cheer.wav', 53.75, -14, 1.2); put(MG + 'crowd_cheer.wav', 55.85, -14, 1.0)
put(MG + 'buzzer.wav', SH['s23'][0], -8, 1.4); put(MG + 'crowd_cheer.wav', SUB['s23'], -12, 1.8); put(K + 'celebration/celebration-applause-small.wav', SUB['s23'] + 0.1, -14)
put(K + 'tones/tone-ding-low.wav', SH['s24'][0] + 0.2, -14)
for i in range(4): put(A + 'water/splash-0%d.wav' % (i + 1), SH['s25'][0] + 0.1 + i * 0.6, -20, 0.5)
for i in range(4): put(K + 'everyday-props/props-scissors.wav', SH['s25'][0] + 0.3 + i * 0.55, -12, 0.4)
put(MG + 'crowd_clap_rhythm.wav', SH['s26'][0], -16, 1.3)
for i in range(8): grass(SH['s27'][0] + 0.2 + i * 0.4, -15, 0.3)
put(MG + 'sad_trombone.wav', SUB['s27'] + 0.2, -13, 1.3)
put(K + 'whooshes/whoosh-slow-medium.wav', SH['s28'][0] + 0.3, -12); put(MG + 'crowd_laugh.wav', SH['s28'][0] + 1.4, -18, 1.2)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
