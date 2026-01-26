import { deepMerge } from "../../../../shared/utilities/object";
import { NeonPlasmaGlow } from "../types";

const defaultNeonPlasmaGlow: NeonPlasmaGlow = {
  halo: { strokeWidth: '8', opacity: '0.5' },
  structure: { strokeWidth: '4' },
  core: { strokeWidth: '2.5' },
  filament: { strokeWidth: '0.8', opacity: '0.9' },
};

const getConfig = <Name extends string>(
  config: Record<Name, NeonPlasmaGlow>
): Record<Name, NeonPlasmaGlow> => Object.keys(config).reduce((acc, key) => {
  const name = key as Name;
  const plasmaGlowConfig = deepMerge<NeonPlasmaGlow>(defaultNeonPlasmaGlow, config[name]);
  return {
    ...acc,
    [name]: plasmaGlowConfig,
  };
}, {} as Record<Name, NeonPlasmaGlow>);

export const NEON_PLASMA_GLOW_CONFIG = getConfig({
  blood: {
    halo: { stroke: '#700000', strokeWidth: '8', opacity: '0.5' },
    structure: { stroke: '#4a0000' },
    core: { stroke: '#ff3300' },
    filament: { stroke: '#ffcc00', opacity: '0.9' },
  },
  gold: {
    halo: { stroke: '#663300', strokeWidth: '9', opacity: '0.6' }, // Deep amber
    structure: { stroke: '#442200', strokeWidth: '4' }, // Bronze
    core: { stroke: '#ff9900', strokeWidth: '2.5' }, // Amber glow
    filament: { stroke: '#FFF5CC', strokeWidth: '0.8', opacity: '1' }, // Cream/white
  },
});
