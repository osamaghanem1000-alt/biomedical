"""Build the edit: word timings (forced-aligned + waveform-snapped), cut list, camera path,
caption chunks, SRT and the Remotion timeline JSON.  Usage: python3 build.py <reel2 dir>"""
import json, sys, math, os
R = sys.argv[1]
FPS = 30
words = json.load(open(f"{R}/tools/aligned_raw.json"))
# --- manual fixes where CTC confidence was ~0, snapped to waveform silences (RMS, 10 ms)
FIX = {10:(4.84,5.45), 11:(5.77,5.96), 21:(10.13,10.30), 22:(10.32,10.62), 23:(10.66,11.40),
       24:(11.42,11.70), 36:(14.66,15.00), 37:(15.67,16.28), 57:(25.06,25.58), 58:(25.64,25.95),
       65:(33.25,33.50), 66:(33.50,33.79), 67:(34.49,34.99), 103:(49.49,49.75),
       148:(67.62,67.78), 149:(67.80,68.12), 150:(68.14,68.57), 151:(68.68,68.80), 152:(68.80,68.94)}
sys.path.insert(0, f"{R}/tools"); from words import W as WL
for w,(v,d,sp) in zip(words, WL): assert w["word"]==v; w["text"], w["spk"] = d, sp
for i,(s,e) in FIX.items(): words[i]["start"], words[i]["end"] = s, e
q = lambda t: round(t*FPS)/FPS          # quantise to frame grid
# --- silences > 0.6 s (from RMS analysis) tightened to 0.3 s
SIL = [(9.48,10.13),(15.0,15.67),(21.53,22.38),(27.02,27.97),(32.07,33.25),(33.79,34.49),(42.55,43.23),(65.79,66.81)]
MAIN0, SRC_END = 0.92, 69.31
cuts = [(q(s+0.15), q(e-0.15)) for s,e in SIL]
main = []; t = q(MAIN0)
for a,b in cuts: main.append((t,a)); t=b
main.append((t, q(SRC_END)))
COLD = (q(39.55), q(42.75))
segs = [dict(src0=COLD[0], src1=COLD[1], cold=True)] + [dict(src0=a,src1=b,cold=False) for a,b in main]
o = 0
for s in segs:
    s["out0"] = o; o += round((s["src1"]-s["src0"])*FPS); s["out1"] = o
VIDEO_FRAMES = o
def to_out(t, cold=False):
    for s in segs:
        if s["cold"]==cold and s["src0"]-1e-6 <= t <= s["src1"]+1e-6:
            return s["out0"]/FPS + (t-s["src0"])
    # inside a cut: snap to next segment start
    for s in segs:
        if not s["cold"] and t < s["src0"]: return s["out0"]/FPS
    return segs[-1]["out1"]/FPS
last_word_out = to_out(words[-1]["end"])
SCENE_B_LEN = 3.5
TOTAL = round((last_word_out + SCENE_B_LEN)*FPS)
# --- speakers (framing). The 1 s interjection at 50.3 s stays on the engineer (calm framing).
SPK = [(0,10.0,"E"),(10.0,15.3,"I"),(15.3,65.9,"E"),(65.9,99,"I")]
spk_at = lambda t: next(s for a,b,s in SPK if a<=t<b)
FACE = {"E":(1062,262),"I":(292,215)}   # face centre in 1280x720 source px
def cam_for_frame(f):
    """returns (cx, cy, scale) in source px"""
    seg = next((s for s in segs if s["out0"]<=f<s["out1"]), segs[-1])
    src = seg["src0"] + (min(f,seg["out1"]-1)-seg["out0"])/FPS
    sp = "E" if seg["cold"] else spk_at(src)
    ease = lambda x: 0.5-0.5*math.cos(math.pi*max(0,min(1,x)))
    if seg["cold"]:
        sc = 1.02 + 0.06*ease((f-seg["out0"])/(seg["out1"]-seg["out0"]))
    else:
        # slow push-in 1.00 -> 1.06 across each engineer block, punch 1.04 alternating on same-speaker cuts
        blocks = [(a,b) for a,b,s in SPK if s==sp]
        a,b = next((a,b) for a,b in blocks if a<=src<b)
        a = max(a, MAIN0); b = min(b, SRC_END)
        sc = 1.0 + (0.06*ease((src-a)/(b-a)) if sp=="E" and b-a>6 else 0.0)
        mi = segs.index(seg)
        punch = 0
        for k in range(1, mi):
            prev, cur = segs[k], segs[k+1]
            if spk_at(prev["src1"]-0.01)==spk_at(cur["src0"]+0.01): punch ^= 1
            else: punch = 0
        sc *= 1.04 if punch else 1.0
        # stronger push on "عشان يبيع" (main body)
        p0, p1 = 41.40, 41.90
        if seg["src0"] <= p0 < seg["src1"] and src >= p0:
            k = ease((src-p0)/(p1-p0)); sc = sc + (1.10 - sc)*k
    fx, fy = FACE[sp]
    w, h = 405/sc, 720/sc
    cx = min(max(fx, w/2), 1280-w/2)
    cy = min(max(fy + 0.15*h, h/2), 720-h/2)
    return cx, cy, sc
cam = [cam_for_frame(f) for f in range(TOTAL)]
# --- captions: chunk displayed words (2-4 words, break on punctuation / speaker / gap)
disp = []
for w in words:
    if not w["text"]: continue
    cold = False
    disp.append(dict(text=w["text"], spk=w["spk"], s=to_out(w["start"]), e=to_out(w["end"]), src=w["start"]))
