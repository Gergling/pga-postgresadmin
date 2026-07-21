export const SYSTEM_COMPUTE_COLOR_ORDER = [
  'green', 'yellow', 'amber', 'red', 'grey'
] as const;
export type SystemComputeColor = typeof SYSTEM_COMPUTE_COLOR_ORDER[number];

export type BandConfig = {
  color: SystemComputeColor; minimum: number; maximum: number;
};

const createBandConfig = <
  T extends Record<string, number>
>(config: T): BandConfig[] => {
  const { bands } = Object.entries(config).reduce(
    (acc, [color, maximum]) => ({
      ...acc,
      previous: maximum,
      bands: [
        ...acc.bands,
        { color: color as SystemComputeColor, minimum: acc.previous, maximum }
      ]
    }), { bands: [], previous: 0 } as {
      previous: number;
      bands: BandConfig[];
    }
  );
  return bands;
};

export const SYSTEM_MEMORY_BANDS = createBandConfig({
  green: 0.8, yellow: 0.9, red: 1
});

export const SYSTEM_CPU_BANDS = createBandConfig({
  green: 0.2, yellow: 0.4, red: 1
});
