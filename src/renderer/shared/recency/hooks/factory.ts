import { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";

import { recencyFactory } from "@/shared/features/recency";

export const useRecency = (
  now = Temporal.Now.zonedDateTimeISO()
) => useMemo(() => recencyFactory(now), []);
