# Tài nguyên NFL/NCAA — P01 Sport USA (chuẩn bị 22/11/2026)

Bản đồ tài nguyên cho chat NFL/NCAA: có gì dùng lại được, còn thiếu gì, và dựng môi trường thế nào. NBA làm ở chat riêng, nên không liệt kê ở đây.

## 1. Dựng môi trường (một lệnh)

```bash
bash du_an/P01_sport_usa_whatif/cong_cu/chuan_bi_moi_truong_nfl.sh            # repo ở thư mục hiện tại; gói KIT (nếu có) ở /root/work/kit
```

Script này chạy lại nhiều lần vẫn an toàn. Nó làm các việc sau:
- Tạo `/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO` và `/root/work/engine` dưới dạng **liên kết vào repo**, nên mọi sửa đổi đi thẳng vào git.
- Chạy `npm install`, rồi chạy bản vá motion blur **một lần** (đánh dấu bằng `node_modules/.va_patched`).
- Cài `melt` và các thư viện Python: opencv, librosa, faster-whisper, yt-dlp.
- Tải mô hình Whisper `small.en`.
- Tải 4 kho âm thanh CC0, rồi chép SFX Magnific và tiếng thú của các tập vào `/root/work/assets/audio`.
- Chép FBX Mixamo từ gói KIT nếu có.
- Cuối cùng tự kiểm tra: đủ 4.425 file âm thanh, đủ 10 FBX, render thử 2 khung E25 và chạy `qa_ground` (phải ra 0 khung lún).

**Kết quả lần chạy 22/11/2026** (máy đám mây 4 CPU, 15 GB RAM, không GPU):

| Hạng mục | Kết quả |
|---|---|
| node 22, ffmpeg, melt 7.22, Playwright/Chromium | ok |
| three r170 đã vá motion blur | ok |
| Âm thanh theo chỉ mục | 4.425/4.425 file |
| Whisper small.en | ok |
| Render E25 540×960 | 1,86 s/khung |
| `qa_ground` E25 | 0 khung lún |
| **FBX Mixamo** | **THIẾU cả 10 file**: Sprint, Running, Jogging, Run_To_Stop, Slow_Jog_Backwards, Quarterback_Pass, Receiver_Catch, Football_Catch, Football_Hike, Field_Goal |

**Vì sao thiếu FBX Mixamo:** đây là tệp của Adobe, nên không đưa lên GitHub. `lib/nhanvat2.js` âm thầm bỏ qua các tệp thiếu, nên cảnh vẫn render được, nhưng cầu thủ mất dáng chạy, ném, bắt bóng và sút người thật. **Mọi tập có cầu thủ chạy, ném hay bắt bóng đều cần các tệp này.** Cách lấy lại, chọn một trong hai:
- Đính kèm `AbsurdPlay_SportUSA_KIT_v3.0.zip`, giải nén vào `/root/work/kit`, rồi chạy lại script.
- Tải lại từ mixamo.com: FBX Binary, Without Skin, 30 fps, chọn In Place cho các clip vòng lặp. Đặt vào `engine/assets/mixamo/<Tên>.fbx`.

## 2. Bối cảnh sân đã có (`engine/lib/`)

| Tệp | Bối cảnh | Đã dùng ở |
|---|---|---|
| `svd.js` | sân vận động kiểu truyền hình, khán đài bát 3 tầng, băng LED | E01 |
| `santap.js` | mặt sân chuẩn: gốc toạ độ, vạch vôi GL ở phía +x; các sân khác dựng quanh nó | E25, E27 |
| `sanbaltimore.js` | sân lộ thiên ban đêm, ghế tím, đèn pha tắt được | E20 |
| `sansf.js` | biến thể của sanbaltimore cho vùng Vịnh | E22 |
| `sandallas.js` | sân mái vòm có màn hình treo giữa sân | E23 |
| `sanbuffalo.js` + `khandaibuffalo.js` + `tuyet.js` | sân lộ thiên mùa đông, mái canopy, tuyết phủ | E24 |
| `sansong25.js` | sân nổi trên sông rừng lúc hoàng hôn, fan đứng trên nhà sàn | E25 |
| `sanrom27.js` | Harvest Bowl giữa đồng bắp, khán đài kiện rơm | E27 (NCAA) |
| `santhuong.js` | sân trên sân thượng toà nhà ở New York | E12 |
| `nhacowboys.js` | sân mái vòm biến thành phòng khách | E19 |
| `baixe.js` · `sanbay.js` · `rungthong.js` · `trangtrai.js` · `baixetuyet.js` · `khachsan.js` · `trungtamthuongmai.js` | bối cảnh ngoài sân: bãi xe, sân bay, rừng thông, trang trại, bãi xe tuyết, khách sạn, trung tâm thương mại | E04 · E07 · E10 · E11 · E13/E15/E16 · E14 · E15 |

