# 🇺🇸 "Clogged Sink? Don't Call a Plumber Yet!" — Bộ lệnh chạy trên Muse (muse.ai)

Video dọc 9:16 · khoảng 50 giây · 100% tiếng Anh · thị trường Mỹ · người xem 35+

---

## 0. Cách dùng (đọc trước)

1. Mỗi khối `code` bên dưới là **một lệnh**. Copy **nguyên khối** dán vào ô chat của muse.ai.
2. Làm **theo đúng thứ tự**: Bước 1 (nhân vật) → Bước 2 (5 clip) → Bước 3 (ảnh bìa).
3. Khi lệnh ghi **"📎 Đính kèm: …"**, bấm nút đính kèm (+ / 📎) trong Muse và chọn ảnh đã tạo trước đó.
   Muse sẽ gọi ảnh đính kèm đầu tiên là *image_1*, ảnh thứ hai là *image_2*.
4. Mỗi video Muse tạo dài **khoảng 10 giây, có tiếng**. 5 clip ghép lại thành khoảng 50 giây.
5. Tải từng file về và **đặt tên đúng như ghi chú** (`dave.webp`, `clip1.mp4`…), rồi gửi lên đây để Claude ghép, thêm phụ đề, chữ và nhạc.
6. **Không** yêu cầu Muse viết chữ lên hình. Chữ sẽ được chèn ở bước hậu kỳ cho sạch và đúng chính tả.

> 💡 Tiết kiệm lượt: tạo **ảnh** trước (rẻ), ưng ý rồi mới **animate thành video** (tốn hơn).
> Nếu một ảnh chưa đẹp, bấm tạo lại ảnh, đừng tạo video từ ảnh xấu.

---

## BƯỚC 1 — Tạo nhân vật & bối cảnh cố định

### 1A. Nhân vật "Dave" → lưu thành `dave.webp`
```
In exactly 9:16 aspect ratio (vertical). A photorealistic medium shot of "Dave", a friendly 45-year-old American man: short salt-and-pepper beard, light brown hair slightly grey at the temples, kind eyes, red-and-navy plaid flannel shirt with the sleeves rolled to the elbows, plain grey T-shirt underneath. He stands in a bright suburban American kitchen with white shaker cabinets, a white subway-tile backsplash, a stainless steel double sink under a window, and a granite countertop. Warm morning daylight from the window. He smiles at the camera, relaxed and trustworthy, like a neighbor who fixes everything himself. Smartphone video look, natural colors, shallow depth of field. No text, no logos, no watermark.
```

### 1B. Bồn rửa bị tắc → lưu thành `sink_clogged.webp`
📎 Đính kèm: `dave.webp`
```
In exactly 9:16 aspect ratio (vertical). Use the same kitchen as in image_1 (same white shaker cabinets, subway tiles, stainless steel double sink, window, granite counter, same warm morning light). A close-up shot looking down into the left basin of the sink: it is completely clogged, filled with murky greyish water with a greasy film on top, a few small food scraps floating, the water is not draining at all. Photorealistic, smartphone video look. No people, no text, no logos.
```

---

## BƯỚC 2 — 5 clip video (mỗi clip ~10 giây)

Mỗi clip có **2 lệnh**: lệnh (a) tạo **ảnh khung đầu**, lệnh (b) **animate** ảnh đó thành video có thoại.

> 🎙️ Giọng Dave phải giống nhau ở mọi clip. Câu mô tả giọng đã có sẵn trong từng lệnh, đừng xóa:
> *"a warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried"*

---

### CLIP 1 — Hook (0–10s) → `clip1.mp4`

**(a) Ảnh khung đầu → `clip1_start.webp`**
📎 Đính kèm: `dave.webp` (image_1), `sink_clogged.webp` (image_2)
```
In exactly 9:16 aspect ratio (vertical). Dave from image_1 stands at the clogged kitchen sink from image_2, leaning slightly toward the camera with a knowing half-smile, one hand gesturing toward the murky water in the sink. Keep Dave's face, beard, hair and plaid flannel shirt exactly as in image_1, and keep the kitchen and the clogged sink exactly as in image_2. Medium close-up, warm morning daylight, photorealistic smartphone video look. No text, no logos.
```

**(b) Video**
📎 Đính kèm: `clip1_start.webp`
```
Animate image_1 in exactly 9:16 aspect ratio (vertical), about 10 seconds. Dave glances down at the clogged sink, shakes his head slightly, then looks straight into the camera and says in a warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried: "Sink clogged like this? Don't call a plumber yet. Five minutes, five bucks — I'll show you." Natural lip sync. Keep his face and the kitchen exactly as in image_1. Subtle handheld camera, quiet kitchen ambience, no music, no on-screen text.
```

---

