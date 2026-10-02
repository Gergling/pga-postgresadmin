import { DELTA_CONFIG, DELTA_CONFIG_LIST } from "../config";

export const getDeltaConfig = (
  value: number
) => DELTA_CONFIG_LIST.find(({ fn }) => fn?.(value)) ?? DELTA_CONFIG['0'];
