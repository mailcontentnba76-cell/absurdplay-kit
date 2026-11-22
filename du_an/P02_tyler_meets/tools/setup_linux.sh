#!/usr/bin/env bash
# Dựng môi trường cho kit "Tyler meets…" trên phiên Claude Code cloud (Ubuntu, Python 3.13, không GPU).
# Chạy một lần mỗi phiên mới:  bash du_an/P02_tyler_meets/tools/setup_linux.sh
# Cần mạng tới: pypi.org, registry.npmjs.org, kho apt Ubuntu, huggingface.co (model Whisper).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
pip install -q -r "$HERE/../requirements.txt" opencv-python-headless bpy==5.2.4 fonttools brotli
# Eevee chạy không GPU qua Mesa (llvmpipe); font thay cho font Windows.
apt-get install -y -q libegl1 libegl-mesa0 libgl1-mesa-dri libgles2 libglx-mesa0 \
  fonts-liberation fonts-roboto fonts-noto-core fonts-noto-color-emoji >/dev/null || true
F=/usr/local/share/fonts/tylerkit; mkdir -p "$F"
if [ ! -s "$F/ArchivoBlack-Regular.ttf" ] || [ ! -s "$F/Anton-Regular.ttf" ]; then
  T="$(mktemp -d)"; ( cd "$T" && npm pack -q @fontsource/archivo-black@5.3.0 @fontsource/anton@5.3.0 >/dev/null \
    && for t in *.tgz; do tar -xzf "$t" && mv package "x_${t%.tgz}"; done )
  python3 -I - "$T" "$F" <<'PY'
import sys, glob
from fontTools.ttLib import TTFont
T, F = sys.argv[1:]
for name, out in [("archivo-black", "ArchivoBlack-Regular.ttf"), ("anton", "Anton-Regular.ttf")]:
    t = TTFont(glob.glob(f"{T}/x_*{name}*/files/{name}-latin-400-normal.woff")[0]); t.flavor = None; t.save(f"{F}/{out}")
PY
  rm -rf "$T"; fc-cache -f >/dev/null
fi
python3 -c "import bpy, cv2, faster_whisper; print('bpy', bpy.app.version_string, '| OK')"
echo "Dùng: export BLENDER=$HERE/blender_linux.sh"
