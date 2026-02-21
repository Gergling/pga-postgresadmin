import { APPLICATION_EVENTS, APPLICATION_PHASE, ApplicationEvent, ApplicationPhase, ApplicationPhaseName } from "../../../../shared/features/job-search";

const applicationPhaseConfig: Partial<
  Record<ApplicationPhaseName, ApplicationPhaseName | ApplicationPhaseName[] | {
    description?: string;
    next: ApplicationPhaseName;
  }>
> = {
  // For reference, all events and actions can be categorised as: "rejected" | "advanced" | "pursue" | "withdraw"
  // Sourcing an application will be a Librarian triage later, based on the
  // email fragments and diary entries.
  // In the meantime, a special agency dashboard might be a good choice. It can
  // provide a list of my "best" agencies.
  // There's a chat on ChatGPT about rating agencies.
  sourced: {
    description: 'Reply affirmation with the resourcer',
    next: 'submitted',
  },
  // Queuing an application could have its own dashboard.
  // This is where the cover letter generator comes in.
  // The status will have to be advanced manually.
  queued: {
    // This has its own action because applications can have cover letters
    // and other hoops to jump through. This means it's potentially a high-friction/low-momentum step.
    description: 'Apply for the position',
    next: 'submitted',
  },
  // submitted: ['booked', 'issued'], // Technically could also be successful, which means we can probably omit these.
  // The booked status should be computed by the fact that there is an interview scheduled for the application.
  // In theory, this doesn't need to be stored. We stay at "submitted", and the other factors can compute.
  booked: {
    description: 'Complete the initial interview preparation',
    next: 'equipped',
  },
  equipped: {
    description: 'Complete the preparation for an imminent interview',
    next: 'primed',
  },
  // These are technically triggered by time, and will require special logic if
  // we're doing that, so these should all be computed.
  primed: ['interviewing', 'interviewed'],
  interviewing: 'interviewed',
  // interviewed: ['booked', 'issued', 'successful'],
  // This can be computed if a test is logged against the application.
  issued: {
    description: 'Complete the test',
    next: 'tested',
  },
  // tested: ['booked', 'issued', 'successful'],
};

// TODO: "Multiply out" the application phase config states for events so that
// all the applicable properties are filled in.
// All states automatically come with default reject and withdraw options.
// The descriptions would be along the lines of:
// "Withdraw from the application process and notify [point(s) of contact]".
// Ideally this would make the points of contact highlighted. Ideally notes
// should be left for later analysis on the "why".
// "The application was rejected." This can probably be discerned by the
// latest application stage, but notes should be left against the application
// for later analysis.
// State is always "actionable" if there is a "pursue" step, otherwise it's always "pending review".
type BaseEvent = {
  name: ApplicationEvent;
  description: string;
  next: ApplicationPhaseName[];
};
const baseEventConfig: BaseEvent[] = APPLICATION_EVENTS
  .filter(({ name }) => !['pursue'].includes(name))
  .map(({ label, name }): BaseEvent => ({
    description: label,
    name,
    next: name === 'advanced' ? ['booked', 'issued', 'successful'] : ['rejected'],
  }));

type Phase = Omit<ApplicationPhase, 'name'> & {
  name: ApplicationPhaseName;
  next: BaseEvent[];
};
export const APPLICATION_PHASE_FSM = APPLICATION_PHASE.reduce((acc, { name: phase, description }) => {
  const eventConfig = applicationPhaseConfig[phase];
  const basePhase: Phase = {
    description,
    name: phase,
    next: baseEventConfig,
  };

  // An undefined eventConfig means the next status isn't anything special.
  if (!eventConfig) return {
    ...acc,
    [phase]: basePhase,
  };

  // A string eventConfig is configured for when the application has advanced by some other means.
  if (typeof eventConfig === 'string') return {
    ...acc,
    [phase]: {
      ...basePhase,
      next: basePhase.next.map((event) => (event.name === 'advanced' ? {
        ...event,
        next: [eventConfig]
      } : event)),
    },
  };

  // Also applies to an array.
  if (Array.isArray(eventConfig)) return {
    ...acc,
    [phase]: {
      ...basePhase,
      next: basePhase.next.map((event) => (event.name === 'advanced' ? {
        ...event,
        next: eventConfig,
      } : event)),
    },
  };

  // These are actionable phases, in which action can be taken to pursue the next phase.
  return {
    ...acc,
    [phase]: {
      ...basePhase,
      next: basePhase.next.map((event) => ({
        ...event,
        description: eventConfig.description ?? event.description,
        name: event.name === 'advanced' ? 'pursue' : event.name,
        next: [eventConfig.next]
      })),
    },
  };
}, {} as Record<ApplicationPhaseName, Phase>);
