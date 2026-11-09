# BẢNG KIỂM CÔNG CỤ — P02
Môi trường: Ubuntu 24.04 (container đám mây Claude Code), 4 nhân CPU, 15 GB RAM, **không có GPU**, không phát được âm thanh · Ngày kiểm: 09/11/2026.

Trạng thái:
- **ĐÃ KIỂM** = đã chạy tác vụ thật và thấy kết quả.
- **CÓ, CHƯA THỬ** = đã cài hoặc đã kết nối nhưng chưa chạy tác vụ thật (thường vì tốn credit).
- **BỊ CHẶN** = không dùng được trong môi trường này.
- **THIẾU** = chưa có.
- **CẦN BẠN** = phải đăng nhập, trả phí, cấp quyền hoặc tự quyết.

Mức cần: **B** bắt buộc · **N** nên có · **T** tuỳ chọn.

**Lưu ý:** container bị thu hồi sau một thời gian không dùng. Những thứ cài bằng `apt` sẽ mất và phải cài lại (lệnh ở mục 4).

## 1. Bảng kiểm
| Thành phần | Dùng cho | Mức | Phiên bản | Trạng thái | Bằng chứng (lệnh → kết quả) | Giới hạn |
|---|---|---|---|---|---|---|
| ffmpeg / ffprobe | đọc, cắt, đo, ghép, xuất | B | 6.1.1 (có libdav1d) | ĐÃ KIỂM | giải mã AV1 của 10 mẫu, tạo bản H.264, ebur128, lưới khung | — |
| Python 3.13 + numpy, OpenCV 5.0, scipy, soundfile, Pillow | đo màu, chuyển động, dò cắt, đo phụ đề, đo âm | B | — | ĐÃ KIỂM | `phan_tich_mau.py`, `do_cat_canh.py`, `khung_quanh.py`, `do_phu_de.py`, `do_am_thanh.py` chạy hết trên 10 mẫu | OpenCV **không đọc được AV1**, phải chuyển sang H.264 trước |
| ASR parakeet-tdt-0.6b-v2 int8 (sherpa-onnx 2.0.1) | chép lời có mốc từ (tiếng Anh) | B | — | ĐÃ KIỂM | 10 transcript, tổng 1.079 từ; file thử 7,4 s → 23 từ | chỉ có mốc bắt đầu từ, bước 0,08 s; mô hình ở `/root/.p02/parakeet`, mất khi container mới nếu không cài lại |
| Xem hình (đọc ảnh) | xem khung, lưới, so cạnh mẫu | B | — | ĐÃ KIỂM | đã xem 38 lưới (cả 10 video) + 2 dải khung 30 fps | xem ảnh tĩnh, không xem video chạy |
| **Nghe âm thanh** | đánh giá giọng, nhạc, SFX | B | — | **BỊ CHẶN** | không có thiết bị phát hay mô hình hiểu âm thanh | thay bằng đo (loudness, phổ, F0, mức nền). **Cần bạn nghe và mô tả** |
| Blender | 3D: cảnh giải thích, nhìn xuyên vật, viền sáng, chữ 3D, máy | B (cho cảnh cơ chế) | 4.0.2 (apt Ubuntu) | ĐÃ KIỂM | `cong_cu/blender/thu_render.py`: **EEVEE 1080×1920, 32 mẫu → 27–33 s/khung** (phần mềm OpenGL qua Xvfb); viền phát sáng, bloom, độ sâu trường ảnh, thuỷ tinh đều hiện đúng. **Cycles CPU 540×960, 32 mẫu → 12–15 s/khung, nhiễu** (`kiem_thu/blender_cycles_vs_eevee.png`) | bản apt **không có bộ khử nhiễu OIDN**; không tải được bản chính thức (download.blender.org bị proxy chặn). Render cả video 40 s ≈ 10 giờ, nên chỉ phù hợp đoạn chèn ngắn |
| melt (MLT) | render project Kdenlive | B | 7.22.0 | ĐÃ KIỂM | `kiem_thu/smoke.kdenlive` → 1080×1920, có giọng, phụ đề ASS; **phải dùng `-profile cong_cu/p02_1080x1920_30.profile`**, nếu không sẽ có viền đen 34 px hai bên (đã gặp và đã sửa) | — |
| Kdenlive | project chỉnh sửa được | B | 23.08.5 | ĐÃ KIỂM (mở) | mở `smoke.kdenlive` trong Xvfb: thư mục clip có 2 clip, track Hình và Giọng, màn hình xem trước hiện khung (`kiem_thu/kdenlive_mo_project.png`) | phụ đề ASS được đốt vào hình qua bộ lọc, **không hiện thành từng ô** trong track Subtitles; sửa chữ trong file `.ass` |
| `tao_kdenlive.py` | sinh project từ JSON | B | chép từ bộ công cụ chung (không mang phong cách P01) | ĐÃ KIỂM | như trên | — |
| `tao_phu_de_p02.py` | phụ đề theo số đo mẫu P02 | B | 09/11/2026 | ĐÃ KIỂM | sau hiệu chỉnh: vùng chữ cao 71–72 px (mẫu 70), tâm y 1504 px (mẫu 1505) | font gốc chưa biết; đang dùng **Inter ExtraBold** làm thay thế |
| Magnific: tạo ảnh | khung đầu cho clip AI, tham chiếu nhân vật | N | — | CÓ, CHƯA THỬ | ước tính: ~65 credit/ảnh (chế độ tự chọn mô hình) | chưa tạo ảnh nào |
| Magnific: tạo video từ ảnh | cảnh nhân vật, bối cảnh, hành động khó dựng bằng 3D trên CPU | N (gần như B nếu muốn chất lượng hình gần mẫu) | Kling 2.5; Seedance 2.0/2.5; MiniMax H3 | CÓ, CHƯA THỬ | ước tính, chưa trừ credit: **Kling 2.5 1080p 5 s = 325 credit**; Seedance 2.0 Mini 720p 5 s = 700; **Seedance 2.5 1080p 5 s = 3.950**; số dư hiện có **62.320 credit** (gói Premium) | chưa kiểm khả năng giữ nhân vật, hình khối, cơ chế. Kling nhận khung đầu và khung cuối, Seedance 2.5 nhận khung đầu |
| Magnific: TTS | lời đọc | N | eleven_v4 | CÓ, CHƯA THỬ | ước tính ~38 credit cho 35 từ | chưa chọn giọng. **Giọng mẫu chưa được nghe**, nên chưa biết giọng nào hợp |
| Magnific: nhạc, SFX | nền âm, hiệu ứng | T | — | CÓ, CHƯA THỬ | — | — |
| Font Inter (OFL) | phụ đề | B | có sẵn | ĐÃ KIỂM | render ASS đúng | là thay thế, không phải font gốc |

