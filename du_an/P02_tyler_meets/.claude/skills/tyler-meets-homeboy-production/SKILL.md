---
name: tyler-meets-homeboy-production
description: Sản xuất trọn gói video hài dọc 9:16 (~70–80 s) series "Tyler meets…" / "My homeboy" — trường trung học Mỹ, nhân vật 3D low-poly đầu tròn mặt decal dựng bằng Blender (0 credit ảnh), Tyler là người kể ngôi "I" và là người chứng kiến, mỗi tập gặp một kiểu bạn (20 tính cách) hoặc một chủ đề trend (vd. nghiện GTA 6), cold open 1–2 s + câu "What the fuck is wrong with this dude?", 4 bối cảnh mới mỗi tập, vai phụ luôn cử động, giọng SonicVoice (clone "Ant Just Cant" cho Tyler + giọng riêng từng vai), phụ đề 1–3 từ từ khóa vàng, nhạc nền V07, running gag cái sandwich của Tyler. Dùng khi người dùng nhắc Tyler meets, homeboy, Westbrook High, TM01/TM02/TMG01, tập mới về một kiểu bạn hoặc chủ đề trend, viết kịch bản, làm giọng, dựng Blender, render, QA hoặc sửa video của series này. v1.0 — đóng gói 21/11/2026 từ 3 tập đã duyệt: TM01 Jaylen, TM02 Marcus, TMG01 Brody (GTA 6).
---

# tyler-meets-homeboy-production (v1.0 — 21/11/2026)

Skill này là **quy trình + công cụ + luật người dùng** rút ra từ 3 tập đã làm xong. Video mẫu chuẩn: `references/videos/` (TM01_jaylen_v3, TM02_marcus_v2, TMG01_brody).
- Báo cáo với người dùng bằng **tiếng Việt**. Lời thoại, kịch bản lời nói và tiêu đề đăng viết bằng **tiếng Anh** (thị trường nước ngoài).
- Đọc trước khi làm: `PROJECT_STATE.md` (gốc dự án), `docs/homeboy/SERIES_TYLER_MEETS.md` (20 tính cách + luật series), `docs/homeboy/CAST_BIBLE.md`, và `references/` của skill này.
- Gốc dự án = thư mục chứa `tools/`, `assets/`, `episodes/`. Mọi lệnh dưới đây chạy từ gốc dự án bằng Git Bash.

## 1. Luật của người dùng (bắt buộc, không tự ý đổi)
1. **Từng bước:** viết kịch bản trước (bản liền mạch + bảng cảnh), **dừng chờ người dùng "chốt"**, rồi mới làm giọng, dựng, render.
2. **Mở đầu:** cold open 1–2 s, nhân vật của tập làm đúng tính cách, **to, có cảm xúc, không rề rà**. Ngay sau đó Tyler (người chứng kiến) nói nguyên văn **"What the fuck is wrong with this dude?"**.
3. **Tyler** là người kể chính, có mặt mọi tập, ngoại hình cố định (tóc đen bù xù, áo vàng in "I PAUSED MY GAME TO BE HERE", quần xám đậm, giày trắng). Nhân vật của tập đổi trang phục, tóc, mặt và **giọng riêng** theo tính cách.
4. **Khoảng 4 bối cảnh mỗi tập, không trùng tập trước** (xem mục 6). Bối cảnh dày chi tiết, có chi tiết mới lạ, không trống trải.
5. **Vai phụ luôn cử động** (thở, quay đầu, nói chuyện, lướt điện thoại, chớp mắt, đi lại). Không đứng như tượng.
6. **Không xuyên tường hay đồ vật.** Người đi luôn quay mặt theo hướng đi.
7. **Hình:** đầu tròn; camera hơi rộng để thấy bối cảnh, trừ cảnh cận thì quay cận; hình **nét, mượt, không hạt nhiễu**; chuyển động tự nhiên như người, không giật.
8. **Âm thanh:** tiếng miệng (vd. "Hush", "Skrrrt") phải đúng chữ người dùng đưa, đọc nhanh, liền, và **kiểm bằng ASR**. Nhạc nền là `assets/music/bed_main_V07.wav` (người dùng đã chấp nhận rủi ro bản quyền).
9. **Trên video chỉ có phụ đề**, không thêm chữ hay đồ họa khác. Mỗi video kèm file `<tên>_post.txt` **chỉ chứa 1 dòng tiêu đề**.
10. **Running gag:** cái sandwich của Tyler bị phá mỗi tập.
11. **QA trước khi tốn chi phí:** kiểm nguồn và tham chiếu, làm 1 bản thử trước khi làm hàng loạt. Người dùng ghét lỗi có thể tránh được mà vẫn phát sinh chi phí. Blender = 0 credit; chỉ SonicVoice tốn ký tự.
12. **Bảo mật:** khóa SonicVoice nằm trong `.env.sonicvoice` ở gốc dự án. Không bao giờ ghi khóa vào skill, script, log hay báo cáo.
13. Nội dung an toàn: hài từ **hành vi**, không chê ngoại hình, sắc tộc hay gia đình; nhân vật nữ không bị bạo lực hay tình dục hóa. Trend có thương hiệu thật (vd. GTA 6): chỉ nhắc tên trong lời và tiêu đề; màn hình game, logo, nhân vật phải là đồ **tự vẽ**.

