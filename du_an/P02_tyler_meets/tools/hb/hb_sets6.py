"""TT001 sets (Elijah, "The Aura Farmer"): outdoor basketball court (morning), band room, art room, bus stop (sunset).
Dense dressing, clean materials. Seat tops z=0.47 (Char seated z=-0.34) unless noted. Every function returns key spots."""
import bpy, math, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad, light_panel, backpack
from hb_sets4 import _sph, _cyl
from hb_sets5 import _C, tree


def _quad_on(parent, name, w, h, img, loc, rot):
    q = tex_quad(name, w, h, img, (0, 0, 0), rot); q.parent = parent; q.location = loc; return q


# ---------------------------------------------------------------- 1 OUTDOOR BASKETBALL COURT
def basketball_court(o):
    """Court x -7.5..7.5, y -6..12 (hoop at the +Y end), chain fence y=12.8 and x=+-8, school wall y=18."""
    ox, oy, oz = o; C = _C("bc")
    box("bc_ground", (60, 44, 0.1), (ox, oy + 4, oz - 0.05), C("5fae4a", 0.9))
    box("bc_asphalt", (15, 18, 0.02), (ox, oy + 3, oz), C("2f7d6d", 0.8))
    box("bc_key", (3.6, 4.6, 0.004), (ox, oy + 9.4, oz + 0.012), C("b03a2e", 0.8))
    Wl = C("f4f4f4", 0.5)
    for sx in (-1, 1): box(f"bc_side{sx}", (0.07, 17.4, 0.004), (ox + sx * 7.2, oy + 3, oz + 0.014), Wl)
    box("bc_base", (14.4, 0.07, 0.004), (ox, oy + 11.7, oz + 0.014), Wl)
    box("bc_mid", (14.4, 0.07, 0.004), (ox, oy - 5.7, oz + 0.014), Wl)
    for sx in (-1, 1): box(f"bc_keyl{sx}", (0.07, 4.6, 0.004), (ox + sx * 1.8, oy + 9.4, oz + 0.015), Wl)
    box("bc_ft", (3.6, 0.07, 0.004), (ox, oy + 7.1, oz + 0.015), Wl)
    for k in range(-8, 9):                                   # three-point arc (segments)
        a = R(k * 10); x = ox + 6.0 * math.sin(a); y = oy + 11.2 - 6.0 * math.cos(a)
        if y > oy + 11.7: continue
        s_ = box(f"bc_arc{k}", (1.06, 0.07, 0.004), (x, y, oz + 0.015), Wl); s_.rotation_euler = (0, 0, a)
    for k in range(-9, 10):                                  # half center circle
        a = R(k * 10); s_ = box(f"bc_cc{k}", (0.33, 0.07, 0.004), (ox + 1.8 * math.sin(a), oy - 5.7 + 1.8 * math.cos(a), oz + 0.015), Wl); s_.rotation_euler = (0, 0, -a)
    # hoop: padded pole behind the baseline, arm, backboard, rim, net strings
    box("bc_hpole", (0.16, 0.16, 3.3), (ox, oy + 12.35, oz + 1.65), C("2c3e50", 0.4))
    box("bc_hpad", (0.34, 0.34, 1.8), (ox, oy + 12.35, oz + 0.9), C("1f4e8c", 0.7), None, 0.03, 2)
    box("bc_harm", (0.12, 1.1, 0.12), (ox, oy + 11.85, oz + 3.2), C("2c3e50", 0.4))
    box("bc_board", (1.8, 0.05, 1.05), (ox, oy + 11.3, oz + 3.3), C("f4f4f4", 0.3))
    for nm, sz, dz in (("t", (0.62, 0.02, 0.05), 0.2), ("b", (0.62, 0.02, 0.05), -0.2)): box(f"bc_br{nm}", sz, (ox, oy + 11.27, oz + 3.1 + dz), C("e74c3c", 0.5))
    for sx in (-1, 1): box(f"bc_brs{sx}", (0.05, 0.02, 0.45), (ox + sx * 0.29, oy + 11.27, oz + 3.1), C("e74c3c", 0.5))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.23, minor_radius=0.018, location=(ox, oy + 11.02, oz + 3.05))
    rim = bpy.context.active_object; rim.name = "bc_rim"; rim.data.materials.append(C("ff6a00", 0.4))
    for k in range(8):
        a = R(k * 45); n_ = box(f"bc_net{k}", (0.012, 0.012, 0.42), (ox + 0.2 * math.cos(a), oy + 11.02 + 0.2 * math.sin(a), oz + 2.84), C("f4f4f4", 0.8))
        n_.rotation_euler = (R(8) * math.sin(a), -R(8) * math.cos(a), 0)
    # fence (posts + rails), gate gap at x=+4.6..+5.8 on the back fence
    F = C("8f979e", 0.35)
    for i in range(-16, 17):
        x = ox + i * 0.5
        if 4.6 <= x - ox <= 5.8: continue
        if i % 3 == 0: box(f"bc_fpost{i}", (0.06, 0.06, 2.6), (x, oy + 12.9, oz + 1.3), F)
        else: box(f"bc_fwire{i}", (0.015, 0.015, 2.5), (x, oy + 12.9, oz + 1.25), C("b9c0c6", 0.4))
    for z in (0.05, 1.25, 2.55):
        for sx, (a, b) in ((0, (-8, 4.6)), (1, (5.8, 8))): box(f"bc_frail{z}{sx}", (b - a, 0.04, 0.04), (ox + (a + b) / 2, oy + 12.9, oz + z), F)
    for sx in (-1, 1):
        for j in range(-12, 26):
            y = oy + j * 0.5
            if j % 3 == 0: box(f"bc_fspost{sx}{j}", (0.06, 0.06, 2.6), (ox + sx * 8.0, y, oz + 1.3), F)
            else: box(f"bc_fswire{sx}{j}", (0.015, 0.015, 2.5), (ox + sx * 8.0, y, oz + 1.25), C("b9c0c6", 0.4))
        for z in (0.05, 1.25, 2.55): box(f"bc_fsrail{sx}{z}", (0.04, 19, 0.04), (ox + sx * 8.0, oy + 3.4, oz + z), F)
    # scoreboard + rules sign, bench with backpacks, water bottles, lamp pole, trees, school wall
    for sx in (-1, 1): box(f"bc_sbpost{sx}", (0.1, 0.1, 3.3), (ox - 5.2 + sx * 1.0, oy + 12.6, oz + 1.65), C("2c3e50", 0.4))
    tex_quad("bc_scoreboard", 2.3, 1.06, "tt_court_sign.png", (ox - 5.2, oy + 12.52, oz + 2.75), (R(90), 0, 0))
    tex_quad("bc_rules", 0.6, 0.8, "tt_court_rules.png", (ox + 2.8, oy + 12.86, oz + 1.4), (R(90), 0, 0))
    box("bc_bench", (0.45, 2.2, 0.06), (ox - 7.3, oy + 2.0, oz + 0.47), C("8a5a33", 0.6))
    for j in (-0.9, 0.9): box(f"bc_benchleg{j}", (0.4, 0.06, 0.45), (ox - 7.3, oy + 2.0 + j, oz + 0.22), C("2c3e50", 0.4))
    for k, (col, dy) in enumerate((("e74c3c", -0.6), ("2980b9", 0.15), ("f39c12", 0.75))): backpack(f"bc_bp{k}", (ox - 7.3, oy + 2.0 + dy, oz + 0.5), col, 90)
    for k, dy in enumerate((-1.3, -1.15, 1.4)): _cyl(f"bc_bottle{k}", 0.04, 0.24, (ox - 7.0, oy + 2.0 + dy, oz + 0.13), C(("5dade2", "f4f4f4", "2ecc71")[k], 0.2))
    box("bc_lamppole", (0.14, 0.14, 5.2), (ox + 7.55, oy + 4.0, oz + 2.6), C("6c757d", 0.35))
    box("bc_lamphead", (0.7, 0.35, 0.2), (ox + 7.3, oy + 4.0, oz + 5.2), C("343a40", 0.4))
    for i, (x, y) in enumerate(((-11, 14.5), (-6, 15.5), (0.5, 15.2), (7, 14.8), (11, 15.6), (-11, 2), (11, 6), (-11, -5), (11, -4))):
        tree(f"bc_tree{i}", ox + x, oy + y, oz, 2.6, 1.25, C)
    box("bc_school", (44, 0.4, 7.5), (ox, oy + 19.0, oz + 3.75), C("a8552a", 0.8))
    for i in range(-10, 11):
        for z in (1.8, 4.8): box(f"bc_swin{i}_{z}", (1.3, 0.05, 1.3), (ox + i * 2.0, oy + 18.78, oz + z), C("8fb8d8", 0.1))
    box("bc_sdoor", (2.6, 0.06, 2.6), (ox + 5.2, oy + 18.76, oz + 1.3), C("2c4a6e", 0.3))
    box("bc_walk", (2.0, 5.6, 0.02), (ox + 5.2, oy + 15.9, oz), C("b8bec4", 0.7))
    ball = empty("bc_ball", (0, -90, 0))
    _sph("bc_ballmesh", 0.12, (0, 0, 0), C("e0711c", 0.7), 14, 10, ball)
    for k, rot in enumerate(((0, 0, 0), (R(90), 0, 0), (0, R(90), 0))):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.121, minor_radius=0.006, location=(0, 0, 0))
        t_ = bpy.context.active_object; t_.name = f"bc_ballseam{k}"; t_.data.materials.append(C("1b1b1b", 0.6)); t_.parent = ball; t_.rotation_euler = rot
    return dict(pole=(ox, oy + 12.35), lamp=(ox + 7.55, oy + 4.0), gate=(ox + 5.2, oy + 12.9), bench=(ox - 7.3, oy + 2.0), ball=ball)


