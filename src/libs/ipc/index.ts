// These types are used a couple of times, so they're shortened.
type ParamsBase = Record<string, unknown>;
type IpcInvocationConfigTemplate<T = unknown, U = unknown> = {
  [K: string]: (...args: T[]) => Promise<U>;
};

// A base type for simplifying the invocation config type.
export type IpcInvocationConfigBase<V extends ({
  [K: string]: (...args: unknown[]) => unknown;
})> = {
  [K in keyof V]: (...args: Parameters<V[K]>) => Promise<ReturnType<V[K]>>;
};

// The handler configuration type based on the invocation config type.
export type IpcHandlerConfig<
  IpcInvocationConfig extends IpcInvocationConfigTemplate,
  Params extends ParamsBase
> = {
  [K in keyof IpcInvocationConfig]: (
    params: (
      & {
        event: Electron.IpcMainInvokeEvent;
      }
      & Params
      & { args: Parameters<IpcInvocationConfig[K]>; }
    )
  ) => ReturnType<IpcInvocationConfig[K]>;
};

// A function for setting up the IPC handlers based on the config.
export const handleIpc = <
  IpcInvocationConfig extends IpcInvocationConfigTemplate,
  Params extends ParamsBase
>(
  config: IpcHandlerConfig<IpcInvocationConfig, Params>,
  ipcMain: Electron.IpcMain,
  additionalParameters?: Params
) => Object.entries(config).forEach(([ channelName, func ]) => {
  console.log(`Setting up IPC channel handler for ${channelName}.`);
  ipcMain.handle(channelName, (event, ...args) => func({
    event,
    args,
    ...additionalParameters
  }));
});

// A function for exposing IPC invocations to the renderer process.
export const preloadIpc = <
  IpcInvocationConfig extends IpcInvocationConfigTemplate,
  Params extends ParamsBase
>(
  ipcExposurePropertyName: string,
  config: IpcHandlerConfig<IpcInvocationConfig, Params>,
  contextBridge: Electron.ContextBridge,
  ipcRenderer: Electron.IpcRenderer,
) => {
  const invocations = Object
    .entries(config)
    .reduce((
      invocations,
      [invocationName]
    ) => ({
      ...invocations,
      [invocationName]: (
        ...args: unknown[] // The exposed type will expect whatever the
          // invocation type has defined once we've cast it.
      ) => ipcRenderer.invoke(invocationName, ...args),
    }), {} as IpcInvocationConfig);

  contextBridge.exposeInMainWorld(
    ipcExposurePropertyName,
    invocations
  );
};
