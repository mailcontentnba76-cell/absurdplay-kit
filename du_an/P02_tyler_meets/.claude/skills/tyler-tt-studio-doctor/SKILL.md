---
name: tyler-tt-studio-doctor
description: "Chẩn đoán sau đăng cho series hài 3D 'Tyler meets…' trên TikTok (US): kiểm vệ sinh địa lý 48 h (qualified geo ≥ 60–80 %, views/unique ≤ 2.0), đọc 4 cổng (0–3 s hold, watched full / avg watch, shares+saves/1K, follows/1K), tách View Power / Money Power, mổ biểu đồ giữ chân D+3/D+7 theo beat và scene_keys của 03-TT-TIMELINE.csv, hệ số co n/(n+5), cập nhật HYPOTHESIS_LEDGER (gạch ngang, không xóa) và xuất TT_DIAGNOSTIC_DELTA_V1 cho tập kế. Dùng khi người dùng gửi ảnh/số TikTok Studio của một tập Tyler meets. v1.0 — ADAPT_SKILLS từ tiktok-studio-doctor BASE_RAW v4.0 (22/11/2026)."
---

# tyler-tt-studio-doctor v1.0 (profile `tyler-meets-westbrook` rev 1)

Skill 3/3: biến số liệu TikTok Studio thành quyết định cho tập sau. Báo cáo tiếng Việt. Hồ sơ kênh: [`../tyler-tt-script/references/NICHE_PROFILE.md`](../tyler-tt-script/references/NICHE_PROFILE.md). Sổ giả thuyết: [`references/HYPOTHESIS_LEDGER.md`](references/HYPOTHESIS_LEDGER.md).

## 0) Hồ sơ nhúng sẵn
- Kênh nhắm **US** (CA/UK/AU phụ), tiếng Anh, nhánh `creator_rewards` (giọng 68–77 s). Chủ kênh ở Việt Nam → **rủi ro lệch địa lý cao nhất là chính mình và bạn bè xem từ VN**.
- Mỗi tập có `episodes/<ID>/tt/out/03-TT-TIMELINE-<slug>.csv` (cột `beat_id, est_start_sec, scene_keys, spoken_text…`). Thời gian trong CSV là **ước tính** từ 145 wpm; nếu đã có `episodes/<ID>/timeline.json` (sau plan_shots) thì **dùng mốc thật của timeline.json** để mổ (chính xác hơn).
- Chưa có số liệu Studio nào trong kit (22/11/2026) → mọi luật nhịp/hook hiện là `HYPOTHESIS_TO_TEST`.

## 1) Khóa vệ sinh 48 h đầu (bắt buộc nhắc người dùng mỗi lần đăng)
1. Không tự xem lặp, không gửi link vào nhóm chat Việt Nam, không xem bằng máy dùng chung Wi-Fi nhiều lần.
2. Đăng chéo Shorts/Reels bằng **file render gốc** `episodes/<ID>/out/*.mp4` (không watermark).
3. Kiểm:
```bash
python .claude/skills/tyler-tt-script/scripts/tiktok_script_assembler.py fyp-diagnose \
  --qualified-geo-pct <US+CA+UK+AU %> --views <V> --unique-viewers <U> --current-followers <F> --fol-per-k <R>
```
`qualified_geo < 60 %` = lệch hạt giống; `views/unique > 2.0` (với bài ~70 s) = nhiễm xem lặp. Có cảnh báo thì **chưa kết luận gì về nội dung**.

## 2) Đọc 6 bước
1. **View Power vs Money Power:** chỉ so các tập cùng nhánh (đều ≈ 70 s). Tập trend (TMG) và tập kiểu bạn (TM) ghi nhãn riêng để so trong nhóm.
2. **4 cổng:** 0–3 s hold (cold open) · avg watch & watched full % (nhịp leo thang, cú lật 55–65 %) · ss_per_k = (shares+saves)/views×1000 (tag bạn bè = tín hiệu "recognition") · fol_per_k (lời hứa series 20 kiểu bạn).
3. **Nhịp lô & CẤM XÓA ĐĂNG LẠI:** đuôi Search lên chậm D+3…D+14; tập yếu để nguyên, sửa ở tập sau.
4. **Cờ Unoriginal/Ineligible:** nội dung kênh là Blender tự dựng → kháng nghị bằng 3 ảnh 1600×1000: (a) cửa sổ code scene `tools/hb/<id>_scene.py` + log render có ngày, (b) `shots.txt`/kịch bản có ngày tạo trước giờ đăng, (c) bảng khung hình QA.
5. **Chấm cùng tuổi bài (D+3 sớm, D+7 chốt):** `ViewPower = .40P(views)+.15P(full%)+.15P(avg_s)+.15P(ss/k)+.15P(fol/k)`; `MoneyPower = .50P(qual_views)+.20P(avg_s)+.30P(rpm)`; thiếu cột thì chia lại trọng số, không điền 0.
6. **Đúng 1 biến mới mỗi tập** (`exploration_element` trong packet): chỉ quy nhân quả cho biến đó.

