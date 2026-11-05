# PHÂN TÍCH VIDEO MẪU 13 — Cái ô
File: `How.you.invented.the.umbrella.shorts.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 ad4936cf
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 61,63 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,5 dBFS / 1,9 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -19,7 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 68,0 / 156,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,53 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You're so wet and holding your hand above your head doesn't stop the rain. But you're a genius, so you hold a sheet of fabric above yourself. But it gets tiring holding two hands up, so you support the sheet with a stick and stretch it flat with thin ribs in a circle. Now you can hold it, but the rain pools and soaks into the center. You decide to slope the fabric downwards and apply a waterproof coating so the rain runs off the edges. But when you get home, it won't fit through your door, so you hire a wrecking ball to demolish your front wall, but quickly realize that the machines trample your front lawn. So you instead hinge the ribs at the top so they can fold down against the stick. But opening them one at a time is tedious. So you connect each rib to a support and attach all the supports to a sliding ring around the stick so they can open all together. A stranger asks to try it, but it snaps shut over their head and they walk into traffic. So you add a catch to avoid a lawsuit. Congratulations! You've invented the umbrella!

- 202 từ; lời từ 0,0 s đến ≈60,91 s; **199,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 4,7 s (8%), 8,9 s (14%), 17,4 s (28%), 26,4 s (43%), 32,6 s (53%), 40,9 s (66%), 52,6 s (85%) → **7 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 5,44 s (9%) [ĐO].
- Câu khen ngắn chen giữa: genius, (5,4 s), Congratulations! (58,2 s) [ĐO].
- Kết: "Congratulations! You've invented …" ở 58,24 s (95%) [ĐO].
- Đặc biệt: Dài nhất (61,6 s) và nhiều vòng vấn đề nhất (7) [ĐO].

## 2. Hình ảnh [QS]
- Bối cảnh: Sân trước nhà ngoại ô: tường kem, mái ngói đỏ, cửa nâu, lối đá trên cỏ, mưa (vệt mưa trắng); vỉa hè + đường nhựa; máy xúc vàng + quả tạ phá dỡ.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 68,0, sáng 156,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nữ hiện đại tóc buộc, áo thể thao xanh logo cam (giống nhân vật video bút bi), quần jean. Người lạ: nam vest đen.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 14 shot; độ dài trung vị **4,54 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 28,7% · đẩy vào 7,7% · lùi 5,6% · lia ngang 2,3% · lia dọc 0,2% · tốc độ trung vị 5,3 px/s, p90 17,7 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–8,9 | You're so wet… genius → hold a sheet of fabric | Nhân vật che đầu bằng tay dưới mưa; giơ tấm vải đỏ | trung cảnh, máy đứng | phụ đề trắng 1–3 từ | hook nước đôi | [QS] mốc lời [ĐO] |
| 8,9–20,4 | tiring → stick + thin ribs; rain pools center | Vải đỏ trên cán + nan; nhìn từ trên thấy vũng tím giữa ô | đứng; top-down | phụ đề trắng 1–3 từ | giải pháp 1 → vấn đề | [QS] mốc lời [ĐO] |
| 20,4–26,4 | slope + waterproof coating | Ô thành hình nón, nước chảy ra mép | trung cảnh | phụ đề trắng 1–3 từ | giải pháp 2 | [QS] mốc lời [ĐO] |
| 26,4–36,2 | won't fit door → wrecking ball → tramples lawn | Kẹt ở cửa; quả tạ phá tường; máy xúc đè vườn hoa | toàn cảnh | khói bụi | leo thang phi lý | [QS] mốc lời [ĐO] |
| 36,2–51,0 | hinge the ribs → tedious → sliding ring | Ô gập lên xuống trên nền trời trống; cận vòng trượt | cận vật, đứng | nan xanh lá đánh dấu | giải thích cơ chế | [QS] mốc lời [ĐO] |
| 51,0–58,2 | stranger asks… snaps shut… walks into traffic → catch to avoid lawsuit | Người lạ bị ô sập trùm đầu, bị xe tông bay lên | toàn cảnh | phụ đề trắng 1–3 từ | gag bạo lực | [QS] mốc lời [ĐO] |
| 58,2–61,6 | Congratulations! You've invented the umbrella! | Nhân vật cầm ô giơ tay trước nhà | trung cảnh | confetti | kết | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–4,77 | 4,77 | You're so wet and holding your hand above your head doesn't stop the rain. |
| 2 | 4,77–11,0 | 6,23 | But you're a genius, so you hold a sheet of fabric above yourself. But it gets tiring holding two hands up, |
| 3 | 11,0–16,1 | 5,1 | so you support the sheet with a stick and stretch it flat with thin ribs in a circle. |
| 4 | 16,1–20,4 | 4,3 | Now you can hold it, but the rain pools and soaks into the center. |
| 5 | 20,4–26,3 | 5,9 | You decide to slope the fabric downwards and apply a waterproof coating so the rain runs off the edges. |
| 6 | 26,3–29,3 | 3,0 | But when you get home, it won't fit through your door, |
| 7 | 29,3–32,77 | 3,47 | so you hire a wrecking ball to demolish your front wall, but |
| 8 | 32,77–34,9 | 2,13 | quickly realize that the machines trample |
| 9 | 34,9–36,6 | 1,7 | your front lawn. So you |
| 10 | 36,6–43,6 | 7,0 | instead hinge the ribs at the top so they can fold down against the stick. But opening them one at a time is tedious. |
| 11 | 43,6–50,97 | 7,37 | So you connect each rib to a support and attach all the supports to a sliding ring around the stick so they can open all together. |
| 12 | 50,97–56,3 | 5,33 | A stranger asks to try it, but it snaps shut over their head and they walk into traffic. So you add |
| 13 | 56,3–58,2 | 1,9 | a catch to avoid a lawsuit. |
| 14 | 58,2–61,63 | 3,43 | Congratulations! You've invented the umbrella! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈747,0–788,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈42,0 px [ĐO]; rộng trung vị 288,0 px, tối đa 617,0 px / 720 [ĐO].
- 83 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 16,0%, 2 từ 45,0%, ≥3 từ 40,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 199,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 136,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -38,0 dBFS so với lời -20,2 dBFS → nền thấp hơn lời ≈18,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,08 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~7,7 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 4,7 s (8%), 8,9 s (14%), 17,4 s (28%), 26,4 s (43%), 32,6 s (53%), 40,9 s (66%), 52,6 s (85%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
