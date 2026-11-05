# PHÂN TÍCH VIDEO MẪU 01 — Chiếc ghế
File: `How.did.you.invent.the.chair-.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 547c5531
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 35,71 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -0,5 dBFS / 2,8 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -21,8 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 58,0 / 122,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,52 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> Your ass hurts, so you, being a genius caveman, lug over a tree stump to sit on instead of the cold rock floor. It works, but it's way too wide and heavy, so you carve it into a flat platform with four legs. Clever! But your friend complains about falling off when he leans back, so you add a backrest. Except your friend still complains it's too low! So you remove him and weld on an adjustable gaslift. But the hard wood still hurts your ass, so you strap a pillow to the seat. Now you can play Fortnite comfortably all day. Congratulations! You've invented the chair!

- 107 từ; lời từ 0,16 s đến ≈35,23 s; **183,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 8,7 s (24%), 14,9 s (42%), 19,6 s (55%), 25,8 s (72%) → **4 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 2,64 s (7%) [ĐO].
- Câu khen ngắn chen giữa: genius (2,6 s), Clever! (13,9 s), Congratulations! (32,7 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 32,72 s (92%) [ĐO].
- Đặc biệt: Lệch thời đại ở kết (PC chơi game, ghế gaming). Câu "So you remove him" = gag tàn nhẫn kiểu đen. Hook hình ở khung 0: nhân vật đã đang cử động (khuỵu gối).

## 2. Hình ảnh [QS]
- Bối cảnh: Làng tiền sử ngoài trời ban ngày: tảng đá xám lớn, cây tán tròn kiểu hoạt hình, chòi mái rơm, nền đá dăm + cỏ. Render bán tả thực, ánh sáng mặt trời gắt, bóng đổ rõ. Cuối: bàn máy tính, màn hình chơi game giữa làng.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 58,0, sáng 122,0 [ĐO].

## 3. Nhân vật [QS]
- Nhân vật chính: nam tiền sử tóc dài nâu, áo liền quần da thú nâu, dáng người thật (tỉ lệ người lớn), mặt ít biểu cảm, cử động cứng kiểu ma-nơ-canh. Bạn: nam da đen, đồ da báo vàng đốm đen.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 10 shot; độ dài trung vị **3,53 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 22,1% · đẩy vào 25,7% · lùi 37,7% · lia ngang 6,9% · lia dọc 2,4% · tốc độ trung vị 7,9 px/s, p90 77,9 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–3,3 | Ass hurts → "genius caveman" | Trung cảnh nhân vật đứng giữa làng, khuỵu gối như ngồi vào khoảng không, vung tay | máy đứng, hơi đẩy | chữ trắng 2 từ;  | hook câu 1 | [QS] mốc lời [ĐO] |
| 3,3–7,8 | lug over a tree stump | Toàn cảnh: nhân vật kéo gốc cây tới, ngồi lên | máy lùi chậm theo người | phụ đề trắng 1–3 từ | giải pháp 1 | [QS] mốc lời [ĐO] |
| 7,8–14,9 | too wide and heavy → carve 4 legs → "Clever!" | Cận gốc cây, đẽo bằng búa thành ghế đẩu 4 chân | đẩy vào/lia nhẹ | "Clever!" một chữ | vấn đề 1 → giải pháp 2 → khen | [QS] mốc lời [ĐO] |
| 14,9–19,7 | friend falls back → backrest | Bạn ngồi ghế ngả ra sau ngã; thêm tựa lưng | trung cảnh, máy trôi | phụ đề trắng 1–3 từ | vấn đề 2 | [QS] mốc lời [ĐO] |
| 19,7–25,8 | still too low → remove him + gas lift | Bạn ôm đầu phàn nàn; nhân vật hàn chân ghế xoay, tia lửa hàn | cận tay hàn, lùi | tia lửa (hiệu ứng hạt) | vấn đề 3 → giải pháp phi lý | [QS] mốc lời [ĐO] |
| 25,8–30,1 | hard wood → strap a pillow | Nhân vật đứng xoa mông, buộc gối lên ghế xoay | trung cảnh | phụ đề trắng 1–3 từ | vấn đề 4 | [QS] mốc lời [ĐO] |
| 30,1–35,7 | play Fortnite… Congratulations! You've invented the chair! | Ngồi ghế xoay trước bàn PC giữa làng; máy lùi ra toàn cảnh | lùi xa (pull-out) kết | phụ đề trắng 1–3 từ | kết + cú lệch thời đại | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–3,3 | 3,3 | Your ass hurts, so you, being a genius caveman, |
| 2 | 3,3–7,77 | 4,47 | lug over a tree stump to sit on instead of the cold rock floor. |
| 3 | 7,77–10,87 | 3,1 | It works, but it's way too wide and heavy, |
| 4 | 10,87–14,9 | 4,03 | so you carve it into a flat platform with four legs. Clever! |
| 5 | 14,9–19,73 | 4,83 | But your friend complains about falling off when he leans back, so you add a backrest. Except |
| 6 | 19,73–23,47 | 3,73 | your friend still complains it's too low! So you remove him |
| 7 | 23,47–25,8 | 2,33 | and weld on an adjustable gaslift. |
| 8 | 25,8–30,07 | 4,27 | But the hard wood still hurts your ass, so you strap a pillow to the seat. |
| 9 | 30,07–33,4 | 3,33 | Now you can play Fortnite comfortably all day. Congratulations! |
| 10 | 33,4–35,71 | 2,31 | You've invented the chair! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈750,0–785,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈36,0 px [ĐO]; rộng trung vị 221,0 px, tối đa 443,0 px / 720 [ĐO].
- 48 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 27,0%, 2 từ 35,0%, ≥3 từ 38,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 183,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 209,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -36,5 dBFS so với lời -20,0 dBFS → nền thấp hơn lời ≈16,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,06 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~7,1 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 8,7 s (24%), 14,9 s (42%), 19,6 s (55%), 25,8 s (72%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
