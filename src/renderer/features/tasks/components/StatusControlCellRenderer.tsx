import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { useUserTask } from "../hooks";
import { CellRenderer } from "../types";

// const StatusControlDropdown = ({ actions }: { actions: TaskAction[]; }) => {
//   return <><Dropdown icon={<Menu />} onSelect={} options={} /></>;
// };

export const TaskStatusControlCellRenderer: CellRenderer = ({ row: task }) => {
  const { actions } = useUserTask(task);

  // if (actions.length > 2) return <StatusControlDropdown actions={actions} />;
  return <MenuList dense>{actions.map(({ action, color, icon: Icon, label, name }) => {
    return <MenuItem
      sx={{
        padding: 0,
        minHeight: 'auto', // Removes the 48px touch-target minimum
        '& .MuiMenuItem-root': {
          minHeight: 'auto', // Removes the 48px touch-target minimum
        },
        '& .MuiTypography-root': {
          fontSize: '0.875rem', // Slightly smaller text for the dashboard look
        },
        '& .MuiTouchRipple-root': {
          padding: 0,
        },
      }}
      key={name}
      onClick={action}
    >
      <ListItemIcon><Icon htmlColor={color} /></ListItemIcon>
      <ListItemText primary={label} />
    </MenuItem>;
  })}</MenuList>;
};
