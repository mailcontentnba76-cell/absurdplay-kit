# Chế độ PHÂN TÍCH (khi có video mẫu mới)

1. Chép file vào `P02/mau_goc/` (không đưa lên GitHub). Đặt ID tiếp theo: V11, V12…
2. `ffprobe` để lấy thông số. Nếu là AV1 thì chuyển sang bản H.264 làm việc (giữ nguyên file gốc).
3. Đo:
   - `python3 cong_cu/phan_tich_mau.py <h264> <ra> --nguong-cat 0.2` (bộ chung, ở thư mục gốc repo)
   - `python3 P02/cong_cu/asr_parakeet.py <video>`
   - `python3 P02/cong_cu/do_am_thanh.py <wav16k> <asr.json> <ra.json>`
   - `python3 P02/cong_cu/do_cat_canh.py <h264> <ra.json>`
4. Xem: lưới 4 khung/giây có mốc thời gian (`fps=4,scale=135:240,drawtext=…%{pts}…,tile=10x5`) cho **toàn bộ** video, rồi `khung_quanh.py` ở mọi chỗ nghi chuyển cảnh và mọi hành động nhanh.
   - Máy dò cắt **bỏ sót** các cú lia nhoè và hoà hình. Đèn loé, chữ đổi hay vật chạy ngang **không phải** là cắt.
5. Viết `Vxx_<ten>.md`: nguồn, lời, bảng cảnh phủ cả video tới khung cuối, bảng lời – hình, phụ đề, âm thanh, hook, thiết kế, kiểm sự thật, phạm vi đã kiểm.
6. Cập nhật `TONG_HOP.md` (đếm lại số video có từng đặc điểm) và `references/dac_ta_phong_cach.md` nếu độ tin thay đổi.
7. Ghi rõ phạm vi đã kiểm cho hình và tiếng **riêng nhau**. Không nghe được thì phải nói là chưa nghe.
