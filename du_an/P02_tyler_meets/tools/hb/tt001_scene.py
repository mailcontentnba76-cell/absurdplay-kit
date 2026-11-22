"""TT001 — Elijah, "The Aura Farmer" (aura-farming trend). 4 sets: outdoor basketball court, band room, art room, bus stop (sunset).
Usage: blender -b --python tools/hb/tt001_scene.py -- <timeline.json> <out_dir> [--stills] [--check] [--only K,K] [--res WxH] [--samples N]"""
import bpy, sys, os, json, math, random, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets2, hb_sets4, hb_sets5, hb_sets6
for m_ in (hb_lib, hb_props, hb_sets2, hb_sets4, hb_sets5, hb_sets6): importlib.reload(m_)
from hb_lib import *
from hb_props import phone, tex_quad
from hb_sets2 import idle, breathe
from hb_sets4 import _cyl, _sph
from hb_sets6 import basketball_court, band_room, art_room, bus_stop

hb_lib.SKIP_WORDS = hb_lib.SKIP_WORDS + ("bc_ground", "bc_asphalt", "bc_key", "bc_side", "bc_base", "bc_mid", "bc_keyl", "bc_ft", "bc_arc", "bc_cc", "bc_ball",
                                         "bd_floor", "ar_floor", "ar_splat", "bs_ground", "bs_asphalt", "bs_walk", "bs_wj", "bs_dash", "tuba", "tri_", "eli_brush", "kay_")
argv = sys.argv[sys.argv.index("--") + 1:]
TL, OUT = os.path.abspath(argv[0]), os.path.abspath(argv[1]); STILLS = "--stills" in argv; CHECK = "--check" in argv
ONLY = set(argv[argv.index("--only") + 1].split(",")) if "--only" in argv else None
RES = tuple(int(v) for v in argv[argv.index("--res") + 1].split("x")) if "--res" in argv else (1080, 1920)
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 64
STEP = int(argv[argv.index("--step") + 1]) if "--step" in argv else 1          # preview: render every Nth frame
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")); P = lambda p: os.path.join(ROOT, p)
FPS = 30
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=SAMPLES)
for kv in filter(None, os.environ.get("EEVEE_OPTS", "").split(",")):   # experiments, e.g. EEVEE_OPTS=use_gtao=0,shadow_resolution_scale=0.5
    k_, v_ = kv.split("="); setattr(bpy.context.scene.eevee, k_, type(getattr(bpy.context.scene.eevee, k_))(float(v_)))
BC, BD, AR, BS = 390, 420, 450, 480
bc = basketball_court((BC, 0, 0)); bd = band_room((BD, 0, 0)); ar = art_room((AR, 0, 0)); bs = bus_stop((BS, 0, 0)); lights((0, 0, 0))
SUN = bpy.data.objects["sun"]; SUN_ROT = tuple(SUN.rotation_euler)
FILLS = {}
for nm, loc, en, sz in (("fill_bc", (BC, 4.0, 4.5), 0, 8), ("fill_bd", (BD, -0.5, 3.4), 500, 8), ("fill_ar", (AR, 0.0, 3.4), 260, 8), ("fill_bs", (BS, -1.0, 4.0), 0, 8)):
    L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = sz; fo = bpy.data.objects.new(nm, L); bpy.context.scene.collection.objects.link(fo); fo.location = loc; FILLS[nm] = L
# sheet music on every stand (Elijah's is upside down)
SHEETS = []
for i, st in enumerate(bd["seats"]):
    img = "tt_sheet_triangle_ud.png" if i == 10 else ("tt_sheet_tuba.png" if i == 0 else "tt_sheet_triangle.png")
    q = tex_quad(f"bd_sheet{i}", 0.4, 0.28, img, (0, 0, 0), (0, 0, 0)); q.parent = st["g"]; q.location = (0, -0.835, 1.065); q.rotation_euler = (R(65), 0, R(180)); SHEETS.append(q)

MK = lambda name, **kw: Char(name, **kw)
tyler = MK("ME", skin="f1c7a0", shirt="ffd23f", pants="3a3f47", shoes="f4f4f4", hair="1e1a18", hair_style="messy", print_img=P("assets/hb/prints/me_paused.png"))
eli = MK("ELI", skin="c98c63", shirt="f4f4f4", pants="2b3a55", shoes="f4f4f4", hair="1e1a18", hair_style="sidepart", print_img=P("assets/hb/prints/eli_buffering.png"),
         jacket="1b1b1d", sleeves="1b1b1d", long_sleeves=True, mood="squint")
# Elijah's glasses: an empty we key between "on top of his head" (all day) and "on his eyes" (bus stop payoff)
GL = empty("ELI_glasses", (0, 0, 0), eli.j["head"]); GM = mat("eli_glasses", srgb("d4a017"), 0.3)   # gold frames: readable on his black hair
for k, x in (("L", -0.085), ("R", 0.085)):
    for nm, sz, off in (("t", (0.12, 0.014, 0.016), (0, 0, 0.05)), ("b", (0.12, 0.014, 0.016), (0, 0, -0.05)), ("l", (0.016, 0.014, 0.1), (-0.055, 0, 0)), ("r", (0.016, 0.014, 0.1), (0.055, 0, 0))):
        box(f"ELI_gl{k}{nm}", sz, (x + off[0], 0, off[2]), GM, GL)
    box(f"ELI_glarm{k}", (0.012, 0.22, 0.012), (x * 1.75, 0.11, 0.04), GM, GL)
box("ELI_glbridge", (0.06, 0.014, 0.014), (0, 0, 0.02), GM, GL)
GL_TOP = ((0, -0.09, 0.575), (R(-62), 0, 0)); GL_EYES = ((0, -0.236, 0.29), (0, 0, 0))
def glasses(where, f):
    loc, rot = GL_TOP if where == "top" else GL_EYES
    GL.location = loc; GL.rotation_euler = rot; GL.keyframe_insert("location", frame=f); GL.keyframe_insert("rotation_euler", frame=f)
kay = MK("KAY", skin="8d5a3b", shirt="b9a3e3", pants="5d7fa8", shoes="f4f4f4", hair="2a1a12", hair_style="bun", scrunchie="f1c40f", glasses=True, female=True,
         long_sleeves=True, print_img=P("assets/hb/prints/kay_frog.png"), mood="deadpan")
