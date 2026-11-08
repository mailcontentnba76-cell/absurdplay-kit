---
name: "nba-whatif"
description: "Sản xuất video TikTok dọc 'What If' NBA cho kênh AbsurdPlay (dự án P01, nhánh NBA): tìm kết quả/tin NBA mới nhất có kiểm nguồn, viết kịch bản tiếng Anh theo khuôn 10 bước, giọng clone Sport USA qua Magnific, dựng 3D three.js, đồ hoạ truyền hình, phụ đề vàng, ráp Kdenlive/melt, QA. Dùng khi người dùng nói 'NBA', yêu cầu kịch bản/video NBA mới, sửa video NBA, hoặc tiếp tục tập NBA dở."
---
# AbsurdPlay — NBA "What If" — v1.1-nba (08/11/2026)

> **Đây là bản quy tắc CÓ HIỆU LỰC cho mọi tập NBA.** Bản gốc `skill/sport-usa-whatif/SKILL.md` (v1.0, NFL + NBA) giữ nguyên làm nền: mục nào dưới đây ghi "giữ nguyên (gốc §x)" thì đọc ở bản gốc; mục nào viết lại ở đây thì **file này thắng**. Không chép quy tắc sang chỗ khác.
> Lý do tách: xem `NBA_MIGRATION/BAO_CAO_CHUYEN_DOI.md`.

## 0. Khởi động phiên (môi trường Claude Code trên web — đã kiểm 08/11)
- Trả lời người dùng **bằng tiếng Việt**. Lời thoại/kịch bản, tiêu đề, hashtag: **tiếng Anh (Mỹ)**. Mọi prompt cho AI tạo hình/chuyển động/âm thanh: **tiếng Anh**.
- Kho: `mailcontentnba76-cell/absurdplay-kit` (đã clone sẵn trong phiên). Engine làm việc: `/root/work/engine` (container bị thu hồi khi phiên nghỉ → mỗi phiên mới chạy lại bước dưới).
- Thiết lập lại (≈3 phút, lệnh trong `NBA_MIGRATION/HUONG_DAN_CAI_DAT.md`):
  1. `apt-get install -y melt frei0r-plugins fonts-montserrat` — **thiếu frei0r → lớp hình 3D ra ĐEN dưới đồ hoạ; thiếu fonts-montserrat → phụ đề ra font mảnh** (cả hai đã gặp trong dry run 08/11).
  2. `pip install --break-system-packages faster-whisper` ; mô hình `small.en` tải từ huggingface (tên miền đã mở).
  3. `cp -r du_an/P01_sport_usa_whatif/engine /root/work/engine && cd /root/work/engine && npm install && python3 patches/va_realism_effects_three170.py`.
  4. Mixamo FBX (không có trên GitHub): tải zip gói từ Release `goi-nba-v01` bằng `gh api -H "Accept: application/octet-stream" repos/mailcontentnba76-cell/absurdplay-kit/releases/assets/722659121 > goi.zip` (KHÔNG dùng `gh release download` — bị chặn GraphQL), giải nén, chép `engine/assets/mixamo/*.fbx`.
  5. Kiểm: `node render.js "test_run6.html" out_test 30 0 30 360 640` (có 30 ảnh, người chạy) + `node render.js "ep05.html#nomb" out_t 30 0 1 360 640 60,900`.
- **Giọng:** Magnific connector có sẵn trong phiên → `audio_tts` với `voiceId 195176` ("Sport USA"), `source: "mine"`. KHÔNG cần Claude in Chrome nữa. Mỗi lần tạo giọng tốn credit → **chỉ gọi sau khi người dùng duyệt kịch bản** và báo trước số ký tự. Gọi `audio_tts_direction` trước để biết cách mô hình đọc tag. Thử `audio_timing_get` trên bản giọng để lấy mốc từ; nếu không có thì dùng Whisper.
- **Dữ liệu NBA:** ESPN JSON công khai (đã mở mạng): `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=YYYYMMDD`, `.../summary?event=<id>` (box score), `.../teams/<abbr>/schedule`, `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings`. `cdn.nba.com` trả 403 qua proxy → NBA.com đọc qua WebSearch/web-fetch. **Ngày trong `schedule` là giờ UTC** (trận 19:00 ET hiện sang ngày hôm sau).
- Công cụ `mcp__widgets__fetch_sports_data` và `propose_skills` của bản gốc **không có** ở môi trường này → đã thay như trên.

