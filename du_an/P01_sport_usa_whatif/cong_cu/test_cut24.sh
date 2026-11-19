#!/bin/bash
export NODE_PATH=$(npm root -g)
E=/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine; cd $E
OUT=/home/claude/e24/out_t; mkdir -p $OUT
NF=1416
part(){ for try in $(seq 1 30); do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range($1,$2) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break; node render.js "ep24.html#nomb" $OUT 30 0 1 540 960 $L >> /home/claude/e24/cut_$1.log 2>&1; done; }
part 0 708 & part 708 $NF &
[ -d /home/claude/e24/g ] && [ $(ls /home/claude/e24/g | wc -l) -ge 2832 ] || node dohoa_render.js ep24_gfx.html /home/claude/e24/g 30 0 2832 >> /home/claude/e24/g.log 2>&1
wait
echo RENDERED >> /home/claude/e24/cut.log
