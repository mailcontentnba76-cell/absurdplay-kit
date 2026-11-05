# PHÂN TÍCH VIDEO MẪU 07 — Cái quạt
File: `How.you.invented.the.fan.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 cd3a0056
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 30,23 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,4 dBFS / 2,5 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -19,8 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 88,0 / 132,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,55 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> Your ass is sweaty, so you wave a giant leaf at yourself. But it's not doing much. So you attach four big leaves to a stick and spin them with a handle. Clever! Except your arm is tired from before, so you build a nuclear power plant and connect it to a motor to keep them spinning. But your dumbass friend sticks his fingers in the spinning blades, so you put a cage around them that still lets air through. Much better. Except now he fucking complains he's sweaty too! So you add gears that swing the fan from side to side. Now you can blow your friend all day!

- 110 từ; lời từ 0,0 s đến ≈30,03 s; **220,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 3,8 s (12%), 9,9 s (33%), 16,1 s (53%), 22,7 s (75%) → **4 vòng vấn đề** [ĐO trên lời].
- Câu khen ngắn chen giữa: Clever! (9,0 s), better. (22,1 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Chỉ 2 cắt cứng [ĐO]; chuyển cảnh chủ yếu bằng máy chạy liền/whip pan [QS ở 12–13 s]. Nhà máy hạt nhân xuất hiện sớm (33%).

## 2. Hình ảnh [QS]
- Bối cảnh: Trại lều hình nón nâu, cây ô-liu, đồng cỏ khô, trời xanh; tháp làm mát hạt nhân xuất hiện từ 13 s và ở lại nền.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 88,0, sáng 132,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam tiền sử tóc dài đen, áo da thú be. Bạn: nam da đen, áo da nâu, mồ hôi 2D trên mặt.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 3 shot; độ dài trung vị **4,7 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 5,1% · đẩy vào 38,6% · lùi 37,9% · lia ngang 7,3% · lia dọc 3,5% · tốc độ trung vị 19,0 px/s, p90 76,2 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–5,2 | Ass sweaty → wave a giant leaf; not doing much | Ngồi trên khúc gỗ quạt lá xanh to; cận | trung cảnh, máy đứng | phụ đề trắng 1–3 từ | hook | [QS] mốc lời [ĐO] |
| 5,2–9,9 | four leaves on a stick + handle → "Clever!" | Quạt quay tay lá xanh trên giá ba chân | lia ngang | phụ đề trắng 1–3 từ | giải pháp 1 | [QS] mốc lời [ĐO] |
| 9,9–16,1 | arm tired → build nuclear power plant + motor | Máy lia nhanh (whip) từ người sang lều → lộ 2 tháp hạt nhân; mờ chuyển động mạnh | whip pan liền, không cắt | nhoè chuyển động | leo thang phi lý (ở 33%) | [QS] mốc lời [ĐO] |
| 16,1–21,7 | dumbass friend sticks fingers → cage → "Much better" | Bạn thò tay vào cánh; lồng tre bao quanh | cận, xoay quanh quạt | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 22,7–25,5 | he fucking complains he's sweaty too | Cận bạn phàn nàn, giọt mồ hôi | cận mặt | "FUCKING" viết hoa | vấn đề 3 | [QS] mốc lời [ĐO] |
| 25,5–30,2 | gears swing side to side → "Now you can blow your friend all day!" | Cận bánh răng; quạt xoay qua lại; 2 người hưởng gió | cận → trung | phụ đề trắng 1–3 từ | kết nước đôi | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–22,7 | 22,7 | Your ass is sweaty, so you wave a giant leaf at yourself. But it's not doing much. So you attach four big leaves to a stick and spin them with a handle. Clever! Except your arm is tired from before, so you build a nuclear power plant and connect it to a motor to keep them spinning. But your dumbass friend sticks his fingers in the spinning blades, so you put a cage around them that still lets air through. Much better. |
| 2 | 22,7–25,53 | 2,83 | Except now he fucking complains he's sweaty too! |
| 3 | 25,53–30,23 | 4,7 | So you add gears that swing the fan from side to side. Now you can blow your friend all day! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈748,0–787,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈40,0 px [ĐO]; rộng trung vị 252,0 px, tối đa 343,0 px / 720 [ĐO].
- 48 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 19,0%, 2 từ 46,0%, ≥3 từ 35,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 220,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 211,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -40,0 dBFS so với lời -20,2 dBFS → nền thấp hơn lời ≈20,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,09 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~6,0 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 3,8 s (12%), 9,9 s (33%), 16,1 s (53%), 22,7 s (75%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
