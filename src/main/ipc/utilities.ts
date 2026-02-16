type CrudFunction<Args = unknown, Return = unknown> = (...args: Args[]) => Promise<Return>;
type CrudFunctionMap = Record<string, CrudFunction>;
type CrudKey = 'create' | 'read' | 'update' | 'delete';
type CrudConfig = Partial<Record<CrudKey, CrudFunctionMap>>;
type CreateCrudConfigProps<T extends CrudConfig> = { [K in keyof T]: K extends CrudKey ? T[K] : never };

type IpcCrudFunctionMap<T extends CrudFunctionMap> = {
  [FunctionKey in keyof T]: (
    ...args: Parameters<T[FunctionKey]>
  ) => Awaited<ReturnType<T[FunctionKey]>>;
};
export type IpcCrudConfig<T extends CrudConfig> = {
  [K in keyof T]: T[K] extends CrudFunctionMap 
    ? IpcCrudFunctionMap<T[K]> 
    : never;
};

export const createCrudConfig = <T extends CrudConfig>(
  props: CreateCrudConfigProps<T>
): T => ({
  ...props,
});
