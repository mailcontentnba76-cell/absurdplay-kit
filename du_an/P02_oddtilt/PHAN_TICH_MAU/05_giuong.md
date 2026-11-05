# PHÂN TÍCH VIDEO MẪU 05 — Chiếc giường
File: `How.you.invented.the.bed.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 f9c5f113
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 30,42 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -2,0 dBFS / 2,8 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -21,0 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 104,0 / 101,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,71 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> Your back's been taking it rough every night, so you cover your rocky cave floor with soft grass. But rolling around scatters it, so you wrap it in leather. Genius! Except bugs crawl into your bed, so you raise it on a wooden frame. But the grass flattens until you feel the hard wood on your ass, so you replace it with springs that compress under you and bounce back. Much better. Except now your friend wants to sleep in your bed too, and he spends all night fucking tossing and turning. So you wrap each spring separately, letting him move without shaking you. Now your friend loves sleeping with you.

- 111 từ; lời từ 0,16 s đến ≈30,19 s; **222,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 5,0 s (16%), 8,6 s (28%), 12,2 s (40%), 19,5 s (64%) → **4 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 7,76 s (26%) [ĐO].
- Câu khen ngắn chen giữa: Genius! (7,8 s), better. (19,0 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Kết bằng câu nước đôi về "bạn". Chữ chửi thề hiện VIẾT HOA (FUCKING) dù lời không bị bíp [QS].

## 2. Hình ảnh [QS]
- Bối cảnh: Sàn hang đất sỏi chi tiết cao (texture chi tiết cao trông như ảnh chụp), vách đá nâu đỏ phân lớp. Cảnh bạn đến: cửa hang nhìn ra vườn ô-liu + tháp làm mát hạt nhân.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 104,0, sáng 101,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam tóc nâu chải ngược, áo da thú một vai; mắt xanh, mặt trơn kiểu nhân vật game. Bạn: nam da đen tóc dài, áo da trắng.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 8 shot; độ dài trung vị **3,54 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 7,9% · đẩy vào 40,3% · lùi 31,7% · lia ngang 3,7% · lia dọc 0,9% · tốc độ trung vị 13,2 px/s, p90 45,4 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–5,0 | back taking it rough → soft grass | Cận góc chéo nhân vật nằm trên đất; cỏ mọc lên dưới lưng | lùi chậm từ cận ra trung | phụ đề trắng 1–3 từ | hook nước đôi | [QS] mốc lời [ĐO] |
| 5,0–8,6 | rolling scatters it → wrap in leather → "Genius!" | Góc trên cao (top-down) nhân vật lăn, cỏ rải rác; đệm da xuất hiện | top-down, xoay nhẹ | phụ đề trắng 1–3 từ | vấn đề 1 | [QS] mốc lời [ĐO] |
| 8,6–15,3 | bugs crawl → raise on wooden frame; grass flattens | Siêu cận mặt + đệm; bọ bò; giường khung gỗ thô | đẩy/lùi | phụ đề trắng 1–3 từ | vấn đề 2–3 | [QS] mốc lời [ĐO] |
| 15,3–19,5 | springs compress and bounce back → "Much better" | Nhân vật bật ngồi dậy; lò xo kim loại dưới đệm, nảy lên xuống | trung cảnh ngang | phụ đề trắng 1–3 từ | giải pháp | [QS] mốc lời [ĐO] |
| 19,5–24,8 | friend wants to sleep too… fucking tossing | Cửa hang có bạn đến; 2 người nằm, bạn vung tay vung chân | trung cảnh, máy trôi | "FUCKING" viết hoa | vấn đề cuối (bạn) | [QS] mốc lời [ĐO] |
| 24,8–30,4 | wrap each spring separately → "Now your friend loves sleeping with you." | Lò xo bọc túi vải kem (đệm lò xo túi); 2 người nằm yên; góc top-down kết | trung cảnh, top-down | phụ đề trắng 1–3 từ | kết nước đôi | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–5,0 | 5,0 | Your back's been taking it rough every night, so you cover your rocky cave floor with soft grass. |
| 2 | 5,0–8,57 | 3,57 | But rolling around scatters it, so you wrap it in leather. Genius! |
| 3 | 8,57–15,27 | 6,7 | Except bugs crawl into your bed, so you raise it on a wooden frame. But the grass flattens until you feel the hard wood on your ass, |
| 4 | 15,27–19,47 | 4,2 | so you replace it with springs that compress under you and bounce back. Much better. |
| 5 | 19,47–22,07 | 2,6 | Except now your friend wants to sleep in your bed too, |
| 6 | 22,07–24,83 | 2,77 | and he spends all night fucking tossing and turning. |
| 7 | 24,83–28,33 | 3,5 | So you wrap each spring separately, letting him move without shaking you. |
| 8 | 28,33–30,42 | 2,09 | Now your friend loves sleeping with you. |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–787,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 258,0 px, tối đa 640,0 px / 720 [ĐO].
- 51 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 18,0%, 2 từ 55,0%, ≥3 từ 27,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 222,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 184,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -39,0 dBFS so với lời -20,0 dBFS → nền thấp hơn lời ≈19,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,1 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~6,1 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 5,0 s (16%), 8,6 s (28%), 12,2 s (40%), 19,5 s (64%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
