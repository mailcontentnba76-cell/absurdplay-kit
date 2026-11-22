"""Make the shot-key library plan_shots.py needs (Blender episodes: every key is rendered, so values are placeholders).
python tools/make_library.py episodes/<ID>/shots.txt episodes/<ID>/library.json"""
import json, sys
keys = []
for l in open(sys.argv[1], encoding="utf-8"):
    if "|" in l: keys += [k.strip() for k in l.split("|")[1].split("/")]
json.dump({k: "PLACEHOLDER" for k in keys}, open(sys.argv[2], "w"), indent=1); print(len(keys), "keys ->", sys.argv[2])
