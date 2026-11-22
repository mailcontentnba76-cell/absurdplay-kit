"""hb_lib — blocky low-poly school characters, sets and pose/animation helpers for Blender 5.x (run inside Blender).
Characters are FK hierarchies of empties (joint pivots) with box meshes; faces are flat black decals (dot eyes,
bar brows, box mouth) animated by keyframes. All poses are keyed in absolute frames (30 fps)."""
import bpy, math, os
from mathutils import Vector

R = math.radians
_MATS = {}

def mat(name, rgb, rough=0.85, img=None, emit=0.0):
    key = (name, img)
    if key in _MATS: return _MATS[key]
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1); b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*rgb, 1); b.inputs["Emission Strength"].default_value = emit
    if img:
        t = nt.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(img); t.extension = "CLIP"
        mix = nt.nodes.new("ShaderNodeMixRGB"); mix.blend_type = "MIX"
        mix.inputs[1].default_value = (*rgb, 1)
        nt.links.new(t.outputs["Alpha"], mix.inputs[0]); nt.links.new(t.outputs["Color"], mix.inputs[2])
        nt.links.new(mix.outputs[0], b.inputs["Base Color"])
    _MATS[key] = m; return m

def srgb(h):  # hex -> linear rgb
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def box(name, size, loc=(0, 0, 0), m=None, parent=None, bevel=0.0, segs=1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = name
    o.scale = size; bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bv = o.modifiers.new("bev", "BEVEL"); bv.width = bevel; bv.segments = segs
    if m: o.data.materials.append(m)
    if parent: o.parent = parent
    o.location = loc
    return o

def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(o)
    o.empty_display_size = 0.05
    if parent: o.parent = parent
    o.location = loc; o.rotation_mode = "XYZ"
    return o

def plane_img(name, w, h, img, loc, parent, rot=(R(90), 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object; o.name = name; o.scale = (w, h, 1); bpy.ops.object.transform_apply(scale=True)
    m = bpy.data.materials.new(name + "_m"); m.use_nodes = True; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    t = nt.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(img); t.extension = "CLIP"
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"])
    b.inputs["Roughness"].default_value = 0.9
    try: m.surface_render_method = "DITHERED"
    except Exception: pass
    o.data.materials.append(m); o.parent = parent; o.location = loc; o.rotation_euler = rot
    return o

# ---------------------------------------------------------------- character
class Char:
    """FK rig. Front faces -Y. Joints: root, hips, chest, head, sh_L/R, el_L/R, hip_L/R, kn_L/R."""
    def __init__(self, name, skin, shirt, pants, shoes, hair, hair_style="messy", print_img=None, build=1.0,
                 sleeves=None, headband=None, wraps=None, long_sleeves=False, glasses=False, mustache=None,
                 tie=None, scrunchie=None, beanie=None, mood="neutral", jacket=None, chain=None, female=False):
        self.name = name; s = build; self.j = {}; self._beanie = beanie or "2b2b30"; self.mood = mood
        mk = lambda n, c, r=0.85: mat(f"{name}_{n}", srgb(c), r)
        SK, SH, PA, SO, HA = mk("skin", skin), mk("shirt", shirt), mk("pants", pants), mk("shoes", shoes, 0.6), mk("hair", hair)
        SL = mk("sleeve", sleeves) if sleeves else SH
        BLK = mat("decal_black", (0.005, 0.005, 0.005), 0.4)
        root = self.j["root"] = empty(f"{name}_root")
        hips = self.j["hips"] = empty(f"{name}_hips", (0, 0, 0.92 * s), root)
        box(f"{name}_pelvis", (0.44 * s, 0.26, 0.18), (0, 0, -0.02), PA, hips)
        chest = self.j["chest"] = empty(f"{name}_chest", (0, 0, 0.06), hips)
        box(f"{name}_torso", (0.46 * s, 0.27, 0.56), (0, 0, 0.28), SH, chest, 0.02)
        if print_img:
            plane_img(f"{name}_print", 0.34 * s, 0.34, print_img, (0, -0.137, 0.30), chest)
        if jacket:   # open varsity jacket: two front panels + collar rib (sleeves via `sleeves=`)
            J = mat(f"{name}_jacket", srgb(jacket), 0.7); RB = mat(f"{name}_rib", srgb("f4f4f4"), 0.8)
            for sx in (-1, 1):
                box(f"{name}_jpanel{sx}", (0.13 * s, 0.02, 0.56), (sx * 0.17 * s, -0.142, 0.28), J, chest, 0.005, 1)
                box(f"{name}_jside{sx}", (0.02, 0.27, 0.56), (sx * 0.235 * s, 0, 0.28), J, chest)
            box(f"{name}_jback", (0.47 * s, 0.02, 0.56), (0, 0.142, 0.28), J, chest)
            box(f"{name}_jcollar", (0.46 * s, 0.29, 0.05), (0, 0, 0.555), RB, chest, 0.01, 2)
            box(f"{name}_jhem", (0.47 * s, 0.29, 0.05), (0, 0, 0.025), RB, chest)
        if chain:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.075, minor_radius=0.008, location=(0, 0, 0))
            c_ = bpy.context.active_object; c_.name = f"{name}_chain"; c_.data.materials.append(mat("gold", srgb(chain), 0.25))
            c_.parent = chest; c_.location = (0, -0.11, 0.50); c_.rotation_euler = (R(70), 0, 0); c_.scale = (1.3, 1, 1)
        if tie:
            box(f"{name}_tie", (0.08, 0.02, 0.36), (0, -0.142, 0.34), mat(f"{name}_tie", srgb(tie), 0.6), chest)
            box(f"{name}_collar", (0.24, 0.03, 0.06), (0, -0.14, 0.54), mat(f"{name}_coll", srgb("ffffff"), 0.7), chest)
        head = self.j["head"] = empty(f"{name}_head", (0, 0, 0.60), chest)
        box(f"{name}_neck", (0.14, 0.14, 0.08), (0, 0, 0.02), SK, head)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.245, location=(0, 0, 0))   # round low-poly skull (user: rounder heads)
        _sk = bpy.context.active_object; _sk.name = f"{name}_skull"; _sk.scale = (0.98, 0.94, 0.98); bpy.ops.object.transform_apply(scale=True)
        _sk.data.materials.append(SK); _sk.parent = head; _sk.location = (0, 0, 0.27)
        # hair
        def _cap(nm, r, loc, sc, m):   # rounded hair cap (sphere) so the silhouette stays round
            bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=r, location=(0, 0, 0))
            o = bpy.context.active_object; o.name = nm; o.scale = sc; bpy.ops.object.transform_apply(scale=True)
            o.data.materials.append(m); o.parent = head; o.location = loc; return o
        if hair_style == "messy":
            _cap(f"{name}_hairtop", 0.262, (0, 0.05, 0.42), (1.0, 1.0, 0.75), HA)
            box(f"{name}_fringe", (0.30, 0.09, 0.08), (-0.04, -0.19, 0.44), HA, head, 0.035, 3)
            for i, x in enumerate((-0.13, 0.0, 0.12)):
                t_ = box(f"{name}_spike{i}", (0.12, 0.12, 0.09), (x, -0.02 + 0.04 * i, 0.57), HA, head, 0.035, 3); t_.rotation_euler = (R(10), R(15 * (i - 1)), 0)
        elif hair_style == "buzz":
            _cap(f"{name}_hairtop", 0.252, (0, 0.05, 0.39), (1.0, 1.0, 0.78), HA)
        elif hair_style == "waves":    # short glossy waves (Marcus): soft sheen, no floating rings
            _cap(f"{name}_hairtop", 0.254, (0, 0.05, 0.40), (1.0, 1.0, 0.74), mat(f"{name}_hairgloss", srgb(hair), 0.45))
        elif hair_style == "ponytail":  # high ponytail (girls)
            _cap(f"{name}_hairtop", 0.262, (0, 0.05, 0.41), (1.0, 1.0, 0.78), HA)
            box(f"{name}_tail", (0.12, 0.12, 0.38), (0, 0.24, 0.42), HA, head, 0.05, 3).rotation_euler = (R(-25), 0, 0)
            if scrunchie: box(f"{name}_scr", (0.14, 0.14, 0.05), (0, 0.2, 0.58), mat(f"{name}_scr", srgb(scrunchie), 0.6), head, 0.04, 3)
            for sx in (-1, 1):   # face-framing locks so girls read as girls from the front
                box(f"{name}_lock{sx}", (0.05, 0.08, 0.28), (sx * 0.225, 0.01, 0.30), HA, head, 0.02, 3)   # slimmer, set back: never hides the face
        elif hair_style == "beanie":   # slouchy knit beanie (Jaylen)
            box(f"{name}_hairsides", (0.48, 0.30, 0.14), (0, 0.08, 0.34), HA, head, 0.07, 4)
            BE = mat(f"{name}_beanie", srgb(self.__dict__.get("_beanie", "2b2b30")), 0.95)
            _cap(f"{name}_beanie", 0.27, (0, 0.05, 0.51), (1.0, 1.0, 0.7), BE)
            box(f"{name}_beanie_cuff", (0.50, 0.47, 0.07), (0, 0.04, 0.47), BE, head, 0.03, 4)
            box(f"{name}_beanie_slouch", (0.36, 0.28, 0.12), (0, 0.10, 0.63), BE, head, 0.06, 4)
        elif hair_style == "sidepart":   # neat side part (Elijah, TT001): smooth glossy cap + swept fringe + part line
            _cap(f"{name}_hairtop", 0.258, (0, 0.04, 0.41), (1.0, 1.0, 0.76), mat(f"{name}_hairgloss", srgb(hair), 0.5))
            sw_ = box(f"{name}_swoop", (0.30, 0.12, 0.09), (0.05, -0.17, 0.50), HA, head, 0.04, 3); sw_.rotation_euler = (R(-15), 0, R(-8))
            box(f"{name}_part", (0.014, 0.30, 0.012), (-0.08, -0.01, 0.603), mk("partline", skin), head)
        elif hair_style == "bald":
            box(f"{name}_fringeback", (0.47, 0.20, 0.12), (0, 0.14, 0.30), HA, head, 0.05, 3)   # side/back ring only
        elif hair_style == "bun":   # curly high bun (Kayla)
            box(f"{name}_hairtop", (0.50, 0.48, 0.24), (0, 0.01, 0.49), HA, head, 0.11, 4)
            box(f"{name}_hairback", (0.50, 0.20, 0.34), (0, 0.15, 0.35), HA, head, 0.09, 3)
            for i, (x, z) in enumerate(((-0.24, 0.36), (0.24, 0.36))):
                box(f"{name}_puff{i}", (0.10, 0.30, 0.20), (x, 0.03, z), HA, head, 0.05, 3)
            box(f"{name}_bun", (0.26, 0.26, 0.22), (0, 0.05, 0.70), HA, head, 0.11, 4)
            if scrunchie:
                box(f"{name}_scrunchie", (0.20, 0.20, 0.06), (0, 0.05, 0.60), mat(f"{name}_scr", srgb(scrunchie), 0.6), head, 0.05, 3)
        if headband:
            box(f"{name}_band", (0.485, 0.465, 0.06), (0, 0, 0.42), mk("band", headband, 0.7), head, 0.07, 4)
        # face decals (front = -Y, skull front at y=-0.20)
        fy = -0.223
        RX, RY, RZ = 0.245 * 0.98, 0.245 * 0.94, 0.245 * 0.98   # decals sit ON the ellipsoid skull
        fyat = lambda x, z: -(RY * math.sqrt(max(1 - (x / RX) ** 2 - ((z - 0.27) / RZ) ** 2, 0.05)) + 0.004)
        self.eyes = []
        for k, x in (("L", -0.085), ("R", 0.085)):
            bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.034, depth=0.01, location=(0, 0, 0), rotation=(R(90), 0, 0))
            e = bpy.context.active_object; e.name = f"{name}_eye{k}"; bpy.ops.object.transform_apply(rotation=True)
            e.data.materials.append(BLK); e.parent = head; e.location = (x, fyat(x, 0.29), 0.29); self.eyes.append(e)
        self.brows = []
        for k, x in (("L", -0.09), ("R", 0.09)):
            p = empty(f"{name}_browpiv{k}", (x, fyat(x, 0.375), 0.375), head); box(f"{name}_brow{k}", (0.09, 0.01, 0.028), (0, 0, 0), BLK, p)
            self.brows.append(p)
        if female:   # lashes + small earrings
            for k, x in (("L", -0.085), ("R", 0.085)):
                l_ = box(f"{name}_lash{k}", (0.07, 0.008, 0.012), (x + (0.012 if x > 0 else -0.012), fyat(x, 0.325) - 0.002, 0.325), BLK, head); l_.rotation_euler = (0, R(-12 if x > 0 else 12), 0)
                box(f"{name}_ear{k}", (0.025, 0.025, 0.04), (x * 2.75, 0.0, 0.17), mat("gold", srgb("d4a017"), 0.25), head)
        if glasses:
            G = mat("glasses", srgb("1a1a1a"), 0.3)
            for k, x in (("L", -0.085), ("R", 0.085)):
                for nm, sz, off in (("t", (0.12, 0.012, 0.014), (0, 0, 0.05)), ("b", (0.12, 0.012, 0.014), (0, 0, -0.05)),
                                    ("l", (0.014, 0.012, 0.1), (-0.055, 0, 0)), ("r", (0.014, 0.012, 0.1), (0.055, 0, 0))):
                    box(f"{name}_gl{k}{nm}", sz, (x + off[0], fy - 0.012, 0.29 + off[2]), G, head)
            box(f"{name}_glbridge", (0.06, 0.012, 0.012), (0, fy - 0.012, 0.31), G, head)
        if mustache:
            box(f"{name}_mustache", (0.16, 0.02, 0.045), (0, fyat(0, 0.215) - 0.004, 0.215), mat(f"{name}_must", srgb(mustache), 0.8), head, 0.015, 2)
        self.mouth = empty(f"{name}_mouthpiv", (0, fyat(0, 0.165), 0.165), head)
        box(f"{name}_mouth", (0.09, 0.01, 0.018), (0, 0, 0), BLK, self.mouth)
        # arms
        for side, sx in (("L", -1), ("R", 1)):
            sh = self.j[f"sh_{side}"] = empty(f"{name}_sh{side}", (sx * (0.23 * s + 0.07), 0, 0.50), chest)
            box(f"{name}_uarm{side}", (0.13, 0.14, 0.30), (0, 0, -0.13), SL, sh, 0.01)
            el = self.j[f"el_{side}"] = empty(f"{name}_el{side}", (0, 0, -0.28), sh)
            box(f"{name}_farm{side}", (0.13 if long_sleeves else 0.12, 0.14 if long_sleeves else 0.13, 0.26), (0, 0, -0.12), SL if long_sleeves else SK, el)
            hand = box(f"{name}_hand{side}", (0.13, 0.13, 0.12), (0, 0, -0.30), mk("wrap", wraps) if wraps else SK, el, 0.02)
            self.j[f"hand_{side}"] = hand
        # legs
        for side, sx in (("L", -1), ("R", 1)):
            hp = self.j[f"hip_{side}"] = empty(f"{name}_hip{side}", (sx * 0.11 * s, 0, -0.06), hips)
            box(f"{name}_thigh{side}", (0.18, 0.19, 0.42), (0, 0, -0.20), PA, hp)
            kn = self.j[f"kn_{side}"] = empty(f"{name}_kn{side}", (0, 0, -0.42), hp)
            box(f"{name}_shin{side}", (0.17, 0.18, 0.36), (0, 0, -0.18), PA, kn)
            box(f"{name}_shoe{side}", (0.19, 0.30, 0.11), (0, -0.05, -0.39), SO, kn, 0.02)
        self.expr(mood, 1)

    # ---- keyframing helpers
    def rot(self, joint, f, x=0, y=0, z=0):
        o = self.j[joint]; o.rotation_euler = (R(x), R(y), R(z)); o.keyframe_insert("rotation_euler", frame=f)
    def loc(self, f, x, y, z=0, joint="root"):
        o = self.j[joint]; o.location = (x, y, z); o.keyframe_insert("location", frame=f)
    def face(self, f, yaw):
        o = self.j["root"]; o.rotation_euler = (0, 0, R(yaw)); o.keyframe_insert("rotation_euler", frame=f)
    def pose(self, f, **joints):
        for k, v in joints.items(): self.rot(k, f, *v)

    def expr(self, name, f):
        """neutral, annoyed, angry, shock, yell, smug, deadpan, focused, happy"""
        E = {  # brow (dz, inner tilt deg), eye scale z, mouth (w, h, dz)
            "neutral": (0.0, 0, 1.0, (1.0, 1.0)), "deadpan": (-0.01, 0, 0.8, (1.1, 1.0)),
            "annoyed": (-0.02, 18, 0.85, (0.9, 1.0)), "angry": (-0.03, 28, 0.9, (1.1, 1.4)),
            "shock": (0.05, -12, 1.4, (0.8, 4.5)), "yell": (0.03, 20, 1.1, (1.4, 5.0)),
            "smug": (0.01, -8, 0.75, (1.2, 1.0)), "focused": (-0.03, 22, 0.8, (0.7, 1.0)),
            "happy": (0.03, -10, 0.6, (1.3, 2.0)),
            "sad": (0.02, -22, 0.85, (0.8, 1.0)), "chill": (0.0, -4, 0.7, (1.2, 1.3)),
            "squint": (-0.005, -4, 0.3, (1.25, 1.2)),   # TT001 Elijah: half-closed "aura" eyes (he can't see)
        }[name]
        dz, tilt, ez, (mw, mh) = E
        for k, (b, sx) in enumerate(zip(self.brows, (-1, 1))):
            b.location.z = 0.375 + dz; b.rotation_euler = (0, R(sx * tilt), 0)
            b.keyframe_insert("location", frame=f); b.keyframe_insert("rotation_euler", frame=f)
        for e in self.eyes:
            e.scale = (1, 1, ez); e.keyframe_insert("scale", frame=f)
        self.mouth.scale = (mw, 1, mh); self.mouth.keyframe_insert("scale", frame=f)

    # ---- canned motions (absolute frames)
    def stand(self, f):
        self.pose(f, hips=(0, 0, 0), chest=(0, 0, 0), head=(0, 0, 0), sh_L=(0, 4, 0), sh_R=(0, -4, 0), el_L=(-8, 0, 0), el_R=(-8, 0, 0),
                  hip_L=(0, 0, 0), hip_R=(0, 0, 0), kn_L=(0, 0, 0), kn_R=(0, 0, 0))
    def sit(self, f, arms_on_desk=True):
        a = (-55, 0, 0) if arms_on_desk else (-20, 0, 0)
        self.pose(f, hips=(0, 0, 0), chest=(4, 0, 0), sh_L=a, sh_R=a, el_L=(-55, 0, 0) if arms_on_desk else (-30, 0, 0),
                  el_R=(-55, 0, 0) if arms_on_desk else (-30, 0, 0), hip_L=(-90, 0, 0), hip_R=(-90, 0, 0), kn_L=(90, 0, 0), kn_R=(90, 0, 0))
    def guard(self, f):
        self.pose(f, chest=(6, 0, 0), sh_L=(-60, 0, 20), sh_R=(-60, 0, -20), el_L=(-110, 0, 0), el_R=(-110, 0, 0),
                  hip_L=(-12, 0, 0), hip_R=(8, 0, 0), kn_L=(18, 0, 0), kn_R=(10, 0, 0))
    def punch(self, f, side="R", hook=False, dur=6):
        """jab/hook from guard: extend one arm at f+dur/2, back to guard at f+dur."""
        o, sx = (side, 1 if side == "R" else -1)
        self.guard(f)
        m = f + dur // 2
        if hook:
            self.rot(f"sh_{o}", m, -85, 0, -sx * 60); self.rot(f"el_{o}", m, -80, 0, 0); self.rot("chest", m, 6, 0, sx * 28)
        else:
            self.rot(f"sh_{o}", m, -92, 0, -sx * 6); self.rot(f"el_{o}", m, -5, 0, 0); self.rot("chest", m, 8, 0, sx * 18)
        self.guard(f + dur)
    def combo(self, f0, f1, seed=0, hooks=True):
        f, k = f0, seed
        while f + 6 <= f1:
            self.punch(f, "R" if k % 2 == 0 else "L", hook=hooks and k % 3 == 2, dur=6 if k % 3 != 2 else 8)
            # bounce
            self.loc(f, *self._base[:2], self._base[2] + 0.0); self.loc(f + 3, *self._base[:2], self._base[2] + 0.025)
            f += 6 if k % 3 != 2 else 8; k += 1
        self.guard(f1)
    def place(self, f, x, y, z=0, yaw=0):
        self._base = (x, y, z); self.loc(f, x, y, z); self.face(f, yaw)
    def walk(self, f0, f1, p0, p1, yaw=None, step=8):
        # facing ALWAYS follows the direction of travel (user 19/11: characters walked backwards).
        # facing vector for a yaw is (sin yaw, -cos yaw)  ->  yaw = atan2(dx, -dy)
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        if abs(dx) + abs(dy) > 1e-4: yaw = math.degrees(math.atan2(dx, -dy))
        self.place(f0, *p0, yaw=yaw); self.place(f1, *p1, yaw=yaw)
        f, k = f0, 0
        while f <= f1:
            a = 25 if k % 2 == 0 else -25
            self.pose(f, hip_L=(a, 0, 0), hip_R=(-a, 0, 0), kn_L=(10 if a < 0 else 0, 0, 0), kn_R=(10 if a > 0 else 0, 0, 0),
                      sh_L=(-a * 0.8, 4, 0), sh_R=(a * 0.8, -4, 0), el_L=(-15, 0, 0), el_R=(-15, 0, 0))
            f += step; k += 1
    def blink(self, f):
        for e in self.eyes:
            z = e.scale.z
            e.scale = (1, 1, z); e.keyframe_insert("scale", frame=f)
            e.scale = (1, 1, 0.12); e.keyframe_insert("scale", frame=f + 2)
            e.scale = (1, 1, z); e.keyframe_insert("scale", frame=f + 5)

