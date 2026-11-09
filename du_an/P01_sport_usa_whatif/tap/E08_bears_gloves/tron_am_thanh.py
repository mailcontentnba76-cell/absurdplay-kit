"""E08: am_thanh/giong.wav (giọng gốc chuẩn hoá, KHÔNG rút nghỉ, bíp 1 kHz đè "fuck") + am_thanh/nhac.wav ("Back in the 80s", alvana-audio upbeat, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sân bóng chày chiều hè: chim, khán giả, tiếng da "bộp" khi găng bắt bóng, vỗ tay găng...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 71.04
src = open('/root/work/engine/ep08_shots.js').read()
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
m = load('alvana-audio/music/upbeat/back-in-the-80s.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s2'][0]] = 0.15
for key, d, g in [('s14', 0.5, 0.15), ('s27', 3.0, 0.35), ('s29', 1.0, 0.1), ('s35', 0.4, 0.2)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
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
FIELD = mask([('s1', 's21'), ('s24', 's35')])
sfx += bed(MG + 'stadium_crowd_outdoor.wav', -21, FIELD) + bed(OC + 'AMBForst_ForestBirds_OS_01.ogg', -26, FIELD * 0.6) + bed(MG + 'crowd_ambience.wav', -26, mask([('s22', 's23')]))
CATCH = lambda t: (put(OC + 'FGHTImpt_PunchHarder_OS_02.ogg', t, -6), put(A + 'pop/classic-pop.wav', t + 0.03, -12), put(MG + 'crowd_ooh_aah.wav', t + 0.15, -16, 1.2))
put(A + 'impact/cinematic-heavy.wav', 0.05, -10)
CATCH(SH['s2'][0] + 1.25); put(MG + 'crowd_cheer.wav', SH['s3'][0], -12, 1.6)
for i in range(11): put(OC + 'TOONBoing_BounceCartoony_OS_01.ogg', SH['s4'][0] + 0.1 + i * 0.1, -16)
put(A + 'transition/whoosh-hit-2.wav', SH['s4b'][0], -12); put(A + 'pop/classic-pop.wav', SH['s5'][0] + 0.1, -10)
for i in range(6): put(OC + 'FGHTImpt_PunchHarder_OS_01.ogg', SH['s6'][0] + 0.8 + i * 0.22, -16)
for i in range(8): put(OC + 'FGHTImpt_PunchHarder_OS_03.ogg', SH['s7'][0] + 0.1 + i * 0.2, -14)
put(K + 'tones/tone-ding-high.wav', SH['s8'][0] + 0.15, -8)
put(MG + 'football_kick.wav', SH['s9'][0] + 0.6, -6); put(MG + 'crowd_roar.wav', SH['s9b'][0], -12, 1.6)
put(MG + 'crowd_cheer.wav', SH['s10'][0], -12, 1.5)
put(MG + 'ref_whistle.wav', SH['s11'][0] + 0.2, -12, 0.8)
CATCH(SH['s14'][0] + 0.05); CATCH(SH['s17'][0] + 0.05); CATCH(SH['s19'][0] + 0.05); CATCH(SH['s21'][0] + 0.4)
put(MG + 'crowd_laugh.wav', SH['s23'][0] + 1.6, -14, 1.5)
for i in range(11): put(K + 'tones/tone-ding-high.wav', SH['s24'][0] + 0.1 + i * 0.16, -16)
put(MG + 'drumline.wav', SH['s26'][0], -16, 3.0)
for i in range(10): put(OC + 'TOONBoing_BounceCartoony_OS_04.ogg', SH['s27'][0] + 0.1 + i * 0.22, -14)
put(MG + 'sad_trombone.wav', SH['s29'][0] + 0.2, -14, 1.0)
put(MG + 'football_kick.wav', SH['s30'][0] - 0.2, -8); put(MG + 'crowd_roar.wav', SH['s30'][0] + 0.2, -8, 2.0); put(MG + 'stadium_horn.wav', SH['s31'][0], -12, 1.2)
put(A + 'pop/classic-pop.wav', SH['s32'][0] + 0.2, -10)
CATCH(SH['s35'][0] + 0.15); put(MG + 'crowd_cheer.wav', SH['s35'][0] + 0.4, -14, 1.2)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