### CLIP 2 — Múc nước + baking soda (10–20s) → `clip2.mp4`

**(a) Ảnh khung đầu → `clip2_start.webp`**
📎 Đính kèm: `dave.webp`, `sink_clogged.webp`
```
In exactly 9:16 aspect ratio (vertical). Close-up over the shoulder of Dave from image_1 at the clogged sink from image_2: his hands in yellow rubber gloves hold a plastic cup scooping murky water out of the sink into a bucket on the counter; an orange box of baking soda and a glass measuring cup sit beside the sink. Keep the plaid flannel sleeves and the kitchen exactly as in the images. Warm morning daylight, photorealistic smartphone video look. No readable brand names, no text.
```

**(b) Video**
📎 Đính kèm: `clip2_start.webp`
```
Animate image_1 in exactly 9:16 aspect ratio (vertical), about 10 seconds. Dave's gloved hands scoop the standing water out of the sink into the bucket until only a little is left around the drain, then pour half a measuring cup of white baking soda straight down the drain. Off-screen, the same warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried, says: "First, scoop out the standing water. Then pour half a cup of baking soda right down the drain." Realistic water and powder physics, soft water sounds, no music, no on-screen text.
```

---

### CLIP 3 — Giấm sủi bọt (20–30s) → `clip3.mp4`

**(a) Ảnh khung đầu → `clip3_start.webp`**
📎 Đính kèm: `sink_clogged.webp`
```
In exactly 9:16 aspect ratio (vertical). Extreme close-up of the stainless steel sink drain from image_1, now mostly emptied of water, with a small mound of white baking soda over the drain hole. A hand in a yellow rubber glove holds a glass measuring cup full of clear white vinegar, about to pour. Warm morning daylight, macro detail, photorealistic smartphone video look. No text, no logos.
```

**(b) Video**
📎 Đính kèm: `clip3_start.webp`
```
Animate image_1 in exactly 9:16 aspect ratio (vertical), about 10 seconds. The gloved hand slowly pours the cup of white vinegar onto the baking soda; thick white foam immediately fizzes and bubbles up out of the drain, crackling and hissing. Slow, satisfying close-up, the foam rising for several seconds. Off-screen, the same warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried, says: "Now one cup of white vinegar. Hear that fizz? That's it breaking down the grease." Loud, crisp fizzing sound, no music, no on-screen text.
```

---

### CLIP 4 — Bịt lỗ, chờ, dội nước nóng (30–40s) → `clip4.mp4`

**(a) Ảnh khung đầu → `clip4_start.webp`**
📎 Đính kèm: `dave.webp`, `sink_clogged.webp`
```
In exactly 9:16 aspect ratio (vertical). Dave from image_1 at the sink from image_2 holds a steaming electric kettle above the drain, a damp kitchen towel pushed aside next to the drain, a kitchen timer on the counter. Keep Dave's face, beard and plaid flannel shirt exactly as in image_1 and the kitchen exactly as in image_2. Medium shot, warm morning daylight, light steam, photorealistic smartphone video look. No text, no logos.
```

**(b) Video**
📎 Đính kèm: `clip4_start.webp`
```
Animate image_1 in exactly 9:16 aspect ratio (vertical), about 10 seconds. Dave glances at the kitchen timer, nods, then slowly pours hot water from the kettle down the drain, steam rising. He says to the camera in the same warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried: "Plug it, wait fifteen minutes, then flush with hot water. Hot — not boiling — so you don't hurt your PVC pipes." Natural lip sync, keep his face exactly as in image_1, pouring water sound, no music, no on-screen text.
```

---

### CLIP 5 — Kết quả + kêu gọi bình luận (40–50s) → `clip5.mp4`

**(a) Ảnh khung đầu → `clip5_start.webp`**
📎 Đính kèm: `dave.webp`, `sink_clogged.webp`
```
In exactly 9:16 aspect ratio (vertical). Dave from image_1 stands proudly at the same sink from image_2, which is now clean and shiny, clear water swirling down the open drain. He holds the orange box of baking soda in one hand and gives a thumbs-up with the other, smiling at the camera. Keep his face, beard and plaid flannel shirt exactly as in image_1 and the kitchen exactly as in image_2. Warm morning daylight, photorealistic smartphone video look. No readable brand names, no text.
```

**(b) Video**
📎 Đính kèm: `clip5_start.webp`
```
Animate image_1 in exactly 9:16 aspect ratio (vertical), about 10 seconds. Start on a close-up of clear water swirling quickly down the drain with a deep gurgling "glug-glug" sound, then the camera tilts up to Dave, who grins and says in the same warm, calm, friendly American male voice, mid-40s, Midwestern accent, unhurried: "And just like that — it's clear. Do this once a month and it won't clog again. What's broken at your place? Tell me in the comments." Natural lip sync, keep his face exactly as in image_1, no music, no on-screen text.
```

