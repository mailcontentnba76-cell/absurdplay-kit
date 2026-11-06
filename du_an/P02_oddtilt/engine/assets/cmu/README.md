# Chuyển động CMU (BVH, bản Motionbuilder-friendly của cgspeed, 120 fps)
Nguồn: GitHub una-dinosauria/cmu-mocap (CMU Graphics Lab Motion Capture Database, mocap.cs.cmu.edu — dùng tự do, kể cả thương mại; ghi nguồn khuyến khích).
Dùng qua `lib/mocap.js` (`loadBVH`, `applyMocap(ch, mo, t, {pos, yaw, faceAt, inPlace, ground, lock})`).
| File | Nội dung (theo chỉ mục CMU) | Dùng cho |
|---|---|---|
| 77_02, 111_28 | đứng yên | đứng chờ, nghe |
| 77_01 | nhìn quanh | tò mò, tìm kiếm |
| 13_05, 14_30, 18_12, 22_03 | ngồi ghế/đẩu, chống cằm, ôm mặt | ngồi, chán, buồn |
| 18_10 | cãi nhau, tay khoa giận | phàn nàn ("friend complains") |
| 13_26 | vẫy tay chỉ đường | vẫy, gọi |
| 79_20 | treo tranh | treo tấm da/đồ lên tường |
| 62_07 | đóng đinh | đóng cọc, sửa chữa |
| 111_25 | nhún vai | "but…" |
| 111_32 | vươn vai, ngáp | thức dậy |
| 79_73, 120_15 | sợ hãi, giật mình | "Except…" |
| 111_12 | nằm xuống | ngủ, ngất |
| 111_16 | ú oà / ló mặt | nhìn trộm |
| 15_06, 56_03 | chồm tới với lấy, nâng cửa sổ | thao tác đồ vật |
| 02_06, 69_70 | cúi xúc, ngồi xổm nhặt đồ | nhặt, đặt |
| 86_09 | đi, ngồi, nhìn, đứng dậy | chuỗi hành động |
| 17_01, 07_01 | đi bực bội, đi thường | đi lại |
| 14_06 | nhảy, squat, vươn | vận động |
Biểu cảm mặt: `assets/face-poseunits.bvh/.json` (MakeHuman, CC0) — chưa nối vào engine.

# Texture ảnh thật & HDRI (06/11/2026)
- `assets/tex/mag/*_col.jpg`: tạo bằng Magnific (text-to-image, tài khoản chủ dự án) — đá xám, đá phiến, ván gỗ xám, sàn gỗ, da thuộc, rơm, cỏ, phông đồng cỏ. `*_nrm.jpg` sinh từ độ sáng ảnh.
- `assets/hdri/park.hdr, sky.hdr`: pmndrs/assets (CC0, gốc Poly Haven).
