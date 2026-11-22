"""Detail pass for the new sets (user 18/11: sets too empty) + realism pass (grain, fill light)."""
import bpy, random
from hb_lib import box, mat, srgb, R, empty
from hb_props import tex_quad

def bus_details(o, seats):
    ox, oy, oz = o
    cols = ["e74c3c", "2c3e50", "27ae60", "8e44ad", "f39c12", "2980b9", "16a085", "c0392b"]
    rnd = random.Random(4)
    for i, (r, s) in enumerate([(0, -1), (2, -1), (3, -1), (5, 1), (6, -1), (6, 1), (7, 1), (8, -1)]):
        x, y = seats[(r, s, "aisle")]
        if rnd.random() < 0.5: box(f"bus_bag{i}", (0.3, 0.18, 0.38), (x + s * 0.05, y - 0.05, oz + 0.68), mat("bp_" + cols[i], srgb(cols[i]), 0.8), None, 0.05, 2)
        else: box(f"bus_bag{i}", (0.32, 0.2, 0.36), (ox + s * 0.18, y + 0.15, oz + 0.18), mat("bp_" + cols[i], srgb(cols[i]), 0.8), None, 0.05, 2)
    tex_quad("bus_noeat", 0.6, 0.3, "bus_noeat.png", (ox + 0.6, oy + 6.4, oz + 1.95), (R(90), 0, R(180)))
    tex_quad("bus_exit", 0.6, 0.3, "bus_exit.png", (ox, oy - 5.43, oz + 1.95), (R(90), 0, 0))
    tex_quad("bus_rules", 0.4, 0.4, "bus_rules.png", (ox + 1.15, oy + 5.2, oz + 1.6), (R(90), 0, R(90)))
    box("bus_extinguisher", (0.12, 0.12, 0.35), (ox + 1.05, oy + 6.2, oz + 0.6), mat("ext_red", srgb("c0392b"), 0.3), None, 0.03, 2)
    box("bus_firstaid", (0.3, 0.1, 0.22), (ox - 1.12, oy + 5.0, oz + 1.6), mat("aid", srgb("ffffff"), 0.5))
    box("bus_firstaid_x", (0.12, 0.02, 0.04), (ox - 1.07, oy + 5.0, oz + 1.6), mat("ext_red", srgb("c0392b"), 0.3))
    box("bus_mirror", (0.5, 0.05, 0.16), (ox - 0.3, oy + 6.35, oz + 2.0), mat("mirror", (0.8, 0.85, 0.9), 0.05))
    for s in (-1, 1):
        box(f"bus_ceilrail{s}", (0.04, 11.5, 0.04), (ox + s * 0.35, oy + 0.5, oz + 2.02), mat("bus_metal", srgb("9aa0a6"), 0.3))
        for k in range(10):
            box(f"bus_latch{s}{k}", (0.03, 0.14, 0.03), (ox + s * 1.15, oy + 4.2 - k * 0.9, oz + 1.66), mat("bus_metal", srgb("9aa0a6"), 0.3))
    for k in range(3):
        box(f"bus_vent{k}", (0.7, 0.4, 0.03), (ox, oy - 2 + k * 2.5, oz + 2.09), mat("vent", srgb("b9bcc0"), 0.4))
    out = empty("bus_outside", (ox, oy, oz))           # scenery that scrolls past the windows
    for s in (-1, 1):
        for k in range(14):
            yy = -8 + k * 1.6 + rnd.uniform(-0.3, 0.3)
            if k % 3 == 0:
                box(f"bus_house{s}{k}", (0.05, 0.9, 0.45), (s * 1.30, yy, 1.0), mat(f"house{k % 4}", srgb(["e8d5b0", "c9e0f0", "f0c9c9", "d0e8c0"][k % 4]), 0.8, emit=0.6), out)
                box(f"bus_roofh{s}{k}", (0.05, 1.0, 0.12), (s * 1.30, yy, 1.28), mat("roofh", srgb("7a4a3a"), 0.8, emit=0.4), out)
            else:
                box(f"bus_bush{s}{k}", (0.04, 0.7, 0.3), (s * 1.31, yy, 0.98), mat("bus_tree", srgb("6fae5a"), 0.8, emit=0.5), out)
            if k % 4 == 1: box(f"bus_pole{s}{k}", (0.03, 0.05, 0.8), (s * 1.29, yy + 0.4, 1.3), mat("pole", srgb("6b5a4a"), 0.8, emit=0.3), out)
    return out

def scroll_outside(out, n, speed=0.12):
    out.location.y = 0; out.keyframe_insert("location", frame=1)
    out.location.y = -speed * n; out.keyframe_insert("location", frame=max(2, n))

