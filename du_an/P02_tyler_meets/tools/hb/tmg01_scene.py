"""TMG01 — Brody, the GTA 6 addict (trend special). 4 sets: school crosswalk, auditorium, nurse's office, lunch patio.
Usage: blender -b --python tools/hb/tmg01_scene.py -- <timeline.json> <out_dir> [--stills] [--check] [--only K,K] [--res WxH] [--samples N]"""
import bpy, sys, os, json, math, random, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets2, hb_sets4, hb_sets5
for m_ in (hb_lib, hb_props, hb_sets2, hb_sets4, hb_sets5): importlib.reload(m_)
from hb_lib import *
from hb_props import phone, tex_quad
from hb_sets2 import idle, breathe
from hb_sets4 import _cyl, _sph
from hb_sets5 import crosswalk, auditorium, nurse_office, patio

argv = sys.argv[sys.argv.index("--") + 1:]
TL, OUT = os.path.abspath(argv[0]), os.path.abspath(argv[1]); STILLS = "--stills" in argv; CHECK = "--check" in argv
ONLY = set(argv[argv.index("--only") + 1].split(",")) if "--only" in argv else None
RES = tuple(int(v) for v in argv[argv.index("--res") + 1].split("x")) if "--res" in argv else (1080, 1920)
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 64
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")); P = lambda p: os.path.join(ROOT, p)
FPS = 30
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=SAMPLES)
CW, AU, NU, PT = 270, 300, 330, 360
cw = crosswalk((CW, 0, 0)); au = auditorium((AU, 0, 0)); nu = nurse_office((NU, 0, 0)); pt = patio((PT, 0, 0)); lights((0, 0, 0))
SUN = bpy.data.objects["sun"]
FILLS = {}
for nm, loc, en, sz in (("fill_cw", (CW, 1.0, 4.0), 0, 6), ("fill_au", (AU, 2.0, 5.6), 1500, 8), ("fill_stage", (AU, 5.5, 5.0), 900, 5),
                        ("fill_nu", (NU, -1.0, 2.85), 320, 3), ("fill_pt", (PT, -1.0, 4.0), 0, 6)):
    L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = sz; fo = bpy.data.objects.new(nm, L); bpy.context.scene.collection.objects.link(fo); fo.location = loc; FILLS[nm] = L

MK = lambda name, **kw: Char(name, **kw)
tyler = MK("ME", skin="f1c7a0", shirt="ffd23f", pants="3a3f47", shoes="f4f4f4", hair="1e1a18", hair_style="messy", print_img=P("assets/hb/prints/me_paused.png"))
bro = MK("BRO", skin="d9a27a", shirt="b8ff3b", pants="3d3d4a", shoes="f4f4f4", hair="4a2f1e", hair_style="messy", print_img=P("assets/hb/prints/bro_mission.png"),
         long_sleeves=True, mood="happy")
# Brody extras: tired eye bags, gaming headset round the neck, flip-flop soles under white socks, energy drink
BAG = mat("bro_bags", srgb("7a5a8c"), 0.8)
for k, x in (("L", -0.085), ("R", 0.085)):
    box(f"BRO_bag{k}", (0.075, 0.012, 0.02), (x, -0.234, 0.238), BAG, bro.j["head"], 0.006, 1)
bpy.ops.mesh.primitive_torus_add(major_radius=0.15, minor_radius=0.025, location=(0, 0, 0))
hs = bpy.context.active_object; hs.name = "BRO_headset"; hs.data.materials.append(mat("headset", srgb("1b1b1f"), 0.4)); hs.parent = bro.j["chest"]; hs.location = (0, -0.02, 0.6); hs.rotation_euler = (R(12), 0, 0)
for sx in (-1, 1):
    _cyl(f"BRO_cup{sx}", 0.07, 0.05, (sx * 0.15, -0.06, 0.6), mat("headset_cup", srgb("e63c28"), 0.4), (0, R(90), 0), 14, bro.j["chest"])
    box(f"BRO_flop{sx}", (0.2, 0.31, 0.025), (0, -0.05, -0.455), mat("flipflop", srgb("1f6fd6"), 0.6), bro.j["kn_" + ("L" if sx < 0 else "R")])
can = _cyl("BRO_can", 0.04, 0.15, (0, -0.02, -0.36), mat("can_body", srgb("12c2e9"), 0.3), (0, 0, 0), 14, bro.j["el_L"])
box("BRO_canstripe", (0.084, 0.084, 0.03), (0, -0.02, -0.36), mat("can_stripe", srgb("ff2e88"), 0.3), bro.j["el_L"])
bphone = phone("bro_phone", bro.j["el_R"], (0, -0.09, -0.32))

guard = MK("GUARD", skin="8d5a3b", shirt="ff8c1a", pants="2c3e50", shoes="222222", hair="9a9a9a", hair_style="buzz", build=1.18, mustache="9a9a9a", long_sleeves=True, mood="annoyed")
for z in (0.18, 0.36): box(f"GUARD_reflect{z}", (0.47 * 1.18, 0.28, 0.035), (0, 0, z), mat("reflect", srgb("e8f0f2"), 0.2), guard.j["chest"])
spole = box("GUARD_stoppole", (0.03, 0.03, 0.9), (0, -0.02, -0.75), mat("stop_pole", srgb("9aa0a6"), 0.3), guard.j["el_L"])
stopq = tex_quad("GUARD_stop", 0.42, 0.42, "tmg_stop.png", (0, -0.035, -1.25), (R(90), 0, 0)); stopq.parent = guard.j["el_L"]
mon = MK("MON", skin="f0c9a4", shirt="dfe6ee", pants="34495e", shoes="222222", hair="3a2a1e", hair_style="buzz", tie="c0392b", glasses=True, long_sleeves=True, mood="angry", build=1.05)
prin = MK("PRIN", skin="c98c63", shirt="f4f4f4", pants="2c3e50", shoes="222222", hair="5a4a3e", hair_style="bald", tie="1f4e8c", jacket="2c3e50", sleeves="2c3e50",
          long_sleeves=True, glasses=True, mustache="3a2a1e", build=1.15, mood="deadpan")
