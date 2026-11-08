"""E08: am_thanh/nhac.wav (funk "Eat", alvana-audio, CC0 — chưa dùng ở tập trước, hợp gag hươu "ăn" bóng)
+ am_thanh/sfx.wav (gió thảo nguyên, tiếng sân đấu Magnific, tiếng nhai/ngáy, tiếng động theo mốc shot).
Giọng GỐC giữ nguyên độ dài (68,44 s, không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav.
Dùng: python3 tron_am_thanh.py (chạy trong thư mục tập). Thư viện CC0: /root/work/assets/audio."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 68.44
src = open('/root/work/engine/ep08_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
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
sm = int(0.08 * SR)
def mask(pairs):
    g = np.zeros(N)
    for a, b in pairs: g[(T >= SH[a][0]) & (T < SH[b][1])] = 1
    return np.convolve(g, np.ones(sm) / sm, 'same')
# ---- nhạc: funk "Eat" — khựng ở "Except" (s3), tắt hẳn lúc trường quay nói (s23 đầu), hạ ở "Ice cold" (s32), vang lại ở FINAL
m = load('alvana-audio/music/funk/eat.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)  # nhạc dưới lời ~10 dB (ngưỡng 8–12)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.1 * SR)] = np.linspace(0, 1, int(0.1 * SR))
for key, d, g in [('s3', 0.8, 0.1), ('s18', 0.5, 0.2), ('s32', 1.2, 0.25), ('s33', 0.7, 0.4)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[(T >= SH['s23'][0]) & (T < SH['s23'][1])] *= 0.6
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
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
SAV = mask([('s1', 's22'), ('s24', 's34'), ('s36', 's36')])
sfx += bed(A + 'ambience/wind.wav', -20, SAV) + bed(MG + 'stadium_crowd_outdoor.wav', -24, SAV)
put(A + 'impact/cinematic-heavy.wav', 0.02, -10)
put(A + 'ui/scratch-004.wav', SH['s3'][0], -5); put(A + 'transition/whoosh-hit-2.wav', SH['s3'][0] + 0.05, -9)
put(K + 'pops/pop-medium-in.wav', SH['s2'][0] + 0.25, -10)
for k_, dt in [('s5', 2.0), ('s28', 0.0)]: put(MG + 'rim_dunk.wav', SH[k_][0] + dt, -6)
put(MG + 'crowd_cheer.wav', SH['s5'][0] + 2.1, -10, 1.5)
put(MG + 'sneaker_squeak.wav', SH['s5'][0] + 0.3, -12)
put(K + 'pops/pop-large-in.wav', SH['s6'][0] + 0.4, -10)
put(MG + 'backboard_bang.wav', SH['s7'][0] + 0.55, -8); put(MG + 'crowd_ooh_aah.wav', SH['s7'][0] + 0.6, -12, 1.4)
put(K + 'pops/pop-large-in.wav', SH['s8'][0] + 0.05, -8)
put(MG + 'backboard_bang.wav', SH['s9'][0] + 1.45, -10)
put(K + 'tones/tone-ding-high.wav', SUB.get('s10', SH['s10'][0]) + 1.1, -8)
put(K + 'whooshes/whoosh-fast-medium.wav', SH['s11'][0] + 0.2, -8)
put(MG + 'ref_whistle.wav', SH['s12'][0] + 0.1, -10, 0.8)
put(K + 'pops/pop-medium-in.wav', SH['s13'][0] + 0.45, -8)
for i, d in enumerate([0.45, 0.75, 1.05, 1.35]): put(A + f'body/eat-0{i % 4 + 1}.wav', SH['s14'][0] + d, -6)
put(K + 'whooshes/whoosh-fast-soft.wav', SH['s15'][0], -10)
for i in range(6): put(K + 'impacts/impact-heavy-soft.wav', SH['s16'][0] + 0.15 + i * 0.27, -18)
put(MG + 'ball_dribble.wav', SH['s17'][0], -12, 1.2)
put(K + 'impacts/impact-heavy-soft.wav', SH['s18'][0], -4); put(MG + 'crowd_gasp.wav', SH['s18'][0] + 0.05, -10, 1.2)
put(A + 'whoosh/swish-5.wav', SH['s19'][0] + 0.3, -10)
for i, d in enumerate([0.3, 0.6, 0.9]): put(A + f'body/eat-0{i + 2}.wav', SH['s20'][0] + d, -6)
put(MG + 'crowd_laugh.wav', SH['s20'][0] + 0.6, -14, 1.2)
put(K + 'whooshes/whoosh-fast-soft.wav', SH['s22'][0] + 0.3, -12)
put(MG + 'crowd_clap_rhythm.wav', SH['s23'][0] + 0.2, -16, 2.0); put(MG + 'crowd_laugh.wav', SUB['s23'] + 2.0, -16, 1.4)
for i, d in enumerate([0.2, 0.6, 1.0, 1.4, 1.8]): put(A + f'body/eat-0{i % 4 + 1}.wav', SH['s24'][0] + d, -9)
put(MG + 'drumline.wav', SH['s25'][0], -14, 2.8)
put(MG + 'ball_dribble.wav', SH['s26'][0], -10, 1.2)
put(MG + 'sneaker_squeak.wav', SH['s27'][0] + 1.0, -10)
put(MG + 'crowd_roar.wav', SH['s28'][0] + 0.1, -9, 2.0); put(A + 'body/snore.wav', SUB['s28'], -8)
put(MG + 'ref_whistle.wav', SH['s29'][0] + 0.05, -10, 0.8); put(MG + 'crowd_cheer.wav', SH['s29'][0] + 0.1, -12, 1.0)
put(MG + 'crowd_silence_cough.wav', SH['s31'][0], -14, 2.2); put(MG + 'ball_dribble.wav', SH['s31'][0] + 0.2, -11, 2.0)
put(K + 'shimmers/shimmer-short-bright.wav', SH['s32'][0] + 0.05, -10)
put(MG + 'swish.wav', SH['s33'][0] + 0.55, -4)
put(MG + 'buzzer.wav', SH['s34'][0], -10, 1.2); put(MG + 'crowd_roar.wav', SH['s34'][0] + 0.1, -8, 2.2); put(MG + 'stadium_horn.wav', SH['s34'][0] + 0.2, -12, 1.5)
for i, d in enumerate([0.1, 0.5, 0.9]): put(A + f'body/eat-0{i + 1}.wav', SUB['s34'] + d, -8)
put(MG + 'camera_flashes.wav', SH['s35'][0] + 0.1, -10, 2.4); put(K + 'notifications/notification-attention-clear.wav', SH['s35'][0] + 0.8, -12)
put(MG + 'sad_trombone.wav', SH['s36'][0] + 0.2, -10)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
