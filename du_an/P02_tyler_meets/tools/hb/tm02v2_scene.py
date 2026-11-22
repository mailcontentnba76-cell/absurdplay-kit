"""TM02 v2 — Marcus. 4 sets: hallway, boys' bathroom, gym dance, night parking lot.
Usage: blender -b --python tools/hb/tm02v2_scene.py -- <timeline.json> <out_dir> [--stills] [--check] [--only K,K] [--res WxH] [--samples N]"""
import bpy, sys, os, json, math, random, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets2, hb_sets3, hb_sets4
for m_ in (hb_lib, hb_props, hb_sets2, hb_sets3, hb_sets4): importlib.reload(m_)
from hb_lib import *
from hb_props import phone
from hb_sets2 import idle, breathe
from hb_sets3 import hallway, gym_dance, dance
from hb_sets4 import bathroom, flicker, parking_lot, night_world, hallway_details, gym_details

argv = sys.argv[sys.argv.index("--") + 1:]
TL, OUT = os.path.abspath(argv[0]), os.path.abspath(argv[1]); STILLS = "--stills" in argv; CHECK = "--check" in argv
ONLY = set(argv[argv.index("--only") + 1].split(",")) if "--only" in argv else None
RES = tuple(int(v) for v in argv[argv.index("--res") + 1].split("x")) if "--res" in argv else (1080, 1920)
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 64
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")); P = lambda p: os.path.join(ROOT, p)
FPS = 30
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=SAMPLES)
HALL, GYM, BATH, PARK = 150, 180, 210, 240
hall = hallway((HALL, 0, 0)); hallway_details((HALL, 0, 0))
gym = gym_dance((GYM, 0, 0)); gym_details((GYM, 0, 0))
bath = bathroom((BATH, 0, 0)); park = parking_lot((PARK, 0, 0)); lights((0, 0, 0))
SUN = bpy.data.objects["sun"]
for nm, loc, en, sz in (("fill_hall", (HALL, -2, 3.0), 500, 3), ("fill_gym", (GYM, 0, 6.0), 700, 5), ("fill_bath", (BATH, 0, 2.8), 300, 2.5), ("fill_park", (PARK + 1.5, 0.6, 3.0), 450, 3)):
    L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = sz; fo = bpy.data.objects.new(nm, L); bpy.context.scene.collection.objects.link(fo); fo.location = loc
# clock on the wall above the lockers, right behind Marcus' head (the opening joke)
MX, MY = HALL - 1.16, -3.5   # skull radius 0.24 + locker face at HALL-1.61 -> keep >= 0.3 m
bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.2, depth=0.04, location=(HALL - 2.0, MY + 0.1, 2.35), rotation=(0, R(90), 0))
hc = bpy.context.active_object; hc.name = "hall_clock2"; hc.data.materials.append(mat("hall_clockface", srgb("ffffff"), 0.4))
box("hall_clock2_h", (0.02, 0.025, 0.14), (HALL - 1.975, MY + 0.1, 2.39), mat("set_222222", srgb("222222")))
box("hall_clock2_m", (0.02, 0.12, 0.025), (HALL - 1.975, MY + 0.15, 2.35), mat("set_222222", srgb("222222")))
# snack table pivots on its front edge; Tyler's sandwich sits on it
TBX, TBY = gym["table"]
sandwich((TBX + 0.7, TBY - 0.1, 0.81))
TPIV = empty("table_pivot", (TBX, TBY - 0.42, 0)); bpy.context.view_layer.update()
for o in list(bpy.data.objects):
    if o is not TPIV and o.parent is None and o.name.startswith(("gym_table", "gym_tablecloth", "gym_punch", "gym_cup", "gym_chips", "sw_")):
        mw = o.matrix_world.copy(); o.parent = TPIV; o.matrix_world = mw
SITX, SITY = TBX + 0.3, TBY - 1.65          # where Marcus lands, in front of the fallen table
flat = [box("flat_sw_b", (0.26, 0.2, 0.012), (SITX + 0.1, SITY - 0.05, 0.006), mat("bread", srgb("e8c27a"), 0.8)),
        box("flat_sw_l", (0.28, 0.22, 0.006), (SITX + 0.1, SITY - 0.05, 0.013), mat("lettuce", srgb("6ac24a"), 0.7)),
        box("flat_sw_t", (0.26, 0.2, 0.01), (SITX + 0.1, SITY - 0.05, 0.02), mat("bread", srgb("e8c27a"), 0.8))]

MK = lambda name, **kw: Char(name, **kw)
tyler = MK("ME", skin="f1c7a0", shirt="ffd23f", pants="3a3f47", shoes="f4f4f4", hair="1e1a18", hair_style="messy", print_img=P("assets/hb/prints/me_paused.png"))
mar = MK("MAR", skin="6b4228", shirt="f4f4f4", pants="2b3a55", shoes="f4f4f4", hair="15100c", hair_style="waves", print_img=P("assets/hb/prints/mar_limited.png"),
         jacket="b3202c", sleeves="f2efe6", long_sleeves=True, chain="d4a017", build=1.05, mood="smug")
