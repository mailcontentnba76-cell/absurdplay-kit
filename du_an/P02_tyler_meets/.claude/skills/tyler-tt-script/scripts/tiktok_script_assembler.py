#!/usr/bin/env python3
"""
Tyler meets... (Westbrook High) TikTok Script Assembler — tyler-tt-script v1.0
Derived from tiktok-script-all-in-one BASE_RAW v4.0 via ADAPT_SKILLS (22/11/2026).
profile_id = tyler-meets-westbrook (rev 1). Channel gates added on top of the 8 base subcommands:
  - dialogue_scenes with a fixed cast registry (--cast): TYLER = narrator "I"; <=3 students + <=1 adult with lines
  - P01: cold open by a non-TYLER speaker, then exactly "TYLER: What the fuck is wrong with this dude?",
         then "This is <Name>." starting before 9.0 s
  - side-character lines <= 8 words; final part must break Tyler's sandwich; 3-clause closer check
  - spoken duration band 68-77 s (owner-locked) on top of the Creator Rewards fast-rate floor 62.0 s
  - per-part kit shot sidecar PARTS/P0k.shots ("beat / beat | KEY_1 / KEY_2", lossless vs. spoken text)
  - kit-export: writes episodes/<ID>/shots.txt in the exact format of tools/sonicvoice_tts.py + tools/plan_shots.py

Subcommands:
1) twin-seo-check : Audits candidate hooks/premises/captions against competitor & own past TikToks for Twin clone risk,
                    TikTok Search SEO keyword coverage, and FYP-throttled sensitive words.
2) init           : Initializes sequential multi-part writing state (TIKTOK_SCRIPT_STATE_V1) across 5 tracks:
                    - creator_rewards (1m05s-2m30s+, >=2 parts, enforces fast-rate >=62.0s above TikTok's 60s cliff)
                    - viral_short     (35-55s standalone loop, 1-2 parts, enforces slow-rate <=59.0s)
                    - serial_sub60    (35-55s Pre-10K Part 1/Part 2, 1-2 parts, enforces slow-rate <=59.0s)
                    - true_story      (30-180s first-person true story, enforces Anti-Fabrication & Natural Speech)
                    - extended_story  (3m00s-10m00s deep story/documentary, >=4 parts)
3) verify-part    : Enforces sequential P01..P0N verification, UTF-8 no-BOM, zero TTS emotion tags,
                    zero unresolved [GUESS]/[GỢI-Ý]/[CẦN HỎI] tags, natural-speech filter, and budget discipline.
4) opening-audit  : Audits 0-3s / 3-15s / 15-30s FYP windows for Beat-1 punch, sentence length, Frame-0 Safe-Zone text,
                    and 0-30s numeric/clock/scale anchors requiring 9:16 full-bleed visual contiguity or Data Cards.
5) beat-audit     : Audits spoken beat pacing (0 dead air >3s, beats exceeding max_beat_sec).
6) stitch-draft   : Stitches passed parts, exports P0k->P0(k+1) + FINAL->0.0s_LOOP seam anchors, and runs audits.
7) lock-export    : Verifies 100% lossless spoken token roundtrip + 60s cliff safety and exports matching 4-file bundle:
                    01-TT-SCRIPT, 02-TT-VOICE, 03-TT-TIMELINE.csv (for D+3/D+7 retention autopsy), 04-TT-MANIFEST.json.
9) kit-export     : Writes the Blender kit shots.txt (Lxx [TAG] beat / beat | KEY / KEY) from verified parts + sidecars.
8) fyp-diagnose   : Calculates Pre-10K follower sprint vs Post-10K Creator Rewards RPM math, 48h geo/IP data hygiene,
                    D+7 shrinkage effect n/(n+5), and two-arm statistical sample power.
"""

import argparse
import csv
import hashlib
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

FORBIDDEN_TAG_RE = re.compile(
    r"\[(sigh|laugh|gasp|whisper|pause|reset|cough|chuckle|cry|sob|breath|inhale|exhale|music|sfx)[^\]]*\]",
    re.IGNORECASE,
)
FORBIDDEN_PROSE_MARKERS_RE = re.compile(
    r"(https?://|\[HOOK[^\]]*\]|\[RE-HOOK[^\]]*\]|\[LOOP[^\]]*\]|\[CTA[^\]]*\]|\[SCENE[^\]]*\]|\[VISUAL[^\]]*\]|\[B-ROLL[^\]]*\]|\[DATA_CARD[^\]]*\])",
    re.IGNORECASE,
)
UNRESOLVED_EPISTEMIC_RE = re.compile(
    r"\[(GUESS|GỢI-Ý|GOI-Y|SUGGESTED_UNCONFIRMED|CẦN HỎI|CAN_HOI|NEEDS_CHECK)(?::[^\]]*)?\]",
    re.IGNORECASE,
)
AI_ESE_PUNCT_RE = re.compile(r"(—|→)")
SPEAKER_PREFIX_RE = re.compile(r"^([A-ZÀ-Ỹ0-9_][A-ZÀ-Ỹ0-9_ \-]{0,28}):\s+(.+)$")
CJK_CHAR_RE = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]")
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?。！？])\s+")
NUMBER_OR_CLOCK_RE = re.compile(
    r"\b(\d{1,2}:\d{2}|\d+(?:[.,]\d+)?%?)\b",
    re.UNICODE,
)

# Common FYP-throttled / policy-sensitive trigger words to rewrite naturally in spoken/on-screen copy
FYP_THROTTLE_WATCHLIST = {
    "tự tử": "nghĩ quẩn / bế tắc cùng cực",
    "giết": "đoạt mạng / hạ gục",
    "chết chóc": "thiệt mạng / mất mát",
    "lừa đảo": "bẫy tiền / chiêu trò",
    "cờ bạc": "đỏ đen",
    "suicide": "self-harm crisis / rock bottom",
    "kill yourself": "end it all",
    "scam": "money trap / shady scheme",
    "porn": "explicit content",
}


FYP_THROTTLE_WATCHLIST.update({
    # school-safety words that can limit a teen-school video (rewrite; never needed for this comedy)
    "gun": "rewrite (no weapons in school stories)",
    "shooting": "rewrite (no weapons in school stories)",
    "vape": "rewrite (no substances)",
    "drugs": "rewrite (no substances)",
    "blood": "rewrite (cartoon bonk, no injuries)",
})

# ---- Channel profile (TIKTOK_NICHE_PROFILE: tyler-meets-westbrook) ----
PROFILE_ID = "tyler-meets-westbrook"
PROFILE_REVISION = 1
BASE_VERSIONS = "tiktok-script-all-in-one@4.0 -> tyler-tt-script@1.0"
NARRATOR = "TYLER"
WTF_LINE = "What the fuck is wrong with this dude?"   # OWNER_LOCKED 19/11/2026
THIS_IS_RE = re.compile(r"\bThis is [A-Z][A-Za-z\-']+\.")
THIS_IS_MAX_START_SEC = 9.0                           # "This is <Name>." within ~8 s (qa_checklist)
SIDE_LINE_MAX_WORDS = 8                                # OWNER_LOCKED (CAST_BIBLE): supporting roles
STAR_LINE_MAX_WORDS = 12                               # episode character (approved TMG01 cold open = 9 words)
MAX_STUDENTS_WITH_LINES = 3
MAX_ADULTS_WITH_LINES = 1
CHANNEL_SPOKEN_BAND_SEC = (68.0, 77.0)                 # OWNER_LOCKED: voice 68-77 s
RUNNING_GAG_RE = re.compile(r"\bsandwich\b", re.IGNORECASE)
KIT_KEY_RE = re.compile(r"^(OPEN|CU|MS|WIDE|INS|OTS|TWO_SHOT|POV)_[A-Z0-9_]+$")
KIT_MIN_SHOT_SEC = 0.9                                 # tools/plan_shots.py MIN_SHOT
KIT_TTS_GAP_SEC = 0.45                                 # sonicvoice_tts --gap used by the series


