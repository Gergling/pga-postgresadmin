import {
  TaskImportance,
  TaskMomentum,
  TaskSource,
  TaskVoteBaseNames
} from "../../../../shared/features/user-tasks";

export type ProposedTask = {
  importance: TaskImportance | TaskVoteBaseNames;
  momentum: TaskMomentum | TaskVoteBaseNames;
  reasoning: string;
  summary: string;
  source: {
    id: string;
    type: TaskSource;
  };
};

export type ProposedAnalysisResponse = {
  proposed: ProposedTask[];
};
