import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { useQueryDataFactory } from "../../../libs/react-query";

export const useJobSearchApplicationQueryData = () => useQueryDataFactory<JobSearchDbSchema['base']['applications']>('applications');

export const useJobSearchInteractionQueryData = () => useQueryDataFactory<JobSearchDbSchema['base']['interactions']>('interactions');
