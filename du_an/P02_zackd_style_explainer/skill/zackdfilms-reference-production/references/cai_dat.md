# Cài đặt và kiểm công cụ trên máy mới (Claude Desktop)

## Chọn cách làm việc
| Cách | Phù hợp | Ghi chú |
|---|---|---|
| **A. Tab Code của Claude Desktop (Claude Code chạy trên máy người dùng)**, mở thư mục dự án đã giải nén | **sản xuất** (khuyên dùng) | dùng được GPU cho Blender, mở Kdenlive bằng giao diện, lưu file thẳng vào máy. Skill đặt ở `~/.claude/skills/zackdfilms-reference-production/` (mọi dự án) hoặc `<thư mục làm việc>/.claude/skills/…` (một dự án) |
| B. Chat thường của Desktop (cần bật code execution) với skill tải lên ở mục Skills | viết kịch bản, bảng shot, prompt, QA bằng văn bản | môi trường chạy code là sandbox đám mây; không có Blender, Kdenlive hay GPU; file lớn bị giới hạn kích thước tải lên |

Theo báo cáo của người dùng (chưa kiểm), skill tải lên ở giao diện Desktop và skill trong `~/.claude/skills` có thể **không dùng chung** với nhau. Với cách A thì đặt skill vào thư mục `.claude/skills` như trên.

## Kiểm công cụ (chạy lần đầu trên máy mới, ghi kết quả vào `P02/BANG_KIEM_CONG_CU.md`)
| Công cụ | Lệnh kiểm | Cài nếu thiếu |
|---|---|---|
| ffmpeg, ffprobe | `ffmpeg -version` | Windows: `winget install Gyan.FFmpeg` · macOS: `brew install ffmpeg` |
| Python 3.10+ và thư viện | `python -c "import numpy, cv2, scipy, soundfile, sherpa_onnx"` | `python -m pip install numpy opencv-python-headless scipy soundfile pillow sherpa-onnx` |
| Blender (bản chính thức, có OIDN, dùng được GPU) | `blender --version` | Windows: `winget install BlenderFoundation.Blender` · macOS: `brew install --cask blender` · hoặc tải ở blender.org |
| Kdenlive (đi kèm `melt`) | `kdenlive --version`; `melt -version` | Windows: `winget install KDE.Kdenlive` · macOS: `brew install --cask kdenlive` · hoặc kdenlive.org. Trên Windows, `melt.exe` nằm trong thư mục `bin` của Kdenlive |
| Mô hình ASR parakeet | `python scripts/asr_parakeet.py <file thử>` | tải gói **`sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8`** từ danh sách mô hình chính thức của sherpa-onnx (GitHub k2-fsa/sherpa-onnx, release `asr-models`), giải nén, rồi đặt biến `PARAKEET_DIR` trỏ tới thư mục đó (~630 MB) |
| Font Inter | có trong danh sách font | rsms.me/inter hoặc Google Fonts; nếu thiếu thì `tao_phu_de_p02.py --font "<font đậm khác>"` rồi đo lại cỡ chữ |
| Magnific (connector) | gọi `account_balance` | người dùng kết nối connector Magnific trong tài khoản mới; chỉ đọc số dư, không tạo gì |

Lệnh cài phải kiểm lại trên máy thật. Nếu `winget` hoặc `brew` báo không tìm thấy gói thì dùng trang tải chính thức.

## Bài thử bắt buộc trước khi sản xuất (đều miễn phí)
1. `blender -b --factory-startup -P scripts/blender/thu_render.py -- BLENDER_EEVEE <ra> 1080 1920 32` → ghi số giây/khung. Kết quả ở môi trường cũ: CPU 27–33 s/khung. Có GPU sẽ nhanh hơn nhiều; nếu dưới ~2 s/khung thì có thể làm nhiều cảnh hơn bằng Blender.
2. Sinh phụ đề từ một file giọng thử → ráp bằng `tao_kdenlive.py` → `melt -profile scripts/p02_1080x1920_2997.profile …` → `do_phu_de.py` phải đo được tâm y 1495–1515 và cao 64–76 px.
3. Mở file `.kdenlive` vừa tạo bằng Kdenlive và chụp màn hình làm bằng chứng.

## Lưu ý đường dẫn
Script không gắn cứng đường dẫn, trừ `asr_parakeet.py` (mặc định `/root/.p02/parakeet`, đổi bằng biến `PARAKEET_DIR`). Trên Windows nên dùng `python -X utf8` để tên file và chữ tiếng Việt không lỗi.
