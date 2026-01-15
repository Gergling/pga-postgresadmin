import { TASK_VOTE_PROPS } from "../constants";
import { CouncilMemberVotes, TaskVotes, TaskVoteSummary, UserTask } from "../types";
import { atomiseVotes, getMeanAtomicVoteRank } from "./votes-atomic";
import { getCouncilMemberScores } from "./votes-council";

const reduceSum = (sum?: number, value?: number) => {
  if (sum === undefined) return value;
  if (value === undefined) return sum;
  return sum + value;
};

export const reduceTaskVotes = (sum: TaskVotes, item: CouncilMemberVotes): TaskVotes => {
  const echoes = TASK_VOTE_PROPS.reduce(
    (acc, voteProp) => item.atomised[voteProp].echo ? acc + 1 : acc,
    sum.echoes,
  );
  const {
    abstained,
    awaiting,
  } = item.summary.values.reduce((acc, item) => {
    if (item === 'A') return { ...acc, abstained: acc.abstained + 1 };
    if (item === '?') return { ...acc, awaiting: acc.awaiting + 1 };
    return acc;
  }, {
    abstained: sum.abstained || 0,
    awaiting: sum.awaiting || 0,
  });
  const importance = reduceSum(sum.importance, item.atomised.importance.rank);
  const momentum = reduceSum(sum.momentum, item.atomised.momentum.rank);
  const mean = reduceSum(sum.mean, getMeanAtomicVoteRank(item.summary.values));
  return {
    abstained,
    awaiting,
    echoes,
    importance,
    momentum,
    mean,
  };
};

const getTaskScores = (
  councilMemberScores: CouncilMemberVotes[]
): TaskVotes => councilMemberScores.reduce(
  reduceTaskVotes,
  {
    abstained: 0,
    awaiting: 0,
    echoes: 0,
  }
);

export const getVoteSummary = (task: UserTask): TaskVoteSummary => {
  const atomic = atomiseVotes(task);
  const council = getCouncilMemberScores(atomic);
  const taskScores = getTaskScores(council.list);
  return {
    atomic,
    council,
    task: taskScores,
  };
};
