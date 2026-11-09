# NHẬT KÝ PHIÊN BẢN — P02
Quy ước:
- `vLỚN.NHỎ`. Tăng **LỚN** khi thay đổi làm sản phẩm khác đi rõ rệt (màu, giọng, khung hình, phương pháp). Tăng **NHỎ** khi sửa lỗi, đổi ngưỡng hoặc thêm công cụ.
- Mỗi phiên bản ghi rõ áp dụng cho hồ sơ, quy trình hay skill dự án.
- Skill dự án (nếu có) mang cùng số phiên bản và có mục "Thay đổi" khớp với bảng này.

| Phiên bản | Ngày | Áp dụng cho (hồ sơ / quy trình / skill / công cụ) | Thay đổi | Lý do / bằng chứng | Ai quyết | Video đầu tiên dùng bản này |
|---|---|---|---|---|---|---|
| v0.1 | 09/11/2026 | hồ sơ | Tạo thư mục dự án từ mẫu, ghi kênh mẫu | YC 09/11: dự án mới, tách riêng khỏi P01 | chủ dự án | — |
| v0.2 | 09/11/2026 | hồ sơ + quy trình + skill + công cụ | Phân tích 10 mẫu V01–V10; đặc tả 21 quy tắc; skill zackdfilms-reference-production v0.1; công cụ đo, phụ đề, Kdenlive, Blender đã thử | PHAN_TICH_MAU/TONG_HOP.md, BANG_KIEM_CONG_CU.md | Claude (chờ chủ dự án xác nhận) | — |

## Mẫu skill riêng của dự án (khi dự án làm nhiều video)
```
<thư mục skill>/<ten-du-an>/SKILL.md
---
name: "<ten-du-an>"
description: "Sản xuất video <loại> cho <kênh/dự án> theo hồ sơ <MA_DU_AN> v<x.y>: <đặc điểm nhận diện chính>. Dùng khi <tình huống kích hoạt>."
---
# <Tên dự án> — v<x.y>
1. Đọc trước: 00_HUONG_DAN_CHO_CLAUDE.md (quy trình chung), du_an/<MA_DU_AN>/HO_SO_DU_AN.md, QUY_TRINH_DU_AN.md, NHAT_KY_LOI.md
2. Thông số đã chốt (tóm tắt + nguồn)
3. Quy trình đã duyệt (tóm tắt bước + lệnh chính)
4. Ngưỡng QA
5. Lỗi hay gặp (trích NHAT_KY_LOI)
6. Thay đổi theo phiên bản
```
