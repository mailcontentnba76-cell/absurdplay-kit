#!/bin/bash
# E27 ráp bản cuối: hoà cắt -> 1080x1920 -> đồ hoạ + phụ đề -> loudnorm 2 lượt -> -14 LUFS
cd /root/work/engine; OUT=out_f28final; NF=2112
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E28_cowboys_titans
[ -d out_f28g ] && [ $(ls out_f28g | wc -l) -ge $NF ] || node dohoa_render.js ep28ct_gfx.html out_f28g 30 0 $NF >> f28g.log 2>&1
rm -rf out_f28blend; python3 /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/cong_cu/hoa_cat.py $OUT out_f28blend ep28ct_shots.js --n 6
mkdir -p $P/hinh; cd $P
ffmpeg -v error -y -framerate 30 -start_number 0 -i /root/work/engine/out_f28blend/f_%05d.jpg -vf "scale=1080:1920:flags=lanczos,eq=saturation=1.1" -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p hinh/hinh.mp4
FC="[1]format=rgba[g];[0][g]overlay=0:0,ass=chu/phu_de.ass[vo];[2][3][4]amix=inputs=3:normalize=0"
J=$(ffmpeg -hide_banner -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav -filter_complex "[0][1][2]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i hinh/hinh.mp4 -framerate 30 -i /root/work/engine/out_f28g/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "$FC,loudnorm=I=-14:TP=-1.5:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[ao]" \
 -map "[vo]" -map "[ao]" -t 70.40 -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart giao/E28_cowboys_titans.mp4
ffmpeg -hide_banner -i giao/E28_cowboys_titans.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
