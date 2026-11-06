---
name: "invention-chain-shorts"
description: "Sản xuất video dọc 30–50 s kiểu 'How you invented the X' (dự án P02, mẫu kênh TikTok @oddtilt): người xem là 'genius caveman' giải từng lỗi một cho tới khi phát minh ra đồ vật, 3D bán tả thực, phụ đề trắng 2 từ giữa màn hình, lời kể nhanh liên tục. Dùng khi người dùng yêu cầu ý tưởng, kịch bản, bản thử hoặc video mới cho dự án P02, hoặc nhắc tới oddtilt / 'how you invented'."
---
# Invention-chain shorts (P02) — v0.2 (06/11/2026)

> **Trạng thái:** xong G2; G4 đã kiểm chuỗi công cụ thật trên demo "the door" 0–11 s (bản thử 4, chờ duyệt). Mọi mục ghi [CHỌN] là đề xuất chờ chủ dự án duyệt. Quy trình chung: `00_HUONG_DAN_CHO_CLAUDE.md` + skill `video-production-pipeline` — đọc trước.

Kho: GitHub `mailcontentnba76-cell/absurdplay-kit`, nhánh `du-an-moi`. Hồ sơ đầy đủ: `du_an/P02_oddtilt/` (đọc `HO_SO_DU_AN.md`, `PHAN_TICH_MAU/TONG_HOP.md`, `NHAT_KY_LOI.md` trước khi làm). Trả lời người dùng bằng tiếng Việt.

## 1. Công thức kịch bản (14/14 mẫu)
```
HOOK (0 s, 1 câu): vấn đề cá nhân, ngôi "you", thô/nước đôi        ← 14/14
"So you, being a genius caveman, [giải pháp thô sơ]"  (ở 6–12 %)   ← 11/14
"Clever!" / "Genius!" / "Much better!"                              ← 1–3 lần
"But/Except [lỗi mới — thường do 'your friend']" → "so you [cải tiến có thật]"
   × 3–6 vòng, mỗi vòng 5–8 s (trung vị 6,9 s)
[1 giải pháp phi lý ở nửa sau: nhà máy hạt nhân / laser / phá nhà…]  ← 7/14
KẾT A (35–62 s): "Congratulations! You've invented the X!" ở 92–95 %
KẾT B (30–40 s): "Now your friend …" câu nước đôi nối lại hook
```
- Mỗi cải tiến phải là **bước kỹ thuật có thật** của đồ vật (tra nguồn); gag nằm ở cách vấp lỗi và câu chữ.
- Lời ~210 từ/phút (185–235), 107–202 từ, **không khoảng lặng > 0,35 s**, bắt đầu ≤ 0,3 s.
- Không chép đồ vật/gag đã có trong 14 mẫu (ghế, điều hoà, báo thức, bút bi, giường, cửa, quạt, kẹp hạt, lò quay, vòi sen, thước cuộn, bồn cầu, ô, bóng rổ) — chọn đồ vật khác. Không dùng tên/nhân vật/tháp hạt nhân như "dấu hiệu" của kênh mẫu; tự tạo running gag riêng [CHỌN].
- Mức thô tục/chửi thề: **chờ chủ dự án quyết** (mẫu có "ass/shit" 8/14, "fucking" 4/14).

## 2. Thông số hình & dựng (đo trên mẫu)
| Mục | Mẫu (min / trung vị / max) | Đích [nguồn] |
|---|---|---|
| Khung | 720×1280 bản tải, 30 fps (13/14) | 1080×1920, 30 fps [CHỌN] |
| Thời lượng | 30,2 / 38,1 / 61,6 s | 30–50 s [ĐO] |
| Shot | 2 / 14 / 20; trung vị 2,75 s (174 shot) | 10–18 shot, trung vị 2,5–3,5 s |
| Chuyển cảnh | cắt cứng (12/14); máy liền/whip (2/14) | cắt cứng, không hoà hình |
| Máy | đứng yên trung vị 19 %, đẩy vào 39 % | máy trôi/đẩy chậm trong shot người; quay quanh vật trong shot cơ chế |
| Màu (HSV) | bão hoà 33/70/158; sáng 80/127/221 | ban ngày, tự nhiên; bão hoà 60–130, sáng 95–165 |
| Đổi shot | theo câu: mỗi "so you…" và "But/Except" | ≥ 1 shot mới mỗi vòng |
- Kiểu hình: 3D bán tả thực kiểu tài sản game, nhân vật người tỉ lệ thật, cử động cứng là chấp nhận được; bối cảnh: làng hang đá / nhà-bếp-sân hiện đại / mặt cắt kỹ thuật.
- Icon 2D chồng lên (≥ 2 loại/video): tim, Zzz, giọt mồ hôi, sóng mùi xanh lá, vòng sóng âm, mũi tên cong, viền highlight xanh lá quanh bộ phận đang giải thích, confetti ở "Congratulations".

