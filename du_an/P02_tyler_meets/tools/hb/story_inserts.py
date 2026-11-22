"""Phone 'story' inserts for TM01 (generic story UI, fictional handles, no real app branding).
python tools/hb/story_inserts.py <stills_dir> <out_dir>"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import sys, os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, O = sys.argv[1], sys.argv[2]; os.makedirs(O, exist_ok=True)
W, H = 1080, 1920; PX, PY, PW, PH = 190, 200, 700, 1400
F = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
FR = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arial.ttf"), s)
SY = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/seguisym.ttf"), s)
def EM(s):
    try: return ImageFont.truetype(kf("C:/Windows/Fonts/seguiemj.ttf"), s)
    except Exception: return SY(s)
def load(n): return Image.open(os.path.join(S, n)).convert("RGB")
def cover(im, w, h, cy=0.5):
    s = max(w / im.width, h / im.height); im = im.resize((int(im.width * s), int(im.height * s)))
    x = (im.width - w) // 2; y = int((im.height - h) * cy); return im.crop((x, y, x + w, y + h))
BG = {"bus": load("POV_POV_BUS.png"), "lib": load("POV_POV_LIB.png")}
def broken_heart(d, cx, cy, s, col=(225, 40, 60)):
    k = s / 350
    L = [(256, 420), (70, 230), (70, 150), (120, 95), (190, 95), (246, 150), (226, 210), (262, 260), (230, 320)]
    Rr = [(256, 420), (442, 230), (442, 150), (392, 95), (322, 95), (276, 150), (256, 205), (292, 255), (268, 320)]
    for poly, off in ((L, -10), (Rr, 10)):
        d.polygon([(cx + (x - 256) * k + off, cy + (y - 250) * k) for x, y in poly], fill=col)
def phone(screen, where="bus", account="jaylen.feelz", ago="2m", bars=(1, 1), viewer=None, banner=None):
    bg = cover(BG[where], W, H).filter(ImageFilter.GaussianBlur(16))
    img = bg.copy(); d = ImageDraw.Draw(img)
    d.rounded_rectangle((PX - 22, PY - 22, PX + PW + 22, PY + PH + 22), 70, fill=(18, 18, 20))
    m = Image.new("L", (PW, PH), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, PW, PH), 50, fill=255)
    img.paste(screen, (PX, PY), m); d = ImageDraw.Draw(img)
    d.rounded_rectangle((PX + PW // 2 - 70, PY + 14, PX + PW // 2 + 70, PY + 44), 15, fill=(10, 10, 10))
    if banner:   # lock-screen style notification
        d.rounded_rectangle((PX + 30, PY + 120, PX + PW - 30, PY + 250), 28, fill=(245, 245, 247))
        d.ellipse((PX + 55, PY + 148, PX + 125, PY + 218), fill=(70, 60, 120)); d.text((PX + 90, PY + 183), "J", font=F(40), fill="white", anchor="mm")
        d.text((PX + 145, PY + 150), account, font=F(32), fill=(20, 20, 20)); d.text((PX + 145, PY + 192), banner, font=FR(30), fill=(60, 60, 60))
        return img
    cur, tot = bars; gap = 6; bw = (PW - 40 - gap * (tot - 1)) / tot
    for i in range(tot):
        x0 = PX + 20 + i * (bw + gap); d.rounded_rectangle((x0, PY + 60, x0 + bw, PY + 66), 3, fill=(255, 255, 255) if i < cur else (255, 255, 255, 90))
    d.ellipse((PX + 24, PY + 84, PX + 84, PY + 144), fill=(70, 60, 120)); d.text((PX + 54, PY + 114), "J", font=F(34), fill="white", anchor="mm")
    d.text((PX + 100, PY + 92), account, font=F(30), fill="white", stroke_width=2, stroke_fill=(0, 0, 0)); d.text((PX + 100, PY + 126), ago, font=FR(24), fill=(220, 220, 220))
    if viewer: d.text((PX + PW - 24, PY + 108), viewer, font=FR(24), fill=(230, 230, 230), anchor="rm")
    return img
def black(): return Image.new("RGB", (PW, PH), (8, 8, 10))
def music(d, y=980, label="sad piano (slowed + reverb)"):
    d.rounded_rectangle((60, y, PW - 60, y + 80), 20, fill=(255, 255, 255)); d.text((95, y + 40), "\u266B", font=SY(44), fill=(30, 30, 30), anchor="lm")
    d.text((150, y + 40), label, font=F(28), fill=(30, 30, 30), anchor="lm")
def center(d, text, y, size=50, col="white"):
    lines = text.split("\n")
    for i, l in enumerate(lines): d.text((PW / 2, y + i * (size + 18)), l, font=F(size), fill=col, anchor="mm")
out = {}
# rain mood
sc = Image.new("RGB", (PW, PH)); d = ImageDraw.Draw(sc)
for y in range(PH): v = int(60 + 50 * y / PH); d.line((0, y, PW, y), fill=(v, v + 10, v + 30))
random.seed(2)
for _ in range(160):
    x = random.randint(0, PW); y = random.randint(0, PH); d.line((x, y, x - 6, y + 40), fill=(180, 200, 230), width=2)
center(d, "life hits different\nat 7am", 560, 52); d.text((PW / 2, 720), "\U0001F327", font=EM(80), anchor="mm", embedded_color=True)
out["story_rain.png"] = phone(sc, bars=(1, 3), ago="1h")
out["phone_notif.png"] = phone(black(), banner="posted a new story", ago="now")
sc = black(); d = ImageDraw.Draw(sc); center(d, ". . .", 640, 70, (200, 200, 200)); out["story_black.png"] = phone(sc, bars=(1, 1), ago="now")
sc = black(); d = ImageDraw.Draw(sc); broken_heart(d, PW / 2, 640, 330); music(d); out["story_heart.png"] = phone(sc, bars=(1, 1), ago="now")
sc = black(); d = ImageDraw.Draw(sc); center(d, "Some people take\nyour seat...\nand your trust.", 520, 54); broken_heart(d, PW / 2, 840, 120); music(d)
out["story_caption.png"] = phone(sc, bars=(1, 1), ago="now")
sc = black(); d = ImageDraw.Draw(sc); center(d, "Nobody\nunderstands me.", 600, 60); music(d, label="sad piano pt. 2")
out["story_2.png"] = phone(sc, bars=(2, 2), ago="now")
sc = black(); d = ImageDraw.Draw(sc); center(d, "day ruined.", 560, 60); center(d, "story 14 of 14", 700, 34, (190, 190, 190))
out["story_bars.png"] = phone(sc, where="lib", bars=(14, 14), ago="now")
sc = black(); d = ImageDraw.Draw(sc); center(d, "you know who\nyou are.", 480, 56)
d.rounded_rectangle((130, 700, PW - 130, 790), 24, fill=(255, 255, 255)); d.text((PW / 2, 745), "@tyler.m  the betrayer", font=F(36), fill=(200, 30, 50), anchor="mm")
d.text((PW / 2 + 215, 700), "\U0001F40D", font=EM(64), anchor="mm", embedded_color=True)
out["story_tag.png"] = phone(sc, where="lib", bars=(13, 14), ago="12m", viewer="viewed by kayla.receipts")
sc = cover(load("POV_POV_SANDWICH.png"), PW, PH, 0.35); d = ImageDraw.Draw(sc)
d.rounded_rectangle((70, 300, PW - 70, 400), 20, fill=(0, 0, 0)); d.text((PW / 2, 350), "Can't trust nobody.", font=F(46), fill="white", anchor="mm")
out["story_3.png"] = phone(sc, bars=(1, 1), ago="now")
sc = cover(load("POV_POV_PEACE.png"), PW, PH, 0.3); d = ImageDraw.Draw(sc)
d.rounded_rectangle((150, 300, PW - 150, 400), 20, fill=(255, 255, 255)); d.text((PW / 2 - 30, 350), "at peace", font=F(46), fill=(20, 20, 20), anchor="mm")
d.text((PW / 2 + 130, 350), "\U0001F54A", font=EM(56), anchor="mm", embedded_color=True)
out["story_final.png"] = phone(sc, bars=(1, 1), ago="now")
for k, v in out.items(): v.save(os.path.join(O, k))
print("stories ->", O, len(out))