## 3) Mổ giữ chân theo beat của kênh
| Gãy | Beat/scene thường gây ra | Thuốc cho tập sau |
|---|---|---|
| 0–2 s | cold open yếu (`OPEN_*`): nhân vật đứng yên, tiếng nhỏ, phụ đề đầu không tự hiểu | cold open hành động to hơn + tiếng miệng ở 0.0 s; trang phụ đề đầu ≤ 3 từ có từ khóa vàng |
| 3–15 s | "This is X." đến muộn; câu tả dài; cảnh `WIDE_` xa không thấy mặt | "This is X." ≤ 6 s; tả bằng hành động `CU_`/`INS_` thay vì lời |
| 15–45 s | bối cảnh lặp nhịp; vai phụ đứng im; không có chữ/vật trong cảnh cho con số | đổi bối cảnh đúng lúc; thêm chi tiết lạ; thẻ dữ liệu trong cảnh |
| trước 60 s | cú lật đặt quá sớm (< 45 %) hoặc phần 4 câu giờ | cú lật 55–65 %, thêm 1 bậc nhân quả thật |
| cuối | câu chốt dài, sandwich đến muộn, nhạc tắt khựng | câu chốt 3 vế ngắn, cắt ngay sau payoff, nhạc chạy qua điểm loop |
Ghép đường giữ chân với `scene_keys` để biết **cảnh nào** gãy, không chỉ giây nào.

## 4) Co mẫu nhỏ & Sổ Giả Thuyết
- `ShrunkEffect = (ȳ_có − ȳ_không) × n/(n+5)`, `n = min(n_có, n_không)`; `n < 4` → `LOW_SAMPLE_NOISE`. Muốn chắc +5 điểm % giữ chân cần ~40 tập mỗi nhánh (σ ≈ 8) → series này sẽ ở trạng thái "định hướng" rất lâu; đừng đổi khuôn HB vì 1–2 tập.
- Cập nhật `references/HYPOTHESIS_LEDGER.md`: bác bỏ thì `~~gạch ngang~~` + mã tập phản chứng; không xóa dòng.

## 5) Xuất `TT_DIAGNOSTIC_DELTA_V1`
```yaml
schema_version: TT_DIAGNOSTIC_DELTA_V1
account_and_window: {niche_profile_id: tyler-meets-westbrook, episode_id: "", diagnosed_at: "", geo_and_loop_hygiene: ""}
gate_1_seed_classification: {qualified_geo_share_pct: "", detected_search_queries_match_niche: ""}
gate_2_batch_performance: {track_evaluated: creator_rewards, episode_kind: "TM|TMG|TT", hold_3s_and_watched_full_pct: "",
  ss_per_k_and_fol_per_k: "", qualified_views_and_rpm: ""}
retention_beat_autopsy: {steepest_drop_beats: [], steepest_drop_scene_keys: [], winning_spikes_or_cards: []}
hypothesis_ledger_updates: {confirmed_or_upgraded: [], falsified_strikethrough: []}
next_action_deltas: {single_exploration_element_next: "", for_topic_studio: "", for_script_studio: "", for_kit_blender: ""}
```
Lưu `episodes/<ID>/tt/DIAG_D3.yaml` / `DIAG_D7.yaml`, thêm 1 dòng vào `PROJECT_STATE.md`.

```text
Dùng $tyler-tt-studio-doctor. Đây là ảnh TikTok Studio tập <ID> ở mốc D+7: kiểm vệ sinh 48 h, chấm View/Money Power, mổ beat gãy theo 03-TT-TIMELINE, cập nhật sổ giả thuyết, xuất TT_DIAGNOSTIC_DELTA_V1.
```
