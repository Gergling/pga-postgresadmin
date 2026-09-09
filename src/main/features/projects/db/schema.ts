import { setupLocalNeDb } from "@/main/libs/nedb";
import { LogApi } from "@/main/shared";
import {
  Project,
  SerialisedProject,
  serialisedProjectSchema
} from "@/shared/features/projects";
import { createNewEnvelope } from "@/shared/schema";

const local = setupLocalNeDb<SerialisedProject>('projects');

// TODO: When it comes to firebase backup, what we can do is check for changes based
// on the file name modified date.
// IMO, the best way to handle that is to just plonk the NeDbWrapper in some
// kind of db wrapper function. Then it can review the structure and configure
// the backup/restore schedule accordingly.

// We want to read projects from the local database.
// Simple all/one job.
// We will want to write and update specific projects.

export const readProjects = async (): Promise<SerialisedProject[]> => {
  const records = await local.db.findAsync({});
  return records.map(record => serialisedProjectSchema.parse(record));
}
export const readProjectByNameOrPath = async (
  { name, path }: {
    name: string;
    path: string;
  }
): Promise<SerialisedProject | undefined> => {
  const record = await local.findOne({
    $or: [
      { 'data.name': name },
      { 'data.path': path },
    ],
  });
  if (!record) return;
  return serialisedProjectSchema.parse(record);
}
export const readProjectByName = async (
  name: string
): Promise<SerialisedProject | undefined> => {
  const record = await local.findOne({ 'data.name': name });
  if (!record) return;
  return serialisedProjectSchema.parse(record);
}
export const readProjectById = async (
  id: string
): Promise<SerialisedProject | undefined> => {
  const record = await local.findOne({ id });
  if (!record) return;
  return serialisedProjectSchema.parse(record);
}

export const createProject = (
  data: Project, { log }: LogApi
) => log(`Creating project: ${data.name}`, async () => {
  // Read by name.
  const existing = await readProjectByName(data.name);
  // If exists, throw.
  if (existing) throw new Error(`Project ${data.name} already exists`);

  const record = createNewEnvelope(serialisedProjectSchema, data);

  return local.db.insertAsync(record);
});

export const updateProject = async (envelope: SerialisedProject) => {
  // Read by name.
  const existing = await readProjectById(envelope.id);
  // If not exists, throw.
  if (!existing) throw new Error(`Project id "${envelope.id}" not found`);

  const updated = serialisedProjectSchema.parse({
    ...existing,
    data: envelope.data,
  });
  await local.db.updateAsync({
    id: existing.id
  }, updated);
  return updated;
};
