# TỔNG HỢP 14 VIDEO MẪU — kênh TikTok @oddtilt (series "How you invented …")
Dự án P02 · 05/11/2026 · Claude · Nguồn: 14 file mp4 chủ dự án tải lên Release `mau-oddtilt` (yêu cầu ban đầu là video 1–26; nhận 14 video, thứ tự trên kênh chưa biết).
Nhãn: [QS] quan sát · [ĐO] đo · [SL] suy luận. Chi tiết từng video: `01_ghe.md` … `14_bong_ro.md`.

> **Giới hạn quan trọng:** Claude không nghe được âm thanh trong môi trường này. Mục Âm thanh chỉ có số đo tín hiệu; chưa có danh sách SFX/nhạc theo mốc. Lời thoại là bản ASR (Parakeet-TDT 0.6B v2) chưa sửa tay. Số view/like/ngày đăng: không có dữ liệu.

## 0. Danh sách mẫu
| # | File phân tích | Đồ vật | Dài (s) | Từ/phút | Shot | Shot trung vị (s) | Vòng vấn đề | Kết |
|---|---|---|---|---|---|---|---|---|
| 01 | 01_ghe | ghế | 35,7 | 183 | 10 | 3,53 | 4 | Congratulations |
| 02 | 02_dieu_hoa | điều hoà | 34,3 | 221 | 11 | 2,77 | 5 | "Now your friend comes inside" |
| 03 | 03_bao_thuc | đồng hồ báo thức | 36,6 | 206 | 20 | 1,63 | 5 | "whole town wakes up with you" |
| 04 | 04_but_bi | bút bi | 46,3 | 208 | 17 | 2,70 | 3 | Congratulations |
| 05 | 05_giuong | giường | 30,4 | 222 | 8 | 3,54 | 4 | "friend loves sleeping with you" |
| 06 | 06_canh_cua | cửa | 33,2 | 219 | 14 | 2,69 | 5 | "friend can come inside" |
| 07 | 07_quat | quạt | 30,2 | 218 | 3 | 4,70 | 4 | "blow your friend all day" |
| 08 | 08_kep_hat | kẹp hạt | 47,5 | 187 | 16 | 2,50 | 5 | Congratulations |
| 09 | 09_lo_quay | lò quay gà | 39,6 | 194 | 8 | 4,85 | 5 | "comes out moist every time" |
| 10 | 10_voi_sen | vòi sen | 47,1 | 235 | 17 | 2,90 | 4 | Congratulations |
| 11 | 11_thuoc_cuon | thước cuộn | 50,1 | 210 | 16 | 3,06 | 3 | Congratulations |
| 12 | 12_bon_cau | bồn cầu xả | 51,1 | 204 | 2 | (máy liền) | 4 | Congratulations |
| 13 | 13_cai_o | ô | 61,6 | 197 | 14 | 4,54 | 7 | Congratulations |
| 14 | 14_bong_ro | bóng rổ | 34,6 | 221 | 18 | 1,86 | 6 | "friend loves playing with your balls" |
(từ/phút, shot: [ĐO]; xem từng file để biết cách đo)

