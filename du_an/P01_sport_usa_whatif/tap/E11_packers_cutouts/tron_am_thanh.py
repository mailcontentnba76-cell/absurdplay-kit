"""E11: am_thanh/giong.wav (giọng gốc chuẩn hoá, KHÔNG rút nghỉ, bíp 1 kHz đè "fuck") + am_thanh/nhac.wav ("A Small Town on Pluto", alvana-audio upbeat, CC0 — chưa dùng)
+ am_thanh/sfx.wav (trang trại chiều thu: gió cây chim, khán giả ngoài trời, tiếng bìa cứng, "bịch" FLAT, bò "moo" tổng hợp, chuông điện thoại...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 70.72
src = open('/root/work/engine/ep11_shots.js').read()
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
m = load('alvana-audio/music/upbeat/a-small-town-on-pluto.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s2'][0]] = 0.15
for key, d, g in [('s18', 0.6, 0.12), ('s21', 2.0, 0.3), ('s25', 2.4, 0.4), ('s28', 1.6, 0.4)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None, x=None):
    x = (load(fn) if x is None else x.copy()) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
def moo(d=1.4, f0=118):
    tt = np.arange(int(d * SR)) / SR; f = f0 * (1 + 0.25 * np.sin(np.pi * tt / d)) * (1 + 0.01 * np.sin(2 * np.pi * 5 * tt)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 14)); env = np.minimum(1, tt / 0.15) * np.minimum(1, (d - tt) / 0.35)
    fm = 500 + 400 * np.sin(np.pi * tt / d); y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): c = min(1, 2 * np.pi * fm[i] / SR); a += c * (x[i] - a); y[i] = a
    y = y * env; return (y / np.abs(y).max() * 0.6).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'
FIELD = mask([('s1', 's21'), ('s24', 's31')])
sfx += bed(MG + 'stadium_crowd_outdoor.wav', -23, FIELD) + bed(OC + 'WINDVege_LightWindTreesBirds_LOOP_01.ogg', -22, FIELD * 0.7) + bed(MG + 'crowd_ambience.wav', -27, mask([('s22', 's23')]))
WIND = mask([('s19', 's20')]); sfx += bed(A + 'ambience/wind.wav', -10, WIND)
CARD = lambda t, db=-12: put(OC + 'PAPRHndl_PaperCrumple_OS_01.ogg', t, db, 0.5)
FLAT = lambda t, db=-6: (put(A + 'impact/classic-thud.wav', t, db), put(A + 'paper/slide.wav', t - 0.05, db - 6, 0.4))
put(A + 'impact/cinematic-heavy.wav', 0.05, -10)
# HOOK: Packers lao vào hàng hình nộm — 5 cú va chạm + bìa văng
for tc in [0.79, 0.73, 1.06, 0.76, 0.82]: put(MG + 'football_hit.wav', tc, -9); put(OC + 'PAPRHndl_PaperCrumple_OS_01.ogg', tc + 0.02, -14, 0.4)
put(MG + 'crowd_roar.wav', 0.75, -14, 1.2); put(A + 'whoosh/fast-bright.wav', 0.02, -14)
put(MG + 'football_hit.wav', SH['s2'][0] + 0.9, -14); put(A + 'whoosh/pass-by.wav', SH['s2'][0] + 1.1, -12)
put(OC + 'MUSCChim_WindChimes_LOOP_01.ogg', SH['s3'][0], -26, 2.0)
for i in range(11): put(A + 'paper/page-flip.wav', SH['s4b'][0] + 0.15 + i * 0.14, -14, 0.3)
put(A + 'transition/whoosh-hit-2.wav', SH['s4b'][0], -12)
put(K + 'tones/tone-ding-high.wav', SH['s5'][0] + 0.1, -12)
for k, t0 in enumerate([16.1, 17.24, 18.24]): put(A + 'pop/classic-pop.wav', t0, -12)
for i in range(4): put(MG + 'crowd_cheer.wav', SH['s8'][0] + i * 1.2, -18, 1.2)
put(MG + 'stadium_horn.wav', SH['s10'][0] + 0.1, -16, 1.4)
put(MG + 'ref_whistle.wav', SH['s11'][0] + 0.2, -14, 0.7); put(MG + 'football_hit.wav', SH['s11'][0] + 0.8, -14)
put(MG + 'crowd_silence_cough.wav', SH['s12'][0] + 0.3, -16, 2.0)
put(A + 'paper/paper-02.wav', SH['s14'][0] + 0.3, -12, 0.6)
put(A + 'whoosh/pass-by.wav', SH['s15'][0] + 0.25, -10); put(MG + 'football_hit.wav', SH['s16'][0] + 0.3, -12); put(MG + 'crowd_roar.wav', SH['s16'][0] + 0.35, -12, 1.6)
put(A + 'paper/slide.wav', SH['s17'][0] + 0.3, -12, 1.2); put(K + 'appear-and-vanish/appear-dissolve.wav', SH['s17b'][0] + 0.5, -14)
FLAT(SH['s18'][0] + 0.05)
for f in range(3): put(OC + 'SWSH_Swoosh_OS_0%d.ogg' % (f + 1), SH['s20'][0] + f * 0.25 + 0.1, -10)
for t0 in [41.56, 42.06, 42.78]: FLAT(t0)
put(OC + 'BIRDFowl_Chicken_OS_01.ogg', SH['s21'][1] - 0.6, -20)
put(MG + 'crowd_laugh.wav', SH['s23'][0] + 1.4, -18, 1.4)
put(MG + 'buzzer.wav', SH['s24'][0] + 0.1, -18, 0.8)
put('', SH['s25'][0] + 1.2, -14, x=moo(1.4, 112)); put('', SH['s26'][0] + 0.2, -16, x=moo(1.0, 128))
put(MG + 'crowd_ooh_aah.wav', SH['s28'][0] + 0.6, -14, 1.4); put(A + 'impact/classic-thud.wav', SH['s28'][0] + 1.05, -10); put(MG + 'crowd_laugh.wav', SH['s28b'][0], -16, 1.2)
put(MG + 'stadium_horn.wav', SH['s29'][0] + 0.1, -12, 1.4); put(MG + 'crowd_roar.wav', SH['s29'][0] + 0.2, -14, 2.0)
put(K + 'phone/phone-ring-classic.wav', SH['s30'][0] - 0.3, -12, 1.6)
put(A + 'impact/classic-stamp.wav', SH['s31'][0] + 1.0, -8)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
