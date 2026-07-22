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
import { useInactivityDebounce } from '../../shared/events';
import {
  useDiaryEntryCreator,
  useDiaryEntryList,
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
const context = contextFactory((_: PropsWithChildren) => {
  const drawer = store();
  // Left for reference to fix properly later.
  // const {
  //   commitDiaryEntry,
  //   rejectDiaryEntry,
  //   triageTasks,
  // } = useDiaryIpc(drawer.isListFetchingEnabled);

  /**
   * IPC: Extraction and Loading.
   */
  const {
    create,
    ...creation
  } = useDiaryEntryCreator();
  const {
    recentDiaryEntries,
    fetchRecentDiaryEntries,
    ...recentDiaryEntriesList
  } = useDiaryEntryList();
  // TODO: Creation (and updates) need to refetch the list.

  /**
   * Transformation.
   */
  const {
    canInitiateConvergence,
    shouldInitiateConvergence,
    ...summary
  } = useMemo(() => getConvergenceSummary(recentDiaryEntries), [recentDiaryEntries]);

  /**
   * Handlers.
   */
  // const handleConvergence = useCallback(() => {
  //   triageTasks({ source: 'diary', type: 'committed' })
  //     .then(console.log)
  //     .catch(console.error);
  // }, [triageTasks]);
  const handleCreateDiaryEntry = useCallback(() => {
    create(() => fetchRecentDiaryEntries());
  }, [create, fetchRecentDiaryEntries]);

  /**
   * Side Effects.
   */

  /**
   * Diary entries start processing after an inactivity timeout period passes.
   */
  // useInactivityDebounce(() => {
  //   if (!canInitiateConvergence) return;
  //   handleConvergence();
  // }, 60000);

  /**
   * Diary entries start processing once there is a lot of information.
   */
  // useEffect(() => {
  //   if (!shouldInitiateConvergence) return;
  //   handleConvergence();
  // }, [handleConvergence, shouldInitiateConvergence]);

  /**
   * Return.
   */
  return {
    ...creation,
    ...recentDiaryEntriesList,
    ...summary,
    drawer,
    recentDiaryEntries,
    // commitDiaryEntry,
    handleCreateDiaryEntry,
    // rejectDiaryEntry,
  };
}, 'diary');

export const useDiary = context.useContextHook;

export const DiaryProvider = (
  { children }: PropsWithChildren
) => createElement(context.Provider, { children });
