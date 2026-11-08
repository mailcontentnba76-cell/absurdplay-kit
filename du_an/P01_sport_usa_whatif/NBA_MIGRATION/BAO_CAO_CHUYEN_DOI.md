# Báo cáo chuyển đổi gói AbsurdPlay → nhánh NBA (08/11/2026)

## 1. Môi trường thực tế (đã kiểm, không suy đoán)
| Khả năng | Trạng thái | Bằng chứng |
|---|---|---|
| Loại môi trường | **Claude Code trên web** (container đám mây Linux, 4 CPU, 15 GB RAM, ~30 GB trống) — không phải Claude chat | `nproc`, `free`, `df` |
| Đọc/giải nén zip | CÓ | giải nén 521 mục, 0 đường dẫn nguy hiểm, không mã hoá, SHA-256 khớp digest Release |
| Đọc/ghi file, chạy script | CÓ | render, ffmpeg, melt chạy thật |
| Internet | GIỚI HẠN: GitHub, npm, PyPI, apt, huggingface, site.api.espn.com, www.espn.com mở; **cdn.nba.com 403** | proxy status |
| Xem ảnh/khung hình | CÓ (đọc ảnh) | đã xem khung dry run |
| Nghe âm thanh | **KHÔNG nghe trực tiếp** — chỉ đo (LUFS, lặng, Whisper) | — |
| Magnific (giọng, SFX, 3D) | CÓ qua connector; tài khoản Premium, 68.327 credit; giọng "Sport USA" id 195176 | `account_balance`, `audio_voices_list` (không tốn credit) |
| GitHub repo absurdplay-kit | CÓ (đọc/ghi nhánh `claude/loving-feynman-plmt7f`) | — |
| Lưu skill | CÓ dạng skill dự án `.claude/skills/nba-whatif/` trong repo (Claude Code tự nạp ở phiên mới mở repo này). **Chưa** cài vào tài khoản claude.ai | — |
| Mở GUI Kdenlive | KHÔNG (không màn hình); project `.kdenlive` được kiểm bằng melt render | — |

## 2. Gói zip thật sự chứa gì
- `BAT_DAU_DAY.md` + `BO_HUONG_DAN_SAN_XUAT_VIDEO/` — **giống hệt repo** trừ 3 thứ chỉ có trong zip: `engine/assets/mixamo/*.fbx` (9 file động tác NFL/chạy) và `engine/smoke_test/{giong,nhac}.wav`.
- Không có secret/API key (quét mẫu sk-/ghp_/AKIA/AIza/private key: 0 kết quả). Script chỉ gọi ffmpeg/ffprobe và server localhost; `mo_kdenlive_kiem_tra.sh` xoá `~/.config/kdenliverc` (chỉ dùng khi cần GUI — không chạy).
- Đường dẫn cứng: `/root/work/engine`, `/root/work/assets/audio/` (trong tron_am_thanh.py, dbg_g.js) → vẫn dùng được vì giữ cùng cấu trúc `/root/work`.

## 3. Quy trình gốc (tái dựng)
**Mục đích:** video TikTok dọc 1080x1920 "What If" thể thao Mỹ (NFL + NBA) cho kênh AbsurdPlay, hài châm biếm dựa trên kết quả thật, hoạt hình 3D dựng bằng code.

**Hai lớp skill:** `video-production-pipeline` (chung, G0–G8: khởi động → nhận đầu vào → phân tích mẫu → quy trình riêng → kiểm công cụ → thiết lập → bản thử [DUYỆT] → sản xuất/QA/giao → lưu tài sản) bọc ngoài `sport-usa-whatif` (riêng P01). Dự án đã qua G0–G6 từ 03/11; mỗi tập mới chạy vòng G7.

**Vòng một tập (file có hiệu lực: `skill/sport-usa-whatif/SKILL.md` > `QUY_TRINH_DU_AN.md` > `HO_SO_DU_AN.md`; NHAT_KY_LOI là bài học):**
| # | Bước | Đầu vào → đầu ra | Loại |
|---|---|---|---|
| 1 | Tìm tin, 3 ý (5 kiểu), 1 kịch bản + bảng "Tin đã chọn", "đã dùng", nhận diện | tin → `kich_ban.md` | Claude; **DUYỆT 1** |
| 2 | Giọng Sport USA | kịch bản → `giong/goc.mp3` | trước: người dùng qua Chrome; nay: Magnific connector (tốn credit) |
| 3 | Whisper mốc từ, sửa tên, bíp hook | mp3 → `words.json`, `words_tw.json`, `giong_bip.wav` | tự động |
| 4 | Shot list + cảnh 3D + đồ hoạ | words → `epXX_shots.js`, `epXX.html`, `epXX_gfx.html` | Claude viết code |
| 5 | Xem nhanh khung then chốt → cắt thử 540x960 | → mp4 thử | tự động; **DUYỆT 2** |
| 6 | Render đủ 720x1280 + đồ hoạ qtrle + phụ đề ASS + trộn âm (CC0 + Magnific SFX) | → `hinh.mp4`, `do_hoa.mov`, `phu_de.ass`, nhạc/sfx wav | tự động |
| 7 | `tao_kdenlive.py` → melt (profile 1080x1920) → loudnorm 2 lượt | → `.kdenlive`, `.mp4` | tự động |
| 8 | QA (13 ngưỡng QUY_TRINH §3) + 3 tiêu đề + hashtag, cập nhật "đã dùng", commit | → `QA.md` | tự động + xem tay |

**Tiến độ đã lưu:** E01–E07 đã giao (E02, E05 là NBA). E08 mở dở là **NFL** ("Colts vs 11 garage sale items") → **không mang sang NBA**.

