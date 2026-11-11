# QA — E13 "Could the 76ers beat the Celtics if Boston played in swim flippers?" (NBA, troll đội thua, cả 2 đội) — 11/11/2026
Bản giao: `giao/E13_celtics_flippers.mp4` (render THẲNG 1080x1920 có motion blur, H.264, AAC) + `giao/E13_celtics_flippers.kdenlive`.

| # | Chỉ số | Ngưỡng | Đo được | Kết quả |
|---|---|---|---|---|
| 1 | Khung hình | 1080x1920, 30 fps, H.264 | 1080x1920, 30/1, h264; AAC | ĐẠT |
| 2 | Thời lượng | > 60 s (~65 s) | 68,6 s (2.056 khung, 0 lỗi pageerror) | ĐẠT |
| 3 | Lời bắt đầu | ≤ 0,1 s | 0,0 s | ĐẠT |
| 4 | Nhịp lời | 150–170 từ/phút | 155 (174 từ / 67,5 s) | ĐẠT |
| 5 | Lặng > 0,35 s | 0 | 34 chỗ (≤ 0,80 s) | KHÔNG ĐẠT — giữ giọng gốc (quy ước từ E06) |
| 6 | Shot | 1,5–2,2 s | 35 shot + 3 cắt phụ / 68,5 s → trung bình 1,8 s | ĐẠT |
| 7 | Hook | khung 0 có xung đột thị giác | "WTF?!" + Paul George đi chân vịt xanh lao về ống kính từ khung 0, bíp chữ "heck" | ĐẠT |
| 8 | HSV trung vị (40 khung, có đồ hoạ) | S 95–145 / V 95–165 | S 162 / V 159 | GẦN ĐẠT (bão hoà cao hơn — áo xanh lá/xanh dương + áo phao cam, có chủ đích) |
| 9 | Loudness | −14 ±1 LUFS, TP ≤ −1 | −14,0 LUFS, −1,5 dBFS, LRA 2,0 | ĐẠT |
| 10 | Nhạc dưới lời | 8–12 dB | 12,2 dB (giọng −18,8 / nhạc −31,0 LUFS trước trộn) | GẦN ĐẠT |
| 11 | Số liệu có đồ hoạ | ≥ 80 % | 123–101, +22, +1, +29, George 36, 9–3, Brown trận đầu gặp đội cũ: đủ | ĐẠT |
| 12 | Nội dung | không logo, không đùa chấn thương | áo chữ "BOSTON"/"PHILADELPHIA", không logo; không diễn biến từng pha (theo yêu cầu); không chấn thương | ĐẠT |
| — | Bố cục 9:16 | chủ thể giữa khung | lưới 40 khung: chủ thể giữa khung; vài khung xuồng hơi sát đáy (chữ "BOSTON" mạn xuồng vẫn đọc được) | ĐẠT (lưu ý nhỏ) |

Nguồn số liệu: box score chính thức ESPN (event 401909961) + tin ESPN "1st post-trade matchup" — NBA.com chặn truy cập trong phiên.
Đã sửa trong lúc QA: áo phao nổi trên đầu (scale gốc 1,12) → gắn thẳng vào xương; khung s7/s8/s9/s19/s22/s25/s27b/s28/s34/s35 chỉnh lại.
Chưa nghe bằng tai — chủ dự án nghe kiểm.

## Tiêu đề / caption (tiếng Anh)
1. Could the 76ers beat the Celtics if Boston played in swim flippers? 🩴🏀
2. Flippers. Life jackets. A canoe. Boston still won by 22.
3. Philly asked for a rematch with a few small changes. It did not help.

Hashtag: #NBA #Celtics #76ers #Sixers #Boston #Philadelphia #whatif #sportscomedy
