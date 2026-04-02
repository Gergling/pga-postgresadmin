import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { getReadableEpochMilliseconds } from "../../../../shared/lib/temporal";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { RelativeTime } from "../../../shared/common/components/RelativeTime";
import { GridCellRenderer } from "../../../shared/grid"

type Interaction = JobSearchDbSchema['base']['interactions'];
type CellRenderer = GridCellRenderer<Interaction>;

export const InteractionTimePeriodCellRenderer: CellRenderer = ({ row: { timeperiod: { start } } }) => {
  const {
    readableTime,
    zonedDT,
  } = useMemo(() => getReadableEpochMilliseconds(start), [start]);
  return <>
    <Tooltip title={readableTime}>
      <div>
        <RelativeTime time={zonedDT} />
      </div>
    </Tooltip>
  </>;
};
