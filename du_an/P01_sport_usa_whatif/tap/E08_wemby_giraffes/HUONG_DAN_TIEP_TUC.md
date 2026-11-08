# E08 — Wemby vs 5 giraffes (NBA) — ĐANG DỰNG (08/11/2026)
- Kịch bản v1 đã duyệt (`kich_ban/kich_ban.md`). Giọng: Magnific "Sport USA" (eleven_v4, 226 credit) → `giong/goc.mp3` 68,44 s; giữ nguyên nghỉ.
- `am_thanh/giong.wav` (−16 LUFS, 48 kHz) → `am_thanh/giong_bip.wav` (câm "heck" 0,50–0,95 s + bíp 1 kHz). Mốc từ: `giong/words_tw.json`; phụ đề `chu/phu_de.ass`.
- Engine: `ep08.html` (36 shot + 4 cắt phụ, mốc `ep08_shots.js`), `ep08_gfx.html` (đồ hoạ safari). Bối cảnh mới `lib/thaonguyen.js` (sân thảo nguyên + hươu cao cổ `makeGiraffe`), dùng lại `lib/mua.js` (studioDesk, pressRoom — đã thêm tham số màu/chữ), nhân vật `lib/cast8.js`, động tác `lib/bongro_mx.js`.
- Cắt thử: `node render.js "ep08.html#nomb" out 30 0 1 540 960 <khung chẵn>` + `node dohoa_render.js ep08_gfx.html g 15 0 1027` → ghép ffmpeg (gfx + ASS + giong_bip).
- Ghi chú logic trận ảo: "Down one" + and-one (3 điểm) ⇒ thắng 2, nhưng lời nói "52–51". Bug tỉ số ẩn từ s27 để không lộ số; chờ chủ dự án quyết (giữ / tạo lại câu "Down two").
- Bước tiếp: chủ dự án duyệt bản cắt thử → render đủ 720x1280 có motion blur → nhạc CC0 + SFX → Kdenlive/melt → QA.
