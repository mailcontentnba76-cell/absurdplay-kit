"""Bài thử render P02 (chạy: blender -b --factory-startup -P thu_render.py -- <engine> <out_dir> <w> <h> <samples>)
Cảnh nhỏ có các yếu tố đặc trưng của mẫu: nền studio vô cực có vignette, quả cầu trong suốt (nho), vật có viền phát sáng
(làm nổi), chữ 3D phát sáng (bộ đếm), độ sâu trường ảnh, máy đẩy vào. Render 3 khung để đo giây/khung.
"""
import bpy, sys, time, math, os
argv = sys.argv[sys.argv.index('--') + 1:]
engine, out, W, H, S = argv[0], argv[1], int(argv[2]), int(argv[3]), int(argv[4])
os.makedirs(out, exist_ok=True)
sc = bpy.context.scene
for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
sc.render.engine = engine
sc.render.resolution_x, sc.render.resolution_y = W, H
if engine == 'CYCLES':
    sc.cycles.device = 'CPU'; sc.cycles.samples = S; sc.cycles.use_denoising = os.environ.get('P02_DENOISE', '0') == '1'
else:
    sc.eevee.taa_render_samples = S; sc.eevee.use_bloom = True; sc.eevee.use_ssr = True; sc.eevee.use_ssr_refraction = True
# nền vô cực: mặt phẳng cong
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); floor = bpy.context.object
m = bpy.data.materials.new('nen'); m.use_nodes = True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.35, 0.62, 0.85, 1); floor.data.materials.append(m)
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 12, 10), rotation=(math.radians(90), 0, 0)); bpy.context.object.data.materials.append(m)
sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.7, 0.9, 1); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.6
# nho trong suốt
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(-0.3, 0, 0.5), segments=48, ring_count=24); g = bpy.context.object; bpy.ops.object.shade_smooth()
gm = bpy.data.materials.new('nho'); gm.use_nodes = True; p = gm.node_tree.nodes['Principled BSDF']
p.inputs['Base Color'].default_value = (0.55, 0.8, 0.2, 1); p.inputs['Transmission Weight' if 'Transmission Weight' in p.inputs else 'Transmission'].default_value = 0.9; p.inputs['Roughness'].default_value = 0.15
if engine != 'CYCLES': gm.blend_method = 'BLEND'; gm.use_screen_refraction = True
g.data.materials.append(gm)
# vật được làm nổi: viền phát sáng = vỏ phóng to, emission, backface
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0.8, 0, 0.5)); t = bpy.context.object; bpy.ops.object.shade_smooth()
bm = bpy.data.materials.new('than'); bm.use_nodes = True; bm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.35, 0.18, 0.08, 1); t.data.materials.append(bm)
mod = t.modifiers.new('vien', 'SOLIDIFY'); mod.thickness = -0.03; mod.use_flip_normals = True; mod.material_offset = 1
em = bpy.data.materials.new('vien_sang'); em.use_nodes = True; nt = em.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF'])
e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (0.2, 1.0, 0.3, 1); e.inputs[1].default_value = 12
nt.links.new(e.outputs[0], nt.nodes['Material Output'].inputs[0]); em.use_backface_culling = True; t.data.materials.append(em)
# chữ bộ đếm phát sáng
bpy.ops.object.text_add(location=(-0.6, 0.2, 1.4)); tx = bpy.context.object; tx.data.body = '30 x'; tx.data.extrude = 0.03; tx.data.size = 0.5; tx.rotation_euler = (math.radians(80), 0, 0)
rm = bpy.data.materials.new('so'); rm.use_nodes = True; nt = rm.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF']); e2 = nt.nodes.new('ShaderNodeEmission'); e2.inputs[0].default_value = (1, 0.1, 0.1, 1); e2.inputs[1].default_value = 6; nt.links.new(e2.outputs[0], nt.nodes['Material Output'].inputs[0]); tx.data.materials.append(rm)
# đèn mềm
bpy.ops.object.light_add(type='AREA', location=(2, -3, 5)); L = bpy.context.object; L.data.energy = 900; L.data.size = 5; L.rotation_euler = (math.radians(40), 0, math.radians(30))
# máy có DOF, đẩy vào
bpy.ops.object.camera_add(location=(0, -5, 1.2), rotation=(math.radians(85), 0, 0)); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 50; cam.data.dof.use_dof = True; cam.data.dof.focus_object = t; cam.data.dof.aperture_fstop = 1.8
cam.keyframe_insert('location', frame=1); cam.location = (0, -3.2, 1.0); cam.keyframe_insert('location', frame=30)
times = []
for f in (1, 15, 30):
    sc.frame_set(f); sc.render.filepath = f'{out}/{engine.lower()}_{f:03d}.png'; t0 = time.time(); bpy.ops.render.render(write_still=True); times.append(time.time() - t0)
print('KET_QUA', engine, W, H, S, ['%.1f' % x for x in times])
