#!/usr/bin/env python3
"""Chép lời tiếng Anh có mốc từng từ bằng parakeet-tdt-0.6b-v2 (int8, sherpa-onnx), chạy trên CPU, không cần mạng.
Mô hình: thư mục $PARAKEET_DIR (mặc định /root/.p02/parakeet) gồm encoder/decoder/joiner .int8.onnx + tokens.txt.
Dùng: python3 asr_parakeet.py <file âm thanh/video> [...]  -> ghi <tên>.asr.json cạnh file: {"text", "words": [[word, t_start], ...]}
Giới hạn: chỉ có mốc BẮT ĐẦU từ, bước 0,08 s; chỉ tiếng Anh. Theo README của mô hình, đoạn dài hơn ~60 s giải mã kém: cắt ở chỗ lặng thành đoạn 15–20 s rồi cộng mốc.
"""
import sys, os, json, subprocess, tempfile, sherpa_onnx, soundfile as sf
M = os.environ.get('PARAKEET_DIR', '/root/.p02/parakeet').rstrip('/') + '/'
r = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=M + 'encoder.int8.onnx', decoder=M + 'decoder.int8.onnx', joiner=M + 'joiner.int8.onnx', tokens=M + 'tokens.txt', model_type='nemo_transducer', num_threads=2)
for f in sys.argv[1:]:
    with tempfile.TemporaryDirectory() as td:
        w16 = os.path.join(td, 'a.wav'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ac', '1', '-ar', '16000', w16], check=True)
        a, sr = sf.read(w16, dtype='float32')
    s = r.create_stream(); s.accept_waveform(sr, a); r.decode_stream(s); res = s.result
    words = []
    for t, st in zip(res.tokens, res.timestamps):
        if t.startswith(' ') or t.startswith('▁') or not words: words.append([t.strip(' ▁'), round(float(st), 3)])
        else: words[-1][0] += t
    out = os.path.splitext(f)[0] + '.asr.json'
    json.dump({'text': res.text, 'words': words}, open(out, 'w'), ensure_ascii=False, indent=0)
    print(out, len(words), 'từ:', res.text[:80])
