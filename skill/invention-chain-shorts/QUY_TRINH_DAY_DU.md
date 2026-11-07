# QUY TRÌNH CHUẨN ĐẦY ĐỦ — Dự án P02 "How you invented …" (bản 1.0, 07/11/2026)

> **File này dành cho Claude ở bất kỳ tài khoản/máy nào.** Đọc hết file này + `SKILL.md` (cùng thư mục) trước khi làm. Hai file này đủ để làm một tập mới từ đầu đến khi giao video, kể cả khi không có lịch sử trò chuyện cũ. Trả lời chủ dự án **bằng tiếng Việt**.
>
> Quan hệ các file: `SKILL.md` = luật phong cách (kịch bản, màu, mở đầu hài, độ mượt, các bảng "đã dùng"). File này = **các bước thao tác + lệnh chạy + cài đặt + chuyển tài khoản**. Có mâu thuẫn thì `SKILL.md` và yêu cầu mới nhất của chủ dự án thắng.

---

## Mục lục
0. Tóm tắt 1 phút
1. Những gì cần có (và cái gì chủ dự án phải tự thêm)
2. Cài đặt trên máy/tài khoản mới
3. Bản đồ thư mục
4. Luật làm việc với chủ dự án
5. Quy trình 1 tập — 14 bước, kèm lệnh
6. Viết cảnh 3D (engine) — cấu trúc & mẹo
7. QA bắt buộc trước khi giao
8. Chi phí & thời gian tham khảo
9. Lỗi hay gặp
10. Câu lệnh khởi động cho tài khoản mới
11. Lịch sử tập đã làm

---

## 0. Tóm tắt 1 phút
- **Sản phẩm:** video dọc 1080×1920, 30 fps, 30–40 s, tiếng Anh, giọng kể ngôi "you" kể cách "bạn" phát minh một đồ vật qua 4–5 lần hỏng–sửa, hài "bựa" (ass/shit/balls, 1 lần "fucking"), kết khép vòng gọi lại câu mở. Mẫu: kênh TikTok @oddtilt (16 video phân tích trong `du_an/P02_oddtilt/PHAN_TICH_MAU/`).
- **Cách làm:** 3D tự dựng bằng **three.js r170** trong trình duyệt headless (Playwright) → khung JPEG → ffmpeg ghép giọng/nhạc/SFX/phụ đề. Nhân vật **MakeHuman** (CC0) + chuyển động **CMU mocap** + IK tay/chân + biểu cảm mặt. Giọng, SFX, texture tạo bằng **Magnific** (connector MCP, tài khoản chủ dự án). Chép lời lấy mốc từ bằng **Parakeet** (sherpa-onnx, chạy offline).
- **Kho:** GitHub `mailcontentnba76-cell/absurdplay-kit`, **nhánh `du-an-moi`** (kho công khai). Thư mục dự án: `du_an/P02_oddtilt/`.
- **Tập đã làm:** DEMO door (duyệt), E03 giấy vệ sinh, E04 khử mùi, E05 xe đạp (mẫu cảnh mới nhất: `engine/e5_xe_dap.html`).

## 1. Những gì cần có
### 1a. Chuyển được bằng file/git (Claude tự lo)
| Thứ | Ở đâu | Ghi chú |
|---|---|---|
| Code engine, cảnh từng tập, công cụ Python | git `du-an-moi` | `engine/*.html`, `engine/lib/*.js`, `cong_cu/*.py`, `tap/*/cong_cu/*` |
| Nhân vật đã nướng, texture, mocap CMU, HDRI, font | git `du-an-moi` (`engine/assets`, `engine/fonts`) | ≈ 240 MB, đã trong git |
| Kịch bản, mốc lời (`words.json`), phụ đề `.ass` | git `tap/E0x_*/` | |
| Phân tích 16 mẫu, skill, nhật ký lỗi/phiên bản | git | |
| Video mẫu 14 cái | GitHub Release `mau-oddtilt` | 2 mẫu viral (golf ball, trampoline) **chưa có trong Release** — xem 1b |
| Mô hình Parakeet, dữ liệu MakeHuman, node_modules | tải lại bằng `cai_dat.sh` | không để trong git (nặng, tải lại được) |

