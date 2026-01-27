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
  orange: {
    halo: { stroke: '#441100' },
    structure: { stroke: '#662200' },
    core: { stroke: '#ff6600' },
    filament: { stroke: '#ffcc99' },
  },
  gold: {
    halo: { stroke: '#663300', strokeWidth: '9', opacity: '0.6' }, // Deep amber
    structure: { stroke: '#442200', strokeWidth: '4' }, // Bronze
    core: { stroke: '#ff9900', strokeWidth: '2.5' }, // Amber glow
    filament: { stroke: '#FFF5CC', strokeWidth: '0.8', opacity: '1' }, // Cream/white
  },
  green: {
    halo: { stroke: '#003300' },
    structure: { stroke: '#004400' },
    core: { stroke: '#33ff33' },
    filament: { stroke: '#ccffcc' },
  },
  blue: {
    halo: { stroke: '#001a33' },
    structure: { stroke: '#003366' },
    core: { stroke: '#00ccff' },
    filament: { stroke: '#e0ffff' },
  },
  purple: {
    halo: { stroke: '#220033' },
    structure: { stroke: '#330044' },
    core: { stroke: '#cc00ff' },
    filament: { stroke: '#f5e6ff' },
  },
  slate: {
    halo: { stroke: '#1a1c2c' },
    structure: { stroke: '#29366f' },
    core: { stroke: '#3b5998' },
    filament: { stroke: '#d1d9e0' },
  },
});

export const SIZE_CONFIG = {
  large: 100,
  medium: 50,
  small: 24,
};

export type NeonPlasmaGlowConfigNames = keyof typeof NEON_PLASMA_GLOW_CONFIG
export const NEON_PLASMA_GLOW_CONFIG_NAMES = Object.keys(NEON_PLASMA_GLOW_CONFIG) as NeonPlasmaGlowConfigNames[];
export type SizeName = keyof typeof SIZE_CONFIG;
export type NeonBloodIcon = React.FC<{
  color?: NeonPlasmaGlowConfigNames;
  size: SizeName;
}>;

