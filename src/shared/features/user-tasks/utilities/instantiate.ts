import {
  envelopeCodecFactory,
  EnvelopeFactory,
  EnvelopeInstance,
} from "@/shared/schema";
import {
  TaskRich,
  taskRichSchema,
  TaskSerialisation,
  taskSerialisationSchema,
  TaskWorkflowEvent,
} from "../schema";
import { reduceFsm } from "./fsm";
import { getVoteSummary } from "./votes-task";
import { codec } from "@/shared/utilities";
import { taskTimelineCodec } from "./timeline";

const taskEnvelopeCodec = envelopeCodecFactory(
  taskSerialisationSchema, taskRichSchema
);

const instantiatorFactory = EnvelopeInstance.from({
  rich: taskRichSchema,
  serialisation: taskSerialisationSchema,
  codec: codec<TaskRich, TaskSerialisation>({
    decode: (v) => {
      const timeline = taskTimelineCodec.decode(v.data.timeline);
      return taskEnvelopeCodec.decode({
        ...v, data: { ...v.data, timeline }
      });
    },
    encode: (v) => taskEnvelopeCodec.encode(v),
  }),
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
