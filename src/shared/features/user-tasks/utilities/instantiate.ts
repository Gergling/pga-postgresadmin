import {
  EnvelopeFactory,
  EnvelopeInstance,
} from "@/shared/schema";
import {
  taskRichSchema,
  taskSerialisationSchema,
  TaskWorkflowEvent,
} from "../schema";
import { reduceFsm } from "./fsm";
import { getVoteSummary } from "./votes-task";

const instantiatorFactory = EnvelopeInstance.from({
  rich: taskRichSchema,
  serialisation: taskSerialisationSchema
});

type Props = EnvelopeFactory<typeof instantiatorFactory>;

export class Task extends EnvelopeInstance<Props['base']> {
  view: 'edge' | 'outdated' | 'transitioning';
  constructor(params: Props['params']) {
    super(params);
    this.view = 'edge';
  }
  applyStatusEvent(event: TaskWorkflowEvent) {
    const status = reduceFsm(this.envelope.data.status, event);
    return this.updateData({ status });
  }
  get voteSummary() {
    return getVoteSummary(this.envelope);
  }
}

export const taskFactory = instantiatorFactory.instantiate(
  (params) => new Task(params)
);
