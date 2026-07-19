import { GeneralError } from "../schemas";
import { createErrorConfig, safeErrorParse } from "../utilities";
import {
  errorFilePermissionDeniedSchema,
  errorNodeErrnoExceptionSchema,
  ErrorFilePermissionDeniedSchema,
  ErrorNodeErrnoExceptionSchema,
} from "../schemas";

const errorObjectSchemas = createErrorConfig([
  {
    schema: errorFilePermissionDeniedSchema,
    transformer: ({
      path, syscall
    }: ErrorFilePermissionDeniedSchema, e: unknown) => ({
      cause: 'permission',
      operation: syscall,
      raw: e,
      scope: { type: 'file', path: path },
      text: [
        `Permission denied to read file or directory at ${path}`,
        `using ${syscall}.`
      ].join(' '),
    })
  },
  {
    schema: errorNodeErrnoExceptionSchema,
    transformer: ({
      code, errno, syscall
    }: ErrorNodeErrnoExceptionSchema, e: unknown) => ({
      cause: 'unknown',
      operation: syscall ?? '',
      raw: e,
      scope: { type: 'unknown' },
      text: `An uncategorised error occurred: ${code} (${errno})`
    })
  },
]);

export const transformObjectError = (error: object): GeneralError => {
  for (const { schema, transformer } of errorObjectSchemas) {
    const result = safeErrorParse(schema, error, transformer);
    if (result) return result;
  }

  return {
    cause: 'unknown',
    operation: 'unknown',
    raw: error,
    scope: { type: 'unknown' },
    text: `An uncategorised object error occurred: ${JSON.stringify(error)}`,
  };
}