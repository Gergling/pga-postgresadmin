import { NEON_PLASMA_GLOW_CONFIG } from "../../config/neon";
import { useUniqueId } from "../../hooks";
import { getPathImportantTasksBody, getPathImportantTasksCrown } from "../../paths/important-tasks";
import { getPlasmaGlowLayers, getSvgFilter } from "../themes/neon";
import { getGeometryGroup } from "../themes/utilities";

export const ImportantTasks = () => {
  const {
    plasmaGlowId,
    lowerGeometryId,
    upperGeometryId,
  } = useUniqueId([
    'plasmaGlowId',
    'lowerGeometryId',
    'upperGeometryId',
  ]);

  const lowerGeometry = getPathImportantTasksBody(100);
  const upperGeometry = getPathImportantTasksCrown(100);

  return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      {getSvgFilter(plasmaGlowId)}
    </defs>

    {getGeometryGroup(upperGeometryId, <path
      d={upperGeometry}
      fill="none" 
    />)}
    {getGeometryGroup(lowerGeometryId, <path
      d={lowerGeometry}
      fill="none" 
    />)}

    {getPlasmaGlowLayers(upperGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG.gold)}
    {getPlasmaGlowLayers(lowerGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG.blood)}
  </svg>;
};
