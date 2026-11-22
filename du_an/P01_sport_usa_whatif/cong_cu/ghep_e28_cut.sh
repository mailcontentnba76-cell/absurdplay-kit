#!/bin/bash
# E28 ráp bản cắt thử 15 fps: hoà cắt -> 1080x1920 -> đồ hoạ + phụ đề -> trộn 3 lớp tiếng -> -14 LUFS, xuất 540x960
cd /root/work/engine; OUT=out_e28t
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E28_mascot_packers_steelers
rm -rf out_e28t15 out_e28tb; mkdir -p out_e28t15; i=0; for f in $(ls $OUT | sort); do ln -f $OUT/$f out_e28t15/f_$(printf %05d $i).jpg; i=$((i+1)); done
python3 $P/../../cong_cu/hoa_cat.py out_e28t15 out_e28tb ep28_packers_steelers_shots.js --fps 15 --n 3
cd $P; mkdir -p giao
ffmpeg -v error -y -framerate 15 -i /root/work/engine/out_e28tb/f_%05d.jpg -framerate 30 -i /tmp/g28/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "[0]scale=1080:1920,eq=saturation=1.1,fps=30[b];[1]format=rgba[g];[b][g]overlay=0:0,ass=chu/phu_de.ass,scale=540:960[vo];[2][3][4]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[ao]" \
 -map "[vo]" -map "[ao]" -t 90.42 -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k giao/E28_cat_thu.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 giao/E28_cat_thu.mp4
