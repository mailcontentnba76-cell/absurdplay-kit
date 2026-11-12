"""E16: am_thanh/giong.wav (giọng gốc ×1,1, bíp 1 kHz đè "fuck") + am_thanh/nhac.wav ("Quiet Village 1", alvana-audio ambient, CC0 — chưa dùng)
+ am_thanh/sfx.wav (phim tài liệu: chim rừng, gió, màn trập máy ảnh, vỗ cánh/whoosh khi bay, điện thoại reo, dấu mộc...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 76.40
src = open('/root/work/engine/ep16_shots.js').read()
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
W = json.load(open('giong/words_raw.json')); assert W[2][2].startswith('fuck'); a, b = W[2][0] - 0.02, W[2][1] + 0.03
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b, W[2])
sm = int(0.08 * SR)
m = load('alvana-audio/music/ambient/quiet-village-1.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 8 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s1b'][0]] = 0.4
for key, d, g in [('s5b', 1.2, 0.5), ('s9', 3.0, 0.6), ('s15', 1.4, 0.4)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'
STAMP = lambda t, db=-8: put(A + 'impact/classic-stamp.wav', t, db)
NOTE = lambda t, db=-14: put(K + 'writing-and-drawing/writing-marker-draw.wav', t, db, 0.6)
# nền tự nhiên theo vùng
bed(OC + 'AMBForst_ForestBirds_OS_01.ogg', 0, SH['s4b'][0], -24); bed(A + 'ambience/wind.wav', SH['s4b'][0], SH['s5'][0], -18)
bed(OC + 'AMBForst_ForestBirds_OS_02.ogg', SH['s5'][0], SH['s6'][0], -24); bed(A + 'ambience/wind.wav', SH['s6'][0], SH['s6b'][0], -18)
bed(A + 'ambience/wind.wav', SH['s6b'][0], SH['s9'][0], -26); bed(A + 'ambience/wind.wav', SH['s9'][0], SH['s10c'][0], -22)
bed(A + 'ambience/wind.wav', SH['s10c'][0], SH['s11'][0], -18); bed(OC + 'AMBForst_ForestBirds_OS_03.ogg', SH['s11'][0], SH['s14'][0], -24)
bed(A + 'ambience/night-crickets.wav', SH['s14'][0], DUR, -22)
# máy ảnh tài liệu
put(A + 'camera/shutter-film.wav', 0.15, -14); put(A + 'camera/shutter-fast.wav', SH['s2'][0] + 0.1, -16)
for tt in (6.5, 7.66, 9.08, 12.44): NOTE(tt)
put(A + 'whoosh/fast-bright.wav', SH['s4b'][0], -10); put(K + 'money/money-register.wav', 12.5, -16)
put(MG + 'crowd_gasp.wav', SH['s5'][0] + 2.0, -22, 1.0); STAMP(20.84); put(MG + 'sad_trombone.wav', 21.0, -18, 0.8)
put(A + 'whoosh/fast-bright.wav', SH['s6'][0], -10); put(A + 'impact/classic-thud.wav', SH['s6b'][0] + 0.45, -10)
put(MG + 'crowd_ooh_aah.wav', 27.1, -22, 1.2); put(K + 'phone/phone-keypad.wav', 30.96, -20, 0.4); STAMP(30.96, -12)
put(K + 'time/time-clock.wav', 32.48, -14, 2.8)
for tt in (38.8, 39.84, 41.12, 42.0): NOTE(tt, -12)
put(MG + 'football_kick.wav', SH['s9b'][0] + 1.4, -16); put(A + 'impact/classic-thud.wav', SH['s9b'][0] + 2.3, -14)
put(K + 'phone/phone-ring-classic.wav', SH['s10'][0], -12, 1.3); STAMP(44.78, -10); put(K + 'money/money-register.wav', 44.9, -16)
put(A + 'whoosh/fast-bright.wav', SH['s10c'][0], -10); STAMP(46.38, -10)
put(A + 'impact/classic-thud.wav', SH['s11'][0] + 0.4, -8); put(MG + 'football_hit.wav', SH['s11c'][0] + 1.9, -14); NOTE(51.96, -12)
put(A + 'camera/shutter-dslr.wav', 55.9, -16); put(A + 'camera/shutter-fast.wav', 56.3, -18); put(A + 'camera/shutter-dslr.wav', 59.2, -14)
put(MG + 'stadium_horn.wav', 62.76, -18, 1.0); put(MG + 'crowd_laugh.wav', 66.4, -20, 1.2)
put(MG + 'crowd_roar.wav', SH['s14'][0] + 0.5, -26, 3.0); put(A + 'impact/cinematic-heavy.wav', SH['s15'][0], -14)
STAMP(73.48, -4); put(MG + 'crowd_laugh.wav', 73.8, -18, 1.8)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
