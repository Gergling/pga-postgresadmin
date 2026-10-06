type HistoryItemBase = {
  queued: number;
  activated: number;
  completed: number;
  duration: number;
};

type PhaseCompleted = 'completed' | 'failed';
type PhaseActive = 'active' | PhaseCompleted;
export type PhaseQueued = 'queued' | PhaseActive;
export type PhaseIdle = 'idle' | PhaseQueued;

type HistoryItemPhaseProp<
  K extends keyof HistoryItemBase,
  Status extends 'idle' | PhaseQueued,
  Phase extends PhaseQueued
> = Status extends Phase ? {
  [P in K]: number;
} : {
    [P in K]?: never;
  };

export type HistoryItemPhased<Status extends 'idle' | PhaseQueued> = {
  status: Status;
} & HistoryItemPhaseProp<'queued', Status, PhaseQueued>
  & HistoryItemPhaseProp<'activated', Status, PhaseActive>
  & HistoryItemPhaseProp<'completed', Status, PhaseCompleted>
  & HistoryItemPhaseProp<'duration', Status, PhaseCompleted>;

export type HistoryItem = {
  completed: number[]; failed: number; current: number[];
};

export type Queue = {
  active: string[];
  activity: number;
  hasActivity: boolean;
  hasQueue: boolean;
  history: Record<string, HistoryItem>;
  queue: string[];
};
