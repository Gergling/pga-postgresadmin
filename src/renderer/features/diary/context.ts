import { useMemo, PropsWithChildren, useEffect, useCallback } from 'react';
import { contextFactory } from '@gergling/ui-components';
import { useInactivityDebounce } from '../../shared/user-activity';
import { useDiaryIpc } from './hooks';
import { getConvergenceSummary } from './utilities';

export const {
  Provider: DiaryProvider,
  useContextHook: useDiary,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} = contextFactory((_: PropsWithChildren) => {
  const {
    aboutToInitiateConvergence,
    commitDiaryEntry,
    createDraftDiaryEntry,
    diaryEntries,
    diaryEntriesSaved,
    ipcStatus,
    rejectDiaryEntry,
    triageTasks,
  } = useDiaryIpc();

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
    ipcStatus,
    isConverging,
    progress,
    rejectDiaryEntry,
  };
}, 'diary');