kphone = phone("kay_phone", kay.j["el_R"], (0, -0.09, -0.32))
krec = tex_quad("kay_rec", 0.078, 0.152, "tt_kay_rec.png", (0, 0, 0), (0, 0, 0)); krec.parent = kay.j["el_R"]; krec.location = (0, -0.1, -0.32); krec.rotation_euler = (R(90), 0, 0)
kid = MK("KID", skin="e8b896", shirt="d63031", pants="2c3e50", shoes="f4f4f4", hair="4a2f1e", hair_style="buzz", headband="f4f4f4", long_sleeves=True, mood="happy")
hayes = MK("HAYES", skin="a86a45", shirt="f4f4f4", pants="2c3e50", shoes="222222", hair="3a2a1e", hair_style="buzz", long_sleeves=True, build=1.1, mood="happy", sleeves="5a3a22", jacket="5a3a22")
for sx in (-1, 1): box(f"HAYES_bow{sx}", (0.07, 0.03, 0.06), (sx * 0.04, -0.15, 0.53), mat("bowtie", srgb("c0392b"), 0.5), hayes.j["chest"]).rotation_euler = (0, R(sx * 20), 0)
baton = box("HAYES_baton", (0.012, 0.012, 0.34), (0, -0.03, -0.45), mat("baton", srgb("f4f4f4"), 0.4), hayes.j["el_R"])
tear = _sph("HAYES_tear", 0.026, (0.085, -0.235, 0.25), mat("tear", srgb("7fc8f8"), 0.1, emit=0.6), 8, 6, hayes.j["head"])
prin = MK("PRIN", skin="c98c63", shirt="f4f4f4", pants="2c3e50", shoes="222222", hair="5a4a3e", hair_style="bald", tie="f1c40f", jacket="2c3e50", sleeves="2c3e50",
          long_sleeves=True, glasses=True, mustache="3a2a1e", build=1.15, mood="deadpan")
cup = _cyl("PRIN_cup", 0.045, 0.12, (0, -0.06, -0.36), mat("cup", srgb("f4f4f4"), 0.5), (0, 0, 0), 12, prin.j["el_R"])
teach = MK("TEACH", skin="f3d2b5", shirt="2e86c1", pants="34495e", shoes="f4f4f4", hair="7a4a2e", hair_style="ponytail", female=True, long_sleeves=True, build=1.05, mood="happy")
apron = box("TEACH_apron", (0.4, 0.02, 0.62), (0, -0.15, 0.22), mat("apron", srgb("f4ecd8"), 0.8), teach.j["chest"])
for k, (x, z, c) in enumerate(((-0.1, 0.35, "e74c3c"), (0.08, 0.15, "3498db"), (0.12, 0.42, "f1c40f"), (-0.05, 0.05, "2ecc71"))):
    box(f"TEACH_dot{k}", (0.05, 0.01, 0.04), (x, -0.162, z), mat(f"dot{c}", srgb(c), 0.6), teach.j["chest"])
LOOKS = [("c98c63", "3f7fd1", "2a3550", "5a3a22", "messy", False), ("f0c9a4", "e85d9c", "4a4a4a", "c9a24a", "ponytail", True), ("8d5a3b", "e67e22", "2a2a2a", "141414", "buzz", False),
         ("f3d2b5", "9b59b6", "34495e", "d1a06a", "messy", False), ("6e4430", "16a085", "283040", "121212", "bun", True), ("e8b896", "e74c3c", "2c3e50", "8a5a33", "buzz", False),
         ("b07a55", "7f8c8d", "3d3d4a", "2a1a12", "waves", False), ("f6d0b0", "2980b9", "5d6d7e", "e0c068", "ponytail", True), ("a86a45", "f1c40f", "2c3e50", "1a120c", "messy", False),
         ("f0c9a4", "1abc9c", "4a4a4a", "6b4a2f", "bun", True), ("7a4a2e", "c0392b", "283040", "141414", "buzz", False), ("e8b896", "34495e", "6f8fb8", "c9a24a", "messy", False)]
ext = [MK(f"X{i}", skin=s, shirt=sh, pants=pa, shoes="eeeeee", hair=ha, hair_style=st, female=fe, build=0.94 if fe else 1.0) for i, (s, sh, pa, ha, st, fe) in enumerate(LOOKS)]
# props: tuba (Tyler, band), triangle + beater (Elijah, band), brush (Elijah, art), plastic bag (court)
BR = mat("brass", srgb("d4a017"), 0.25)
tuba = empty("tuba", (0, -0.30, 0.02), tyler.j["hips"])
_cyl("tuba_body", 0.15, 0.55, (0, 0, 0.3), BR, (0, 0, 0), 16, tuba)
bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.12, radius2=0.3, depth=0.32, location=(0, 0, 0)); tb = bpy.context.active_object; tb.name = "tuba_bell"; tb.data.materials.append(BR); tb.parent = tuba; tb.location = (-0.12, 0.02, 0.72); tb.rotation_euler = (0, R(-18), 0)
_cyl("tuba_mouth", 0.02, 0.22, (0.12, -0.05, 0.62), BR, (0, R(50), 0), 8, tuba)
for k in range(3): _cyl(f"tuba_valve{k}", 0.025, 0.1, (0.1, -0.12 + k * 0.05, 0.36), mat("silver", srgb("c9ced3"), 0.2), (0, 0, 0), 8, tuba)
tri = empty("triangle", (0, -0.02, -0.42), eli.j["el_L"])
SV = mat("silver", srgb("c9ced3"), 0.2)
_cyl("tri_bar0", 0.007, 0.17, (0, 0, -0.08), SV, (0, R(90), 0), 8, tri)
_cyl("tri_bar1", 0.007, 0.17, (-0.043, 0, -0.006), SV, (0, R(30), 0), 8, tri)
_cyl("tri_bar2", 0.007, 0.17, (0.043, 0, -0.006), SV, (0, R(-30), 0), 8, tri)
beater = box("tri_beater", (0.008, 0.008, 0.2), (0, -0.03, -0.38), mat("silver", srgb("c9ced3"), 0.2), eli.j["el_R"])
brush = box("eli_brush", (0.012, 0.012, 0.24), (0, -0.03, -0.38), mat("brush", srgb("8a5a33"), 0.5), eli.j["el_R"])
box("eli_brushtip", (0.02, 0.02, 0.04), (0, -0.03, -0.51), mat("paint_blk", srgb("1b1b1b"), 0.5), eli.j["el_R"])
bag = box("court_bag", (0.22, 0.16, 0.2), (0, -90, 0), mat("bag", srgb("f4f4f4"), 0.9), None, 0.05, 2)
# Tyler's sandwich (world object baked onto hands per shot) + crumbs
SWL = [("tsw_b1", (0.19, 0.15, 0.035), -0.05, "toast", "c98a3e"), ("tsw_let", (0.22, 0.17, 0.012), -0.026, "lettuce", "4fae3a"),
       ("tsw_ham", (0.21, 0.15, 0.016), -0.01, "ham", "e9738a"), ("tsw_ch", (0.2, 0.17, 0.008), 0.004, "cheese", "f5c518"), ("tsw_b2", (0.19, 0.15, 0.035), 0.028, "toast", "c98a3e")]
