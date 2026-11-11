import React from "react";
import tl from "../timeline.json";
import { FONT, GOLD, SAFE, SOFT_SHADOW, ramp } from "../theme";

export const Lifespan: React.FC<{ t: number }> = ({ t }) => {
  const L = tl.lifespan;
  if (t < L.n15 - 0.1 || t > L.end + 0.1) return null;
  const out = 1 - ramp(t, L.end - 0.4, L.end);
  const items: { txt: string; at: number; gold?: boolean; arrow?: boolean }[] = [
    { txt: "١٥ سنة", at: L.n15 },
    { txt: "←", at: L.n7, arrow: true },
    { txt: "٧ سنين", at: L.n7 },
    { txt: "←", at: L.n5, arrow: true },
    { txt: "٥ سنين", at: L.n5, gold: true },
  ];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: ramp(t, L.n15 - 0.1, L.n15 + 0.3) * out,
        background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0) 24%)" }} />
      <div style={{
        position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: 0.095 * 1920, whiteSpace: "nowrap",
        display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 18,
        direction: "rtl", fontFamily: FONT, fontWeight: 600, fontSize: 60, color: "#fff", textShadow: SOFT_SHADOW,
      }}>
        {items.map((it, i) => {
          const p = ramp(t, it.at - 0.04, it.at + 0.3);
          return (
            <span key={i} style={{
              opacity: p * out * (it.arrow ? 0.55 : 1), transform: `scale(${0.98 + 0.02 * p})`,
              color: it.gold ? GOLD : "#fff", fontWeight: it.arrow ? 400 : 600, fontSize: it.arrow ? 40 : 54,
              display: "inline-flex",
            }}>{it.arrow ? (
              <svg width="46" height="22" viewBox="0 0 46 22" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>
                <path d="M42 11 H5 M13 4 L5 11 L13 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : it.txt}</span>
          );
        })}
      </div>
    </>
  );
};
