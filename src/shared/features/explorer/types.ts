export interface LockingProcess {
  fileName: string;
  processName: string;
  pid: number;
}

export type FileUnitTestOperation = 'none' | 'create' | 'update';

export interface DirentSummary {
  absolutePath: string;
  meta: {
    isDirectory: boolean;
    isFile: boolean;
    isTsSourceFile: boolean;
    isTsTestFile: boolean;
    testFileName?: string;
  };
  name: string;
  options: {
    expand: boolean;
    testable: FileUnitTestOperation;
  };
  status: {
    locks: LockingProcess[];
  };
}

export interface DirectorySnapshot {
  currentPath: string;
  children: DirentSummary[];
  isLocked: boolean;
}
