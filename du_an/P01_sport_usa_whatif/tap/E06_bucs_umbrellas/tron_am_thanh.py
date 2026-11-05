"""E06: am_thanh/nhac.wav (hip-hop "Hard Mode", HoliznaCC0, CC0 — chưa dùng ở tập trước) + am_thanh/sfx.wav (mưa nền, đám đông sân ngoài trời, tiếng động theo mốc).
Giọng GỐC giữ nguyên độ dài (65,76 s, không rút nghỉ). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 65.76
src = open('../../engine/ep06_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB')[0])}
SUB = {'s3': 6.46, 's27': 55.42, 's6': 15.28}
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
N = int(DUR * SR); T = np.arange(N) / SR
voice = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'am_thanh/giong.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; LV = lufs(voice)
INDOOR = [('s3', 's6'), ('s16', 's17'), ('s29', 's30')]
def mask(pairs):
    g = np.zeros(N)
    for a, b in pairs: g[(T >= SH[a][0]) & (T < SH[b][1])] = 1
    return g
ind = mask(INDOOR); sm = int(0.08 * SR); ind = np.convolve(ind, np.ones(sm) / sm, 'same')
# ---- nhạc: vào thẳng đoạn drop 9,59 s; khựng ở "Except"; tắt 1 nhịp ở "Interception" và FINAL
m = load('alvana-audio/music/hiphop/hard-mode.mp3')[int(9.588 * SR):][:N]; m = np.pad(m, (0, N - len(m)))
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.1 * SR)] = np.linspace(0, 1, int(0.1 * SR))
gm[(T >= SH['s3'][0]) & (T < SH['s3'][0] + 0.8)] = 0.1
gm[(T >= SH['s23'][0]) & (T < SH['s23'][0] + 0.7)] = 0.15
gm[(T >= SH['s27'][0]) & (T < SH['s27'][0] + 1.0)] = 0.1
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
B = {'rain': 'alvana-audio/sfx/ambience/rain.wav', 'whoosh': 'alvana-audio/sfx/transition/whoosh-hit-2.wav', 'pop': 'alvana-audio/sfx/pop/classic-pop.wav', 'boom': 'alvana-audio/sfx/impact/cinematic-heavy.wav',
     'scratch': 'alvana-audio/sfx/ui/scratch-004.wav', 'thud': 'sfx-kit/sounds/impacts/impact-heavy-soft.wav', 'splash': 'alvana-audio/sfx/ambience/water-02.wav', 'fail': 'sfx-kit/sounds/notifications/notification-failure-thud.wav',
     'shim': 'sfx-kit/sounds/shimmers/shimmer-short-bright.wav', 'clap': 'sfx-kit/sounds/interface/click-clap-firm.wav', 'umb': 'sfx-kit/sounds/shape-changes/transform-inflate.wav'}
# mưa + khán giả ngoài trời suốt các shot sân; trong nhà nhỏ đi nhiều
rain = load(B['rain']); rain = np.tile(rain, N // len(rain) + 1)[:N] * 10 ** (-12 / 20)
crowd = load(MG + 'stadium_crowd_outdoor.wav'); crowd = np.tile(crowd, N // len(crowd) + 1)[:N] * 10 ** (-20 / 20)
sfx += (rain * (1 - 0.85 * ind) + crowd * (1 - ind)).astype(np.float32)
put(B['umb'], SH['s2'][0] + 0.35 * (SH['s2'][1] - SH['s2'][0]) + 0.2, -6)                     # ô bật mở
put(B['scratch'], SH['s3'][0], -5); put(B['boom'], SH['s3'][0] + 0.05, -8)
put(B['whoosh'], SUB['s3'], -10); put(B['pop'], SH['s4'][0] + 0.2, -8); put(B['pop'], SH['s5'][0] + 0.2, -10)
put(B['whoosh'], SH['s7'][0], -9); put(B['whoosh'], SH['s9'][0], -12)
put(MG + 'ref_whistle.wav', SH['s10'][0] + 0.1, -12)
for k_ in ('s12', 's13', 's14'): put(MG + 'football_hit.wav', SH[k_][0] + 0.45 * (SH[k_][1] - SH[k_][0]), -9); put(B['pop'], SH[k_][0] + 0.05, -14)
for i in range(10): put(MG + 'football_hit.wav', SH['s15'][0] + 0.3 + i * 0.33, -14 - i * 0.5)
put(MG + 'crowd_laugh.wav', SH['s16'][0] + 1.6, -16, 1.6)
put(MG + 'stadium_horn.wav', SH['s18'][0], -12, 1.0)
put(MG + 'crowd_ooh_aah.wav', SH['s20'][0], -12, 1.8)
put(MG + 'football_kick.wav', SH['s21'][0] + 0.65, -10)
put(B['umb'], SH['s22'][0] + 0.45, -5); put(MG + 'crowd_gasp.wav', SH['s22'][0] + 0.6, -10)
put(MG + 'ref_whistle.wav', SH['s23'][0] + 0.05, -10)
put(B['splash'], SH['s24'][0] + 1.35, -2, 1.4); put(B['thud'], SH['s24'][0] + 1.3, -6)
put(B['splash'], SH['s25'][0] + 0.6, -5, 1.0); put(MG + 'crowd_laugh.wav', SH['s25'][0] + 0.7, -12, 1.2)
put(MG + 'buzzer.wav', SH['s27'][0], -8); put(MG + 'crowd_cheer.wav', SUB['s27'], -12, 1.2)
put(B['fail'], SH['s28'][0] + 0.5, -12)
put(MG + 'camera_flashes.wav', SH['s29'][0], -10, 3.2); put(B['shim'], SH['s30'][0] + 2.0, -8)
for i in range(4): put(B['clap'], SH['s30'][0] + 2.2 + i * 0.22, -8)
save('nhac', m); save('sfx', sfx)
print('LUFS lời', LV, 'nhạc', round(lufs(m), 1), 'sfx', round(lufs(sfx), 1))
