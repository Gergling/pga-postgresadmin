import z from "zod";
import {
  QualityReportCategory,
  qualityReportCategorySchema,
  QualityReportPriorityType,
  qualityReportPriorityTypeSchema
} from "./base";

export const qualityReportScoreSchema = z.object({
  category: qualityReportCategorySchema.optional(),
  priority: qualityReportPriorityTypeSchema.optional(),
  value: z.number(),
});

export type QualityReportScore = z.infer<typeof qualityReportScoreSchema>;

export const getScoringKey = ({
  category, priority
}: { category?: QualityReportCategory, priority?: QualityReportPriorityType }) => {
  if (category && priority) return `${category}-${priority}`;
  if (category) return category;
  if (priority) return priority;
  return 'overview';
};

const qualityReportScoreMap = new Map<string, QualityReportScore>(
  qualityReportCategorySchema.options.reduce(
    (acc, category) => {
      const combined = qualityReportPriorityTypeSchema.options.reduce(
        (acc, priority): [string, QualityReportScore][] => {
          return [
            ...acc,
            [
              getScoringKey({ category, priority }),
              qualityReportScoreSchema.parse({ category, priority, value: 0 })
            ],
            [
              getScoringKey({ priority }),
              qualityReportScoreSchema.parse({ priority, value: 0 })
            ],
          ];
        }, acc
      );
      return [
        ...acc,
        [
          getScoringKey({ category }),
          qualityReportScoreSchema.parse({ category, value: 0 })
        ],
        ...combined,
      ];
    },
    [[getScoringKey({}), qualityReportScoreSchema.parse({ value: 0 })]]
  )
  // .map(([key, value]) => [key, qualityReportScoreSchema.parse(value)])
)

const qualityReportScoringKeysSchema = z.enum([
  ...qualityReportScoreMap.keys()
]);

// const qualityReportScoringKeyEntries = qualityReportScoringKeysSchema.def.entries;

export const qualityReportScoringSchema = z.record(
  qualityReportScoringKeysSchema, qualityReportScoreSchema
).default(() => Object.fromEntries(qualityReportScoreMap));

export type QualityReportScoring = z.infer<typeof qualityReportScoringSchema>;
