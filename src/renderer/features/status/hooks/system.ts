import { trpcReact } from "@/renderer/libs/react-query";
import { useMemo } from "react";

// This queries for the system data and lists what should be displayed in the
// status. There is a separate pure function for that logic.
export const useStatusSystemItems = () => {
  const {
    data, error, status
  } = trpcReact.system.check.useQuery(undefined, { refetchInterval: 5000 });
  // const items = useMemo((): StatusItemProps[] => {
  //   const { db: statusData, resources } = data ?? {};
  //   if (!resources || !statusData) return [];
  //   return [
  //     { type: 'database', value: statusData },
  //     { type: 'cpu', value: resources.cpuAvailable },
  //     { type: 'memory', value: resources.memoryFreePercentage },
  //   ];
  // }, [data]);

  // Return the raw data.
  // Return the decisions made based on the data.
  // The component will render the components accordingly.
};