SW = empty("tyler_sandwich", (0, -80, 0))
for nm, sz, dz, mn, c in SWL: box(nm, sz, (0, 0, dz), mat(mn, srgb(c), 0.8), SW, 0.006, 2)
crumbs = [box(f"crumb{k}", (0.03, 0.025, 0.012), (0, -80, 0), mat("toast", srgb("c98a3e"), 0.8)) for k in range(9)]
BALL = bc["ball"]; BUS = bs["bus"]
cam, tgt = camera("cam", 28); bpy.context.scene.camera = cam
ALL = list(bpy.data.objects); REST = {o.name: (tuple(o.location), tuple(o.rotation_euler), tuple(o.scale)) for o in ALL}
EVERYONE = [tyler, eli, kay, kid, hayes, prin, teach] + ext
PROPS = [tuba, tri, beater, brush, bpy.data.objects["eli_brushtip"], kphone, bpy.data.objects["kay_phone_scr"], krec, cup, baton, tear, bag] + crumbs
def show(objs, on, f=1):
    for o in objs:
        for oo in [o] + list(o.children_recursive): oo.hide_render = not on; oo.keyframe_insert("hide_render", frame=f)
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
    SUN.rotation_euler = SUN_ROT
    if kind == "out":
        W.inputs[0].default_value = (0.42, 0.62, 0.92, 1); W.inputs[1].default_value = 0.75; SUN.data.energy = 4.8; SUN.data.color = (1.0, 0.92, 0.8)
    elif kind == "sunset":
        W.inputs[0].default_value = (0.98, 0.6, 0.42, 1); W.inputs[1].default_value = 0.7; SUN.data.energy = 3.4; SUN.data.color = (1.0, 0.68, 0.42)
        SUN.rotation_euler = (R(72), R(-15), R(-75))
    else:
        W.inputs[0].default_value = (0.85, 0.82, 0.78, 1); W.inputs[1].default_value = 0.55; SUN.data.energy = 3.0; SUN.data.color = (1.0, 0.9, 0.78)
def all_off(kind="in"):
    for c in EVERYONE: OFF(c)
    show(PROPS, False); SW.location = (0, -80, 0); BALL.location = (0, -90, 0); world(kind)
    for k, L in FILLS.items(): L.energy = {"fill_bd": 500, "fill_ar": 260}.get(k, 0)
def bake_to(obj, char, joint, f0, f1, off=(0, 0, 0.05), rot=None):
    sc = bpy.context.scene
    for f in range(f0, f1 + 1):
        sc.frame_set(f); h = char.j[joint].matrix_world.translation
        obj.location = (h.x + off[0], h.y + off[1], h.z + off[2]); obj.keyframe_insert("location", frame=f)
        if rot: obj.rotation_euler = rot; obj.keyframe_insert("rotation_euler", frame=f)
def hand(c, side="R", f=1):
    bpy.context.scene.frame_set(f); return c.j[f"hand_{side}"].matrix_world.translation.copy()
def key_obj(o, f, loc, rot=None):
    o.location = loc; o.keyframe_insert("location", frame=f)
    if rot is not None: o.rotation_euler = rot; o.keyframe_insert("rotation_euler", frame=f)
def sit_at(c, x, y, yaw, f=1, arms=False, z=-0.34):
    c.place(f, x, y, z, yaw); c.sit(f, arms_on_desk=arms)
def yaw_to(p, q): return math.degrees(math.atan2(q[0] - p[0], -(q[1] - p[1])))
def front(yaw, d=1.0): return (math.sin(R(yaw)) * d, -math.cos(R(yaw)) * d)
def arms_crossed(c, f=1): c.pose(f, sh_L=(-30, 0, 35), el_L=(-95, 0, 0), sh_R=(-30, 0, -35), el_R=(-95, 0, 0))
def lean_back(c, f=1): c.pose(f, chest=(-7, 0, 0), head=(5, 0, 0), hip_L=(0, 0, 6), hip_R=(4, 0, -4)); arms_crossed(c, f)
def play(c, f0, f1, seed=0):   # band kid "playing": hands to mouth, small bob
    rnd = random.Random(seed)
    for f in range(f0, f1 + 1, 15):
        b = rnd.uniform(-3, 3); c.pose(f, sh_L=(-78, 0, 22), el_L=(-112, 0, 0), sh_R=(-78, 0, -22), el_R=(-112, 0, 0), head=(4 + b, 0, 0), chest=(5 + b * 0.5, 0, 0))
PULL = 1.3
CUR = {"key": ""}
def _clamp(p):
    x, y, z = p
    if x < 405: return (x, min(max(y, -9.0), 17.5), min(max(z, 0.3), 9.0))
    if x < 465: ox = BD if x < 435 else AR; return (min(max(x, ox - 5.75), ox + 5.75), min(max(y, -4.85), 4.85), min(max(z, 0.35), 3.6))
    return (x, y, max(z, 0.35))
def cam_move(n, p0, l0, lens, p1=None, l1=None):
    close = CUR["key"].startswith(("CU_", "ECU_", "INS_", "POV_"))
    if not close: lens = max(16, lens * 0.82)
    k = (1.0 if CUR["key"].startswith(("INS_", "POV_")) else 1.3) if close else PULL
    pull = lambda p, l: _clamp(tuple(b + (a - b) * k for a, b in zip(p, l)))
    cam_key(cam, tgt, 1, pull(p0, l0), l0, lens); cam_key(cam, tgt, n, pull(p1 or p0, l1 or l0), l1 or l0, lens)
def headpos(c, f=1, dz=0.27):
    bpy.context.scene.frame_set(f); h = c.j["head"].matrix_world.translation; return (h.x, h.y, h.z + dz)
def cu_front(c, yaw, n, d=0.95, side=0.3, dz=-0.03, lens=32, f=1, look_dz=-0.08):
    hx, hy, hz = headpos(c, f); fx, fy = front(yaw); rx, ry = -fy, fx
    p = (hx + fx * d + rx * side, hy + fy * d + ry * side, hz + dz)
    cam_move(n, p, (hx, hy, hz + look_dz), lens, (p[0] - fx * 0.04, p[1] - fy * 0.04, p[2]))