## 1. Cách nhận việc NBA (thay gốc §0 phần NFL)
- Người dùng nói "NBA" (hoặc đưa chủ đề/kịch bản) → (1) kéo scoreboard 3 ngày gần nhất + standings; (2) chọn tin; (3) đề xuất **3 ý thuộc 3 kiểu khác nhau** (a–e như gốc §0: troll đội thua · chọc đội thắng bằng số liệu nghịch lý · kỷ lục kỳ quặc · phá kỷ lục/cột mốc · ông lớn sa sút), xếp hạng; (4) người dùng chọn → viết 1 kịch bản. **Chưa dựng khi kịch bản chưa duyệt.**
- **Ưu tiên kết quả trận vừa xong** (giữ ý chủ dự án 08/11, chuyển sang lịch NBA). NBA đá gần như mỗi đêm. Giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7): trận 19:00 ET (giờ mùa đông) bắt đầu 07:00 sáng hôm sau; trận muộn bờ Tây 22:00–22:30 ET kết thúc ≈ 12:30–13:30 trưa VN. → Chốt chủ đề sau ~13:30 VN là có đủ kết quả đêm trước. Ghi cả giờ gốc ET khi nêu lịch.
- Phân biệt trạng thái trận: **Scheduled / In Progress / Final / Postponed**. Không viết như tin nóng cho trận cũ > 3 ngày.
- Ngày đặc biệt NBA: Emirates NBA Cup (vòng bảng tháng 11, các tối thứ Ba/thứ Sáu), Christmas Day, trade deadline (tháng 2), All-Star, play-in/playoffs — kiểm lịch thật trước khi dùng.

## 2. Kiểm sự thật (thay gốc §0 "Nguồn tin" — chặt hơn)
- Thứ tự nguồn: (1) dữ liệu chính thức: box score ESPN JSON / NBA.com / trang đội; (2) AP, Reuters, ESPN, The Athletic, CBS Sports, NBC Sports, Yahoo Sports, USA Today, Bleacher Report; (3) phóng viên tích xanh (Shams Charania…) chỉ qua bài báo đọc được.
- Mỗi tên/đội/số áo/tỉ số/số liệu/kỷ lục/chấn thương trong kịch bản: **≥ 2 nguồn độc lập hoặc 1 nguồn dữ liệu chính thức**. Ghi vào bảng **"Tin đã chọn"** của kịch bản: nội dung · nguồn 1 · nguồn 2 · ngày kiểm (giờ VN).
- **Bản tóm tắt của WebSearch có thể sai** (08/11: một tóm tắt gán Luka 53 điểm cho tỉ số khác; một tóm tắt khác ghép sai ngày) → mọi con số phải đối chiếu box score.
- Tin đồn/"reportedly" → ghi rõ là tin đồn hoặc bỏ. Chấn thương: chỉ nêu trạng thái chính thức, **không đùa về chấn thương/bệnh** (gốc §0).
- **Câu nói thật** của cầu thủ (thẻ trích dẫn, bước 6 của khuôn lời): chỉ dùng khi có nguồn ghi nguyên văn; KHÔNG bịa trích dẫn. Lời thoại của nhân vật trong trận ảo là hư cấu → không đặt trong ngoặc kép kiểu trích dẫn, không gắn thẻ "quote".
- Phần hư cấu (đối thủ vô tri, trận ảo, tỉ số ảo) phải phi lý rõ ràng; phần thật (kết quả, chuỗi thua, số liệu) phải đúng.

