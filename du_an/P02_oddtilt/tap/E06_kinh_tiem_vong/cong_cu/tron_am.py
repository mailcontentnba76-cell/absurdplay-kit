# Trộn giọng + nhạc + SFX theo mốc cho E06 (kính tiềm vọng). Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E06_kinh_tiem_vong'
DUR = 41.58
cuts = [1.44, 2.6, 3.84, 6.72, 8.08, 10.32, 11.72, 13.12, 14.08, 17.6, 20.24, 24.0, 26.08, 27.6, 29.52, 31.44, 33.6, 35.36, 37.04, 38.48]
cues = [(c - .15, 'whoosh', -15) for c in cuts]
cues += [(0.0, 'voi_sen_hat', -15), (3.0, 'voi_sen_hat', -19), (4.5, 'bung_reu', -12), (6.65, 'uh_oh', -15), (8.4, 'voi_sen_hat', -18), (9.2, 'keo_rem_tam', -8),
         (10.75, 'zoom_kinh', -9), (11.75, 'zoom_kinh', -12), (13.06, 'ding', -9), (14.4, 'xich_xe', -22), (17.7, 'zoom_kinh', -10), (18.15, 'bung_reu', -11),
         (20.18, 'uh_oh', -15), (21.36, 'gay_choi', -7), (22.0, 'nga_xe', -14), (24.35, 'bung_reu', -13), (24.75, 'bung_reu', -13), (25.0, 'bung_reu', -13), (25.25, 'bung_reu', -12),
         (26.0, 'uh_oh', -15), (26.4, 'xit', -9), (29.9, 'bung_reu', -12), (30.3, 'gat_nuoc', -8), (30.9, 'ding', -11), (31.38, 'uh_oh', -15),
         (34.15, 'be_het', -8), (35.36, 'be_het', -12), (37.6, 'khoa_hop', -7), (38.6, 'voi_sen_hat', -16), (39.4, 'hit_ha', -16)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(max(0,t0)*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
