import { PropsWithChildren } from "react";
import { getPlasmaGlowLayers, getSvgFilter } from "./neon";
import { getGeometryGroup } from "./utilities";
import { NEON_PLASMA_GLOW_CONFIG } from "../../config/neon";
import { useUniqueId } from "../../hooks";

export const SvgNeonBlood = ({ children }: PropsWithChildren) => {
  const {
    plasmaGlowId,
    runeGeometryId,
  } = useUniqueId(['plasmaGlowId', 'runeGeometryId'])

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      {getSvgFilter(plasmaGlowId)}
    </defs>

    {getGeometryGroup(runeGeometryId, children)}

    {getPlasmaGlowLayers(runeGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG.blood)}
  </svg>;
};
