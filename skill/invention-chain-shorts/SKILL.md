---
name: "invention-chain-shorts"
description: "Sản xuất video dọc 30–50 s kiểu 'How you invented the X' (dự án P02, mẫu kênh TikTok @oddtilt): người xem ('you', người tiền sử hoặc người hiện đại) giải từng lỗi một cho tới khi phát minh ra đồ vật, hài bựa, kết khép vòng, 3D bán tả thực (MakeHuman + mocap), phụ đề trắng 2 từ giữa màn hình, lời kể nhanh liên tục. Dùng khi người dùng yêu cầu ý tưởng, kịch bản, bản thử hoặc video mới cho dự án P02, hoặc nhắc tới oddtilt / 'how you invented', hoặc khi chuyển dự án sang máy/tài khoản khác (đọc QUY_TRINH_DAY_DU.md)."
---
# Invention-chain shorts (P02) — v1.4 (07/11/2026)

> **Trạng thái:** chuỗi dựng đã được chủ dự án DUYỆT trên demo "the door" 0–11 s (bản thử 8, 06/11/2026) sau 8 vòng sửa. Mọi quy tắc trong mục 5–7 là chuẩn bắt buộc cho video sau. Quy trình chung: `00_HUONG_DAN_CHO_CLAUDE.md` + skill `video-production-pipeline`.
> **Cách làm việc chủ dự án đã cho phép (06/11/2026):** tự quyết các bước kỹ thuật và làm tiếp không chờ; chỉ hỏi trước khi tiêu nhiều credit Magnific, xoá dữ liệu, hoặc đăng/chia sẻ ra ngoài. Không làm bản sao video của kênh khác để đăng.

**Quy trình thao tác đầy đủ (cài đặt, 14 bước 1 tập, lệnh chạy, chuyển tài khoản, thứ chủ dự án phải tự thêm): `QUY_TRINH_DAY_DU.md` cùng thư mục — đọc trước.** Cài môi trường mới: `bash du_an/P02_oddtilt/cai_dat/cai_dat.sh` rồi `kiem_tra.sh --render` (mô hình Parakeet + dữ liệu MakeHuman ở `$P02_HOME`, mặc định `~/.p02`).
Kho: GitHub `mailcontentnba76-cell/absurdplay-kit`, nhánh `du-an-moi`. Hồ sơ: `du_an/P02_oddtilt/` (đọc `HO_SO_DU_AN.md`, `PHAN_TICH_MAU/TONG_HOP.md`, `PHAN_TICH_MAU/NHAN_VAT.md`, `NHAT_KY_LOI.md` trước khi làm). Môi trường cloud: `absurdplay-kit` (mở `pikaso.cdnpk.net` để tải file Magnific). Trả lời bằng tiếng Việt.

## 1. Công thức kịch bản (14/14 mẫu)
```
HOOK (0 s, 1 câu): vấn đề cá nhân, ngôi "you", thô/nước đôi        ← 14/14
"So you, being a genius caveman, [giải pháp thô sơ]"  (ở 6–12 %)   ← 11/14
"Clever!" / "Genius!" / "Much better!"                              ← 1–3 lần
"But/Except [lỗi mới — thường do 'your friend']" → "so you [cải tiến có thật]"
   × 3–6 vòng, mỗi vòng 5–8 s (trung vị 6,9 s)
[1 giải pháp phi lý ở nửa sau: nhà máy hạt nhân / laser / phá nhà…]  ← 7/14
KẾT A (35–62 s): "Congratulations! You've invented the X!" ở 92–95 %
KẾT B (30–40 s): "Now your friend …" câu nước đôi nối lại hook
```
- Mỗi cải tiến là **bước kỹ thuật có thật** của đồ vật (tra nguồn); gag nằm ở cách vấp lỗi và câu chữ.
- Lời ~210 từ/phút (185–235), **không khoảng lặng > 0,35 s**, bắt đầu ≤ 0,3 s.
- Video để đăng: không chép đồ vật/gag/lời của 14 mẫu; không dùng "dấu hiệu" kênh mẫu (tháp hạt nhân…).
- **Giọng văn ĐÃ CHỐT (chủ dự án 06/11/2026): "bựa" như mẫu** — hook kiểu B (khó chịu cơ thể: ass, sweaty, smell like shit) hoặc D (toilet: taking a shit), có "ass/shit" trong hook và 1 lần "fucking" ở vòng cuối do "your friend"; kết "Now your friend …" nước đôi gọi lại hook. Tham khảo khung demo "the door". Đề xuất đồ vật gắn với cơ thể/vệ sinh/đời sống (giấy vệ sinh, khử mùi, vòi rửa…).

