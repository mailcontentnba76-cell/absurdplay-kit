---
name: tyler-tt-topic-studio
description: "Chọn đề tài TikTok cho series hài 3D 'Tyler meets…' (Westbrook High, US, en-US, 9:16, 68–77 s): quét trend teen + 20 kiểu bạn của series, lập bản đồ tâm lý RECOGNITION_RELATABLE_CHAOS, kiểm trùng 5 trục với HB01–02/TM01/TM02/TMG01/TM03 (+ twin-seo-check), kiểm khả năng dựng bằng kit Blender (bối cảnh chưa dùng, cast ≤ 3 HS + 1 người lớn), rồi xuất TT_TOPIC_PACKET_V1 + START_COMMAND sang tyler-tt-script. Dùng khi người dùng nói chọn đề tài, tập mới, trend mới, TT-0xx, kiểm trùng, topic packet cho Tyler meets. v1.0 — ADAPT_SKILLS từ tiktok-topic-studio BASE_RAW v4.0 (22/11/2026)."
---

# tyler-tt-topic-studio v1.0 (profile `tyler-meets-westbrook` rev 1)

Skill 1/3 của vòng **Topic → Script → Studio Doctor** cho series "Tyler meets…". Báo cáo bằng tiếng Việt; hook, tiêu đề, từ khóa SEO bằng tiếng Anh (US). Hồ sơ kênh đầy đủ: [`../tyler-tt-script/references/NICHE_PROFILE.md`](../tyler-tt-script/references/NICHE_PROFILE.md). Luật người dùng gốc: skill `tyler-meets-homeboy-production` §1 — **luật đó thắng mọi thứ trong file này nếu mâu thuẫn**.

## 0) Hồ sơ kênh nhúng sẵn (tóm tắt TIKTOK_NICHE_PROFILE)
| Trục | Giá trị | Nguồn |
|---|---|---|
| Định danh | `tyler-meets-westbrook` rev 1 · base `tiktok-topic-studio@4.0` | — |
| Tư thế | `FICTION_CHARACTER`: Tyler kể "I", người chứng kiến tỉnh táo, luôn gánh hậu quả | OWNER_LOCKED |
| Khán giả | teen Mỹ 13–19 + 18–24 nhớ cấp 3; câu hỏi thầm: *"that's literally the kid in my class"* | HYPOTHESIS (chưa có Studio data) |
| Tư thế cảm xúc | **RECOGNITION_RELATABLE_CHAOS** (nhận ra kiểu bạn + hả hê vì Tyler khổ) — duy nhất | OWNER_LOCKED khuôn HB |
| Nhánh | `creator_rewards`: giọng 68–77 s, T_fast ≥ 62.0 s | OWNER_LOCKED + DOCTRINE |
| Thị trường | US (CA/UK/AU phụ), en-US | OWNER_LOCKED |
| Sự thật | `FICTION_CREATIVE`; trend thật chỉ nhắc tên, hình tự vẽ; tin trend cần ≥ 2 nguồn | OWNER_LOCKED luật 13 |
| Khung | Blender 1080×1920 tràn khung; **chỉ có phụ đề trên hình** | OWNER_LOCKED luật 9 |

**Đòn bẩy:** Theme (kiểu bạn ai cũng gặp / trend teen đang nóng) > Pacing (4.6–5.3 cắt/10 s đã khóa trong kit) > Plan. Một đề tài lạ, không ai nhận ra mình trong đó, thì dựng đẹp mấy cũng không cứu được.

**Lời đồn bị bác bỏ (không dùng làm luật):** nhồi #fyp; xóa đăng lại bản sửa; cắt clip người khác; thu nhỏ video ngang.

