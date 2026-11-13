---
name: "sport-usa-whatif"
description: "Sản xuất video TikTok dọc kiểu 'What If' thể thao Mỹ (format kênh @whatifbagel) cho dự án P01 Sport USA: tìm tin NFL/NBA mới nhất, viết kịch bản, giọng clone Sport USA, dựng 3D three.js, phụ đề vàng, đồ hoạ truyền hình, ráp Kdenlive. Dùng khi người dùng yêu cầu kịch bản/video mới hoặc sửa video cho dự án P01."
---
# Sport USA "What If" — v1.0 (08/11/2026)

Kho lưu bộ hồ sơ: GitHub `mailcontentnba76-cell/absurdplay-kit` (riêng tư). Đầu phiên: clone kho này nếu chưa có `/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO`; cuối mỗi tập: commit + push (không đẩy mp4/mov/wav lớn, node_modules).

Đã giao: E01 "Cowboys vs 50 Grandmas" (NFL), E02 "Giannis vs his old team" (NBA), E03 "Chargers vs 11 mannequins" (NFL). E04 "Eagles vs 11 inflatable tube men" (NFL): đã giao 05/11. E05 "Bulls vs 5 snowmen" (NBA): đã giao 05/11. E06 "Baker Mayfield vs 11 umbrellas" (NFL, 65,8 s): đã giao 06/11. E07 "Jaguars vs 11 suitcases" (NFL, 80,1 s, Mixamo + khoá bàn chân): đã giao 08/11. **Đang mở:** E08 — kịch bản dự phòng "Colts vs 11 garage sale items" (hook "What the f***"), chủ dự án muốn chờ kết quả trận tuần 9 (Chủ nhật 08/11 giờ Mỹ) rồi chọn trận hot nhất để viết; lịch hẹn cũ ở tài khoản cũ KHÔNG chuyển sang → hỏi người dùng có muốn đặt lại lịch kiểm tra kết quả không.

> **Nhánh NBA (từ 08/11/2026):** mọi tập NBA theo `skill/nba-whatif/SKILL.md` (thắng khi mâu thuẫn với file này). E08 NFL ở trên không mang sang nhánh NBA. Môi trường Claude Code web: xem `NBA_MIGRATION/HUONG_DAN_CAI_DAT.md` (thêm `frei0r-plugins`, `fonts-montserrat`).

