"""E09: am_thanh/nhac.wav (upbeat "Happy Dance", alvana-audio, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (tiếng nhà thi đấu: khán giả Magnific, còi, giày, bóng; tiếng động theo mốc shot).
Giọng GỐC giữ nguyên độ dài (67,97 s, không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav.
Dùng: python3 tron_am_thanh.py (chạy trong thư mục tập). Thư viện CC0: /root/work/assets/audio."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 67.97
src = open('/root/work/engine/ep09_shots.js').read()
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
# ---- nhạc: upbeat "Happy Dance" — khựng ở "Except" (s4), tắt ở 2 lần "The cone didn't move." (s28, s31), hạ khi khán giả ngủ (s34–s35), vang lại ở FINAL
m = load('alvana-audio/music/upbeat/happy-dance.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.1 * SR)] = np.linspace(0, 1, int(0.1 * SR))
for key, d, g in [('s4', 0.8, 0.1), ('s27', 0.4, 0.3)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
for key in ['s28', 's31']: gm[(T >= SH[key][0]) & (T < SH[key][1])] = 0.0
gm[(T >= SH['s34'][0]) & (T < SH['s36'][0])] = 0.35
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
GYM = mask([('s1', 's31'), ('s34', 's39'), ('s41', 's41')])
sfx += bed(MG + 'crowd_ambience.wav', -20, GYM)
put(A + 'impact/cinematic-heavy.wav', 0.02, -10)
put(MG + 'crowd_cheer.wav', SH['s1'][0], -12, 1.2)
put(A + 'ui/scratch-004.wav', SH['s4'][0], -5); put(A + 'transition/whoosh-hit-2.wav', SH['s4'][0] + 0.05, -9)
for k_ in ['s5', 's6', 's7', 's8']: put(K + 'pops/pop-medium-in.wav', SH[k_][0] + 0.05, -10)
put(MG + 'buzzer.wav', SH['s9'][0] + 0.1, -12, 0.8)
for k_ in ['s10', 's11', 's12']: put(MG + 'sad_trombone.wav', SH[k_][0] + 0.7, -16, 0.9)
put(K + 'tones/tone-ding-high.wav', SH['s14'][0] + 0.2, -8); put(MG + 'crowd_laugh.wav', SH['s15'][0] + 0.4, -14, 1.4)
put(K + 'whooshes/whoosh-fast-medium.wav', SH['s16'][0] + 0.1, -8); put(MG + 'drumline.wav', SH['s16'][0] + 0.3, -16, 2.5)
for k_ in ['s17', 's18', 's19']: put(K + 'pops/pop-large-in.wav', SH[k_][0] + 0.05, -10)
put(MG + 'ref_whistle.wav', SH['s20'][0] + 0.05, -10, 0.8)
put(MG + 'ball_dribble.wav', SH['s22'][0] + 0.7, -10, 1.2); put(MG + 'crowd_ooh_aah.wav', SH['s22'][0] + 0.5, -14, 1.5)
put(K + 'whooshes/whoosh-fast-soft.wav', SH['s23'][0], -10)
put(MG + 'sneaker_squeak.wav', SH['s26'][0] + 0.6, -10); put(MG + 'ball_dribble.wav', SH['s26'][0], -12, 2.0)
put(MG + 'football_hit.wav', SH['s26'][0] + 2.05, -12, 0.5); put(MG + 'crowd_gasp.wav', SH['s26'][0] + 2.1, -12, 1.2)
put(MG + 'buzzer.wav', SH['s27'][0] + 0.05, -14, 0.6)
put(MG + 'crowd_silence_cough.wav', SH['s28'][0], -12, 1.4)
put(MG + 'sneaker_squeak.wav', SH['s29'][0] + 0.6, -9); put(MG + 'ball_dribble.wav', SH['s29'][0], -12, 1.6)
put(MG + 'crowd_silence_cough.wav', SH['s31'][0], -12, 1.3)
put(MG + 'crowd_clap_rhythm.wav', SH['s32'][0] + 0.2, -16, 2.0)
for i, d in enumerate([0.0, 1.08, 1.92]): put(K + 'pops/pop-medium-in.wav', SH['s33'][0] + d, -10)
put(A + 'body/snore.wav', SUB['s34'], -10)
put(MG + 'drumline.wav', SH['s35'][0], -12, 1.3)
put(MG + 'swish.wav', SH['s37'][0] + 0.2, -6); put(MG + 'crowd_gasp.wav', SH['s37'][0] + 0.35, -8, 1.4); put(A + 'ui/scratch-004.wav', SH['s37'][0] + 0.3, -8)
put(MG + 'buzzer.wav', SH['s38'][0], -9, 1.2); put(MG + 'crowd_roar.wav', SH['s38'][0] + 0.1, -9, 2.2); put(MG + 'stadium_horn.wav', SH['s38'][0] + 0.2, -12, 1.5)
put(MG + 'sad_trombone.wav', SH['s39'][0] + 0.2, -10)
put(MG + 'camera_flashes.wav', SH['s40'][0] + 0.1, -10, 2.6); put(K + 'notifications/notification-attention-clear.wav', SH['s40'][0] + 0.9, -12)
put(K + 'tones/tone-ding-high.wav', SH['s41'][0] + 1.0, -10)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
