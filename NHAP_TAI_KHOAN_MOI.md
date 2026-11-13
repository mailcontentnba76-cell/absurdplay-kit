# AbsurdPlay — P01 "Sport USA": chuyển sang tài khoản Claude khác (KIT v2.0, 13/11/2026)

Bạn chỉ cần mang theo **một file**: `AbsurdPlay_SportUSA_KIT_v2.0.zip`. File hướng dẫn này cũng nằm sẵn trong gói.

## 1. Trong gói có gì
| Phần | Nội dung |
| --- | --- |
| `BAT_DAU_DAY.md` | Chính file này: các bước làm và câu lệnh dán cho Claude mới. |
| `BO_HUONG_DAN_SAN_XUAT_VIDEO/00_…`, `01_…`, `mau/`, `skill/` | Bộ hướng dẫn sản xuất video chung, câu lệnh khởi động, 8 mẫu hồ sơ và skill chung `video-production-pipeline`. |
| `…/du_an/P01_sport_usa_whatif/skill/sport-usa-whatif/SKILL.md` | **Skill v2.5 của kênh.** Gồm: quy trình 2 lần duyệt; quy tắc hook (một câu chửi đã bíp, không số liệu); kịch bản troll nhưng đúng sự thật có nguồn; quy tắc hình (không quá tối, không chớp trắng, không nhấp nháy, nhân vật bước đi thật); bảng "đã dùng" từ E01 đến E17; bài học lỗi. |
| `…/P01_sport_usa_whatif/engine/` | Engine 3D đầy đủ: three.js r170 đã vá, nhân vật, tóc, động tác Mixamo (FBX), các bối cảnh `lib/*.js`, các tập `ep01`–`ep17`. |
| `…/P01_sport_usa_whatif/cong_cu/` | Công cụ: phụ đề, hoà cắt, quét khung lỗi, đo nhấp nháy, Whisper, script cắt thử và bản cuối. |
| `…/P01_sport_usa_whatif/tap/E01…E17/` | Hồ sơ từng tập: phụ đề, mốc lời, bộ trộn âm, QA. |
| `…/tai_nguyen/am_thanh/magnific_sfx/` | 26 tiếng sân đấu bạn đã tạo trên Magnific. |
| `HO_SO_DU_AN.md`, `QUY_TRINH_DU_AN.md`, `NHAT_KY_LOI.md`, `NHAT_KY_PHIEN_BAN.md`, `BANG_KIEM_CONG_CU.md`, `PHAN_TICH_MAU/*.md` | Hồ sơ dự án và phân tích kênh mẫu (chỉ phần chữ). |

**Không có trong gói, và vì sao:**
- **Thư viện nhạc và SFX miễn phí (≈1,9 GB):** Claude mới tự tải lại từ GitHub.
- **Video và giọng đã xuất:** đã giao cho bạn rồi.
- **Ảnh chụp video kênh mẫu:** đây là nội dung của người khác, chỉ dùng phân tích nội bộ.
- **Giọng "Sport USA":** nằm trong tài khoản Magnific của bạn, không cần chuyển.

## 2. Các bước ở tài khoản mới
1. Trên claude.ai, tạo một **Project** tên "Sport USA" rồi mở một cuộc trò chuyện mới trong Project đó.
2. Đính kèm file zip và dán nguyên khối câu lệnh dưới đây:

```
Đây là dự án AbsurdPlay (P01 Sport USA, kênh TikTok What If NFL/NCAA) chuyển từ tài khoản Claude khác.
Giải nén file zip đính kèm vào /root/work/ (mkdir -p /root/work && cd /root/work && unzip -q <file>),
đọc BAT_DAU_DAY.md và skill
BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/skill/sport-usa-whatif/SKILL.md,
rồi làm đúng mục "Khởi động": kiểm từng công cụ, tự cài cái gì cài được, cái gì cần tôi thì hỏi
từng bước một, chạy thử render ep17, rồi đề xuất lưu skill sport-usa-whatif cho tài khoản này.
Luôn trả lời tôi bằng tiếng Việt. Xong thì báo bảng "đã sẵn sàng / còn thiếu / tôi cần làm gì"
và chờ tôi giao tập tiếp theo.
```

