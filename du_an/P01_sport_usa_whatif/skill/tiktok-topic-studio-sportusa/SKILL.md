---
name: tiktok-topic-studio-sportusa
description: "Skill 1/3 của AbsurdPlay Sport USA (NFL + NCAA football, TikTok dọc 9:16, FYP Mỹ). Chọn đề tài cho tập mới: quét trận hot ≤48 giờ (hướng TROLL đội thua) hoặc chọn cặp MASCOT đối đầu, xác minh sự thật ≥2 nguồn, chạy 5-Axis Twin Check với mọi tập E01..E27 + kênh mẫu @whatifbagel, twin-seo-check, khóa Frame-0 bằng hình 3D chuyển động, chia P01..P0N theo tốc độ đọc đo thật của giọng Sport USA và xuất TT_TOPIC_PACKET_V1 + START_COMMAND sang tiktok-script-sportusa. Dùng khi người dùng nói 'kịch bản hot tiếp theo', 'mascot tiếp theo', 'chọn đề tài', 'TT-00x'."
---

# TikTok Topic Studio — AbsurdPlay Sport USA (`v4.0-sportusa.1`, 22/11/2026)

Phái sinh từ `tiktok-topic-studio@4.0 BASE_RAW` bằng `ADAPT_SKILLS`. Đã xoá mọi ví dụ của ngách khác. Trao đổi với chủ kênh bằng **tiếng Việt**; lời đọc, chữ trên hình và caption bằng **tiếng Anh Mỹ**.

Bộ 3 skill:
1. `tiktok-topic-studio-sportusa` (file này): chọn đề tài, kiểm trùng, xuất packet.
2. `../tiktok-script-sportusa/SKILL.md`: viết từng phần, kiểm toán, xuất gói file, phân cảnh khớp engine.
3. `../tiktok-studio-doctor-sportusa/SKILL.md`: đọc số liệu sau đăng, cập nhật Sổ Giả Thuyết.

Luật kênh gốc nằm ở `du_an/P01_sport_usa_whatif/QUY_TAC_KENH.md` và skill `sport-usa-whatif`. **Nếu có mâu thuẫn, luật kênh thắng.**

---

## 0) `TIKTOK_NICHE_PROFILE` (tự đủ)

Cột "Nguồn" ghi `Provenance` của từng dòng.

