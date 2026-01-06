import { TaskImportance, TaskMomentum, TaskVoteBase } from "../../../../shared/features/user-tasks";

export type SuggestedTask = {
  importance: TaskImportance | TaskVoteBase;
  momentum: TaskMomentum | TaskVoteBase;
  reasoning: string;
  summary: string;
};

export type FragmentAnalysisResponse = {
  suggestedTasks: SuggestedTask[];
  // entityUpdate: {
  //   email: string;
  //   sentiment: "positive" | "negative" | "neutral";
  // };
};
