"""E07: am_thanh/nhac.wav (funk "Make Funk", alvana-audio, CC0 — chưa dùng ở tập trước) + am_thanh/sfx.wav (sảnh sân bay, băng chuyền, loa "ding-dong", tiếng động theo mốc).
Giọng GỐC giữ nguyên độ dài (80,12 s, không rút nghỉ). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 80.12
src = open('/root/work/engine/ep07_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('END')[0])}
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
# ---- nhạc funk: khựng ở "Except" (s3), ở FINAL CALL (s31) và lúc "win by forfeit" (s37)
m = load('alvana-audio/music/funk/make-funk.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.1 * SR)] = np.linspace(0, 1, int(0.1 * SR))
for key, d, g in [('s3', 0.8, 0.1), ('s30', 1.2, 0.15), ('s37', 0.6, 0.2)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
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
HALL = mask([('s1', 's7'), ('s14', 's25'), ('s27', 's37'), ('s40', 's40')])
sfx += bed(A + 'ambience/room-tone.wav', -18, HALL) + bed(MG + 'crowd_ambience.wav', -22, HALL) + bed(A + 'ambience/machine-01.wav', -26, mask([('s1', 's3'), ('s20', 's25')]) * 1.0 + HALL * 0.3)
sfx += bed(A + 'ambience/construction-site.wav', -12, mask([('s8', 's9'), ('s41', 's41')])) + bed(A + 'ambience/highway.wav', -16, mask([('s10', 's10'), ('s12', 's12')])) + bed(A + 'ambience/room-tone.wav', -14, mask([('s11', 's11'), ('s13', 's13'), ('s38', 's39')]))
for i in range(11): put(K + 'pops/pop-medium-in.wav', SH['s2'][0] + 0.15 + i * 0.12, -12)
put(A + 'ui/scratch-004.wav', SH['s3'][0], -5); put(A + 'impact/cinematic-heavy.wav', SH['s3'][0] + 0.05, -8)
for k_ in ['s5', 's6', 's7', 's12']: put(A + 'transition/whoosh-hit-2.wav', SH[k_][0] + 0.1, -12); put(A + 'pop/classic-pop.wav', SH[k_][0] + 0.25, -10)
put(K + 'tones/tone-ding-high.wav', SH['s13'][0] + 0.15, -6); put(K + 'tones/tone-ding-low.wav', SH['s13'][0] + 0.5, -6)
put(MG + 'ref_whistle.wav', SH['s14'][0] + 0.1, -12, 0.8)
put(A + 'whoosh/' + 'whoosh-1.wav' if False else K + 'whooshes/' + __import__('os').listdir(LIB + K + 'whooshes')[0], SH['s16'][0] + 0.9, -8)
put(MG + 'crowd_gasp.wav', SH['s18'][0] + 0.3, -10, 1.5)
put(MG + 'crowd_cheer.wav', SH['s19'][0], -6, 2.5); put(MG + 'stadium_horn.wav', SH['s19'][0] + 0.1, -12, 1.5)
for k_ in ['s23', 's24', 's25']: put(K + 'pops/pop-large-in.wav', SH[k_][0] + 0.05, -10)
put(MG + 'crowd_laugh.wav', SH['s26'][0] + 3.0, -14, 1.5)
put(K + 'impacts/impact-heavy-soft.wav', SH['s28'][0] + 0.6, -10)
put(A + 'glitch/classic-glitch.wav', SH['s30'][0] + 0.1, -10); put(K + 'tones/tone-ding-high.wav', SH['s30'][0] + 0.6, -5); put(K + 'tones/tone-ding-low.wav', SH['s30'][0] + 0.95, -5)
put(K + 'notifications/notification-attention-clear.wav', SH['s31'][0] + 0.1, -10)
put(MG + 'crowd_ooh_aah.wav', SH['s32'][0] + 0.3, -14, 2.0)
put(A + 'transition/whoosh-hit-2.wav', SH['s35'][0], -10)
put(MG + 'buzzer.wav', SH['s36'][0] + 0.2, -12, 1.2)
put(MG + 'sad_trombone.wav', SH['s37'][0] + 0.2, -10); put(K + 'celebration/celebration-popper.wav', SH['s37'][0] + 0.9, -10)
put(K + 'tones/tone-ding-high.wav', SH['s38'][0] + 0.2, -10)
put(K + 'shimmers/shimmer-short-bright.wav', SH['s41'][0] + 1.6, -10)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