Quy tắc kênh: **không lặp bối cảnh** giữa các tập. Muốn dùng lại một sân thì phải đổi kiểu sân, giờ trong ngày và khán đài, giống cách E25 và E27 đã làm.

## 3. Nhân vật, động tác, đạo cụ bóng bầu dục

- **Cầu thủ** (`nhanvat2.js`): đồng phục đội gồm sọc tay áo, sọc quần, cổ áo, sọc mũ và lưới chắn mặt, số áo trước và sau. Tóc lấy từ `toc.js`.
- **Tư thế bóng bầu dục** (`bongbau.js`, `tuthe.js`, `dongtac.js`): giao bóng, lùi ném, ném, sút, ăn mừng. Dáng đi và chạy của `dongtac.js` dùng clip `MX_*`, nên cần FBX Mixamo (mục 1).
- **Thư viện động tác UAL1/UAL2 (CC0)**: có sẵn trong repo.
- **Con vật thật cho series mascot:**

| Nguồn | Con vật |
|---|---|
| `assets/meo/tiger.glb`, `assets/meo/jaguar.glb` (Magnific/Tripo, có xương, điều khiển bằng `meoglb25.js`) | hổ, báo đốm |
| `dongvat24.js` (dựng bằng code) | bison, cá heo |
| `thu4chan.js` | hươu, báo, bò |
| `vit.js` | vịt |
| `mascotvk.js` (đạo cụ) | Viking, thợ đào vàng 1849, Titan, máy bay phản lực |

## 4. Âm thanh sân bóng (`/root/work/assets/audio/magnific_sfx`, id `magnific/<tên>`)

Các file dùng cho NFL: `football_hit`, `football_kick`, `ref_whistle`, `stadium_horn`, `stadium_crowd_outdoor`, `crowd_ambience` (nối vòng 12,8 s), `crowd_roar`, `crowd_cheer`, `crowd_boo`, `crowd_gasp`, `crowd_ooh_aah`, `crowd_laugh`, `crowd_chant_defense`, `crowd_clap_rhythm`, `crowd_silence_cough`, `drumline` (ban nhạc NCAA), `organ_charge`, `sad_trombone` (troll), `camera_flashes`.

Các file chỉ dùng cho NBA, bỏ qua: `swish`, `rim_dunk`, `backboard_bang`, `ball_dribble`, `sneaker_squeak`, `airball_chant`, `buzzer`.

Nhạc nền lấy từ `alvana-audio/music`, mỗi tập một bài khác, **không dùng** thư mục `corporate` (giấy phép CC BY). SFX hành động (whoosh, va chạm, riser) tra trong `tai_nguyen/am_thanh/thu_vien_am_thanh.json`.

## 5. Series mascot NFL: 32 đội

Bảng này dùng khi người dùng nói "mascot tiếp theo". Nguyên tắc chọn: tự chọn cặp, không theo lịch, ưu tiên cặp đối lập vui (nước với tuyết, chim với thú, người cổ với máy móc...).

- **Cột "Mascot thật"** chỉ là gợi ý ban đầu. Trước khi viết kịch bản phải xác minh lại mascot, trang phục và màu đội từ nguồn chính thức (trang của đội hoặc sportslogos.net). Không vẽ logo đội.
- **Cột "3D sẵn có"** cho biết đã có mô hình dùng được chưa. Với con vật **chưa có**, làm theo quy trình Magnific: Nano Banana 2 tạo ảnh mẫu (~75 credit), rồi Tripo P1 có xương, 10K mặt (~1.035 credit, **chỉ bấm Generate một lần**).

