# TỔNG HỢP 10 VIDEO MẪU — P02 (kênh mẫu @zackdfilms)
Lập 09/11/2026. Nhãn: **QS** quan sát · **ĐO** đo · **SL** suy luận · **?** chưa biết · **ĐX** đề xuất.
Mỗi kết luận ghi rõ bao nhiêu trên 10 video có đặc điểm đó. 10 video vẫn chỉ là **một mẫu nhỏ** của kênh, chưa đủ để gọi là chuẩn của cả kênh.

## 0. Danh sách và phạm vi đã kiểm
| ID | Tên | Thời lượng | Loại nội dung | File phân tích |
|---|---|---|---|---|
| V01 | The Woman Who Lived With A Dolphin | 39,5 s | chuyện có thật (lịch sử khoa học) | `V01_woman_dolphin.md` |
| V02 | What If Bug-Man Grew Inside Purple Guy | 51,7 s | giả định siêu anh hùng (nhân vật đổi tên) | `V02_bugman_purpleguy.md` |
| V03 | Microwaving Two Grapes Creates Plasma | 28,4 s | hiện tượng vật lý | `V03_grapes_plasma.md` |
| V04 | The Classroom With A Farting Corner | 23,8 s | chuyện đời thường (chưa kiểm nguồn) | `V04_farting_corner.md` |
| V05 | His Tattoo Turned Ironic After Amputation | 35,3 s | chuyện có thật về một người | `V05_tattoo_amputation.md` |
| V06 | What If Humans Had Hummingbird Hearts | 37,4 s | giả định y sinh | `V06_hummingbird_hearts.md` |
| V07 | The Edge Of The Universe (fiction) | 68,4 s | hư cấu có cú lật | `V07_edge_universe.md` |
| V08 | How To Build A Matchbox Camera | 38,9 s | hướng dẫn tự làm | `V08_matchbox_camera.md` |
| V09 | Making Butter With A Relay Baton | 40,2 s | sự kiện hài + cơ chế | `V09_butter_baton.md` |
| V10 | How This Bug Disappears In A Blink | 38,3 s | cơ chế sinh học | `V10_bug_disappears.md` |

**Cách đã kiểm:**
- **Hình:** cả 10 video đều được xem trọn ở 4 khung/giây (ảnh lưới có mốc thời gian). Riêng V01 và V10 có thêm kiểm từng khung 30 fps quanh 14 chỗ chuyển cảnh. Dò cắt bằng công cụ `cong_cu/do_cat_canh.py` rồi đối chiếu bằng mắt.
- **Tiếng:** chép lời bằng ASR (parakeet-tdt-0.6b-v2, chạy trên máy), đo loudness EBU R128, đo khoảng lặng, mức nền, phổ âm, F0 thô. **Chưa nghe trực tiếp video nào** vì môi trường không phát được âm thanh. Vì vậy những gì về nhạc, SFX và cảm xúc giọng đều ở mức suy luận hoặc chưa biết.
- **Không có trong bộ mẫu:** video dài, video tổng hợp. Cả 10 đều là video ngắn dọc, nên mọi quy tắc nhịp dưới đây chỉ áp dụng cho video ngắn.

**Mẫu chính đề xuất: V10** (lý do ở `V10_bug_disappears.md`). **Mẫu phụ cho dạng kể chuyện có thật: V01.** Cả 10 video dùng cùng một cách sản xuất (3D CG, máy chuyển động, phụ đề chung), chỉ khác công thức kịch bản. Vì vậy **không cần hỏi chọn mẫu**.

