import React from "react";
import { Composition, Still } from "remotion";
import { Thumbnail } from "./Thumbnail";
import { Reel } from "./Reel";
import tl from "./timeline.json";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Reel" component={Reel} durationInFrames={tl.totalFrames} fps={tl.fps} width={1080} height={1920} />
  <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
  </>
);
