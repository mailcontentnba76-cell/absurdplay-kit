"""Search the SonicVoice voice catalogue (English). Caches the full list in work/sv_voices_en.json.
python tools/sv_voices.py search "raspy young" [--gender male] [--n 20]
python tools/sv_voices.py refresh            # re-download the catalogue
API key: env SONICVOICE_API_KEY or project file .env.sonicvoice (never print it)."""
import json, os, sys, time, requests
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CACHE = os.path.join(ROOT, "work", "sv_voices_en.json")
def key():
    k = os.environ.get("SONICVOICE_API_KEY")
    return k or open(os.path.join(ROOT, ".env.sonicvoice")).read().split("=", 1)[1].strip()
def refresh():
    H = {"X-API-Key": key()}; allv, off = [], 0
    while True:
        for t in range(4):
            j = requests.get("https://sonicvoice.pro/api/v1/voices", headers=H, params={"language": "en", "limit": 100, "offset": off}, timeout=120).json()
            if "items" in j: break
            time.sleep(3)
        it = j.get("items", [])
        if not it: break
        allv += it; off += len(it)
        if off >= j.get("total", 0): break
    os.makedirs(os.path.dirname(CACHE), exist_ok=True); json.dump(allv, open(CACHE, "w", encoding="utf-8")); print(len(allv), "voices cached")
a = sys.argv[1:]
if not a or a[0] == "refresh" or not os.path.exists(CACHE): refresh()
if a and a[0] == "search":
    words = a[1].lower().split(); g = a[a.index("--gender") + 1] if "--gender" in a else None; n = int(a[a.index("--n") + 1]) if "--n" in a else 20
    V = json.load(open(CACHE, encoding="utf-8")); k = 0
    for v in V:
        t = (v["name"] + " " + (v.get("description") or "") + " " + str(v.get("style")) + " " + str(v.get("use_case"))).lower()
        if g and v.get("gender") != g: continue
        if all(w in t for w in words):
            print(v["id"], "|", v["name"], "|", v.get("gender"), v.get("accent"), "|", (v.get("description") or "")[:120].replace("\n", " ")); k += 1
            if k >= n: break
