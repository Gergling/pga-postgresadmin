import { Mandatory } from "../../types";
import { COUNCIL_MEMBER_NAMES } from "./config";
import { TASK_IMPORTANCE_RANKS, TASK_MOMENTUM_RANKS, TASK_VOTE_PROPS } from "./constants";
import {
  AtomicVote,
  CouncilMemberNames,
  CouncilMemberVotes,
  TaskImportance,
  TaskMomentum,
  TaskRanksMap,
  TaskVotes,
  UserTask,
  VotePropsName
} from "./types";

const taskRankMap: TaskRanksMap = {
  importance: TASK_IMPORTANCE_RANKS,
  momentum: TASK_MOMENTUM_RANKS,
};

const getVoteRank = (
  voteProp: VotePropsName,
  vote: TaskImportance | TaskMomentum,
): number => {
  const ranks = taskRankMap[voteProp];
  if (!ranks) throw new Error(`Unknown vote property: ${voteProp}`);
  if (!(vote in ranks)) throw new Error(`Unknown vote value for ${voteProp}: ${vote}`);
  return ranks[vote as keyof typeof ranks];
};

// Get the last non-awaiting vote for this task and council member.
// This is only worth calling for tasks which are abstained/awaiting.
// const getGhostVote = (
//   { audit }: UserTask,
//   member: CouncilMemberNames,
//   voteProp: VotePropsName
// ) => {
//   for (const { votes } of audit) {
//     if (!votes) continue;
//     const vote = votes[voteProp][member];
//     if (vote !== 'Awaiting') return vote;
//   }
// };

const atomiseVotes = (
  { votes }: UserTask,
): AtomicVote[] => TASK_VOTE_PROPS.reduce(
  (acc, voteProp) => COUNCIL_MEMBER_NAMES.reduce(
    (acc, member): AtomicVote[] => {
      const value = votes[voteProp][member];
      if (voteProp === 'importance') return [
        ...acc,
        {
          member,
          value: value as TaskImportance,
          voteProp,
        }
      ];

      return [
        ...acc,
        {
          member,
          value: value as TaskMomentum,
          voteProp,
        }
      ];
    },
    acc
  ),
  []
);

const reduceCouncilMemberScores = (
  acc: Record<CouncilMemberNames, CouncilMemberVotes>,
  { member, ...item }: Mandatory<CouncilMemberVotes, 'member'>,
): Record<CouncilMemberNames, CouncilMemberVotes> => ({
  ...acc,
  [member]: {
    ...acc[member],
    member,
    ...item,
  },
});

const getCouncilMemberScores = (
  votes: AtomicVote[],
): CouncilMemberVotes[] => {
  const memberVoteMap = votes.reduce<Record<CouncilMemberNames, CouncilMemberVotes>>(
    (acc, { member, value, voteProp}) => {
      if (value === 'Abstained') return reduceCouncilMemberScores(acc, { abstained: 1, member });
      if (value === 'Awaiting') return reduceCouncilMemberScores(acc, { awaiting: 1, member });

      const rank = getVoteRank(voteProp, value);

      return reduceCouncilMemberScores(acc, { [voteProp]: rank, member });
    },
    {} as Record<CouncilMemberNames, CouncilMemberVotes>
  );
  return COUNCIL_MEMBER_NAMES.map((member) => {
    const memberVotes = memberVoteMap[member];
    const { importance, momentum } = memberVotes;
    if (importance === undefined || momentum === undefined) return memberVotes;

    const mean = (importance + momentum) / 2;
    return {
      ...memberVotes,
      mean,
    };
  });
};

const reduceSum = (sum?: number, value?: number) => {
  if (sum === undefined) return value;
  if (value === undefined) return sum;
  return sum + value;
};

export const reduceTaskVotes = (sum: TaskVotes, item: CouncilMemberVotes) => {
  const importance = reduceSum(sum.importance, item.importance);
  const momentum = reduceSum(sum.momentum, item.momentum);
  const mean = reduceSum(sum.mean, item.mean);
  const abstained: number = sum.abstained + (item.abstained || 0);
  const awaiting: number = sum.awaiting + (item.awaiting || 0);
  return {
    abstained,
    awaiting,
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
  } as TaskVotes
);

export const getVoteScores = (task: UserTask): TaskVotes => {
  const atomicVotes = atomiseVotes(task);
  const councilMemberScores = getCouncilMemberScores(atomicVotes);
  const taskScores = getTaskScores(councilMemberScores);
  return taskScores;
};
