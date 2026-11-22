# Bộ kit "Tyler meets…" — hướng dẫn mang sang máy hoặc tài khoản Claude khác

Kit này chứa toàn bộ quy trình đã dùng để làm 3 video TM01 (Jaylen), TM02 (Marcus) và TMG01 (Brody GTA 6):
- skill hướng dẫn Claude,
- công cụ Python và Blender,
- bối cảnh và nhân vật,
- hình in, nhạc nền,
- kịch bản và giọng của các tập mẫu,
- 3 video thành phẩm làm chuẩn.

## 1. Giải nén
Giải nén `TylerMeets_Kit.zip` vào một thư mục, ví dụ `D:\TylerMeets`. Đó là **gốc dự án**. Nên dùng đường dẫn không dấu, không dấu cách (công cụ vẫn chạy với tiếng Việt, nhưng không dấu thì ít rủi ro hơn).

## 2. Cài phần mềm (Windows)
| Phần mềm | Phiên bản đã dùng | Ghi chú |
|---|---|---|
| Blender | 5.2 LTS | mặc định `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` |
| Python | 3.12 | `pip install -r requirements.txt` |
| ffmpeg + ffprobe | 7 trở lên | phải gọi được từ dòng lệnh (PATH) |
| Git for Windows | bất kỳ | Claude Code chạy lệnh bằng Git Bash |
| Font Windows | Arial, Arial Black, Impact, Segoe UI Emoji/Symbol | có sẵn trên Windows |

Lần chạy ASR đầu tiên, faster-whisper tự tải model `medium.en` (~1.5 GB).

GPU: dùng RTX 3060 thì một tập render khoảng 60 phút. Máy yếu hơn thì render lâu hơn nhưng vẫn chạy.

## 3. Khóa SonicVoice (giọng)
1. Chép `.env.sonicvoice.example` thành `.env.sonicvoice` và điền khóa API SonicVoice của bạn: `SONICVOICE_API_KEY=...`
2. **Không** gửi file này cho ai và không đưa lên git (`.gitignore` đã chặn `.env*`).
3. Giọng Tyler là giọng clone "Ant Just Cant" (`uv_1883_1ae2d9e41df6`), thuộc **tài khoản SonicVoice** của bạn. Dùng cùng khóa SonicVoice thì giọng vẫn hoạt động, dù tài khoản Claude là tài khoản nào. Đổi sang tài khoản SonicVoice khác thì phải clone lại giọng và thay ID trong skill (mục 5 của SKILL.md).

## 4. Cho Claude dùng skill
- **Cách 1 (khuyên dùng):** mở thư mục gốc dự án trong Claude Code (desktop hoặc CLI). Skill nằm sẵn ở `.claude/skills/tyler-meets-homeboy-production/`, `CLAUDE.md` ở gốc nhắc Claude đọc skill.
- **Cách 2:** chép thư mục `.claude/skills/tyler-meets-homeboy-production/` vào `C:\Users\<bạn>\.claude\skills\` để dùng ở mọi dự án. Vẫn phải mở đúng gốc dự án khi làm video.

## 5. Kiểm tra nhanh sau khi cài (không tốn credit)
Mở Claude Code tại gốc dự án và nói:
> "Kiểm tra kit: dựng lại tập TMG01 từ giọng có sẵn, render thử 3 cảnh ảnh tĩnh và chạy build."

Hoặc tự chạy lệnh:
```bash
python tools/make_library.py episodes/TMG01/shots.txt work/test_lib.json
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --python tools/hb/tmg01_scene.py -- episodes/TMG01/timeline.json "$(pwd -W)/work/test_stills" --stills --res 360x640 --samples 16 --only CU_BRO_HYPE,WIDE_AUD,WIDE_PATIO
```
Thấy 3 file PNG trong `work/test_stills` là Blender chạy được.

## 6. Làm tập mới
Nói với Claude, ví dụ:
- "Viết kịch bản tập tiếp theo: nhân vật số 04 Brianna."
- "Chốt kịch bản TM03 Destiny, làm tiếp."
- "Làm tập trend mới về <chủ đề>."

Claude sẽ theo đúng quy trình trong SKILL.md: kịch bản → chờ bạn chốt → giọng → Blender → QA → render → gửi video kèm `_post.txt`.

## 7. Nội dung kit
```
.claude/skills/tyler-meets-homeboy-production/   SKILL.md + references/ (API, QA, tập mẫu) + references/videos/ (3 video chuẩn)
CLAUDE.md               chỉ dẫn cho Claude ở gốc dự án
PROJECT_STATE.md        trạng thái hiện tại + việc tiếp theo
tools/                  pipeline giọng, phụ đề, timeline, ghép, QA
tools/hb/               Blender: rig, bối cảnh, scene từng tập, ảnh chèn
assets/hb/              tex (biển chữ), prints (áo in), logo
assets/music/bed_main_V07.wav   nhạc nền chung
docs/homeboy/           20 tính cách, cast bible, phân tích mẫu
source/                 Character_Scripts (nguồn tính cách)
episodes/TM01 TM02 TMG01   kịch bản, giọng, timeline (dựng lại được)
episodes/TM03           kịch bản Destiny chờ duyệt
```
Lưu ý: nhạc V07 tách từ video mẫu, bạn đã chấp nhận rủi ro bản quyền khi đăng.
