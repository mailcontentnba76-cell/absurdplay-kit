# Trộn giọng + nhạc + SFX theo mốc cho E07 (máy bắn đá). Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E07_may_ban_da'
DUR = 41.81
cuts = [4.4, 10.32, 14.0, 18.96, 24.1, 29.04, 32.16, 33.6, 35.6, 38.08]
cues = [(c - .15, 'whoosh', -15) for c in cuts]
cues += [(1.3, 'bet2', -14), (2.6, 'cho_hit', -14), (5.0, 'bet1', -13), (6.6, 'whoosh', -11), (7.38, 'uh_oh', -15), (9.5, 'bet1', -7),
         (10.6, 'quay_na', -9), (12.9, 'whoosh', -10), (13.15, 'ding', -9), (13.95, 'uh_oh', -15), (14.45, 'bet2', -13),
         (15.75, 'van_go', -11), (16.05, 'van_go', -12), (16.35, 'van_go', -12), (16.6, 'bung_reu', -12), (17.0, 'bung_reu', -13),
         (24.1, 'can_ban_da', -7), (25.7, 'het_bay_len', -8), (28.2, 'nga_xe', -11), (26.25, 'uh_oh', -15),
         (29.4, 'bung_reu', -11), (29.9, 'van_go', -14), (30.6, 'van_go', -14), (31.3, 'van_go', -14), (32.1, 'uh_oh', -15),
         (32.3, 'can_ban_da', -7), (34.3, 'bbq_bet', -6), (36.85, 'bung_reu', -12), (37.2, 'banh_xe_co', -10),
         (38.4, 'cho_hit', -15), (38.7, 'can_ban_da', -8), (40.3, 'bet1', -6), (40.5, 'ding', -10)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(max(0,t0)*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
