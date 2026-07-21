import z from "zod";
import { optionsAll, optionsFetch, optionsUpsert } from "@/main/libs/database/options";
import { now, nowUTCMs } from "@/shared/utilities";
import { LogApi } from "@/main/shared/logging";

const undefinedNumberSchema = z.unknown().default(undefined).pipe(z.number().optional());
type UndefinedNumber = z.infer<typeof undefinedNumberSchema>;
const explorerStatusSchema = z.enum([
  'ready', 'running', 'error'
]).default('ready');
const group = 'explorer';
const name = 'status';
type ExplorerStatus = z.infer<typeof explorerStatusSchema>;

export const readExplorerStatus = async ({
  log
}: LogApi): Promise<ExplorerStatus> => {
  const explorerState = await log(
    'Fetching explorer state', () => optionsFetch(group, name)
  );
  if (explorerState) {
    const value = await log(
      'Handling explorer state', async ({ setMessage }) => {
        const value = explorerStatusSchema.parse(explorerState.value);
        if (value === 'running') {
          if (explorerState.updated + 1000 * 60 * 60 < nowUTCMs()) {
            // An hour has passed since last update.
            await updateExplorerStatus('error');
            throw new Error(
              'Explorer has been running for over an hour. Have updated to error status.'
            );
          }
        }
        if (value === 'error') {
          throw new Error('Explorer has exhibited an error status. Check options db.')
        }
        return value;
      }
    );
    return value;
  }
  await log('Updating explorer status to ready', () => updateExplorerStatus('ready'));
  return 'ready';
};

const optionCrudFactory = (name: string) => {
  const read = async () => {
    const result = await optionsFetch(group, name);
    if (!result) return;
    return undefinedNumberSchema.parse(result.value);
  };
  const update = (value: number) => optionsUpsert({ group, name, value });
  return { read, update };
};

export const explorerCapacity = () => optionCrudFactory('capacity');
// export const explorerFileCount = () => optionCrudFactory('fileCount');

// export const readExplorerCapacity = () => optionsFetch(group, 'capacity');
// export const readExplorerFileCount = () => optionsFetch(group, 'fileCount');

export const updateExplorerStatus = async (status: ExplorerStatus) => {
  const value = explorerStatusSchema.parse(status);
  return await optionsUpsert({ group, name, value });
};