## 3. Khuôn kịch bản NBA (ADAPT gốc §0 "Khuôn lời MỞ RỘNG")
Giữ nguyên 10 bước, ~55–70 s, **≥ 170 từ** (giọng ≥ 62 s), hook "What the f***" + bíp (gốc "Hook What the f***"). Thay phần đặc thù:
- Bước 1 hook: **"Could [đội/sao] beat 5 [vật vô tri/con vật nhựa/nhân vật hư cấu]?"** — NBA 5 người/đội (NFL là 11). Ví dụ đã dùng: 5 snowmen (E05).
- Bước 5 thuật ngữ bóng rổ thật: pick-and-roll, drop coverage, switch everything, zone, double team, iso, post-up, fast break, transition, shot clock violation, and-one, airball, travel, goaltending, technical foul, flagrant, timeout, free throws, box out, clutch time, "heat check", "and-one", "bricks".
- Bước 7 châm biếm truyền hình: bàn studio kiểu halftime show (bình luận viên **hư cấu**, không giống người thật).
- Bước 9 tỉ số ảo kiểu NBA (vd 98–101, có đồng hồ "Q4 — 0:02.4").
- Đuôi kết kéo đội/sao thật khác vào (vd đội đối thủ thật ký hợp đồng 10 ngày với vật vô tri) — không gán hành vi xấu bịa cho người thật.
- Mẫu cấu trúc tham chiếu: `PHAN_TICH_MAU/20261105_drake_maye_folding_chairs.md` (NFL nhưng khuôn dùng chung), E05 `tap/E05_bulls_snowmen` (NBA).

