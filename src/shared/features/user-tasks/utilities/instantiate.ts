import {
  envelopeCodecFactory,
  EnvelopeFactory,
  EnvelopeInstance,
} from "@/shared/schema";
import { codec } from "@/shared/utilities";
import {
  CouncilMemberNames,
  TaskRich,
  taskRichSchema,
  TaskSerialisation,
  taskSerialisationSchema,
  TaskWorkflowEvent,
} from "../schema";
import { PRIORITY_COUNCILLOR_VOTING_OPINION_ORDER } from "../constants";
import {
  reduceTaskRelationshipState,
  TaskRelationshipAction
} from "../state";
import { reduceFsm } from "./fsm";
import { taskTimelineCodec } from "./timeline";
import { getVoteSummary } from "./votes-task";

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

  get voteSummary() {
    return getVoteSummary(this.envelope);
  }
  get nextVoteCouncillor(): CouncilMemberNames | undefined {
    return PRIORITY_COUNCILLOR_VOTING_OPINION_ORDER.find(
      (councillor) => this.voteSummary.council.map[
        councillor
      ].summary.awaiting > 0
    );
  }

  link(action: TaskRelationshipAction) {
    const {
      data: { relationships }
    } = reduceTaskRelationshipState(this.envelope, action);
    return this.updateData({ relationships });
  }

  applyStatusEvent(event: TaskWorkflowEvent) {
    const status = reduceFsm(this.envelope.data.status, event);
    return this.updateData({ status });
  }
}

export const taskFactory = instantiatorFactory.instantiate(
  (params) => new Task(params)
);
