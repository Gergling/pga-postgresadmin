import { getPanelCandidatesFactory, PanelData, PanelDataItem } from "@/renderer/shared/dashboard";
import { useProjects } from "./all";
import { useRecency } from "@/renderer/shared/recency";
import { useMemo } from "react";
import { TemporalFrequencies } from "@/shared/features/recency";

const getGeneralProjectPanelCandidates = getPanelCandidatesFactory({
  name: 'project-general-update-frequency', title: 'General project updates'
});

export const useProjectPanels = (): PanelData => {
  return [];
  const { projects } = useProjects();
  const recency = useRecency();

  const items = useMemo((): PanelDataItem[] => {
    const groupedTemporalFrequencies = (projects ?? []).reduce(
      (acc, { enrichedProject: { data: { git, name } } }) => {
        if (typeof git === 'string') return acc;

        const commitDates: TemporalFrequencies = recency.getTemporalFrequencies(git.commitDates);
        const projectCandidateFactory = getPanelCandidatesFactory({
          name: `project-${name}-update-frequency`,
          title: `${name.toUpperCase()} project updates`,
        });
        const projectCandidates = projectCandidateFactory(commitDates);

        return {
          all: [...acc.all, ...git.commitDates],
          projects: [...acc.projects, ...projectCandidates],
        };
      },
      { all: [], projects: [] }
    );

    const all = getGeneralProjectPanelCandidates(recency.getTemporalFrequencies(groupedTemporalFrequencies.all));

    return [
      ...groupedTemporalFrequencies.projects,
      ...all,
    ];
  }, [projects, recency]);
  // Could have most active project recently.
  // Heatmap of commits per day like on the github site.
  // Sparkline of recency commits.


  // const dates: Temporal.ZonedDateTime[] = [];
  // Four possible sparklines available from this.
  // Pick the highest granularity with the fewest 0 values.
  // No 0 values should maximise the weight.
  // Weight should decrease with granularity.
  return items;
};
