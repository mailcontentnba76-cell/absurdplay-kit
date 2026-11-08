#!/bin/bash
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E10_michigan_goalposts
OUT=out_e10t; mkdir -p $OUT
NF=$(python3 -c "print(int(84.48*15))")
for try in 1 2 3; do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range($NF) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break
  node render.js "ep10.html#nomb" $OUT 30 0 1 540 960 $L >> e10t.log 2>&1
done &
node dohoa_render.js ep10_gfx.html out_e10g 15 0 $NF >> e10g.log 2>&1 &
wait
mkdir -p out_e10t15; i=0; for f in $(ls $OUT | sort); do ln -sf ../$OUT/$f out_e10t15/t_$(printf %05d $i).jpg; i=$((i+1)); done
cd $P
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e10t15/t_%05d.jpg -framerate 15 -i /root/work/engine/out_e10g/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 84.48 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E10_cat_thu.mp4
echo DONE >> /root/work/engine/e10t.log
