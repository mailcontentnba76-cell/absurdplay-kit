"""Prints + set textures for TMG01 (Brody, GTA 6 special). Original art only, no game logos.
python tools/hb/make_tex_tmg01.py"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEX, PR = os.path.join(ROOT, "assets/hb/tex"), os.path.join(ROOT, "assets/hb/prints")
B = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
K = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/impact.ttf"), s)

def centered(d, y, txt, f, fill, W):
    w = d.textlength(txt, font=f); d.text(((W - w) / 2, y), txt, font=f, fill=fill)

# Brody's hoodie print: "1 MORE MISSION" + a simple controller glyph
im = Image.new("RGBA", (512, 512), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
d.rounded_rectangle((136, 70, 376, 190), 50, fill=(20, 20, 24, 255))
for cx in (196, 316): d.ellipse((cx - 22, 108, cx + 22, 152), fill=(184, 255, 59, 255))
d.rectangle((246, 118, 266, 142), fill=(255, 255, 255, 255)); d.rectangle((244, 120, 268, 140), fill=(255, 255, 255, 255))
centered(d, 220, "1 MORE", K(92), (20, 20, 24, 255), 512); centered(d, 330, "MISSION", K(92), (20, 20, 24, 255), 512)
im.save(os.path.join(PR, "bro_mission.png"))

def sign(name, size, bg, lines, fg="#111111", border=None):
    im = Image.new("RGB", size, bg); d = ImageDraw.Draw(im); W, H = size
    if border: d.rectangle((8, 8, W - 9, H - 9), outline=border, width=10)
    tot = sum(s for _, s in lines) * 1.15; y = (H - tot) / 2
    for t, s in lines: centered(d, y, t, B(s), fg, W); y += s * 1.15
    im.save(os.path.join(TEX, name))

sign("tmg_schoolzone.png", (400, 520), "#f7d417", [("SCHOOL", 84), ("ZONE", 84), ("SPEED", 54), ("LIMIT 20", 54)], border="#111111")
sign("tmg_stop.png", (512, 512), "#c8231e", [("STOP", 150)], fg="#ffffff", border="#ffffff")
sign("tmg_aud_banner.png", (1200, 240), "#14284b", [("WESTBROOK HIGH", 90), ("MONDAY ASSEMBLY", 60)], fg="#ffd23f")
sign("tmg_nurse_door.png", (500, 220), "#ffffff", [("NURSE", 90), ("PLEASE KNOCK", 44)], fg="#c0392b", border="#c0392b")
sign("tmg_patio.png", (1000, 220), "#2e7d4f", [("LUNCH PATIO", 96), ("NO BIRDS FEEDING PLEASE", 40)], fg="#ffffff")
sign("tmg_hydrate.png", (420, 600), "#5dade2", [("STAY", 90), ("HYDRATED", 70), ("drink water", 46), ("not energy", 46), ("drinks", 46)], fg="#ffffff")
sign("tmg_detention.png", (700, 420), "#fff4c2", [("DETENTION", 110), ("Name: BRODY", 56), ("Reason: \"two stars\"", 46)], fg="#8b1a1a", border="#8b1a1a")

# eye chart
im = Image.new("RGB", (400, 600), "#ffffff"); d = ImageDraw.Draw(im); y = 30
for t, s in (("E", 150), ("F P", 90), ("T O Z", 64), ("L P E D", 44), ("P E C F D", 32), ("E D F C Z P", 24)):
    centered(d, y, t, B(s), "#111111", 400); y += s * 1.25
im.save(os.path.join(TEX, "tmg_eyechart.png")); print("ok")
