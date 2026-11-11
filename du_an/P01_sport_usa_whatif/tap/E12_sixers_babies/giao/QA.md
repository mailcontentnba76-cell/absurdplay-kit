# QA — E12 "Could the Philadelphia 76ers beat 50 babies in a playoff game?" (NBA, đội vs N đối thủ yếu) — 11/11/2026
Bản giao: `giao/E12_sixers_babies.mp4` (render THẲNG 1080x1920 có motion blur, H.264, AAC) + `giao/E12_sixers_babies.kdenlive`.

| # | Chỉ số | Ngưỡng | Đo được | Kết quả |
|---|---|---|---|---|
| 1 | Khung hình | 1080x1920, 30 fps, H.264 | 1080x1920, 30/1, h264; AAC | ĐẠT |
| 2 | Thời lượng | > 60 s | 76,9 s (2.304 khung, 0 lỗi pageerror) | ĐẠT |
| 3 | Lời bắt đầu | ≤ 0,1 s | 0,0 s | ĐẠT |
| 4 | Nhịp lời | 150–170 từ/phút | 160 (203 từ / 76,2 s) | ĐẠT |
| 5 | Lặng > 0,35 s | 0 | 29 chỗ (≤ 0,80 s) | KHÔNG ĐẠT — giữ giọng gốc (quy ước từ E06) |
| 6 | Shot | 1,5–2,2 s | 38 shot + 4 cắt phụ / 76,9 s → trung bình 1,8 s | ĐẠT |
| 7 | Hook | khung 0 có xung đột thị giác | "WTF?!" + 3 cầu thủ 76ers đối diện đám em bé hồng từ khung 0, bíp chữ "heck" | ĐẠT |
| 8 | HSV trung vị (40 khung, có đồ hoạ) | S 95–145 / V 95–165 | S 127 / V 195 | GẦN ĐẠT (sáng hơn — nhà thi đấu đèn trắng + sàn gỗ ấm, có chủ đích) |
| 9 | Loudness | −14 ±1 LUFS, TP ≤ −1 | −14,0 LUFS, −1,5 dBFS, LRA 2,5 | ĐẠT |
| 10 | Nhạc dưới lời | 8–12 dB | 12,6 dB (giọng −18,2 / nhạc −30,8 LUFS trước trộn) | GẦN ĐẠT |
| 11 | Số liệu có đồ hoạ | ≥ 80 % | 9–2, 2001 (25 năm), NYK 4–0 PHI (2024), 0–0 hiệp 1, 2–0 chung cuộc, 44–66 lịch đối thủ: đủ | ĐẠT |
| 12 | Nội dung | không logo, không đùa chấn thương | áo xanh chữ "PHILADELPHIA" / áo hồng "BABIES", không logo; không nhắc chấn thương Embiid; người phát ngôn + chương trình bình luận hư cấu (ghi "FICTIONAL") | ĐẠT |
| — | Bố cục 9:16 | chủ thể giữa khung | lưới 40 khung: cận em bé/cầu thủ ở giữa; màn hình "LAST CONFERENCE FINALS" phòng phân tích hơi sát mép (số "2001" đầy đủ) | ĐẠT (lưu ý nhỏ) |

Đã sửa trong lúc QA: áo em bé chìm màu → hồng đậm viền đỏ sẫm; sàn gỗ ấm hơn, sơn xanh đậm hơn; máy quay lọt vào giữa đám em bé (s11, s21–s23) → dời; bảng jumbotron đảo thông số → sửa; phòng họp báo ghi "SIGNING DAY" → "POSTGAME".
Không có clip Mixamo bóng rổ trong phiên → dẫn bóng/ném dùng `bongro_mx` + IK tay trên Idle/Crouch.
Chưa nghe bằng tai — chủ dự án nghe kiểm. Sau tập này 76ers thua Celtics 101–123 (10/11 giờ Mỹ, nay 9-3); câu "Philly started nine and two" vẫn đúng.

## Tiêu đề / caption (tiếng Anh)
1. Could the Philadelphia 76ers beat 50 babies in a playoff game? 👶🏀
2. 9-2 start. Last conference finals: 2001. So we booked them an easy playoff series.
3. Sixers vs 50 babies. The babies are undefeated.

Hashtag: #NBA #76ers #Sixers #Philadelphia #whatif #sportscomedy #babies #playoffs
