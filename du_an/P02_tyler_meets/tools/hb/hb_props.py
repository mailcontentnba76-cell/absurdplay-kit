"""Set dressing (detail pass, user feedback 18/11: sets too plain vs reference)."""
import bpy, os, math
from hb_lib import box, mat, srgb, R

_TEX = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "assets", "hb", "tex"))

def tex_quad(name, w, h, img, loc, rot):
    bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.active_object; o.name = name
    o.scale = (w, h, 1); bpy.ops.object.transform_apply(scale=True)
    m = bpy.data.materials.new(name + "_m"); m.use_nodes = True; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    t = nt.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(os.path.join(_TEX, img))
    # mirror-proof: seen from the back face, flip U so text never reads reversed
    tc = nt.nodes.new("ShaderNodeTexCoord"); sp = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["UV"], sp.inputs[0])
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0; nt.links.new(sp.outputs["X"], inv.inputs[1])
    cb = nt.nodes.new("ShaderNodeCombineXYZ"); nt.links.new(inv.outputs[0], cb.inputs["X"]); nt.links.new(sp.outputs["Y"], cb.inputs["Y"])
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    df = nt.nodes.new("ShaderNodeVectorMath"); df.operation = "SUBTRACT"; nt.links.new(cb.outputs[0], df.inputs[0]); nt.links.new(tc.outputs["UV"], df.inputs[1])
    sc = nt.nodes.new("ShaderNodeVectorMath"); sc.operation = "SCALE"; nt.links.new(df.outputs[0], sc.inputs[0]); nt.links.new(geo.outputs["Backfacing"], sc.inputs["Scale"])
    ad = nt.nodes.new("ShaderNodeVectorMath"); ad.operation = "ADD"; nt.links.new(tc.outputs["UV"], ad.inputs[0]); nt.links.new(sc.outputs[0], ad.inputs[1])
    nt.links.new(ad.outputs[0], t.inputs["Vector"])
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); b.inputs["Roughness"].default_value = 0.85
    o.data.materials.append(m); o.location = loc; o.rotation_euler = rot; return o

def light_panel(name, loc, size=(1.2, 0.5)):
    box(name + "_frame", (size[0] + 0.06, size[1] + 0.06, 0.04), loc, mat("lp_frame", srgb("d9d9d9"), 0.5))
    box(name, (size[0], size[1], 0.045), (loc[0], loc[1], loc[2] - 0.005), mat("lp_glow", (1, 0.98, 0.92), 0.3, emit=3.0))

def backpack(name, loc, col, yaw=0):
    x, y, z = loc; m = mat("bp_" + col, srgb(col), 0.8)
    b = box(name, (0.32, 0.18, 0.4), (x, y, z + 0.2), m, None, 0.05, 2); b.rotation_euler = (0, 0, R(yaw))
    p = box(name + "_pocket", (0.24, 0.06, 0.16), (x, y - 0.11, z + 0.12), m, None, 0.03, 2); p.rotation_euler = (0, 0, R(yaw))

def window_frames(oy, oz, ys, x_wall, h=1.4, w=1.6):
    F = mat("winframe", srgb("ffffff"), 0.4); cx = x_wall + 0.04
    for i, y in enumerate(ys):
        tag = f"{i}_{int(x_wall)}"
        box(f"wf_t{tag}", (0.08, w + 0.1, 0.08), (cx, oy + y, oz + 2.0 + h / 2), F)
        box(f"wf_b{tag}", (0.14, w + 0.1, 0.08), (cx, oy + y, oz + 2.0 - h / 2), F)
        box(f"wf_l{tag}", (0.08, 0.08, h), (cx, oy + y - w / 2, oz + 2.0), F)
        box(f"wf_r{tag}", (0.08, 0.08, h), (cx, oy + y + w / 2, oz + 2.0), F)
        box(f"wf_m{tag}", (0.06, 0.05, h), (cx, oy + y, oz + 2.0), F)
        box(f"wf_h{tag}", (0.06, w, 0.05), (cx, oy + y, oz + 2.0), F)

