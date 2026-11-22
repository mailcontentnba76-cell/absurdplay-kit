"""New sets for the 'Tyler meets…' series: school bus interior, library. Plus idle motion for background characters."""
import bpy, math, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad, light_panel

def school_bus(o):
    """Bus interior, long axis = Y (front = +Y). Returns dict of seat positions: seats[(row, side, pos)] = (x, y)."""
    ox, oy, oz = o
    FL = mat("bus_floor", srgb("3b3f45"), 0.8); WL = mat("bus_wall", srgb("f2ead8"), 0.8); YE = mat("bus_yellow", srgb("f5b800"), 0.6)
    SG = mat("bus_seat", srgb("3f6b4f"), 0.7); MT = mat("bus_metal", srgb("9aa0a6"), 0.3)
    SKY = mat("bus_sky", (0.72, 0.86, 1.0), 0.2, emit=2.2); TREE = mat("bus_tree", srgb("6fae5a"), 0.8, emit=0.5)
    box("bus_floor", (2.4, 12, 0.1), (ox, oy + 0.5, oz - 0.05), FL)
    box("bus_aisle", (0.5, 11.5, 0.012), (ox, oy + 0.5, oz + 0.006), mat("bus_aisle", srgb("2c2f34"), 0.9))
    box("bus_roof", (2.4, 12, 0.1), (ox, oy + 0.5, oz + 2.15), WL, None, 0.04, 2)
    for s in (-1, 1):
        box(f"bus_lowwall{s}", (0.08, 12, 0.85), (ox + s * 1.2, oy + 0.5, oz + 0.42), YE)       # yellow lower panel
        box(f"bus_topwall{s}", (0.08, 12, 0.45), (ox + s * 1.2, oy + 0.5, oz + 1.92), WL)
        box(f"bus_sky{s}", (0.03, 12, 0.85), (ox + s * 1.27, oy + 0.5, oz + 1.27), SKY)          # outside: sky through windows
        for k in range(8):
            box(f"bus_tree{s}{k}", (0.03, 0.7, 0.35), (ox + s * 1.26, oy - 4.5 + k * 1.4, oz + 0.98 + 0.1 * (k % 2)), TREE)
        for k in range(13):                                                                         # window pillars
            box(f"bus_pillar{s}{k}", (0.1, 0.09, 0.85), (ox + s * 1.18, oy - 5.2 + k * 0.9, oz + 1.27), WL)
        box(f"bus_rail{s}", (0.05, 12, 0.05), (ox + s * 1.14, oy + 0.5, oz + 0.86), MT)
    box("bus_back", (2.4, 0.1, 2.2), (ox, oy - 5.5, oz + 1.1), WL)
    box("bus_backwin", (1.4, 0.03, 0.7), (ox, oy - 5.44, oz + 1.35), SKY)
    box("bus_front", (2.4, 0.1, 0.9), (ox, oy + 6.5, oz + 0.45), mat("bus_dash", srgb("2b2b2b"), 0.6))
    box("bus_windshield", (2.2, 0.03, 1.0), (ox, oy + 6.52, oz + 1.45), SKY)
    tex_quad("bus_sign", 0.9, 0.45, "bus_sign.png", (ox, oy + 6.44, oz + 2.0), (R(90), 0, R(180)))
    # driver seat + wheel
    box("bus_dseat", (0.5, 0.5, 0.08), (ox - 0.6, oy + 5.6, oz + 0.5), mat("bus_dseat", srgb("2b2b2b"), 0.7))
    box("bus_dback", (0.5, 0.08, 0.6), (ox - 0.6, oy + 5.32, oz + 0.85), mat("bus_dseat", srgb("2b2b2b"), 0.7))
    wheel = empty("bus_wheel", (ox - 0.6, oy + 6.15, oz + 1.05)); wheel.rotation_euler = (R(-55), 0, 0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.03, location=(0, 0, 0))
    w = bpy.context.active_object; w.name = "bus_wheel_ring"; w.data.materials.append(mat("bus_dash", srgb("2b2b2b"), 0.6)); w.parent = wheel
    box("bus_wheel_spoke", (0.42, 0.03, 0.03), (0, 0, 0), mat("bus_dash", srgb("2b2b2b"), 0.6), wheel)
    seats = {}
    for r in range(10):
        y = oy + 4.2 - r * 0.9
        for s in (-1, 1):
            cx = ox + s * 0.68
            box(f"bus_seat{r}{s}", (0.9, 0.45, 0.14), (cx, y, oz + 0.42), SG, None, 0.05, 2)
            box(f"bus_seatback{r}{s}", (0.9, 0.13, 0.62), (cx, y - 0.27, oz + 0.75), SG, None, 0.05, 2)
            box(f"bus_leg{r}{s}", (0.05, 0.3, 0.35), (ox + s * 0.27, y, oz + 0.18), MT)
            seats[(r, s, "aisle")] = (ox + s * 0.47, y + 0.02); seats[(r, s, "window")] = (ox + s * 0.9, y + 0.02)
    for i, y in enumerate((-3.5, 0, 3.5)):
        light_panel(f"bus_lp{i}", (ox, oy + y, oz + 2.09), (0.4, 1.4))
    return dict(seats=seats, wheel=wheel)

