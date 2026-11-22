---
name: tyler-tt-script
description: "Viết kịch bản TikTok cho series hài 3D 'Tyler meets…' từ TT_TOPIC_PACKET_V1, tuần tự từng phần P01..P04 qua scripts/tiktok_script_assembler.py (cấm viết 1 hơi): 3–5 hook chấm ≥ 16/20, cold open + 'What the fuck is wrong with this dude?' + 'This is X.' ≤ 9 s, vai phụ ≤ 8 từ, sandwich, câu chốt 3 vế, 68–77 s (T_fast ≥ 62 s), sidecar phân cảnh .shots khớp kit Blender, opening-audit + beat-audit + QA 8 trục P0/P1/P2, lock-export 01-TT-SCRIPT / 02-TT-VOICE / 03-TT-TIMELINE.csv / 04-TT-MANIFEST.json và kit-export ra episodes/<ID>/shots.txt. Dừng trước TTS/render. v1.0 — ADAPT_SKILLS từ tiktok-script-all-in-one BASE_RAW v4.0 (22/11/2026)."
---

# tyler-tt-script v1.0 (profile `tyler-meets-westbrook` rev 1)

Skill 2/3. Nhận packet từ `tyler-tt-topic-studio`, xuất gói kịch bản khóa + phân cảnh cho kit. **Không** chạy SonicVoice hay Blender — bước đó thuộc skill `tyler-meets-homeboy-production` (Bước B–D) và chỉ làm sau khi người dùng **chốt kịch bản** (OWNER_LOCKED luật 1). Báo cáo tiếng Việt; lời thoại tiếng Anh.

## 0) Hồ sơ kênh nhúng sẵn
Bản đầy đủ: [`references/NICHE_PROFILE.md`](references/NICHE_PROFILE.md). Tóm tắt bắt buộc nhớ:
- **Khuôn HB:** cold open 1–2 s (nhân vật của tập, to, có cảm xúc) → `TYLER: What the fuck is wrong with this dude?` → `This is <Name>.` + 2–3 câu tả (bắt đầu ≤ 9 s) → leo thang qua 3 bối cảnh → **cú lật ở bối cảnh 4, đặt ở 55–65 % thời lượng** → câu chốt **3 vế ngắn** → **sandwich của Tyler bị phá**.
- **Giọng:** Tyler kể "I", mỉa mai, khô, như trình bằng chứng; câu ngắn ≤ 12 từ; tiếng miệng viết đúng chữ, có gạch nối (`Skrrrt!`, `Tsk-tsk.`) để ASR bắt đúng.
- **Thông số đo:** 145 wpm (gồm nghỉ 0.45 s) · 170–185 từ · 4.6–5.3 cắt/10 s · lời vào 0.0 s.
- **Chỉ có phụ đề trên hình**; "thẻ dữ liệu" = chữ/vật trong cảnh 3D (biển, bảng điểm, điện thoại tự vẽ, phiếu phạt).
- **Sự thật:** hư cấu (`CREATIVE`); trend thật chỉ nhắc tên; không số liệu đời thật giả mạo.

## 1) Kỷ luật CẤM VIẾT 1 HƠI — `AGENT_AUTONOMOUS_STEP_LOOP`
Một vòng tool = một phần. Không ghi nhiều phần trong một lệnh, không sinh cả bài rồi cắt ngược. Thư mục làm việc: `episodes/<ID>/tt/` (gốc dự án = `du_an/P02_tyler_meets`). `A=.claude/skills/tyler-tt-script/scripts/tiktok_script_assembler.py`.
```bash
# 0) Khóa Blueprint (sau khi đã chọn hook thắng ở §2)
python $A init --workspace episodes/<ID>/tt --topic-id TT-00x --slug <slug> --kit-episode-id <ID> \
  --track creator_rewards --part-budgets "52,46,40,42" \
  --cast "TYLER=NARR:narrator,<STAR>=<TAG>:star,<KID>=<TAG>:student,<ADULT>=<TAG>:adult" \
  --frame0-text "<trang phụ đề đầu, 1–3 từ>"
# 1) Mỗi lượt: viết PARTS/P0k.txt + PARTS/P0k.shots -> verify-part (P01 thêm opening-audit --p01-only)
python $A verify-part --workspace episodes/<ID>/tt --topic-id TT-00x --part-id P01 --file episodes/<ID>/tt/PARTS/P01.txt
python $A opening-audit --workspace episodes/<ID>/tt --topic-id TT-00x --p01-only
# 2) Đủ phần: stitch-draft -> beat-audit --strict -> opening-audit (toàn bài) -> QA §5 -> lock-export -> kit-export
python $A stitch-draft --workspace episodes/<ID>/tt --topic-id TT-00x
python $A beat-audit --workspace episodes/<ID>/tt --topic-id TT-00x --strict
python $A lock-export --workspace episodes/<ID>/tt --topic-id TT-00x --out-dir episodes/<ID>/tt/out
python $A kit-export --workspace episodes/<ID>/tt --topic-id TT-00x --episode-dir episodes/<ID>
```
- Mặc định của assembler đã theo kênh: `dialogue_scenes`, `words`, rate 145/136/152 (`MEASURED_SAMPLE`), chặn `—`/`→`.
- **Sửa sau khi khóa:** sửa `PARTS/P0k.txt` (+ `.shots`) → `verify-part --revision <r+1>` (tự hủy khóa, tăng `script_version`) → khóa lại.

