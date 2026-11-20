#!/bin/bash
export NODE_PATH=$(npm root -g)
E=/home/claude/absurdplay-kit/du_an/P01_sport_usa_whatif/engine; cd $E
OUT=/home/claude/e26/out_t; mkdir -p $OUT
NF=1289
part(){ for try in $(seq 1 30); do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range($1,$2) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break; node render.js "ep26.html#nomb" $OUT 30 0 1 540 960 $L >> /home/claude/e26/cut_$1.log 2>&1; done; }
part 0 645 & part 645 $NF &
[ -d /home/claude/e26/g ] && [ $(ls /home/claude/e26/g | wc -l) -ge 2577 ] || node dohoa_render.js ep26_gfx.html /home/claude/e26/g 30 0 2577 >> /home/claude/e26/g.log 2>&1
wait
echo RENDERED >> /home/claude/e26/cut.log
