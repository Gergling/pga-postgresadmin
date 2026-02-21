import { JobSearchArchetype } from "../../../shared/features/job-search";
import { createSchema } from "../../../shared/lib/typesaurus";

export const jobSearchDb = createSchema<JobSearchArchetype>(['applicationContacts', 'applications', 'interactions']);
