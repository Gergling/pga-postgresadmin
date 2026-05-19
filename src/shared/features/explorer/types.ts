export interface LockingProcess {
  fileName: string;
  processName: string;
  pid: number;
}

export interface DirentSummary {
  absolutePath: string;
  isDirectory: boolean;
  isFile: boolean;
  locks: LockingProcess[];
  name: string;
}

export interface DirectorySnapshot {
  currentPath: string;
  children: DirentSummary[];
  isLocked: boolean;
}
