import { TaskVotes } from "../../../../shared/features/user-tasks";
import { TaskComparisonFunction } from "../types";

const compareTasksFactory = (
  prop: keyof TaskVotes
): TaskComparisonFunction => (a, b) => {
  if (b.scores[prop] === a.scores[prop]) return 0;
  if (b.scores[prop] === undefined) return -1;
  if (a.scores[prop] === undefined) return 1;
  return b.scores[prop] - a.scores[prop];
};

// Undefined scores go to the bottom. This means none of the council members
// have been able to choose a rank for the task.
const compareTasksByVoteScore = compareTasksFactory('mean');
const compareTasksByMomentum = compareTasksFactory('momentum');
const compareTasksByImportance = compareTasksFactory('importance');

// * Proposed: All tasks with the "proposed" status, sorted by vote score.
// This is for me to review the data quality around initial task entries. The
// vote score will be only by the librarian. If the librarian can abstain from
// voting, abstentions should go at the top to avoid them being ignored or
// forgotten. This ensures the librarian can identify a task, but if they can't
// guarantee a high quality of momentum or importance vote, I can review it
// myself.
export const compareProposedTasks: TaskComparisonFunction = (a, b) => {
  // The first sort should put the abstentions at the top.
  // Proposed tasks are usually going to have only one vote by the librarian.
  const abstention = b.scores.abstained - a.scores.abstained;
  if (abstention !== 0) return abstention;

  // If the number of abstained council members is equal, the mean voting score should be used.
  const mean = compareTasksByVoteScore(a, b);
  if (mean !== 0) return mean;

  return b.scores.awaiting - a.scores.awaiting;
};

// * Quick: All tasks which aren't "proposed" or already done, sorted "quick".
// This is for when I'm looking for something short I can do.
export const compareQuickTasks: TaskComparisonFunction = (a, b) => {
  const momentum = compareTasksByMomentum(a, b);
  if (momentum !== 0) return momentum;

  return compareTasksByImportance(a, b);
};

// * Important: As quick, except the sort is "important" and this is for when
// I'm ready for some real work.
export const compareImportantTasks: TaskComparisonFunction = (a, b) => {
  const importance = compareTasksByImportance(a, b);
  if (importance !== 0) return importance;

  return compareTasksByMomentum(a, b);
};

// * Abstained: Tasks with abstentions. The largest number of abstentions go at
// the top, with the combined sort being used for the secondary sorting
// criteria when the number of abstentions are equal. This is to review what is
// missing opinions, possibly due to the quality of the task description, and
// why.
export const compareAbstainedTasks: TaskComparisonFunction = (a, b) => {
  const abstention = b.scores.abstained - a.scores.abstained;
  if (abstention !== 0) return abstention;

  return compareTasksByVoteScore(a, b);
};

// * Awaiting: Non-proposed tasks which are awaiting votes. Tasks with the most
// "awaiting" are at the top, followed by a combined sort. Awaiting can happen
// to any task which has been edited recently and the council hasn't voted on
// the importance and momentum yet. This view is to avoid tasks from going
// "missing" for short periods after passing proposal, if the librarian
// underestimated the momentum or importance.
export const compareAwaitingTasks: TaskComparisonFunction = (a, b) => {
  const awaiting = b.scores.awaiting - a.scores.awaiting;
  if (awaiting !== 0) return awaiting;

  return compareTasksByVoteScore(a, b);
};
