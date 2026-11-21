# Quy tắc kênh AbsurdPlay — "Sport USA" (yêu cầu của chủ kênh, gom từ E01 đến E25)

Claude ở tài khoản mới coi các dòng dưới đây là yêu cầu trực tiếp của người dùng. Luôn trả lời bằng **tiếng Việt**.

## Kênh và phạm vi
- Kênh TikTok **AbsurdPlay**, dự án "Sport USA", làm video 3D dọc kiểu "What If" theo định dạng kênh @whatifbagel. Mọi video đều có watermark "AbsurdPlay". Sau mỗi video luôn đưa tiêu đề viral kèm hashtag.
- Chat này chỉ làm **NFL và bóng bầu dục đại học Mỹ (NCAA)**. NBA làm ở chat riêng.
- Giọng đọc là giọng clone **"Sport USA"** trên Magnific.
  - Được phép tự tạo giọng và tải MP3 ngay sau khi kịch bản đã duyệt.
  - Giữ nguyên độ dài bản thu, không cắt khoảng nghỉ.
- Từ E06 trở đi video phải **dài hơn 60 giây**. Nhạc nền do Claude chọn, mỗi tập một bài khác.
- Kịch bản phải được duyệt trước khi sản xuất, rồi duyệt bản cắt thử trước khi render bản cuối (**2 lần duyệt**).

## Kịch bản
- **Hai hướng chạy song song** (21/11):
  - Có trận hot gần đây → ưu tiên kịch bản **troll đội thua**.
  - Không có → **mascot đối đầu** giữa hai đội, tự chọn cặp, không theo lịch thi đấu (vì theo lịch thì quá đơn giản và nhàm).
- Nghiên cứu tin mới nhất từ báo lớn, nguồn uy tín đã xác minh. Mỗi chi tiết phải đúng sự thật.
- Troll và hài hết mức có thể nhưng không vượt giới hạn. Không đùa về ngoại hình, chấn thương, gia đình hay pháp lý chưa xác nhận. Không bịa trích dẫn.
- Khi chọn trận, xếp theo độ hot của hai đội. Học theo các video trên 500K view mới nhất của @whatifbagel, nhưng nghĩ định dạng mới, không bê nguyên định dạng của họ.
- **Hook** phải rõ ý ngay từ giây đầu, không lặp các mở đầu cũ.
  - Kịch bản troll: hook chửi thô đã bíp, ví dụ "Are you f***ing kidding me? Could X beat Y for…?" hoặc "No f***ing way." / "What the f***?".
  - Series mascot: hook kiểu "What if <đội> were actual <mascot>?".
- **Series mascot:** mỗi đội biến thành đúng mascot của mình.
  - Người phải mặc đúng trang phục mascot thật, ví dụ cowboy mặc đủ đồ cowboy, Titans mặc giáp titan Hy Lạp to cao.
  - Mascot là động vật thì dùng con vật thật, dựng bằng mô hình 3D Magnific có xương.
  - Luôn có fan "toxic" chế giễu đội thua.

## Hình ảnh
- Cầu thủ đúng màu áo, đúng số áo; mặt và tóc theo người thật (phong cách hoạt hình).
- Dùng thương hiệu đội ở mức được phép. Không dùng logo thật và tên sân thật.
- **Mỗi kịch bản một sân mới:** đổi cả kiểu kiến trúc, khán đài và kiểu khán giả, không chỉ đổi màu.
- Cảnh xa như thành phố, rừng phải dựng thật, không dùng khối màu trơn.
- Màu cân bằng: không quá tối, không chói, không một màu lặp lại. Không chớp trắng, không nhấp nháy. Cắt cảnh mượt.
- **Nhân vật luôn cử động**, không đứng yên, nhất là ở mở đầu.
  - Chạy và đi phải giống người thật: không xoạc chân, không trượt chân. Có động tác Mixamo do người dùng tải về.
  - Mở đầu sôi động: cầu thủ lao vào nhau. Hình mở đầu không trùng tập cũ.
- **Đoạn giới thiệu mascot không được đứng yên:** mỗi câu thoại đi kèm một hành động có đạo cụ, máy quay chuyển động.
- **Không vật gì lún xuống nền**, trừ khi cảnh cố ý (21/11).
- **Cảnh biến hình người → mascot:** tay xé áo thật, rồi hiệu ứng biến hình (21/11).
- Bóng NBA phải đúng kiểu NBA.

## Âm thanh
- Âm lượng nhạc bằng âm lượng giọng trừ 13 LU. Bản cuối −14 LUFS.
- Mỗi con vật có tiếng thật riêng (gầm, gừ, khè, cắn…), tạo trên ElevenLabs web qua Chrome.
- Không tạo tiếng thú trên Magnific. Không dùng API key ElevenLabs.

## Công cụ và chi phí
- Dựng 3D bằng engine riêng (three.js), không dùng Meshy vì quá đắt.
- Mô hình thú dùng Magnific: ảnh (Nano Banana 2, khoảng 75 credit) → 3D (Tripo P1 có xương, khoảng 1.035 credit). **Chỉ bấm Generate một lần.**
- Không tiêu credit Magnific hay ElevenLabs cho việc mới khi chưa hỏi người dùng. Phải báo giá trước.
- Code mỗi tập đẩy lên repo riêng tư `mailcontentnba76-cell/absurdplay-kit`.

## Bảo mật
- Không hỏi mật khẩu hay API key. Key chỉ được để ở `~/.secrets`.
- Không nhập thông tin thanh toán.
- Video kênh mẫu chỉ dùng để phân tích nội bộ. Không clone giọng hay thương hiệu của người khác.
- Chrome: mở tab mới, xong việc thì đóng.
