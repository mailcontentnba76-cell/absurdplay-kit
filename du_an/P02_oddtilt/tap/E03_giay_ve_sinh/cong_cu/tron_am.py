# Trộn giọng + nhạc + SFX theo mốc cho E03. Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E03_giay_ve_sinh'
DUR = 33.0
cues = [(c - .15, 'whoosh', -14) for c in [3.9, 6.4, 9.6, 12.0, 14.96, 17.1, 19.5, 21.8, 24.5, 27.9, 30.5]]
cues += [(2.65, 'gai_ngua', -10), (6.55, 'bung_reu', -10), (8.74, 'ding', -9), (9.55, 'uh_oh', -15), (12.5, 'dap_soi', -11),
         (15.0, 'gio_giay', -11), (18.74, 'ding', -9), (19.75, 'cuon_giay', -11), (23.55, 'xe_giay', -9), (24.45, 'uh_oh', -15),
         (25.0, 'vo_giay', -10), (30.6, 'ding', -12)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(t0*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
