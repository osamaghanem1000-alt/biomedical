import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import tl from "../timeline.json";
import { W, H } from "../theme";

const SRC_W = 1280, SRC_H = 720; // camera path is expressed in original source pixels

export const VideoLayer: React.FC = () => {
  const f = useCurrentFrame();
  const vf = Math.min(f, tl.videoFrames - 1);
  const [cx, cy, s] = tl.camera[Math.min(f, tl.camera.length - 1)];
  const h = SRC_H / s, w = (SRC_H * W / H) / s; // crop window
  const k = H / h;
  const style: React.CSSProperties = {
    position: "absolute", width: SRC_W * k, height: SRC_H * k,
    left: -(cx - w / 2) * k, top: -(cy - h / 2) * k,
  };
  const video = <OffthreadVideo src={staticFile("edited.mp4")} muted style={style} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {f >= tl.videoFrames ? <Freeze frame={vf}>{video}</Freeze> : video}
    </AbsoluteFill>
  );
};
