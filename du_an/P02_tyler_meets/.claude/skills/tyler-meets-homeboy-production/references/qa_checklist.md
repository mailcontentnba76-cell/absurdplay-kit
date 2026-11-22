# QA checklist (soát trước mỗi lần gửi)

## Kịch bản (trước khi chốt)
- [ ] Cold open 1–2 s đúng tính cách; câu nhân vật to, cảm xúc, ngắn. Câu thứ hai là "What the fuck is wrong with this dude?" (Tyler).
- [ ] "This is <tên>." xuất hiện trong ~8 s đầu.
- [ ] 4 bối cảnh mới, không trùng bảng "đã dùng".
- [ ] Có cú lật và câu chốt 3 vế; sandwich của Tyler bị phá.
- [ ] Thoại vai phụ ≤ 8 từ; không chê ngoại hình, sắc tộc; thương hiệu thật chỉ được nhắc tên.
- [ ] Có bản liền mạch, bảng cảnh, tiêu đề đăng.

## Giọng
- [ ] Tiếng miệng đúng chữ khi qua ASR (16 kHz!), đọc nhanh và liền, không kéo dãn thời gian.
- [ ] Giọng nhân vật không rề rà (stability 0.12, speed 1.12 cho vai hét hoặc hype).
- [ ] Tổng 68–77 s; khoảng nghỉ giữa câu 0.45 s; câu chốt nghỉ 1.0 s.

## Blender (trước khi render đủ)
- [ ] Ảnh thử 4 bối cảnh trống: dày chi tiết, có chi tiết mới lạ, trời và ánh sáng đúng.
- [ ] Màu áo nhân vật chính tách khỏi nền (tường, sàn).
- [ ] `--check` chỉ còn tiếp xúc có chủ ý.
- [ ] Ảnh thử **mọi cảnh**, soát từng ô:
  - camera có phía trước mặt không (không quay lưng trừ cảnh qua vai)?
  - có bị cột, cây, xe, vai phụ, tường che không?
  - đầu có bị cắt không?
  - đồ vật trong cảnh cận có rõ không (không bị tay che, màu tách khỏi áo)?
  - hành động chính có thấy được ở giữa cảnh không (vd. lúc giật đồ)?
- [ ] Vai phụ đều cử động; người đi quay mặt theo hướng đi.
- [ ] Cảnh cận nhân vật nữ: lọn tóc không che mặt.

## Thành phẩm
- [ ] `check_cuts`: cut drift none, frozen none, jump cut none (trừ chuỗi màn hình điện thoại cố ý).
- [ ] Âm lượng khoảng −16.5 ± 0.5 LUFS, peak ≤ −1 dBFS; nhạc V07 −9.5 dB.
- [ ] Bảng 24 khung hình: không chữ ngược, không hạt nhiễu, không cảnh trống hoặc lỗi.
- [ ] Phụ đề không tràn khung, từ khóa vàng đúng chỗ; số hiển thị đúng (vd. "GTA 6").
- [ ] Không có chữ hay đồ họa nào ngoài phụ đề.
- [ ] `<ID>_post.txt` chỉ 1 dòng tiêu đề tiếng Anh.

## Lỗi người dùng từng bắt (không để lặp lại)
| Lỗi | Cách sửa đã áp dụng |
|---|---|
| Nhân vật đi lùi | `walk()` tự quay theo hướng đi |
| Chân, người kẹt vào tường hoặc đồ vật | `--check` + đặt lại vị trí |
| Hạt nhiễu trên hình | tắt raytracing, 64 mẫu, filter 1.0 |
| Chuyển động giật | idle v2 giữ dáng 40–75 khung + thở |
| Đầu vuông hoặc chưa đủ tròn | sọ hình cầu, mũ tóc hình cầu |
| Camera quá sát, không thấy bối cảnh | kéo lùi ×1.3, lens ×0.82 cho cảnh không cận |
| Mở đầu nhàm, có thể bị lướt | cold open hành động thật to + câu "What the fuck…" |
| Giọng nhân vật rề rà | stability thấp, speed 1.12 |
| "Hush" đọc chậm hoặc sai chữ | viết gạch nối, đọc liền, speed 1.15, kiểm ASR |
| Font phụ đề quá to, tràn | cỡ H×0.033, tự co 84 % chiều rộng |
| Chữ trên biển bị ngược | `tex_quad` lật U ở mặt sau |
| Cận đồ vật bị tay che hoặc không rõ | vật đặt theo tọa độ thế giới trên lòng bàn tay, nhiều lớp màu, lùi camera |
| Cảnh trống, nhàm | thêm chi tiết mới lạ mỗi bối cảnh, vai phụ cử động |
| Thêm chữ hay đồ họa lên video | chỉ phụ đề; tiêu đề nằm trong file post.txt |
