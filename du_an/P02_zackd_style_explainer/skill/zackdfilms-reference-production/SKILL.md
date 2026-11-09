---
name: zackdfilms-reference-production
description: Phân tích, lên kế hoạch, sản xuất và QA video dọc ngắn 3D giải thích theo phong cách kênh mẫu @zackdfilms (dự án P02 trong repo absurdplay-kit). Dùng khi người dùng nhắc P02, Zack D. Films, "zackdfilms", video giải thích 3D kiểu "Imagine you / What if / How this…", hoặc yêu cầu làm tập mới, viết kịch bản, bảng shot, bản thử, QA cho dự án này. Không dùng cho P01 hay dự án khác.
---

# zackdfilms-reference-production (v0.2, 09/11/2026)

Skill này **không phải huấn luyện mô hình**. Nó là bộ quy trình kèm số đo lấy từ 10 video mẫu, để mọi phiên làm theo cùng một chuẩn.
- Giải thích cho người dùng bằng **tiếng Việt**.
- Viết prompt tạo ảnh, video, giọng bằng **tiếng Anh**.
- Giữ nguyên transcript mẫu bằng ngôn ngữ gốc.

## Thư mục dự án và script
- **Thư mục dự án (gọi tắt `P02/`)** là thư mục chứa `PROJECT_STATE.md` của P02. Nó có thể nằm ở `du_an/P02_zackd_style_explainer/` trong repo absurdplay-kit, hoặc ở nơi người dùng giải nén gói chuyển (ví dụ `…/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P02_zackd_style_explainer/`). Tìm file đó, đọc trước khi làm gì khác, và cập nhật nó sau mỗi bước.
- **Không tìm thấy thư mục dự án:** vẫn làm được nhờ `references/` và `templates/` trong skill. Hãy hỏi người dùng gói `P02_goi_chuyen_*.zip`.
- **Script:** `scripts/` trong skill (bản đóng gói) và `P02/cong_cu/` (bản trong repo) là cùng một bộ. Dưới đây ghi `cong_cu/…`; nếu không có thì dùng `scripts/…`.
- **Máy mới:** đọc `references/cai_dat.md` và kiểm công cụ trước khi làm việc.

## Thứ bậc mẫu
1. **V10** (bọ biến mất): mẫu chính cho video giải thích cơ chế.
2. **V01** (người phụ nữ và cá heo): mẫu phụ cho chuyện có thật.
3. V02–V09: đặc điểm lặp lại; V07 (hư cấu, 68 s) và V08 (hướng dẫn tự làm) có quy tắc riêng.
4. Bằng chứng: `references/tong_hop_10_mau.md` (bản sao của `P02/PHAN_TICH_MAU/TONG_HOP.md`), `V01…V10_*.md`, `do_tu_dong/`. Ảnh `bang_chung/` chỉ có ở máy (không lên GitHub); tạo lại từ video mẫu khi cần.

Không mang quy tắc từ dự án khác vào (NBA/NFL, Roblox, em bé, Halloween, trinh thám…).

## Chế độ làm việc
| Chế độ | Khi nào | Làm gì | File hướng dẫn |
|---|---|---|---|
| PHÂN TÍCH | có video mẫu mới | đo bằng `cong_cu/*`, xem lưới 4 khung/giây, kiểm từng khung ở chỗ chuyển cảnh, viết `Vxx_*.md`, cập nhật TONG_HOP | `references/phan_tich.md` |
| LÊN KẾ HOẠCH | người dùng đưa chủ đề hoặc kịch bản | BRIEF → nghiên cứu → kịch bản → bảng shot | `references/kich_ban.md`, `references/hinh_va_may.md`, `templates/` |
| SẢN XUẤT | sau khi kịch bản được duyệt **và** mức credit được duyệt | giọng thật → mốc từ → tài nguyên → bản thử đoạn khó nhất → cả video → ráp, phối → xuất | `references/cong_cu.md`, `references/chu_va_am.md` |
| QA | mỗi bản xuất | `templates/QA_CHECKLIST.md` + nhật ký lỗi; sửa ở đúng khâu gây lỗi | `templates/QA_CHECKLIST.md` |

