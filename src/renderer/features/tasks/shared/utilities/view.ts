import {
  Task,
} from "@/shared/features/user-tasks";
import { TaskFilterFunction, TaskReducerFunction } from "../../types";

const hasAbstainedVotes: TaskFilterFunction = ({ voteSummary }) => voteSummary.task.abstained > 0;
const hasAwaitingVotes: TaskFilterFunction = ({ voteSummary }) => voteSummary.task.awaiting > 0;
const isNotEdgeTask: TaskFilterFunction = ({ view }) => view !== 'edge';
const isNotProposedTask: TaskFilterFunction = ({
  envelope: { data: { status } }
}) => status !== 'proposed';
const isProposedTask: TaskFilterFunction = ({
  envelope: { data: { status } }
}) => status === 'proposed';

const reduceTasksFactory = (
  filter: TaskFilterFunction
): TaskReducerFunction => (
  tasks: Task[],
  baseTask: Task
) => {
    if (isNotEdgeTask(baseTask) || filter(baseTask)) return [...tasks, baseTask];
    return tasks;
  };

export const reduceAbstainedTasks = reduceTasksFactory(hasAbstainedVotes);

// Useful for both "quick" and "important" tasks, which are from the same list,
// but sorted differently in a separate function we don't worry about here.
export const reduceActiveTasks = reduceTasksFactory(isNotProposedTask);

export const reduceAwaitingTasks = reduceTasksFactory(hasAwaitingVotes);

export const reduceProposedTasks = reduceTasksFactory(isProposedTask);
