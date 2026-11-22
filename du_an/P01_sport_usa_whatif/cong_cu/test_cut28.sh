#!/bin/bash
# E28 bản cắt thử: render 540x960, mỗi 2 khung (15 fps), bỏ qua khung đã có → chạy lại được
cd /root/work/engine; OUT=out_e28t; mkdir -p $OUT
NF=$(python3 -c "print(int(90.42*15))")
for try in 1 2 3; do
  L=$(python3 -c "import os;print(','.join(str(i*2) for i in range(0,$NF) if not os.path.exists('$OUT/f_%05d.jpg'%(i*2))))")
  [ -z "$L" ] && break
  node render.js "ep28_packers_steelers.html#nomb" $OUT 30 0 1 540 960 $L >> e28t.log 2>&1
done
echo RENDER_DONE $(ls $OUT | wc -l) >> e28t.log
