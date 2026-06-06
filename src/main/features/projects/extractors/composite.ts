import { FetchItemFunction, FetchListFunction } from "@/shared/lib/typesaurus";
import { Project } from "@/shared/features/projects";
import { extractPersonalFolders, fetchLocalProjectPath } from "./files";
import { fetchProjectStagedFiles } from "./git";
import { transformProjectFromPath } from "../utilities";

export const fetchProjectList: FetchListFunction<void, Project> = async () => {
  const files = await extractPersonalFolders();

  if (!files) throw new Error('No projects found.');

  const projectGitData = await Promise.all(
    files.map(({ path }) => fetchProjectStagedFiles(path))
  );

  const projects = files.map((project, index): Project => ({
    ...project,
    git: projectGitData[index] !== undefined ? projectGitData[index] : false,
  }));

  return projects;
};

export const extractLocalProject: FetchItemFunction<
  string, Project | undefined
> = async (name: string) => {
  try {
    const path = await fetchLocalProjectPath();
  
    if (!path) return;
  
    const project = transformProjectFromPath(path, name);
    const git = await fetchProjectStagedFiles(project.path);
    
    return {
      ...project,
      git,
    };
  } catch (e) {
    console.error(e);
    throw new Error(`Unable to fetch project.`);
  }
};
