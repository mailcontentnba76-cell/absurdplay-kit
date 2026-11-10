# QA — E11 "Could the New Orleans Pelicans beat five actual pelicans?" (NBA, troll đội thua) — 10/11/2026
Bản giao: `giao/E11_pelicans_birds.mp4` (cảnh 3D render THẲNG 1080x1920 có motion blur, H.264 CRF 15 preset slow, AAC 256 kbps) + `giao/E11_pelicans_birds.kdenlive`.

| # | Chỉ số | Ngưỡng | Đo được | Kết quả |
|---|---|---|---|---|
| 1 | Khung hình | 1080x1920, 30 fps, H.264 yuv420p | 1080x1920, 30/1, h264 yuv420p, ~11 Mbps; AAC 256k | ĐẠT |
| 2 | Thời lượng | > 60 s | 67,9 s (2.036 khung) | ĐẠT |
| 3 | Lời bắt đầu | ≤ 0,1 s | 0,0 s | ĐẠT |
| 4 | Nhịp lời | 150–170 từ/phút | 180 (202 từ / 67,2 s) | KHÔNG ĐẠT — giọng v4 đọc nhanh hơn; giữ giọng gốc (quy ước từ E06) |
| 5 | Lặng > 0,35 s | 0 | 23 chỗ (≤ 0,62 s) | KHÔNG ĐẠT — giữ giọng gốc |
| 6 | Shot | 1,5–2,2 s | 32 shot + 3 cắt phụ / 67,9 s → trung bình 1,9 s | ĐẠT (theo trung bình) |
| 7 | Hook | khung 0 có xung đột thị giác | bồ nông ngậm bóng sà qua đầu Murray từ khung 0 (đặt theo hệ toạ độ máy quay) | ĐẠT |
| 8 | Bão hoà / sáng (HSV trung vị, có đồ hoạ) | 95–145 / 95–165 | 152 / 153 | GẦN ĐẠT (bão hoà +7 — trời hoàng hôn hồng tím, có chủ đích) |
| 9 | Phụ đề | chân chữ 1310 ±15 | 1314 (MarginV 606) | ĐẠT |
| 10 | Loudness | −14 ±1 LUFS, TP ≤ −1 | −14,0 LUFS, −1,5 dBFS | ĐẠT |
| 11 | Nhạc dưới lời | 8–12 dB | 12,5 dB (giọng −18,3 / nhạc −30,8 LUFS trước trộn) | GẦN ĐẠT |
| 12 | Số liệu có đồ hoạ | ≥ 80 % | 138–87, −51, 29/80, 8/28, +1, Curry 21 phút/25 điểm: đủ | ĐẠT |
| 13 | Nội dung | không logo, không đùa chấn thương | áo trắng chữ "NEW ORLEANS" không logo; không nhắc Zion/Trey Murphy (vắng do chấn thương); quan chức giải hư cấu | ĐẠT |
| — | Bố cục 9:16 | chủ thể giữa khung, trên phụ đề | lưới 40 khung: bảng điểm đủ chữ sau khi lùi máy; cận chim/người ở giữa | ĐẠT |
Đã sửa trong lúc QA: bồ nông cánh gập như que → khối cánh ôm thân; mặt nước như cát → phản chiếu tối; bảng điểm bị cắt mép (khung dọc hẹp) → lùi máy ~10 m; máy đứng sau lưng Queen/chim → đổi sang trước; khung 0 không thấy chim → đặt đường bay theo máy quay. Không có clip Mixamo bóng rổ trong phiên → thế Basketball_Idle/Defense_Shuffle bằng Idle + Crouch ghép IK tay.
Chưa nghe bằng tai — chủ dự án nghe kiểm. Số liệu "Monday" (09/11 giờ Mỹ) → nên đăng trước trận kế của Pelicans.

## Tiêu đề / caption (tiếng Anh)
1. Could the New Orleans Pelicans beat five actual pelicans? 🦤🏀
2. They lost by 51 on Monday. So we gave them an easier opponent.
3. Pelicans vs pelicans. Only one team keeps the name.

Hashtag: #NBA #Pelicans #NewOrleans #Warriors #whatif #sportscomedy #bayou