## 1b. Bài học 2 mẫu VIRAL (golf ball, trampoline — chủ dự án gửi 07/11/2026; chi tiết `PHAN_TICH_MAU/15_bong_golf.md`, `16_trampoline.md`) — ƯU TIÊN khi viết tập mới
**Kịch bản**
- Không bắt buộc "caveman": bối cảnh **hiện đại đời thường** (sân sau, công viên, phòng tắm, bãi biển…) cũng được và đang viral; nhân vật ăn mặc thường ngày.
- **Khuôn trampoline 9 câu (chủ dự án yêu cầu bám theo, 07/11/2026):** You want to [động cơ bựa], but [vật cản] → So you [đồ tạm] → Except it barely…, and your friend [phản đòn "his fucking …"], so you … → Genius! → Now when you …, [cơ chế thật], launching you … → But the [bộ phận] … under your fat ass, so … → But on your next …, [chấn thương], so … → Except your little cousin … [bay/bắn mất], so … → Now you can [động cơ] every day! (mở rộng 140–150 từ được).
- 2 kiểu hook mới, mạnh nhất:
  - **E – chơi chữ tên đồ vật** (golf: "Your brass balls are too heavy…") → câu kết lặp lại đúng chữ nước đôi ("…now your balls are aerodynamic!").
  - **F – động cơ bựa/cấm kỵ**, đồ vật chỉ là phương tiện (trampoline: "You want to watch your friend shower, but he put up a fence") → kết "**Now you can [động cơ] every day!**" khép vòng.
- 31–36 s, ~220 từ/phút, **4–5 vòng lỗi→sửa** (mỗi vòng ~5 s), 1–2 câu khen, 1–2 câu "Now when you…, [cơ chế khoa học thật]".
- Nguồn lỗi đổi liên tục để leo thang: **kẻ phản đòn** ("your friend makes his fucking fence taller") → **cơ thể** ("snaps underneath your fat ass") → **chấn thương** (kẹp chân) → **người thứ ba** ("your little cousin… gets launched") / **nạn nhân ngẫu nhiên** ("some fucking old man has the audacity…"). 1 lần "fucking", 1 lần "ass"/"balls".
**Hình ảnh**
- **Đồ vật là ngôi sao**: 35–50 % thời lượng là MACRO đồ vật (máy sát đất, vật chiếm 40–60 % khung, DOF nông, nền mờ chân người). Mỗi cải tiến = 1 **biến hình thấy được** của chính đồ vật (bóp méo squash/stretch, rách dần, vỏ khép lại, lỗ mọc dần, bộ phận thay vật liệu).
- **Lắp ráp hiện dần đúng lúc đọc danh từ**: bộ phận bật ra lần lượt (scale 0→1 overshoot 0,25 s, cách nhau 0,05–0,1 s) trong khi máy trượt dọc theo.
- **Thất bại phải có cú ngã/đau/bay**: ragdoll ngã ngửa, khung gãy sập, người thứ ba bị bắn thành chấm nhỏ trên trời (máy ngước theo), cận chân bị kẹp; giữ phản ứng 1–2 s.
- **1 đồ hoạ khoa học/tập**: đường dòng khí trắng mảnh 3D, mũi tên lực, sóng… minh hoạ câu "Now…".
- Máy: xen **macro vật ↔ rộng người** (golf, shot trung vị 1,5 s) hoặc **máy bay liên tục kể chuyện** (trampoline: kéo lùi từ mục tiêu về qua vai nhân vật trong 1,2 s; cẩu theo cú nhảy; median flow 0,8 px/khung, đứng yên ≤ 10 %). Nhiều góc qua vai/sau lưng → người xem "là" nhân vật. Vật bay thì máy bám theo.
- Kết: shot gọi lại shot mở đầu (cùng mục tiêu/khung hình) khi đạt động cơ.
**Màu** (khớp 7a2): nền tự nhiên dịu (bão hoà TB ≈ 78), nhân vật trung tính (áo trắng/xám, jean), **chỉ 1 màu rực = đồ vật phát minh** (bóng đỏ, đệm xanh dương) để mắt đi thẳng vào nó.
**Mở đầu** (kết hợp 7a): 0–1,5 s cho thấy **động cơ/vấn đề bằng hình** (mục tiêu trong khung cửa, macro đồ vật lỗi), rồi tới phản ứng hài của nhân vật.
**Cách làm trong engine hiện có** [SL, thử ở tập tới]: ngã ragdoll = xoay `root` quanh trục ngang bằng smootherstep 0,45 s + `squat`/tay vung, nảy nhẹ khi chạm đất (cos tắt dần); lắp ráp hiện dần = mảng mesh với `scale = overshoot(rp(t, t_từ + i·0,07, +0,25))`; streamlines = `THREE.Line` trắng mờ (opacity .7) từ đường cong uốn quanh vật, dịch pha theo t; macro = fov 28–32, máy cách vật 0,25–0,5 m, độ cao 0,05–0,2 m, thêm BokehPass nhẹ hoặc nền mờ bằng texture `_m`.
**Không chép**: tháp làm mát hạt nhân (dấu hiệu kênh), logo MakeHuman, đề tài golf/trampoline/nhìn trộm tắm y hệt.

