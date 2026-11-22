import json, os
p = "episodes/TMG01/timeline.json"; T = json.load(open(p, encoding="utf-8"))
C, ST = "work/tmg/clips", "work/tmg/inserts"
STILL = {"INS_PHONE_STREAM": "phone_stream.png"}
for s in T["shots"]:
    k = s["key"]
    if k in STILL: s.update(kind="still", src=f"{ST}/{STILL[k]}", push=1.045)
    else:
        d = f"{C}/{s['id']}_{k}"; assert os.path.isdir(d), d; s.update(kind="frames", src=d, push=1.0)
T.update(words="episodes/TMG01/audio/vo16k.cap.json", caption_style="hb", music="assets/music/bed_main_V07.wav", music_gain_db=-9.5, tail=0.6,
         keywords=["BRO!", "slept!", "Thirty-one", "Vice", "City!", "Skrrrt!", "Brody.", "GTA", "6", "yesterday.", "golf", "cart,", "triangle.", "real",
                   "HEY!", "cart!", "four", "faster.", "assembly.", "principal", "WALK!", "two", "stars!", "TWO", "STARS!", "curtain,", "nurse's",
                   "armor.", "health.", "granola", "bar.", "FULL.", "awake", "Lunch.", "sandwich.", "vehicle.", "carjacked", "stream.", "own",
                   "someone", "else", "rich.", "detention.", "carjacked."])
json.dump(T, open(p, "w", encoding="utf-8"), indent=1); print("timeline ready", len(T["shots"]), "shots")