def parse_cast(spec: str) -> dict:
    """'TYLER=NARR:narrator,ELIJAH=ELI:student,MS_PARK=ART:adult' -> {SPEAKER: {tag, role}}"""
    cast = {}
    for item in [x.strip() for x in (spec or "").split(",") if x.strip()]:
        if "=" not in item:
            sys.exit(f"[CAST ERROR] '{item}' must look like SPEAKER=TAG:role")
        spk, rest = item.split("=", 1)
        tag, _, role = rest.partition(":")
        role = role or "student"
        if role not in ("narrator", "star", "student", "adult", "crowd"):
            sys.exit(f"[CAST ERROR] role '{role}' must be narrator|star|student|adult|crowd")
        if not re.match(r"^[A-Z][A-Z0-9_]*$", spk.strip()) or not re.match(r"^\w+$", tag.strip()):
            sys.exit(f"[CAST ERROR] bad speaker/tag in '{item}'")
        cast[spk.strip()] = {"tag": tag.strip(), "role": role}
    if NARRATOR not in cast or cast[NARRATOR]["role"] != "narrator":
        sys.exit(f"[CAST ERROR] {NARRATOR} must be in --cast with role narrator (e.g. TYLER=NARR:narrator)")
    if sum(1 for v in cast.values() if v["role"] == "star") > 1:
        sys.exit("[CAST ERROR] only one star (episode character) per episode")
    students = [k for k, v in cast.items() if v["role"] in ("student", "star")]
    adults = [k for k, v in cast.items() if v["role"] == "adult"]
    if len(students) > MAX_STUDENTS_WITH_LINES or len(adults) > MAX_ADULTS_WITH_LINES:
        # CAST_BIBLE rule; approved TMG01 had 3 adults with lines, so this is a warning, not a blocker
        print(
            f"[CAST WARN] CAST_BIBLE prefers <= {MAX_STUDENTS_WITH_LINES} students + {MAX_ADULTS_WITH_LINES} adult with lines "
            f"(got students={students}, adults={adults})"
        )
    return cast


def sidecar_path(part_file: Path) -> Path:
    return Path(part_file).with_suffix(".shots")


def load_shot_sidecar(part_file: Path, spoken_chunks: list[str]) -> list[tuple[list[str], list[str]]]:
    """Returns [(beat_texts, keys)] per spoken chunk; blocks on any mismatch with the verified prose."""
    sc = sidecar_path(part_file)
    if not sc.exists():
        sys.exit(f"[KIT BLOCKER] Missing shot sidecar {sc} (one line per spoken chunk: 'beat / beat | KEY / KEY').")
    lines = [ln.strip() for ln in sc.read_text(encoding="utf-8").splitlines() if ln.strip() and not ln.startswith("#")]
    if len(lines) != len(spoken_chunks):
        sys.exit(f"[KIT BLOCKER] {sc.name}: {len(lines)} lines but part has {len(spoken_chunks)} spoken chunks.")
    out = []
    for i, (ln, spoken) in enumerate(zip(lines, spoken_chunks), start=1):
        if "|" not in ln:
            sys.exit(f"[KIT BLOCKER] {sc.name} line {i}: missing '| KEYS'.")
        text, keys = [x.strip() for x in ln.rsplit("|", 1)]
        beats = [b.strip() for b in text.split(" / ")]
        if " ".join(beats).split() != spoken.split():
            sys.exit(f"[KIT BLOCKER] {sc.name} line {i}: beat text differs from spoken prose.\n  shots : {text}\n  prose : {spoken}")
        ks = [k.strip() for k in keys.split("/")]
        if len(ks) == 1:
            ks = ks * len(beats)
        if len(ks) != len(beats):
            sys.exit(f"[KIT BLOCKER] {sc.name} line {i}: {len(beats)} beats but {len(ks)} keys.")
        bad = [k for k in ks if not KIT_KEY_RE.match(k)]
        if bad:
            sys.exit(f"[KIT BLOCKER] {sc.name} line {i}: keys {bad} must match {KIT_KEY_RE.pattern}")
        out.append((beats, ks))
    return out


