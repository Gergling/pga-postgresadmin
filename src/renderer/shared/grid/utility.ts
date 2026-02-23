import { DataGridProps, GridValidRowModel } from "@mui/x-data-grid";

const defaultDataGridProps: DataGridProps = {
  columns: [],
  disableRowSelectionOnClick: true,
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: 10,
      },
    },
  },
  loading: false,
  pageSizeOptions: [],
  rows: [],
  slotProps: {
    loadingOverlay: {
      variant: 'linear-progress',
      noRowsVariant: 'skeleton',
    },
  },
};

export const getDataGrid = <T extends GridValidRowModel>(
  props?: Partial<DataGridProps<T>>
): DataGridProps<T> => ({
  ...defaultDataGridProps,
  ...props,
});
