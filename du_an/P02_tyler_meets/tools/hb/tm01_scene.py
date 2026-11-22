"""TM01 'Jaylen — Social Media Oversharer'. Sets: school bus (new) + library (new). Extras always move (hb_sets2.idle).
Usage: blender -b --python tools/hb/tm01_scene.py -- <timeline.json> <out_dir> [--stills] [--only K,K] [--res WxH] [--samples N]"""
import bpy, sys, os, json, math, random, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets2
for m_ in (hb_lib, hb_props, hb_sets2): importlib.reload(m_)
from hb_lib import *
from hb_props import phone
from hb_sets2 import school_bus, library, idle, breathe
import hb_details; importlib.reload(hb_details)
from hb_details import bus_details, library_details, realism_pass, scroll_outside

argv = sys.argv[sys.argv.index("--") + 1:]
TL, OUT = os.path.abspath(argv[0]), os.path.abspath(argv[1]); STILLS = "--stills" in argv
ONLY = set(argv[argv.index("--only") + 1].split(",")) if "--only" in argv else None
RES = tuple(int(v) for v in argv[argv.index("--res") + 1].split("x")) if "--res" in argv else (1080, 1920)
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 64
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")); P = lambda p: os.path.join(ROOT, p)
FPS = 30
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=SAMPLES)
BUS = 90; LIB = 120
bus = school_bus((BUS, 0, 0)); lib = library((LIB, 0, 0)); lights((0, 0, 0))
OUTSIDE = bus_details((BUS, 0, 0), bus['seats']); library_details((LIB, 0, 0))
SEAT_Z = -0.34   # bus seat 3 cm higher than the classroom chair
seat = lambda r, s, p: bus["seats"][(r, s, p)]
TX, TY = seat(2, 1, "window"); JX, JY = seat(3, 1, "window")
# library chairs at table 0 (Tyler + Kayla) and extras
LT = lib["tables"]
CH = mat("lib_chair", srgb("8a5a33"), 0.6)
lib_seats = []
for i, (x, y) in enumerate(LT):
    for dx in (-0.5, 0.5):
        box(f"lib_chair{i}{dx}", (0.45, 0.42, 0.05), (x + dx, y - 0.72, 0.46), CH); box(f"lib_chairb{i}{dx}", (0.45, 0.05, 0.42), (x + dx, y - 0.95, 0.7), CH)
        lib_seats.append((x + dx, y - 0.72))
LTX, LTY = lib_seats[0]; LKX, LKY = lib_seats[1]

def mk(name, **kw): return Char(name, **kw)
tyler = mk("ME", skin="f1c7a0", shirt="ffd23f", pants="3a3f47", shoes="f4f4f4", hair="1e1a18", hair_style="messy", print_img=P("assets/hb/prints/me_paused.png"))
jay = mk("JAY", skin="a86a45", shirt="1c1c22", pants="5b6472", shoes="f4f4f4", hair="1a120c", hair_style="beanie", beanie="3a3f5c",
         print_img=P("assets/hb/prints/jay_sadboy.png"), long_sleeves=True, mood="sad")
kay = mk("KAY", skin="8d5a3b", shirt="b9a4e6", pants="6f8fb8", shoes="f4f4f4", hair="2a1a12", hair_style="bun", print_img=P("assets/hb/prints/kay_frog.png"),
         build=0.95, long_sleeves=True, glasses=True, scrunchie="f2c94c")
