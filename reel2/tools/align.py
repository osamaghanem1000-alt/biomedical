# CTC forced alignment of the verbatim word list (wav2vec2 Arabic) -> word timings JSON
import sys, json, wave, re, numpy as np, torch, torchaudio.functional as F
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
sys.path.insert(0, __file__.rsplit('/',1)[0]); from words import W
wav, out = sys.argv[1], sys.argv[2]
MID = "jonatasgrosman/wav2vec2-large-xlsr-53-arabic"
proc = Wav2Vec2Processor.from_pretrained(MID); model = Wav2Vec2ForCTC.from_pretrained(MID).eval()
w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)/32768
vocab = proc.tokenizer.get_vocab()
def norm(s):
    s = re.sub('[ً-ْـ]', '', s)
    s = s.replace('أ','ا').replace('إ','ا').replace('آ','ا')
    return ''.join(c for c in s if c in vocab) or 'ا'
with torch.inference_mode():
    iv = proc(a, sampling_rate=16000, return_tensors="pt").input_values
    em = torch.log_softmax(model(iv).logits, -1)
sep = vocab.get('|')
toks, owner = [], []
for i,(v,_,_) in enumerate(W):
    for c in norm(v): toks.append(vocab[c]); owner.append(i)
blank = vocab.get('<pad>', 0)
ali, scores = F.forced_align(em, torch.tensor([toks]), blank=blank)
ali = ali[0].numpy(); sc = scores[0].exp().numpy()
fr = a.shape[0]/16000/em.shape[1]
# token spans
spans=[]; ti=-1; prev=blank
for f,t in enumerate(ali):
    if t!=blank and (t!=prev or f==0 or ali[f-1]==blank):
        ti+=1; spans.append([f,f,[sc[f]]])
    elif t!=blank: spans[-1][1]=f; spans[-1][2].append(sc[f])
    prev=t
res=[]
for i,(v,d,s) in enumerate(W):
    idx=[k for k,o in enumerate(owner) if o==i]
    st=spans[idx[0]][0]*fr; en=(spans[idx[-1]][1]+1)*fr
    conf=float(np.mean([np.mean(spans[k][2]) for k in idx]))
    res.append(dict(i=i,word=v,text=d,spk=s,start=round(st,3),end=round(en,3),conf=round(conf,2)))
json.dump(res, open(out,'w'), ensure_ascii=False, indent=1)
for r in res: print(f"{r['start']:7.2f} {r['end']:7.2f} {r['conf']:.2f} {r['word']}")
