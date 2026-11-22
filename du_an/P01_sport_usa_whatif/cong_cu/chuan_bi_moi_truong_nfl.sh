#!/usr/bin/env bash
# Dựng lại môi trường làm việc P01 (chat NFL/NCAA) trong một máy đám mây mới — chạy lại nhiều lần vẫn an toàn.
# Cách dùng: bash du_an/P01_sport_usa_whatif/cong_cu/chuan_bi_moi_truong_nfl.sh [đường_dẫn_repo] [thư_mục_KIT_zip_đã_giải_nén]
# Kết quả: /root/work/{BO_HUONG_DAN_SAN_XUAT_VIDEO,engine} trỏ vào repo (sửa là vào git luôn), /root/work/assets/audio đủ 4.425 file theo chỉ mục.
set -u
REPO=${1:-$(cd "$(dirname "$0")/../../.." && pwd)}
KIT=${2:-/root/work/kit}
P=$REPO/du_an/P01_sport_usa_whatif
W=/root/work; A=$W/assets/audio
mkdir -p "$A"
ln -sfn "$REPO" $W/BO_HUONG_DAN_SAN_XUAT_VIDEO
ln -sfn "$P/engine" $W/engine
echo "== 1. Công cụ hệ thống + Python (nền)"
( command -v melt >/dev/null || { apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq melt fonts-montserrat; } ) >$W/apt.log 2>&1 &
( python3 -c "import cv2,librosa,faster_whisper" 2>/dev/null || pip install -q opencv-python-headless librosa faster-whisper numpy Pillow yt-dlp ) >$W/pip.log 2>&1 &
echo "== 2. Engine three.js r170 + bản vá motion blur"
( cd $W/engine && { [ -d node_modules/three ] || npm install --no-audit --no-fund >/dev/null; } \
  && { [ -f node_modules/.va_patched ] || { python3 patches/va_realism_effects_three170.py && touch node_modules/.va_patched; }; } && echo "engine ok" )
echo "== 3. Âm thanh: SFX Magnific + tiếng thú các tập + 4 kho CC0"
cp -r --update=none "$P/tai_nguyen/am_thanh/magnific_sfx" "$A/"
for t in "$P"/tap/*/am_thanh/thu; do [ -d "$t" ] && e=$(basename "$(dirname "$(dirname "$t")")") && mkdir -p "$A/thu_$e" && cp --update=none "$t"/* "$A/thu_$e/"; done
cd "$A"
for u in wyzowl/sfx-kit seyedpouramir/alvana-audio EternityForest/Free-SFX facebookincubator/Meta-open-sound; do
  d=${u#*/}; [ -d "$d/.git" ] || git clone -q --depth 1 "https://github.com/$u.git" "$d" &
done
wait
echo "== 4. Mô hình Whisper small.en"
python3 -c "from faster_whisper import WhisperModel; WhisperModel('small.en', device='cpu', compute_type='int8')" 2>/dev/null && echo "whisper ok"
echo "== 5. Tệp nặng từ gói KIT (FBX Mixamo — không có trên GitHub)"
if [ -d "$KIT/tep_nang/engine" ]; then cp -r --update=none "$KIT/tep_nang/engine/." $W/engine/; fi
echo "== 6. Kiểm tra"
python3 - "$P" <<'EOF'
import json,os,sys
idx=json.load(open(sys.argv[1]+'/tai_nguyen/am_thanh/thu_vien_am_thanh.json'))
miss=[e['file'] for e in idx if not os.path.exists('/root/work/assets/audio/'+e['file'])]
print(f"âm thanh: {len(idx)-len(miss)}/{len(idx)} file có mặt")
EOF
need="Sprint Running Jogging Run_To_Stop Slow_Jog_Backwards Quarterback_Pass Receiver_Catch Football_Catch Football_Hike Field_Goal"
miss=""; for n in $need; do [ -f $W/engine/assets/mixamo/$n.fbx ] || miss="$miss $n"; done
[ -z "$miss" ] && echo "mixamo: đủ 10 FBX" || echo "mixamo THIẾU:$miss  → đính kèm gói KIT zip (tep_nang/engine/assets/mixamo)"
for c in node ffmpeg melt python3; do printf '%s: ' $c; command -v $c >/dev/null && echo ok || echo THIẾU; done
cd $W/engine && node -e "require('playwright')" 2>/dev/null && echo "playwright: ok" || echo "playwright: THIẾU"
OUT=$(mktemp -d) && node render.js "ep25_bengals_jaguars.html#nomb" $OUT 30 0 1 540 960 "300,600" 2>&1 | grep "sec/frame"
node qa_ground.js "ep25_bengals_jaguars.html#nomb" 0 10 2 2>&1 | grep "sinking"
