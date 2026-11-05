# PHÂN TÍCH VIDEO MẪU 10 — Vòi sen
File: `How.you.invented.the.shower.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 121b9293
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 47,14 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,0 LUFS / -2,0 dBFS / 2,6 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -23,5 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 72,0 / 120,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,46 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You smell like shit. So you, being a genius caveman, pour a bucket of water over yourself and scrub. That helps, but now you're wet and out of water. So you put a bigger tank above your head and run a pipe down from it. Gravity brings the water to you. Great, except it's now pouring even after you're done, wasting your village's water supply, so you add a valve. Now you can twist it open when you want water and shut it when you're done. But the stream of water is small, hardly covering your body, so you spread the end of the pipe into a wider head and poke little holes through it. The water comes out as lots of smaller streams, covering more of you at once. But it's the middle of winter and the water that comes out is so cold it makes you faint. So you build a nuclear power plant to power your water heater and connect the hot water supply alongside the cold one. Then adjust how much of each comes through. Congratulations, you've invented the shower.

- 184 từ; lời từ 0,16 s đến ≈46,11 s; **240,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 7,2 s (15%), 14,6 s (31%), 22,8 s (48%), 33,0 s (70%) → **4 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 2,8 s (6%) [ĐO].
- Câu khen ngắn chen giữa: genius (2,8 s), Congratulations, (44,1 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 44,08 s (94%) [ĐO].
- Đặc biệt: Đổi mùa (hè → đông) làm vấn đề. F0 thấp 117 Hz [ĐO].

## 2. Hình ảnh [QS]
- Bối cảnh: Cửa hang đen trên đồi đá xám, rừng thông, đất nâu; nửa sau chuyển sang mùa đông tuyết trắng, nhà máy hạt nhân + ống khói sọc đỏ trắng.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 72,0, sáng 120,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam tiền sử tóc đen dài, áo liền quần da thú vàng đốm nâu (vết bẩn).
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 17 shot; độ dài trung vị **2,9 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 16,2% · đẩy vào 31,7% · lùi 17,8% · lia ngang 1,8% · lia dọc 7,8% · tốc độ trung vị 7,9 px/s, p90 35,1 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–6,5 | You smell like shit → bucket of water | Sóng mùi xanh lá uốn lượn quanh người; dội thùng nước | trung cảnh, máy đứng | sóng mùi xanh | hook | [QS] mốc lời [ĐO] |
| 6,5–14,2 | wet and out of water → bigger tank + pipe; gravity | Thùng gỗ trên giàn cao, ống đồng | toàn cảnh, cẩu | phụ đề trắng 1–3 từ | giải pháp 1 | [QS] mốc lời [ĐO] |
| 14,2–22,8 | wasting village water → valve | Vũng nước lan; siêu cận van đồng + tay vặn | cận góc thấp | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 22,8–33,0 | small stream → wider head with little holes | Đầu sen đồng to, tia nước nhiều | góc thấp nhìn lên | phụ đề trắng 1–3 từ | vấn đề 3 | [QS] mốc lời [ĐO] |
| 33,0–42,2 | middle of winter, water so cold → faint → nuclear plant powers water heater | Tuyết; nhân vật ngất nằm sấp; bình nóng lạnh có biểu tượng phóng xạ, ống đỏ | toàn cảnh, lùi | phụ đề trắng 1–3 từ | leo thang phi lý | [QS] mốc lời [ĐO] |
| 42,2–47,1 | adjust hot/cold → Congratulations, you've invented the shower. | Hai tay vặn hai van đỏ/đen; toàn cảnh tháp hạt nhân | cận → toàn | confetti | kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–3,77 | 3,77 | You smell like shit. So you, being a genius caveman, |
| 2 | 3,77–6,4 | 2,63 | pour a bucket of water over yourself and scrub. |
| 3 | 6,4–9,3 | 2,9 | That helps, but now you're wet and out of water. |
| 4 | 9,3–9,83 | 0,53 | So you |
| 5 | 9,83–12,57 | 2,73 | put a bigger tank above your head and run a pipe down from it. |
| 6 | 12,57–14,17 | 1,6 | Gravity brings the water to you. |
| 7 | 14,17–17,2 | 3,03 | Great, except it's now pouring even after you're done, wasting your village's |
| 8 | 17,2–18,6 | 1,4 | water supply, so you add |
| 9 | 18,6–22,6 | 4,0 | a valve. Now you can twist it open when you want water and shut it when you're done. |
| 10 | 22,6–26,1 | 3,5 | But the stream of water is small, hardly covering your body, so you |
| 11 | 26,1–29,37 | 3,27 | spread the end of the pipe into a wider head and poke little holes through it. |
| 12 | 29,37–32,87 | 3,5 | The water comes out as lots of smaller streams, covering more of you at once. |
| 13 | 32,87–37,1 | 4,23 | But it's the middle of winter and the water that comes out is so cold it makes you faint. So |
| 14 | 37,1–39,6 | 2,5 | you build a nuclear power plant to power your water heater |
| 15 | 39,6–42,17 | 2,57 | and connect the hot water supply alongside the cold one. |
| 16 | 42,17–44,0 | 1,83 | Then adjust how much of each comes through. |
| 17 | 44,0–47,14 | 3,14 | Congratulations, you've invented the shower. |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈749,0–786,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈40,0 px [ĐO]; rộng trung vị 260,0 px, tối đa 434,0 px / 720 [ĐO].
- 86 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 27,0%, 2 từ 41,0%, ≥3 từ 33,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 240,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 117,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -28,3 dBFS so với lời -19,2 dBFS → nền thấp hơn lời ≈9,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,1 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~9,4 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 7,2 s (15%), 14,6 s (31%), 22,8 s (48%), 33,0 s (70%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
