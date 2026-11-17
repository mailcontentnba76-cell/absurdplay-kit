"""E20 (đọc thẳng, KHÔNG bíp): giọng ×1,05 + nhạc chiptune/game-boi-1 (alvana CC0, chưa dùng) + SFX sân tập (gió chiều, lò xo khi hình nộm nhảy, va đệm, còi, đá bóng, pháo giấy)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 62.40
src = open('/root/work/engine/ep20_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
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
m = load('alvana-audio/music/chiptune/game-boi-1.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[(T >= 18.14) & (T < 19.3)] = 0.45
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
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
SP = lambda t, db=-20, k=1: put(A + 'misc/spring-0%d.wav' % (1 + k % 9), t, db, 0.35)
TH = lambda t, db=-18: put(A + 'impact/soft-thump.wav', t, db)
def hops(t0, dur, n, db=-22, k0=0):
    for i in range(n): SP(t0 + dur * (i + 0.86), db, k0 + i); TH(t0 + dur * (i + 0.86), db - 4)
WH = lambda t, db=-12: put(A + 'whoosh/swish-3.wav', t, db)
# nền gió chiều ngoài trời suốt video (thấp)
bed(A + 'ambience/wind.wav', 0, DUR, -30)
# hook: hình nộm nhảy lò cò, whip pan, "ồ" nhỏ
hops(-0.25, 0.36, 5, -16); WH(SH['s1'][1] - 0.2, -10)
put(MG + 'crowd_gasp.wav', SH['s1b'][0] + 0.2, -24, 1.2)
put(A + 'body/breath.wav', SH['s2'][0] + 0.4, -22)
put(A + 'impact/classic-stamp.wav', 6.5, -12); put(A + 'impact/classic-stamp.wav', 11.6, -12)
for i in range(4): put(A + 'impact/soft-medium-00%d.wav' % i, SH['s4'][0] + 2.7 + i * 0.18, -22)
# Darkness Falls: tắt đèn (cầu dao) + trầm
for i in range(4): put(A + 'mechanical/switch-0%d.wav' % (1 + i % 2), 18.14 + i * 0.16, -14)
put(A + 'impact/subdrop-short.wav', 18.2, -14)
put(MG + 'ref_whistle.wav', SH['s6'][0] + 0.2, -22, 0.8)
for i in range(4): t = SH['s6b'][0] + i * 1.09; put(MG + 'football_kick.wav', t + 0.85, -24, 0.4); put(A + 'impact/soft-heavy-00%d.wav' % i, t + 1.22, -16)
put(MG + 'football_hit.wav', SH['s7'][0] + 0.95, -14, 0.8)
for i in range(6): put(A + 'impact/soft-medium-00%d.wav' % (i % 5), SH['s7'][0] + 1.3 + i * 0.45, -24)
put(A + 'body/breath.wav', SH['s7b'][0] + 0.1, -18)
put(A + 'mechanical/metal-click.wav', SH['s8'][0] + 0.25, -10); put(A + 'misc/weird-02.wav', SH['s8'][0] + 0.3, -22, 0.6)
hops(SH['s9'][0] - 0.05, 0.31, 9, -18, 3); put(A + 'mechanical/switch-01.wav', 36.85, -14); put(MG + 'crowd_cheer.wav', 36.9, -22, 1.2)
for k0 in [0.25, 0.95, 1.65]: put(MG + 'football_kick.wav', SH['s10'][0] + k0 + 0.06, -14, 0.5); SP(SH['s10'][0] + k0, -20, 4)
put(MG + 'football_hit.wav', SH['s11'][0] + 0.6, -16, 0.6); put(MG + 'football_hit.wav', SH['s11'][0] + 2.2, -16, 0.6)
put(A + 'mechanical/clock-tick-tock.wav', SH['s12'][0] + 0.2, -16, 2.6); put(MG + 'buzzer.wav', SH['s12b'][0] - 0.05, -16, 1.0)
put(MG + 'crowd_cheer.wav', SH['s12b'][0] + 0.05, -18, 1.4); hops(SH['s12b'][0], 0.38, 3, -22, 1)
put(A + 'whoosh/reverse.wav', SH['s13'][0] - 0.3, -16); put(MG + 'football_hit.wav', SH['s13'][0] + 1.6, -16, 0.6); put(A + 'impact/soft-heavy-002.wav', SH['s13'][0] + 2.1, -12)
put(A + 'impact/soft-heavy-004.wav', SH['s14'][0] + 1.15, -10); put(A + 'impact/classic-stamp.wav', 52.9, -12)
put(MG + 'sad_trombone.wav', SH['s15'][0] + 0.2, -16, 1.6); hops(SH['s15'][0] - 0.5, 0.4, 8, -28, 2)
hops(SH['s16'][0] - 0.6, 0.42, 12, -26, 5); put(A + 'impact/classic-stamp.wav', 57.9, -12); put(K + 'pops/pop-soft.wav' if False else A + 'pop/classic-pop.wav', 60.0, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