## 2. Quy trình một tập mới

### Bước A — Kịch bản (dừng chờ chốt)
1. Chọn tính cách tiếp theo trong `docs/homeboy/SERIES_TYLER_MEETS.md` (số 03 Destiny có kịch bản chờ duyệt: `episodes/TM03/`), hoặc chủ đề trend người dùng đưa.
2. Viết `episodes/<ID>/<ID>_script_lienmach.md` (bản liền mạch, người dùng thích đọc bản này) và `<ID>_script_full.md` (bảng ~33–41 cảnh theo 4 bối cảnh, mô tả bối cảnh dày chi tiết). Khuôn: TM02 và TMG01.
3. Khuôn truyện: cold open → "What the fuck…" → "This is <tên>." + 2–3 câu tả tính cách → leo thang qua 3 bối cảnh → cú lật ở bối cảnh 4 → câu chốt 3 vế ngắn → sandwich bị phá. Thoại vai phụ ≤ 8 từ. Thời lượng giọng 68–77 s.
4. Ghi trang phục (màu áo phải tách khỏi nền), giọng dự kiến, tiêu đề đăng. **Dừng, gửi người dùng duyệt.**

### Bước B — Giọng (sau khi chốt)
1. `episodes/<ID>/shots.txt`, mỗi dòng: `Lxx [SPK] câu / câu | KEY_1 / KEY_2`. Dấu `/` tách beat; mỗi beat một key cảnh. Key bắt đầu `CU_`/`INS_` = cận; `POV_` dành cho ảnh phụ.
2. Chọn giọng: `python tools/sv_voices.py search "<từ khóa>"` (tải danh mục SonicVoice về `work/sv_voices_en.json`). Giọng đã dùng: mục 5.
3. Tạo giọng:
   ```bash
   python tools/sonicvoice_tts.py episodes/<ID>/shots.txt episodes/<ID>/audio --voice uv_1883_1ae2d9e41df6 --voice-map BRO=<id>,GUARD=<id> --voice-opts BRO=0.12:1.12 --speed 1.0 --gap 0.45 --stability 0.4
   ```
   Giọng nhân vật hét hoặc hype: `stability 0.12, speed 1.12`. Giọng clone `uv_…` không gửi provider/model (script tự xử lý). Rớt mạng thì chạy lại với `--reuse VOICEID=jobid`, không tốn thêm ký tự.
4. ASR (**chỉ nhận âm thanh 16 kHz**; dòng lẻ 44.1 kHz phải đổi trước bằng `ffmpeg -i Lxx.wav -ar 16000 -ac 1 x.wav`, nếu không ASR ra rác):
   ```bash
   python tools/asr.py episodes/<ID>/audio episodes/<ID>/audio/vo16k.wav
   ```
   Đọc `vo16k.asr.txt`: tiếng miệng phải ra đúng chữ. Sai thì sửa cách viết (gạch nối, đọc liền) rồi tạo lại **riêng dòng đó**.
5. Phụ đề, thư viện cảnh, timeline:
   ```bash
   A=episodes/<ID>/audio
   python tools/fix_caption_words.py episodes/<ID>/shots.txt $A/vo_lines.json $A/vo16k.asr.json $A/vo16k.cap.json
   python tools/make_library.py episodes/<ID>/shots.txt episodes/<ID>/library.json
   python tools/plan_shots.py episodes/<ID>/shots.txt $A/vo16k.cap.json episodes/<ID>/library.json episodes/<ID>/timeline.json --vo $A/vo.wav --out episodes/<ID>/out/<ID>_<ten>.mp4
   ```
   Beat < 0.9 s bị gộp vào cảnh trước; kiểm danh sách cảnh in ra. Số cần hiển thị bằng chữ số (vd. "GTA 6") thì sửa thẳng trong `vo16k.cap.json`.

