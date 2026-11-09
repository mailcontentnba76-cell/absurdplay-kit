# PROJECT_STATE — P02
Cập nhật: 09/11/2026 · Pha hiện tại: **PHÂN TÍCH XONG, ĐÃ SOẠN SKILL; chờ yêu cầu tập mới**

## Đã làm
- [x] Tạo dự án và quy ước lưu video mẫu ngoài GitHub (`README.md`).
- [x] 10 video mẫu V01–V10 (`PHAN_TICH_MAU/do_tu_dong/ids.txt` ghi ID ↔ file). Phân tích từng video ở `PHAN_TICH_MAU/V01…V10_*.md`; tổng hợp ở `PHAN_TICH_MAU/TONG_HOP.md`.
- [x] Đo tự động: `PHAN_TICH_MAU/do_tu_dong/Vxx/` (transcript, mốc từ, âm thanh, ứng viên cắt, báo cáo) và `phu_de_do.json`.
- [x] Bằng chứng hình: `PHAN_TICH_MAU/bang_chung/` (lưới 4 khung/giây cả 10 video, dải khung quanh chuyển cảnh V01 và V10, phổ âm, ảnh cắt phụ đề). **Chỉ có trong container, không đưa lên GitHub** (ảnh cắt từ video có bản quyền, repo công khai). Tạo lại theo `skill/.../references/phan_tich.md` bước 4 khi có video mẫu.
- [x] Đặc tả phong cách + skill: `skill/zackdfilms-reference-production/` (đã soạn, **chưa cài**).
- [x] Kiểm công cụ: `BANG_KIEM_CONG_CU.md`; kết quả thử ở `kiem_thu/`.
- [x] Hướng dẫn người dùng: `HUONG_DAN_SU_DUNG.md`.
- [x] Gói chuyển sang Claude Desktop: `BAT_DAU_DAY.md`; tạo gói bằng `bash du_an/P02_zackd_style_explainer/cong_cu/dong_goi.sh` → `goi_chuyen/zackdfilms-reference-production.zip` (skill v0.2) + `goi_chuyen/P02_goi_chuyen_v1.0.zip` (không có video mẫu; file zip không lên GitHub).

## Vướng mắc
| Vướng mắc | Ảnh hưởng | Cần |
|---|---|---|
| Không nghe được âm thanh | giọng, nhạc, SFX chỉ có số đo | chủ dự án trả lời 5 câu (`HUONG_DAN_SU_DUNG.md` mục 3) |
| Chưa được duyệt mức credit | chưa thử được tạo video từ ảnh, nên quy trình chính chưa được kiểm | chủ dự án duyệt (ĐX ≤ 3.000 credit cho bản thử) |
| Blender CPU chậm (EEVEE 27–33 s/khung 1080p), bản apt thiếu OIDN | chỉ hợp cho đoạn chèn ngắn | (tuỳ chọn) GPU hoặc mở download.blender.org |
| Video mẫu chỉ có trong container | mất khi container bị thu hồi | gửi lại nếu cần phân tích lại |

## Bước tiếp theo
1. Chờ chủ dự án: chủ đề hoặc kịch bản + mức credit + 5 câu về âm thanh.
2. Khi có: BRIEF → nghiên cứu → kịch bản (duyệt) → giọng → bảng shot → bản thử đoạn khó nhất (duyệt) → sản xuất.
3. Bản thử đầu tiên cũng là lần **kiểm quy trình chính** (ảnh khung đầu + Kling/Seedance + viền sáng ghép + Blender chèn). Ghi kết quả vào `BANG_KIEM_CONG_CU.md`.