libr = mk("LIBR", skin="f0c9a4", shirt="7a8f6a", pants="4a4a52", shoes="3b2a20", hair="c8c8c8", hair_style="bun", build=1.1, long_sleeves=True, glasses=True)
drv = mk("DRV", skin="c98c63", shirt="2c4a7a", pants="2a2f3a", shoes="222222", hair="3a2a1e", hair_style="buzz", build=1.2, mustache="3a2a1e")
jphone = phone("jay_phone", jay.j["el_R"], (0, -0.09, -0.32)); tphone = phone("me_phone", tyler.j["el_R"], (0, -0.09, -0.32)); kphone = phone("kay_phone", kay.j["el_R"], (0, -0.09, -0.32))
# breakfast sandwich in Jaylen's left hand (day 2)
from hb_props import chips_bag
_SWL = [("jsw_b1", (0.19, 0.15, 0.035), -0.050, "toast", "c98a3e"), ("jsw_let", (0.22, 0.17, 0.012), -0.026, "lettuce", "4fae3a"),
        ("jsw_egg", (0.2, 0.16, 0.022), -0.010, "egg", "f6d743"), ("jsw_ham", (0.21, 0.15, 0.012), 0.007, "ham", "e9738a"),
        ("jsw_b2", (0.19, 0.15, 0.035), 0.030, "toast", "c98a3e")]
sw = [box(nm, sz, (0, -0.14, -0.40 + dz), mat(mn, srgb(c), 0.8), jay.j["el_R"], 0.006, 2) for nm, sz, dz, mn, c in _SWL]   # held past the fingers
LOOKS = [("c98c63", "3f7fd1", "2a3550", "5a3a22", "messy"), ("f0c9a4", "e85d75", "4a4a4a", "c9a24a", "bun"), ("8d5a3b", "2fb37a", "2a2a2a", "141414", "buzz"),
         ("f3d2b5", "9b59b6", "34495e", "d1a06a", "messy"), ("6e4430", "f39c12", "283040", "121212", "bun"), ("e8b896", "e74c3c", "2c3e50", "8a5a33", "buzz"),
         ("b07a55", "1abc9c", "3d3d4a", "2a1a12", "messy"), ("f6d0b0", "f1c40f", "5d6d7e", "e0c068", "bun")]
ext = [mk(f"X{i}", skin=s, shirt=sh, pants=pa, shoes="eeeeee", hair=ha, hair_style=st) for i, (s, sh, pa, ha, st) in enumerate(LOOKS)]
BUS_EXTRAS = [((1, -1, "window"), "talk"), ((1, -1, "aisle"), "laugh"), ((2, -1, "window"), "phone"), ((4, 1, "aisle"), "look"),
              ((4, -1, "window"), "phone"), ((5, 1, "window"), "talk"), ((5, 1, "aisle"), "laugh"), ((1, 1, "window"), "look")]
LIB_EXTRAS = [(lib_seats[2], "read"), (lib_seats[3], "read"), (lib_seats[4], "phone"), (lib_seats[5], "read"), (lib_seats[6], "talk"), (lib_seats[7], "read"),
              ((LIB + 4.3, -1.8), "read"), ((LIB + 4.3, 0.6), "phone")]
cam, tgt = camera("cam", 30); bpy.context.scene.camera = cam
realism_pass(bpy.context.scene, grain=False)   # user 19/11: no grain/noise
if os.environ.get('QV'):   # QUALITY_HOOK
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import render_quality_test as _q; _q.apply()
ALL = list(bpy.data.objects); REST = {o.name: (tuple(o.location), tuple(o.rotation_euler), tuple(o.scale)) for o in ALL}
def show(objs, on, f=1):
    for o in objs: o.hide_render = not on; o.keyframe_insert("hide_render", frame=f)
def reset():
    for o in ALL:
        o.animation_data_clear(); l, r, s = REST[o.name]; o.location, o.rotation_euler, o.scale = l, r, s; o.hide_render = False
    cam.data.animation_data_clear()
