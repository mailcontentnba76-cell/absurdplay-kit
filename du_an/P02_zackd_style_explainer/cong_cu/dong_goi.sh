#!/usr/bin/env bash
# Đóng gói P02 để chuyển sang tài khoản hoặc máy khác.
# Dùng: bash du_an/P02_zackd_style_explainer/cong_cu/dong_goi.sh [thư mục ra]   (chạy từ gốc repo)
# Ra: <ra>/zackdfilms-reference-production.zip (skill) và <ra>/P02_goi_chuyen_v1.0.zip (dự án). Không gồm video mẫu.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd); P="$ROOT/du_an/P02_zackd_style_explainer"
OUT=${1:-"$P/goi_chuyen"}; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
TMP=$(mktemp -d); SK="$TMP/skill/zackdfilms-reference-production"
# 1) skill tự đủ dùng: skill + scripts + bản sao tổng hợp
mkdir -p "$TMP/skill"; cp -r "$P/skill/zackdfilms-reference-production" "$TMP/skill/"
mkdir -p "$SK/scripts"; cp "$P"/cong_cu/*.py "$P"/cong_cu/*.profile "$SK/scripts/"; cp -r "$P/cong_cu/blender" "$SK/scripts/"
cp "$ROOT/cong_cu/phan_tich_mau.py" "$SK/scripts/"; cp "$P/PHAN_TICH_MAU/TONG_HOP.md" "$SK/references/tong_hop_10_mau.md"
find "$SK" -name __pycache__ -prune -exec rm -rf {} +
rm -f "$OUT/zackdfilms-reference-production.zip"; (cd "$TMP/skill" && zip -qr "$OUT/zackdfilms-reference-production.zip" zackdfilms-reference-production)
# 2) bộ dự án
K="$TMP/kit"; B="$K/BO_HUONG_DAN_SAN_XUAT_VIDEO"; mkdir -p "$B/du_an"
cp "$ROOT"/00_HUONG_DAN_CHO_CLAUDE.md "$ROOT"/01_CAU_LENH_KHOI_DONG.md "$ROOT"/README.md "$B/"; cp -r "$ROOT/mau" "$ROOT/cong_cu" "$B/"
cp -r "$ROOT/du_an/_MAU_THU_MUC_DU_AN" "$B/du_an/"
(cd "$ROOT/du_an" && tar --exclude='*.mp4' --exclude='goi_chuyen' --exclude='__pycache__' -cf - P02_zackd_style_explainer) | (cd "$B/du_an" && tar -xf -)
cp "$P/BAT_DAU_DAY.md" "$K/"; cp -r "$TMP/skill" "$K/skill"
rm -f "$OUT/P02_goi_chuyen_v1.0.zip"; (cd "$K" && zip -qr "$OUT/P02_goi_chuyen_v1.0.zip" .)
rm -rf "$TMP"
ls -la "$OUT"
