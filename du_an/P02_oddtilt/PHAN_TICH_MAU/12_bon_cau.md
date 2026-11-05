# PHÂN TÍCH VIDEO MẪU 12 — Bồn cầu xả
File: `How.you.invented.the.toilet.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 cfa4ee65
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 51,13 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,7 dBFS / 2,4 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -23,3 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 60,0 / 198,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,63 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You got a shit, but it's pouring outside. So, with your genius mind, you build a chair, cut a hole for your ass, and put a container underneath. It's much nicer, until it's time to empty it. You connect the bowl to a pipe carrying waste away, and pour in a bucket of water to wash everything down. Lovely. Except the smell can come back up the pipe. You add a bin that holds a little water after each flush, blocking the gases while letting the next flush pass through. Clever fix! Now you're comfortable, but you're still fetching buckets. You put a tank above the bowl and add a handle that lifts a flap, letting the stored water rush down all at once. The flap closes afterwards, but now the tank is empty. You connect a water supply to refill it, then realize it will keep filling forever. You add a float that rises with the water and shuts the supply off when the tank is full. Congratulations! You've invented the flush toilet!

- 174 từ; lời từ 0,0 s đến ≈50,35 s; **207,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 0,9 s (2%), 17,1 s (33%), 28,0 s (55%), 37,2 s (73%) → **4 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 3,12 s (6%) [ĐO].
- Câu khen ngắn chen giữa: genius (3,1 s), Lovely. (16,2 s), Clever (25,5 s), Congratulations! (47,6 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 47,6 s (93%) [ĐO].
- Đặc biệt: Cả video gần như một cú máy liền (1 cắt cứng [ĐO], đã xem dải khung ở 2,2/10,2/29,4 s [QS]). Phong cách giáo dục cơ chế, ít gag người.

## 2. Hình ảnh [QS]
- Bối cảnh: Mặt cắt (cutaway) căn nhà: sàn gỗ, tường kem, lớp gạch xám + đất dưới sàn để thấy ống; mở đầu: nhà xí gỗ ngoài trời đang mưa nhìn qua cửa sổ.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 60,0, sáng 198,0 [ĐO].

## 3. Nhân vật [QS]
- Không có nhân vật toàn thân: chỉ cánh tay áo flannel kẻ đỏ đen xách xô.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 2 shot; độ dài trung vị **25,57 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 49,1% · đẩy vào 12,3% · lùi 9,4% · lia ngang 2,5% · lia dọc 4,3% · tốc độ trung vị 3,1 px/s, p90 33,8 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–2,5 | You got a shit, but it's pouring outside | Nhìn qua cửa sổ thấy nhà xí gỗ dưới mưa | máy trôi ngang | phụ đề trắng 1–3 từ | hook | [QS] mốc lời [ĐO] |
| 2,5–11,1 | genius mind → chair, hole, container; until time to empty it | Máy lia vào phòng; ghế "bản vẽ" xanh trong suốt hiện dần thành ghế gỗ; khoét lỗ; bát sứ; sóng mùi xanh | lia liền, không cắt | vật hiện dần từ hologram xanh | giải pháp 1 | [QS] mốc lời [ĐO] |
| 11,1–17,1 | pipe carrying waste away; pour bucket → "Lovely." | Lùi ra mặt cắt thấy ống trong tường; nước + phân chảy | lùi liền | phụ đề trắng 1–3 từ | giải pháp 2 | [QS] mốc lời [ĐO] |
| 17,1–26,9 | smell comes back up → water trap (bin) → "Clever fix!" | Siêu cận ống chữ U chứa nước, khí xanh bị chặn | đẩy vào liền | phụ đề trắng 1–3 từ | giải thích cơ chế | [QS] mốc lời [ĐO] |
| 26,9–38,7 | still fetching buckets → tank + handle lifts a flap; tank empty | Bể trong suốt trên tường, nắp cao su đỏ, xích | cẩu lên liền | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 38,7–47,6 | water supply refill → filling forever → float | Ống đồng cấp nước; nước tràn; phao vàng nổi đóng van | cận, liền | phụ đề trắng 1–3 từ | vấn đề 3 | [QS] mốc lời [ĐO] |
| 47,6–51,1 | Congratulations! You've invented the flush toilet! | Lùi toàn bộ mặt cắt; confetti | lùi xa | confetti | kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–2,53 | 2,53 | You got a shit, but it's pouring outside. |
| 2 | 2,53–51,13 | 48,6 | So, with your genius mind, you build a chair, cut a hole for your ass, and put a container underneath. It's much nicer, until it's time to empty it. You connect the bowl to a pipe carrying waste away, and pour in a bucket of water to wash everything down. Lovely. Except the smell can come back up the pipe. You add a bin that holds a little water after each flush, blocking the gases while letting the next flush pass through. Clever fix! Now you're comfortable, but you're still fetching buckets. You put a tank above the bowl and add a handle that lifts a flap, letting the stored water rush down all at once. The flap closes afterwards, but now the tank is empty. You connect a water supply to refill it, then realize it will keep filling forever. You add a float that rises with the water and shuts the supply off when the tank is full. Congratulations! You've invented the flush toilet! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–786,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 278,0 px, tối đa 609,0 px / 720 [ĐO].
- 81 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 25,0%, 2 từ 43,0%, ≥3 từ 32,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 207,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 132,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -35,4 dBFS so với lời -19,8 dBFS → nền thấp hơn lời ≈16,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,07 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~10,2 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 0,9 s (2%), 17,1 s (33%), 28,0 s (55%), 37,2 s (73%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
