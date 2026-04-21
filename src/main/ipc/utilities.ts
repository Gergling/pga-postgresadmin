// TODO: I think this needs to go in src/libs/ipc.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CrudFunction<Args = any, Return = unknown> = (
  ...args: Args[]
) => Promise<Return>;
type CrudFunctionMap = Record<string, CrudFunction>;
type CrudKey = 'create' | 'read' | 'update' | 'delete';
type CrudConfig = Partial<Record<CrudKey, CrudFunctionMap>>;
type CreateCrudConfigProps<T extends CrudConfig> = {
  [K in keyof T]: K extends CrudKey ? T[K] : never
};

type IpcCrudFunctionMap<T extends CrudFunctionMap> = {
  [FunctionKey in keyof T]: (
    ...args: Parameters<T[FunctionKey]>
  ) => Awaited<ReturnType<T[FunctionKey]>>;
};
/**
 * @deprecated Use tRPC.router instead.
 */
export type IpcCrudConfig<T extends CrudConfig> = {
  [K in keyof T]: T[K] extends CrudFunctionMap 
    ? IpcCrudFunctionMap<T[K]> 
    : never;
};

/**
 * @deprecated Use tRPC.router instead.
 * @param props 
 * @returns 
 */
export const createCrudConfig = <T extends CrudConfig>(
  props: CreateCrudConfigProps<T>
): T => ({
  ...props,
});
