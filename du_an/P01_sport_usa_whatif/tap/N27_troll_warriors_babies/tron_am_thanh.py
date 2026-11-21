"""N27 troll Warriors vs 5 em bé: giọng ElevenLabs (Justin, atempo 1.2, hook bíp) + nhạc alvana chill/childhood (chưa dùng) + SFX:
WTF stinger, sân đấu Magnific (đám đông, còi, buzzer, dội vành, swish, giày rít, la ó, cười, gasp), té nước chậu tắm, bình sữa đổ, trượt ngã, bút dạ.
Chưa có tiếng em bé cười/khóc thật (cần tạo bằng Magnific Sound FX — hỏi người dùng trước)."""
import subprocess, re, numpy as np, os
SR = 48000; LIB = '/home/claude/audio/'; MG = '/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/tai_nguyen/am_thanh/magnific_sfx/'; DUR = 79.75
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine/epn27_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('END')[0])}
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
m = load('alvana-audio/music/chill/childhood.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for a_, b_ in [(0, 1.7), (SH['s36'][0], SH['s36'][1] + 0.1)]:  # hook WTF và tiếng buzzer: nhạc lặng
    w = (T > a_) & (T < b_); gm[w] = 0.05
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
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'crowd_ambience.wav', 0, DUR, -24)
for kk in ['s2', 's7', 's8', 's10', 's12', 's13', 's15', 's20', 's25', 's26', 's29', 's32', 's37', 's38']: WH(SH[kk][0] - 0.12, -18)
put(A + 'impact/cinematic-heavy.wav', 0.3, -12, 1.2)                     # WTF?!
put(A + 'pop/classic-pop.wav', 1.74, -14)                               # thẻ tiêu đề
put(MG + 'crowd_laugh.wav', SH['s3'][0] + 0.2, -16, 2.2)                # Warriors cười khẩy
put(A + 'pop/plop-01.wav', SH['s4'][0] + 0.15, -10)                     # bóng lăn
put(MG + 'ball_dribble.wav', SH['s4'][0] + 0.3, -16, 0.6)
put(A + 'pop/classic-hop.wav', SH['s5'][0] + 0.3, -14); put(A + 'pop/classic-hop.wav', SH['s5'][0] + 0.9, -15)
put(A + 'pop/plop-02.wav', SH['s6'][0] + 1.0, -8)                        # ngồi phịch
put(MG + 'crowd_gasp.wav', SH['s7'][0] + 0.1, -18, 1.8)
put(MG + 'sad_trombone.wav', SH['s8'][0] + 0.3, -15)
put(MG + 'crowd_boo.wav', SH['s9'][0], -18, 2.8)
for j, r in enumerate(['backboard_bang', 'rim_dunk', 'backboard_bang']): put(MG + r + '.wav', SH['s10'][0] + j * 1.2 + 1.0, -14, 0.6)
put(MG + 'airball_chant.wav', SH['s11'][0] + 0.8, -15, 1.0)
for j in range(5): put(A + 'water/splash-%02d.wav' % (j + 3), SH['s12'][0] + 0.15 + j * 0.55, -12)
put(MG + 'ref_whistle.wav', SH['s13'][0] + 0.05, -16, 0.6)
put(MG + 'ball_dribble.wav', SH['s13'][0] + 1.0, -14, 0.8)
put(MG + 'crowd_ooh_aah.wav', SH['s14'][0] + 1.6, -18, 1.4)
put(MG + 'ball_dribble.wav', SH['s15'][0], -15, 1.4)
put(K + 'everyday-props/props-splash.wav', SH['s16'][0] + 0.05, -10)
put(MG + 'sneaker_squeak.wav', SH['s17'][0], -10, 0.5); put(A + 'impact/classic-thud.wav', SH['s17'][0] + 0.3, -10); put(A + 'water/slime-04.wav', SH['s17'][0] + 0.32, -12)
put(MG + 'crowd_laugh.wav', SH['s18'][0] + 0.1, -16, 2.0)
put(MG + 'ref_whistle.wav', SH['s18'][0] + 0.05, -18, 0.5)
for kk, r in [('s20', 'backboard_bang'), ('s21', 'rim_dunk'), ('s22', 'backboard_bang')]: put(MG + r + '.wav', SH[kk][0] + 1.1, -14, 0.6)
put(A + 'whoosh/air-02.wav', SH['s23'][0] + 0.5, -14)
put(MG + 'swish.wav', SH['s24'][0] + 0.2, -10); put(A + 'foley/wooden-02.wav', SH['s24'][0] + 0.75, -10)
put(MG + 'crowd_silence_cough.wav', SH['s24'][0] + 0.6, -14, 1.0)
put(MG + 'buzzer.wav', SH['s26'][0] - 0.05, -18, 0.9)
put(K + 'writing-and-drawing/writing-marker-draw.wav', SH['s26'][0] + 0.5, -16, 1.4)
put(K + 'writing-and-drawing/writing-scribble.wav', SH['s27'][0] + 0.1, -12, 1.4)
put(MG + 'ball_dribble.wav', SH['s29'][0] + 0.6, -16, 0.9)
put(MG + 'crowd_silence_cough.wav', SH['s29'][0] + 2.0, -16, 1.2)
put(MG + 'backboard_bang.wav', SH['s31'][0] + 0.75, -12, 0.6); put(MG + 'crowd_boo.wav', SH['s31'][0] + 1.0, -18, 1.5)
put(MG + 'drumline.wav', SH['s32'][0], -18, 2.2)
put(MG + 'crowd_roar.wav', SH['s33'][0], -20, 1.3)
put(A + 'pop/bubble-1.wav', SH['s34'][0] + 0.2, -14)
put(MG + 'buzzer.wav', SH['s36'][0] + 0.02, -10)
put(MG + 'crowd_gasp.wav', SH['s36'][0] + 0.5, -16, 1.0)
put(MG + 'sad_trombone.wav', SH['s37'][0] + 0.4, -16)
put(MG + 'crowd_laugh.wav', SH['s37'][0] + 0.3, -18, 2.6)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
mix = voice + m + sfx; save('tron', mix)
