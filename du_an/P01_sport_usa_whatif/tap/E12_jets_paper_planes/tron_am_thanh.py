"""E12: am_thanh/giong.wav (giọng gốc chuẩn hoá, KHÔNG rút nghỉ, bíp 1 kHz đè "fuck") + am_thanh/nhac.wav ("Coins", alvana-audio hiphop, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sân thượng New York: còi xe, gió phố, khán giả, tiếng giấy sột soạt, vút máy bay giấy, va chạm, sút bóng...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 78.64
src = open('/root/work/engine/ep12_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[bcd]?):\[([\d.,]+)\]", src.split('END')[0])}
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
W = json.load(open('giong/words_raw.json')); a, b = W[2][0] - 0.02, W[2][1] + 0.03
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b)
sm = int(0.08 * SR)
def mask(pairs):
    g = np.zeros(N)
    for x, y in pairs: g[(T >= SH[x][0]) & (T < SH[y][1])] = 1
    return np.convolve(g, np.ones(sm) / sm, 'same')
m = load('alvana-audio/music/hiphop/coins.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s2'][0]] = 0.2
for key, d, g in [('s12', 0.8, 0.3), ('s23b', 1.5, 0.3), ('s26', 2.0, 0.45), ('s28', 0.8, 0.25)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'
FIELD = mask([('s1', 's18'), ('s20', 's30')])
sfx += bed(MG + 'stadium_crowd_outdoor.wav', -22, FIELD) + bed(A + 'ambience/highway.wav', -30, FIELD) + bed(A + 'ambience/wind.wav', -30, FIELD) + bed(MG + 'crowd_ambience.wav', -27, mask([('s19', 's19')]))
PAPER = lambda t, db=-12: put(OC + 'PAPRHndl_PaperCrumple_OS_01.ogg', t, db, 0.45)
WHOOSH = lambda t, db=-11: put(OC + 'SWSH_Swoosh_OS_02.ogg', t, db)
KICK = lambda t: (put(MG + 'football_kick.wav', t, -8), put(MG + 'crowd_ooh_aah.wav', t + 0.6, -18, 1.2))
put(A + 'impact/cinematic-heavy.wav', 0.05, -10); put(A + 'whoosh/fast-bright.wav', 0.02, -14)
for tc in [0.79, 0.73, 1.06, 0.76, 0.82]: put(MG + 'football_hit.wav', tc, -9); PAPER(tc + 0.02, -14)
put(MG + 'crowd_gasp.wav', 0.85, -16, 1.0)
put(MG + 'football_hit.wav', SH['s2'][0] + 0.2, -16); put(MG + 'crowd_cheer.wav', SH['s2'][0] + 0.4, -20, 2.0)
KICK(SH['s3'][0] + 0.8); put(A + 'impact/classic-stamp.wav', SH['s3'][0] + 0.4, -10)
for i in range(11): WHOOSH(SH['s4b'][0] + i * 0.1, -16)
put(A + 'transition/whoosh-hit-2.wav', SH['s4b'][0], -12)
put(MG + 'crowd_boo.wav', SH['s5'][0] + 0.3, -20, 2.5); KICK(SH['s6'][0] + 1.0)
for t0 in [18.2, 19.2, 20.08]: put(A + 'pop/classic-pop.wav', t0, -12)
WHOOSH(SH['s8'][0] + 1.3, -12); WHOOSH(SH['s9'][0], -10); put(K + 'tones/tone-ding-high.wav', SH['s9'][0] + 0.9, -10)
put(MG + 'stadium_horn.wav', SH['s10'][0] + 0.1, -16, 1.4)
WHOOSH(SH['s12'][0], -10); put(MG + 'football_hit.wav', SH['s12'][0] + 0.45, -8); PAPER(SH['s12'][0] + 0.47, -10); put(MG + 'crowd_ooh_aah.wav', SH['s12'][0] + 0.6, -14, 1.2)
put(MG + 'ref_whistle.wav', SH['s13'][0] + 1.6, -16, 0.7); KICK(SH['s14'][0] - 0.1); put(MG + 'ref_whistle.wav', SH['s15'][0] + 0.6, -16, 0.7); KICK(SH['s16'][0] + 0.3)
for i in range(5): WHOOSH(SH['s17'][0] + i * 0.55, -14)
put(MG + 'crowd_roar.wav', SH['s18'][0] + 0.1, -12, 1.4)
put(MG + 'crowd_laugh.wav', SH['s19b'][0] + 1.0, -18, 1.4)
for i in range(6): PAPER(SH['s20'][0] + 0.4 + i * 0.6, -18)
put(MG + 'buzzer.wav', SH['s21'][0] + 0.1, -18, 0.8); put(MG + 'drumline.wav', SH['s22'][0], -18, 2.0)
put(MG + 'football_hit.wav', SH['s23'][0] + 0.35, -12); put(MG + 'crowd_gasp.wav', SH['s23b'][0] + 0.3, -12, 1.2); PAPER(SH['s23b'][0] + 0.3, -8)
put(MG + 'crowd_roar.wav', SH['s24'][0] + 0.1, -14, 1.8)
put(K + 'appear-and-vanish/appear-poof.wav', SH['s26'][0] + 0.9, -8); for_i = [PAPER(SH['s26'][0] + 1.0 + i * 0.08, -14) for i in range(6)]
for i in range(6): WHOOSH(SH['s27'][0] + i * 0.07 + 0.2, -16)
put(A + 'impact/classic-thud.wav', SH['s27'][0] + 2.7, -10); put(MG + 'sad_trombone.wav', SH['s28'][0] + 0.1, -14, 1.0)
put(A + 'impact/classic-stamp.wav', 73.05, -8); put(MG + 'crowd_cheer.wav', SH['s29'][0] + 0.2, -18, 1.4)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
