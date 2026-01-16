import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useState } from "react";
import { getRelativeTimeString } from "../../../../shared/lib/temporal";

export const getRelativeTimeStringNow = (earlier: Temporal.ZonedDateTime) => {
  const now = Temporal.Now.zonedDateTimeISO();
  const duration = now.since(earlier, { largestUnit: 'years' });
  return getRelativeTimeString(duration);
};

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
