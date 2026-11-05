# PHÂN TÍCH VIDEO MẪU 03 — Đồng hồ báo thức
File: `How.you.invented.the.alarm.clock.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 e53837d2
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 36,64 s / 720×1280 (9:16) / 24,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,8 dBFS / 2,8 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -22,1 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 158,0 / 80,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,53 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You love your cock, but it keeps waking you at 5am. So you, being a genius caveman, move it further from your cave. But now you sleep in too late. So you stick a nail in a candle which melts and drops the nail, waking you up. Clever! Except you need a new candle every night. So you swap it for a gear mechanism which at the right moment makes a little hammer ring a bell. But you don't always want to get up at the same time. So you add a dial to change the time. Except you realize the little bell is too quiet. So you connect it to the siren at your nuclear power plant. Now the whole town wakes up with you!

- 126 từ; lời từ 0,0 s đến ≈35,87 s; **211,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 1,7 s (5%), 8,2 s (22%), 15,3 s (42%), 22,5 s (61%), 27,5 s (75%) → **5 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 5,04 s (14%) [ĐO].
- Câu khen ngắn chen giữa: genius (5,0 s), Clever! (14,5 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: "cock" = gà trống (chơi chữ). Nhà máy hạt nhân là giải pháp leo thang cuối. fps 24 (khác các video 30 fps) [ĐO].

## 2. Hình ảnh [QS]
- Bối cảnh: Hang đá xám có cửa nhìn ra đồng lúc bình minh; bãi cỏ xanh trống trải (nền phẳng, ít chi tiết); trong hang ánh nến đỏ cam; cuối: nhà máy hạt nhân với biển phóng xạ vàng + làng chòi rơm.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 158,0, sáng 80,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam tiền sử râu quai nón dài, tóc dài, bộ đồ lông nâu phủ kín người. Con gà trống đỏ cách điệu (thân gỗ sọc, mắt to).
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 20 shot; độ dài trung vị **1,63 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 44,4% · đẩy vào 46,5% · lùi 4,6% · lia ngang 2,1% · lia dọc 0,5% · tốc độ trung vị 3,4 px/s, p90 29,3 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–4,0 | You LOVE your cock → wakes you at 5am | Nhân vật vuốt ve gà trống, tim đỏ 2D bay lên; cắt sang cửa hang lúc bình minh, gà gáy (vòng sóng âm) | trung cảnh, máy đứng | "LOVE" viết hoa; icon tim | hook nước đôi | [QS] mốc lời [ĐO] |
| 4,0–10,0 | move it further → sleep in too late | Ôm gà đi xa trên đồng cỏ (toàn cảnh rất xa); ngủ, chữ Z bay | toàn cảnh xa, máy đứng | Zzz 2D | vấn đề 1 | [QS] mốc lời [ĐO] |
| 10,0–15,3 | nail in a candle → "Clever!" | Cận nến cắm đinh trên đĩa kim loại, đinh rơi; nhân vật bật dậy | cận, nhiều cắt ngắn 0,3–0,6 s | vòng sóng âm trắng | giải pháp 2 | [QS] mốc lời [ĐO] |
| 15,3–22,5 | new candle every night → gear mechanism hammer rings bell | Cắt nhanh liên tiếp các cận nến; bảng cơ cấu bánh răng vàng + quả lắc; búa gõ chuông | cận vật đứng yên, cắt dồn | phụ đề trắng 1–3 từ | giải thích cơ chế | [QS] mốc lời [ĐO] |
| 22,5–30,7 | dial to change time; bell too quiet | Mặt số có dấu thời gian; nhân vật ngủ vùi, Zzz | trung cảnh giường | phụ đề trắng 1–3 từ | vấn đề 3–4 | [QS] mốc lời [ĐO] |
| 30,7–36,6 | siren at your nuclear power plant → whole town wakes up with you! | Dây nối từ đồng hồ → tháp hạt nhân, còi trên cột; làng chòi; nhân vật giơ hai tay, lấp lánh 2D | lia/cẩu lên tháp; trung cảnh kết | sparkles | leo thang phi lý + kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–1,62 | 1,62 | You love your cock, |
| 2 | 1,62–3,96 | 2,33 | but it keeps waking you at 5am. |
| 3 | 3,96–6,33 | 2,38 | So you, being a genius caveman, |
| 4 | 6,33–7,62 | 1,29 | move it further from your cave. |
| 5 | 7,62–8,04 | 0,42 |  |
| 6 | 8,04–10,0 | 1,96 | But now you sleep in too late. |
| 7 | 10,0–15,08 | 5,08 | So you stick a nail in a candle which melts and drops the nail, waking you up. Clever! |
| 8 | 15,08–15,38 | 0,29 |  |
| 9 | 15,38–15,92 | 0,54 | Except you |
| 10 | 15,92–16,54 | 0,63 | need a new candle |
| 11 | 16,54–17,17 | 0,62 | every night. |
| 12 | 17,17–19,42 | 2,25 | So you swap it for a gear mechanism |
| 13 | 19,42–21,0 | 1,58 | which at the right moment makes |
| 14 | 21,0–25,0 | 4,0 | a little hammer ring a bell. But you don't always want to get up at the same time. |
| 15 | 25,0–27,42 | 2,42 | So you add a dial to change the time. |
| 16 | 27,42–30,75 | 3,33 | Except you realize the little bell is too quiet. |
| 17 | 30,75–31,62 | 0,88 | So you connect it to |
| 18 | 31,62–33,58 | 1,96 | the siren at your nuclear power plant. |
| 19 | 33,58–35,0 | 1,42 | Now the whole town wakes |
| 20 | 35,0–36,64 | 1,64 | up with you! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈749,0–787,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈39,0 px [ĐO]; rộng trung vị 234,0 px, tối đa 308,0 px / 720 [ĐO].
- 52 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 21,0%, 2 từ 40,0%, ≥3 từ 38,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 211,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 175,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -38,6 dBFS so với lời -19,8 dBFS → nền thấp hơn lời ≈19,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,11 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~6,1 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 1,7 s (5%), 8,2 s (22%), 15,3 s (42%), 22,5 s (61%), 27,5 s (75%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