def channel_part_checks(state: dict, pid: str, parsed: list, raw_chunks: list[str], prior_units: int) -> list[str]:
    """Hard channel gates for one part. Returns non-blocking warnings."""
    warnings = []
    cast = state.get("cast") or {}
    if state.get("mode") != "dialogue_scenes" or not cast:
        return warnings
    rc = state["rate_spec"]["rate_center_upm"]
    for raw, (spk, _, spoken) in zip(raw_chunks, parsed):
        if not SPEAKER_PREFIX_RE.match(raw):
            sys.exit(f"[CHANNEL BLOCKER] {pid}: every chunk needs 'SPEAKER: line' -> '{raw[:60]}'")
        if spk not in cast:
            sys.exit(f"[CHANNEL BLOCKER] {pid}: speaker {spk} not in cast {sorted(cast)}")
        limit = STAR_LINE_MAX_WORDS if cast[spk]["role"] == "star" else SIDE_LINE_MAX_WORDS
        if spk != NARRATOR and count_units(spoken, "words") > limit:
            sys.exit(f"[CHANNEL BLOCKER] {pid}: {spk} ({cast[spk]['role']}) line has >{limit} words -> '{spoken}'")
        if re.search(r"\d", spoken):
            sys.exit(f"[CHANNEL BLOCKER] {pid}: digits in spoken text '{spoken[:60]}'; spell numbers for TTS (fix captions later).")
    if pid == "P01":
        if parsed[0][0] == NARRATOR:
            sys.exit("[CHANNEL BLOCKER] P01 must open cold with the episode character (or crowd), not TYLER.")
        if len(parsed) < 2 or parsed[1][0] != NARRATOR or parsed[1][2] != WTF_LINE:
            sys.exit(f"[CHANNEL BLOCKER] P01 chunk 2 must be exactly 'TYLER: {WTF_LINE}'")
        t = 0.0
        found = None
        for spk, _, spoken in parsed:
            m = THIS_IS_RE.search(spoken) if spk == NARRATOR else None
            if m:
                found = t + count_units(spoken[: m.start()], "words") / rc * 60.0
                break
            t += count_units(spoken, "words") / rc * 60.0   # rate is MEASURED incl. 0.45 s gaps
        if found is None or found > THIS_IS_MAX_START_SEC:
            sys.exit(f"[CHANNEL BLOCKER] P01 needs TYLER 'This is <Name>.' starting <= {THIS_IS_MAX_START_SEC}s (got {found}).")
    if pid == f"P{state['parts_expected']:02d}":
        if not any(RUNNING_GAG_RE.search(sp) for _, _, sp in parsed):
            sys.exit("[CHANNEL BLOCKER] Final part must pay off the running gag (Tyler's sandwich gets wrecked).")
        last_narr = [sp for spk, _, sp in parsed if spk == NARRATOR]
        if not last_narr or len(split_sentences(last_narr[-1])) < 3:
            warnings.append("Closer: last TYLER line should be a 3-clause punchline (3 short sentences).")
    return warnings


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_lf_utf8(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n").strip()


def count_units(text: str, unit_mode: str) -> int:
    if unit_mode == "non_space_chars":
        return len(re.sub(r"\s+", "", text))
    return len(re.findall(r"\S+", text, flags=re.UNICODE))


def tokenize_text(text: str, lang_mode: str = "auto") -> set[str]:
    cleaned = text.lower().strip()
    use_cjk = lang_mode == "cjk" or (lang_mode == "auto" and bool(CJK_CHAR_RE.search(cleaned)))
    if use_cjk:
        chars = re.sub(r"[\s\W_]+", "", cleaned, flags=re.UNICODE)
        if len(chars) <= 1:
            return {chars} if chars else set()
        bigrams = {chars[i : i + 2] for i in range(len(chars) - 1)}
        latin_nums = set(re.findall(r"[a-z0-9]+", cleaned))
        return bigrams | latin_nums
    return set(re.findall(r"[^\W_]+", cleaned, flags=re.UNICODE))


def jaccard_similarity(set_a: set[str], set_b: set[str]) -> float:
    if not set_a or not set_b:
        return 0.0
    union = set_a | set_b
    return len(set_a & set_b) / len(union) if union else 0.0


def scan_throttled_words(text: str) -> list[dict]:
    lowered = text.lower()
    hits = []
    for term, replacement in FYP_THROTTLE_WATCHLIST.items():
        if re.search(r"\b" + re.escape(term) + r"\b", lowered, flags=re.UNICODE):
            hits.append({"flagged_term": term, "safer_natural_alternative": replacement})
    return hits


def split_raw_chunks(part_text: str) -> list[str]:
    raw = normalize_lf_utf8(part_text)
    if "|" in raw:
        pieces = [re.sub(r"\s+", " ", p).strip() for p in raw.split("|")]
    else:
        pieces = [re.sub(r"\s+", " ", p).strip() for p in raw.split("\n") if p.strip()]
    return [p for p in pieces if p]


def parse_chunk_mode(chunk: str, mode: str) -> tuple[str, str, str]:
    if mode == "dialogue_scenes":
        m = SPEAKER_PREFIX_RE.match(chunk)
        if m:
            spk = m.group(1).strip()
            spoken = m.group(2).strip()
            return spk, f"{spk}: {spoken}", spoken
    return "NARRATOR", chunk, chunk


def split_sentences(text: str) -> list[str]:
    return [s.strip() for s in SENTENCE_SPLIT_RE.split(text.strip()) if s.strip()]


def fyp_window_bucket(start_sec: float) -> str:
    if start_sec < 3.0:
        return "00_03s_FRAME0_SWIPE_GATE"
    if start_sec < 15.0:
        return "03_15s_PREMISE_ANCHOR"
    if start_sec < 30.0:
        return "15_30s_ESCALATION_ZONE"
    if start_sec < 60.0:
        return "30_60s_CLIFF_BRIDGE"
    return "60s_PLUS_REWARDS_ZONE"


def analyze_beats(
    spoken_chunks: list[str],
    unit_mode: str,
    rc: float,
    non_speech_sec: float,
    max_beat_sec: float,
) -> dict:
    beat_secs = [round(count_units(c, unit_mode) / rc * 60.0, 2) for c in spoken_chunks]
    spoken_total_sec = sum(beat_secs)
    total_est_sec = spoken_total_sec + non_speech_sec
    over_max = [
        {"beat_id": f"b{idx:03d}", "est_seconds": sec, "preview": spoken_chunks[idx - 1][:80]}
        for idx, sec in enumerate(beat_secs, start=1)
        if sec > max_beat_sec
    ]
    beats_per_10s = round((len(spoken_chunks) / total_est_sec * 10.0), 2) if total_est_sec > 0 else 0.0
    return {
        "total_beats": len(spoken_chunks),
        "first_beat_est_sec": beat_secs[0] if beat_secs else 0.0,
        "max_single_beat_est_sec": max(beat_secs) if beat_secs else 0.0,
        "avg_beat_est_sec": round(spoken_total_sec / len(beat_secs), 2) if beat_secs else 0.0,
        "spoken_beats_per_10s": beats_per_10s,
        "max_beat_threshold_sec": max_beat_sec,
        "beats_exceeding_threshold": over_max,
    }


def analyze_opening_fyp(
    spoken_chunks: list[str],
    unit_mode: str,
    rc: float,
    max_open_sentence_units: int,
    frame0_text: str | None,
) -> dict:
    cum_sec = 0.0
    text_0_15 = []
    text_0_30 = []
    beats_0_3 = 0
    beats_3_15 = 0
    beats_15_30 = 0
    first_beat_sec = 0.0

    for idx, chunk in enumerate(spoken_chunks):
        u = count_units(chunk, unit_mode)
        dur = (u / rc * 60.0) if rc > 0 else 0.0
        if idx == 0:
            first_beat_sec = round(dur, 2)
        start = cum_sec
        cum_sec += dur
        if start < 3.0:
            beats_0_3 += 1
        elif start < 15.0:
            beats_3_15 += 1
        elif start < 30.0:
            beats_15_30 += 1

        if start < 15.0:
            text_0_15.append(chunk)
        if start < 30.0:
            text_0_30.append(chunk)

    joined_15 = " ".join(text_0_15)
    joined_30 = " ".join(text_0_30)
    sents_15 = split_sentences(joined_15)
    sent_lengths = [count_units(s, unit_mode) for s in sents_15]
    long_sentences = [
        {"units": count_units(s, unit_mode), "sentence": s[:120]}
        for s in sents_15
        if count_units(s, unit_mode) > max_open_sentence_units
    ]

    has_question_or_curiosity_30s = ("?" in joined_30) or ("？" in joined_30)
    contiguity_anchors_30s = sorted(set(m.group(0) for m in NUMBER_OR_CLOCK_RE.finditer(joined_30)))
    throttled_hits_30s = scan_throttled_words(joined_30)

    frame0_clean = (frame0_text or "").strip()
    frame0_lines = [ln.strip() for ln in frame0_clean.splitlines() if ln.strip()] if frame0_clean else []
    frame0_status = "MISSING_SET_FRAME0_SAFEZONE_TEXT"
    if frame0_clean:
        if len(frame0_lines) <= 2 and count_units(frame0_clean, "words") <= 11:
            frame0_status = "PASS_SAFEZONE_MAX_2_LINES"
        else:
            frame0_status = "WARN_TOO_LONG_FOR_9X16_SAFEZONE"

    warnings = []
    if first_beat_sec > 4.5:
        warnings.append(f"Beat 1 is {first_beat_sec:.2f}s (>4.5s); split so Spoken Hook lands within 0-3.5s.")
    if long_sentences:
        warnings.append(
            f"{len(long_sentences)} sentence(s) in first 15s exceed {max_open_sentence_units} {unit_mode}; tighten for phone audio."
        )
    if frame0_status != "PASS_SAFEZONE_MAX_2_LINES":
        warnings.append(f"Frame-0 Safe-Zone overlay status: {frame0_status}.")
    if throttled_hits_30s:
        warnings.append(f"FYP throttle watchlist term(s) in first 30s: {throttled_hits_30s}")

    return {
        "first_beat_est_sec": first_beat_sec,
        "beats_in_windows": {
            "0_3s_swipe_gate": beats_0_3,
            "3_15s_premise": beats_3_15,
            "15_30s_escalation": beats_15_30,
        },
        "sentences_in_0_15s": len(sents_15),
        "avg_sentence_units_0_15s": round(sum(sent_lengths) / len(sent_lengths), 2) if sent_lengths else 0.0,
        "max_sentence_units_0_15s": max(sent_lengths) if sent_lengths else 0,
        "max_open_sentence_threshold": max_open_sentence_units,
        "long_sentences_0_15s": long_sentences,
        "question_in_0_30s": has_question_or_curiosity_30s,
        "contiguity_numeric_or_clock_anchors_0_30s": contiguity_anchors_30s,
        "fyp_throttle_watchlist_hits_0_30s": throttled_hits_30s,
        "frame0_safezone_text": frame0_clean or None,
        "frame0_safezone_status": frame0_status,
        "warnings": warnings,
    }


def cmd_twin_seo_check(args):
    candidates = [c for c in (args.candidate or []) if c.strip()]
    competitors = [r for r in (args.competitor or []) if r.strip()]
    own_past = [o for o in (args.own_past or []) if o.strip()]
    if args.own_past_file:
        own_past += [
            ln.split("|", 1)[-1].strip()
            for ln in Path(args.own_past_file).read_text(encoding="utf-8").splitlines()
            if ln.strip() and not ln.startswith("#")
        ]
    seo_keywords = [k.strip() for k in (args.seo_keywords or "").split(",") if k.strip()]

    if not candidates:
        sys.exit("[ERROR] Provide at least one --candidate hook/premise.")

    comp_sets = [(r, tokenize_text(r, args.lang)) for r in competitors]
    own_sets = [(o, tokenize_text(o, args.lang)) for o in own_past]
    seo_sets = [(kw, tokenize_text(kw, args.lang)) for kw in seo_keywords]

    results = []
    for cand in candidates:
        c_set = tokenize_text(cand, args.lang)
        max_comp_j = 0.0
        closest_comp = None
        for r_raw, r_set in comp_sets:
            j = round(jaccard_similarity(c_set, r_set), 4)
            if j > max_comp_j:
                max_comp_j = j
                closest_comp = r_raw

        max_own_j = 0.0
        closest_own = None
        for o_raw, o_set in own_sets:
            j = round(jaccard_similarity(c_set, o_set), 4)
            if j > max_own_j:
                max_own_j = j
                closest_own = o_raw

        max_j = max(max_comp_j, max_own_j)
        if max_j > 0.55:
            twin_verdict = "HIGH_TWIN_CLONE_RISK (>0.55 — change Stage, Escalation Ladder, or Twist!)"
        elif max_j >= 0.30:
            twin_verdict = "MODERATE_FAMILIAR_ANCHOR (0.30-0.55 — verify 5-Axis Twin score <= 2/5)"
        else:
            twin_verdict = "CLEAR_DISTINCT_WORDING (<0.30)"

        matched_seo = [kw for kw, kw_set in seo_sets if kw_set and kw_set.issubset(c_set)]
        missing_seo = [kw for kw, kw_set in seo_sets if kw_set and not kw_set.issubset(c_set)]
        throttle_hits = scan_throttled_words(cand)

        results.append(
            {
                "candidate": cand,
                "max_competitor_jaccard": max_comp_j,
                "closest_competitor": closest_comp,
                "max_own_past_jaccard": max_own_j,
                "closest_own_past": closest_own,
                "lexical_twin_verdict": twin_verdict,
                "tiktok_search_seo_matched": matched_seo,
                "tiktok_search_seo_missing": missing_seo,
                "fyp_throttle_watchlist_hits": throttle_hits,
            }
        )

    five_axis = []
    for spec in args.five_axis or []:
        # LABEL=Q,S,L,P,K  (0 / 0.5 / 1 per axis: Question, Stage, Ladder, Payoff, Look)
        label, _, vals = spec.partition("=")
        q, st, la, pa, lo = [float(v) for v in vals.split(",")]
        total = q + st + la + pa + lo
        blocker = total >= 3.0 or (q >= 1.0 and pa >= 1.0)
        five_axis.append({
            "against": label, "question": q, "stage": st, "ladder": la, "payoff": pa, "look": lo,
            "total_of_5": total, "verdict": "TWIN [BLOCKER]" if blocker else ("NEAR (<=2/5, watch)" if total >= 1.5 else "CLEAR"),
        })
    payload = {"lang_mode": args.lang, "profile_id": PROFILE_ID, "candidates": results, "five_axis_twin_check": five_axis}
    if args.json_out:
        Path(args.json_out).write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    for fa in five_axis:
        print(f"[5-AXIS] vs {fa['against']}: Q{fa['question']} S{fa['stage']} L{fa['ladder']} P{fa['payoff']} K{fa['look']} "
              f"= {fa['total_of_5']}/5 -> {fa['verdict']}")
    if any(fa["verdict"].startswith("TWIN") for fa in five_axis):
        print("[5-AXIS] TWIN BLOCKER: change Stage, Ladder or Payoff (not just wording).")
    for r in results:
        print(
            f"[TT TWIN-SEO] '{r['candidate']}' -> MaxCompSim={r['max_competitor_jaccard']:.3f} | "
            f"Verdict={r['lexical_twin_verdict']} | SEOMatched={r['tiktok_search_seo_matched']} | "
            f"ThrottleHits={len(r['fyp_throttle_watchlist_hits'])}"
        )


def cmd_init(args):
    ws = Path(args.workspace)
    (ws / "PARTS").mkdir(parents=True, exist_ok=True)
    budgets = [int(x) for x in args.part_budgets.split(",") if x.strip()]
    if not budgets:
        sys.exit("[BLOCKER] --part-budgets must contain at least 1 positive integer.")

    if args.track == "creator_rewards" and len(budgets) < 2 and not args.allow_exception:
        sys.exit(
            "[ANTI-SINGLE-SHOT BLOCKER] Track 'creator_rewards' (1m05s-2m30s+) requires >= 2 modular parts "
            "(recommended 3-4 parts P01..P04) to prevent single-shot quality drop."
        )
    if args.track == "extended_story" and len(budgets) < 4 and not args.allow_exception:
        sys.exit("[ANTI-SINGLE-SHOT BLOCKER] Track 'extended_story' (3m-10m) requires >= 4 modular parts.")

    total_budget = sum(budgets)
    rc = float(args.rate)
    rmin = float(args.rate_min)
    rmax = float(args.rate_max)
    non_speech = max(0.0, float(args.non_speech_sec))

    spoken_center_sec = total_budget / rc * 60.0
    spoken_fast_sec = total_budget / rmax * 60.0
    spoken_slow_sec = total_budget / rmin * 60.0

    est_center_sec = spoken_center_sec + non_speech
    est_fast_sec = spoken_fast_sec + non_speech
    est_slow_sec = spoken_slow_sec + non_speech

    if args.track == "creator_rewards" and est_fast_sec < 62.0 and not args.allow_exception:
        sys.exit(
            f"[MONETIZATION BLOCKER] Track 'creator_rewards' requires fast-rate total duration >= 62.0s "
            f"(target >= 65.0s above TikTok's 60.0s cliff), but budget={total_budget} at r_max={rmax}/min "
            f"+ non_speech={non_speech:.1f}s yields only {est_fast_sec:.1f}s!"
        )
    if args.track in ("viral_short", "serial_sub60") and est_slow_sec > 59.0 and not args.allow_exception:
        sys.exit(
            f"[DURATION BLOCKER] Track '{args.track}' targets <60s, but budget={total_budget} at r_min={rmin}/min "
            f"+ non_speech={non_speech:.1f}s reaches {est_slow_sec:.1f}s."
        )
    if args.track == "true_story" and est_slow_sec > 178.0 and not args.allow_exception:
        sys.exit(f"[DURATION BLOCKER] Track 'true_story' slow-rate estimate {est_slow_sec:.1f}s exceeds 178s cap.")

    default_max_sent = 32 if args.count_unit == "non_space_chars" else 20
    max_open_sent = int(args.max_open_sentence_units) if args.max_open_sentence_units else default_max_sent

    parts_registry = {}
    for idx, b in enumerate(budgets, start=1):
        pid = f"P{idx:02d}"
        parts_registry[pid] = {
            "part_id": pid,
            "budget_units": b,
            "revision": 0,
            "file": None,
            "status": "PENDING",
            "actual_units": 0,
            "chunk_count": 0,
            "sha256": None,
            "first_sentence": None,
            "last_sentence": None,
        }

    cast = parse_cast(args.cast) if args.cast else {}
    if args.mode == "dialogue_scenes" and not cast:
        sys.exit("[CHANNEL BLOCKER] dialogue_scenes needs --cast (TYLER=NARR:narrator,...)")
    lo, hi = CHANNEL_SPOKEN_BAND_SEC
    if not (lo <= est_center_sec <= hi) and not args.allow_exception:
        sys.exit(f"[CHANNEL BLOCKER] center estimate {est_center_sec:.1f}s outside owner band {lo:.0f}-{hi:.0f}s; re-budget parts.")

    state = {
        "schema": "TIKTOK_SCRIPT_STATE_V1",
        "assembler_version": "tyler-tt-script@1.0 (base 4.0)",
        "profile_id": PROFILE_ID,
        "profile_revision": PROFILE_REVISION,
        "base_versions": BASE_VERSIONS,
        "cast": cast,
        "kit_episode_id": args.kit_episode_id,
        "topic_id": args.topic_id,
        "slug": args.slug,
        "track": args.track,
        "mode": args.mode,
        "count_unit": args.count_unit,
        "clean_tts": bool(args.clean_tts),
        "strict_natural_speech": bool(args.strict_natural_speech) or (args.track == "true_story"),
        "max_beat_sec": float(args.max_beat_sec),
        "max_open_sentence_units": max_open_sent,
        "frame0_text": args.frame0_text,
        "blueprint_version": 1,
        "script_version": 1,
        "current_workflow": "WF03_BLUEPRINT_LOCKED",
        "state": "BLUEPRINT_LOCKED",
        "rate_spec": {
            "rate_center_upm": rc,
            "rate_min_upm": rmin,
            "rate_max_upm": rmax,
            "rate_basis": args.rate_basis,
            "total_unit_budget": total_budget,
            "non_speech_budget_seconds": round(non_speech, 1),
            "planned_spoken_center_seconds": round(spoken_center_sec, 1),
            "planned_center_seconds": round(est_center_sec, 1),
            "planned_range_seconds": [round(est_fast_sec, 1), round(est_slow_sec, 1)],
        },
        "parts_expected": len(budgets),
        "parts_delivered": 0,
        "next_part": "P01",
        "parts_registry": parts_registry,
        "cumulative_units": 0,
        "cumulative_chunks": 0,
        "last_delivered_boundary": None,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        f"[TT INIT OK] {state_path} | Track={args.track} | Mode={args.mode} | Parts={len(budgets)} | "
        f"Budget={total_budget} {args.count_unit} + NonSpeech={non_speech:.1f}s "
        f"(~{est_center_sec:.1f}s, range {est_fast_sec:.1f}-{est_slow_sec:.1f}s)"
    )


def cmd_verify_part(args):
    ws = Path(args.workspace)
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    pid = args.part_id.upper()
    if pid not in state["parts_registry"]:
        sys.exit(f"[ERROR] Unknown part_id {pid}")

    idx = int(pid[1:])
    if idx > 1:
        prev_pid = f"P{idx - 1:02d}"
        if state["parts_registry"][prev_pid]["status"] != "SECTION_PASSED":
            sys.exit(f"[BLOCKER] Sequential discipline: cannot verify {pid} before {prev_pid} reaches SECTION_PASSED!")

    part_file = Path(args.file)
    raw_bytes = part_file.read_bytes()
    if raw_bytes.startswith(b"\xef\xbb\xbf"):
        sys.exit(f"[BLOCKER] {part_file} contains UTF-8 BOM; save without BOM.")
    text = raw_bytes.decode("utf-8")

    if state.get("clean_tts", True):
        bad_tag = FORBIDDEN_TAG_RE.search(text)
        if bad_tag:
            sys.exit(f"[BLOCKER] Forbidden TTS emotion/SFX tag found in {pid}: {bad_tag.group(0)}")

    bad_marker = FORBIDDEN_PROSE_MARKERS_RE.search(text)
    if bad_marker:
        sys.exit(f"[BLOCKER] Technical marker/URL leaked into spoken prose of {pid}: {bad_marker.group(0)}")

    if not args.allow_guess:
        bad_epistemic = UNRESOLVED_EPISTEMIC_RE.search(text)
        if bad_epistemic:
            sys.exit(
                f"[ANTI-FABRICATION BLOCKER] Unresolved tag {bad_epistemic.group(0)} leaked into {pid}; "
                "confirm with user/source or hedge honestly before passing."
            )

    if state.get("strict_natural_speech") and not args.allow_ai_punct:
        bad_punct = AI_ESE_PUNCT_RE.search(text)
        if bad_punct:
            sys.exit(
                f"[NATURAL SPEECH BLOCKER] AI-ese punctuation '{bad_punct.group(0)}' detected in {pid}; "
                "rewrite as natural spoken phrases."
            )

    mode = state.get("mode", "clean_voiceover")
    if mode == "clean_voiceover":
        if re.search(r"^(PART\s+\d+|PHẦN\s+\d+|SECTION\s+\d+)\b", normalize_lf_utf8(text), re.IGNORECASE | re.MULTILINE):
            sys.exit(f"[BLOCKER] Section header leaked into clean spoken prose of {pid}.")

    raw_chunks = split_raw_chunks(text)
    if not raw_chunks:
        sys.exit(f"[BLOCKER] {pid} contains 0 spoken beats.")

    parsed = [parse_chunk_mode(c, mode) for c in raw_chunks]
    spoken_chunks = [p[2] for p in parsed]

    prior_units = sum(
        state["parts_registry"][f"P{k:02d}"]["actual_units"] for k in range(1, idx)
    )
    channel_warnings = channel_part_checks(state, pid, parsed, raw_chunks, prior_units)
    throttle = scan_throttled_words(" ".join(spoken_chunks))
    if throttle:
        sys.exit(f"[FYP WATCHLIST BLOCKER] {pid}: {throttle}")
    if state.get("kit_shots_required", True):
        load_shot_sidecar(part_file, spoken_chunks)

    unit_mode = state["count_unit"]
    actual_units = count_units(" ".join(spoken_chunks), unit_mode)
    budget = state["parts_registry"][pid]["budget_units"]
    deviation_pct = ((actual_units - budget) / budget * 100.0) if budget else 0.0
    if abs(deviation_pct) > 22.0 and not args.allow_deviation:
        sys.exit(
            f"[NEEDS_REPAIR] {pid} spoken_units={actual_units} deviates {deviation_pct:+.1f}% from budget={budget}. "
            "Adjust pacing/detail before advancing to the next part."
        )

    was_locked = state.get("state") == "SCRIPT_LOCKED"
    if was_locked:
        state["script_version"] = int(state.get("script_version", 1)) + 1

    rec = state["parts_registry"][pid]
    rec["revision"] = int(args.revision)
    rec["file"] = str(part_file.resolve())
    rec["status"] = "SECTION_PASSED"
    rec["actual_units"] = actual_units
    rec["chunk_count"] = len(spoken_chunks)
    rec["sha256"] = sha256_bytes(raw_bytes)
    rec["first_sentence"] = parsed[0][1]
    rec["last_sentence"] = parsed[-1][1]

    passed_parts = [p for p in state["parts_registry"].values() if p["status"] == "SECTION_PASSED"]
    state["parts_delivered"] = len(passed_parts)
    state["cumulative_units"] = sum(p["actual_units"] for p in passed_parts)
    state["cumulative_chunks"] = sum(p["chunk_count"] for p in passed_parts)
    state["last_delivered_boundary"] = f"{pid}: {parsed[-1][1]}"

    pending = [k for k, v in sorted(state["parts_registry"].items()) if v["status"] != "SECTION_PASSED"]
    if pending:
        state["current_workflow"] = "WF04_WRITING"
        state["state"] = "WRITING"
        state["next_part"] = pending[0]
    else:
        state["current_workflow"] = "WF05_READY_FOR_QA"
        state["state"] = "DRAFT_COMPLETE"
        state["next_part"] = None

    state["updated_at"] = datetime.now(timezone.utc).isoformat()
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    lock_note = f" | [LOCK INVALIDATED -> v{state['script_version']}]" if was_locked else ""
    for w in channel_warnings:
        print(f"[CHANNEL WARN] {w}")
    print(
        f"[TT PART PASSED] {pid} (R{rec['revision']}) | Units={actual_units}/{budget} ({deviation_pct:+.1f}%) | "
        f"Beats={len(spoken_chunks)} | Cumulative={state['cumulative_units']} | "
        f"Next={state['next_part'] or 'WF05_FLOW_AND_BEAT_AUDIT'}{lock_note}"
    )


def _collect_all_parts(state: dict):
    missing = [k for k, v in sorted(state["parts_registry"].items()) if v["status"] != "SECTION_PASSED"]
    if missing:
        sys.exit(f"[BLOCKER] Missing passed parts: {missing}")

    mode = state.get("mode", "clean_voiceover")
    part_master_blocks = []
    all_parsed_with_pid = []
    seam_pairs = []
    ordered_pids = sorted(state["parts_registry"].keys())

    for i, pid in enumerate(ordered_pids):
        rec = state["parts_registry"][pid]
        raw_chunks = split_raw_chunks(Path(rec["file"]).read_text(encoding="utf-8"))
        parsed = [parse_chunk_mode(c, mode) for c in raw_chunks]
        for p in parsed:
            all_parsed_with_pid.append((pid, p[0], p[1], p[2]))
        part_master_blocks.append("\n\n".join(p[1] for p in parsed))
        if i > 0 and parsed:
            prev_pid = ordered_pids[i - 1]
            prev_last = state["parts_registry"][prev_pid].get("last_sentence")
            seam_pairs.append({"seam": f"{prev_pid}->{pid}", "prev_closing": prev_last, "next_opening": parsed[0][1]})

    if all_parsed_with_pid:
        seam_pairs.append(
            {
                "seam": "FINAL->0.0s_LOOP_OR_PART2",
                "prev_closing": all_parsed_with_pid[-1][2],
                "next_opening": all_parsed_with_pid[0][2],
            }
        )
    return part_master_blocks, all_parsed_with_pid, seam_pairs


def cmd_opening_audit(args):
    ws = Path(args.workspace)
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    if args.frame0_text is not None:
        state["frame0_text"] = args.frame0_text
        state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")

    mode = state.get("mode", "clean_voiceover")
    if args.p01_only:
        p01 = state["parts_registry"].get("P01")
        if not p01 or p01["status"] != "SECTION_PASSED":
            sys.exit("[BLOCKER] P01 must be SECTION_PASSED to run --p01-only opening-audit.")
        raw_chunks = split_raw_chunks(Path(p01["file"]).read_text(encoding="utf-8"))
        spoken_chunks = [parse_chunk_mode(c, mode)[2] for c in raw_chunks]
    else:
        _, all_parsed_with_pid, _ = _collect_all_parts(state)
        spoken_chunks = [x[3] for x in all_parsed_with_pid]

    rc = state["rate_spec"]["rate_center_upm"]
    threshold = (
        int(args.max_open_sentence_units)
        if args.max_open_sentence_units is not None
        else int(state.get("max_open_sentence_units", 20))
    )
    report = analyze_opening_fyp(spoken_chunks, state["count_unit"], rc, threshold, state.get("frame0_text"))
    audit_path = ws / f"{args.topic_id}_TT_OPENING_AUDIT_V{state['script_version']}.json"
    audit_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    if args.strict and report["warnings"]:
        sys.exit(f"[OPENING FYP AUDIT BLOCKER] {report['warnings']}")

    print(
        f"[TT OPENING FYP AUDIT] Beat1={report['first_beat_est_sec']:.2f}s | "
        f"MaxSent0-15s={report['max_sentence_units_0_15s']}/{threshold} | "
        f"0-30sContiguityAnchors={report['contiguity_numeric_or_clock_anchors_0_30s']} | "
        f"Frame0={report['frame0_safezone_status']}"
    )


def cmd_beat_audit(args):
    ws = Path(args.workspace)
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    _, all_parsed_with_pid, _ = _collect_all_parts(state)
    spoken_chunks = [x[3] for x in all_parsed_with_pid]

    rc = state["rate_spec"]["rate_center_upm"]
    non_speech = float(state["rate_spec"].get("non_speech_budget_seconds", 0.0))
    threshold = float(args.max_beat_sec) if args.max_beat_sec is not None else float(state.get("max_beat_sec", 8.5))

    report = analyze_beats(spoken_chunks, state["count_unit"], rc, non_speech, threshold)
    audit_path = ws / f"{args.topic_id}_TT_BEAT_AUDIT_V{state['script_version']}.json"
    audit_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    if args.strict and report["beats_exceeding_threshold"]:
        sys.exit(
            f"[BEAT AUDIT BLOCKER] {len(report['beats_exceeding_threshold'])} spoken beat(s) exceed "
            f"{threshold:.1f}s: {report['beats_exceeding_threshold']}"
        )
    print(
        f"[TT BEAT AUDIT] Beats={report['total_beats']} | FirstBeat={report['first_beat_est_sec']:.2f}s | "
        f"AvgBeat={report['avg_beat_est_sec']:.2f}s | MaxBeat={report['max_single_beat_est_sec']:.2f}s | "
        f"SpokenBeats/10s={report['spoken_beats_per_10s']:.2f} | OverThreshold={len(report['beats_exceeding_threshold'])}"
    )


def cmd_stitch_draft(args):
    ws = Path(args.workspace)
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))

    part_master_blocks, all_parsed_with_pid, seam_pairs = _collect_all_parts(state)
    spoken_chunks = [x[3] for x in all_parsed_with_pid]

    draft_text = "\n\n".join(part_master_blocks) + "\n"
    draft_path = ws / f"{args.topic_id}_TT_DRAFT_V{state['script_version']}.txt"
    draft_path.write_bytes(draft_text.encode("utf-8"))

    seams_path = ws / f"{args.topic_id}_TT_SEAM_ANCHORS_V{state['script_version']}.json"
    seams_path.write_text(json.dumps(seam_pairs, indent=2, ensure_ascii=False), encoding="utf-8")

    total_u = count_units(" ".join(spoken_chunks), state["count_unit"])
    rc = state["rate_spec"]["rate_center_upm"]
    rmin = state["rate_spec"]["rate_min_upm"]
    rmax = state["rate_spec"]["rate_max_upm"]
    non_speech = float(state["rate_spec"].get("non_speech_budget_seconds", 0.0))
    max_beat_sec = float(state.get("max_beat_sec", 8.5))
    open_thresh = int(state.get("max_open_sentence_units", 20))

    beat_report = analyze_beats(spoken_chunks, state["count_unit"], rc, non_speech, max_beat_sec)
    (ws / f"{args.topic_id}_TT_BEAT_AUDIT_V{state['script_version']}.json").write_text(
        json.dumps(beat_report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    opening_report = analyze_opening_fyp(spoken_chunks, state["count_unit"], rc, open_thresh, state.get("frame0_text"))
    (ws / f"{args.topic_id}_TT_OPENING_AUDIT_V{state['script_version']}.json").write_text(
        json.dumps(opening_report, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    est_c = total_u / rc * 60.0 + non_speech
    est_f = total_u / rmax * 60.0 + non_speech
    est_s = total_u / rmin * 60.0 + non_speech
    print(
        f"[TT DRAFT STITCHED] {draft_path} | SpokenUnits={total_u} | Beats={len(spoken_chunks)} | "
        f"EstTotal={est_c:.1f}s (range {est_f:.1f}-{est_s:.1f}s) | "
        f"OverBeat={len(beat_report['beats_exceeding_threshold'])} | OpeningWarnings={len(opening_report['warnings'])}"
    )


def cmd_lock_export(args):
    ws = Path(args.workspace)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    state_path = ws / f"{args.topic_id}_TT_STATE_V1.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))

    part_master_blocks, all_parsed_with_pid, seam_pairs = _collect_all_parts(state)
    spoken_chunks = [x[3] for x in all_parsed_with_pid]
    mode = state.get("mode", "clean_voiceover")

    master_prose = "\n\n".join(part_master_blocks) + "\n"
    if not args.allow_guess and UNRESOLVED_EPISTEMIC_RE.search(master_prose):
        sys.exit("[ANTI-FABRICATION BLOCKER] Unresolved epistemic tag remains in script; resolve before locking.")

    sep = " | " if args.voice_sep == "pipe" else "\n\n"
    voice_text = sep.join(spoken_chunks) + "\n"

    if mode == "clean_voiceover":
        tokens_master = re.findall(r"\S+", master_prose, flags=re.UNICODE)
    else:
        tokens_master = re.findall(r"\S+", " ".join(spoken_chunks), flags=re.UNICODE)
    tokens_voice = re.findall(r"\S+", " ".join(spoken_chunks), flags=re.UNICODE)
    if tokens_master != tokens_voice:
        sys.exit("[BLOCKER] Lossless Roundtrip failed: spoken token sequence mismatch between 01-TT-SCRIPT and 02-TT-VOICE!")

    total_u = count_units(" ".join(spoken_chunks), state["count_unit"])
    rc = state["rate_spec"]["rate_center_upm"]
    rmin = state["rate_spec"]["rate_min_upm"]
    rmax = state["rate_spec"]["rate_max_upm"]
    non_speech = float(state["rate_spec"].get("non_speech_budget_seconds", 0.0))

    est_center_sec = total_u / rc * 60.0 + non_speech
    est_fast_sec = total_u / rmax * 60.0 + non_speech
    est_slow_sec = total_u / rmin * 60.0 + non_speech

    if state["track"] == "creator_rewards" and est_fast_sec < 62.0 and not args.allow_exception:
        sys.exit(
            f"[MONETIZATION BLOCKER] Final draft fast-rate duration is {est_fast_sec:.1f}s "
            "(< 62.0s safety floor for TikTok Creator Rewards)! Expand middle escalation/proof before locking."
        )
    if state["track"] in ("viral_short", "serial_sub60") and est_slow_sec > 59.0 and not args.allow_exception:
        sys.exit(
            f"[DURATION BLOCKER] Final draft slow-rate duration is {est_slow_sec:.1f}s "
            f"(> 59.0s ceiling for sub-60s track '{state['track']}')!"
        )

    lo, hi = CHANNEL_SPOKEN_BAND_SEC
    if not (lo <= est_center_sec <= hi) and not args.allow_exception:
        sys.exit(f"[CHANNEL BLOCKER] Final center estimate {est_center_sec:.1f}s outside owner band {lo:.0f}-{hi:.0f}s.")

    scene_keys_per_chunk = []
    if state.get("kit_shots_required", True):
        for pid in sorted(state["parts_registry"]):
            rec = state["parts_registry"][pid]
            raw = split_raw_chunks(Path(rec["file"]).read_text(encoding="utf-8"))
            spoken = [parse_chunk_mode(c, mode)[2] for c in raw]
            scene_keys_per_chunk += [" / ".join(ks) for _, ks in load_shot_sidecar(Path(rec["file"]), spoken)]

    slug = state["slug"]
    script_file = out_dir / f"01-TT-SCRIPT-{slug}.txt"
    voice_file = out_dir / f"02-TT-VOICE-{slug}.txt"
    timeline_file = out_dir / f"03-TT-TIMELINE-{slug}.csv"
    manifest_file = out_dir / f"04-TT-MANIFEST-{slug}.json"

    master_bytes = master_prose.encode("utf-8")
    voice_bytes = voice_text.encode("utf-8")
    script_file.write_bytes(master_bytes)
    voice_file.write_bytes(voice_bytes)

    cum_sec = 0.0
    with timeline_file.open("w", encoding="utf-8", newline="\n") as f_csv:
        writer = csv.writer(f_csv)
        writer.writerow(
            [
                "beat_id",
                "part_id",
                "speaker",
                "fyp_window_bucket",
                "est_start_sec",
                "est_end_sec",
                "est_duration_sec",
                "units",
                "contiguity_anchors",
                "spoken_text",
                "scene_keys",
            ]
        )
        for idx, (pid, spk, _, spoken) in enumerate(all_parsed_with_pid, start=1):
            u = count_units(spoken, state["count_unit"])
            dur = round(u / rc * 60.0, 2)
            start = round(cum_sec, 2)
            end = round(cum_sec + dur, 2)
            cum_sec += dur
            anchors = ";".join(sorted(set(m.group(0) for m in NUMBER_OR_CLOCK_RE.finditer(spoken))))
            writer.writerow(
                [
                    f"b{idx:03d}",
                    pid,
                    spk,
                    fyp_window_bucket(start),
                    f"{start:.2f}",
                    f"{end:.2f}",
                    f"{dur:.2f}",
                    u,
                    anchors,
                    spoken,
                    scene_keys_per_chunk[idx - 1] if scene_keys_per_chunk else "",
                ]
            )

    max_beat_sec = float(state.get("max_beat_sec", 8.5))
    open_thresh = int(state.get("max_open_sentence_units", 20))
    beat_report = analyze_beats(spoken_chunks, state["count_unit"], rc, non_speech, max_beat_sec)
    opening_report = analyze_opening_fyp(spoken_chunks, state["count_unit"], rc, open_thresh, state.get("frame0_text"))

    manifest = {
        "schema": "TIKTOK_LOCK_MANIFEST_V4",
        "profile_id": state.get("profile_id"),
        "profile_revision": state.get("profile_revision"),
        "base_versions": state.get("base_versions"),
        "cast": state.get("cast"),
        "kit_episode_id": state.get("kit_episode_id"),
        "channel_band_seconds": list(CHANNEL_SPOKEN_BAND_SEC),
        "topic_id": state["topic_id"],
        "slug": slug,
        "track": state["track"],
        "mode": mode,
        "script_version": state["script_version"],
        "timing_status": "ESTIMATED",
        "count_unit": state["count_unit"],
        "total_spoken_units": total_u,
        "total_beats": len(spoken_chunks),
        "non_speech_seconds": non_speech,
        "estimated_center_seconds": round(est_center_sec, 1),
        "estimated_range_seconds": [round(est_fast_sec, 1), round(est_slow_sec, 1)],
        "creator_rewards_60s_safe": est_fast_sec >= 62.0 if state["track"] == "creator_rewards" else "NOT_APPLICABLE",
        "lossless_token_roundtrip": True,
        "seam_count": len(seam_pairs),
        "beat_pacing_summary": beat_report,
        "opening_fyp_audit": opening_report,
        "files": {
            "01_script": {"path": str(script_file.resolve()), "sha256": sha256_bytes(master_bytes)},
            "02_voice": {"path": str(voice_file.resolve()), "sha256": sha256_bytes(voice_bytes)},
            "03_timeline_csv": {"path": str(timeline_file.resolve()), "sha256": sha256_bytes(timeline_file.read_bytes())},
        },
        "locked_at": datetime.now(timezone.utc).isoformat(),
    }
    manifest_file.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    state["state"] = "SCRIPT_LOCKED"
    state["current_workflow"] = "WF06_SCRIPT_LOCKED"
    state["updated_at"] = datetime.now(timezone.utc).isoformat()
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")

    print(
        f"[TT LOCK & EXPORT OK] v{state['script_version']} | Units={total_u} | "
        f"Est={est_center_sec:.1f}s (fast={est_fast_sec:.1f}s, slow={est_slow_sec:.1f}s) | "
        f"LosslessRoundtrip=PASS | Out={out_dir}"
    )


def cmd_kit_export(args):
    ws = Path(args.workspace)
    state = json.loads((ws / f"{args.topic_id}_TT_STATE_V1.json").read_text(encoding="utf-8"))
    if state.get("state") != "SCRIPT_LOCKED" and not args.allow_unlocked:
        sys.exit("[BLOCKER] Run lock-export first (kit shots must come from the locked script).")
    mode = state.get("mode", "clean_voiceover")
    cast = state.get("cast") or {}
    rc = state["rate_spec"]["rate_center_upm"]
    lines_out, beats_all, n = [], [], 0
    for pid in sorted(state["parts_registry"]):
        rec = state["parts_registry"][pid]
        raw = split_raw_chunks(Path(rec["file"]).read_text(encoding="utf-8"))
        parsed = [parse_chunk_mode(c, mode) for c in raw]
        side = load_shot_sidecar(Path(rec["file"]), [p[2] for p in parsed])
        for (spk, _, spoken), (beats, ks) in zip(parsed, side):
            tag = cast.get(spk, {}).get("tag", spk)
            key_txt = ks[0] if len(set(ks)) == 1 and len(ks) > 1 and args.collapse_keys else " / ".join(ks)
            lines_out.append(f"L{n:02d} [{tag}] {' / '.join(beats)} | {key_txt}")
            for b, k in zip(beats, ks):
                beats_all.append((f"L{n:02d}", b, k, count_units(b, "words") / rc * 60.0))
            n += 1
    ep_dir = Path(args.episode_dir)
    ep_dir.mkdir(parents=True, exist_ok=True)
    shots_path = ep_dir / "shots.txt"
    shots_path.write_text("\n".join(lines_out) + "\n", encoding="utf-8")
    keys = []
    for _, _, k, _ in beats_all:
        if not keys or keys[-1] != k:
            keys.append(k)
    short = [(lid, b, k, round(d, 2)) for lid, b, k, d in beats_all if d < KIT_MIN_SHOT_SEC]
    total = sum(d for *_, d in beats_all)   # rate already includes inter-line gaps
    report = {
        "shots_txt": str(shots_path.resolve()),
        "lines": n,
        "beats": len(beats_all),
        "est_shots_after_same_key_merge": len(keys),
        "unique_scene_keys": sorted(set(k for *_, k, _ in beats_all)),
        "est_cuts_per_10s": round(len(keys) / total * 10.0, 2) if total else 0,
        "baseline_cuts_per_10s": "4.6-5.3 (TM01/TM02/TMG01 measured)",
        "beats_under_min_shot_will_merge": short,
        "next_commands": [
            f"python tools/make_library.py {shots_path} {ep_dir}/library.json",
            f"python tools/sonicvoice_tts.py {shots_path} {ep_dir}/audio --voice uv_1883_1ae2d9e41df6 --voice-map <TAG>=<voice_id> --gap {KIT_TTS_GAP_SEC}",
        ],
    }
    (ws / f"{args.topic_id}_TT_KIT_EXPORT.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(
        f"[TT KIT EXPORT OK] {shots_path} | Lines={n} | Beats={len(beats_all)} | Shots~{len(keys)} | "
        f"Cuts/10s~{report['est_cuts_per_10s']} | ShortBeats={len(short)}"
    )


def cmd_fyp_diagnose(args):
    fol_per_k = float(args.fol_per_k)
    current_followers = int(args.current_followers)
    remaining_to_10k = max(0, 10000 - current_followers)
    views_to_10k = math.ceil(remaining_to_10k / fol_per_k * 1000.0) if fol_per_k > 0 and remaining_to_10k > 0 else 0

    qual_rate = float(args.qualified_rate_pct) / 100.0
    rpm = float(args.rpm_usd)
    est_qual_views_per_100k = int(round(100000 * qual_rate))
    est_rev_per_100k_usd = round(est_qual_views_per_100k / 1000.0 * rpm, 2)

    geo_status = "NOT_PROVIDED"
    if args.qualified_geo_pct is not None:
        geo_status = (
            "PASS_TARGET_GEO_CLEAN (>=60%)"
            if args.qualified_geo_pct >= 60.0
            else "WARN_GEO_DILUTED_BELOW_60PCT (check domestic Wi-Fi self-watch, off-market link sharing, or local language leak!)"
        )

    hygiene_ratio = None
    hygiene_status = "NOT_PROVIDED"
    if args.views is not None and args.unique_viewers is not None and args.unique_viewers > 0:
        hygiene_ratio = round(args.views / args.unique_viewers, 2)
        hygiene_status = (
            "CONTAMINATED_LOOP_WATCH_OVER_2.0 (stop self-watching from team devices!)"
            if hygiene_ratio > 2.0
            else "CLEAN_UNDER_2.0"
        )

    shrunk_effect = None
    sample_noise_flag = "NOT_PROVIDED"
    if (
        args.mean_with is not None
        and args.mean_without is not None
        and args.n_with is not None
        and args.n_without is not None
    ):
        n_min = min(int(args.n_with), int(args.n_without))
        raw_diff = float(args.mean_with) - float(args.mean_without)
        shrunk_effect = round(raw_diff * (n_min / (n_min + 5.0)), 3)
        sample_noise_flag = "LOW_SAMPLE_NOISE_N_UNDER_4" if n_min < 4 else "SUFFICIENT_DIRECTIONAL_SIGNAL"

    sigma = float(args.sigma_pts)
    delta = float(args.delta_pts)
    n_per_arm_80pwr = math.ceil(2.0 * ((1.96 + 0.84) * sigma / delta) ** 2) if delta > 0 else None

    report = {
        "monetization_and_sprint_math": {
            "current_followers": current_followers,
            "fol_per_k": fol_per_k,
            "estimated_views_needed_for_10k_followers": views_to_10k,
            "assumed_qualified_view_rate_pct": args.qualified_rate_pct,
            "assumed_rpm_usd": rpm,
            "est_revenue_per_100k_total_views_usd": est_rev_per_100k_usd,
        },
        "early_48h_fyp_data_hygiene": {
            "qualified_geo_share_pct": args.qualified_geo_pct,
            "geo_classification_status": geo_status,
            "views_per_unique_viewer": hygiene_ratio,
            "loop_contamination_status": hygiene_status,
        },
        "d7_feature_shrinkage_eval": {
            "shrunk_effect_n_over_n_plus_5": shrunk_effect,
            "sample_confidence": sample_noise_flag,
        },
        "retention_experiment_power": {
            "assumed_hold_sd_pts": sigma,
            "target_detectable_lift_pts": delta,
            "required_videos_per_arm_95ci_80power": n_per_arm_80pwr,
        },
    }
    if args.json_out:
        Path(args.json_out).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(description="tyler-tt-script v1.0 (profile tyler-meets-westbrook) — base TikTok Raw Suite v4.0")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_ts = sub.add_parser("twin-seo-check", help="Check Twin lexical clone risk, TikTok Search SEO & FYP throttled words")
    p_ts.add_argument("--candidate", action="append", required=True, help="Candidate hook/premise/caption (repeatable)")
    p_ts.add_argument("--competitor", action="append", help="Competitor hook/title to check Twin risk against")
    p_ts.add_argument("--own-past", action="append", help="Own past video hook/title to avoid self-cloning")
    p_ts.add_argument("--seo-keywords", default="", help="Comma-separated TikTok Search SEO target phrases")
    p_ts.add_argument("--own-past-file", help="File of own past hooks/titles, one per line ('ID | text')")
    p_ts.add_argument("--five-axis", action="append", help="LABEL=Q,S,L,P,K scores (0/0.5/1) vs one closest match")
    p_ts.add_argument("--lang", choices=["auto", "space", "cjk"], default="auto")
    p_ts.add_argument("--json-out", help="Optional JSON output path")
    p_ts.set_defaults(func=cmd_twin_seo_check)

    p_init = sub.add_parser("init", help="Initialize sequential TikTok modular script state")
    p_init.add_argument("--workspace", required=True)
    p_init.add_argument("--topic-id", required=True)
    p_init.add_argument("--slug", required=True)
    p_init.add_argument(
        "--track",
        choices=["creator_rewards", "viral_short", "serial_sub60", "true_story", "extended_story"],
        default="creator_rewards",
    )
    p_init.add_argument("--mode", choices=["clean_voiceover", "dialogue_scenes"], default="dialogue_scenes")
    p_init.add_argument(
        "--count-unit",
        choices=["words", "whitespace_words", "vietnamese_syllables", "non_space_chars"],
        default="words",
    )
    p_init.add_argument("--part-budgets", required=True, help="Comma-separated spoken unit budgets, e.g. 65,95,95,70")
    p_init.add_argument("--rate", default=145.0, type=float, help="MEASURED TM01/TM02/TMG01: 138-149 wpm incl. gaps")
    p_init.add_argument("--rate-min", default=136.0, type=float)
    p_init.add_argument("--rate-max", default=152.0, type=float)
    p_init.add_argument("--rate-basis", choices=["MEASURED_SAMPLE", "PLANNING_ASSUMPTION", "ASSUMED_PLANNING_RATE"], default="MEASURED_SAMPLE")
    p_init.add_argument("--non-speech-sec", default=0.0, type=float)
    p_init.add_argument("--max-beat-sec", default=8.5, type=float)
    p_init.add_argument("--max-open-sentence-units", type=int)
    p_init.add_argument("--frame0-text", help="Frame-0 Safe-Zone overlay text (max 2 lines)")
    p_init.add_argument("--clean-tts", action=argparse.BooleanOptionalAction, default=True)
    p_init.add_argument("--strict-natural-speech", action=argparse.BooleanOptionalAction, default=True, help="Block em-dash and arrow symbols (channel default ON)")
    p_init.add_argument("--allow-exception", action="store_true")
    p_init.add_argument("--cast", help="SPEAKER=TAG:role,... e.g. TYLER=NARR:narrator,ELIJAH=ELI:star,KAYLA=KAY:student,MS_PARK=ART:adult")
    p_init.add_argument("--kit-episode-id", help="Blender kit episode folder id, e.g. TT001")
    p_init.set_defaults(func=cmd_init)

    p_vp = sub.add_parser("verify-part", help="Verify sequential part P0k")
    p_vp.add_argument("--workspace", required=True)
    p_vp.add_argument("--topic-id", required=True)
    p_vp.add_argument("--part-id", required=True)
    p_vp.add_argument("--file", required=True)
    p_vp.add_argument("--revision", default=1, type=int)
    p_vp.add_argument("--allow-deviation", action="store_true")
    p_vp.add_argument("--allow-guess", action="store_true")
    p_vp.add_argument("--allow-ai-punct", action="store_true")
    p_vp.set_defaults(func=cmd_verify_part)

    p_oa = sub.add_parser("opening-audit", help="Audit 0-3s / 3-15s / 15-30s FYP swipe gate & visual contiguity")
    p_oa.add_argument("--workspace", required=True)
    p_oa.add_argument("--topic-id", required=True)
    p_oa.add_argument("--p01-only", action="store_true")
    p_oa.add_argument("--frame0-text", help="Update Frame-0 Safe-Zone text")
    p_oa.add_argument("--max-open-sentence-units", type=int)
    p_oa.add_argument("--strict", action="store_true")
    p_oa.set_defaults(func=cmd_opening_audit)

    p_ba = sub.add_parser("beat-audit", help="Audit spoken beat durations")
    p_ba.add_argument("--workspace", required=True)
    p_ba.add_argument("--topic-id", required=True)
    p_ba.add_argument("--max-beat-sec", default=None, type=float)
    p_ba.add_argument("--strict", action="store_true")
    p_ba.set_defaults(func=cmd_beat_audit)

    p_sd = sub.add_parser("stitch-draft", help="Stitch passed parts & export seam anchors")
    p_sd.add_argument("--workspace", required=True)
    p_sd.add_argument("--topic-id", required=True)
    p_sd.set_defaults(func=cmd_stitch_draft)

    p_le = sub.add_parser("lock-export", help="Lock verified draft and export 4-file lossless 9:16 bundle")
    p_le.add_argument("--workspace", required=True)
    p_le.add_argument("--topic-id", required=True)
    p_le.add_argument("--out-dir", required=True)
    p_le.add_argument("--voice-sep", choices=["pipe", "newline"], default="pipe")
    p_le.add_argument("--allow-exception", action="store_true")
    p_le.add_argument("--allow-guess", action="store_true")
    p_le.set_defaults(func=cmd_lock_export)

    p_ke = sub.add_parser("kit-export", help="Write Blender kit shots.txt from the locked parts + .shots sidecars")
    p_ke.add_argument("--workspace", required=True)
    p_ke.add_argument("--topic-id", required=True)
    p_ke.add_argument("--episode-dir", required=True, help="e.g. episodes/TT001")
    p_ke.add_argument("--collapse-keys", action="store_true")
    p_ke.add_argument("--allow-unlocked", action="store_true")
    p_ke.set_defaults(func=cmd_kit_export)

    p_fd = sub.add_parser("fyp-diagnose", help="Post-publish FYP sprint/RPM, geo hygiene & D+7 shrinkage helper")
    p_fd.add_argument("--current-followers", type=int, default=0)
    p_fd.add_argument("--fol-per-k", type=float, default=5.0)
    p_fd.add_argument("--qualified-rate-pct", type=float, default=55.0)
    p_fd.add_argument("--rpm-usd", type=float, default=0.80)
    p_fd.add_argument("--qualified-geo-pct", type=float, help="Share of views from target qualified geo in pct")
    p_fd.add_argument("--views", type=int)
    p_fd.add_argument("--unique-viewers", type=int)
    p_fd.add_argument("--mean-with", type=float)
    p_fd.add_argument("--mean-without", type=float)
    p_fd.add_argument("--n-with", type=int)
    p_fd.add_argument("--n-without", type=int)
    p_fd.add_argument("--sigma-pts", type=float, default=8.0, help="Std dev of 3s/30s hold in percentage points")
    p_fd.add_argument("--delta-pts", type=float, default=5.0, help="Target detectable lift in percentage points")
    p_fd.add_argument("--json-out", help="Optional JSON output path")
    p_fd.set_defaults(func=cmd_fyp_diagnose)

    return ap


if __name__ == "__main__":
    parser = build_parser()
    cli_args = parser.parse_args()
    cli_args.func(cli_args)
