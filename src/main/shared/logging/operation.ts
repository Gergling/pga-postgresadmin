import { TaskStatus } from "./config";
import { print } from "./print";
import {
  getOperation,
  LogOperationState,
  startOperation,
  updateOperation
} from "./state";
import { LogOptions } from "./types";

type LogChild<T extends unknown | void> = (props: LogApi) => Promise<T>;

export type LogParent = <T extends unknown | void>(
  title: string,
  callback?: LogChild<T>,
  options?: LogOptions,
) => Promise<T>;

export type LogApi = {
  getRuntime: () => number,
  log: LogParent;
  operation: LogOperationState;
  options: LogOptions | undefined;
  setMessage: (message: string | string[] | object) => void;
  setStatus: (
    status: Exclude<TaskStatus, 'success'>,
    message?: string | string[] | object
  ) => void;
};


export const log: LogParent = async <T>(
  title: string, callback?: LogChild<T>, options?: LogOptions
): Promise<T> => {
  const code = startOperation(options?.parentCode, title, {
    debug: options?.debug,
    showSummaryChildren: options?.showSummaryChildren,
    showSummary: options?.showSummary,
  });

  if (!callback) {
    updateOperation(code, { status: 'information' });
    print(code);
    return undefined as T;
  }

  print(code);

  const getRuntime = (): number => {
    if (operation.duration !== undefined) return operation.duration;
    return new Date().getTime() - new Date(operation.start).getTime();
  }
  const logWrapper: LogParent = <U extends unknown | void>(
    title: string, callback: LogChild<U>, options?: LogOptions
  ) => log<U>(title, callback, { parentCode: code, ...options });
  const operation = getOperation(code);
  const setMessage: LogApi['setMessage'] = (message) => updateOperation(
    code, { message }
  );
  const setStatus: LogApi['setStatus'] = (status, message) => {
    if (message) return updateOperation(code, { status, message });
    return updateOperation(code, { status });
  }

  try {
    const result = await callback({
      getRuntime, log: logWrapper, operation, options, setMessage, setStatus
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
