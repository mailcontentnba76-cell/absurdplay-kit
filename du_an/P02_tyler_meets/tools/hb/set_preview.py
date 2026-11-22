"""Preview empty sets (4 stills). Copy, swap in your set functions/origins/cameras.
Usage: blender -b --python tools/hb/set_preview.py -- <ABSOLUTE out_dir>"""
import bpy, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, hb_lib, hb_props, hb_sets4, hb_sets5
for m in (hb_lib, hb_props, hb_sets4, hb_sets5): importlib.reload(m)
from hb_lib import *
from hb_sets5 import crosswalk, auditorium, nurse_office, patio
OUT = sys.argv[sys.argv.index("--") + 1]
bpy.ops.wm.read_factory_settings(use_empty=True); render_setup(samples=16)
CW, AU, NU, PT = 270, 300, 330, 360
crosswalk((CW, 0, 0)); auditorium((AU, 0, 0)); nurse_office((NU, 0, 0)); patio((PT, 0, 0)); lights((0, 0, 0))
for nm, loc, en, sz in (("fill_au", (AU, 2, 5.5), 1500, 8), ("fill_nu", (NU, -1, 2.8), 300, 3)):
    L = bpy.data.lights.new(nm, "AREA"); L.energy = en; L.size = sz; fo = bpy.data.objects.new(nm, L); bpy.context.scene.collection.objects.link(fo); fo.location = loc
cam, tgt = camera("cam", 22); sc = bpy.context.scene; sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 360, 640
for name, p, l in (("cw", (CW + 1.5, -2.5, 1.7), (CW, 6.0, 1.6)), ("au", (AU + 2.0, -6.0, 2.6), (AU, 5.0, 1.6)),
                   ("nu", (NU + 0.6, -2.8, 1.7), (NU - 0.3, 2.0, 1.1)), ("pt", (PT + 3.5, -6.0, 2.0), (PT - 1.0, 3.0, 0.8))):
    cam_key(cam, tgt, 1, p, l, 18); sc.frame_set(1); sc.render.filepath = os.path.join(OUT, name + ".png"); bpy.ops.render.render(write_still=True)
print("PREVIEW OK")
