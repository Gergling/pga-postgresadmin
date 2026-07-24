import { Runetator, RunetatorProps } from "../../svg-viewer/components";
import { TaskRich } from "@/shared/features/user-tasks";

type TaskRuneProps = {
  task: TaskRich;
  rune?: Partial<RunetatorProps>;
};

export const TaskRune = ({
  rune,
  task: { id },
}: TaskRuneProps) => <Runetator color="blood" size={rune?.size || 'small'} seedStr={id} {...rune} />;
