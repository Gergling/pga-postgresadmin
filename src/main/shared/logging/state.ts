import { getIsoDateTimeString } from "@/shared/utilities";
import { INDENT, TaskStatus } from "./config";
import { getCode, shouldPropagateStatus } from "./utilities";

export type LogOperationState = {
  // Metadata
  children: string[];
  code: string;
  lineage: string[];
  parent: string;

  // State
  message?: string | Error;
  status: TaskStatus;
  title: string;

  // Timeframe
  start: string;
  updated?: string;
  end?: string;

  // Summary metadata
  summary: {
    showChildren: boolean;
  };
};

type LogOperationMap = Map<string, LogOperationState>;

const ROOT_CODE = 'root';

const state: {
  clean: boolean;
  increment: number;
  indentation: number;
  latest?: string; // Code for the latest pending operation
  lineStart: boolean;
  operations: LogOperationMap;
  queueClear: boolean;
  summaryHook: () => void;
} = {
  clean: false,
  increment: 0,
  indentation: 0,
  lineStart: true,
  operations: new Map<string, LogOperationState>(),
  queueClear: false,
  summaryHook: () => { },
};

export const setSummaryHook = (hook: () => void) => {
  state.summaryHook = hook;
}

const createCode = () => {
  const code = getCode(state.increment);
  state.increment += 1;
  return code;
};

export const startOperation = (
  parentCode: string = ROOT_CODE, title: string, options: {
    showSummaryChildren: boolean;
  }
) => {
  const code = createCode();
  const existing = state.operations.get(code);
  // TODO: If this comes up, we'll have to review the blocking probability of
  // the code generation.
  if (existing) {
    throw new Error(`Operation ${code} already exists`);
  }
  const parentOperation = state.operations.get(parentCode);
  const lineage = parentOperation ? [...parentOperation.lineage, parentCode] : [];

  state.operations.set(code, {
    children: [],
    code,
    lineage,
    parent: parentCode,
    summary: {
      showChildren: options.showSummaryChildren
        ?? parentOperation?.summary.showChildren
        ?? false,
    },
    start: getIsoDateTimeString(),
    status: 'awaiting',
    title,
  });
  state.latest = code;

  if (parentOperation) {
    state.operations.set(parentOperation.code, {
      ...parentOperation, children: [...parentOperation.children, code],
    });
  }

  return code;
};

type UpdateOperationOptionParams = Partial<
  Pick<LogOperationState, 'message' | 'title'> & { status: TaskStatus; }
>;

export const getOperation = (code: string) => {
  const operation = state.operations.get(code);
  if (!operation) throw new Error(`Operation ${code} not found`);
  return operation;
}

const propagateStatusToAncestors = (code: string, status: TaskStatus) => {
  const operation = getOperation(code);
  if (['awaiting', 'success'].includes(status)) return;

  if (!shouldPropagateStatus(operation.status, status)) return;

  const parentOperation = state.operations.get(operation.parent);
  if (!parentOperation) return;

  state.operations.set(parentOperation.code, {
    ...parentOperation, status
  });
  propagateStatusToAncestors(parentOperation.code, status);
}

export const updateOperation = (code: string, options: UpdateOperationOptionParams) => {
  const operation = getOperation(code);

  const updatedOperation: LogOperationState = {
    ...operation, ...options
  };

  const unchanged = Object.entries(updatedOperation).every(([key, value]) => {
    return operation[key as keyof LogOperationState] === value;
  });

  if (unchanged) return;

  state.clean = false;

  if (options.status === 'awaiting') {
    updatedOperation.updated = getIsoDateTimeString();
  } else {
    updatedOperation.end = getIsoDateTimeString();
  }

  state.operations.set(code, updatedOperation);
  propagateStatusToAncestors(code, updatedOperation.status);

  state.latest = code;

  // TODO: Summary output conditions could be a configuration.
  // Every time we change the operation state, we start a timeout for 2000ms.
  // After the timeout completes, compare to the previous state.
  // If the state hasn't changed, we run the summary print.
  setTimeout(() => {
    if (state.clean) return;
    state.clean = true;
    state.summaryHook();
  }, 2000);
};

export const setIsPrinted = () => state.clean = true;

export const clearOperations = () => {
  state.indentation = 0;
  state.latest = undefined;
  state.lineStart = true;
  state.operations.clear();
  state.queueClear = false;
}

export const getLatestOperation = () => {
  if (!state.latest) return;
  return getOperation(state.latest);
}
export const isLatestOperation = (code: string) => state.latest === code;

export const indentString = () => INDENT.repeat(state.indentation);

export const getOperationSummary = (code: string = ROOT_CODE): LogOperationState[] => {
  const isRoot = code === ROOT_CODE;
  const children = [...state.operations.values()].filter(
    (op) => {
      const isChild = op.parent === code;

      // We do not care about anything that isn't a direct child.
      if (!isChild) return false;

      // Otherwise, we always want top-level operations to show.
      if (isRoot) return true;

      // Otherwise, we only want to show operations that have a message,
      // or are not successful. This can include information
      return op.summary.showChildren || op.status !== 'success'
    }
  );
  const initial = isRoot ? [] : [getOperation(code)];
  return children.reduce(
    (results, { code }) => [...results, ...getOperationSummary(code)], initial
  );
};

export const isLineStart = () => state.lineStart;
export const setLineStart = (value: boolean) => state.lineStart = value;

export const isClearQueued = () => state.queueClear;
export const setIsClearQueued = (value: boolean) => state.queueClear = value;

export const isEveryOperationDone = () => {
  const allOperations = [...state.operations.values()];
  return allOperations.every((op) => op.status !== 'awaiting');
}
