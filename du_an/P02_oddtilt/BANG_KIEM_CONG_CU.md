# BẢNG KIỂM CÔNG CỤ — P02 (05/11/2026, phiên cloud)
| Thành phần | Mục đích | Bắt buộc | Trạng thái | Bằng chứng / ghi chú |
|---|---|---|---|---|
| Truy cập www.tiktok.com | tải mẫu trực tiếp | không (đã có cách khác) | THIẾU — chính sách mạng chặn | proxy `connect_rejected`; thay bằng Release GitHub do chủ dự án tải lên |
| GitHub Release (gh api) | nhận video mẫu | có | ĐÃ KIỂM | tải 14/14 file từ `mau-oddtilt` |
| ffmpeg/ffprobe (có libdav1d) | đọc AV1, đo loudness, chuyển mã | có | ĐÃ KIỂM | 14 video → H.264, ebur128 |
| numpy + opencv-python-headless | đo hình | có | ĐÃ KIỂM | không đọc trực tiếp AV1 → chuyển H.264 trước |
| cong_cu/phan_tich_mau.py | đo G2 | có | ĐÃ KIỂM | 14/14 |
| sherpa-onnx + Parakeet-TDT 0.6B v2 int8 (GitHub k2-fsa) | chép lời + mốc từ | có | ĐÃ KIỂM | 14/14 bản chép; chất lượng tốt trên mẫu (đọc lại thấy hợp lý) |
| faster-whisper | chép lời | không | CÓ NHƯNG CHƯA HỢP | huggingface.co bị chặn |
| librosa 0.11 | F0, onset | nên có | ĐÃ KIỂM (trừ beat_track segfault) | |
| Nghe âm thanh | nhạc/SFX/giọng | có | **CẦN NGƯỜI DÙNG** | Claude không nghe được trong môi trường này |
| Công cụ sản xuất (engine 3D, TTS, dựng) | G4 | có | CHƯA KIỂM | làm sau khi duyệt hồ sơ |
