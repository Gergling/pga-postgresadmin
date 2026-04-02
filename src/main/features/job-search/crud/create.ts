import { batch } from "typesaurus";
import { CreateFunction } from "../../../../shared/lib/typesaurus";
import {
  JobSearchInteractionRecord,
  JobSearchInteractionCreation,
  JobSearchApplicationRecord,
  JobSearchApplicationInteractionRecord,
  JobSearchUpdateTransfer,
  JobSearchInteractionTransfer,
  JobSearchUpdateCreation,
  JobSearchApplicationCreation,
  JobSearchApplicationTransfer,
  JobSearchDbSchema,
  JobSearchInteractionSummary,
  JobSearchApplicationSchema,
  JobSearchInteractionSchema,
  JobSearchApplicationSummary
} from "../../../../shared/features/job-search";
import { CrudModel, toModel } from "../../../shared/crud";
import { jobSearchDb } from "../schema";
import {
  summariseApplication,
  summariseInteraction,
  toApplicationTransfer,
  toInteractionTransfer
} from "../utilities";

// DRY opportunities:
// * A common operation is to create the ids for the join table and associated relations.
// * Another common operation is to create the record from an id and the creation object.
// * We also commonly create a summary, transfer and model object from the record object.
// * Can we cut the middleman and create the summary, transfer and model from the creation?

/**
 * Notes on relationships between record types:
 * There is always an id type between the two relations, which is ideally
 * generated based on the ids of the related types.
 * Naming the relations is a problem, so they should probably be variable.
 * 
 */

type ApplicationModel = CrudModel<JobSearchApplicationRecord>;
type ApplicationInteractionModel = CrudModel<JobSearchApplicationInteractionRecord>;
type JoinId = JobSearchDbSchema['id']['applicationInteractions'];

type JoinRelationship = {
  id: JoinId;
  applicationId: JobSearchApplicationRecord['id'];
  interactionId: JobSearchInteractionRecord['id'];
};

const fetchApplicationInteractionId = (
  applicationId: JobSearchDbSchema['id']['applications'],
  interactionId: JobSearchDbSchema['id']['interactions']
): JoinId => jobSearchDb.applicationInteractions.id(`${applicationId}-${interactionId}`);

const generateJoinedIds = async (data: {
  applications: JobSearchApplicationSchema[],
  interactions: JobSearchInteractionSchema[]
}) => {
  // First generate the ids.
  const applicationIds = await Promise.all(
    data.applications.map(() => jobSearchDb.applications.id())
  );
  const interactionIds = await Promise.all(
    data.interactions.map(() => jobSearchDb.interactions.id())
  );
  return Promise.all(
    applicationIds.reduce((ids, applicationId) => ([
      ...ids,
      ...interactionIds.map((interactionId): JoinRelationship => ({
        applicationId, interactionId,
        id: fetchApplicationInteractionId(
          applicationId, interactionId
        )
      }))
    ]), [])
  );
};

const createApplicationRecord = async (
  data: JobSearchApplicationCreation
): Promise<JobSearchApplicationRecord> => ({
  ...data,
  audit: [],
  id: await jobSearchDb.applications.id(),
  interactions: [],
});

const createInteractionRecord = async (
  data: JobSearchInteractionSchema
): Promise<JobSearchInteractionRecord> => ({
  ...data,
  applications: [],
  id: await jobSearchDb.interactions.id(),
});

const createApplicationInteractionRecord = async (
  application: JobSearchApplicationSummary,
  interaction: JobSearchInteractionSummary,
): Promise<JobSearchApplicationInteractionRecord> => ({
  application,
  interaction,
  id: fetchApplicationInteractionId(application.id, interaction.id),
});

