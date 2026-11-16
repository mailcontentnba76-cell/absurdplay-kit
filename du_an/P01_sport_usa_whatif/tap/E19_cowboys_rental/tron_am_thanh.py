"""E19 (giọng ĐỌC THẲNG, không bíp — theo yêu cầu người dùng 16/11): am_thanh/giong.wav (giọng gốc ×1,05, bíp 1 kHz đè "fucking" = W[1]) + am_thanh/nhac.wav ("Love Love Love", alvana-audio upbeat, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sân bóng châu Âu: nền khán giả ngoài trời + vỗ tay nhịp kiểu khán đài, còi, sút bóng, lưới, "DOINK" cột dọc, cờ phạt, chó sủa vui...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 63.00
src = open('/root/work/engine/ep19_shots.js').read()
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
m = load('alvana-audio/music/funk/breath.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for key, d, g in [('s4', 2.0, 0.55), ('s11', 1.7, 0.4), ('s9c', 1.0, 0.7)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
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
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
WH = lambda t, db=-14: put(K + 'swishes-and-zips/swish-medium.wav', t, db)
bed(MG + 'stadium_crowd_indoor.wav' if False else MG + 'stadium_crowd_outdoor.wav', SH['s1b'][0], SH['s12'][0], -25)
bed(A + 'ambience/wind.wav', 0, SH['s1b'][0], -26); bed(A + 'ambience/wind.wav', SH['s12'][0], DUR, -26)
# hook: đám đông ào vào, cửa bật tung, tiếng hò reo; lia whip sang trong nhà
put(MG + 'crowd_roar.wav', 0.0, -14, 1.7); put(A + 'impact/classic-thud.wav', 0.3, -12); put(A + 'whoosh/air-02.wav', SH['s1'][1] - 0.18, -10)
put(MG + 'crowd_cheer.wav', SH['s1b'][0] + 0.1, -18, 2.4)
put(K + 'pops/pop-soft.wav' if False else A + 'impact/generic-light-001.wav', SH['s2'][0] + 0.3, -18)
put(MG + 'crowd_laugh.wav', SH['s2b'][0] + 0.1, -16, 1.0)
put(MG + 'crowd_roar.wav', SH['s3'][0] + 0.2, -16, 3.5)
put(MG + 'crowd_boo.wav', SH['s4'][0] + 0.9, -10, 2.8)
put(A + 'impact/generic-light-002.wav', SH['s5'][0] + 1.0, -14); put(MG + 'crowd_ooh_aah.wav', SH['s5'][0] + 1.4, -22, 1.0)
for i in range(8): put(A + 'impact/generic-light-00%d.wav' % (i % 5), SH['s5b'][0] + 0.15 + i * 0.32, -22)
put(A + 'impact/bell-heavy-002.wav', SH['s5b'][0] + 2.6, -14)
WH(SH['s6'][0] + 0.6, -14); put(MG + 'crowd_laugh.wav', SH['s6'][0] + 1.2, -20, 1.2)
put(A + 'whoosh/air-01.wav', SH['s6b'][0] + 1.4, -14); put(MG + 'crowd_cheer.wav', SH['s6b'][0] + 2.2, -18, 1.0)
put(MG + 'football_kick.wav' if False else A + 'impact/classic-thud.wav', SH['s7'][0] + 0.55, -18); WH(SH['s7'][0] + 0.7, -14); put(MG + 'crowd_roar.wav', SH['s7'][0] + 1.6, -16, 1.8)
put(A + 'impact/classic-thud.wav', SH['s7b'][0] + 0.7, -12); put(MG + 'crowd_cheer.wav', SH['s7b'][0] + 0.8, -14, 2.4)
for i in range(5): put(K + 'swishes-and-zips/swish-medium.wav', SH['s8b'][0] + 0.3 + i * 0.45, -22)
put(MG + 'crowd_ooh_aah.wav', SH['s9'][0] + 0.6, -20, 1.2)
put(A + 'impact/generic-light-003.wav', SH['s9b'][0] + 0.4, -16); put(MG + 'crowd_laugh.wav', SH['s9b'][0] + 1.6, -14, 1.4)
put(MG + 'stadium_horn.wav', SH['s9c'][0], -16, 1.4)
put(K + 'swishes-and-zips/zip-in-hard.wav', SH['s10'][0] + 0.2, -18)
put(MG + 'crowd_laugh.wav', SH['s10b'][0] + 2.6, -18, 1.6)
put(MG + 'sad_trombone.wav', SH['s11'][0] + 0.2, -16, 1.6)
put(MG + 'crowd_cheer.wav', SH['s12'][0] + 0.3, -20, 2.0); put(A + 'whoosh/air-01.wav', SH['s12'][0] + 2.6, -16); put(A + 'impact/classic-stamp.wav', SH['s12'][0] + 4.0, -8)
put(MG + 'crowd_laugh.wav', SH['s12'][0] + 4.1, -16, 1.6)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
