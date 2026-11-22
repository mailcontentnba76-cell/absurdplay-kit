"""E27 Buckeyes vs Cornhuskers: giọng ×1,05 + nhạc ElevenLabs Music "Cornfield Kickoff" (country–rock hoedown, tạo riêng 22/11) + banjo stinger + SFX: bóc vỏ, nứt hạt dẻ, đá bóng, đám đông, máy gặt, cột gôn đổ, sói hú."""
import subprocess, re, json, numpy as np
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 74.40
src = open('/root/work/engine/ep27_buckeyes_cornhuskers_shots.js').read()
SH = {k: [float(x) for x in v.split(',')] for k, v in re.findall(r"([hs]\d+[a-z]?):\[([\d.,]+)\]", src.split('END')[0])}
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
m = load('/root/work/assets/audio/e27/cornfield_kickoff.mp3'); m = np.tile(m, N // len(m) + 1)[:N]
m *= 10 ** ((LV - 13 - lufs(m)) / 20)  # nhạc nền nhỏ (giọng −13 LU)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)]; f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def put2(fn, t, db=0.0, ss=0.0, n=None):
    x = load(fn)[int(ss * SR):] * 10 ** (db / 20)
    if n: x = x[:int(n * SR)].copy(); f_ = min(len(x), int(0.15 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    f0 = min(len(x), int(0.02 * SR)); x[:f0] *= np.linspace(0, 1, f0)
    i = int(t * SR); L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
TH = '/root/work/assets/audio/e25_thu/'; FS = '/root/work/assets/audio/Free-SFX/'; MO = '/root/work/assets/audio/Meta-open-sound/corpora/oculus-audio-pack/ogg/'
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'
WH = lambda t, db=-14: put(A + 'whoosh/swish-3.wav', t, db)
bed(MG + 'stadium_crowd_outdoor.wav', 0, DUR, -30)
for k in SH:
    if k != 'h0': WH(SH[k][0] - 0.12, -17)
BJ = lambda t, i=1, db=-12: put(MO + f'MUSCStngr_BanjoHumorous_OS_0{i}.ogg', t, db)
# h0: bóc vỏ hạt dẻ khổng lồ
put('/root/work/assets/audio/xe_ao_rip.wav', 2.38, -4, 0.6); put2(TH + 'can_rac.mp3', 2.42 - 0.48, -6, 0, 1.0); put(MG + 'crowd_ooh_aah.wav', 2.8, -18, 1.6); BJ(3.2, 1, -10)
# s1: chạy ra sân; s1b: "poisonous" + nông dân liếm mép
put(MG + 'crowd_boo.wav', 6.0, -22, 2.0); put(MG + 'sad_trombone.wav', 11.3, -22, 1.2); BJ(13.4, 2, -12)
# s2: nhảy khỏi xe kéo, bóc bắp
for i in range(4): put(MG + 'football_hit.wav', 15.4 + 0.55 + i * 0.22 + 0.6, -20, 0.4)
put('/root/work/assets/audio/xe_ao_rip.wav', 16.6, -10, 0.45); put(MG + 'crowd_cheer.wav', 16.8, -16, 2.0)
# s2b: bảng điểm; s2c: lịch lật
put(MG + 'stadium_horn.wav', 18.0, -18, 1.2); put(MG + 'crowd_gasp.wav', 20.4, -18, 1.2)
put(FS + 'Owlish/Sound Effects Pack/Paper/paper-sketchbook-page-flips-1.opus', 22.95, -6, 1.4)
# s3: giao bóng; s3b: ném dài xuyên bắp
put(MG + 'ref_whistle.wav', 25.25, -14, 0.8); put(MG + 'football_kick.wav', 25.82, -6); put(MG + 'football_kick.wav', 27.62, -14)
put(A + 'whoosh/swish-3.wav', 27.7, -8); put('/root/work/assets/audio/sfx-kit/sounds/everyday-props/props-page-turn.wav', 29.75, -2); put(FS + 'rubberduck/WoodMetal/wood_cracking_01.opus', 29.8, -10, 0.8); put(MG + 'crowd_boo.wav', 29.5, -18, 1.5)
# s4: bóc vỏ → giao bóng → TD; s4b: lại nữa, lại nữa
put('/root/work/assets/audio/xe_ao_rip.wav', 32.05, -6, 0.45); put(MG + 'football_hit.wav', 32.8, -14); put(MG + 'crowd_roar.wav', 33.45, -12, 2.2)
put(MG + 'stadium_horn.wav', 34.5, -16, 0.8); put(MG + 'stadium_horn.wav', 35.35, -14, 0.8); BJ(34.0, 1, -14)
# s5: đá phạt 33 yard
put(MG + 'crowd_silence_cough.wav', 36.2, -20, 2.0); put(MG + 'football_kick.wav', 38.3, -4); put(MG + 'crowd_roar.wav', 39.3, -11, 2.0)
# s6: chuyền 26 yard; s6b: hạt dẻ nứt vỏ vì tức, ghi điểm
put(MG + 'football_hit.wav', 41.8, -12); put(MG + 'crowd_cheer.wav', 41.9, -14, 1.6)
put(FS + 'rubberduck/WoodMetal/wood_cracking_03.opus', 43.95, -6, 0.9); put2(TH + 'can_rac.mp3', 43.95 - 0.48, -10, 0, 0.9); put(MG + 'crowd_gasp.wav', 44.8, -16, 1.2)
# s7: 3rd & 5 → chạy 6 yard → quỳ → máy gặt
put(MG + "crowd_clap_rhythm.wav", 45.8, -20, 2.8); for_t = [49.25, 49.35, 49.45]
for tt in for_t: put(MG + 'football_hit.wav', tt, -16)
put(MG + 'ref_whistle.wav', 50.35, -14, 0.8); put(MG + 'crowd_roar.wav', 51.8, -12, 1.4)
bed(MO + 'VEHCar_CarEngineSlow_LOOP_01.ogg', 50.8, 53.0, -20); BJ(52.3, 2, -9)
# s8: chuỗi 31 trận kết thúc — tràn xuống sân, cột gôn đổ
put(MG + 'crowd_roar.wav', 53.1, -8, 4.8); put(MG + 'camera_flashes.wav', 54.0, -22, 2.0)
put(FS + 'rubberduck/BreakingFalling/bfh1_metal_falling_02.opus', 57.35, -6, 1.6); put(MG + 'crowd_cheer.wav', 57.6, -12, 2.2)
# s8b: nướng hạt dẻ (fan toxic cười)
put(MG + 'crowd_laugh.wav', 57.9, -14, 2.0)
# s9: hạt dẻ buồn
put(MG + 'sad_trombone.wav', 61.6, -14, 2.2); put(MG + 'crowd_laugh.wav', 62.6, -20, 1.6)
# s10: tuần sau — Michigan: sói hú, hạt dẻ rụt đầu
put(A + 'creature/howl.wav', 66.0, -8); put(MG + 'crowd_gasp.wav', 66.4, -18, 1.2); put(A + 'whoosh/swish-3.wav', 69.6, -12); BJ(71.0, 1, -12)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
