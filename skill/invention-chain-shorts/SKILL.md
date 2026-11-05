---
name: "invention-chain-shorts"
description: "Sản xuất video dọc 30–50 s kiểu 'How you invented the X' (dự án P02, mẫu kênh TikTok @oddtilt): người xem là 'genius caveman' giải từng lỗi một cho tới khi phát minh ra đồ vật, 3D bán tả thực, phụ đề trắng 2 từ giữa màn hình, lời kể nhanh liên tục. Dùng khi người dùng yêu cầu ý tưởng, kịch bản, bản thử hoặc video mới cho dự án P02, hoặc nhắc tới oddtilt / 'how you invented'."
---
# Invention-chain shorts (P02) — v0.1 NHÁP (05/11/2026)

> **Trạng thái:** đã xong G2 (phân tích 14 mẫu). **Chưa** duyệt hồ sơ, chưa kiểm công cụ sản xuất (G4), chưa có bản thử (G6). Mọi mục ghi [CHỌN] là đề xuất chờ chủ dự án duyệt. Quy trình chung: `00_HUONG_DAN_CHO_CLAUDE.md` + skill `video-production-pipeline` — đọc trước.

Kho: GitHub `mailcontentnba76-cell/absurdplay-kit`, nhánh `du-an-moi`. Hồ sơ đầy đủ: `du_an/P02_oddtilt/` (đọc `HO_SO_DU_AN.md`, `PHAN_TICH_MAU/TONG_HOP.md`, `NHAT_KY_LOI.md` trước khi làm). Trả lời người dùng bằng tiếng Việt.

## 1. Công thức kịch bản (14/14 mẫu)
```
HOOK (0 s, 1 câu): vấn đề cá nhân, ngôi "you", thô/nước đôi        ← 14/14
"So you, being a genius caveman, [giải pháp thô sơ]"  (ở 6–12 %)   ← 11/14
"Clever!" / "Genius!" / "Much better!"                              ← 1–3 lần
"But/Except [lỗi mới — thường do 'your friend']" → "so you [cải tiến có thật]"
   × 3–6 vòng, mỗi vòng 5–8 s (trung vị 6,9 s)
[1 giải pháp phi lý ở nửa sau: nhà máy hạt nhân / laser / phá nhà…]  ← 7/14
KẾT A (35–62 s): "Congratulations! You've invented the X!" ở 92–95 %
KẾT B (30–40 s): "Now your friend …" câu nước đôi nối lại hook
```
- Mỗi cải tiến phải là **bước kỹ thuật có thật** của đồ vật (tra nguồn); gag nằm ở cách vấp lỗi và câu chữ.
- Lời ~210 từ/phút (185–235), 107–202 từ, **không khoảng lặng > 0,35 s**, bắt đầu ≤ 0,3 s.
- Không chép đồ vật/gag đã có trong 14 mẫu (ghế, điều hoà, báo thức, bút bi, giường, cửa, quạt, kẹp hạt, lò quay, vòi sen, thước cuộn, bồn cầu, ô, bóng rổ) — chọn đồ vật khác. Không dùng tên/nhân vật/tháp hạt nhân như "dấu hiệu" của kênh mẫu; tự tạo running gag riêng [CHỌN].
- Mức thô tục/chửi thề: **chờ chủ dự án quyết** (mẫu có "ass/shit" 8/14, "fucking" 4/14).

## 2. Thông số hình & dựng (đo trên mẫu)
| Mục | Mẫu (min / trung vị / max) | Đích [nguồn] |
|---|---|---|
| Khung | 720×1280 bản tải, 30 fps (13/14) | 1080×1920, 30 fps [CHỌN] |
| Thời lượng | 30,2 / 38,1 / 61,6 s | 30–50 s [ĐO] |
| Shot | 2 / 14 / 20; trung vị 2,75 s (174 shot) | 10–18 shot, trung vị 2,5–3,5 s |
| Chuyển cảnh | cắt cứng (12/14); máy liền/whip (2/14) | cắt cứng, không hoà hình |
| Máy | đứng yên trung vị 19 %, đẩy vào 39 % | máy trôi/đẩy chậm trong shot người; quay quanh vật trong shot cơ chế |
| Màu (HSV) | bão hoà 33/70/158; sáng 80/127/221 | ban ngày, tự nhiên; bão hoà 60–130, sáng 95–165 |
| Đổi shot | theo câu: mỗi "so you…" và "But/Except" | ≥ 1 shot mới mỗi vòng |
- Kiểu hình: 3D bán tả thực kiểu tài sản game, nhân vật người tỉ lệ thật, cử động cứng là chấp nhận được; bối cảnh: làng hang đá / nhà-bếp-sân hiện đại / mặt cắt kỹ thuật.
- Icon 2D chồng lên (≥ 2 loại/video): tim, Zzz, giọt mồ hôi, sóng mùi xanh lá, vòng sóng âm, mũi tên cong, viền highlight xanh lá quanh bộ phận đang giải thích, confetti ở "Congratulations".

