import { LogApi } from "@/main/shared";
import { extractPathGitData, extractPersonalFolders } from "./extractors";
import { createProject, readProjectByName, readProjectByNameOrPath, updateProject } from "./db";
import { serialisedProjectSchema } from "@/shared/features/projects";

export const projectUpsertRoot = async ({ log }: LogApi) => log(
  `Upserting root projects`,
  async ({ log }) => {
    // Extract the files within the root folder.
    const localProjects = await log(`Extracting`, extractPersonalFolders);
    if (!localProjects) return [];

    // Loop the lot, in comparison to the database.
    const status = await log(`Reviewing folders`, ({ log }) => Promise.all(
      localProjects.map((params) => log(
        `Reviewing ${params.name}`,
        async (logApi) => {
          const record = await logApi.log(
            `Checking database`,
            () => readProjectByNameOrPath(params)
          );
          if (record) {
            logApi.setStatus('information', 'Exists');
            if (record.data.git === undefined) {
              const git = await extractPathGitData(
                record.data.path, logApi
              );
              const updated = await updateProject({ ...record, data: { ...record.data, git } });
              return {
                record: updated,
                status: 'updated'
              };
            }
            return { record, status: 'existing' };
          }
          // If it doesn't exist, create.
          // TODO: If it exists already, update the project record with the
          // latest timestamp.
          const created = await createProject(params, logApi);
          return { record: created, status: 'created' };
        }
      ))
    ));
    return status;
  }
);

export const projectUpdateLocalStatusByName = ({
  name, logApi: { log }
}: { name: string; logApi: LogApi; }) => log(
  `Updating ${name}`,
  async (logApi) => {
    const record = await logApi.log(`Reading`, () => readProjectByName(name));
    if (!record) throw new Error(`No record found for project ${name}`);

    const git = await extractPathGitData(record.data.path, logApi);

    const updated = serialisedProjectSchema.parse({
      ...record, data: { ...record.data, git }
    });

    return logApi.log(`Updating`, () => updateProject(updated));
  }
);
