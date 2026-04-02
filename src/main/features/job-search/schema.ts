import { JobSearchDbSchema } from "../../../shared/features/job-search";
import { createSchema } from "../../../shared/lib/typesaurus";

export const jobSearchDb = createSchema<JobSearchDbSchema>([
  'applicationInteractions', 'applications', 'interactions'
]);