### 1b. Chủ dự án phải tự thêm/kết nối (Claude chỉ đề xuất, không tự làm được)
| # | Việc | Vì sao | Cách làm |
|---|---|---|---|
| 1 | **Gói âm thanh** `AbsurdPlay_P02_am_thanh.zip` (SFX + nhạc + giọng gốc E05) | `.mp3/.wav` bị `.gitignore` chặn, kho lại công khai nên không đẩy nhạc lên | Đính kèm zip vào phiên mới, hoặc tải lên nơi riêng tư; Claude giải nén vào `du_an/P02_oddtilt/` |
| 2 | **Kết nối Magnific** (connector MCP) ở tài khoản Claude mới, đăng nhập đúng tài khoản Magnific có credit | tạo giọng, SFX, texture | claude.ai → Settings → Connectors → Magnific |
| 3 | **Giọng "Odd Tilt"** (giọng clone, voiceId 197595, source `mine`) | voiceId chỉ tồn tại trong tài khoản Magnific đã tạo nó | Cùng tài khoản Magnific → dùng luôn. Khác tài khoản → clone lại trong Magnific từ `am_thanh/giong_goc_E05.mp3` (trong gói âm thanh), đặt tên "Odd Tilt", báo Claude voiceId mới |
| 4 | **GitHub**: kết nối và cấp quyền repo `absurdplay-kit` | Claude lưu tiến độ (commit/push) cuối mỗi tập | claude.ai → Settings → GitHub; phiên Claude Code cloud chọn repo này |
| 5 | **Mạng cho phép** (nếu dùng Claude Code cloud có giới hạn mạng) | tải file Magnific, mô hình, trình duyệt | thêm host `pikaso.cdnpk.net`; giữ bật "package managers" (npm, PyPI); github.com tải Release mặc định được. Nếu không có Chromium cài sẵn: cho phép `cdn.playwright.dev`, `playwright.download.prss.microsoft.com` |
| 6 | **2 video mẫu viral** (golf ball, trampoline) | chỉ có trong phiên cũ | tải lên Release `mau-oddtilt` (tuỳ chọn; phân tích đã có trong `PHAN_TICH_MAU/15_*.md, 16_*.md`) |
| 7 | **Bản quyền nhạc** `the_curious_ukulele_conundrum.mp3` | file do chủ dự án cung cấp | chủ dự án tự đảm bảo giấy phép khi đăng |
| 8 | **Nghe thử** | Claude không nghe được âm thanh | chủ dự án nghe bản giao, góp ý giọng/SFX/nhạc |

### 1c. Yêu cầu máy
Linux hoặc macOS · Node.js ≥ 18 · Python ≥ 3.10 · ffmpeg có libass · ≈ 3 GB đĩa trống (mô hình 630 MB, MakeHuman 260 MB, khung render 1080p ≈ 1,2 GB/tập) · CPU đủ để render (không cần GPU; ≈ 2,2 s/khung 1080p/tiến trình, chạy 3 tiến trình song song).

## 2. Cài đặt trên máy/tài khoản mới
```bash
git clone https://github.com/mailcontentnba76-cell/absurdplay-kit -b du-an-moi
cd absurdplay-kit
bash du_an/P02_oddtilt/cai_dat/cai_dat.sh        # pip + npm + Playwright + Parakeet + MakeHuman (chạy lại an toàn)
unzip AbsurdPlay_P02_am_thanh.zip -d du_an/P02_oddtilt/   # gói âm thanh chủ dự án gửi
bash du_an/P02_oddtilt/cai_dat/kiem_tra.sh --render       # in OK/THIẾU + cách bổ sung, render thử 1 khung
```
- Mặc định mô hình và MakeHuman nằm ở `~/.p02/` (đổi bằng biến `P02_HOME`). Các lệnh dưới đây dùng `$P02_HOME` → nếu không đặt, thay bằng `~/.p02`.
- Mục nào `THIẾU` thì làm theo gợi ý in ra; mục ngoài shell (Magnific, giọng clone, quyền push GitHub) Claude kiểm bằng công cụ của mình: gọi `account_balance` và `audio_voices_list` của Magnific; `git push` thử.
- Claude Code cloud: có thể lưu `cai_dat.sh` thành *setup script* của môi trường để mỗi phiên mới tự cài.

