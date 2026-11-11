import { interpolate, Easing } from "remotion";
export const NAVY = "#0E1A2B";
export const INK = "#F2EEE6"; // off-white stroke / text
export const GOLD = "#E8B44C";
export const FONT = "'Cairo', sans-serif";
export const W = 1080, H = 1920;
// safe text area: top 8%, bottom 20%, right 12% are kept free of text
export const SAFE = { left: 0.08 * W, right: W - 0.12 * W, top: 0.08 * H, bottom: H - 0.2 * H };
export const SOFT_SHADOW = "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.35)";
const ease = Easing.bezier(0.33, 0, 0.2, 1);
/** 0..1 ramp between two times (seconds) with a soft ease */
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
/** fade in over [a, a+fi], hold, fade out over [b-fo, b] */
export const window = (t: number, a: number, b: number, fi = 0.4, fo = 0.4) =>
  Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b));
