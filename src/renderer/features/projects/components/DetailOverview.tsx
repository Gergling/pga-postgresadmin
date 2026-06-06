import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { ProjectStatus } from "./Status";
import { useProjectDetail } from "../context";

const Parenthetical = (
  props: Parameters<typeof ParentheticalContainer>[0]
) => <ParentheticalContainer roundness={0} style={{
  padding: '20px',
  textAlign: 'center',
}}>{props.children}</ParentheticalContainer>

export const ProjectDetailOverview = () => {
  const { project } = useProjectDetail();
  return <Parenthetical>
    <ProjectStatus {...project} />
  </Parenthetical>
};
