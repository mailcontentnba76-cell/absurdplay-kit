# PHÂN TÍCH FILE NỀN ÂM THANH CHỦ DỰ ÁN GỬI (05/11/2026)
File: `f0136cfb-1028_14.MP3` (chủ dự án gửi qua chat, nói là "nhạc của kênh"). MP3 192 kbps, 44,1 kHz stereo, 34,17 s, LAME 3.101. Không đưa file vào kho (âm thanh của bên thứ ba).
Công cụ: ffmpeg ebur128/showspectrumpic, librosa 0.11 (HPSS, chroma CQT, pyin, onset), Parakeet-TDT (ASR).

## Đây là gì
- **Phần nền (nhạc + SFX) tách ra từ video 02 "điều hoà"**, không phải bản nhạc gốc sạch [ĐO]: tăng âm lượng rồi chạy ASR đọc được gần nguyên lời video 02 ("Your ass is sweating, so you bring out your fan…", "…Now your friend comes inside every day") → còn sót giọng. Thời lượng 34,17 s ≈ video 02 (34,27 s).
- Mức: −33,1 LUFS, đỉnh −9,2 dBFS, LRA 8,7 LU; **thấp hơn bản trộn video 02 khoảng 18,7 dB** (trung vị theo đoạn 0,5 s) [ĐO] — khớp số đo "nền thấp hơn lời ~16 dB" ở TONG_HOP.
- Nền chạy liên tục suốt video (RMS mỗi 0,5 s phần lớn −32 … −45 dBFS, không có đoạn tắt) [ĐO].

## Nhạc
| Đặc điểm | Số đo | Nhãn |
|---|---|---|
| Giọng (key) | C trưởng 0,78 / F trưởng 0,72 (Krumhansl); chroma mạnh nhất C, G, F, A#, A → **F trưởng hoặc C trưởng (C mixolydian)** | [ĐO], kết luận [SL] |
| Nốt hay gặp | bass F2, C3; giai điệu G4, C5, A4, A#3, F4 | [ĐO pyin, có lẫn giọng sót] |
| Trống / nhịp | độ đều onset 0,13 (rất thấp); hài âm hơn bộ gõ 2,2 dB → **không có trống/beat rõ** | [ĐO] |
| Âm sắc | các nốt rời 0,3–1 s có hài âm, bass tròn ở 30–150 Hz từng cụm → nhạc cụ gảy/gõ có cao độ (kiểu pizzicato/marimba/ukulele) | [SL] — cần tai người xác nhận |
| Tâm phổ | 0,4–1,2 kHz ở phần lớn thời gian (ấm, không chói) | [ĐO] |

## SFX nghi ngờ (từ ảnh phổ + onset)
| Mốc (s) | Dấu hiệu đo được | Lời video 02 lúc đó | Đoán | Nhãn |
|---|---|---|---|---|
| 2,5–5,0 | nhiễu dải rộng tới >8 kHz, tâm phổ ~3 kHz | "it just blows hot air at you" | tiếng gió/thổi | [ĐO] dấu hiệu, [SL] loại |
| ~5,3 | tiếng quét cao độ đi lên 3–5 kHz | trước "Clever!" (6,3 s) | "whoosh/sparkle" | [SL] |
| 14,4 · 14,8 · 17,7 | onset mạnh | "But it's just putting all that heat back…" | stinger vấn đề | [SL] |
| 26,0 · 28,2 · 29,6 | onset mạnh | "But it works too well and he starts freezing" | stinger / tiếng run lạnh | [SL] |

## Kết luận dùng cho P02
- Không dùng lại file này (âm thanh của kênh khác, lại lẫn giọng).
- Nhạc mới cần: F trưởng (hoặc C), không trống, nhạc cụ gảy có cao độ + bass tròn, năng lượng đều, đặt thấp hơn lời ~16–19 dB; SFX ngắn ở các câu "But/Except" và câu khen.
- Đã tạo 2 bản ứng viên bằng Magnific (ElevenLabs Music v2, 60 s, instrumental, 1.200 credit/bản): A = pizzicato + marimba, B = ukulele + glockenspiel. Chưa đo được vì máy chủ tải file của Magnific (`pikaso.cdnpk.net`) bị chặn trong phiên.

## So sánh 2 bản ứng viên (đo 05/11/2026, file chủ dự án tải từ Magnific)
| Chỉ số [ĐO] | Nền mẫu (video 02) | "Inventing Winks and Giggles" (A, pizzicato+marimba) | "The Curious Ukulele Conundrum" (B, ukulele+glock) |
|---|---|---|---|
| Thời lượng / loudness | 34,2 s / −33,1 LUFS (đã bị hạ dưới lời) | 60,0 s / −19,1 LUFS | 60,0 s / −14,9 LUFS |
| Giọng (Krumhansl top 2) | C trưởng 0,78 · F trưởng 0,72 | C trưởng 0,78 · F trưởng 0,73 | C trưởng 0,82 · La thứ 0,55 |
| Độ đều nhịp (0–1) | 0,13 | 0,87 (~92 bpm) | 0,86 (~96 bpm) |
| Hài âm − bộ gõ | 2,2 dB | 8,3 dB | 12,5 dB |
| Tâm phổ | 707 Hz | 480 Hz | 939 Hz |
| Phân bố năng lượng bass <150 / mid 150–2k / cao >4k (dB so tổng) | −7,2 / −1,4 / −12,7 | −1,5 / −5,4 / −49,8 | −5,2 / −1,6 / −29,7 |

**Chọn B** [CHỌN]: phân bố phổ gần mẫu nhất (năng lượng dồn ở dải giữa, bass phụ), tâm phổ 939 Hz gần 707 Hz; A nặng bass, gần như không có dải cao → dễ đục và lấn lời. Giọng nhạc của A khớp hơn, nhưng dưới lời điều này ít quan trọng hơn âm sắc. Khác biệt còn lại của cả hai: có nhịp gảy đều (~0,86) trong khi nền mẫu không có nhịp đều → khi trộn đặt thấp hơn lời 16–19 dB; nếu nghe vẫn "nhịp" hơn mẫu thì tạo lại với yêu cầu "rubato, no steady pulse".
File lưu cục bộ ở `tai_nguyen/nhac/` (không đẩy mp3 lên kho).
