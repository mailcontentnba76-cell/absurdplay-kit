"""E29 mascot Spurs Coyote vs Rockets Clutch — sói & gấu xám THẬT trong nhà thi đấu.
Giọng ElevenLabs (Justin, atempo 1.2) + nhạc alvana upbeat/earth + tiếng động vật thật Magnific (sói tru, gấu gầm ×2, đại bàng, voi) + sân đấu."""
import subprocess, re, numpy as np, os
SR = 48000; LIB = '/home/claude/audio/'; MG = '/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/tai_nguyen/am_thanh/magnific_sfx/'; TOFF = 4.8; DUR = 81.29 + TOFF   # mở đầu What if (25/11)
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine/ep29_shots.js').read()
SH = {k: [float(x) + TOFF for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SH=')[1])}
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', f if f.startswith('/') or f.startswith('am_thanh') else LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
voice = load('am_thanh/giong_raw_v2.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
save('giong', voice); LV = lufs(voice)
sm = int(0.08 * SR)
m = load('alvana-audio/music/upbeat/earth.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for a_, b_ in [(SH['s5'][0], SH['s6'][1]), (SH['s32'][0] - 0.1, SH['s32'][0] + 0.9), (SH['s40'][0], SH['s41'][0] + 0.3)]:   # high noon, cú xoay, còi: nhạc lặng
    w = (T > a_) & (T < b_); gm[w] = 0.08
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def add(x, t, db=0.0):
    x = x * 10 ** (db / 20); i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def put(fn, t, db=0.0, n=None, a=0.0):
    x = load(fn)[int(a * SR):]
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    add(x, t, db)
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
# nền nhà thi đấu suốt video
# ===== mở đầu: 5 đấu 5 lao vào nhau, xé áo, hoá thú =====
put(MG + 'crowd_roar.wav', 0.0, -16, 2.4)
for j in range(7): put(MG + 'sneaker_squeak.wav', 0.25 + j * 0.27, -24, 0.25)
put(A + 'impact/cinematic-heavy.wav', 2.02, -10, 1.4)                   # hai hàng chạm mặt
put(MG + 'crowd_gasp.wav', 2.3, -22, 1.2)
put(A + 'riser/' + sorted(os.listdir(LIB + A + 'riser'))[0], 3.0, -18, 1.8)
put(A + 'whoosh/fast-bright.wav', TOFF + 0.3, -10)                      # xé áo
put(A + 'impact/cinematic-heavy.wav', TOFF + 0.75, -12, 1.0)            # bùng khói
put(MG + 'bear_roar_2.wav', TOFF + 1.25, -14, 1.0)
put(MG + 'crowd_ooh_aah.wav', TOFF + 1.3, -22, 1.4)
bed(MG + 'crowd_ambience.wav', 0, DUR, -28)
for kk in ['s3', 's4', 's9', 's13', 's19', 's22', 's27', 's29', 's38']: WH(SH[kk][0] - 0.12, -18)
put(MG + 'coyote_howl.wav', SH['s3'][0] + 0.2, -8, 1.4)                 # sói tru (thật)
put(MG + 'bear_roar_1.wav', SH['s4'][0] + 0.15, -6, 1.4)                # gấu gầm (thật)
put(MG + 'buzzer.wav', SH['s5'][0] + 0.05, -16, 0.8)
put(MG + 'backboard_bang.wav', SH['s6'][0] + 0.2, -18, 0.5)
put(MG + 'organ_charge.wav', SH['s9'][0] + 0.3, -20, 2.0)
put(MG + 'coyote_howl.wav', SH['s10'][0] + 0.4, -16, 1.2)
for j in range(6): put(MG + 'ball_dribble.wav', SH['s11'][0] + 0.1 + j * 0.31, -16, 0.3)
put(MG + 'crowd_cheer.wav', SH['s12'][0] + 0.1, -24, 1.3)
put(A + 'whoosh/fast-bright.wav', SH['s13'][0] + 0.2, -12)
put(MG + 'sneaker_squeak.wav', SH['s13'][0] + 1.6, -20, 0.5)
put(MG + 'crowd_ooh_aah.wav', SH['s16'][0] + 0.2, -24, 1.4)
put(MG + 'crowd_laugh.wav', SH['s17'][0] + 1.4, -22, 1.2)
put(MG + 'bear_roar_2.wav', SH['s18'][0] + 0.05, -14, 0.9)
for j in range(5): put(A + 'footsteps/concrete-00%d.wav' % (j % 5), SH['s19'][0] + 0.1 + j * 0.36, -12)
put(A + 'paper/paper-01.wav', SH['s20'][0] + 0.1, -16) if os.path.exists(LIB + A + 'paper/paper-01.wav') else None
put(MG + 'crowd_laugh.wav', SH['s21'][0] + 0.3, -22, 1.4)
for d in [0.42, 1.2]: put(MG + 'rim_dunk.wav', SH['s22'][0] + d, -12, 0.6)
put(MG + 'crowd_cheer.wav', SH['s22'][0] + 0.5, -20, 1.4)
for j in range(4): put(A + 'footsteps/concrete-00%d.wav' % (j % 5), SH['s23'][0] + 0.1 + j * 0.4, -20)
put(MG + 'crowd_gasp.wav', SH['s24'][0] + 0.6, -22, 1.2)
put(MG + 'ball_dribble.wav', SH['s27'][0] + 0.1, -16, 0.6); put(MG + 'sneaker_squeak.wav', SH['s27'][0] + 0.4, -20, 0.4)
put(MG + 'ball_dribble.wav', SH['s29'][0] + 0.1, -16, 0.6); put(MG + 'sneaker_squeak.wav', SH['s29'][0] + 0.4, -20, 0.4)
put(MG + 'crowd_silence_cough.wav', SH['s30'][0] + 0.2, -22, 1.2)
put(A + 'impact/' + 'cinematic-heavy.wav', SH['s31'][0] + 0.35, -18, 0.8)
put(MG + 'crowd_laugh.wav', SH['s31'][0] + 0.6, -20, 1.4)
put(A + 'riser/' + sorted(os.listdir(LIB + A + 'riser'))[0], SH['s32'][0], -20, 1.2)
put(MG + 'bear_roar_2.wav', SH['s34'][0] + 0.3, -18, 1.2)
put(A + 'pop/classic-pop.wav', SH['s35'][0] + 0.1, -12)
put(MG + 'eagle_screech.wav', SH['s36'][0] + 0.1, -10, 1.0)             # đại bàng (thật)
put(MG + 'elephant_trumpet.wav', SH['s37'][0] + 0.1, -10, 1.1)          # voi (thật)
put(MG + 'eagle_screech.wav', SH['s38'][0] + 0.2, -16, 0.9)
put(A + 'whoosh/fast-bright.wav', SH['s38'][0] + 0.4, -12)
put(MG + 'rim_dunk.wav', SH['s38'][1] - 0.25, -8, 0.7)
put(MG + 'crowd_roar.wav', SH['s38'][1] - 0.2, -18, 1.6)
put(MG + 'football_hit.wav', SH['s39'][0] + 0.45, -12, 0.5)
put(MG + 'crowd_boo.wav', SH['s39'][0] + 0.6, -20, 1.4)
put(MG + 'ref_whistle.wav', SH['s40'][0] + 0.05, -8, 0.6)
put(MG + 'crowd_boo.wav', SH['s41'][0] + 0.2, -18, 1.4)
put(MG + 'sad_trombone.wav', SH['s42'][0] + 0.2, -18)
put(MG + 'crowd_ooh_aah.wav', SH['s43'][0] + 0.1, -24, 1.6); put(MG + 'crowd_ooh_aah.wav', SH['s44'][0] + 0.1, -24, 1.6)
put(MG + 'coyote_howl.wav', SH['s45'][0] + 0.1, -18, 0.9); put(MG + 'bear_roar_1.wav', SH['s45'][0] + 0.5, -18, 0.8)
sfx *= 10 ** ((LV - 7 - lufs(sfx)) / 20)   # SFX dưới lời ~7 LU
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
mix = voice + m + sfx; save('tron', mix)
