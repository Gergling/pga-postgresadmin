import { SystemCheckNetworkResponse, transformSystemCheckNetworkResponse } from "@/shared/features/system";
import { burstPings, getNetworkInterfaceType } from "../extractors";
import { debounce, wait } from "@/shared/utilities";

type Snapshot = {
  response: SystemCheckNetworkResponse;
  timestamp: number;
};

const SNAPSHOT_TTL = 1000 * 60 * 5; // 5 minutes of snapshots.

const systemCheckNetwork = async () => {
  const type = getNetworkInterfaceType();
  const { target, burst } = await burstPings();
  return transformSystemCheckNetworkResponse({
    burst, type, router: false, target
  });
};

// Should debounce the connection to 10 seconds minimum.
// Low activity can go up to 30 seconds.
// Keep the data for the last few minutes.
// How much data should be kept?

const addSnapshot = (
  snapshots: Snapshot[],
  response: SystemCheckNetworkResponse
): Snapshot[] => {
  return [
    { response, timestamp: Date.now() },
    ...snapshots.filter(
      (snapshot) => snapshot.timestamp >= Date.now() - SNAPSHOT_TTL
    )
  ];
};

const data: {
  delay: number;
  snapshots: Snapshot[];
  status: 'idle' | 'active' | 'pending';
} = {
  delay: 30000,
  snapshots: [],
  status: 'idle',
};

const isPending = () => data.status === 'pending';

// We debounce to 10 seconds to avoid creating a localized DoS attack.
export const runSnapshot = debounce(async () => {
  data.status = 'active';

  const network = await systemCheckNetwork();
  data.snapshots = addSnapshot(data.snapshots, network);

  // If another snapshot has been started, we may be in the pending phase
  // already. If so, we can skip this.
  if (isPending()) return;
  data.status = 'pending';
  await wait(data.delay);
}, 10000);

export const getSystemNetworkSnapshot = (

): SystemCheckNetworkResponse => data.snapshots[0].response;

runSnapshot();
