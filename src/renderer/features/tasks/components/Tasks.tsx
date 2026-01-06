import { useNavigate, useParams } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useStoredView } from "../../../shared/common/hooks/routes";
import { TASK_VIEW_CONFIG, TaskViewConfigName } from "../../../shared/navigation/config/tasks";
import { useUserTasks } from "../hooks/use-tasks";

export const UserTasks = () => {
  const { setStoredView, storedView } = useStoredView<TaskViewConfigName>('tasks', 'proposed');
  const navigate = useNavigate();
  const { view = storedView } = useParams<{ view: TaskViewConfigName }>();
  const handleViewChange = (_: React.SyntheticEvent, view: TaskViewConfigName) => {
    setStoredView(view);
    navigate(view);
  };
  const grid = useUserTasks(view);

  // TODO: Could ultimately do with better navigation, e.g. use breadcrumbs
  // where the parent node has a dropdown with all the child options.
  // So the root "burger" would have the option of home and tasks, while tasks
  // would have all the possible task lists on it.
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={view} onChange={handleViewChange}>
          {TASK_VIEW_CONFIG.map(({ name, Icon }) => <Tab
            key={name}
            icon={<Icon />}
            value={name}
          />)}
        </Tabs>
      </Box>
      <div>
        Table with list of tasks
        <DataGrid
          {...grid}
        />
      </div>
    </div>
  );
};
