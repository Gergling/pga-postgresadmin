import { ExplorerList } from "@/renderer/features/explorer";
import { useProjectDetail } from "../../context";
import { Block } from "@/renderer/shared/base";

export const ProjectDetailExplorer = () => {
  const { project: { path } } = useProjectDetail();
  return <Block>
    <ExplorerList path={path} />
  </Block>;
};
