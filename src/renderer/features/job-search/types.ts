import { Temporal } from "@js-temporal/polyfill";
import { Optional } from "../../../shared/types";
import { OptionType } from "../../shared/autocomplete";
import { CrmCompanyOptionType, CrmPersonOptionType } from "../crm";
import {
  JobSearchApplicationTransfer,
  JobSearchDbSchema,
  JobSearchInteractionTransfer,
  JobSearchInteractionType
} from "@shared/features/job-search";
import { WithId } from "@shared/lib/typesaurus";

export type JobSearchOptionType<
  CollectionName extends JobSearchDbSchema['collectionName']
> = OptionType<JobSearchDbSchema['id'][CollectionName]>;

export type JobSearchApplicationOptionType = JobSearchOptionType<'applications'>;

export type JobSearchUpsertableApplication = Optional<JobSearchApplicationTransfer, 'id'>;

type DateTime = {
  numeric: number;
  temporal: Temporal.PlainDateTime;
};

export type JobSearchActivity = 'hot' | 'warm' | 'cold';

export type JobSearchApplicationUi = JobSearchApplicationTransfer & {
  active: boolean; // Calculated from activity truthiness.
  activity?: JobSearchActivity; // Calculated from lastInteractionTime date/time. Applying for the job should count as an interaction.
  chase: boolean; // Whether to chase up for the role.
  due?: DateTime; // Calculated from interview stages: the next one after now. Signifies when the next stage preparation is due to be completed.
  isActionable: boolean; // Whether something can be done about this other than wait.
  lastInteractionTime?: DateTime;
};

type Replace<
  Existing extends object,
  Extension extends object
> = {
  [K in keyof (Existing & Extension)]: K extends keyof Extension
    ? Extension[K]
    : K extends keyof Existing 
      ? Existing[K]
      : never;
};

/**
 * Form types:
 * Null is often better handled by controls than undefined.
 * id and some other props are explicitly omitted
 * Some props are replaced by different types altogether, e.g. OptionType props.
 */
type FormType<
  Transfer extends WithId<string>,
  OmittedKeys extends keyof Transfer = never,
  Replacements extends object = object
> = Replace<
  Omit<Transfer, 'id' | OmittedKeys>,
  Replacements
>;

type PersonOptionType = CrmPersonOptionType | null;
type CompanyOptionType = CrmCompanyOptionType | null;

export type JobSearchUpdateForm = {
  application: FormType<
    JobSearchApplicationTransfer,
    'audit' | 'interactions' | 'offer' | 'sourceType',
    // TODO: These will probably require attention:
    // 'expectedUpdateTime' | 'seniority',
    {
      agency: CompanyOptionType;
      company: CompanyOptionType;
      isListingSourceType: boolean;
      manager: PersonOptionType;
      referral: PersonOptionType;
    }
  >;
  interaction: FormType<
    JobSearchInteractionTransfer,
    'applications',
    {
      due: Date | null;
      person: PersonOptionType;
      source: { type: JobSearchInteractionType; value: string; };
      timeperiod: {
        start: Date | null;
        end: Date | null;
      };
    }
  >;
};
