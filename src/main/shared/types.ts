import { TimelineStatus } from "../../shared/features/crm";

export type DbTimeline = {
  start?: number | TimelineStatus;
  end?: number | TimelineStatus;
};

export type ReadList<T extends object, U = unknown> = (...args: U[]) => Promise<T[]>;
export type UpdateItem<T extends object> = (id: string, newData: Partial<T>) => Promise<T>;