def class_props(o=(0, 0, 0)):
    ox, oy, oz = o
    tex_quad("chalk_tex", 3.15, 1.27, "chalkboard.png", (ox - 0.5, oy + 3.805, oz + 1.8), (R(90), 0, 0))
    box("chalk_tray", (3.2, 0.12, 0.04), (ox - 0.5, oy + 3.8, oz + 1.13), mat("set_8a5a33", srgb("8a5a33")))
    for i, (x, img) in enumerate([(-4.6, "poster_read.png"), (2.0, "poster_kind.png")]):
        tex_quad(f"poster{i}", 0.6, 0.84, img, (ox + x, oy + 3.88, oz + 2.0), (R(90), 0, 0))
    tex_quad("poster_math", 0.6, 0.84, "poster_math.png", (ox + 5.38, oy - 2.2, oz + 2.0), (R(90), 0, R(-90)))
    window_frames(oy, oz, (-1.5, 1.2), ox - 5.38)
    for i, (x, y) in enumerate([(-2, -1.5), (2, -1.5), (-2, 1.8), (2, 1.8)]):
        light_panel(f"lp{i}", (ox + x, oy + y, oz + 4.12))
    T = mat("tdesk", srgb("7b5234"), 0.6)
    box("tdesk", (1.6, 0.8, 0.75), (ox + 2.6, oy + 2.9, oz + 0.375), T, None, 0.02, 2)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.16, location=(ox + 2.1, oy + 2.9, oz + 0.98))
    g = bpy.context.active_object; g.data.materials.append(mat("globe", srgb("3a8fd1"), 0.5)); g.name = "globe"
    box("globe_stand", (0.06, 0.06, 0.14), (ox + 2.1, oy + 2.9, oz + 0.8), mat("set_222222", srgb("222222")))
    box("tapple", (0.09, 0.09, 0.09), (ox + 2.9, oy + 2.75, oz + 0.8), mat("caf_d23a2a", srgb("d23a2a"), 0.4))
    for i, c in enumerate(["c0392b", "2980b9", "27ae60", "f39c12"]):
        box(f"tbook{i}", (0.22, 0.3, 0.05), (ox + 3.1, oy + 2.95, oz + 0.78 + i * 0.05), mat("book" + c, srgb(c), 0.7))
    S = mat("shelf", srgb("8a5a33"), 0.7)
    box("shelf", (0.4, 1.8, 1.6), (ox + 5.2, oy + 2.4, oz + 0.8), S, None, 0.02, 2)
    cols = ["c0392b", "2980b9", "27ae60", "f39c12", "8e44ad", "16a085", "d35400", "2c3e50"]
    for r in range(3):
        for k in range(10):
            c = cols[(k + r) % 8]
            box(f"bk{r}{k}", (0.25, 0.12, 0.3 + 0.06 * (k % 3)), (ox + 5.0, oy + 1.65 + k * 0.16, oz + 0.3 + r * 0.5 + 0.15), mat("book" + c, srgb(c), 0.7))
    box("door", (1.0, 0.08, 2.1), (ox + 4.2, oy - 4.92, oz + 1.05), mat("door", srgb("9c6b3f"), 0.6))
    box("door_win", (0.35, 0.09, 0.6), (ox + 4.2, oy - 4.92, oz + 1.5), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    box("door_knob", (0.07, 0.12, 0.07), (ox + 3.85, oy - 4.86, oz + 1.0), mat("set_c9a24a", srgb("c9a24a"), 0.3))
    box("trash", (0.35, 0.35, 0.5), (ox + 4.9, oy - 4.4, oz + 0.25), mat("trash", srgb("4a5560"), 0.5), None, 0.02, 2)
    for i, (x, y, c) in enumerate([(-2.1, -2.2, "e74c3c"), (-0.4, 1.0, "2c3e50"), (1.3, -2.2, "27ae60"), (3.0, -0.6, "8e44ad"), (-0.4, -0.6, "f39c12")]):
        backpack(f"bp{i}", (ox + x, oy + y - 0.15, oz), c, yaw=20 * i)
    fl = mat("flag_r", srgb("b22234"), 0.8); fw = mat("flag_w", srgb("ffffff"), 0.8); fb = mat("flag_b", srgb("3c3b6e"), 0.8)
    for k in range(7):
        box(f"flag_s{k}", (0.9, 0.02, 0.07), (ox + 2.2, oy + 3.86, oz + 3.3 - k * 0.07), fl if k % 2 == 0 else fw)
    box("flag_c", (0.38, 0.025, 0.28), (ox + 1.94, oy + 3.85, oz + 3.2), fb)

def caf_props(o):
    ox, oy, oz = o
    tex_quad("menu", 1.4, 1.04, "menu.png", (ox, oy + 3.88, oz + 2.5), (R(90), 0, 0))
    for i, (x, y) in enumerate([(-2, -1.5), (2, -1.5), (-2, 1.8), (2, 1.8)]):
        light_panel(f"clp{i}", (ox + x, oy + y, oz + 4.12))
    window_frames(oy, oz, (-1.5, 1.5), ox - 5.38, w=2.0)
    box("vending", (0.9, 0.8, 2.0), (ox + 4.9, oy + 2.6, oz + 1.0), mat("vend", srgb("c0392b"), 0.4), None, 0.03, 2)
    tex_quad("vend_sign", 0.7, 0.35, "vend.png", (ox + 4.44, oy + 2.6, oz + 1.75), (R(90), 0, R(-90)))
    box("vend_glass", (0.02, 0.6, 0.9), (ox + 4.45, oy + 2.6, oz + 1.1), mat("vglass", (0.7, 0.85, 1.0), 0.1, emit=0.6))
    for i, y in enumerate((-1.2, 0.5, 1.4)):
        box(f"otray{i}", (0.42, 0.32, 0.03), (ox + 1.6 + (0.25 if i % 2 else -0.25), oy + y, oz + 0.81), mat("caf_e07a3a", srgb("e07a3a"), 0.5))
    box("ctrash", (0.45, 0.45, 0.8), (ox + 4.8, oy - 3.5, oz + 0.4), mat("trash", srgb("4a5560"), 0.5), None, 0.02, 2)
    box("ctrash2", (0.45, 0.45, 0.8), (ox + 4.2, oy - 3.5, oz + 0.4), mat("recycle", srgb("2e86de"), 0.5), None, 0.02, 2)

def studio_props(o):
    ox, oy, oz = o
    M = mat("ph_metal", srgb("333333"), 0.4)
    for i, x in enumerate((-1.8, 1.8)):
        box(f"sb_stand{i}", (0.04, 0.04, 1.8), (ox + x, oy - 0.6, oz + 0.9), M)
        sb = box(f"softbox{i}", (0.6, 0.15, 0.6), (ox + x, oy - 0.6, oz + 1.9), mat("softbox", (1, 1, 1), 0.3, emit=2.0), None, 0.02, 2)
        sb.rotation_euler = (0, 0, R(-30 if x < 0 else 30))
    tex_quad("ph_banner", 1.6, 0.4, "poster_kind.png", (ox - 3.0, oy + 2.88, oz + 2.2), (R(90), 0, 0))
    for i in range(3):
        box(f"bench_ph{i}", (1.2, 0.35, 0.45), (ox - 3.2, oy - 1.5 + i * 0.9, oz + 0.225), mat("caf_4a90c2", srgb("4a90c2"), 0.6))


# ---------------------------------------------------------------- HB02 props
def phone(name, parent, loc=(0, -0.02, -0.33), screen=None):
    b = box(name, (0.09, 0.012, 0.17), loc, mat("phone_body", srgb("1b1b1d"), 0.3), parent, 0.01, 2)
    s = box(name + "_scr", (0.08, 0.004, 0.155), (loc[0], loc[1] - 0.008, loc[2]), mat("phone_scr", (0.55, 0.75, 1.0), 0.2, emit=1.2), parent)
    return b

def ruler(name, parent):
    return box(name, (0.04, 0.008, 0.45), (0, -0.04, -0.45), mat("ruler", srgb("f2c94c"), 0.5), parent)

def hanger(name, parent):
    W = mat("wire", srgb("b8bcc2"), 0.25)
    e = box(name + "_hook", (0.012, 0.012, 0.10), (0, -0.04, -0.36), W, parent)
    a = box(name + "_a", (0.30, 0.012, 0.012), (0, -0.04, -0.62), W, parent)
    l = box(name + "_l", (0.012, 0.012, 0.20), (-0.075, -0.04, -0.52), W, parent); l.rotation_euler = (0, R(-37), 0)
    r = box(name + "_r", (0.012, 0.012, 0.20), (0.075, -0.04, -0.52), W, parent); r.rotation_euler = (0, R(37), 0)
    return e

def plunger(name, parent):
    st = box(name + "_stick", (0.035, 0.035, 0.6), (0, -0.04, -0.55), mat("plunger_wood", srgb("b07a4a"), 0.6), parent)
    bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.09, depth=0.09, location=(0, 0, 0))
    c = bpy.context.active_object; c.name = name + "_cup"; c.data.materials.append(mat("plunger_red", srgb("c0392b"), 0.4))
    c.parent = parent; c.location = (0, -0.04, -0.88)
    return st

