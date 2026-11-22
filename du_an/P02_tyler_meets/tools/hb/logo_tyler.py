"""Tyler logo render: peace / V-sign pose, transparent background, 2048x2048 (bust + full body).
blender -b --python tools/hb/logo_tyler.py -- <out_dir>"""
import bpy, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib; importlib.reload(hb_lib)
from hb_lib import *
OUT = os.path.abspath(sys.argv[sys.argv.index("--") + 1]); os.makedirs(OUT, exist_ok=True)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")); P = lambda p: os.path.join(ROOT, p)
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=64)
sc = bpy.context.scene; sc.render.film_transparent = True
sc.render.image_settings.color_mode = "RGBA"; sc.render.resolution_x = sc.render.resolution_y = 2048
lights((0, 0, 0)); bpy.data.objects["sun"].data.energy = 2.6
key = bpy.data.lights.new("key", "AREA"); key.energy = 60; key.size = 2.5
k = bpy.data.objects.new("key", key); sc.collection.objects.link(k); k.location = (-1.6, -2.4, 2.6); k.rotation_euler = (R(55), 0, R(-35))
rim = bpy.data.lights.new("rim", "AREA"); rim.energy = 45; rim.size = 1.5
r = bpy.data.objects.new("rim", rim); sc.collection.objects.link(r); r.location = (1.4, 1.6, 2.4); r.rotation_euler = (R(-60), 0, R(150))

t = Char("TYLER", skin="f1c7a0", shirt="ffd23f", pants="3a3f47", shoes="f4f4f4", hair="1e1a18", hair_style="messy",
         print_img=P("assets/hb/prints/me_paused.png"))
t.place(1, 0, 0, 0, -12); t.stand(1)
# right arm up beside the head, forearm vertical, palm to camera
t.pose(1, sh_R=(-15, -100, 0), el_R=(0, -78, 0), sh_L=(0, 6, 0), el_L=(-10, 0, 0), head=(0, 6, -8), chest=(0, -3, 4))
SK = bpy.data.materials["TYLER_skin"]
hand = t.j["hand_R"]; el = t.j["el_R"]
hand.scale = (1.0, 0.8, 1.0)
for nm, x, ang in (("index", -0.032, 11), ("middle", 0.032, -11)):      # V fingers
    f = box(f"TYLER_{nm}", (0.042, 0.045, 0.15), (x, 0, -0.42), SK, el, 0.012, 2); f.rotation_euler = (0, R(ang), 0)
th = box("TYLER_thumb", (0.04, 0.045, 0.08), (-0.075, -0.02, -0.31), SK, el, 0.012, 2); th.rotation_euler = (0, R(40), 0)
box("TYLER_fold", (0.10, 0.05, 0.05), (0.01, -0.05, -0.33), SK, el, 0.015, 2)   # curled ring + pinky
# cheeky grin + wink
t.expr("happy", 1)
t.eyes[1].scale = (1, 1, 1.0); t.eyes[0].scale = (1.05, 1, 0.16)            # wink (left eye closed)
for e in t.eyes: e.keyframe_insert("scale", frame=1)
t.mouth.scale = (1.5, 1, 2.2); t.mouth.keyframe_insert("scale", frame=1)
cam, tgt = camera("cam", 50); sc.camera = cam
for name, pos, look, lens in (("tyler_logo_bust", (0.35, -2.6, 1.72), (0.05, 0, 1.62), 55),
                              ("tyler_logo_full", (0.25, -3.6, 1.15), (0.05, 0, 1.08), 40)):
    cam_key(cam, tgt, 1, pos, look, lens); sc.frame_set(1)
    sc.render.filepath = os.path.join(OUT, name + ".png"); bpy.ops.render.render(write_still=True)
print("LOGO DONE")