## 2. Thông số đích (đo trên mẫu)
| Mục | Đích |
|---|---|
| Khung | 1080×1920, 30 fps |
| Thời lượng | 30–50 s |
| Shot | 10–18 shot, trung vị 2,5–3,5 s, cắt cứng; ≥ 1 shot mới mỗi "so you…"/"But/Except". Mẫu viral: 15 shot trung vị 1,5 s (golf) hoặc ~10 cắt + máy bay liên tục (trampoline) |
| Màu | ban ngày tự nhiên, bão hoà 60–130, sáng 95–165 (HSV); mẫu viral TB 78 + 1 vật nhấn rực |
| Âm | −14 LUFS, TP ≤ −1; nhạc −19 dB dưới lời |
| Icon 2D | ≥ 2 loại/video: tim, Zzz, mồ hôi, sóng mùi, vòng âm, mũi tên cong, viền highlight xanh lá, confetti |

## 3. Phụ đề
`tap/DEMO_door/cong_cu/tao_phu_de.py <words.json> <ra.ass> [t_max]` (K=1,5 cho 1080): Poppins ExtraBold 105 px trắng, viền 4,5 + bóng 3,75 tối, tâm (540, 1150) ≈ 60 % chiều cao, cụm 1–3 từ (trung vị 2), hiện cả cụm + nảy 90 ms, 1 khung trống giữa cụm, từ cảm xúc/chửi viết HOA. Ghép: `ffmpeg … -vf "ass=<file>:fontsdir=engine/fonts"`.

## 4. Âm thanh
0. **Giọng đọc (chủ dự án chọn bằng tai, 07/11/2026 — bắt buộc):** `audio_tts {model:"eleven_turbo_v2_5", stability:0.3, speed:0.97, voiceId:197595, source:"mine"}`; trong lời: **CHỮ HOA** các từ đắt (động cơ, vật cản, FUCKING, FAT ASS, kết quả bay/ngã, EVERY DAY), `...` trước cú nảy. **Không dùng tag [..]** (turbo đọc thành tiếng). ~77 credit/lần. Đã thử eleven_v3 Creative (đo dải cao độ rộng hơn, 15,4 vs 12,0 bán cung) nhưng **chủ dự án nghe thấy turbo hay hơn** → số đo cao độ KHÔNG thay được tai người; đổi giọng phải gửi bản nghe thử cho chủ dự án chọn.
1. Giọng (Magnific Voice, chủ dự án tạo) → `silenceremove` rút nghỉ > 0,15 s về 0,12 s → `atempo` tới ~218 từ/phút → Parakeet (`cong_cu/asr_parakeet.py`) lấy mốc từ → `words.json`.
2. Nhạc: `tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3` (đã chọn), −19 dB, fade 0,5 s cuối.
3. SFX Magnific theo mốc (`tai_nguyen/sfx/README.md`): `ding` −9 dB ở câu khen (−0,06 s), `whoosh` −14 dB mỗi cắt cảnh (−0,15 s), `uh_oh` −15 dB ở "But/Except", tiếng vật theo hành động (gió, trải da, rèm, ván) −10…−12 dB. Mẫu lệnh: `tap/DEMO_door/cong_cu/tron_am.sh` (amix normalize=0 → loudnorm I=−14 TP=−1,5).

