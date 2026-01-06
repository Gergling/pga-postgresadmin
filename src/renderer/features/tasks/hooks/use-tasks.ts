import { useEffect, useMemo, useState } from 'react';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { UserTask } from '../../../../shared/features/user-tasks';
import { useIpc } from '../../../shared/ipc/hook';
import { TaskViewConfigName } from '../../../shared/navigation/config/tasks';
import { getTaskListFactory, getTaskViewColumns } from '../utilities';

const dataGridProps: DataGridProps = {
  checkboxSelection: true,
  disableRowSelectionOnClick: true,
  initialState: {
    pagination: {
      paginationModel: {
        pageSize: 10,
      },
    },
  },
  pageSizeOptions: [],
  rows: [],
  columns: [],
};

export const useUserTasks = (view: TaskViewConfigName): DataGridProps => {
  const { readIncompleteTasks } = useIpc();
  const [incomplete, setIncomplete] = useState<UserTask[]>([]);
  const getTaskList = useMemo(() => getTaskListFactory(view), [view]);

  const rows = useMemo(() => getTaskList(incomplete), [getTaskList, incomplete]);
  const columns = useMemo<GridColDef[]>(() => getTaskViewColumns(view), [view]);

  useEffect(() => {
    readIncompleteTasks()
      .then(setIncomplete)
      .catch((error) => console.error('Error fetching incomplete tasks:', error));
  }, [readIncompleteTasks, setIncomplete]);

  return {
    ...dataGridProps,
    columns,
    rows,
  };
};
