import { useMemo } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Tooltip } from "@mui/material";
import { RelativeTime } from "@/renderer/shared/common";
import { CellRenderer } from "../../../types";

const useUpdatedCellRenderer = (zonedDT: Temporal.ZonedDateTime) => {
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

export const TaskUpdatedCellRenderer: CellRenderer = ({
  row: { envelope: { audit, created } }
}) => {
  const updated = audit.length > 0 ? audit[0].updated : created;
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