### Bước C — Dựng Blender
1. Bối cảnh mới: viết `tools/hb/hb_setsN.py`. Mỗi set đặt ở một gốc X riêng (vd. 270, 300, 330, 360), trả `dict` các điểm quan trọng. Xem `references/blender_api.md`.
2. Chữ, áo in: viết `tools/hb/make_tex_<ID>.py` (PIL) → `assets/hb/tex/*.png`, `assets/hb/prints/*.png`. Biển chữ dùng `tex_quad` (đã chống ngược chữ).
3. Cảnh: chép `tools/hb/tmg01_scene.py` thành `tools/hb/<id>_scene.py`; mỗi key cảnh là một hàm `KEY(n)` (n = số khung hình). Đổi nhân vật, set, hàm `scene_xx()` và từng cảnh.
4. Thử bối cảnh trống: chép `tools/hb/set_preview.py`, render 4 ảnh và xem.
5. **Kiểm va chạm**, sửa đến khi chỉ còn tiếp xúc có chủ ý (ngồi ghế, tay trên bàn, chân trong thân xe golf):
   ```bash
   "$BLENDER" -b --python tools/hb/<id>_scene.py -- episodes/<ID>/timeline.json work/<id>/chk --check
   ```
6. **Ảnh thử toàn bộ cảnh** (rất nhanh), dựng bảng tiếp xúc và xem từng ô. Lần nào cũng bắt được 10–17 góc lỗi: camera sau lưng nhân vật, bị cột/cây/xe/vai phụ che, mặt bị cắt, đồ vật bị tay che.
   ```bash
   "$BLENDER" -b --python tools/hb/<id>_scene.py -- episodes/<ID>/timeline.json "<ĐƯỜNG DẪN TUYỆT ĐỐI>/work/<id>/q" --stills --res 360x640 --samples 16
   python tools/contact_sheet.py work/<id>/q work/<id>/q_sheet
   ```
   Thư mục ra của Blender **phải là đường dẫn tuyệt đối**; đường dẫn tương đối có lúc không ghi được file.
7. Render đủ ở nền (~60 phút/tập trên RTX 3060):
   ```bash
   "$BLENDER" -b --python tools/hb/<id>_scene.py -- episodes/<ID>/timeline.json "<ABS>/work/<id>/clips" --samples 64 > work/<id>/render_log.txt 2>&1
   ```
   Sửa riêng vài cảnh: thêm `--only KEY1,KEY2`. Xóa thư mục clip cũ của cảnh đó trước.

### Bước D — Ảnh chèn 2D, ghép, QA
1. Ảnh chèn điện thoại (PIL, giao diện tự vẽ, không thương hiệu thật): `story_inserts.py` (story kiểu TM01), `selfies_insert.py` (thư viện 40 selfie, TM02), `stream_insert.py` (livestream, TMG01). Nền lấy từ ảnh phụ `POV_*` do scene render ra.
2. `episodes/<ID>/finalize_timeline.py`: chép từ TMG01; khai báo cảnh nào là ảnh tĩnh, từ khóa vàng của phụ đề. Sau đó chạy:
   ```bash
   python episodes/<ID>/finalize_timeline.py && python tools/build_episode.py episodes/<ID>/timeline.json
   python tools/check_cuts.py episodes/<ID>/out/<file>.mp4 episodes/<ID>/timeline.json
   ffmpeg -i episodes/<ID>/out/<file>.mp4 -af ebur128 -f null - 2>&1 | grep "I:" | tail -1
   python tools/frame_sheet.py episodes/<ID>/out/<file>.mp4 work/<id>/final_sheet.png
   ```
   Đạt khi: cut drift none, không jump cut (trừ chuỗi màn hình điện thoại cố ý), âm lượng khoảng −16.5 ± 0.5 LUFS, peak ≤ −1 dBFS.
3. **Soát bảng khung hình** theo `references/qa_checklist.md`. Sửa xong mới gửi.
4. Viết `episodes/<ID>/out/<ID>_post.txt` (1 dòng tiêu đề). Gửi video và file tiêu đề. Ghi kết quả vào `PROJECT_STATE.md`. Hỏi người dùng duyệt.

## 3. Thư mục
- `tools/` — pipeline chung: `sonicvoice_tts.py`, `asr.py`, `fix_caption_words.py`, `plan_shots.py`, `build_episode.py`, `check_cuts.py`, `sv_voices.py`, `make_library.py`, `contact_sheet.py`, `frame_sheet.py`.
- `tools/hb/` — Blender:
  - Thư viện: `hb_lib.py` (rig Char, set lớp học, căng tin, phòng chụp, đèn, camera, render, kiểm va chạm), `hb_props.py`.
  - Bối cảnh: `hb_sets2..5.py`, `hb_details.py`.
  - Scene từng tập: `tm01_scene.py`, `tm02v2_scene.py`, `tmg01_scene.py` (khuôn mới nhất).
  - Ảnh chèn và chữ: `story_inserts.py`, `selfies_insert.py`, `stream_insert.py`, `make_tex_tmg01.py`.
  - Tiện ích: `set_preview.py`, `logo_tyler.py`.
