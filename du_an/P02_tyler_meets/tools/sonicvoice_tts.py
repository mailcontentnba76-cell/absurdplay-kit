"""sonicvoice_tts — narration VO from an annotated shots.txt via the SonicVoice API (ElevenLabs voices).

Usage: python tools/sonicvoice_tts.py shots.txt out_dir [--voice a4CnuaYbALRvW39mDitg] [--model eleven_v4]
       [--gap 0.75] [--gf-semitones 3] [--stability 0.55] [--speed 1.0] [--gf-voice <voice_id>]
API key: env SONICVOICE_API_KEY or project file .env.sonicvoice (never commit / never put it in skill docs).

Per line: one TTS item (kind=batch -> one file per line, so pauses are ours, not the model's).
[GF] lines: same narrator voice, pitched up (default +3 semitones, ffmpeg rubberband) — the reference narrator
"does her voice" himself (F0 105–190 Hz vs 92 Hz narration, INFERRED). Pauses: --gap between lines
(reference median 0.76–1.18 s), 1.0 s before the last line (punchline), first word at 0.0 s.
Writes out_dir/lines/Lxx.wav, out_dir/vo.wav (44.1 kHz mono), out_dir/vo16k.wav and vo_lines.json (timing per line).
"""
import json, os, re, subprocess, sys, time, requests, soundfile as sf, numpy as np

a = sys.argv[1:]
def opt(k, d): return a[a.index(k) + 1] if k in a else d
shots_p, out = a[0], a[1]
VOICE, MODEL = opt("--voice", "a4CnuaYbALRvW39mDitg"), opt("--model", "eleven_v4")
GAP, GF_ST = float(opt("--gap", 0.75)), float(opt("--gf-semitones", 3))
STAB, SPEED = float(opt("--stability", 0.55)), float(opt("--speed", 1.0))

key = os.environ.get("SONICVOICE_API_KEY")
if not key:
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env.sonicvoice")
    key = open(p).read().split("=", 1)[1].strip()
B, H = "https://sonicvoice.pro/api", {"X-API-Key": key}

lines = []
for raw in open(shots_p, encoding="utf-8"):
    m = re.match(r"(L\d+)\s*\[(\w+)\]\s*(.*?)\s*\|", raw.strip())
    if m: lines.append((m.group(1), m.group(2), m.group(3).replace("/", " ").replace("  ", " ").strip().strip('"')))
os.makedirs(os.path.join(out, "lines"), exist_ok=True)

GF_VOICE = opt("--gf-voice", "r1KmysJdVYZjJCm4mL3b")   # default "Jessica - Playful, Bright, Warm" (user choice 16/11); "--gf-voice none" = old pitched-narrator mode
if GF_VOICE.lower() == "none": GF_VOICE = None
def _get(url, **kw):   # network hiccups (WinError 10054) must not lose a paid job
    for k in range(8):
        try:
            r = requests.get(url, headers=H, timeout=60, **kw); r.raise_for_status(); return r
        except Exception as e:
            print("retry", k + 1, type(e).__name__); time.sleep(3 + 3 * k)
    raise SystemExit(f"giving up on {url}")
REUSE = dict(kv.split("=") for kv in opt("--reuse", "").split(",") if "=" in kv)   # --reuse VOICEID=jobid,... (skip re-billing)
VOPTS = {kv.split("=")[0]: tuple(float(x) for x in kv.split("=")[1].split(":")) for kv in opt("--voice-opts", "").split(",") if "=" in kv}  # SPK=stability:speed
def tts(idx, voice, spk=None):
    if not idx: return {}
    if voice in REUSE:
        job = _get(f"{B}/v1/tts/jobs/{REUSE[voice]}").json(); print("reuse job", job["id"], job["status"])
        return {idx[it["index"]]: it for it in job["items"]}
    body = dict(kind="batch", provider="eleven", model=MODEL, voice_id=voice, language="English",
                texts=[lines[i][2] for i in idx], filenames=[lines[i][0] for i in idx],
                speed=VOPTS.get(spk, (STAB, SPEED))[1], stability=VOPTS.get(spk, (STAB, SPEED))[0],
                similarity_boost=0.75, title=os.path.basename(os.path.dirname(os.path.abspath(shots_p))) + " VO")
    if voice.startswith("uv_"):   # user's cloned voices (Minimax): let the API pick provider/model ("eleven" is refused)
        body.pop("provider"); body.pop("model")
    job = requests.post(f"{B}/v1/tts/jobs", headers=H, json=body).json()
    if "id" not in job: sys.exit(f"SonicVoice error: {job}")
    while job["status"] in ("admitted", "running"):
        time.sleep(2); job = _get(f"{B}/v1/tts/jobs/{job['id']}").json()
    if job["status"] != "succeeded": sys.exit(f"SonicVoice job {job['status']}: {job.get('error')}")
    print("job", job["id"], "voice", voice, "chars", job.get("cost_chars"))
    return {idx[it["index"]]: it for it in job["items"]}
gf_idx = [i for i, l in enumerate(lines) if l[1] == "GF"] if GF_VOICE else []
# --voice-map "KAY=6u6JbqKdaQy89ENzLSju,PRIN=..." : extra speakers with their own voice (others -> narrator voice)
VMAP = dict(kv.split("=") for kv in opt("--voice-map", "").split(",") if "=" in kv)
map_idx = {spk: [i for i, l in enumerate(lines) if l[1] == spk] for spk in VMAP}
used = set(gf_idx) | {i for v in map_idx.values() for i in v}
items = {**tts([i for i in range(len(lines)) if i not in used], VOICE), **tts(gf_idx, GF_VOICE)}
for spk, idx in map_idx.items(): items.update(tts(idx, VMAP[spk], spk))

SR, chunks, timing, t = 44100, [], [], 0.0
for n, (lid, spk, text) in enumerate(lines):
    item = items[n]
    raw = os.path.join(out, "lines", f"{lid}_raw.audio"); wav = os.path.join(out, "lines", f"{lid}.wav")
    r = _get(f"{B}{item['artifact_url']}"); open(raw, "wb").write(r.content)
    af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    if spk == "GF" and GF_ST and not GF_VOICE:
        af = f"rubberband=pitch={2 ** (GF_ST / 12):.4f}:formant=preserved," + af
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", str(SR), wav], check=True)
    y, _ = sf.read(wav)
    rms = np.sqrt(np.mean(y ** 2)) + 1e-9; y = y * (10 ** (-21 / 20) / rms)      # level-match every line to -21 dBFS RMS
    if np.abs(y).max() > 0.95: y = y * 0.95 / np.abs(y).max()
    sf.write(wav, y, SR)
    gap = 0.0 if not chunks else (1.0 if lid == lines[-1][0] else GAP)
    if gap: chunks.append(np.zeros(int(gap * SR))); t += gap
    timing.append(dict(line=lid, speaker=spk, text=text, start=round(t, 3), end=round(t + len(y) / SR, 3)))
    chunks.append(y); t += len(y) / SR
vo = np.concatenate(chunks)
sf.write(os.path.join(out, "vo.wav"), vo, SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "vo.wav"), "-ac", "1", "-ar", "16000", os.path.join(out, "vo16k.wav")], check=True)
json.dump(timing, open(os.path.join(out, "vo_lines.json"), "w", encoding="utf-8"), indent=1)
print(f"vo.wav {t:.2f}s, {len(lines)} lines"); [print(f"  {x['line']} {x['speaker']:4s} {x['start']:6.2f}-{x['end']:6.2f} {x['text']}") for x in timing]