## 3. Phụ đề (đo trên 13 mẫu)
- Trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; **tâm y ≈ 60 % chiều cao** (766–768/1280 → ≈ 1150/1920); cao chữ ≈ 3,3 % chiều cao (≈ 63 px ở 1920).
- Cụm 1–3 từ, **trung vị 2**; hiện cả cụm một lúc, hơi nảy, 1 khung trống giữa hai cụm; từ cảm xúc/chửi viết HOA.
- Font gốc chưa xác định → dùng font mở tương tự (vd Poppins ExtraBold) [CHỌN, cần bản thử].

## 4. Âm thanh (chỉ có số đo — Claude chưa nghe được)
- Một giọng kể năng lượng cao, nhanh; gần mono (Side−Mid ≤ −19 dB).
- Nền giữa câu thấp hơn lời ~16 dB (9–20); không có nhịp trống đều → nhạc rất nhẹ hoặc không nhạc [SL]. **Hỏi chủ dự án** về nhạc/SFX/giọng trước khi chốt.
- Xuất −14 LUFS, TP ≤ −1 dBTP [CHỌN].

## 5. Chuỗi sản xuất đề xuất [CHỌN — chưa kiểm G4]
1. Chọn đồ vật mới → tra 4–6 bước tiến hoá có thật (≥ 2 nguồn) → kịch bản theo mục 1 → **duyệt**.
2. Giọng: TTS/giọng clone (Magnific Voice khả dụng qua MCP — chưa chạy thử) → chép lời có mốc từ (Parakeet-TDT qua sherpa-onnx, đã chạy được trong phiên 05/11).
3. Shot list theo mốc câu (1 shot/bước, 2,5–3,5 s).
4. 3D: engine three.js của dự án P01 (nhánh `main`, nhân vật CC0) là phương án nhanh nhất có sẵn; cần đạo cụ cơ khí riêng mỗi tập. Phương án khác: AI tạo ảnh/video (Magnific) cho cảnh nền — kém kiểm soát khi vật phải biến hình theo câu.
5. Phụ đề + icon 2D (ffmpeg/ASS hoặc lớp đồ hoạ HTML) → trộn âm → QA theo bảng ngưỡng trong `PHAN_TICH_MAU/TONG_HOP.md`.
6. **Bản thử 10–15 s** (hook + 1 vòng vấn đề + 1 cảnh cơ chế cận) đặt cạnh mẫu → **duyệt** → mới làm đủ.

## 6. QA tối thiểu
- Lời bắt đầu ≤ 0,3 s; 185–235 từ/phút; 0 khoảng lặng > 0,35 s.
- ≥ 3 vòng vấn đề; có câu khen; kết A hoặc B.
- Phụ đề ≤ 3 từ ở ≥ 85 % cụm; tâm y 58–62 %; không che mặt/bộ phận đang giải thích.
- Shot trung vị 1,6–4,9 s; mỗi vòng có hình mới.
- −14 ± 1 LUFS; TP ≤ −1.

## 7. Công cụ đo đã có
`du_an/P02_oddtilt/cong_cu/` — `asr_parakeet.py` (chép lời + mốc từ), `do_bo_sung.py` (máy, phụ đề, nền âm, F0), `do_cat.py` (cắt cảnh), `tong_hop_so_do.py`. Dùng lại cho QA bản xuất.

## Thay đổi
- v0.1 (05/11/2026): bản đầu từ phân tích 14 mẫu; chưa duyệt.
