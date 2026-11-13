"""E16: am_thanh/nhac.wav (chiptune "Pixel Party", HoliznaCC0, CC0 — chưa dùng ở tập trước)
+ am_thanh/sfx.wav (khu arcade: khán giả trong nhà, tiếng máy game 8-bit, power-up, nút bấm, glitch, swish, đồng xu, nhạc "game over").
Giọng GỐC 86,6 s (không rút nghỉ, không atempo — quy ước từ E06; không có bíp). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 86.6
src = open('/root/work/engine/ep16_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('SUB=')[0])}
SUB = {k: float(v) for k, v in re.findall(r"(s\d+):([\d.]+)", src.split('SUB=')[1].split(';')[0])}
rng = np.random.default_rng(16)
def load(f):
    x = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(x, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])
def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'am_thanh/{name}.wav'], input=np.clip(x, -0.99, 0.99).astype(np.float32).tobytes())
def ma(x, k):
    c = np.cumsum(np.pad(np.asarray(x, np.float64), (k // 2, k - 1 - k // 2))); c = np.concatenate([[0.0], c]); return (c[k:] - c[:-k]) / k
N = int(DUR * SR); T = np.arange(N) / SR
voice = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'am_thanh/giong.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; LV = lufs(voice)
sm = int(0.08 * SR)
def span(a, b): return (T >= a) & (T < b)
# ---- nhạc: vào ngay khung 0; hạ khi đọc tỉ số thật (s3, s24, s32), khựng ở "35!" và "44!", tắt hẳn ở "game over" (nhạc game-over thay), vang lại khi "insert coin"
m = load('alvana-audio/music/chiptune/pixel-party.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = ma(np.abs(voice), int(0.25 * SR)); duck = 1 - 0.25 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N); gm[:int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
gm[span(SH['s3'][0], SH['s3'][1])] = 0.55
gm[span(SUB['s21'] - 0.1, SUB['s21'] + 0.9)] = 0.15
gm[span(SH['s24'][0], SH['s25'][0])] = 0.55
gm[span(SH['s30'][0] - 0.05, SH['s30'][0] + 0.9)] = 0.15
gm[span(SH['s32'][0], SH['s34'][0])] = 0.55
gm[span(SH['s37'][0], SH['s38'][0] + 0.3)] = 0.0
gm[span(SH['s38'][0] + 0.3, DUR)] = 0.6
gm[T > DUR - 1.0] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.0)))
gm = ma(gm, sm); m *= duck * gm
# ---- SFX
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, gain_db): x = load(fn); return (np.tile(x, N // len(x) + 1)[:N] * 10 ** (gain_db / 20)).astype(np.float32)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
def blip(t, db=-14): put(A + 'ui/beep-%02d.wav' % rng.integers(0, 16), t, db, 0.3)
sfx += bed(MG + 'crowd_ambience.wav', -24)
# HOOK khung 0: cú đập "39" + bass + glitch + khán giả ồ
put(K + 'cinematic-hits/cinematic-slam-big.wav', 0.0, -6); put(K + 'booms-and-bass/bass-808-medium.wav', 0.0, -8); put(A + 'glitch/short-1.wav', 0.05, -12); put(MG + 'crowd_ooh_aah.wav', 0.4, -16, 1.0)
put(K + 'risers-and-fallers/faller-1s-soft.wav', 0.6, -12)
put(MG + 'crowd_cheer.wav', SH['s2'][0] + 0.1, -16, 1.4); put(MG + 'sad_trombone.wav', SUB['s2'] + 0.1, -16, 1.2)
put(A + 'ui/classic-blip.wav', SH['s3'][0] + 0.05, -10)
# mã gian lận: gõ phím 8-bit + nút bấm + power-up
for i in range(10): blip(8.3 + i * 0.09, -18)
put(K + 'interface/click-button-firm.wav', 8.4, -6); put(A + 'game/power-up-3.wav', 8.45, -8); put(K + 'appear-and-vanish/appear-burst.wav', 8.45, -10)
put(K + 'risers-and-fallers/riser-1s-strong.wav', SH['s5'][0] - 0.2, -12); put(A + 'glitch/ui-002.wav', SH['s5'][0], -10); put(MG + 'crowd_roar.wav', SUB['s5'], -18, 1.8)
put(A + 'game/three-tone-1.wav', SH['s6'][0] + 0.1, -10)
put(A + 'game/power-up-7.wav', SH['s7'][0] + 0.1, -10); put(MG + 'crowd_cheer.wav', SH['s7'][0] + 0.3, -14, 1.6)
put(A + 'game/low-down.wav', SH['s8'][0] + 0.3, -10)
put(K + 'impacts/impact-light-soft.wav', SH['s9'][0] + 0.05, -10)
put(A + 'glitch/ui-001.wav', SH['s10'][0], -10); put(A + 'game/two-tone-1.wav', SH['s10'][0] + 0.2, -10)
put(A + 'ui/classic-node-1.wav', SH['s11'][0] + 0.1, -10); put(A + 'game/high-up.wav', SUB['s11'] + 0.6, -12)
put(A + 'ui/classic-node-2.wav', SH['s12'][0] + 0.1, -10); put(A + 'game/pep-sound-2.wav', SUB['s12'] + 0.1, -12)
put(K + 'interface/click-button-firm.wav', 28.12, -6); put(A + 'game/power-up-1.wav', 28.15, -8); put(MG + 'ref_whistle.wav', SH['s14'][0] + 0.02, -14, 0.5)
for ts, k in ((30.29, 1), (31.24, 2), (32.42, 3)):
    put(MG + 'swish.wav', ts, -6); put(A + 'game/pep-sound-%d.wav' % k, ts + 0.05, -10)
put(MG + 'crowd_roar.wav', 32.5, -15, 1.6)
put(A + 'game/three-tone-2.wav', SH['s17'][0] + 0.2, -12)
put(MG + 'swish.wav', SH['s18'][0] + 1.25, -6); put(A + 'game/power-up-5.wav', 35.7, -12); put(MG + 'crowd_cheer.wav', SH['s18'][0] + 1.3, -15, 1.3)
for i in range(3): put(K + 'impacts/impact-medium-soft.wav', SH['s19'][0] + 0.05 + i * 0.4, -10); put(MG + 'crowd_cheer.wav', SH['s19'][0] + 0.2, -14, 1.6)
put(MG + 'backboard_bang.wav', SH['s20'][0] + 1.32, -9); put(A + 'game/low-three-tone.wav', SH['s20'][0] + 1.5, -12)
for i in range(18): put(MG + 'ball_dribble.wav', SH['s21'][0] + 0.25 + i * 0.13 + rng.uniform(0, 0.05), -16 - rng.uniform(0, 5), 0.25)
put(A + 'glitch/stutter.wav', SUB['s21'], -10); put(MG + 'crowd_laugh.wav', SUB['s21'] + 0.2, -16, 1.0)
put(A + 'game/high-down.wav', 47.8, -10); put(K + 'digital/digital-power-down.wav', 47.85, -14)
put(A + 'game/low-random.wav', SH['s23'][0] + 0.2, -14)
put(A + 'ui/classic-blip.wav', SH['s24'][0] + 0.05, -10); put(A + 'game/power-up-11.wav', SUB['s24'], -9)
put(MG + 'crowd_cheer.wav', SH['s25'][0] + 0.8, -14, 1.6)
put(A + 'game/two-tone-2.wav', SH['s26'][0] + 0.05, -10)
put(MG + 'sneaker_squeak.wav', SH['s27'][0] + 0.2, -14, 0.5); put(MG + 'ball_dribble.wav', SH['s27'][0] + 0.3, -14, 1.2); put(MG + 'rim_dunk.wav', SUB['s27'] + 0.75, -8); put(MG + 'crowd_roar.wav', SUB['s27'] + 0.8, -14, 1.6)
put(K + 'digital/digital-corrupt.wav', 62.3, -10); put(A + 'explosion/bang-03.wav', 62.76, -14); put(A + 'glitch/classic-glitch.wav', 62.8, -12)
put(MG + 'crowd_roar.wav', SH['s29'][0] + 0.3, -14, 1.8)
put(MG + 'crowd_gasp.wav', SH['s30'][0] + 0.1, -14, 1.0); put(A + 'game/low-down.wav', SUB['s30'] + 0.2, -12)
put(K + 'digital/digital-denied.wav', SH['s31'][0] + 0.2, -10)
put(MG + 'buzzer.wav', SH['s32'][0] + 0.05, -12, 1.0); put(MG + 'crowd_cheer.wav', SUB['s32'] + 0.1, -14, 1.6)
for i in range(10): blip(75.32 + i * 0.1, -16)
put(A + 'game/three-tone-1.wav', 76.34, -9)
put(K + 'cinematic-hits/cinematic-drum-big.wav', SH['s34'][0] + 0.12, -8); put(MG + 'crowd_gasp.wav', SH['s34'][0] + 0.2, -15, 0.9)
for i in range(20): put(K + 'interface/click-button-medium.wav', SH['s35'][0] + 0.1 + i * 0.15, -14)
put(MG + 'crowd_cheer.wav', SH['s36'][0] + 0.1, -13, 1.6)
put('alvana-audio/music/dark/game-over-1.mp3', SH['s37'][0] + 0.05, -10, 1.9); put(K + 'digital/digital-power-down.wav', SH['s37'][0], -12)
put(A + 'money/coin-drop.wav', SH['s38'][0] + 0.2, -8); put(K + 'money/money-coin-spin.wav', SH['s38'][0] + 0.4, -10)
for i in range(3): blip(SH['s38'][0] + 0.6 + i * 0.62, -14)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
