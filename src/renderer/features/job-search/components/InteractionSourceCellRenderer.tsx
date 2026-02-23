import { useMemo } from "react";
import { JOB_SEARCH_INTERACTION_TYPES, JobSearchArchetype } from "../../../../shared/features/job-search";
import { GridCellRenderer } from "../../../shared/grid"
import { AutoAwesome, PanToolAlt, QuestionMark } from "@mui/icons-material";

type Interaction = JobSearchArchetype['base']['interactions'];
type CellRenderer = GridCellRenderer<Interaction>;

export const InteractionSourceCellRenderer: CellRenderer = ({ row: { source } }) => {
  const { EntryIcon, TypeIcon } = useMemo(() => {
    const sourceType = JOB_SEARCH_INTERACTION_TYPES.find(({ name }) => source[name] !== undefined);
    const TypeIcon = sourceType?.icon ?? QuestionMark;
    const EntryIcon = source.entry === 'manual' ? PanToolAlt : AutoAwesome
    return { EntryIcon, TypeIcon };
  }, [source]);
  return <><EntryIcon /><TypeIcon /></>;
};
