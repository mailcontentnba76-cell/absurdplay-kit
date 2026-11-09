# V10 — "How This Bug Disappears In A Blink" — ĐỀ XUẤT LÀM MẪU CHÍNH

Nhãn bằng chứng: QS = quan sát trực tiếp · ĐO = đo bằng công cụ · SL = suy luận · ? = chưa biết · ĐX = đề xuất khi làm lại. Mốc thời gian dạng `MM:SS.mmm`, độ chính xác ±0,25 s, trừ chỗ ghi "khung" (đã kiểm từng khung 30 fps).

**Vì sao đề xuất V10 làm mẫu chính:** đây là video giải thích một cơ chế khoa học (kiểu khó làm nhất và đặc trưng nhất). Video dùng nhiều thiết bị giải thích nhất trong 10 mẫu: viền phát sáng, mũi tên chỉ hướng, bộ đếm số, giao diện điện thoại, nền studio tách bối cảnh, vòng tròn đánh dấu điểm đáp. Thời lượng 38,3 s gần đúng trung vị của bộ mẫu (38,6 s). Mở đầu bằng hiện tượng lạ, có câu hỏi ở giữa, và kết bằng một trò đùa. Video vẫn chỉ là một mẫu, chưa phải chuẩn của cả kênh.

## 1. Nguồn và thông số
| Mục | Giá trị | Nhãn |
|---|---|---|
| File | `mau_goc/e51ff2d8-How_This_Bug_Disappears_In_A_Blink_.mp4` | — |
| Thời lượng / hình | 38,313 s · AV1 1080×1920 · 29,97 fps · 1147 khung | ĐO ffprobe |
| Tiếng | AAC 44,1 kHz stereo 128 kb/s | ĐO |
| Loudness | −11,0 LUFS · TP +1,0 dBFS (sau giải mã) · LRA 1,9 LU | ĐO ebur128 |
| Màu | bão hoà trung vị 103, sáng 144 (HSV) | ĐO phan_tich_mau.py |
| Loại nội dung | giải thích cơ chế sinh học có thật | QS + mục 9 |

## 2. Lời thoại
Transcript: `do_tu_dong/V10/transcript.md` (116 từ, 7 câu).
- Câu đầu (00:00.000): **"When you touch the bug, it disappears into thin air."**
- Câu hỏi (09.36–10.48): **"So how does this bug disappear?"**
- Câu cuối (35.0–37.6): "…helping the bug stick a perfect landing before you can even realize what's happening."

| Số đo | Giá trị (ĐO) |
|---|---|
| Từ/phút cả video / đoạn có lời | 181,7 / 183,4 |
| Khoảng bắt đầu từ, trung vị | 0,24 s |
| Ngắt ≥ 0,6 s | 10 chỗ; dài nhất 1,20 s sau "disappear?" (10,48), tức là ngay sau câu hỏi |
| Đuôi sau từ cuối | ≈ 0,36 s |
| Chênh mức khi có lời so với khi không lời | 2,2 dB, nghĩa là nền âm dày |

