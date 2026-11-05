# Công cụ đo P02 (đã chạy thật 05/11/2026)
Bố cục thư mục làm việc `<W>`: `h264/` (video đã chuyển H.264 — OpenCV bản pip không đọc AV1), `asr_out/`, `do/` (kết quả `cong_cu/phan_tich_mau.py`), `do2/`, `do3/`.

```bash
pip install --break-system-packages yt-dlp opencv-python-headless sherpa-onnx soundfile librosa
# mô hình ASR (GitHub release, tải được khi huggingface bị chặn)
curl -L -o p.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2 && tar xjf p.tar.bz2
for f in mau_goc/*.mp4; do ffmpeg -i "$f" -c:v libx264 -crf 14 -c:a copy "<W>/h264/$(basename "$f")"; done
python3 -I asr_parakeet.py <thư mục mô hình> <W>/h264 <W>/asr_out          # lời + mốc từ
python3 -I ../../../cong_cu/phan_tich_mau.py <video> <W>/do/<tên> --nguong-cat 0.2
python3 -I do_bo_sung.py <video> <W>/asr_out/<tên>.json <W>/do2/<tên>.json   # máy, phụ đề, nền âm, F0
python3 -I do_cat.py <video> <W>/do3/<tên>.json                              # cắt cảnh theo chênh lệch điểm ảnh
python3 -I tong_hop_so_do.py      # đặt trong <W>/scripts/, ghi <W>/tong.json
python3 -I viet_phan_tich.py <thư mục ra>   # sinh file phân tích từ tong.json + ghichu_quan_sat.py
```
Giới hạn: phát hiện phụ đề sai khi nền trắng; phân loại máy là ước lượng thô; librosa `beat_track` gây segfault (numba) trong môi trường này nên dùng tự tương quan onset.
