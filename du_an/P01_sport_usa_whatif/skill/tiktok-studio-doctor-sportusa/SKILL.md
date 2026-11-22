---
name: tiktok-studio-doctor-sportusa
description: "Skill 3/3 của AbsurdPlay Sport USA (NFL + NCAA, TikTok FYP Mỹ). Đọc ảnh chụp/số liệu TikTok Studio ở D+3 và D+7 của một tập, kiểm vệ sinh địa lý 48 giờ (qualified_geo_pct, Views/Unique) bằng fyp-diagnose, tách View Power và Money Power, mổ biểu đồ giữ chân theo từng beat của 03-TT-TIMELINE.csv (khớp shot trong 06-TT-KIT-SHOTLIST), áp hệ số co n/(n+5) và cập nhật Sổ Giả Thuyết của kênh, xuất TT_DIAGNOSTIC_DELTA_V1 cho tập kế. Dùng khi người dùng gửi số liệu/ảnh TikTok Studio."
---

# TikTok Studio Doctor — AbsurdPlay Sport USA (`v4.0-sportusa.1`, 22/11/2026)

Phái sinh từ `tiktok-studio-doctor@4.0 BASE_RAW` (`ADAPT_SKILLS`). Hồ sơ kênh và Sổ Giả Thuyết gốc: `../tiktok-topic-studio-sportusa/SKILL.md` §0 (`profile_id = absurdplay-sportusa-nfl`). Chat tiếng Việt. Công cụ: `../tiktok-script-sportusa/scripts/tiktok_script_assembler.py fyp-diagnose`.

## 0) Vệ sinh 48 giờ đầu (kênh nuôi FYP Mỹ, chủ kênh ở Việt Nam)
- **Cấm trong 48 giờ đầu:** chủ kênh/người quen ở Việt Nam bấm xem lặp, gửi link vào nhóm chat VN, xem bằng nhiều máy cùng Wi-Fi. Mỗi lượt xem VN kéo lô kế tiếp lệch khỏi Mỹ.
- Kiểm: `python3 scripts/tiktok_script_assembler.py fyp-diagnose --qualified-geo-pct <US %> --views <V> --unique-viewers <U>` → `US < 60 %` = `WARN_GEO_DILUTED`; `Views/Unique > 2,0` (video > 60 s) = `CONTAMINATED_LOOP`.
- **Cửa 1:** TikTok Studio → Viewers → Locations (mục tiêu US ≥ 60–80 %); Search queries có chứa tên đội / "NFL" / "what if"? Nếu bị gắn chủ đề lệch (ví dụ "animation", "cartoon") → tập sau siết chữ Frame-0 + 3 giây đầu có tên đội và "NFL".

## 1) Sáu bước đọc một video
1. **Tách View Power / Money Power** — chỉ so trong cùng series (mascot với mascot, troll với troll; mọi tập đều > 60 s).
2. **4 cổng lô FYP:** `0–3s Hold` · `Avg Watch` + `Watched Full %` · `ss_per_k = (shares + saves)/views × 1000` · `fol_per_k`.
3. **Tôn trọng nhịp lô, CẤM xoá đăng lại** bản cắt sửa (dễ dính *Unoriginal*). Sửa ở tập mới.
4. **Cờ Ineligible/Unoriginal:** kênh tự dựng 3D nên kháng nghị bằng 3 ảnh 1600×1000: (a) code `epNN.html` + `epNN_shots.js` có ngày commit GitHub trước giờ đăng, (b) khung render từ `render.js`, (c) kịch bản `01-TT-SCRIPT` + `04-TT-MANIFEST` (`locked_at`).
5. **Chấm theo tuổi bài D+7** (bỏ cột thiếu, chia lại trọng số, không điền 0): `ViewPower = 0.40P(views)+0.15P(full%)+0.15P(avg_s)+0.15P(ss/k)+0.15P(fol/k)`; `MoneyPower = 0.50P(qual_views)+0.20P(avg_s)+0.30P(rpm)`.
6. **Mỗi tập chỉ thử 1 biến mới** (`exploration_element` trong packet) — ví dụ "mascot người thật thay vì thú", "hook có tên đội ở từ thứ 3", "đỉnh cảnh tượng ở 58 % thay vì 65 %".