def seat_char(c, x, y, f=1, z=SEAT_Z): c.place(f, x, y, z, 180); c.sit(f, arms_on_desk=False)
def scene_bus(n, day=1):
    seat_char(tyler, TX, TY); tyler.expr("neutral", 1)
    seat_char(jay, *((JX, JY) if day == 1 else (TX, TY)))
    if day == 2: tyler.place(1, *STAND, 0, 180); tyler.stand(1); tyler.pose(1, sh_L=(-170, 0, 0), el_L=(-10, 0, 0))
    dx, dy = BUS - 0.6, 5.62; drv.place(1, dx, dy, -0.30, 180); drv.sit(1); idle(drv, 1, n, "drive", 7)
    bus["wheel"].rotation_euler = (R(-55), 0, 0); bus["wheel"].keyframe_insert("rotation_euler", frame=1)
    bus["wheel"].rotation_euler = (R(-55), R(12), 0); bus["wheel"].keyframe_insert("rotation_euler", frame=max(2, n))
    for i, (c, (key, kind)) in enumerate(zip(ext, BUS_EXTRAS)):
        x, y = seat(*key); seat_char(c, x, y); idle(c, 1, n, kind, 100 + i)
    for c in (kay, libr): c.place(1, 0, -40, 0, 0)
    show(sw, day == 2)
    scroll_outside(OUTSIDE, n); breathe(tyler, 1, n, 1.0, 96, 1); breathe(jay, 1, n, 1.0, 88, 2); show([jphone] + [o for o in ALL if o.name == 'jay_phone_scr'], day == 1)
def scene_lib(n):
    seat_char(tyler, LTX, LTY, z=-0.37); seat_char(kay, LKX, LKY, z=-0.37); idle(kay, 1, n, "phone", 3)
    seat_char(jay, *lib_seats[3], z=-0.37); jay.expr("sad", 1); idle(jay, 1, n, "phone", 4)
    libr.place(1, lib["counter"][0], lib["counter"][1] - 0.6, 0, 180); libr.stand(1); idle(libr, 1, n, "look", 9, seated=False)
    for i, (c, ((x, y), kind)) in enumerate(zip(ext, LIB_EXTRAS)):
        if (x, y) == lib_seats[3]: c.place(1, 0, -40, 0, 0); continue
        seat_char(c, x, y, z=-0.37); idle(c, 1, n, kind, 200 + i)
    drv.place(1, 0, -40, 0, 0); show(sw, False); breathe(tyler, 1, n, 1.0, 96, 1)

PULL = 1.35
def _pull(p, l):
    d = math.dist(p, l); k = PULL if d < 2.2 else 1.0
    x, y, z = (b + (a - b) * k for a, b in zip(p, l))
    if x > 100:  # library room
        return (min(max(x, LIB - 5.25), LIB + 5.25), min(max(y, -4.8), 3.8), min(max(z, 0.3), 3.9))
    return (min(max(x, BUS - 1.05), BUS + 1.05), min(max(y, -5.3), 6.3), min(max(z, 0.5), 2.0))   # inside the bus
CUR = {'key': ''}
def cam_move(n, p0, l0, lens, p1=None, l1=None, sway=True):
    if not CUR['key'].startswith(('CU_', 'ECU_', 'INS_', 'POV_')): lens = max(16, lens * 0.8)
    cam_key(cam, tgt, 1, _pull(p0, l0), l0, lens)
    if sway and p0[0] < 100:      # gentle bus sway
        for f in range(1, n + 1, 10):
            q = _pull(p0, l0); cam_key(cam, tgt, f, (q[0] + 0.012 * math.sin(f * 0.7), q[1], q[2] + 0.01 * math.sin(f * 1.1)), l0, lens)
    cam_key(cam, tgt, n, _pull(p1 or p0, l1 or l0), l1 or l0, lens)
TF = lambda dz=1.45: (TX, TY, dz); JF = lambda dz=1.45: (JX, JY, dz)
STAND = (BUS + 0.05, TY - 0.35)          # day 2: Tyler stands in the aisle (no seat)
def bus_cu(n, x, y, z=1.45, dy=0.8, lens=30, side=-0.05):
    # inside the bus, close-ups come from the aisle at a 3/4 angle (straight-on cams hit the seat in front)
    lens = lens * 0.74; z = z + 0.04   # QA 19/11: CUs were cropping the head
    p0, p1 = (BUS + side, y + dy, z + 0.03), (BUS + side, y + dy - 0.07, z + 0.03)   # no pull-back here: it pushed the cam into the next row
    cam_key(cam, tgt, 1, p0, (x, y, z), lens)
    for f in range(1, n + 1, 10): cam_key(cam, tgt, f, (p0[0] + 0.01 * math.sin(f * 0.7), p0[1], p0[2] + 0.008 * math.sin(f * 1.1)), (x, y, z), lens)
    cam_key(cam, tgt, n, p1, (x, y, z), lens)

