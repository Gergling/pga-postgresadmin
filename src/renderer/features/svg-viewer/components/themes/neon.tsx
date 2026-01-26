import { NeonPlasmaGlow } from "../../types";

export const getSvgFilter = (id: string) => <filter
  id={id} x="-100%" y="-100%" width="300%" height="300%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="broadBlur" />
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="tightBlur" />
  <feMerge>
    <feMergeNode in="broadBlur" />
    <feMergeNode in="tightBlur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>;

export const getPlasmaGlowLayers = (
  runeGeometryId: string,
  plasmaGlowId: string,
  {
    halo,
    structure,
    core,
    filament,
  }: NeonPlasmaGlow
) => <>
  <use {...halo} href={`#${runeGeometryId}`} filter={`url(#${plasmaGlowId})`} />
  <use {...structure} href={`#${runeGeometryId}`} />
  <use {...core} href={`#${runeGeometryId}`} filter={`url(#${plasmaGlowId})`} />
  <use {...filament} href={`#${runeGeometryId}`} />
</>;