# cold-open captions (طب ليه؟ عشان يبيع.)
cold_words = [dict(text=w["text"], spk="E", s=to_out(w["start"],True), e=to_out(w["end"],True), src=w["start"])
              for w in words if COLD[0] <= w["start"] < COLD[1] and w["text"]]
COLD_CHUNKS = "طب ليه؟ | عشان يبيع."
MAIN_CHUNKS = """فيه دلوقتي حاجة | تعقيد أكتر من اللازم. | مش مناسب لنوع الجهاز | إنك تحطلي فيه | التكنولوجيا دي. |
طب ممكن يكونوا | بيعملوا كده ليه الشركات؟ | عشان يبعدوا أي حد | عن الجهاز بتاعه؟ |
عشان يبقى حاجة… | يعني مثلًا لو | شفاط عمليات، | شفاط جراحي، | هو شفاط في الآخر. |
وكان فيه زرار واحد | بيزوّد وينقّص. | ده دلوقتي يعمل شاشة | ومايكروبروسيسور | وحاجات ومحتاجات… | وليه يعني؟ |
وبعدين في الآخر | بيخش فيه دم برضه، | وبيبوظ وبيتنيل | على عينه. | طب ليه؟ | عشان يبيع. |
يبقى حاجة | مبهرة للعين… | حاجة ملهاش علاقة | إنها يبقى فيها | التكنولوجيا دي كلها. |
والعمر الافتراضي… | آه، والعمر الافتراضي | كل ما بيقصر. | كان الأول مثلًا | الجهاز يقعد ١٥ سنة. |
ده حتى التلفزيونات | كان يقولك ده ١٥ سنة، | دلوقتي بقت ٧ سنين، | وشوية هتبقى ٥ سنين. | التلفزيون ٥ سنين |
وتشتري غيره؟ | يا نهار أبيض! | خلاص، آه."""
def chunk_fixed(ws, spec):
    out=[]; i=0
    for part in [p.split() for p in spec.split("|")]:
        c = ws[i:i+len(part)]; assert [w["text"] for w in c]==part, (part,[w["text"] for w in c]); out.append(c); i+=len(part)
    assert i==len(ws); return out
def chunk(ws):
    out=[]; cur=[]
    for w in ws:
        brk = cur and (len(cur)>=4 or w["spk"]!=cur[-1]["spk"] or w["s"]-cur[-1]["e"]>0.45
                       or sum(len(x["text"]) for x in cur)+len(w["text"])>24)
        if brk: out.append(cur); cur=[]
        cur.append(w)
        if w["text"][-1] in ".؟،!…" and len(cur)>=2: out.append(cur); cur=[]
    if cur: out.append(cur)
    # merge single-word chunks into neighbour when same speaker and close
    res=[]
    for c in out:
        if res and len(c)==1 and c[0]["spk"]==res[-1][-1]["spk"] and len(res[-1])<4 and c[0]["s"]-res[-1][-1]["e"]<0.4 \
           and res[-1][-1]["text"][-1] not in ".؟!":
            res[-1]+=c
        else: res.append(c)
    return res
chunks = []
for group,spec in ((cold_words,COLD_CHUNKS),(disp,MAIN_CHUNKS)):
    cs = chunk_fixed(group, spec)
    for i,c in enumerate(cs):
        s = max(0, c[0]["s"] - 0.08)
        nxt = cs[i+1][0]["s"]-0.08 if i+1<len(cs) else 1e9
        e = min(c[-1]["e"]+0.35, nxt) if nxt-c[-1]["e"] < 0.6 else c[-1]["e"]+0.35
        if spec is COLD_CHUNKS: e = min(e, segs[0]["out1"]/FPS - 0.12)
        chunks.append(dict(start=round(s,3), end=round(e,3), spk=c[0]["spk"],
                           words=[dict(t=w["text"], s=round(w["s"],3), e=round(w["e"],3)) for w in c]))
# --- scene/graphic timings (output seconds)
W = lambda i, edge="start": to_out(words[i][edge])
tl = dict(
  fps=FPS, totalFrames=TOTAL, videoFrames=VIDEO_FRAMES,
  coldEnd=segs[0]["out1"]/FPS,
  cuts=[s["out0"]/FPS for s in segs[2:]],
  camera=[[round(c[0],2),round(c[1],2),round(c[2],4)] for c in cam],
  captions=chunks,
  sceneA=dict(start=W(52)-4/FPS, end=W(64,"end")+0.25, screenAt=W(60), chipAt=W(62), traceEnd=W(64,"end")),
  lifespan=dict(n15=W(123), n7=W(137), n5=W(141), end=W(150,"end")+0.25),
  sceneB=dict(start=last_word_out),
)
json.dump(tl, open(f"{R}/template/src/timeline.json","w"), ensure_ascii=False)
json.dump(dict(segments=segs, words=words), open(f"{R}/tools/edit_list.json","w"), ensure_ascii=False, indent=1)
# --- SRT (chunk level)
def ts(x):
    ms=int(round(x*1000)); return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
os.makedirs(f"{R}/output", exist_ok=True)
with open(f"{R}/output/captions.srt","w") as f:
    for i,c in enumerate(chunks,1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{' '.join(w['t'] for w in c['words'])}\n\n")
print("segments:"); [print(f"  src {s['src0']:6.2f}-{s['src1']:6.2f} -> out {s['out0']/FPS:6.2f}-{s['out1']/FPS:6.2f}{' COLD' if s['cold'] else ''}") for s in segs]
print("total", TOTAL/FPS, "video", VIDEO_FRAMES/FPS, "lastword", last_word_out)
print("sceneA", tl["sceneA"], "\nlifespan", tl["lifespan"])
for c in chunks: print(f"{c['start']:6.2f}-{c['end']:6.2f} {c['spk']} {' '.join(w['t'] for w in c['words'])}")
