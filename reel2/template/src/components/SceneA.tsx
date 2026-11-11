import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import tl from "../timeline.json";
import { FONT, INK, SAFE, ramp } from "../theme";
import { Backdrop } from "./Backdrop";
import { Device, emptyDevice } from "./Device";

export const SceneA: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const A = tl.sceneA;
  const s0 = A.start + 0.15;
  const scr = A.screenAt, chip = A.chipAt;
  const goldStart = chip + 1.3, goldEnd = A.traceEnd - 0.2;
  const step = (goldEnd - goldStart) / 5;
  const state = {
    ...emptyDevice,
    body: ramp(t, s0, s0 + 1.3),
    details: ramp(t, s0 + 0.7, s0 + 1.8),
    hose: ramp(t, s0 + 0.9, s0 + 1.4),
    canister: ramp(t, s0 + 0.5, s0 + 1.7),
    tube: ramp(t, s0 + 1.2, s0 + 2.3),
    vents: 1 - ramp(t, chip - 0.1, chip + 0.4),
    knob: Math.min(ramp(t, s0 + 1.0, s0 + 1.8), 1 - ramp(t, scr - 0.05, scr + 0.35)),
    knobAngle: -60 + 110 * ramp(t, s0 + 1.6, scr),
    screen: ramp(t, scr + 0.15, scr + 0.95),
    ui: ramp(t, scr + 0.7, scr + 1.4),
    chip: ramp(t, chip, chip + 0.8),
    traces: ramp(t, chip + 0.4, chip + 1.4),
    gold: [0, 1, 2, 3, 4].map((i) => ramp(t, goldStart + i * step, goldStart + i * step + step * 1.1)),
  };
  const drift = ramp(t, A.start, A.end);
  const lbl1 = 1 - ramp(t, scr - 0.1, scr + 0.3);
  const lbl2 = ramp(t, scr + 0.1, scr + 0.5);
  const label: React.CSSProperties = {
    position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: 0.165 * 1920, textAlign: "center",
    direction: "rtl", fontFamily: FONT, fontWeight: 600, fontSize: 50, color: INK, letterSpacing: 0.5,
  };
  return (
    <AbsoluteFill>
      <Backdrop frame={frame} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 860) scale(${1 + 0.035 * drift}) translate(-540 -860) translate(0 ${-8 * drift})`}>
          <g transform="translate(125 455) scale(1.25)"><Device s={state} /></g>
        </g>
      </svg>
      <div style={{ ...label, opacity: lbl1 * ramp(t, s0 + 0.2, s0 + 0.8), transform: `scale(${0.98 + 0.02 * ramp(t, s0 + 0.2, s0 + 0.8)})` }}>زمان: زرار واحد</div>
      <div style={{ ...label, opacity: lbl2, transform: `scale(${0.98 + 0.02 * lbl2})` }}>دلوقتي: شاشة ومعالج</div>
    </AbsoluteFill>
  );
};
