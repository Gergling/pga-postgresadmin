import { SummariseFunction } from "@shared/lib/typesaurus";
import {
  JobSearchApplicationRecord,
  JobSearchApplicationSchemaSalary,
  JobSearchApplicationSummary,
  JobSearchApplicationTransfer,
  JobSearchInteractionRecord,
  JobSearchInteractionSummary,
  JobSearchInteractionTransfer
} from "@shared/features/job-search";
import { summarise } from "@main/shared/crud";
import { APPLICATION_SUMMARY_FIELDS } from "../constants";
// import { summarise } from "../../../shared/crud";

const salaryFromRecord = (
  salary: JobSearchApplicationRecord['salary']
): JobSearchApplicationSchemaSalary => {
  if (!salary) return {};
  if (typeof salary === 'number') return {
    min: salary,
    max: salary,
  };
  return salary;
};

export const summariseApplication: SummariseFunction<
  JobSearchApplicationRecord,
  JobSearchApplicationSummary
> = (data) => {
  const salary = salaryFromRecord(data.salary);
  return summarise<JobSearchApplicationSummary>({
    ...data, salary
  }, [...APPLICATION_SUMMARY_FIELDS]);
};

export const summariseInteraction: SummariseFunction<
  JobSearchInteractionRecord,
  JobSearchInteractionSummary
> = ({ timeperiod, ...data}) => summarise<JobSearchInteractionSummary>({
  ...data, time: timeperiod.start
}, ['person', 'time']);

export const toInteractionTransfer = (
  data: JobSearchInteractionRecord
): JobSearchInteractionTransfer => data;

export const toApplicationTransfer = (
  data: JobSearchApplicationRecord
): JobSearchApplicationTransfer => {
  const salary = salaryFromRecord(data.salary);
  return {
    ...data,
    salary,
  };
};  
