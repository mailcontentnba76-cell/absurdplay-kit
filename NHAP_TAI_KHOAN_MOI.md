# AbsurdPlay — P01 "Sport USA": chuyển sang tài khoản Claude khác (KIT v3.0, 21/11/2026)

Mang theo **3 thứ** sang tài khoản mới:

1. **`AbsurdPlay_SportUSA_KIT_v3.0.zip`** (khoảng 20 MB): hướng dẫn, quy tắc kênh, skill, và các tệp nặng không có trên GitHub.
2. **`sport-usa-whatif.zip`**: skill của kênh, để tải lên mục Skills.
3. **Repo GitHub `mailcontentnba76-cell/absurdplay-kit`** (riêng tư): toàn bộ engine 3D, công cụ và hồ sơ E01–E26. Bạn không cần tải về, Claude mới tự clone.

## 1. Gói này chứa gì

| Phần | Nội dung |
| --- | --- |
| `BAT_DAU_DAY.md` | Chính file này: các bước làm và câu lệnh dán cho Claude mới. |
| `QUY_TAC_KENH.md` | Toàn bộ yêu cầu và sở thích bạn đã nói từ E01 đến E25. Claude mới đọc để làm đúng ngay từ đầu. |
| `skill/sport-usa-whatif/SKILL.md` | **Skill v3.3 của kênh.** Gồm quy trình 2 lần duyệt, quy tắc hook, hai hướng kịch bản, quy tắc hình và các bài học lỗi. |
| `BO_HUONG_DAN_SAN_XUAT_VIDEO/` | Bộ hướng dẫn sản xuất video chung, câu lệnh khởi động, mẫu hồ sơ và skill chung. |
| `tep_nang/engine/assets/mixamo/*.fbx` | 10 động tác Mixamo bạn đã tải: chạy, ném, bắt, sút. Không đưa lên GitHub vì là tệp của Adobe. |
| `tep_nang/engine/ual/AnimationLibrary_Godot_Standard.*` | Thư viện động tác người. |

**Trên GitHub (Claude mới tự clone):**
- **Engine three.js r170:** có bản vá motion blur (`engine/patches/`), nhân vật, tóc, bối cảnh `lib/*.js`, các tập `ep01`–`ep26`.
- **Mô hình thú 3D Magnific:** `engine/assets/meo/tiger.glb` và `jaguar.glb`.
- **Công cụ:** phụ đề, hoà cắt, quét khung lỗi, `qa_ground.js` (kiểm lún nền), Whisper, script cắt thử và bản cuối.
- **Hồ sơ từng tập:** kịch bản, mốc lời, phụ đề, bộ trộn âm, QA, tiếng thú.

**Không mang theo, và vì sao:**
- **Thư viện nhạc và SFX miễn phí (khoảng 1,9 GB):** Claude mới tự tải lại từ GitHub.
- **Video đã xuất:** đã giao cho bạn.
- **Ảnh chụp kênh mẫu:** nội dung của người khác, chỉ dùng để phân tích nội bộ.
- **Giọng "Sport USA":** nằm trong tài khoản Magnific của bạn.
- **Tiếng thú:** nằm trong tài khoản ElevenLabs của bạn.

## 2. Các bước ở tài khoản mới (khoảng 15 phút)

1. **Kết nối GitHub:** vào claude.ai → Settings → Connectors → GitHub → Connect. Đăng nhập đúng tài khoản GitHub đang sở hữu repo `absurdplay-kit` và cấp quyền cho repo này.
2. **Tải skill:** vào Settings → Capabilities → Skills → Upload skill, chọn `sport-usa-whatif.zip`. Nếu không thấy mục này, bỏ qua; ở bước 5 Claude sẽ đề xuất lưu skill để bạn bấm lưu.
3. **Mở mạng nếu bị chặn:** Settings → Capabilities, cho phép github.com, pypi.org, registry.npmjs.org và huggingface.co. Huggingface chứa mô hình Whisper dùng để đọc mốc lời.
4. **Claude in Chrome:** cài tiện ích, đăng nhập bằng tài khoản Claude mới. Giữ Chrome đăng nhập sẵn **Magnific** (giọng Sport USA, mô hình 3D) và **ElevenLabs** (tiếng thú).
5. **Tạo Project:** tạo Project tên "Sport USA", mở cuộc trò chuyện mới trong đó, đính kèm `AbsurdPlay_SportUSA_KIT_v3.0.zip` rồi dán nguyên khối câu lệnh sau:

```
Đây là dự án AbsurdPlay (P01 Sport USA, kênh TikTok What If NFL/NCAA + series Mascot) chuyển từ tài khoản Claude khác.
1) Giải nén zip đính kèm vào /root/work/kit (mkdir -p /root/work/kit && cd /root/work/kit && unzip -q <file>).
2) Đọc BAT_DAU_DAY.md, QUY_TAC_KENH.md và skill/sport-usa-whatif/SKILL.md — coi QUY_TAC_KENH.md là yêu cầu của tôi.
3) Thêm repo mailcontentnba76-cell/absurdplay-kit (quyền push) và clone vào /root/work/repo,
   rồi dựng lại /root/work/engine và /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO theo mục 3 của BAT_DAU_DAY.md.
4) Chép tep_nang/ vào engine, chạy npm install + bản vá, chạy thử: node render.js "ep25_bengals_jaguars.html#nomb" /tmp/t 30 0 1 540 960 "300,600"
   và node qa_ground.js "ep25_bengals_jaguars.html#nomb" 0 10 2.
5) Đề xuất lưu skill sport-usa-whatif cho tài khoản này (nếu tôi chưa tải lên).
Luôn trả lời tôi bằng tiếng Việt. Xong thì báo bảng "đã sẵn sàng / còn thiếu / tôi cần làm gì" và chờ tôi giao tập tiếp theo.
```

