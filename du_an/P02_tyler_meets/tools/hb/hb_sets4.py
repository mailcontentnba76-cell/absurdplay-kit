"""TM02 v2 sets: boys' bathroom, night parking lot; extra dressing for hallway + gym. Clean materials (no grain)."""
import bpy, math, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad, light_panel

def _sph(name, r, loc, m, seg=12, ring=8, parent=None, sc=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, radius=r, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m); o.scale = sc
    if parent: o.parent = parent
    o.location = loc; return o
def _cyl(name, r, d, loc, m, rot=(0, 0, 0), v=16, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=d, location=(0, 0, 0), rotation=rot)
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m)
    if parent: o.parent = parent
    o.location = loc; return o

def bathroom(o):
    """Room x -3..3, y -2.5..2.5. Mirror + sinks on the back wall (+Y). Returns mirror spot and flicker light."""
    ox, oy, oz = o
    C = lambda h, r=0.5: mat("bath_" + h, srgb(h), r)
    box("bath_floor", (6.2, 5.2, 0.1), (ox, oy, oz - 0.05), C("d7dde2", 0.4))
    for i in range(-6, 7): box(f"bath_fx{i}", (0.012, 5.2, 0.004), (ox + i * 0.48, oy, oz + 0.002), C("b9c1c8"))
    for i in range(-5, 6): box(f"bath_fy{i}", (6.2, 0.012, 0.004), (ox, oy + i * 0.48, oz + 0.002), C("b9c1c8"))
    for n, sz, lc in (("wb", (6.2, 0.15, 3.0), (ox, oy + 2.6, oz + 1.5)), ("wl", (0.15, 5.2, 3.0), (ox - 3.1, oy, oz + 1.5)),
                      ("wr", (0.15, 5.2, 3.0), (ox + 3.1, oy, oz + 1.5)), ("wf", (6.2, 0.15, 3.0), (ox, oy - 2.6, oz + 1.5))):
        box("bath_" + n, sz, lc, C("eef2f3", 0.6))
    # lower wall tiles (light blue) with a dark trim line
    for n, sz, lc in (("tb", (6.1, 0.02, 1.2), (ox, oy + 2.52, oz + 0.6)), ("tl", (0.02, 5.1, 1.2), (ox - 3.02, oy, oz + 0.6)), ("tr", (0.02, 5.1, 1.2), (ox + 3.02, oy, oz + 0.6))):
        box("bath_" + n, sz, lc, C("9cc9e6", 0.35))
    box("bath_trim", (6.1, 0.03, 0.05), (ox, oy + 2.51, oz + 1.22), C("2c3e50"))
    box("bath_ceil", (6.2, 5.2, 0.1), (ox, oy, oz + 3.0), C("f4f6f7", 0.8))
    # mirror + sinks
    box("bath_mirror", (3.4, 0.03, 1.0), (ox - 0.6, oy + 2.5, oz + 1.75), mat("mirror", (0.78, 0.82, 0.86), 0.05), None, 0.01, 2)
    box("bath_mirrorframe", (3.5, 0.025, 1.1), (ox - 0.6, oy + 2.515, oz + 1.75), C("8f979e", 0.3))
    box("bath_counter", (3.6, 0.6, 0.08), (ox - 0.6, oy + 2.2, oz + 0.86), C("f0f0f0", 0.3), None, 0.01, 2)
    box("bath_counterfront", (3.6, 0.05, 0.25), (ox - 0.6, oy + 1.92, oz + 0.74), C("dfe3e6", 0.4))
    for i, x in enumerate((-1.7, -0.6, 0.5)):
        box(f"bath_basin{i}", (0.45, 0.36, 0.06), (ox + x, oy + 2.18, oz + 0.89), C("ffffff", 0.2))
        box(f"bath_faucet{i}", (0.04, 0.04, 0.16), (ox + x, oy + 2.38, oz + 0.98), C("c7ccd1", 0.15))
        box(f"bath_spout{i}", (0.04, 0.14, 0.03), (ox + x, oy + 2.31, oz + 1.05), C("c7ccd1", 0.15))
    box("bath_soap", (0.09, 0.06, 0.18), (ox - 1.15, oy + 2.42, oz + 1.0), C("e84393", 0.4))
    box("bath_towels", (0.32, 0.12, 0.42), (ox + 1.4, oy + 2.45, oz + 1.5), C("bdc3c7", 0.4))
    box("bath_dryer", (0.3, 0.2, 0.28), (ox + 2.1, oy + 2.42, oz + 1.25), C("ecf0f1", 0.3), None, 0.02, 2)
    box("bath_dryer_nz", (0.08, 0.1, 0.06), (ox + 2.1, oy + 2.32, oz + 1.08), C("95a5a6", 0.3))
    box("bath_trash", (0.42, 0.42, 0.7), (ox + 1.4, oy + 2.15, oz + 0.35), C("7f8c8d", 0.4), None, 0.02, 2)
    tex_quad("bath_sign", 0.6, 0.3, "bath_wash.png", (ox + 1.4, oy + 2.49, oz + 2.1), (R(90), 0, R(180)))
    # stalls on the left wall
    PT = C("5d8aa8", 0.35)
    for i in range(3):
        y = oy + 1.4 - i * 1.0
        box(f"bath_partition{i}", (1.3, 0.04, 1.9), (ox - 2.4, y - 0.5, oz + 1.05), PT)
        d = box(f"bath_stalldoor{i}", (0.04, 0.85, 1.75), (ox - 1.76, y, oz + 1.0), PT)
        if i == 1: d.rotation_euler = (0, 0, R(-35)); d.location.y += 0.2
        box(f"bath_toilet{i}", (0.4, 0.55, 0.42), (ox - 2.75, y, oz + 0.21), C("ffffff", 0.2), None, 0.05, 2)
    box("bath_partition3", (1.3, 0.04, 1.9), (ox - 2.4, oy - 1.6, oz + 1.05), PT)
    # urinals on the right wall
    for i, y in enumerate((-0.6, 0.4)):
        box(f"bath_urinal{i}", (0.25, 0.45, 0.6), (ox + 2.9, oy + y, oz + 0.85), C("ffffff", 0.2), None, 0.05, 2)
        box(f"bath_udiv{i}", (0.6, 0.03, 0.9), (ox + 2.75, oy + y + 0.45, oz + 1.1), PT)
    # wet floor sign
    s1 = box("bath_wet1", (0.32, 0.02, 0.6), (ox + 0.9, oy - 0.6, oz + 0.3), C("f1c40f", 0.4)); s1.rotation_euler = (R(12), 0, R(20))
    s2 = box("bath_wet2", (0.32, 0.02, 0.6), (ox + 0.9, oy - 0.48, oz + 0.3), C("f1c40f", 0.4)); s2.rotation_euler = (R(-12), 0, R(20))
    lps = []
    for i, (x, y) in enumerate(((-1.5, 0.5), (1.5, 0.5), (0, -1.5))):
        light_panel(f"bath_lp{i}", (ox + x, oy + y, oz + 2.92), (0.9, 0.5))
    flick = bpy.data.objects["bath_lp1"]
    return dict(mirror=(ox - 0.6, oy + 1.55), flicker=flick)

