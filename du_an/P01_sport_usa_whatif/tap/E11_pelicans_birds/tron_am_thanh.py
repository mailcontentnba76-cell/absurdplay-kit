"""E11: am_thanh/nhac.wav (funk "Breath", alvana-audio, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (đầm lầy: dế đêm + nước vỗ, khán giả, tiếng chim kêu/vỗ cánh, túi họng "nuốt" bóng, swish, bảng điểm, ăn mừng).
Giọng GỐC 67,87 s (không rút nghỉ); bíp hook nằm sẵn trong am_thanh/giong_bip.wav. Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 67.87
src = open('/root/work/engine/ep11_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+[ab]?):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(11)
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
# ---- nhạc funk: vào ngay khung 0; hạ khi đọc số liệu thứ Hai (s4–s7), tắt 0,6 s ở "It doesn't come out" (s15), vang lại khi dẫn 1 điểm (s23–s24), hạ ở "Same as Monday"
m = load('alvana-audio/music/funk/breath.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 10 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SH['s4'][0], SH['s8'][0])] = 0.6
gm[span(SH['s15'][0] + 0.3, SH['s15'][0] + 0.9)] = 0.1
gm[span(SH['s26'][0], SH['s26'][1])] = 0.35
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
def flap(t, n=4, db=-14):  # vỗ cánh: tiếng vải phần phật + gió
    for i in range(n): put(A + 'foley/cloth-%d.wav' % rng.integers(1, 5), t + i * 0.16, db, 0.25)
    put(K + 'whooshes/whoosh-medium-soft.wav', t, db - 2)
def squawk(t, db=-14): put(A + 'creature/misc-0%d.wav' % rng.integers(1, 10), t, db, 0.6)
# nền đầm lầy: dế đêm + nước vỗ + khán giả rì rầm
sfx += bed(A + 'ambience/night-crickets.wav', -24) + bed(A + 'ambience/water-02.wav', -28) + bed(MG + 'crowd_ambience.wav', -24)
# HOOK khung 0: chim sà qua đầu Murray, ngậm bóng
put(K + 'whooshes/whoosh-fast-hard.wav', 0.0, -7); flap(0.05, 5, -11); squawk(0.4, -10)
put(MG + 'crowd_gasp.wav', 0.2, -16, 1.0)
put(K + 'impacts/impact-medium-firm.wav', SH['s2'][0], -12); squawk(SH['s3'][0] + 0.1, -12)
put(MG + 'buzzer.wav', SH['s4'][0], -12, 0.8)
put(MG + 'sad_trombone.wav', SH['s5'][0] + 1.6, -16, 1.2)
for t0 in (SH['s6'][0] + 1.4, SUB['s6'] + 1.4): put(MG + 'backboard_bang.wav', t0, -12, 0.6)
put(K + 'tones/tone-ding-high.wav', SH['s7'][0] + 1.4, -14)
put(MG + 'crowd_laugh.wav', SH['s8'][0] + 2.4, -20, 1.2)
# toàn cảnh đầm lầy: nước + chim kêu xa
put(A + 'water/splash-03.wav', SH['s9'][0] + 0.4, -20); squawk(SUB['s9'] + 0.6, -18)
put(MG + 'ref_whistle.wav', SH['s10'][0] + 0.05, -10, 0.7)
flap(SH['s11'][0] + 0.0, 6, -12); put(K + 'pops/pop-medium-in.wav', SH['s11'][0] + 0.75, -10); put(MG + 'crowd_ooh_aah.wav', SH['s11'][0] + 0.9, -16, 1.4)
put(MG + 'ball_dribble.wav', SH['s12'][0], -12, 1.1); put(MG + 'sneaker_squeak.wav', SH['s12'][0] + 0.6, -14)
put(A + 'water/slime-03.wav', SH['s13'][0] + 0.5, -14)
put(A + 'body/eat-02.wav', SH['s14'][0] + 0.6, -10); put(A + 'water/bubble-02.wav', SH['s14'][0] + 0.7, -14)
put(A + 'creature/cute-03.wav', SH['s15'][0] + 0.5, -14); put(MG + 'crowd_laugh.wav', SH['s15'][0] + 0.6, -18, 1.0)
put(MG + 'sneaker_squeak.wav', SH['s16'][0] + 0.2, -14)
put(K + 'whooshes/whoosh-slow-soft.wav', SH['s17'][0], -12); put(MG + 'airball_chant.wav', SH['s17'][0] + 0.2, -16, 1.6)
flap(SH['s18'][0], 8, -12); squawk(SH['s18'][0] + 0.4, -12); put(MG + 'swish.wav', SH['s18'][0] + 3.0, -7); put(MG + 'crowd_ooh_aah.wav', SH['s18'][0] + 3.1, -16, 1.2)
put(MG + 'ball_dribble.wav', SH['s19'][0], -12, 1.0)
flap(SH['s20'][0] + 0.1, 4, -12); flap(SH['s20'][0] + 0.45, 4, -13); put(K + 'impacts/impact-light-soft.wav', SH['s20'][0] + 1.1, -12); put(K + 'impacts/impact-light-soft.wav', SH['s20'][0] + 1.45, -12)
put(A + 'body/eat-03.wav', SH['s21'][0] + 0.3, -12)
put(MG + 'swish.wav', SH['s22'][0] + 1.2, -7)
put(K + 'celebration/celebration-popper.wav', SH['s23'][0] + 0.1, -12)
put(MG + 'crowd_roar.wav', SH['s24'][0], -12, 2.2); put(K + 'celebration/celebration-confetti.wav', SH['s24'][0] + 0.2, -14)
put(MG + 'buzzer.wav', SH['s25'][0] + 0.1, -12, 1.0)
put(MG + 'sad_trombone.wav', SH['s26'][0] + 0.1, -12, 1.0)
put(K + 'whooshes/whoosh-fast-medium.wav', SH['s27'][0], -12)
put(MG + 'sneaker_squeak.wav', SH['s28'][0] + 0.4, -14); put(MG + 'sneaker_squeak.wav', SH['s28'][0] + 1.1, -15)
for i in range(4): flap(SH['s29'][0] + i * 0.22, 4, -13)
put(MG + 'buzzer.wav', SH['s30'][0], -9, 1.2); put(MG + 'crowd_roar.wav', SUB['s30'], -13, 1.6); [squawk(SUB['s30'] + 0.2 + i * 0.35, -14) for i in range(4)]
put(MG + 'crowd_silence_cough.wav', SH['s31'][0] + 0.2, -16, 1.4)
squawk(SH['s32'][0] + 0.4, -12); put(K + 'tones/tone-ding-high.wav', SH['s32'][0] + 1.0, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
