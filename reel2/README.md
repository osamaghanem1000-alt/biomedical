# Reel 2: complex medical devices, shorter lifespans

Output: `output/reel_final.mp4` (1080x1920, 30 fps, H.264, AAC 320k) and `output/captions.srt`.

## Pipeline (reproducible)
1. `source.mp4` (not committed) goes in `reel2/`.
2. Word timing: `tools/words.py` (verbatim spoken tokens mapped to corrected caption text) ->
   `tools/align.py` (wav2vec2 Arabic CTC forced alignment, `jonatasgrosman/wav2vec2-large-xlsr-53-arabic`)
   -> `tools/aligned_raw.json`. Low-confidence words are snapped to waveform silences in `tools/build.py` (FIX).
3. `python3 tools/build.py .` builds the edit list (cold open + silence tightening), camera path, caption chunks,
   `template/src/timeline.json` and `output/captions.srt`.
4. `python3 tools/make_intermediate.py .` cuts the edited 16:9 video (`template/public/edited.mp4`) and PCM audio.
5. `cd template && npm i && npx remotion render src/index.ts Reel ../work_video.mp4 --codec=h264 --crf=17 --muted`
6. `tools/mux.sh` muxes the audio (only one AAC 320k encode, no other audio processing).

## Template
`template/` is a reusable Remotion project: video layer driven by a per-frame camera path, word-highlight captions,
cold-open title, lifespan line, gold progress bar, and two SVG line-art scenes (`components/Device.tsx`, `SceneA`, `SceneB`).
All timing comes from `src/timeline.json`.
