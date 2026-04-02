import { Project } from "@shared/features/projects";
import { Runetator, RunetatorProps } from "../../svg-viewer/components";

type ProjectRuneProps = {
  project: Project;
  rune?: Partial<RunetatorProps>;
};

export const ProjectRune = ({
  rune,
  project: { name },
}: ProjectRuneProps) => <Runetator
  color="blood" size={rune?.size || 'small'} seedStr={name} {...rune}
/>;
