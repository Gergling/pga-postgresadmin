import { Runetator, RunetatorProps } from "../../svg-viewer/components";
import { UiUserTask } from "../types";

type TaskRuneProps = {
  task: UiUserTask<true>;
  rune?: Partial<RunetatorProps>;
};

export const TaskRune = ({
  rune,
  task: { id },
}: TaskRuneProps) => <Runetator color="blood" size={rune?.size || 'small'} seedStr={id} {...rune} />;
