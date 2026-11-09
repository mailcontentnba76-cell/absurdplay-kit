#!/bin/bash
# E12 bản cuối: render 720x1280 motion blur (2 tiến trình, tự chạy lại khung thiếu) -> đồ hoạ 30 fps -> phóng 1080x1920 -> ráp -> loudnorm 2 lượt
cd /root/work/engine
P=/root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/tap/E12_jets_paper_planes
OUT=out_f12final; mkdir -p $OUT; NF=2359
part(){ for try in 1 2 3 4 5 6; do
  L=$(python3 -c "import os;print(','.join(str(i) for i in range($1,$2) if not os.path.exists('$OUT/f_%05d.jpg'%i)))")
  [ -z "$L" ] && break; node render.js "ep12.html" $OUT 30 0 1 720 1280 $L >> f12_$1.log 2>&1; done; }
part 0 1180 & part 1180 $NF &
[ -d out_f12g ] && [ $(ls out_f12g | wc -l) -ge $NF ] || node dohoa_render.js ep12_gfx.html out_f12g 30 0 $NF >> f12g.log 2>&1
wait
N=$(ls $OUT | wc -l); echo "frames $N" >> f12.log
rm -rf out_f12blend; python3 /root/work/BO_HUONG_DAN_SAN_XUAT_VIDEO/du_an/P01_sport_usa_whatif/cong_cu/hoa_cat.py $OUT out_f12blend ep12_shots.js --bo s4b,s9,s18,s26
mkdir -p $P/hinh; cd $P
ffmpeg -v error -y -framerate 30 -start_number 0 -i /root/work/engine/out_f12blend/f_%05d.jpg -vf "scale=1080:1920:flags=lanczos,eq=saturation=1.1" -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p hinh/hinh.mp4
FC="[1]format=rgba[g];[0][g]overlay=0:0,ass=chu/phu_de.ass[vo];[2][3][4]amix=inputs=3:normalize=0"
J=$(ffmpeg -hide_banner -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav -filter_complex "[0][1][2]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i hinh/hinh.mp4 -framerate 30 -i /root/work/engine/out_f12g/g_%05d.png -i am_thanh/nhac.wav -i am_thanh/sfx.wav -i am_thanh/giong.wav \
 -filter_complex "$FC,loudnorm=I=-14:TP=-1.5:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000[ao]" \
 -map "[vo]" -map "[ao]" -t 78.64 -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart giao/E12_jets_paper_planes.mp4
ffmpeg -hide_banner -i giao/E12_jets_paper_planes.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2 >> /root/work/engine/f12.log
echo DONE >> /root/work/engine/f12.log
