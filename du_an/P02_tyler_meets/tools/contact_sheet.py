"""Contact sheets of QA stills (12 per sheet, labelled with the file name).
python tools/contact_sheet.py <stills_dir> <out_prefix>   -> <out_prefix>_0.png, _1.png ..."""
import os, sys
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
fs = sorted(f for f in os.listdir(d) if f.lower().endswith(".png"))
for k in range(0, len(fs), 12):
    W = Image.new("RGB", (240 * 6, 427 * 2), "white"); dr = ImageDraw.Draw(W)
    for i, f in enumerate(fs[k:k + 12]):
        im = Image.open(os.path.join(d, f)).convert("RGB").resize((240, 427)); x, y = (i % 6) * 240, (i // 6) * 427
        W.paste(im, (x, y)); dr.rectangle((x, y, x + 180, y + 14), fill="black"); dr.text((x + 2, y + 1), f[:-4][:30], fill="white")
    W.save(f"{out}_{k // 12}.png"); print(f"{out}_{k // 12}.png")
