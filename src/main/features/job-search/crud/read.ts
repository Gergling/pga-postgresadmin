import {
  FetchItemFunction,
  FetchListFunction,
} from "@shared/lib/typesaurus";
import {
  JobSearchApplicationTransfer,
  JobSearchDbSchema,
  JobSearchInteractionTransfer
} from "@shared/features/job-search";
import { jobSearchDb } from "../schema";
import { toApplicationTransfer, toInteractionTransfer } from "../utilities";

export const fetchApplication: FetchItemFunction<
  JobSearchDbSchema['id']['applications'],
  JobSearchApplicationTransfer
> = async (id) => {
  const application = await jobSearchDb.applications.get(id);
  if (!application) return null;
  return toApplicationTransfer({ ...application.data, id });
};

export const fetchActiveApplications: FetchListFunction<
  void,
  JobSearchApplicationTransfer
> = async () => {
  const applications = await jobSearchDb.applications.query(($) => [
    $.field('phase').notIn(['successful', 'rejected']),
  ]);

  return applications.map(({
    data,
    ref: { id }
  }) => toApplicationTransfer({ ...data, id }));
};

export const fetchInteraction: FetchItemFunction<
  JobSearchDbSchema['id']['interactions'],
  JobSearchInteractionTransfer
> = async (id) => {
  const model = await jobSearchDb.interactions.get(id);
  if (!model) return null;
  return toInteractionTransfer({ ...model.data, id: model.ref.id });
};
