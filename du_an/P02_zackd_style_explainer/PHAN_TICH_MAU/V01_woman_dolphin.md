# V01 — "The Woman Who Lived With A Dolphin"

Nhãn bằng chứng: **QS** = quan sát trực tiếp trên khung hình · **ĐO** = đo bằng công cụ (ghi cách đo) · **SL** = suy luận (kèm độ tin) · **?** = chưa biết · **ĐX** = đề xuất khi làm lại.
Mốc thời gian dạng `MM:SS.mmm`. Độ chính xác của mốc cảnh là ±0,25 s (đọc trên lưới 4 khung/giây), trừ những mốc ghi "khung" là đã kiểm từng khung 30 fps.

## 1. Nguồn và thông số
| Mục | Giá trị | Nhãn |
|---|---|---|
| File gốc | `mau_goc/f8f46380-The_Woman_Who_Lived_With_A_Dolphin_.mp4` (chủ dự án gửi 09/11/2026, chỉ dùng nội bộ) | — |
| Thời lượng | 39,544 s | ĐO ffprobe |
| Hình | AV1, 1080×1920 (9:16), 29,97 fps, 1183 khung, ~1,19 Mb/s | ĐO ffprobe |
| Tiếng | AAC 44,1 kHz stereo 128 kb/s; Side−Mid −15,6 dB (gần mono) | ĐO ffprobe, phan_tich_mau.py |
| Loudness | −13,2 LUFS tích hợp; true peak +0,2 dBFS (sau giải mã); LRA 2,3 LU | ĐO ebur128 |
| Loại nội dung | chuyện có thật (khoa học/lịch sử), kể theo trình tự thời gian | QS + kiểm nguồn mục 9 |

## 2. Lời thoại
Transcript có mốc thời gian ở `do_tu_dong/V01/transcript.md` (109 từ). Câu đầu: **"She started filling the rooms with water until there was enough that a dolphin could swim."** (00:00.000).

| Số đo | Giá trị | Cách đo |
|---|---|---|
| Từ/phút cả video | 165,4 | ĐO: số từ ASR / thời lượng |
| Từ/phút trong đoạn có lời | 169,1 | ĐO: từ đầu tới từ cuối + 0,35 s |
| Khoảng bắt đầu từ, trung vị | 0,32 s | ĐO ASR |
| Ngắt ≥ 0,6 s giữa 2 từ | 17 chỗ, dài nhất 0,96 s (sau "sounds." 22,24; "sunlight." 31,60; "separated," 36,48) | ĐO ASR (bước 0,08 s) |
| Khoảng lặng > 0,35 s (toàn mix) | 0 | ĐO silencedetect: luôn có nền âm |
| Đuôi sau từ cuối | ≈ 0,87 s (từ "died." bắt đầu 38,32 s) | ĐO, ước lượng |

