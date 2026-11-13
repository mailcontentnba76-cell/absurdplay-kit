# QA — E15 "Could the Thunder beat the Blazers if the game was played in a giant rose garden?" (NBA, troll đội thua, cả 2 đội) — 13/11/2026
Bản giao: `giao/E15_thunder_rose_garden.mp4` (render THẲNG 1080x1920, **không** motion blur — xem ghi chú) + `giao/E15_thunder_rose_garden.kdenlive`.

| # | Chỉ số | Ngưỡng | Đo được | Kết quả |
|---|---|---|---|---|
| 1 | Khung hình | 1080x1920, 30 fps, H.264 | 1080x1920, 30/1, h264; AAC | ĐẠT |
| 2 | Thời lượng | > 60 s | 71,5 s (2.145 khung 3D + 2.145 khung đồ hoạ, 0 lỗi pageerror) | ĐẠT |
| 3 | Lời bắt đầu | ≤ 0,1 s | 0,0 s | ĐẠT |
| 4 | Nhịp lời | 150–170 từ/phút | 166 (196 từ / 70,8 s) | ĐẠT |
| 5 | Lặng > 0,35 s | 0 | 28 chỗ (≤ 0,66 s) | KHÔNG ĐẠT — giữ giọng gốc (quy ước từ E06) |
| 6 | Shot | 1,5–2,2 s | 28 shot + 8 cắt phụ / 71,5 s → trung bình 2,0 s | ĐẠT |
| 7 | Hook | khung 0 có xung đột thị giác | "WTF?!" + Gilgeous-Alexander lao xuyên tường giậu về ống kính, lá + cánh hoa văng từ khung 0; bíp chữ "heck" | ĐẠT |
| 8 | HSV trung vị (24 khung, có đồ hoạ) | S 95–145 / V 95–165 | S 149 / V 226 | KHÔNG ĐẠT có chủ đích — vườn hoa trưa nắng, trời sáng (rất tươi, rất sáng) |
| 9 | Loudness | −14 ±1 LUFS, TP ≤ −1 | −14,0 LUFS, −1,5 dBFS, LRA 2,1 | ĐẠT |
| 10 | Nhạc dưới lời | 8–12 dB | 12,0 dB (giọng −19,4 / nhạc −31,4 LUFS trước trộn) | ĐẠT |
| 11 | Số liệu có đồ hoạ | ≥ 80 % | 123–103, 118–108 (×2), 0–2, nghỉ giữa trận 56–50, Q4 OKC 90–88, SGA 31, Avdija 28, Lillard 18, "20 of Portland's 30", 8–3: đủ | ĐẠT |
| 12 | Nội dung | không logo, không đùa chấn thương | áo chữ "OKLAHOMA CITY"/"PORTLAND", không logo; không diễn biến từng pha; KHÔNG nhắc lỗi kỹ thuật HLV và chấn thương | ĐẠT |
| — | Bố cục 9:16 | chủ thể giữa khung | lưới 40 khung đã xem: chủ thể giữa khung; vài thẻ đồ hoạ trùng bảng điểm giàn hoa phía sau (vẫn đọc được); dải s18 đã xem: Cissoko lên rổ, SWISH trong shot | ĐẠT (lưu ý nhỏ) |

Nguồn số liệu: box score chính thức ESPN (event 401909965 ngày 10/11, 401909975 ngày 11/11) + tin AP (Avdija và Lillard ghi 20/30 điểm hiệp 4; OKC từng dẫn ở hiệp 4) — NBA.com chặn truy cập trong phiên.
Đã sửa trong lúc dựng: da SGA/Lillard/Cissoko/Camara quá tối, áo OKC quá tối, cỏ xuyên mặt sân (z-fighting), khung s12/s17/s18b/s22a/s24/s25/s27b/s28, rút đoạn chạy của Cissoko để bóng vào rổ trong s18.
Ghi chú render: bản có motion blur mất ~33 s/khung ở các cảnh nhiều cánh hoa (≈14 giờ) nên render lại toàn bộ với `#nomb` (2,9 s/khung) cho đồng đều.
Chưa nghe bằng tai — chủ dự án nghe kiểm.

## Tiêu đề / caption (tiếng Anh)
1. Could the Thunder beat the Blazers if the game was played in a giant rose garden? 🌹🏀
2. Hedges. Tulips. A giant lawnmower. Portland still won 118–108.
3. OKC moved the rematch into a rose garden. Same score as last night.

Hashtag: #NBA #Thunder #Blazers #OKC #Portland #whatif #sportscomedy
