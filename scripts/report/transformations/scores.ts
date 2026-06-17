import { getScoringKey, QualityReportScore, qualityReportScoreSchema, QualityReportScoring } from "../schemas";

const reduceQualityReportScoreCell = (
  state: QualityReportScoring, { category, priority, value }: QualityReportScore
): QualityReportScoring => {
  const key = getScoringKey({ category, priority });
  const cell = qualityReportScoreSchema.parse({
    category, priority, value: value + state[key].value
  });
  return { ...state, [key]: cell };
};
const reduceQualityReportScoreMatrix = (
  state: QualityReportScoring, { category, priority, value }: Required<QualityReportScore>
): QualityReportScoring => {
  const visibleActions: QualityReportScore[] = [
    { category, value },
    { value },
  ];
  const actions: QualityReportScore[] = [
    { category, priority, value },
    { priority, value },
    // We don't include muted values in the overviews where priority isn't
    // specified because the overview is meant to represent the mean of the
    // highlights and what is there by default. Only the 'mute' values should be
    // updated.
    ...(priority === 'mute' ? [] : visibleActions),
  ];
  return actions.reduce(
    (matrix, action) => reduceQualityReportScoreCell(matrix, action), state
  );
};
