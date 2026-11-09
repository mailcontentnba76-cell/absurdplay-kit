#!/bin/bash
# render khung giữa mỗi shot (nomb) rồi ghép sheet: sheet.sh <out.jpg> [W H] [k=0.5]
cd /root/work/engine
OUT=$1; W=${2:-270}; H=${3:-480}; KK=${4:-0.5}
FR=$(node -e "import('./ep08_shots.js').then(m=>{const f=Object.values(m.SH).map(([a,b])=>Math.round((a+(b-a)*$KK)*30));console.log(f.join(','))})")
rm -rf /tmp/e08s; timeout 1500 node render.js "ep08.html#nomb" /tmp/e08s 30 0 1 $W $H $FR 2>&1 | grep -E "PAGEERROR|frames|Error" | head -5
python3 - "$OUT" <<'PY'
import sys,glob
from PIL import Image,ImageDraw
fs=sorted(glob.glob('/tmp/e08s/*.jpg'));ims=[Image.open(f) for f in fs]
if not ims: sys.exit()
w,h=ims[0].size;n=10;rows=(len(ims)+n-1)//n;o=Image.new('RGB',(w*n,h*rows))
for i,im in enumerate(ims):
  o.paste(im,((i%n)*w,(i//n)*h));d=ImageDraw.Draw(o);d.text(((i%n)*w+4,(i//n)*h+4),f"s{i+1}",fill=(255,0,0))
o.save(sys.argv[1],quality=85)
PY
