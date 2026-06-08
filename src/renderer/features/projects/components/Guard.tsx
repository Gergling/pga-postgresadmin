import { useParams } from "react-router-dom";
import { ErrorBoundary } from "@/renderer/shared/common";
import { ProjectDetailProvider } from "../context";
import { useProjects } from "../hooks";
import { ProjectDetail } from "./detail";

export const ProjectGuard = () => {
  const { projectName } = useParams();
  const { projects } = useProjects();
  const project = projects?.find((project) => project.name === projectName);

  if (!project) return `There is no project "${projectName}".`;

  return <ErrorBoundary fallback={<>Something bad happened rendering a specific project.</>}>
    {project && <ProjectDetailProvider project={project}>
      <ProjectDetail />
    </ProjectDetailProvider>}
  </ErrorBoundary>
};