def jay_phone_up(f=1): jay.pose(f, sh_R=(-70, 0, -15), el_R=(-75, 0, 0))
# ---------------------------------------------------------------- shots
def OPEN_JAY_STORY(n):
    scene_bus(n); jay_phone_up(); jay.expr("happy", 1)
    for f in range(1, 42, 7):                                   # laughing at his phone: chest + head bounce
        up = ((f - 1) // 7) % 2 == 0
        jay.rot("chest", f, -8 if up else 2, 0, 0); jay.rot("head", f, -14 if up else -4, 0, 4)
    jay.expr("happy", 40); jay.expr("sad", 48)                 # instant switch on the pause (1.6 s)
    jay.rot("chest", 46, 0, 0, 0); jay.rot("chest", 60, 14, 0, 0); jay.rot("head", 46, -4, 0, 4); jay.rot("head", 62, 14, 0, -6)
    jay.rot("sh_R", 46, -70, 0, -15); jay.rot("sh_R", 62, -78, 0, -15)
    cam_move(n, (JX - 0.55, JY + 0.95, 1.45), JF(1.4), 30, (JX - 0.5, JY + 0.85, 1.45))
def CU_JAY_SAD(n):
    scene_bus(n); jay_phone_up(); jay.expr("sad", 1); jay.blink(n // 2)
    bus_cu(n, JX, JY, 1.45, 0.75, 32)
def WIDE_BUS_JAY(n):
    scene_bus(n); jay.expr("happy", 1); idle(jay, 1, n, "laugh", 5)
    cam_move(n, (BUS - 0.3, 5.2, 1.75), (BUS + 0.3, 1.0, 1.0), 22, (BUS - 0.3, 5.0, 1.73))
def CU_JAY_LAUGH(n):
    scene_bus(n); jay.expr("happy", 1); idle(jay, 1, n, "laugh", 6)
    cam_move(n, (JX - 0.45, JY + 0.85, 1.5), JF(1.45), 32, (JX - 0.42, JY + 0.78, 1.5))
def CU_ME_STARE(n):
    scene_bus(n); tyler.expr("deadpan", 1); tyler.blink(n // 2)
    cam_move(n, (TX - 0.5, TY + 0.85, 1.5), TF(), 32, (TX - 0.46, TY + 0.78, 1.5))
def BUS_DOOR(n):
    scene_bus(n); tyler.place(1, BUS + 0.8, 6.0, 0, 90); tyler.stand(1); tyler.walk(1, n, (BUS + 0.85, 6.1, 0), (BUS + 0.1, 5.4, 0), yaw=60)
    cam_move(n, (BUS - 0.6, 3.8, 1.7), (BUS + 0.5, 5.8, 1.2), 24, (BUS - 0.55, 3.9, 1.7))
def MS_ME_AISLE(n):
    scene_bus(n); tyler.walk(1, n, (BUS, 4.6, 0), (BUS, 3.2, 0), yaw=0); tyler.expr("deadpan", 1)
    cam_move(n, (BUS + 0.1, 1.2, 1.65), (BUS, 4.0, 1.4), 26, (BUS + 0.1, 1.0, 1.63))
def INS_SEAT(n):
    scene_bus(n); tyler.place(1, BUS, -40, 0, 0)
    cam_key(cam, tgt, 1, (BUS + 0.35, TY + 1.25, 1.55), (TX, TY - 0.05, 0.55), 24); cam_key(cam, tgt, n, (BUS + 0.3, TY + 1.1, 1.5), (TX, TY - 0.05, 0.55), 24)
def CU_ME_SIT(n):
    scene_bus(n); tyler.expr("happy", 1); tyler.place(1, TX - 0.3, TY, SEAT_Z + 0.1, 150); tyler.place(8, TX, TY, SEAT_Z, 180)
    cam_move(n, (TX - 0.55, TY + 0.95, 1.5), TF(1.35), 28, (TX - 0.5, TY + 0.88, 1.5))
def CU_ME_CONFUSED(n):
    scene_bus(n); tyler.pose(1, sh_R=(-60, 0, -10), el_R=(-80, 0, 0)); tyler.expr("annoyed", 1)
    for b in tyler.brows: b.rotation_euler = (0, R(12), 0); b.keyframe_insert("rotation_euler", frame=1)
    cam_move(n, (TX - 0.35, TY + 0.8, 1.52), TF(1.47), 34, (TX - 0.32, TY + 0.73, 1.52))
def CU_ME_READ(n):
    scene_bus(n); tyler.pose(1, sh_R=(-60, 0, -10), el_R=(-80, 0, 0)); tyler.rot("head", 1, 15, 0, 0); tyler.expr("deadpan", 1)
    cam_move(n, (TX - 0.6, TY + 0.6, 1.55), TF(1.4), 30, (TX - 0.55, TY + 0.55, 1.55))
def CU_ME_ANNOYED(n):
    scene_bus(n); tyler.expr("annoyed", 1); tyler.expr("yell", n // 3); tyler.expr("annoyed", 2 * n // 3)
    bus_cu(n, TX, TY, 1.45, 0.7, 34, 0.1)
def WIDE_SEAT(n):
    scene_bus(n); tyler.expr("deadpan", 1)
    cam_move(n, (BUS - 0.6, TY + 2.1, 1.8), (TX, TY - 0.4, 0.9), 24, (BUS - 0.55, TY + 2.0, 1.78))
def CU_ME_DEADPAN(n):
    scene_bus(n); tyler.expr("deadpan", 1); tyler.blink(n // 2)
    cam_move(n, (TX - 0.65, TY + 0.55, 1.48), TF(), 34, (TX - 0.6, TY + 0.5, 1.48))
def CU_ME_TURN(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, 180); tyler.place(8, TX, TY, SEAT_Z, 330); tyler.expr("annoyed", 1)
    cam_move(n, (BUS - 0.05, TY - 0.75, 1.55), TF(1.45), 30, (BUS - 0.05, TY - 0.7, 1.55))
def TWO_SHOT_SEATS(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, -30); jay.expr("happy", 1); jay_phone_up()
    cam_move(n, (BUS - 0.5, (TY + JY) / 2 + 0.2, 1.7), (BUS + 0.85, (TY + JY) / 2, 1.25), 24, (BUS - 0.45, (TY + JY) / 2 + 0.25, 1.7))
def CU_JAY_SMILE(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, -30); jay.expr("happy", 1); jay.blink(n // 2)
    cam_move(n, (JX - 0.5, JY + 0.75, 1.5), JF(), 32, (JX - 0.46, JY + 0.7, 1.5))
def CU_JAY_THUMBS(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, -30); jay.expr("happy", 1)
    jay.pose(1, sh_L=(-40, 0, 20), el_L=(-60, 0, 0)); jay.pose(6, sh_L=(-90, 0, 30), el_L=(-100, 0, 0))
    bus_cu(n, JX, JY, 1.45, 0.7, 30, 0.3)
def CU_JAY_TYPING(n):
    scene_bus(n); jay_phone_up(); jay.expr("sad", 1); jay.rot("head", 1, 14, 0, 0)
    for f in range(1, n, 4): jay.rot("el_R", f, -75 + (4 if (f // 4) % 2 else -4))
    bus_cu(n, JX, JY, 1.42, 0.8, 34, 0.0)
def CU_ME_DEADPAN2(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, -30); tyler.expr("deadpan", 1)
    cam_move(n, (BUS + 0.1, TY - 0.6, 1.5), TF(1.47), 36, (BUS + 0.1, TY - 0.56, 1.5))
def TWO_SHOT_CLOSE(n):
    scene_bus(n); tyler.place(1, TX, TY, SEAT_Z, 180); jay.expr("sad", 1); jay_phone_up()
    jay.place(1, JX, JY + 0.15, SEAT_Z, 180); jay.rot("chest", 1, 25, 0, 0)    # leaning over Tyler's seat
    cam_move(n, (BUS - 0.4, TY + 0.3, 1.55), (TX - 0.05, TY - 0.45, 1.5), 26, (BUS - 0.35, TY + 0.25, 1.55))
def WIDE_LIBRARY(n):
    scene_lib(n); tyler.expr("deadpan", 1)
    cam_move(n, (LIB + 3.8, -4.4, 2.6), (LIB - 1.0, 0.6, 0.9), 22, (LIB + 3.6, -4.2, 2.55))
def MS_KAY_SHOW(n):
    scene_lib(n); idle(kay, 1, 1, "phone", 3); kay.pose(1, sh_R=(-60, 0, 30), el_R=(-60, 0, 0)); kay.expr("deadpan", 1)
    kay.rot("sh_R", n // 3, -85, 0, 45); tyler.rot("head", 1, 0, 0, -20); tyler.expr("deadpan", 1)
    cam_move(n, ((LTX + LKX) / 2, LTY + 1.6, 1.55), ((LTX + LKX) / 2, LTY, 1.2), 26, ((LTX + LKX) / 2, LTY + 1.5, 1.55))
def CU_KAY(n):
    scene_lib(n); kay.pose(1, sh_R=(-85, 0, 45), el_R=(-60, 0, 0)); kay.expr("deadpan", 1); kay.expr("smug", n // 2)
    cam_move(n, (LKX + 0.35, LKY + 1.15, 1.5), (LKX, LKY, 1.38), 30, (LKX + 0.32, LKY + 1.07, 1.5))
def WIDE_LIB_STARE(n):
    scene_lib(n); tyler.expr("worried" if False else "shock", 1)
    for i, c in enumerate(ext):
        c.rot("head", 4 + i, 0, 0, 0)    # everyone turns their head toward Tyler
        c.rot("head", 10 + i, 0, 0, 25 if i % 2 else -25)
        c.expr("deadpan", 1)
    cam_move(n, (LTX + 0.2, LTY + 3.0, 2.0), (LTX + 1.4, LTY - 1.2, 1.0), 22, (LTX + 0.2, LTY + 2.9, 1.98))
def CU_LIBRARIAN(n):
    scene_lib(n); libr.expr("annoyed", 1); libr.pose(4, sh_R=(-110, 0, -10), el_R=(-90, 0, 0)); libr.expr("deadpan", 8)
    lx, ly = lib["counter"][0], lib["counter"][1] - 0.6
    cam_move(n, (lx + 0.2, ly + 1.1, 1.8), (lx, ly, 1.75), 32, (lx + 0.18, ly + 1.0, 1.8))
def WIDE_BUS2(n):
    scene_bus(n, day=2); jay.expr("happy", 1); jay.pose(1, sh_R=(-70, 0, -15), el_R=(-80, 0, 0))
    cam_move(n, (BUS - 0.5, TY + 2.4, 1.8), (TX, TY, 1.1), 22, (BUS - 0.45, TY + 2.3, 1.78))
def CU_JAY_EAT(n):
    scene_bus(n, day=2); jay.expr("happy", 1)
    jay.pose(1, sh_R=(-60, 0, -10), el_R=(-70, 0, 0)); jay.pose(n // 2, sh_R=(-80, 0, -10), el_R=(-85, 0, 0)); jay.expr("chill", n // 2)
    bus_cu(n, TX, TY, 1.4, 0.9, 30, 0.1)
def INS_SANDWICH_BITE(n):
    scene_bus(n, day=2); jay.pose(1, sh_R=(-95, 0, -25), el_R=(-95, 0, 0)); jay.expr("happy", 1)
    cam_key(cam, tgt, 1, (BUS + 0.15, TY + 0.55, 1.42), (TX - 0.2, TY - 0.05, 1.4), 40); cam_key(cam, tgt, n, (BUS + 0.17, TY + 0.5, 1.42), (TX - 0.2, TY - 0.05, 1.4), 40)
def CU_ME_DEFEATED(n):
    scene_bus(n, day=2); tyler.expr("annoyed", 1)   # holding the rail
    for b in tyler.brows: b.rotation_euler = (0, 0, 0)
    tx, ty = STAND
    cam_key(cam, tgt, 1, (BUS - 0.05, ty + 1.3, 1.8), (tx, ty, 1.72), 26); cam_key(cam, tgt, n, (BUS - 0.05, ty + 1.22, 1.79), (tx, ty, 1.72), 26)
def CU_ME_STANDING(n):
    scene_bus(n, day=2); tyler.expr("deadpan", 1)
    tx, ty = STAND
    cam_move(n, (BUS - 0.2, ty + 2.0, 1.75), (tx + 0.3, ty, 1.35), 24, (BUS - 0.2, ty + 1.9, 1.74))
def CU_JAY_PEACE(n):
    scene_bus(n, day=2); jay.expr("chill", 1); jay.rot("head", 1, -8, 0, 0); jay.blink(n // 2)
    jay.pose(1, sh_R=(-60, 0, -15), el_R=(-70, 0, 0))
    bus_cu(n, TX, TY, 1.45, 0.75, 34, 0.2)
def POV_SANDWICH(n):   # still for the 'Can't trust nobody' story
    INS_SANDWICH_BITE(n)
def POV_PEACE(n):      # still for the final story
    CU_JAY_PEACE(n)
def POV_BUS(n):        # background still for phone inserts
    scene_bus(n); cam_move(n, (BUS - 0.3, 5.2, 1.75), (BUS + 0.3, 1.0, 1.0), 22)
def POV_LIB(n):
    scene_lib(n); cam_move(n, (LIB + 3.8, -4.4, 2.6), (LIB - 1.0, 0.6, 0.9), 22)

SHOTS = {k: v for k, v in globals().items() if k.isupper() and callable(v) and k not in ("P", "R", "TF", "JF")}
T = json.load(open(TL, encoding="utf-8")); os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
todo = [(s["id"], s["key"], round(s["end"] * FPS) - round(s["start"] * FPS)) for s in T["shots"]] + [("POV", k, 20) for k in ("POV_SANDWICH", "POV_PEACE", "POV_BUS", "POV_LIB")]
for sid, key, n in todo:
    if key not in SHOTS or (ONLY and key not in ONLY): continue
    t0 = time.time(); reset(); CUR['key'] = key; SHOTS[key](n)
    if "--check" in argv:
        hits = []
        for fr in sorted({1, max(1, n // 2), n}):
            hits += [h for h in find_collisions([tyler, jay, kay, libr, drv] + ext, fr) if h not in hits and not h[0].startswith("DRV")]
        for h in hits: print("COLLIDE", sid, key, *h)
        if not hits: print("CLEAN", sid, key)
        continue
    sc.frame_start, sc.frame_end = 1, n; sc.render.resolution_x, sc.render.resolution_y = RES
    if STILLS or key.startswith("POV_"):
        sc.frame_set(max(1, n // 2)); sc.render.filepath = os.path.join(OUT, f"{sid}_{key}.png"); bpy.ops.render.render(write_still=True)
    else:
        d = os.path.join(OUT, f"{sid}_{key}"); os.makedirs(d, exist_ok=True); sc.render.filepath = os.path.join(d, "f_"); bpy.ops.render.render(animation=True)
    print("RENDERED", sid, key, n, f"{time.time() - t0:.1f}s")
print("ALL DONE")