## 5. Chuỗi dựng hình — CHUẨN ĐÃ DUYỆT
**Cảnh mẫu:** `du_an/P02_oddtilt/engine/MAU_CANH_CHUAN.html` — sao chép khi dựng cảnh mới. Engine: `cd engine && npm install && python3 patches/va_realism_effects_three170.py`.

1. **Nhân vật = MakeHuman** (kênh mẫu dùng đúng bộ quần áo mặc định MakeHuman, CC0): `cong_cu/mh_bake.py $P02_HOME/makehuman-data/package/public/data nhan_vat/<x>.json engine/assets/mh` → `loadMH(dir,{heightM})`. Bộ sẵn: `chinh` (áo trắng logo MAKEHUMAN + jean sáng), `ban` (sơ mi xanh than, da đen), `nu`, `tho` (yếm), người tiền sử `ts_da / ts_long / ts_bao / ts_nu` (texture `cong_cu/mh_vai.py`). Đổi màu áo: `mh_doi_mau.py`, làm sáng jean: `mh_jean_sang.py`.
2. **Động tác = mocap CMU** (`engine/assets/cmu/*.bvh`, danh mục `README.md`): `applyMocap(ch, mo, t, {pos, yaw, faceAt, inPlace})` → chỉnh tay `armIK(ch,'L'|'R', đích, pole)` → xoay `rotWorld(bone, trục, góc)`.
   - Ngồi: clip 22_03 + gập spine05 về sau, tay lên miệng/cổ áo bằng `armIK` quanh `J(ch,'head')`.
   - Treo đồ: clip 111_28 + `armIK` hai tay giữ cuộn trên đầu → ép xuống → một tay chống hông, quay đầu (neck 45 %, head 55 %, spine01 15 %) bắt đầu ~0,5 s trước câu khen.
   - Khom ló nhìn: xoay `upperleg01 −0,55`, `lowerleg01 +0,94`, `foot −0,39`, `spine05 +0,95` (nhún ±0,06 theo sin), hạ chân chạm đất, `armIK` hai tay tới gối, quay đầu ±0,22.
   - **Không nhân vật nào đứng yên**: luôn thở/nhún/lắc/quay đầu + chớp mắt.
3. **Biểu cảm** `lib/face.js`: `applyFace(ch, mix([EXPR.tu_hao,k],[{LeftUpperLidClosed:1,RightUpperLidClosed:1},blink(t,seed)]))` — gọi SAU tư thế. Có: `cuoi, tu_hao, ngac_nhien, to_mo, ngai, kho_chiu` + 60 đơn vị gốc. Bị nhìn trộm → `kho_chiu+ngai`; câu khen → `tu_hao`→`cuoi`; người bạn → `to_mo` + nhếch cười.
4. **Vật liệu ảnh thật** (Magnific text-to-image 1:1, "Seamless tileable texture, photograph of …", ~65 credit/ảnh) → `engine/assets/tex/mag/<x>_col.jpg` + normal từ độ sáng. Đã có: đá xám, đá phiến sẫm, ván gỗ xám, sàn gỗ, da thuộc, rơm, cỏ, phông đồng cỏ. HDRI `assets/hdri/park.hdr` (CC0, `environmentIntensity 0,55`) + nắng có bóng 2048. **Không dùng GTAO.**
5. **Vật biến hình theo lời** dựng bằng lưới trong code (không dùng mô hình tĩnh):
   - Tấm da treo: rộng hơn lỗ cửa (1,36 m), treo sát mặt tường trong (z = mặt tường − 3 cm); `len` trải xuống từ cuộn tròn; gió: **cả tấm quay quanh thanh treo, hất vào trong**, góc 0,3→1,15 rad theo bề ngang (một bên bay cao hơn) + rung sin; `slide` gom thành dải nếp ở một bên.
   - Cửa ván: 5 ván ảnh thật (mỗi ván 1/5 ảnh) rơi vào chỗ lần lượt 0,14 s/ván, rồi 2 nẹp ngang, rồi nẹp chéo (−0,97 rad).
