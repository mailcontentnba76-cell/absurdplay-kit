#!/bin/bash
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E15_cousins_returns
OUT=out_e15t; mkdir -p $OUT
NF=$(python3 -c "print(int(70.40*15))")
for try in 1 2 3; do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range($NF) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break
  node render.js "ep15.html#nomb" $OUT 30 0 1 540 960 $L >> e15t.log 2>&1
done &
[ -d out_e15g ] || node dohoa_render.js ep15_gfx.html out_e15g 15 0 $NF >> e15g.log 2>&1 &
wait
mkdir -p out_e15t15; i=0; for f in $(ls $OUT | sort); do ln -sf ../$OUT/$f out_e15t15/t_$(printf %05d $i).jpg; i=$((i+1)); done
cd $P
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e15t15/t_%05d.jpg -framerate 15 -i /root/work/engine/out_e15g/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 70.40 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E15_cat_thu.mp4
echo DONE >> /root/work/engine/e15t.log
