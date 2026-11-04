#!/bin/bash
export QT_QPA_PLATFORM=xcb LIBGL_ALWAYS_SOFTWARE=1 XDG_RUNTIME_DIR=/tmp/rt; mkdir -p /tmp/rt; chmod 700 /tmp/rt
rm -f /tmp/kdenlivelock; rm -rf ~/.config/kdenliverc
Xvfb :60 -screen 0 1600x1000x24 >/dev/null 2>&1 & XP=$!
sleep 2; export DISPLAY=:60
eval $(dbus-launch --sh-syntax)
kdenlive "$1" > kd.log 2>&1 & KP=$!
for i in $(seq 1 ${2:-6}); do sleep 8; for W in $(xdotool search --onlyvisible --name "^(Error|Question|Warning|Information|Sorry)" 2>/dev/null); do xdotool windowactivate --sync $W 2>/dev/null; xdotool key --window $W ctrl+c; sleep 1; echo "== $(xdotool getwindowname $W)"; xclip -o -selection clipboard 2>/dev/null; echo; xdotool key --window $W Escape; done; done
xwd -root -silent | convert xwd:- -resize 1200x final.png
xdotool key ctrl+q; sleep 4; kill $KP 2>/dev/null; sleep 1; kill -9 $KP 2>/dev/null; kill $XP; kill $DBUS_SESSION_BUS_PID
