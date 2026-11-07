#!/usr/bin/env bash
# Kiểm tra môi trường P02: in OK / THIẾU + cách bổ sung cho từng mục. Dùng: bash kiem_tra.sh [--render]
P=$(cd "$(dirname "$0")/.." && pwd); H=${P02_HOME:-$HOME/.p02}; ok=0; bad=0
r(){ if eval "$2" >/dev/null 2>&1; then echo "OK    $1"; ok=$((ok+1)); else echo "THIẾU $1 → $3"; bad=$((bad+1)); fi; }
r "Node.js ≥ 18"            "node -e 'process.exit(+process.versions.node.split(\".\")[0]>=18?0:1)'" "cài Node.js 18+ (nodejs.org)"
r "Python 3.10+"            "python3 -c 'import sys;sys.exit(sys.version_info<(3,10))'" "cài Python 3.10+"
r "ffmpeg + libass (phụ đề)" "ffmpeg -hide_banner -filters | grep -q ' ass '" "cài ffmpeg bản có libass"
r "Python: numpy scipy PIL cv2" "python3 -c 'import numpy,scipy,PIL,cv2'" "chạy cai_dat.sh (mục 2)"
r "Python: sherpa-onnx (chép lời)" "python3 -c 'import sherpa_onnx'" "python3 -m pip install sherpa-onnx soundfile"
r "Engine: three.js r170"   "test -f '$P/engine/node_modules/three/build/three.module.js'" "cd engine && npm install"
r "Playwright"              "cd '$P/engine' && node -e \"require('playwright')\"" "cd engine && npm i --no-save playwright@1.63.0 && npx playwright install chromium"
r "Mô hình Parakeet"        "test -f '$H/parakeet/tokens.txt'" "chạy cai_dat.sh (mục 4) hoặc đặt P02_HOME đúng chỗ"
r "Dữ liệu MakeHuman"       "test -d '$H/makehuman-data/package/public/data/proxies'" "chạy cai_dat.sh (mục 5)"
r "Nhân vật đã nướng (E05)" "test -f '$P/engine/assets/mh/e5_chinh/char.json'" "git pull nhánh du-an-moi (assets nằm trong git)"
r "Texture Magnific"        "test -f '$P/engine/assets/tex/mag/nhua_duong_m_col.jpg'" "git pull nhánh du-an-moi"
r "SFX (≥ 20 mp3)"          "test \$(ls '$P/tai_nguyen/sfx/'*.mp3 2>/dev/null | wc -l) -ge 20" "giải nén AbsurdPlay_P02_am_thanh.zip vào du_an/P02_oddtilt/"
r "Nhạc nền ukulele"        "test -f '$P/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3'" "giải nén AbsurdPlay_P02_am_thanh.zip"
r "Font phụ đề Poppins"     "test -f '$P/engine/fonts/Poppins-800.ttf'" "git pull (engine/fonts)"
r "Git remote absurdplay-kit" "git -C '$P' remote -v | grep -q absurdplay-kit" "git clone https://github.com/mailcontentnba76-cell/absurdplay-kit -b du-an-moi"
r "Mạng tới pikaso.cdnpk.net (tải file Magnific)" "curl -s -o /dev/null -m 10 https://pikaso.cdnpk.net/" "môi trường cloud: thêm host pikaso.cdnpk.net vào danh sách mạng cho phép"
if [ "${1:-}" = --render ]; then
  T=$(mktemp -d); r "Render thử 1 khung (e5_xe_dap, 180p)" "cd '$P/engine' && timeout 600 node render.js 'e5_xe_dap.html?w=180' '$T' 30 300 301 180 320 && test -s '$T/f_00300.jpg'" "xem lỗi: cd engine && node render.js 'e5_xe_dap.html?w=180' /tmp/x 30 300 301 180 320"
fi
echo "—— $ok OK, $bad THIẾU. Ngoài shell (Claude tự kiểm bằng công cụ): kết nối Magnific (MCP) + giọng clone 'Odd Tilt'; quyền GitHub để push."
