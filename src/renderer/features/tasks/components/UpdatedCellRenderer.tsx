import { useMemo } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Tooltip } from "@mui/material";
import { RelativeTime } from "../../../shared/common/components/RelativeTime";
import { CellRenderer } from "../types";

export const useUpdatedCellRenderer = (epochMilliseconds: number) => {
  const zonedDT = useMemo(
    () => {
      const instant = Temporal.Instant.fromEpochMilliseconds(epochMilliseconds);
      return instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());
    },
    [epochMilliseconds]
  );
  const readablePublishedAt = useMemo(
    () => {
      if (!zonedDT) return '';

      const {
        year,
        month,
        day,
        hour,
        minute,
      } = zonedDT;

      return `${hour}:${minute} ${year}-${month}-${day}`;
    },
    [zonedDT]
  );

  return { zonedDT, readablePublishedAt };
};


export const TaskUpdatedCellRenderer: CellRenderer = ({ row: { updated } }) => {
  const {
    readablePublishedAt,
    zonedDT,
  } = useUpdatedCellRenderer(updated);
  return <>
    <Tooltip title={readablePublishedAt}>
      <div>
        <RelativeTime time={zonedDT} />
      </div>
    </Tooltip>
  </>;
};
