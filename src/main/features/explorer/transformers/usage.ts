import { Temporal } from "@js-temporal/polyfill";
import {
  ExplorerFileRecordAction,
  ExplorerFileRecordProps
} from "@/shared/features/explorer";
import { getRelativeTimeStringNow } from "@/shared/lib/temporal";

export const transformExplorerFileRecordReport = (
  records: ExplorerFileRecordProps[],
  now = Temporal.Now.plainDateTimeISO()
) => {
  const total = records.length;
  const { latest, remaining, status, usage } = records.reduce(
    (report, { action, updated, usage }) => {
      const remaining = action === 'none' ? 0 : 1;
      const latest = Math.max(report.latest, updated);
      const status = {
        ...report.status,
        [action]: (report.status[action] ?? 0) + 1,
      };
      return {
        latest,
        remaining: report.remaining + remaining,
        status,
        usage: report.usage + (usage ?? 0),
      };
    }, {
      latest: 0, remaining: 0, usage: 0, status: {}
    } as {
      latest: number;
      remaining: number;
      usage: number;
      status: Record<string, number>;
    }
  );

  const progress = (total - remaining) / total;
  const lastUpdate = Temporal.Instant.fromEpochMilliseconds(latest)
    .toZonedDateTimeISO('UTC');
  const relativeTime = getRelativeTimeStringNow(lastUpdate, now);

  return {
    usage,
    records: {
      latest: {
        absolute: lastUpdate,
        relative: relativeTime
      },
      progress,
      remaining,
      status,
      total,
    }
  };
};
