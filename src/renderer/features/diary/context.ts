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
    // setAboutToInitiateConvergence,
    triageTasks,
  } = useDiaryIpc();

  const {
    canInitiateConvergence,
    isConverging,
    progress,
    shouldInitiateConvergence,
  } = useMemo(() => getConvergenceSummary(diaryEntriesSaved), [diaryEntriesSaved]);

  const handleConvergence = useCallback(() => {
    if (!canInitiateConvergence) return;
    console.log('triage triggered')
    // triageTasks({ source: 'diary', type: 'committed' });
  }, [triageTasks]);

  // Trigger A: Inactivity (30s)
  useInactivityDebounce(handleConvergence, 30000);

  // Trigger B: Threshold (1000 chars)
  useEffect(() => {
    if (shouldInitiateConvergence) {
      handleConvergence();
    }
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
