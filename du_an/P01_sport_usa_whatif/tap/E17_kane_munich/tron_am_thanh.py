"""E17: am_thanh/giong.wav (giọng gốc ×1,05, bíp 1 kHz đè "fucking" = W[1]) + am_thanh/nhac.wav ("Love Love Love", alvana-audio upbeat, CC0 — chưa dùng)
+ am_thanh/sfx.wav (sân bóng châu Âu: nền khán giả ngoài trời + vỗ tay nhịp kiểu khán đài, còi, sút bóng, lưới, "DOINK" cột dọc, cờ phạt, chó sủa vui...). Dùng: python3 tron_am_thanh.py (trong thư mục tập)."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 69.40
src = open('/root/work/engine/ep17_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"(s\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
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
W = json.load(open('giong/words_raw.json')); assert W[1]['w'].lower().startswith('fuck'); a, b = W[1]['s'] - 0.02, W[1]['e'] + 0.02
i0, i1 = int(a * SR), int(b * SR); rms = np.sqrt(np.mean(voice[i0:i1] ** 2)) + 1e-6
beep = np.sin(2 * np.pi * 1000 * T[i0:i1]) * rms * 1.3; f = int(0.008 * SR); beep[:f] *= np.linspace(0, 1, f); beep[-f:] *= np.linspace(1, 0, f)
voice[i0:i1] = beep; save('giong', voice); LV = lufs(voice); print('beep', a, b, W[1])
sm = int(0.08 * SR)
m = load('alvana-audio/music/upbeat/love-love-love.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 9 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
for key, d, g in [('s8b', 1.6, 0.45), ('s10', 1.2, 0.35), ('s10b', 3.5, 0.6), ('s11b', 2.4, 0.55), ('s14b', 1.0, 0.25), ('s15', 1.3, 0.45)]: gm[(T >= SH[key][0]) & (T < SH[key][0] + d)] = g
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'; K = 'sfx-kit/sounds/'
KICK = lambda t, db=-10: put(MG + 'football_kick.wav', t, db)
WH = lambda t, db=-14: put(K + 'swishes-and-zips/swish-medium.wav', t, db)
# nền: sân ngoài trời (trong sân), bãi xe = gió + đường xa
in_stad = [(0, SH['s2'][0]), (SH['s2b'][0], SH['s8b'][0]), (SH['s9'][0], DUR)]
for t0, t1 in in_stad: bed(MG + 'stadium_crowd_outdoor.wav', t0, t1, -24)
bed(A + 'ambience/wind.wav', SH['s2'][0], SH['s2b'][0], -22); bed(A + 'ambience/highway.wav', SH['s2'][0], SH['s2b'][0], -30)
bed(A + 'ambience/wind.wav', SH['s8b'][0], SH['s9'][0], -22)
bed(MG + 'crowd_clap_rhythm.wav', 0.0, SH['s2'][0], -24)
# hook: chạy vào sân + trượt gối, khán đài gầm
put(MG + 'crowd_roar.wav', 0.1, -18, 1.7); put(K + 'swishes-and-zips/zip-in-hard.wav', 1.0, -14)  # trượt gối
put(A + 'whoosh/air-02.wav', SH['s1'][1] - 0.18, -10)  # cú lia whip sang shot 2
put(A + 'impact/classic-thud.wav', SH['s1b'][0] + 0.6, -22)
put(A + 'whoosh/air-02.wav', SH['s2'][0], -16)
put(MG + 'crowd_cheer.wav', SH['s2b'][0] + 0.2, -22, 1.5)
put(K + 'pops/' + 'pop-soft.wav' if False else MG + 'swish.wav', 9.9, -20)
KICK(SH['s3b'][0] + 0.25, -10); put(MG + 'swish.wav', SH['s3b'][0] + 0.45, -14); put(MG + 'crowd_cheer.wav', SH['s3b'][0] + 0.5, -18, 0.9)
put(MG + 'crowd_laugh.wav', 16.6, -26, 1.0)
put(MG + 'crowd_ooh_aah.wav', 20.6, -22, 1.0)
STAMP = lambda t, db=-10: put(A + 'impact/classic-stamp.wav', t, db)
STAMP(22.38); put(MG + 'ref_whistle.wav', SH['s6b'][0] + 0.9, -20, 0.6)
KICK(SH['s7'][0] + 0.5, -10); put(MG + 'swish.wav', SH['s7'][0] + 0.85, -12); put(MG + 'crowd_roar.wav', SH['s7'][0] + 0.9, -16, 1.3)
put(MG + 'ref_whistle.wav', SH['s7b'][0] + 0.3, -14, 0.8); WH(SH['s7b'][0] + 0.38)
put(A + 'whoosh/air-01.wav', SH['s8'][0], -18); put(MG + 'crowd_laugh.wav', 32.0, -22, 1.2)
put(MG + 'sad_trombone.wav', 33.5, -18, 1.0)
WH(SH['s9'][0] + 0.1, -18); put(MG + 'crowd_ooh_aah.wav', 37.5, -24, 0.8)
KICK(SH['s9c'][0] + 0.4, -10); put(A + 'impact/bell-heavy-002.wav', SH['s9c'][0] + 1.55, -10); put(MG + 'crowd_gasp.wav', SH['s9c'][0] + 1.6, -18, 1.0)
put(K + 'cinematic-hits/cinematic-drum-big.wav', SH['s10'][0], -16)
put(K + 'time/time-clock.wav', SH['s10b'][0], -16, 3.4); put(MG + 'crowd_roar.wav', SH['s10b'][0] + 0.5, -28, 3.0)
for i in range(6): put(A + 'impact/generic-light-00%d.wav' % (i % 5), SH['s11'][0] + 0.05 + i / 2.1, -20)
put(MG + 'crowd_silence_cough.wav', SH['s11b'][0] + 0.2, -22, 2.0)
put(MG + 'crowd_gasp.wav', SH['s12'][0] + 0.5, -24, 0.8)
put(MG + 'stadium_horn.wav', SH['s13'][0], -18, 1.0); put(MG + 'crowd_cheer.wav', SH['s13'][0] + 1.0, -20, 1.5)
put(K + 'risers-and-fallers/' + 'riser-short.wav' if False else A + 'whoosh/cinematic.wav', SH['s13b'][0] - 0.2, -18)
KICK(SH['s13b'][0] + 0.5, -8); put(MG + 'crowd_roar.wav', 57.0, -12, 2.3); put(K + 'celebration/celebration-applause-big.wav', 57.3, -20, 2.0)
put(K + 'swishes-and-zips/zip-out-hard.wav', SH['s14'][0] + 0.45, -14)
put(MG + 'ref_whistle.wav', SH['s14b'][0], -10, 0.8); WH(SH['s14b'][0] + 0.05, -14); put(A + 'impact/classic-thud.wav', SH['s14b'][0] + 0.45, -16)
put(MG + 'crowd_boo.wav', SH['s14b'][0] + 0.4, -22, 1.6); put(MG + 'crowd_gasp.wav', 61.35, -18, 0.8)
put(MG + 'sad_trombone.wav', SH['s15b'][0] + 0.4, -20, 1.6)
put(MG + 'crowd_laugh.wav', 67.4, -18, 1.8); STAMP(67.1, -8)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
