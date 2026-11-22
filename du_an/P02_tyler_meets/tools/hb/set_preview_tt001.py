"""Preview TT001 empty sets (4 stills). Usage: blender -b --python tools/hb/set_preview_tt001.py -- <ABSOLUTE out_dir>"""
import bpy, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets4, hb_sets5, hb_sets6
for m in (hb_lib, hb_props, hb_sets4, hb_sets5, hb_sets6): importlib.reload(m)
from hb_lib import *
from hb_sets6 import basketball_court, band_room, art_room, bus_stop
OUT = sys.argv[sys.argv.index("--") + 1]
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=16)
BC, BD, AR, BS = 390, 420, 450, 480
basketball_court((BC, 0, 0)); band_room((BD, 0, 0)); art_room((AR, 0, 0)); bus_stop((BS, 0, 0)); lights((0, 0, 0))
for nm, loc, en, sz in (("fill_bd", (BD, -0.5, 3.4), 900, 8), ("fill_ar", (AR, 0, 3.4), 900, 8)):
    L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = sz; fo = bpy.data.objects.new(nm, L); bpy.context.scene.collection.objects.link(fo); fo.location = loc
W = bpy.context.scene.world.node_tree.nodes["Background"]
cam, tgt = camera("cam", 22); sc = bpy.context.scene; sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 360, 640
for name, p, l, sky in (("bc", (BC + 2.0, 2.0, 2.2), (BC - 0.5, 12.0, 1.8), (0.42, 0.62, 0.92)), ("bd", (BD + 0.3, -4.6, 2.3), (BD, 2.0, 1.0), (0.85, 0.82, 0.78)),
                        ("ar", (AR + 0.2, -4.6, 2.3), (AR + 0.4, 1.5, 1.0), (0.85, 0.82, 0.78)), ("bs", (BS - 3.5, -5.5, 1.9), (BS + 0.5, 2.5, 1.2), (0.98, 0.6, 0.42))):
    W.inputs[0].default_value = (*sky, 1); W.inputs[1].default_value = 0.75
    cam_key(cam, tgt, 1, p, l, 18); sc.frame_set(1); sc.render.filepath = os.path.join(OUT, name + ".png"); bpy.ops.render.render(write_still=True)
print("PREVIEW OK")
