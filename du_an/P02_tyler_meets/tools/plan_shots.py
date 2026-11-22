"""plan_shots — turn an annotated script + measured VO word timings into a dense, script-locked shot timeline.

Usage: python tools/plan_shots.py script.txt vo16k.asr.json library.json out_timeline.json [--vo vo.mp3] [--out video.mp4]

script.txt — one line per spoken line; "/" splits a line into beats, each beat gets its own image:
    L01 [NARR] Your girlfriend says / she made you coffee. | WIDE / B:sweet_happy
    L02 [NARR] You don't drink coffee. | A:deadpan
    L03 [GF]   "Since when?" | B:innocent
  Right of "|" = one image key per beat (same count as beats; a single key is reused for all beats).
  Keys resolve through library.json  {"WIDE": "assets/...png", "A:deadpan": "...", ...}; a key may also be a path.
Rules applied (CAMERA_SHOT_RULES §dense):
  - cut 0.12 s before the first word of each beat (first shot starts at 0.0)
  - beats shorter than MIN_SHOT (0.9 s) are merged into the previous shot (no flicker)
  - push-in 1.045 on shots >= 3.5 s, static otherwise
  - two consecutive beats with the same key stay one shot
"""
import json, re, sys

MIN_SHOT, LEAD, PUSH_MIN = 0.9, 0.12, 3.5
args = sys.argv[1:]
opt = {k: args[args.index(k) + 1] for k in ("--vo", "--out") if k in args}
script_p, asr_p, lib_p, out_p = [a for a in args if not a.startswith("--") and a not in opt.values()][:4]

norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower().replace("’", "'"))
words = [w for s in json.load(open(asr_p, encoding="utf-8")) for w in s["words"]]
asr = [(norm(w[2]), w[0], w[1]) for w in words if norm(w[2])]
lib = json.load(open(lib_p, encoding="utf-8"))

beats = []   # (line_id, speaker, text, key)
for raw in open(script_p, encoding="utf-8"):
    raw = raw.strip()
    if not raw or raw.startswith("#"): continue
    m = re.match(r"(L\d+)\s*\[(\w+)\]\s*(.*?)\s*\|\s*(.+)$", raw)
    if not m: sys.exit(f"bad line: {raw}")
    lid, spk, text, keys = m.groups()
    segs = [s.strip() for s in text.split("/")]; ks = [k.strip() for k in keys.split("/")]
    if len(ks) == 1: ks = ks * len(segs)
    if len(ks) != len(segs): sys.exit(f"{lid}: {len(segs)} beats but {len(ks)} image keys")
    beats += [(lid, spk, s, k) for s, k in zip(segs, ks)]

# sequential alignment of script words to ASR words (tolerates small ASR errors)
pos, starts, ends = 0, [], []
for lid, spk, seg, key in beats:
    toks = [norm(t) for t in seg.split() if norm(t)]
    first = last = None
    for tk in toks:
        for j in range(pos, min(pos + 4, len(asr))):
            if asr[j][0] == tk or (len(tk) > 3 and (asr[j][0].startswith(tk[:4]) or tk.startswith(asr[j][0][:4]))):
                first = asr[j][1] if first is None else first; last = asr[j][2]; pos = j + 1; break
    if first is None: sys.exit(f"{lid}: could not align beat '{seg}' — check script vs VO")
    starts.append(first); ends.append(last)

def char_of(key):
    """'A:worried' -> 'A'; episode keys 'B_FRY' -> 'B'; WIDE/paths -> None."""
    if ":" in key: return key.split(":")[0]
    m = re.match(r"^([A-Z])_", key); return m.group(1) if m else None

shots = []
for i, (lid, spk, seg, key) in enumerate(beats):
    t0 = 0.0 if i == 0 else round(round((starts[i] - LEAD) * 30) / 30, 4)   # snap cuts to the 30 fps frame grid
    if shots and key == shots[-1]["key"]:
        shots[-1]["beats"].append(f"{lid} {seg}"); continue
    if shots and t0 - shots[-1]["start"] < (0.75 if len(shots) == 1 else MIN_SHOT):   # opening beat may be a bit shorter
        if len(shots) > 1 and shots[-1]["start"] - shots[-2]["start"] >= 2 * MIN_SHOT:
            # move the previous cut earlier instead of dropping this beat's image
            shots[-1]["start"] = round(round((t0 - MIN_SHOT) * 30) / 30, 4); shots[-2]["end"] = shots[-1]["start"]
        else:
            print(f"WARNING {lid}: beat '{seg}' ({key}) shorter than {MIN_SHOT}s after previous cut -> merged, image not shown")
            shots[-1]["beats"].append(f"{lid} {seg}"); continue
    if shots: shots[-1]["end"] = t0
    shots.append(dict(key=key, start=t0, beats=[f"{lid} [{spk}] {seg}"]))
end_t = round(ends[-1] + 0.6, 3); shots[-1]["end"] = end_t
for k, s in enumerate(shots):
    s["id"] = f"S{k + 1:02d}"; s["src"] = lib.get(s["key"], s["key"]); s["kind"] = "still"
    s["push"] = 1.045 if s["end"] - s["start"] >= PUSH_MIN else 1.0
    prev = shots[k - 1]["key"] if k else None
    # same character close-up -> expression "snap" cut (intended; reference does CU->CU too, e.g. V06 42.1/44.0)
    s["snap"] = bool(prev and char_of(prev) and char_of(prev) == char_of(s["key"]))

T = dict(out=opt.get("--out", "out.mp4"), fps=30, w=1080, h=1920, vo=opt.get("--vo", ""), words=asr_p, tail=0.6,
         music=None, font="C:/Users/ADMIN/AppData/Local/Microsoft/Windows/Fonts/Roboto-BlackItalic.ttf", shots=shots)
json.dump(T, open(out_p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
durs = [s["end"] - s["start"] for s in shots]
print(f"{len(shots)} shots for {len(beats)} beats, {end_t:.2f}s, {len(shots)/end_t*10:.2f} cuts/10s, "
      f"shot dur min {min(durs):.2f} median {sorted(durs)[len(durs)//2]:.2f} max {max(durs):.2f}")
for s in shots: print(f"  {s['id']} {s['start']:6.2f}-{s['end']:6.2f} {s['key']:16s} push={s['push']}  {' | '.join(s['beats'])}")
