import { Tab, Tabs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useUserTasks } from '../context';

export const UserTasks = () => {
  const {
    currentView,
    grid,
    message,
    success,
    taskViews,
  } = useUserTasks();
  const navigate = useNavigate();
  const handleClickTab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newValue: string
  ) => navigate(newValue);

  return (
    <div>
      <Tabs onChange={handleClickTab} value={currentView?.name}>
        {taskViews.map(({ icon: Icon, path }) => {
          return <Tab key={path} icon={<Icon />} value={path} />;
        })}
      </Tabs>
      {!success && <div>An error occurred{message ? `: ${message}` : '.'}</div>}
      <DataGrid
        {...grid}
      />
    </div>
  );
};
