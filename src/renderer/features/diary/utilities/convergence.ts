import { DiaryEntryUiOptional } from "../types";

export const getConvergenceSummary = (entries: DiaryEntryUiOptional[]) => {
  const { committed, isConverging } = entries.reduce(
    ({ committed, isConverging }, { text, ...props }) => {
      if (!('status' in props)) return { committed, isConverging };
      const { status } = props;
      if (status === 'processing') return { committed, isConverging: true };
      if (status === 'committed') return { committed: [...committed, text], isConverging };
      return { committed, isConverging };
    },
    { committed: [], isConverging: false }
  );
  const charCount = committed.join('').length;
  const progress = Math.min(charCount / 1000, 1);
  const canInitiateConvergence = charCount > 0 && !isConverging;
  const shouldInitiateConvergence = canInitiateConvergence && charCount >= 1000;
  return {
    canInitiateConvergence,
    isConverging,
    progress,
    shouldInitiateConvergence,
  };
};
