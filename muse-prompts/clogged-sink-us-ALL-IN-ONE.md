# 🇺🇸 Lệnh "ALL-IN-ONE" cho Muse: tự làm hết, ra 1 video hoàn chỉnh

Muse là một **AI agent**: nó có không gian làm việc riêng, tự tạo ảnh, tạo video, chạy ffmpeg để ghép,
chèn chữ, phụ đề, nhạc. Vì vậy chỉ cần **dán 1 lệnh duy nhất** bên dưới vào muse.ai.

**Cách làm:**
1. Copy **nguyên khối LỆNH CHÍNH** dán vào muse.ai, bấm gửi.
2. Nếu Muse hỏi xác nhận / xin quyền (chạy lệnh, tạo file), bấm **Allow / Approve**.
3. Muse làm xong sẽ đưa 2 file: `clogged_sink_final.mp4` và `thumbnail.png`. Tải về.
4. Gửi 2 file đó lên đây → Claude **QA** (kiểm tra khung hình, độ dài, âm thanh, phụ đề, chính tả, nhân vật nhất quán…) và báo lỗi + câu lệnh sửa gửi lại cho Muse.

> Nếu Muse dừng giữa chừng (hết lượt hoặc quá dài), xem **Phương án dự phòng** ở cuối file.

---

## LỆNH CHÍNH (copy toàn bộ khối này)

```
You are my video producer. Produce ONE finished, ready-to-post vertical TikTok video for a US audience aged 35+, entirely in English, then export it. Do all steps yourself, end to end, without asking me questions unless something is impossible. Work step by step and show me each image before you animate it only if you are unsure; otherwise keep going.

=== CONCEPT ===
Title: "Clogged Sink? Don't Call a Plumber Yet!"
A friendly American dad unclogs a greasy kitchen sink with baking soda, vinegar and hot water. Money hook: "Plumber: $250 / DIY: $5".

=== CHARACTER (keep 100% identical in every shot) ===
"Dave": 45-year-old American man, short salt-and-pepper beard, light brown hair slightly grey at the temples, kind eyes, red-and-navy plaid flannel shirt with sleeves rolled to the elbows over a plain grey T-shirt. Yellow rubber gloves when handling the sink.
Voice (identical in every clip): warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried.

=== SETTING (identical in every shot) ===
Bright suburban American kitchen: white shaker cabinets, white subway-tile backsplash, stainless steel double sink under a window, granite countertop, warm morning daylight. Photorealistic smartphone-video look, natural colors.

=== METHOD ===
1. First create a reference image of Dave in the kitchen (9:16) and a reference image of the clogged sink (murky grey greasy water, a few food scraps, not draining). Use these two images as references for EVERY following image so Dave's face, clothes and the kitchen never change.
2. For each of the 5 scenes below: create a 9:16 start image from the references, then animate it into a ~10-second 9:16 video with sound and the exact dialogue (natural lip sync when Dave is on camera). Never put any text, letters, logos or watermarks inside the generated images or videos.
3. If a generated shot changes Dave's face, the kitchen, or is not 9:16 vertical, regenerate it before moving on.

=== SCENES (exact dialogue, keep word for word) ===
SCENE 1 (hook) – Start image: Dave at the clogged sink, half-smile, gesturing at the murky water. Action: he glances at the sink, shakes his head, looks into the camera.
Dialogue (on camera): "Sink clogged like this? Don't call a plumber yet. Five minutes, five bucks — I'll show you."

SCENE 2 – Start image: over-the-shoulder close-up, gloved hands scooping murky water into a bucket; an orange box of baking soda (no readable brand) and a measuring cup beside the sink. Action: scoop out the water, then pour half a cup of baking soda down the drain.
Dialogue (voice-over): "First, scoop out the standing water. Then pour half a cup of baking soda right down the drain."

SCENE 3 – Start image: extreme close-up of the drain with a mound of baking soda, a gloved hand holding a cup of white vinegar. Action: pour the vinegar; thick white foam fizzes up out of the drain, slow and satisfying, loud crisp fizzing sound.
Dialogue (voice-over): "Now one cup of white vinegar. Hear that fizz? That's it breaking down the grease."

SCENE 4 – Start image: Dave holding a steaming electric kettle over the drain, a damp towel next to the drain, a kitchen timer on the counter. Action: he glances at the timer, nods, pours hot water down the drain, steam rising.
Dialogue (on camera): "Plug it, wait fifteen minutes, then flush with hot water. Hot — not boiling — so you don't hurt your PVC pipes."

SCENE 5 – Start image: close-up of clear water swirling fast down the now-clean drain, then Dave with a thumbs-up holding the baking soda box. Action: deep "glug-glug" draining sound, camera tilts up to Dave grinning.
Dialogue (on camera): "And just like that — it's clear. Do this once a month and it won't clog again. What's broken at your place? Tell me in the comments."

=== EDIT (use ffmpeg in your workspace) ===
- Join scenes 1→5 in order into one 1080x1920 (9:16) MP4, H.264 video + AAC audio, 30 fps. Trim silent dead air at the start/end of each clip. Target total length 45–55 seconds.
- Burned-in English captions of every spoken line, synced to the voice: bold white sans-serif text with a black outline, lower-middle of the frame (around 70% height, never covering faces), max 2 lines, max ~6 words per line.
- On-screen text overlays (bold, large, high-contrast, top area of the frame, above the captions):
  • 0–3s: "SINK CLOGGED? 😩"
  • 3–8s: "Plumber: $250 ❌  →  DIY: $5 ✅"
  • during scene 2, first half: "Step 1: Scoop out the water"
  • during scene 2, second half: "Step 2: ½ cup baking soda"
  • during scene 3: "Step 3: 1 cup white vinegar"
  • scene 4, first part: "Step 4: Plug it · wait 15 min"
  • scene 4, second part: "Step 5: Hot water (~160°F) — NOT boiling with PVC"
  • scene 5, start: "BEFORE / AFTER" (with a short "ding" sound effect)
  • last 5 seconds: "You saved $245 💰" and below it "What's broken at your place? 👇"
- Background music: light, upbeat acoustic / home-improvement style, royalty-free or generated by you, ducked low under the voice (voice clearly dominant, music around -20 dB relative). No music over the foam fizz in scene 3 for the first 2 seconds.
- Normalize loudness to about -14 LUFS. No clipping.
- Spell-check every overlay and caption (US English).

=== THUMBNAIL ===
Create thumbnail.png, 1080x1920: split screen – left half the clogged sink, right half the clean sink with clear water swirling down; Dave peeking in from the lower right with a surprised, delighted face. Add the title at the top in huge bold letters with strong outline: "PLUMBER: $250" (line 1, red) and "DIY: $5" (line 2, green). Text must be spelled exactly like that.

=== DELIVERABLES ===
Give me download links to:
1. clogged_sink_final.mp4 (the finished video)
2. thumbnail.png
3. A short report: final duration, resolution, and the list of scenes with their start times.
Also keep the 5 raw scene clips in the workspace in case I need fixes.
```

