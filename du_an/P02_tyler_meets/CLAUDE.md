# Dự án: series hài "Tyler meets…" (Blender, 9:16)

- Trước mọi việc của series, dùng skill **tyler-meets-homeboy-production** (`.claude/skills/tyler-meets-homeboy-production/SKILL.md`) và đọc `PROJECT_STATE.md`.
- Nói chuyện với người dùng bằng tiếng Việt; lời thoại và tiêu đề đăng bằng tiếng Anh.
- Luôn làm từng bước: viết kịch bản → **dừng chờ người dùng chốt** → giọng → dựng → QA → render.
- Blender (Git Bash): `BLENDER="/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"`. Thư mục ra của Blender phải là đường dẫn tuyệt đối (`$(pwd -W)/work/...`).
- Khóa SonicVoice ở `.env.sonicvoice`. Không in, không ghi khóa vào bất kỳ file hay báo cáo nào.
- Sau mỗi bước, thêm một mục ngắn vào `PROJECT_STATE.md`.

## Chạy trên phiên Claude Code cloud (Linux, từ 22/11/2026)
- Gốc dự án: `du_an/P02_tyler_meets/` trong repo `absurdplay-kit`. Phiên mới chạy trước: `bash tools/setup_linux.sh` (bpy 5.2.4, Mesa EGL, font thay thế, thư viện Python).
- Blender: `export BLENDER=$PWD/tools/blender_linux.sh` — cú pháp giữ nguyên (`"$BLENDER" -b --python ... -- ...`); thư mục ra vẫn dùng đường dẫn tuyệt đối (`$PWD/work/...`).
- Font Windows được thay qua `tools/kitfonts.py`: Arial → Liberation Sans (cùng số đo), Arial Black → Archivo Black, Impact → Anton (gần giống, không y hệt). Ảnh chữ đã có trong `assets/` giữ nguyên bản Windows.
- SonicVoice: khóa được proxy chèn cho `sonicvoice.pro`; chạy script với `SONICVOICE_API_KEY=proxy-injected` (giá trị giả, không phải khóa).
- Không GPU: ảnh thử 360×640/16 mẫu ~15 s/ảnh (dùng được); 1080×1920/64 mẫu ~87 s/khung → cả tập ~2 ngày. Render bản cuối nên chạy trên máy RTX của người dùng.
- 3 video mẫu (`references/videos/*.mp4`) không đưa lên git; lấy lại từ TylerMeets_Kit.zip trên Google Drive.

## Skill TikTok (từ 22/11/2026)
- Chọn đề tài: `tyler-tt-topic-studio` · viết kịch bản từng phần + xuất `shots.txt`: `tyler-tt-script` · đọc số liệu sau đăng: `tyler-tt-studio-doctor`. Hồ sơ kênh: `.claude/skills/tyler-tt-script/references/NICHE_PROFILE.md`.
- Các skill này dừng trước bước làm giọng; sau khi người dùng chốt kịch bản thì dùng `tyler-meets-homeboy-production` (Bước B–D).
- Render trên cloud (CPU, Mesa): bóng đổ chiếm ~70 % thời gian mỗi khung. Bản thử: `EEVEE_OPTS=shadow_resolution_scale=0.25` + `--res 432x768 --samples 8 --step 2` (~5.6 s/khung, ~2 giờ/tập), rồi `finalize_timeline.py <clips> <inserts> 2` (build_episode đọc `step`). Bản cuối 1080×1920/64 mẫu nên chạy trên máy RTX.
