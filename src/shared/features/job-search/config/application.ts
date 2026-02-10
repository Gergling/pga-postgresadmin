// const createConfigFactory = <
//   PartialConfig extends object,
//   FullConfig extends PartialConfig = PartialConfig
// >(hydration: FullConfig = {} as FullConfig) => <ActualConfig extends PartialConfig>(
//   config: ActualConfig
// ): ActualConfig => ({
//   ...hydration,
//   ...config,
// });

const createConfig = <ActualConfig extends Readonly<{
  name: string;
  event: string;
  action?: string;
}[]>>(config: Readonly<ActualConfig>): ActualConfig => config;
// const createConfig = <ActualConfig extends {
//   name: string;
//   event: string;
//   action?: string;
// }[]>(config: ActualConfig): ActualConfig => config;

export const APPLICATION_PHASE = createConfig([
  {
    name: 'sourced',
    event: 'Contacted by agent, or suitable job listing found',
    action: 'Apply for the job',
  },
  {
    name: 'submitted',
    event: 'Application submitted',
    action: 'Wait for the verdict',
  },
  {
    name: 'scheduled',
    event: 'Interview or test deadline is scheduled',
    action: 'Prepare for interview or complete test',
  },
  {
    name: 'tested',
    event: 'Completed the test',
    action: 'Wait for the verdict',
  },
  {
    name: 'interviewed',
    event: 'Interviewed',
    action: 'Wait for the verdict',
  },
  {
    name: 'rejected',
    event: 'Rejected',
  },
  {
    name: 'successful',
    event: 'Successful',
  },
] as const);

export type ApplicationPhase = typeof APPLICATION_PHASE[number]['name'];

export const APPLICATION_PHASE_NEXT: Omit<
  Record<ApplicationPhase, ApplicationPhase[]>,
  'successful' | 'rejected'
> = {
  sourced: ['submitted'],
  submitted: ['scheduled', 'rejected'],
  scheduled: ['interviewed', 'tested'],
  tested: ['interviewed', 'rejected', 'successful'],
  interviewed: ['rejected', 'successful'],
};
