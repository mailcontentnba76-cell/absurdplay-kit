# NHẬT KÝ LỖI — P02 oddtilt
| Ngày | Bước | Dấu hiệu | Nguyên nhân | Cách sửa | Cách phòng |
|---|---|---|---|---|---|
| 05/11/2026 | G0/G2 tải mẫu | `yt-dlp https://www.tiktok.com/@oddtilt` → "Tunnel connection failed: 403 Forbidden" | Chính sách mạng của môi trường cloud chặn www.tiktok.com (đã kiểm bằng curl, kể cả m.tiktok.com, tiktokv.com, youtube.com, archive.org) | Chủ dự án thêm miền TikTok vào Allowed domains của môi trường, hoặc tự tải 26 video và đính kèm/đẩy lên Release | Kiểm `curl -I https://www.tiktok.com` ở G0 trước khi hứa tải mẫu |
| 05/11/2026 | G4 | faster-whisper không tải được mô hình | huggingface.co bị chặn | Thêm huggingface.co vào Allowed domains, hoặc đính kèm thư mục mô hình `small.en` | Kiểm tải mô hình ở G0 |
| 05/11/2026 | G2 đo | `phan_tich_mau.py` trả màu/chuyển động = None | OpenCV bản pip không giải mã AV1 | Chuyển H.264 bằng ffmpeg trước khi đo | Kiểm codec bằng ffprobe; AV1 → chuyển mã |
| 05/11/2026 | G2 đo | librosa `beat_track` segfault | numba gufunc lỗi trong môi trường | Bỏ beat_track, dùng tự tương quan onset | — |
| 05/11/2026 | G2 phụ đề | Đếm cụm phụ đề sai (1 từ/cụm) | Chữ hiện có hiệu ứng nảy → chênh lệch khung tạo đỉnh giả | Đếm cụm theo khung trống giữa cụm | Kiểm 15 khung/s một đoạn trước khi tin số |
| 05/11/2026 | G2 phụ đề | Video bút bi đo chữ sai | Nền giấy/bàn trắng trùng màu chữ | Ghi [QS], loại khỏi thống kê | — |
| 06/11/2026 | Demo door | Sọc đen răng cưa ở nếp gập tấm da | GTAO tính che khuất giữa 2 lớp mỏng | Bỏ GTAO, giữ HDRI + bóng nắng | Không dùng AO màn hình cho vật mỏng gập |
| 06/11/2026 | Demo door | Thấy người bên ngoài qua khe màn | Màn treo trong lỗ cửa, hẹp hơn khung, máy chéo | Màn rộng 1,36 m treo sát mặt tường trong | Kiểm khung máy chéo trước khi render |
| 06/11/2026 | Demo door | Hướng gió lật màn bị ngược | Nhìn từ trong nhà, +x thế giới nằm bên trái màn hình | Soi gương x trong hàm biến dạng | Render 1 khung thử hướng trước |
| 06/11/2026 | Demo door | Hình nhoè khi chuyển động | 720p, không MSAA, JPEG 0,93, unsharp | 1080p, MSAA 4×, JPEG 0,97, crf 15 | Mặc định render 1080 |
| 06/11/2026 | Demo door | Vệt đen nhấp nháy ngoài cửa bên phải (8–11 s) | Mặt trong khung gỗ sẫm trùng đúng mặt cắt tường (x=±0,50) → z-fighting | Khung rộng 0,16, mặt trong 0,485; khung trong lùi 1,5 cm | Không đặt mặt khối trùng mặt khối khác; soi khung liền nhau ở 100 % |
| 06/11/2026 | Demo door | Nền cỏ ngoài cửa nháy tối/sáng khi máy đẩy | Texture cỏ lặp 120× + normal map → răng cưa | Lặp 28×, bỏ normal map, anisotropy 16 | QA bản đồ nhấp nháy trước khi giao |
