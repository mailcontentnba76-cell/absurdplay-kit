"""TT001: point the timeline at the rendered clips + phone inserts.
python episodes/TT001/finalize_timeline.py [clips_dir] [inserts_dir] [step]   (defaults: work/tt001/clips work/tt001/inserts 1)"""
import json, os, sys
a = sys.argv[1:]
C = a[0] if len(a) > 0 else "work/tt001/clips"
ST = a[1] if len(a) > 1 else "work/tt001/inserts"
STEP = int(a[2]) if len(a) > 2 else 1
p = "episodes/TT001/timeline.json"; T = json.load(open(p, encoding="utf-8"))
STILL = {"POV_KAY_ZOOM": "phone_zoom.png", "INS_PHONE_VIEWS": "phone_views.png"}
for s in T["shots"]:
    k = s["key"]
    if k in STILL: s.update(kind="still", src=f"{ST}/{STILL[k]}", push=1.045); s.pop("step", None)
    else:
        d = f"{C}/{s['id']}_{k}"; assert os.path.isdir(d), d; s.update(kind="frames", src=d, push=1.0, step=STEP)
T.update(words="episodes/TT001/audio/vo16k.cap.json", caption_style="hb", music="assets/music/bed_main_V07.wav", music_gain_db=-9.5, tail=0.6,
         keywords=["OHHH!", "No-look", "aura", "farming!", "Elijah.", "final", "boss.", "leans", "Poles.", "Doors.", "principal.", "farming.", "video.",
                   "Zero", "crops.", "Band.", "triangle.", "ding.", "stops.", "perfect.", "less", "tuba.", "forty", "minutes.", "upside", "down.",
                   "Art", "line.", "coat", "rack.", "Bro.", "can't", "see.", "no-look", "farming", "anything.", "Glasses.", "LOOKING", "sandwich",
                   "bus.", "glasses.", "2", "million", "views.", "sandwich."])
json.dump(T, open(p, "w", encoding="utf-8"), indent=1); print("timeline ready", len(T["shots"]), "shots, step", STEP)
