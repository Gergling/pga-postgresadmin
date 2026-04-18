export const createIpcHandlerConfig = <
  T extends Record<string, (...params: any) => Promise<unknown>>
>(config: T) => config;
