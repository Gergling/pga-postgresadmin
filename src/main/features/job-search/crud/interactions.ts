import { createQueryList } from "../../../../shared/lib/typesaurus";
import { JobSearchArchetype } from "../../../../shared/features/job-search";
import { jobSearchDb } from "../schema";

// Fetch by many application ids.
export const fetchManyInteractions = async (
  applicationIds: JobSearchArchetype['id']['applications'][]
) => {
  const models = await jobSearchDb.interactions.query(($) => $.field('applicationId').in(applicationIds));

  // TODO: Replace with createQueryMap
  return new Map(models.map(({ data, ref: { id } }) => {
    const interaction: JobSearchArchetype['base']['interactions'] = {
      ...data,
      id,
    };
    return [id, interaction];
  }));
};

export const createInteraction = async (
  interaction: Omit<JobSearchArchetype['base']['interactions'], 'id'>
): Promise<JobSearchArchetype['base']['interactions']> => {
  const {
    person,
    ...rest
  } = interaction;

  const data: JobSearchArchetype['modelType']['interactions'] = {
    ...rest,
    personId: person?.id,
  };

  const ref = await jobSearchDb.interactions.add(data);

  return {
    ...interaction,
    id: ref.id,
  };
};

// TODO: Will probably want to "page" at some point, so find out best practise
// in firebase. In the meantime, there aren't many and we can sort on the frontend.
// Also, this one is not returning a map, because it's intended for use
// against the IPC layer. Might wanna think about architectural terms for how
// this differs from fetchManyInteractions, which I guess is just a query that
// follows up with a mapping immediately.
export const fetchRecentInteractions = async (): Promise<JobSearchArchetype['base']['interactions'][]> => {
  const models = await jobSearchDb.interactions.query(($) => []);
  return createQueryList<JobSearchArchetype, 'interactions'>(models);
};

export const updateInteraction = async (
  interaction: JobSearchArchetype['base']['interactions']
): Promise<JobSearchArchetype['base']['interactions']> => {
  const {
    id,
    person,
    ...rest
  } = interaction;

  const data: JobSearchArchetype['modelType']['interactions'] = {
    ...rest,
    personId: person?.id,
  };

  await jobSearchDb.interactions.update(id, data);

  return interaction;
};

