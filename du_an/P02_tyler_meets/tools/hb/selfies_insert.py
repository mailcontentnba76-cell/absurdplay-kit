import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, O = sys.argv[1], sys.argv[2]; os.makedirs(O, exist_ok=True)
W, H = 1080, 1920; PX, PY, PW, PH = 190, 200, 700, 1400
F = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
sel = Image.open(os.path.join(S, "POV_POV_SELFIE.png")).convert("RGB"); bgi = sel
def cover(im, w, h):
    s = max(w / im.width, h / im.height); im = im.resize((int(im.width * s), int(im.height * s))); x = (im.width - w) // 2; y = (im.height - h) // 2; return im.crop((x, y, x + w, y + h))
bg = cover(bgi, W, H).filter(ImageFilter.GaussianBlur(16)); img = bg.copy(); d = ImageDraw.Draw(img)
d.rounded_rectangle((PX - 22, PY - 22, PX + PW + 22, PY + PH + 22), 70, fill=(18, 18, 20))
scr = Image.new("RGB", (PW, PH), (12, 12, 14)); ds = ImageDraw.Draw(scr)
ds.text((30, 70), "Recents", font=F(44), fill="white"); ds.text((PW - 30, 78), "40 photos", font=F(30), fill=(170, 170, 170), anchor="ra")
tile = cover(sel, 170, 170); g = 4; y0 = 150
for i in range(40):
    r, c = divmod(i, 4); x = 6 + c * (170 + g); y = y0 + r * (170 + g)
    if y + 170 > PH: break
    t = tile.copy()
    if i % 3 == 1: t = t.transpose(Image.FLIP_LEFT_RIGHT)
    scr.paste(t, (x, y))
m = Image.new("L", (PW, PH), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, PW, PH), 50, fill=255)
img.paste(scr, (PX, PY), m); img.save(os.path.join(O, "phone_selfies.png")); print("selfies ok")
