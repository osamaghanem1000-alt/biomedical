import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, INK, SAFE, SOFT_SHADOW, ramp } from "../theme";
import { Backdrop } from "./Backdrop";
import { Device, emptyDevice } from "./Device";

/** End card. t = seconds since scene start. */
export const SceneB: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const off = 1.0;
  const state = {
    ...emptyDevice,
    body: 1, details: 1, hose: 1, canister: 1, tube: 1, vents: 0, screen: 1, ui: 1, chip: 1, traces: 1,
    uiOpacity: 1 - ramp(t, off, off + 0.12),
    glow: ramp(t, 0.1, 0.8),
    collapseY: ramp(t, off, off + 0.22),
    collapseX: ramp(t, off + 0.22, off + 0.42),
    dot: ramp(t, off + 0.45, off + 0.75),
  };
  const dim = 1 - 0.55 * ramp(t, off + 0.5, off + 1.1);
  const q = ramp(t, 1.6, 2.1), sub = ramp(t, 2.05, 2.55);
  const box: React.CSSProperties = {
    position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, textAlign: "center", direction: "rtl",
    fontFamily: FONT, color: "#fff", textShadow: SOFT_SHADOW,
  };
  return (
    <AbsoluteFill>
      <Backdrop frame={frame} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: dim }}>
        <g transform={`translate(540 800) scale(${1.0 + 0.025 * ramp(t, 0, 3.5)}) translate(-540 -800)`}>
          <g transform="translate(125 360) scale(1.25)"><Device s={state} /></g>
        </g>
      </svg>
      <div style={{ ...box, top: 0.615 * 1920, fontWeight: 700, fontSize: 56, whiteSpace: "nowrap", opacity: q, transform: `scale(${0.98 + 0.02 * q})` }}>
        تفتكر الشركات بتعمل كده بقصد؟
      </div>
      <div style={{ ...box, top: 0.615 * 1920 + 100, fontWeight: 600, fontSize: 40, whiteSpace: "nowrap", color: INK, opacity: 0.85 * sub }}>
        اكتب رأيك… والحلقة كاملة على القناة
      </div>
    </AbsoluteFill>
  );
};
