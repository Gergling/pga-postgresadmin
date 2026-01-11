import { DataGrid } from '@mui/x-data-grid';
import { useUserTasks } from '../context';

// TODO: Tabs for this view would be alright in addition to the breadcrumbs.

export const UserTasks = () => {
  const {
    grid,
    message,
    success,
  } = useUserTasks();

  return (
    <div>
      {!success && <div>An error occurred{message ? `: ${message}` : '.'}</div>}
      <DataGrid
        {...grid}
      />
    </div>
  );
};
