# PHÂN TÍCH VIDEO MẪU 06 — Cánh cửa
File: `How.you.invented.the.door.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 b4cf60e0
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 33,2 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -2,1 dBFS / 2,5 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -21,9 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 53,0 / 140,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,68 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You're taking a shit, but your friend keeps trying to watch, so you hang leather across your entryway. Clever! But the wind lifts it and your friend gets another peek, so you replace it with wooden boards joined together. Except lifting the whole thing every time you leave is exhausting, so you attach hinges along one side, letting it swing open. But the wind swings it open too, so you add a latch that catches in the frame when you close it. Much better! Except your friend still fucking manages to open it, so you add a bolt on the inside that slides into the frame, keeping the door shut until you pull it back. Now your friend can come inside!

- 121 từ; lời từ 0,0 s đến ≈32,91 s; **221,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 1,1 s (3%), 5,8 s (17%), 11,2 s (34%), 18,2 s (55%), 23,8 s (72%) → **5 vòng vấn đề** [ĐO trên lời].
- Câu khen ngắn chen giữa: Clever! (4,9 s), better! (23,1 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Nhân vật mặc đồ hiện đại nhưng đồ vật tiền sử → kênh không giữ một thời đại cố định [QS].

## 2. Hình ảnh [QS]
- Bối cảnh: Chòi đá xám nhỏ, sàn gỗ, giữa đồng cỏ vàng có cây; kết: toàn cảnh chòi đá với 2 tháp làm mát hạt nhân phía sau.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 53,0, sáng 140,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam hiện đại áo thun trắng có logo, quần jean, tóc nâu ngắn (không phải người tiền sử). Bạn: nam da đen áo xanh than, hay nhòm vào.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 14 shot; độ dài trung vị **2,69 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 11,9% · đẩy vào 54,6% · lùi 20,2% · lia ngang 3,6% · lia dọc 1,6% · tốc độ trung vị 11,6 px/s, p90 52,3 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–4,9 | taking a shit, friend keeps trying to watch → hang leather → "Clever!" | Góc qua vai bạn nhìn vào khung cửa: nhân vật ngồi bệ, kéo áo che; treo tấm da | qua vai, đẩy vào | phụ đề trắng 1–3 từ | hook | [QS] mốc lời [ĐO] |
| 5,8–11,2 | wind lifts it → wooden boards | Tấm da bị gió hất, bạn ló vào; cửa ván gỗ | trung cảnh, cận | phụ đề trắng 1–3 từ | vấn đề 1 | [QS] mốc lời [ĐO] |
| 11,2–18,2 | lifting is exhausting → hinges | Nhân vật nhấc cả tấm cửa; cận bản lề kim loại; cửa mở | cận vật, quỹ đạo | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 18,2–23,8 | wind swings it open → latch → "Much better!" | Cửa tự mở, bạn ngoài cửa; cận chốt cài | cận | phụ đề trắng 1–3 từ | vấn đề 3 | [QS] mốc lời [ĐO] |
| 23,8–31,4 | friend still fucking manages to open → bolt | Mặt nhân vật hoảng (siêu cận); then cài đồng trượt vào khung | siêu cận mặt → cận vật | phụ đề trắng 1–3 từ | vấn đề 4 | [QS] mốc lời [ĐO] |
| 31,4–33,2 | Now your friend can come inside! | Toàn cảnh chòi, bạn đi vào; tháp hạt nhân phía sau | lùi xa | phụ đề trắng 1–3 từ | kết nước đôi | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–2,67 | 2,67 | You're taking a shit, but your friend keeps trying to watch, |
| 2 | 2,67–5,77 | 3,1 | so you hang leather across your entryway. Clever! |
| 3 | 5,77–8,5 | 2,73 | But the wind lifts it and your friend gets another peek, |
| 4 | 8,5–11,37 | 2,87 | so you replace it with wooden boards joined together. Except |
| 5 | 11,37–14,73 | 3,37 | lifting the whole thing every time you leave is exhausting, |
| 6 | 14,73–18,13 | 3,4 | so you attach hinges along one side, letting it swing open. |
| 7 | 18,13–19,87 | 1,73 | But the wind swings it open too, |
| 8 | 19,87–23,8 | 3,93 | so you add a latch that catches in the frame when you close it. Much better! |
| 9 | 23,8–24,8 | 1,0 | Except your friend still |
| 10 | 24,8–25,73 | 0,93 | fucking manages |
| 11 | 25,73–26,57 | 0,83 | to open it, |
| 12 | 26,57–29,27 | 2,7 | so you add a bolt on the inside that slides into the frame, |
| 13 | 29,27–31,33 | 2,07 | keeping the door shut until you pull it back. |
| 14 | 31,33–33,2 | 1,87 | Now your friend can come inside! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–788,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈43,0 px [ĐO]; rộng trung vị 380,0 px, tối đa 639,0 px / 720 [ĐO].
- 51 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 16,0%, 2 từ 51,0%, ≥3 từ 33,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 221,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 175,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -31,1 dBFS so với lời -20,0 dBFS → nền thấp hơn lời ≈11,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,1 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~5,5 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 1,1 s (3%), 5,8 s (17%), 11,2 s (34%), 18,2 s (55%), 23,8 s (72%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
