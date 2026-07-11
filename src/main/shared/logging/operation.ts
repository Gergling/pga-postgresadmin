import { TaskStatus } from "./config";
import { print } from "./print";
import {
  getOperation,
  LogOperationState,
  startOperation,
  updateOperation
} from "./state";

export type LogParent = <T extends unknown | void>(
  title: string,
  callback?: LogChild<T>,
  options?: LogOptions,
) => Promise<T>;
export type LogApi = {
  log: LogParent;
  operation: LogOperationState;
  setMessage: (message: string) => void;
  setStatus: (status: TaskStatus) => void;
};
type LogChild<T extends unknown | void> = (props: LogApi) => Promise<T>;
type LogOptions = {
  parentCode?: string;
};

export const log: LogParent = async <T>(
  title: string, callback?: LogChild<T>, options?: LogOptions
): Promise<T> => {
  const code = startOperation(options?.parentCode, title);

  if (!callback) {
    updateOperation(code, { status: 'success' });
    print(code);
    return undefined as T;
  }

  print(code);

  const logWrapper: LogParent = <U extends unknown | void>(
    title: string, callback: LogChild<U>, options?: LogOptions
  ) => log<U>(title, callback, { parentCode: code, ...options });
  const operation = getOperation(code);
  const setMessage = (message: string) => updateOperation(code, { message });
  const setStatus = (status: TaskStatus) => updateOperation(code, { status });

  try {
    const result = await callback({
      log: logWrapper, operation, setMessage, setStatus
    });
    updateOperation(code, { status: 'success' });
    return result;
  } catch (e) {
    updateOperation(code, { message: e, status: 'error' });
    throw e;
  } finally {
    print(code);
  }
};
