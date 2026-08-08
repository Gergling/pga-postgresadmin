import { CellRenderer } from "../../../types";

export const TaskSourceCellRenderer: CellRenderer = ({ row: task }) => {
  return <>
    {task.envelope.data.source.type}
  </>;
};
