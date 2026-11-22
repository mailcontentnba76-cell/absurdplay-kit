#!/bin/bash
# Ghép logo vào E27 bản sạch (chạy trên máy bạn, cần ffmpeg).
# Cách dùng:  bash chen_logo_E27.sh logo_ohio_state.png logo_nebraska.png
# Logo nên là PNG nền trong suốt, hình vuông (script tự co giãn vào ô, giữ tỉ lệ).
set -e
IN="E27_buckeyes_cornhuskers_sach.mp4"; OUT="E27_buckeyes_cornhuskers_logo.mp4"
O="$1"; N="$2"
[ -f "$O" ] && [ -f "$N" ] && [ -f "$IN" ] || { echo "Cần: $IN, logo Ohio State, logo Nebraska"; exit 1; }

# Ô logo trên khung 1080x1920: đội, bắt đầu, kết thúc, x, y, cạnh (px)
#  #teams  : O 0.6–5.4s (190,452,64)   N 0.6–5.4s (809,452,64)
#  thẻ l1  : O 5.7–9.5s (239,317,45)
#  thẻ l2  : N 15.0–17.8s (276,317,45)
#  thẻ cuối: N 71.0–74.4s (400,200,116) O 71.0–74.4s (590,200,116)
sc(){ echo "scale=$(( $1 - 2 )):$(( $1 - 2 )):force_original_aspect_ratio=decrease,pad=$1:$1:(ow-iw)/2:(oh-ih)/2:color=0x00000000"; }
FC="[1]format=rgba,setsar=1,split=3[o1][o2][o3];[2]format=rgba,setsar=1,split=3[n1][n2][n3];\
[o1]$(sc 64)[oa];[o2]$(sc 45)[ob];[o3]$(sc 116)[oc];\
[n1]$(sc 64)[na];[n2]$(sc 45)[nb];[n3]$(sc 116)[nc];\
[0][oa]overlay=190:452:enable='between(t,0.6,5.4)'[v1];\
[v1][na]overlay=809:452:enable='between(t,0.6,5.4)'[v2];\
[v2][ob]overlay=239:317:enable='between(t,5.7,9.5)'[v3];\
[v3][nb]overlay=276:317:enable='between(t,15.0,17.8)'[v4];\
[v4][nc]overlay=400:200:enable='between(t,71.0,74.4)'[v5];\
[v5][oc]overlay=590:200:enable='between(t,71.0,74.4)'[vo]"
ffmpeg -y -i "$IN" -loop 1 -framerate 30 -i "$O" -loop 1 -framerate 30 -i "$N" -filter_complex "$FC" \
 -map "[vo]" -map 0:a -shortest -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
echo "Xong: $OUT"
