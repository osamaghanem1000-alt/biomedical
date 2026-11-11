import React from "react";
import tl from "../timeline.json";
import { FONT, GOLD, SAFE, SOFT_SHADOW, ramp } from "../theme";

type Word = { t: string; s: number; e: number };
type Chunk = { start: number; end: number; spk: string; words: Word[] };

export const Captions: React.FC<{ t: number }> = ({ t }) => {
  const c = (tl.captions as Chunk[]).find((c) => t >= c.start && t < c.end);
  if (!c) return null;
  const inP = ramp(t, c.start, c.start + 0.18);
  const outP = ramp(t, c.end - 0.14, c.end);
  const op = Math.min(inP, 1 - outP) * (c.spk === "I" ? 0.85 : 1);
  const scale = 0.98 + 0.02 * inP;
  // active word: spoken now, or the last one spoken (until the next begins)
  let active = -1;
  c.words.forEach((w, i) => { if (t >= w.s - 0.03) active = i; });
  return (
    <div style={{
      position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: 0.66 * 1920,
      transform: `translateY(-50%) scale(${scale})`, opacity: op, direction: "rtl", textAlign: "center",
      fontFamily: FONT, fontWeight: 700, fontSize: 68, lineHeight: 1.45, color: "#fff", textShadow: SOFT_SHADOW,
    }}>
      {c.words.map((w, i) => (
        <span key={i} style={{ color: i === active ? GOLD : "#FFFFFF" }}>{w.t}{i < c.words.length - 1 ? " " : ""}</span>
      ))}
    </div>
  );
};