## 1. Đặc điểm lặp lại trong bộ mẫu
| # | Đặc điểm | Bằng chứng | Số video có |
|---|---|---|---|
| 1 | Khung 9:16, 1080×1920, 29,97 fps (V04 là 30) | ĐO ffprobe | 10/10 |
| 2 | Thời lượng 23,8–68,4 s; trung vị 38,6 s; 8/10 nằm trong 28–52 s | ĐO | — |
| 3 | **Lời bắt đầu ngay ở 0,00 s**, không logo mở, không tiêu đề | ĐO ASR + QS | 10/10 |
| 4 | **Khung đầu đã có hành động** liên quan trực tiếp tới câu đầu | QS | 10/10 |
| 5 | Phụ đề trắng đậm, viền đen mảnh, bóng đổ, căn giữa, tâm y ≈ 0,78 khung (1481–1505 px), cao ≈ 70 px (V04: 57 px); 1–4 từ mỗi lần; đổi theo cụm lời | ĐO 122 khung + QS | 10/10 |
| 6 | Không có lời kêu gọi đăng ký hay outro; đuôi sau từ cuối 0,26–0,97 s (trung vị ≈ 0,65 s) | ĐO | 10/10 |
| 7 | **Kết bằng hình có trò đùa, mỉa mai hoặc tạo cảm xúc** quay về câu mở (người ngơ ngác, ngất, chống nạnh, ảnh hài, huy chương cho em bé gục…) | QS | 9/10 (V01 kết bi kịch) |
| 8 | Thương hiệu kênh **đặt trong cảnh** (logo trên tường, áo, sàn, cửa, biển, mũ, hộp diêm); không có watermark góc | QS | 8/10 (không thấy ở V03, V09) |
| 9 | Hình 3D CG có ánh sáng mềm, độ sâu trường ảnh nông ở cảnh cận; người bán tả thực hoặc hoạt hình nhẹ; động vật, đồ vật, mô tả thực | QS | 10/10 |
| 10 | **Máy hầu như luôn chuyển động** (đẩy, lùi, lia, bay xuyên vật); thời gian máy đứng yên trung vị ~11 % | ĐO luồng quang học (0–36 %) | 10/10 |
| 11 | **Chuyển cảnh chủ yếu giấu cắt trong chuyển động**: lia/ngửa máy nhanh có nhoè 4–7 khung; máy xuyên qua vật (mặt nước, da, màn hình, cổng); hoà hình giữ nguyên vị trí vật giải thích; cắt cứng nối theo hướng chuyển động | QS + kiểm khung (V01, V10) | 10/10 |
| 12 | **Chuyển "ép ngang qua đen"** (hình co thành dải dọc rồi mở ra) dùng cho một bước nhảy lớn về thời gian hoặc địa điểm | kiểm khung V01 23.16; QS V06 32.5, V09 17.25 | 3/10 |
| 13 | Độ dài cảnh trung bình mỗi video 1,6–2,7 s (trung vị các video ≈ 2,0 s) | QS ±0,25 s (đếm cảnh) | 10/10 |
| 14 | **Làm nổi đúng vật đang được nói tới, đúng lúc nói**: viền phát sáng, đổi màu, vòng tròn | QS (V01 môi, V02 nhân vật, V03 quả nho, V04 cậu bé, V05 chữ xăm, V08 phim, V10 chạc nhảy) | 9/10 |
| 15 | Nhìn xuyên vật (vỏ, da trong suốt, X-quang, cửa sổ cắt, mặt cắt) khi nội dung có "bên trong" | QS V02, V03, V06, V08, V09, V10 | 6/10 |
| 16 | Chữ, số hoặc ký hiệu **3D trong cảnh**: bộ đếm, nhãn, mũi tên, âm thanh thành chữ | QS V01, V02, V03, V05, V07, V09, V10 | 7/10 |
| 17 | Nền âm liên tục (không có khoảng lặng > 0,35 s); loudness −13,2 tới −9,7 LUFS (trung vị −10,8); LRA ≤ 4,6 LU | ĐO | 10/10 |
| 18 | Có thành phần âm sắc rõ trong đoạn đuôi không lời, nên nhiều khả năng có nhạc nền tới hết video | ĐO FFT | ≥ 4/10 rõ (V01, V03, V07, V09) |
| 19 | Một giọng kể duy nhất, tiếng Anh, ngôi thứ 3 hoặc "you"; nhân vật không thoại (lời trong cảnh hiện thành chữ: V01, V07) | ĐO ASR + QS | 10/10 |
| 20 | Tốc độ lời 137–182 từ/phút cả video (trung vị ≈ 164); trong đoạn có lời 139–183 | ĐO | 10/10 |