### 1.1 Định dạng phần (`PARTS/P0k.txt`)
Mỗi dòng một lượt nói `SPEAKER: lời` (một người nói mỗi dòng). Không tiêu đề, không chỉ dẫn sân khấu, không `[tag]`, không URL, không chữ số (đánh vần: "thirty-one").
```
ELIJAH: Aura.
TYLER: What the fuck is wrong with this dude?
```
### 1.2 Sidecar phân cảnh (`PARTS/P0k.shots`) — khớp kit
Một dòng cho mỗi dòng của `P0k.txt`, cùng thứ tự: `beat / beat | KEY_1 / KEY_2`. Ghép các beat lại phải **trùng từng chữ** với lời nói (assembler chặn nếu lệch). Mỗi beat một key; một key dùng chung cho cả dòng thì ghi 1 key.
- Tiền tố key: `OPEN_` (khung mở) · `CU_` cận · `MS_` trung · `WIDE_` toàn · `OTS_` qua vai · `TWO_SHOT_` · `INS_` cận đồ vật · `POV_` ảnh nền cho ảnh chèn điện thoại. Chỉ chữ HOA, số, `_`.
- Đặt tên theo nhân vật/việc: `CU_ME_*` = mặt Tyler; `CU_<STAR3>_*` = nhân vật của tập (vd. `CU_ELI_SQUINT`).
- Beat ước tính < 0.9 s sẽ bị gộp ở `plan_shots.py` → gộp beat hoặc dùng chung key.
- `kit-export` ghi `episodes/<ID>/shots.txt` đúng định dạng `Lxx [TAG] beat / beat | KEY / KEY` mà `sonicvoice_tts.py`, `make_library.py`, `plan_shots.py` đọc (đã kiểm hồi quy: dựng lại TMG01 ra đúng `shots.txt` gốc).

### 1.3 Cổng kênh mà `verify-part` chặn cứng
| Cổng | Điều kiện |
|---|---|
| Cast | mọi speaker có trong `--cast`; đúng 1 `star`; cảnh báo nếu > 3 học sinh hoặc > 1 người lớn có thoại |
| Độ dài câu | vai phụ ≤ 8 từ; `star` ≤ 12 từ |
| P01 | dòng 1 không phải TYLER; dòng 2 đúng nguyên văn `TYLER: What the fuck is wrong with this dude?`; `This is <Name>.` bắt đầu ≤ 9.0 s |
| Phần cuối | có chữ `sandwich`; dòng TYLER cuối nên có ≥ 3 câu (cảnh báo) |
| Lời | không chữ số, không thẻ cảm xúc TTS, không `—`/`→`, không từ trong watchlist (gun, shooting, vape, drugs, blood, suicide…) |
| Ngân sách | lệch > 22 % so với budget phần → viết lại; tổng 68–77 s ở rate tâm, T_fast ≥ 62 s |
| Sidecar | đủ dòng, khớp từng chữ, key hợp lệ |

## 2) Hook: 3–5 bản nháp, cổng 20 điểm (chọn 1)
Hook của kênh = **cold open (dòng 1) + câu WTF (cố định) + "This is X." + câu tả đầu**. Chỉ cold open và câu tả là biến. Chấm 5 tiêu chí × 0–4:
1. **Mute test Frame-0:** khung 0 có hành động lớn + vật thể nhận ra ngay + trang phụ đề đầu tự đứng được?
2. **What + Why sắc:** trong 3 s người xem biết nhân vật làm gì kỳ quặc và vì sao đáng xem tiếp?
3. **Nguy cơ cá nhân:** Tyler (hoặc sandwich) có nguy cơ bị kéo vào không?
4. **Vòng mở kéo sang 15–30 s:** có câu hỏi chưa trả lời ("sao ai cũng mê nó?")?
5. **Tự nhiên, 0 % mùi AI:** nói được như teen Mỹ thật, không slogan.
**≥ 16/20** mới dùng. Diệt 4 hook killer: mở bằng thời gian/địa điểm ("It was Monday…"), thuật ngữ, rao bán, khoe. Lưu bảng chấm vào `episodes/<ID>/tt/HOOKS.md`.

