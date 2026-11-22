"""TMG01 sets (Brody, GTA 6 special): school crosswalk (morning), auditorium, nurse's office, outdoor lunch patio.
Clean materials, dense dressing. Every function returns key spots. Seat/bench tops at z=0.47 (Char seated z = -0.34)."""
import bpy, math, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad, light_panel, chips_bag
from hb_sets4 import _sph, _cyl

def _C(prefix):
    return lambda h, r=0.7, e=0.0: mat(f"{prefix}_{h}", srgb(h), r, emit=e)

def tree(name, x, y, z=0, h=2.4, r=1.1, C=None):
    box(name + "_trunk", (0.24, 0.24, h), (x, y, z + h / 2), C("6b4a2f", 0.8))
    _sph(name + "_leaves", r, (x, y, z + h + r * 0.55), C("3f8a3f", 0.8), 10, 7, None, (1, 1, 0.9))
    _sph(name + "_leaves2", r * 0.7, (x + r * 0.5, y + 0.2, z + h + r * 0.2), C("4a9c45", 0.8), 10, 7)

def golf_cart(name, loc, yaw=0, C=None):
    g = empty(name, loc); g.rotation_euler = (0, 0, R(yaw))
    W = C("f4f4f4", 0.35); DK = C("2b2f36", 0.6)
    box(name + "_body", (1.15, 2.2, 0.38), (0, 0, 0.42), W, g, 0.06, 2)
    box(name + "_hood", (1.1, 0.55, 0.3), (0, -0.85, 0.72), W, g, 0.08, 2)
    box(name + "_seat", (1.0, 0.5, 0.12), (0, 0.25, 0.68), DK, g, 0.03, 2)
    box(name + "_back", (1.0, 0.12, 0.45), (0, 0.5, 0.95), DK, g, 0.03, 2)
    box(name + "_bed", (1.05, 0.6, 0.15), (0, 0.85, 0.7), DK, g)
    for sx in (-1, 1):
        for sy in (-1, 1): _cyl(f"{name}_wh{sx}{sy}", 0.22, 0.18, (sx * 0.55, sy * 0.72, 0.22), C("1b1b1b", 0.8), (0, R(90), 0), 14, g)
        for sy in (-0.62, 0.55): box(f"{name}_post{sx}{sy}", (0.05, 0.05, 1.45), (sx * 0.5, sy, 1.57), DK, g)
    box(name + "_roof", (1.2, 1.5, 0.06), (0, -0.05, 2.3), W, g, 0.02, 1)
    box(name + "_wind", (1.0, 0.03, 0.75), (0, -0.62, 1.42), mat("cart_glass", srgb("bcd8e8"), 0.05), g)
    _cyl(name + "_wheel", 0.17, 0.04, (0, -0.42, 1.0), DK, (R(-60), 0, 0), 14, g)
    box(name + "_label", (0.02, 0.9, 0.16), (0.58, -0.1, 0.5), C("1f4e8c", 0.5), g)
    beacon = _cyl(name + "_beacon", 0.09, 0.12, (0, -0.4, 2.4), mat("cart_beacon", srgb("ff8c00"), 0.2, emit=0.01), (0, 0, 0), 12, g)
    return g, beacon

