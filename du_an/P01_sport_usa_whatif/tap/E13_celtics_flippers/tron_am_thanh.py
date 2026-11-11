"""E13: am_thanh/nhac.wav (chiptune "Sunny Afternoon", alvana-audio, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (nhà thi đấu Philadelphia: khán giả, chân vịt "bẹp bẹp", còi, bóng, swish, áo phao "phụt", mái chèo, nước dâng, kèn buồn).
Giọng GỐC 68,52 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 68.52
src = open('/root/work/engine/ep13_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(13)
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
# ---- nhạc: vào ngay khung 0; hạ khi xem bảng điểm tối qua (s3–s5), khựng ở "Okay." (s14), hạ ở "changed nothing" (s31–s33), vang lại ở cảnh nước dâng
m = load('alvana-audio/music/chiptune/sunny-afternoon.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SH['s3'][0], SH['s6'][0])] = 0.55
gm[span(SH['s14'][0], SH['s14'][1])] = 0.1
gm[span(SH['s31'][0], SH['s34'][1])] = 0.5
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
def slap(t, db=-12): put(A + 'water/slime-%02d.wav' % rng.integers(1, 17), t, db, 0.35)
def slaps(t0, t1, hz=3.2, db=-13):
    t = t0
    while t < t1: slap(t, db + rng.uniform(-2, 1)); t += 1 / hz + rng.uniform(-0.04, 0.04)
ARENA = np.ones(N); ARENA[span(SH['s3'][0], SH['s3'][1])] = 0.5; ARENA = ma(ARENA, sm)
sfx += bed(MG + 'crowd_ambience.wav', -20, ARENA)
put(K + 'cinematic-hits/cinematic-drum-big.wav', 0.0, -8); slaps(0.05, SH['s1'][1], 3.6, -9)
put(MG + 'crowd_gasp.wav', 0.3, -14, 1.0)
put(K + 'whooshes/whoosh-medium-medium.wav', SUB['s2'] - 0.15, -12); slaps(SUB['s2'] + 0.2, SH['s2'][1], 2.2, -10)
put(MG + 'buzzer.wav', SH['s3'][0] + 0.1, -12, 1.0)
put(K + 'tones/tone-ding-high.wav', 10.06, -14)
put(MG + 'sad_trombone.wav', 10.4, -15, 1.2)
put(K + 'cinematic-hits/cinematic-slam-big.wav', 11.78, -10)
put(MG + 'ref_whistle.wav', SH['s6'][0] + 0.3, -14, 0.6)
put(K + 'appear-and-vanish/appear-poof.wav', SH['s7'][0] + 0.15, -12); slap(SH['s7'][0] + 1.0, -10); slap(SH['s7'][0] + 1.3, -10)
put(K + 'cinematic-hits/cinematic-slam-big.wav', SH['s8'][0], -8); slaps(SH['s8'][0] + 0.1, SH['s8'][1], 4.0, -9)
put(MG + 'ref_whistle.wav', SH['s9'][0] + 0.05, -10, 0.7)
slaps(SH['s10'][0], SH['s10'][1], 5.0, -9); put(MG + 'crowd_laugh.wav', SH['s10'][0] + 0.8, -16, 1.8)
put(MG + 'ball_dribble.wav', SH['s11'][0], -12, 2.4); slaps(SH['s11'][0] + 0.2, SH['s11'][1], 1.5, -14)
slap(SH['s12'][0] + 0.25, -9); slap(SH['s12'][0] + 0.95, -8)
put(MG + 'swish.wav', SH['s12'][0] + 1.42, -6); put(MG + 'crowd_ooh_aah.wav', SH['s13'][0] + 0.1, -14, 1.2)
put(K + 'pops/pop-large-in.wav', SH['s15'][0], -8); put(K + 'appear-and-vanish/appear-burst.wav', SH['s15'][0] + 0.05, -12)
put(MG + 'ball_dribble.wav', SH['s16'][0] + 0.3, -12, 1.6); put(K + 'bounce-spin-zoom/move-bounce.wav', SH['s16'][0] + 0.6, -14)
put(MG + 'buzzer.wav', SH['s17'][0] + 0.05, -12, 0.9)
put(MG + 'ref_whistle.wav', SH['s18'][0] + 0.05, -9, 0.8)
put(MG + 'ref_whistle.wav', SH['s20'][0] + 0.05, -8, 0.9)
put(K + 'cinematic-hits/cinematic-drum-big.wav', SH['s21'][0], -9); put(A + 'water/splash-03.wav', SH['s21'][0] + 0.1, -12)
for t0 in np.arange(SH['s21'][0] + 0.3, SH['s23'][0], 0.87): put(A + 'water/splash-0%d.wav' % rng.integers(1, 8), t0, -18, 0.5)
slap(SH['s23'][0] + 0.2, -16)
put(MG + 'swish.wav', SH['s24'][0] + 0.05, -5); put(MG + 'crowd_cheer.wav', SH['s24'][0] + 0.2, -14, 1.4)
put(MG + 'rim_dunk.wav', SH['s25'][0] + 1.45, -8); put(MG + 'crowd_boo.wav', SH['s25'][0] + 1.6, -16, 1.4)
put(MG + 'buzzer.wav', SH['s26'][0] + 0.05, -12, 0.9)
for t0 in np.arange(SUB['s27'] + 0.1, SH['s27'][1], 0.87): put(A + 'water/splash-0%d.wav' % rng.integers(1, 8), t0, -18, 0.5)
put(MG + 'crowd_roar.wav', SH['s28'][0] + 0.2, -10, 2.6); put(MG + 'crowd_chant_defense.wav', SH['s28'][0] + 0.6, -16, 2.0)
put(MG + 'buzzer.wav', SH['s29'][0] + 0.05, -8, 1.4); put(K + 'celebration/celebration-confetti.wav', SUB['s29'], -12); put(MG + 'crowd_cheer.wav', SUB['s29'] + 0.1, -14, 1.4)
put(K + 'cinematic-hits/cinematic-slam-big.wav', SH['s30'][0] + 0.1, -11)
for k in ('s31', 's32', 's33'): put(K + 'tones/tone-ding-high.wav', SH[k][0] + 0.05, -16)
slaps(SH['s31'][0] + 0.3, SH['s31'][1], 3.0, -12)
put(MG + 'sad_trombone.wav', SH['s34'][0] + 0.1, -12, 1.5)
put(K + 'risers-and-fallers/riser-2s-strong.wav', SH['s35'][0], -12); put(A + 'water/splash-01.wav', SH['s35'][0] + 0.3, -8); put(A + 'water/splash-05.wav', SH['s35'][0] + 1.1, -10)
for i in range(10): put(A + 'water/bubble-0%d.wav' % (i % 3 + 1), SH['s35'][0] + 0.8 + i * 0.22, -16)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
