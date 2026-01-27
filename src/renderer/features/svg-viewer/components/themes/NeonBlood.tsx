import { PropsWithChildren } from "react";
import { getPlasmaGlowLayers, getSvgFilter } from "./neon";
import { getGeometryGroup } from "./utilities";
import { NEON_PLASMA_GLOW_CONFIG, NeonPlasmaGlowConfigNames, SizeName } from "../../config/neon";
import { useSize, useUniqueId } from "../../hooks";

type SvgNeonProps = PropsWithChildren & {
  color?: NeonPlasmaGlowConfigNames;
  size?: SizeName;
};

export const SvgNeonBlood = ({
  children,
  color = 'blood',
  size = 'large',
}: SvgNeonProps) => {
  const {
    plasmaGlowId,
    runeGeometryId,
  } = useUniqueId(['plasmaGlowId', 'runeGeometryId']);

  const { translation, ...svgProps } = useSize(size);

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
    <defs>
      {getSvgFilter(plasmaGlowId)}
    </defs>

    {getGeometryGroup(runeGeometryId, translation, children)}

    {getPlasmaGlowLayers(runeGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG[color])}
  </svg>;
};