# ---------------------------------------------------------------- sets
def classroom(origin=(0, 0, 0)):
    ox, oy, oz = origin
    C = lambda h, r=0.9: mat("set_" + h, srgb(h), r)
    box("floor", (14, 14, 0.1), (ox, oy, oz - 0.05), C("b07a4f", 0.7))
    box("wall_back", (14, 0.2, 4.2), (ox, oy + 4.0, oz + 2.1), C("efe3cc"))
    box("wall_left", (0.2, 14, 4.2), (ox - 5.5, oy, oz + 2.1), C("efe3cc"))
    box("wall_right", (0.2, 14, 4.2), (ox + 5.5, oy, oz + 2.1), C("e9dcc2"))
    box("wall_front", (14, 0.2, 4.2), (ox, oy - 5.0, oz + 2.1), C("efe3cc"))
    box("ceiling", (14, 14, 0.1), (ox, oy, oz + 4.2), C("f4efe6"))
    box("baseboard", (14, 0.05, 0.15), (ox, oy + 3.88, oz + 0.07), C("6b4a2f"))
    # chalkboard + bulletin board + clock
    box("chalkframe", (3.4, 0.08, 1.5), (ox - 0.5, oy + 3.88, oz + 1.8), C("8a5a33"))
    box("chalkboard", (3.2, 0.06, 1.3), (ox - 0.5, oy + 3.84, oz + 1.8), C("2f4a3a", 0.95))
    box("bulletin", (2.0, 0.06, 1.2), (ox + 3.2, oy + 3.86, oz + 1.9), C("b98552", 0.95))
    for i, (dx, dz, col) in enumerate([(-0.6, 0.25, "ffffff"), (-0.1, 0.3, "f2c0c8"), (0.5, 0.2, "bfe0c8"), (-0.4, -0.25, "ffe9a8"), (0.3, -0.3, "ffffff")]):
        box(f"paper{i}", (0.42, 0.02, 0.32), (ox + 3.2 + dx, oy + 3.82, oz + 1.9 + dz), C(col))
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.28, depth=0.05, location=(ox - 3.2, oy + 3.85, oz + 3.1), rotation=(R(90), 0, 0))
    c = bpy.context.active_object; c.data.materials.append(C("ffffff")); c.name = "clock"
    box("clockh", (0.03, 0.02, 0.18), (ox - 3.2, oy + 3.81, oz + 3.16), C("222222"))
    box("clockm", (0.16, 0.02, 0.03), (ox - 3.13, oy + 3.81, oz + 3.1), C("222222"))
    # windows on left wall (light source)
    for i, y in enumerate((-1.5, 1.2)):
        box(f"win{i}", (0.05, 1.6, 1.4), (ox - 5.38, oy + y, oz + 2.0), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    # pencil sharpener on right wall
    box("sharpener", (0.12, 0.16, 0.14), (ox + 5.36, oy + 1.0, oz + 1.25), C("8c8f96", 0.4))
    # desks (rows), facing -Y board? board is +Y so students face +Y
    desks = []
    for r, y in enumerate((-2.2, -0.6, 1.0)):
        for c_, x in enumerate((-2.6, -0.9, 0.8, 2.5)):
            d = desk(f"desk{r}{c_}", (ox + x, oy + y, oz)); desks.append(d)
    return desks

def desk(name, loc):
    x, y, z = loc
    W = mat("desk_top", srgb("d9b07a"), 0.6); M = mat("desk_metal", srgb("5b6470"), 0.4); S = mat("chair", srgb("3d6fb3"), 0.6)
    box(name + "_top", (0.9, 0.6, 0.05), (x, y + 0.35, z + 0.75), W)
    for i, (dx, dy) in enumerate([(-0.4, 0.1), (0.4, 0.1), (-0.4, 0.6), (0.4, 0.6)]):
        box(f"{name}_leg{i}", (0.04, 0.04, 0.75), (x + dx, y + dy, z + 0.375), M)
    box(name + "_seat", (0.48, 0.45, 0.05), (x, y - 0.25, z + 0.46), S)
    box(name + "_back", (0.48, 0.05, 0.42), (x, y - 0.48, z + 0.72), S)
    for i, (dx, dy) in enumerate([(-0.2, -0.05), (0.2, -0.05), (-0.2, -0.45), (0.2, -0.45)]):
        box(f"{name}_cl{i}", (0.03, 0.03, 0.46), (x + dx, y + dy, z + 0.23), M)
    box(name + "_paper", (0.25, 0.32, 0.005), (x - 0.1, y + 0.3, z + 0.78), mat("paper", (0.9, 0.9, 0.88)))
    return dict(seat=(x, y - 0.25, z), top=(x, y + 0.35, z + 0.78))

def cafeteria(origin):
    ox, oy, oz = origin
    C = lambda h, r=0.9: mat("caf_" + h, srgb(h), r)
    box("caf_floor", (14, 14, 0.1), (ox, oy, oz - 0.05), C("cfd6d9", 0.5))
    box("caf_wall_b", (14, 0.2, 4.2), (ox, oy + 4.0, oz + 2.1), C("f7f1e3"))
    box("caf_wall_l", (0.2, 14, 4.2), (ox - 5.5, oy, oz + 2.1), C("f2c94c"))
    box("caf_wall_r", (0.2, 14, 4.2), (ox + 5.5, oy, oz + 2.1), C("f7f1e3"))
    box("caf_wall_f", (14, 0.2, 4.2), (ox, oy - 5.0, oz + 2.1), C("f7f1e3"))
    box("caf_ceil", (14, 14, 0.1), (ox, oy, oz + 4.2), C("ffffff"))
    box("caf_stripe", (14, 0.05, 0.25), (ox, oy + 3.88, oz + 1.2), C("d64545"))
    for i, y in enumerate((-1.5, 1.5)):
        box(f"caf_win{i}", (0.05, 2.0, 1.4), (ox - 5.38, oy + y, oz + 2.1), mat("window", (1.0, 0.95, 0.85), 0.2, emit=2.5))
    T = C("ffffff", 0.4); B = C("4a90c2", 0.6); M = C("8f979e", 0.4)
    for i, x in enumerate((-2.2, 1.6)):
        box(f"caf_table{i}", (1.1, 3.6, 0.06), (ox + x, oy, oz + 0.76), T)
        box(f"caf_tleg{i}", (0.1, 3.0, 0.7), (ox + x, oy, oz + 0.38), M)
        for s in (-1, 1):
            box(f"caf_bench{i}{s}", (0.35, 3.6, 0.06), (ox + x + s * 0.85, oy, oz + 0.46), B)
            box(f"caf_bleg{i}{s}", (0.08, 3.0, 0.43), (ox + x + s * 0.85, oy, oz + 0.22), M)
    # tray + sandwich in front of ME seat (table0, west bench)
    sx, sy = ox - 2.2 - 0.25, oy - 0.3
    box("tray", (0.42, 0.32, 0.03), (sx, sy, oz + 0.81), C("e07a3a", 0.5))
    sandwich((sx, sy, oz + 0.83))
    box("milk", (0.08, 0.08, 0.14), (sx + 0.13, sy + 0.1, oz + 0.89), C("ffffff", 0.5))
    box("apple", (0.09, 0.09, 0.09), (sx - 0.14, sy + 0.09, oz + 0.87), C("d23a2a", 0.4))

def sandwich(loc):
    x, y, z = loc
    box("sw_b1", (0.24, 0.18, 0.035), (x, y, z + 0.02), mat("bread", srgb("e8c27a"), 0.8))
    box("sw_l", (0.26, 0.2, 0.012), (x, y, z + 0.045), mat("lettuce", srgb("6ac24a"), 0.7))
    box("sw_h", (0.23, 0.17, 0.02), (x, y, z + 0.06), mat("ham", srgb("e98a9a"), 0.7))
    box("sw_c", (0.22, 0.2, 0.012), (x, y, z + 0.075), mat("cheese", srgb("f5c518"), 0.6))
    box("sw_b2", (0.24, 0.18, 0.035), (x, y, z + 0.1), mat("bread", srgb("e8c27a"), 0.8))

def photo_studio(origin):
    ox, oy, oz = origin
    box("ph_floor", (10, 10, 0.1), (ox, oy, oz - 0.05), mat("ph_floor", srgb("8a6a4a"), 0.7))
    box("ph_wall", (10, 0.2, 5), (ox, oy + 3.0, oz + 2.5), mat("ph_wall", srgb("dfe6ee")))
    box("ph_backdrop", (3.2, 0.05, 2.6), (ox, oy + 1.4, oz + 1.3), mat("ph_backdrop", srgb("3c6fb0"), 0.95))
    box("ph_backdrop_bar", (3.4, 0.08, 0.08), (ox, oy + 1.4, oz + 2.62), mat("ph_metal", srgb("333333"), 0.4))
    # camera on tripod + photographer handled by caller
    M = mat("ph_metal", srgb("333333"), 0.4)
    cam = empty("ph_cam_root", (ox + 0.3, oy - 2.6, oz))
    for i, a in enumerate((0, 120, 240)):
        l = box(f"ph_tri{i}", (0.03, 0.03, 1.3), (0.18 * math.sin(R(a)), 0.18 * math.cos(R(a)), 0.62), M, cam)
        l.rotation_euler = (R(8) * math.cos(R(a)), -R(8) * math.sin(R(a)), 0)
    box("ph_cambody", (0.26, 0.18, 0.18), (0, 0, 1.36), mat("ph_cam", srgb("1d1d1d"), 0.3), cam)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.07, depth=0.14, location=(0, 0, 0))
    lens = bpy.context.active_object; lens.data.materials.append(M); lens.parent = cam; lens.location = (0, 0.15, 1.36); lens.rotation_euler = (R(90), 0, 0)
    flash = box("ph_flash", (0.14, 0.06, 0.08), (0, 0, 1.53), mat("ph_flashm", (1, 1, 1), 0.2), cam)
    return cam

