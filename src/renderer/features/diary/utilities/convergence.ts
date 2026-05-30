import { DiaryEntryUi } from "@/shared/features/diary";

export const getConvergenceSummary = (entries: DiaryEntryUi[]) => {
  const { committed, isProcessing } = entries.reduce(
    ({ committed, isProcessing }, { data: { status, text } }) => {
      if (status === 'processing') return { committed, isProcessing: true };
      if (status === 'committed') return {
        committed: [...committed, text],
        isProcessing
      };
      return { committed, isProcessing };
    },
    { committed: [], isProcessing: false } as {
      committed: string[];
      isProcessing: boolean;
    }
  );
  const charCount = committed.join('').length;
  const progress = Math.min(charCount / 1000, 1);
  const canInitiateConvergence = charCount > 0 && !isProcessing;
  const shouldInitiateConvergence = canInitiateConvergence && charCount >= 1000;
  return {
    canInitiateConvergence,
    isProcessing,
    progress,
    shouldInitiateConvergence,
  };
};
