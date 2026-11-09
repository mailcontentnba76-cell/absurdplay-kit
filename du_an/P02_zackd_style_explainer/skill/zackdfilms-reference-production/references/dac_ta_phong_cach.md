# Đặc tả phong cách P02 (từ 10 mẫu)

Độ tin: **Cao** = thấy ở ≥ 8/10 mẫu hoặc đo nhất quán · **TB** = 4–7/10 · **Thấp** = ≤ 3/10 hoặc chỉ là suy luận.
Ưu tiên: **1** = thiết yếu (thiếu là không còn giống mẫu) · **2** = hỗ trợ · **3** = riêng từng tập.

| # | Quy tắc | Bằng chứng | Độ tin | Ưu tiên | Cách làm | Kiểm nghiệm thu |
|---|---|---|---|---|---|---|
| 1 | Lời bắt đầu ở 0,00 s, không intro hay logo | ĐO ASR 10/10 | Cao | 1 | giọng đặt tại 0 trên timeline | từ đầu tiên ≤ 0,10 s |
| 2 | Khung đầu đã có hành động khớp câu đầu | QS 10/10 | Cao | 1 | shot 1 = hành động của câu 1 | xem khung 0 |
| 3 | Câu đầu có chủ thể cụ thể và hành động nhìn thấy được | QS 10/10 | Cao | 1 | `kich_ban.md` mục 1 | đọc kịch bản |
| 4 | Tiền đề hiểu được trong ≤ 11 s (thường 2–3 s) | ĐO | Cao | 1 | — | đo mốc từ |
| 5 | Có câu hỏi treo, được trả lời trước khi hết video | QS 10/10 | Cao | 1 | — | bảng chức năng câu |
| 6 | Kết bằng hình trả lại câu mở (hài, mỉa mai hoặc cảm xúc); không lời kêu gọi | QS 9–10/10 | Cao | 1 | shot cuối được thiết kế riêng | xem 2 s cuối |
| 7 | Mỗi danh từ hoặc động từ then chốt có hình hoặc thay đổi riêng, đúng lúc nói | QS 10/10 | Cao | 1 | bảng shot: cột "từ khoá → thay đổi" | lệch ≤ 0,3 s |
| 8 | Làm nổi vật đang được nói tới bằng viền phát sáng, vòng tròn hoặc đổi màu | QS 9/10 | Cao | 1 | `hinh_va_may.md` mục 3 | có ở mọi cảnh giải thích |
| 9 | Nhìn xuyên vật (trong suốt, X-quang, cửa sổ cắt) khi có "bên trong" | QS 6/10 | TB | 1 với nội dung cơ chế | Blender, hoặc ảnh khung đầu/khung cuối | cơ chế đọc được |
| 10 | Chữ, số, ký hiệu 3D trong cảnh (bộ đếm, mũi tên, nhãn, lời nói thành chữ) | QS 7/10 | TB–Cao | 2 | Blender có alpha, hoặc ghép 2D có bóng | chữ đọc được ≥ 0,7 s |
| 11 | Hình 3D CG ánh sáng mềm, độ sâu trường ảnh nông ở cảnh cận; người bán tả thực hoặc hoạt hình nhẹ; vật và mô tả thực | QS 10/10 | Cao | 1 | `cong_cu.md` | so cạnh mẫu cùng loại cảnh |
| 12 | Máy hầu như luôn chuyển động; đứng yên ≤ 30 % | ĐO 0–36 %, trung vị ~11 % | Cao | 1 | mỗi shot có đường máy | `phan_tich_mau.py` |
| 13 | Chuyển cảnh giấu trong chuyển động (lia nhoè 4–7 khung, máy xuyên vật, hoà hình giữ vị trí, cắt nối hướng) | QS 10/10, kiểm khung V01 và V10 | Cao | 1 | `hinh_va_may.md` mục 5 | ≥ 50 % chuyển cảnh không phải cắt trơn |
| 14 | Cảnh trung bình 1,5–2,7 s | QS ±0,25 s | Cao | 1 | theo mốc từ | đếm cảnh |
| 15 | Phụ đề trắng đậm, viền đen mảnh, bóng đổ, tâm y ≈ 1505 px, cao ≈ 70 px, 1–4 từ | ĐO 122 khung | Cao | 1 | `tao_phu_de_p02.py` | `do_phu_de.py` |
| 16 | Tốc độ lời 145–183 từ/phút (giải thích: 160–183); video hư cấu chậm hơn | ĐO | Cao | 1 | chọn giọng và tốc độ | ASR |
| 17 | Nền âm liên tục, không lặng; −10 tới −13 LUFS | ĐO 10/10 | Cao | 2 | nhạc nền + SFX | ebur128 |
| 18 | Thời lượng 28–52 s (giải thích); hư cấu tới ~70 s | ĐO | Cao | 2 | theo kịch bản | — |
| 19 | Thương hiệu đặt trong cảnh, không watermark góc | QS 8/10 | Cao | 3 | theo ý chủ dự án | — |
| 20 | Chuyển "ép ngang qua đen" cho bước nhảy lớn về thời gian hoặc địa điểm | QS 3/10 | Thấp | 3 | hiệu ứng trong Kdenlive hoặc ffmpeg | — |
| 21 | Màu chủ đạo bão hoà vừa tới cao (trung vị ~98), sáng (~154); thiết bị giải thích dùng màu phát sáng tương phản | ĐO | TB | 2 | chỉnh màu | `phan_tich_mau.py` |

## Chưa biết về cách làm gốc (không giả định)
Phần mềm 3D và render, nguồn nhân vật, font phụ đề, giọng đọc (người thật hay tổng hợp), nhạc và SFX, quy trình đội ngũ.

## Thay thế đề xuất (ĐX)
- Font: Inter ExtraBold.
- Hình: ảnh khung đầu + tạo video từ ảnh (Kling 2.5 / Seedance 2.5), kết hợp Blender EEVEE cho cảnh cơ chế.
- Giọng: TTS (Magnific eleven_v4) hoặc giọng chủ dự án cung cấp.
- Nhạc, SFX: tạo bằng Magnific hoặc thư viện có giấy phép.
