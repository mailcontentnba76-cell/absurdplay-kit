"""E26 Mascot NBA Lakers (vịt hồ) vs Knicks (Father Knickerbocker): giọng gốc Magnific (không atempo) + nhạc alvana upbeat/happy-dance (chưa dùng) + SFX:
lông vũ biến hình, tiếng vịt thật (Magnific Sound FX), vỗ cánh, gậy gõ sàn, giấy bốc thăm, cúp, còi, úp rổ ×3, bút dạ, túi bánh, buzzer giữa trận, còi chạy bước ×3."""
import subprocess, re, numpy as np, os
SR = 48000; LIB = '/home/claude/audio/'; MG = '/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/tai_nguyen/am_thanh/magnific_sfx/'; DUR = 85.89
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine/ep26_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+):\[([\d.,]+)\]", src.split('END')[0])}
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
save('giong', voice); LV = lufs(voice)
sm = int(0.08 * SR)
m = load('alvana-audio/music/upbeat/happy-dance.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for a_, b_ in [(SH['s5'][0], SH['s5'][1] + 0.1)]:  # "Nothing." — nhạc lặng
    w = (T > a_) & (T < b_); gm[w] = 0.08
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def add(x, t, db=0.0):
    x = x * 10 ** (db / 20); i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def put(fn, t, db=0.0, n=None):
    x = load(fn)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    add(x, t, db)
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
# --- tiếng vịt THẬT (Magnific Sound FX, ElevenLabs v2): 11 tiếng quack tách từ duck_quack_x3.wav; vỗ cánh duck_wings_takeoff.wav; cả đàn duck_flock_1/2.wav
QS = [(0.06, 0.23), (0.4, 0.58), (0.78, 0.97), (1.19, 1.37), (1.61, 1.81), (1.99, 2.19), (2.41, 2.62), (2.91, 3.12), (3.37, 3.58), (3.82, 4.05), (4.27, 4.5)]
QX = load(MG + 'duck_quack_x3.wav'); WX = load(MG + 'duck_wings_takeoff.wav')[int(0.6 * SR):int(2.3 * SR)]
_qi = [0]
def pitch(x, f):  # đổi cao độ nhẹ bằng nội suy (f > 1 cao hơn, ngắn hơn)
    n = int(len(x) / f); return np.interp(np.arange(n) * f, np.arange(len(x)), x).astype(np.float32)
def QK(t, db=-8, f0=520):
    a_, b_ = QS[_qi[0] % len(QS)]; _qi[0] += 3; x = QX[int((a_ - 0.02) * SR):int((b_ + 0.05) * SR)].copy(); f_ = int(0.02 * SR); x[-f_:] *= np.linspace(1, 0, f_)
    add(pitch(x, f0 / 520), t, db + 2)
def flap(t0, t1, hz=8, db=-16):
    n = int((t1 - t0) * SR); x = np.tile(WX, n // len(WX) + 1)[:n].copy(); f_ = min(n // 3, int(0.1 * SR)); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    add(pitch(x, hz / 8) if abs(hz - 8) > 0.5 else x, t0, db + 4)
def flock(t, n_s, db=-12, k=1): x = load(MG + 'duck_flock_%d.wav' % k)[:int(n_s * SR)].copy(); f_ = int(0.15 * SR); x[-f_:] *= np.linspace(1, 0, f_); add(x, t, db)
def tap(t, db=-14): put(A + 'foley/items-01.wav', t, db, 0.15)
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'crowd_ambience.wav', 0, DUR, -24)
for kk in ['s1', 's2', 's4', 's6', 's10', 's12', 's14', 's16', 's18', 's20', 's24', 's28', 's32', 's34', 's38', 's40']: WH(SH[kk][1] - 0.14, -17)
# s1 biến hình: bụp + lông vũ + vỗ cánh + úp rổ + quack
put(A + 'pop/classic-pop.wav', 0.72, -10); put(A + 'impact/classic-thud.wav', 0.78, -14); flap(0.8, 2.2, 9, -14)
put(MG + 'rim_dunk.wav', 1.5, -8, 0.8); QK(2.75, -6, 560); put(MG + 'crowd_ooh_aah.wav', 1.8, -20, 1.4)
# s2–s5: sân trống, "Nothing." — dế kêu + ho khan
put(MG + 'crowd_silence_cough.wav', SH['s5'][0] - 0.2, -14, 1.2)
# s6: 2 cột khói
put(A + 'pop/pop-1.wav', SH['s6'][0] + 0.15, -10); put(A + 'pop/pop-3.wav', SH['s6'][0] + 0.3, -10); QK(SH['s6'][0] + 1.05, -10)
put(A + 'impact/classic-stamp.wav', SH['s6'][0] + 0.4, -16)
# s7–s10 màn hình: nốt nhấn
for kk in ['s7', 's8', 's9']: put(A + 'game/two-tone-1.wav', SH[kk][0] + 0.1, -18)
put(A + 'impact/classic-stamp.wav', SH['s10'][0] + 0.05, -10)
# s11–s12 vịt ra sân
QK(SH['s11'][0] + 1.15, -6, 500); for_ = [put(A + 'footsteps/rpg-0%d.wav' % (j % 10), SH['s12'][0] - 0.2 + j * 0.17, -20, 0.2) for j in range(8)]
flock(SH['s12'][0] + 0.1, 1.2, -14, 1); put(MG + 'crowd_cheer.wav', SH['s12'][0] + 0.2, -22, 1.2)
# s13 giấy bốc thăm
put(A + 'paper/paper-02.wav', SH['s13'][0] + 1.1, -10); put(A + 'paper/slide.wav', SH['s13'][0] + 2.5, -12)
# s14 ông già chống gậy đi ra
for j in range(9): tap(SH['s14'][0] + 0.2 + j * 0.5, -16)
put(MG + 'crowd_clap_rhythm.wav', SH['s14'][0] + 0.5, -24, 3.5)
put(A + 'impact/classic-stamp.wav', SH['s15'][0] + 0.2, -16)
# s16–s17 danh hiệu
put(MG + 'crowd_cheer.wav', SH['s16'][0] + 0.3, -20, 1.6); QK(SH['s16'][0] + 1.0, -12)
put(MG + 'crowd_roar.wav', SH['s17'][0] + 0.3, -18, 1.6); put(A + 'magic/shimmer-pad.wav', SH['s17'][0] + 0.2, -18, 1.6)
# s18 vịt nhìn máy (im) → chớp mắt
put(A + 'pop/pop-2.wav', SH['s18'][0] + 1.22, -18)
# s19–s20 tranh bóng
put(MG + 'ref_whistle.wav', SH['s19'][0] + 0.05, -16, 0.6); flap(SH['s20'][0] + 0.1, SH['s20'][0] + 1.5, 9, -12); QK(SH['s20'][0] + 0.7, -8, 540); put(MG + 'crowd_ooh_aah.wav', SH['s20'][0] + 0.9, -20, 1.2)
# s21–s23 Dunk ×3
for kk in ['s21', 's22', 's23']: flap(SH[kk][0], SH[kk][1] - 0.15, 10, -14); put(MG + 'rim_dunk.wav', SH[kk][1] - 0.18, -6, 0.6)
put(MG + 'crowd_roar.wav', SH['s24'][0], -16, 1.4); QK(SH['s24'][0] + 0.5, -10, 600)
# s25–s26 hội ý: còi hết giờ + bút dạ
put(MG + 'buzzer.wav', SH['s25'][0] + 0.05, -16, 0.6)
for i in range(4): put(K + 'writing-and-drawing/writing-pen-write.wav', SH['s25'][0] + 1.0 + i * 0.55, -12, 0.5)
# s27–s28 bánh mì: túi giấy, vụn rơi, cả đàn vịt
put(A + 'paper/paper-03.wav', SH['s27'][0] + 1.1, -10); put(A + 'foley/cloth-2.wav', SH['s27'][0] + 1.3, -14)
flock(SH['s28'][0] - 0.1, DUR and (SH['s28'][1] - SH['s28'][0] + 0.4), -10, 2)
# s29 Knicks đi bộ lên rổ
for j in range(5): tap(SH['s29'][0] + j * 0.45, -14)
put(MG + 'swish.wav', SH['s29'][1] - 0.6, -10, 0.6); put(MG + 'crowd_cheer.wav', SH['s29'][1] - 0.4, -18, 1.2)
# s30 halftime buzzer, s31 vịt bay đi
put(MG + 'buzzer.wav', SH['s30'][0] + 0.05, -12, 1.0); flap(SH['s31'][0] + 0.2, SH['s31'][1], 8, -14); QK(SH['s31'][0] + 0.4, -12, 640)
put(MG + 'sad_trombone.wav', SH['s32'][0] + 0.3, -22, 1.6)
# s33–s37 chạy bước
put(MG + 'ball_dribble.wav', SH['s33'][0] + 0.1, -16, 0.5)
for j in range(10): put(A + 'footsteps/rpg-0%d.wav' % (j % 10), SH['s34'][0] + j * 0.2, -18, 0.18)
for kk in ['s35', 's36', 's37']: put(MG + 'ref_whistle.wav', SH[kk][0] + 0.02, -12, 0.35)
put(MG + 'crowd_laugh.wav', SH['s37'][1] - 0.2, -18, 1.4)
# s39–s40 ông già thở dốc
put(MG + 'crowd_silence_cough.wav', SH['s39'][0] + 0.2, -18, 2.0)
# s41 cú bay cuối chậm
put(A + 'riser/tension-4s.wav', SH['s41'][0] + 0.1, -14); flap(SH['s41'][0], SH['s41'][0] + 1.6, 9, -12); put(A + 'whoosh/soft-long.wav', SH['s41'][0] + 1.6, -14)
put(A + 'impact/classic-stamp.wav', SH['s42'][0] + 0.05, -14); put(MG + 'crowd_ooh_aah.wav', SH['s42'][0] + 0.4, -22, 2.0); QK(SH['s42'][0] + 1.6, -12)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
