# 🎙️ Lệnh Muse: nhân vật nhép miệng đúng theo giọng (Dave – Clogged Sink)

## Hiểu đúng trước khi chạy

| Cách | Muse làm gì | Nhép miệng | Giọng giữa các clip |
|---|---|---|---|
| **A. Muse tự nói** (giọng + hình tạo cùng lúc) | Tạo video kèm giọng nói, miệng khớp theo | ✅ Khớp tự nhiên | ⚠️ Gần giống, không khóa 100% |
| **B. Giọng TTS cố định → `audio_1`** | Tạo hình rồi **dán file giọng lên bằng ffmpeg** | ❌ Không khớp (chỉ hợp cảnh không lộ miệng) | ✅ Giống hệt |
| **C. Thử nghiệm: yêu cầu nhép theo `audio_1`** | Chưa có tài liệu xác nhận Muse làm được | ❓ Phải kiểm tra | ✅ Giống hệt nếu thành công |

**Chiến lược cho video này:**
- Cảnh Dave **nói trước camera** (clip 1, 4, 5) → **Cách A**, khóa giọng bằng cách đính kèm clip 1 làm mẫu giọng. Có thể thử **Cách C** trước.
- Cảnh **giọng đọc lồng, chỉ quay tay/bồn** (clip 2, 3) → **Cách B** với cùng giọng TTS, hoặc Cách A.

Tất cả gửi trong **cùng 1 cuộc chat Muse**, theo thứ tự. Muse sẽ nhớ Dave, căn bếp và giọng.

---

## LỆNH 1 — Thiết lập Dave + giọng chuẩn (gửi đầu tiên)

```
We are making a vertical 9:16 TikTok video with on-camera lip-synced dialogue, entirely in English, for a US audience. Do these setup steps now and attach every file you make.

CHARACTER "Dave": 45-year-old American man, short salt-and-pepper beard, light brown hair slightly grey at the temples, kind eyes, red-and-navy plaid flannel shirt with sleeves rolled to the elbows over a plain grey T-shirt.
SETTING: bright suburban American kitchen, white shaker cabinets, white subway-tile backsplash, stainless steel double sink under a window, granite countertop, warm morning daylight. Photorealistic smartphone-video look.

Step 1. Create dave_ref.png: 9:16, medium close-up of Dave at the sink, facing the camera straight on, mouth closed, relaxed smile, face well lit, sharp focus on his face. No text.
Step 2. Create sink_ref.png: 9:16, close-up of the left basin clogged with murky grey greasy water and a few food scraps, same kitchen. No people, no text.
Step 3. List the text-to-speech voices you can use, then choose the one that best fits: warm, calm, friendly American male, mid-40s, Midwestern accent, unhurried. Tell me the exact voice name you chose. From now on this is "DAVE_VOICE".
Step 4. With text to speech, single speaker, voice DAVE_VOICE, speed 95, language en, clean speech only (no music, no sound effects), create these five mp3 files, reading each text exactly, word for word. Save them directly in workspace/your_files/ and attach them:
- line1.mp3: "Sink clogged like this? Don't call a plumber yet. Five minutes, five bucks — I'll show you."
- line2.mp3: "First, scoop out the standing water. Then pour half a cup of baking soda right down the drain."
- line3.mp3: "Now one cup of white vinegar. Hear that fizz? That's it breaking down the grease."
- line4.mp3: "Plug it, wait fifteen minutes, then flush with hot water. Hot — not boiling — so you don't hurt your PVC pipes."
- line5.mp3: "And just like that — it's clear. Do this once a month and it won't clog again. What's broken at your place? Tell me in the comments."
Step 5. Tell me the exact duration of each mp3. If any is longer than 9.5 seconds, re-create it at speed 105.
```

> ✅ Bạn **nghe thử line1.mp3**. Nếu giọng chưa ưng, nhắn: `Try another male voice for DAVE_VOICE and redo all five mp3 files.`

---

## LỆNH 2 — Clip 1 (thử nhép miệng theo giọng TTS – Cách C)

```
Make clip1.mp4: animate dave_ref.png into a vertical 9:16 video, about 10 seconds, with audio_1 = line1.mp3.
Dave stands at the clogged sink, glances down at it, shakes his head slightly, then looks straight into the camera and SPEAKS the words of line1.mp3 himself, on camera.
LIP SYNC REQUIREMENTS:
- Dave's lips, jaw and facial expressions must move in exact sync with every syllable of line1.mp3, from its first word to its last word. His mouth is closed when the audio is silent.
- Use line1.mp3 as the ONLY voice, unchanged, word for word. Do not generate any new or different speech.
- Keep his face toward the camera (front or three-quarter view), medium close-up, face well lit, so the mouth is clearly visible the whole time he talks.
- Keep Dave's face, beard, hair, shirt and the kitchen exactly as in dave_ref.png.
- Quiet kitchen ambience under the voice, no music, no text on screen.
After you make it, check it yourself: does the mouth movement really follow line1.mp3, or was the audio only laid on top of a video where he talks differently or not at all? Tell me honestly which one it is.
```

