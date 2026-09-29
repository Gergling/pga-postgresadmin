import { DataGridProps, GridColSpanFn, GridRowIdGetter, GridValidRowModel } from "@mui/x-data-grid";
import { DataGridPropsWithMasterDetail, GridCellRenderer, GridValidRowModelWithMasterDetail } from "./types";
import { createElement } from "react";

const PAGE_SIZE = 10;

const defaultDataGridProps: DataGridProps = {
  columns: [],
  disableRowSelectionOnClick: true,
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: PAGE_SIZE,
      },
    },
  },
  loading: false,
  pageSizeOptions: [PAGE_SIZE],
  // rows: [],
  slotProps: {
    loadingOverlay: {
      variant: 'linear-progress',
      noRowsVariant: 'skeleton',
    },
  },
};

const masterDetailCellRendererFactory = <
  T extends GridValidRowModelWithMasterDetail<GridValidRowModel>
>(
  detailCellRenderer: GridCellRenderer<T>,
  masterCellRenderer?: GridCellRenderer<T>,
): GridCellRenderer<T> => (props) => {
  const cellRenderer = props.row.isDataGridDetailRow
    ? detailCellRenderer
    : (masterCellRenderer ?? (({ field, row }) => row[field]))
    ;
  return createElement(cellRenderer, props);
}

type MasterDetailConfig<T extends GridValidRowModel> = {
  cellRenderer: GridCellRenderer<T>;
  omitDetail?: (props: T) => boolean;
};

const getDataGridMasterDetail = <T extends GridValidRowModel>(
  props: DataGridProps<T>, masterDetailConfig: MasterDetailConfig<T>
): DataGridPropsWithMasterDetail<T> => {
  // TODO: Will ultimately need to take total colspan from all columns
  // into account.
  const [colDef, ...remainingColumns] = props.columns;
  const colSpan: GridColSpanFn<
    GridValidRowModelWithMasterDetail<T>
  > = (
    _, { isDataGridDetailRow }
  ) => isDataGridDetailRow ? props.columns.length : 1;
  const renderCell = masterDetailCellRendererFactory(
    masterDetailConfig.cellRenderer,
    colDef.renderCell
  );
  const columns = [
    { ...colDef, colSpan, renderCell },
    ...remainingColumns,
  ];
  const getRowId: GridRowIdGetter<GridValidRowModelWithMasterDetail<T>> = (
    params
  ) => [
    props.getRowId ? props.getRowId(params) : params.id,
    params.isDataGridDetailRow ? 'detail' : 'master',
  ].join('-');
  const omitDetail = masterDetailConfig.omitDetail ?? (() => false);
  const rows = props.rows?.reduce((acc, row) => {
    const masterRow = { ...row, isDataGridDetailRow: false };

    if (omitDetail(row)) {
      return [...acc, masterRow];
    }

    const detailRow = { ...row, isDataGridDetailRow: true };

    return [...acc, masterRow, detailRow];
  }, [] as GridValidRowModelWithMasterDetail<T>[]);

  return {
    ...props,
    columns,
    getRowId,
    rows,
  };
};

export const getDataGrid = <T extends GridValidRowModel>(
  props?: Partial<DataGridProps<T>>, options?: {
    // TODO: Function to decide whether the detail row opens.
    masterDetailConfig?: MasterDetailConfig<T>;
  }
): DataGridProps<T> => {
  const baseGridProps: DataGridProps<T> = {
    ...defaultDataGridProps,
    ...props,
  };

  const gridProps: DataGridProps<T> = {
    ...baseGridProps,
    ...options?.masterDetailConfig ? getDataGridMasterDetail(
      baseGridProps, options.masterDetailConfig
    ) : {},
  };

  return gridProps;
}