def lights(origin, sun_dir=(R(55), R(-20), R(-60)), warm=True):
    s = bpy.data.lights.new("sun", "SUN"); s.energy = 4.5; s.color = (1.0, 0.9, 0.78) if warm else (1, 1, 1)
    try: s.angle = R(3)
    except Exception: pass
    o = bpy.data.objects.new("sun", s); bpy.context.scene.collection.objects.link(o); o.rotation_euler = sun_dir
    w = bpy.context.scene.world or bpy.data.worlds.new("w"); bpy.context.scene.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.85, 0.82, 0.78, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.55

def camera(name, lens=35):
    c = bpy.data.cameras.new(name); c.lens = lens; c.clip_start = 0.05
    o = bpy.data.objects.new(name, c); bpy.context.scene.collection.objects.link(o)
    t = empty(name + "_tgt"); tr = o.constraints.new("TRACK_TO"); tr.target = t; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
    return o, t

def cam_key(cam, tgt, f, pos, look, lens=None):
    cam.location = pos; cam.keyframe_insert("location", frame=f)
    tgt.location = look; tgt.keyframe_insert("location", frame=f)
    if lens: cam.data.lens = lens; cam.data.keyframe_insert("lens", frame=f)

def render_setup(w=1080, h=1920, fps=30, samples=64):
    sc = bpy.context.scene
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try: sc.render.engine = eng; break
        except Exception: continue
    sc.render.resolution_x, sc.render.resolution_y, sc.render.fps = w, h, fps
    try: sc.eevee.taa_render_samples = samples
    except Exception: pass
    for k, v in (("use_shadows", True), ("use_raytracing", False), ("use_gtao", True), ("shadow_ray_count", 2), ("shadow_step_count", 8)):   # raytracing OFF: it caused visible grain (user 19/11)
        try: setattr(sc.eevee, k, v)
        except Exception: pass
    sc.render.filter_size = 1.0   # 1.0 = crisp but smooth edges (0.75 aliased, 1.5 blurry)   # sharper than the 1.5 px default (user: props not as crisp as the reference)
    sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"
    sc.render.image_settings.file_format = "PNG"


