import React from "react";
import { GOLD } from "../theme";
export const ProgressBar: React.FC<{ frame: number; total: number }> = ({ frame, total }) => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.10)" }}>
    {/* RTL channel: bar grows from the right */}
    <div style={{ position: "absolute", top: 0, right: 0, height: 3, width: `${((frame + 1) / total) * 100}%`, background: GOLD }} />
  </div>
);
