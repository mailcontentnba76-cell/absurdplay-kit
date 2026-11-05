# Đo bổ sung: cắt cảnh theo khung, phụ đề trắng, chuyển động máy, âm thanh nền giữa lời, F0.
import sys, json, os, subprocess, numpy as np, cv2
vid, asr, out = sys.argv[1], sys.argv[2], sys.argv[3]
W = json.load(open(asr))['words']
cap = cv2.VideoCapture(vid); fps = cap.get(cv2.CAP_PROP_FPS); N = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
prev=None; hd=[]; flows=[]; masks=[]; pg=None
k=0
while True:
    ok, f = cap.read()
    if not ok: break
    H, Wd = f.shape[:2]
    small = cv2.resize(f,(90,160)); hsv=cv2.cvtColor(small,cv2.COLOR_BGR2HSV)
    h = cv2.calcHist([hsv],[0,1],None,[16,8],[0,180,0,256]); h=cv2.normalize(h,h).flatten()
    hd.append(0 if prev is None else cv2.compareHist(prev,h,cv2.HISTCMP_BHATTACHARYYA)); prev=h
    g = cv2.cvtColor(cv2.resize(f,(180,320)),cv2.COLOR_BGR2GRAY)
    if pg is not None and k%2==0:
        fl = cv2.calcOpticalFlowFarneback(pg,g,None,0.5,3,15,3,5,1.2,0)
        ys,xs = np.mgrid[0:320,0:180]; cx,cy = xs-90, ys-160
        r2 = cx**2+cy**2+1e-6
        div = np.median((fl[...,0]*cx+fl[...,1]*cy)/np.sqrt(r2))
        flows.append((k/fps, float(np.median(fl[...,0]))*fps, float(np.median(fl[...,1]))*fps, float(div)*fps, float(np.median(np.hypot(fl[...,0],fl[...,1])))*fps))
    pg=g
    hsvf = cv2.cvtColor(f,cv2.COLOR_BGR2HSV)
    m = ((hsvf[...,2]>225)&(hsvf[...,1]<30)).astype(np.uint8)
    masks.append(cv2.resize(m,(Wd//4,H//4),interpolation=cv2.INTER_AREA))
    k+=1
hd=np.array(hd); T=len(hd)
# cắt: đỉnh cục bộ histogram
cuts=[i/fps for i in range(1,T-1) if hd[i]>0.25 and hd[i]>=hd[i-1] and hd[i]>=hd[i+1]]
# phụ đề: tần suất pixel trắng; vùng chữ = hàng có tần suất cao ở giữa ngang
M=np.array(masks).astype(np.float32)  # T x h x w
freq=M.mean(0)
rows=freq[:, freq.shape[1]//4:3*freq.shape[1]//4].mean(1)
band=np.where(rows>rows.max()*0.35)[0]
res={'fps':fps,'frames':T,'cuts_hist':[round(c,3) for c in cuts]}
if len(band):
    y0,y1=band.min()*4,(band.max()+1)*4
    res['sub_band_px']=[int(y0),int(y1)]
    sub=M[:,band.min():band.max()+1,:]
    per=sub.reshape(T,-1)
    # chiều cao chữ & bbox theo khung
    hts=[];cys=[];wds=[]
    for t in range(0,T,3):
        s=sub[t]>0.3
        r=np.where(s.any(1))[0]; c=np.where(s.any(0))[0]
        if len(r)>1 and len(c)>4:
            hts.append((r.max()-r.min()+1)*4); cys.append((band.min()+ (r.min()+r.max())/2)*4); wds.append((c.max()-c.min()+1)*4)
    res['sub_cao_px_trung_vi']=float(np.median(hts)) if hts else None
    res['sub_tam_y_px_trung_vi']=float(np.median(cys)) if cys else None
    res['sub_rong_px_trung_vi']=float(np.median(wds)) if wds else None
    res['sub_rong_px_max']=float(np.max(wds)) if wds else None
    # đổi cụm chữ
    d=np.abs(np.diff(per,axis=0)).sum(1)/ (per.shape[1])
    ch=[ (i+1)/fps for i in range(1,len(d)-1) if d[i]>0.01 and d[i]>=d[i-1] and d[i]>=d[i+1]]
    res['sub_doi_cum']=[round(c,3) for c in ch]
# chuyển động máy
F=np.array(flows)
if len(F):
    mag=F[:,4]; still=(mag<3)
    zin=(F[:,3]>1.5); zout=(F[:,3]<-1.5); pan=(np.abs(F[:,1])>abs(1)*4)&~zin&~zout; tilt=(np.abs(F[:,2])>4)&~zin&~zout&~pan
    res['may']={'dung_yen_pct':round(100*still.mean(),1),'day_vao_pct':round(100*zin.mean(),1),'lui_pct':round(100*zout.mean(),1),'lia_ngang_pct':round(100*pan.mean(),1),'lia_doc_pct':round(100*tilt.mean(),1),'toc_do_trung_vi_px_s':round(float(np.median(mag)),1),'toc_do_p90':round(float(np.percentile(mag,90)),1)}
    res['may_chuoi']=[[round(a,2),round(b,1),round(c,1),round(e,2),round(m,1)] for a,b,c,e,m in F[::3]]
# âm thanh
pcm=subprocess.run(['ffmpeg','-loglevel','error','-i',vid,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(pcm,np.int16).astype(np.float32)/32768; sr=16000
def db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
sp=np.concatenate([a[int(w['s']*sr):int(w['e']*sr)] for w in W]) if W else a
gaps=[]
for i in range(len(W)-1):
    g0=W[i]['e'] if 'e' in W[i] else W[i]['s']
# khoảng giữa câu: dùng vùng sau từ cuối câu (dấu . ! ?) 0.1s cuối trước từ kế
gl=[]
for i in range(len(W)-1):
    if W[i]['w'][-1:] in '.!?,':
        s=W[i+1]['s']-0.12; e=W[i+1]['s']-0.02
        if e>s>0: gl.append(db(a[int(s*sr):int(e*sr)]))
res['am']={'loi_dBFS':round(db(sp),1),'giua_cau_dBFS_trung_vi':round(float(np.median(gl)),1) if gl else None,
           'sau_loi_cuoi_dBFS': round(db(a[int((W[-1]['s']+0.6)*sr):]),1) if W and len(a)>(W[-1]['s']+0.9)*sr else None}
try:
    import librosa
    y=a[:sr*60]
    f0,vf,_=librosa.pyin(y,fmin=60,fmax=400,sr=sr,frame_length=1024)
    res['am']['F0_trung_vi_Hz']=round(float(np.nanmedian(f0)),1)
    yp=librosa.effects.percussive(y)
    oe=librosa.onset.onset_strength(y=yp,sr=sr)
    # tự tương quan onset (độ đều nhịp) 0..1
    ac=librosa.autocorrelate(oe-oe.mean()); ac/=ac[0]+1e-9
    lag=10+int(np.argmax(ac[10:120])); res['am']['do_deu_nhip']=round(float(ac[lag]),2); res['am']['tempo_bpm_uoc']=round(60*sr/512/lag,1)
except Exception as ex: res['am']['loi_librosa']=str(ex)
# lời
dur=T/fps; nw=len(W)
res['loi']={'so_tu':nw,'bat_dau_s':W[0]['s'] if W else None,'ket_thuc_s':W[-1]['e'] if W else None,
 'tu_phut':round(nw/((W[-1]['e']-W[0]['s'])/60),1) if W else None}
json.dump(res,open(out,"w"),ensure_ascii=False,default=float)
print(os.path.basename(vid), json.dumps({k:v for k,v in res.items() if k not in('may_chuoi','sub_doi_cum','cuts_hist')},ensure_ascii=False,default=float))