# ---------------------------------------------------------------- collision QA (user 19/11: legs/bodies stuck in walls & props)
def _aabb(o):
    from mathutils import Vector
    cs = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return (min(c.x for c in cs), min(c.y for c in cs), min(c.z for c in cs)), (max(c.x for c in cs), max(c.y for c in cs), max(c.z for c in cs))
def _overlap(a, b, tol=0.02):
    (a0, a1), (b0, b1) = a, b
    return all(a0[i] + tol < b1[i] and b0[i] + tol < a1[i] for i in range(3))
SEAT_WORDS = ("seat", "bench", "chair", "stool", "dseat", "beanbag")
SKIP_WORDS = ("floor", "ceil", "seam", "aisle", "rug", "carpet", "fog", "asphalt", "park_walk", "park_line", "curb", "_fx", "_fy", "lp", "light", "sky", "tree", "bush", "house", "roofh", "pole", "string", "bulb", "cl_", "circle", "_m", "cw_walk", "cw_wj", "cw_zebra", "cw_dash", "cw_lawn", "pt_concrete", "pt_jx", "pt_jy", "pt_ground", "nu_fx", "nu_fy", "au_stage", "tsw_")
def find_collisions(chars, frame, tol=0.025):
    """Mesh parts of each Char vs every static mesh in the scene, at `frame`. Seated contact (pelvis/thigh on a seat) is allowed."""
    sc = bpy.context.scene; sc.frame_set(frame)
    char_objs = {}
    for c in chars:
        root = c.j["root"]
        if root.location.y < -30 or root.location.y > 60 and False: continue
        parts = [o for o in root.children_recursive if o.type == "MESH" and not o.hide_render]
        for o in parts: char_objs[o.name] = c.name
    statics = [o for o in sc.objects if o.type == "MESH" and o.name not in char_objs and not o.hide_render
               and not any(w in o.name.lower() for w in SKIP_WORDS)]
    sb = {o.name: _aabb(o) for o in statics}
    hits = []
    for on, cn in char_objs.items():
        o = bpy.data.objects[on]; box_ = _aabb(o)
        if box_[1][2] < 0.02: continue
        for sn, sbox in sb.items():
            if _overlap(box_, sbox, tol):
                low = sn.lower()
                if any(w in low for w in SEAT_WORDS) and any(w in on for w in ("pelvis", "thigh", "shin", "shoe")): continue
                if ("desk" in low or "table" in low or "top" in low) and any(w in on for w in ("thigh", "shin", "shoe", "hand", "farm")): pass
                hits.append((cn, on.split("_", 1)[-1], sn))
    return hits
