"""E05: tạo am_thanh/giong_bip.wav (lời, câm đúng chữ "heck" để tiếng bíp phủ), am_thanh/nhac.wav (chiptune "ICE temple", HoliznaCC0, CC0)
và am_thanh/sfx.wav (bíp + tiếng động theo mốc shot). Dùng: python3 tron_am_thanh.py (chạy trong thư mục tập). Thư viện CC0: /root/work/assets/audio."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'
src = open('../../engine/ep05_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB')[0])}
SUB = {'s13': [21.34, 21.98, 22.6], 's14': [24.48, 25.6], 's20': 39.7}
BEEP = [0.5, 1.02]; DUR = 48.77
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
# ---- câm chữ bị bíp (fade 6 ms hai đầu) → giọng bíp
vb = voice.copy(); a, b = int(BEEP[0] * SR), int(BEEP[1] * SR); f = int(0.006 * SR)
g = np.ones(N); g[a:b] = 0; g[a - f:a] = np.linspace(1, 0, f); g[b:b + f] = np.linspace(0, 1, f); vb *= g
save('giong_bip', vb)
# ---- nhạc: chiptune băng giá, vào thẳng đoạn drop (8,67 s trong bài); khựng ở "Except", tắt 1 nhịp ở FINAL
m = load('alvana-audio/music/chiptune/ice-temple.mp3')[int(8.67 * SR) - int(0.0 * SR):][:N]; m = np.pad(m, (0, N - len(m)))
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.12 * SR)] = np.linspace(0, 1, int(0.12 * SR))
gm[(T >= SH['s7'][0]) & (T < SH['s7'][0] + 0.9)] = 0.1
gm[(T >= SH['s7'][0] + 0.9) & (T < SH['s9'][0])] = 0.6
gm[(T >= SH['s20'][0]) & (T < SH['s20'][0] + 1.2)] = 0.0
gm[(T >= SH['s21'][0])] = 0.55
gm[(T >= SH['s23'][0])] = 0.9
sm = int(0.08 * SR); gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
# tiếng bíp 1 kHz (chuẩn TV), cùng độ to với lời
bb = 0.32 * np.sin(2 * np.pi * 1000 * T[a:b]); bb[:f] *= np.linspace(0, 1, f); bb[-f:] *= np.linspace(1, 0, f); sfx[a:b] += bb.astype(np.float32)
B = {'whoosh': 'alvana-audio/sfx/transition/whoosh-hit-2.wav', 'air': 'alvana-audio/sfx/whoosh/air-03.wav', 'pop': 'alvana-audio/sfx/pop/classic-pop.wav',
     'boom': 'alvana-audio/sfx/impact/cinematic-heavy.wav', 'fail': 'sfx-kit/sounds/notifications/notification-failure-thud.wav', 'scratch': 'alvana-audio/sfx/ui/scratch-004.wav',
     'thud': 'sfx-kit/sounds/impacts/impact-heavy-soft.wav', 'spring': 'alvana-audio/sfx/misc/spring-01.wav', 'wind': 'alvana-audio/sfx/ambience/wind.wav',
     'drip': 'sfx-kit/sounds/everyday-props/props-drip.wav', 'clap': 'sfx-kit/sounds/interface/click-clap-firm.wav', 'shim': 'sfx-kit/sounds/shimmers/shimmer-short-bright.wav',
     'jing': 'alvana-audio/sfx/jingle/8bit-05.wav', 'bub': 'sfx-kit/sounds/pops/pop-small-bubble.wav'}
w = load(B['wind']); w = np.tile(w, N // len(w) + 1)[:N] * 10 ** (-17 / 20)
gw = np.ones(N); gw[T >= SH['s21'][0]] = 1.8; gw[T >= SH['s23'][0]] = 1.0; gw = np.convolve(gw, np.ones(sm * 4) / (sm * 4), 'same'); sfx += (w * gw).astype(np.float32)
put(B['air'], 0.0, -8)                                                       # người tuyết lướt băng
put(B['thud'], SH['s1'][0] + 0.45, -6)                                        # Powell trượt ngã
put(MG + 'rim_dunk.wav', 0.85, -4)                                            # que úp rổ (dưới tiếng bíp)
put(B['whoosh'], SH['s2'][0], -9)
put(MG + 'rim_dunk.wav', SH['s3'][0] + 1.02, -5)                              # Wilson úp rổ
for h in (0.6, 1.25): put(B['spring'], SH['s4'][0] + h, -12)                  # người tuyết nhún không lên
for i in range(3): put(B['drip'], SH['s5'][0] + 0.25 + i * 0.42, -6)
put(B['clap'], SH['s6'][0] + 0.62, -2); put(MG + 'crowd_laugh.wav', SH['s6'][0] + 0.2, -16, 1.6)
put(B['scratch'], SH['s7'][0], -5); put(B['boom'], SH['s7'][0] + 0.05, -6)
for i in range(6): put(B['fail'], SH['s8'][0] + (i + 1) * (SH['s8'][1] - SH['s8'][0]) / 7.2, -12)
put(MG + 'ref_whistle.wav', SH['s9'][0] + 0.05, -9)
for q in range(3): put(MG + 'ball_dribble.wav', SH['s9'][0] + 0.35 + 1.62 + q * 0.32, -8 - q * 3, 0.25)
put(B['pop'], SH['s10'][0] + 1.2, -10)
put(MG + 'backboard_bang.wav', SH['s11'][0] + 0.51 + 0.9, -6)
put(MG + 'backboard_bang.wav', SH['s12'][0] + 0.48 + 0.75, -6)
M13 = [[SH['s13'][0], SUB['s13'][0]], [SUB['s13'][0], SUB['s13'][1]], [SUB['s13'][1], SUB['s13'][2]], [SUB['s13'][2], SH['s13'][1]]]
for i, (p, q) in enumerate(M13): put(MG + 'backboard_bang.wav', p + 0.05 + 0.55 * (q - p), -7 - i)
put(B['air'], SH['s14'][0], -9)
put(MG + 'swish.wav', SUB['s14'][0] + 0.6, -5); put(MG + 'swish.wav', SUB['s14'][1] + 1.1, -5)
put(MG + 'buzzer.wav', SH['s15'][0], -10); put(MG + 'sad_trombone.wav', SH['s15'][0] + 0.4, -6)
put(MG + 'stadium_horn.wav', SH['s16'][0], -12, 1.6)
put(B['shim'], SH['s17'][0] + 0.12, -8)
put(B['drip'], SH['s18'][0] + 0.3, -8); put(MG + 'swish.wav', SH['s18'][0] + 1.4, -6)
put(B['pop'], SH['s19'][0] + 0.3, -10)
put(MG + 'buzzer.wav', SH['s20'][0], -8); put(B['boom'], SH['s20'][0] + 0.15, -7)
for i in range(5): put(B['bub'], SUB['s20'] + 0.2 + i * 0.25, -12)
put(B['fail'], SH['s21'][0] + 0.4, -10)
put(B['jing'], SH['s23'][0] + 0.3, -10)
save('nhac', m); save('sfx', sfx)
print('LUFS lời', LV, 'nhạc', round(lufs(m), 1), 'sfx', round(lufs(sfx), 1))