**Muse trả lời thế nào → làm gì tiếp:**
- **"Miệng khớp theo line1.mp3"** → dùng Cách C cho clip 4 và 5 (LỆNH 4C, 6C).
- **"Chỉ dán tiếng lên / không khớp"** → chuyển sang Cách A (LỆNH 2A ngay dưới).

### LỆNH 2A — Clip 1, Muse tự nói (nếu Cách C không được)
```
The previous attempt did not lip-sync to the audio. Make clip1.mp4 again WITHOUT audio_1: animate dave_ref.png into a vertical 9:16 video, about 10 seconds, where Dave himself speaks on camera, with natural, precise lip sync, in a warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried — as close as possible to DAVE_VOICE. He glances down at the clogged sink, shakes his head, then looks straight into the camera and says exactly: "Sink clogged like this? Don't call a plumber yet. Five minutes, five bucks — I'll show you."
Front or three-quarter view, medium close-up, mouth clearly visible. Keep his face and the kitchen exactly as in dave_ref.png. Quiet kitchen ambience, no music, no text.
```

---

## LỆNH 3 — Clip 2 (giọng lồng, không lộ miệng – Cách B)

```
Make clip2.mp4: vertical 9:16, about 10 seconds, with audio_1 = line2.mp3 as the narration soundtrack exactly as it is (no other voice, no new speech). Nobody's mouth is visible on screen.
Visual: over-the-shoulder close-up of Dave's hands in yellow rubber gloves (red-and-navy plaid flannel sleeves visible, same kitchen as dave_ref.png) scooping murky water from the sink in sink_ref.png into a bucket, then pouring half a measuring cup of white baking soda down the drain. Time the pour to start when the voice says "Then pour". Realistic water and powder, soft water sounds under the voice, no music, no text.
```

---

## LỆNH 4 — Clip 3 (giọng lồng, bọt sủi – Cách B)

```
Make clip3.mp4: vertical 9:16, about 10 seconds, with audio_1 = line3.mp3 as the narration soundtrack exactly as it is (no other voice, no new speech). Nobody's mouth is visible on screen.
Visual: extreme close-up of the drain from sink_ref.png, now mostly emptied, a mound of baking soda over the drain hole; a yellow-gloved hand pours a cup of white vinegar and thick white foam fizzes up out of the drain, slow and satisfying. The foam erupts right when the voice says "Hear that fizz?". Loud crisp fizzing sound under the voice, no music, no text.
```

---

## LỆNH 5 — Clip 4 (Dave nói trước camera)

**5C – nếu Cách C đã thành công ở clip 1:**
```
Make clip4.mp4 the same way as clip1.mp4 (Dave speaks the audio himself, exact lip sync), with audio_1 = line4.mp3.
Start image: Dave from dave_ref.png at the same sink, holding a steaming electric kettle, a kitchen timer on the counter. Action: he glances at the timer, nods, looks into the camera and speaks every word of line4.mp3 in exact lip sync, then pours the hot water down the drain as he says "flush with hot water", steam rising. Mouth closed when the audio is silent. Front or three-quarter view, mouth clearly visible while speaking. Keep his face, shirt and the kitchen identical. No music, no text. Then check the lip sync yourself and tell me honestly.
```

**5A – nếu dùng Cách A (Muse tự nói), giữ giọng giống clip 1:**
📎 Đính kèm thêm `clip1.mp4` nếu Muse không tự lấy được
```
Make clip4.mp4: Dave speaks on camera with natural, precise lip sync. Use clip1.mp4 as the voice reference: his voice must sound like the SAME man as in clip1.mp4 — same pitch, accent, tone and pace.
Start image: Dave from dave_ref.png at the same sink, holding a steaming electric kettle, a kitchen timer on the counter. He glances at the timer, nods, looks into the camera and says exactly: "Plug it, wait fifteen minutes, then flush with hot water. Hot — not boiling — so you don't hurt your PVC pipes." Then pours the hot water down the drain, steam rising. Vertical 9:16, about 10 seconds, front or three-quarter view, mouth clearly visible. Keep his face, shirt and the kitchen identical to dave_ref.png. No music, no text.
```

