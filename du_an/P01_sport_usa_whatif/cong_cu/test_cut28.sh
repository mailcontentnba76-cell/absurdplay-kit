#!/bin/bash
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E28_cowboys_titans
OUT=out_e28t; mkdir -p $OUT giao
rm -rf out_e28t15 out_e28tb; mkdir -p out_e28t15; i=0; for f in $(ls $OUT | sort); do ln -f $OUT/$f out_e28t15/f_$(printf %05d $i).jpg; i=$((i+1)); done
python3 $P/../../cong_cu/hoa_cat.py out_e28t15 out_e28tb ep28ct_shots.js --fps 15 --n 3
cd $P; mkdir -p giao
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e28tb/f_%05d.jpg -framerate 30 -i /tmp/g28/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1,fps=30[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 70.40 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E28_cat_thu.mp4
echo DONE >> /root/work/engine/e28t.log