def library_details(o):
    ox, oy, oz = o
    C = lambda h, r=0.85: mat("lib_" + h, srgb(h), r)
    cols = ["c0392b", "2980b9", "27ae60", "f39c12", "8e44ad", "16a085", "d35400"]
    rnd = random.Random(8)
    tex_quad("lib_readposter", 0.6, 0.84, "lib_read.png", (ox - 5.38, oy + 2.6, oz + 2.2), (R(90), 0, R(90)))
    tex_quad("lib_newsign", 0.9, 0.5, "lib_new.png", (ox + 2.6, oy + 3.88, oz + 2.75), (R(90), 0, R(180)))
    tex_quad("lib_banner", 3.0, 0.55, "lib_banner.png", (ox - 1.2, oy + 3.88, oz + 3.55), (R(90), 0, R(180)))
    for i, (x, y) in enumerate(((ox + 3.4, oy - 3.4), (ox - 4.2, oy + 1.6))):
        box(f"lib_cart{i}", (0.9, 0.45, 0.05), (x, y, oz + 0.75), C("8f979e", 0.4)); box(f"lib_cartb{i}", (0.9, 0.45, 0.05), (x, y, oz + 0.3), C("8f979e", 0.4))
        for k in range(10): box(f"lib_cartbk{i}{k}", (0.06, 0.3, 0.26), (x - 0.4 + k * 0.085, y, oz + 0.91), C(cols[k % 7], 0.7))
    box("lib_rug", (2.6, 1.8, 0.012), (ox + 3.6, oy + 2.4, oz + 0.006), C("d35454", 0.95))
    for i, (x, y, c) in enumerate(((ox + 3.0, oy + 2.2, "f1c40f"), (ox + 4.2, oy + 2.6, "1abc9c"))):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.42, location=(x, y, oz + 0.25))
        b = bpy.context.active_object; b.scale = (1, 1, 0.6); b.name = f"lib_beanbag{i}"; b.data.materials.append(C(c, 0.9))
    for i, (x, y) in enumerate(((ox - 5.0, oy - 4.4), (ox + 5.0, oy + 3.4), (ox + 0.2, oy + 3.4))):
        box(f"lib_pot{i}", (0.35, 0.35, 0.4), (x, y, oz + 0.2), C("b5651d", 0.7), None, 0.03, 2)
        for k in range(5):
            l = box(f"lib_leaf{i}{k}", (0.1, 0.3, 0.5), (x + rnd.uniform(-0.1, 0.1), y + rnd.uniform(-0.1, 0.1), oz + 0.65), C("3f9b4f", 0.8))
            l.rotation_euler = (R(rnd.uniform(-25, 25)), R(rnd.uniform(-25, 25)), R(k * 72))
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.25, depth=0.05, location=(ox + 4.2, oy + 3.87, oz + 3.1), rotation=(R(90), 0, 0))
    ck = bpy.context.active_object; ck.name = "lib_clock"; ck.data.materials.append(C("ffffff", 0.4))
    box("lib_clockh", (0.03, 0.02, 0.15), (ox + 4.2, oy + 3.83, oz + 3.15), C("222222"))
    box("lib_display", (1.2, 0.6, 0.8), (ox + 0.6, oy + 2.6, oz + 0.4), C("6e4a2e", 0.7), None, 0.02, 2)
    for k in range(6):
        b = box(f"lib_dbook{k}", (0.18, 0.04, 0.26), (ox + 0.15 + k * 0.18, oy + 2.55, oz + 0.93), C(cols[k % 7], 0.7)); b.rotation_euler = (R(-12), 0, 0)
    box("lib_rack", (0.9, 0.3, 1.1), (ox - 5.25, oy - 1.0, oz + 0.55), C("8a5a33", 0.7))
    for k in range(4): box(f"lib_mag{k}", (0.03, 0.2, 0.28), (ox - 5.08, oy - 1.3 + k * 0.2, oz + 0.9), C(cols[(k + 2) % 7], 0.6))
    box("lib_printer", (0.5, 0.4, 0.3), (ox + 4.8, oy + 1.6, oz + 0.9), C("e6e6e6", 0.4), None, 0.02, 2)
    box("lib_printer_base", (0.7, 0.6, 0.75), (ox + 4.8, oy + 1.6, oz + 0.375), C("d9d4c8", 0.5))

def realism_pass(sc, prefixes=("set_", "lib_", "bus_", "caf_", "bp_", "desk_", "chair", "shelf"), grain=False):
    # grain bump OFF by default: the user saw it as image noise (19/11). Only the soft fill light stays.
    for m in (bpy.data.materials if grain else []):
        if not m.name.startswith(prefixes) or not m.use_nodes: continue
        nt = m.node_tree; b = nt.nodes.get("Principled BSDF")
        if b is None or any(n.type == "BUMP" for n in nt.nodes): continue
        nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 60.0
        bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.12; bp.inputs["Distance"].default_value = 0.01
        nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    for nm, loc, en in (("fill_bus", (90, 1.0, 1.9), 120), ("fill_lib", (120, -1.0, 3.6), 900)):
        L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = 3.0; L.color = (1.0, 0.97, 0.92)
        o = bpy.data.objects.new(nm, L); sc.collection.objects.link(o); o.location = loc
