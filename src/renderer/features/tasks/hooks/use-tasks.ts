import { useEffect, useMemo, useState } from 'react';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { UserTask } from '../../../../shared/features/user-tasks';
import { useIpc } from '../../../shared/ipc/hook';
import { TaskViewConfigName } from '../../../shared/navigation/config/tasks';
import { getTaskListFactory, getTaskViewColumns } from '../utilities';
import { useNavigation } from '../../../shared/navigation/hooks';
import { BreadcrumbActiveNavigationItem, UiNavigationConfigItem } from '../../../shared/navigation/types';
import { UiUserTask } from '../types';
import { TASK_VIEW_CONFIG } from '../../../shared/navigation/constants';

const dataGridProps: DataGridProps<UiUserTask> = {
  checkboxSelection: true,
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

type ViewTaskResponse = {
  columns: GridColDef<UiUserTask>[];
  data: UiUserTask[];
  message: string;
  success: boolean;
};

const getViewTasks = (
  incomplete: UserTask[],
  view: BreadcrumbActiveNavigationItem | undefined,
  taskViewNames: string[],
): ViewTaskResponse => {
  const base = { columns: [], data: [], message: '', success: false };
  if (!view) return { ...base, message: 'No view specified' };
  if (!taskViewNames.includes(view.name)) return { ...base, message: `Invalid view: ${view.name} (${view.path}).` };

  const name = view.name as TaskViewConfigName;
  const getTaskList = getTaskListFactory(name);
  const columns = getTaskViewColumns(name);
  const data = getTaskList(incomplete);

  return { ...base, columns, data, success: true };
}

type UseUserTaskResponse = {
  grid: DataGridProps<UiUserTask>;
  message: string;
  success: boolean;
};

const reduceTaskViewNames = (acc: string[], { path }: UiNavigationConfigItem) => {
  if (!path) return acc;
  return [ ...acc, path];
};

export const useUserTasks = (): UseUserTaskResponse => {
  const taskViewNames = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskViewNames, []), []);
  const { readIncompleteTasks } = useIpc();
  const [incomplete, setIncomplete] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(false);
  const { current } = useNavigation();
  const {
    columns,
    data: rows,
    message,
    success,
  } = useMemo(() => getViewTasks(incomplete, current, taskViewNames), [current, incomplete, taskViewNames]);

  useEffect(() => {
    setLoading(true);
    readIncompleteTasks()
      .then(setIncomplete)
      .catch((error) => console.error('Error fetching incomplete tasks:', error))
      .finally(() => setLoading(false));
  }, [readIncompleteTasks, setIncomplete]);

  return {
    grid: {
      ...dataGridProps,
      columns,
      loading,
      rows,
    },
    message,
    success,
  };
};
