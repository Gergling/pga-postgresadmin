import { batch } from "typesaurus";
import { CreateFunction } from "../../../../shared/lib/typesaurus";
import {
  JobSearchInteractionRecord,
  JobSearchInteractionCreation,
  JobSearchApplicationRecord,
  JobSearchApplicationInteractionRecord,
  JobSearchUpdateTransfer,
  JobSearchInteractionTransfer
} from "../../../../shared/features/job-search";
import { CrudModel, toModel } from "../../../shared/crud";
import { jobSearchDb } from "../schema";
import { summariseApplication, summariseInteraction, toApplicationTransfer, toInteractionTransfer } from "../utilities";

// DRY opportunities:
// * A common operation is to create the ids for the join table and associated relations.
// * Another common operation is to create the record from an id and the creation object.
// * We also commonly create a summary, transfer and model object from the record object.
// * Can we cut the middleman and create the summary, transfer and model from the creation?

type ApplicationModel = CrudModel<JobSearchApplicationRecord>;
type ApplicationInteractionModel = CrudModel<JobSearchApplicationInteractionRecord>;

// This is not a simple CRUD operation.
// This is designed to batch the creation of (potentially multiple) applications against an interaction.
// It doesn't handle corrections, because those are an update to an existing application.
export const createJobSearchInteraction: CreateFunction<
  JobSearchInteractionCreation,
  JobSearchUpdateTransfer
> = async (data) => {
  // Create (potentially multiple) applications and assign them to the relevant interaction.

  // Create the batch queue.
  const queue = batch(jobSearchDb);

  // Base
  const interactionId = await jobSearchDb.interactions.id();
  const applicationIds = await Promise.all(data.applications.map(() => jobSearchDb.applications.id()));
  const applicationInteractionIds = await Promise.all(
    applicationIds.map((applicationId) => jobSearchDb.applicationInteractions.id(`${applicationId}-${interactionId}`))
  );

  // Records and summaries
  const newApplicationRecords: JobSearchApplicationRecord[] = applicationIds.map((applicationId, idx) => ({
    ...data.applications[idx],
    audit: [],
    id: applicationId,
    interactions: [],
  }));
  const newApplicationSummaries = newApplicationRecords.map(summariseApplication);

  const newInteractionRecord: JobSearchInteractionRecord = {
    ...data,
    applications: newApplicationSummaries,
    id: interactionId,
  };

  const newInteractionSummary = summariseInteraction(newInteractionRecord);
  const interactionTransfer: JobSearchInteractionTransfer = toInteractionTransfer(newInteractionRecord);
  const newInteractionModel = toModel(newInteractionRecord);


  const applicationTransfers = applicationIds.map((applicationId, idx) => {
    // Create the join records
    // Create the applications
    // const newApplication = data.applications[idx];
    const applicationInteractionId = applicationInteractionIds[idx];

    const newApplicationRecord = newApplicationRecords[idx];

    const newApplicationModel = toModel<ApplicationModel>(newApplicationRecord);
    const newApplicationSummary = newApplicationSummaries[idx];
    const newApplicationInteractionModel = toModel<ApplicationInteractionModel>({
      application: newApplicationSummary,
      interaction: newInteractionSummary,
    });
    const newApplicationTransfer = toApplicationTransfer(newApplicationRecord);

    queue.applications.set(applicationId, newApplicationModel);
    queue.applicationInteractions.set(applicationInteractionId, newApplicationInteractionModel);

    return newApplicationTransfer;
  });

  queue.interactions.set(interactionId, newInteractionModel);

  await queue();

  return {
    applications: applicationTransfers,
    id: newInteractionRecord['id'],
    interaction: interactionTransfer,
  };
};