## 3. Bảng cảnh (toàn bộ video)
| # | Vào–Ra | Cảnh, hành động | Máy | Chuyển sang cảnh sau | Nhãn |
|---|---|---|---|---|---|
| 1 | 00:00.000–00:01.970 | Phòng tường xanh lam lát gạch kính; người phụ nữ đứng cầm vòi nước, nước phun xuống sàn | bắt đầu toàn thân, lia/đẩy phải theo vòi rồi đi dọc dòng nước, xuyên qua cổng vòm | **cắt cứng** khung 59→60 (01.97→02.00), cả 2 bên cùng hướng đẩy tới (nối chuyển động) | QS, kiểm khung |
| 2 | 00:02.000–00:03.900 | Phòng ngủ ngập nước, giường, logo "ZACK D FILMS" trên tường như tranh treo | đẩy tới rồi hạ máy chìm xuống mặt nước | máy xuyên mặt nước (liên tục) | QS |
| 3 | 00:03.900–00:05.400 | Dưới nước: cá heo bơi thẳng về ống kính, cận đầu | dưới nước, chủ thể lao vào máy | máy nổi lên/lùi (liên tục) | QS |
| 4 | 00:05.400–00:07.550 | Người phụ nữ ngồi xuống bậc thềm trong phòng ngập, cá heo lướt tiền cảnh | trung cảnh, máy thấp sát mặt nước | **lia nhanh có nhoè chuyển động** 07.54–07.71 (cắt ẩn trong nhoè ~07.61) | QS, kiểm khung |
| 5 | 00:07.710–00:12.050 | Bàn trang điểm có gương: thoa phấn trắng lên mặt, tô môi đen | qua vai → đẩy vào cận mặt → đặc tả môi (10.0–11.75) | lia nhoè 12.01–12.21 | QS, kiểm khung |
| 6 | 00:12.150–00:13.050 | Cá heo bên dây thừng, sàn nước | cận, máy lia | lia nhoè 12.95–13.15 | QS, kiểm khung |
| 7 | 00:13.150–00:19.000 | Cận mặt người phụ nữ: **môi phát sáng xanh lơ** (13.25–13.75, đúng chữ "watch her lips"); chữ 3D neon xanh lá **"HI"** bay từ miệng về phía cá heo (14.0–16.5); chữ neon đỏ **"H-E-E-E"** bay từ cá heo (17.25–19.0) | máy bám theo chữ bay, xoay quanh | lia | QS |
| 8 | 00:19.000–00:23.100 | Góc cao, người phụ nữ quỳ cạnh bàn, cầm cá; chữ "HI" rồi "H-III" xanh lá (bắt chước dần) | toàn → trung, lia theo chữ | **chuyển ép ngang qua đen** 23.16–23.26 (hình co thành dải dọc rồi mở ra) | QS, kiểm khung |
| 9 | 00:23.260–00:25.400 | Phông xanh lơ sáng: người đàn ông mặc vest đưa thư; đẩy vào tờ giấy "Cancellation of the Dolphin Experiment" có dấu "ACCEPTED" | đẩy thẳng vào giấy | cắt cứng 25.33/25.49 | QS, đo cắt |
| 10 | 00:25.500–00:28.750 | Người phụ nữ ngồi ghế, cá heo tựa vào chân, tay vuốt cá heo (gắn bó) | máy thấp, đẩy nhẹ lên mặt buồn | lia nhoè dọc 28.73–28.96 | QS, kiểm khung |
| 11 | 00:28.960–00:30.000 | Ngoài trời: cần cẩu nhấc cá heo trong cáng; người phụ nữ vẫy tay | toàn cảnh, máy đi xuống | đẩy xuống mặt nước | QS |
| 12 | 00:30.000–00:32.750 | Phòng tối: bể nhỏ **viền neon xanh lá** (đúng chữ "tank" 30.25–30.75), cá heo trong bể; ánh sáng yếu | nhìn từ trên xuống, hạ dần | xuyên mặt nước | QS |
| 13 | 00:33.000–00:34.700 | Dưới nước bể nhỏ: cá heo buồn, đứng yên | cận, gần tĩnh | cắt cứng 33.00 | ĐO cắt + QS |
| 14 | 00:34.750–00:37.250 | Người phụ nữ cầm ảnh, lịch bàn lật "WEEK 1 → 2 → 3 → 4" (35.04/35.50/35.94 là lật trang, **không phải cắt**) | trung cận, đẩy nhẹ | cắt cứng 37.37 | QS |
| 15 | 00:37.370–00:39.544 | Cá heo nằm im dưới đáy bể, mắt nhắm | gần tĩnh, đẩy rất chậm | hết video (giữ hình ~1,2 s sau khi phụ đề tắt ở ~38,4) | QS |

Tổng: **15 cảnh**, thời lượng trung vị ≈ 2,1 s (ngắn nhất ~0,9 s, dài nhất ~5,9 s). Cắt "thật" mà máy dò được chỉ là các chỗ đổi bối cảnh hẳn; phần lớn chuyển cảnh nằm trong **cú lia nhoè 5–7 khung** hoặc **máy bay xuyên vật** (cổng vòm, mặt nước).