| Trục | Giá trị | Nguồn |
|---|---|---|
| `profile_id` / `profile_revision` | `absurdplay-sportusa-nfl` / `1` | OWNER_LOCKED |
| Kênh | TikTok **AbsurdPlay**, dự án P01 "Sport USA". Video 3D dọc kiểu "What If" theo định dạng @whatifbagel. Watermark "AbsurdPlay". | OWNER_LOCKED |
| Phạm vi | **NFL + bóng bầu dục NCAA**. NBA làm ở chat khác, không tự làm NBA ở đây. | OWNER_LOCKED |
| Vùng FYP | Mỹ (`target_fyp_region = US`). Lời tiếng Anh Mỹ; đơn vị yard, pound, mile; giờ ET. | OWNER_LOCKED |
| Tư thế người nói | `OMNISCIENT_NARRATOR`: người dẫn kiểu bình luận viên thể thao, năng lượng cao, giọng clone **"Sport USA"** trên Magnific. | OWNER_LOCKED |
| Chân dung khán giả | Fan NFL/college football ở Mỹ, 16–34 tuổi, đang lướt sau trận Chủ nhật/thứ Hai, hoặc fan đội kình địch. Câu hỏi thầm khi dừng ngón cái: *"Ai thật sự thắng nếu…?"* hoặc *"Đội đó vừa tự làm nhục mình thế nào?"* | HYPOTHESIS_TO_TEST |
| Tư thế cảm xúc (1 duy nhất) | `CUSTOM_SINGLE_POSTURE = TRASH_TALK_GLEE`: hả hê, cà khịa, có giới hạn. Không cay độc cá nhân. | OWNER_LOCKED (troll có giới hạn) |
| Độ thuần chân dung | 100% video là NFL/NCAA. Mỗi tập phải chạm fan **ít nhất 1 đội cụ thể** để họ comment. | OWNER_LOCKED |
| Giai đoạn kênh | Chưa có số follower/RPM → `STAGE_UNKNOWN`. Mọi tập dài **> 60 s** theo luật kênh từ E06, nên mặc định nhánh `creator_rewards`. | OWNER_LOCKED (độ dài) + HYPOTHESIS (giai đoạn) |
| Chính sách sự thật | `FACT_ANCHORED_ABSURD`: tiền đề phi lý là hư cấu, nhưng **mọi tỉ số, thành tích, lịch sử phải thật**, mỗi ý ≥ 2 nguồn (hoặc 1 nguồn chính thức NFL.com/trang đội). Không bịa trích dẫn. | OWNER_LOCKED |
| Không định kiến | `identity_lock = UNSPECIFIED`. Không đùa về chấn thương, bệnh, gia đình, chủng tộc, ngoại hình bẩm sinh, chuyện pháp lý chưa xác nhận. NCAA: không chọc cá nhân sinh viên, không dùng ai dưới 18 tuổi. | OWNER_LOCKED |
| Đường hình | 3D three.js tự dựng, **gốc 9:16 1080×1920, 30 fps**: không bao giờ có khung ngang viền mờ. Không dựng logo thật, không dùng tên sân thật. | OWNER_LOCKED |
| Tốc độ đọc đo thật | Đo từ `tap/E15..E27/giong/words_tw.json`. **Troll: 166–173 từ/phút. Mascot: 146–158 từ/phút.** Assembler mặc định mascot `154/146/172`, troll `168/160/180`. | MEASURED_BASELINE |
| DNA hình mẫu (23 video) | Lời bắt đầu ở 0,0 s, không lặng > 0,35 s. Shot trung vị 1,4–2,2 s, 35–45 shot. Cú xoay ở 20–45% thời lượng, "Final score" ở 80–95%. | MEASURED_BASELINE |

### Sổ Giả Thuyết khởi tạo (`HYPOTHESIS_LEDGER`)

Chưa có số liệu D+7 nào được đưa vào. Mọi dòng dưới đây đều ở trạng thái **chờ kiểm**; không coi là luật.

| Mã | Giả thuyết | Ủng hộ | Phản chứng | Điều kiện bác bỏ |
|---|---|---|---|---|
| H1 | Troll trận hot ≤ 48 giờ có `ret_3s` cao hơn mascot. | (chưa có) | (chưa có) | ≥ 4 bài mỗi phía, hiệu ứng co `< +2` điểm %. |
| H2 | Hook "What if <đội> were actual <mascot>?" giữ chân 0–3 s tốt hơn khi giây 0 có cảnh biến hình xé áo. | E22–E27 (chưa có số) | | |
| H3 | Mascot người thật (cao bồi, Viking, nông dân) giữ chân ngang mascot thú, mà không tốn credit 3D. | | | |

**Lời đồn FYP bị bác bỏ, cấm dùng làm luật:**
- Nhồi `#fyp #viral`.
- Xoá bài ít view rồi đăng lại.
- Cắt clip highlight NFL của người khác: vừa vi phạm bản quyền, vừa bị đánh *Unoriginal*.

---

## 1) Hai hướng kịch bản & nhánh thời lượng

**Bước 1 — Quét tin** từ NFL.com, ESPN, AP, CBS, The Athletic, Yahoo; NCAA thêm trang roster chính thức của trường.
- Giờ có kết quả (giờ VN): Chủ nhật 13:00 ET xong lúc ~04:00 sáng thứ Hai; SNF xong ~11:30 trưa thứ Hai; MNF xong ~11:30 trưa thứ Ba; NCAA thứ Bảy xong sáng Chủ nhật.

**Bước 2 — Chọn hướng:**
- **Có trận hot ≤ 48 giờ** (đội đông fan, kình địch, thua sốc hay thua đậm), xác minh được bằng ≥ 2 nguồn → `series = troll`.
  - Khuôn gộp: đội thua đấu 11 vật vô tri, rồi hoá thành chính vật đó.
  - Hook có **đúng 1 câu chửi đã bíp** ("What the f***?", "Are you f***ing kidding me?", "No f***ing way.").
