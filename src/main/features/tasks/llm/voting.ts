import { scheduleOperation } from "@/main/features/system";
import { readIncompleteAwaitingTasks, updateTask } from "../db";
import {
  compareTasksForVoting,
  CouncilMemberNames,
  getVoteRank,
  Task,
  TASK_IMPORTANCE,
  TASK_MEAN_RANKS_MAXIMUM,
  TASK_MOMENTUM,
  taskFactory,
  TaskImportance,
  taskVoteBaseNameSchema,
  VotePropsName,
  VoteResponse,
  voteResponseSchema
} from "@/shared/features/user-tasks";
import { Temporal } from "@js-temporal/polyfill";
import { runLanguageModel } from "../../ai";
import { transformTemplateCompilation } from "@/shared/utilities";
import { getMainPromptFactory, LogApi } from "@/main/shared";
import { getTaskOperationCode } from "./utilities";

// Shared abstraction level


/**
 * We want to find the highest momentum and importance tasks and return the
 * combined importance and momentum as a priority (interpolated by the mean
 * maximum). All of that is already calculated, so we just need to compare.
 * @todo Check whether the vote summary mean is provided a non-undefined
 * value when one value is not provided. If not, we need to use the importance
 * or momentum as fallback values as-is (we won't halve them because a task
 * without a full set of votes still indicates priority).
 * @param acc 
 * @param task 
 */
const reduceHighestPriorityTask = (
  rankingTask: Task | undefined, comparisonTask: Task
) => {
  // If we don't have a rankingTask, just return the comparison.
  if (!rankingTask) return comparisonTask;

  // We grab the vote summary means to make type guarding easier.
  const ranking = rankingTask.voteSummary.task.mean;
  const comparison = comparisonTask.voteSummary.task.mean;

  // If the current comparisonTask vote is Awaiting or Abstained, we just return the existing one.
  if (comparison === undefined) return rankingTask;

  // If the existing comparisonTask vote is Awaiting or Abstained, we return the current
  // one.
  if (ranking === undefined) return comparisonTask;

  // If comparison has a higher score, we use that.
  if (comparison > ranking) return comparisonTask;

  // Otherwise, we stick with the ranking task.
  return rankingTask;
};
// End shared abstraction level.

scheduleOperation('10s', {
  name: 'vote',
  priority: async ({ logApi }) => {
    // Disabling for now to limit log spam.
    // return 0;
    const data = await readIncompleteAwaitingTasks({
      ...logApi, options: {
        showSummary: false
      }
    });

    // If no incomplete tasks awaiting votes, return 0.
    if (data.length === 0) return 0;

    // Find the highest priority task based on the votes so far and get the
    // score.
    const tasks = data.map(record => taskFactory.fromDb(record));
    const highestPriorityTask = tasks.reduce(reduceHighestPriorityTask);
    const highestScore = highestPriorityTask.voteSummary.task.mean;

    // If there are no votes with a score against them (perhaps all awaiting, or
    // abstained) we return the highest priority, since *something* needs to
    // have a vote against it.
    if (highestScore === undefined) return 1;

    // Scale to the maximum.
    return highestScore / TASK_MEAN_RANKS_MAXIMUM;
  },
  // TODO: Requirements. Either need internet or probably green compute if
  // offline.
  run: async ({ logApi }) => {
    logApi.log('Voting stub function. Not implemented yet.');
    // return;
    // Choose a suitable councillor to vote on a suitable task here.
    // Filter tasks by incomplete and awaiting.
    const data = await readIncompleteAwaitingTasks(logApi);

    // Can quit with a warning if we somehow get here and no tasks are eligible
    // If no incomplete tasks awaiting votes, return 0.
    // (async means delay so it could happen, and then why compute further).
    if (data.length === 0) return;

    const tasks = data.map(record => taskFactory.fromDb(record));
    // Compare by total awaiting (descending).
    // Compare by overall score.
    // Compare by councillor opinion order: librarian, guardian, philosopher,
    // architect, strategist, diplomat, sceptic. This essentially means we're
    // comparing whether the vote is "awaiting" for each of these councillors
    // in order.
    // By this point, we have a task where all the votes are awaiting.
    // Compare by created date (ASC).
    // Pick the top one.
    const [votingTask] = tasks.sort(compareTasksForVoting);

    // *Finally*, we run the councillor vote.
    // The vote involves selecting the councillor and the task, in this case,
    // and running accordingly.
    // The councillor will need a little re-computation because we need to check
    // which councillor has the highest priority with awaiting votes.
    // votingTask.voteSummary.council.list.sort()

    // Persistence:
    // updateTask()
  },
});


// const getPromptFactory = <
//   T extends string, 
// >() => (templatePath: string) => {
//   transformTemplateCompilation<T>()
// };

// Shared/prompt: probably just the type with text, response schema if
// applicable, 

// TODO: File path should go into main.
// getPromptFactory<
//   'description' | 'summary' | 'importanceJson' | 'momentumJson'
// >('shared/features/user-tasks/vote-core')

// const getLibrarianTaskVotePrompt = (task: Task) => {
//   const x = [
//     'Please estimate the importance and momentum of this task.',
//     `The task summary is as follows: "${task.data.updated.summary}"`,
//     `The task description is as follows: "${task.data.updated.description}"`,
//     'The importance is based on this criteria:',
//     JSON.stringify(TASK_IMPORTANCE),
//     'The momentum is based on this criteria:',
//     JSON.stringify(TASK_MOMENTUM),
//   ];
// }

// Task-level prompts include voting and using the contents of something like a
// diary entry to extrapolate "I need to do xyz" into tasks.
// These require separate prompt template files, which should be kept on the
// main side because of file-reading.
// Voting prompt needs the md file path, suitable variables, and the output
// schema.
const getLibrarianVotePrompt = getMainPromptFactory<
  'description' | 'summary' | 'importanceJson' | 'momentumJson'
>(import.meta.dirname, '/prompt-vote-core');
const getLibrarianTaskVotePrompt = (task: Task) => getLibrarianVotePrompt({
  description: task.data.updated.description,
  summary: task.data.updated.summary,
  importanceJson: JSON.stringify(TASK_IMPORTANCE),
  momentumJson: JSON.stringify(TASK_MOMENTUM),
});

// voteResponseSchema

const generateTaskVoteResponse = async (
  task: Task,
  { log, setStatus }: LogApi
) => {
  // Get prompt
  // TODO: Might wanna make the councillor variable. We only have the librarian
  // right now, though.
  const councillor = task.nextVoteCouncillor;
  if (!councillor) {
    setStatus('information', 'No councillor was available to vote.');
    return;
  }
  const prompt = getLibrarianTaskVotePrompt(task);
  return log(
    `The ${councillor} is voting on task ${task.id.slice(0, 4)}: "${task.data.updated.summary}"`,
    (logApi) => new Promise<VoteResponse>((resolve, reject) => {
      runLanguageModel<VoteResponse>(prompt, getTaskOperationCode('voting'), logApi, (props) => {
        // Do something with props
        if (
          props.payload.status === 'success'
          && props.type === 'custom'
        ) return resolve(props.payload.response);

        // const emission = { ...props, project };

        // // If it's failed, it won't try again for whatever reason.
        if (props.payload.status === 'failed') return reject(props)

        // // On success, we can still put the commit message in a variable and
        // // return it, awful and messy as it is. It's a question of whether
        // // that's worth doing.

        // emit.next(emission);

        // if (props.payload.status === 'success') emit.complete();
      }, { retryOnStringResponse: true, schema: voteResponseSchema })
    })
  );
};