## 3. Bảng cảnh
| # | Vào–Ra | Cảnh, hành động | Máy | Chuyển cảnh | Nhãn |
|---|---|---|---|---|---|
| 1 | 00:00.000–00:02.340 | Ngón tay khổng lồ hạ xuống con bọ tròn trên lá (macro); bọ biến mất, còn lại **viền chấm trắng hình con bọ** (01.25–02.0) | macro gần tĩnh, đẩy nhẹ | ngửa máy nhanh có nhoè, cắt ẩn ~02.34 (khung) | QS, kiểm khung |
| 2 | 00:02.340–00:03.400 | Bàn tay người chạm vào lá trên nền lá khô ngoài trời | trung cận, lia | lia | QS |
| 3 | 00:03.400–00:05.200 | Người đàn ông đội mũ rộng vành cúi xuống quay điện thoại; màn hình có **giao diện camera: khung lấy nét, nút REC đỏ** | qua vai → đẩy vào màn hình | **đẩy xuyên màn hình**: màn hình phủ kín khung, giao diện vẫn giữ (05.14–05.37, khung) | QS, kiểm khung |
| 4 | 00:05.300–00:09.300 | Nhìn qua camera điện thoại: bọ trên lá; từ 06.75 bọ biến thành **vệt mờ dọc**, rồi mất | tĩnh (máy điện thoại), giao diện giữ nguyên | lia dọc xuống có nhoè 09.24–09.41 (khung) | QS, kiểm khung |
| 5 | 00:09.400–00:12.400 | **Nền studio xanh trời trống**, bọ đứng giữa; **quầng tím phát sáng** quanh bọ (10.0–10.25); đẩy vào thân bọ | đẩy chậm vào → cận | đẩy tiếp xuống dưới bụng | QS |
| 6 | 00:12.400–00:14.700 | Gầm bọ: **chạc nhảy (furcula) viền xanh lá phát sáng** + **mũi tên chữ V xanh lá chỉ xuống** (13.25–14.0); chạc bật ra | cận thấp ngang mặt đất | cắt ~14.72 | QS, đo cắt |
| 7 | 00:14.700–00:15.950 | Chạc đập xuống đất, bụi tung (đặc tả) | đặc tả tĩnh | **hoà hình khớp vị trí** 15.85–16.05: chạc giữ nguyên chỗ, nền đổi từ đất sang trời (khung) | QS, kiểm khung |
| 8 | 00:16.000–00:18.900 | Nền studio xanh: bọ xoay tròn trên không; **bộ đếm đỏ "1x → 2x → 3x → 9x → 18x → 26x → 30x"** | trung, tĩnh | bọ bay về phía máy, mặt người trượt vào sau | QS, kiểm khung |
| 9 | 00:19.000–00:20.800 | Cận mắt người đàn ông; **đếm cái chớp mắt "0x → 1x"** (chữ trắng phát sáng) | cận, tĩnh | bọ bay ngang qua mặt | QS |
| 10 | 00:20.750–00:22.800 | Mặt ngạc nhiên ("Ooh"); bọ viền tím rơi; **mũi tên chữ V đỏ chỉ xuống** trên nền studio | trung → bọ nhỏ dần | hoà hình khớp vị trí 22.79–22.92: mũi tên và bọ giữ nguyên, nền đổi sang ngoài trời (khung) | QS, kiểm khung |
| 11 | 00:22.900–00:25.700 | Bọ viền tím rơi xuống đống lá, nảy lăn; **bia tròn trắng–đỏ** đánh dấu chỗ "muốn đáp" (24.25–25.5) | lia theo bọ, máy thấp | lia | QS |
| 12 | 00:25.750–00:28.000 | Bọ bật lên khỏi mặt đất ("raises up") | máy thấp theo bọ | đẩy vào | QS |
| 13 | 00:28.000–00:30.750 | Cận: **ống dính (collophore) tím trong suốt** thò ra từ bụng | cận, xoay quanh | cắt | QS |
| 14 | 00:30.750–00:33.100 | Đặc tả ống dính đập lên mặt đất và bám | đặc tả, gần tĩnh | lia nhoè 33.03–33.20 (khung) | QS, kiểm khung |
| 15 | 00:33.150–00:35.500 | Bọ đứng vững, **vòng tròn xanh lá** quanh chân ("perfect landing") | trung, xoay vòng | lia phải có nhoè 35.50–35.70 (khung) | QS, kiểm khung |
| 16 | 00:35.600–00:38.313 | Người đàn ông (mũ có chữ "D", áo sơ mi hoa) cầm điện thoại, ngơ ngác nhìn xuống; con bọ ở tiền cảnh | góc thấp từ phía bọ | hết video (giữ ~0,4 s) | QS |

