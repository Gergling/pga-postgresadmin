import { GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { SchedulerStateManagerSubscriberParams } from "@/shared/features/system";
import { DataGrid, GridCellRenderer, useDataGrid } from "@/renderer/shared/grid";
import { trpcReact } from "@/renderer/libs/react-query";
import { ScheduledOperation, ScheduledOperationTimingKey } from "./types";
import {
  transformSchedulerStateHistoryToOperations
} from "./transformers";

// completed but no current: completed only
// completed AND current: current (completed)
// neither: -
// current but not completed: current only


const timingKeyCellRendererFactory = (
  key: ScheduledOperationTimingKey
): GridCellRenderer<ScheduledOperation> => ({ row }) => {
  const { completed, current } = row[key];
  if (current === undefined) {
    if (completed === undefined) return '-';
    return completed;
  }
  if (completed === undefined) return current;
  return <>{current} <span>({completed})</span></>;
};

const timingColumns = ([
  'queued', 'started', 'completed', 'duration'
] satisfies ScheduledOperationTimingKey[]).map(
  (field): GridColDef<ScheduledOperation> => ({
    field, renderCell: timingKeyCellRendererFactory(field),
  })
);

const schedulerColumns: GridColDef<ScheduledOperation>[] = [
  {
    field: 'description',
    width: 300,
  },
  {
    field: 'status',
  },
  ...timingColumns,
  {
    field: 'failures',
  },
];

export const SystemRoot = () => {
  const { data } = trpcReact.system.telemetry.useSubscription();
  const dataGridProps = useDataGrid({
    columns: schedulerColumns,
    getRowId: ({ description }) => description,
    rows: transformSchedulerStateHistoryToOperations(data?.state.history ?? {}),
  });
  useEffect(() => {
    console.log('system telemetry', data)
  }, [data]);
  return <DataGrid {...dataGridProps} />;
};