## 1) Hai nguồn đề tài hợp lệ (độ thuần ≥ 70 %)
1. **Kiểu bạn (series chính):** 20 tính cách trong `docs/homeboy/SERIES_TYLER_MEETS.md`. Đã dùng #01 Jaylen, #02 Marcus; #03 Destiny có kịch bản chờ duyệt (đừng chiếm). Chỉ lấy **tính cách**, không chép lời/tình huống của `source/Character_Scripts*.txt`.
2. **Trend teen xảy ra trong trường (tập TMG):** trend đang lên/đỉnh trong 0–90 ngày, có ≥ 2 nguồn báo độc lập. **Ghép trend vào một kiểu bạn còn trống** là tốt nhất: quen (kiểu bạn) + mới (trend). Ví dụ đã làm: TMG01 = GTA 6 ghép kiểu "nghiện game".
- Loại ngay: drama người thật, chính trị, thảm họa, trend nguy hiểm (thử thách gây thương tích), trend có hình bản quyền bắt buộc phải chiếu.

## 2) Công cụ nghiên cứu (đọc schema trước khi gọi)
| Việc | Công cụ ưu tiên | Khi không có |
|---|---|---|
| Outlier TikTok/Reels | `vidiq_instagram_tiktok_outlier_search` (lọc `durationMin: 62`), Apify `clockworks/tiktok-scraper` (`shouldDownloadVideos: false`) | **Phiên cloud hiện tại không kết nối vidIQ/Apify** → dùng WebSearch (báo chí, Know Your Meme, trang theo dõi trend) và gắn `evidence_confidence: MODERATE_MIXED` hoặc `HYPOTHESIS_UNVERIFIED`. Không bịa số view. |
| Tin trend (ngày, tên, nguồn gốc) | WebSearch ≥ 2 nguồn | — |
| Kiểm trùng thị trường | WebSearch cụm hook + "tiktok" | ghi "không tìm thấy" là kết quả hợp lệ |

Tách **Market Evidence** (trend đang nóng) khỏi **Fact Evidence** (trend là gì, bắt đầu khi nào). Lượt xem không chứng minh sự thật.

## 3) Quy trình 7 pha
**Pha 1 — Shortlist 3–5 ứng viên.** Mỗi ứng viên: kiểu bạn # + trend (nếu có) + tiền đề 1 câu + cold open + cú lật.

**Pha 2 — Kiểm trùng 5 trục + twin-seo-check.** Chấm từng trục 0 / 0.5 / 1 với **tập gần nhất của kênh** (bảng §9 NICHE_PROFILE) và mẫu thị trường gần nhất:
- **Question** (câu hỏi riêng của tập, không tính câu container "What the fuck…" vì là OWNER_LOCKED) · **Stage** (bối cảnh) · **Ladder** (kiểu leo thang) · **Payoff** (cú lật/kết) · **Look** (ngoại hình nhân vật).
- **≥ 3/5 hoặc trùng cả Question + Payoff = TWIN [BLOCKER]** → đổi bối cảnh, thang leo hoặc cú lật (không chỉ đổi chữ).
- Chú ý trùng đã biết: TMG01 payoff "lộ sự thật tầm thường sau cơn cuồng"; TM03 payoff "tính khí lây sang Tyler". Tập mới không được lặp **cả hai** kiểu này cùng lúc với cùng Question.
```bash
python .claude/skills/tyler-tt-script/scripts/tiktok_script_assembler.py twin-seo-check \
  --candidate "<hook ứng viên>" --competitor "<hook thị trường gần nhất>" \
  --own-past-file .claude/skills/tyler-tt-script/references/own_past_hooks.txt \
  --seo-keywords "<cụm 1>,<cụm 2>" \
  --five-axis "TMG01=0,0,0.5,0.5,0" --five-axis "TM03=0,0,0.5,0,0" --json-out episodes/<ID>/tt/twin.json
```

**Pha 3 — Góc tiếp cận.** Động cơ cố định: khuôn HB (§7 NICHE_PROFILE). Lớp ngoài chọn 1 trong: *Expectation vs Reality*, *Escalation*, *Forensic* (Tyler "trình bằng chứng"), *Point of No Return*. Không nhét cảnh sát/bạo lực vào; người lớn chỉ phạt nhầm Tyler.

