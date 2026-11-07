# Trộn giọng + nhạc + SFX theo mốc cho E04. Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E04_khu_mui'
DUR = 30.35
cues = [(c - .15, 'whoosh', -14) for c in [3.36, 5.3, 8.2, 9.92, 12.96, 15.12, 18.16, 21.2, 23.68, 25.44, 27.36]]
cues += [(0.6, 'mui_chim', -12), (1.2, 'oe', -14), (2.5, 'oe', -15), (5.9, 'vo_la', -11), (7.55, 'ding', -9), (8.15, 'uh_oh', -15),
         (10.3, 'tron_mo', -11), (12.9, 'uh_oh', -15), (15.6, 'bot', -9), (17.3, 'ding', -9), (19.6, 'oe', -13), (21.4, 'bi_lan', -10),
         (23.6, 'uh_oh', -15), (25.7, 'xit', -10), (26.6, 'xit', -11), (27.6, 'hit_ha', -10), (28.8, 'hit_ha', -12)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(t0*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
