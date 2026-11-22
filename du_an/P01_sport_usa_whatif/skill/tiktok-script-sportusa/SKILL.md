---
name: tiktok-script-sportusa
description: "Skill 2/3 của AbsurdPlay Sport USA (NFL + NCAA, TikTok 9:16, lời tiếng Anh Mỹ, giọng clone Sport USA trên Magnific). Nhận TT_TOPIC_PACKET_V1, viết kịch bản TUẦN TỰ từng phần P01..P0N qua scripts/tiktok_script_assembler.py (cấm viết 1 hơi), chọn 1 trong 3–5 hook ≥16/20, kiểm opening-audit + beat-audit + QA 8 trục P0/P1/P2, lock-export 01-TT-SCRIPT / 02-TT-VOICE / 03-TT-TIMELINE.csv / 04-TT-MANIFEST.json (+05 file dán Magnific) và kit-check phân cảnh khớp engine three.js (06-TT-KIT-SHOTLIST + epNN_shots.js). Dùng khi đã có packet hoặc người dùng duyệt đề tài và cần viết kịch bản."
---

# TikTok Script — AbsurdPlay Sport USA (`v4.0-sportusa.1`, 22/11/2026)

Phái sinh từ `tiktok-script-all-in-one@4.0 BASE_RAW` (`ADAPT_SKILLS`). Đã xoá ví dụ ngách khác, chế độ `INTERVIEW_TRUE_STORY` (kênh không kể chuyện cá nhân) và nhánh sub-60 (kênh cấm < 60 s). Chat với chủ kênh bằng tiếng Việt; lời đọc tiếng Anh Mỹ. Luật kênh gốc: `QUY_TAC_KENH.md` + skill `sport-usa-whatif` — mâu thuẫn thì luật kênh thắng. Hồ sơ `TIKTOK_NICHE_PROFILE` đầy đủ: `../tiktok-topic-studio-sportusa/SKILL.md` §0 (cùng `profile_id = absurdplay-sportusa-nfl`, rev 1).

## 0) Hồ sơ cấp kênh (tóm tắt tự đủ)
- **Shortform DNA (MEASURED_BASELINE, 23 video mẫu + E15–E27):** lời vào 0,0 s; không lặng > 0,35 s; shot trung vị 1,4–2,2 s, 35–45 shot; cú xoay 20–45 %; "Final score"/kết quả 80–95 %; phụ đề vàng `#F5F500` chữ thường Montserrat ExtraBold 60, chân chữ y≈1310, 2–4 từ/cụm; watermark "AbsurdPlay" y≈205; −14 LUFS, nhạc = giọng −13 LU.
- **Tốc độ đọc đo thật (giọng Sport USA, sau atempo ×1,05):** mascot 146–158 từ/phút (mặc định 154/146/172), troll 166–173 (168/160/180). `count_unit = words`.
- **Tư thế cảm xúc duy nhất:** `TRASH_TALK_GLEE` — hả hê cà khịa có giới hạn; fan "toxic" chọc bên thua bằng thành tích/sự thật, không công kích cá nhân.
- **Voice Guide 5 thành tố:** (1) câu ngắn 3–12 từ, nhịp bình luận viên; (2) thuật ngữ bóng thật đúng chỗ (sack, pick, fourth-and-one, prevent, blitz); (3) 1 câu đùa lặp ≥ 2 lần; (4) số viết bằng CHỮ (Magnific đọc chữ số dở) — assembler chặn chữ số; (5) kết bằng câu chọc + câu hỏi mở cho comment.
- **14 thẻ dữ liệu dọc → module kit:** số đếm lớn / thẻ chỉ số (`epNN_gfx.html` `.stat`), bug tỉ số trên cùng, biểu đồ cột dọc, lower-third tên + số áo, thẻ "VS" chia đôi trên/dưới, thẻ trích nguồn `[NFL.com · 2026]`, timeline năm dọc, HUD đếm hiệp ("ROUND 2"), checklist, thẻ "Trước → Sau" (biến hình), lưới icon, vòng %, danh sách đánh số, thẻ kết quả "FINAL". Giữ 30–40 % shot có thẻ; phần còn lại là hành động 3D tràn khung.

