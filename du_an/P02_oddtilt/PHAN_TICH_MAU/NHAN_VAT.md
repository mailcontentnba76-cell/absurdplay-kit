# PHÂN TÍCH NHÂN VẬT 14 MẪU — làm lại 05/11/2026 (thay mục "Nhân vật" đã ghi trong từng file)
Nguồn: lưới 1 khung/giây + 24 khung cận nhân vật (door 0,5/4,2/7,6/13,0/19,5/25,4/31,5 s; tape 14,0/32,5; balls 4,5/23,0; umbrella 13,0; pen 5,0; nutcracker 0,5; rotisserie 4,0; bed 0,3/23,2; chair 8,5/20,5; fan 1,0/23,5; shower 2,0; AC 22,0; alarm 1,0).

## 1. Hệ nhân vật: MakeHuman
- **Bằng chứng [QS + ĐO đối chiếu]:** quần áo nhân vật hiện đại trùng khớp bộ quần áo mặc định của phần mềm mã nguồn mở MakeHuman (dữ liệu npm `makehuman-data` 0.0.2):
  - lưng áo thun trắng có chữ "MA…" + logo cam (door 13,0 s) = `male_casualsuit06` (in "MAKE HUMAN" + logo người cam ở lưng) — đã render lại, khớp vị trí logo;
  - sơ mi xanh than + jean đậm + thắt lưng (door 19,5 s, balls 23,0 s) = `male_casualsuit01`;
  - áo xanh có vòng tròn + hình người cam ở ngực (umbrella 13,0 s, pen 5,0 s) = `female_casualsuit01`;
  - quần yếm (nutcracker) = `male_worksuit01` đã đổi màu (yếm xanh đen, áo be).
- Thân người tỉ lệ thật (~7,5 đầu), da texture ảnh, mắt thật, tóc dạng tấm alpha — đúng kiểu MakeHuman mặc định [QS]. **Phần mềm dựng cảnh/animate gốc vẫn chưa biết** (MakeHuman chỉ tạo người) [SL].
- Hoạt ảnh cứng, khớp tay/chân đôi khi gập sai, mặt gần như không biểu cảm, khớp môi không rõ [QS] → hợp với khung xương MakeHuman + tư thế/animation đơn giản.

## 2. Danh mục nhân vật theo video [QS]
| Video | Nhân vật | Trang phục / ngoại hình | Bộ MakeHuman tương ứng |
|---|---|---|---|
| 06 cửa | chính: nam da sáng, tóc nâu ngắn | áo thun trắng logo lưng, jean sáng, giày da nâu | casualsuit06 + short02 + shoes01 |
| 06 cửa | bạn: nam da đen, tóc đen rất ngắn | sơ mi xanh than, jean đậm, giày đen | casualsuit01 + short04 + shoes03 |
| 11 thước | nam da sáng/tối hơn, tóc đen | áo thun **xám** logo, jean | casualsuit06 (đổi màu) |
| 14 bóng rổ | 2 nam: sơ mi xanh than / áo trắng | như video 06 | casualsuit01 / casualsuit06 |
| 13 ô, 04 bút | nữ, tóc buộc/búi nâu | áo xanh logo, jean | female_casualsuit01 + ponytail01 / búi |
| 08 kẹp hạt | nam tóc đen rối | yếm xanh đen + áo be, giày trắng | worksuit01 (đổi màu) + short01 + shoes05 |
| 09 lò quay | nam hói | áo thun nâu, quần đen, giày trắng | casualsuit (đổi màu), không tóc |
| 01, 02, 03, 05, 07, 10 | người tiền sử nam/nữ, tóc dài, râu (03) | áo/váy da thú, đồ lông, đồ da báo | **không có sẵn trong MakeHuman** → cần làm quần áo riêng (đổi texture/mesh) |
| 01, 05, 07 | bạn da đen | đồ da báo / da nâu / áo da trắng | như trên |

## 3. Bộ nhân vật đã dựng lại (engine three.js, `engine/assets/mh/`)
| Mã | Spec | Ghi chú |
|---|---|---|
| `chinh` | `nhan_vat/chinh.json`: nam, trẻ, cơ 0,7, da trắng, casualsuit06, short02, shoes01, mắt xanh | khớp nhân vật chính video 06/14 |
| `ban` | `nhan_vat/ban.json`: nam, trẻ, da đen, casualsuit01, short04, shoes03 | khớp người bạn video 06/14 |
| `nu` | `nhan_vat/nu.json`: nữ, trẻ, da trắng, female_casualsuit01, ponytail01, shoes02 | khớp video 13 |
| `tho` | `nhan_vat/tho.json` + `cong_cu/mh_doi_mau.py`: worksuit01 xanh đen/be, short01, shoes05 | khớp video 08 |
Công cụ: `cong_cu/mh_bake.py` (áp macro targets giới tính/tuổi/cơ/cân/chủng tộc, khớp lại quần áo/tóc/mắt theo cơ thể, tính lại khung xương, xuất mét) + `engine/lib/mh.js` (nạp, SkinnedMesh, khung xương MakeHuman mặc định). Ảnh so sánh đã kiểm bằng mắt: dáng, quần áo, logo, màu da, tóc khớp mẫu; khác: tư thế mặc định chữ A (cần hệ tư thế mới), jean của `chinh` hơi đậm hơn mẫu dưới nắng.

## 4. Việc còn lại để đủ bộ như mẫu
1. Hệ tư thế/động tác cho khung xương MakeHuman (đứng thả tay, ngồi, giơ tay, chống nạnh, quỳ, nằm…) — bộ cũ của P01 dùng tên xương khác.
2. Quần áo người tiền sử (da thú một vai, váy da, đồ lông, đồ da báo) — tự làm texture/mesh trên khung MakeHuman.
3. Giấy phép: dữ liệu npm ghi AGPL3; MakeHuman công bố tài sản hệ thống và mô hình xuất ra được dùng tự do (CC0) — **cần chủ dự án/Claude kiểm lại trước khi đăng sản phẩm** [SL].
