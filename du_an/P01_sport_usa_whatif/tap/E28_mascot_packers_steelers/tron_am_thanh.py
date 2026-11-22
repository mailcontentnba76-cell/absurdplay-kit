"""E28 Packers vs Steelers: giọng Sport USA ×1,05 (Magnific) + nhạc CC0 alvana funk/sleep (120 BPM, chưa dùng) + SFX nhà máy/sân bóng.
Nhạc = giọng −13 LU, SFX = giọng −12 LU; bản cuối −14 LUFS khi ráp."""
import subprocess, re, numpy as np, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR = 48000; LIB = '/root/work/assets/audio/'; MG = 'magnific_sfx/'; DUR = 90.42
src = open('/root/work/engine/ep28_packers_steelers_shots.js').read()
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
voice = load('am_thanh/giong_raw.wav'); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; save('giong', voice); LV = lufs(voice)
m = load('alvana-audio/music/funk/sleep.mp3'); m = np.tile(m, N // len(m) + 1)[:N]; m *= 10 ** ((LV - 13 - lufs(m)) / 20)
env = np.abs(voice); k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); duck = 1 - 0.3 * np.clip(env / (env.max() * 0.3), 0, 1)
gm = np.ones(N)
def dip(t0, t1, lvl):  # nhịp lặng trước cú nổ lớn nhất (Steel Curtain)
    i0, i1 = int(t0 * SR), int(t1 * SR); gm[i0:i1] = np.minimum(gm[i0:i1], lvl)
dip(SH['s24'][0], SH['s25'][0] + 0.9, 0.15)
gm[T > DUR - 1.2] *= np.linspace(1, 0, int(np.sum(T > DUR - 1.2)))
sm = int(0.08 * SR); gm = np.convolve(gm, np.ones(sm) / sm, 'same'); m *= duck * gm
sfx = np.zeros(N, np.float32)
def put(fn, t, db=0.0, n=None):
    x = load(fn) * 10 ** (db / 20)
    if n: x = x[:int(n * SR)].copy(); f_ = min(len(x), int(0.12 * SR)); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    L = min(len(x), N - i)
    if L > 0: sfx[i:i + L] += x[:L]
