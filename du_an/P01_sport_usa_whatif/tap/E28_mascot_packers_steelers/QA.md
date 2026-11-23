# E28 (TT-001): Packers là công nhân đóng gói thịt thật, Steelers là thợ luyện thép thật

**Trạng thái:** kịch bản đã khoá v1 và **chờ duyệt lần 1**. Chưa tạo giọng, chưa render.
**Tạo bằng:** bộ skill `tiktok-*-sportusa` v4.0-sportusa.1 cùng `tiktok_script_assembler.py`.

## Tệp

| Tệp | Nội dung |
|---|---|
| `tt/TT-001_TOPIC_PACKET_V1.yaml` | Packet: chọn đề tài, kiểm trùng 5 trục, sổ nguồn, bảng sự thật, khả năng dựng bằng kit |
| `tt/PARTS/P01..P04.txt` | Bốn phần viết tuần tự, mỗi phần qua `verify-part` ở một lượt riêng. P01 có R2 (tách hook) |
| `tt/out/01-TT-SCRIPT-…txt` · `02-TT-VOICE-…txt` · `03-TT-TIMELINE-…csv` · `04-TT-MANIFEST-…json` | Gói 4 file. Kiểm khớp từng token giữa kịch bản và lời đọc: ĐẠT |
| `tt/out/05-MAGNIFIC-PASTE-…txt` | Lời đọc có tag `[energetic, fast-paced narrator]`, dán thẳng vào Magnific sau khi duyệt |
| `tt/SHOTLIST.json` → `tt/out/06-TT-KIT-SHOTLIST-…{json,csv}` + `tt/out/ep28_packers_steelers_shots.js` | 48 shot, khớp với engine thật |

## Chọn đề tài

**Không có hướng troll.** Ngày 22/11/2026 không xác minh được trận hot nào trong 48 giờ bằng ít nhất 2 nguồn: chỉ mục tìm kiếm chưa có kết quả NFL tuần 12 và NCAA ngày 21/11. Vì vậy chọn hướng **mascot đối đầu**.

Năm ứng viên đã kiểm trùng 5 trục và chấm điểm:

| Cặp | Kết quả | Lý do |
|---|---|---|
| **Packers vs Steelers (nghề gốc của tên đội)** | **88/100, CLEAR: chọn** | Không tốn credit 3D |
| Panthers vs Lions | Loại (trùng E25) | 4/5 trục trùng E25 (mèo lớn) |
| Patriots vs Steelers | Loại (trùng E24 NBA) | 3/5 trục trùng E24 NBA (trang phục 1776) |
| Raiders vs Buccaneers | Loại (trùng E22) | 3/5 trục trùng E22 (thuyền) |
| Broncos vs Colts | Loại | Hai bên đều là ngựa, tương phản thấp; tốn khoảng 2.070 credit |

## Năm bản hook (chấm 20 điểm; 5 tiêu chí: Mute · What+Why · Cược · Câu hỏi mở · Tự nhiên)

| # | Hook | Điểm |
|---|---|---|
| **H1** | **"What if the Packers were actual meat packers... and the Steelers were actual steelworkers?"** | **4+3+3+4+4 = 18 ✅ thắng** |
| H2 | "Green Bay versus Pittsburgh. But nobody's wearing a jersey. They're wearing hairnets and hard hats." | 3+3+3+3+4 = 16 |
| H3 | "The Packers are named after a meat company. The Steelers are named after steel. So let's make it literal." | 3+4+2+3+3 = 15 |
| H4 | "Sausage versus steel. Packers versus Steelers. One field, zero rules." | 4+2+2+3+3 = 14 |
| H5 | "What if two of the oldest names in the NFL went back to their day jobs?" | 2+3+2+4+3 = 14 (3 từ đầu chưa có tên đội) |

## Kiểm toán

| Hạng mục | Kết quả |
|---|---|
| Khởi tạo (`init`) | 4 phần; ngân sách 48, 60, 62, 45 từ; tốc độ đo thật cho series mascot 154/146/172 từ/phút |
| `verify-part` | Cả 4 phần đạt. Lệch ngân sách: P01 +8,3 %, P02 +11,7 %, P03 +16,1 %, P04 +8,9 %. Không có chữ số, câu tục hay từ thuộc chủ đề cấm |
| `opening-audit` | Beat 1 dài 3,12 s; câu dài nhất trong 0–15 s là 9/20 từ; chữ Frame-0 đạt (2 dòng); 0 cảnh báo |
| `beat-audit` | 30 beat; dài nhất 5,06 s (ngưỡng 8,5 s); 3,21 beat mỗi 10 s; không beat nào quá ngưỡng |
| Độ dài ước tính | **93,5 s** (khoảng 83,7–98,6 s). Cận nhanh vẫn **≥ 62 s → ĐẠT**. Mốc là ước tính: khi có MP3 thì thay bằng `words_tw.json` |
| Mối nối | P01→P02 "back to work → Now Pittsburgh" · P02→P03 "13 titles → Round two" · P03→P04 "scrap → fires back" · Cuối→0 s "Comment who wins" nối vào hook, không có câu outro |
| `kit-check` | 48 shot, trung vị 1,92 s, 0 lỗi chặn. Trạng thái: CO_SAN 10 · CO_SAN_FALLBACK 1 · CAN_DUNG_CODE 36 · THIEU_TAI_NGUYEN 1 |

## Chấm QA 8 trục (/100)

