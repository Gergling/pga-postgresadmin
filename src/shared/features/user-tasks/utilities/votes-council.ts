import { COUNCIL_MEMBER } from "../config";
import { TASK_VOTE_PROPS } from "../constants";
import {
  AtomicVote,
  AtomicVoteValueSummary,
  CouncilMemberAtomisedVotes,
  CouncilMemberNames,
  CouncilMemberVotes,
  CouncilMemberVoteValue,
} from "../types";

// const createAtomicVoteValue = <T extends VotePropsName>(voteProp: T): AtomicVoteValue<T> => ({
//   echo: false,
//   rank: undefined,
//   summary: '?',
//   voteProp,
// });
// const createAtomised = () => TASK_VOTE_PROPS.reduce(
//   (acc, voteProp) => ({
//     ...acc,
//     [voteProp]: createAtomicVoteValue(voteProp),
//   }),
//   {} as CouncilMemberAtomisedVotes
// );
// const baseCouncilMemberVotes: CouncilMemberVotes = {
//   atomised: createAtomised(),
//   member: 'librarian',
//   summary: {
//     echoes: [],
//     values: [],
//   },
// };

const getCouncilMemberSummary = (
  summaries: AtomicVoteValueSummary[],
): AtomicVoteValueSummary[] => {
  // If both numeric, we take the mean.
  const allNumeric = summaries.every((atom) => typeof atom === 'number');
  if (allNumeric) {
    // We return a single mean array value.
    const sum = summaries.reduce((sum, atom) => typeof atom === 'number' ? sum + atom : sum, 0);
    return [sum / summaries.length];
  }

  // If identical, we return either.
  const first = summaries[0];
  const identical = summaries.every((val) => val === first);
  if (identical) return [first];

  // Otherwise, we return both.
  return summaries;
};

const getCouncilMemberVoteValue = (atomised: CouncilMemberAtomisedVotes): CouncilMemberVoteValue => {
  const {
    summaries,
    echoes
  } = TASK_VOTE_PROPS.reduce(
    ({ echoes, summaries }, voteProp) => {
      const atom = atomised[voteProp];
      const { echo, summary } = atom;
      return {
        summaries: [...summaries, summary],
        echoes: [...echoes, echo],
      };
    },
    {
      echoes: [] as boolean[],
      summaries: [] as AtomicVoteValueSummary[],
    },
  );
  const values = getCouncilMemberSummary(summaries);

  return {
    echoes,
    values,
  };
};

// const reduceCouncilMemberScores = <T extends VotePropsName>(
//   acc: Record<CouncilMemberNames, CouncilMemberVotes>,
//   atom: AtomicVote<T>,
// ): Record<CouncilMemberNames, CouncilMemberVotes> => {
//   const { member, voteProp } = atom;
//   const accVotes = acc[member] || {};
//   const scores: CouncilMemberVotes = {
//     ...baseCouncilMemberVotes,
//     ...accVotes,
//     atomised: {
//       ...baseCouncilMemberVotes.atomised,
//       ...accVotes.atomised,
//       [voteProp]: atom,
//     },
//     member,
//   };
//   return {
//     ...acc,
//     [member]: scores,
//   };
// };

const getAtomisedVotesByCouncilMember = (votes: AtomicVote[]) => votes.reduce(
  (acc, atom) => {
    const { member, voteProp } = atom;
    const existing = acc[member];
    const atomised = existing?.atomised || {} as CouncilMemberAtomisedVotes;

    return {
      ...acc,
      [member]: {
        member,
        atomised: {
          ...atomised,
          [voteProp]: {
            echo: atom.echo,
            rank: atom.rank,
            summary: atom.summary,
            voteProp: atom.voteProp,
          },
        },
      },
    };
  },
  {} as {
    [K in CouncilMemberNames]: Omit<CouncilMemberVotes, 'summary'>
  }
);

type CouncilMemberScores = {
  list: CouncilMemberVotes[];
  map: {
    [K in CouncilMemberNames]: CouncilMemberVotes;
  };
};

export const getCouncilMemberScores = (
  votes: AtomicVote[],
): CouncilMemberScores => {
  const atomisedVotesByCouncilMember = getAtomisedVotesByCouncilMember(votes);
  const map = (Object.keys(atomisedVotesByCouncilMember) as CouncilMemberNames[]).reduce(
    (acc, member) => {
      const base = atomisedVotesByCouncilMember[member];
      const summary = getCouncilMemberVoteValue(base.atomised);
      return {
        ...acc,
        [member]: {
          ...base,
          summary,
        },
      };
    },
    {} as CouncilMemberScores['map']
  );
  const list = COUNCIL_MEMBER.map(({ id }) => map[id]);
  return {
    list,
    map,
  }
};