## 3. Bản đồ thư mục (`du_an/P02_oddtilt/`)
```
HO_SO_DU_AN.md            hồ sơ, thông số đích
PHAN_TICH_MAU/            01–14 mẫu thường, 15 golf ball + 16 trampoline (mẫu viral), TONG_HOP.md, NHAN_VAT.md
KICH_BAN/                 Y_TUONG_DOT1..4.md (các đợt ý tưởng đã đề xuất), PHAN_TICH_HOOK.md
NHAT_KY_LOI.md            mọi lỗi đã gặp + cách phòng (đọc trước khi dựng)
NHAT_KY_PHIEN_BAN.md      lịch sử phiên bản
cai_dat/                  cai_dat.sh, kiem_tra.sh
cong_cu/                  asr_parakeet.py, mh_bake.py, mh_vai*.py, mh_doi_mau.py, tex_magnific.py, anh_ghep.py, qa_giat.py, qa_may_nhapnhay.py, phan tích mẫu…
nhan_vat/                 spec nhân vật *.json + vai/ (texture vải tự vẽ)
engine/                   render.js, lib/ (mh.js, mocap.js, face.js…), cảnh *.html, assets/, fonts/
tai_nguyen/sfx, nhac/     âm thanh (KHÔNG có trong git — từ gói âm thanh); sfx/README.md liệt kê từng tiếng
tap/E0x_<ten>/            KICH_BAN.md, am_thanh/ (giong.wav, words.json, mix.wav), phu_de_1080.ass, cong_cu/tron_am.py
tap/DEMO_door/cong_cu/    tao_phu_de.py (dùng chung mọi tập)
```

## 4. Luật làm việc với chủ dự án (đã chốt, áp dụng mãi)
1. **Tự quyết kỹ thuật, làm tiếp không chờ** ("từ giờ tôi luôn cho phép bạn chấp nhận mọi thứ để xử lí"). Chỉ hỏi trước khi: tiêu nhiều credit Magnific (> ~1 000 credit/lần), xoá dữ liệu, đăng/chia sẻ ra ngoài.
2. **Hai điểm dừng chờ duyệt:** (a) đề xuất 3 kịch bản → chờ chọn; (b) giao video → chờ góp ý. Ngoài ra không dừng.
3. **Giọng văn "bựa"** như mẫu; **mỗi tập phải MỚI**: đồ vật, nhân vật (dáng, tóc, trang phục), bối cảnh, gag mở đầu — không trùng bảng "đã dùng" trong `SKILL.md` mục 7a/7b. Không logo/chữ MakeHuman trên quần áo.
4. **Màu tách bạch:** nền trung tính, nhân vật khác màu nền/nhà, **chỉ 1 màu rực = đồ vật phát minh** (`SKILL.md` 7a2 + 1b).
5. **Mở đầu hài** (mặt khoa trương + gag hình + SFX), **chuyển động mượt** (smootherstep, không giật pose) — `SKILL.md` 7a.
6. **Không sao chép video kênh khác để đăng**; không dùng dấu hiệu kênh mẫu (tháp làm mát hạt nhân).
7. Báo cáo trung thực bằng số đo; cái gì chưa kiểm nói chưa kiểm. Cuối mỗi tập: commit + push (trừ mp4/wav/mp3), cập nhật nhật ký + bảng "đã dùng" trong skill.

## 5. Quy trình 1 tập — 14 bước
Đặt biến cho gọn (ví dụ tập E06): `P=du_an/P02_oddtilt; T=$P/tap/E06_<ten>; mkdir -p $T/am_thanh $T/cong_cu`.

