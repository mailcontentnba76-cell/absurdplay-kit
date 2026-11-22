# PROJECT_STATE — series "Tyler meets…" (kit v1.0, 21/11/2026)

## Đã xong (đã duyệt)
- HB01, HB02 (series homeboy gốc, Dre; không kèm scene trong kit).
- TM01 Jaylen — `references/videos/TM01_jaylen_v3.mp4`.
- TM02 Marcus — `references/videos/TM02_marcus_v2.mp4`.
- TMG01 Brody GTA 6 (trend) — `references/videos/TMG01_brody.mp4`.

## Đang chờ
- **TM03 Destiny "Friend with an Attitude":** kịch bản v1 ở `episodes/TM03/`. Chờ người dùng chốt, rồi làm giọng, dựng, render. Bối cảnh dự kiến: sân trước trường (khác góc với cổng trường TMG01), lab hóa, phòng máy tính, khán đài sân bóng. Câu "What the fuck is wrong with this dude?" giữ nguyên chữ ("dude" dùng được cho nữ); người dùng có thể đổi thành "this girl".
- Sau TM03: nhân vật 04 Brianna (Drama Queen), theo danh sách trong `docs/homeboy/SERIES_TYLER_MEETS.md`.

## TT-001 (bộ TikTok suite v4.0 → skill riêng của kênh)
- **TT001 Elijah "The Aura Farmer"** (#13 ghép trend aura farming): kịch bản v2 đã KHÓA bằng `tyler-tt-script`, **chờ người dùng chốt** trước khi làm giọng. Gồm: `episodes/TT001/TT001_script_lienmach.md`, `TT001_script_full.md` (34 cảnh), `shots.txt`, `library.json`, `out/TT001_post.txt`, `tt/out/01..04-TT-*`, `tt/QA_REPORT.md` (93/100, 0 P0/P1).
- Bối cảnh TT001: sân bóng rổ ngoài trời, phòng band, phòng mỹ thuật, bến xe buýt (đã giữ chỗ, đừng dùng cho tập khác).

## Nhật ký
- 21/11/2026: đóng gói kit (skill + tools + assets + 3 tập mẫu) để mang sang tài khoản Claude khác.
- 22/11/2026: đưa kit vào repo `absurdplay-kit` (`du_an/P02_tyler_meets`) và chạy được trên phiên cloud Linux: bpy 5.2.4 + Mesa, font thay thế (`tools/kitfonts.py`), `tools/blender_linux.sh`, `tools/setup_linux.sh`. Đã kiểm: 3 ảnh thử TMG01 khớp video mẫu; ASR TMG01 khớp bản gốc 175/176 từ; API SonicVoice trả danh mục giọng. Chưa kiểm: tạo giọng mới (tốn ký tự), `build_episode.py` (cần clip render), render cả tập.
- 22/11/2026: ADAPT_SKILLS bộ tiktok-raw-topic-script-suite v4.0 → 3 skill `tyler-tt-topic-studio`, `tyler-tt-script` (+ assembler có cổng kênh và `kit-export`), `tyler-tt-studio-doctor` (+ HYPOTHESIS_LEDGER). Kiểm hồi quy: dựng lại `shots.txt` của TMG01 khớp bản gốc. Chọn TT-001 (ủy quyền), viết P01..P04 tuần tự, khóa v2. Chưa làm giọng/render.
- 22/11/2026: TT001 (Elijah × aura farming) — người dùng chốt kịch bản v2. Giọng SonicVoice (vo.wav 76.12 s), 4 bối cảnh mới (`hb_sets6.py`), cảnh `tools/hb/tt001_scene.py` 34 cảnh, QA ảnh tĩnh đủ 34. Bản thử render trên cloud 432×768/8 mẫu/step 2 (bóng 0.25) → `episodes/TT001/out/TT001_elijah.mp4` 76.54 s; check_cuts sạch, −16.7 LUFS, peak −2.0 dBFS. Chờ người dùng duyệt; bản cuối 1080×1920/64 mẫu chạy trên máy RTX (`finalize_timeline.py` không đối số → step 1).