## 2. Công thức mở đầu quan sát được (không ép một công thức)
| Kiểu mở | Video | Câu đầu (nguyên văn) |
|---|---|---|
| Vào giữa hành động kỳ lạ, giải thích sau | V01, V04, V09 | "She started filling the rooms with water…" / "He walked to the corner… farted loudly, but nobody reacted." / "They would pour heavy cream into the baton…" |
| Hiện tượng lạ ở ngôi "you" | V10 | "When you touch the bug, it disappears into thin air." |
| Câu điều kiện có lời hứa bất ngờ | V03 | "If you place two grapes together in a microwave… you might be surprised by what happens." |
| Câu hỏi "what if" dài, mỗi vế có hình | V02, V06 | "If Bugman shrunk down…, would it pop him…?" / "If a hummingbird's heart is removed…, could it…?" |
| Vật có chữ (đọc to nội dung chữ) | V05 | "His tattoo said, you'll never walk alone." |
| Khám phá kỳ lạ (hư cấu) | V07 | "He finally reached the edge of the universe, but it was an enormous white wall…" |
| Lệnh hành động (tự làm) | V08 | "Slide out the tray and cut a small window in its center." |

Điểm chung (10/10): câu đầu **có chủ thể cụ thể và một hành động nhìn thấy được**, không mở bằng định nghĩa hay bối cảnh chung chung. Người xem hiểu tiền đề trong 2–11 s.
- Đọc đúng một câu: V10 ~2,2 s, V05 ~2,6 s.
- Câu hỏi dài: V02 11 s, V06 10,8 s.
- V01 cố tình để tiền đề tới 17 s, trong khi vẫn đẩy liên tục bằng chuyện lạ.

Từ nối "You see," xuất hiện ở V03, V04, V09 để chuyển sang phần giải thích. "Well," mở câu trả lời ở V02, V06, V10.

## 3. Ngữ pháp hình (cách hình giải thích lời)
1. **Mỗi danh từ hoặc động từ quan trọng có một hình hoặc thay đổi riêng**, xuất hiện cùng lúc hoặc trước lời 0–0,3 s (QS: "a grape" thì nho sáng viền, "tank" thì bể sáng viền, "fork-shaped" thì chạc sáng viền, "30 times" thì bộ đếm chạy).
2. Khi cần giải thích, **tách chủ thể ra nền studio trơn** (xanh trời vignette: V02, V10; trắng xanh: V09; lưới hologram: V03), xong thì quay lại bối cảnh thật.
3. **Đổi thang đo liên tục**: ngoài → trong (da, vỏ) → vi mô (phân tử, hạt mỡ), thường bằng một cú đẩy máy liên tục, không cắt (V03 12.5–17.25, V02 05.5–06.25).
4. **Thiết bị so sánh**: cần cẩu (tỉ lệ), lịch lật (thời gian), đồng hồ bấm giờ, bộ đếm, chớp mắt (tốc độ).
5. **Âm thanh và lời nói trong cảnh hiện thành chữ 3D phát sáng** (HI, H-E-E-E, 你真可爱) hoặc vòng sóng (tiếng xì hơi V04).
6. **Hình người hologram làm mẫu một hành động giả định** (V04).
7. Cơ chế được thể hiện đủ 4 bước (trạng thái đầu → tác nhân → tương tác → kết quả) ở V03 và V10. V02 và V06 thể hiện từng giả thuyết rồi bác bỏ.

