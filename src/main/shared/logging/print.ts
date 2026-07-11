import {
  ANSI_COLOUR_MAP,
  LOG_STATUS_CONFIG,
  UNICODE_ICON_MAP
} from "./config";
import {
  getLatestOperation,
  getOperation,
  getOperationSummary,
  isLatestOperation,
  isLineStart,
  LogOperationState,
  setLineStart,
  setSummaryHook
} from "./state";
import { getStdIoFormat } from "./utilities";

const stdio = (input: unknown) => process.stdout.write(
  getStdIoFormat(input)
);


const getStatus = (operation: LogOperationState) => operation.status
  ? LOG_STATUS_CONFIG[operation.status]
  : { icon: '(?)', colour: ANSI_COLOUR_MAP.reset };

const getTimestamp = (
  operation: LogOperationState
) => `[${operation.end || operation.updated || operation.start}]`;

const getIndentation = (
  operation: LogOperationState
) => ' '.repeat(operation.lineage.length);

const printStartLine = (operation: LogOperationState) => {
  const timestamp = getTimestamp(operation);

  const codeStr = `(${[
    operation.parent, UNICODE_ICON_MAP.arrowRight, '', operation.code
  ].join(' ')})`;

  const status = getStatus(operation);

  const startLine = [
    timestamp, getIndentation(operation),
    ANSI_COLOUR_MAP.purple, UNICODE_ICON_MAP.chevronRight, ANSI_COLOUR_MAP.reset,
    codeStr,
    status.colour, operation.title, ANSI_COLOUR_MAP.reset,
  ].join(' ');

  stdio(startLine);
  if (operation.status === 'awaiting') stdio('...');
  setLineStart(false);
};

const printEndLine = (operation: LogOperationState) => {
  const status = getStatus(operation);

  const endLine = [status.icon, ANSI_COLOUR_MAP.reset].join(' ') + '\n';

  stdio(endLine);
  setLineStart(true);
};

const printSubLine = (operation: LogOperationState) => {
  const timestamp = getTimestamp(operation);

  const status = getStatus(operation);

  const colour = status.colour;

  const startLine = [
    timestamp, getIndentation(operation) + '  ', UNICODE_ICON_MAP.arrowRight,
    colour, operation.message, ANSI_COLOUR_MAP.reset
  ].join(' ') + '\n';

  stdio(startLine);
};


// Scenario 1: Starting a new operation, but the old one isn't finished.
// Before:
// [...] > (parentcode1 > code1) Initialising asynchronously...

// After:
// [...] > (parentcode1 > code1) Initialising asynchronously... <hourglass>
// [...] > (parentcode2 > code2) Some other operation...

// Scenario 2: Updating a previous operation, but the latest isn't finished.
// Before:
// [...] > (parentcode1 > code1) Initialising asynchronously...

// After:
// [...] > (parentcode1 > code1) Initialising asynchronously... <hourglass>
// [...] > (parentcode2 > code2) Some other operation... <done>

// Scenario 3: Updating the latest operation status.
// Before:
// [...] > (parentcode1 > code1) Initialising asynchronously...

// After:
// [...] > (parentcode1 > code1) Initialising asynchronously... <updated-status>

// Scenario 4: Updating the latest operation message (prints a sub line).
// Before:
// [...] > (parentcode1 > code1) Initialising asynchronously...

// After:
// [...] > (parentcode1 > code1) Initialising asynchronously... <status>
// [...]   -> A fun fact about this operation.


// Scenario 5: Updating a previous operation message (prints a new line).
// Before:
// [...] > (parentcode1 > code1) Initialising asynchronously...

// After:
// [...] > (parentcode1 > code1) Initialising asynchronously... <code1 status>
// [...] > (parentcode2 > code2) Some other operation... <code2 status>
// [...]   -> A fun fact about this operation.

// Conditions:
// Whether this is the latest operation to update.
// Actions:
// End the line and start a new one if message, or status update or latest operation.


const printOperation = (code: string) => {
  const isLatest = isLatestOperation(code);
  const operation = getOperation(code);
  const isStart = isLineStart();

  if (isStart) {
    printStartLine(operation);
    if (isLatest) return;
  }

  printEndLine(operation);

  if (operation.message) {
    printSubLine(operation);
  }
};

const printCentre = (message: string) => {
  const columns = process.stdout.columns;
  const messageLength = message.length;
  const padding = Math.floor((columns - messageLength) / 2);
  stdio(`${'='.repeat(padding)} ${message} ${'='.repeat(padding)}\n`);
};

const printSummary = () => {
  const operations = getOperationSummary();

  if (operations.length === 0) return;

  const isStart = isLineStart();
  if (!isStart) {
    const latestOperation = getLatestOperation();
    if (latestOperation) printEndLine(latestOperation);
  }

  stdio('\n');
  stdio([
    ANSI_COLOUR_MAP.purple, UNICODE_ICON_MAP.chevronRight,
    ANSI_COLOUR_MAP.cyan, 'Summarising', ANSI_COLOUR_MAP.reset
  ].join(' '));
  stdio('\n\n');

  operations.forEach((operation) => {
    printStartLine(operation);
    printEndLine(operation);
    if (operation.message) {
      printSubLine(operation);
    }
  });
};

setSummaryHook(printSummary);

export const print = (code: string) => {
  printOperation(code);
};
