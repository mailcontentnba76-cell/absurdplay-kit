# Trộn giọng + nhạc + SFX theo mốc cho E05 (xe đạp). Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E05_xe_dap'
DUR = 36.77
cuts = [1.3, 2.88, 4.9, 6.4, 7.2, 8.88, 11.1, 13.2, 15.5, 16.25, 16.95, 19.36, 22.24, 25.7, 27.2, 28.24, 29.6, 30.96, 33.52, 35.25, 35.95]
cues = [(c - .15, 'whoosh', -15) for c in cuts]
cues += [(0.42, 'giat_lon_bia', -9), (3.55, 'van_go', -11), (4.4, 'bung_reu', -12), (4.62, 'bung_reu', -12), (4.9, 'banh_go_lan', -13),
         (6.55, 'ding', -9), (7.25, 'uh_oh', -15), (9.35, 'van_go', -12), (10.3, 'xich_xe', -16), (11.1, 'uh_oh', -15),
         (13.65, 'bung_reu', -10), (14.3, 'bung_reu', -11), (15.5, 'chuong_xe', -12), (16.85, 'uh_oh', -14), (17.0, 'nga_xe', -8),
         (17.8, 'nga_xe', -10), (20.35, 'van_go', -13), (21.0, 'xich_xe', -14), (22.7, 'xich_xe', -15), (25.8, 'whoosh', -10),
         (27.2, 'ding', -9), (27.6, 'chuong_xe', -13), (28.24, 'xoc_rang', -10), (29.6, 'xoc_rang', -10), (31.75, 'bom_lop', -9),
         (33.0, 'ding', -11), (34.2, 'chuong_xe', -11), (34.5, 'giat_lon_bia', -9), (35.3, 'uh_oh', -14), (36.0, 'hit_ha', -12)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(max(0,t0)*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
