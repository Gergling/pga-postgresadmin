import {
  useMemo,
  useEffect,
  useCallback,
  createElement,
  PropsWithChildren
} from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { contextFactory } from '@gergling/ui-components';
import { useInactivityDebounce } from '../../shared/user-activity';
import {
  useDiaryEntryCreator,
  useDiaryEntryList,
  useDiaryIpc
} from './hooks';
import { getConvergenceSummary } from './utilities';

const store = create<{
  isListFetchingEnabled: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  inputEntryText: string;
  setInputEntryText: (inputEntryText: string) => void;
  isAvailable: boolean;
  setIsAvailable: (isAvailable: boolean) => void;
}>()(persist((set) => ({
  isListFetchingEnabled: false,
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  inputEntryText: '',
  setInputEntryText: (inputEntryText) => set({ inputEntryText }),
  isAvailable: true,
  setIsAvailable: (isAvailable) => set({
    // Drawer input is available
    isAvailable,
    // Listfetching should only be enabled when the diary listing page is open.
    isListFetchingEnabled: !isAvailable
  }),
}), {
  name: 'diary-entry-input-text', // Key in LocalStorage
  // ONLY persist the entry text.
  partialize: (state) => ({ inputEntryText: state.inputEntryText }), 
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const context = contextFactory(({ children }: PropsWithChildren) => {
  const drawer = store();
  const entryInput = {
    text: drawer.inputEntryText,
    setText: drawer.setInputEntryText,
  };
  const {
    aboutToInitiateConvergence,
    commitDiaryEntry,
    ipcStatus,
    rejectDiaryEntry,
    triageTasks,
  } = useDiaryIpc(drawer.isListFetchingEnabled);
  const creation = useDiaryEntryCreator();
  const {
    recentDiaryEntries: diaryEntries,
  } = useDiaryEntryList();

  const {
    canInitiateConvergence,
    shouldInitiateConvergence,
    ...summary
  } = useMemo(() => getConvergenceSummary(diaryEntries), [diaryEntries]);

  const handleConvergence = useCallback(() => {
    triageTasks({ source: 'diary', type: 'committed' })
      .then(console.log)
      .catch(console.error);
  }, [triageTasks]);

  // Trigger A: Inactivity (30s)
  useInactivityDebounce(() => {
    if (!canInitiateConvergence) return;
    handleConvergence();
  }, 60000);

  // Trigger B: Threshold (1000 chars)
  useEffect(() => {
    if (!shouldInitiateConvergence) return;
    handleConvergence();
  }, [handleConvergence, shouldInitiateConvergence]);

  return {
    ...creation,
    ...summary,
    aboutToInitiateConvergence,
    commitDiaryEntry,
    diaryEntries,
    drawer,
    entryInput,
    ipcStatus,
    rejectDiaryEntry,
  };
}, 'diary');

export const useDiary = context.useContextHook;

export const DiaryProvider = (
  { children }: PropsWithChildren
) => createElement(context.Provider, { children });