---

## LỆNH 6 — Clip 5 (kết, Dave nói trước camera)

**6C – nếu Cách C thành công:**
```
Make clip5.mp4 the same way as clip1.mp4 (Dave speaks the audio himself, exact lip sync), with audio_1 = line5.mp3.
Start on a 2-second close-up of clear water swirling fast down the now-clean drain with a deep "glug-glug" sound, then the camera tilts up to Dave from dave_ref.png giving a thumbs-up and holding a baking soda box (no readable brand). As soon as his face is on screen he speaks every word of line5.mp3 in exact lip sync, grinning. Mouth closed when the audio is silent. Vertical 9:16, about 10 seconds. Keep his face, shirt and kitchen identical. No music, no text. Then check the lip sync yourself and tell me honestly.
```

**6A – nếu dùng Cách A:**
```
Make clip5.mp4: Dave speaks on camera with natural, precise lip sync, in the SAME voice as clip1.mp4 (same pitch, accent, tone and pace).
Start on a 2-second close-up of clear water swirling fast down the now-clean drain with a deep "glug-glug" sound, then the camera tilts up to Dave from dave_ref.png giving a thumbs-up, holding a baking soda box (no readable brand), grinning, and he says exactly: "And just like that — it's clear. Do this once a month and it won't clog again. What's broken at your place? Tell me in the comments." Vertical 9:16, about 10 seconds, mouth clearly visible while he talks. Keep his face, shirt and kitchen identical. No music, no text.
```

---

## LỆNH 7 — Kiểm tra & ghép (gửi cuối cùng)

```
Before editing, check all five clips yourself and report in a table: clip name, duration, is it 9:16 vertical, is the dialogue word for word correct, is Dave's face identical to dave_ref.png, and for clips 1, 4 and 5: does the mouth movement match the speech (yes/no). Redo any clip that fails, then:

Join clip1 → clip5 into clogged_sink_final.mp4: 1080x1920, 30 fps, H.264 + AAC, trim silent dead air between clips, keep each clip's audio exactly in sync with its picture (do not shift audio against video — that would break the lip sync).
Burn in English captions of every spoken line (bold white, black outline, around 70% of the frame height, never covering Dave's mouth, max 2 lines).
Add on-screen titles at the top: 0–3s "SINK CLOGGED? 😩"; 3–8s "Plumber: $250 ❌ → DIY: $5 ✅"; clip2 "Step 1: Scoop out the water" then "Step 2: ½ cup baking soda"; clip3 "Step 3: 1 cup white vinegar"; clip4 "Step 4: Plug it · wait 15 min" then "Step 5: Hot water (~160°F) — NOT boiling with PVC"; clip5 start "BEFORE / AFTER"; last 5 seconds "You saved $245 💰" and "What's broken at your place? 👇".
Light acoustic background music ducked about -20 dB under the voice; loudness about -14 LUFS.
Attach clogged_sink_final.mp4 and also keep clip1–clip5 and line1–line5.mp3 in the workspace.
```

---

## Mẹo để nhép miệng chuẩn hơn
- **Mặt hướng camera, trung cảnh/cận cảnh**, ánh sáng rõ mặt → khẩu hình khớp tốt nhất. Tránh quay nghiêng 90° hoặc xa.
- **Mỗi clip ≤ 25 từ**, giọng TTS ≤ 9,5 giây (đã có ở LỆNH 1, bước 5).
- Ghi rõ *"mouth closed when the audio is silent"* để tránh miệng mấp máy lúc im lặng.
- Khi ghép, **không dịch tiếng so với hình** (đã có trong LỆNH 7). Lệch 0,1–0,2 giây là mắt người thấy ngay.
- Nếu một clip lệch miệng: chỉ làm lại **clip đó**, nhắn:
  `Redo clipN.mp4: the lip sync is off. Same image and same audio, but make his mouth follow every syllable exactly, face toward the camera.`

## Claude QA khi bạn gửi file lên
- Trích khung hình mỗi 0,2 giây ở các đoạn Dave nói, đối chiếu độ mở miệng với dạng sóng âm thanh (âm to ↔ miệng mở) để phát hiện lệch tiếng/hình.
- Đo độ lệch tiếng-hình sau khi ghép; nếu lệch đều, Claude có thể tự chỉnh lại bằng ffmpeg.
- So giọng giữa các clip (cao độ trung bình) để phát hiện clip "lạc giọng".
- Kiểm tra chính tả phụ đề, chữ trên màn hình, khung 9:16, độ dài, âm lượng.
