# BẮT ĐẦU Ở ĐÂY — Gói chuyển P02 sang Claude Desktop (v1.0, 09/11/2026)

Gói gồm 2 file:
| File | Dùng để |
|---|---|
| `zackdfilms-reference-production.zip` | **cài skill** (quy trình, số đo phong cách, mẫu, script) |
| `P02_goi_chuyen_v1.0.zip` | **toàn bộ dự án**: phân tích 10 mẫu, bằng chứng hình, công cụ, hồ sơ, hướng dẫn, bộ hướng dẫn chung, và một bản skill |

**Không có trong gói:** 10 video mẫu (bạn đang giữ bản gốc; gửi lại khi cần phân tích lại), mô hình ASR (~630 MB; Claude sẽ hướng dẫn tải), các phần mềm.

## Cách 1 — khuyên dùng: tab Code của Claude Desktop (chạy trên máy bạn)
1. Giải nén `P02_goi_chuyen_v1.0.zip` vào một thư mục, ví dụ `Documents/AbsurdPlay/`.
2. Trong Claude Desktop, mở tab **Code** và chọn thư mục vừa giải nén làm thư mục làm việc.
3. Dán câu lệnh sau:
```
Đây là dự án P02 (video giải thích 3D theo mẫu @zackdfilms) chuyển từ tài khoản Claude khác.
Đọc BAT_DAU_DAY.md, rồi cài skill: chép thư mục skill/zackdfilms-reference-production vào ~/.claude/skills/
(nếu đã có thì thay bằng bản này). Sau đó đọc skill đó và
BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P02_zackd_style_explainer/PROJECT_STATE.md.
Làm đúng references/cai_dat.md của skill: kiểm từng công cụ trên máy này, cài cái gì cài được,
cái gì cần tôi thì hỏi từng bước một, chạy 3 bài thử miễn phí, cập nhật BANG_KIEM_CONG_CU.md.
Không tiêu credit Magnific khi tôi chưa đồng ý. Trả lời tôi bằng tiếng Việt.
Xong thì báo bảng "đã sẵn sàng / còn thiếu" và chờ tôi gửi chủ đề.
```

## Cách 2 — chat thường của Claude Desktop (không cài phần mềm)
1. Bật **code execution** trong Settings (mục Capabilities; tên mục có thể khác tuỳ phiên bản).
2. Vào mục **Skills** (Settings → Capabilities, hoặc Customize → Skills tuỳ phiên bản) → **+** → tải lên `zackdfilms-reference-production.zip`.
3. Tạo một Project tên "P02 Zack-style" và tải `P02_goi_chuyen_v1.0.zip` vào Project, hoặc đính kèm khi chat.
4. Dán: `Dự án P02. Giải nén gói đính kèm, đọc PROJECT_STATE.md và skill zackdfilms-reference-production rồi chờ tôi gửi chủ đề. Trả lời bằng tiếng Việt.`

Cách 2 viết kịch bản, bảng shot, prompt và tạo hình qua Magnific được, nhưng **không có Blender, Kdenlive hay GPU**, nên phần dựng và xuất bị hạn chế.

## Việc chỉ bạn làm được
- Kết nối **Magnific** trong tài khoản mới (để tạo ảnh, video, giọng).
- Trả lời 5 câu về âm thanh mẫu (`HUONG_DAN_SU_DUNG.md` mục 3).
- Duyệt mức credit cho bản thử và cho mỗi tập.

## Trạng thái khi đóng gói
- Đã phân tích xong 10 mẫu, đặc tả 21 quy tắc, skill v0.2. Chưa sản xuất tập nào; chưa tiêu credit.
- Các phần đã thử trên máy cũ (Linux, không GPU): Kdenlive 23.08 mở được project, melt xuất được, phụ đề đo khớp mẫu, Blender chạy được nhưng chậm.
- Phần tạo video từ ảnh qua Magnific **chưa thử**.
