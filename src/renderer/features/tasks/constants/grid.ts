import { DataGridProps } from "@mui/x-data-grid";
import { UiUserTask } from "../types";

const PAGE_SIZE = 10;

export const TASK_GRID_PROPS: DataGridProps<UiUserTask> = {
  checkboxSelection: false,
  columns: [],
  disableRowSelectionOnClick: true,
  getRowClassName: ({ row: { view } }) => `task-row--${view}`,
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: PAGE_SIZE,
      },
    },
  },
  loading: false,
  pageSizeOptions: [PAGE_SIZE],
  rows: [],
  slotProps: {
    loadingOverlay: {
      variant: 'linear-progress',
      noRowsVariant: 'skeleton',
    },
  },
  sx: {
    '& .task-row--outdated': {
      opacity: 0.3, // Point 3: Darken significantly
      filter: 'grayscale(0.8)', // Extra visual cue that it "belongs" elsewhere
      pointerEvents: 'none', 
      transition: 'all 0.5s ease',
    },
    '& .task-row--transitioning': {
      opacity: 0.7,
      pointerEvents: 'none', // Point 2: Prevent further interaction
      cursor: 'wait',
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle "busy" highlight
    },
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: 'rgba(119, 0, 0, 0.1)', // Faint Blood Red glow
      },
    },
  },
};
