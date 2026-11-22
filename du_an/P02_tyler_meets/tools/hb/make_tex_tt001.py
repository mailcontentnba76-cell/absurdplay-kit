"""Prints + set textures for TT001 (Elijah, "The Aura Farmer"). Original art only, no logos.
python tools/hb/make_tex_tt001.py"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
import os, math
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEX, PR = os.path.join(ROOT, "assets/hb/tex"), os.path.join(ROOT, "assets/hb/prints")
B = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
K = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/impact.ttf"), s)

def centered(d, y, txt, f, fill, W):
    w = d.textlength(txt, font=f); d.text(((W - w) / 2, y), txt, font=f, fill=fill)

def sign(name, size, bg, lines, fg="#111111", border=None, font=B):
    im = Image.new("RGB", size, bg); d = ImageDraw.Draw(im); W, H = size
    if border: d.rectangle((8, 8, W - 9, H - 9), outline=border, width=10)
    tot = sum(s for _, s in lines) * 1.15; y = (H - tot) / 2
    for t, s in lines: centered(d, y, t, font(s), fg, W); y += s * 1.15
    im.save(os.path.join(TEX, name))

# Elijah's tee print: "BUFFERING…" under a loading ring (he is literally not loading the world in)
im = Image.new("RGBA", (512, 512), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
for k in range(12):
    a = math.radians(k * 30); r0, r1 = 62, 92; cx, cy = 256, 170
    col = (30, 30, 34, 60 + int(195 * k / 11))
    d.line((cx + r0 * math.cos(a), cy + r0 * math.sin(a), cx + r1 * math.cos(a), cy + r1 * math.sin(a)), fill=col, width=18)
centered(d, 300, "BUFFERING...", K(88), (30, 30, 34, 255), 512)
im.save(os.path.join(PR, "eli_buffering.png"))

# outdoor court scoreboard / sign
im = Image.new("RGB", (1000, 460), "#14284b"); d = ImageDraw.Draw(im)
centered(d, 18, "WESTBROOK COURTS", B(82), "#ffd23f", 1000)
for x, lab in ((90, "HOME"), (610, "GUEST")):
    d.text((x + 40, 128), lab, font=B(54), fill="#ffffff")
    d.rectangle((x, 200, x + 300, 420), fill="#05080f"); d.text((x + 52, 214), "00", font=K(170), fill="#ff3b30")
d.ellipse((470, 260, 530, 320), fill="#ffd23f")
im.save(os.path.join(TEX, "tt_court_sign.png"))
sign("tt_court_rules.png", (420, 560), "#ffffff", [("COURT", 70), ("RULES", 70), ("no dunking", 40), ("on the", 40), ("vice principal", 40)], fg="#14284b", border="#14284b")

# band room
sign("tt_band_banner.png", (1400, 220), "#7a1f2b", [("PRACTICE MAKES PERMANENT", 78)], fg="#ffd23f")
sign("tt_band_door.png", (500, 220), "#ffffff", [("BAND ROOM", 80), ("Mr. Hayes", 50)], fg="#7a1f2b", border="#7a1f2b")
def sheet(name, title):
    im = Image.new("RGB", (600, 800), "#fbf8ef"); d = ImageDraw.Draw(im)
    centered(d, 26, title, B(52), "#111111", 600); d.text((40, 96), "Westbrook Concert Band", font=B(26), fill="#444444")
    for r in range(6):
        y0 = 160 + r * 104
        for k in range(5): d.line((40, y0 + k * 12, 560, y0 + k * 12), fill="#333333", width=2)
        d.text((40, y0 - 18), "𝄞" if False else "&", font=B(66), fill="#111111")
        for j in range(7):
            x = 120 + j * 62; y = y0 + (j * 37 + r * 11) % 48
            d.ellipse((x, y, x + 22, y + 16), fill="#111111"); d.line((x + 21, y + 8, x + 21, y - 34), fill="#111111", width=3)
    im.save(os.path.join(TEX, name))
sheet("tt_sheet_triangle.png", "TRIANGLE - PART 1")
sheet("tt_sheet_tuba.png", "TUBA - PART 1")
Image.open(os.path.join(TEX, "tt_sheet_triangle.png")).rotate(180).save(os.path.join(TEX, "tt_sheet_triangle_ud.png"))   # Elijah's, upside down
im = Image.new("RGB", (1200, 500), "#26392e"); d = ImageDraw.Draw(im)   # chalk staff board
for r in range(2):
    for k in range(5): d.line((60, 90 + r * 210 + k * 22, 1140, 90 + r * 210 + k * 22), fill="#e8e8e0", width=3)
for j in range(16):
    x = 140 + j * 62; y = 80 + (j * 29) % 90; d.ellipse((x, y, x + 30, y + 22), outline="#e8e8e0", width=4)
d.text((70, 440), "Concert: Friday 7pm  -  NO talking during rests", font=B(34), fill="#e8e8e0")
im.save(os.path.join(TEX, "tt_staff_board.png"))

# art room
im = Image.new("RGB", (600, 600), "#ffffff"); d = ImageDraw.Draw(im)
cols = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#1abc9c", "#3498db", "#9b59b6", "#e84393"]
for k, c in enumerate(cols): d.pieslice((60, 60, 540, 540), k * 45, k * 45 + 45, fill=c)
d.ellipse((220, 220, 380, 380), fill="#ffffff"); centered(d, 278, "COLOR", B(40), "#111111", 600)
im.save(os.path.join(TEX, "tt_colorwheel.png"))
sign("tt_art_sign.png", (1100, 220), "#f4f1ea", [("ART ROOM 114", 90), ("make mistakes. make art.", 44)], fg="#2c3e50")
def canvas(name, draw):
    im = Image.new("RGB", (560, 720), "#f7f4ec"); d = ImageDraw.Draw(im); draw(d); im.save(os.path.join(TEX, name))
def coat_rack(d):   # Elijah's "portrait of Tyler": one confident line... of the coat rack (hat + scarf on the hooks)
    K = "#1b1b1b"
    d.line([(280, 150), (280, 640)], fill=K, width=12)                                   # pole
    for x in (170, 390): d.line([(280, 600), (x, 680)], fill=K, width=12)                # tripod feet
    d.line([(280, 600), (280, 690)], fill=K, width=12)
    d.ellipse((262, 128, 298, 164), fill=K)                                              # top knob
    for sx in (-1, 1):
        for y, l in ((190, 70), (250, 55)):                                              # curved hooks
            d.arc((280 + (0 if sx > 0 else -l), y - 10, 280 + (l if sx > 0 else 0), y + 50), 180 if sx > 0 else 270, 270 if sx > 0 else 360, fill=K, width=9)
            d.ellipse((280 + sx * l - 9, y + 12, 280 + sx * l + 9, y + 30), fill=K)
    d.polygon([(300, 196), (420, 196), (400, 176), (322, 176)], outline=K, width=8)      # hat on the right hook
    d.line([(318, 176), (330, 120), (392, 120), (404, 176)], fill=K, width=8)
    d.line([(212, 258), (196, 420), (226, 410), (236, 268)], fill=K, width=8)            # scarf on the left hook
    for y in (300, 340, 380): d.line([(205, y), (230, y - 6)], fill=K, width=5)
    d.text((400, 640), "- E.", font=B(34), fill=K)
canvas("tt_canvas_rack.png", coat_rack)
def portrait(col, hair):
    def f(d):
        d.rectangle((0, 0, 560, 720), fill=col); d.ellipse((150, 150, 410, 430), fill="#f0c9a4", outline="#333333", width=6)
        d.pieslice((140, 120, 420, 330), 180, 360, fill=hair)
        for x in (230, 320): d.ellipse((x, 260, x + 22, 282), fill="#222222")
        d.arc((235, 310, 325, 370), 20, 160, fill="#222222", width=6); d.rectangle((200, 430, 360, 720), fill="#7f8c8d")
    return f
canvas("tt_canvas_p1.png", portrait("#bfe0f2", "#3a2a1e"))
canvas("tt_canvas_p2.png", portrait("#f6d9e6", "#c9a24a"))
canvas("tt_canvas_p3.png", portrait("#e8f5d0", "#141414"))

# bus stop
sign("tt_busstop.png", (420, 560), "#1f4e8c", [("BUS", 120), ("12", 150), ("school", 46), ("route", 46)], fg="#ffffff", border="#ffffff")
sign("tt_bus_dest.png", (900, 160), "#111111", [("12  WESTBROOK HIGH", 92)], fg="#ffb000")

# Kayla's phone screen (recording UI) for INS_KAY_PHONE
im = Image.new("RGB", (360, 720), "#6fa6d8"); d = ImageDraw.Draw(im)
d.rectangle((0, 470, 360, 720), fill="#3f6f5a")
d.rectangle((150, 300, 210, 470), fill="#1b1b1d"); d.ellipse((140, 210, 220, 300), fill="#c98c63")   # tiny Elijah silhouette by the pole
d.rectangle((228, 120, 240, 520), fill="#d0d4d8")
d.ellipse((20, 24, 46, 50), fill="#e01e37"); d.text((54, 22), "REC 00:14", font=B(30), fill="#ffffff")
d.rounded_rectangle((120, 630, 240, 690), 30, outline="#ffffff", width=6); d.ellipse((160, 640, 200, 680), fill="#e01e37")
im.save(os.path.join(TEX, "tt_kay_rec.png"))
print("ok")
