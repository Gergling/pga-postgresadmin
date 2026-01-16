import {
  Gavel,
  HourglassEmpty,
  MilitaryTech,
  RemoveCircleOutline,
  Speed,
  SvgIconComponent
} from "@mui/icons-material";

import {
  TASK_IMPORTANCE_RANKS_MAXIMUM,
  TASK_IMPORTANCE_RANKS_MINIMUM,
  TASK_MOMENTUM_RANKS_MAXIMUM,
  TASK_MOMENTUM_RANKS_MINIMUM,
  TaskVotes
} from "../../../../shared/features/user-tasks";
import { TaskViewConfigName } from "../../../shared/navigation";

const TOTAL_COUNCILLORS = 1;

type VoteProps = keyof TaskVotes;
export const TASK_SCORE_CONFIG: {
  [K in VoteProps]: {
    icon: SvgIconComponent;
    label: string;
    maximum: number;
    minimum: number;
  };
} = {
  abstained: {
    icon: RemoveCircleOutline,
    label: 'Abstentions',
    maximum: 0,
    minimum: TOTAL_COUNCILLORS,
  },
  awaiting: {
    icon: HourglassEmpty,
    label: 'Awaiting',
    maximum: 0,
    minimum: TOTAL_COUNCILLORS,
  },
  echoes: {
    icon: RemoveCircleOutline,
    label: 'Echoes',
    maximum: TOTAL_COUNCILLORS * 2,
    minimum: 0,
  },
  importance: {
    icon: MilitaryTech,
    label: 'Importance',
    maximum: TASK_IMPORTANCE_RANKS_MAXIMUM,
    minimum: TASK_IMPORTANCE_RANKS_MINIMUM,
  },
  momentum: {
    icon: Speed,
    label: 'Momentum',
    maximum: TASK_MOMENTUM_RANKS_MAXIMUM,
    minimum: TASK_MOMENTUM_RANKS_MINIMUM,
  },
  mean: {
    icon: Gavel,
    label: 'Score',
    maximum: (TASK_IMPORTANCE_RANKS_MAXIMUM + TASK_MOMENTUM_RANKS_MAXIMUM) / 2,
    minimum: (TASK_IMPORTANCE_RANKS_MINIMUM + TASK_MOMENTUM_RANKS_MINIMUM) / 2,
  },
};

export const TASK_VIEW_VOTE_SCORES: {
  [K in TaskViewConfigName]: VoteProps[];
} = {
  abstained: ['abstained', 'mean'],
  awaiting: ['awaiting', 'mean'],
  important: ['importance', 'momentum'],
  quick: ['momentum', 'importance'],
  proposed: ['mean', 'abstained', 'awaiting'],
};

export const TASK_VIEW_COLUMN_SCORE_LABELS = Object.entries(TASK_VIEW_VOTE_SCORES).reduce(
  (acc, [view, [scoreKey]]) => ({
    ...acc,
    [view]: TASK_SCORE_CONFIG[scoreKey].label,
  }),
  {} as { [K in TaskViewConfigName]: string; },
);
