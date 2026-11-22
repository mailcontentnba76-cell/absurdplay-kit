#!/bin/bash
# E27 ráp bản cuối: hoà cắt -> 1080x1920 -> đồ hoạ + phụ đề -> loudnorm 2 lượt -> -14 LUFS
cd /root/work/engine; OUT=out_f27final; NF=2232
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E27_buckeyes_cornhuskers
mkdir -p $P/hinh; cd $P
FC="[1]format=rgba[g];[0][g]overlay=0:0,ass=chu/phu_de.ass[vo];[2][3][4]amix=inputs=3:normalize=0"
J=$(ffmpeg -hide_banner -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav -filter_complex "[0][1][2]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i hinh/hinh.mp4 -framerate 30 -i /root/work/engine/out_f27g/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "$FC,loudnorm=I=-14:TP=-1.5:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[ao]" \
 -map "[vo]" -map "[ao]" -t 74.40 -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart giao/E27_buckeyes_cornhuskers.mp4
ffmpeg -hide_banner -i giao/E27_buckeyes_cornhuskers.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
