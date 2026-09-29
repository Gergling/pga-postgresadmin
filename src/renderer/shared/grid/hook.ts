import { DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { useMemo } from "react";
import { getDataGrid } from "./utility";

export const useDataGrid = <T extends GridValidRowModel>(
  ...args: Parameters<typeof getDataGrid<T>>
): DataGridProps<T> => useMemo(() => getDataGrid(...args), [args]);