## 4. Bảng lời – hình
| Đoạn lời | Ý người xem cần hiểu | Hình thấy gì | Thay đổi trên hình | Máy | Khớp thời gian | Loại | Cách làm lại (ĐX) |
|---|---|---|---|---|---|---|---|
| "She started filling the rooms with water" | có người cố tình làm ngập nhà | người cầm vòi, nước lan | mực nước dâng | đi theo dòng nước | hình vòi có ngay ở 0 s | minh hoạ trực tiếp | mô phỏng chất lỏng (Blender Mantaflow/FLIP) hoặc mặt nước động bằng shader |
| "until there was enough that a dolphin could swim" | nước đủ sâu cho cá heo | máy chìm xuống, cá heo bơi tới | chuyển từ trên sang dưới nước | xuyên mặt nước | cá heo hiện đúng chữ "dolphin" (~04.0) | minh hoạ + bất ngờ | cảnh nước có bề mặt đôi (trên/dưới) |
| "Then she moved in with him" | cô ấy sống cùng | ngồi bậc thềm, cá heo lướt qua | — | trung cảnh | — | tái hiện | — |
| "she painted her face white and outlined her mouth in black" | trang điểm có mục đích | thoa phấn, tô môi | mặt chuyển trắng, môi đen | đặc tả | đúng từng cụm "white" / "in black" | tái hiện | thay vật liệu da theo khoá thời gian |
| "so he could watch her lips" | lý do: cá heo nhìn môi | **môi phát sáng xanh lơ** | làm nổi bộ phận | cận mặt | đúng "watch her lips" | **làm nổi** (thiết bị giải thích) | emission mask trên môi, bật/tắt nhanh |
| "as she repeated words" / "copying her sounds" | dạy nói, cá heo bắt chước | chữ 3D neon bay qua lại "HI" / "H-E-E-E" / "H-III" | âm thanh thành vật thể có hình | bám theo chữ | chữ xuất hiện đúng lúc nói "repeated", "copying" | **hình hoá âm thanh** | chữ 3D có emission + bloom, bay theo đường cong |
| "But then the experiment lost funding" | dự án bị cắt | người vest đưa thư huỷ | đẩy vào chữ trên giấy | đẩy thẳng | tiêu đề thư đọc được ở "lost funding" | văn bản trong cảnh | đạo cụ giấy có chữ in, đọc được ≥ 0,7 s |
| "they had grown close" | gắn bó | tay vuốt cá heo | — | máy thấp | — | cảm xúc | — |
| "moved to a smaller tank with little sunlight" | điều kiện tệ hơn | cẩu nhấc → bể nhỏ tối, **viền neon xanh** | ánh sáng tối hẳn | từ trên xuống | viền sáng đúng chữ "tank" | so sánh + làm nổi | 2 bộ ánh sáng tương phản |
| "just weeks after they were separated" | thời gian trôi | lịch lật WEEK 1→4 | lật trang | trung cận | mỗi trang ~0,45 s | **thiết bị thời gian** | lịch đạo cụ, đổi chữ theo khoá |
| "the dolphin died" | kết thúc buồn | cá heo nằm đáy bể | — | gần tĩnh | giữ ~1,2 s sau từ cuối | kết | cảnh tĩnh, ánh lạnh |

## 5. Phụ đề
- Có phụ đề suốt video (QS). Chữ trắng đậm không chân, viền đen mảnh + bóng đổ tối, căn giữa; mỗi lần 1–4 từ, đổi theo cụm từ được nói; không dấu câu trừ dấu nháy/dấu hỏi (QS).
- Tâm chữ ở y ≈ 1505 px (0,784 chiều cao), x ≈ 540 px; chiều cao vùng chữ trung vị 71 px; bề rộng p90 ≈ 768 px (ĐO: lọc điểm ảnh trắng trên 12 khung, `do_tu_dong/phu_de_do.json`).
- Phụ đề tắt ở ~38,4 s, hình còn giữ tới hết (QS).
- Chữ trong cảnh (không phải phụ đề): "ZACK D FILMS" trên tường; "HI", "H-E-E-E", "H-III" (neon 3D); tiêu đề thư; "WEEK 1–4".

