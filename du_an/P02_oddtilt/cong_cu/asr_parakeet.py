import sys, json, subprocess, numpy as np, sherpa_onnx, os, glob
md = sys.argv[1]; vids = sys.argv[2]; out = sys.argv[3]
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=glob.glob(md+'/encoder*.onnx')[0], decoder=glob.glob(md+'/decoder*.onnx')[0],
    joiner=glob.glob(md+'/joiner*.onnx')[0], tokens=md+'/tokens.txt', model_type='nemo_transducer', num_threads=4)
for f in sorted(glob.glob(vids+'/*.mp4')):
    b = os.path.basename(f)[:-4]
    pcm = subprocess.run(['ffmpeg','-loglevel','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    a = np.frombuffer(pcm,np.int16).astype(np.float32)/32768
    st = rec.create_stream(); st.accept_waveform(16000,a); rec.decode_stream(st)
    r = st.result
    toks, ts = list(r.tokens), list(r.timestamps)
    words=[]; 
    for t,s in zip(toks,ts):
        if t.startswith(' ') or t.startswith('▁') or not words:
            words.append({'w':t.strip(' ▁'),'s':round(s,2)})
        else: words[-1]['w']+=t
    for i,w in enumerate(words): w['e']= round(words[i+1]['s'] if i+1<len(words) else len(a)/16000,2)
    json.dump({'text':r.text,'words':words},open(f'{out}/{b}.json','w'),ensure_ascii=False,indent=0)
    print(b, len(words), r.text[:100], flush=True)
