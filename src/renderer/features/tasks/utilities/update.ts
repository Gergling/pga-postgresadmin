import { UserTask } from "../../../../shared/features/user-tasks";
import { UiUserTask } from "../types";

export const getDbUserTask = (task: UiUserTask): UserTask => task;