## 1. Bảng đặc điểm chung
| Đặc điểm | Có ở bao nhiêu mẫu | Dải (min / trung vị / max) | Quy tắc đề xuất | Ngưỡng QA đề xuất |
|---|---|---|---|---|
| Khung 9:16, 720×1280 (bản tải) | 14/14 [ĐO] | — | Xuất 1080×1920 [CHỌN: TikTok nhận 1080p; mẫu tải về chỉ là 720p] | đúng 1080×1920 |
| fps | 13/14 là 30, 1 video 24 [ĐO] | — | 30 fps | 30 |
| Thời lượng | 14/14 [ĐO] | 30,2 / 38,1 / 61,6 s | 30–50 s, mặc định ~38 s | 28–62 s |
| Lời bắt đầu | 14/14 ≤ 0,32 s [ĐO] | 0,0 / 0,0 / 0,32 s | Lời ngay khung đầu | ≤ 0,3 s |
| Tốc độ lời | 14/14 [ĐO] | 183 / 212 / 240 từ/phút | ~210 từ/phút, không lặng | 185–235 từ/phút |
| Khoảng lặng > 0,35 s | 0 ở 14/14 [ĐO] | 0 | Không để khoảng lặng | 0 |
| Ngôi kể "you" (người xem là nhà phát minh) | 14/14 [ĐO lời] | — | Bắt buộc | — |
| Cụm "being a genius caveman/inventor" hoặc "genius mind" | 11/14 [ĐO] | ở 6 / 12 / 80 % | Đặt trong 3–12 % đầu | có |
| Vòng "But/Except → so you …" | 14/14 [ĐO] | 3 / 4,5 / 7 vòng; chu kỳ 4,9 / 6,9 / 12,5 s | 4–5 vòng, mỗi vòng 5–8 s | ≥ 3 vòng |
| Câu khen ngắn chen giữa ("Clever!", "Genius!", "Much better!", "Lovely.") | 14/14 [ĐO] | 1–3 lần | Sau giải pháp thứ 1 và thứ 3 | ≥ 1 |
| Leo thang phi lý (nhà máy hạt nhân, laser, quả tạ phá nhà, PC chơi game…) | 7/14 trong lời [ĐO lời] (hạt nhân: 4/14); tháp làm mát hạt nhân trong hình: 8/14 [QS] | 33–90 % | 1 giải pháp phi lý ở nửa sau (biến thể mạnh, chưa đạt 70 %) | — |
| Kết "Congratulations! You've invented the X!" | 7/14 [ĐO] | ở 92 / 93 / 95 % | Kiểu kết A | — |
| Kết câu "Now your friend …/Now you can …" nước đôi | 7/14 [ĐO] | câu cuối | Kiểu kết B (chơi chữ, khuyến khích chia sẻ) | — |
| Hook thô tục hoặc nước đôi ("Your ass is sweaty", "You love nuts", "Your tip runs dry", "You love your cock", "You smell like shit") | 14/14 [ĐO lời] | câu đầu | Theo yêu cầu chủ dự án (xem câu hỏi mục 6) | — |
| Từ thô (ass, shit, dumbass) | 8/14 [ĐO lời]; "fucking" 4/14 (giường, cửa, quạt, thước) | — | Chờ chủ dự án quyết | — |
| Phụ đề trắng chữ đậm bo tròn, viền/bóng tối, căn giữa | 14/14 [QS] | tâm y = 766–768 px / 1280 (≈ 60 %) [ĐO, 13 video] | tâm y ≈ 60 % chiều cao | 58–62 % |
| Cao dải chữ | 13/13 đo được [ĐO] | 36 / 42 / 43 px trên khung 1280 | ≈ 3,3 % chiều cao (≈ 63 px ở 1920) | 3,0–3,6 % |
| Số từ mỗi cụm phụ đề | 13/13 [ĐO] | trung vị 2 (1 từ ~16–27 %, 2 từ ~35–55 %, ≥ 3 từ ~27–44 %) | 1–3 từ, trung vị 2, hiện cả cụm, 1 khung trống giữa cụm | ≤ 3 từ ở ≥ 85 % cụm |
| Từ nhấn viết HOA (LOVE, FUCKING) | ≥ 5/14 [QS] | — | Viết hoa 1 từ cảm xúc | — |
| Icon 2D phủ lên 3D (tim, Zzz, mồ hôi, sóng mùi xanh, vòng âm thanh, mũi tên cong, viền highlight xanh lá, confetti) | 14/14 có ít nhất 1 loại [QS] | — | Bắt buộc ≥ 2 loại/video | — |
| Shot | 14/14 [ĐO] | 2 / 14 / 20 shot; trung vị toàn bộ 174 shot = 2,75 s | 10–18 shot, trung vị 2,5–3,5 s | trung vị 1,6–4,9 s |
| Chuyển cảnh | cắt cứng ở 12/14; máy chạy liền/whip pan thay cắt ở 2/14 (quạt, bồn cầu) [QS] | — | Cắt cứng; không hoà hình, không lóa | — |
| Máy quay | 14/14 [ĐO optical flow] | đứng yên 4 / 19 / 82 %; đẩy vào 6 / 39 / 78 % | Máy trôi/đẩy chậm trong shot người; đứng/quay quanh vật trong shot cơ chế | đứng yên ≤ 50 % (trừ video chỉ vật) |
| Màu | 14/14 [ĐO] | bão hoà 33 / 70 / 158; sáng 80 / 127 / 221 (HSV 0–255) | Ánh sáng ban ngày, màu tự nhiên, không chỉnh màu mạnh | bão hoà 60–130; sáng 95–165 |
| Loudness bản tải về | 14/14 [ĐO] | −16,1 / −16,1 / −16,0 LUFS; TP −2,1 / −1,7 / −0,5 dBFS | Xuất −14 LUFS, TP ≤ −1 [CHỌN: chuẩn TikTok thường dùng; bản tải về đã bị nền tảng chuẩn hoá] | −14 ± 1 LUFS |
| Âm thanh gần mono | 14/14 [ĐO] | Side−Mid −23,5 / −21,5 / −18,9 dB | Lời mono ở giữa | ≤ −18 dB |
| Nền dưới lời (giữa câu) | 14/14 [ĐO] | thấp hơn lời 9 / 16 / 20 dB | Nền (nhạc nhẹ/ambience/SFX) thấp hơn lời ~16 dB | 12–20 dB |
| Nhịp trống đều | 0/14 [ĐO: tự tương quan onset 0,06–0,11] | — | [SL] Không có nhạc beat rõ → nhạc rất nhẹ hoặc không nhạc; **cần chủ dự án nghe xác nhận** | — |
| Giọng | 14/14 một giọng kể [SL] | F0 117 / 170 / 211 Hz [ĐO, có thể lẫn nền] | Một giọng nam năng lượng cao, nhanh [SL — chưa nghe] | — |

