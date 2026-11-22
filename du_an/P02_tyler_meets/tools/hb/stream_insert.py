"""Phone livestream insert for TMG01: a fictional streamer playing a fictional crime-city game (no real logos/brands).
python tools/hb/stream_insert.py <game_frame.png> <out.png>"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
G, O = sys.argv[1], sys.argv[2]
W, H = 1080, 1920
B = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
F = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arial.ttf"), s)
bg = Image.open(G).convert("RGB").resize((W, H)).filter(ImageFilter.GaussianBlur(18))
bg = Image.blend(bg, Image.new("RGB", (W, H), (20, 22, 28)), 0.55)
d = ImageDraw.Draw(bg)
# phone body
PX, PY, PW, PH = 150, 170, 780, 1580
d.rounded_rectangle((PX - 18, PY - 18, PX + PW + 18, PY + PH + 18), 70, fill=(18, 18, 20))
scr = Image.new("RGB", (PW, PH), (14, 14, 18)); s = ImageDraw.Draw(scr)
# status bar
s.text((40, 22), "9:41", font=B(34), fill="white"); s.text((PW - 150, 22), "5G  82%", font=B(30), fill="white")
# stream video (landscape game frame, cropped from the render) + game HUD (fictional)
vid_h = 470; game = Image.open(G).convert("RGB")
gw, gh = game.size; crop = game.crop((0, int(gh * 0.18), gw, int(gh * 0.18) + int(gw * vid_h / PW)))
vid = crop.resize((PW, vid_h)); v = ImageDraw.Draw(vid)
v.ellipse((22, vid_h - 150, 152, vid_h - 20), fill=(30, 40, 50), outline="white", width=4)          # minimap
v.polygon([(87, vid_h - 105), (77, vid_h - 75), (97, vid_h - 75)], fill=(255, 210, 63))
for k in range(5):                                                                                    # wanted stars (2 of 5)
    x = PW - 60 - k * 46; col = (255, 255, 255) if k < 2 else (90, 90, 90)
    o_ = 62; v.polygon([(x, 30 + o_), (x + 8, 48 + o_), (x + 27, 48 + o_), (x + 12, 60 + o_), (x + 18, 79 + o_), (x, 67 + o_), (x - 18, 79 + o_), (x - 12, 60 + o_), (x - 27, 48 + o_), (x - 8, 48 + o_)], fill=col, outline=(0, 0, 0))
v.rectangle((22, 22, 222, 38), fill=(40, 40, 40)); v.rectangle((22, 22, 202, 38), fill=(76, 217, 100))   # health
v.text((PW - 170, vid_h - 52), "$ 1,204", font=B(34), fill=(120, 230, 120))
scr.paste(vid, (0, 90))
# LIVE badge + timer + viewers
s.rounded_rectangle((24, 110, 120, 154), 10, fill=(230, 30, 60)); s.text((38, 114), "LIVE", font=B(32), fill="white")
s.rounded_rectangle((130, 110, 318, 154), 10, fill=(0, 0, 0)); s.text((142, 114), "31:04:12", font=B(32), fill="white")
s.rounded_rectangle((PW - 200, 110, PW - 24, 154), 10, fill=(0, 0, 0)); s.text((PW - 188, 114), "👁 12.4K".replace("👁 ", "• "), font=B(32), fill="white")
# streamer row
y = 90 + vid_h + 30
s.ellipse((30, y, 120, y + 90), fill=(155, 89, 182)); s.text((52, y + 18), "XL", font=B(40), fill="white")
s.text((140, y + 6), "xXLegendDriverXx", font=B(38), fill="white"); s.text((140, y + 52), "DAY 2 • NO SLEEP", font=F(30), fill=(170, 170, 180))
s.rounded_rectangle((PW - 210, y + 18, PW - 30, y + 72), 26, fill=(145, 70, 255)); s.text((PW - 182, y + 26), "Follow", font=B(32), fill="white")
# chat
y += 130; s.line((0, y, PW, y), fill=(40, 40, 48), width=2); y += 20
chat = [("brody_irl", "BRO THIS IS SO REAL", (184, 255, 59)), ("noodle_kid", "how long has he been live", (120, 180, 255)),
        ("brody_irl", "im literally in vice city rn", (184, 255, 59)), ("mod_bot", "please touch grass :)", (255, 160, 80)),
        ("sk8erjen", "who is brody", (255, 120, 170)), ("brody_irl", "SKRRRT", (184, 255, 59)), ("tacoTues", "gg", (150, 230, 200)),
        ("brody_irl", "2 STARS LETS GO", (184, 255, 59)), ("noodle_kid", "bro go to class", (120, 180, 255))]
for name, msg, col in chat:
    s.text((34, y), name + ":", font=B(32), fill=col); w = s.textlength(name + ": ", font=B(32)); s.text((34 + w, y), msg, font=F(32), fill="white"); y += 56
s.rounded_rectangle((24, PH - 100, PW - 24, PH - 30), 34, fill=(32, 32, 40)); s.text((56, PH - 84), "Send a message...", font=F(32), fill=(140, 140, 150))
mask = Image.new("L", (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, PW, PH), 56, fill=255)
bg.paste(scr, (PX, PY), mask)
bg.save(O); print("stream insert ->", O)
