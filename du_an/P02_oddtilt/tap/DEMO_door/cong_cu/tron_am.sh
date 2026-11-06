#!/usr/bin/env bash
# Trộn giọng + nhạc + SFX theo mốc (giây) cho demo door 0–11,1 s. Dùng: bash tron_am.sh <ra.wav>
P=$(cd "$(dirname "$0")/../../.." && pwd); X=$P/tai_nguyen/sfx; T=$P/tap/DEMO_door
ffmpeg -loglevel error -y -i $T/am_thanh/giong.wav -i $P/tai_nguyen/nhac/the_curious_ukulele_conundrum.mp3 \
 -i $X/whoosh.mp3 -i $X/whoosh.mp3 -i $X/whoosh.mp3 -i $X/trai_da.mp3 -i $X/ding.mp3 -i $X/uh_oh.mp3 -i $X/gio_da.mp3 -i $X/keo_rem.mp3 -i $X/van_go.mp3 -filter_complex "\
[0]atrim=0:11.1,aformat=channel_layouts=mono,aresample=44100,asetpts=N/SR/TB[v];[1]atrim=0:11.1,aformat=channel_layouts=mono,volume=-19dB,afade=t=out:st=10.6:d=0.5[m];\
[2]aformat=channel_layouts=mono,adelay=2650,volume=-14dB[w1];[3]aformat=channel_layouts=mono,adelay=5550,volume=-14dB[w2];[4]aformat=channel_layouts=mono,adelay=8200,volume=-14dB[w3];\
[5]aformat=channel_layouts=mono,adelay=3400,volume=-12dB[u];[6]aformat=channel_layouts=mono,adelay=4980,volume=-9dB[d];[7]aformat=channel_layouts=mono,adelay=5760,volume=-15dB[o];\
[8]aformat=channel_layouts=mono,adelay=6000,volume=-11dB,afade=t=out:st=8.2:d=0.6[g];[9]aformat=channel_layouts=mono,adelay=8650,volume=-12dB[k];[10]aformat=channel_layouts=mono,adelay=9500,volume=-10dB[p];\
[v][m][w1][w2][w3][u][d][o][g][k][p]amix=inputs=11:normalize=0:duration=first,atrim=0:11.1,loudnorm=I=-14:TP=-1.5:LRA=7" -ar 44100 -ac 2 "$1"
