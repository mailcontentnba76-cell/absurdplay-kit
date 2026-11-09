# Trạng thái dự án — nhánh NBA (cập nhật 09/11/2026)

| Mục | Nội dung |
|---|---|
| Tập NBA đã giao | **E10 "Could 38-year-old Steph Curry outshoot the English archers at the Battle of Agincourt?"** — 77,4 s, render thẳng 1080x1920, mở đầu mưa tên (09/11) · **E09 "Could the four worst teams in the NBA beat 5 traffic cones?"** — 68 s, render thẳng 1080x1920 (09/11) · **E08 "Could Victor Wembanyama beat 5 giraffes?"** — 68,5 s, 1080x1920, QA đạt (trừ khoảng nghỉ giọng gốc, theo yêu cầu) |
| Hạ tầng mới | `lib/thaonguyen.js` (thảo nguyên + hươu cao cổ), `lib/bongro_mx.js` (jump shot, úp rổ, layup, dẫn bóng, bắt bóng bật bảng, chặn bóng, nhún vai — ghép mocap), `lib/cast8.js` (Wembanyama), `lib/chientruong.js` (chiến trường 1415, cung thủ, mưa tên, ngựa chiến huy hiệu, đại sảnh), `lib/cast10.js` (Curry, tu sĩ, vua, kỵ sĩ + bộ giáp `knightKit`), mua.js có tham số |
| Mạng đã mở | huggingface (+ lưu trữ), espn, nba.com, pikaso.cdnpk.net (tải giọng Magnific) |
| Thư viện âm | alvana-audio + sfx-kit (tải lại mỗi phiên: `git clone --depth 1`), magnific_sfx trong repo |
| Bước tiếp theo | Chủ dự án nghe/xem E10, đăng sớm (số liệu Curry còn mới); tập NBA kế tiếp: nói "NBA" → danh sách chủ đề mới |
| Tuỳ chọn còn mở | Mixamo bóng rổ (nếu có thì thay động tác ghép); quyết "Down one" (giữ) |