## 2. Quy tắc chung (≥ 70 % mẫu)
1. **Công thức lời** (14/14): `[Hook: vấn đề cá nhân, ngôi you, thường nước đôi] → so you, being a genius caveman, [giải pháp thô sơ] → (khen) → But/Except [lỗi mới] → so you [cải tiến] → … ×3–6 → [giải pháp phi lý ở nửa sau] → Kết A "Congratulations! You've invented the X!" hoặc Kết B "Now your friend …" nước đôi`.
2. **Mỗi vòng = một bước có thật trong lịch sử/cơ chế của đồ vật** (lò xo túi, van tự đóng, ống chữ U, phao, nan ô có khớp, bi lăn mực…). Phần "giáo dục" là thật, phần gag là cách vấp lỗi và câu nói [QS].
3. **Người thứ hai** (friend / neighbor / stranger) gây ra ít nhất một vòng vấn đề ở 8/14 video [ĐO lời] và là đích của câu kết nước đôi ở 5/14.
4. **Hình minh hoạ đúng từng câu**: đổi shot khi đổi bước; vật biến hình tức thời theo lời [QS].
5. **3D bán tả thực kiểu tài sản game**, nhân vật cử động cứng, ánh sáng ban ngày, bối cảnh đơn giản; đồ hoạ 2D chồng lên để truyền cảm xúc [QS].
6. **Phụ đề trắng 1–3 từ, giữa màn hình ở ~60 % chiều cao**, hiện cả cụm, từ cảm xúc viết hoa [ĐO + QS].
7. **Lời liên tục ~210 từ/phút, không khoảng lặng; nền thấp hơn lời ~16 dB** [ĐO].

