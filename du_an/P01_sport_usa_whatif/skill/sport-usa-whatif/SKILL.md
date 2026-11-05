---
name: "sport-usa-whatif"
description: "Sản xuất video TikTok dọc kiểu 'What If' thể thao Mỹ (format kênh @whatifbagel) cho dự án P01 Sport USA: tìm tin NFL/NBA mới nhất, viết kịch bản, giọng clone Sport USA, dựng 3D three.js, phụ đề vàng, đồ hoạ truyền hình, ráp Kdenlive. Dùng khi người dùng yêu cầu kịch bản/video mới hoặc sửa video cho dự án P01."
---
# Sport USA "What If" — v0.5 (05/11/2026)

Kho lưu bộ hồ sơ: GitHub `mailcontentnba76-cell/absurdplay-kit` (riêng tư). Đầu phiên: clone kho này nếu chưa có `/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO`; cuối mỗi tập: commit + push (không đẩy mp4/mov/wav lớn, node_modules).

Đã giao: E01 "Cowboys vs 50 Grandmas" (NFL), E02 "Giannis vs his old team" (NBA), E03 "Chargers vs 11 mannequins" (NFL). E04 "Eagles vs 11 inflatable tube men" (NFL): đã giao 05/11.

## Khởi động (đọc đầu tiên, nhất là ở tài khoản/máy mới)
- **Trả lời người dùng bằng tiếng Việt.** Kênh TikTok: **AbsurdPlay**; dự án P01 "Sport USA".
- Bộ hồ sơ đầy đủ nằm ở `/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/`. Chưa có → (1) người dùng đính kèm `AbsurdPlay_P01_bo_ho_so.zip` → giải nén vào `/root/work/`, hoặc (2) clone GitHub `mailcontentnba76-cell/absurdplay-kit` nếu tài khoản có quyền.
- Engine: `cp -r du_an/P01_sport_usa_whatif/engine /root/work/engine && cd /root/work/engine && npm install` (three r170, postprocessing, realism-effects, camera-controls, simplex-noise, @fontsource/*), rồi BẮT BUỘC `python3 patches/va_realism_effects_three170.py` (vá motion blur cho three r170; chạy lại sau mỗi lần npm install, thiếu thì render có motion blur báo `INVALID_OPERATION`); Playwright + Chromium có sẵn trong môi trường (không cài lại). Python: faster-whisper, numpy (`pip install --break-system-packages faster-whisper`); ffmpeg, melt (MLT) cho Kdenlive.
- **Âm thanh KHÔNG có trong gói** (theo yêu cầu chủ dự án): nhạc/SFX CC0 tải lại theo `tai_nguyen/am_thanh/README.md` (git clone sfx-kit, alvana-audio, Free-SFX, Meta-open-sound vào `/root/work/assets/audio`); tiếng sân đấu Magnific (`magnific_sfx/`) → nhờ người dùng tạo lại bằng Magnific Sound Effects hoặc đính kèm. `tron_am_thanh.py` của mỗi tập ghi rõ file nào dùng ở giây nào.
- Giọng clone "Sport USA" nằm trong tài khoản Magnific của người dùng (không chuyển được qua gói): tài khoản Claude mới chỉ cần Claude in Chrome đăng nhập sẵn Magnific, hoặc người dùng tự tạo giọng và đính kèm mp3.
- Chạy thử engine: `node render.js "ep04.html#nomb" out_test 30 0 1 360 640 30,300,900` → có 3 ảnh là engine chạy đúng.

## 0. Cách nhận việc (yêu cầu cố định của chủ dự án)
- **Chờ yêu cầu.** Người dùng nói môn (vd "NFL", "NBA") → tự tìm tin MỚI NHẤT của môn đó (WebSearch + `mcp__widgets__fetch_sports_data` scores/standings/game_stats), chọn tin đáng làm, đề xuất 3 ý tưởng + 1 kịch bản. Chưa dựng video khi kịch bản chưa duyệt.
- **Nguồn tin (theo yêu cầu chủ dự án):** chỉ dùng nguồn lớn, uy tín, mới nhất. Thứ tự ưu tiên: (1) trang chính thức NBA.com / NFL.com và trang chính thức của đội; dữ liệu trận `fetch_sports_data`; (2) hãng tin & báo thể thao lớn: AP, Reuters, ESPN, The Athletic, CBS Sports, NBC Sports, Yahoo Sports, Bleacher Report, USA Today; (3) tài khoản mạng xã hội có tích xanh của giải/đội/phóng viên tin nóng (vd Shams Charania, Adam Schefter, Ian Rapoport) — chỉ qua bài báo/nhúng mà WebSearch/WebFetch đọc được. Mỗi số liệu/tin dùng trong kịch bản phải khớp ≥ 2 nguồn (hoặc 1 nguồn chính thức), ghi nguồn + ngày trong bảng "Tin đã chọn". Không dùng blog/tin đồn/trang tổng hợp không rõ nguồn.
- **Ưu tiên kịch bản TROLL ĐỘI THUA (chủ dự án yêu cầu):** nhóm này có view trung vị 1,4M (mẫu: Cowboys vs 50 babies 5,8M; Herbert 20 O-line 1,5M; Packers vs babies 1,4M). Khuôn 5 bước: (1) Hook "Could [đội đang thảm hại] beat [đối thủ yếu vô lý]?" (2) thổi phồng lợi thế "This should be the easiest win…" (3) "Except" + nỗi đau THẬT của fan (chuỗi thua, thống kê tệ) (4) trận ảo thua đúng kiểu lỗi thật, tên cầu thủ thật (5) Final score như bản tin + câu troll để fan đối thủ chia sẻ. Không chép premise kênh mẫu đã làm; không đùa về chấn thương/bệnh.
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
- Đã dùng: E01 sân NFL trong nhà kiểu AT&T (khán đài texture), E02 nhà thi đấu Bucks ghế xanh–kem (`lib/nba.js`), E03 sân ngoài trời ban đêm (`lib/ngoaitroi.js`: trời sao, 6 tháp đèn pha, khán đài nhôm + chòi bình luận, cỏ bàn cờ, đường chạy đỏ, cột gôn vàng, bảng điểm 2 cột). Tập sau chọn khác: sân ban ngày/tuyết/mưa, sân đường phố, bối cảnh lịch sử/vũ trụ/thành phố…
- Ánh sáng: hemi ≥ 2,5 + key có bóng + đèn phụ gắn máy quay (nhân vật da tối/áo tối vẫn rõ). Kiểm số đo bão hòa/sáng trên ảnh xem trước.
- Khán giả phải cử động: vertex shader nhún + giơ tay + ngủ gục, điều khiển theo shot (`A.crowd.uCheer/uSleep/uT`).

## 4. Nhân vật & động tác
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

## 5. Chuỗi công cụ
```
kịch bản (duyệt) → Magnific Voice (Sport USA, tag [energetic, fast-paced narrator]) → người dùng tải mp3, đính kèm
→ cong_cu/rut_nghi.py → am_thanh/giong.wav (atempo chỉ khi < 155 từ/phút)
→ faster-whisper small.en (truyền mảng numpy 16 kHz; initial_prompt tên riêng) → words_raw.json → sửa số/tên → words.json
→ engine/epXX_shots.js (mốc shot + SUB điểm cắt phụ) → epXX.html + epXX_gfx.html (đồ hoạ đọc mốc từ shots.js)
→ xem nhanh: node render.js "epXX.html#nomb" out 30 0 1 540 960 <danh sách khung>
→ cắt thử: nomb 540x960, 15 khung/s + gfx + phụ đề + giọng (ffmpeg) → duyệt
→ đủ: node render.js epXX.html out 30 f0 f1 720 1280 (2 tiến trình, ≈4,4 s/khung)
→ dohoa_render.js → qtrle .mov; tao_phu_de.py; tron_am_thanh.py (nhạc CC0 + SFX theo mốc; tiếng sân đấu thật ưu tiên `magnific/*`: crowd_cheer/roar/boo/gasp/laugh/ambience, ref_whistle, buzzer, sneaker_squeak, ball_dribble, swish, rim_dunk, backboard_bang, stadium_horn, football_hit, football_kick; stinger sad_trombone, organ_charge; crowd_ooh_aah, chant_defense, clap_rhythm, airball_chant, silence_cough, stadium_crowd_outdoor, drumline, camera_flashes — nền khán giả crowd_ambience trải suốt video)
→ hinh.mp4 (lanczos 1080x1920, eq=saturation=0.86:brightness=0.02, unsharp) → tao_kdenlive.py
→ melt ... -consumer avformat:out.mp4 width=1080 height=1920 progressive=1 frame_rate_num=30 frame_rate_den=1 → loudnorm 2 lượt −14 LUFS/TP −1,5 → QA.md
```

## 6. Lỗi đã gặp (chi tiết ở NHAT_KY_LOI.md)
- Máy quay: dùng shot `path`+`lookPath` 2 điểm; `lerpLookAt` nội suy cầu có thể vòng ngược.
- Màn hình/biển dán sát hộp phải nằm NGOÀI mặt hộp.
- Tầm nhìn ngang dọc hẹp (~26° ở fov 50): đạo cụ hai bên nhân vật đặt trong ±0,6 m ở 3 m.
- Đồ hoạ không được đè mặt ở shot cận (đặt top ~90–250 hoặc dưới phụ đề y≈1420).
- Render: gộp khán đài thành 1 lưới tĩnh; motion blur bỏ lượt render tư thế trước khi khung liền trước vừa render; PCFShadowMap. Đo 12 khung trước khi chạy cả video.
- Tiến trình nền có thể chết khi máy khởi động lại: kiểm `ps`, render tiếp các khung thiếu. Không dùng `pkill -f` với chuỗi có trong lệnh của chính mình.
- melt thiếu thuộc tính consumer → ra 720x576. Trang đồ hoạ dùng module → server phải trả Content-Type .js.
- faster-whisper với av mới: truyền mảng numpy thay vì đường dẫn.
- Link tải Magnific có chữ ký bị chặn → nhờ người dùng tải và đính kèm.

## 7. Bảng "đã dùng" (cập nhật mỗi tập)
| Tập | Môn | Sao / đội | Đối thủ / gag | Bối cảnh | Nhạc |
|---|---|---|---|---|---|
| E01 | NFL | Dallas Cowboys | 50 cụ bà, khung tập đi | sân NFL trong nhà, khán đài texture | (xem tap/E01) |
| E02 | NBA | Giannis (Heat #7, áo trắng HEAT) | đội cũ Bucks, ném phạt lâu, fan áo #34 | nhà thi đấu Bucks ghế 3D xanh–kem, jumbotron | alvana hiphop/legends |
| E03 | NFL | Chargers 0–7: Herbert #10, Dicker #11 (áo nhà xanh bột) | 11 ma-nơ-canh, bóng dội tay vào tay, mác SALE, khán đài khách toàn ma-nơ-canh | sân ngoài trời ban đêm, đèn pha, khán đài nhôm | alvana funk/make-money |
| E04 | NFL | Eagles 2–6: Barkley #26, McKee #16, Elliott #4 (áo nhà midnight green) | 11 người hơi vẫy tay (gập đè Barkley, 5 lần sack McKee, đá trúng cột) | bãi xe hàng xe hơi ban ngày "MEGA DEALS AUTO" | alvana upbeat/bouncing |

## 8. Không làm
- Không logo thật, không mặt giống hệt người thật, không lấy thảm kịch làm trò cười, không dùng hình/âm của video mẫu, không ghi API key vào file.

## Thay đổi
- v0.5 (05/11): mục Khởi động ở tài khoản/máy mới; E04 (người hơi vẫy tay, bãi xe ban ngày, đồ hoạ tờ rơi bán xe).
- v0.4 (04/11): E03 — quy tắc NHÂN VẬT LUÔN CỬ ĐỘNG (`liven`, `qbSignal`), sân ngoài trời ban đêm `lib/ngoaitroi.js`, ma-nơ-canh + tư thế NFL `lib/bongbau.js`, `backNameMax`, đồ hoạ khối xiên Anton.
- v0.1 (03/11): bản đầu.
- v0.2 (04/11): E01 — motion blur, mặt vẽ, số áo chiếu shader, phụ đề gộp token.
- v0.3.2 (04/11): dáng người (gầy/cân đối/to con/bụng phệ, vai rộng/hẹp), phụ kiện (băng đô, băng tay, ống tay, xăm, râu dê/quai nón/lún phún, kính), chiều cao thật `heightM`; 14 tiếng sân đấu Magnific.
- v0.3.1 (04/11): thêm thư viện tóc lib/toc.js (11 kiểu dựng bằng code + 2 kiểu MakeHuman CC0).
- v0.3 (04/11): E02 — quy tắc nhận việc theo môn + tin mới nhất, không lặp bối cảnh, kiểm nhận diện có nguồn; bối cảnh NBA theo mẫu, khán giả cử động, áo ba lỗ/quần đùi, động tác bóng rổ, tăng tốc render, sửa melt/whisper/đồ hoạ.
