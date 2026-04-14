import { UserTasks } from "./Tasks";
import { UserTasksProvider } from "../context";

export const TasksRoot = () => <UserTasksProvider><UserTasks /></UserTasksProvider>;

export default TasksRoot;
