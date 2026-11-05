# BẢNG KIỂM CÔNG CỤ — P02 oddtilt (05/11/2026, phiên cloud)
| Thành phần | Mục đích | Bắt buộc | Trạng thái | Bằng chứng / ghi chú |
|---|---|---|---|---|
| Truy cập www.tiktok.com + CDN TikTok | tải 26 video mẫu | có | **THIẾU — CẦN NGƯỜI DÙNG** | `yt-dlp` và `curl` → proxy trả `connect_rejected` (403) cho www.tiktok.com, m.tiktok.com, *.tiktokv.com. Chính sách mạng của môi trường chặn |
| yt-dlp 2026.10.26 | tải video | có | CÀI ĐƯỢC, chưa chạy được tác vụ thật | bị chặn mạng |
| ffmpeg / ffprobe | đo kỹ thuật, loudness | có | ĐÃ KIỂM | tạo video thử 576x1024 4 s, chạy `phan_tich_mau.py` ra bao_cao.md, lưới, do_luong.json |
| numpy 2.5.3 + opencv-python-headless | đo màu, độ nét, chuyển động | nên có | ĐÃ KIỂM | như trên |
| cong_cu/phan_tich_mau.py | đo tự động G2 | có | ĐÃ KIỂM | như trên |
| faster-whisper (pip) | chép lời có mốc từ | có | **CÓ NHƯNG CHƯA HỢP** | thư viện cài được; tải mô hình từ huggingface.co bị proxy chặn (403) |
| Magnific (MCP) | phân tích/sản xuất | tùy chọn | chưa kiểm | không nhận URL TikTok trực tiếp |