**B1. Ý tưởng (dừng chờ duyệt).** Viết `KICH_BAN/Y_TUONG_DOT<n>.md` gồm 3 đề xuất theo `SKILL.md` mục 1 + 1b:
- Hook kiểu E (chơi chữ tên đồ vật) hoặc F (động cơ bựa, đồ vật chỉ là phương tiện) hoặc B/D (cơ thể/toilet); kết khép vòng ("Now your friend…/Now you can … every day!").
- 4–5 vòng "But/Except … so you …", mỗi cải tiến là **bước lịch sử có thật** của đồ vật; nguồn lỗi leo thang (bạn phản đòn → cơ thể → đau → người thứ ba); 1–2 câu khen ("Clever!/Genius!"); 1 câu "Now when you…" giải thích cơ chế (dựng đồ hoạ khoa học).
- **125–135 từ** (≈ 34–37 s ở 220 từ/phút). Đếm từ trước khi đề xuất.
- Mỗi đề xuất ghi: mở đầu hài, thất bại thấy được, đồ vật biến hình (macro), đồ hoạ khoa học, màu nhấn, nhân vật, bối cảnh. Ghi ★ cho đề xuất khuyên chọn + lý do.
- Không trùng đồ vật đã làm/16 mẫu (ghế, điều hoà, đồng hồ báo thức, bút bi, giường, cửa, quạt, kẹp hạt, lò quay, vòi sen, thước cuộn, bồn cầu, ô, bóng rổ, bóng golf, bạt nhún, lều, cửa sổ, giấy vệ sinh, khử mùi, xe đạp).

**B2. Giọng (Magnific).** `account_balance` trước. Gọi `audio_tts`:
`{text:<lời có CHỮ HOA ở từ đắt + "..." + [excited] trước "Genius!" + [mischievously] trước câu kết>, voiceId:197595, source:"mine", model:"eleven_v3", stability:0, speed:1}` (≈ 160 credit; giọng nhấn nhá như mẫu viral — `SKILL.md` mục 4.0). Đo lại bằng `python3 cong_cu/do_giong.py giong.wav words.json ten` (dải cao độ ≥ 14 bán cung) → `creations_wait` → tải URL:
`curl -sSf -o $T/am_thanh/giong_goc.mp3 '<url>'` (cần mạng tới `pikaso.cdnpk.net`).

**B3. Rút nghỉ + chỉnh tốc độ.**
```bash
ffmpeg -y -i $T/am_thanh/giong_goc.mp3 -af "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.15:stop_threshold=-45dB:stop_silence=0.12" -ar 44100 /tmp/rut.wav
# atempo = thời lượng /tmp/rut.wav ÷ (số từ / 220 × 60)   — ví dụ E05: 39,33 / 36,8 = 1,07
ffmpeg -y -i /tmp/rut.wav -af atempo=<hệ số> $T/am_thanh/giong.wav
```

**B4. Mốc từ (Parakeet).** Công cụ đọc thư mục video `*.mp4`:
```bash
mkdir -p /tmp/asr/v; ffmpeg -y -i $T/am_thanh/giong.wav -f lavfi -i color=black:s=16x16:r=1 -shortest -c:a aac /tmp/asr/v/giong.mp4
python3 $P/cong_cu/asr_parakeet.py $P02_HOME/parakeet /tmp/asr/v /tmp/asr
cp /tmp/asr/giong.json $T/am_thanh/words.json
```
Kiểm: số từ khớp lời, từ cuối có dấu câu (sửa tay nếu thiếu: `"seconds!"`), không có từ rác cuối ("Uh" → cắt đuôi wav rồi chạy lại). Nếu ASR bỏ sót câu cuối: cắt đoạn đuôi chạy riêng rồi nối mốc.

**B5. Phụ đề.** `python3 $P/tap/DEMO_door/cong_cu/tao_phu_de.py $T/am_thanh/words.json $T/phu_de_1080.ass` (cụm 1–3 từ, Poppins ExtraBold, y ≈ 60 %).

