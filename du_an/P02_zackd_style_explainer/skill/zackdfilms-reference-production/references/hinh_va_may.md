# Hình, nhân vật, thiết bị giải thích, máy, chuyển cảnh

## 1. Kiểu hình
3D CG chất lượng cao: ánh sáng mềm, bóng mềm, phản chiếu và khúc xạ (nước, thuỷ tinh), da có tán xạ dưới bề mặt, độ sâu trường ảnh nông ở cảnh cận (QS 10/10). Không phải 2D, không phải quay thật, không phải ảnh tĩnh được lia hay zoom.

**Prompt nền (tiếng Anh) cho ảnh khung đầu:**
`high-end 3D CG animation still, physically based rendering, soft key light, gentle bounce light, shallow depth of field, clean uncluttered background, subtle film-like contrast, vertical 9:16 composition, subject in upper two thirds, lower 25% of frame kept clear for captions`
Kèm mô tả nhân vật cố định (mục 2) và câu riêng của shot.

## 2. Nhân vật và vật thể nhất quán
- Người: tỉ lệ thật, mắt và đầu hơi to được phép (V04, V05, V09); da mịn; tóc dạng mảng; nét mặt phản ứng cường điệu (há miệng, mắt mở to). Quần áo đơn giản, màu khối.
- Mỗi nhân vật có **một ảnh tham chiếu chính** (chính diện, toàn thân, nền trơn) và một đoạn mô tả tiếng Anh cố định. Dùng cùng ảnh và cùng đoạn mô tả cho mọi shot.
- Động vật, vật thể, mô: tả thực; kích thước và hình khối đúng (kiểm bằng ảnh tham khảo thật trước khi tạo).
- Bối cảnh: ít chi tiết thừa, mặt trơn, 1–2 màu chủ đạo. Nền studio vô cực (xanh trời có vignette) cho đoạn giải thích.

## 3. Thiết bị giải thích (chỉ dùng khi nội dung cần, không trang trí)
| Thiết bị | Mẫu | Cách làm (ĐX) |
|---|---|---|
| Viền phát sáng hoặc vòng tròn quanh vật đang được nói tới | V01 môi, V02, V03, V04, V05, V08, V10 | Blender: vỏ ngoài emission chỉ hiện mặt sau (EEVEE, đã thử). Trên clip AI: tách nền chủ thể (video_remove_background) → nở viền → phát sáng → ghép (**chưa thử**) |
| Vật trong suốt, X-quang, cửa sổ cắt, ngực mở | V02, V03, V06, V09, V10 | Blender (vật liệu trong + emission cạnh), hoặc cặp ảnh khung đầu/khung cuối cho Kling |
| Thay đổi thang đo (ngoài → trong → vi mô) bằng một cú đẩy máy | V02, V03 | máy Blender đi xuyên vật; hoặc hai clip nối bằng hoà hình giữ vị trí |
| Nền studio tách chủ thể khỏi bối cảnh | V02, V10 | mặt nền cong + vignette |
| Bộ đếm, nhãn, thước đo, mũi tên chữ V, mũi tên lực | V03, V09, V10, V02 | chữ 3D emission trong Blender, xuất PNG có alpha, đặt trong không gian cảnh |
| Âm thanh hoặc lời nói thành chữ 3D, vòng sóng | V01, V04, V07 | như trên |
| Người hologram làm mẫu hành động giả định | V04 | bản sao nhân vật, vật liệu xanh trong suốt |
| Thiết bị thời gian (lịch lật, đồng hồ bấm giờ) | V01, V09 | đạo cụ có chữ thay theo khoá |

Mỗi thiết bị phải: xuất hiện cùng lúc hoặc trước từ khoá 0–0,3 s; giữ người xem định hướng (luôn còn một phần vật quen thuộc trong khung); nói rõ đây là sơ đồ hay hình theo tỉ lệ thật.

## 4. Chuyển động
- Hành động có đủ: tư thế đầu → lấy đà → chuyển động → chạm → dư chuyển động → trạng thái cuối. Tay cầm khớp vật, chân chạm đất, vật không biến mất giữa chừng.
- Cơ chế: các bộ phận chuyển động phải **gây ra** kết quả được nói tới.
- **Không** thay chuyển động thật bằng zoom hay lia trên ảnh tĩnh.

## 5. Máy và chuyển cảnh
- Máy luôn có đường đi: đẩy vào chủ thể khi giải thích, lùi ra để hé lộ quy mô hay hậu quả, bám theo vật bay, bay xuyên vật (mặt nước, da, màn hình, cổng). Đứng yên ≤ 30 % thời gian, chủ yếu ở đặc tả cần đọc chữ.
- Chuyển cảnh (theo thứ tự hay gặp):
  1. **Lia nhoè**: 4–7 khung, nhoè theo hướng lia, điểm cắt nằm giữa đoạn nhoè. Làm trong lúc dựng: dịch khung + nhoè hướng ở 3 khung cuối của clip A và 3 khung đầu của clip B, cùng hướng.
  2. **Máy xuyên vật**: dựng liên tục trong 3D, hoặc nối bằng khung giống nhau.
  3. **Hoà hình giữ vị trí**: vật giải thích đứng yên một chỗ trên màn hình, nền đổi, khoảng 6 khung.
  4. **Cắt cứng nối hướng**: hai cảnh cùng hướng chuyển động.
  5. **Ép ngang qua đen**: chỉ cho bước nhảy lớn về thời gian hoặc địa điểm, 3–4 khung.
- Cắt theo từ khoá hoặc theo lúc hành động chạm. Không cắt mất chữ đang nói.

## 6. Bố cục
- Chủ thể ở 2/3 trên khung. Dải y 0,74–0,84 dành cho phụ đề.
- Cảnh cận: chủ thể chiếm 40–80 % khung. Nền mờ nhờ độ sâu trường ảnh.
- Tránh đặt chi tiết quan trọng sau phụ đề.