## 2. Còn thiếu hoặc cần bạn
| Thành phần | Mục đích | Mức | Cách có | Chi phí | Ai làm |
|---|---|---|---|---|---|
| **Mô tả giọng, nhạc, SFX của mẫu** | chọn giọng và cách phối | B | bạn nghe 2–3 video (gợi ý V10, V01, V03) và trả lời 5 câu ở `HUONG_DAN_SU_DUNG.md` mục 3 | 0 | bạn |
| Đồng ý chi credit cho **bản thử** | thử tạo video từ ảnh với nhân vật và cơ chế khó nhất | B trước khi sản xuất | trả lời "đồng ý mức X credit" | ĐX: ≤ 3.000 credit (4–6 ảnh + 4 clip Kling 1080p 5 s + 1 clip Seedance 2.5 để so) | bạn quyết |
| Máy có GPU (tuỳ chọn) | render Blender chất lượng cao, nhanh | T | chạy Blender bản chính thức trên máy bạn (có OIDN), hoặc mở `download.blender.org` cho môi trường này để cài bản có khử nhiễu | 0 | bạn |
| Nhân vật 3D có rig (nếu đi đường Blender) | cảnh người cử động | T | tạo bằng `models3d_*` của Magnific (có tạo, rig, chuyển động) hoặc Mixamo (tải tay) | theo credit | bạn quyết |

## 3. Phân công
| Claude tự làm được | Cần bạn làm |
|---|---|
| Phân tích mẫu, nghiên cứu và kiểm nguồn, viết kịch bản tiếng Anh, viết prompt tiếng Anh, bảng shot | Nghe mẫu và mô tả giọng/nhạc (một lần) |
| Gọi Magnific tạo ảnh, video, giọng, nhạc (sau khi bạn đồng ý mức credit) | Duyệt kịch bản; duyệt bản thử |
| Dựng cảnh giải thích bằng Blender (bộ đếm, mũi tên, viền sáng, chữ 3D, mặt cắt đơn giản) | Đồng ý chi phí khi vượt mức đã duyệt |
| Phụ đề, ráp Kdenlive, render melt, đo QA, sửa lỗi | Mở thử project Kdenlive trên máy bạn khi nhận bản giao |

## 4. Cài lại trên container mới
Đã chạy được trong phiên này:
```bash
apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y blender melt kdenlive xvfb dbus-x11
```
Thư viện Python (numpy, opencv-python-headless, scipy, soundfile, sherpa-onnx) và mô hình parakeet ở `/root/.p02/parakeet` đã có sẵn trong phiên này nhờ môi trường đã cấu hình. Nếu container mới thiếu, đọc `cong_cu/asr_parakeet.py` để biết biến `PARAKEET_DIR`.