## 4. Giữ nguyên từ bản gốc (KEEP)
- Thông số kỹ thuật, phụ đề, màu, nhịp, loudness: gốc §2–§3 + `QUY_TRINH_DU_AN.md` §3.
- Hai điểm duyệt (kịch bản, bản cắt thử); không lặp đối thủ/gag/bối cảnh/nhạc; bảng "đã dùng".
- Nhận diện đúng tuyệt đối (đội, số áo, bản áo, tóc, râu, da, **chiều cao thật `heightM`** — NBA chênh lệch lớn, E02 từng sai); không logo NBA/đội, chỉ chữ thường trên áo; dấu chữ AbsurdPlay; nhân vật luôn cử động; chuyển động mocap; biểu cảm theo lời; tóc/dáng/phụ kiện (gốc §4).
- Chuỗi công cụ gốc §5 và lỗi đã gặp gốc §6 + `NHAT_KY_LOI.md`.
- Nhạc CC0 mỗi tập một bản; giao kèm 3 tiêu đề + 5–6 hashtag (#NBA #<Đội> #<Sao> #whatif #sportscomedy).

## 5. Bối cảnh, nhân vật, động tác NBA (ADAPT gốc §3–§4)
- Đã dùng NBA: E02 nhà thi đấu Bucks ghế xanh–kem (`lib/nba.js` `buildArena`), E05 sân ngoài trời tuyết (`lib/tuyet.js`). Không lặp. Gợi ý mới: sân đường phố mùa hè (bãi xe/rooftop), nhà thi đấu trung học, sàn gỗ trong siêu thị/kho hàng, sân trên du thuyền, phòng gym, công viên giải trí, sa mạc, bãi biển, "the bubble".
- Sân NBA: 28,65 × 15,24 m, rổ cao 3,05 m, vạch 3 điểm 7,24 m (góc 6,71 m). `lib/nba.js`: `basketball()`, `hoop()`, `rimWorld()`, `buildArena()`, `arenaLights()`.
- Áo: ba lỗ + quần đùi (`lib/nhanvat2.js`: `tank`, `shorts`, `wordmark`, số chiếu phẳng); mẫu đội `lib/cast2.js` (HEAT, BUCKS) → thêm đội mới cùng kiểu, màu tra nguồn chính thức. Bản áo theo trận thật (Association trắng / Icon màu / Statement / City) — kiểm ảnh trận.
- Động tác: `lib/bongro.js` (stance, dribble, shoot, dunk, defend, wingspan, holdChest, flex, slump, seated, toss) + mocap đi/chạy (`lib/dongtac.js` `loco`/`locoLock`) + Mixamo chạy (đã có). Mixamo bóng rổ **chưa có** — `MIXAMO_FILES` đã khai sẵn tên, thả file vào `engine/assets/mixamo/` là tự nạp (thiếu file thì bỏ qua): `Dribble`, `Jump_Shot`, `Layup`, `Dunk`, `Free_Throw`, `Bounce_Pass`, `Chest_Pass`, `Basketball_Idle`, `Defense_Shuffle`, `Block`, `Rebound` + phản ứng `Celebrate`, `Clapping`, `Defeated`, `Angry`, `Shrug`, `Pointing` (FBX Binary, Without Skin, 30 fps, In Place cho vòng lặp). Clip thành `MX_<Tên>`.
- Trọng tài NBA (áo xám, số): ra hiệu travel (xoay tay), blocking foul (tay chống hông), 3 điểm (giơ 3 ngón), and-one, technical (chữ T), goaltending (xoay ngón trên đầu).
- Đồ hoạ: bug tỉ số có quarter + game clock + **shot clock**; thẻ chỉ số (PTS/REB/AST/BLK), lower-third tên + số + vị trí (G/F/C).

## 6. Prompt tiếng Anh (khi dùng AI tạo tài sản)
Phương pháp chính vẫn là **3D bằng code** (gốc QUY_TRINH §1: video AI không giữ nhất quán nhân vật/số áo qua ~40 shot). Prompt tiếng Anh chỉ dùng cho tài sản phụ có kiểm soát (texture, đạo cụ 3D Magnific `models3d_*`, SFX `audio_sfx_generate`, nhạc nếu thư viện CC0 thiếu). Mẫu:
- Đạo cụ 3D: `"Low-poly stylized [object], clean flat colors, smooth bevels, game-ready, single object, neutral pose, no text, no logos, plain background"`.
- SFX: `"NBA arena crowd [cheer/groan/gasp], indoor, 3 seconds, no announcer voice, no music"`.
- Mô tả shot trong `epXX_shots.js` (cột `note`): tiếng Anh ngắn — `"Wide: 5 [objects] line up at free-throw line, camera slow push-in, crowd silent"`.
Không dùng prompt có tên cầu thủ thật để tạo khuôn mặt (quy tắc không mặt giống hệt người thật).

## 7. Bảng "đã dùng" — dùng chung với gốc §7 (một bảng duy nhất)
Cập nhật bảng ở **gốc §7** sau mỗi tập (kể cả tập NBA). Sổ chủ đề NBA (ứng viên, đã loại, lý do): `NBA_MIGRATION/SO_CHU_DE_NBA.md`.

## 8. QA bổ sung cho NBA (ngoài QUY_TRINH §3)
- Bảng "Tin đã chọn" đủ 2 nguồn/1 nguồn chính thức, có ngày kiểm.
- Số áo/đội/bản áo khớp trận thật; chiều cao `heightM` đúng nguồn.
- Không trích dẫn bịa; không logo; không đùa chấn thương.
- Kiểm hình thật bằng mắt (rút khung), không chỉ mã thoát: lớp 3D không đen, phụ đề Montserrat ExtraBold, mép x=2 không viền đen, bão hoà median ≥ 95 sau chỉnh màu.

## Thay đổi
- v1.1-nba (08/11/2026): tách nhánh NBA từ sport-usa-whatif v1.0; môi trường Claude Code web (Magnific connector thay Chrome, ESPN JSON thay widgets, cài frei0r + fonts-montserrat); khuôn kịch bản 5 đối thủ + thuật ngữ bóng rổ; kiểm sự thật chặt hơn (không trích dẫn bịa, đối chiếu box score); lịch kết quả theo giờ VN; tên Mixamo bóng rổ khai sẵn.
