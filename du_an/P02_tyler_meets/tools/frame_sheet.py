"""Grab frames across a finished episode into one sheet for the final visual QA.
python tools/frame_sheet.py <video.mp4> <out.png> [--n 24]"""
import subprocess, sys, os, json, tempfile
from PIL import Image
v, out = sys.argv[1], sys.argv[2]; n = int(sys.argv[sys.argv.index("--n") + 1]) if "--n" in sys.argv else 24
dur = float(json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", v], capture_output=True, text=True).stdout)["format"]["duration"])
tmp = tempfile.mkdtemp(); ims = []
for i in range(n):
    t = (i + 0.5) * dur / n; p = os.path.join(tmp, f"{i}.png")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", v, "-frames:v", "1", "-vf", "scale=200:-1", p], check=True); ims.append(Image.open(p))
h = ims[0].height; cols = 8; W = Image.new("RGB", (200 * cols, h * ((n + cols - 1) // cols)), "white")
for i, im in enumerate(ims): W.paste(im, ((i % cols) * 200, (i // cols) * h))
W.save(out); print(out, f"{n} frames over {dur:.1f}s")
