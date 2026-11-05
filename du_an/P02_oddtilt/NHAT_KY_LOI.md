# NHẬT KÝ LỖI — P02 oddtilt
| Ngày | Bước | Dấu hiệu | Nguyên nhân | Cách sửa | Cách phòng |
|---|---|---|---|---|---|
| 05/11/2026 | G0/G2 tải mẫu | `yt-dlp https://www.tiktok.com/@oddtilt` → "Tunnel connection failed: 403 Forbidden" | Chính sách mạng của môi trường cloud chặn www.tiktok.com (đã kiểm bằng curl, kể cả m.tiktok.com, tiktokv.com, youtube.com, archive.org) | Chủ dự án thêm miền TikTok vào Allowed domains của môi trường, hoặc tự tải 26 video và đính kèm/đẩy lên Release | Kiểm `curl -I https://www.tiktok.com` ở G0 trước khi hứa tải mẫu |
| 05/11/2026 | G4 | faster-whisper không tải được mô hình | huggingface.co bị chặn | Thêm huggingface.co vào Allowed domains, hoặc đính kèm thư mục mô hình `small.en` | Kiểm tải mô hình ở G0 |
| 05/11/2026 | G2 đo | `phan_tich_mau.py` trả màu/chuyển động = None | OpenCV bản pip không giải mã AV1 | Chuyển H.264 bằng ffmpeg trước khi đo | Kiểm codec bằng ffprobe; AV1 → chuyển mã |
| 05/11/2026 | G2 đo | librosa `beat_track` segfault | numba gufunc lỗi trong môi trường | Bỏ beat_track, dùng tự tương quan onset | — |
| 05/11/2026 | G2 phụ đề | Đếm cụm phụ đề sai (1 từ/cụm) | Chữ hiện có hiệu ứng nảy → chênh lệch khung tạo đỉnh giả | Đếm cụm theo khung trống giữa cụm | Kiểm 15 khung/s một đoạn trước khi tin số |
| 05/11/2026 | G2 phụ đề | Video bút bi đo chữ sai | Nền giấy/bàn trắng trùng màu chữ | Ghi [QS], loại khỏi thống kê | — |