## 4. Thiết kế hình
- **Kiểu hình:** 3D CG dựng sẵn (không phải 2D, không phải quay thật). Chất lượng render tương đương path tracing hoặc engine thời gian thực cao cấp: bóng mềm, khúc xạ nước và thuỷ tinh, SSS da, độ sâu trường ảnh (QS). Phần mềm gốc **chưa biết**; không suy ra từ ngoại hình.
- **Nhân vật:** tỉ lệ người thật, đầu và mắt hơi to ở một số video (V04, V05, V09), da mịn, tóc dạng mảng. Có thể là nhân vật dựng từ bộ tạo nhân vật thương mại (SL, độ tin thấp, không đủ bằng chứng). Nét mặt cường điệu khi phản ứng (há miệng, mắt mở to).
- **Màu:** mỗi video có 1–2 màu chủ đạo bão hoà vừa tới cao (xanh lam, xanh ngọc, cam đỏ); bão hoà trung vị các video 49–160 (trung vị ≈ 98); độ sáng 89–193 (trung vị ≈ 154) (ĐO HSV). Thiết bị giải thích dùng màu phát sáng tương phản với nền (xanh lá, tím, đỏ, vàng, trắng).
- **Bố cục:** chủ thể ở 2/3 trên khung; dải y 0,74–0,84 dành cho phụ đề; chủ thể chiếm 40–80 % khung ở cảnh cận. Nền ít chi tiết, nhiều mặt trơn.

## 5. Âm thanh (ở mức đo được)
- Integrated −10,8 LUFS trung vị (dải −13,2 tới −9,7); true peak sau giải mã từ 0 tới +2,2 dBFS. Bản tải xuống có thể đã bị nén lại, nên **không dùng TP làm chuẩn**; ĐX giao −11 LUFS, TP ≤ −1 dBTP.
- Nền âm dày: mức khi không lời chỉ thấp hơn khi có lời 0,9–8,3 dB (trung vị ≈ 4,2 dB). Đây là số đo toàn bộ mix, **không phải mức nhạc riêng**.
- Giọng: F0 thô trung vị 140–204 Hz giữa các video (nhạc nền làm nhiễu). Chưa xác định được giọng thật hay giọng tổng hợp, một người hay nhiều người (?). **Cần chủ dự án nghe và mô tả**, hoặc cung cấp giọng.

## 6. Khác biệt riêng từng tập (không đưa vào quy tắc chung)
- V07: dài 68 s, nhịp lời chậm 137 từ/phút, ngắt tới 2,2 s, bão hoà thấp, chuyển cảnh mở mắt. Dành cho dạng hư cấu.
- V08: tối, máy đứng yên nhiều, lời dạng lệnh, âm thanh bitrate thấp. Dành cho dạng hướng dẫn.
- V04: 30 fps, phụ đề nhỏ hơn.
- V02: dùng nhân vật dựa trên tài sản trí tuệ có sẵn đã đổi tên. **Không áp dụng cho dự án này.**

## 7. Giả định chưa kiểm về kênh (không dùng làm quy tắc)
- Kênh có đội đông người, chi phí mỗi video cao (nguồn thứ cấp, chưa kiểm).
- Phần mềm, bộ nhân vật, giọng đọc, nhạc của kênh gốc: **chưa biết**.

## 8. Những chỗ làm lại dễ lệch khỏi mẫu nhất (xếp theo mức nghiêm trọng)
1. **Chất lượng render và nhân vật.** Đây là khoảng cách lớn nhất. Engine WebGL đơn giản của P01 cho bóng, da, nước, độ sâu trường ảnh kém xa mẫu.
2. **Hình không "giải thích".** Nếu chỉ minh hoạ chung chung, thiếu làm nổi đúng lúc, thiếu nhìn xuyên vật, thiếu bộ đếm, video sẽ thành explainer 3D bình thường.
3. **Máy đứng yên, cắt cứng thô.** Mẫu giấu cắt trong chuyển động máy.
4. **Kịch bản mở bằng bối cảnh** thay vì hành động lạ, hoặc thiếu cú kết quay về câu mở.
5. **Giọng và nhạc.** Chưa nghe được mẫu nên đây là phần dễ lệch nhất về cảm xúc.
6. Phụ đề sai vị trí hoặc cỡ (dễ sửa).
