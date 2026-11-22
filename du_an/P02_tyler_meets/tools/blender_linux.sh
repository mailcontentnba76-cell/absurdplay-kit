#!/usr/bin/env bash
# Thay cho blender.exe trên phiên cloud Linux: chạy script bằng module bpy 5.2.4 (pip install bpy==5.2.4).
# Nhận đúng cú pháp của skill:  tools/blender_linux.sh -b --python <script.py> -- <tham số...>
set -e
args=(); script=""
while [ $# -gt 0 ]; do
  case "$1" in
    -b|--background) shift ;;
    --python) script="$2"; shift 2 ;;
    --) args+=("$@"); break ;;
    *) echo "blender_linux.sh: bỏ qua tham số $1" >&2; shift ;;
  esac
done
[ -n "$script" ] || { echo "thiếu --python <script>" >&2; exit 2; }
exec python3 "$script" "${args[@]}"
