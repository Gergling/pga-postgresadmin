// TODO: Why are these in renderer? They should be in shared/database if they are here and used in renderer.
import { DatabaseItem, DatabaseResponseBase, DatabaseResponseSelect } from "../../renderer/shared/database/types";

type DatabaseProps<T extends Record<string, (...args: unknown[]) => unknown>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
};

export type IpcHandlerDatabase = DatabaseProps<{
  createDatabase: (dbName: string) => DatabaseResponseBase;
  selectDatabases: () => DatabaseResponseSelect<DatabaseItem>;
  // runQuery: (query: string) => Promise<DatabaseResponseBase>;
}>;