def bed(fn, t0, t1, db):
    x = load(fn); n = int((t1 - t0) * SR); x = np.tile(x, n // len(x) + 1)[:n] * 10 ** (db / 20); f_ = int(0.25 * SR); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_)
    i = int(t0 * SR); sfx[i:i + n] += x[:N - i]
A = 'alvana-audio/sfx/'; MO = 'Meta-open-sound/corpora/oculus-audio-pack/ogg/'; FS = 'Free-SFX/'
S0 = lambda k: SH[k][0]
bed(MG + 'stadium_crowd_outdoor.wav', 0, S0('s24'), -30); bed(MG + 'stadium_crowd_outdoor.wav', S0('s25') + 0.9, DUR, -30)
for kk in SH:
    if kk not in ('s01', 's25'): put(A + 'whoosh/swish-3.wav', S0(kk) - 0.12, -19)
# s01–s02: va chạm giây 0
put(A + 'transition/whoosh-hit-1.wav', 0.0, -8); put(MG + 'crowd_roar.wav', 0.0, -12, 2.4)
for d in (0.88, 0.95, 1.02, 1.1): put(MG + 'football_hit.wav', d, -6, 0.5)
put(MG + 'crowd_ooh_aah.wav', 1.3, -16, 1.4)
# s03: thép rít
put(A + 'impact/metallic.wav', S0('s03') + 0.3, -16)
# s04/s12: xé áo + khói
for k_ in ('s04', 's12'): put(A + 'foley/cloth-1.wav', S0(k_) + 0.35, -6); put(MO + 'PAPRRip_PaperTear_OS_01.ogg', S0(k_) + 0.4, -8, 0.6); put(MG + 'crowd_cheer.wav', S0(k_) + 1.0, -16, 1.6)
put(A + 'pop/classic-pop.wav', S0('s05') + 0.2, -12)
# s06–s07: băng chuyền + bắt xúc xích
put(A + 'data/beeps.wav', S0('s06') + 0.2, -18, 1.4); put(MO + 'TOONBoing_BounceCartoony_OS_02.ogg', S0('s07') + 0.55, -10)
put(A + 'whoosh/air-01.wav', S0('s08'), -14)
# s10: bấm thẻ
put('freesfx/rubberduck/WoodMetal/hammer_01.opus'.replace('freesfx/', FS), S0('s10') + 0.4, -10, 0.5)
put(MG + 'drumline.wav', S0('s11'), -16, 1.3)
# s13: thép nóng chảy
put(MO + 'METLImpt_HammerAnvil_OS_01.ogg', S0('s13') + 0.1, -10); bed(MG + 'stadium_crowd_outdoor.wav', S0('s13'), S0('s14'), -40)
# s15: báo bay; s17: "Arrr" → "clang"
put(A + 'whoosh/air-02.wav', S0('s15'), -10)
put(A + 'whoosh/air-01.wav', 29.15, -12); put(A + 'impact/metallic.wav', 29.78, -4); put(MG + 'crowd_laugh.wav', 30.0, -18, 1.4)
# s18–s19: còi + kèn sân
put(MG + 'ref_whistle.wav', S0('s18') + 2.2, -12, 0.9); put(MG + 'stadium_horn.wav', S0('s19') + 0.1, -12, 1.2)
# s20–s23: cúp
put(MG + 'crowd_roar.wav', S0('s20') + 0.3, -14, 2.0); put(MG + 'crowd_chant_defense.wav', S0('s21'), -14, 1.8)
put(A + 'data/beeps-fast.wav', S0('s22') + 0.2, -16, 2.0); put(MG + 'crowd_cheer.wav', S0('s23'), -10, 2.4)
# s24: im lặng → s25: Màn Thép đập xuống (cú nổ lớn nhất)
put(MG + 'crowd_silence_cough.wav', S0('s24'), -16, 1.9)
tc = S0('s25') + 0.87; put(A + 'whoosh/reverse.wav', tc - 0.9, -10); put(A + 'break/metal-falling-01.wav', tc - 0.05, -2); put(MG + 'football_hit.wav', tc, 0); put(A + 'impact/metallic.wav', tc, -4); put(MG + 'crowd_gasp.wav', tc + 0.4, -10, 1.6)
# s26: radio
put(A + 'data/beeps.wav', S0('s26') + 0.1, -26, 0.6)
# s28–s30: bật ra
put(A + 'whoosh/air-01.wav', S0('s28') + 0.45, -12); put(MO + 'TOONBoing_BounceCartoony_OS_03.ogg', S0('s28') + 0.9, -6)
put(A + 'misc/spring-01.wav', S0('s29') + 0.75, -6); put(A + 'impact/metallic.wav', S0('s30') + 0.55, -6); put(A + 'misc/spring-02.wav', S0('s30') + 0.6, -10); put(MG + 'crowd_laugh.wav', S0('s30') + 0.7, -14, 1.4)
# s32–s38: bỏ phiếu cổ đông
put(A + 'riser/classic-riser.wav', S0('s32'), -16, 1.7); put(MG + 'crowd_clap_rhythm.wav', S0('s34'), -16, 1.8)
put(FS + 'rubberduck/WoodMetal/hammer_02.opus', S0('s35') + 0.3, -6, 0.5); put(FS + 'rubberduck/WoodMetal/hammer_02.opus', S0('s35') + 0.9, -8, 0.5)
put(MG + 'crowd_cheer.wav', S0('s37'), -8, 1.6); put(A + 'break/metal-falling-02.wav', S0('s38') + 0.5, -8); put(MG + 'organ_charge.wav', S0('s38') + 0.2, -16, 1.3)
put(MG + 'sad_trombone.wav', S0('s39') + 0.2, -14, 1.5)
# s40–s47: khăn vs mũ phô mai, fan toxic
put(MG + 'crowd_roar.wav', S0('s40'), -10, 1.8); put(A + 'whoosh/air-01.wav', S0('s41') + 0.5, -10); put(MG + 'crowd_cheer.wav', S0('s43') + 0.2, -12, 1.8)
put(A + 'pop/classic-hop.wav', S0('s45') + 0.5, -8); put(MG + 'crowd_boo.wav', S0('s46'), -16, 2.0); put(MG + 'crowd_laugh.wav', S0('s47'), -14, 2.0)
put(MG + 'organ_charge.wav', S0('s48') + 0.6, -14, 1.6)
sfx *= 10 ** ((LV - 12 - lufs(sfx)) / 20)
save('nhac', m); save('sfx', sfx)
print('LUFS giong', LV, 'nhac', lufs(m), 'sfx', lufs(sfx))
