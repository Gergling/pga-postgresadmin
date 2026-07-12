import { TaskStatus } from "./config";
import { print } from "./print";
import {
  getOperation,
  LogOperationState,
  startOperation,
  updateOperation
} from "./state";

type LogOptions = {
  parentCode?: string;
  showSummaryChildren?: boolean;
};

type LogChild<T extends unknown | void> = (props: LogApi) => Promise<T>;

export type LogParent = <T extends unknown | void>(
  title: string,
  callback?: LogChild<T>,
  options?: LogOptions,
) => Promise<T>;

export type LogApi = {
  log: LogParent;
  operation: LogOperationState;
  setMessage: (message: string) => void;
  setStatus: (
    status: Exclude<TaskStatus, 'error' | 'success'>,
    message?: string
  ) => void;
};


export const log: LogParent = async <T>(
  title: string, callback?: LogChild<T>, options?: LogOptions
): Promise<T> => {
  const code = startOperation(options?.parentCode, title, {
    showSummaryChildren: options?.showSummaryChildren ?? false,
  });

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
  const setStatus: LogApi['setStatus'] = (status, message) => {
    if (message) return updateOperation(code, { status, message });
    return updateOperation(code, { status });
  }

  try {
    const result = await callback({
      log: logWrapper, operation, setMessage, setStatus
    });
    const completedOperation = getOperation(code);
    const status = completedOperation.status === 'awaiting'
      ? 'success'
      : completedOperation.status;
    updateOperation(code, { status });
    return result;
  } catch (e) {
    updateOperation(code, { message: e, status: 'error' });
    throw e;
  } finally {
    print(code);
  }
};
