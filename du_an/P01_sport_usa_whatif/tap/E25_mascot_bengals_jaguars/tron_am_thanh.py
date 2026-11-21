"""E25 Mascot đối đầu Bengals vs Jaguars (không chửi tục): giọng ×1,05 + nhạc alvana synthwave/lost-in-the-jungle (chưa dùng) + SFX: gầm, xé áo, POP bóng, đám đông."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 79.80
src = open('/root/work/engine/ep25_bengals_jaguars_shots.js').read()
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
m = load('alvana-audio/music/synthwave/lost-in-the-jungle.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
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
TH = '/root/work/assets/audio/e25_thu/'   # tiếng thú thật (ElevenLabs SFX v3, 21/11)
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'stadium_crowd_outdoor.wav', 0, DUR, -32)
for k in ['h0', 'h0b', 'h0c', 'h0d', 'h1']: WH(SH[k][1] - 0.14, -16 if k in ('h0', 'h0b', 'h0c') else -14)
put(MG + 'drumline.wav', 0.0, -22, 1.6)
# biến hình: gồng (riser) → xé áo (3 nhịp xé lệch 0,07 s) → bụp khói → gầm
for TR, roar in ((1.70, 'ho'), (3.95, 'bao')):
    put(A + 'riser/quick-1s.wav', TR - 0.62, -18, 0.62)
    for j in range(3): put('/root/work/assets/audio/xe_ao_rip.wav', TR + j * 0.07 - 0.03, -6 - j * 2, 0.6)
    put(A + 'impact/subdrop-short.wav', TR + 0.36, -8); put(A + 'explosion/low-frequency-explosion-000.wav', TR + 0.36, -18, 0.8)
    put2(TH + 'ho_gam.mp3', TR + 0.55 - 0.58, -4, 0.0, 2.4) if roar == 'ho' else put2(TH + 'bao_gamgu.mp3', TR + 0.55 - 0.19, -3, 0.0, 1.6)
put(MG + 'stadium_horn.wav', SH['h1'][0] + 0.05, -16, 1.4); put(MG + 'football_hit.wav', 7.0, -12, 0.5)
# ---- đoạn giới thiệu mới (21/11) ----
put2(TH + 'ho_buoc.mp3', 8.5, -12, 1.2, 2.8)                                   # hổ bước ra sân
put2(TH + 'ho_gam.mp3', 11.5 - 0.58, -3, 0.0, 2.4); put(MG + 'crowd_roar.wav', 11.9, -18, 1.8)   # gầm vào ống kính
put(A + 'impact/metal-heavy-001.wav', 12.95, -12); put(A + 'misc/spring-03.wav', 13.1, -18)        # lên cân, kim quay
put2(TH + 'ho_chuff.mp3', 14.05 - 0.65, -6, 0.0, 2.0)                           # phì mũi tự hào
put2(TH + 'ho_gu.mp3', 14.6, -14, 4.9, 1.3)                                     # gừ khi đứng 2 chân
for ts in (14.82, 14.99, 15.16, 15.33, 15.5): put(A + 'foley/draw-knife-%d.wav' % (1 + int(ts * 100) % 3), ts - 0.06, -8, 0.25); put(A + 'impact/wood-0%d.wav' % (1 + int(ts * 10) % 4), ts, -14, 0.3)
put2(TH + 'bao_cuago.mp3', 15.95, -9, 1.0, 2.6)                                  # báo đốm gọi khi bơi rình
bed('/root/work/assets/audio/sfx-kit/sounds/everyday-props/props-splash.wav', 15.9, 17.8, -30)
put('/root/work/assets/audio/sfx-kit/sounds/everyday-props/props-splash.wav', 17.82, -6); put(A + 'whoosh/swish-3.wav', 17.95, -10)
put(A + 'impact/soft-heavy-002.wav', 18.75, -10)
put2(TH + 'bao_gamgu.mp3', 19.2 - 0.19, -3, 0.0, 1.5); put(MG + 'crowd_ooh_aah.wav', 19.4, -20, 1.2)
put2(TH + 'bao_khe.mp3', 21.42 - 1.55, -10, 0.0, 1.9)                            # khè trước khi cắn
put2(TH + 'can_rac.mp3', 21.84 - 0.48, -2, 0.0, 1.2); put(A + 'game/power-up-3.wav', 21.95, -16); put(A + 'notification/classic-error.wav', 22.1, -18)   # cắn máy đo, kim vọt đỏ
put(A + 'whoosh/swish-3.wav', 23.1, -10); put2(TH + 'bao_gamgu.mp3', 23.15, -10, 0.1, 0.6)  # vồ
put2(TH + 'can_rac.mp3', 23.7 - 0.48, 0, 0.0, 1.2); put(A + 'impact/soft-heavy-001.wav', 23.75, -10); put(MG + 'crowd_ooh_aah.wav', 24.0, -18, 1.4)
put(A + 'whoosh/swish-3.wav', 27.35, -10); put(MG + 'crowd_cheer.wav', 28.4, -20, 1.6)
put(A + 'misc/spring-03.wav', 32.7, -16)
for i in range(5): put(A + 'pop/classic-pop.wav', 35.0 + i * 0.5, -20)
put(MG + 'crowd_laugh.wav', 37.0, -20, 1.8)
put(MG + 'football_kick.wav', 39.05, -12, 0.6); put(MG + 'ref_whistle.wav', 39.0, -22, 0.6)
put(A + 'whoosh/swish-3.wav', 40.15, -12); put(MG + 'crowd_roar.wav', 40.9, -14, 1.8); put(A + 'whoosh/swish-3.wav', 41.9, -12); put(MG + 'crowd_roar.wav', 42.66, -14, 1.6)
put(A + 'impact/soft-heavy-002.wav', 45.7, -8); put2(TH + 'bao_khe.mp3', 45.8 - 1.55, -12, 0.0, 1.8); put(A + 'impact/soft-heavy-003.wav', 49.4, -8); put(MG + 'crowd_laugh.wav', 49.6, -20, 1.6)
for tp in (55.62, 57.12, 58.36): put(A + 'pop/classic-pop.wav', tp, -2); put(A + 'impact/soft-medium-001.wav', tp + 0.02, -10)
for tn in (56.4, 57.66): put(A + 'whoosh/swish-3.wav', tn - 0.45, -18)
put(A + 'misc/spring-05.wav', 59.0, -16); put(MG + 'crowd_gasp.wav', 61.2, -18, 1.2); put(MG + 'crowd_boo.wav', 62.1, -20, 1.4)
put(MG + 'crowd_laugh.wav', 64.5, -16, 2.4); put2(TH + 'ho_gam.mp3', 40.95 - 0.58, -10, 0.0, 2.0); put2(TH + 'ho_gam.mp3', 70.55 - 0.58, -10, 0.0, 2.0)
for tp in (55.62, 57.12, 58.36): put2(TH + 'can_rac.mp3', tp - 0.5, -12, 0.0, 0.9)
put(A + 'creature/cute-03.wav', 66.0, -18)
put(A + 'whoosh/swish-3.wav', 69.62, -10); put(MG + 'crowd_roar.wav', 70.5, -14, 1.6)
put2(TH + 'ho_gam.mp3', 72.2 - 0.58, -8, 0.0, 2.2); put2(TH + 'bao_gamgu.mp3', 73.4 - 0.19, -7, 0.0, 1.5); put(A + 'impact/classic-stamp.wav', 75.3, -12)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