**B6. Chia shot theo mốc lời.** Mỗi mệnh đề "So you / But / Except / Now / Clever!" = ≥ 1 shot; 15–20 shot, trung vị 1,5–2,5 s. Ghi bảng shot vào `$T/KICH_BAN.md` (thời điểm từ `words.json`). Shot nhanh hơn ở chỗ gag, shot macro đồ vật ở mỗi cải tiến.

**B7. SFX (Magnific).** Liệt kê tiếng mới cần (vật/hành động của tập). `audio_sfx_generate {prompt:"<nguồn âm, bề mặt, góc nghe>", durationSeconds:1–3}` (5–15 credit/tiếng) → tải về `tai_nguyen/sfx/<ten_khong_dau>.mp3` → thêm dòng vào `tai_nguyen/sfx/README.md`. Dùng lại tiếng chung: `whoosh` (cắt cảnh), `ding` (câu khen), `uh_oh` ("But/Except"), `van_go`, `bung_reu`, `nga_xe`, `xich_xe`, `chuong_xe`, `giat_lon_bia`, `bom_lop`, `xoc_rang`…

**B8. Nhân vật mới.** Viết `nhan_vat/eXX_chinh.json`, `eXX_ban.json`:
```json
{"name":"eXX_chinh","gender":1,"age":"young|old","muscle":0–1,"weight":0–1,"height":0–1,"race":{"caucasian":.8,"asian":.2},
 "skin":"young_caucasian_male/young_caucasian_male.json",
 "proxies":[{"p":"clothes/Tank_Top_01/Tank_Top_01.json","map":"vai/<vải>.png"},"clothes/shoes02/shoes02.json","hair/short04/short04.json","hair/Full_beard/Full_beard.json",
            "eyebrows/eyebrow001/eyebrow001.json","eyelashes/Eyelashes01/Eyelashes01.json","eyes/HighPolyEyes/HighPolyEyes.json"],"eye_texture":"blue|brown|green"}
```
- Quần áo có sẵn: `ls $P02_HOME/makehuman-data/package/public/data/proxies/clothes` (Tank_Top_01, ShortJeans, male_casualsuit01–05, Sleeveless, short_tail_camo_tee, Harvey_*, shoes01–06, glasses, Fishing_Hat_01…). **Tránh male_casualsuit06** (logo MAKEHUMAN). Tóc: short01–04, afro01, ponytail01, Full_beard, Moustache, curly…
- Vải riêng: viết script vẽ texture như `cong_cu/mh_vai_e5.py` (vải trơn có nhiễu, caro, hoạ tiết hawaii thay đúng vùng áo trên atlas). `"keepNormal":true` để giữ nếp vải gốc.
- Nướng: `for n in eXX_chinh eXX_ban; do python3 -I $P/cong_cu/mh_bake.py $P02_HOME/makehuman-data/package/public/data $P/nhan_vat/$n.json $P/engine/assets/mh; done`
- Trong cảnh: `loadMH('./assets/mh/eXX_chinh',{heightM:1.86})` (cao thật, mét). Có thể `tint:{clothes:'#hex'}`.

**B9. Texture + phông (Magnific).** Prompt mẫu: `"Seamless tileable texture, photograph of <vật liệu> seen from directly above, even diffuse lighting"`, `aspectRatio:"1:1"` (≈ 65 credit). Phông xa: `"Wide panoramic photo of <bối cảnh> … no people, no text"` 2:1 (≈ 100 credit). Nếu bị chặn nhầm "NSFW" → tự vẽ bằng code (vd vách gỗ ngang). Chuyển đổi:
```bash
python3 -I $P/cong_cu/tex_magnific.py anh.png <ten> <độ nổi 0–6>      # → engine/assets/tex/mag/<ten>_m_col.jpg (+ _m_nrm.jpg)
python3 -I $P/cong_cu/tex_magnific.py phong.png nen_<ten> 0 --goc       # phông: dùng <ten>_col.jpg
```
Dùng bản `_m` cho mọi mặt lặp (chống lấp lánh); cỏ không normal map.

