"""E24 Mascot NBA Bucks thật vs dân 1776 (không chửi tục): giọng gốc (không atempo) + nhạc alvana chiptune/pixel-party (chưa dùng) + SFX:
khói biến hình, cộc vành, bò thở, tên lửa, Mặt Trời, còi nhảy tranh bóng, CLANG ×2, bút lông viết, buzzer, vó phi, Chuông Tự do (bell-heavy), 5 tiếng bật đuôi, gạc rơi, CRACK, im lặng ho khan, gió bay chậm."""
import subprocess, re, numpy as np, os
SR = 48000; LIB = '/home/claude/audio/'; MG = '/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/tai_nguyen/am_thanh/magnific_sfx/'; DUR = 94.40
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine/ep24_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"([a-z]\d+):\[([\d.,]+)\]", src.split('END')[0])}
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
m = load('alvana-audio/music/chiptune/pixel-party.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for a_, b_ in [(SH['c2'][0], SH['c3'][0] + 2.4)]:  # "No sound": nhạc tắt lặng sau tiếng nứt
    w = (T > a_) & (T < b_); gm[w] = 0.05
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
def hooves(t0, t1, rate=7.0, db=-16):
    t = t0; j = 0
    while t < t1: put(A + 'footsteps/rpg-0%d.wav' % (j % 10), t, db, 0.25); t += 1 / rate * (0.8 if j % 2 else 1.2); j += 1
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'crowd_ambience.wav', 0, DUR, -24)
for k in ['h0', 'm1', 'm2', 'm3', 'g1']: WH(SH[k][1] - 0.14, -16)
# h0: khói biến hình + cộc vành
put(A + 'pop/classic-pop.wav', 0.72, -10); put(A + 'impact/classic-thud.wav', 0.78, -12)
put(MG + 'backboard_bang.wav', 1.45, -8, 0.8); put(A + 'foley/metal-05.wav', 1.47, -12); put(MG + 'crowd_ooh_aah.wav', 1.7, -20, 1.4)
# montage
put(A + 'creature/grunt-02.wav', SH['m1'][0] + 0.3, -10); hooves(SH['m1'][0], SH['m1'][1], 9, -14)
put(A + 'riser/quick-1s.wav', SH['m2'][0] + 0.1, -14); put(A + 'explosion/low-frequency-explosion-000.wav', SH['m2'][0] + 0.55, -12); put(A + 'explosion/firework-loop.wav', SH['m2'][0] + 0.6, -20, 1.4)
put(A + 'magic/shimmer-pad.wav', SH['m3'][0] + 0.1, -14, 2.4); put(A + 'impact/classic-stamp.wav', 9.9, -14)
put(MG + 'stadium_horn.wav', SH['g1'][0] + 0.05, -18, 1.2)
put(MG + 'crowd_cheer.wav', SH['g2'][0] + 0.3, -22, 1.4); put(MG + 'crowd_cheer.wav', SH['g3'][0] + 0.3, -22, 1.6)
put(A + 'paper/paper-02.wav', SH['g3'][0] + 2.7, -12)
put(A + 'impact/classic-stamp.wav', SH['r0'][0] + 0.9, -14)
put(MG + 'sad_trombone.wav', 25.5, -20, 1.8); put(MG + 'crowd_cheer.wav', SH['r2'][0] + 0.6, -20, 1.6)
# d1 nhảy tranh bóng
put(MG + 'ref_whistle.wav', 29.95, -18, 0.7); put(A + 'whoosh/fast-bright.wav', SH['d1'][0] + 1.0, -12); put(MG + 'crowd_ooh_aah.wav', SH['d1'][0] + 1.6, -18, 1.6)
# d2 phi + bật, hụt 1 foot
hooves(SH['d2'][0], SH['d2'][0] + 0.9, 8, -14); put(A + 'whoosh/air-02.wav', SH['d2'][0] + 0.95, -12); put(MG + 'crowd_gasp.wav', 36.9, -20, 1.0)
# CLANG ×2
for tc in (37.78, 38.22): put(MG + 'backboard_bang.wav', tc, -6, 0.7); put(A + 'foley/metal-pot-1.wav', tc, -8); put(K + 'cinematic-hits/cinematic-metal-big.wav', tc, -16, 0.5)
put(MG + 'crowd_laugh.wav', 38.6, -20, 1.4)
# p1 bút lông + ho khan im lặng
put(MG + 'crowd_silence_cough.wav', SH['p1'][0] + 0.2, -16, 3.5)
for i in range(4): put(K + 'writing-and-drawing/writing-pen-write.wav', 41.2 + i * 0.7, -10, 0.7)
put(MG + 'buzzer.wav', 44.08, -12, 0.9); put(MG + 'ref_whistle.wav', 44.6, -18, 0.6)
# s1 tốc độ
put(A + 'whoosh/pass-by.wav', 47.8, -10); hooves(SH['s1'][0] + 0.3, SH['s1'][0] + 3.2, 10, -12); put(MG + 'swish.wav', 50.6, -8, 0.6); put(MG + 'crowd_roar.wav', 50.7, -18, 1.5)
# chuông
put(A + 'impact/bell-heavy-000.wav', SH['b1'][0] + 0.75, -4); put(A + 'impact/bell-heavy-002.wav', SH['b1'][0] + 1.95, -10); put(K + 'cinematic-hits/cinematic-metal-massive.wav', SH['b1'][0] + 0.75, -18, 1.2)
for i in range(5): put(A + 'pop/pop-%d.wav' % (i % 4 + 1), SH['b2'][0] + 0.4 + i * 0.42, -8)
hooves(SH['b3'][0], SH['b3'][1] - 0.6, 11, -12); put(MG + 'crowd_laugh.wav', SH['b3'][0] + 0.8, -16, 2.0)
# gạc rơi
put(A + 'break/falling-02.wav', SH['a1'][0] + 2.2, -10, 0.8); put(A + 'impact/classic-thud.wav', SH['a1'][0] + 2.2, -14)
put(MG + 'sad_trombone.wav', SH['a2'][0] + 1.4, -24, 1.6)
# hiệp 4: chuông lần 2 → CRACK → im lặng
put(MG + 'stadium_horn.wav', SH['c1'][0] + 0.05, -20, 1.0)
put(A + 'impact/bell-heavy-001.wav', SH['c1'][0] + 0.85, -8, 1.4)
put(A + 'break/breaking-01.wav', 70.42, -4, 0.9); put(A + 'impact/glass-heavy-000.wav', 70.45, -12)
put(MG + 'crowd_silence_cough.wav', SH['c3'][0] + 1.0, -14, 3.2)
hooves(SH['c4'][0], SH['c4'][1], 11, -11); put(MG + 'crowd_roar.wav', SH['c4'][0] + 0.2, -14, 2.5)
# cú bay cuối chậm
put(A + 'riser/tension-4s.wav', SH['l1'][0] + 0.3, -14); put(A + 'whoosh/soft-long.wav', SH['l1'][0] + 0.5, -14)
put(A + 'paper/slide.wav', SH['l2'][0] + 0.2, -10); put(A + 'paper/paper-03.wav', SH['l2'][0] + 0.5, -12)
put(A + 'misc/misc-07.wav', SH['l3'][0] + 1.5, -18, 0.6)
put(A + 'impact/classic-stamp.wav', 90.2, -14); put(MG + 'crowd_ooh_aah.wav', SH['e1'][0] + 0.4, -22, 2.0)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
