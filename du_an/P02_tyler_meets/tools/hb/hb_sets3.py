"""TM02 sets: school hallway with lockers, gym dance. + 'dance' / 'walk-by' idles. Dense dressing, clean materials (no grain)."""
import bpy, math, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad, light_panel

def _sphere(name, r, loc, m, seg=12, ring=8, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, radius=r, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m)
    if parent: o.parent = parent
    o.location = loc; return o

def hallway(o):
    """Corridor along Y (x = -2..2). Returns dict with locker fronts and walk lane."""
    ox, oy, oz = o
    C = lambda h, r=0.6: mat("hall_" + h, srgb(h), r)
    box("hall_floor", (4.2, 16, 0.1), (ox, oy, oz - 0.05), C("e6dccb", 0.35))
    for i in range(-7, 8):                                                     # tile seams (thin, clean)
        box(f"hall_seam{i}", (4.2, 0.015, 0.004), (ox, oy + i * 1.0, oz + 0.002), C("cfc3ae", 0.5))
    box("hall_ceil", (4.2, 16, 0.1), (ox, oy, oz + 3.2), C("f4f1ea", 0.8))
    for s in (-1, 1):
        box(f"hall_wall{s}", (0.15, 16, 3.2), (ox + s * 2.1, oy, oz + 1.6), C("f0e8d6", 0.8))
        box(f"hall_stripe{s}", (0.02, 16, 0.18), (ox + s * 2.02, oy, oz + 2.05), C("c0392b", 0.5))
    box("hall_end", (4.2, 0.15, 3.2), (ox, oy + 8, oz + 1.6), C("f0e8d6", 0.8))
    box("hall_enddoor", (1.6, 0.06, 2.3), (ox, oy + 7.93, oz + 1.15), C("6d8aa8", 0.4))
    box("hall_endglass", (1.3, 0.07, 0.8), (ox, oy + 7.92, oz + 1.7), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    tex_quad("hall_exit", 0.5, 0.2, "bus_exit.png", (ox, oy + 7.9, oz + 2.75), (R(90), 0, R(180)))
    LK = [C("2f6fb5", 0.35), C("2a63a3", 0.35)]; H = C("c7ccd1", 0.25); V = C("1d4b7e", 0.5)
    fronts = []
    for s in (-1, 1):
        for k in range(18):
            y = oy - 6.6 + k * 0.62
            if s == 1 and 3 <= k <= 5: continue                                  # classroom door gap
            if s == -1 and 9 <= k <= 11: continue                                # trophy case gap
            x = ox + s * 1.82
            box(f"lk{s}_{k}", (0.42, 0.58, 1.9), (x, y, oz + 0.95), LK[k % 2], None, 0.01, 2)
            for v in range(3): box(f"lkv{s}_{k}_{v}", (0.01, 0.4, 0.025), (x - s * 0.215, y, oz + 1.55 + v * 0.06), V)
            box(f"lkh{s}_{k}", (0.03, 0.05, 0.14), (x - s * 0.22, y + 0.2, oz + 1.05), H)
            box(f"lkn{s}_{k}", (0.01, 0.12, 0.06), (x - s * 0.215, y, oz + 1.78), C("f5f5f5", 0.6))
            fronts.append((x - s * 0.5, y, s))
        box(f"hall_lkbase{s}", (0.45, 11.5, 0.08), (ox + s * 1.82, oy - 1.0, oz + 0.04), C("2b2b2b", 0.6))
    # classroom door on the right gap
    box("hall_door", (0.06, 1.0, 2.2), (ox + 2.02, oy - 6.6 + 4 * 0.62, oz + 1.1), C("9c6b3f", 0.5))
    box("hall_doorwin", (0.07, 0.3, 0.55), (ox + 2.0, oy - 6.6 + 4 * 0.62, oz + 1.55), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.0))
    # trophy case on the left gap
    ty = oy - 6.6 + 10 * 0.62
    box("hall_trophycase", (0.45, 1.8, 1.8), (ox - 1.85, ty, oz + 0.9), C("7b5234", 0.5))
    box("hall_trophyglass", (0.02, 1.7, 1.2), (ox - 1.62, ty, oz + 1.15), mat("glass_clear", (0.8, 0.9, 1.0), 0.05))
    G = mat("gold", srgb("d4a017"), 0.25)
    for i in range(5):
        box(f"trophy_b{i}", (0.1, 0.12, 0.08), (ox - 1.78, ty - 0.6 + i * 0.3, oz + 0.95 + (i % 2) * 0.5), C("222222"))
        _sphere(f"trophy_c{i}", 0.06, (ox - 1.78, ty - 0.6 + i * 0.3, oz + 1.1 + (i % 2) * 0.5), G)
    # fountain, trash, bulletin board, clock, banner, lights
    box("hall_fountain", (0.3, 0.45, 0.25), (ox - 1.9, oy + 4.6, oz + 0.9), C("b8bec5", 0.25)); box("hall_fountain_leg", (0.15, 0.15, 0.8), (ox - 1.95, oy + 4.6, oz + 0.4), C("8f979e", 0.3))
    box("hall_trash", (0.4, 0.4, 0.65), (ox + 1.55, oy + 6.2, oz + 0.33), C("4a5560", 0.5), None, 0.03, 2)
    box("hall_board", (0.04, 1.6, 0.9), (ox + 2.01, oy + 5.0, oz + 1.7), C("b98552", 0.9))
    for i, (dy, dz, c) in enumerate([(-0.5, 0.2, "ffffff"), (0.1, 0.25, "f2c0c8"), (0.5, -0.1, "bfe0c8"), (-0.2, -0.2, "ffe9a8")]):
        box(f"hall_paper{i}", (0.01, 0.38, 0.28), (ox + 1.985, oy + 5.0 + dy, oz + 1.7 + dz), C(c, 0.8))
    tex_quad("hall_banner", 2.0, 0.45, "hall_banner.png", (ox - 2.02, oy + 1.5, oz + 2.55), (R(90), 0, R(90)))
    tex_quad("hall_poster", 0.5, 0.7, "poster_kind.png", (ox + 2.02, oy - 0.4, oz + 2.55), (R(90), 0, R(-90)))
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.2, depth=0.04, location=(ox, oy + 7.9, oz + 2.4), rotation=(R(90), 0, 0))
    c_ = bpy.context.active_object; c_.name = "hall_clock"; c_.data.materials.append(C("ffffff", 0.4))
    for i in range(6): light_panel(f"hall_lp{i}", (ox, oy - 6 + i * 2.4, oz + 3.12), (0.6, 1.2))
    return dict(fronts=fronts)