def chips_bag(name, loc, rot=(0, 0, 0), parent=None):
    b = box(name, (0.18, 0.06, 0.24), loc, mat("chips_side", srgb("e63c28"), 0.5), parent, 0.02, 2); b.rotation_euler = rot
    f = tex_quad(name + "_front", 0.17, 0.22, "chips.png", (0, -0.031, 0), (R(90), 0, 0)); f.parent = b
    return b

def vending_detail(o):
    """Glass front with snack rows + one chips bag stuck at the edge (the plot)."""
    ox, oy, oz = o; x = ox + 4.44
    cols = ["e63c28", "f1c40f", "27ae60", "2980b9", "8e44ad"]
    for r in range(4):
        box(f"vrow{r}", (0.02, 0.62, 0.015), (x + 0.03, oy + 2.6, oz + 0.75 + r * 0.22), mat("vrow", srgb("9aa0a6"), 0.3))
        for k in range(4):
            if r == 2 and k == 1: continue
            box(f"vsnack{r}{k}", (0.05, 0.11, 0.15), (x + 0.07, oy + 2.37 + k * 0.155, oz + 0.84 + r * 0.22),
                mat("snack" + cols[(r + k) % 5], srgb(cols[(r + k) % 5]), 0.5))
    stuck = chips_bag("stuck_chips", (x + 0.05, oy + 2.52, oz + 1.31), (R(25), 0, R(90)))
    box("vslot", (0.03, 0.18, 0.04), (x - 0.01, oy + 2.95, oz + 1.25), mat("set_222222", srgb("222222")))
    box("vtray", (0.03, 0.5, 0.18), (x - 0.01, oy + 2.6, oz + 0.35), mat("set_222222", srgb("222222")))
    return stuck

def detention_sign(o):
    ox, oy, oz = o
    return tex_quad("detention_sign", 2.4, 0.8, "detention.png", (ox - 0.5, oy + 3.795, oz + 1.95), (R(90), 0, 0))