nurse = MK("NURSE", skin="f3d2b5", shirt="5dade2", pants="5dade2", shoes="f4f4f4", hair="7a4a2e", hair_style="bun", glasses=True, female=True, mood="happy", build=1.05)
granola = box("granola", (0.06, 0.13, 0.03), (0, -0.07, -0.37), mat("granola", srgb("c8892e"), 0.7), nurse.j["el_R"])
bgran = box("bro_granola", (0.06, 0.13, 0.03), (0, -0.07, -0.37), mat("granola", srgb("c8892e"), 0.7), bro.j["el_R"])
slip_p = tex_quad("prin_slip", 0.2, 0.12, "tmg_detention.png", (0, -0.08, -0.33), (R(90), 0, 0)); slip_p.parent = prin.j["el_R"]
LOOKS = [("c98c63", "3f7fd1", "2a3550", "5a3a22", "messy", False), ("f0c9a4", "e85d9c", "4a4a4a", "c9a24a", "ponytail", True), ("8d5a3b", "e67e22", "2a2a2a", "141414", "buzz", False),
         ("f3d2b5", "9b59b6", "34495e", "d1a06a", "messy", False), ("6e4430", "16a085", "283040", "121212", "bun", True), ("e8b896", "e74c3c", "2c3e50", "8a5a33", "buzz", False),
         ("b07a55", "7f8c8d", "3d3d4a", "2a1a12", "waves", False), ("f6d0b0", "2980b9", "5d6d7e", "e0c068", "ponytail", True), ("a86a45", "f1c40f", "2c3e50", "1a120c", "messy", False),
         ("f0c9a4", "1abc9c", "4a4a4a", "6b4a2f", "bun", True), ("7a4a2e", "c0392b", "283040", "141414", "buzz", False), ("e8b896", "34495e", "6f8fb8", "c9a24a", "messy", False)]
ext = [MK(f"X{i}", skin=s, shirt=sh, pants=pa, shoes="eeeeee", hair=ha, hair_style=st, female=fe, build=0.94 if fe else 1.0)
       for i, (s, sh, pa, ha, st, fe) in enumerate(LOOKS)]
# Tyler's lunch sandwich (world object, baked onto hands per shot) + crumbs
SWL = [("tsw_b1", (0.19, 0.15, 0.035), -0.05, "toast", "c98a3e"), ("tsw_let", (0.22, 0.17, 0.012), -0.026, "lettuce", "4fae3a"),
       ("tsw_ham", (0.21, 0.15, 0.016), -0.01, "ham", "e9738a"), ("tsw_ch", (0.2, 0.17, 0.008), 0.004, "cheese", "f5c518"), ("tsw_b2", (0.19, 0.15, 0.035), 0.028, "toast", "c98a3e")]
SW = empty("tyler_sandwich", (0, -80, 0))
for nm, sz, dz, mn, c in SWL: box(nm, sz, (0, 0, dz), mat(mn, srgb(c), 0.8), SW, 0.006, 2)
crumbs = [box(f"crumb{k}", (0.025, 0.02, 0.012), (0, -80, 0), mat("toast", srgb("c98a3e"), 0.8)) for k in range(7)]
slip_t = tex_quad("table_slip", 0.34, 0.2, "tmg_detention.png", (0, -80, 0), (0, 0, 0))
cam, tgt = camera("cam", 28); bpy.context.scene.camera = cam
ALL = list(bpy.data.objects); REST = {o.name: (tuple(o.location), tuple(o.rotation_euler), tuple(o.scale)) for o in ALL}
EVERYONE = [tyler, bro, guard, mon, prin, nurse] + ext
PROPS = [bphone, bpy.data.objects["bro_phone_scr"], granola, bgran, slip_p, slip_t] + crumbs
def show(objs, on, f=1):
    for o in objs: o.hide_render = not on; o.keyframe_insert("hide_render", frame=f)
EMIT = {m.name: m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value for m in bpy.data.materials if m.node_tree and "Principled BSDF" in m.node_tree.nodes}
def reset():
    for m in bpy.data.materials:
        if m.node_tree and m.name in EMIT:
            m.node_tree.animation_data_clear(); m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = EMIT[m.name]
    for o in ALL:
        o.animation_data_clear(); l, r, s = REST[o.name]; o.location, o.rotation_euler, o.scale = l, r, s; o.hide_render = False
    cam.data.animation_data_clear()
OFF = lambda c: c.place(1, 0, -80, 0, 0)
W = bpy.context.scene.world.node_tree.nodes["Background"]
def world(kind):
    if kind == "out":   # bright morning / noon sky
        W.inputs[0].default_value = (0.42, 0.62, 0.92, 1); W.inputs[1].default_value = 0.75; SUN.data.energy = 4.8
    else:
        W.inputs[0].default_value = (0.85, 0.82, 0.78, 1); W.inputs[1].default_value = 0.55; SUN.data.energy = 4.5
def all_off(kind="in"):
    for c in EVERYONE: OFF(c)
    show(PROPS, False); SW.location = (0, -80, 0); world(kind)
def bake_to(obj, char, joint, f0, f1, off=(0, 0, 0.05), rot=None):
    """keyframe a world-space prop onto a moving hand (frame by frame) between f0 and f1"""
    sc = bpy.context.scene
    for f in range(f0, f1 + 1):
        sc.frame_set(f); h = char.j[joint].matrix_world.translation
        obj.location = (h.x + off[0], h.y + off[1], h.z + off[2]); obj.keyframe_insert("location", frame=f)
        if rot: obj.rotation_euler = rot; obj.keyframe_insert("rotation_euler", frame=f)
def run(c, f0, f1, p0, p1):   # quick run: shorter step, bigger arm swing, slight lean
    c.walk(f0, f1, p0, p1, step=5)
    for f in range(f0, f1 + 1, 5): c.rot("chest", f, 10, 0, 0)
