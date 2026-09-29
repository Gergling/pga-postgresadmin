import { DataGridProps, GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { ReactNode } from "react";

export type GridCellRenderer<T extends GridValidRowModel> = (
  params: GridRenderCellParams<T>
) => ReactNode;

type GridMasterDetailRowExtension = {
  isDataGridDetailRow?: boolean;
};
export type GridValidRowModelWithMasterDetail<
  T extends GridValidRowModel
> = T & GridMasterDetailRowExtension;

export type DataGridPropsWithMasterDetail<
  T extends GridValidRowModel
> = DataGridProps<T & GridMasterDetailRowExtension>;