3. Claude sẽ nhờ bạn những việc chỉ bạn làm được:
   - **Bấm "lưu skill"** trên thẻ Claude hiện ra. Từ lần sau không cần gói zip nữa.
   - **Mở mạng nếu bị chặn.** Nếu Claude báo bị chặn, vào Settings → Capabilities và cho phép: github.com (tải thư viện âm thanh), pypi/npm (cài thư viện) và huggingface.co (mô hình Whisper đọc mốc lời).
   - **Claude in Chrome.** Cài tiện ích này, đăng nhập bằng tài khoản Claude mới, và để Chrome vẫn đăng nhập Magnific. Claude sẽ tự mở Magnific, chọn giọng **Sport USA** (mục My voices), nhập kịch bản, bấm Generate và bấm tải.
     - File MP3 tải về nằm trong thư mục **Downloads trên máy bạn**. Claude không đọc được thư mục đó, nên bạn **đính kèm file MP3 vào chat**.
     - Một cách khác là mở cuộc trò chuyện bằng **ứng dụng Claude trên máy tính**, để Claude tự lấy file từ Downloads.
   - **(Tuỳ chọn) Kết nối GitHub** và cấp quyền repo `absurdplay-kit`, để cuối mỗi tập Claude đẩy code và nhật ký lên.
   - **Lịch hẹn tự động** (nếu bạn muốn Claude tự tìm tin hằng ngày): nhờ Claude tạo lại. Lịch ở tài khoản cũ không chuyển sang được.

## 3. Quy trình mỗi tập (Claude mới sẽ làm đúng như tài khoản cũ)
1. **Tìm tin và chọn đề tài.** Bạn nói "NFL" hoặc "NCAA", hoặc hỏi "kịch bản hot tiếp theo". Claude tìm tin mới nhất và xếp theo độ hot của trận sắp tới.
2. **Viết Doc kịch bản** gồm: tin (≥2 nguồn), lời thoại, nhân vật, màu jersey đúng và checklist. → **Duyệt lần 1** ("duyệt kịch bản").
3. **Tạo giọng trên Magnific** qua Chrome. Bạn gửi file MP3 → Claude căn tốc độ, lấy mốc từng từ, làm phụ đề.
4. **Dựng 3D**, đồ hoạ và mix âm, rồi gửi **bản cắt thử 15 fps**. → **Duyệt lần 2** ("duyệt render").
5. **Bản cuối 1080x1920**, 30 fps, motion blur, −14 LUFS, đã quét khung lỗi và nhấp nháy. Kèm 3 tiêu đề, hashtag, và cập nhật skill.

Góp ý của bạn trong các lần trước đã được ghi thành quy tắc trong skill: mở đầu sôi động và không lặp tập cũ; shot 1 và shot 2 khác chỗ, khác góc; chuyển cảnh mượt, không chớp; không nhấp nháy; nhân vật bước đi chứ không trượt; màu nền không xấu; kịch bản troll nhưng thông tin phải đúng.

## 4. Trạng thái khi đóng gói (13/11/2026)
- **Đã giao E01 đến E17.** Tập mới nhất là E17 "Harry Kane thử việc kicker ở Munich", đã làm lại hook (trượt gối ở end zone, rồi lia whip sang shot 2).
- **Việc của bạn:** đăng E17 trước **21:30 Chủ nhật 15/11 (giờ Việt Nam)**, giờ bóng lăn trận Lions – Patriots ở Munich.
- **Còn treo:**
  - Lỗi thứ hai của E13 bạn chưa mô tả. Nếu cần thì nói với Claude mới.
  - Lịch hẹn tự động ở tài khoản cũ không chuyển sang được.
- **Tập tiếp theo:** chưa chọn. Nói "kịch bản hot tiếp theo" để Claude đề xuất.