Tổng: **16 cảnh**, trung vị ≈ 2,3 s. Kiểu chuyển cảnh: 5 cú lia hoặc ngửa máy có nhoè (cắt ẩn), 2 lần hoà hình khớp vị trí, 1 lần đẩy xuyên màn hình, 1 lần chủ thể bay ngang che máy, vài chỗ cắt cứng.

## 4. Bảng lời – hình
| Đoạn lời | Ý cần hiểu | Hình | Thay đổi | Máy | Khớp thời gian | Loại | Cách làm lại (ĐX) |
|---|---|---|---|---|---|---|---|
| "When you touch the bug, it disappears into thin air" | hiện tượng lạ | ngón tay chạm, bọ mất, còn viền chấm | bọ biến mất | macro | viền chấm hiện đúng chữ "disappears" (01.25) | minh hoạ + làm nổi chỗ vắng | ẩn mô hình, hiện đường viền chấm vẽ trên mặt phẳng |
| "if you try recording it with a regular camera… a tiny blur" | mắt và máy thường không bắt kịp | giao diện điện thoại, vệt mờ | bọ thành vệt nhoè dọc | máy điện thoại tĩnh | vệt mờ đúng "a tiny blur" (06.75) | minh hoạ góc nhìn người xem | lớp giao diện 2D + nhoè chuyển động thật |
| "So how does this bug disappear?" | câu hỏi chính | bọ cô lập trên nền studio, quầng tím | đổi bối cảnh sang "phòng giải thích" | đẩy chậm | — | **nền tách bối cảnh** | nền vô cực có chuyển màu và vignette |
| "a fork-shaped body part shoots out, slapping against the ground" | cơ quan chạc bật | chạc viền xanh lá + mũi tên V | chạc bật, đập đất | cận thấp | viền sáng đúng "fork-shaped" | **làm nổi bộ phận + mũi tên hướng** | rig chạc xoay quanh khớp, viền emission |
| "spinning the bug in the air 30 times within a single blink of an eye" | tốc độ xoay | bọ xoay + bộ đếm 1x→30x; chớp mắt 0x→1x | số tăng | tĩnh | số chạy theo nhịp lời | **bộ đếm so sánh** | chữ 3D/2D cập nhật theo khoá; quay chậm làm cho thấy được |
| "when it falls back down… hard to land in one area" | khó đáp đúng chỗ | bọ rơi, bia tròn, bọ lăn lệch | lệch khỏi bia | lia theo | bia hiện ở "to land" | **mục tiêu so với thực tế** | bia tròn đặt trên mặt đất |
| "the bug raises up a sticky tube… the tube slaps onto the surface" | cơ chế đáp | ống tím trong suốt, đập và bám | ống thò ra rồi dính | cận, đặc tả | đúng "sticky tube", "slaps" | **làm nổi + vật liệu trong suốt** | ống có rig, vật liệu SSS/trong |
| "stick a perfect landing" | kết quả | vòng xanh quanh chân | bọ đứng yên | xoay quanh | đúng "perfect landing" | xác nhận kết quả | vòng phát sáng trên mặt đất |
| "before you can even realize what's happening" | quay lại góc nhìn người | người đàn ông ngơ ngác | — | góc thấp | giữ tới hết | kết hài, nối lại câu mở | — |

## 5. Phụ đề và chữ trong cảnh
- Phụ đề trắng đậm, viền đen ~2–3 px, bóng đổ mềm phía dưới bên phải; tâm y ≈ 1504 px (0,784), cao 70 px; 1–4 từ; đổi theo cụm lời (ĐO + QS, ảnh cắt `cap_crop` lúc 05.9 s). Có dấu hỏi ở "disappear?". Font chưa xác định.
- Chữ trong cảnh: bộ đếm "1x…30x" (đỏ, đậm, có bóng), "0x/1x" (trắng phát sáng), mũi tên chữ V xanh lá và đỏ, giao diện camera điện thoại, bia tròn, vòng xanh, viền chấm trắng.

