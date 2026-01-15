import { COUNCIL_MEMBER } from "../config";
import { TASK_VOTE_PROPS } from "../constants";
import {
  AtomicVote,
  AtomicVoteValueSummary,
  CouncilMemberAtomisedVotes,
  CouncilMemberNames,
  CouncilMemberVotes,
  CouncilMemberVoteValue,
  CouncilVotesBase,
} from "../types";
import { getMeanAtomicVoteRank } from "./votes-atomic";

export const createMemberVotes = (): CouncilVotesBase => COUNCIL_MEMBER.reduce(
  (acc, { id }) => ({
    ...acc,
    [id]: 'Awaiting',
  }),
  {} as CouncilVotesBase
);

const getCouncilMemberSummary = (
  summaries: AtomicVoteValueSummary[],
): AtomicVoteValueSummary[] => {
  // If both numeric, we take the mean.
  const allNumeric = summaries.every((atom) => typeof atom === 'number') && summaries.length > 0;
  if (allNumeric) {
    // We return a single mean array value.
    const mean = getMeanAtomicVoteRank(summaries);
    return [mean];
  }

  // If identical, we return either.
  const first = summaries[0];
  if (first !== undefined) {
    const identical = summaries.every((val) => val === first);
    if (identical) return [first];
  }

  // Otherwise, we return both.
  return summaries;
};

export const getCouncilMemberVoteValue = (atomised: CouncilMemberAtomisedVotes): CouncilMemberVoteValue => {
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