# ---------------------------------------------------------------- 1 BASKETBALL COURT (morning)
ELX, ELY = BC, 11.85                        # Elijah leans back on the padded hoop pole, facing the court (-Y)
TX, TY = BC + 2.6, 9.0                     # Tyler
KX, KY = BC - 2.6, 8.2                     # Kayla
KIDX, KIDY = BC - 1.4, 9.4
def scene_bc(n, eli_at=True):
    all_off("out"); FILLS["fill_bc"].energy = 150
    if eli_at:
        eli.place(1, ELX, ELY, 0, 0); eli.stand(1); lean_back(eli); eli.expr("squint", 1); breathe(eli, 1, n, 0.8, 110, 3); glasses("top", 1)
    tyler.place(1, TX, TY, 0, yaw_to((TX, TY), (ELX, ELY))); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    kay.place(1, KX, KY, 0, yaw_to((KX, KY), (ELX, ELY))); kay.stand(1); show([kphone, bpy.data.objects["kay_phone_scr"], krec], True)
    kay.pose(1, sh_R=(-100, 0, -8), el_R=(-35, 0, 0)); kay.expr("deadpan", 1); breathe(kay, 1, n, 0.8, 100, 6)
    kid.place(1, KIDX, KIDY, 0, yaw_to((KIDX, KIDY), (ELX, ELY))); kid.stand(1); kid.expr("happy", 1); breathe(kid, 1, n, 1.4, 60, 7)
    fans = ((BC - 4.6, 8.6), (BC - 3.9, 7.4), (BC - 5.3, 7.6), (BC + 4.1, 8.0), (BC + 4.8, 9.2), (BC + 3.5, 6.6))
    for i, (x, y) in enumerate(fans):
        c = ext[i]; c.place(1, x, y, 0, yaw_to((x, y), (ELX, ELY))); c.stand(1); idle(c, 1, n, ("phone", "look", "talk", "phone", "laugh", "look")[i], 300 + i)
    for i, (x, y, yaw) in enumerate(((BC - 3.0, 1.0, 120), (BC - 2.2, 0.3, -60))):   # two kids shooting around at mid court
        c = ext[6 + i]; c.place(1, x, y, 0, yaw); c.stand(1); idle(c, 1, n, "talk", 320 + i)
def catch_anim(n, fc):
    """ball flies in from the kids and smacks into Elijah's right hand at frame fc; he never turns his head"""
    eli.pose(1, sh_R=(-30, 0, -35), el_R=(-95, 0, 0)); eli.pose(max(2, fc - 5), sh_R=(-62, 0, -42), el_R=(-18, 0, 0)); eli.pose(fc + 4, sh_R=(-55, 0, -40), el_R=(-30, 0, 0))
    h = hand(eli, "R", fc); p0 = (KIDX - 1.6, KIDY - 2.4, 1.7)
    f0 = max(1, fc - 14); key_obj(BALL, 1, p0)
    for k in range(f0, fc + 1):
        t = (k - f0) / max(1, fc - f0); key_obj(BALL, k, (p0[0] + (h.x - p0[0]) * t, p0[1] + (h.y - p0[1]) * t, p0[2] + (h.z + 0.05 - p0[2]) * t + 1.2 * t * (1 - t)), (0, R(40 * k), 0))
    bake_to(BALL, eli, "hand_R", fc + 1, n, (0.0, -0.05, 0.08))
    for c in (kid, ext[0], ext[1]):
        bpy.context.scene.frame_set(1); r = c.j["root"].location.copy(); c.loc(fc, r.x, r.y, 0); c.loc(fc + 4, r.x, r.y, 0.18); c.loc(fc + 9, r.x, r.y, 0)
        c.pose(fc + 2, sh_L=(-160, 0, 15), el_L=(-60, 0, 0), sh_R=(-160, 0, -15), el_R=(-60, 0, 0)); c.expr("shock", fc + 2)
