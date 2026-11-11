#!/usr/bin/env bash
# Mux Remotion's silent render with the untouched edited audio (single AAC 320k encode), padded to video length.
set -euo pipefail
R="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$R/output"
ffmpeg -v error -y -i "$R/work_video.mp4" -i "$R/work_audio.wav" \
  -map 0:v -map 1:a -c:v copy -af apad -shortest -c:a aac -b:a 320k -ar 44100 \
  -movflags +faststart "$R/output/reel_final.mp4"
