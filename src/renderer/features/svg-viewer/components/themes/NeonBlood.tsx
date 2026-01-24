import { PropsWithChildren } from "react";

let uniqueId = 0;

export const SvgNeonBlood = ({ children }: PropsWithChildren) => {
  const id = uniqueId++;
  const plasmaGlowId = `plasma-glow-${id}`;
  const runeGeometryId = `rune-geometry-${id}`;

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <filter id={plasmaGlowId} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="broadBlur" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="tightBlur" />
        <feMerge>
          <feMergeNode in="broadBlur" />
          <feMergeNode in="tightBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g id={runeGeometryId} transform="translate(50, 50)">{children}</g>

    <use href={`#${runeGeometryId}`} stroke="#700000" strokeWidth="8" opacity="0.5" filter={`url(#${plasmaGlowId})`} />

    <use href={`#${runeGeometryId}`} stroke="#4a0000" strokeWidth="4" />

    <use href={`#${runeGeometryId}`} stroke="#ff3300" strokeWidth="2.5" filter={`url(#${plasmaGlowId})`} />

    <use href={`#${runeGeometryId}`} stroke="#ffcc00" strokeWidth="0.8" opacity="0.9" />

  </svg>;
};
