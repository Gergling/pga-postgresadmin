import path from 'path';
import { ExplorerFileRecordProps, ExplorerFileRecordQuery, explorerFileRecordSchema } from "./schema";

type ConstructorInputParams = Omit<
  ExplorerFileRecordProps, 'action' | 'health' | 'updated'
> & {
  absolutePath: string;
};
type ConstructorInputWithAbsolutePath = Omit<ConstructorInputParams, 'name' | 'parentPath'> & {
  absolutePath: string;
};

export class ExplorerFileRecord {
  data: ExplorerFileRecordProps;

  constructor(data: ConstructorInputWithAbsolutePath);
  constructor(data: ExplorerFileRecordProps);
  constructor(data: ConstructorInputWithAbsolutePath | ExplorerFileRecordProps) {
    if ('absolutePath' in data) {
      const { absolutePath, ...rest } = data;
      this.data = explorerFileRecordSchema.parse({
        ...rest,
        name: path.basename(absolutePath),
        parentPath: path.dirname(absolutePath),
      });
      return this;
    }
    this.data = explorerFileRecordSchema.parse(data);
  }

  get depth(): number {
    return this.data.parentPath.split(path.sep).length;
  }
  get path(): string {
    return path.resolve(this.data.parentPath, this.data.name);
  }
  get query(): ExplorerFileRecordQuery {
    const { name, parentPath } = this.data;
    return { name, parentPath };
  }

  merge(data: ExplorerFileRecordProps) {
    this.data = explorerFileRecordSchema.parse({ ...this.data, ...data });
    return this;
  }
};
