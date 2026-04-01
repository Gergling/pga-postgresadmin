export type Project = {
  name: string;
  path: string;
  git?: {
    latestCommitDate: number;
    staged: number;
  } | false;
};
