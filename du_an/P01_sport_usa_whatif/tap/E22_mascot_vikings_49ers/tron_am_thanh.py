"""E22 Mascot (không chửi tục): giọng ×1,05 + nhạc alvana chiptune/adventure-begins-loop (CC0, chưa dùng) + SFX: tù và/trống chiến, khiên va, cuốc đào, đất bung, vàng lấp lánh, còi, đám đông."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 98.20
src = open('/root/work/engine/ep22_shots.js').read()
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
m = load('alvana-audio/music/chiptune/adventure-begins-loop.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
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
for k in ['h1', 'h2', 'h3', 'h4', 'h5']: WH(SH[k][1] - 0.14, -14)
put(A + 'impact/subdrop-short.wav', 0.05, -12)
put(MG + 'stadium_horn.wav', SH['h1'][0] + 0.05, -16, 1.7)
put(A + 'impact/soft-heavy-001.wav', SH['h1'][0] + 0.6, -14)
put(A + 'impact/soft-heavy-003.wav', SH['h3'][0] + 0.1, -10); put(A + 'impact/soft-heavy-004.wav', SH['h3'][0] + 1.0, -12)
put(A + 'whoosh/reverse.wav', SH['h4'][0] + 0.2, -8); put(A + 'impact/subdrop-short.wav', SH['h4'][0] + 0.9, -12)
for i in range(4): put(A + 'impact/soft-medium-00%d.wav' % i, SH['h5'][0] + 0.3 + i * 0.36, -20)
put(A + 'impact/classic-stamp.wav', SH['h7'][0] + 0.1, -14)
for i in range(6): put(A + 'impact/soft-medium-00%d.wav' % (i % 5), SH['h7'][0] + 0.3 + i * 0.12, -24)
put(MG + 'crowd_roar.wav', SH['s1'][0] + 0.2, -24, 2.0); put(MG + 'drumline.wav', SH['s2'][0], -20, 4.4)
for i in range(8): put(A + 'impact/soft-heavy-00%d.wav' % (i % 5), SH['s2'][0] + 0.15 + i * 0.29, -16)
put(MG + 'crowd_gasp.wav', SH['s3'][0] + 0.3, -26, 1.2)
put(MG + 'football_kick.wav', SH['s5'][0] + 0.0, -16, 0.6); put(MG + 'crowd_cheer.wav', SH['s5'][0] + 1.2, -20, 1.6)
for i in range(4): put(A + 'impact/soft-heavy-00%d.wav' % i, SH['s6'][0] + 1.2 + i * 0.25, -12)
put(MG + 'football_hit.wav', SH['s7'][0] + 0.9, -14, 0.6); put(MG + 'crowd_cheer.wav', SH['s7'][0] + 0.2, -18, 1.8)
for i in range(4): put(A + 'impact/soft-heavy-00%d.wav' % i, SH['s9'][0] + 0.2 + i * 0.3, -16)
for i in range(7): put(A + 'impact/soft-medium-00%d.wav' % (i % 5), SH['s9'][0] + 1.7 + i * 0.31, -14)
put(A + 'impact/subdrop-short.wav', SH['s10'][0] + 1.4, -14); put(A + 'impact/soft-heavy-002.wav', SH['s10'][0] + 2.55, -8)
put(MG + 'crowd_cheer.wav', SH['s11'][0], -18, 1.8)
put(A + 'impact/classic-stamp.wav', SH['s12'][0] + 1.95, -12)
put(A + 'impact/soft-medium-002.wav', SH['s12'][0] + 2.4, -16)
put(A + 'pop/classic-pop.wav', 63.9, -14)
put(A + 'misc/weird-02.wav', SH['s15'][0] + 0.05, -16, 1.0)
put(MG + 'crowd_gasp.wav', SH['s15'][0] + 0.8, -22, 1.2)
put(MG + 'crowd_laugh.wav', SH['s16'][0] + 0.4, -20, 2.4)
put(MG + 'crowd_cheer.wav', SH['s17'][0] + 1.6, -18, 1.6)
put(A + 'whoosh/swish-3.wav', SH['s18'][0] + 1.8, -12)
put(A + 'whoosh/reverse.wav', SH['s19'][0] + 0.1, -18)
put(A + 'whoosh/swish-3.wav', SH['s20'][0] + 0.3, -12); put(A + 'impact/soft-heavy-001.wav', SH['s20'][0] + 1.6, -12)
put(MG + 'crowd_cheer.wav', SH['s21'][0], -16, 2.0)
put(A + 'impact/subdrop-short.wav', SH['s22'][0] + 0.8, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