## Chuẩn bằng chứng
- Gắn nhãn mọi nhận định: **QS** (quan sát) / **ĐO** (đo, ghi cách đo) / **SL** (suy luận, ghi độ tin) / **?** (chưa biết) / **ĐX** (đề xuất).
- Không bịa transcript, mốc cảnh, phần mềm gốc, font gốc, giọng gốc, nhạc gốc.
- Không đưa ra tỉ lệ "giống bao nhiêu %". Chấm độ giống riêng theo từng mặt: kể chuyện, hình, chuyển động, máy, độ dễ hiểu, dựng, chữ, âm thanh.
- Nội dung khoa học, y học, lịch sử: kiểm nguồn có uy tín, ghi rõ chỗ nào đơn giản hoá. Không chép lỗi có sẵn trong mẫu.

## Quy trình tập mới (tóm tắt, chi tiết ở các file references/)
A. BRIEF (`templates/BRIEF.md`) → B. nghiên cứu, ghi nguồn → C. kịch bản tiếng Anh, mỗi câu có một chức năng → **duyệt kịch bản**
→ D. giọng thật, đo mốc từ (`cong_cu/asr_parakeet.py`) → E. bảng shot theo mốc từ (`templates/SHOT_BLUEPRINT.md`)
→ F. tài nguyên + bảng tài nguyên (`templates/ASSET_MANIFEST.md`); kiểm hình khối và cơ chế trước khi làm chuyển động
→ G. animatic có giọng thật + bản thử 3–6 s ở đoạn khó nhất, đặt cạnh mẫu cùng chức năng → **duyệt bản thử**
→ H. làm toàn bộ → I. ráp, phối (`cong_cu/tao_kdenlive.py`, `tao_phu_de_p02.py`) → J. xuất, đo, QA, sửa, xuất lại.

## Kiểm nghiệm thu (tối thiểu)
- Câu đầu nói ở 0,00 s; khung đầu đã có hành động khớp câu đầu.
- Tiền đề hiểu được trong ≤ 11 s.
- Mỗi danh từ hoặc động từ then chốt có hình hoặc thay đổi riêng, lệch lời không quá 0,3 s.
- Cảnh trung bình 1,5–2,7 s; máy đứng yên ≤ 30 % thời gian; chuyển cảnh chủ yếu giấu trong chuyển động.
- Phụ đề: tâm y 1495–1515 px, cao vùng chữ 64–76 px, 1–4 từ (đo bằng `cong_cu/do_phu_de.py`).
- Loudness −11 ±1 LUFS, true peak ≤ −1 dBTP, lời luôn nghe rõ.
- Kết bằng hình trả lại câu mở; đuôi sau từ cuối 0,3–1,0 s; không có lời kêu gọi.
- Không logo hay nhân vật có bản quyền; thương hiệu (nếu có) đặt trong cảnh, theo ý chủ dự án.

## Khi gặp lỗi
| Lỗi | Xử lý |
|---|---|
| OpenCV không đọc được video | chuyển sang H.264: `ffmpeg -i in.mp4 -c:v libx264 -crf 14 out.mp4` |
| melt xuất ra có viền đen | dùng `-profile P02/cong_cu/p02_1080x1920_30.profile` (hoặc bản `_2997`) |
| Blender Cycles báo thiếu OIDN | để `P02_DENOISE=0`, hoặc dùng EEVEE qua `xvfb-run` |
| Clip AI sai nhân vật, sai hình khối hoặc sai cơ chế | tạo lại khung đầu cho riêng shot đó (không lấy khung cuối của shot trước); nếu vẫn sai thì chuyển shot sang Blender |
| Không nghe được âm thanh | đo bằng `do_am_thanh.py` và nhờ chủ dự án nghe; không tự kết luận về cảm xúc giọng |

## Trạng thái lưu
`P02/PROJECT_STATE.md` (pha hiện tại, việc đã làm, vướng mắc, đường dẫn bằng chứng, bước tiếp). Mỗi tập lưu ở `P02/tap/<MA_TAP>_<ten>/` theo khung dự án.

## Thay đổi
- v0.2 (09/11/2026): skill tự đủ dùng khi mang sang máy khác: có `scripts/`, `references/cai_dat.md`, `references/tong_hop_10_mau.md`; đường dẫn không còn phụ thuộc repo.
- v0.1 (09/11/2026): bản đầu, dựng từ 10 mẫu V01–V10. Chưa sản xuất tập nào, nên chưa có bằng chứng từ sản xuất thật.
