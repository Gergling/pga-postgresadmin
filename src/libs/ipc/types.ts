export type IpcInvocationConfigTemplate<T = any, U = unknown> = {
  [K: string]: (...args: T[]) => Promise<U>;
};

export type CrudFunc = (...args: any[]) => Promise<any>;
export type IpcFunc<T extends CrudFunc> = (
  event: Electron.IpcMainInvokeEvent, ...args: Parameters<T>
) => ReturnType<T>;

