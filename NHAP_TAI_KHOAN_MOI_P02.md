# Chuyển dự án P02 "How you invented …" (mẫu @oddtilt) sang tài khoản Claude / máy khác

## Gói gồm
| File | Là gì | Dùng ở đâu |
| --- | --- | --- |
| `invention-chain-shorts.zip` | **Skill chính** của P02: `SKILL.md` (luật phong cách, bảng đã dùng) + `QUY_TRINH_DAY_DU.md` (cài đặt, 14 bước làm 1 tập kèm lệnh, QA, chi phí, lỗi hay gặp, thứ phải tự thêm) + `cai_dat.sh`, `kiem_tra.sh` | Tài khoản mới: Settings → Capabilities → Skills → Upload skill |
| `video-production-pipeline.zip` | Skill chung cho mọi dự án video (G0–G8) | Cài giống trên (tuỳ chọn) |
| `AbsurdPlay_P02_am_thanh.zip` | 31 SFX + 2 nhạc nền + giọng gốc E03–E05 (mẫu để clone lại giọng) | Đính kèm vào phiên đầu tiên; **giữ riêng tư** (kho GitHub công khai, nhạc là file của bạn) |
| Toàn bộ code + nhân vật + texture + mocap + tài liệu | Nằm trong GitHub (kho công khai) nhánh `du-an-moi` | `git clone https://github.com/mailcontentnba76-cell/absurdplay-kit -b du-an-moi` hoặc tải ZIP: https://github.com/mailcontentnba76-cell/absurdplay-kit/archive/refs/heads/du-an-moi.zip |

Không có trong gói: video đã xuất, khung render, node_modules, mô hình chép lời Parakeet và dữ liệu MakeHuman (script `cai_dat.sh` tự tải lại).

## Các bước ở tài khoản mới
1. **Cài skill:** Settings → Capabilities → bật Code execution / Skills → Upload `invention-chain-shorts.zip` (và `video-production-pipeline.zip`).
2. **Kết nối:**
   - **Magnific** (Settings → Connectors) đăng nhập tài khoản Magnific có credit. Cùng tài khoản Magnific cũ → giọng "Odd Tilt" (voiceId 197595) dùng được ngay. Tài khoản Magnific khác → clone lại giọng từ `tap/E05_xe_dap/am_thanh/giong_goc.mp3` trong gói âm thanh, đặt tên "Odd Tilt", báo Claude voiceId mới.
   - **GitHub**: cấp quyền repo `absurdplay-kit` để Claude lưu tiến độ (push).
   - **Claude Code cloud** (nếu dùng): môi trường cho phép mạng tới `pikaso.cdnpk.net` (tải file Magnific), giữ bật package managers; có thể lưu `cai_dat.sh` làm setup script.
3. **Mở phiên mới**, đính kèm `AbsurdPlay_P02_am_thanh.zip`, gửi câu lệnh trong `01_CAU_LENH_KHOI_DONG.md` mục D (cũng có ở `QUY_TRINH_DAY_DU.md` mục 10).
4. Claude chạy `kiem_tra.sh --render` và báo mục nào **THIẾU** + bạn cần làm gì.

## Bạn cần tự lo (Claude không tự làm được)
- Đăng nhập/kết nối Magnific, GitHub; giữ credit Magnific (≈ 650 credit/tập khi bối cảnh mới).
- Giấy phép nhạc nền `the_curious_ukulele_conundrum.mp3` khi đăng.
- Nghe thử bản giao (Claude không nghe được âm thanh).
- (Tuỳ chọn) tải 2 video mẫu viral golf ball + trampoline lên Release `mau-oddtilt` để lưu.