6. **Máy quay** — bảng `SH = [[t0,t1, vị trí đầu, cuối, nhìn đầu, cuối, fov], …]`:
   - **Không bao giờ đứng yên.** Shot mở đầu: góc RỘNG thấy toàn thân cả 2 nhân vật, giữ 0,35 s, đẩy vào ease-out `1−(1−p)^2,2` tới khi khung cửa gần đầy khung. Các shot sau chạy gần đều `u = 0,15p² + 0,85p` (không dừng ở đầu/cuối shot).
   - **Chiều sâu:** máy chéo ¾ (30–45° so với mặt tường) có tiền cảnh (góc tường, khung cửa, nhân vật); vừa đẩy 0,35–0,7 m vừa trôi ngang/lên 3–45 cm để có thị sai. Không nhìn vuông góc vào mặt phẳng.
   - Tốc độ đẩy (đo bằng `cong_cu/qa_may_nhapnhay.py`) bám mẫu: shot 1 ≈ 23, shot 2 ≈ 10, shot sau ≈ 5; đứng yên ≤ 10 %. Bản duyệt đo: 26,7 / 7,7 / 4,0 / 4,4, đứng yên 8 / 0 / 0 / 0 %.
   - Nhìn từ trong nhà: **bên trái màn hình = +x thế giới** — luôn render 1 khung kiểm hướng (gió, vật bay, nhân vật ngoài cửa) trước khi render đủ. Đặt máy ở phía mép rèm bay thấp để rèm không trùm ống kính.
7. **Render & xuất:**
   - Kiểm nhanh: `node render.js "<cảnh>.html?w=360" <ra> 30 0 1 360 640 <danh sách khung>` → xem ảnh ghép; đo máy trên bản 360p đủ khung.
   - Bản cuối: `JPEGQ=0.97 node render.js "<cảnh>.html?w=1080" <ra> 30 f0 f1 1080 1920` × 3 tiến trình (≈ 5 s/khung), composer `WebGLRenderTarget(W,H,{samples:4,type:HalfFloatType})` (MSAA) + `OutputPass`.
   - Mã hoá: `ffmpeg -framerate 30 -i f_%05d.jpg -i mix.wav -vf "ass=…" -c:v libx264 -crf 15 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest`. Không `unsharp`.

## 6. Lỗi đã gặp — cách phòng (chi tiết `NHAT_KY_LOI.md`)
- **Z-fighting → nhấp nháy đen:** mọi khối (khung cửa, nẹp, rèm) lệch khỏi mặt khối khác ≥ 1,5 cm; không đặt mặt cạnh trùng mặt cắt tường.
- **Texture ảnh quá chi tiết (đá hang, đất sỏi) lấp lánh khi máy chạy** (E03: nhấp nháy 3 khung gấp ~10× bản door): bản texture dùng cho tường/sàn chính = thu về 768 px + làm mờ 0,6 px (`<x>_m_col/_nrm.jpg`), normalScale ≤ 0,8 (đá 0,45), sàn không normal map. Ngưỡng QA: tỉ lệ điểm "tối–sáng–tối" qua 3 khung ≤ 20/10 000 điểm ảnh (bản door duyệt: 6–8).
- **Nền xa lấp lánh:** texture đất/cỏ xa lặp ≤ 30 lần/400 m, không normal map, anisotropy 16 + mipmap.
- **Sọc đen ở nếp gập vật mỏng:** do GTAO → không dùng AO màn hình.
- **Lộ nhân vật ngoài cửa qua khe:** rèm/tấm che phải trùm rộng hơn lỗ và sát tường.
- **Texture vẽ bằng code trông hoạt hình:** chỉ dùng ảnh thật; cắt bỏ viền tối/vết lạ của ảnh AI bằng `repeat 0,26` + `offset` chọn vùng sạch.
- **Nhoè khi chuyển động:** 720p/JPEG 0,93/không MSAA → luôn 1080 + MSAA + JPEG 0,97.
- **Camera "mặt phẳng"/đứng im:** xem mục 5.6.
- Xem mẫu ở **5 khung/giây** từng shot TRƯỚC khi đặt máy/động tác/hướng vật bay; ảnh 1 khung/giây bỏ sót chi tiết.

