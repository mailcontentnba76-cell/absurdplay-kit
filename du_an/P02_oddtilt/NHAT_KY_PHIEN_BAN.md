# NHẬT KÝ PHIÊN BẢN — P02 oddtilt
| Ngày | Phiên bản | Thay đổi | Lý do | Ai quyết định |
|---|---|---|---|---|
| 05/11/2026 | v0.1 | Khởi tạo khung dự án, chép bộ quy trình chung, thêm `cong_cu/tai_mau_tiktok.sh` | Bắt đầu dự án theo YC | chủ dự án |
| 05/11/2026 | v0.2 | Phân tích 14 mẫu (8 mục, mốc thời gian, nhãn), TONG_HOP, skill `invention-chain-shorts` v0.1, công cụ đo P02 | YC chủ dự án | chủ dự án |
| 06/11/2026 | v0.3 | Demo door bản thử 4: biểu cảm mặt (lib/face.js), SFX Magnific, máy/khom/tấm da sửa theo góp ý; skill v0.2 | Góp ý chủ dự án | chủ dự án |
| 06/11/2026 | v1.0 | Chủ dự án duyệt demo door bản thử 8; skill invention-chain-shorts v1.0 (chuẩn dựng), MAU_CANH_CHUAN.html, qa_may_nhapnhay.py, phụ đề 1080 | Duyệt | chủ dự án |

## 07/11/2026 — E04 "How you invented deodorant" v1
- 30,35 s, 1080×1920, 30 fps, −14,1 LUFS, 12 shot. Màu tách bạch (cam / trắng / xám-xanh / xanh cỏ).
- Mở đầu hài: vươn vai → mùi nách làm hoa héo, chim rơi, bạn oẹ rồi tự ngửi nách mình mà khóc.
- QA giật: còn các đỉnh do động tác thật (bạn oẹ, tay vỗ nách, sao lấp lánh), không còn bật pose.

## 07/11/2026 — Phân tích 2 mẫu viral + skill v1.2
- Thêm `PHAN_TICH_MAU/15_bong_golf.md`, `16_trampoline.md` (lời + mốc, cắt cảnh, máy, màu, gag, loudness).
- Skill `invention-chain-shorts` v1.2: mục 1b (hook chơi chữ / động cơ bựa + kết khép vòng, bối cảnh hiện đại, macro đồ vật, lắp ráp hiện dần, thất bại ragdoll, đồ hoạ khoa học, máy bay kể chuyện, 1 màu nhấn).

## 07/11/2026 — E05 "How you invented the bicycle" v1 (theo skill v1.2 mục 1b)
- 36,77 s, 1080×1920, 30 fps, 19 shot (trung vị ~1,8 s). Bối cảnh hiện đại (phố ngoại ô), nhân vật mới e5_chinh/e5_ban, khung xe đỏ là màu nhấn duy nhất.
- Mới trong engine: `legIK` (lib/mocap.js), xe đạp dựng theo tham số (xe đẩy → bàn đạp bánh trước → bánh to → xe an toàn xích + lốp hơi), lắp ráp bật ra (easeOutBack), xích chạy theo đĩa, đồ hoạ x1/x3, chạy bộ thủ tục, ngã úp mặt bằng quay thân quanh hông.
- 7 SFX mới (Magnific): giật lon bia, bánh gỗ lăn, ngã xe, xích, bơm lốp, xóc răng, chuông xe. Texture mới: nhựa đường, vỉa hè, cỏ sân, đá cuội, ngói, phông phố, vách gỗ (tự vẽ).

## 07/11/2026 — E06 "How you invented the periscope" v1 (khuôn trampoline, chủ đề nhà tắm)
- 41,58 s, 1080×1920, 20 shot. Giọng turbo stability 0,3 + CHỮ HOA (chủ dự án chọn). Nhân vật e6_chinh/e6_ban/e6_em mới, sân sau hoàng hôn mới, ống vàng chanh là màu nhấn duy nhất.
- Mới trong engine: ShaderPass góc nhìn qua kính (vòng tròn, mờ, hơi nước), tia sáng + chấm sáng chạy theo đường gương, rèm 2 cánh, hộp khoá, ghế xếp + bỏng ngô; `jog(…, amp)`.
- 7 SFX mới: gãy chổi, kéo rèm, vòi sen + hát, bé hét, gạt nước, khoá hộp, zoom kính.

## 08/11/2026 — E07 "How you invented the trebuchet" v1 (ý tưởng tự sáng tạo)
- 41,81 s, 11 shot (mở đầu + kết là 1 cú máy liền), motion blur ở đoạn nhanh, −14,3 LUFS. Tương quan ảnh quanh mọi điểm cắt ≤ 0,23 (không jump cut).
- Mới: chó dựng bằng khối (`dogPose`: squat/sit/run/sniff), cục phân 3D, máy bắn đá tham số (kéo dây → đối trọng → bánh xe), quỹ đạo parabol `arc()`, đồ hoạ đòn bẩy slow/FAST!, 8 SFX mới.
- Lưu ý: worker khởi động lại giết tiến trình render → dùng `setsid nohup` và render lại khung thiếu.
