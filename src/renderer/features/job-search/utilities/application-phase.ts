import { APPLICATION_PHASE } from "../../../../shared/features/job-search";

export const getValidPhase = (phase: string) => {
  const validPhase = APPLICATION_PHASE.find(({ name }) => name === phase);
  if (!validPhase) return;
  return validPhase.name;
};
