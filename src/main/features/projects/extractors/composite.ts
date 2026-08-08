import { FetchItemFunction, FetchListFunction } from "@/shared/lib/typesaurus";
import { Project } from "@/shared/features/projects";
import { extractPersonalFolders, fetchLocalProjectPath } from "./files";
import { extractPathGitData } from "./git";
import { transformProjectFromPath } from "../utilities";
import { log, LogApi } from "@/main/shared";

export const fetchProjectList: FetchListFunction<LogApi, Project> = (
  { log }: LogApi
) => log(
  `Listing projects`,
  async ({ log, setStatus }) => {
    const files = await log(
      `Extracting local file list`, extractPersonalFolders
    );

    if (!files) throw new Error('No projects found.');

    if (files.length === 0) setStatus('warning', 'No project files found');

    const projectGitData = await log(
      `Extracting project git data for ${files.length} project files`,
      (logApi) => Promise.all(
        files.map(({ path }) => extractPathGitData(path, logApi))
      )
    );

    const projects = files.map((project, index): Project => ({
      ...project,
      git: projectGitData[index] !== undefined ? projectGitData[index] : false,
    }));

    setStatus('information', `${projects.length} projects`);

    return projects;
  }
);

export const extractLocalProject: FetchItemFunction<
  { name: string; logApi: LogApi }, Project | undefined
> = ({ name, logApi: { log } }) => log(`Extracting local project: ${name}`, async (logApi) => {
  try {
    const path = await fetchLocalProjectPath();

    if (!path) return;

    const project = transformProjectFromPath(path, name);
    const git = await extractPathGitData(project.path, logApi);

    return {
      ...project,
      git,
    };
  } catch (e) {
    console.error(e);
    throw new Error(`Unable to fetch project.`);
  }
});
