import { DataGridProps, GridValidRowModel } from "@mui/x-data-grid";
import { getDataGrid } from "./utility";
import { useMemo } from "react";

export const useDataGrid = <T extends GridValidRowModel>(
  props?: Partial<DataGridProps<T>>
): DataGridProps<T> => useMemo(() => getDataGrid(props), [props]);