## 7. QA trước khi giao
- Lời ≤ 0,3 s đầu; 185–235 từ/phút; 0 khoảng lặng > 0,35 s; −14 ± 1 LUFS, TP ≤ −1.
- Phụ đề ≤ 3 từ ở ≥ 85 % cụm; tâm y 58–62 %; không che mặt/bộ phận đang giải thích.
- `python3 -I cong_cu/qa_may_nhapnhay.py <khung> 30 "<t0,t1;…>" heat.jpg`: mỗi shot đứng yên ≤ 10 %, tốc độ đẩy ±30 % so mẫu; bản đồ nhấp nháy không có điểm nóng mới (vùng nóng = sửa vật liệu/z-fighting vùng đó).
- Soi 4–6 khung liền nhau ở 100 % tại mép khung cửa/tường và nền xa.
- Ghép **mẫu | bản thử** cùng mốc (`so_sanh*.mp4`) gửi chủ dự án; liệt kê trung thực điểm còn khác.

## 7a. Mở đầu hài & chuyển động mượt (chủ dự án 06/11/2026 — áp dụng mọi tập)
**Shot mở đầu phải có "biểu cảm hài hước" đúng tình huống hook, mỗi tập một kiểu khác nhau** — không chỉ đứng/ngồi. Công thức:
1. **Hành động cơ thể khoa trương** đúng câu hook (rặn, gãi, quạt mồ hôi, bịt mũi, run lạnh…), người run nhẹ (biên độ ≤ 0,012 rad, ~14 rad/s) khi gồng.
2. **Mặt khoa trương** bằng đơn vị face-poseunits (trọng số tới 1,35–1,5): ví dụ rặn = `NoseWrinkler, BrowDown, UpperLidClosed .85, LowerLidUp, CheeksPump, lowerLipUp, UpperLipStretched, MouthPullDown` (+ nhấp nháy cường độ sin 5 rad/s); nhẹ nhõm = `OuterBrowUp, LidClosed .5, MouthPullUp, JawDrop .12`; rồi chuyển sang `ngac_nhien` khi biến cố.
3. **≥ 2 lớp phụ trợ 2D/3D quanh nhân vật**: ruồi 3D cánh đập (nhóm `flyAround`), giọt mồ hôi rơi, sóng mùi xanh, vòng đỏ + vạch gãi, sao lấp lánh… đặt phía sau/cạnh, không che mặt.
4. **SFX riêng cho gag** (ruồi vo ve −17 dB, tiếng rặn −16 dB, gãi…) từ giây 0.
5. **Shot mở đầu PHẢI GÓC RỘNG cho người xem hiểu ngay sự việc (chủ dự án 07/11/2026, E06):** mục tiêu/vật cản và nhân vật cùng trong khung, thấy bối cảnh. Cách chuẩn (như mẫu trampoline): mở sát mục tiêu (cửa sổ, đồ vật bị lấy…) rồi **kéo lùi 0–1,4 s ra toàn cảnh** thấy nhân vật đang làm gì; shot 2 vẫn rộng (toàn thân + vật cản). Cận mặt chỉ dùng SAU khi người xem đã hiểu tình huống (câu khen, phản ứng). Không mở đầu bằng cận mặt/cận tay.
Bảng gag mở đầu đã dùng (không lặp): E03 = rặn + ruồi + mồ hôi + mùi → lá độc → gãi mông. E04 = vươn vai sung sướng → mùi nách xanh, hoa héo, chim rơi, bạn bịt mũi ọe → tự ngửi nách chảy nước mắt. E05 = macro lon bia lạnh → tay bạn chộp mất, bọt văng lên mặt → nhân vật đứng hình, tay với vào khoảng không → bạn ôm lon chạy giơ khoe. E06 = máy sát tường nhìn xuống: nhân vật nhảy tưng tưng dưới cửa sổ, cười nhe răng, nhướng mày lia lịa; bạn hát trong nhà tắm (nốt nhạc, hơi nước).

