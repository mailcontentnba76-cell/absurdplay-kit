# PHÂN TÍCH VIDEO MẪU 15 — How you invented the golf ball (VIRAL)
File: `mau_goc/How.you.invented.the.golf.ball.mp4` (chủ dự án gửi 07/11/2026, ghi chú "đang rất viral") · 720×1280, 30 fps, 31,47 s
Ngày: 07/11/2026 · Người phân tích: Claude · Công cụ: ffprobe, ffmpeg (ebur128, scene, silencedetect), OpenCV (optical flow, histogram HSV), Parakeet-TDT qua sherpa-onnx, lưới 2 khung/giây + dải 10 khung/giây
Nhãn: **[QS]** quan sát bằng mắt · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng
> Giới hạn: Claude không nghe được âm thanh; nhạc/SFX chỉ dựa trên số đo.

## 1. Lời (Parakeet, mốc câu) [ĐO]
| t (s) | Câu | Vai trò |
|---|---|---|
| 0,00 | Your brass balls are too heavy, so you make a new ball out of bouncy rubber instead. | HOOK nước đôi ("balls") + giải pháp 1 |
| 4,32 | Clever! | khen 1 |
| 5,20 | Now when you hit it, the ball squishes against the club and springs back, launching it farther. | giải thích cơ chế (khoa học thật) |
| 9,84 | Except the soft rubber gets torn up after a few swings, so you wrap it in a tough outer shell. | lỗi 2 → cải tiến 2 |
| 15,04 | Genius! | khen 2 |
| 15,92 | But your next shot still lands short, and some fucking old man has the audacity to stand in the way. | lỗi 3 + "fucking" + nạn nhân ngẫu nhiên |
| 21,04 | So you carve hundreds of little dimples into the surface of your ball. | cải tiến 3 |
| 24,32 | Now, the air stays closer to it as it flies, leaving a smaller wake behind it. | giải thích khoa học (dòng khí) |
| 28,16 | That means less drag, so now your balls are aerodynamic! | KẾT: gọi lại "your balls" nước đôi |
- 115 từ, **219 từ/phút** [ĐO], lời bắt đầu 0,00 s, không khoảng lặng > 0,25 s trừ 0,26 s cuối [ĐO].
- 3 vòng lỗi→sửa, 2 câu khen, 2 câu "Now …" giải thích cơ chế, 1 lần "fucking" [ĐO].
- **Không có "caveman"**: bối cảnh hiện đại, ngôi "you" [QS].

## 2. Cắt cảnh & máy [ĐO + QS]
Điểm cắt (scene > 0,12): 6,50 · 8,17 · 9,97 · 10,63 · 11,57 · 12,63 · 12,83 · 15,97 · 17,47 · 21,00 · 24,47 · 29,63 → **15 shot, trung vị 1,53 s, trung bình 2,10 s** [ĐO]. Khung đứng yên (flow < 0,15 px) 26 % [ĐO] — chủ yếu ở shot macro.
| t | Shot [QS] |
|---|---|
| 0–1,0 | MACRO mặt đất: đầu gậy + bóng đồng, nền mờ chân người (DOF nông) |
| 1,0–2,5 | toàn thân người chơi vào thế đánh, góc ¾ thấp, cây ô-liu + trời xanh |
| 2,5–4,5 | MACRO: bóng đồng **biến** thành bóng cao su đỏ, gậy đánh, bóng nảy lên |
| 4,5–6,5 | trung cảnh ¾ người chơi swing, bóng đỏ trên tee |
| 6,5–8,0 | **SIÊU MACRO bóng đỏ bẹp méo khi chạm gậy** (squash) rồi bật ra |
| 8,0–10,0 | rộng: người swing → máy **bay theo** bóng lên trời, quay về sau lưng nhân vật |
| 10–13 | MACRO: bóng đỏ bị rách dần (texture lồi lõm, mảnh văng) |
| 13–15,5 | MACRO: **2 nửa vỏ trắng khép lại** bọc bóng đỏ → bóng trắng |
| 16–17,5 | người swing, máy theo sau lưng |
| 17,5–21 | rộng: ông già mặc vest đứng giữa sân → **bị bóng trúng, ngã ngửa ragdoll**, nằm vẫy tay |
| 21–24,4 | MACRO bóng trắng: **lỗ dimple xuất hiện dần** theo lời "hundreds of little dimples" |
| 24,4–29,6 | bóng bay giữa **đường dòng khí trắng 3D** (streamlines) uốn quanh bóng, máy trượt ngang; nền tháp làm mát hạt nhân |
| 29,6–31,5 | rộng: bóng lăn vào lỗ cờ đỏ — "aerodynamic!" |
- Nhịp: macro vật ↔ rộng người xen kẽ; máy luôn trôi chậm hoặc bám theo vật bay [QS].
- Tỷ lệ thời lượng macro đồ vật ≈ 50 % (≈ 15,5/31 s) [QS].

## 3. Màu & ánh sáng [ĐO + QS]
- Bão hoà trung bình 78 (HSV) [ĐO]. Nền trung tính tự nhiên: cỏ xanh lục dịu, trời xanh nhạt, cây ô-liu xám xanh [QS].
- **Một vật nhấn màu duy nhất: bóng cao su đỏ** (sau đó trắng) — mắt đi thẳng vào phát minh [QS].
- Nhân vật trung tính: áo thun trắng + quần jean xanh; ông già vest xanh than [QS].
- Nắng ban ngày mềm, bóng đổ rõ; macro có DOF nông + mờ xa [QS].

## 4. Chuyển động & gag [QS]
- Gag vật lý chính: nạn nhân ngẫu nhiên (ông già) ngã ngửa ragdoll, giữ ~2 s cảnh nằm.
- Biến hình vật: squash & stretch bóng đỏ, rách dần, vỏ khép, dimple mọc dần — mỗi cải tiến được **cho thấy bằng biến đổi của chính đồ vật**.
- Đồ hoạ khoa học: streamlines trắng mảnh, chuyển động liên tục, giải thích "less drag".
- Mở đầu **không** có mặt hài: hook là chữ nước đôi + macro đồ vật [QS].

## 5. Âm thanh [ĐO]
- −12,1 LUFS, LRA 2,6 LU; gần như không có lặng (nhạc nền liên tục dưới lời) [ĐO].

## 6. Bài học cho P02 [SL]
1. Hook chơi chữ trên tên đồ vật ("balls") + câu kết gọi lại đúng chữ đó = vòng kín, dễ share ("Share this with someone who loves balls").
2. Đồ vật là nhân vật chính hình ảnh: ~50 % thời lượng macro, mỗi cải tiến = 1 biến hình nhìn thấy được.
3. Một lần "đồ hoạ khoa học" (dòng khí) tạo cảm giác "học được điều thật".
4. Nạn nhân ngẫu nhiên + "has the audacity" = gag chửi bậy có lý do.
5. Không dùng: tháp hạt nhân, sân golf/bóng golf (dấu hiệu & đề tài của kênh mẫu).