## Khởi động (đọc đầu tiên, nhất là ở tài khoản/máy mới)
- **Trả lời người dùng bằng tiếng Việt.** Kênh TikTok: **AbsurdPlay**; dự án P01 "Sport USA". Người dùng không rành kỹ thuật: mỗi thứ thiếu → nói rõ thiếu gì, vì sao cần, đề xuất 1 cách dễ nhất, làm từng bước, xong bước nào báo bước đó.
- **Gói chuyển tài khoản (1 file):** `AbsurdPlay_SportUSA_goi_chuyen_v1.0.zip`. Giải nén: `mkdir -p /root/work && cd /root/work && unzip -q <file>.zip` → có `BO_HUONG_DAN_SAN_XUAT_VIDEO/` (bộ hồ sơ đầy đủ) và `BAT_DAU_DAY.md`. Hoặc clone GitHub `mailcontentnba76-cell/absurdplay-kit` nếu tài khoản có quyền (repo không có file FBX Mixamo và tiếng Magnific; gói zip thì có).
- **Cài skill cho tài khoản mới:** đọc `BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/skill/sport-usa-whatif/SKILL.md` rồi đề xuất lưu bằng công cụ `propose_skills` (người dùng bấm lưu trên thẻ); trong lúc chờ cứ làm theo file này.
- **Kiểm môi trường theo thứ tự — làm được thì tự làm, cần người dùng thì hỏi từng việc một:**
  1. Công cụ hệ thống: `node -v` (≥18), `ffmpeg -version` (có libass), `melt --version`, `python3 -c "import numpy"`, Playwright/Chromium (`node -e "require('playwright')"` trong engine hoặc `npx playwright --version`). Thiếu → `apt-get install -y ffmpeg melt` / `pip install --break-system-packages faster-whisper numpy` / `npm i playwright && npx playwright install chromium`. Mạng bị chặn → báo người dùng bật tên miền trong Settings → Capabilities (npm, pypi, github, huggingface.co cho mô hình whisper).
  2. Engine: `cp -r BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/engine /root/work/engine && cd /root/work/engine && npm install` (three r170, postprocessing, realism-effects, camera-controls, simplex-noise, @fontsource/*), rồi BẮT BUỘC `python3 patches/va_realism_effects_three170.py`. Mixamo FBX nằm ở `engine/assets/mixamo/` (gói zip có sẵn; nếu thiếu → nhờ người dùng tải lại theo mục 4 "Mixamo").
  3. Chạy thử: `node render.js "test_run6.html" out_test 30 0 30 360 640` (người chạy Mixamo) và `node render.js "ep07.html#nomb" out_test2 30 0 1 360 640 30,600,1500` → có ảnh là đạt. Lỗi `INVALID_OPERATION` → chưa chạy bản vá.
  4. Âm thanh: `magnific_sfx/` (tiếng sân đấu do chủ dự án tạo) có trong gói → `cp -r .../tai_nguyen/am_thanh/magnific_sfx /root/work/assets/audio/`. Thư viện CC0 (nhạc + SFX) KHÔNG có trong gói (≈1,8 GB) → `git clone --depth 1` 4 kho theo `tai_nguyen/am_thanh/README.md` vào `/root/work/assets/audio/` (GitHub phải được phép).
  5. Giọng "Sport USA" nằm trong tài khoản Magnific của người dùng: cần Claude in Chrome (tiện ích trình duyệt) đã đăng nhập tài khoản Claude mới + trình duyệt đã đăng nhập Magnific → Claude nhập kịch bản, bấm Generate; người dùng tải mp3 và đính kèm. Không có Chrome → người dùng tự tạo giọng và gửi mp3.
  6. GitHub (tuỳ chọn): kết nối GitHub và cấp quyền repo `absurdplay-kit` để lưu tiến độ cuối mỗi tập.
  7. Báo người dùng bảng "đã sẵn sàng / còn thiếu / bạn cần làm gì", rồi chờ "NFL" hoặc "NBA".
- Ổ đĩa/RAM: máy 2 CPU, ~8 GB RAM: render 1 tiến trình cho cảnh nặng (sân bay, mưa). Tiến trình nền chết khi phiên dừng → kiểm khung thiếu và render tiếp.

## Hook "What the f***" (chủ dự án yêu cầu từ 08/11)
- Câu đầu tiên mở bằng "What the fuck?" (hoặc "Fuck.") + một hình ảnh vô lý thấy ngay ở giây 0, rồi mới vào câu "Could…?". Trong âm thanh luôn **bleep** tiếng chửi (BEEP 1 kHz hoặc sfx tone, dải [đầu, cuối] của từ theo words_tw.json); phụ đề ghi "f***". Đây là hook bất ngờ nhưng hài, không xúc phạm ai.
- **Không dùng người thật ngoài thể thao** (chính trị gia, ca sĩ…) làm nhân vật hay đối thủ. Đối thủ vẫn là đồ vật / con vật nhựa / nhân vật hư cấu.
- **Ưu tiên kịch bản theo KẾT QUẢ trận vừa đá** của đội đang hot (chủ dự án chốt 08/11): chờ trận xong, chọn kết quả sốc/viral nhất, viết ngay trong ngày. Giờ có kết quả NFL (giờ VN, tháng 11–3): Chủ nhật 13:00 ET → ~04:00 sáng thứ Hai; Sunday Night → ~11:30 trưa thứ Hai; Monday Night → ~11:30 trưa thứ Ba. Có thể đặt lịch tự kiểm (send_later / create_trigger) nếu người dùng muốn.

## Chế độ NBA (khi người dùng nói "NBA")
- Đã có: E02 (nhà thi đấu Bucks, `ep02.html`), E05 (sân tuyết `lib/tuyet.js`); áo ba lỗ/quần đùi, động tác bóng rổ viết tay trong `lib/bongro*.js`/`tuthe.js` (xem file engine). Không lặp bối cảnh 2 tập này.
- Động tác mocap bóng rổ: nhờ người dùng tải thêm ở Mixamo (FBX Binary, Without Skin, 30 fps; tích In Place cho vòng lặp) rồi đặt tên đúng: `Dribble` (Basketball Dribble/Dribbling), `Jump_Shot`, `Layup`, `Dunk`, `Free_Throw`, `Bounce_Pass`, `Chest_Pass`, `Basketball_Idle`, `Defense_Shuffle`; thêm tên vào `MIXAMO_FILES` trong `lib/nhanvat2.js` (clip thành `MX_<Tên>`). Chưa có thì dùng động tác viết tay cũ + chạy Mixamo cho di chuyển.
- Tin NBA: `mcp__widgets__fetch_sports_data` (league nba: scores, standings, game_stats) + NBA.com/ESPN/AP; kiểm box score cầu thủ có ra sân.

## 0. Cách nhận việc (yêu cầu cố định của chủ dự án)
- **Chờ yêu cầu.** Người dùng nói môn (vd "NFL", "NBA") → tự tìm tin MỚI NHẤT của môn đó (WebSearch + `mcp__widgets__fetch_sports_data` scores/standings/game_stats), chọn tin đáng làm, đề xuất 3 ý tưởng + 1 kịch bản. Chưa dựng video khi kịch bản chưa duyệt.
- **Nguồn tin (theo yêu cầu chủ dự án):** chỉ dùng nguồn lớn, uy tín, mới nhất. Thứ tự ưu tiên: (1) trang chính thức NBA.com / NFL.com và trang chính thức của đội; dữ liệu trận `fetch_sports_data`; (2) hãng tin & báo thể thao lớn: AP, Reuters, ESPN, The Athletic, CBS Sports, NBC Sports, Yahoo Sports, Bleacher Report, USA Today; (3) tài khoản mạng xã hội có tích xanh của giải/đội/phóng viên tin nóng (vd Shams Charania, Adam Schefter, Ian Rapoport) — chỉ qua bài báo/nhúng mà WebSearch/WebFetch đọc được. Mỗi số liệu/tin dùng trong kịch bản phải khớp ≥ 2 nguồn (hoặc 1 nguồn chính thức), ghi nguồn + ngày trong bảng "Tin đã chọn". Không dùng blog/tin đồn/trang tổng hợp không rõ nguồn.
- **MỞ RỘNG CHỦ ĐỀ (chủ dự án yêu cầu 05/11, theo mẫu Drake Maye vs 11 folding chairs 1,1M/18 h):** không chỉ troll đội thua. Mỗi lần đề xuất 3 ý thuộc 3 KIỂU khác nhau, chọn kiểu chưa dùng gần nhất:
  (a) troll đội thua (khuôn 5 bước cũ: Hook "Could [đội thảm hại] beat [đối thủ yếu]?" → thổi phồng → "Except" + nỗi đau thật → trận ảo thua đúng lỗi thật → Final + câu troll; nhóm này trung vị 1,4M);
  (b) chọc đội/ngôi sao ĐANG THÀNH CÔNG bằng số liệu nghịch lý (lịch dễ, đối thủ yếu, thắng kiểu kỳ quặc);
  (c) kỷ lục kỳ quặc/lịch sử (lần đầu từ năm X);
  (d) phá kỷ lục/cột mốc (chọc kiểu khen);
  (e) ông lớn sa sút (thua liên tiếp sân khách…).
  Ghi kiểu đã dùng vào bảng "đã dùng". Không chép premise kênh mẫu; không đùa về chấn thương/bệnh.
- **Khuôn lời MỞ RỘNG (mặc định từ E06, ~55–70 s, 150–190 từ):** (1) Hook "Could [X] beat 11 [vật vô tri]?" (2) **cú xoay đảo vai** ("Except these chairs have a winning record" / "Except last Sunday he couldn't…") (3) 1–2 câu **số liệu thật** có thẻ/biểu đồ (4) chuyển vào trận (chơi chữ tên nếu có) (5) trận ảo dùng **thuật ngữ chiến thuật thật** (cover two, prevent, motion, man coverage, check down, blitz, protection, rolls right, throws it away…) + **1 câu đùa lặp ≥2 lần** ("Nobody follows.") (6) nếu có: **gọi lại câu nói thật** của cầu thủ bằng thẻ trích dẫn rồi lật ngược (7) **châm biếm truyền hình/giờ nghỉ** (bình luận viên khen điều vô lý) (8) cao trào cuối trận → **cú đảo/tự thua ngớ ngẩn** (9) Final score ~80–88 % (10) **đuôi kết 2 câu** kéo người/đội khác vào (fan đổ lỗi HLV, cựu cầu thủ xin việc lại, đội đối thủ thật ký hợp đồng với vật vô tri…). Chi tiết: `PHAN_TICH_MAU/20261105_drake_maye_folding_chairs.md`.
- **Hai điểm duyệt:** (1) kịch bản, (2) bản cắt thử. Sau đó mới render đủ.
- **Không lặp:** mỗi tập khác hẳn các tập trước về đối thủ/gag VÀ bối cảnh. Trước khi dựng, ghi vào kịch bản bảng "đã dùng" (mục 7) và chọn bối cảnh chưa có.
- **Nhận diện đúng tuyệt đối:** đội HIỆN TẠI, số áo HIỆN TẠI, bản áo (trắng/màu), chữ trên ngực, tóc, râu, màu da, chiều cao/dáng — tra web mỗi lần, không dựa trí nhớ (cầu thủ có thể vừa đổi đội/đổi số; ảnh người dùng gửi có thể là ảnh cũ → kiểm rồi giải thích). Ghi bảng nhận diện có nguồn vào kịch bản.
- **Nhạc nền:** Claude tự chọn, MỖI TẬP MỘT BẢN KHÁC, hợp không khí kịch bản (hip-hop/funk cho hype, chiptune cho gag game, synthwave cho vũ trụ/tương lai, sad/lofi cho đoạn thua…), chỉ nhạc CC0 trong thư viện (`alvana-audio/music/*`, KHÔNG dùng `corporate`). Ghi tên bản vào bảng "đã dùng".
- **Tên kênh AbsurdPlay:** mọi video có dấu chữ "AbsurdPlay" (lớp `.wm` trong epXX_gfx.html: trắng 92 %, viền đen, Inter 900 38 px, giữa, top 205 px — ngay trên bug tỉ số, ngoài vùng giao diện TikTok).
- **Giao kèm tiêu đề viral:** sau mỗi video, đưa 3 tiêu đề/caption tiếng Anh kiểu kênh mẫu (câu hỏi "Could…?" + chi tiết gây tò mò, 1 câu troll) + 5–6 hashtag (#Tên cầu thủ #NBA/#NFL #Đội #whatif #sportscomedy).
- **Logo:** không dựng logo NBA/NFL/đội. Được dùng: tên thành phố, tên đội, chữ trên áo dạng chữ thường (MIAMI, HEAT, MILWAUKEE…), màu, số.

## 1. Đọc trước
1. `00_HUONG_DAN_CHO_CLAUDE.md`, `HO_SO_DU_AN.md`, `QUY_TRINH_DU_AN.md`, `NHAT_KY_LOI.md` (đọc hết các dòng mới)
2. `PHAN_TICH_MAU/TONG_HOP.md` + xem `PHAN_TICH_MAU/shots/<video cùng môn>/` (ghép sheet ảnh) TRƯỚC khi dựng bối cảnh
3. `tap/E0x/HUONG_DAN_TIEP_TUC.md` của tập gần nhất

## 2. Thông số mẫu (23 video) — giữ nguyên
- 1080x1920, 30 fps. **Độ dài do người dùng nêu khi yêu cầu kịch bản**; nếu không nêu thì đề xuất độ dài kèm lý do trong kịch bản (mẫu 55–85 s; E01/E02 43–44 s). Lời bắt đầu 0,0 s, ~162 từ/phút, không lặng > 0,35 s.
- Hook "Could [sao] [động từ] [đối thủ phi lý]?"; cú xoay 20–45 %; "Final score" 80–95 %; câu chốt troll.
- Shot trung vị 1,5–2,2 s, cắt cứng, lóa trắng ở cú xoay; máy luôn trôi.
- Phụ đề vàng #F5F500, chữ thường, Montserrat ExtraBold 60, chân chữ y≈1310, 2–4 từ/cụm.
- Bão hòa 95–145, sáng 95–165 (HSV); −14 LUFS, TP ≤ −1; nhạc dưới lời 8–12 dB.

## 3. Bối cảnh — bài học E01/E02
- Mẫu NBA: nhà thi đấu SÁNG, màu đội rực (ghế 3D từng hàng màu đội + khán giả low-poly ngồi thưa, bậc bê tông sáng, LED giữa 2 tầng); nhiều tập đưa sao sang thế giới thứ hai (rừng tiền sử, La Mã, sân đường phố trời xanh, vũ trụ). Không dùng lại khán đài texture chấm màu của E01.
- Bối cảnh xa (thành phố, khán đài...) phải dựng chi tiết thật, không dùng hộp một màu (chủ dự án yêu cầu, E05).
- Đã dùng: E01 sân NFL trong nhà kiểu AT&T (khán đài texture), E02 nhà thi đấu Bucks ghế xanh–kem (`lib/nba.js`), E03 sân ngoài trời ban đêm (`lib/ngoaitroi.js`: trời sao, 6 tháp đèn pha, khán đài nhôm + chòi bình luận, cỏ bàn cờ, đường chạy đỏ, cột gôn vàng, bảng điểm 2 cột). Tập sau chọn khác: sân ban ngày/tuyết/mưa, sân đường phố, bối cảnh lịch sử/vũ trụ/thành phố…
- Ánh sáng: hemi ≥ 2,5 + key có bóng + đèn phụ gắn máy quay (nhân vật da tối/áo tối vẫn rõ). Kiểm số đo bão hòa/sáng trên ảnh xem trước.
- Khán giả phải cử động: vertex shader nhún + giơ tay + ngủ gục, điều khiển theo shot (`A.crowd.uCheer/uSleep/uT`).

- **Nhiều bối cảnh trong 1 video (mẫu 05/11):** ngoài sân chính, dựng thêm 3–5 bối cảnh phụ ngắn theo lời: phòng phân tích (màn hình lớn, biểu đồ cột, bảng chiến thuật), **sơ đồ chiến thuật nhìn thẳng từ trên** (vòng tròn/mũi tên trên sân), khu fan trên khán đài, bàn bình luận trường quay (bình luận viên hư cấu), đường hầm/biên với HLV đeo tai nghe, nhà/phòng khách của nhân vật đuôi kết. Mỗi bối cảnh phụ là module riêng trong `lib/` để tái dùng.
- **Đồ hoạ kiểu truyền hình thật:** lower-third tên + số áo + vị trí khi giới thiệu cầu thủ, thẻ trích dẫn, thẻ chỉ số lớn, biểu đồ cột, bug tỉ số cố định trên cùng, màn đồng hồ "Q4 — 0:11" trên bảng điện tử sân. Vẫn đổi phong cách màu mỗi tập.
- **Màu:** mẫu mới bão hoà trung vị ~117 (E04/E05 chỉ 65–77) → chỉnh màu bản cuối để bão hoà ≥ 95, không để cảnh nhạt.
- **Nhịp:** 35–45 shot, trung vị ~1,4–1,6 s; câu đùa ngắn ("Handoff. Handoff. Handoff.") = mỗi từ một cắt.

## 4. Nhân vật & động tác
- **CHUYỂN ĐỘNG MƯỢT KIỂU MOCAP + BIỂU CẢM THEO LỜI (chủ dự án yêu cầu 06/11, áp dụng mọi tập — video mẫu nhân vật bước đi linh hoạt, không cứng):**
  - Đi/chạy/chạy lùi/ngồi/ngã **bắt buộc dùng clip mocap** qua `lib/dongtac.js`, KHÔNG dùng tư thế viết tay `sprint/sadWalk/runCarry/knockedDown/benchSit` cho cảnh di chuyển.
  - `loco(ch,lib,t,path,{t0,face,back,seed,phase})`: pha bước tính theo quãng đường thật ÷ sải chân đo từ clip → chân không trượt; tự trộn Walk_Loop (1,5 m/s) ↔ Jog_Fwd_Loop (3,4) ↔ Sprint_Loop (6,5) theo tốc độ; đứng lại tự về Idle; `back:true` = lùi (QB drop-back). Đường đi: `seg(A,B,ta,tb)` (tăng/giảm tốc mượt), `run(A,B,ta,tb)` (bứt tốc rồi chạy đều).
  - Đứng: `Idle_Loop` (+ `Crouch_Idle_Loop` trộn 0,2–0,55 cho tư thế chờ bóng, + `Idle_Talking_Loop` khi nói). Ngồi: `Sitting_Idle_Loop` / `Sitting_Talking_Loop` (người đang nói), canh hông theo ghế. Ném: `OverhandThrow` (thả bóng ở 24 % clip). Bị húc bay: `Hit_Knockback` (≤ 70 % clip, nằm đất). Trượt ngã: `Slide_Start`. Ngã ngửa: `Death01` (≤ 90 %). Gật: `Yes`; lắc: `Idle_No_Loop`; khoanh tay: `Idle_FoldArms_Loop`.
  - Cử chỉ riêng (ôm bóng, kẹp bóng, chỉ tay, vẫy, ngón cái) = lớp IK/aim đặt SAU clip (`holdBall`, `tuck`, `point`, `wave`, `thumb` trong ep06.html) — thân dưới vẫn là mocap.
  - Clip UAL1 (xương Rigify DEF-*) được retarget sang xương UBC trong `loadLibrary` (giữ hướng xương theo thế giới + bù tư thế nghỉ). Tên xương trong three bị bỏ dấu chấm (`DEF-spine.001` → `DEF-spine001`).
  - **Biểu cảm theo từng chữ lời thoại:** mỗi nhân vật thấy mặt có khoá `expr(ch,t,[[giây,'preset'],…],{seed})` gắn mốc từ `words_tw.json` (vd "Except" → wince, "still won" → surprised→proud, "throws" → determined, bị húc → panic→wince). Preset: neutral smug confident shock surprised wince proud laugh sad determined panic shrug talk cheer. Chuyển 0,22 s, chớp mắt, liếc mắt, miệng mấp máy khi `talk`. Da tối tự có viền môi sáng để thấy miệng.
  - **Mixamo (07/11, ưu tiên cho chạy/ném/bắt):** FBX chủ dự án tải (FBX Binary, Without Skin, 30 fps, In Place cho vòng lặp) đặt ở `assets/mixamo/<Tên>.fbx` (KHÔNG đưa lên GitHub), tự retarget sang UBC thành clip `MX_<Tên>`: Sprint, Running, Jogging, Run_To_Stop, Slow_Jog_Backwards, Quarterback_Pass (thả bóng ~5,42 s), Receiver_Catch, Football_Catch (bóng vào tay ~1,5 s), Football_Hike. Clip có trôi gốc tự đưa về tại chỗ và lấy tốc độ thật. Tốc độ tự nhiên: đi 1,0 · Jogging ~1,9 · Running 5,9 · Sprint ~5,6–6,1 m/s → đặt đường chạy gần các tốc độ này.
  - **Khoá bàn chân:** dùng `locoLock()` thay `loco()` cho nhân vật thấy chân: mũi chân chạm đất (<2 cm) giữ nguyên điểm đặt, IK chân kéo về, nhả dần khi nhấc. Hãm lại: chuyển sang `MX_Run_To_Stop` (trộn 0,12 s). Máy quay chạy ngang song song khi có cảnh chạy (như video mẫu).
  - Kiểm: `test_run6.html` (6 s đứng→chạy bộ→chạy nhanh→hãm, sân có vạch để thấy chân bám), `test_slide.html` (đo trượt), (bảng 36 khung đi→chạy, nhìn chân không trượt) + render khung then chốt mỗi shot trước khi cắt thử.
- **NHÂN VẬT LUÔN CỬ ĐỘNG (chủ dự án yêu cầu, áp dụng mọi tập):** không nhân vật người nào đứng yên tuyệt đối trong khung hình, nhất là shot mở đầu (0–3 s quyết định giữ chân người xem). Mỗi nhân vật trong khung có tối thiểu: thở + đổi trọng tâm + quay đầu/nhìn quanh (`liven(ch,t,seed,amt,headAmt)` trong `lib/bongbau.js`, hoặc `alive()` trong `tuthe.js`), gọi SAU khi đặt tư thế; seed khác nhau để lệch nhịp. Nhân vật chính có thêm cử chỉ theo lời (chỉ tay hô tín hiệu `qbSignal`, giơ ngón cái có nhún, lắc đầu khi thua, giật mình ở "Except"). Ngoại lệ duy nhất: thứ đứng im là CHÍNH gag (vd ma-nơ-canh) — khi đó cho chi tiết phụ chuyển động (mác giá đung đưa, khán giả, máy quay trôi). Kiểm: render 3 khung cách 0,5 s mỗi shot, so thấy khác nhau mới đạt.
- `lib/nhanvat2.js`: `tank`, `shorts`, `sockAt`, `shortsTo`, `wordmark`, `wordmarkColor`, `backName`, `collar`, `pantsStripes`, `edgeSoft:1`, số chiếu phẳng trước/sau. `lib/cast2.js`: mẫu cấu hình (HEAT trắng Association, BUCKS xanh, fan, trọng tài). Tay dài: scale `upperarm`. **Chiều cao: luôn dùng `heightM` = chiều cao thật (m) tra web** (thân gốc nam 1,81 m, nữ 1,767 m); không dùng `scale` đoán. E02 sai: Giannis 1,99 m (thật 2,11), Herro 1,77 m (thật 1,96), Bucks 1,81 m.
- `lib/bongro.js`: stance, dribble, wingspan, holdChest, shoot, dunk, flex, seated (ngủ), slump, toss, defend. NFL: `lib/tuthe.js` (benchSit, pushup, akimbo, alive…).
- `resetPose(ch)` ngay sau khi tạo; trộn clip và tư thế code được (clip() gọi resetPose trước).
- **Tóc** (`lib/toc.js`, gọi qua `makeCharacter({hairStyle, hairColor, hairOpts})`): `proc:buzz|fade|curlytop|afro|dreads|twists|cornrows|braids|hightop|manbun|mohawk` (dựng bằng code, `hairOpts {len,n,thick,puff,front,back,seed}`) và `mh:afro01|mh:short04` (MakeHuman system assets CC0, chuyển bằng `cong_cu/chuyen_toc_mh.py` từ gói npm makehuman-data). Bảng mẫu: `tai_nguyen/bang_kieu_toc.jpg`; kiểm bằng `test_toc.html#proc:...`. Tóc chưa có kiểu phù hợp → thêm case mới trong toc.js, không dùng tóc sai.
- **Dáng người & phụ kiện** (`makeCharacter`): `build: 'slim'|'fit'|'big'|'belly'`, `shoulders: 'wide'|'narrow'`, `headband: màu`, `wristband: {side:'l'|'r'|'both', color}`, `armSleeve: 'l'|'r'|'both'` + `armSleeveColor`, `tattoo: 'l'|'r'|'both'` (vẽ trong shader, sắc nét), `beardStyle: 'goatee'|'full'|'stubble'|'mustache'` + `beardColor`, `glasses: màu`. Bảng mẫu: `tai_nguyen/bang_dang_nguoi.jpg`, kiểm bằng `test_dang.html` (#side, #arm, #head). Ghi dáng/phụ kiện thật của cầu thủ vào bảng nhận diện.
- Bóng: NBA `basketball()` 8 múi #C8541F; NFL `football()`.
- Người hơi vẫy tay (E04): `lib/nguoihoi.js` — `makeTubeMan({color,arm,seed,H})`, điều khiển `amp, fold, lean, armReach, faceYaw`, gọi `update(t)` mỗi khung; bãi xe `lib/baixe.js`. Eagles: `EAGLES`, `CAST4`, `knockedDown, runCarry, celebrate`.
- NFL (E03): `lib/bongbau.js` — `CAST3` (herbert/dicker/bolt), mẫu áo `CHARGERS`; `makeMannequin` (ma-nơ-canh bóng, khớp tròn, cọc inox, mác giá); tư thế `qbHold, qbSignal, qbThrow, kick, yawn, thumbsUp, sadWalk, sprint, mannequinPose`; `liven`. Mũ NFL: `helmet, helmetStripe, mask`.
- Tên sau lưng (`backName`) tự co chữ; đặt `backNameMax` (px trên texture 256, NFL ≈150) để tên không tràn qua vai (E03 lỗi "ERBER"). Luôn render 1 ảnh cận lưng áo để kiểm.
- Ảnh kiểm nhân vật trước/sau (test_nba.html) trước khi dựng shot.

- **Động tác mới cần có (mẫu 05/11):** QB giả ném (pump fake) ×2, chạy lùi né, lăn ra biên rồi ném bỏ, OL đẩy vật vô tri không nhúc nhích, trọng tài ra hiệu (safety: hai tay chụm trên đầu; touchdown; incomplete), trọng tài trượt ngã, fan đứng chỉ trỏ/la ó, nhân vật ở nhà nghe điện thoại hốt hoảng, bình luận viên ngồi bàn gật gù vỗ tay. Vật vô tri đứng im là gag, sự sống động đến từ người + máy quay + cắt nhanh.

## 5. Chuỗi công cụ
```
kịch bản (duyệt) → Magnific Voice (Sport USA, tag [energetic, fast-paced narrator]) → người dùng tải mp3, đính kèm
→ am_thanh/giong.wav = giọng GỐC chỉ chuẩn hoá âm lượng (từ E06 chủ dự án yêu cầu KHÔNG rút khoảng nghỉ, KHÔNG atempo; video PHẢI dài > 60 s — kịch bản viết ≥ 170 từ để giọng ≥ 62 s)
→ faster-whisper small.en (truyền mảng numpy 16 kHz; initial_prompt tên riêng) → words_raw.json → sửa số/tên → words.json
→ engine/epXX_shots.js (mốc shot + SUB điểm cắt phụ) → epXX.html + epXX_gfx.html (đồ hoạ đọc mốc từ shots.js)
→ xem nhanh: node render.js "epXX.html#nomb" out 30 0 1 540 960 <danh sách khung>
→ cắt thử: nomb 540x960, 15 khung/s + gfx + phụ đề + giọng (ffmpeg) → duyệt
→ đủ: node render.js epXX.html out 30 f0 f1 720 1280 (2 tiến trình, ≈4,4 s/khung)
→ dohoa_render.js → qtrle .mov; tao_phu_de.py; tron_am_thanh.py (nhạc CC0 + SFX theo mốc; tiếng sân đấu thật ưu tiên `magnific/*`: crowd_cheer/roar/boo/gasp/laugh/ambience, ref_whistle, buzzer, sneaker_squeak, ball_dribble, swish, rim_dunk, backboard_bang, stadium_horn, football_hit, football_kick; stinger sad_trombone, organ_charge; crowd_ooh_aah, chant_defense, clap_rhythm, airball_chant, silence_cough, stadium_crowd_outdoor, drumline, camera_flashes — nền khán giả crowd_ambience trải suốt video)
→ hinh.mp4 (lanczos 1080x1920, eq=saturation chỉnh sao cho bão hoà HSV đo được ≥ 95, unsharp) → tao_kdenlive.py
→ melt -profile cong_cu/v1080.profile ... -consumer avformat:out.mp4 width=1080 height=1920 progressive=1 frame_rate_num=30 frame_rate_den=1 → loudnorm 2 lượt −14 LUFS/TP −1,5 → QA.md
```

## 6. Lỗi đã gặp (chi tiết ở NHAT_KY_LOI.md)
- Máy quay: dùng shot `path`+`lookPath` 2 điểm; `lerpLookAt` nội suy cầu có thể vòng ngược.
- Màn hình/biển dán sát hộp phải nằm NGOÀI mặt hộp.
- Tầm nhìn ngang dọc hẹp (~26° ở fov 50): đạo cụ hai bên nhân vật đặt trong ±0,6 m ở 3 m.
- Đồ hoạ không được đè mặt ở shot cận (đặt top ~90–250 hoặc dưới phụ đề y≈1420).
- Render: gộp khán đài thành 1 lưới tĩnh; motion blur bỏ lượt render tư thế trước khi khung liền trước vừa render; PCFShadowMap. Đo 12 khung trước khi chạy cả video.
- Tiến trình nền có thể chết khi máy khởi động lại: kiểm `ps`, render tiếp các khung thiếu. Không dùng `pkill -f` với chuỗi có trong lệnh của chính mình.
- melt thiếu thuộc tính consumer → ra 720x576. Thiếu `-profile <file 1080x1920, sar 1, dar 9/16>` → viền đen 34 px hai bên: luôn `melt -profile cong_cu/v1080.profile ...` và kiểm điểm ảnh mép (x=2) sau khi xuất. Trang đồ hoạ dùng module → server phải trả Content-Type .js.
- faster-whisper với av mới: truyền mảng numpy thay vì đường dẫn.
- Link tải Magnific có chữ ký bị chặn → nhờ người dùng tải và đính kèm.

## 7. Bảng "đã dùng" (cập nhật mỗi tập)
| Tập | Môn | Sao / đội | Đối thủ / gag | Bối cảnh | Nhạc |
|---|---|---|---|---|---|
| E01 | NFL | Dallas Cowboys | 50 cụ bà, khung tập đi | sân NFL trong nhà, khán đài texture | (xem tap/E01) |
| E02 | NBA | Giannis (Heat #7, áo trắng HEAT) | đội cũ Bucks, ném phạt lâu, fan áo #34 | nhà thi đấu Bucks ghế 3D xanh–kem, jumbotron | alvana hiphop/legends |
| E03 | NFL | Chargers 0–7: Herbert #10, Dicker #11 (áo nhà xanh bột) | 11 ma-nơ-canh, bóng dội tay vào tay, mác SALE, khán đài khách toàn ma-nơ-canh | sân ngoài trời ban đêm, đèn pha, khán đài nhôm | alvana funk/make-money |
| E04 | NFL | Eagles 2–6: Barkley #26, McKee #16, Elliott #4 (áo nhà midnight green) | 11 người hơi vẫy tay (gập đè Barkley, 5 lần sack McKee, đá trúng cột) | bãi xe hàng xe hơi ban ngày "MEGA DEALS AUTO" | alvana upbeat/bouncing |
| E05 | NBA | Bulls 1–7: Powell #24, Wilson #8, Giddey #3 (+Jones #30, Williams #44; áo đỏ CHICAGO) | 5 người tuyết (tay que dài ra úp rổ, lướt băng, tan dần) | sân ngoài trời mùa đông bên hồ đóng băng + thành phố xa nhiều kiểu nhà | alvana chiptune/ice-temple |
| E06 | NFL | Bucs (kỷ lục kỳ quặc của đội THẮNG): Mayfield #6, Irving #7 (áo đỏ, quần pewter) | 11 chiếc ô (lật ngược hứng bóng), Falcons ký hợp đồng với ô | sân NFL mưa lớn ban chiều + phòng phân tích, sơ đồ từ trên, trường quay, phòng họp báo | alvana hiphop/hard-mode |
| E07 | NFL | Jaguars (đội mạnh nhất nhưng không có nhà): Lawrence #16, Washington #11 (áo teal, quần trắng) | 11 vali có mặt (băng chuyền "Carousel" x3, không ai nhấc nổi, thắng xử thua), Titans/Giants ở hạn chuyển nhượng | sảnh băng chuyền sân bay + công trường sân vận động + phố London + cổng B12 + phòng chờ bình luận | alvana funk/make-funk |
| E08 | NBA | Wembanyama #1 Spurs (áo trắng Association, cao 2,24 m, râu cằm) — chọc kiểu khen sau trận 52 điểm/24 bóng bật/8 chặn | 5 hươu cao cổ áo xanh SAVANNA (ăn bóng ×2, chặn bằng cổ, ngủ đứng), Mavericks ký 2 hươu | sân bóng thảo nguyên hoàng hôn (`lib/thaonguyen.js`) + trường quay + phòng họp báo DALLAS | alvana funk/eat |
| E09 | NBA | 4 đội đáy bảng gộp (4-35): Kuzma #18 MIL, LaVine #8 SAC, Hayes #11 UTA, Giddey #3 CHI | 5 cọc giao thông (đứng im, Jazz ghi nhầm rổ nhà, cọc ký max deal) | nhà thi đấu trung học ban đêm + khán giả (`lib/nhathidau.js`), trường quay, phòng ký hợp đồng | alvana upbeat/happy-dance |
| E10 | NBA | Steph Curry #30 Warriors (38 tuổi, áo trắng không logo) — dạng NGÔI SAO vs LỊCH SỬ sau trận 41 điểm vs Magic | cung thủ Anh trận Agincourt 1415 (mưa tên, kỵ sĩ Pháp, Curry 213–0, được phong hiệp sĩ) | chiến trường bùn rừng thu mưa + đoạn 1415 đen trắng + đại sảnh lâu đài kính màu (`lib/chientruong.js`) | alvana hiphop/final-level |
| E11 | NBA | Pelicans thua Warriors 87–138 (−51, dẫn tối đa 1 điểm): Murray #5, Fears #0, Queen #22, Herb Jones #2, Bey #41 (áo trắng NEW ORLEANS) | 5 bồ nông nâu thật (túi họng ngậm bóng, bay qua đầu, đậu lên vai; "Pelicans 138, Pelicans 87") | sân gỗ nổi giữa đầm lầy bayou hoàng hôn + bến gỗ Curry ngồi xem (`lib/bayou.js`) | alvana funk/breath |
| E12 | NBA | 76ers khởi đầu 9-2 nhưng chưa vào chung kết miền từ 2001: Maxey #0, Jaylen Brown #7, LeBron #23 (áo xanh PHILADELPHIA) | 50 em bé áo hồng "BABIES" (ngồi kín vùng sơn, khóc, ném núm vú; thắng 2–0) | nhà thi đấu playoff Philadelphia LED đỏ-xanh + phòng phân tích + họp báo hư cấu (`lib/embe.js`) | alvana upbeat/back-in-the-80s |
| E13 | NBA | 76ers thua Celtics 101–123 (chỉ dẫn 1 điểm, BOS dẫn tối đa 29): Maxey #0, Jaylen Brown #7 (trận đầu gặp đội cũ), LeBron #23, Embiid #21, Edgecombe #77 | Celtics áo xanh lá "BOSTON" (George #13 36 điểm, Tatum, White, Queta, Walsh) đi chân vịt → áo phao → xuồng chèo; vẫn thắng đúng 123–101 | nhà thi đấu Philadelphia LED "REMATCH", kết nước dâng ngập sân (`lib/boi.js`, `lib/cast13.js`) | chiptune/sunny-afternoon |
| E14 | NBA | Bucks thua Lakers 112–123 (thua 8 liền, 1-11): Herro #11, Kuzma #18, Ware #9, Jaquez #24, Rollins #13 đội mũ len | Lakers áo vàng "LOS ANGELES" (Doncic #77 32 điểm, Reaves, Kessler, Mamukelashvili #54 cựu Buck 5 quả 3, Thybulle) mặc quần đùi run cầm cập, trượt băng, khoan lỗ câu bóng, ném xuyên bão tuyết; vẫn thắng đúng 123–112 | sân vẽ trên hồ băng Wisconsin chiều vàng, rừng thông tuyết, chòi câu cá, thùng lửa (`lib/hobang.js`, `lib/cast14.js`) | upbeat/a-small-town-on-pluto |
| E15 | NBA | Thunder thua Blazers 2 đêm liền ở Portland (123–103, 118–108): Gilgeous-Alexander #2 (31), Hartenstein #55 lái máy cắt cỏ, Caruso #9 đẩy tường giậu, Mara, McCain | Blazers áo đỏ "PORTLAND" (Avdija #8 28 điểm dẫn bóng qua luống tulip, Lillard #0 bước ra từ bụi hồng, Clingan, Camara, Cissoko) — vẫn thắng đúng 118–108, "giỏi làm vườn" | sân gỗ giữa vườn hồng khổng lồ trưa nắng, tường giậu + cổng vòm hoa, núi tuyết xa, thảm cánh hoa (`lib/vuonhong.js`, `lib/cast15.js`); render `#nomb` | upbeat/love-love-love |

## 8. Không làm
- Không logo thật, không mặt giống hệt người thật, không lấy thảm kịch làm trò cười, không dùng hình/âm của video mẫu, không ghi API key vào file.

## Thay đổi
- v1.0 (08/11): gói chuyển tài khoản 1 file (kèm Mixamo FBX + tiếng Magnific), mục Khởi động kiểm từng bước, hook "What the f***" có bleep, ưu tiên kịch bản theo kết quả trận, chế độ NBA + danh sách Mixamo bóng rổ.
- v0.9 (07/11): động tác Mixamo (retarget tự động, clip MX_*), khoá bàn chân `locoLock`, đoạn hãm Run_To_Stop; E07 sân bay.
- v0.8 (06/11): chuyển động mocap mượt (`lib/dongtac.js`: loco/clipPose/expr, retarget UAL1→UBC), biểu cảm theo mốc lời cho mọi nhân vật thấy mặt; E06 dựng lại theo quy tắc này.
- v0.7 (05/11): mẫu mới Drake Maye vs 11 folding chairs (1,1M/18 h) — mở rộng 5 kiểu chủ đề, khuôn lời 10 bước (~55–70 s), nhiều bối cảnh phụ, đồ hoạ kiểu truyền hình, bão hoà ≥ 95, nhịp 35–45 shot.
- v0.6 (05/11): E05 — hook bíp (câm chữ + bíp 1 kHz, phụ đề ****, giọng gốc không chửi); đối chiếu box score Sportradar trước khi tạo giọng; `lib/tuyet.js` (sân tuyết, người tuyết, tuyết rơi, thành phố xa thật); melt PHẢI có `-profile` 1080x1920 (thiếu → viền đen 34 px hai bên, E04 bản đầu bị).
- v0.5 (05/11): mục Khởi động ở tài khoản/máy mới; E04 (người hơi vẫy tay, bãi xe ban ngày, đồ hoạ tờ rơi bán xe).
- v0.4 (04/11): E03 — quy tắc NHÂN VẬT LUÔN CỬ ĐỘNG (`liven`, `qbSignal`), sân ngoài trời ban đêm `lib/ngoaitroi.js`, ma-nơ-canh + tư thế NFL `lib/bongbau.js`, `backNameMax`, đồ hoạ khối xiên Anton.
- v0.1 (03/11): bản đầu.
- v0.2 (04/11): E01 — motion blur, mặt vẽ, số áo chiếu shader, phụ đề gộp token.
- v0.3.2 (04/11): dáng người (gầy/cân đối/to con/bụng phệ, vai rộng/hẹp), phụ kiện (băng đô, băng tay, ống tay, xăm, râu dê/quai nón/lún phún, kính), chiều cao thật `heightM`; 14 tiếng sân đấu Magnific.
- v0.3.1 (04/11): thêm thư viện tóc lib/toc.js (11 kiểu dựng bằng code + 2 kiểu MakeHuman CC0).
- v0.3 (04/11): E02 — quy tắc nhận việc theo môn + tin mới nhất, không lặp bối cảnh, kiểm nhận diện có nguồn; bối cảnh NBA theo mẫu, khán giả cử động, áo ba lỗ/quần đùi, động tác bóng rổ, tăng tốc render, sửa melt/whisper/đồ hoạ.
