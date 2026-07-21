import path from 'path';
import { Optional } from '@/shared/types';
import {
  ExplorerFileRecordProps,
  ExplorerFileRecordQuery,
  explorerFileRecordSchema
} from "./schema";

type ConstructorInputParams = Optional<
  ExplorerFileRecordProps, 'action' | 'health' | 'updated'
>;
type ConstructorInputWithAbsolutePath = Omit<ConstructorInputParams, 'name' | 'parentPath'> & {
  absolutePath: string;
};

export class ExplorerFileRecord {
  data: ExplorerFileRecordProps;

  constructor(data: ConstructorInputWithAbsolutePath);
  constructor(data: ConstructorInputParams);
  constructor(data: ConstructorInputWithAbsolutePath | ConstructorInputParams) {
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

    // TODO: This is the perfect place to check for misformatted paths.
    //   return result.parentPath !== record.data.parentPath
    // || result.name !== record.data.name;
    // Should also check whether the absolute path matches this.path.
    // Doesn't need to throw an error, we can just store it against the state.

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