**B10. Viết cảnh.** Sao chép `engine/e5_xe_dap.html` → `engine/eXX_<ten>.html`, thay bối cảnh/đạo cụ/nhân vật/shot (chi tiết mục 6).

**B11. Thử nhanh 360p (lặp đến khi đúng).**
```bash
cd $P/engine
L=$(python3 -c "print(','.join(str(round(x*30)) for x in [x*.5 for x in range(74)]))")   # 2 khung/giây
node render.js "eXX_<ten>.html?w=360" /tmp/t 30 0 1 360 640 $L
python3 -I ../cong_cu/anh_ghep.py /tmp/t /tmp/t.jpg 10 160      # Claude xem ảnh ghép
```
Xem: nhân vật trong khung, mặt thấy được, gag đọc được, màu không trùng, không xuyên vật. Sửa → render lại đúng các khung lỗi. Với động tác nhanh: xem 10 khung/giây quanh chỗ đó.

**B12. Render đủ 360p → QA giật**, rồi render 1080p:
```bash
for a in "0 368" "368 736" "736 1104"; do set -- $a; nohup node render.js "eXX_<ten>.html?w=360" /tmp/r360 30 $1 $2 360 640 > /tmp/l$1 2>&1 & done   # chia đủ số khung = thời lượng×30
python3 -I ../cong_cu/qa_giat.py /tmp/r360 <số khung> "<t_cắt1,t_cắt2,…>"
# sửa các điểm giật không cố ý → render 1080:
export JPEGQ=0.97; for a in "0 368" "368 736" "736 1104"; do set -- $a; nohup node render.js "eXX_<ten>.html?w=1080" /tmp/r1080 30 $1 $2 1080 1920 > /tmp/g$1 2>&1 & done
```
(≈ 15 phút cho 37 s với 3 tiến trình; theo dõi bằng đếm file, kiểm log không có `ERR`/`PAGEERROR`.)

**B13. Trộn âm + xuất.** Sao chép `tap/E05_xe_dap/cong_cu/tron_am.py`, sửa `T`, `DUR`, danh sách `cuts` (whoosh −15 dB tại mỗi cắt −0,15 s) và `cues` (tiếng theo hành động, −8…−16 dB; `ding` −9 dB ở câu khen; `uh_oh` −15 dB ở But/Except). Nhạc −19 dB, loudnorm −14 LUFS.
```bash
python3 -I $T/cong_cu/tron_am.py $T/am_thanh/mix.wav
ffmpeg -y -framerate 30 -i /tmp/r1080/f_%05d.jpg -i $T/am_thanh/mix.wav -vf "ass=$T/phu_de_1080.ass:fontsdir=$P/engine/fonts" \
  -c:v libx264 -crf 15 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart <ra>/EXX_how_you_invented_<x>.mp4
```

**B14. QA + giao + lưu.** Mục 7 đạt → gửi video cho chủ dự án (SendUserFile) + báo cáo tiếng Việt (điểm mới, số đo, điểm còn lại, credit đã dùng). Cập nhật: `tap/EXX/KICH_BAN.md`, `NHAT_KY_LOI.md`, `NHAT_KY_PHIEN_BAN.md`, `SKILL.md` (bảng nhân vật/bối cảnh 7b, bảng gag mở đầu 7a). Commit + push:
```bash
git add -A -- . ':!*.mp4' ':!*.wav' ':!*.mp3' && git commit -m "P02 EXX …" && git push -u origin du-an-moi
```

