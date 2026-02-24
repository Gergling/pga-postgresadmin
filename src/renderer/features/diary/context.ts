import { useMemo, PropsWithChildren, useEffect, useCallback } from 'react';
import { contextFactory } from '@gergling/ui-components';
import { useInactivityDebounce } from '../../shared/user-activity';
import { useDiaryIpc } from './hooks';
import { getConvergenceSummary } from './utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const {
  Provider: DiaryProvider,
  useContextHook: useDiary,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} = contextFactory((_: PropsWithChildren) => {
  const drawer = store();
  const entryInput = {
    text: drawer.inputEntryText,
    setText: drawer.setInputEntryText,
  };
  const {
    aboutToInitiateConvergence,
    commitDiaryEntry,
    createDraftDiaryEntry,
    diaryEntries,
    diaryEntriesSaved,
    ipcStatus,
    rejectDiaryEntry,
    triageTasks,
  } = useDiaryIpc(drawer.isListFetchingEnabled);

  const {
    canInitiateConvergence,
    isConverging,
    progress,
    shouldInitiateConvergence,
  } = useMemo(() => getConvergenceSummary(diaryEntriesSaved), [diaryEntriesSaved]);

  const handleConvergence = useCallback(() => {
    triageTasks({ source: 'diary', type: 'committed' })
      .then(console.log)
      .catch(console.error);
  }, [triageTasks]);

  // Trigger A: Inactivity (30s)
  useInactivityDebounce(() => {
    if (!canInitiateConvergence) return;
    handleConvergence();
  }, 30000);

  // Trigger B: Threshold (1000 chars)
  useEffect(() => {
    if (!shouldInitiateConvergence) return;
    handleConvergence();
  }, [handleConvergence, shouldInitiateConvergence]);

  return {
    aboutToInitiateConvergence,
    commitDiaryEntry,
    createDraftDiaryEntry,
    diaryEntries,
    drawer,
    entryInput,
    ipcStatus,
    isConverging,
    progress,
    rejectDiaryEntry,
  };
}, 'diary');
