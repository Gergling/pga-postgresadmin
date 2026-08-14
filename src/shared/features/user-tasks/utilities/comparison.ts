import { comparatorFactory } from "@/shared/utilities";
import { Task } from "./instantiate";
import { VotePropsName } from "../schema";
import { Temporal } from "@js-temporal/polyfill";
import { PRIORITY_COUNCILLOR_VOTING_OPINION_ORDER } from "../constants";

const { create, stack } = comparatorFactory<Task>();

const compareTasksBy = {
  vote: {
    totalAwaitingDesc: create(
      (a, b) => b.voteSummary.task.awaiting - a.voteSummary.task.awaiting
    ),
    meanDesc: create((a, b) => {
      if (a.voteSummary.task.mean === b.voteSummary.task.mean) return 0;
      if (a.voteSummary.task.mean === undefined) return 1;
      if (b.voteSummary.task.mean === undefined) return -1;
      return b.voteSummary.task.mean - a.voteSummary.task.mean;
    }),
    councillorAwaitingDesc: stack(PRIORITY_COUNCILLOR_VOTING_OPINION_ORDER.map(
      (councillor) => {
        const getForProp = (
          task: Task, voteProp: VotePropsName
        ): 0 | 1 => task.voteSummary.council.map[
          councillor
        ].atomised[voteProp].summary === '?' ? 1 : 0;

        const getAQ = (
          task: Task
        ): number => getForProp(task, 'importance') + getForProp(task, 'momentum');

        return (a, b) => getAQ(b) - getAQ(a);
      }
    )),
  },
  createdDateAsc: create((
    a, b
  ) => Temporal.ZonedDateTime.compare(a.envelope.created, b.envelope.created))
};

export const compareTasksForVoting = stack([
  compareTasksBy.vote.totalAwaitingDesc,
  compareTasksBy.vote.meanDesc,
  compareTasksBy.vote.councillorAwaitingDesc,
  compareTasksBy.createdDateAsc,
]);