def library(o):
    ox, oy, oz = o
    C = lambda h, r=0.85: mat("lib_" + h, srgb(h), r)
    box("lib_floor", (14, 14, 0.1), (ox, oy, oz - 0.05), C("3d5a80", 0.95))          # blue carpet
    for n, sz, lc, c in (("lib_wb", (14, 0.2, 4.2), (ox, oy + 4.0, oz + 2.1), "e8dcc4"), ("lib_wl", (0.2, 14, 4.2), (ox - 5.5, oy, oz + 2.1), "dfe8d8"),
                         ("lib_wr", (0.2, 14, 4.2), (ox + 5.5, oy, oz + 2.1), "e8dcc4"), ("lib_wf", (14, 0.2, 4.2), (ox, oy - 5.0, oz + 2.1), "e8dcc4")):
        box(n, sz, lc, C(c))
    box("lib_ceil", (14, 14, 0.1), (ox, oy, oz + 4.2), C("f4efe6"))
    tex_quad("lib_quiet", 1.6, 0.52, "quiet.png", (ox + 0.5, oy + 3.88, oz + 2.9), (R(90), 0, R(180)))
    cols = ["c0392b", "2980b9", "27ae60", "f39c12", "8e44ad", "16a085", "d35400", "2c3e50", "7f8c8d"]
    random.seed(11)
    def shelf(name, x, y, rot=0, w=2.2):
        S = C("6e4a2e", 0.7); g = empty(name, (x, y, oz)); g.rotation_euler = (0, 0, R(rot))
        box(name + "_body", (w, 0.45, 2.0), (0, 0, 1.0), S, g, 0.02, 2)
        for r in range(5):
            box(f"{name}_plank{r}", (w - 0.04, 0.42, 0.03), (0, -0.02, 0.15 + r * 0.4), C("8a5a33"), g)
            xx = -w / 2 + 0.08
            while xx < w / 2 - 0.1:
                bw = random.choice((0.05, 0.06, 0.08)); bh = random.choice((0.26, 0.3, 0.34))
                c = random.choice(cols)
                b = box(f"{name}_b{r}_{int(xx*100)}", (bw, 0.3, bh), (xx + bw / 2, -0.06, 0.17 + r * 0.4 + bh / 2), C(c, 0.7), g)
                if random.random() < 0.08: b.rotation_euler = (0, R(12), 0)
                xx += bw + 0.008
        return g
    for i, x in enumerate((-4.0, -1.4, 1.2, 3.8)):
        shelf(f"lib_shelfback{i}", ox + x, oy + 3.6)
    for i, y in enumerate((-2.8, -0.4)):
        shelf(f"lib_shelfL{i}", ox - 5.15, oy + y, 90)
    # reading tables with green lamps
    T = C("b07a4a", 0.6); tables = []
    for i, (x, y) in enumerate(((ox - 1.6, oy + 0.6), (ox + 1.8, oy + 0.6), (ox - 1.6, oy - 2.2), (ox + 1.8, oy - 2.2))):
        box(f"lib_table{i}", (2.0, 1.0, 0.06), (x, y, oz + 0.76), T, None, 0.01, 2)
        for dx in (-0.9, 0.9):
            box(f"lib_tleg{i}{dx}", (0.08, 0.9, 0.73), (x + dx, y, oz + 0.37), T)
        box(f"lib_lamp{i}", (0.06, 0.06, 0.3), (x, y, oz + 0.94), C("c9a24a", 0.3))
        box(f"lib_shade{i}", (0.34, 0.16, 0.1), (x, y, oz + 1.1), mat("lib_shade", srgb("2e7d4f"), 0.3, emit=0.4), None, 0.03, 2)
        for k, dx in enumerate((-0.6, 0.6)):
            box(f"lib_book{i}{k}", (0.24, 0.32, 0.04), (x + dx, y + 0.15, oz + 0.81), C(random.choice(cols), 0.7))
        tables.append((x, y))
    # computers on the right
    for i, y in enumerate((-1.8, -0.6, 0.6)):
        box(f"lib_desk{i}", (0.9, 0.7, 0.75), (ox + 4.8, oy + y, oz + 0.375), C("d9d4c8", 0.5))
        box(f"lib_mon{i}", (0.05, 0.45, 0.32), (ox + 5.0, oy + y, oz + 0.98), mat("lib_screen", (0.5, 0.7, 1.0), 0.2, emit=0.8))
    # librarian desk
    box("lib_counter", (2.2, 0.7, 1.0), (ox - 2.8, oy - 4.0, oz + 0.5), C("7b5234", 0.6), None, 0.02, 2)
    box("lib_stamp", (0.08, 0.08, 0.12), (ox - 2.3, oy - 4.1, oz + 1.06), C("c0392b", 0.4))
    for i, (x, y) in enumerate(((-2, -1.5), (2, -1.5), (-2, 1.8), (2, 1.8))):
        light_panel(f"lib_lp{i}", (ox + x, oy + y, oz + 4.12))
    for i, y in enumerate((-1.5, 1.2)):
        box(f"lib_win{i}", (0.05, 1.6, 1.4), (ox - 5.38, oy + y + 1.5, oz + 2.5), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    return dict(tables=tables, counter=(ox - 2.8, oy - 4.0))

# ---------------------------------------------------------------- idle motion for background characters
# v2 (user 18/11: motion must look human, not jittery): sparse, small, held poses with smooth bezier transitions,
# sinusoidal breathing on the hips, occasional slow head turns, gestures that hold for a second or two.
def breathe(c, f0, f1, amp=1.2, period=90, seed=0):
    ph = random.Random(seed).randint(0, period)
    for f in range(f0, f1 + 1, period // 2):
        c.rot("hips", f, amp if ((f + ph) // (period // 2)) % 2 else -amp * 0.3, 0, 0)

def idle(c, f0, f1, kind="talk", seed=0, seated=True):
    rnd = random.Random(seed)
    breathe(c, f0, f1, 1.0, rnd.randint(80, 110), seed)
    f = f0; head_z = rnd.uniform(-12, 12)
    while f <= f1:
        hold = rnd.randint(40, 75)                       # every pose is held ~1.3-2.5 s
        if rnd.random() < 0.45: head_z = max(-25, min(25, head_z + rnd.uniform(-14, 14)))
        if kind == "talk":
            c.rot("head", f, rnd.uniform(-3, 4), 0, head_z)
            c.rot("sh_R", f, rnd.uniform(-50, -30), 0, rnd.uniform(-12, 0)); c.rot("el_R", f, rnd.uniform(-75, -45))
            c.rot("chest", f, 3, 0, head_z * 0.25)
        elif kind == "phone":
            c.rot("chest", f, 7, 0, 0); c.rot("head", f, 16 + rnd.uniform(-2, 2), 0, rnd.uniform(-4, 4))
            c.rot("sh_R", f, -58, 0, -10); c.rot("el_R", f, -80 + rnd.uniform(-3, 3)); c.rot("sh_L", f, -52, 0, 10); c.rot("el_L", f, -70)
        elif kind == "read":
            c.rot("chest", f, 9, 0, 0); c.rot("head", f, 20 + rnd.uniform(-2, 2), 0, rnd.uniform(-6, 6))
            c.rot("sh_R", f, -48 + rnd.uniform(-6, 4), 0, -14); c.rot("el_R", f, -58)
        elif kind == "laugh":
            c.rot("chest", f, rnd.choice((6, -2)), 0, rnd.uniform(-4, 4)); c.rot("head", f, rnd.choice((6, -8)), 0, head_z)
        elif kind == "look":
            c.rot("chest", f, 2, 0, head_z * 0.2); c.rot("head", f, rnd.uniform(-3, 3), 0, head_z * 1.4)
        elif kind == "drive":
            c.rot("chest", f, 3, 0, 0); c.rot("head", f, 0, 0, rnd.uniform(-6, 6))
            c.rot("sh_L", f, -72, 0, 10); c.rot("sh_R", f, -72, 0, -10); c.rot("el_L", f, -42 + rnd.uniform(-4, 4)); c.rot("el_R", f, -42 + rnd.uniform(-4, 4))
        f += hold
    for b in range(f0 + rnd.randint(10, 50), f1, rnd.randint(70, 110)):
        c.blink(b)
