# Mẫu thư mục cho một dự án mới
Chép cả thư mục này thành `du_an/<MA_DU_AN>_<ten_ngan>/`, rồi chép các mẫu trong `../../mau/` vào đúng chỗ:

```
<MA_DU_AN>_<ten_ngan>/
  HO_SO_DU_AN.md          ← từ MAU_01
  QUY_TRINH_DU_AN.md      ← từ MAU_03
  BANG_KIEM_CONG_CU.md    ← từ MAU_04
  NHAT_KY_LOI.md          ← từ MAU_07
  NHAT_KY_PHIEN_BAN.md    ← từ MAU_08
  PHAN_TICH_MAU/          ← mỗi video mẫu 1 file từ MAU_02 + TONG_HOP.md + thư mục số đo của phan_tich_mau.py
  mau_goc/                ← video mẫu (chỉ dùng nội bộ, không đưa vào sản phẩm)
  tai_nguyen/             ← tài nguyên chủ dự án gửi (voice, logo, sheet nhân vật, nhạc có giấy phép…)
  tap/
    <MA_TAP>_<ten>/
      kich_ban/           ← kịch bản + nguồn + phần kịch tính hóa
      giong/  hinh/  am_thanh/
      thu/                ← bản thử + MAU_05 đã chấm + ảnh ghép cạnh mẫu
      giao/               ← video cuối, project + media (zip), stem, phụ đề, lưới 1 khung/giây, QA (MAU_06), HUONG_DAN_TIEP_TUC.md
```

Lệnh tạo nhanh (Git Bash / Linux / macOS), chạy từ thư mục `BO_HUONG_DAN_SAN_XUAT_VIDEO`:
```bash
P="du_an/P01_ten_ngan"; mkdir -p "$P"/{PHAN_TICH_MAU,mau_goc,tai_nguyen,tap}
cp mau/MAU_01_HO_SO_DU_AN.md "$P/HO_SO_DU_AN.md"; cp mau/MAU_03_QUY_TRINH_DU_AN.md "$P/QUY_TRINH_DU_AN.md"
cp mau/MAU_04_BANG_KIEM_CONG_CU.md "$P/BANG_KIEM_CONG_CU.md"; cp mau/MAU_07_NHAT_KY_LOI.md "$P/NHAT_KY_LOI.md"; cp mau/MAU_08_NHAT_KY_PHIEN_BAN.md "$P/NHAT_KY_PHIEN_BAN.md"
```
Mỗi dự án độc lập hoàn toàn: không tham chiếu hay chép thông số từ thư mục dự án khác.