**Chuyển động mượt (không "giật/vụng"):**
- Dùng `ease = smootherstep` (6x⁵−15x⁴+10x³); chuyển tư thế ≥ 0,5–0,8 s (đứng dậy từ ngồi xổm 0,7 s, quay đầu 0,8 s).
- Không có dao động nhanh > 11 rad/s cho tay/thân (gãi 11, chùi 6–7, vo giấy 8); nhún dùng `(1−cos)/2`, không `|sin|`.
- Clip mocap không được quấn vòng giữa shot: kiểm độ dài clip (07_01 = 2,64 s) và chọn khoảng thời gian nằm trong clip; clip mạnh (120_15) phát chậm 0,7×.
- Dịch chuyển nhân vật dùng ease, không dừng gấp.
- Đồ vật khi đổi tay/đổi chỗ phải nội suy vị trí (`lerpV`), không nhảy.
- QA giật: optical flow phân vị 95 mỗi khung; khung nào > 2,2× trung vị lân cận (trừ điểm cắt ±0,1 s) là chỗ giật → sửa.

## 7a2. Tách màu nhân vật – bối cảnh (chủ dự án 07/11/2026)
- Trang phục nhân vật chính, người bạn, vật lớn trong bối cảnh (lều, nhà, tường) và nền (cỏ/đá) phải **khác nhau rõ về sắc độ (hue) hoặc độ sáng**. Không để áo da nâu đứng trước lều/tường da nâu, áo cam trước lều cam.
- Quy tắc nhanh: nền cỏ xanh → áo nhân vật chính màu ấm rực (cam/đỏ/vàng); nhân vật bạn màu sáng/trắng hoặc tối hẳn; vật lớn (lều, nhà) màu trung tính lạnh (xám xanh, xám đá) hoặc tối hẳn.
- Dùng `loadMH(dir,{tint:{clothes:'#màu'}})` để nhuộm trang phục; vật liệu bối cảnh dùng `color` để kéo về trung tính.
- QA: soi 3–4 khung có nhân vật đứng trước vật lớn; nếu viền người "chìm" vào nền thì đổi màu trước khi render đủ.
- E04: áo chính cam rực, bạn lông cừu trắng, lều xám xanh nhạt, cỏ xanh.

## 7b. Mỗi tập phải MỚI (chủ dự án 06/11/2026)
- Nhân vật mới mỗi tập (spec `nhan_vat/eXX_*.json`): đổi dáng (béo/gầy/cơ bắp), tóc, râu, trang phục hợp kịch bản và "bựa" (khố lông, áo da báo lệch vai, …). **Không dùng quần áo có chữ/logo MakeHuman** (casualsuit06…) — chủ dự án tự xử lý logo sau.
- Bối cảnh mới mỗi tập, hợp kịch bản, không trùng tập trước; tạo texture Magnific riêng cho tập. Bảng đã dùng:
| Tập | Nhân vật | Bối cảnh |
|---|---|---|
| DEMO door | chinh (áo trắng logo), ban (sơ mi xanh than) | chòi đá xám + đồng cỏ ô-liu |
| E03 giấy vệ sinh | e3_chinh (cơ bắp, râu, khố lông thú), e3_ban (béo, áo + khố da báo) | hang đá vàng nâu, bụi rậm, thung lũng rừng |
| E04 khử mùi | e4_chinh (gầy cao, tóc xù, áo ba lỗ + quần đùi da nhuộm cam), e4_ban (lùn mập, tóc buộc, ria, bộ lông cừu trắng) | làng lều xám xanh giữa đồng hoa dại, trưa nắng, lửa trại, cây có chim |
| E05 xe đạp | e5_chinh (gầy cao, râu quai nón, ba lỗ xám, quần đùi caro), e5_ban (lùn béo, hói, ria, kính râm, áo hawaii bạc hà + jean) | phố ngoại ô hiện đại buổi chiều: nhựa đường, vỉa hè, bãi cỏ, nhà vách gỗ nhạt, hàng rào trắng, đoạn đá cuội |
| E06 kính tiềm vọng | e6_chinh (lùn đậm, tóc xoăn dài, ria, mũ tai bèo, áo khoác rêu), e6_ban (cao gầy, afro, mũ tắm), e6_em (em họ nhỏ áo sọc xanh) | sân sau hoàng hôn vàng cam, tường vách gỗ xanh xám, cửa sổ nhà tắm cao kính mờ, sân lát đá, bụi tú cầu |