## 6. Viết cảnh 3D — cấu trúc `engine/e5_xe_dap.html` (mẫu mới nhất)
Một file HTML module, chạy bởi `render.js` (gọi `window.renderFrame(t)` cho từng khung, chờ `window.ready`). Thứ tự trong file:
1. **Renderer:** ACES, sRGB, bóng PCFSoft 2048, HDRI `assets/hdri/park.hdr` (environmentIntensity 0,55) + HemisphereLight + DirectionalLight (bám vùng quay, bước lưới chống rung bóng). Composer MSAA `WebGLRenderTarget(W,H,{samples:4,type:HalfFloatType})` + `OutputPass`. **Không GTAO, không unsharp.**
2. **Bối cảnh:** dải mặt đất bằng `strip(texture,…)`, nhà `house()`, cây `tree()`, rào, phông xa = trụ `CylinderGeometry` BackSide với ảnh phông (MirroredRepeat 4×), `s.background` = màu trời của phông. Mọi khối lệch nhau ≥ 1,5 cm (chống z-fighting).
3. **Đồ vật phát minh dựng theo tham số** (không dùng mô hình tĩnh): trạng thái `B={…}` đặt lại mỗi khung, `drawBike()` tính lại vị trí ống bằng `setTube(mesh,a,b,bán kính,k)`; biến hình = nội suy tham số (bán kính bánh, khung gỗ→đỏ); **bật ra** = `POP(t,t0)` (easeOutBack 0,28 s) đúng lúc danh từ được đọc; chuỗi chi tiết hiện dần (xích `InstancedMesh`, `chainK` 0→1).
4. **Nhân vật:** `loadMH` → `base(ch,yaw)` (tư thế đứng mocap 111_28) → `placeHip(ch,điểm)` → `lean()` → `legIK/armIK` tới đích (bàn đạp, ghi-đông, mặt đất, đồ vật) → `face(ch,t,seed,[biểu cảm,k],…)` (gọi SAU tư thế). Hàm dựng sẵn: `ride()` (đạp xe), `jog()` (chạy thủ tục, hông lắc, tay giơ đồ), `sitChair()`, `standAt()`, ngã úp mặt = xoay `root` quanh trục ngang + đặt hông theo parabol. Biểu cảm: `EXPR.*` + bộ tự định nghĩa (`HOANG, GIAN, KIET, RUNG, SUONG`). Mọi nhân vật luôn cử động + chớp mắt.
5. **Sprite 2D** (canvas): sao, mồ hôi, bụi, bọt, vạch tốc độ, vòng rung, mũi tên cong vàng viền đen, nhãn chữ (`label('x3')` — chỉ ký tự ASCII). Kiểm cái gì nằm sau sprite.
6. **Máy quay** `SH=[[t0,t1, máyA, máyB, nhìnA, nhìnB, fov, neo?, neoNhìn?], …]`: `u = 0,15p² + 0,85p` (shot mở đầu nhẹ hơn ở đầu); `neo(t)` = `V(B.x,0,0)` để bám vật chạy dọc trục x (**chỉ neo x**, toạ độ z/y viết tuyệt đối); `neoNhìn` riêng khi máy đứng yên lia theo. Máy luôn trôi; ¾ góc; macro đồ vật sát đất fov 34–40.
7. **renderFrame(t):** ẩn mọi sprite → đặt lại `B` → nhánh `if(t<…)` cho từng shot theo mốc lời → đặt máy → nắng → `comp.render()`. Bọc `try/catch` in `ERR`.
8. Kiểm tầm với IK (vai→đích ≤ chiều dài tay ≈ 0,3 × chiều cao) để tay không "dừng giữa chừng".

## 7. QA bắt buộc trước khi giao
| Mục | Ngưỡng | Đo bằng |
|---|---|---|
| Thời lượng / lời | 30–40 s; lời bắt đầu ≤ 0,3 s; ≈ 220 từ/phút | `ffprobe`, `words.json` |
| Âm lượng | −14 ± 1 LUFS, True Peak ≤ −1 dBTP | `ffmpeg -af loudnorm=print_format=summary` |
| Giật | 0 điểm giật **không cố ý** (`qa_giat.py`); điểm cố ý (bật ra, ngã, giật đồ) phải xem ảnh xác nhận | `qa_giat.py` + ảnh ghép 10 khung/giây |
| Nhấp nháy | không điểm nóng mới; tối–sáng–tối ≤ 20/10 000 điểm ảnh | `qa_may_nhapnhay.py` |
| Bố cục | mỗi shot: nhân vật/đồ vật trong khung, mặt thấy khi có biểu cảm, phụ đề không che mặt | ảnh ghép 2 khung/giây |
| Màu | nhân vật ≠ nền/nhà; 1 màu nhấn = đồ vật | xem ảnh |
| Mới | nhân vật/bối cảnh/gag không trùng bảng 7a/7b | `SKILL.md` |
| Xem 4 khung 1080p cuối cùng (độ nét, phụ đề) | — | `ffmpeg select` + tile |

