import React from "react";
import tl from "../timeline.json";
import { FONT, GOLD, SAFE, SOFT_SHADOW, ramp } from "../theme";

export const ColdTitle: React.FC<{ t: number }> = ({ t }) => {
  const end = tl.coldEnd;
  if (t > end + 0.05) return null;
  const a = ramp(t, 0.15, 0.75);
  const b = ramp(t, 0.45, 1.05);
  const out = 1 - ramp(t, end - 0.45, end - 0.05);
  const line = (p: number, extra: React.CSSProperties = {}) => ({
    opacity: p * out, transform: `scale(${0.98 + 0.02 * p})`, ...extra,
  });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: a * out,
        background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0) 30%)" }} />
      <div style={{
        position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: 0.092 * 1920,
        direction: "rtl", textAlign: "center", fontFamily: FONT, fontWeight: 700, color: "#fff",
        textShadow: SOFT_SHADOW, lineHeight: 1.4,
      }}>
        <div style={line(a, { fontSize: 60 })}>ليه الأجهزة الطبية بقت أعقد…</div>
        <div style={line(b, { fontSize: 60, color: GOLD })}>وعمرها أقصر؟</div>
      </div>
    </>
  );
};
