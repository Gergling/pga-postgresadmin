import { Envelope, Mandatory } from "../../types";

export type DiaryEntryStatus =
  | 'draft'
  | 'committed'
  | 'processing'
  | 'processed'
  | 'rejected';

export interface DiaryEntryBase {
  id: string;
  text: string;

  // All entries are created as draft.
  // When done, user clicks to commit.
  // When the council has read the entry, it is processed.
  status: DiaryEntryStatus;

  // TODO: Needs more thought.
  // This shows where the entry was made from. Undefined means straight from the main diary interface.
  context?: {
    activeTaskId?: string;   // Link to a specific UserTask
    relatedEmailId?: string; // Link to an ingested email
    appContext?: string;     // e.g., "VS Code", "Chrome: HMRC Login"
    location?: string;       // e.g., "Studio", "Desk"
  };
}

export type DiaryEntry = DiaryEntryBase & {
  created: number;
}


export interface DiaryEntryDb extends DiaryEntryBase {
  created: number;
}

type IpcFunc<T extends unknown[] = unknown[], U = unknown> = (...args: T) => U;
type IpcFuncMap<
  T extends Record<string | number | symbol, IpcFunc> = Record<string | number | symbol, IpcFunc>
> = Record<keyof T, IpcFunc<Parameters<T[keyof T]>, ReturnType<T[keyof T]>>>;
type IpcFuncPromise<T extends IpcFunc = IpcFunc> = (...args: Parameters<T>) => Promise<ReturnType<T>>;
type IpcFuncPromiseMap<
  T extends IpcFuncMap
> = Record<keyof T, IpcFuncPromise<T[keyof T]>>;

export type DiaryIpcCreateEntry = (entry: Envelope<Omit<DiaryEntry, 'created' | 'id' | 'status'>>) => Envelope<DiaryEntry>;

export type DiaryIpc = {
  create: IpcFuncPromiseMap<{
    entry: DiaryIpcCreateEntry;
  }>;
  read: IpcFuncPromiseMap<{
    recent: () => DiaryEntry[];
  }>;
  update: IpcFuncPromiseMap<{
    set: (taskId: string, newData: Partial<DiaryEntry>, immediateConvergence?: boolean) => Mandatory<DiaryEntry, 'id'>;
  }>;
  // delete
};