def flicker(obj, n, seed=0):
    rnd = random.Random(seed)
    for f in range(1, n + 1, 4):
        obj.hide_render = rnd.random() < 0.18; obj.keyframe_insert("hide_render", frame=f)

def parking_lot(o):
    """Night parking lot in front of the school. Minivan at mv, curb along y=+4."""
    ox, oy, oz = o
    C = lambda h, r=0.7: mat("park_" + h, srgb(h), r)
    box("park_asphalt", (30, 30, 0.1), (ox, oy, oz - 0.05), C("3a3d42", 0.85))
    for i in range(-5, 6): box(f"park_line{i}", (0.08, 2.4, 0.004), (ox + i * 1.6, oy - 3.2, oz + 0.002), C("f5f5f5", 0.5))
    box("park_curb", (30, 0.3, 0.15), (ox, oy + 4.0, oz + 0.075), C("bdc3c7", 0.6))
    box("park_walk", (30, 3.0, 0.12), (ox, oy + 5.6, oz + 0.06), C("aab0b6", 0.7))
    # school facade with lit windows and doors
    box("park_school", (30, 0.4, 6), (ox, oy + 7.4, oz + 3.0), C("b5651d", 0.8))
    for i in range(-6, 7):
        if i in (0,): continue
        box(f"park_win{i}", (1.2, 0.05, 0.9), (ox + i * 2.0, oy + 7.18, oz + 2.2 + (1.9 if i % 2 else 0)), mat("park_winlit", srgb("ffe6a8"), 0.3, emit=2.5))
    box("park_doors", (2.4, 0.05, 2.4), (ox, oy + 7.18, oz + 1.2), mat("park_doorlit", srgb("fff2cc"), 0.3, emit=1.8))
    tex_quad("park_schoolsign", 3.2, 0.6, "hall_banner.png", (ox, oy + 7.17, oz + 3.0), (R(90), 0, R(180)))
    # street lights
    for i, x in enumerate((-8, 0.5, 8)):
        box(f"park_pole{i}", (0.12, 0.12, 5.0), (ox + x, oy + 3.6, oz + 2.5), C("2c3e50", 0.4))
        box(f"park_arm{i}", (0.1, 0.9, 0.1), (ox + x, oy + 3.2, oz + 4.95), C("2c3e50", 0.4))
        box(f"park_lamp{i}", (0.35, 0.5, 0.12), (ox + x, oy + 2.8, oz + 4.88), mat("park_lampglow", srgb("ffd98a"), 0.2, emit=8.0))
        Lp = bpy.data.lights.new(f"park_pl{i}", "POINT"); Lp.energy = 900; Lp.color = srgb("ffd59a"); Lp.shadow_soft_size = 0.4
        lo = bpy.data.objects.new(f"park_pl{i}", Lp); bpy.context.scene.collection.objects.link(lo); lo.location = (ox + x, oy + 2.8, oz + 4.6)
    # minivan (mom) + other cars
    def car(name, x, y, col, van=False, yaw=0):
        g = empty(name, (ox + x, oy + y, oz)); g.rotation_euler = (0, 0, R(yaw))
        L_, W_, H_ = (4.4, 1.9, 1.75) if van else (4.0, 1.8, 1.35)
        box(name + "_body", (W_, L_, H_ * 0.55), (0, 0, 0.55), C(col, 0.35), g, 0.12, 3)
        box(name + "_cab", (W_ * 0.96, L_ * (0.75 if van else 0.55), H_ * 0.45), (0, -0.1 if van else 0.1, 0.55 + H_ * 0.48), C(col, 0.35), g, 0.12, 3)
        GL = mat("park_glass", srgb("1f2a36"), 0.1)
        box(name + "_wf", (W_ * 0.88, 0.04, H_ * 0.36), (0, (L_ * (0.75 if van else 0.55)) / 2 - (0.1 if van else -0.1) + 0.0, 0.55 + H_ * 0.48), GL, g)
        for sx in (-1, 1): box(f"{name}_ws{sx}", (0.04, L_ * (0.7 if van else 0.5), H_ * 0.32), (sx * W_ * 0.485, -0.1 if van else 0.1, 0.55 + H_ * 0.5), GL, g)
        for sx in (-1, 1):
            for sy in (-1, 1):
                _cyl(f"{name}_wh{sx}{sy}", 0.34, 0.24, (sx * W_ * 0.47, sy * L_ * 0.32, 0.34), C("1b1b1b", 0.8), (0, R(90), 0), 16, g)
            box(f"{name}_head{sx}", (0.35, 0.05, 0.14), (sx * W_ * 0.32, L_ / 2 + 0.01, 0.75), mat("park_headlight", srgb("fff6d8"), 0.2, emit=6.0), g)
            box(f"{name}_tail{sx}", (0.3, 0.05, 0.12), (sx * W_ * 0.34, -L_ / 2 - 0.01, 0.8), mat("park_taillight", srgb("e74c3c"), 0.2, emit=3.0), g)
        return g
    mv = car("minivan", -2.0, 1.4, "c0c6cc", True, 90)       # silver minivan along the curb, facing +X
    car("car_red", 4.5, -3.2, "b03a2e", False, 0); car("car_blue", -6.0, -3.2, "2e5fa8", False, 0); car("car_white", 7.8, -3.2, "e8e8e8", False, 0)
    # school bus parked on the far left
    bus = empty("park_bus", (ox - 11, oy + 1.6, oz)); bus.rotation_euler = (0, 0, R(90))
    box("park_busbody", (2.4, 9.0, 2.4), (0, 0, 1.5), C("f5b800", 0.4), bus, 0.1, 2)
    for k in range(7): box(f"park_buswin{k}", (2.42, 0.8, 0.6), (0, -3.5 + k * 1.1, 2.1), mat("park_glass", srgb("1f2a36"), 0.1), bus)
    for sy in (-1, 1): _cyl(f"park_buswh{sy}", 0.5, 2.5, (0, sy * 3.0, 0.5), C("1b1b1b", 0.8), (0, R(90), 0), 16, bus)
    # cones, trees, bench
    for i, (x, y) in enumerate(((1.5, -0.8), (2.3, -0.8), (3.1, -0.8))):
        _cyl(f"park_cone{i}", 0.16, 0.5, (ox + x, oy + y, oz + 0.25), C("e67e22", 0.5), (0, 0, 0), 8).scale = (1, 1, 1)
        box(f"park_conebase{i}", (0.4, 0.4, 0.04), (ox + x, oy + y, oz + 0.02), C("e67e22", 0.5))
    rnd = random.Random(6)
    for i, x in enumerate((-13, -5.5, 3.5, 11)):
        box(f"park_trunk{i}", (0.25, 0.25, 2.2), (ox + x, oy + 5.4, oz + 1.1), C("6b4a2f", 0.8))
        _sph(f"park_leaves{i}", 1.1, (ox + x, oy + 5.4, oz + 2.9), C("2f6b3a", 0.8), 10, 7, None, (1, 1, 0.9))
    box("park_bench", (1.6, 0.45, 0.08), (ox + 5.6, oy + 5.0, oz + 0.5), C("8a5a33", 0.6))
    for sx in (-1, 1): box(f"park_benchleg{sx}", (0.06, 0.4, 0.45), (ox + 5.6 + sx * 0.7, oy + 5.0, oz + 0.25), C("2c3e50", 0.4))
    return dict(minivan=mv, mv_xy=(ox - 2.0, oy + 1.4))

