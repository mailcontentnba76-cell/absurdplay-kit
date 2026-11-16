"""Ráp demo 20 s (P02): khung render + phụ đề + thẻ '45 MINUTES LATER' + giọng tạm (Piper) + nhạc CC0 + SFX.
Dùng: python3 ty_demo_rap.py <thư mục khung> <thư mục câu giọng (l0..l8.wav)> <alvana-audio> <file ra.mp4>
Giọng tạm Piper en_US-ryan-high — THAY bằng Magnific khi có.
"""
import sys, os, json, subprocess, wave
from PIL import Image, ImageDraw, ImageFont

FR, LINES, ALV, OUT = sys.argv[1:5]
FPS, DUR = 30, 20.0
info = json.load(open(os.path.join(LINES, 'info.json')))
STARTS = [0.15, 2.55, 4.3, 6.05, 7.3, 9.6, 11.8, 15.0, 18.4]  # mốc bắt đầu từng câu (khớp phân cảnh trong ty_demo.html)
HL = ['PICK', 'MOVIE.', 'LONG.', 'COMEDY.', 'LAUGH.', 'LATER.', 'NINTH', 'ASLEEP', 'ALLOWED']  # từ nhấn mạnh (nền xanh ngọc)

# --- phụ đề: chia cụm 2–3 từ, thời gian chia theo số ký tự ---
cues = []
for i, (txt, d) in enumerate(zip(info['lines'], info['dur'])):
    w = txt.upper().split()
    groups, g = [], []
    for x in w:
        g.append(x)
        if len(g) == 3 or (len(g) == 2 and len(' '.join(g)) > 12): groups.append(g); g = []
    if g: groups.append(g)
    tot = sum(len(' '.join(g)) + 2 for g in groups); t = STARTS[i]
    for g in groups:
        dd = d * (len(' '.join(g)) + 2) / tot; cues.append((t, t + dd + 0.12, g, HL[i])); t += dd

F = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 84)
FB = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', 112)
TEAL = (43, 181, 160)

def draw_sub(im, words, hl):
    d = ImageDraw.Draw(im); sp = 22
    ws = [d.textlength(w, font=F) for w in words]; total = sum(ws) + sp * (len(words) - 1)
    x = (1080 - total) / 2; y = 1300
    for w, wl in zip(words, ws):
        if w.startswith(hl.rstrip('.')) or w == hl:
            d.rounded_rectangle([x - 14, y - 10, x + wl + 14, y + 100], radius=18, fill=TEAL)
        d.text((x, y), w, font=F, fill='white', stroke_width=8, stroke_fill='black'); x += wl + sp

def draw_card(im, t):
    k = min(1, (t - 9.3) / 0.25); d = ImageDraw.Draw(im)
    for j, line in enumerate(['45 MINUTES', 'LATER']):
        f = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Black.otf', int(112 * (0.85 + 0.15 * k)))
        wl = d.textlength(line, font=f); d.text(((1080 - wl) / 2, 150 + j * 130), line, font=f, fill='white', stroke_width=10, stroke_fill='black')

os.makedirs('/tmp/demo_out', exist_ok=True)
n = int(DUR * FPS)
for f in range(n):
    t = f / FPS
    src = os.path.join(FR, f'f_{f:05d}.jpg')
    im = Image.open(src).convert('RGB')
    for a, b, g, hl in cues:
        if a <= t < b: draw_sub(im, g, hl); break
    if 9.3 <= t < 11.6: draw_card(im, t)
    im.save(f'/tmp/demo_out/o_{f:05d}.jpg', quality=93)

# --- âm thanh ---
music = os.path.join(ALV, 'music/calm/boredom.mp3')
sfx = {'click': os.path.join(ALV, 'sfx/ui/click-002.wav'), 'tick': os.path.join(ALV, 'sfx/mechanical/clock-tick-tock.wav'), 'snore': os.path.join(ALV, 'sfx/body/snore.wav')}
ins, flt = ['-i', music], ['[1:a]atrim=0:20,volume=0.22,afade=t=out:st=19.2:d=0.8[m]']
mix = ['[m]']; k = 2  # 0 = khung hình, 1 = nhạc
for i, st in enumerate(STARTS):
    ins += ['-i', os.path.join(LINES, f'l{i}.wav')]; flt.append(f'[{k}:a]aresample=48000,volume=1.6,adelay={int(st*1000)}|{int(st*1000)}[v{i}]'); mix.append(f'[v{i}]'); k += 1
for name, st, vol, ln in [('click', 3.1, 0.7, 0.4), ('click', 5.95, 0.7, 0.4), ('click', 12.9, 0.7, 0.4), ('tick', 9.35, 0.5, 2.2), ('snore', 15.9, 0.35, 1.6)]:
    ins += ['-i', sfx[name]]; flt.append(f'[{k}:a]atrim=0:{ln},aresample=48000,volume={vol},adelay={int(st*1000)}|{int(st*1000)}[s{k}]'); mix.append(f'[s{k}]'); k += 1
flt.append(''.join(mix) + f'amix=inputs={len(mix)}:normalize=0,atrim=0:20,loudnorm=I=-14:TP=-1.5:LRA=11[a]')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', '/tmp/demo_out/o_%05d.jpg', *ins, '-filter_complex', ';'.join(flt),
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', '20', '-movflags', '+faststart', OUT], check=True)
print('ok', OUT)