| Đội | Mascot thật (gợi ý) | 3D sẵn có | Đã làm |
|---|---|---|---|
| Arizona Cardinals | chim hồng y đỏ | chưa | — |
| Atlanta Falcons | chim cắt | chưa | — |
| Baltimore Ravens | quạ đen | chưa | troll E20 |
| Buffalo Bills | bison | `dongvat24.js` | E24 |
| Carolina Panthers | báo đen | có thể nhuộm lại `jaguar.glb` | — |
| Chicago Bears | gấu nâu/xám | chưa | troll E08 |
| Cincinnati Bengals | hổ Bengal | `tiger.glb` | E25 |
| Cleveland Browns | chó (Dawg Pound) / yêu tinh Brownie | chưa | — |
| Dallas Cowboys | cao bồi | trang phục người | E23 |
| Denver Broncos | ngựa hoang | chưa | — |
| Detroit Lions | sư tử | chưa (có thể dùng cách dựng của tiger.glb) | — |
| Green Bay Packers | công nhân đóng gói thịt | trang phục người | troll E11 |
| Houston Texans | chủ trại Texas | trang phục người | — |
| Indianapolis Colts | ngựa non | chưa | — |
| Jacksonville Jaguars | báo đốm | `jaguar.glb` | E25 |
| Kansas City Chiefs | ⚠ nhạy cảm (hình ảnh người bản địa). Chỉ dùng sói KC Wolf | chưa | — |
| Las Vegas Raiders | cướp biển kiểu raider | trang phục người | — |
| Los Angeles Chargers | ngựa chiến kỵ binh / tia điện | chưa | troll E03, E20 |
| Los Angeles Rams | cừu sừng to | chưa | — |
| Miami Dolphins | cá heo | `dongvat24.js` | E24 |
| Minnesota Vikings | chiến binh Viking | `mascotvk.js` | E22 |
| New England Patriots | dân quân Minuteman 1776 | trang phục 1776 (`philly1776.js`) | — |
| New Orleans Saints | ⚠ tránh hình ảnh tôn giáo. Dùng chó Gumbo hoặc nhạc jazz | chưa | — |
| New York Giants | người khổng lồ | trang phục người | — |
| New York Jets | máy bay phản lực | `mascotvk.js` (jet) | troll E12 |
| Philadelphia Eagles | đại bàng đầu trắng | chưa | troll E04 |
| Pittsburgh Steelers | công nhân luyện thép | trang phục người | — |
| San Francisco 49ers | thợ đào vàng 1849 | `mascotvk.js` | E22 |
| Seattle Seahawks | chim ưng biển (osprey) | chưa | — |
| Tampa Bay Buccaneers | cướp biển | trang phục người | troll E06 |
| Tennessee Titans | Titan Hy Lạp | `mascotvk.js` | E23 |
| Washington Commanders | chỉ huy quân đội (mascot Major Tuddy là lợn) | chưa | — |

**Cặp gợi ý chưa làm, tận dụng tài nguyên sẵn có:**
- **Steelers vs Patriots**: lò thép đối đầu dân quân 1776. Dùng trang phục người và `philly1776.js`, không tốn credit 3D.
- **Raiders vs Buccaneers**: trận cướp biển nội chiến. Chỉ cần trang phục người.
- **Panthers vs Lions**: hai con mèo lớn. Panthers nhuộm lại `jaguar.glb`; Lions cần thêm 1 mô hình Magnific.

## 6. Việc của chủ kênh (Claude không tự làm được)

| Việc | Khi nào |
|---|---|
| Đính kèm gói KIT zip (FBX Mixamo) | trước tập đầu tiên có cầu thủ chạy, ném hoặc bắt bóng |
| Tạo giọng "Sport USA" trên Magnific và đính kèm MP3 | sau khi duyệt kịch bản (duyệt lần 1) |
| Tạo tiếng thú trên ElevenLabs (Sound Effects) và đính kèm MP3 | tập mascot có con vật |
| Tạo mô hình con vật mới trên Magnific (Tripo P1) và đính kèm GLB | con vật đánh dấu "chưa" ở mục 5 |
