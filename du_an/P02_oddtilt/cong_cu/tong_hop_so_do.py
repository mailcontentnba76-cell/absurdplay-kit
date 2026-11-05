import json,glob,os,cv2,numpy as np,re
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out={}
for f in sorted(glob.glob(S+'/h264/*.mp4')):
    b=os.path.basename(f)[:-4]
    W=json.load(open(f'{S}/asr_out/{b}.json'))['words']
    d1=json.load(open(f'{S}/do/{b}/do_luong.json')); d2=json.load(open(f'{S}/do2/{b}.json')); d3=json.load(open(f'{S}/do3/{b}.json'))
    dur=d1['thoi_luong_s']
    cs=sorted(set(d3['cuts_mad']+d2['cuts_hist']))
    cuts=[]
    for c in cs:
        if not cuts or c-cuts[-1]>0.25: cuts.append(c)
    # phụ đề: dải cố định 740-800px
    cap=cv2.VideoCapture(f); fps=cap.get(5); prev=None; dd=[]; hts=[]; tops=[]; bots=[]; wid=[]
    k=0
    while True:
        ok,fr=cap.read()
        if not ok: break
        band=fr[730:810,40:680]; hsv=cv2.cvtColor(band,cv2.COLOR_BGR2HSV)
        m=((hsv[...,2]>230)&(hsv[...,1]<25)).astype(np.float32)
        dd.append(float(m.sum()))
        prev=m
        if k%5==0:
            r=np.where(m.sum(1)>3)[0]; c=np.where(m.sum(0)>1)[0]
            if len(r)>3 and len(c)>10: hts.append(r.max()-r.min()+1); tops.append(730+r.min()); bots.append(730+r.max()); wid.append(c.max()-c.min()+1)
        k+=1
    dd=np.array(dd)
    thr=max(150,np.percentile(dd,60)*0.25)
    on=dd>thr; ch=[i/fps for i in range(1,len(dd)) if on[i] and not on[i-1]]
    edges=[0]+ch+[dur]
    wpc=[]
    for a,bb in zip(edges[:-1],edges[1:]):
        n=sum(1 for w in W if a-0.05<=w['s']<bb-0.05)
        if n: wpc.append(n)
    # shots
    se=[0]+cuts+[dur]; shots=[]
    for a,bb in zip(se[:-1],se[1:]):
        txt=' '.join(w['w'] for w in W if a-0.1<=w['s']<bb-0.1)
        shots.append({'vao':round(a,2),'ra':round(bb,2),'dai':round(bb-a,2),'loi':txt})
    text=' '.join(w['w'] for w in W)
    # mốc từ khóa
    def first(pat):
        for w in W:
            if re.fullmatch(pat,w['w'].strip('.,!?').lower()): return w['s']
    kw={}
    for i,w in enumerate(W):
        t=w['w'].strip('.,!?').lower()
        if t in('except','but') and (i==0 or W[i-1]['w'][-1] in '.,!?'):
            kw.setdefault('van_de',[]).append(round(w['s'],2))
    for p,name in [('genius','genius'),('caveman','caveman'),('congratulations','congrats')]:
        v=first(p); 
        if v is not None: kw[name]=round(v,2)
    reacts=[ (round(w['s'],2),w['w']) for w in W if w['w'].strip('.,!?').lower() in ('genius','clever','lovely','perfect','congratulations') or (w['w'].lower().startswith('better') )]
    lw=W[-1]['s']+0.35
    out[b]={'dur':dur,'fps':d1['fps'],'lufs':d1['am_thanh']['loudness_LUFS'],'tp':d1['am_thanh']['true_peak_dBFS'],'lra':d1['am_thanh']['LRA_LU'],
      'sidemid':d1['am_thanh']['side_tru_mid_dB'],'lang':len(d1['am_thanh']['khoang_lang_gt_0_35s']),
      'bh':d1['hinh']['bao_hoa_trung_vi'],'sang':d1['hinh']['sang_trung_vi'],'net':d1['hinh']['ti_le_chi_tiet_min_trung_vi'],
      'may':d2['may'],'am':d2['am'],'so_tu':len(W),'loi_bd':W[0]['s'],'loi_kt':round(lw,2),'tpm':round(len(W)/((lw-W[0]['s'])/60),1),
      'cuts':cuts,'so_shot':len(shots),'shot_tv':round(float(np.median([s['dai'] for s in shots])),2),'shots':shots,
      'sub':{'cao_px':float(np.median(hts)) if hts else None,'tren_px':float(np.median(tops)) if tops else None,'duoi_px':float(np.median(bots)) if bots else None,'rong_tv':float(np.median(wid)) if wid else None,'rong_max':float(np.max(wid)) if wid else None,
             'so_cum':len(wpc),'tu_cum_tv':float(np.median(wpc)) if wpc else None,'tu_cum_max':int(max(wpc)) if wpc else None,'pct_1':round(100*np.mean(np.array(wpc)==1),0),'pct_2':round(100*np.mean(np.array(wpc)==2),0),'pct_3p':round(100*np.mean(np.array(wpc)>=3),0)},
      'kw':kw,'reacts':reacts,'text':text,'md5':d1['md5'][:8]}
    print(b,out[b]['so_shot'],out[b]['shot_tv'],out[b]['sub'],out[b]['kw'])
json.dump(out,open(S+'/tong.json','w'),ensure_ascii=False,indent=1,default=float)
