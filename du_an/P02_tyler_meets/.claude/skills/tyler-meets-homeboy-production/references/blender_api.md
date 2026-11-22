# Blender API dùng cho series (tools/hb)

Chạy Blender ở chế độ nền: `"$BLENDER" -b --python <script.py> -- <tham số>`. Mỗi scene script dựng **một lần** toàn bộ set và nhân vật, rồi với mỗi cảnh làm theo thứ tự: `reset()` (trả mọi vật về tư thế gốc, xóa keyframe) → gọi hàm cảnh `KEY(n)` → render khung 1..n.

## Nhân vật — `Char(name, skin, shirt, pants, shoes, hair, ...)` (hb_lib)
- **Tham số:**
  - `hair_style`: messy | buzz | waves | ponytail | bun | beanie | bald
  - `print_img`: PNG in lên áo
  - `build`: độ to người
  - `sleeves`, `long_sleeves`, `jacket` (áo khoác mở), `chain`, `tie`, `glasses`, `mustache`, `headband`, `wraps`, `scrunchie`, `beanie` (màu mũ len)
  - `female=True`: mi mắt, bông tai, lọn tóc mảnh
  - `mood`: biểu cảm mặc định
- **Khớp** (`c.j[...]`): root, hips, chest, head, sh_L/R, el_L/R, hand_L/R, hip_L/R, kn_L/R. Đồ cầm tay: parent vào `el_R`, tọa độ local khoảng `(0, -0.02, -0.33)` (vị trí bàn tay).
- **Biểu cảm:** `c.expr(name, f)` với neutral, deadpan, annoyed, angry, shock, yell, smug, focused, happy, sad, chill. Chớp mắt: `c.blink(f)`. Miệng nhai hoặc nói: keyframe `c.mouth.scale`.
- **Tư thế:** `c.place(f, x, y, z, yaw)`, `c.stand(f)`, `c.sit(f, arms_on_desk)`, `c.pose(f, sh_R=(x, y, z), ...)` (độ), `c.rot(joint, f, x, y, z)`, `c.walk(f0, f1, p0, p1)` (tự quay theo hướng đi), `c.guard`/`c.punch`/`c.combo` (đấm).
- **Hướng mặt:** vector = (sin yaw, −cos yaw). Muốn nhìn từ A sang B: `yaw = degrees(atan2(dx, -dy))`.
- **Chi tiết riêng** (quầng thâm, tai nghe, dép, lon nước…): `box()`/`_cyl()` parent vào khớp. Xem đoạn Brody trong `tmg01_scene.py`.

## Chuyển động phụ (hb_sets2, hb_sets3, scene)
- `idle(c, f0, f1, kind, seed)` với kind = talk | phone | read | laugh | look | drive. Giữ dáng 40–75 khung, kèm thở và chớp mắt. Mọi vai phụ đều phải có idle hoặc walk.
- `breathe(c, f0, f1, amp, period, seed)`; `dance(c, f0, f1, seed, beat, amp)` (nhún theo nhịp).
- Trong `tmg01_scene.py`:
  - `run()` chạy.
  - `flash(obj, n, every, on, phase)` nhấp nháy vật phát sáng (đèn báo, đèn trường).
  - `bake_to(obj, char, joint, f0, f1)` gắn một vật theo tay qua từng khung; dùng để chuyền đồ từ tay người này sang tay người kia (cảnh cướp sandwich).
  - `chew()` nhai.

## Bối cảnh có sẵn (trả `dict` điểm quan trọng)
| Hàm | File | Ghi chú |
|---|---|---|
| `classroom`, `cafeteria`, `photo_studio`, `desk`, `sandwich` | hb_lib | HB01 |
| `class_props`, `caf_props`, `studio_props`, `vending_detail`, `detention_sign`, `phone`, `chips_bag`, `backpack`, `light_panel`, `tex_quad` | hb_props | |
| `school_bus` (seats, wheel), `library` (tables) | hb_sets2 | TM01 |
| `bus_details`, `library_details`, `scroll_outside` | hb_details | TM01 |
| `hallway` (fronts), `gym_dance` (disco, dj, table) | hb_sets3 | TM02 |
| `bathroom` (mirror, flicker), `parking_lot` (minivan), `night_world`, `hallway_details`, `gym_details`, `_sph`, `_cyl` | hb_sets4 | TM02 |
| `crosswalk` (cart, beacon, lamps), `golf_cart`, `tree`, `auditorium` (seats), `nurse_office` (desk, chair, door), `patio` (tables, vend), `picnic_table` | hb_sets5 | TMG01 |
Mỗi set đặt ở một gốc X riêng (vd. 150, 180, 210, 240 hoặc 270, 300, 330, 360) để không chồng lên nhau. Đèn fill riêng cho từng set (AREA light). Ngoài trời: `world("out")` cho trời xanh.

## Chữ và hình in
- `tex_quad(name, w, h, img, loc, rot)`: ảnh PNG trên mặt phẳng; `rot=(R(90), 0, 0)` dựng đứng, quay về −Y. Mặt sau tự lật U nên **chữ không bao giờ bị ngược**. Đặt nằm trên bàn: `rot=(0, 0, góc)`.
- Ảnh PNG tạo bằng PIL trong `make_tex_<ID>.py`. Dùng font Windows (arialbd, impact). Chỉ dùng chữ và logo tự vẽ.

## Camera
- `cam_move(n, p0, look0, lens, p1, look1)`: có kéo lùi và kẹp theo phòng (`_clamp`). Mỗi tập phải sửa `_clamp` theo vùng X của từng set.
- `cam_key(cam, tgt, f, pos, look, lens)`: đặt tay, không kéo lùi. Dùng khi cần né cột ô dù, cây, xe, vai phụ.
- `headpos(c, f)`: tọa độ đầu, để canh cảnh cận. **Camera phải nằm phía trước mặt nhân vật**: hướng camera→mặt lệch với vector mặt < 50°. Nhân vật ngồi quay vào bàn thì quay từ phía bên kia bàn.
- Cảnh POV_* trong danh sách `HELPERS` chỉ render 1 ảnh tĩnh làm nền cho ảnh chèn điện thoại.

## Va chạm — `--check`
- `find_collisions(chars, frame)`: so hộp bao (AABB) của từng mảnh nhân vật với mọi vật tĩnh tại khung 1, n/2 và n.
- Bỏ qua: sàn, vỉa hè, vạch kẻ, sân khấu, đồ có tên trong `SKIP_WORDS`. Ghế, ghế băng (`SEAT_WORDS`) cho phép tiếp xúc ở mông và đùi.
- Báo nhầm thường gặp: tay đặt trên mặt bàn, chân trong thân xe golf, tay cầm đồ. Những chỗ khác phải sửa vị trí: đặt người cách tường ≥ 0.3 m, vật cầm tay cách rèm hoặc cửa.
- Vỉa hè hay bậc dày hơn 2–4 cm sẽ làm chân lún. Giữ mặt đi thấp hoặc đặt z của nhân vật đúng mặt đi.
