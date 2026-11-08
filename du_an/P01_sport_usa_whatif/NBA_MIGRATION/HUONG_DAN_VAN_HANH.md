# Hướng dẫn vận hành — AbsurdPlay NBA "What If"

Mở phiên Claude Code trên web với repo `absurdplay-kit`. Skill `nba-whatif` tự nạp (nằm ở `.claude/skills/nba-whatif/`). Gõ một trong các câu dưới (tiếng Việt được).

## 1. Bắt đầu chủ đề NBA mới
```
NBA
```
hoặc `/nba-whatif tìm chủ đề mới`. Claude: cài lại môi trường (~3–5 phút) → kéo kết quả 3 ngày + bảng xếp hạng → đưa **3 ý xếp hạng** (3 kiểu khác nhau) kèm nguồn → bạn chọn số → Claude viết kịch bản + bảng "Tin đã chọn" → **bạn duyệt**.
Mẹo: hỏi sau ~13:30 giờ VN để có đủ kết quả đêm trước.

## 2. Đưa kịch bản có sẵn
```
NBA, dùng kịch bản này: <dán kịch bản tiếng Anh>
```
Claude vẫn kiểm sự thật từng số liệu, sửa độ dài (≥ 170 từ), thêm bảng nhận diện, rồi xin duyệt.

## 3. Sau khi duyệt kịch bản
Claude báo số ký tự → tạo giọng Sport USA qua Magnific (tốn credit) → mốc từ → dựng → **gửi bản cắt thử 540x960 để bạn duyệt** → render đủ → giao mp4 + .kdenlive + QA.md + 3 tiêu đề + hashtag.

## 4. Tiếp tục tập dở
```
Tiếp tục tập E08 NBA
```
Claude đọc `NBA_MIGRATION/TRANG_THAI.md` và `tap/E08_*/HUONG_DAN_TIEP_TUC.md`, làm tiếp từ bước ghi trong đó.

## 5. Yêu cầu sửa
Nói cụ thể theo giây: `Sửa E08: giây 12–15 máy quay rung quá; phụ đề giây 30 sai tên "Wembanyama"; nhạc to quá`. Claude sửa đúng chỗ, render lại đoạn đó, ghi NHAT_KY_LOI nếu là lỗi lặp lại được.

## 6. Chạy QA
`Chạy QA E08` → Claude đo 13 ngưỡng (QUY_TRINH §3) + 4 mục NBA (nba-whatif §8), rút lưới khung để xem, ghi `giao/QA.md`.

## 7. Xuất bản giao
Bản giao: `tap/E08_*/giao/<ten>.mp4` (1080x1920 H.264 + AAC, −14 LUFS) + `.kdenlive` (mở trên máy bạn, cần chép cả thư mục tập). Video lớn không đưa lên git; Claude gửi file cho bạn trong app. Claude **không đăng** lên TikTok/mạng.

## 8. Khi thiếu công cụ hoặc bị gián đoạn
- Phiên mới / container mới: Claude tự chạy lại `HUONG_DAN_CAI_DAT.md` mục A.
- Render nền chết: Claude kiểm khung thiếu và render tiếp (không render lại cả video).
- Mạng bị chặn: Claude đề nghị mở đúng tên miền (bạn bấm duyệt).
- Magnific hết credit/lỗi: bạn tự tạo giọng trên web Magnific (voice "Sport USA") rồi gửi mp3.
- Mất tiến độ: mọi file nhẹ đã commit vào nhánh git; video/âm lớn cần làm lại từ bước tương ứng.

## Ví dụ lệnh đã kiểm (08/11)
```bash
cd /root/work/engine && node render.js "test_run6.html" out_test 30 0 30 360 640
node render.js "ep05.html#nomb" out 30 0 240 540 960 <khung,khung,...>
node dohoa_render.js ep05_gfx.html out_g 30 0 240
python3 du_an/P01_sport_usa_whatif/cong_cu/tao_phu_de.py words.json phu_de.ass
python3 du_an/P01_sport_usa_whatif/cong_cu/tao_kdenlive.py mo_ta.json X.kdenlive
melt -profile du_an/P01_sport_usa_whatif/cong_cu/v1080.profile X.kdenlive -consumer avformat:raw.mp4 width=1080 height=1920 progressive=1 frame_rate_num=30 frame_rate_den=1 vcodec=libx264 acodec=aac ab=192k
```
