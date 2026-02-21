const createEventConfig = <ActualConfig extends {
  name: string;
  label: string;
  agency: boolean;
}[]>(config: ActualConfig): ActualConfig => config;

export const APPLICATION_EVENTS = createEventConfig([
  {
    name: 'advanced',
    label: 'The client has advanced the application',
    agency: false,
  },
  {
    name: 'pursue',
    label: 'Pursue the application',
    agency: true,
  },
  {
    name: 'rejected',
    label: 'The client has rejected the application',
    agency: false,
  },
  {
    name: 'withdraw',
    label: 'Withdraw from the application',
    agency: true,
  },
] as const);

export type ApplicationEvent = typeof APPLICATION_EVENTS[number]['name'];
export type ApplicationPhase = {
  description: string;
  name: string;
};
const createConfig = <ActualConfig extends Readonly<ApplicationPhase[]>>(config: Readonly<ActualConfig>): ActualConfig => config;

export const APPLICATION_PHASE = createConfig([
  {
    name: 'sourced',
    description: 'Contacted by agent',
  },
  {
    name: 'queued',
    description: 'Suitable job listing found',
  },
  {
    name: 'submitted',
    description: 'Application has been submitted',
  },
  // Booked is computed by the presence of a scheduled interview. It probably shouldn't be stored.
  {
    name: 'booked',
    description: 'Interview is scheduled',
  },
  {
    name: 'equipped',
    description: 'Prepped for a scheduled interview',
  },
  {
    name: 'primed',
    description: 'Prepped for an imminent interview',
  },
  {
    name: 'issued',
    description: 'A test has been issued',
  },
  {
    name: 'tested',
    description: 'A test has been completed',
  },
  // This is computed by the presence of an ongoing interview.
  {
    name: 'interviewing',
    description: 'An interview is in progress right now',
  },
  // This is computed by the presence of a past interview.
  {
    name: 'interviewed',
    description: 'An interview has been completed and the results are being awaited',
  },
  {
    name: 'offered',
    description: 'An offer has been made',
  },
  {
    name: 'rejected',
    description: 'Rejected',
  },
  {
    name: 'successful',
    description: 'Successful',
  },
] as const);

export type ApplicationPhaseName = typeof APPLICATION_PHASE[number]['name'];