def night_world(on=True):
    w = bpy.context.scene.world; bg = w.node_tree.nodes["Background"]
    if on: bg.inputs[0].default_value = (0.03, 0.05, 0.12, 1); bg.inputs[1].default_value = 0.6
    else: bg.inputs[0].default_value = (0.85, 0.82, 0.78, 1); bg.inputs[1].default_value = 0.55

def hallway_details(o):
    ox, oy, oz = o
    C = lambda h, r=0.6: mat("hall_" + h, srgb(h), r)
    # one locker open with stuff inside (door swung)
    d = box("hall_opendoor", (0.04, 0.56, 1.85), (ox + 1.58, oy - 3.6 + 0.3, oz + 0.95), C("2f6fb5", 0.35)); d.rotation_euler = (0, 0, R(-70))
    box("hall_lk_inside", (0.38, 0.52, 1.8), (ox + 1.84, oy - 3.88, oz + 0.95), C("1f3f66", 0.6))
    for k, c in enumerate(("e74c3c", "f1c40f", "27ae60")): box(f"hall_lkbook{k}", (0.25, 0.05, 0.3), (ox + 1.84, oy - 4.05 + k * 0.07, oz + 1.45), C(c, 0.6))
    box("hall_lkjacket", (0.08, 0.35, 0.6), (ox + 1.86, oy - 3.85, oz + 0.9), C("8e44ad", 0.8))
    tex_quad("hall_tryouts", 0.5, 0.7, "hall_tryouts.png", (ox + 2.02, oy + 1.8, oz + 2.5), (R(90), 0, R(-90)))
    tex_quad("hall_countdown", 0.8, 0.5, "hall_countdown.png", (ox - 2.02, oy - 4.6, oz + 2.45), (R(90), 0, R(90)))
    box("hall_mopbucket", (0.4, 0.3, 0.32), (ox + 1.4, oy + 6.6, oz + 0.16), C("f1c40f", 0.5), None, 0.03, 2)
    box("hall_mop", (0.03, 0.03, 1.3), (ox + 1.45, oy + 6.6, oz + 0.75), C("8a5a33", 0.7)).rotation_euler = (R(12), 0, 0)
    for k, (x, y, c) in enumerate(((ox - 1.4, oy + 5.6, "e67e22"), (ox + 1.45, oy - 5.5, "2c3e50"))):
        box(f"hall_floorbag{k}", (0.3, 0.2, 0.36), (x, y, oz + 0.18), C(c, 0.8), None, 0.05, 2)

