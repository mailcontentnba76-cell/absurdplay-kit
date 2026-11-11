"""E12: am_thanh/nhac.wav (upbeat "Back in the 80s", alvana-audio, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (nhà thi đấu playoffs: khán giả, em bé cười/khóc, còi, bóng, bảng rổ, swish, kèn buồn).
Giọng GỐC 76,83 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 76.83
src = open('/root/work/engine/ep12_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+[ab]?):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(12)
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
def ma(x, k):  # trung bình trượt nhanh (tổng tích luỹ)
    c = np.cumsum(np.pad(np.asarray(x, np.float64), (k // 2, k - 1 - k // 2))); c = np.concatenate([[0.0], c]); return (c[k:] - c[:-k]) / k
N = int(DUR * SR); T = np.arange(N) / SR
voice = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'am_thanh/giong.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; LV = lufs(voice)
sm = int(0.08 * SR)
def span(a, b): return (T >= a) & (T < b)
# ---- nhạc: vào ngay khung 0; khựng ở "Except it's the playoffs" (s8), hạ trong phòng phân tích (s9–s10), hạ ở 8 giây cuối (s27–s29), vang lại khi bé thắng
m = load('alvana-audio/music/upbeat/back-in-the-80s.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SH['s8'][0], SH['s8'][0] + 1.2)] = 0.08
gm[span(SH['s9'][0], SH['s11'][0])] = 0.5
gm[span(SH['s27'][0], SH['s30'][0])] = 0.45
gm[span(SH['s37'][0], SH['s37'][1])] = 0.5
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = ma(gm, sm); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db, g=1.0):
    x = load(fn); x = np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20); return (x * g).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
def coo(t, db=-16): put(A + 'creature/cute-0%d.wav' % rng.integers(1, 10), t, db, 0.7)
ARENA = np.ones(N); ARENA[span(SH['s9'][0], SH['s11'][0])] = 0; ARENA[span(SH['s25'][0], SH['s25'][1])] = 0; ARENA[span(SH['s38'][0], DUR + 1)] = 0; ARENA = ma(ARENA, sm)
sfx += bed(MG + 'crowd_ambience.wav', -20, ARENA) + bed(A + 'ambience/room-tone.wav', -26, 1 - ARENA)
# HOOK khung 0: tiếng trống + 50 em bé bi bô
put(K + 'cinematic-hits/cinematic-drum-big.wav', 0.0, -8); [coo(0.1 + i * 0.18, -14) for i in range(6)]
put(MG + 'crowd_gasp.wav', 0.3, -14, 1.0)
put(K + 'whooshes/whoosh-medium-medium.wav', SUB['s2'], -12)
put(MG + 'ball_dribble.wav', SH['s3'][0], -12, 1.6)
for t0 in (SH['s4'][0], SUB['s4a'], SUB['s4b']): put(K + 'swishes-and-zips/zip-in-medium.wav', t0, -12)
coo(SH['s5'][0] + 0.6); coo(SH['s5'][0] + 1.5)
put(A + 'body/breath.wav', SH['s6'][0] + 0.3, -18); put(K + 'impacts/impact-light-soft.wav', SH['s6'][0] + 1.4, -12); coo(SH['s6'][0] + 1.5, -14)
put(MG + 'crowd_laugh.wav', SH['s7'][0] + 0.4, -16, 1.6)
put(K + 'cinematic-hits/cinematic-slam-big.wav', SH['s8'][0], -7); put(K + 'cinematic-hits/cinematic-thunder-big.wav', SH['s8'][0] + 0.05, -14)
put(K + 'tones/tone-ding-high.wav', SH['s9'][0] + 1.5, -14)
put(MG + 'sad_trombone.wav', SH['s10'][0] + 0.8, -14, 1.6)
put(K + 'celebration/celebration-popper.wav', SH['s11'][0] + 1.0, -14); coo(SH['s11'][0] + 1.2, -13); coo(SH['s11'][0] + 1.6, -13)
put(MG + 'ref_whistle.wav', SH['s12'][0] + 0.05, -10, 0.7)
coo(SH['s13'][0] + 0.6, -12)
put(K + 'impacts/impact-medium-soft.wav', SH['s14'][0] + 0.4, -9); put(MG + 'crowd_gasp.wav', SH['s14'][0] + 0.45, -14, 1.2)
put(A + 'creature/cute-05.wav', SH['s15'][0] + 0.3, -12)
put(MG + 'ball_dribble.wav', SH['s16'][0], -11, 1.3); put(MG + 'sneaker_squeak.wav', SH['s16'][0] + 1.0, -13)
[coo(SH['s17'][0] + 0.3 + i * 0.4, -16) for i in range(3)]
put(MG + 'crowd_boo.wav', SH['s19'][0] + 0.3, -16, 1.4)
put(MG + 'ball_dribble.wav', SH['s20'][0] + 0.2, -14, 0.8)
put(A + 'creature/hurt-02.wav', SH['s21'][0] + 0.2, -14, 1.4); put(A + 'creature/hurt-03.wav', SH['s21'][0] + 0.9, -15, 1.0)
put(MG + 'crowd_ooh_aah.wav', SH['s22'][0] + 0.4, -18, 1.4)
put(MG + 'buzzer.wav', SH['s23'][0] + 0.05, -10, 1.0); put(MG + 'ref_whistle.wav', SH['s23'][0] + 0.3, -12, 0.6)
put(MG + 'buzzer.wav', SH['s24'][0] + 0.1, -12, 1.0)
put(MG + 'drumline.wav', SH['s26'][0], -14, 1.4)
put(A + 'body/heartbeat-fast.wav', SH['s27'][0], -14, 3.2)
put(MG + 'ball_dribble.wav', SH['s28'][0], -11, 1.9); put(MG + 'sneaker_squeak.wav', SH['s28'][0] + 1.2, -12)
put(A + 'water/slime-05.wav', SH['s29'][0] + 0.55, -10); put(K + 'impacts/impact-heavy-soft.wav', SH['s29'][0] + 0.9, -9); put(MG + 'crowd_gasp.wav', SH['s29'][0] + 0.7, -12, 1.2)
put(MG + 'ball_dribble.wav', SH['s30'][0] + 0.2, -15, 1.4)
coo(SH['s31'][0] + 0.2, -14); coo(SH['s31'][0] + 0.6, -14)
put(K + 'whooshes/whoosh-slow-soft.wav', SH['s32'][0] + 0.7, -12)
put(MG + 'backboard_bang.wav', SH['s33'][0] + 0.3, -8)
put(MG + 'swish.wav', SH['s34'][0] + 0.15, -6); put(MG + 'crowd_gasp.wav', SH['s34'][0] + 0.2, -10, 1.5)
put(MG + 'buzzer.wav', SH['s35'][0], -8, 1.4); put(K + 'celebration/celebration-confetti.wav', SUB['s35'], -12); [coo(SUB['s35'] + 0.1 + i * 0.25, -12) for i in range(5)]
[coo(SH['s36'][0] + 0.2 + i * 0.3, -16) for i in range(4)]
put(MG + 'sad_trombone.wav', SH['s37'][0] + 0.2, -12, 1.6)
put(MG + 'camera_flashes.wav', SH['s38'][0] + 0.1, -12, 3.4)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