def crosswalk(o):
    """Street along X (road y -3..3), zebra crossing at x 0..1.6, school side sidewalk y 3..6.5, facade at y 9."""
    ox, oy, oz = o; C = _C("cw")
    box("cw_asphalt", (40, 6.0, 0.1), (ox, oy, oz - 0.05), C("4a4e54", 0.85))
    for i in range(-12, 13):
        if -1 <= i <= 1: continue
        box(f"cw_dash{i}", (1.4, 0.12, 0.004), (ox + i * 3.0, oy, oz + 0.002), C("f7d417", 0.5))
    for k in range(7): box(f"cw_zebra{k}", (0.45, 5.6, 0.006), (ox - 1.8 + k * 0.6, oy, oz + 0.004), C("f5f5f5", 0.5))
    for sy in (-1, 1):
        box(f"cw_curb{sy}", (40, 0.3, 0.07), (ox, oy + sy * 3.15, oz + 0.035), C("c9ced3", 0.6))
        box(f"cw_walk{sy}", (40, 3.4, 0.04), (ox, oy + sy * 5.0, oz + 0.0), C("b8bec4", 0.7))
        for i in range(-13, 14): box(f"cw_wj{sy}{i}", (0.02, 3.4, 0.004), (ox + i * 1.5, oy + sy * 5.0, oz + 0.022), C("9aa1a8"))
    box("cw_lawn", (40, 2.4, 0.1), (ox, oy + 7.9, oz + 0.05), C("5fae4a", 0.9))
    box("cw_lawn2", (40, 6.0, 0.1), (ox, oy - 9.6, oz + 0.05), C("5fae4a", 0.9))
    # school facade (daytime brick, blue glass, doors, banner)
    box("cw_school", (40, 0.4, 7.0), (ox, oy + 9.5, oz + 3.5), C("a8552a", 0.8))
    box("cw_school_trim", (40, 0.45, 0.25), (ox, oy + 9.48, oz + 6.9), C("e8e2d6", 0.6))
    for i in range(-9, 10):
        if i in (-1, 0, 1): continue
        for z in (1.6, 4.4):
            box(f"cw_win{i}_{z}", (1.3, 0.05, 1.3), (ox + i * 2.0, oy + 9.28, oz + z), C("8fb8d8", 0.1))
            box(f"cw_winsill{i}_{z}", (1.45, 0.12, 0.08), (ox + i * 2.0, oy + 9.25, oz + z - 0.7), C("e8e2d6", 0.6))
    box("cw_doors", (3.0, 0.06, 2.6), (ox, oy + 9.27, oz + 1.3), C("2c4a6e", 0.3))
    box("cw_porch", (5.0, 1.4, 0.3), (ox, oy + 8.6, oz + 0.15), C("cfcac0", 0.6))
    tex_quad("cw_banner", 4.0, 0.9, "hall_banner.png", (ox, oy + 9.27, oz + 3.2), (R(90), 0, 0))
    # flagpole, fence, trees, bike rack, bench, trash can
    box("cw_flagpole", (0.08, 0.08, 7.5), (ox - 6.5, oy + 7.6, oz + 3.75), C("d9d9d9", 0.3))
    box("cw_flag", (0.02, 1.2, 0.75), (ox - 6.5, oy + 7.0, oz + 6.9), C("1f4e8c", 0.6))
    for i in range(-19, 20):
        if -2 <= i <= 2: continue
        box(f"cw_fencep{i}", (0.05, 0.05, 1.1), (ox + i, oy + 6.7, oz + 0.55), C("2c3e50", 0.4))
    for sx in (-1, 1): box(f"cw_fencer{sx}", (17, 0.04, 0.05), (ox + sx * 11.0, oy + 6.7, oz + 1.0), C("2c3e50", 0.4))
    for i, x in enumerate((-14, -9, 8, 13)): tree(f"cw_tree{i}", ox + x, oy + 7.8, oz, 2.4, 1.1, C)
    for i, x in enumerate((-12, -4, 6, 12)): tree(f"cw_treeb{i}", ox + x, oy - 7.6, oz, 2.6, 1.2, C)
    for k in range(6):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.32, minor_radius=0.025, location=(ox + 4.4 + k * 0.45, oy + 5.9, oz + 0.33), rotation=(R(90), 0, R(90)))
        t_ = bpy.context.active_object; t_.name = f"cw_bike{k}"; t_.data.materials.append(C("7f8c8d", 0.3))
    for k, col in enumerate(("e74c3c", "2980b9", "27ae60")):
        b = empty(f"cw_bk{k}", (ox + 4.65 + k * 0.9, oy + 5.6, oz)); b.rotation_euler = (0, 0, R(90))
        for sy in (-1, 1): _cyl(f"cw_bkw{k}{sy}", 0.3, 0.04, (0, sy * 0.45, 0.32), C("1b1b1b", 0.8), (0, R(90), 0), 14, b)
        box(f"cw_bkf{k}", (0.04, 0.9, 0.05), (0, 0, 0.55), C(col, 0.4), b); box(f"cw_bks{k}", (0.12, 0.2, 0.05), (0, 0.25, 0.85), C("222222"), b)
    box("cw_bench", (1.6, 0.45, 0.08), (ox - 4.0, oy + 5.9, oz + 0.5), C("8a5a33", 0.6))
    for sx in (-1, 1): box(f"cw_benchleg{sx}", (0.06, 0.4, 0.45), (ox - 4.0 + sx * 0.7, oy + 5.9, oz + 0.25), C("2c3e50", 0.4))
    _cyl("cw_trash", 0.28, 0.9, (ox - 2.6, oy + 6.0, oz + 0.45), C("2e7d4f", 0.5))
    # signs: school zone, flashing beacon, crossing sign
    box("cw_signpole", (0.07, 0.07, 2.6), (ox - 3.0, oy + 3.6, oz + 1.3), C("9aa0a6", 0.3))
    tex_quad("cw_schoolzone", 0.62, 0.8, "tmg_schoolzone.png", (ox - 3.0, oy + 3.56, oz + 2.25), (R(90), 0, 0))
    box("cw_beaconpole", (0.1, 0.1, 3.4), (ox + 2.6, oy + 3.6, oz + 1.7), C("2c3e50", 0.4))
    box("cw_beaconbox", (0.35, 0.3, 0.7), (ox + 2.6, oy + 3.45, oz + 3.2), C("f7d417", 0.5))
    lampA = _cyl("cw_lampA", 0.09, 0.06, (ox + 2.6, oy + 3.28, oz + 3.38), mat("cw_amber", srgb("ffb000"), 0.2, emit=6.0), (R(90), 0, 0), 12)
    lampB = _cyl("cw_lampB", 0.09, 0.06, (ox + 2.6, oy + 3.28, oz + 3.02), mat("cw_amber2", srgb("ffb000"), 0.2, emit=6.0), (R(90), 0, 0), 12)
    # parked school bus (far left), parked cars (far side)
    bus = empty("cw_bus", (ox - 12.0, oy + 1.5, oz)); bus.rotation_euler = (0, 0, R(90))
    box("cw_busbody", (2.4, 9.5, 2.5), (0, 0, 1.55), C("f5b800", 0.4), bus, 0.1, 2)
    box("cw_busstripe", (2.42, 9.5, 0.1), (0, 0, 1.2), C("1b1b1b", 0.6), bus)
    for k in range(7): box(f"cw_buswin{k}", (2.44, 0.8, 0.65), (0, -3.6 + k * 1.15, 2.2), C("1f2a36", 0.1), bus)
    for sy in (-1, 1): _cyl(f"cw_buswh{sy}", 0.5, 2.5, (0, sy * 3.1, 0.5), C("1b1b1b", 0.8), (0, R(90), 0), 16, bus)
    def car(name, x, y, col, yaw=90):
        g = empty(name, (ox + x, oy + y, oz)); g.rotation_euler = (0, 0, R(yaw))
        box(name + "_body", (1.8, 4.0, 0.75), (0, 0, 0.6), C(col, 0.35), g, 0.12, 3)
        box(name + "_cab", (1.7, 2.2, 0.6), (0, 0.1, 1.2), C(col, 0.35), g, 0.12, 3)
        box(name + "_glass", (1.72, 2.0, 0.42), (0, 0.1, 1.22), C("1f2a36", 0.1), g)
        for sx in (-1, 1):
            for sy in (-1, 1): _cyl(f"{name}_wh{sx}{sy}", 0.34, 0.24, (sx * 0.86, sy * 1.28, 0.34), C("1b1b1b", 0.8), (0, R(90), 0), 16, g)
    car("cw_car1", -6.0, -2.0, "2e5fa8"); car("cw_car2", 6.5, -2.0, "b03a2e"); car("cw_car3", 12.0, -2.0, "e8e8e8")
    cart, beacon = golf_cart("cw_cart", (ox + 4.4, oy + 2.0, oz), 90, C)
    return dict(cart=cart, beacon=beacon, lamps=(lampA, lampB))