**Mâu thuẫn / thiếu phát hiện:**
- HO_SO_DU_AN ghi "atempo 1,12"; skill từ E06 ghi "KHÔNG atempo" → skill thắng (mới hơn). HO_SO mục 8–9 đã lỗi thời (ghi "chưa có video").
- Bản gốc dựa vào `mcp__widgets__fetch_sports_data`, `propose_skills`, Claude in Chrome — **không có** ở đây.
- Bảng kiểm cũ ghi font "đã cài" nhưng máy mới không có → phụ đề lỗi font (đã sửa).
- Mixamo bóng rổ: skill nhắc nhưng chưa từng tải.

**Kết luận:** quy trình **hoàn chỉnh và chạy được** (đã chứng minh bằng dry run), không chỉ là tài liệu. Phần cần đầu vào mới mỗi tập: chủ đề, kịch bản, giọng.

## 4. Bảng thay đổi (KEEP / ADAPT / REPLACE / REMOVE / UNRESOLVED)
| Thành phần gốc | Hành động | Bản NBA | Lý do | File |
|---|---|---|---|---|
| Thông số 1080x1920/30fps, phụ đề vàng, màu, nhịp, −14 LUFS | KEEP | như gốc | đo trên 23 mẫu, không phụ thuộc môn | gốc §2, QUY_TRINH §3 |
| 2 điểm duyệt, không lặp, bảng đã dùng | KEEP | một bảng chung | — | gốc §7 |
| Engine three.js, mocap, liven, biểu cảm, tóc, dáng | KEEP | như gốc | hạ tầng đã kiểm | engine/ |
| Hook "What the f***" + bíp | KEEP | như gốc | yêu cầu chủ dự án 08/11 | gốc |
| Khuôn lời 10 bước "11 [vật]" + thuật ngữ NFL | ADAPT | "5 [vật]" + thuật ngữ bóng rổ | NBA 5 người | nba-whatif §3 |
| Ưu tiên kết quả trận, giờ có kết quả NFL | ADAPT | lịch NBA mỗi đêm, chốt sau ~13:30 VN | NBA đá hằng đêm | nba-whatif §1 |
| Nguồn tin + `fetch_sports_data` | ADAPT | ESPN JSON + NBA.com qua search, ≥2 nguồn, cấm trích dẫn bịa | công cụ cũ không có | nba-whatif §0, §2 |
| Mixamo NFL (QB pass, catch, hike) | REPLACE | danh sách Mixamo bóng rổ khai sẵn trong `MIXAMO_FILES` | NFL không dùng | lib/nhanvat2.js |
| Tư thế/đạo cụ NFL (mũ, QB, safety) | REPLACE | bongro.js, trọng tài NBA, shot clock | — | nba-whatif §5 |
| Giọng qua Claude in Chrome | REPLACE | Magnific connector `audio_tts` voice 195176 | có sẵn, ít bước tay | nba-whatif §0 |
| `propose_skills` (claude.ai) | REPLACE | skill dự án `.claude/skills/nba-whatif` | Claude Code | .claude/skills |
| E08 Colts (NFL) dở dang | REMOVE khỏi nhánh NBA | ghi lại, không tiếp | khác môn | SO_CHU_DE_NBA.md |
| atempo 1,12 ở HO_SO | REMOVE (lỗi thời) | không atempo | mâu thuẫn skill E06 | — |
| Độ dài tập NBA (>60 s như từ E06?) | UNRESOLVED | mặc định giữ ≥ 62 s | chờ chủ dự án | — |
| Mixamo bóng rổ | UNRESOLVED | tuỳ chọn, cần người dùng tải | cần tài khoản Adobe | HUONG_DAN_CAI_DAT |
| Thư viện nhạc CC0 1,8 GB | UNRESOLVED (chưa tải) | tải khi tới bước trộn âm | tránh tải lớn sớm | — |

## 5. Dry run (08/11, đầu vào thử nghiệm KHAI BÁO)
Đầu vào: 8 s đầu giọng thật E05 (NBA, Sport USA) + cảnh E05 (sân tuyết) — **chỉ để thử đường ống, không phải sản phẩm**. Nhạc = file thử `smoke_test/nhac.wav`, SFX = lặng.
| Bước | Kết quả | Kiểm bằng |
|---|---|---|
| Render 3D 120 khung 540x960 | đạt, 0,57 s/khung | xem ảnh |
| Đồ hoạ 240 PNG trong suốt | đạt, 0,08 s/khung | xem ảnh |
| Whisper small.en mốc từ | đạt, đúng chữ ("What the heck? Could the Bulls beat five snowmen?…") | đọc words.json |
| Phụ đề ASS | 8 cụm, 2,6 từ/cụm; chân chữ y=1310 | đo mặt nạ màu vàng |
| tao_kdenlive.py → melt | **lần 1 HỎNG**: lớp 3D đen + font sai (thiếu frei0r-plugins, fonts-montserrat) → cài → **lần 2 đạt** | xem khung |
| Xuất | 1080x1920, 30 fps, H.264 yuv420p, 8,000 s, −13,9 LUFS, TP −1,5 dBFS, mép x=2 không đen | ffprobe, ebur128, đo điểm ảnh |
| Bão hoà | median 46 (< 95) — cảnh tuyết; bước chỉnh màu bản cuối phải xử lý | đo HSV |
**Chưa kiểm:** Magnific `audio_tts` thật (tốn credit), `audio_timing_get`, tải mp3 từ Magnific về container, trộn âm với thư viện CC0, mở GUI Kdenlive, Mixamo bóng rổ.

## 6. Trạng thái & bước tiếp theo
Xem `TRANG_THAI.md`.
