# đo nhấp nháy: tỉ lệ điểm ảnh dao động (lên-xuống-lên) mạnh giữa 3 khung liên tiếp, theo từng shot
import sys,glob,re,numpy as np
from PIL import Image
d,shots=sys.argv[1],sys.argv[2]
src=open(shots).read();SH={k:[float(x) for x in v.split(',')] for k,v in re.findall(r"(s\d+[a-z]?):\[([\d.,]+)\]",src.split('END')[0])}
fs=sorted(glob.glob(d+'/f_*.jpg'))
L=lambda f:np.asarray(Image.open(f).convert('L').resize((180,320)),np.float32)
cuts=sorted(set(int(round(v[0]*30)) for v in SH.values()))
res={}
prev2=prev=None
for i,f in enumerate(fs):
    cur=L(f)
    if prev2 is not None and not any(c in (i-1,i) for c in cuts):
        a=prev-prev2;b=cur-prev;osc=((a*b)<0)&(np.abs(a)>18)&(np.abs(b)>18)
        k=[k for k,v in SH.items() if v[0]*30<=i-1<v[1]*30][0];res.setdefault(k,[]).append((osc.mean(),i-1,osc))
    prev2,prev=prev,cur
for k,v in sorted(res.items(),key=lambda kv:-max(x[0] for x in kv[1]))[:12]:
    m=max(v,key=lambda x:x[0]);ys,xs=np.nonzero(m[2]);print(k,'max %.4f mean %.4f frame %d'%(m[0],np.mean([x[0] for x in v]),m[1]),'vùng y %d-%d x %d-%d'%(ys.min()*4,ys.max()*4,xs.min()*4,xs.max()*4) if len(ys) else '')