def flash(obj, n, every=6, on=7.0, phase=0):
    m = obj.data.materials[0]; e = m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
    for f in range(1, n + 1, every):
        e.default_value = on if (f // every + phase) % 2 == 0 else 0.0; e.keyframe_insert("default_value", frame=f)
def chew(c, n, every=6, f0=1):
    for f in range(f0, n + 1, every):
        c.mouth.scale = (1.1, 1, 1.7 if (f // every) % 2 else 0.7); c.mouth.keyframe_insert("scale", frame=f)
def sit_at(c, x, y, yaw, f=1, arms=False):
    c.place(f, x, y, -0.34, yaw); c.sit(f, arms_on_desk=arms)

# ---------------------------------------------------------------- 1 CROSSWALK (morning)
TX, TY = CW + 0.7, 4.2; BX, BY = CW - 0.25, 4.1
CART0 = (CW + 4.4, 2.0)
def scene_cw(n, bro_at=True, cart_x=None):
    all_off("out"); FILLS["fill_cw"].energy = 250
    tyler.place(1, TX, TY, 0, -90); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    if bro_at: bro.place(1, BX, BY, 0, 90); bro.stand(1); bro.expr("happy", 1); breathe(bro, 1, n, 1.4, 60, 2)
    guard.place(1, CW + 0.2, 0.9, 0, 90); guard.stand(1); guard.pose(1, sh_L=(-150, 0, 10), el_L=(-10, 0, 0)); idle(guard, 1, n, "look", 11)
    guard.pose(1, sh_L=(-150, 0, 10), el_L=(-10, 0, 0))
    # kids crossing on the zebra, kids on the far sidewalk, a mom waving at the bus
    for i, (c, x, y0, y1) in enumerate(((ext[0], CW - 1.4, -4.6, 2.6), (ext[1], CW - 0.7, -5.4, 1.8), (ext[2], CW + 1.45, 4.9, -2.0), (ext[3], CW + 0.95, -4.0, 3.0))):
        span = 1.25 * n / 30; d = 1 if y1 > y0 else -1
        c.walk(1, n, (x, y0, 0.0), (x, y0 + d * min(span, abs(y1 - y0)), 0.0))
    for i, (c, (x, y, yaw), kind) in enumerate(zip(ext[4:9], ((CW - 4.4, 5.3, -60), (CW - 3.8, 5.6, 120), (CW + 6.2, 5.2, 180), (CW - 7.2, -4.6, 20), (CW + 3.0, -5.0, -20)),
                                                    ("talk", "talk", "phone", "look", "phone"))):
        c.place(1, x, y, 0.12, yaw); c.stand(1); idle(c, 1, n, kind, 120 + i)
    for k, lmp in enumerate(cw["lamps"]): flash(lmp, n, 15, 6.0, k)   # school-zone beacon blinks alternately
    g = cw["cart"]; g.location = (CART0[0] if cart_x is None else cart_x, CART0[1], 0); g.keyframe_insert("location", frame=1)
PULL = 1.3
CUR = {"key": ""}
def _clamp(p):
    x, y, z = p
    if x < 285: return (x, min(max(y, -8.5), 8.8), min(max(z, 0.3), 9.0))
    if x < 315: return (min(max(x, AU - 7.8), AU + 7.8), min(max(y, -8.8), 8.4), min(max(z, 0.4), 6.8))
    if x < 345: return (min(max(x, NU - 3.1), NU + 3.1), min(max(y, -5.8), 2.9), min(max(z, 0.4), 2.9))
    return (x, y, max(z, 0.3))
def cam_move(n, p0, l0, lens, p1=None, l1=None):
    close = CUR["key"].startswith(("CU_", "ECU_", "INS_", "POV_"))
    if not close: lens = max(16, lens * 0.82)
    k = (1.0 if CUR["key"].startswith(("INS_", "POV_")) else 1.3) if close else PULL
    pull = lambda p, l: _clamp(tuple(b + (a - b) * k for a, b in zip(p, l)))
    cam_key(cam, tgt, 1, pull(p0, l0), l0, lens); cam_key(cam, tgt, n, pull(p1 or p0, l1 or l0), l1 or l0, lens)
def headpos(c, f=1, dz=0.27):
    bpy.context.scene.frame_set(f); h = c.j["head"].matrix_world.translation; return (h.x, h.y, h.z + dz)

def OPEN_BRO_RUN(n):
    scene_cw(n, bro_at=False); tyler.place(1, TX, TY, 0, -60)
    run(bro, 1, n - 10, (CW - 5.5, 4.4, 0), (BX, BY, 0)); bro.stand(n - 6); bro.expr("happy", 1)
    bro.pose(n - 6, chest=(-12, 0, 0), sh_L=(-60, 0, 25), el_L=(-60, 0, 0), sh_R=(-40, 0, -25)); bro.pose(n, chest=(-4, 0, 0))   # skids to a stop
    tyler.expr("shock", n - 8)
    cam_key(cam, tgt, 1, (CW - 1.0, 1.5, 1.5), (CW - 3.6, 4.4, 1.25), 24); cam_key(cam, tgt, n, (CW - 0.9, 1.6, 1.5), (CW + 0.1, 4.2, 1.3), 24)
def CU_BRO_HYPE(n):
    scene_cw(n); bro.expr("yell", 1); bro.expr("happy", n // 2); bro.expr("yell", n - 22)
    for k, f in enumerate(range(1, n - 20, 10)):   # steering-wheel mime
        a = 18 if k % 2 else -18
        bro.pose(f, sh_L=(-75, 0, 18), el_L=(-60, 0, 0), sh_R=(-75, 0, -18), el_R=(-60, 0, 0), chest=(4, 0, a * 0.6), head=(0, 0, a * 0.3))
    bro.pose(n - 14, chest=(6, 0, -24), head=(0, 12, 0), sh_L=(-90, 0, 30), el_L=(-50, 0, 0), sh_R=(-90, 0, -40), el_R=(-50, 0, 0))   # "Skrrrt!" drift lean
    hx, hy, hz = headpos(bro)
    cam_move(n, (hx + 0.75, hy - 0.75, hz - 0.05), (hx, hy, hz - 0.12), 30, (hx + 0.7, hy - 0.7, hz - 0.05))
def CU_ME_WTF(n):
    scene_cw(n); tyler.place(1, TX, TY, 0, -90); tyler.place(6, TX, TY, 0, 22); tyler.expr("deadpan", 1); tyler.blink(n // 2)
    hx, hy, hz = headpos(tyler, 8)
    cam_move(n, (hx + 0.35, hy - 0.85, hz - 0.03), (hx, hy, hz - 0.08), 34, (hx + 0.33, hy - 0.8, hz - 0.03))
def WIDE_CROSS_BRO(n):
    scene_cw(n); bro.expr("happy", 1); idle(bro, 1, n, "look", 7)
    cam_key(cam, tgt, 1, (CW + 2.2, -0.9, 2.0), (CW - 0.1, 3.9, 1.15), 20); cam_key(cam, tgt, n, (CW + 2.0, -0.7, 1.95), (CW - 0.1, 3.9, 1.15), 20)
def INS_ENERGY_CAN(n):
    scene_cw(n); bro.pose(1, sh_L=(-55, 0, 12), el_L=(-75, 0, 0))
    for f in range(1, n, 3): bro.rot("el_L", f, -75 + (2.5 if (f // 3) % 2 else -2.5), 0, 0)   # caffeine tremble (small)
    bpy.context.scene.frame_set(1); h = can.matrix_world.translation.copy()
    cam_key(cam, tgt, 1, (h.x + 0.35, h.y - 0.32, h.z + 0.12), (h.x, h.y, h.z), 40); cam_key(cam, tgt, n, (h.x + 0.32, h.y - 0.29, h.z + 0.11), (h.x, h.y, h.z), 40)
def MS_BRO_YAWN(n):
    scene_cw(n); bro.expr("happy", 1); bro.expr("shock", n // 4); bro.expr("happy", 3 * n // 4)
    bro.pose(n // 4, sh_L=(-150, 0, 20), el_L=(-40, 0, 0), sh_R=(-150, 0, -20), el_R=(-40, 0, 0), chest=(-8, 0, 0)); bro.pose(3 * n // 4, sh_L=(0, 4, 0), sh_R=(0, -4, 0), el_L=(-8, 0, 0), el_R=(-8, 0, 0), chest=(0, 0, 0))
    hx, hy, hz = headpos(bro)
    cam_move(n, (hx + 1.2, hy - 1.4, hz - 0.3), (hx, hy, hz - 0.55), 26, (hx + 1.12, hy - 1.3, hz - 0.3))
def OTS_BRO_CART(n):
    scene_cw(n); bro.place(1, BX, BY, 0, 90); bro.rot("head", 1, 0, 0, 0); bro.rot("head", 14, 0, 0, 45); bro.expr("shock", 14); bro.expr("happy", 24)
    hx, hy, hz = headpos(bro)
    cam_key(cam, tgt, 1, (hx - 0.6, hy - 0.45, hz + 0.08), (CART0[0], CART0[1], 1.0), 26); cam_key(cam, tgt, n, (hx - 0.55, hy - 0.42, hz + 0.08), (CART0[0], CART0[1], 1.0), 26)
def INS_BRO_TRIANGLE(n):
    scene_cw(n); OFF(tyler); OFF(ext[2]); OFF(ext[3]); bro.place(1, BX, BY, 0, 66); bro.expr("focused", 1)
    for f, ext_ in ((1, False), (12, True), (20, False), (30, True), (38, False), (50, True)):
        bro.pose(f, sh_R=(-92, 0, -8), el_R=(-5 if ext_ else -45, 0, 0))   # presses "triangle" in the air
    bpy.context.scene.frame_set(12); h = bro.j["hand_R"].matrix_world.translation.copy()
    fx, fy = math.sin(R(66)), -math.cos(R(66)); rx, ry = -fy, fx
    c0 = (h.x - fx * 0.75 + rx * 0.35, h.y - fy * 0.75 + ry * 0.35, h.z + 0.2)
    cam_key(cam, tgt, 1, c0, (h.x + fx * 0.6, h.y + fy * 0.6, h.z - 0.1), 28); cam_key(cam, tgt, n, (c0[0] + fx * 0.05, c0[1] + fy * 0.05, c0[2]), (h.x + fx * 0.6, h.y + fy * 0.6, h.z - 0.1), 28)
def bro_in_cart(f=1):
    x = cw["cart"].location.x
    bro.place(f, x - 0.25, CART0[1], -0.07, 90); bro.sit(f, arms_on_desk=False); bro.pose(f, sh_L=(-70, 0, 10), el_L=(-45, 0, 0), sh_R=(-70, 0, -10), el_R=(-45, 0, 0))
def MS_CART_ALARM(n):
    scene_cw(n, bro_at=False); bro_in_cart(); bro.expr("happy", 1); flash(cw["beacon"], n, 4, 9.0)
    guard.place(1, CW + 2.3, 0.9, 0, -60); guard.stand(1); guard.expr("yell", 1); guard.pose(1, sh_R=(-95, 0, -10), el_R=(-5, 0, 0), sh_L=(-150, 0, 10), el_L=(-10, 0, 0))
    guard.walk(6, n, (CW + 2.3, 0.9, 0), (CW + 2.85, 1.0, 0)); guard.pose(n, sh_R=(-95, 0, -10), el_R=(-5, 0, 0))
    cam_key(cam, tgt, 1, (CW + 2.3, -1.0, 1.8), (CW + 3.8, 1.8, 1.15), 24); cam_key(cam, tgt, n, (CW + 2.35, -0.9, 1.78), (CW + 3.8, 1.8, 1.15), 24)
def WIDE_CART_SLOW(n):
    scene_cw(n, bro_at=False); g = cw["cart"]; x0 = CART0[0]; g.location = (x0, CART0[1], 0); g.keyframe_insert("location", frame=1)
    g.location = (x0 + 0.06 * n / 30 * 1.8, CART0[1], 0); g.keyframe_insert("location", frame=n)   # 4 mph... feels like 0.1
    for fc in (g.animation_data.action.fcurves if g.animation_data and hasattr(g.animation_data.action, "fcurves") else []):
        for kp in fc.keyframe_points: kp.interpolation = "LINEAR"
    flash(cw["beacon"], n, 4, 9.0)
    for f in (1, n): bro.place(f, (x0 if f == 1 else x0 + 0.06 * n / 30 * 1.8) - 0.25, CART0[1], -0.07, 90)
    bro.sit(1, arms_on_desk=False); bro.pose(1, sh_L=(-70, 0, 10), el_L=(-45, 0, 0), sh_R=(-70, 0, -10), el_R=(-45, 0, 0), chest=(10, 0, 0)); bro.expr("focused", 1)
    guard.place(1, x0 - 1.2, 0.9, 0, -90); guard.stand(1); guard.walk(1, n, (x0 - 1.2, 0.9, 0), (x0 + 0.2, 0.9, 0)); guard.expr("annoyed", 1)
    cam_key(cam, tgt, 1, (x0 + 1.4, -0.9, 1.7), (x0 - 0.2, 1.6, 0.95), 20); cam_key(cam, tgt, n, (x0 + 1.5, -0.85, 1.7), (x0 + 0.1, 1.6, 0.95), 20)
def WIDE_GUARD_WALK(n):
    scene_cw(n, bro_at=False); x0 = CART0[0] + 0.35; g = cw["cart"]; g.location = (x0, CART0[1], 0); g.keyframe_insert("location", frame=1)
    g.location = (x0 + 0.3, CART0[1], 0); g.keyframe_insert("location", frame=n); flash(cw["beacon"], n, 4, 9.0)
    for f, x in ((1, x0), (n, x0 + 0.3)): bro.place(f, x - 0.25, CART0[1], -0.07, 90)
    bro.sit(1, arms_on_desk=False); bro.pose(1, sh_L=(-70, 0, 10), el_L=(-45, 0, 0), sh_R=(-70, 0, -10), el_R=(-45, 0, 0), chest=(10, 0, 0)); bro.expr("focused", 1)
    guard.walk(1, n, (x0 - 0.2, 0.75, 0), (x0 + 2.2, 0.75, 0)); guard.expr("smug", 1)
    for f in range(1, n, 8): guard.pose(f, sh_L=(-30, 0, 35), el_L=(-95, 0, 0), sh_R=(-30, 0, -35), el_R=(-95, 0, 0))   # arms crossed while overtaking
    cam_key(cam, tgt, 1, (x0 + 1.2, -1.0, 1.4), (x0 + 0.4, 1.4, 1.0), 20); cam_key(cam, tgt, n, (x0 + 2.0, -0.95, 1.4), (x0 + 1.3, 1.4, 1.0), 20)

# ---------------------------------------------------------------- 2 AUDITORIUM
SEATS = {(r, c): (x, y) for r, c, x, y in au["seats"]}
PRX, PRY = AU - 1.6, 5.5
def scene_au(n):
    all_off("in")
    prin.place(1, PRX, PRY, 1.0, 0); prin.stand(1); idle(prin, 1, n, "talk", 21); prin.expr("deadpan", 1)
    sx, sy = SEATS[(2, 1)]; sit_at(tyler, sx, sy, 180); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    for i, (rc, kind) in enumerate((((0, -2), "look"), ((0, 3), "talk"), ((1, -1), "phone"), ((1, 2), "look"), ((2, -3), "talk"), ((2, 3), "laugh"),
                                   ((3, -2), "phone"), ((3, 1), "look"), ((4, -1), "talk"), ((4, 4), "look"), ((5, 2), "phone"), ((1, 5), "talk"))):
        x, y = SEATS[rc]; sit_at(ext[i], x, y, 180); idle(ext[i], 1, n, kind, 200 + i)
    mon.place(1, AU + 7.0, 2.0, 0, 90); mon.stand(1); idle(mon, 1, n, "look", 22)
def WIDE_AUD(n):
    scene_au(n); cam_move(n, (AU + 2.2, -7.4, 3.4), (AU - 0.4, 4.6, 1.5), 22, (AU + 2.0, -6.9, 3.3))
def MS_PRINCIPAL(n):
    scene_au(n); hx, hy, hz = headpos(prin)
    cam_move(n, (hx + 0.8, hy - 2.6, hz - 0.35), (hx, hy, hz - 0.45), 28, (hx + 0.75, hy - 2.45, hz - 0.33))
def WIDE_BRO_STAGE_RUN(n):
    scene_au(n); prin.expr("shock", n // 3); prin.rot("head", n // 3, 0, 0, -40)
    run(bro, 1, n, (AU - 6.0, 6.05, 1.0), (AU + 2.8, 6.05, 1.0)); bro.expr("happy", 1)
    mon.place(1, AU - 7.0, 6.05, 1.0, -90); run(mon, 8, n, (AU - 7.4, 6.05, 1.0), (AU + 0.6, 6.05, 1.0)); mon.expr("yell", 8)
    for f in range(10, n, 5): mon.rot("sh_R", f, -100, 0, -10)
    cam_key(cam, tgt, 1, (AU - 0.6, 0.6, 2.4), (AU - 2.6, 6.0, 1.8), 22); cam_key(cam, tgt, n, (AU + 0.6, 0.6, 2.4), (AU + 1.2, 6.0, 1.8), 22)
def CU_BRO_STARS(n):
    scene_au(n); run(bro, 1, n, (AU + 1.4, 6.05, 1.0), (AU + 3.5, 6.05, 1.0)); bro.expr("yell", 1)
    for f in range(1, n, 5): bro.pose(f, sh_R=(-165, 0, -10), el_R=(-5, 0, 0))   # two fingers up while running
    bpy.context.scene.frame_set(n // 2); h = bro.j["head"].matrix_world.translation
    cam_key(cam, tgt, 1, (AU + 3.6, 4.55, 2.35), (AU + 1.7, 6.05, 2.25), 30); cam_key(cam, tgt, n, (AU + 3.75, 4.55, 2.35), (AU + 3.2, 6.05, 2.25), 30)
def MS_CURTAIN_FEET(n):
    scene_au(n); bro.place(1, AU + 4.6, 5.38, 1.0, 0); bro.stand(1); bro.expr("focused", 1)
    mon.place(1, AU + 2.6, 5.9, 1.0, -90); mon.stand(1); idle(mon, 1, n, "look", 31); mon.expr("annoyed", 1)
    cam_key(cam, tgt, 1, (AU + 3.6, 2.0, 1.75), (AU + 4.4, 5.0, 1.55), 24); cam_key(cam, tgt, n, (AU + 3.65, 2.15, 1.74), (AU + 4.4, 5.0, 1.55), 24)
def CU_BRO_HIDE(n):
    scene_au(n); bro.place(1, AU + 4.6, 5.62, 1.0, 55); bro.stand(1); bro.expr("focused", 1); bro.mouth.scale = (0.5, 1, 0.6); bro.mouth.keyframe_insert("scale", frame=1)
    for k, f in enumerate(range(1, n, 12)): bro.rot("head", f, 0, 0, 25 if k % 2 else -20)   # eyes/head dart left-right
    bro.pose(1, sh_L=(-20, 0, 8), sh_R=(-20, 0, -8), chest=(0, 0, 0))
    hx, hy, hz = headpos(bro)
    cam_move(n, (hx + 0.85, hy - 0.45, hz), (hx, hy, hz - 0.08), 32, (hx + 0.8, hy - 0.42, hz))

# ---------------------------------------------------------------- 3 NURSE'S OFFICE
NBX, NBY = NU + 1.2, 0.72
def scene_nu(n, bro_in=True):
    all_off("in")
    nurse.place(1, NU + 1.3, 2.2, 0, 0); nurse.stand(1); breathe(nurse, 1, n, 1.0, 100, 4); nurse.expr("happy", 1)
    tyler.place(1, NU - 2.55, -1.45, 0, 70); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    if bro_in: bro.place(1, NBX, NBY, 0, 180); bro.stand(1); breathe(bro, 1, n, 1.2, 70, 5)
    k = ext[2]; cx, cy = nu["chair"]; sit_at(k, cx, cy + 0.02, 0); k.pose(1, sh_R=(-150, 0, -20), el_R=(-80, 0, 0)); k.expr("sad", 1); idle(k, 1, n, "look", 41)
    k.pose(1, sh_R=(-150, 0, -20), el_R=(-80, 0, 0))
def WIDE_NURSE_ENTER(n):
    scene_nu(n, bro_in=False); bro.walk(1, n - 12, (NU - 2.6, -0.6, 0), (NBX, NBY - 0.05, 0)); bro.place(n - 6, NBX, NBY, 0, 180); bro.stand(n - 6); bro.expr("focused", 1)
    tyler.place(1, NU - 2.85, -1.45, 0, 90); tyler.walk(10, n, (NU - 2.85, -1.45, 0), (NU - 2.55, -1.45, 0))
    cam_key(cam, tgt, 1, (NU + 0.9, -3.6, 1.9), (NU - 0.6, 0.6, 1.1), 20); cam_key(cam, tgt, n, (NU + 0.85, -3.45, 1.88), (NU + 0.2, 0.6, 1.1), 20)
def CU_BRO_ARMOR(n):
    scene_nu(n); bro.expr("focused", 1); bro.pose(1, chest=(14, 0, 0), sh_L=(-55, 0, 10), el_L=(-30, 0, 0), sh_R=(-55, 0, -10), el_R=(-30, 0, 0))   # leans on the desk
    hx, hy, hz = headpos(bro)
    cam_move(n, (hx - 0.55, hy + 0.85, hz - 0.02), (hx, hy, hz - 0.1), 32, (hx - 0.52, hy + 0.8, hz - 0.02))
def CU_NURSE(n):
    scene_nu(n); show([granola], True); nurse.pose(1, sh_R=(-30, 0, 0), el_R=(-20, 0, 0)); nurse.pose(14, sh_R=(-80, 0, -5), el_R=(-30, 0, 0)); nurse.blink(n // 2)
    hx, hy, hz = headpos(nurse)
    cam_move(n, (hx + 0.35, hy - 0.95, hz - 0.08), (hx, hy, hz - 0.18), 32, (hx + 0.33, hy - 0.9, hz - 0.08))
def MS_BRO_HEAL(n):
    scene_nu(n); show([bgran], True); bro.pose(1, sh_R=(-120, 0, -15), el_R=(-95, 0, 0)); chew(bro, 22, 5)
    bro.expr("happy", 1); bro.expr("smug", 24); bro.pose(26, sh_L=(-165, 0, 15), el_L=(-10, 0, 0), sh_R=(-165, 0, -15), el_R=(-10, 0, 0), chest=(-6, 0, 0))   # arms up: "FULL"
    hx, hy, hz = headpos(bro)
    cam_key(cam, tgt, 1, (NU + 0.4, 1.95, 1.75), (hx, hy, hz - 0.35), 24); cam_key(cam, tgt, n, (NU + 0.43, 1.9, 1.74), (hx, hy, hz - 0.35), 24)
def CU_ME_DOOR(n):
    scene_nu(n); tyler.expr("deadpan", 1); tyler.blink(n // 2)
    hx, hy, hz = headpos(tyler)
    cam_move(n, (hx + 0.9, hy - 0.25, hz - 0.03), (hx, hy, hz - 0.08), 32, (hx + 0.85, hy - 0.24, hz - 0.03))

# ---------------------------------------------------------------- 4 LUNCH PATIO
T1 = pt["tables"][3]                       # Tyler's table (front right)
TSX, TSY = T1[0] - 0.35, T1[1] - 0.66      # Tyler on the south bench, facing the table (+Y)
BSX, BSY = T1[0] + 1.25, T1[1] - 0.55      # Brody stands at the table end, facing Tyler
def scene_pt(n, bro_stand=True):
    all_off("out"); FILLS["fill_pt"].energy = 200
    sit_at(tyler, TSX, TSY, 180); tyler.expr("happy", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    if bro_stand: bro.place(1, BSX, BSY, 0, -110); bro.stand(1); breathe(bro, 1, n, 1.2, 70, 5)
    seats = [(pt["tables"][0], -1, 180), (pt["tables"][0], 1, 0), (pt["tables"][1], -1, 180), (pt["tables"][1], 1, 0), (pt["tables"][2], 1, 0), (pt["tables"][2], -1, 180)]
    for i, ((x, y), side, yaw) in enumerate(seats):
        sit_at(ext[i], x - 0.35 + 0.7 * (i % 2), y + side * 0.66, yaw, arms=True); idle(ext[i], 1, n, ("talk", "laugh", "phone", "talk", "look", "talk")[i], 500 + i)
    vx, vy = pt["vend"]
    for i, c in enumerate(ext[6:9]): c.place(1, vx + 1.0 + i * 0.7, vy - 1.0 - (i % 2) * 0.2, 0, 160 + i * 15); c.stand(1); idle(c, 1, n, ("look", "phone", "talk")[i], 520 + i)
    for k in range(3):
        b = bpy.data.objects[f"pt_bird{k}"]
        for f in range(1, n, 14): b.location.z = 0.06 + (0.06 if (f // 14) % 2 else 0); b.keyframe_insert("location", frame=f)
def hold_sw(c, f0, f1, side="R"):
    bake_to(SW, c, f"hand_{side}", f0, f1, (0, 0, 0.09), (0, 0, R(20)))
def WIDE_PATIO(n):
    scene_pt(n, bro_stand=False); tyler.pose(1, sh_R=(-20, 0, 0), el_R=(-30, 0, 0)); tyler.pose(n // 2, sh_R=(-60, 0, -10), el_R=(-75, 0, 0))
    hold_sw(tyler, 1, n)
    bro.place(1, PT - 6.0, -4.6, 0, -90); bro.walk(1, n, (PT - 6.0, -4.6, 0), (PT - 3.8, -4.6, 0))
    cam_key(cam, tgt, 1, (PT + 5.2, -6.6, 2.6), (PT + 1.0, -0.6, 0.8), 20); cam_key(cam, tgt, n, (PT + 4.9, -6.3, 2.3), (T1[0], T1[1] - 0.6, 0.9), 20)
def MS_BRO_GRAB(n):
    scene_pt(n, bro_stand=False); tyler.pose(1, sh_R=(-60, 0, -10), el_R=(-75, 0, 0)); tyler.expr("happy", 1); tyler.expr("shock", n // 2 + 4)
    g = n // 2; y = TSY - 0.75
    bro.walk(1, n, (TSX - 2.4, y, 0), (TSX + 2.0, y, 0)); bro.expr("focused", 1); bro.expr("happy", g + 4)
    bro.pose(g - 6, sh_L=(-80, 0, 30), el_L=(-10, 0, 0)); bro.pose(g + 6, sh_L=(-40, 0, 10), el_L=(-70, 0, 0))   # reaches over and takes it
    hold_sw(tyler, 1, g); bake_to(SW, bro, "hand_L", g + 1, n, (0, 0, 0.09), (0, 0, R(20)))
    cam_key(cam, tgt, 1, (TSX - 0.45, TSY + 2.6, 1.6), (TSX - 0.2, TSY - 0.2, 1.1), 22); cam_key(cam, tgt, n, (TSX - 0.4, TSY + 2.5, 1.6), (TSX + 0.4, TSY - 0.2, 1.1), 22)
def CU_ME_EMPTY(n):
    scene_pt(n, bro_stand=False); tyler.pose(1, sh_R=(-60, 0, -10), el_R=(-75, 0, 0)); tyler.expr("shock", 1); tyler.expr("deadpan", n // 2)
    hx, hy, hz = headpos(tyler)
    cam_key(cam, tgt, 1, (hx - 0.35, hy + 0.95, hz - 0.05), (hx, hy, hz - 0.22), 30); cam_key(cam, tgt, n, (hx - 0.33, hy + 0.9, hz - 0.05), (hx, hy, hz - 0.22), 30)
def bro_phone_show(f=1):
    show([bphone, bpy.data.objects["bro_phone_scr"]], True)
    bro.pose(f, sh_R=(-85, 0, 10), el_R=(-25, 0, 0), sh_L=(-60, 0, 10), el_L=(-80, 0, 0))
def TWO_SHOT_PHONE(n):
    scene_pt(n); bro_phone_show(); bro.expr("happy", 1); hold_sw(bro, 1, n, "L"); tyler.expr("deadpan", 1); tyler.rot("head", 1, 0, 0, -35)
    cam_key(cam, tgt, 1, (T1[0] - 0.5, T1[1] + 2.4, 1.75), (T1[0] + 0.4, T1[1] - 0.6, 1.1), 22); cam_key(cam, tgt, n, (T1[0] - 0.45, T1[1] + 2.25, 1.73), (T1[0] + 0.4, T1[1] - 0.6, 1.1), 22)
def CU_BRO_PROUD(n):
    scene_pt(n); bro_phone_show(); hold_sw(bro, 1, n, "L"); bro.expr("smug", 1); bro.blink(n // 2)
    hx, hy, hz = headpos(bro)
    cam_key(cam, tgt, 1, (hx - 1.0, hy + 0.15, hz - 0.1), (hx, hy, hz - 0.25), 30); cam_key(cam, tgt, n, (hx - 0.95, hy + 0.14, hz - 0.1), (hx, hy, hz - 0.25), 30)
def CU_ME_SHOCK(n):
    scene_pt(n); bro_phone_show(); hold_sw(bro, 1, n, "L"); tyler.expr("shock", 1); tyler.rot("head", 1, 0, 0, 25)
    hx, hy, hz = headpos(tyler)
    cam_key(cam, tgt, 1, (hx - 0.35, hy + 0.9, hz - 0.02), (hx, hy, hz - 0.1), 32); cam_key(cam, tgt, n, (hx - 0.33, hy + 0.86, hz - 0.02), (hx, hy, hz - 0.1), 32)
def CU_BRO_CHEW(n):
    scene_pt(n); bro.pose(1, sh_L=(-120, 0, 15), el_L=(-100, 0, 0)); hold_sw(bro, 1, n, "L"); chew(bro, n, 6); bro.expr("chill", 1)
    hx, hy, hz = headpos(bro)
    cam_move(n, (hx - 0.8, hy - 0.5, hz - 0.08), (hx, hy, hz - 0.15), 30, (hx - 0.76, hy - 0.47, hz - 0.08))
def WIDE_PRINCIPAL_BEHIND(n):
    scene_pt(n); hold_sw(bro, 1, n, "L"); bro.pose(1, sh_L=(-120, 0, 15), el_L=(-100, 0, 0)); chew(bro, n // 2, 6); bro.expr("chill", 1); bro.expr("shock", n - 10)
    show([slip_p], True); prin.walk(1, n - 15, (BSX + 2.8, BSY + 0.9, 0), (BSX + 0.85, BSY + 0.25, 0)); prin.expr("annoyed", 1)
    prin.pose(n - 12, sh_L=(-30, 0, 35), el_L=(-95, 0, 0), sh_R=(-60, 0, -10), el_R=(-70, 0, 0)); tyler.expr("deadpan", 1)
    cam_move(n, (T1[0] + 0.2, T1[1] - 3.8, 1.7), (BSX + 0.4, BSY + 0.3, 1.2), 22, (T1[0] + 0.25, T1[1] - 3.6, 1.68))
def INS_DETENTION_SLIP(n):
    scene_pt(n); hold_sw(bro, 1, n, "L"); slip_t.location = (T1[0] + 0.35, T1[1] - 0.1, 0.785); slip_t.rotation_euler = (0, 0, R(8))
    slip_t.keyframe_insert("location", frame=1); show([slip_t], True)
    p = slip_t.location
    cam_key(cam, tgt, 1, (p.x + 0.18, p.y - 0.42, p.z + 0.42), (p.x, p.y, p.z), 34); cam_key(cam, tgt, n, (p.x + 0.16, p.y - 0.38, p.z + 0.38), (p.x, p.y, p.z), 34)
def CU_ME_CRUMBS(n):
    scene_pt(n); tyler.expr("sad", 1); tyler.rot("head", 1, 14, 0, 0); tyler.blink(n // 2)
    rnd = random.Random(3)
    for k, c in enumerate(crumbs):
        c.location = (TSX + rnd.uniform(-0.12, 0.18), TSY + 0.62 + rnd.uniform(-0.08, 0.1), 0.79); c.rotation_euler = (0, 0, rnd.uniform(0, 3)); c.keyframe_insert("location", frame=1)
    show(crumbs, True)
    hx, hy, hz = headpos(tyler)
    cam_key(cam, tgt, 1, (hx - 0.4, hy + 1.0, hz - 0.05), (hx, hy + 0.2, hz - 0.2), 28); cam_key(cam, tgt, n, (hx - 0.38, hy + 0.95, hz - 0.05), (hx, hy + 0.2, hz - 0.2), 28)
# helper still for the phone stream insert (fictional crime-city game frame)
def POV_GAME(n):
    scene_cw(n, bro_at=False); OFF(tyler); flash(cw["beacon"], n, 4, 9.0)   # the streamer's game: a stranger drives, not Brody
    d = ext[11]; d.place(1, cw["cart"].location.x - 0.25, CART0[1], -0.07, 90); d.sit(1, arms_on_desk=False); d.pose(1, sh_L=(-70, 0, 10), el_L=(-45, 0, 0), sh_R=(-70, 0, -10), el_R=(-45, 0, 0))
    guard.place(1, CW + 2.6, 0.9, 0, 90); guard.stand(1); guard.expr("yell", 1)
    cam_key(cam, tgt, 1, (CW + 2.0, -3.0, 5.0), (CW + 4.2, 1.8, 0.6), 28)

HELPERS = ("POV_GAME",)
SHOTS = {k: v for k, v in globals().items() if k.isupper() and callable(v) and k not in ("P", "R", "MK", "OFF")}
T = json.load(open(TL, encoding="utf-8")); os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
todo = [(s["id"], s["key"], round(s["end"] * FPS) - round(s["start"] * FPS)) for s in T["shots"]] + [("POV", k, 20) for k in HELPERS]
for sid, key, n in todo:
    if key not in SHOTS or (ONLY and key not in ONLY): continue
    t0 = time.time(); reset(); CUR["key"] = key; SHOTS[key](n)
    if CHECK:
        hits = []
        for fr in sorted({1, max(1, n // 2), n}):
            hits += [h for h in find_collisions(EVERYONE, fr) if h not in hits]
        for h in hits: print("COLLIDE", sid, key, *h)
        if not hits: print("CLEAN", sid, key)
        continue
    sc.frame_start, sc.frame_end = 1, n; sc.render.resolution_x, sc.render.resolution_y = RES
    if STILLS or key in HELPERS:
        sc.frame_set(max(1, n // 2)); sc.render.filepath = os.path.join(OUT, f"{sid}_{key}.png"); bpy.ops.render.render(write_still=True)
    else:
        d = os.path.join(OUT, f"{sid}_{key}"); os.makedirs(d, exist_ok=True); sc.render.filepath = os.path.join(d, "f_"); bpy.ops.render.render(animation=True)
    print("RENDERED", sid, key, n, f"{time.time() - t0:.1f}s", flush=True)
print("ALL DONE")