def auditorium(o):
    """Room x -8..8, y -9..9. Stage y 4..9 (top z=1.0, front edge y=4). Seats y -7.5..2.5. Curtain legs at x=+-4.6 (y 4.6..8)."""
    ox, oy, oz = o; C = _C("au")
    box("au_floor", (16.4, 18.4, 0.1), (ox, oy, oz - 0.05), C("5a3a2a", 0.8))
    box("au_carpet", (1.6, 11, 0.012), (ox, oy - 2.5, oz + 0.006), C("7a1f2b", 0.9))
    for n, sz, lc in (("wl", (0.2, 18.4, 7), (ox - 8.2, oy, oz + 3.5)), ("wr", (0.2, 18.4, 7), (ox + 8.2, oy, oz + 3.5)),
                      ("wb", (16.4, 0.2, 7), (ox, oy + 9.2, oz + 3.5)), ("wf", (16.4, 0.2, 7), (ox, oy - 9.2, oz + 3.5)), ("ceil", (16.4, 18.4, 0.2), (ox, oy, oz + 7.1))):
        box("au_" + n, sz, lc, C("2a2f45" if n != "ceil" else "1e2233", 0.9))
    for i in range(-3, 4):
        for sx in (-1, 1): box(f"au_panel{sx}{i}", (0.06, 1.6, 3.2), (ox + sx * 8.08, oy - 2.0 + i * 2.2, oz + 2.4), C("3b4466", 0.8))
    # stage
    box("au_stage", (16.0, 5.0, 1.0), (ox, oy + 6.5, oz + 0.5), C("9c6b3f", 0.6))
    box("au_stagelip", (16.0, 0.08, 0.12), (ox, oy + 3.98, oz + 1.0), C("2b2b2b", 0.6))
    for s in range(3): box(f"au_stair{s}", (1.0, 0.33, 0.33 * (s + 1)), (ox + 7.0, oy + 2.85 + s * 0.33, oz + 0.165 * (s + 1)), C("7a5230", 0.6))
    RED = C("9b1b2a", 0.95)
    box("au_backcurtain", (15.0, 0.15, 5.6), (ox, oy + 8.7, oz + 3.8), RED)
    for k in range(-14, 15): box(f"au_fold{k}", (0.12, 0.2, 5.6), (ox + k * 0.52, oy + 8.6, oz + 3.8), C("7d1421", 0.95))
    for sx in (-1, 1):
        box(f"au_leg{sx}", (1.4, 0.18, 5.1), (ox + sx * 4.6, oy + 5.0, oz + 1.25 + 2.55), RED)       # bottom 25 cm above the stage: feet show
        box(f"au_main{sx}", (2.4, 0.2, 6.0), (ox + sx * 6.9, oy + 4.3, oz + 4.0), RED)
        for k in range(4): box(f"au_mainfold{sx}{k}", (0.1, 0.25, 6.0), (ox + sx * (5.9 + k * 0.6), oy + 4.2, oz + 4.0), C("7d1421", 0.95))
    box("au_valance", (16.0, 0.25, 1.0), (ox, oy + 4.15, oz + 6.5), RED)
    tex_quad("au_banner", 5.5, 1.1, "tmg_aud_banner.png", (ox, oy + 8.55, oz + 5.0), (R(90), 0, 0))
    # podium + mic, flags, chairs on stage, plant
    box("au_podium", (0.9, 0.6, 1.15), (ox - 1.6, oy + 5.0, oz + 1.0 + 0.575), C("5b3a24", 0.5), None, 0.02, 2)
    box("au_podium_seal", (0.5, 0.02, 0.5), (ox - 1.6, oy + 4.69, oz + 1.7), C("ffd23f", 0.4))
    box("au_mic", (0.03, 0.03, 0.35), (ox - 1.6, oy + 4.85, oz + 2.3), C("222222", 0.3)).rotation_euler = (R(-25), 0, 0)
    for k, (x, col) in enumerate(((-6.4, "1f4e8c"), (-5.8, "c0392b"))):
        box(f"au_flagpole{k}", (0.05, 0.05, 2.6), (ox + x, oy + 7.6, oz + 2.3), C("d4a017", 0.3))
        box(f"au_flag{k}", (0.6, 0.05, 1.0), (ox + x + 0.3, oy + 7.6, oz + 3.0), C(col, 0.8))
    for k in range(4):
        box(f"au_schair{k}", (0.5, 0.5, 0.06), (ox + 1.0 + k * 0.8, oy + 6.6, oz + 1.47), C("2c3e50", 0.5))
        box(f"au_schairb{k}", (0.5, 0.06, 0.5), (ox + 1.0 + k * 0.8, oy + 6.85, oz + 1.75), C("2c3e50", 0.5))
    _cyl("au_pot", 0.25, 0.4, (ox + 6.4, oy + 7.6, oz + 1.2), C("c0703f", 0.6)); _sph("au_plant", 0.45, (ox + 6.4, oy + 7.6, oz + 1.75), C("3f8a3f", 0.8))
    # seats: two blocks either side of the aisle
    SEAT, BACK = C("1f3a68", 0.7), C("16294a", 0.7)
    seats = []
    for r in range(8):
        y = oy + 2.2 - r * 1.15
        for c in range(-6, 7):
            if c == 0: continue
            x = ox + c * 0.62 + (0.35 if c > 0 else -0.35)
            box(f"au_seat{r}_{c}", (0.5, 0.48, 0.08), (x, y, oz + 0.43), SEAT, None, 0.02, 1)
            box(f"au_sback{r}_{c}", (0.5, 0.08, 0.6), (x, y - 0.3, oz + 0.75), BACK, None, 0.02, 1)
            box(f"au_sleg{r}_{c}", (0.06, 0.06, 0.4), (x, y, oz + 0.2), C("333333", 0.4))
            seats.append((r, c, x, y))
    # stage lights: truss + cans (emissive) + spot
    box("au_truss", (12, 0.2, 0.2), (ox, oy + 2.0, oz + 6.2), C("7f8c8d", 0.3))
    for k in range(-4, 5): _cyl(f"au_can{k}", 0.13, 0.3, (ox + k * 1.35, oy + 2.0, oz + 5.95), C("1b1b1b", 0.4), (R(-35), 0, 0), 12)
    for k in range(-4, 5): _cyl(f"au_canglow{k}", 0.1, 0.02, (ox + k * 1.35, oy + 2.1, oz + 5.8), mat("au_glow", srgb("fff1c1"), 0.2, emit=5.0), (R(-35), 0, 0), 12)
    for sx in (-1, 1):
        box(f"au_exit{sx}", (0.6, 0.04, 0.25), (ox + sx * 6.5, oy - 9.08, oz + 3.0), mat("au_exitglow", srgb("e74c3c"), 0.3, emit=3.0))
        box(f"au_door{sx}", (1.4, 0.06, 2.3), (ox + sx * 6.5, oy - 9.08, oz + 1.15), C("6b4a2f", 0.5))
    return dict(seats=seats)

