"""Assemble a vertical episode from a timeline JSON (stills + push-in, optional clips, karaoke captions, VO, music).

Usage: python tools/build_episode.py <timeline.json>

timeline.json:
{
  "out": "test_ep/out/test.mp4", "fps": 30, "w": 1080, "h": 1920,
  "vo": "test_ep/assets/vo.mp3",            # narration (all lines, one file, measured timing)
  "words": "test_ep/assets/vo16k.asr.json",  # faster-whisper word timings of the VO
  "tail": 0.6,                               # seconds of picture after last word (reference: 0.50-0.76 s)
  "music": null, "music_gain_db": -9.5,      # LUFS offset bed vs VO; -9.5 gave voice 5.5 dB over bed (Demucs RMS check), reference 3.9-7.3
  "font": "C:/Users/ADMIN/AppData/Local/Microsoft/Windows/Fonts/Roboto-BlackItalic.ttf",
  "shots": [ {"id":"S01","src":"...png","kind":"still","start":0.0,"end":3.0,"push":1.0},
             {"id":"S02","src":"...mp4","kind":"clip","start":3.0,"end":7.5,"clip_in":0.0,"push":1.0} ]
}
Shots must tile [0, last_word_end + tail] with no gaps/overlaps (checked).
push: final scale of a centered push-in over the shot (reference PUSH shots: 1.043-1.06; STILL shots: 1.0).
"""
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), ".")); from kitfonts import kf  # font Windows/Linux
import json, sys, subprocess, numpy as np, cv2, os
from PIL import Image, ImageDraw, ImageFont

T = json.load(open(sys.argv[1], encoding="utf-8"))
FPS, W, H = T.get("fps", 30), T.get("w", 1080), T.get("h", 1920)
words = [w for s in json.load(open(T["words"], encoding="utf-8")) for w in s["words"]]
end_t = words[-1][1] + T.get("tail", 0.6)
shots = T["shots"]
# ---- continuity check: shots tile the timeline
assert abs(shots[0]["start"]) < 1e-6, "first shot must start at 0"
for a, b in zip(shots[:-1], shots[1:]):
    assert abs(a["end"] - b["start"]) < 1e-3, f"gap/overlap between {a['id']} and {b['id']}"
if abs(shots[-1]["end"] - end_t) > 0.05:
    print(f"note: last shot end {shots[-1]['end']} adjusted to {end_t:.3f}")
    shots[-1]["end"] = end_t

# ---- caption pages (reference: 2 lines, <=~6 words/page, uppercase, page breaks at sentence ends)
def pages_from_words(ws, max_words=6, max_chars=20):
    pages, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w)
        txt = w[2].strip()
        nxt_gap = ws[i + 1][0] - w[1] if i + 1 < len(ws) else 9
        if len(cur) >= max_words or txt[-1:] in ".?!" or nxt_gap > 0.6:
            pages.append(cur); cur = []
    if cur: pages.append(cur)
    out = []
    for p in pages:
        toks = [w[2].strip().upper() for w in p]
        # split into two lines, first line <= max_chars
        l1, l2 = [], []
        for k, t in enumerate(toks):
            (l1 if (len(" ".join(toks[:k + 1])) <= max_chars and not l2) else l2).append(k)
        out.append(dict(words=p, toks=toks, lines=[l1, l2] if l2 else [l1]))
    return out

PAGES = pages_from_words(words)
_fp = kf(T["font"]) if T.get("font") and os.path.exists(kf(T["font"])) else kf("C:/Windows/Fonts/ariblk.ttf")   # portable: fall back when the per-user font is missing
font = ImageFont.truetype(kf(_fp), int(H * 0.0405))  # cap height ~2.0% of H like reference
RED = (226, 54, 12)
cap_top, line_pitch = int(H * 0.722), int(H * 0.0344)

