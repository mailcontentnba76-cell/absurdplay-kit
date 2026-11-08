"""E10: am_thanh/giong.wav (giọng GỐC chuẩn hoá, KHÔNG rút nghỉ, bíp 1 kHz đè chữ "fuck") + am_thanh/nhac.wav ("Happy Dance", alvana-audio upbeat, CC0 — chưa dùng)
+ am_thanh/sfx.wav (rừng tuyết: gió nhẹ, khán giả ngoài trời, DOINK kim loại + boing, rìu chặt, cột đổ, còi...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 84.48
src = open('/root/work/engine/ep10_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[bcd]?):\[([\d.,]+)\]", src.split('END')[0])}
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f if not f.startswith('/') and not f.startswith('giong') else f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
# ---- giọng: bíp đè "fuck"
voice = load('/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E10_michigan_goalposts/am_thanh/giong_raw.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
W = json.load(open('giong/words_raw.json')); a, b = W[2][0] - 0.02, W[2][1] + 0.03
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b)
sm = int(0.08 * SR)
def mask(pairs):
    g = np.zeros(N)
    for x, y in pairs: g[(T >= SH[x][0]) & (T < SH[y][1])] = 1
    return np.convolve(g, np.ones(sm) / sm, 'same')
# ---- nhạc: Happy Dance — khựng ở hook đầu, ở người khổng lồ (s30), ở "no extra point" (s34), câm sau "Again."
m = load('alvana-audio/music/upbeat/happy-dance.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[T < SH['s2'][0]] = 0.15
for key, d, g in [('s30', 1.4, 0.12), ('s34', 1.0, 0.15), ('s35c', 0.8, 0.0)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'; OC = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'
FIELD = mask([('s1', 's23'), ('s26', 's38')])
sfx += bed(MG + 'stadium_crowd_outdoor.wav', -20, FIELD) + bed(OC + 'MUSCChim_WindChimes_LOOP_01.ogg', -34, FIELD * 0.5) + bed(MG + 'crowd_ambience.wav', -26, mask([('s24', 's25')]))
DOINK = lambda t: (put(OC + 'METLImpt_MetalHitSurface_OS_03.ogg', t, -2), put(OC + 'TOONBoing_BounceCartoony_OS_02.ogg', t + 0.05, -8), put(MG + 'crowd_ooh_aah.wav', t + 0.2, -16, 1.2))
put(A + 'impact/cinematic-heavy.wav', 0.05, -10)
put(MG + 'football_kick.wav', SH['s2'][0] + 0.6, -6); put(MG + 'crowd_cheer.wav', SH['s2'][0] + 1.2, -16, 1.5)
put(MG + 'crowd_gasp.wav', SH['s3'][0] + 0.2, -14, 1.5)
for i in range(11): put(OC + 'TOONBoing_BounceCartoony_OS_01.ogg', SH['s4'][0] + 0.1 + i * 0.12, -16)
put(A + 'transition/whoosh-hit-2.wav', SH['s4b'][0] + 0.05, -12)
for k_ in ['s5', 's6', 's7']: put(A + 'pop/classic-pop.wav', SH[k_][0] + 0.2, -12)
put(MG + 'crowd_boo.wav', SH['s9'][0] + 0.2, -18, 1.5)
put(MG + 'football_hit.wav', SH['s10'][0] + 0.7, -10); put(OC + 'TOONBoing_BounceCartoony_OS_03.ogg', SH['s10'][0] + 0.9, -10)
put(MG + 'football_kick.wav', SH['s11'][0] + 0.6, -8); DOINK(SH['s11'][0] + 1.5)
put(MG + 'football_kick.wav', SH['s13'][0] + 0.6, -8)
for i in range(5): put(K + 'tones/tone-ding-high.wav', SH['s13'][0] + 0.05 + 0.38 * (i + 1), -10)
put(MG + 'crowd_cheer.wav', SH['s13b'][0], -14, 2.0)
put(MG + 'ref_whistle.wav', SH['s14'][0] + 0.1, -12, 0.8); put(MG + 'crowd_roar.wav', SH['s14'][0] + 0.3, -16, 1.5)
put(MG + 'crowd_silence_cough.wav', SH['s16'][0] + 0.3, -14, 2.0)
put(MG + 'crowd_ooh_aah.wav', SH['s18b'][0], -18, 1.0)
DOINK(SH['s19'][0] + 0.2); DOINK(SH['s21'][0] + 0.15)
put(MG + 'football_kick.wav', SH['s22'][0] + 0.6, -8); DOINK(SH['s23'][0] + 0.15)
put(MG + 'crowd_laugh.wav', SH['s25'][0] + 1.2, -14, 1.5)
put(MG + 'buzzer.wav', SH['s26'][0] + 0.1, -16, 0.8)
put(A + 'pop/classic-pop.wav', SH['s28'][0] + 0.3, -10)
put(MG + 'drumline.wav', SH['s29'][0], -16, 2.2)
for i in range(4): put(OC + 'FEETHmn_ShoeSnowLand_OS_01.ogg', SH['s30'][0] + 0.2 + i * 0.6, 2); put(K + 'impacts/impact-heavy-soft.wav', SH['s30'][0] + 0.2 + i * 0.6, -6)
for i in range(11): put(OC + 'WEAPAxe_WoodCutAxe_OS_01.ogg', SH['s31'][0] + 0.45 + i * 0.18, -8); put(OC + 'WOODImpt_LargeWoodDrop_OS_01.ogg', SH['s31'][0] + 0.75 + i * 0.18, -12)
put(MG + 'crowd_roar.wav', SH['s32'][0], -10, 1.5); put(MG + 'stadium_horn.wav', SH['s32'][0] + 0.1, -12, 1.2)
put(MG + 'ref_whistle.wav', SH['s33'][0] + 0.8, -10, 0.8); put(MG + 'crowd_boo.wav', SH['s34'][0], -14, 1.4)
put(MG + 'sad_trombone.wav', SH['s35c'][0] + 0.05, -10)
put(K + 'everyday-props/props-shop-bell.wav', SH['s36'][0] + 0.3, -12)
put(MG + 'football_kick.wav', SH['s38'][0] + 0.6, -6); put(MG + 'crowd_cheer.wav', SH['s38b'][0], -14, 2.0)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
