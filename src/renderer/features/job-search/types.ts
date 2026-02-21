import { Optional } from "../../../shared/types";
import { JobSearchArchetype } from "../../../shared/features/job-search";
import { OptionType } from "../../shared/autocomplete";

export type JobSearchOptionType<
  CollectionName extends JobSearchArchetype['collectionName']
> = OptionType<JobSearchArchetype['id'][CollectionName]>;

export type JobSearchApplicationOptionType = JobSearchOptionType<'applications'>;

export type JobSearchUpsertableApplication = Optional<JobSearchArchetype['base']['applications'], 'id'>;

