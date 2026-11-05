import json,sys,os,statistics as st
sys.path.insert(0,os.path.dirname(__file__))
from ghichu_quan_sat import N
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=sys.argv[1]
D=json.load(open(S+'/tong.json'))
def v(x,n=1): return str(round(x,n)).replace('.',',') if isinstance(x,(int,float)) else str(x)
order=sorted(D)
idx={}
for i,b in enumerate(order,1):
    d=D[b]; n=N[b]; code=f"{i:02d}_{n['slug']}"; idx[b]=code
    dur=d['dur']; m=d['may']; a=d['am']; s=d['sub']
    vd=d['kw'].get('van_de',[])
    vd_pct=', '.join(f"{v(t)} s ({round(100*t/dur)}%)" for t in vd)
    L=[]
    L.append(f"# PHÂN TÍCH VIDEO MẪU {i:02d} — {n['ten']}")
    L.append(f"File: `{b}.mp4` (tên file do chủ dự án đặt khi tải; thứ tự trên kênh và ngày đăng: chưa biết) · md5 {d['md5']}")
    L.append("Dự án: P02 oddtilt · Ngày: 05/11/2026 · Người phân tích: Claude · Công cụ: ffprobe/ffmpeg (ebur128, silencedetect), `phan_tich_mau.py`, OpenCV (cắt cảnh, phụ đề, optical flow), librosa (F0, nhịp), Parakeet-TDT 0.6B v2 qua sherpa-onnx (chép lời + mốc từ)")
    L.append("Nhãn: **[QS]** quan sát bằng mắt trên lưới 1 khung/giây + ảnh điểm cắt (mốc ±0,5 s) · **[ĐO]** đo bằng công cụ · **[SL]** suy luận chưa kiểm chứng")
    L.append("\n> Giới hạn chung: Claude **không nghe được âm thanh** trong môi trường này. Mọi nhận định về giọng, nhạc, SFX chỉ dựa trên số đo tín hiệu; danh sách SFX theo mốc **chưa làm được** (xem mục 8).\n")
    L.append("## A. Kỹ thuật [ĐO]")
    L.append("| Mục | Giá trị |\n|---|---|")
    L.append(f"| Thời lượng / khung / fps | {v(dur,2)} s / 720×1280 (9:16) / {v(d['fps'],0)} fps; mã hoá AV1 + AAC 44,1 kHz stereo (bản tải về) |")
    L.append(f"| Loudness / true peak / LRA | {v(d['lufs'])} LUFS / {v(d['tp'])} dBFS / {v(d['lra'])} LU (đo trên bản đã qua TikTok nén lại) |")
    L.append(f"| Side − Mid | {v(d['sidemid'])} dB |")
    L.append(f"| Khoảng lặng > 0,35 s (−40 dB) | {d['lang']} |")
    L.append(f"| Bão hoà / sáng trung vị (HSV 0–255) | {v(d['bh'],0)} / {v(d['sang'],0)} |")
    L.append(f"| Độ nét tương đối (tỉ lệ chi tiết mịn) | {v(d['net'],2)} |")
    # 1 kịch bản
    L.append("\n## 1. Kịch bản")
    L.append(f"- Lời đầy đủ (ASR Parakeet, chưa sửa tay; có thể sai vài từ) [ĐO]:\n\n> {d['text']}\n")
    L.append(f"- {d['so_tu']} từ; lời từ {v(d['loi_bd'],2)} s đến ≈{v(d['loi_kt'],2)} s; **{v(d['tpm'],0)} từ/phút** [ĐO]. Lời bắt đầu ngay khung đầu, kết thúc sát cuối file (không có đoạn đuôi im) [ĐO].")
    L.append(f"- Câu mở đầu (hook) = **một vấn đề đời thường viết bằng ngôi \"you\"**, thường là câu nước đôi tình dục/thô tục [QS].")
    L.append(f"- Vòng \"vấn đề → giải pháp\": các câu mở bằng \"But/Except\" ở {vd_pct if vd else '—'} → **{len(vd)} vòng vấn đề** [ĐO trên lời].")
    if 'genius' in d['kw']: L.append(f"- Cụm nhận diện \"genius\" ở {v(d['kw']['genius'],2)} s ({round(100*d['kw']['genius']/dur)}%) [ĐO].")
    rc=', '.join(f"{w} ({v(t,1)} s)" for t,w in d['reacts'])
    L.append(f"- Câu khen ngắn chen giữa: {rc or '—'} [ĐO].")
    if 'congrats' in d['kw']: L.append(f"- Kết: \"Congratulations! You've invented …\" ở {v(d['kw']['congrats'],2)} s ({round(100*d['kw']['congrats']/dur)}%) [ĐO].")
    else: L.append("- Kết: câu \"Now …\" nước đôi nối lại hook/người bạn, không có \"Congratulations\" [ĐO].")
    L.append(f"- Đặc biệt: {n['dacbiet']}")
    # 2-3
    L.append("\n## 2. Hình ảnh [QS]")
    L.append(f"- Bối cảnh: {n['boicanh']}")
    L.append("- Kiểu render: 3D thời gian thực bán tả thực (nhân vật & đạo cụ kiểu tài sản game, nền texture ảnh chụp), ánh sáng ban ngày, bóng đổ rõ; không có hậu kỳ màu mạnh. Engine/phần mềm gốc: **chưa xác định** [SL: giống engine game thời gian thực].")
    L.append(f"- Màu: bão hoà trung vị {v(d['bh'],0)}, sáng {v(d['sang'],0)} [ĐO].")
    L.append("\n## 3. Nhân vật [QS]")
    L.append(f"- {n['nhanvat']}")
    L.append("- Diễn xuất: tư thế/hoạt ảnh cứng, khớp lời ở mức hành động (không khớp môi rõ), biểu cảm mặt hạn chế; cảm xúc chủ yếu truyền qua icon 2D (tim, Zzz, mồ hôi, sóng mùi) và cử chỉ lớn [QS].")
    # 4 shot/camera + bảng nhịp
    L.append("\n## 4. Shot / máy quay")
    L.append(f"- {d['so_shot']} shot; độ dài trung vị **{v(d['shot_tv'],2)} s** [ĐO: OpenCV, cắt = đỉnh chênh lệch điểm ảnh/histogram; đã xem lại bằng ảnh điểm cắt hoặc lưới 1 khung/giây].")
    L.append(f"- Máy (optical flow, ảnh 180×320) [ĐO]: đứng yên {v(m['dung_yen_pct'])}% · đẩy vào {v(m['day_vao_pct'])}% · lùi {v(m['lui_pct'])}% · lia ngang {v(m['lia_ngang_pct'])}% · lia dọc {v(m['lia_doc_pct'])}% · tốc độ trung vị {v(m['toc_do_trung_vi_px_s'])} px/s, p90 {v(m['toc_do_p90'])} px/s. (Phân loại thô; zoom của vật lớn dễ bị tính là đẩy/lùi.)")
    L.append("\n### Bảng theo nhịp truyện")
    L.append("| t (s) | Lời (rút gọn) | Hình | Cỡ cảnh / máy | Chữ / đồ hoạ | Chức năng | Nhãn |\n|---|---|---|---|---|---|---|")
    for t,loi,hinh,may,chu,cn in n['nhip']:
        L.append(f"| {t} | {loi} | {hinh} | {may} | {chu or 'phụ đề trắng 1–3 từ'} | {cn} | [QS] mốc lời [ĐO] |")
    L.append("\n### Bảng shot tự động [ĐO]")
    L.append("| # | Vào–ra (s) | Dài | Lời trong shot |\n|---|---|---|---|")
    for k,sh in enumerate(d['shots'],1):
        L.append(f"| {k} | {v(sh['vao'],2)}–{v(sh['ra'],2)} | {v(sh['dai'],2)} | {sh['loi']} |")
    # 5 chuyển động
    L.append("\n## 5. Chuyển động")
    L.append("- Máy gần như không bao giờ đứng hẳn trong shot người: trôi/đẩy/lùi chậm; shot giải thích cơ chế thường máy đứng hoặc quay quanh vật [QS + số đo mục 4].")
    L.append("- Vật thể biến đổi tức thời theo lời (đồ vật \"hiện ra\", đổi hình dạng, mọc thêm bộ phận) — chuyển động \"minh hoạ\" hơn là vật lý thật [QS].")
    # 6 dựng
    L.append("\n## 6. Dựng")
    L.append(f"- Đổi hình theo nhịp lời: mỗi \"so you …\" (giải pháp) và mỗi \"But/Except\" (vấn đề) thường kèm một shot mới [QS đối chiếu bảng shot].")
    L.append("- Chuyển cảnh: cắt cứng là chính; không thấy hoà hình/lóa trắng; một số video dùng máy chạy liền hoặc whip pan thay cho cắt [QS].")
    # 7 chữ
    L.append("\n## 7. Chữ trên màn hình")
    if b.endswith('point.pen'):
        L.append("- Bộ đo chữ tự động **không dùng được** cho video này (nền giấy/bàn trắng trùng màu chữ). Quan sát [QS]: cùng kiểu chữ trắng viền tối, cùng vị trí giữa ~60% chiều cao như các video khác.")
    else:
        L.append(f"- Phụ đề trắng, chữ đậm sans bo tròn, viền/bóng tối mảnh; căn giữa ngang; dải chữ y≈{v(s['tren_px'],0)}–{v(s['duoi_px'],0)} px / 1280 (tâm ≈{round(100*(s['tren_px']+s['duoi_px'])/2/1280)}% chiều cao); cao dải chữ ≈{v(s['cao_px'],0)} px [ĐO]; rộng trung vị {v(s['rong_tv'],0)} px, tối đa {v(s['rong_max'],0)} px / 720 [ĐO].")
        L.append(f"- {s['so_cum']} cụm chữ; **trung vị {v(s['tu_cum_tv'],0)} từ/cụm** (1 từ {v(s['pct_1'],0)}%, 2 từ {v(s['pct_2'],0)}%, ≥3 từ {v(s['pct_3p'],0)}%) [ĐO: đếm cụm theo khung trống giữa hai cụm, gán từ theo mốc ASR; cụm dài nhất có thể là 2 cụm bị gộp].")
    L.append("- Cụm hiện cả cụm một lúc, có 1 khung trống giữa hai cụm, hơi \"nảy\" khi xuất hiện [QS ở video giường 2,0–3,6 s, 15 khung/s]. Từ nhấn (LOVE) và từ chửi (FUCKING) viết HOA [QS]. Font: **chưa xác định** [SL: dạng Poppins/Montserrat đậm].")
    L.append("- Không có tiêu đề, logo hay chữ trang trí khác ngoài phụ đề và icon 2D [QS].")
    # 8 âm thanh
    L.append("\n## 8. Âm thanh")
    L.append(f"- Một giọng kể ngôi \"you\", nói liên tục, nhanh {v(d['tpm'],0)} từ/phút, không lặng > 0,35 s [ĐO]. F0 trung vị {v(a.get('F0_trung_vi_Hz'),0)} Hz [ĐO: librosa pyin; có thể lẫn nền]. Giới tính/giọng: **chưa nghe kiểm** [SL: một người kể nam, năng lượng cao].")
    L.append(f"- Mức nền giữa câu ({'0,02–0,12 s trước câu kế'}) trung vị {v(a.get('giua_cau_dBFS_trung_vi'))} dBFS so với lời {v(a.get('loi_dBFS'))} dBFS → nền thấp hơn lời ≈{v(a.get('loi_dBFS')-a.get('giua_cau_dBFS_trung_vi'),0)} dB [ĐO]. Có lớp nền (nhạc/hiệu ứng/đuôi vang) nhưng **không xác định được loại** [SL].")
    L.append(f"- Độ đều nhịp phần percussive (tự tương quan onset) {v(a.get('do_deu_nhip'),2)} [ĐO: rất thấp] → không có nhạc nền nhịp trống rõ ở mức nghe được [SL].")
    L.append("- SFX theo mốc: **chưa phân tích được** (không nghe được; chưa có công cụ tách nguồn chạy được offline).")
    # F
    L.append("\n## F. Vì sao hiệu quả [SL trừ khi ghi khác]")
    L.append("| Giai đoạn | Yếu tố | Mốc | Nhãn |\n|---|---|---|---|")
    L.append(f"| 0–3 s | Câu đầu là vấn đề cá nhân, thô/nước đôi, nói ngay từ khung 0; hình đã có nhân vật đang làm hành động lạ | 0,0 s | [ĐO] mốc lời, [SL] tác dụng |")
    L.append(f"| Giữa | Vòng lặp \"vấn đề → giải pháp\" mỗi ~{v(dur/max(1,len(vd)+1),1)} s, mỗi vòng có hình mới + câu khen ngắn → luôn có câu hỏi \"lỗi tiếp theo là gì?\" | {vd_pct or '—'} | [ĐO] mốc, [SL] tác dụng |")
    L.append("| Leo thang | Giải pháp phi lý (nhà máy hạt nhân, máy laser, quả tạ phá nhà, PC chơi game) đặt ở nửa sau | xem bảng nhịp | [QS] |")
    L.append("| Kết | \"Congratulations! You've invented …\" (thoả mãn tri thức) hoặc câu nước đôi về người bạn (để chia sẻ/bình luận) | cuối | [QS] |")
    L.append("\n## G. Chưa xác minh")
    L.append("- Thứ tự trên kênh, ngày đăng, số view/like/share; caption gốc (trừ tên file); font chữ; engine 3D; giọng thật hay TTS; nhạc/SFX cụ thể.")
    L.append("- Lời là bản ASR chưa sửa tay; một số từ có thể sai.")
    open(f'{OUT}/{code}.md','w').write('\n'.join(L)+'\n')
json.dump(idx,open(S+'/idx.json','w'),ensure_ascii=False)
print('\n'.join(idx.values()))
