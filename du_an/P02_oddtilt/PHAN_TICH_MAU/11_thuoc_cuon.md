# PHÂN TÍCH VIDEO MẪU 11 — Thước cuộn
File: `How.you.invented.the.tape.measure.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 0df7769b
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 50,11 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -2,0 dBFS / 3,0 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -19,9 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 135,0 / 117,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,44 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You've pulled it out and now it won't go back in. There's a massive measuring strip across your floor and rolling it up by hand is taking too long for your lazy ass. So you wind it onto a reel and put the reel inside a case, which works, but you still have to turn it yourself and you complain it's too much effort. So you connect the reel to a coiled spring, but you crash out because the piece of shit keeps retracting while you're trying to read it. So you add a sliding lock that presses against the tape and holds it still. Now you need the far end to stay on the thing you're measuring and stop fucking sliding everywhere! So you bend a little hook onto the tip to hold it at the end. But it keeps going limp whenever you lift it up. So your genius mind curves the metal tape across its width so it can stick out further without immediately flopping. Congratulations! You've invented the retractable tape measure.

- 175 từ; lời từ 0,0 s đến ≈49,39 s; **213,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 14,1 s (28%), 21,0 s (42%), 37,2 s (74%) → **3 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 40,0 s (80%) [ĐO].
- Câu khen ngắn chen giữa: genius (40,0 s), Congratulations! (46,0 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 46,0 s (92%) [ĐO].
- Đặc biệt: Toàn bộ là chuỗi ẩn ý tình dục ("pulled it out", "won't go back in", "goes limp"). Máy đứng yên nhiều (48,5% khung) [ĐO].

## 2. Hình ảnh [QS]
- Bối cảnh: Phòng khách hiện đại ấm: thảm đỏ hoa văn vàng, sàn gỗ, sofa xanh lục, tranh hoàng hôn, kệ sách, chậu cây.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 135,0, sáng 117,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam hiện đại áo thun xám, quần jean, quỳ gối; biểu cảm nhăn nhó ở câu chửi.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 16 shot; độ dài trung vị **3,06 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 48,5% · đẩy vào 12,3% · lùi 0,3% · lia ngang 3,2% · lia dọc 2,9% · tốc độ trung vị 3,1 px/s, p90 10,3 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–9,4 | You've pulled it out and now it won't go back in… lazy ass | Nhân vật kéo dải thước dài khắp sàn; siêu cận vạch số | toàn → siêu cận | phụ đề trắng 1–3 từ | hook nước đôi | [QS] mốc lời [ĐO] |
| 9,4–18,3 | wind onto reel, put in a case… too much effort | Cuộn gỗ xám; vỏ đỏ tròn; nhân vật quay tay | cận vật | phụ đề trắng 1–3 từ | giải pháp 1–2 | [QS] mốc lời [ĐO] |
| 18,3–25,1 | coiled spring; crash out, piece of shit keeps retracting | Mặt cắt lò xo xoắn vàng; nhân vật giật mình | cận mặt cắt | highlight xanh lá | vấn đề | [QS] mốc lời [ĐO] |
| 25,1–37,2 | sliding lock; far end slides → fucking → hook on tip | Khoá trượt; thước trượt trên bàn; móc xanh lá ở đầu thước | cận | "FUCKING" hoa | vấn đề 3–4 | [QS] mốc lời [ĐO] |
| 37,2–46,0 | goes limp whenever you lift it → curve the metal across width | Thước rủ xuống; cận thước cong; thước chìa thẳng ra | cận | phụ đề trắng 1–3 từ | vấn đề cuối | [QS] mốc lời [ĐO] |
| 46,0–50,1 | Congratulations! You've invented the retractable tape measure. | Nhân vật tay chống hông, đầu nghiêng tự mãn | trung cảnh | phụ đề trắng 1–3 từ | kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–2,8 | 2,8 | You've pulled it out and now it won't go back in. |
| 2 | 2,8–5,6 | 2,8 | There's a massive measuring strip across your floor and |
| 3 | 5,6–9,47 | 3,87 | rolling it up by hand is taking too long for your lazy ass. |
| 4 | 9,47–11,3 | 1,83 | So you wind it onto a reel and |
| 5 | 11,3–13,2 | 1,9 | put the reel inside a case, |
| 6 | 13,2–18,37 | 5,17 | which works, but you still have to turn it yourself and you complain it's too much effort. |
| 7 | 18,37–18,9 | 0,53 | So you |
| 8 | 18,9–20,9 | 2,0 | connect the reel to a coiled spring, |
| 9 | 20,9–25,07 | 4,17 | but you crash out because the piece of shit keeps retracting while you're trying to read it. |
| 10 | 25,07–29,2 | 4,13 | So you add a sliding lock that presses against the tape and holds it still. |
| 11 | 29,2–34,17 | 4,97 | Now you need the far end to stay on the thing you're measuring and stop fucking sliding everywhere! |
| 12 | 34,17–37,3 | 3,13 | So you bend a little hook onto the tip to hold it at the end. |
| 13 | 37,3–40,97 | 3,67 | But it keeps going limp whenever you lift it up. So your genius mind |
| 14 | 40,97–43,0 | 2,03 | curves the metal tape across its width |
| 15 | 43,0–46,0 | 3,0 | so it can stick out further without immediately flopping. |
| 16 | 46,0–50,11 | 4,11 | Congratulations! You've invented the retractable tape measure. |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–788,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 254,0 px, tối đa 419,0 px / 720 [ĐO].
- 73 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 16,0%, 2 từ 44,0%, ≥3 từ 40,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 213,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 155,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -35,3 dBFS so với lời -20,1 dBFS → nền thấp hơn lời ≈15,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,06 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~12,5 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 14,1 s (28%), 21,0 s (42%), 37,2 s (74%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
