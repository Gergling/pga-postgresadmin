import { transaction } from "typesaurus";
import { Optional } from "@shared/types";
import { TransferUpdate, UpdateFunction } from "@shared/lib/typesaurus";
import { CrudModel, RecordAudit } from "@main/shared/crud";
import {
  JobSearchApplicationRecord,
  JobSearchApplicationTransfer,
} from "@shared/features/job-search";
import { APPLICATION_SUMMARY_FIELDS } from "../constants";
import { jobSearchDb } from "../schema";
import { summariseApplication } from "../utilities";

type Model = CrudModel<JobSearchApplicationRecord>;
type ModelKey = keyof Model;
type Update = Optional<TransferUpdate<JobSearchApplicationTransfer>, 'id'>;
type Audit = RecordAudit<JobSearchApplicationRecord>;
type SummaryField = typeof APPLICATION_SUMMARY_FIELDS[number];

const getAuditReport = (
  record: Model,
  update: Update,
): {
  // audit: Audit;
  // changedKeys: ModelKey[];
  hasChanges: boolean;
  hasSummaryChanges: boolean;
  // summaryKeys: SummaryField[];
  updatedModel: Model;
} => {
  const keys = Object.keys(update);
  const changedKeys: ModelKey[] = [];
  const summaryKeys: SummaryField[] = [];

  keys.forEach((keyStr) => {
    const key = keyStr as ModelKey;
    const existingValue = record[key];
    const updatedValue = update[key];

    if (existingValue !== updatedValue) {
      const summaryField = key as SummaryField;

      changedKeys.push(key);

      if (APPLICATION_SUMMARY_FIELDS.includes(
        summaryField
      )) {
        summaryKeys.push(summaryField);
      }
    }
  });

  const previous = changedKeys.reduce((acc, key) => ({
    ...acc,
    [key]: record[key as keyof Model],
  }), {} as Audit['previous']);

  const audit: Audit = {
    time: Date.now(),
    previous,
  };

  // TODO: Salary might be changed to be fully undefined or equal numbers, in
  // which case it must be stored as a single number.
  const updatedModel: Model = {
    ...record,
    ...update,
    audit: [audit, ...record.audit],
  };

  return {
    // audit,
    // changedKeys,
    hasChanges: changedKeys.length > 0,
    hasSummaryChanges: summaryKeys.length > 0,
    // summaryKeys,
    updatedModel,
  };
};

// I would need to fetch the audit from the application for this.
// That justifies a trans... whatever it was called rather than a batch.
// Consider whether it's worth doing that or just forming a separate collection.
// Maybe writes *should* be more complex than reads.
// Because we want more reads by a lot.
// So maybe it should just be heavier when doing a write.
// If the summaries are updated, why bother with audits in other files?
// Just put in the time.

/**
 * Application updates can happen because of a status change or a correction to the data.
 * Either way, the related summaries have to be updated.
 * @param application An application transfer type with only the id as mandatory.
 * @returns 
 */
export const updateApplication: UpdateFunction<
  JobSearchApplicationTransfer
> = async (application) => {
  const {
    id,
    ...data
  } = application;

  // RAMBLE:
  // Can probably have a function which takes the appropriate range of id types and applies them correctly.
  // In this case, it will need to update all the joins for applicationInteractions and for interactions, but only if the relevant summary fields change.
  // So that will involve some kind of async "update if" field list, which is a keyof from the summary fields.

  // PREPARE THE DATA
  // Convert the (partial) application transfer type to a (partial) record.
    // This will involve generating the audit object as well, which is basically just the partial schema.
  // Convert the (partial) application record type to a (partial) model (toModel<Partial<JobSearchApplicationRecord>>).
  // Convert the (partial) application record type to a (partial) summary.

  // START A BATCH
  // const queue = batch(jobSearchDb);

  // UPDATE THE APPLICATION
  // Ideally via the batch queue.
  // Put in the id and the model.
  // queue.applications.update(id, model);

  // WE ONLY NEED TO DO THIS IF THE UPDATE AFFECTS THE SUMMARY DATA.
  // UPDATE THE JOINS

  transaction(jobSearchDb)
    .read(($) => $.db.applications.get(id))
    .write(async ($) => {
      const model = $.result?.data;
      if (!model) return;

      // Generate the audit object.
      const {
        // audit,
        // changedKeys,
        hasChanges,
        hasSummaryChanges,
        // summaryKeys,
        updatedModel,
      } = getAuditReport(model, data);

      // If we don't have any changes, there's nothing to change.
      if (!hasChanges) return;

      // Make the relevant changes.
      $.db.applications.update(id, updatedModel);

      // If we don't have summary changes, we don't need to change related
      // documents.
      if (!hasSummaryChanges) return;

      const summary = summariseApplication({ ...updatedModel, id });

      const applicationInteractionDocs = await jobSearchDb
        .applicationInteractions.query(
          ($) => $.field('application', 'id').eq(id)
        );
      
      const interactionIds = applicationInteractionDocs.map(({
        data: { interaction },
        ref: { id }
      }) => {
        $.db.applicationInteractions.update(id, {
          ...data,
          application: summary,
        });
        return interaction.id;
      });

      await jobSearchDb.interactions
        .many(interactionIds)
        .then((interactions) => interactions.forEach((doc) => {
          if (!doc) return;
          const { data: { applications: existingApplications }, ref: { id } } = doc;

          const applications = existingApplications.map(
            (existing) => (existing.id === summary.id ? summary : existing)
          );

          $.db.interactions.update(id, { applications });
        }));
    });

  // UPDATE THE APPLICATION INTERACTIONS JOIN TABLE
  // Convert the application partial transfer to a summary.

  // UPDATE THE INTERACTIONS

  // Note: Updating contacts requires a strategy to sync the list (add new, remove old).
  // For now, this is left as a future implementation detail.

  return application;
};

// export const updateInteraction: UpdateFunction<
//   JobSearchInteractionTransfer
// > = async (interaction) => {
//   const {
//     id,
//     person,
//     ...rest
//   } = interaction;

//   const data: JobSearchDbSchema['modelType']['interactions'] = {
//     ...rest,
//     personId: person?.id,
//   };

//   await jobSearchDb.interactions.update(id, data);

//   return interaction;
// };
