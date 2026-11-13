#!/bin/sh
# E16 — ráp bản giao: hình 3D render THẲNG 1080x1920 (chỉnh màu) + đồ hoạ qtrle + phụ đề ASS + giọng gốc (không bíp) + nhạc + SFX
# → project Kdenlive (tao_kdenlive.py) → melt (profile 1080x1920) → loudnorm 2 lượt −14 LUFS / TP −1,5.
# Dùng: sh giao.sh <độ bão hoà eq> (mặc định 1.0). Khung nguồn: /root/work/e16_full/{f,g}.
set -e
SAT=${1:-1.0}
E=$(cd "$(dirname "$0")" && pwd); CC=$E/../../cong_cu; SRC=/root/work/e16_full
mkdir -p $E/hinh $E/do_hoa $E/giao
ffmpeg -v error -y -framerate 30 -start_number 0 -i $SRC/f/f_%05d.jpg -vf "scale=1080:1920:flags=lanczos,eq=saturation=$SAT,unsharp=5:5:0.4" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p $E/hinh/hinh.mp4
ffmpeg -v error -y -framerate 30 -pattern_type glob -i "$SRC/g/*.png" -c:v qtrle $E/do_hoa/do_hoa.mov
D=86.6
cat > $E/giao/mo_ta.json <<EOF2
{"width":1080,"height":1920,"fps":30,
 "tracks":[
  {"type":"audio","name":"Nhạc","clips":[{"file":"../am_thanh/nhac.wav","start":0,"in":0,"out":$D}]},
  {"type":"audio","name":"SFX","clips":[{"file":"../am_thanh/sfx.wav","start":0,"in":0,"out":$D}]},
  {"type":"audio","name":"Giọng","clips":[{"file":"../am_thanh/giong.wav","start":0,"in":0,"out":$D}]},
  {"type":"video","name":"Hình","clips":[{"file":"../hinh/hinh.mp4","start":0,"in":0,"out":$D}]},
  {"type":"video","name":"Đồ họa","clips":[{"file":"../do_hoa/do_hoa.mov","start":0,"in":0,"out":$D}]}],
 "subtitles":"../chu/phu_de.ass"}
EOF2
cd $E/giao
python3 $CC/tao_kdenlive.py mo_ta.json E16_mavs_cheat_code.kdenlive
melt -profile $CC/v1080.profile E16_mavs_cheat_code.kdenlive -consumer avformat:raw.mp4 width=1080 height=1920 progressive=1 frame_rate_num=30 frame_rate_den=1 vcodec=libx264 crf=15 preset=slow acodec=aac ab=256k -silent 2>&1 | grep -v -i "timestamp\|pts\|LADSPA" || true
J=$(ffmpeg -hide_banner -i raw.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
MI=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
set -- $MI
ffmpeg -v error -y -i raw.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" -ar 48000 -c:v copy -c:a aac -b:a 256k E16_mavs_cheat_code.mp4
rm -f raw.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:format=duration -of compact E16_mavs_cheat_code.mp4