def OPEN_ELI_CATCH(n):
    scene_bc(n); fc = min(14, n // 3); catch_anim(n, fc); kid.expr("yell", fc + 2)
    cam_key(cam, tgt, 1, (ELX + 1.9, ELY - 3.4, 1.2), (ELX - 0.2, ELY - 0.2, 1.4), 24); cam_key(cam, tgt, n, (ELX + 1.8, ELY - 3.2, 1.2), (ELX - 0.1, ELY - 0.2, 1.4), 24)
def CU_KID_HYPE(n):
    scene_bc(n); BALL.location = (0, -90, 0)
    bake_to(BALL, eli, "hand_R", 1, 1, (0.0, -0.05, 0.08)); eli.pose(1, sh_R=(-55, 0, -40), el_R=(-30, 0, 0))
    kid.expr("yell", 1)
    for k, f in enumerate(range(1, n, 8)):
        kid.loc(f, KIDX, KIDY, 0.12 if k % 2 else 0.0)
        kid.pose(f, sh_R=(-95, 0, -10), el_R=(-5, 0, 0), sh_L=(-70 if k % 2 else -35, 0, 25), el_L=(-90, 0, 0))   # points at Elijah, fist pump low
    cu_front(kid, yaw_to((KIDX, KIDY), (ELX, ELY)), n, 0.85, -0.6, 0.0, 30)
def CU_ME_WTF(n):
    scene_bc(n); tyler.expr("deadpan", 1); tyler.blink(n // 2)
    y = yaw_to((TX, TY), (ELX, ELY)); cu_front(tyler, y, n, 0.9, 0.35, -0.03, 34, 1)
def WIDE_COURT_ELI(n):
    scene_bc(n); bake_to(BALL, eli, "hand_R", 1, n, (0.0, -0.05, 0.08)); eli.pose(1, sh_R=(-50, 0, -40), el_R=(-35, 0, 0))
    cam_key(cam, tgt, 1, (BC + 1.6, 3.6, 2.0), (ELX, ELY - 0.4, 1.4), 20); cam_key(cam, tgt, n, (BC + 1.5, 3.9, 1.98), (ELX, ELY - 0.4, 1.4), 20)
def CU_ELI_SQUINT(n):
    scene_bc(n); bake_to(BALL, eli, "hand_R", 1, n, (0.0, -0.05, 0.08)); eli.pose(1, sh_R=(-50, 0, -40), el_R=(-35, 0, 0)); eli.blink(n // 2)
    cu_front(eli, 0, n, 0.95, 0.28, 0.02, 32)
def WIDE_COURT_FANS(n):
    scene_bc(n); OFF(tyler); OFF(kay)
    for i, a in enumerate((-55, -33, -11, 11, 33, 55)):           # a half-ring of fans facing him
        x, y = ELX + 3.4 * math.sin(R(a)), ELY - 3.4 * math.cos(R(a)); c = ext[i]
        c.place(1, x, y, 0, yaw_to((x, y), (ELX, ELY))); c.stand(1); idle(c, 1, n, ("phone", "look", "talk", "phone", "laugh", "look")[i], 300 + i)
    kid.place(1, ELX - 0.3, ELY - 4.6, 0, yaw_to((ELX - 0.3, ELY - 4.6), (ELX, ELY))); kid.stand(1)
    for c in (ext[0], ext[3]): c.pose(1, sh_R=(-100, 0, -8), el_R=(-30, 0, 0))          # two phones up
    ext[2].pose(10, chest=(35, 0, 0), head=(10, 0, 0)); ext[2].pose(n - 5, chest=(30, 0, 0))   # one bows
    cam_key(cam, tgt, 1, (ELX + 0.95, ELY + 0.2, 1.95), (ELX - 0.3, ELY - 3.6, 1.15), 18); cam_key(cam, tgt, n, (ELX + 0.9, ELY + 0.15, 1.93), (ELX - 0.3, ELY - 3.6, 1.15), 18)
LPX, LPY = bc["lamp"]
def MS_ELI_LEAN_POLE(n):
    scene_bc(n, eli_at=False); glasses("top", 1); eli.expr("squint", 1)
    ex = LPX - 0.07 - 0.17; eli.walk(1, n - 14, (BC + 4.6, 1.9, 0), (ex - 0.05, LPY, 0)); eli.place(n - 8, ex, LPY, 0, -90); eli.stand(n - 8); lean_back(eli, n - 4)
    cam_key(cam, tgt, 1, (BC + 5.4, 7.6, 1.7), (BC + 5.0, 2.2, 1.2), 22); cam_key(cam, tgt, n, (BC + 5.5, 7.4, 1.7), (ex, LPY, 1.25), 22)
GX, GY = bc["gate"]
def MS_ELI_LEAN_PRINCIPAL(n):
    scene_bc(n, eli_at=False); show([cup], True)
    prin.place(1, GX - 0.3, GY - 0.55, 0, 0); prin.stand(1); prin.pose(1, sh_R=(-60, 0, -10), el_R=(-70, 0, 0)); prin.expr("deadpan", 1); prin.expr("shock", 18)
    eli.place(1, GX + 0.32, GY - 0.55, 0, 0); eli.stand(1); arms_crossed(eli); eli.rot("chest", 1, -4, 0, 0); eli.rot("hips", 1, 0, -9, 0); eli.rot("head", 1, 0, -6, 0)
    eli.expr("squint", 1); glasses("top", 1); breathe(eli, 1, n, 0.6, 110, 3)
    for f in range(20, n, 16): prin.blink(f)
    cam_key(cam, tgt, 1, (GX, GY - 3.6, 1.55), (GX, GY - 0.55, 1.4), 28); cam_key(cam, tgt, n, (GX + 0.05, GY - 3.4, 1.55), (GX, GY - 0.55, 1.4), 28)
def MS_KAY_FILM(n):
    scene_bc(n); kay.blink(n // 2)
    y = yaw_to((KX, KY), (ELX, ELY)); fx, fy = front(y); hx, hy, hz = headpos(kay)
    cam_move(n, (hx + fx * 1.6 - fy * 0.5, hy + fy * 1.6 + fx * 0.5, hz - 0.25), (hx, hy, hz - 0.3), 28)
def INS_KAY_PHONE(n):
    scene_bc(n); bpy.context.scene.frame_set(1)
    m = krec.matrix_world; c = m.translation.copy(); nrm = (m.to_3x3() @ __import__("mathutils").Vector((0, 0, 1))).normalized()
    p = (c.x + nrm.x * 0.38, c.y + nrm.y * 0.38, c.z + nrm.z * 0.38 + 0.05)
    cam_key(cam, tgt, 1, p, (c.x, c.y, c.z), 36); cam_key(cam, tgt, n, (p[0] - nrm.x * 0.03, p[1] - nrm.y * 0.03, p[2]), (c.x, c.y, c.z), 36)
def CU_ME_DEAD(n):
    scene_bc(n); tyler.place(1, BC + 3.4, 1.2, 0, 15); tyler.stand(1); tyler.expr("deadpan", 1); tyler.blink(n // 3); tyler.blink(2 * n // 3)
    show([bag], True); key_obj(bag, 1, (BC + 1.4, 3.4, 0.1), (0, 0, 0)); key_obj(bag, n, (BC + 5.8, 3.0, 0.1), (R(200), R(90), 0))
    cu_front(tyler, 15, n, 1.05, 0.25, -0.02, 30)

# ---------------------------------------------------------------- 2 BAND ROOM
SEATS = bd["seats"]; CPX, CPY = bd["cp"]; HPIV, MPIV = bd["clock"]
ME_S, ELI_S = SEATS[0], SEATS[10]
BAND_EXT = [s for i, s in enumerate(SEATS) if i not in (0, 10)]
def scene_bd(n, playing=True, conduct=True):
    all_off("in"); show([tuba, tri, beater, baton], True)
    sit_at(tyler, ME_S["x"], ME_S["y"], ME_S["yaw"]); tyler.pose(1, sh_L=(-58, 0, 18), el_L=(-72, 0, 0), sh_R=(-58, 0, -18), el_R=(-72, 0, 0)); tyler.expr("deadpan", 1)
    sit_at(eli, ELI_S["x"], ELI_S["y"], ELI_S["yaw"]); eli.expr("squint", 1); glasses("top", 1); breathe(eli, 1, n, 0.8, 110, 3)
    eli.pose(1, sh_L=(-95, 0, 12), el_L=(-35, 0, 0), sh_R=(-70, 0, -12), el_R=(-45, 0, 0), head=(0, 0, 22))     # holds the triangle up, "looking" at the wall
    hayes.place(1, CPX, CPY, 0.2, 180); hayes.stand(1); hayes.expr("happy", 1); show([tear], False)
    if conduct:
        for f in range(1, n, 10): hayes.pose(f, sh_R=(-120 if (f // 10) % 2 else -85, 0, -20), el_R=(-30, 0, 0), sh_L=(-70, 0, 15), el_L=(-50, 0, 0))
    for i, s in enumerate(BAND_EXT):
        c = ext[i]; sit_at(c, s["x"], s["y"], s["yaw"])
        if playing: play(c, 1, n, 400 + i)
        else: idle(c, 1, n, "look", 420 + i)
    for k, f in enumerate(range(1, n, 6)):                       # clock ticks normally
        MPIV.rotation_euler = (0, R(-6 * (k * 0.1)), 0); MPIV.keyframe_insert("rotation_euler", frame=f)
def WIDE_BAND(n):
    scene_bd(n)
    for f in range(1, n, 15): tyler.rot("chest", f, 5 + (3 if (f // 15) % 2 else 0), 0, 0)
    cam_move(n, (BD + 0.6, -4.2, 2.4), (BD, 0.7, 1.0), 20, (BD + 0.4, -4.0, 2.35))
def ding(f):
    eli.pose(f - 4, sh_R=(-70, 0, -12), el_R=(-60, 0, 0)); eli.pose(f, sh_R=(-80, 0, -18), el_R=(-30, 0, 0)); eli.pose(f + 5, sh_R=(-70, 0, -12), el_R=(-55, 0, 0))
def MS_ELI_TRIANGLE(n):
    scene_bd(n); ding(min(16, n - 6)); eli.blink(n - 12); OFF(ext[2]); OFF(ext[3])          # front-row kids out of the lens path
    fx, fy = front(ELI_S["yaw"]); rx, ry = -fy, fx; hx, hy, hz = headpos(eli)
    p = (hx + fx * 1.25 + rx * 0.35, hy + fy * 1.25 + ry * 0.35, hz - 0.12)
    cam_key(cam, tgt, 1, p, (hx, hy, hz - 0.4), 26); cam_key(cam, tgt, n, (p[0] - fx * 0.05, p[1] - fy * 0.05, p[2]), (hx, hy, hz - 0.4), 26)
def MS_BAND_STOP(n):
    scene_bd(n); fd = 8; ding(fd)
    for i, s in enumerate(BAND_EXT):
        c = ext[i]; yy = yaw_to((s["x"], s["y"]), (ELI_S["x"], ELI_S["y"])) - s["yaw"]; yy = (yy + 180) % 360 - 180
        c.pose(fd + 3, sh_L=(-20, 0, 0), el_L=(-30, 0, 0), sh_R=(-20, 0, 0), el_R=(-30, 0, 0), head=(0, 0, max(-60, min(60, -yy))))   # freeze + look at him
        c.expr("shock", fd + 3)
    for f in range(fd + 3, n, 10): hayes.pose(f, sh_R=(-40, 0, -10), el_R=(-20, 0, 0), sh_L=(-30, 0, 0), el_L=(-30, 0, 0))
    hayes.expr("shock", fd + 3)
    p = (BD + 3.7, -2.6, 2.5)
    cam_key(cam, tgt, 1, p, (BD + 0.6, 0.2, 0.85), 22); cam_key(cam, tgt, n, (p[0] + 0.05, p[1] - 0.05, p[2]), (BD + 0.6, 0.2, 0.85), 22)
def CU_HAYES_TEAR(n):
    scene_bd(n, playing=False, conduct=False); hayes.pose(1, sh_L=(-60, 0, 32), el_L=(-95, 0, 0), sh_R=(-10, 0, -8), el_R=(-15, 0, 0)); hayes.expr("happy", 1); hayes.blink(n // 2)
    show([tear], True); key_obj(tear, 1, (0.085, -0.236, 0.25)); key_obj(tear, n, (0.085, -0.232, 0.15))
    cu_front(hayes, 180, n, 0.9, 0.2, 0.05, 32)
def CU_ME_TUBA(n):
    scene_bd(n, playing=False); tyler.expr("deadpan", 1); tyler.expr("shock", 8); tyler.mouth.scale = (0.6, 1, 0.6); tyler.mouth.keyframe_insert("scale", frame=4)
    cu_front(tyler, ME_S["yaw"], n, 1.15, 0.3, 0.0, 30)
def WIDE_ME_TUBA(n):
    scene_bd(n, playing=False)
    for f in range(1, n, 12): tyler.rot("chest", f, 6 if (f // 12) % 2 else 1, 0, 0)
    for k, f in enumerate(range(1, n + 1, 3)):                    # forty minutes fly by on the wall clock
        MPIV.rotation_euler = (0, R(-36 * k), 0); MPIV.keyframe_insert("rotation_euler", frame=f)
        HPIV.rotation_euler = (0, R(-3 * k), 0); HPIV.keyframe_insert("rotation_euler", frame=f)
    cam_key(cam, tgt, 1, (BD - 3.6, -4.3, 1.9), (BD + 0.6, 2.2, 1.6), 20); cam_key(cam, tgt, n, (BD - 3.5, -4.25, 1.9), (BD + 0.8, 2.3, 1.6), 20)
def MS_BAND_BACKS(n):
    scene_bd(n, playing=False)
    for i, s in enumerate(BAND_EXT):
        c = ext[i]; c.place(1, s["x"], s["y"], -0.34, yaw_to((s["x"], s["y"]), (ELI_S["x"], ELI_S["y"])) if i < 9 else s["yaw"]); c.sit(1, arms_on_desk=False)
    for f in range(1, n, 10): tyler.rot("chest", f, 6 if (f // 10) % 2 else 1, 0, 0)
    hx, hy, hz = headpos(tyler); fx, fy = front(ME_S["yaw"])
    cam_key(cam, tgt, 1, (hx - fx * 0.7 - 0.35, hy - fy * 0.7, hz + 0.15), (BD + 0.6, 0.9, 0.9), 22); cam_key(cam, tgt, n, (hx - fx * 0.68 - 0.35, hy - fy * 0.68, hz + 0.15), (BD + 0.6, 0.9, 0.9), 22)
def OTS_ELI_SHEET_UPSIDE(n):
    scene_bd(n); eli.pose(1, head=(6, 0, 0)); eli.blink(n // 3)
    for f in range(10, n, 24): eli.rot("head", f, 6, 0, 4 if (f // 24) % 2 else -4)   # slow nod, "reading"
    bpy.context.scene.frame_set(1); q = SHEETS[10].matrix_world.translation.copy(); hx, hy, hz = headpos(eli); fx, fy = front(ELI_S["yaw"])
    rx, ry = -fy, fx; p = (hx - fx * 0.05 + rx * 0.5, hy - fy * 0.05 + ry * 0.5, hz + 0.55)
    cam_key(cam, tgt, 1, p, (q.x, q.y, q.z), 26); cam_key(cam, tgt, n, (p[0] + fx * 0.04, p[1] + fy * 0.04, p[2] - 0.02), (q.x, q.y, q.z), 26)

# ---------------------------------------------------------------- 3 ART ROOM
EAX, EAY = ar["eli_easel"]; MSX, MSY = ar["stool_me"]; RKX, RKY = ar["rack"]
EPX, EPY = EAX - 0.85, EAY                  # Elijah paints facing +X
def scene_ar(n):
    all_off("in"); show([brush, bpy.data.objects["eli_brushtip"]], True)
    eli.place(1, EPX, EPY, 0, 90); eli.stand(1); eli.expr("squint", 1); glasses("top", 1); breathe(eli, 1, n, 0.8, 110, 3)
    eli.pose(1, sh_R=(-80, 0, -10), el_R=(-50, 0, 0))
    sit_at(tyler, MSX, MSY, -90); tyler.pose(1, sh_L=(-25, 0, 8), el_L=(-60, 0, 0), sh_R=(-25, 0, -8), el_R=(-60, 0, 0), head=(0, 0, 0)); tyler.expr("deadpan", 1)
    sx, sy = ar["stools"][0]; sit_at(kay, sx, sy, yaw_to((sx, sy), (EPX, EPY))); show([kphone, bpy.data.objects["kay_phone_scr"], krec], True)
    kay.pose(1, sh_R=(-100, 0, -8), el_R=(-35, 0, 0)); kay.expr("deadpan", 1)
    sx, sy = ar["stools"][1]; sit_at(ext[0], sx, sy, 180, arms=False); idle(ext[0], 1, n, "talk", 501)
    teach.place(1, AR + 0.6, 2.6, 0, 200); teach.stand(1); idle(teach, 1, n, "look", 502); teach.expr("happy", 1)
    for i, (x, y, yaw) in enumerate(ar["easels"]):            # painter at each other easel + the classmate they paint
        fx, fy = front(yaw); c = ext[1 + i]; px, py = x + fx * 0.85, y + fy * 0.85
        c.place(1, px, py, 0, (yaw + 180) % 360); c.stand(1); c.pose(1, sh_R=(-80, 0, -10), el_R=(-50, 0, 0)); idle(c, 1, n, "read", 510 + i); c.pose(1, sh_R=(-80, 0, -10), el_R=(-50, 0, 0))
        m = ext[5 + i]; mx, my = x - fx * 1.35, y - fy * 1.35; m.place(1, mx, my, 0, yaw); m.stand(1); idle(m, 1, n, "look", 520 + i)
def WIDE_ART(n):
    scene_ar(n)
    for f in range(1, n, 20): eli.rot("sh_R", f, -95 if (f // 20) % 2 else -80, 0, -10)
    cam_move(n, (AR + 0.6, -3.6, 2.0), (AR + 0.4, 1.0, 1.0), 22, (AR + 0.5, -3.45, 1.98))
def MS_ELI_BRUSH(n):
    scene_ar(n); eli.pose(1, sh_R=(-125, 0, -8), el_R=(-30, 0, 0)); eli.pose(12, sh_R=(-62, 0, -8), el_R=(-35, 0, 0)); arms_crossed(eli, 20); eli.expr("smug", 20)
    teach.place(1, EPX + 0.4, EPY + 1.4, 0, yaw_to((EPX + 0.4, EPY + 1.4), (EAX, EAY))); teach.stand(1); teach.pose(14, sh_L=(-120, 0, 20), el_L=(-120, 0, 0), sh_R=(-120, 0, -20), el_R=(-120, 0, 0)); teach.expr("shock", 14)
    cam_key(cam, tgt, 1, (EPX + 0.5, EPY - 2.3, 1.65), (EPX + 0.25, EPY + 0.1, 1.35), 26); cam_key(cam, tgt, n, (EPX + 0.55, EPY - 2.2, 1.64), (EPX + 0.25, EPY + 0.1, 1.35), 26)
def CU_ME_SIDEEYE(n):
    scene_ar(n); tyler.expr("deadpan", 1); tyler.expr("annoyed", 14); tyler.rot("head", 1, 0, 0, 0); tyler.rot("head", 14, 0, 0, -28); tyler.rot("chest", 14, 6, 0, -8)
    cu_front(tyler, -90, n, 0.95, -0.3, 0.0, 32)
def INS_CANVAS_RACK(n):
    scene_ar(n); bpy.context.scene.frame_set(1); q = ar["eli_art"].matrix_world.translation.copy()
    cam_key(cam, tgt, 1, (q.x - 0.55, q.y - 0.85, q.z + 0.1), (q.x + 0.25, q.y + 0.3, q.z - 0.05), 24); cam_key(cam, tgt, n, (q.x - 0.52, q.y - 0.8, q.z + 0.1), (q.x + 0.25, q.y + 0.3, q.z - 0.05), 24)
def CU_ME_REALIZE(n):
    scene_ar(n); tyler.expr("deadpan", 1); tyler.expr("shock", 10); tyler.rot("head", 10, -6, 0, 0); tyler.rot("chest", 10, -5, 0, 0)
    cu_front(tyler, -90, n, 0.9, 0.25, 0.0, 32)
def POV_KAY_ZOOM(n):   # helper still: what Kayla's phone sees when she zooms on his eyes
    scene_ar(n); eli.expr("squint", 1); cu_front(eli, 90, n, 1.0, 0.0, 0.08, 36, 1, 0.0)

# ---------------------------------------------------------------- 4 BUS STOP (sunset)
Z0 = bs["walk_z"]
ETX, ETY = BS + 0.25, 1.55                 # Elijah
MTX, MTY = BS + 1.0, 1.35                  # Tyler (holds the sandwich in his left hand)
BUS_STOP_X = BS - 1.2                      # bus centre x when stopped (front wheel well before the sandwich)
def scene_bs(n, bus_x=None):
    all_off("sunset"); FILLS["fill_bs"].energy = 120
    eli.place(1, ETX, ETY, Z0, 0); eli.stand(1); eli.expr("squint", 1); glasses("top", 1); arms_crossed(eli); breathe(eli, 1, n, 0.8, 110, 3)
    tyler.place(1, MTX, MTY, Z0, -20); tyler.stand(1); tyler.expr("deadpan", 1); breathe(tyler, 1, n, 1.0, 96, 1)
    kay.place(1, BS - 1.1, 2.1, Z0, 30); kay.stand(1); show([kphone, bpy.data.objects["kay_phone_scr"], krec], True); kay.pose(1, sh_R=(-100, 0, -8), el_R=(-35, 0, 0))
    bx, by = bs["bench"]
    for i, (dx, kind) in enumerate(((-1.1, "phone"), (-0.35, "talk"), (0.45, "phone"), (1.15, "look"))): sit_at(ext[i], bx + dx, by, 0, z=-0.34 + Z0); idle(ext[i], 1, n, kind, 600 + i)
    for i, (x, y, yaw) in enumerate(((BS - 2.6, 1.6, 40), (BS - 3.2, 1.9, -60), (BS + 3.6, 2.2, -30))):
        c = ext[4 + i]; c.place(1, x, y, Z0, yaw); c.stand(1); idle(c, 1, n, ("talk", "talk", "phone")[i], 610 + i)
    BUS.location = (bus_x if bus_x is not None else BS - 30, -1.6, 0); BUS.keyframe_insert("location", frame=1)
def hold_sw(c, f0, f1, side="L"):
    bake_to(SW, c, f"hand_{side}", f0, f1, (0, 0, 0.09), (0, 0, R(20)))
def tyler_sw_pose(f=1): tyler.pose(f, sh_L=(-55, 0, 12), el_L=(-70, 0, 0))
def WIDE_BUS_STOP_POINT(n):
    scene_bs(n); tyler_sw_pose(); tyler.pose(10, sh_R=(-160, 0, 15), el_R=(-10, 0, 0)); tyler.rot("head", 10, 0, 0, 18); hold_sw(tyler, 1, n)
    cam_move(n, (BS + 1.0, -1.7, 1.55), (BS + 0.55, 1.55, 1.3), 24, (BS + 0.95, -1.6, 1.54))
def INS_GLASSES_HEAD(n):
    scene_bs(n); tyler_sw_pose(); hold_sw(tyler, 1, n); hx, hy, hz = headpos(eli, 1, 0.33)
    cam_key(cam, tgt, 1, (hx + 0.15, hy - 0.95, hz + 0.3), (hx, hy - 0.05, hz - 0.08), 34); cam_key(cam, tgt, n, (hx + 0.14, hy - 0.9, hz + 0.29), (hx, hy - 0.05, hz - 0.08), 34)
def CU_ELI_PANIC(n):
    scene_bs(n); tyler_sw_pose(); hold_sw(tyler, 1, n)
    eli.pose(1, sh_R=(-150, 0, -10), el_R=(-60, 0, 0)); glasses("top", 1); glasses("eyes", 9); eli.pose(12, sh_R=(-30, 0, -10), el_R=(-30, 0, 0))
    eli.expr("squint", 1); eli.expr("shock", 10); eli.expr("yell", 26)
    for i in range(7):
        c = ext[i]; c.rot("head", 8, 0, 0, 0)                                  # the whole stop is staring
    eli.loc(18, ETX, ETY, Z0); eli.loc(n, ETX, ETY + 0.22, Z0)
    cu_front(eli, 0, n, 1.0, 0.25, 0.0, 30)
def MS_ELI_BUMP(n):
    scene_bs(n); tyler_sw_pose(); glasses("eyes", 1); eli.expr("shock", 1)
    fb = 10; eli.loc(1, ETX + 0.05, ETY + 0.25, Z0); eli.loc(fb, MTX - 0.48, MTY + 0.05, Z0); eli.face(1, 0); eli.pose(1, sh_L=(-40, 0, 25), el_L=(-40, 0, 0))
    hold_sw(tyler, 1, fb); tyler.expr("shock", fb + 1); tyler.loc(fb + 3, MTX + 0.12, MTY, Z0); tyler.pose(fb + 2, sh_L=(-120, 0, 30), el_L=(-10, 0, 0))
    h = hand(tyler, "L", fb); end = (MTX + 0.5, 0.25, Z0 + 0.06)
    for k in range(fb, n + 1):
        t = min(1.0, (k - fb) / 14.0); key_obj(SW, k, (h.x + (end[0] - h.x) * t, h.y + (end[1] - h.y) * t, h.z + (end[2] - h.z) * t + 0.5 * t * (1 - t)), (R(180 * t), 0, R(20 + 90 * t)))
    cam_move(n, (BS + 1.0, -2.6, 1.45), (BS + 0.75, 1.3, 1.0), 26, (BS + 1.05, -2.5, 1.44))
SWX, SWY = MTX + 0.55, -0.45
def INS_SANDWICH_BUS(n):
    scene_bs(n, bus_x=SWX - 3.1 - 7.5); glasses("eyes", 1)
    key_obj(SW, 1, (SWX - 0.25, 0.25, Z0 + 0.06), (R(180), 0, R(110))); key_obj(SW, 10, (SWX, SWY, 0.06), (R(200), 0, R(140)))     # rolls off the curb
    key_obj(BUS, 1, (SWX - 3.1 - 7.5, -1.6, 0)); key_obj(BUS, n, (SWX - 3.1 - 0.45, -1.6, 0))
    cam_key(cam, tgt, 1, (SWX + 1.9, -0.1, 0.34), (SWX - 1.0, -0.6, 0.3), 24); cam_key(cam, tgt, n, (SWX + 1.85, -0.12, 0.34), (SWX - 1.2, -0.65, 0.4), 24)
def CU_ELI_GLASSES_OFF(n):
    scene_bs(n, bus_x=SWX - 3.1 + 6.0); eli.expr("shock", 1); glasses("eyes", 1); eli.pose(1, sh_R=(-150, 0, -10), el_R=(-60, 0, 0))
    glasses("top", 12); eli.expr("squint", 13); eli.pose(16, sh_R=(-30, 0, -35), el_R=(-95, 0, 0)); arms_crossed(eli, 18); eli.rot("chest", 18, -7, 0, 0)
    cu_front(eli, 0, n, 1.0, 0.3, 0.0, 30)
def CU_ME_CRUMBS(n):
    scene_bs(n, bus_x=BS + 30); tyler.expr("sad", 1); tyler.rot("head", 1, 22, 0, 0); tyler.blink(n // 2); tyler.pose(1, sh_L=(-10, 0, 0), el_L=(-10, 0, 0))
    rnd = random.Random(4)
    for c in crumbs: key_obj(c, 1, (SWX + rnd.uniform(-0.35, 0.35), SWY + rnd.uniform(-0.25, 0.2), 0.02), (0, 0, rnd.uniform(0, 3)))
    show(crumbs, True)
    cu_front(tyler, -20, n, 1.1, 0.2, -0.05, 28)
def POV_VIEWS(n):      # helper still: Kayla's viral clip thumbnail (Elijah panicking at the stop)
    scene_bs(n, bus_x=BS - 30); glasses("eyes", 1); eli.expr("yell", 1); cu_front(eli, 0, n, 1.6, 0.0, -0.1, 28)

def cull(n):
    """render speed (CPU Eevee): hide every top-level object that is >22 m from this shot's set at both frame 1 and n; only this set's fill light on"""
    sc_ = bpy.context.scene; sc_.frame_set(1); cx = cam.matrix_world.translation.x
    setx = min((BC, BD, AR, BS), key=lambda v: abs(v - cx))
    tops = [o for o in ALL if o.parent is None and o.type in ("MESH", "EMPTY")]
    near = set()
    for f in (1, max(1, n // 2), n):
        sc_.frame_set(f)
        for o in tops:
            if abs(o.matrix_world.translation.x - setx) <= 22 and abs(o.matrix_world.translation.y) < 40: near.add(o.name)
    for o in tops:
        if o.name not in near:
            for oo in [o] + list(o.children_recursive): oo.hide_render = True; oo.keyframe_insert("hide_render", frame=1)
    for k, L in FILLS.items():
        if abs(bpy.data.objects[k].location.x - setx) > 1: L.energy = 0
HELPERS = ("POV_KAY_ZOOM", "POV_VIEWS")
SHOTS = {k: v for k, v in globals().items() if k.isupper() and callable(v) and k not in ("P", "R", "MK", "OFF")}
T = json.load(open(TL, encoding="utf-8")); os.makedirs(OUT, exist_ok=True); sc = bpy.context.scene
todo = [(s["id"], s["key"], round(s["end"] * FPS) - round(s["start"] * FPS)) for s in T["shots"]] + [("POV", k, 20) for k in HELPERS]
for sid, key, n in todo:
    if key not in SHOTS or (ONLY and key not in ONLY): continue
    t0 = time.time(); reset(); CUR["key"] = key; SHOTS[key](n)
    if not CHECK: cull(n)
    if os.environ.get("DEBUGCAM"):
        sc.frame_set(1); print("CAM", key, tuple(round(v, 2) for v in cam.location), "TGT", tuple(round(v, 2) for v in tgt.location), "ELI", tuple(round(v, 2) for v in eli.j["root"].location))
    if CHECK:
        hits = []
        for fr in sorted({1, max(1, n // 2), n}):
            hits += [h for h in find_collisions(EVERYONE, fr) if h not in hits]
        for h in hits: print("COLLIDE", sid, key, *h)
        if not hits: print("CLEAN", sid, key)
        continue
    sc.frame_start, sc.frame_end, sc.frame_step = 1, n, STEP; sc.render.resolution_x, sc.render.resolution_y = RES
    if STILLS or key in HELPERS:
        sc.frame_set(max(1, n // 2)); sc.render.filepath = os.path.join(OUT, f"{sid}_{key}.png"); bpy.ops.render.render(write_still=True)
    else:
        d = os.path.join(OUT, f"{sid}_{key}"); os.makedirs(d, exist_ok=True); sc.render.filepath = os.path.join(d, "f_"); bpy.ops.render.render(animation=True)
    print("RENDERED", sid, key, n, f"{time.time() - t0:.1f}s", flush=True)
print("ALL DONE")
