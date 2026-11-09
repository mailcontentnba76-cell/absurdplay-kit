# Chuỗi công cụ và quy trình sản xuất

Trạng thái công cụ và bằng chứng: `P02/BANG_KIEM_CONG_CU.md`.

## Quy trình chính (đề xuất, chưa chạy với một tập thật)
**Lai giữa tạo video từ ảnh và Blender, ráp trong Kdenlive.**
Lý do chọn: mẫu cần nhân vật và bối cảnh 3D chất lượng cao. Blender trên CPU của môi trường này đo được 27–33 s/khung với EEVEE 1080×1920, nên làm cả video bằng Blender mất khoảng 10 giờ/video và nhân vật kém xa mẫu. Ngược lại, tạo video từ ảnh không đảm bảo được hình khối chính xác và quan hệ nhân quả. Vì vậy chia việc theo loại shot:

| Loại shot | Công cụ | Lý do |
|---|---|---|
| Nhân vật diễn, phản ứng, bối cảnh, hành động thông thường | ảnh khung đầu (Magnific images_generate, tham chiếu nhân vật cố định) → **Kling 2.5 1080p** (khung đầu và khung cuối, 5–10 s); **Seedance 2.5** khi cần máy phức tạp và có ngân sách | gần chất lượng mẫu, nhanh |
| Cơ chế, nhìn xuyên vật, X-quang, bộ đếm, mũi tên, nhãn | **Blender EEVEE** (xvfb-run) đoạn ngắn ≤ 3 s, hoặc PNG có alpha ghép lên clip AI | cần hình khối và nhân quả chính xác; chữ phải đúng |
| Viền phát sáng trên chủ thể đang chuyển động trong clip AI | tách nền (Magnific video_remove_background) → nở viền → ghép | **chưa thử**, phải thử ở bản thử |
| Chuyển cảnh lia nhoè, hoà hình, ép ngang | lúc dựng (ffmpeg hoặc hiệu ứng Kdenlive) | kiểm soát được thời điểm |
| Giọng | TTS Magnific eleven_v4 **hoặc** giọng chủ dự án | đo mốc từ bằng `asr_parakeet.py` |
| Phụ đề | `tao_phu_de_p02.py` (ASS) | đã hiệu chỉnh theo số đo mẫu |
| Ráp, phối, xuất | `tao_kdenlive.py` → Kdenlive 23.08 project → melt | project mở được trong Kdenlive |

**Phương án dự phòng** (chỉ khi không được chi credit): toàn bộ bằng Blender EEVEE ở 540×960 rồi phóng lên. Nhân vật sẽ lệch xa mẫu, nên phải báo trước cho chủ dự án.

## Khi dùng tạo video từ ảnh
- Mỗi shot có **khung đầu riêng**, tạo từ tham chiếu nhân vật và bối cảnh. Không mặc định lấy khung cuối của shot trước, trừ khi cố ý nối liên tục.
- Prompt tiếng Anh. Mô tả: chủ thể (đoạn cố định) + hành động có điểm bắt đầu và kết thúc + đường máy (push in, orbit left, whip pan, …) + ánh sáng + "no text, no captions, no watermark".
- Kiểm giới hạn từng mô hình trước khi gọi:
  - Kling 2.5: 5 hoặc 10 s, 9:16, prompt ≤ 2.500 ký tự, có khung đầu và khung cuối.
  - Seedance 2.5: 4–30 s, prompt ≤ 30.000 ký tự, có khung đầu, có cameraMotion.
- Luôn ước tính credit (`simulate_cost`) trước khi chạy. Không vượt mức chủ dự án đã duyệt.
- Kiểm từng clip theo các mục:
  1. nhân vật giữ đúng mặt và đồ;
  2. hình khối vật đúng;
  3. tay cầm và chạm đúng;
  4. cơ chế đúng;
  5. máy đúng như yêu cầu;
  6. không có chữ rác.

  Sai thì tạo lại khung đầu; sai lần 2 thì chuyển shot đó sang Blender.

## Mẫu prompt (tiếng Anh)
Khung đầu:
```
{BASE_LOOK}. {CHARACTER_BLOCK}. Shot: {shot size} of {subject} {starting pose/action} in {environment}. {lighting}. Composition: subject in upper two thirds, lower quarter clear. No text, no captions, no watermark.
```
Chuyển động:
```
{subject} {action with clear start and end}, {secondary motion}. Camera: {camera move}, smooth, {speed}. Keep the character's face, hair and clothing identical to the start frame. Physically plausible contact and weight. No text, no captions, no watermark.
```

## Công cụ trong `P02/cong_cu/`
| Script | Việc |
|---|---|
| `asr_parakeet.py` | lời → mốc từ |
| `do_am_thanh.py` | tốc độ lời, ngắt, mức nền, F0 thô |
| `do_cat_canh.py` | ứng viên cắt (phải xem lại bằng mắt) |
| `khung_quanh.py` | dải khung quanh một mốc thời gian |
| `do_phu_de.py` | đo phụ đề |
| `tao_phu_de_p02.py` | sinh ASS |
| `tao_kdenlive.py` | sinh project |
| `blender/thu_render.py` | bài thử render, mẫu để làm viền sáng, chữ 3D, độ sâu trường ảnh |
| `../../cong_cu/phan_tich_mau.py` (bộ chung) | loudness, màu, độ nét, chuyển động, lưới khung |