## 8. Công cụ
`du_an/P02_oddtilt/cai_dat/`: `cai_dat.sh`, `kiem_tra.sh`. `du_an/P02_oddtilt/cong_cu/`: `tex_magnific.py` (ảnh Magnific → texture `_m`), `anh_ghep.py` (ảnh ghép khung), `qa_giat.py` (QA giật), `asr_parakeet.py <$P02_HOME/parakeet> <thư mục mp4> <ra>`, `do_bo_sung.py`, `do_cat.py`, `tong_hop_so_do.py` (phân tích mẫu); `mh_bake.py`, `mh_vai.py`, `mh_doi_mau.py`, `mh_jean_sang.py` (nhân vật); `tex_thuc.py` (texture dự phòng tự sinh); `qa_may_nhapnhay.py` (QA máy + nhấp nháy). `engine/lib/`: `mh.js`, `mocap.js` (+ `armIK`, `legIK` (đạp xe, chạy thủ tục), `rotWorld`, `J`), `face.js`. Demo: `tap/DEMO_door/` (giọng, mốc từ, phụ đề, trộn âm).

## Thay đổi
- v1.4 (07/11/2026): khuôn kịch bản trampoline 9 câu; giọng giữ eleven_turbo_v2_5, stability 0,3 + CHỮ HOA (chủ dự án nghe chọn, thắng bản v3 dù v3 đo rộng cao độ hơn); công cụ `do_giong.py`.
- v1.3 (07/11/2026): đóng gói chuyển tài khoản — `QUY_TRINH_DAY_DU.md`, `cai_dat.sh`/`kiem_tra.sh`, công cụ `tex_magnific.py`, `anh_ghep.py`, `qa_giat.py`; đường dẫn mô hình/MakeHuman qua `$P02_HOME`.
- v1.2.1 (07/11/2026): E05 xe đạp — mẫu cảnh `engine/e5_xe_dap.html` (đồ vật dựng theo tham số + biến hình, lắp ráp bật ra, đồ hoạ khoa học, máy neo theo x + neo điểm nhìn riêng `sh[8]`).
- v1.2 (07/11/2026): thêm mục 1b từ 2 mẫu viral (golf ball, trampoline): hook chơi chữ/động cơ bựa + kết khép vòng, bối cảnh hiện đại, macro đồ vật + biến hình, lắp ráp hiện dần, thất bại ragdoll, đồ hoạ khoa học, máy bay kể chuyện, 1 màu nhấn.
- v1.1 (06/11/2026): mở đầu hài theo tình huống (mặt khoa trương + ruồi/mồ hôi/mùi + SFX), quy tắc chuyển động mượt + QA giật.
- v1.0 (06/11/2026): chủ dự án duyệt bản thử 8; gom toàn bộ cách dựng/chuyển động/âm thanh đã sửa thành chuẩn; cảnh mẫu `MAU_CANH_CHUAN.html`; công cụ QA `qa_may_nhapnhay.py`; phụ đề 1080.
- v0.6: chống nhấp nháy (z-fighting, nền xa). v0.5: máy chéo ¾ + parallax; rèm bay cả tấm. v0.4: máy luôn chuyển động + ngưỡng đo. v0.3: máy mở đầu góc rộng, hướng x, rèm trùm tường, bỏ GTAO, 1080 + MSAA. v0.2: chuỗi MakeHuman/mocap/biểu cảm/texture Magnific/SFX. v0.1: phân tích 14 mẫu.
