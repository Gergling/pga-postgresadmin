import { 
  AutoFixHigh, Circle, Pending, CheckCircle, DeleteSweep 
} from '@mui/icons-material';
import { CellRenderer } from '../types';
import { Chip } from '@mui/material';

const statusConfig = {
  proposed: { label: 'Proposed', color: '#FFC107', icon: AutoFixHigh },
  todo: { label: 'To Do', color: '#2196F3', icon: Circle },
  doing: { label: 'Doing', color: '#E91E63', icon: Pending },
  done: { label: 'Done', color: '#4CAF50', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#607D8B', icon: DeleteSweep },
};

export const TaskStatusCellRenderer: CellRenderer = ({ row }) => {
  const { status, view } = row;
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon style={{ color: config.color, fontSize: '1.1rem' }} />}
      label={config.label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: `${config.color}44`, // 44 is 25% opacity
        color: config.color,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.65rem',
        letterSpacing: '0.05rem',
        // If the task is "Transitioning", we can add a pulse effect
        ...(view === 'transitioning' && {
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.4 },
            '100%': { opacity: 1 },
          },
        }),
      }}
    />
  );
};
