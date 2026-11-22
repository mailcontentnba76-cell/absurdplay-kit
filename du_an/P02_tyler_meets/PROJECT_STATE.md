# PROJECT_STATE — series "Tyler meets…" (kit v1.0, 21/11/2026)

## Đã xong (đã duyệt)
- HB01, HB02 (series homeboy gốc, Dre; không kèm scene trong kit).
- TM01 Jaylen — `references/videos/TM01_jaylen_v3.mp4`.
- TM02 Marcus — `references/videos/TM02_marcus_v2.mp4`.
- TMG01 Brody GTA 6 (trend) — `references/videos/TMG01_brody.mp4`.

## Đang chờ
- **TM03 Destiny "Friend with an Attitude":** kịch bản v1 ở `episodes/TM03/`. Chờ người dùng chốt, rồi làm giọng, dựng, render. Bối cảnh dự kiến: sân trước trường (khác góc với cổng trường TMG01), lab hóa, phòng máy tính, khán đài sân bóng. Câu "What the fuck is wrong with this dude?" giữ nguyên chữ ("dude" dùng được cho nữ); người dùng có thể đổi thành "this girl".
- Sau TM03: nhân vật 04 Brianna (Drama Queen), theo danh sách trong `docs/homeboy/SERIES_TYLER_MEETS.md`.

## Nhật ký
- 21/11/2026: đóng gói kit (skill + tools + assets + 3 tập mẫu) để mang sang tài khoản Claude khác.
- 22/11/2026: đưa kit vào repo `absurdplay-kit` (`du_an/P02_tyler_meets`) và chạy được trên phiên cloud Linux: bpy 5.2.4 + Mesa, font thay thế (`tools/kitfonts.py`), `tools/blender_linux.sh`, `tools/setup_linux.sh`. Đã kiểm: 3 ảnh thử TMG01 khớp video mẫu; ASR TMG01 khớp bản gốc 175/176 từ; API SonicVoice trả danh mục giọng. Chưa kiểm: tạo giọng mới (tốn ký tự), `build_episode.py` (cần clip render), render cả tập.
