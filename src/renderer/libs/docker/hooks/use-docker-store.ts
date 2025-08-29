import { create } from "zustand";
import { getIpc } from "../../../shared/ipc/util";
import { DockerChecklistStatusViewItem } from "../../../../shared/docker-postgres/types";

type State = {
  checklist: DockerChecklistStatusViewItem[];
  isCompleted: boolean;
  needsServerCredentials: boolean;
};
type Actions = {
  rerun: () => void;
};

type StatusBreakdown = {
  isCompleted: boolean;
  isDone: boolean;
  needsServerCredentials: boolean;
};
const getStatusBreakdown = (
  checklist: DockerChecklistStatusViewItem[]
): StatusBreakdown => {
  const {
    hasFailed,
    needsServerCredentials,
    totalCompleted,
  } = checklist.reduce(
    (
      breakdown,
      { name, status },
    ) => {
      const hasFailed = status === 'no' || breakdown.hasFailed;
      const totalCompleted = status === 'yes' ? 1 : 0;

      if (name === 'container-exists') return {
        ...breakdown,
        hasFailed,
        needsServerCredentials: status === 'no',
        totalCompleted,
      };

      return {
        ...breakdown,
        hasFailed,
        totalCompleted,
      };
    },
    {
      hasFailed: false,
      needsServerCredentials: false,
      totalCompleted: 0,
    } as {
      hasFailed: boolean;
      needsServerCredentials: boolean;
      totalCompleted: number;
    }
  );
  const isCompleted = totalCompleted >= checklist.length;
  const isDone = hasFailed || isCompleted;

  return {
    isCompleted,
    isDone,
    needsServerCredentials,
  };
};

const subscribe = (set: (state: Partial<State>) => void) => {
  const { subscribeToDockerChecklist } = getIpc();
  const removeListener = subscribeToDockerChecklist(({
    checklist
  }) => {
    const {
      isCompleted,
      isDone,
      needsServerCredentials,
    } = getStatusBreakdown(checklist);
  
    set({ checklist, isCompleted, needsServerCredentials });
  
    if (isDone) {
      removeListener();
    }
  });
}

export const useDockerStore = create<State & Actions>((set) => {
  subscribe(set);

  return {
    checklist: [],
    isCompleted: false,
    needsServerCredentials: false,

    rerun: () => subscribe(set),
  };
});