| Trục | Điểm | Ghi chú |
|---|---|---|
| 1. Frame-0 + hook ≥16/20 + mở bằng vật hữu hình | 19/20 | |
| 2. Sự thật ≥2 nguồn, kiểm trùng, sạch từ cấm | 19/20 | Bảng sự thật ở packet |
| 3. Đồng bộ hình–lời 9:16 + thẻ dữ liệu | 9/10 | 23/48 shot có thẻ (48 %, hơi trên mức 30–40 %) |
| 4. Sáu mốc, đỉnh 55–65 %, không có khoảng chết | 13/15 | Xem P2 bên dưới |
| 5. Nhân quả và tính liên tục | 9/10 | |
| 6. Toán thời lượng và vách 60 s | 15/15 | |
| 7. Giọng tự nhiên, vùng an toàn | 5/5 | |
| 8. Gói file + kit-check | 5/5 | |
| **Tổng** | **94/100** | |

- **P0:** không có.
- **P1:** đã sửa. Beat 1 ban đầu dài 5,45 s; tách hook thành 2 beat, còn 3,12 s.
- **P2 (ghi nhận, chưa sửa):**
  - Cú Steel Curtain đập xuống rơi vào 51 %. Cụm cảnh tượng "bật ra" kéo dài từ 55 % đến 61 %, nên đỉnh chấp nhận được.
  - 23/48 shot có thẻ dữ liệu (48 %), hơi trên mức 30–40 %. Khi dựng có thể gộp các thẻ ở s19/s24 vào bảng điểm 3D.
  - Tổng 93,5 s dài hơn E25 (77,6 s), vẫn trong dải các tập của kênh (60–96 s).

## Phân cảnh khớp kit (năng lực dựng thật)

**Có sẵn:**
- Nhân vật: `nhanvat2.makeCharacter`
- Chuyển động và biểu cảm: `dongtac.loco/locoLock/expr`
- Hiệu ứng biến hình xé áo: `bienhinh25.transformFX`
- Khán đài: `dongnguoi25.buildCrowd`
- Chống lún nền: `chamdat.snapGround`
- Đạo cụ: `dovat.trophy/football/headset`, `philly1776.tricorn` (mũ hải tặc), `santap.goalpost`
- Âm thanh: SFX Magnific và CC0, tất cả id đều có trong chỉ mục

**Cần viết code mới, không tốn credit:**
- `lib/nhamay28.js:buildMill`: sân giữa nhà máy, nửa lò thép và nửa xưởng đóng gói.
- `lib/dao28.js`, gồm:
  - trang phục: `dressPacker`, `dressSteelworker`, `hairnet`, `hardHat`
  - đạo cụ nhà máy: `crucible`, `conveyor`, `sausage`, `cheeseWheel`, `forklift`, `steelCurtain`, `scrapMagnet`, `timeClock`, `jerseyHanger`
  - đạo cụ cổ động viên: `terribleTowel`, `cheesehead`, `couchCushion`, `crowdProps`
  - đạo cụ cảnh bỏ phiếu và radio: `newspaper`, `stockCertificate`, `gavel`, `podium`, `radioMic`

**Thiếu:**
- **FBX Mixamo** (Sprint/Running ở s01–s02): đang dùng động tác UAL thay tạm. Cần chủ kênh đính kèm gói KIT.
- **Tiếng hơi nước** ở s13: chưa có trong thư viện. Có thể thay bằng tiếng công nghiệp CC0, hoặc tạo trên Magnific sau khi hỏi chủ kênh.

## 3 tiêu đề (chọn 1)

1. What if the Packers were ACTUAL meat packers? 🥩 vs 🔩
2. Steelers vs Packers… but it's steelworkers vs sausage makers
3. The fans own the Packers. So they voted the Steel Curtain into scrap.

## Hashtag

#NFL #Packers #Steelers #WhatIf #NFLMascot #SteelCurtain #TerribleTowel #Cheesehead #FootballTikTok #AbsurdPlay

## Sản xuất tới bản cắt thử (22/11/2026)
- Giọng Sport USA (Magnific, eleven_v4, 304 credit) → ×1,05 = 90,1 s; mốc 240 từ khớp kịch bản (`giong/words_tw.json`).
- Nhạc: alvana `funk/sleep` (CC0, chưa dùng tập nào). LUFS giọng −18,6 · nhạc −33,8 · SFX −30,6; ráp −14 LUFS.
- Bản cắt thử: `giao/E28_cat_thu.mp4` (540×960, 15 fps, 90,42 s, 47 điểm cắt hoà 3 khung). `qa_ground.js` 0–90 s: **0 khung lún**.
- Mixamo thiếu → chạy/ném dùng UAL (`dongtac.js` MX_ALIAS). Lái xe nâng dùng tư thế ngồi.
- Việc sửa trước bản cuối (tự kiểm từ sheet khung): khói biến hình s04/s12 quá dày, che hình; cận cảnh giấy cổ phần s33 bị tay che; cận gối sofa s44 chưa rõ hình; kiểm lại màu áo 2026 hai đội từ ảnh chính thức.

## Bản cuối (23/11/2026)
- Giao: `giao/E28_packers_steelers.mp4` — 1080×1920, 30 fps, 90,42 s, motion blur (render 720×1280, 1 tiến trình, 1,2 s/khung), −14,2 LUFS / đỉnh −1,4 dBFS.
- `quet_khung_loi.py out_f28final ep28_packers_steelers_shots.js 30` → khung lỗi: [] (2712 khung). `qa_ground.js` → 0 khung lún.
- Sửa sau cắt thử: khói biến hình nhẹ (chỉ 1/2 người có khói), giấy cổ phần dựng trên lan can, gối sofa vàng trên sofa nâu, cảnh áo 1919 dời ra trước tường xưởng (bản đầu nền trống).
- Áo đấu: Steelers áo/mũ đen phối vàng, Packers mũ vàng phối xanh (steelers.com, NFL.com, ABC7 11/2025). Màu mặt nạ chưa xác minh (chỉ 2 s đầu).
