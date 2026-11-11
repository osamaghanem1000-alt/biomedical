import React from "react";
import { GOLD, INK } from "../theme";

/** Surgical suction unit in line art. Local box ~ 660 x 600. All progress values 0..1. */
export type DeviceState = {
  body: number; canister: number; hose: number; tube: number; details: number;
  knob: number; knobAngle: number; vents: number;
  screen: number; ui: number; uiOpacity: number;
  chip: number; traces: number; gold: number[];
  glow: number; collapseY: number; collapseX: number; dot: number;
};
export const emptyDevice: DeviceState = {
  body: 0, canister: 0, hose: 0, tube: 0, details: 0, knob: 0, knobAngle: 0, vents: 0,
  screen: 0, ui: 0, uiOpacity: 1, chip: 0, traces: 0, gold: [0, 0, 0, 0, 0], glow: 0, collapseY: 0, collapseX: 0, dot: 0,
};

const S = { fill: "none", stroke: INK, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
/** stroke-draw helper: p = 0 hidden, 1 fully drawn */
const D = (p: number, o = 1): React.SVGProps<SVGPathElement> => ({
  ...S, pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - p, opacity: p > 0 ? o : 0,
});

export const TRACES = [
  "M200 388 V352",
  "M148 428 H72 V300",
  "M148 452 H96 V512",
  "M252 428 H340 V251 H380",
  "M252 452 H318 V512",
];
const TRACE_ENDS: [number, number][] = [[200, 352], [72, 300], [96, 512], [380, 251], [318, 512]];

export const Device: React.FC<{ s: DeviceState }> = ({ s }) => {
  const ticks = Array.from({ length: 7 }, (_, i) => -135 + i * 45);
  return (
    <g>
      {/* body, handle, feet */}
      <rect x={20} y={120} width={360} height={420} rx={30} {...(D(s.body) as any)} />
      <path d="M130 120 V96 Q130 74 152 74 H248 Q270 74 270 96 V120" {...D(s.details)} />
      <path d="M84 540 V564 M316 540 V564" {...D(s.details)} />
      {/* connection to canister */}
      <path d="M380 244 H450 M380 258 H450" {...D(s.hose)} />
      {/* canister + lid + level line */}
      <rect x={450} y={200} width={150} height={300} rx={22} {...(D(s.canister) as any)} />
      <rect x={440} y={178} width={170} height={22} rx={8} {...(D(s.canister) as any)} />
      <path d="M470 392 H580" {...D(s.details, 0.45)} strokeDasharray={s.details >= 1 ? "2 12" : "1 1"} />
      {/* patient tube */}
      <path d="M525 178 C525 96 610 108 628 34 M612 30 L644 38" {...D(s.tube)} />
      {/* vents */}
      <g opacity={s.vents}>
        <path d="M112 432 H288 M112 460 H288 M112 488 H288" {...D(s.details, 0.7)} />
      </g>
      {/* ONE knob */}
      <g opacity={s.knob}>
        <circle cx={200} cy={270} r={62} {...(D(Math.min(1, s.knob * 1.0)) as any)} />
        <g transform={`rotate(${s.knobAngle} 200 270)`}>
          <path d="M200 270 V222" {...S} />
        </g>
        {ticks.map((a) => (
          <path key={a} d="M200 186 V176" {...S} strokeWidth={2.5} opacity={0.6} transform={`rotate(${a} 200 270)`} />
        ))}
      </g>
      {/* screen */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      {s.glow > 0 ? (
        <g transform={`translate(200 270) scale(${1 - 0.98 * s.collapseX} ${1 - 0.985 * s.collapseY}) translate(-200 -270)`} opacity={1 - s.dot}>
          <rect x={104} y={199} width={192} height={142} rx={9} fill={GOLD} opacity={0.35 * s.glow} filter="url(#glow)" />
          <rect x={104} y={199} width={192} height={142} rx={9} fill={GOLD} opacity={0.16 * s.glow} />
          <rect x={104} y={199} width={192} height={142} rx={9} fill="none" stroke={INK} strokeWidth={3} opacity={s.glow * (s.collapseY > 0 ? 1 : 0)} />
        </g>
      ) : null}
      <rect x={100} y={195} width={200} height={150} rx={12} {...(D(s.screen) as any)} />
      <g opacity={s.uiOpacity}>
        <path d="M122 224 H196" {...D(s.ui, 0.9)} />
        <path d="M236 224 H278" {...D(s.ui, 0.5)} />
        <path d="M120 300 H150 L164 270 L180 322 L195 284 L208 300 H280" {...D(s.ui)} />
      </g>
      {/* microprocessor */}
      <g opacity={s.chip > 0 ? 1 : 0}>
        <rect x={160} y={400} width={80} height={80} rx={8} {...(D(s.chip) as any)} />
        <rect x={180} y={420} width={40} height={40} rx={4} {...(D(s.chip, 0.55) as any)} />
        <path d="M176 400 V388 M200 400 V388 M224 400 V388 M176 480 V492 M200 480 V492 M224 480 V492 M160 428 H148 M160 452 H148 M240 428 H252 M240 452 H252"
          {...D(s.chip, 0.8)} />
      </g>
      {/* circuit traces (ink) then lit in gold one after another */}
      {TRACES.map((d, i) => {
        const p = Math.max(0, Math.min(1, s.traces * TRACES.length - i * 0.6));
        const g = s.gold[i] ?? 0;
        const [ex, ey] = TRACE_ENDS[i];
        return (
          <g key={i}>
            <path d={d} {...D(p, 0.55)} />
            <path d={d} {...D(g)} stroke={GOLD} />
            <circle cx={ex} cy={ey} r={5.5} fill={g >= 1 ? GOLD : "none"} stroke={g >= 1 ? GOLD : INK} strokeWidth={2.5} opacity={p >= 1 ? (g >= 1 ? 1 : 0.55) : 0} />
          </g>
        );
      })}
      {/* power-off dot */}
      {s.collapseX > 0 ? <circle cx={200} cy={270} r={6} fill={INK} opacity={(1 - s.dot) * s.collapseX} /> : null}
    </g>
  );
};