cous = MK("COUS", skin="7a4a2e", shirt="2fb3a6", pants="3d3d4a", shoes="f4f4f4", hair="1a120c", hair_style="ponytail", scrunchie="f39c12", build=0.92, long_sleeves=True, female=True)
girls = [MK("G1", skin="f0c9a4", shirt="e85d9c", pants="2c3e50", shoes="f4f4f4", hair="e0c068", hair_style="ponytail", scrunchie="ffffff", build=0.92, female=True),
         MK("G2", skin="c98c63", shirt="9b59b6", pants="34495e", shoes="f4f4f4", hair="2a1a12", hair_style="bun", scrunchie="e74c3c", build=0.92, female=True),
         MK("G3", skin="8d5a3b", shirt="f1c40f", pants="2a2a2a", shoes="f4f4f4", hair="141414", hair_style="ponytail", scrunchie="3498db", build=0.92, female=True)]
dj = MK("DJ", skin="b07a55", shirt="222222", pants="222222", shoes="eeeeee", hair="1a120c", hair_style="buzz", build=1.1, mood="chill")
mom = MK("MOM", skin="6b4228", shirt="8e44ad", pants="2c3e50", shoes="333333", hair="1a120c", hair_style="bun", build=1.1, female=True, long_sleeves=True, mood="annoyed")
mphone = phone("mar_phone", mar.j["el_R"], (0, -0.09, -0.32)); tsw = [box("tyler_flatsw", (0.2, 0.16, 0.02), (0, -0.1, -0.33), mat("bread", srgb("e8c27a"), 0.8), tyler.j["el_R"])]
BOYS = [("c98c63", "3f7fd1", "2a3550", "5a3a22", "messy"), ("f0c9a4", "2fb37a", "4a4a4a", "c9a24a", "buzz"), ("8d5a3b", "e67e22", "2a2a2a", "141414", "buzz"),
        ("f3d2b5", "34495e", "34495e", "d1a06a", "messy"), ("6e4430", "16a085", "283040", "121212", "waves"), ("e8b896", "e74c3c", "2c3e50", "8a5a33", "messy"),
        ("b07a55", "7f8c8d", "3d3d4a", "2a1a12", "buzz"), ("f6d0b0", "2980b9", "5d6d7e", "e0c068", "messy")]
boys = [MK(f"B{i}", skin=s, shirt=sh, pants=pa, shoes="eeeeee", hair=ha, hair_style=st) for i, (s, sh, pa, ha, st) in enumerate(BOYS)]
# squashed sandwich for the final insert (world-placed above Tyler's palm; toasted bread so it pops from his yellow shirt)
FSW = [("fsw_b", (0.27, 0.21, 0.014), 0.000, "toast", "c98a3e"), ("fsw_l", (0.31, 0.25, 0.006), 0.010, "lettuce", "4fae3a"),
       ("fsw_h", (0.29, 0.19, 0.006), 0.016, "ham", "e9738a"), ("fsw_k", (0.12, 0.27, 0.004), 0.020, "ketchup", "c8231e"),
       ("fsw_t", (0.27, 0.21, 0.012), 0.026, "toast", "c98a3e")]
fsw = [box(nm, sz, (0, -80, 0), mat(mn, srgb(c), 0.8), None, 0.004, 2) for nm, sz, _, mn, c in FSW]
cam, tgt = camera("cam", 28); bpy.context.scene.camera = cam
ALL = list(bpy.data.objects); REST = {o.name: (tuple(o.location), tuple(o.rotation_euler), tuple(o.scale)) for o in ALL}
EVERYONE = [tyler, mar, cous, dj, mom] + girls + boys
def show(objs, on, f=1):
    for o in objs: o.hide_render = not on; o.keyframe_insert("hide_render", frame=f)
def reset():
    for o in ALL:
        o.animation_data_clear(); l, r, s = REST[o.name]; o.location, o.rotation_euler, o.scale = l, r, s; o.hide_render = False
    cam.data.animation_data_clear()
OFF = lambda c: c.place(1, 0, -80, 0, 0)
def all_off():
    for c in EVERYONE: OFF(c)
    show([mphone, bpy.data.objects["mar_phone_scr"]] + flat + tsw + fsw, False)
