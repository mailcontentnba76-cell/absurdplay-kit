# HƯỚNG DẪN SỬ DỤNG — P02 (video giải thích 3D theo mẫu @zackdfilms)
Cập nhật 09/11/2026.

## 1. Hiện trạng
- **Đã xong:** phân tích 10 video mẫu, đặc tả phong cách, skill `zackdfilms-reference-production` (đã **soạn xong**, chưa **cài** vào tài khoản), công cụ đo và dựng, thử nghiệm Blender, Kdenlive và melt.
- **Chưa làm:** chưa sản xuất tập nào; chưa tiêu credit nào; chưa nghe được âm thanh của mẫu.

## 2. Bạn cần cung cấp
| Thứ | Bắt buộc? | Vì sao |
|---|---|---|
| Chủ đề, hoặc kịch bản có sẵn (tiếng Anh hoặc tiếng Việt, Claude sẽ viết lại bằng tiếng Anh) | có, cho mỗi tập | điểm bắt đầu của tập |
| **Mô tả âm thanh mẫu** (mục 3) | có, một lần | Claude không nghe được video, nên không biết giọng và nhạc của mẫu ra sao |
| Mức credit được phép tiêu cho bản thử và cho mỗi tập | có | tạo ảnh, video, giọng đều tốn credit Magnific |
| Giọng đọc riêng (file wav/mp3) | không | nếu không có, Claude dùng TTS của Magnific |
| Logo hoặc chữ thương hiệu muốn đặt trong cảnh | không | mẫu đặt thương hiệu kênh trong cảnh |

## 3. Năm câu về âm thanh (nghe V10, V01, V03 rồi trả lời ngắn)
1. Giọng nam hay nữ, khoảng bao nhiêu tuổi, giọng Mỹ hay Anh? Nghe giống người thật hay AI?
2. Giọng đọc kiểu gì: hào hứng, bình thản, kể chuyện bí ẩn, hay hài?
3. Nhạc nền có không? Kiểu gì (piano nhẹ, synth, trống nhanh, căng thẳng…)? To hay nhỏ so với giọng?
4. Có tiếng hiệu ứng ở những chỗ chuyển cảnh nhanh (whoosh) hay chỗ vật phát sáng (ding) không?
5. Lúc kết video, nhạc tắt đột ngột hay nhỏ dần?

## 4. Quy trình mỗi tập
| Bước | Bạn đưa | Claude làm | Công cụ | Kết quả | Kiểm | Bạn làm tay |
|---|---|---|---|---|---|---|
| 1. Brief | chủ đề, mức credit | lập BRIEF, kiểm nguồn sự thật | tìm web | `tap/<MA>/BRIEF.md`, `kich_ban/nguon.md` | sự thật có nguồn | — |
| 2. Kịch bản | — | viết kịch bản tiếng Anh, bảng chức năng câu, bản dịch tiếng Việt để bạn đọc | — | `kich_ban/kich_ban_v1.md` | hook ≤ 11 s; mỗi câu có chức năng | **duyệt kịch bản** |
| 3. Giọng | (giọng riêng nếu có) | tạo giọng hoặc nhận file, đo mốc từ | Magnific TTS, `asr_parakeet.py` | `giong/…wav`, `…asr.json` | 160–183 từ/phút | nghe thử giọng |
| 4. Bảng shot | — | bảng shot theo mốc từ, prompt tiếng Anh | mẫu SHOT_BLUEPRINT | `kich_ban/shot.md` | phủ kín, mọi từ khoá có hình | — |
| 5. Bản thử | — | animatic có giọng thật + 3–6 s ở đoạn khó nhất, đặt cạnh mẫu | Magnific, Blender, Kdenlive | `thu/` | QA từng mặt | **duyệt bản thử** |
| 6. Sản xuất | — | làm toàn bộ shot, ráp, phụ đề, nhạc, phối | như trên | `giao/…mp4`, `.kdenlive` | QA_CHECKLIST | — |
| 7. Giao | — | xuất, đo, sửa, xuất lại; viết hướng dẫn mở lại | melt, ffmpeg | video + project + tài nguyên | ffprobe, ebur128 | mở project trên máy bạn |

## 5. Đưa chủ đề hoặc kịch bản (dán vào chat)
```
P02, làm tập mới.
Chủ đề: <…>  (hoặc dán kịch bản)
Loại: giải thích cơ chế / chuyện có thật / giả định / hư cấu / tự làm
Thời lượng mong muốn: <30–45 s>
Credit tối đa: bản thử <…>, cả tập <…>
Giọng: TTS / file đính kèm
Thương hiệu trong cảnh: <chữ hoặc "không">
```

## 6. Đặt tên file
`<MA_TAP>_<loai>_<ID>_v<n>.<đuôi>`, ví dụ `E01_clip_S03_v2.mp4`. Mã tập: E01, E02…

## 7. Duyệt bản nháp
Ghi ý kiến theo mốc thời gian, ví dụ "00:07 tay cầm sai", "00:15 thiếu hình cho chữ 'thirty times'". Claude sẽ sửa ở đúng khâu gây ra lỗi (kịch bản, giọng, hình, dựng hay phối).

## 8. Mở lại dự án ở phiên mới
1. Mở phiên Claude Code trên repo `absurdplay-kit`, nhánh có thư mục `du_an/P02_zackd_style_explainer`.
2. Gửi: `P02: đọc PROJECT_STATE.md và skill zackdfilms-reference-production rồi tiếp tục.`
3. Video mẫu **không có trên GitHub**. Nếu cần phân tích lại thì gửi lại 10 file. Kết quả phân tích dạng chữ vẫn còn trong repo.
4. Công cụ apt (Blender, Kdenlive, melt) mất khi container mới. Claude cài lại bằng lệnh ở `BANG_KIEM_CONG_CU.md` mục 4.

## 9. Cài skill (tuỳ chọn, để mọi phiên tự nhận ra)
Skill đã nằm trong repo: `du_an/P02_zackd_style_explainer/skill/zackdfilms-reference-production/`. Có 2 cách cài:
- **Trong repo (Claude Code):** chép thư mục đó vào `.claude/skills/` ở gốc repo rồi commit. Phiên Claude Code mở repo này sẽ tự thấy skill. Muốn làm cách này thì bảo Claude "cài skill P02 vào repo".
- **Trên claude.ai:** nén thư mục skill thành zip rồi tải lên ở mục Skills của tài khoản.

Cả hai cách chỉ đưa hướng dẫn cho Claude đọc. Đây **không phải** huấn luyện hay tinh chỉnh mô hình.

## 10. Thứ cần cài hoặc kết nối
| Thứ | Bắt buộc? | Tình trạng | Bạn làm gì |
|---|---|---|---|
| Magnific (đã kết nối) | gần như bắt buộc cho chất lượng hình | còn 62.320 credit | duyệt mức chi |
| Blender, Kdenlive, melt | bắt buộc | Claude tự cài trong container | không |
| Máy có GPU hoặc Blender bản chính thức | tuỳ chọn | bản apt thiếu bộ khử nhiễu; download.blender.org bị chặn | chỉ cần nếu muốn render Blender đẹp hơn |