const createJobSearchRelations = async (data: {
  applications: JobSearchApplicationSchema[],
  interactions: JobSearchInteractionSchema[]
}) => {
  // Generate ids (and base records while we're at it).
  // Records have no summaries.
  const base = {
    applications: await Promise.all(
      data.applications.map(createApplicationRecord)
    ),
    interactions: await Promise.all(
      data.interactions.map(createInteractionRecord)
    ),
  };
  const map = {
    applications: new Map(base.applications.map(
      (record) => [record.id, {
        record,
        summary: summariseApplication(record),
      }]
    )),
    interactions: new Map(base.interactions.map(
      (record) => [record.id, {
        record,
        summary: summariseInteraction(record),
      }]
    )),
  };

  // Since we have the records, we can make the summaries
  const applicationInteractionRecords = await Promise.all(
    [...map.applications.values()].reduce((ids, application) => ([
      ...ids,
      [...map.interactions.values()].map(
        (interaction) => createApplicationInteractionRecord(
          application.summary, interaction.summary
        )
      )
    ]), [])
  );

  // We have all the summaries, so we could technically make a 

  // const applications = new Map(applicationBaseRecords.reduce(
  //   (acc, application) => ([
  //     ...acc,
  //     [application.id, application],
  //   ]),
  //   []
  // ));

  // Loop within loop
  // Create application interactions
  // applicationInteractionRecords.forEach(({
  //   application: applicationSummary,
  //   interaction: interactionSummary,
  // }) => {
  //   const applicationRecord = applicationRecordMap.get(applicationSummary.id);
  //   const interactionRecord = interactionRecordMap.get(interactionSummary.id);
  //   if (applicationRecord) {
  //     applicationRecord.interactions.push(interactionSummary);
  //   }
  //   if (interactionRecord) {
  //     interactionRecord.applications.push(applicationSummary);
  //   }
  
  // });
  joinedIds.reduce((acc, applicationId, idx) => {
    const applicationSummary = summariseApplication(applicationRecord);
    return interactionIds.reduce((acc, interactionId, idx) => {
      const interactionRecord: JobSearchInteractionRecord = ({
        ...data.interactions[idx],
        applications: [applicationSummary],
        id: interactionId,
      });
      const interactionSummary = summariseInteraction(interactionRecord);
      // const interactionTransfer = toInteractionTransfer(interactionRecord);
      // const newInteractionModel = toModel(newInteractionRecord);

      const applicationInteractionId = applicationInteractionIds[idx];

      const newApplicationRecord = newApplicationRecords[idx];

      const newApplicationSummary = newApplicationSummaries[idx];
      const newApplicationTransfer = toApplicationTransfer(newApplicationRecord);
      
      return acc;
    }, {
      application: {
        models: [],
        records: [],
        summaries: [],
        transfers: [],
      },
    });
  });


};

export const createJobSearchApplication: CreateFunction<
  JobSearchApplicationCreation,
  JobSearchApplicationTransfer
> = async (data) => {
  // Batch queue
  const queue = batch(jobSearchDb);

  // Base
  const joinedIds = await  generateJoinedIds({
    applications: [data],
    interactions: data.interactions,
  });
  const interactionRecords = await Promise.all(
    data.interactions.map(createInteractionRecord)
  );
  const interactionSummaries = interactionRecords.map(summariseInteraction);
  const applicationRecordBase = await createApplicationRecord(data);
  const applicationInteractionIds = await Promise.all(
    interactionRecords.map(({ id: interactionId }) => fetchApplicationInteractionId(
      applicationRecordBase.id, interactionId
    ))
  );
  
  const applicationTransfer = toInteractionTransfer(newInteractionRecord);
  const newInteractionModel = toModel(newInteractionRecord);
};


// This is not a simple CRUD operation.
// This is designed to batch the creation of (potentially multiple) applications against an interaction.
// It doesn't handle corrections, because those are an update to an existing application.
export const createJobSearchInteraction: CreateFunction<
  JobSearchInteractionCreation,
  JobSearchUpdateTransfer
> = async (data) => {
  console.log('[main] creating interaction', data)
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
