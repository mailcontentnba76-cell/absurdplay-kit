"""N28 troll 76ers đi đâu cũng bị troll: giọng ElevenLabs (Justin, atempo 1.2, hook bíp) + nhạc alvana chill/childhood (chưa dùng) + SFX:
WTF stinger, sân đấu Magnific (đám đông, còi, buzzer, dội vành, swish, giày rít, la ó, cười, gasp), té nước chậu tắm, bình sữa đổ, trượt ngã, bút dạ.
Chưa có tiếng em bé cười/khóc thật (cần tạo bằng Magnific Sound FX — hỏi người dùng trước)."""
import subprocess, re, numpy as np, os
SR = 48000; LIB = '/home/claude/audio/'; MG = '/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/tai_nguyen/am_thanh/magnific_sfx/'; DUR = 77.06
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine/epn28_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SH=')[1])}
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
m = load('alvana-audio/music/chill/day-jobs.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for a_, b_ in [(0, 1.7), (SH['s42'][0]-0.3, SH['s42'][0]+0.4)]:  # hook WTF và tiếng buzzer: nhạc lặng
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
def steps(t0, t1, db=-24, f='concrete-00', gap=0.42):
    t = t0; i = 0
    while t < t1: put(A + 'footsteps/%s%d.wav' % (f, i % 5), t, db); t += gap; i += 1
# nền: phố (xe xa) cho phố/công viên/bậc thang, phòng kín cho quán/chuông/hầm, động cơ xe buýt
for a_, b_, f, db in [('s1', 's7', 'ambience/highway.wav', -30), ('s13', 's17', 'ambience/wind.wav', -32), ('s22', 's28', 'ambience/wind.wav', -32), ('s39', 's42', 'ambience/highway.wav', -30),
                      ('s8', 's12', 'ambience/room-tone.wav', -30), ('s18', 's21', 'ambience/room-tone.wav', -32), ('s29', 's35', 'ambience/machine-02.wav', -28), ('s36', 's38', 'ambience/room-tone.wav', -30)]:
    bed(LIB + A + f, SH[a_][0], SH[b_][1], db)
for kk in ['s3', 's7', 's8', 's13', 's18', 's22', 's29', 's36', 's39', 's41']: WH(SH[kk][0] - 0.12, -18)
put(A + 'impact/cinematic-heavy.wav', 0.25, -12, 1.2)                     # WTF?!
put(MG + 'crowd_gasp.wav', 1.0, -20, 1.2)
put(A + 'pop/classic-pop.wav', 1.82, -14)
steps(SH['s3'][0], SH['s3'][1], -24)
put(A + 'paper/' + 'paper-01.wav', SH['s4'][0] + 0.1, -16) if False else None
put(MG + 'sad_trombone.wav', SH['s5'][0] + 0.3, -16)
steps(SH['s7'][0], SH['s7'][1], -24)
put(K + 'everyday-props/props-shop-bell.wav', SH['s8'][0] + 0.05, -14)
put(A + 'water/slime-02.wav', SH['s8'][0] + 0.4, -26); put(A + 'water/slime-05.wav', SH['s9'][0] + 0.3, -28)   # xèo xèo bếp
put(A + 'mechanical/classic-print.wav', SH['s11'][0] + 0.05, -12, 1.7)
put(A + 'pop/classic-pop.wav', SH['s12'][0] + 0.05, -12)
steps(SH['s13'][0], SH['s14'][1], -22, gap=0.3)
steps(SH['s15'][0], SH['s15'][1], -20, gap=0.2)
put(A + 'whoosh/fast-bright.wav', SH['s15'][0] + 0.4, -14)
put(MG + 'crowd_laugh.wav', SH['s16'][0] + 0.2, -20, 1.0)
put(A + 'body/breath.wav', SH['s17'][0], -12, 1.5)
put(A + 'impact/bell-heavy-002.wav', SH['s18'][0] + 0.1, -16)
for j in range(6): put(A + 'impact/glass-light-00%d.wav' % (j % 5), SH['s20'][0] + 0.1 + j * 0.28, -18)
put(MG + 'backboard_bang.wav', SH['s20'][0] + 1.7, -16, 0.6)
put(MG + 'crowd_gasp.wav', SH['s21'][0] + 0.1, -20, 1.2)
put(A + 'whoosh/air-02.wav', SH['s23'][0] + 1.1, -16)
put(MG + 'swish.wav', SH['s24'][0] + 0.15, -10)
put(MG + 'crowd_cheer.wav', SH['s24'][0] + 0.4, -26, 1.0)
for j in range(5): put(A + 'creature/burble-0%d.wav' % (1 + j % 2), SH['s26'][0] + 0.1 + j * 0.5, -24)
put(A + 'magic/' + 'sparkle.wav', 0, -99) if False else None
put(MG + 'sad_trombone.wav', SH['s28'][0] + 0.3, -18)
put(A + 'foley/bell-02.wav', SH['s29'][0] + 0.1, -16)
put(A + 'mechanical/classic-ticks.wav', SH['s30'][0] + 0.1, -20, 1.0)
put(A + 'mechanical/metal-click.wav', SH['s31'][0] + 0.4, -14); put(A + 'money/' + 'coins-01.wav', 0, -99) if False else None
put(MG + 'crowd_roar.wav', SH['s33'][0], -26, 1.6)
put(MG + 'swish.wav', SH['s33'][0] + 1.2, -18)
put(A + 'mechanical/switch-01.wav', SH['s35'][0] + 0.3, -14); put(A + 'mechanical/switch-01.wav', SH['s35'][0] + 0.9, -14)
put(MG + 'crowd_laugh.wav', SH['s35'][0] + 0.4, -18, 1.4)
put(K + 'everyday-props/props-zip.wav', SH['s36'][0] + 0.5, -14)
put(A + 'creature/cute-03.wav', SH['s36'][0] + 1.6, -18)
put(K + 'mechanical/mechanical-latch-light.wav', SH['s37'][0] + 0.2, -14)
steps(SH['s37'][0], SH['s37'][1], -22, gap=0.35)
put(MG + 'drumline.wav', SH['s39'][0], -22, 3.2)
put(A + 'mechanical/classic-print.wav', SH['s41'][0], -14, 1.6)
put(MG + 'stadium_horn.wav', SH['s42'][0] + 0.05, -16, 1.2)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
mix = voice + m + sfx; save('tron', mix)
