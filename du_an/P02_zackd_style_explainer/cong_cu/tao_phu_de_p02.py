#!/usr/bin/env python3
"""Sinh phụ đề ASS theo số đo 10 video mẫu P02 (PHAN_TICH_MAU/TONG_HOP.md mục 1 #5).
Số đo: chữ trắng, viền đen mảnh, bóng đổ tối mềm, căn giữa; tâm vùng chữ y ≈ 1505 px (0,784 khung 1920);
chiều cao vùng điểm ảnh trắng ≈ 70 px; 1–4 từ mỗi lần; đổi theo cụm lời; bỏ dấu chấm/phẩy, giữ ? và ngoặc kép.
Font gốc CHƯA XÁC ĐỊNH -> mặc định đề xuất 'Inter ExtraBold' (OFL, có sẵn); đổi bằng --font.
Đầu vào: asr_words.json (asr_parakeet.py: {"words": [[word, t_start], ...]}) hoặc list [[t, word], ...].
Dùng: python3 tao_phu_de_p02.py <words.json> <ra.ass> [--toi-da-tu 4] [--toi-da-ky-tu 22] [--font "Inter ExtraBold"] [--co 92] [--tam-y 1498]  (đã hiệu chỉnh 09/11/2026: co 92 -> vùng chữ cao 71 px; tam-y 1498 -> tâm đo được ≈1505)
Mốc tắt của cụm cuối = từ cuối + 0,6 s (hoặc --het <giây>).
Kiểm sau khi render: đo lại bằng cong_cu/do_phu_de.py; tâm y phải 1495–1515, cao vùng chữ 64–76 px.
"""
import json, re, argparse
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--toi-da-tu', type=int, default=4); ap.add_argument('--toi-da-ky-tu', type=int, default=22)
ap.add_argument('--font', default='Inter ExtraBold'); ap.add_argument('--co', type=int, default=92)
ap.add_argument('--tam-y', type=int, default=1498); ap.add_argument('--het', type=float, default=None)
ap.add_argument('--sau', type=float, default=0.0, help='dịch toàn bộ mốc (giây), ví dụ -0.05 để chữ hiện sớm hơn lời')
a = ap.parse_args()
d = json.load(open(a.src)); W = d['words'] if isinstance(d, dict) else d
words = [(float(w[1]), str(w[0])) if isinstance(w[0], str) else (float(w[0]), str(w[1])) for w in W]
sents, cur = [], []
for t, w in words:
    cur.append((t, w))
    if re.search(r'[.?!]["”]?$', w): sents.append(cur); cur = []
if cur: sents.append(cur)
chunks = []
for se in sents:
    # cắt thêm ở dấu phẩy, rồi chia đều theo giới hạn từ/ký tự
    parts, p = [], []
    for t, w in se:
        p.append((t, w))
        if w.endswith(','): parts.append(p); p = []
    if p: parts.append(p)
    for part in parts:
        n = len(part); k = max(1, -(-n // a.toi_da_tu))
        clean = lambda xs: ' '.join(x for _, x in xs)
        while k < n and any(len(clean(part[i * n // k:(i + 1) * n // k])) > a.toi_da_ky_tu for i in range(k)): k += 1
        for i in range(k):
            c = part[i * n // k:(i + 1) * n // k]
            if c: chunks.append(c)
def txt(c):
    s = ' '.join(w for _, w in c)
    return re.sub(r'[.,;:!](?=["”]?$)|[,;:](?=\s)', '', s).strip()
end_all = a.het if a.het else words[-1][0] + 0.6
def ts(t):
    t = max(0.0, t + a.sau); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'
mv = 1920 - a.tam_y - a.co // 2
hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: P02,{a.font},{a.co},&H00FFFFFF,&H00FFFFFF,&H00000000,&H78000000,0,0,0,0,100,100,0,0,1,2.5,3,2,60,60,{mv},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open(a.out, 'w') as f:
    f.write(hdr)
    for i, c in enumerate(chunks):
        st = c[0][0]; en = chunks[i + 1][0][0] if i + 1 < len(chunks) else end_all
        f.write(f'Dialogue: 0,{ts(st)},{ts(en)},P02,,0,0,0,,{txt(c)}\n')
print(a.out, len(chunks), 'cụm')
