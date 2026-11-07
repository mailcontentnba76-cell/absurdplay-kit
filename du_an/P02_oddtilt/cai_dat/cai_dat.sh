#!/usr/bin/env bash
# Cài môi trường dự án P02 "How you invented …" trên máy/tài khoản mới (Linux hoặc macOS). Chạy lại nhiều lần vẫn an toàn.
# Dùng:  bash du_an/P02_oddtilt/cai_dat/cai_dat.sh
# Biến tuỳ chọn: P02_HOME (nơi để mô hình chép lời + dữ liệu MakeHuman, mặc định ~/.p02), BO_QUA_TRINH_DUYET=1 (không tải Chromium).
set -uo pipefail
P=$(cd "$(dirname "$0")/.." && pwd); H=${P02_HOME:-$HOME/.p02}; mkdir -p "$H"; THIEU=()
say(){ printf '\n== %s\n' "$*"; }
need(){ command -v "$1" >/dev/null 2>&1 || THIEU+=("$1: $2"); }
say "1/6 Kiểm tra lệnh hệ thống"
need node "cài Node.js ≥ 18 (https://nodejs.org)"; need npm "đi kèm Node.js"; need python3 "cài Python ≥ 3.10"; need ffmpeg "cài ffmpeg có libass: apt install ffmpeg | brew install ffmpeg"; need curl "apt install curl"
if [ ${#THIEU[@]} -gt 0 ]; then printf 'THIẾU: %s\n' "${THIEU[@]}"; echo "Cài các lệnh trên rồi chạy lại."; exit 1; fi
say "2/6 Thư viện Python (numpy, scipy, pillow, opencv, sherpa-onnx, soundfile)"
PIPX=""; python3 -m pip install --help 2>/dev/null | grep -q break-system-packages && PIPX="--break-system-packages"
python3 -m pip install -q $PIPX numpy scipy pillow opencv-python-headless sherpa-onnx soundfile || echo "!! pip lỗi — thử: python3 -m pip install --user …"
say "3/6 Engine three.js (npm install) + Playwright"
( cd "$P/engine" && npm install --no-audit --no-fund --silent )
if ! (cd "$P/engine" && node -e "require('playwright')" 2>/dev/null); then ( cd "$P/engine" && npm install --no-save --no-audit --no-fund --silent playwright@1.63.0 ); fi
if [ "${BO_QUA_TRINH_DUYET:-0}" != 1 ] && [ ! -d /opt/pw-browsers ]; then ( cd "$P/engine" && npx --yes playwright install chromium ) || echo "!! Không tải được Chromium (mạng chặn cdn.playwright.dev / playwright.download.prss.microsoft.com?)"; fi
say "4/6 Mô hình chép lời Parakeet-TDT 0.6B (≈ 630 MB) → $H/parakeet"
if [ ! -f "$H/parakeet/tokens.txt" ]; then
  ( cd "$H" && curl -fsSL -o p.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2 && tar xjf p.tar.bz2 && rm -f p.tar.bz2 && rm -rf parakeet && mv sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8 parakeet ) || echo "!! Tải mô hình lỗi (mạng chặn github.com / release-assets.githubusercontent.com?)"
fi
say "5/6 Dữ liệu MakeHuman (npm makehuman-data 0.0.2, CC0, ≈ 260 MB) → $H/makehuman-data"
if [ ! -d "$H/makehuman-data/package/public/data" ]; then
  ( mkdir -p "$H/makehuman-data" && cd "$H/makehuman-data" && npm pack makehuman-data@0.0.2 --silent >/dev/null 2>&1 && tar xzf makehuman-data-0.0.2.tgz && rm -f makehuman-data-0.0.2.tgz ) || echo "!! Tải makehuman-data lỗi (mạng chặn registry.npmjs.org?)"
fi
say "6/6 Âm thanh (không có trong git)"
n=$(ls "$P/tai_nguyen/sfx/"*.mp3 2>/dev/null | wc -l); m=$(ls "$P/tai_nguyen/nhac/"*.mp3 2>/dev/null | wc -l)
echo "SFX: $n file mp3 · Nhạc: $m file mp3"
[ "$n" -lt 20 ] || [ "$m" -lt 1 ] && echo "→ Giải nén gói AbsurdPlay_P02_am_thanh.zip vào du_an/P02_oddtilt/ (tạo tai_nguyen/sfx, tai_nguyen/nhac)."
echo; echo "Xong. Kiểm tra lại: bash $P/cai_dat/kiem_tra.sh   (thêm --render để render thử 1 khung)"
echo "Đường dẫn dùng trong lệnh: P02_HOME=$H  ·  mô hình: $H/parakeet  ·  MakeHuman: $H/makehuman-data/package/public/data"
