type SuggestedTask = {
  title: string;
  importance: number;
  friction: number;
  reasoning: string;
};

export type FragmentAnalysisResponse = {
  suggestedTasks: SuggestedTask[];
  entityUpdate: {
    email: string;
    sentiment: "positive" | "negative" | "neutral";
  };
};
