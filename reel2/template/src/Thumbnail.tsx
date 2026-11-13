import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";
import { FONT, GOLD, NAVY, SOFT_SHADOW } from "./theme";

/** Cover image for the Short: engineer photo fading into navy, headline in the central band. */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <Img src={staticFile("thumb_bg.jpg")} style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1620 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(0,0,0,0) 55%, rgba(8,14,24,0.45) 100%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(14,26,43,0) 0%, rgba(14,26,43,0) 52%, rgba(14,26,43,0.8) 66%, ${NAVY} 76%)` }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 1235, direction: "rtl", textAlign: "center", fontFamily: FONT }}>
      <div style={{ width: 90, height: 4, background: GOLD, margin: "0 auto 34px", borderRadius: 2 }} />
      <div style={{ fontWeight: 700, fontSize: 96, lineHeight: 1.3, color: "#fff", textShadow: SOFT_SHADOW }}>
        ليه الأجهزة الطبية
        <br />بقت أعقد…
        <br /><span style={{ color: GOLD }}>وعمرها أقصر؟</span>
      </div>
    </div>
  </AbsoluteFill>
);
