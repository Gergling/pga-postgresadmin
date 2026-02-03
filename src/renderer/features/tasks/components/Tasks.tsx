import { Skeleton, Tab, Tabs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useUserTasks } from '../context';
import { TaskDetail } from './Detail';

const View = () => {
  const {
    currentTask,
    grid,
    isListView,
    // message,
    // successListView,
    taskIsLoading,
  } = useUserTasks();

  // Catch errors before we do anything else.
  // if (!successListView) return <div>An error occurred{message ? `: ${message}` : '. No error details are provided.'}</div>;

  // Display grid for list views.
  if (isListView) return <DataGrid {...grid} />;

  // Display task details for detail views.
  if (currentTask) return <TaskDetail task={currentTask} />;

  // Display a skeleton when the task is loading.
  if (taskIsLoading) return <Skeleton variant='rectangular' />;

  // Otherwise we can conclude the task has other issues.
  return <>Invalid task.</>
};

const Navigate = () => {
  const {
    activeTab: { colour, name },
    taskViews,
  } = useUserTasks();
  const navigate = useNavigate();
  const handleClickTab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newValue: string
  ) => navigate(newValue);

  return <Tabs textColor={colour} onChange={handleClickTab} value={name} centered>
    {taskViews.map(({ icon: Icon, path }) => {
      return <Tab key={path} icon={<Icon />} value={path} />;
    })}
  </Tabs>;
};

export const UserTasks = () => {
  return (
    <div>
      <Navigate />
      <View />
    </div>
  );
};
