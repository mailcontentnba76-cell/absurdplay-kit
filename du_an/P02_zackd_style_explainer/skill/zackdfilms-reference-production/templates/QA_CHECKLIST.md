# QA — <MA_TAP> bản <v>
Xem **toàn bộ** bản xuất: lưới 4 khung/giây, dải khung ở mọi chuyển cảnh, ASR lại phần tiếng, ebur128. Công cụ tự động chỉ để hỗ trợ, không thay việc xem.

| Mục | Cách kiểm | Ngưỡng | Kết quả | Đạt? |
|---|---|---|---|---|
| Hook | từ đầu ≤ 0,10 s; khung 0 có hành động; tiền đề hiểu được | ≤ 11 s | | |
| Đúng sự thật và nhân quả | so `kich_ban/nguon.md` | không sai | | |
| Hình giải thích được lời | bảng lời – hình; lệch từ khoá | ≤ 0,3 s | | |
| Nhân vật, vật nhất quán | so tham chiếu từng shot | không đổi mặt, đồ, hình khối | | |
| Vật liệu, ánh sáng | so cạnh mẫu cùng loại cảnh | gần mẫu | | |
| Chuyển động có nghĩa; tay cầm, chạm, hình khối | dải khung ở hành động nhanh | không xuyên, không trượt | | |
| Máy và định hướng | `phan_tich_mau.py` (% đứng yên) + xem | ≤ 30 % đứng yên | | |
| Nhịp dựng | đếm shot | trung bình 1,5–2,7 s | | |
| Phụ đề đúng chữ, đọc được | `do_phu_de.py` + so ASR | tâm y 1495–1515, cao 64–76 px, đúng chính tả | | |
| Lời rõ | ASR lại, tỉ lệ từ sai | ≤ 3 % | | |
| Nhạc, SFX | xem cue sheet; **chủ dự án nghe** | không lấn lời | | |
| Kết | đuôi sau từ cuối; hình trả lại câu mở | 0,3–1,0 s | | |
| Kỹ thuật xuất | ffprobe; ebur128 | 1080×1920, fps đúng, −11 ±1 LUFS, TP ≤ −1 dBTP | | |

## Nhật ký lỗi
| Mốc | Lỗi | Bằng chứng | Mức (nặng / vừa / nhẹ) | Nguyên nhân (nghiên cứu / kịch bản / giọng / tài nguyên / chuyển động / máy / dựng / phối / xuất) | Cách sửa | Kiểm lại |
|---|---|---|---|---|---|---|

Sửa ở **khâu gây ra lỗi**. Không che cơ chế sai hay chuyển động hỏng bằng cách cắt thêm hoặc thêm hiệu ứng.

## Độ giống mẫu (không cho điểm %, chỉ nêu khác biệt cụ thể)
| Mặt | So với mẫu (Vxx, cảnh cùng chức năng) | Khác biệt chính |
|---|---|---|
| Kể chuyện | | |
| Thiết kế hình | | |
| Chuyển động | | |
| Máy | | |
| Độ dễ hiểu | | |
| Dựng | | |
| Phụ đề | | |
| Âm thanh | | |
