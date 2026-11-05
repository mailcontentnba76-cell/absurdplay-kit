# DEMO nội bộ — dựng lại "the door" (mẫu 06) để kiểm quy trình. KHÔNG ĐĂNG.
Theo yêu cầu chủ dự án 05/11/2026: lời giữ nguyên mẫu, chỉ để so cạnh mẫu.

## Giọng (Magnific, giọng "Odd Tilt", chủ dự án tạo) — đo 05/11/2026
| Chỉ số [ĐO] | File gốc | Sau xử lý `giong.wav` | Mẫu 06 |
|---|---|---|---|
| Thời lượng | 38,35 s | 33,31 s | 33,1–33,2 s |
| Từ/phút | 189 | ≈ 218 | 219 |
| Khoảng lặng > 0,35 s | 4 (0,38–0,51 s ở 12,2 / 20,3 / 25,8 / 36,1 s) | 0 | 0 |
| Loudness | −20,8 LUFS, mono 44,1 kHz | (chuẩn hoá khi trộn) | −16 LUFS |
| Lệch mốc từng từ so với mẫu | — | trung vị 0,08 s, tối đa 0,48 s | — |
| F0 trung vị | — | 197 Hz | 175 Hz (đo trên bản trộn) |
Xử lý: `silenceremove` rút mọi nghỉ > 0,15 s về 0,12 s → `atempo=1.1087`. Mốc từng từ: `am_thanh/words.json` (Parakeet, 121/121 từ khớp lời).
Chưa nghe kiểm độ tự nhiên sau khi tăng tốc 10,9 % — chủ dự án cần nghe `am_thanh/giong.wav`.