**Pha 4 — Frame-0 (phiên bản kênh).** (a) nhân vật của tập chuyển động mạnh ở khung 0 · (b) tiếng to ở 0.0 s · (c) trang phụ đề đầu 1–3 từ đọc được khi tắt tiếng (không overlay khác) · (d) vật thể hữu hình. Hook nói = cold open + câu "What the fuck…".

**Pha 5 — Kiểm khả năng dựng bằng kit (BẮT BUỘC, mới so với bản nền).**
- 4 bối cảnh **chưa dùng**. Còn trống (22/11/2026): phòng nhạc/band, bể bơi, phòng mỹ thuật, hội chợ khoa học, sân bóng rổ ngoài trời, phòng thay đồ, xe đưa đón, cửa hàng trường, sân thượng, bến xe buýt, nhà Tyler. (TM03 giữ: sân trước, lab hóa, phòng máy, khán đài.) Có set dựng sẵn để tái dùng **chi tiết** (không tái dùng bối cảnh): `hb_sets2..5`, `hb_details`.
- Cast: Tyler + 1 nhân vật của tập (`star`) + ≤ 2 học sinh + ≤ 1 người lớn có thoại. Vai phụ còn lại im lặng nhưng luôn cử động.
- Mọi đạo cụ/điện thoại/chữ là đồ tự vẽ (PIL → `assets/hb/tex|prints`). Không cần GPU/credit ảnh; chỉ SonicVoice tốn ký tự.
- Không cần cảnh vật lý khó (nước, vải, đám đông > 20 người chuyển động) nếu không có hàm sẵn.

**Pha 6 — Chấm Scorecard 100 & chia phần.** Tiền đề + Frame-0 (30) · Cầu trend/outlier + SEO (20) · 5 trục + Originality (15) · Độ thuần avatar + thang không khoảng chết > 3 s (15) · Khớp 68–77 s (10) · Nguồn + hình 9:16 tự dựng + sạch từ bóp FYP (10). Chọn ứng viên cao nhất; hòa điểm thì chọn cái dựng được bằng ít hàm mới nhất.
- Chia **4 phần** (mặc định): `P01` cold open + WTF + "This is X." + bối cảnh 1 (≈ 45–60 từ) · `P02` leo thang bối cảnh 1→2 (≈ 40–50) · `P03` bối cảnh 3 + mở cú lật ở 55–65 % (≈ 35–45) · `P04` bối cảnh 4, payoff, sandwich, câu chốt 3 vế (≈ 40–50). Tổng 170–185 từ ở 145 wpm = 70–77 s.

