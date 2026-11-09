#!/usr/bin/env python3
"""Đo âm thanh video mẫu P02 (không thay cho việc nghe).
Đầu vào: wav mono 16 kHz + file ASR (.asr.json do asr_parakeet.py tạo: words=[[word, t_start], ...]).
Đo: tốc độ lời (cả video và không tính nghỉ), khoảng ngắt giữa từ, mức nền khi không có lời (ước lượng nhạc/ambience),
cao độ F0 trung vị (tự tương quan), các đỉnh năng lượng dải cao 3–8 kHz không trùng lời (ứng viên SFX/whoosh).
Cách dùng: python3 do_am_thanh.py a_V01.wav a_V01.asr.json out.json
Giới hạn: ASR chỉ cho mốc BẮT ĐẦU từ; mốc kết thúc từ ước lượng = mốc bắt đầu từ kế tiếp (trừ khoảng ngắt).
"""
import sys, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
wav, asr, out = sys.argv[1:4]
a, sr = sf.read(wav, dtype='float32'); d = json.load(open(asr)); W = d['words']; dur = len(a) / sr
hop = int(0.01 * sr); win = int(0.03 * sr)
def rms_series(x):
    n = (len(x) - win) // hop; return np.array([np.sqrt(np.mean(x[i*hop:i*hop+win]**2) + 1e-12) for i in range(n)])
db = 20 * np.log10(rms_series(a)); t = np.arange(len(db)) * hop / sr
hi = sosfilt(butter(4, [3000, 7900], 'bandpass', fs=sr, output='sos'), a); dbh = 20 * np.log10(rms_series(hi))
starts = [w[1] for w in W]; last = starts[-1]
gaps = np.diff(starts)
# pauses: inter-word start gaps > 0.45 s considered to contain a pause (rough)
long_gaps = [(round(starts[i], 2), round(float(g), 2), W[i][0], W[i+1][0]) for i, g in enumerate(gaps) if g > 0.6]
speech_span = last - starts[0] + 0.35
# speech activity mask: 0.35 s after each word start
mask = np.zeros_like(t, bool)
for s in starts: mask |= (t >= s - 0.03) & (t < s + 0.35)
# speech level vs no-speech level
sp = db[mask]; ns = db[~mask & (t > 0.2) & (t < last)]
# F0 via autocorrelation on speech frames with energy
f0s = []
fl = int(0.04 * sr)
for s in starts:
    i = int((s + 0.08) * sr); seg = a[i:i+fl]
    if len(seg) < fl or np.sqrt(np.mean(seg**2)) < 0.01: continue
    seg = seg - seg.mean(); ac = np.correlate(seg, seg, 'full')[fl-1:]
    lo, hi_ = int(sr / 350), int(sr / 70); k = lo + int(np.argmax(ac[lo:hi_]))
    if ac[k] / (ac[0] + 1e-9) > 0.35: f0s.append(sr / k)
# high band peaks
from scipy.signal import find_peaks
pk, pr = find_peaks(dbh, prominence=8, distance=20)
sfx = [round(float(t[p]), 2) for p in pk if not mask[p]]
res = {'thoi_luong_s': round(dur, 3), 'so_tu': len(W), 'tu_dau_s': starts[0], 'tu_cuoi_bat_dau_s': last,
       'duoi_sau_tu_cuoi_s_uoc_luong': round(dur - (last + 0.35), 2),
       'tu_moi_phut_ca_video': round(len(W) / dur * 60, 1), 'tu_moi_phut_doan_co_loi': round(len(W) / speech_span * 60, 1),
       'khoang_bat_dau_tu_trung_vi_s': round(float(np.median(gaps)), 3),
       'ngat_dai_hon_0_6s': long_gaps,
       'muc_khi_co_loi_dBFS_trung_vi': round(float(np.median(sp)), 1), 'muc_khi_khong_loi_dBFS_trung_vi': round(float(np.median(ns)), 1) if len(ns) else None,
       'chenh_loi_so_nen_dB': round(float(np.median(sp) - np.median(ns)), 1) if len(ns) else None,
       'f0_trung_vi_Hz': round(float(np.median(f0s)), 1) if f0s else None, 'f0_p10_p90_Hz': [round(float(np.percentile(f0s, 10)), 1), round(float(np.percentile(f0s, 90)), 1)] if f0s else None,
       'dinh_dai_cao_ngoai_loi_s': sfx}
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in res.items() if k not in ('dinh_dai_cao_ngoai_loi_s',)}, ensure_ascii=False))
