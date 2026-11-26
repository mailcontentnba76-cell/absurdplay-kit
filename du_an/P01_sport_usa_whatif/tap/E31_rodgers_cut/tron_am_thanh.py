"""E31 Steelers cut Rodgers (nhạc ElevenLabs "Jungle Showdown" + tiếng quạ/vỗ cánh ElevenLabs trong assets/audio/e29_thu, báo e25_thu, mưa Meta)
E27 gốc: giọng ×1,05 + nhạc ElevenLabs Music "Cornfield Kickoff" (country–rock hoedown, tạo riêng 22/11) + banjo stinger + SFX: bóc vỏ, nứt hạt dẻ, đá bóng, đám đông, máy gặt, cột gôn đổ, sói hú."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 62.00
src = open('/root/work/engine/ep31rc_shots.js').read()
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
MUS = '/root/work/assets/audio/alvana-audio/music/hiphop/hard-mode.mp3'
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
SK = 'sfx-kit/sounds/'
IMP = lambda nm, t, db=-8: put(SK + 'impacts/' + nm + '.wav', t, db)
CIN = lambda nm, t, db=-8: put(SK + 'cinematic-hits/' + nm + '.wav', t, db)
FOL = lambda nm, t, db=-10: put(SK + 'foley/' + nm + '.wav', t, db)
BJ = lambda t, i=1, db=-12: put(MO + f'MUSCStngr_BanjoHumorous_OS_0{i}.ogg', t, db)
# h0: giật biển tên + dấu RELEASED
FOL('foley-wood-slide', 0.6, -8); CIN('cinematic-slam-big', 0.75, -6)
# h1: cúp va nhau, kéo cắt, cúp rơi
FOL('foley-glass-touch', 1.6, -14); put(SK + 'everyday-props/props-scissors.wav', 3.6, -4); IMP('impact-medium-hard', 3.85, -10); IMP('impact-light-hard', 4.0, -12)
# h3: cửa sắt + gà tây rơi phịch
put(MO + 'DOORHdwr_OfficeDoorKnob_OS_01.ogg', 4.0, -10); IMP('impact-heavy-soft', 4.95, -8)
# h4: chuyển cảnh BREAKING
CIN('cinematic-drum-big', 5.5, -10)
# s1: phim trường
put(MG + 'camera_flashes.wav', 7.2, -20, 1.5)
# s2: ngáy (dùng tiếng thở trầm lặp) — trống nhẹ thay
BJ(14.4, 2, -14)
# s3: hô huddle + im lặng
for tt in [17.9, 18.6, 18.94]: IMP('impact-light-firm', tt, -12)
put(MG + 'crowd_gasp.wav', 19.6, -14, 1.2); put(MG + 'crowd_silence_cough.wav', 20.2, -16, 1.6); BJ(21.0, 1, -12)
# s4: nút RELEASE + chuông
IMP('impact-medium-firm', 23.85, -6); put(MG + 'buzzer.wav', 23.95, -16, 0.8); put(MO + 'MUSCStngr_LossOrchestral_OS_01.ogg', 25.0, -14)
# phòng ăn: đập bàn, ông đứng bật, gravy
IMP('impact-heavy-firm', 31.4, -6); FOL('foley-wood-slide', 35.4, -10); put(MO + 'MUSCStngr_LossPiano_OS_01.ogg', 41.6, -14); FOL('foley-glass-slide', 41.9, -10)
# phòng thay đồ: kéo khoá túi, quạ bay đáp, kêu
put(SK + 'everyday-props/props-zip.wav', 43.4, -12); thu('wing_flap', 45.3, -10, 1.4); thu('raven_caw', 47.2, -10, 0.8, 1.15)
# xé áo tím + kết
RIP(56.55, -6); CIN('cinematic-thunder-big', 56.75, -12); put(MO + 'MUSCStngr_VictoryOrchestral_OS_01.ogg', 58.0, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
