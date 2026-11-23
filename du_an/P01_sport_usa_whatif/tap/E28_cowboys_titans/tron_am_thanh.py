"""E28 Cowboys vs Titans (nhạc ElevenLabs "Dust-Up Victory Stomp" + tiếng thú ElevenLabs trong assets/audio/e28_thu)
E27 gốc: giọng ×1,05 + nhạc ElevenLabs Music "Cornfield Kickoff" (country–rock hoedown, tạo riêng 22/11) + banjo stinger + SFX: bóc vỏ, nứt hạt dẻ, đá bóng, đám đông, máy gặt, cột gôn đổ, sói hú."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 70.40
src = open('/root/work/engine/ep28ct_shots.js').read()
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
voice = load('am_thanh/giong.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
save('giong', voice); LV = lufs(voice)
sm = int(0.08 * SR)
import os
MUS = '/root/work/assets/audio/e28/dust_up_victory_stomp.mp3'
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
T8 = '/root/work/assets/audio/e28_thu/'
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
TDT = [20.9, 22.9, 25.0, 26.9, 28.9, 30.8]; HITS = [36.7, 37.9, 39.2, 40.2, 42.3]
# h0: bới thùng rác, gặm pizza
for i in range(4): put(FS + 'Owlish/Sound Effects Pack/Paper/paper-sketchbook-page-flips-1.opus', 0.2 + i * 0.4, -16, 0.3)
CL(0.15, -20); BJ(2.7, 1, -12)
# s1/s1b: xé áo hoá thú
for tr in [4.45, 4.8, 5.15]: RIP(tr, -6)
thu('rac_chitter', 5.4, -10, 1.6); RIP(7.95, -4); thu('bull_bellow', 8.5, -6, 2.2)
# s2: lục thùng rác
CL(9.25, -16); thu('rac_chitter', 9.4, -8, 3.2, 1.0)
for i in range(4): put(FS + 'Owlish/Sound Effects Pack/Paper/paper-sketchbook-page-flips-1.opus', 9.5 + i * 0.45, -16, 0.35)
put(MG + 'crowd_laugh.wav', 12.4, -20, 1.2)
# s3: cân 1 tấn, cào đất, rống, húc hình nộm
thu('bull_snort', 15.2, -6, 2.0); thu('bull_bellow', 15.6, -4, 2.4, 0.3); thu('hooves', 18.2, -8, 1.2); HIT(18.62, -4); put(MG + 'crowd_roar.wav', 18.7, -12, 1.4)
# 6 TD
for i, tt in enumerate(TDT):
    put(MG + 'crowd_roar.wav', tt, -14, 1.3)
thu('hooves', 19.6, -8, 2.0); CL(20.2, -8); thu('rac_hiss', 20.3, -10, 0.8)
thu('hooves', 22.0, -6, 1.6); thu('rac_hiss', 22.4, -10, 0.8); CL(22.9, -6)
thu('hooves', 23.6, -10, 2.2, 1.0); thu('rac_hiss', 24.55, -9, 1.0); CL(25.3, -9)
thu('hooves', 25.9, -10, 1.7, 2.0); thu('rac_chitter', 26.0, -10, 0.8, 2.0); thu('rac_hiss', 26.75, -8, 0.9); CL(27.37, -6)
thu('hooves', 27.6, -9, 1.0, 0.5); thu('bull_snort', 28.6, -8, 1.0); HIT(29.6, -8); CL(29.7, -8)
thu('bull_bellow', 30.8, -8, 1.2, 0.2); put(MG + 'crowd_laugh.wav', 29.9, -18, 1.4)
# s5: không punt, ghế xếp
put(MG + 'crowd_laugh.wav', 34.9, -14, 1.8); BJ(35.0, 2, -12)
# 5 sack vào dumpster
for i, tt in enumerate(HITS):
    if i < 2: thu('hooves', tt - 1.0, -10, 1.0, i * 1.5)
    HIT(tt, -6); thu('rac_hiss', tt + 0.05, -10, 0.6, (i % 3) * 0.7); CL(tt + 0.6, -4 if i == 4 else -7)
put(MG + 'crowd_ooh_aah.wav', 37.0, -18, 1.4)
# s7: fumble, chạy 70 yard, gấu mèo bám chân
put(MG + 'crowd_gasp.wav', 43.2, -16, 1.0); thu('hooves', 43.1, -6, 4.5); thu('rac_hiss', 44.6, -10, 1.0); put(MG + 'crowd_roar.wav', 44.2, -10, 3.4)
# s8: cả sân hô
put(MG + 'crowd_chant_defense.wav', 47.9, -10, 7.6); put(MG + 'crowd_clap_rhythm.wav', 49.5, -18, 5.5)
# s9: bảng điểm
put(MG + 'crowd_laugh.wav', 57.4, -14, 1.6); put(MG + 'sad_trombone.wav', 59.1, -14, 1.8)
# s10: ôm pizza chui thùng rác, đóng nắp
thu('rac_chitter', 60.3, -10, 1.4, 4.0)
for tt in [62.35, 63.2, 63.4]: CL(tt, -8)
BJ(64.3, 1, -12)
# s11: bò nhìn đại bàng
thu('eagle', 66.2, -6, 2.0); thu('bull_snort', 67.6, -8, 1.2); BJ(68.6, 2, -11)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx), 'thu:', sorted(os.listdir(T8)))
