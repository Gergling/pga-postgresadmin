import { Project, projectGitSchema } from "@/shared/features/projects";
// import { recencyFactory, temporalFrequenciesSerialisationCodec } from "@/shared/features/recency";
import { isGitRepository, LogApi } from "@/main/shared";
import {
  fetchLatestCommitDate,
  fetchStagedFileList,
  streamAllCommitDates
} from "../commands";
import { dateSerialisationCodec, SerialisationDate, serialisationDateNow, serialisationDateSchema } from "@/shared/schema";
import { Temporal } from "@js-temporal/polyfill";

const extractPathGitCommitDates = (
  folderPath: string, { log }: LogApi
): Promise<{
  commitDates: SerialisationDate[];
  earliestCommitDate: SerialisationDate;
}> => log(`Extracting git commit dates for ${folderPath}`, async (logApi) => {
  const now = Temporal.Now.zonedDateTimeISO();
  const data: { dates: Temporal.ZonedDateTime[]; earliest: Temporal.ZonedDateTime } = {
    dates: [],
    earliest: now,
  };
  await streamAllCommitDates(folderPath, (line) => {
    try {
      const serialisedDate = serialisationDateSchema.parse(line);
      const richDate = dateSerialisationCodec.decode(serialisedDate);
      const earliestComparisonResult = Temporal.ZonedDateTime.compare(
        data.earliest, richDate
      );
      data.dates.push(richDate);
      if (earliestComparisonResult === -1) {
        data.earliest = richDate;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, logApi);
  const commitDates = data.dates.map((zdt) => dateSerialisationCodec.encode(zdt));
  const earliestCommitDate = dateSerialisationCodec.encode(data.earliest);
  logApi.setStatus('information', `${commitDates.length} commit dates`);
  return {
    commitDates,
    earliestCommitDate,
  };
}, { showSummaryChildren: true });

export const extractPathGitData = (
  folderPath: string, { log }: LogApi
) => log(
  `Extracting git data for ${folderPath}`, async (logApi): Promise<Project['git']> => {
    const hasRepo = await isGitRepository(folderPath);
    if (!hasRepo) return;

    try {
      const [
        stagedFiles, latestCommitDateExtraction, {
          earliestCommitDate, commitDates
        },
      ] = await Promise.all([
        fetchStagedFileList(folderPath),
        fetchLatestCommitDate(folderPath),
        extractPathGitCommitDates(folderPath, logApi),
      ]);
      const latestCommitDate = serialisationDateSchema
        .parse(latestCommitDateExtraction);
      const lastCheck = serialisationDateNow();
      const gitData = projectGitSchema.parse({
        commitDates,
        earliestCommitDate,
        lastCheck,
        latestCommitDate,
        totalStagedFiles: stagedFiles.length
      });
      return gitData;
    } catch (e) {
      return;
    }
  }
);
