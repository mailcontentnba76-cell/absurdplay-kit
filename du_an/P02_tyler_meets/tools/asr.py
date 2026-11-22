import sys, json, os
from faster_whisper import WhisperModel
m = WhisperModel("medium.en", device="cpu", compute_type="int8", cpu_threads=8)
out = sys.argv[1]
for p in sys.argv[2:]:
    vid = os.path.splitext(os.path.basename(p))[0]
    import soundfile as sf
    a,_ = sf.read(p, dtype="float32")
    segs, info = m.transcribe(a, word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False)
    res = []
    for s in segs:
        res.append({"start": round(s.start,3), "end": round(s.end,3), "text": s.text.strip(),
                    "words": [[round(w.start,3), round(w.end,3), w.word, round(w.probability,2)] for w in s.words]})
    json.dump(res, open(os.path.join(out, vid+".asr.json"),"w",encoding="utf-8"), ensure_ascii=False, indent=1)
    with open(os.path.join(out, vid+".asr.txt"),"w",encoding="utf-8") as f:
        for s in res: f.write(f"[{s['start']:7.2f}-{s['end']:7.2f}] {s['text']}\n")
    print(vid, len(res), flush=True)
