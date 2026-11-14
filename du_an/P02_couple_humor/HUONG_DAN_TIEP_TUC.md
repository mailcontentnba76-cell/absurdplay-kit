# P02 — Kênh hài cặp đôi (Project "Tình yêu"), tiếng Anh cho khán giả Mỹ

Trạng thái 14/11/2026: kịch bản E01 "Just one thing" ĐÃ DUYỆT (giữ tên "Target" trong lời). Nhân vật v2 chờ duyệt. Tên kênh: chưa.
Kịch bản: Claude Doc "Couple Humor (US) — E01" (https://claude.ai/artifact/Prsb3V1uDQ8PkrPNLvk2tb).

## Khuôn kênh (mẫu @suppose.there.was.time)
Ngôi thứ hai, giọng đều/khô/mệt (deadpan, ~130–140 từ/phút, ngừng trước câu đấm), hook "Your girlfriend…", 3–4 nấc leo thang, twist + câu đuôi. Chửi thề = bíp. Nhạc: một bản piano buồn CC0 cố định.

## Nhân vật (dùng chung engine của P01: du_an/P01_sport_usa_whatif/engine)
- `lib/cast_ty.js` — HIM (tóc xoăn nâu, hoodie xanh xô thơm, quần nỉ xám) / HER (tóc đỏ cam, áo len vàng mù tạt, jean ống suông), bộ biểu cảm FACES.
- `lib/toy.js` — `dressToy`: quần áo RỜI (lớp vỏ skinned dáng suông, thu thân bên trong để không đâm xuyên, dẹt ngực với flatChest), da phẳng, đầu to headK 1,6 (v4: bỏ rút chân — 2,25 + legK 0,84 bị chê lùn).
  `ch.post({ground})` PHẢI gọi mỗi khung sau khi đặt tư thế (ground:true khi đứng, false khi ngồi). `sofaSit()` tư thế ngồi sofa.
- `ty_cast.html` — ảnh kiểm 13 ô. Đèn mặt trời cần `shadow.bias=-0.0004, normalBias=0.03` (không thì mặt bị sọc).
- nhanvat2.js: thêm `lidSkin` (màu mí đã bù ánh sáng), mí khép tô trong hình mắt.

## Đã sửa (14/11, v3)
- Đổi tư thế viết tay ↔ clip: mixer three chỉ ghi xương khi giá trị khác lần trước → dùng `ch.at(t)` (nhanvat2.js) thay cho `mixer.setTime(t)`: đặt thời điểm + ép ghi. Dùng cho MỌI shot (P01 cũng nên dùng).
- Cổ áo: cắt theo mặt phẳng nghiêng (`neckDrop`, `neckTilt`) + ống bo cổ `TubeGeometry` gắn spine_03; bỏ tam giác thân nằm trọn dưới quần áo (hết đốm/đâm xuyên); mặt trong áo tô tối.
- Mảng sáng quanh miệng: `lipSkin` đã bù ánh sáng.
- v4 (14/11): miệng/cằm khối đầu chiếu lên mặt bậc hai nội suy từ má (`flatMouth`) — hết bóng 'râu' ở nữ, nét miệng không bị môi 3D cắt; làm mượt đầu lại (head 16).
- Ngồi: `ch.seatPad` = bán kính đùi + quần → hông cao hơn đệm (không lún ghế); cẳng chân tự chọn góc cho bàn chân chạm sàn. Ghế thử: mặt đệm 0,42 m.
- v5 (14/11) trang phục Mỹ hiện đại, KHÔNG mũ (chủ kênh bỏ mũ): Anh = gile phao navy chần bông (`outer`) + sơ mi flannel caro đỏ–than (`pattern.type:'plaid'`) + jean ống suông + sneaker trắng; Cô = áo nỉ kem in chữ "SUNDAY club" (`pattern.print`) + legging đen (`bottom.fit`) + sneaker trắng viền xô thơm.
  Họa tiết vẽ bằng shader theo vị trí tư thế gốc (thuộc tính `bpos`), không trôi khi cử động. Có sẵn `stripes`. Giày `shoes`, áo ngắn tay `top.sleeve:'short'`. Mã mũ lưỡi trai `cap` vẫn còn trong toy.js nhưng không dùng.
- v6 (14/11): cổ tròn áo nỉ = áo phủ quá cổ rồi KHOÉT bằng shader (mặt phẳng cổ ∩ elip quanh cổ, `neckOpen`), chỉ ôm sát quanh lỗ cổ; gấu áo cắt thẳng bằng shader (`hem`) + bo gấu vẽ shader (`bandH`). Gile mỏng (off 0,013), đường chần vẽ shader (stripes), dây vai hẹp (`strap`), bỏ khoá kéo.
