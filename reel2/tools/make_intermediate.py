"""Cut source into the edited 16:9 intermediate (video only, 2x lanczos) + edited PCM audio."""
import json, sys, subprocess
R = sys.argv[1]; segs = json.load(open(f"{R}/tools/edit_list.json"))["segments"]
vf, af = [], []
for i,s in enumerate(segs):
    f0, f1 = round(s["src0"]*30), round(s["src1"]*30)
    vf.append(f"[0:v]trim=start_frame={f0}:end_frame={f1},setpts=PTS-STARTPTS[v{i}]")
    af.append(f"[0:a]atrim=start_sample={f0*1470}:end_sample={f1*1470},asetpts=PTS-STARTPTS[a{i}]")
n = len(segs)
fc = ";".join(vf+af) + ";" + "".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0,scale=2560:1440:flags=lanczos,format=yuv420p[v];" \
     + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[a]"
subprocess.run(["ffmpeg","-v","error","-y","-i",f"{R}/source.mp4","-filter_complex",fc,
  "-map","[v]","-c:v","libx264","-crf","12","-preset","fast","-g","30","-r","30",f"{R}/template/public/edited.mp4",
  "-map","[a]","-c:a","pcm_s16le",f"{R}/work_audio.wav"], check=True)
