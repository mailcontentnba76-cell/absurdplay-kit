# TT-001 — QA 8 trục (script v2, khóa 22/11/2026)

Số đo lấy từ `TT-001_TT_*_V2.json`, `04-TT-MANIFEST`, `TT-001_TT_KIT_EXPORT.json`. Thời gian là **ƯỚC TÍNH** ở 145 wpm (đã hiệu chỉnh: dựng lại TMG01 ước tính 73.2 s so với thật 71.4 s, sai khoảng +2.5 %). Mốc thật chỉ có sau khi làm giọng.

| # | Trục | Điểm | Bằng chứng | Lỗi còn lại |
|---|---|---|---|---|
| 1 | Frame-0 + hook ≥ 16/20 + vật thể | 18/20 | `HOOKS.md`: 5 bản nháp, H1 = 18/20; quả bóng chuyển động ở khung 0; tiếng hét 0.0 s; trang phụ đề đầu "OHHH! NO-LOOK"; beat 1 = 2.48 s | P2: cold open do KID nói (đây là biến thử nghiệm H03, người dùng có thể muốn Elijah nói câu to) |
| 2 | Sự thật / trend / 5 trục / watchlist | 18/20 | aura farming: 6 nguồn (08–10/2026) trong packet; 5 trục 1.0/5 CLEAR với TMG01, TM03, TM02; Jaccard thị trường 0.20; watchlist 0 lần | P2: không đo được outlier (thiếu vidIQ/Apify) |
| 3 | Hình–lời 9:16 | 9/10 | 34 key, 7 key `INS_`/`POV_`/`OTS_` có chữ trong cảnh (21 % số beat); số "forty minutes" có đồng hồ tường, "two million" có bộ đếm 2.0M; 0–30 s không có số cần thẻ | P2: dưới mục tiêu ≥ 30 % (HY H05); các cảnh WIDE đã có chữ trong cảnh (bảng điểm, băng rôn, biển BUS 12) |
| 4 | 6 mốc, đỉnh, khoảng chết, tư thế | 13/15 | "This is Elijah." 5.8 s; ngoặt band 24–40 s; **cú lật 42–48 s = 60–68 %**; beat dài nhất 5.79 s; 1 tư thế (RECOGNITION) | **P2:** "It's the coat rack" rơi ở ~66 %, chỉ vượt 1 điểm so với vùng 55–65 % (trước khi sửa: 71 %, đã sửa ở r2) |
| 5 | Nhân quả & continuity | 10/10 | Cài kính trên đầu từ khung 0 → payoff P04; Kayla quay (P01) → zoom (P03) → 2M views (P04); bản nhạc lộn ngược + bắt bóng không nhìn → "can't see"; giá treo áo cài ở hậu cảnh trước cảnh 23; mỗi dòng đổi ≥ 1 biến (STATUS / INFORMATION / OWNERSHIP) | — |
| 6 | Thời lượng | 15/15 | 170 từ → 70.3 s (67.1–75.0 s); T_fast 67.1 ≥ 62.0; trong dải người dùng 68–77 s ở tâm | lưu ý: ở tốc độ nhanh nhất có thể ra 67.1 s, thấp hơn 68 s một chút → nếu giọng thật < 68 s thì để `--gap 0.5` |
| 7 | Giọng tự nhiên & an toàn | 5/5 | câu ≤ 12 từ (dài nhất 10 từ/câu), 0 `—`/`→`, không chê ngoại hình (kính là đạo cụ, không chế giễu thị lực, cú cười đến từ hiểu lầm của đám đông), Kayla không bị bạo lực, 1 lần chửi (câu WTF đã chốt) | — |
| 8 | Gói 4 file + kit | 5/5 | lock-export v2: roundtrip lossless PASS; `shots.txt` 21 dòng / 34 beat / 0 beat < 0.9 s; `library.json` tạo được bằng `make_library.py`; bảng cảnh khớp 34/34 key | — |

**Tổng: 93/100. P0: 0 · P1: 0 · P2: 4** (cold open do KID nói, chưa đo outlier, tỉ lệ chèn chữ trong cảnh 21 %, đỉnh ở 66 %).

## Lịch sử sửa (Edit-Propagation)
- **v1 (r1):** 184 từ, 76.1 s; beat-audit chặn 2 beat (7.45 s, 6.62 s); cú lật ở 66–71 %.
- **r2:** tách b003, cắt 14 từ ở P01–P03 → 170 từ, 70.3 s, beat dài nhất 5.79 s, cú lật ở 60–66 %.
- **r3 (v2):** gộp 2 beat ngắn < 0.9 s ("Still perfect.", "Art class.") về một góc máy để `plan_shots.py` không nuốt mất hình. Lời giữ nguyên, khóa lại thành v2.

## Mối nối (SEAM_ANCHORS_V2)
- P01→P02: "Zero crops." → "Second period. Band." (cắt cứng sang bối cảnh mới, đúng khuôn).
- P02→P03: "Still perfect." → "Art class." (lặp nhịp "khen vô lý" rồi chuyển sang chỗ lật).
- P03→P04: "He wasn't farming anything." → "After school. I point at his head." (đẩy thẳng vào payoff).
- FINAL→0.0 s: Elijah tháo kính, nheo mắt (cảnh 32) → khung 0 Elijah nheo mắt dựa cột: vòng lặp bằng hình.
