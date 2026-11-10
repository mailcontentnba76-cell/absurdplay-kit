"""E14: am_thanh/giong.wav (giọng gốc chuẩn hoá, bíp 1 kHz đè "fucking") + am_thanh/nhac.wav ("Night Life", alvana-audio synthwave, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sảnh khách sạn Vegas: phố đêm, xe chạy, cửa xe, chìa khoá rơi, cửa kính trượt, ting...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 71.40
src = open('/root/work/engine/ep14_shots.js').read()
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
W = json.load(open('giong/words_raw.json')); a, b = W[2][0] - 0.02, W[2][1] + 0.03
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b, W[2])
sm = int(0.08 * SR)
m = load('alvana-audio/music/synthwave/night-life.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s1b'][0]] = 0.3
for key, d, g in [('s5b', 0.9, 0.4), ('s13', 8.0, 0.55), ('s15b', 1.0, 0.4)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'; RD = 'Free-SFX/rubberduck/'
city = load(MG + 'crowd_ambience.wav'); city = np.tile(city, N // len(city) + 1)[:N] * 10 ** (-28 / 20); sfx += city.astype(np.float32)
KEYS = lambda t, db=-10: put(OC + 'MECHLock_DoorUnlockKey_OS_02.ogg', t, db, 0.5)
DROP = lambda t, db=-8: put(RD + 'WoodMetal/metal_hit_02.opus', t, db)
STAMP = lambda t, db=-12: put(A + 'impact/classic-stamp.wav', t, db)
NEON = lambda t, db=-14: put(K + 'mechanical/mechanical-switch-heavy.wav', t, db)
# hook: hai người lao vào giật chìa
put(A + 'whoosh/fast-bright.wav', 0.0, -12); put(A + 'impact/cinematic-heavy.wav', 0.55, -12); KEYS(0.56, -6); KEYS(1.0, -12)
put(OC + 'VEHCar_CarEngineSlow_LOOP_01.ogg', SH['s1c'][0], -22, 1.4)
NEON(SH['s2'][0] + 0.1); put(K + 'everyday-props/props-shop-bell.wav', SH['s2h'][0] + 0.1, -14)
put(OC + 'VEHCar_CarStartRunStop_OS_01.ogg', SH['s3'][0], -14, 2.6); NEON(11.42)
put(OC + 'VEHDoor_CarDoorClose_OS_01.ogg', SH['s3b'][0] + 0.1, -14); KEYS(14.4); DROP(15.6); put(MG + 'crowd_gasp.wav', 15.7, -20, 1.0)
STAMP(16.42); put(K + 'tones/tone-ding-high.wav', 17.06, -14)
KEYS(SH['s4b'][0] + 1.6, -10)
put(OC + 'VEHCar_CarEngineHigh_LOOP_01.ogg', SH['s5'][0] + 0.6, -12, 2.6); put(A + 'whoosh/fast-bright.wav', SH['s5b'][0], -8); STAMP(22.78, -8)
put(MG + 'crowd_silence_cough.wav', SH['s6b'][0] + 0.2, -22, 1.6)
NEON(29.16)
for tt in (30.0, 32.0, 33.3): KEYS(tt, -12)
STAMP(33.24); put(K + 'money/money-register.wav', SH['s9'][0] + 0.9, -12); put(MG + 'sad_trombone.wav', SH['s8'][0] + 0.4, -18, 1.0)
put(OC + 'DOORGlas_GlassDoorClose_OS_01.ogg', SH['s10'][0] + 0.6, -10); put(A + 'whoosh/fast-bright.wav', SH['s10'][0] + 0.6, -20)
KEYS(SH['s11'][0] + 0.6); DROP(49.9); STAMP(49.88); put(K + 'tones/tone-ding-high.wav', 50.76, -14); KEYS(52.3, -10); STAMP(51.6, -12)
put(OC + 'VEHCar_CarEngineHigh_LOOP_01.ogg', SH['s12'][0] + 0.3, -12, 2.4); put(MG + 'crowd_gasp.wav', SH['s12'][0] + 0.5, -18, 1.0)
put(MG + 'buzzer.wav', SH['s13'][0], -22, 0.4)
put(K + 'money/money-register.wav', SH['s14'][0] + 0.1, -10); put(MG + 'crowd_cheer.wav', SH['s14'][0] + 0.1, -18, 1.4)
put(MG + 'sad_trombone.wav', SH['s15'][0] + 0.5, -16, 1.2); put(MG + 'crowd_laugh.wav', SH['s15b'][0] + 0.5, -16, 1.6)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