def day(): SUN.data.energy = 4.5; night_world(False); bpy.data.objects['fill_park'].data.energy = 0
def chew(c, n, every=7):
    for f in range(1, n + 1, every):
        c.mouth.scale = (1.1, 1, 1.6 if (f // every) % 2 else 0.8); c.mouth.keyframe_insert("scale", frame=f)

# ---------------------------------------------------------------- set layouts
TX, TY = HALL - 0.55, MY + 0.9
def mar_lean(f=1):
    mar.place(f, MX, MY, 0, 90); mar.stand(f)
    mar.pose(f, chest=(0, 2, 0), head=(0, 4, 0), hip_R=(10, 0, 0), kn_R=(46, 0, 0), sh_L=(-30, 0, 35), el_L=(-95, 0, 0), sh_R=(-35, 0, -30), el_R=(-95, 0, 0))
def scene_hall(n, girl_pass=False):
    all_off(); day()
    mar_lean(); breathe(mar, 1, n, 1.0, 90, 3); chew(mar, n)
    tyler.place(1, TX, TY, 0, -45); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    if girl_pass:
        g = girls[0]; g.walk(1, n, (HALL + 0.35, MY - 2.6, 0), (HALL + 0.35, MY + 1.6, 0)); g.expr("neutral", 1)
        for f in range(1, n, 20): g.rot("head", f, 0, 0, 35)          # glancing toward Marcus' side (at the clock)
    for i, (c, a, b) in enumerate(((boys[0], (HALL + 0.1, 2.5), (HALL + 0.1, 7.0)), (boys[1], (HALL - 0.3, 7.0), (HALL - 0.3, 2.8)), (boys[2], (HALL - 0.6, -7.4), (HALL - 0.6, -6.2)))):
        span = min(abs(b[1] - a[1]), 1.2 * n / 30); d = 1 if b[1] > a[1] else -1
        c.walk(1, n, (a[0], a[1], 0), (a[0], a[1] + d * span, 0))
    for i, (c, (x, y, yaw), kind) in enumerate(zip(boys[3:6], ((HALL + 1.25, 3.0, -90), (HALL + 1.2, 3.65, -125), (HALL + 1.25, -5.6, -90)), ("talk", "look", "phone"))):
        c.place(1, x, y, 0, yaw); c.stand(1); idle(c, 1, n, kind, 300 + i)
    r = boys[6]; r.place(1, HALL + 1.2, 5.3, -0.62, -90); r.sit(1, arms_on_desk=False); idle(r, 1, n, "read", 333)   # reading on the floor
BMX, BMY = BATH - 0.6, 1.55
def scene_bath(n):
    all_off(); day()
    mar.place(1, BMX, BMY, 0, 180); mar.stand(1); show([mphone, bpy.data.objects["mar_phone_scr"]], True)
    mar.pose(1, sh_R=(-110, 0, 20), el_R=(-50, 0, 0)); breathe(mar, 1, n, 1.0, 90, 3); chew(mar, n)
    for k, f in enumerate(range(1, n, 14)): mar.rot("head", f, 0, (10 if k % 2 else -8), (8 if k % 3 else -8)); mar.rot("chest", f, 0, (-6 if k % 2 else 6), 0)
    tyler.place(1, BATH + 2.0, 1.15, 0, -110); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    w = boys[3]; w.place(1, BATH - 1.3, 1.62, 0, 180); w.stand(1); w.pose(1, sh_L=(-55, 0, 10), el_L=(-40, 0, 0), sh_R=(-55, 0, -10), el_R=(-40, 0, 0)); idle(w, 1, n, "look", 404)
    flicker(bath["flicker"], n, 7)
GC = (GYM + 1.8, 2.8); DOOR = (GYM, -7.4)
def scene_gym(n, girls_in=False, table_down=False):
    all_off(); day()
    tyler.place(1, GYM - 1.6, -2.6, 0, 160); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    mar.place(1, GYM - 2.4, -2.2, 0, 200); mar.stand(1); mar.expr("smug", 1); breathe(mar, 1, n, 1.0, 90, 3)
    dj.place(1, gym["dj"][0], gym["dj"][1] + 1.6, 0, 0); dj.stand(1); dance(dj, 1, n, 9, amp=0.4)   # behind the booth, facing the crowd
    for i, c in enumerate(boys):
        a = 2 * math.pi * i / len(boys); c.place(1, GC[0] + 1.9 * math.cos(a), GC[1] + 1.6 * math.sin(a), 0, math.degrees(a) + 90); c.stand(1)
        if i % 3: dance(c, 1, n, 50 + i)
        else: idle(c, 1, n, "talk", 50 + i)
    for i, g in enumerate(girls):
        if girls_in: g.place(1, GYM + 2.6 + i * 0.6, -1.8 - (i % 2) * 0.4, 0, 200 + i * 20); g.stand(1); idle(g, 1, n, "talk", 70 + i); g.expr("happy", 1)
    TPIV.rotation_euler = (R(84) if table_down else 0, 0, 0); TPIV.keyframe_insert("rotation_euler", frame=1)
    show(flat, table_down)
    d = gym["disco"]; d.rotation_euler = (0, 0, 0); d.keyframe_insert("rotation_euler", frame=1); d.rotation_euler = (0, 0, R(2.0 * n)); d.keyframe_insert("rotation_euler", frame=n)
PMX, PMY = PARK + 0.9, 2.95; PTX, PTY = PARK + 1.9, 3.15; PCX, PCY = PARK + 1.3, 2.25
def scene_park(n, cousin_there=False):
    all_off(); SUN.data.energy = 0.25; night_world(True); bpy.data.objects['fill_park'].data.energy = 450
    mar.place(1, PMX, PMY, 0, 0); mar.stand(1); breathe(mar, 1, n, 1.0, 90, 3)
    tyler.place(1, PTX, PTY, 0, 60); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    show(tsw, True); tyler.pose(1, sh_R=(-55, 0, -10), el_R=(-60, 0, 0))
    mom.place(1, park["mv_xy"][0] + 1.0, park["mv_xy"][1] - 0.35, 0.05, -90); mom.sit(1, arms_on_desk=True)   # driver seat, seen through the windshield
    if cousin_there: cous.place(1, PCX, PCY, 0, 210); cous.stand(1); idle(cous, 1, n, "talk", 81); cous.expr("annoyed", 1)
    for i, (c, (x, y, yaw), kind) in enumerate(zip(girls[1:] + boys[:3], ((PARK - 2.6, 5.0, 180), (PARK - 2.0, 5.3, 140), (PARK + 5.6, 4.9, 200),
                                                                       (PARK + 6.3, 5.2, 170), (PARK + 8.6, 4.8, 220)), ("talk", "talk", "look", "talk", "phone"))):
        c.place(1, x, y, 0.12, yaw); c.stand(1); idle(c, 1, n, kind, 600 + i)

PULL = 1.3
CUR = {"key": ""}
def _clamp(p):
    x, y, z = p
    if x < 165: return (min(max(x, HALL - 1.45), HALL + 1.45), min(max(y, -7.6), 7.6), min(max(z, 0.4), 3.0))
    if x < 195: return (min(max(x, GYM - 7.6), GYM + 7.6), min(max(y, -7.6), 7.6), min(max(z, 0.4), 6.5))
    if x < 225: return (min(max(x, BATH - 2.85), BATH + 2.85), min(max(y, -2.35), 2.35), min(max(z, 0.4), 2.8))
    return (x, min(y, 6.8), max(z, 0.3))
def cam_move(n, p0, l0, lens, p1=None, l1=None):
    close = CUR["key"].startswith(("CU_", "ECU_", "INS_", "POV_"))
    if not close: lens = max(16, lens * 0.82)
    k = (1.0 if CUR["key"].startswith(("INS_", "POV_")) else 1.3) if close else PULL
    pull = lambda p, l: _clamp(tuple(b + (a - b) * k for a, b in zip(p, l)))
    cam_key(cam, tgt, 1, pull(p0, l0), l0, lens); cam_key(cam, tgt, n, pull(p1 or p0, l1 or l0), l1 or l0, lens)
MF = lambda z=1.95: (MX, MY, z)

# ---------------------------------------------------------------- 1 HALLWAY
def OPEN_GIRL_PASS(n):
    scene_hall(n, girl_pass=True); mar.expr("shock", 1); mar.expr("happy", n // 3)
    mar.rot("head", 1, 0, 0, 0); mar.rot("head", n // 3, 0, 0, -35)                       # whips round to Tyler
    mar.pose(n // 3, sh_R=(-80, 0, -40), el_R=(-20, 0, 0)); mar.pose(2 * n // 3, sh_R=(-60, 0, -55), el_R=(-30, 0, 0))   # slaps Tyler's shoulder
    cam_move(n, (HALL + 1.2, MY + 0.6, 1.7), (HALL - 1.0, MY + 0.05, 1.45), 24, (HALL + 1.17, MY + 0.57, 1.7))
def CU_MAR_HYPE(n):
    scene_hall(n); mar.expr("yell", 1); mar.expr("happy", n // 2)
    mar.rot("chest", 1, 0, -4, -15); mar.pose(1, sh_R=(-85, 0, 15), el_R=(-8, 0, 0))     # pointing after the girl
    for f in range(1, n, 8): mar.rot("head", f, -6 if (f // 8) % 2 else 2, 0, -20)
    cam_move(n, (MX + 0.95, MY - 0.4, 1.97), MF(), 32, (MX + 0.9, MY - 0.38, 1.97))
def CU_ME_WTF(n):
    scene_hall(n); tyler.place(1, TX, TY, 0, -45); tyler.place(6, TX, TY, 0, 80); tyler.expr("deadpan", 1); tyler.blink(n // 2)   # turns to camera: witness look
    cam_move(n, (TX + 0.85, TY - 0.12, 1.85), (TX, TY, 1.82), 34, (TX + 0.8, TY - 0.11, 1.85))
def CU_GIRL_CLOCK(n):
    scene_hall(n, girl_pass=True); g = girls[0]; g.walk(1, n, (HALL + 0.35, MY - 0.6, 0), (HALL + 0.35, MY + 0.2, 0)); g.rot("head", 1, -12, 0, 40)
    cam_move(n, (HALL + 1.3, MY + 0.9, 1.85), (HALL + 0.35, MY - 0.3, 1.8), 32, (HALL + 1.28, MY + 0.85, 1.85))
def INS_CLOCK(n):
    scene_hall(n)
    cam_move(n, (HALL - 0.4, MY - 0.4, 2.15), (HALL - 2.0, MY + 0.1, 2.3), 34, (HALL - 0.45, MY - 0.35, 2.15))
def WIDE_HALL_MAR(n):
    scene_hall(n)
    cam_move(n, (HALL + 0.7, MY - 4.0, 1.9), (HALL - 0.8, MY + 1.0, 1.2), 22, (HALL + 0.7, MY - 3.8, 1.88))
def MS_MAR_LEAN(n):
    scene_hall(n)
    cam_move(n, (MX + 1.3, MY - 1.15, 1.65), (MX, MY, 1.25), 26, (MX + 1.25, MY - 1.1, 1.65))
def INS_MAR_LEG(n):
    scene_hall(n)
    cam_move(n, (MX + 1.15, MY - 0.95, 0.75), (MX - 0.15, MY, 0.6), 30, (MX + 1.1, MY - 0.9, 0.75))
def CU_MAR_CHEW(n):
    scene_hall(n); chew(mar, n, 5); mar.rot("head", 1, 0, 10, 0)
    cam_move(n, (MX + 0.85, MY - 0.35, 1.95), MF(1.92), 38, (MX + 0.8, MY - 0.33, 1.95))
# ---------------------------------------------------------------- 2 BATHROOM
def WIDE_BATH(n):
    scene_bath(n)
    cam_move(n, (BATH + 2.4, -2.0, 2.3), (BATH - 0.6, 1.4, 1.1), 22, (BATH + 2.3, -1.9, 2.28))
def MS_MAR_MIRROR(n):
    scene_bath(n); mar.expr("smug", 1)
    cam_move(n, (BMX + 1.3, BMY + 0.55, 1.75), (BMX, BMY + 0.2, 1.65), 28, (BMX + 1.25, BMY + 0.5, 1.75))
def CU_MAR_MIRROR(n):
    scene_bath(n); mar.expr("happy", 1); mar.rot("head", 1, 8, 0, 0)
    mar.pose(1, sh_R=(-80, 0, 15), el_R=(-80, 0, 0))                                     # looks down at the phone, nodding
    for f in range(1, n, 9): mar.rot("head", f, 14 if (f // 9) % 2 else 6, 0, 0)
    cam_move(n, (BMX + 0.75, BMY + 0.65, 1.95), (BMX, BMY, 1.9), 34, (BMX + 0.72, BMY + 0.62, 1.95))
def CU_ME_DEADPAN_BATH(n):
    scene_bath(n); tyler.blink(n // 2)
    cam_move(n, (BATH + 1.3, 0.75, 1.85), (BATH + 2.0, 1.15, 1.82), 34, (BATH + 1.33, 0.77, 1.85))
def POV_SELFIE(n):
    scene_bath(n); show([mphone, bpy.data.objects["mar_phone_scr"]], False); mar.expr("smug", 1); mar.rot("head", 1, 0, 10, 0)
    cam_key(cam, tgt, 1, (BMX + 0.1, BMY + 0.65, 2.0), (BMX, BMY, 1.93), 30)
# ---------------------------------------------------------------- 3 GYM
def WIDE_GYM(n):
    scene_gym(n); OFF(mar); OFF(tyler)
    cam_move(n, (GYM + 5.5, -6.5, 3.2), (GYM - 0.5, 2.0, 1.4), 20, (GYM + 5.3, -6.3, 3.15))
def WIDE_GYM_DANCE(n):
    scene_gym(n); OFF(mar); OFF(tyler)
    cam_move(n, (GYM - 0.6, -1.6, 1.75), (GYM + 1.8, 2.8, 1.35), 22, (GYM - 0.45, -1.45, 1.75))
def MS_MAR_ENTER(n):
    scene_gym(n); mar.walk(1, n, (DOOR[0] - 1.6, DOOR[1] + 0.3, 0), (GYM - 2.4, -2.7, 0)); tyler.walk(1, n, (DOOR[0] - 0.8, DOOR[1] + 0.2, 0), (GYM - 1.6, -2.95, 0))
    mar.pose(1, sh_L=(-30, 0, 20), el_L=(-90, 0, 0))                                       # straightening his jacket
    cam_move(n, (GYM - 0.4, -1.2, 1.8), (GYM - 2.2, -4.8, 1.4), 26, (GYM - 0.45, -1.3, 1.8))
def POV_MAR_CROWD(n):
    scene_gym(n)
    cam_move(n, (GYM - 2.9, -3.1, 2.15), (GYM + 1.8, 2.8, 1.4), 26, (GYM - 2.85, -3.0, 2.15))
def CU_MAR_DISGUST(n):
    scene_gym(n); mar.expr("annoyed", 1); mar.rot("head", 1, 0, 0, 0); mar.rot("head", n // 2, -6, 0, 10)
    cam_move(n, (GYM - 2.0, -1.35, 2.0), (GYM - 2.4, -2.2, 1.97), 34, (GYM - 2.02, -1.42, 2.0))
def CU_MAR_COMPLAIN(n):
    scene_gym(n); mar.expr("yell", 1); mar.expr("angry", n // 2)
    mar.pose(1, sh_R=(-60, 0, -25), el_R=(-50, 0, 0), sh_L=(-60, 0, 25), el_L=(-50, 0, 0))
    mar.pose(n // 3, sh_R=(-95, 0, -45), el_R=(-30, 0, 0), sh_L=(-95, 0, 45), el_L=(-30, 0, 0))   # arms flung up: "I can't be here!"
    cam_move(n, (GYM - 1.75, -1.45, 2.0), (GYM - 2.4, -2.2, 1.95), 32, (GYM - 1.78, -1.5, 2.0))
def CU_ME_ANNOYED(n):
    scene_gym(n); tyler.expr("annoyed", 1); tyler.expr("yell", n // 3); tyler.expr("annoyed", 2 * n // 3)
    cam_move(n, (GYM - 1.35, -1.75, 1.85), (GYM - 1.6, -2.6, 1.82), 34, (GYM - 1.38, -1.8, 1.85))
def TWO_SHOT_GYM(n):
    scene_gym(n); mar.expr("annoyed", 1)
    cam_move(n, (GYM - 1.0, -0.9, 1.8), (GYM - 2.0, -2.4, 1.5), 26, (GYM - 1.02, -0.95, 1.8))
def WIDE_GIRLS_ENTER(n):
    scene_gym(n, girls_in=True)
    for i, g in enumerate(girls): g.walk(1, n, (DOOR[0] + 1.0 + i * 0.6, DOOR[1] + 0.3, 0), (GYM + 2.2 + i * 0.6, -2.0, 0))
    cam_move(n, (GYM - 2.0, -2.0, 1.9), (GYM + 1.8, -5.0, 1.2), 22, (GYM - 1.9, -2.1, 1.9))
def CU_MAR_SWITCH(n):
    scene_gym(n, girls_in=True); mar.expr("shock", 1); mar.expr("smug", n // 3)
    mar.rot("head", 1, 0, 0, 0); mar.rot("head", n // 3, 0, 0, -40); mar.rot("chest", n // 3, -6, 0, -10)
    cam_move(n, (GYM - 1.85, -1.4, 1.98), (GYM - 2.4, -2.2, 1.95), 36, (GYM - 1.88, -1.45, 1.98))
def CU_MAR_DEEP(n):
    scene_gym(n, girls_in=True); mar.expr("smug", 1); mar.rot("head", 1, 8, 0, -30); mar.rot("chest", 1, 4, 0, -10)
    for b in mar.brows: b.rotation_euler = (0, R(-14), 0); b.keyframe_insert("rotation_euler", frame=1)
    cam_move(n, (GYM - 2.0, -1.4, 1.9), (GYM - 2.4, -2.2, 1.95), 40, (GYM - 2.02, -1.45, 1.9))
WX, WY = GYM + 7.33, -2.0
def _wall_lean(f=1):
    mar.place(f, WX, WY, 0, -90); mar.stand(f)
    mar.pose(f, chest=(0, 8, 0), sh_R=(-30, 0, -35), el_R=(-95, 0, 0), sh_L=(-30, 0, 35), el_L=(-95, 0, 0), hip_L=(10, 0, -12), kn_L=(30, 0, 0))   # arms crossed, shoulder on the wall
def MS_MAR_WALL(n):
    scene_gym(n, girls_in=True); _wall_lean(); mar.expr("smug", 1)
    cam_move(n, (WX - 1.9, WY - 1.4, 1.7), (WX - 0.2, WY, 1.3), 26, (WX - 1.8, WY - 1.3, 1.7))
def CU_MAR_FAKELAUGH(n):
    scene_gym(n, girls_in=True); _wall_lean(); mar.expr("happy", 1)
    for f in range(1, n, 6): mar.rot("chest", f, -12 if (f // 6) % 2 else -2, 8, 0)
    cam_move(n, (WX - 0.85, WY - 0.4, 1.95), (WX, WY, 1.92), 34, (WX - 0.8, WY - 0.45, 1.95))
def CU_MAR_SMUG(n):
    scene_gym(n, girls_in=True); _wall_lean(); mar.expr("smug", 1); mar.blink(n // 2)
    mar.eyes[0].scale = (1, 1, 0.15); mar.eyes[0].keyframe_insert("scale", frame=n // 2); mar.eyes[0].scale = (1, 1, 0.8); mar.eyes[0].keyframe_insert("scale", frame=n // 2 + 6)   # wink
    cam_move(n, (WX - 0.9, WY + 0.35, 1.95), (WX, WY, 1.92), 36, (WX - 0.85, WY + 0.3, 1.95))
LX, LY = TBX - 0.1, TBY - 0.42 - 0.28         # Marcus stands just in front of the table edge
def MS_MAR_LEAN2(n):
    scene_gym(n, girls_in=True); mar.place(1, LX, LY, 0, 0); mar.stand(1)
    mar.pose(1, chest=(-4, 0, 0), sh_R=(-20, 0, -25), el_R=(-40, 0, 0), sh_L=(-20, 0, 25), el_L=(-40, 0, 0)); mar.rot("chest", n, -16, 0, 0); mar.expr("smug", 1)
    cam_move(n, (LX + 1.6, LY - 2.4, 1.8), (LX, LY + 0.2, 1.0), 26, (LX + 1.55, LY - 2.3, 1.8))
def WIDE_TABLE_FALL(n):
    scene_gym(n, girls_in=True); mar.place(1, LX, LY, 0, 0); mar.stand(1); mar.expr("shock", 6)
    for f, a in ((1, 0), (6, 20), (12, 70), (15, 88), (18, 84)):
        TPIV.rotation_euler = (R(a), 0, 0); TPIV.keyframe_insert("rotation_euler", frame=f)
    mar.loc(6, LX, LY, 0); mar.loc(14, SITX, SITY, -0.55); mar.face(14, 0)
    mar.pose(14, hip_L=(-90, 0, 0), hip_R=(-90, 0, 0), kn_L=(60, 0, 0), kn_R=(60, 0, 0))
    for g in girls: g.expr("shock", 10)
    cam_move(n, (TBX + 2.8, TBY - 3.8, 2.2), (TBX, TBY - 0.8, 0.8), 22, (TBX + 2.7, TBY - 3.7, 2.18))
def INS_SANDWICH_FALL(n):
    scene_gym(n, girls_in=True); OFF(mar)
    for f, a in ((1, 30), (8, 75), (12, 88)):
        TPIV.rotation_euler = (R(a), 0, 0); TPIV.keyframe_insert("rotation_euler", frame=f)
    cam_move(n, (TBX + 1.6, TBY - 1.9, 0.95), (TBX + 0.5, TBY - 0.6, 0.55), 30, (TBX + 1.55, TBY - 1.85, 0.93))
def MS_MAR_SITTING(n):
    scene_gym(n, girls_in=True, table_down=True); show(flat, False)
    mar.place(1, SITX, SITY, -0.55, 0); mar.sit(1, arms_on_desk=False); mar.expr("shock", 1); mar.expr("deadpan", n // 2)
    cam_move(n, (SITX + 1.4, SITY - 2.2, 1.4), (SITX, SITY, 0.6), 26, (SITX + 1.35, SITY - 2.1, 1.4))
# ---------------------------------------------------------------- 4 PARKING LOT
def WIDE_PARKING(n):
    scene_park(n)
    for i, c in enumerate(boys[3:6]): c.walk(1, n, (PARK - 2.4 + i * 1.6, 4.5, 0.12), (PARK - 2.4 + i * 1.6 + 0.6, 3.6, 0))
    cam_move(n, (PARK + 6.5, -5.5, 3.0), (PARK, 2.5, 1.0), 20, (PARK + 6.3, -5.3, 2.95))
def WIDE_COUSIN_RUN(n):
    scene_park(n); cous.walk(1, n, (PARK + 6.5, 0.2, 0), (PCX, PCY, 0), step=5); cous.expr("annoyed", 1)
    cam_move(n, (PARK - 1.2, -2.6, 1.9), (PARK + 2.0, 1.6, 1.1), 22, (PARK - 1.1, -2.5, 1.88))
def CU_COUSIN(n):
    scene_park(n, cousin_there=True); cous.expr("yell", 1); cous.expr("angry", n // 2); mar.place(1, PMX - 0.75, PMY + 0.15, 0, 140)
    cous.pose(1, sh_R=(-50, 0, 0), el_R=(-60, 0, 0)); cous.pose(n // 2, sh_R=(-80, 0, 30), el_R=(-10, 0, 0))   # points at the minivan
    fx, fy = PCX, PCY
    cam_move(n, (fx - 0.5, fy + 0.75, 1.75), (fx, fy, 1.7), 32, (fx - 0.48, fy + 0.72, 1.75))
def INS_MINIVAN_HONK(n):
    scene_park(n, cousin_there=True)
    hl = [o for o in ALL if o.name.startswith("minivan_head")]
    for f in range(1, n + 1, 5): show(hl, (f // 5) % 2 == 0, f)
    mx, my = park["mv_xy"]
    cam_move(n, (mx + 4.2, my - 2.2, 1.3), (mx + 1.5, my, 0.9), 30, (mx + 4.1, my - 2.1, 1.3))
def CU_ME_DEADPAN2(n):
    scene_park(n, cousin_there=True); tyler.pose(1, sh_R=(-75, 0, -10), el_R=(-80, 0, 0)); tyler.blink(n // 2)
    cam_move(n, (PTX + 0.75, PTY - 0.55, 1.85), (PTX, PTY, 1.75), 32, (PTX + 0.72, PTY - 0.52, 1.85))
def CU_MAR_POINT(n):
    scene_park(n, cousin_there=True); mar.face(1, 70); mar.expr("smug", 1)
    mar.pose(1, sh_R=(-60, 0, -30), el_R=(-10, 0, 0)); mar.pose(6, sh_R=(-85, 0, -55), el_R=(-5, 0, 0))
    cam_move(n, (PMX + 0.85, PMY - 0.45, 1.98), (PMX, PMY, 1.95), 34, (PMX + 0.82, PMY - 0.42, 1.98))
def CU_ME_DEFEATED(n):
    scene_park(n, cousin_there=True); tyler.expr("annoyed", 1); tyler.rot("head", 1, 0, 0, 0); tyler.rot("head", n // 2, 16, 0, 0)
    for b in tyler.brows: b.rotation_euler = (0, 0, 0)
    cam_move(n, (PTX + 0.8, PTY - 0.5, 1.9), (PTX, PTY, 1.8), 34, (PTX + 0.76, PTY - 0.48, 1.9))
def WIDE_MINIVAN(n):
    scene_park(n, cousin_there=True); mar.walk(1, n, (PMX, PMY, 0), (PMX - 1.6, PMY - 0.15, 0)); cous.walk(1, n, (PCX, PCY, 0), (PCX - 0.8, PCY + 0.5, 0))
    mx, my = park["mv_xy"]
    cam_move(n, (PARK + 5.0, -2.6, 2.4), (mx + 0.8, my + 0.6, 1.0), 22, (PARK + 4.9, -2.5, 2.38))
def INS_SANDWICH_FLAT(n):
    scene_park(n); tyler.pose(1, sh_R=(-75, 0, -10), el_R=(-80, 0, 0))
    show(tsw, False); tyler.expr("sad", 1); tyler.blink(n // 2)
    bpy.context.scene.frame_set(1); h = tyler.j["hand_R"].matrix_world.translation.copy()        # flat sandwich lies on his palm
    for o, (_, _, dz, _, _) in zip(fsw, FSW):
        o.location = (h.x, h.y, h.z + 0.055 + dz); o.rotation_euler = (R(4), R(-3), R(60)); o.keyframe_insert("location", frame=1); o.keyframe_insert("rotation_euler", frame=1)
    show(fsw, True)
    cam_key(cam, tgt, 1, (h.x + 0.75, h.y - 0.5, h.z + 0.32), (h.x - 0.05, h.y + 0.05, h.z + 0.12), 32); cam_key(cam, tgt, n, (h.x + 0.68, h.y - 0.45, h.z + 0.3), (h.x - 0.05, h.y + 0.05, h.z + 0.12), 32)
def POV_GYM(n):
    scene_gym(n); cam_move(n, (GYM + 5.5, -6.5, 3.2), (GYM - 0.5, 2.0, 1.4), 20)

HELPERS = ("POV_SELFIE", "POV_GYM")
SHOTS = {k: v for k, v in globals().items() if k.isupper() and callable(v) and k not in ("P", "R", "MF", "MK", "OFF")}
T = json.load(open(TL, encoding="utf-8")); os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
todo = [(s["id"], s["key"], round(s["end"] * FPS) - round(s["start"] * FPS)) for s in T["shots"]] + [("POV", k, 20) for k in HELPERS]
IGNORE = ("MOM_",)   # mom sits inside the minivan on purpose
for sid, key, n in todo:
    if key not in SHOTS or (ONLY and key not in ONLY): continue
    t0 = time.time(); reset(); CUR["key"] = key; SHOTS[key](n)
    if CHECK and "--face" in argv:   # DEBUG_FACE: print world forward (-Y local) of key characters
        from mathutils import Vector
        for c in (cous, tyler, mar):
            sc.frame_set(max(1, n // 2)); m = c.j["head"].matrix_world; fwd = (m.to_3x3() @ Vector((0, -1, 0))).normalized()
            print("FACE", key, c.name, "pos", tuple(round(v, 2) for v in m.translation), "fwd", tuple(round(v, 2) for v in fwd))
    if CHECK:
        hits = []
        for fr in sorted({1, max(1, n // 2), n}):
            hits += [h for h in find_collisions(EVERYONE, fr) if h not in hits and not h[0].startswith("MOM")]
        for h in hits: print("COLLIDE", sid, key, *h)
        if not hits: print("CLEAN", sid, key)
        continue
    sc.frame_start, sc.frame_end = 1, n; sc.render.resolution_x, sc.render.resolution_y = RES
    if STILLS or key in HELPERS:
        sc.frame_set(max(1, n // 2)); sc.render.filepath = os.path.join(OUT, f"{sid}_{key}.png"); bpy.ops.render.render(write_still=True)
    else:
        d = os.path.join(OUT, f"{sid}_{key}"); os.makedirs(d, exist_ok=True); sc.render.filepath = os.path.join(d, "f_"); bpy.ops.render.render(animation=True)
    print("RENDERED", sid, key, n, f"{time.time() - t0:.1f}s")
print("ALL DONE")
