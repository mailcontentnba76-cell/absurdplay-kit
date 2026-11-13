# 10 Thing USA — E01 "10 Weird Things About Nikola Jokić" (kênh Locker Room Weird)

Trạng thái 14/11/2026: kịch bản ĐÃ DUYỆT, nhân vật ĐÃ DUYỆT, 10 bối cảnh đã dựng (ảnh xem trước 26 shot). Đang chờ mp3 giọng Magnific.

## Khuôn kênh (phân tích @whyguystories)
- "10 Weird Things About [sao]" 32–55 s, đếm ngược 10→1, câu nối First / Next / But even weirder / And on top of that / "But that still isn't as weird as…" (điều kỳ quặc nhất để cuối).
- Lựa chọn của chủ kênh: hook "10 weird things you didn't know about…" (không WTF), phụ đề VÀNG #F5F500, watermark "Locker Room Weird".

## File
- `engine/lib/cast10.js` — Jokić biếm hoạ (Nuggets #15, 2,11 m, mí nặng, mắt xanh xám, râu VẼ lên da `paintBeard`), áo Icon navy DENVER / Association trắng NUGGETS, đồ thường.
- `engine/lib/t10_sets.js` — phòng khách+TV, phòng ngủ, bếp+taco, tháp chai SODA 3L, gym+LED, ngựa low-poly, chuồng ngựa, phòng dụng cụ, phố diễu hành+xe buýt CHAMPIONS, trường đua Sombor + ngựa kéo xe.
- `engine/t10e01.html` + `t10e01_shots.js` (mốc TẠM, thay bằng whisper). `engine/t10_jokic.html` = ảnh kiểm nhân vật.
- `engine/lib/nhanvat2.js` thêm: `paintBeard`, `backRaise`, mặt vẽ mờ dần ở góc nghiêng.

## Lỗi đã gặp
- Nhân vật đổi khu (x xa) có lúc không hiện: renderer không cập nhật xương → trong renderFrame gọi `s.updateMatrixWorld(true)` + `skeleton.update()` cho nhân vật đang hiện trước khi render.
- Khung dọc hẹp: máy phải bám theo nhân vật (`follow`) ở shot di chuyển.

## Việc tiếp
1. Nhận mp3 → rut_nghi.py → whisper → thay mốc SH theo từng câu.
2. Làm `t10e01_gfx.html`: huy hiệu đếm ngược (kiểu riêng, không vòng tròn trắng như Why Guy), phụ đề vàng, watermark Locker Room Weird.
3. Sửa: chai nước lên tới miệng (d2), đầu ngựa chạm vách (g1), shot ngủ thấy mặt (b1). Thêm shot cho đủ nhịp ~1,5 s.
4. Bản cắt thử 540x960 → duyệt → render đủ.

## Cập nhật 14/11 00:40 — bản cắt thử
- Giọng: Magnific Sport USA, 52,6 s, 173 từ/phút (không atempo). Kịch bản nhập "Yokich" để đọc đúng; phụ đề ghi "Jokić". Mốc từ: `chu/words.json`.
- Chủ kênh chốt: CHỈ hook có màn hài (Jokić ngủ gật mà vẫn dẫn bóng → bóng nảy trúng chân lăn đi → giật mình → nhún vai). Các cảnh sau theo kịch bản.
- Đồ hoạ `engine/t10e01_gfx.html`: huy hiệu đếm ngược hình áo đấu vàng viền navy (riêng của kênh), watermark LOCKER ROOM WEIRD, phụ đề vàng (`t10e01_subs.js`, sinh từ words.json, ngắt ở dấu phẩy), "Z z z" khi ngủ.
- Nhạc: alvana-audio `music/funk/sleep.mp3` (HoliznaCC0, CC0), bắt đầu từ giây 2, volume 0.16, loudnorm −14 LUFS.
- Bản cắt thử: 15 fps 540x960 nomb → `E01_jokic_cat_thu.mp4` (đã gửi chủ kênh, chờ duyệt lần 2).
