import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useState } from "react";
import { getRelativeTimeStringNow } from "../utilities/relative-time";

export const useRelativeTimeString = (
  targetDateTime: Temporal.ZonedDateTime
) => {
  const initialRelativeTime = useMemo(() => getRelativeTimeStringNow(targetDateTime), [targetDateTime]);
  const [relativeTime, setRelativeTime] = useState<string>(initialRelativeTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRelativeTime(getRelativeTimeStringNow(targetDateTime));
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [targetDateTime]);

  return relativeTime;
};
