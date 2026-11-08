# Chuyển dự án AbsurdPlay (P01 Sport USA) sang tài khoản Claude khác — gói 1 file (v1.0, 08/11/2026)

Chỉ cần **một file**: `AbsurdPlay_SportUSA_goi_chuyen_v1.0.zip`.

## Trong gói có gì
| Phần | Ghi chú |
| --- | --- |
| `BAT_DAU_DAY.md` | Hướng dẫn này + câu lệnh dán cho Claude mới |
| `BO_HUONG_DAN_SAN_XUAT_VIDEO/` | Bộ hồ sơ đầy đủ: skill `sport-usa-whatif` v1.0 (quy trình, công thức kịch bản, hook "What the f***", chế độ NFL/NBA, lỗi đã gặp, bảng "đã dùng" E01–E07), skill chung `video-production-pipeline`, engine 3D (three.js, nhân vật CC0, tóc, sân bay, mưa, tuyết, đồ hoạ), **động tác Mixamo đã tải (9 file FBX)**, **26 tiếng sân đấu Magnific bạn đã tạo**, công cụ Python, kịch bản + mốc lời + phụ đề + bộ trộn âm E01–E07, phân tích kênh mẫu (chỉ văn bản) |

**Không có trong gói:** thư viện nhạc/SFX CC0 (≈1,8 GB — Claude tự tải lại từ GitHub), file giọng và video đã xuất, video/ảnh của kênh mẫu, node_modules. Giọng "Sport USA" nằm trong tài khoản Magnific của bạn nên không cần chuyển.

## Các bước ở tài khoản mới
1. Mở một cuộc trò chuyện mới (nên tạo Project tên "Sport USA" rồi mở chat trong đó).
2. Đính kèm file zip và dán câu lệnh:

```
Đây là dự án AbsurdPlay (P01 Sport USA) chuyển từ tài khoản Claude khác.
Giải nén file đính kèm vào /root/work/, đọc BAT_DAU_DAY.md và skill
BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/skill/sport-usa-whatif/SKILL.md,
rồi làm đúng mục "Khởi động": kiểm từng công cụ, tự cài cái gì cài được, cái gì cần tôi
thì hỏi từng bước một, chạy thử render, rồi đề xuất lưu skill cho tài khoản này.
Trả lời tôi bằng tiếng Việt. Xong thì báo bảng "đã sẵn sàng / còn thiếu" và chờ tôi nói "NFL" hoặc "NBA".
```

3. Claude sẽ hỏi bạn những việc chỉ bạn làm được, thường là:
   - Bấm **lưu skill** trên thẻ Claude hiện ra (để lần sau không cần gói nữa).
   - Bật quyền mạng/tên miền nếu bị chặn (Settings → Capabilities).
   - Cài **Claude in Chrome** cho tài khoản mới, trình duyệt vẫn đăng nhập Magnific → Claude tạo giọng "Sport USA"; bạn tải mp3 và gửi lại.
   - (Tuỳ chọn) Kết nối GitHub để Claude lưu tiến độ vào repo `absurdplay-kit`.
   - Làm tập NBA: tải thêm vài động tác bóng rổ trên Mixamo (Claude sẽ đưa danh sách).

## Trạng thái khi đóng gói
- Đã giao E01–E07 (E07 "Jaguars vs 11 suitcases", 08/11).
- Đang mở E08: kịch bản dự phòng "Colts vs 11 garage sale items" (hook "What the f***"). Bạn muốn chờ kết quả trận Chủ nhật tuần 9 rồi chọn trận hot nhất. Lịch hẹn 12:00 thứ Hai 9/11 ở tài khoản cũ không chuyển sang được, nên hãy nhắc Claude mới đặt lại nếu cần.
