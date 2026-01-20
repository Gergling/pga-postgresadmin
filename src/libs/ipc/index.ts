// TODO: These should be abstracted out.
import { setupDockerChecklistSubscription } from "../../main/docker/ipc";
import { setupRitualTelemetrySubscription } from "../../main/features/ai/ipc";
import {
  CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST,
  CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY,
} from "../../shared/channels";
import { RitualTelemetrySubscriptionParams } from "../../shared/features/ai";
import { DockerChecklistSubscriptionParams } from "../../shared/docker-postgres/types";

// These types are used a couple of times, so they're shortened.
type ParamsBase = Record<string, unknown>;
type IpcInvocationConfigTemplate<T = unknown, U = unknown> = {
  [K: string]: (...args: T[]) => Promise<U>;
};

// Window events and handlers are a bit special, so we define them separately.
type EventSubscriptionHandlerProp = 'on';
const WINDOW_EVENT_HANDLER_PROP: EventSubscriptionHandlerProp = 'on';
export type EventSubscriptionHandler<EventSubscriptionChannel extends string> = (
  channel: EventSubscriptionChannel,
  listener: (params: {
    event: Electron.IpcRendererEvent;
    args: unknown[];
  }) => void
) => () => void;
export type EventSubscriptionHandlerMapping<EventSubscriptionChannel extends string = string> = {
  [K in EventSubscriptionHandlerProp]: EventSubscriptionHandler<EventSubscriptionChannel>;
};

type IpcInvocationConfigBaseFunction<T extends unknown[] = unknown[], U = unknown> = (...args: T) => U;

// A base type for simplifying the invocation config type.
export type IpcInvocationConfigBase<V extends ({
  [K: string]: IpcInvocationConfigBaseFunction;
})> = {
  [K in keyof V]: (...args: Parameters<V[K]>) => Promise<ReturnType<V[K]>>;
};

// The handler configuration type based on the invocation config type.
export type IpcHandlerConfig<
  IpcInvocationConfig extends Omit<IpcInvocationConfigTemplate, EventSubscriptionHandlerProp>,
  Params extends ParamsBase
> = {
  [K in keyof Omit<IpcInvocationConfig, EventSubscriptionHandlerProp>]: (
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
    {
      ...invocations,
      [WINDOW_EVENT_HANDLER_PROP]: (
        channel: string,
        listener: ({
          event,
          args
        }: {
          event: Electron.IpcRendererEvent;
          args: unknown[];
        }) => void
      ) => {
        // You can also add more security checks here if needed
        const subscription = (event: Electron.IpcRendererEvent, ...args: unknown[]) => listener({ event, args });
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      },
      // TODO: Improve specialised IPC calls.
      [CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST]: (
        listener: (update: DockerChecklistSubscriptionParams) => void
      ) => {
        console.log('subscribed to checklist: preload IPC edition')
        return setupDockerChecklistSubscription(ipcRenderer, listener);
      },
      [CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY]: (
        listener: (update: RitualTelemetrySubscriptionParams) => void
      ) => {
        console.log('subscribed to ritual telemetry: preload IPC edition')
        return setupRitualTelemetrySubscription(ipcRenderer, listener);
      },
    }
  );
};
