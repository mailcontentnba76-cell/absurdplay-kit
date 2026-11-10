#!/bin/sh
# Ghép bản cắt thử E10: hình 540x960@15 → 1080x1920 (đen trắng 22.35–31.85 chỉ lớp hình) + đồ hoạ + phụ đề + giọng bíp
set -e
E=/home/user/absurdplay-kit/du_an/P01_sport_usa_whatif/tap/E11_pelicans_birds
cd /root/work/e11_cut
ffmpeg -v error -y -framerate 15 -pattern_type glob -i 'v/f_*.jpg' -framerate 15 -pattern_type glob -i 'g/*.png' -i $E/am_thanh/giong_bip.wav \
 -filter_complex "[0:v]scale=1080:1920:flags=lanczos,eq=saturation=1.05[b];[1:v]format=rgba[g];[b][g]overlay=0:0,subtitles=$E/chu/phu_de.ass,scale=540:960:flags=lanczos,fps=15[v]" \
 -map "[v]" -map 2:a -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest E11_cat_thu_540.mp4
