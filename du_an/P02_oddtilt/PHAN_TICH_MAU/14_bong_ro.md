# PHÂN TÍCH VIDEO MẪU 14 — Quả bóng rổ
File: `Share.this.with.someone.who.loves.balls.too.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 8e7b7a8a
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 34,6 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,4 dBFS / 1,9 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -18,9 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 67,0 / 144,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,52 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You love balls! But your friend's tired of playing with your heavy ones, so you make a hollow rubber ball and pump it up. But the air escapes when you unplug it, so you add a valve that seals itself. Genius! Except it bulges out of shape when you inflate it, so you wrap it in strong thread to keep it round. But bouncing it wears through the thread, so you give it a tough outer cover. Clever! Except your friend's small hands struggle to grip your big balls, so you cover them in tiny bumps. But his fingers still can't find a consistent grip when he is trying to shoot, so you add grooves across the surface. Now your friend loves playing with your balls!

- 126 từ; lời từ 0,32 s đến ≈34,27 s; **223,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 1,4 s (4%), 6,2 s (18%), 11,4 s (33%), 16,5 s (48%), 21,2 s (61%), 26,5 s (77%) → **6 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 10,4 s (30%) [ĐO].
- Câu khen ngắn chen giữa: Genius! (10,4 s), Clever! (20,3 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Tên file là caption "Share this with someone who loves balls too" → caption kêu gọi chia sẻ dựa vào chữ nước đôi [QS].

## 2. Hình ảnh [QS]
- Bối cảnh: Sân bóng rổ ngoài trời sau nhà: mặt nhựa xám vạch trắng, rổ, hàng rào gỗ, nhà ngoại ô, trời xanh; kết thấy tháp làm mát hạt nhân.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 67,0, sáng 144,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam hiện đại áo sơ mi jean xanh, tóc đen. Bạn: nam áo thun trắng, quần jean, tóc nâu.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 18 shot; độ dài trung vị **1,86 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 10,5% · đẩy vào 57,6% · lùi 9,3% · lia ngang 6,8% · lia dọc 5,0% · tốc độ trung vị 14,1 px/s, p90 52,1 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–6,2 | You LOVE balls! friend's tired of playing with your heavy ones → hollow rubber ball, pump | Ném quả bóng đá nặng; bạn bơm bóng cao su bằng bơm tay đỏ | trung cảnh, cắt nhanh | "LOVE" hoa | hook nước đôi | [QS] mốc lời [ĐO] |
| 6,2–11,4 | air escapes → self-sealing valve → "Genius!" | Bóng xẹp; cận van | cận | phụ đề trắng 1–3 từ | vấn đề 1 | [QS] mốc lời [ĐO] |
| 11,4–20,3 | bulges → wrap in thread; wears through → tough outer cover → "Clever!" | Bóng méo; quấn chỉ trắng; vỏ cam úp vào | cận, xoay | phụ đề trắng 1–3 từ | vấn đề 2–3 | [QS] mốc lời [ĐO] |
| 21,2–26,5 | small hands struggle to grip your big balls → tiny bumps | Bóng tuột tay; cận bề mặt sần | cận | phụ đề trắng 1–3 từ | vấn đề 4 | [QS] mốc lời [ĐO] |
| 26,5–32,2 | can't find grip when he shoots → grooves | Bạn ném bóng vào rổ; bóng có rãnh đen | sau lưng → cận | phụ đề trắng 1–3 từ | vấn đề 5 | [QS] mốc lời [ĐO] |
| 32,2–34,6 | Now your friend loves playing with your balls! | Hai người giơ tay ăn mừng, tháp hạt nhân phía sau | trung cảnh | phụ đề trắng 1–3 từ | kết nước đôi | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–4,17 | 4,17 | You love balls! But your friend's tired of playing with your heavy ones, so you |
| 2 | 4,17–6,27 | 2,1 | make a hollow rubber ball and pump it up. |
| 3 | 6,27–8,1 | 1,83 | But the air escapes when you unplug it, |
| 4 | 8,1–10,37 | 2,27 | so you add a valve that seals itself. |
| 5 | 10,37–11,27 | 0,9 | Genius! |
| 6 | 11,27–14,0 | 2,73 | Except it bulges out of shape when you inflate it, |
| 7 | 14,0–16,57 | 2,57 | so you wrap it in strong thread to keep it round. |
| 8 | 16,57–18,37 | 1,8 | But bouncing it wears through the thread, |
| 9 | 18,37–20,27 | 1,9 | so you give it a tough outer cover. |
| 10 | 20,27–21,13 | 0,87 | Clever! |
| 11 | 21,13–24,5 | 3,37 | Except your friend's small hands struggle to grip your big balls, |
| 12 | 24,5–26,5 | 2,0 | so you cover them in tiny bumps. |
| 13 | 26,5–28,3 | 1,8 | But his fingers still can't find a consistent |
| 14 | 28,3–29,93 | 1,63 | grip when he is trying to shoot, |
| 15 | 29,93–32,2 | 2,27 | so you add grooves across the surface. |
| 16 | 32,2–32,6 | 0,4 | Now your |
| 17 | 32,6–33,93 | 1,33 | friend loves playing with your |
| 18 | 33,93–34,6 | 0,66 | balls! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–788,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 295,0 px, tối đa 638,0 px / 720 [ĐO].
- 52 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 19,0%, 2 từ 37,0%, ≥3 từ 44,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 223,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 206,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -37,6 dBFS so với lời -20,1 dBFS → nền thấp hơn lời ≈17,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,09 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~4,9 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 1,4 s (4%), 6,2 s (18%), 11,4 s (33%), 16,5 s (48%), 21,2 s (61%), 26,5 s (77%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
