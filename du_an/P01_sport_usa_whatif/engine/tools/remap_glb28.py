# Chuẩn hoá mô hình Tripo E28 về quy ước của meoglb25 (đầu hướng -z, tên xương Spine/Head/{0=trước,1=sau}_{Left,Right}_Limb_n)
import json,struct,sys,math
def rw(src,dst,mapping,yaw_deg):
    b=open(src,'rb').read(); l=struct.unpack('<I',b[12:16])[0]; j=json.loads(b[20:20+l]); rest=b[20+l:]
    names={n.get('name'):i for i,n in enumerate(j['nodes'])}
    for old,new in mapping.items():
        assert old in names, old
    for old,new in mapping.items(): j['nodes'][names[old]]['name']=new
    nn=[n.get('name') for n in j['nodes']]; assert len(nn)==len(set(nn)), 'trùng tên'
    arm=names['Armature']; a=math.radians(yaw_deg)/2
    n=j['nodes'][arm]; assert 'matrix' not in n
    q0=n.get('rotation',[0,0,0,1]); qy=[0,math.sin(a),0,math.cos(a)]
    x1,y1,z1,w1=qy; x2,y2,z2,w2=q0
    n['rotation']=[w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2]
    t=n.get('translation',[0,0,0]); n['translation']=[t[0]*math.cos(2*a)+t[2]*math.sin(2*a), t[1], -t[0]*math.sin(2*a)+t[2]*math.cos(2*a)]
    js=json.dumps(j,separators=(',',':')).encode(); js+=b' '*((4-len(js)%4)%4)
    out=struct.pack('<III',0x46546C67,2,12+8+len(js)+len(rest))+struct.pack('<I',len(js))+b'JSON'+js+rest
    open(dst,'wb').write(out); print('ok',dst)
T='tripo::'
rac={T+'Spine_0':'Spine_0',T+'Head_0':'Spine_1',T+'Head_1':'Head_1',T+'Head_2':'Head_2',T+'Head_3':'Head_3',T+'0_Left_Limb_0':'face_0',T+'Tail_0':'tail_0',T+'Tail_1':'tail_1'}
for k in range(4): rac[T+f'0_Right_Limb_{k}']=f'0_Left_Limb_{k+1}'
for k in range(5): rac[T+f'1_Right_Limb_{k}']=f'0_Right_Limb_{k+1}'
for k in range(6): rac[T+f'1_Left_Limb_{k}']=f'1_Left_Limb_{k}'
for k,bn in enumerate(['bone_49','bone_50','bone_51','bone_52']): rac[bn]=f'1_Right_Limb_{k+1}'
lh={T+'Head_2':'hornL_0',T+'Head_3':'hornL_1','bone_9':'Head_2','bone_8':'Head_3','bone_10':'hornR_0','bone_11':'hornR_1'}
for k in range(4): lh[T+f'Spine_{k}']=f'Spine_{k}'
for k in range(2): lh[T+f'Head_{k}']=f'Head_{k}'
for k in range(4): lh[T+f'0_Right_Limb_{k}']=f'0_Right_Limb_{k+1}'
for k,bn in enumerate(['bone_26','bone_27','bone_28','bone_29']): lh[bn]=f'0_Left_Limb_{k+1}'
for k in range(5): lh[T+f'0_Left_Limb_{k}']=f'1_Left_Limb_{k}'
for k in range(5): lh[T+f'1_Right_Limb_{k}']=f'1_Right_Limb_{k}'
for k,bn in enumerate(['bone_36','bone_37','bone_38']): lh[bn]=f'tail_{k}'
for k in range(4): lh[T+f'1_Left_Limb_{k}']=f'tail_{k+3}'
lh[T+'Root']='Root'; rac[T+'Root']='Root'
rw('m6.glb','raccoon.glb',rac,180)
rw('m5.glb','longhorn.glb',lh,90)
