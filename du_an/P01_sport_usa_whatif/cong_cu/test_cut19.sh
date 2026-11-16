#!/bin/bash
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E19_cowboys_rental
OUT=out_e19t; mkdir -p $OUT
NF=$(python3 -c "print(int(63.00*15))")
part(){ for try in 1 2 3; do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range($1,$2) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break; node render.js "ep19.html#nomb" $OUT 30 0 1 540 960 $L >> e19t.log 2>&1; done; }
part 0 470 & part 470 $NF &
wait
rm -rf out_e19t15 out_e19tb; mkdir -p out_e19t15; i=0; for f in $(ls $OUT | sort); do ln -f $OUT/$f out_e19t15/f_$(printf %05d $i).jpg; i=$((i+1)); done
python3 $P/../../cong_cu/hoa_cat.py out_e19t15 out_e19tb ep19_shots.js --fps 15 --n 3
cd $P
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e19tb/f_%05d.jpg -framerate 30 -i /tmp/g19/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1,fps=30[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 63.00 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E19_cat_thu.mp4
echo DONE >> /root/work/engine/e19t.log
