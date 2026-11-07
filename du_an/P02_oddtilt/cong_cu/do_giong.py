# Đo ngữ điệu giọng đọc: cao độ (F0) trung vị/dải/độ lệch theo bán cung, từ được nhấn (cao độ+âm lượng+kéo dài), tốc độ theo cụm, cao độ cuối cụm.
# Dùng: python3 do_giong.py <âm thanh hoặc video> <words.json từ asr_parakeet.py> <tên>   (cần librosa: pip install librosa)
import sys,json,numpy as np,librosa,subprocess
def load(f):
    pcm=subprocess.run(['ffmpeg','-loglevel','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(pcm,np.int16).astype(np.float32)/32768
def an(f,wj,name):
    y=load(f);sr=16000;W=json.load(open(wj))['words']
    f0,vf,_=librosa.pyin(y,fmin=70,fmax=400,sr=sr,frame_length=1024,hop_length=160)
    t=np.arange(len(f0))*160/sr;st=12*np.log2(f0/np.nanmedian(f0))
    rms=librosa.feature.rms(y=y,frame_length=1024,hop_length=160)[0];db=20*np.log10(rms+1e-6)
    print(f'== {name}: F0 trung vị {np.nanmedian(f0):.0f} Hz | dải p10–p90 {np.nanpercentile(st,10):.1f}…{np.nanpercentile(st,90):.1f} bán cung (rộng {np.nanpercentile(st,90)-np.nanpercentile(st,10):.1f}) | độ lệch {np.nanstd(st):.2f}')
    # theo từ
    rows=[]
    for w in W:
        m=(t>=w['s'])&(t<w['e'])
        if m.sum()<3: continue
        rows.append((w['w'],w['s'],np.nanmax(st[m]) if np.any(~np.isnan(st[m])) else np.nan,np.max(db[m]),w['e']-w['s']))
    pk=np.array([r[2] for r in rows]);ld=np.array([r[3] for r in rows]);du=np.array([r[4] for r in rows])
    z=(np.nan_to_num(pk,nan=np.nanmean(pk))-np.nanmean(pk))/np.nanstd(pk)+(ld-ld.mean())/ld.std()+.7*(du-du.mean())/du.std()
    top=sorted(range(len(rows)),key=lambda i:-z[i])[:16]
    print('  từ nhấn mạnh nhất (cao độ+âm lượng+kéo dài):',', '.join(f"{rows[i][0]}@{rows[i][1]:.1f}" for i in sorted(top)))
    # tốc độ theo câu
    sent=[];cur=[]
    for w in W:
        cur.append(w)
        if w['w'][-1:] in '.!?,': sent.append(cur);cur=[]
    if cur:sent.append(cur)
    print('  từ/giây theo cụm:',' '.join(f"{len(s)/(s[-1]['e']-s[0]['s']):.1f}" for s in sent if s[-1]['e']>s[0]['s']))
    d=np.diff([s[0]['s'] for s in sent])
    # cao độ cuối câu
    ends=[]
    for s in sent:
        m=(t>=s[-1]['s'])&(t<s[-1]['e']);ends.append(np.nanmean(st[m]) if np.any(~np.isnan(st[m])) else np.nan)
    print('  cao độ từ cuối cụm (bán cung):',' '.join(f"{x:+.0f}" for x in ends))
an(sys.argv[1],sys.argv[2],sys.argv[3])
