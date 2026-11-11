"""E15: am_thanh/giong.wav (giọng gốc, bíp 1 kHz đè "fucking") + am_thanh/nhac.wav ("Eat", alvana-audio funk, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sảnh mall mùa lễ: tiếng người, súng quét bíp, dấu mộc, máy in hoá đơn, tiền, cửa kính, gió lạnh...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 70.40
src = open('/root/work/engine/ep15_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
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
W = json.load(open('giong/words_raw.json')); assert W[2][2] == 'fucking'; a, b = W[2][0] - 0.02, W[2][1] + 0.03
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b, W[2])
sm = int(0.08 * SR)
m = load('alvana-audio/music/funk/eat.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s1b'][0]] = 0.3
for key, d, g in [('s6b', 1.0, 0.35), ('s10b', 1.0, 0.5), ('s12', 3.5, 0.45), ('s19b', 0.6, 0.3)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'
amb = load(MG + 'crowd_ambience.wav'); amb = np.tile(amb, N // len(amb) + 1)[:N] * 10 ** (-30 / 20); sfx += amb.astype(np.float32)
SCAN = lambda t, db=-14: put(K + 'digital/digital-scan-clear.wav', t, db, 0.5)
STAMP = lambda t, db=-10: put(A + 'impact/classic-stamp.wav', t, db)
DING = lambda t, db=-14: put(K + 'tones/tone-ding-high.wav', t, db)
REG = lambda t, db=-12: put(K + 'money/money-register.wav', t, db)
# hook: súng quét bíp đối đầu
put(A + 'whoosh/fast-bright.wav', 0.0, -12); SCAN(0.05, -10); SCAN(0.6, -12); SCAN(1.2, -10); put(A + 'impact/cinematic-heavy.wav', SH['s1b'][0], -12)
for tt in (2.6, 3.4, 4.3, 5.0): SCAN(tt, -16)
put(K + 'everyday-props/props-shop-bell.wav', SH['s2'][0] + 0.2, -14); put(K + 'mechanical/mechanical-switch-heavy.wav', SH['s2b'][0] + 0.05, -14)
put(MG + 'crowd_ooh_aah.wav', SH['s3'][0] + 0.2, -22, 1.4)
put(K + 'mechanical/mechanical-switch-heavy.wav', SH['s4'][0] + 1.3, -14); DING(SH['s4'][0] + 1.4)
for i in range(8): STAMP(16.7 + i * 0.2, -14)
put(MG + 'sad_trombone.wav', SH['s5b'][0] + 0.3, -18, 1.1)
for t0 in (SH['s6'][0], SH['s6'][0] + 2.16): put(A + 'footsteps/concrete-001.wav', t0 + 0.2, -16, 1.1); put(K + 'digital/digital-denied.wav', t0 + 1.35, -18)
STAMP(24.28, -8); put(MG + 'crowd_silence_cough.wav', SH['s6b'][0] + 0.2, -22, 1.0)
put(A + 'whoosh/fast-bright.wav', SH['s7'][0] + 1.4, -14); put(MG + 'crowd_gasp.wav', 28.0, -18, 1.0); STAMP(28.4, -10)
put(K + 'mechanical/mechanical-switch-heavy.wav', SH['s8'][0] + 1.4, -14); DING(SH['s8'][0] + 1.5)
put(K + 'everyday-props/props-page-turn.wav', 33.1, -10); STAMP(33.1, -10); put(MG + 'crowd_gasp.wav', 33.2, -20, 1.0); DING(34.2)
REG(SH['s10'][0] + 2.4); put(MG + 'sneaker_squeak.wav', SH['s10'][0] + 0.4, -16, 0.6)
put(A + 'whoosh/fast-bright.wav', SH['s10b'][0], -8); STAMP(37.9, -8); put(MG + 'crowd_boo.wav', 38.0, -18, 1.2)
put(OC + 'DOORGlas_GlassDoorOpen_OS_01.ogg', SH['s11'][0], -14)
put(K + 'digital/digital-process-clear.wav', SH['s11b'][0] + 0.3, -14, 1.6); put(K + 'everyday-props/props-tape.wav', SH['s11b'][0] + 2.0, -14, 0.6)
REG(44.42, -10); put(MG + 'crowd_cheer.wav', 44.5, -20, 1.4)
put(OC + 'DOORGlas_GlassDoorOpen_OS_01.ogg', SH['s12'][0] + 0.2, -8); put(A + 'ambience/wind.wav', SH['s12'][0] + 0.2, -16, 2.6)
put(A + 'footsteps/concrete-002.wav', SH['s12b'][0], -16, 1.8)
put(A + 'whoosh/fast-bright.wav', SH['s13b'][0] + 0.2, -16); put(A + 'impact/classic-thud.wav', SH['s13b'][0] + 1.25, -12)
put(MG + 'crowd_gasp.wav', 53.3, -18, 1.0); put(K + 'everyday-props/props-page-turn.wav', 54.7, -12)
REG(56.3, -12); put(OC + 'DOORHdwr_OfficeDoorKnob_OS_01.ogg', SH['s16'][0], -14)
put(K + 'writing-and-drawing/writing-marker-draw.wav', 59.6, -10, 1.2); DING(61.1, -12)
put(MG + 'crowd_cheer.wav', 63.0, -18, 1.4); put(MG + 'sad_trombone.wav', 64.5, -16, 1.2)
put(K + 'money/money-register.wav', 65.9, -14); STAMP(66.86, -4); put(A + 'impact/cinematic-heavy.wav', 66.86, -12); put(MG + 'crowd_laugh.wav', 67.2, -16, 1.8)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