def caption_layer(t):
    """RGBA overlay for time t: page visible from first word start to last word end + 0.15 s (or next page)."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for pi, p in enumerate(PAGES):
        s = p["words"][0][0]; e = p["words"][-1][1] + 0.15
        if pi + 1 < len(PAGES): e = min(e, PAGES[pi + 1]["words"][0][0])
        if not (s <= t < e): continue
        d = ImageDraw.Draw(img)
        space = d.textlength(" ", font=font)
        widths = [d.textlength(tok, font=font) for tok in p["toks"]]
        line_w = [sum(widths[k] for k in L) + space * (len(L) - 1) for L in p["lines"]]
        x0 = (W - max(line_w)) / 2  # block centered, lines left-aligned (measured on V05/V06)
        active = max([k for k, w in enumerate(p["words"]) if w[0] <= t] or [0])
        for li, L in enumerate(p["lines"]):
            x = x0; y = cap_top + li * (line_pitch + int(H * 0.0203))
            for k in L:
                bb = d.textbbox((x, y), p["toks"][k], font=font)
                if k == active:
                    d.rounded_rectangle((bb[0] - 6, bb[1] - 6, bb[2] + 6, bb[3] + 6), radius=4, fill=RED + (255,))
                # soft dark shadow then white text
                d.text((x + 2, y + 3), p["toks"][k], font=font, fill=(0, 0, 0, 140))
                d.text((x, y), p["toks"][k], font=font, fill=(255, 255, 255, 255))
                x += widths[k] + space
        break
    return np.array(img)

# ---- caption style "hb" (homeboy refs H01–H03): 1–3 words per page, centred at ~60% H, white with black outline,
# keywords yellow-orange, script case kept (shouted words are already UPPERCASE in the script). No karaoke box.
if T.get("caption_style") == "hb":
    KW = {k.lower().strip(".,!?") for k in T.get("keywords", [])}
    HB_FONT = ImageFont.truetype(kf(T.get("hb_font", "C:/Windows/Fonts/ariblk.ttf")), int(H * 0.033))  # user 18/11: smaller, never off-frame
    def _pages_hb(ws, maxw=3):
        pages, cur = [], []
        for i, w in enumerate(ws):
            cur.append(w); txt = w[2].strip()
            gap = ws[i + 1][0] - w[1] if i + 1 < len(ws) else 9
            if len(cur) >= maxw or txt[-1:] in ".?!," or gap > 0.3:
                pages.append(cur); cur = []
        if cur: pages.append(cur)
        return [dict(words=p, toks=[w[2].strip() for w in p]) for p in pages]
    PAGES = _pages_hb(words)
    def caption_layer(t):
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        for pi, p in enumerate(PAGES):
            s = p["words"][0][0]; e = p["words"][-1][1] + 0.2
            if pi + 1 < len(PAGES): e = min(e, PAGES[pi + 1]["words"][0][0])
            if not (s <= t < e): continue
            d = ImageDraw.Draw(img); fnt = HB_FONT
            while True:   # shrink until the page fits inside 84% of the width (safe margins)
                sp = d.textlength(" ", font=fnt); ws_ = [d.textlength(tok, font=fnt) for tok in p["toks"]]
                if sum(ws_) + sp * (len(ws_) - 1) <= W * 0.84 or fnt.size < 30: break
                fnt = ImageFont.truetype(fnt.path, int(fnt.size * 0.9))
            x = (W - sum(ws_) - sp * (len(ws_) - 1)) / 2; y = int(H * 0.60)
            for tok, wd in zip(p["toks"], ws_):
                col = (255, 196, 0) if tok.lower().strip(".,!?-") in KW or any(part in KW for part in tok.lower().strip(".,!?").split("-")) else (255, 255, 255)
                d.text((x, y), tok, font=fnt, fill=col + (255,), stroke_width=5, stroke_fill=(0, 0, 0, 255), anchor="ls")
                x += wd + sp
            break
        return np.array(img)

def fit(img):
    h, w = img.shape[:2]; s = max(W / w, H / h)
    img = cv2.resize(img, (round(w * s), round(h * s)), interpolation=cv2.INTER_AREA)
    y0 = (img.shape[0] - H) // 2; x0 = (img.shape[1] - W) // 2
    return img[y0:y0 + H, x0:x0 + W]

def push(img, scale):
    M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, scale)
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

os.makedirs(os.path.dirname(T["out"]), exist_ok=True)
silent = T["out"].replace(".mp4", "_picture.mp4")
ff = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
                       "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
                       "-pix_fmt", "yuv420p", silent], stdin=subprocess.PIPE)
cache = {}

# ---- optional 2.5D acting + emotion icons per shot (tools/acting.py, tools/emotes.py; see ACTING_EMOTES.md)
# shot["acting"] = {"heads": {"A": mask | [masks]}, "variants": {"surprised": path}, "plates": {"A": path},
#                   "actions": {"A": [["blink", 0.6], ["double_take", 1.2, "surprised"], ["shake", 2.0, 2.4], ...]},
#                   "icons": [{"head": "A", "icon": "exclaim", "t0": 1.7, "t1": 2.4}], "breath": true}
# all times are SHOT-LOCAL seconds. Icons are drawn before push-in so they zoom with the picture.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
def acting_frame(sh, tl):
    import acting as AC, emotes as EM
    A = sh["acting"]; key = "acting#" + sh["id"]
    if key not in cache:
        sc = AC.Scene(dict(base=sh["src"], **A.get("variants", {})), A["heads"], W, H, plates=A.get("plates"))
        tls = {}
        for hid in A["heads"]:
            tlh = AC.Timeline(blink_every=A.get("blink_every", 0), breath_amp=0.004 if A.get("breath") else 0.0)
            for act in A.get("actions", {}).get(hid, []):
                getattr(tlh, act[0])(*act[1:])
            tls[hid] = tlh
        cache[key] = (sc, tls)
    sc, tls = cache[key]
    P = {hid: tls[hid].params(tl) for hid in tls}
    fr = sc.frame(P)
    if A.get("icons"):
        ov = EM.Overlay(W, H)
        for ic in A["icons"]:
            x, y, r = sc.head_center(ic["head"], P[ic["head"]])
            EM.draw(ov, ic["icon"], tl, x, y, r, ic["t0"], ic["t1"], W, **ic.get("kw", {}))
        o = np.array(ov.result(W, H)).astype(np.float32); a = o[..., 3:4] / 255
        fr = (fr * (1 - a) + o[..., 2::-1][..., :3] * a).astype(np.uint8)
    return fr

n_frames = int(round(end_t * FPS))
for fi in range(n_frames):
    t = fi / FPS
    # pick the shot by FRAME INDEX (cut frame = round(start*fps)); float compares were 1 frame late on rounded times
    sh = next((s for s in shots if round(s["start"] * FPS) <= fi < round(s["end"] * FPS)), shots[-1])
    u = (t - sh["start"]) / max(sh["end"] - sh["start"], 1e-6)
    if sh.get("acting"):
        fr = acting_frame(sh, t - sh["start"])
    elif sh["kind"] == "frames":   # directory of rendered PNGs (Blender), one per frame, shot-local numbering from 1
        fl = cache.setdefault(sh["src"] + "#list", sorted(f for f in os.listdir(sh["src"]) if f.endswith(".png")))
        k = min((fi - round(sh["start"] * FPS)) // int(sh.get("step", 1)), len(fl) - 1)   # step>1: preview rendered every Nth frame
        fr = fit(cv2.imread(os.path.join(sh["src"], fl[k])))
    elif sh["kind"] == "still":
        if sh["src"] not in cache: cache[sh["src"]] = fit(cv2.imread(sh["src"]))
        fr = cache[sh["src"]]
    else:
        cap = cache.setdefault(sh["src"], cv2.VideoCapture(sh["src"]))
        cap.set(cv2.CAP_PROP_POS_MSEC, (sh.get("clip_in", 0) + t - sh["start"]) * 1000)
        ok, fr = cap.read()
        if not ok: fr = cache.get(sh["src"] + "#last")
        fr = fit(fr); cache[sh["src"] + "#last"] = fr
    p = sh.get("push", 1.0)
    if p != 1.0:
        e = u * u * (3 - 2 * u)  # ease in-out
        fr = push(fr, 1 + (p - 1) * e)
    ov = caption_layer(t)
    a = ov[..., 3:4] / 255.0
    fr = (fr * (1 - a) + ov[..., 2::-1][..., :3] * a).astype(np.uint8) if ov[..., 3].any() else fr
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait()

# ---- audio: VO (+ optional music bed), loudness normalized to -16.5 LUFS, peak -2 dBTP (reference measured -16.0..-17.3 LUFS)
def measure_i(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="ignore").stderr
    import re
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])

inputs = ["-i", silent, "-i", T["vo"]]
if T.get("music"):
    # bed level RELATIVE to the voice, measured (reference: voice 4-7 dB over the bed); raw gain on an unknown
    # music file would be meaningless (generated beds come in at ~-14 LUFS, louder than the VO)
    mg = measure_i(T["vo"]) - measure_i(T["music"]) + T.get("music_gain_db", -9.5)
    inputs += ["-stream_loop", "-1", "-i", T["music"]]
    flt = (f"[1:a]apad[vo];[2:a]volume={mg:.2f}dB,afade=t=in:d=0.15[m];"
           f"[vo][m]amix=inputs=2:duration=first:normalize=0,afade=t=out:st={max(0, end_t - 0.35):.2f}:d=0.35,"
           f"loudnorm=I=-16.5:TP=-2:LRA=5[a]")
else:
    flt = "[1:a]apad,loudnorm=I=-16.5:TP=-2:LRA=5[a]"
TARGET_I = T.get("target_lufs", -16.5)

def mix(gain_db, out):
    f = flt.replace("[a]", f",volume={gain_db:.2f}dB,alimiter=limit=0.79:level=false[a]") if gain_db else flt
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", f,
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
                    "-t", f"{end_t:.3f}", out], check=True)

mix(0, T["out"])
# second pass: 1-pass loudnorm undershoots on short clips (measured -18.0 vs -16.5) -> correct with static gain + limiter
I = measure_i(T["out"])
if abs(I - TARGET_I) > 0.5:
    mix(TARGET_I - I, T["out"]); I = measure_i(T["out"])
print("wrote", T["out"], f"{end_t:.2f}s", len(PAGES), "caption pages", f"{I:.1f} LUFS")