## 2) Mổ biểu đồ giữ chân theo beat (`03-TT-TIMELINE-<slug>.csv` → shot trong `06-TT-KIT-SHOTLIST`)
Mốc trong CSV là ước tính; trước khi mổ, thay bằng mốc thật từ `tap/<E>/giong/words_tw.json` nếu có.
| Gãy | Nguyên nhân thường gặp ở kênh này | Thuốc cho tập sau |
|---|---|---|
| Rơi 0–2 s | giây 0 nhân vật đứng yên / mờ dần; chữ Frame-0 dài; hook không có tên đội | cảnh biến hình hoặc lao vào nhau ngay 0,0 s; ≤ 11 từ; tên đội trong 3 từ đầu |
| Dốc 3–15 s | đọc số (năm, pound, danh hiệu) mà không có thẻ; câu > 20 từ | thẻ số đúng giây đọc; `opening-audit` |
| Trượt 15–45 s | đoạn giới thiệu mascot đứng yên; hiệp lặp nhịp | mỗi câu một hành động có đạo cụ; mỗi hiệp đổi 1 biến; `beat-audit` |
| Rơi trước 60 s | đỉnh cảnh tượng quá sớm; câu giờ | đỉnh 55–65 %; thêm bậc nhân quả thật |
| Full % thấp | câu kết kiểu outro; nối vòng khựng | cắt ngay sau payoff, câu cuối nối khít câu đầu |

## 3) Co mẫu nhỏ & Sổ Giả Thuyết
- `ShrunkEffect = (ȳ_có − ȳ_không) × n/(n+5)`, `n = min(n_có, n_không)`; `n < 4` → `LOW_SAMPLE_NOISE` (`fyp-diagnose --mean-with --mean-without --n-with --n-without`). Muốn khẳng định +5 điểm % giữ chân ở 95 % cần ~40 bài mỗi nhánh → kênh này kết luận theo hướng, không theo 1–2 bài.
- Cập nhật bảng H1..Hn ở skill topic §0: giả thuyết bị bác bỏ thì **gạch ngang `~~…~~` kèm mã tập phản chứng**, không xoá.

## 4) Đầu ra `TT_DIAGNOSTIC_DELTA_V1`
```yaml
schema_version: TT_DIAGNOSTIC_DELTA_V1
account_and_window: {niche_profile_id: "absurdplay-sportusa-nfl", episode: "E2x", topic_id: "TT-00x", series: "",
  diagnosed_at: "D3_EARLY|D7_LOCKED|BATCH_REVIEW", geo_and_loop_hygiene: ""}
gate_1_seed_classification: {qualified_geo_share_pct: "", detected_search_queries_match_niche: ""}
gate_2_batch_performance: {track_evaluated: "creator_rewards", hold_3s_and_watched_full_pct: "", ss_per_k_and_fol_per_k: "",
  qualified_views_and_rpm: ""}
retention_beat_autopsy: {steepest_drop_beats: [], matching_shots: [], winning_spikes_or_cards: []}
hypothesis_ledger_updates: {confirmed_or_upgraded: [], falsified_strikethrough: []}
next_action_deltas: {single_exploration_element_next: "", for_topic_studio: "", for_script_studio: ""}
```
Mẫu lệnh: "Dùng $tiktok-studio-doctor-sportusa. Đọc ảnh TikTok Studio D+7 của E2x kèm 03-TT-TIMELINE, kiểm vệ sinh địa lý, mổ beat gãy, cập nhật Sổ Giả Thuyết, xuất TT_DIAGNOSTIC_DELTA_V1."