## 1) Kỷ luật CẤM VIẾT 1 HƠI — `AGENT_AUTONOMOUS_STEP_LOOP` (1 vòng tool = 1 phần)
Cấm ghi nhiều phần trong 1 lượt, cấm sinh cả bài rồi cắt. Workspace chuẩn: `du_an/P01_sport_usa_whatif/tap/<E2x_slug>/tt/` (PARTS/, state, audit), đầu ra `tt/out/`. Lệnh (chạy từ `skill/tiktok-script-sportusa/`):
```bash
A=scripts/tiktok_script_assembler.py; WS=../../tap/<E2x_slug>/tt
python3 $A init --workspace $WS --topic-id TT-00x --slug <slug> --series mascot --track creator_rewards \
  --part-budgets "45,60,60,45" --frame0-text "<≤2 dòng, ≤11 từ>"          # tốc độ mặc định = đo thật theo series
# lượt riêng: viết PARTS/P01.txt (mỗi beat 1 dòng hoặc ngăn bằng |) rồi:
python3 $A verify-part --workspace $WS --topic-id TT-00x --part-id P01 --file $WS/PARTS/P01.txt
python3 $A opening-audit --workspace $WS --topic-id TT-00x --p01-only
# lượt riêng cho từng P02..P0N + verify-part; sau cùng:
python3 $A stitch-draft --workspace $WS --topic-id TT-00x
python3 $A beat-audit --workspace $WS --topic-id TT-00x
python3 $A lock-export --workspace $WS --topic-id TT-00x --out-dir $WS/out
python3 $A kit-check --shotlist $WS/SHOTLIST.json --timeline $WS/out/03-TT-TIMELINE-<slug>.csv \
  --out-dir $WS/out --ep-prefix ep2x_<doi1>_<doi2>
```
**Khoá kênh trong `verify-part`:** chữ số → chặn (`--allow-digits` chỉ khi cố ý); `series=mascot` có tục → chặn; `series=troll` phải có đúng 1 câu tục trong beat 1 của P01 (âm thanh bíp 1 kHz, phụ đề "f***"); từ chủ đề cấm (chấn thương, bệnh, gia đình, chủng tộc, pháp lý) → chặn, trừ `--allow-sensitive` kèm lý do ghi QA; từ bị FYP bóp (kill, shoot, gun, blood, bet…) → cảnh báo, thay bằng từ tự nhiên ("crush", "fire", "launch"). Lệch ngân sách > 22 % → `NEEDS_REPAIR`. Sửa sau khoá → sửa `PARTS/P0k.txt`, `verify-part --revision r+1` (tự huỷ khoá) rồi lock lại.

## 2) Động cơ thể loại của kênh (`No-Formula-Forcing`)
- **Mascot đối đầu (series hiện hành):** Hook "What if <đội A> were actual <mascot A>… and <đội B> were actual <mascot B>?" + giây 0 xé áo biến hình → giới thiệu A bằng hành động có đạo cụ + sự thật gốc tên → giới thiệu B tương tự → "One field. One football. Zero rules." → hiệp 1 lợi thế A (sự thật) → hiệp 2 lợi thế B → cú xoay ~35–45 % (fan toxic / lật thế) → **đỉnh cảnh tượng 55–65 % (có 1 nhịp lặng trước cú nổ âm lớn nhất)** → hệ quả → "Comment who wins" nối khít về giây 0. Không chửi. Fan toxic luôn có.
- **Troll đội thua (trận ≤ 48 giờ):** khuôn gộp 10 nhịp của `sport-usa-whatif` §0 (đội thua vs 11 vật vô tri, thua đúng lỗi thật, đội thắng troll, hoá thành vật). Mọi số liệu trận ≥ 2 nguồn.
- Cấm: tục ngoài hook troll, bịa trích dẫn, người thật ngoài thể thao, logo thật, tên sân thật, dạng lấy thảm kịch làm trò.

