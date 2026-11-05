# PHÂN TÍCH VIDEO MẪU 08 — Kẹp hạt dẻ
File: `How.you.invented.the.nutcracker.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 5ff8dadb
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 47,51 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,8 dBFS / 1,4 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -21,1 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 56,0 / 120,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,51 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You love nuts, but whenever you try busting one, your hand just hurts. And your nut is still perfectly fine. So you, being a genius caveman, hit it with a rock, and it opens! But you've also turned your snack into powder. You realize you need enough force to crack the shell without smashing everything inside. So you put the nut between two metal jaws and join them with a hinge. But the nut still doesn't crack. So you extend the handles for more leverage. Clever fix, except your big nuts won't fit. So you carve a second, larger gap into the jaws. Now it works on more sizes. But the next nut launches out and puts your neighbor into a coma. So you build a precision laser cutter to carve out little grooves into the tool so the nut stays in place. Congratulations! You've invented the nutcracker.

- 148 từ; lời từ 0,0 s đến ≈46,83 s; **190,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 1,6 s (3%), 12,1 s (25%), 23,2 s (49%), 28,5 s (60%), 35,5 s (75%) → **5 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 8,8 s (19%) [ĐO].
- Câu khen ngắn chen giữa: genius (8,8 s), Clever (27,5 s), Congratulations! (44,7 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 44,72 s (94%) [ĐO].
- Đặc biệt: Gag bạo lực hài (hàng xóm hôn mê). Kết "Congratulations!" + confetti.

## 2. Hình ảnh [QS]
- Bối cảnh: Bàn đá ngoài trời trên bãi cỏ, cây, nhà gỗ. Nhiều siêu cận hạt óc chó.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 56,0, sáng 120,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam tóc đen ngắn, áo thun be + tạp dề jean (hiện đại), dù lời gọi "genius caveman". Phụ: hàng xóm da đen áo thun xám ở cửa sổ nhà gỗ.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 16 shot; độ dài trung vị **2,5 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 6,5% · đẩy vào 77,6% · lùi 6,6% · lia ngang 0,4% · lia dọc 1,4% · tốc độ trung vị 5,9 px/s, p90 14,9 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–7,6 | You love nuts… busting one, hand hurts; nut perfectly fine | Trung cảnh đập tay lên hạt trên bàn đá | trung, máy đứng, đẩy chậm | phụ đề trắng 1–3 từ | hook nước đôi | [QS] mốc lời [ĐO] |
| 7,6–14,6 | hit it with a rock → powder | Cầm đá đập, hạt nát thành vụn (nhiều mảnh) | cận | phụ đề trắng 1–3 từ | giải pháp 1 → vấn đề | [QS] mốc lời [ĐO] |
| 14,6–19,4 | need force to crack shell without smashing inside | Hạt to giữa màn hình, viền highlight xanh lá quanh vỏ/nhân | siêu cận, đứng | viền highlight xanh lá | giải thích | [QS] mốc lời [ĐO] |
| 19,4–27,5 | two metal jaws + hinge; doesn't crack → extend handles | Kẹp kim loại xám; tay ép | cận tay | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 27,5–35,5 | big nuts won't fit → second larger gap | Hạt to không vừa; khe thứ hai (vòng xanh đánh dấu) | cận | vòng highlight | vấn đề 3 | [QS] mốc lời [ĐO] |
| 35,5–44,7 | nut launches → neighbor coma → precision laser cutter | Hạt bắn đi; hàng xóm gục ở cửa sổ; máy laser tia đỏ khắc rãnh | cận, cắt nhanh | tia laser đỏ | leo thang phi lý | [QS] mốc lời [ĐO] |
| 44,7–47,5 | Congratulations! You've invented the nutcracker. | Nhân vật vung kẹp to ăn mừng, pháo giấy (confetti) | trung cảnh | confetti | kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–7,67 | 7,67 | You love nuts, but whenever you try busting one, your hand just hurts. And your nut is still perfectly fine. |
| 2 | 7,67–11,9 | 4,23 | So you, being a genius caveman, hit it with a rock, and it opens! |
| 3 | 11,9–14,6 | 2,7 | But you've also turned your snack into powder. |
| 4 | 14,6–16,33 | 1,73 | You realize you need enough force |
| 5 | 16,33–17,1 | 0,77 | to crack the shell |
| 6 | 17,1–19,4 | 2,3 | without smashing everything inside. |
| 7 | 19,4–23,1 | 3,7 | So you put the nut between two metal jaws and join them with a hinge. |
| 8 | 23,1–25,2 | 2,1 | But the nut still doesn't crack. |
| 9 | 25,2–28,3 | 3,1 | So you extend the handles for more leverage. Clever fix, |
| 10 | 28,3–33,4 | 5,1 | except your big nuts won't fit. So you carve a second, larger gap into the jaws. |
| 11 | 33,4–35,5 | 2,1 | Now it works on more sizes. |
| 12 | 35,5–36,97 | 1,47 | But the next nut launches |
| 13 | 36,97–39,1 | 2,13 | out and puts your neighbor into a coma. |
| 14 | 39,1–43,2 | 4,1 | So you build a precision laser cutter to carve out little grooves into the tool |
| 15 | 43,2–44,67 | 1,47 | so the nut stays in place. |
| 16 | 44,67–47,51 | 2,84 | Congratulations! You've invented the nutcracker. |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈750,0–785,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈36,0 px [ĐO]; rộng trung vị 262,0 px, tối đa 470,0 px / 720 [ĐO].
- 65 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 23,0%, 2 từ 38,0%, ≥3 từ 38,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 190,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 157,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -33,1 dBFS so với lời -19,9 dBFS → nền thấp hơn lời ≈13,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,09 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~7,9 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 1,6 s (3%), 12,1 s (25%), 23,2 s (49%), 28,5 s (60%), 35,5 s (75%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
