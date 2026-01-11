import { GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { ReactNode } from "react";

export type GridCellRenderer<T extends GridValidRowModel> = (params: GridRenderCellParams<T>) => ReactNode;