**Bạn cần làm thêm:**
- **Bấm lưu skill** nếu Claude đề xuất.
- **Đính kèm file MP3** mỗi khi Claude tải giọng hoặc tiếng thú: file nằm trong thư mục Downloads trên máy bạn, Claude không tự đọc được. Nếu bạn dùng ứng dụng Claude trên máy tính, Claude có thể tự lấy file.
- **Lịch hẹn tự động** (nếu cần): nhờ Claude tạo lại. Lịch ở tài khoản cũ không chuyển sang được.
- **Trí nhớ cũ không tự chuyển sang.** `QUY_TAC_KENH.md` thay cho phần đó. Nếu muốn Claude mới nhớ lâu dài, nói: "lưu các quy tắc trong QUY_TAC_KENH.md vào trí nhớ".

## 3. Dựng lại thư mục làm việc (dành cho Claude mới)

**Cách nhanh (từ 22/11):** `bash du_an/P01_sport_usa_whatif/cong_cu/chuan_bi_moi_truong_nfl.sh` làm hết các bước dưới và tự kiểm tra; xem `du_an/P01_sport_usa_whatif/TAI_NGUYEN_NFL.md`.

```bash
mkdir -p /root/work && cd /root/work
# repo đã clone ở /root/work/repo
cp -r repo/. /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO          # bộ hướng dẫn + du_an/P01_sport_usa_whatif
ln -sfn /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/engine /root/work/engine
cp -r kit/tep_nang/engine/. /root/work/engine/                 # FBX Mixamo + ual
cd /root/work/engine && npm install && python3 patches/va_realism_effects_three170.py
npx playwright install chromium   # nếu thiếu trình duyệt render
# thư viện âm thanh miễn phí: xem BANG_KIEM_CONG_CU.md (nguồn GitHub) → /root/work/assets/audio/
mkdir -p /root/work/assets/audio/e25_thu && cp /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E25_mascot_bengals_jaguars/am_thanh/thu/* /root/work/assets/audio/e25_thu/
```

- **Tên tệp tập mới:** mỗi tập đặt tên `epNN_<doi1>_<doi2>*`, vì chat NBA cũng đẩy lên cùng repo.
- **Đẩy code mỗi tập:** `git fetch origin main:refs/remotes/origin/main; git rebase origin/main; git push origin HEAD:main`.

## 4. Quy trình mỗi tập (Claude mới làm đúng như tài khoản cũ)

1. **Chọn hướng kịch bản.**
   - Nếu có trận hot trong khoảng 48 giờ gần nhất: kịch bản **troll đội thua**, thông tin đúng, có ít nhất 2 nguồn.
   - Nếu không: **mascot đối đầu** giữa hai đội, tự chọn cặp, không theo lịch.
2. **Viết Doc kịch bản** gồm: tin, lời thoại, hình ảnh từng cảnh, nhân vật và màu áo đúng, checklist. → **Duyệt lần 1.**
3. **Tạo giọng "Sport USA" trên Magnific** qua Chrome. Bạn đã cho phép tạo và tải luôn sau khi duyệt kịch bản. Bạn đính kèm MP3 → Claude tăng tốc ×1,05, lấy mốc từng từ bằng Whisper, làm phụ đề Lora.
4. **Thú hoặc mascot cần mô hình đẹp:**
   - Tạo ảnh mẫu trên Magnific bằng Nano Banana 2 (nhìn ngang, đứng 4 chân, nền trắng), khoảng 75 credit.
   - Đưa ảnh vào 3D Generator: Tripo P1, bật "Rig for animation", 10K mặt, khoảng 1.035 credit. **Chỉ bấm Generate một lần.**
   - Bạn đính kèm file GLB → Claude điều khiển bằng `lib/meoglb25.js`.
5. **Tiếng thú:** tạo trên ElevenLabs web, mục Sound Effects (SFX v3), qua Chrome, **không dùng API key**. Bạn đính kèm MP3.
6. **Dựng 3D, đồ hoạ, trộn âm, kiểm lún nền** (`qa_ground.js` phải ra 0 khung). Gửi **bản cắt thử 15 fps**. → **Duyệt lần 2.**
7. **Bản cuối** 1080×1920, 30 fps, motion blur, −14 LUFS, quét khung lỗi. Kèm 3 tiêu đề, hashtag, cập nhật skill, đẩy lên GitHub.
   - Render bản cuối **chỉ chạy 1 tiến trình**: 2 tiến trình chạy song song còn chậm hơn.

## 5. Trạng thái khi đóng gói (21/11/2026)

- **Đã giao:** E01–E25 phía NFL/NCAA. E25 "Hổ Bengal thật vs báo đốm thật" giao ngày 21/11 (commit `c182870`).
- **Chat NBA (riêng):** đã làm E24 Bucks–76ers, E26 Lakers–Knicks, T10 Jokic trên cùng repo.
- **Còn treo:** E21 "Take a Number" đang chờ bạn duyệt và chọn cách bíp.
- **Tập tiếp theo:** chưa chọn. Nói "kịch bản hot tiếp theo" hoặc "mascot tiếp theo".