- **Không có, hoặc không xác minh được bằng ≥ 2 nguồn** → `series = mascot`.
  - Tự chọn cặp, **không theo lịch thi đấu**.
  - Hook "What if <đội> were actual <mascot>?". Không chửi.
  - Mascot là con vật thì dùng con vật thật (mô hình Magnific). Mascot là người thì mặc đúng trang phục.
  - Luôn có fan "toxic" chế giễu bên thua.

**Bước 3 — Nhánh thời lượng (cố định):** `creator_rewards`.
- Kế hoạch 70–90 s, chia **4 phần** (P01..P04).
- Cận nhanh phải đạt `T_fast ≥ 62.0 s` (assembler chặn nếu thiếu).
- `viral_short` và `serial_sub60` **bị cấm**, vì kênh yêu cầu video > 60 s.

**Chế độ thực thi:** mặc định `AGENT_AUTONOMOUS_STEP_LOOP` khi được ủy quyền. Chỉ hỏi chủ kênh khi:
- phải tiêu credit Magnific hoặc ElevenLabs;
- phải chọn giữa 2 trận hot ngang nhau;
- thiếu nguồn xác minh.

---

## 2) Nghiên cứu & công cụ

| Việc | Công cụ | Ghi chú |
|---|---|---|
| Tỉ số, thành tích, lịch | WebSearch (chế độ `extended` cho tin < 48 giờ), `fetch_sports_data` nếu có | Chỉ mục tìm kiếm có thể trễ 1–2 ngày. Nếu không ra kết quả của tuần này thì **không đoán**: chuyển sang hướng mascot. |
| Lịch sử mascot, tên đội | Trang đội (packers.com, steelers.com…), Pro Football Hall of Fame, Wikipedia làm nguồn thứ 2 | Ghi rõ khi các nguồn lệch nhau (ví dụ số tiền "được đồn là"). Câu chữ phải thận trọng tương ứng. |
| Outlier mẫu | Video > 500K view của @whatifbagel (doc `whatifbagel_tren_500k.md`) | `Market Evidence` chỉ để học cấu trúc. Không dùng làm `Fact Evidence`. |
| Kiểm trùng chữ | `python ../tiktok-script-sportusa/scripts/tiktok_script_assembler.py twin-seo-check` | Đưa hook của **mọi tập cũ** vào `--own-past`. |

---

## 3) Quy trình 7 pha (rút gọn theo kênh)

**Pha 1 — Danh sách ứng viên.** Lập 3–5 ứng viên. Với mascot, dùng bảng 32 đội ở `TAI_NGUYEN_NFL.md` §5, rồi chấm sơ bộ 3 tiêu chí:
- độ tương phản của cặp (nước vs tuyết, thú vs người, máy vs cổ);
- tài nguyên 3D đã có (`CO_SAN`, `CAN_DUNG_CODE`, hay cần credit);
- độ đông fan.

**Pha 2 — 5-Axis Twin Check** (`Question · Stage · Ladder · Payoff · Look`).
- So với từng tập E01..E27, N27, T10 (danh sách ở §6) và với video mẫu gần nhất.
- `≥ 3/5`, **hoặc** trùng cả `Question + Payoff`, = `TWIN [BLOCKER]`. Khi đó phải đổi sân khấu, bậc thang hoặc cú lật; đổi từ đồng nghĩa không đủ.
- Hook "What if X were actual Y" là **khung series bắt buộc**, nên trục Question chỉ tính trùng khi **cùng cặp đội** hoặc **cùng mascot**.
- Trục Look tính trùng khi trùng bối cảnh, trùng trang phục mascot (ví dụ 1776 đã dùng ở E24 NBA) hoặc trùng loài thú (mèo lớn đã dùng ở E25).

