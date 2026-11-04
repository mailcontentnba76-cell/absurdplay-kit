# E04 — Eagles vs 11 inflatable tube men (NFL) — trạng thái 04/11, 23:35

Kịch bản đã duyệt: https://claude.ai/artifact/AVhuNcGqUhBqkVKC94j5GE

## Đã xong
- Giọng: giong/goc.mp3 (51,12 s) → am_thanh/giong.wav 49,09 s → words.json, words_tw.json. Mốc shot: engine/ep04_shots.js (18 shot + SUB).
- Engine mới: lib/baixe.js (bãi xe ban ngày, xe, dây cờ, showroom, biển khuyến mãi), lib/nguoihoi.js (người hơi vẫy tay: ống dựng lại mỗi khung, amp/fold/lean/armReach),
  lib/bongbau.js thêm EAGLES/CAST4 (Barkley #26 1,83 m, McKee #16 1,98 m, Elliott #4 1,75 m), knockedDown, runCarry, celebrate.
- ep04.html, ep04_gfx.html (tờ rơi bán xe), tron_am_thanh.py (nhạc alvana upbeat/bouncing), chu/phu_de.ass, do_hoa/do_hoa.mov.
- Bản cắt thử giao/E04_cat_thu.mp4 đã gửi người dùng — CHỜ DUYỆT.

## Còn lại
1. (Đã hứa) Shot 13 (sút trúng cột) và shot 14 (người hơi ôm bóng chạy): máy gần hơn, bóng to hơn (football(0.34) cho 2 shot này).
2. Sau khi duyệt: render đủ `node render.js ep04.html out_f4 30 0 737 720 1280` + `... 737 1473 720 1280` (2 tiến trình, ~50 phút)
   → hinh.mp4 (lanczos 1080x1920, eq=saturation=0.86:brightness=0.02, unsharp) → tao_kdenlive.py mo_ta.json giao/E04_eagles_tube_men.kdenlive → melt → loudnorm 2 lượt → QA.md.
3. Giao + 3 tiêu đề viral + hashtag; cập nhật bảng "đã dùng" (E04 | NFL | Eagles 2–6 | 11 người hơi | bãi xe ban ngày | alvana upbeat/bouncing); push GitHub.
Nếu máy mới không có thư mục: clone absurdplay-kit, cài node_modules engine (npm i), tải lại thư viện âm thanh theo tai_nguyen/am_thanh/README.md.
