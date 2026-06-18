import { Block } from "@/renderer/shared/base";
import { ExplorerWindow } from "@/renderer/features/explorer";
import { useProjectDetail } from "../../context";

export const ProjectDetailExplorer = () => {
  const { project: { path } } = useProjectDetail();
  return <Block>
    <ExplorerWindow path={path} />
  </Block>;
};
