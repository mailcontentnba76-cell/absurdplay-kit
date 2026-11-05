import sys,json,cv2,numpy as np
vid,out=sys.argv[1:3]
cap=cv2.VideoCapture(vid); fps=cap.get(5); p=None; d=[]
while True:
    ok,f=cap.read()
    if not ok: break
    g=cv2.cvtColor(cv2.resize(f,(72,128),interpolation=cv2.INTER_AREA),cv2.COLOR_BGR2GRAY).astype(np.float32)
    # bỏ vùng phụ đề (y 54-64%)
    g[69:82,:]=0
    d.append(0 if p is None else float(np.abs(g-p).mean())); p=g
d=np.array(d); cuts=[]
for i in range(2,len(d)-2):
    loc=np.median(np.r_[d[max(0,i-8):i-1],d[i+2:i+9]])
    if d[i]>12 and d[i]>3.5*(loc+1) and d[i]==d[max(0,i-2):i+3].max(): cuts.append(round(i/fps,3))
json.dump({'cuts_mad':cuts,'mad':[round(x,2) for x in d]},open(out,'w'))
print(vid.split('/')[-1],len(cuts),cuts)
