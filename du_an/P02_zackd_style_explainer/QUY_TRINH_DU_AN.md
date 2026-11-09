# QUY TRÌNH RIÊNG — P02 (v0.1, 09/11/2026, trạng thái: NHÁP, chưa chạy với tập thật)

Quy trình chi tiết nằm trong skill: `skill/zackdfilms-reference-production/SKILL.md` và các file `references/`. File này chỉ tóm tắt và ghi lý do lựa chọn.

## Phương pháp
Kết hợp ba nguồn hình:
- ảnh khung đầu + tạo video từ ảnh (Magnific: Kling 2.5 / Seedance 2.5) cho nhân vật và bối cảnh;
- Blender EEVEE cho cảnh cơ chế và chữ 3D;
- ráp, phụ đề, phối và xuất bằng Kdenlive 23.08 + melt.

## Lý do (gắn với số đo)
- Mẫu là 3D CG chất lượng cao (10/10). Blender CPU ở đây mất 27–33 s/khung, nên làm cả video bằng Blender không khả thi. Xem `BANG_KIEM_CONG_CU.md`.
- Cảnh cơ chế cần hình khối và nhân quả chính xác (V03, V10). Tạo video từ ảnh không đảm bảo được điều này, nên phần đó làm bằng Blender hoặc ghép thêm lớp.
- Chuyển cảnh giấu trong chuyển động (10/10) được làm ở khâu dựng, để chủ động thời điểm.

## Chưa kiểm
Toàn bộ phần tạo video từ ảnh (chưa tiêu credit), viền sáng ghép lên clip AI, TTS. Bản thử đầu tiên sẽ kiểm các phần này.
