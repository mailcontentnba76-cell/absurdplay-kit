# TT001 (TT-001, tập bắt trend) — "Elijah: The Aura Farmer" · kịch bản đầy đủ v2 (khóa 22/11/2026, CHỜ DUYỆT)

**Người kể:** Tyler (giọng clone "Ant Just Cant"), người đứng chứng kiến. Ngoại hình cố định: tóc đen bù xù, áo vàng "I PAUSED MY GAME TO BE HERE", quần xám đậm, giày trắng.

**Nhân vật của tập:** Elijah (#13 "Effortless Charmer" trong SERIES_TYLER_MEETS, ghép trend *aura farming*).
- **Ngoại hình:** tóc rẽ ngôi gọn, mặt bình thản nửa cười, **mắt luôn nheo** (mood mặc định "chill" + mi mắt hạ). **Cặp kính gọng đen đẩy lên trên đầu suốt tập** (cài từ khung 0, payoff ở bến xe).
- **Trang phục:** áo da đen mở (tách khỏi mặt sân xanh, tường be, bậc band nâu) ngoài áo thun trắng in **"BUFFERING…"** (chữ tự vẽ); quần jean đậm; giày trắng.
- **Giọng:** nam trẻ, trầm, chậm, bình thản; chỉ hoảng và to ở câu "Wait. Why is everyone LOOKING at me?!".
- **Dáng:** luôn dựa vào thứ gì đó (cột, khung cửa, người); không bao giờ quay đầu nhanh.

**Vai phụ có thoại:** KID (học sinh hype ở sân, 1 câu) · Kayla (CAST_BIBLE, 2 câu) · Mr. Hayes (thầy band, 1 câu). Vai im lặng nhưng luôn cử động: nhóm sân bóng (4), ban nhạc (8), lớp mỹ thuật (6, gồm cô giáo), bến xe (6), thầy hiệu trưởng Hargrove (cảnh bị dựa).

**Bản quyền / an toàn:** "aura farming" là tiếng lóng, không có video hay người thật nào. Mọi chữ, bảng điểm và màn hình điện thoại đều tự vẽ. Sandwich bị xe buýt cán là đồ vật; Elijah va vào Tyler chỉ là đụng nhẹ, không ai bị thương.

**Thời lượng ước tính:** 70.3 s (67.1–75.0 s ở 136–152 wpm) · 4 bối cảnh mới · 34 cảnh (~4.8 cắt/10 s).

**Biến thử nghiệm (H03):** câu hét ở khung 0 do người ngoài (KID) nói; nhân vật chính im và bình thản.

**Ghi chú dựng:** key cảnh = tên hàm trong `tools/hb/tt001_scene.py` (chép khuôn `tmg01_scene.py`). `OPEN_ELI_CATCH` được dùng 2 lần: lần 2 ở cảnh 25 là hồi tưởng, dùng lại đúng bản render. Chữ in hoa là nhấn giọng. *(…)* là hình và hành động.

---

## BỐI CẢNH 1 — SÂN BÓNG RỔ NGOÀI TRỜI (7:55 sáng) · set mới `basketball_court()`
*Mặt nhựa xanh kẻ vạch trắng, 2 cột rổ + bảng rổ, hàng rào lưới, ghế băng, bảng điểm treo tường sơn "WESTBROOK COURTS" (tex), cây (`hb_sets5.tree`), ba lô vứt trên ghế, chai nước. Bên kia hàng rào là tường trường + cửa ra vào (cho cảnh dựa cửa) và thầy hiệu trưởng trực cổng. Trời xanh `world("out")`.*

| # | Key | Hình ảnh / hành động · camera | Người nói | Lời |
|---|---|---|---|---|
| 1 | `OPEN_ELI_CATCH` | **Khung 0:** quả bóng bay vào hình, đập vào tay Elijah đang dựa cột; cậu giữ bóng, mặt KHÔNG quay. 2 nhóc nhảy lùi, tay ôm đầu. Trung cảnh hơi thấp, thấy kính trên đầu | **KID** (hét) | "OHHH! No-look catch!" |
| 2 | `CU_KID_HYPE` | Cận KID (hoodie đỏ, băng đô) chỉ tay, nhảy tại chỗ | **KID** | "That's aura farming!" |
| 3 | `CU_ME_WTF` | Cận Tyler, mặt đơ, ôm hộp cơm | TYLER | "**What the fuck is wrong with this dude?**" |
| 4 | `WIDE_COURT_ELI` | Toàn sân, Elijah dựa cột ở giữa, bóng kẹp hông; nhóc chơi bóng nền | TYLER | "This is Elijah." |
| 5 | `CU_ELI_SQUINT` | Cận Elijah nheo mắt, nửa cười, gió thổi tóc nhẹ | TYLER | "He doesn't try. At anything." |
| 6 | `WIDE_COURT_FANS` | Học sinh bên hàng rào nhìn Elijah, 2 bạn chụp ảnh, 1 bạn cúi chào | TYLER | "And the whole school treats him like a final boss." |
| 7 | `MS_ELI_LEAN_POLE` | Elijah đi 3 bước, dựa cột đèn, rồi dựa khung cửa trường (1 cảnh lia) | TYLER | "He leans his way to class." |
| 8 | `MS_ELI_LEAN_PRINCIPAL` | Elijah dựa lên vai thầy Hargrove đang trực cổng; thầy cứng đờ, cầm cốc cà phê | TYLER | "Poles. Doors. One time, the principal." |
| 9 | `MS_KAY_FILM` | Kayla (hoodie lavender ếch, kính tròn) giơ điện thoại quay Elijah | **KAYLA** (khô) | "He's aura farming." |
| 10 | `INS_KAY_PHONE` | Cận màn hình điện thoại tự vẽ: đang quay, chấm đỏ REC, khung có Elijah | **KAYLA** | "I have it on video." |
| 11 | `CU_ME_DEAD` | Cận Tyler đứng một mình cạnh hàng rào, gió thổi túi nilon qua | TYLER | "I've farmed aura for years. Zero crops." |

## BỐI CẢNH 2 — PHÒNG BAND (tiết 2) · set mới `band_room()`
*Bậc gỗ hình vòng cung, ghế xếp + giá nhạc, bộ trống, xylophone, tuba, kèn, bảng đen ghi nốt, băng rôn "PRACTICE MAKES PERMANENT" (tex), tủ đựng nhạc cụ, đồng hồ treo tường. Thầy Hayes đứng bục chỉ huy với que baton.*

| # | Key | Hình ảnh / hành động · camera | Người nói | Lời |
|---|---|---|---|---|
| 12 | `WIDE_BAND` | Toàn phòng, cả ban nhạc đang thổi/đánh, thầy Hayes vung baton | TYLER | "Second period. Band." |
| 13 | `MS_ELI_TRIANGLE` | Elijah ngồi hàng sau, cầm kẻng tam giác, nheo mắt về phía… bức tường | TYLER | "Elijah plays the triangle." |
| 14 | `MS_BAND_STOP` | Tiền cảnh: que gõ chạm kẻng (một "ding"). Hậu cảnh: cả ban nhạc khựng lại, quay đầu | TYLER | "One ding. The whole band stops." |
| 15 | `CU_HAYES_TEAR` | Cận thầy Hayes (nơ cổ) đặt tay lên ngực, mắt long lanh | **MR. HAYES** (xúc động) | "Elijah. That was perfect." |
| 16 | `CU_ME_TUBA` | Cận Tyler ôm tuba khổng lồ, má phồng, khựng lại | **MR. HAYES** | "Tyler, less tuba." |
| 17 | `WIDE_ME_TUBA` | Tyler thổi tuba một mình, đồng hồ trên tường chạy nhanh (40 phút) | TYLER | "I played tuba for forty minutes." |
| 18 | `MS_BAND_BACKS` | Cả ban nhạc ngồi quay lưng về phía Tyler, đều đặn | TYLER | "Nobody turned around." |
| 19 | `OTS_ELI_SHEET_UPSIDE` | Qua vai Elijah: bản nhạc trên giá **lộn ngược** (chữ "TRIANGLE PART" ngược, tex), Elijah nheo mắt gật gù | TYLER | "His sheet music was upside down. Still perfect." |

## BỐI CẢNH 3 — PHÒNG MỸ THUẬT (cú lật, ~60–66 %) · set mới `art_room()`
*Giá vẽ xếp đôi đối diện nhau, kệ đất sét, cốc cọ, bồn rửa, dây phơi tranh, poster bánh xe màu (tex), **giá treo áo cạnh cửa** (có treo một chiếc áo khoác vàng, cài sẵn cho cú lật). Cô giáo mỹ thuật (tạp dề loang màu) đi giữa các giá vẽ.*

| # | Key | Hình ảnh / hành động · camera | Người nói | Lời |
|---|---|---|---|---|
| 20 | `WIDE_ART` | Toàn phòng, học sinh vẽ chân dung nhau theo cặp; Tyler ngồi cứng làm mẫu đối diện Elijah | TYLER | "Art class. We paint each other." |
| 21 | `MS_ELI_BRUSH` | Elijah quẹt đúng một nét cọ, đặt cọ xuống, khoanh tay; cô giáo che miệng xúc động | TYLER | "Elijah paints me in one line." |
| 22 | `CU_ME_SIDEEYE` | Cận Tyler liếc sang tranh, nghiêng người | TYLER | "Then I look closer." |
| 23 | `INS_CANVAS_RACK` | Cận bức tranh: một nét vẽ **giá treo áo** (tex), đặt cạnh giá treo áo thật ở hậu cảnh. Tyler ở mép khung bên kia | TYLER | "It's the coat rack." |
| 24 | `POV_KAY_ZOOM` | *(ảnh nền POV)* Màn hình điện thoại Kayla zoom vào mắt nheo của Elijah, chữ "zoom 8x" (insert `story_inserts.py`). **Nhịp lặng ~0.6 s trước câu này** | **KAYLA** (khô) | "Bro. He can't see." |
| 25 | `OPEN_ELI_CATCH` | *(hồi tưởng, dùng lại render cảnh 1)* | TYLER | "The no-look catch. The triangle." |
| 26 | `CU_ME_REALIZE` | Cận Tyler, mắt mở to, cọ rơi khỏi tay | TYLER | "He wasn't farming anything." |

## BỐI CẢNH 4 — BẾN XE BUÝT SAU GIỜ HỌC (chiều, ráng cam) · set mới `bus_stop()`
*Mái che bến có ghế băng, biển "BUS 12" (tex), lề đường, cột đèn, thùng rác, cây; xe buýt vàng tới (dùng lại mô hình `hb_sets2.school_bus`, chỉ phần ngoài); 6 học sinh chờ xe, lướt điện thoại, nói chuyện. Tyler cầm sandwich.*

| # | Key | Hình ảnh / hành động · camera | Người nói | Lời |
|---|---|---|---|---|
| 27 | `WIDE_BUS_STOP_POINT` | Toàn bến, Tyler (tay cầm sandwich) chỉ lên đầu Elijah | TYLER | "After school. I point at his head." |
| 28 | `INS_GLASSES_HEAD` | Cận cặp kính nằm trên tóc Elijah | TYLER | "Glasses. All day." |
| 29 | `CU_ELI_PANIC` | Elijah kéo kính xuống, mắt mở to lần đầu; ngược sáng là cả bến đang nhìn; cậu lùi lại | **ELIJAH** (hoảng, to) | "Wait. Why is everyone LOOKING at me?!" |
| 30 | `MS_ELI_BUMP` | Elijah lùi, đụng vai Tyler; sandwich văng khỏi tay | TYLER | "He backs into me." |
| 31 | `INS_SANDWICH_BUS` | Cận lề đường: sandwich lăn xuống đúng lúc bánh xe buýt lăn tới (cắt trước khi chạm, nghe "squish" do giọng đọc) | TYLER | "My sandwich rolls under the bus." |
| 32 | `CU_ELI_GLASSES_OFF` | Elijah tháo kính, nheo mắt lại, bình thản như cũ: **vọng lại khung 0** | TYLER | "Elijah got his glasses." |
| 33 | `INS_PHONE_VIEWS` | Điện thoại Kayla: video Elijah, bộ đếm "2.0M views" (tự vẽ) | TYLER | "Kayla got two million views." |
| 34 | `CU_ME_CRUMBS` | Cận Tyler nhìn vụn bánh trên mặt đường, xe buýt chạy đi | TYLER | "The bus got my sandwich." |

---
## Ghi chú sản xuất (sau khi người dùng chốt)
1. **Giọng:** `--voice-map ELI=<mới>,KAY=6u6JbqKdaQy89ENzLSju,KID=<mới>,BAND=<mới>`; `--voice-opts KID=0.12:1.12,ELI=0.45:1.0`. Riêng câu `L18` (Elijah hoảng) cần tạo lại riêng với stability thấp. Kiểm ASR "OHHH" và "aura".
2. **Phụ đề:** từ khóa vàng: AURA, NO-LOOK, ELIJAH, FINAL BOSS, TRIANGLE, PERFECT, COAT RACK, CAN'T SEE, GLASSES, SANDWICH. Đổi "two million" thành "2 MILLION" trong `vo16k.cap.json`.
3. **Nhịp lặng:** thêm ~0.6 s trước `L15` (Kayla), bằng cách tách riêng hoặc chèn khoảng trống trong `vo.wav`.
4. **Hàm mới:** `tools/hb/hb_sets6.py` (`basketball_court`, `band_room`, `art_room`, `bus_stop`); `Char(glasses_up=True)`; quỹ đạo bóng bay (keyframe vật thể); `make_tex_tt001.py` (bảng điểm, băng rôn, bản nhạc lộn ngược, tranh giá treo áo, biển BUS 12, áo in BUFFERING…).
5. **Ảnh chèn:** `POV_KAY_ZOOM` (zoom), `INS_PHONE_VIEWS` (bộ đếm), `INS_KAY_PHONE` (đang quay): dựng theo kiểu `story_inserts.py`.
