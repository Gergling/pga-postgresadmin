export const TEMPORAL_UNIT_PROPS = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds'
] as const;

export const TEMPORAL_UNIT_PROPS_CUSTOM = ['weeks'] as const;
export const TEMPORAL_UNIT_PROPS_EXTENDED = [
  ...TEMPORAL_UNIT_PROPS,
  ...TEMPORAL_UNIT_PROPS_CUSTOM
] as const;
