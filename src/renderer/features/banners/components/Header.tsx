import { ProgressBar, ProgressBarSegmentProps } from "@/renderer/shared/progress-bar";
import { Temporal } from "@js-temporal/polyfill";
import { Card, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const getNow = () => Temporal.Now.zonedDateTimeISO();

const useCurrentTime = () => {
  const [now, setNow] = useState(getNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getNow())
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty array ensures this effect runs once

  return now;
};

export const HeaderBanner = () => {
  const now = useCurrentTime();

  const bars = useMemo((): ProgressBarSegmentProps[][] => {
    const months = Array.from(
      { length: 12 },
      (_, i): ProgressBarSegmentProps => {
        if (i + 1 < now.month) return { message: '', status: 'red-background' };
        if (i + 1 === now.month) return { message: '', status: 'gold-outline' };
        return { message: '', status: 'red-outline' };
      }
    );
    const days = Array.from(
      { length: now.daysInMonth },
      (_, i): ProgressBarSegmentProps => {
        if (i < now.day) return { message: '', status: 'red-background' };
        if (i === now.day) return { message: '', status: 'gold-outline' };
        return { message: '', status: 'red-outline' };
      }
    );
    const hours = Array.from(
      { length: 24 },
      (_, i): ProgressBarSegmentProps => {
        if (i < now.hour) return { message: '', status: 'red-background' };
        if (i === now.hour) return { message: '', status: 'gold-outline' };
        return { message: '', status: 'red-outline' };
      }
    );
    const minutes = Array.from(
      { length: 60 },
      (_, i): ProgressBarSegmentProps => {
        if (i < now.minute) return { message: '', status: 'red-background' };
        if (i === now.minute) return { message: '', status: 'gold-outline' };
        return { message: '', status: 'red-outline' };
      }
    );
    const seconds = Array.from(
      { length: 60 },
      (_, i): ProgressBarSegmentProps => {
        if (i < now.second) return { message: '', status: 'red-background' };
        if (i === now.second) return { message: '', status: 'gold-outline' };
        return { message: '', status: 'red-outline' };
      }
    );

    return [months, days, hours, minutes, seconds];
  }, [now]);

  return <Card variant="outlined" sx={{ m: 2, p: 1 }}>
    <Stack spacing={1}>
      {bars.map((bar) => <ProgressBar segments={bar} />)}
    </Stack>
  </Card>;
};