---

## Phương án dự phòng (nếu Muse không làm hết trong 1 lần)

Gửi lần lượt từng câu sau **trong cùng cuộc chat** (Muse vẫn nhớ toàn bộ yêu cầu ở trên):

**Nếu Muse dừng sau khi tạo một số cảnh:**
```
Continue exactly where you stopped. Finish the remaining scenes with the same Dave, same voice and same kitchen, then do the full EDIT and THUMBNAIL steps and give me the download links.
```

**Nếu Muse không chạy được ffmpeg / không ghép được:**
```
You can't edit, that's fine. Just give me download links to the 5 raw scene videos (scene1.mp4 … scene5.mp4) and the thumbnail image without text. I will edit them elsewhere.
```
→ Khi đó gửi 5 clip lên cho Claude, Claude sẽ tự ghép, thêm phụ đề, chữ, nhạc.

**Nếu Muse báo hết lượt trong tuần:** gửi lên những gì đã có, chờ hạn mức reset rồi gửi câu "Continue exactly where you stopped…".

---

## Claude sẽ QA những gì khi bạn gửi file lên

| Hạng mục | Tiêu chí đạt |
|---|---|
| Định dạng | 1080×1920 (9:16), H.264 + AAC, 45–55 giây |
| Âm thanh | Có tiếng ở mọi cảnh, giọng rõ hơn nhạc, không rè/không vỡ, độ lớn ~-14 LUFS |
| Lời thoại | Đúng từng chữ so với kịch bản (Claude nghe lại bằng chuyển giọng nói thành chữ) |
| Phụ đề | Khớp lời nói, không che mặt, không sai chính tả |
| Chữ trên màn hình | Đủ 9 mốc, đúng thứ tự, đúng chính tả, đọc được trên điện thoại |
| Nhân vật | Mặt, râu, áo Dave giống nhau ở mọi cảnh |
| Bối cảnh | Cùng một căn bếp, không đổi màu tủ/bồn |
| Lỗi AI | Tay/ngón tay méo, chữ lạ trên bao bì, nước/bọt trông giả, khép miệng lệch thoại |
| Ảnh bìa | Đúng chữ "PLUMBER: $250 / DIY: $5", đọc rõ ở kích thước nhỏ |
| An toàn nội dung | Có cảnh báo không dùng nước sôi với ống PVC |

Mỗi lỗi tìm thấy, Claude sẽ đưa kèm **câu lệnh sửa bằng tiếng Anh** để bạn dán lại vào Muse.
