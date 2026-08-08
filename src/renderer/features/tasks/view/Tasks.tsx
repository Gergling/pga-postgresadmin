import { Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { NavigationTabs } from '../../../shared/navigation';
import { useUserTasks } from './context';
import { TaskDetail } from './detail/Detail';
import { TaskCreation, TaskDetailProvider, useTaskDetail } from './detail';
import { useParams } from 'react-router-dom';

const Detail = () => {
  const { status, task, taskId } = useTaskDetail();

  if (!task) {
    if (
      status.status === 'mutating' || status.status === 'refetching'
    ) return <Skeleton variant='rectangular' />;
    return <div>Task not found for id: {taskId}.</div>;
  }

  return <TaskDetail task={task} />;
};

const View = () => {
  const { grid, isListView } = useUserTasks();
  const { taskId } = useParams();

  // Display grid for list views.
  if (isListView) return <DataGrid {...grid} />;

  // Display task details for detail views.
  if (taskId) return <TaskDetailProvider taskId={taskId}>
    <Detail />
  </TaskDetailProvider>;

  // Otherwise we can conclude the task has other issues.
  return <TaskCreation />;
};

const Navigate = () => {
  const { taskViews } = useUserTasks();
  const tabs = useMemo(() => taskViews.map(
    ({ icon, path }, value) => ({ icon, path, selected: false, value })),
    [taskViews]
  );

  return <NavigationTabs tabs={tabs} />;
};

export const UserTasks = () => {
  return (
    <div>
      <Navigate />
      <View />
    </div>
  );
};