def nurse_office(o):
    """Room x -3.2..3.2, y -3..3 (front wall left open for the camera). Door on the left wall at y=-1.4."""
    ox, oy, oz = o; C = _C("nu")
    box("nu_floor", (6.6, 6.2, 0.1), (ox, oy, oz - 0.05), C("b9c4ca", 0.6))
    for i in range(-6, 7): box(f"nu_fx{i}", (0.012, 6.2, 0.004), (ox + i * 0.5, oy, oz + 0.002), C("c3c9ce"))
    for i in range(-6, 7): box(f"nu_fy{i}", (6.6, 0.012, 0.004), (ox, oy + i * 0.5, oz + 0.002), C("c3c9ce"))
    box("nu_floorx", (6.6, 3.2, 0.1), (ox, oy - 4.7, oz - 0.05), mat("nu_b9c4ca", srgb("b9c4ca"), 0.6))   # room continues toward the camera
    for n, sz, lc in (("wb", (6.6, 0.15, 3.0), (ox, oy + 3.1, oz + 1.5)), ("wl", (0.15, 9.4, 3.0), (ox - 3.3, oy - 1.6, oz + 1.5)),
                      ("wr", (0.15, 9.4, 3.0), (ox + 3.3, oy - 1.6, oz + 1.5)), ("ceil", (6.6, 9.4, 0.1), (ox, oy - 1.6, oz + 3.05))):
        box("nu_" + n, sz, lc, C("cfeee2" if n != "ceil" else "f4f4f4", 0.7))
    box("nu_wainscot", (6.5, 0.02, 1.0), (ox, oy + 3.02, oz + 0.5), C("9fd8c4", 0.5))
    box("nu_wainscotL", (0.02, 6.1, 1.0), (ox - 3.22, oy, oz + 0.5), C("9fd8c4", 0.5)); box("nu_wainscotR", (0.02, 6.1, 1.0), (ox + 3.22, oy, oz + 0.5), C("9fd8c4", 0.5))
    light_panel("nu_light", (ox, oy + 0.5, oz + 2.98), (1.4, 0.6))
    # door (left wall) + sign
    box("nu_door", (0.06, 1.0, 2.15), (ox - 3.21, oy - 1.4, oz + 1.08), C("8a5a33", 0.5)); box("nu_knob", (0.06, 0.06, 0.06), (ox - 3.17, oy - 1.05, oz + 1.0), C("d4a017", 0.3))
    tex_quad("nu_doorsign", 0.6, 0.27, "tmg_nurse_door.png", (ox - 3.2, oy - 1.4, oz + 2.4), (R(90), 0, R(-90)))
    # cot with pillow + privacy curtain on a rod
    box("nu_cot", (0.85, 1.9, 0.12), (ox - 2.3, oy + 1.8, oz + 0.6), C("f4f4f4", 0.6)); box("nu_cotpaper", (0.6, 1.9, 0.01), (ox - 2.3, oy + 1.8, oz + 0.665), C("ffffff", 0.9))
    box("nu_pillow", (0.6, 0.35, 0.12), (ox - 2.3, oy + 2.55, oz + 0.72), C("ffffff", 0.9), None, 0.04, 2)
    for sx in (-1, 1):
        for sy in (-1, 1): box(f"nu_cotleg{sx}{sy}", (0.05, 0.05, 0.55), (ox - 2.3 + sx * 0.35, oy + 1.8 + sy * 0.85, oz + 0.27), C("9aa0a6", 0.3))
    box("nu_rod", (0.03, 2.6, 0.03), (ox - 1.6, oy + 1.65, oz + 2.4), C("9aa0a6", 0.3))
    for k in range(5): box(f"nu_curt{k}", (0.06, 0.32, 1.95), (ox - 1.6, oy + 0.55 + k * 0.3, oz + 1.4), C("6fb7d9", 0.9))
    # desk + monitor + candy jar + granola box + cabinet
    box("nu_desk", (1.6, 0.75, 0.06), (ox + 1.7, oy + 1.5, oz + 0.78), C("e8dcc6", 0.5))
    for sx in (-1, 1): box(f"nu_desksd{sx}", (0.05, 0.7, 0.76), (ox + 1.7 + sx * 0.75, oy + 1.5, oz + 0.38), C("bfb39d", 0.5))
    box("nu_monitor", (0.55, 0.05, 0.36), (ox + 2.05, oy + 1.75, oz + 1.12), C("1b1b1b", 0.3)); box("nu_mstand", (0.06, 0.06, 0.2), (ox + 2.05, oy + 1.78, oz + 0.9), C("1b1b1b", 0.3))
    box("nu_screen", (0.5, 0.01, 0.31), (ox + 2.05, oy + 1.72, oz + 1.12), mat("nu_scr", srgb("9fd2ff"), 0.2, emit=1.2))
    _cyl("nu_jar", 0.12, 0.26, (ox + 1.25, oy + 1.45, oz + 0.94), mat("nu_glass", srgb("e8f4fa"), 0.05))
    for k, col in enumerate(("e74c3c", "f1c40f", "2ecc71", "9b59b6", "3498db", "e67e22")):
        _sph(f"nu_candy{k}", 0.035, (ox + 1.2 + (k % 3) * 0.05, oy + 1.42 + (k // 3) * 0.06, oz + 0.86 + (k // 3) * 0.06), C(col, 0.4))
        box(f"nu_stick{k}", (0.01, 0.01, 0.16), (ox + 1.2 + (k % 3) * 0.05, oy + 1.42 + (k // 3) * 0.06, oz + 1.05), C("ffffff", 0.6))
    box("nu_granolabox", (0.28, 0.12, 0.2), (ox + 1.6, oy + 1.3, oz + 0.91), C("d68a2e", 0.6))
    box("nu_cabinet", (1.0, 0.45, 1.9), (ox + 2.7, oy + 2.75, oz + 0.95), C("f4f4f4", 0.5))
    box("nu_cross_v", (0.12, 0.02, 0.36), (ox + 2.7, oy + 2.52, oz + 1.5), C("e02020", 0.5)); box("nu_cross_h", (0.36, 0.02, 0.12), (ox + 2.7, oy + 2.52, oz + 1.5), C("e02020", 0.5))
    # scale, eye chart, posters, chair for patients
    box("nu_scalebase", (0.4, 0.4, 0.06), (ox + 0.2, oy + 2.6, oz + 0.03), C("ecf0f1", 0.4)); box("nu_scalepole", (0.05, 0.05, 1.6), (ox + 0.2, oy + 2.8, oz + 0.8), C("9aa0a6", 0.3))
    box("nu_scalebeam", (0.4, 0.04, 0.06), (ox + 0.2, oy + 2.76, oz + 1.5), C("9aa0a6", 0.3))
    tex_quad("nu_eyechart", 0.6, 0.9, "tmg_eyechart.png", (ox - 0.9, oy + 3.02, oz + 1.6), (R(90), 0, 0))
    tex_quad("nu_hydrate", 0.55, 0.78, "tmg_hydrate.png", (ox + 3.22, oy - 0.4, oz + 1.6), (R(90), 0, R(90)))
    tex_quad("nu_wash", 0.6, 0.3, "bath_wash.png", (ox + 0.9, oy + 3.02, oz + 1.9), (R(90), 0, 0))
    box("nu_pchair", (0.48, 0.48, 0.06), (ox + 2.6, oy - 1.6, oz + 0.44), C("4a90c2", 0.5)); box("nu_pchairb", (0.48, 0.06, 0.5), (ox + 2.6, oy - 1.37, oz + 0.72), C("4a90c2", 0.5))
    for sx in (-1, 1):
        for sy in (-1, 1): box(f"nu_pcl{sx}{sy}", (0.04, 0.04, 0.42), (ox + 2.6 + sx * 0.2, oy - 1.6 + sy * 0.2, oz + 0.21), C("333333", 0.4))
    box("nu_window", (0.05, 1.6, 1.1), (ox + 3.21, oy + 1.4, oz + 1.7), C("bfe3f5", 0.1)); box("nu_blinds", (0.06, 1.6, 0.3), (ox + 3.19, oy + 1.4, oz + 2.15), C("f4f4f4", 0.6))
    _cyl("nu_bin", 0.18, 0.4, (ox + 0.8, oy + 1.4, oz + 0.2), C("bdc3c7", 0.4))
    return dict(desk=(ox + 1.7, oy + 1.5), chair=(ox + 2.6, oy - 1.6), door=(ox - 3.2, oy - 1.4))

def picnic_table(name, x, y, z=0, C=None, top="8a5a33"):
    box(name + "_top", (1.9, 0.8, 0.06), (x, y, z + 0.75), C(top, 0.6), None, 0.01, 1)
    for sy in (-1, 1):
        box(f"{name}_bench{sy}", (1.9, 0.3, 0.05), (x, y + sy * 0.62, z + 0.45), C(top, 0.6))
        for sx in (-1, 1): box(f"{name}_bleg{sy}{sx}", (0.06, 0.06, 0.45), (x + sx * 0.8, y + sy * 0.62, z + 0.22), C("2c3e50", 0.4))
    for sx in (-1, 1): box(f"{name}_leg{sx}", (0.06, 0.06, 0.75), (x + sx * 0.8, y, z + 0.37), C("2c3e50", 0.4))

def patio(o):
    """Concrete patio x -9..9, y -6..6; building wall at y=6.5; tables in a 2x2 grid; vending at x=-6.5."""
    ox, oy, oz = o; C = _C("pt")
    box("pt_ground", (30, 30, 0.1), (ox, oy, oz - 0.05), C("5fae4a", 0.9))
    box("pt_concrete", (18, 12.6, 0.06), (ox, oy, oz + 0.03), C("c9c4bb", 0.8))
    for i in range(-9, 10): box(f"pt_jx{i}", (0.02, 12.6, 0.004), (ox + i, oy, oz + 0.062), C("a9a49b"))
    for i in range(-6, 7): box(f"pt_jy{i}", (18, 0.02, 0.004), (ox, oy + i, oz + 0.062), C("a9a49b"))
    box("pt_wall", (24, 0.4, 5.0), (ox, oy + 6.6, oz + 2.5), C("e2c9a6", 0.8))
    for i in range(-5, 6):
        if i == 0: continue
        box(f"pt_win{i}", (1.4, 0.05, 1.3), (ox + i * 2.2, oy + 6.38, oz + 2.4), C("8fb8d8", 0.1))
    box("pt_door", (2.0, 0.06, 2.4), (ox, oy + 6.38, oz + 1.2), C("2c4a6e", 0.3))
    tex_quad("pt_sign", 3.2, 0.7, "tmg_patio.png", (ox, oy + 6.37, oz + 3.3), (R(90), 0, 0))
    box("pt_awning", (6.0, 1.4, 0.08), (ox, oy + 5.8, oz + 2.9), C("2e7d4f", 0.6)).rotation_euler = (R(-12), 0, 0)
    tables = []
    UMB = (("e74c3c", "f4f4f4"), ("2980b9", "f4f4f4"), ("f39c12", "f4f4f4"), ("27ae60", "f4f4f4"))
    for k, (x, y) in enumerate(((-2.6, 1.6), (2.6, 1.6), (-2.6, -2.4), (2.6, -2.4))):
        picnic_table(f"pt_t{k}", ox + x, oy + y, oz, C, ("8a5a33", "6f8fb8", "8a5a33", "c0703f")[k])
        box(f"pt_upole{k}", (0.05, 0.05, 2.75), (ox + x, oy + y, oz + 1.37), C("ecf0f1", 0.3))
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=1.25, radius2=0.06, depth=0.45, location=(ox + x, oy + y, oz + 2.67))
        um = bpy.context.active_object; um.name = f"pt_umb{k}"; um.data.materials.append(C(UMB[k][0], 0.7))
        _cyl(f"pt_umbrim{k}", 1.26, 0.06, (ox + x, oy + y, oz + 2.45), C(UMB[k][1], 0.7), (0, 0, 0), 8)
        tables.append((ox + x, oy + y))
    # vending, bins, planters, trees, fence + lawn, birds
    vg = empty("pt_vend", (ox - 6.6, oy + 5.6, oz))
    box("pt_vbody", (1.1, 0.8, 1.95), (0, 0, 0.98), C("c0392b", 0.4), vg, 0.02, 1)
    box("pt_vglass", (0.7, 0.02, 1.3), (-0.12, -0.41, 1.15), C("bcd8e8", 0.05), vg)
    for r in range(4):
        for k in range(3): box(f"pt_vsn{r}{k}", (0.15, 0.03, 0.18), (-0.33 + k * 0.21, -0.39, 0.62 + r * 0.3), C(("f1c40f", "27ae60", "2980b9", "8e44ad")[(r + k) % 4], 0.5), vg)
    for k, (col, x) in enumerate((("2e7d4f", 5.6), ("2980b9", 6.3), ("7f8c8d", 7.0))):
        _cyl(f"pt_bin{k}", 0.27, 0.95, (ox + x, oy + 5.7, oz + 0.48), C(col, 0.5))
    for k, x in enumerate((-8.3, 8.3)):
        box(f"pt_planter{k}", (1.2, 3.0, 0.6), (ox + x, oy + 0.5, oz + 0.3), C("8a8580", 0.7))
        for j in range(3): _sph(f"pt_shrub{k}{j}", 0.42, (ox + x, oy - 0.5 + j, oz + 0.75), C("3f8a3f", 0.8))
    for i, (x, y) in enumerate(((-11, -3), (11, -3), (-11, 3), (11, 3), (-6, -9), (5, -9))): tree(f"pt_tree{i}", ox + x, oy + y, oz, 2.5, 1.2, C)
    for i in range(-9, 10): box(f"pt_fence{i}", (0.05, 0.05, 1.0), (ox + i, oy - 6.6, oz + 0.5), C("ecf0f1", 0.4))
    box("pt_fencerail", (18, 0.04, 0.05), (ox, oy - 6.6, oz + 0.9), C("ecf0f1", 0.4))
    for k, (x, y) in enumerate(((0.6, -4.2), (1.1, -4.6), (-4.8, 3.9))):
        b = empty(f"pt_bird{k}", (ox + x, oy + y, oz + 0.06))
        _sph(f"pt_birdb{k}", 0.07, (0, 0, 0.07), C("8d8f93", 0.6), 8, 6, b, (1, 1.4, 0.9)); _sph(f"pt_birdh{k}", 0.045, (0, -0.08, 0.13), C("6c6f75", 0.6), 8, 6, b)
    return dict(tables=tables, vend=(ox - 6.6, oy + 5.6))
