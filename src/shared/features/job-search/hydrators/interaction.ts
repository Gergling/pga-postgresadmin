import { Optional } from "../../../../shared/types";
import { hydratorFactory } from "../../../utilities/initialiser";
import { JobSearchArchetype } from "../types";

type Props = Optional<JobSearchArchetype['base']['interactions'], 'id'>;

const initial: Optional<Props, 'id'> = {
  notes: '',
  timeperiod: { start: Date.now() },
  source: {
    entry: 'manual',
  },
};
export const hydrateJobSearchInteraction = hydratorFactory<Props>({
  initial,
  initialiser: (interaction) => {
    return {
      ...initial,
      ...interaction,
    };
  },
});