## 8. Chi phí & thời gian tham khảo (E05)
Giọng 71 credit · SFX 5–15/tiếng (7 tiếng ≈ 70) · texture 65/ảnh (6 ảnh ≈ 390) · phông 100 → **≈ 650 credit/tập** khi bối cảnh mới hoàn toàn. Thời gian máy: nướng nhân vật 1 phút, thử 360p 1–2 phút/lượt, render 360p đủ ≈ 7 phút, 1080p ≈ 15 phút, mã hoá 1 phút.

## 9. Lỗi hay gặp (đầy đủ trong `NHAT_KY_LOI.md`)
- Neo máy cộng thêm z của vật → nhân vật lệch khung (E05): chỉ neo x.
- IK không với tới → tay dừng ngoài khung (E05): đặt người gần đích.
- Clip mocap quấn vòng giữa shot → bật pose (E04): giữ thời gian clip trong độ dài clip; shot ngồi xổm + IK 2 tay → clip gần đứng yên.
- Texture chi tiết lấp lánh: dùng bản `_m`; cỏ không normal map; lặp vừa phải.
- Z-fighting: lệch mặt ≥ 1,5 cm. GTAO gây sọc: không dùng.
- Ảnh Magnific bị chặn nhầm NSFW (vd "house siding"): đổi chữ hoặc tự vẽ bằng code.
- `gh release download` lỗi GraphQL trong Claude Code cloud: tải bằng `curl -L https://github.com/<owner>/<repo>/releases/download/<tag>/<file>`.
- Lời cuối bị ASR bỏ sót / có "Uh" thừa: cắt đuôi, chạy lại phần đuôi.
- Sprite đè người phía sau (vạch tốc độ): bỏ ở shot có người thứ hai.

## 10. Câu lệnh khởi động cho tài khoản mới
Gửi kèm gói skill (đã cài) + gói âm thanh:
```
Đây là dự án P02 "How you invented …" (mẫu @oddtilt) chuyển từ tài khoản khác. Dùng skill invention-chain-shorts:
đọc QUY_TRINH_DAY_DU.md và SKILL.md trước. Clone repo mailcontentnba76-cell/absurdplay-kit nhánh du-an-moi,
chạy du_an/P02_oddtilt/cai_dat/cai_dat.sh, giải nén file AbsurdPlay_P02_am_thanh.zip đính kèm vào du_an/P02_oddtilt/,
rồi chạy kiem_tra.sh --render. Kiểm tra kết nối Magnific (số dư + giọng "Odd Tilt") và quyền push GitHub.
Liệt kê cho tôi mục nào còn THIẾU và tôi phải tự làm gì. Trả lời bằng tiếng Việt. Xong thì đợi tôi giao việc.
```
Phiên tiếp theo: `"Dự án P02. Đọc QUY_TRINH_DAY_DU.md + SKILL.md + NHAT_KY_LOI.md. Việc hôm nay: <lên 3 ý tưởng tập mới / làm tập theo kịch bản số … / sửa video theo góp ý …>"`.

## 11. Lịch sử tập đã làm
| Tập | Đồ vật | Hook | Thời lượng | Cảnh |
|---|---|---|---|---|
| DEMO | cửa (door) 0–11 s | — | 11 s | `engine/demo_door8.html` (duyệt chuỗi dựng) |
| E03 | giấy vệ sinh | D "took a shit" | 32,9 s | `engine/e3_giay.html` |
| E04 | khử mùi | B "armpits smell like shit" | 30,35 s | `engine/e4_khu_mui.html` |
| E05 | xe đạp | F "friend stole your last beer" | 36,77 s | `engine/e5_xe_dap.html` (mẫu chuẩn hiện tại) |