## 6. Âm thanh (đo, chưa nghe)
- Nền âm liên tục, không có lặng > 0,35 s; mức khi không lời chỉ thấp hơn khi có lời 2,2 dB (ĐO).
- Đỉnh năng lượng dải 3–8 kHz ngoài lúc có lời: xem `do_tu_dong/V10/am_thanh.json`. Đây là ứng viên SFX hoặc whoosh, chưa xác nhận.
- F0 trung vị ~150 Hz (p10–p90: 95–245 Hz). Số đo thô.

## 7. Hook và cấu trúc
| Mục | Nội dung |
|---|---|
| Hình đầu | đặc tả bọ tròn trên lá, ngón tay khổng lồ ở trên (00:00.000) |
| Hành động đầu | ngón tay hạ xuống (bắt đầu ngay khung đầu) |
| Âm thanh có nghĩa đầu tiên | lời bắt đầu ở 0,00 s |
| Lúc hiểu tiền đề | khoảng 2,2 s ("…disappears into thin air") |
| Câu hỏi treo | "bọ biến đi đâu?" → được nói thành lời ở 09,4 s → trả lời 12,0–35,0 s |
| Kết | trả lời xong thì quay về góc nhìn người (đúng như câu mở "When you touch…"), kết bằng nét mặt ngơ ngác |

Chức năng câu: S1 hiện tượng · S2 bằng chứng (camera không bắt kịp) · S3 câu hỏi · S4 cơ chế bước 1 (bật nhảy, xoay) · S5 vấn đề (khó đáp) · S6 cơ chế bước 2 (ống dính) · S7 kết quả + quay về người xem.

## 8. Thiết kế hình
- 3D tả thực ở cấp macro: bọ có lông, vỏ bóng, nền xa mờ (độ sâu trường ảnh nông) (QS).
- Người có phong cách hoạt hình nhẹ (mắt to, da mịn) đặt cạnh động vật tả thực (QS).
- Bảng màu: xanh lá của lá, xanh trời của nền studio, nâu đất; màu thiết bị giải thích là xanh lá (cơ quan), tím (bọ khi đang giải thích), đỏ (số đếm, hướng rơi) (QS).
- Thương hiệu: chữ "D" trên mũ người đàn ông (QS).

## 9. Kiểm tra nội dung thật
- Bọ trong video là bọ đuôi bật (springtail): "fork-shaped body part" là chạc nhảy (furcula), "sticky tube" là ống bụng (collophore). Đúng về mặt sinh học.
- "30 lần trong một cái chớp mắt": nhóm của Adrian Smith (NC State) đo loài *Dicyrtomina minuta* xoay trung bình 282 Hz, đỉnh 368,7 Hz. Một cái chớp mắt dài cỡ 0,1 s thì ra khoảng 28–37 vòng, nên con số trong video hợp lý. Nguồn: [Science News](https://sciencenews.org/?p=3118976).
- Phần đáp bằng ống dính dựa trên nghiên cứu ở loài **khác** (*Isotomurus retardatus*, sống bán dưới nước, Ortega-Jiménez và cộng sự, PNAS 2022, đáp ~85 % bằng mặt bụng). Nguồn: [EurekAlert](https://www.eurekalert.org/news-releases/970665), [Georgia Tech](https://research.gatech.edu/secret-skillful-skydiving-wingless-springtails).
- **Lưu ý:** video ghép kết quả của hai loài thành một con bọ. Khi làm tập tương tự, nói rõ hoặc chọn một loài.

## 10. Phạm vi đã kiểm
- **Hình:** toàn bộ 154 khung ở 4 khung/giây; kiểm từng khung 30 fps ở 8 chỗ chuyển cảnh.
- **Tiếng:** đo, chưa nghe trực tiếp.
