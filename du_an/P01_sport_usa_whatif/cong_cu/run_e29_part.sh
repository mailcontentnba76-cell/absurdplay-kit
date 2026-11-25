#!/bin/bash
# E25 bản cuối — render 720x1280 motion blur, khoảng khung [$1,$2), bỏ qua khung đã có (chạy lại được)
cd /root/work/engine; OUT=out_f29final; mkdir -p $OUT
L=$(python3 -c "import os;print(','.join(str(i) for i in range($1,$2) if not os.path.exists('$OUT/f_%05d.jpg'%i)))")
[ -z "$L" ] && exit 0
node render.js "ep29pr.html" $OUT 30 0 1 720 1280 $L >> f29_$1.log 2>&1
