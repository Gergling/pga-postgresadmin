import { useMemo } from "react";
import { useDiaryPanels } from "@/renderer/features/diary";
import { useProjectPanels } from "@/renderer/features/projects";

export const useHomePanels = () => {
  const diaryPanels = useDiaryPanels();
  const projectPanels = useProjectPanels();
  const all = useMemo(() => [...diaryPanels, ...projectPanels].sort(
    (panelA, panelB) => panelB.weights.achievement - panelA.weights.achievement
  ), [diaryPanels, projectPanels]);
  const top = all.slice(0, 3);
  return {
    all, top,
  };
};
