"""E13: am_thanh/giong.wav (giọng gốc chuẩn hoá, KHÔNG rút nghỉ, bíp 1 kHz đè "fuck") + am_thanh/nhac.wav ("Final Level", alvana-audio hiphop, CC0 — chưa dùng)
+ am_thanh/sfx.wav (bãi xe siêu thị tuyết: gió, khán giả, tiếng xe đẩy lách cách, bánh kêu cót két, bíp máy quét, máy tính tiền...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 75.30
src = open('/root/work/engine/ep13_shots.js').read()
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
m = load('alvana-audio/music/hiphop/final-level.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s2'][0]] = 0.2
for key, d, g in [('s5b', 1.2, 0.3), ('s10b', 1.2, 0.3), ('s17', 1.0, 0.35), ('s21', 2.0, 0.45)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
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
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'; RD = 'Free-SFX/rubberduck/'
FIELD = mask([('s1', 's11b'), ('s13', 's24')])
sfx += bed(MG + 'stadium_crowd_outdoor.wav', -22, FIELD) + bed(A + 'ambience/wind.wav', -24, FIELD) + bed(MG + 'crowd_ambience.wav', -27, mask([('s12', 's12')]))
RATTLE = lambda t, db=-14, n=0.9: put(OC + 'CHAINMvmt_ChainsCreepy_OS_01.ogg', t, db, n)
CLANK = lambda t, db=-10, j=1: put(RD + f'WoodMetal/metal_hit_0{j}.opus', t, db)
SQK = lambda t, db=-16: put(RD + 'WoodMetal/wood_squeak_01.opus', t, db, 0.6)
SCAN = lambda t, db=-14: put(K + 'digital/digital-scan-clear.wav', t, db)
STAMP = lambda t, db=-10: put(A + 'impact/classic-stamp.wav', t, db)
# hook: va chạm
put(A + 'impact/cinematic-heavy.wav', 0.05, -10); put(A + 'whoosh/fast-bright.wav', 0.02, -14)
for i, tc in enumerate([0.67, 0.62, 0.64, 0.65, 0.70]): put(MG + 'football_hit.wav', tc, -9); CLANK(tc + 0.01, -9, 1 + i % 5)
RATTLE(0.0, -12, 0.7); put(MG + 'crowd_gasp.wav', 0.8, -16, 1.0)
SCAN(SH['s2'][0] + 0.2); SQK(SH['s2'][0] + 1.3); put(MG + 'crowd_boo.wav', SH['s2'][0] + 1.6, -22, 1.4)
put(MG + 'stadium_horn.wav', SH['s2b'][0] + 0.1, -18, 1.2)
for i in range(11): RATTLE(SH['s3'][0] + i * 0.12, -20, 0.5)
SCAN(SH['s4'][0] + 0.9); SCAN(10.08); put(MG + 'football_kick.wav', SH['s4b'][0] + 0.85, -14); put(MG + 'crowd_boo.wav', SH['s4b'][0] + 1.0, -18, 1.4)
put(K + 'money/money-register.wav', SH['s5'][0] + 0.2, -12); STAMP(13.40); STAMP(14.66, -8); put(MG + 'sad_trombone.wav', 15.3, -16, 1.0)
for i in range(11): RATTLE(SH['s6'][0] + i * 0.26, -18, 0.8); CLANK(SH['s6'][0] + i * 0.26 + 1.3, -18, 1 + i % 5)
put(K + 'tones/tone-ding-high.wav', SH['s6'][0] + 3.4, -10); STAMP(21.36); put(MG + 'crowd_cheer.wav', 21.4, -20, 1.0)
for t0, z in [(SH['s8'][0], 23.92), (SH['s9'][0], 26.66)]: put(MG + 'football_hit.wav', t0 + 1.2, -14); put(MG + 'ref_whistle.wav', t0 + 1.4, -16, 0.7); SCAN(z, -12)
put(MG + 'football_hit.wav', SH['s10'][0] + 1.1, -10); put(OC + 'TOONBoing_BounceCartoony_OS_02.ogg', SH['s10'][0] + 1.12, -10); put(MG + 'crowd_ooh_aah.wav', SH['s10'][0] + 1.3, -16, 1.2)
put(A + 'impact/classic-thud.wav', 30.70, -8); put(MG + 'buzzer.wav', 30.75, -16, 0.8)
put(MG + 'crowd_ambience.wav', SH['s11'][0], -24, 1.6); CLANK(SH['s11b'][0] + 1.1, -10, 2); put(K + 'tones/tone-ding-high.wav', SH['s11b'][0] + 1.15, -14)
put(MG + 'crowd_boo.wav', SH['s12b'][0] + 0.05, -10, 2.0)
put(MG + 'crowd_cheer.wav', SH['s13'][0] + 0.8, -14, 1.4); put(MG + 'crowd_clap_rhythm.wav', SH['s13'][0] + 0.8, -18, 2.4); put(MG + 'crowd_roar.wav', SH['s13b'][0] + 0.05, -14, 1.3)
RATTLE(SH['s14'][0], -14, 2.3); put(K + 'money/money-register.wav', 44.6, -12); put(MG + 'crowd_laugh.wav', SH['s14b'][0] + 1.6, -18, 1.4)
put(MG + 'crowd_gasp.wav', SH['s15'][0] + 0.8, -14, 1.0); STAMP(49.6); put(OC + 'OBJBag_CanvasCaseDrop_OS_01.ogg', SH['s15b'][0] + 0.3, -12)
put(MG + 'crowd_boo.wav', SH['s16'][0] + 0.1, -20, 1.6); put(A + 'whoosh/fast-bright.wav', SH['s16b'][0] + 0.95, -12); STAMP(54.5); put(MG + 'crowd_gasp.wav', 54.6, -14, 1.0)
SQK(SH['s17'][0] + 0.1, -12); RATTLE(SH['s17'][0] + 0.2, -14, 1.4); STAMP(55.72); put(MG + 'sad_trombone.wav', 56.6, -14, 1.0)
put(MG + 'buzzer.wav', SH['s18'][0] + 0.1, -14, 1.0); put(K + 'money/money-register.wav', SH['s18'][0] + 0.4, -10)
put(MG + 'football_kick.wav', SH['s19'][0] + 0.6, -10); put(MG + 'crowd_ooh_aah.wav', SH['s19'][0] + 1.2, -20, 1.0)
put(A + 'ambience/wind.wav', SH['s20'][0], -12, 1.8); RATTLE(SH['s20'][0] + 0.2, -14, 1.3); STAMP(62.64); put(MG + 'crowd_cheer.wav', 62.7, -18, 1.2)
put(K + 'appear-and-vanish/appear-poof.wav', SH['s21'][0] + 0.9, -8); [RATTLE(SH['s21'][0] + 1.0 + i * 0.1, -18, 0.4) for i in range(6)]
for i in range(5): SQK(SH['s22'][0] + 0.2 + i * 0.45, -16)
RATTLE(SH['s23'][0], -15, 2.4); CLANK(SH['s24'][0] + 0.1, -12, 3); STAMP(72.44, -8); put(MG + 'crowd_laugh.wav', 72.6, -16, 1.6)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
