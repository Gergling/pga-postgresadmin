import { SvgIconComponent } from "@mui/icons-material";
import { WorkflowEvent, WorkflowState } from "./base";

export type WorkflowEventConfigItem = {
  color: string;
  icon: SvgIconComponent;
  label: string;
};
export type WorkflowEventConfig = Record<WorkflowEvent, WorkflowEventConfigItem>;
export type WorkflowFsm = Partial<Record<WorkflowState, Partial<Record<WorkflowEvent, WorkflowState>>>>;
