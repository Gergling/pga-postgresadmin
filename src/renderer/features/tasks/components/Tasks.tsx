import { DataGrid } from '@mui/x-data-grid';
import { useUserTasks } from "../hooks/use-tasks";

export const UserTasks = () => {
  const {
    grid,
    message,
    success,
  } = useUserTasks();

  return (
    <div>
      {!success && <div>An error occurred{message ? `: ${message}` : '.'}</div>}
      <div>
        Table with list of tasks
        <DataGrid
          {...grid}
        />
      </div>
    </div>
  );
};
