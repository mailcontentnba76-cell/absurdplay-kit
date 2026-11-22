"""Phone inserts for TT001 (original UI, no real app branding).
python tools/hb/tt001_inserts.py <zoom_still.png> <views_still.png> <out_dir>"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
Z, V, O = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(O, exist_ok=True)
W, H = 1080, 1920
B = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
F = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arial.ttf"), s)
PX, PY, PW, PH = 150, 170, 780, 1580
def phone_bg(src):
    bg = Image.open(src).convert("RGB").resize((W, H)).filter(ImageFilter.GaussianBlur(18))
    bg = Image.blend(bg, Image.new("RGB", (W, H), (20, 22, 28)), 0.55); d = ImageDraw.Draw(bg)
    d.rounded_rectangle((PX - 18, PY - 18, PX + PW + 18, PY + PH + 18), 70, fill=(18, 18, 20)); return bg
def paste_screen(bg, scr):
    mask = Image.new("L", (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, PW, PH), 56, fill=255); bg.paste(scr, (PX, PY), mask)
def cover(src, w, h, zoom=1.0, cy=0.5):
    im = Image.open(src).convert("RGB"); iw, ih = im.size; s = max(w / iw, h / ih) * zoom
    im = im.resize((int(iw * s), int(ih * s))); x = (im.width - w) // 2; y = int((im.height - h) * cy); return im.crop((x, y, x + w, y + h))

# 1) Kayla's camera, zoomed 8x on his eyes
bg = phone_bg(Z); scr = cover(Z, PW, PH, 1.45, 0.5); s = ImageDraw.Draw(scr)
s.text((40, 22), "9:41", font=B(34), fill="white"); s.text((PW - 150, 22), "5G  64%", font=B(30), fill="white")
s.rounded_rectangle((PW // 2 - 110, 90, PW // 2 + 110, 140), 24, fill=(0, 0, 0)); s.ellipse((PW // 2 - 92, 105, PW // 2 - 72, 125), fill=(230, 30, 60))
s.text((PW // 2 - 62, 96), "00:51:07", font=B(32), fill="white")
fx0, fy0, fx1, fy1 = PW * 0.12, PH * 0.38, PW * 0.88, PH * 0.56                         # focus box on the squint
for (x0, y0, dx, dy) in ((fx0, fy0, 1, 1), (fx1, fy0, -1, 1), (fx0, fy1, 1, -1), (fx1, fy1, -1, -1)):
    s.line((x0, y0, x0 + dx * 60, y0), fill=(255, 210, 63), width=6); s.line((x0, y0, x0, y0 + dy * 60), fill=(255, 210, 63), width=6)
s.rounded_rectangle((PW // 2 - 70, PH - 330, PW // 2 + 70, PH - 270), 30, fill=(0, 0, 0, 160)); s.text((PW // 2 - 40, PH - 322), "8.0x", font=B(38), fill=(255, 210, 63))
s.ellipse((PW // 2 - 70, PH - 220, PW // 2 + 70, PH - 80), outline="white", width=8); s.rounded_rectangle((PW // 2 - 32, PH - 182, PW // 2 + 32, PH - 118), 12, fill=(230, 30, 60))
paste_screen(bg, scr); bg.save(os.path.join(O, "phone_zoom.png"))

# 2) Kayla's clip blew up: 2.0M views
bg = phone_bg(V); scr = cover(V, PW, PH, 1.0, 0.4); s = ImageDraw.Draw(scr)
shade = Image.new("RGBA", (PW, PH), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade); sd.rectangle((0, PH - 520, PW, PH), fill=(0, 0, 0, 150)); scr.paste(shade, (0, 0), shade)
s.text((40, 22), "6:12", font=B(34), fill="white"); s.text((PW - 150, 22), "5G  31%", font=B(30), fill="white")
for k, (lab, y) in enumerate((("412K", 640), ("18.9K", 820), ("96K", 1000))):          # side rail: like / comment / share (plain shapes)
    cx = PW - 80
    if k == 0: s.polygon([(cx, y + 40), (cx - 42, y), (cx - 30, y - 22), (cx, y - 6), (cx + 30, y - 22), (cx + 42, y)], fill=(255, 60, 90))
    elif k == 1: s.rounded_rectangle((cx - 40, y - 26, cx + 40, y + 26), 18, fill="white"); s.polygon([(cx - 20, y + 20), (cx - 30, y + 44), (cx, y + 24)], fill="white")
    else: s.polygon([(cx - 36, y + 26), (cx + 40, y), (cx - 36, y - 26), (cx - 20, y)], fill="white")
    w = s.textlength(lab, font=B(30)); s.text((cx - w / 2, y + 52), lab, font=B(30), fill="white")
s.text((40, PH - 470), "@kayla.receipts", font=B(38), fill="white")
s.text((40, PH - 410), "he's not aura farming. he just can't see", font=F(32), fill="white")
s.rounded_rectangle((36, PH - 330, 470, PH - 240), 26, fill=(255, 210, 63)); s.polygon([(70, PH - 310), (70, PH - 260), (110, PH - 285)], fill=(20, 20, 24))
s.text((130, PH - 322), "2.0M views", font=B(54), fill=(20, 20, 24))
s.text((40, PH - 200), "posted 2h ago", font=F(30), fill=(200, 200, 210))
paste_screen(bg, scr); bg.save(os.path.join(O, "phone_views.png")); print("inserts ->", O)