---

## BƯỚC 3 — Ảnh bìa (thumbnail) → `thumb.webp`
📎 Đính kèm: `sink_clogged.webp`, `dave.webp`
```
In exactly 9:16 aspect ratio (vertical). A split-screen photo divided vertically down the middle: on the left, the clogged sink from image_1 full of murky greasy water; on the right, the same sink perfectly clean with clear water swirling down the drain. In the lower third, Dave from image_2 peeks in from the right edge with a surprised, delighted expression. Keep the top third of the image as clean, softly blurred kitchen background (empty space for a title added later). Photorealistic, bright, high contrast, warm daylight. No text, no logos.
```

---

## BƯỚC 4 — Hậu kỳ (Claude làm khi bạn gửi file lên)

Gửi lên: `clip1.mp4` … `clip5.mp4` và `thumb.webp`. Claude sẽ:

**Ghép 5 clip** (cắt bớt khoảng lặng đầu/cuối mỗi clip) và thêm:

| Thời điểm | Chữ trên màn hình (tiếng Anh) |
|---|---|
| 0–3s | **SINK CLOGGED? 😩** |
| 3–8s | Plumber: **$250** ❌ → DIY: **$5** ✅ |
| 10–15s | **Step 1:** Scoop out the water |
| 15–20s | **Step 2:** ½ cup baking soda |
| 20–30s | **Step 3:** 1 cup white vinegar 🫧 |
| 30–34s | **Step 4:** Plug it · wait 15 min ⏱️ |
| 34–40s | **Step 5:** Hot water (~160°F) ⚠️ *Not boiling with PVC pipes* |
| 40–44s | **BEFORE / AFTER** + tiếng "ding" |
| 44–50s | 💡 Do it once a month · **You saved $245** 💰 · *What's broken at your place? 👇* |

- **Phụ đề tiếng Anh** chạy theo lời thoại (chữ to, nền tối, dễ đọc khi tắt tiếng).
- **Nhạc nền** nhẹ kiểu acoustic/home-improvement, âm lượng thấp dưới giọng nói.
- **Ảnh bìa:** chèn tiêu đề **"PLUMBER: $250 / DIY: $5"** vào khoảng trống phía trên `thumb.webp`.

---

## BƯỚC 5 — Đăng TikTok (thị trường Mỹ)

**Caption:**
```
Clogged sink? Don't call a plumber yet 🪠 5 minutes, $5, stuff you already have. Save this for when you need it! What should I fix next? 👇
```

**Hashtags:**
```
#diy #lifehacks #homehacks #cleaninghacks #plumbing #homeowner #dadhacks #savemoney #kitchenhacks #fyp
```

**Bình luận ghim (an toàn, tạo uy tín):**
```
⚠️ Safety: NEVER mix vinegar with bleach — it makes toxic gas. And if your sink is clogged by hair or a solid object, this won't work — you'll need a drain snake (that's next episode 👀).
```

**Giờ đăng gợi ý (giờ Mỹ – ET):** tối 7–10 PM các ngày trong tuần, hoặc sáng cuối tuần 9–11 AM.
→ Đổi sang giờ Việt Nam: 7–10 PM ET ≈ **7–10 giờ sáng hôm sau** (theo giờ chuẩn, tháng 11–3).

**A/B câu mở (nếu muốn thử 2 bản):**
- A: *"Sink clogged like this? Don't call a plumber yet."*
- B: *"A plumber quoted me $250. I fixed it for five bucks."* → thay câu thoại trong lệnh 1(b).

---

## Xử lý sự cố trên Muse

| Vấn đề | Cách sửa |
|---|---|
| Ra khung ngang, không phải dọc | Giữ nguyên câu đầu *"In exactly 9:16 aspect ratio (vertical)"*; nhắn thêm: *"Redo it in exactly 9:16 vertical."* |
| Mặt Dave khác nhau giữa các clip | Luôn đính kèm `dave.webp`; thêm câu: *"Keep his face identical to image_1."* |
| Muse tự viết chữ lên hình | Nhắn: *"Same image, but remove all text and letters."* |
| Giọng khác nhau giữa các clip | Không sửa câu mô tả giọng; nếu vẫn lệch, Claude có thể lồng lại một giọng đọc thống nhất ở hậu kỳ. |
| Lời thoại bị cắt hoặc nói quá nhanh | Rút ngắn câu thoại (tối đa ~25 từ cho 10 giây). |
| Muse từ chối tạo | Đổi cách diễn đạt, bỏ các từ như "toxic/chemical"; đừng gửi lại y nguyên. |
| Bọt giấm trông giả | Tạo lại clip 3; thêm *"realistic, slow-motion foam, macro lens"*. |
