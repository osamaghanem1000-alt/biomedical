import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./fonts";
import tl from "./timeline.json";
import { NAVY, ramp } from "./theme";
import { VideoLayer } from "./components/VideoLayer";
import { Captions } from "./components/Captions";
import { ColdTitle } from "./components/ColdTitle";
import { Lifespan } from "./components/Lifespan";
import { ProgressBar } from "./components/ProgressBar";
import { SceneA } from "./components/SceneA";
import { SceneB } from "./components/SceneB";

export const Reel: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / tl.fps;
  const xf = 8 / tl.fps; // 8-frame crossfades
  const a = tl.sceneA;
  const aOp = Math.min(ramp(t, a.start, a.start + xf), 1 - ramp(t, a.end - xf, a.end));
  const bOp = ramp(t, tl.sceneB.start, tl.sceneB.start + xf);
  // 0.2 s dip to black between cold open and the clip
  const dip = Math.min(ramp(t, tl.coldEnd - 0.1, tl.coldEnd), 1 - ramp(t, tl.coldEnd, tl.coldEnd + 0.1));
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {aOp < 1 && bOp < 1 ? <VideoLayer /> : null}
      {/* very soft legibility gradient behind the caption band */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.32) 64%, rgba(0,0,0,0.32) 72%, rgba(0,0,0,0) 86%)" }} />
      <ColdTitle t={t} />
      <Lifespan t={t} />
      {aOp > 0 ? <AbsoluteFill style={{ opacity: aOp }}><SceneA t={t} /></AbsoluteFill> : null}
      {bOp > 0 ? <AbsoluteFill style={{ opacity: bOp }}><SceneB t={t - tl.sceneB.start} /></AbsoluteFill> : null}
      <Captions t={t} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: dip }} />
      <ProgressBar frame={f} total={tl.totalFrames} />
    </AbsoluteFill>
  );
};