## 3. Phụ đề (đo trên 13 mẫu)
- Trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; **tâm y ≈ 60 % chiều cao** (766–768/1280 → ≈ 1150/1920); cao chữ ≈ 3,3 % chiều cao (≈ 63 px ở 1920).
- Cụm 1–3 từ, **trung vị 2**; hiện cả cụm một lúc, hơi nảy, 1 khung trống giữa hai cụm; từ cảm xúc/chửi viết HOA.
- Font gốc chưa xác định → dùng font mở tương tự (vd Poppins ExtraBold) [CHỌN, cần bản thử].

## 4. Âm thanh (chỉ có số đo — Claude chưa nghe được)
- Một giọng kể năng lượng cao, nhanh; gần mono (Side−Mid ≤ −19 dB).
- Nền giữa câu thấp hơn lời ~16 dB (9–20); không có nhịp trống đều → nhạc rất nhẹ hoặc không nhạc [SL]. **Hỏi chủ dự án** về nhạc/SFX/giọng trước khi chốt.
- Xuất −14 LUFS, TP ≤ −1 dBTP [CHỌN].

## 5. Chuỗi sản xuất — ĐÃ KIỂM (demo "the door" 0–11 s, bản thử 4, 06/11/2026)
Môi trường cloud: `absurdplay-kit` (mở `pikaso.cdnpk.net` để tự tải file Magnific). Engine: `du_an/P02_oddtilt/engine/` (`npm install` + `python3 patches/va_realism_effects_three170.py`). Render: `node render.js "<cảnh>.html?w=720" <ra> 30 f0 f1 720 1280` (2 tiến trình, ≈2,4 s/khung có GTAO).
1. **Nhân vật = MakeHuman** (mẫu dùng đúng bộ quần áo mặc định MakeHuman): `cong_cu/mh_bake.py <makehuman-data> nhan_vat/<x>.json engine/assets/mh` → `lib/mh.js loadMH()`. Bộ có sẵn: `chinh` (áo trắng logo + jean), `ban` (sơ mi xanh than), `nu`, `tho`, người tiền sử `ts_da/ts_long/ts_bao/ts_nu` (texture `cong_cu/mh_vai.py`). Thêm nhân vật = thêm JSON spec. Tài sản MakeHuman CC0.
2. **Động tác = mocap CMU** (`engine/assets/cmu/*.bvh`, danh mục README) qua `lib/mocap.js applyMocap(ch,mo,t,{pos,yaw,faceAt,inPlace})`, rồi chỉnh tay bằng `armIK(ch,'L'|'R',đích,pole)`, xoay bằng `rotWorld()`. Khom chống gối: xoay `upperleg01/lowerleg01/foot` + `spine05` rồi hạ chân chạm đất, `armIK` tay tới gối.
3. **Biểu cảm** `lib/face.js` (face-poseunits MakeHuman, 60 đơn vị): `applyFace(ch, mix([EXPR.tu_hao,k],[{LeftUpperLidClosed:1,RightUpperLidClosed:1},blink(t,seed)]))` — gọi SAU tư thế. Có: cuoi, tu_hao, ngac_nhien, to_mo, ngai, kho_chiu + chớp mắt ~3,2 s. Mọi nhân vật trong khung luôn chớp mắt + thở/lắc nhẹ.
4. **Vật liệu ảnh thật**: tạo bằng Magnific text-to-image ("seamless tileable texture, photograph of …", 1:1, ~65 credit/ảnh) → `engine/assets/tex/mag/<x>_col.jpg` + normal sinh từ độ sáng. HDRI `assets/hdri/park.hdr` (CC0) làm ánh sáng môi trường; phông ảnh đồng cỏ làm nền xa; GTAO radius 0,12.
5. **Vật biến hình theo lời** dựng bằng code trong cảnh (vd tấm da: lưới 26×40 đỉnh, `len` trải xuống từ cuộn, `flap` gió hất VÀO TRONG phía máy theo góc chéo, `slide` gom thành dải nếp; cửa: ván rơi vào chỗ lần lượt rồi nẹp ngang + nẹp chéo).
6. **Máy quay** mỗi shot một dòng `[t0,t1, vị trí đầu, cuối, nhìn đầu, cuối, fov]`, đặt theo khung mẫu: thấy toàn thân nhân vật chính, nhân vật phụ sát mép khung; trôi chậm (đẩy ≤ 0,9 m/shot).
7. **Âm thanh**: giọng → rút nghỉ >0,15 s về 0,12 s + `atempo` tới ~218 từ/phút → Parakeet lấy mốc từ; nhạc −19 dB; SFX Magnific theo mốc (`tai_nguyen/sfx/README.md`, mẫu trộn `tap/DEMO_door/cong_cu/tron_am.sh`): ding ở câu khen, whoosh ở cắt cảnh, "uh-oh" ở But/Except, tiếng vật theo hành động → loudnorm −14 LUFS.
8. **Phụ đề** `tap/DEMO_door/cong_cu/tao_phu_de.py` (Poppins ExtraBold 70 ở khung 720, tâm y 767, cụm 1–3 từ, nảy 90 ms) → ffmpeg `ass=`.
9. **Đối chiếu**: ghép mẫu | bản thử cùng mốc, xem 5 khung/giây từng shot của mẫu TRƯỚC khi đặt máy/động tác; chủ dự án duyệt từng bản.

