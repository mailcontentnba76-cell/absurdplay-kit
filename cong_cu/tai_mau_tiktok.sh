#!/usr/bin/env bash
# Tải video 1..N (mới nhất trước) của một kênh TikTok + metadata, kiểm luồng tiếng.
# Dùng: bash cong_cu/tai_mau_tiktok.sh <ten_kenh_khong_@> <thu_muc_ra> [N=26]
# Cần: yt-dlp (pip), ffprobe; mạng phải cho phép *.tiktok.com, *.tiktokcdn.com, *.tiktokcdn-us.com, *.tiktokv.com
set -euo pipefail
KENH="$1"; OUT="$2"; N="${3:-26}"
mkdir -p "$OUT"
yt-dlp --playlist-items "1-$N" --write-info-json --no-overwrites \
  -f "bv*[vcodec^=h264]+ba/b[vcodec^=h264]/bv*+ba/b" \
  -o "$OUT/%(playlist_index)02d_%(upload_date)s_%(id)s.%(ext)s" \
  "https://www.tiktok.com/@$KENH"
for f in "$OUT"/*.mp4; do
  a=$(ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "$f" | head -1)
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "$(basename "$f") | tieng=${a:-KHONG_CO} | ${d}s | md5=$(md5sum "$f" | cut -c1-8)"
done
