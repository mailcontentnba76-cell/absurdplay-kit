#!/bin/bash
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E23_mascot_titans_cowboys
OUT=out_e23t; mkdir -p $OUT giao
NF=$(python3 -c "print(int(86.40*15))")
for try in $(seq 1 40); do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range(0,$NF) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break; node render.js "ep23.html#nomb" $OUT 30 0 1 540 960 $L >> e23t.log 2>&1; done
rm -rf out_e23t15 out_e23tb; mkdir -p out_e23t15; i=0; for f in $(ls $OUT | sort); do ln -f $OUT/$f out_e23t15/f_$(printf %05d $i).jpg; i=$((i+1)); done
python3 $P/../../cong_cu/hoa_cat.py out_e23t15 out_e23tb ep23_shots.js --fps 15 --n 3
cd $P; mkdir -p giao
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e23tb/f_%05d.jpg -framerate 30 -i /tmp/g23/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1,fps=30[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 86.40 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E23_cat_thu.mp4
echo DONE >> /root/work/engine/e23t.log
