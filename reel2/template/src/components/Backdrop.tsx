import React from "react";
import { AbsoluteFill } from "remotion";
import { NAVY } from "../theme";
/** deep navy + soft vignette + very subtle animated grain */
export const Backdrop: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(40,62,92,0.55) 0%, rgba(14,26,43,0) 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(3,8,16,0.6) 100%)" }} />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "screen" }}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(frame / 2) % 50} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1080" height="1920" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
