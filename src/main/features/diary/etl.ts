import { cosineSimilarity, extractEmbedding } from "@/shared/lib/huggingface";
import { DiaryEntry, DiaryEntryCore } from "@/shared/features/diary";
import { LogApi } from "@/main/shared";
import { findUnanalysedDiaryEntry, findUnembeddedDiaryEntry, updateDiaryEntry } from "./db";
import { scheduleOperation } from "../system";
import { llmEmotionConfigAwaiting } from "./config";

const runDiaryEmbeddingExtraction = (
  entry: DiaryEntry,
) => async ({ log }: LogApi): Promise<number[]> => {
  if (entry.data.embedding) return entry.data.embedding;

  const embedding = await log(
    `Extracting embedding`,
    () => extractEmbedding(entry.data.text)
  );

  await log('Updating diary entry', () => updateDiaryEntry(entry.serialise({
    embedding: embedding.data
  })));

  return embedding.data;
};

type Params = { logApi: LogApi };

const runDiaryEmbedding = async ({ logApi: { log } }: Params) => {
  const record = await findUnembeddedDiaryEntry();
  if (!record) return;

  const entry = DiaryEntry.from(record);
  await log(
    `Found unembedded diary entry from ${entry.created.toString()}`,
    runDiaryEmbeddingExtraction(entry)
  );
};

const runDiaryAnalysis = async ({ logApi: { log } }: Params) => {
  const record = await findUnanalysedDiaryEntry();
  if (!record) return;

  const entry = DiaryEntry.from(record);
  return log(
    `Found diary entry without analysis from ${entry.created.toString()}`,
    async ({ log }) => {
      const [emotionConfig, entryEmbedding] = await log(`Reading embeddings`, (logApi) => Promise.all([
        llmEmotionConfigAwaiting,
        runDiaryEmbeddingExtraction(entry)(logApi),
      ]));
      const emotional = emotionConfig.reduce((acc, { embedding, emotion }) => {
        const value = cosineSimilarity(entryEmbedding, embedding);
        return {
          ...acc,
          [emotion]: value
        };
      }, {} as Required<DiaryEntryCore>['analysis']['emotional']);

      return log('Updating diary entry', () => updateDiaryEntry(entry.serialise({
        analysis: { emotional }
      })));
    }
  );
};

scheduleOperation({
  event: { repeat: true },
  name: 'Embed diary entries',
  priority: () => 1,
  run: runDiaryEmbedding,
});
scheduleOperation({
  event: { repeat: true },
  name: 'Analyse diary entries',
  priority: () => 1,
  run: runDiaryAnalysis,
});