## 3) Cấu trúc 6 mốc ↔ 4 phần
| Mốc | Thời gian | Phần | Nội dung kênh |
|---|---|---|---|
| 1 Frame-0 hook | 0–3 s | P01 | cold open + WTF |
| 2 Nhỏ & gần | 3–12 s | P01 | "This is X." + 2–3 câu tả, bối cảnh 1 |
| 3 Bậc đầu | 12–25 s | P01–P02 | hành vi lần 1, phản ứng vai phụ |
| 4 Ngoặt giữa | ~30 s | P02 | bối cảnh 2, leo thang, Tyler bị kéo vào |
| 5 Đỉnh 55–65 % | ~40–48 s | P03 | bối cảnh 3–4, lộ cú lật; **một nhịp lặng** (beat im hoặc câu cực ngắn) ngay trước cú nhấn |
| 6 Hệ quả + nối | cuối | P04 | payoff, sandwich bị phá, câu chốt 3 vế; dòng cuối nên vọng lại hình/âm của khung 0 để loop |
- Mỗi dòng phải đổi ≥ 1 biến trạng thái (`INFORMATION`, `POWER`, `TRUST`, `DANGER`, `OWNERSHIP` (sandwich), `STATUS`…). Không khoảng chết > 3 s (beat-audit `--max-beat-sec 8.5`; thực tế giữ ≤ 6.5 s).
- Nhân quả: mọi đạo cụ ở payoff phải được cài trước (Chekhov). Tri thức nhân vật nhất quán qua các phần.
- **"Nói gì hình hiện nấy":** mỗi con số/giờ/tên trend nói trong 0–30 s phải có key `INS_`/`POV_` hoặc chữ trong cảnh đúng beat đó (opening-audit liệt kê các neo cần hình).

## 4) Diệt văn AI (lời nói tiếng Anh)
Cấm: `—`, `→`, "It's not X, it's Y", liệt kê 3 vế đối xứng giả (trừ câu chốt cố ý), "Here's the thing", "Let that sink in", câu hỏi tu từ "You know why?", triết lý cuối bài. Đọc to thử: phải nghe như một thằng 16 tuổi kể chuyện ở bàn ăn. Viết tiếng miệng đúng chữ người dùng duyệt.

## 5) QA 8 trục (/100) — sửa hết P0 và P1 trước `lock-export`
| # | Trục | Điểm | P0 (chặn) nếu |
|---|---|---|---|
| 1 | Frame-0 + hook thắng ≥ 16/20 + vật thể hữu hình | 20 | không có bảng 3–5 hook, hoặc cold open không hành động |
| 2 | Sự thật / trend ≥ 2 nguồn / 5 trục CLEAR / sạch watchlist | 20 | TWIN, hoặc nói sai sự thật về trend |
| 3 | Hình–lời 9:16: mọi neo 0–30 s có key hình; chỉ phụ đề trên hình | 10 | neo số không có cảnh |
| 4 | 6 mốc, đỉnh 55–65 %, không chết > 3 s, 1 tư thế cảm xúc | 15 | đỉnh < 45 % hoặc > 75 % |
| 5 | Nhân quả, continuity, state delta mỗi dòng | 10 | payoff dùng thứ chưa cài |
| 6 | Thời lượng 68–77 s, T_fast ≥ 62 s | 15 | ngoài dải |
| 7 | Giọng tự nhiên, câu ≤ 12 từ, an toàn nội dung (luật 13) | 5 | chê ngoại hình/sắc tộc, bạo lực với nhân vật nữ |
| 8 | Gói 4 file lossless + `shots.txt` + bản liền mạch | 5 | roundtrip lỗi |
P1 = trừ ≥ 3 điểm ở một trục; P2 = góp ý. Ghi kết quả vào `episodes/<ID>/tt/QA_REPORT.md`.

## 6) Gói giao (dừng ở đây, chờ người dùng chốt)
- `episodes/<ID>/tt/out/01-TT-SCRIPT-<slug>.txt` · `02-TT-VOICE-<slug>.txt` (lossless) · `03-TT-TIMELINE-<slug>.csv` (có cột `scene_keys`) · `04-TT-MANIFEST-<slug>.json`.
- `episodes/<ID>/shots.txt` (kit-export) + `episodes/<ID>/<ID>_script_lienmach.md` (bản liền mạch kiểu TM02/TMG01, người dùng thích đọc bản này) + `<ID>_script_full.md` (bảng cảnh: key → bối cảnh, nhân vật, hành động, camera, chữ trong cảnh, vai phụ cử động) + `out/<ID>_post.txt` (1 dòng tiêu đề tiếng Anh).
- Ghi một dòng vào `PROJECT_STATE.md`. Sau khi người dùng chốt: chuyển sang `tyler-meets-homeboy-production` Bước B (giọng) với `shots.txt` này.

## 7) Mẫu lệnh
```text
Dùng $tyler-tt-script. Nhận packet episodes/<ID>/<ID>_TT_TOPIC_PACKET_V1.yaml, chạy vòng lặp từng phần P01..P04, 3–5 hook ≥ 16/20, opening-audit + beat-audit + QA 8 trục, lock-export và kit-export. Không làm giọng.
```
