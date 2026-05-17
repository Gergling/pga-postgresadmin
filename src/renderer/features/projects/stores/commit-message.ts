import { create } from "zustand";

export const commitMessageStore = create<{
  chatActivity: string;
  enableFetchCommitMessage: boolean;
  onCommit: () => void;
  outdated?: boolean;
  setCommitMessageFetched: () => void;
  setFetchingStarted: () => void;
  setProjectHasUpdated: () => void;
  startFetchingCommitMessage: () => void;
}>((set) => ({
  chatActivity: '',
  enableFetchCommitMessage: false,
  onCommit: (outdated?: boolean) => set({ outdated }),
  outdated: false,
  setCommitMessageFetched: () => set({
    chatActivity: '',
    enableFetchCommitMessage: false,
  }),
  setFetchingStarted: () => set({
    enableFetchCommitMessage: false,
  }),
  setProjectHasUpdated: () => set({
    outdated: false,
  }),
  startFetchingCommitMessage: () => set({
    chatActivity: 'Fetching commit message...',
    enableFetchCommitMessage: true,
  }),
}));