**Pha 3 — Góc tiếp cận.** Khuôn mascot đối đầu:
- giới thiệu từng đội bằng hành động có đạo cụ;
- đấu từng hiệp, mỗi hiệp một lợi thế **dựa trên sự thật**;
- cú xoay ở ~30–45%;
- đỉnh cảnh tượng ở 55–65%;
- fan toxic;
- kết bỏ ngỏ "Comment who wins" và nối vòng về giây 0.

Khuôn troll: 10 nhịp của skill `sport-usa-whatif` §0.

**Pha 4 — Frame-0, 4 thành tố**, đều có sẵn trong kit:
- (a) **Chuyển động ở 0,0 s**: cầu thủ lao vào nhau, hoặc xé áo biến hình (`lib/bienhinh25.js:transformFX`).
- (b) **Tiếng ở 0,0 s**: `magnific/football_hit`, `magnific/crowd_roar` hoặc tiếng whoosh.
- (c) **Chữ ≤ 2 dòng, ≤ 11 từ**, trong vùng an toàn `x 90..870, y 180..1480`. Lưu ý watermark ở y≈205, bug tỉ số ngay dưới, phụ đề vàng ở y≈1310.
- (d) **Vật hữu hình mở câu hỏi**: hai đội mặc đồ mascot đối diện nhau.

**Pha 5 — Scorecard 100:**

| Trục | Điểm |
|---|---|
| Tiền đề + Frame-0 | 30 |
| Cầu fan + SEO tìm kiếm (tên đội, "NFL", "what if") | 20 |
| Vượt Twin + phần mới | 15 |
| Độ thuần + thang tăng tiến | 15 |
| Khớp vách 60 s | 10 |
| Nguồn FACT/CALC + hình 9:16 gốc + sạch từ bị bóp | 10 |

Chọn ứng viên điểm cao nhất. Khi được ủy quyền thì ghi `DELEGATED_SELECTED`.

**Pha 6 — Chia phần.** Bốn phần, ví dụ `45,60,60,45` từ.
- Với mascot ở 154 từ/phút, 210 từ ≈ 82 s; cận nhanh 172 từ/phút ≈ 73 s, vẫn ≥ 62 s.
- Truyền thẳng chuỗi này vào `init --part-budgets`.

**Pha 7 — Xuất `TT_TOPIC_PACKET_V1` + `START_COMMAND`** (§4).

---

## 4) Schema `TT_TOPIC_PACKET_V1` (giữ nguyên khóa BASE_RAW, thêm khóa kênh)

```yaml
schema_version: TT_TOPIC_PACKET_V1
packet_spec_revision: "4.0-sportusa.1"
identity: {topic_id: "TT-00x", channel_episode: "E2x", slug: "", packet_revision: 1,
  niche_profile_id: "absurdplay-sportusa-nfl", profile_revision: 1,
  base_versions: "tiktok-topic-studio@4.0 | tiktok-script-all-in-one@4.0"}
selection_and_scope: {selection_status: "", decision_source: "", execution_mode: "", execution_scope: "",
  adaptation_route: "", readiness: "", blockers_and_limitations: []}
niche_and_psychological_avatar: {niche_name: "NFL/NCAA what-if 3D", series: "mascot|troll",
  content_archetype_and_story_engine: "", brand_posture: "OMNISCIENT_NARRATOR", channel_stage: "STAGE_UNKNOWN",
  target_person_and_inner_question: "", emotional_posture: "CUSTOM_SINGLE_POSTURE: TRASH_TALK_GLEE",
  avatar_purity_check: "", target_fyp_region_and_qualified_geo: "US", script_language: "en-US",
  format_track: "creator_rewards", fiction_and_fact_policy: "FACT_ANCHORED_ABSURD",
  identity_and_non_stereotype_lock: "UNSPECIFIED", exploration_element_tested: ""}
angle_and_packaging_9x16: {core_question_and_viewer_promise: "", concrete_stage_and_opening_object: "",
  unique_angle_familiar_plus_new: "", format_stack: {aaaa_or_story_engine: "", outer_container: "", inner_escalation_engine: ""},
  visual_hook_archetype_1_to_8: "", frame_0_four_elements: {motion_at_0s: "", audio_hit_at_0s: "", frame0_safezone_text: "",
  spoken_hook_what_plus_why: ""}, tiktok_search_seo_keywords: [], fyp_throttle_word_check: "PASS",
  spectacle_or_emotional_peak_at_55_65pct: "", ending_loop_or_part2_plan: ""}
runtime_and_part_budgets: {target_seconds_range: "", voice_delivery_mode: "clean_voiceover", count_unit: "words",
  rate_basis: "MEASURED_SAMPLE", speaking_rate_center_min_max: [154, 146, 172], non_speech_budget_seconds: 0,
  part_budgets_csv: ""}
market_twin_and_source_governance: {evidence_confidence: "", outlier_references: [],
  five_axis_twin_check: {closest_matches_scored: [], verdict: ""}, source_register: [], claim_ledger: []}
kit_feasibility: {sets: [], characters_and_costumes: [], animals_3d: [], mixamo_needed: [], credit_cost_estimate: "",
  owner_actions: []}
ordered_modular_outline: {parts: [{part_id: "P01", budget_units: 0, function_and_state_delta: "",
  concrete_action_and_9x16_data_cards: [], exit_bridge: ""}], open_loop_payoff_map: [],
  voice_and_must_keep_constraints: {voice_guide_summary: "", user_must_keep: [], strictly_do_not_copy: []}}
```

