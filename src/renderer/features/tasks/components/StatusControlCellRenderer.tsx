import { CellRenderer } from "../types";
import { StatusControl } from "./StatusControl";

export const TaskStatusControlCellRenderer: CellRenderer = ({ row: task }) => <StatusControl dense task={task} />;
