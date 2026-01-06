import { TaskVotes, UserTask } from "../../../shared/features/user-tasks";

export type UiUserTask = UserTask & {
  scores: TaskVotes;
};

export type TaskComparisonFunction = (a: UiUserTask, b: UiUserTask) => number;
export type TaskFilterFunction = (task: UiUserTask) => boolean;
export type TaskReducerFunction = (tasks: UiUserTask[], task: UserTask) => UiUserTask[];