## 3. Biến thể
| Biến thể | Mẫu | Khi nào dùng |
|---|---|---|
| Người tiền sử, làng hang đá | 01, 02, 03, 05, 07, 10 | Đồ vật cổ / đời sống cơ bản |
| Người hiện đại, bối cảnh nhà/bếp/sân (lời vẫn có thể gọi "caveman") | 04, 06, 08, 09, 11, 13, 14 | Đồ vật hiện đại, cần đạo cụ đời thường |
| Chỉ vật + mặt cắt (cutaway), máy chạy liền, không nhân vật toàn thân | 12 | Đồ vật có cơ chế ẩn (ống, bể, van) |
| Kết A (Congratulations) | 01, 04, 08, 10, 11, 12, 13 | Video dài hơn (35–62 s), thiên giáo dục |
| Kết B (câu nước đôi về friend) | 02, 03, 05, 06, 07, 09, 14 | Video ngắn (30–40 s), thiên gag |

## 4. Vì sao hiệu quả [SL, gắn mốc ĐO]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu nói ngay từ 0,0 s, là vấn đề ai cũng gặp nhưng nói thô/nước đôi → bất ngờ + tò mò; hình đã có nhân vật đang làm hành động kỳ quặc | lời ≤ 0,32 s ở 14/14 | [ĐO] mốc, [SL] tác dụng |
| 3–10 s | "being a genius caveman" tự giễu → định vị tông hài; giải pháp 1 thô sơ ngay | 6–12 % thời lượng | [ĐO] |
| Giữa | Vòng lặp vấn đề–giải pháp mỗi ~7 s: luôn có câu hỏi mở ("lỗi tiếp theo là gì?") và một hình mới; người xem học được cơ chế thật | chu kỳ 4,9–12,5 s | [ĐO] mốc, [SL] tác dụng |
| Nửa sau | Leo thang phi lý (hạt nhân, laser, phá nhà) phá kỳ vọng; tháp hạt nhân lặp lại thành "trò đùa riêng của kênh" | 50–90 % | [QS] |
| Kết | Kết A cho cảm giác "hoàn thành" (tên đồ vật = đáp án); Kết B là câu nước đôi dễ gắn thẻ bạn bè → chia sẻ/bình luận (tên file 14 chính là caption kêu gọi chia sẻ) | 92–95 % hoặc câu cuối | [ĐO] mốc, [SL] tác dụng |
| Toàn video | Ngắn 30–50 s, lời liền → dễ xem lại; phụ đề lớn giữa màn hình đọc được khi tắt tiếng | — | [SL] |

## 5. Khó tái tạo nhất (đưa vào bản thử G6)
1. Dựng 3D nhiều bối cảnh + đạo cụ cơ khí biến hình theo từng câu (mỗi video 8–20 shot, nhiều đạo cụ riêng).
2. Nhân vật người bán tả thực có hoạt ảnh hành động (ngồi, ngã, quay tay, ném bóng).
3. Giọng kể nhanh ~210 từ/phút vẫn rõ chữ.
4. Đồng bộ phụ đề cụm 2 từ + icon 2D đúng mốc.

## 6. Chưa chắc — cần chủ dự án xác nhận
1. Nhạc/SFX: Claude không nghe được. Chủ dự án nghe 2–3 video và cho biết: có nhạc nền không, loại gì; SFX có dày không.
2. Giọng: nam hay nữ, thật hay TTS, cùng một người ở mọi video không (F0 có hai nhóm ~120–135 Hz và ~155–210 Hz [ĐO]).
3. Mức thô tục/nước đôi và chửi thề: giữ như mẫu, giảm, hay sạch hoàn toàn.
4. Ngôn ngữ video của dự án: tiếng Anh như mẫu hay tiếng Việt.
5. 12 video còn thiếu (13–26) có cần bổ sung không.
