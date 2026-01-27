import { NEON_PLASMA_GLOW_CONFIG, NeonBloodIcon } from "../../config/neon";
import { useSize, useUniqueId } from "../../hooks";
import { getPathImportantTasksBody, getPathImportantTasksCrown } from "../../paths/important-tasks";
import { getPlasmaGlowLayers, getSvgFilter } from "../themes/neon";
import { getGeometryGroup } from "../themes/utilities";

export const ImportantTasks: NeonBloodIcon = ({ size }) => {
  const {
    plasmaGlowId,
    lowerGeometryId,
    upperGeometryId,
  } = useUniqueId([
    'plasmaGlowId',
    'lowerGeometryId',
    'upperGeometryId',
  ]);

  const { translation, ...svgProps } = useSize(size);

  const lowerGeometry = getPathImportantTasksBody(svgProps.width);
  const upperGeometry = getPathImportantTasksCrown(svgProps.width);

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
    <defs>
      {getSvgFilter(plasmaGlowId)}
    </defs>

    {getGeometryGroup(upperGeometryId, translation, <path
      d={upperGeometry}
      fill="none" 
    />)}
    {getGeometryGroup(lowerGeometryId, translation, <path
      d={lowerGeometry}
      fill="none" 
    />)}

    {getPlasmaGlowLayers(upperGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG.gold)}
    {getPlasmaGlowLayers(lowerGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG.blood)}
  </svg>;
};
