export type IpcHandlerDatabase = {
  runQuery: (query: string) => Promise<{ success: boolean; error?: string }>;
};