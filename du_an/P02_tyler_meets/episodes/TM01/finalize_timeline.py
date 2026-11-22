import json, os
p = "episodes/TM01/timeline.json"; T = json.load(open(p, encoding="utf-8"))
C, ST = "work/tm01/clips", "work/tm01/stories"
STILL = {"INS_STORY_RAIN": "story_rain.png", "INS_ME_PHONE": "phone_notif.png", "INS_STORY_BLACK": "story_black.png", "INS_STORY_HEART": "story_heart.png",
         "INS_STORY_CAPTION": "story_caption.png", "INS_STORY_2": "story_2.png", "INS_STORY_BARS": "story_bars.png", "INS_STORY_TAG": "story_tag.png",
         "INS_STORY_3": "story_3.png", "INS_STORY_FINAL": "story_final.png"}
for s in T["shots"]:
    k = s["key"]
    if k in STILL: s.update(kind="still", src=f"{ST}/{STILL[k]}", push=1.045)
    else:
        d = f"{C}/{s['id']}_{k}"; assert os.path.isdir(d), d; s.update(kind="frames", src=d, push=1.0)
T.update(words="episodes/TM01/audio/vo16k.cap.json", caption_style="hb", music="assets/music/bed_main_V07.wav", music_gain_db=-9.5, tail=0.6,
         keywords=["Hmmmmm", "Jaylen", "chillest", "bus", "sad", "movie", "Monday", "school", "Third", "Window", "sixth", "buzzes", "black", "broken",
                   "heart", "piano", "seat,", "trust.", "seat.", "family", "land.", "behind", "Smiling.", "good,", "Nobody", "understands", "perfectly.",
                   "breathing", "neck.", "fourteen.", "library,", "Kayla", "betrayer", "staring", "librarian.", "MY", "breakfast", "sandwich.", "trust",
                   "villain.", "standing.", "peace."])
json.dump(T, open(p, "w", encoding="utf-8"), indent=1); print("timeline ready", len(T["shots"]), "shots")
