import { useTheme } from "@gergling/ui-components";
import { Check, DeleteForever, Forward, Pause, PlayArrow } from "@mui/icons-material";
import { useMemo } from "react";
import { TASK_FSM, WorkflowEvent, WorkflowEventConfig, WorkflowState } from "../../../../shared/features/user-tasks";

// const purple = '#9c27b0';

// hsl(0, 75%, 33%) might be my brand of red
// #990000

export const useFsm = (status: WorkflowState) => {
  const { theme: { colors, darken }} = useTheme();
  const config: WorkflowEventConfig = useMemo(() => ({
    approve: { label: 'Approve', icon: Forward, color: colors.success.main },
    dismiss: { label: 'Dismiss', icon: DeleteForever, color: darken(colors.error.main, 0.1) },
    finalize: { label: 'Complete', icon: Check, color: colors.success.main },
    pause: { label: 'Pause', icon: Pause, color: colors.info.main },
    start: { label: 'Start', icon: PlayArrow, color: colors.warning.main },
  }), [colors]);
  const { events } = useMemo(() => {
    const next = TASK_FSM[status];
    if (!next) return { events: [] };
  
    const events = Object.entries(next).reduce((events, [event, state]) => {
      const name = event as WorkflowEvent;
      const item = config[name];
      return [
        ...events,
        {
          event: { ...item, name },
          state,
        }
      ];
    }, []);
  
    return { events };
  }, [status, config]);

  return { events };
};
