import json, os
p = "episodes/TM02/timeline.json"; T = json.load(open(p, encoding="utf-8"))
C, ST = "work/tm02v2/clips", "work/tm02v2/inserts"
STILL = {"INS_PHONE_SELFIES": "phone_selfies.png"}
for s in T["shots"]:
    k = s["key"]
    if k in STILL: s.update(kind="still", src=f"{ST}/{STILL[k]}", push=1.045)
    else:
        d = f"{C}/{s['id']}_{k}"; assert os.path.isdir(d), d; s.update(kind="frames", src=d, push=1.0)
T.update(words="episodes/TM02/audio/vo16k.cap.json", caption_style="hb", music="assets/music/bed_main_V07.wav", music_gain_db=-9.5, tail=0.6,
         keywords=["YO!", "that?!", "looked", "into", "Right?!", "clock.", "Behind", "Marcus.", "locker", "photo", "shoot.", "leg", "gum", "music", "video.", "forty", "selfies", "bathroom", "mirror.", "FIRE!", "Same", "Forty", "Friday", "dance.", "freezes.", "SAUSAGE", "FEST!", "ARE", "sausage.", "three", "girls", "instantly.", "Deeper", "wall.", "Laughing", "nobody", "choosing", "knocks", "snack", "table.", "sandwich.", "sitting", "runs", "honking", "TEN", "MINUTES!", "cousin.", "See?", "mom", "flat."])
json.dump(T, open(p, "w", encoding="utf-8"), indent=1); print("timeline ready", len(T["shots"]), "shots")