def gym_details(o):
    ox, oy, oz = o
    C = lambda h, r=0.6: mat("gym_" + h, srgb(h), r)
    # photo booth frame with stars
    box("gym_booth_l", (0.12, 0.12, 2.2), (ox + 5.5, oy - 5.0, oz + 1.1), C("d4a017", 0.3)); box("gym_booth_r", (0.12, 0.12, 2.2), (ox + 7.1, oy - 5.0, oz + 1.1), C("d4a017", 0.3))
    box("gym_booth_t", (1.72, 0.12, 0.12), (ox + 6.3, oy - 5.0, oz + 2.2), C("d4a017", 0.3))
    tex_quad("gym_booth_bg", 2.0, 2.0, "gym_booth.png", (ox + 6.3, oy - 4.3, oz + 1.2), (R(90), 0, R(180)))
    # floor balloons
    cols = ["e74c3c", "f1c40f", "3498db", "9b59b6", "ffffff", "1abc9c"]; rnd = random.Random(12)
    for k in range(18):
        x = ox + rnd.uniform(-7, 7); y = oy + rnd.uniform(-7, 7)
        if abs(x - ox - 1.8) < 2.6 and abs(y - oy - 2.8) < 2.4: continue          # keep the dance ring clear
        _sph(f"gym_floorballoon{k}", 0.2, (x, y, oz + 0.2), C(cols[k % 6], 0.25), 10, 7, None, (1, 1, 1.1))
    # fog machine + low fog sheets
    box("gym_fogmachine", (0.5, 0.35, 0.3), (ox + 0.6, oy + 6.6, oz + 0.15), C("2c2c2c", 0.4), None, 0.02, 2)
    fm = bpy.data.materials.new("gym_fog"); fm.use_nodes = True; b = fm.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.9, 0.9, 1.0, 1); b.inputs["Alpha"].default_value = 0.12; b.inputs["Roughness"].default_value = 1.0
    try: fm.surface_render_method = "BLENDED"
    except Exception: pass
    for k in range(4):
        f = box(f"gym_fog{k}", (5.0, 3.0, 0.25), (ox + 1.5 + k * 0.4, oy + 3.5 - k * 0.6, oz + 0.15 + k * 0.08), None, None, 0.2, 3); f.data.materials.append(fm)
