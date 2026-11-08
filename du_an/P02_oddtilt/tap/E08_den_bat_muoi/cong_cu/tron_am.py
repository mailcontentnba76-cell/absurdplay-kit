# Trộn giọng + nhạc + SFX theo mốc cho E08 (đèn bắt muỗi). Dùng: python3 -I tron_am.py <ra.wav>
import subprocess, sys, os
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')); X = P + '/tai_nguyen/sfx'; T = P + '/tap/E08_den_bat_muoi'
DUR = 41.82
cuts = [3.12, 5.68, 9.84, 12.64, 15.52, 17.84, 21.12, 24.64, 29.76, 31.2, 33.04, 34.56, 36.88, 38.24]
cues = [(c - .15, 'whoosh', -16) for c in cuts]
cues += [(0.0, 'muoi_vo_ve', -13), (2.0, 'muoi_vo_ve', -15), (4.1, 'tat_mat', -7), (5.62, 'uh_oh', -15), (6.0, 'muoi_vo_ve', -14), (7.82, 'tat_mat', -5),
         (10.2, 'bung_reu', -12), (11.95, 'ding', -9), (12.6, 'uh_oh', -15), (12.9, 'ho_khoi', -8), (14.0, 'ho_khoi', -10), (14.2, 'muoi_vo_ve', -16),
         (15.9, 'keo_rem_tam', -11), (17.8, 'uh_oh', -15), (19.95, 'rach_man', -6), (20.4, 'muoi_vo_ve', -15),
         (21.8, 'bung_reu', -12), (22.4, 'bung_reu', -12), (22.9, 'zap2', -16), (23.5, 'bung_reu', -12), (26.5, 'zap1', -12), (26.75, 'zap2', -13), (27.0, 'zap1', -13), (27.25, 'zap2', -13),
         (29.7, 'uh_oh', -15), (29.9, 'zap1', -2), (31.3, 'pho_thuc_day', -8), (33.4, 'van_go', -14), (34.5, 'uh_oh', -15), (35.62, 'zap2', -4),
         (37.2, 'bung_reu', -11), (38.3, 'zap_bong_ngo', -9), (39.6, 'zap_bong_ngo', -10), (40.6, 'ding', -11)]
inp = ['-i', T + '/am_thanh/giong.wav', '-i', P + '/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3']
fl = [f'[0]atrim=0:{DUR},aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB,apad=whole_dur={DUR}[v]',
      f'[1]atrim=0:{DUR},aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st={DUR-0.6}:d=0.6[m]']
for i, (t0, n, db) in enumerate(cues):
    inp += ['-i', f'{X}/{n}.mp3']; fl.append(f'[{i+2}]aformat=channel_layouts=mono,aresample=44100,adelay={int(max(0,t0)*1000)},volume={db}dB[s{i}]')
mixin = '[v][m]' + ''.join(f'[s{i}]' for i in range(len(cues)))
fl.append(f'{mixin}amix=inputs={len(cues)+2}:normalize=0:duration=first,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fl), '-ar', '44100', '-ac', '2', sys.argv[1]], check=True)
