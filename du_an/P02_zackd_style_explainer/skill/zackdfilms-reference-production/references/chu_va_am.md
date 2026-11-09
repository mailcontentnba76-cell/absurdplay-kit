# Phụ đề, chữ trong cảnh, giọng, nhạc, SFX, xuất

## Phụ đề (ĐO trên 122 khung mẫu)
- Chữ trắng, đậm, không chân; viền đen ~2–3 px; bóng đổ tối mềm lệch xuống dưới bên phải; căn giữa.
- Tâm vùng chữ y ≈ 1505 px (0,784 của 1920); chiều cao vùng điểm ảnh trắng ≈ 70 px; bề rộng ≤ ~860 px.
- 1–4 từ mỗi lần, đổi theo cụm lời; bỏ dấu chấm và dấu phẩy; giữ dấu "?" và ngoặc kép.
- Không có hiệu ứng chạy chữ hay tô màu từng từ (QS 10/10).
- Font gốc chưa biết. Thay thế đề xuất: Inter ExtraBold.
- Lệnh: `python3 cong_cu/tao_phu_de_p02.py <asr.json> <ra.ass>` → kiểm `python3 cong_cu/do_phu_de.py <video> <t…>` (đạt khi tâm y 1495–1515 và cao 64–76 px).
- Chữ trong cảnh (bộ đếm, nhãn, chữ phát sáng) **khác với phụ đề**; làm trong 3D.

## Giọng
- Một giọng kể, tiếng Anh, ngôi thứ 3 hoặc "you"; nhân vật không thoại (QS 10/10).
- Tốc độ 160–183 từ/phút cho video giải thích. Ngắt dài nhất ~1 s, đặt sau câu hỏi chính (V10 1,2 s sau "disappear?").
- **Âm sắc, tuổi, cảm xúc của giọng mẫu: chưa biết** (chưa nghe được). Chủ dự án mô tả hoặc chọn giọng. F0 thô đo được 140–204 Hz, nhưng bị nhạc làm nhiễu nên không dùng để chọn giọng.
- Lời phải được đo bằng ASR. Mốc từ thật là cơ sở dựng timeline; không ước lượng.

## Nhạc và SFX
- Nền âm liên tục, không có khoảng lặng > 0,35 s (ĐO 10/10). Có âm sắc trong đoạn đuôi, nên nhiều khả năng có nhạc tới hết (ĐO ≥ 4/10).
- Mix luôn để lời rõ. Mức nền khi không lời thấp hơn khi có lời trung vị ~4 dB (số đo toàn mix, không phải mức nhạc riêng).
- Loại nhạc, nhạc cụ, SFX cụ thể: **chưa biết**. ĐX: nhạc nền nhẹ không lời, nhịp vừa; SFX ngắn cho chạm, nổ, whoosh ở lia nhoè, "ding" khi vật sáng viền. Kiểm lại khi chủ dự án mô tả mẫu.

## Xuất
- 1080×1920, 29,97 fps (mẫu 9/10; nếu brief yêu cầu thì dùng 30), H.264 High yuv420p CRF 16–18, AAC 48 kHz 192 kb/s.
- −11 ±1 LUFS, true peak ≤ −1 dBTP.
- melt: `melt -profile cong_cu/p02_1080x1920_2997.profile <project.kdenlive> -consumer avformat:<ra.mp4> vcodec=libx264 crf=17 acodec=aac ab=192k`.