## 3) Chống vuốt 0–15 s & đồng bộ hình–lời 9:16
1. **3–5 bản nháp hook, chấm 20 điểm (5 tiêu chí × 0–4):** Mute Test Frame-0 · What+Why sắc · cược/nguy cơ với fan · câu hỏi mở kéo sang 15–30 s · 0 % mùi AI. Chọn bản ≥ 16/20 cao nhất; diệt 4 Hook Killers (mở bằng "In 1933…", thuật ngữ khô, rao follow sớm, khoe danh hiệu kênh). Hook không lặp mở đầu cũ (kho hook ở skill topic §6).
2. **Frame-0 bốn thành tố** khớp kit: chuyển động 0,0 s (`transformFX` / va chạm), tiếng 0,0 s (`magnific/football_hit`, `crowd_roar`), chữ ≤ 2 dòng trong vùng an toàn (x 90–870, y 180–1480; tránh y≈205 watermark và y≈1310 phụ đề), vật hữu hình (2 đội mặc đồ mascot đối mặt).
3. **"Nói gì hình hiện nấy":** mọi số/năm/so sánh đọc trong 0–30 s (`opening-audit` liệt kê, kể cả số viết bằng chữ) phải hiện thẻ hoặc vật 3D đúng giây phát âm. Không B-roll chung chung — mỗi câu một hành động 3D có đạo cụ, máy luôn chuyển động.
4. **Sáu mốc, 0 khoảng chết > 3 s** (beat ≤ 8,5 s); mỗi phần đổi ≥ 1 biến (`SCALE_RUNG, POWER, DANGER, INFORMATION, OWNERSHIP`).

## 4) Kiểm toán Bước 5.4 + QA 8 trục (P0/P1/P2)
Đọc `*_SEAM_ANCHORS`, `*_OPENING_AUDIT`, `*_BEAT_AUDIT`; rà mối nối P0k→P0k+1 và FINAL→0,0 s (cấm Recap Cliff, cấm Outro Bomb kiểu "Thanks for watching"). Chấm /100:
1. Frame-0 + hook thắng ≥ 16/20 + mở vật hữu hình (20) · 2. Sự thật FACT/CALC ≥ 2 nguồn, Twin, từ bị bóp, luật tục/chủ đề cấm (20) · 3. Đồng bộ hình–lời 9:16 + thẻ dữ liệu (10) · 4. Sáu mốc, đỉnh 55–65 %, 0 chết > 3 s, 1 tư thế cảm xúc (15) · 5. Nhân quả + continuity đạo cụ/nhân vật (10) · 6. Toán thời lượng, `T_fast ≥ 62 s` (15) · 7. Giọng tự nhiên đọc to được, không `—`/`→`, vùng an toàn (5) · 8. Gói file lossless + kit-check không blocker (5).
**P0** = chặn khoá (sai sự thật, chạm chủ đề cấm, < 62 s, twin blocker, roundtrip lỗi) · **P1** = sửa trước khoá (hook < 16, khoảng chết, số không có thẻ) · **P2** = ghi chú. Tự sửa hết P0/P1 trên `PARTS/` trước `lock-export`.

## 5) Gói xuất
- `01-TT-SCRIPT-<slug>.txt` master · `02-TT-VOICE-<slug>.txt` lời thuần (token khớp 100 %) · `03-TT-TIMELINE-<slug>.csv` beat + dải giây FYP + neo số · `04-TT-MANIFEST-<slug>.json` · `05-MAGNIFIC-PASTE-<slug>.txt` (thêm tag `[energetic, fast-paced narrator]`, dán vào Magnific).
- **Phân cảnh khớp kit:** viết `tt/SHOTLIST.json` (`{slug, shots:[{id,t0,t1,set,action,camera,gfx,kit:["lib/x.js:export"],mixamo:[],sfx:["magnific/…"],assets:[],motion_at_0s}]}`), chạy `kit-check` → `06-TT-KIT-SHOTLIST-<slug>.{json,csv}` (trạng thái mỗi shot: `CO_SAN`, `CO_SAN_FALLBACK` (thiếu FBX Mixamo, dùng UAL), `CAN_DUNG_CODE` (module mới phải viết), `THIEU_TAI_NGUYEN`) + `ep2x_<…>_shots.js` (bảng `SH` cho engine). Mốc là ƯỚC TÍNH theo tốc độ đo; sau khi có MP3 thật, chỉnh lại theo `words_tw.json` (Whisper).
- Kèm `QA.md` trong thư mục tập: điểm 8 trục, nguồn, hook nháp + điểm, 3 tiêu đề viral + 5–6 hashtag (#NFL #<Đội> #WhatIf #NFLMascot #AbsurdPlay …).
- **Dừng ở đây** khi chưa duyệt (duyệt lần 1 = kịch bản). Chưa TTS, chưa render.
