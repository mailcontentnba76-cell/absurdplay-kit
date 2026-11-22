import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")); from kitfonts import kf  # font Windows/Linux
from PIL import Image, ImageDraw, ImageFont
F = lambda s: ImageFont.truetype(kf("C:/Windows/Fonts/arialbd.ttf"), s)
def sign(name, bg, fg, lines, size=(600, 300)):
    im = Image.new('RGB', size, bg); d = ImageDraw.Draw(im); y = size[1] / (len(lines) + 1)
    for i, (t, s) in enumerate(lines): d.text((size[0] / 2, y * (i + 1)), t, font=F(s), fill=fg, anchor="mm")
    im.save(f'assets/hb/tex/{name}.png')
sign('bus_noeat', (255, 255, 255), (200, 30, 30), [("NO EATING", 70), ("OR DRINKING", 60)])
sign('bus_exit', (200, 30, 30), (255, 255, 255), [("EMERGENCY", 70), ("EXIT", 90)])
sign('bus_rules', (255, 240, 200), (30, 30, 30), [("BUS RULES", 56), ("1. Stay seated", 36), ("2. Inside voices", 36), ("3. Be kind", 36)], (500, 500))
sign('lib_read', (60, 130, 200), (255, 255, 255), [("READ.", 110), ("DREAM.", 80), ("REPEAT.", 80)], (400, 560))
sign('lib_new', (240, 170, 40), (30, 30, 30), [("NEW", 90), ("ARRIVALS", 60)], (500, 300))
sign('lib_banner', (120, 60, 140), (255, 230, 120), [("BOOK FAIR FRIDAY!", 70)], (1200, 220))
print('signs ok')
