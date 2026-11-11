import json,subprocess,numpy as np,sys
from faster_whisper import WhisperModel
f=sys.argv[1]
a=subprocess.run(['ffmpeg','-v','error','-i',f,'-ar','16000','-ac','1','-f','s16le','-'],capture_output=True).stdout
x=np.frombuffer(a,np.int16).astype(np.float32)/32768
m=WhisperModel('small.en',device='cpu',compute_type='int8')
segs,_=m.transcribe(x,word_timestamps=True,initial_prompt="Kirk Cousins, Carson Wentz, Ten Thousand Lakes Mall, Justin Jefferson, Kevin O'Connell, Las Vegas, pick-six, third-round pick")
W=[{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for s in segs for w in s.words]
json.dump(W,open(sys.argv[2],'w'),indent=0)
print(len(W)); print(' '.join(f"{i}:{w['w']}@{w['s']}" for i,w in enumerate(W)))
