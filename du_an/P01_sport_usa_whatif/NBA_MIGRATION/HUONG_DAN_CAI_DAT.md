# Hướng dẫn cài đặt — nhánh NBA (Claude Code trên web)

## Bảng kiểm phụ thuộc (08/11/2026)
| Yêu cầu | Dùng để | Trạng thái | Việc cần làm | Ai làm | Kiểm |
|---|---|---|---|---|---|
| Node 22, npm | engine | AVAILABLE, đã kiểm | — | — | `node -v` |
| Playwright + Chromium | render | AVAILABLE, đã kiểm | — | — | test_run6 ra 30 ảnh |
| three r170 + gói engine | 3D | AVAILABLE sau `npm install` + bản vá | chạy lại mỗi phiên | Claude | render không lỗi INVALID_OPERATION |
| ffmpeg 6.1 (libass, loudnorm) | ghép, âm | AVAILABLE, đã kiểm | — | — | ebur128 đo được |
| melt 7.22 | xuất project | AVAILABLE sau apt | mỗi phiên | Claude | xuất 1080x1920 |
| **frei0r-plugins** | melt chồng lớp | AVAILABLE sau apt (**bắt buộc**) | mỗi phiên | Claude | khung không đen |
| **fonts-montserrat** | phụ đề | AVAILABLE sau apt (**bắt buộc**) | mỗi phiên | Claude | `fc-list \| grep ExtraBold` |
| faster-whisper + small.en | mốc từ | AVAILABLE, đã kiểm | mỗi phiên (pip + tải 480 MB) | Claude | words.json đúng chữ |
| numpy | âm thanh | AVAILABLE | — | — | — |
| Magnific connector | giọng Sport USA, SFX | AVAILABLE (đọc); tạo giọng UNVERIFIED (chưa tốn credit) | không | — | `audio_voices_list` thấy id 195176 |
| ESPN JSON | dữ liệu trận | AVAILABLE | — | — | scoreboard 200 |
| NBA.com trực tiếp | nguồn chính thức | MISSING (cdn.nba.com 403) | không bắt buộc — dùng qua WebSearch | — | — |
| Mixamo FBX chạy (9 file) | chạy mượt | AVAILABLE trong zip Release, KHÔNG trên git | Claude tải lại từ Release mỗi phiên | Claude | test_run6 |
| Mixamo bóng rổ | dẫn bóng/ném/úp rổ mocap | MISSING (tuỳ chọn) | xem mục B | **Bạn** | file xuất hiện trong assets/mixamo |
| Thư viện nhạc/SFX CC0 (~1,8 GB) | nhạc nền | MISSING, tải được (GitHub mở) | Claude tải khi tới bước trộn âm | Claude | thư mục /root/work/assets/audio |
| Kdenlive GUI | sửa tay | NOT REQUIRED ở đây (melt thay) | mở `.kdenlive` trên máy bạn nếu muốn | Bạn (tuỳ) | — |
| Blender, Claude in Chrome, widgets sports | — | NOT REQUIRED sau chuyển đổi | — | — | — |
| GPU | — | NOT REQUIRED (SwiftShader CPU) | — | — | — |

## A. Bắt buộc — Claude tự làm đầu mỗi phiên mới (container bị xoá khi nghỉ)
```bash
apt-get install -y melt frei0r-plugins fonts-montserrat
pip install --break-system-packages faster-whisper
cp -r du_an/P01_sport_usa_whatif/engine /root/work/engine && cd /root/work/engine && npm install && python3 patches/va_realism_effects_three170.py
mkdir -p /root/work/dl && gh api -H "Accept: application/octet-stream" repos/mailcontentnba76-cell/absurdplay-kit/releases/assets/722659121 > /root/work/dl/goi.zip
```
Rồi giải nén zip (Python `zipfile`) và chép `engine/assets/mixamo/*.fbx` vào `/root/work/engine/assets/mixamo/`.
Mạng: môi trường "Default" đã được bạn duyệt thêm huggingface (+ máy chủ lưu trữ), espn, nba.com. Không cần làm lại.

## B. Tuỳ chọn — Mixamo động tác bóng rổ (bạn làm, ~15 phút)
Dùng để: nhân vật dẫn bóng, ném, úp rổ bằng mocap mượt thay cho tư thế viết tay.
1. Mở https://www.mixamo.com, đăng nhập Adobe ID (miễn phí).
2. Tab **Animations**, tìm từng tên: Basketball Dribble (hoặc Dribbling), Jump Shot, Layup, Dunk, Free Throw, Bounce Pass, Chest Pass, Basketball Idle, Defensive Shuffle.
3. Với vòng lặp (Dribble, Idle, Shuffle) tích **In Place**.
4. Bấm **Download**: Format **FBX Binary (.fbx)**, Skin **Without Skin**, Frames per Second **30**.
5. Đổi tên file đúng: `Dribble.fbx`, `Jump_Shot.fbx`, `Layup.fbx`, `Dunk.fbx`, `Free_Throw.fbx`, `Bounce_Pass.fbx`, `Chest_Pass.fbx`, `Basketball_Idle.fbx`, `Defense_Shuffle.fbx`.
6. Gửi lại: nén 9 file thành zip và **đính kèm vào Release `goi-nba-v01`** (Edit release → kéo file vào → Update release), giống cách bạn đã đưa gói lên. Nhắn tôi "đã thêm Mixamo NBA".
Kiểm: Claude render `test_mx.html` thấy clip `MX_Dribble`… chạy.
Không làm được: dùng động tác viết tay `lib/bongro.js` (đã dùng cho E02, E05).

## C. Không cần nữa
Claude in Chrome (giọng nay qua Magnific connector), Blender, Kdenlive trên máy chủ.

## D. Không bao giờ
Không dán mật khẩu/API key vào chat. Magnific đã kết nối bằng connector; nếu cần dịch vụ có khoá, Claude sẽ mở form bảo mật của môi trường.
