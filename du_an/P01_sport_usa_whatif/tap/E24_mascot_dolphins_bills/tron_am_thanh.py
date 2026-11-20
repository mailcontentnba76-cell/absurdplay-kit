"""E24 Mascot Dolphins vs Bills (không chửi tục): giọng ×1,05 + nhạc alvana upbeat/bouncing (chưa dùng) + SFX: biến hình, quẫy ướt (slime), vó bison, tuyết, mái sưởi, splash, đám đông cười."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 77.80
src = open('/root/work/engine/ep24_dolphins_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"([hs]\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', f if f.startswith('/') or f.startswith('am_thanh') else LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
voice = load('am_thanh/giong_raw.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
save('giong', voice); LV = lufs(voice)
sm = int(0.08 * SR)
m = load('alvana-audio/music/upbeat/bouncing.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)  # nhạc nền nhỏ (giọng −13 LU)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'stadium_crowd_outdoor.wav', 0, DUR, -32)
for k in ['h0', 'h1', 'h2', 'h3']: WH(SH[k][1] - 0.14, -14)
put(A + 'impact/subdrop-short.wav', 0.05, -12)
put(A + 'pop/classic-pop.wav', 2.38, -10); put(A + 'impact/subdrop-short.wav', 2.5, -10)
for i in range(4): put(A + 'water/slime-0%d.wav' % (i % 5 + 1), 2.7 + i * 0.22, -16)
put(MG + 'stadium_horn.wav', SH['h1'][0] + 0.05, -18, 1.2)
for i in range(3): put(A + 'water/slime-0%d.wav' % (i + 2), SH['h2'][0] + 1.7 + i * 0.6, -14)
for i in range(3): put(A + 'footsteps/snow-00%d.wav' % i, SH['h3'][0] + 0.3 + i * 0.5, -10)
put(A + 'impact/subdrop-short.wav', SH['h3'][0] + 1.0, -16)
for i in range(14): put(A + 'footsteps/grass-00%d.wav' % (i % 5), SH['h4'][0] + 0.1 + i * 0.19, -8)
put(MG + 'crowd_roar.wav', SH['s1'][0] + 0.2, -24, 2.0); put(A + 'impact/classic-stamp.wav', 14.56, -14)
put(MG + 'stadium_crowd_outdoor.wav', SH['s2'][0], -22, 2.3)
for i, tt in enumerate([21.16, 22.02, 22.74]): put(A + 'water/slime-0%d.wav' % (i + 1), tt, -6); put(A + 'impact/soft-medium-00%d.wav' % i, tt + 0.05, -12)
put(MG + 'crowd_laugh.wav', 22.9, -18, 2.0); put(A + 'misc/spring-03.wav', 24.5, -16)
put(MG + 'football_kick.wav', 25.5, -14, 0.6)
for i in range(22): put(A + 'footsteps/grass-00%d.wav' % (i % 5), SH['s4'][0] + 0.2 + i * 0.19, -8)
put(A + 'whoosh/swish-3.wav', 27.0, -16); put(A + 'whoosh/swish-3.wav', 28.0, -16)
put(MG + 'crowd_roar.wav', 29.6, -14, 2.4); put(MG + 'stadium_horn.wav', 29.9, -18, 1.4)
put(A + 'magic/shimmer-pad.wav', 32.6, -20, 3.0)
put(A + 'magic/sparkle-rise.wav', 35.8, -14)
put(A + 'ambience/' + __import__('os').listdir('/root/work/assets/audio/alvana-audio/sfx/ambience')[0], 35.6, -26, 6.0)
put(A + 'riser/' + sorted(__import__('os').listdir('/root/work/assets/audio/alvana-audio/sfx/riser'))[0], 37.5, -16)
put(A + 'magic/sparkle.wav', 42.06, -16); put(MG + 'sad_trombone.wav', 43.3, -16, 2.0); put(MG + 'crowd_laugh.wav', 44.0, -20, 1.6)
put(A + 'misc/weird-02.wav', 45.7, -18, 1.0)
for i in range(16): put(A + 'footsteps/grass-00%d.wav' % (i % 5), 48.2 + i * 0.18, -14)
put(MG + 'crowd_roar.wav', 51.0, -18, 1.6)
put(A + 'water/bubble-01.wav', 55.2, -14); put(A + 'whoosh/swish-3.wav', 57.2, -12)
put(A + 'water/slime-04.wav', 58.0, -2); put(A + 'water/slime-05.wav', 58.08, -4); put(A + 'water/bubble-02.wav', 58.2, -8)
put(MG + 'crowd_gasp.wav', 58.3, -18, 1.4)
put(A + 'misc/weird-04.wav', 62.6, -18, 0.8); put(A + 'misc/spring-05.wav', 64.3, -16)
put(A + 'impact/classic-stamp.wav', 67.94, -10)
for i in range(10): put(A + 'footsteps/grass-00%d.wav' % (i % 5), 68.0 + i * 0.19, -8)
put(MG + 'crowd_roar.wav', 68.5, -16, 1.6)
put(A + 'whoosh/swish-3.wav', SH['s11'][0] + 0.1, -16); put(A + 'impact/classic-stamp.wav', 71.3, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
