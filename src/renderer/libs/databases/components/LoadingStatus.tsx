import { useEffect } from "react";
import { Status } from "../../status/StatusComponent";
import { useIpc } from "../../../shared/ipc/hook";
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from "../../../../ipc";
import { useDockerStatus } from "../../docker";

export const DatabasesLoadingStatus = () => {
  const { on } = useIpc();
  const { recheck, statuses } = useDockerStatus();

  useEffect(() => {
    const removeListener = on(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED, recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, []);

  return (
    <>
      <h2>Startup Status</h2>
      <Status statuses={statuses} />
    </>
  );
};
