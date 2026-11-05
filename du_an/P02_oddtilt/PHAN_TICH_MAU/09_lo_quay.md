# PHÂN TÍCH VIDEO MẪU 09 — Lò quay gà
File: `How.you.invented.the.rotisserie.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 f61695a1
Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)
Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng

> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).

## A. Kỹ thuật [ĐO]
| Mục | Giá trị |
|---|---|
| Thời lượng / khung / fps | 39,61 s / 720×1280 (9:16) / 30,0 fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |
| Loudness / true peak / LRA | -16,1 LUFS / -1,4 dBFS / 1,7 LU (đo trên bản đã qua TikTok nén lại) |
| Side − Mid | -21,2 dB |
| Khoảng lặng > 0,35 s (−40 dB) | 0 |
| Bão hoà / sáng trung vị (HSV 0–255) | 79,0 / 136,0 |
| Độ nét tương đối (tỉ lệ chi tiết mịn) | 0,44 |

## 1. Kịch bản
- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:

> You love cock, but it always comes out dry. So you, being a genius caveman, move your chicken further away from the fire. But one side stays raw and gives you food poisoning. So you push a stick through it and gradually turn it to cook it evenly. Clever! Except you have to keep doing that. So you rest the stick between two supports and add a handle. Now you can rotate it without holding it over the flames. But your arm is tired from earlier. So you connect a motor to your nuclear power plant. Much better. But you forget about it and it chars. So you install a sensor that adjusts the heat and stops cooking when it's done. Now it comes out moist every time!

- 128 từ; lời từ 0,0 s đến ≈39,07 s; **197,0 từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].
- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi "you"**, thường là câu nước đôi tình dục/thô tục [QS].
- Vòng "vấn đề → giải pháp": các câu mở bằng "But/Except" ở 1,5 s (4%), 8,5 s (21%), 16,5 s (42%), 25,0 s (63%), 30,8 s (78%) → **5 vòng vấn đề** [ĐO trên lời].
- Cụm nhận diện "genius" ở 4,64 s (12%) [ĐO].
- Câu khen ngắn chen giữa: genius (4,6 s), Clever! (15,6 s), better. (30,2 s) [ĐO].
- Kết: câu "Now …" nước đôi nối lại hook/người bạn, không có "Congratulations" [ĐO].
- Đặc biệt: Hook và kết đều chơi chữ tình dục (cock/moist).

## 2. Hình ảnh [QS]
- Bối cảnh: Bãi đất có đống đá xếp làm bếp lửa, cây tán tròn hoạt hình, lều trắng, tháp làm mát hạt nhân phía xa. Gà cách điệu bóng loáng.
- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].
- Màu: bão hoà trung vị 79,0, sáng 136,0 [ĐO].

## 3. Nhân vật [QS]
- Chính: nam hói, áo thun nâu, quần đen, giày trắng (hiện đại), mắt thành tim đỏ + nhỏ dãi khi thấy gà.
- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].

## 4. Shot / máy quay
- 8 shot; độ dài trung vị **4,85 s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].
- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên 53,4% · đẩy vào 41,6% · lùi 5,6% · lia ngang 1,9% · lia dọc 0,5% · tốc độ trung vị 2,6 px/s, p90 29,3 px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)

### Bảng theo nhịp truyện
| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |
|---|---|---|---|---|---|---|
| 0,0–3,4 | You LOVE cock, but it always comes out dry | Siêu cận mặt mắt tim, lưỡi thè | siêu cận, đẩy | "LOVE" hoa; mắt tim 2D | hook nước đôi | [QS] mốc lời [ĐO] |
| 3,4–11,9 | move chicken further away → one side raw → food poisoning | Gà trên đá cạnh lửa; nửa sống nửa chín; nhân vật xanh mặt, sóng mùi xanh | trung → cận | sóng xanh = buồn nôn | vấn đề 1 | [QS] mốc lời [ĐO] |
| 11,9–21,8 | push a stick through, turn it → "Clever!"; rest on supports + handle | Xiên gà quay tay trên lửa; giá chữ Y | trung cảnh ngang, máy đứng | phụ đề trắng 1–3 từ | giải pháp | [QS] mốc lời [ĐO] |
| 21,8–30,8 | arm tired → motor to nuclear power plant → "Much better" | Hộp động cơ xanh có biểu tượng phóng xạ; tháp làm mát | cận vật, cẩu lên tháp | phụ đề trắng 1–3 từ | leo thang phi lý | [QS] mốc lời [ĐO] |
| 30,8–37,0 | forget it, chars → sensor | Gà cháy đen; đồng hồ đo RAW–DONE | cận | đồng hồ đo | vấn đề cuối | [QS] mốc lời [ĐO] |
| 37,0–39,6 | Now it comes out moist every time! | Nhân vật giơ tay ăn mừng, mắt tim | trung cảnh | phụ đề trắng 1–3 từ | kết nước đôi | [QS] mốc lời [ĐO] |

### Bảng shot tự động [ĐO]
| # | Vào–ra (s) | Dài | Lời trong shot |
|---|---|---|---|
| 1 | 0–5,9 | 5,9 | You love cock, but it always comes out dry. So you, being a genius caveman, |
| 2 | 5,9–12,3 | 6,4 | move your chicken further away from the fire. But one side stays raw and gives you food poisoning. So you |
| 3 | 12,3–13,3 | 1,0 | push a stick through it |
| 4 | 13,3–21,6 | 8,3 | and gradually turn it to cook it evenly. Clever! Except you have to keep doing that. So you rest the stick between two supports and add a handle. |
| 5 | 21,6–29,87 | 8,27 | Now you can rotate it without holding it over the flames. But your arm is tired from earlier. So you connect a motor to your nuclear power plant. |
| 6 | 29,87–33,0 | 3,13 | Much better. But you forget about it and it chars. |
| 7 | 33,0–36,8 | 3,8 | So you install a sensor that adjusts the heat and stops cooking when it's done. |
| 8 | 36,8–39,61 | 2,81 | Now it comes out moist every time! |

## 5. Chuyển động
- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].
- Vật thể biến đổi tức thời theo lời (đồ vật "hiện ra", đổi hình dạng, mọc thêm bộ phận) — chuyển động "minh hoạ" hơn là vật lý thật [QS].

## 6. Dựng
- Đổi hình theo nhịp lời: mỗi "so you …" (giải pháp) và mỗi "But/Except" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].
- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].

## 7. Chữ trên màn hình
- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈749,0–786,0 px / 1280 (tâm ≈60% chiều cao); cao dải chữ ≈38,0 px [ĐO]; rộng trung vị 248,0 px, tối đa 371,0 px / 720 [ĐO].
- 57 cụm chữ; **trung vị 2,0 từ/cụm** (1 từ 25,0%, 2 từ 37,0%, ≥3 từ 39,0%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].
- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi "nảy" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].
- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].

## 8. Âm thanh
- Một giọng kể ngôi "you", nói liên tục, nhanh 197,0 từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị 165,0 Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].
- Mức nền giữa câu (0,02–0,12 s trước câu kế) trung vị -31,0 dBFS so với lời -19,9 dBFS → nền thấp hơn lời ≈11,0 dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].
- Độ đều nhịp phần percussive (tự tương quan onset) 0,07 [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].
- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).

## F. Vì sao hiệu quả [SL trừ khi ghi khác]
| Giai đoạn | Yếu tố | Mốc | Nhãn |
|---|---|---|---|
| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |
| Giữa | Vòng lặp "vấn đề → giải pháp" mỗi ~6,6 s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi "lỗi tiếp theo là gì?" | 1,5 s (4%), 8,5 s (21%), 16,5 s (42%), 25,0 s (63%), 30,8 s (78%) | [ĐO] mốc, [SL] tác dụng |
| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |
| Kết | "Congratulations! You've invented …" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |

## G. Chưa xác minh
- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.
- Lời là bản ASR chưa sửa tay; một số từ có thể sai.
