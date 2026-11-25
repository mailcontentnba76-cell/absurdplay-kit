"""E29 Panthers vs Ravens (nhạc ElevenLabs "Jungle Showdown" + tiếng quạ/vỗ cánh ElevenLabs trong assets/audio/e29_thu, báo e25_thu, mưa Meta)
E27 gốc: giọng ×1,05 + nhạc ElevenLabs Music "Cornfield Kickoff" (country–rock hoedown, tạo riêng 22/11) + banjo stinger + SFX: bóc vỏ, nứt hạt dẻ, đá bóng, đám đông, máy gặt, cột gôn đổ, sói hú."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 72.40
src = open('/root/work/engine/ep29pr_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"([hsd]\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', f if f.startswith('/') or f.startswith('am_thanh') else LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
voice = load('am_thanh/giong.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
save('giong', voice); LV = lufs(voice)
sm = int(0.08 * SR)
import os
MUS = '/root/work/assets/audio/e29/jungle_showdown.mp3'
m = load(MUS if os.path.exists(MUS) else '/root/work/assets/audio/e27/cornfield_kickoff.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
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
def put2(fn, t, db=0.0, ss=0.0, n=None):
    x = load(fn)[int(ss * SR):] * 10 ** (db / 20)
    if n: x = x[:int(n * SR)].copy(); f_ = min(len(x), int(0.15 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    f0 = min(len(x), int(0.02 * SR)); x[:f0] *= np.linspace(0, 1, f0)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
TH = '/root/work/assets/audio/e25_thu/'; FS = '/root/work/assets/audio/Free-SFX/'; MO = '/root/work/assets/audio/Meta-open-sound/corpora/oculus-audio-pack/ogg/'
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'
T8 = '/root/work/assets/audio/e29_thu/'
def thu(name, t, db=0.0, n=None, ss=0.0):
    f = T8 + name + '.mp3'
    if os.path.exists(f): put2(f, t, db, ss, n)
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
CL = lambda t, db=-10: put(A + 'impact/metallic.wav', t, db)
HIT = lambda t, db=-12: put(MG + 'football_hit.wav', t, db)
RIP = lambda t, db=-6: put('/root/work/assets/audio/xe_ao_rip.wav', t, db, 0.6)
bed(MG + 'stadium_crowd_outdoor.wav', 0, DUR, -30)
for k in SH:
    if k != 'h0': WH(SH[k][0] - 0.12, -17)
BJ = lambda t, i=1, db=-12: put(MO + f'MUSCStngr_BanjoHumorous_OS_0{i}.ogg', t, db)
SPL = lambda t, db=-8: put('sfx-kit/sounds/everyday-props/props-splash.wav', t, db)
BAO = lambda nm, t, db=-8, n=None, ss=0.0: put2(TH + nm + '.mp3', t, db, ss, n)
CAW = lambda t, db=-8, n=0.9, ss=0.0: thu('raven_caw', t, db, n, 1.15 + min(ss, 0.4))
FLAP = lambda t, db=-10, n=1.5, ss=0.0: thu('wing_flap', t, db, n, ss)
bed(MO + 'RAINVege_ForestRain_LOOP_01.ogg', 0, DUR, -16)
# h0: "What if…" → xé áo (4 lần), báo gầm, quạ kêu + vỗ cánh
for tt in [3.55, 3.78, 4.0, 4.22]: RIP(tt, -8)
BAO('bao_gamgu', 4.2, -8, 1.0); CAW(4.6, -10, 0.8); FLAP(4.5, -12, 0.9)
# hk: quạ trên xà kêu, báo gầm gừ
CAW(5.35, -6, 0.9); BAO('bao_gamgu', 6.4, -9, 1.0)
# s1: bảng điện lật 7 lần
for tt in [8.6, 9.0, 9.4, 9.8, 10.2, 10.6, 11.0]: put(MG + 'football_hit.wav', tt, -20)
put(MG + 'crowd_ooh_aah.wav', 9.2, -18, 2.0)
# s1b: lắc nước
SPL(12.3, -10); SPL(12.7, -14)
# s3: đàn quạ bay vào
FLAP(13.8, -8, 2.4); FLAP(15.13, -10, 2.0, 1.0); CAW(16.24, -12, 1.0, 1.0)
# s3b: mổ then, nắp bật
for i in range(5): put(MG + 'football_hit.wav', 20.3 + i * 0.32, -22)
CL(21.56, -10); put(MG + 'crowd_ooh_aah.wav', 21.0, -18, 1.5); CAW(24.19, -10, 1.0)
# s4: báo bước ra, gầm nhẹ
BAO('bao_khe', 29.5, -10, 1.0)
# s4b: lao vào vũng nước
SPL(33.9, -4); SPL(34.57, -12); SPL(35.1, -12); put(MG + 'crowd_laugh.wav', 34.8, -18, 1.4)
# s5: safety
FLAP(36.89, -8, 1.4); HIT(37.72, -6); put(MG + 'crowd_roar.wav', 37.4, -14, 1.2)
# s5b: bay 86 yard
FLAP(39.1, -8, 3.9); put(MG + 'crowd_roar.wav', 40.0, -12, 2.6); BAO('bao_gamgu', 39.8, -10, 0.8); BAO('bao_gamgu', 41.2, -10, 0.8, 0.5)
# d: 3 lần rơi bóng
for tt in [45.55, 46.1, 46.8]: SPL(tt, -6)
put(MG + 'crowd_laugh.wav', 46.0, -14, 2.0); CAW(46.88, -10, 0.8); BJ(48.5, 1, -12)
# s7: quạ ướt rũ, báo vẩy nước
CAW(53.2, -14, 0.8); SPL(55.05, -10); put(MG + 'crowd_laugh.wav', 55.4, -16, 1.2)
# s8: FG
BAO('bao_gamgu', 57.3, -10, 0.6); HIT(57.76, -4); put(MG + 'crowd_roar.wav', 58.6, -10, 2.0)
# s8b: cú ném cuối, báo vồ
FLAP(60.4, -8, 3.0); BAO('bao_gamgu', 62.5, -6, 1.0); HIT(62.68, -8); put(MG + 'crowd_cheer.wav', 63.4, -10, 1.8)
# s9: Nevermore
CAW(65.32, -10, 1.0); CAW(69.45, -6, 1.3, 0.3); put(MG + 'sad_trombone.wav', 70.2, -14, 1.8)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx), 'thu:', sorted(os.listdir(T8)))