**`START_COMMAND`** (dán ngay dưới packet):

```text
Dùng $tiktok-script-sportusa. Nhận TT_TOPIC_PACKET_V1 ở trên (topic TT-00x, series <mascot|troll>, slug <slug>).
Workspace: du_an/P01_sport_usa_whatif/tap/<E2x_...>/tt. Chạy AGENT_AUTONOMOUS_STEP_LOOP: init → 3–5 hook (≥16/20) → P01 → verify-part
→ opening-audit --p01-only → P02..P0N (mỗi phần 1 lượt) → stitch-draft → beat-audit → QA 8 trục → lock-export → kit-check.
Không chạy TTS, không render.
```

---

## 5) Bảo vệ nguyên gốc

- Không dùng clip TV hay highlight thật. Mọi hình là 3D tự dựng.
- Đăng chéo Shorts/Reels bằng file render gốc.
- Trong 48 giờ đầu sau khi đăng, không gửi link về Việt Nam để xem: làm lệch vùng địa lý (chi tiết ở skill doctor).

---

## 6) Kho hook các tập cũ (đưa vào `--own-past`)

- **Khuôn troll** (E01–E20, N27):
  - E01 Cowboys vs 50 grandmas
  - E03 Chargers vs 11 mannequins
  - E04 Eagles vs 11 tube men
  - E06 Baker Mayfield vs 11 umbrellas
  - E07 Jaguars vs 11 suitcases
  - E08 Bears vs 11 baseball gloves
  - E10 Michigan vs 11 goalposts
  - E11 Packers vs 11 cardboard cutouts
  - E12 Jets vs 11 paper airplanes
  - E13 Vikings vs 11 shopping carts
  - E14 Cousins vs Mendoza valet job
  - E15 Cousins vs Wentz returns desk
  - E16 Cousins migration
  - E17 Harry Kane kick for the Patriots
  - E19 49ers moved into the Cowboys' house
  - E20 Ravens vs tackling dummies
  - N27 Warriors vs five babies (NBA)
- **Series mascot:**
  - E22 Vikings vs 49ers (Viking vs thợ đào vàng)
  - E23 Titans vs Cowboys (Titan Hy Lạp vs cao bồi)
  - E24 Dolphins vs Bills (cá heo vs bò rừng)
  - E24 NBA Bucks vs 76ers (hươu vs dân 1776)
  - E25 Bengals vs Jaguars (hổ vs báo đốm)
  - E26 NBA Lakers vs Knicks (vịt hồ vs Knickerbocker)
  - E27 NCAA Ohio State vs Nebraska (hạt dẻ buckeye vs nông dân)
- **Bối cảnh đã dùng:** không lặp. Xem `TAI_NGUYEN_NFL.md` §2.
