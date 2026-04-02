// I think this is not in use. Possibly check whether it's still useful as a WIP.
import React, { PropsWithChildren, useMemo } from "react";
import { NEON_PLASMA_GLOW_CONFIG, NeonPlasmaGlowConfigNames, SizeName } from "../../config/neon";
import { useSize, useUniqueId } from "../../hooks";
import { getPlasmaGlowLayers, getSvgFilter } from "./neon";
import { getGeometryGroup } from "./utilities";

type NeonBasePropsColor = {
  color?: NeonPlasmaGlowConfigNames; // Default to red.
};

type NeonBasePropsItem = NeonBasePropsColor & {
  geometry: React.ReactNode;
};

type NeonBaseProps = {
  size: SizeName;
} & NeonBasePropsColor & {
  collection?: NeonBasePropsItem[];
} & PropsWithChildren;

export const NeonBase = ({ collection, color, size }: NeonBaseProps) => {
  const {
    plasmaGlowId,
  } = useUniqueId([
    'plasmaGlowId',
  ]);

  // Every item in collection needs a unique id generated for the geometry and for the plasma glow layers.
  // In the long run, we should generate a slightly different plasma glow for small icons, since the glow is too much in some cases
  const { geometries, ids, layers } = useMemo(() => {
    if (!collection) return { geometries: [], ids: [], layers: [] };
    return collection.reduce((acc, { geometry, color: itemColor }, idx) => {
      const geometryId = `geometry-${idx}`;
      return {
        geometries: [
          ...acc.geometries,
          {
            geometryId,
            geometry,
          },
        ],
        ids: [
          ...acc.ids,
          geometryId,
        ],
        layers: [
          ...acc.layers,
          {
            geometryId,
            color: itemColor || color || 'blood',
          },
        ],
      };
    }, { geometries: [], ids: [],  layers: [] })
  }, [collection]);
  const idMap = useUniqueId(ids);

  const { translation, ...svgProps } = useSize(size);

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
    <defs>
      {getSvgFilter(plasmaGlowId)}
    </defs>

    {geometries.map(({ geometry, geometryId }) => getGeometryGroup(idMap[geometryId], translation, geometry))}

    {layers.map(({ geometryId, color }) => getPlasmaGlowLayers(idMap[geometryId], plasmaGlowId, NEON_PLASMA_GLOW_CONFIG[color]))}
  </svg>;
};
