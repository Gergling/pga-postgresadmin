import { SvgIconComponent } from "@mui/icons-material";
import { WorkflowEvent } from "./base";
import { TaskWorkflowState } from "../schema";

export type WorkflowEventConfigItem = {
  color: string;
  icon: SvgIconComponent;
  label: string;
};
export type WorkflowEventConfig = Record<WorkflowEvent, WorkflowEventConfigItem>;
export type WorkflowFsm = Partial<Record<TaskWorkflowState, Partial<Record<WorkflowEvent, TaskWorkflowState>>>>;