def gym_dance(o):
    """Gym decorated for the dance. Returns spots for DJ, snack table, dance floor centre."""
    ox, oy, oz = o
    C = lambda h, r=0.6: mat("gym_" + h, srgb(h), r)
    box("gym_floor", (16, 16, 0.1), (ox, oy, oz - 0.05), C("c8915a", 0.35))
    W = C("ffffff", 0.5)
    for n, sz, lc in (("cl_c", (0.06, 12, 0.004), (ox, oy, oz + 0.002)), ("cl_m", (14, 0.06, 0.004), (ox, oy, oz + 0.002)),
                      ("cl_l", (0.06, 12, 0.004), (ox - 7, oy, oz + 0.002)), ("cl_r", (0.06, 12, 0.004), (ox + 7, oy, oz + 0.002))):
        box("gym_" + n, sz, lc, W)
    bpy.ops.mesh.primitive_torus_add(major_radius=1.8, minor_radius=0.03, location=(ox, oy, oz + 0.003)); t_ = bpy.context.active_object
    t_.scale = (1, 1, 0.02); t_.name = "gym_circle"; t_.data.materials.append(W)
    for n, sz, lc, c in (("wb", (16, 0.2, 7), (ox, oy + 8, oz + 3.5), "dfe3e8"), ("wl", (0.2, 16, 7), (ox - 8, oy, oz + 3.5), "e8e2d6"),
                         ("wr", (0.2, 16, 7), (ox + 8, oy, oz + 3.5), "e8e2d6"), ("wf", (16, 0.2, 7), (ox, oy - 8, oz + 3.5), "dfe3e8")):
        box("gym_" + n, sz, lc, C(c, 0.8))
    box("gym_ceil", (16, 16, 0.1), (ox, oy, oz + 7), C("2c3036", 0.9))
    box("gym_wallpad", (16, 0.12, 1.8), (ox, oy + 7.88, oz + 0.9), C("1f4e8c", 0.6))
    # bleachers (left)
    for k in range(5):
        box(f"gym_bleach{k}", (0.6, 10, 0.12), (ox - 7.4 + k * 0.6 * 0 , oy, oz + 0.3 + k * 0.4), C("b9bfc6", 0.3))
        box(f"gym_bleachstep{k}", (0.6, 10, 0.4), (ox - 7.4 + k * -0.0, oy, oz + 0.1 + k * 0.4), C("8f979e", 0.4))
    # hoops
    for s in (-1, 1):
        box(f"gym_board{s}", (1.6, 0.06, 1.0), (ox, oy + s * 7.6, oz + 3.6), C("ffffff", 0.3))
        bpy.ops.mesh.primitive_torus_add(major_radius=0.24, minor_radius=0.02, location=(ox, oy + s * 7.25, oz + 3.1)); h_ = bpy.context.active_object
        h_.name = f"gym_hoop{s}"; h_.data.materials.append(C("e67e22", 0.4))
    # banner + string lights + balloons + disco ball
    tex_quad("gym_banner", 5.0, 1.0, "gym_banner.png", (ox, oy + 7.85, oz + 5.2), (R(90), 0, R(180)))
    bulb = [mat("bulb_" + c, srgb(c), 0.2, emit=4.0) for c in ("fff1b8", "ffd1e8", "c8f0ff")]
    for line in range(5):
        y0 = oy - 6 + line * 3
        for k in range(26):
            x = ox - 7.5 + k * 0.6; z = oz + 5.6 - 0.6 * math.sin(math.pi * k / 25)
            _sphere(f"bulb{line}_{k}", 0.05, (x, y0, z), bulb[(k + line) % 3], 6, 4)
    bcols = ["e74c3c", "f1c40f", "3498db", "9b59b6", "ffffff", "1abc9c"]
    rnd = random.Random(3)
    for g, (gx, gy) in enumerate(((ox - 6.8, oy + 7.2), (ox + 6.8, oy + 7.2), (ox - 6.8, oy - 3), (ox + 6.8, oy - 3), (ox + 4.5, oy + 7.3))):
        for k in range(7):
            b = _sphere(f"balloon{g}_{k}", 0.22, (gx + rnd.uniform(-0.35, 0.35), gy + rnd.uniform(-0.3, 0.3), oz + 2.2 + rnd.uniform(0, 0.9)), C(bcols[k % 6], 0.25), 12, 8)
            b.scale = (1, 1, 1.15)
            box(f"string{g}_{k}", (0.005, 0.005, 1.2), (b.location.x, b.location.y, b.location.z - 0.8), C("dddddd"))
    disco = empty("disco", (ox, oy, oz + 5.0))
    _sphere("disco_ball", 0.45, (0, 0, 0), mat("disco_m", (0.85, 0.85, 0.9), 0.05, emit=0.8), 16, 10, disco)
    box("disco_wire", (0.01, 0.01, 1.9), (0, 0, 1.0), C("222222"), disco)
    # DJ booth + speakers
    box("gym_dj", (2.2, 0.8, 1.0), (ox + 2.5, oy + 6.4, oz + 0.5), C("1b1b1f", 0.5), None, 0.02, 2)
    box("gym_djfront", (2.1, 0.02, 0.6), (ox + 2.5, oy + 5.99, oz + 0.55), mat("dj_glow", srgb("8e44ad"), 0.2, emit=2.5))
    box("gym_laptop", (0.4, 0.3, 0.02), (ox + 2.2, oy + 6.3, oz + 1.02), C("aab0b6", 0.3))
    for s in (-1, 1):
        box(f"gym_spk{s}", (0.6, 0.6, 1.4), (ox + 2.5 + s * 1.6, oy + 6.4, oz + 0.7), C("222222", 0.5), None, 0.03, 2)
        for z in (0.95, 0.45): box(f"gym_cone{s}{z}", (0.4, 0.02, 0.4), (ox + 2.5 + s * 1.6, oy + 6.09, oz + z), C("3a3a3a", 0.4))
    # snack table (Tyler's sandwich lives here)
    box("gym_table", (2.4, 0.8, 0.06), (ox - 3.6, oy + 5.8, oz + 0.78), mat("gym_cloth", srgb("ffffff"), 0.7), None, 0.01, 2)
    box("gym_tablecloth", (2.45, 0.85, 0.7), (ox - 3.6, oy + 5.8, oz + 0.42), mat("gym_cloth_r", srgb("c0392b"), 0.7))
    _sphere("gym_punch", 0.25, (ox - 4.4, oy + 5.8, oz + 0.95), mat("punch", srgb("e74c3c"), 0.1), 14, 8).scale = (1, 1, 0.55)
    for k in range(8): box(f"gym_cup{k}", (0.07, 0.07, 0.1), (ox - 3.9 + k * 0.12, oy + 5.6, oz + 0.86), C(["e74c3c", "3498db"][k % 2], 0.4))
    for k in range(3): _sphere(f"gym_chips{k}", 0.16, (ox - 3.2 + k * 0.4, oy + 5.95, oz + 0.86), C("f1c40f", 0.6), 10, 6).scale = (1, 1, 0.4)
    # coloured stage lights
    for i, (c, x) in enumerate((("ff4fa3", -4), ("4fc3ff", 0), ("b04fff", 4))):
        L = bpy.data.lights.new(f"gym_spot{i}", "SPOT"); L.energy = 900; L.color = srgb(c); L.spot_size = R(45)
        so = bpy.data.objects.new(f"gym_spot{i}", L); bpy.context.scene.collection.objects.link(so); so.location = (ox + x, oy + 2, oz + 6.5); so.rotation_euler = (R(20), 0, 0)
    for i in range(4): light_panel(f"gym_lp{i}", (ox - 4.5 + i * 3, oy - 5, oz + 6.92), (1.0, 0.6))
    return dict(disco=disco, dj=(ox + 2.5, oy + 5.6), table=(ox - 3.6, oy + 5.8), center=(ox, oy + 1.0))

def dance(c, f0, f1, seed=0, beat=15, amp=1.0):
    """Natural party dance: knee bounce on the beat, small arm sway, head nod; pattern changes every few bars."""
    rnd = random.Random(seed); off = rnd.randint(0, beat)
    for f in range(f0, f1 + 1, beat):
        b = ((f - f0 + off) // beat) % 2
        c.rot("kn_L", f, 14 * amp if b else 4, 0, 0); c.rot("kn_R", f, 14 * amp if b else 4, 0, 0)
        c.rot("hip_L", f, -8 * amp if b else -2, 0, 0); c.rot("hip_R", f, -8 * amp if b else -2, 0, 0)
        c.rot("chest", f, 4 if b else 0, 0, (6 if b else -6) * amp)
        c.rot("head", f, 6 if b else -2, 0, 0)
        sway = 18 if b else 6
        c.rot("sh_L", f, -25 - sway * amp, 0, 12); c.rot("sh_R", f, -25 - (24 - sway) * amp, 0, -12)
        c.rot("el_L", f, -60, 0, 0); c.rot("el_R", f, -60, 0, 0)
    for b in range(f0 + rnd.randint(10, 40), f1, rnd.randint(70, 110)): c.blink(b)
