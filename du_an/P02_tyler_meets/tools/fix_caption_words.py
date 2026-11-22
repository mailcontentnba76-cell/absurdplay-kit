"""fix_caption_words — caption words = SCRIPT text, timings = ASR.
ASR mishears (e.g. "Bro" -> "Oh", "FLASH" -> "Ash", "seven forty" -> "7.40"); captions must show the script.
Usage: python tools/fix_caption_words.py shots.txt vo_lines.json asr.json out.json
Per script line: ASR words inside the line's time span (vo_lines.json) are re-labelled with the script tokens;
if counts differ, script tokens are spread over the span proportionally to character length."""
import json, re, sys
shots_p, lines_p, asr_p, out_p = sys.argv[1:5]
script = []
for raw in open(shots_p, encoding="utf-8"):
    m = re.match(r"(L\d+)\s*\[(\w+)\]\s*(.*?)\s*\|", raw.strip())
    if m: script.append((m.group(1), m.group(3).replace("/", " ").split()))
L = {x["line"]: x for x in json.load(open(lines_p, encoding="utf-8"))}
asr = [w for s in json.load(open(asr_p, encoding="utf-8")) for w in s["words"]]
out = []
for lid, toks in script:
    s, e = L[lid]["start"] - 0.15, L[lid]["end"] + 0.15
    ws = [w for w in asr if s <= (w[0] + w[1]) / 2 <= e]
    if len(ws) == len(toks):
        out += [[w[0], w[1], " " + t, 1.0] for w, t in zip(ws, toks)]
    else:
        a = ws[0][0] if ws else L[lid]["start"]; b = ws[-1][1] if ws else L[lid]["end"]
        tot = sum(len(t) + 1 for t in toks); c = a
        for t in toks:
            d = (b - a) * (len(t) + 1) / tot; out.append([round(c, 3), round(c + d * 0.92, 3), " " + t, 0.5]); c += d
        print(f"{lid}: ASR {len(ws)} words vs script {len(toks)} -> proportional")
json.dump([{"start": out[0][0], "end": out[-1][1], "text": "", "words": out}], open(out_p, "w", encoding="utf-8"), indent=1)
print(f"{len(out)} caption words -> {out_p}")