- `assets/hb/tex|prints|logo`, `assets/music/bed_main_V07.wav`.
- `episodes/TM01|TM02|TMG01` — kịch bản, shots.txt, giọng, timeline, finalize (tập mẫu, dựng lại được). `episodes/TM03` — kịch bản Destiny chờ duyệt.
- `work/` — tệp tạm, clip render (không đóng gói, tự sinh lại).

## 4. Thông số kỹ thuật đã chốt
- Render: Eevee, `use_raytracing=False` (raytracing gây hạt), 64 mẫu, `filter_size 1.0`, view transform Standard, 1080×1920, 30 fps, khung PNG.
- Camera (`cam_move`): cảnh không cận thì kéo lùi ×1.3 và lens ×0.82; cận ×1.3; INS ×1.0; bị kẹp trong phòng. Khi cần chính xác (tránh cột, cây, xe) dùng `cam_key` trực tiếp.
- Hướng mặt nhân vật: vector = (sin yaw, −cos yaw); yaw 0 nhìn về −Y, yaw 180 nhìn +Y, yaw 90 nhìn +X. `walk()` tự xoay theo hướng đi; `run()` = bước 5 khung + nghiêng người.
- Ngồi ghế hoặc ghế băng cao 0.47 m: `place(z=-0.34)` + `sit()`. Đứng trên sân khấu cao 1.0: `z=1.0`.
- Phụ đề: style `hb` (1–3 từ, giữa khung 60 %, từ khóa vàng, cỡ H×0.033, tự co còn 84 % chiều rộng). Nhạc −9.5 dB dưới giọng.

## 5. Giọng (SonicVoice, `https://sonicvoice.pro/api`)
| Vai | Giọng | ID | Ghi chú |
|---|---|---|---|
| Tyler (người kể) | clone "Ant Just Cant" | `uv_1883_1ae2d9e41df6` | giọng clone thuộc **tài khoản SonicVoice** của người dùng; dùng khóa khác thì phải clone lại |
| Jaylen (TM01) | A Lost American | `enI44SIiQ2GsKAhWRSpZ` | |
| Kayla | Brielle - Podcast girl | `6u6JbqKdaQy89ENzLSju` | |
| Marcus (TM02) | Bateman - Deep and Seductive | `XTdzBt8oIEvodkwhxeA0` | 0.12:1.12 |
| Em họ (TM02) | Riley | `hA4zGnmTwX2NQiTRMt7o` | 0.25:1.08 |
| Brody (TMG01) | Jett - Gritty and Spunky Young Hero | `6IwYbsNENZgAB1dtBZDp` | 0.12:1.12 |
| Bảo vệ | Mister Gruff | `mSOmKHC6GZcZbSTGlqHO` | 0.2:1.08 |
| Giám thị | Jerry B. - Gruff Commander | `TxWZERZ5Hc6h9dGxVmXa` | 0.2:1.08 |
| Y tá | Annie-Beth - Southern, Motherly | `c4TutCiAuWP4vwb1xebb` | 0.35:1.05 |
Không dùng lại giọng nhân vật chính của tập trước cho nhân vật chính tập mới.

## 6. Bối cảnh đã dùng (không lặp)
- **HB01–02:** lớp học, căng tin, phòng chụp ảnh, phòng phạt.
- **TM01:** xe buýt trường, thư viện.
- **TM02:** hành lang tủ khóa, toilet nam, dạ hội phòng gym, bãi đỗ xe ban đêm.
- **TMG01:** vạch qua đường cổng trường + xe golf, hội trường, phòng y tế, căng tin ngoài trời.
- **TM03 Destiny (dự kiến):** sân trước trường, phòng lab hóa, phòng máy tính, khán đài sân bóng. Sân trước trường gần giống cổng trường TMG01, nên đổi góc hoặc đổi chi tiết.
- **Còn trống:** phòng nhạc, bể bơi, phòng mỹ thuật, hội chợ khoa học, sân bóng rổ ngoài trời, phòng thay đồ, xe đưa đón, cửa hàng trường, sân thượng, bến xe buýt, nhà Tyler.

## 7. Tài liệu tham chiếu
- `references/blender_api.md` — API rig, set, cảnh, mẹo dựng.
- `references/qa_checklist.md` — checklist QA và mọi lỗi người dùng từng bắt.
- `references/episode_index.md` — tóm tắt 3 tập mẫu (cảnh, giọng, thời lượng, bài học).
- `references/videos/` — 3 video thành phẩm đã duyệt, dùng làm chuẩn nhịp và hình.
