import { UserTasks } from "../features/tasks/components/Tasks";
import { UserTasksProvider } from "../features/tasks/context";

export const TasksView = () => <UserTasksProvider><UserTasks /></UserTasksProvider>;

export default TasksView;
