# NHẬT KÝ LỖI — P02 oddtilt
| Ngày | Bước | Dấu hiệu | Nguyên nhân | Cách sửa | Cách phòng |
|---|---|---|---|---|---|
| 05/11/2026 | G0/G2 tải mẫu | `yt-dlp https://www.tiktok.com/@oddtilt` → "Tunnel connection failed: 403 Forbidden" | Chính sách mạng của môi trường cloud chặn www.tiktok.com (đã kiểm bằng curl, kể cả m.tiktok.com, tiktokv.com, youtube.com, archive.org) | Chủ dự án thêm miền TikTok vào Allowed domains của môi trường, hoặc tự tải 26 video và đính kèm/đẩy lên Release | Kiểm `curl -I https://www.tiktok.com` ở G0 trước khi hứa tải mẫu |
| 05/11/2026 | G4 | faster-whisper không tải được mô hình | huggingface.co bị chặn | Thêm huggingface.co vào Allowed domains, hoặc đính kèm thư mục mô hình `small.en` | Kiểm tải mô hình ở G0 |