# ---------------------------------------------------------------- 2 BAND ROOM
def band_room(o):
    """Room x -6..6, y -5..5, ceiling 3.8. Conductor podium at (0,-2.6) facing +Y; chairs on 2 arcs facing the podium."""
    ox, oy, oz = o; C = _C("bd")
    box("bd_floor", (12.4, 10.4, 0.1), (ox, oy, oz - 0.05), C("a8743f", 0.6))
    for i in range(-6, 7): box(f"bd_seam{i}", (0.015, 10.4, 0.004), (ox + i, oy, oz + 0.002), C("8a5a33", 0.7))
    box("bd_wall_b", (12.4, 0.2, 3.9), (ox, oy + 5.1, oz + 1.95), C("e8dcc4", 0.9))
    box("bd_wall_l", (0.2, 10.4, 3.9), (ox - 6.1, oy, oz + 1.95), C("e8dcc4", 0.9))
    box("bd_wall_r", (0.2, 10.4, 3.9), (ox + 6.1, oy, oz + 1.95), C("dcc9a8", 0.9))
    box("bd_wall_f", (12.4, 0.2, 3.9), (ox, oy - 5.1, oz + 1.95), C("e8dcc4", 0.9))
    box("bd_ceil", (12.4, 10.4, 0.1), (ox, oy, oz + 3.85), C("f4efe6", 0.9))
    box("bd_wainscot", (12.2, 0.04, 1.0), (ox, oy + 4.98, oz + 0.5), C("7a1f2b", 0.7))
    for k, (x, y) in enumerate(((-3, -2), (0, -2), (3, -2), (-3, 1.6), (0, 1.6), (3, 1.6))): light_panel(f"bd_lp{k}", (ox + x, oy + y, oz + 3.78), (1.2, 0.5))
    tex_quad("bd_staff", 3.0, 1.25, "tt_staff_board.png", (ox - 1.8, oy + 4.98, oz + 1.85), (R(90), 0, 0))
    box("bd_staffframe", (3.12, 0.05, 1.37), (ox - 1.8, oy + 5.02, oz + 1.85), C("8a5a33", 0.6))
    tex_quad("bd_banner", 4.2, 0.66, "tt_band_banner.png", (ox + 0.4, oy + 4.98, oz + 3.2), (R(90), 0, 0))
    _cyl("bd_clock", 0.3, 0.05, (ox + 3.3, oy + 4.97, oz + 2.4), C("ffffff", 0.4), (R(90), 0, 0), 20)
    _cyl("bd_clockrim", 0.32, 0.04, (ox + 3.3, oy + 4.99, oz + 2.4), C("2c3e50", 0.4), (R(90), 0, 0), 20)
    hpiv = empty("bd_clock_hpiv", (ox + 3.3, oy + 4.93, oz + 2.4)); box("bd_clock_h", (0.03, 0.01, 0.16), (0, 0, 0.07), C("1b1b1b", 0.5), hpiv)
    mpiv = empty("bd_clock_mpiv", (ox + 3.3, oy + 4.925, oz + 2.4)); box("bd_clock_m", (0.02, 0.01, 0.24), (0, 0, 0.11), C("1b1b1b", 0.5), mpiv)
    for i, y in enumerate((-2.5, 0.5, 3.2)): box(f"bd_win{i}", (0.05, 1.5, 1.4), (ox - 5.98, oy + y, oz + 2.0), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    box("bd_cabinet", (0.6, 3.6, 2.3), (ox + 5.7, oy + 1.4, oz + 1.15), C("6b4a2f", 0.6))
    for r in range(3):
        for k in range(4): box(f"bd_cubby{r}{k}", (0.03, 0.8, 0.6), (ox + 5.39, oy + 0.05 + k * 0.9, oz + 0.45 + r * 0.72), C("3a2a1e", 0.7))
    tex_quad("bd_door", 1.0, 0.44, "tt_band_door.png", (ox - 3.8, oy - 4.98, oz + 2.45), (R(90), 0, R(180)))
    box("bd_doorleaf", (1.1, 0.06, 2.2), (ox - 3.8, oy - 5.0, oz + 1.1), C("6b4a2f", 0.6))
    for k, (x, img) in enumerate(((-4.6, "tt_sheet_tuba.png"), (4.3, "tt_sheet_triangle.png"))):
        tex_quad(f"bd_poster{k}", 0.6, 0.8, img, (ox + x, oy + 4.98, oz + 1.9), (R(90), 0, 0))
    # podium + conductor stand
    cpx, cpy = ox, oy - 2.6
    box("bd_podium", (0.9, 0.9, 0.2), (cpx, cpy, oz + 0.1), C("5a3a22", 0.6))
    box("bd_cstand_pole", (0.04, 0.04, 1.1), (cpx, cpy + 0.9, oz + 0.55), C("1b1b1b", 0.4))
    box("bd_cstand_plate", (0.5, 0.02, 0.36), (cpx, cpy + 0.9, oz + 1.15), C("1b1b1b", 0.4)).rotation_euler = (R(25), 0, 0)
    # chairs + music stands on two arcs (students face the podium)
    seats = []
    CH = C("2c3e50", 0.6); MT = C("1b1b1b", 0.4)
    for row, (r, angs) in enumerate(((2.3, (-50, -25, 0, 25, 50)), (3.6, (-54, -36, -18, 0, 18, 36, 54)))):
        for k, a in enumerate(angs):
            x = cpx + r * math.sin(R(a)); y = cpy + r * math.cos(R(a)); yaw = -a
            g = empty(f"bd_ch{row}{k}", (x, y, oz)); g.rotation_euler = (0, 0, R(yaw))
            box(f"bd_seat{row}{k}", (0.44, 0.44, 0.05), (0, 0, 0.445), CH, g, 0.01, 1)
            box(f"bd_chback{row}{k}", (0.44, 0.05, 0.42), (0, 0.22, 0.72), CH, g, 0.01, 1)
            for i, (dx, dy) in enumerate(((-0.19, -0.19), (0.19, -0.19), (-0.19, 0.19), (0.19, 0.19))): box(f"bd_cl{row}{k}{i}", (0.03, 0.03, 0.44), (dx, dy, 0.22), MT, g)
            box(f"bd_mspole{row}{k}", (0.03, 0.03, 1.0), (0, -0.85, 0.5), MT, g)
            pl = box(f"bd_msplate{row}{k}", (0.44, 0.02, 0.3), (0, -0.85, 1.05), MT, g); pl.rotation_euler = (R(-25), 0, 0)
            seats.append(dict(row=row, k=k, x=x, y=y, yaw=yaw, g=g))
    # drum kit (back right on a riser) + xylophone (back left)
    box("bd_riser", (2.6, 1.6, 0.25), (ox + 4.0, oy + 3.9, oz + 0.125), C("5a3a22", 0.6))
    _cyl("bd_kick", 0.32, 0.36, (ox + 4.0, oy + 3.7, oz + 0.57), C("c0392b", 0.4), (R(90), 0, 0), 20)
    _cyl("bd_kickface", 0.28, 0.37, (ox + 4.0, oy + 3.7, oz + 0.57), C("f4f4f4", 0.5), (R(90), 0, 0), 20)
    for k, (dx, dy, r, z) in enumerate(((-0.55, -0.2, 0.18, 0.75), (0.55, -0.1, 0.2, 0.7), (-0.25, 0.25, 0.14, 0.95), (0.3, 0.3, 0.14, 0.95))):
        _cyl(f"bd_drum{k}", r, 0.2, (ox + 4.0 + dx, oy + 3.7 + dy, oz + z), C("c0392b", 0.4), (0, 0, 0), 16)
    for k, (dx, dy, z) in enumerate(((-0.8, 0.3, 1.35), (0.85, 0.35, 1.3))):
        _cyl(f"bd_cym{k}", 0.25, 0.015, (ox + 4.0 + dx, oy + 3.7 + dy, oz + z), C("d4a017", 0.25), (0, 0, 0), 20)
        box(f"bd_cymst{k}", (0.025, 0.025, z), (ox + 4.0 + dx, oy + 3.7 + dy, oz + z / 2), MT)
    box("bd_xylo_frame", (1.5, 0.5, 0.06), (ox - 4.2, oy + 3.8, oz + 0.85), C("6b4a2f", 0.6))
    for k in range(12): box(f"bd_xbar{k}", (0.09, 0.42 - k * 0.015, 0.03), (ox - 4.85 + k * 0.12, oy + 3.8, oz + 0.9), C("b5651d", 0.5))
    for sx in (-1, 1): box(f"bd_xleg{sx}", (0.05, 0.4, 0.85), (ox - 4.2 + sx * 0.65, oy + 3.8, oz + 0.42), MT)
    return dict(cp=(cpx, cpy), seats=seats, clock=(hpiv, mpiv))


# ---------------------------------------------------------------- 3 ART ROOM
def easel(name, x, y, yaw, img, C):
    g = empty(name, (x, y, 0)); g.rotation_euler = (0, 0, R(yaw)); W = C("8a5a33", 0.6)
    for sx in (-1, 1): box(f"{name}_leg{sx}", (0.04, 0.04, 1.75), (sx * 0.32, 0, 0.86), W, g).rotation_euler = (R(-6), 0, R(sx * -4))
    box(f"{name}_back", (0.04, 0.04, 1.6), (0, 0.32, 0.78), W, g).rotation_euler = (R(18), 0, 0)
    box(f"{name}_ledge", (0.78, 0.09, 0.03), (0, -0.09, 0.85), W, g)
    box(f"{name}_canvas", (0.72, 0.03, 0.92), (0, -0.1, 1.33), C("f7f4ec", 0.8), g).rotation_euler = (R(-6), 0, 0)
    q = _quad_on(g, f"{name}_art", 0.7, 0.9, img, (0, -0.118, 1.33), (R(84), 0, 0))
    return g, q

def coat_rack(name, loc, C):
    x, y, z = loc; K = C("3a2a1e", 0.5)
    _cyl(f"{name}_pole", 0.03, 1.8, (x, y, z + 0.9), K)
    for a in (0, 120, 240): box(f"{name}_foot{a}", (0.04, 0.42, 0.04), (x + 0.18 * math.sin(R(a)), y + 0.18 * math.cos(R(a)), z + 0.04), K).rotation_euler = (0, 0, R(-a))
    _sph(f"{name}_knob", 0.05, (x, y, z + 1.82), K)
    for a in (45, 135, 225, 315): box(f"{name}_hook{a}", (0.025, 0.2, 0.025), (x + 0.08 * math.sin(R(a)), y + 0.08 * math.cos(R(a)), z + 1.68), K).rotation_euler = (R(25), 0, R(-a))
    _cyl(f"{name}_hat", 0.13, 0.1, (x + 0.16, y - 0.1, z + 1.8), C("2c3e50", 0.7))
    _cyl(f"{name}_hatbrim", 0.2, 0.02, (x + 0.16, y - 0.1, z + 1.75), C("2c3e50", 0.7))
    box(f"{name}_jacket", (0.42, 0.18, 0.8), (x - 0.05, y - 0.16, z + 1.25), C("f2c230", 0.8), None, 0.04, 2)
    box(f"{name}_scarf", (0.12, 0.05, 0.6), (x - 0.17, y + 0.08, z + 1.35), C("c0392b", 0.8))

def art_room(o):
    """Room x -6..6, y -5..5. Elijah paints at the center easel facing +X; Tyler poses on a stool to the east; coat rack behind Tyler."""
    ox, oy, oz = o; C = _C("ar")
    box("ar_floor", (12.4, 10.4, 0.1), (ox, oy, oz - 0.05), C("b9b4ab", 0.7))
    rnd = random.Random(7)
    for k in range(26):
        box(f"ar_splat{k}", (rnd.uniform(0.08, 0.3), rnd.uniform(0.06, 0.22), 0.004), (ox + rnd.uniform(-5.5, 5.5), oy + rnd.uniform(-4.5, 4.5), oz + 0.002),
            C(rnd.choice(("e74c3c", "f1c40f", "3498db", "2ecc71", "9b59b6", "e67e22")), 0.6)).rotation_euler = (0, 0, rnd.uniform(0, 3))
    box("ar_wall_b", (12.4, 0.2, 3.9), (ox, oy + 5.1, oz + 1.95), C("f4f1ea", 0.9))
    box("ar_wall_l", (0.2, 10.4, 3.9), (ox - 6.1, oy, oz + 1.95), C("f4f1ea", 0.9))
    box("ar_wall_r", (0.2, 10.4, 3.9), (ox + 6.1, oy, oz + 1.95), C("eae2d2", 0.9))
    box("ar_wall_f", (12.4, 0.2, 3.9), (ox, oy - 5.1, oz + 1.95), C("f4f1ea", 0.9))
    box("ar_ceil", (12.4, 10.4, 0.1), (ox, oy, oz + 3.85), C("ffffff", 0.9))
    for k, (x, y) in enumerate(((-3, -2), (0, -2), (3, -2), (-3, 1.6), (0, 1.6), (3, 1.6))): light_panel(f"ar_lp{k}", (ox + x, oy + y, oz + 3.78), (1.2, 0.5))
    for i, y in enumerate((-2.6, 0.2, 3.0)): box(f"ar_win{i}", (0.05, 1.8, 1.6), (ox - 5.98, oy + y, oz + 2.0), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    tex_quad("ar_wheel", 1.2, 1.2, "tt_colorwheel.png", (ox - 3.6, oy + 4.98, oz + 2.0), (R(90), 0, 0))
    tex_quad("ar_sign", 3.0, 0.6, "tt_art_sign.png", (ox + 0.8, oy + 4.98, oz + 3.15), (R(90), 0, 0))
    box("ar_line", (7.0, 0.015, 0.015), (ox + 0.8, oy + 4.4, oz + 2.55), C("ecf0f1", 0.5))
    for k in range(8):
        box(f"ar_paper{k}", (0.42, 0.01, 0.55), (ox - 2.4 + k * 0.85, oy + 4.4, oz + 2.25), C(("fde2e4", "e2ece9", "fff1c1", "dfe7fd", "f9dcc4", "d8f3dc", "f1c0e8", "cfe1b9")[k], 0.8))
    for r in range(3):                                         # clay shelf (back right)
        box(f"ar_shelf{r}", (2.2, 0.45, 0.04), (ox + 4.4, oy + 4.7, oz + 0.6 + r * 0.6), C("8a5a33", 0.6))
        for k in range(4): _sph(f"ar_clay{r}{k}", 0.1 + 0.02 * ((r + k) % 3), (ox + 3.6 + k * 0.5, oy + 4.7, oz + 0.72 + r * 0.6), C(("b5651d", "c98a3e", "8e5a3c", "d9a066")[k], 0.8))
    for sx in (-1, 1): box(f"ar_shelfside{sx}", (0.04, 0.45, 1.8), (ox + 4.4 + sx * 1.1, oy + 4.7, oz + 0.9), C("8a5a33", 0.6))
    box("ar_counter", (0.7, 3.0, 0.9), (ox + 5.7, oy - 1.4, oz + 0.45), C("6f8fb8", 0.6))
    box("ar_countertop", (0.75, 3.05, 0.05), (ox + 5.7, oy - 1.4, oz + 0.92), C("dfe6ee", 0.4))
    box("ar_sink", (0.5, 0.7, 0.05), (ox + 5.7, oy - 1.0, oz + 0.95), C("9aa0a6", 0.2))
    for k in range(5): _cyl(f"ar_cup{k}", 0.05, 0.12, (ox + 5.6, oy - 2.4 + k * 0.14, oz + 1.01), C(("e74c3c", "f1c40f", "3498db", "2ecc71", "9b59b6")[k], 0.4))
    # clay table + stools (back left), the coat rack by the door/east wall
    box("ar_table", (2.6, 1.1, 0.06), (ox - 3.0, oy + 2.5, oz + 0.75), C("8a5a33", 0.6))
    for sx in (-1, 1):
        for sy in (-1, 1): box(f"ar_tleg{sx}{sy}", (0.06, 0.06, 0.75), (ox - 3.0 + sx * 1.2, oy + 2.5 + sy * 0.45, oz + 0.37), C("2c3e50", 0.4))
    for k in range(4): _sph(f"ar_tclay{k}", 0.09, (ox - 3.9 + k * 0.6, oy + 2.4, oz + 0.84), C("b5651d", 0.8))
    stools = []
    for k, (x, y) in enumerate(((-3.6, 1.55), (-2.4, 1.55), (1.45, 0.6))):
        _cyl(f"ar_stool{k}", 0.2, 0.05, (ox + x, oy + y, oz + 0.445), C("e67e22", 0.5), (0, 0, 0), 16)
        for a in (0, 120, 240): box(f"ar_stleg{k}{a}", (0.03, 0.03, 0.44), (ox + x + 0.13 * math.sin(R(a)), oy + y + 0.13 * math.cos(R(a)), oz + 0.22), C("2c3e50", 0.4))
        stools.append((ox + x, oy + y))
    coat_rack("ar_rack", (ox + 2.35, oy + 1.55, oz), C)
    eli_easel, eli_art = easel("ar_easel_eli", ox - 0.45, oy + 0.6, -90, "tt_canvas_rack.png", C)
    others = []
    for k, (x, y, yaw, img) in enumerate(((-3.2, -1.8, 180, "tt_canvas_p1.png"), (2.6, -2.2, 160, "tt_canvas_p2.png"), (-0.8, -3.2, 200, "tt_canvas_p3.png"))):
        others.append(easel(f"ar_easel{k}", ox + x, oy + y, yaw, img, C)[0])
    return dict(eli_easel=(ox - 0.45, oy + 0.6), eli_art=eli_art, stool_me=stools[2], stools=stools[:2], rack=(ox + 2.35, oy + 1.55),
                easels=[(ox - 3.2, oy - 1.8, 180), (ox + 2.6, oy - 2.2, 160), (ox - 0.8, oy - 3.2, 200)])


# ---------------------------------------------------------------- 4 BUS STOP (sunset)
def bus_stop(o):
    """Road along X (y -7..0), curb at y 0..0.3, sidewalk y 0.3..4 (top z=0.12), shelter at y~3. Bus drives +X on y=-1.6."""
    ox, oy, oz = o; C = _C("bs")
    box("bs_ground", (60, 34, 0.1), (ox, oy + 8, oz - 0.05), C("5fae4a", 0.9))
    box("bs_asphalt", (60, 7.0, 0.02), (ox, oy - 3.5, oz), C("4a4e54", 0.85))
    for i in range(-10, 11): box(f"bs_dash{i}", (1.4, 0.12, 0.004), (ox + i * 3.0, oy - 4.2, oz + 0.012), C("f7d417", 0.5))
    box("bs_curb", (60, 0.3, 0.14), (ox, oy + 0.15, oz + 0.07), C("c9ced3", 0.6))
    box("bs_walk", (60, 3.7, 0.12), (ox, oy + 2.15, oz + 0.06), C("b8bec4", 0.7))
    for i in range(-20, 21): box(f"bs_wj{i}", (0.02, 3.7, 0.004), (ox + i * 1.5, oy + 2.15, oz + 0.122), C("9aa1a8"))
    # shelter: glass back, posts, roof, bench
    box("bs_glass", (4.0, 0.05, 2.0), (ox, oy + 3.55, oz + 1.2), C("bcd8e8", 0.05))
    for sx in (-1, 1):
        box(f"bs_post{sx}", (0.08, 0.08, 2.4), (ox + sx * 2.05, oy + 3.55, oz + 1.32), C("2c3e50", 0.4))
        box(f"bs_postf{sx}", (0.08, 0.08, 2.4), (ox + sx * 2.05, oy + 2.15, oz + 1.32), C("2c3e50", 0.4))
        box(f"bs_side{sx}", (0.04, 1.3, 1.6), (ox + sx * 2.05, oy + 2.85, oz + 1.2), C("bcd8e8", 0.05))
    box("bs_roof", (4.4, 1.8, 0.1), (ox, oy + 2.85, oz + 2.55), C("2c3e50", 0.4))
    box("bs_ad", (1.6, 0.03, 1.0), (ox - 1.0, oy + 3.52, oz + 1.4), C("ffd23f", 0.5))
    box("bs_bench", (3.2, 0.42, 0.05), (ox, oy + 3.0, oz + 0.565), C("8a5a33", 0.6))
    for sx in (-1, 0, 1): box(f"bs_benchleg{sx}", (0.06, 0.38, 0.45), (ox + sx * 1.4, oy + 3.0, oz + 0.34), C("2c3e50", 0.4))
    box("bs_signpole", (0.07, 0.07, 2.7), (ox + 2.9, oy + 0.75, oz + 1.47), C("9aa0a6", 0.3))
    tex_quad("bs_sign", 0.5, 0.66, "tt_busstop.png", (ox + 2.9, oy + 0.7, oz + 2.4), (R(90), 0, 0))
    _cyl("bs_trash", 0.26, 0.85, (ox - 2.8, oy + 3.4, oz + 0.55), C("2e7d4f", 0.5))
    box("bs_lamppole", (0.12, 0.12, 5.0), (ox - 4.6, oy + 0.7, oz + 2.6), C("6c757d", 0.35))
    box("bs_lamphead", (0.7, 0.3, 0.18), (ox - 4.35, oy + 0.7, oz + 5.1), mat("bs_lampglow", srgb("ffe2a8"), 0.3, emit=4.0))
    for i, (x, y) in enumerate(((-9, 6), (-4, 7), (3, 6.5), (8, 7), (12, 6), (-13, 6.5))): tree(f"bs_tree{i}", ox + x, oy + y, oz, 2.5, 1.2, C)
    box("bs_school", (44, 0.4, 7.0), (ox, oy + 13.0, oz + 3.5), C("a8552a", 0.8))
    for i in range(-10, 11):
        for z in (1.8, 4.6): box(f"bs_swin{i}_{z}", (1.3, 0.05, 1.3), (ox + i * 2.0, oy + 12.78, oz + z), mat("bs_winglow", srgb("ffcf8a"), 0.2, emit=1.2))
    # school bus: front = +X (local -Y), door side faces the curb (+Y world)
    bus = empty("bs_bus", (ox - 14.0, oy - 1.6, oz)); bus.rotation_euler = (0, 0, R(90))
    box("bs_busbody", (2.4, 9.5, 2.5), (0, 0, 1.55), C("f5b800", 0.4), bus, 0.1, 2)
    box("bs_busstripe", (2.42, 9.5, 0.1), (0, 0, 1.2), C("1b1b1b", 0.6), bus)
    box("bs_busstripe2", (2.42, 9.5, 0.06), (0, 0, 0.75), C("1b1b1b", 0.6), bus)
    for k in range(7): box(f"bs_buswin{k}", (2.44, 0.8, 0.65), (0, -2.6 + k * 1.05, 2.2), C("1f2a36", 0.1), bus)
    box("bs_buswind", (2.2, 0.05, 0.9), (0, -4.76, 2.1), C("1f2a36", 0.1), bus)
    box("bs_busdoor", (0.04, 0.8, 1.9), (1.22, -3.6, 1.25), C("1f2a36", 0.1), bus)
    for sx in (-1, 1): _cyl(f"bs_buslight{sx}", 0.12, 0.05, (sx * 0.85, -4.78, 0.8), mat("bs_headlight", srgb("fff4d6"), 0.2, emit=5.0), (R(90), 0, 0), 12, bus)
    q = _quad_on(bus, "bs_busdest", 1.6, 0.28, "tt_bus_dest.png", (0, -4.79, 2.72), (R(90), 0, 0))
    wheels = []
    for sy in (-1, 1):
        for sx in (-1, 1):
            w = _cyl(f"bs_buswh{sx}{sy}", 0.5, 0.35, (sx * 1.1, sy * 3.1, 0.5), C("1b1b1b", 0.8), (0, R(90), 0), 16, bus); wheels.append(w)
            _cyl(f"bs_bushub{sx}{sy}", 0.22, 0.36, (sx * 1.1, sy * 3.1, 0.5), C("c9ced3", 0.4), (0, R(90), 0), 12, bus)
    return dict(bench=(ox, oy + 3.0), bus=bus, sign=(ox + 2.9, oy + 0.75), walk_z=0.12)
