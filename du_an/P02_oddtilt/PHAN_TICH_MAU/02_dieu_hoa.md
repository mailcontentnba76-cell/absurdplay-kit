# PHÂN TÍCH VIDEO MẪU 02 — Máy điều hoà
File: `How.you.invented.air.conditioning.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 aaa4d771
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 34,27 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,7 dBFS / 2,0 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -23,2 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 122,0 / 119,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,68 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> Your ass is sweaty, so you bring out your fan. But it just blows hot air at you, so you put ice in front of it. Clever! Except your lazy ass is tired of replacing the ice after it melts, so you replace it with pipes filled with a liquid that absorbs heat from the air. But it's just putting all that heat back into your cave, so you move the hot part outside. Much better. Except now your fat ass friend blocks all the cold air, so you add moving flaps that spread it around. But it works too well and he starts freezing, so you add a thermostat that stops cooling when it reaches a set temperature. Now your friend comes inside every day.

- 126 từ; lời từ 0,0 s đến ≈34,03 s; **222,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 3,0 s (9%), 7,3 s (21%), 15,0 s (44%), 20,9 s (61%), 26,2 s (76%) → **5 vòng vấn đề** [ĐO trên lời].
- Câu khen ngắn chen giữa: Clever! (6,3 s), better. (20,2 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Kết bằng câu nước đôi tình dục ("comes inside"). Tháp làm mát hạt nhân xuất hiện ở khung kết như dấu hiệu chung của kênh [SL].

## 2. Hình ảnh [QS]
- Bối cảnh: Nền vách đá nâu đỏ phân tầng (hang lộ thiên), đất khô cỏ vàng; ngoài hang: cây ô-liu, đồng khô, chòi tròn, 2 tháp làm mát nhà máy điện hạt nhân ở cảnh cuối.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 122,0, sáng 119,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nhân vật dáng nữ, tóc đen dài gợn, váy da thú cam một vai, chân trần. Bạn: nhân vật béo bụng to, áo da nâu, tóc nâu xù.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 11 shot; độ dài trung vị **2,77 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 3,7% · đẩy vào 56,8% · lùi 31,1% · lia ngang 3,5% · lia dọc 2,7% · tốc độ trung vị 37,0 px/s, p90 134,8 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–3,0 | Ass sweaty → bring out fan | Toàn cảnh nhỏ người giữa vách đá; máy đẩy vào nhanh tới trung cảnh | đẩy vào nhanh từ khung 0 | phụ đề trắng 1–3 từ | hook | [QS] mốc lời [ĐO] |
| 3,0–7,3 | blows hot air → ice → "Clever!" | Luồng gió vẽ dạng dải xanh nhạt uốn lượn thổi vào người; đặt thùng đá | trung–cận, lia | đồ hoạ luồng khí 3D | vấn đề 1 | [QS] mốc lời [ĐO] |
| 7,3–15,0 | lazy ass… pipes with liquid absorbs heat | Đá tan; giàn ống tản nhiệt kim loại thay thế; cận giàn quạt lá xanh | cận vật, quỹ đạo vòng | sợi khói cam = nhiệt | giải thích cơ chế | [QS] mốc lời [ĐO] |
| 15,0–20,9 | heat back into cave → move hot part outside → "Much better" | Ống dẫn ra ngoài hang, khói cam bốc ngoài trời; nhân vật ôm đầu thư giãn | lia theo ống ra ngoài | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 20,9–26,2 | fat ass friend blocks air → moving flaps | Bạn béo đứng chắn; cận cửa gió có lá lật | trung cảnh 2 người, cận vật | phụ đề trắng 1–3 từ | vấn đề 3 (bạn) | [QS] mốc lời [ĐO] |
| 26,2–34,3 | too well, freezing → thermostat; "Now your friend comes inside every day." | Bạn run, tóc đóng băng; núm nhiệt; toàn cảnh xa lùi ra thấy 2 tháp hạt nhân | lùi xa kết | phụ đề trắng 1–3 từ | kết chơi chữ "comes inside" | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–4,77 | 4,77 | Your ass is sweaty, so you bring out your fan. But it just blows hot air at you, |
| 2 | 4,77–10,77 | 6,0 | so you put ice in front of it. Clever! Except your lazy ass is tired of replacing the ice after it melts, |
| 3 | 10,77–14,83 | 4,07 | so you replace it with pipes filled with a liquid that absorbs heat from the air. |
| 4 | 14,83–19,83 | 5,0 | But it's just putting all that heat back into your cave, so you move the hot part outside. |
| 5 | 19,83–20,8 | 0,97 | Much better. |
| 6 | 20,8–23,7 | 2,9 | Except now your fat ass friend blocks all the cold air, |
| 7 | 23,7–26,1 | 2,4 | so you add moving flaps that spread it around. |
| 8 | 26,1–28,4 | 2,3 | But it works too well and he starts freezing, |
| 9 | 28,4–31,17 | 2,77 | so you add a thermostat that stops cooling when it reaches a |
| 10 | 31,17–32,03 | 0,87 | set temperature. |
| 11 | 32,03–34,27 | 2,24 | Now your friend comes inside every day. |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈748,0–786,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 270,0 px, tối đa 637,0 px / 720 [ĐO].
- 56 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 25,0%, 2 từ 39,0%, ≥3 từ 36,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 222,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 210,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -36,6 dBFS so với lời -20,1 dBFS → nền thấp hơn lời ≈16,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,11 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~5,7 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 3,0 s (9%), 7,3 s (21%), 15,0 s (44%), 20,9 s (61%), 26,2 s (76%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