### Bài học từ 4 vòng sửa demo door
- Xem mẫu ở 5 khung/giây trước khi dựng; ảnh 1 khung/giây bỏ sót hướng vật bay, tay nhân vật, máy trôi.
- Hướng tác động vật lý phải đúng mẫu (gió thổi VÀO nhà, rèm tốc về phía máy).
- Nhân vật phụ không bao giờ đứng thẳng bất động: khom/nhún/lắc/quay đầu + chớp mắt.
- Texture vẽ bằng code trông "hoạt hình" — luôn dùng ảnh thật; crop bỏ viền tối của ảnh AI (repeat 0,32, offset 0,34).
- Mốc cử chỉ khớp từ trong lời (quay đầu bắt đầu ~0,5 s trước "Clever!").

## 6. QA tối thiểu
- Lời bắt đầu ≤ 0,3 s; 185–235 từ/phút; 0 khoảng lặng > 0,35 s.
- ≥ 3 vòng vấn đề; có câu khen; kết A hoặc B.
- Phụ đề ≤ 3 từ ở ≥ 85 % cụm; tâm y 58–62 %; không che mặt/bộ phận đang giải thích.
- Shot trung vị 1,6–4,9 s; mỗi vòng có hình mới.
- −14 ± 1 LUFS; TP ≤ −1.

## 7. Công cụ đo đã có
`du_an/P02_oddtilt/cong_cu/` — `asr_parakeet.py` (chép lời + mốc từ), `do_bo_sung.py` (máy, phụ đề, nền âm, F0), `do_cat.py` (cắt cảnh), `tong_hop_so_do.py`. Dùng lại cho QA bản xuất.

## Thay đổi
- v0.2 (06/11/2026): chuỗi sản xuất đã kiểm — MakeHuman, mocap CMU, biểu cảm mặt, texture ảnh thật Magnific + HDRI, SFX Magnific theo mốc, bài học 4 vòng sửa.
- v0.1 (05/11/2026): bản đầu từ phân tích 14 mẫu; chưa duyệt.
