# P02 — Kênh hài cặp đôi (Project "Tình yêu"), tiếng Anh cho khán giả Mỹ

Trạng thái 14/11/2026: kịch bản E01 "Just one thing" ĐÃ DUYỆT (giữ tên "Target" trong lời). Nhân vật v2 chờ duyệt. Tên kênh: chưa.
Kịch bản: Claude Doc "Couple Humor (US) — E01" (https://claude.ai/artifact/Prsb3V1uDQ8PkrPNLvk2tb).

## Khuôn kênh (mẫu @suppose.there.was.time)
Ngôi thứ hai, giọng đều/khô/mệt (deadpan, ~130–140 từ/phút, ngừng trước câu đấm), hook "Your girlfriend…", 3–4 nấc leo thang, twist + câu đuôi. Chửi thề = bíp. Nhạc: một bản piano buồn CC0 cố định.

## Nhân vật (dùng chung engine của P01: du_an/P01_sport_usa_whatif/engine)
- `lib/cast_ty.js` — HIM (tóc xoăn nâu, hoodie xanh xô thơm, quần nỉ xám) / HER (tóc đỏ cam, áo len vàng mù tạt, jean ống suông), bộ biểu cảm FACES.
- `lib/toy.js` — `dressToy`: quần áo RỜI (lớp vỏ skinned dáng suông, thu thân bên trong để không đâm xuyên, dẹt ngực với flatChest), da phẳng, đầu to headK 2,25, chân ngắn legK 0,84.
  `ch.post({ground})` PHẢI gọi mỗi khung sau khi đặt tư thế (ground:true khi đứng, false khi ngồi). `sofaSit()` tư thế ngồi sofa.
- `ty_cast.html` — ảnh kiểm 13 ô. Đèn mặt trời cần `shadow.bias=-0.0004, normalBias=0.03` (không thì mặt bị sọc).
- nhanvat2.js: thêm `lidSkin` (màu mí đã bù ánh sáng), mí khép tô trong hình mắt.

## Đã sửa (14/11, v3)
- Đổi tư thế viết tay ↔ clip: mixer three chỉ ghi xương khi giá trị khác lần trước → dùng `ch.at(t)` (nhanvat2.js) thay cho `mixer.setTime(t)`: đặt thời điểm + ép ghi. Dùng cho MỌI shot (P01 cũng nên dùng).
- Cổ áo: cắt theo mặt phẳng nghiêng (`neckDrop`, `neckTilt`) + ống bo cổ `TubeGeometry` gắn spine_03; bỏ tam giác thân nằm trọn dưới quần áo (hết đốm/đâm xuyên); mặt trong áo tô tối.
- Mảng sáng quanh miệng: `lipSkin` đã bù ánh sáng.
