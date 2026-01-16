import { Temporal } from "@js-temporal/polyfill";
import { useRelativeTimeString } from "../hooks/relative-time";

export const RelativeTime = ({
  time
}: {
  time: Temporal.ZonedDateTime;
}) => {
  const relativeTime = useRelativeTimeString(time);

  return <>{relativeTime}</>;
};
