type ConnectionTypeOnline = 'ethernet' | 'wifi';
type ConnectionTypeOffline = 'offline';
export type ConnectionType = ConnectionTypeOnline | ConnectionTypeOffline;

type Dead = {
  category: 'dead';
  type: ConnectionType;
};

type Local = {
  category: 'local';
  jitter?: undefined;
  latency?: undefined;
  reliability: 0;
  type: ConnectionTypeOnline;
};

type Pipeline = {
  category: 'pipeline';
  jitter: number;
  latency: number;
  reliability: number;
  type: ConnectionTypeOnline;
};

export type SystemCheckNetworkResponse = Dead | Local | Pipeline;
