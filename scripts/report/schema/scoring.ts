import z from "zod";
import { QualityReportCategory, qualityReportCategorySchema, QualityReportPriorityType, qualityReportPriorityTypeSchema } from "./base";

const qualityReportScoreSchema = z.object({
  category: qualityReportCategorySchema.optional(),
  priority: qualityReportPriorityTypeSchema.optional(),
  value: z.number(),
});

const getScoringKey = ({
  category, priority
}: { category?: QualityReportCategory, priority?: QualityReportPriorityType }) => {
  if (category && priority) return `${category}-${priority}`;
  if (category) return category;
  if (priority) return priority;
  return 'overview';
};

const qualityReportScoringKeysSchema = z.enum([
  ...new Set(qualityReportCategorySchema.options.reduce(
    (acc, category) => {
      const combined = qualityReportPriorityTypeSchema.options.reduce(
        (acc, priority) => [
          ...acc,
          getScoringKey({ category, priority }),
          getScoringKey({ priority }),
        ],
        acc
      );
      return [
        ...acc,
        getScoringKey({ category }),
        ...combined,
      ];
    },
    [getScoringKey({})]
  ))
]);

export const qualityReportScoringSchema = z.record(
  qualityReportScoringKeysSchema, qualityReportScoreSchema
);