## 6. Âm thanh (không nghe trực tiếp, chỉ đo)
| Mốc | Sự kiện | Nhãn |
|---|---|---|
| 00:00–39:54 | Có nền âm liên tục (không có khoảng lặng > 0,35 s); mức khi không có lời thấp hơn khi có lời khoảng 4,4 dB (trung vị) | ĐO |
| đuôi 38,8–39,5 | Có thành phần âm sắc rõ (đỉnh 262 Hz và 393 Hz, cao hơn trung vị phổ ~60 dB) sau khi lời kết thúc → **có nhạc nền** kéo tới hết | ĐO FFT, SL độ tin cao |
| quanh các cú lia nhoè | Chưa xác định được có tiếng "whoosh" hay không | ? |
| Giọng | F0 trung vị ~183 Hz (p10–p90: 114–286 Hz) — số đo bị nhạc nền làm nhiễu; không xác định được giới tính, tuổi hay nhà cung cấp giọng | ĐO (thô), ? |

## 7. Hook và cấu trúc
| Mục | Nội dung |
|---|---|
| Câu nói đầu | "She started filling the rooms with water…" |
| Chủ thể đầu tiên | người phụ nữ cầm vòi trong phòng xanh (00:00.000) |
| Hành động đầu | phun nước làm ngập phòng |
| Chữ đầu | phụ đề "She started" |
| Kiểu mở | **vào giữa hành động kỳ lạ**: không giới thiệu, không câu hỏi |
| Lúc hiểu tiền đề | 17,1–18,7 s ("She was trying to test whether a dolphin could speak like a human"). Trước đó người xem chỉ biết "làm chuyện lạ với cá heo" |
| Câu hỏi treo | "Vì sao cô ấy làm vậy?" → trả lời ở 17 s; câu hỏi thứ hai "rồi sao?" → bước ngoặt "But then… lost funding" (23,0 s) |
| Kết | bi kịch, không có câu kết luận hay lời kêu gọi |

Chức năng từng câu: S1 bối cảnh (hành động lạ) · S2 leo thang ("moved in") · S3 hành động lạ thứ 2 · S4 lý do (tiền đề) · S5 kết quả tích cực · S6 bước ngoặt · S7 đảo chiều cảm xúc · S8 hậu quả · S9 hậu quả nặng hơn · S10 kết.

## 8. Thiết kế hình
- Đồ hoạ 3D bán tả thực (QS): người có tỉ lệ thật, da có kết cấu, tóc dạng mảng; cá heo tả thực; vật liệu PBR; nước có khúc xạ và phản chiếu.
- Màu chủ đạo xanh lam (bão hoà trung vị 108, sáng 96 trên thang HSV 0–255, ĐO); điểm nhấn là gỗ nâu và phát sáng neon xanh lá/đỏ.
- Ánh sáng mềm, hướng trên; cảnh "bể nhỏ" chuyển sang tối và lạnh để tạo tương phản cảm xúc.
- Bố cục: chủ thể thường chiếm 40–70 % khung, nằm ở 2/3 trên, chừa vùng phụ đề ở y ≈ 0,78.
- Thương hiệu kênh đặt **bên trong cảnh** (logo trên tường), không có watermark góc.

## 9. Kiểm tra nội dung thật
- Câu chuyện có thật: Margaret Howe Lovatt sống trong ngôi nhà ngập nước với cá heo Peter trong dự án của John Lilly (thập niên 1960), có tài trợ một phần từ NASA. Phòng thí nghiệm đóng cửa khi hết tiền, Peter bị chuyển tới Miami và chết vài tuần sau đó. Nguồn: [Wikipedia](https://en.wikipedia.org/wiki/Margaret_Howe_Lovatt), [Popular Science](https://www.popsci.com/article/science/when-nasa-paid-researchers-learn-talk-dolphins/).
- **Chưa kiểm chứng:** chi tiết "sơn mặt trắng, viền môi đen" không có trong các kết quả đã tìm. Logo trên lá thư trong video là hình tự vẽ giống logo NASA; khi làm lại nên tránh dùng logo thật.

## 10. Phạm vi đã kiểm và chỗ còn thiếu
- **Hình:** xem toàn bộ 158 khung ở 4 khung/giây; kiểm từng khung 30 fps ở 6 chỗ chuyển cảnh (01.95, 07.55, 12.05, 13.00, 23.15, 28.80).
- **Tiếng:** đo loudness, ASR, phổ âm, mức nền. **Chưa nghe trực tiếp**, nên chưa xác định được nhạc cụ, tiếng hiệu ứng (SFX) hay cảm xúc giọng.
- Mốc cảnh ±0,25 s ở những chỗ chưa kiểm từng khung.