**Pha 7 — Xuất `TT_TOPIC_PACKET_V1` + `START_COMMAND`.** Lưu `episodes/<ID>/<ID>_TT_TOPIC_PACKET_V1.yaml`. ID: tập series `TMnn`, tập trend `TMGnn`, hoặc mã TT người dùng giao (vd. `TT001` cho TT-001). Schema (giữ nguyên khóa của bản nền, điền sẵn giá trị kênh):
```yaml
schema_version: TT_TOPIC_PACKET_V1
packet_spec_revision: "4.0"
identity: {topic_id: "TT-00x", slug: "", packet_revision: 1, niche_profile_id: "tyler-meets-westbrook", profile_revision: 1,
  base_versions: "tyler-tt-topic-studio@1.0 | tyler-tt-script@1.0 (base 4.0)", kit_episode_id: ""}
selection_and_scope: {selection_status: "", decision_source: "", execution_mode: "AGENT_AUTONOMOUS_STEP_LOOP",
  execution_scope: "FULL_SCRIPT_PIPELINE", adaptation_route: "ORIGINAL_BUILD", readiness: "", blockers_and_limitations: []}
niche_and_psychological_avatar:
  niche_name: "Tyler meets… (3D school comedy, Westbrook High)"
  content_archetype_and_story_engine: "HB template: cold open -> WTF -> This is X -> 3-set escalation -> twist set 4 -> 3-clause closer -> sandwich"
  brand_posture: FICTION_CHARACTER
  channel_stage: UNKNOWN_NO_STUDIO_DATA
  target_person_and_inner_question: ""
  emotional_posture: RECOGNITION_RELATABLE_CHAOS
  avatar_purity_check: ""
  target_fyp_region_and_qualified_geo: "US (CA/UK/AU)"
  script_language: en-US
  format_track: creator_rewards
  fiction_and_fact_policy: FICTION_CREATIVE
  identity_and_non_stereotype_lock: UNSPECIFIED
  exploration_element_tested: ""   # đúng 1 biến mới
angle_and_packaging_9x16:
  core_question_and_viewer_promise: ""
  concrete_stage_and_opening_object: ""
  unique_angle_familiar_plus_new: ""
  format_stack: {aaaa_or_story_engine: "HB template", outer_container: "", inner_escalation_engine: ""}
  visual_hook_archetype_1_to_8: ""
  frame_0_four_elements: {motion_at_0s: "", audio_hit_at_0s: "", frame0_safezone_text: "", spoken_hook_what_plus_why: ""}
  tiktok_search_seo_keywords: []
  fyp_throttle_word_check: ""
  spectacle_or_emotional_peak_at_55_65pct: ""
  ending_loop_or_part2_plan: ""
  post_title_one_line: ""          # <ID>_post.txt, 1 dòng tiếng Anh
runtime_and_part_budgets: {target_seconds_range: "68-77 (T_fast >= 62.0)", voice_delivery_mode: dialogue_scenes, count_unit: words,
  rate_basis: MEASURED_SAMPLE, speaking_rate_center_min_max: [145, 136, 152], non_speech_budget_seconds: 0, part_budgets_csv: ""}
kit_feasibility: {sets_new_4: [], sets_reused_details_from: [], cast: [], new_props_and_textures: [], new_lib_functions_needed: [], inserts_2d: []}
market_twin_and_source_governance: {evidence_confidence: "", outlier_references: [],
  five_axis_twin_check: {closest_matches_scored: [], verdict: ""}, source_register: [], claim_ledger: []}
ordered_modular_outline:
  parts: [{part_id: P01, budget_units: 0, function_and_state_delta: "", concrete_action_and_9x16_data_cards: [], exit_bridge: ""}]
  open_loop_payoff_map: []
  voice_and_must_keep_constraints: {voice_guide_summary: "", user_must_keep: [], strictly_do_not_copy: []}
```
Kèm `START_COMMAND` ngay dưới packet (khối lệnh `init` đầy đủ của `tyler-tt-script`, gồm `--cast` và `--kit-episode-id`).

## 4) Chế độ chạy & popup
- `CHAT_LLM_GO_MODE`: shortlist → chờ người dùng chốt mã → packet.
- `AGENT_AUTONOMOUS_STEP_LOOP` (khi người dùng ủy quyền chọn): tự chọn `DELEGATED_SELECTED`, ghi rõ lý do chọn và các ứng viên bị loại trong packet; **vẫn dừng ở 2 điểm duyệt của kênh** (kịch bản trước khi làm giọng; bản thử trước khi render đủ).
- Chỉ hỏi người dùng khi thiếu biến cốt lõi (vd. có muốn dùng nhân vật CAST_BIBLE không) — tối đa 1–3 câu.

## 5) Mẫu lệnh
```text
Dùng $tyler-tt-topic-studio. Quét trend teen Mỹ + 20 kiểu bạn còn trống, kiểm trùng 5 trục, giao 3–5 đề tài cho tập kế tiếp.
Dùng $tyler-tt-topic-studio. Tôi chốt <mã>. Xuất TT_TOPIC_PACKET_V1 + START_COMMAND.
```
